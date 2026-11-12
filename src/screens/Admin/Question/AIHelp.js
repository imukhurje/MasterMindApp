import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { api } from '../../../api/client';

const BG = '#0F172A';
const CARD = '#0B1220';
const TEXT = '#FFFFFF';
const MUTED = '#94A3B8';
const BORDER = '#334155';
const BORDER_SOFT = '#1F2937';
const GREEN = '#22C55E';

export default function AIHelp() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    loadMeta();
  }, []);

  async function loadMeta() {
    try {
      setLoading(true);

      const res = await api('/api/question-bank-ai/meta');

      setMeta(res || {});
    } catch (e) {
      console.log('AI Help meta load error', e);
      Alert.alert('Prompt Help', e?.message || 'Failed to load help data.');
    } finally {
      setLoading(false);
    }
  }

  function stripHtml(html = '') {
    return String(html)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<p>/gi, '')
      .replace(/<strong>/gi, '')
      .replace(/<\/strong>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  function useInForm() {
    const suggestedPrompt = meta?.suggested_prompt || '';

    if (!suggestedPrompt.trim()) {
      Alert.alert('Prompt Help', 'No suggested prompt available.');
      return;
    }

    navigation.navigate({
      name: 'AINewPrompt',
      params: {
        suggestedPrompt,
      },
      merge: true,
    });
  }

  function copySuggestedPrompt() {
    const suggestedPrompt = meta?.suggested_prompt || '';

    if (!suggestedPrompt) {
      Alert.alert('Copy', 'No suggested prompt available.');
      return;
    }

    Clipboard.setString(suggestedPrompt);
    Alert.alert('Copied', 'Suggested prompt copied.');
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
        <Text style={styles.loaderText}>Loading prompt help...</Text>
      </View>
    );
  }

  const helpText = stripHtml(meta?.help_html);
  const suggestedPrompt = meta?.suggested_prompt || '';

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Prompt Help</Text>

          <Text style={styles.helpText}>
            {helpText || 'No help content available.'}
          </Text>
        </View>

        <View style={styles.promptCard}>
          <Text style={styles.promptLabel}>Suggested Prompt Format</Text>

          <View style={styles.promptBox}>
            <Text style={styles.promptText}>
              {suggestedPrompt || 'No suggested prompt available.'}
            </Text>
          </View>
        </View>

        <View style={styles.modelCard}>
          <Text style={styles.modelTitle}>Available Models</Text>

          {Array.isArray(meta?.models) && meta.models.length > 0 ? (
            meta.models.map(model => (
              <View key={model.id} style={styles.modelRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modelName}>{model.label}</Text>
                  <Text style={styles.modelId}>{model.id}</Text>
                </View>

                <View style={styles.costBox}>
                  <Text style={styles.costText}>
                    In ${model.input_cost_per_million}/M
                  </Text>
                  <Text style={styles.costText}>
                    Out ${model.output_cost_per_million}/M
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No models found.</Text>
          )}
        </View>

        <View style={styles.footer}>
          <Pressable onPress={copySuggestedPrompt} style={styles.copyButton}>
            <Text style={styles.buttonText}>Copy Suggested Prompt</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.secondaryButton}
          >
            <Text style={styles.buttonText}>Back</Text>
          </Pressable>

          <Pressable onPress={useInForm} style={styles.useButton}>
            <Text style={styles.useButtonText}>Use In Form</Text>
          </Pressable>
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
  header: {
    minHeight: 58,
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_SOFT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    paddingRight: 16,
    paddingVertical: 8,
  },
  backText: {
    color: TEXT,
    fontSize: 26,
  },
  headerTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '900',
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  helpCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER_SOFT,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  helpTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 14,
  },
  helpText: {
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 24,
  },
  promptCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER_SOFT,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  promptLabel: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 10,
  },
  promptBox: {
    minHeight: 260,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
  },
  promptText: {
    color: TEXT,
    fontSize: 14,
    lineHeight: 22,
  },
  modelCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER_SOFT,
    borderRadius: 14,
    padding: 16,
  },
  modelTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 12,
  },
  modelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_SOFT,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#111827',
  },
  modelName: {
    color: TEXT,
    fontWeight: '800',
  },
  modelId: {
    color: MUTED,
    marginTop: 3,
    fontSize: 12,
  },
  costBox: {
    alignItems: 'flex-end',
  },
  costText: {
    color: '#BFDBFE',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyText: {
    color: MUTED,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  secondaryButton: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  useButton: {
    backgroundColor: GREEN,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: TEXT,
    fontWeight: '800',
  },
  useButtonText: {
    color: '#000',
    fontWeight: '900',
  },

  copyButton: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexGrow: 1,
    alignItems: 'center',
  },

  secondaryButton: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  useButton: {
    backgroundColor: GREEN,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
});
