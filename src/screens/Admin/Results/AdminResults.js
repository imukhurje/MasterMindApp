import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import ExamEvaluationModal from './components/ExamEvaluationModal';
import HomeworkEvaluationModal from './components/HomeworkEvaluationModal';

import { api } from '../../../api/client';

import { COLORS, styles } from './AdminResults.styles';

const RESULT_TABS = [
  {
    key: 'exams',
    label: 'Exams',
  },
  {
    key: 'homeworks',
    label: 'Homeworks',
  },
];

function normalizeKind(value) {
  const kind = String(value || '')
    .trim()
    .toLowerCase();

  if (kind === 'homework') {
    return 'homework';
  }

  return 'exam';
}

function normalizeResults(response) {
  /*
   * Current backend response may contain
   * homework records inside `exams`.
   *
   * Also support a future `homeworks` array.
   */
  const examRows = Array.isArray(response?.exams) ? response.exams : [];

  const homeworkRows = Array.isArray(response?.homeworks)
    ? response.homeworks
    : [];

  const combined = [...examRows, ...homeworkRows];

  const map = new Map();

  combined.forEach(item => {
    if (!item?.id) {
      return;
    }

    const kind = normalizeKind(item?.kind);

    const key = `${kind}-${item.id}`;

    map.set(key, {
      ...item,

      id: Number(item.id),

      kind,

      name: String(item?.name || 'Untitled Result'),

      class_name: String(item?.class_name || ''),

      course_title: String(item?.course_title || ''),

      status: String(item?.status || ''),

      students_count: Number(item?.students_count) || 0,

      questions_count: Number(item?.questions_count) || 0,
    });
  });

  return Array.from(map.values());
}

