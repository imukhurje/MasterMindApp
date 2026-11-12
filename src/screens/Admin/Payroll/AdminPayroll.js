// src/screens/Admin/Payroll/AdminPayroll.js

import React, { useCallback, useMemo, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api, absoluteUrl, getToken } from '../../../api/client';

import ReactNativeBlobUtil from 'react-native-blob-util';

import SalaryCalculationTab from './tabs/SalaryCalculationTab';
import StaffAdvanceTab from './tabs/StaffAdvanceTab';
import PayrollSettingsTab from './tabs/PayrollSettingsTab';
import RepaymentAdjustmentModal from './modals/RepaymentAdjustmentModal';
import NewAdvanceModal from './modals/NewAdvanceModal';
import SalaryCalculationModal from './modals/SalaryCalculationModal';
import PayrollRunReviewModal from './modals/PayrollRunReviewModal';

import styles from './AdminPayroll.styles';

const BASE = '/api/plugins/financial-accounting/simplified-payroll';

const MAIN_TABS = [
  {
    key: 'salary_calculation',
    label: 'Salary Calculation',
  },
  {
    key: 'staff_advance',
    label: 'Staff-wise Advance',
  },
  {
    key: 'settings',
    label: 'Settings',
  },
];

const SETTINGS_TABS = [
  {
    key: 'heads',
    label: 'Salary Heads',
  },
  {
    key: 'staff_salary',
    label: 'Staff Salary',
  },
  {
    key: 'general',
    label: 'General',
  },
];

function getSettledValue(result, fallback) {
  return result?.status === 'fulfilled' ? result.value : fallback;
}

