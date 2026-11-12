// src/screens/Classworks.js
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

const CLASSWORK_CARD = '#142B49';
const CLASSWORK_BORDER = '#3B7197';

const TEXT = '#E2E8F0';
const MUTED = '#AFC0D8';
const BORDER = '#334155';

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

const fmtAbsTZ = ts => {
  if (!ts) return '';
  const d = new Date(ts);
  if (Number.isNaN(+d)) return '';
  try {
    return d.toLocaleString(undefined, {
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

// Single row card – styled like Homework Row
const Row = memo(({ item, onOpen }) => {
  const title = item?.title || 'Classwork';
  const note = item?.body || '';
  const klass = item?.class_name || ''; // optional, if your API has it
  const created = item?.created_at;

  return (
    <Pressable
      onPress={() => onOpen(item)}
      android_ripple={{ color: 'rgba(255,255,255,0.06)' }}
      style={({ pressed }) => ({
        backgroundColor: CLASSWORK_CARD,
        borderColor: CLASSWORK_BORDER,
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        marginHorizontal: 16,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      {/* Header row */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text
            style={{
              color: '#F8FAFC',
              fontWeight: '800',
              fontSize: 15,
            }}
            numberOfLines={2}
          >
            {title}
          </Text>
        </View>

        {!!klass && (
          <Text
            style={{
              color: '#AFC0D8',
              fontWeight: '700',
              fontSize: 12,
            }}
            numberOfLines={1}
          >
            {klass}
          </Text>
        )}
      </View>

      {/* Optional note preview */}
      {!!note && (
        <Text
          style={{
            color: '#CBD5E1',
            marginTop: 7,
            lineHeight: 19,
          }}
          numberOfLines={2}
        >
          {note}
        </Text>
      )}

      {/* Created line */}
      <Text
        style={{
          color: '#CBD5E1',
          marginTop: 12,
          fontSize: 12,
        }}
      >
        <Text
          style={{
            color: '#F8FAFC',
            fontWeight: '800',
          }}
        >
          Created:{' '}
        </Text>

        {fmtAbsTZ(created)}
      </Text>
    </Pressable>
  );
});

export default function Classworks() {
  const mounted = useRef(true);

  const [busy, setBusy] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [count, setCount] = useState(0);
  const navigation = useNavigation();

  const buildUrl = useCallback(() => '/api/classworks', []);

  const parseResponse = res => {
    const list = Array.isArray(res?.items) ? res.items : [];
    return {
      list,
      count: Number(res?.count || list.length || 0),
    };
  };

  const load = useCallback(async () => {
    try {
      setBusy(true);
      const url = buildUrl();
      const res = await api(url);
      if (!mounted.current) return;
      const { list, count: c } = parseResponse(res);
      setItems(list);
      setCount(c);
    } catch (e) {
      if (mounted.current)
        Alert.alert('Error', e?.message || 'Failed to load classworks');
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, [buildUrl]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await api(buildUrl());
      if (!mounted.current) return;
      const { list, count: c } = parseResponse(res);
      setItems(list);
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

  const filtered = items
    .filter(x => {
      if (!q) return true;
      const hay = `${x?.title ?? ''} ${x?.body ?? ''} ${
        x?.class_name ?? ''
      }`.toLowerCase();
      return hay.includes(q.toLowerCase());
    })
    // latest first (like your screenshot)
    .sort(
      (a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0),
    );

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
      {/* Top controls – copied style from Homework.js */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, marginBottom: 10 }}>
        <View style={{ marginBottom: 6 }}>
          {/* <Text style={{ color: TEXT, fontWeight: '800', fontSize: 18 }}>
            Classworks
          </Text> */}
          <Text style={{ color: MUTED, marginTop: 2 }}>
            {count} item{count === 1 ? '' : 's'}
          </Text>
        </View>

        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search by title, note or class"
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
      </View>

      {/* List – same pattern as Homework.js */}
      <FlatList
        data={filtered}
        keyExtractor={(it, idx) => String(it?.id ?? idx)}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Row
            item={item}
            onOpen={cw =>
              navigation.navigate('ClassworkDetail', {
                id: cw?.id,
                cw,
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
                📚
              </EmojiText>
              <Text
                style={{
                  color: TEXT,
                  fontWeight: '700',
                  marginBottom: 4,
                }}
              >
                No classworks found.
              </Text>
              <Text
                style={{
                  color: MUTED,
                  fontSize: 12,
                  textAlign: 'center',
                }}
              >
                Pull down to refresh or try again later.
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}
