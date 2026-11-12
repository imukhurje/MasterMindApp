// src/screens/ExamsScreen.js

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { api } from '../../api/client';
import styles, { COLORS } from './ExamsScreen.styles';

const { BG, TEXT, MUTED, BORDER, CARD, PRIMARY } = COLORS;

function formatExamDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatFilterDate(date) {
  if (!date) {
    return 'dd-mm-yyyy';
  }

  const day = String(date.getDate()).padStart(2, '0');

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function getClassLabel(exam) {
  const firstClass =
    Array.isArray(exam?.class_groups) && exam.class_groups.length > 0
      ? exam.class_groups[0]
      : null;

  if (firstClass?.label) {
    return firstClass.label;
  }

  if (firstClass?.name && firstClass?.section) {
    return `${firstClass.name} (${firstClass.section})`;
  }

  return exam?.class_name || firstClass?.name || '';
}

function getExamTimeState(exam, nowMs) {
  const startMs = exam?.starts_at ? Date.parse(exam.starts_at) : NaN;

  const endMs = exam?.ends_at ? Date.parse(exam.ends_at) : NaN;

  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) {
    return 'normal';
  }

  // Exam is currently running.
  if (nowMs >= startMs && nowMs < endMs) {
    return 'active';
  }

  // Exam will start within the next 30 minutes.
  const timeToStart = startMs - nowMs;
  const thirtyMinutes = 30 * 60 * 1000;

  if (timeToStart > 0 && timeToStart <= thirtyMinutes) {
    return 'starting_soon';
  }

  if (nowMs >= endMs) {
    return 'past';
  }

  return 'normal';
}

