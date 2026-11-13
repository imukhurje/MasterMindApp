// src/screens/Admin/Classworks/AdminClassworks.js

import React, {
  memo,
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
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { api } from '../../../api/client';
import styles from './AdminClassworks.styles';

function getRole(me) {
  return String(me?.primary_role || me?.role || '').toLowerCase();
}

function formatCreatedAt(value) {
  if (!value) {
    return '';
  }

  const raw = String(value).trim();

  /*
   * API:
   * 2026-09-02 10:01:04
   */
  const [datePart, timePart] = raw.split(' ');

  if (!datePart) {
    return raw;
  }

  const dateParts = datePart.split('-');

  if (dateParts.length !== 3) {
    return raw;
  }

  const [year, month, day] = dateParts;

  return `${day}/${month}/${year}${timePart ? `, ${timePart}` : ''}`;
}

function getClassLabel(item) {
  const className = String(item?.class_name || '').trim();

  const section = String(item?.section || '').trim();

  if (className && section) {
    return `${className} — ${section}`;
  }

  return className || section || 'Class not available';
}

function getSubjectNames(item) {
  if (!Array.isArray(item?.courses)) {
    return '';
  }

  return item.courses
    .map(course => String(course?.title || course?.label || '').trim())
    .filter(Boolean)
    .join(', ');
}

const ClassworkCard = memo(({ item, deleting, onEdit, onDelete }) => {
  const canManage = item?.can_manage === true;
  const showActions = true;
  return (
    <Pressable style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item?.title || 'Classwork'}
          </Text>

          <Text style={styles.classDate} numberOfLines={2}>
            {getClassLabel(item)}
            {' · '}
            {formatCreatedAt(item?.created_at)}
          </Text>
          {!!getSubjectNames(item) && (
            <Text style={styles.subjectText} numberOfLines={2}>
              {getSubjectNames(item)}
            </Text>
          )}
        </View>
      </View>

      <Text
        style={[styles.cardBody, !item?.body && styles.emptyBody]}
        numberOfLines={4}
      >
        {item?.body || 'No note added.'}
      </Text>

      {showActions ? (
        <View style={styles.cardActions}>
          <Pressable
            disabled={!canManage}
            onPress={() => {
              if (canManage) {
                onEdit(item);
              }
            }}
            style={({ pressed }) => [
              styles.editButton,
              !canManage && styles.disabledActionButton,
              pressed && canManage && styles.controlPressed,
            ]}
          >
            <Text
              style={[
                styles.editButtonText,
                !canManage && styles.disabledActionText,
              ]}
            >
              Edit
            </Text>
          </Pressable>

          <Pressable
            disabled={!canManage || deleting}
            onPress={() => {
              if (canManage && !deleting) {
                onDelete(item);
              }
            }}
            style={({ pressed }) => [
              styles.deleteButton,
              !canManage && styles.disabledDeleteButton,
              deleting && styles.buttonDisabled,
              pressed && canManage && !deleting && styles.controlPressed,
            ]}
          >
            <Text
              style={[
                styles.deleteButtonText,
                !canManage && styles.disabledActionText,
              ]}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </Pressable>
  );
});

export default function AdminClassworks() {
  const navigation = useNavigation();

  const mounted = useRef(true);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [me, setMe] = useState(null);

  const [onboarding, setOnboarding] = useState(null);

  const [items, setItems] = useState([]);

  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async ({ refresh = false } = {}) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      /*
       * Step 1:
       * Load the current user first so we know the role.
       */
      const meResponse = await api('/api/me');

      if (!mounted.current) {
        return;
      }

      const currentRole = getRole(meResponse);

      setMe(meResponse || null);

      /*
       * Step 2:
       * Classworks are required for both Admin and Teacher.
       */
      const classworkResponse = await api('/api/classworks');

      if (!mounted.current) {
        return;
      }

      setItems(
        Array.isArray(classworkResponse?.items) ? classworkResponse.items : [],
      );

      /*
       * Step 3:
       * Onboarding data is only required for Admin/Super Admin.
       * Teacher does not need it because Teacher cannot edit/delete.
       */
      if (currentRole === 'admin' || currentRole === 'super_admin') {
        try {
          const onboardingResponse = await api('/api/settings/v1/onboarding');

          if (mounted.current) {
            setOnboarding(onboardingResponse || null);
          }
        } catch (onboardingError) {
          console.log('Classworks onboarding load error:', onboardingError);

          /*
           * Do not block the Classworks list if onboarding fails.
           */
          if (mounted.current) {
            setOnboarding(null);
          }
        }
      } else {
        setOnboarding(null);
      }
    } catch (error) {
      console.log('Classworks load error:', error);

      if (mounted.current) {
        Alert.alert(
          'Classworks',
          error?.message || 'Could not load classworks.',
        );
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();

      return undefined;
    }, [load]),
  );

  const role = getRole(me);

  const canCreate = ['admin', 'super_admin', 'teacher'].includes(role);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    const sorted = [...items].sort((a, b) => {
      const aDate = new Date(
        String(a?.created_at || '').replace(' ', 'T'),
      ).getTime();

      const bDate = new Date(
        String(b?.created_at || '').replace(' ', 'T'),
      ).getTime();

      return (bDate || 0) - (aDate || 0);
    });

    if (!query) {
      return sorted;
    }

    return sorted.filter(item => {
      const searchable = [
        item?.title,
        item?.body,
        item?.class_name,
        item?.section,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [items, search]);

  const handleAddClasswork = useCallback(() => {
    if (!canCreate) {
      return;
    }

    navigation.navigate('AdminClassworkCreate');
  }, [canCreate, navigation]);

  const handleEdit = useCallback(
    item => {
      if (item?.can_manage !== true || !item?.id) {
        Alert.alert(
          'Access Denied',
          'You do not have permission to edit this classwork.',
        );
        return;
      }

      navigation.navigate('AdminClassworkEdit', {
        id: item.id,
        classwork: item,
        onboarding,
      });
    },
    [navigation, onboarding],
  );

  const handleDelete = useCallback(
    item => {
      if (item?.can_manage !== true) {
        Alert.alert(
          'Access Denied',
          'You do not have permission to delete this classwork.',
        );
        return;
      }

      if (!item?.id || deletingId) {
        return;
      }

      const classworkTitle = String(item?.title || 'this classwork').trim();

      Alert.alert(
        'Delete Classwork',
        `Delete “${classworkTitle}” and all attachments and messages?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                setDeletingId(item.id);

                const response = await api(
                  `/api/classworks/${encodeURIComponent(item.id)}`,
                  {
                    method: 'DELETE',
                  },
                );

                if (response?.ok !== true) {
                  throw new Error('Could not delete the classwork.');
                }

                // Reload the classwork list after deletion.
                await load({
                  refresh: true,
                });
              } catch (error) {
                console.log('Classwork delete error:', error);

                Alert.alert(
                  'Delete failed',
                  error?.message || 'Could not delete the classwork.',
                );
              } finally {
                setDeletingId(null);
              }
            },
          },
        ],
        {
          cancelable: true,
        },
      );
    },
    [deletingId, load],
  );

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading classworks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <View style={styles.topActionRow}>
          <Text style={styles.countText}>
            {filteredItems.length}{' '}
            {filteredItems.length === 1 ? 'classwork' : 'classworks'}
          </Text>

          {canCreate ? (
            <Pressable
              onPress={handleAddClasswork}
              style={({ pressed }) => [
                styles.addClassworkButton,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.addClassworkButtonText}>+ Add Classwork</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search classworks..."
              placeholderTextColor="#7F91AA"
              style={styles.searchInput}
            />
          </View>
        </View>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={item => String(item?.id)}
        renderItem={({ item }) => (
          <ClassworkCard
            item={item}
            deleting={Number(deletingId) === Number(item.id)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              load({
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No classworks found</Text>

            <Text style={styles.emptyText}>
              Try another search or pull down to refresh.
            </Text>
          </View>
        }
      />
    </View>
  );
}
