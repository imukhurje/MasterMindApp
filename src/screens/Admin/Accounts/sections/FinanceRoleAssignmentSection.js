import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../../api/client';

import styles from './FinanceRoleAssignmentSection.styles';

const BASE = '/api/plugins/financial-accounting';

const DEFAULT_CORE_ROLES = ['teacher', 'staff', 'admin'];

function formatRole(value) {
  if (!value) {
    return '-';
  }

  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function normalizeRole(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
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

export default function FinanceRoleAssignmentSection({
  roleAssignments = {},
  onRoleAssignmentsChange,
}) {
  const [search, setSearch] = useState('');

  const [appliedSearch, setAppliedSearch] = useState('');

  const [selectedCoreRoles, setSelectedCoreRoles] =
    useState(DEFAULT_CORE_ROLES);

  const [reloading, setReloading] = useState(false);

  const [roleDrafts, setRoleDrafts] = useState({});

  const items = useMemo(() => {
    return Array.isArray(roleAssignments?.items) ? roleAssignments.items : [];
  }, [roleAssignments]);

  const financeRoles = useMemo(() => {
    return Array.isArray(roleAssignments?.roles) ? roleAssignments.roles : [];
  }, [roleAssignments]);

  const availableCoreRoles = useMemo(() => {
    return Array.isArray(roleAssignments?.available_core_roles)
      ? roleAssignments.available_core_roles
      : [];
  }, [roleAssignments]);

  const financeRoleOptions = useMemo(() => {
    return [
      {
        label: 'No explicit finance role',
        value: '',
      },

      ...financeRoles.map(item => ({
        label: item?.display_name || item?.role_key || 'Finance role',

        value: item?.role_key || '',
      })),
    ];
  }, [financeRoles]);

  useEffect(() => {
    const drafts = {};

    items.forEach(item => {
      drafts[String(item?.user_id)] = item?.explicit_finance_role_key || '';
    });

    setRoleDrafts(drafts);
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = String(appliedSearch || '')
      .trim()
      .toLowerCase();

    return items.filter(item => {
      const coreRole = normalizeRole(item?.core_role);

      if (
        selectedCoreRoles.length > 0 &&
        !selectedCoreRoles.includes(coreRole)
      ) {
        return false;
      }

      if (query) {
        const haystack = [
          item?.employee_code,
          item?.name,
          item?.email,
          item?.core_role,
          item?.explicit_finance_role,
          item?.effective_finance_role,
          item?.role_source_label,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [items, appliedSearch, selectedCoreRoles]);

  const reloadAssignments = useCallback(async () => {
    if (reloading) {
      return;
    }

    try {
      setReloading(true);

      const response = await api(`${BASE}/settings/role-assignments`, {
        method: 'GET',
      });

      const nextData = {
        items: Array.isArray(response?.items) ? response.items : [],

        roles: Array.isArray(response?.roles) ? response.roles : [],

        available_core_roles: Array.isArray(response?.available_core_roles)
          ? response.available_core_roles
          : [],

        meta: response?.meta || {},
      };

      onRoleAssignmentsChange?.(nextData);

      return nextData;
    } catch (error) {
      console.log('Reload finance role assignments error:', error);

      Alert.alert(
        'Role Assignments',
        getApiErrorMessage(error, 'Could not reload role assignments.'),
      );
    } finally {
      setReloading(false);
    }
  }, [reloading, onRoleAssignmentsChange]);

  function toggleCoreRole(role) {
    const normalized = normalizeRole(role);

    setSelectedCoreRoles(current => {
      if (current.includes(normalized)) {
        return current.filter(item => item !== normalized);
      }

      return [...current, normalized];
    });
  }

  function applyFilters() {
    setAppliedSearch(search.trim());
  }

  function handleRoleDraftChange(userId, roleKey) {
    setRoleDrafts(current => ({
      ...current,

      [String(userId)]: roleKey || '',
    }));
  }

  function handleSave(item) {
    /*
     * Save API has not been supplied yet.
     * Do not guess the endpoint.
     */

    Alert.alert(
      'Role Assignment',
      'The Save role assignment API has not been supplied yet.',
    );
  }

  function handleClear(item) {
    /*
     * Clear API has not been supplied yet.
     * Do not guess the endpoint.
     */

    Alert.alert(
      'Role Assignment',
      'The Clear role assignment API has not been supplied yet.',
    );
  }

  return (
    <>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Finance role assignment</Text>

        <Text style={styles.sectionDescription}>
          Assign one explicit finance role per user and make admin inheritance
          visible instead of implicit.
        </Text>

        <View style={styles.informationCard}>
          <MaterialCommunityIcons
            name="information-outline"
            size={21}
            color="#7DD3FC"
          />

          <Text style={styles.informationText}>
            Core admins inherit the highest finance access until you assign a
            more specific finance role. Clearing an explicit role puts a core
            admin back on inherited access and removes finance access for
            non-admin users.
          </Text>
        </View>

        <Pressable
          disabled={reloading}
          onPress={reloadAssignments}
          style={({ pressed }) => [
            styles.reloadButton,

            reloading && styles.buttonDisabled,

            pressed && !reloading && styles.pressed,
          ]}
        >
          {reloading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialCommunityIcons name="reload" size={18} color="#FFFFFF" />
          )}

          <Text style={styles.reloadButtonText}>
            {reloading ? 'Reloading...' : 'Reload assignments'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Effective finance access</Text>

        <Text style={styles.sectionDescription}>
          Search by person or role, then save a specific override only when the
          inherited access is not the right fit.
        </Text>

        <Text style={styles.filterLabel}>Search text</Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Employee code, name, email, or role"
          placeholderTextColor="#718096"
          returnKeyType="search"
          onSubmitEditing={applyFilters}
          style={styles.searchInput}
        />

        <Text style={styles.filterLabel}>Core roles</Text>

        <View style={styles.coreRoleWrap}>
          {availableCoreRoles.map(role => {
            const normalized = normalizeRole(role);

            const active = selectedCoreRoles.includes(normalized);

            return (
              <Pressable
                key={normalized}
                onPress={() => toggleCoreRole(normalized)}
                style={[
                  styles.coreRoleChip,

                  active && styles.coreRoleChipActive,
                ]}
              >
                {active && (
                  <MaterialCommunityIcons
                    name="check"
                    size={14}
                    color="#FFFFFF"
                  />
                )}

                <Text
                  style={[
                    styles.coreRoleText,

                    active && styles.coreRoleTextActive,
                  ]}
                >
                  {formatRole(normalized)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={applyFilters}
          style={({ pressed }) => [
            styles.applyButton,

            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons
            name="filter-outline"
            size={18}
            color="#FFFFFF"
          />

          <Text style={styles.applyButtonText}>Apply filters</Text>
        </Pressable>

        <View style={styles.divider} />

        {filteredItems.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="account-key-outline"
              size={30}
              color="#718096"
            />

            <Text style={styles.emptyTitle}>No role assignments</Text>

            <Text style={styles.emptyText}>
              No users match the current filters.
            </Text>
          </View>
        ) : (
          <View style={styles.cardList}>
            {filteredItems.map(item => {
              const userId = item?.user_id;

              const selectedRole = roleDrafts[String(userId)] ?? '';

              const hasExplicitRole = Boolean(item?.explicit_finance_role_key);

              const roleChanged =
                String(selectedRole || '') !==
                String(item?.explicit_finance_role_key || '');

              return (
                <View key={String(userId)} style={styles.userCard}>
                  <View style={styles.userHeader}>
                    <View style={styles.employeeBadge}>
                      <Text style={styles.employeeBadgeText}>
                        {item?.employee_code || 'No code'}
                      </Text>
                    </View>

                    <View style={styles.userIdentity}>
                      <Text style={styles.userName}>
                        {item?.name || 'User'}
                      </Text>

                      <Text style={styles.userEmail}>
                        {item?.email || 'No email'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dataDivider} />

                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Core role</Text>

                      <Text style={styles.infoValue}>
                        {formatRole(item?.core_role)}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>
                        Explicit finance role
                      </Text>

                      <Text style={styles.infoValue}>
                        {item?.explicit_finance_role || '-'}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>
                        Effective finance role
                      </Text>

                      <Text
                        style={[
                          styles.infoValue,

                          item?.effective_finance_role &&
                            styles.effectiveRoleText,
                        ]}
                      >
                        {item?.effective_finance_role || '-'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.sourceBadge,

                      item?.role_source === 'inherited'
                        ? styles.inheritedBadge
                        : styles.noAccessBadge,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        item?.role_source === 'inherited'
                          ? 'shield-account-outline'
                          : 'shield-off-outline'
                      }
                      size={15}
                      color={
                        item?.role_source === 'inherited'
                          ? '#7DD3FC'
                          : '#CBD5E1'
                      }
                    />

                    <Text style={styles.sourceBadgeText}>
                      {item?.role_source_label || 'No finance access'}
                    </Text>
                  </View>

                  <Text style={styles.roleSelectorLabel}>
                    Change explicit role
                  </Text>

                  <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    itemTextStyle={styles.dropdownItemText}
                    selectedTextStyle={styles.dropdownSelectedText}
                    placeholderStyle={styles.dropdownPlaceholder}
                    activeColor="#183B5D"
                    data={financeRoleOptions}
                    labelField="label"
                    valueField="value"
                    value={selectedRole}
                    placeholder="No explicit finance role"
                    onChange={option =>
                      handleRoleDraftChange(userId, option?.value)
                    }
                    renderRightIcon={() => (
                      <MaterialCommunityIcons
                        name="chevron-down"
                        size={20}
                        color="#A8B6C9"
                      />
                    )}
                  />

                  <View style={styles.actionRow}>
                    <Pressable
                      disabled={!roleChanged}
                      onPress={() => handleSave(item)}
                      style={[
                        styles.saveButton,

                        !roleChanged && styles.buttonDisabled,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="content-save-outline"
                        size={17}
                        color="#FFFFFF"
                      />

                      <Text style={styles.saveButtonText}>Save</Text>
                    </Pressable>

                    <Pressable
                      disabled={!hasExplicitRole}
                      onPress={() => handleClear(item)}
                      style={[
                        styles.clearButton,

                        !hasExplicitRole && styles.buttonDisabled,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="close-circle-outline"
                        size={17}
                        color="#DCE7F5"
                      />

                      <Text style={styles.clearButtonText}>Clear</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <Text style={styles.resultCount}>
          Showing {filteredItems.length} of {items.length}
        </Text>
      </View>
    </>
  );
}
