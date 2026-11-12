// src/screens/Students.js
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View, Text, TextInput, FlatList, Pressable, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import { api, getToken, setToken } from '../api/client';

const BG='#0F172A', CARD='#0B1220', TEXT='#E2E8F0', MUTED='#94A3B8', BORD1='#1F2937', BORD2='#334155', BTN='#22C55E';

export default function Students({ navigation }) {
  // ---- Hooks (top only) ----
  const [me, setMe] = useState(null);
  const [meta, setMeta] = useState({ role: null, can_manage: false, classes: [] });

  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [per] = useState(20);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);

  const [busy, setBusy] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [actingId, setActingId] = useState(null);

  const mountedRef = useRef(true);

  // ---- Effects ----
  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      const tok = await getToken();
      if (!tok) { navigation.replace('Login'); return; }
      try {
        setBusy(true);
        const [meResp, metaResp] = await Promise.all([ api('/api/me'), api('/api/students/meta') ]);
        if (!mountedRef.current) return;
        setMe(meResp || null);
        setMeta({
          role: metaResp?.role ?? null,
          can_manage: !!metaResp?.can_manage,
          classes: Array.isArray(metaResp?.classes) ? metaResp.classes : [],
        });
        await doFetch({ reset: true });
      } catch (e) {
        Alert.alert('Error', e.message || 'Failed to load students');
      } finally {
        if (mountedRef.current) setBusy(false);
      }
    })();
    return () => { mountedRef.current = false; };
  }, [navigation]);

  // ---- Plain functions (no hooks inside) ----
  async function doFetch({ reset = false } = {}) {
    const params = new URLSearchParams({
      q: q.trim(),
      page: String(reset ? 1 : page),
      per_page: String(per),
    }).toString();
    const data = await api(`/api/students?${params}`);
    if (!mountedRef.current) return;

    const newRows = Array.isArray(data?.rows) ? data.rows : [];
    setCount(Number(data?.count || 0));
    if (reset) { setRows(newRows); setPage(1); } else { setRows(prev => (page === 1 ? newRows : [...prev, ...newRows])); }
  }

  async function onRefresh() {
    try {
      setRefreshing(true);
      const [meResp, metaResp] = await Promise.all([ api('/api/me'), api('/api/students/meta') ]);
      if (!mountedRef.current) return;
      setMe(meResp || null);
      setMeta({
        role: metaResp?.role ?? null,
        can_manage: !!metaResp?.can_manage,
        classes: Array.isArray(metaResp?.classes) ? metaResp.classes : [],
      });
      await doFetch({ reset: true });
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  }

  async function onSearch() {
    try { setBusy(true); setPage(1); await doFetch({ reset: true }); }
    catch (e) { Alert.alert('Error', e.message || 'Search failed'); }
    finally { setBusy(false); }
  }

  async function onEndReached() {
    if (loadingMore) return;
    const totalPages = Math.max(1, Math.ceil(count / per));
    if (page >= totalPages) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      const params = new URLSearchParams({
        q: q.trim(), page: String(nextPage), per_page: String(per),
      }).toString();
      const data = await api(`/api/students?${params}`);
      if (!mountedRef.current) return;
      const newRows = Array.isArray(data?.rows) ? data.rows : [];
      setRows(prev => [...prev, ...newRows]);
      setCount(Number(data?.count || 0));
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to load more');
    } finally {
      setLoadingMore(false);
    }
  }

  async function onActAs(studentId, studentName) {
    Alert.alert(
      'Act As',
      `Act as ${studentName || 'this student'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            try {
              setActingId(studentId);
              const res = await api('/api/students/act-as', {
                method: 'POST',
                body: JSON.stringify({ student_id: studentId }),
              });
              if (res?.parent_token) {
                await AsyncStorage.setItem('parent_token', String(res.parent_token)); // <- 1) store first
              }
              if (res && res.token) {
                await setToken(String(res.token));  // swap to student identity
                navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
              } else {
                Alert.alert('Act As', 'Server did not return a token.');
              }
            } catch (e) {
              Alert.alert('Act As', e?.message || 'Could not switch identity.');
            } finally {
              setActingId(null);
            }
          }
        }
      ],
      { cancelable: true }
    );
  }

  // ---- UI ----
  if (busy) {
    return (
      <View style={{ flex:1, backgroundColor: BG, alignItems:'center', justifyContent:'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  const role = (meta?.role || '').toString().toUpperCase();
  const isParent = (meta?.role || '').toString().toLowerCase() === 'parent';
  const canManage = !!meta?.can_manage;

  return (
    <View style={{ flex:1, backgroundColor: BG, padding:16 }}>
      {/* Header */}
      <View style={{ marginBottom:12 }}>
        <Text style={{ color: TEXT, fontWeight:'800', fontSize:18 }}>Students</Text>
        <Text style={{ color: MUTED, marginTop:2 }}>{me?.email ? `Signed in as ${me.email}` : 'Signed in'}</Text>
        {role ? <Text style={{ color: MUTED, marginTop:2 }}>Role: {role}</Text> : null}
        {!canManage ? (
          <View style={{ marginTop:8, padding:8, borderRadius:10, backgroundColor:'#0b1220', borderWidth:1, borderColor:BORD2 }}>
            <Text style={{ color: MUTED }}>Read-only (Parent). You can view your wards but cannot manage records.</Text>
          </View>
        ) : null}
      </View>

      {/* Search */}
      <View style={{ flexDirection:'row', alignItems:'center', gap:8, backgroundColor:CARD, borderWidth:1, borderColor:BORD2, borderRadius:12, padding:8, marginBottom:12 }}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search students by name, email, phone"
          placeholderTextColor="#64748B"
          autoCapitalize="none"
          style={{ flex:1, color:TEXT, paddingVertical:10, paddingHorizontal:8 }}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
        <Pressable onPress={onSearch}
          style={({pressed})=>({ paddingVertical:10, paddingHorizontal:14, borderRadius:10, backgroundColor: pressed ? '#1F2937' : '#334155' })}
        >
          <Text style={{ color: '#e2e8f0', fontWeight:'700' }}>Search</Text>
        </Pressable>
      </View>

      {/* List */}
      <FlatList
        data={rows}
        keyExtractor={it => String(it.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={TEXT} />}
        contentContainerStyle={{ gap:12, paddingBottom:24 }}
        onEndReachedThreshold={0.35}
        onEndReached={onEndReached}
        ListEmptyComponent={<Text style={{ color:MUTED, textAlign:'center', marginTop:24 }}>No students found.</Text>}
        renderItem={({ item }) => {
          const classes = Array.isArray(item?.class_groups) ? item.class_groups : [];
          const classLabel = classes.length ? classes.map(c => c?.name || '').filter(Boolean).join(', ') : '—';
          return (
            <View style={{ backgroundColor:CARD, borderWidth:1, borderColor:BORD1, borderRadius:12, padding:12 }}>
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                <Text style={{ color: TEXT, fontWeight:'700', fontSize:16 }}>{item?.name ?? '—'}</Text>
                <View style={{ paddingHorizontal:8, paddingVertical:4, borderRadius:999, borderWidth:1, borderColor:BORD2 }}>
                  <Text style={{ color:MUTED, fontSize:12 }}>{String(item?.status || 'active')}</Text>
                </View>
              </View>

              <View style={{ marginTop:6 }}>
                <Text style={{ color:MUTED, fontSize:12 }}>Classes</Text>
                <Text style={{ color:TEXT }}>{classLabel}</Text>
              </View>

              {(item?.email || item?.phone) ? (
                <View style={{ marginTop:6, flexDirection:'row', gap:12 }}>
                  {item?.email ? <Text style={{ color:MUTED, fontSize:12 }}>📧 {item.email}</Text> : null}
                  {item?.phone ? <Text style={{ color:MUTED, fontSize:12 }}>📱 {item.phone}</Text> : null}
                </View>
              ) : null}

              {isParent ? (
                <View style={{ flexDirection:'row', justifyContent:'flex-end', marginTop:10 }}>
                  <Pressable
                    disabled={actingId === item.id}
                    onPress={() => onActAs(item.id, item.name || 'this student')}
                    style={({pressed})=>({
                      paddingVertical:10, paddingHorizontal:12, borderRadius:10,
                      backgroundColor: pressed ? '#1F2937' : '#22c55e',
                      borderWidth:1, borderColor:BORD2,
                      opacity: actingId === item.id ? 0.6 : 1
                    })}
                  >
                    {actingId === item.id ? <ActivityIndicator /> : <Text style={{ color:'#0b1220', fontWeight:'700' }}>Act As</Text>}
                  </Pressable>
                </View>
              ) : null}
            </View>
          );
        }}
        ListFooterComponent={loadingMore ? <View style={{ padding:16 }}><ActivityIndicator /></View> : null}
      />
    </View>
  );
}
