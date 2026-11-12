// src/screens/Admin/Accounts/tabs/FinanceSettingsTab.js

import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import DatePickerModal from '../modals/DatePickerModal';

import {
  formatDisplayDate,
  getSevenDaysAgoIso,
  getTodayIso,
} from '../utils/accountsHelpers';

import { api } from '../../../../api/client';

import CreateAccountGroupModal from '../modals/CreateAccountGroupModal';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './FinanceSettingsTab.styles';

import CreateLedgerAccountModal from '../modals/CreateLedgerAccountModal';
import RegistrationFormModal from '../modals/RegistrationFormModal';
import EditFinanceSettingsModal from '../modals/EditFinanceSettingsModal';
import FinanceRoleAssignmentSection from '../sections/FinanceRoleAssignmentSection';

const BASE = '/api/plugins/financial-accounting';

const TABS = [
  {
    key: 'account_groups',
    label: 'Account groups',
  },
  {
    key: 'ledger_accounts',
    label: 'Ledger accounts',
  },
  {
    key: 'registrations',
    label: 'Registrations',
  },
  {
    key: 'finance_settings',
    label: 'Finance settings',
  },
  {
    key: 'role_assignment',
    label: 'Role assignment',
  },
];

function formatDate(value) {
  if (!value) {
    return '-';
  }

  return String(value).slice(0, 10);
}

