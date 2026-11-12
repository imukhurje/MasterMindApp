// src/screens/Admin/Examinations/AdminManageExamPapers.js

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';
import styles from './AdminManageExamPapers.styles';
import { useFocusEffect } from '@react-navigation/native';

function normalizeStatus(value) {
  return String(value || 'unknown')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function formatStatus(value) {
  return normalizeStatus(value).replace(/_/g, ' ');
}

function formatScheduleDateTime(value, timeZone) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  try {
    return date.toLocaleString('en-US', {
      timeZone: timeZone || undefined,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch (error) {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}

function isExamScheduled(item) {
  return item?.scheduled === true || item?.is_scheduled === true;
}

function getSchedulePhase(item, nowMs) {
  if (!isExamScheduled(item)) {
    return 'unscheduled';
  }

  const startTime = new Date(item?.starts_at).getTime();

  const endTime = new Date(item?.ends_at).getTime();

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
    return 'scheduled';
  }

  if (nowMs < startTime) {
    return 'upcoming';
  }

  if (nowMs >= startTime && nowMs <= endTime) {
    return 'running';
  }

  return 'finished';
}

function getStatusStyle(status) {
  switch (normalizeStatus(status)) {
    case 'evaluated':
      return styles.statusEvaluated;

    case 'published':
    case 'scheduled':
      return styles.statusScheduled;

    case 'cancelled':
      return styles.statusCancelled;

    default:
      return styles.statusDraft;
  }
}

function getExamTitle(item) {
  return item?.name || item?.title || item?.exam_name || 'Untitled exam paper';
}

export default function AdminManageExamPapers({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const examinationId = route?.params?.examinationId;
  const examinationName = route?.params?.examinationName || 'Examination';

  const [exams, setExams] = useState([]);
  const [examMeta, setExamMeta] = useState(null);
  const [teacherResources, setTeacherResources] = useState(null);
  const [uiTimezone, setUiTimezone] = useState('Asia/Kolkata');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [nowMs, setNowMs] = useState(Date.now());

  const canCreate = examMeta?.can_create === true;

  const loadPage = useCallback(
    async ({ refresh = false } = {}) => {
      if (!examinationId) {
        Alert.alert('Manage Exam Papers', 'Examination ID is missing.', [
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

        const meResponse = await api('/api/me');

        setCurrentUser(meResponse);

        const role = String(
          meResponse?.actual_role || meResponse?.role || '',
        ).toLowerCase();

        const hasAccess =
          meResponse?.is_admin === true ||
          meResponse?.is_super_admin === true ||
          role === 'admin' ||
          role === 'super_admin';

        if (!hasAccess) {
          Alert.alert(
            'Access denied',
            'Only administrators can manage exam papers.',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ],
          );
          return;
        }

        const [examsResponse, metaResponse, resourcesResponse] =
          await Promise.all([
            api(
              `/api/exams?window_days=3650&examination_id=${encodeURIComponent(
                examinationId,
              )}`,
            ),
            api('/api/exams/meta'),
            api(
              `/api/exams/resources-for-teacher/${encodeURIComponent(
                meResponse.id,
              )}`,
            ),
          ]);

        setExams(
          Array.isArray(examsResponse?.exams) ? examsResponse.exams : [],
        );

        setUiTimezone(
          examsResponse?.ui_timezone ||
            metaResponse?.ui_timezone ||
            'Asia/Kolkata',
        );

        setExamMeta(metaResponse || null);
        setTeacherResources(resourcesResponse || null);

        navigation.setOptions({
          title: 'Manage Exam Papers',
        });
      } catch (error) {
        console.log('Manage exam papers load error:', error);

        Alert.alert(
          'Manage Exam Papers',
          error?.message || 'Could not load exam papers.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [examinationId, navigation],
  );

  useFocusEffect(
    useCallback(() => {
      loadPage();
    }, [loadPage]),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 30000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  function openAddExamPaper() {
    if (!canCreate) {
      Alert.alert(
        'Not allowed',
        'You do not have permission to add an exam paper.',
      );
      return;
    }

    if (!currentUser?.id) {
      Alert.alert('Add Exam Paper', 'Current user information is unavailable.');
      return;
    }

    const teacherOptions = [
      {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role || 'admin',
      },
      ...(Array.isArray(examMeta?.teachers)
        ? examMeta.teachers.filter(
            item => Number(item?.id) !== Number(currentUser.id),
          )
        : []),
    ];

    navigation.navigate('AdminAddExamPaper', {
      examinationId,
      examinationName,
      currentUserId: currentUser.id,
      teacherOptions,
    });
  }

  function editExamPaper(item) {
    const teacherOptions = [
      ...(currentUser?.id
        ? [
            {
              id: currentUser.id,
              name: currentUser.name,
              role: currentUser.role || 'admin',
            },
          ]
        : []),

      ...(Array.isArray(examMeta?.teachers)
        ? examMeta.teachers.filter(
            teacher => Number(teacher?.id) !== Number(currentUser?.id),
          )
        : []),
    ];

    navigation.navigate('AdminEditExamPaper', {
      examId: item?.id,
      exam: item,
      teacherOptions,
    });
  }

  function confirmDeleteExamPaper(item) {
    if (!item?.id || deletingId !== null) {
      return;
    }

    if (isExamScheduled(item)) {
      Alert.alert(
        'Delete unavailable',
        'A scheduled exam paper cannot be deleted.',
      );
      return;
    }

    Alert.alert('Delete Exam', 'Delete this exam? This cannot be undone.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteExamPaper(item),
      },
    ]);
  }

  async function deleteExamPaper(item) {
    if (!item?.id || deletingId !== null) {
      return;
    }

    try {
      setDeletingId(item.id);

      const response = await api(`/api/exams/${item.id}`, {
        method: 'DELETE',
      });

      console.log('Delete exam response:', response);

      /*
       * Reload the current Manage Exam Papers page
       * after a successful delete.
       */
      await loadPage({
        refresh: true,
      });

      Alert.alert('Exam deleted', 'The exam was deleted successfully.');
    } catch (error) {
      console.log('Delete exam error:', error);

      Alert.alert(
        'Delete failed',
        'Cannot delete now (starts too soon or already started).',
      );
    } finally {
      setDeletingId(null);
    }
  }

  function assignStudents(item) {
    navigation.navigate('AdminAssignExamStudents', {
      examId: item?.id,
      examName: getExamTitle(item),
      className: item?.class_name || 'Item Class',
    });
  }

  function assignQuestions(item) {
    navigation.navigate('AdminAssignExamQuestions', {
      examId: item?.id,
      examName: getExamTitle(item),
      classGroupId: item?.class_group_id,
      className: item?.class_name || 'Exam Class',
      courseId: item?.course_id,
      courseTitle: item?.course_title || 'Exam Course',
    });
  }

  function renderExamPaper({ item }) {
    const status = normalizeStatus(item?.status);

    const isEvaluated = status === 'evaluated';

    const isScheduled = isExamScheduled(item);

    const schedulePhase = getSchedulePhase(item, nowMs);

    const scheduleLocked =
      schedulePhase === 'running' || schedulePhase === 'finished';

    const allActionsDisabled = isEvaluated || scheduleLocked;

    const deleteDisabled =
      isScheduled || deletingId !== null || allActionsDisabled;

    return (
      <View
        style={[
          styles.examCard,

          schedulePhase === 'upcoming' && styles.examCardUpcoming,

          schedulePhase === 'running' && styles.examCardRunning,
        ]}
      >
        <View style={styles.examCardTopRow}>
          <View style={styles.examTitleSection}>
            <Text numberOfLines={2} style={styles.examTitle}>
              {getExamTitle(item)}
            </Text>
          </View>

          <View style={styles.examBadgesRow}>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>
                Students: {Number(item?.students_count || 0)}
              </Text>
            </View>

            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>
                Questions: {Number(item?.questions_count || 0)}
              </Text>
            </View>

            <View style={[styles.infoBadge, getStatusStyle(status)]}>
              <Text style={styles.infoBadgeText}>{formatStatus(status)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.examInfoRow}>
          <Text numberOfLines={1} style={styles.subjectText}>
            {item?.course_title || '-'}
          </Text>

          <Text numberOfLines={1} style={styles.classText}>
            {item?.class_name || '-'}
          </Text>
        </View>

        <View style={styles.scheduleSection}>
          <Text style={styles.scheduleLabel}>Schedule</Text>

          {isScheduled ? (
            <Text style={styles.scheduleText}>
              {formatScheduleDateTime(item?.starts_at, uiTimezone)}
              {' — '}
              {formatScheduleDateTime(item?.ends_at, uiTimezone)}
            </Text>
          ) : (
            <Text style={styles.notScheduledText}>Not scheduled</Text>
          )}
        </View>

        <View style={styles.examActionsRow}>
          <View style={styles.leftActions}>
            <Pressable
              onPress={() => editExamPaper(item)}
              disabled={allActionsDisabled}
              style={({ pressed }) => [
                styles.outlineActionButton,

                allActionsDisabled && styles.actionButtonDisabled,

                pressed && !allActionsDisabled && styles.controlPressed,
              ]}
            >
              <Text
                style={[
                  styles.outlineActionButtonText,

                  allActionsDisabled && styles.actionButtonTextDisabled,
                ]}
              >
                Edit
              </Text>
            </Pressable>

            <Pressable
              onPress={() => confirmDeleteExamPaper(item)}
              disabled={deleteDisabled}
              style={({ pressed }) => [
                styles.deleteActionButton,

                deleteDisabled && styles.actionButtonDisabled,

                pressed && !deleteDisabled && styles.controlPressed,
              ]}
            >
              {deletingId === item.id ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.deleteActionButtonText,

                    deleteDisabled && styles.actionButtonTextDisabled,
                  ]}
                >
                  Delete
                </Text>
              )}
            </Pressable>
          </View>

          <Pressable
            onPress={() => assignStudents(item)}
            disabled={allActionsDisabled}
            style={({ pressed }) => [
              styles.primaryActionButton,

              allActionsDisabled && styles.actionButtonDisabled,

              pressed && !allActionsDisabled && styles.controlPressed,
            ]}
          >
            <Text
              style={[
                styles.primaryActionButtonText,

                allActionsDisabled && styles.actionButtonTextDisabled,
              ]}
            >
              Assign Students
            </Text>
          </Pressable>

          <Pressable
            onPress={() => assignQuestions(item)}
            disabled={allActionsDisabled}
            style={({ pressed }) => [
              styles.primaryActionButton,

              allActionsDisabled && styles.actionButtonDisabled,

              pressed && !allActionsDisabled && styles.controlPressed,
            ]}
          >
            <Text
              style={[
                styles.primaryActionButtonText,

                allActionsDisabled && styles.actionButtonTextDisabled,
              ]}
            >
              Assign Questions
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading exam papers...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <View style={styles.headerCard}>
        <View style={styles.headerText}>
          <Text style={styles.pageTitle}>Manage Exam Papers</Text>

          <Text numberOfLines={2} style={styles.examinationName}>
            {examinationName}
          </Text>
        </View>

        <Pressable
          onPress={openAddExamPaper}
          disabled={!canCreate}
          accessibilityRole="button"
          accessibilityLabel="Add exam paper"
          style={({ pressed }) => [
            styles.addButton,
            !canCreate && styles.controlDisabled,
            pressed && canCreate && styles.controlPressed,
          ]}
        >
          <Text style={styles.addButtonText}>+ Add Exam Paper</Text>
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Exam papers</Text>
          <Text style={styles.summaryValue}>{exams.length}</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Classes</Text>
          <Text style={styles.summaryValue}>
            {Array.isArray(examMeta?.classes) ? examMeta.classes.length : 0}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Teachers</Text>
          <Text style={styles.summaryValue}>
            {Array.isArray(examMeta?.teachers) ? examMeta.teachers.length : 0}
          </Text>
        </View>
      </View>

      <View style={styles.listCard}>
        <FlatList
          data={exams}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={renderExamPaper}
          style={styles.list}
          contentContainerStyle={
            exams.length === 0 ? styles.emptyListContent : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadPage({ refresh: true })}
              tintColor="#FFFFFF"
              colors={['#FFFFFF']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No exam papers found</Text>

              <Text style={styles.emptyStateText}>
                No exam papers are currently attached to this examination.
              </Text>

              {canCreate ? (
                <Pressable
                  onPress={openAddExamPaper}
                  style={({ pressed }) => [
                    styles.emptyAddButton,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.emptyAddButtonText}>
                    + Add Exam Paper
                  </Text>
                </Pressable>
              ) : null}
            </View>
          }
        />
      </View>

      <View style={styles.hiddenMetadata}>
        <Text>
          {Array.isArray(teacherResources?.classes)
            ? teacherResources.classes.length
            : 0}
        </Text>
      </View>
    </View>
  );
}
