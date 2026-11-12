import React, { useCallback, useEffect, useState } from 'react';

import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';

import { useRoute } from '@react-navigation/native';

import { api } from '../../api/client';
import styles from './ExamResultDetail.styles';

function getSelectedAnswer(question) {
  const selected = Array.isArray(question?.student?.selected)
    ? question.student.selected.map(String)
    : [];

  const options = Array.isArray(question?.options) ? question.options : [];

  if (selected.length > 0) {
    return selected
      .map(selectedId => {
        const option = options.find(
          item => String(item?.id) === String(selectedId),
        );

        return option ? `${selectedId} — ${option.text}` : selectedId;
      })
      .join(', ');
  }

  const textAnswer = question?.student?.text;

  if (
    textAnswer !== null &&
    textAnswer !== undefined &&
    String(textAnswer).trim()
  ) {
    return String(textAnswer);
  }

  return 'No answer provided';
}

function getCorrectAnswer(question) {
  const correctOptions = Array.isArray(question?.correct_options)
    ? question.correct_options
    : [];

  if (correctOptions.length > 0) {
    return correctOptions
      .map(option => {
        const id = option?.id;
        const text = option?.text;

        if (id !== null && id !== undefined && text) {
          return `${id} — ${text}`;
        }

        return text || String(id || '');
      })
      .filter(Boolean)
      .join(', ');
  }

  const modelAnswer = question?.model_answer;

  if (
    modelAnswer !== null &&
    modelAnswer !== undefined &&
    String(modelAnswer).trim()
  ) {
    return String(modelAnswer);
  }

  return 'Not provided';
}

export default function ExamResultDetail() {
  const route = useRoute();

  const examId = route?.params?.examId;

  const attemptId = route?.params?.attemptId;

  const [loading, setLoading] = useState(true);

  const [result, setResult] = useState(null);

  const loadResult = useCallback(async () => {
    if (!examId || !attemptId) {
      Alert.alert('Exam Result', 'Missing exam or attempt information.');

      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await api(
        `/api/results/exams/${encodeURIComponent(
          examId,
        )}/attempts/${encodeURIComponent(attemptId)}`,
      );

      setResult(response || {});
    } catch (error) {
      console.log('Exam result load error:', error);

      Alert.alert(
        'Exam Result',
        error?.message || 'Could not load the evaluated answer sheet.',
      );
    } finally {
      setLoading(false);
    }
  }, [examId, attemptId]);

  useEffect(() => {
    loadResult();
  }, [loadResult]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  const questions = Array.isArray(result?.questions) ? result.questions : [];

  const examName = result?.exam?.name || 'Exam';

  const totalAwardedMarks = questions.reduce(
    (sum, question) => sum + Number(question?.grading?.awarded_marks ?? 0),
    0,
  );

  const totalFullMarks = questions.reduce(
    (sum, question) => sum + Number(question?.full_marks ?? 0),
    0,
  );

  const notes =
    result?.attempt?.review_notes || result?.attempt?.notes_for_student || '';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.sheetCard}>
        <View style={styles.examHeader}>
          <Text style={styles.examLabel}>Exam</Text>

          <Text style={styles.examName}>{examName}</Text>
        </View>

        <View style={styles.sheetHeader}>
          <View style={styles.sheetTitleRow}>
            <View style={styles.sheetTitleArea}>
              <Text style={styles.sheetTitle}>Evaluated Answer Sheet</Text>

              <Text style={styles.notes}>
                {String(notes).trim() || 'No notes were provided.'}
              </Text>
            </View>

            <View style={styles.totalMarksBadge}>
              <Text style={styles.totalMarksLabel}>Total Marks</Text>

              <Text style={styles.totalMarksValue}>
                {totalAwardedMarks} / {totalFullMarks}
              </Text>
            </View>
          </View>
        </View>

        {questions.length > 0 ? (
          <View style={styles.questions}>
            {questions.map((question, index) => {
              const awarded = question?.grading?.awarded_marks ?? 0;

              const fullMarks = question?.full_marks ?? 0;

              const isCorrect = question?.auto?.is_correct;

              return (
                <View
                  key={question?.question_id ?? index}
                  style={styles.questionCard}
                >
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionTitle}>
                      {index + 1}. {question?.text || 'Question'}
                    </Text>

                    {isCorrect === true ? (
                      <Text style={styles.correct}>Correct</Text>
                    ) : isCorrect === false ? (
                      <Text style={styles.incorrect}>Incorrect</Text>
                    ) : null}
                  </View>

                  <Text style={styles.answer}>
                    Selected: {getSelectedAnswer(question)}
                  </Text>

                  <Text style={styles.correctAnswer}>
                    Correct: {getCorrectAnswer(question)}
                  </Text>

                  <Text style={styles.marks}>
                    Marks: {awarded} / {fullMarks}
                  </Text>

                  {!!question?.grading?.examiner_notes && (
                    <Text style={styles.examinerNotes}>
                      Examiner note: {question.grading.examiner_notes}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
