// src/screens/Results.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
  Pressable,
  SectionList,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../api/client';

const BG = '#081321';

const CARD = '#102742';
const CARD_PRESSED = '#143154';

const TEXT = '#F1F5F9';
const MUTED = '#A8B6C9';

const BORDER = '#376D99';

const CHIP_BG = '#0B1C32';
const CHIP_BORDER = '#315C80';

const PRIMARY = '#3B82F6';
const PRIMARY_LIGHT = '#60A5FA';

const CTA = '#3B82F6';

function toNum(v) {
  const n =
    typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function fmtMarks(v) {
  const n = toNum(v);
  // show 90 instead of 90.00
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2).replace(/\.00$/, '');
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export default function Results() {
  const navigation = useNavigation();
  const mounted = useRef(true);
  const searchTimer = useRef(null);

  const [busy, setBusy] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [query, setQuery] = useState('');
  const [rows, setRows] = useState([]);

  useEffect(() => {
    mounted.current = true;

    const unsub = navigation.addListener('focus', () => {
      load(query, { silent: false });
    });

    load('', { silent: false });

    return () => {
      mounted.current = false;
      unsub && unsub();
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [navigation]);

  const load = async (q = '', { silent = false } = {}) => {
    try {
      if (!silent) setBusy(true);

      const url = `/api/examinations/v1?search=${encodeURIComponent(q || '')}`;
      const res = await api(url);

      if (!mounted.current) return;

      const data = Array.isArray(res?.data) ? res.data : [];
      setRows(data);
    } catch (e) {
      if (!mounted.current) return;
      Alert.alert('Results', e?.message || 'Failed to load results.');
    } finally {
      if (!mounted.current) return;
      setBusy(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load(query, { silent: true });
  };

  const onChangeSearch = t => {
    setQuery(t);
    if (searchTimer.current) clearTimeout(searchTimer.current);

    // debounce
    searchTimer.current = setTimeout(() => {
      load(t, { silent: true });
    }, 350);
  };

  const sections = useMemo(() => {
    // group by examination_name
    const map = new Map();

    const sorted = [...rows].sort((a, b) => {
      const ea = String(a?.examination_name ?? '').toLowerCase();
      const eb = String(b?.examination_name ?? '').toLowerCase();
      if (ea !== eb) return ea.localeCompare(eb);
      const sa = String(a?.student_name ?? '').toLowerCase();
      const sb = String(b?.student_name ?? '').toLowerCase();
      return sa.localeCompare(sb);
    });

    for (const r of sorted) {
      const key = r?.examination_name || 'Examination';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }

    return Array.from(map.entries()).map(([title, data]) => ({
      title,
      data,
    }));
  }, [rows]);

  const total = rows.length;

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* Header */}
      <View
        style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: TEXT, fontWeight: '800', fontSize: 18 }}>
            {/* Results */}
          </Text>

          <Pressable
            onPress={() => load(query, { silent: true })}
            style={({ pressed }) => ({
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: pressed ? '#1f2937' : '#334155',
              borderWidth: 1,
              borderColor: BORDER,
            })}
          >
            <Text style={{ color: TEXT, fontWeight: '700', fontSize: 12 }}>
              Refresh
            </Text>
          </Pressable>
        </View>

        <Text style={{ color: MUTED, marginTop: 6, fontSize: 12 }}>
          {busy ? 'Loading…' : `${total} record${total === 1 ? '' : 's'} found`}
        </Text>

        {/* Search */}
        <View
          style={{
            marginTop: 10,
            borderWidth: 1,
            borderColor: BORDER,
            backgroundColor: '#0B1C32',
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <TextInput
            value={query}
            onChangeText={onChangeSearch}
            placeholder="Search examinations…"
            placeholderTextColor="#64748b"
            style={{ color: TEXT, fontSize: 14, padding: 0 }}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Body */}
      {busy && rows.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item =>
            `${item?.student_id ?? 's'}-${item?.examination_id ?? 'e'}`
          }
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          SectionSeparatorComponent={() => <View style={{ height: 14 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
            />
          }
          ListEmptyComponent={
            !busy && (
              <Text
                style={{ color: MUTED, textAlign: 'center', marginTop: 24 }}
              >
                No results available.
              </Text>
            )
          }
          renderSectionHeader={({ section }) => (
            <View
              style={{
                marginTop: 4,
                marginBottom: 2,
                borderLeftWidth: 3,
                borderLeftColor: PRIMARY,
                paddingLeft: 9,
              }}
            >
              <Text
                style={{
                  color: TEXT,
                  fontWeight: '900',
                  fontSize: 14,
                }}
              >
                {section.title}
              </Text>

              <Text
                style={{
                  color: MUTED,
                  fontSize: 11,
                  marginTop: 2,
                }}
              >
                {section.data.length} student
                {section.data.length === 1 ? '' : 's'}
              </Text>
            </View>
          )}
          renderItem={({ item }) => {
            const student = item?.student_name || 'Student';
            const full = toNum(item?.full_marks);
            const got = toNum(item?.marks_obtained);
            const pct = full > 0 ? clamp((got / full) * 100, 0, 100) : 0;

            return (
              <Pressable
                onPress={() =>
                  navigation.navigate('Marksheet', {
                    examId: item.examination_id,
                    studentId: item.student_id,
                    examName: item.examination_name,
                  })
                }
                style={({ pressed }) => ({
                  backgroundColor: pressed ? CARD_PRESSED : CARD,

                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: BORDER,

                  paddingVertical: 13,
                  paddingHorizontal: 14,
                })}
              >
                <View
                  style={{
                    backgroundColor: CARD,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: BORDER,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                  }}
                >
                  {/* Top row */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{ color: TEXT, fontWeight: '800', fontSize: 14 }}
                        numberOfLines={1}
                      >
                        {student}
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 8,
                          marginTop: 8,
                          flexWrap: 'wrap',
                        }}
                      >
                        <View
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 999,
                            backgroundColor: CHIP_BG,
                            borderWidth: 1,
                            borderColor: CHIP_BORDER,
                          }}
                        >
                          <Text
                            style={{
                              color: '#CBD5E1',
                              fontSize: 11,
                              fontWeight: '700',
                            }}
                          >
                            Full: {fmtMarks(full)}
                          </Text>
                        </View>

                        <View
                          style={{
                            paddingHorizontal: 11,
                            paddingVertical: 5,
                            borderRadius: 999,

                            backgroundColor: PRIMARY,

                            borderWidth: 1,
                            borderColor: PRIMARY_LIGHT,
                          }}
                        >
                          <Text
                            style={{
                              color: '#FFFFFF',
                              fontSize: 11,
                              fontWeight: '900',
                            }}
                          >
                            Achieved: {fmtMarks(got)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* % */}
                    <View
                      style={{
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: PRIMARY_LIGHT,
                          fontWeight: '900',
                          fontSize: 15,
                        }}
                      >
                        {pct.toFixed(1)}%
                      </Text>
                      <Text
                        style={{ color: MUTED, fontSize: 11, marginTop: 2 }}
                      >
                        score
                      </Text>
                    </View>
                  </View>

                  {/* Progress bar */}
                  <View
                    style={{
                      height: 8,
                      borderRadius: 999,
                      backgroundColor: '#081525',
                      borderWidth: 1,
                      borderColor: '#294B69',
                      marginTop: 12,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        backgroundColor: PRIMARY,
                      }}
                    />
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
