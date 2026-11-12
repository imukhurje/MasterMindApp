// src/screens/Notifications.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { api } from '../api/client';

const BG = '#0F172A';
const CARD = '#0B1220';
const TEXT = '#E2E8F0';
const MUTED = '#94A3B8';
const BORDER = '#334155';
const CTA = '#22C55E';
const INFO = '#2563eb';

const TABS = ['all', 'unread', 'read'];

const EmojiText = ({ children, size = 22, style }) => (
  <Text
    style={[
      {
        fontSize: size,
        includeFontPadding: false,
        textShadowColor: 'rgba(255,255,255,0.35)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
      },
      style,
    ]}
  >
    {String(children) + '\uFE0F'}
  </Text>
);

// absolute date-time
function fmtAbs(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return Number.isNaN(+d) ? '' : d.toLocaleString();
}

const NotificationRow = ({ item, onOpen, onToggleRead }) => {
  const unread = !!(item.is_unread || item.pinned_unread);
  const emoji = '🔔';
  const senderName = item?.sender?.name || 'Notification';
  const body = item.body || '';
  const time = item.created_at;

  return (
    <Pressable
      android_ripple={{
        color: 'rgba(255,255,255,0.06)',
      }}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 14,
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        {/* Left: avatar/emoji + text */}
        <View style={{ flex: 1, paddingRight: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            {/* <EmojiText size={22} style={{ marginRight: 8 }}>{emoji}</EmojiText> */}
            <Text
              style={{ color: TEXT, fontWeight: '800', fontSize: 16 }}
              numberOfLines={1}
            >
              {senderName}
            </Text>

            {unread && (
              <View
                style={{
                  marginLeft: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 999,
                  backgroundColor: 'rgba(37,99,235,0.12)',
                  borderWidth: 1,
                  borderColor: '#2e4ea8',
                }}
              >
                <Text style={{ color: INFO, fontWeight: '700', fontSize: 12 }}>
                  Unread
                </Text>
              </View>
            )}
            {item.pinned_unread ? (
              <Text style={{ marginLeft: 6, color: MUTED, fontSize: 12 }}>
                📌
              </Text>
            ) : null}
          </View>

          {!!body && (
            <Text style={{ color: MUTED }} numberOfLines={2}>
              {body}
            </Text>
          )}
        </View>

        {/* Right: time + action */}
        <View
          style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}
        >
          <Text style={{ color: MUTED, fontSize: 12, marginBottom: 8 }}>
            {fmtAbs(time)}
          </Text>
          <Pressable
            onPress={() => onToggleRead(item)}
            style={({ pressed }) => ({
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 10,
              backgroundColor: unread
                ? pressed
                  ? '#16a34a'
                  : CTA
                : 'transparent',
              borderWidth: unread ? 0 : 1,
              borderColor: BORDER,
              alignSelf: 'flex-end',
            })}
          >
            <Text style={{ color: unread ? BG : MUTED, fontWeight: '700' }}>
              {unread ? 'Mark as Read' : 'Mark as Un-read'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default function Notifications() {
  const mounted = useRef(true);

  const [busy, setBusy] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [tab, setTab] = useState('all');

  // Parse your exact shape: { ok, notifications: [...] }
  const parseResponse = res => {
    const list = Array.isArray(res?.notifications)
      ? res.notifications
      : Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.items)
      ? res.items
      : Array.isArray(res)
      ? res
      : [];
    // your payload doesn’t include pagination; keep null
    const next = res?.next || res?.nextCursor || res?.cursor || null;
    return { list, next };
  };

  const loadInitial = useCallback(async () => {
    try {
      setBusy(true);
      const res = await api('/api/notifications');
      if (!mounted.current) return;
      const { list, next } = parseResponse(res);
      setItems(list);
      setCursor(next || null);
    } catch (e) {
      if (mounted.current)
        Alert.alert('Error', e?.message || 'Failed to load notifications');
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await api('/api/notifications');
      if (!mounted.current) return;
      const { list, next } = parseResponse(res);
      setItems(list);
      setCursor(next || null);
    } catch (e) {
      if (mounted.current) Alert.alert('Error', e?.message || 'Refresh failed');
    } finally {
      if (mounted.current) setRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore || busy) return;
    try {
      setLoadingMore(true);
      const res = await api(
        `/api/notifications?cursor=${encodeURIComponent(cursor)}`,
      );
      if (!mounted.current) return;
      const { list, next } = parseResponse(res);
      setItems(prev => [...prev, ...list]);
      setCursor(next || null);
    } catch {
      // ignore
    } finally {
      if (mounted.current) setLoadingMore(false);
    }
  }, [cursor, loadingMore, busy]);

  // Toggle read/unread using your booleans
  const toggleRead = useCallback(async n => {
    const currentlyUnread = !!(n.is_unread || n.pinned_unread);
    const targetUnread = !currentlyUnread; // what we want after the click

    // 1) Optimistic update
    setItems(prev =>
      prev.map(x =>
        x.id === n.id
          ? {
              ...x,
              is_unread: targetUnread,
              pinned_unread: targetUnread ? x.pinned_unread : false,
            }
          : x,
      ),
    );

    try {
      const id = encodeURIComponent(n.id);

      // Send desired unread state (JavaScript Object Notation (JSON) body)
      const res = await api(`/api/notifications/${id}/toggle-unread`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unread: targetUnread }),
      });

      // 2) Reconcile with server truth if provided
      const srvUnread =
        typeof res?.is_unread === 'boolean' ? res.is_unread : targetUnread;
      const srvPinned =
        typeof res?.pinned_unread === 'boolean'
          ? res.pinned_unread
          : srvUnread
          ? !!n.pinned_unread
          : false;

      setItems(prev =>
        prev.map(x =>
          x.id === n.id
            ? { ...x, is_unread: srvUnread, pinned_unread: srvPinned }
            : x,
        ),
      );
    } catch (e) {
      // 3) Revert on failure
      setItems(prev =>
        prev.map(x =>
          x.id === n.id
            ? {
                ...x,
                is_unread: currentlyUnread,
                pinned_unread: n.pinned_unread,
              }
            : x,
        ),
      );
      Alert.alert('Error', e?.message || 'Failed to update notification state');
    }
  }, []);

  const markAllRead = useCallback(async () => {
    const snapshot = items;
    // optimistic
    setItems(prev =>
      prev.map(x => ({ ...x, is_unread: false, pinned_unread: false })),
    );
    try {
      // try common endpoints
      try {
        await api('/api/notifications/mark-all-read', {
          method: 'POST',
          body: '{}',
        });
      } catch {
        await api('/api/notifications/read-all', {
          method: 'POST',
          body: '{}',
        });
      }
    } catch (e) {
      setItems(snapshot);
      Alert.alert('Error', e?.message || 'Could not mark all as read');
    }
  }, [items]);

  useEffect(() => {
    mounted.current = true;
    loadInitial();
    return () => {
      mounted.current = false;
    };
  }, [loadInitial]);

  const unreadCount = items.filter(x => x.is_unread || x.pinned_unread).length;

  if (busy) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: BG,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  const filtered = items.filter(n => {
    if (tab === 'unread') return !!(n.is_unread || n.pinned_unread);
    if (tab === 'read') return !(n.is_unread || n.pinned_unread);
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          {/* <Text style={{ color: TEXT, fontWeight: '800', fontSize: 18 }}>
            Notifications
          </Text> */}
          <Text style={{ color: MUTED, marginTop: 2 }}>
            {unreadCount} unread
          </Text>
        </View>
        {unreadCount > 0 && (
          <Pressable
            // onPress={markAllRead}
            style={({ pressed }) => ({
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 10,
              backgroundColor: pressed ? '#16a34a' : CTA,
            })}
          >
            <Text style={{ color: BG, fontWeight: '700' }}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          paddingHorizontal: 16,
          marginBottom: 8,
        }}
      >
        {TABS.map(t => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={({ pressed }) => ({
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 10,
              backgroundColor: tab === t ? CTA : pressed ? '#1F2937' : CARD,
              borderWidth: 1,
              borderColor: BORDER,
            })}
          >
            <Text
              style={{
                color: tab === t ? BG : TEXT,
                fontWeight: '700',
                textTransform: 'capitalize',
              }}
            >
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <View
        style={{
          marginHorizontal: 16,
          marginTop: 6,
          borderWidth: 1,
          borderColor: '#3B7197',
          borderRadius: 16,
          backgroundColor: '#142B49',
          overflow: 'hidden',
        }}
      >
        <FlatList
          data={filtered}
          keyExtractor={(it, idx) => String(it.id ?? idx)}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: '#334155',
                marginHorizontal: 14,
              }}
            />
          )}
          contentContainerStyle={{
            paddingBottom: 0,
          }}
          renderItem={({ item }) => (
            <NotificationRow
              item={item}
              onOpen={n => {
                const title = n?.sender?.name || 'Notification';

                const body = n.body || '';

                const isUnread = !!(n.is_unread || n.pinned_unread);

                Alert.alert(title, body || '(No additional details)', [
                  {
                    text: 'Close',
                    style: 'cancel',
                  },
                  {
                    text: isUnread ? 'Mark as Read' : 'Mark as Un-read',
                    onPress: () => toggleRead(n),
                  },
                ]);
              }}
              onToggleRead={toggleRead}
            />
          )}
          refreshControl={
            <RefreshControl
              tintColor="#fff"
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          ListFooterComponent={
            loadingMore ? (
              <View
                style={{
                  paddingVertical: 16,
                }}
              >
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      </View>
    </View>
  );
}
