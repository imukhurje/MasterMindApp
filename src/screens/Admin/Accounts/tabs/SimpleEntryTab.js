import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { Calendar } from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../../api/client';
import styles from './SimpleEntryTab.styles';

const BASE = '/api/plugins/financial-accounting/simple-entries';

const PAGE_SIZES = [10, 20, 50, 100];

const formatDate = value => {
  if (!value) return '-';

  const date = String(value).slice(0, 10);
  const parts = date.split('-');

  if (parts.length !== 3) return date;

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

const formatAmount = (value, symbol) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return '-';

  return `${symbol}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const capitalize = value => {
  const text = String(value ?? '');
  return text
    ? text.charAt(0).toUpperCase() + text.slice(1).replace(/_/g, ' ')
    : '-';
};

export default function SimpleEntryTab({ currencySymbol = '₹' }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const requestIdRef = useRef(0);

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [calendarField, setCalendarField] = useState(null);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
    total: 0,
  });

  const [entryModalVisible, setEntryModalVisible] = useState(false);
  const [entryOptionsLoading, setEntryOptionsLoading] = useState(false);
  const [savingEntry, setSavingEntry] = useState(false);

  const [entryOptions, setEntryOptions] = useState({
    banks: [],
    ledgers: [],
  });

  const [entryDate, setEntryDate] = useState('');
  const [entryDirection, setEntryDirection] = useState('receipt');
  const [receivedIn, setReceivedIn] = useState('cash');
  const [bankAccountId, setBankAccountId] = useState(null);
  const [offsetAccountId, setOffsetAccountId] = useState(null);

  const [entryAmount, setEntryAmount] = useState('');
  const [entryNote, setEntryNote] = useState('');
  const [entryReference, setEntryReference] = useState('');
  const [entryPaymentMode, setEntryPaymentMode] = useState('cash');
  const [approveEntry, setApproveEntry] = useState(false);

  const [entryDropdown, setEntryDropdown] = useState(null);
  const [entryCalendarOpen, setEntryCalendarOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editingEntryVersion, setEditingEntryVersion] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteEntryData, setDeleteEntryData] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletingEntry, setDeletingEntry] = useState(false);

  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [historyEntryData, setHistoryEntryData] = useState(null);
  const [entryHistory, setEntryHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadEntries = useCallback(async (nextPage, nextPerPage, query) => {
    const requestId = ++requestIdRef.current;

    try {
      setLoading(true);

      const url =
        `${BASE}?q=${encodeURIComponent(query)}` +
        `&page=${nextPage}` +
        `&per_page=${nextPerPage}`;

      const response = await api(url);

      if (requestId !== requestIdRef.current) return;

      if (!Array.isArray(response?.data)) {
        throw new Error('Invalid simple entries response.');
      }

      setEntries(response.data);

      setPagination({
        current_page: Number(response.current_page ?? nextPage),
        last_page: Math.max(1, Number(response.last_page ?? 1)),
        from: Number(response.from ?? 0),
        to: Number(response.to ?? 0),
        total: Number(response.total ?? 0),
      });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.log('[SIMPLE ENTRIES ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      Alert.alert(
        'Simple Entries',
        error?.message || 'Could not load entries.',
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadEntries(page, perPage, appliedSearch);
  }, [page, perPage, appliedSearch, loadEntries]);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
    };
  }, []);

  // Date filtering is local to the loaded API page.
  // The supplied API contract does not confirm date query parameters.
  const displayedEntries = useMemo(() => {
    return entries.filter(entry => {
      const entryDate = String(entry.entry_date || '').slice(0, 10);

      if (dateFrom && entryDate < dateFrom) return false;
      if (dateTo && entryDate > dateTo) return false;

      return true;
    });
  }, [entries, dateFrom, dateTo]);

  const handleSearch = () => {
    setPage(1);
    setAppliedSearch(searchText.trim());
  };

  const handlePageSizeChange = size => {
    setPerPage(size);
    setPage(1);
    setPageSizeOpen(false);
  };

  const handleDateChange = day => {
    const selectedDate = day.dateString;

    if (calendarField === 'from') {
      setDateFrom(selectedDate);

      if (dateTo && dateTo < selectedDate) {
        setDateTo('');
      }
    } else if (calendarField === 'to') {
      if (dateFrom && selectedDate < dateFrom) {
        Alert.alert(
          'Invalid Date',
          'Date to cannot be earlier than Date from.',
        );
        return;
      }

      setDateTo(selectedDate);
    }

    setCalendarField(null);
  };

  const showActionInfo = action => {
    Alert.alert(
      `${action} Simple Entry`,
      `The ${action.toLowerCase()} API has not been provided yet.`,
    );
  };

  const renderEntry = entry => {
    const type = capitalize(entry.direction);
    const status = capitalize(entry.status);

    const sourceName = entry.offset_account?.name || '-';
    const receivedIn = capitalize(entry.received_in);

    return (
      <View key={String(entry.id)} style={styles.tableRow}>
        <Text style={[styles.cellText, styles.dateCell]}>
          {formatDate(entry.entry_date)}
        </Text>

        <Text style={[styles.cellText, styles.typeCell]}>{type}</Text>

        <View style={styles.accountCell}>
          <Text style={styles.cellText} numberOfLines={2}>
            {sourceName}
          </Text>
        </View>

        <Text style={[styles.cellText, styles.cashCell]}>{receivedIn}</Text>

        <Text style={[styles.cellText, styles.amountCell]}>
          {formatAmount(entry.amount, currencySymbol)}
        </Text>

        <View style={styles.statusCell}>
          <Text
            style={[
              styles.statusText,
              entry.status === 'approved' && styles.approvedText,
            ]}
          >
            {status}
          </Text>
        </View>

        <View style={styles.actionsCell}>
          {entry.status !== 'deleted' && (
            <>
              <Pressable
                onPress={() => handleEditEntry(entry)}
                style={styles.editButton}
                accessibilityLabel={`Edit ${entry.entry_number}`}
              >
                <MaterialCommunityIcons
                  name="pencil"
                  size={19}
                  color="#FBBF24"
                />
              </Pressable>

              <Pressable
                onPress={() => handleOpenDeleteEntry(entry)}
                style={styles.deleteButton}
                accessibilityLabel={`Delete ${entry.entry_number}`}
              >
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>
            </>
          )}

          <Pressable
            onPress={() => handleOpenEntryHistory(entry)}
            style={styles.historyButton}
            accessibilityLabel={`History ${entry.entry_number}`}
          >
            <Text style={styles.historyButtonText}>History</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderMobileEntryCard = entry => {
    const type = capitalize(entry.direction);
    const status = capitalize(entry.status);
    const sourceName = entry.offset_account?.name || '-';
    const receivedIn = capitalize(entry.received_in);

    return (
      <View key={String(entry.id)} style={styles.mobileCard}>
        <View style={styles.mobileCardTop}>
          <View style={styles.mobileCardTopLeft}>
            <Text style={styles.mobileDate}>
              {formatDate(entry.entry_date)}
            </Text>

            <Text style={styles.mobileType}>{type}</Text>
          </View>

          <Text
            style={[
              styles.mobileStatus,
              entry.status === 'approved' && styles.approvedText,
            ]}
          >
            {status}
          </Text>
        </View>

        <View style={styles.mobileRow}>
          <Text style={styles.mobileLabel}>From / for</Text>
          <Text style={styles.mobileValue}>{sourceName}</Text>
        </View>

        <View style={styles.mobileRow}>
          <Text style={styles.mobileLabel}>Cash / Bank</Text>
          <Text style={styles.mobileValue}>{receivedIn}</Text>
        </View>

        <View style={styles.mobileRow}>
          <Text style={styles.mobileLabel}>Amount</Text>
          <Text style={styles.mobileAmount}>
            {formatAmount(entry.amount, currencySymbol)}
          </Text>
        </View>

        <View style={styles.mobileActionsRow}>
          {entry.status !== 'deleted' && (
            <>
              <Pressable
                onPress={() => handleEditEntry(entry)}
                style={styles.mobileEditButton}
              >
                <MaterialCommunityIcons
                  name="pencil"
                  size={18}
                  color="#FBBF24"
                />
                <Text style={styles.mobileActionText}>Edit</Text>
              </Pressable>

              <Pressable
                onPress={() => handleOpenDeleteEntry(entry)}
                style={styles.mobileDeleteButton}
              >
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={styles.mobileActionText}>Delete</Text>
              </Pressable>
            </>
          )}

          <Pressable
            onPress={() => handleOpenEntryHistory(entry)}
            style={styles.mobileHistoryButton}
          >
            <Text style={styles.mobileHistoryText}>History</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const openAddEntryModal = async () => {
    setEditingEntryId(null);
    setEditingEntryVersion(null);
    if (entryOptionsLoading) return;

    // Local date, avoiding UTC date shifting.
    const now = new Date();
    const localDate = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');

    setEntryDate(localDate);
    setEntryDirection('receipt');
    setReceivedIn('cash');

    setBankAccountId(null);
    setOffsetAccountId(null);

    setEntryAmount('');
    setEntryNote('');
    setEntryReference('');
    setEntryPaymentMode('cash');
    setApproveEntry(false);

    setEntryDropdown(null);
    setEntryCalendarOpen(false);

    setEntryOptions({ banks: [], ledgers: [] });
    setEntryModalVisible(true);

    try {
      setEntryOptionsLoading(true);

      const response = await api(
        '/api/plugins/financial-accounting/simple-entries/options',
      );

      if (
        !Array.isArray(response?.banks) ||
        !Array.isArray(response?.ledgers)
      ) {
        throw new Error('Invalid simple entry options response.');
      }

      setEntryOptions({
        banks: response.banks,
        ledgers: response.ledgers,
      });

      if (response.banks.length === 1) {
        setBankAccountId(Number(response.banks[0].id));
      }
    } catch (error) {
      console.log('[SIMPLE ENTRY OPTIONS ERROR]', error);

      Alert.alert(
        'Options Error',
        error?.message || 'Could not load entry options.',
      );
    } finally {
      setEntryOptionsLoading(false);
    }
  };

  const closeAddEntryModal = () => {
    if (savingEntry) return;

    setEntryDropdown(null);
    setEntryCalendarOpen(false);
    setEntryModalVisible(false);

    // Reset edit mode
    setEditingEntryId(null);
    setEditingEntryVersion(null);
  };

  const handleEditEntry = async entry => {
    const entryId = Number(entry?.id);

    if (!Number.isInteger(entryId) || entryId <= 0) {
      Alert.alert('Edit Failed', 'Invalid simple entry.');
      return;
    }

    if (entryOptionsLoading || savingEntry) return;

    // Reset modal-specific UI state
    setEditingEntryId(entryId);
    setEditingEntryVersion(null);
    setEntryDropdown(null);
    setEntryCalendarOpen(false);
    setEntryOptions({ banks: [], ledgers: [] });

    setEntryModalVisible(true);
    setEntryOptionsLoading(true);

    try {
      // Load options and the latest entry details.
      const [optionsResponse, detailsResponse] = await Promise.all([
        api('/api/plugins/financial-accounting/simple-entries/options'),
        api(`/api/plugins/financial-accounting/simple-entries/${entryId}`),
      ]);

      if (
        !Array.isArray(optionsResponse?.banks) ||
        !Array.isArray(optionsResponse?.ledgers)
      ) {
        throw new Error('Unable to load bank and ledger options.');
      }

      const savedEntry = detailsResponse?.entry;

      if (!savedEntry || Number(savedEntry.id) !== entryId) {
        throw new Error('Unable to load simple entry details.');
      }

      const version = Number(savedEntry.version);

      if (!Number.isInteger(version) || version < 1) {
        throw new Error('Invalid entry version received.');
      }

      setEntryOptions({
        banks: optionsResponse.banks,
        ledgers: optionsResponse.ledgers,
      });

      // Populate the same form used for Add Entry.
      setEntryDate(String(savedEntry.entry_date || '').slice(0, 10));

      setEntryDirection(savedEntry.direction || 'receipt');
      setReceivedIn(savedEntry.received_in || 'cash');

      setOffsetAccountId(
        savedEntry.offset_account_id != null
          ? Number(savedEntry.offset_account_id)
          : null,
      );

      // Bank entries use the bank ledger as account_id.
      // For cash entries, select the available bank option
      // because the verified payload includes bank_account_id.
      const matchingBank = optionsResponse.banks.find(
        bank => Number(bank.id) === Number(savedEntry.account_id),
      );

      setBankAccountId(
        matchingBank
          ? Number(matchingBank.id)
          : optionsResponse.banks.length === 1
          ? Number(optionsResponse.banks[0].id)
          : null,
      );

      setEntryAmount(String(savedEntry.amount ?? ''));
      setEntryNote(String(savedEntry.note ?? ''));
      setEntryReference(String(savedEntry.reference ?? ''));
      setEntryPaymentMode(String(savedEntry.payment_mode || 'cash'));

      // Editing does not automatically approve an existing draft.
      setApproveEntry(false);

      setEditingEntryVersion(version);
    } catch (error) {
      console.log('[SIMPLE ENTRY EDIT LOAD ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      setEntryModalVisible(false);
      setEditingEntryId(null);
      setEditingEntryVersion(null);

      Alert.alert(
        'Edit Failed',
        error?.message || 'Could not load entry details.',
      );
    } finally {
      setEntryOptionsLoading(false);
    }
  };

  const handleSaveEntry = async () => {
    if (savingEntry || entryOptionsLoading) return;

    const amount = entryAmount.trim();
    const parsedAmount = Number(amount);

    if (
      !/^\d+(\.\d{1,2})?$/.test(amount) ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      Alert.alert('Invalid Amount', 'Enter a valid positive amount.');
      return;
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(entryDate) ||
      Number.isNaN(Date.parse(`${entryDate}T00:00:00Z`))
    ) {
      Alert.alert('Date Required', 'Select a valid entry date.');
      return;
    }

    if (!['receipt', 'payment'].includes(entryDirection)) {
      Alert.alert('Entry Type Required', 'Select receipt or payment.');
      return;
    }

    if (!['cash', 'bank'].includes(receivedIn)) {
      Alert.alert('Received In Required', 'Select Cash or Bank.');
      return;
    }

    const selectedLedger = entryOptions.ledgers.find(
      item => Number(item.id) === Number(offsetAccountId),
    );

    if (!selectedLedger) {
      Alert.alert(
        'Ledger Required',
        'Select the matching account under Received from / for.',
      );
      return;
    }

    const selectedBank = entryOptions.banks.find(
      item => Number(item.id) === Number(bankAccountId),
    );

    if (receivedIn === 'bank' && !selectedBank) {
      Alert.alert('Bank Required', 'Please select a bank.');
      return;
    }

    if (!entryPaymentMode.trim()) {
      Alert.alert('Payment Mode Required', 'Select a payment mode.');
      return;
    }

    // The supplied backend example includes bank_account_id
    // even when received_in is cash.
    // Use a known bank from the options API.
    if (!selectedBank) {
      Alert.alert(
        'Bank Configuration Required',
        'A valid bank account is required by the supplied request format.',
      );
      return;
    }

    const isEditMode = editingEntryId !== null;

    if (
      isEditMode &&
      (!Number.isInteger(editingEntryVersion) || editingEntryVersion < 1)
    ) {
      Alert.alert(
        'Update Failed',
        'Entry version is missing. Reopen the entry and try again.',
      );
      return;
    }

    const payload = {
      direction: entryDirection,
      entry_date: entryDate,
      received_in: receivedIn,
      bank_account_id: Number(selectedBank.id),
      offset_account_id: Number(selectedLedger.id),
      amount,
      note: entryNote.trim() || null,
      reference: entryReference.trim() || null,
      payment_mode: entryPaymentMode,
      approve: approveEntry,
      ...(isEditMode ? { version: editingEntryVersion } : {}),
    };

    try {
      setSavingEntry(true);

      const endpoint = isEditMode
        ? `/api/plugins/financial-accounting/simple-entries/${editingEntryId}`
        : '/api/plugins/financial-accounting/simple-entries';

      const response = await api(endpoint, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (
        !response?.entry?.id ||
        (isEditMode && Number(response.entry.id) !== editingEntryId)
      ) {
        throw new Error(
          isEditMode
            ? 'Could not update simple entry.'
            : 'Could not save simple entry.',
        );
      }

      // Close modal.
      setEntryModalVisible(false);
      setEntryDropdown(null);
      setEntryCalendarOpen(false);

      setEditingEntryId(null);
      setEditingEntryVersion(null);

      // Add: refresh page 1.
      // Edit: refresh current page.
      if (isEditMode) {
        await loadEntries(pagination.current_page, perPage, appliedSearch);
      } else if (page === 1) {
        await loadEntries(1, perPage, appliedSearch);
      } else {
        setPage(1);
        // Existing useEffect loads page 1 automatically.
      }

      Alert.alert(
        isEditMode ? 'Entry Updated' : 'Entry Saved',
        isEditMode
          ? 'Simple entry updated successfully.'
          : 'Simple entry saved successfully.',
      );
    } catch (error) {
      console.log('[SAVE SIMPLE ENTRY ERROR]', {
        status: error?.status,
        message: error?.message,
        payload: error?.payload,
      });

      Alert.alert('Save Failed', error?.message || 'Could not save entry.');
    } finally {
      setSavingEntry(false);
    }
  };

  const handleOpenDeleteEntry = async entry => {
    if (deleteLoading || deletingEntry) return;

    if (entry.status === 'deleted') return;

    const id = Number(entry.id);

    if (!Number.isInteger(id) || id <= 0) {
      Alert.alert('Delete Failed', 'Invalid entry ID.');
      return;
    }

    setDeleteEntryData(null);
    setDeleteReason('');
    setDeleteModalVisible(true);
    setDeleteLoading(true);

    try {
      const response = await api(`${BASE}/${id}`);

      const latestEntry = response?.entry;

      if (!latestEntry || Number(latestEntry.id) !== id) {
        throw new Error('Unable to load entry details.');
      }

      if (latestEntry.status === 'deleted') {
        throw new Error('This entry has already been deleted.');
      }

      const version = Number(latestEntry.version);

      if (!Number.isInteger(version) || version < 1) {
        throw new Error('Invalid entry version.');
      }

      setDeleteEntryData(latestEntry);
    } catch (error) {
      setDeleteModalVisible(false);

      Alert.alert(
        'Delete Failed',
        error?.message || 'Could not load entry details.',
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const closeDeleteModal = () => {
    if (deletingEntry || deleteLoading) return;

    setDeleteModalVisible(false);
    setDeleteEntryData(null);
    setDeleteReason('');
  };

  const handleConfirmDeleteEntry = async () => {
    if (deletingEntry || deleteLoading) return;

    const reason = deleteReason.trim();

    if (!reason) {
      Alert.alert('Reason Required', 'Please enter a reason for deletion.');
      return;
    }

    const id = Number(deleteEntryData?.id);
    const version = Number(deleteEntryData?.version);

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      !Number.isInteger(version) ||
      version < 1
    ) {
      Alert.alert(
        'Invalid Entry',
        'Entry details are incomplete. Please reopen the modal.',
      );
      return;
    }

    try {
      setDeletingEntry(true);

      const response = await api(`${BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version,
          correction_date: null,
          reason,
        }),
      });

      if (response?.ok !== true) {
        throw new Error('Could not delete simple entry.');
      }

      setDeleteModalVisible(false);
      setDeleteEntryData(null);
      setDeleteReason('');

      // Keep the current page and filters.
      await loadEntries(pagination.current_page, perPage, appliedSearch);

      Alert.alert('Entry Deleted', 'Simple entry deleted successfully.');
    } catch (error) {
      console.log('[DELETE SIMPLE ENTRY ERROR]', {
        status: error?.status,
        message: error?.message,
        payload: error?.payload,
      });

      Alert.alert(
        'Delete Failed',
        error?.message || 'Unable to delete simple entry.',
      );
    } finally {
      setDeletingEntry(false);
    }
  };

  const handleOpenEntryHistory = async entry => {
    if (historyLoading) return;

    const id = Number(entry.id);

    if (!Number.isInteger(id) || id <= 0) {
      Alert.alert('History', 'Invalid entry ID.');
      return;
    }

    setHistoryEntryData(entry);
    setEntryHistory([]);
    setHistoryModalVisible(true);
    setHistoryLoading(true);

    try {
      const response = await api(`${BASE}/${id}`);

      if (!response?.entry || Number(response.entry.id) !== id) {
        throw new Error('Unable to load entry history.');
      }

      setHistoryEntryData(response.entry);

      const history = Array.isArray(response.history) ? response.history : [];

      setEntryHistory(history);
    } catch (error) {
      console.log('[SIMPLE ENTRY HISTORY ERROR]', error);

      Alert.alert(
        'History Failed',
        error?.message || 'Could not load entry history.',
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeHistoryModal = () => {
    if (historyLoading) return;

    setHistoryModalVisible(false);
    setHistoryEntryData(null);
    setEntryHistory([]);
  };

  // Backend history may use "YYYY-MM-DD HH:mm:ss".
  const formatHistoryDate = value => {
    if (!value) return '-';

    return String(value)
      .replace('T', ' ')
      .replace(/\.\d+Z$/, '')
      .replace(/Z$/, '')
      .slice(0, 19);
  };

  const formatHistoryJournal = item => {
    if (item.reversal_journal_entry_id) {
      return `Reversal #${item.reversal_journal_entry_id}`;
    }

    try {
      const snapshot = item.after_snapshot
        ? JSON.parse(item.after_snapshot)
        : null;

      if (snapshot?.journal_entry_id) {
        return `Journal #${snapshot.journal_entry_id}`;
      }
    } catch (error) {
      // Invalid snapshot should not prevent history display.
    }

    return 'Draft';
  };

  return (
    <View style={styles.container}>
      {/* Heading and Add button */}
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Simple Entries</Text>
          <Text style={styles.subtitle}>
            Record money received or paid. Approve an entry when it is ready to
            count in your accounts.
          </Text>
        </View>

        <Pressable onPress={openAddEntryModal} style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />

          <Text style={styles.addButtonText}>Add Entry</Text>
        </Pressable>
      </View>

      {/* Search and Page Size */}
      <View style={styles.filtersSection}>
        <View style={styles.filterField}>
          <Text style={styles.filterLabel}>Search entries</Text>

          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholder="Name, amount or text"
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />

          <Pressable onPress={handleSearch} style={styles.searchButton}>
            <MaterialCommunityIcons name="magnify" size={19} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.pageSizeSection}>
          <Text style={styles.filterLabel}>Entries per page</Text>

          <Pressable
            onPress={() => setPageSizeOpen(value => !value)}
            style={styles.pageSizeButton}
          >
            <Text style={styles.pageSizeText}>{perPage}</Text>

            <MaterialCommunityIcons
              name="chevron-down"
              size={19}
              color="#FFFFFF"
            />
          </Pressable>

          {pageSizeOpen && (
            <View style={styles.pageSizeOptions}>
              {PAGE_SIZES.map(size => (
                <Pressable
                  key={size}
                  onPress={() => handlePageSizeChange(size)}
                  style={styles.pageSizeOption}
                >
                  <Text style={styles.pageSizeText}>{size}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Date Filters */}
      <View style={styles.dateFiltersRow}>
        <View style={styles.dateFilter}>
          <Text style={styles.filterLabel}>Date from</Text>

          <Pressable
            onPress={() => setCalendarField('from')}
            style={styles.dateButton}
          >
            <Text style={styles.dateText}>
              {dateFrom ? formatDate(dateFrom) : 'dd-mm-yyyy'}
            </Text>

            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={20}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        <View style={styles.dateFilter}>
          <Text style={styles.filterLabel}>Date to</Text>

          <Pressable
            onPress={() => setCalendarField('to')}
            style={styles.dateButton}
          >
            <Text style={styles.dateText}>
              {dateTo ? formatDate(dateTo) : 'dd-mm-yyyy'}
            </Text>

            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={20}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </View>

      {(dateFrom || dateTo) && (
        <View style={styles.dateNoteRow}>
          <Text style={styles.dateNote}>
            Date filters apply to this API page only.
          </Text>

          <Pressable
            onPress={() => {
              setDateFrom('');
              setDateTo('');
            }}
          >
            <Text style={styles.clearText}>Clear dates</Text>
          </Pressable>
        </View>
      )}

      {/* Entries Table */}
      {isMobile ? (
        <View style={styles.mobileList}>
          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color="#7DD3FC" size="large" />
              <Text style={styles.emptyText}>Loading entries...</Text>
            </View>
          ) : displayedEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No simple entries found.</Text>
            </View>
          ) : (
            displayedEntries.map(renderMobileEntryCard)
          )}
        </View>
      ) : (
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator
        >
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.dateCell]}>Date</Text>
              <Text style={[styles.headerCell, styles.typeCell]}>Type</Text>
              <Text style={[styles.headerCell, styles.accountCell]}>
                From / for
              </Text>
              <Text style={[styles.headerCell, styles.cashCell]}>
                Cash / Bank
              </Text>
              <Text style={[styles.headerCell, styles.amountCell]}>Amount</Text>
              <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
              <Text style={[styles.headerCell, styles.actionsCell]}>
                Actions
              </Text>
            </View>

            {loading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator color="#7DD3FC" size="large" />
                <Text style={styles.emptyText}>Loading entries...</Text>
              </View>
            ) : displayedEntries.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No simple entries found.</Text>
              </View>
            ) : (
              displayedEntries.map(renderEntry)
            )}
          </View>
        </ScrollView>
      )}

      {/* Pagination */}
      <View style={styles.paginationRow}>
        <Pressable
          disabled={loading || pagination.current_page <= 1}
          onPress={() => setPage(pagination.current_page - 1)}
          style={[
            styles.pageButton,
            (loading || pagination.current_page <= 1) && styles.disabledButton,
          ]}
        >
          <Text style={styles.pageButtonText}>Previous</Text>
        </Pressable>

        <Text style={styles.paginationText}>
          Page {pagination.current_page} of {pagination.last_page} ·{' '}
          {pagination.total} entries
        </Text>

        <Pressable
          disabled={loading || pagination.current_page >= pagination.last_page}
          onPress={() => setPage(pagination.current_page + 1)}
          style={[
            styles.pageButton,
            (loading || pagination.current_page >= pagination.last_page) &&
              styles.disabledButton,
          ]}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </Pressable>
      </View>

      {/* Calendar Modal */}
      <Modal
        visible={calendarField !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarField(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarCard}>
            <Text style={styles.calendarTitle}>
              {calendarField === 'from' ? 'Select Date From' : 'Select Date To'}
            </Text>

            <Calendar
              onDayPress={handleDateChange}
              maxDate={undefined}
              minDate={
                calendarField === 'to' && dateFrom ? dateFrom : undefined
              }
              markedDates={{
                ...(dateFrom
                  ? {
                      [dateFrom]: {
                        selected: true,
                        selectedColor: '#2563EB',
                      },
                    }
                  : {}),
                ...(dateTo
                  ? {
                      [dateTo]: {
                        selected: true,
                        selectedColor: '#2563EB',
                      },
                    }
                  : {}),
              }}
              theme={{
                calendarBackground: '#142B49',
                dayTextColor: '#F8FAFC',
                monthTextColor: '#F8FAFC',
                textSectionTitleColor: '#AFC0D8',
                todayTextColor: '#7DD3FC',
                selectedDayBackgroundColor: '#2563EB',
                selectedDayTextColor: '#FFFFFF',
                arrowColor: '#7DD3FC',
              }}
            />

            <Pressable
              onPress={() => setCalendarField(null)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Add Simple Entry Modal */}
      <Modal
        visible={entryModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeAddEntryModal}
      >
        <View style={styles.entryModalOverlay}>
          <View style={styles.entryModalCard}>
            <View style={styles.entryModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.entryModalTitle}>
                  {editingEntryId !== null ? 'Edit' : 'New'}{' '}
                  {entryDirection === 'receipt' ? 'Receipt' : 'Payment'}
                </Text>
                <Text style={styles.entryModalSubtitle}>
                  Tell us what came in or went out.
                </Text>
              </View>

              <Pressable
                onPress={closeAddEntryModal}
                style={styles.entryModalClose}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ScrollView
              style={styles.entryModalScroll}
              contentContainerStyle={styles.entryModalContent}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {entryOptionsLoading ? (
                <ActivityIndicator size="large" color="#7DD3FC" />
              ) : (
                <>
                  {/* Date */}
                  <View style={styles.entryFormGroup}>
                    <Text style={styles.entryFormLabel}>Date *</Text>

                    <Pressable
                      onPress={() => setEntryCalendarOpen(true)}
                      style={styles.entryInputRow}
                    >
                      <Text style={styles.entryInputText}>
                        {formatDate(entryDate)}
                      </Text>
                      <MaterialCommunityIcons
                        name="calendar-month-outline"
                        size={20}
                        color="#F8FAFC"
                      />
                    </Pressable>
                  </View>

                  {/* Entry Type */}
                  <View style={styles.entryFormGroup}>
                    <Text style={styles.entryFormLabel}>Entry type *</Text>

                    <Pressable
                      onPress={() =>
                        setEntryDropdown(
                          entryDropdown === 'direction' ? null : 'direction',
                        )
                      }
                      style={styles.entryInputRow}
                    >
                      <Text style={styles.entryInputText}>
                        {entryDirection === 'receipt'
                          ? 'Receipt — money received'
                          : 'Payment — money paid'}
                      </Text>
                      <MaterialCommunityIcons
                        name="chevron-down"
                        size={20}
                        color="#F8FAFC"
                      />
                    </Pressable>

                    {entryDropdown === 'direction' && (
                      <View style={styles.entryDropdown}>
                        {[
                          {
                            value: 'receipt',
                            label: 'Receipt — money received',
                          },
                          { value: 'payment', label: 'Payment — money paid' },
                        ].map(item => (
                          <Pressable
                            key={item.value}
                            onPress={() => {
                              setEntryDirection(item.value);
                              setEntryDropdown(null);
                            }}
                            style={styles.entryDropdownOption}
                          >
                            <Text style={styles.entryDropdownText}>
                              {item.label}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Received In */}
                  <View style={styles.entryFormGroup}>
                    <Text style={styles.entryFormLabel}>Received in *</Text>

                    <View style={styles.entryRadioRow}>
                      {['cash', 'bank'].map(item => (
                        <Pressable
                          key={item}
                          onPress={() => {
                            setReceivedIn(item);
                            setEntryPaymentMode(item === 'cash' ? 'cash' : '');
                          }}
                          style={styles.entryRadioOption}
                        >
                          <MaterialCommunityIcons
                            name={
                              receivedIn === item
                                ? 'radiobox-marked'
                                : 'radiobox-blank'
                            }
                            size={21}
                            color={receivedIn === item ? '#7DD3FC' : '#94A3B8'}
                          />
                          <Text style={styles.entryRadioText}>
                            {capitalize(item)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Bank */}
                  {(receivedIn === 'bank' || entryOptions.banks.length > 1) && (
                    <View style={styles.entryFormGroup}>
                      <Text style={styles.entryFormLabel}>Bank account *</Text>

                      <Pressable
                        onPress={() =>
                          setEntryDropdown(
                            entryDropdown === 'bank' ? null : 'bank',
                          )
                        }
                        style={styles.entryInputRow}
                      >
                        <Text style={styles.entryInputText}>
                          {entryOptions.banks.find(
                            bank => Number(bank.id) === Number(bankAccountId),
                          )?.name || 'Select bank account'}
                        </Text>
                        <MaterialCommunityIcons
                          name="chevron-down"
                          size={20}
                          color="#FFFFFF"
                        />
                      </Pressable>

                      {entryDropdown === 'bank' && (
                        <View style={styles.entryDropdown}>
                          {entryOptions.banks.map(bank => (
                            <Pressable
                              key={String(bank.id)}
                              style={styles.entryDropdownOption}
                              onPress={() => {
                                setBankAccountId(Number(bank.id));
                                setEntryDropdown(null);
                              }}
                            >
                              <Text style={styles.entryDropdownText}>
                                {bank.name} · {bank.code}
                              </Text>
                            </Pressable>
                          ))}
                        </View>
                      )}
                    </View>
                  )}

                  {/* Ledger */}
                  <View style={styles.entryFormGroup}>
                    <Text style={styles.entryFormLabel}>
                      Received from / for *
                    </Text>

                    <Pressable
                      onPress={() =>
                        setEntryDropdown(
                          entryDropdown === 'ledger' ? null : 'ledger',
                        )
                      }
                      style={styles.entryInputRow}
                    >
                      <Text style={styles.entryInputText} numberOfLines={2}>
                        {(() => {
                          const selected = entryOptions.ledgers.find(
                            ledger =>
                              Number(ledger.id) === Number(offsetAccountId),
                          );

                          return selected
                            ? `${selected.name} · ${selected.code}`
                            : 'Select who or what this entry is for';
                        })()}
                      </Text>
                      <MaterialCommunityIcons
                        name="chevron-down"
                        size={20}
                        color="#FFFFFF"
                      />
                    </Pressable>

                    {entryDropdown === 'ledger' && (
                      <View style={styles.entryDropdown}>
                        <ScrollView
                          nestedScrollEnabled
                          style={{ maxHeight: 210 }}
                          keyboardShouldPersistTaps="always"
                        >
                          {entryOptions.ledgers.map(ledger => (
                            <Pressable
                              key={String(ledger.id)}
                              onPress={() => {
                                setOffsetAccountId(Number(ledger.id));
                                setEntryDropdown(null);
                              }}
                              style={styles.entryDropdownOption}
                            >
                              <Text style={styles.entryDropdownText}>
                                {ledger.name} · {ledger.code}
                              </Text>
                            </Pressable>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    <Text style={styles.entryHelperText}>
                      Examples: fees, rent, supplies, a loan or owner's capital.
                      Select the matching ledger.
                    </Text>
                  </View>

                  {/* Amount */}
                  <View style={styles.entryFormGroup}>
                    <Text style={styles.entryFormLabel}>
                      Amount * {currencySymbol}
                    </Text>
                    <TextInput
                      value={entryAmount}
                      onChangeText={setEntryAmount}
                      placeholder="Enter amount"
                      placeholderTextColor="#8193AD"
                      keyboardType="decimal-pad"
                      style={styles.entryTextInput}
                    />
                  </View>

                  {/* Note */}
                  <View style={styles.entryFormGroup}>
                    <Text style={styles.entryFormLabel}>
                      Description / Note
                    </Text>
                    <TextInput
                      value={entryNote}
                      onChangeText={setEntryNote}
                      placeholder="Optional details"
                      placeholderTextColor="#8193AD"
                      style={styles.entryTextInput}
                    />
                  </View>

                  {/* Payment Mode */}
                  <View style={styles.entryFormGroup}>
                    <Text style={styles.entryFormLabel}>Payment mode *</Text>
                    <TextInput
                      value={entryPaymentMode}
                      onChangeText={setEntryPaymentMode}
                      placeholder="Enter payment mode"
                      placeholderTextColor="#8193AD"
                      autoCapitalize="none"
                      style={styles.entryTextInput}
                    />
                  </View>

                  {/* Reference */}
                  <View style={styles.entryFormGroup}>
                    <Text style={styles.entryFormLabel}>Reference</Text>
                    <TextInput
                      value={entryReference}
                      onChangeText={setEntryReference}
                      placeholder="Optional cheque or transfer reference"
                      placeholderTextColor="#8193AD"
                      style={styles.entryTextInput}
                    />
                  </View>

                  {/* Approve */}
                  <Pressable
                    onPress={() => setApproveEntry(previous => !previous)}
                    style={styles.entryApproveRow}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: approveEntry }}
                  >
                    <MaterialCommunityIcons
                      name={
                        approveEntry
                          ? 'checkbox-marked'
                          : 'checkbox-blank-outline'
                      }
                      size={22}
                      color={approveEntry ? '#7DD3FC' : '#94A3B8'}
                    />
                    <Text style={styles.entryRadioText}>Approve</Text>
                  </Pressable>

                  <Text style={styles.entryHelperText}>
                    Leave unchecked to save a draft. Check Approve to include it
                    in your accounts immediately.
                  </Text>
                </>
              )}
            </ScrollView>

            {/* Fixed Footer */}
            <View style={styles.entryModalFooter}>
              <Pressable
                onPress={closeAddEntryModal}
                disabled={savingEntry}
                style={styles.entryCancelButton}
              >
                <Text style={styles.entryFooterText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleSaveEntry}
                disabled={
                  savingEntry ||
                  entryOptionsLoading ||
                  (editingEntryId !== null && editingEntryVersion === null)
                }
                style={[
                  styles.entrySaveButton,
                  (savingEntry ||
                    entryOptionsLoading ||
                    (editingEntryId !== null &&
                      editingEntryVersion === null)) && { opacity: 0.5 },
                ]}
              >
                {savingEntry ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.entryFooterText}>
                    {editingEntryId !== null ? 'Update' : 'Save'}{' '}
                    {entryDirection === 'receipt' ? 'Receipt' : 'Payment'}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Separate date calendar modal */}
      <Modal
        visible={entryCalendarOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setEntryCalendarOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarCard}>
            <Text style={styles.calendarTitle}>Select Entry Date</Text>

            <Calendar
              current={entryDate || undefined}
              onDayPress={day => {
                setEntryDate(day.dateString);
                setEntryCalendarOpen(false);
              }}
              markedDates={
                entryDate
                  ? {
                      [entryDate]: {
                        selected: true,
                        selectedColor: '#2563EB',
                      },
                    }
                  : {}
              }
              theme={{
                calendarBackground: '#142B49',
                dayTextColor: '#F8FAFC',
                monthTextColor: '#F8FAFC',
                textSectionTitleColor: '#AFC0D8',
                todayTextColor: '#7DD3FC',
                selectedDayBackgroundColor: '#2563EB',
                selectedDayTextColor: '#FFFFFF',
                arrowColor: '#7DD3FC',
              }}
            />

            <Pressable
              onPress={() => setEntryCalendarOpen(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* DELETE SIMPLE ENTRY MODAL */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeDeleteModal}
      >
        <View style={styles.simpleActionOverlay}>
          <View style={styles.simpleActionCard}>
            <View style={styles.simpleActionHeader}>
              <Text style={styles.simpleActionTitle}>Delete Simple Entry</Text>

              <Pressable
                onPress={closeDeleteModal}
                disabled={deletingEntry || deleteLoading}
                style={styles.simpleActionClose}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            {deleteLoading ? (
              <View style={styles.simpleActionLoading}>
                <ActivityIndicator size="large" color="#7DD3FC" />
                <Text style={styles.simpleActionMuted}>
                  Loading entry details...
                </Text>
              </View>
            ) : deleteEntryData ? (
              <>
                <Text style={styles.deleteDescription}>
                  {deleteEntryData.entry_number}
                  {' · '}
                  {deleteEntryData.account?.name || '-'}
                  {' · '}
                  {formatAmount(deleteEntryData.amount, currencySymbol)}
                  {' — '}
                  The entry remains in history. Approved amounts will be
                  reversed.
                </Text>

                <View style={styles.deleteFieldGroup}>
                  <Text style={styles.deleteFieldLabel}>
                    Reason for deletion *
                  </Text>

                  <TextInput
                    value={deleteReason}
                    onChangeText={setDeleteReason}
                    placeholder="Enter reason for deletion"
                    placeholderTextColor="#94A3B8"
                    multiline
                    textAlignVertical="top"
                    editable={!deletingEntry}
                    style={styles.deleteReasonInput}
                  />
                </View>
              </>
            ) : null}

            <View style={styles.simpleActionFooter}>
              <Pressable
                onPress={closeDeleteModal}
                disabled={deletingEntry || deleteLoading}
                style={styles.simpleCancelButton}
              >
                <Text style={styles.simpleActionButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleConfirmDeleteEntry}
                disabled={
                  deletingEntry ||
                  deleteLoading ||
                  !deleteEntryData ||
                  !deleteReason.trim()
                }
                style={[
                  styles.simpleDeleteButton,
                  (deletingEntry ||
                    deleteLoading ||
                    !deleteEntryData ||
                    !deleteReason.trim()) &&
                    styles.simpleButtonDisabled,
                ]}
              >
                {deletingEntry ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.simpleActionButtonText}>
                    Delete Entry
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* SIMPLE ENTRY HISTORY MODAL */}
      <Modal
        visible={historyModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeHistoryModal}
      >
        <View style={styles.simpleActionOverlay}>
          <View style={styles.simpleActionCard}>
            <View style={styles.simpleActionHeader}>
              <Text style={styles.simpleActionTitle} numberOfLines={1}>
                History · {historyEntryData?.entry_number || ''}
              </Text>

              <Pressable
                onPress={closeHistoryModal}
                style={styles.simpleActionClose}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            {historyLoading ? (
              <View style={styles.simpleActionLoading}>
                <ActivityIndicator size="large" color="#7DD3FC" />
                <Text style={styles.simpleActionMuted}>Loading history...</Text>
              </View>
            ) : entryHistory.length === 0 ? (
              <Text style={styles.simpleActionMuted}>
                No history records found.
              </Text>
            ) : isMobile ? (
              // MOBILE VIEW
              <ScrollView
                style={styles.mobileHistoryScroll}
                contentContainerStyle={styles.mobileHistoryList}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {entryHistory.map(item => (
                  <View key={String(item.id)} style={styles.mobileHistoryCard}>
                    <View style={styles.mobileHistoryHeader}>
                      <Text style={styles.mobileHistoryDate}>
                        {formatHistoryDate(item.created_at)}
                      </Text>

                      <View style={styles.mobileHistoryBadge}>
                        <Text style={styles.mobileHistoryBadgeText}>
                          {capitalize(item.action)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.mobileHistoryDetail}>
                      <Text style={styles.mobileHistoryLabel}>Reason</Text>

                      <Text style={styles.mobileHistoryValue}>
                        {item.reason || '—'}
                      </Text>
                    </View>

                    <View style={styles.mobileHistoryDetail}>
                      <Text style={styles.mobileHistoryLabel}>
                        Journal / Reversal
                      </Text>

                      <Text style={styles.mobileHistoryValue}>
                        {formatHistoryJournal(item)}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              // DESKTOP VIEW - KEEP EXISTING TABLE
              <ScrollView
                style={styles.historyVerticalScroll}
                nestedScrollEnabled
              >
                <ScrollView
                  horizontal
                  nestedScrollEnabled
                  showsHorizontalScrollIndicator
                >
                  <View style={styles.historyTable}>
                    <View style={styles.historyTableHeader}>
                      <Text style={[styles.historyHeaderText, { width: 185 }]}>
                        When
                      </Text>

                      <Text style={[styles.historyHeaderText, { width: 100 }]}>
                        Action
                      </Text>

                      <Text style={[styles.historyHeaderText, { width: 150 }]}>
                        Reason
                      </Text>

                      <Text style={[styles.historyHeaderText, { width: 165 }]}>
                        Journal / Reversal
                      </Text>
                    </View>

                    {entryHistory.map(item => (
                      <View
                        key={String(item.id)}
                        style={styles.historyTableRow}
                      >
                        <Text style={[styles.historyCellText, { width: 185 }]}>
                          {formatHistoryDate(item.created_at)}
                        </Text>

                        <Text style={[styles.historyCellText, { width: 100 }]}>
                          {item.action || '-'}
                        </Text>

                        <Text style={[styles.historyCellText, { width: 150 }]}>
                          {item.reason || '—'}
                        </Text>

                        <Text style={[styles.historyCellText, { width: 165 }]}>
                          {formatHistoryJournal(item)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </ScrollView>
            )}

            <View style={styles.simpleActionFooter}>
              <Pressable
                onPress={closeHistoryModal}
                style={styles.simpleCancelButton}
              >
                <Text style={styles.simpleActionButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
