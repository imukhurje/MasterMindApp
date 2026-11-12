import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { api, absoluteUrl, getToken } from '../../api/client';
import RNBlobUtil from 'react-native-blob-util';

const BG = '#0E172A';
const TEXT = '#E2E8F0';
const MUTED = '#94A3B8';
const CARD = '#1E293B';
const BORDER = '#334155';
const BLUE = '#3B82F6';

const RANGE_OPTIONS = [
  { key: 'this_week', label: 'This Week' },
  { key: 'mtd', label: 'Month to Date' },
  { key: 'ytd', label: 'Year to Date' },
  { key: 'last_month', label: 'Last Month' },
];

const MIME_XLSX =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export default function AttendanceReports({ route }) {
  const initialClasses = route?.params?.classes || [];
  const initialDefaultClassId = route?.params?.defaultClassId || null;
  const initialDefaultRange = route?.params?.defaultRange || 'this_week';

  const [classes, setClasses] = useState(initialClasses);
  const [classId, setClassId] = useState(initialDefaultClassId);
  const [rangeKey, setRangeKey] = useState(initialDefaultRange);

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const [classPickerOpen, setClassPickerOpen] = useState(false);
  const [rangePickerOpen, setRangePickerOpen] = useState(false);

  const selectedClass = useMemo(
    () => classes.find(c => c.id === classId) || null,
    [classes, classId],
  );

  const fetchMetaIfNeeded = async () => {
    if (classes?.length) {
      if (!classId) setClassId(classes?.[0]?.id || null);
      return;
    }
    try {
      const metaRes = await api('/api/attendance/meta');
      const cls = metaRes.classes || [];
      setClasses(cls);
      setClassId(cls?.[0]?.id || null);
    } catch (e) {
      console.log('meta fetch failed', e);
    }
  };

  const fetchReport = async () => {
    if (!classId) return;

    setLoading(true);
    try {
      const res = await api(
        `/api/attendance/reports?class_group_id=${classId}&range=${rangeKey}`,
      );
      setReport(res);
    } catch (e) {
      console.log('report fetch failed', e);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetaIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (classId) fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, rangeKey]);

  const subtitle = useMemo(() => {
    if (!report) {
      const cls = selectedClass?.label || 'Select Class';
      const r = RANGE_OPTIONS.find(x => x.key === rangeKey)?.label || '';
      return `${cls} · ${r}`;
    }
    return `${report.class_label} · ${report.range_label}: ${report.range_from} to ${report.range_to}`;
  }, [report, selectedClass, rangeKey]);

  const downloadReport = async () => {
    if (!classId) {
      Alert.alert('Download', 'Please select a class first.');
      return;
    }

    const url = absoluteUrl(
      `/api/attendance/reports.xlsx?class_group_id=${classId}&range=${rangeKey}`,
    );

    const filename = `attendance_${classId}_${rangeKey}_${Date.now()}.xlsx`;
    const token = await getToken(); // same token your api() uses

    try {
      if (Platform.OS === 'android') {
        const downloadPath = `${RNBlobUtil.fs.dirs.DownloadDir}/${filename}`;

        await RNBlobUtil.config({
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: downloadPath,
            title: filename,
            description: 'Attendance report',
            mime: MIME_XLSX,
            mediaScannable: true,
          },
        }).fetch('GET', url, token ? { Authorization: `Bearer ${token}` } : {});

        Alert.alert('Downloaded', `Saved to Downloads: ${filename}`);
        return;
      }

      // iOS: save in Documents (later you can share to Files)
      const docPath = `${RNBlobUtil.fs.dirs.DocumentDir}/${filename}`;

      await RNBlobUtil.config({ path: docPath, fileCache: true }).fetch(
        'GET',
        url,
        token ? { Authorization: `Bearer ${token}` } : {},
      );

      Alert.alert('Downloaded', 'Saved inside app documents.');
    } catch (e) {
      console.log('download error', e);
      Alert.alert('Download', 'Failed to download report.');
    }
  };

  // ✅ Mobile header (stacked controls)
  const renderHeader = () => (
    <View style={styles.headerWrap}>
      <View style={styles.controlsWrap}>
        {/* Class */}
        <View style={styles.control}>
          <Text style={styles.controlLabel}>Class</Text>
          <TouchableOpacity
            style={styles.select}
            onPress={() => setClassPickerOpen(true)}
          >
            <Text style={styles.selectText}>
              {selectedClass?.label || report?.class_label || 'Select'}
            </Text>
            <Text style={styles.chev}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Date Range */}
        <View style={styles.control}>
          <Text style={styles.controlLabel}>Date Range</Text>
          <TouchableOpacity
            style={styles.select}
            onPress={() => setRangePickerOpen(true)}
          >
            <Text style={styles.selectText}>
              {RANGE_OPTIONS.find(r => r.key === rangeKey)?.label ||
                'This Week'}
            </Text>
            <Text style={styles.chev}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Summary + Download */}
        <View style={styles.summaryCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>
              Total classes (excl. weekends/holidays)
            </Text>
            <Text style={styles.summaryValue}>
              {report?.total_classes ?? 0}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.downloadBtnMobile}
            onPress={downloadReport}
          >
            <Text style={styles.downloadText}>Download Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );

  // ✅ Mobile row card (no table columns)
  const renderRow = ({ item }) => (
    <View style={styles.studentCard}>
      <View style={styles.studentTop}>
        <Text style={styles.studentName} numberOfLines={1}>
          {item.name ?? '-'}
        </Text>
        <Text style={styles.studentRoll}>Roll: {item.roll_no ?? ' '}</Text>
      </View>

      <View style={styles.kvRow}>
        <Text style={styles.kLabel}>Class Section</Text>
        <Text style={styles.kValue}>{item.class_section ?? '-'}</Text>
      </View>

      <View style={styles.kvRow}>
        <Text style={styles.kLabel}>Attended Classes</Text>
        <Text style={styles.kValue}>{item.attended_classes ?? 0}</Text>
      </View>

      <View style={styles.kvRow}>
        <Text style={styles.kLabel}>Attendance</Text>
        <Text style={styles.kValueStrong}>
          {(item.attendance_percent ?? 0) + '%'}
        </Text>
      </View>
    </View>
  );

  const rows = report?.rows || [];

  return (
    <View style={styles.screen}>
      {renderHeader()}
      <View style={styles.listArea}>
        {loading && !report ? (
          <View style={{ padding: 16 }}>
            <ActivityIndicator color={TEXT} />
          </View>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(it, idx) => String(it.student_id || idx)}
            renderItem={renderRow}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              loading ? (
                <View style={{ padding: 16 }}>
                  <ActivityIndicator color={TEXT} />
                </View>
              ) : (
                <View style={{ padding: 16 }}>
                  <Text style={{ color: MUTED }}>No students / no data.</Text>
                </View>
              )
            }
          />
        )}
      </View>

      {/* Class picker */}
      <Modal visible={classPickerOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setClassPickerOpen(false)}
        >
          <View style={styles.pickerCard}>
            {classes.map(c => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.pickerItem,
                  classId === c.id && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  setClassId(c.id);
                  setClassPickerOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerText,
                    classId === c.id && styles.pickerTextSelected,
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Range picker */}
      <Modal visible={rangePickerOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setRangePickerOpen(false)}
        >
          <View style={styles.pickerCard}>
            {RANGE_OPTIONS.map(r => (
              <TouchableOpacity
                key={r.key}
                style={[
                  styles.pickerItem,
                  rangeKey === r.key && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  setRangeKey(r.key);
                  setRangePickerOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerText,
                    rangeKey === r.key && styles.pickerTextSelected,
                  ]}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },

  listArea: {
    flex: 1, // ✅ takes remaining height
    paddingHorizontal: 16, // match your UI spacing
    paddingTop: 10,
  },

  listContent: {
    paddingBottom: 24,
  },

  panel: {
    flex: 1,
    backgroundColor: BG, // same as screen background
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    overflow: 'visible',
  },

  headerWrap: {
    paddingHorizontal: 16,
    paddingTop: 1,
    paddingBottom: 8,
  },

  // ✅ Mobile controls stack
  controlsWrap: {
    gap: 12,
  },

  control: { width: '100%' },
  controlLabel: { color: MUTED, fontSize: 12, marginBottom: 8 },

  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  selectText: { color: TEXT, fontSize: 14, fontWeight: '700' },
  chev: { color: MUTED, fontSize: 12 },

  // ✅ Summary card
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },

  summaryTitle: {
    color: MUTED,
    fontSize: 12,
  },

  summaryValue: {
    color: TEXT,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },

  downloadBtnMobile: {
    backgroundColor: '#2B364A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },

  downloadText: { color: TEXT, fontSize: 13, fontWeight: '700' },

  subtitle: { marginTop: 12, color: MUTED, fontSize: 12 },

  // ✅ Student mobile card
  studentCard: {
    marginHorizontal: 5,
    marginBottom: 12,
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
  },

  studentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },

  studentName: {
    flex: 1,
    color: TEXT,
    fontSize: 15,
    fontWeight: '800',
  },

  studentRoll: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '700',
  },

  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#1F2A3A',
  },

  kLabel: {
    color: MUTED,
    fontSize: 12,
  },

  kValue: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '700',
  },

  kValueStrong: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 24,
  },
  pickerCard: {
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  pickerItemSelected: { backgroundColor: BLUE },
  pickerText: { color: TEXT, fontSize: 14 },
  pickerTextSelected: { color: '#fff', fontWeight: '900' },
});
