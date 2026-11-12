// src/screens/Admin/Course/AdminCourses.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api, absoluteUrl, getToken } from '../../../api/client';

import ReactNativeBlobUtil from 'react-native-blob-util';

import styles from './AdminCourses.styles';

const PER_PAGE = 20;

function formatClassGroup(item) {
  const name = String(item?.name || '').trim();

  const section = String(item?.section || '').trim();

  if (!name) {
    return '';
  }

  return section ? `${name} (${section})` : name;
}

function isSystemCourse(item) {
  return (
    String(item?.title || '')
      .trim()
      .toLowerCase() === 'all periods today'
  );
}

export default function AdminCourses({ navigation }) {
  const insets = useSafeAreaInsets();

  const searchRef = useRef('');

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [searching, setSearching] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [me, setMe] = useState(null);

  const [onboarding, setOnboarding] = useState(null);

  const [meta, setMeta] = useState(null);

  const [courses, setCourses] = useState([]);

  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const [creatingSubject, setCreatingSubject] = useState(false);

  const [newSubjectTitle, setNewSubjectTitle] = useState('');

  const [newSubjectDescription, setNewSubjectDescription] = useState('');

  const [selectedClassIds, setSelectedClassIds] = useState([]);

  const [classPickerOpen, setClassPickerOpen] = useState(false);

  const [classOptionsLoading, setClassOptionsLoading] = useState(false);

  const [classOptions, setClassOptions] = useState([]);

  const [classSearch, setClassSearch] = useState('');

  const [editModalVisible, setEditModalVisible] = useState(false);

  const [editingCourseId, setEditingCourseId] = useState(null);

  const [editSubjectTitle, setEditSubjectTitle] = useState('');

  const [editSubjectDescription, setEditSubjectDescription] = useState('');

  const [loadingEditCourseId, setLoadingEditCourseId] = useState(null);

  const [savingSubject, setSavingSubject] = useState(false);

  const [deletingCourseId, setDeletingCourseId] = useState(null);

  const [downloadingData, setDownloadingData] = useState(false);

  const loadCourses = useCallback(
    async ({ requestedPage = 1, query = '', append = false } = {}) => {
      const response = await api(
        `/api/courses?q=${encodeURIComponent(query)}&page=${encodeURIComponent(
          requestedPage,
        )}&per_page=${PER_PAGE}`,
      );

      const rows = Array.isArray(response?.rows) ? response.rows : [];

      if (append) {
        setCourses(current => {
          const map = new Map();

          current.forEach(item => {
            map.set(Number(item?.id), item);
          });

          rows.forEach(item => {
            map.set(Number(item?.id), item);
          });

          return Array.from(map.values());
        });
      } else {
        setCourses(rows);
      }

      setPage(requestedPage);

      setTotalCount(Number(response?.count) || rows.length);
    },
    [],
  );

  const loadScreen = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [meResponse, onboardingResponse, metaResponse] =
          await Promise.all([
            api('/api/me'),

            api('/api/settings/v1/onboarding'),

            api('/api/courses/meta'),
          ]);

        const role = String(
          meResponse?.primary_role ||
            meResponse?.role ||
            meResponse?.actual_primary_role ||
            meResponse?.actual_role ||
            '',
        )
          .trim()
          .toLowerCase();

        const hasAccess =
          meResponse?.is_admin === true ||
          meResponse?.is_super_admin === true ||
          role === 'admin' ||
          role === 'super_admin' ||
          metaResponse?.can_manage === true;

        if (!hasAccess) {
          Alert.alert(
            'Access denied',
            'Only administrators can manage subjects.',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ],
          );

          return;
        }

        setMe(meResponse || null);

        setOnboarding(onboardingResponse || null);

        setMeta(metaResponse || null);

        await loadCourses({
          requestedPage: 1,
          query: searchRef.current,
          append: false,
        });
      } catch (error) {
        console.log('Admin courses load error:', error);

        Alert.alert('Subjects', error?.message || 'Could not load subjects.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigation, loadCourses],
  );

  useFocusEffect(
    useCallback(() => {
      loadScreen();

      return undefined;
    }, [loadScreen]),
  );

  const visibleCourses = useMemo(() => {
    return courses.filter(item => !isSystemCourse(item));
  }, [courses]);

  const hasMore = page * PER_PAGE < totalCount;

  const handleSearchChange = useCallback(value => {
    setSearch(value);

    searchRef.current = value;
  }, []);

  const handleSearch = useCallback(async () => {
    try {
      setSearching(true);

      const query = String(search || '').trim();

      searchRef.current = query;

      await loadCourses({
        requestedPage: 1,
        query,
        append: false,
      });
    } catch (error) {
      console.log('Course search error:', error);

      Alert.alert('Subjects', error?.message || 'Could not search subjects.');
    } finally {
      setSearching(false);
    }
  }, [search, loadCourses]);

  const handleClearSearch = useCallback(async () => {
    try {
      setSearch('');

      searchRef.current = '';

      setSearching(true);

      await loadCourses({
        requestedPage: 1,
        query: '',
        append: false,
      });
    } catch (error) {
      console.log('Clear course search error:', error);
    } finally {
      setSearching(false);
    }
  }, [loadCourses]);

  const loadNextPage = useCallback(async () => {
    if (loadingMore || !hasMore) {
      return;
    }

    try {
      setLoadingMore(true);

      await loadCourses({
        requestedPage: page + 1,

        query: searchRef.current,

        append: true,
      });
    } catch (error) {
      console.log('Load more courses error:', error);

      Alert.alert(
        'Subjects',
        error?.message || 'Could not load more subjects.',
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, loadCourses]);

  const handleDownloadData = useCallback(async () => {
    if (downloadingData) {
      return;
    }

    let tempPath = null;

    try {
      setDownloadingData(true);

      const token = await getToken();

      const url = absoluteUrl('/api/courses/download.xlsx');

      const fileName = `Subjects-${new Date().toISOString().slice(0, 10)}.xlsx`;

      const headers = {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: 'xlsx',
      }).fetch('GET', url, headers);

      const status = Number(response.info()?.status);

      if (!Number.isFinite(status) || status < 200 || status >= 300) {
        throw new Error(`Download failed with HTTP ${status || 'unknown'}.`);
      }

      tempPath = response.path();

      if (!tempPath) {
        throw new Error('Downloaded file path was not returned.');
      }

      if (Platform.OS === 'android') {
        await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
          {
            name: fileName,

            parentFolder: 'Courses',

            mimeType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          'Download',
          tempPath,
        );

        Alert.alert(
          'Download Complete',
          `Subject data saved to:\n\nDownloads/Courses\n\n${fileName}`,
        );

        return;
      }

      const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

      await ReactNativeBlobUtil.fs.cp(tempPath, destination);

      Alert.alert('Download Complete', 'Subject data has been saved.');
    } catch (error) {
      console.log('Subject download error:', error);

      Alert.alert(
        'Download Data',
        error?.message || 'Could not download subject data.',
      );
    } finally {
      if (tempPath) {
        try {
          const exists = await ReactNativeBlobUtil.fs.exists(tempPath);

          if (exists) {
            await ReactNativeBlobUtil.fs.unlink(tempPath);
          }
        } catch (error) {
          console.log('Subject download cleanup error:', error);
        }
      }

      setDownloadingData(false);
    }
  }, [downloadingData]);

  const handleAddSubject = useCallback(() => {
    setNewSubjectTitle('');
    setNewSubjectDescription('');

    setSelectedClassIds([]);

    setClassPickerOpen(false);
    setClassSearch('');
    setClassOptions([]);

    setCreateModalVisible(true);
  }, []);

  const handleCloseCreateSubject = useCallback(() => {
    if (creatingSubject) {
      return;
    }

    setCreateModalVisible(false);

    setNewSubjectTitle('');
    setNewSubjectDescription('');

    setSelectedClassIds([]);

    setClassPickerOpen(false);
    setClassSearch('');
    setClassOptions([]);
  }, [creatingSubject]);

  const loadClassOptions = useCallback(async (query = '') => {
    try {
      setClassOptionsLoading(true);

      const response = await api(
        `/api/courses/class-groups?q=${encodeURIComponent(query)}`,
      );

      setClassOptions(Array.isArray(response?.classes) ? response.classes : []);
    } catch (error) {
      console.log('Course class options error:', error);

      Alert.alert(
        'Assigned Classes',
        error?.message || 'Could not load classes.',
      );
    } finally {
      setClassOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if ((!createModalVisible && !editModalVisible) || !classPickerOpen) {
      return undefined;
    }

    const timer = setTimeout(() => {
      loadClassOptions(classSearch.trim());
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [
    createModalVisible,
    editModalVisible,
    classPickerOpen,
    classSearch,
    loadClassOptions,
  ]);

  const toggleAssignedClass = useCallback(classId => {
    const id = Number(classId);

    if (!Number.isFinite(id)) {
      return;
    }

    setSelectedClassIds(current => {
      if (current.includes(id)) {
        return current.filter(itemId => itemId !== id);
      }

      return [...current, id];
    });
  }, []);

  const selectedClassOptions = useMemo(() => {
    const onboardingClasses = Array.isArray(onboarding?.classes)
      ? onboarding.classes
      : [];

    return selectedClassIds.map(id => {
      const option = classOptions.find(item => Number(item?.id) === Number(id));

      const onboardingClass = onboardingClasses.find(
        item => Number(item?.id) === Number(id),
      );

      return {
        id,
        label: option?.label || onboardingClass?.label || `Class ${id}`,
      };
    });
  }, [selectedClassIds, classOptions, onboarding?.classes]);

  const handleCreateSubject = useCallback(async () => {
    const title = String(newSubjectTitle || '').trim();

    const description = String(newSubjectDescription || '').trim();

    if (!title) {
      Alert.alert('Create Subject', 'Title is required.');

      return;
    }

    if (creatingSubject) {
      return;
    }

    try {
      setCreatingSubject(true);

      const response = await api('/api/courses', {
        method: 'POST',

        body: JSON.stringify({
          title,

          description: description || null,

          class_group_ids: selectedClassIds.map(Number),
        }),
      });

      if (response?.ok !== true) {
        throw new Error('Could not create the subject.');
      }

      setCreateModalVisible(false);

      setNewSubjectTitle('');
      setNewSubjectDescription('');
      setSelectedClassIds([]);
      setClassPickerOpen(false);
      setClassSearch('');
      setClassOptions([]);

      await loadCourses({
        requestedPage: 1,
        query: searchRef.current,
        append: false,
      });

      Alert.alert('Subject Created', 'Subject created successfully.');
    } catch (error) {
      console.log('Create subject error:', error);

      Alert.alert(
        'Create Subject',
        error?.message || 'Could not create the subject.',
      );
    } finally {
      setCreatingSubject(false);
    }
  }, [
    newSubjectTitle,
    newSubjectDescription,
    selectedClassIds,
    creatingSubject,
    loadCourses,
  ]);

  const handleOpenClassPicker = useCallback(async () => {
    const nextOpen = !classPickerOpen;

    setClassPickerOpen(nextOpen);

    if (nextOpen) {
      await loadClassOptions(classSearch.trim());
    }
  }, [classPickerOpen, classSearch, loadClassOptions]);

  const handleEditCourse = useCallback(
    async item => {
      const courseId = Number(item?.id);

      if (!Number.isFinite(courseId)) {
        Alert.alert('Edit Subject', 'A valid subject ID is required.');

        return;
      }

      if (loadingEditCourseId !== null) {
        return;
      }

      try {
        setLoadingEditCourseId(courseId);

        const response = await api(
          `/api/courses/${encodeURIComponent(courseId)}/class-groups`,
        );

        const assignedClasses = Array.isArray(response?.classes)
          ? response.classes
          : [];

        setEditingCourseId(courseId);

        setEditSubjectTitle(String(item?.title || ''));

        setEditSubjectDescription(String(item?.description || ''));

        setSelectedClassIds(
          assignedClasses
            .map(classItem => Number(classItem?.id))
            .filter(Number.isFinite),
        );

        /*
         * Keep assigned class labels available before
         * the full class picker is opened.
         */
        setClassOptions(assignedClasses);

        setClassSearch('');
        setClassPickerOpen(false);

        setEditModalVisible(true);
      } catch (error) {
        console.log('Load subject classes error:', error);

        Alert.alert(
          'Edit Subject',
          error?.message || 'Could not load the subject.',
        );
      } finally {
        setLoadingEditCourseId(null);
      }
    },
    [loadingEditCourseId],
  );

  const handleCloseEditSubject = useCallback(() => {
    if (savingSubject) {
      return;
    }

    setEditModalVisible(false);

    setEditingCourseId(null);

    setEditSubjectTitle('');
    setEditSubjectDescription('');

    setSelectedClassIds([]);

    setClassPickerOpen(false);
    setClassSearch('');
    setClassOptions([]);
  }, [savingSubject]);

  const handleSaveSubject = useCallback(async () => {
    const courseId = Number(editingCourseId);

    const title = String(editSubjectTitle || '').trim();

    const description = String(editSubjectDescription || '').trim();

    if (!Number.isFinite(courseId)) {
      Alert.alert('Edit Subject', 'A valid subject ID is required.');

      return;
    }

    if (!title) {
      Alert.alert('Edit Subject', 'Title is required.');

      return;
    }

    if (savingSubject) {
      return;
    }

    try {
      setSavingSubject(true);

      const response = await api(
        `/api/courses/${encodeURIComponent(courseId)}`,
        {
          method: 'PUT',

          body: JSON.stringify({
            title,

            description: description || null,

            class_group_ids: selectedClassIds.map(Number),
          }),
        },
      );

      if (response?.ok !== true) {
        throw new Error('Could not update the subject.');
      }

      setEditModalVisible(false);

      setEditingCourseId(null);

      setEditSubjectTitle('');
      setEditSubjectDescription('');

      setSelectedClassIds([]);
      setClassPickerOpen(false);
      setClassSearch('');
      setClassOptions([]);

      await loadCourses({
        requestedPage: 1,
        query: searchRef.current,
        append: false,
      });

      Alert.alert('Subject Updated', 'Subject updated successfully.');
    } catch (error) {
      console.log('Update subject error:', error);

      Alert.alert(
        'Edit Subject',
        error?.message || 'Could not update the subject.',
      );
    } finally {
      setSavingSubject(false);
    }
  }, [
    editingCourseId,
    editSubjectTitle,
    editSubjectDescription,
    selectedClassIds,
    savingSubject,
    loadCourses,
  ]);

  const handleDeleteCourse = useCallback(
    item => {
      const courseId = Number(item?.id);

      if (!Number.isFinite(courseId)) {
        Alert.alert('Delete Subject', 'A valid subject ID is required.');

        return;
      }

      Alert.alert('Delete Subject', 'Delete this subject?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            if (deletingCourseId !== null) {
              return;
            }

            try {
              setDeletingCourseId(courseId);

              await api(`/api/courses/${encodeURIComponent(courseId)}`, {
                method: 'DELETE',
              });

              await loadCourses({
                requestedPage: 1,
                query: searchRef.current,
                append: false,
              });

              Alert.alert('Subject Deleted', 'Subject deleted successfully.');
            } catch (error) {
              console.log('Delete subject error:', error);

              Alert.alert(
                'Delete Subject',
                error?.message || 'Could not delete the subject.',
              );
            } finally {
              setDeletingCourseId(null);
            }
          },
        },
      ]);
    },
    [deletingCourseId, loadCourses],
  );

  const renderCourse = useCallback(
    ({ item }) => {
      const classGroups = Array.isArray(item?.class_groups)
        ? item.class_groups
        : [];

      const classText = classGroups
        .map(formatClassGroup)
        .filter(Boolean)
        .join(', ');

      return (
        <View style={styles.courseCard}>
          <View style={styles.courseTop}>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{item?.title || 'Subject'}</Text>

              {item?.description ? (
                <Text style={styles.courseDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
            </View>

            <View style={styles.courseActions}>
              <Pressable
                disabled={loadingEditCourseId === Number(item?.id)}
                onPress={() => handleEditCourse(item)}
                style={({ pressed }) => [
                  styles.editButton,

                  loadingEditCourseId === Number(item?.id) &&
                    styles.controlDisabled,

                  pressed &&
                    loadingEditCourseId !== Number(item?.id) &&
                    styles.controlPressed,
                ]}
              >
                {loadingEditCourseId === Number(item?.id) ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.editButtonText}>Edit</Text>
                )}
              </Pressable>

              <Pressable
                disabled={deletingCourseId === Number(item?.id)}
                onPress={() => handleDeleteCourse(item)}
                style={({ pressed }) => [
                  styles.deleteButton,

                  deletingCourseId === Number(item?.id) &&
                    styles.controlDisabled,

                  pressed &&
                    deletingCourseId !== Number(item?.id) &&
                    styles.controlPressed,
                ]}
              >
                {deletingCourseId === Number(item?.id) ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete</Text>
                )}
              </Pressable>
            </View>
          </View>

          <View style={styles.classSection}>
            <Text style={styles.classLabel}>Classes:</Text>

            <Text style={styles.classValue}>
              {classText || 'No classes assigned'}
            </Text>
          </View>
        </View>
      );
    },
    [
      handleEditCourse,
      handleDeleteCourse,
      loadingEditCourseId,
      deletingCourseId,
    ],
  );

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading subjects...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 6),
        },
      ]}
    >
      <FlatList
        data={visibleCourses}
        keyExtractor={item => String(item?.id)}
        renderItem={renderCourse}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadScreen({
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.topActions}>
              <Pressable
                disabled={downloadingData}
                onPress={handleDownloadData}
                style={({ pressed }) => [
                  styles.downloadButton,

                  downloadingData && styles.controlDisabled,

                  pressed && !downloadingData && styles.controlPressed,
                ]}
              >
                {downloadingData ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />

                    <Text style={styles.downloadButtonText}>
                      Downloading...
                    </Text>
                  </>
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="download-outline"
                      size={17}
                      color="#FFFFFF"
                    />

                    <Text style={styles.downloadButtonText}>Download Data</Text>
                  </>
                )}
              </Pressable>

              <Pressable
                onPress={handleAddSubject}
                style={({ pressed }) => [
                  styles.addButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />

                <Text style={styles.addButtonText}>Add Subject</Text>
              </Pressable>
            </View>

            <View style={styles.searchPanel}>
              <View style={styles.searchBox}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={19}
                  color="#94A3B8"
                />

                <TextInput
                  value={search}
                  onChangeText={handleSearchChange}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                  placeholder="Search by title or description..."
                  placeholderTextColor="#718096"
                  style={styles.searchInput}
                />
              </View>

              <View style={styles.searchActions}>
                <Pressable
                  disabled={searching}
                  onPress={handleSearch}
                  style={({ pressed }) => [
                    styles.searchButton,

                    searching && styles.controlDisabled,

                    pressed && !searching && styles.controlPressed,
                  ]}
                >
                  {searching ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.searchButtonText}>Search</Text>
                  )}
                </Pressable>

                <Pressable
                  disabled={searching}
                  onPress={handleClearSearch}
                  style={({ pressed }) => [
                    styles.clearButton,

                    pressed && !searching && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.listHeading}>
              <Text style={styles.listHeadingTitle}>Subjects</Text>

              <Text style={styles.listHeadingCount}>
                {visibleCourses.length} shown
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="book-open-page-variant-outline"
              size={40}
              color="#718096"
            />

            <Text style={styles.emptyTitle}>No subjects found</Text>

            <Text style={styles.emptyText}>Try another search term.</Text>
          </View>
        }
        ListFooterComponent={
          hasMore ? (
            <Pressable
              disabled={loadingMore}
              onPress={loadNextPage}
              style={({ pressed }) => [
                styles.loadMoreButton,

                loadingMore && styles.controlDisabled,

                pressed && !loadingMore && styles.controlPressed,
              ]}
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.loadMoreText}>Load More</Text>
              )}
            </Pressable>
          ) : (
            <View style={styles.footerSpace} />
          )
        }
      />
      <Modal
        visible={createModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseCreateSubject}
      >
        <View style={styles.createModalBackdrop}>
          <View style={styles.createModal}>
            <View style={styles.createModalHeader}>
              <Text style={styles.createModalTitle}>Create Subject</Text>

              <Pressable
                disabled={creatingSubject}
                onPress={handleCloseCreateSubject}
                style={({ pressed }) => [
                  styles.createModalCloseButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Text style={styles.createFieldLabel}>Title</Text>

            <TextInput
              value={newSubjectTitle}
              onChangeText={setNewSubjectTitle}
              editable={!creatingSubject}
              placeholder="Algebra I"
              placeholderTextColor="#718096"
              style={styles.createInput}
            />

            <Text style={styles.createFieldLabel}>Description</Text>

            <TextInput
              value={newSubjectDescription}
              onChangeText={setNewSubjectDescription}
              editable={!creatingSubject}
              placeholder="Optional description"
              placeholderTextColor="#718096"
              style={styles.createInput}
            />

            <Text style={styles.createFieldLabel}>Assigned Classes</Text>

            <Pressable
              disabled={creatingSubject}
              onPress={handleOpenClassPicker}
              style={styles.assignedClassField}
            >
              {selectedClassOptions.length > 0 ? (
                <View style={styles.selectedClassChips}>
                  {selectedClassOptions.map(item => (
                    <View
                      key={String(item.id)}
                      style={styles.selectedClassChip}
                    >
                      <Text style={styles.selectedClassChipText}>
                        {item.label}
                      </Text>

                      <Pressable
                        hitSlop={7}
                        onPress={() => toggleAssignedClass(item.id)}
                      >
                        <MaterialCommunityIcons
                          name="close"
                          size={15}
                          color="#DCE7F5"
                        />
                      </Pressable>
                    </View>
                  ))}

                  <Text style={styles.assignedClassHint}>Class</Text>
                </View>
              ) : (
                <Text style={styles.assignedClassPlaceholder}>
                  Type to search classes...
                </Text>
              )}

              <MaterialCommunityIcons
                name={classPickerOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#AFC0D8"
              />
            </Pressable>

            {classPickerOpen ? (
              <View style={styles.classPickerPanel}>
                <View style={styles.classSearchBox}>
                  <MaterialCommunityIcons
                    name="magnify"
                    size={18}
                    color="#94A3B8"
                  />

                  <TextInput
                    value={classSearch}
                    onChangeText={setClassSearch}
                    placeholder="Type to search classes..."
                    placeholderTextColor="#718096"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.classSearchInput}
                  />
                </View>

                {classOptionsLoading ? (
                  <View style={styles.classOptionsLoader}>
                    <ActivityIndicator size="small" color="#67D1F0" />

                    <Text style={styles.classOptionsLoadingText}>
                      Loading classes...
                    </Text>
                  </View>
                ) : (
                  <ScrollView
                    style={styles.classOptionsList}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                  >
                    {classOptions.map(item => {
                      const id = Number(item?.id);

                      const selected = selectedClassIds.includes(id);

                      return (
                        <Pressable
                          key={String(id)}
                          onPress={() => toggleAssignedClass(id)}
                          style={({ pressed }) => [
                            styles.classOption,

                            selected && styles.classOptionSelected,

                            pressed && styles.controlPressed,
                          ]}
                        >
                          <Text style={styles.classOptionText}>
                            {item?.label || `Class ${id}`}
                          </Text>

                          {selected ? (
                            <MaterialCommunityIcons
                              name="check"
                              size={18}
                              color="#93C5FD"
                            />
                          ) : null}
                        </Pressable>
                      );
                    })}

                    {classOptions.length === 0 ? (
                      <Text style={styles.noClassOptionsText}>
                        No classes found.
                      </Text>
                    ) : null}
                  </ScrollView>
                )}
              </View>
            ) : null}

            <View style={styles.createModalActions}>
              <Pressable
                disabled={creatingSubject}
                onPress={handleCloseCreateSubject}
                style={({ pressed }) => [
                  styles.createCancelButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.createCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={creatingSubject}
                onPress={handleCreateSubject}
                style={({ pressed }) => [
                  styles.createButton,

                  creatingSubject && styles.controlDisabled,

                  pressed && !creatingSubject && styles.controlPressed,
                ]}
              >
                {creatingSubject ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.createButtonText}>Create</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseEditSubject}
      >
        <View style={styles.createModalBackdrop}>
          <View style={styles.createModal}>
            <View style={styles.createModalHeader}>
              <Text style={styles.createModalTitle}>Edit Subject</Text>

              <Pressable
                disabled={savingSubject}
                onPress={handleCloseEditSubject}
                style={({ pressed }) => [
                  styles.createModalCloseButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Text style={styles.createFieldLabel}>Title</Text>

            <TextInput
              value={editSubjectTitle}
              onChangeText={setEditSubjectTitle}
              editable={!savingSubject}
              placeholder="Subject title"
              placeholderTextColor="#718096"
              style={styles.createInput}
            />

            <Text style={styles.createFieldLabel}>Description</Text>

            <TextInput
              value={editSubjectDescription}
              onChangeText={setEditSubjectDescription}
              editable={!savingSubject}
              placeholder="Optional description"
              placeholderTextColor="#718096"
              style={styles.createInput}
            />

            <Text style={styles.createFieldLabel}>Assigned Classes</Text>

            <Pressable
              disabled={savingSubject}
              onPress={handleOpenClassPicker}
              style={styles.assignedClassField}
            >
              {selectedClassOptions.length > 0 ? (
                <View style={styles.selectedClassChips}>
                  {selectedClassOptions.map(item => (
                    <View
                      key={String(item.id)}
                      style={styles.selectedClassChip}
                    >
                      <Text style={styles.selectedClassChipText}>
                        {item.label}
                      </Text>

                      <Pressable
                        hitSlop={7}
                        onPress={() => toggleAssignedClass(item.id)}
                      >
                        <MaterialCommunityIcons
                          name="close"
                          size={15}
                          color="#DCE7F5"
                        />
                      </Pressable>
                    </View>
                  ))}

                  <Text style={styles.assignedClassHint}>
                    Type to search classes...
                  </Text>
                </View>
              ) : (
                <Text style={styles.assignedClassPlaceholder}>
                  Type to search classes...
                </Text>
              )}

              <MaterialCommunityIcons
                name={classPickerOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#AFC0D8"
              />
            </Pressable>

            {classPickerOpen ? (
              <View style={styles.classPickerPanel}>
                <View style={styles.classSearchBox}>
                  <MaterialCommunityIcons
                    name="magnify"
                    size={18}
                    color="#94A3B8"
                  />

                  <TextInput
                    value={classSearch}
                    onChangeText={setClassSearch}
                    placeholder="Type to search classes..."
                    placeholderTextColor="#718096"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.classSearchInput}
                  />
                </View>

                {classOptionsLoading ? (
                  <View style={styles.classOptionsLoader}>
                    <ActivityIndicator size="small" color="#67D1F0" />

                    <Text style={styles.classOptionsLoadingText}>
                      Loading classes...
                    </Text>
                  </View>
                ) : (
                  <ScrollView
                    style={styles.classOptionsList}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                  >
                    {classOptions.map(item => {
                      const id = Number(item?.id);

                      const selected = selectedClassIds.includes(id);

                      return (
                        <Pressable
                          key={String(id)}
                          onPress={() => toggleAssignedClass(id)}
                          style={({ pressed }) => [
                            styles.classOption,

                            selected && styles.classOptionSelected,

                            pressed && styles.controlPressed,
                          ]}
                        >
                          <Text style={styles.classOptionText}>
                            {item?.label || `Class ${id}`}
                          </Text>

                          {selected ? (
                            <MaterialCommunityIcons
                              name="check"
                              size={18}
                              color="#93C5FD"
                            />
                          ) : null}
                        </Pressable>
                      );
                    })}

                    {classOptions.length === 0 ? (
                      <Text style={styles.noClassOptionsText}>
                        No classes found.
                      </Text>
                    ) : null}
                  </ScrollView>
                )}
              </View>
            ) : null}

            <View style={styles.createModalActions}>
              <Pressable
                disabled={savingSubject}
                onPress={handleCloseEditSubject}
                style={({ pressed }) => [
                  styles.createCancelButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.createCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={savingSubject}
                onPress={handleSaveSubject}
                style={({ pressed }) => [
                  styles.createButton,

                  savingSubject && styles.controlDisabled,

                  pressed && !savingSubject && styles.controlPressed,
                ]}
              >
                {savingSubject ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.createButtonText}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
