import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import styles, { COLORS } from './QuestionBank.styles';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { api } from '../../../api/client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const typeOptions = [
  { label: 'All Types', value: '' },
  { label: 'Single MCQ', value: 'single_mcq' },
  { label: 'Multiple MCQ', value: 'multiple_mcq' },
  { label: 'Long Form', value: 'long_form' },
];

const chapterOptions = [{ label: 'All Chapters', value: '' }];

export default function QuestionBank() {
  const navigation = useNavigation();
  const firstLoadDone = useRef(false);

  const [initialLoading, setInitialLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');

  const [type, setType] = useState('');
  const [classId, setClassId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [onlineCourseId, setOnlineCourseId] = useState('');
  const [chapterId, setChapterId] = useState('');

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const [classOptions, setClassOptions] = useState([
    { label: 'All Classes', value: '' },
  ]);

  const [courseOptions, setCourseOptions] = useState([
    { label: 'All Courses', value: '' },
  ]);

  const [onlineCourseOptions, setOnlineCourseOptions] = useState([
    { label: 'All Online Courses', value: '' },
  ]);

  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  const [deletingSelected, setDeletingSelected] = useState(false);

  const PER_PAGE = 20;

  useEffect(() => {
    let mounted = true;

    async function initQuestionBank() {
      try {
        setInitialLoading(true);

        await Promise.allSettled([
          loadClassGroups(''),
          loadCourses(''),
          loadOttCourses(''),
        ]);

        if (!mounted) return;

        await loadQuestions(1, true, {}, true);

        firstLoadDone.current = true;
      } catch (e) {
        console.log('QuestionBank init error', e);
        Alert.alert(
          'Question Bank',
          e?.message || 'Failed to initialize question bank.',
        );
        setInitialLoading(false);
      }
    }

    initQuestionBank();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!firstLoadDone.current) {
      return;
    }

    const timer = setTimeout(() => {
      loadQuestions(1, true);
    }, 350);

    return () => clearTimeout(timer);
  }, [search, type, classId, courseId, onlineCourseId, chapterId]);

  async function loadQuestions(
    pageNumber = 1,
    reset = false,
    overrideFilters = {},
    showFullPageLoader = false,
  ) {
    try {
      if (showFullPageLoader) {
        setInitialLoading(true);
      } else if (pageNumber === 1) {
        setListLoading(true);
      } else {
        setRefreshing(true);
      }

      const filters = {
        search,
        type,
        classId,
        courseId,
        onlineCourseId,
        chapterId,
        ...overrideFilters,
      };

      const query = new URLSearchParams();

      query.append('page', String(pageNumber));
      query.append('per_page', String(PER_PAGE));

      // API uses q, not search
      query.append('q', filters.search || '');

      // API uses type
      query.append('type', filters.type || '');

      // Keep these only if your backend supports them on /api/questions
      if (filters.classId) query.append('class_group_id', filters.classId);
      if (filters.courseId) query.append('course_id', filters.courseId);
      if (filters.onlineCourseId)
        query.append('ottcourse_id', filters.onlineCourseId);
      if (filters.chapterId) query.append('chapter_id', filters.chapterId);

      const res = await api(`/api/questions?${query.toString()}`);

      const list = Array.isArray(res?.rows) ? res.rows : [];
      const apiTotal = Number(res?.count || 0);
      const apiLastPage = Math.max(1, Math.ceil(apiTotal / PER_PAGE));

      setPage(pageNumber);
      setLastPage(apiLastPage);
      setTotal(apiTotal);

      if (pageNumber === 1) {
        setQuestions(list);
        setSelectedQuestionIds([]);
      } else {
        setQuestions(prev => [...prev, ...list]);
      }
    } catch (e) {
      console.log('QuestionBank load error', e);
      Alert.alert('Question Bank', e?.message || 'Failed to load questions.');
    } finally {
      setInitialLoading(false);
      setListLoading(false);
      setRefreshing(false);
    }
  }

  async function loadClassGroups(q = '') {
    try {
      const res = await api(
        `/api/questions/class-groups?q=${encodeURIComponent(q)}`,
      );

      const classes = Array.isArray(res?.classes) ? res.classes : [];

      const options = [
        { label: 'All Classes', value: '' },
        ...classes.map(item => ({
          label: item.label,
          value: String(item.id),
        })),
      ];

      setClassOptions(options);
    } catch (e) {
      console.log('Class groups load error', e);
      setClassOptions([{ label: 'All Classes', value: '' }]);
    }
  }

  async function loadCourses(q = '') {
    try {
      const res = await api(
        `/api/questions/courses?q=${encodeURIComponent(q)}`,
      );

      const courses = Array.isArray(res?.courses) ? res.courses : [];

      const options = [
        { label: 'All Courses', value: '' },
        ...courses.map(item => ({
          label: item.label,
          value: String(item.id),
        })),
      ];

      setCourseOptions(options);
    } catch (e) {
      console.log('Courses load error', e);
      setCourseOptions([{ label: 'All Courses', value: '' }]);
    }
  }

  async function loadOttCourses(q = '') {
    try {
      const res = await api(
        `/api/questions/ottcourses?q=${encodeURIComponent(q)}`,
      );

      const ottcourses = Array.isArray(res?.ottcourses) ? res.ottcourses : [];

      const options = [
        { label: 'All Online Courses', value: '' },
        ...ottcourses.map(item => ({
          label: item.title,
          value: String(item.id),
        })),
      ];

      setOnlineCourseOptions(options);
    } catch (e) {
      console.log('Online courses load error', e);
      setOnlineCourseOptions([{ label: 'All Online Courses', value: '' }]);
    }
  }

  function clearFilters() {
    const alreadyClear =
      !search &&
      !type &&
      !classId &&
      !courseId &&
      !onlineCourseId &&
      !chapterId;

    setSearch('');
    setType('');
    setClassId('');
    setCourseId('');
    setOnlineCourseId('');
    setChapterId('');

    if (alreadyClear) {
      loadQuestions(1, true, {
        search: '',
        type: '',
        classId: '',
        courseId: '',
        onlineCourseId: '',
        chapterId: '',
      });
    }
  }

  async function deleteQuestion(item) {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api(`/api/questions/${item.id}`, {
                method: 'DELETE',
              });

              setQuestions(prev => prev.filter(q => q.id !== item.id));

              setSelectedQuestionIds(prev =>
                prev.filter(id => id !== Number(item.id)),
              );
            } catch (e) {
              Alert.alert(
                'Delete Failed',
                e?.message || 'Could not delete question.',
              );
            }
          },
        },
      ],
    );
  }

  const deleteSelectedQuestions = () => {
    if (deletingSelected || selectedQuestionIds.length === 0) {
      return;
    }

    const questionIds = [
      ...new Set(
        selectedQuestionIds
          .map(Number)
          .filter(id => Number.isInteger(id) && id > 0),
      ),
    ];

    if (questionIds.length === 0) {
      return;
    }

    Alert.alert(
      'Delete Selected Questions',
      `Are you sure you want to delete ${questionIds.length} selected question(s)? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingSelected(true);

            try {
              const response = await api('/api/questions/bulk-delete', {
                method: 'POST',
                body: JSON.stringify({
                  question_ids: questionIds,
                }),
              });

              if (response?.ok !== true) {
                throw new Error('Could not delete selected questions.');
              }

              // Clear selection after successful delete.
              setSelectedQuestionIds([]);

              // Reload first page, total count and pagination.
              await loadQuestions(1, true);

              Alert.alert(
                'Delete Successful',
                `${
                  response.deleted_count ?? questionIds.length
                } question(s) deleted successfully.`,
              );
            } catch (error) {
              console.log('[BULK DELETE ERROR]', {
                status: error?.status,
                message: error?.message,
                payload: error?.payload,
              });

              Alert.alert(
                'Delete Failed',
                error?.message || 'Unable to delete selected questions.',
              );
            } finally {
              setDeletingSelected(false);
            }
          },
        },
      ],
    );
  };

  function getOptions(item) {
    if (Array.isArray(item?.choices)) return item.choices;
    if (Array.isArray(item?.options)) return item.options;

    const options = [];

    if (item?.option_a) options.push(item.option_a);
    if (item?.option_b) options.push(item.option_b);
    if (item?.option_c) options.push(item.option_c);
    if (item?.option_d) options.push(item.option_d);

    return options;
  }

  function isCorrectOption(item, option, index) {
    if (Array.isArray(item?.correct_answers)) {
      return item.correct_answers.map(Number).includes(index);
    }

    const correct =
      item?.correct_answer ||
      item?.answer ||
      item?.correct_option ||
      item?.right_answer;

    if (!correct) return false;

    return (
      String(correct).toLowerCase() === String(option).toLowerCase() ||
      String(correct).toLowerCase() === String(index + 1).toLowerCase() ||
      String(correct).toLowerCase() === String.fromCharCode(97 + index)
    );
  }

  function formatType(value) {
    if (!value) return 'Unknown';

    return String(value)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  function getClassNames(item) {
    const classes = Array.isArray(item?.class_groups) ? item.class_groups : [];

    if (classes.length) {
      return classes
        .map(cls => {
          if (cls?.section) return `${cls.name} (${cls.section})`;
          return cls?.name;
        })
        .filter(Boolean)
        .join(', ');
    }

    return item?.class_name || item?.class || '-';
  }

  function getCourseNames(item) {
    const courses = Array.isArray(item?.courses) ? item.courses : [];

    if (courses.length) {
      return courses
        .map(course => course?.title)
        .filter(Boolean)
        .join(', ');
    }

    return item?.course_name || item?.course || '-';
  }

  function getChapterName(item) {
    return item?.chapter?.title || item?.chapter_name || item?.chapter || '-';
  }

  function getOttCourseName(item) {
    return (
      item?.chapter?.ottcourse?.title ||
      item?.online_course_name ||
      item?.ott_course_name ||
      item?.online_course ||
      item?.ott_course ||
      '-'
    );
  }

  const toggleQuestionSelection = questionId => {
    const id = Number(questionId);

    setSelectedQuestionIds(previous =>
      previous.includes(id)
        ? previous.filter(item => item !== id)
        : [...previous, id],
    );
  };

  const selectAllQuestions = () => {
    setSelectedQuestionIds(
      questions
        .map(item => Number(item.id))
        .filter(id => Number.isInteger(id) && id > 0),
    );
  };

  const deselectAllQuestions = () => {
    setSelectedQuestionIds([]);
  };

  const selectedCount = selectedQuestionIds.length;

  function renderQuestion({ item }) {
    const options = getOptions(item);

    const metaParts = [
      {
        label: 'Classes',
        value: getClassNames(item),
      },
      {
        label: 'Courses',
        value: getCourseNames(item),
      },
      {
        label: 'Chapter',
        value: getChapterName(item),
      },
      {
        label: 'OttCourse',
        value: getOttCourseName(item),
      },
    ].filter(part => {
      const value = String(part.value || '').trim();

      return value && value !== '-' && value.toLowerCase() !== 'null';
    });

    return (
      <View style={styles.questionCard}>
        <View style={styles.questionTopRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {formatType(item?.type || item?.question_type)}
            </Text>
          </View>
          <Pressable
            onPress={() => toggleQuestionSelection(item.id)}
            hitSlop={10}
            accessibilityRole="checkbox"
            accessibilityLabel={`Select question ${item.id}`}
            accessibilityState={{
              checked: selectedQuestionIds.includes(Number(item.id)),
            }}
            style={styles.questionCheckboxButton}
          >
            <MaterialCommunityIcons
              name={
                selectedQuestionIds.includes(Number(item.id))
                  ? 'checkbox-marked'
                  : 'checkbox-blank-outline'
              }
              size={25}
              color={
                selectedQuestionIds.includes(Number(item.id))
                  ? '#60A5FA'
                  : '#94A3B8'
              }
            />
          </Pressable>
        </View>

        <Text style={styles.questionTitle}>
          {item?.content ||
            item?.question ||
            item?.title ||
            'Untitled Question'}
        </Text>

        {/* Long Form Model Answer */}
        {(item?.type === 'long_form' || item?.question_type === 'long_form') &&
          String(item?.model_answer || '').trim().length > 0 && (
            <Text style={styles.modelAnswer}>
              {String(item.model_answer).trim()}
            </Text>
          )}

        {/* MCQ Options */}
        {options.map((option, index) => {
          const correct = isCorrectOption(item, option, index);

          return (
            <View key={`${item.id}-${index}`} style={styles.optionRow}>
              <Text
                style={correct ? styles.correctOptionMark : styles.optionMark}
              >
                {correct ? '✅' : '•'}
              </Text>

              <Text style={styles.optionText}>{option}</Text>
            </View>
          );
        })}

        {metaParts.length > 0 ? (
          <Text style={styles.metaText}>
            {metaParts.map(part => `${part.label}: ${part.value}`).join(' | ')}
          </Text>
        ) : null}

        <View style={styles.actionRow}>
          <Pressable
            onPress={() =>
              navigation.navigate('QuestionForm', { question: item })
            }
            style={styles.editButton}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>

          <Pressable
            onPress={() => deleteQuestion(item)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (initialLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topButtonRow}
        >
          <Pressable
            onPress={() => loadQuestions(1, true)}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Refresh</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('AIGenerator')}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>AI Generator</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('QuestionForm')}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>+ Add Question</Text>
          </Pressable>
        </ScrollView>

        {/* Bulk Question Actions */}
        <View style={styles.bulkActionsContainer}>
          <View style={styles.bulkActionsRow}>
            <Pressable
              disabled={questions.length === 0 || deletingSelected}
              onPress={selectAllQuestions}
              style={[
                styles.selectAllButton,
                (questions.length === 0 || deletingSelected) &&
                  styles.bulkButtonDisabled,
              ]}
            >
              <MaterialCommunityIcons
                name="checkbox-multiple-marked-outline"
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.bulkButtonText}>Select All</Text>
            </Pressable>

            <Pressable
              disabled={selectedCount === 0 || deletingSelected}
              onPress={deselectAllQuestions}
              style={[
                styles.deselectAllButton,
                (selectedCount === 0 || deletingSelected) &&
                  styles.bulkButtonDisabled,
              ]}
            >
              <MaterialCommunityIcons
                name="checkbox-multiple-blank-outline"
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.bulkButtonText}>Deselect All</Text>
            </Pressable>

            <Pressable
              disabled={selectedCount === 0 || deletingSelected}
              onPress={deleteSelectedQuestions}
              style={[
                styles.deleteSelectedButton,
                (selectedCount === 0 || deletingSelected) &&
                  styles.bulkButtonDisabled,
              ]}
            >
              {deletingSelected ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={16}
                  color="#FFFFFF"
                />
              )}

              <Text style={styles.bulkButtonText}>
                {deletingSelected ? 'Deleting...' : 'Delete Selected'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.selectedCountText}>
            {selectedCount} of {questions.length} loaded questions selected
          </Text>
        </View>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search questions..."
          placeholderTextColor={COLORS.MUTED}
          style={styles.searchInput}
        />

        <View style={styles.filterPanel}>
          <Pressable
            onPress={() => setFiltersExpanded(current => !current)}
            style={styles.filterHeader}
          >
            <View style={styles.filterHeaderText}>
              <Text style={styles.filterTitle}>Filter Questions</Text>

              <Text style={styles.filterSubtitle}>
                {filtersExpanded
                  ? 'Hide filter options'
                  : 'Tap to show filter options'}
              </Text>
            </View>

            <View style={styles.filterHeaderActions}>
              {type || classId || courseId || onlineCourseId || chapterId ? (
                <Pressable
                  onPress={event => {
                    event.stopPropagation?.();
                    clearFilters();
                  }}
                  style={({ pressed }) => [
                    styles.clearFilterButton,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.clearFilterButtonText}>Clear</Text>
                </Pressable>
              ) : null}

              <MaterialCommunityIcons
                name={filtersExpanded ? 'chevron-up' : 'chevron-down'}
                size={22}
                color="#AFC0D8"
              />
            </View>
          </Pressable>

          {filtersExpanded ? (
            <View style={styles.filterBody}>
              {/* First row */}
              <View style={styles.filterRowTwo}>
                <View style={styles.filterFieldHalf}>
                  <Text style={styles.filterLabel}>Question Type</Text>

                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownSelectedText}
                    itemTextStyle={styles.dropdownItemText}
                    containerStyle={styles.dropdownContainer}
                    activeColor="#173B60"
                    iconColor="#AFC0D8"
                    data={typeOptions}
                    maxHeight={220}
                    labelField="label"
                    valueField="value"
                    placeholder="All Types"
                    value={type}
                    onChange={item => setType(item.value)}
                  />
                </View>

                <View style={styles.filterFieldHalf}>
                  <Text style={styles.filterLabel}>Class</Text>

                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownSelectedText}
                    itemTextStyle={styles.dropdownItemText}
                    inputSearchStyle={styles.dropdownSearchInput}
                    containerStyle={styles.dropdownContainer}
                    activeColor="#173B60"
                    iconColor="#AFC0D8"
                    data={classOptions}
                    search
                    searchPlaceholder="Search class..."
                    maxHeight={260}
                    labelField="label"
                    valueField="value"
                    placeholder="All Classes"
                    value={classId}
                    onChange={item => setClassId(item.value)}
                    onChangeText={loadClassGroups}
                  />
                </View>
              </View>

              {/* Second row */}
              <View style={styles.filterRowThree}>
                <View style={styles.filterFieldThird}>
                  <Text style={styles.filterLabel}>Course</Text>

                  <Dropdown
                    style={styles.dropdownCompact}
                    placeholderStyle={styles.dropdownPlaceholderCompact}
                    selectedTextStyle={styles.dropdownSelectedTextCompact}
                    itemTextStyle={styles.dropdownItemText}
                    containerStyle={styles.dropdownContainer}
                    activeColor="#173B60"
                    iconColor="#AFC0D8"
                    data={courseOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="All Courses"
                    value={courseId}
                    onChange={item => setCourseId(item.value)}
                  />
                </View>

                <View style={styles.filterFieldThird}>
                  <Text style={styles.filterLabel}>Online Course</Text>

                  <Dropdown
                    style={styles.dropdownCompact}
                    placeholderStyle={styles.dropdownPlaceholderCompact}
                    selectedTextStyle={styles.dropdownSelectedTextCompact}
                    itemTextStyle={styles.dropdownItemText}
                    containerStyle={styles.dropdownContainer}
                    activeColor="#173B60"
                    iconColor="#AFC0D8"
                    data={onlineCourseOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="All Online"
                    value={onlineCourseId}
                    onChange={item => setOnlineCourseId(item.value)}
                  />
                </View>

                <View style={styles.filterFieldThird}>
                  <Text style={styles.filterLabel}>Chapter</Text>

                  <Dropdown
                    style={styles.dropdownCompact}
                    placeholderStyle={styles.dropdownPlaceholderCompact}
                    selectedTextStyle={styles.dropdownSelectedTextCompact}
                    itemTextStyle={styles.dropdownItemText}
                    containerStyle={styles.dropdownContainer}
                    activeColor="#173B60"
                    iconColor="#AFC0D8"
                    data={chapterOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="All Chapters"
                    value={chapterId}
                    onChange={item => setChapterId(item.value)}
                  />
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {listLoading ? (
          <View style={styles.listLoading}>
            <ActivityIndicator color="#67D1F0" />

            <Text style={styles.loadingText}>Loading questions...</Text>
          </View>
        ) : (
          <View style={styles.listArea}>
            <FlatList
              data={questions}
              keyExtractor={(item, index) => String(item?.id || index)}
              renderItem={renderQuestion}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <Text style={styles.showingText}>
                  Showing {questions.length} of {total} questions
                </Text>
              }
              ListEmptyComponent={
                <Text style={styles.emptyText}>No questions found.</Text>
              }
              ListFooterComponent={
                page < lastPage ? (
                  <Pressable
                    disabled={refreshing}
                    onPress={() => loadQuestions(page + 1, false)}
                    style={({ pressed }) => [
                      styles.loadMoreButton,

                      pressed && styles.controlPressed,
                    ]}
                  >
                    <Text style={styles.loadMoreText}>
                      {refreshing ? 'Loading...' : 'Load More'}
                    </Text>
                  </Pressable>
                ) : null
              }
            />
          </View>
        )}
      </View>
    </View>
  );
}
