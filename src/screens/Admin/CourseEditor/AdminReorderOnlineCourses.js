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
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../api/client';

import styles from './AdminReorderOnlineCourses.styles';

const COLORS = {
  TEXT: '#E2E8F0',
  MUTED: '#AFC0D8',
  BLUE: '#2563EB',
};

function sameCourseOrder(first, second) {
  if (first.length !== second.length) {
    return false;
  }

  return first.every((id, index) => Number(id) === Number(second[index]));
}

export default function AdminReorderOnlineCourses({ navigation }) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [courses, setCourses] = useState([]);
  const [originalCourseIds, setOriginalCourseIds] = useState([]);

  const [coursesLoading, setCoursesLoading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [courseError, setCourseError] = useState('');

  const courseRequestRef = useRef(0);
  const selectedCategoryRef = useRef(null);

  const selectedCategory = useMemo(
    () =>
      categories.find(
        category => Number(category.id) === Number(selectedCategoryId),
      ) || null,
    [categories, selectedCategoryId],
  );

  const currentCourseIds = useMemo(
    () => courses.map(course => Number(course.id)),
    [courses],
  );

  const orderChanged =
    selectedCategoryId !== null &&
    !coursesLoading &&
    courses.length > 0 &&
    !sameCourseOrder(currentCourseIds, originalCourseIds);

  const loadCategoryCourses = useCallback(async categoryId => {
    const id = Number(categoryId);
    const requestId = ++courseRequestRef.current;

    setCourses([]);
    setOriginalCourseIds([]);
    setCourseError('');

    if (!Number.isInteger(id) || id <= 0) {
      setCoursesLoading(false);
      return;
    }

    try {
      setCoursesLoading(true);

      const url = `/api/ott/categories/${id}/courses-order`;

      console.log('[REORDER COURSES GET]', url);

      const response = await api(url, {
        method: 'GET',
      });

      if (requestId !== courseRequestRef.current) {
        return;
      }

      if (
        response?.category?.id != null &&
        Number(response.category.id) !== id
      ) {
        throw new Error('Category mismatch in course response.');
      }

      if (!Array.isArray(response?.courses)) {
        throw new Error('Invalid category courses response.');
      }

      const orderedCourses = response.courses
        .map((course, index) => ({
          ...course,
          id: Number(course.id),
          originalIndex: index,
          position: Number(course.position ?? 0),
        }))
        .filter(course => Number.isInteger(course.id) && course.id > 0)
        .sort(
          (a, b) =>
            a.position - b.position || a.originalIndex - b.originalIndex,
        );

      setCourses(orderedCourses);
      setOriginalCourseIds(orderedCourses.map(course => course.id));

      console.log(
        '[REORDER COURSES LOADED]',
        orderedCourses.map(course => course.id),
      );
    } catch (error) {
      if (requestId !== courseRequestRef.current) {
        return;
      }

      console.log('[REORDER COURSES ERROR]', error);

      setCourseError(
        error?.message || 'Could not load courses for this category.',
      );
    } finally {
      if (requestId === courseRequestRef.current) {
        setCoursesLoading(false);
      }
    }
  }, []);

  const loadInitialData = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setInitialLoading(true);
        }

        setErrorMessage('');

        const [me, onboarding, categoryResponse] = await Promise.all([
          api('/api/me'),
          api('/api/settings/v1/onboarding'),
          api('/api/ott/categories/list'),
        ]);

        const canManage =
          me?.is_admin === true ||
          me?.is_super_admin === true ||
          (Array.isArray(me?.roles) &&
            me.roles.some(role => ['admin', 'super_admin'].includes(role)));

        if (!canManage) {
          throw new Error(
            'You do not have permission to reorder online courses.',
          );
        }

        console.log(
          '[REORDER ORGANIZATION]',
          onboarding?.organization?.institution_type,
        );

        if (!Array.isArray(categoryResponse)) {
          throw new Error('Invalid categories response.');
        }

        const nextCategories = categoryResponse
          .map(item => ({
            id: Number(item.id),
            name: String(item.name || ''),
          }))
          .filter(item => Number.isInteger(item.id) && item.id > 0);

        setCategories(nextCategories);

        const retainedId = selectedCategoryRef.current;
        const stillExists = nextCategories.some(
          category => category.id === retainedId,
        );

        if (stillExists) {
          await loadCategoryCourses(retainedId);
        } else {
          selectedCategoryRef.current = null;
          setSelectedCategoryId(null);
          ++courseRequestRef.current;
          setCourses([]);
          setOriginalCourseIds([]);
          setCourseError('');
          setCoursesLoading(false);
        }
      } catch (error) {
        console.log('[REORDER INITIAL ERROR]', error);

        setErrorMessage(error?.message || 'Could not load reorder page.');
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [loadCategoryCourses],
  );

  useFocusEffect(
    useCallback(() => {
      loadInitialData(false);
    }, [loadInitialData]),
  );

  const handleCategorySelect = useCallback(
    category => {
      const id = Number(category.id);

      selectedCategoryRef.current = id;
      setSelectedCategoryId(id);
      setCategoryModalVisible(false);

      loadCategoryCourses(id);
    },
    [loadCategoryCourses],
  );

  const handleDragEnd = useCallback(
    ({ data }) => {
      if (coursesLoading || savingOrder || !Array.isArray(data)) {
        return;
      }

      setCourses(data);
    },
    [coursesLoading, savingOrder],
  );

  const handleSaveOrder = useCallback(async () => {
    if (!orderChanged || savingOrder || coursesLoading || !selectedCategoryId) {
      return;
    }

    const categoryId = Number(selectedCategoryId);

    const payload = {
      order: courses.map(course => Number(course.id)),
    };

    try {
      setSavingOrder(true);

      console.log('[REORDER SAVE REQUEST]', {
        categoryId,
        payload,
      });

      const response = await api(
        `/api/ott/categories/${categoryId}/courses-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      console.log('[REORDER SAVE RESPONSE]', response);

      if (response?.status !== 'ok') {
        throw new Error('Could not save the new course order.');
      }

      // Reload the saved order from the backend.
      await loadCategoryCourses(categoryId);

      Alert.alert('Success', 'Course order saved successfully.');
    } catch (error) {
      console.log('[REORDER SAVE ERROR]', {
        message: error?.message,
        status: error?.status,
        payload: error?.payload,
      });

      Alert.alert(
        'Save Failed',
        error?.message || 'Could not save course order.',
      );
    } finally {
      setSavingOrder(false);
    }
  }, [
    orderChanged,
    savingOrder,
    coursesLoading,
    selectedCategoryId,
    courses,
    loadCategoryCourses,
  ]);

  const renderCourse = useCallback(
    ({ item, drag, isActive }) => (
      <ScaleDecorator>
        <Pressable
          onLongPress={drag}
          delayLongPress={180}
          disabled={coursesLoading || savingOrder}
          style={[styles.courseCard, isActive && styles.courseCardDragging]}
        >
          <Pressable
            onLongPress={drag}
            delayLongPress={180}
            disabled={coursesLoading || savingOrder}
            style={styles.dragHandle}
          >
            <Text style={styles.dragIcon}>↕</Text>
          </Pressable>

          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>
              {item.title || 'Untitled Course'}
            </Text>

            <View style={styles.courseMetaRow}>
              <View
                style={[
                  styles.statusBadge,
                  item.is_published ? styles.publishedBadge : styles.draftBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.is_published ? styles.publishedText : styles.draftText,
                  ]}
                >
                  {item.is_published ? 'Published' : 'Draft'}
                </Text>
              </View>

              <Text numberOfLines={1} style={styles.courseSlug}>
                • /{item.slug || ''}
              </Text>
            </View>
          </View>
        </Pressable>
      </ScaleDecorator>
    ),
    [coursesLoading, savingOrder],
  );

  const listHeader = (
    <View style={styles.filterCard}>
      <View style={styles.filterTopRow}>
        <Text style={styles.label}>Category</Text>

        <Pressable
          onPress={handleSaveOrder}
          disabled={!orderChanged || savingOrder || coursesLoading}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.saveButton,
            (!orderChanged || savingOrder || coursesLoading) &&
              styles.disabledButton,
            pressed && !savingOrder && { opacity: 0.75 },
          ]}
        >
          {savingOrder ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
              }}
            >
              <ActivityIndicator size="small" color="#FFFFFF" />

              <Text style={styles.saveButtonText}>Saving...</Text>
            </View>
          ) : (
            <Text style={styles.saveButtonText}>Save order</Text>
          )}
        </Pressable>
      </View>

      <Pressable
        onPress={() => setCategoryModalVisible(true)}
        style={styles.selectField}
      >
        <Text
          style={[
            styles.selectText,
            !selectedCategory && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {selectedCategory?.name || '— Select a category —'}
        </Text>

        <MaterialCommunityIcons name="chevron-down" size={20} color="#E2E8F0" />
      </Pressable>

      <Text style={styles.helpText}>
        Drag the cards below to change the order of courses within the selected
        category.
      </Text>

      {orderChanged ? (
        <Text style={styles.unsavedText}>Order changed — not saved yet.</Text>
      ) : null}

      {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />
          <Text style={styles.loadingText}>Loading course categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <DraggableFlatList
        data={courses}
        keyExtractor={item => String(item.id)}
        renderItem={renderCourse}
        onDragEnd={handleDragEnd}
        activationDistance={12}
        containerStyle={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <View style={styles.coursesContainer}>
            {coursesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.BLUE} />
                <Text style={styles.loadingText}>
                  Loading category courses...
                </Text>
              </View>
            ) : !selectedCategory ? (
              <Text style={styles.emptyText}>
                Select a category to see its courses.
              </Text>
            ) : (
              <Text style={styles.emptyText}>
                {courseError || 'No courses found in this category.'}
              </Text>
            )}
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              if (orderChanged) {
                Alert.alert(
                  'Discard changes?',
                  'Refreshing will discard the unsaved course order.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Refresh',
                      onPress: () => loadInitialData(true),
                    },
                  ],
                );
              } else {
                loadInitialData(true);
              }
            }}
            tintColor={COLORS.BLUE}
          />
        }
      />

      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setCategoryModalVisible(false)}
          />

          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>

              <Pressable
                onPress={() => setCategoryModalVisible(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <FlatList
              data={categories}
              keyExtractor={item => String(item.id)}
              style={styles.categoryList}
              renderItem={({ item }) => {
                const selected = Number(item.id) === Number(selectedCategoryId);

                return (
                  <Pressable
                    onPress={() => {
                      if (orderChanged) {
                        Alert.alert(
                          'Discard changes?',
                          'Changing the category will discard the unsaved order.',
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'Continue',
                              onPress: () => handleCategorySelect(item),
                            },
                          ],
                        );
                      } else {
                        handleCategorySelect(item);
                      }
                    }}
                    style={[
                      styles.categoryOption,
                      selected && styles.categoryOptionSelected,
                    ]}
                  >
                    <Text style={styles.categoryOptionText}>{item.name}</Text>

                    {selected ? (
                      <Text style={styles.categoryCheck}>✓</Text>
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
