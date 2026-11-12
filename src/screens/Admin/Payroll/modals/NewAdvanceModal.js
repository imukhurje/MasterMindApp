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

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DatePickerModal from '../../Accounts/modals/DatePickerModal';

import styles from './NewAdvanceModal.styles';

function getTodayIso() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value) {
  if (!value) {
    return '-';
  }

  const [year, month, day] = String(value).split('-');

  return `${day}-${month}-${year}`;
}

function getCurrentPeriod() {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function generateReference() {
  const date = getTodayIso().replace(/-/g, '');

  const random = Math.random().toString(36).slice(2, 15).toUpperCase();

  return `ADV-${date}-${random}`;
}

const REPAYMENT_MODES = [
  {
    value: 'fixed',
    label: 'Fixed per period salary adjustment',
  },
  {
    value: 'variable',
    label: 'Variable repayment schedule',
  },
  {
    value: 'manual',
    label: 'Manual repayment',
  },
];

function SelectionModal({
  visible,
  title,
  options,
  selectedValue,
  onClose,
  onSelect,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.selectionOverlay}>
        <Pressable style={styles.selectionBackdrop} onPress={onClose} />

        <View style={styles.selectionCard}>
          <View style={styles.selectionHeader}>
            <Text style={styles.selectionTitle}>{title}</Text>

            <Pressable onPress={onClose} style={styles.smallCloseButton}>
              <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.selectionList}
          >
            {options.map(item => {
              const active = String(item.value) === String(selectedValue);

              return (
                <Pressable
                  key={String(item.value)}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                  style={[
                    styles.selectionOption,
                    active && styles.selectionOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.selectionOptionText,
                      active && styles.selectionOptionTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>

                  {active && (
                    <MaterialCommunityIcons
                      name="check"
                      size={18}
                      color="#FFFFFF"
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function NewAdvanceModal({
  visible,
  staff = null,
  data = null,
  submitting = false,
  onClose,
  onSubmit,
}) {
  const [amount, setAmount] = useState('');
  const [issuedOn, setIssuedOn] = useState(getTodayIso());

  const [disbursementAccountId, setDisbursementAccountId] = useState(null);

  const [reference, setReference] = useState('');

  const [repaymentMode, setRepaymentMode] = useState('fixed');

  const [repaymentStartPeriod, setRepaymentStartPeriod] = useState(
    getCurrentPeriod(),
  );

  const [repaymentFixedAmount, setRepaymentFixedAmount] = useState('');

  const [details, setDetails] = useState('');

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [accountSelectorVisible, setAccountSelectorVisible] = useState(false);

  const [repaymentSelectorVisible, setRepaymentSelectorVisible] =
    useState(false);

  const paymentAccounts = useMemo(() => {
    return Array.isArray(data?.payment_accounts) ? data.payment_accounts : [];
  }, [data]);

  const accountOptions = useMemo(() => {
    return paymentAccounts.map(item => ({
      value: item.id,
      label: `${item.code || ''} — ${item.name || 'Account'}`,
      item,
    }));
  }, [paymentAccounts]);

  const selectedAccount = useMemo(() => {
    return paymentAccounts.find(
      item => Number(item?.id) === Number(disbursementAccountId),
    );
  }, [paymentAccounts, disbursementAccountId]);

  const selectedRepaymentMode = useMemo(() => {
    return REPAYMENT_MODES.find(item => item.value === repaymentMode);
  }, [repaymentMode]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setAmount('');
    setIssuedOn(getTodayIso());
    setReference(generateReference());
    setRepaymentMode('fixed');
    setRepaymentStartPeriod(getCurrentPeriod());
    setRepaymentFixedAmount('');
    setDetails('');

    const mappedBankId = Number(data?.account_mapping?.bank_account_id);

    const defaultAccount =
      paymentAccounts.find(item => Number(item?.id) === mappedBankId) ||
      paymentAccounts[0] ||
      null;

    setDisbursementAccountId(defaultAccount?.id || null);
  }, [visible, data, paymentAccounts]);

  function handleRecordAdvance() {
    const numericAmount = Number(amount);

    if (!staff?.id) {
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return;
    }

    if (!issuedOn || !disbursementAccountId) {
      return;
    }

    if (!reference.trim()) {
      return;
    }

    if (
      repaymentMode === 'fixed' &&
      (!repaymentStartPeriod ||
        !Number.isFinite(Number(repaymentFixedAmount)) ||
        Number(repaymentFixedAmount) <= 0)
    ) {
      return;
    }

    const payload = {
      user_id: String(staff.id),
      amount: amount.trim(),
      issued_on: issuedOn,
      disbursement_account_id: String(disbursementAccountId),
      reference: reference.trim(),
      repayment_mode: repaymentMode,
      repayment_start_period:
        repaymentMode === 'fixed' ? repaymentStartPeriod : null,
      repayment_fixed_amount:
        repaymentMode === 'fixed' ? repaymentFixedAmount.trim() : null,
      details: details.trim() || null,
    };

    onSubmit?.(payload);
  }

  const canSubmit =
    !!staff?.id &&
    Number(amount) > 0 &&
    !!issuedOn &&
    !!disbursementAccountId &&
    !!reference.trim() &&
    (repaymentMode !== 'fixed' ||
      (!!repaymentStartPeriod && Number(repaymentFixedAmount) > 0));

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!submitting) {
            onClose?.();
          }
        }}
      >
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => {
              if (!submitting) {
                onClose?.();
              }
            }}
          />

          <View style={styles.modalCard}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.header}>
                <View style={styles.headerText}>
                  <Text style={styles.title}>New staff advance</Text>

                  <Text style={styles.subtitle}>
                    {staff?.name || '-'}
                    {staff?.designation || staff?.role
                      ? ` · ${staff.designation || staff.role}`
                      : ''}
                  </Text>
                </View>

                <Pressable
                  disabled={submitting}
                  onPress={onClose}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={23}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>

              <Text style={styles.label}>Amount</Text>

              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#718096"
                style={styles.input}
              />

              <Text style={styles.label}>Date</Text>

              <Pressable
                onPress={() => setCalendarVisible(true)}
                style={styles.selectInput}
              >
                <Text style={styles.selectText}>
                  {formatDisplayDate(issuedOn)}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={20}
                  color="#DCE7F5"
                />
              </Pressable>

              <Text style={styles.label}>Disbursement</Text>

              <Pressable
                onPress={() => setAccountSelectorVisible(true)}
                style={styles.selectInput}
              >
                <Text numberOfLines={1} style={styles.selectText}>
                  {selectedAccount
                    ? `${selectedAccount.code || ''} — ${
                        selectedAccount.name || ''
                      }`
                    : 'Select account'}
                </Text>

                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color="#DCE7F5"
                />
              </Pressable>

              <Text style={styles.label}>Reference</Text>

              <TextInput
                value={reference}
                onChangeText={setReference}
                placeholder="Advance reference"
                placeholderTextColor="#718096"
                autoCapitalize="characters"
                style={styles.input}
              />

              <Text style={styles.label}>Repayment mode</Text>

              <Pressable
                onPress={() => setRepaymentSelectorVisible(true)}
                style={styles.selectInput}
              >
                <Text style={styles.selectText}>
                  {selectedRepaymentMode?.label || 'Select repayment mode'}
                </Text>

                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color="#DCE7F5"
                />
              </Pressable>

              {repaymentMode === 'fixed' && (
                <View style={styles.twoColumnRow}>
                  <View style={styles.flexField}>
                    <Text style={styles.label}>First adjustment period</Text>

                    <TextInput
                      value={repaymentStartPeriod}
                      onChangeText={setRepaymentStartPeriod}
                      placeholder="YYYY-MM"
                      placeholderTextColor="#718096"
                      style={styles.input}
                    />
                  </View>

                  <View style={styles.flexField}>
                    <Text style={styles.label}>Fixed amount per period</Text>

                    <TextInput
                      value={repaymentFixedAmount}
                      onChangeText={setRepaymentFixedAmount}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor="#718096"
                      style={styles.input}
                    />
                  </View>
                </View>
              )}

              <Text style={styles.label}>Details</Text>

              <TextInput
                value={details}
                onChangeText={setDetails}
                placeholder="Optional details"
                placeholderTextColor="#718096"
                multiline
                textAlignVertical="top"
                style={styles.detailsInput}
              />

              <Pressable
                disabled={!canSubmit || submitting}
                onPress={handleRecordAdvance}
                style={({ pressed }) => [
                  styles.submitButton,

                  (!canSubmit || submitting) && styles.submitButtonDisabled,

                  pressed && canSubmit && !submitting && styles.buttonPressed,
                ]}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <MaterialCommunityIcons
                    name="cash-plus"
                    size={19}
                    color="#FFFFFF"
                  />
                )}

                <Text style={styles.submitButtonText}>
                  {submitting ? 'Recording...' : 'Record advance'}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <DatePickerModal
        visible={calendarVisible}
        title="Select Date"
        subtitle="Select advance issue date"
        selectedDate={issuedOn}
        onClose={() => setCalendarVisible(false)}
        onDayPress={day => {
          if (day?.dateString) {
            setIssuedOn(day.dateString);
          }

          setCalendarVisible(false);
        }}
      />

      <SelectionModal
        visible={accountSelectorVisible}
        title="Select disbursement account"
        options={accountOptions}
        selectedValue={disbursementAccountId}
        onClose={() => setAccountSelectorVisible(false)}
        onSelect={option => setDisbursementAccountId(option.value)}
      />

      <SelectionModal
        visible={repaymentSelectorVisible}
        title="Select repayment mode"
        options={REPAYMENT_MODES}
        selectedValue={repaymentMode}
        onClose={() => setRepaymentSelectorVisible(false)}
        onSelect={option => {
          setRepaymentMode(option.value);

          if (option.value !== 'fixed') {
            setRepaymentFixedAmount('');
          }
        }}
      />
    </>
  );
}
