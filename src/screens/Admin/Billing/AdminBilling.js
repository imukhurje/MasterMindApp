// src/screens/Admin/Billing/AdminBilling.js

import React, { useCallback, useMemo, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Dropdown } from 'react-native-element-dropdown';

import { api, absoluteUrl, getToken } from '../../../api/client';

import ReactNativeBlobUtil from 'react-native-blob-util';

import styles from './AdminBilling.styles';

import AdminBillingCharges from './AdminBillingCharges';

import AdminBillingTemplates from './AdminBillingTemplates';

import AdminBillingSettings from './AdminBillingSettings';

const PER_PAGE = 50;

const TABS = [
  {
    key: 'payments',
    label: 'Payments',
  },
  {
    key: 'charges',
    label: 'Charges',
  },
  {
    key: 'templates',
    label: 'Templates',
  },
  {
    key: 'settings',
    label: 'Settings',
  },
];

const STATUS_OPTIONS = [
  {
    label: 'All statuses',
    value: 'all',
  },
  {
    label: 'Unpaid',
    value: 'unpaid',
  },
  {
    label: 'Paid',
    value: 'paid',
  },
  {
    label: 'Bill not generated',
    value: 'missing',
  },
];

function formatClassLabel(item) {
  const name = String(item?.name || '').trim();

  const section = String(item?.section || '').trim();

  if (!name) {
    return '';
  }

  return section ? `${name} (${section})` : name;
}

