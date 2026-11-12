import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api, getToken, getBase } from '../../../api/client';
import styles from './AdminHomeworkForm.styles';
import AttachOptionalSection from './../../Homework/AttachOptionalSection';
import ReactNativeBlobUtil from 'react-native-blob-util';

function normalizeTeacher(item) {
  return {
    id: Number(item?.id),

    name: String(item?.name || item?.email || 'Unnamed user'),

    email: String(item?.email || ''),

    role: String(item?.role || item?.primary_role || 'teacher').toLowerCase(),
  };
}

function buildTeacherList(rows, currentUser, homework = null) {
  const map = new Map();

  (Array.isArray(rows) ? rows : [])
    .map(normalizeTeacher)
    .filter(item => Number.isFinite(item.id))
    .forEach(item => {
      map.set(item.id, item);
    });

  const currentUserId = Number(currentUser?.id);

  const currentRole = String(
    currentUser?.role || currentUser?.primary_role || '',
  ).toLowerCase();

  if (
    Number.isFinite(currentUserId) &&
    ['admin', 'teacher'].includes(currentRole)
  ) {
    map.set(
      currentUserId,
      normalizeTeacher({
        ...currentUser,
        role: currentRole,
      }),
    );
  }

  const ownerId = Number(homework?.created_by);

  if (Number.isFinite(ownerId) && !map.has(ownerId)) {
    map.set(
      ownerId,
      normalizeTeacher({
        id: ownerId,

        name:
          homework?.created_by_name ||
          homework?.created_by_email ||
          'Current owner',

        email: homework?.created_by_email || '',

        role: 'teacher',
      }),
    );
  }

  return Array.from(map.values());
}

function normalizeClass(item) {
  return {
    id: Number(item?.id),
    name: String(item?.name || item?.class_name || 'Unnamed class'),
  };
}

function normalizeCourse(item) {
  return {
    id: Number(item?.id),
    title: String(item?.title || item?.course_title || 'Untitled course'),
  };
}

function SelectModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
  loading = false,
  emptyText = 'No options available.',
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />

        <View style={styles.selectModal}>
          <Text style={styles.selectModalTitle}>{title}</Text>

          {loading ? (
            <View style={styles.modalLoading}>
              <ActivityIndicator size="large" />

              <Text style={styles.modalLoadingText}>Loading options...</Text>
            </View>
          ) : options.length === 0 ? (
            <View style={styles.modalEmpty}>
              <Text style={styles.modalEmptyText}>{emptyText}</Text>
            </View>
          ) : (
            <FlatList
              data={options}
              keyExtractor={item => String(item.value)}
              style={styles.selectOptionsList}
              renderItem={({ item }) => {
                const selected = String(item.value) === String(selectedValue);

                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item.value);
                      onClose();
                    }}
                    style={({ pressed }) => [
                      styles.selectOption,

                      selected && styles.selectOptionSelected,

                      pressed && styles.controlPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,

                        selected && styles.selectOptionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>

                    {selected ? (
                      <Text style={styles.selectOptionCheck}>✓</Text>
                    ) : null}
                  </Pressable>
                );
              }}
            />
          )}

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.modalCloseButton,
              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function formatDateTime(date) {
  if (!(date instanceof Date)) {
    return 'Select date and time';
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function AdminHomeworkForm({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const mode = route?.params?.mode === 'edit' ? 'edit' : 'add';

  const isEdit = mode === 'edit';

  const homework = route?.params?.homework || null;

  const currentUser = route?.params?.currentUser || null;

  const homeworkMeta = route?.params?.homeworkMeta || {};

  const currentUserId = Number(currentUser?.id);

  const homeworkId = Number(homework?.id);

  const [teachers, setTeachers] = useState(() =>
    buildTeacherList(
      homeworkMeta?.teachers,
      currentUser,
      isEdit ? homework : null,
    ),
  );

  const [classes, setClasses] = useState([]);

  const [courses, setCourses] = useState([]);

  const [attachments, setAttachments] = useState([]);

  const [newAttachments, setNewAttachments] = useState([]);

  const [attachmentResetKey, setAttachmentResetKey] = useState(0);

  const [uploadingAttachments, setUploadingAttachments] = useState(false);

  const initialTeacherId = useMemo(() => {
    const ownerId = Number(homework?.created_by);

    if (isEdit && Number.isFinite(ownerId)) {
      return ownerId;
    }

    return Number.isFinite(currentUserId) ? currentUserId : null;
  }, [currentUserId, homework, isEdit]);

  const [selectedTeacherId, setSelectedTeacherId] = useState(initialTeacherId);

  const [selectedClassId, setSelectedClassId] = useState(
    isEdit ? Number(homework?.class_group_id) : null,
  );

  const [selectedCourseId, setSelectedCourseId] = useState(
    isEdit ? Number(homework?.course_id) : null,
  );

  const [title, setTitle] = useState(
    isEdit ? String(homework?.name || '') : '',
  );

  const [dueAt, setDueAt] = useState(() => {
    if (isEdit && homework?.ends_at) {
      const value = new Date(homework.ends_at);

      if (!Number.isNaN(value.getTime())) {
        return value;
      }
    }

    return new Date();
  });

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const [teacherModalVisible, setTeacherModalVisible] = useState(false);

  const [courseModalVisible, setCourseModalVisible] = useState(false);

  const [classModalVisible, setClassModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);

  const [resourcesLoading, setResourcesLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [downloadingAttachmentId, setDownloadingAttachmentId] = useState(null);

  const [attachmentAuthToken, setAttachmentAuthToken] = useState(null);

  const teacherOptions = useMemo(
    () =>
      teachers.map(item => ({
        value: item.id,
        label: `${item.name} (${item.role})`,
      })),
    [teachers],
  );

  const classOptions = useMemo(
    () =>
      classes.map(item => ({
        value: item.id,
        label: item.name,
      })),
    [classes],
  );

  const courseOptions = useMemo(
    () =>
      courses.map(item => ({
        value: item.id,
        label: item.title,
      })),
    [courses],
  );

  const selectedTeacherLabel = useMemo(() => {
    const item = teachers.find(teacher => teacher.id === selectedTeacherId);

    return item ? `${item.name} (${item.role})` : 'Select...';
  }, [selectedTeacherId, teachers]);

  const selectedClassLabel = useMemo(
    () =>
      classes.find(item => item.id === selectedClassId)?.name ||
      homework?.class_name ||
      'Select...',
    [classes, homework, selectedClassId],
  );

  const selectedCourseLabel = useMemo(
    () =>
      courses.find(item => item.id === selectedCourseId)?.title ||
      homework?.course_title ||
      'Select...',
    [courses, homework, selectedCourseId],
  );

  const loadTeacherResources = useCallback(
    async (
      teacherId,
      { preserveClassId = null, preserveCourseId = null } = {},
    ) => {
      const normalizedTeacherId = Number(teacherId);

      function normalizeResources(classRows, courseRows) {
        let nextClasses = (Array.isArray(classRows) ? classRows : [])
          .map(normalizeClass)
          .filter(item => Number.isFinite(item.id));

        let nextCourses = (Array.isArray(courseRows) ? courseRows : [])
          .map(normalizeCourse)
          .filter(item => Number.isFinite(item.id));

        const preservedClassId = Number(preserveClassId);

        if (
          Number.isFinite(preservedClassId) &&
          !nextClasses.some(item => item.id === preservedClassId)
        ) {
          nextClasses = [
            ...nextClasses,
            {
              id: preservedClassId,

              name: homework?.class_name || 'Current class',
            },
          ];
        }

        const preservedCourseId = Number(preserveCourseId);

        if (
          Number.isFinite(preservedCourseId) &&
          !nextCourses.some(item => item.id === preservedCourseId)
        ) {
          nextCourses = [
            ...nextCourses,
            {
              id: preservedCourseId,

              title: homework?.course_title || 'Current course',
            },
          ];
        }

        setClasses(nextClasses);
        setCourses(nextCourses);

        return {
          classes: nextClasses,
          courses: nextCourses,
        };
      }

      if (!Number.isFinite(normalizedTeacherId)) {
        return normalizeResources(homeworkMeta?.classes, homeworkMeta?.courses);
      }

      try {
        setResourcesLoading(true);

        const response = await api(
          `/api/homeworks/resources-for-teacher/${normalizedTeacherId}`,
        );

        const nextClasses = (
          Array.isArray(response?.classes) ? response.classes : []
        )
          .map(normalizeClass)
          .filter(item => Number.isFinite(item.id));

        const nextCourses = (
          Array.isArray(response?.courses) ? response.courses : []
        )
          .map(normalizeCourse)
          .filter(item => Number.isFinite(item.id));

        setClasses(nextClasses);
        setCourses(nextCourses);

        return normalizeResources(response?.classes, response?.courses);
      } catch (error) {
        console.log('Homework teacher resources error:', error);

        return normalizeResources(homeworkMeta?.classes, homeworkMeta?.courses);
      } finally {
        setResourcesLoading(false);
      }
    },
    [homework, homeworkMeta],
  );

  const loadInitialTeachers = useCallback(async () => {
    let rows = Array.isArray(homeworkMeta?.teachers)
      ? homeworkMeta.teachers
      : [];

    /*
     * Same fallback used by
     * the web version.
     */
    if (rows.length === 0) {
      try {
        const response = await api('/api/homeworks/teachers-for?course_id=');

        rows = Array.isArray(response?.teachers) ? response.teachers : [];
      } catch (error) {
        console.log('Homework teachers fallback error:', error);
      }
    }

    const nextTeachers = buildTeacherList(
      rows,
      currentUser,
      isEdit ? homework : null,
    );

    setTeachers(nextTeachers);

    return nextTeachers;
  }, [currentUser, homework, homeworkMeta, isEdit]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);

      const nextTeachers = await loadInitialTeachers();

      if (isEdit) {
        const ownerId = Number(homework?.created_by);

        const meId = Number(currentUser?.id);

        const selectedOwnerId = Number.isFinite(ownerId)
          ? ownerId
          : Number.isFinite(meId)
          ? meId
          : Number(nextTeachers?.[0]?.id);

        if (Number.isFinite(selectedOwnerId)) {
          setSelectedTeacherId(selectedOwnerId);
        }

        const [, attachmentsResponse] = await Promise.all([
          loadTeacherResources(selectedOwnerId, {
            preserveClassId: homework?.class_group_id,

            preserveCourseId: homework?.course_id,
          }),

          api(`/api/homeworks/${homeworkId}/attachments`),
        ]);

        setSelectedClassId(Number(homework?.class_group_id));

        setSelectedCourseId(Number(homework?.course_id));

        setAttachments(
          Array.isArray(attachmentsResponse?.attachments)
            ? attachmentsResponse.attachments
            : [],
        );
      } else {
        let teacherId = Number(currentUser?.id);

        if (!Number.isFinite(teacherId)) {
          teacherId = Number(nextTeachers?.[0]?.id);
        }

        if (Number.isFinite(teacherId)) {
          setSelectedTeacherId(teacherId);

          await loadTeacherResources(teacherId);
        } else {
          await loadTeacherResources(null);
        }
      }

      navigation.setOptions({
        title: isEdit ? 'Edit Homework' : 'Add Homework',
      });
    } catch (error) {
      console.log('Homework form load error:', error);

      Alert.alert(
        'Homework',
        error?.message || 'Could not load homework form.',
      );
    } finally {
      setLoading(false);
    }
  }, [
    currentUser,
    homework,
    homeworkId,
    isEdit,
    loadInitialTeachers,
    loadTeacherResources,
    navigation,
  ]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    let active = true;

    async function loadAttachmentToken() {
      try {
        const token = await getToken();

        if (active) {
          setAttachmentAuthToken(token || null);
        }
      } catch (error) {
        console.log('Attachment token load error:', error);
      }
    }

    loadAttachmentToken();

    return () => {
      active = false;
    };
  }, []);

  async function changeTeacher(teacherId) {
    const nextTeacherId = Number(teacherId);

    if (!Number.isFinite(nextTeacherId)) {
      return;
    }

    if (nextTeacherId === selectedTeacherId) {
      return;
    }

    setSelectedTeacherId(nextTeacherId);

    /*
     * Clear previous teacher's
     * Class and Course selections.
     */
    setSelectedCourseId(null);
    setSelectedClassId(null);

    await loadTeacherResources(nextTeacherId);
  }

  async function changeCourse(courseId) {
    const nextCourseId = Number(courseId);

    if (!Number.isFinite(nextCourseId)) {
      return;
    }

    const previousTeacherId = Number(selectedTeacherId);

    setSelectedCourseId(nextCourseId);

    try {
      setResourcesLoading(true);

      const response = await api(
        `/api/homeworks/teachers-for?course_id=${encodeURIComponent(
          nextCourseId,
        )}`,
      );

      const nextTeachers = (
        Array.isArray(response?.teachers) ? response.teachers : []
      )
        .map(normalizeTeacher)
        .filter(item => Number.isFinite(item.id));

      setTeachers(nextTeachers);

      const previousTeacherStillExists = nextTeachers.some(
        item => item.id === previousTeacherId,
      );

      if (previousTeacherStillExists) {
        setSelectedTeacherId(previousTeacherId);

        await loadTeacherResources(previousTeacherId, {
          preserveCourseId: nextCourseId,
        });
      } else {
        setSelectedTeacherId(null);

        await loadTeacherResources(null, {
          preserveCourseId: nextCourseId,
        });
      }

      setSelectedCourseId(nextCourseId);
    } catch (error) {
      console.log('Homework teachers-for error:', error);

      Alert.alert(
        'Homework',
        error?.message || 'Could not load teachers for this course.',
      );
    } finally {
      setResourcesLoading(false);
    }
  }

  function changeClass(classId) {
    const nextClassId = Number(classId);

    if (!Number.isFinite(nextClassId)) {
      return;
    }

    setSelectedClassId(nextClassId);
  }

  function isImageAttachment(attachment) {
    const mime = String(attachment?.mime || '').toLowerCase();

    const name = String(attachment?.name || '').toLowerCase();

    return (
      mime.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(name)
    );
  }

  function isPdfAttachment(attachment) {
    const mime = String(attachment?.mime || '').toLowerCase();

    const name = String(attachment?.name || '').toLowerCase();

    return mime === 'application/pdf' || name.endsWith('.pdf');
  }

  function getAttachmentMime(attachment) {
    if (attachment?.mime) {
      return attachment.mime;
    }

    if (isImageAttachment(attachment)) {
      return 'image/jpeg';
    }

    if (isPdfAttachment(attachment)) {
      return 'application/pdf';
    }

    return 'application/octet-stream';
  }

  function resolveAttachmentUrl(value) {
    const url = String(value || '').trim();

    if (!url) {
      return '';
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    const base = String(getBase() || '').replace(/\/+$/, '');

    return `${base}/${url.replace(/^\/+/, '')}`;
  }

  async function downloadExistingAttachment(attachment) {
    const attachmentId = Number(attachment?.id);

    if (!Number.isFinite(attachmentId)) {
      Alert.alert('Attachment', 'Attachment ID is missing.');
      return;
    }

    if (downloadingAttachmentId !== null) {
      return;
    }

    const downloadUrl = resolveAttachmentUrl(attachment?.dl || attachment?.url);

    if (!downloadUrl) {
      Alert.alert('Attachment', 'Download URL is missing.');
      return;
    }

    try {
      setDownloadingAttachmentId(attachmentId);

      const token = attachmentAuthToken || (await getToken());

      const originalName = String(
        attachment?.name || `attachment-${attachmentId}`,
      );

      const safeFileName = originalName.replace(/[\\/:*?"<>|]/g, '_');

      const mimeType = getAttachmentMime(attachment);

      const tempPath = `${
        ReactNativeBlobUtil.fs.dirs.CacheDir
      }/${Date.now()}-${safeFileName}`;

      const headers = {
        Accept: mimeType,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log('Attachment download:', downloadUrl);

      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
        path: tempPath,
      }).fetch('GET', downloadUrl, headers);

      const status = Number(response?.info()?.status);

      if (status < 200 || status >= 300) {
        throw new Error(`Server returned HTTP ${status}.`);
      }

      if (Platform.OS === 'android') {
        await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
          {
            name: safeFileName,
            parentFolder: 'Argus',
            mimeType,
          },
          'Download',
          tempPath,
        );

        Alert.alert(
          'Download complete',
          `${safeFileName} was saved to Downloads/Argus.`,
        );
      } else {
        const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${safeFileName}`;

        await ReactNativeBlobUtil.fs.cp(tempPath, destination);

        Alert.alert(
          'Download complete',
          `${safeFileName} was downloaded successfully.`,
        );
      }

      try {
        const exists = await ReactNativeBlobUtil.fs.exists(tempPath);

        if (exists) {
          await ReactNativeBlobUtil.fs.unlink(tempPath);
        }
      } catch (cleanupError) {
        console.log('Temporary attachment cleanup error:', cleanupError);
      }
    } catch (error) {
      console.log('Attachment download error:', error);

      Alert.alert(
        'Download failed',
        error?.message || 'Could not download the attachment.',
      );
    } finally {
      setDownloadingAttachmentId(null);
    }
  }

  const handlePickedHomeworkFiles = useCallback(async files => {
    if (!Array.isArray(files) || files.length === 0) {
      return;
    }

    setNewAttachments(current => {
      const next = [...current];

      files.forEach(file => {
        const key = `${file.uri}|${file.name}`;

        const alreadyExists = next.some(
          item => `${item.uri}|${item.name}` === key,
        );

        if (!alreadyExists) {
          next.push(file);
        }
      });

      return next;
    });
  }, []);

  async function uploadHomeworkAttachments(homeworkId, files) {
    if (!Array.isArray(files) || files.length === 0) {
      return {
        uploaded: [],
      };
    }

    const normalizedHomeworkId = Number(homeworkId);

    if (!Number.isFinite(normalizedHomeworkId)) {
      throw new Error('Homework ID is missing for attachment upload.');
    }

    const formData = new FormData();

    files.forEach((file, index) => {
      if (!file?.uri) {
        return;
      }

      formData.append('files[]', {
        uri: file.uri,

        name: file.name || `attachment_${index + 1}`,

        type: file.type || 'application/octet-stream',
      });
    });

    const token = await getToken();

    const baseUrl = String(getBase() || '').replace(/\/+$/, '');

    const url = `${baseUrl}/api/homeworks/${normalizedHomeworkId}/attachments`;

    console.log('Homework attachment upload URL:', url);

    console.log('Homework attachment count:', files.length);

    /*
     * Do not manually set Content-Type.
     * React Native must create the
     * multipart boundary automatically.
     */
    const headers = {
      Accept: 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const responseText = await response.text();

    let responseData = null;

    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch {
      responseData = {
        message: responseText,
      };
    }

    console.log('Homework attachment upload response:', responseData);

    if (!response.ok) {
      throw new Error(
        responseData?.message ||
          `Attachment upload failed with status ${response.status}.`,
      );
    }

    return responseData;
  }

  async function saveHomework() {
    if (saving || uploadingAttachments) {
      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      Alert.alert('Homework Title', 'Please enter a homework title.');
      return;
    }

    if (!selectedTeacherId) {
      Alert.alert('Teacher/Admin', 'Please select a teacher or admin.');
      return;
    }

    if (!selectedCourseId) {
      Alert.alert('Course', 'Please select a course.');
      return;
    }

    if (!selectedClassId) {
      Alert.alert('Class', 'Please select a class.');
      return;
    }

    if (!(dueAt instanceof Date) || Number.isNaN(dueAt.getTime())) {
      Alert.alert('Due Date', 'Please select a valid due date and time.');
      return;
    }

    if (isEdit && !Number.isFinite(homeworkId)) {
      Alert.alert('Edit Homework', 'Homework ID is missing.');
      return;
    }

    const payload = {
      class_group_id: Number(selectedClassId),

      course_id: Number(selectedCourseId),

      ends_at: dueAt.toISOString(),

      examination_id: null,

      is_online: true,

      name: trimmedTitle,

      teacher_id: Number(selectedTeacherId),
    };

    try {
      setSaving(true);

      console.log(
        isEdit ? 'Update homework payload:' : 'Create homework payload:',
        payload,
      );

      let targetHomeworkId;

      if (isEdit) {
        const response = await api(`/api/homeworks/${homeworkId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        console.log('Update homework response:', response);

        if (response?.ok !== true) {
          throw new Error('Could not update the homework.');
        }

        targetHomeworkId = homeworkId;
      } else {
        const response = await api('/api/homeworks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        console.log('Create homework response:', response);

        targetHomeworkId = Number(response?.homework_id ?? response?.id);

        if (!Number.isFinite(targetHomeworkId)) {
          throw new Error(
            'Homework was created but no homework ID was returned.',
          );
        }
      }

      if (Array.isArray(newAttachments) && newAttachments.length > 0) {
        try {
          setUploadingAttachments(true);

          await uploadHomeworkAttachments(targetHomeworkId, newAttachments);
        } catch (attachmentError) {
          console.log('Homework attachment upload error:', attachmentError);

          Alert.alert(
            isEdit ? 'Homework updated' : 'Homework created',
            isEdit
              ? 'The homework was updated successfully, but one or more new attachments could not be uploaded.'
              : 'The homework was created successfully, but one or more attachments could not be uploaded.',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ],
          );

          return;
        } finally {
          setUploadingAttachments(false);
        }
      }

      setNewAttachments([]);

      setAttachmentResetKey(current => current + 1);

      navigation.goBack();
    } catch (error) {
      console.log(
        isEdit ? 'Update homework error:' : 'Create homework error:',
        error,
      );

      Alert.alert(
        isEdit ? 'Update failed' : 'Create failed',
        error?.message ||
          (isEdit
            ? 'Could not update the homework.'
            : 'Could not create the homework.'),
      );
    } finally {
      setSaving(false);
      setUploadingAttachments(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading homework form...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.screenContent,
        {
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>
          {isEdit ? 'Edit Homework' : 'Create Homework'}
        </Text>

        <Text style={styles.fieldLabel}>Teacher/Admin</Text>

        <Pressable
          onPress={() => setTeacherModalVisible(true)}
          disabled={saving}
          style={({ pressed }) => [
            styles.selectField,
            saving && styles.controlDisabled,
            pressed && !saving && styles.controlPressed,
          ]}
        >
          <Text numberOfLines={1} style={styles.selectFieldText}>
            {selectedTeacherLabel}
          </Text>

          <Text style={styles.selectArrow}>⌄</Text>
        </Pressable>

        <Text style={styles.fieldLabel}>Homework Title</Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Homework 1: Algebra"
          placeholderTextColor="#64748B"
          editable={!saving}
          style={styles.textInput}
        />

        <Text style={styles.fieldLabel}>Course</Text>

        <Pressable
          onPress={() => setCourseModalVisible(true)}
          disabled={saving || resourcesLoading || courses.length === 0}
          style={({ pressed }) => [
            styles.selectField,

            (saving || resourcesLoading || courses.length === 0) &&
              styles.controlDisabled,

            pressed && !saving && styles.controlPressed,
          ]}
        >
          <Text numberOfLines={1} style={styles.selectFieldText}>
            {selectedCourseLabel}
          </Text>

          {resourcesLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.selectArrow}>⌄</Text>
          )}
        </Pressable>

        <Text style={styles.fieldLabel}>Class</Text>

        <Pressable
          onPress={() => setClassModalVisible(true)}
          disabled={saving || resourcesLoading || classes.length === 0}
          style={({ pressed }) => [
            styles.selectField,

            (saving || resourcesLoading || classes.length === 0) &&
              styles.controlDisabled,

            pressed && !saving && styles.controlPressed,
          ]}
        >
          <Text numberOfLines={1} style={styles.selectFieldText}>
            {selectedClassLabel}
          </Text>

          <Text style={styles.selectArrow}>⌄</Text>
        </Pressable>

        <Text style={styles.fieldLabel}>Due (End) At</Text>

        <Pressable
          onPress={() => setDatePickerVisible(true)}
          style={({ pressed }) => [
            styles.dateField,
            pressed && styles.controlPressed,
          ]}
        >
          <Text style={styles.dateFieldText}>{formatDateTime(dueAt)}</Text>

          <Text style={styles.calendarIcon}>📅</Text>
        </Pressable>

        {datePickerVisible ? (
          <DateTimePicker
            value={dueAt}
            mode="date"
            onChange={(event, selectedDate) => {
              setDatePickerVisible(false);

              if (event?.type === 'dismissed' || !selectedDate) {
                return;
              }

              const next = new Date(dueAt);

              next.setFullYear(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
              );

              setDueAt(next);

              setTimeout(() => {
                setTimePickerVisible(true);
              }, 150);
            }}
          />
        ) : null}

        {timePickerVisible ? (
          <DateTimePicker
            value={dueAt}
            mode="time"
            is24Hour={false}
            onChange={(event, selectedTime) => {
              setTimePickerVisible(false);

              if (event?.type === 'dismissed' || !selectedTime) {
                return;
              }

              const next = new Date(dueAt);

              next.setHours(
                selectedTime.getHours(),
                selectedTime.getMinutes(),
                0,
                0,
              );

              setDueAt(next);
            }}
          />
        ) : null}

        <View style={styles.attachmentSectionSpacing}>
          <AttachOptionalSection
            BG="#0F172A"
            CARD="#142B49"
            TEXT="#FFFFFF"
            MUTED="#AFC0D8"
            BORDER="#3B7197"
            DANGER="#EF4444"
            resetKey={attachmentResetKey}
            uploading={uploadingAttachments}
            onPickedFiles={handlePickedHomeworkFiles}
            onFilesChanged={setNewAttachments}
          />
        </View>

        {isEdit && attachments.length > 0 ? (
          <View style={styles.existingAttachmentsSection}>
            <Text style={styles.existingAttachmentsTitle}>
              Existing attachments
            </Text>

            <View style={styles.existingAttachmentsGrid}>
              {attachments.map(attachment => {
                const isImage = isImageAttachment(attachment);

                const isPdf = isPdfAttachment(attachment);

                const downloading =
                  downloadingAttachmentId === Number(attachment.id);

                const previewUrl = resolveAttachmentUrl(attachment?.url);

                return (
                  <Pressable
                    key={String(attachment.id)}
                    onPress={() => downloadExistingAttachment(attachment)}
                    disabled={downloadingAttachmentId !== null}
                    style={({ pressed }) => [
                      styles.existingAttachmentCard,

                      pressed && !downloading && styles.controlPressed,
                    ]}
                  >
                    <View style={styles.attachmentPreview}>
                      {downloading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : isImage && previewUrl ? (
                        <Image
                          source={{
                            uri: previewUrl,

                            headers: attachmentAuthToken
                              ? {
                                  Authorization: `Bearer ${attachmentAuthToken}`,
                                }
                              : {},
                          }}
                          resizeMode="cover"
                          style={styles.existingAttachmentImage}
                        />
                      ) : (
                        <View style={styles.documentPreview}>
                          <Text
                            style={[
                              styles.documentTypeText,

                              isPdf && styles.pdfTypeText,
                            ]}
                          >
                            {isPdf ? 'PDF' : 'FILE'}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.attachmentCardBody}>
                      <Text numberOfLines={2} style={styles.attachmentCardName}>
                        {attachment.name}
                      </Text>

                      <Text style={styles.attachmentDownloadText}>
                        Tap to download
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        <View style={styles.footer}>
          <Pressable
            onPress={() => navigation.goBack()}
            disabled={saving}
            style={({ pressed }) => [
              styles.cancelButton,

              saving && styles.controlDisabled,

              pressed && !saving && styles.controlPressed,
            ]}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={saveHomework}
            disabled={saving || uploadingAttachments}
            style={({ pressed }) => [
              styles.saveButton,

              (saving || uploadingAttachments) && styles.controlDisabled,

              pressed &&
                !saving &&
                !uploadingAttachments &&
                styles.controlPressed,
            ]}
          >
            {saving || uploadingAttachments ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEdit ? 'Save' : 'Create'}
              </Text>
            )}
          </Pressable>
        </View>
      </View>

      <SelectModal
        visible={teacherModalVisible}
        title="Teacher/Admin"
        options={teacherOptions}
        selectedValue={selectedTeacherId}
        onSelect={changeTeacher}
        onClose={() => setTeacherModalVisible(false)}
        emptyText="No teachers or admins available."
      />

      <SelectModal
        visible={courseModalVisible}
        title="Course"
        options={courseOptions}
        selectedValue={selectedCourseId}
        onSelect={changeCourse}
        onClose={() => setCourseModalVisible(false)}
        loading={resourcesLoading}
        emptyText="No courses are available for this teacher."
      />

      <SelectModal
        visible={classModalVisible}
        title="Class"
        options={classOptions}
        selectedValue={selectedClassId}
        onSelect={changeClass}
        onClose={() => setClassModalVisible(false)}
        loading={resourcesLoading}
        emptyText="No classes are available for this teacher."
      />
    </ScrollView>
  );
}
