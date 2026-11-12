import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import EvaluationQuestionCard from './EvaluationQuestionCard';

import { COLORS, styles } from './ExamEvaluationModal.styles';

function normalizeAttempts(response) {
  return {
    examStatus: String(response?.exam_status || ''),

    attempts: Array.isArray(response?.attempts) ? response.attempts : [],
  };
}

export default function ExamEvaluationModal({ visible, exam, onClose }) {
  const { width } = useWindowDimensions();

  const compact = width < 760;

  /*
   * Online evaluation
   */
  const [studentSearch, setStudentSearch] = useState('');

  const [attempts, setAttempts] = useState([]);

  const [examStatus, setExamStatus] = useState('');

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [attemptDetail, setAttemptDetail] = useState(null);

  const [loadingAttempts, setLoadingAttempts] = useState(false);

  const [loadingAttempt, setLoadingAttempt] = useState(false);

  const [loadError, setLoadError] = useState('');

  /*
   * Offline evaluation
   */
  const [evaluateOffline, setEvaluateOffline] = useState(false);

  const [offlineGrid, setOfflineGrid] = useState({
    exam: null,
    extras: [],
    rows: [],
  });

  const [offlineMarks, setOfflineMarks] = useState({});

  const [loadingOfflineGrid, setLoadingOfflineGrid] = useState(false);

  const [offlineGridError, setOfflineGridError] = useState('');

  const [offlineSavingStudentId, setOfflineSavingStudentId] = useState(null);

  const examId = exam?.id;

  const [extraMarks, setExtraMarks] = useState({});

  const [savingExtraMarks, setSavingExtraMarks] = useState(false);

  useEffect(() => {
    const items = Array.isArray(attemptDetail?.extra_items)
      ? attemptDetail.extra_items
      : [];

    const values = {};

    items.forEach(item => {
      values[item.id] =
        item?.awarded_marks === null || item?.awarded_marks === undefined
          ? ''
          : String(item.awarded_marks);
    });

    setExtraMarks(values);
  }, [attemptDetail?.extra_items]);

  /*
   * Load online attempts
   */
  const loadAttempts = useCallback(async () => {
    if (!examId) {
      return;
    }

    try {
      setLoadingAttempts(true);

      setLoadError('');

      const response = await api(`/api/results/exams/${examId}/attempts`, {
        method: 'GET',
      });

      const normalized = normalizeAttempts(response);

      setAttempts(normalized.attempts);

      setExamStatus(normalized.examStatus);

      /*
       * Prefer the first submitted
       * student.
       */
      const firstSubmitted = normalized.attempts.find(item =>
        Boolean(item?.attempt_id),
      );

      setSelectedStudent(firstSubmitted || normalized.attempts[0] || null);
    } catch (error) {
      console.log('Exam attempts API error:', error);

      setLoadError(error?.message || 'Could not load student submissions.');
    } finally {
      setLoadingAttempts(false);
    }
  }, [examId]);

  /*
   * Reset modal
   */
  useEffect(() => {
    if (!visible) {
      return;
    }

    setStudentSearch('');

    setAttempts([]);

    setExamStatus('');

    setSelectedStudent(null);

    setAttemptDetail(null);

    setEvaluateOffline(false);

    setOfflineGrid({
      exam: null,
      extras: [],
      rows: [],
    });

    setOfflineMarks({});

    setOfflineGridError('');

    setOfflineSavingStudentId(null);

    loadAttempts();
  }, [visible, loadAttempts]);

  /*
   * Load selected student's
   * online attempt.
   */
  useEffect(() => {
    const attemptId = selectedStudent?.attempt_id;

    if (!attemptId || !examId) {
      setAttemptDetail(null);

      return;
    }

    let cancelled = false;

    async function loadAttempt() {
      try {
        setLoadingAttempt(true);

        const response = await api(
          `/api/results/exams/${examId}/attempts/${attemptId}`,
          {
            method: 'GET',
          },
        );

        if (!cancelled) {
          setAttemptDetail(response);
        }
      } catch (error) {
        console.log('Exam attempt detail error:', error);

        if (!cancelled) {
          setAttemptDetail(null);
        }
      } finally {
        if (!cancelled) {
          setLoadingAttempt(false);
        }
      }
    }

    loadAttempt();

    return () => {
      cancelled = true;
    };
  }, [selectedStudent?.attempt_id, examId]);

  /*
   * Load offline grid
   */
  const loadOfflineGrid = useCallback(async () => {
    if (!examId) {
      return;
    }

    try {
      setLoadingOfflineGrid(true);

      setOfflineGridError('');

      const response = await api(`/api/results/exams/${examId}/offline-grid`, {
        method: 'GET',
      });

      const rows = Array.isArray(response?.rows) ? response.rows : [];

      setOfflineGrid({
        exam: response?.exam || null,

        extras: Array.isArray(response?.extras) ? response.extras : [],

        rows,
      });

      /*
       * Prefill marks from
       * backend data.
       */
      const initialMarks = {};

      rows.forEach(row => {
        initialMarks[row.student_id] =
          row?.exam_marks === null || row?.exam_marks === undefined
            ? ''
            : String(row.exam_marks);
      });

      setOfflineMarks(initialMarks);
    } catch (error) {
      console.log('Offline evaluation grid API error:', error);

      setOfflineGridError(
        error?.message || 'Could not load offline evaluation data.',
      );
    } finally {
      setLoadingOfflineGrid(false);
    }
  }, [examId]);

  /*
   * Online student filter
   */
  const filteredAttempts = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();

    if (!query) {
      return attempts;
    }

    return attempts.filter(student => {
      const studentName = String(student?.student_name || '').toLowerCase();

      return studentName.includes(query);
    });
  }, [attempts, studentSearch]);

  const evaluationComplete = examStatus.toLowerCase() === 'evaluated';

  const questions = Array.isArray(attemptDetail?.questions)
    ? attemptDetail.questions
    : [];

  /*
   * Open uploaded answer file
   */
  async function handleOpenFile(file) {
    const url = String(file?.url || '').trim();

    if (!url) {
      return;
    }

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Answer file open error:', error);

      Alert.alert('Could not open file', 'The attachment could not be opened.');
    }
  }

  async function handleSaveExtraMarks() {
    const attemptId = attemptDetail?.attempt?.id;

    const items = Array.isArray(attemptDetail?.extra_items)
      ? attemptDetail.extra_items
      : [];

    if (!examId || !attemptId || items.length === 0) {
      return;
    }

    const payloadItems = [];

    for (const item of items) {
      const rawValue = String(extraMarks[item.id] ?? '').trim();

      const marks = Number(rawValue);

      const fullMarks = Number(item?.full_marks) || 0;

      if (rawValue === '' || !Number.isFinite(marks) || marks < 0) {
        Alert.alert(
          'Invalid Extra Marks',
          `Please enter valid marks for ${item?.name || 'extra item'}.`,
        );

        return;
      }

      if (fullMarks > 0 && marks > fullMarks) {
        Alert.alert(
          'Invalid Extra Marks',
          `${
            item?.name || 'Extra item'
          } marks cannot be more than ${fullMarks}.`,
        );

        return;
      }

      payloadItems.push({
        id: Number(item.id),
        marks,
      });
    }

    try {
      setSavingExtraMarks(true);

      const payload = {
        items: payloadItems,
      };

      console.log('Extra marks save payload:', payload);

      const response = await api(
        `/api/results/exams/${examId}/attempts/${attemptId}/extra`,
        {
          method: 'PATCH',

          body: JSON.stringify(payload),
        },
      );

      console.log('Extra marks save response:', response);

      /*
       * Keep current UI synced
       * after successful save.
       */
      setAttemptDetail(previous => ({
        ...previous,

        extra_items: Array.isArray(previous?.extra_items)
          ? previous.extra_items.map(item => {
              const savedItem = payloadItems.find(
                saved => String(saved.id) === String(item.id),
              );

              if (!savedItem) {
                return item;
              }

              return {
                ...item,

                awarded_marks: savedItem.marks,
              };
            })
          : [],
      }));

      Alert.alert('Saved', 'Extra marks saved successfully.');
    } catch (error) {
      console.log('Extra marks save error:', error);

      Alert.alert(
        'Save Failed',
        error?.message || 'Could not save extra marks.',
      );
    } finally {
      setSavingExtraMarks(false);
    }
  }
  /*
   * Save one offline row.
   */
  async function handleOfflineRowSave(row, marks) {
    if (!examId || !row?.student_id) {
      return;
    }

    const cleanMarks = String(marks ?? '').trim();

    const numericMarks = Number(cleanMarks);

    const fullMarks = Number(offlineGrid?.exam?.total_marks) || 0;

    if (
      cleanMarks === '' ||
      !Number.isFinite(numericMarks) ||
      numericMarks < 0
    ) {
      Alert.alert('Invalid Marks', 'Please enter valid marks.');

      return;
    }

    if (fullMarks > 0 && numericMarks > fullMarks) {
      Alert.alert(
        'Invalid Marks',
        `Exam marks cannot be more than ${fullMarks}.`,
      );

      return;
    }

    try {
      setOfflineSavingStudentId(row.student_id);

      const payload = {
        student_id: Number(row.student_id),

        exam_marks: numericMarks,

        extras: [],
      };

      console.log('Offline row save payload:', payload);

      const response = await api(`/api/results/exams/${examId}/offline-row`, {
        method: 'POST',

        body: JSON.stringify(payload),
      });

      console.log('Offline row save response:', response);

      if (!response?.ok) {
        throw new Error('Could not save offline marks.');
      }

      /*
       * Update row immediately.
       */
      setOfflineGrid(previous => ({
        ...previous,

        rows: previous.rows.map(item =>
          String(item.student_id) === String(row.student_id)
            ? {
                ...item,

                attempt_id: response?.attempt_id ?? item.attempt_id,

                exam_marks: numericMarks,
              }
            : item,
        ),
      }));

      /*
       * Keep textbox value synced.
       */
      setOfflineMarks(previous => ({
        ...previous,

        [row.student_id]: String(numericMarks),
      }));

      /*
       * Reload latest backend data.
       */
      await loadOfflineGrid();
    } catch (error) {
      console.log('Offline marks save error:', error);

      console.log('Offline save error payload:', error?.payload);

      Alert.alert(
        'Save Failed',
        error?.message || 'Could not save the marks. Please try again.',
      );
    } finally {
      setOfflineSavingStudentId(null);
    }
  }

  /*
   * Offline checkbox
   */
  async function handleOfflineToggle() {
    const nextValue = !evaluateOffline;

    setEvaluateOffline(nextValue);

    if (nextValue) {
      await loadOfflineGrid();
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}

          <View style={[styles.header, compact && styles.headerCompact]}>
            <View
              style={[
                styles.headerTitleArea,

                compact && styles.headerTitleAreaCompact,
              ]}
            >
              <Text style={styles.headerTitle}>Evaluate Submissions</Text>

              <Text
                style={[styles.examTitle, compact && styles.examTitleCompact]}
                numberOfLines={compact ? 2 : 1}
              >
                {exam?.name || 'Exam'}

                {exam?.course_title ? ` • ${exam.course_title}` : ''}

                {exam?.class_name ? ` • ${exam.class_name}` : ''}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={[styles.closeButton, compact && styles.closeButtonCompact]}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>

            <View
              style={[
                styles.headerOptions,

                compact && styles.headerOptionsCompact,
              ]}
            >
              <View
                style={[styles.optionRow, compact && styles.optionRowCompact]}
              >
                <View
                  style={[
                    styles.checkbox,

                    evaluationComplete && styles.checkboxChecked,
                  ]}
                >
                  {evaluationComplete ? (
                    <Text style={styles.tick}>✓</Text>
                  ) : null}
                </View>

                <Text style={styles.optionLabel}>Evaluation complete</Text>
              </View>

              <Pressable
                onPress={handleOfflineToggle}
                style={[styles.optionRow, compact && styles.optionRowCompact]}
              >
                <View
                  style={[
                    styles.checkbox,

                    evaluateOffline && styles.checkboxChecked,
                  ]}
                >
                  {evaluateOffline ? <Text style={styles.tick}>✓</Text> : null}
                </View>

                <Text style={styles.optionLabel}>Evaluate offline</Text>
              </Pressable>
            </View>
          </View>

          {/* Main Content */}

          {loadingAttempts ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.BLUE} />

              <Text style={styles.loadingText}>Loading submissions...</Text>
            </View>
          ) : loadError ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.errorText}>{loadError}</Text>

              <Pressable onPress={loadAttempts} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : evaluateOffline ? (
            <OfflineEvaluation
              rows={offlineGrid.rows}
              extras={offlineGrid.extras}
              exam={offlineGrid.exam}
              offlineMarks={offlineMarks}
              setOfflineMarks={setOfflineMarks}
              evaluationComplete={evaluationComplete}
              loading={loadingOfflineGrid}
              error={offlineGridError}
              onRetry={loadOfflineGrid}
              onSaveRow={handleOfflineRowSave}
              savingStudentId={offlineSavingStudentId}
            />
          ) : (
            <View
              style={[styles.onlineBody, compact && styles.onlineBodyCompact]}
            >
              {/* Students */}

              <View
                style={[
                  styles.studentsPanel,

                  compact && styles.studentsPanelCompact,
                ]}
              >
                <View style={styles.studentsHeader}>
                  <View>
                    <Text style={styles.panelTitle}>Students</Text>

                    <Text style={styles.studentCountText}>
                      {filteredAttempts.length} of {attempts.length}
                    </Text>
                  </View>

                  <View style={styles.submissionSummary}>
                    <Text style={styles.submissionSummaryText}>
                      {
                        attempts.filter(item => Boolean(item?.attempt_id))
                          .length
                      }{' '}
                      submitted
                    </Text>
                  </View>
                </View>

                {/* Search */}

                <View style={styles.studentSearchWrapper}>
                  <Text style={styles.searchIcon}>⌕</Text>

                  <TextInput
                    value={studentSearch}
                    onChangeText={setStudentSearch}
                    placeholder="Search student..."
                    placeholderTextColor={COLORS.MUTED_DARK}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.studentSearchInput}
                  />

                  {studentSearch ? (
                    <Pressable onPress={() => setStudentSearch('')} hitSlop={8}>
                      <Text style={styles.clearSearchText}>×</Text>
                    </Pressable>
                  ) : null}
                </View>

                <ScrollView
                  showsVerticalScrollIndicator
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.studentListContent}
                >
                  {filteredAttempts.length === 0 ? (
                    <View style={styles.noStudentsFound}>
                      <Text style={styles.noStudentsFoundTitle}>
                        No students found
                      </Text>

                      <Text style={styles.noStudentsFoundText}>
                        Try another name.
                      </Text>
                    </View>
                  ) : (
                    filteredAttempts.map(student => {
                      const selected =
                        String(selectedStudent?.student_id) ===
                        String(student?.student_id);

                      const submitted = Boolean(student?.attempt_id);

                      return (
                        <Pressable
                          key={student.student_id}
                          onPress={() => setSelectedStudent(student)}
                          style={({ pressed }) => [
                            styles.studentRow,

                            selected && styles.studentRowSelected,

                            pressed && styles.studentRowPressed,
                          ]}
                        >
                          <View style={styles.studentAvatar}>
                            <Text style={styles.studentAvatarText}>
                              {String(student?.student_name || '?')
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </Text>
                          </View>

                          <View style={styles.studentInfo}>
                            <Text
                              style={[
                                styles.studentName,

                                !submitted && styles.notSubmittedText,
                              ]}
                              numberOfLines={1}
                            >
                              {student.student_name}
                            </Text>

                            <Text style={styles.studentIdText}>
                              Student ID: {student.student_id}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.statusBadge,

                              submitted
                                ? styles.submittedBadge
                                : styles.notSubmittedBadge,
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusBadgeText,

                                submitted
                                  ? styles.submittedBadgeText
                                  : styles.notSubmittedBadgeText,
                              ]}
                            >
                              {submitted ? 'Submitted' : 'Not submitted'}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })
                  )}
                </ScrollView>
              </View>

              {/* Online Evaluation */}

              <View style={styles.evaluationPanel}>
                {!selectedStudent?.attempt_id ? (
                  <View style={styles.noSubmission}>
                    <Text style={styles.noSubmissionTitle}>No submission</Text>

                    <Text style={styles.noSubmissionText}>
                      This student has not submitted the exam.
                    </Text>
                  </View>
                ) : loadingAttempt ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.BLUE} />
                  </View>
                ) : (
                  <ScrollView
                    showsVerticalScrollIndicator
                    nestedScrollEnabled
                    contentContainerStyle={styles.questionsContent}
                  >
                    {questions.map((question, index) => (
                      <EvaluationQuestionCard
                        key={question.answer_id || question.question_id}
                        question={question}
                        number={index + 1}
                        onOpenFile={handleOpenFile}
                      />
                    ))}

                    <View style={styles.extraSection}>
                      <View style={styles.extraHeaderRow}>
                        <Text style={styles.extraTitle}>Extra Items</Text>

                        <Text style={styles.extraHelperText}>
                          Enter awarded marks for each item
                        </Text>
                      </View>

                      {Array.isArray(attemptDetail?.extra_items) &&
                      attemptDetail.extra_items.length > 0 ? (
                        <View style={styles.extraItemsList}>
                          {attemptDetail.extra_items.map(item => {
                            const value = extraMarks[item.id] ?? '';

                            const fullMarks = Number(item?.full_marks) || 0;

                            return (
                              <View key={item.id} style={styles.extraItemRow}>
                                <Text
                                  style={styles.extraItemName}
                                  numberOfLines={1}
                                >
                                  {item?.name || 'Extra Item'}
                                </Text>

                                <View style={styles.extraMarksArea}>
                                  <Text style={styles.extraFullMarksText}>
                                    / {fullMarks}
                                  </Text>

                                  <TextInput
                                    value={value}
                                    onChangeText={text =>
                                      setExtraMarks(previous => ({
                                        ...previous,

                                        [item.id]: text,
                                      }))
                                    }
                                    editable={!savingExtraMarks}
                                    keyboardType="decimal-pad"
                                    placeholder="0"
                                    placeholderTextColor={COLORS.MUTED_DARK}
                                    style={styles.extraMarksInput}
                                  />
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      ) : (
                        <Text style={styles.extraText}>
                          No extra items for this paper.
                        </Text>
                      )}

                      <View style={styles.extraBottomActions}>
                        <Pressable
                          onPress={onClose}
                          disabled={savingExtraMarks}
                          style={({ pressed }) => [
                            styles.extraCloseButton,

                            pressed &&
                              !savingExtraMarks &&
                              styles.buttonPressed,
                          ]}
                        >
                          <Text style={styles.extraCloseButtonText}>Close</Text>
                        </Pressable>

                        <Pressable
                          onPress={handleSaveExtraMarks}
                          disabled={
                            savingExtraMarks ||
                            !Array.isArray(attemptDetail?.extra_items) ||
                            attemptDetail.extra_items.length === 0
                          }
                          style={({ pressed }) => [
                            styles.extraSaveButton,

                            (savingExtraMarks ||
                              !Array.isArray(attemptDetail?.extra_items) ||
                              attemptDetail.extra_items.length === 0) &&
                              styles.disabledButton,

                            pressed &&
                              !savingExtraMarks &&
                              styles.buttonPressed,
                          ]}
                        >
                          {savingExtraMarks ? (
                            <ActivityIndicator
                              size="small"
                              color={COLORS.TEXT}
                            />
                          ) : (
                            <Text style={styles.extraSaveButtonText}>
                              Save Extra Marks
                            </Text>
                          )}
                        </Pressable>
                      </View>
                    </View>
                  </ScrollView>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

/*
 * Offline Evaluation
 */
function OfflineEvaluation({
  rows = [],
  extras = [],
  exam = null,
  offlineMarks,
  setOfflineMarks,
  evaluationComplete,
  loading,
  error,
  onRetry,
  onSaveRow,
  savingStudentId,
}) {
  const { width } = useWindowDimensions();

  const compact = width < 700;

  const [offlineStudentSearch, setOfflineStudentSearch] = useState('');

  const fullMarks = Number(exam?.total_marks) || 0;

  /*
   * Offline filter:
   * student name OR roll number.
   */
  const filteredRows = useMemo(() => {
    const query = offlineStudentSearch.trim().toLowerCase();

    if (!query) {
      return rows;
    }

    return rows.filter(row => {
      const studentName = String(row?.name || '').toLowerCase();

      const rollNo = String(row?.roll_no || '').toLowerCase();

      return studentName.includes(query) || rollNo.includes(query);
    });
  }, [rows, offlineStudentSearch]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.BLUE} />

        <Text style={styles.loadingText}>Loading offline evaluation...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>

        <Pressable onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.offlineContainer}>
      {/* Header */}

      <View style={styles.offlineHeaderRow}>
        <View style={styles.offlineHeaderText}>
          <Text style={styles.offlineTitle}>Offline Evaluation</Text>

          <Text style={styles.offlineSubtitle}>
            Enter the final marks for each student.
          </Text>
        </View>

        <View style={styles.totalMarksBadge}>
          <Text style={styles.totalMarksBadgeText}>
            Full Marks: {fullMarks}
          </Text>
        </View>
      </View>

      {/* Offline Search */}

      <View style={styles.studentSearchWrapper}>
        <Text style={styles.searchIcon}>⌕</Text>

        <TextInput
          value={offlineStudentSearch}
          onChangeText={setOfflineStudentSearch}
          placeholder="Search student or roll number..."
          placeholderTextColor={COLORS.MUTED_DARK}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.studentSearchInput}
        />

        {offlineStudentSearch ? (
          <Pressable onPress={() => setOfflineStudentSearch('')} hitSlop={8}>
            <Text style={styles.clearSearchText}>×</Text>
          </Pressable>
        ) : null}
      </View>

      <Text
        style={[
          styles.studentCountText,
          {
            marginBottom: 8,
          },
        ]}
      >
        Showing {filteredRows.length} of {rows.length} students
      </Text>

      {filteredRows.length === 0 ? (
        <View style={styles.noStudentsFound}>
          <Text style={styles.noStudentsFoundTitle}>No students found</Text>

          <Text style={styles.noStudentsFoundText}>
            Try another student name or roll number.
          </Text>
        </View>
      ) : compact ? (
        /*
         * Mobile
         */
        <ScrollView
          style={styles.mobileOfflineList}
          contentContainerStyle={styles.mobileOfflineListContent}
          nestedScrollEnabled
          showsVerticalScrollIndicator
          keyboardShouldPersistTaps="handled"
        >
          {filteredRows.map(row => {
            const studentId = row.student_id;

            const marksValue = offlineMarks[studentId] ?? '';

            const numericMarks = Number(marksValue);

            const validMarks =
              marksValue !== '' &&
              Number.isFinite(numericMarks) &&
              numericMarks >= 0 &&
              numericMarks <= fullMarks;

            /*
             * True only for
             * the row currently
             * being saved.
             */
            const saving = String(savingStudentId) === String(studentId);

            return (
              <View key={studentId} style={styles.offlineCompactRow}>
                {/* Student */}

                <View style={styles.offlineCompactStudent}>
                  <Text
                    style={styles.offlineCompactStudentName}
                    numberOfLines={1}
                  >
                    {row?.name || 'Unknown Student'}
                  </Text>

                  <Text style={styles.offlineCompactRoll} numberOfLines={1}>
                    Roll: {row?.roll_no || '—'}
                  </Text>
                </View>

                {/* Marks */}

                <View style={styles.offlineCompactMarks}>
                  <TextInput
                    value={marksValue}
                    editable={!saving}
                    onChangeText={value =>
                      setOfflineMarks(previous => ({
                        ...previous,

                        [studentId]: value,
                      }))
                    }
                    keyboardType="decimal-pad"
                    placeholder="Marks"
                    placeholderTextColor={COLORS.MUTED_DARK}
                    style={styles.offlineCompactMarkInput}
                  />

                  <Text style={styles.offlineCompactSlash}>/</Text>

                  <Text style={styles.offlineCompactFullMarks}>
                    {fullMarks}
                  </Text>
                </View>

                {/* Save */}

                <Pressable
                  onPress={() => onSaveRow?.(row, marksValue)}
                  disabled={!validMarks || saving}
                  style={({ pressed }) => [
                    styles.offlineCompactSaveButton,

                    (!validMarks || saving) && styles.disabledButton,

                    pressed && validMarks && !saving && styles.buttonPressed,
                  ]}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={COLORS.TEXT} />
                  ) : (
                    <Text style={styles.offlineCompactSaveText}>Save</Text>
                  )}
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        /*
         * Desktop / Tablet
         */
        <View style={styles.offlineTableResponsive}>
          <View style={styles.responsiveTableHeader}>
            <Text
              style={[styles.responsiveHeaderText, styles.responsiveRollColumn]}
            >
              Roll Number
            </Text>

            <Text
              style={[
                styles.responsiveHeaderText,
                styles.responsiveStudentColumn,
              ]}
            >
              Student
            </Text>

            <Text
              style={[styles.responsiveHeaderText, styles.responsiveMarkColumn]}
            >
              Exam Marks / {fullMarks}
            </Text>

            <Text
              style={[
                styles.responsiveHeaderText,
                styles.responsiveActionColumn,
              ]}
            >
              Action
            </Text>
          </View>

          <ScrollView
            style={styles.responsiveRowsScroll}
            nestedScrollEnabled
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
          >
            {filteredRows.map(row => {
              const studentId = row.student_id;

              const marksValue = offlineMarks[studentId] ?? '';

              const numericMarks = Number(marksValue);

              const validMarks =
                marksValue !== '' &&
                Number.isFinite(numericMarks) &&
                numericMarks >= 0 &&
                numericMarks <= fullMarks;

              const saving = String(savingStudentId) === String(studentId);

              return (
                <View key={studentId} style={styles.responsiveTableRow}>
                  <Text
                    style={[
                      styles.responsiveCellText,
                      styles.responsiveRollColumn,
                    ]}
                    numberOfLines={1}
                  >
                    {row?.roll_no || '—'}
                  </Text>

                  <Text
                    style={[
                      styles.responsiveStudentText,
                      styles.responsiveStudentColumn,
                    ]}
                    numberOfLines={1}
                  >
                    {row?.name || 'Unknown Student'}
                  </Text>

                  <View style={styles.responsiveMarkColumn}>
                    <TextInput
                      value={marksValue}
                      editable={!saving}
                      onChangeText={value =>
                        setOfflineMarks(previous => ({
                          ...previous,

                          [studentId]: value,
                        }))
                      }
                      keyboardType="decimal-pad"
                      placeholder="Marks"
                      placeholderTextColor={COLORS.MUTED_DARK}
                      style={styles.responsiveMarkInput}
                    />
                  </View>

                  <View style={styles.responsiveActionColumn}>
                    <Pressable
                      onPress={() => onSaveRow?.(row, marksValue)}
                      disabled={!validMarks || saving}
                      style={({ pressed }) => [
                        styles.responsiveSaveButton,

                        (!validMarks || saving) && styles.disabledButton,

                        pressed &&
                          validMarks &&
                          !saving &&
                          styles.buttonPressed,
                      ]}
                    >
                      {saving ? (
                        <ActivityIndicator size="small" color={COLORS.TEXT} />
                      ) : (
                        <Text style={styles.responsiveSaveButtonText}>
                          Save
                        </Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {extras.length > 0 ? (
        <Text style={styles.evaluationCompleteNoticeText}>
          {extras.length} extra mark column
          {extras.length === 1 ? '' : 's'} available.
        </Text>
      ) : null}

      {evaluationComplete ? (
        <View style={styles.evaluationCompleteNotice}>
          <Text style={styles.evaluationCompleteNoticeText}>
            Evaluation is currently marked as complete.
          </Text>
        </View>
      ) : null}
    </View>
  );
}
