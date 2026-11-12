// src/screens/Admin/Notifications/AdminNotifications.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../../api/client';
import styles from './AdminNotifications.styles';

const MESSAGE_LIMIT = 200;
const USER_LIMIT = 300;

const ROLE_OPTIONS = [
  { label: 'All roles', value: '' },
  { label: 'Super admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Teacher', value: 'teacher' },
  { label: 'Staff', value: 'staff' },
  { label: 'Parent', value: 'parent' },
  { label: 'Student', value: 'student' },
];

function getUserId(user) {
  return String(user?.id ?? '');
}

function getUserLabel(user) {
  const name = String(user?.name || 'Unnamed user').trim();
  const email = String(user?.email || '').trim();
  return email ? `${name} [${email}]` : name;
}

function getRoleLabel(user) {
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  return roles.length > 0 ? roles.join(', ') : 'Unknown';
}

function normalizeClasses(response) {
  const source = Array.isArray(response)
    ? response
    : Array.isArray(response?.classes)
    ? response.classes
    : Array.isArray(response?.data)
    ? response.data
    : [];

  return source
    .map((item, index) => ({
      value: String(
        item?.id ??
          item?.class_id ??
          item?.class_group_id ??
          item?.value ??
          index,
      ),
      label: String(
        item?.label ??
          item?.name ??
          item?.class_name ??
          item?.title ??
          `Class ${index + 1}`,
      ),
    }))
    .filter(item => item.value && item.label);
}

function userBelongsToClass(user, selectedClassId) {
  if (!selectedClassId) return true;

  const target = String(selectedClassId);

  const directValues = [
    user?.class_id,
    user?.class_group_id,
    user?.classroom_id,
  ]
    .filter(value => value !== null && value !== undefined)
    .map(String);

  if (directValues.includes(target)) return true;

  const arrayValues = [
    ...(Array.isArray(user?.class_ids) ? user.class_ids : []),
    ...(Array.isArray(user?.class_group_ids) ? user.class_group_ids : []),
    ...(Array.isArray(user?.classes)
      ? user.classes.map(item => item?.id ?? item?.class_id ?? item?.value)
      : []),
  ]
    .filter(value => value !== null && value !== undefined)
    .map(String);

  return arrayValues.includes(target);
}

function Checkbox({ checked, onPress, disabled = false, label }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked, disabled }}
      hitSlop={8}
      style={({ pressed }) => [
        styles.checkbox,
        checked && styles.checkboxChecked,
        disabled && styles.controlDisabled,
        pressed && !disabled && styles.controlPressed,
      ]}
    >
      {checked ? <Text style={styles.checkboxTick}>✓</Text> : null}
    </Pressable>
  );
}

function SelectField({ label, value, options, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const selectedOption =
    options.find(option => option.value === value) || options[0];

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [
          styles.selectField,
          disabled && styles.controlDisabled,
          pressed && !disabled && styles.controlPressed,
        ]}
      >
        <Text numberOfLines={1} style={styles.selectText}>
          {selectedOption?.label || label}
        </Text>
        <Text style={styles.selectArrow}>⌄</Text>
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
            <Text style={styles.modalTitle}>{label}</Text>

            <FlatList
              data={options}
              keyExtractor={item => item.value || 'all'}
              style={styles.modalList}
              renderItem={({ item }) => {
                const selected = item.value === value;

                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.value);
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
                      {item.label}
                    </Text>

                    {selected ? (
                      <Text style={styles.modalOptionCheck}>✓</Text>
                    ) : null}
                  </Pressable>
                );
              }}
            />

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

