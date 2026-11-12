// src/screens/Admin/DashboardPreferences/AdminDashboardPreferences.js

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, getBase } from '../../../api/client';

const BG = '#0F172A';
const CARD = '#142B49';
const CARD_ACTIVE = '#1D4A73';
const BORDER = '#3B7197';
const TEXT = '#FFFFFF';
const MUTED = '#AFC0D8';
const PRIMARY = '#2563EB';
const CHECKED = '#7DD3FC';

function getCardKey(item, index = 0) {
  return String(item?.key || item?.id || item?.link || index);
}

function Checkbox({ checked, onPress, disabled = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      hitSlop={8}
      style={({ pressed }) => ({
        width: 24,
        height: 24,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: checked ? CHECKED : BORDER,
        backgroundColor: checked ? CHECKED : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
      })}
    >
      {checked ? (
        <Text
          style={{
            color: '#082F49',
            fontSize: 16,
            fontWeight: '900',
            lineHeight: 18,
          }}
        >
          ✓
        </Text>
      ) : null}
    </Pressable>
  );
}

const ADMIN_ALLOWED_LINKS = new Set([
  '/forum',
  '/attendance',
  '/question_bank',
  '/plugins/online-courses/catalog',
  '/plugins/online-courses/editor',
  '/notifications/admin',
  '/examinations',
  '/exams?mode=homework',
  '/classworks',
  '/qweb/classrooms',
  '/results',
  '/routines',
  '/teachers',
  '/students',
  '/plugins/online-courses/students',
  '/plugins/online-courses/purchases',
  '/parents',
  '/classes',
  '/courses',
  '/billing',
  '/admins',
  '/settings',
  '/my-profile',
  '/plugins/online-courses/catalog',
  '/notifications',
  '/exams',
  '/plugins/financial-accounting/payroll/payslips',
  '/plugins/financial-accounting/staff-attendance/my',
  '/plugins/financial-accounting/leave-register/my',
  '/my-profile',
  '/admissions/admin',
  '/staffs',
  '/role-assignments',
  '/management-dashboard',
  '/plugins/financial-accounting/accounts',
  '/plugins/financial-accounting/payroll',
]);

function normalizeDashboardLink(link) {
  const value = String(link || '').trim();

  if (!value) {
    return '';
  }

  const baseUrl = String(getBase() || '').replace(/\/+$/, '');

  if (baseUrl && value === baseUrl) {
    return '/';
  }

  if (baseUrl && value.startsWith(`${baseUrl}/`)) {
    return value.slice(baseUrl.length);
  }

  return value;
}

function isAllowedAdminCard(card) {
  const normalizedLink = normalizeDashboardLink(card?.link).toLowerCase();

  return ADMIN_ALLOWED_LINKS.has(normalizedLink);
}

