import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

function highlight(exam) {
  try {
    const now = Date.now();
    const start = exam?.starts_at ? Date.parse(exam.starts_at) : NaN;
    const end = exam?.ends_at ? Date.parse(exam.ends_at) : NaN;

    // ✅ Live: now between start and end
    if (isFinite(start) && isFinite(end) && now >= start && now <= end) {
      return 'live';
    }

    // existing "soon" logic
    if (!isFinite(start)) return 'normal';
    const diffMin = Math.round((start - now) / 60000);
    if (diffMin >= 0 && diffMin <= 5) return 'soon5';
    if (diffMin > 5 && diffMin <= 24 * 60) return 'soon24';
  } catch {}
  return 'normal';
}

function fmtDT(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso || '';
  }
}

function humanDuration(starts, ends, isTL) {
  try {
    const a = starts ? new Date(starts).getTime() : NaN;
    const b = ends ? new Date(ends).getTime() : NaN;
    if (!isFinite(a) || !isFinite(b)) return '';
    const mins = Math.max(0, Math.round((b - a) / 60000));
    if (!isTL) return 'Open window';
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60),
      m = mins % 60;
    return `${h} hr${h > 1 ? 's' : ''}${m ? ` ${m} min` : ''}`;
  } catch {
    return '';
  }
}

const ExamCard = memo(function ExamCard({ exam, role, onPress }) {
  const hi = highlight(exam);
  return (
    <Pressable
      style={[
        styles.card,
        hi === 'live' && styles.live,
        hi === 'soon5' && styles.soon5,
        hi === 'soon24' && styles.soon24,
      ]}
      onPress={() => onPress?.(exam)}
    >
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={2}>
          {exam.name || 'Untitled exam'}
        </Text>
        <View style={styles.kpiRow}>
          {Number.isFinite(exam?.questions_count) && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>Q: {exam.questions_count}</Text>
            </View>
          )}
          {exam?.status ? (
            <View style={[styles.pill, { marginLeft: 6 }]}>
              <Text style={styles.pillText}>{exam.status}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={[styles.row, { marginTop: 6 }]}>
        <Text style={styles.muted} numberOfLines={1}>
          {exam.course_title || ''}
        </Text>
        <Text style={styles.muted} numberOfLines={1}>
          {exam.class_name || ''}
        </Text>
      </View>

      {String(role).toLowerCase() === 'parent' &&
        Array.isArray(exam.wards) &&
        exam.wards.length > 0 && (
          <View
            style={{ marginTop: 6, flexDirection: 'row', flexWrap: 'wrap' }}
          >
            <View style={[styles.pill, { marginRight: 6 }]}>
              <Text style={styles.pillText}>
                Ward{exam.wards.length > 1 ? 's' : ''}
              </Text>
            </View>
            {exam.wards.map((w, i) => (
              <View
                key={`${w}-${i}`}
                style={[
                  styles.pill,
                  { backgroundColor: '#0f172a', marginRight: 6, marginTop: 4 },
                ]}
              >
                <Text style={styles.pillText}>{w}</Text>
              </View>
            ))}
          </View>
        )}

      <View style={{ marginTop: 8 }}>
        <Text style={styles.bold}>
          {fmtDT(exam.starts_at)} — {fmtDT(exam.ends_at)}
        </Text>
        <Text style={styles.muted}>
          {humanDuration(exam.starts_at, exam.ends_at, exam.is_time_limited)}
        </Text>
      </View>
    </Pressable>
  );
});

export default ExamCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderColor: '#1f2937',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  soon5: { backgroundColor: '#2b1114', borderColor: '#7f1d1d' },
  soon24: { backgroundColor: '#191218', borderColor: '#5b2730' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#e2e8f0',
    fontWeight: '800',
    fontSize: 16,
    flex: 1,
    paddingRight: 12,
  },
  kpiRow: { flexDirection: 'row', alignItems: 'center' },
  pill: {
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  pillText: { color: '#cbd5e1', fontSize: 12 },
  muted: { color: '#94a3b8' },
  bold: { color: '#e2e8f0', fontWeight: '700' },
  live: { backgroundColor: '#0b2a1a', borderColor: '#16a34a' },
});
