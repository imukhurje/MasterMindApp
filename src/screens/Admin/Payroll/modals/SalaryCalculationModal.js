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

import { Calendar } from 'react-native-calendars';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './SalaryCalculationModal.styles';

function getTodayIso() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value) {
  if (!value) {
    return '';
  }

  const [year, month, day] = String(value).slice(0, 10).split('-');

  if (!year || !month || !day) {
    return String(value);
  }

  return `${day}-${month}-${year}`;
}

function formatMonthLabel(value) {
  if (!value) {
    return '-';
  }

  const [year, month] = String(value).slice(0, 7).split('-');

  const monthNumber = Number(month);

  if (!year || monthNumber < 1 || monthNumber > 12) {
    return String(value);
  }

  const names = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return `${names[monthNumber - 1]}, ${year}`;
}

function amount(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return '0.00';
  }

  return number.toFixed(2);
}

function getApiErrorMessage(error, fallback) {
  const validationErrors = error?.data?.errors || error?.response?.data?.errors;

  if (validationErrors) {
    const firstError = Object.values(validationErrors).flat().find(Boolean);

    if (firstError) {
      return String(firstError);
    }
  }

  return (
    error?.data?.message ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

function getPreviewCalculation(response) {
  return (
    response?.calculation ||
    response?.preview ||
    response?.data?.calculation ||
    response?.data ||
    response ||
    null
  );
}

function getManualAdjustments(calculation) {
  if (!Array.isArray(calculation?.lines)) {
    return [];
  }

  return calculation.lines
    .filter(item => {
      const type = String(item?.line_type || '');

      return type === 'manual_earning' || type === 'manual_deduction';
    })
    .map((item, index) => ({
      key: `${item?.id || 'manual'}-${index}`,

      kind:
        String(item?.line_type || '') === 'manual_deduction'
          ? 'deduction'
          : 'earning',

      label: String(item?.label || ''),

      amount: String(item?.amount || ''),

      reason: String(item?.source_snapshot?.reason || ''),
    }));
}

export default function SalaryCalculationModal({
  visible,

  calculation,
  staff,
  eligiblePeriod,

  savingDraft = false,
  settling = false,

  onClose,
  onPreview,
  onSaveDraft,
  onPostSettlement,
}) {
  const [workingCalculation, setWorkingCalculation] = useState(null);

  const [previewCalculation, setPreviewCalculation] = useState(null);

  const [previewing, setPreviewing] = useState(false);

  const [previewError, setPreviewError] = useState('');

  const [payableDaysOverride, setPayableDaysOverride] = useState('');

  const [overrideReason, setOverrideReason] = useState('');

  const [manualAdjustments, setManualAdjustments] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState('cash');

  const [paymentDate, setPaymentDate] = useState(getTodayIso());

  const [paymentReference, setPaymentReference] = useState('');

  const [paymentDetails, setPaymentDetails] = useState('');

  const [paymentCalendarVisible, setPaymentCalendarVisible] = useState(false);

  const periodStart =
    calculation?.period_start ||
    calculation?.calculation_month ||
    eligiblePeriod?.start ||
    null;

  const periodEnd = calculation?.period_end || eligiblePeriod?.end || null;

  const salaryMonth = periodStart ? String(periodStart).slice(0, 7) : '';

  const isNewCalculation =
    calculation?.isNewCalculation === true || !calculation?.id;

  useEffect(() => {
    if (!visible) {
      return;
    }

    const initialCalculation = calculation?.id ? calculation : null;

    setWorkingCalculation(initialCalculation);

    setPreviewCalculation(initialCalculation);

    setPreviewError('');

    setPayableDaysOverride(
      calculation?.payable_days_override == null
        ? ''
        : String(calculation.payable_days_override),
    );

    setOverrideReason(String(calculation?.payable_days_override_reason || ''));

    setManualAdjustments(getManualAdjustments(calculation));

    const currentPayment =
      calculation?.salary_payment ||
      calculation?.paid_snapshot?.payment ||
      null;

    setPaymentMethod(
      String(
        currentPayment?.payment_method || currentPayment?.method || 'cash',
      ).toLowerCase(),
    );

    setPaymentDate(
      currentPayment?.payment_date
        ? String(currentPayment.payment_date).slice(0, 10)
        : currentPayment?.date
        ? String(currentPayment.date).slice(0, 10)
        : getTodayIso(),
    );

    const userId = Number(
      calculation?.user_id || staff?.id || calculation?.user?.id,
    );

    const periodReference = periodStart
      ? String(periodStart).slice(0, 10).replaceAll('-', '')
      : '';

    setPaymentReference(
      currentPayment?.payment_reference ||
        currentPayment?.reference ||
        (periodReference && userId
          ? `PAYROLL-${periodReference}-${userId}`
          : ''),
    );

    setPaymentDetails(
      String(currentPayment?.payment_details || currentPayment?.details || ''),
    );

    if (!initialCalculation && onPreview) {
      const previewPayload = {
        user_id: userId,

        salary_month: salaryMonth,

        period_start: periodStart ? String(periodStart).slice(0, 10) : null,

        period_end: periodEnd ? String(periodEnd).slice(0, 10) : null,

        payable_days_override: null,

        payable_days_override_reason: null,

        manual_adjustments: [],

        unit_quantities: [],
      };

      setPreviewing(true);

      Promise.resolve(onPreview(previewPayload))
        .then(response => {
          setPreviewCalculation(getPreviewCalculation(response));

          setPreviewError('');
        })
        .catch(error => {
          setPreviewCalculation(null);

          setPreviewError(
            getApiErrorMessage(
              error,
              'Could not calculate the salary preview.',
            ),
          );
        })
        .finally(() => {
          setPreviewing(false);
        });
    }
  }, [
    visible,
    calculation,
    staff,
    eligiblePeriod,
    onPreview,
    periodStart,
    periodEnd,
    salaryMonth,
  ]);

  const previewLines = useMemo(() => {
    return Array.isArray(previewCalculation?.lines)
      ? previewCalculation.lines
      : [];
  }, [previewCalculation]);

  const earningLines = useMemo(() => {
    return previewLines.filter(item => {
      const type = String(item?.line_type || '');

      return type === 'earning' || type === 'manual_earning';
    });
  }, [previewLines]);

  const deductionLines = useMemo(() => {
    return previewLines.filter(item => {
      const type = String(item?.line_type || '');

      return (
        type === 'deduction' ||
        type === 'manual_deduction' ||
        type === 'advance_adjustment'
      );
    });
  }, [previewLines]);

  const title = `${isNewCalculation ? 'Create' : 'Edit'} ${formatMonthLabel(
    salaryMonth,
  ).replace(',', '')} calculation`;

  const staffLabel =
    staff?.designation ||
    staff?.role ||
    calculation?.user?.designation ||
    calculation?.user?.role ||
    'Staff';

  const buildDraftPayload = () => {
    const userId = Number(
      calculation?.user_id || staff?.id || calculation?.user?.id,
    );

    const overrideText = String(payableDaysOverride || '').trim();

    return {
      user_id: userId,

      salary_month: salaryMonth,

      period_start: periodStart ? String(periodStart).slice(0, 10) : null,

      period_end: periodEnd ? String(periodEnd).slice(0, 10) : null,

      payable_days_override: overrideText === '' ? null : Number(overrideText),

      payable_days_override_reason:
        overrideText === ''
          ? null
          : String(overrideReason || '').trim() || null,

      manual_adjustments: manualAdjustments
        .filter(item => {
          return (
            String(item?.label || '').trim() &&
            String(item?.amount || '').trim()
          );
        })
        .map(item => ({
          kind: item.kind,

          label: String(item.label).trim(),

          amount: String(item.amount).trim(),

          reason: String(item.reason || '').trim() || null,
        })),

      unit_quantities: [],
    };
  };

  function validateDraft() {
    if (!salaryMonth || !periodStart || !periodEnd) {
      Alert.alert('Salary Calculation', 'Eligible salary period is missing.');

      return false;
    }

    const overrideText = String(payableDaysOverride || '').trim();

    if (overrideText !== '' && !String(overrideReason || '').trim()) {
      Alert.alert(
        'Salary Calculation',
        'Override reason is required when payable days are overridden.',
      );

      return false;
    }

    if (
      overrideText !== '' &&
      (!Number.isFinite(Number(overrideText)) || Number(overrideText) < 0)
    ) {
      Alert.alert('Salary Calculation', 'Enter a valid payable-days override.');

      return false;
    }

    return true;
  }

  async function handleSaveDraft() {
    if (!validateDraft() || savingDraft || settling) {
      return;
    }

    try {
      const saved = await onSaveDraft?.(buildDraftPayload());

      if (!saved) {
        return;
      }

      setWorkingCalculation(saved);

      setPreviewCalculation(saved);

      setPreviewError('');

      setManualAdjustments(getManualAdjustments(saved));

      Alert.alert('Salary Calculation', 'Draft saved successfully.');
    } catch (error) {
      Alert.alert(
        'Salary Calculation',
        getApiErrorMessage(
          error,
          'Could not save the salary calculation draft.',
        ),
      );
    }
  }

  async function handlePostSettlement() {
    if (!validateDraft() || savingDraft || settling) {
      return;
    }

    if (!paymentDate) {
      Alert.alert('Salary Settlement', 'Payment date is required.');

      return;
    }

    try {
      const settled = await onPostSettlement?.({
        draftPayload: buildDraftPayload(),

        settlementPayload: {
          payment_method: paymentMethod,

          payment_date: paymentDate,

          payment_reference: String(paymentReference || '').trim() || null,

          payment_details: String(paymentDetails || '').trim() || null,

          advance_allocations: [],
        },
      });

      if (!settled) {
        return;
      }

      Alert.alert('Salary Settlement', 'Salary settled successfully.');

      onClose?.();
    } catch (error) {
      Alert.alert(
        'Salary Settlement',
        getApiErrorMessage(error, 'Could not settle this salary calculation.'),
      );
    }
  }

  function addAdjustment() {
    setManualAdjustments(current => [
      ...current,

      {
        key: `new-${Date.now()}-${current.length}`,
        kind: 'earning',
        label: '',
        amount: '',
        reason: '',
      },
    ]);
  }

  function updateAdjustment(index, field, value) {
    setManualAdjustments(current =>
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

  function removeAdjustment(index) {
    setManualAdjustments(current =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  const busy = previewing || savingDraft || settling;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!busy) {
            onClose?.();
          }
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>{title}</Text>

                <Text style={styles.subtitle}>
                  {staff?.name || calculation?.user?.name || 'Employee'}
                  {' · '}
                  {staffLabel}
                </Text>
              </View>

              <Pressable
                disabled={busy}
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && !busy && styles.pressed,
                  busy && styles.disabled,
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.content}
            >
              <Text style={styles.label}>Salary month</Text>

              <View style={styles.readOnlyField}>
                <Text style={styles.fieldText}>
                  {formatMonthLabel(salaryMonth)}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={19}
                  color="#F1F5F9"
                />
              </View>

              <Text style={styles.label}>Payable-days override</Text>

              <TextInput
                value={payableDaysOverride}
                onChangeText={setPayableDaysOverride}
                keyboardType="decimal-pad"
                placeholder="Use attendance/scheduled days"
                placeholderTextColor="#75869E"
                style={styles.input}
              />

              <Text style={styles.label}>Override reason</Text>

              <TextInput
                value={overrideReason}
                onChangeText={setOverrideReason}
                multiline
                placeholder="Required only when payable days are overridden"
                placeholderTextColor="#75869E"
                style={[styles.input, styles.reasonInput]}
              />

              {previewing ? (
                <View style={styles.previewLoading}>
                  <ActivityIndicator color="#60A5FA" />

                  <Text style={styles.previewLoadingText}>
                    Calculating salary preview...
                  </Text>
                </View>
              ) : previewError ? (
                <View style={styles.errorCard}>
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={20}
                    color="#FBBF24"
                  />

                  <Text style={styles.errorText}>{previewError}</Text>
                </View>
              ) : previewCalculation ? (
                <View style={styles.previewCard}>
                  <Text style={styles.previewTitle}>Pay slip preview</Text>

                  <Text style={styles.previewDays}>
                    Payable days{' '}
                    {amount(
                      previewCalculation?.payable_days_override ??
                        previewCalculation?.calculated_working_days,
                    )}{' '}
                    / scheduled days{' '}
                    {amount(previewCalculation?.working_days_denominator)}
                  </Text>

                  <View style={styles.previewColumns}>
                    <View style={styles.previewColumn}>
                      <Text style={styles.columnTitle}>Earnings</Text>

                      {earningLines.map((line, index) => (
                        <View
                          key={`earning-${line?.id ?? index}`}
                          style={styles.previewRow}
                        >
                          <Text style={styles.previewName}>
                            {line?.label || '-'}
                          </Text>

                          <Text style={styles.previewAmount}>
                            {amount(line?.amount)}
                          </Text>
                        </View>
                      ))}

                      <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total earnings</Text>

                        <Text style={styles.totalValue}>
                          {amount(previewCalculation?.earnings_total)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.previewColumn}>
                      <Text style={styles.columnTitle}>Deductions</Text>

                      {deductionLines.map((line, index) => (
                        <View
                          key={`deduction-${line?.id ?? index}`}
                          style={styles.previewRow}
                        >
                          <Text style={styles.previewName}>
                            {line?.label || '-'}
                          </Text>

                          <Text style={styles.previewAmount}>
                            {amount(line?.amount)}
                          </Text>
                        </View>
                      ))}

                      <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total deductions</Text>

                        <Text style={styles.totalValue}>
                          {amount(
                            Number(previewCalculation?.deductions_total) +
                              Number(previewCalculation?.advance_total),
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.netRow}>
                    <Text style={styles.netLabel}>Net earning</Text>

                    <Text style={styles.netValue}>
                      {amount(previewCalculation?.net_salary)}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.infoCard}>
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={20}
                    color="#7DD3FC"
                  />

                  <Text style={styles.infoText}>
                    Enter any required overrides or adjustments, then save the
                    draft to calculate the payslip.
                  </Text>
                </View>
              )}

              <Text style={styles.sectionTitle}>
                Manual component adjustments
              </Text>

              {manualAdjustments.map((item, index) => (
                <View
                  key={item.key || String(index)}
                  style={styles.adjustmentCard}
                >
                  <View style={styles.kindRow}>
                    <Pressable
                      onPress={() => updateAdjustment(index, 'kind', 'earning')}
                      style={[
                        styles.kindButton,
                        item.kind === 'earning' && styles.kindButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.kindButtonText,
                          item.kind === 'earning' &&
                            styles.kindButtonTextActive,
                        ]}
                      >
                        Earning
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        updateAdjustment(index, 'kind', 'deduction')
                      }
                      style={[
                        styles.kindButton,
                        item.kind === 'deduction' && styles.kindButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.kindButtonText,
                          item.kind === 'deduction' &&
                            styles.kindButtonTextActive,
                        ]}
                      >
                        Deduction
                      </Text>
                    </Pressable>
                  </View>

                  <TextInput
                    value={item.label}
                    onChangeText={value =>
                      updateAdjustment(index, 'label', value)
                    }
                    placeholder="Adjustment label"
                    placeholderTextColor="#75869E"
                    style={styles.input}
                  />

                  <TextInput
                    value={item.amount}
                    onChangeText={value =>
                      updateAdjustment(index, 'amount', value)
                    }
                    keyboardType="decimal-pad"
                    placeholder="Amount"
                    placeholderTextColor="#75869E"
                    style={styles.input}
                  />

                  <TextInput
                    value={item.reason}
                    onChangeText={value =>
                      updateAdjustment(index, 'reason', value)
                    }
                    placeholder="Reason"
                    placeholderTextColor="#75869E"
                    style={styles.input}
                  />

                  <Pressable
                    onPress={() => removeAdjustment(index)}
                    style={styles.removeButton}
                  >
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={17}
                      color="#FCA5A5"
                    />

                    <Text style={styles.removeButtonText}>Remove</Text>
                  </Pressable>
                </View>
              ))}

              <Pressable
                onPress={addAdjustment}
                style={({ pressed }) => [
                  styles.outlineButton,
                  pressed && styles.pressed,
                ]}
              >
                <MaterialCommunityIcons name="plus" size={18} color="#F1F5F9" />

                <Text style={styles.outlineButtonText}>Add adjustment</Text>
              </Pressable>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Settlement details</Text>

              <Text style={styles.label}>Payment method</Text>

              <View style={styles.paymentMethodRow}>
                <Pressable
                  onPress={() => setPaymentMethod('cash')}
                  style={[
                    styles.paymentMethodButton,
                    paymentMethod === 'cash' &&
                      styles.paymentMethodButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.paymentMethodText,
                      paymentMethod === 'cash' &&
                        styles.paymentMethodTextActive,
                    ]}
                  >
                    Cash
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setPaymentMethod('bank')}
                  style={[
                    styles.paymentMethodButton,
                    paymentMethod === 'bank' &&
                      styles.paymentMethodButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.paymentMethodText,
                      paymentMethod === 'bank' &&
                        styles.paymentMethodTextActive,
                    ]}
                  >
                    Bank
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.label}>Payment date</Text>

              <Pressable
                onPress={() => setPaymentCalendarVisible(true)}
                style={styles.readOnlyField}
              >
                <Text style={styles.fieldText}>
                  {formatDisplayDate(paymentDate)}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={19}
                  color="#F1F5F9"
                />
              </Pressable>

              <Text style={styles.label}>Payment reference</Text>

              <TextInput
                value={paymentReference}
                onChangeText={setPaymentReference}
                placeholder="Payment reference"
                placeholderTextColor="#75869E"
                style={styles.input}
              />

              <Text style={styles.label}>Payment details</Text>

              <TextInput
                value={paymentDetails}
                onChangeText={setPaymentDetails}
                multiline
                placeholder="Optional payment details"
                placeholderTextColor="#75869E"
                style={[styles.input, styles.paymentDetailsInput]}
              />

              <View style={styles.footerButtons}>
                <Pressable
                  disabled={busy}
                  onPress={handleSaveDraft}
                  style={({ pressed }) => [
                    styles.saveDraftButton,
                    busy && styles.disabled,
                    pressed && !busy && styles.pressed,
                  ]}
                >
                  {savingDraft ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveDraftButtonText}>Save Draft</Text>
                  )}
                </Pressable>

                <Pressable
                  disabled={busy}
                  onPress={handlePostSettlement}
                  style={({ pressed }) => [
                    styles.settleButton,
                    busy && styles.disabled,
                    pressed && !busy && styles.pressed,
                  ]}
                >
                  {settling ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.settleButtonText}>Post Settlement</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={paymentCalendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPaymentCalendarVisible(false)}
      >
        <Pressable
          style={styles.calendarOverlay}
          onPress={() => setPaymentCalendarVisible(false)}
        >
          <Pressable style={styles.calendarCard}>
            <Text style={styles.calendarTitle}>Payment date</Text>

            <Calendar
              current={paymentDate}
              markedDates={{
                [paymentDate]: {
                  selected: true,
                },
              }}
              onDayPress={day => {
                setPaymentDate(day.dateString);

                setPaymentCalendarVisible(false);
              }}
              theme={{
                calendarBackground: '#102B48',
                dayTextColor: '#F1F5F9',
                monthTextColor: '#FFFFFF',
                textDisabledColor: '#53657A',
                arrowColor: '#60A5FA',
                selectedDayBackgroundColor: '#2563EB',
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: '#7DD3FC',
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
