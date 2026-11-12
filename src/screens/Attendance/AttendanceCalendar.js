// src/screens/AttendanceCalendar.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../../api/client';

const BG = '#0F172A';
const CARD = '#0B1220';
const TEXT = '#E2E8F0';
const MUTED = '#94A3B8';
const BORDER = '#334155';
const PRIMARY = '#2563eb';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const fmtMonthLabel = (year, month, nameFromApi) => {
  if (nameFromApi) return `${nameFromApi}, ${year}`;
  const d = new Date(year, month - 1, 1);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
  });
};

// Convert JS Sunday=0..Saturday=6 to Monday=0..Sunday=6
const toMondayIndex = (jsDay) => (jsDay + 6) % 7;

const buildMonthGrid = (days = []) => {
  if (!days.length) return [];

  const sorted = [...days].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const first = sorted[0];
  const firstDate = new Date(first.date);
  const firstJsDay = firstDate.getDay(); // 0 Sunday..6 Saturday
  const firstIndex = toMondayIndex(firstJsDay); // Monday-based index

  const weeks = [];
  let current = new Array(firstIndex).fill(null);

  sorted.forEach((day) => {
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
    current.push(day);
  });

  if (current.length) {
    while (current.length < 7) current.push(null);
    weeks.push(current);
  }

  return weeks;
};

const isSameDay = (isoDate, base = new Date()) => {
  if (!isoDate) return false;
  const d = new Date(isoDate);
  return (
    d.getFullYear() === base.getFullYear() &&
    d.getMonth() === base.getMonth() &&
    d.getDate() === base.getDate()
  );
};

const getDayColors = (day) => {
  if (!day) {
    return {
      bg: 'transparent',
      border: '#1f2937',
      text: MUTED,
    };
  }

  const status = String(day.status || 'none').toLowerCase();
  const jsDay = new Date(day.date).getDay(); // 0 Sunday..6 Saturday

  // dark-theme friendly tints
  if (status === 'present') {
    return {
      bg: 'rgba(34,197,94,0.25)',
      border: '#22c55e',
      text: '#bbf7d0',
    };
  }
  if (status === 'absent') {
    return {
      bg: 'rgba(248,113,113,0.25)',
      border: '#f97373',
      text: '#fee2e2',
    };
  }
  if (status === 'off') {
    // Sunday vs other holiday / off days
    if (jsDay === 0) {
      // Sunday
      return {
        bg: 'rgba(59,130,246,0.35)',
        border: '#3b82f6',
        text: '#dbeafe',
      };
    }
    // Holiday / weekend
    return {
      bg: 'rgba(56,189,248,0.30)',
      border: '#0ea5e9',
      text: '#e0f2fe',
    };
  }

  // Not updated / normal day
  return {
    bg: 'transparent',
    border: '#1f2937',
    text: TEXT,
  };
};

const LegendItem = ({ label, color }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
    <View
      style={{
        width: 14,
        height: 14,
        borderRadius: 3,
        marginRight: 8,
        backgroundColor: color,
      }}
    />
    <Text style={{ color: TEXT, fontSize: 13 }}>{label}</Text>
  </View>
);

