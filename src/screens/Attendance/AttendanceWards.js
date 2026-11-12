// src/screens/AttendanceWards.js
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BG = '#0F172A';
const CARD = '#0B1220';
const TEXT = '#E2E8F0';
const MUTED = '#94A3B8';
const BORDER = '#334155';

export default function AttendanceWards() {
  const navigation = useNavigation();
  const mounted = useRef(true);

  const [busy, setBusy] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [role, setRole] = useState(null);
  const [wards, setWards] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    mounted.current = true;
    init();
    return () => {
      mounted.current = false;
    };
  }, []);

  const init = useCallback(async () => {
    try {
      setBusy(true);

      let me = await AsyncStorage.getItem('me');
      me = me ? JSON.parse(me) : null;

      if (!me) {
        me = await api('/api/me');
        await AsyncStorage.setItem('me', JSON.stringify(me));
      }

      const userRole = me?.role;

      if (userRole === 'admin' || userRole === 'teacher') {
        navigation.replace('StaffAttendance');
        return;
      }

      // 4. Normal flow for other roles
      const res = await api('/api/attendance/meta');
      if (!mounted.current) return;

      const { role, wards, stats } = parseMeta(res);
      setRole(role);
      setWards(wards);
      setStats(stats);
    } catch (e) {
      if (mounted.current) {
        Alert.alert(
          'Attendance',
          e?.message || 'Failed to load attendance information.',
        );
      }
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, [navigation]);

  const parseMeta = res => {
    return {
      role: res?.role || null,
      wards: Array.isArray(res?.wards) ? res.wards : [],
      stats: res?.stats || null,
    };
  };

  const load = useCallback(async () => {
    try {
      setBusy(true);
      const res = await api('/api/attendance/meta');
      if (!mounted.current) return;
      const { role, wards, stats } = parseMeta(res);
      console.log('role==>', role);
      setRole(role);
      setWards(wards);
      setStats(stats);
    } catch (e) {
      if (mounted.current) {
        Alert.alert(
          'Attendance',
          e?.message || 'Failed to load attendance information.',
        );
      }
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await api('/api/attendance/meta');
      if (!mounted.current) return;
      const { role, wards, stats } = parseMeta(res);
      setRole(role);
      setWards(wards);
      setStats(stats);
    } catch (e) {
      if (mounted.current) {
        Alert.alert(
          'Attendance',
          e?.message || 'Failed to refresh attendance information.',
        );
      }
    } finally {
      if (mounted.current) setRefreshing(false);
    }
  }, []);

  const openWard = ward => {
    if (!ward) return;
    navigation.navigate('Calendar', {
      ward,
      student_id: ward.id,
      class_group_id: ward.class_group_id,
    });
  };

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

  const roleLabel = role ? `Role: ${String(role).toUpperCase()}` : '';

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* <Pressable
            onPress={() => navigation.goBack()}
            style={{ paddingVertical: 4, paddingRight: 10 }}
          >
            <Text style={{ color: '#22C55E', fontSize: 16 }}>← Back</Text>
          </Pressable> */}

          <View style={{ flex: 1 }}>
            <Text
              style={{ color: TEXT, fontWeight: '800', fontSize: 18 }}
              numberOfLines={1}
            >
              Attendance
            </Text>
            {!!roleLabel && (
              <Text style={{ color: MUTED, marginTop: 2 }}>{roleLabel}</Text>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            tintColor="#fff"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Your Wards card */}
        <View
          style={{
            backgroundColor: CARD,
            borderColor: BORDER,
            borderWidth: 1,
            borderRadius: 16,
            padding: 14,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: TEXT, fontWeight: '700', marginBottom: 10 }}>
            Your Wards
          </Text>

          {wards.length === 0 ? (
            <Text style={{ color: MUTED, fontSize: 13 }}>
              No wards found on your account.
            </Text>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {wards.map(w => (
                <Pressable
                  key={w.id}
                  onPress={() => openWard(w)}
                  style={({ pressed }) => ({
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    backgroundColor: pressed ? '#1E293B' : '#1F2937',
                    borderWidth: 1,
                    borderColor: '#1E293B',
                    marginRight: 6,
                    marginBottom: 6,
                  })}
                >
                  <Text
                    style={{
                      color: TEXT,
                      fontWeight: '700',
                      fontSize: 13,
                    }}
                  >
                    {w.name} · {w.class_label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Hint / Empty state card */}
        <View
          style={{
            backgroundColor: BG,
            borderColor: '#475569',
            borderWidth: 1,
            borderRadius: 16,
            borderStyle: 'dashed',
            paddingVertical: 20,
            paddingHorizontal: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: MUTED,
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            Please click on a Ward to see their attendance
          </Text>
        </View>

        {/* Optional quick stats (week / mtd / ytd) */}
        {stats ? (
          <View
            style={{
              marginTop: 16,
              backgroundColor: CARD,
              borderColor: BORDER,
              borderWidth: 1,
              borderRadius: 16,
              padding: 14,
            }}
          >
            <Text style={{ color: TEXT, fontWeight: '700', marginBottom: 8 }}>
              Summary
            </Text>
            <Text style={{ color: MUTED, fontSize: 13 }}>
              Week: {stats.week ?? 0} day(s) present
            </Text>
            <Text style={{ color: MUTED, fontSize: 13, marginTop: 2 }}>
              Month-to-date: {stats.mtd ?? 0} day(s) present
            </Text>
            <Text style={{ color: MUTED, fontSize: 13, marginTop: 2 }}>
              Year-to-date: {stats.ytd ?? 0} day(s) present
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