function formatNormalBalance(value) {
  if (!value) {
    return '-';
  }

  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

export default function FinanceSettingsTab({
  financeSettings = null,
  accountTypes = [],
  accounts = [],
  roleAssignments = {},
  registrations = [],

  onAccountTypesChange,
  onAccountsChange,

  onFinanceSettingsChange,
  onReceivablesChange,
  onPayablesChange,

  onRoleAssignmentsChange,
}) {
  const [activeSection, setActiveSection] = useState('account_groups');
  const [createGroupVisible, setCreateGroupVisible] = useState(false);

  const [creatingGroup, setCreatingGroup] = useState(false);

  const [refreshingGroups, setRefreshingGroups] = useState(false);

  const [groupDateFrom, setGroupDateFrom] = useState(getSevenDaysAgoIso());

  const [groupDateTo, setGroupDateTo] = useState(getTodayIso());

  const [groupSearch, setGroupSearch] = useState('');

  const [appliedGroupFilters, setAppliedGroupFilters] = useState({
    dateFrom: getSevenDaysAgoIso(),
    dateTo: getTodayIso(),
    search: '',
  });

  const [groupCalendarVisible, setGroupCalendarVisible] = useState(false);

  const [groupCalendarTarget, setGroupCalendarTarget] = useState(null);

  const [ledgerDateFrom, setLedgerDateFrom] = useState(getSevenDaysAgoIso());

  const [ledgerDateTo, setLedgerDateTo] = useState(getTodayIso());

  const [ledgerSearch, setLedgerSearch] = useState('');

  const [ledgerMinBalance, setLedgerMinBalance] = useState('');

  const [ledgerMaxBalance, setLedgerMaxBalance] = useState('');

  const [appliedLedgerFilters, setAppliedLedgerFilters] = useState({
    dateFrom: getSevenDaysAgoIso(),
    dateTo: getTodayIso(),
    search: '',
    minBalance: '',
    maxBalance: '',
  });

  const [ledgerCalendarVisible, setLedgerCalendarVisible] = useState(false);

  const [ledgerCalendarTarget, setLedgerCalendarTarget] = useState(null);

  const [createLedgerVisible, setCreateLedgerVisible] = useState(false);

  const [creatingLedger, setCreatingLedger] = useState(false);

  const [registrationSearch, setRegistrationSearch] = useState('');

  const [appliedRegistrationSearch, setAppliedRegistrationSearch] =
    useState('');

  const [registrationModalMode, setRegistrationModalMode] = useState(null);

  const [registrationSubmitting, setRegistrationSubmitting] = useState(false);

  const [financeSearch, setFinanceSearch] = useState('');

  const [appliedFinanceSearch, setAppliedFinanceSearch] = useState('');

  const [financeSettingsVisible, setFinanceSettingsVisible] = useState(false);

  const [savingFinanceSettings, setSavingFinanceSettings] = useState(false);

  const [reloadingFinanceSettings, setReloadingFinanceSettings] =
    useState(false);

  const settingsRows = useMemo(
    () => [
      {
        key: 'organization_name',
        label: 'Organization name',
        value: financeSettings?.organization_name || '-',
      },
      {
        key: 'currency_code',
        label: 'Currency code',
        value: financeSettings?.currency_code || '-',
      },
      {
        key: 'currency_symbol',
        label: 'Currency symbol',
        value: financeSettings?.currency_symbol || '-',
      },
      {
        key: 'fiscal_year_start',
        label: 'Fiscal year start (MM-DD)',
        value: financeSettings?.fiscal_year_start || '-',
      },
      {
        key: 'posting_lock_date',
        label: 'Posting lock date',
        value: financeSettings?.posting_lock_date || '-',
      },
      {
        key: 'closed_through_date',
        label: 'Closed through date',
        value: financeSettings?.closed_through_date || '-',
      },
    ],
    [financeSettings],
  );

  const filteredSettingsRows = useMemo(() => {
    const searchText = String(appliedFinanceSearch || '')
      .trim()
      .toLowerCase();

    if (!searchText) {
      return settingsRows;
    }

    return settingsRows.filter(item => {
      const haystack = [item.label, item.value]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(searchText);
    });
  }, [settingsRows, appliedFinanceSearch]);

  function applyFinanceFilters() {
    setAppliedFinanceSearch(financeSearch.trim());
  }

  const normalizedAccountTypes = useMemo(() => {
    return Array.isArray(accountTypes) ? accountTypes : [];
  }, [accountTypes]);

  const filteredAccountTypes = useMemo(() => {
    const { dateFrom, dateTo, search } = appliedGroupFilters;

    const searchText = String(search || '')
      .trim()
      .toLowerCase();

    return normalizedAccountTypes.filter(item => {
      const createdDate = item?.created_at
        ? String(item.created_at).slice(0, 10)
        : '';

      if (dateFrom && createdDate && createdDate < dateFrom) {
        return false;
      }

      if (dateTo && createdDate && createdDate > dateTo) {
        return false;
      }

      if (searchText) {
        const haystack = [
          item?.code,
          item?.name,
          item?.category,
          item?.normal_balance,
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
  }, [normalizedAccountTypes, appliedGroupFilters]);

  const reloadAccountGroups = useCallback(
    async ({ showLoader = true } = {}) => {
      try {
        if (showLoader) {
          setRefreshingGroups(true);
        }

        const response = await api(`${BASE}/account-types`, {
          method: 'GET',
        });

        if (response?.ok === false) {
          throw new Error(
            response?.message || 'Could not load account groups.',
          );
        }

        const items = Array.isArray(response?.items) ? response.items : [];

        onAccountTypesChange?.(items);

        return items;
      } catch (error) {
        console.log('Account groups load error:', error);

        Alert.alert(
          'Account Groups',
          error?.data?.message ||
            error?.message ||
            'Could not load account groups.',
        );

        return null;
      } finally {
        if (showLoader) {
          setRefreshingGroups(false);
        }
      }
    },
    [onAccountTypesChange],
  );

  const handleReloadFinanceSettings = useCallback(async () => {
    if (reloadingFinanceSettings) {
      return null;
    }

    try {
      setReloadingFinanceSettings(true);

      const response = await api(`${BASE}/settings`, {
        method: 'GET',
      });

      const nextSettings = response?.settings || null;

      if (nextSettings) {
        onFinanceSettingsChange?.(nextSettings);
      }

      return nextSettings;
    } catch (error) {
      console.log('Reload finance settings error:', error);

      Alert.alert(
        'Finance Settings',
        getApiErrorMessage(error, 'Could not reload finance settings.'),
      );

      return null;
    } finally {
      setReloadingFinanceSettings(false);
    }
  }, [reloadingFinanceSettings, onFinanceSettingsChange]);

  const handlePostFinanceSettings = useCallback(
    async payload => {
      if (savingFinanceSettings) {
        return;
      }

      try {
        setSavingFinanceSettings(true);

        const settingsResponse = await api(`${BASE}/settings`, {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        });

        const [receivablesResponse, payablesResponse] = await Promise.all([
          api(`${BASE}/receivables`, {
            method: 'GET',
          }),

          api(`${BASE}/payables`, {
            method: 'GET',
          }),
        ]);

        const nextSettings = settingsResponse?.settings || null;

        if (nextSettings) {
          onFinanceSettingsChange?.(nextSettings);
        }

        onReceivablesChange?.({
          items: Array.isArray(receivablesResponse?.items)
            ? receivablesResponse.items
            : [],

          outstanding_total:
            Number(receivablesResponse?.outstanding_total) || 0,
        });

        onPayablesChange?.({
          items: Array.isArray(payablesResponse?.items)
            ? payablesResponse.items
            : [],

          outstanding_total: Number(payablesResponse?.outstanding_total) || 0,
        });

        setFinanceSettingsVisible(false);

        Alert.alert('Finance Settings', 'Finance settings saved successfully.');
      } catch (error) {
        console.log('Save finance settings error:', error);

        Alert.alert(
          'Finance Settings',
          getApiErrorMessage(error, 'Could not save finance settings.'),
        );
      } finally {
        setSavingFinanceSettings(false);
      }
    },
    [
      savingFinanceSettings,
      onFinanceSettingsChange,
      onReceivablesChange,
      onPayablesChange,
    ],
  );

  function applyGroupFilters() {
    setAppliedGroupFilters({
      dateFrom: groupDateFrom,
      dateTo: groupDateTo,
      search: groupSearch.trim(),
    });
  }

  function applyGroupLastSevenDays() {
    const from = getSevenDaysAgoIso();

    const to = getTodayIso();

    setGroupDateFrom(from);
    setGroupDateTo(to);
    setGroupSearch('');

    setAppliedGroupFilters({
      dateFrom: from,
      dateTo: to,
      search: '',
    });
  }

  function openGroupCalendar(target) {
    setGroupCalendarTarget(target);
    setGroupCalendarVisible(true);
  }

  function closeGroupCalendar() {
    setGroupCalendarVisible(false);
    setGroupCalendarTarget(null);
  }

  function handleGroupCalendarDayPress(day) {
    const value = day?.dateString;

    if (!value) {
      return;
    }

    if (groupCalendarTarget === 'from') {
      setGroupDateFrom(value);

      if (groupDateTo && value > groupDateTo) {
        setGroupDateTo(value);
      }
    }

    if (groupCalendarTarget === 'to') {
      setGroupDateTo(value);

      if (groupDateFrom && value < groupDateFrom) {
        setGroupDateFrom(value);
      }
    }

    closeGroupCalendar();
  }

  function applyLedgerFilters() {
    setAppliedLedgerFilters({
      dateFrom: ledgerDateFrom,
      dateTo: ledgerDateTo,
      search: ledgerSearch.trim(),
      minBalance: ledgerMinBalance.trim(),
      maxBalance: ledgerMaxBalance.trim(),
    });
  }

  function applyLedgerLastSevenDays() {
    const from = getSevenDaysAgoIso();

    const to = getTodayIso();

    setLedgerDateFrom(from);
    setLedgerDateTo(to);

    setLedgerSearch('');
    setLedgerMinBalance('');
    setLedgerMaxBalance('');

    setAppliedLedgerFilters({
      dateFrom: from,
      dateTo: to,
      search: '',
      minBalance: '',
      maxBalance: '',
    });
  }

  function openLedgerCalendar(target) {
    setLedgerCalendarTarget(target);
    setLedgerCalendarVisible(true);
  }

  function closeLedgerCalendar() {
    setLedgerCalendarVisible(false);
    setLedgerCalendarTarget(null);
  }

  function handleLedgerCalendarDayPress(day) {
    const value = day?.dateString;

    if (!value) {
      return;
    }

    if (ledgerCalendarTarget === 'from') {
      setLedgerDateFrom(value);

      if (ledgerDateTo && value > ledgerDateTo) {
        setLedgerDateTo(value);
      }
    }

    if (ledgerCalendarTarget === 'to') {
      setLedgerDateTo(value);

      if (ledgerDateFrom && value < ledgerDateFrom) {
        setLedgerDateFrom(value);
      }
    }

    closeLedgerCalendar();
  }

  function openRegistrationModal(mode) {
    setRegistrationModalMode(mode);
  }

  function closeRegistrationModal() {
    if (registrationSubmitting) {
      return;
    }

    setRegistrationModalMode(null);
  }

  const handleCreateAccountGroup = useCallback(
    async payload => {
      if (creatingGroup) {
        return;
      }

      try {
        setCreatingGroup(true);

        const response = await api(`${BASE}/account-types`, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        });

        setCreateGroupVisible(false);

        await reloadAccountGroups({
          showLoader: false,
        });

        Alert.alert(
          'Account Group',
          `${response?.name || payload.name} created successfully.`,
        );
      } catch (error) {
        console.log('Create account group error:', error);

        const validationErrors =
          error?.data?.errors || error?.response?.data?.errors;

        let message =
          error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          'Could not create the account group.';

        if (validationErrors) {
          const firstError = Object.values(validationErrors)
            .flat()
            .find(Boolean);

          if (firstError) {
            message = String(firstError);
          }
        }

        Alert.alert('Account Group', message);
      } finally {
        setCreatingGroup(false);
      }
    },
    [creatingGroup, reloadAccountGroups],
  );

  const reloadLedgerWorkspace = useCallback(async () => {
    const [accountsResponse, accountTypesResponse] = await Promise.all([
      api(`${BASE}/accounts`, {
        method: 'GET',
      }),

      api(`${BASE}/account-types`, {
        method: 'GET',
      }),
    ]);

    const nextAccounts = Array.isArray(accountsResponse?.items)
      ? accountsResponse.items
      : [];

    const nextAccountTypes = Array.isArray(accountTypesResponse?.items)
      ? accountTypesResponse.items
      : [];

    onAccountsChange?.(nextAccounts);

    onAccountTypesChange?.(nextAccountTypes);
  }, [onAccountsChange, onAccountTypesChange]);

  const handleCreateLedgerAccount = useCallback(
    async payload => {
      if (creatingLedger) {
        return;
      }

      try {
        setCreatingLedger(true);

        const response = await api(`${BASE}/accounts`, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        });

        setCreateLedgerVisible(false);

        await reloadLedgerWorkspace();

        Alert.alert(
          'Ledger Account',
          `${response?.name || payload.name} created successfully.`,
        );
      } catch (error) {
        console.log('Create ledger account error:', error);

        const validationErrors =
          error?.data?.errors || error?.response?.data?.errors;

        let message =
          error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          'Could not create the ledger account.';

        if (validationErrors) {
          const firstError = Object.values(validationErrors)
            .flat()
            .find(Boolean);

          if (firstError) {
            message = String(firstError);
          }
        }

        Alert.alert('Ledger Account', message);
      } finally {
        setCreatingLedger(false);
      }
    },
    [creatingLedger, reloadLedgerWorkspace],
  );

  const handlePostCounterparty = useCallback(
    async form => {
      if (registrationSubmitting) {
        return;
      }

      const debtorGroup = normalizedAccountTypes.find(
        item => String(item?.code || '').toUpperCase() === 'DEBTORS',
      );

      if (!debtorGroup?.id) {
        Alert.alert(
          'Counterparty',
          'Debtors account group is missing. Prepare the missing helper groups first.',
        );

        return;
      }

      const payload = {
        account_type_id: Number(debtorGroup.id),

        code: form.code.trim(),

        name: form.name.trim(),

        description: form.description.trim() || null,

        allows_posting: true,

        is_active: true,
      };

      try {
        setRegistrationSubmitting(true);

        await api(`${BASE}/accounts`, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        });

        setRegistrationModalMode(null);

        await reloadLedgerWorkspace();

        Alert.alert('Counterparty', 'Counterparty registered successfully.');
      } catch (error) {
        console.log('Register counterparty error:', error);

        Alert.alert(
          'Counterparty',
          getApiErrorMessage(error, 'Could not register the counterparty.'),
        );
      } finally {
        setRegistrationSubmitting(false);
      }
    },
    [registrationSubmitting, normalizedAccountTypes, reloadLedgerWorkspace],
  );

  const handlePostCreditorVendor = useCallback(
    async form => {
      if (registrationSubmitting) {
        return;
      }

      const payload = {
        code: form.code.trim(),

        name: form.name.trim(),

        phone: form.phone.trim() || null,

        email: form.email.trim() || null,
      };

      try {
        setRegistrationSubmitting(true);

        await api(`${BASE}/vendors`, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        });

        setRegistrationModalMode(null);

        // Vendor registration may also create/update
        // accounting ledgers, so refresh the ledger workspace.
        await reloadLedgerWorkspace();

        Alert.alert(
          'Creditor / Vendor',
          'Creditor and vendor registered successfully.',
        );
      } catch (error) {
        console.log('Register creditor/vendor error:', error);

        Alert.alert(
          'Creditor / Vendor',
          getApiErrorMessage(error, 'Could not register the creditor/vendor.'),
        );
      } finally {
        setRegistrationSubmitting(false);
      }
    },
    [registrationSubmitting, reloadLedgerWorkspace],
  );

  const handlePostVendor = useCallback(
    async form => {
      if (registrationSubmitting) {
        return;
      }

      const payload = {
        code: form.code.trim() || null,

        name: form.name.trim(),

        phone: form.phone.trim() || null,

        email: form.email.trim() || null,
      };

      try {
        setRegistrationSubmitting(true);

        await api(`${BASE}/vendors`, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        });

        setRegistrationModalMode(null);

        Alert.alert('Vendor', 'Vendor created successfully.');
      } catch (error) {
        console.log('Create vendor error:', error);

        Alert.alert(
          'Vendor',
          getApiErrorMessage(error, 'Could not create the vendor.'),
        );
      } finally {
        setRegistrationSubmitting(false);
      }
    },
    [registrationSubmitting],
  );

  const handlePostBank = useCallback(
    async form => {
      if (registrationSubmitting) {
        return;
      }

      const bankGroup = normalizedAccountTypes.find(
        item =>
          String(item?.code || '')
            .trim()
            .toUpperCase() === 'BANK',
      );

      if (!bankGroup?.id) {
        Alert.alert(
          'Bank Registration',
          'Bank account group is missing. Prepare the missing helper groups first.',
        );

        return;
      }

      const payload = {
        account_type_id: Number(bankGroup.id),

        code: form.code.trim().toUpperCase(),

        name: form.name.trim(),

        description: form.description.trim() || null,

        allows_posting: true,

        is_active: true,
      };

      try {
        setRegistrationSubmitting(true);

        await api(`${BASE}/accounts`, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        });

        setRegistrationModalMode(null);

        await reloadLedgerWorkspace();

        Alert.alert('Bank Registration', 'Bank registered successfully.');
      } catch (error) {
        console.log('Register bank error:', error);

        Alert.alert(
          'Bank Registration',
          getApiErrorMessage(error, 'Could not register the bank.'),
        );
      } finally {
        setRegistrationSubmitting(false);
      }
    },
    [registrationSubmitting, normalizedAccountTypes, reloadLedgerWorkspace],
  );

  function getApiErrorMessage(error, fallback) {
    const validationErrors =
      error?.data?.errors || error?.response?.data?.errors;

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

  const normalizedAccounts = useMemo(() => {
    return Array.isArray(accounts) ? accounts : [];
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    const { dateFrom, dateTo, search, minBalance, maxBalance } =
      appliedLedgerFilters;

    const searchText = String(search || '')
      .trim()
      .toLowerCase();

    const min = minBalance === '' ? null : Number(minBalance);

    const max = maxBalance === '' ? null : Number(maxBalance);

    return normalizedAccounts.filter(item => {
      const createdDate = item?.created_at
        ? String(item.created_at).slice(0, 10)
        : '';

      if (dateFrom && createdDate && createdDate < dateFrom) {
        return false;
      }

      if (dateTo && createdDate && createdDate > dateTo) {
        return false;
      }

      if (searchText) {
        const haystack = [
          item?.code,
          item?.name,
          item?.account_type,
          item?.account_type_code,
          item?.parent_account,
          item?.category,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(searchText)) {
          return false;
        }
      }

      const balance = Number(item?.balance) || 0;

      if (min !== null && Number.isFinite(min) && balance < min) {
        return false;
      }

      if (max !== null && Number.isFinite(max) && balance > max) {
        return false;
      }

      return true;
    });
  }, [normalizedAccounts, appliedLedgerFilters]);

  const normalizedRegistrations = useMemo(() => {
    return Array.isArray(registrations) ? registrations : [];
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    const searchText = String(appliedRegistrationSearch || '')
      .trim()
      .toLowerCase();

    if (!searchText) {
      return normalizedRegistrations;
    }

    return normalizedRegistrations.filter(item => {
      const haystack = [
        item?.type,
        item?.registration_type,
        item?.name,
        item?.email,
        item?.phone,
        item?.code,
        item?.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(searchText);
    });
  }, [normalizedRegistrations, appliedRegistrationSearch]);

  function applyRegistrationFilters() {
    setAppliedRegistrationSearch(registrationSearch.trim());
  }

  function renderAccountGroups() {
    return (
      <>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Create account group</Text>

          <Text style={styles.sectionDescription}>
            Use groups to separate assets, liabilities, income, expenses,
            debtors, creditors, and banks.
          </Text>

          <Pressable
            onPress={() => setCreateGroupVisible(true)}
            style={({ pressed }) => [
              styles.primaryButton,

              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />

            <Text style={styles.primaryButtonText}>Create account group</Text>
          </Pressable>

          <Text style={styles.helperText}>
            Core system groups and operational ledgers are created
            automatically. The helper groups for Debtors, Creditors, and Bank
            can be prepared from the utility below only if you need them.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Current account groups</Text>

          <Text style={styles.sectionDescription}>
            Start here if you want to check whether Debtors, Creditors, or Bank
            groups already exist.
          </Text>

          <Pressable
            onPress={() => reloadAccountGroups()}
            disabled={refreshingGroups}
            style={({ pressed }) => [
              styles.outlineButton,

              refreshingGroups && styles.buttonDisabled,

              pressed && !refreshingGroups && styles.pressed,
            ]}
          >
            {refreshingGroups ? (
              <ActivityIndicator size="small" color="#F1F5F9" />
            ) : (
              <MaterialCommunityIcons name="tools" size={17} color="#F1F5F9" />
            )}

            <Text style={styles.outlineButtonText}>
              {refreshingGroups
                ? 'Preparing...'
                : 'Prepare missing helper groups'}
            </Text>
          </Pressable>

          <View style={styles.groupFilterSection}>
            <Pressable
              onPress={applyGroupLastSevenDays}
              style={({ pressed }) => [
                styles.lastSevenButton,

                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="calendar-range"
                size={17}
                color="#DCE7F5"
              />

              <Text style={styles.lastSevenText}>Last 7 days</Text>
            </Pressable>

            <View style={styles.filterRow}>
              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Date from</Text>

                <Pressable
                  onPress={() => openGroupCalendar('from')}
                  style={styles.dateButton}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDisplayDate(groupDateFrom)}
                  </Text>

                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={18}
                    color="#A8B6C9"
                  />
                </Pressable>
              </View>

              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Date to</Text>

                <Pressable
                  onPress={() => openGroupCalendar('to')}
                  style={styles.dateButton}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDisplayDate(groupDateTo)}
                  </Text>

                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={18}
                    color="#A8B6C9"
                  />
                </Pressable>
              </View>
            </View>

            <Text style={styles.filterLabel}>Search text</Text>

            <TextInput
              value={groupSearch}
              onChangeText={setGroupSearch}
              placeholder="Group code or name..."
              placeholderTextColor="#718096"
              style={styles.filterInput}
              returnKeyType="search"
              onSubmitEditing={applyGroupFilters}
            />

            <View style={styles.filterRow}>
              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Min amount</Text>

                <View style={[styles.filterInput, styles.disabledFilter]}>
                  <Text style={styles.disabledFilterText}>Not used</Text>
                </View>
              </View>

              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Max amount</Text>

                <View style={[styles.filterInput, styles.disabledFilter]}>
                  <Text style={styles.disabledFilterText}>Not used</Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={applyGroupFilters}
              style={({ pressed }) => [
                styles.applyFilterButton,

                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="filter-outline"
                size={18}
                color="#F1F5F9"
              />

              <Text style={styles.applyFilterButtonText}>Apply filters</Text>
            </Pressable>
          </View>

          <View style={styles.divider} />

          {filteredAccountTypes.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="folder-outline"
                size={30}
                color="#718096"
              />

              <Text style={styles.emptyTitle}>No account groups</Text>

              <Text style={styles.emptyText}>
                No account groups match the current filters.
              </Text>
            </View>
          ) : (
            <View style={styles.cardList}>
              {filteredAccountTypes.map(item => (
                <View key={String(item.id)} style={styles.dataCard}>
                  <View style={styles.dataCardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dataCardTitle}>
                        {item?.name || 'Account group'}
                      </Text>

                      <Text style={styles.dataCardCode}>
                        {item?.code || '-'}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.typeBadge,
                        item?.is_system
                          ? styles.systemBadge
                          : styles.customBadge,
                      ]}
                    >
                      <Text style={styles.typeBadgeText}>
                        {item?.is_system ? 'SYSTEM' : 'CUSTOM'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dataDivider} />

                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoItemLabel}>Category</Text>

                      <Text style={styles.infoItemValue}>
                        {item?.category || '-'}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoItemLabel}>Normal side</Text>

                      <Text style={styles.infoItemValue}>
                        {formatNormalBalance(item?.normal_balance)}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoItemLabel}>Ledgers</Text>

                      <Text style={styles.infoItemValue}>
                        {Number(item?.account_count) || 0}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoItemLabel}>Created</Text>

                      <Text style={styles.infoItemValue}>
                        {formatDate(item?.created_at)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.resultCount}>
            Showing {filteredAccountTypes.length} of{' '}
            {normalizedAccountTypes.length}
          </Text>
        </View>
      </>
    );
  }

  function renderLedgerAccounts() {
    return (
      <>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Create ledger account</Text>

          <Text style={styles.sectionDescription}>
            Every posting should point to a real ledger account. Use a parent
            ledger only when you want a subgroup.
          </Text>

          <Pressable
            onPress={() => setCreateLedgerVisible(true)}
            style={({ pressed }) => [
              styles.primaryButton,

              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />

            <Text style={styles.primaryButtonText}>Create ledger account</Text>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ledger accounts</Text>

          <Text style={styles.sectionDescription}>
            This is your working chart of accounts with current balances.
          </Text>

          <View style={styles.ledgerFilterSection}>
            <Pressable
              onPress={applyLedgerLastSevenDays}
              style={({ pressed }) => [
                styles.lastSevenButton,

                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="calendar-range"
                size={17}
                color="#DCE7F5"
              />

              <Text style={styles.lastSevenText}>Last 7 days</Text>
            </Pressable>

            <View style={styles.filterRow}>
              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Date from</Text>

                <Pressable
                  onPress={() => openLedgerCalendar('from')}
                  style={styles.dateButton}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDisplayDate(ledgerDateFrom)}
                  </Text>

                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={18}
                    color="#A8B6C9"
                  />
                </Pressable>
              </View>

              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Date to</Text>

                <Pressable
                  onPress={() => openLedgerCalendar('to')}
                  style={styles.dateButton}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDisplayDate(ledgerDateTo)}
                  </Text>

                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={18}
                    color="#A8B6C9"
                  />
                </Pressable>
              </View>
            </View>

            <Text style={styles.filterLabel}>Search text</Text>

            <TextInput
              value={ledgerSearch}
              onChangeText={setLedgerSearch}
              placeholder="Code, name, parent, group..."
              placeholderTextColor="#718096"
              style={styles.filterInput}
              returnKeyType="search"
              onSubmitEditing={applyLedgerFilters}
            />

            <View style={styles.filterRow}>
              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Min amount</Text>

                <TextInput
                  value={ledgerMinBalance}
                  onChangeText={setLedgerMinBalance}
                  keyboardType="decimal-pad"
                  placeholder="Balance min"
                  placeholderTextColor="#718096"
                  style={styles.filterInputNoMargin}
                />
              </View>

              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Max amount</Text>

                <TextInput
                  value={ledgerMaxBalance}
                  onChangeText={setLedgerMaxBalance}
                  keyboardType="decimal-pad"
                  placeholder="Balance max"
                  placeholderTextColor="#718096"
                  style={styles.filterInputNoMargin}
                />
              </View>
            </View>

            <Pressable
              onPress={applyLedgerFilters}
              style={({ pressed }) => [
                styles.applyFilterButton,

                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="filter-outline"
                size={18}
                color="#F1F5F9"
              />

              <Text style={styles.applyFilterButtonText}>Apply filters</Text>
            </Pressable>
          </View>

          <View style={styles.divider} />

          {filteredAccounts.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="book-open-outline"
                size={30}
                color="#718096"
              />

              <Text style={styles.emptyTitle}>No ledger accounts</Text>

              <Text style={styles.emptyText}>
                No ledger accounts match the current filters.
              </Text>
            </View>
          ) : (
            <View style={styles.cardList}>
              {filteredAccounts.map(item => (
                <View key={String(item.id)} style={styles.dataCard}>
                  <View style={styles.dataCardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dataCardTitle}>
                        {item?.code
                          ? `${item.code} - ${item.name}`
                          : item?.name || 'Ledger account'}
                      </Text>

                      <Text style={styles.dataCardCode}>
                        {item?.account_type || '-'}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.activeBadge,

                        item?.is_active === false && styles.inactiveBadge,
                      ]}
                    >
                      <Text style={styles.typeBadgeText}>
                        {item?.is_active === false ? 'INACTIVE' : 'ACTIVE'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dataDivider} />

                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoItemLabel}>Group</Text>

                      <Text style={styles.infoItemValue}>
                        {item?.account_type || '-'}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoItemLabel}>Parent</Text>

                      <Text style={styles.infoItemValue}>
                        {item?.parent_account || '-'}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoItemLabel}>Balance</Text>

                      <Text style={styles.infoItemValue}>
                        {financeSettings?.currency_symbol || '₹'}
                        {Number(item?.balance || 0).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoItemLabel}>Posting</Text>

                      <Text style={styles.infoItemValue}>
                        {item?.allows_posting ? 'Allowed' : 'Not allowed'}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoItemLabel}>Created</Text>

                      <Text style={styles.infoItemValue}>
                        {formatDate(item?.created_at)}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoItemLabel}>Type</Text>

                      <Text style={styles.infoItemValue}>
                        {item?.is_system ? 'System' : 'Custom'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.resultCount}>
            Showing {filteredAccounts.length} of {normalizedAccounts.length}
          </Text>
        </View>
      </>
    );
  }

  function renderRegistrations() {
    return (
      <>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Registration tools</Text>

          <Text style={styles.sectionDescription}>
            Launch the registration you need from here.
          </Text>

          <View style={styles.registrationActions}>
            <Pressable
              onPress={() => openRegistrationModal('counterparty')}
              style={({ pressed }) => [
                styles.registrationActionButton,

                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="account-plus-outline"
                size={17}
                color="#FFFFFF"
              />

              <Text style={styles.registrationActionText}>
                Register counterparty
              </Text>
            </Pressable>

            <Pressable
              onPress={() => openRegistrationModal('creditor_vendor')}
              style={({ pressed }) => [
                styles.registrationActionButton,

                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="account-cash-outline"
                size={17}
                color="#FFFFFF"
              />

              <Text style={styles.registrationActionText}>
                Register creditor / vendor
              </Text>
            </Pressable>

            <Pressable
              onPress={() => openRegistrationModal('vendor')}
              style={({ pressed }) => [
                styles.registrationActionButton,

                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="store-plus-outline"
                size={17}
                color="#FFFFFF"
              />

              <Text style={styles.registrationActionText}>Create vendor</Text>
            </Pressable>

            <Pressable
              onPress={() => openRegistrationModal('bank')}
              style={({ pressed }) => [
                styles.registrationActionButton,

                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="bank-plus"
                size={17}
                color="#FFFFFF"
              />

              <Text style={styles.registrationActionText}>Register bank</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent registrations</Text>

          <Text style={styles.sectionDescription}>
            Shows debtor, creditor, vendor, and bank registrations.
          </Text>

          <Text style={styles.filterLabel}>Search text</Text>

          <TextInput
            value={registrationSearch}
            onChangeText={setRegistrationSearch}
            placeholder="Type, name, email, phone"
            placeholderTextColor="#718096"
            style={styles.filterInput}
            returnKeyType="search"
            onSubmitEditing={applyRegistrationFilters}
          />

          <Pressable
            onPress={applyRegistrationFilters}
            style={({ pressed }) => [
              styles.applyFilterButton,

              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons
              name="filter-outline"
              size={18}
              color="#F1F5F9"
            />

            <Text style={styles.applyFilterButtonText}>Apply filters</Text>
          </Pressable>

          <View style={styles.divider} />

          {filteredRegistrations.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="account-search-outline"
                size={30}
                color="#718096"
              />

              <Text style={styles.emptyTitle}>No registrations</Text>

              <Text style={styles.emptyText}>
                No registrations match the current filters.
              </Text>
            </View>
          ) : (
            <View style={styles.cardList}>
              {filteredRegistrations.map((item, index) => (
                <View key={String(item?.id ?? index)} style={styles.dataCard}>
                  <View style={styles.dataCardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dataCardTitle}>
                        {item?.name || item?.display_name || 'Registration'}
                      </Text>

                      <Text style={styles.dataCardCode}>
                        {item?.type || item?.registration_type || '-'}
                      </Text>
                    </View>

                    <View style={styles.registrationStatusBadge}>
                      <Text style={styles.typeBadgeText}>
                        {String(item?.status || 'ACTIVE').toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dataDivider} />

                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoItemLabel}>Created</Text>

                      <Text style={styles.infoItemValue}>
                        {formatDate(item?.created_at)}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoItemLabel}>Balance</Text>

                      <Text style={styles.infoItemValue}>
                        {financeSettings?.currency_symbol || '₹'}
                        {Number(item?.balance || 0).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoItemLabel}>Email</Text>

                      <Text numberOfLines={1} style={styles.infoItemValue}>
                        {item?.email || '-'}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoItemLabel}>Phone</Text>

                      <Text style={styles.infoItemValue}>
                        {item?.phone || '-'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.resultCount}>
            Showing {filteredRegistrations.length} of{' '}
            {normalizedRegistrations.length}
          </Text>
        </View>
      </>
    );
  }

  function renderFinanceSettings() {
    return (
      <>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Finance settings</Text>

          <Text style={styles.sectionDescription}>
            Save the basic controls your organization will use daily.
          </Text>

          <Pressable
            onPress={() => setFinanceSettingsVisible(true)}
            style={({ pressed }) => [
              styles.primaryButton,

              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons
              name="cog-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.primaryButtonText}>Edit finance settings</Text>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Saved settings snapshot</Text>

          <Text style={styles.sectionDescription}>
            Settings are not daily transactions, so this list shows the current
            saved values instead.
          </Text>

          <Text style={styles.filterLabel}>Search text</Text>

          <TextInput
            value={financeSearch}
            onChangeText={setFinanceSearch}
            placeholder="Setting name or value"
            placeholderTextColor="#718096"
            style={styles.filterInput}
            returnKeyType="search"
            onSubmitEditing={applyFinanceFilters}
          />

          <Pressable
            onPress={applyFinanceFilters}
            style={({ pressed }) => [
              styles.applyFilterButton,

              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons
              name="filter-outline"
              size={18}
              color="#F1F5F9"
            />

            <Text style={styles.applyFilterButtonText}>Apply filters</Text>
          </Pressable>

          <View style={styles.divider} />

          {filteredSettingsRows.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="cog-off-outline"
                size={30}
                color="#718096"
              />

              <Text style={styles.emptyTitle}>No settings found</Text>

              <Text style={styles.emptyText}>
                No finance settings match the current search.
              </Text>
            </View>
          ) : (
            <View style={styles.financeSettingsList}>
              {filteredSettingsRows.map(item => (
                <View key={item.key} style={styles.financeSettingCard}>
                  <Text style={styles.financeSettingLabel}>{item.label}</Text>

                  <Text style={styles.financeSettingValue}>
                    {String(item.value)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.resultCount}>
            Showing {filteredSettingsRows.length} of {settingsRows.length}
          </Text>
        </View>
      </>
    );
  }

  function renderRoleAssignments() {
    return (
      <FinanceRoleAssignmentSection
        roleAssignments={roleAssignments}
        onRoleAssignmentsChange={onRoleAssignmentsChange}
      />
    );
  }

  function renderActiveSection() {
    switch (activeSection) {
      case 'account_groups':
        return renderAccountGroups();

      case 'ledger_accounts':
        return renderLedgerAccounts();

      case 'registrations':
        return renderRegistrations();

      case 'finance_settings':
        return renderFinanceSettings();

      case 'role_assignment':
        return renderRoleAssignments();

      default:
        return null;
    }
  }

  return (
    <>
      <View style={styles.areaContent}>
        <View style={styles.secondaryTabs}>
          {TABS.map(item => {
            const active = activeSection === item.key;

            return (
              <Pressable
                key={item.key}
                onPress={() => setActiveSection(item.key)}
                style={[
                  styles.secondaryTab,

                  active && styles.secondaryTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.secondaryTabText,

                    active && styles.secondaryTabTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {renderActiveSection()}
      </View>

      <CreateAccountGroupModal
        visible={createGroupVisible}
        submitting={creatingGroup}
        onClose={() => {
          if (!creatingGroup) {
            setCreateGroupVisible(false);
          }
        }}
        onSubmit={handleCreateAccountGroup}
      />

      <CreateLedgerAccountModal
        visible={createLedgerVisible}
        accountTypes={normalizedAccountTypes}
        accounts={normalizedAccounts}
        submitting={creatingLedger}
        onClose={() => {
          if (!creatingLedger) {
            setCreateLedgerVisible(false);
          }
        }}
        onSubmit={handleCreateLedgerAccount}
      />

      <RegistrationFormModal
        visible={registrationModalMode === 'counterparty'}
        mode="counterparty"
        submitting={registrationSubmitting}
        onClose={closeRegistrationModal}
        onSubmit={handlePostCounterparty}
      />

      <RegistrationFormModal
        visible={registrationModalMode === 'creditor_vendor'}
        mode="creditor_vendor"
        submitting={registrationSubmitting}
        onClose={closeRegistrationModal}
        onSubmit={handlePostCreditorVendor}
      />

      <RegistrationFormModal
        visible={registrationModalMode === 'vendor'}
        mode="vendor"
        submitting={registrationSubmitting}
        onClose={closeRegistrationModal}
        onSubmit={handlePostVendor}
      />

      <RegistrationFormModal
        visible={registrationModalMode === 'bank'}
        mode="bank"
        submitting={registrationSubmitting}
        onClose={closeRegistrationModal}
        onSubmit={handlePostBank}
      />

      <EditFinanceSettingsModal
        visible={financeSettingsVisible}
        settings={financeSettings}
        submitting={savingFinanceSettings}
        reloading={reloadingFinanceSettings}
        onClose={() => {
          if (!savingFinanceSettings && !reloadingFinanceSettings) {
            setFinanceSettingsVisible(false);
          }
        }}
        onReload={handleReloadFinanceSettings}
        onSubmit={handlePostFinanceSettings}
      />

      <DatePickerModal
        visible={groupCalendarVisible}
        title="Select Date"
        subtitle={
          groupCalendarTarget === 'from'
            ? 'Select starting date'
            : 'Select ending date'
        }
        selectedDate={
          groupCalendarTarget === 'from' ? groupDateFrom : groupDateTo
        }
        minDate={
          groupCalendarTarget === 'to' ? groupDateFrom || undefined : undefined
        }
        maxDate={
          groupCalendarTarget === 'from' ? groupDateTo || undefined : undefined
        }
        onClose={closeGroupCalendar}
        onDayPress={handleGroupCalendarDayPress}
      />

      <DatePickerModal
        visible={ledgerCalendarVisible}
        title="Select Date"
        subtitle={
          ledgerCalendarTarget === 'from'
            ? 'Select starting date'
            : 'Select ending date'
        }
        selectedDate={
          ledgerCalendarTarget === 'from' ? ledgerDateFrom : ledgerDateTo
        }
        minDate={
          ledgerCalendarTarget === 'to'
            ? ledgerDateFrom || undefined
            : undefined
        }
        maxDate={
          ledgerCalendarTarget === 'from'
            ? ledgerDateTo || undefined
            : undefined
        }
        onClose={closeLedgerCalendar}
        onDayPress={handleLedgerCalendarDayPress}
      />
    </>
  );
}
