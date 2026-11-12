// src/screens/Admin/Accounts/AdminAccounts.js

import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../api/client';

import styles from './AdminAccounts.styles';

import AccountsHelpModal from './modals/AccountsHelpModal';
import AccountsReceivableTab from './tabs/AccountsReceivableTab';
import AccountsPayableTab from './tabs/AccountsPayableTab';
import BankAndJournalTab from './tabs/BankAndJournalTab';
import FinanceSettingsTab from './tabs/FinanceSettingsTab';
import ReportsTab from './tabs/ReportsTab';

import {
  formatMoney,
  safeItems,
  getSettledValue,
} from './utils/accountsHelpers';

const BASE = '/api/plugins/financial-accounting';

const AREA_OPTIONS = [
  {
    key: 'receivables',
    label: 'Accounts Receivable',
  },
  {
    key: 'payables',
    label: 'Accounts Payable',
  },
  {
    key: 'bank',
    label: 'Bank and Journal',
  },
  {
    key: 'settings',
    label: 'Finance Settings',
  },
  {
    key: 'reports',
    label: 'Reports',
  },
];

function SummaryCard({ icon, title, description }) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryIcon}>
        <MaterialCommunityIcons name={icon} size={21} color="#7DD3FC" />
      </View>

      <Text style={styles.summaryTitle}>{title}</Text>

      <Text style={styles.summaryDescription}>{description}</Text>
    </View>
  );
}

function EmptyCard({ icon = 'inbox-outline', title, description }) {
  return (
    <View style={styles.emptyCard}>
      <MaterialCommunityIcons name={icon} size={30} color="#718096" />

      <Text style={styles.emptyTitle}>{title}</Text>

      {!!description && <Text style={styles.emptyText}>{description}</Text>}
    </View>
  );
}

