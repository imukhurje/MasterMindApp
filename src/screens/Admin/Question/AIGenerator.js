import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { api } from '../../../api/client';
import { useNavigation } from '@react-navigation/native';

const BG = '#0F172A';
const CARD = '#0B1220';
const CARD_DARK = '#111827';
const TEXT = '#FFFFFF';
const MUTED = '#94A3B8';
const BORDER_SOFT = '#1F2937';
const GREEN = '#22C55E';
const GREEN_DARK = '#166534';
const BLUE_DARK = '#172554';
const RED = '#EF4444';
const ORANGE = '#F59E0B';

export default function AIGenerator() {
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [promptRuns, setPromptRuns] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadAIGeneratorData();
  }, []);

  async function loadAIGeneratorData() {
    try {
      setLoading(true);

      const [metaRes, promptsRes] = await Promise.all([
        api('/api/question-bank-ai/meta'),
        api('/api/question-bank-ai/prompts'),
      ]);

      setMeta(metaRes || {});
      setPromptRuns(Array.isArray(promptsRes?.rows) ? promptsRes.rows : []);
    } catch (e) {
      console.log('AI Generator load error', e);
      Alert.alert(
        'AI Generator',
        e?.message || 'Failed to load AI Generator data.',
      );
    } finally {
      setLoading(false);
    }
  }

  function stripHtml(html = '') {
    return String(html)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  function getModelLabel(modelId) {
    const models = Array.isArray(meta?.models) ? meta.models : [];
    const found = models.find(item => item.id === modelId);

    return found?.label || modelId || 'Unknown Model';
  }

  function formatDate(value) {
    if (!value) return '-';

    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  }

  function formatCost(value) {
    if (value === null || value === undefined) return '-';

    const amount = Number(value || 0);
    if (amount >= 0.1) return `$${amount.toFixed(2)}`;
    if (amount >= 0.01) return `$${amount.toFixed(3)}`;
    if (amount >= 0.001) return `$${amount.toFixed(4)}`;
    return `$${amount.toFixed(6)}`;
  }

  function getStatusStyle(status) {
    const statusLower = String(status || '').toLowerCase();

    if (statusLower === 'completed') {
      return {
        box: styles.statusCompleted,
        text: styles.statusCompletedText,
      };
    }

    if (statusLower === 'failed') {
      return {
        box: styles.statusFailed,
        text: styles.statusFailedText,
      };
    }

    return {
      box: styles.statusPending,
      text: styles.statusPendingText,
    };
  }

  function onRefresh() {
    loadAIGeneratorData();
  }

  function onHelp() {
    navigation.navigate('AIHelp');
  }

  function onNewPrompt() {
    navigation.navigate('AINewPrompt');
  }

  function renderPromptCard(item) {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View key={item.id} style={styles.promptCard}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{getModelLabel(item.model)}</Text>
            <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
          </View>

          <View style={[styles.statusBadge, statusStyle.box]}>
            <Text style={[styles.statusText, statusStyle.text]}>
              {item.status || 'unknown'}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              navigation.navigate('AIPromptQuestions', {
                promptId: item.id,
              });
            }}
            style={styles.helpSmallButton}
          >
            <Text style={styles.helpSmallText}>?</Text>
          </Pressable>
        </View>

        <Text style={styles.cardDescription} numberOfLines={10}>
          {item.prompt || 'No prompt text found.'}
        </Text>

        {item.error_message ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText} numberOfLines={4}>
              {item.error_message}
            </Text>
          </View>
        ) : null}

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>QUESTIONS</Text>
            <Text style={styles.statValue}>{item.generated_count || 0}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>FILES</Text>
            <Text style={styles.statValue}>{item.files_count || 0}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>ESTIMATED</Text>
            <Text style={styles.statValue}>
              {formatCost(item.estimated_cost_usd)}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>ACTUAL</Text>
            <Text style={styles.statValue}>
              {formatCost(item.actual_cost_usd)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
        <Text style={styles.loaderText}>Loading AI Generator...</Text>
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
          <Pressable onPress={onRefresh} style={styles.secondaryButton}>
            <Text style={styles.buttonText}>Refresh</Text>
          </Pressable>

          <Pressable onPress={onHelp} style={styles.secondaryButton}>
            <Text style={styles.buttonText}>Help</Text>
          </Pressable>

          <Pressable onPress={onNewPrompt} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ New Prompt</Text>
          </Pressable>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.bodyScroll}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>QUESTION BANK</Text>
          <Text style={styles.heroTitle}>
            Generate questions from prompts, PDFs, and text files
          </Text>
          <Text style={styles.heroSubtitle}>
            Create a prompt, estimate cost, submit to OpenAI, review the
            returned questions, and add the selected ones into the live Question
            Bank.
          </Text>
        </View>

        <View style={styles.countCard}>
          <Text style={styles.countNumber}>{promptRuns.length}</Text>
          <Text style={styles.countLabel}>SAVED PROMPT RUNS</Text>
        </View>

        {/* {meta?.suggested_prompt ? (
          <View style={styles.suggestedCard}>
            <Text style={styles.suggestedTitle}>Suggested Prompt</Text>
            <Text style={styles.suggestedText} numberOfLines={7}>
              {meta.suggested_prompt}
            </Text>
          </View>
        ) : null} */}

        <View style={styles.cardList}>
          {promptRuns.length > 0 ? (
            promptRuns.map(renderPromptCard)
          ) : (
            <Text style={styles.emptyText}>No prompt runs found.</Text>
          )}
        </View>
      </ScrollView>
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
  topSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_SOFT,
  },
  topButtonRow: {
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#334155',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: GREEN,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: TEXT,
    fontWeight: '700',
  },
  addButtonText: {
    color: '#000',
    fontWeight: '900',
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: '#172554',
    borderWidth: 1,
    borderColor: '#1E3A8A',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  kicker: {
    color: '#BFDBFE',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  heroSubtitle: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  countCard: {
    backgroundColor: BLUE_DARK,
    borderWidth: 1,
    borderColor: '#1E3A8A',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  countNumber: {
    color: TEXT,
    fontSize: 30,
    fontWeight: '900',
  },
  countLabel: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  suggestedCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER_SOFT,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  suggestedTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 8,
  },
  suggestedText: {
    color: MUTED,
    lineHeight: 20,
  },
  cardList: {
    gap: 12,
  },
  promptCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER_SOFT,
    borderRadius: 14,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
  },
  cardDate: {
    color: MUTED,
    fontSize: 12,
    marginTop: 3,
  },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  statusCompleted: {
    backgroundColor: GREEN_DARK,
    borderWidth: 1,
    borderColor: GREEN,
  },
  statusCompletedText: {
    color: '#DCFCE7',
  },
  statusFailed: {
    backgroundColor: '#7F1D1D',
    borderWidth: 1,
    borderColor: RED,
  },
  statusFailedText: {
    color: '#FECACA',
  },
  statusPending: {
    backgroundColor: '#78350F',
    borderWidth: 1,
    borderColor: ORANGE,
  },
  statusPendingText: {
    color: '#FEF3C7',
  },
  helpSmallButton: {
    backgroundColor: '#334155',
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpSmallText: {
    color: RED,
    fontWeight: '900',
  },
  cardDescription: {
    color: TEXT,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  errorBox: {
    backgroundColor: '#450A0A',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#FECACA',
    fontSize: 12,
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statBox: {
    width: '48%',
    backgroundColor: CARD_DARK,
    borderWidth: 1,
    borderColor: BORDER_SOFT,
    borderRadius: 10,
    padding: 10,
  },
  statLabel: {
    color: '#BFDBFE',
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 6,
  },
  statValue: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyText: {
    color: MUTED,
    textAlign: 'center',
    marginTop: 30,
  },
});
