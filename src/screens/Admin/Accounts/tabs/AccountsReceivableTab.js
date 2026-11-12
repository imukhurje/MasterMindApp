import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../../api/client';

import styles from './AccountsReceivableTab.styles';

import ReceiptDetailsModal from '../modals/ReceiptDetailsModal';
import ReconcileReceiptModal from '../modals/ReconcileReceiptModal';
import DatePickerModal from '../modals/DatePickerModal';

import {
  formatDisplayDate,
  formatMoney,
  getSevenDaysAgoIso,
  getTodayIso,
} from '../utils/accountsHelpers';

const BASE = '/api/plugins/financial-accounting';

function EmptyCard({ icon = 'inbox-outline', title, description }) {
  return (
    <View style={styles.emptyCard}>
      <MaterialCommunityIcons name={icon} size={30} color="#718096" />

      <Text style={styles.emptyTitle}>{title}</Text>

      {!!description && <Text style={styles.emptyText}>{description}</Text>}
    </View>
  );
}

export default function AccountsReceivableTab({
  receipts = [],
  currencySymbol = '₹',

  onReceiptsChange,
  onBankBookChange,
  onReceivablesChange,
  onPayablesChange,
}) {
  const [receiptDateFrom, setReceiptDateFrom] = useState(getSevenDaysAgoIso);

  const [receiptDateTo, setReceiptDateTo] = useState(getTodayIso);

  const [receiptSearch, setReceiptSearch] = useState('');

  const [receiptMinAmount, setReceiptMinAmount] = useState('');

  const [receiptMaxAmount, setReceiptMaxAmount] = useState('');

  const [appliedReceiptFilters, setAppliedReceiptFilters] = useState({
    dateFrom: getSevenDaysAgoIso(),
    dateTo: getTodayIso(),
    search: '',
    min: '',
    max: '',
  });

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [calendarTarget, setCalendarTarget] = useState(null);

  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [receiptDetailsVisible, setReceiptDetailsVisible] = useState(false);

  const [reconcileReceiptVisible, setReconcileReceiptVisible] = useState(false);

  const [reconcilingStudentFees, setReconcilingStudentFees] = useState(false);

  const recentReceipts = useMemo(() => {
    const {
      dateFrom: filterFrom,
      dateTo: filterTo,
      search,
      min,
      max,
    } = appliedReceiptFilters;

    const searchLower = String(search || '')
      .trim()
      .toLowerCase();

    const minNumber = min === '' ? null : Number(min);

    const maxNumber = max === '' ? null : Number(max);

    return receipts.filter(item => {
      const date = item?.receipt_date || item?.created_at?.slice?.(0, 10) || '';

      if (filterFrom && date && date < filterFrom) {
        return false;
      }

      if (filterTo && date && date > filterTo) {
        return false;
      }

      const amount = Number(item?.amount) || 0;

      if (
        minNumber !== null &&
        Number.isFinite(minNumber) &&
        amount < minNumber
      ) {
        return false;
      }

      if (
        maxNumber !== null &&
        Number.isFinite(maxNumber) &&
        amount > maxNumber
      ) {
        return false;
      }

      if (searchLower) {
        const haystack = [
          item?.receipt_number,
          item?.source_reference,
          item?.reference,
          item?.description,
          item?.payment_method,
          item?.status,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [receipts, appliedReceiptFilters]);

  const calendarSelectedDate =
    calendarTarget === 'receipt_to' ? receiptDateTo : receiptDateFrom;

  const calendarMinDate =
    calendarTarget === 'receipt_to' ? receiptDateFrom || undefined : undefined;

  const calendarMaxDate =
    calendarTarget === 'receipt_from' ? receiptDateTo || undefined : undefined;

  function applyReceiptFilters() {
    setAppliedReceiptFilters({
      dateFrom: receiptDateFrom,
      dateTo: receiptDateTo,

      search: receiptSearch.trim(),

      min: receiptMinAmount.trim(),

      max: receiptMaxAmount.trim(),
    });
  }

  function applyReceiptLastSevenDays() {
    const from = getSevenDaysAgoIso();

    const to = getTodayIso();

    setReceiptDateFrom(from);
    setReceiptDateTo(to);

    setReceiptSearch('');
    setReceiptMinAmount('');
    setReceiptMaxAmount('');

    setAppliedReceiptFilters({
      dateFrom: from,
      dateTo: to,
      search: '',
      min: '',
      max: '',
    });
  }

  function openCalendar(target) {
    setCalendarTarget(target);
    setCalendarVisible(true);
  }

  function closeCalendar() {
    setCalendarVisible(false);
    setCalendarTarget(null);
  }

  function handleCalendarDayPress(day) {
    const value = day?.dateString;

    if (!value) {
      return;
    }

    if (calendarTarget === 'receipt_from') {
      setReceiptDateFrom(value);

      if (receiptDateTo && value > receiptDateTo) {
        setReceiptDateTo(value);
      }
    }

    if (calendarTarget === 'receipt_to') {
      setReceiptDateTo(value);

      if (receiptDateFrom && value < receiptDateFrom) {
        setReceiptDateFrom(value);
      }
    }

    closeCalendar();
  }

  function openReceiptDetails(receipt) {
    setSelectedReceipt(receipt);

    setReceiptDetailsVisible(true);
  }

  function closeReceiptDetails() {
    setReceiptDetailsVisible(false);

    setSelectedReceipt(null);
  }

  function openReconcileReceipt(receipt) {
    setSelectedReceipt(receipt);

    setReconcileReceiptVisible(true);
  }

  function closeReconcileReceipt() {
    setReconcileReceiptVisible(false);

    setSelectedReceipt(null);
  }

  function handlePostReceiptReconciliation(payload) {
    console.log('Receipt reconciliation payload:', payload);

    Alert.alert(
      'Reconcile receipt',
      'The reconciliation API has not been supplied yet.',
    );
  }

  const refreshReceivableData = useCallback(async () => {
    const [
      receiptsResponse,
      bankResponse,
      receivablesResponse,
      payablesResponse,
    ] = await Promise.all([
      api(`${BASE}/receipts`),

      api(`${BASE}/books/bank`),

      api(`${BASE}/receivables`),

      api(`${BASE}/payables`),
    ]);

    const nextReceipts = Array.isArray(receiptsResponse?.items)
      ? receiptsResponse.items
      : [];

    const nextBankBook = {
      balance: Number(bankResponse?.balance) || 0,

      entries: Array.isArray(bankResponse?.entries) ? bankResponse.entries : [],

      unreconciled: Array.isArray(bankResponse?.unreconciled)
        ? bankResponse.unreconciled
        : [],
    };

    const nextReceivables = {
      items: Array.isArray(receivablesResponse?.items)
        ? receivablesResponse.items
        : [],

      outstanding_total: Number(receivablesResponse?.outstanding_total) || 0,
    };

    const nextPayables = {
      items: Array.isArray(payablesResponse?.items)
        ? payablesResponse.items
        : [],

      outstanding_total: Number(payablesResponse?.outstanding_total) || 0,
    };

    onReceiptsChange?.(nextReceipts);

    onBankBookChange?.(nextBankBook);

    onReceivablesChange?.(nextReceivables);

    onPayablesChange?.(nextPayables);
  }, [
    onReceiptsChange,
    onBankBookChange,
    onReceivablesChange,
    onPayablesChange,
  ]);

  const handleReconcileStudentFees = useCallback(async () => {
    if (reconcilingStudentFees) {
      return;
    }

    try {
      setReconcilingStudentFees(true);

      const response = await api(`${BASE}/receivables/reconcile-student-fees`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({}),
      });

      await refreshReceivableData();

      const billsExamined = Number(response?.bills_examined) || 0;

      const receivablesPosted = Number(response?.receivables_posted) || 0;

      const receiptsPosted = Number(response?.receipts_posted) || 0;

      const failures = Array.isArray(response?.failures)
        ? response.failures
        : [];

      let message =
        `Bills examined: ${billsExamined}\n` +
        `Receivables posted: ${receivablesPosted}\n` +
        `Receipts posted: ${receiptsPosted}`;

      if (failures.length > 0) {
        message += `\nFailures: ${failures.length}`;
      }

      Alert.alert('Student Fee Reconciliation', message);
    } catch (error) {
      console.log('Student fee reconciliation error:', error);

      Alert.alert(
        'Student Fee Reconciliation',
        error?.message || 'Could not reconcile student fees.',
      );
    } finally {
      setReconcilingStudentFees(false);
    }
  }, [reconcilingStudentFees, refreshReceivableData]);

  return (
    <View style={styles.areaContent}>
      {/* Receivable action */}
      <View style={styles.receivableActionTabs}>
        <Pressable
          style={({ pressed }) => [
            styles.receivableActionButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.receivableActionButtonText}>Record receipts</Text>
        </Pressable>
      </View>

      {/* Record receipt */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionIcon}>
            <MaterialCommunityIcons
              name="cash-plus"
              size={21}
              color="#7DD3FC"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Record a receipt</Text>

            <Text style={styles.sectionDescriptionCompact}>
              Use this when a customer or account holder pays against an
              existing bill.
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() =>
            Alert.alert(
              'Record a receipt',
              'The action API has not been supplied yet.',
            )
          }
          style={({ pressed }) => [
            styles.primaryButton,
            styles.receivablePrimaryButton,

            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Record a receipt</Text>
        </Pressable>
      </View>

      {/* Student fee reconciliation */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionIcon}>
            <MaterialCommunityIcons
              name="account-sync-outline"
              size={21}
              color="#7DD3FC"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Student-fee reconciliation</Text>

            <Text style={styles.sectionDescriptionCompact}>
              Post any generated fee bills and paid fee receipts that were not
              previously sent to Accounts.
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleReconcileStudentFees}
          disabled={reconcilingStudentFees}
          style={({ pressed }) => [
            styles.outlineActionButton,

            reconcilingStudentFees && styles.controlDisabled,

            pressed && !reconcilingStudentFees && styles.pressed,
          ]}
        >
          {reconcilingStudentFees ? (
            <ActivityIndicator size="small" color="#F1F5F9" />
          ) : (
            <MaterialCommunityIcons name="sync" size={18} color="#F1F5F9" />
          )}

          <Text style={styles.outlineActionButtonText}>
            {reconcilingStudentFees
              ? 'Reconciling...'
              : 'Reconcile Student Fees'}
          </Text>
        </Pressable>
      </View>

      {/* Recent receipts */}
      <View style={styles.sectionCard}>
        <View style={styles.recentReceiptHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Recent receipts</Text>

            <Text style={styles.sectionDescriptionCompact}>
              Shows the last 7 days of receipt entries by default.
            </Text>
          </View>

          <MaterialCommunityIcons
            name="receipt-text-clock-outline"
            size={26}
            color="#7DD3FC"
          />
        </View>

        <Pressable
          onPress={applyReceiptLastSevenDays}
          style={styles.lastSevenButton}
        >
          <MaterialCommunityIcons
            name="calendar-range"
            size={17}
            color="#DCE7F5"
          />

          <Text style={styles.lastSevenText}>Last 7 days</Text>
        </Pressable>

        <View style={styles.filterGrid}>
          <View style={styles.receiptDateRow}>
            <View style={styles.receiptDateField}>
              <Text style={styles.filterLabel}>Date from</Text>

              <Pressable
                onPress={() => openCalendar('receipt_from')}
                style={({ pressed }) => [
                  styles.datePickerButton,

                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.datePickerText}>
                  {formatDisplayDate(receiptDateFrom)}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={19}
                  color="#A8B6C9"
                />
              </Pressable>
            </View>

            <View style={styles.receiptDateField}>
              <Text style={styles.filterLabel}>Date to</Text>

              <Pressable
                onPress={() => openCalendar('receipt_to')}
                style={({ pressed }) => [
                  styles.datePickerButton,

                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.datePickerText}>
                  {formatDisplayDate(receiptDateTo)}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={19}
                  color="#A8B6C9"
                />
              </Pressable>
            </View>
          </View>

          <View>
            <Text style={styles.filterLabel}>Search text</Text>

            <TextInput
              value={receiptSearch}
              onChangeText={setReceiptSearch}
              placeholder="Receipt number, bill reference..."
              placeholderTextColor="#718096"
              style={styles.input}
            />
          </View>

          <View style={styles.amountFilterRow}>
            <View style={styles.amountFilter}>
              <Text style={styles.filterLabel}>Min amount</Text>

              <TextInput
                value={receiptMinAmount}
                onChangeText={setReceiptMinAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#718096"
                style={styles.input}
              />
            </View>

            <View style={styles.amountFilter}>
              <Text style={styles.filterLabel}>Max amount</Text>

              <TextInput
                value={receiptMaxAmount}
                onChangeText={setReceiptMaxAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#718096"
                style={styles.input}
              />
            </View>
          </View>
        </View>

        <Pressable
          onPress={applyReceiptFilters}
          style={({ pressed }) => [
            styles.receiptFilterButton,

            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons
            name="filter-outline"
            size={18}
            color="#F1F5F9"
          />

          <Text style={styles.receiptFilterButtonText}>Apply filters</Text>
        </Pressable>

        <View style={styles.listDivider} />

        {recentReceipts.length === 0 ? (
          <EmptyCard
            icon="receipt-text-remove-outline"
            title="No receipts found"
            description="No receipts match the current filters."
          />
        ) : (
          <View style={styles.receiptList}>
            {recentReceipts.map(item => {
              const isBank =
                String(item?.payment_method || '').toLowerCase() === 'bank';

              const isReconciled = Boolean(item?.reconciled_at);

              return (
                <View key={String(item.id)} style={styles.receiptCard}>
                  <View style={styles.receiptCardTop}>
                    <View style={styles.receiptCardMain}>
                      <Text style={styles.receiptNumber} numberOfLines={1}>
                        {item?.receipt_number || `Receipt #${item.id}`}
                      </Text>

                      <Text style={styles.receiptBillRef}>
                        {item?.source_reference || 'No bill reference'}
                      </Text>
                    </View>

                    <Text style={styles.receiptAmount}>
                      {formatMoney(item?.amount, currencySymbol)}
                    </Text>
                  </View>

                  <View style={styles.receiptDivider} />

                  <View style={styles.receiptInfoGrid}>
                    <View style={styles.receiptInfoItem}>
                      <Text style={styles.receiptInfoLabel}>Date</Text>

                      <Text style={styles.receiptInfoValue}>
                        {item?.receipt_date || '-'}
                      </Text>
                    </View>

                    <View style={styles.receiptInfoItem}>
                      <Text style={styles.receiptInfoLabel}>Method</Text>

                      <Text style={styles.receiptInfoValue}>
                        {String(item?.payment_method || '-').toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.receiptInfoItem}>
                      <Text style={styles.receiptInfoLabel}>Status</Text>

                      <Text style={styles.receiptInfoValue}>
                        {String(item?.status || '-').toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.receiptInfoItem}>
                      <Text style={styles.receiptInfoLabel}>Bank status</Text>

                      <Text
                        style={[
                          styles.receiptInfoValue,

                          isBank && !isReconciled && styles.unreconciledText,

                          isBank && isReconciled && styles.reconciledText,
                        ]}
                      >
                        {!isBank
                          ? 'Not applicable'
                          : isReconciled
                          ? 'Reconciled'
                          : 'Unreconciled'}
                      </Text>
                    </View>
                  </View>

                  {!!item?.reference && (
                    <View style={styles.receiptReferenceRow}>
                      <Text style={styles.receiptInfoLabel}>Reference</Text>

                      <Text style={styles.receiptReference} numberOfLines={1}>
                        {item.reference}
                      </Text>
                    </View>
                  )}

                  {!!item?.description && (
                    <Text style={styles.receiptDescription}>
                      {item.description}
                    </Text>
                  )}

                  <View style={styles.receiptActions}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="View Receipt Details"
                      onPress={() => openReceiptDetails(item)}
                      style={({ pressed }) => [
                        styles.receiptActionButton,

                        pressed && styles.pressed,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="eye-outline"
                        size={20}
                        color="#FFFFFF"
                      />
                    </Pressable>

                    {isBank && !isReconciled && (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Reconcile bank receipt"
                        onPress={() => openReconcileReceipt(item)}
                        style={({ pressed }) => [
                          styles.receiptActionButton,

                          pressed && styles.pressed,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="bank-outline"
                          size={20}
                          color="#FFFFFF"
                        />
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <Text style={styles.resultCount}>
          Showing {recentReceipts.length} of {receipts.length}
        </Text>
      </View>

      <DatePickerModal
        visible={calendarVisible}
        title="Select Date"
        subtitle={
          calendarTarget === 'receipt_from'
            ? 'Select starting date'
            : 'Select ending date'
        }
        selectedDate={calendarSelectedDate}
        minDate={calendarMinDate}
        maxDate={calendarMaxDate}
        onClose={closeCalendar}
        onDayPress={handleCalendarDayPress}
      />

      <ReceiptDetailsModal
        visible={receiptDetailsVisible}
        receipt={selectedReceipt}
        currencySymbol={currencySymbol}
        onClose={closeReceiptDetails}
      />

      <ReconcileReceiptModal
        visible={reconcileReceiptVisible}
        receipt={selectedReceipt}
        currencySymbol={currencySymbol}
        onClose={closeReconcileReceipt}
        onSubmit={handlePostReceiptReconciliation}
      />
    </View>
  );
}
