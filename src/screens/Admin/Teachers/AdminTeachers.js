import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  ScrollView,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';

import styles from './AdminTeachers.styles';
import TeacherIdentityCardsModal from './TeacherIdentityCardsModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';

const PER_PAGE = 20;

function normalizeClassGroup(item) {
  const name = String(item?.name || '').trim();

  const section = String(item?.section || '').trim();

  return {
    id: Number(item?.id),

    name,

    section,

    label: section ? `${name} (${section})` : name,
  };
}

function normalizeCourse(item) {
  return {
    id: Number(item?.id),

    title: String(item?.title || '').trim(),
  };
}

function normalizeTeacher(item) {
  return {
    id: Number(item?.id),

    userId: Number(item?.user_id),

    name: String(item?.name || 'Unnamed teacher'),

    email: String(item?.email || ''),

    phone: String(item?.phone || ''),

    department: String(item?.department || ''),

    designation: String(item?.designation || ''),

    bio: String(item?.bio || ''),

    photoUrl: String(item?.photo_url || ''),

    classGroups: (Array.isArray(item?.class_groups) ? item.class_groups : [])
      .map(normalizeClassGroup)
      .filter(item => Number.isFinite(item.id)),

    courses: (Array.isArray(item?.courses) ? item.courses : [])
      .map(normalizeCourse)
      .filter(item => Number.isFinite(item.id)),

    credentialsMessage: String(item?.credentials_message || ''),
    personnelId: Number(item?.personnel_id ?? item?.id),
  };
}

