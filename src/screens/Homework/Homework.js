// src/screens/Homework.js
import React, { useCallback, useEffect, useRef, useState, memo } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { api } from '../../api/client';
import { useNavigation } from '@react-navigation/native';

const BG = '#0F172A';
const CARD = '#0B1220';
const TEXT = '#E2E8F0';
const MUTED = '#94A3B8';
const BORDER = '#334155';
const CTA = '#22C55E';
const INFO = '#2563eb';
const WARNING = '#f59e0b';

const WINDOW_OPTS = [7, 30, 90];

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

const fmtAbsTZ = (ts, tz) => {
  if (!ts) return '';
  const d = new Date(ts);
  if (Number.isNaN(+d)) return '';
  try {
    return d.toLocaleString(undefined, {
      timeZone: tz || undefined,
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return d.toLocaleString();
  }
};

const Pill = ({ label, tone = 'neutral' }) => {
  const tones = {
    neutral: { bg: CARD, border: BORDER, fg: MUTED },
    info: { bg: 'rgba(37,99,235,0.12)', border: '#2e4ea8', fg: INFO },
    good: { bg: 'rgba(34,197,94,0.15)', border: '#166534', fg: CTA },
    warn: { bg: 'rgba(245,158,11,0.16)', border: '#a16207', fg: WARNING },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: t.bg,
        borderWidth: 1,
        borderColor: t.border,
        marginLeft: 8,
      }}
    >
      <Text style={{ color: t.fg, fontWeight: '700', fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
};

const Row = memo(({ item, timezone, onOpen }) => {
  // map to your fields
  const title = item?.name || 'Homework';
  const subject = item?.course_title || '';
  const classStr = item?.class_name || '';
  const due = item?.ends_at;
  const status = (item?.status || '').toLowerCase(); // e.g., scheduled
  const qCount = Number(item?.questions_count || 0);

  return (
    <Pressable
      onPress={() => onOpen(item)}
      android_ripple={{ color: 'rgba(255,255,255,0.06)' }}
      style={{
        backgroundColor: CARD,
        borderColor: BORDER,
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        marginHorizontal: 16,
      }}
    >
      {/* Header row */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{ color: TEXT, fontWeight: '800' }} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Chips on the right */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {qCount > 0 && <Pill label={`Questions: ${qCount}`} tone="neutral" />}
          {!!status && <Pill label={status} tone="info" />}
        </View>
      </View>

      {/* Subject */}
      {(!!subject || !!classStr) && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
          }}
        >
          {!!subject && (
            <Text
              style={{ color: MUTED, flex: 1, paddingRight: 12 }}
              numberOfLines={1}
            >
              {subject}
            </Text>
          )}

          {!!classStr && (
            <Text style={{ color: MUTED, fontWeight: '700' }} numberOfLines={1}>
              {classStr}
            </Text>
          )}
        </View>
      )}

      {/* Due line */}
      <Text style={{ color: TEXT, marginTop: 10 }}>
        <Text style={{ fontWeight: '800' }}>Due: </Text>
        {fmtAbsTZ(due, timezone)}
      </Text>

      {/* Footnote */}
      <Text style={{ color: MUTED, fontSize: 12, marginTop: 4 }}>
        Late submissions allowed (will be flagged).
      </Text>
    </Pressable>
  );
});

export default function Homework() {
  const mounted = useRef(true);

  const [busy, setBusy] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);
  const [windowDays, setWindowDays] = useState(30);
  const [q, setQ] = useState('');
  const [timezone, setTimezone] = useState(null);
  const [count, setCount] = useState(0);
  const navigation = useNavigation();

  const buildUrl = useCallback(
    () => `/api/homeworks?window_days=${windowDays}`,
    [windowDays],
  );

  const parseResponse = res => {
    const list = Array.isArray(res?.items) ? res.items : [];
    return {
      list,
      tz: res?.ui_timezone || null,
      count: Number(res?.count || list.length || 0),
    };
  };

  const load = useCallback(async () => {
    try {
      setBusy(true);
      const url = buildUrl();
      const res = await api(url);
      if (!mounted.current) return;
      const { list, tz, count: c } = parseResponse(res);
      setItems(list);
      setTimezone(tz);
      setCount(c);
    } catch (e) {
      if (mounted.current)
        Alert.alert('Error', e?.message || 'Failed to load homework');
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, [buildUrl]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await api(buildUrl());
      if (!mounted.current) return;
      const { list, tz, count: c } = parseResponse(res);
      setItems(list);
      setTimezone(tz);
      setCount(c);
    } catch (e) {
      if (mounted.current) Alert.alert('Error', e?.message || 'Refresh failed');
    } finally {
      if (mounted.current) setRefreshing(false);
    }
  }, [buildUrl]);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
    };
  }, [load]);

  // refetch when window changes
  useEffect(() => {
    onRefresh();
  }, [windowDays, onRefresh]);

  const filtered = items
    .filter(x => {
      if (!q) return true;
      const hay = `${x?.name ?? ''} ${x?.course_title ?? ''} ${
        x?.class_name ?? ''
      }`.toLowerCase();
      return hay.includes(q.toLowerCase());
    })
    .sort((a, b) => new Date(a?.ends_at || 0) - new Date(b?.ends_at || 0));

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

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* Top controls */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, marginBottom: 10 }}>
        <View style={{ marginBottom: 6 }}>
          {/* <Text style={{ color: TEXT, fontWeight: '800', fontSize: 18 }}>
            Homework
          </Text> */}
          <Text style={{ color: MUTED, marginTop: 2 }}>
            {count} item{count === 1 ? '' : 's'}{' '}
          </Text>
        </View>

        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search by title, subject or class"
          placeholderTextColor="#64748B"
          style={{
            backgroundColor: CARD,
            color: TEXT,
            borderColor: BORDER,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            marginBottom: 10,
          }}
        />

        {/* Window selector */}
        {/* <View style={{ flexDirection: 'row', gap: 8 }}>
          {WINDOW_OPTS.map(d => (
            <Pressable
              key={d}
              onPress={() => setWindowDays(d)}
              style={({ pressed }) => ({
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 10,
                backgroundColor:
                  windowDays === d ? CTA : pressed ? '#1F2937' : CARD,
                borderWidth: 1,
                borderColor: BORDER,
              })}
            >
              <Text
                style={{
                  color: windowDays === d ? BG : TEXT,
                  fontWeight: '700',
                }}
              >
                {d} days
              </Text>
            </Pressable>
          ))}
        </View> */}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(it, idx) => String(it?.id ?? idx)}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Row
            item={item}
            timezone={timezone}
            onOpen={hw =>
              navigation.navigate('HomeworkDetail', {
                id: hw?.id,
                hw,
                timezone,
              })
            }
          />
        )}
        refreshControl={
          <RefreshControl
            tintColor="#fff"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <View
              style={{
                backgroundColor: CARD,
                borderColor: '#3b4457',
                borderWidth: 1,
                borderStyle: 'dashed',
                borderRadius: 14,
                paddingVertical: 20,
                paddingHorizontal: 16,
                alignItems: 'center',
              }}
            >
              <EmojiText size={26} style={{ marginBottom: 8 }}>
                📒
              </EmojiText>
              <Text style={{ color: TEXT, fontWeight: '700', marginBottom: 4 }}>
                No homeworks in the next {windowDays} days.
              </Text>
              <Text style={{ color: MUTED, fontSize: 12, textAlign: 'center' }}>
                Try widening the date window or pull to refresh.
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}
