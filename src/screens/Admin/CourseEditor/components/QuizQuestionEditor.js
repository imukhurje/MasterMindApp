import React from 'react';

import { Pressable, Text, TextInput, View } from 'react-native';

import { styles, COLORS } from './QuizQuestionEditor.styles';

export default function QuizQuestionEditor({
  question,
  questionNumber,
  disabled,
  onChangeBody,
  onAddOption,
  onChangeOptionText,
  onSelectCorrectOption,
  onRemoveOption,
  onDeleteQuestion,
}) {
  const options = Array.isArray(question?.options) ? question.options : [];

  return (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <View style={styles.questionNumberBox}>
          <Text style={styles.questionNumberText}>{questionNumber}</Text>
        </View>

        <View style={styles.questionFieldContainer}>
          <Text style={styles.fieldLabel}>Question</Text>

          <TextInput
            value={question?.body || ''}
            onChangeText={onChangeBody}
            editable={!disabled}
            placeholder="Enter question"
            placeholderTextColor={COLORS.PLACEHOLDER}
            multiline
            textAlignVertical="top"
            style={styles.questionInput}
          />
        </View>

        <Pressable
          onPress={onDeleteQuestion}
          disabled={disabled}
          style={({ pressed }) => [
            styles.deleteQuestionButton,
            pressed && !disabled && styles.buttonPressed,
            disabled && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.deleteQuestionButtonText}>Delete</Text>
        </Pressable>
      </View>

      <View style={styles.optionsHeader}>
        <Text style={styles.optionsTitle}>Options</Text>

        <Pressable
          onPress={onAddOption}
          disabled={disabled}
          style={({ pressed }) => [
            styles.addOptionButton,
            pressed && !disabled && styles.buttonPressed,
            disabled && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.addOptionButtonText}>+ Add Option</Text>
        </Pressable>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option, optionIndex) => {
          const removeDisabled = disabled || options.length <= 2;

          return (
            <View key={option.localId} style={styles.optionRow}>
              <Pressable
                onPress={() => onSelectCorrectOption(option.localId)}
                disabled={disabled}
                style={({ pressed }) => [
                  styles.checkboxButton,
                  option.is_correct && styles.checkboxButtonSelected,
                  pressed && !disabled && styles.buttonPressed,
                  disabled && styles.buttonDisabled,
                ]}
              >
                {option.is_correct ? (
                  <Text style={styles.checkboxTick}>✓</Text>
                ) : null}
              </Pressable>

              <TextInput
                value={option.text}
                onChangeText={value =>
                  onChangeOptionText(option.localId, value)
                }
                editable={!disabled}
                placeholder={`Option ${optionIndex + 1}`}
                placeholderTextColor={COLORS.PLACEHOLDER}
                style={styles.optionInput}
              />

              <Pressable
                onPress={() => onRemoveOption(option.localId)}
                disabled={removeDisabled}
                style={({ pressed }) => [
                  styles.removeOptionButton,
                  pressed && !removeDisabled && styles.buttonPressed,
                  removeDisabled && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.removeOptionButtonText}>Remove</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