function getInitials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ''}${
    parts[parts.length - 1][0] || ''
  }`.toUpperCase();
}

export default function AdminTeachers({ navigation }) {
  const insets = useSafeAreaInsets();

  const { width } = useWindowDimensions();

  const [me, setMe] = useState(null);

  const [meta, setMeta] = useState(null);

  const [teachers, setTeachers] = useState([]);

  const [searchText, setSearchText] = useState('');

  const [appliedSearch, setAppliedSearch] = useState('');

  const [page, setPage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [deletingTeacherId, setDeletingTeacherId] = useState(null);

  const [expandedFields, setExpandedFields] = useState({});

  const [identityCardsVisible, setIdentityCardsVisible] = useState(false);

  const [credentialsTeacher, setCredentialsTeacher] = useState(null);
  const [sendingCredentialsEmail, setSendingCredentialsEmail] = useState(false);

  const [credentialsMessageLoading, setCredentialsMessageLoading] =
    useState(false);

  const [securityTeacher, setSecurityTeacher] = useState(null);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securitySaving, setSecuritySaving] = useState(false);

  const [securityForm, setSecurityForm] = useState({
    userId: null,
    name: '',
    email: '',
    username: '',
    password: '',
    hasExistingCredentials: false,
  });

  const [showSecurityPassword, setShowSecurityPassword] = useState(false);

  const numColumns = width >= 1000 ? 3 : width >= 650 ? 2 : 1;

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  const canManage = Boolean(meta?.can_manage);

  const loadTeachers = useCallback(
    async ({
      requestedPage = 1,
      query = '',
      refresh = false,
      append = false,
    } = {}) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const normalizedQuery = String(query || '').trim();

        const teachersUrl =
          `/api/teachers?q=${encodeURIComponent(normalizedQuery)}` +
          `&page=${encodeURIComponent(requestedPage)}` +
          `&per_page=${PER_PAGE}`;

        if (requestedPage === 1 && !append) {
          const [meResponse, metaResponse, teachersResponse] =
            await Promise.all([
              api('/api/me'),

              api('/api/teachers/meta'),

              api(teachersUrl),
            ]);

          setMe(meResponse || null);

          setMeta(metaResponse || null);

          const rows = Array.isArray(teachersResponse?.rows)
            ? teachersResponse.rows
            : [];

          setTeachers(
            rows.map(normalizeTeacher).filter(item => Number.isFinite(item.id)),
          );

          setTotalCount(Number(teachersResponse?.count) || 0);

          setPage(Number(teachersResponse?.page) || 1);
        } else {
          const response = await api(teachersUrl);

          const rows = (Array.isArray(response?.rows) ? response.rows : [])
            .map(normalizeTeacher)
            .filter(item => Number.isFinite(item.id));

          if (append) {
            setTeachers(current => {
              const map = new Map();

              current.forEach(teacher => {
                map.set(teacher.id, teacher);
              });

              rows.forEach(teacher => {
                map.set(teacher.id, teacher);
              });

              return Array.from(map.values());
            });
          } else {
            setTeachers(rows);
          }

          setTotalCount(Number(response?.count) || 0);

          setPage(Number(response?.page) || requestedPage);
        }

        navigation.setOptions({
          title: 'Teachers',
        });
      } catch (error) {
        console.log('Admin teachers load error:', error);

        Alert.alert('Teachers', error?.message || 'Could not load teachers.');
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [navigation],
  );

  useFocusEffect(
    useCallback(() => {
      loadTeachers({
        requestedPage: 1,
        query: appliedSearch,
      });
    }, [appliedSearch, loadTeachers]),
  );

  const resultLabel = useMemo(
    () => `${totalCount} ${totalCount === 1 ? 'teacher' : 'teachers'}`,
    [totalCount],
  );

  function submitSearch() {
    const query = searchText.trim();

    setAppliedSearch(query);

    if (query === appliedSearch) {
      loadTeachers({
        requestedPage: 1,
        query,
      });
    }
  }

  function clearSearch() {
    setSearchText('');
    setAppliedSearch('');

    if (!appliedSearch) {
      loadTeachers({
        requestedPage: 1,
        query: '',
      });
    }
  }

  function loadNextPage() {
    if (loading || loadingMore || page >= totalPages) {
      return;
    }

    loadTeachers({
      requestedPage: page + 1,

      query: appliedSearch,

      append: true,
    });
  }

  function openAddTeacher() {
    navigation.navigate('AdminTeacherForm', {
      mode: 'add',
    });
  }

  function openEditTeacher(teacher) {
    navigation.navigate('AdminTeacherForm', {
      mode: 'edit',
      teacher,
    });
  }

  function deleteTeacher(teacher) {
    const teacherId = Number(teacher?.id);

    if (!Number.isFinite(teacherId)) {
      Alert.alert('Delete Teacher', 'Teacher profile ID is missing.');

      return;
    }

    Alert.alert('Delete Teacher', 'Delete this teacher profile?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',

        onPress: () => confirmDeleteTeacher(teacher),
      },
    ]);
  }

  function toggleExpanded(teacherId, field) {
    const key = `${teacherId}_${field}`;

    setExpandedFields(current => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function renderExpandableList({
    teacherId,
    field,
    items = [],
    emptyText = '-',
    limit = 4,
  }) {
    const values = Array.isArray(items) ? items.filter(Boolean) : [];

    if (values.length === 0) {
      return <Text style={styles.infoValue}>{emptyText}</Text>;
    }

    const key = `${teacherId}_${field}`;
    const expanded = Boolean(expandedFields[key]);

    const visibleItems = expanded ? values : values.slice(0, limit);

    return (
      <Text style={styles.infoValue}>
        {visibleItems.join(', ')}

        {values.length > limit && (
          <Text
            onPress={() => toggleExpanded(teacherId, field)}
            style={styles.moreText}
          >
            {expanded ? '  show less' : '  ...more'}
          </Text>
        )}
      </Text>
    );
  }

  async function confirmDeleteTeacher(teacher) {
    const teacherId = Number(teacher?.id);

    if (!Number.isFinite(teacherId)) {
      return;
    }

    try {
      setDeletingTeacherId(teacherId);

      const response = await api(`/api/teachers/${teacherId}`, {
        method: 'DELETE',
      });

      if (response?.ok !== true) {
        throw new Error('Could not delete the teacher profile.');
      }

      setTeachers(current => current.filter(item => item.id !== teacherId));

      setTotalCount(current => Math.max(Number(current || 0) - 1, 0));
    } catch (error) {
      console.log('Delete teacher error:', error);

      Alert.alert(
        'Delete failed',
        error?.message || 'Could not delete the teacher profile.',
      );
    } finally {
      setDeletingTeacherId(null);
    }
  }

  function handleShowCredentialsMessage(teacher) {
    setCredentialsTeacher(teacher);
  }

  async function handleShowCredentialsMessage(teacher) {
    const userId = Number(teacher?.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      Alert.alert(
        'Credentials Message',
        'A valid teacher user ID is required.',
      );
      return;
    }

    // Open the modal with an empty message initially.
    setCredentialsTeacher({
      ...teacher,
      credentialsMessage: '',
    });

    setCredentialsMessageLoading(true);

    try {
      const response = await api(
        `/api/personnel/${encodeURIComponent(
          userId,
        )}/credentials/message?role=teacher`,
        {
          method: 'GET',
        },
      );

      const message = String(response?.message || '').trim();

      // Update the modal with the message returned by the backend.
      setCredentialsTeacher(current => {
        if (!current || Number(current.userId) !== userId) {
          return current;
        }

        return {
          ...current,
          credentialsMessage: message,
        };
      });
    } catch (error) {
      console.log('Teacher credentials message fetch error:', error?.message);

      Alert.alert(
        'Credentials Message',
        error?.data?.message ||
          error?.message ||
          'Could not load credentials message.',
      );
    } finally {
      setCredentialsMessageLoading(false);
    }
  }

  function closeCredentialsModal() {
    if (sendingCredentialsEmail || credentialsMessageLoading) {
      return;
    }

    setCredentialsTeacher(null);
  }

  function handleCopyCredentials() {
    const message = credentialsTeacher?.credentialsMessage;

    if (!message) {
      Alert.alert(
        'Credentials Message',
        'Credentials message is not available.',
      );
      return;
    }

    Clipboard.setString(message);
    Alert.alert('Copied', 'Credentials message copied successfully.');
  }

  async function handleSendCredentialsEmail() {
    if (
      !credentialsTeacher ||
      sendingCredentialsEmail ||
      !credentialsTeacher?.credentialsMessage?.trim()
    ) {
      return;
    }

    const personnelId = Number(credentialsTeacher.userId);

    if (!Number.isInteger(personnelId) || personnelId <= 0) {
      Alert.alert('Credentials Email', 'Valid personnel ID is required.');
      return;
    }

    try {
      setSendingCredentialsEmail(true);

      const response = await api(
        `/api/personnel/${encodeURIComponent(personnelId)}/credentials/email`,
        {
          method: 'POST',
          body: JSON.stringify({
            role: 'teacher',
          }),
        },
      );

      if (response?.ok !== true) {
        throw new Error(
          response?.message || 'Could not send credentials email.',
        );
      }

      Alert.alert(
        'Email Sent',
        `Credentials email sent successfully for ${credentialsTeacher.name}.`,
      );

      setCredentialsTeacher(null);
    } catch (error) {
      console.log('Credentials email error:', error);

      Alert.alert(
        'Email Failed',
        error?.data?.message ||
          error?.message ||
          'Could not send credentials email.',
      );
    } finally {
      setSendingCredentialsEmail(false);
    }
  }

  async function handleTeacherSecurity(teacher) {
    const userId = Number(teacher?.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      Alert.alert(
        'Teacher Credentials',
        'A valid teacher user ID is required.',
      );
      return;
    }

    // Open the modal immediately and show a loading indicator.
    setSecurityTeacher(teacher);
    setSecurityLoading(true);
    setShowSecurityPassword(false);

    setSecurityForm({
      userId,
      name: teacher.name || '',
      email: teacher.email || '',
      username: '',
      password: '',
      hasExistingCredentials: false,
    });

    try {
      const response = await api('/api/personnel/credentials/preview', {
        method: 'POST',
        body: JSON.stringify({
          role: 'teacher',
          user_ids: [userId],
        }),
      });

      const rows = Array.isArray(response?.rows) ? response.rows : [];

      const credential = rows.find(row => Number(row?.user_id) === userId);

      if (!credential) {
        throw new Error('No credential preview was returned for this teacher.');
      }

      setSecurityForm({
        userId,
        name: String(credential.name || teacher.name || ''),
        email: String(credential.email || teacher.email || ''),
        username: String(credential.username || ''),
        password: String(credential.password || ''),
        hasExistingCredentials: credential.has_existing_credentials === true,
      });
    } catch (error) {
      console.log('Teacher credential preview error:', error?.message);

      Alert.alert(
        'Credentials Preview Failed',
        error?.data?.message ||
          error?.message ||
          'Could not generate teacher credentials.',
      );

      setSecurityTeacher(null);
    } finally {
      setSecurityLoading(false);
    }
  }

  function closeSecurityModal() {
    if (securitySaving || securityLoading) {
      return;
    }

    setSecurityTeacher(null);
    setShowSecurityPassword(false);

    // Clear generated credentials from component state.
    setSecurityForm({
      userId: null,
      name: '',
      email: '',
      username: '',
      password: '',
      hasExistingCredentials: false,
    });
  }

  function handleSaveTeacherCredentials() {
    if (securitySaving || securityLoading) {
      return;
    }

    const userId = Number(securityForm.userId);
    const username = securityForm.username.trim();
    const password = securityForm.password;

    if (!Number.isInteger(userId) || userId <= 0) {
      Alert.alert('Invalid Teacher', 'A valid teacher user ID is required.');
      return;
    }

    if (!username) {
      Alert.alert('Validation', 'Please enter a username.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Validation', 'Please enter a password.');
      return;
    }

    if (securityForm.hasExistingCredentials) {
      Alert.alert(
        'Replace Existing Credentials',
        'This teacher already has credentials. Saving will replace the existing credentials. Continue?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Replace Credentials',
            onPress: saveTeacherCredentials,
          },
        ],
      );
      return;
    }

    saveTeacherCredentials();
  }

  async function saveTeacherCredentials() {
    if (securitySaving) {
      return;
    }

    const userId = Number(securityForm.userId);
    const username = securityForm.username.trim();
    const password = securityForm.password;

    if (
      !Number.isInteger(userId) ||
      userId <= 0 ||
      !username ||
      !password.trim()
    ) {
      return;
    }

    try {
      setSecuritySaving(true);

      const response = await api('/api/personnel/credentials', {
        method: 'POST',
        body: JSON.stringify({
          role: 'teacher',
          credentials: [
            {
              user_id: userId,
              username,
              password,
            },
          ],
        }),
      });

      const rows = Array.isArray(response?.rows) ? response.rows : [];

      const savedCredential = rows.find(row => Number(row?.user_id) === userId);

      if (
        !savedCredential ||
        String(savedCredential.username || '') !== username
      ) {
        throw new Error(
          'The server did not confirm the saved teacher credentials.',
        );
      }

      // Clear the password from the modal state.
      setSecurityForm({
        userId: null,
        name: '',
        email: '',
        username: '',
        password: '',
        hasExistingCredentials: false,
      });

      setSecurityTeacher(null);
      setShowSecurityPassword(false);

      Alert.alert(
        'Credentials Saved',
        `Login credentials saved successfully for ${securityForm.name}.`,
      );
    } catch (error) {
      console.log('Save teacher credentials error:', error?.message);

      Alert.alert(
        'Save Failed',
        error?.data?.message ||
          error?.message ||
          'Could not save teacher credentials.',
      );
    } finally {
      setSecuritySaving(false);
    }
  }

  function renderTeacher({ item }) {
    const deleting = deletingTeacherId === item.id;

    return (
      <View
        style={[
          styles.teacherCard,

          {
            flex: numColumns > 1 ? 1 : undefined,
          },
        ]}
      >
        <View style={styles.teacherDetails}>
          <View style={styles.teacherProfileRow}>
            <View style={styles.teacherAvatarSection}>
              {item.photoUrl ? (
                <Image
                  source={{
                    uri: item.photoUrl,
                  }}
                  style={styles.teacherPhoto}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.teacherInitials}>
                  {getInitials(item.name)}
                </Text>
              )}
            </View>

            <View style={styles.teacherIdentity}>
              <Text numberOfLines={2} style={styles.teacherName}>
                {item.name}
              </Text>

              <Text numberOfLines={2} style={styles.teacherEmail}>
                {item.email || '—'}
              </Text>

              {item.designation ? (
                <View style={styles.designationBadge}>
                  <Text style={styles.designationBadgeText}>
                    {item.designation}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.infoSection}>
            {item.department ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Department</Text>

                <Text style={styles.infoValue}>{item.department}</Text>
              </View>
            ) : null}

            {/* {item.designation ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Role</Text>

                <Text style={styles.infoValue}>{item.designation}</Text>
              </View>
            ) : null} */}

            {item.phone ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>

                <Text style={styles.infoValue}>{item.phone}</Text>
              </View>
            ) : null}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Classes</Text>

              {renderExpandableList({
                teacherId: item.id,
                field: 'classes',
                items: item.classGroups.map(classGroup => classGroup.label),
                emptyText: 'No classes assigned',
                limit: 4,
              })}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Courses</Text>

              {renderExpandableList({
                teacherId: item.id,
                field: 'courses',
                items: item.courses.map(course => course.title),
                emptyText: 'No courses assigned',
                limit: 4,
              })}
            </View>
          </View>

          {item.bio ? (
            <Text numberOfLines={3} style={styles.bioText}>
              {item.bio}
            </Text>
          ) : null}

          {canManage ? (
            <View style={styles.actionsRow}>
              {/* Edit Teacher */}
              <Pressable
                onPress={() => openEditTeacher(item)}
                style={({ pressed }) => [
                  styles.editButton,
                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>

              {/* Show Credentials Message */}
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

              {/* Security Action */}
              <Pressable
                onPress={() => handleTeacherSecurity(item)}
                style={({ pressed }) => [
                  styles.securityButton,
                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="shield-outline"
                  size={19}
                  color="#E2EAF5"
                />
              </Pressable>

              {/* Delete Teacher */}
              <Pressable
                onPress={() => deleteTeacher(item)}
                disabled={deleting}
                style={({ pressed }) => [
                  styles.deleteButton,
                  deleting && styles.controlDisabled,
                  pressed && !deleting && styles.controlPressed,
                ]}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete</Text>
                )}
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  if (loading && teachers.length === 0) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading teachers...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,

        {
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <View style={styles.topActionsCard}>
        <Pressable
          onPress={() => setIdentityCardsVisible(true)}
          style={({ pressed }) => [
            styles.identityCardsButton,
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons
            name="card-account-details-outline"
            size={18}
            color="#FFFFFF"
          />

          <Text style={styles.identityCardsButtonText}>Identity Cards</Text>
        </Pressable>

        <View style={styles.topRightActions}>
          <View style={styles.teacherCountBadge}>
            <Text style={styles.teacherCountText}>
              {teachers.length} teachers
            </Text>
          </View>

          <Pressable
            onPress={openAddTeacher}
            style={({ pressed }) => [
              styles.addTeacherButton,
              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons name="plus" size={17} color="#FFFFFF" />

            <Text style={styles.addTeacherButtonText}>Add Teacher</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.searchCard}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={submitSearch}
          placeholder="Search by name, email, department or designation..."
          placeholderTextColor="#8091AA"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={styles.searchInput}
        />

        <Pressable
          onPress={submitSearch}
          style={({ pressed }) => [
            styles.searchButton,

            pressed && styles.controlPressed,
          ]}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>

        <Pressable
          onPress={clearSearch}
          style={({ pressed }) => [
            styles.clearButton,

            pressed && styles.controlPressed,
          ]}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          key={`teachers-${numColumns}`}
          data={teachers}
          numColumns={numColumns}
          keyExtractor={item => String(item.id)}
          renderItem={renderTeacher}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          showsVerticalScrollIndicator
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() =>
                loadTeachers({
                  requestedPage: 1,
                  query: appliedSearch,
                  refresh: true,
                })
              }
              tintColor="#67D1F0"
            />
          }
          contentContainerStyle={
            teachers.length === 0 ? styles.emptyListContent : styles.listContent
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No teachers found</Text>

              <Text style={styles.emptyStateText}>Try another search.</Text>
            </View>
          }
          ListFooterComponent={
            page < totalPages ? (
              <Pressable
                onPress={loadNextPage}
                disabled={loadingMore}
                style={({ pressed }) => [
                  styles.loadMoreButton,

                  loadingMore && styles.controlDisabled,

                  pressed && !loadingMore && styles.controlPressed,
                ]}
              >
                {loadingMore ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.loadMoreButtonText}>Load More</Text>
                )}
              </Pressable>
            ) : null
          }
        />
      </View>

      <View style={styles.hiddenMetadata}>
        <Text>{me?.id || ''}</Text>

        <Text>{meta?.role || ''}</Text>
      </View>
      <TeacherIdentityCardsModal
        visible={identityCardsVisible}
        onClose={() => setIdentityCardsVisible(false)}
      />

      <Modal
        visible={Boolean(credentialsTeacher)}
        transparent
        animationType="fade"
        onRequestClose={closeCredentialsModal}
      >
        <View style={styles.credentialsModalOverlay}>
          <View style={styles.credentialsModalCard}>
            <View style={styles.credentialsModalHeader}>
              <Text style={styles.credentialsModalTitle}>
                Credentials Message — {credentialsTeacher?.name || ''}
              </Text>

              <Pressable
                onPress={closeCredentialsModal}
                disabled={sendingCredentialsEmail || credentialsMessageLoading}
                style={styles.credentialsCloseButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ScrollView
              style={styles.credentialsMessageContainer}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {credentialsMessageLoading ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ActivityIndicator size="large" color="#60A5FA" />

                  <Text
                    style={[styles.credentialsMessageText, { marginTop: 12 }]}
                  >
                    Loading credentials message...
                  </Text>
                </View>
              ) : (
                <Text selectable style={styles.credentialsMessageText}>
                  {credentialsTeacher?.credentialsMessage ||
                    'Generate and save credentials first, then use Show Credentials Message to copy or email them.'}
                </Text>
              )}
            </ScrollView>

            <View style={styles.credentialsModalFooter}>
              <Pressable
                onPress={handleCopyCredentials}
                disabled={
                  credentialsMessageLoading ||
                  !credentialsTeacher?.credentialsMessage?.trim()
                }
                style={[
                  styles.credentialsCopyButton,
                  (credentialsMessageLoading ||
                    !credentialsTeacher?.credentialsMessage?.trim()) &&
                    styles.controlDisabled,
                ]}
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={16}
                  color="#FFFFFF"
                />
                <Text style={styles.credentialsFooterButtonText}>Copy</Text>
              </Pressable>

              <Pressable
                onPress={handleSendCredentialsEmail}
                disabled={
                  credentialsMessageLoading ||
                  sendingCredentialsEmail ||
                  !credentialsTeacher?.credentialsMessage?.trim()
                }
                style={({ pressed }) => [
                  styles.credentialsSendButton,
                  (sendingCredentialsEmail ||
                    !credentialsTeacher?.credentialsMessage?.trim()) &&
                    styles.controlDisabled,
                  pressed && styles.controlPressed,
                ]}
              >
                {sendingCredentialsEmail ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.credentialsFooterButtonText}>
                    Send Email
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={Boolean(securityTeacher)}
        transparent
        animationType="fade"
        onRequestClose={closeSecurityModal}
      >
        <View style={styles.securityModalOverlay}>
          <View style={styles.securityModalCard}>
            {/* Modal Header */}
            <View style={styles.securityModalHeader}>
              <View style={styles.securityModalHeaderText}>
                <Text style={styles.securityModalTitle}>
                  Generate Teacher Credentials
                </Text>

                <Text style={styles.securityModalSubtitle}>
                  Review usernames and passwords before saving. Usernames are
                  unique across every account type.
                </Text>
              </View>

              <Pressable
                onPress={closeSecurityModal}
                disabled={securityLoading || securitySaving}
                style={({ pressed }) => [
                  styles.securityModalClose,
                  (securityLoading || securitySaving) && styles.controlDisabled,
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

            {securityLoading ? (
              <View style={styles.securityLoadingContainer}>
                <ActivityIndicator size="large" color="#60A5FA" />
                <Text style={styles.securityLoadingText}>
                  Generating credential preview...
                </Text>
              </View>
            ) : (
              <>
                {/* Table Header */}
                <View style={styles.securityTableHeader}>
                  <Text style={[styles.securityTableHeading, { flex: 1.2 }]}>
                    Teacher
                  </Text>

                  <Text style={[styles.securityTableHeading, { flex: 1 }]}>
                    Username
                  </Text>

                  <Text style={[styles.securityTableHeading, { flex: 1 }]}>
                    Password
                  </Text>
                </View>

                {/* Teacher Details */}
                <View style={styles.securityTableBody}>
                  <View style={styles.securityTeacherInfo}>
                    <Text style={styles.securityTeacherName} numberOfLines={2}>
                      {securityForm.name}
                    </Text>

                    <Text style={styles.securityTeacherEmail} numberOfLines={2}>
                      {securityForm.email}
                    </Text>

                    {securityForm.hasExistingCredentials ? (
                      <Text style={styles.securityExistingText}>
                        Replaces existing credentials
                      </Text>
                    ) : (
                      <Text style={styles.securityNewText}>
                        New credentials
                      </Text>
                    )}
                  </View>

                  {/* Username Input */}
                  <View style={styles.securityInputSection}>
                    <Text style={styles.securityInputLabel}>Username</Text>

                    <TextInput
                      value={securityForm.username}
                      onChangeText={value =>
                        setSecurityForm(current => ({
                          ...current,
                          username: value,
                        }))
                      }
                      editable={!securitySaving}
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder="Username"
                      placeholderTextColor="#718096"
                      style={styles.securityInput}
                    />
                  </View>

                  {/* Password Input */}
                  <View style={styles.securityInputSection}>
                    <Text style={styles.securityInputLabel}>Password</Text>

                    <View style={styles.securityPasswordBox}>
                      <TextInput
                        value={securityForm.password}
                        onChangeText={value =>
                          setSecurityForm(current => ({
                            ...current,
                            password: value,
                          }))
                        }
                        editable={!securitySaving}
                        secureTextEntry={!showSecurityPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Password"
                        placeholderTextColor="#718096"
                        style={styles.securityPasswordInput}
                      />

                      <Pressable
                        onPress={() =>
                          setShowSecurityPassword(current => !current)
                        }
                        style={styles.securityEyeButton}
                      >
                        <MaterialCommunityIcons
                          name={
                            showSecurityPassword
                              ? 'eye-off-outline'
                              : 'eye-outline'
                          }
                          size={18}
                          color="#AFC0D8"
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>

                {/* Footer */}
                <View style={styles.securityModalFooter}>
                  <Pressable
                    onPress={closeSecurityModal}
                    disabled={securitySaving}
                    style={[
                      styles.securityCancelButton,
                      securitySaving && styles.controlDisabled,
                    ]}
                  >
                    <Text style={styles.securityCancelText}>Close</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleSaveTeacherCredentials}
                    disabled={
                      securitySaving ||
                      !securityForm.username.trim() ||
                      !securityForm.password.trim()
                    }
                    style={[
                      styles.securitySaveButton,
                      (securitySaving ||
                        !securityForm.username.trim() ||
                        !securityForm.password.trim()) &&
                        styles.controlDisabled,
                    ]}
                  >
                    {securitySaving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.securitySaveText}>
                        Save Credentials
                      </Text>
                    )}
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
