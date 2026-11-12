// src/screens/Admin/Admission/AdminAdmissions.js

import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Dropdown } from 'react-native-element-dropdown';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../api/client';

import styles from './AdminAdmissions.styles';

const PER_PAGE = 50;

const STATUS_OPTIONS = [
  {
    label: 'All Statuses',
    value: null,
  },
  {
    label: 'Submitted',
    value: 'submitted',
  },
  {
    label: 'Passed',
    value: 'passed',
  },
  {
    label: 'Admission Scheduled',
    value: 'admission_scheduled',
  },
  {
    label: 'Admitted',
    value: 'admitted',
  },
  {
    label: 'Rejected',
    value: 'rejected',
  },
];

function formatDate(value) {
  if (!value) {
    return 'Not available';
  }

  const parts = String(value).split('-');

  if (parts.length !== 3) {
    return String(value);
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatGender(value) {
  const gender = String(value || '')
    .trim()
    .toLowerCase();

  if (!gender) {
    return 'Not available';
  }

  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

export default function AdminAdmissions({ navigation }) {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [pageLoading, setPageLoading] = useState(false);

  const [me, setMe] = useState(null);

  const [options, setOptions] = useState(null);

  const [onboarding, setOnboarding] = useState(null);

  const [items, setItems] = useState([]);

  const [page, setPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const [from, setFrom] = useState(0);

  const [to, setTo] = useState(0);

  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);

  const [selectedClassLevelId, setSelectedClassLevelId] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState(null);

  const [searchText, setSearchText] = useState('');

  const [updatingAdmissionId, setUpdatingAdmissionId] = useState(null);

  const [allocationModalVisible, setAllocationModalVisible] = useState(false);

  const [allocationLoading, setAllocationLoading] = useState(false);

  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const [allocationOptions, setAllocationOptions] = useState([]);

  const [selectedAllocationId, setSelectedAllocationId] = useState(null);

  const [loadingAllocationAdmissionId, setLoadingAllocationAdmissionId] =
    useState(null);

  const [scheduleRollNo, setScheduleRollNo] = useState('');

  const [schedulingAdmission, setSchedulingAdmission] = useState(false);

  const [removingScheduleAdmissionId, setRemovingScheduleAdmissionId] =
    useState(null);

  const [materializingAdmissions, setMaterializingAdmissions] = useState(false);

  const loadAdmissions = useCallback(
    async ({ academicYearId, requestedPage = 1, showLoader = false }) => {
      if (!Number.isFinite(Number(academicYearId))) {
        return;
      }

      try {
        if (showLoader) {
          setPageLoading(true);
        }

        const response = await api(
          `/api/admissions/admin/list` +
            `?academic_year_id=${encodeURIComponent(academicYearId)}` +
            `&page=${encodeURIComponent(requestedPage)}` +
            `&per_page=${PER_PAGE}`,
        );

        setItems(Array.isArray(response?.items) ? response.items : []);

        setTotalCount(Number(response?.count) || 0);

        setPage(Number(response?.page) || requestedPage);

        setLastPage(Number(response?.last_page) || 1);

        setFrom(Number(response?.from) || 0);

        setTo(Number(response?.to) || 0);
      } catch (error) {
        console.log('Admissions list error:', error);

        Alert.alert(
          'Admissions',
          error?.message || 'Could not load admissions.',
        );
      } finally {
        setPageLoading(false);
      }
    },
    [],
  );

  const loadScreen = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        /*
         * Initial API calls.
         */
        const [meResponse, optionsResponse, onboardingResponse] =
          await Promise.all([
            api('/api/me'),

            api('/api/admissions/admin/options'),

            api('/api/settings/v1/onboarding'),
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
          role === 'super_admin';

        if (!hasAccess) {
          Alert.alert(
            'Access denied',
            'Only administrators can view admissions.',
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

        setOptions(optionsResponse || null);

        setOnboarding(onboardingResponse || null);

        const defaultYearId = Number(
          selectedAcademicYearId ||
            optionsResponse?.default_academic_year_id ||
            onboardingResponse?.academic_year?.id,
        );

        if (Number.isFinite(defaultYearId)) {
          setSelectedAcademicYearId(defaultYearId);

          await loadAdmissions({
            academicYearId: defaultYearId,

            requestedPage: 1,
          });
        }
      } catch (error) {
        console.log('Admissions screen error:', error);

        Alert.alert(
          'Admissions',
          error?.message || 'Could not load the admissions page.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigation, selectedAcademicYearId, loadAdmissions],
  );

  useFocusEffect(
    useCallback(() => {
      loadScreen();

      return undefined;
    }, [loadScreen]),
  );

  const academicYearOptions = useMemo(() => {
    const rows = Array.isArray(options?.academic_year_options)
      ? options.academic_year_options
      : [];

    return rows
      .filter(item => item?.available !== false)
      .map(item => ({
        label: item?.name || item?.code || `Year ${item?.id}`,

        value: item?.id,
      }));
  }, [options?.academic_year_options]);

  const classLevelOptions = useMemo(() => {
    const rows = Array.isArray(options?.class_level_options)
      ? options.class_level_options
      : [];

    return [
      {
        label: 'All Classes',
        value: null,
      },

      ...rows
        .filter(item => item?.available !== false)
        .map(item => ({
          label: item?.name || item?.code || `Class ${item?.id}`,

          value: item?.id,
        })),
    ];
  }, [options?.class_level_options]);

  const visibleItems = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return items.filter(item => {
      const matchesSearch =
        !query ||
        String(item?.student_name || '')
          .toLowerCase()
          .includes(query) ||
        String(item?.parents || '')
          .toLowerCase()
          .includes(query) ||
        String(item?.application_no || '')
          .toLowerCase()
          .includes(query);

      const matchesClass =
        !selectedClassLevelId ||
        Number(item?.class_level_id) === Number(selectedClassLevelId);

      const matchesStatus =
        !selectedStatus ||
        String(item?.status || '')
          .trim()
          .toLowerCase() === selectedStatus;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [items, searchText, selectedClassLevelId, selectedStatus]);

  const handleAcademicYearChange = useCallback(
    async item => {
      const yearId = Number(item?.value);

      if (!Number.isFinite(yearId)) {
        return;
      }

      setSelectedAcademicYearId(yearId);

      setSelectedClassLevelId(null);

      setSelectedStatus(null);

      setSearchText('');

      await loadAdmissions({
        academicYearId: yearId,

        requestedPage: 1,

        showLoader: true,
      });
    },
    [loadAdmissions],
  );

  const handleClearFilters = useCallback(() => {
    setSearchText('');
    setSelectedClassLevelId(null);
    setSelectedStatus(null);
  }, []);

  const goToPage = useCallback(
    async nextPage => {
      if (
        !selectedAcademicYearId ||
        pageLoading ||
        nextPage < 1 ||
        nextPage > lastPage
      ) {
        return;
      }

      await loadAdmissions({
        academicYearId: selectedAcademicYearId,

        requestedPage: nextPage,

        showLoader: true,
      });
    },
    [selectedAcademicYearId, pageLoading, lastPage, loadAdmissions],
  );

  const handleCloseAllocationModal = useCallback(() => {
    if (schedulingAdmission) {
      return;
    }

    setAllocationModalVisible(false);

    setSelectedAdmission(null);

    setAllocationOptions([]);

    setSelectedAllocationId(null);

    setScheduleRollNo('');
  }, [schedulingAdmission]);

  const handleConfirmAllocation = useCallback(async () => {
    const admissionId = Number(selectedAdmission?.id);

    const classGroupId = Number(selectedAllocationId);

    const rollNo = String(scheduleRollNo || '').trim();

    if (!Number.isFinite(admissionId)) {
      Alert.alert('Admission Scheduled', 'A valid admission ID is required.');

      return;
    }

    if (!Number.isFinite(classGroupId)) {
      Alert.alert(
        'Admission Scheduled',
        'Please select a destination offering.',
      );

      return;
    }

    if (!rollNo) {
      Alert.alert(
        'Admission Scheduled',
        'Please enter the student roll number.',
      );

      return;
    }

    if (schedulingAdmission) {
      return;
    }

    try {
      setSchedulingAdmission(true);

      const response = await api('/api/admissions/admin/status', {
        method: 'POST',

        body: JSON.stringify({
          id: admissionId,

          action: 'schedule',

          class_group_id: classGroupId,

          roll_no: rollNo,
        }),
      });

      if (
        String(response?.status || '')
          .trim()
          .toLowerCase() !== 'admission_scheduled'
      ) {
        throw new Error(
          response?.message || 'Could not schedule the admission.',
        );
      }

      /*
       * Close the modal first.
       */
      setAllocationModalVisible(false);

      setSelectedAdmission(null);

      setAllocationOptions([]);

      setSelectedAllocationId(null);

      setScheduleRollNo('');

      /*
       * Refresh the current admission list.
       */
      await loadAdmissions({
        academicYearId: selectedAcademicYearId,

        requestedPage: page,

        showLoader: false,
      });

      Alert.alert(
        'Admission Scheduled',
        response?.message ||
          'Student has been marked as admitted and the admission process will be completed at day end.',
      );
    } catch (error) {
      console.log('Schedule admission error:', error);

      Alert.alert(
        'Admission Scheduled',
        error?.message || 'Could not schedule the admission.',
      );
    } finally {
      setSchedulingAdmission(false);
    }
  }, [
    selectedAdmission?.id,
    selectedAllocationId,
    scheduleRollNo,
    schedulingAdmission,
    selectedAcademicYearId,
    page,
    loadAdmissions,
  ]);

  const handleMarkAsPassed = useCallback(
    async item => {
      const admissionId = Number(item?.id);

      if (!Number.isFinite(admissionId)) {
        Alert.alert('Admissions', 'A valid admission ID is required.');

        return;
      }

      if (updatingAdmissionId !== null) {
        return;
      }

      try {
        setUpdatingAdmissionId(admissionId);

        const response = await api('/api/admissions/admin/status', {
          method: 'POST',

          body: JSON.stringify({
            id: admissionId,
            action: 'pass',
          }),
        });

        if (
          String(response?.status || '')
            .trim()
            .toLowerCase() !== 'passed'
        ) {
          throw new Error(
            response?.message || 'Could not mark the application as passed.',
          );
        }

        /*
         * Reload the current admissions list
         * after the status has been updated.
         */
        await loadAdmissions({
          academicYearId: selectedAcademicYearId,

          requestedPage: page,

          showLoader: false,
        });

        Alert.alert(
          'Admissions',
          response?.message || 'Application marked as Passed.',
        );
      } catch (error) {
        console.log('Admission pass status error:', error);

        Alert.alert(
          'Admissions',
          error?.message || 'Could not update the admission status.',
        );
      } finally {
        setUpdatingAdmissionId(null);
      }
    },
    [updatingAdmissionId, selectedAcademicYearId, page, loadAdmissions],
  );

  const handleAdmissionScheduledPress = useCallback(
    async item => {
      const admissionId = Number(item?.id);

      if (!Number.isFinite(admissionId)) {
        Alert.alert('Admissions', 'A valid admission ID is required.');

        return;
      }

      if (loadingAllocationAdmissionId !== null) {
        return;
      }

      try {
        setLoadingAllocationAdmissionId(admissionId);

        const response = await api(
          `/api/admissions/admin/${encodeURIComponent(admissionId)}`,
        );

        const optionsList = Array.isArray(response?.allocation_options)
          ? response.allocation_options
          : [];

        if (optionsList.length === 0) {
          Alert.alert(
            'Admission Scheduled',
            'No destination offering is available for this application.',
          );

          return;
        }

        setSelectedAdmission(response);

        setAllocationOptions(optionsList);

        setScheduleRollNo('');

        setSelectedAllocationId(Number(optionsList[0]?.id));

        setAllocationModalVisible(true);
      } catch (error) {
        console.log('Admission allocation options error:', error);

        Alert.alert(
          'Admission Scheduled',
          error?.message || 'Could not load destination offerings.',
        );
      } finally {
        setLoadingAllocationAdmissionId(null);
      }
    },
    [loadingAllocationAdmissionId],
  );

  const handleRemoveAdmissionSchedule = useCallback(
    async item => {
      const admissionId = Number(item?.id);

      if (!Number.isFinite(admissionId)) {
        Alert.alert('Admission Scheduled', 'A valid admission ID is required.');

        return;
      }

      if (removingScheduleAdmissionId !== null) {
        return;
      }

      try {
        setRemovingScheduleAdmissionId(admissionId);

        const response = await api('/api/admissions/admin/status', {
          method: 'POST',

          body: JSON.stringify({
            id: admissionId,
            action: 'schedule',
          }),
        });

        if (
          String(response?.status || '')
            .trim()
            .toLowerCase() !== 'passed'
        ) {
          throw new Error(
            response?.message || 'Could not remove the admission schedule.',
          );
        }

        await loadAdmissions({
          academicYearId: selectedAcademicYearId,
          requestedPage: page,
          showLoader: false,
        });

        Alert.alert(
          'Admission Scheduled',
          response?.message ||
            'Admission schedule removed; status reset to Passed.',
        );
      } catch (error) {
        console.log('Remove admission schedule error:', error);

        Alert.alert(
          'Admission Scheduled',
          error?.message || 'Could not remove the admission schedule.',
        );
      } finally {
        setRemovingScheduleAdmissionId(null);
      }
    },
    [removingScheduleAdmissionId, selectedAcademicYearId, page, loadAdmissions],
  );

  const handleCompleteScheduledAdmissions = useCallback(() => {
    if (materializingAdmissions) {
      return;
    }

    Alert.alert(
      'Complete Scheduled Admissions',
      'This will create student and parent records for all scheduled admissions. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',

          onPress: async () => {
            try {
              setMaterializingAdmissions(true);

              /*
               * Start processing scheduled admissions.
               */
              const response = await api(
                '/api/admissions/admin/run-materialize',
                {
                  method: 'POST',
                  body: JSON.stringify({}),
                },
              );

              /*
               * Fetch the latest processing progress.
               */
              const progress = await api(
                '/api/admissions/admin/materialize-progress',
              );

              console.log('Materialize response:', response);

              console.log('Materialize progress:', progress);

              /*
               * Refresh the current admissions list.
               */
              if (Number.isFinite(Number(selectedAcademicYearId))) {
                await loadAdmissions({
                  academicYearId: selectedAcademicYearId,

                  requestedPage: page,

                  showLoader: false,
                });
              }

              Alert.alert(
                'Complete Scheduled Admissions',
                progress?.message ||
                  response?.message ||
                  'Scheduled admissions completed successfully.',
              );
            } catch (error) {
              console.log('Complete scheduled admissions error:', error);

              Alert.alert(
                'Complete Scheduled Admissions',
                error?.message || 'Could not complete scheduled admissions.',
              );
            } finally {
              setMaterializingAdmissions(false);
            }
          },
        },
      ],
    );
  }, [materializingAdmissions, selectedAcademicYearId, page, loadAdmissions]);

  const handleOpenAdmission = useCallback(
    item => {
      const admissionId = Number(item?.id);

      if (!Number.isFinite(admissionId)) {
        Alert.alert('Admission', 'A valid admission ID is required.');

        return;
      }

      navigation.navigate('AdminAdmissionDetails', {
        admissionId,
      });
    },
    [navigation],
  );

  const renderAdmission = useCallback(
    ({ item }) => {
      const status = String(item?.status || '')
        .trim()
        .toLowerCase();

      const isAdmitted = status === 'admitted';

      const isRejected = status === 'rejected';

      const isSubmitted = status === 'submitted';

      const isPassed = status === 'passed';

      const isUpdating = updatingAdmissionId === Number(item?.id);

      const isAdmissionScheduled = status === 'admission_scheduled';

      const statusLabel =
        status === 'admission_scheduled'
          ? 'Admission Scheduled'
          : status
          ? status.charAt(0).toUpperCase() + status.slice(1)
          : 'Unknown';

      return (
        <Pressable
          onPress={() => handleOpenAdmission(item)}
          style={({ pressed }) => [
            styles.admissionCard,
            pressed && styles.controlPressed,
          ]}
        >
          <View style={styles.cardTopRow}>
            <View style={styles.cardTitleArea}>
              <Text style={styles.studentName} numberOfLines={2}>
                {item?.student_name || 'Unnamed Student'}
              </Text>

              <Text style={styles.applicationNo} numberOfLines={1}>
                {item?.application_no || ''}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,

                isAdmitted && styles.admittedBadge,

                isRejected && styles.rejectedBadge,

                isSubmitted && styles.submittedBadge,

                isPassed && styles.passedBadge,

                isAdmissionScheduled && styles.scheduledBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,

                  isAdmitted && styles.admittedBadgeText,

                  isRejected && styles.rejectedBadgeText,

                  isSubmitted && styles.submittedBadgeText,

                  isPassed && styles.passedBadgeText,

                  isAdmissionScheduled && styles.scheduledBadgeText,
                ]}
              >
                {statusLabel}
              </Text>
            </View>
          </View>

          {isSubmitted ? (
            <View
              style={styles.statusActionRow}
              onTouchStart={event => event.stopPropagation()}
            >
              <Text style={styles.statusActionLabel}>Passed</Text>

              {isUpdating ? (
                <ActivityIndicator size="small" color="#67D1F0" />
              ) : (
                <Switch
                  value={false}
                  disabled={isUpdating}
                  onValueChange={value => {
                    if (value) {
                      handleMarkAsPassed(item);
                    }
                  }}
                  trackColor={{
                    false: '#52657D',
                    true: '#2563EB',
                  }}
                  thumbColor="#F8FAFC"
                />
              )}
            </View>
          ) : null}

          {isPassed || isAdmissionScheduled ? (
            <View
              style={styles.statusActionRow}
              onTouchStart={event => event.stopPropagation()}
            >
              <Text style={styles.statusActionLabel}>Admission Scheduled</Text>

              {loadingAllocationAdmissionId === Number(item?.id) ||
              removingScheduleAdmissionId === Number(item?.id) ? (
                <View style={styles.scheduleLoaderBox}>
                  <ActivityIndicator size="small" color="#67D1F0" />

                  <Text style={styles.scheduleLoadingText}>Loading...</Text>
                </View>
              ) : (
                <Switch
                  value={isAdmissionScheduled}
                  disabled={
                    loadingAllocationAdmissionId !== null ||
                    removingScheduleAdmissionId !== null
                  }
                  onValueChange={value => {
                    /*
                     * Passed -> ON
                     * Load allocation options and open modal.
                     */
                    if (value && isPassed) {
                      handleAdmissionScheduledPress(item);

                      return;
                    }

                    /*
                     * Admission Scheduled -> OFF
                     * Remove schedule and reset to Passed.
                     */
                    if (!value && isAdmissionScheduled) {
                      handleRemoveAdmissionSchedule(item);
                    }
                  }}
                  trackColor={{
                    false: '#52657D',
                    true: '#22C55E',
                  }}
                  thumbColor="#F8FAFC"
                />
              )}
            </View>
          ) : null}

          <View style={styles.infoBlock}>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Parents: </Text>

              {item?.parents || 'Not available'}
            </Text>

            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>DOB: </Text>

              {formatDate(item?.dob)}
            </Text>

            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Gender: </Text>

              {formatGender(item?.gender)}
            </Text>

            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Class: </Text>

              {item?.class_applied || 'Not available'}
            </Text>

            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Academic Year: </Text>

              {item?.academic_year || 'Not available'}
            </Text>
          </View>

          {isRejected && item?.decline_reason ? (
            <View style={styles.declineBox}>
              <Text style={styles.declineLabel}>Rejection reason</Text>

              <Text style={styles.declineText}>{item.decline_reason}</Text>
            </View>
          ) : null}
        </Pressable>
      );
    },
    [
      updatingAdmissionId,
      loadingAllocationAdmissionId,
      removingScheduleAdmissionId,
      handleMarkAsPassed,
      handleAdmissionScheduledPress,
      handleRemoveAdmissionSchedule,
      handleOpenAdmission,
    ],
  );

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading admissions...</Text>
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
        data={visibleItems}
        keyExtractor={item => String(item?.uuid || item?.id)}
        renderItem={renderAdmission}
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
            <View style={styles.headerCard}>
              <Pressable
                disabled={materializingAdmissions}
                onPress={handleCompleteScheduledAdmissions}
                style={({ pressed }) => [
                  styles.completeScheduledButton,

                  materializingAdmissions && styles.controlDisabled,

                  pressed && !materializingAdmissions && styles.controlPressed,
                ]}
              >
                {materializingAdmissions ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />

                    <Text style={styles.completeScheduledButtonText}>
                      Processing...
                    </Text>
                  </>
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="calendar-check-outline"
                      size={18}
                      color="#FFFFFF"
                    />

                    <Text style={styles.completeScheduledButtonText}>
                      Complete Scheduled Admissions
                    </Text>
                  </>
                )}
              </Pressable>

              <View style={styles.totalBadge}>
                <Text style={styles.totalValue}>{totalCount}</Text>

                <Text style={styles.totalLabel}>TOTAL</Text>
              </View>
            </View>

            <View style={styles.filtersCard}>
              <Text style={styles.filterLabel}>Academic Year</Text>

              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                itemTextStyle={styles.dropdownItemText}
                selectedTextStyle={styles.dropdownSelectedText}
                placeholderStyle={styles.dropdownPlaceholder}
                activeColor="#173B60"
                iconColor="#D7E3F4"
                data={academicYearOptions}
                labelField="label"
                valueField="value"
                value={selectedAcademicYearId}
                placeholder="Select academic year"
                onChange={handleAcademicYearChange}
              />

              <Text style={[styles.filterLabel, styles.filterSpacing]}>
                Search
              </Text>

              <View style={styles.searchBox}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={19}
                  color="#94A3B8"
                />

                <TextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Student, parent or application no."
                  placeholderTextColor="#718096"
                  style={styles.searchInput}
                />
              </View>

              <Text style={[styles.filterLabel, styles.filterSpacing]}>
                Class
              </Text>

              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                itemTextStyle={styles.dropdownItemText}
                selectedTextStyle={styles.dropdownSelectedText}
                placeholderStyle={styles.dropdownPlaceholder}
                activeColor="#173B60"
                iconColor="#D7E3F4"
                data={classLevelOptions}
                labelField="label"
                valueField="value"
                value={selectedClassLevelId}
                placeholder="All Classes"
                onChange={item => setSelectedClassLevelId(item?.value ?? null)}
              />

              <Text style={[styles.filterLabel, styles.filterSpacing]}>
                Status
              </Text>

              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                itemTextStyle={styles.dropdownItemText}
                selectedTextStyle={styles.dropdownSelectedText}
                placeholderStyle={styles.dropdownPlaceholder}
                activeColor="#173B60"
                iconColor="#D7E3F4"
                data={STATUS_OPTIONS}
                labelField="label"
                valueField="value"
                value={selectedStatus}
                placeholder="All Statuses"
                onChange={item => setSelectedStatus(item?.value ?? null)}
              />

              <Pressable
                onPress={handleClearFilters}
                style={({ pressed }) => [
                  styles.clearButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="filter-remove-outline"
                  size={17}
                  color="#FFFFFF"
                />

                <Text style={styles.clearButtonText}>Clear Filters</Text>
              </Pressable>
            </View>

            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Applications</Text>

              <Text style={styles.listMeta}>{visibleItems.length} shown</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="account-school-outline"
              size={40}
              color="#718096"
            />

            <Text style={styles.emptyTitle}>No admission applications</Text>

            <Text style={styles.emptyText}>
              No applications match the current filters.
            </Text>
          </View>
        }
        ListFooterComponent={
          <>
            <View style={styles.paginationCard}>
              <Text style={styles.paginationInfo}>
                Showing {from}-{to} of {totalCount}
              </Text>

              <View style={styles.paginationButtons}>
                <Pressable
                  disabled={page <= 1 || pageLoading}
                  onPress={() => goToPage(page - 1)}
                  style={({ pressed }) => [
                    styles.pageButton,

                    (page <= 1 || pageLoading) && styles.controlDisabled,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={17}
                    color="#FFFFFF"
                  />

                  <Text style={styles.pageButtonText}>Prev</Text>
                </Pressable>

                <Text style={styles.pageNumber}>
                  Page {page} / {lastPage}
                </Text>

                <Pressable
                  disabled={page >= lastPage || pageLoading}
                  onPress={() => goToPage(page + 1)}
                  style={({ pressed }) => [
                    styles.pageButton,

                    (page >= lastPage || pageLoading) && styles.controlDisabled,

                    pressed && styles.controlPressed,
                  ]}
                >
                  {pageLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.pageButtonText}>Next</Text>

                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={17}
                        color="#FFFFFF"
                      />
                    </>
                  )}
                </Pressable>
              </View>
            </View>

            <View style={styles.footerSpace} />
          </>
        }
      />
      <Modal
        visible={allocationModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseAllocationModal}
      >
        <View style={styles.allocationModalBackdrop}>
          <View style={styles.allocationModal}>
            <Text style={styles.allocationModalTitle}>
              Choose Destination Offering
            </Text>

            <Text style={styles.allocationModalSubtitle}>
              Select the destination offering for{' '}
              {selectedAdmission?.student?.first_name || ''}{' '}
              {selectedAdmission?.student?.last_name || ''}
            </Text>

            <View style={styles.allocationOptions}>
              {allocationOptions.map(option => {
                const optionId = Number(option?.id);

                const isSelected = Number(selectedAllocationId) === optionId;

                return (
                  <Pressable
                    key={String(optionId)}
                    onPress={() => setSelectedAllocationId(optionId)}
                    style={({ pressed }) => [
                      styles.allocationOption,

                      isSelected && styles.allocationOptionSelected,

                      pressed && styles.controlPressed,
                    ]}
                  >
                    <View style={styles.allocationRadio}>
                      {isSelected ? (
                        <View style={styles.allocationRadioInner} />
                      ) : null}
                    </View>

                    <View style={styles.allocationOptionInfo}>
                      <Text style={styles.allocationOptionId}>
                        Offering ID: {optionId}
                      </Text>

                      <Text style={styles.allocationOptionLabel}>
                        {option?.label || 'Destination offering'}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
              <View style={styles.scheduleRollField}>
                <Text style={styles.scheduleRollLabel}>
                  Assign the student roll number
                </Text>

                <TextInput
                  value={scheduleRollNo}
                  onChangeText={setScheduleRollNo}
                  editable={!schedulingAdmission}
                  placeholder="Enter roll number"
                  placeholderTextColor="#718096"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.scheduleRollInput}
                />
              </View>
            </View>

            <View style={styles.allocationModalActions}>
              <Pressable
                disabled={schedulingAdmission}
                onPress={handleCloseAllocationModal}
                style={({ pressed }) => [
                  styles.allocationCancelButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.allocationCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={schedulingAdmission}
                onPress={handleConfirmAllocation}
                style={({ pressed }) => [
                  styles.allocationConfirmButton,

                  schedulingAdmission && styles.controlDisabled,

                  pressed && !schedulingAdmission && styles.controlPressed,
                ]}
              >
                {schedulingAdmission ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.allocationConfirmText}>OK</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