export default function AttendanceCalendar() {
  const navigation = useNavigation();
  const route = useRoute();
  const mounted = useRef(true);

  const params = route.params || {};
  const ward =
    params.ward || null; // { id, name, class_group_id, class_label }

  const now = new Date();
  const [year, setYear] = useState(
    Number(params.year) || now.getFullYear(),
  );
  const [month, setMonth] = useState(
    Number(params.month) || now.getMonth() + 1,
  );

  const [busy, setBusy] = useState(true);
  const [calendar, setCalendar] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    mounted.current = true;
    if (!ward) {
      setBusy(false);
      return;
    }
    load();
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ward?.id, ward?.class_group_id, year, month]);

  const showToast = (message, type = 'ok') => {
    setToast({ message, type });
  };
  const clearToast = () => setToast(null);

  const load = async () => {
    if (!ward) return;
    try {
      setBusy(true);
      clearToast();
      const url = `/api/attendance/calendar?student_id=${ward.id}&year=${year}&month=${month}&class_group_id=${ward.class_group_id}`;
      console.log("url==>", url);
      const res = await api(url);
      if (!mounted.current) return;
      setCalendar(res || null);
    } catch (e) {
      if (!mounted.current) return;
      console.log('Attendance calendar load failed', e);
      setCalendar(null);
      showToast('Could not load attendance.', 'err');
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  const changeMonth = (delta) => {
    setYear((prevYear) => {
      // use functional form so month & year change together cleanly
      let y = prevYear;
      let m = month + delta;
      if (m < 1) {
        m = 12;
        y -= 1;
      } else if (m > 12) {
        m = 1;
        y += 1;
      }
      setMonth(m);
      return y;
    });
  };

  const weeks = useMemo(
    () => buildMonthGrid(calendar?.days || []),
    [calendar?.days],
  );

  const today = useMemo(() => new Date(), []);

  if (!ward) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: BG,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: TEXT }}>No ward selected.</Text>
      </View>
    );
  }

  if (busy && !calendar) {
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

  const monthLabel = fmtMonthLabel(
    year,
    month,
    calendar?.month_name || null,
  );

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* <Pressable
            onPress={() => navigation.goBack()}
            style={{ paddingVertical: 4, paddingRight: 10 }}
          >
            <Text style={{ color: PRIMARY, fontSize: 16 }}>← Back</Text>
          </Pressable> */}

          <View style={{ flex: 1 }}>
            <Text
              style={{ color: TEXT, fontWeight: '800', fontSize: 18 }}
              numberOfLines={1}
            >
              Attendance
            </Text>
            {
              ward?.name ? (
              <Text
                style={{ color: MUTED, marginTop: 2 }}
                numberOfLines={2}
              >
                {ward.name} , {ward.class_label}
              </Text>
              ) : null
            }
            
          </View>
        </View>
      </View>

      {/* Toast */}
      {toast?.message ? (
        <View
          style={[
            styles.toast,
            toast.type === 'err' ? styles.toastErr : styles.toastOk,
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.card}>
          {/* Month selector */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Pressable
              onPress={() => changeMonth(-1)}
              style={({ pressed }) => ({
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 8,
                backgroundColor: pressed ? '#1f2937' : '#0b1120',
                borderWidth: 1,
                borderColor: BORDER,
              })}
            >
              <Text style={{ color: TEXT }}>Prev</Text>
            </Pressable>

            <Text
              style={{
                color: PRIMARY,
                fontWeight: '700',
                fontSize: 16,
              }}
            >
              {monthLabel}
            </Text>

            <Pressable
              onPress={() => changeMonth(1)}
              style={({ pressed }) => ({
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 8,
                backgroundColor: pressed ? '#1f2937' : '#0b1120',
                borderWidth: 1,
                borderColor: BORDER,
              })}
            >
              <Text style={{ color: TEXT }}>Next</Text>
            </Pressable>
          </View>

          {/* Weekday header */}
          <View style={styles.weekHeader}>
            {WEEKDAYS.map((d) => (
              <View key={d} style={styles.weekHeaderCell}>
                <Text
                  style={{
                    color: '#f97316',
                    fontWeight: '700',
                    fontSize: 13,
                  }}
                >
                  {d}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          {weeks.map((week, wIdx) => (
          <View key={`w-${wIdx}`} style={styles.weekRow}>
            {week.map((day, dIdx) => {
              const dayNum = day ? new Date(day.date).getDate() : '';
              const colors = getDayColors(day);

              const isToday = day && isSameDay(day.date, today);
              const status = day ? String(day.status || 'none').toLowerCase() : 'none';

              // Start with normal status-based colours
              let bgColor = colors.bg;
              let borderColor = colors.border;
              let textColor = colors.text;

              if (isToday) {
                if (status === 'present' || status === 'absent') {
                  // ✅ Present/Absent wins: keep status colours
                  // (optional) you can just slightly emphasize border if you want:
                  // borderColor = '#facc15';
                } else {
                  // ✅ For holidays / Sundays / not-updated, use "today" highlight
                  bgColor = 'rgba(250,204,21,0.22)'; // soft amber
                  borderColor = '#facc15';
                  textColor = '#fef9c3';
                }
              }

              return (
                <View
                  key={`d-${wIdx}-${dIdx}`}
                  style={[
                    styles.dayCell,
                    {
                      backgroundColor: bgColor,
                      borderColor,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: textColor,
                      fontWeight: '700',
                      fontSize: 13,
                    }}
                  >
                    {dayNum}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}



          {/* Legend + button */}
          <View style={{ marginTop: 16 }}>
            <LegendItem
              label="Present"
              color="rgba(34,197,94,0.75)"
            />
            <LegendItem
              label="Absent"
              color="rgba(248,113,113,0.8)"
            />
            <LegendItem
              label="Holiday"
              color="rgba(56,189,248,0.8)"
            />
            <LegendItem
              label="Sunday"
              color="rgba(59,130,246,0.9)"
            />
            <LegendItem
              label="Not Updated"
              color="transparent"
            />
          </View>

          <Pressable
            onPress={() =>
              navigation.navigate('AnnualAttendance', {
                studentId: ward.id,
                studentName: ward.name,
                classLabel: ward.class_label,
                classGroupId: ward.class_group_id,
                year: year, 
              })
            }
            style={({ pressed }) => ({
              marginTop: 18,
              alignSelf: 'stretch',
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: pressed ? '#1d4ed8' : '#2563eb',
              alignItems: 'center',
            })}
          >
            <Text
              style={{
                color: '#f9fafb',
                fontWeight: '700',
                fontSize: 14,
              }}
            >
              View Annual Attendance
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: CARD,
  },
  toastOk: {
    borderColor: PRIMARY,
  },
  toastErr: {
    borderColor: '#ef4444',
  },
  toastText: {
    color: TEXT,
    fontSize: 13,
  },
  card: {
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekHeaderCell: {
    flex: 1,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    height: 40,
    margin: 1,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617',
  },
});
