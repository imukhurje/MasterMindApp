import React, { useCallback, useMemo, useState } from 'react';

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

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';
import styles from './AdminForumAccess.styles';

const FILTER_OPTIONS = [
  {
    value: 'all',
    label: 'Parents and students',
  },
  {
    value: 'parent',
    label: 'Parents',
  },
  {
    value: 'student',
    label: 'Students',
  },
];

function normalizeUser(item) {
  return {
    subjectType: String(item?.subject_type || '').toLowerCase(),

    subjectId: Number(item?.subject_id),

    role: String(item?.role || '').toLowerCase(),

    name: String(item?.name || 'Unnamed user'),

    email: String(item?.email || ''),

    blocked: Boolean(item?.blocked),
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

function FilterModal({ visible, selectedValue, onSelect, onClose }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />

        <View style={styles.filterModal}>
          <Text style={styles.modalTitle}>Show</Text>

          {FILTER_OPTIONS.map(option => {
            const selected = option.value === selectedValue;

            return (
              <Pressable
                key={option.value}
                onPress={() => {
                  onSelect(option.value);

                  onClose();
                }}
                style={({ pressed }) => [
                  styles.filterOption,

                  selected && styles.filterOptionSelected,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterOptionText,

                    selected && styles.filterOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>

                {selected ? <Text style={styles.filterCheck}>✓</Text> : null}
              </Pressable>
            );
          })}

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.modalCloseButton,

              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function AdminForumAccess({ navigation }) {
  const insets = useSafeAreaInsets();

  const [users, setUsers] = useState([]);

  const [searchText, setSearchText] = useState('');

  const [selectedFilter, setSelectedFilter] = useState('all');

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [updatingUserKey, setUpdatingUserKey] = useState(null);

  const loadUsers = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await api('/api/forums/moderation/users');

        const rows = Array.isArray(response?.items) ? response.items : [];

        const normalized = rows
          .map(normalizeUser)
          .filter(item => Number.isFinite(item.subjectId));

        setUsers(normalized);

        navigation.setOptions({
          title: 'Forum Access',
        });
      } catch (error) {
        console.log('Forum moderation users error:', error);

        Alert.alert(
          'Forum Access',
          error?.message || 'Could not load forum users.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigation],
  );

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers]),
  );

  const selectedFilterLabel = useMemo(
    () =>
      FILTER_OPTIONS.find(item => item.value === selectedFilter)?.label ||
      'Parents and students',
    [selectedFilter],
  );

  const filteredUsers = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return users.filter(user => {
      const matchesRole =
        selectedFilter === 'all' || user.role === selectedFilter;

      if (!matchesRole) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [user.name, user.email, user.role]
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [searchText, selectedFilter, users]);

  function toggleForumAccess(user) {
    const subjectType = String(user?.subjectType || '').trim();

    const subjectId = Number(user?.subjectId);

    if (!subjectType || !Number.isFinite(subjectId)) {
      Alert.alert('Forum Access', 'User information is missing.');

      return;
    }

    const nextBlocked = !user.blocked;

    Alert.alert(
      nextBlocked ? 'Block User' : 'Unblock User',

      nextBlocked
        ? `Block ${user.name} from Forums?`
        : `Unblock ${user.name} from Forums?`,

      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: nextBlocked ? 'Block' : 'Unblock',

          style: nextBlocked ? 'destructive' : 'default',

          onPress: () => updateForumAccess(user, nextBlocked),
        },
      ],
    );
  }

  async function updateForumAccess(user, blocked) {
    const subjectType = String(user?.subjectType || '').trim();

    const subjectId = Number(user?.subjectId);

    if (!subjectType || !Number.isFinite(subjectId)) {
      return;
    }

    const userKey = `${subjectType}-${subjectId}`;

    try {
      setUpdatingUserKey(userKey);

      const payload = {
        blocked,
      };

      console.log('Forum access payload:', payload);

      const response = await api(
        `/api/forums/moderation/users/${encodeURIComponent(
          subjectType,
        )}/${encodeURIComponent(subjectId)}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        },
      );

      console.log('Forum access response:', response);

      if (response?.ok !== true) {
        throw new Error(
          blocked
            ? 'Could not block this user.'
            : 'Could not unblock this user.',
        );
      }

      setUsers(current =>
        current.map(item => {
          const sameUser =
            item.subjectType === subjectType && item.subjectId === subjectId;

          if (!sameUser) {
            return item;
          }

          return {
            ...item,
            blocked: Boolean(response?.blocked),
          };
        }),
      );
    } catch (error) {
      console.log('Forum access update error:', error);

      Alert.alert(
        'Forum Access',
        error?.message || 'Could not update forum access.',
      );
    } finally {
      setUpdatingUserKey(null);
    }
  }

  function renderUser({ item }) {
    const userKey = `${item.subjectType}-${item.subjectId}`;

    const updating = updatingUserKey === userKey;
    return (
      <View style={styles.userRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
        </View>

        <View style={styles.userContent}>
          <Text numberOfLines={1} style={styles.userName}>
            {item.name}
          </Text>

          <Text numberOfLines={1} style={styles.userEmail}>
            {item.email || 'No email address'}
          </Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {item.role === 'parent' ? 'Parent' : 'Student'}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => toggleForumAccess(item)}
          disabled={updating}
          style={({ pressed }) => [
            styles.accessButton,

            item.blocked && styles.unblockButton,

            updating && styles.controlDisabled,

            pressed && !updating && styles.controlPressed,
          ]}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.accessButtonText}>
              {item.blocked ? 'Unblock' : 'Block'}
            </Text>
          )}
        </Pressable>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading forum users...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 0),
        },
      ]}
    >
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>Forum access</Text>

        <Text style={styles.pageSubtitle}>
          Block or unblock parents and students from Forums.
        </Text>
      </View>

      <View style={styles.filtersRow}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search parents and students..."
          placeholderTextColor="#8091AA"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          style={styles.searchInput}
        />

        <Pressable
          onPress={() => setFilterModalVisible(true)}
          style={({ pressed }) => [
            styles.filterButton,

            pressed && styles.controlPressed,
          ]}
        >
          <Text numberOfLines={1} style={styles.filterButtonText}>
            {selectedFilterLabel}
          </Text>

          <Text style={styles.filterArrow}>⌄</Text>
        </Pressable>
      </View>

      <View style={styles.resultSummary}>
        <Text style={styles.resultSummaryText}>
          {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
        </Text>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={item => `${item.subjectType}-${item.subjectId}`}
        renderItem={renderUser}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadUsers({
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
        contentContainerStyle={
          filteredUsers.length === 0
            ? styles.emptyListContent
            : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No users found</Text>

            <Text style={styles.emptyStateText}>
              Try changing the search or filter.
            </Text>
          </View>
        }
      />

      <FilterModal
        visible={filterModalVisible}
        selectedValue={selectedFilter}
        onSelect={setSelectedFilter}
        onClose={() => setFilterModalVisible(false)}
      />
    </View>
  );
}
