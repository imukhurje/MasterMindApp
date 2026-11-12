// src/screens/Admin/Billing/AdminBillingStudentCharges.js

import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';

import { useFocusEffect } from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../api/client';

import styles from './AdminBillingStudentCharges.styles';

const PER_PAGE = 20;

const STUDENT_CHARGE_CYCLE_OPTIONS = [
  {
    label: 'Monthly',
    value: 'monthly',
  },
  {
    label: 'Annual',
    value: 'annual',
  },
];

const STUDENT_CHARGE_MONTH_OPTIONS = [
  { label: '—', value: null },
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

const STUDENT_CHARGE_ACTIVE_OPTIONS = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
];

function formatClass(item) {
  const name = String(item?.class_name || '').trim();

  const section = String(item?.class_section || '').trim();

  if (!name) {
    return '';
  }

  return section ? `${name} (${section})` : name;
}

function formatMoney(value) {
  const amount = Number(value || 0);

  return `₹${amount.toFixed(2)}`;
}

function formatChargeCycle(item) {
  const cycle = String(item?.cycle || '')
    .trim()
    .toLowerCase();

  if (cycle === 'annual') {
    const month = Number(item?.annual_month);

    return month ? `Annual · Month ${month}` : 'Annual';
  }

  return 'Monthly';
}

function getCatalogChargeLabel(item) {
  const cycle =
    String(item?.cycle || '')
      .trim()
      .toLowerCase() === 'annual'
      ? 'Annual'
      : 'Monthly';

  return `${item?.name || 'Charge'} - ${cycle} - ₹${Number(
    item?.amount || 0,
  ).toFixed(2)}`;
}

