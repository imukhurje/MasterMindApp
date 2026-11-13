// src/screens/Admin/AdminStudents.js

import React, { useCallback, useMemo, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
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

import { api } from '../../../api/client';

import styles from './AdminStudents.styles';

import { Dropdown } from 'react-native-element-dropdown';

import Clipboard from '@react-native-clipboard/clipboard';

const PER_PAGE = 30;

function getInitials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'ST';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatClassGroups(groups) {
  if (!Array.isArray(groups) || groups.length === 0) {
    return 'Class not assigned';
  }

  return groups
    .map(group => {
      const name = String(group?.name || '').trim();

      const section = String(group?.section || '').trim();

      if (!name) {
        return null;
      }

      return section ? `${name} (${section})` : name;
    })
    .filter(Boolean)
    .join(', ');
}

function getAcademicYear(student, onboarding) {
  return (
    student?.placement?.academic_year?.name ||
    onboarding?.academic_year?.label ||
    'Not available'
  );
}

export default function AdminStudents({ navigation }) {
  const insets = useSafeAreaInsets();

  const searchRef = useRef('');

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [me, setMe] = useState(null);

  const [onboarding, setOnboarding] = useState(null);

  const [meta, setMeta] = useState(null);

  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const [searching, setSearching] = useState(false);

  const [selectedClassId, setSelectedClassId] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState(null);

  const [deletingStudentId, setDeletingStudentId] = useState(null);

  const [credentialsModalVisible, setCredentialsModalVisible] = useState(false);

  const [credentialsLoading, setCredentialsLoading] = useState(false);

  const [credentialsSaving, setCredentialsSaving] = useState(false);

  const [credentialRows, setCredentialRows] = useState([]);

  const [credentialsSaved, setCredentialsSaved] = useState(false);

  const [credentialsMessageModalVisible, setCredentialsMessageModalVisible] =
    useState(false);

  const [credentialsMessageLoading, setCredentialsMessageLoading] =
    useState(false);

  const [credentialsMessageData, setCredentialsMessageData] = useState(null);

  const [sendingCredentialsEmail, setSendingCredentialsEmail] = useState(false);

  const [selectedStudentIds, setSelectedStudentIds] = useState(() => new Set());

  const [combinationStudent, setCombinationStudent] = useState(null);

  const [selectedCombinationId, setSelectedCombinationId] = useState(null);

  const [savingCombination, setSavingCombination] = useState(false);

  const classOptions = useMemo(() => {
    const classes = Array.isArray(meta?.classes) ? meta.classes : [];

    return [
      {
        label: 'All Classes',
        value: null,
      },

      ...classes.map(item => ({
        label: item.label,
        value: item.id,
      })),
    ];
  }, [meta?.classes]);

  const statusOptions = [
    {
      label: 'All Statuses',
      value: null,
    },
    {
      label: 'Active',
      value: 'active',
    },
    {
      label: 'Inactive',
      value: 'inactive',
    },
  ];

  const loadStudents = useCallback(
    async ({ requestedPage = 1, query = '', append = false } = {}) => {
      const params = [
        `q=${encodeURIComponent(query)}`,
        `page=${encodeURIComponent(requestedPage)}`,
        `per_page=${PER_PAGE}`,
      ];

      if (selectedClassId) {
        params.push(`class_group_id=${encodeURIComponent(selectedClassId)}`);
      }

      if (selectedStatus) {
        params.push(`status=${encodeURIComponent(selectedStatus)}`);
      }

      const response = await api(`/api/students?${params.join('&')}`);

      const rows = Array.isArray(response?.rows) ? response.rows : [];

      if (append) {
        setStudents(current => {
          const map = new Map();

          current.forEach(item => {
            map.set(String(item?.id), item);
          });

          rows.forEach(item => {
            map.set(String(item?.id), item);
          });

          return Array.from(map.values());
        });
      } else {
        setStudents(rows);
      }

      setPage(Number(response?.page) || requestedPage);

      setLastPage(Number(response?.last_page) || 1);

      setTotalCount(Number(response?.count) || 0);
    },
    [selectedClassId, selectedStatus],
  );

  const handleClassFilterChange = useCallback(
    async item => {
      const value = item?.value ?? null;

      setSelectedClassId(value);

      try {
        setSearching(true);

        const params = [
          `q=${encodeURIComponent(searchRef.current)}`,
          'page=1',
          `per_page=${PER_PAGE}`,
        ];

        if (value) {
          params.push(`class_group_id=${encodeURIComponent(value)}`);
        }

        if (selectedStatus) {
          params.push(`status=${encodeURIComponent(selectedStatus)}`);
        }

        const response = await api(`/api/students?${params.join('&')}`);

        setStudents(Array.isArray(response?.rows) ? response.rows : []);

        setPage(Number(response?.page) || 1);

        setLastPage(Number(response?.last_page) || 1);

        setTotalCount(Number(response?.count) || 0);
      } catch (error) {
        Alert.alert('Students', error?.message || 'Could not filter students.');
      } finally {
        setSearching(false);
      }
    },
    [selectedStatus],
  );

  const handleStatusFilterChange = useCallback(
    async item => {
      const value = item?.value ?? null;

      setSelectedStatus(value);

      try {
        setSearching(true);

        const params = [
          `q=${encodeURIComponent(searchRef.current)}`,
          'page=1',
          `per_page=${PER_PAGE}`,
        ];

        if (selectedClassId) {
          params.push(`class_group_id=${encodeURIComponent(selectedClassId)}`);
        }

        if (value) {
          params.push(`status=${encodeURIComponent(value)}`);
        }

        const response = await api(`/api/students?${params.join('&')}`);

        setStudents(Array.isArray(response?.rows) ? response.rows : []);

        setPage(Number(response?.page) || 1);

        setLastPage(Number(response?.last_page) || 1);

        setTotalCount(Number(response?.count) || 0);
      } catch (error) {
        Alert.alert('Students', error?.message || 'Could not filter students.');
      } finally {
        setSearching(false);
      }
    },
    [selectedClassId],
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
         * Verify the current user before
         * loading administrator data.
         */
        const meResponse = await api('/api/me');

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
            'Only administrators can manage students.',
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

        const [onboardingResponse, metaResponse] = await Promise.all([
          api('/api/settings/v1/onboarding'),

          api('/api/students/meta'),
        ]);

        setOnboarding(onboardingResponse || null);

        setMeta(metaResponse || null);

        await loadStudents({
          requestedPage: 1,
          query: searchRef.current,
          append: false,
        });
      } catch (error) {
        console.log('Admin students load error:', error);

        Alert.alert('Students', error?.message || 'Could not load students.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loadStudents, navigation],
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

      const query = search.trim();

      searchRef.current = query;

      await loadStudents({
        requestedPage: 1,
        query,
        append: false,
      });
    } catch (error) {
      console.log('Student search error:', error);

      Alert.alert('Students', error?.message || 'Could not search students.');
    } finally {
      setSearching(false);
    }
  }, [search, loadStudents]);

  const handleClearSearch = useCallback(async () => {
    try {
      setSearch('');

      searchRef.current = '';

      setSearching(true);

      await loadStudents({
        requestedPage: 1,
        query: '',
        append: false,
      });
    } catch (error) {
      console.log('Clear student search error:', error);
    } finally {
      setSearching(false);
    }
  }, [loadStudents]);

  const handleAddStudent = useCallback(() => {
    navigation.navigate('AdminStudentCreate');
  }, [navigation]);

  const handleIdentityCards = useCallback(() => {
    navigation.navigate('AdminStudentIdentityCards');
  }, [navigation]);

  const openCombinationModal = useCallback(student => {
    if (student?.subject_combination_eligible !== true) {
      return;
    }

    setCombinationStudent(student);

    setSelectedCombinationId(student?.subject_combination?.id ?? null);
  }, []);

  const closeCombinationModal = useCallback(() => {
    if (savingCombination) return;

    setCombinationStudent(null);
    setSelectedCombinationId(null);
  }, [savingCombination]);

  const saveSubjectCombination = async () => {
    if (!combinationStudent || savingCombination) return;

    const studentId = Number(combinationStudent?.id);

    if (!Number.isInteger(studentId) || studentId <= 0) {
      Alert.alert('Error', 'Invalid student ID.');
      return;
    }

    if (!selectedCombinationId) {
      Alert.alert(
        'Subject Combination',
        'Please select a subject combination.',
      );
      return;
    }

    const options = Array.isArray(
      combinationStudent?.subject_combination_options,
    )
      ? combinationStudent.subject_combination_options
      : [];

    if (
      !options.some(
        option => String(option.id) === String(selectedCombinationId),
      )
    ) {
      Alert.alert('Subject Combination', 'Please select a valid combination.');
      return;
    }

    try {
      setSavingCombination(true);

      const response = await api(
        `/api/students/${studentId}/subject-combination`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            combination_id: selectedCombinationId,
          }),
        },
      );

      if (response?.ok !== true) {
        throw new Error('Subject combination update failed.');
      }

      // Close modal
      setCombinationStudent(null);
      setSelectedCombinationId(null);

      // Reload student list with existing search and filters
      await loadStudents({
        requestedPage: 1,
        query: searchRef.current,
        append: false,
      });

      Alert.alert('Success', 'Subject combination updated successfully.');
    } catch (error) {
      console.log('Subject combination error:', error);

      Alert.alert(
        'Update Failed',
        error?.message || 'Could not update subject combination.',
      );
    } finally {
      setSavingCombination(false);
    }
  };

  const handleEditStudent = useCallback(
    student => {
      navigation.navigate('AdminStudentEdit', {
        studentId: student?.id,
        student,
        studentMeta: meta,
      });
    },
    [navigation, meta],
  );

  const handleDeleteStudent = useCallback(
    student => {
      const studentId = Number(student?.id);

      if (!Number.isFinite(studentId)) {
        Alert.alert('Delete Student', 'A valid student ID is required.');

        return;
      }

      Alert.alert('Delete Student', 'Delete this student?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            if (deletingStudentId !== null) {
              return;
            }

            try {
              setDeletingStudentId(studentId);

              const response = await api(
                `/api/students/${encodeURIComponent(studentId)}`,
                {
                  method: 'DELETE',
                },
              );

              if (response?.ok !== true) {
                throw new Error('Could not delete the student.');
              }

              /*
               * The backend soft-deletes the student
               * by changing the status to inactive.
               */
              if (selectedStatus === 'active') {
                /*
                 * Remove the student from the current
                 * Active-only filtered list.
                 */
                setStudents(current =>
                  current.filter(item => Number(item?.id) !== studentId),
                );

                setTotalCount(current => Math.max(0, current - 1));
              } else {
                /*
                 * Keep the student visible and
                 * immediately show the new status.
                 */
                setStudents(current =>
                  current.map(item =>
                    Number(item?.id) === studentId
                      ? {
                          ...item,
                          status: 'inactive',
                        }
                      : item,
                  ),
                );
              }

              Alert.alert(
                'Student Deleted',
                'Student deleted successfully. The student is now inactive.',
              );
            } catch (error) {
              console.log('Delete student error:', error);

              Alert.alert(
                'Delete Student',
                error?.message || 'Could not delete the student.',
              );
            } finally {
              setDeletingStudentId(null);
            }
          },
        },
      ]);
    },
    [deletingStudentId, selectedStatus],
  );

  const openCredentialsMessage = useCallback(
    async ({ studentId, studentName = '' }) => {
      const id = Number(studentId);

      if (!Number.isFinite(id)) {
        Alert.alert('Credentials Message', 'A valid student ID is required.');

        return;
      }

      try {
        /*
         * Avoid stacking two native modals.
         */
        setCredentialsModalVisible(false);

        setCredentialsMessageModalVisible(true);
        setCredentialsMessageLoading(true);
        setCredentialsMessageData(null);

        const response = await api(
          `/api/students/${encodeURIComponent(id)}/credentials/message`,
        );

        if (!response?.message) {
          throw new Error('Credentials message was not returned.');
        }

        setCredentialsMessageData({
          ...response,
          student_id: id,
          student_name: studentName,
        });
      } catch (error) {
        console.log('Credentials message error:', error);

        setCredentialsMessageModalVisible(false);

        Alert.alert(
          'Credentials Message',
          error?.message || 'Could not load credentials message.',
        );
      } finally {
        setCredentialsMessageLoading(false);
      }
    },
    [],
  );

  const handleShowCredentialsMessage = useCallback(
    student => {
      openCredentialsMessage({
        studentId: student?.id,
        studentName: student?.name || '',
      });
    },
    [openCredentialsMessage],
  );

  const handleStudentIconAction = useCallback(async student => {
    const studentId = Number(student?.id);

    if (!Number.isFinite(studentId)) {
      Alert.alert('Student Credentials', 'A valid student ID is required.');

      return;
    }

    try {
      setCredentialsModalVisible(true);
      setCredentialsLoading(true);
      setCredentialsSaved(false);
      setCredentialRows([]);

      const response = await api('/api/students/credentials/preview', {
        method: 'POST',

        body: JSON.stringify({
          student_ids: [studentId],
        }),
      });

      const rows = Array.isArray(response?.rows) ? response.rows : [];

      if (rows.length === 0) {
        throw new Error('Credential preview was not returned.');
      }

      setCredentialRows(
        rows.map(row => ({
          ...row,

          username: String(row?.username || ''),

          password: String(row?.password || ''),
        })),
      );
    } catch (error) {
      console.log('Credential preview error:', error);

      setCredentialsModalVisible(false);

      Alert.alert(
        'Student Credentials',
        error?.message || 'Could not generate credential preview.',
      );
    } finally {
      setCredentialsLoading(false);
    }
  }, []);

  const handleCloseCredentialsModal = useCallback(() => {
    if (credentialsSaving) {
      return;
    }

    setCredentialsModalVisible(false);

    setCredentialRows([]);

    setCredentialsSaved(false);
  }, [credentialsSaving]);

  const updateCredentialField = useCallback((studentId, field, value) => {
    setCredentialRows(current =>
      current.map(row =>
        Number(row?.student_id) === Number(studentId)
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );
  }, []);

  const handleSaveCredentials = useCallback(async () => {
    if (credentialsSaving || credentialRows.length === 0) {
      return;
    }

    const credentials = credentialRows.map(row => ({
      student_id: Number(row?.student_id),

      username: String(row?.username || '').trim(),

      password: String(row?.password || '').trim(),
    }));

    const invalidRow = credentials.find(
      row => !Number.isFinite(row.student_id) || !row.username || !row.password,
    );

    if (invalidRow) {
      Alert.alert(
        'Student Credentials',
        'Username and password are required for every selected student.',
      );

      return;
    }

    try {
      setCredentialsSaving(true);

      const response = await api('/api/students/credentials', {
        method: 'POST',

        body: JSON.stringify({
          credentials,
        }),
      });

      const savedRows = Array.isArray(response?.rows) ? response.rows : [];

      if (savedRows.length === 0) {
        throw new Error('Credentials were not saved.');
      }

      const savedIds = new Set(credentials.map(row => row.student_id));

      setStudents(current =>
        current.map(item =>
          savedIds.has(Number(item?.id))
            ? {
                ...item,
                has_login_credentials: true,
              }
            : item,
        ),
      );

      setCredentialsSaved(true);
    } catch (error) {
      console.log('Save credentials error:', error);

      Alert.alert(
        'Student Credentials',
        error?.message || 'Could not save credentials.',
      );
    } finally {
      setCredentialsSaving(false);
    }
  }, [credentialRows, credentialsSaving]);

  const handleCredentialMessageAction = useCallback(
    row => {
      openCredentialsMessage({
        studentId: row?.student_id,

        studentName: row?.name || '',
      });
    },
    [openCredentialsMessage],
  );

  const sendCredentialsEmail = useCallback(
    async studentId => {
      const id = Number(studentId);

      if (!Number.isFinite(id)) {
        Alert.alert('Send Email', 'A valid student ID is required.');

        return;
      }

      if (sendingCredentialsEmail) {
        return;
      }

      try {
        setSendingCredentialsEmail(true);

        const response = await api(
          `/api/students/${encodeURIComponent(id)}/credentials/email`,
          {
            method: 'POST',

            body: JSON.stringify({}),
          },
        );

        if (response?.ok !== true) {
          throw new Error('Credentials email could not be sent.');
        }

        Alert.alert(
          'Email Sent',
          'The credentials email was sent successfully.',
        );
      } catch (error) {
        console.log('Credentials email error:', error);

        Alert.alert(
          'Send Email',
          error?.message || 'Could not send credentials email.',
        );
      } finally {
        setSendingCredentialsEmail(false);
      }
    },
    [sendingCredentialsEmail],
  );

  const handleCredentialEmailAction = useCallback(
    row => {
      sendCredentialsEmail(row?.student_id);
    },
    [sendCredentialsEmail],
  );

  const handleCopyCredentialsMessage = useCallback(() => {
    const message = String(credentialsMessageData?.message || '');

    if (!message) {
      return;
    }

    Clipboard.setString(message);

    Alert.alert('Copied', 'Credentials message copied to clipboard.');
  }, [credentialsMessageData?.message]);

  const handleCloseCredentialsMessage = useCallback(() => {
    if (sendingCredentialsEmail) {
      return;
    }

    setCredentialsMessageModalVisible(false);

    setCredentialsMessageData(null);
  }, [sendingCredentialsEmail]);

  const toggleStudentSelection = useCallback(studentId => {
    const id = Number(studentId);

    if (!Number.isFinite(id)) {
      return;
    }

    setSelectedStudentIds(current => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const selectedCount = selectedStudentIds.size;

  const handleSelectAllStudents = useCallback(() => {
    const ids = students.map(item => Number(item?.id)).filter(Number.isFinite);

    setSelectedStudentIds(new Set(ids));
  }, [students]);

  const handleDeselectAllStudents = useCallback(() => {
    setSelectedStudentIds(new Set());
  }, []);

  const handleGenerateSelectedCredentials = useCallback(async () => {
    const studentIds = Array.from(selectedStudentIds);

    if (studentIds.length === 0) {
      Alert.alert('Generate Credentials', 'Select at least one student.');

      return;
    }

    try {
      setCredentialsModalVisible(true);
      setCredentialsLoading(true);
      setCredentialsSaved(false);
      setCredentialRows([]);

      const response = await api('/api/students/credentials/preview', {
        method: 'POST',

        body: JSON.stringify({
          student_ids: studentIds,
        }),
      });

      const rows = Array.isArray(response?.rows) ? response.rows : [];

      if (rows.length === 0) {
        throw new Error('Credential preview was not returned.');
      }

      setCredentialRows(
        rows.map(row => ({
          ...row,

          username: String(row?.username || ''),

          password: String(row?.password || ''),
        })),
      );
    } catch (error) {
      console.log('Bulk credential preview error:', error);

      setCredentialsModalVisible(false);

      Alert.alert(
        'Generate Credentials',
        error?.message || 'Could not generate credentials.',
      );
    } finally {
      setCredentialsLoading(false);
    }
  }, [selectedStudentIds]);

  const loadNextPage = useCallback(async () => {
    if (loading || loadingMore || page >= lastPage) {
      return;
    }

    try {
      setLoadingMore(true);

      await loadStudents({
        requestedPage: page + 1,

        query: searchRef.current,

        append: true,
      });
    } catch (error) {
      console.log('Student load more error:', error);

      Alert.alert(
        'Students',
        error?.message || 'Could not load more students.',
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, page, lastPage, loadStudents]);

  const onRefresh = useCallback(async () => {
    await loadScreen({
      refresh: true,
    });
  }, [loadScreen]);

  const renderStudent = useCallback(
    ({ item }) => {
      const classLabel = formatClassGroups(item?.class_groups);

      const academicYear = getAcademicYear(item, onboarding);

      const status = String(item?.status || '')
        .trim()
        .toLowerCase();

      const isActive = status === 'active';

      const photoUrl = String(item?.photo_url || '').trim();

      const studentId = Number(item?.id);

      const isSelected =
        Number.isFinite(studentId) && selectedStudentIds.has(studentId);

      const placement = item?.placement;

      const apiIssueLabels = Array.isArray(placement?.issue_labels)
        ? placement.issue_labels.filter(Boolean)
        : [];

      const apiIssues = Array.isArray(placement?.issues)
        ? placement.issues.filter(Boolean)
        : [];

      let correctionIssues = [];

      // Backend placement result is authoritative.
      if (placement?.complete === true) {
        correctionIssues = [];
      } else if (placement?.complete === false) {
        correctionIssues =
          apiIssueLabels.length > 0
            ? apiIssueLabels
            : apiIssues.length > 0
            ? apiIssues.map(String)
            : ['Student placement is incomplete'];
      } else {
        // When placement.complete is not returned,
        // use the issues reported by the backend.
        correctionIssues =
          apiIssueLabels.length > 0 ? apiIssueLabels : apiIssues.map(String);
      }

      const needsCorrection = correctionIssues.length > 0;

      return (
        <View style={styles.studentCard}>
          <View style={styles.studentTop}>
            <View style={styles.avatar}>
              {photoUrl ? (
                <Image
                  source={{
                    uri: photoUrl,
                  }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.initials}>{getInitials(item?.name)}</Text>
              )}
            </View>

            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{item?.name || 'Student'}</Text>

              {!!item?.email && (
                <View style={styles.contactRow}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={14}
                    color="#AFC0D8"
                  />
                  <Text style={styles.contactText}>{item.email}</Text>
                </View>
              )}

              <View style={styles.contactRow}>
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={14}
                  color="#AFC0D8"
                />
                <Text style={styles.contactText}>
                  {item?.phone || 'No phone'}
                </Text>
              </View>
            </View>

            <View style={styles.rollBox}>
              <Text style={styles.rollLabel}>ROLL</Text>
              <Text style={styles.rollValue}>{item?.roll_no || '-'}</Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailsAndSelectionRow}>
              <View style={styles.detailsLeft}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Class</Text>

                  <Text style={styles.detailValue} numberOfLines={2}>
                    {classLabel}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Academic Year</Text>

                  <Text style={styles.detailValue}>{academicYear}</Text>
                </View>
              </View>

              <Pressable
                onPress={() => toggleStudentSelection(item?.id)}
                hitSlop={8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                style={({ pressed }) => [
                  styles.studentCheckSideButton,
                  isSelected && styles.studentCheckSideButtonSelected,
                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name={
                    isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'
                  }
                  size={22}
                  color={isSelected ? '#93C5FD' : '#94A3B8'}
                />
              </Pressable>
            </View>
          </View>

          {item?.subject_combination_eligible === true && (
            <View style={styles.subjectCombinationSection}>
              <Text style={styles.subjectCombinationLabel}>
                Subject Combination
              </Text>

              <View style={styles.subjectCombinationRow}>
                <View style={styles.subjectCombinationValue}>
                  <Text style={styles.subjectCombinationText} numberOfLines={1}>
                    {item?.subject_combination?.name ||
                      'No subject combination assigned'}
                  </Text>
                </View>

                <Pressable
                  onPress={() => openCombinationModal(item)}
                  style={({ pressed }) => [
                    styles.subjectCombinationEditButton,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={18}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.badgesRow}>
            <View
              style={[
                styles.statusBadge,

                isActive ? styles.activeBadge : styles.inactiveBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,

                  isActive ? styles.activeBadgeText : styles.inactiveBadgeText,
                ]}
              >
                {status ? status.toUpperCase() : 'UNKNOWN'}
              </Text>
            </View>

            {item?.is_draft === true ? (
              <View style={[styles.statusBadge, styles.draftBadge]}>
                <Text style={[styles.statusBadgeText, styles.draftBadgeText]}>
                  DRAFT
                </Text>
              </View>
            ) : null}
          </View>
          {needsCorrection ? (
            <View style={styles.correctionBox}>
              <Text style={styles.correctionText}>
                <Text style={styles.correctionTitle}>Needs correction:</Text>{' '}
                {correctionIssues.join(', ')}
              </Text>
            </View>
          ) : null}
          <View style={styles.studentActions}>
            <View style={styles.topActionRow}>
              <Pressable
                onPress={() => handleEditStudent(item)}
                style={({ pressed }) => [
                  styles.editButton,
                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>

              <Pressable
                disabled={deletingStudentId === Number(item?.id)}
                onPress={() => handleDeleteStudent(item)}
                style={({ pressed }) => [
                  styles.deleteButton,

                  deletingStudentId === Number(item?.id) &&
                    styles.controlDisabled,

                  pressed &&
                    deletingStudentId !== Number(item?.id) &&
                    styles.controlPressed,
                ]}
              >
                {deletingStudentId === Number(item?.id) ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete</Text>
                )}
              </Pressable>
            </View>

            <View style={styles.bottomActionRow}>
              {item?.has_login_credentials === true ? (
                <Pressable
                  onPress={() => handleShowCredentialsMessage(item)}
                  style={({ pressed }) => [
                    styles.credentialsButton,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.credentialsButtonText}>
                    Show Credentials Message
                  </Text>
                </Pressable>
              ) : null}

              <Pressable
                onPress={() => handleStudentIconAction(item)}
                style={({ pressed }) => [
                  styles.iconOnlyButton,
                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="shield-outline"
                  size={18}
                  color="#DCE7F5"
                />
              </Pressable>
            </View>
          </View>
        </View>
      );
    },
    [
      onboarding,
      deletingStudentId,
      selectedStudentIds,
      toggleStudentSelection,
      handleEditStudent,
      handleDeleteStudent,
      handleShowCredentialsMessage,
      handleStudentIconAction,
      openCombinationModal,
    ],
  );

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading students...</Text>
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
        data={students}
        extraData={selectedStudentIds}
        keyExtractor={item => String(item?.id)}
        renderItem={renderStudent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#67D1F0"
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryActionRow}>
                <Pressable
                  onPress={handleAddStudent}
                  style={({ pressed }) => [
                    styles.primaryHeaderButton,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="account-plus-outline"
                    size={17}
                    color="#FFFFFF"
                  />

                  <Text style={styles.primaryHeaderButtonText}>
                    Add Student
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleIdentityCards}
                  style={({ pressed }) => [
                    styles.secondaryHeaderButton,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="card-account-details-outline"
                    size={17}
                    color="#FFFFFF"
                  />

                  <Text style={styles.secondaryHeaderButtonText}>
                    Identity Cards
                  </Text>
                </Pressable>
              </View>

              <View style={styles.totalBadge}>
                <Text style={styles.totalValue}>{totalCount}</Text>

                <Text style={styles.totalLabel}>TOTAL</Text>
              </View>
            </View>

            <View style={styles.bulkActionBar}>
              <View style={styles.bulkActionLeft}>
                <Pressable
                  onPress={
                    selectedCount > 0
                      ? handleDeselectAllStudents
                      : handleSelectAllStudents
                  }
                  style={({ pressed }) => [
                    styles.bulkSelectButton,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.bulkSelectButtonText}>
                    {selectedCount > 0 ? 'Deselect All' : 'Select All Students'}
                  </Text>
                </Pressable>

                {selectedCount > 0 ? (
                  <Text style={styles.selectedCountText}>
                    {selectedCount} selected
                  </Text>
                ) : null}
              </View>

              <Pressable
                onPress={handleGenerateSelectedCredentials}
                disabled={selectedCount === 0}
                style={({ pressed }) => [
                  styles.generateCredentialsButton,

                  selectedCount === 0 && styles.controlDisabled,

                  pressed && selectedCount > 0 && styles.controlPressed,
                ]}
              >
                <Text style={styles.generateCredentialsButtonText}>
                  Generate Credentials
                </Text>
              </Pressable>
            </View>

            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={20}
                  color="#94A3B8"
                />

                <TextInput
                  value={search}
                  onChangeText={handleSearchChange}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                  placeholder="Search students"
                  placeholderTextColor="#718096"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.searchInput}
                />

                {!!search ? (
                  <Pressable onPress={handleClearSearch} hitSlop={8}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={20}
                      color="#94A3B8"
                    />
                  </Pressable>
                ) : null}
              </View>

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
                  <MaterialCommunityIcons
                    name="magnify"
                    size={21}
                    color="#FFFFFF"
                  />
                )}
              </Pressable>
            </View>

            <View style={styles.filtersRow}>
              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Class</Text>

                <Dropdown
                  style={styles.dropdown}
                  containerStyle={styles.dropdownContainer}
                  itemTextStyle={styles.dropdownItemText}
                  selectedTextStyle={styles.dropdownSelectedText}
                  placeholderStyle={styles.dropdownPlaceholder}
                  activeColor="#173B60"
                  iconColor="#D7E3F4"
                  data={classOptions}
                  labelField="label"
                  valueField="value"
                  value={selectedClassId}
                  placeholder="All Classes"
                  search
                  searchPlaceholder="Search class..."
                  onChange={handleClassFilterChange}
                />
              </View>

              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Status</Text>

                <Dropdown
                  style={styles.dropdown}
                  containerStyle={styles.dropdownContainer}
                  itemTextStyle={styles.dropdownItemText}
                  selectedTextStyle={styles.dropdownSelectedText}
                  placeholderStyle={styles.dropdownPlaceholder}
                  activeColor="#173B60"
                  iconColor="#D7E3F4"
                  data={statusOptions}
                  labelField="label"
                  valueField="value"
                  value={selectedStatus}
                  placeholder="All Statuses"
                  onChange={handleStatusFilterChange}
                />
              </View>
            </View>

            <View style={styles.listHeading}>
              <Text style={styles.listHeadingTitle}>Student List</Text>

              <Text style={styles.listHeadingMeta}>
                Page {page} of {lastPage}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="account-school-outline"
              size={38}
              color="#6B7D95"
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
      <Modal
        visible={credentialsModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseCredentialsModal}
      >
        <View style={styles.credentialsModalBackdrop}>
          <View style={styles.credentialsModal}>
            <Text style={styles.credentialsModalTitle}>
              Generate Student Credentials
            </Text>

            <Text style={styles.credentialsModalSubtitle}>
              Review or edit the suggested username and password before saving.
              Passwords are stored securely and shown only to administrators in
              the credentials message.
            </Text>

            <Pressable
              disabled={credentialsSaving}
              onPress={handleCloseCredentialsModal}
              style={({ pressed }) => [
                styles.credentialsCloseIcon,

                pressed && styles.controlPressed,
              ]}
            >
              <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
            </Pressable>

            {credentialsLoading ? (
              <View style={styles.credentialsLoader}>
                <ActivityIndicator size="large" color="#67D1F0" />

                <Text style={styles.credentialsLoadingText}>
                  Generating credentials...
                </Text>
              </View>
            ) : credentialRows.length > 0 ? (
              <>
                <ScrollView
                  style={styles.credentialsRowsScroll}
                  contentContainerStyle={styles.credentialsRowsContent}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {credentialRows.map(row => (
                    <View
                      key={String(row.student_id)}
                      style={styles.credentialStudentCard}
                    >
                      <View style={styles.credentialStudentInfo}>
                        <Text style={styles.credentialStudentName}>
                          {row?.name || 'Student'}
                        </Text>

                        <Text style={styles.credentialStudentMeta}>
                          {row?.class_label || 'No class'}
                          {' · Roll '}
                          {row?.roll_no || '—'}
                        </Text>

                        {row?.has_existing_credentials === true ? (
                          <Text style={styles.credentialExistingText}>
                            Replaces existing credentials
                          </Text>
                        ) : (
                          <Text style={styles.credentialNewText}>
                            New credentials will be created
                          </Text>
                        )}
                      </View>

                      <View style={styles.credentialField}>
                        <Text style={styles.credentialLabel}>Username</Text>

                        <TextInput
                          value={row.username}
                          onChangeText={value =>
                            updateCredentialField(
                              row.student_id,
                              'username',
                              value,
                            )
                          }
                          editable={!credentialsSaving}
                          autoCapitalize="none"
                          autoCorrect={false}
                          style={styles.credentialInput}
                        />
                      </View>

                      <View style={styles.credentialField}>
                        <Text style={styles.credentialLabel}>Password</Text>

                        <TextInput
                          value={row.password}
                          onChangeText={value =>
                            updateCredentialField(
                              row.student_id,
                              'password',
                              value,
                            )
                          }
                          editable={!credentialsSaving}
                          autoCapitalize="none"
                          autoCorrect={false}
                          style={styles.credentialInput}
                        />
                      </View>

                      {credentialsSaved ? (
                        <View style={styles.credentialPostSaveActions}>
                          <Pressable
                            onPress={() => handleCredentialMessageAction(row)}
                            style={({ pressed }) => [
                              styles.credentialActionButton,

                              pressed && styles.controlPressed,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="message-text-outline"
                              size={19}
                              color="#FFFFFF"
                            />
                          </Pressable>

                          <Pressable
                            onPress={() => handleCredentialEmailAction(row)}
                            style={({ pressed }) => [
                              styles.credentialActionButton,

                              pressed && styles.controlPressed,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="email-outline"
                              size={19}
                              color="#FFFFFF"
                            />
                          </Pressable>
                        </View>
                      ) : null}
                    </View>
                  ))}
                </ScrollView>

                {credentialsSaved ? (
                  <View style={styles.credentialsSuccessBox}>
                    <MaterialCommunityIcons
                      name="check-circle-outline"
                      size={18}
                      color="#86EFAC"
                    />

                    <Text style={styles.credentialsSuccessText}>
                      Credentials saved successfully.
                    </Text>
                  </View>
                ) : null}

                <View style={styles.credentialsFooter}>
                  <Pressable
                    disabled={credentialsSaving}
                    onPress={handleCloseCredentialsModal}
                    style={({ pressed }) => [
                      styles.credentialsCancelButton,
                      pressed && styles.controlPressed,
                    ]}
                  >
                    <Text style={styles.credentialsCancelText}>Close</Text>
                  </Pressable>

                  {!credentialsSaved ? (
                    <Pressable
                      disabled={credentialsSaving}
                      onPress={handleSaveCredentials}
                      style={({ pressed }) => [
                        styles.credentialsSaveButton,

                        credentialsSaving && styles.controlDisabled,

                        pressed && !credentialsSaving && styles.controlPressed,
                      ]}
                    >
                      {credentialsSaving ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.credentialsSaveText}>
                          Save Credentials
                        </Text>
                      )}
                    </Pressable>
                  ) : null}
                </View>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
      <Modal
        visible={credentialsMessageModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseCredentialsMessage}
      >
        <View style={styles.credentialsMessageBackdrop}>
          <View style={styles.credentialsMessageModal}>
            <Text style={styles.credentialsMessageTitle}>
              Credentials Message
              {credentialsMessageData?.student_name
                ? ` — ${credentialsMessageData.student_name}`
                : ''}
            </Text>

            <Pressable
              disabled={sendingCredentialsEmail}
              onPress={handleCloseCredentialsMessage}
              style={({ pressed }) => [
                styles.credentialsMessageClose,

                pressed && styles.controlPressed,
              ]}
            >
              <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
            </Pressable>

            {credentialsMessageLoading ? (
              <View style={styles.credentialsMessageLoader}>
                <ActivityIndicator size="large" color="#67D1F0" />

                <Text style={styles.credentialsLoadingText}>
                  Loading credentials message...
                </Text>
              </View>
            ) : credentialsMessageData ? (
              <>
                <ScrollView
                  style={styles.credentialsMessageBody}
                  contentContainerStyle={styles.credentialsMessageBodyContent}
                  showsVerticalScrollIndicator={false}
                >
                  <Text selectable style={styles.credentialsMessageText}>
                    {credentialsMessageData.message}
                  </Text>
                </ScrollView>

                <View style={styles.credentialsMessageFooter}>
                  <Pressable
                    onPress={handleCopyCredentialsMessage}
                    style={({ pressed }) => [
                      styles.credentialsMessageButton,

                      pressed && styles.controlPressed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="content-copy"
                      size={18}
                      color="#FFFFFF"
                    />

                    <Text style={styles.credentialsMessageButtonText}>
                      Copy
                    </Text>
                  </Pressable>

                  <Pressable
                    disabled={
                      sendingCredentialsEmail ||
                      credentialsMessageData?.can_send_email !== true
                    }
                    onPress={() =>
                      sendCredentialsEmail(credentialsMessageData?.student_id)
                    }
                    style={({ pressed }) => [
                      styles.credentialsMessageButton,

                      (sendingCredentialsEmail ||
                        credentialsMessageData?.can_send_email !== true) &&
                        styles.controlDisabled,

                      pressed &&
                        !sendingCredentialsEmail &&
                        styles.controlPressed,
                    ]}
                  >
                    {sendingCredentialsEmail ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <MaterialCommunityIcons
                          name="email-outline"
                          size={18}
                          color="#FFFFFF"
                        />

                        <Text style={styles.credentialsMessageButtonText}>
                          Send Email
                        </Text>
                      </>
                    )}
                  </Pressable>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </Modal>

      <Modal
        visible={combinationStudent !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeCombinationModal}
      >
        <View style={styles.combinationModalOverlay}>
          <Pressable
            style={styles.combinationModalBackdrop}
            onPress={closeCombinationModal}
          />

          <View style={styles.combinationModalCard}>
            <View style={styles.combinationModalHeader}>
              <Text style={styles.combinationModalTitle}>
                Subject Combination — {combinationStudent?.name}
              </Text>

              <Pressable
                disabled={savingCombination}
                onPress={closeCombinationModal}
                style={styles.combinationCloseButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Text style={styles.combinationClassText}>
              Class: {formatClassGroups(combinationStudent?.class_groups)}
            </Text>

            <Text style={styles.combinationFieldLabel}>
              Subject Combination
            </Text>

            <ScrollView
              style={styles.combinationOptionsList}
              nestedScrollEnabled
            >
              {(combinationStudent?.subject_combination_options || []).map(
                option => {
                  const selected =
                    String(selectedCombinationId) === String(option.id);

                  return (
                    <Pressable
                      key={String(option.id)}
                      onPress={() => setSelectedCombinationId(option.id)}
                      disabled={savingCombination}
                      style={[
                        styles.combinationOption,
                        selected && styles.combinationOptionSelected,
                      ]}
                    >
                      <Text style={styles.combinationOptionText}>
                        {option.name}
                      </Text>

                      <MaterialCommunityIcons
                        name={selected ? 'radiobox-marked' : 'radiobox-blank'}
                        size={21}
                        color={selected ? '#7DD3FC' : '#94A3B8'}
                      />
                    </Pressable>
                  );
                },
              )}
            </ScrollView>

            <View style={styles.combinationModalFooter}>
              <Pressable
                onPress={closeCombinationModal}
                disabled={savingCombination}
                style={styles.combinationCancelButton}
              >
                <Text style={styles.combinationButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={saveSubjectCombination}
                disabled={savingCombination || !selectedCombinationId}
                style={[
                  styles.combinationSaveButton,
                  (savingCombination || !selectedCombinationId) &&
                    styles.controlDisabled,
                ]}
              >
                {savingCombination ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.combinationButtonText}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
