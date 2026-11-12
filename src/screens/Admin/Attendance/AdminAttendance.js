// src/screens/Admin/Attendance/AdminAttendance.js

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';
import styles from './AdminAttendance.styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Calendar } from 'react-native-calendars';

const PER_PAGE = 20;

function formatSheetDate(value) {
  if (!value) {
    return '';
  }

  const parts = String(value).split('-');

  if (parts.length !== 3) {
    return String(value);
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
}

function formatSessionDateTime(value) {
  if (!value) {
    return {
      date: '',
      time: '',
    };
  }

  const raw = String(value).trim();

  const [datePart, timePart] = raw.split(' ');

  return {
    date: formatSheetDate(datePart),
    time: timePart || '',
  };
}

function formatPercent(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return '0%';
  }

  return `${number.toFixed(1)}%`;
}

function normalizeSession(item) {
  return {
    ...item,

    id: item?.id,

    sessionType: String(item?.session_type || '').toLowerCase(),
  };
}

function getTodayIsoDate() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, '0');

  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value) {
  if (!value) {
    return '';
  }

  const parts = String(value).split('-');

  if (parts.length !== 3) {
    return String(value);
  }

  const [year, month, day] = parts;

  return `${day}-${month}-${year}`;
}

function parseDisplayDate(value) {
  const text = String(value || '').trim();

  const match = text.match(/^(\d{2})-(\d{2})-(\d{4})$/);

  if (!match) {
    return null;
  }

  const [, day, month, year] = match;

  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  return `${year}-${month}-${day}`;
}

function SelectionModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.selectionOverlay} onPress={onClose}>
        <Pressable
          style={styles.selectionCard}
          onPress={event => event.stopPropagation()}
        >
          <View style={styles.selectionHeader}>
            <Text style={styles.selectionTitle}>{title}</Text>

            <Pressable onPress={onClose} style={styles.selectionClose}>
              <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView style={styles.selectionList}>
            {options.map(option => {
              const selected = String(option.value) === String(selectedValue);

              return (
                <Pressable
                  key={String(option.value)}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.selectionOption,

                    selected && styles.selectionOptionSelected,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.selectionOptionText,

                      selected && styles.selectionOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>

                  {selected ? (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="#60A5FA"
                    />
                  ) : null}
                </Pressable>
              );
            })}

            {options.length === 0 ? (
              <View style={styles.selectionEmpty}>
                <Text style={styles.selectionEmptyText}>
                  No options available.
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function AdminAttendance({ navigation }) {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [me, setMe] = useState(null);

  const [onboarding, setOnboarding] = useState(null);

  const [meta, setMeta] = useState(null);

  const [todayTimetable, setTodayTimetable] = useState(null);

  const [sessions, setSessions] = useState([]);

  const [page, setPage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const [newSheetVisible, setNewSheetVisible] = useState(false);

  const [selectedClassId, setSelectedClassId] = useState(null);

  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const [selectedTimeslotId, setSelectedTimeslotId] = useState(null);

  const [attendanceDate, setAttendanceDate] = useState(getTodayIsoDate());

  const [attendanceDateText, setAttendanceDateText] = useState(
    formatDisplayDate(getTodayIsoDate()),
  );

  const [timeslots, setTimeslots] = useState([]);

  const [loadingTimeslots, setLoadingTimeslots] = useState(false);

  const [classPickerVisible, setClassPickerVisible] = useState(false);

  const [coursePickerVisible, setCoursePickerVisible] = useState(false);

  const [timeslotPickerVisible, setTimeslotPickerVisible] = useState(false);

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [creatingSheet, setCreatingSheet] = useState(false);

  const [openingTimelineKey, setOpeningTimelineKey] = useState(null);

  const currentRole = String(
    me?.primary_role ||
      me?.role ||
      me?.actual_primary_role ||
      me?.actual_role ||
      '',
  )
    .trim()
    .toLowerCase();

  const isAdminUser =
    me?.is_admin === true ||
    me?.is_super_admin === true ||
    currentRole === 'admin' ||
    currentRole === 'super_admin';

  const isTeacherUser = currentRole === 'teacher';

  const selectedClass = useMemo(() => {
    const classes = Array.isArray(meta?.classes) ? meta.classes : [];

    return (
      classes.find(item => Number(item?.id) === Number(selectedClassId)) || null
    );
  }, [meta?.classes, selectedClassId]);

  const attendanceSessionMode = String(
    meta?.tutorial_attendance_session_mode || '',
  )
    .trim()
    .toLowerCase();

  const isRoutineSlotsMode = attendanceSessionMode === 'routine_slots';

  const isClassOnDemandMode = attendanceSessionMode === 'class_on_demand';

  const isLectureAttendance =
    String(selectedClass?.attendance_frequency || '')
      .trim()
      .toLowerCase() === 'once every lecture';

  const classOptions = useMemo(() => {
    return (Array.isArray(meta?.classes) ? meta.classes : []).map(item => ({
      value: item.id,
      label: item.label,
      data: item,
    }));
  }, [meta?.classes]);

  const courseOptions = useMemo(() => {
    if (!selectedClassId) {
      return [];
    }

    const onboardingSubjects = Array.isArray(onboarding?.subjects)
      ? onboarding.subjects
      : [];

    const allowedCourseIds = new Set(
      onboardingSubjects
        .filter(
          subject =>
            Array.isArray(subject?.classes) &&
            subject.classes.some(
              classItem => Number(classItem?.id) === Number(selectedClassId),
            ),
        )
        .map(subject => Number(subject.id)),
    );

    const courses = Array.isArray(meta?.courses) ? meta.courses : [];

    return courses
      .filter(course => allowedCourseIds.has(Number(course.id)))
      .map(course => ({
        value: course.id,
        label: course.label,
        data: course,
      }));
  }, [meta?.courses, onboarding?.subjects, selectedClassId]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / PER_PAGE)),
    [totalCount],
  );

  const loadSessions = useCallback(
    async ({ requestedPage = 1, append = false } = {}) => {
      const response = await api(
        `/api/attendance/sessions?page=${encodeURIComponent(
          requestedPage,
        )}&per_page=${PER_PAGE}`,
      );

      const rows = Array.isArray(response?.rows)
        ? response.rows.map(normalizeSession)
        : [];

      if (append) {
        setSessions(current => {
          const map = new Map();

          current.forEach(item => {
            map.set(String(item.id), item);
          });

          rows.forEach(item => {
            map.set(String(item.id), item);
          });

          return Array.from(map.values());
        });
      } else {
        setSessions(rows);
      }

      setPage(Number(response?.page) || requestedPage);

      setTotalCount(Number(response?.count) || 0);
    },
    [],
  );

  const timeslotOptions = useMemo(() => {
    let rows = timeslots;

    /*
     * If a subject is selected,
     * only show matching routine slots.
     */
    if (selectedCourseId) {
      rows = rows.filter(
        item => Number(item?.course_id) === Number(selectedCourseId),
      );
    }

    return rows.map(item => ({
      value: item.id,

      label: `${item.start_time}–${item.end_time}` + ` · ${item.label}`,

      data: item,
    }));
  }, [timeslots, selectedCourseId]);

  const loadTimeslots = useCallback(async () => {
    if (
      !newSheetVisible ||
      !selectedClassId ||
      !attendanceDate ||
      !isRoutineSlotsMode ||
      !isLectureAttendance
    ) {
      setTimeslots([]);
      setSelectedTimeslotId(null);
      return;
    }

    try {
      setLoadingTimeslots(true);

      setSelectedTimeslotId(null);

      const response = await api(
        `/api/attendance/timeslots?class_group_id=${encodeURIComponent(
          selectedClassId,
        )}&date=${encodeURIComponent(attendanceDate)}`,
      );

      const rows = Array.isArray(response?.timeslots) ? response.timeslots : [];

      setTimeslots(rows);
    } catch (error) {
      console.log('Attendance timeslots error:', error);

      setTimeslots([]);

      Alert.alert(
        'Timeslots',
        error?.message || 'Could not load routine timeslots.',
      );
    } finally {
      setLoadingTimeslots(false);
    }
  }, [
    newSheetVisible,
    selectedClassId,
    attendanceDate,
    isRoutineSlotsMode,
    isLectureAttendance,
  ]);

  useEffect(() => {
    loadTimeslots();
  }, [loadTimeslots]);

  const loadAttendance = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        /*
         * Load the current user first because
         * subsequent requests depend on the role.
         */
        const meResponse = await api('/api/me');

        const role = String(
          meResponse?.primary_role ||
            meResponse?.role ||
            meResponse?.actual_primary_role ||
            meResponse?.actual_role ||
            '',
        )
          .trim()
          .toLowerCase();

        const isAdmin =
          meResponse?.is_admin === true ||
          meResponse?.is_super_admin === true ||
          role === 'admin' ||
          role === 'super_admin';

        const isTeacher = role === 'teacher';

        if (!isAdmin && !isTeacher) {
          Alert.alert(
            'Access denied',
            'You do not have access to attendance.',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ],
          );

          return;
        }

        setMe(meResponse || null);

        /*
         * These APIs are required for both
         * administrators and teachers.
         */
        const [metaResponse, timetableResponse] = await Promise.all([
          api('/api/attendance/meta'),
          api('/api/attendance/today-timetable'),
        ]);

        setMeta(metaResponse || null);

        setTodayTimetable(timetableResponse || null);

        /*
         * Onboarding data is only required
         * for the admin New Attendance Sheet flow.
         */
        if (isAdmin) {
          try {
            const onboardingResponse = await api('/api/settings/v1/onboarding');

            setOnboarding(onboardingResponse || null);
          } catch (error) {
            console.log('Attendance onboarding load error:', error);

            setOnboarding(null);
          }
        } else {
          setOnboarding(null);
        }

        /*
         * Session-list permissions can differ
         * by role. A failure here should not
         * prevent Today's Timetable from loading.
         */
        try {
          await loadSessions({
            requestedPage: 1,
            append: false,
          });
        } catch (error) {
          console.log('Attendance sessions load error:', error);

          setSessions([]);
          setPage(1);
          setTotalCount(0);
        }
      } catch (error) {
        console.log('Attendance load error:', error);

        Alert.alert(
          'Student Attendance',
          error?.message || 'Could not load attendance.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loadSessions, navigation],
  );

  const canCreateAttendanceSheet =
    Boolean(selectedClassId) &&
    Boolean(attendanceDate) &&
    (!isLectureAttendance || Boolean(selectedCourseId)) &&
    (!isLectureAttendance ||
      !isRoutineSlotsMode ||
      Boolean(selectedTimeslotId));

  const handleCreateAttendanceSheet = useCallback(async () => {
    if (!canCreateAttendanceSheet || creatingSheet) {
      return;
    }

    try {
      setCreatingSheet(true);

      const payload = {
        class_group_id: Number(selectedClassId),

        sheet_date: attendanceDate,
      };

      /*
       * Lecture-based attendance requires
       * a course/subject.
       */
      if (isLectureAttendance && selectedCourseId) {
        payload.course_id = Number(selectedCourseId);
      }

      /*
       * routine_slots mode requires
       * the selected routine timeslot.
       */
      if (isLectureAttendance && isRoutineSlotsMode && selectedTimeslotId) {
        payload.timeslot_id = Number(selectedTimeslotId);
      }

      console.log('Create attendance sheet payload:', payload);

      const response = await api('/api/attendance/sessions', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response?.id) {
        throw new Error(
          response?.message || 'Could not create the attendance sheet.',
        );
      }

      /*
       * Close and reset the modal.
       */
      closeNewAttendanceSheet();

      /*
       * Reload meta, timetable and attendance sessions.
       * The newly-created session will appear immediately.
       */
      await loadAttendance({
        refresh: true,
      });

      Alert.alert(
        'Attendance Sheet Created',
        response?.message || 'Attendance sheet created successfully.',
      );
    } catch (error) {
      console.log('Create attendance sheet error:', error);

      Alert.alert(
        'Create failed',
        error?.message || 'Could not create the attendance sheet.',
      );
    } finally {
      setCreatingSheet(false);
    }
  }, [
    canCreateAttendanceSheet,
    creatingSheet,
    selectedClassId,
    selectedCourseId,
    selectedTimeslotId,
    attendanceDate,
    isLectureAttendance,
    isRoutineSlotsMode,
    closeNewAttendanceSheet,
    loadAttendance,
  ]);

  const handleAttendanceReports = useCallback(() => {
    navigation.navigate('AdminAttendanceReports');
  }, [navigation]);

  const handleAttendanceDateSelect = useCallback(day => {
    const selectedDate = String(day?.dateString || '');

    if (!selectedDate) {
      return;
    }

    setAttendanceDate(selectedDate);

    setAttendanceDateText(formatDisplayDate(selectedDate));

    /*
     * Date change invalidates the
     * previously selected routine slot.
     */
    setSelectedTimeslotId(null);

    setCalendarVisible(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAttendance();

      return undefined;
    }, [loadAttendance]),
  );

  const loadNextPage = useCallback(async () => {
    if (loading || loadingMore || page >= totalPages) {
      return;
    }

    try {
      setLoadingMore(true);

      await loadSessions({
        requestedPage: page + 1,
        append: true,
      });
    } catch (error) {
      console.log('Attendance load more error:', error);

      Alert.alert(
        'Attendance',
        error?.message || 'Could not load more sessions.',
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, page, totalPages, loadSessions]);

  const onRefresh = useCallback(async () => {
    await loadAttendance({
      refresh: true,
    });
  }, [loadAttendance]);

  const timetableSlots = Array.isArray(todayTimetable?.slots)
    ? todayTimetable.slots
    : [];

  const handleNewAttendanceSheet = useCallback(() => {
    const today = getTodayIsoDate();

    setSelectedClassId(null);
    setSelectedCourseId(null);
    setSelectedTimeslotId(null);

    setTimeslots([]);

    setAttendanceDate(today);

    setAttendanceDateText(formatDisplayDate(today));

    setNewSheetVisible(true);
  }, []);

  const closeNewAttendanceSheet = useCallback(() => {
    setNewSheetVisible(false);

    setSelectedClassId(null);
    setSelectedCourseId(null);
    setSelectedTimeslotId(null);

    setTimeslots([]);
  }, []);

  const handleClassSelect = useCallback(option => {
    setSelectedClassId(option.value);

    /*
     * Class change invalidates
     * previous subject/timeslot.
     */
    setSelectedCourseId(null);
    setSelectedTimeslotId(null);

    setTimeslots([]);
  }, []);

  const handleCourseSelect = useCallback(option => {
    setSelectedCourseId(option.value);

    setSelectedTimeslotId(null);
  }, []);

  const handleTimeslotSelect = useCallback(option => {
    setSelectedTimeslotId(option.value);

    const slot = option?.data;

    if (slot?.course_id) {
      setSelectedCourseId(Number(slot.course_id));
    }
  }, []);

  const handleMarkAttendance = useCallback(
    session => {
      const sessionType = String(
        session?.sessionType || session?.session_type || '',
      )
        .trim()
        .toLowerCase();

      /*
       * Daily attendance uses a date-based sheet,
       * not a numeric attendance session ID.
       */
      if (sessionType === 'daily') {
        const sheetDate = String(session?.sheet_date || '').trim();

        const classGroupId = Number(
          session?.class_group_id ?? session?.class_group_ids?.[0],
        );

        if (!sheetDate) {
          Alert.alert('Attendance', 'A valid attendance date is required.');

          return;
        }

        if (!Number.isFinite(classGroupId)) {
          Alert.alert(
            'Attendance',
            'A valid class is required for daily attendance.',
          );

          return;
        }

        navigation.navigate('AdminMarkAttendance', {
          sessionId: session?.id,

          sessionType: 'daily',

          sheetDate,

          classGroupId,

          initialTab: 'manual',

          source: 'session_list',
        });

        return;
      }

      /*
       * Lecture attendance uses a numeric session ID.
       */
      const sessionId = Number(session?.id);

      if (!Number.isFinite(sessionId)) {
        Alert.alert('Attendance', 'A valid attendance session is required.');

        return;
      }

      navigation.navigate('AdminMarkAttendance', {
        sessionId,
        sessionType: 'lecture',
        initialTab: 'qr',
        source: 'session_list',
      });
    },
    [navigation],
  );

  const handleTodayTimelinePress = useCallback(
    async slot => {
      const slotKey = String(slot?.key || '').trim();

      const classGroupId = Number(slot?.class_group_id);

      const courseId = Number(slot?.course_id);

      const timeslotId = Number(slot?.timeslot_id);

      const sheetDate = String(todayTimetable?.date || '').trim();

      if (!slotKey || !Number.isFinite(classGroupId) || !sheetDate) {
        Alert.alert(
          'Attendance',
          'This timetable slot does not contain enough information to open attendance.',
        );

        return;
      }

      if (openingTimelineKey) {
        return;
      }

      /*
       * Find the attendance frequency
       * configured for this class.
       */
      const classMeta =
        (Array.isArray(meta?.classes) ? meta.classes : []).find(
          item => Number(item?.id) === classGroupId,
        ) || null;

      const attendanceFrequency = String(
        classMeta?.attendance_frequency || meta?.attendance_frequency || '',
      )
        .trim()
        .toLowerCase();

      const isDailyAttendance = attendanceFrequency === 'once every day';

      try {
        setOpeningTimelineKey(slotKey);

        /*
         * DAILY ATTENDANCE
         *
         * Do not create a lecture session.
         * AdminMarkAttendance will load:
         *
         * GET /api/attendance/daily-sheets/{date}
         *     ?class_group_id={classGroupId}
         */
        if (isDailyAttendance) {
          navigation.navigate('AdminMarkAttendance', {
            sessionId: `daily:${sheetDate}:${classGroupId}`,

            sessionType: 'daily',

            sheetDate,

            classGroupId,

            initialTab: 'manual',

            source: 'today_timeline',
          });

          return;
        }

        /*
         * LECTURE ATTENDANCE
         */
        if (!Number.isFinite(courseId) || !Number.isFinite(timeslotId)) {
          throw new Error('Course or timeslot information is missing.');
        }

        const payload = {
          class_group_id: classGroupId,

          course_id: courseId,

          sheet_date: sheetDate,

          timeslot_id: timeslotId,

          timetable_slot_key: slotKey,
        };

        const response = await api('/api/attendance/sessions', {
          method: 'POST',

          body: JSON.stringify(payload),
        });

        const sessionId = Number(response?.id);

        if (!Number.isFinite(sessionId)) {
          throw new Error('Attendance session ID was not returned.');
        }

        await loadSessions({
          requestedPage: 1,
          append: false,
        });

        navigation.navigate('AdminMarkAttendance', {
          sessionId,

          sessionType: 'lecture',

          initialTab: 'manual',

          source: 'today_timeline',
        });
      } catch (error) {
        console.log('Open timetable attendance error:', error);

        Alert.alert(
          'Attendance',
          error?.message || 'Could not open the attendance sheet.',
        );
      } finally {
        setOpeningTimelineKey(null);
      }
    },
    [
      todayTimetable?.date,
      openingTimelineKey,
      meta?.classes,
      meta?.attendance_frequency,
      loadSessions,
      navigation,
    ],
  );

  const renderSession = useCallback(
    ({ item }) => {
      const isDaily = item.sessionType === 'daily';

      if (isDaily) {
        const date = formatSheetDate(item?.sheet_date);

        return (
          <View style={styles.dailySessionCard}>
            <Text style={styles.dailySessionDate}>
              {date || 'Daily Attendance'}
            </Text>

            <Pressable
              onPress={() => handleMarkAttendance(item)}
              style={({ pressed }) => [
                styles.markButton,

                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.markButtonText}>Mark Attendance</Text>
            </Pressable>
          </View>
        );
      }

      const dateTime = formatSessionDateTime(item?.starts_at);

      return (
        <View style={styles.lectureCard}>
          <View style={styles.lectureInfo}>
            <Text style={styles.lectureTitle} numberOfLines={2}>
              {item?.class_label || 'Class'}
              {' · '}
              {item?.course_label || 'Course'}
            </Text>

            <Text style={styles.lectureMeta} numberOfLines={2}>
              {dateTime.date}

              {dateTime.time ? `, ${dateTime.time}` : ''}

              {item?.teacher_name ? ` · Teacher: ${item.teacher_name}` : ''}
            </Text>
          </View>

          <Pressable
            onPress={() => handleMarkAttendance(item)}
            style={({ pressed }) => [
              styles.markButton,

              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.markButtonText}>Mark Attendance</Text>
          </Pressable>
        </View>
      );
    },
    [handleMarkAttendance],
  );

  const listHeader = (
    <>
      {/* Header */}
      {/* <View style={styles.headerCard}>
        <View style={styles.headerTextSection}>
          <Text style={styles.pageTitle}>Student Attendance</Text>

          <Text style={styles.pageSubtitle}>
            Track and mark student attendance
          </Text>
        </View>

        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>ADMIN</Text>
        </View>
      </View> */}

      {/* Top actions */}
      <View style={styles.topActionsRow}>
        <Pressable
          onPress={handleNewAttendanceSheet}
          style={({ pressed }) => [
            styles.newAttendanceButton,
            pressed && styles.controlPressed,
          ]}
        >
          <Text style={styles.newAttendanceButtonText}>
            + New Attendance Sheet
          </Text>
        </Pressable>

        <Pressable
          onPress={handleAttendanceReports}
          style={({ pressed }) => [
            styles.reportsButton,
            pressed && styles.controlPressed,
          ]}
        >
          <Text style={styles.reportsButtonText}>Reports</Text>
        </Pressable>
      </View>

      {/* Statistics */}
      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>% Present</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>This Week</Text>

            <Text style={styles.statValue}>
              {formatPercent(meta?.stats?.week)}
            </Text>
          </View>

          <View style={[styles.statItem, styles.statItemCenter]}>
            <Text style={styles.statLabel}>MTD</Text>

            <Text style={styles.statValue}>
              {formatPercent(meta?.stats?.mtd)}
            </Text>
          </View>

          <View style={[styles.statItem, styles.statItemRight]}>
            <Text style={styles.statLabel}>YTD</Text>

            <Text style={styles.statValue}>
              {formatPercent(meta?.stats?.ytd)}
            </Text>
          </View>
        </View>
      </View>

      {/* Today's timetable */}
      <View style={styles.timetableCard}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeaderContent}>
            <Text style={styles.sectionTitle}>Today's timetable</Text>

            <Text style={styles.sectionSubtitle}>
              {isTeacherUser
                ? 'Choose one of your scheduled classes. All students are initially marked present.'
                : 'Choose a scheduled class to start attendance.'}
            </Text>
          </View>

          {!!todayTimetable?.routine_mode && (
            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText} numberOfLines={1}>
                {todayTimetable.routine_mode}
              </Text>
            </View>
          )}
        </View>

        {timetableSlots.length > 0 ? (
          <View style={styles.slotWrap}>
            {timetableSlots.map(slot => {
              const isOpening = openingTimelineKey === String(slot?.key || '');

              return (
                <Pressable
                  key={String(slot?.key || slot?.timeslot_id)}
                  disabled={openingTimelineKey !== null}
                  onPress={() => handleTodayTimelinePress(slot)}
                  style={({ pressed }) => [
                    styles.slotChip,

                    isOpening && styles.controlDisabled,

                    pressed && !openingTimelineKey && styles.controlPressed,
                  ]}
                >
                  {isOpening ? (
                    <ActivityIndicator size="small" color="#67D1F0" />
                  ) : (
                    <Text style={styles.slotChipText}>
                      {slot?.start_time}
                      {'–'}
                      {slot?.end_time}
                      {' · '}
                      {slot?.class_label}
                      {' · '}
                      {slot?.course_label}

                      {!isTeacherUser && slot?.teacher_name
                        ? ` · ${slot.teacher_name}`
                        : ''}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyText}>No classes scheduled for today.</Text>
        )}
      </View>

      <View style={styles.sessionsHeading}>
        <View>
          <Text style={styles.sectionTitle}>Attendance Sessions</Text>

          <Text style={styles.sectionSubtitle}>
            Recent daily and lecture attendance sessions
          </Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{totalCount}</Text>
        </View>
      </View>
    </>
  );

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading attendance...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 6),
        },
      ]}
    >
      <FlatList
        data={sessions}
        keyExtractor={item => String(item?.id)}
        renderItem={renderSession}
        ListHeaderComponent={listHeader}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No attendance sessions</Text>

            <Text style={styles.emptyText}>
              Attendance sessions will appear here when available.
            </Text>
          </View>
        }
        ListFooterComponent={
          page < totalPages ? (
            <Pressable
              disabled={loadingMore}
              onPress={loadNextPage}
              style={({ pressed }) => [
                styles.loadMoreButton,

                loadingMore && styles.controlDisabled,

                pressed && !loadingMore && styles.controlPressed,
              ]}
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.loadMoreButtonText}>Load More</Text>
              )}
            </Pressable>
          ) : (
            <View style={styles.footerSpace} />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#67D1F0"
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
      />

      <Modal
        visible={newSheetVisible}
        transparent
        animationType="fade"
        onRequestClose={closeNewAttendanceSheet}
      >
        <View style={styles.newSheetOverlay}>
          <View style={styles.newSheetModal}>
            {/* Header */}
            <View style={styles.newSheetHeader}>
              <Text style={styles.newSheetTitle}>New Attendance Sheet</Text>

              <Pressable
                onPress={closeNewAttendanceSheet}
                style={({ pressed }) => [
                  styles.newSheetClose,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={25}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            {/* Class / Course */}
            <View style={isLectureAttendance ? styles.twoColumnRow : null}>
              <View
                style={[
                  styles.modalField,

                  isLectureAttendance && styles.halfField,
                ]}
              >
                <Text style={styles.modalLabel}>Class</Text>

                <Pressable
                  onPress={() => setClassPickerVisible(true)}
                  style={styles.modalSelect}
                >
                  <Text
                    style={[
                      styles.modalSelectText,

                      !selectedClass && styles.modalPlaceholder,
                    ]}
                    numberOfLines={1}
                  >
                    {selectedClass?.label || 'Select...'}
                  </Text>

                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={21}
                    color="#E2E8F0"
                  />
                </Pressable>
              </View>

              {isLectureAttendance ? (
                <View style={[styles.modalField, styles.halfField]}>
                  <Text style={styles.modalLabel}>Course/Subject</Text>

                  <Pressable
                    onPress={() => setCoursePickerVisible(true)}
                    style={styles.modalSelect}
                  >
                    <Text
                      style={[
                        styles.modalSelectText,

                        !selectedCourseId && styles.modalPlaceholder,
                      ]}
                      numberOfLines={1}
                    >
                      {courseOptions.find(
                        option =>
                          Number(option.value) === Number(selectedCourseId),
                      )?.label || 'Select...'}
                    </Text>

                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={21}
                      color="#E2E8F0"
                    />
                  </Pressable>
                </View>
              ) : null}
            </View>

            {/* Date */}
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Date</Text>

              <Pressable
                onPress={() => setCalendarVisible(true)}
                style={({ pressed }) => [
                  styles.dateField,
                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.dateValue}>
                  {attendanceDateText || 'Select date'}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={19}
                  color="#E2E8F0"
                />
              </Pressable>
            </View>

            {/* Routine Timeslot */}
            {selectedClass && isLectureAttendance && isRoutineSlotsMode ? (
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Timeslot from routine</Text>

                <Pressable
                  disabled={loadingTimeslots}
                  onPress={() => setTimeslotPickerVisible(true)}
                  style={[
                    styles.modalSelect,

                    loadingTimeslots && styles.controlDisabled,
                  ]}
                >
                  {loadingTimeslots ? (
                    <ActivityIndicator size="small" color="#67D1F0" />
                  ) : (
                    <>
                      <Text
                        style={[
                          styles.modalSelectText,

                          !selectedTimeslotId && styles.modalPlaceholder,
                        ]}
                        numberOfLines={1}
                      >
                        {timeslotOptions.find(
                          option =>
                            Number(option.value) === Number(selectedTimeslotId),
                        )?.label || 'Select timeslot...'}
                      </Text>

                      <MaterialCommunityIcons
                        name="chevron-down"
                        size={21}
                        color="#E2E8F0"
                      />
                    </>
                  )}
                </Pressable>

                {!loadingTimeslots && timeslots.length === 0 ? (
                  <Text style={styles.timeslotHelp}>
                    No routine timeslots are configured for this class on the
                    selected day.
                  </Text>
                ) : null}
              </View>
            ) : null}

            {/* class_on_demand has no routine timeslot field */}

            <View style={styles.modalActions}>
              <Pressable
                onPress={closeNewAttendanceSheet}
                style={({ pressed }) => [
                  styles.modalCancelButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={!canCreateAttendanceSheet || creatingSheet}
                onPress={handleCreateAttendanceSheet}
                style={({ pressed }) => [
                  styles.modalCreateButton,

                  (!canCreateAttendanceSheet || creatingSheet) &&
                    styles.controlDisabled,

                  pressed &&
                    canCreateAttendanceSheet &&
                    !creatingSheet &&
                    styles.controlPressed,
                ]}
              >
                {creatingSheet ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalCreateText}>Create</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <Pressable
          style={styles.calendarOverlay}
          onPress={() => setCalendarVisible(false)}
        >
          <Pressable
            style={styles.calendarCard}
            onPress={event => event.stopPropagation()}
          >
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select Date</Text>

              <Pressable
                onPress={() => setCalendarVisible(false)}
                style={styles.calendarCloseButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Calendar
              current={attendanceDate}
              onDayPress={handleAttendanceDateSelect}
              markedDates={{
                [attendanceDate]: {
                  selected: true,
                  selectedColor: '#3B82F6',
                },
              }}
              theme={{
                calendarBackground: '#102844',

                backgroundColor: '#102844',

                textSectionTitleColor: '#AFC0D8',

                dayTextColor: '#F8FAFC',

                monthTextColor: '#F8FAFC',

                textDisabledColor: '#51657D',

                selectedDayBackgroundColor: '#3B82F6',

                selectedDayTextColor: '#FFFFFF',

                todayTextColor: '#67D1F0',

                arrowColor: '#67D1F0',

                textMonthFontWeight: '900',

                textDayFontWeight: '600',

                textDayHeaderFontWeight: '800',
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <SelectionModal
        visible={classPickerVisible}
        title="Select Class"
        options={classOptions}
        selectedValue={selectedClassId}
        onSelect={handleClassSelect}
        onClose={() => setClassPickerVisible(false)}
      />

      <SelectionModal
        visible={coursePickerVisible}
        title="Select Course/Subject"
        options={courseOptions}
        selectedValue={selectedCourseId}
        onSelect={handleCourseSelect}
        onClose={() => setCoursePickerVisible(false)}
      />

      <SelectionModal
        visible={timeslotPickerVisible}
        title="Select Timeslot"
        options={timeslotOptions}
        selectedValue={selectedTimeslotId}
        onSelect={handleTimeslotSelect}
        onClose={() => setTimeslotPickerVisible(false)}
      />
    </View>
  );
}