function ExamListCard({ exam, onPress, isPast, nowMs }) {
  const classLabel = getClassLabel(exam);

  const timeState = getExamTimeState(exam, nowMs);

  const isActive = timeState === 'active';

  const isStartingSoon = timeState === 'starting_soon';

  return (
    <Pressable
      onPress={() => onPress(exam)}
      style={({ pressed }) => [
        styles.examCard,

        // isStartingSoon && styles.examCardStartingSoon,

        // isActive && styles.examCardActive,

        pressed && styles.examCardPressed,
      ]}
    >
      {isActive ? (
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />

          <Text style={styles.liveBadgeText}>LIVE NOW</Text>
        </View>
      ) : isStartingSoon ? (
        <View style={styles.startingSoonBadge}>
          <Text style={styles.startingSoonBadgeText}>STARTING SOON</Text>
        </View>
      ) : null}
      <View style={styles.examTopRow}>
        <View style={styles.examTitleArea}>
          <Text style={styles.examTitle} numberOfLines={2}>
            {exam?.name || 'Exam'}
          </Text>

          {!!exam?.course_title && (
            <Text style={styles.examCourse} numberOfLines={1}>
              {exam.course_title}
            </Text>
          )}
        </View>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Questions: {Number(exam?.questions_count || 0)}
            </Text>
          </View>

          {exam?.is_online ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Online</Text>
            </View>
          ) : null}

          {!!exam?.status && (
            <View style={[styles.badge, isPast && styles.pastStatusBadge]}>
              <Text style={[styles.badgeText, isPast && styles.pastStatusText]}>
                {exam.status}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.examMetaRow}>
        <Text style={styles.examTime} numberOfLines={2}>
          {formatExamDate(exam?.starts_at)}
          {' — '}
          {formatExamDate(exam?.ends_at)}
        </Text>

        {!!classLabel && (
          <Text style={styles.examClass} numberOfLines={1}>
            {classLabel}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export default function ExamsScreen({ navigation }) {
  const [role, setRole] = useState('user');

  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(null);

  const [searchText, setSearchText] = useState('');

  const [fromDate, setFromDate] = useState(null);

  const [toDate, setToDate] = useState(null);

  const [showFromPicker, setShowFromPicker] = useState(false);

  const [showToPicker, setShowToPicker] = useState(false);

  const [nowMs, setNowMs] = useState(Date.now());

  const fetchExams = useCallback(async () => {
    setError(null);

    try {
      const res = await api('/api/exams?window_days=30');

      setRole(String(res?.role || 'user').toLowerCase());

      setExams(Array.isArray(res?.exams) ? res.exams : []);
    } catch (e) {
      setError(e?.message || 'Failed to load exams');

      setExams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchExams();
  }, [fetchExams]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 30 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await fetchExams();
    } finally {
      setRefreshing(false);
    }
  }, [fetchExams]);

  const onOpenExam = useCallback(
    async exam => {
      if (!exam?.id) {
        return;
      }

      try {
        const examId = exam.id;

        // First get the hall state.
        const hallState = await api(
          `/api/exams/${encodeURIComponent(examId)}/hall/state?index=1`,
        );

        const attemptId = hallState?.attempt?.id ?? null;

        const ended = hallState?.ended === true;

        const reviewAvailable = hallState?.review_available === true;

        console.log('Exam hall state:', hallState);

        // Completed exam -> open evaluated answer sheet.
        if (ended && reviewAvailable && attemptId) {
          navigation.navigate('ExamResultDetail', {
            examId,
            attemptId,
            exam,
          });

          return;
        }

        // Exam has ended but result/review is not available.
        if (ended) {
          Alert.alert(
            'Exam ended',
            'This exam has ended, but the evaluated answer sheet is not available yet.',
          );

          return;
        }

        const secondsToStart = Number(hallState?.seconds_to_start ?? 0);

        // Student may enter within 1 minutes of the start time.
        if (!hallState?.started && secondsToStart > 1 * 60) {
          Alert.alert(
            'You are too early',
            'Please revisit within 1 minutes of the start time.',
          );

          return;
        }

        // Active exam.
        navigation.navigate('ExamHall', {
          examId,
          exam,
        });
      } catch (error) {
        console.log('Open exam error:', error);

        Alert.alert('Exam', error?.message || 'Could not open the exam.');
      }
    },
    [navigation],
  );

  const filteredExams = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return exams.filter(exam => {
      const startsAt = exam?.starts_at ? new Date(exam.starts_at) : null;

      if (startsAt && Number.isNaN(startsAt.getTime())) {
        return false;
      }

      if (fromDate && startsAt) {
        const startOfFrom = new Date(fromDate);

        startOfFrom.setHours(0, 0, 0, 0);

        if (startsAt < startOfFrom) {
          return false;
        }
      }

      if (toDate && startsAt) {
        const endOfTo = new Date(toDate);

        endOfTo.setHours(23, 59, 59, 999);

        if (startsAt > endOfTo) {
          return false;
        }
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        exam?.name,
        exam?.course_title,
        exam?.class_name,
        getClassLabel(exam),
        exam?.status,
        exam?.created_by_name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [exams, searchText, fromDate, toDate]);

  const { upcomingExams, pastExams } = useMemo(() => {
    const now = Date.now();

    const upcoming = [];
    const past = [];

    filteredExams.forEach(exam => {
      const endMs = exam?.ends_at ? Date.parse(exam.ends_at) : 0;

      if (endMs && endMs < now) {
        past.push(exam);
      } else {
        upcoming.push(exam);
      }
    });

    upcoming.sort(
      (a, b) => Date.parse(a?.starts_at || 0) - Date.parse(b?.starts_at || 0),
    );

    past.sort(
      (a, b) => Date.parse(b?.starts_at || 0) - Date.parse(a?.starts_at || 0),
    );

    return {
      upcomingExams: upcoming,
      pastExams: past,
    };
  }, [filteredExams]);

  const listData = useMemo(() => {
    const result = [];

    if (upcomingExams.length > 0) {
      result.push({
        type: 'section',
        id: 'upcoming-header',
        title: 'SCHEDULED EXAMS',
      });

      upcomingExams.forEach(exam => {
        result.push({
          type: 'exam',
          id: `upcoming-${exam.id}`,
          exam,
          isPast: false,
        });
      });
    }

    if (pastExams.length > 0) {
      result.push({
        type: 'section',
        id: 'past-header',
        title: 'PAST HISTORY',
      });

      pastExams.forEach(exam => {
        result.push({
          type: 'exam',
          id: `past-${exam.id}`,
          exam,
          isPast: true,
        });
      });
    }

    return result;
  }, [upcomingExams, pastExams]);

  function clearDates() {
    setFromDate(null);
    setToDate(null);
  }

  function onFromDateChange(event, selectedDate) {
    if (Platform.OS === 'android') {
      setShowFromPicker(false);
    }

    if (event?.type === 'dismissed') {
      return;
    }

    if (selectedDate) {
      setFromDate(selectedDate);
    }
  }

  function onToDateChange(event, selectedDate) {
    if (Platform.OS === 'android') {
      setShowToPicker(false);
    }

    if (event?.type === 'dismissed') {
      return;
    }

    if (selectedDate) {
      setToDate(selectedDate);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />

        <Text style={styles.muted}>Loading exams...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.toastErr}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={listData}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={TEXT}
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* <Text style={styles.pageTitle}>Exams</Text> */}

            <Text style={styles.pageSubtitle}>
              Search and review your assigned exams.
            </Text>

            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search exams..."
              placeholderTextColor={MUTED}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.searchInput}
            />

            <View style={styles.dateFilterRow}>
              <Pressable
                onPress={() => setShowFromPicker(true)}
                style={styles.dateButton}
              >
                <View>
                  <Text style={styles.dateLabel}>From</Text>

                  <Text
                    style={[
                      styles.dateValue,
                      !fromDate && styles.datePlaceholder,
                    ]}
                  >
                    {formatFilterDate(fromDate)}
                  </Text>
                </View>

                <Text style={styles.calendarIcon}>📅</Text>
              </Pressable>

              <Pressable
                onPress={() => setShowToPicker(true)}
                style={styles.dateButton}
              >
                <View>
                  <Text style={styles.dateLabel}>To</Text>

                  <Text
                    style={[
                      styles.dateValue,
                      !toDate && styles.datePlaceholder,
                    ]}
                  >
                    {formatFilterDate(toDate)}
                  </Text>
                </View>

                <Text style={styles.calendarIcon}>📅</Text>
              </Pressable>

              {(fromDate || toDate) && (
                <Pressable
                  onPress={clearDates}
                  style={({ pressed }) => [
                    styles.clearButton,
                    pressed && styles.clearButtonPressed,
                  ]}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </Pressable>
              )}
            </View>

            {showFromPicker ? (
              <DateTimePicker
                value={fromDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                onChange={onFromDateChange}
              />
            ) : null}

            {showToPicker ? (
              <DateTimePicker
                value={toDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                minimumDate={fromDate || undefined}
                onChange={onToDateChange}
              />
            ) : null}
          </View>
        }
        renderItem={({ item }) => {
          if (item.type === 'section') {
            return <Text style={styles.sectionTitle}>{item.title}</Text>;
          }

          return (
            <ExamListCard
              exam={item.exam}
              isPast={item.isPast}
              nowMs={nowMs}
              onPress={onOpenExam}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No exams found.</Text>

            <Text style={styles.muted}>
              Try changing your search or date filters.
            </Text>
          </View>
        }
      />
    </View>
  );
}
