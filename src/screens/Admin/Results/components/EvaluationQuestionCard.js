import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { api } from '../../../../api/client';

import { styles } from './EvaluationQuestionCard.styles';

function optionSelected(question, optionId) {
  const selected = Array.isArray(question?.student?.selected)
    ? question.student.selected.map(String)
    : [];

  return selected.includes(String(optionId));
}

export default function EvaluationQuestionCard({
  question,
  number,
  onOpenFile,
  readOnly = false,
}) {
  const [awardedMarks, setAwardedMarks] = useState('');

  const [examinerNotes, setExaminerNotes] = useState('');

  const [savingQuestionNotes, setSavingQuestionNotes] = useState(false);
  const [savedQuestionNotes, setSavedQuestionNotes] = useState('');

  async function saveQuestionNotes() {
    const answerId = Number(question?.answer_id);

    if (!Number.isInteger(answerId) || answerId <= 0) {
      Alert.alert('Question Notes', 'Answer ID is missing.');
      return;
    }

    if (savingQuestionNotes) return;

    try {
      setSavingQuestionNotes(true);

      const response = await api(`/api/results/homework-answers/${answerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examiner_notes: examinerNotes,
        }),
      });

      if (response?.ok !== true) {
        throw new Error('Could not save question notes.');
      }

      setSavedQuestionNotes(examinerNotes);
      Alert.alert('Success', 'Question notes saved successfully.');
    } catch (error) {
      console.log('[QUESTION NOTES SAVE ERROR]', {
        answerId,
        status: error?.status,
        message: error?.message,
      });

      Alert.alert(
        'Save Failed',
        error?.message || 'Could not save question notes.',
      );
    } finally {
      setSavingQuestionNotes(false);
    }
  }

  useEffect(() => {
    const marks = question?.grading?.awarded_marks;

    setAwardedMarks(marks === null || marks === undefined ? '' : String(marks));

    const initialNotes = String(question?.grading?.examiner_notes || '');

    setExaminerNotes(initialNotes);
    setSavedQuestionNotes(initialNotes);
  }, [question]);

  const type = String(question?.type || '');

  const isObjective = type === 'mcq_single' || type === 'mcq_multi';

  const autoEvaluated =
    question?.auto?.auto_marks !== null &&
    question?.auto?.auto_marks !== undefined;

  const isEvaluated = question?.grading?.is_evaluated === true;

  return (
    <View
      style={[
        styles.card,
        isEvaluated ? styles.cardEvaluated : styles.cardNotEvaluated,
      ]}
    >
      <View style={styles.titleRow}>
        <Text style={styles.questionNumber}>Q{number}</Text>

        <Text style={styles.fullMarks}>Full: {question?.full_marks ?? 0}</Text>
      </View>

      <Text style={styles.questionText}>{question?.text || ''}</Text>

      {isObjective ? (
        <View style={styles.options}>
          {(question?.options || []).map((option, index) => {
            const selected = optionSelected(question, option.id);

            return (
              <View
                key={`option-${option.id ?? 'none'}-${index}`}
                style={styles.optionRow}
              >
                <View
                  style={[
                    styles.optionCheck,
                    selected && styles.optionCheckSelected,
                  ]}
                >
                  {selected ? <Text style={styles.optionTick}>✓</Text> : null}
                </View>

                <Text style={styles.optionText}>{option.text}</Text>
              </View>
            );
          })}
        </View>
      ) : null}

      <Text style={styles.studentLabel}>Student:</Text>

      {question?.student?.text ? (
        <View style={styles.studentAnswerBox}>
          <Text style={styles.studentAnswer}>{question.student.text}</Text>
        </View>
      ) : null}

      {isObjective && Array.isArray(question?.student?.selected) ? (
        <View style={styles.selectedAnswers}>
          {(question?.options || [])
            .filter(option => optionSelected(question, option.id))
            .map(option => (
              <View key={option.id} style={styles.answerBadge}>
                <Text style={styles.answerBadgeText}>{option.text}</Text>
              </View>
            ))}
        </View>
      ) : null}

      {Array.isArray(question?.files) && question.files.length > 0 ? (
        <>
          <Text style={styles.uploadLabel}>Uploads:</Text>

          <View style={styles.filesRow}>
            {question.files.map((file, index) => (
              <Pressable
                key={`question-file-${file.id ?? 'none'}-${index}`}
                onPress={() => onOpenFile?.(file)}
                style={styles.fileButton}
              >
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.name}
                </Text>

                <Text style={styles.fileAction}>Open</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      <View style={styles.gradingRow}>
        <Text style={styles.gradingLabel}>Awarded Marks</Text>

        <TextInput
          value={awardedMarks}
          onChangeText={setAwardedMarks}
          editable={!readOnly}
          selectTextOnFocus={!readOnly}
          keyboardType="decimal-pad"
          style={[styles.markInput, readOnly && { opacity: 0.75 }]}
        />

        {autoEvaluated ? (
          <View style={styles.autoBadge}>
            <Text style={styles.autoBadgeText}>Auto-evaluated</Text>
          </View>
        ) : (
          <View style={styles.evaluatedRow}>
            <Text style={styles.evaluatedText}>Evaluated</Text>

            <View
              style={[
                styles.smallCheckbox,
                question?.grading?.is_evaluated && styles.smallCheckboxChecked,
              ]}
            >
              {question?.grading?.is_evaluated ? (
                <Text style={styles.smallTick}>✓</Text>
              ) : null}
            </View>
          </View>
        )}
      </View>

      <Text style={styles.notesLabel}>Notes/advice for this question</Text>

      <View style={styles.questionNotesRow}>
        <TextInput
          value={examinerNotes}
          onChangeText={setExaminerNotes}
          editable={!savingQuestionNotes}
          selectTextOnFocus={!savingQuestionNotes}
          multiline
          textAlignVertical="top"
          placeholder="Enter notes or advice..."
          placeholderTextColor="#8091AA"
          style={[styles.notesInput, styles.questionNotesInput]}
        />

        <Pressable
          onPress={saveQuestionNotes}
          disabled={savingQuestionNotes || examinerNotes === savedQuestionNotes}
          accessibilityRole="button"
          accessibilityLabel="Save question notes"
          style={({ pressed }) => [
            styles.questionNotesSaveButton,
            (savingQuestionNotes || examinerNotes === savedQuestionNotes) &&
              styles.questionNotesSaveDisabled,
            pressed && { opacity: 0.75 },
          ]}
        >
          {savingQuestionNotes ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="save-outline" size={19} color="#FFFFFF" />
          )}
        </Pressable>
      </View>
    </View>
  );
}