function formatMoney(value, symbol = '₹') {
  const amount = Number(value) || 0;

  return `${symbol}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function AdminPayroll({ navigation }) {
  const insets = useSafeAreaInsets();

  /*
   * Screenshot currently shows Settings active,
   * so Settings is the default tab.
   */
  const [activeArea, setActiveArea] = useState('settings');

  const [settingsSection, setSettingsSection] = useState('heads');

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [me, setMe] = useState(null);

  const [onboarding, setOnboarding] = useState(null);

  const [savingStaffSalarySetting, setSavingStaffSalarySetting] =
    useState(false);

  const [savingPayrollSchedule, setSavingPayrollSchedule] = useState(false);

  const [savingAdvanceMapping, setSavingAdvanceMapping] = useState(false);

  const [payrollSettings, setPayrollSettings] = useState({
    heads: [],
    staff: [],
    settings: [],
    general: null,
  });

  const [advancesData, setAdvancesData] = useState({
    staff: [],
    advances: [],
    balances: [],
    net_pay: null,
    account_mapping: null,
    asset_accounts: [],
    bank_accounts: [],
    payment_accounts: [],
    currency_symbol: '₹',
  });

  const [selectedStaffAdvanceData, setSelectedStaffAdvanceData] =
    useState(null);

  const [calculationsData, setCalculationsData] = useState({
    staff: [],
    calculations: [],
    eligible_period: null,
    completed_run: null,
  });

  const [selectedAdvanceStaffId, setSelectedAdvanceStaffId] = useState(null);

  const [loadingStaffAdvance, setLoadingStaffAdvance] = useState(false);

  const [loadingCalculations, setLoadingCalculations] = useState(false);

  const [repaymentAdvanceId, setRepaymentAdvanceId] = useState(null);

  const [savingRepaymentAdjustment, setSavingRepaymentAdjustment] =
    useState(false);

  const [newAdvanceVisible, setNewAdvanceVisible] = useState(false);

  const [creatingAdvance, setCreatingAdvance] = useState(false);

  const [downloadingPayslipId, setDownloadingPayslipId] = useState(null);

  const [editingCalculation, setEditingCalculation] = useState(null);

  const [savingCalculationDraft, setSavingCalculationDraft] = useState(false);

  const [settlingCalculation, setSettlingCalculation] = useState(false);

  const [payrollRunReviewVisible, setPayrollRunReviewVisible] = useState(false);

  const [loadingPayrollRunReview, setLoadingPayrollRunReview] = useState(false);

  const [payrollRunReviewData, setPayrollRunReviewData] = useState(null);

  const selectedStaffIdRef = useRef(null);

  const loadSelectedStaffAdvance = useCallback(async userId => {
    const numericUserId = Number(userId);

    if (!Number.isFinite(numericUserId)) {
      setSelectedStaffAdvanceData(null);

      return null;
    }

    try {
      setLoadingStaffAdvance(true);

      const response = await api(`${BASE}/advances?user_id=${numericUserId}`, {
        method: 'GET',
      });

      setSelectedStaffAdvanceData(response || null);

      return response;
    } catch (error) {
      console.log('Selected staff advance error:', error);

      Alert.alert(
        'Staff Advance',
        error?.message || 'Could not load staff advance details.',
      );

      return null;
    } finally {
      setLoadingStaffAdvance(false);
    }
  }, []);

  const loadWorkspace = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        /*
         * Main initial API calls.
         */
        const responses = await Promise.allSettled([
          api('/api/me', {
            method: 'GET',
          }),

          api('/api/settings/v1/onboarding', {
            method: 'GET',
          }),

          api(`${BASE}/settings`, {
            method: 'GET',
          }),

          api(`${BASE}/advances`, {
            method: 'GET',
          }),

          api(`${BASE}/calculations`, {
            method: 'GET',
          }),
        ]);

        const meResponse = getSettledValue(responses[0], null);

        const onboardingResponse = getSettledValue(responses[1], null);

        const settingsResponse = getSettledValue(responses[2], null);

        const advancesResponse = getSettledValue(responses[3], null);

        const calculationsResponse = getSettledValue(responses[4], null);

        setMe(meResponse);

        setOnboarding(onboardingResponse);

        setPayrollSettings({
          heads: Array.isArray(settingsResponse?.heads)
            ? settingsResponse.heads
            : [],

          staff: Array.isArray(settingsResponse?.staff)
            ? settingsResponse.staff
            : [],

          settings: Array.isArray(settingsResponse?.settings)
            ? settingsResponse.settings
            : [],

          general: settingsResponse?.general || null,
        });

        setAdvancesData({
          staff: Array.isArray(advancesResponse?.staff)
            ? advancesResponse.staff
            : [],

          advances: Array.isArray(advancesResponse?.advances)
            ? advancesResponse.advances
            : [],

          balances: Array.isArray(advancesResponse?.balances)
            ? advancesResponse.balances
            : [],

          net_pay: advancesResponse?.net_pay || null,

          account_mapping: advancesResponse?.account_mapping || null,

          asset_accounts: Array.isArray(advancesResponse?.asset_accounts)
            ? advancesResponse.asset_accounts
            : [],

          bank_accounts: Array.isArray(advancesResponse?.bank_accounts)
            ? advancesResponse.bank_accounts
            : [],

          payment_accounts: Array.isArray(advancesResponse?.payment_accounts)
            ? advancesResponse.payment_accounts
            : [],

          currency_symbol: advancesResponse?.currency_symbol || '₹',
        });

        setCalculationsData({
          staff: Array.isArray(calculationsResponse?.staff)
            ? calculationsResponse.staff
            : [],

          calculations: Array.isArray(calculationsResponse?.calculations)
            ? calculationsResponse.calculations
            : [],

          eligible_period: calculationsResponse?.eligible_period || null,

          completed_run: calculationsResponse?.completed_run || null,
        });

        /*
         * The current API response has Dipak Mondal
         * as the first staff member with id 8.
         *
         * Do not hardcode 8. Use the selected staff
         * or the first available staff dynamically.
         */
        const firstStaffId =
          Number(
            settingsResponse?.staff?.[0]?.id ||
              advancesResponse?.staff?.[0]?.id,
          ) || null;

        const targetStaffId = selectedStaffIdRef.current || firstStaffId;

        if (targetStaffId) {
          selectedStaffIdRef.current = targetStaffId;

          setSelectedAdvanceStaffId(targetStaffId);

          /*
           * This becomes:
           *
           * /advances?user_id=8
           *
           * with the current sample response.
           */
          await loadSelectedStaffAdvance(targetStaffId);
        }
      } catch (error) {
        console.log('Payroll workspace error:', error);

        Alert.alert(
          'Payroll',
          error?.message || 'Could not load payroll data.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loadSelectedStaffAdvance],
  );

  const reloadCalculations = useCallback(async () => {
    const response = await api(`${BASE}/calculations`, {
      method: 'GET',
    });

    const nextData = {
      staff: Array.isArray(response?.staff) ? response.staff : [],

      calculations: Array.isArray(response?.calculations)
        ? response.calculations
        : [],

      eligible_period: response?.eligible_period || null,

      completed_run: response?.completed_run || null,
    };

    setCalculationsData(nextData);

    return response;
  }, []);

  const handlePreviewSalaryCalculation = useCallback(async payload => {
    return api(`${BASE}/calculations/preview`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(payload),
    });
  }, []);

  const loadPayrollRunReview = useCallback(async () => {
    try {
      setLoadingPayrollRunReview(true);

      const response = await api(`${BASE}/runs/review`, {
        method: 'GET',
      });

      if (response?.ok === false) {
        throw new Error(
          response?.message || 'Could not load payroll run review.',
        );
      }

      setPayrollRunReviewData({
        period: response?.period || null,
        rows: Array.isArray(response?.rows) ? response.rows : [],
      });

      return response;
    } catch (error) {
      console.log('Payroll run review error:', error);

      Alert.alert(
        'Payroll Run Review',
        error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          'Could not load payroll run review.',
      );

      return null;
    } finally {
      setLoadingPayrollRunReview(false);
    }
  }, []);

  const handleOpenPayrollRunReview = useCallback(async () => {
    setPayrollRunReviewVisible(true);

    await loadPayrollRunReview();
  }, [loadPayrollRunReview]);

  const handleSaveCalculationDraft = useCallback(
    async payload => {
      if (savingCalculationDraft) {
        return null;
      }

      try {
        setSavingCalculationDraft(true);

        const response = await api(`${BASE}/calculations/draft`, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        });

        if (response?.ok === false) {
          throw new Error(
            response?.message || 'Could not save salary calculation draft.',
          );
        }

        await reloadCalculations();

        if (response?.calculation) {
          setEditingCalculation(response.calculation);
        }

        return response?.calculation || null;
      } catch (error) {
        console.log('Save salary calculation draft error:', error);

        throw error;
      } finally {
        setSavingCalculationDraft(false);
      }
    },
    [savingCalculationDraft, reloadCalculations],
  );

  const handlePostSalarySettlement = useCallback(
    async ({ draftPayload, settlementPayload }) => {
      if (settlingCalculation) {
        return null;
      }

      try {
        setSettlingCalculation(true);

        /*
         * Step 1:
         * Save/update the draft first.
         */
        const draftResponse = await api(`${BASE}/calculations/draft`, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(draftPayload),
        });

        if (draftResponse?.ok === false) {
          throw new Error(
            draftResponse?.message ||
              'Could not save salary draft before settlement.',
          );
        }

        /*
         * Step 2:
         * Reload calculations after draft save.
         */
        const afterDraftResponse = await reloadCalculations();

        let draftCalculation = draftResponse?.calculation || null;

        /*
         * Fallback:
         * locate the calculation returned by GET
         * using employee + salary period.
         */
        if (!draftCalculation?.id) {
          const calculations = Array.isArray(afterDraftResponse?.calculations)
            ? afterDraftResponse.calculations
            : [];

          draftCalculation =
            calculations.find(item => {
              return (
                Number(item?.user_id) === Number(draftPayload.user_id) &&
                String(
                  item?.period_start || item?.calculation_month || '',
                ).slice(0, 10) ===
                  String(draftPayload.period_start || '').slice(0, 10)
              );
            }) || null;
        }

        if (!draftCalculation?.id) {
          throw new Error('The saved salary calculation could not be found.');
        }

        /*
         * Step 3:
         * Settle the saved calculation.
         */
        const settleResponse = await api(
          `${BASE}/calculations/${draftCalculation.id}/settle`,
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify(settlementPayload),
          },
        );

        if (settleResponse?.ok === false) {
          throw new Error(
            settleResponse?.message || 'Could not settle salary calculation.',
          );
        }

        const settledUserId = Number(
          settleResponse?.calculation?.user_id ||
            draftCalculation?.user_id ||
            draftPayload?.user_id,
        );

        /*
         * Step 4 + Step 5:
         * Refresh employee advances and calculations.
         *
         * Do not hardcode user_id=8.
         */
        const refreshResults = await Promise.allSettled([
          api(`${BASE}/advances?user_id=${encodeURIComponent(settledUserId)}`, {
            method: 'GET',
          }),

          reloadCalculations(),
        ]);

        const advanceRefresh =
          refreshResults[0]?.status === 'fulfilled'
            ? refreshResults[0].value
            : null;

        /*
         * Update advance panel only when that
         * employee is currently selected there.
         */
        if (
          advanceRefresh &&
          Number(selectedAdvanceStaffId) === Number(settledUserId)
        ) {
          setSelectedStaffAdvanceData(advanceRefresh);
        }

        return settleResponse?.calculation || null;
      } catch (error) {
        console.log('Post salary settlement error:', error);

        throw error;
      } finally {
        setSettlingCalculation(false);
      }
    },
    [settlingCalculation, reloadCalculations, selectedAdvanceStaffId],
  );

  useFocusEffect(
    useCallback(() => {
      loadWorkspace();
    }, [loadWorkspace]),
  );

  const handleSelectAdvanceStaff = useCallback(
    async userId => {
      const id = Number(userId);

      if (!Number.isFinite(id)) {
        return;
      }

      setRepaymentAdvanceId(null);

      selectedStaffIdRef.current = id;

      setSelectedAdvanceStaffId(id);

      await loadSelectedStaffAdvance(id);
    },
    [loadSelectedStaffAdvance],
  );

  const loadCalculations = useCallback(async () => {
    try {
      setLoadingCalculations(true);

      const response = await api(`${BASE}/calculations`, {
        method: 'GET',
      });

      if (response?.ok === false) {
        throw new Error(
          response?.message || 'Could not load salary calculations.',
        );
      }

      setCalculationsData({
        staff: Array.isArray(response?.staff) ? response.staff : [],

        calculations: Array.isArray(response?.calculations)
          ? response.calculations
          : [],

        eligible_period: response?.eligible_period || null,

        completed_run: response?.completed_run || null,
      });

      return response;
    } catch (error) {
      console.log('Salary calculations load error:', error);

      Alert.alert(
        'Salary Calculation',
        error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          'Could not load salary calculations.',
      );

      return null;
    } finally {
      setLoadingCalculations(false);
    }
  }, []);

  const handleCreateAdvance = useCallback(
    async payload => {
      if (creatingAdvance) {
        return;
      }

      if (!payload?.user_id) {
        Alert.alert('New Advance', 'Please select an employee.');
        return;
      }

      if (!payload?.amount || Number(payload.amount) <= 0) {
        Alert.alert('New Advance', 'Please enter a valid amount.');
        return;
      }

      if (!payload?.issued_on) {
        Alert.alert('New Advance', 'Please select the advance date.');
        return;
      }

      if (!payload?.disbursement_account_id) {
        Alert.alert('New Advance', 'Please select a disbursement account.');

        return;
      }

      if (!payload?.reference?.trim()) {
        Alert.alert('New Advance', 'Reference is required.');
        return;
      }

      if (
        payload?.repayment_mode === 'fixed' &&
        (!payload?.repayment_start_period ||
          Number(payload?.repayment_fixed_amount) <= 0)
      ) {
        Alert.alert(
          'New Advance',
          'First adjustment period and fixed repayment amount are required.',
        );

        return;
      }

      try {
        setCreatingAdvance(true);

        const response = await api(`${BASE}/advances`, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        });

        if (response?.ok === false) {
          throw new Error(
            response?.message || 'Could not record staff advance.',
          );
        }

        /*
         * Close the modal first.
         */
        setNewAdvanceVisible(false);

        /*
         * Keep the same employee selected after refresh.
         */
        const currentStaffId = Number(payload.user_id);

        selectedStaffIdRef.current = currentStaffId;

        setSelectedAdvanceStaffId(currentStaffId);

        /*
         * Refresh the full Payroll workspace.
         *
         * This reloads:
         * - payroll settings
         * - advances
         * - selected employee advance details
         * - calculations
         */
        await loadWorkspace({
          refresh: true,
        });

        Alert.alert('Staff Advance', 'Staff advance recorded successfully.');

        return response?.advance || null;
      } catch (error) {
        console.log('Create staff advance error:', error);

        const validationErrors =
          error?.data?.errors || error?.response?.data?.errors;

        let message =
          error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          'Could not record staff advance.';

        if (validationErrors) {
          const firstError = Object.values(validationErrors)
            .flat()
            .find(Boolean);

          if (firstError) {
            message = String(firstError);
          }
        }

        Alert.alert('Staff Advance', message);

        return null;
      } finally {
        setCreatingAdvance(false);
      }
    },
    [creatingAdvance, loadWorkspace],
  );

  const reloadPayrollSettings = useCallback(async () => {
    const response = await api(
      '/api/plugins/financial-accounting/simplified-payroll/settings',
      {
        method: 'GET',
      },
    );

    const nextPayrollSettings = {
      heads: Array.isArray(response?.heads) ? response.heads : [],

      staff: Array.isArray(response?.staff) ? response.staff : [],

      settings: Array.isArray(response?.settings) ? response.settings : [],

      general: response?.general || null,
    };

    setPayrollSettings(nextPayrollSettings);

    return nextPayrollSettings;
  }, []);

  const handleSaveRepaymentAdjustment = useCallback(
    async ({ advanceId, repaymentPeriod, amount }) => {
      if (savingRepaymentAdjustment) {
        return null;
      }

      const numericAdvanceId = Number(advanceId);

      if (!Number.isFinite(numericAdvanceId)) {
        Alert.alert('Repayment Adjustment', 'Invalid staff advance.');

        return null;
      }

      if (!repaymentPeriod) {
        Alert.alert('Repayment Adjustment', 'Repayment period is required.');

        return null;
      }

      const numericAmount = Number(amount);

      if (!Number.isFinite(numericAmount) || numericAmount < 0) {
        Alert.alert('Repayment Adjustment', 'Please enter a valid amount.');

        return null;
      }

      try {
        setSavingRepaymentAdjustment(true);

        const response = await api(
          `${BASE}/advances/${numericAdvanceId}/repayment-override`,
          {
            method: 'PUT',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              repayment_period: repaymentPeriod,
              amount: numericAmount.toFixed(2),
            }),
          },
        );

        if (response?.ok === false) {
          throw new Error(
            response?.message || 'Could not save repayment adjustment.',
          );
        }

        /*
         * Reload the currently selected employee's advances.
         *
         * Example:
         * /advances?user_id=8
         */
        if (selectedAdvanceStaffId) {
          await loadSelectedStaffAdvance(selectedAdvanceStaffId);
        }

        return response;
      } catch (error) {
        console.log('Save repayment adjustment error:', error);

        const validationErrors =
          error?.data?.errors || error?.response?.data?.errors;

        let message =
          error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          'Could not save repayment adjustment.';

        if (validationErrors) {
          const firstError = Object.values(validationErrors)
            .flat()
            .find(Boolean);

          if (firstError) {
            message = String(firstError);
          }
        }

        Alert.alert('Repayment Adjustment', message);

        return null;
      } finally {
        setSavingRepaymentAdjustment(false);
      }
    },
    [
      savingRepaymentAdjustment,
      selectedAdvanceStaffId,
      loadSelectedStaffAdvance,
    ],
  );

  const handleSavePayrollSchedule = useCallback(
    async payload => {
      if (savingPayrollSchedule) {
        return;
      }

      if (!payload?.salary_frequency || !payload?.payroll_starts_on) {
        Alert.alert(
          'Payroll Schedule',
          'Salary frequency and payroll start date are required.',
        );

        return;
      }

      try {
        setSavingPayrollSchedule(true);

        const response = await api(
          '/api/plugins/financial-accounting/simplified-payroll/settings/general',
          {
            method: 'PUT',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              salary_frequency: payload.salary_frequency,

              payroll_starts_on: payload.payroll_starts_on,
            }),
          },
        );

        if (response?.ok === false) {
          throw new Error(
            response?.message || 'Could not save payroll schedule.',
          );
        }

        /*
         * Reload payroll settings because the backend
         * returns the updated general configuration here.
         */
        await reloadPayrollSettings();

        /*
         * Payroll schedule affects eligible calculation
         * periods, so calculations should also be refreshed.
         */
        const calculationsResponse = await api(
          '/api/plugins/financial-accounting/simplified-payroll/calculations',
          {
            method: 'GET',
          },
        );

        setCalculationsData({
          staff: Array.isArray(calculationsResponse?.staff)
            ? calculationsResponse.staff
            : [],

          calculations: Array.isArray(calculationsResponse?.calculations)
            ? calculationsResponse.calculations
            : [],

          eligible_period: calculationsResponse?.eligible_period || null,

          completed_run: calculationsResponse?.completed_run || null,
        });

        Alert.alert('Payroll Schedule', 'Payroll schedule saved successfully.');

        return response?.general || null;
      } catch (error) {
        console.log('Save payroll schedule error:', error);

        const validationErrors =
          error?.data?.errors || error?.response?.data?.errors;

        let message =
          error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          'Could not save payroll schedule.';

        if (validationErrors) {
          const firstError = Object.values(validationErrors)
            .flat()
            .find(Boolean);

          if (firstError) {
            message = String(firstError);
          }
        }

        Alert.alert('Payroll Schedule', message);

        return null;
      } finally {
        setSavingPayrollSchedule(false);
      }
    },
    [savingPayrollSchedule, reloadPayrollSettings],
  );

  const handleSaveAdvanceMapping = useCallback(
    async payload => {
      if (savingAdvanceMapping) {
        return;
      }

      if (
        !payload?.receivable_account_id ||
        !payload?.cash_account_id ||
        !payload?.bank_account_id
      ) {
        Alert.alert(
          'Advance Account Mapping',
          'Receivable, cash, and bank accounts are required.',
        );

        return;
      }

      try {
        setSavingAdvanceMapping(true);

        const response = await api(
          '/api/plugins/financial-accounting/simplified-payroll/advances/account-mapping',
          {
            method: 'PUT',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              receivable_account_id: Number(payload.receivable_account_id),

              cash_account_id: Number(payload.cash_account_id),

              bank_account_id: Number(payload.bank_account_id),
            }),
          },
        );

        if (response?.ok === false) {
          throw new Error(
            response?.message || 'Could not save advance account mapping.',
          );
        }

        /*
         * Immediately update mapping from PUT response.
         */
        if (response?.account_mapping) {
          setAdvancesData(current => ({
            ...current,

            account_mapping: response.account_mapping,
          }));
        }

        /*
         * Reload advance workspace after mapping change.
         *
         * Use the currently selected employee.
         */
        const userId = selectedAdvanceStaffId;

        const advancesResponse = await api(
          userId
            ? `/api/plugins/financial-accounting/simplified-payroll/advances?user_id=${encodeURIComponent(
                userId,
              )}`
            : '/api/plugins/financial-accounting/simplified-payroll/advances',
          {
            method: 'GET',
          },
        );

        setAdvancesData(advancesResponse || {});

        Alert.alert(
          'Advance Account Mapping',
          'Advance account mapping saved successfully.',
        );

        return response?.account_mapping || null;
      } catch (error) {
        console.log('Save advance account mapping error:', error);

        const validationErrors =
          error?.data?.errors || error?.response?.data?.errors;

        let message =
          error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          'Could not save advance account mapping.';

        if (validationErrors) {
          const firstError = Object.values(validationErrors)
            .flat()
            .find(Boolean);

          if (firstError) {
            message = String(firstError);
          }
        }

        Alert.alert('Advance Account Mapping', message);

        return null;
      } finally {
        setSavingAdvanceMapping(false);
      }
    },
    [savingAdvanceMapping, selectedAdvanceStaffId],
  );

  const handleSaveStaffSalarySetting = useCallback(
    async form => {
      if (savingStaffSalarySetting) {
        return;
      }

      if (!form?.userId) {
        Alert.alert('Staff Salary', 'Please select an employee.');

        return;
      }

      if (!form?.effectiveFrom) {
        Alert.alert('Staff Salary', 'Please select an effective date.');

        return;
      }

      const validLines = Array.isArray(form?.lines)
        ? form.lines.filter(
            item =>
              item?.payroll_head_id && String(item?.amount ?? '').trim() !== '',
          )
        : [];

      if (validLines.length === 0) {
        Alert.alert(
          'Staff Salary',
          'Please add at least one salary component.',
        );

        return;
      }

      const payload = {
        user_id: Number(form.userId),

        effective_from: form.effectiveFrom,

        is_active: form.isActive !== false,

        lines: validLines.map((item, index) => ({
          payroll_head_id: Number(item.payroll_head_id),

          amount: String(item.amount).trim(),

          sort_order: Number(item.sort_order ?? index),
        })),
      };

      try {
        setSavingStaffSalarySetting(true);

        const response = await api(
          '/api/plugins/financial-accounting/simplified-payroll/settings/staff-salary-settings',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify(payload),
          },
        );

        if (response?.ok === false) {
          throw new Error(
            response?.message || 'Could not save staff salary setting.',
          );
        }

        await reloadPayrollSettings();

        Alert.alert('Staff Salary', 'Salary setting saved successfully.');

        return response?.setting || null;
      } catch (error) {
        console.log('Save staff salary setting error:', error);

        const validationErrors =
          error?.data?.errors || error?.response?.data?.errors;

        let message =
          error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          'Could not save staff salary setting.';

        if (validationErrors) {
          const firstError = Object.values(validationErrors)
            .flat()
            .find(Boolean);

          if (firstError) {
            message = String(firstError);
          }
        }

        Alert.alert('Staff Salary', message);

        return null;
      } finally {
        setSavingStaffSalarySetting(false);
      }
    },
    [savingStaffSalarySetting, reloadPayrollSettings],
  );

  const handleMainTabPress = useCallback(
    async key => {
      setActiveArea(key);

      if (key === 'salary_calculation') {
        await loadCalculations();
      }
    },
    [loadCalculations],
  );

  const activeSalarySettings = useMemo(() => {
    return payrollSettings.settings.filter(item => item?.is_active !== false);
  }, [payrollSettings.settings]);

  const totalAdvanceOutstanding = useMemo(() => {
    return advancesData.balances.reduce(
      (total, item) => total + (Number(item?.outstanding_balance) || 0),
      0,
    );
  }, [advancesData.balances]);

  const selectedAdvanceStaff = useMemo(() => {
    const staffList = Array.isArray(payrollSettings?.staff)
      ? payrollSettings.staff
      : [];

    return (
      staffList.find(
        item => Number(item?.id) === Number(selectedAdvanceStaffId),
      ) || null
    );
  }, [payrollSettings.staff, selectedAdvanceStaffId]);

  const selectedRepaymentAdvance = useMemo(() => {
    if (!repaymentAdvanceId) {
      return null;
    }

    const sourceAdvances = Array.isArray(selectedStaffAdvanceData?.advances)
      ? selectedStaffAdvanceData.advances
      : Array.isArray(advancesData?.advances)
      ? advancesData.advances
      : [];

    return (
      sourceAdvances.find(
        item => Number(item?.id) === Number(repaymentAdvanceId),
      ) || null
    );
  }, [repaymentAdvanceId, selectedStaffAdvanceData, advancesData]);

  const editingCalculationStaff = useMemo(() => {
    if (!editingCalculation) {
      return null;
    }

    const userId = Number(
      editingCalculation?.user_id || editingCalculation?.user?.id,
    );

    const staffList = Array.isArray(calculationsData?.staff)
      ? calculationsData.staff
      : [];

    return (
      staffList.find(item => Number(item?.id) === userId) ||
      editingCalculation?.user ||
      null
    );
  }, [editingCalculation, calculationsData.staff]);

  const handleDownloadPayslip = useCallback(
    async calculation => {
      const payslipId = Number(calculation?.payslip?.id);

      if (!Number.isFinite(payslipId)) {
        Alert.alert(
          'Payslip',
          'Payslip is not available for this salary calculation.',
        );

        return;
      }

      if (downloadingPayslipId) {
        return;
      }

      let tempPath = null;

      try {
        setDownloadingPayslipId(payslipId);

        const token = await getToken();

        const url = absoluteUrl(
          `${BASE}/payslips/${encodeURIComponent(payslipId)}/download`,
        );

        const headers = {
          Accept: 'application/pdf',
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await ReactNativeBlobUtil.config({
          fileCache: true,
          appendExt: 'pdf',
        }).fetch('GET', url, headers);

        const info = response.info();

        const statusCode = Number(info?.status);

        if (
          !Number.isFinite(statusCode) ||
          statusCode < 200 ||
          statusCode >= 300
        ) {
          throw new Error(
            `Payslip download failed with HTTP ${statusCode || 'unknown'}.`,
          );
        }

        tempPath = response.path();

        if (!tempPath) {
          throw new Error('Downloaded payslip file path was not returned.');
        }

        const slipNumber = String(
          calculation?.payslip?.slip_number || `Payslip-${payslipId}`,
        )
          .trim()
          .replace(/[\\/:*?"<>|]/g, '-');

        const fileName = `${slipNumber}.pdf`;

        if (Platform.OS === 'android') {
          const savedUri =
            await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
              {
                name: fileName,
                parentFolder: 'Payroll',
                mimeType: 'application/pdf',
              },
              'Download',
              tempPath,
            );

          if (!savedUri) {
            throw new Error('Could not save the payslip to Downloads.');
          }

          Alert.alert(
            'Download Complete',
            `Payslip saved in:\n\nDownloads/Payroll\n\n${fileName}`,
          );

          return;
        }

        const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

        await ReactNativeBlobUtil.fs.cp(tempPath, destination);

        Alert.alert('Download Complete', `Payslip saved as:\n\n${fileName}`);
      } catch (error) {
        console.log('Payslip download error:', error);

        Alert.alert(
          'Download Payslip',
          error?.message || 'Could not download the payslip.',
        );
      } finally {
        if (tempPath) {
          try {
            const exists = await ReactNativeBlobUtil.fs.exists(tempPath);

            if (exists) {
              await ReactNativeBlobUtil.fs.unlink(tempPath);
            }
          } catch (cleanupError) {
            console.log('Payslip temporary file cleanup error:', cleanupError);
          }
        }

        setDownloadingPayslipId(null);
      }
    },
    [downloadingPayslipId],
  );

  function renderActiveArea() {
    switch (activeArea) {
      case 'salary_calculation':
        return (
          <SalaryCalculationTab
            data={calculationsData}
            currencySymbol={advancesData.currency_symbol}
            loading={loadingCalculations}
            onRefresh={loadCalculations}
            downloadingPayslipId={downloadingPayslipId}
            onDownloadPayslip={handleDownloadPayslip}
            onEditCalculation={calculation => {
              setEditingCalculation(calculation);
            }}
            onCompletePayrollRun={handleOpenPayrollRunReview}
          />
        );

      case 'staff_advance':
        return (
          <StaffAdvanceTab
            data={advancesData}
            staffDirectory={payrollSettings.staff}
            selectedData={selectedStaffAdvanceData}
            selectedStaffId={selectedAdvanceStaffId}
            loadingSelected={loadingStaffAdvance}
            onSelectStaff={handleSelectAdvanceStaff}
            onNewAdvance={() => {
              if (!selectedAdvanceStaffId) {
                Alert.alert('New Advance', 'Please select an employee first.');

                return;
              }

              setNewAdvanceVisible(true);
            }}
            onEditAdvance={advance => {
              // Keep your existing repayment adjustment modal logic here.
              setRepaymentAdvanceId?.(Number(advance.id));
            }}
          />
        );

      case 'settings':
        return (
          <PayrollSettingsTab
            activeTab={settingsSection}
            data={payrollSettings}
            advancesData={advancesData}
            currencySymbol={advancesData?.currency_symbol || '₹'}
            onPayrollSettingsChange={setPayrollSettings}
            savingStaffSalarySetting={savingStaffSalarySetting}
            onSaveStaffSalarySetting={handleSaveStaffSalarySetting}
            savingPayrollSchedule={savingPayrollSchedule}
            onSavePayrollSchedule={handleSavePayrollSchedule}
            savingAdvanceMapping={savingAdvanceMapping}
            onSaveAdvanceMapping={handleSaveAdvanceMapping}
          />
        );

      default:
        return null;
    }
  }

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <ActivityIndicator size="large" color="#60A5FA" />

        <Text style={styles.loadingText}>Loading payroll...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.fixedTopArea}>
        <View style={styles.tabsCard}>
          <Text style={styles.eyebrow}>BROWSE BY FUNCTION</Text>

          <Text style={styles.tabHint}>
            Choose an area first, then work inside it.
          </Text>

          <View style={styles.tabs}>
            {MAIN_TABS.map(item => {
              const active = item.key === activeArea;

              return (
                <Pressable
                  key={item.key}
                  onPress={() => handleMainTabPress(item.key)}
                  style={[styles.tab, active && styles.tabActive]}
                >
                  <Text
                    style={[styles.tabText, active && styles.tabTextActive]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {activeArea === 'settings' && (
          <View style={styles.subTabsCard}>
            <View style={styles.subTabs}>
              {SETTINGS_TABS.map(item => {
                const active = settingsSection === item.key;

                return (
                  <Pressable
                    key={item.key}
                    onPress={() => setSettingsSection(item.key)}
                    style={[styles.subTab, active && styles.subTabActive]}
                  >
                    <Text
                      style={[
                        styles.subTabText,
                        active && styles.subTabTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.bodyScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.bodyScrollContent,
          {
            paddingBottom: Math.max(insets.bottom, 18) + 20,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadWorkspace({
                refresh: true,
              })
            }
            tintColor="#60A5FA"
            colors={['#60A5FA']}
          />
        }
      >
        {renderActiveArea()}
      </ScrollView>
      <RepaymentAdjustmentModal
        visible={Boolean(repaymentAdvanceId && selectedRepaymentAdvance)}
        advance={selectedRepaymentAdvance}
        currencySymbol={
          selectedStaffAdvanceData?.currency_symbol ||
          advancesData?.currency_symbol ||
          '₹'
        }
        submitting={savingRepaymentAdjustment}
        onClose={() => {
          if (!savingRepaymentAdjustment) {
            setRepaymentAdvanceId(null);
          }
        }}
        onSubmit={handleSaveRepaymentAdjustment}
      />
      <NewAdvanceModal
        visible={newAdvanceVisible}
        staff={selectedAdvanceStaff}
        data={selectedStaffAdvanceData || advancesData}
        submitting={creatingAdvance}
        onClose={() => {
          if (!creatingAdvance) {
            setNewAdvanceVisible(false);
          }
        }}
        onSubmit={handleCreateAdvance}
      />
      <SalaryCalculationModal
        visible={Boolean(editingCalculation)}
        calculation={editingCalculation}
        staff={editingCalculationStaff}
        eligiblePeriod={calculationsData?.eligible_period || null}
        savingDraft={savingCalculationDraft}
        settling={settlingCalculation}
        onClose={() => {
          if (!savingCalculationDraft && !settlingCalculation) {
            setEditingCalculation(null);
          }
        }}
        onPreview={handlePreviewSalaryCalculation}
        onSaveDraft={handleSaveCalculationDraft}
        onPostSettlement={handlePostSalarySettlement}
      />
      <PayrollRunReviewModal
        visible={payrollRunReviewVisible}
        data={payrollRunReviewData}
        loading={loadingPayrollRunReview}
        onClose={() => {
          if (!loadingPayrollRunReview) {
            setPayrollRunReviewVisible(false);
          }
        }}
        onRefresh={loadPayrollRunReview}
      />
    </View>
  );
}
