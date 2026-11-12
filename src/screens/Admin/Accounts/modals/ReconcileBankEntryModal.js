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

import styles from './ReconcileBankEntryModal.styles';

function SelectorModal({ visible, title, options = [], onClose, onSelect }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.selectorBackdrop}>
        <View style={styles.selectorCard}>
          <View style={styles.selectorHeader}>
            <Text style={styles.selectorTitle}>{title}</Text>

            <Pressable onPress={onClose} style={styles.selectorClose}>
              <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.selectorScroll}
            keyboardShouldPersistTaps="handled"
          >
            {options.length === 0 ? (
              <Text style={styles.selectorEmpty}>No options available.</Text>
            ) : (
              options.map(option => (
                <Pressable
                  key={String(option.value)}
                  onPress={() => {
                    onSelect?.(option);
                    onClose?.();
                  }}
                  style={styles.selectorOption}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.selectorOptionTitle}>
                      {option.label}
                    </Text>

                    {!!option.subtitle && (
                      <Text style={styles.selectorOptionSubtitle}>
                        {option.subtitle}
                      </Text>
                    )}
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
  );
}

export default function ReconcileBankEntryModal({
  visible,
  unreconciledEntries = [],
  accounts = [],
  currencySymbol = '₹',
  submitting = false,
  onClose,
  onSubmit,
}) {
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  const [statementDate, setStatementDate] = useState(getTodayIso());

  const [statementAmount, setStatementAmount] = useState('');

  const [statementReference, setStatementReference] = useState('');

  const [differenceReason, setDifferenceReason] = useState('');

  const [adjustmentAccountId, setAdjustmentAccountId] = useState(null);

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [entrySelectorVisible, setEntrySelectorVisible] = useState(false);

  const [accountSelectorVisible, setAccountSelectorVisible] = useState(false);

  /*
   * The supplied bank-book response currently contains
   * unreconciled receipts. This modal is specifically for
   * bank-cleared payment vouchers, so only matching entries
   * are eligible here.
   */
  const eligibleEntries = useMemo(() => {
    return unreconciledEntries.filter(item => {
      const kind = String(item?.kind || item?.entry_type || '')
        .trim()
        .toLowerCase();

      return (
        kind === 'payment_voucher' ||
        kind === 'payment voucher' ||
        kind === 'voucher'
      );
    });
  }, [unreconciledEntries]);

  const entryOptions = useMemo(() => {
    return eligibleEntries.map(item => ({
      value: item?.id,

      label:
        item?.reference_number || item?.entry_number || `Entry #${item?.id}`,

      subtitle: [
        item?.transaction_date || item?.posting_date,

        formatMoney(item?.amount, currencySymbol),
      ]
        .filter(Boolean)
        .join(' · '),

      raw: item,
    }));
  }, [eligibleEntries, currencySymbol]);

  const adjustmentAccountOptions = useMemo(() => {
    return accounts
      .filter(
        item => item?.is_active !== false && item?.allows_posting !== false,
      )
      .map(item => ({
        value: item.id,

        label: `${item?.code || ''}${item?.code ? ' - ' : ''}${
          item?.name || 'Account'
        }`,

        subtitle: item?.account_type || item?.category || '',

        raw: item,
      }));
  }, [accounts]);

  const selectedEntry = useMemo(() => {
    return eligibleEntries.find(
      item => Number(item?.id) === Number(selectedEntryId),
    );
  }, [eligibleEntries, selectedEntryId]);

  const selectedAdjustmentAccount = useMemo(() => {
    return accounts.find(
      item => Number(item?.id) === Number(adjustmentAccountId),
    );
  }, [accounts, adjustmentAccountId]);

  const bookAmount = Number(selectedEntry?.amount) || 0;

  const enteredStatementAmount = Number(statementAmount) || 0;

  const difference = enteredStatementAmount - bookAmount;

  const exactMatch =
    Boolean(selectedEntry) &&
    enteredStatementAmount > 0 &&
    Math.abs(difference) < 0.001;

  useEffect(() => {
    if (!visible) {
      return;
    }

    setSelectedEntryId(null);

    setStatementDate(getTodayIso());

    setStatementAmount('');

    setStatementReference('');

    setDifferenceReason('');

    setAdjustmentAccountId(null);

    setCalendarVisible(false);

    setEntrySelectorVisible(false);

    setAccountSelectorVisible(false);
  }, [visible]);

  function handleEntrySelect(option) {
    const entry = option?.raw;

    setSelectedEntryId(option?.value);

    if (entry?.amount != null) {
      setStatementAmount(String(entry.amount));
    }

    setDifferenceReason('');
    setAdjustmentAccountId(null);
  }

  function handleSubmit() {
    if (!selectedEntry) {
      Alert.alert('Reconcile Entry', 'Select a bank entry first.');

      return;
    }

    if (enteredStatementAmount <= 0) {
      Alert.alert('Reconcile Entry', 'Enter a valid statement amount.');

      return;
    }

    if (!statementReference.trim()) {
      Alert.alert('Reconcile Entry', 'Enter the bank statement reference.');

      return;
    }

    if (!exactMatch && !differenceReason.trim()) {
      Alert.alert('Reconcile Entry', 'Enter a difference reason.');

      return;
    }

    if (!exactMatch && !adjustmentAccountId) {
      Alert.alert('Reconcile Entry', 'Select an adjustment account.');

      return;
    }

    onSubmit?.({
      entry_kind: 'payment_voucher',

      entry_id: Number(selectedEntry.id),

      statement_date: statementDate,

      statement_amount: enteredStatementAmount,

      statement_reference: statementReference.trim(),

      difference_reason: exactMatch ? null : differenceReason.trim(),

      adjustment_account_id: exactMatch ? null : Number(adjustmentAccountId),
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
                <Text style={styles.title}>Reconcile bank-cleared entry</Text>

                <Text style={styles.subtitle}>
                  Use this after the bank statement confirms the movement.
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
              <Text style={styles.label}>Entry kind</Text>

              <View style={[styles.input, styles.readOnlyField]}>
                <Text style={styles.readOnlyText}>Payment voucher</Text>
              </View>

              <Text style={styles.label}>Bank entry</Text>

              <Pressable
                disabled={entryOptions.length === 0}
                onPress={() => setEntrySelectorVisible(true)}
                style={[
                  styles.selectButton,

                  entryOptions.length === 0 && styles.disabledField,
                ]}
              >
                <Text
                  numberOfLines={2}
                  style={
                    selectedEntry
                      ? styles.selectValue
                      : styles.selectPlaceholder
                  }
                >
                  {selectedEntry
                    ? `${
                        selectedEntry?.reference_number ||
                        selectedEntry?.entry_number ||
                        `Entry #${selectedEntry.id}`
                      }`
                    : 'No unreconciled bank entries available'}
                </Text>

                {entryOptions.length > 0 && (
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color="#A8B6C9"
                  />
                )}
              </Pressable>

              {entryOptions.length === 0 && (
                <Text style={styles.noEntryMessage}>
                  There are no unreconciled posted bank payment vouchers
                  available right now.
                </Text>
              )}

              <Text style={styles.label}>Statement date</Text>

              <Pressable
                onPress={() => setCalendarVisible(true)}
                style={styles.selectButton}
              >
                <Text style={styles.selectValue}>
                  {formatDisplayDate(statementDate)}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={19}
                  color="#A8B6C9"
                />
              </Pressable>

              <Text style={styles.label}>Statement amount</Text>

              <TextInput
                value={statementAmount}
                onChangeText={setStatementAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#718096"
                style={styles.input}
              />

              <Text style={styles.label}>Statement reference</Text>

              <TextInput
                value={statementReference}
                onChangeText={setStatementReference}
                placeholder="Bank statement reference"
                placeholderTextColor="#718096"
                style={styles.input}
              />

              <Text style={styles.label}>Difference reason</Text>

              <TextInput
                value={differenceReason}
                onChangeText={setDifferenceReason}
                editable={Boolean(selectedEntry) && !exactMatch}
                placeholder={
                  exactMatch
                    ? 'Not needed for an exact match'
                    : 'Reason for difference'
                }
                placeholderTextColor="#718096"
                style={[
                  styles.input,

                  (!selectedEntry || exactMatch) && styles.disabledField,
                ]}
              />

              <Text style={styles.label}>Adjustment account</Text>

              <Pressable
                disabled={!selectedEntry || exactMatch}
                onPress={() => setAccountSelectorVisible(true)}
                style={[
                  styles.selectButton,

                  (!selectedEntry || exactMatch) && styles.disabledField,
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={
                    selectedAdjustmentAccount
                      ? styles.selectValue
                      : styles.selectPlaceholder
                  }
                >
                  {selectedAdjustmentAccount
                    ? `${selectedAdjustmentAccount?.code || ''}${
                        selectedAdjustmentAccount?.code ? ' - ' : ''
                      }${selectedAdjustmentAccount?.name || ''}`
                    : 'Select adjustment account if needed'}
                </Text>

                {selectedEntry && !exactMatch && (
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color="#A8B6C9"
                  />
                )}
              </Pressable>

              <Text style={styles.checkLabel}>Reconciliation check</Text>

              <View
                style={[styles.checkBox, exactMatch && styles.checkBoxSuccess]}
              >
                <Text style={styles.checkText}>
                  {!selectedEntry
                    ? 'Choose a bank entry to compare the book amount with the statement amount.'
                    : exactMatch
                    ? `Book amount ${formatMoney(
                        bookAmount,
                        currencySymbol,
                      )} matches the statement amount. No adjustment is needed.`
                    : `Book amount ${formatMoney(
                        bookAmount,
                        currencySymbol,
                      )} differs from the statement amount by ${formatMoney(
                        Math.abs(difference),
                        currencySymbol,
                      )}.`}
                </Text>
              </View>

              <Text style={styles.helpText}>
                Statement reference means the bank statement line reference,
                transaction id, or narration you want to store against this
                cleared movement.
              </Text>

              <View style={styles.actions}>
                <Pressable
                  disabled={submitting}
                  onPress={onClose}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={submitting || !selectedEntry}
                  onPress={handleSubmit}
                  style={[
                    styles.submitButton,

                    (submitting || !selectedEntry) && styles.submitDisabled,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="bank-check"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text style={styles.submitButtonText}>
                    Post bank entry reconciliation
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <DatePickerModal
        visible={calendarVisible}
        title="Statement Date"
        selectedDate={statementDate}
        onClose={() => setCalendarVisible(false)}
        onDayPress={day => {
          setStatementDate(day.dateString);

          setCalendarVisible(false);
        }}
      />

      <SelectorModal
        visible={entrySelectorVisible}
        title="Select Bank Entry"
        options={entryOptions}
        onClose={() => setEntrySelectorVisible(false)}
        onSelect={handleEntrySelect}
      />

      <SelectorModal
        visible={accountSelectorVisible}
        title="Select Adjustment Account"
        options={adjustmentAccountOptions}
        onClose={() => setAccountSelectorVisible(false)}
        onSelect={option => setAdjustmentAccountId(option.value)}
      />
    </>
  );
}
