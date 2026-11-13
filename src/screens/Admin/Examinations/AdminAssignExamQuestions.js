// src/screens/Admin/Examinations/AdminAssignExamQuestions.js

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
  Text,
  TextInput,
  View,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';
import styles from './AdminAssignExamQuestions.styles';
import { useFocusEffect } from '@react-navigation/native';

const PER_PAGE = 20;

const QUESTION_TYPE_OPTIONS = [
  { label: 'All Types', value: 'all' },
  { label: 'Single MCQ', value: 'single_mcq' },
  { label: 'Multiple MCQ', value: 'multiple_mcq' },
  { label: 'Long Form', value: 'long_form' },
];

function normalizeQuestion(question) {
  return {
    ...question,
    id: Number(question?.id),
    type: String(question?.type || ''),
    content: String(question?.content || ''),
    chapter: question?.chapter || null,
    courses: Array.isArray(question?.courses) ? question.courses : [],
  };
}

function getQuestionTypeLabel(type) {
  switch (String(type || '').toLowerCase()) {
    case 'single_mcq':
      return 'MCQ (Single)';
    case 'multiple_mcq':
      return 'MCQ (Multiple)';
    case 'long_form':
      return 'Long Form';
    default:
      return 'Question';
  }
}

function getAssignedQuestionId(question) {
  return Number(
    question?.question_id ?? question?.id ?? question?.question?.id,
  );
}

function getAssignedQuestionContent(question) {
  return String(
    question?.content ??
      question?.text ??
      question?.question?.content ??
      question?.question?.text ??
      'Assigned question',
  );
}

function getAssignedQuestionType(question) {
  return String(question?.type ?? question?.question?.type ?? '');
}

function getAssignedMarks(question) {
  const value = Number(
    question?.marks ??
      question?.score ??
      question?.max_marks ??
      question?.pivot?.marks ??
      10,
  );

  return Number.isFinite(value) && value >= 0 ? value : 10;
}

function SelectModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
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

          <FlatList
            data={options}
            keyExtractor={item => String(item.value)}
            style={styles.selectOptionsList}
            renderItem={({ item }) => {
              const selected = item.value === selectedValue;

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

export default function AdminAssignExamQuestions({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 760;

  const searchInitializedRef = useRef(false);

  const focusReloadInitializedRef = useRef(false);

  const searchTextRef = useRef('');

  const examId = route?.params?.examId;
  const examName = route?.params?.examName || 'Exam Paper';
  const classGroupId = Number(route?.params?.classGroupId);
  const className = route?.params?.className || 'Exam Class';
  const courseId = Number(route?.params?.courseId);
  const courseTitle = route?.params?.courseTitle || 'Exam Course';

  const [onlineCourses, setOnlineCourses] = useState([]);
  const [questionRows, setQuestionRows] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [assignedQuestions, setAssignedQuestions] = useState([]);
  const [marksInfo, setMarksInfo] = useState({
    totalMarks: null,
    extraMarks: 0,
    questionMarksTarget: null,
  });

  const maxExamMarks = marksInfo.questionMarksTarget;
  const marksLimitReady = maxExamMarks !== null;

  const [selectedBankIds, setSelectedBankIds] = useState(new Set());
  const [selectedAssignedIds, setSelectedAssignedIds] = useState(new Set());

  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    searchTextRef.current = searchText;
  }, [searchText]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedOnlineCourseId, setSelectedOnlineCourseId] = useState('all');

  const [page, setPage] = useState(1);

  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [onlineCourseModalVisible, setOnlineCourseModalVisible] =
    useState(false);

  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [loading, setLoading] = useState(true);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalPages = Math.max(1, Math.ceil(questionCount / PER_PAGE));

  const onlineCourseOptions = useMemo(
    () => [
      { label: 'All Online Courses', value: 'all' },
      ...onlineCourses.map(item => ({
        label: item.title,
        value: String(item.id),
      })),
    ],
    [onlineCourses],
  );

  const filteredQuestionRows = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return questionRows.filter(question => {
      const alreadyAssigned = assignedQuestions.some(
        assignedQuestion => Number(assignedQuestion.id) === Number(question.id),
      );

      if (alreadyAssigned) {
        return false;
      }

      const matchesSearch =
        !query || question.content.toLowerCase().includes(query);

      const matchesType =
        selectedType === 'all' || question.type === selectedType;

      const questionOnlineCourseId = question?.chapter?.ottcourse?.id;

      const matchesOnlineCourse =
        selectedOnlineCourseId === 'all' ||
        String(questionOnlineCourseId) === String(selectedOnlineCourseId);

      return matchesSearch && matchesType && matchesOnlineCourse;
    });
  }, [
    questionRows,
    assignedQuestions,
    searchText,
    selectedOnlineCourseId,
    selectedType,
  ]);

  const assignedIdSet = useMemo(
    () => new Set(assignedQuestions.map(question => Number(question.id))),
    [assignedQuestions],
  );

  const totalAssignedMarks = useMemo(
    () =>
      assignedQuestions.reduce(
        (sum, question) => sum + Number(question.marks || 0),
        0,
      ),
    [assignedQuestions],
  );

  const questionRequestUrl = useCallback(
    (requestedPage, searchValue = '') => {
      const params = [
        `q=${encodeURIComponent(String(searchValue || '').trim())}`,
        `class_group_id=${encodeURIComponent(classGroupId)}`,
        'active_only=1',
        `course_id=${encodeURIComponent(courseId)}`,
        `page=${encodeURIComponent(requestedPage)}`,
        `per_page=${PER_PAGE}`,
      ];

      return `/api/questions?${params.join('&')}`;
    },
    [classGroupId, courseId],
  );

  const loadQuestionPage = useCallback(
    async (requestedPage, searchValue = '') => {
      try {
        setQuestionLoading(true);

        const response = await api(
          questionRequestUrl(requestedPage, searchValue),
        );

        const rows = Array.isArray(response?.rows) ? response.rows : [];

        setQuestionRows(
          rows
            .map(normalizeQuestion)
            .filter(question => Number.isFinite(question.id)),
        );

        setQuestionCount(Number(response?.count || 0));

        setPage(requestedPage);
        setSelectedBankIds(new Set());
      } catch (error) {
        console.log('Question bank load error:', error);

        Alert.alert(
          'Assign Questions',
          error?.message || 'Could not load question bank.',
        );
      } finally {
        setQuestionLoading(false);
      }
    },
    [questionRequestUrl],
  );

  const loadInitialData = useCallback(
    async ({ refresh = false } = {}) => {
      if (
        !examId ||
        !Number.isFinite(classGroupId) ||
        !Number.isFinite(courseId)
      ) {
        Alert.alert(
          'Assign Questions',
          'Exam, class, or course information is missing.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
        return;
      }

      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [onlineCoursesResponse, assignedResponse, questionsResponse] =
          await Promise.all([
            api(
              `/api/questions/ottcourses?q=&class_group_id=${encodeURIComponent(
                classGroupId,
              )}`,
            ),
            api(`/api/exams/${examId}/questions`),
            api(questionRequestUrl(1, '')),
          ]);

        const totalMarks = Number(assignedResponse?.total_marks);

        const extraMarks = Number(assignedResponse?.extra_marks ?? 0);

        const questionMarksTarget = Number(
          assignedResponse?.question_marks_target,
        );

        if (
          assignedResponse?.question_marks_target == null ||
          !Number.isFinite(questionMarksTarget) ||
          questionMarksTarget < 0
        ) {
          throw new Error(
            'Question paper marks target was not returned by the API.',
          );
        }

        setMarksInfo({
          totalMarks: Number.isFinite(totalMarks) ? totalMarks : null,

          extraMarks: Number.isFinite(extraMarks) ? extraMarks : 0,

          questionMarksTarget,
        });

        console.log('[EXAM QUESTION MARKS]', {
          totalMarks,
          extraMarks,
          questionMarksTarget,
        });

        const courseRows = Array.isArray(onlineCoursesResponse?.ottcourses)
          ? onlineCoursesResponse.ottcourses
          : [];

        setOnlineCourses(
          courseRows
            .map(item => ({
              id: Number(item?.id),
              title: String(item?.title || 'Untitled online course'),
            }))
            .filter(item => Number.isFinite(item.id)),
        );

        const assignedRows = Array.isArray(assignedResponse?.questions)
          ? assignedResponse.questions
          : Array.isArray(assignedResponse?.rows)
          ? assignedResponse.rows
          : [];

        setAssignedQuestions(
          assignedRows
            .map(item => ({
              id: getAssignedQuestionId(item),
              content: getAssignedQuestionContent(item),
              type: getAssignedQuestionType(item),
              marks: getAssignedMarks(item),
            }))
            .filter(item => Number.isFinite(item.id)),
        );

        const rows = Array.isArray(questionsResponse?.rows)
          ? questionsResponse.rows
          : [];

        setQuestionRows(
          rows
            .map(normalizeQuestion)
            .filter(question => Number.isFinite(question.id)),
        );

        setQuestionCount(Number(questionsResponse?.count || 0));

        setPage(1);
        setSelectedBankIds(new Set());
        setSelectedAssignedIds(new Set());

        navigation.setOptions({
          title: 'Assign Questions',
        });
      } catch (error) {
        console.log('Assign questions load error:', error);

        Alert.alert(
          'Assign Questions',
          error?.message || 'Could not load questions.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [classGroupId, courseId, examId, navigation, questionRequestUrl],
  );

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useFocusEffect(
    useCallback(() => {
      if (!focusReloadInitializedRef.current) {
        focusReloadInitializedRef.current = true;
        return;
      }

      loadQuestionPage(1, searchTextRef.current.trim());
    }, [loadQuestionPage]),
  );

  useEffect(() => {
    if (!searchInitializedRef.current) {
      searchInitializedRef.current = true;
      return;
    }

    const timer = setTimeout(() => {
      loadQuestionPage(1, searchText.trim());
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText, loadQuestionPage]);

  function toggleBankQuestion(questionId) {
    setSelectedBankIds(current => {
      const next = new Set(current);

      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }

      return next;
    });
  }

  function toggleAssignedQuestion(questionId) {
    setSelectedAssignedIds(current => {
      const next = new Set(current);

      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }

      return next;
    });
  }

  function addSelectedQuestions() {
    const selectedRows = questionRows.filter(question =>
      selectedBankIds.has(question.id),
    );

    if (selectedRows.length === 0) {
      return;
    }

    const newQuestions = selectedRows
      .filter(question => !assignedIdSet.has(question.id))
      .map(question => ({
        id: question.id,
        content: question.content,
        type: question.type,
        marks: 10,
      }));

    if (newQuestions.length === 0) {
      setSelectedBankIds(new Set());
      return;
    }

    if (!marksLimitReady) {
      Alert.alert(
        'Marks unavailable',
        'Question paper marks limit has not loaded yet.',
      );
      return;
    }

    const projectedMarks = totalAssignedMarks + newQuestions.length * 10;

    if (projectedMarks > maxExamMarks) {
      Alert.alert(
        'Marks limit exceeded',
        `Adding these questions would exceed ${maxExamMarks} marks.`,
      );
      return;
    }

    setAssignedQuestions(current => [...current, ...newQuestions]);

    setSelectedBankIds(new Set());
  }

  function removeSelectedQuestions() {
    if (selectedAssignedIds.size === 0) {
      return;
    }

    setAssignedQuestions(current =>
      current.filter(question => !selectedAssignedIds.has(question.id)),
    );

    setSelectedAssignedIds(new Set());
  }

  function updateAssignedMarks(questionId, value) {
    const numericValue = Number(String(value).replace(/[^0-9]/g, ''));

    setAssignedQuestions(current =>
      current.map(question =>
        question.id === questionId
          ? {
              ...question,
              marks: Number.isFinite(numericValue)
                ? Math.min(numericValue, Math.max(0, maxExamMarks ?? 0))
                : 0,
            }
          : question,
      ),
    );
  }

  const activeAdvancedFilterCount = useMemo(() => {
    let count = 0;

    if (selectedType !== 'all') {
      count += 1;
    }

    if (selectedOnlineCourseId !== 'all') {
      count += 1;
    }

    return count;
  }, [selectedType, selectedOnlineCourseId]);

  function clearFilters() {
    setSearchText('');
    setSelectedType('all');
    setSelectedOnlineCourseId('all');
  }

  function openAddQuestion() {
    navigation.navigate('QuestionForm', {
      source: 'assign_exam_questions',

      examId,
      examName,

      presetClassGroupId: classGroupId,
      presetClassName: className,

      presetCourseId: courseId,
      presetCourseTitle: courseTitle,
    });
  }

  async function reloadQuestionBank() {
    await loadQuestionPage(page);
  }

  async function goToPage(nextPage) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }

    await loadQuestionPage(nextPage);
  }

  async function saveQuestions() {
    if (saving) {
      return;
    }

    if (assignedQuestions.length === 0) {
      Alert.alert('Questions required', 'Please assign at least one question.');
      return;
    }

    if (!marksLimitReady) {
      Alert.alert(
        'Marks unavailable',
        'Unable to confirm the question paper marks target.',
      );
      return;
    }

    if (totalAssignedMarks > maxExamMarks) {
      Alert.alert(
        'Marks limit exceeded',
        `Total assigned marks cannot exceed ${maxExamMarks}.`,
      );
      return;
    }

    const assignments = assignedQuestions.map(question => ({
      id: Number(question.id),
      marks: Number(question.marks || 0),
    }));

    const hasInvalidAssignment = assignments.some(
      assignment =>
        !Number.isFinite(assignment.id) ||
        !Number.isFinite(assignment.marks) ||
        assignment.marks <= 0,
    );

    if (hasInvalidAssignment) {
      Alert.alert(
        'Invalid marks',
        'Every assigned question must have valid marks greater than zero.',
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        assignments,
      };

      console.log('Assign questions payload:', payload);

      const response = await api(`/api/exams/${examId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!Array.isArray(response?.questions)) {
        throw new Error('Invalid response while saving questions.');
      }

      navigation.goBack();
    } catch (error) {
      console.log('Assign questions save error:', error);

      Alert.alert(
        'Save failed',
        error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          'Could not save exam questions.',
      );
    } finally {
      setSaving(false);
    }
  }

  function renderQuestionBankItem({ item }) {
    const selected = selectedBankIds.has(item.id);

    return (
      <Pressable
        onPress={() => toggleBankQuestion(item.id)}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: selected,
        }}
        style={({ pressed }) => [
          styles.questionCard,
          pressed && styles.controlPressed,
        ]}
      >
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>

        <Text style={styles.questionContent}>{item.content}</Text>

        <View style={styles.questionTypeBadge}>
          <Text style={styles.questionTypeText}>
            {getQuestionTypeLabel(item.type)}
          </Text>
        </View>
      </Pressable>
    );
  }

  function renderAssignedQuestion({ item }) {
    const selected = selectedAssignedIds.has(item.id);

    return (
      <Pressable
        onPress={() => toggleAssignedQuestion(item.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
        style={({ pressed }) => [
          styles.assignedQuestionCard,
          selected && styles.assignedQuestionCardSelected,
          pressed && styles.controlPressed,
        ]}
      >
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>

        <View style={styles.assignedQuestionBody}>
          <Text style={styles.assignedQuestionContent}>{item.content}</Text>
        </View>

        <TextInput
          value={String(item.marks)}
          onChangeText={value => updateAssignedMarks(item.id, value)}
          keyboardType="number-pad"
          maxLength={3}
          style={styles.marksInput}
        />
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  const startIndex = questionCount === 0 ? 0 : (page - 1) * PER_PAGE + 1;

  const endIndex = Math.min(page * PER_PAGE, questionCount);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.screenContent,
        {
          paddingBottom: Math.max(insets.bottom, 24),
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      <View style={styles.headerCard}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextSection}>
            <Text style={styles.pageTitle}>Assign Questions</Text>

            <Text numberOfLines={2} style={styles.examName}>
              {examName}
            </Text>
          </View>

          <Pressable
            onPress={openAddQuestion}
            style={({ pressed }) => [
              styles.addQuestionButton,
              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.addQuestionButtonText}>+ Add Question</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.filtersCard}>
        {/* Search is always visible */}
        <View style={styles.fullWidthFilterRow}>
          <View style={styles.filterFieldFull}>
            <Text style={styles.filterLabel}>Search Question Bank</Text>

            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Text contains..."
              placeholderTextColor="#64748B"
              style={styles.filterInput}
            />
          </View>
        </View>

        {/* More Options */}
        <Pressable
          onPress={() => setShowMoreFilters(current => !current)}
          style={({ pressed }) => [
            styles.moreOptionsButton,
            pressed && styles.controlPressed,
          ]}
        >
          <Text style={styles.moreOptionsText}>
            More Options
            {activeAdvancedFilterCount > 0
              ? ` (${activeAdvancedFilterCount})`
              : ''}
          </Text>

          <Text style={styles.moreOptionsArrow}>
            {showMoreFilters ? '▲' : '▼'}
          </Text>
        </Pressable>

        {/* Advanced filters */}
        {showMoreFilters ? (
          <View style={styles.advancedFilters}>
            {/* Filter by Type */}
            <View style={styles.fullWidthFilterRow}>
              <View style={styles.filterFieldFull}>
                <Text style={styles.filterLabel}>Filter by Type</Text>

                <Pressable
                  onPress={() => setTypeModalVisible(true)}
                  style={({ pressed }) => [
                    styles.selectField,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.selectFieldText}>
                    {
                      QUESTION_TYPE_OPTIONS.find(
                        option => option.value === selectedType,
                      )?.label
                    }
                  </Text>

                  <Text style={styles.selectArrow}>⌄</Text>
                </Pressable>
              </View>
            </View>

            {/* Class + Course */}
            <View style={styles.twoColumnRow}>
              <View style={styles.halfFilterField}>
                <Text style={styles.filterLabel}>Class (locked to exam)</Text>

                <View style={styles.lockedField}>
                  <Text numberOfLines={1} style={styles.lockedFieldText}>
                    {className}
                  </Text>
                </View>
              </View>

              <View style={styles.halfFilterField}>
                <Text style={styles.filterLabel}>Course (locked to exam)</Text>

                <View style={styles.lockedField}>
                  <Text numberOfLines={1} style={styles.lockedFieldText}>
                    {courseTitle}
                  </Text>
                </View>
              </View>
            </View>

            {/* Online Course + Chapter */}
            <View style={styles.twoColumnRow}>
              <View style={styles.halfFilterField}>
                <Text style={styles.filterLabel}>Filter by Online Course</Text>

                <Pressable
                  onPress={() => setOnlineCourseModalVisible(true)}
                  style={({ pressed }) => [
                    styles.selectField,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text numberOfLines={1} style={styles.selectFieldText}>
                    {
                      onlineCourseOptions.find(
                        option => option.value === selectedOnlineCourseId,
                      )?.label
                    }
                  </Text>

                  <Text style={styles.selectArrow}>⌄</Text>
                </Pressable>
              </View>

              <View style={styles.halfFilterField}>
                <Text style={styles.filterLabel}>Filter by Chapter</Text>

                <View style={[styles.lockedField, styles.disabledField]}>
                  <Text numberOfLines={1} style={styles.lockedFieldText}>
                    All Chapters
                  </Text>

                  <Text style={styles.selectArrow}>⌄</Text>
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.toolbar}>
        <View style={styles.paginationRow}>
          <Text style={styles.paginationText}>
            Showing {startIndex}-{endIndex} of {questionCount}
          </Text>

          <Pressable
            onPress={() => goToPage(page - 1)}
            disabled={page <= 1 || questionLoading}
            style={({ pressed }) => [
              styles.pageButton,
              (page <= 1 || questionLoading) && styles.controlDisabled,
              pressed && page > 1 && !questionLoading && styles.controlPressed,
            ]}
          >
            <Text style={styles.pageButtonText}>Prev</Text>
          </Pressable>

          <View style={styles.currentPageButton}>
            <Text style={styles.currentPageText}>{page}</Text>
          </View>

          {page < totalPages ? (
            <Pressable
              onPress={() => goToPage(page + 1)}
              disabled={questionLoading}
              style={({ pressed }) => [
                styles.pageButton,
                questionLoading && styles.controlDisabled,
                pressed && !questionLoading && styles.controlPressed,
              ]}
            >
              <Text style={styles.pageButtonText}>{page + 1}</Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={() => goToPage(page + 1)}
            disabled={page >= totalPages || questionLoading}
            style={({ pressed }) => [
              styles.pageButton,
              (page >= totalPages || questionLoading) && styles.controlDisabled,
              pressed &&
                page < totalPages &&
                !questionLoading &&
                styles.controlPressed,
            ]}
          >
            <Text style={styles.pageButtonText}>Next</Text>
          </Pressable>
        </View>

        <View style={styles.toolbarActions}>
          <Pressable
            onPress={reloadQuestionBank}
            disabled={questionLoading}
            style={({ pressed }) => [
              styles.secondaryButton,
              questionLoading && styles.controlDisabled,
              pressed && !questionLoading && styles.controlPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Reload</Text>
          </Pressable>

          <Pressable
            onPress={clearFilters}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Clear</Text>
          </Pressable>
        </View>
      </View>

      <View
        style={[
          styles.assignmentArea,
          isWide ? styles.assignmentAreaWide : styles.assignmentAreaNarrow,
        ]}
      >
        <View
          style={[styles.questionPanel, isWide && styles.questionPanelWide]}
        >
          <Text style={styles.panelTitle}>Question Bank</Text>

          {questionLoading ? (
            <View style={styles.panelLoading}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <ScrollView
              style={styles.questionList}
              contentContainerStyle={
                filteredQuestionRows.length === 0
                  ? styles.emptyListContent
                  : styles.questionListContent
              }
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {filteredQuestionRows.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    No matching questions found.
                  </Text>
                </View>
              ) : (
                filteredQuestionRows.map(item => (
                  <React.Fragment key={String(item.id)}>
                    {renderQuestionBankItem({ item })}
                  </React.Fragment>
                ))
              )}
            </ScrollView>
          )}
        </View>

        <View
          style={[
            styles.transferControls,
            !isWide && styles.transferControlsNarrow,
          ]}
        >
          <Pressable
            onPress={addSelectedQuestions}
            disabled={selectedBankIds.size === 0}
            style={({ pressed }) => [
              styles.transferPrimary,
              selectedBankIds.size === 0 && styles.controlDisabled,
              pressed && selectedBankIds.size > 0 && styles.controlPressed,
            ]}
          >
            <Text style={styles.transferPrimaryText}>
              {isWide ? '→' : '↓ Add Selected'}
            </Text>
          </Pressable>

          <Pressable
            onPress={removeSelectedQuestions}
            disabled={selectedAssignedIds.size === 0}
            style={({ pressed }) => [
              styles.transferSecondary,
              selectedAssignedIds.size === 0 && styles.controlDisabled,
              pressed && selectedAssignedIds.size > 0 && styles.controlPressed,
            ]}
          >
            <Text style={styles.transferSecondaryText}>
              {isWide ? '←' : '↑ Remove Selected'}
            </Text>
          </Pressable>
        </View>

        <View
          style={[styles.questionPanel, isWide && styles.questionPanelWide]}
        >
          <View style={styles.examPanelHeader}>
            <Text style={styles.panelTitle}>Exam Questions</Text>

            <View
              style={[
                styles.marksBadge,

                marksLimitReady &&
                  totalAssignedMarks === maxExamMarks &&
                  styles.marksBadgeSuccess,

                marksLimitReady &&
                  totalAssignedMarks > maxExamMarks &&
                  styles.marksBadgeError,
              ]}
            >
              <Text
                style={[
                  styles.marksBadgeText,

                  marksLimitReady &&
                    totalAssignedMarks === maxExamMarks &&
                    styles.marksBadgeTextSuccess,

                  marksLimitReady &&
                    totalAssignedMarks > maxExamMarks &&
                    styles.marksBadgeTextError,
                ]}
              >
                {totalAssignedMarks}/{marksLimitReady ? maxExamMarks : '—'}
              </Text>
            </View>
          </View>

          <ScrollView
            style={styles.questionList}
            contentContainerStyle={
              assignedQuestions.length === 0
                ? styles.emptyListContent
                : styles.questionListContent
            }
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            {assignedQuestions.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No questions assigned yet.
                </Text>
              </View>
            ) : (
              assignedQuestions.map(item => (
                <React.Fragment key={String(item.id)}>
                  {renderAssignedQuestion({ item })}
                </React.Fragment>
              ))
            )}
          </ScrollView>
        </View>
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
            onPress={saveQuestions}
            disabled={
              saving ||
              !marksLimitReady ||
              assignedQuestions.length === 0 ||
              totalAssignedMarks > maxExamMarks
            }
            style={({ pressed }) => [
              styles.saveButton,

              (saving ||
                !marksLimitReady ||
                assignedQuestions.length === 0 ||
                totalAssignedMarks > maxExamMarks) &&
                styles.controlDisabled,

              pressed &&
                !saving &&
                marksLimitReady &&
                assignedQuestions.length > 0 &&
                totalAssignedMarks <= maxExamMarks &&
                styles.controlPressed,
            ]}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </Pressable>
        </View>
      </View>

      <SelectModal
        visible={typeModalVisible}
        title="Filter by Type"
        options={QUESTION_TYPE_OPTIONS}
        selectedValue={selectedType}
        onSelect={setSelectedType}
        onClose={() => setTypeModalVisible(false)}
      />

      <SelectModal
        visible={onlineCourseModalVisible}
        title="Filter by Online Course"
        options={onlineCourseOptions}
        selectedValue={selectedOnlineCourseId}
        onSelect={setSelectedOnlineCourseId}
        onClose={() => setOnlineCourseModalVisible(false)}
      />
    </ScrollView>
  );
}
