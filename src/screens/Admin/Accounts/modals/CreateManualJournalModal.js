import React, { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DatePickerModal from './DatePickerModal';

import {
  formatDisplayDate,
  formatMoney,
  getTodayIso,
} from '../utils/accountsHelpers';

import styles from './CreateManualJournalModal.styles';

function createEmptyLine(index = 0) {
  return {
    key: `${Date.now()}-${index}`,

    debit_account_id: null,
    debit_account_code: '',
    debit_account_name: '',
    debit_amount: '',

    credit_account_id: null,
    credit_account_code: '',
    credit_account_name: '',
    credit_amount: '',

    saved: false,
  };
}

function getAccountLabel(account) {
  if (!account) {
    return 'Select ledger account';
  }

  const code = account?.code || '';

  const name = account?.name || 'Account';

  return code ? `${code} - ${name}` : name;
}

export default function CreateManualJournalModal({
  visible,
  accounts = [],
  currencySymbol = '₹',
  submitting = false,
  onClose,
  onSubmit,
}) {
  const [postingDate, setPostingDate] = useState(getTodayIso());

  const [reference, setReference] = useState('');

  const [description, setDescription] = useState('');

  const [lines, setLines] = useState([createEmptyLine(0)]);

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [accountPickerVisible, setAccountPickerVisible] = useState(false);

  const [accountPickerTarget, setAccountPickerTarget] = useState(null);

  const [accountSearch, setAccountSearch] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    setPostingDate(getTodayIso());

    setReference('');
    setDescription('');

    setLines([createEmptyLine(0)]);

    setCalendarVisible(false);
    setAccountPickerVisible(false);
    setAccountPickerTarget(null);
    setAccountSearch('');
  }, [visible]);

  const postingAccounts = useMemo(() => {
    return accounts.filter(
      item => item?.is_active !== false && item?.allows_posting !== false,
    );
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    const search = accountSearch.trim().toLowerCase();

    if (!search) {
      return postingAccounts;
    }

    return postingAccounts.filter(item => {
      const haystack = [
        item?.code,
        item?.name,
        item?.account_type,
        item?.category,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(search);
    });
  }, [postingAccounts, accountSearch]);

  const savedLines = useMemo(() => lines.filter(item => item.saved), [lines]);

  const totals = useMemo(() => {
    let debit = 0;
    let credit = 0;
    let sections = 0;

    savedLines.forEach(line => {
      if (line.debit_account_id) {
        debit += Number(line.debit_amount) || 0;

        sections += 1;
      }

      if (line.credit_account_id) {
        credit += Number(line.credit_amount) || 0;

        sections += 1;
      }
    });

    return {
      debit,
      credit,
      sections,
    };
  }, [savedLines]);

  const balanced =
    totals.debit > 0 &&
    totals.credit > 0 &&
    Math.abs(totals.debit - totals.credit) < 0.001;

  const canPost =
    savedLines.length > 0 &&
    totals.sections >= 2 &&
    balanced &&
    Boolean(description.trim()) &&
    !submitting;

  function updateLine(index, changes) {
    setLines(current =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              ...changes,

              saved: changes.saved ?? false,
            }
          : item,
      ),
    );
  }

  function addLine() {
    setLines(current => [...current, createEmptyLine(current.length)]);
  }

  function removeLine(index) {
    if (lines.length === 1) {
      Alert.alert('Journal Line', 'At least one journal line is required.');

      return;
    }

    setLines(current => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function clearLines() {
    setLines([createEmptyLine(0)]);
  }

  function openAccountPicker(index, side) {
    setAccountPickerTarget({
      index,
      side,
    });

    setAccountSearch('');

    setAccountPickerVisible(true);
  }

  function selectAccount(account) {
    if (!accountPickerTarget) {
      return;
    }

    const { index, side } = accountPickerTarget;

    if (side === 'debit') {
      updateLine(index, {
        debit_account_id: account.id,

        debit_account_code: account.code || '',

        debit_account_name: account.name || '',
      });
    }

    if (side === 'credit') {
      updateLine(index, {
        credit_account_id: account.id,

        credit_account_code: account.code || '',

        credit_account_name: account.name || '',
      });
    }

    setAccountPickerVisible(false);

    setAccountPickerTarget(null);
  }

  function saveLine(index) {
    const line = lines[index];

    if (!line) {
      return;
    }

    const debitAmount = Number(line.debit_amount) || 0;

    const creditAmount = Number(line.credit_amount) || 0;

    const hasDebit = Boolean(line.debit_account_id);

    const hasCredit = Boolean(line.credit_account_id);

    if (!hasDebit && !hasCredit) {
      Alert.alert('Journal Line', 'Select at least one ledger account.');

      return;
    }

    if (hasDebit && debitAmount <= 0) {
      Alert.alert(
        'Journal Line',
        'Enter a debit amount for the selected debit account.',
      );

      return;
    }

    if (hasCredit && creditAmount <= 0) {
      Alert.alert(
        'Journal Line',
        'Enter a credit amount for the selected credit account.',
      );

      return;
    }

    updateLine(index, {
      saved: true,
    });
  }

  function handlePost() {
    if (!canPost) {
      return;
    }

    const journalLines = [];

    savedLines.forEach(line => {
      if (line.debit_account_id) {
        journalLines.push({
          account_id: Number(line.debit_account_id),

          debit: Number(line.debit_amount) || 0,

          credit: 0,

          description: null,
        });
      }

      if (line.credit_account_id) {
        journalLines.push({
          account_id: Number(line.credit_account_id),

          debit: 0,

          credit: Number(line.credit_amount) || 0,

          description: null,
        });
      }
    });

    onSubmit?.({
      posting_date: postingDate,

      source_reference: reference.trim() || null,

      description: description.trim(),

      lines: journalLines,
    });
  }

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          if (!submitting) {
            onClose?.();
          }
        }}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>Post manual journal entry</Text>

                <Text style={styles.subtitle}>
                  Use this for adjustments, opening balances, and events that do
                  not come from receipts, payroll, or supplier workflows.
                </Text>
              </View>

              <Pressable
                disabled={submitting}
                onPress={onClose}
                style={styles.closeButton}
              >
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
              showsVerticalScrollIndicator
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
                placeholder="Month-end adjustment"
                placeholderTextColor="#718096"
                style={styles.input}
              />

              <Text style={styles.helperText}>
                Each line has paired debit and credit sections. Sections without
                an account are ignored, and selected accounts must carry an
                amount before posting.
              </Text>

              <View style={styles.linesHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Journal lines</Text>

                  <Text style={styles.sectionHelp}>
                    Start with one paired line, then add more below when the
                    entry needs them.
                  </Text>
                </View>
              </View>

              <View style={styles.debitCreditHeader}>
                <Text style={styles.debitCreditTitle}>Debit</Text>

                <Text style={styles.debitCreditTitle}>Credit</Text>
              </View>

              {lines.map((line, index) => (
                <View key={String(line.key)} style={styles.lineCard}>
                  <View style={styles.lineTop}>
                    <Text style={styles.lineTitle}>Line {index + 1}</Text>

                    <View style={styles.lineActions}>
                      <Pressable
                        onPress={() => saveLine(index)}
                        style={[
                          styles.lineIconButton,

                          line.saved && styles.lineSavedButton,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={
                            line.saved
                              ? 'content-save-check-outline'
                              : 'content-save-outline'
                          }
                          size={19}
                          color="#FFFFFF"
                        />
                      </Pressable>

                      <Pressable
                        onPress={addLine}
                        style={styles.lineIconButton}
                      >
                        <MaterialCommunityIcons
                          name="plus"
                          size={22}
                          color="#FFFFFF"
                        />
                      </Pressable>

                      {lines.length > 1 && (
                        <Pressable
                          onPress={() => removeLine(index)}
                          style={[styles.lineIconButton, styles.removeButton]}
                        >
                          <MaterialCommunityIcons
                            name="minus"
                            size={22}
                            color="#FFFFFF"
                          />
                        </Pressable>
                      )}
                    </View>
                  </View>

                  <View style={styles.pairRow}>
                    <View style={styles.pairSide}>
                      <Pressable
                        onPress={() => openAccountPicker(index, 'debit')}
                        style={styles.accountButton}
                      >
                        <Text
                          numberOfLines={1}
                          style={
                            line.debit_account_id
                              ? styles.accountText
                              : styles.placeholderText
                          }
                        >
                          {line.debit_account_id
                            ? `${line.debit_account_code} - ${line.debit_account_name}`
                            : 'Select ledger account'}
                        </Text>
                      </Pressable>

                      <TextInput
                        value={line.debit_amount}
                        onChangeText={value =>
                          updateLine(index, {
                            debit_amount: value,
                          })
                        }
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                        placeholderTextColor="#718096"
                        style={styles.amountInput}
                      />
                    </View>

                    <View style={styles.pairSide}>
                      <Pressable
                        onPress={() => openAccountPicker(index, 'credit')}
                        style={styles.accountButton}
                      >
                        <Text
                          numberOfLines={1}
                          style={
                            line.credit_account_id
                              ? styles.accountText
                              : styles.placeholderText
                          }
                        >
                          {line.credit_account_id
                            ? `${line.credit_account_code} - ${line.credit_account_name}`
                            : 'Select ledger account'}
                        </Text>
                      </Pressable>

                      <TextInput
                        value={line.credit_amount}
                        onChangeText={value =>
                          updateLine(index, {
                            credit_amount: value,
                          })
                        }
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                        placeholderTextColor="#718096"
                        style={styles.amountInput}
                      />
                    </View>
                  </View>
                </View>
              ))}

              <View
                style={[
                  styles.balanceBox,

                  balanced ? styles.balanceBoxValid : styles.balanceBoxInvalid,
                ]}
              >
                <Text style={styles.balanceText}>
                  {savedLines.length} saved line(s), {totals.sections} journal
                  entry section(s). Debit{' '}
                  {formatMoney(totals.debit, currencySymbol)} / Credit{' '}
                  {formatMoney(totals.credit, currencySymbol)}{' '}
                  {balanced
                    ? 'balanced and ready to post.'
                    : 'not balanced yet.'}
                </Text>
              </View>

              <View style={styles.actions}>
                <Pressable
                  disabled={submitting}
                  onPress={clearLines}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Clear lines</Text>
                </Pressable>

                <Pressable
                  disabled={submitting}
                  onPress={onClose}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={!canPost}
                  onPress={handlePost}
                  style={[
                    styles.primaryButton,

                    !canPost && styles.buttonDisabled,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="book-plus-outline"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text style={styles.primaryButtonText}>
                    Post journal entry
                  </Text>
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

      <Modal
        visible={accountPickerVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setAccountPickerVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.accountPicker}>
            <View style={styles.accountPickerHeader}>
              <Text style={styles.accountPickerTitle}>
                Select Ledger Account
              </Text>

              <Pressable
                onPress={() => setAccountPickerVisible(false)}
                style={styles.smallCloseButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <TextInput
              value={accountSearch}
              onChangeText={setAccountSearch}
              placeholder="Search account..."
              placeholderTextColor="#718096"
              style={[styles.input, styles.accountSearch]}
            />

            <ScrollView keyboardShouldPersistTaps="handled">
              {filteredAccounts.length === 0 ? (
                <Text style={styles.noAccountText}>
                  No ledger accounts found.
                </Text>
              ) : (
                filteredAccounts.map(account => (
                  <Pressable
                    key={String(account.id)}
                    onPress={() => selectAccount(account)}
                    style={styles.accountOption}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.accountOptionTitle}>
                        {getAccountLabel(account)}
                      </Text>

                      <Text style={styles.accountOptionMeta}>
                        {account?.account_type || account?.category || ''}
                      </Text>
                    </View>

                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color="#A8B6C9"
                    />
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
