// src/screens/Admin/Payroll/modals/RepaymentAdjustmentModal.js

import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './RepaymentAdjustmentModal.styles';

function money(value, symbol = '₹') {
  return `${symbol}${(Number(value) || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatScheduleType(value) {
  if (!value) {
    return 'Repayment schedule';
  }

  return `${String(value).charAt(0).toUpperCase()}${String(value).slice(
    1,
  )} schedule`;
}

export default function RepaymentAdjustmentModal({
  visible,
  advance,
  currencySymbol = '₹',
  submitting = false,
  onClose,
  onSubmit,
}) {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [amount, setAmount] = useState('');
  const [periodListVisible, setPeriodListVisible] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const schedule = useMemo(() => {
    const rows = Array.isArray(advance?.repayment_schedule)
      ? [...advance.repayment_schedule]
      : [];

    return rows.sort((a, b) =>
      String(a?.period || '').localeCompare(String(b?.period || '')),
    );
  }, [advance]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const first = schedule[0];

    setSelectedPeriod(first?.period || '');

    setAmount(
      first
        ? String(
            first?.override_amount ??
              first?.amount ??
              first?.configured_amount ??
              '',
          )
        : '',
    );

    setSavedMessage('');
    setPeriodListVisible(false);
  }, [visible, advance?.id]);

  const selectedSchedule = useMemo(() => {
    return (
      schedule.find(item => String(item?.period) === String(selectedPeriod)) ||
      null
    );
  }, [schedule, selectedPeriod]);

  const futureSchedule = useMemo(() => {
    const selectedIndex = schedule.findIndex(
      item => String(item?.period) === String(selectedPeriod),
    );

    if (selectedIndex < 0) {
      return [];
    }

    return schedule.slice(selectedIndex + 1);
  }, [schedule, selectedPeriod]);

  function selectPeriod(item) {
    setSelectedPeriod(item?.period || '');

    setAmount(
      String(
        item?.override_amount ?? item?.amount ?? item?.configured_amount ?? '',
      ),
    );

    setPeriodListVisible(false);
    setSavedMessage('');
  }

  async function handleSave() {
    if (!advance?.id) {
      return;
    }

    if (!selectedPeriod) {
      Alert.alert('Repayment Adjustment', 'Please select a repayment period.');

      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
      Alert.alert(
        'Repayment Adjustment',
        'Please enter a valid adjustment amount.',
      );

      return;
    }

    const result = await onSubmit?.({
      advanceId: Number(advance.id),
      repaymentPeriod: selectedPeriod,
      amount: numericAmount.toFixed(2),
    });

    if (result) {
      setSavedMessage('Saved. Future repayment adjustments have been updated.');
    }
  }

  if (!advance) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={() => {
        if (!submitting) {
          onClose?.();
        }
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Adjust scheduled repayment</Text>

              <Text style={styles.subtitle}>
                {advance?.reference || '-'} ·{' '}
                {formatScheduleType(advance?.repayment_mode)}
              </Text>
            </View>

            <Pressable
              disabled={submitting}
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && !submitting && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            {!!savedMessage && (
              <View style={styles.successCard}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={18}
                  color="#86EFAC"
                />

                <Text style={styles.successText}>{savedMessage}</Text>
              </View>
            )}

            {schedule.length === 0 ? (
              <View style={styles.emptyCard}>
                <MaterialCommunityIcons
                  name="calendar-remove-outline"
                  size={28}
                  color="#8296AF"
                />

                <Text style={styles.emptyTitle}>No repayment schedule</Text>

                <Text style={styles.emptyText}>
                  This advance does not currently have any scheduled repayment
                  periods.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.fieldRow}>
                  <View style={styles.fieldColumn}>
                    <Text style={styles.fieldLabel}>Next repayment period</Text>

                    <Pressable
                      onPress={() => setPeriodListVisible(current => !current)}
                      style={styles.selectButton}
                    >
                      <Text style={styles.selectText}>
                        {selectedPeriod || 'Select period'}
                      </Text>

                      <MaterialCommunityIcons
                        name={periodListVisible ? 'chevron-up' : 'chevron-down'}
                        size={22}
                        color="#DCE7F5"
                      />
                    </Pressable>

                    {periodListVisible && (
                      <View style={styles.periodDropdown}>
                        {schedule.map(item => {
                          const active =
                            String(item?.period) === String(selectedPeriod);

                          return (
                            <Pressable
                              key={String(item?.period)}
                              onPress={() => selectPeriod(item)}
                              style={[
                                styles.periodOption,
                                active && styles.periodOptionActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.periodOptionText,
                                  active && styles.periodOptionTextActive,
                                ]}
                              >
                                {item?.period || '-'}
                              </Text>

                              <Text style={styles.periodAmount}>
                                {money(item?.amount, currencySymbol)}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    )}
                  </View>

                  <View style={styles.fieldColumn}>
                    <Text style={styles.fieldLabel}>
                      Adjustment for this period
                    </Text>

                    <TextInput
                      value={amount}
                      onChangeText={text => {
                        setAmount(text);
                        setSavedMessage('');
                      }}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor="#70839C"
                      style={styles.input}
                    />
                  </View>
                </View>

                {!!selectedSchedule && (
                  <Text style={styles.scheduledText}>
                    Scheduled adjustment:{' '}
                    {money(selectedSchedule?.amount, currencySymbol)}
                    {selectedSchedule?.override_amount !== null &&
                    selectedSchedule?.override_amount !== undefined
                      ? ' (overridden)'
                      : ''}
                  </Text>
                )}

                <Text style={styles.helpText}>
                  The difference is shared equally across the future scheduled
                  repayment periods. Finalized salary periods cannot be changed.
                </Text>

                <View style={styles.futureCard}>
                  <Text style={styles.futureTitle}>
                    Future advance adjustments
                  </Text>

                  {futureSchedule.length === 0 ? (
                    <View style={styles.futureEmpty}>
                      <Text style={styles.futureEmptyText}>
                        No future scheduled repayment periods.
                      </Text>
                    </View>
                  ) : (
                    futureSchedule.map((item, index) => (
                      <View
                        key={String(item?.period)}
                        style={[
                          styles.futureRow,
                          index === futureSchedule.length - 1 &&
                            styles.futureRowLast,
                        ]}
                      >
                        <View>
                          <Text style={styles.futureLabel}>Period</Text>

                          <Text style={styles.futureValue}>
                            {item?.period || '-'}
                          </Text>
                        </View>

                        <View style={styles.futureAmountBlock}>
                          <Text style={styles.futureLabel}>
                            Advance adjustment
                          </Text>

                          <Text style={styles.futureAmount}>
                            {money(item?.amount, currencySymbol)}
                          </Text>
                        </View>
                      </View>
                    ))
                  )}
                </View>

                <Pressable
                  disabled={submitting}
                  onPress={handleSave}
                  style={({ pressed }) => [
                    styles.saveButton,
                    submitting && styles.buttonDisabled,
                    pressed && !submitting && styles.pressed,
                  ]}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons
                      name="content-save-outline"
                      size={19}
                      color="#FFFFFF"
                    />
                  )}

                  <Text style={styles.saveButtonText}>
                    {submitting ? 'Saving...' : 'Save repayment adjustment'}
                  </Text>
                </Pressable>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
