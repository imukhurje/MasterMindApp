import React, { useEffect, useMemo, useState } from 'react';

import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Calendar } from 'react-native-calendars';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './ReconcileReceiptModal.styles';

function getTodayIso() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value) {
  if (!value) {
    return 'Select date';
  }

  const parts = String(value).split('-');

  if (parts.length !== 3) {
    return value;
  }

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function formatMoney(value, symbol = '₹') {
  const amount = Number(value) || 0;

  return `${symbol}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ReconcileReceiptModal({
  visible,
  receipt,
  currencySymbol = '₹',
  onClose,
  onSubmit,
}) {
  const [statementDate, setStatementDate] = useState(getTodayIso());

  const [statementAmount, setStatementAmount] = useState('');

  const [statementReference, setStatementReference] = useState('');

  const [differenceReason, setDifferenceReason] = useState('');

  const [adjustmentAccount, setAdjustmentAccount] = useState('');

  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    if (!visible || !receipt) {
      return;
    }

    setStatementDate(getTodayIso());

    setStatementAmount(String(Number(receipt?.amount) || 0));

    setStatementReference('');
    setDifferenceReason('');
    setAdjustmentAccount('');
  }, [visible, receipt]);

  const bookAmount = Number(receipt?.amount) || 0;

  const statementAmountNumber = Number(statementAmount) || 0;

  const difference = statementAmountNumber - bookAmount;

  const exactMatch = Math.abs(difference) < 0.005;

  const reconciliationText = useMemo(() => {
    if (exactMatch) {
      return `Book amount ${formatMoney(
        bookAmount,
        currencySymbol,
      )} matches the statement amount. No adjustment is needed.`;
    }

    return `There is a difference of ${formatMoney(
      Math.abs(difference),
      currencySymbol,
    )}. Add a reason and adjustment account before posting.`;
  }, [exactMatch, bookAmount, difference, currencySymbol]);

  if (!receipt) {
    return null;
  }

  function handleSubmit() {
    onSubmit?.({
      receipt,
      statement_date: statementDate,
      statement_amount: statementAmountNumber,
      statement_reference: statementReference.trim(),
      difference_reason: differenceReason.trim(),
      adjustment_account: adjustmentAccount.trim(),
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
              <View style={styles.headerText}>
                <Text style={styles.title}>Reconcile receipt</Text>

                <Text style={styles.subtitle}>
                  Receipt {receipt?.receipt_number || `#${receipt?.id}`} for{' '}
                  {receipt?.source_reference || '--'}
                </Text>
              </View>

              <Pressable onPress={onClose} style={styles.closeButton}>
                <MaterialCommunityIcons
                  name="close"
                  size={23}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>Bank receipt</Text>

              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyText} numberOfLines={1}>
                  {receipt?.source_reference || '--'} -{' '}
                  {receipt?.receipt_number || '--'}
                </Text>
              </View>

              <Text style={styles.label}>Book amount</Text>

              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyText}>
                  {formatMoney(bookAmount, currencySymbol)}
                </Text>
              </View>

              <Text style={styles.label}>Statement date</Text>

              <Pressable
                onPress={() => setCalendarVisible(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateText}>
                  {formatDisplayDate(statementDate)}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={19}
                  color="#DCE7F5"
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
                editable={!exactMatch}
                placeholder={
                  exactMatch
                    ? 'Not needed for an exact match'
                    : 'Enter difference reason'
                }
                placeholderTextColor="#718096"
                style={[styles.input, exactMatch && styles.disabledField]}
              />

              <Text style={styles.label}>Adjustment account</Text>

              <TextInput
                value={adjustmentAccount}
                onChangeText={setAdjustmentAccount}
                editable={!exactMatch}
                placeholder={
                  exactMatch
                    ? 'No adjustment needed'
                    : 'Select adjustment account if needed'
                }
                placeholderTextColor="#718096"
                style={[styles.input, exactMatch && styles.disabledField]}
              />

              <Text style={styles.label}>Reconciliation check</Text>

              <View style={styles.checkCard}>
                <MaterialCommunityIcons
                  name={
                    exactMatch ? 'check-circle-outline' : 'alert-circle-outline'
                  }
                  size={21}
                  color={exactMatch ? '#34D399' : '#FBBF24'}
                />

                <Text style={styles.checkText}>{reconciliationText}</Text>
              </View>

              <Text style={styles.notice}>
                This receipt will be marked reconciled against the bank
                statement amount shown above.
              </Text>

              <View style={styles.actions}>
                <Pressable onPress={onClose} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>

                <Pressable onPress={handleSubmit} style={styles.submitButton}>
                  <MaterialCommunityIcons
                    name="bank-check"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text style={styles.submitText}>
                    Post bank receipt reconciliation
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.calendarBackdrop}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Statement Date</Text>

              <Pressable
                onPress={() => setCalendarVisible(false)}
                style={styles.calendarClose}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Calendar
              current={statementDate}
              onDayPress={day => {
                setStatementDate(day.dateString);

                setCalendarVisible(false);
              }}
              markedDates={{
                [statementDate]: {
                  selected: true,
                  selectedColor: '#2563EB',
                },
              }}
              enableSwipeMonths
              theme={{
                calendarBackground: '#0B1A2E',

                textSectionTitleColor: '#A8B6C9',

                selectedDayBackgroundColor: '#2563EB',

                selectedDayTextColor: '#FFFFFF',

                todayTextColor: '#7DD3FC',

                dayTextColor: '#F1F5F9',

                textDisabledColor: '#52647A',

                monthTextColor: '#F1F5F9',

                arrowColor: '#7DD3FC',
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
