import React, { useEffect, useState } from 'react';

import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './EditManualJournalModal.styles';

import DatePickerModal from './DatePickerModal';

import { formatDisplayDate, getTodayIso } from '../utils/accountsHelpers';

function getJournalLines(journal) {
  if (Array.isArray(journal?.lines)) {
    return journal.lines;
  }

  if (Array.isArray(journal?.journal_lines)) {
    return journal.journal_lines;
  }

  return [];
}

export default function EditManualJournalModal({
  visible,
  journal,
  onClose,
  onSubmit,
}) {
  const [postingDate, setPostingDate] = useState(getTodayIso());

  const [reference, setReference] = useState('');

  const [description, setDescription] = useState('');

  const [lines, setLines] = useState([]);

  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    if (!visible || !journal) {
      return;
    }

    setPostingDate(
      journal?.posting_date ||
        journal?.journal_date ||
        journal?.entry_date ||
        getTodayIso(),
    );

    setReference(journal?.reference || journal?.source_reference || '');

    setDescription(journal?.description || '');

    setLines(
      getJournalLines(journal).map((line, index) => ({
        key: line?.id || `${Date.now()}-${index}`,

        account_id: line?.account_id || null,

        account_code: line?.account_code || line?.account?.code || '',

        account_name: line?.account_name || line?.account?.name || '',

        debit: String(Number(line?.debit) || ''),

        credit: String(Number(line?.credit) || ''),

        description: line?.description || '',
      })),
    );
  }, [visible, journal]);

  function updateLine(index, field, value) {
    setLines(current =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function handleSubmit() {
    onSubmit?.({
      journal_id: journal?.id,

      posting_date: postingDate,

      reference: reference.trim() || null,

      description: description.trim(),

      lines: lines.map(line => ({
        account_id: line.account_id,

        debit: Number(line.debit) || 0,

        credit: Number(line.credit) || 0,

        description: line.description?.trim() || null,
      })),
    });
  }

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={onClose}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Edit manual journal entry</Text>

                <Text style={styles.subtitle}>
                  Review the journal before posting a correction.
                </Text>
              </View>

              <Pressable onPress={onClose} style={styles.closeButton}>
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.label}>Posting date</Text>

              <Pressable
                onPress={() => setCalendarVisible(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateText}>
                  {formatDisplayDate(postingDate)}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={19}
                  color="#A8B6C9"
                />
              </Pressable>

              <Text style={styles.label}>Reference</Text>

              <TextInput
                value={reference}
                onChangeText={setReference}
                placeholder="ADJ-JUNE-01"
                placeholderTextColor="#718096"
                style={styles.input}
              />

              <Text style={styles.label}>Journal description</Text>

              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Journal description"
                placeholderTextColor="#718096"
                style={styles.input}
              />

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Journal lines</Text>

                <Text style={styles.lineCount}>{lines.length} line(s)</Text>
              </View>

              {lines.map((line, index) => (
                <View key={String(line.key)} style={styles.lineCard}>
                  <Text style={styles.lineTitle}>Line {index + 1}</Text>

                  <Text style={styles.accountText}>
                    {line.account_code
                      ? `${line.account_code} - ${line.account_name}`
                      : line.account_name || 'Account'}
                  </Text>

                  <View style={styles.amountRow}>
                    <View style={styles.amountField}>
                      <Text style={styles.label}>Debit</Text>

                      <TextInput
                        value={line.debit}
                        onChangeText={value =>
                          updateLine(index, 'debit', value)
                        }
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                        placeholderTextColor="#718096"
                        style={styles.input}
                      />
                    </View>

                    <View style={styles.amountField}>
                      <Text style={styles.label}>Credit</Text>

                      <TextInput
                        value={line.credit}
                        onChangeText={value =>
                          updateLine(index, 'credit', value)
                        }
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                        placeholderTextColor="#718096"
                        style={styles.input}
                      />
                    </View>
                  </View>
                </View>
              ))}

              <View style={styles.actions}>
                <Pressable onPress={onClose} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>

                <Pressable onPress={handleSubmit} style={styles.submitButton}>
                  <MaterialCommunityIcons
                    name="content-save-edit-outline"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text style={styles.submitText}>Post journal correction</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <DatePickerModal
        visible={calendarVisible}
        title="Posting Date"
        selectedDate={postingDate}
        onClose={() => setCalendarVisible(false)}
        onDayPress={day => {
          setPostingDate(day.dateString);

          setCalendarVisible(false);
        }}
      />
    </>
  );
}
