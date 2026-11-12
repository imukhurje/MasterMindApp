import React, { useEffect, useState } from 'react';

import { Pressable, Text, TextInput, View } from 'react-native';

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
}) {
  const [awardedMarks, setAwardedMarks] = useState('');

  const [examinerNotes, setExaminerNotes] = useState('');

  useEffect(() => {
    const marks = question?.grading?.awarded_marks;

    setAwardedMarks(marks === null || marks === undefined ? '' : String(marks));

    setExaminerNotes(String(question?.grading?.examiner_notes || ''));
  }, [question]);

  const type = String(question?.type || '');

  const isObjective = type === 'mcq_single' || type === 'mcq_multi';

  const autoEvaluated =
    question?.auto?.auto_marks !== null &&
    question?.auto?.auto_marks !== undefined;

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.questionNumber}>Q{number}</Text>

        <Text style={styles.fullMarks}>Full: {question?.full_marks ?? 0}</Text>
      </View>

      <Text style={styles.questionText}>{question?.text || ''}</Text>

      {isObjective ? (
        <View style={styles.options}>
          {(question?.options || []).map(option => {
            const selected = optionSelected(question, option.id);

            return (
              <View key={option.id} style={styles.optionRow}>
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
            {question.files.map(file => (
              <Pressable
                key={file.id}
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
          keyboardType="decimal-pad"
          style={styles.markInput}
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

      <TextInput
        value={examinerNotes}
        onChangeText={setExaminerNotes}
        multiline
        textAlignVertical="top"
        style={styles.notesInput}
      />

      {/*
        Saving marks/notes needs the
        grading API endpoint.
      */}
    </View>
  );
}
