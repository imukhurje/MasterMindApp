// src/screens/Admin/RoleAssignments/AdminRoleAssignments.js

import React, { useCallback, useMemo, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Dropdown } from 'react-native-element-dropdown';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../api/client';

import styles from './AdminRoleAssignments.styles';

const PER_PAGE = 20;

function normalizeRoleValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

export default function AdminRoleAssignments({ navigation }) {
  const insets = useSafeAreaInsets();

  const searchRef = useRef('');

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [searching, setSearching] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [me, setMe] = useState(null);

  const [onboarding, setOnboarding] = useState(null);

  const [meta, setMeta] = useState(null);

  const [rows, setRows] = useState([]);

  const [search, setSearch] = useState('');

  const [selectedCoreRoles, setSelectedCoreRoles] = useState([]);

  const [roleFilterOpen, setRoleFilterOpen] = useState(false);

  const [roleFilterSearch, setRoleFilterSearch] = useState('');

  const [updatingUserId, setUpdatingUserId] = useState(null);

  const [page, setPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const coreRoleOptions = useMemo(() => {
    const options = Array.isArray(meta?.core_role_options)
      ? meta.core_role_options
      : [];

    return options.map(item => ({
      label: item?.label || item?.value || 'Role',

      value: normalizeRoleValue(item?.value),
    }));
  }, [meta?.core_role_options]);

  const filteredRoleOptions = useMemo(() => {
    const query = roleFilterSearch.trim().toLowerCase();

    if (!query) {
      return coreRoleOptions;
    }

    return coreRoleOptions.filter(item =>
      String(item?.label || '')
        .toLowerCase()
        .includes(query),
    );
  }, [coreRoleOptions, roleFilterSearch]);

  const roleLabelMap = useMemo(() => {
    const map = new Map();

    coreRoleOptions.forEach(item => {
      map.set(item.value, item.label);
    });

    return map;
  }, [coreRoleOptions]);

  const buildRoleAssignmentsUrl = useCallback(
    ({ requestedPage = 1, query = '', coreRoles = [] } = {}) => {
      const params = [
        'context=core',
        `q=${encodeURIComponent(query)}`,
        `page=${encodeURIComponent(requestedPage)}`,
        `per_page=${PER_PAGE}`,
      ];

      coreRoles.forEach(role => {
        params.push(
          `${encodeURIComponent('core_roles[]')}=${encodeURIComponent(role)}`,
        );
      });

      return `/api/role-assignments?${params.join('&')}`;
    },
    [],
  );

  const loadAssignments = useCallback(
    async ({
      requestedPage = 1,
      query = '',
      coreRoles = [],
      append = false,
    } = {}) => {
      const response = await api(
        buildRoleAssignmentsUrl({
          requestedPage,
          query,
          coreRoles,
        }),
      );

      const responseRows = Array.isArray(response?.rows) ? response.rows : [];

      if (append) {
        setRows(current => {
          const map = new Map();

          current.forEach(item => {
            map.set(Number(item?.id), item);
          });

          responseRows.forEach(item => {
            map.set(Number(item?.id), item);
          });

          return Array.from(map.values());
        });
      } else {
        setRows(responseRows);
      }

      const responseMeta = response?.meta || {};

      setPage(Number(responseMeta?.current_page) || requestedPage);

      setLastPage(Number(responseMeta?.last_page) || 1);

      setTotalCount(Number(responseMeta?.total) || responseRows.length);
    },
    [buildRoleAssignmentsUrl],
  );

  const loadScreen = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [meResponse, onboardingResponse, metaResponse] =
          await Promise.all([
            api('/api/me'),

            api('/api/settings/v1/onboarding'),

            api('/api/role-assignments/meta'),
          ]);

        const role = normalizeRoleValue(
          meResponse?.primary_role ||
            meResponse?.role ||
            meResponse?.actual_primary_role ||
            meResponse?.actual_role,
        );

        const hasAccess =
          meResponse?.is_admin === true ||
          meResponse?.is_super_admin === true ||
          role === 'admin' ||
          role === 'super_admin' ||
          metaResponse?.can_manage === true;

        if (!hasAccess) {
          Alert.alert(
            'Access denied',
            'Only administrators can manage role assignments.',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ],
          );

          return;
        }

        setMe(meResponse || null);

        setOnboarding(onboardingResponse || null);

        setMeta(metaResponse || null);

        const defaultRoles = Array.isArray(
          metaResponse?.default_core_roles_filter,
        )
          ? metaResponse.default_core_roles_filter
              .map(normalizeRoleValue)
              .filter(Boolean)
          : [];

        setSelectedCoreRoles(defaultRoles);

        await loadAssignments({
          requestedPage: 1,
          query: searchRef.current,
          coreRoles: defaultRoles,
          append: false,
        });
      } catch (error) {
        console.log('Role assignments load error:', error);

        Alert.alert(
          'Role Assignments',
          error?.message || 'Could not load role assignments.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigation, loadAssignments],
  );

  useFocusEffect(
    useCallback(() => {
      loadScreen();

      return undefined;
    }, [loadScreen]),
  );

  const handleSearchChange = useCallback(value => {
    setSearch(value);

    searchRef.current = value;
  }, []);

  const handleSearch = useCallback(async () => {
    try {
      setSearching(true);

      const query = String(search || '').trim();

      searchRef.current = query;

      await loadAssignments({
        requestedPage: 1,
        query,
        coreRoles: selectedCoreRoles,
        append: false,
      });
    } catch (error) {
      console.log('Role assignment search error:', error);

      Alert.alert(
        'Role Assignments',
        error?.message || 'Could not search users.',
      );
    } finally {
      setSearching(false);
    }
  }, [search, selectedCoreRoles, loadAssignments]);

  const handleClearSearch = useCallback(async () => {
    try {
      setSearch('');
      searchRef.current = '';

      setSearching(true);

      await loadAssignments({
        requestedPage: 1,
        query: '',
        coreRoles: selectedCoreRoles,
        append: false,
      });
    } catch (error) {
      console.log('Clear role search error:', error);
    } finally {
      setSearching(false);
    }
  }, [selectedCoreRoles, loadAssignments]);

  const toggleCoreRole = useCallback(roleValue => {
    const role = normalizeRoleValue(roleValue);

    if (!role) {
      return;
    }

    setSelectedCoreRoles(current => {
      if (current.includes(role)) {
        return current.filter(item => item !== role);
      }

      return [...current, role];
    });
  }, []);

  const handleApplyRoleFilter = useCallback(async () => {
    try {
      setRoleFilterOpen(false);

      setSearching(true);

      await loadAssignments({
        requestedPage: 1,
        query: searchRef.current,
        coreRoles: selectedCoreRoles,
        append: false,
      });
    } catch (error) {
      console.log('Role filter error:', error);

      Alert.alert(
        'Role Assignments',
        error?.message || 'Could not apply role filter.',
      );
    } finally {
      setSearching(false);
    }
  }, [selectedCoreRoles, loadAssignments]);

  const handleCoreRoleChange = useCallback(
    async (user, nextRole) => {
      const userId = Number(user?.id);

      const role = normalizeRoleValue(nextRole);

      if (!Number.isFinite(userId) || !role) {
        return;
      }

      if (user?.can_edit_core !== true) {
        return;
      }

      if (role === normalizeRoleValue(user?.core_role)) {
        return;
      }

      if (updatingUserId !== null) {
        return;
      }

      try {
        setUpdatingUserId(userId);

        const response = await api(
          `/api/role-assignments/core/${encodeURIComponent(userId)}`,
          {
            method: 'PUT',

            body: JSON.stringify({
              role,
            }),
          },
        );

        const updatedRow = response?.row;

        if (!updatedRow) {
          throw new Error('Updated role was not returned.');
        }

        setRows(current =>
          current.map(item =>
            Number(item?.id) === userId
              ? {
                  ...item,
                  ...updatedRow,
                }
              : item,
          ),
        );
      } catch (error) {
        console.log('Update core role error:', error);

        Alert.alert(
          'Role Assignment',
          error?.message || 'Could not update the user role.',
        );
      } finally {
        setUpdatingUserId(null);
      }
    },
    [updatingUserId],
  );

  const loadNextPage = useCallback(async () => {
    if (loadingMore || page >= lastPage) {
      return;
    }

    try {
      setLoadingMore(true);

      await loadAssignments({
        requestedPage: page + 1,

        query: searchRef.current,

        coreRoles: selectedCoreRoles,

        append: true,
      });
    } catch (error) {
      console.log('Load more role assignments error:', error);

      Alert.alert(
        'Role Assignments',
        error?.message || 'Could not load more users.',
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, page, lastPage, selectedCoreRoles, loadAssignments]);

  const renderUser = useCallback(
    ({ item }) => {
      const userId = Number(item?.id);

      const locked = item?.can_edit_core !== true;

      const updating = updatingUserId === userId;

      return (
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item?.name || 'User'}</Text>

            {!!item?.email && <Text style={styles.userMeta}>{item.email}</Text>}

            {!!item?.phone && <Text style={styles.userMeta}>{item.phone}</Text>}
          </View>

          <View style={styles.roleArea}>
            <Text style={styles.roleLabel}>Core Role</Text>

            {updating ? (
              <View style={styles.roleUpdatingBox}>
                <ActivityIndicator size="small" color="#67D1F0" />

                <Text style={styles.roleUpdatingText}>Updating role...</Text>
              </View>
            ) : (
              <Dropdown
                style={[
                  styles.roleDropdown,

                  locked && styles.roleDropdownLocked,
                ]}
                containerStyle={styles.dropdownContainer}
                selectedTextStyle={styles.dropdownSelectedText}
                itemTextStyle={styles.dropdownItemText}
                placeholderStyle={styles.dropdownPlaceholder}
                activeColor="#173B60"
                iconColor={locked ? '#718096' : '#D7E3F4'}
                data={coreRoleOptions}
                labelField="label"
                valueField="value"
                value={normalizeRoleValue(item?.core_role)}
                disable={locked}
                onChange={option => handleCoreRoleChange(item, option?.value)}
              />
            )}

            <Text style={styles.roleHelp}>
              {locked
                ? 'Your own core role is locked.'
                : "Choose the user's single core role."}
            </Text>
          </View>
        </View>
      );
    },
    [coreRoleOptions, updatingUserId, handleCoreRoleChange],
  );

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading role assignments...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 6),
        },
      ]}
    >
      <FlatList
        data={rows}
        keyExtractor={item => String(item?.id)}
        renderItem={renderUser}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadScreen({
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.filterCard}>
              <View style={styles.scopeSection}>
                <Text style={styles.filterLabel}>Assignment Scope</Text>

                <View style={styles.scopeBox}>
                  <Text style={styles.scopeText}>Core</Text>
                </View>
              </View>

              <View style={styles.coreFilterSection}>
                <Text style={styles.filterLabel}>Core Role Filter</Text>

                <Pressable
                  onPress={() => setRoleFilterOpen(current => !current)}
                  style={styles.roleFilterField}
                >
                  <View style={styles.roleChips}>
                    {selectedCoreRoles.length > 0 ? (
                      selectedCoreRoles.map(role => (
                        <View key={role} style={styles.roleChip}>
                          <Text style={styles.roleChipText}>
                            {roleLabelMap.get(role) || role}
                          </Text>

                          <Pressable
                            hitSlop={6}
                            onPress={() => toggleCoreRole(role)}
                          >
                            <MaterialCommunityIcons
                              name="close"
                              size={14}
                              color="#DCE7F5"
                            />
                          </Pressable>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.roleFilterPlaceholder}>
                        All core roles
                      </Text>
                    )}
                  </View>

                  <MaterialCommunityIcons
                    name={roleFilterOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#D7E3F4"
                  />
                </Pressable>

                {roleFilterOpen ? (
                  <View style={styles.roleFilterPanel}>
                    <View style={styles.roleFilterSearchBox}>
                      <MaterialCommunityIcons
                        name="magnify"
                        size={18}
                        color="#94A3B8"
                      />

                      <TextInput
                        value={roleFilterSearch}
                        onChangeText={setRoleFilterSearch}
                        placeholder="Type to filter core roles..."
                        placeholderTextColor="#718096"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.roleFilterSearchInput}
                      />
                    </View>

                    <ScrollView
                      style={styles.roleFilterOptions}
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                    >
                      {filteredRoleOptions.map(option => {
                        const selected = selectedCoreRoles.includes(
                          option.value,
                        );

                        return (
                          <Pressable
                            key={option.value}
                            onPress={() => toggleCoreRole(option.value)}
                            style={({ pressed }) => [
                              styles.roleFilterOption,

                              selected && styles.roleFilterOptionSelected,

                              pressed && styles.controlPressed,
                            ]}
                          >
                            <Text style={styles.roleFilterOptionText}>
                              {option.label}
                            </Text>

                            {selected ? (
                              <MaterialCommunityIcons
                                name="check"
                                size={17}
                                color="#93C5FD"
                              />
                            ) : null}
                          </Pressable>
                        );
                      })}
                    </ScrollView>

                    <Pressable
                      onPress={handleApplyRoleFilter}
                      style={({ pressed }) => [
                        styles.applyFilterButton,

                        pressed && styles.controlPressed,
                      ]}
                    >
                      <Text style={styles.applyFilterButtonText}>
                        Apply Filter
                      </Text>
                    </Pressable>
                  </View>
                ) : null}

                <Text style={styles.filterHelp}>
                  Clear all selections to show all users.
                </Text>
              </View>

              <View style={styles.searchSection}>
                <View style={styles.searchBox}>
                  <MaterialCommunityIcons
                    name="magnify"
                    size={19}
                    color="#94A3B8"
                  />

                  <TextInput
                    value={search}
                    onChangeText={handleSearchChange}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    placeholder="Search by name, email, or phone..."
                    placeholderTextColor="#718096"
                    style={styles.searchInput}
                  />
                </View>

                <View style={styles.searchButtons}>
                  <Pressable
                    disabled={searching}
                    onPress={handleSearch}
                    style={({ pressed }) => [
                      styles.searchButton,

                      searching && styles.controlDisabled,

                      pressed && !searching && styles.controlPressed,
                    ]}
                  >
                    {searching ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.searchButtonText}>Search</Text>
                    )}
                  </Pressable>

                  <Pressable
                    disabled={searching}
                    onPress={handleClearSearch}
                    style={({ pressed }) => [
                      styles.clearButton,

                      pressed && !searching && styles.controlPressed,
                    ]}
                  >
                    <Text style={styles.clearButtonText}>Clear</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.listHeading}>
              <Text style={styles.listHeadingTitle}>Role Assignments</Text>

              <Text style={styles.listHeadingMeta}>{totalCount} users</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="account-cog-outline"
              size={40}
              color="#718096"
            />

            <Text style={styles.emptyTitle}>No users found</Text>

            <Text style={styles.emptyText}>
              Try changing the search or role filter.
            </Text>
          </View>
        }
        ListFooterComponent={
          page < lastPage ? (
            <Pressable
              disabled={loadingMore}
              onPress={loadNextPage}
              style={({ pressed }) => [
                styles.loadMoreButton,

                loadingMore && styles.controlDisabled,

                pressed && !loadingMore && styles.controlPressed,
              ]}
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.loadMoreText}>Load More</Text>
              )}
            </Pressable>
          ) : (
            <View style={styles.footerSpace} />
          )
        }
      />
    </View>
  );
}
