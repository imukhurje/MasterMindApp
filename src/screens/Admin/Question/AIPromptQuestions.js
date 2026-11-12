import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../../../api/client';

const BG = '#0F172A';
const CARD = '#0B1220';
const CARD_DARK = '#111827';
const TEXT = '#FFFFFF';
const MUTED = '#94A3B8';
const BORDER = '#334155';
const BORDER_SOFT = '#1F2937';
const GREEN = '#22C55E';
const GREEN_DARK = '#064E3B';
const RED = '#EF4444';
const BLUE = '#2563EB';

export default function AIPromptQuestions() {
  const navigation = useNavigation();
  const route = useRoute();

  const promptId = route?.params?.promptId;

  const [loading, setLoading] = useState(true);
  const [addingToBank, setAddingToBank] = useState(false);
  const [promptData, setPromptData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadQuestions();
  }, [promptId]);

  async function loadQuestions() {
    if (!promptId) {
      Alert.alert('Generated Questions', 'Prompt ID is missing.');
      navigation.goBack();
      return;
    }

    try {
      setLoading(true);

      const res = await api(
        `/api/question-bank-ai/prompts/${promptId}/questions`,
      );

      setPromptData(res?.prompt || null);
      setQuestions(Array.isArray(res?.questions) ? res.questions : []);
      setSelectedIds([]);
    } catch (e) {
      console.log('Prompt questions load error', e);
      Alert.alert(
        'Generated Questions',
        e?.message || 'Failed to load generated questions.',
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(value) {
    if (!value) return '-';

    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  }

  function formatType(type) {
    if (!type) return 'Unknown';

    return String(type)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  function isAlreadyAdded(item) {
    return (
      !!item?.question_bank_question_id || !!item?.added_to_question_bank_at
    );
  }

  function isSelected(item) {
    return selectedIds.includes(item.id);
  }

  function toggleQuestion(item) {
    if (isAlreadyAdded(item)) {
      return;
    }

    setSelectedIds(prev => {
      if (prev.includes(item.id)) {
        return prev.filter(id => id !== item.id);
      }

      return [...prev, item.id];
    });
  }

  const selectableQuestions = useMemo(
    () => questions.filter(item => !isAlreadyAdded(item)),
    [questions],
  );

  function toggleSelectAll() {
    if (selectableQuestions.length === 0) {
      return;
    }

    const selectableIds = selectableQuestions.map(item => item.id);
    const allSelected = selectableIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !selectableIds.includes(id)));
    } else {
      setSelectedIds(selectableIds);
    }
  }

  function isCorrectAnswer(item, index) {
    if (!Array.isArray(item?.correct_answers)) {
      return false;
    }

    return item.correct_answers.map(Number).includes(index);
  }

  async function onAddToQuestionBank() {
    if (selectedIds.length === 0) {
      Alert.alert(
        'Generated Questions',
        'Please select at least one question.',
      );
      return;
    }

    try {
      setAddingToBank(true);

      const res = await api(
        `/api/question-bank-ai/prompts/${promptId}/add-to-question-bank`,
        {
          method: 'POST',
          body: JSON.stringify({
            generated_question_ids: selectedIds,
          }),
        },
      );

      if (res?.ok) {
        Alert.alert(
          'Question Bank',
          `${
            res?.added_count || selectedIds.length
          } question(s) added successfully.`,
        );

        await loadQuestions();
      } else {
        Alert.alert('Question Bank', 'Questions could not be added.');
      }
    } catch (e) {
      console.log('Add to question bank error', e);

      Alert.alert(
        'Question Bank',
        e?.message || 'Failed to add questions to Question Bank.',
      );
    } finally {
      setAddingToBank(false);
    }
  }

  function renderQuestion({ item }) {
    const alreadyAdded = isAlreadyAdded(item);
    const selected = isSelected(item);
    const choices = Array.isArray(item?.choices) ? item.choices : [];

    return (
      <Pressable
        onPress={() => toggleQuestion(item)}
        style={[
          styles.questionCard,
          alreadyAdded && styles.alreadyAddedCard,
          selected && styles.selectedCard,
        ]}
      >
        <View style={styles.questionTopRow}>
          <Text style={styles.checkbox}>
            {alreadyAdded ? '☐' : selected ? '☑' : '☐'}
          </Text>

          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{formatType(item.type)}</Text>
          </View>

          {alreadyAdded ? (
            <View style={styles.alreadyBadge}>
              <Text style={styles.alreadyBadgeText}>
                Already in Question Bank
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.questionTitle}>
          {item?.content || 'Untitled question'}
        </Text>

        {choices.map((choice, index) => (
          <View key={`${item.id}-${index}`} style={styles.choiceRow}>
            <Text
              style={[
                styles.choiceBullet,
                isCorrectAnswer(item, index) && styles.correctChoice,
              ]}
            >
              {isCorrectAnswer(item, index) ? '✅' : '•'}
            </Text>

            <Text style={styles.choiceText}>{choice}</Text>
          </View>
        ))}

        {item?.model_answer ? (
          <View style={styles.modelAnswerBox}>
            <Text style={styles.modelAnswerLabel}>Model Answer</Text>
            <Text style={styles.modelAnswerText}>{item.model_answer}</Text>
          </View>
        ) : null}
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
        <Text style={styles.loaderText}>Loading generated questions...</Text>
      </View>
    );
  }

  const allSelectableSelected =
    selectableQuestions.length > 0 &&
    selectableQuestions.every(item => selectedIds.includes(item.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.subtitle}>
            {promptData?.model || '-'} | {promptData?.generated_count || 0}{' '}
            questions | {formatDate(promptData?.created_at)}
          </Text>

          {Array.isArray(promptData?.files) && promptData.files.length > 0 ? (
            <Text style={styles.filesText}>
              Files:{' '}
              {promptData.files.map(file => file.original_name).join(', ')}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.selectRow}>
        <Pressable onPress={toggleSelectAll} style={styles.selectAllButton}>
          <Text style={styles.selectAllText}>
            {allSelectableSelected ? '☑' : '☐'} Select / deselect all
          </Text>
        </Pressable>

        <Text style={styles.selectedCount}>{selectedIds.length} selected</Text>
      </View>

      <FlatList
        data={questions}
        keyExtractor={item => String(item.id)}
        renderItem={renderQuestion}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              No questions found for this prompt.
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.secondaryButton}
        >
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>

        {selectedIds.length > 0 ? (
          <Pressable
            onPress={onAddToQuestionBank}
            disabled={addingToBank}
            style={[styles.addButton, addingToBank && styles.disabledButton]}
          >
            {addingToBank ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.addButtonText}>Add to Question Bank</Text>
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  loader: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    color: MUTED,
    marginTop: 10,
  },
  header: {
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_SOFT,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    color: TEXT,
    fontSize: 19,
    fontWeight: '900',
  },
  subtitle: {
    color: MUTED,
    lineHeight: 20,
  },
  filesText: {
    color: MUTED,
    marginTop: 4,
    fontSize: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  closeText: {
    color: '#000',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 26,
  },
  selectRow: {
    backgroundColor: CARD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_SOFT,
  },
  selectAllButton: {
    paddingVertical: 4,
  },
  selectAllText: {
    color: TEXT,
    fontSize: 14,
  },
  selectedCount: {
    color: MUTED,
    fontSize: 13,
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  questionCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER_SOFT,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  alreadyAddedCard: {
    backgroundColor: GREEN_DARK,
    borderColor: '#15803D',
  },
  selectedCard: {
    borderColor: BLUE,
  },
  questionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  checkbox: {
    color: TEXT,
    fontSize: 16,
    width: 24,
  },
  typeBadge: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  typeText: {
    color: TEXT,
    fontSize: 12,
  },
  alreadyBadge: {
    marginLeft: 'auto',
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: 18,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  alreadyBadgeText: {
    color: '#DCFCE7',
    fontSize: 11,
    fontWeight: '700',
  },
  questionTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
    marginBottom: 8,
  },
  choiceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  choiceBullet: {
    color: TEXT,
    marginRight: 8,
  },
  correctChoice: {
    color: GREEN,
  },
  choiceText: {
    color: TEXT,
    flex: 1,
    lineHeight: 20,
  },
  modelAnswerBox: {
    backgroundColor: CARD_DARK,
    borderWidth: 1,
    borderColor: BORDER_SOFT,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  modelAnswerLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 5,
  },
  modelAnswerText: {
    color: TEXT,
    lineHeight: 20,
  },
  emptyBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: MUTED,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: CARD,
    borderTopWidth: 1,
    borderTopColor: BORDER_SOFT,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: '#334155',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: GREEN,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: TEXT,
    fontWeight: '800',
  },
  addButtonText: {
    color: '#000',
    fontWeight: '900',
  },
});
