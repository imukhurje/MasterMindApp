// src/screens/AnnualAttendance.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../../api/client';
import XLSX from 'xlsx';
import RNFetchBlob from 'react-native-blob-util';
import Icon from 'react-native-vector-icons/Feather';

const BG = '#0F172A';
const CARD = '#0B1220';
const TEXT = '#E2E8F0';
const MUTED = '#94A3B8';
const BORDER = '#334155';

const MONTHS = [
  { num: 1, label: 'Jan' },
  { num: 2, label: 'Feb' },
  { num: 3, label: 'Mar' },
  { num: 4, label: 'Apr' },
  { num: 5, label: 'May' },
  { num: 6, label: 'Jun' },
  { num: 7, label: 'Jul' },
  { num: 8, label: 'Aug' },
  { num: 9, label: 'Sep' },
  { num: 10, label: 'Oct' },
  { num: 11, label: 'Nov' },
  { num: 12, label: 'Dec' },
];

const MAX_DAYS = 31;

function statusToCode(day) {
  if (!day) return '';
  const t = Number(day.total || 0);
  const p = Number(day.present || 0);
  const s = (day.status || '').toLowerCase();

  if (t > 0) {
    if (p <= 0) return 'A'; // absent
    return 'P'; // present
  }

  // 👉 Holiday / Sunday
  if (s === 'off' || s === 'holiday' || s === 'sunday') {
    return 'H'; // holiday
  }

  return '-'; // not updated
}

function codeCellStyle(code) {
  switch (code) {
    case 'H':
      // light amber background for holidays
      return { backgroundColor: '#FEF3C7' }; // tailwind amber-100
    default:
      return {};
  }
}

function codeTextStyle(code) {
  switch (code) {
    case 'P':
      return { color: '#1d4ed8', fontWeight: '700' }; // blue
    case 'A':
      return { color: '#dc2626', fontWeight: '700' }; // red
    case 'H':
      return { color: '#b45309', fontWeight: '700' }; // dark orange text
    default:
      return { color: '#111827' };
  }
}

