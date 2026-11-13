import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { api, absoluteUrl } from '../../../api/client';

import { styles, COLORS } from './AdminOnlineCoursesEditor.styles';

import CourseAccessSettingsModal from './components/CourseAccessSettingsModal';
import CourseAssignmentsModal from './components/CourseAssignmentsModal';
import CreateCourseModal from './components/CreateCourseModal';

export default function AdminOnlineCoursesEditor({ route }) {
  const navigation = useNavigation();

  const [createCourseModalVisible, setCreateCourseModalVisible] =
    useState(false);

  const [accessSettingsVisible, setAccessSettingsVisible] = useState(false);

  const [assignmentsModalVisible, setAssignmentsModalVisible] = useState(false);

  /*
   * Assignments button is shown only when
   * the backend access policy enables it.
   */
  const [assignmentsEnabled, setAssignmentsEnabled] = useState(false);

  const [courses, setCourses] = useState([]);

  const [searchText, setSearchText] = useState('');

  const [initialLoading, setInitialLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [loadingCourseImages, setLoadingCourseImages] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const [totalCourses, setTotalCourses] = useState(0);

  const [courseImageMap, setCourseImageMap] = useState({});

  /**
   * mode:
   * initial = screen open
   * refresh = pull-to-refresh
   * more = pagination/lazy loading
   */
  const loadCourses = useCallback(async (page = 1, mode = 'initial') => {
    try {
      if (mode === 'initial') {
        setInitialLoading(true);
      } else if (mode === 'refresh') {
        setRefreshing(true);
      } else if (mode === 'more') {
        setLoadingMore(true);
      }

      setErrorMessage('');

      const response = await api(`/api/ott/ottcourses?page=${page}`, {
        method: 'GET',
      });

      const incomingCourses = Array.isArray(response?.data)
        ? response.data
        : [];

      if (page === 1) {
        setCourses(incomingCourses);
      } else {
        setCourses(previousCourses => {
          const courseMap = new Map();

          previousCourses.forEach(course => {
            courseMap.set(String(course.id), course);
          });

          incomingCourses.forEach(course => {
            courseMap.set(String(course.id), course);
          });

          return Array.from(courseMap.values());
        });
      }

      setCurrentPage(Number(response?.current_page) || page);

      setLastPage(Number(response?.last_page) || page);

      setTotalCourses(Number(response?.total) || incomingCourses.length);
    } catch (error) {
      console.log('Course list API error:', error);

      setErrorMessage(error?.message || 'Could not load online courses.');
    } finally {
      setInitialLoading(false);

      setRefreshing(false);

      setLoadingMore(false);
    }
  }, []);

  /*
   * Load the online-course access policy.
   *
   * assignments_enabled controls whether
   * the Assignments action is visible.
   */
  const loadAccessPolicy = useCallback(async () => {
    try {
      const response = await api('/api/online/settings/access', {
        method: 'GET',
      });

      setAssignmentsEnabled(Boolean(response?.assignments_enabled));

      return response;
    } catch (error) {
      console.log('Course access policy load error:', error);

      /*
       * Do not break the course screen
       * when policy loading fails.
       */
      return null;
    }
  }, []);

  const handleOpenAccessSettings = useCallback(() => {
    setAccessSettingsVisible(true);
  }, []);

  const handleCloseAccessSettings = useCallback(() => {
    setAccessSettingsVisible(false);

    /*
     * Re-fetch after closing so the
     * Assignments button always reflects
     * the latest backend state.
     */
    loadAccessPolicy();
  }, [loadAccessPolicy]);

  const handleAccessSettingsSaved = useCallback(response => {
    setAssignmentsEnabled(Boolean(response?.assignments_enabled));
  }, []);

  const handleOpenAssignments = useCallback(() => {
    if (!assignmentsEnabled) {
      return;
    }

    setAssignmentsModalVisible(true);
  }, [assignmentsEnabled]);

  const handleCloseAssignments = useCallback(() => {
    setAssignmentsModalVisible(false);
  }, []);

  const loadCourseImages = useCallback(async () => {
    try {
      setLoadingCourseImages(true);

      const response = await api('/api/online/catalog', {
        method: 'POST',

        body: JSON.stringify({
          student_id: null,
        }),
      });

      const nextImageMap = createCourseImageMap(response);

      setCourseImageMap(nextImageMap);

      return nextImageMap;
    } catch (error) {
      console.log('Course catalog image API error:', error);

      /*
       * Keep the course listing functional
       * when the catalog image API fails.
       */
      return {};
    } finally {
      setLoadingCourseImages(false);
    }
  }, []);

  const handleRefreshCourses = useCallback(async () => {
    await Promise.all([
      loadCourses(1, 'refresh'),

      loadCourseImages(),

      loadAccessPolicy(),
    ]);
  }, [loadAccessPolicy, loadCourseImages, loadCourses]);

  /*
   * Reload course data, images and access
   * policy whenever this screen receives focus.
   */
  useFocusEffect(
    useCallback(() => {
      loadCourses(1, 'initial');

      loadCourseImages();

      loadAccessPolicy();
    }, [loadAccessPolicy, loadCourseImages, loadCourses]),
  );

  /*
   * Remove the deleted course from the local
   * list and reload the latest information.
   */
  useEffect(() => {
    const deletedCourseId = route?.params?.deletedCourseId;

    if (!deletedCourseId) {
      return;
    }

    setCourses(previousCourses =>
      previousCourses.filter(
        course => String(course?.id) !== String(deletedCourseId),
      ),
    );

    setCourseImageMap(previousImageMap => {
      const updatedImageMap = {
        ...previousImageMap,
      };

      delete updatedImageMap[String(deletedCourseId)];

      return updatedImageMap;
    });

    loadCourses(1, 'initial');

    loadCourseImages();

    navigation.setParams({
      deletedCourseId: undefined,
    });
  }, [
    loadCourseImages,
    loadCourses,
    navigation,
    route?.params?.deletedCourseId,
  ]);

  const onRefresh = useCallback(() => {
    handleRefreshCourses();
  }, [handleRefreshCourses]);

  const loadMoreCourses = useCallback(() => {
    if (
      initialLoading ||
      refreshing ||
      loadingMore ||
      currentPage >= lastPage
    ) {
      return;
    }

    loadCourses(currentPage + 1, 'more');
  }, [
    currentPage,
    initialLoading,
    lastPage,
    loadCourses,
    loadingMore,
    refreshing,
  ]);

  const handleOpenCreateCourse = useCallback(() => {
    setCreateCourseModalVisible(true);
  }, []);

  const handleCloseCreateCourse = useCallback(() => {
    setCreateCourseModalVisible(false);
  }, []);

  const handleCourseCreated = useCallback(
    createdCourse => {
      if (!createdCourse?.id) {
        return;
      }

      setCreateCourseModalVisible(false);

      navigation.navigate('AdminOnlineCourseDetailsEditor', {
        courseId: createdCourse.id,

        courseTitle: createdCourse.title,
      });
    },
    [navigation],
  );

  const filteredCourses = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return courses;
    }

    return courses.filter(course => {
      const title = String(course?.title || '').toLowerCase();

      const description = String(course?.description || '').toLowerCase();

      const slug = String(course?.slug || '').toLowerCase();

      const id = String(course?.id || '').toLowerCase();

      const publicationStatus = course?.is_published
        ? 'published'
        : 'draft unpublished';

      return (
        title.includes(query) ||
        description.includes(query) ||
        slug.includes(query) ||
        id.includes(query) ||
        publicationStatus.includes(query)
      );
    });
  }, [courses, searchText]);

  function formatPrice(priceMinor, currency) {
    const minorValue = Number(priceMinor);

    if (!Number.isFinite(minorValue) || minorValue <= 0) {
      return 'Free';
    }

    const amount = minorValue / 100;

    const formattedAmount = Number.isInteger(amount)
      ? amount.toFixed(0)
      : amount.toFixed(2);

    const normalizedCurrency = String(currency || '').trim();

    if (
      normalizedCurrency.toUpperCase() === 'INR' ||
      normalizedCurrency === '₹'
    ) {
      return `₹${formattedAmount}`;
    }

    return `${normalizedCurrency || ''} ${formattedAmount}`.trim();
  }

  const renderCourseTile = useCallback(
    ({ item }) => {
      const primaryImagePath =
        typeof item?.primary_image === 'string' && item.primary_image.trim()
          ? item.primary_image.trim()
          : null;

      const catalogImageUrl =
        typeof courseImageMap[String(item?.id)] === 'string' &&
        courseImageMap[String(item?.id)].trim()
          ? courseImageMap[String(item?.id)].trim()
          : null;

      /*
       * Prefer primary_image from
       * the admin API. Use catalog
       * image as fallback.
       */
      const imageUri = primaryImagePath
        ? absoluteUrl(primaryImagePath)
        : catalogImageUrl;

      const isPublished = Boolean(item?.is_published);

      return (
        <Pressable
          onPress={() => {
            navigation.navigate('AdminOnlineCourseDetailsEditor', {
              courseId: item.id,

              courseTitle: item.title,
            });
          }}
          style={({ pressed }) => [
            styles.courseCard,

            pressed && styles.courseCardPressed,
          ]}
        >
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image
                source={{
                  uri: imageUri,
                }}
                style={styles.courseImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderEmoji}>🎓</Text>
              </View>
            )}

            <View
              style={[
                styles.statusBadge,

                isPublished ? styles.publishedBadge : styles.draftBadge,
              ]}
            >
              <Text style={styles.statusText}>
                {isPublished ? 'Published' : 'Draft'}
              </Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.courseTitle} numberOfLines={2}>
              {item?.title || 'Untitled Course'}
            </Text>

            <Text style={styles.description} numberOfLines={2}>
              {item?.description || 'No description available'}
            </Text>

            <Text style={styles.slug} numberOfLines={1}>
              {item?.slug || 'No slug'}
            </Text>

            <View style={styles.cardFooter}>
              <Text style={styles.courseId}>ID: {item?.id}</Text>

              <Text
                style={[
                  styles.price,

                  Number(item?.price_minor) <= 0 && styles.freePrice,
                ]}
              >
                {formatPrice(item?.price_minor, item?.currency)}
              </Text>
            </View>
          </View>
        </Pressable>
      );
    },
    [courseImageMap, navigation],
  );

  const renderEmptyComponent = useCallback(() => {
    if (initialLoading) {
      return null;
    }

    if (searchText.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>

          <Text style={styles.emptyTitle}>No matching courses</Text>

          <Text style={styles.emptyDescription}>
            Try searching with another title, description, slug or course ID.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📚</Text>

        <Text style={styles.emptyTitle}>No courses found</Text>

        <Text style={styles.emptyDescription}>
          No online courses are currently available.
        </Text>
      </View>
    );
  }, [initialLoading, searchText]);

  if (initialLoading && courses.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />

          <Text style={styles.loadingText}>Loading online courses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage && courses.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>

          <Text style={styles.errorTitle}>Could not load courses</Text>

          <Text style={styles.errorDescription}>{errorMessage}</Text>

          <Pressable
            onPress={() => {
              loadCourses(1, 'initial');

              loadCourseImages();

              loadAccessPolicy();
            }}
            style={({ pressed }) => [
              styles.retryButton,

              pressed && styles.retryButtonPressed,
            ]}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const headerRefreshing = refreshing || loadingCourseImages;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Actions */}

        <View
          style={[
            styles.header,
            {
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingHorizontal: 8,
            },
          ]}
        >
          <View
            style={[
              styles.headerActions,
              {
                width: '100%',

                flexDirection: 'row',

                justifyContent: 'flex-start',

                alignItems: 'center',

                flexWrap: 'nowrap',

                gap: 6,

                marginLeft: 0,
              },
            ]}
          >
            {/* Create Course */}

            <Pressable
              onPress={handleOpenCreateCourse}
              style={({ pressed }) => [
                styles.createCourseButton,

                {
                  minWidth: 0,

                  width: 'auto',

                  minHeight: 42,

                  paddingHorizontal: 12,

                  borderRadius: 10,

                  flexShrink: 1,
                },

                pressed && styles.createCourseButtonPressed,
              ]}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.createCourseButtonText,

                  {
                    fontSize: 11,
                  },
                ]}
              >
                + Create Course
              </Text>
            </Pressable>

            {/* Reorder Online Courses */}
            <Pressable
              onPress={() => navigation.navigate('AdminReorderOnlineCourses')}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.reorderButton,
                pressed && styles.refreshButtonPressed,
              ]}
            >
              <Text style={styles.reorderButtonText}>Reorder</Text>
            </Pressable>

            {/* Settings - Icon Only */}

            <Pressable
              onPress={handleOpenAccessSettings}
              style={({ pressed }) => [
                styles.refreshButton,

                {
                  width: 44,

                  minWidth: 44,

                  height: 42,

                  minHeight: 42,

                  paddingHorizontal: 0,

                  borderRadius: 10,

                  alignItems: 'center',

                  justifyContent: 'center',

                  flexShrink: 0,
                },

                pressed && styles.refreshButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.refreshButtonText,

                  {
                    fontSize: 18,
                  },
                ]}
              >
                ⚙
              </Text>
            </Pressable>

            {/* Assignments - only when enabled */}

            {assignmentsEnabled ? (
              <Pressable
                onPress={handleOpenAssignments}
                style={({ pressed }) => [
                  styles.refreshButton,

                  {
                    width: 'auto',

                    minWidth: 0,

                    minHeight: 42,

                    paddingHorizontal: 10,

                    borderRadius: 10,

                    flexDirection: 'row',

                    alignItems: 'center',

                    justifyContent: 'center',

                    gap: 5,

                    flexShrink: 1,
                  },

                  pressed && styles.refreshButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.refreshButtonText,

                    {
                      fontSize: 12,
                    },
                  ]}
                >
                  👥
                </Text>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.refreshButtonText,

                    {
                      fontSize: 10,

                      fontWeight: '800',
                    },
                  ]}
                >
                  Assignments
                </Text>
              </Pressable>
            ) : null}

            {/* Refresh */}

            <Pressable
              onPress={handleRefreshCourses}
              disabled={headerRefreshing}
              style={({ pressed }) => [
                styles.refreshButton,

                {
                  width: 44,

                  minWidth: 44,

                  height: 42,

                  minHeight: 42,

                  paddingHorizontal: 0,

                  borderRadius: 10,

                  alignItems: 'center',

                  justifyContent: 'center',

                  flexShrink: 0,
                },

                pressed && !headerRefreshing && styles.refreshButtonPressed,

                headerRefreshing && styles.disabledButton,
              ]}
            >
              {headerRefreshing ? (
                <ActivityIndicator size="small" color={COLORS.TEXT} />
              ) : (
                <Text
                  style={[
                    styles.refreshButtonText,

                    {
                      fontSize: 19,
                    },
                  ]}
                >
                  ↻
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Search */}

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>

          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search course title, slug or ID"
            placeholderTextColor={COLORS.MUTED}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            style={styles.searchInput}
          />

          {searchText.length > 0 ? (
            <Pressable
              onPress={() => setSearchText('')}
              hitSlop={10}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </Pressable>
          ) : null}
        </View>

        {errorMessage && courses.length > 0 ? (
          <View style={styles.inlineError}>
            <Text style={styles.inlineErrorText}>{errorMessage}</Text>

            <Pressable onPress={handleRefreshCourses}>
              <Text style={styles.inlineRetryText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Courses */}

        <FlatList
          data={filteredCourses}
          extraData={{
            courseImageMap,
            assignmentsEnabled,
          }}
          keyExtractor={item => String(item.id)}
          renderItem={renderCourseTile}
          numColumns={2}
          columnWrapperStyle={styles.courseRow}
          contentContainerStyle={[
            styles.listContent,

            filteredCourses.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.BLUE}
              colors={[COLORS.BLUE]}
            />
          }
          onEndReached={loadMoreCourses}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={COLORS.BLUE} />

                <Text style={styles.footerLoaderText}>
                  Loading more courses...
                </Text>
              </View>
            ) : (
              <View style={styles.footerSpace} />
            )
          }
        />

        {/* Create Course */}

        <CreateCourseModal
          visible={createCourseModalVisible}
          onClose={handleCloseCreateCourse}
          onCreated={handleCourseCreated}
        />

        {/* Course Access Settings */}

        <CourseAccessSettingsModal
          visible={accessSettingsVisible}
          onClose={handleCloseAccessSettings}
          onSaved={handleAccessSettingsSaved}
        />

        {/* Assignments */}

        <CourseAssignmentsModal
          visible={assignmentsModalVisible}
          onClose={handleCloseAssignments}
        />
      </View>
    </SafeAreaView>
  );
}

function createCourseImageMap(catalogResponse) {
  const categories = Array.isArray(catalogResponse?.categories)
    ? catalogResponse.categories
    : [];

  const imageMap = {};

  categories.forEach(category => {
    const categoryCourses = Array.isArray(category?.courses)
      ? category.courses
      : [];

    categoryCourses.forEach(course => {
      if (!course?.id) {
        return;
      }

      const courseId = String(course.id);

      const imageUrl =
        typeof course?.image_url === 'string' && course.image_url.trim()
          ? course.image_url.trim()
          : null;

      /*
       * The same course can appear in
       * multiple categories. Never
       * replace a valid image with null.
       */
      if (imageUrl) {
        imageMap[courseId] = imageUrl;
      } else if (!(courseId in imageMap)) {
        imageMap[courseId] = null;
      }
    });
  });

  return imageMap;
}
