import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { api, absoluteUrl } from '../../../api/client';

import PosterImagesSection from './components/PosterImagesSection';
import CourseMetadataSection from './components/CourseMetadataSection';
import ChaptersSection from './components/ChaptersSection';

import { styles, COLORS } from './AdminOnlineCourseDetailsEditor.styles';

function convertMinorToPrice(priceMinor) {
  const amount = Number(priceMinor);

  if (!Number.isFinite(amount)) {
    return '0';
  }

  const majorAmount = amount / 100;

  return Number.isInteger(majorAmount)
    ? String(majorAmount)
    : majorAmount.toFixed(2);
}

function normalizeSubjectIds(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .map(value => Number(value))
        .filter(value => Number.isFinite(value)),
    ),
  );
}

function mergeSubjects(existingSubjects, newSubjects) {
  const subjectMap = new Map();

  [
    ...(Array.isArray(existingSubjects) ? existingSubjects : []),

    ...(Array.isArray(newSubjects) ? newSubjects : []),
  ].forEach(subject => {
    if (!subject?.id) {
      return;
    }

    subjectMap.set(String(subject.id), subject);
  });

  return Array.from(subjectMap.values());
}

export default function AdminOnlineCourseDetailsEditor({ route, navigation }) {
  const courseId = route?.params?.courseId;

  const [course, setCourse] = useState(null);

  const [form, setForm] = useState({
    title: '',
    price: '0',
    currency: '₹',
    description: '',
    isPublished: false,

    classGroups: [],
    categories: [],
    tags: [],
    subjectIds: [],
    selectedSubjectIds: [],
  });

  const [subjectOptions, setSubjectOptions] = useState([]);

  const [attachedSubjectIds, setAttachedSubjectIds] = useState([]);

  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const [subjectErrorMessage, setSubjectErrorMessage] = useState('');

  const [deletingCourse, setDeletingCourse] = useState(false);

  const [updatingPublishStatus, setUpdatingPublishStatus] = useState(false);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [savingCourse, setSavingCourse] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const populateForm = useCallback(response => {
    const attachedSubjects = Array.isArray(response?.courses)
      ? response.courses
      : [];

    const existingSubjectIds = normalizeSubjectIds(
      attachedSubjects.map(subject => subject?.id),
    );

    setCourse(response);

    setAttachedSubjectIds(existingSubjectIds);

    setForm({
      title: String(response?.title || ''),

      price: convertMinorToPrice(response?.price_minor),

      currency: String(response?.currency || '₹'),

      description: String(response?.description || ''),

      isPublished: Boolean(response?.is_published),

      classGroups: Array.isArray(response?.class_groups)
        ? response.class_groups
        : [],

      categories: Array.isArray(response?.categories)
        ? response.categories
        : [],

      tags: Array.isArray(response?.tags) ? response.tags : [],

      subjectIds: existingSubjectIds,

      selectedSubjectIds: existingSubjectIds,
    });
  }, []);

  const loadSubjectOptions = useCallback(async () => {
    try {
      setLoadingSubjects(true);
      setSubjectErrorMessage('');

      const perPage = 20;

      let page = 1;
      let totalCount = 0;
      let allSubjects = [];

      do {
        const response = await api(
          `/api/courses?q=&page=${page}&per_page=${perPage}`,
          {
            method: 'GET',
          },
        );

        const currentRows = Array.isArray(response?.rows) ? response.rows : [];

        totalCount = Number(response?.count) || currentRows.length;

        allSubjects = [...allSubjects, ...currentRows];

        if (currentRows.length === 0 || currentRows.length < perPage) {
          break;
        }

        page += 1;
      } while (allSubjects.length < totalCount);

      const subjectMap = new Map();

      allSubjects.forEach(subject => {
        if (!subject?.id) {
          return;
        }

        /*
         * CourseMetadataSection currently reads subject.name.
         * The subject listing API returns subject.title,
         * so both properties are preserved here.
         */
        const normalizedSubject = {
          ...subject,

          name: String(subject?.title || subject?.name || 'Untitled Subject'),
        };

        subjectMap.set(String(subject.id), normalizedSubject);
      });

      const uniqueSubjects = Array.from(subjectMap.values()).sort(
        (first, second) =>
          String(first?.title || first?.name || '').localeCompare(
            String(second?.title || second?.name || ''),
          ),
      );

      setSubjectOptions(uniqueSubjects);
    } catch (error) {
      console.log('Subject list API error:', error);

      setSubjectErrorMessage(error?.message || 'Could not load subjects.');
    } finally {
      setLoadingSubjects(false);
    }
  }, []);

  const loadCourse = useCallback(
    async (mode = 'initial') => {
      if (!courseId) {
        setErrorMessage('Course ID was not provided.');

        setLoading(false);
        return;
      }

      try {
        if (mode === 'refresh') {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setErrorMessage('');

        const response = await api(`/api/ott/ottcourses/${courseId}`, {
          method: 'GET',
        });

        populateForm(response);
      } catch (error) {
        console.log('Course details API error:', error);

        setErrorMessage(error?.message || 'Could not load course details.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [courseId, populateForm],
  );

  useFocusEffect(
    useCallback(() => {
      loadCourse('initial');
      loadSubjectOptions();
    }, [loadCourse, loadSubjectOptions]),
  );

  const posterImages = useMemo(() => {
    const images = Array.isArray(course?.images) ? course.images : [];

    return images.map(image => ({
      ...image,

      displayUrl:
        image?.public_url ||
        (image?.path ? absoluteUrl(`/storage/${image.path}`) : null),
    }));
  }, [course]);

  const updateField = useCallback((fieldName, value) => {
    setForm(previousForm => {
      if (previousForm[fieldName] === value) {
        return previousForm;
      }

      return {
        ...previousForm,
        [fieldName]: value,
      };
    });
  }, []);

  const handleChaptersChange = useCallback(updatedChapters => {
    setCourse(previousCourse => {
      if (!previousCourse) {
        return previousCourse;
      }

      return {
        ...previousCourse,
        chapters: updatedChapters,
      };
    });
  }, []);

  const handlePosterImagesChange = useCallback(updatedImages => {
    setCourse(previousCourse => {
      if (!previousCourse) {
        return previousCourse;
      }

      return {
        ...previousCourse,

        images: Array.isArray(updatedImages) ? updatedImages : [],
      };
    });
  }, []);

  async function handlePublishStatusChange(nextPublishedStatus) {
    if (updatingPublishStatus || !courseId) {
      return;
    }

    const nextStatus = Boolean(nextPublishedStatus);

    const payload = {
      is_published: nextStatus,
      published_at: null,
    };

    try {
      setUpdatingPublishStatus(true);

      console.log('Course publish status payload:', payload);

      const response = await api(`/api/ott/ottcourses/${courseId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      /*
       * Preserve chapters, images and other related data
       * because the PATCH response contains only course fields.
       */
      setCourse(previousCourse => ({
        ...(previousCourse || {}),
        ...(response || {}),
      }));

      setForm(previousForm => ({
        ...previousForm,

        isPublished: response?.is_published ?? nextStatus,
      }));
    } catch (error) {
      console.log('Course publish status API error:', error);

      Alert.alert(
        nextStatus ? 'Could not publish course' : 'Could not unpublish course',

        error?.message || 'The course publish status could not be updated.',
      );
    } finally {
      setUpdatingPublishStatus(false);
    }
  }

  async function handleSave() {
    if (savingCourse || !courseId) {
      return;
    }

    const cleanTitle = form.title.trim();
    const cleanDescription = form.description.trim();
    const numericPrice = Number(form.price);

    if (!cleanTitle) {
      Alert.alert('Invalid Course', 'Course title is required.');
      return;
    }

    if (
      !form.price.trim() ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      Alert.alert('Invalid Price', 'Please enter a valid course price.');
      return;
    }

    const selectedSubjectIds = normalizeSubjectIds(form.selectedSubjectIds);

    const subjectsChanged = !areSubjectIdsEqual(
      selectedSubjectIds,
      attachedSubjectIds,
    );

    const payload = {
      title: cleanTitle,
      description: cleanDescription,
      price: numericPrice,
    };

    let detailsSaved = false;

    try {
      setSavingCourse(true);

      console.log('[COURSE UPDATE PAYLOAD]', payload);

      // API 1: Update course details
      const response = await api(`/api/ott/ottcourses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response?.id) {
        throw new Error('Course update could not be confirmed.');
      }

      detailsSaved = true;

      setCourse(previousCourse => ({
        ...(previousCourse || {}),
        ...response,
      }));

      // API 2: Sync subjects only when changed
      if (subjectsChanged) {
        const subjectPayload = {
          course_ids: selectedSubjectIds,
        };

        console.log('[COURSE SUBJECT PAYLOAD]', subjectPayload);

        const subjectResponse = await api(
          `/api/ott/ottcourses/${courseId}/subjects`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subjectPayload),
          },
        );

        if (!subjectResponse || !Array.isArray(subjectResponse.courses)) {
          throw new Error('Subject update could not be confirmed.');
        }

        setAttachedSubjectIds(
          normalizeSubjectIds(
            subjectResponse.courses.map(subject => subject.id),
          ),
        );
      }

      // API 3: Reload complete course details
      const updatedCourse = await api(`/api/ott/ottcourses/${courseId}`, {
        method: 'GET',
      });

      if (!updatedCourse?.id) {
        throw new Error('Could not reload updated course details.');
      }

      populateForm(updatedCourse);

      Alert.alert(
        'Course Updated',
        subjectsChanged
          ? 'Course details and subjects were updated successfully.'
          : 'Course details were updated successfully.',
      );
    } catch (error) {
      console.log('[COURSE SAVE ERROR]', {
        message: error?.message,
        status: error?.status,
        payload: error?.payload,
      });

      Alert.alert(
        detailsSaved ? 'Course Partially Updated' : 'Could not update course',
        detailsSaved
          ? `Course details were saved, but a subsequent operation failed: ${
              error?.message || 'Unknown error'
            }. Refresh the page to verify the saved changes.`
          : error?.message || 'The course details could not be updated.',
      );
    } finally {
      setSavingCourse(false);
    }
  }

  function handleDelete() {
    if (deletingCourse || savingCourse || updatingPublishStatus || !courseId) {
      return;
    }

    const courseTitle = form.title.trim() || 'this course';

    Alert.alert(
      'Delete Course',

      `Delete “${courseTitle}” and all its chapters/materials? This cannot be undone.`,

      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            try {
              setDeletingCourse(true);

              await api(`/api/ott/ottcourses/${courseId}`, {
                method: 'DELETE',
              });

              /*
               * Return to the listing screen after deletion.
               */
              navigation.navigate('AdminOnlineCoursesEditor', {
                refreshToken: Date.now(),

                deletedCourseId: courseId,
              });
            } catch (error) {
              console.log('Course delete API error:', error);

              Alert.alert(
                'Could not delete course',

                error?.message || 'The course could not be deleted.',
              );
            } finally {
              setDeletingCourse(false);
            }
          },
        },
      ],
    );
  }

  if (loading && !course) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />

          <Text style={styles.loadingText}>Loading course details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage && !course) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>

          <Text style={styles.errorTitle}>Could not load course</Text>

          <Text style={styles.errorDescription}>{errorMessage}</Text>

          <Text style={styles.retryText} onPress={() => loadCourse('initial')}>
            Retry
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const headerComponent = (
    <View style={styles.headerContent}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Course Editor</Text>

        <Text style={styles.courseMeta}>Course ID: {courseId}</Text>
      </View>

      {errorMessage ? (
        <View style={styles.inlineError}>
          <Text style={styles.inlineErrorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <PosterImagesSection
        courseId={courseId}
        images={posterImages}
        courseTitle={form.title}
        onImagesChange={handlePosterImagesChange}
      />

      <CourseMetadataSection
        courseId={courseId}
        form={form}
        subjectOptions={subjectOptions}
        attachedSubjectIds={attachedSubjectIds}
        loadingSubjects={loadingSubjects}
        subjectErrorMessage={subjectErrorMessage}
        onRetrySubjects={loadSubjectOptions}
        onChangeField={updateField}
        onSave={handleSave}
        onDelete={handleDelete}
        deleting={deletingCourse}
        saving={savingCourse}
        updatingPublishStatus={updatingPublishStatus}
        onPublishStatusChange={handlePublishStatusChange}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ChaptersSection
        courseId={courseId}
        chapters={course?.chapters || []}
        onChaptersChange={handleChaptersChange}
        headerComponent={headerComponent}
        refreshing={refreshing}
        onRefresh={() => loadCourse('refresh')}
      />
    </SafeAreaView>
  );
}

function areSubjectIdsEqual(firstIds, secondIds) {
  const first = normalizeSubjectIds(firstIds).sort((a, b) => a - b);

  const second = normalizeSubjectIds(secondIds).sort((a, b) => a - b);

  if (first.length !== second.length) {
    return false;
  }

  return first.every((id, index) => id === second[index]);
}