export default function AnnualAttendance() {
  const navigation = useNavigation();
  const route = useRoute();
  const mounted = useRef(true);

  const {
    studentId,
    studentName,
    classLabel,
    classGroupId,
    year: initialYear,
  } = route.params || {};

  const [busy, setBusy] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [year] = useState(initialYear || new Date().getFullYear());
  const [rows, setRows] = useState([]); // [{ day, cells:[{code}] }]
  const [summary, setSummary] = useState({}); // { monthNum: { total, present } }

  useEffect(() => {
    mounted.current = true;
    loadAnnual();
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAnnual() {
    if (!studentId || !classGroupId) {
      Alert.alert('Attendance', 'Missing student or class information.');
      return;
    }

    try {
      setBusy(true);

      const promises = MONTHS.map(m =>
        api(
          `/api/attendance/calendar?student_id=${studentId}&year=${year}&month=${m.num}&class_group_id=${classGroupId}`,
        )
          .then(res => ({ month: m.num, days: res?.days || [] }))
          .catch(() => ({ month: m.num, days: [] })),
      );

      const results = await Promise.all(promises);
      if (!mounted.current) return;

      const monthMap = {};
      results.forEach(r => {
        monthMap[r.month] = r.days;
      });

      const newRows = [];
      const newSummary = {};

      for (let dayNum = 1; dayNum <= MAX_DAYS; dayNum += 1) {
        const cells = [];

        MONTHS.forEach(m => {
          const daysForMonth = monthMap[m.num] || [];
          const info = daysForMonth.find(d => {
            const dt = new Date(d.date);
            return dt.getDate() === dayNum;
          });

          const code = statusToCode(info);
          cells.push({ code });

          if (!newSummary[m.num]) {
            newSummary[m.num] = { total: 0, present: 0 };
          }
          if (info) {
            const t = Number(info.total || 0);
            const p = Number(info.present || 0);
            newSummary[m.num].total += t;
            newSummary[m.num].present += p;
          }
        });

        newRows.push({ day: dayNum, cells });
      }

      setRows(newRows);
      setSummary(newSummary);
    } catch (e) {
      if (mounted.current) {
        Alert.alert('Error', e?.message || 'Failed to load annual attendance.');
      }
    } finally {
      if (mounted.current) setBusy(false);
    }
  }

  function renderSummaryValue(monthNum, kind) {
    const s = summary[monthNum] || { total: 0, present: 0 };
    const total = s.total || 0;
    const present = s.present || 0;
    const absent = total - present;

    if (kind === 'total') return total ? total.toFixed(0) : '';
    if (kind === 'present') return present ? present.toFixed(2) : '';
    if (kind === 'absent') return total ? absent.toFixed(2) : '';
    if (kind === 'percent') {
      if (!total) return '';
      const pct = (present / total) * 100;
      return `${pct.toFixed(0)}%`;
    }
    return '';
  }

  // Export to XLSX (unchanged)
  const handleExportXls = async () => {
    try {
      setExporting(true);

      const matrix = [];
      matrix.push(['Day', ...MONTHS.map(m => m.label)]);

      rows.forEach(r => {
        matrix.push([r.day, ...r.cells.map(c => c.code || '')]);
      });

      matrix.push([]);

      const summaryRows = [
        { key: 'total', label: 'Total' },
        { key: 'present', label: 'Pres.' },
        { key: 'absent', label: 'Abs.' },
        { key: 'percent', label: '%' },
      ];

      summaryRows.forEach(meta => {
        matrix.push([
          meta.label,
          ...MONTHS.map(m => renderSummaryValue(m.num, meta.key)),
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(matrix);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

      const safeName = (studentName || 'student')
        .replace(/\s+/g, '_')
        .replace(/[^A-Za-z0-9_]/g, '');
      const fileName = `attendance_${safeName}_${year}.xlsx`;

      const { fs, android, ios } = RNFetchBlob;
      const baseDir =
        Platform.OS === 'android'
          ? fs.dirs.DownloadDir || fs.dirs.DocumentDir
          : fs.dirs.DocumentDir;

      const path = `${baseDir}/${fileName}`;

      await fs.writeFile(path, wbout, 'base64');

      if (Platform.OS === 'android' && android?.actionViewIntent) {
        android.actionViewIntent(
          path,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
      } else if (Platform.OS === 'ios' && ios?.openDocument) {
        ios.openDocument(path);
      } else {
        Alert.alert('Download complete', `Saved to:\n${path}`);
      }
    } catch (e) {
      Alert.alert(
        'Export failed',
        e?.message || 'Could not export attendance.',
      );
    } finally {
      setExporting(false);
    }
  };

  if (busy) {
    return (
      <View style={styles.busyWrap}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance</Text>

        <Pressable
          onPress={handleExportXls}
          disabled={exporting}
          style={({ pressed }) => [
            styles.downloadBtn,
            (pressed || exporting) && { opacity: 0.7 },
          ]}
        >
          {exporting ? (
            <ActivityIndicator size="small" color={TEXT} />
          ) : (
            <Icon name="download" color={TEXT} size={24} />
          )}
        </Pressable>
      </View>

      {/* Student line */}
      <View style={styles.studentBar}>
        <Text style={styles.studentText}>
          {studentName ? studentName.toUpperCase() : 'STUDENT'}
          {classLabel ? ` , ${classLabel}` : ''}
        </Text>
      </View>

      {/* Table card – vertical scroll only */}
      <View style={styles.cardOuter}>
        <ScrollView
          nestedScrollEnabled
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          {/* Header row: Day + months */}
          <View style={[styles.row, styles.headerRow]}>
            <View style={[styles.cell, styles.cornerCell]}>
              <Text style={styles.headerCellText} numberOfLines={1}>
                Day
              </Text>
            </View>
            {MONTHS.map(m => (
              <View key={`h-${m.num}`} style={[styles.cell, styles.headerCell]}>
                <Text style={styles.headerCellText}>{m.label}</Text>
              </View>
            ))}
          </View>

          {/* Body rows: day 1–31 */}
          {rows.map(r => (
            <View key={`day-${r.day}`} style={styles.row}>
              <View style={[styles.cell, styles.dayHeaderCell]}>
                <Text style={styles.dayHeaderText}>{r.day}</Text>
              </View>
              {r.cells.map((c, idx) => (
                <View
                  key={`c-${r.day}-${idx}`}
                  style={[styles.cell, styles.bodyCell, codeCellStyle(c.code)]}
                >
                  <Text style={[styles.bodyText, codeTextStyle(c.code)]}>
                    {c.code || ''}
                  </Text>
                </View>
              ))}
            </View>
          ))}

          {/* Summary rows */}
          {[
            { key: 'total', label: 'Total' },
            { key: 'present', label: 'Pres.' },
            { key: 'absent', label: 'Abs.' },
            { key: 'percent', label: '%' },
          ].map(rowMeta => (
            <View
              key={`sum-${rowMeta.key}`}
              style={[styles.row, styles.summaryRow]}
            >
              <View style={[styles.cell, styles.summaryHeaderCell]}>
                <Text style={styles.summaryHeaderText}>{rowMeta.label}</Text>
              </View>
              {MONTHS.map(m => (
                <View
                  key={`sum-${rowMeta.key}-${m.num}`}
                  style={[styles.cell, styles.summaryCell]}
                >
                  <Text style={styles.summaryText}>
                    {renderSummaryValue(m.num, rowMeta.key)}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <Text style={[styles.legendSwatch, { backgroundColor: '#1d4ed8' }]} />
          <Text style={styles.legendText}>Present (P)</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={[styles.legendSwatch, { backgroundColor: '#dc2626' }]} />
          <Text style={styles.legendText}>Absent (A)</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={[styles.legendSwatch, { backgroundColor: '#FEF3C7' }]} />
          <Text style={styles.legendText}>Holiday (H)</Text>
        </View>

        <View style={styles.legendItem}>
          <Text style={[styles.legendSwatch, { backgroundColor: '#9ca3af' }]} />
          <Text style={styles.legendText}>Not Updated (-)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  busyWrap: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '800',
  },
  downloadBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentBar: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
  },
  studentText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 13,
  },
  cardOuter: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1, // 👈 share width across 13 columns
    height: 32,
    borderWidth: 1,
    borderColor: '#9ca3af',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  headerRow: {
    backgroundColor: '#e5e7eb',
  },
  cornerCell: {
    backgroundColor: '#e5e7eb',
    flex: 0.8, // slightly narrower "Day" column
  },
  headerCell: {
    backgroundColor: '#e5e7eb',
  },
  headerCellText: {
    fontWeight: '700',
    fontSize: 11,
    color: '#111827',
  },
  dayHeaderCell: {
    backgroundColor: '#e5e7eb',
    flex: 0.8, // same width as Day header
  },
  dayHeaderText: {
    fontWeight: '700',
    fontSize: 11,
    color: '#111827',
  },
  bodyCell: {
    backgroundColor: '#ffffff',
  },
  bodyText: {
    fontSize: 11,
  },
  summaryRow: {
    backgroundColor: '#f3f4f6',
  },
  summaryHeaderCell: {
    backgroundColor: '#e5e7eb',
    flex: 0.8,
  },
  summaryHeaderText: {
    fontWeight: '700',
    fontSize: 11,
    color: '#111827',
  },
  summaryCell: {
    backgroundColor: '#f9fafb',
  },
  summaryText: {
    fontSize: 10,
    color: '#111827',
    fontWeight: '600',
  },
  legendRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    color: MUTED,
    fontSize: 12,
  },
});
