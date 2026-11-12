import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Calendar } from 'react-native-calendars';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './SubmitPaymentModal.styles';

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

function getPayableLabel(item) {
  return (
    item?.creditor_name ||
    item?.vendor_name ||
    item?.counterparty_name ||
    item?.supplier_name ||
    item?.description ||
    `Payable #${item?.id}`
  );
}

function getPayableAmount(item) {
  return Number(item?.outstanding_amount ?? item?.amount ?? item?.balance ?? 0);
}

export default function SubmitPaymentModal({
  visible,
  payables = [],
  submitting,
  onClose,
  onSubmit,
}) {
  const [selectedPayableId, setSelectedPayableId] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('bank');

  const [paymentDate, setPaymentDate] = useState(getTodayIso());

  const [amount, setAmount] = useState('');

  const [reference, setReference] = useState('');

  const [payablePickerVisible, setPayablePickerVisible] = useState(false);

  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setSelectedPayableId(null);
    setPaymentMethod('bank');
    setPaymentDate(getTodayIso());
    setAmount('');
    setReference('');
    setPayablePickerVisible(false);
    setCalendarVisible(false);
  }, [visible]);

  const selectedPayable = useMemo(
    () =>
      payables.find(item => Number(item?.id) === Number(selectedPayableId)) ||
      null,
    [payables, selectedPayableId],
  );

  function selectPayable(item) {
    setSelectedPayableId(item.id);

    const outstanding = getPayableAmount(item);

    setAmount(outstanding > 0 ? String(outstanding) : '');

    setPayablePickerVisible(false);
  }

  const numericAmount = Number(amount);

  const canSubmit =
    Boolean(selectedPayableId) &&
    Number.isFinite(numericAmount) &&
    numericAmount > 0 &&
    Boolean(paymentDate) &&
    !submitting;

  function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    onSubmit?.({
      payable_id: Number(selectedPayableId),

      amount: numericAmount,

      payment_method: paymentMethod,

      payment_date: paymentDate,

      reference: reference.trim() || null,
    });
  }

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={submitting ? () => {} : onClose}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>Submit payment</Text>

                <Text style={styles.subtitle}>
                  Pay an outstanding supplier bill or another creditor balance.
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
            >
              <Text style={styles.label}>Creditor to pay</Text>

              {payables.length === 0 ? (
                <>
                  <View style={[styles.selectButton, styles.disabledField]}>
                    <Text style={styles.placeholderText}>
                      No outstanding creditor entries available
                    </Text>
                  </View>

                  <View style={styles.warningBox}>
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={20}
                      color="#7DD3FC"
                    />

                    <Text style={styles.warningText}>
                      No outstanding creditor entry is ready for payment. Record
                      a supplier bill or post a credit balance to a ledger in
                      the Creditors group first.
                    </Text>
                  </View>
                </>
              ) : (
                <Pressable
                  onPress={() => setPayablePickerVisible(true)}
                  style={styles.selectButton}
                >
                  <Text
                    style={
                      selectedPayable
                        ? styles.selectText
                        : styles.placeholderText
                    }
                    numberOfLines={1}
                  >
                    {selectedPayable
                      ? getPayableLabel(selectedPayable)
                      : 'Select creditor / payable'}
                  </Text>

                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={21}
                    color="#A8B6C9"
                  />
                </Pressable>
              )}

              <Text style={styles.label}>Amount</Text>

              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                editable={Boolean(selectedPayableId)}
                placeholder="0.00"
                placeholderTextColor="#718096"
                style={[
                  styles.input,
                  !selectedPayableId && styles.disabledField,
                ]}
              />

              <Text style={styles.label}>Payment method</Text>

              <View style={styles.methodRow}>
                <Pressable
                  onPress={() => setPaymentMethod('bank')}
                  style={[
                    styles.methodButton,
                    paymentMethod === 'bank' && styles.methodButtonActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="bank-outline"
                    size={18}
                    color={paymentMethod === 'bank' ? '#FFFFFF' : '#A8B6C9'}
                  />

                  <Text
                    style={[
                      styles.methodText,
                      paymentMethod === 'bank' && styles.methodTextActive,
                    ]}
                  >
                    Bank
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setPaymentMethod('cash')}
                  style={[
                    styles.methodButton,
                    paymentMethod === 'cash' && styles.methodButtonActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="cash"
                    size={18}
                    color={paymentMethod === 'cash' ? '#FFFFFF' : '#A8B6C9'}
                  />

                  <Text
                    style={[
                      styles.methodText,
                      paymentMethod === 'cash' && styles.methodTextActive,
                    ]}
                  >
                    Cash
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.label}>Payment date</Text>

              <Pressable
                onPress={() => setCalendarVisible(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateText}>
                  {formatDisplayDate(paymentDate)}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={19}
                  color="#DCE7F5"
                />
              </Pressable>

              <Text style={styles.label}>Reference</Text>

              <TextInput
                value={reference}
                onChangeText={setReference}
                placeholder={
                  paymentMethod === 'bank'
                    ? 'Bank transfer / cheque reference'
                    : 'Optional reference'
                }
                placeholderTextColor="#718096"
                style={styles.input}
              />

              <View style={styles.actions}>
                <Pressable
                  disabled={submitting}
                  onPress={onClose}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={!canSubmit}
                  onPress={handleSubmit}
                  style={[
                    styles.submitButton,
                    !canSubmit && styles.submitButtonDisabled,
                  ]}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons
                      name="cash-check"
                      size={18}
                      color="#FFFFFF"
                    />
                  )}

                  <Text style={styles.submitText}>
                    {submitting ? 'Posting...' : 'Post payment voucher'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Payable selector */}
      <Modal
        visible={payablePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPayablePickerVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.selectionModal}>
            <View style={styles.selectionHeader}>
              <Text style={styles.selectionTitle}>Select Creditor</Text>

              <Pressable
                onPress={() => setPayablePickerVisible(false)}
                style={styles.selectionClose}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ScrollView>
              {payables.map(item => (
                <Pressable
                  key={String(item.id)}
                  onPress={() => selectPayable(item)}
                  style={styles.selectionItem}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text style={styles.selectionItemTitle}>
                      {getPayableLabel(item)}
                    </Text>

                    <Text style={styles.selectionItemSubtitle}>
                      Outstanding: {getPayableAmount(item).toFixed(2)}
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color="#A8B6C9"
                  />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Date calendar */}
      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Payment Date</Text>

              <Pressable
                onPress={() => setCalendarVisible(false)}
                style={styles.selectionClose}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Calendar
              current={paymentDate}
              onDayPress={day => {
                setPaymentDate(day.dateString);

                setCalendarVisible(false);
              }}
              markedDates={{
                [paymentDate]: {
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
