// src/screens/Admin/Accounts/tabs/AccountsPayableTab.js

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

import styles from './AccountsPayableTab.styles';

import SubmitPaymentModal from '../modals/SubmitPaymentModal';
import CreateSupplierBillModal from '../modals/CreateSupplierBillModal';
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

export default function AccountsPayableTab({
  payables = {
    items: [],
    outstanding_total: 0,
  },

  paymentVouchers = [],

  vendors = [],

  accounts = [],

  currencySymbol = '₹',

  onPayablesChange,

  onPaymentVouchersChange,

  onBankBookChange,

  onAccountsChange,
}) {
  const [payableSection, setPayableSection] = useState('pay');

  /*
   * Payment filters
   */
  const [dateFrom, setDateFrom] = useState(getSevenDaysAgoIso);

  const [dateTo, setDateTo] = useState(getTodayIso);

  const [paymentSearch, setPaymentSearch] = useState('');

  const [minAmount, setMinAmount] = useState('');

  const [maxAmount, setMaxAmount] = useState('');

  const [appliedPaymentFilters, setAppliedPaymentFilters] = useState({
    dateFrom: getSevenDaysAgoIso(),
    dateTo: getTodayIso(),
    search: '',
    min: '',
    max: '',
  });

  /*
   * Supplier bill filters
   */
  const [supplierDateFrom, setSupplierDateFrom] = useState(getSevenDaysAgoIso);

  const [supplierDateTo, setSupplierDateTo] = useState(getTodayIso);

  const [supplierSearch, setSupplierSearch] = useState('');

  const [supplierMinAmount, setSupplierMinAmount] = useState('');

  const [supplierMaxAmount, setSupplierMaxAmount] = useState('');

  const [appliedSupplierFilters, setAppliedSupplierFilters] = useState({
    dateFrom: getSevenDaysAgoIso(),
    dateTo: getTodayIso(),
    search: '',
    min: '',
    max: '',
  });

  /*
   * Shared date picker
   */
  const [calendarVisible, setCalendarVisible] = useState(false);

  const [calendarTarget, setCalendarTarget] = useState(null);

  /*
   * Submit payment modal
   */
  const [submitPaymentVisible, setSubmitPaymentVisible] = useState(false);

  const [postingPaymentVoucher, setPostingPaymentVoucher] = useState(false);

  /*
   * Create supplier bill modal
   */
  const [createSupplierBillVisible, setCreateSupplierBillVisible] =
    useState(false);

  const [postingSupplierBill, setPostingSupplierBill] = useState(false);

  /*
   * Filtered payment vouchers
   */
  const recentPayments = useMemo(() => {
    const {
      dateFrom: filterFrom,
      dateTo: filterTo,
      search,
      min,
      max,
    } = appliedPaymentFilters;

    const searchLower = String(search || '')
      .trim()
      .toLowerCase();

    const minNumber = min === '' ? null : Number(min);

    const maxNumber = max === '' ? null : Number(max);

    return paymentVouchers.filter(item => {
      const date =
        item?.payment_date ||
        item?.posting_date ||
        item?.voucher_date ||
        item?.created_at?.slice?.(0, 10) ||
        '';

      if (filterFrom && date && date < filterFrom) {
        return false;
      }

      if (filterTo && date && date > filterTo) {
        return false;
      }

      const amount =
        Number(item?.amount ?? item?.total_amount ?? item?.total) || 0;

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
          item?.voucher_number,
          item?.creditor_name,
          item?.vendor_name,
          item?.reference,
          item?.description,
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
  }, [paymentVouchers, appliedPaymentFilters]);

  /*
   * Filtered supplier bills
   */
  const filteredSupplierBills = useMemo(() => {
    const {
      dateFrom: filterFrom,
      dateTo: filterTo,
      search,
      min,
      max,
    } = appliedSupplierFilters;

    const searchLower = String(search || '')
      .trim()
      .toLowerCase();

    const minNumber = min === '' ? null : Number(min);

    const maxNumber = max === '' ? null : Number(max);

    return (payables?.items || []).filter(item => {
      const billDate =
        item?.bill_date ||
        item?.invoice_date ||
        item?.posting_date ||
        item?.created_at?.slice?.(0, 10) ||
        '';

      if (filterFrom && billDate && billDate < filterFrom) {
        return false;
      }

      if (filterTo && billDate && billDate > filterTo) {
        return false;
      }

      const amount =
        Number(
          item?.amount ?? item?.total_amount ?? item?.recognized_amount ?? 0,
        ) || 0;

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
          item?.bill_number,
          item?.invoice_number,
          item?.vendor_name,
          item?.creditor_name,
          item?.counterparty_name,
          item?.description,
          item?.reference,
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
  }, [payables?.items, appliedSupplierFilters]);

  /*
   * Calendar values
   */
  const calendarSelectedDate = useMemo(() => {
    switch (calendarTarget) {
      case 'payment_from':
        return dateFrom;

      case 'payment_to':
        return dateTo;

      case 'supplier_from':
        return supplierDateFrom;

      case 'supplier_to':
        return supplierDateTo;

      default:
        return getTodayIso();
    }
  }, [calendarTarget, dateFrom, dateTo, supplierDateFrom, supplierDateTo]);

  const calendarMinDate = useMemo(() => {
    switch (calendarTarget) {
      case 'payment_to':
        return dateFrom || undefined;

      case 'supplier_to':
        return supplierDateFrom || undefined;

      default:
        return undefined;
    }
  }, [calendarTarget, dateFrom, supplierDateFrom]);

  const calendarMaxDate = useMemo(() => {
    switch (calendarTarget) {
      case 'payment_from':
        return dateTo || undefined;

      case 'supplier_from':
        return supplierDateTo || undefined;

      default:
        return undefined;
    }
  }, [calendarTarget, dateTo, supplierDateTo]);

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

    switch (calendarTarget) {
      case 'payment_from':
        setDateFrom(value);

        if (dateTo && value > dateTo) {
          setDateTo(value);
        }

        break;

      case 'payment_to':
        setDateTo(value);

        if (dateFrom && value < dateFrom) {
          setDateFrom(value);
        }

        break;

      case 'supplier_from':
        setSupplierDateFrom(value);

        if (supplierDateTo && value > supplierDateTo) {
          setSupplierDateTo(value);
        }

        break;

      case 'supplier_to':
        setSupplierDateTo(value);

        if (supplierDateFrom && value < supplierDateFrom) {
          setSupplierDateFrom(value);
        }

        break;

      default:
        break;
    }

    closeCalendar();
  }

  /*
   * Payment filters
   */
  function applyPaymentFilters() {
    setAppliedPaymentFilters({
      dateFrom,
      dateTo,

      search: paymentSearch.trim(),

      min: minAmount.trim(),

      max: maxAmount.trim(),
    });
  }

  function applyLastSevenDays() {
    const from = getSevenDaysAgoIso();

    const to = getTodayIso();

    setDateFrom(from);
    setDateTo(to);

    setPaymentSearch('');
    setMinAmount('');
    setMaxAmount('');

    setAppliedPaymentFilters({
      dateFrom: from,
      dateTo: to,
      search: '',
      min: '',
      max: '',
    });
  }

  /*
   * Supplier bill filters
   */
  function applySupplierFilters() {
    setAppliedSupplierFilters({
      dateFrom: supplierDateFrom,

      dateTo: supplierDateTo,

      search: supplierSearch.trim(),

      min: supplierMinAmount.trim(),

      max: supplierMaxAmount.trim(),
    });
  }

  function applySupplierLastSevenDays() {
    const from = getSevenDaysAgoIso();

    const to = getTodayIso();

    setSupplierDateFrom(from);
    setSupplierDateTo(to);

    setSupplierSearch('');
    setSupplierMinAmount('');
    setSupplierMaxAmount('');

    setAppliedSupplierFilters({
      dateFrom: from,
      dateTo: to,
      search: '',
      min: '',
      max: '',
    });
  }

  /*
   * Refresh payment-related workspace data.
   *
   * Keep this ABOVE handlePostPaymentVoucher.
   */
  const refreshPaymentWorkspace = useCallback(async () => {
    const [payablesResponse, vouchersResponse, bankResponse, accountsResponse] =
      await Promise.all([
        api(`${BASE}/payables`),

        api(`${BASE}/payment-vouchers`),

        api(`${BASE}/books/bank`),

        api(`${BASE}/accounts`),
      ]);

    const nextPayables = {
      items: Array.isArray(payablesResponse?.items)
        ? payablesResponse.items
        : [],

      outstanding_total: Number(payablesResponse?.outstanding_total) || 0,
    };

    const nextVouchers = Array.isArray(vouchersResponse?.items)
      ? vouchersResponse.items
      : [];

    const nextBankBook = {
      balance: Number(bankResponse?.balance) || 0,

      entries: Array.isArray(bankResponse?.entries) ? bankResponse.entries : [],

      unreconciled: Array.isArray(bankResponse?.unreconciled)
        ? bankResponse.unreconciled
        : [],
    };

    const nextAccounts = Array.isArray(accountsResponse?.items)
      ? accountsResponse.items
      : [];

    onPayablesChange?.(nextPayables);

    onPaymentVouchersChange?.(nextVouchers);

    onBankBookChange?.(nextBankBook);

    onAccountsChange?.(nextAccounts);
  }, [
    onPayablesChange,
    onPaymentVouchersChange,
    onBankBookChange,
    onAccountsChange,
  ]);

  /*
   * Post payment voucher
   */
  const handlePostPaymentVoucher = useCallback(
    async payload => {
      if (postingPaymentVoucher) {
        return;
      }

      try {
        setPostingPaymentVoucher(true);

        const response = await api(`${BASE}/payment-vouchers`, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        });

        setSubmitPaymentVisible(false);

        await refreshPaymentWorkspace();

        Alert.alert(
          'Payment Posted',

          response?.message || 'Payment voucher posted successfully.',
        );
      } catch (error) {
        console.log('Post payment voucher error:', error);

        const backendMessage =
          error?.data?.message ||
          error?.response?.data?.message ||
          error?.message;

        Alert.alert(
          'Submit Payment',

          backendMessage || 'Could not post the payment voucher.',
        );
      } finally {
        setPostingPaymentVoucher(false);
      }
    },
    [postingPaymentVoucher, refreshPaymentWorkspace],
  );

  /*
   * Refresh after supplier bill creation
   */
  const refreshSupplierBillData = useCallback(async () => {
    const [payablesResponse, accountsResponse] = await Promise.all([
      api(`${BASE}/payables`),

      api(`${BASE}/accounts`),
    ]);

    const nextPayables = {
      items: Array.isArray(payablesResponse?.items)
        ? payablesResponse.items
        : [],

      outstanding_total: Number(payablesResponse?.outstanding_total) || 0,
    };

    const nextAccounts = Array.isArray(accountsResponse?.items)
      ? accountsResponse.items
      : [];

    onPayablesChange?.(nextPayables);

    onAccountsChange?.(nextAccounts);
  }, [onPayablesChange, onAccountsChange]);

  /*
   * Create supplier bill
   */
  const handlePostSupplierBill = useCallback(
    async payload => {
      if (postingSupplierBill) {
        return;
      }

      try {
        setPostingSupplierBill(true);

        const response = await api(`${BASE}/payables`, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        });

        setCreateSupplierBillVisible(false);

        await refreshSupplierBillData();

        Alert.alert(
          'Supplier Bill',

          response?.message || 'Supplier bill posted successfully.',
        );
      } catch (error) {
        console.log('Create supplier bill error:', error);

        const message =
          error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          'Could not create the supplier bill.';

        Alert.alert('Supplier Bill', message);
      } finally {
        setPostingSupplierBill(false);
      }
    },
    [postingSupplierBill, refreshSupplierBillData],
  );

  return (
    <View style={styles.areaContent}>
      {/* Pay / Supplier bills */}
      <View style={styles.secondaryTabs}>
        <Pressable
          onPress={() => setPayableSection('pay')}
          style={[
            styles.secondaryTab,

            payableSection === 'pay' && styles.secondaryTabActive,
          ]}
        >
          <Text
            style={[
              styles.secondaryTabText,

              payableSection === 'pay' && styles.secondaryTabTextActive,
            ]}
          >
            Pay
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setPayableSection('supplier')}
          style={[
            styles.secondaryTab,

            payableSection === 'supplier' && styles.secondaryTabActive,
          ]}
        >
          <Text
            style={[
              styles.secondaryTabText,

              payableSection === 'supplier' && styles.secondaryTabTextActive,
            ]}
          >
            Supplier bills
          </Text>
        </Pressable>
      </View>

      {payableSection === 'supplier' ? (
        <>
          {/* Create supplier bill */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Create supplier bill</Text>

                <Text style={styles.sectionDescriptionCompact}>
                  Record the bill before money goes out so the payable stays
                  visible.
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => setCreateSupplierBillVisible(true)}
              style={({ pressed }) => [
                styles.primaryButton,

                styles.receivablePrimaryButton,

                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />

              <Text style={styles.primaryButtonText}>Create supplier bill</Text>
            </Pressable>
          </View>

          {/* Recent supplier bills */}
          <View style={styles.sectionCard}>
            <View style={styles.recentReceiptHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Recent supplier bills</Text>

                <Text style={styles.sectionDescriptionCompact}>
                  Shows open and settled supplier bills created in the last 7
                  days by default.
                </Text>
              </View>
            </View>

            <Pressable
              onPress={applySupplierLastSevenDays}
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
                    onPress={() => openCalendar('supplier_from')}
                    style={({ pressed }) => [
                      styles.datePickerButton,

                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.datePickerText}>
                      {formatDisplayDate(supplierDateFrom)}
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
                    onPress={() => openCalendar('supplier_to')}
                    style={({ pressed }) => [
                      styles.datePickerButton,

                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.datePickerText}>
                      {formatDisplayDate(supplierDateTo)}
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
                  value={supplierSearch}
                  onChangeText={setSupplierSearch}
                  placeholder="Vendor, bill number, description..."
                  placeholderTextColor="#718096"
                  style={styles.input}
                />
              </View>

              <View style={styles.amountFilterRow}>
                <View style={styles.amountFilter}>
                  <Text style={styles.filterLabel}>Min amount</Text>

                  <TextInput
                    value={supplierMinAmount}
                    onChangeText={setSupplierMinAmount}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#718096"
                    style={styles.input}
                  />
                </View>

                <View style={styles.amountFilter}>
                  <Text style={styles.filterLabel}>Max amount</Text>

                  <TextInput
                    value={supplierMaxAmount}
                    onChangeText={setSupplierMaxAmount}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#718096"
                    style={styles.input}
                  />
                </View>
              </View>
            </View>

            <Pressable
              onPress={applySupplierFilters}
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

            {filteredSupplierBills.length === 0 ? (
              <EmptyCard
                icon="file-document-outline"
                title="No supplier bills"
                description="No supplier bills match the current filters."
              />
            ) : (
              <View style={styles.receiptList}>
                {filteredSupplierBills.map(item => {
                  const billNumber =
                    item?.bill_number ||
                    item?.invoice_number ||
                    item?.reference ||
                    `Bill #${item?.id}`;

                  const vendorName =
                    item?.vendor_name ||
                    item?.creditor_name ||
                    item?.counterparty_name ||
                    item?.supplier_name ||
                    'Supplier';

                  const amount =
                    Number(
                      item?.amount ??
                        item?.total_amount ??
                        item?.recognized_amount ??
                        0,
                    ) || 0;

                  const outstanding =
                    Number(
                      item?.outstanding_amount ?? item?.balance ?? amount,
                    ) || 0;

                  const billDate =
                    item?.bill_date ||
                    item?.invoice_date ||
                    item?.posting_date ||
                    item?.created_at?.slice?.(0, 10) ||
                    '-';

                  const dueDate = item?.due_date || '-';

                  const status = String(item?.status || 'open');

                  return (
                    <View
                      key={String(item?.id)}
                      style={styles.supplierBillCard}
                    >
                      <View style={styles.supplierBillTop}>
                        <View style={styles.supplierBillMain}>
                          <Text style={styles.supplierBillNumber}>
                            {billNumber}
                          </Text>

                          <Text style={styles.supplierVendor}>
                            {vendorName}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.supplierStatusBadge,

                            status.toLowerCase() === 'settled' &&
                              styles.supplierStatusSettled,
                          ]}
                        >
                          <Text style={styles.supplierStatusText}>
                            {status.toUpperCase()}
                          </Text>
                        </View>
                      </View>

                      {!!item?.description && (
                        <Text style={styles.supplierDescription}>
                          {item.description}
                        </Text>
                      )}

                      <View style={styles.supplierDivider} />

                      <View style={styles.supplierInfoGrid}>
                        <View style={styles.supplierInfoItem}>
                          <Text style={styles.supplierInfoLabel}>
                            Bill date
                          </Text>

                          <Text style={styles.supplierInfoValue}>
                            {billDate}
                          </Text>
                        </View>

                        <View style={styles.supplierInfoItem}>
                          <Text style={styles.supplierInfoLabel}>Due date</Text>

                          <Text style={styles.supplierInfoValue}>
                            {dueDate}
                          </Text>
                        </View>

                        <View style={styles.supplierInfoItem}>
                          <Text style={styles.supplierInfoLabel}>Amount</Text>

                          <Text style={styles.supplierInfoValue}>
                            {formatMoney(amount, currencySymbol)}
                          </Text>
                        </View>

                        <View style={styles.supplierInfoItem}>
                          <Text style={styles.supplierInfoLabel}>
                            Outstanding
                          </Text>

                          <Text style={styles.supplierOutstanding}>
                            {formatMoney(outstanding, currencySymbol)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            <Text style={styles.resultCount}>
              Showing {filteredSupplierBills.length} of{' '}
              {(payables?.items || []).length}
            </Text>
          </View>
        </>
      ) : (
        <>
          {/* Submit payment */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Submit payment</Text>

            <Text style={styles.sectionDescription}>
              Pay an outstanding supplier bill or another creditor balance.
            </Text>

            <Pressable
              onPress={() => setSubmitPaymentVisible(true)}
              style={({ pressed }) => [
                styles.primaryButton,

                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="cash-fast"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.primaryButtonText}>Submit payment</Text>
            </Pressable>
          </View>

          {/* Recent payments */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Recent payments</Text>

            <Text style={styles.sectionDescription}>
              Starts with the last 7 days. Submitted vouchers stay here first,
              and only approved bank vouchers move into the bank book.
            </Text>

            <Pressable
              onPress={applyLastSevenDays}
              style={styles.lastSevenButton}
            >
              <MaterialCommunityIcons
                name="calendar-range"
                size={16}
                color="#DCE7F5"
              />

              <Text style={styles.lastSevenText}>Last 7 days</Text>
            </Pressable>

            <View style={styles.filterGrid}>
              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Date from</Text>

                <Pressable
                  onPress={() => openCalendar('payment_from')}
                  style={({ pressed }) => [
                    styles.datePickerButton,

                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.datePickerText}>
                    {formatDisplayDate(dateFrom)}
                  </Text>

                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={19}
                    color="#A8B6C9"
                  />
                </Pressable>
              </View>

              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Date to</Text>

                <Pressable
                  onPress={() => openCalendar('payment_to')}
                  style={({ pressed }) => [
                    styles.datePickerButton,

                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.datePickerText}>
                    {formatDisplayDate(dateTo)}
                  </Text>

                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={19}
                    color="#A8B6C9"
                  />
                </Pressable>
              </View>

              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Search text</Text>

                <TextInput
                  value={paymentSearch}
                  onChangeText={setPaymentSearch}
                  placeholder="Voucher, creditor..."
                  placeholderTextColor="#718096"
                  style={styles.input}
                />
              </View>

              <View style={styles.amountFilterRow}>
                <View style={styles.amountFilter}>
                  <Text style={styles.filterLabel}>Min amount</Text>

                  <TextInput
                    value={minAmount}
                    onChangeText={setMinAmount}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#718096"
                    style={styles.input}
                  />
                </View>

                <View style={styles.amountFilter}>
                  <Text style={styles.filterLabel}>Max amount</Text>

                  <TextInput
                    value={maxAmount}
                    onChangeText={setMaxAmount}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#718096"
                    style={styles.input}
                  />
                </View>
              </View>
            </View>

            <Pressable
              onPress={applyPaymentFilters}
              style={styles.outlineButton}
            >
              <MaterialCommunityIcons
                name="filter-outline"
                size={17}
                color="#F1F5F9"
              />

              <Text style={styles.outlineButtonText}>Apply filters</Text>
            </Pressable>

            <View style={styles.listDivider} />

            {recentPayments.length === 0 ? (
              <EmptyCard
                icon="cash-remove"
                title="No payments found"
                description="No payments match the current filters."
              />
            ) : (
              <View style={styles.transactionList}>
                {recentPayments.map(item => (
                  <View key={String(item?.id)} style={styles.transactionCard}>
                    <View style={styles.transactionTop}>
                      <View style={styles.transactionText}>
                        <Text style={styles.transactionTitle}>
                          {item?.creditor_name ||
                            item?.vendor_name ||
                            item?.voucher_number ||
                            'Payment'}
                        </Text>

                        <Text style={styles.transactionSubtitle}>
                          {item?.voucher_number || item?.reference || '-'}
                        </Text>
                      </View>

                      <Text style={styles.amountText}>
                        {formatMoney(
                          item?.amount ?? item?.total_amount ?? item?.total,
                          currencySymbol,
                        )}
                      </Text>
                    </View>

                    <View style={styles.transactionBottom}>
                      <Text style={styles.mutedLabel}>
                        {item?.payment_date ||
                          item?.posting_date ||
                          item?.voucher_date ||
                          item?.created_at?.slice?.(0, 10) ||
                          '-'}
                      </Text>

                      <Text style={styles.transactionStatus}>
                        {String(item?.status || '-')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.resultCount}>
              Showing {recentPayments.length} of {paymentVouchers.length}
            </Text>
          </View>
        </>
      )}

      <DatePickerModal
        visible={calendarVisible}
        title="Select Date"
        subtitle={
          calendarTarget === 'payment_from' ||
          calendarTarget === 'supplier_from'
            ? 'Select starting date'
            : 'Select ending date'
        }
        selectedDate={calendarSelectedDate}
        minDate={calendarMinDate}
        maxDate={calendarMaxDate}
        onClose={closeCalendar}
        onDayPress={handleCalendarDayPress}
      />

      <SubmitPaymentModal
        visible={submitPaymentVisible}
        payables={payables?.items || []}
        submitting={postingPaymentVoucher}
        onClose={() => {
          if (!postingPaymentVoucher) {
            setSubmitPaymentVisible(false);
          }
        }}
        onSubmit={handlePostPaymentVoucher}
      />

      <CreateSupplierBillModal
        visible={createSupplierBillVisible}
        vendors={vendors}
        accounts={accounts}
        submitting={postingSupplierBill}
        onClose={() => {
          if (!postingSupplierBill) {
            setCreateSupplierBillVisible(false);
          }
        }}
        onSubmit={handlePostSupplierBill}
      />
    </View>
  );
}
