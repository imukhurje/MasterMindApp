import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  View,
  Pressable,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';
import styles from './AdminExamPaperOverview.styles';

function formatDateTime(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function getSubmissionLabel(student) {
  if (!student?.submitted_at) {
    return 'Not submitted';
  }

  return formatDateTime(student.submitted_at) || 'Submitted';
}

function getEvaluationLabel(student) {
  if (student?.evaluated_at) {
    return formatDateTime(student.evaluated_at) || 'Evaluated';
  }

  if (
    student?.offline_awarded_marks !== null &&
    student?.offline_awarded_marks !== undefined
  ) {
    return `${student.offline_awarded_marks} marks`;
  }

  return '—';
}

function isStudentSubmitted(student) {
  return Boolean(student?.submitted_at || student?.attempt_id);
}

function isStudentEvaluated(student) {
  return Boolean(
    student?.evaluated_at || student?.offline_awarded_marks != null,
  );
}

export default function AdminExamPaperOverview({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const examinationId = Number(route?.params?.examinationId);

  const paperId = Number(route?.params?.paperId);

  const initialPaperName = route?.params?.paperName || 'Exam Paper';

  const className = route?.params?.className || '-';

  const subjectName = route?.params?.subjectName || '-';

  const [paper, setPaper] = useState(null);

  const [students, setStudents] = useState([]);

  const [evaluationSheets, setEvaluationSheets] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [studentFilter, setStudentFilter] = useState('all');

  const loadOverview = useCallback(
    async ({ refresh = false } = {}) => {
      if (!Number.isFinite(examinationId) || !Number.isFinite(paperId)) {
        Alert.alert('Exam Paper', 'Examination ID or paper ID is missing.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);

        return;
      }

      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await api(
          `/api/examinations/v1/${examinationId}/papers/${paperId}/overview`,
        );

        const paperData = response?.paper || null;

        const studentRows = Array.isArray(response?.students)
          ? response.students
          : [];

        const evaluationRows = Array.isArray(response?.evaluation_sheets)
          ? response.evaluation_sheets
          : [];

        setPaper(paperData);

        setStudents(studentRows);

        setEvaluationSheets(evaluationRows);

        navigation.setOptions({
          title: paperData?.name || initialPaperName || 'Exam Paper Overview',
        });
      } catch (error) {
        console.log('Exam paper overview load error:', error);

        Alert.alert(
          'Exam Paper',
          error?.message || 'Could not load exam paper overview.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [examinationId, initialPaperName, navigation, paperId],
  );

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const submittedCount = useMemo(
    () => students.filter(isStudentSubmitted).length,
    [students],
  );

  const evaluatedCount = useMemo(
    () => students.filter(isStudentEvaluated).length,
    [students],
  );

  const filteredStudents = useMemo(() => {
    switch (studentFilter) {
      case 'submitted':
        return students.filter(isStudentSubmitted);

      case 'evaluated':
        return students.filter(isStudentEvaluated);

      default:
        return students;
    }
  }, [students, studentFilter]);

  function renderStudent({ item, index }) {
    const submitted = Boolean(item?.submitted_at || item?.attempt_id);

    const evaluated = Boolean(
      item?.evaluated_at || item?.offline_awarded_marks !== null,
    );

    return (
      <View style={styles.studentCard}>
        <View style={styles.studentTopRow}>
          <View style={styles.studentNumberBox}>
            <Text style={styles.studentNumberText}>{index + 1}</Text>
          </View>

          <View style={styles.studentMain}>
            <Text numberOfLines={2} style={styles.studentName}>
              {item?.student_name || 'Unnamed student'}
            </Text>

            <Text style={styles.rollText}>
              Roll: {item?.roll_no ? item.roll_no : '—'}
            </Text>
          </View>
        </View>

        <View style={styles.studentInfoBox}>
          <Text style={styles.infoLabel}>Email</Text>

          <Text numberOfLines={2} style={styles.infoValue}>
            {item?.email || '—'}
          </Text>
        </View>

        <View style={styles.studentStatusRow}>
          <View style={styles.studentStatusColumn}>
            <Text style={styles.infoLabel}>Submission</Text>

            <View
              style={[
                styles.statusBadge,

                submitted
                  ? styles.statusBadgeSuccess
                  : styles.statusBadgeNeutral,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,

                  submitted
                    ? styles.statusTextSuccess
                    : styles.statusTextNeutral,
                ]}
              >
                {getSubmissionLabel(item)}
              </Text>
            </View>
          </View>

          <View style={styles.studentStatusColumn}>
            <Text style={styles.infoLabel}>Evaluation</Text>

            <View
              style={[
                styles.statusBadge,

                evaluated
                  ? styles.statusBadgeSuccess
                  : styles.statusBadgeNeutral,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,

                  evaluated
                    ? styles.statusTextSuccess
                    : styles.statusTextNeutral,
                ]}
              >
                {getEvaluationLabel(item)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading exam paper...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <FlatList
        data={filteredStudents}
        keyExtractor={(item, index) => String(item?.student_id ?? index)}
        renderItem={renderStudent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadOverview({
                refresh: true,
              })
            }
            tintColor="#FFFFFF"
            colors={['#FFFFFF']}
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.headerCard}>
              <Text numberOfLines={3} style={styles.paperName}>
                {paper?.name || initialPaperName}
              </Text>

              <Text style={styles.paperMetadata}>
                {className}
                {'  •  '}
                {subjectName}
              </Text>

              <View style={styles.paperStatusRow}>
                <View style={styles.paperStatusBadge}>
                  <Text style={styles.paperStatusText}>
                    {String(paper?.status || 'draft')
                      .replace(/_/g, ' ')
                      .toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <Pressable
                onPress={() => setStudentFilter('all')}
                style={({ pressed }) => [
                  styles.metricCard,

                  studentFilter === 'all' && styles.metricCardSelected,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text
                  style={[
                    styles.metricLabel,
                    studentFilter === 'all' && styles.metricLabelSelected,
                  ]}
                >
                  Assigned Students
                </Text>

                <Text
                  style={[
                    styles.metricValue,
                    studentFilter === 'all' && styles.metricValueSelected,
                  ]}
                >
                  {students.length}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setStudentFilter('submitted')}
                style={({ pressed }) => [
                  styles.metricCard,

                  studentFilter === 'submitted' && styles.metricCardSelected,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text
                  style={[
                    styles.metricLabel,
                    studentFilter === 'submitted' && styles.metricLabelSelected,
                  ]}
                >
                  Submitted
                </Text>

                <Text
                  style={[
                    styles.metricValue,
                    studentFilter === 'submitted' && styles.metricValueSelected,
                  ]}
                >
                  {submittedCount}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setStudentFilter('evaluated')}
                style={({ pressed }) => [
                  styles.metricCard,

                  studentFilter === 'evaluated' && styles.metricCardSelected,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text
                  style={[
                    styles.metricLabel,
                    studentFilter === 'evaluated' && styles.metricLabelSelected,
                  ]}
                >
                  Evaluated
                </Text>

                <Text
                  style={[
                    styles.metricValue,
                    studentFilter === 'evaluated' && styles.metricValueSelected,
                  ]}
                >
                  {evaluatedCount}
                </Text>
              </Pressable>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Evaluation Sheets</Text>

                <Text style={styles.metricValue}>
                  {evaluationSheets.length}
                </Text>
              </View>
            </View>

            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>
                {studentFilter === 'submitted'
                  ? 'Submitted Students'
                  : studentFilter === 'evaluated'
                  ? 'Evaluated Students'
                  : 'Assigned Students'}
              </Text>

              <Text style={styles.listCount}>
                {filteredStudents.length}{' '}
                {filteredStudents.length === 1 ? 'student' : 'students'}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No students found</Text>

            <Text style={styles.emptyStateText}>
              No students are assigned to this exam paper.
            </Text>
          </View>
        }
      />
    </View>
  );
}
