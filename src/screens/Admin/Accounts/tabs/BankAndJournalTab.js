// src/screens/Admin/Accounts/tabs/BankAndJournalTab.js

import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './BankAndJournalTab.styles';

import DatePickerModal from '../modals/DatePickerModal';
import JournalEntryDetailsModal from '../modals/JournalEntryDetailsModal';
import EditManualJournalModal from '../modals/EditManualJournalModal';
import CreateManualJournalModal from '../modals/CreateManualJournalModal';
import ReconcileBankEntryModal from '../modals/ReconcileBankEntryModal';

import {
  formatDisplayDate,
  formatMoney,
  getSevenDaysAgoIso,
  getTodayIso,
} from '../utils/accountsHelpers';

const BASE = '/api/plugins/financial-accounting';

export default function BankAndJournalTab({
  bankBook = {
    balance: 0,
    entries: [],
    unreconciled: [],
  },

  journals = [],

  accounts = [],

  currencySymbol = '₹',

  onJournalsChange,
  onBankBookChange,
  onAccountsChange,
}) {
  const [activeSection, setActiveSection] = useState('journals');

  /*
   * Journal filters
   */
  const [journalDateFrom, setJournalDateFrom] = useState(getSevenDaysAgoIso);

  const [journalDateTo, setJournalDateTo] = useState(getTodayIso);

  const [journalSearch, setJournalSearch] = useState('');

  const [journalMinAmount, setJournalMinAmount] = useState('');

  const [journalMaxAmount, setJournalMaxAmount] = useState('');

  const [appliedJournalFilters, setAppliedJournalFilters] = useState({
    dateFrom: getSevenDaysAgoIso(),
    dateTo: getTodayIso(),
    search: '',
    min: '',
    max: '',
  });

  /*
   * Calendar
   */
  const [calendarVisible, setCalendarVisible] = useState(false);

  const [calendarTarget, setCalendarTarget] = useState(null);

  const [selectedJournal, setSelectedJournal] = useState(null);

  const [journalDetailsVisible, setJournalDetailsVisible] = useState(false);

  const [editJournalVisible, setEditJournalVisible] = useState(false);

  const [createJournalVisible, setCreateJournalVisible] = useState(false);

  const [reconcileEntryVisible, setReconcileEntryVisible] = useState(false);

  const [reconcileBankEntryVisible, setReconcileBankEntryVisible] =
    useState(false);

  const [bankDateFrom, setBankDateFrom] = useState(getSevenDaysAgoIso);

  const [bankDateTo, setBankDateTo] = useState(getTodayIso);

  const [bankSearch, setBankSearch] = useState('');

  const [bankMinAmount, setBankMinAmount] = useState('');

  const [bankMaxAmount, setBankMaxAmount] = useState('');

  const [appliedBankFilters, setAppliedBankFilters] = useState({
    dateFrom: getSevenDaysAgoIso(),
    dateTo: getTodayIso(),
    search: '',
    min: '',
    max: '',
  });

  const [reloadingBankBook, setReloadingBankBook] = useState(false);

  const journalItems = useMemo(
    () => (Array.isArray(journals) ? journals : []),
    [journals],
  );

  const bankEntries = useMemo(
    () => (Array.isArray(bankBook?.entries) ? bankBook.entries : []),
    [bankBook?.entries],
  );

  const filteredBankEntries = useMemo(() => {
    const { dateFrom, dateTo, search, min, max } = appliedBankFilters;

    const searchText = String(search || '')
      .trim()
      .toLowerCase();

    const minNumber = min === '' ? null : Number(min);

    const maxNumber = max === '' ? null : Number(max);

    return bankEntries.filter(item => {
      const date = item?.posting_date || item?.created_at?.slice?.(0, 10) || '';

      if (dateFrom && date && date < dateFrom) {
        return false;
      }

      if (dateTo && date && date > dateTo) {
        return false;
      }

      const debit = Number(item?.debit) || 0;

      const credit = Number(item?.credit) || 0;

      const movement = Math.max(Math.abs(debit), Math.abs(credit));

      if (
        minNumber !== null &&
        Number.isFinite(minNumber) &&
        movement < minNumber
      ) {
        return false;
      }

      if (
        maxNumber !== null &&
        Number.isFinite(maxNumber) &&
        movement > maxNumber
      ) {
        return false;
      }

      if (searchText) {
        const haystack = [
          item?.entry_number,
          item?.entry_type,
          item?.description,
          item?.source_type,
          item?.source_reference,
          item?.bank_statement_reference,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(searchText)) {
          return false;
        }
      }

      return true;
    });
  }, [bankEntries, appliedBankFilters]);

  const unreconciledEntries = useMemo(
    () => (Array.isArray(bankBook?.unreconciled) ? bankBook.unreconciled : []),
    [bankBook?.unreconciled],
  );

  const filteredJournals = useMemo(() => {
    const { dateFrom, dateTo, search, min, max } = appliedJournalFilters;

    const searchText = String(search || '')
      .trim()
      .toLowerCase();

    const minNumber = min === '' ? null : Number(min);

    const maxNumber = max === '' ? null : Number(max);

    return journalItems.filter(item => {
      const postingDate =
        item?.posting_date ||
        item?.journal_date ||
        item?.entry_date ||
        item?.date ||
        item?.created_at?.slice?.(0, 10) ||
        '';

      if (dateFrom && postingDate && postingDate < dateFrom) {
        return false;
      }

      if (dateTo && postingDate && postingDate > dateTo) {
        return false;
      }

      const debitTotal =
        Number(item?.debit_total ?? item?.total_debit ?? item?.debit ?? 0) || 0;

      const creditTotal =
        Number(item?.credit_total ?? item?.total_credit ?? item?.credit ?? 0) ||
        0;

      const amount = Math.max(debitTotal, creditTotal);

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

      if (searchText) {
        const haystack = [
          item?.entry_number,
          item?.journal_number,
          item?.description,
          item?.entry_type,
          item?.source_type,
          item?.source_reference,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(searchText)) {
          return false;
        }
      }

      return true;
    });
  }, [journalItems, appliedJournalFilters]);

  const calendarSelectedDate = useMemo(() => {
    switch (calendarTarget) {
      case 'journal_from':
        return journalDateFrom;

      case 'journal_to':
        return journalDateTo;

      case 'bank_from':
        return bankDateFrom;

      case 'bank_to':
        return bankDateTo;

      default:
        return getTodayIso();
    }
  }, [
    calendarTarget,
    journalDateFrom,
    journalDateTo,
    bankDateFrom,
    bankDateTo,
  ]);

  const calendarMinDate = useMemo(() => {
    switch (calendarTarget) {
      case 'journal_to':
        return journalDateFrom || undefined;

      case 'bank_to':
        return bankDateFrom || undefined;

      default:
        return undefined;
    }
  }, [calendarTarget, journalDateFrom, bankDateFrom]);

  const calendarMaxDate = useMemo(() => {
    switch (calendarTarget) {
      case 'journal_from':
        return journalDateTo || undefined;

      case 'bank_from':
        return bankDateTo || undefined;

      default:
        return undefined;
    }
  }, [calendarTarget, journalDateTo, bankDateTo]);

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
      case 'journal_from':
        setJournalDateFrom(value);

        if (journalDateTo && value > journalDateTo) {
          setJournalDateTo(value);
        }

        break;

      case 'journal_to':
        setJournalDateTo(value);

        if (journalDateFrom && value < journalDateFrom) {
          setJournalDateFrom(value);
        }

        break;

      case 'bank_from':
        setBankDateFrom(value);

        if (bankDateTo && value > bankDateTo) {
          setBankDateTo(value);
        }

        break;

      case 'bank_to':
        setBankDateTo(value);

        if (bankDateFrom && value < bankDateFrom) {
          setBankDateFrom(value);
        }

        break;

      default:
        break;
    }

    closeCalendar();
  }

  function applyJournalFilters() {
    setAppliedJournalFilters({
      dateFrom: journalDateFrom,
      dateTo: journalDateTo,

      search: journalSearch.trim(),

      min: journalMinAmount.trim(),

      max: journalMaxAmount.trim(),
    });
  }

  function applyJournalLastSevenDays() {
    const from = getSevenDaysAgoIso();

    const to = getTodayIso();

    setJournalDateFrom(from);
    setJournalDateTo(to);

    setJournalSearch('');
    setJournalMinAmount('');
    setJournalMaxAmount('');

    setAppliedJournalFilters({
      dateFrom: from,
      dateTo: to,
      search: '',
      min: '',
      max: '',
    });
  }

  function getJournalLines(item) {
    if (Array.isArray(item?.lines)) {
      return item.lines;
    }

    if (Array.isArray(item?.journal_lines)) {
      return item.journal_lines;
    }

    return [];
  }

  function getLineSummary(item) {
    const lines = getJournalLines(item);

    if (lines.length === 0) {
      return item?.line_summary || item?.description || '-';
    }

    return lines
      .slice(0, 2)
      .map(line => {
        const account =
          line?.account_name ||
          line?.account?.name ||
          line?.description ||
          'Account';

        const debit = Number(line?.debit) || 0;

        const credit = Number(line?.credit) || 0;

        if (debit > 0) {
          return `${account}: Dr ${formatMoney(debit, currencySymbol)}`;
        }

        if (credit > 0) {
          return `${account}: Cr ${formatMoney(credit, currencySymbol)}`;
        }

        return account;
      })
      .join(' • ');
  }

  function openJournalDetails(journal) {
    setSelectedJournal(journal);
    setJournalDetailsVisible(true);
  }

  function closeJournalDetails() {
    setJournalDetailsVisible(false);
    setSelectedJournal(null);
  }

  function openEditJournal(journal) {
    setSelectedJournal(journal);
    setEditJournalVisible(true);
  }

  function closeEditJournal() {
    setEditJournalVisible(false);
    setSelectedJournal(null);
  }

  function canEditJournal(item) {
    if (item?.can_edit === true) {
      return true;
    }

    if (item?.is_manual === true) {
      return true;
    }

    const entryType = String(item?.entry_type || '').toLowerCase();

    const sourceType = String(item?.source_type || '').toLowerCase();

    if (entryType.includes('manual') || sourceType.includes('manual')) {
      return true;
    }

    /*
     * Manual entries often have no
     * external source.
     */
    if (!sourceType && !item?.source_reference) {
      return true;
    }

    return false;
  }

  function applyBankFilters() {
    setAppliedBankFilters({
      dateFrom: bankDateFrom,
      dateTo: bankDateTo,

      search: bankSearch.trim(),

      min: bankMinAmount.trim(),

      max: bankMaxAmount.trim(),
    });
  }

  function applyBankLastSevenDays() {
    const from = getSevenDaysAgoIso();

    const to = getTodayIso();

    setBankDateFrom(from);
    setBankDateTo(to);

    setBankSearch('');
    setBankMinAmount('');
    setBankMaxAmount('');

    setAppliedBankFilters({
      dateFrom: from,
      dateTo: to,
      search: '',
      min: '',
      max: '',
    });
  }

  const reloadBankBook = useCallback(async () => {
    if (reloadingBankBook) {
      return;
    }

    try {
      setReloadingBankBook(true);

      const response = await api(`${BASE}/books/bank`, {
        method: 'GET',
      });

      if (response?.ok === false) {
        throw new Error(response?.message || 'Could not reload the bank book.');
      }

      const nextBankBook = {
        balance: Number(response?.balance) || 0,

        entries: Array.isArray(response?.entries) ? response.entries : [],

        unreconciled: Array.isArray(response?.unreconciled)
          ? response.unreconciled
          : [],
      };

      onBankBookChange?.(nextBankBook);
    } catch (error) {
      console.log('Reload bank book error:', error);

      const message =
        error?.data?.message ||
        error?.response?.data?.message ||
        error?.message ||
        'Could not reload the bank book.';

      Alert.alert('Bank Book', message);
    } finally {
      setReloadingBankBook(false);
    }
  }, [reloadingBankBook, onBankBookChange]);

  function renderJournalEntries() {
    return (
      <>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Post manual journal entry</Text>

          <Text style={styles.sectionDescription}>
            Use this for adjustments, opening balances, and events that do not
            come from receipts, payroll, or supplier workflows.
          </Text>

          <Pressable
            onPress={() => setCreateJournalVisible(true)}
            style={({ pressed }) => [
              styles.primaryButton,

              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons
              name="book-plus-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.primaryButtonText}>
              Post manual journal entry
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent journal entries</Text>

          <Text style={styles.sectionDescription}>
            This is the fastest way to review manual and system-generated
            postings in one place.
          </Text>

          <Pressable
            onPress={applyJournalLastSevenDays}
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
            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <Text style={styles.filterLabel}>Date from</Text>

                <Pressable
                  onPress={() => openCalendar('journal_from')}
                  style={({ pressed }) => [
                    styles.datePickerButton,

                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.datePickerText}>
                    {formatDisplayDate(journalDateFrom)}
                  </Text>

                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={19}
                    color="#A8B6C9"
                  />
                </Pressable>
              </View>

              <View style={styles.dateField}>
                <Text style={styles.filterLabel}>Date to</Text>

                <Pressable
                  onPress={() => openCalendar('journal_to')}
                  style={({ pressed }) => [
                    styles.datePickerButton,

                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.datePickerText}>
                    {formatDisplayDate(journalDateTo)}
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
                value={journalSearch}
                onChangeText={setJournalSearch}
                placeholder="Entry number, description..."
                placeholderTextColor="#718096"
                style={styles.input}
              />
            </View>

            <View style={styles.amountRow}>
              <View style={styles.amountField}>
                <Text style={styles.filterLabel}>Min amount</Text>

                <TextInput
                  value={journalMinAmount}
                  onChangeText={setJournalMinAmount}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#718096"
                  style={styles.input}
                />
              </View>

              <View style={styles.amountField}>
                <Text style={styles.filterLabel}>Max amount</Text>

                <TextInput
                  value={journalMaxAmount}
                  onChangeText={setJournalMaxAmount}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#718096"
                  style={styles.input}
                />
              </View>
            </View>
          </View>

          <Pressable
            onPress={applyJournalFilters}
            style={({ pressed }) => [
              styles.filterButton,

              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons
              name="filter-outline"
              size={18}
              color="#F1F5F9"
            />

            <Text style={styles.filterButtonText}>Apply filters</Text>
          </Pressable>

          <View style={styles.divider} />

          {filteredJournals.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="book-open-page-variant-outline"
                size={30}
                color="#718096"
              />

              <Text style={styles.emptyTitle}>No journal entries</Text>

              <Text style={styles.emptyText}>
                No journal entries match the current filters.
              </Text>
            </View>
          ) : (
            <View style={styles.journalList}>
              {filteredJournals.map(item => {
                const lines = getJournalLines(item);

                const debitTotal =
                  Number(
                    item?.debit_total ?? item?.total_debit ?? item?.debit ?? 0,
                  ) || 0;

                const creditTotal =
                  Number(
                    item?.credit_total ??
                      item?.total_credit ??
                      item?.credit ??
                      0,
                  ) || 0;

                return (
                  <View key={String(item?.id)} style={styles.journalCard}>
                    <View style={styles.journalTop}>
                      <View style={styles.journalMain}>
                        <Text style={styles.journalNumber}>
                          {item?.entry_number ||
                            item?.journal_number ||
                            `Journal #${item?.id}`}
                        </Text>

                        <Text style={styles.journalDescription}>
                          {item?.description || 'Journal entry'}
                        </Text>
                      </View>

                      <Text style={styles.journalDate}>
                        {item?.posting_date ||
                          item?.journal_date ||
                          item?.entry_date ||
                          item?.date ||
                          '-'}
                      </Text>
                    </View>

                    <View style={styles.journalDivider} />

                    <View style={styles.journalInfoGrid}>
                      <View style={styles.journalInfoItem}>
                        <Text style={styles.journalInfoLabel}>Debit total</Text>

                        <Text style={styles.debitValue}>
                          {formatMoney(debitTotal, currencySymbol)}
                        </Text>
                      </View>

                      <View style={styles.journalInfoItem}>
                        <Text style={styles.journalInfoLabel}>
                          Credit total
                        </Text>

                        <Text style={styles.creditValue}>
                          {formatMoney(creditTotal, currencySymbol)}
                        </Text>
                      </View>

                      <View style={styles.journalInfoItem}>
                        <Text style={styles.journalInfoLabel}>Lines</Text>

                        <Text style={styles.journalInfoValue}>
                          {lines.length || item?.line_count || 0}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.summaryBox}>
                      <Text style={styles.journalInfoLabel}>Line summary</Text>

                      <Text style={styles.summaryText}>
                        {getLineSummary(item)}
                      </Text>
                    </View>
                    <View style={styles.journalActions}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="View journal entry details"
                        onPress={() => openJournalDetails(item)}
                        style={({ pressed }) => [
                          styles.journalActionButton,

                          pressed && styles.pressed,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="eye-outline"
                          size={20}
                          color="#FFFFFF"
                        />
                      </Pressable>

                      {canEditJournal(item) && (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Edit manual journal entry"
                          onPress={() => openEditJournal(item)}
                          style={({ pressed }) => [
                            styles.journalActionButton,

                            pressed && styles.pressed,
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="pencil-outline"
                            size={19}
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
            Showing {filteredJournals.length} of {journalItems.length}
          </Text>
        </View>
      </>
    );
  }

  function renderBankBook() {
    return (
      <>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Bank book summary</Text>

          <Text style={styles.sectionDescription}>
            Review approved and posted bank-side receipts and payments here
            before or after reconciliation.
          </Text>

          <Text style={styles.bankHelpText}>
            If you only submitted a bank payment voucher, it will not appear
            here until it has been approved and posted.
          </Text>

          <Pressable
            onPress={reloadBankBook}
            disabled={reloadingBankBook}
            style={({ pressed }) => [
              styles.reloadButton,

              reloadingBankBook && styles.controlDisabled,

              pressed && !reloadingBankBook && styles.pressed,
            ]}
          >
            {reloadingBankBook ? (
              <ActivityIndicator size="small" color="#F1F5F9" />
            ) : (
              <MaterialCommunityIcons name="reload" size={17} color="#F1F5F9" />
            )}

            <Text style={styles.reloadButtonText}>
              {reloadingBankBook ? 'Reloading...' : 'Reload bank book summary'}
            </Text>
          </Pressable>

          <View style={styles.totalStrip}>
            <Text style={styles.totalStripLabel}>Current bank balance</Text>

            <Text style={styles.totalStripValue}>
              {formatMoney(bankBook?.balance, currencySymbol)}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Pressable
            onPress={applyBankLastSevenDays}
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
            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <Text style={styles.filterLabel}>Date from</Text>

                <Pressable
                  onPress={() => openCalendar('bank_from')}
                  style={({ pressed }) => [
                    styles.datePickerButton,

                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.datePickerText}>
                    {formatDisplayDate(bankDateFrom)}
                  </Text>

                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={19}
                    color="#A8B6C9"
                  />
                </Pressable>
              </View>

              <View style={styles.dateField}>
                <Text style={styles.filterLabel}>Date to</Text>

                <Pressable
                  onPress={() => openCalendar('bank_to')}
                  style={({ pressed }) => [
                    styles.datePickerButton,

                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.datePickerText}>
                    {formatDisplayDate(bankDateTo)}
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
                value={bankSearch}
                onChangeText={setBankSearch}
                placeholder="Entry number, reference..."
                placeholderTextColor="#718096"
                style={styles.input}
              />
            </View>

            <View style={styles.amountRow}>
              <View style={styles.amountField}>
                <Text style={styles.filterLabel}>Min amount</Text>

                <TextInput
                  value={bankMinAmount}
                  onChangeText={setBankMinAmount}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#718096"
                  style={styles.input}
                />
              </View>

              <View style={styles.amountField}>
                <Text style={styles.filterLabel}>Max amount</Text>

                <TextInput
                  value={bankMaxAmount}
                  onChangeText={setBankMaxAmount}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#718096"
                  style={styles.input}
                />
              </View>
            </View>
          </View>

          <Pressable
            onPress={applyBankFilters}
            style={({ pressed }) => [
              styles.filterButton,

              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons
              name="filter-outline"
              size={18}
              color="#F1F5F9"
            />

            <Text style={styles.filterButtonText}>Apply filters</Text>
          </Pressable>

          <View style={styles.divider} />

          {filteredBankEntries.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="bank-off-outline"
                size={30}
                color="#718096"
              />

              <Text style={styles.emptyTitle}>No bank-book items</Text>

              <Text style={styles.emptyText}>
                No bank-book items match the current filters.
              </Text>
            </View>
          ) : (
            <View style={styles.bankList}>
              {filteredBankEntries.map(item => {
                const debit = Number(item?.debit) || 0;

                const credit = Number(item?.credit) || 0;

                const movement = Math.max(Math.abs(debit), Math.abs(credit));

                const reconciled = Boolean(item?.reconciled_at);

                const entryType = String(item?.entry_type || '-')
                  .replace(/_/g, ' ')
                  .toUpperCase();

                return (
                  <View key={String(item.id)} style={styles.bankCard}>
                    <View style={styles.bankCardTop}>
                      <View style={styles.bankCardMain}>
                        <Text style={styles.bankEntryNumber} numberOfLines={2}>
                          {item?.entry_number || `Entry #${item.id}`}
                        </Text>

                        <Text style={styles.bankDescription} numberOfLines={2}>
                          {item?.description || '-'}
                        </Text>
                      </View>

                      <Text style={styles.bankMovement}>
                        {formatMoney(movement, currencySymbol)}
                      </Text>
                    </View>

                    <View style={styles.bankCardDivider} />

                    <View style={styles.bankInfoGrid}>
                      <View style={styles.bankInfoItem}>
                        <Text style={styles.bankInfoLabel}>Date</Text>

                        <Text style={styles.bankInfoValue}>
                          {item?.posting_date || '-'}
                        </Text>
                      </View>

                      <View style={styles.bankInfoItem}>
                        <Text style={styles.bankInfoLabel}>Type</Text>

                        <Text style={styles.bankInfoValue}>{entryType}</Text>
                      </View>

                      <View style={styles.bankInfoItem}>
                        <Text style={styles.bankInfoLabel}>Bank status</Text>

                        <Text
                          style={[
                            styles.bankInfoValue,

                            reconciled
                              ? styles.bankStatusReconciled
                              : styles.bankStatusOpen,
                          ]}
                        >
                          {reconciled ? 'RECONCILED' : 'OPEN'}
                        </Text>
                      </View>

                      <View style={styles.bankInfoItem}>
                        <Text style={styles.bankInfoLabel}>Statement ref</Text>

                        <Text style={styles.bankInfoValue} numberOfLines={1}>
                          {item?.bank_statement_reference || '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.bankReferenceBox}>
                      <Text style={styles.bankInfoLabel}>Reference</Text>

                      <Text style={styles.bankReferenceText} numberOfLines={2}>
                        {item?.source_reference || '-'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <Text style={styles.resultCount}>
            Showing {filteredBankEntries.length} of {bankEntries.length}
          </Text>
        </View>
      </>
    );
  }

  function renderReconcileEntries() {
    return (
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Reconcile bank-cleared entry</Text>

        <Text style={styles.sectionDescription}>
          Use this after the bank statement confirms the movement.
        </Text>

        <Pressable
          onPress={() => setReconcileEntryVisible(true)}
          style={({ pressed }) => [
            styles.primaryButton,

            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons name="bank-check" size={18} color="#FFFFFF" />

          <Text style={styles.primaryButtonText}>
            Reconcile bank-cleared entry
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.areaContent}>
      <View style={styles.secondaryTabs}>
        <Pressable
          onPress={() => setActiveSection('journals')}
          style={[
            styles.secondaryTab,

            activeSection === 'journals' && styles.secondaryTabActive,
          ]}
        >
          <Text
            style={[
              styles.secondaryTabText,

              activeSection === 'journals' && styles.secondaryTabTextActive,
            ]}
          >
            Journal Entries
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveSection('bank')}
          style={[
            styles.secondaryTab,

            activeSection === 'bank' && styles.secondaryTabActive,
          ]}
        >
          <Text
            style={[
              styles.secondaryTabText,

              activeSection === 'bank' && styles.secondaryTabTextActive,
            ]}
          >
            View bank book
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveSection('reconcile')}
          style={[
            styles.secondaryTab,

            activeSection === 'reconcile' && styles.secondaryTabActive,
          ]}
        >
          <Text
            style={[
              styles.secondaryTabText,

              activeSection === 'reconcile' && styles.secondaryTabTextActive,
            ]}
          >
            Reconcile entries
          </Text>
        </Pressable>
      </View>

      {activeSection === 'journals' && renderJournalEntries()}

      {activeSection === 'bank' && renderBankBook()}

      {activeSection === 'reconcile' && renderReconcileEntries()}

      <DatePickerModal
        visible={calendarVisible}
        title="Select Date"
        subtitle={
          calendarTarget === 'journal_from' || calendarTarget === 'bank_from'
            ? 'Select starting date'
            : 'Select ending date'
        }
        selectedDate={calendarSelectedDate}
        minDate={calendarMinDate}
        maxDate={calendarMaxDate}
        onClose={closeCalendar}
        onDayPress={handleCalendarDayPress}
      />
      <JournalEntryDetailsModal
        visible={journalDetailsVisible}
        journal={selectedJournal}
        currencySymbol={currencySymbol}
        onClose={closeJournalDetails}
      />

      <EditManualJournalModal
        visible={editJournalVisible}
        journal={selectedJournal}
        onClose={closeEditJournal}
        onSubmit={payload => {
          console.log('Journal correction payload:', payload);

          Alert.alert(
            'Edit manual journal entry',
            'The journal correction API has not been supplied yet.',
          );
        }}
      />
      <CreateManualJournalModal
        visible={createJournalVisible}
        accounts={accounts}
        currencySymbol={currencySymbol}
        onClose={() => setCreateJournalVisible(false)}
        onSubmit={payload => {
          console.log('Manual journal payload:', payload);

          Alert.alert(
            'Post manual journal entry',
            'The create journal API has not been supplied yet.',
          );
        }}
      />
      <ReconcileBankEntryModal
        visible={reconcileEntryVisible}
        unreconciledEntries={unreconciledEntries}
        accounts={accounts}
        currencySymbol={currencySymbol}
        onClose={() => setReconcileEntryVisible(false)}
        onSubmit={payload => {
          console.log('Bank reconciliation payload:', payload);

          Alert.alert(
            'Bank Reconciliation',
            'The bank reconciliation API has not been supplied yet.',
          );
        }}
      />
    </View>
  );
}
