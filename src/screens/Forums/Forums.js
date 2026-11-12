import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from './../../api/client';

const BG = '#0F172A';
const CARD = '#0B1220';
const TEXT = '#E2E8F0';
const MUTED = '#94A3B8';
const BORDER = '#334155';

export default function Forums() {
  const navigation = useNavigation();
  const mounted = useRef(true);

  const [busy, setBusy] = useState(true);
  const [forums, setForums] = useState([]);
  const [q, setQ] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    mounted.current = true;

    const unsub = navigation.addListener('focus', () => {
      loadForums();
      loadCurrentUser();
    });

    // initial load
    loadForums();
    loadCurrentUser();

    return () => {
      mounted.current = false;
      unsub && unsub();
    };
  }, [navigation]);

  // Load forums
  const loadForums = async () => {
    try {
      setBusy(true);
      const res = await api('/api/forums'); // GET forums
      if (!mounted.current) return;
      setForums(Array.isArray(res) ? res : []);
    } catch (e) {
      if (!mounted.current) return;
      Alert.alert('Forums', e?.message || 'Failed to load forums.');
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  // Load current user (for right/left alignment in ForumDetail)
  const loadCurrentUser = async () => {
    try {
      const me = await api('/api/me'); // 👈 change if your endpoint is different
      if (!mounted.current) return;
      setCurrentUserId(me?.id ?? null);
    } catch (e) {
      if (!mounted.current) return;
      console.log('Failed to load current user', e);
      // not fatal – messages will just all appear on the left
    }
  };

  const filtered = forums.filter((f) => {
    if (!q) return true;
    const hay = `${f?.title ?? ''} ${f?.name ?? ''}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  if (busy && !forums.length) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: BG,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, marginBottom: 10 }}>
        <Text style={{ color: TEXT, fontWeight: '800', fontSize: 18 }}>
          Forums
        </Text>
        <Text style={{ color: MUTED, marginTop: 2 }}>
          Choose a forum to view messages.
        </Text>

        {/* Search */}
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search forums..."
          placeholderTextColor="#64748B"
          style={{
            marginTop: 10,
            backgroundColor: CARD,
            color: TEXT,
            borderColor: BORDER,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        />
      </View>

      {/* Forum list */}
      <FlatList
        data={filtered}
        keyExtractor={(item, idx) => String(item?.id ?? idx)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          !busy && (
            <Text
              style={{
                color: MUTED,
                textAlign: 'center',
                marginTop: 24,
              }}
            >
              No forums found.
            </Text>
          )
        }
        renderItem={({ item }) => {
          const label = item?.title || item?.name || 'Forum';

          return (
            <Pressable
              onPress={() =>
                navigation.navigate('ForumDetail', {
                  forum: item,
                  currentUserId, // can be null; ForumDetail handles that
                })
              }
              style={({ pressed }) => ({
                backgroundColor: CARD,
                borderColor: pressed ? '#1d4ed8' : BORDER,
                borderWidth: 1,
                borderRadius: 14,
                paddingVertical: 12,
                paddingHorizontal: 14,
              })}
            >
              <Text style={{ color: TEXT, fontWeight: '700', fontSize: 16 }}>
                {label}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