export default function AdminAccounts() {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [helpVisible, setHelpVisible] = useState(false);

  const [me, setMe] = useState(null);

  const [onboarding, setOnboarding] = useState(null);

  const [accountTypes, setAccountTypes] = useState([]);

  const [accounts, setAccounts] = useState([]);

  const [financeSettings, setFinanceSettings] = useState(null);

  const [receipts, setReceipts] = useState([]);

  const [vendors, setVendors] = useState([]);

  const [payables, setPayables] = useState({
    items: [],
    outstanding_total: 0,
  });

  const [paymentVouchers, setPaymentVouchers] = useState([]);

  const [bankBook, setBankBook] = useState({
    balance: 0,
    entries: [],
    unreconciled: [],
  });

  const [journals, setJournals] = useState([]);

  const [receivables, setReceivables] = useState({
    items: [],
    outstanding_total: 0,
  });

  const [roleAssignments, setRoleAssignments] = useState({
    items: [],
    roles: [],
    available_core_roles: [],
    meta: {},
  });

  const [bills, setBills] = useState([]);

  /*
   * Accounts Payable is selected by default,
   * matching the web screen.
   */
  const [activeArea, setActiveArea] = useState('payables');

  const loadWorkspace = useCallback(async ({ refresh = false } = {}) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const responses = await Promise.allSettled([
        api('/api/me'),

        api('/api/settings/v1/onboarding'),

        api(`${BASE}/account-types`),

        api(`${BASE}/accounts`),

        api(`${BASE}/settings`),

        api(`${BASE}/receipts`),

        api(`${BASE}/vendors`),

        api(`${BASE}/payables`),

        api(`${BASE}/payment-vouchers`),

        api(`${BASE}/books/bank`),

        api(`${BASE}/journals`),

        api(`${BASE}/receivables`),

        api(`${BASE}/settings/role-assignments`),

        api(`${BASE}/bills/search?limit=20`),
      ]);

      const [
        meResult,
        onboardingResult,
        accountTypesResult,
        accountsResult,
        settingsResult,
        receiptsResult,
        vendorsResult,
        payablesResult,
        vouchersResult,
        bankResult,
        journalsResult,
        receivablesResult,
        rolesResult,
        billsResult,
      ] = responses;

      const nextMe = getSettledValue(meResult, null);

      const isAdmin =
        nextMe?.is_admin === true ||
        nextMe?.is_super_admin === true ||
        ['admin', 'super_admin'].includes(
          String(
            nextMe?.actual_primary_role ||
              nextMe?.primary_role ||
              nextMe?.role ||
              '',
          ).toLowerCase(),
        );

      if (nextMe && !isAdmin) {
        Alert.alert(
          'Accounts',
          'You do not have access to the financial accounting workspace.',
        );
      }

      setMe(nextMe);

      setOnboarding(getSettledValue(onboardingResult, null));

      setAccountTypes(safeItems(getSettledValue(accountTypesResult, {})));

      setAccounts(safeItems(getSettledValue(accountsResult, {})));

      const settingsResponse = getSettledValue(settingsResult, {});

      setFinanceSettings(settingsResponse?.settings || null);

      setReceipts(safeItems(getSettledValue(receiptsResult, {})));

      setVendors(safeItems(getSettledValue(vendorsResult, {})));

      const payablesResponse = getSettledValue(payablesResult, {});

      setPayables({
        items: safeItems(payablesResponse),

        outstanding_total: Number(payablesResponse?.outstanding_total) || 0,
      });

      setPaymentVouchers(safeItems(getSettledValue(vouchersResult, {})));

      const bankResponse = getSettledValue(bankResult, {});

      setBankBook({
        balance: Number(bankResponse?.balance) || 0,

        entries: Array.isArray(bankResponse?.entries)
          ? bankResponse.entries
          : [],

        unreconciled: Array.isArray(bankResponse?.unreconciled)
          ? bankResponse.unreconciled
          : [],
      });

      setJournals(safeItems(getSettledValue(journalsResult, {})));

      const receivablesResponse = getSettledValue(receivablesResult, {});

      setReceivables({
        items: safeItems(receivablesResponse),

        outstanding_total: Number(receivablesResponse?.outstanding_total) || 0,
      });

      const rolesResponse = getSettledValue(rolesResult, {});

      setRoleAssignments({
        items: Array.isArray(rolesResponse?.items) ? rolesResponse.items : [],

        roles: Array.isArray(rolesResponse?.roles) ? rolesResponse.roles : [],

        available_core_roles: Array.isArray(rolesResponse?.available_core_roles)
          ? rolesResponse.available_core_roles
          : [],

        meta: rolesResponse?.meta || {},
      });

      setBills(safeItems(getSettledValue(billsResult, {})));
    } catch (error) {
      console.log('Accounts workspace load error:', error);

      Alert.alert(
        'Accounts',
        error?.message || 'Could not load the accounts workspace.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWorkspace();

      return undefined;
    }, [loadWorkspace]),
  );

  const currencySymbol = financeSettings?.currency_symbol || '₹';

  const cashAccount = useMemo(
    () => accounts.find(item => String(item?.code) === '1200') || null,
    [accounts],
  );

  const bankAccount = useMemo(
    () => accounts.find(item => String(item?.code) === '1210') || null,
    [accounts],
  );

  function renderActiveArea() {
    switch (activeArea) {
      case 'receivables':
        return (
          <AccountsReceivableTab
            receipts={receipts}
            currencySymbol={currencySymbol}
            onReceiptsChange={setReceipts}
            onBankBookChange={setBankBook}
            onReceivablesChange={setReceivables}
            onPayablesChange={setPayables}
          />
        );

      case 'payables':
        return (
          <AccountsPayableTab
            payables={payables}
            paymentVouchers={paymentVouchers}
            vendors={vendors}
            accounts={accounts}
            currencySymbol={currencySymbol}
            onPayablesChange={setPayables}
            onPaymentVouchersChange={setPaymentVouchers}
            onBankBookChange={setBankBook}
            onAccountsChange={setAccounts}
          />
        );

      case 'bank':
        return (
          <BankAndJournalTab
            bankBook={bankBook}
            journals={journals}
            accounts={accounts}
            currencySymbol={currencySymbol}
            onJournalsChange={setJournals}
            onBankBookChange={setBankBook}
            onAccountsChange={setAccounts}
          />
        );

      case 'settings':
        return (
          <FinanceSettingsTab
            financeSettings={financeSettings}
            accountTypes={accountTypes}
            accounts={accounts}
            roleAssignments={roleAssignments}
            onAccountTypesChange={setAccountTypes}
            onAccountsChange={setAccounts}
            onFinanceSettingsChange={setFinanceSettings}
            onReceivablesChange={setReceivables}
            onPayablesChange={setPayables}
            onRoleAssignmentsChange={setRoleAssignments}
          />
        );

      case 'reports':
        return (
          <ReportsTab receipts={receipts} journals={journals} bills={bills} />
        );

      default:
        return null;
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading accounts workspace...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 4),
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadWorkspace({
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
      >
        {/* Workspace header */}
        <View style={styles.workspaceCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextArea}>
              <Text style={styles.eyebrow}>FINANCIAL ACCOUNTING</Text>

              <Text style={styles.workspaceTitle}>Accounts workspace</Text>

              <Text style={styles.workspaceSubtitle}>
                {onboarding?.organization?.school_name || 'Finance workspace'}
              </Text>
            </View>

            <Pressable
              onPress={() => setHelpVisible(true)}
              style={({ pressed }) => [
                styles.helpButton,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons name="help" size={21} color="#F1F5F9" />
            </Pressable>
          </View>

          <View style={styles.summaryGrid}>
            <SummaryCard
              icon="account-cash-outline"
              title={`Receivables: ${formatMoney(
                receivables.outstanding_total,
                currencySymbol,
              )}`}
              description={`${receivables.items.length} receivable item(s) currently visible.`}
            />

            <SummaryCard
              icon="cash-minus"
              title={`Payables: ${formatMoney(
                payables.outstanding_total,
                currencySymbol,
              )}`}
              description={`${payables.items.length} payable item(s) currently visible.`}
            />

            <SummaryCard
              icon="cash"
              title={`Cash: ${formatMoney(
                cashAccount?.balance,
                currencySymbol,
              )}`}
              description={
                cashAccount
                  ? `Ledger ${cashAccount.code} ${cashAccount.name}.`
                  : 'Cash ledger not available.'
              }
            />

            <SummaryCard
              icon="bank-outline"
              title={`Bank: ${formatMoney(
                bankAccount?.balance ?? bankBook.balance,
                currencySymbol,
              )}`}
              description={
                bankAccount
                  ? `Ledger ${bankAccount.code} ${bankAccount.name}.`
                  : 'Bank ledger not available.'
              }
            />

            <SummaryCard
              icon="chart-box-outline"
              title="Reports ready"
              description="Run a report in the Reports section to inspect balances."
            />
          </View>
        </View>

        {/* Browse by function */}
        <View style={styles.functionCard}>
          <Text style={styles.eyebrow}>BROWSE BY FUNCTION</Text>

          <Text style={styles.functionHint}>
            Choose an area first, then the task inside it.
          </Text>

          <View style={styles.functionTabs}>
            {AREA_OPTIONS.map(item => {
              const selected = activeArea === item.key;

              return (
                <Pressable
                  key={item.key}
                  onPress={() => setActiveArea(item.key)}
                  style={[
                    styles.functionTab,
                    selected && styles.functionTabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.functionTabText,
                      selected && styles.functionTabTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {renderActiveArea()}
      </ScrollView>

      {/* Help modal */}
      <AccountsHelpModal
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
      />
    </View>
  );
}