function formatMonthLabel(value) {
  if (!value) {
    return '';
  }

  const [year, month] = String(value).split('-').map(Number);

  if (!year || !month) {
    return value;
  }

  const date = new Date(year, month - 1, 1);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

function createMonthOptions(anchorMonth, count = 12) {
  const parts = String(anchorMonth || '')
    .split('-')
    .map(Number);

  const now = new Date();

  const year = parts[0] || now.getFullYear();

  const month = parts[1] || now.getMonth() + 1;

  return Array.from(
    {
      length: count,
    },
    (_, index) => {
      const date = new Date(year, month - 1 - index, 1);

      const value = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}`;

      return {
        value,
        label: formatMonthLabel(value),
      };
    },
  );
}

function formatMoney(value) {
  const amount = Number(value || 0);

  return `₹${amount.toFixed(2)}`;
}

function normalizeBillMonth(value) {
  const stringValue = String(value || '');

  if (!stringValue) {
    return '';
  }

  return stringValue.slice(0, 7);
}

function MultiSelectorModal({
  visible,
  title,
  searchPlaceholder,
  options,
  selectedValues,
  onToggle,
  onClose,
  allowAll = false,
  allLabel = 'All',
  allSelected = false,
  onToggleAll,
}) {
  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return options;
    }

    return options.filter(option =>
      String(option?.label || '')
        .toLowerCase()
        .includes(search),
    );
  }, [options, query]);

  const handleClose = () => {
    setQuery('');

    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.selectorBackdrop}>
        <View style={styles.selectorModal}>
          <View style={styles.selectorHeader}>
            <Text style={styles.selectorTitle}>{title}</Text>

            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [
                styles.selectorClose,
                pressed && styles.controlPressed,
              ]}
            >
              <MaterialCommunityIcons name="close" size={21} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.selectorSearch}>
            <MaterialCommunityIcons name="magnify" size={19} color="#94A3B8" />

            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor="#718096"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.selectorSearchInput}
            />
          </View>

          {allowAll ? (
            <Pressable
              onPress={onToggleAll}
              style={({ pressed }) => [
                styles.selectorOption,
                allSelected && styles.selectorOptionSelected,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.selectorOptionText}>{allLabel}</Text>

              <MaterialCommunityIcons
                name={
                  allSelected ? 'checkbox-marked' : 'checkbox-blank-outline'
                }
                size={21}
                color={allSelected ? '#93C5FD' : '#94A3B8'}
              />
            </Pressable>
          ) : null}

          <ScrollView
            style={styles.selectorList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {filteredOptions.map(option => {
              const selected = selectedValues.includes(option.value);

              return (
                <Pressable
                  key={String(option.value)}
                  onPress={() => onToggle(option.value)}
                  style={({ pressed }) => [
                    styles.selectorOption,

                    selected && styles.selectorOptionSelected,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.selectorOptionText}>{option.label}</Text>

                  <View style={styles.selectorOptionRight}>
                    <Text style={styles.selectorOptionAction}>
                      {selected ? 'Selected' : 'Select'}
                    </Text>

                    <MaterialCommunityIcons
                      name={
                        selected ? 'checkbox-marked' : 'checkbox-blank-outline'
                      }
                      size={20}
                      color={selected ? '#93C5FD' : '#94A3B8'}
                    />
                  </View>
                </Pressable>
              );
            })}

            {filteredOptions.length === 0 ? (
              <Text style={styles.selectorEmpty}>No results found.</Text>
            ) : null}
          </ScrollView>

          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.selectorDoneButton,

              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.selectorDoneText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function AdminBilling({ navigation }) {
  const insets = useSafeAreaInsets();

  const searchRef = useRef('');

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [downloadingReport, setDownloadingReport] = useState(false);

  const [generatingMissingBills, setGeneratingMissingBills] = useState(false);

  const [activeTab, setActiveTab] = useState('payments');

  const [capabilities, setCapabilities] = useState(null);

  const [generationStatus, setGenerationStatus] = useState(null);

  const [classGroups, setClassGroups] = useState([]);

  const [rows, setRows] = useState([]);

  const [missingStudents, setMissingStudents] = useState([]);

  const [page, setPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const [selectedMonths, setSelectedMonths] = useState([]);

  const [draftSelectedMonths, setDraftSelectedMonths] = useState([]);

  const [selectedClassIds, setSelectedClassIds] = useState([]);

  const [allClassesSelected, setAllClassesSelected] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState('all');

  const [studentSearch, setStudentSearch] = useState('');

  const [monthSelectorVisible, setMonthSelectorVisible] = useState(false);

  const [classSelectorVisible, setClassSelectorVisible] = useState(false);

  const monthOptions = useMemo(
    () => createMonthOptions(generationStatus?.month, 12),
    [generationStatus?.month],
  );

  const classOptions = useMemo(
    () =>
      classGroups.map(item => ({
        value: Number(item?.id),

        label: formatClassLabel(item) || `Class ${item?.id}`,
      })),
    [classGroups],
  );

  const buildPaymentsUrl = useCallback(
    ({ requestedPage = 1, months = [] } = {}) => {
      const params = [`page=${encodeURIComponent(requestedPage)}`];

      const monthValues = Array.isArray(months) ? months : [];

      monthValues.forEach(month => {
        params.push(`months%5B%5D=${encodeURIComponent(month)}`);
      });

      return `/api/billing/v2/payments?${params.join('&')}`;
    },
    [],
  );

  const loadPayments = useCallback(
    async ({ requestedPage = 1, months = [], append = false } = {}) => {
      const response = await api(
        buildPaymentsUrl({
          requestedPage,
          months,
        }),
      );

      const newRows = Array.isArray(response?.rows) ? response.rows : [];

      const newMissing = Array.isArray(response?.missing_bill_students)
        ? response.missing_bill_students
        : [];

      if (append) {
        setRows(current => {
          const map = new Map();

          current.forEach(item => {
            map.set(Number(item?.id), item);
          });

          newRows.forEach(item => {
            map.set(Number(item?.id), item);
          });

          return Array.from(map.values());
        });

        setMissingStudents(current => {
          const map = new Map();

          current.forEach(item => {
            map.set(Number(item?.student_id), item);
          });

          newMissing.forEach(item => {
            map.set(Number(item?.student_id), item);
          });

          return Array.from(map.values());
        });
      } else {
        setRows(newRows);
        setMissingStudents(newMissing);
      }

      setPage(Number(response?.page) || requestedPage);

      setLastPage(Number(response?.last_page) || 1);

      setTotalCount(Number(response?.count) || newRows.length);

      return response;
    },
    [buildPaymentsUrl],
  );

  const loadScreen = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [
          meResponse,
          onboardingResponse,
          capabilitiesResponse,
          generationResponse,
          classGroupsResponse,
        ] = await Promise.all([
          api('/api/me'),

          api('/api/settings/v1/onboarding'),

          api('/api/billing/v2/capabilities'),

          api('/api/billing/v2/generation-status'),

          api('/api/class-groups'),
        ]);

        const role = String(
          meResponse?.primary_role ||
            meResponse?.role ||
            meResponse?.actual_primary_role ||
            meResponse?.actual_role ||
            '',
        )
          .trim()
          .toLowerCase();

        const hasAccess =
          meResponse?.is_admin === true ||
          meResponse?.is_super_admin === true ||
          role === 'admin' ||
          role === 'super_admin' ||
          capabilitiesResponse?.admin === true;

        if (!hasAccess) {
          Alert.alert(
            'Access denied',
            'Only administrators can access billing management.',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ],
          );

          return;
        }

        void onboardingResponse;

        setCapabilities(capabilitiesResponse || null);

        setGenerationStatus(generationResponse || null);

        setClassGroups(
          Array.isArray(classGroupsResponse?.classes)
            ? classGroupsResponse.classes
            : [],
        );

        const initialMonth = String(generationResponse?.month || '').trim();

        const months =
          selectedMonths.length > 0
            ? selectedMonths
            : initialMonth
            ? [initialMonth]
            : [];

        if (selectedMonths.length === 0 && months.length > 0) {
          setSelectedMonths(months);
        }

        await loadPayments({
          requestedPage: 1,
          months,
          append: false,
        });
      } catch (error) {
        console.log('Admin billing load error:', error);

        Alert.alert(
          'Billing',
          error?.message || 'Could not load billing information.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigation, loadPayments],
  );

  useFocusEffect(
    useCallback(() => {
      loadScreen();

      return undefined;
    }, [loadScreen]),
  );

  const handleToggleMonth = useCallback(value => {
    setDraftSelectedMonths(current => {
      if (current.includes(value)) {
        /*
         * Keep at least one month selected.
         */
        if (current.length === 1) {
          return current;
        }

        return current.filter(item => item !== value);
      }

      return [...current, value];
    });
  }, []);

  const handleApplyMonths = useCallback(async () => {
    if (draftSelectedMonths.length === 0) {
      Alert.alert('Billing Months', 'Select at least one billing month.');

      return;
    }

    const months = [...draftSelectedMonths];

    setSelectedMonths(months);
    setMonthSelectorVisible(false);

    try {
      setLoading(true);

      await loadPayments({
        requestedPage: 1,
        months,
        append: false,
      });
    } catch (error) {
      Alert.alert('Payments', error?.message || 'Could not load payments.');
    } finally {
      setLoading(false);
    }
  }, [draftSelectedMonths, loadPayments]);

  const handleToggleClass = useCallback(value => {
    const id = Number(value);

    if (!Number.isFinite(id)) {
      return;
    }

    setAllClassesSelected(false);

    setSelectedClassIds(current => {
      if (current.includes(id)) {
        return current.filter(item => item !== id);
      }

      return [...current, id];
    });
  }, []);

  const handleToggleAllClasses = useCallback(() => {
    setAllClassesSelected(true);
    setSelectedClassIds([]);
  }, []);

  const handleSearchChange = useCallback(value => {
    setStudentSearch(value);
    searchRef.current = value;
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedStatus('all');

    setStudentSearch('');
    searchRef.current = '';

    setAllClassesSelected(true);
    setSelectedClassIds([]);
  }, []);

  const combinedRows = useMemo(
    () => [
      ...missingStudents.map(item => ({
        ...item,

        item_type: 'missing',

        list_key: `missing-${item?.student_id}-${item?.bill_month}`,
      })),

      ...rows.map(item => ({
        ...item,

        item_type: 'bill',

        list_key: `bill-${item?.id}`,
      })),
    ],
    [rows, missingStudents],
  );

  const filteredRows = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();

    return combinedRows.filter(item => {
      if (
        !allClassesSelected &&
        selectedClassIds.length > 0 &&
        !selectedClassIds.includes(Number(item?.class_group_id))
      ) {
        return false;
      }

      if (selectedStatus !== 'all') {
        if (selectedStatus === 'missing' && item?.item_type !== 'missing') {
          return false;
        }

        if (selectedStatus !== 'missing' && item?.item_type === 'missing') {
          return false;
        }

        if (
          selectedStatus !== 'missing' &&
          String(item?.status || '')
            .trim()
            .toLowerCase() !== selectedStatus
        ) {
          return false;
        }
      }

      if (query) {
        const searchable = [
          item?.student_name,
          item?.student_roll,
          item?.class_label,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchable.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [
    combinedRows,
    allClassesSelected,
    selectedClassIds,
    selectedStatus,
    studentSearch,
  ]);

  const handleOpenPayment = useCallback(
    item => {
      const month =
        normalizeBillMonth(item?.bill_month) ||
        selectedMonths[0] ||
        generationStatus?.month ||
        '';

      navigation.navigate('AdminBillingPaymentDetails', {
        itemType: item?.item_type,
        item,
        month,

        bankPaymentAccounts: Array.isArray(capabilities?.bank_payment_accounts)
          ? capabilities.bank_payment_accounts
          : [],
      });
    },
    [navigation, selectedMonths, generationStatus?.month],
  );

  const loadNextPage = useCallback(async () => {
    if (loadingMore || page >= lastPage) {
      return;
    }

    try {
      setLoadingMore(true);

      await loadPayments({
        requestedPage: page + 1,

        months: selectedMonths,

        append: true,
      });
    } catch (error) {
      Alert.alert(
        'Payments',
        error?.message || 'Could not load more payments.',
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, page, lastPage, selectedMonths, loadPayments]);

  const handleDownloadBillingReport = useCallback(async () => {
    if (downloadingReport) {
      return;
    }

    if (selectedMonths.length === 0) {
      Alert.alert('Billing Report', 'Select at least one billing month.');

      return;
    }

    try {
      setDownloadingReport(true);

      const token = await getToken();

      if (!token) {
        throw new Error(
          'Your login session could not be found. Please log in again.',
        );
      }

      const params = [];

      selectedMonths.forEach(month => {
        params.push(`months%5B%5D=${encodeURIComponent(month)}`);
      });

      const path = `/api/billing/v2/payments/report?${params.join('&')}`;

      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
      }).fetch('GET', absoluteUrl(path), {
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      });

      const info = response.info();

      const statusCode = Number(info?.status);

      if (
        !Number.isFinite(statusCode) ||
        statusCode < 200 ||
        statusCode >= 300
      ) {
        throw new Error(
          `Report download failed with HTTP ${statusCode || 'unknown'}.`,
        );
      }

      const tempPath = response.path();

      if (!tempPath) {
        throw new Error('Downloaded report path was not returned.');
      }

      const headers = info?.headers || {};

      const contentDisposition =
        headers['Content-Disposition'] || headers['content-disposition'] || '';

      const contentType = String(
        headers['Content-Type'] || headers['content-type'] || '',
      ).toLowerCase();

      let fileName = '';

      const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

      const normalMatch = contentDisposition.match(/filename="?([^";]+)"?/i);

      if (utfMatch?.[1]) {
        fileName = decodeURIComponent(utfMatch[1]);
      } else if (normalMatch?.[1]) {
        fileName = normalMatch[1].trim();
      }

      if (!fileName) {
        let extension = 'xlsx';

        if (contentType.includes('pdf')) {
          extension = 'pdf';
        } else if (contentType.includes('csv')) {
          extension = 'csv';
        } else if (contentType.includes('zip')) {
          extension = 'zip';
        } else if (
          contentType.includes('spreadsheet') ||
          contentType.includes('excel')
        ) {
          extension = 'xlsx';
        }

        fileName = `Billing-Report-${selectedMonths.join('_')}.${extension}`;
      }

      if (Platform.OS === 'android') {
        const mimeType = contentType || 'application/octet-stream';

        const savedUri =
          await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
            {
              name: fileName,
              parentFolder: 'Billing',
              mimeType,
            },
            'Download',
            tempPath,
          );

        if (!savedUri) {
          throw new Error('Could not save the billing report to Downloads.');
        }

        Alert.alert(
          'Download Complete',
          `Billing report saved in:\n\nDownloads/Billing\n\n${fileName}`,
        );
      } else {
        const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

        await ReactNativeBlobUtil.fs.cp(tempPath, destination);

        Alert.alert(
          'Download Complete',
          `Billing report saved in Documents:\n\n${fileName}`,
        );
      }

      try {
        const exists = await ReactNativeBlobUtil.fs.exists(tempPath);

        if (exists) {
          await ReactNativeBlobUtil.fs.unlink(tempPath);
        }
      } catch (cleanupError) {
        console.log('Billing report temp cleanup error:', cleanupError);
      }
    } catch (error) {
      console.log('Download billing report error:', error);

      Alert.alert(
        'Download Billing Report',
        error?.message || 'Could not download the billing report.',
      );
    } finally {
      setDownloadingReport(false);
    }
  }, [selectedMonths, downloadingReport]);

  const handleGenerateMissingBills = useCallback(() => {
    if (generatingMissingBills) {
      return;
    }

    if (selectedMonths.length !== 1) {
      Alert.alert(
        'Generate Missing Bills',
        'Select exactly one billing month before generating missing bills.',
      );

      return;
    }

    const month = selectedMonths[0];

    const missingCount = missingStudents.length;

    if (missingCount === 0) {
      Alert.alert(
        'Generate Missing Bills',
        'There are no missing bills for the selected month.',
      );

      return;
    }

    Alert.alert(
      'Generate Missing Bills',
      `Generate ${missingCount} missing ${
        missingCount === 1 ? 'bill' : 'bills'
      } for ${formatMonthLabel(month)}? Existing bills will not change.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Generate',

          onPress: async () => {
            try {
              setGeneratingMissingBills(true);

              const response = await api('/api/billing/v2/regenerate-pdf', {
                method: 'POST',

                body: JSON.stringify({
                  month,
                }),
              });

              if (response?.ok !== true) {
                throw new Error('Could not generate the missing bills.');
              }

              /*
               * Refresh the payments data after generation.
               */
              await loadPayments({
                requestedPage: 1,
                months: selectedMonths,
                append: false,
              });

              /*
               * Refresh generation status as well.
               */
              try {
                const generationResponse = await api(
                  '/api/billing/v2/generation-status',
                );

                setGenerationStatus(generationResponse || null);
              } catch (generationError) {
                console.log(
                  'Generation status refresh error:',
                  generationError,
                );
              }

              Alert.alert(
                'Missing Bills',
                `Generation completed.\n\nGenerated: ${
                  Number(response?.generated) || 0
                }\nRegenerated: ${Number(response?.regenerated) || 0}`,
              );
            } catch (error) {
              console.log('Generate missing bills error:', error);

              Alert.alert(
                'Generate Missing Bills',
                error?.message || 'Could not generate the missing bills.',
              );
            } finally {
              setGeneratingMissingBills(false);
            }
          },
        },
      ],
    );
  }, [
    generatingMissingBills,
    selectedMonths,
    missingStudents.length,
    loadPayments,
  ]);

  const renderPayment = useCallback(
    ({ item }) => {
      const missing = item?.item_type === 'missing';

      const status = missing
        ? 'Bill not generated'
        : String(item?.status || '').trim();

      const paid = status.toLowerCase() === 'paid';

      return (
        <Pressable
          onPress={() => handleOpenPayment(item)}
          style={({ pressed }) => [
            styles.paymentCard,

            pressed && styles.controlPressed,
          ]}
        >
          <View style={styles.paymentHeader}>
            <View style={styles.paymentHeaderText}>
              <Text style={styles.studentName}>
                {item?.student_name || 'Student'}
              </Text>

              <Text style={styles.studentMeta}>
                {item?.class_label || 'No class'}
                {item?.student_roll ? ` · Roll ${item.student_roll}` : ''}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,

                missing
                  ? styles.missingBadge
                  : paid
                  ? styles.paidBadge
                  : styles.unpaidBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,

                  missing
                    ? styles.missingBadgeText
                    : paid
                    ? styles.paidBadgeText
                    : styles.unpaidBadgeText,
                ]}
              >
                {status}
              </Text>
            </View>
          </View>

          <View style={styles.paymentDivider} />

          <View style={styles.paymentBottom}>
            <View>
              <Text style={styles.monthLabel}>Billing month</Text>

              <Text style={styles.monthValue}>
                {formatMonthLabel(normalizeBillMonth(item?.bill_month))}
              </Text>
            </View>

            {!missing ? (
              <View style={styles.amountArea}>
                <Text style={styles.amountLabel}>Amount</Text>

                <Text style={styles.amountValue}>
                  {formatMoney(item?.amount)}
                </Text>
              </View>
            ) : (
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#93C5FD"
              />
            )}
          </View>
        </Pressable>
      );
    },
    [handleOpenPayment],
  );

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading billing...</Text>
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
      <View style={styles.tabs}>
        {TABS.map(tab => {
          const active = tab.key === activeTab;

          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={({ pressed }) => [
                styles.tabButton,

                active && styles.tabButtonActive,

                pressed && styles.controlPressed,
              ]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'payments' ? (
        <FlatList
          data={filteredRows}
          keyExtractor={item => item.list_key}
          renderItem={renderPayment}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
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
              <View style={styles.paymentReportAction}>
                <Pressable
                  disabled={downloadingReport}
                  onPress={handleDownloadBillingReport}
                  style={({ pressed }) => [
                    styles.downloadReportButton,

                    downloadingReport && styles.controlDisabled,

                    pressed && !downloadingReport && styles.controlPressed,
                  ]}
                >
                  {downloadingReport ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name="download-outline"
                        size={19}
                        color="#FFFFFF"
                      />

                      <Text style={styles.downloadReportButtonText}>
                        Download Billing Report
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
              <View style={styles.selectorGrid}>
                <View style={styles.filterBlock}>
                  <Text style={styles.filterLabel}>Billing months</Text>

                  <Pressable
                    onPress={() => {
                      setDraftSelectedMonths([...selectedMonths]);
                      setMonthSelectorVisible(true);
                    }}
                    style={styles.multiSelectField}
                  >
                    <Text style={styles.multiSelectPlaceholder}>
                      Search and select months
                    </Text>

                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={20}
                      color="#AFC0D8"
                    />
                  </Pressable>

                  <View style={styles.chipRow}>
                    {selectedMonths.map(month => (
                      <View key={month} style={styles.filterChip}>
                        <Text style={styles.filterChipText}>
                          {formatMonthLabel(month)}
                        </Text>

                        {selectedMonths.length > 1 ? (
                          <Pressable
                            onPress={() => handleToggleMonth(month)}
                            hitSlop={6}
                          >
                            <MaterialCommunityIcons
                              name="close"
                              size={14}
                              color="#DCE7F5"
                            />
                          </Pressable>
                        ) : null}
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.filterBlock}>
                  <Text style={styles.filterLabel}>Classes</Text>

                  <Pressable
                    onPress={() => setClassSelectorVisible(true)}
                    style={styles.multiSelectField}
                  >
                    <Text style={styles.multiSelectPlaceholder}>
                      Search and select classes
                    </Text>

                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={20}
                      color="#AFC0D8"
                    />
                  </Pressable>

                  <View style={styles.chipRow}>
                    {allClassesSelected ? (
                      <View style={styles.filterChip}>
                        <Text style={styles.filterChipText}>All Classes</Text>
                      </View>
                    ) : (
                      classOptions
                        .filter(option =>
                          selectedClassIds.includes(option.value),
                        )
                        .map(option => (
                          <View
                            key={String(option.value)}
                            style={styles.filterChip}
                          >
                            <Text style={styles.filterChipText}>
                              {option.label}
                            </Text>
                          </View>
                        ))
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.searchPanel}>
                <View style={styles.statusField}>
                  <Text style={styles.filterLabel}>Payment Status</Text>

                  <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    selectedTextStyle={styles.dropdownSelectedText}
                    itemTextStyle={styles.dropdownItemText}
                    placeholderStyle={styles.dropdownPlaceholder}
                    activeColor="#173B60"
                    iconColor="#DCE7F5"
                    data={STATUS_OPTIONS}
                    labelField="label"
                    valueField="value"
                    value={selectedStatus}
                    onChange={item => setSelectedStatus(item?.value || 'all')}
                  />
                </View>

                <View style={styles.studentSearchField}>
                  <Text style={styles.filterLabel}>Student Name</Text>

                  <View style={styles.studentSearchBox}>
                    <MaterialCommunityIcons
                      name="magnify"
                      size={19}
                      color="#94A3B8"
                    />

                    <TextInput
                      value={studentSearch}
                      onChangeText={handleSearchChange}
                      placeholder="Search students"
                      placeholderTextColor="#718096"
                      style={styles.studentSearchInput}
                    />
                  </View>
                </View>

                <View style={styles.searchActionRow}>
                  <Pressable
                    disabled={generatingMissingBills}
                    onPress={handleGenerateMissingBills}
                    style={({ pressed }) => [
                      styles.generateButton,

                      generatingMissingBills && styles.controlDisabled,

                      pressed &&
                        !generatingMissingBills &&
                        styles.controlPressed,
                    ]}
                  >
                    {generatingMissingBills ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.generateButtonText}>
                        Generate missing bills
                      </Text>
                    )}
                  </Pressable>

                  <Pressable
                    onPress={handleClearFilters}
                    style={({ pressed }) => [
                      styles.clearButton,

                      pressed && styles.controlPressed,
                    ]}
                  >
                    <Text style={styles.clearButtonText}>Clear</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.listHeading}>
                <View>
                  <Text style={styles.listHeadingTitle}>Payments</Text>

                  <Text style={styles.listHeadingSubtitle}>
                    {missingStudents.length} bills not generated · {totalCount}{' '}
                    generated
                  </Text>
                </View>

                {generationStatus?.has_bills ? (
                  <View style={styles.generatedBadge}>
                    <Text style={styles.generatedBadgeText}>
                      Bills generated
                    </Text>
                  </View>
                ) : null}
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="cash-remove"
                size={38}
                color="#718096"
              />

              <Text style={styles.emptyTitle}>No payments found</Text>

              <Text style={styles.emptyText}>
                Try changing the current filters.
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
      ) : activeTab === 'charges' ? (
        <AdminBillingCharges classGroups={classGroups} />
      ) : activeTab === 'templates' ? (
        <AdminBillingTemplates />
      ) : activeTab === 'settings' ? (
        <AdminBillingSettings />
      ) : (
        <View style={styles.placeholderCard}>
          <MaterialCommunityIcons name="tools" size={32} color="#718096" />

          <Text style={styles.placeholderTitle}>
            {TABS.find(item => item.key === activeTab)?.label}
          </Text>

          <Text style={styles.placeholderText}>
            This tab is ready for its API integration.
          </Text>
        </View>
      )}

      <MultiSelectorModal
        visible={monthSelectorVisible}
        title="Billing Months"
        searchPlaceholder="Search months..."
        options={monthOptions}
        selectedValues={draftSelectedMonths}
        onToggle={handleToggleMonth}
        onClose={handleApplyMonths}
      />

      <MultiSelectorModal
        visible={classSelectorVisible}
        title="Classes"
        searchPlaceholder="Search classes..."
        options={classOptions}
        selectedValues={selectedClassIds}
        onToggle={handleToggleClass}
        allowAll
        allLabel="All Classes"
        allSelected={allClassesSelected}
        onToggleAll={handleToggleAllClasses}
        onClose={() => setClassSelectorVisible(false)}
      />
    </View>
  );
}
