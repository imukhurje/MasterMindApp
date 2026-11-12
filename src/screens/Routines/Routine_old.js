// Routine.js
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';

import { api } from '../../api/client';

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 7];

const DAY_LABEL = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun',
};

const DAY_COLORS = {
  1: '#BFE7D0',
  2: '#BFC7F5',
  3: '#F5C0C0',
  4: '#BFD7F5',
  5: '#F4C39A',
  6: '#F7E59E',
  7: '#D7C2F5',
};

const isBreakLabel = label =>
  String(label || '')
    .toLowerCase()
    .includes('break');

function toMinutes(hhmm) {
  const [h, m] = String(hhmm || '0:0')
    .split(':')
    .map(x => Number(x || 0));
  return h * 60 + m;
}

function sortPeriods(periods = []) {
  return [...periods].sort(
    (a, b) => (a.period_order || 0) - (b.period_order || 0),
  );
}

function prettyTimeRange(p) {
  if (!p?.start_time || !p?.end_time) return '';
  return `${p.start_time} - ${p.end_time}`;
}

export default function Routine() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [classGroups, setClassGroups] = useState([]);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [selectedClassGroupId, setSelectedClassGroupId] = useState(null);

  const [matrix, setMatrix] = useState(null);
  const [routineMeta, setRoutineMeta] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState('');

  const templatesById = useMemo(() => {
    const map = {};
    (templates || []).forEach(t => {
      map[Number(t.id)] = t;
    });
    return map;
  }, [templates]);

  const classItems = useMemo(() => {
    return (classGroups || []).map(c => ({
      value: Number(c.class_group_id),
      label: String(c.name || `Class ${c.class_group_id}`),
      section: c.section,
    }));
  }, [classGroups]);

  const selectedClassLabel = useMemo(() => {
    const found = classItems.find(
      x => x.value === Number(selectedClassGroupId),
    );
    if (!found) return 'Select Class';
    return found.section ? `${found.label} (${found.section})` : found.label;
  }, [classItems, selectedClassGroupId]);

  const fetchAll = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const my = await api('/api/routines/v1/my');
      const list = Array.isArray(my) ? my : my?.data || my?.result || [];
      setClassGroups(list);

      const firstId = Number(list?.[0]?.class_group_id || 0) || null;
      const nextSelected = selectedClassGroupId ?? firstId;
      setSelectedClassGroupId(nextSelected);

      const tpls = await api('/api/routines/v1/day-templates');
      setTemplates(
        Array.isArray(tpls) ? tpls : tpls?.data || tpls?.result || [],
      );

      if (nextSelected) {
        await fetchForClass(nextSelected);
      } else {
        setMatrix(null);
        setRoutineMeta(null);
      }
    } catch (e) {
      setError(e?.message || 'Failed to load routine data.');
    } finally {
      setLoading(false);
    }
  }, [selectedClassGroupId]);

  const fetchForClass = useCallback(async classGroupId => {
    setError('');
    try {
      const m = await api(`/api/routines/v1/class/${classGroupId}/matrix`);
      setMatrix(m);
      const routineId = Number(m?.routine?.id || 0) || null;
      if (!routineId) {
        setRoutineMeta(null);
        return;
      }

      const r = await api(`/api/routines/v1/${routineId}`);
      setRoutineMeta(r);
    } catch (e) {
      setError(e?.message || 'Failed to load class routine.');
      setMatrix(null);
      setRoutineMeta(null);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (selectedClassGroupId) {
        const tpls = await api('/api/routines/v1/day-templates');
        setTemplates(
          Array.isArray(tpls) ? tpls : tpls?.data || tpls?.result || [],
        );
        await fetchForClass(selectedClassGroupId);
      } else {
        await fetchAll();
      }
    } catch (e) {
      setError(e?.message || 'Refresh failed.');
    } finally {
      setRefreshing(false);
    }
  };

  const templateIdForDay = useMemo(() => {
    const map = {};
    (routineMeta?.days || []).forEach(d => {
      map[Number(d.day_of_week)] = Number(d.day_template_id);
    });
    return map;
  }, [routineMeta]);

  const periodsForDay = useMemo(() => {
    const map = {};
    DAY_ORDER.forEach(day => {
      const tid = templateIdForDay[day];
      const tpl = tid ? templatesById[tid] : null;
      map[day] = tpl?.periods ? sortPeriods(tpl.periods) : [];
    });
    return map;
  }, [templateIdForDay, templatesById]);

  const maxRows = useMemo(() => {
    let max = 0;
    DAY_ORDER.forEach(d => {
      max = Math.max(max, (periodsForDay[d] || []).length);
    });
    return max;
  }, [periodsForDay]);

  const leftPeriods = useMemo(() => {
    const mon = periodsForDay[1] || [];
    if (mon.length) return mon;

    for (const d of DAY_ORDER) {
      const arr = periodsForDay[d] || [];
      if (arr.length) return arr;
    }
    return [];
  }, [periodsForDay]);

  const assignments = matrix?.assignments || {};

  const subtitle = useMemo(() => {
    const routineName = matrix?.routine?.name || routineMeta?.name || '';
    if (!routineName) return '';
    return routineName;
  }, [matrix, routineMeta]);

  const rowIndexes = useMemo(
    () => Array.from({ length: maxRows }, (_, i) => i),
    [maxRows],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Class Schedule</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.comboBtn}
          onPress={() => setClassDropdownOpen(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.comboText} numberOfLines={1}>
            {selectedClassLabel}
          </Text>
          <Text style={styles.comboChevron}>▾</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={onRefresh}
          activeOpacity={0.85}
        >
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Loading */}
      {loading ? (
        <View style={{ paddingTop: 30 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {!selectedClassGroupId ? (
            <Text style={styles.emptyText}>Please select a class.</Text>
          ) : !matrix?.routine?.id ? (
            <Text style={styles.emptyText}>
              No routine assigned for this class.
            </Text>
          ) : maxRows === 0 ? (
            <Text style={styles.emptyText}>No day template periods found.</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.grid}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                  <View style={[styles.cornerCell]} />
                  {DAY_ORDER.map(day => (
                    <View
                      key={day}
                      style={[
                        styles.dayHeaderCell,
                        { backgroundColor: DAY_COLORS[day] },
                      ]}
                    >
                      <Text style={styles.dayHeaderText}>{DAY_LABEL[day]}</Text>
                    </View>
                  ))}
                </View>

                <FlatList
                  data={rowIndexes}
                  keyExtractor={i => String(i)}
                  scrollEnabled={false}
                  renderItem={({ item: rowIdx }) => {
                    const left = leftPeriods[rowIdx];
                    const leftLabel = left?.label || `Period ${rowIdx + 1}`;
                    const leftTime = left ? prettyTimeRange(left) : '';

                    return (
                      <View style={styles.row}>
                        <View style={styles.leftCell}>
                          <Text style={styles.leftCellTitle} numberOfLines={1}>
                            {leftLabel}
                          </Text>
                          {leftTime ? (
                            <Text style={styles.leftCellTime} numberOfLines={1}>
                              {leftTime}
                            </Text>
                          ) : null}
                        </View>

                        {DAY_ORDER.map(day => {
                          const periods = periodsForDay[day] || [];
                          const p = periods[rowIdx];

                          if (!p) {
                            return (
                              <View
                                key={`${day}_${rowIdx}`}
                                style={styles.cell}
                              >
                                <View style={[styles.card, styles.cardEmpty]}>
                                  <Text style={styles.cardEmptyText}>—</Text>
                                </View>
                              </View>
                            );
                          }

                          // If Break, show Break card
                          const key = `${day}_${p.period_order}`;
                          const a = assignments[key];

                          const course = a?.course_name || '—';
                          const teacher = a?.teacher_name || '—';
                          const time = prettyTimeRange(p);

                          const isBreak = isBreakLabel(p.label) && !a;

                          if (isBreak) {
                            return (
                              <View
                                key={`${day}_${rowIdx}`}
                                style={styles.cell}
                              >
                                <View style={[styles.card, styles.cardBreak]}>
                                  <Text style={styles.cardBadge}>⏸</Text>
                                  <Text style={styles.cardTitle}>
                                    {p.label}
                                  </Text>
                                  <Text style={styles.cardSub}>{time}</Text>
                                </View>
                              </View>
                            );
                          }

                          return (
                            <View key={`${day}_${rowIdx}`} style={styles.cell}>
                              <View
                                style={[
                                  styles.card,
                                  { backgroundColor: DAY_COLORS[day] },
                                ]}
                              >
                                <Text style={styles.cardBadge}>
                                  P{p.period_order}
                                </Text>

                                <Text
                                  style={styles.cardTitle}
                                  numberOfLines={2}
                                >
                                  {course}
                                </Text>

                                <Text
                                  style={styles.cardSub}
                                  numberOfLines={2}
                                  ellipsizeMode="tail"
                                >
                                  {teacher}
                                </Text>

                                {time ? (
                                  <Text
                                    style={styles.cardTime}
                                    numberOfLines={1}
                                  >
                                    {time}
                                  </Text>
                                ) : null}
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    );
                  }}
                />
              </View>
            </ScrollView>
          )}
        </ScrollView>
      )}

      {/* Class dropdown modal */}
      <Modal
        visible={classDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setClassDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setClassDropdownOpen(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Class</Text>

            <FlatList
              data={classItems}
              keyExtractor={x => String(x.value)}
              renderItem={({ item }) => {
                const selected =
                  Number(selectedClassGroupId) === Number(item.value);
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      selected && styles.modalItemSelected,
                    ]}
                    onPress={async () => {
                      setSelectedClassGroupId(item.value);
                      setClassDropdownOpen(false);
                      setLoading(true);
                      await fetchForClass(item.value);
                      setLoading(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        selected && styles.modalItemTextSelected,
                      ]}
                    >
                      {item.section
                        ? `${item.label} (${item.section})`
                        : item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setClassDropdownOpen(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const CELL_W = 118;
const LEFT_W = 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // ✅ dark background
    paddingTop: 14,
    paddingHorizontal: 14,
  },

  title: { fontSize: 22, fontWeight: '900', color: '#fff' },
  subtitle: { marginTop: 4, color: '#CBD5E1', fontWeight: '700' },

  topBar: { flexDirection: 'row', gap: 10, marginTop: 12, marginBottom: 10 },

  // ✅ dropdown button white
  comboBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  comboText: { flex: 1, color: '#111827', fontWeight: '900' },
  comboChevron: {
    color: '#111827', // ✅ dark
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '900',
  },

  // ✅ refresh button white
  refreshBtn: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  refreshText: { color: '#111827', fontWeight: '900' }, // ✅ dark text

  errorBox: {
    backgroundColor: '#7F1D1D', // darker red to match dark theme
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  errorText: { color: '#FFE4E6', fontWeight: '800' },

  emptyText: { color: '#CBD5E1', fontWeight: '700', marginTop: 20 },

  grid: { paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'stretch', marginBottom: 10 },
  cornerCell: { width: LEFT_W, height: 44 },

  dayHeaderCell: {
    width: CELL_W,
    height: 44,
    marginRight: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155', // ✅ darker border
  },
  dayHeaderText: { fontWeight: '900', color: '#0F172A', fontSize: 14 }, // text on colored cells

  row: { flexDirection: 'row', marginBottom: 10, alignItems: 'stretch' },

  // ✅ left period label card (dark theme)
  leftCell: {
    width: LEFT_W,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: '#1F2937',
    marginRight: 10,
    justifyContent: 'center',
  },
  leftCellTitle: { fontWeight: '900', color: '#fff', fontSize: 12 },
  leftCellTime: {
    marginTop: 4,
    color: '#CBD5E1',
    fontWeight: '700',
    fontSize: 11,
  },

  cell: { width: CELL_W, marginRight: 10 },

  card: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minHeight: 96,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffffcc',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 6,
    overflow: 'hidden',
    fontSize: 11,
  },
  cardTitle: {
    fontWeight: '900',
    color: '#0F172A',
    fontSize: 12,
    lineHeight: 15,
  },
  cardSub: {
    marginTop: 4,
    color: '#111827',
    fontWeight: '800',
    fontSize: 10.5,
    lineHeight: 13,
    flexShrink: 1,
  },

  cardEmpty: { backgroundColor: '#0B1220' },
  cardEmptyText: { textAlign: 'center', color: '#94A3B8', fontWeight: '900' },

  cardBreak: { backgroundColor: '#111827' },

  // modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#0B1220',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 12,
  },

  // ✅ dropdown items: white cards on dark modal
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalItemSelected: { backgroundColor: '#E5E7EB', borderColor: '#CBD5E1' },
  modalItemText: { color: '#111827', fontWeight: '900' },
  modalItemTextSelected: { color: '#111827' },

  // ✅ close button white too
  modalClose: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalCloseText: { color: '#111827', fontWeight: '900' },

  cardTime: {
    marginTop: 3,
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 10,
    opacity: 0.85,
  },
});
