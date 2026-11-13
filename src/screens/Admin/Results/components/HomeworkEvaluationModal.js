import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api } from '../../../../api/client';
import EvaluationQuestionCard from './EvaluationQuestionCard';
import styles from './HomeworkEvaluationModal.styles';

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HomeworkEvaluationModal({
  visible,
  homework,
  onClose,
}) {
  const homeworkId = Number(homework?.id);

  const [attempts, setAttempts] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [hasEnded, setHasEnded] = useState(false);
  const [isTimeLimited, setIsTimeLimited] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attemptDetail, setAttemptDetail] = useState(null);
  const [answerFiles, setAnswerFiles] = useState([]);

  const [notesForParent, setNotesForParent] = useState('');
  const [notesForStudent, setNotesForStudent] = useState('');
  const [savingAttemptNotes, setSavingAttemptNotes] = useState(false);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState('');
  const [detailError, setDetailError] = useState('');

  // Initial Homework API calls
  useEffect(() => {
    if (!visible || !Number.isInteger(homeworkId) || homeworkId <= 0) {
      return;
    }

    let cancelled = false;

    setAttempts([]);
    setAttachments([]);
    setSelectedStudent(null);
    setAttemptDetail(null);
    setAnswerFiles([]);
    setSearch('');
    setError('');
    setLoading(true);

    async function loadHomework() {
      try {
        const [attemptResponse, attachmentResponse] = await Promise.all([
          api(`/api/results/homeworks/${homeworkId}/attempts`, {
            method: 'GET',
          }),
          api(`/api/homeworks/${homeworkId}/attachments`, { method: 'GET' }),
        ]);

        if (cancelled) return;

        const rows = Array.isArray(attemptResponse?.attempts)
          ? attemptResponse.attempts
          : [];

        setAttempts(rows);
        setAttachments(
          Array.isArray(attachmentResponse?.attachments)
            ? attachmentResponse.attachments
            : [],
        );

        setHasEnded(attemptResponse?.has_ended === true);
        setIsTimeLimited(attemptResponse?.is_time_limited === true);
      } catch (err) {
        if (!cancelled) {
          console.log('[HOMEWORK ATTEMPTS ERROR]', {
            status: err?.status,
            message: err?.message,
          });

          setError(err?.message || 'Failed to load homework attempts.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadHomework();

    return () => {
      cancelled = true;
    };
  }, [visible, homeworkId]);

  // Student attempt details
  useEffect(() => {
    if (!visible || !selectedStudent?.attempt_id) {
      setAttemptDetail(null);
      setAnswerFiles([]);
      setNotesForParent('');
      setNotesForStudent('');
      return;
    }

    let cancelled = false;

    const attemptId = Number(selectedStudent.attempt_id);
    const studentId = Number(selectedStudent.student_id);

    setLoadingDetail(true);
    setDetailError('');
    setAttemptDetail(null);
    setAnswerFiles([]);

    setNotesForParent('');
    setNotesForStudent('');

    async function loadStudentAnswers() {
      try {
        const [detailResponse, filesResponse] = await Promise.all([
          api(`/api/results/homeworks/${homeworkId}/attempts/${attemptId}`, {
            method: 'GET',
          }),
          api(
            `/api/homeworks/${homeworkId}/students/${studentId}/answer-files`,
            { method: 'GET' },
          ),
        ]);

        if (cancelled) return;

        if (!detailResponse?.attempt) {
          throw new Error('Student attempt details not found.');
        }

        setAttemptDetail(detailResponse);
        setNotesForParent(
          String(detailResponse?.attempt?.notes_for_parent ?? ''),
        );

        setNotesForStudent(
          String(detailResponse?.attempt?.notes_for_student ?? ''),
        );
        setAnswerFiles(
          Array.isArray(filesResponse?.files) ? filesResponse.files : [],
        );
      } catch (err) {
        if (!cancelled) {
          console.log('[HOMEWORK DETAIL ERROR]', {
            status: err?.status,
            message: err?.message,
          });

          setDetailError(err?.message || 'Failed to load student answers.');
        }
      } finally {
        if (!cancelled) setLoadingDetail(false);
      }
    }

    loadStudentAnswers();

    return () => {
      cancelled = true;
    };
  }, [
    visible,
    homeworkId,
    selectedStudent?.attempt_id,
    selectedStudent?.student_id,
  ]);

  const filteredAttempts = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return attempts;

    return attempts.filter(item =>
      String(item?.student_name || '')
        .toLowerCase()
        .includes(q),
    );
  }, [attempts, search]);

  const questions = Array.isArray(attemptDetail?.questions)
    ? attemptDetail.questions
    : [];

  const fullMarks = questions.reduce(
    (total, question) => total + Number(question?.full_marks || 0),
    0,
  );

  const awardedMarks = questions.reduce(
    (total, question) => total + Number(question?.grading?.awarded_marks || 0),
    0,
  );

  async function handleOpenFile(file) {
    const url = String(file?.url || '').trim();

    if (!url) {
      Alert.alert('Attachment', 'No file URL is available.');
      return;
    }

    try {
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert('Attachment', err?.message || 'Could not open this file.');
    }
  }

  async function saveAttemptNotes() {
    const attemptId = Number(attemptDetail?.attempt?.id);

    if (!Number.isInteger(attemptId) || attemptId <= 0) {
      Alert.alert('Save Notes', 'Attempt ID is missing.');
      return;
    }

    if (savingAttemptNotes) return;

    try {
      setSavingAttemptNotes(true);

      const payload = {
        notes_for_parent: notesForParent,
        notes_for_student: notesForStudent,
      };

      const response = await api(
        `/api/results/homework-attempts/${attemptId}/notes`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (response?.ok !== true) {
        throw new Error('Could not save notes.');
      }

      // Update the locally displayed attempt data.
      setAttemptDetail(current =>
        current
          ? {
              ...current,
              attempt: {
                ...current.attempt,
                ...payload,
              },
            }
          : current,
      );

      Alert.alert('Success', 'Notes saved successfully.');
    } catch (error) {
      console.log('[HOMEWORK ATTEMPT NOTES ERROR]', {
        attemptId,
        status: error?.status,
        message: error?.message,
      });

      Alert.alert('Save Failed', error?.message || 'Could not save notes.');
    } finally {
      setSavingAttemptNotes(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Evaluate Homework</Text>

            <Text style={styles.headerSubtitle} numberOfLines={2}>
              {homework?.name || 'Homework'}
            </Text>
          </View>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#60A5FA" />
            <Text style={styles.muted}>Loading homework submissions...</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {/* Homework Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.sectionTitle}>Homework Submissions</Text>

              <Text style={styles.muted}>
                {attempts.length} submitted
                {' · '}
                {hasEnded ? 'Ended' : 'Active'}
              </Text>

              <Text style={styles.muted}>
                {isTimeLimited ? 'Time limited' : 'No time limit'}
                {' · '}
                {attachments.length} attachment(s)
              </Text>

              {attachments.map((file, index) => (
                <Pressable
                  key={`homework-attachment-${file.id ?? 'none'}-${index}`}
                  onPress={() => handleOpenFile(file)}
                  style={styles.fileButton}
                >
                  <Text style={styles.fileText}>
                    {file.name || 'Homework attachment'}
                  </Text>
                  <Text style={styles.fileText}>Open</Text>
                </Pressable>
              ))}
            </View>

            {/* Student Search */}
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search student..."
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
            />

            {/* Student List */}
            <Text style={styles.sectionTitle}>
              Students ({filteredAttempts.length})
            </Text>

            {filteredAttempts.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.muted}>No student submissions found.</Text>
              </View>
            ) : (
              filteredAttempts.map(item => {
                const selected =
                  selectedStudent != null &&
                  Number(selectedStudent.student_id) ===
                    Number(item.student_id);

                return (
                  <Pressable
                    key={`student-${item.student_id}-${
                      item.attempt_id ?? 'none'
                    }`}
                    onPress={() => setSelectedStudent(item)}
                    style={[
                      styles.studentCard,
                      selected && styles.studentCardSelected,
                    ]}
                  >
                    <Text style={styles.studentName}>{item.student_name}</Text>

                    <Text style={styles.muted}>
                      Submitted: {formatDate(item.submitted_at)}
                    </Text>

                    <Text style={styles.muted}>
                      {item.evaluated_at ? 'Evaluated' : 'Evaluation pending'}
                    </Text>
                  </Pressable>
                );
              })
            )}

            {/* Selected Student Answers */}
            {selectedStudent && (
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>
                  {selectedStudent.student_name} — Answers
                </Text>

                {loadingDetail ? (
                  <ActivityIndicator size="large" color="#60A5FA" />
                ) : detailError ? (
                  <Text style={styles.errorText}>{detailError}</Text>
                ) : attemptDetail ? (
                  <>
                    <View style={styles.scoreCard}>
                      <Text style={styles.muted}>Question Marks</Text>

                      <Text style={styles.scoreText}>
                        {awardedMarks} / {fullMarks}
                      </Text>
                    </View>

                    {questions.map((question, index) => (
                      <EvaluationQuestionCard
                        key={`question-${
                          question.question_id ?? 'none'
                        }-answer-${question.answer_id ?? 'none'}-${index}`}
                        question={question}
                        number={index + 1}
                        onOpenFile={handleOpenFile}
                        readOnly
                      />
                    ))}

                    {answerFiles.length > 0 && (
                      <View style={styles.summaryCard}>
                        <Text style={styles.sectionTitle}>
                          Student Answer Files
                        </Text>

                        {answerFiles.map((file, index) => (
                          <Pressable
                            key={`answer-file-${file.id ?? 'none'}-${index}`}
                            onPress={() => handleOpenFile(file)}
                            style={styles.fileButton}
                          >
                            <Text style={styles.fileText}>
                              {file.name || 'Answer file'}
                            </Text>
                            <Text style={styles.fileText}>Open</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}

                    <View style={styles.attemptNotesSection}>
                      <Text style={styles.attemptNotesTitle}>
                        Student Evaluation Notes
                      </Text>

                      <Text style={styles.attemptNotesLabel}>
                        Notes for the parents
                      </Text>

                      <TextInput
                        value={notesForParent}
                        onChangeText={setNotesForParent}
                        placeholder="Optional"
                        placeholderTextColor="#8091AA"
                        editable={!savingAttemptNotes}
                        multiline
                        textAlignVertical="top"
                        style={styles.attemptNotesInput}
                      />

                      <Text style={styles.attemptNotesLabel}>
                        Notes for the student
                      </Text>

                      <TextInput
                        value={notesForStudent}
                        onChangeText={setNotesForStudent}
                        placeholder="Optional"
                        placeholderTextColor="#8091AA"
                        editable={!savingAttemptNotes}
                        multiline
                        textAlignVertical="top"
                        style={styles.attemptNotesInput}
                      />

                      <View style={styles.attemptNotesActions}>
                        <Pressable
                          onPress={onClose}
                          disabled={savingAttemptNotes}
                          style={[
                            styles.attemptNotesCloseButton,
                            savingAttemptNotes && { opacity: 0.5 },
                          ]}
                        >
                          <Text style={styles.attemptNotesButtonText}>
                            Close
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={saveAttemptNotes}
                          disabled={savingAttemptNotes}
                          style={[
                            styles.attemptNotesSaveButton,
                            savingAttemptNotes && { opacity: 0.6 },
                          ]}
                        >
                          {savingAttemptNotes ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <Text style={styles.attemptNotesButtonText}>
                              Save Notes
                            </Text>
                          )}
                        </Pressable>
                      </View>
                    </View>
                  </>
                ) : null}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}
