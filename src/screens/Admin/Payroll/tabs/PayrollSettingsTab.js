// src/screens/Admin/Payroll/tabs/PayrollSettingsTab.js

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

import SalaryHeadModal from '../modals/SalaryHeadModal';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './PayrollTabs.styles';
import StaffSalarySettings from './StaffSalarySettings';
import GeneralPayrollSettings from './GeneralPayrollSettings';
const BASE = '/api/plugins/financial-accounting/simplified-payroll';

function money(value, symbol = '₹') {
  return `${symbol}${(Number(value) || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  return value ? String(value).slice(0, 10) : '-';
}

export default function PayrollSettingsTab({
  activeTab = 'heads',
  data,
  currencySymbol = '₹',
  advancesData = {},
  onPayrollSettingsChange,
  savingStaffSalarySetting = false,
  onSaveStaffSalarySetting,
  savingPayrollSchedule = false,
  savingAdvanceMapping = false,
  onSavePayrollSchedule,
  onSaveAdvanceMapping,
  onUnavailableAction,
}) {
  const [search, setSearch] = useState('');

  const [salaryHeadModalVisible, setSalaryHeadModalVisible] = useState(false);

  const [salaryHeadModalMode, setSalaryHeadModalMode] = useState('add');

  const [selectedSalaryHead, setSelectedSalaryHead] = useState(null);

  const [savingSalaryHead, setSavingSalaryHead] = useState(false);

  const [updatingHeadActiveId, setUpdatingHeadActiveId] = useState(null);

  const heads = Array.isArray(data?.heads) ? data.heads : [];

  const staffSettings = Array.isArray(data?.settings) ? data.settings : [];

  const filteredHeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return heads;
    }

    return heads.filter(item => {
      return [item?.name, item?.code, item?.kind, item?.calculation_mode]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [heads, search]);

  function getApiErrorMessage(error, fallback) {
    const data = error?.payload || error?.data || error?.response?.data || {};

    const errors = data?.errors;

    if (errors && typeof errors === 'object') {
      const firstError = Object.values(errors).flat().find(Boolean);

      if (firstError) {
        return String(firstError);
      }
    }

    return data?.message || error?.message || fallback;
  }

  function openAddSalaryHead() {
    setSalaryHeadModalMode('add');

    setSelectedSalaryHead(null);

    setSalaryHeadModalVisible(true);
  }

  function openEditSalaryHead(head) {
    setSalaryHeadModalMode('edit');

    setSelectedSalaryHead(head);

    setSalaryHeadModalVisible(true);
  }

  function closeSalaryHeadModal() {
    if (savingSalaryHead) {
      return;
    }

    setSalaryHeadModalVisible(false);

    setSelectedSalaryHead(null);
  }

  const reloadPayrollSettings = useCallback(async () => {
    const response = await api(`${BASE}/settings`, {
      method: 'GET',
    });

    const nextData = {
      heads: Array.isArray(response?.heads) ? response.heads : [],

      staff: Array.isArray(response?.staff) ? response.staff : [],

      settings: Array.isArray(response?.settings) ? response.settings : [],

      general: response?.general || null,
    };

    onPayrollSettingsChange?.(nextData);

    return nextData;
  }, [onPayrollSettingsChange]);

  const handleSaveSalaryHead = useCallback(
    async form => {
      if (savingSalaryHead) {
        return;
      }

      const isEdit = salaryHeadModalMode === 'edit';

      if (!String(form.code || '').trim()) {
        Alert.alert('Salary Head', 'Code is required.');
        return;
      }

      if (!String(form.name || '').trim()) {
        Alert.alert('Salary Head', 'Name is required.');
        return;
      }

      if (isEdit && !selectedSalaryHead?.id) {
        Alert.alert('Salary Head', 'Salary head ID is missing.');

        return;
      }

      /*
       * Exact payload confirmed from
       * your backend request.
       */

      const payload = {
        code: String(form.code || '')
          .trim()
          .toUpperCase(),
        name: String(form.name || '').trim(),
        kind: form.kind || 'earning',
        calculation_mode: form.calculation_mode || 'fixed',
        unit_label: form.unit_label || '',
        default_rate: form.default_rate || '',
        default_value: form.default_value || '',
        percentage_basis_head_ids: Array.isArray(form.percentage_basis_head_ids)
          ? form.percentage_basis_head_ids
          : [],
      };

      const endpoint = isEdit
        ? `${BASE}/settings/heads/${selectedSalaryHead.id}`
        : `${BASE}/settings/heads`;

      try {
        setSavingSalaryHead(true);

        const response = await api(endpoint, {
          method: isEdit ? 'PUT' : 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        });

        if (response?.ok === false) {
          throw new Error(response?.message || 'Could not save salary head.');
        }

        /*
         * Reload the complete settings
         * so the screen always reflects
         * backend state.
         */
        await reloadPayrollSettings();

        setSalaryHeadModalVisible(false);

        setSelectedSalaryHead(null);

        Alert.alert(
          'Salary Head',
          isEdit
            ? 'Salary head updated successfully.'
            : 'Salary head created successfully.',
        );
      } catch (error) {
        console.log('Save salary head error:', error);

        Alert.alert(
          'Salary Head',
          getApiErrorMessage(
            error,
            isEdit
              ? 'Could not update salary head.'
              : 'Could not create salary head.',
          ),
        );
      } finally {
        setSavingSalaryHead(false);
      }
    },
    [
      savingSalaryHead,
      salaryHeadModalMode,
      selectedSalaryHead,
      reloadPayrollSettings,
    ],
  );

  const handleToggleSalaryHeadActive = useCallback(
    head => {
      if (!head?.id) {
        return;
      }

      const nextActive = !head.is_active;

      const actionLabel = nextActive ? 'Activate' : 'Deactivate';

      Alert.alert(
        `${actionLabel} Salary Head`,
        `Are you sure you want to ${actionLabel.toLowerCase()} "${head.name}"?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: actionLabel,
            style: nextActive ? 'default' : 'destructive',

            onPress: async () => {
              if (updatingHeadActiveId !== null) {
                return;
              }

              try {
                setUpdatingHeadActiveId(head.id);

                const response = await api(
                  `${BASE}/settings/heads/${head.id}/active`,
                  {
                    method: 'PATCH',

                    headers: {
                      'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                      is_active: nextActive,
                    }),
                  },
                );

                if (response?.ok === false) {
                  throw new Error(
                    response?.message ||
                      `Could not ${actionLabel.toLowerCase()} salary head.`,
                  );
                }

                /*
                 * First update the current list using
                 * the PATCH response.
                 */
                if (response?.head) {
                  onPayrollSettingsChange?.({
                    ...data,

                    heads: heads.map(item =>
                      Number(item.id) === Number(head.id)
                        ? response.head
                        : item,
                    ),
                  });
                }

                /*
                 * Then reload from backend so the screen
                 * reflects the actual persisted state.
                 */
                await reloadPayrollSettings();

                Alert.alert(
                  'Salary Head',
                  nextActive
                    ? 'Salary head activated successfully.'
                    : 'Salary head deactivated successfully.',
                );
              } catch (error) {
                console.log('Toggle salary head active error:', error);

                Alert.alert(
                  'Salary Head',
                  getApiErrorMessage(
                    error,
                    nextActive
                      ? 'Could not activate salary head.'
                      : 'Could not deactivate salary head.',
                  ),
                );
              } finally {
                setUpdatingHeadActiveId(null);
              }
            },
          },
        ],
      );
    },
    [
      updatingHeadActiveId,
      data,
      heads,
      onPayrollSettingsChange,
      reloadPayrollSettings,
    ],
  );

  function renderHeads() {
    return (
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <Text style={styles.sectionDescription}>
          Maintain salary heads and direct staff salary settings. Advance
          deductions are calculated from outstanding staff advances only.
        </Text>

        <Text style={styles.fieldLabel}>Search salary heads</Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Name, code, type"
          placeholderTextColor="#718096"
          style={styles.input}
        />

        <Pressable onPress={openAddSalaryHead} style={styles.primaryButton}>
          <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />

          <Text style={styles.primaryButtonText}>Add Head</Text>
        </Pressable>

        <View style={styles.divider} />

        {filteredHeads.map(item => (
          <View key={String(item.id)} style={styles.dataCard}>
            <View style={styles.dataCardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.dataCardTitle}>{item.name}</Text>

                <Text style={styles.dataCardSubtitle}>{item.code}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  item.is_active ? styles.activeBadge : styles.inactiveBadge,
                ]}
              >
                <Text style={styles.statusText}>
                  {item.is_active ? 'ACTIVE' : 'INACTIVE'}
                </Text>
              </View>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Type</Text>

                <Text style={styles.infoValue}>{item.kind || '-'}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Calculation</Text>

                <Text style={styles.infoValue}>
                  {item.calculation_mode || '-'}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Sort order</Text>

                <Text style={styles.infoValue}>{item.sort_order ?? '-'}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Source</Text>

                <Text style={styles.infoValue}>
                  {item.is_system ? 'System' : 'Custom'}
                </Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <Pressable
                onPress={() => openEditSalaryHead(item)}
                style={styles.outlineButton}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={16}
                  color="#E2E8F0"
                />

                <Text style={styles.outlineButtonText}>Edit</Text>
              </Pressable>

              <Pressable
                disabled={updatingHeadActiveId !== null}
                onPress={() => handleToggleSalaryHeadActive(item)}
                style={[
                  styles.outlineButton,

                  updatingHeadActiveId === item.id && styles.buttonDisabled,
                ]}
              >
                {updatingHeadActiveId === item.id ? (
                  <ActivityIndicator size="small" color="#E2E8F0" />
                ) : (
                  <MaterialCommunityIcons
                    name={item.is_active ? 'cancel' : 'check-circle-outline'}
                    size={16}
                    color={item.is_active ? '#FCA5A5' : '#6EE7B7'}
                  />
                )}

                <Text
                  style={[
                    styles.outlineButtonText,

                    item.is_active
                      ? styles.deactivateText
                      : styles.activateText,
                  ]}
                >
                  {updatingHeadActiveId === item.id
                    ? 'Updating...'
                    : item.is_active
                    ? 'Deactivate'
                    : 'Activate'}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}

        <Text style={styles.resultCount}>
          Showing {filteredHeads.length} of {heads.length}
        </Text>
      </View>
    );
  }

  function renderGeneral() {
    const general = data?.general || null;

    return (
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>General Payroll Settings</Text>

        <Text style={styles.sectionDescription}>
          Current organization-wide payroll configuration.
        </Text>

        <View style={styles.dataCard}>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Salary frequency</Text>

              <Text style={styles.infoValue}>
                {general?.salary_frequency || '-'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Payroll starts on</Text>

              <Text style={styles.infoValue}>
                {formatDate(general?.payroll_starts_on)}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Last updated</Text>

              <Text style={styles.infoValue}>
                {formatDate(general?.updated_at)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.areaContent}>
        {activeTab === 'heads' && renderHeads()}

        {activeTab === 'staff_salary' && (
          <StaffSalarySettings
            staff={Array.isArray(data?.staff) ? data.staff : []}
            settings={Array.isArray(data?.settings) ? data.settings : []}
            heads={Array.isArray(data?.heads) ? data.heads : []}
            saving={savingStaffSalarySetting}
            onSaveSetting={onSaveStaffSalarySetting}
          />
        )}

        {activeTab === 'general' && (
          <GeneralPayrollSettings
            general={data?.general || null}
            accountMapping={advancesData?.account_mapping || null}
            assetAccounts={
              Array.isArray(advancesData?.asset_accounts)
                ? advancesData.asset_accounts
                : []
            }
            paymentAccounts={
              Array.isArray(advancesData?.payment_accounts)
                ? advancesData.payment_accounts
                : []
            }
            savingSchedule={savingPayrollSchedule}
            savingAccountMapping={savingAdvanceMapping}
            onSaveSchedule={onSavePayrollSchedule}
            onSaveAccountMapping={onSaveAdvanceMapping}
          />
        )}
      </View>

      <SalaryHeadModal
        visible={salaryHeadModalVisible}
        mode={salaryHeadModalMode}
        head={selectedSalaryHead}
        submitting={savingSalaryHead}
        onClose={closeSalaryHeadModal}
        onSubmit={handleSaveSalaryHead}
      />
    </>
  );
}
