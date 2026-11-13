// src/screens/Admin/Examinations/AdminExaminations.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../../api/client';
import styles from './AdminExaminations.styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AdminCreateExaminationWizard from './AdminCreateExaminationWizard';

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

function SelectField({
  value,
  options,
  onChange,
  disabled = false,
  accessibilityLabel,
}) {
  const [open, setOpen] = useState(false);
  const selectedOption =
    options.find(option => option.value === value) || options[0];

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          styles.selectField,
          disabled && styles.controlDisabled,
          pressed && !disabled && styles.controlPressed,
        ]}
      >
        <Text numberOfLines={1} style={styles.selectText}>
          {selectedOption?.label || 'Select'}
        </Text>
        <Text style={styles.selectArrow}>▼</Text>
      </Pressable>

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <Pressable
            style={styles.modalCard}
            onPress={event => event.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Select status</Text>

            {options.map(option => {
              const selected = option.value === value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.modalOption,
                    selected && styles.modalOptionSelected,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selected && styles.modalOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>

                  {selected ? (
                    <Text style={styles.modalOptionCheck}>✓</Text>
                  ) : null}
                </Pressable>
              );
            })}

            <Pressable
              onPress={() => setOpen(false)}
              style={({ pressed }) => [
                styles.modalCloseButton,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function formatStatus(status) {
  return String(status || 'unknown')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function formatDateTime(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getStatusStyle(status) {
  const normalized = formatStatus(status);

  if (normalized === 'published') {
    return styles.statusPublished;
  }

  if (normalized === 'result_published') {
    return styles.statusResultPublished;
  }

  return styles.statusDraft;
}

export default function AdminExaminations({ navigation }) {
  const insets = useSafeAreaInsets();
  const latestRequestId = useRef(0);

  const [currentUser, setCurrentUser] = useState(null);
  const [examinations, setExaminations] = useState([]);

  const [tutorialEnabled, setTutorialEnabled] = useState(false);
  const [tutorialClasses, setTutorialClasses] = useState([]);

  const [onboardingData, setOnboardingData] = useState(null);

  const [draftExaminationCount, setDraftExaminationCount] = useState(0);

  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [showInactive, setShowInactive] = useState(false);
  const [activatingId, setActivatingId] = useState(null);

  const examinationCount = useMemo(() => examinations.length, [examinations]);

  const loadCurrentUser = useCallback(async () => {
    const response = await api('/api/me');

    const role = String(
      response?.primary_role ||
        response?.role ||
        response?.actual_primary_role ||
        response?.actual_role ||
        '',
    ).toLowerCase();

    const hasAccess =
      response?.is_admin === true ||
      response?.is_super_admin === true ||
      role === 'admin' ||
      role === 'super_admin' ||
      role === 'teacher';

    if (!hasAccess) {
      Alert.alert(
        'Access denied',
        'Only administrators and teachers can open this page.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );

      return null;
    }

    setCurrentUser({
      ...response,
      resolved_role: role,
    });

    return {
      ...response,
      resolved_role: role,
    };
  }, [navigation]);

  const loadTutorialMeta = useCallback(async () => {
    try {
      const response = await api('/api/tutorial-evaluations/v1/meta');

      const enabled = response?.enabled === true;

      setTutorialEnabled(enabled);

      setTutorialClasses(
        Array.isArray(response?.classes) ? response.classes : [],
      );

      return response;
    } catch (error) {
      console.log('[TUTORIAL META ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      // Hide button if availability cannot be verified.
      setTutorialEnabled(false);
      setTutorialClasses([]);

      return null;
    }
  }, []);

  const loadOnboardingData = useCallback(async () => {
    try {
      const response = await api('/api/settings/v1/onboarding');

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid onboarding response.');
      }

      setOnboardingData(response);

      return response;
    } catch (error) {
      console.log('[EXAM ONBOARDING ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      setOnboardingData(null);

      return null;
    }
  }, []);

  const loadExaminations = useCallback(
    async (searchValue = '', inactiveValue = false) => {
      const requestId = latestRequestId.current + 1;
      latestRequestId.current = requestId;

      try {
        setListLoading(true);

        const normalizedSearch = String(searchValue || '').trim();
        const inactive = inactiveValue ? 1 : 0;

        const response = await api(
          `/api/examinations/v1?search=${encodeURIComponent(
            normalizedSearch,
          )}&inactive=${inactive}`,
        );

        if (requestId !== latestRequestId.current) {
          return;
        }

        const rows = Array.isArray(response?.data) ? response.data : [];

        setExaminations(rows);

        // Prefer the backend-provided draft count.
        if (
          !inactiveValue &&
          Number.isFinite(Number(response?.draft_count)) &&
          response?.draft_count !== null &&
          response?.draft_count !== undefined
        ) {
          setDraftExaminationCount(Math.max(0, Number(response.draft_count)));
        }
      } catch (error) {
        if (requestId !== latestRequestId.current) {
          return;
        }

        console.log('Examinations API error:', error);
        setExaminations([]);

        Alert.alert(
          'Examinations',
          error?.message || 'Could not load examinations.',
        );
      } finally {
        if (requestId === latestRequestId.current) {
          setListLoading(false);
        }
      }
    },
    [],
  );

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Verify current user and allowed role.
      const me = await loadCurrentUser();

      if (!me) return;

      // 2, 3, 4. Load page data.
      // Individual loaders handle their own errors.
      await Promise.all([
        loadTutorialMeta(),
        loadExaminations('', false),
        loadOnboardingData(),
      ]);
    } catch (error) {
      console.log('[EXAM INITIAL LOAD ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      Alert.alert(
        'Examinations',
        error?.message || 'Could not open examinations.',
      );
    } finally {
      setLoading(false);
    }
  }, [loadCurrentUser, loadTutorialMeta, loadExaminations, loadOnboardingData]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const hasFocusedOnceRef = useRef(false);

  const appliedFiltersRef = useRef({
    search: '',
    inactive: false,
  });

  useEffect(() => {
    appliedFiltersRef.current = {
      search: appliedSearch,
      inactive: showInactive,
    };
  }, [appliedSearch, showInactive]);

  useFocusEffect(
    useCallback(() => {
      if (!hasFocusedOnceRef.current) {
        hasFocusedOnceRef.current = true;
        return;
      }

      const { search, inactive } = appliedFiltersRef.current;

      loadExaminations(search, inactive);
    }, [loadExaminations]),
  );

  async function applySearch() {
    const normalizedSearch = searchText.trim();

    setAppliedSearch(normalizedSearch);

    await loadExaminations(normalizedSearch, showInactive);
  }

  async function clearSearch() {
    setSearchText('');
    setAppliedSearch('');

    await loadExaminations('', showInactive);
  }

  async function refreshExaminations() {
    if (refreshing) return;

    try {
      setRefreshing(true);

      const me = await loadCurrentUser();

      if (!me) return;

      await Promise.all([
        loadTutorialMeta(),
        loadExaminations(appliedSearch, showInactive),
        loadOnboardingData(),
      ]);
    } catch (error) {
      console.log('[EXAM REFRESH ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      Alert.alert(
        'Refresh Failed',
        error?.message || 'Could not refresh examinations.',
      );
    } finally {
      setRefreshing(false);
    }
  }

  async function toggleInactiveExaminations() {
    if (listLoading || refreshing) {
      return;
    }

    const nextValue = !showInactive;

    setShowInactive(nextValue);

    await loadExaminations(appliedSearch, nextValue);
  }

  function openCreateModal() {
    navigation.navigate('AdminCreateExaminationWizard');
  }

  function openExamination(item) {
    navigation.navigate('AdminExaminationDetails', {
      examinationId: item?.id,
      examinationName: item?.name,
    });
  }

  async function activateExamination(item) {
    if (!item?.id || activatingId !== null) {
      return;
    }

    try {
      setActivatingId(item.id);

      const response = await api(`/api/examinations/v1/${item.id}/active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: true,
        }),
      });

      if (response?.ok !== true) {
        throw new Error('Could not activate the examination.');
      }

      // Reload the current inactive examination list.
      await loadExaminations(appliedSearch, true);

      Alert.alert(
        'Examination activated',
        'The examination was activated successfully.',
      );
    } catch (error) {
      console.log('Activate examination error:', error);

      Alert.alert(
        'Activation failed',
        error?.message || 'Could not activate the examination.',
      );
    } finally {
      setActivatingId(null);
    }
  }

  function renderExamination({ item }) {
    const status = formatStatus(item?.status);

    return (
      <View style={styles.examinationCard}>
        <View style={styles.examinationMain}>
          <Text numberOfLines={2} style={styles.examinationName}>
            {item?.name || 'Unnamed examination'}
          </Text>

          <View style={styles.metadataRow}>
            <View style={[styles.statusBadge, getStatusStyle(status)]}>
              <Text
                style={[
                  styles.statusText,
                  status === 'draft' && styles.statusDraftText,
                ]}
              >
                {status}
              </Text>
            </View>

            <View style={styles.paperBadge}>
              <Text style={styles.paperLabel}>Papers</Text>
              <Text style={styles.paperCount}>
                {Number(item?.exams_count || 0)}
              </Text>
            </View>
          </View>

          <Text style={styles.updatedLabel}>Updated</Text>
          <Text style={styles.updatedValue}>
            {formatDateTime(item?.updated_at)}
          </Text>
        </View>

        <View style={styles.rowActionCell}>
          {showInactive ? (
            <Pressable
              onPress={() => activateExamination(item)}
              disabled={activatingId !== null || listLoading || refreshing}
              accessibilityRole="button"
              accessibilityLabel={`Activate ${item?.name || 'examination'}`}
              style={({ pressed }) => [
                styles.activateButton,
                (activatingId !== null || listLoading || refreshing) &&
                  styles.controlDisabled,
                pressed &&
                  activatingId === null &&
                  !listLoading &&
                  !refreshing &&
                  styles.controlPressed,
              ]}
            >
              {activatingId === item?.id ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.activateButtonText}>Activate</Text>
              )}
            </Pressable>
          ) : (
            <Pressable
              onPress={() => openExamination(item)}
              accessibilityRole="button"
              accessibilityLabel={`Manage ${item?.name || 'examination'}`}
              style={({ pressed }) => [
                styles.manageActionButton,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.manageButtonText}>Manage</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading examinations...</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.screen, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      {/* Examination Top Actions */}
      <View style={styles.createActionBar}>
        <Pressable
          onPress={openCreateModal}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.topCreateButton,
            pressed && styles.controlPressed,
          ]}
        >
          <Text style={styles.topCreateButtonText}>+ Create</Text>
        </Pressable>

        {/* Show only when tutorial API returns enabled: true */}
        {tutorialEnabled && (
          <Pressable
            onPress={() => navigation.navigate('AdminTutorialEvaluation')}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.tutorialButton,
              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.tutorialButtonText}>Record Tutorial Marks</Text>
          </Pressable>
        )}
      </View>

      {/* Draft Examination Warning */}
      {draftExaminationCount > 0 && !showInactive && (
        <View style={styles.draftWarningBox}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={20}
            color="#F59E0B"
          />

          <Text style={styles.draftWarningText}>
            There {draftExaminationCount === 1 ? 'is' : 'are'}{' '}
            {draftExaminationCount}{' '}
            {draftExaminationCount === 1 ? 'examination' : 'examinations'} in
            draft mode. Students and parents cannot access their papers until
            they are scheduled and published.
          </Text>
        </View>
      )}

      <View style={styles.listSection}>
        <View style={styles.searchRow}>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search examinations..."
            placeholderTextColor="#64748B"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={applySearch}
            style={styles.searchInput}
          />

          {searchText || appliedSearch ? (
            <Pressable
              onPress={clearSearch}
              disabled={listLoading}
              style={({ pressed }) => [
                styles.clearButton,
                listLoading && styles.controlDisabled,
                pressed && !listLoading && styles.controlPressed,
              ]}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={applySearch}
            disabled={listLoading}
            style={({ pressed }) => [
              styles.searchButton,
              listLoading && styles.controlDisabled,
              pressed && !listLoading && styles.controlPressed,
            ]}
          >
            {listLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </Pressable>

          <Pressable
            onPress={toggleInactiveExaminations}
            disabled={listLoading || refreshing}
            accessibilityRole="checkbox"
            accessibilityLabel="Show inactive examinations"
            accessibilityState={{
              checked: showInactive,
              disabled: listLoading || refreshing,
            }}
            style={({ pressed }) => [
              styles.inactiveToggle,
              (listLoading || refreshing) && styles.controlDisabled,
              pressed && !listLoading && !refreshing && styles.controlPressed,
            ]}
          >
            <View
              style={[
                styles.inactiveCheckbox,
                showInactive && styles.inactiveCheckboxSelected,
              ]}
            >
              {showInactive ? (
                <Text style={styles.inactiveCheckmark}>✓</Text>
              ) : null}
            </View>

            <Text style={styles.inactiveToggleText}>
              Show Inactive Examinations
            </Text>
          </Pressable>

          <Pressable
            onPress={refreshExaminations}
            disabled={refreshing || listLoading}
            style={({ pressed }) => [
              styles.refreshButton,
              (refreshing || listLoading) && styles.controlDisabled,
              pressed && !refreshing && !listLoading && styles.controlPressed,
            ]}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </Pressable>
        </View>

        <View style={styles.countRow}>
          <Text style={styles.countText}>
            Showing {examinationCount}{' '}
            {examinationCount === 1 ? 'examination' : 'examinations'}
          </Text>
        </View>

        <FlatList
          data={examinations}
          keyExtractor={item => String(item?.id)}
          renderItem={renderExamination}
          style={styles.list}
          contentContainerStyle={
            examinations.length === 0
              ? styles.emptyListContent
              : styles.listContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshExaminations}
              tintColor="#FFFFFF"
              colors={['#FFFFFF']}
            />
          }
          ListEmptyComponent={
            listLoading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" />
                <Text style={styles.emptyStateText}>
                  Loading examinations...
                </Text>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>
                  No examinations found
                </Text>
                <Text style={styles.emptyStateText}>
                  Change the search text or refresh the list.
                </Text>
              </View>
            )
          }
        />
      </View>
    </View>
  );
}