export default function AdminNotifications({ navigation }) {
  const insets = useSafeAreaInsets();
  const latestRequestId = useRef(0);

  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [appliedSearchText, setAppliedSearchText] = useState('');
  const [appliedClassId, setAppliedClassId] = useState('');
  const [users, setUsers] = useState([]);
  const [classOptions, setClassOptions] = useState([
    { label: 'All classes', value: '' },
  ]);
  const [selectedUserIds, setSelectedUserIds] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);

  const isTeacherRole = selectedRole === 'teacher';

  const visibleUsers = useMemo(() => {
    const query = appliedSearchText.trim().toLowerCase();

    return users.filter(user => {
      const matchesSearch =
        !query ||
        String(user?.name || '')
          .toLowerCase()
          .includes(query) ||
        String(user?.email || '')
          .toLowerCase()
          .includes(query);

      return matchesSearch && userBelongsToClass(user, appliedClassId);
    });
  }, [users, appliedSearchText, appliedClassId]);

  const visibleUserIds = useMemo(
    () => visibleUsers.map(getUserId).filter(Boolean),
    [visibleUsers],
  );

  const allVisibleSelected =
    visibleUserIds.length > 0 &&
    visibleUserIds.every(userId => selectedUserIds.has(userId));

  const canSend =
    message.trim().length > 0 && selectedUserIds.size > 0 && !sending;

  const loadCurrentUser = useCallback(async () => {
    const response = await api('/api/me');

    const isAllowed =
      response?.is_admin === true ||
      response?.is_super_admin === true ||
      ['admin', 'super_admin'].includes(
        String(response?.actual_role || response?.role || '').toLowerCase(),
      );

    if (!isAllowed) {
      Alert.alert('Access denied', 'Only administrators can open this page.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      return null;
    }

    setCurrentUser(response);
    return response;
  }, [navigation]);

  const loadClasses = useCallback(async () => {
    try {
      setClassesLoading(true);
      const response = await api('/api/notifications/admin/classes');
      const normalized = normalizeClasses(response);

      setClassOptions([{ label: 'All classes', value: '' }, ...normalized]);
    } catch (error) {
      console.log('Notification classes API error:', error);
      setClassOptions([{ label: 'All classes', value: '' }]);
      Alert.alert('Classes', error?.message || 'Could not load classes.');
    } finally {
      setClassesLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async roleValue => {
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;

    try {
      setUsersLoading(true);

      const roleQuery = roleValue
        ? `role=${encodeURIComponent(roleValue)}&`
        : '';

      const response = await api(
        `/api/notifications/admin/users?${roleQuery}limit=${USER_LIMIT}`,
      );

      if (requestId !== latestRequestId.current) return;

      setUsers(Array.isArray(response?.users) ? response.users : []);
    } catch (error) {
      if (requestId !== latestRequestId.current) return;

      console.log('Notification users API error:', error);
      setUsers([]);
      Alert.alert(
        'Notification users',
        error?.message || 'Could not load notification users.',
      );
    } finally {
      if (requestId === latestRequestId.current) {
        setUsersLoading(false);
      }
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const me = await loadCurrentUser();
      if (!me) return;
      await loadUsers('');
    } catch (error) {
      console.log('Admin notifications initialization error:', error);
      Alert.alert(
        'Admin notifications',
        error?.message || 'Could not open admin notifications.',
      );
    } finally {
      setLoading(false);
    }
  }, [loadCurrentUser, loadUsers]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  async function handleRoleChange(nextRole) {
    setSelectedRole(nextRole);
    setSelectedClassId('');
    setAppliedClassId('');

    if (nextRole === 'teacher' && classOptions.length <= 1) {
      await loadClasses();
    }
  }

  async function applyFilters() {
    setAppliedSearchText(searchText.trim());
    setAppliedClassId(selectedRole === 'teacher' ? selectedClassId : '');
    await loadUsers(selectedRole);
  }

  async function clearFilters() {
    setSelectedRole('');
    setSelectedClassId('');
    setSearchText('');
    setAppliedSearchText('');
    setAppliedClassId('');
    await loadUsers('');
  }

  async function onRefresh() {
    try {
      setRefreshing(true);

      const requests = [loadCurrentUser(), loadUsers(selectedRole)];

      if (selectedRole === 'teacher') {
        requests.push(loadClasses());
      }

      await Promise.all(requests);
    } finally {
      setRefreshing(false);
    }
  }

  function toggleUser(user) {
    const userId = getUserId(user);
    if (!userId) return;

    setSelectedUserIds(current => {
      const next = new Set(current);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }

  function toggleAllVisibleUsers() {
    setSelectedUserIds(current => {
      const next = new Set(current);

      if (allVisibleSelected) {
        visibleUserIds.forEach(userId => next.delete(userId));
      } else {
        visibleUserIds.forEach(userId => next.add(userId));
      }

      return next;
    });
  }

  async function sendNotification() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      Alert.alert('Message required', 'Please enter a notification message.');
      return;
    }

    if (selectedUserIds.size === 0) {
      Alert.alert(
        'Recipients required',
        'Please select at least one recipient.',
      );
      return;
    }

    const recipientIds = Array.from(selectedUserIds)
      .map(userId => Number(userId))
      .filter(userId => Number.isFinite(userId));

    if (recipientIds.length === 0) {
      Alert.alert('Invalid recipients', 'No valid recipients were selected.');
      return;
    }

    try {
      setSending(true);

      const payload = {
        message: trimmedMessage,
        recipient_ids: recipientIds,
      };

      console.log('Send notification payload:', payload);

      const response = await api('/api/notifications/admin/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response?.ok !== true) {
        throw new Error('Could not send the notification.');
      }

      const sentCount = Number(response?.count || recipientIds.length);

      // Clear the form after successful sending.
      setMessage('');
      setSelectedUserIds(new Set());

      Alert.alert(
        'Notification sent',
        `Notification sent successfully to ${sentCount} ${
          sentCount === 1 ? 'recipient' : 'recipients'
        }.`,
      );
    } catch (error) {
      console.log('Send notification error:', error);

      Alert.alert(
        'Send failed',
        error?.message || 'Could not send the notification.',
      );
    } finally {
      setSending(false);
    }
  }

  function renderUser({ item }) {
    const userId = getUserId(item);
    const selected = selectedUserIds.has(userId);

    return (
      <Pressable
        onPress={() => toggleUser(item)}
        style={({ pressed }) => [
          styles.userRow,
          selected && styles.userRowSelected,
          pressed && styles.controlPressed,
        ]}
      >
        <Checkbox
          checked={selected}
          onPress={() => toggleUser(item)}
          label={`Select ${getUserLabel(item)}`}
        />

        <Text numberOfLines={2} style={styles.userName}>
          {getUserLabel(item)}
        </Text>

        <Text numberOfLines={2} style={styles.userRole}>
          {getRoleLabel(item)}
        </Text>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading admin notifications...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleContent}>
              <Text style={styles.title}>Send Notification</Text>
              <Text style={styles.subtitle}>
                Select recipients, write a message, and send an admin
                notification.
              </Text>
            </View>

            {currentUser ? (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>
                  {currentUser?.is_super_admin ? 'SUPER ADMIN' : 'ADMIN'}
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.fieldLabel}>
            Message (max {MESSAGE_LIMIT} chars)
          </Text>

          <TextInput
            value={message}
            onChangeText={setMessage}
            maxLength={MESSAGE_LIMIT}
            multiline
            textAlignVertical="top"
            placeholder="Write the notification message..."
            placeholderTextColor="#64748B"
            style={styles.messageInput}
          />

          <Text style={styles.characterCount}>
            {message.length}/{MESSAGE_LIMIT}
          </Text>

          <View style={styles.filterCard}>
            <View style={styles.roleClassRow}>
              <View style={styles.flexField}>
                <SelectField
                  label="Select role"
                  value={selectedRole}
                  options={ROLE_OPTIONS}
                  onChange={handleRoleChange}
                  disabled={usersLoading}
                />
              </View>

              {isTeacherRole ? (
                <View style={styles.flexField}>
                  <SelectField
                    label={
                      classesLoading ? 'Loading classes...' : 'Select class'
                    }
                    value={selectedClassId}
                    options={classOptions}
                    onChange={setSelectedClassId}
                    disabled={classesLoading || usersLoading}
                  />
                </View>
              ) : null}
            </View>

            <View style={styles.searchRow}>
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search by name or email..."
                placeholderTextColor="#64748B"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                onSubmitEditing={applyFilters}
                style={styles.searchInput}
              />

              <Pressable
                onPress={applyFilters}
                disabled={usersLoading}
                style={({ pressed }) => [
                  styles.searchButton,
                  usersLoading && styles.controlDisabled,
                  pressed && !usersLoading && styles.controlPressed,
                ]}
              >
                {usersLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.searchButtonText}>Search</Text>
                )}
              </Pressable>

              <Pressable
                onPress={clearFilters}
                disabled={usersLoading}
                style={({ pressed }) => [
                  styles.clearButton,
                  usersLoading && styles.controlDisabled,
                  pressed && !usersLoading && styles.controlPressed,
                ]}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.showingText}>
            Showing {visibleUsers.length} users
          </Text>
        </View>

        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Checkbox
              checked={allVisibleSelected}
              onPress={toggleAllVisibleUsers}
              disabled={visibleUsers.length === 0}
              label="Select all visible users"
            />

            <Text style={styles.tableHeaderUser}>User</Text>
            <Text style={styles.tableHeaderRole}>Role</Text>
          </View>

          <FlatList
            data={visibleUsers}
            keyExtractor={item => getUserId(item)}
            renderItem={renderUser}
            style={styles.userList}
            contentContainerStyle={
              visibleUsers.length === 0
                ? styles.emptyListContent
                : styles.userListContent
            }
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FFFFFF"
                colors={['#FFFFFF']}
              />
            }
            ListEmptyComponent={
              usersLoading ? (
                <View style={styles.emptyState}>
                  <ActivityIndicator size="large" />
                  <Text style={styles.emptyStateText}>Loading users...</Text>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateTitle}>No users found</Text>
                  <Text style={styles.emptyStateText}>
                    Change the role or search criteria and try again.
                  </Text>
                </View>
              )
            }
          />
        </View>
      </View>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}
      >
        <Text style={styles.selectedCount}>
          Recipients selected: {selectedUserIds.size}
        </Text>

        <Pressable
          onPress={sendNotification}
          disabled={!canSend}
          style={({ pressed }) => [
            styles.sendButton,
            !canSend && styles.sendButtonDisabled,
            pressed && canSend && styles.controlPressed,
          ]}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.sendButtonText}>Send Notification</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