export default function AdminDashboardPreferences({ navigation }) {
  const insets = useSafeAreaInsets();
  const [allCards, setAllCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [role, setRole] = useState('');
  const [customized, setCustomized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const selectedCount = useMemo(
    () => cards.filter(card => card?.selected !== false).length,
    [cards],
  );

  const allSelected = cards.length > 0 && selectedCount === cards.length;

  const loadPreferences = useCallback(async ({ refresh = false } = {}) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api('/api/dashboard-preferences');
      const responseCards = Array.isArray(response?.cards)
        ? response.cards
        : [];

      const normalizedCards = responseCards.map(card => ({
        ...card,
        selected: card?.selected !== false,
      }));

      const allowedCards = normalizedCards.filter(isAllowedAdminCard);

      setAllCards(normalizedCards);
      setCards(allowedCards);
      setRole(String(response?.role || ''));
      setCustomized(Boolean(response?.customized));
      setDirty(false);
    } catch (error) {
      console.log('Dashboard preferences API error:', error);

      Alert.alert(
        'Dashboard preferences',
        error?.message || 'Could not load dashboard preferences.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  function toggleAll() {
    const nextSelectedValue = !allSelected;

    setCards(currentCards =>
      currentCards.map(card => ({
        ...card,
        selected: nextSelectedValue,
      })),
    );

    setDirty(true);
  }

  function toggleCard(targetCard) {
    const targetKey = getCardKey(targetCard);

    setCards(currentCards =>
      currentCards.map((card, index) =>
        getCardKey(card, index) === targetKey
          ? {
              ...card,
              selected: card?.selected === false,
            }
          : card,
      ),
    );

    setDirty(true);
  }

  function handleDragEnd(reorderedCards) {
    const cardsWithUpdatedOrder = reorderedCards.map((card, index) => ({
      ...card,
      order: (index + 1) * 30,
    }));

    setCards(cardsWithUpdatedOrder);
    setDirty(true);
  }

  function closeScreen() {
    if (!dirty) {
      navigation.goBack();
      return;
    }

    Alert.alert(
      'Discard changes?',
      'Your unsaved dashboard changes will be lost.',
      [
        {
          text: 'Keep editing',
          style: 'cancel',
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  }

  async function savePreferences() {
    if (saving || !dirty) {
      return;
    }

    try {
      setSaving(true);
      let visibleCardIndex = 0;

      const mergedCards = allCards.map(originalCard => {
        if (!isAllowedAdminCard(originalCard)) {
          return originalCard;
        }

        const editedCard = cards[visibleCardIndex];

        visibleCardIndex += 1;

        return editedCard || originalCard;
      });

      const orderedCardKeys = mergedCards.map((card, index) =>
        getCardKey(card, index),
      );

      const hiddenCardKeys = mergedCards
        .filter(card => card?.selected === false)
        .map((card, index) => getCardKey(card, index));

      const payload = {
        ordered_card_keys: orderedCardKeys,
        hidden_card_keys: hiddenCardKeys,
      };

      console.log('Dashboard preferences payload:', payload);

      const response = await api('/api/dashboard-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response?.ok !== true) {
        throw new Error('Could not save dashboard preferences.');
      }

      const hiddenKeySet = new Set(hiddenCardKeys);

      const responseCards = Array.isArray(response?.cards)
        ? response.cards
        : mergedCards;

      const updatedAllCards = responseCards.map((card, index) => ({
        ...card,
        link: normalizeDashboardLink(card?.link),
        selected: !hiddenKeySet.has(getCardKey(card, index)),
      }));

      setAllCards(updatedAllCards);
      setCards(updatedAllCards.filter(isAllowedAdminCard));

      setCustomized(true);
      setDirty(false);

      Alert.alert(
        'Preferences saved',
        'Dashboard preferences were saved successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.log('Save dashboard preferences error:', error);

      Alert.alert(
        'Save failed',
        error?.message || 'Could not save dashboard preferences.',
      );
    } finally {
      setSaving(false);
    }
  }

  function renderCard({ item, index, drag, isActive }) {
    const selected = item?.selected !== false;

    return (
      <ScaleDecorator>
        <View
          style={{
            marginBottom: 10,
            borderRadius: 14,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: isActive ? CHECKED : BORDER,
            backgroundColor: isActive ? CARD_ACTIVE : CARD,
            opacity: selected ? 1 : 0.58,
            elevation: isActive ? 7 : 0,
            shadowColor: '#38BDF8',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isActive ? 0.28 : 0,
            shadowRadius: 8,
          }}
        >
          <View
            style={{
              minHeight: 82,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingTop: 12,
              paddingBottom: Math.max(insets.bottom, 12),
            }}
          >
            <Checkbox
              checked={selected}
              onPress={() => toggleCard(item)}
              disabled={isActive}
            />

            <Text
              style={{
                fontSize: 27,
                marginHorizontal: 12,
              }}
            >
              {item?.emoji || '📦'}
            </Text>

            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text
                numberOfLines={2}
                style={{
                  color: TEXT,
                  fontSize: 14,
                  fontWeight: '800',
                  lineHeight: 19,
                }}
              >
                {item?.name || 'Unknown item'}
              </Text>

              {/* <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                style={{
                  color: MUTED,
                  fontSize: 10,
                  marginTop: 5,
                }}
              >
                {item?.link || ''}
              </Text> */}
            </View>

            <Pressable
              onLongPress={drag}
              delayLongPress={150}
              disabled={isActive}
              accessibilityRole="button"
              accessibilityLabel={`Reorder ${item?.name || 'dashboard item'}`}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: 12,
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: CHECKED,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(8, 47, 73, 0.35)',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                style={{
                  color: TEXT,
                  fontSize: 20,
                  fontWeight: '900',
                  letterSpacing: -1,
                }}
              >
                ⋮
              </Text>
            </Pressable>
          </View>
        </View>
      </ScaleDecorator>
    );
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: BG,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ color: MUTED, marginTop: 12 }}>
          Loading dashboard preferences...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: BORDER,
        }}
      >
        <Text
          style={{
            color: TEXT,
            fontSize: 20,
            fontWeight: '900',
          }}
        >
          Customize Dashboard
        </Text>

        <Text
          style={{
            color: MUTED,
            fontSize: 13,
            lineHeight: 19,
            marginTop: 6,
          }}
        >
          Long-press the drag handle to reorder cards and uncheck anything you
          want hidden.
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 14,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Checkbox checked={allSelected} onPress={toggleAll} />

            <Pressable
              onPress={toggleAll}
              hitSlop={8}
              style={({ pressed }) => ({
                marginLeft: 9,
                opacity: pressed ? 0.75 : 1,
              })}
            >
              <Text
                style={{
                  color: TEXT,
                  fontSize: 14,
                  fontWeight: '800',
                }}
              >
                Check / Uncheck All
              </Text>
            </Pressable>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text
              style={{
                color: MUTED,
                fontSize: 11,
                fontWeight: '700',
              }}
            >
              {selectedCount} of {cards.length} visible
            </Text>

            {role ? (
              <Text
                style={{
                  color: MUTED,
                  fontSize: 10,
                  marginTop: 2,
                  textTransform: 'uppercase',
                }}
              >
                {role} · {customized ? 'Customized' : 'Default'}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <DraggableFlatList
          data={cards}
          keyExtractor={(item, index) => getCardKey(item, index)}
          renderItem={renderCard}
          onDragEnd={({ data }) => handleDragEnd(data)}
          activationDistance={12}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 14,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadPreferences({ refresh: true })}
              tintColor={TEXT}
              colors={[TEXT]}
            />
          }
          ListEmptyComponent={
            <View
              style={{
                paddingVertical: 60,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: MUTED }}>No dashboard items found.</Text>
            </View>
          }
        />
      </View>

      <View
        style={{
          flexShrink: 0,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 12),
          borderTopWidth: 1,
          borderTopColor: BORDER,
          backgroundColor: '#10213C',
        }}
      >
        <Pressable
          onPress={closeScreen}
          disabled={saving}
          style={({ pressed }) => ({
            minWidth: 82,
            paddingVertical: 11,
            paddingHorizontal: 16,
            borderRadius: 11,
            borderWidth: 1,
            borderColor: BORDER,
            alignItems: 'center',
            backgroundColor: pressed ? '#183453' : CARD,
            opacity: saving ? 0.55 : 1,
          })}
        >
          <Text style={{ color: TEXT, fontWeight: '800' }}>Close</Text>
        </Pressable>

        <Pressable
          onPress={savePreferences}
          disabled={saving || !dirty}
          style={({ pressed }) => ({
            minWidth: 82,
            paddingVertical: 11,
            paddingHorizontal: 16,
            borderRadius: 11,
            alignItems: 'center',
            backgroundColor: pressed ? '#1D4ED8' : PRIMARY,
            opacity: saving || !dirty ? 0.45 : 1,
          })}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={{ color: TEXT, fontWeight: '800' }}>Save</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
