import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { api } from '../../api/client';
import styles from './Routine.styles';

import DateTimePicker from '@react-native-community/datetimepicker';

import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

const DAY_NAMES = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};

const WEEKDAY_OPTIONS = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 7 },
];

function formatApiTime(date) {
  if (!(date instanceof Date)) {
    return '';
  }

  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}`;
}

function formatDisplayTime(date) {
  if (!(date instanceof Date)) {
    return 'Select time';
  }

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function normalizeTime(value) {
  if (!value) {
    return '';
  }

  const parts = String(value).split(':');

  const hours = Number(parts[0] || 0);
  const minutes = Number(parts[1] || 0);

  const suffix = hours >= 12 ? 'PM' : 'AM';

  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

function normalizePositiveId(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const id = Number(value);

  return Number.isFinite(id) && id > 0 ? id : null;
}

function getClassLabel(slot) {
  const className = slot?.class_name || '';

  const section = slot?.class_section || '';

  if (className && section) {
    return `${className} (${section})`;
  }

  return className;
}

function getTutorialSlotClasses(slot) {
  const targets = Array.isArray(slot?.targets) ? slot.targets : [];

  if (targets.length > 0) {
    return [
      ...new Set(
        targets
          .map(target => {
            const name = String(target?.class_name || '').trim();
            const section = String(target?.class_section || '').trim();

            if (!name) return '';

            return section ? `${name} (${section})` : name;
          })
          .filter(Boolean),
      ),
    ].join(', ');
  }

  return getClassLabel(slot) || 'Not assigned';
}

function getTutorialSlotSubjects(slot) {
  const targets = Array.isArray(slot?.targets) ? slot.targets : [];

  const subjects = [
    ...new Set(
      targets
        .map(target => String(target?.subject_name || '').trim())
        .filter(Boolean),
    ),
  ];

  return subjects.length > 0
    ? subjects.join(', ')
    : slot?.subject_name || 'Subject not assigned';
}

function getStudentTutorialTargets(slot, studentProfile) {
  const targets = Array.isArray(slot?.targets) ? slot.targets : [];

  const studentGroupId = normalizePositiveId(studentProfile?.class_group_id);

  const studentClass = String(studentProfile?.class_name || '')
    .trim()
    .toLowerCase();

  const studentSection = String(studentProfile?.section || '')
    .trim()
    .toLowerCase();

  const matchesClass = target => {
    const targetGroupId = normalizePositiveId(target?.class_group_id);

    if (studentGroupId !== null && targetGroupId !== null) {
      return studentGroupId === targetGroupId;
    }

    return (
      String(target?.class_name || '')
        .trim()
        .toLowerCase() === studentClass &&
      String(target?.class_section || '')
        .trim()
        .toLowerCase() === studentSection
    );
  };

  if (targets.length > 0) {
    return targets.filter(matchesClass);
  }

  // Fallback for an older single-class response.
  const fallback = {
    class_group_id: slot?.class_group_id,
    class_name: slot?.class_name,
    class_section: slot?.class_section,
    subject_name: slot?.subject_name,
  };

  return matchesClass(fallback) ? [fallback] : [];
}

function parseSlotTime(value) {
  if (!value) return null;

  const parts = String(value).split(':').map(Number);
  const [hours, minutes] = parts;

  if (
    !Number.isInteger(hours) ||
    hours < 0 ||
    hours > 23 ||
    !Number.isInteger(minutes) ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date;
}

function RoutineSlotCard({
  slot,
  showAllTargets = false,
  studentProfile = null,
}) {
  const start = normalizeTime(slot?.start_time);

  const end = normalizeTime(slot?.end_time);

  const classLabel = studentProfile
    ? getTutorialSlotClasses({
        ...slot,
        targets: studentTargets,
      })
    : showAllTargets
    ? getTutorialSlotClasses(slot)
    : getClassLabel(slot);

  const studentTargets = studentProfile
    ? getStudentTutorialTargets(slot, studentProfile)
    : [];

  const subjectLabel = studentProfile
    ? [
        ...new Set(
          studentTargets
            .map(target => String(target?.subject_name || '').trim())
            .filter(Boolean),
        ),
      ].join(', ') ||
      slot?.subject_name ||
      ''
    : showAllTargets
    ? getTutorialSlotSubjects(slot)
    : slot?.subject_name || '';

  return (
    <View style={styles.slotCard}>
      <View style={styles.slotTopRow}>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>{start}</Text>

          <Text style={styles.timeSeparator}>–</Text>

          <Text style={styles.timeText}>{end}</Text>
        </View>

        {!!subjectLabel && (
          <View style={[styles.subjectBadge, { maxWidth: '58%' }]}>
            <Text style={styles.subjectBadgeText} numberOfLines={2}>
              {subjectLabel}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.slotDetails}>
        {!!slot?.teacher_name && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Teacher</Text>

            <Text style={styles.detailValue} numberOfLines={1}>
              {slot.teacher_name}
            </Text>
          </View>
        )}

        {!!classLabel && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Class</Text>

            <Text
              style={[
                styles.detailValue,
                showAllTargets && {
                  flex: 1,
                  flexWrap: 'wrap',
                  lineHeight: 17,
                },
              ]}
              numberOfLines={showAllTargets ? undefined : 1}
            >
              {classLabel}
            </Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Room</Text>

          <Text style={styles.detailValue} numberOfLines={1}>
            {slot?.room_name || 'Not assigned'}
          </Text>
        </View>
      </View>
    </View>
  );
}

function TutorialAdminSlotCard({
  slot,
  quota,
  canEdit,
  onEdit,
  onDelete,
  editLoading = false,
  actionsDisabled = false,
}) {
  const start = normalizeTime(slot?.start_time);
  const end = normalizeTime(slot?.end_time);

  const subjectText = getTutorialSlotSubjects(slot);
  const classText = getTutorialSlotClasses(slot);

  const quotaText =
    quota && quota.quota != null
      ? ` (${quota.allocated ?? 0}/${quota.quota})`
      : '';

  return (
    <View style={styles.tutorialAdminSlotCard}>
      <View style={styles.tutorialAdminSlotTop}>
        <View style={styles.tutorialAdminSlotInfo}>
          <Text style={styles.tutorialAdminSlotTitle}>
            {start}–{end} · {subjectText}
          </Text>

          <Text style={styles.tutorialAdminSlotMeta}>
            {slot?.teacher_name || 'Teacher not assigned'}
            {quotaText}
          </Text>

          <Text style={styles.tutorialAdminSlotClasses}>{classText}</Text>
        </View>

        {canEdit && (
          <View style={styles.tutorialAdminSlotActions}>
            <Pressable
              onPress={() => onEdit?.(slot)}
              disabled={actionsDisabled}
              accessibilityRole="button"
              accessibilityLabel="Edit routine slot"
              style={[
                styles.tutorialAdminIconButton,
                actionsDisabled && !editLoading && styles.controlDisabled,
              ]}
            >
              {editLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.tutorialAdminIconText}>✏️</Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => onDelete?.(slot)}
              disabled={actionsDisabled}
              accessibilityRole="button"
              accessibilityLabel="Delete routine slot"
              style={styles.tutorialAdminIconButton}
            >
              <Text style={styles.tutorialAdminIconText}>🗑️</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

export default function Routine() {
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [me, setMe] = useState(null);

  const [caps, setCaps] = useState(null);

  const [onboarding, setOnboarding] = useState(null);

  const [routineMode, setRoutineMode] = useState('');

  const [slots, setSlots] = useState([]);

  const [teacherQuotaAllocations, setTeacherQuotaAllocations] = useState(null);

  const [teacherCampusSettings, setTeacherCampusSettings] = useState(null);

  const [schoolRoutineTarget, setSchoolRoutineTarget] = useState(null);

  const [schoolMatrix, setSchoolMatrix] = useState(null);

  const [schoolDayTemplates, setSchoolDayTemplates] = useState([]);

  const [schoolRoutineDetails, setSchoolRoutineDetails] = useState(null);

  const [teacherSchoolRoutines, setTeacherSchoolRoutines] = useState([]);

  const [addSlotModalVisible, setAddSlotModalVisible] = useState(false);

  const [editingSlot, setEditingSlot] = useState(null);

  const [deletingSlotId, setDeletingSlotId] = useState(null);

  const isEditingSlot = editingSlot !== null;

  const [slotOptionsLoading, setSlotOptionsLoading] = useState(false);

  const [savingSlot, setSavingSlot] = useState(false);

  const [slotOptions, setSlotOptions] = useState(null);

  const [slotStartTime, setSlotStartTime] = useState(null);

  const [slotEndTime, setSlotEndTime] = useState(null);

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);

  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [slotDayOfWeek, setSlotDayOfWeek] = useState(null);

  const [slotClassIds, setSlotClassIds] = useState([]);

  const [slotCourseIds, setSlotCourseIds] = useState([]);

  const [slotTeacherId, setSlotTeacherId] = useState(null);

  const [slotRoomId, setSlotRoomId] = useState(null);

  const [editingSlotLoadingId, setEditingSlotLoadingId] = useState(null);

  const currentRole = String(
    me?.primary_role ||
      me?.role ||
      me?.actual_primary_role ||
      me?.actual_role ||
      '',
  )
    .trim()
    .toLowerCase();

  const isTeacher = currentRole === 'teacher';
  const isStudent = currentRole === 'student';

  const isAdmin =
    me?.is_admin === true ||
    me?.is_super_admin === true ||
    currentRole === 'admin' ||
    currentRole === 'super_admin' ||
    caps?.admin === true;

  const isTutorialAdmin =
    routineMode.trim().toLowerCase() === 'tutorial' && isAdmin;

  const canEditTutorialSlots =
    isTutorialAdmin &&
    caps?.can_manage === true &&
    teacherCampusSettings?.can_edit === true;

  const hasRoutineAccess =
    caps?.student === true ||
    caps?.teacher === true ||
    caps?.admin === true ||
    caps?.can_manage === true ||
    isAdmin;

  const loadRoutine = useCallback(async ({ showLoader = true } = {}) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      /*
       * These APIs are required for all supported roles.
       */

      const [meResponse, capsResponse] = await Promise.all([
        api('/api/me'),
        api('/api/routines/v1/caps'),
      ]);

      console.log('[ROUTINE] User role:', meResponse?.role);

      console.log('[ROUTINE] Capabilities:', {
        student: capsResponse?.student,
        teacher: capsResponse?.teacher,
        admin: capsResponse?.admin,
        canManage: capsResponse?.can_manage,
        routineMode: capsResponse?.routine_mode,
      });

      setMe(meResponse || null);

      setCaps(capsResponse || null);

      const role = String(
        meResponse?.primary_role ||
          meResponse?.role ||
          meResponse?.actual_primary_role ||
          meResponse?.actual_role ||
          '',
      )
        .trim()
        .toLowerCase();

      const adminAccess =
        meResponse?.is_admin === true ||
        meResponse?.is_super_admin === true ||
        role === 'admin' ||
        role === 'super_admin' ||
        capsResponse?.admin === true ||
        capsResponse?.can_manage === true;

      /*
       * Onboarding is required only for administrator
       * functionality on this screen.
       */
      if (adminAccess) {
        const onboardingResponse = await api('/api/settings/v1/onboarding');

        setOnboarding(onboardingResponse || null);
      } else {
        setOnboarding(null);
      }

      /*
       * Read the real routine mode for every role.
       */

      // Routine mode is already returned by the capabilities API.
      const mode = String(capsResponse?.routine_mode || '').trim();

      setRoutineMode(mode);

      console.log('[ROUTINE] Selected mode:', mode);

      const hasAccess =
        capsResponse?.student === true ||
        capsResponse?.teacher === true ||
        capsResponse?.admin === true ||
        capsResponse?.can_manage === true ||
        adminAccess;

      if (!hasAccess) {
        setSlots([]);
        setTeacherSchoolRoutines([]);
        setSchoolRoutineTarget(null);
        setSchoolMatrix(null);
        setSchoolDayTemplates([]);
        setSchoolRoutineDetails(null);

        return;
      }

      /*
       * Tutorial mode.
       */

      if (mode.toLowerCase() === 'tutorial') {
        setTeacherSchoolRoutines([]);
        setSchoolRoutineTarget(null);
        setSchoolMatrix(null);
        setSchoolDayTemplates([]);
        setSchoolRoutineDetails(null);

        setTeacherQuotaAllocations(null);
        setTeacherCampusSettings(null);

        if (adminAccess) {
          const [slotsResponse, quotaResponse, campusSettingsResponse] =
            await Promise.all([
              api('/api/routines/v1/tutorial-slots'),

              api('/api/routines/v1/teacher-quota-allocations'),

              api('/api/routines/v1/teacher-campus-settings'),
            ]);

          setSlots(Array.isArray(slotsResponse) ? slotsResponse : []);

          setTeacherQuotaAllocations(quotaResponse || null);
          setTeacherCampusSettings(campusSettingsResponse || null);
        } else {
          const slotsResponse = await api('/api/routines/v1/tutorial-slots');

          setSlots(Array.isArray(slotsResponse) ? slotsResponse : []);
        }

        return;
      }

      /*
       * School mode.
       *
       * The supplied School-mode APIs currently describe
       * the student's own class routine.
       */
      if (mode.toLowerCase() === 'school') {
        setSlots([]);

        const myRoutineResponse = await api('/api/routines/v1/my');

        const myRoutines = Array.isArray(myRoutineResponse)
          ? myRoutineResponse
          : [];

        /*
         * Day templates are required by both
         * Student and Teacher School routines.
         */
        const dayTemplatesResponse = await api(
          '/api/routines/v1/day-templates',
        );

        setSchoolDayTemplates(
          Array.isArray(dayTemplatesResponse) ? dayTemplatesResponse : [],
        );

        /*
         * Student School Routine
         */
        if (role === 'student') {
          setTeacherSchoolRoutines([]);

          const studentClass = String(
            meResponse?.student_profile?.class_name || '',
          )
            .trim()
            .toLowerCase();

          const studentSection = String(
            meResponse?.student_profile?.section || '',
          )
            .trim()
            .toLowerCase();

          const target =
            myRoutines.find(item => {
              const className = String(item?.name || '')
                .trim()
                .toLowerCase();

              const section = String(item?.section || '')
                .trim()
                .toLowerCase();

              return className === studentClass && section === studentSection;
            }) ||
            myRoutines[0] ||
            null;

          setSchoolRoutineTarget(target);

          if (!target) {
            setSchoolMatrix(null);
            setSchoolRoutineDetails(null);

            return;
          }

          const classGroupId = Number(target?.class_group_id);

          const routineId = Number(target?.routine_id);

          if (!Number.isFinite(classGroupId)) {
            throw new Error('School class information is incomplete.');
          }

          const matrixResponse = await api(
            `/api/routines/v1/class/${encodeURIComponent(classGroupId)}/matrix`,
          );

          setSchoolMatrix(matrixResponse || null);

          const resolvedRoutineId = Number.isFinite(routineId)
            ? routineId
            : Number(matrixResponse?.routine?.id);

          if (Number.isFinite(resolvedRoutineId)) {
            const routineResponse = await api(
              `/api/routines/v1/${encodeURIComponent(resolvedRoutineId)}`,
            );

            setSchoolRoutineDetails(routineResponse || null);
          } else {
            setSchoolRoutineDetails(null);
          }

          return;
        }

        /*
         * Teacher School Routine
         */
        if (role === 'teacher') {
          setSchoolRoutineTarget(null);
          setSchoolMatrix(null);
          setSchoolRoutineDetails(null);

          const targets = myRoutines.filter(item =>
            Number.isFinite(Number(item?.class_group_id)),
          );

          if (targets.length === 0) {
            setTeacherSchoolRoutines([]);

            return;
          }

          /*
           * Load every class matrix returned by /my.
           *
           * Some classes may not have a routine yet.
           * That is valid and should not fail the screen.
           */
          const matrixEntries = await Promise.all(
            targets.map(async target => {
              const classGroupId = Number(target?.class_group_id);

              const matrix = await api(
                `/api/routines/v1/class/${encodeURIComponent(
                  classGroupId,
                )}/matrix`,
              );

              return {
                target,
                matrix: matrix || null,
              };
            }),
          );

          /*
           * Collect unique routine IDs so the same
           * routine is not downloaded repeatedly.
           */
          const routineIds = Array.from(
            new Set(
              matrixEntries
                .map(entry => {
                  const targetRoutineId = normalizePositiveId(
                    entry?.target?.routine_id,
                  );

                  if (targetRoutineId !== null) {
                    return targetRoutineId;
                  }

                  const matrixRoutineId = normalizePositiveId(
                    entry?.matrix?.routine?.id,
                  );

                  return matrixRoutineId;
                })
                .filter(id => id !== null),
            ),
          );

          const routineResponses = await Promise.all(
            routineIds.map(async routineId => {
              const response = await api(
                `/api/routines/v1/${encodeURIComponent(routineId)}`,
              );

              return [routineId, response || null];
            }),
          );

          const routineMap = new Map(routineResponses);

          const teacherEntries = matrixEntries.map(entry => {
            const targetRoutineId = normalizePositiveId(
              entry?.target?.routine_id,
            );

            const matrixRoutineId = normalizePositiveId(
              entry?.matrix?.routine?.id,
            );

            const routineId = targetRoutineId ?? matrixRoutineId;

            return {
              ...entry,

              routineDetails:
                routineId !== null ? routineMap.get(routineId) || null : null,
            };
          });

          setTeacherSchoolRoutines(teacherEntries);

          return;
        }

        /*
         * Other roles are not handled for
         * School mode on this screen yet.
         */
        setTeacherSchoolRoutines([]);
        setSchoolRoutineTarget(null);
        setSchoolMatrix(null);
        setSchoolRoutineDetails(null);

        return;
      }

      /*
       * Clear data for unsupported combinations.
       */
      setSlots([]);
      setTeacherSchoolRoutines([]);
      setSchoolRoutineTarget(null);
      setSchoolMatrix(null);
      setSchoolDayTemplates([]);
      setSchoolRoutineDetails(null);
    } catch (error) {
      console.log('Routine load error:', error);

      Alert.alert('Routine', error?.message || 'Could not load the routine.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRoutine();

      return undefined;
    }, [loadRoutine]),
  );

  const handleAddSlot = useCallback(async () => {
    if (!isAdmin || slotOptionsLoading) {
      return;
    }

    try {
      setSlotOptionsLoading(true);

      const response = await api('/api/routines/v1/tutorial-slots/options');

      setSlotOptions(response || null);

      setEditingSlot(null);

      /*
       * Reset the form.
       */
      setSlotStartTime(null);
      setSlotEndTime(null);
      setSlotDayOfWeek(null);
      setSlotClassIds([]);
      setSlotCourseIds([]);
      setSlotTeacherId(null);
      setSlotRoomId(null);

      setAddSlotModalVisible(true);
    } catch (error) {
      console.log('Load tutorial slot options error:', error);

      Alert.alert('Add Slot', error?.message || 'Could not load slot options.');
    } finally {
      setSlotOptionsLoading(false);
    }
  }, [isAdmin, slotOptionsLoading]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await loadRoutine({
        showLoader: false,
      });
    } finally {
      setRefreshing(false);
    }
  }, [loadRoutine]);

  const visibleSlots = useMemo(() => {
    if (!Array.isArray(slots)) {
      return [];
    }

    /*
     * Teacher sees only their own slots.
     */
    if (isTeacher) {
      return slots.filter(slot => Number(slot?.teacher_id) === Number(me?.id));
    }

    /*
     * Student sees only their own class/section.
     */
    if (isStudent) {
      return slots.filter(
        slot => getStudentTutorialTargets(slot, me?.student_profile).length > 0,
      );
    }

    /*
     * Admin sees all slots.
     */
    return slots;
  }, [
    slots,
    isTeacher,
    isStudent,
    me?.id,
    me?.student_profile?.class_name,
    me?.student_profile?.section,
  ]);

  const classOptions = useMemo(() => {
    const rows = Array.isArray(slotOptions?.classes) ? slotOptions.classes : [];

    return rows.map(item => ({
      label: item?.section
        ? `${item?.name} (${item?.section})`
        : item?.name || `Class ${item?.id}`,

      value: Number(item?.id),
    }));
  }, [slotOptions?.classes]);

  const courseOptions = useMemo(() => {
    const courses = Array.isArray(slotOptions?.courses)
      ? slotOptions.courses
      : [];

    const courseClasses = Array.isArray(slotOptions?.courseClasses)
      ? slotOptions.courseClasses
      : [];

    /*
     * Do not show generic "All periods today".
     * Only show subjects that are mapped to
     * every selected class.
     */
    return courses
      .filter(course => {
        const courseId = Number(course?.id);

        if (!courseId) {
          return false;
        }

        if (slotClassIds.length === 0) {
          return courseClasses.some(
            mapping => Number(mapping?.course_id) === courseId,
          );
        }

        return slotClassIds.every(classId =>
          courseClasses.some(
            mapping =>
              Number(mapping?.course_id) === courseId &&
              Number(mapping?.class_group_id) === Number(classId),
          ),
        );
      })
      .map(course => ({
        label: course?.title || `Course ${course?.id}`,
        value: Number(course?.id),
      }));
  }, [slotOptions?.courses, slotOptions?.courseClasses, slotClassIds]);

  const teacherOptions = useMemo(() => {
    const teachers = Array.isArray(slotOptions?.teachers)
      ? slotOptions.teachers
      : [];

    const teacherClasses = Array.isArray(slotOptions?.teacherClasses)
      ? slotOptions.teacherClasses
      : [];

    return teachers
      .filter(teacher => {
        const teacherId = Number(teacher?.id);

        if (slotClassIds.length === 0) {
          return true;
        }

        return slotClassIds.every(classId =>
          teacherClasses.some(
            mapping =>
              Number(mapping?.teacher_id) === teacherId &&
              Number(mapping?.class_group_id) === Number(classId),
          ),
        );
      })
      .map(teacher => ({
        label: teacher?.name || `Teacher ${teacher?.id}`,
        value: Number(teacher?.id),
      }));
  }, [slotOptions?.teachers, slotOptions?.teacherClasses, slotClassIds]);

  const roomOptions = useMemo(() => {
    const rooms = Array.isArray(slotOptions?.rooms) ? slotOptions.rooms : [];

    return [
      {
        label: 'No room',
        value: null,
      },

      ...rooms.map(room => ({
        label: room?.name || room?.label || `Room ${room?.id}`,

        value: Number(room?.id),
      })),
    ];
  }, [slotOptions?.rooms]);

  useEffect(() => {
    const validCourseIds = new Set(
      courseOptions.map(item => Number(item.value)),
    );

    setSlotCourseIds(current =>
      current.filter(id => validCourseIds.has(Number(id))),
    );

    const validTeacherIds = new Set(
      teacherOptions.map(item => Number(item.value)),
    );

    setSlotTeacherId(current =>
      current !== null && validTeacherIds.has(Number(current)) ? current : null,
    );
  }, [courseOptions, teacherOptions]);

  const handleCloseAddSlotModal = useCallback(() => {
    if (savingSlot) {
      return;
    }

    setAddSlotModalVisible(false);

    setEditingSlot(null);

    setSlotStartTime(null);
    setSlotEndTime(null);
    setSlotDayOfWeek(null);
    setSlotClassIds([]);
    setSlotCourseIds([]);
    setSlotTeacherId(null);
    setSlotRoomId(null);

    setShowStartTimePicker(false);
    setShowEndTimePicker(false);
  }, [savingSlot]);

  const handleSaveSlot = useCallback(async () => {
    if (savingSlot) {
      return;
    }

    if (!slotStartTime) {
      Alert.alert('Add Slot', 'Start time is required.');
      return;
    }

    if (!slotEndTime) {
      Alert.alert('Add Slot', 'End time is required.');
      return;
    }

    if (!slotDayOfWeek) {
      Alert.alert('Add Slot', 'Weekday is required.');
      return;
    }

    if (slotClassIds.length === 0) {
      Alert.alert('Add Slot', 'Select at least one class.');
      return;
    }

    if (slotCourseIds.length === 0) {
      Alert.alert('Add Slot', 'Select at least one subject.');
      return;
    }

    if (!Number.isFinite(Number(slotTeacherId))) {
      Alert.alert('Add Slot', 'Teacher is required.');
      return;
    }

    const startTime = formatApiTime(slotStartTime);

    const endTime = formatApiTime(slotEndTime);

    if (endTime <= startTime) {
      Alert.alert('Add Slot', 'End time must be later than start time.');

      return;
    }

    try {
      setSavingSlot(true);

      const payload = {
        start_time: startTime,
        end_time: endTime,
        day_of_week: Number(slotDayOfWeek),

        class_group_ids: slotClassIds.map(Number),

        course_ids: slotCourseIds.map(Number),

        teacher_id: Number(slotTeacherId),

        physical_room_id:
          slotRoomId === null || slotRoomId === undefined
            ? null
            : Number(slotRoomId),
      };

      console.log('Create tutorial slot payload:', payload);

      const response = await api('/api/routines/v1/tutorial-slots', {
        method: 'POST',

        body: JSON.stringify(payload),
      });

      if (response?.ok !== true) {
        throw new Error('Could not create the routine slot.');
      }

      setAddSlotModalVisible(false);

      /*
       * Refresh the whole routine.
       */
      await loadRoutine({
        showLoader: false,
      });

      Alert.alert('Add Slot', 'Routine slot created successfully.');
    } catch (error) {
      console.log('Create tutorial slot error:', error);

      Alert.alert(
        'Add Slot',
        error?.message || 'Could not create the routine slot.',
      );
    } finally {
      setSavingSlot(false);
    }
  }, [
    savingSlot,
    slotStartTime,
    slotEndTime,
    slotDayOfWeek,
    slotClassIds,
    slotCourseIds,
    slotTeacherId,
    slotRoomId,
    loadRoutine,
  ]);

  const handleUpdateTutorialSlot = async () => {
    if (!canEditTutorialSlots || !editingSlot?.id || savingSlot) {
      return;
    }

    const startTime = slotStartTime;
    const endTime = slotEndTime;

    if (!(startTime instanceof Date) || Number.isNaN(startTime.getTime())) {
      Alert.alert('Validation', 'Please select start time.');
      return;
    }

    if (!(endTime instanceof Date) || Number.isNaN(endTime.getTime())) {
      Alert.alert('Validation', 'Please select end time.');
      return;
    }

    const toTimeString = date => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${hours}:${minutes}`;
    };

    const start = toTimeString(startTime);
    const end = toTimeString(endTime);

    if (end <= start) {
      Alert.alert('Validation', 'End time must be later than start time.');
      return;
    }

    const day = Number(slotDayOfWeek);

    if (!Number.isInteger(day) || day < 1 || day > 7) {
      Alert.alert('Validation', 'Please select a weekday.');
      return;
    }

    const classGroupIds = [
      ...new Set(
        slotClassIds.map(Number).filter(id => Number.isInteger(id) && id > 0),
      ),
    ];

    const courseIds = [
      ...new Set(
        slotCourseIds.map(Number).filter(id => Number.isInteger(id) && id > 0),
      ),
    ];

    if (classGroupIds.length === 0) {
      Alert.alert('Validation', 'Please select at least one class.');
      return;
    }

    if (courseIds.length === 0) {
      Alert.alert('Validation', 'Please select at least one subject.');
      return;
    }

    const teacherId = Number(slotTeacherId);

    if (!Number.isInteger(teacherId) || teacherId <= 0) {
      Alert.alert('Validation', 'Please select a teacher.');
      return;
    }

    const roomId =
      slotRoomId == null || slotRoomId === '' ? null : Number(slotRoomId);

    if (roomId !== null && (!Number.isInteger(roomId) || roomId <= 0)) {
      Alert.alert('Validation', 'Please select a valid room.');
      return;
    }

    const payload = {
      start_time: start,
      end_time: end,
      day_of_week: day,
      class_group_ids: classGroupIds,
      course_ids: courseIds,
      teacher_id: teacherId,
      physical_room_id: roomId,
    };

    try {
      setSavingSlot(true);

      const response = await api(
        `/api/routines/v1/tutorial-slots/${editingSlot.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (response?.ok !== true) {
        throw new Error('Unable to update tutorial slot.');
      }

      // Close and clear Edit state only after success.
      setAddSlotModalVisible(false);
      setEditingSlot(null);

      // Refresh routine cards and teacher quota.
      await loadRoutine({ showLoader: false });

      Alert.alert('Success', 'Tutorial slot updated successfully.');
    } catch (error) {
      console.log('[UPDATE TUTORIAL SLOT ERROR]', {
        status: error?.status,
        message: error?.message,
        payload: error?.payload,
      });

      Alert.alert(
        'Update Failed',
        error?.message || 'Could not update tutorial slot.',
      );
    } finally {
      setSavingSlot(false);
    }
  };

  const tutorialTeacherQuotaMap = useMemo(() => {
    const map = new Map();

    const teachers = Array.isArray(teacherQuotaAllocations?.teachers)
      ? teacherQuotaAllocations.teachers
      : [];

    teachers.forEach(teacher => {
      map.set(Number(teacher.teacher_id), {
        allocated: teacher.allocated,
        quota: teacher.quota,
      });
    });

    return map;
  }, [teacherQuotaAllocations]);

  const handleEditTutorialSlot = async slot => {
    if (
      !canEditTutorialSlots ||
      !slot?.id ||
      editingSlotLoadingId !== null ||
      slotOptionsLoading
    ) {
      return;
    }

    try {
      setEditingSlotLoadingId(slot.id);
      setSlotOptionsLoading(true);

      const response = await api('/api/routines/v1/tutorial-slots/options');

      const availableClasses = Array.isArray(response?.classes)
        ? response.classes
        : [];

      const availableCourses = Array.isArray(response?.courses)
        ? response.courses
        : [];

      const availableTeachers = Array.isArray(response?.teachers)
        ? response.teachers
        : [];

      const classIds = [
        ...new Set(
          (Array.isArray(slot.class_group_ids) &&
          slot.class_group_ids.length > 0
            ? slot.class_group_ids
            : (slot.targets || []).map(target => target.class_group_id)
          )
            .map(Number)
            .filter(id => Number.isInteger(id) && id > 0),
        ),
      ].filter(id => availableClasses.some(item => Number(item.id) === id));

      const courseIds = [
        ...new Set(
          (Array.isArray(slot.course_ids) && slot.course_ids.length > 0
            ? slot.course_ids
            : (slot.targets || []).map(target => target.course_id)
          )
            .map(Number)
            .filter(id => Number.isInteger(id) && id > 0),
        ),
      ].filter(id => availableCourses.some(item => Number(item.id) === id));

      const teacherId = Number(slot.teacher_id);

      if (
        !availableTeachers.some(teacher => Number(teacher.id) === teacherId)
      ) {
        throw new Error('Assigned teacher is not available.');
      }

      setSlotOptions(response);
      setEditingSlot(slot);

      setSlotStartTime(parseSlotTime(slot.start_time));
      setSlotEndTime(parseSlotTime(slot.end_time));
      setSlotDayOfWeek(Number(slot.day_of_week));

      setSlotClassIds(classIds);
      setSlotCourseIds(courseIds);
      setSlotTeacherId(teacherId);

      setSlotRoomId(
        slot.physical_room_id == null ? null : Number(slot.physical_room_id),
      );

      setShowStartTimePicker(false);
      setShowEndTimePicker(false);

      setAddSlotModalVisible(true);
    } catch (error) {
      console.log('[EDIT TUTORIAL SLOT ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      Alert.alert(
        'Edit Slot',
        error?.message || 'Unable to load slot details.',
      );
    } finally {
      setEditingSlotLoadingId(null);
      setSlotOptionsLoading(false);
    }
  };

  const handleDeleteTutorialSlot = useCallback(
    slot => {
      if (!canEditTutorialSlots || !slot?.id || deletingSlotId !== null) {
        return;
      }

      const startTime = normalizeTime(slot.start_time);
      const endTime = normalizeTime(slot.end_time);

      Alert.alert(
        'Delete Tutorial Slot',
        `Delete the ${startTime}–${endTime} tutorial slot?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                setDeletingSlotId(slot.id);

                const response = await api(
                  `/api/routines/v1/tutorial-slots/${slot.id}`,
                  {
                    method: 'DELETE',
                  },
                );

                if (response?.ok !== true) {
                  throw new Error('Could not delete the tutorial slot.');
                }

                await loadRoutine({
                  showLoader: false,
                });

                Alert.alert('Success', 'Tutorial slot deleted successfully.');
              } catch (error) {
                console.log('[DELETE TUTORIAL SLOT ERROR]', error);

                Alert.alert(
                  'Delete Slot',
                  error?.message || 'Could not delete the tutorial slot.',
                );
              } finally {
                setDeletingSlotId(null);
              }
            },
          },
        ],
      );
    },
    [canEditTutorialSlots, deletingSlotId, loadRoutine],
  );

  const groupedDays = useMemo(() => {
    const map = {};

    visibleSlots.forEach(slot => {
      const day = Number(slot?.day_of_week);

      if (!DAY_NAMES[day]) {
        return;
      }

      if (!map[day]) {
        map[day] = [];
      }

      map[day].push(slot);
    });

    Object.keys(map).forEach(day => {
      map[day].sort((a, b) =>
        String(a?.start_time || '').localeCompare(String(b?.start_time || '')),
      );
    });

    return Object.keys(map)
      .map(Number)
      .sort((a, b) => a - b)
      .map(day => ({
        day,
        name: DAY_NAMES[day],
        items: map[day],
      }));
  }, [visibleSlots]);

  const schoolDays = useMemo(() => {
    if (!schoolRoutineDetails || !schoolMatrix) {
      return [];
    }

    const templates = Array.isArray(schoolDayTemplates)
      ? schoolDayTemplates
      : [];

    const routineDays = Array.isArray(schoolRoutineDetails?.days)
      ? schoolRoutineDetails.days
      : [];

    const assignments =
      schoolMatrix?.assignments && typeof schoolMatrix.assignments === 'object'
        ? schoolMatrix.assignments
        : {};

    const templateMap = new Map();

    templates.forEach(template => {
      templateMap.set(Number(template?.id), template);
    });

    const routineDayMap = new Map();

    routineDays.forEach(day => {
      routineDayMap.set(Number(day?.day_of_week), day);
    });

    return Object.keys(DAY_NAMES)
      .map(Number)
      .sort((a, b) => a - b)
      .map(dayNumber => {
        const routineDay = routineDayMap.get(dayNumber);

        const template = routineDay
          ? templateMap.get(Number(routineDay?.day_template_id))
          : null;

        const periods = Array.isArray(template?.periods)
          ? [...template.periods]
              .filter(period => period?.active !== false)
              .sort((a, b) => Number(a?.period_order) - Number(b?.period_order))
          : [];

        const items = periods.map(period => {
          const periodOrder = Number(period?.period_order);

          const assignmentKey = `${dayNumber}_${periodOrder}`;

          const assignment = assignments?.[assignmentKey] || null;

          return {
            ...period,

            assignment,
          };
        });

        return {
          day: dayNumber,

          name: DAY_NAMES[dayNumber],

          templateName: template?.name || '',

          periods: items,
        };
      });
  }, [schoolRoutineDetails, schoolMatrix, schoolDayTemplates]);

  const teacherSchoolDays = useMemo(() => {
    const teacherId = Number(me?.id);

    if (!Number.isFinite(teacherId)) {
      return [];
    }

    const templates = Array.isArray(schoolDayTemplates)
      ? schoolDayTemplates
      : [];

    const templateMap = new Map();

    templates.forEach(template => {
      templateMap.set(Number(template?.id), template);
    });

    const dayMap = {};

    Object.keys(DAY_NAMES)
      .map(Number)
      .forEach(day => {
        dayMap[day] = [];
      });

    teacherSchoolRoutines.forEach(entry => {
      const target = entry?.target || {};

      const matrix = entry?.matrix || {};

      const routineDetails = entry?.routineDetails;

      const assignments = matrix?.assignments;

      /*
       * Backend may return [] when there
       * are no assignments for this class.
       */
      if (
        !assignments ||
        Array.isArray(assignments) ||
        typeof assignments !== 'object'
      ) {
        return;
      }

      const routineDays = Array.isArray(routineDetails?.days)
        ? routineDetails.days
        : [];

      const routineDayMap = new Map();

      routineDays.forEach(day => {
        routineDayMap.set(Number(day?.day_of_week), day);
      });

      const className = String(target?.name || '').trim();

      const section = String(target?.section || '').trim();

      const classLabel =
        className && section
          ? `${className} (${section})`
          : className || `Class ${target?.class_group_id}`;

      Object.entries(assignments).forEach(([key, assignment]) => {
        if (Number(assignment?.teacher_id) !== teacherId) {
          return;
        }

        const [dayValue, periodValue] = String(key).split('_');

        const dayNumber = Number(dayValue);

        const periodOrder = Number(periodValue);

        if (!DAY_NAMES[dayNumber] || !Number.isFinite(periodOrder)) {
          return;
        }

        const routineDay = routineDayMap.get(dayNumber);

        const template = routineDay
          ? templateMap.get(Number(routineDay?.day_template_id))
          : null;

        const periods = Array.isArray(template?.periods)
          ? template.periods
          : [];

        const period =
          periods.find(item => Number(item?.period_order) === periodOrder) ||
          null;

        dayMap[dayNumber].push({
          key: `${target?.class_group_id}_${key}`,

          day: dayNumber,

          periodOrder,

          periodLabel: period?.label || `Period ${periodOrder}`,

          startTime: period?.start_time || '',

          endTime: period?.end_time || '',

          classGroupId: Number(target?.class_group_id),

          classLabel,

          courseId: assignment?.course_id,

          courseName: assignment?.course_name || 'Subject',

          teacherName: assignment?.teacher_name || me?.name || 'Teacher',

          roomName: assignment?.physical_room_name || '',

          routineName:
            routineDetails?.name ||
            matrix?.routine?.name ||
            target?.routine_name ||
            '',
        });
      });
    });

    return Object.keys(DAY_NAMES)
      .map(Number)
      .sort((a, b) => a - b)
      .map(day => {
        const items = dayMap[day] || [];

        items.sort((a, b) => {
          if (a.periodOrder !== b.periodOrder) {
            return a.periodOrder - b.periodOrder;
          }

          return String(a.classLabel).localeCompare(String(b.classLabel));
        });

        return {
          day,

          name: DAY_NAMES[day],

          items,
        };
      });
  }, [teacherSchoolRoutines, schoolDayTemplates, me?.id, me?.name]);

  const teacherSchoolClassCount = useMemo(() => {
    return teacherSchoolDays.reduce(
      (total, day) => total + day.items.length,
      0,
    );
  }, [teacherSchoolDays]);

  const classLabel = [
    me?.student_profile?.class_name,
    me?.student_profile?.section,
  ]
    .filter(Boolean)
    .join(' - ');

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading routine...</Text>
      </View>
    );
  }

  const normalizedRoutineMode = routineMode.trim().toLowerCase();

  const isTutorial = normalizedRoutineMode === 'tutorial';

  const isSchool = normalizedRoutineMode === 'school';

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#E2E8F0"
          />
        }
      >
        {/* Page header */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.headerTextArea}>
              <Text style={styles.title}>
                {isSchool && (isStudent || isTeacher)
                  ? 'My Routine'
                  : 'Routine'}
              </Text>

              <Text style={styles.subtitle}>
                {isSchool && isStudent
                  ? 'Your weekly school timetable'
                  : isAdmin
                  ? 'Weekly routine overview'
                  : isTeacher
                  ? 'Your weekly teaching schedule'
                  : 'Your weekly class schedule'}
              </Text>
            </View>

            {!!routineMode && (
              <View style={styles.modeBadge}>
                <Text style={styles.modeBadgeText}>{routineMode}</Text>
              </View>
            )}
          </View>

          {isAdmin && isTutorial ? (
            <View style={styles.adminRoutineActions}>
              <Pressable
                disabled={slotOptionsLoading}
                onPress={handleAddSlot}
                style={({ pressed }) => [
                  styles.addSlotButton,

                  slotOptionsLoading && styles.controlDisabled,

                  pressed && !slotOptionsLoading && styles.controlPressed,
                ]}
              >
                {slotOptionsLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.addSlotButtonText}>Add Slot</Text>
                )}
              </Pressable>
            </View>
          ) : null}

          {!!classLabel && (
            <View style={styles.studentInfo}>
              <Text style={styles.studentInfoLabel}>Class</Text>

              <Text style={styles.studentInfoValue}>{classLabel}</Text>
            </View>
          )}
        </View>

        {!hasRoutineAccess ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Routine unavailable</Text>

            <Text style={styles.emptyText}>
              Routine access is not available for this account.
            </Text>
          </View>
        ) : isSchool && isTeacher ? (
          <>
            <View style={styles.schoolSummaryCard}>
              <View style={styles.schoolSummaryTop}>
                <View style={styles.schoolSummaryText}>
                  <Text style={styles.schoolRoutineName}>
                    My Teaching Schedule
                  </Text>

                  <Text style={styles.schoolRoutineClass}>
                    {teacherSchoolClassCount}{' '}
                    {teacherSchoolClassCount === 1
                      ? 'class scheduled'
                      : 'classes scheduled'}
                  </Text>
                </View>

                <View style={styles.schoolModeBadge}>
                  <Text style={styles.schoolModeBadgeText}>School</Text>
                </View>
              </View>
            </View>

            {teacherSchoolClassCount === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No routine found</Text>

                <Text style={styles.emptyText}>
                  There are no school periods assigned to you.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.sectionHeading}>
                  <Text style={styles.sectionTitle}>
                    Weekly Teaching Schedule
                  </Text>

                  <Text style={styles.slotCount}>
                    {teacherSchoolClassCount}{' '}
                    {teacherSchoolClassCount === 1 ? 'class' : 'classes'}
                  </Text>
                </View>

                {teacherSchoolDays.map(day => (
                  <View key={String(day.day)} style={styles.schoolDayCard}>
                    <View style={styles.schoolDayHeader}>
                      <View style={styles.dayIcon}>
                        <Text style={styles.dayIconText}>
                          {day.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>

                      <View style={styles.schoolDayHeaderText}>
                        <Text style={styles.dayName}>{day.name}</Text>

                        <Text style={styles.daySubtitle}>
                          {day.items.length}{' '}
                          {day.items.length === 1 ? 'class' : 'classes'}
                        </Text>
                      </View>
                    </View>

                    {day.items.length === 0 ? (
                      <View style={styles.schoolNoClassBox}>
                        <Text style={styles.schoolNoClassText}>
                          No classes scheduled
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.schoolPeriods}>
                        {day.items.map(item => (
                          <View key={item.key} style={styles.schoolPeriodCard}>
                            <View style={styles.schoolPeriodTop}>
                              <View style={styles.schoolPeriodNumber}>
                                <Text style={styles.schoolPeriodNumberText}>
                                  #{item.periodOrder}
                                </Text>
                              </View>

                              <View style={styles.schoolPeriodHeading}>
                                <Text style={styles.schoolPeriodLabel}>
                                  {item.periodLabel}
                                </Text>

                                <Text style={styles.schoolPeriodTime}>
                                  {normalizeTime(item.startTime)}
                                  {' - '}
                                  {normalizeTime(item.endTime)}
                                </Text>
                              </View>
                            </View>

                            <View style={styles.schoolAssignment}>
                              <Text style={styles.schoolSubject}>
                                {item.courseName}
                              </Text>

                              <View style={styles.schoolAssignmentMeta}>
                                <Text style={styles.schoolTeacher}>
                                  Class: {item.classLabel}
                                </Text>

                                {item.roomName ? (
                                  <Text style={styles.schoolRoom}>
                                    Room: {item.roomName}
                                  </Text>
                                ) : null}
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </>
            )}
          </>
        ) : isSchool && isStudent ? (
          <>
            <View style={styles.schoolSummaryCard}>
              <View style={styles.schoolSummaryTop}>
                <View style={styles.schoolSummaryText}>
                  <Text style={styles.schoolRoutineName}>
                    {schoolRoutineDetails?.name ||
                      schoolMatrix?.routine?.name ||
                      'School Routine'}
                  </Text>

                  <Text style={styles.schoolRoutineClass}>
                    {schoolRoutineTarget?.name || ''}
                    {schoolRoutineTarget?.section
                      ? ` (${schoolRoutineTarget.section})`
                      : ''}
                  </Text>
                </View>

                <View style={styles.schoolModeBadge}>
                  <Text style={styles.schoolModeBadgeText}>School</Text>
                </View>
              </View>
            </View>

            {schoolDays.every(day => day.periods.length === 0) ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No routine found</Text>

                <Text style={styles.emptyText}>
                  No school routine has been configured for your class.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.sectionHeading}>
                  <Text style={styles.sectionTitle}>Weekly Timetable</Text>

                  <Text style={styles.slotCount}>
                    {schoolRoutineTarget?.name || ''}
                    {schoolRoutineTarget?.section
                      ? ` (${schoolRoutineTarget.section})`
                      : ''}
                  </Text>
                </View>

                {schoolDays.map(day => (
                  <View key={String(day.day)} style={styles.schoolDayCard}>
                    <View style={styles.schoolDayHeader}>
                      <View style={styles.dayIcon}>
                        <Text style={styles.dayIconText}>
                          {day.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>

                      <View style={styles.schoolDayHeaderText}>
                        <Text style={styles.dayName}>{day.name}</Text>

                        <Text style={styles.daySubtitle}>
                          {day.templateName || 'No template assigned'}
                        </Text>
                      </View>

                      {day.periods.length > 0 ? (
                        <Text style={styles.schoolPeriodCount}>
                          {day.periods.length}{' '}
                          {day.periods.length === 1 ? 'period' : 'periods'}
                        </Text>
                      ) : null}
                    </View>

                    {day.periods.length === 0 ? (
                      <View style={styles.schoolNoClassBox}>
                        <Text style={styles.schoolNoClassText}>
                          No classes scheduled
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.schoolPeriods}>
                        {day.periods.map(period => {
                          const assignment = period?.assignment;

                          const periodLabel = String(
                            period?.label || `Period ${period?.period_order}`,
                          );

                          const normalizedLabel = periodLabel
                            .trim()
                            .toLowerCase();

                          const isBreak =
                            normalizedLabel.includes('tiffin') ||
                            normalizedLabel.includes('break');

                          return (
                            <View
                              key={`${day.day}_${period?.period_order}`}
                              style={[
                                styles.schoolPeriodCard,

                                isBreak && styles.schoolBreakCard,
                              ]}
                            >
                              <View style={styles.schoolPeriodTop}>
                                <View style={styles.schoolPeriodNumber}>
                                  <Text style={styles.schoolPeriodNumberText}>
                                    #{period?.period_order}
                                  </Text>
                                </View>

                                <View style={styles.schoolPeriodHeading}>
                                  <Text style={styles.schoolPeriodLabel}>
                                    {periodLabel}
                                  </Text>

                                  <Text style={styles.schoolPeriodTime}>
                                    {normalizeTime(period?.start_time)}
                                    {' - '}
                                    {normalizeTime(period?.end_time)}
                                  </Text>
                                </View>
                              </View>

                              {assignment ? (
                                <View style={styles.schoolAssignment}>
                                  <Text style={styles.schoolSubject}>
                                    {assignment?.course_name}
                                  </Text>

                                  <View style={styles.schoolAssignmentMeta}>
                                    <Text style={styles.schoolTeacher}>
                                      Teacher:{' '}
                                      {assignment?.teacher_name ||
                                        'Not assigned'}
                                    </Text>

                                    {assignment?.physical_room_name ? (
                                      <Text style={styles.schoolRoom}>
                                        Room: {assignment.physical_room_name}
                                      </Text>
                                    ) : null}
                                  </View>
                                </View>
                              ) : (
                                <View style={styles.schoolEmptyAssignment}>
                                  <Text
                                    style={
                                      isBreak
                                        ? styles.schoolBreakText
                                        : styles.schoolEmptyAssignmentText
                                    }
                                  >
                                    {isBreak ? 'Break' : 'No class'}
                                  </Text>
                                </View>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                ))}
              </>
            )}
          </>
        ) : isTutorial ? (
          groupedDays.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No routine found</Text>

              <Text style={styles.emptyText}>
                {isAdmin
                  ? 'No tutorial slots have been created yet.'
                  : isTeacher
                  ? 'There are no tutorial slots assigned to you.'
                  : 'There are no tutorial slots available for your class.'}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.sectionHeading}>
                <Text style={styles.sectionTitle}>Weekly Tutorial Slots</Text>

                <Text style={styles.slotCount}>
                  {visibleSlots.length}{' '}
                  {visibleSlots.length === 1 ? 'slot' : 'slots'}
                </Text>
              </View>

              {groupedDays.map(group => (
                <View
                  key={group.day}
                  style={[
                    styles.dayCard,
                    isTutorialAdmin && styles.tutorialAdminDayCard,
                  ]}
                >
                  <View style={styles.dayHeader}>
                    <View style={styles.dayIcon}>
                      <Text style={styles.dayIconText}>
                        {String(group.name).charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    <View>
                      <Text style={styles.dayName}>{group.name}</Text>

                      <Text style={styles.daySubtitle}>
                        {group.items.length}{' '}
                        {group.items.length === 1 ? 'class' : 'classes'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.daySlots,
                      isTutorialAdmin && styles.tutorialAdminDaySlots,
                    ]}
                  >
                    {group.items.map(slot =>
                      isTutorialAdmin ? (
                        <TutorialAdminSlotCard
                          key={`tutorial-admin-slot-${slot.id}`}
                          slot={slot}
                          quota={tutorialTeacherQuotaMap.get(
                            Number(slot.teacher_id),
                          )}
                          canEdit={canEditTutorialSlots}
                          editLoading={
                            Number(editingSlotLoadingId) === Number(slot.id) &&
                            editingSlotLoadingId !== null
                          }
                          actionsDisabled={
                            editingSlotLoadingId !== null ||
                            deletingSlotId !== null
                          }
                          onEdit={handleEditTutorialSlot}
                          onDelete={handleDeleteTutorialSlot}
                        />
                      ) : (
                        <RoutineSlotCard
                          key={`tutorial-slot-${slot.id}`}
                          slot={slot}
                          showAllTargets={isTutorial && isTeacher}
                          studentProfile={
                            isTutorial && isStudent ? me?.student_profile : null
                          }
                        />
                      ),
                    )}
                  </View>
                </View>
              ))}
            </>
          )
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              {routineMode ? `${routineMode} Routine` : 'Routine'}
            </Text>

            <Text style={styles.emptyText}>
              This routine mode is not available on this screen yet.
            </Text>
          </View>
        )}
      </ScrollView>
      <Modal
        visible={addSlotModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseAddSlotModal}
      >
        <View style={styles.addSlotBackdrop}>
          <View style={styles.addSlotModal}>
            <View style={styles.addSlotHeader}>
              <Text style={styles.addSlotModalTitle}>
                {isEditingSlot ? 'Edit Slot' : 'Add Slot'}
              </Text>

              <Pressable
                disabled={savingSlot}
                onPress={handleCloseAddSlotModal}
                style={({ pressed }) => [
                  styles.addSlotCloseButton,
                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.addSlotCloseText}>×</Text>
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.addSlotForm}
            >
              <View style={styles.addSlotTwoColumnRow}>
                <View style={styles.addSlotHalfField}>
                  <Text style={styles.addSlotLabel}>Start time</Text>

                  <Pressable
                    onPress={() => setShowStartTimePicker(true)}
                    style={styles.addSlotInputButton}
                  >
                    <Text
                      style={[
                        styles.addSlotInputText,
                        !slotStartTime && styles.addSlotPlaceholder,
                      ]}
                    >
                      {formatDisplayTime(slotStartTime)}
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.addSlotHalfField}>
                  <Text style={styles.addSlotLabel}>End time</Text>

                  <Pressable
                    onPress={() => setShowEndTimePicker(true)}
                    style={styles.addSlotInputButton}
                  >
                    <Text
                      style={[
                        styles.addSlotInputText,
                        !slotEndTime && styles.addSlotPlaceholder,
                      ]}
                    >
                      {formatDisplayTime(slotEndTime)}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {showStartTimePicker ? (
                <DateTimePicker
                  value={slotStartTime || new Date()}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, value) => {
                    if (Platform.OS === 'android') {
                      setShowStartTimePicker(false);
                    }

                    if (event?.type === 'dismissed') {
                      return;
                    }

                    if (value) {
                      setSlotStartTime(value);
                    }
                  }}
                />
              ) : null}

              {showEndTimePicker ? (
                <DateTimePicker
                  value={slotEndTime || new Date()}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, value) => {
                    if (Platform.OS === 'android') {
                      setShowEndTimePicker(false);
                    }

                    if (event?.type === 'dismissed') {
                      return;
                    }

                    if (value) {
                      setSlotEndTime(value);
                    }
                  }}
                />
              ) : null}

              <Text style={styles.addSlotLabel}>Weekday</Text>

              <Dropdown
                style={styles.addSlotDropdown}
                containerStyle={styles.addSlotDropdownContainer}
                selectedTextStyle={styles.addSlotSelectedText}
                itemTextStyle={styles.addSlotItemText}
                placeholderStyle={styles.addSlotPlaceholder}
                activeColor="#173B60"
                iconColor="#DCE7F5"
                data={WEEKDAY_OPTIONS}
                labelField="label"
                valueField="value"
                value={slotDayOfWeek}
                placeholder="Select..."
                onChange={item => setSlotDayOfWeek(item?.value ?? null)}
              />

              <Text style={styles.addSlotLabel}>Classes (one or more)</Text>

              <MultiSelect
                style={styles.addSlotDropdown}
                containerStyle={styles.addSlotDropdownContainer}
                selectedTextStyle={styles.addSlotSelectedText}
                itemTextStyle={styles.addSlotItemText}
                placeholderStyle={styles.addSlotPlaceholder}
                activeColor="#173B60"
                iconColor="#DCE7F5"
                data={classOptions}
                labelField="label"
                valueField="value"
                value={slotClassIds}
                placeholder="Select classes..."
                search
                searchPlaceholder="Search class..."
                visibleSelectedItem={false}
                onChange={values => {
                  setSlotClassIds(values);
                }}
              />

              {slotClassIds.length > 0 && (
                <View style={styles.slotSelectedChips}>
                  {slotClassIds.map(classId => {
                    const item = classOptions.find(
                      option => Number(option.value) === Number(classId),
                    );

                    return (
                      <Pressable
                        key={`class-chip-${classId}`}
                        onPress={() => {
                          setSlotClassIds(current =>
                            current.filter(
                              id => Number(id) !== Number(classId),
                            ),
                          );
                        }}
                        style={styles.slotSelectedChip}
                      >
                        <Text style={styles.slotSelectedChipText}>
                          {item?.label || `Class ${classId}`}
                        </Text>

                        <Text style={styles.slotSelectedChipRemove}>×</Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              <Text style={styles.addSlotLabel}>Subjects (one or more)</Text>

              <MultiSelect
                style={styles.addSlotDropdown}
                containerStyle={styles.addSlotDropdownContainer}
                selectedTextStyle={styles.addSlotSelectedText}
                itemTextStyle={styles.addSlotItemText}
                placeholderStyle={styles.addSlotPlaceholder}
                activeColor="#173B60"
                iconColor="#DCE7F5"
                data={courseOptions}
                labelField="label"
                valueField="value"
                value={slotCourseIds}
                placeholder="Select subjects..."
                search
                searchPlaceholder="Search subject..."
                visibleSelectedItem={false}
                onChange={values => {
                  setSlotCourseIds(values);
                }}
              />

              {slotCourseIds.length > 0 && (
                <View style={styles.slotSelectedChips}>
                  {slotCourseIds.map(courseId => {
                    const item = courseOptions.find(
                      option => Number(option.value) === Number(courseId),
                    );

                    return (
                      <Pressable
                        key={`subject-chip-${courseId}`}
                        onPress={() => {
                          setSlotCourseIds(current =>
                            current.filter(
                              id => Number(id) !== Number(courseId),
                            ),
                          );
                        }}
                        style={styles.slotSelectedChip}
                      >
                        <Text style={styles.slotSelectedChipText}>
                          {item?.label || `Subject ${courseId}`}
                        </Text>

                        <Text style={styles.slotSelectedChipRemove}>×</Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              <Text style={styles.addSlotLabel}>Teacher</Text>

              <Dropdown
                style={styles.addSlotDropdown}
                containerStyle={styles.addSlotDropdownContainer}
                selectedTextStyle={styles.addSlotSelectedText}
                itemTextStyle={styles.addSlotItemText}
                placeholderStyle={styles.addSlotPlaceholder}
                activeColor="#173B60"
                iconColor="#DCE7F5"
                data={teacherOptions}
                labelField="label"
                valueField="value"
                value={slotTeacherId}
                placeholder="Select..."
                onChange={item => setSlotTeacherId(item?.value ?? null)}
              />

              <Text style={styles.addSlotLabel}>Room (optional)</Text>

              <Dropdown
                style={styles.addSlotDropdown}
                containerStyle={styles.addSlotDropdownContainer}
                selectedTextStyle={styles.addSlotSelectedText}
                itemTextStyle={styles.addSlotItemText}
                placeholderStyle={styles.addSlotPlaceholder}
                activeColor="#173B60"
                iconColor="#DCE7F5"
                data={roomOptions}
                labelField="label"
                valueField="value"
                value={slotRoomId}
                placeholder="No room"
                onChange={item => setSlotRoomId(item?.value ?? null)}
              />

              <View style={styles.addSlotActions}>
                <Pressable
                  disabled={savingSlot}
                  onPress={handleCloseAddSlotModal}
                  style={({ pressed }) => [
                    styles.addSlotCancelButton,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.addSlotCancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={savingSlot}
                  onPress={
                    isEditingSlot ? handleUpdateTutorialSlot : handleSaveSlot
                  }
                  style={({ pressed }) => [
                    styles.addSlotSaveButton,

                    savingSlot && styles.controlDisabled,

                    pressed && !savingSlot && styles.controlPressed,
                  ]}
                >
                  {savingSlot ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.addSlotSaveText}>
                      {isEditingSlot ? 'Save Changes' : 'Save'}
                    </Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
