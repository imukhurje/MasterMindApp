// src/screens/Marksheet.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api, absoluteUrl } from './../../api/client';

const BG = '#0F172A';
const CARD = '#0B1220';
const TEXT = '#FFFFFF';
const MUTED = '#94A3B8';
const BORDER = '#1F2937';

function toNum(v) {
  const n =
    typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function getSetting(items, key, fallback = '') {
  const it = (items || []).find(x => x?.key === key);
  return it?.value ?? fallback;
}

export default function Marksheet() {
  const navigation = useNavigation();
  const route = useRoute();
  const mounted = useRef(true);

  // Expecting: examId, studentId, examName (optional)
  const examId = route?.params?.examId;
  const studentId = route?.params?.studentId;
  const examNameFromNav = route?.params?.examName;

  const [busy, setBusy] = useState(true);
  const [settings, setSettings] = useState([]);
  const [student, setStudent] = useState(null);
  const [extraKeys, setExtraKeys] = useState([]);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, studentId]);

  const load = async () => {
    try {
      setBusy(true);

      if (!examId || !studentId) {
        throw new Error('Missing examId or studentId.');
      }

      // 1) school settings
      const s = await api('/api/settings/v1/declared');

      // 2) marksheet data
      const m = await api(
        `/api/examinations/v1/${examId}/marksheets?student_id=${studentId}`,
      );

      if (!mounted.current) return;

      setSettings(Array.isArray(s?.items) ? s.items : []);

      const stu = m?.data?.students?.[0] || null;
      setStudent(stu);

      const keys = Array.isArray(m?.data?.extra_keys) ? m.data.extra_keys : [];
      setExtraKeys(keys);
    } catch (e) {
      if (!mounted.current) return;
      Alert.alert('Marksheet', e?.message || 'Failed to load marksheet.');
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  const schoolName = useMemo(
    () => getSetting(settings, '__SCHOOL_NAME__', 'School Name'),
    [settings],
  );
  const schoolAddress = useMemo(
    () => getSetting(settings, '__SCHOOL_ADDRESS__', ''),
    [settings],
  );

  const examTitle =
    examNameFromNav || route?.params?.examination_name || 'Examination';

  const courses = student?.courses || [];

  // Table calculations
  const rows = useMemo(() => {
    return courses.map(c => {
      const examMark = toNum(c?.exam_mark);
      const maxExamMark = toNum(c?.max_exam_mark);

      const extras = c?.extras || {};
      const maxExtras = c?.max_extras || {};

      const extraSum = extraKeys.reduce(
        (acc, k) => acc + toNum(extras?.[k]),
        0,
      );
      const maxExtraSum = extraKeys.reduce(
        (acc, k) => acc + toNum(maxExtras?.[k]),
        0,
      );

      const total = examMark + extraSum;
      const maxTotal = maxExamMark + maxExtraSum;

      return {
        course_id: c?.course_id,
        course_title: c?.course_title,
        examMark,
        maxExamMark,
        extras,
        maxExtras,
        total,
        maxTotal,
      };
    });
  }, [courses, extraKeys]);

  const grandTotal = useMemo(
    () => rows.reduce((a, r) => a + r.total, 0),
    [rows],
  );
  const grandMaxTotal = useMemo(
    () => rows.reduce((a, r) => a + r.maxTotal, 0),
    [rows],
  );

  if (busy && !student) {
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
      {/* Top Bar */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Pressable
          onPress={load}
          style={({ pressed }) => ({
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 10,
            backgroundColor: pressed ? '#1f2937' : '#334155',
            borderWidth: 1,
            borderColor: '#1F2937',
          })}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>
            Refresh
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      >
        {/* Header Center (logo + school info) */}
        <View style={{ alignItems: 'center', marginTop: 6, marginBottom: 18 }}>
          {/* Simple logo placeholder */}
          <View
            style={{
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Image
              source={{ uri: absoluteUrl('/images/logo.png') }}
              style={{ width: 50, height: 50, resizeMode: 'contain' }}
            />
          </View>

          <Text
            style={{
              color: TEXT,
              fontWeight: '900',
              fontSize: 16,
              marginTop: 10,
            }}
          >
            {schoolName}
          </Text>
          {schoolAddress ? (
            <Text
              style={{
                color: MUTED,
                fontWeight: '700',
                fontSize: 12,
                marginTop: 2,
              }}
            >
              {schoolAddress}
            </Text>
          ) : null}

          <Text
            style={{
              color: TEXT,
              fontWeight: '800',
              fontSize: 14,
              marginTop: 10,
            }}
          >
            {examTitle}
          </Text>
          <Text
            style={{
              color: TEXT,
              fontWeight: '800',
              fontSize: 14,
              marginTop: 2,
            }}
          >
            Marksheet
          </Text>
        </View>

        {/* Student Info (left/right like screenshot) */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <View style={{ gap: 6 }}>
            <Text style={{ color: MUTED, fontWeight: '800', fontSize: 12 }}>
              Roll Number
            </Text>
            <Text style={{ color: TEXT, fontWeight: '900', fontSize: 14 }}>
              {student?.roll_no || '-'}
            </Text>

            <Text
              style={{
                color: MUTED,
                fontWeight: '800',
                fontSize: 12,
                marginTop: 8,
              }}
            >
              Class
            </Text>
            <Text style={{ color: TEXT, fontWeight: '900', fontSize: 14 }}>
              {student?.class_group?.name || '-'}
            </Text>
          </View>

          <View style={{ alignItems: 'center', gap: 6 }}>
            <Text style={{ color: MUTED, fontWeight: '800', fontSize: 12 }}>
              Name
            </Text>
            <Text style={{ color: TEXT, fontWeight: '900', fontSize: 14 }}>
              {student?.name || '-'}
            </Text>
          </View>
        </View>

        {/* Table */}
        <View
          style={{
            borderWidth: 1,
            borderColor: BORDER,
            borderRadius: 0,
            overflow: 'hidden',
          }}
        >
          {/* Header Row */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#0b1220',
              borderBottomWidth: 1,
              borderBottomColor: BORDER,
            }}
          >
            <CellHeader flex={2.2} label="Course" align="left" />
            <CellHeader flex={1.2} label="Exam Mark" align="right" />
            {extraKeys.map(k => (
              <CellHeader key={k} flex={1.1} label={k} align="right" />
            ))}
            <CellHeader flex={1.2} label="Total" align="right" />
          </View>

          {/* Body Rows */}
          {rows.map((r, idx) => (
            <View
              key={`${r.course_id || idx}`}
              style={{
                flexDirection: 'row',
                borderBottomWidth: idx === rows.length - 1 ? 0 : 1,
                borderBottomColor: BORDER,
              }}
            >
              <Cell
                flex={2.2}
                align="left"
                text={r.course_title || '-'}
                strong
              />
              <Cell
                flex={1.2}
                align="right"
                text={`${r.examMark} (${r.maxExamMark})`}
              />
              {extraKeys.map(k => (
                <Cell
                  key={k}
                  flex={1.1}
                  align="right"
                  text={`${toNum(r.extras?.[k])} (${toNum(r.maxExtras?.[k])})`}
                />
              ))}
              <Cell
                flex={1.2}
                align="right"
                text={`${r.total} (${r.maxTotal})`}
                strong
              />
            </View>
          ))}

          {/* Grand Total Row */}
          <View
            style={{
              flexDirection: 'row',
              borderTopWidth: 1,
              borderTopColor: BORDER,
            }}
          >
            <View
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 12,
                alignItems: 'flex-end',
              }}
            >
              <Text style={{ color: TEXT, fontWeight: '900', fontSize: 14 }}>
                Grand Total: {grandTotal}
              </Text>
              <Text
                style={{
                  color: MUTED,
                  fontWeight: '700',
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                Max: {grandMaxTotal}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function CellHeader({ flex = 1, label, align = 'left' }) {
  return (
    <View style={{ flex, paddingVertical: 10, paddingHorizontal: 12 }}>
      <Text
        style={{
          color: TEXT,
          fontWeight: '900',
          fontSize: 13,
          textAlign: align,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function Cell({ flex = 1, text, align = 'left', strong = false }) {
  return (
    <View style={{ flex, paddingVertical: 10, paddingHorizontal: 12 }}>
      <Text
        style={{
          color: TEXT,
          fontWeight: strong ? '900' : '700',
          fontSize: 13,
          textAlign: align,
        }}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
}