export default function AdminBillingStudentCharges() {
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const [total, setTotal] = useState(0);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [studentDetails, setStudentDetails] = useState(null);

  const [loadingDetails, setLoadingDetails] = useState(false);

  const [refreshingDetails, setRefreshingDetails] = useState(false);

  const [updatingCommonChargeId, setUpdatingCommonChargeId] = useState(null);

  const [addStudentChargeModalVisible, setAddStudentChargeModalVisible] =
    useState(false);

  const [studentChargeCatalogLoading, setStudentChargeCatalogLoading] =
    useState(false);

  const [studentChargeCatalog, setStudentChargeCatalog] = useState([]);

  const [studentChargePickerOpen, setStudentChargePickerOpen] = useState(false);

  const [selectedCatalogChargeId, setSelectedCatalogChargeId] = useState(null);

  const [creatingNewStudentCharge, setCreatingNewStudentCharge] =
    useState(false);

  const [newStudentChargeName, setNewStudentChargeName] = useState('');

  const [newStudentChargeAmount, setNewStudentChargeAmount] = useState('');

  const [newStudentChargeCycle, setNewStudentChargeCycle] = useState('monthly');

  const [newStudentChargeAnnualMonth, setNewStudentChargeAnnualMonth] =
    useState(null);

  const [newStudentChargeActive, setNewStudentChargeActive] = useState(true);

  const [savingStudentCharge, setSavingStudentCharge] = useState(false);

  const [editingStudentCharge, setEditingStudentCharge] = useState(null);

  const [deletingStudentChargeId, setDeletingStudentChargeId] = useState(null);

  const loadStudents = useCallback(
    async ({ requestedPage = 1, append = false, refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else if (!append) {
          setLoading(true);
        }

        const response = await api(
          `/api/billing/v2/student-charges/students?page=${encodeURIComponent(
            requestedPage,
          )}&per_page=${PER_PAGE}`,
        );

        const rows = Array.isArray(response?.data) ? response.data : [];

        if (append) {
          setStudents(current => {
            const map = new Map();

            current.forEach(item => {
              map.set(Number(item?.id), item);
            });

            rows.forEach(item => {
              map.set(Number(item?.id), item);
            });

            return Array.from(map.values());
          });
        } else {
          setStudents(rows);
        }

        setPage(Number(response?.current_page) || requestedPage);

        setLastPage(Number(response?.last_page) || 1);

        setTotal(Number(response?.total) || rows.length);
      } catch (error) {
        console.log('Student charges list error:', error);

        Alert.alert(
          'Per Student Charges',
          error?.message || 'Could not load students.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      loadStudents();

      return undefined;
    }, [loadStudents]),
  );

  const filteredStudents = useMemo(() => {
    const query = String(search || '')
      .trim()
      .toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter(item => {
      const searchable = [
        item?.name,
        item?.class_name,
        item?.class_section,
        item?.roll_no,
        formatClass(item),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [students, search]);

  const loadNextPage = useCallback(async () => {
    if (loadingMore || page >= lastPage) {
      return;
    }

    try {
      setLoadingMore(true);

      await loadStudents({
        requestedPage: page + 1,

        append: true,
      });
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, page, lastPage, loadStudents]);

  const loadStudentDetails = useCallback(
    async (student, { refresh = false } = {}) => {
      const studentId = Number(student?.id);

      if (!Number.isFinite(studentId)) {
        return;
      }

      try {
        if (refresh) {
          setRefreshingDetails(true);
        } else {
          setLoadingDetails(true);
        }

        const response = await api(
          `/api/billing/v2/student-charges/students/${encodeURIComponent(
            studentId,
          )}`,
        );

        setStudentDetails(response || null);
      } catch (error) {
        console.log('Student charge details error:', error);

        Alert.alert(
          'Student Charges',
          error?.message || 'Could not load student charges.',
        );
      } finally {
        setLoadingDetails(false);
        setRefreshingDetails(false);
      }
    },
    [],
  );

  const handleOpenStudent = useCallback(
    async item => {
      setSelectedStudent(item);

      setStudentDetails(null);

      await loadStudentDetails(item);
    },
    [loadStudentDetails],
  );

  const handleBackToStudents = useCallback(() => {
    setSelectedStudent(null);

    setStudentDetails(null);
  }, []);

  const handleToggleCommonCharge = useCallback(
    async charge => {
      const studentId = Number(selectedStudent?.id);

      const chargeId = Number(charge?.id);

      if (
        !Number.isFinite(studentId) ||
        !Number.isFinite(chargeId) ||
        updatingCommonChargeId !== null
      ) {
        return;
      }

      const currentCharges = Array.isArray(studentDetails?.common_charges)
        ? studentDetails.common_charges
        : [];

      const currentlyEnabled = Number(charge?.enabled) === 1;

      /*
       * The endpoint expects the complete list of
       * common charge IDs excluded for this student.
       */
      const existingExcludedIds = currentCharges
        .filter(item => Number(item?.enabled) !== 1)
        .map(item => Number(item?.id))
        .filter(Number.isFinite);

      const nextExcludedIds = currentlyEnabled
        ? Array.from(new Set([...existingExcludedIds, chargeId]))
        : existingExcludedIds.filter(id => id !== chargeId);

      try {
        setUpdatingCommonChargeId(chargeId);

        const response = await api(
          `/api/billing/v2/student-charges/students/${encodeURIComponent(
            studentId,
          )}/common`,
          {
            method: 'PUT',

            body: JSON.stringify({
              excluded_charge_ids: nextExcludedIds,
            }),
          },
        );

        if (response?.ok !== true) {
          throw new Error('Could not update the common charge.');
        }

        /*
         * Reload the student details so the server
         * remains the source of truth.
         */
        await loadStudentDetails(selectedStudent, {
          refresh: true,
        });
      } catch (error) {
        console.log('Update common student charge error:', error);

        Alert.alert(
          'Common Charges',
          error?.message || 'Could not update the common charge.',
        );
      } finally {
        setUpdatingCommonChargeId(null);
      }
    },
    [
      selectedStudent,
      studentDetails?.common_charges,
      updatingCommonChargeId,
      loadStudentDetails,
    ],
  );

  const handleEditStudentCharge = useCallback(item => {
    const chargeId = Number(item?.id);

    if (!Number.isFinite(chargeId)) {
      Alert.alert('Edit Student Charge', 'A valid student charge is required.');

      return;
    }

    const cycle =
      String(item?.cycle || 'monthly')
        .trim()
        .toLowerCase() === 'annual'
        ? 'annual'
        : 'monthly';

    setEditingStudentCharge(item);

    setCreatingNewStudentCharge(false);

    setStudentChargePickerOpen(false);
    setSelectedCatalogChargeId(null);
    setStudentChargeCatalog([]);

    setNewStudentChargeName(String(item?.name || ''));

    setNewStudentChargeAmount(
      item?.amount !== null && item?.amount !== undefined
        ? String(item.amount)
        : '',
    );

    setNewStudentChargeCycle(cycle);

    setNewStudentChargeAnnualMonth(
      cycle === 'annual' && item?.annual_month
        ? Number(item.annual_month)
        : null,
    );

    setNewStudentChargeActive(
      item?.active === true || Number(item?.active) === 1,
    );

    setAddStudentChargeModalVisible(true);
  }, []);

  const handleOpenAddStudentCharge = useCallback(async () => {
    const studentId = Number(selectedStudent?.id);

    if (!Number.isFinite(studentId)) {
      return;
    }

    setEditingStudentCharge(null);

    setAddStudentChargeModalVisible(true);

    setStudentChargePickerOpen(false);

    setSelectedCatalogChargeId(null);

    setCreatingNewStudentCharge(false);

    setNewStudentChargeName('');
    setNewStudentChargeAmount('');
    setNewStudentChargeCycle('monthly');
    setNewStudentChargeAnnualMonth(null);
    setNewStudentChargeActive(true);

    try {
      setStudentChargeCatalogLoading(true);

      const response = await api(
        `/api/billing/v2/student-charges/catalog?student_id=${encodeURIComponent(
          studentId,
        )}`,
      );

      setStudentChargeCatalog(Array.isArray(response) ? response : []);
    } catch (error) {
      console.log('Student charge catalog error:', error);

      Alert.alert(
        'Add Student Charge',
        error?.message || 'Could not load available student charges.',
      );
    } finally {
      setStudentChargeCatalogLoading(false);
    }
  }, [selectedStudent?.id]);

  const handleCloseAddStudentCharge = useCallback(() => {
    if (savingStudentCharge) {
      return;
    }

    setAddStudentChargeModalVisible(false);

    setEditingStudentCharge(null);

    setStudentChargePickerOpen(false);
    setSelectedCatalogChargeId(null);

    setCreatingNewStudentCharge(false);

    setNewStudentChargeName('');
    setNewStudentChargeAmount('');

    setNewStudentChargeCycle('monthly');
    setNewStudentChargeAnnualMonth(null);

    setNewStudentChargeActive(true);
  }, [savingStudentCharge]);

  const handleSelectNewStudentCharge = useCallback(() => {
    setCreatingNewStudentCharge(true);

    setSelectedCatalogChargeId(null);

    setStudentChargePickerOpen(false);

    setNewStudentChargeName('');
    setNewStudentChargeAmount('');

    setNewStudentChargeCycle('monthly');

    setNewStudentChargeAnnualMonth(null);

    setNewStudentChargeActive(true);
  }, []);

  const handleStudentChargeCycleChange = useCallback(value => {
    setNewStudentChargeCycle(value);

    if (value !== 'annual') {
      setNewStudentChargeAnnualMonth(null);
    }
  }, []);

  const handleSaveStudentCharge = useCallback(async () => {
    const studentId = Number(selectedStudent?.id);

    if (!Number.isFinite(studentId)) {
      Alert.alert('Add Student Charge', 'A valid student is required.');

      return;
    }

    if (savingStudentCharge) {
      return;
    }

    /*
     * Edit existing student-specific charge.
     */
    if (editingStudentCharge) {
      const chargeId = Number(editingStudentCharge?.id);

      const name = String(newStudentChargeName || '').trim();

      const amount = Number(newStudentChargeAmount);

      if (!Number.isFinite(chargeId)) {
        Alert.alert(
          'Edit Student Charge',
          'A valid student charge is required.',
        );

        return;
      }

      if (!name) {
        Alert.alert('Edit Student Charge', 'Charge name is required.');

        return;
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        Alert.alert('Edit Student Charge', 'Enter a valid amount.');

        return;
      }

      if (newStudentChargeCycle === 'annual' && !newStudentChargeAnnualMonth) {
        Alert.alert('Edit Student Charge', 'Select an annual month.');

        return;
      }

      try {
        setSavingStudentCharge(true);

        const response = await api(
          `/api/billing/v2/student-charges/additional/${encodeURIComponent(
            chargeId,
          )}`,
          {
            method: 'PUT',

            body: JSON.stringify({
              name,

              amount,

              cycle: newStudentChargeCycle,

              annual_month:
                newStudentChargeCycle === 'annual'
                  ? Number(newStudentChargeAnnualMonth)
                  : null,

              active: newStudentChargeActive === true,
            }),
          },
        );

        if (!response?.id) {
          throw new Error('Updated student charge ID was not returned.');
        }

        setAddStudentChargeModalVisible(false);

        setEditingStudentCharge(null);

        setNewStudentChargeName('');
        setNewStudentChargeAmount('');

        setNewStudentChargeCycle('monthly');
        setNewStudentChargeAnnualMonth(null);

        setNewStudentChargeActive(true);

        await loadStudentDetails(selectedStudent);

        Alert.alert('Charge Updated', 'Student charge updated successfully.');
      } catch (error) {
        console.log('Update student charge error:', error);

        Alert.alert(
          'Edit Student Charge',
          error?.message || 'Could not update the student charge.',
        );
      } finally {
        setSavingStudentCharge(false);
      }

      return;
    }

    /*
     * Existing catalog charge selected.
     */
    if (!creatingNewStudentCharge) {
      const sourceChargeId = Number(selectedCatalogChargeId);

      if (!Number.isFinite(sourceChargeId)) {
        Alert.alert('Add Student Charge', 'Select a charge from the list.');

        return;
      }

      try {
        setSavingStudentCharge(true);

        const response = await api(
          `/api/billing/v2/student-charges/students/${encodeURIComponent(
            studentId,
          )}/additional`,
          {
            method: 'POST',

            body: JSON.stringify({
              source_charge_id: sourceChargeId,
            }),
          },
        );

        if (!response?.id) {
          throw new Error('Student charge ID was not returned.');
        }

        setAddStudentChargeModalVisible(false);

        setSelectedCatalogChargeId(null);

        setCreatingNewStudentCharge(false);

        setStudentChargePickerOpen(false);

        setStudentChargeCatalog([]);

        await loadStudentDetails(selectedStudent);

        Alert.alert('Charge Added', 'Student charge added successfully.');
      } catch (error) {
        console.log('Attach catalog charge error:', error);

        Alert.alert(
          'Add Student Charge',
          error?.message || 'Could not add the selected charge.',
        );
      } finally {
        setSavingStudentCharge(false);
      }

      return;
    }

    /*
     * New student-specific charge.
     */
    const name = String(newStudentChargeName || '').trim();

    const amount = Number(newStudentChargeAmount);

    if (!name) {
      Alert.alert('Add Student Charge', 'Charge name is required.');

      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert('Add Student Charge', 'Enter a valid amount.');

      return;
    }

    if (newStudentChargeCycle === 'annual' && !newStudentChargeAnnualMonth) {
      Alert.alert('Add Student Charge', 'Select an annual month.');

      return;
    }

    try {
      setSavingStudentCharge(true);

      const response = await api(
        `/api/billing/v2/student-charges/students/${encodeURIComponent(
          studentId,
        )}/additional`,
        {
          method: 'POST',

          body: JSON.stringify({
            name,

            amount,

            cycle: newStudentChargeCycle,

            annual_month:
              newStudentChargeCycle === 'annual'
                ? Number(newStudentChargeAnnualMonth)
                : null,

            active: newStudentChargeActive === true,
          }),
        },
      );

      if (!response?.id) {
        throw new Error('Student charge ID was not returned.');
      }

      setAddStudentChargeModalVisible(false);

      setSelectedCatalogChargeId(null);

      setCreatingNewStudentCharge(false);

      setStudentChargePickerOpen(false);

      setStudentChargeCatalog([]);

      setNewStudentChargeName('');

      setNewStudentChargeAmount('');

      setNewStudentChargeCycle('monthly');

      setNewStudentChargeAnnualMonth(null);

      setNewStudentChargeActive(true);

      await loadStudentDetails(selectedStudent);

      Alert.alert('Charge Added', 'Student charge added successfully.');
    } catch (error) {
      console.log('Add student charge error:', error);

      Alert.alert(
        'Add Student Charge',
        error?.message || 'Could not add the student charge.',
      );
    } finally {
      setSavingStudentCharge(false);
    }
  }, [
    selectedStudent,
    selectedCatalogChargeId,
    creatingNewStudentCharge,
    editingStudentCharge,
    newStudentChargeName,
    newStudentChargeAmount,
    newStudentChargeCycle,
    newStudentChargeAnnualMonth,
    newStudentChargeActive,
    savingStudentCharge,
    loadStudentDetails,
  ]);

  const handleDeleteStudentCharge = useCallback(
    item => {
      const chargeId = Number(item?.id);

      if (!Number.isFinite(chargeId)) {
        Alert.alert(
          'Delete Student Charge',
          'A valid student charge is required.',
        );

        return;
      }

      Alert.alert(
        'Delete Student Charge',
        'Delete this student-specific charge?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',

            onPress: async () => {
              if (deletingStudentChargeId !== null) {
                return;
              }

              try {
                setDeletingStudentChargeId(chargeId);

                await api(
                  `/api/billing/v2/student-charges/additional/${encodeURIComponent(
                    chargeId,
                  )}`,
                  {
                    method: 'DELETE',
                  },
                );

                await loadStudentDetails(selectedStudent);

                Alert.alert(
                  'Charge Deleted',
                  'Student-specific charge deleted successfully.',
                );
              } catch (error) {
                console.log('Delete student charge error:', error);

                Alert.alert(
                  'Delete Student Charge',
                  error?.message ||
                    'Could not delete the student-specific charge.',
                );
              } finally {
                setDeletingStudentChargeId(null);
              }
            },
          },
        ],
      );
    },
    [deletingStudentChargeId, selectedStudent, loadStudentDetails],
  );

  const renderStudent = useCallback(
    ({ item }) => {
      const modified = Number(item?.modified) === 1;

      return (
        <Pressable
          onPress={() => handleOpenStudent(item)}
          style={({ pressed }) => [
            styles.studentRow,

            pressed && styles.controlPressed,
          ]}
        >
          <View style={styles.studentInfo}>
            <Text style={styles.studentName} numberOfLines={1}>
              {item?.name || 'Student'}
            </Text>

            <Text style={styles.studentMeta} numberOfLines={1}>
              {formatClass(item) || 'No class'}
              {' · Roll '}
              {item?.roll_no || '-'}
            </Text>
          </View>

          {modified ? (
            <View style={styles.modifiedIcon}>
              <MaterialCommunityIcons name="check" size={14} color="#082032" />
            </View>
          ) : (
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="#64748B"
            />
          )}
        </Pressable>
      );
    },
    [handleOpenStudent],
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading students...</Text>
      </View>
    );
  }

  const commonCharges = Array.isArray(studentDetails?.common_charges)
    ? studentDetails.common_charges
    : [];

  const additionalCharges = Array.isArray(studentDetails?.additional_charges)
    ? studentDetails.additional_charges
    : [];

  const detailStudent = studentDetails?.student || selectedStudent || {};

  const selectedClassLabel = selectedStudent
    ? formatClass(selectedStudent)
    : '';

  const showStudentChargeForm =
    editingStudentCharge !== null || creatingNewStudentCharge;

  if (selectedStudent) {
    return (
      <>
        <ScrollView
          style={styles.detailsScreen}
          contentContainerStyle={styles.detailsContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshingDetails}
              onRefresh={() =>
                loadStudentDetails(selectedStudent, {
                  refresh: true,
                })
              }
              tintColor="#67D1F0"
            />
          }
        >
          <Pressable
            onPress={handleBackToStudents}
            style={({ pressed }) => [
              styles.backToStudentsButton,
              pressed && styles.controlPressed,
            ]}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.backToStudentsText}>Back to Students</Text>
          </Pressable>

          {loadingDetails ? (
            <View style={styles.detailsLoader}>
              <ActivityIndicator size="large" color="#67D1F0" />

              <Text style={styles.loadingText}>Loading student charges...</Text>
            </View>
          ) : (
            <>
              <View style={styles.studentDetailsHeader}>
                <View style={styles.studentDetailsInfo}>
                  <Text style={styles.detailsStudentName}>
                    {detailStudent?.name || 'Student'}
                  </Text>

                  <Text style={styles.detailsStudentMeta}>
                    {selectedClassLabel ? `${selectedClassLabel} · ` : ''}
                    Roll{' '}
                    {detailStudent?.roll_no || selectedStudent?.roll_no || '-'}
                  </Text>
                </View>

                <Pressable
                  onPress={handleOpenAddStudentCharge}
                  style={({ pressed }) => [
                    styles.addStudentChargeButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={17}
                    color="#FFFFFF"
                  />

                  <Text style={styles.addStudentChargeText}>
                    Add Student Charge
                  </Text>
                </Pressable>
              </View>

              <View style={styles.detailsDivider} />

              <Text style={styles.detailsSectionTitle}>Common Charges</Text>

              <Text style={styles.detailsSectionDescription}>
                Uncheck any common charge that should not apply to this student.
              </Text>

              {commonCharges.map(item => {
                const enabled = Number(item?.enabled) === 1;

                return (
                  <View key={String(item?.id)} style={styles.studentChargeCard}>
                    <View style={styles.studentChargeLeft}>
                      <Pressable
                        disabled={updatingCommonChargeId !== null}
                        onPress={() => handleToggleCommonCharge(item)}
                        hitSlop={8}
                        style={({ pressed }) => [
                          styles.chargeCheckbox,

                          enabled && styles.chargeCheckboxChecked,

                          updatingCommonChargeId === Number(item?.id) &&
                            styles.chargeCheckboxUpdating,

                          pressed &&
                            updatingCommonChargeId === null &&
                            styles.controlPressed,
                        ]}
                      >
                        {updatingCommonChargeId === Number(item?.id) ? (
                          <ActivityIndicator
                            size="small"
                            color={enabled ? '#082032' : '#67D1F0'}
                          />
                        ) : enabled ? (
                          <MaterialCommunityIcons
                            name="check"
                            size={13}
                            color="#082032"
                          />
                        ) : null}
                      </Pressable>

                      <View style={styles.studentChargeInfo}>
                        <Text style={styles.studentChargeName}>
                          {item?.name || 'Charge'}
                        </Text>

                        <Text style={styles.studentChargeCycle}>
                          {formatChargeCycle(item)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.studentChargeAmountBadge}>
                      <Text style={styles.studentChargeAmountText}>
                        {formatMoney(item?.amount)}
                      </Text>
                    </View>
                  </View>
                );
              })}

              {commonCharges.length === 0 ? (
                <View style={styles.studentChargesEmpty}>
                  <Text style={styles.studentChargesEmptyText}>
                    No common charges apply to this student.
                  </Text>
                </View>
              ) : null}

              <Text
                style={[
                  styles.detailsSectionTitle,
                  styles.additionalSectionTitle,
                ]}
              >
                Additional Student Charges
              </Text>

              {additionalCharges.length === 0 ? (
                <View style={styles.additionalChargesEmpty}>
                  <Text style={styles.studentChargesEmptyText}>
                    No student-specific charges added.
                  </Text>
                </View>
              ) : (
                additionalCharges.map((item, index) => (
                  <View
                    key={String(item?.id || index)}
                    style={styles.additionalChargeCard}
                  >
                    <View style={styles.additionalChargeTopRow}>
                      <View style={styles.studentChargeInfo}>
                        <Text style={styles.studentChargeName}>
                          {item?.name || 'Student Charge'}
                        </Text>

                        <Text style={styles.studentChargeCycle}>
                          {formatChargeCycle(item)}
                          {item?.active === false ? ' · Inactive' : ' · Active'}
                        </Text>
                      </View>

                      <View style={styles.studentChargeAmountBadge}>
                        <Text style={styles.studentChargeAmountText}>
                          {formatMoney(item?.amount)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.additionalChargeActions}>
                      <Pressable
                        onPress={() => handleEditStudentCharge(item)}
                        style={({ pressed }) => [
                          styles.additionalChargeEditButton,

                          pressed && styles.controlPressed,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="pencil-outline"
                          size={17}
                          color="#FFFFFF"
                        />

                        <Text style={styles.additionalChargeEditText}>
                          Edit
                        </Text>
                      </Pressable>

                      <Pressable
                        disabled={deletingStudentChargeId !== null}
                        onPress={() => handleDeleteStudentCharge(item)}
                        style={({ pressed }) => [
                          styles.additionalChargeDeleteButton,

                          deletingStudentChargeId === Number(item?.id) &&
                            styles.controlDisabled,

                          pressed &&
                            deletingStudentChargeId === null &&
                            styles.controlPressed,
                        ]}
                      >
                        {deletingStudentChargeId === Number(item?.id) ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <>
                            <MaterialCommunityIcons
                              name="delete-outline"
                              size={17}
                              color="#FFFFFF"
                            />

                            <Text style={styles.additionalChargeDeleteText}>
                              Delete
                            </Text>
                          </>
                        )}
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </>
          )}
        </ScrollView>
        <Modal
          visible={addStudentChargeModalVisible}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={handleCloseAddStudentCharge}
        >
          <View style={styles.studentChargeModalBackdrop}>
            <View style={styles.studentChargeModal}>
              <View style={styles.studentChargeModalHeader}>
                <Text style={styles.studentChargeModalTitle}>
                  {editingStudentCharge
                    ? 'Edit Student Charge'
                    : 'Add Student Charge'}
                </Text>

                <Pressable
                  disabled={savingStudentCharge}
                  onPress={handleCloseAddStudentCharge}
                  style={({ pressed }) => [
                    styles.studentChargeModalClose,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={23}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.studentChargeModalContent}
              >
                {!showStudentChargeForm ? (
                  <Text style={styles.studentChargeFieldLabel}>Name</Text>
                ) : null}

                {!showStudentChargeForm ? (
                  <>
                    <Pressable
                      disabled={studentChargeCatalogLoading}
                      onPress={() =>
                        setStudentChargePickerOpen(current => !current)
                      }
                      style={styles.studentChargePickerField}
                    >
                      <Text
                        numberOfLines={1}
                        style={
                          selectedCatalogChargeId
                            ? styles.studentChargePickerValue
                            : styles.studentChargePickerPlaceholder
                        }
                      >
                        {selectedCatalogChargeId
                          ? getCatalogChargeLabel(
                              studentChargeCatalog.find(
                                item =>
                                  Number(item?.id) ===
                                  Number(selectedCatalogChargeId),
                              ),
                            )
                          : '-- Select charge --'}
                      </Text>

                      {studentChargeCatalogLoading ? (
                        <ActivityIndicator size="small" color="#67D1F0" />
                      ) : (
                        <MaterialCommunityIcons
                          name={
                            studentChargePickerOpen
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={20}
                          color="#AFC0D8"
                        />
                      )}
                    </Pressable>

                    {studentChargePickerOpen ? (
                      <View style={styles.studentChargeCatalogPanel}>
                        <Pressable
                          onPress={handleSelectNewStudentCharge}
                          style={({ pressed }) => [
                            styles.studentChargeCatalogOption,

                            pressed && styles.controlPressed,
                          ]}
                        >
                          <Text style={styles.newChargeOptionText}>
                            + New Charge
                          </Text>
                        </Pressable>

                        {studentChargeCatalog.map(item => {
                          const attached = item?.attached === true;

                          return (
                            <Pressable
                              key={String(item?.id)}
                              disabled={attached}
                              onPress={() => {
                                setCreatingNewStudentCharge(false);

                                setSelectedCatalogChargeId(Number(item?.id));

                                setStudentChargePickerOpen(false);
                              }}
                              style={[
                                styles.studentChargeCatalogOption,

                                attached &&
                                  styles.studentChargeCatalogOptionDisabled,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.studentChargeCatalogText,

                                  attached &&
                                    styles.studentChargeCatalogTextDisabled,
                                ]}
                              >
                                {getCatalogChargeLabel(item)}
                              </Text>

                              {attached ? (
                                <Text style={styles.alreadyAttachedText}>
                                  Already attached
                                </Text>
                              ) : null}
                            </Pressable>
                          );
                        })}
                      </View>
                    ) : null}
                  </>
                ) : (
                  <>
                    {!editingStudentCharge ? (
                      <View style={styles.newChargeModeField}>
                        <Text style={styles.newChargeModeText}>New Charge</Text>
                      </View>
                    ) : null}

                    <Text style={styles.studentChargeFieldLabel}>
                      Charge Name
                    </Text>

                    <TextInput
                      value={newStudentChargeName}
                      onChangeText={setNewStudentChargeName}
                      editable={!savingStudentCharge}
                      placeholder="e.g., Monthly Tuition"
                      placeholderTextColor="#718096"
                      style={styles.studentChargeInput}
                    />

                    <Text style={styles.studentChargeFieldLabel}>
                      Amount (₹)
                    </Text>

                    <TextInput
                      value={newStudentChargeAmount}
                      onChangeText={value =>
                        setNewStudentChargeAmount(value.replace(/[^0-9.]/g, ''))
                      }
                      editable={!savingStudentCharge}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor="#718096"
                      style={styles.studentChargeInput}
                    />

                    <Text style={styles.studentChargeFieldLabel}>Cycle</Text>

                    <Dropdown
                      style={styles.studentChargeDropdown}
                      containerStyle={styles.studentChargeDropdownContainer}
                      selectedTextStyle={styles.studentChargeDropdownSelected}
                      itemTextStyle={styles.studentChargeDropdownItem}
                      placeholderStyle={styles.studentChargeDropdownPlaceholder}
                      activeColor="#173B60"
                      iconColor="#DCE7F5"
                      data={STUDENT_CHARGE_CYCLE_OPTIONS}
                      labelField="label"
                      valueField="value"
                      value={newStudentChargeCycle}
                      onChange={item =>
                        handleStudentChargeCycleChange(item?.value)
                      }
                    />

                    <Text style={styles.studentChargeFieldLabel}>
                      Annual Month
                    </Text>

                    <Dropdown
                      disable={newStudentChargeCycle !== 'annual'}
                      style={[
                        styles.studentChargeDropdown,

                        newStudentChargeCycle !== 'annual' &&
                          styles.studentChargeFieldDisabled,
                      ]}
                      containerStyle={styles.studentChargeDropdownContainer}
                      selectedTextStyle={styles.studentChargeDropdownSelected}
                      itemTextStyle={styles.studentChargeDropdownItem}
                      placeholderStyle={styles.studentChargeDropdownPlaceholder}
                      activeColor="#173B60"
                      iconColor="#DCE7F5"
                      data={STUDENT_CHARGE_MONTH_OPTIONS}
                      labelField="label"
                      valueField="value"
                      value={newStudentChargeAnnualMonth}
                      placeholder="—"
                      onChange={item =>
                        setNewStudentChargeAnnualMonth(item?.value ?? null)
                      }
                    />

                    <Text style={styles.studentChargeFieldLabel}>Active</Text>

                    <Dropdown
                      style={styles.studentChargeDropdown}
                      containerStyle={styles.studentChargeDropdownContainer}
                      selectedTextStyle={styles.studentChargeDropdownSelected}
                      itemTextStyle={styles.studentChargeDropdownItem}
                      placeholderStyle={styles.studentChargeDropdownPlaceholder}
                      activeColor="#173B60"
                      iconColor="#DCE7F5"
                      data={STUDENT_CHARGE_ACTIVE_OPTIONS}
                      labelField="label"
                      valueField="value"
                      value={newStudentChargeActive}
                      onChange={item =>
                        setNewStudentChargeActive(item?.value === true)
                      }
                    />
                  </>
                )}

                <View style={styles.studentChargeModalActions}>
                  <Pressable
                    disabled={savingStudentCharge}
                    onPress={handleCloseAddStudentCharge}
                    style={({ pressed }) => [
                      styles.studentChargeCancelButton,

                      pressed && styles.controlPressed,
                    ]}
                  >
                    <Text style={styles.studentChargeCancelText}>Cancel</Text>
                  </Pressable>

                  <Pressable
                    disabled={
                      savingStudentCharge ||
                      (!creatingNewStudentCharge && !selectedCatalogChargeId)
                    }
                    onPress={handleSaveStudentCharge}
                    style={({ pressed }) => [
                      styles.studentChargeSaveButton,

                      (savingStudentCharge ||
                        (!creatingNewStudentCharge &&
                          !selectedCatalogChargeId)) &&
                        styles.controlDisabled,

                      pressed && !savingStudentCharge && styles.controlPressed,
                    ]}
                  >
                    {savingStudentCharge ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.studentChargeSaveText}>Save</Text>
                    )}
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <FlatList
      data={filteredStudents}
      keyExtractor={item => String(item?.id)}
      renderItem={renderStudent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() =>
            loadStudents({
              requestedPage: 1,
              refresh: true,
            })
          }
          tintColor="#67D1F0"
        />
      }
      ListHeaderComponent={
        <>
          <View style={styles.searchBox}>
            <MaterialCommunityIcons name="magnify" size={19} color="#94A3B8" />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search name, class or roll number"
              placeholderTextColor="#718096"
              style={styles.searchInput}
            />

            {search ? (
              <Pressable onPress={() => setSearch('')} hitSlop={7}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={19}
                  color="#94A3B8"
                />
              </Pressable>
            ) : null}
          </View>

          <View style={styles.listSummary}>
            <Text style={styles.listSummaryText}>{total} students</Text>

            <Text style={styles.listSummaryHint}>✓ = modified charges</Text>
          </View>
        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <MaterialCommunityIcons
            name="account-search-outline"
            size={38}
            color="#718096"
          />

          <Text style={styles.emptyTitle}>No students found</Text>

          <Text style={styles.emptyText}>Try another search term.</Text>
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
  );
}