function formatDateTime(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const day = date.getDate();

  const month = date.toLocaleString('en-GB', {
    month: 'short',
  });

  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');

  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year}, ` + `${hours}:${minutes}`;
}

function getWindowLabel(item) {
  const now = new Date().getTime();

  const start = item?.starts_at ? new Date(item.starts_at).getTime() : null;

  const end = item?.ends_at ? new Date(item.ends_at).getTime() : null;

  const backendStatus = String(item?.status || '').toLowerCase();

  if (backendStatus === 'evaluated') {
    return 'Evaluated';
  }

  if (Number.isFinite(start) && now < start) {
    return 'Upcoming';
  }

  if (
    Number.isFinite(start) &&
    Number.isFinite(end) &&
    now >= start &&
    now <= end
  ) {
    return 'Open window';
  }

  if (Number.isFinite(end) && now > end) {
    return 'Closed';
  }

  return item?.status || 'Open window';
}

function getTypeLabel(item) {
  return item?.kind === 'homework' ? 'Student homework' : 'Exam';
}

export default function AdminResults() {
  const [activeTab, setActiveTab] = useState('exams');

  const [resultItems, setResultItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadError, setLoadError] = useState('');
  const [evaluationExam, setEvaluationExam] = useState(null);

  const [evaluationModalVisible, setEvaluationModalVisible] = useState(false);

  const [selectedHomework, setSelectedHomework] = useState(null);

  const [homeworkModalVisible, setHomeworkModalVisible] = useState(false);

  const loadResults = useCallback(async (mode = 'initial') => {
    try {
      if (mode === 'refresh') {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setLoadError('');

      const response = await api('/api/results?window_days=60', {
        method: 'GET',
      });

      setResultItems(normalizeResults(response));
    } catch (error) {
      console.log('Results API error:', error);

      setLoadError(error?.message || 'Could not load results.');
    } finally {
      setLoading(false);

      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadResults('initial');
  }, [loadResults]);

  const examItems = useMemo(() => {
    return resultItems.filter(item => item.kind === 'exam');
  }, [resultItems]);

  const homeworkItems = useMemo(() => {
    return resultItems.filter(item => item.kind === 'homework');
  }, [resultItems]);

  const visibleItems = activeTab === 'exams' ? examItems : homeworkItems;

  function handleOpen(item) {
    if (!item?.id) return;

    if (item.kind === 'homework') {
      setSelectedHomework(item);
      setHomeworkModalVisible(true);
      return;
    }

    // Existing Exam Evaluation
    setEvaluationExam(item);
    setEvaluationModalVisible(true);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />

          <Text style={styles.stateText}>Loading results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadError && resultItems.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateContainer}>
          <Text style={styles.errorTitle}>Could not load results</Text>

          <Text style={styles.errorDescription}>{loadError}</Text>

          <Pressable
            onPress={() => loadResults('initial')}
            style={({ pressed }) => [
              styles.retryButton,

              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}

        <View style={styles.topRow}>
          <View style={styles.tabsContainer}>
            {RESULT_TABS.map(tab => {
              const selected = activeTab === tab.key;

              const count =
                tab.key === 'exams' ? examItems.length : homeworkItems.length;

              return (
                <Pressable
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={({ pressed }) => [
                    styles.tabButton,

                    selected && styles.tabButtonActive,

                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabButtonText,

                      selected && styles.tabButtonTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>

                  <View
                    style={[
                      styles.tabCountBadge,

                      selected && styles.tabCountBadgeActive,
                    ]}
                  >
                    <Text style={styles.tabCountText}>{count}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={() => loadResults('refresh')}
            disabled={refreshing}
            style={({ pressed }) => [
              styles.refreshButton,

              pressed && !refreshing && styles.buttonPressed,

              refreshing && styles.buttonDisabled,
            ]}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={COLORS.TEXT} />
            ) : (
              <Text style={styles.refreshButtonText}>↻ Refresh</Text>
            )}
          </Pressable>
        </View>

        {loadError ? (
          <View style={styles.inlineError}>
            <Text style={styles.inlineErrorText}>{loadError}</Text>
          </View>
        ) : null}

        {/* Result cards */}

        {visibleItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              {activeTab === 'exams' ? 'No exams found' : 'No homeworks found'}
            </Text>

            <Text style={styles.emptyDescription}>
              No results were found within the current 60-day window.
            </Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {visibleItems.map(item => (
              <ResultCard
                key={`${item.kind}-${item.id}`}
                item={item}
                onOpen={handleOpen}
              />
            ))}
          </View>
        )}
      </ScrollView>
      <ExamEvaluationModal
        visible={evaluationModalVisible}
        exam={evaluationExam}
        onClose={() => {
          setEvaluationModalVisible(false);
          setEvaluationExam(null);
        }}
      />
      <HomeworkEvaluationModal
        visible={homeworkModalVisible}
        homework={selectedHomework}
        onClose={() => {
          setHomeworkModalVisible(false);
          setSelectedHomework(null);
        }}
      />
    </SafeAreaView>
  );
}

function ResultCard({ item, onOpen }) {
  const startText = formatDateTime(item?.starts_at);
  const endText = formatDateTime(item?.ends_at);
  const windowLabel = getWindowLabel(item);

  return (
    <View style={styles.resultCard}>
      {/* Title */}
      <Text style={styles.resultTitle}>{item?.name || 'Untitled'}</Text>

      {/* Subject and Class */}
      <View style={styles.tagsContainer}>
        {item?.course_title ? (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText} numberOfLines={1}>
              {item.course_title}
            </Text>
          </View>
        ) : null}

        {item?.class_name ? (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText} numberOfLines={1}>
              {item.class_name}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Date and Time */}
      <Text style={styles.dateRangeText}>
        {startText} — {endText}
      </Text>

      {/* Window Status */}
      <Text style={styles.windowText}>{windowLabel}</Text>

      {/* Bottom stats and button */}
      <View style={styles.cardBottomRow}>
        <View style={styles.cardStatsGroup}>
          <View style={styles.statBadge}>
            <Text style={styles.statText}>
              Students: {item?.students_count ?? 0}
            </Text>
          </View>

          <View style={styles.statBadge}>
            <Text style={styles.statText}>
              Questions: {item?.questions_count ?? 0}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => onOpen?.(item)}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.openButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.openButtonText}>Open</Text>
        </Pressable>
      </View>

      <View style={styles.cardTypeRow}>
        <Text style={styles.cardTypeText}>{getTypeLabel(item)}</Text>
      </View>
    </View>
  );
}
