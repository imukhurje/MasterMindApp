import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { api } from '../../api/client';

const BG = '#020617';
const CARD = '#020617';
const BORDER = '#1F2937';
const TEXT = '#E5E7EB';
const MUTED = '#9CA3AF';
const CTA = '#22C55E';

const OnlineQuizScreen = ({ route, navigation }) => {
  const { quizId } = route?.params || {};

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const attemptId = quizData?.attempt?.id;
  const questions = quizData?.questions || [];
  const quiz = quizData?.quiz;

  // ---------------- FETCH QUIZ LAUNCH DATA ----------------
  const fetchQuiz = useCallback(async () => {
    if (!quizId) {
      setError('No quiz id provided.');
      setLoading(false);
      return;
    }
    try {
      setError('');
      setLoading(true);

      const data = await api(`/api/online/quiz/${quizId}/launch`, {
        method: 'POST',
        body: JSON.stringify({}),
      });

      setQuizData(data);

      const minutes = data?.quiz?.time_limit_minutes || 0;
      if (minutes > 0) {
        setRemainingSeconds(minutes * 60);
      } else {
        setRemainingSeconds(null);
      }
    } catch (e) {
      console.log('fetchQuiz error', e);
      setError('Failed to load quiz.');
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  // ---------------- GLOBAL TIMER ----------------
  useEffect(() => {
    if (!remainingSeconds && remainingSeconds !== 0) return;

    if (remainingSeconds <= 0) {
      // time over
      Alert.alert(
        'Time up',
        'Your quiz time is over. Submitting your answers.',
      );
      handleSubmitAll();
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds(prev => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  const formatTime = sec => {
    if (sec === null) return '--:--';
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ---------------- ANSWER HELPERS ----------------
  const currentQuestion = useMemo(
    () => questions[currentIndex] || null,
    [questions, currentIndex],
  );

  const selectedOptionId = currentQuestion
    ? answers[currentQuestion.id] || null
    : null;

  const handleSelectOption = optionId => {
    if (remainingSeconds === 0) {
      Alert.alert('Time up', 'You cannot answer after time is over.');
      return;
    }

    if (!currentQuestion) return;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const sendAnswer = async (questionId, optionId) => {
    if (!attemptId || !quizId) return;
    if (!optionId) return;

    const payload = {
      attempt_id: attemptId,
      question_id: questionId,
      option_ids: [optionId],
    };

    try {
      await api(`/api/online/quiz/${quizId}/answer`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.log('sendAnswer error', e);
      Alert.alert('Error', 'Failed to save your answer. Please try again.');
      throw e;
    }
  };

  // ---------------- NAVIGATION BUTTONS ----------------
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSaveAndNext = async () => {
    if (!currentQuestion) return;
    if (remainingSeconds === 0) {
      Alert.alert('Time up', 'You cannot answer after time is over.');
      return;
    }

    const qId = currentQuestion.id;
    const optionId = answers[qId];

    if (!optionId) {
      Alert.alert('No answer selected', 'Please select an option first.');
      return;
    }

    try {
      setIsSubmitting(true);
      await sendAnswer(qId, optionId);

      // move to next
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        Alert.alert(
          'Last question',
          'You are on the last question. You can review your answers or submit the quiz.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- SUBMIT ALL ANSWERS ----------------
  const handleSubmitAll = async () => {
    if (!quizData || !questions.length || !attemptId || !quizId) return;
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // send for all questions that have selected answer
      for (const q of questions) {
        const optId = answers[q.id];
        if (optId) {
          try {
            await sendAnswer(q.id, optId);
          } catch {
            // already alerted in sendAnswer
          }
        }
      }

      Alert.alert('Quiz submitted', 'Your answers have been submitted.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- RENDERING ----------------
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={CTA} />
        <Text style={styles.centerText}>Loading quiz...</Text>
      </View>
    );
  }

  if (error || !quizData) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>{error || 'Quiz not found.'}</Text>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>No questions found in this quiz.</Text>
      </View>
    );
  }

  const total = questions.length;
  const qNumber = currentIndex + 1;

  return (
    <View style={styles.container}>
      {/* HEADER WITH TITLE + TIMER */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.quizTitle} numberOfLines={1}>
            {quiz?.title || 'Quiz'}
          </Text>
          <Text style={styles.quizMeta}>
            Question {qNumber} of {total}
          </Text>
        </View>
        <View style={styles.timerBox}>
          <Text style={styles.timerLabel}>Time Left</Text>
          <Text
            style={[
              styles.timerValue,
              remainingSeconds !== null &&
                remainingSeconds <= 30 && { color: '#F97316' },
            ]}
          >
            {formatTime(remainingSeconds)}
          </Text>
        </View>
      </View>

      {/* QUESTION + OPTIONS */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.body}</Text>

          <View style={{ marginTop: 16 }}>
            {currentQuestion.options.map(option => {
              const isSelected = selectedOptionId === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => handleSelectOption(option.id)}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {option.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* FOOTER BUTTONS */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={currentIndex === 0 || isSubmitting}
          >
            <Text
              style={[
                styles.navButtonText,
                currentIndex === 0 && styles.navButtonTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerRight}>
          <TouchableOpacity
            style={[
              styles.navButtonSecondary,
              isSubmitting && styles.navButtonDisabled,
            ]}
            onPress={handleSaveAndNext}
            disabled={isSubmitting}
          >
            <Text style={styles.navButtonText}>Save & Next</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButtonPrimary,
              isSubmitting && styles.navButtonDisabled,
            ]}
            onPress={() => {
              Alert.alert(
                'Submit quiz?',
                'Are you sure you want to submit all your answers?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Submit', onPress: handleSubmitAll },
                ],
              );
            }}
            disabled={isSubmitting}
          >
            <Text style={styles.navButtonText}>Submit Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OnlineQuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  center: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    color: TEXT,
  },
  header: {
    height: 64,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020617',
  },
  quizTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
  quizMeta: {
    color: MUTED,
    fontSize: 12,
    marginTop: 4,
  },
  timerBox: {
    alignItems: 'flex-end',
  },
  timerLabel: {
    color: MUTED,
    fontSize: 11,
  },
  timerValue: {
    color: '#4ADE80',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  questionCard: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  questionText: {
    color: TEXT,
    fontSize: 15,
    lineHeight: 22,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: BORDER,
    marginTop: 10,
    backgroundColor: '#020617',
  },
  optionSelected: {
    borderColor: CTA,
    backgroundColor: '#064E3B',
  },
  optionText: {
    color: TEXT,
    fontSize: 14,
    flexShrink: 1,
  },
  optionTextSelected: {
    color: '#ECFDF5',
    fontWeight: '500',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: MUTED,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: CTA,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: CTA,
  },
  footer: {
    height: 64,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020617',
    justifyContent: 'space-between',
  },
  footerLeft: {
    flexDirection: 'row',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    marginRight: 8,
  },
  navButtonSecondary: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: CTA,
    marginRight: 8,
  },
  navButtonPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: CTA,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: MUTED,
  },
});
