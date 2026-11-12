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

function RoutineSlotCard({ slot }) {
  const start = normalizeTime(slot?.start_time);

  const end = normalizeTime(slot?.end_time);

  const classLabel = getClassLabel(slot);

  return (
    <View style={styles.slotCard}>
      <View style={styles.slotTopRow}>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>{start}</Text>

          <Text style={styles.timeSeparator}>–</Text>

          <Text style={styles.timeText}>{end}</Text>
        </View>

        {!!slot?.subject_name && (
          <View style={styles.subjectBadge}>
            <Text style={styles.subjectBadgeText} numberOfLines={1}>
              {slot.subject_name}
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

            <Text style={styles.detailValue} numberOfLines={1}>
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

export default function Routine() {
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [me, setMe] = useState(null);

  const [caps, setCaps] = useState(null);

  const [onboarding, setOnboarding] = useState(null);

  const [routineMode, setRoutineMode] = useState('');

  const [slots, setSlots] = useState([]);

  const [schoolRoutineTarget, setSchoolRoutineTarget] = useState(null);

  const [schoolMatrix, setSchoolMatrix] = useState(null);

  const [schoolDayTemplates, setSchoolDayTemplates] = useState([]);

  const [schoolRoutineDetails, setSchoolRoutineDetails] = useState(null);

  const [teacherSchoolRoutines, setTeacherSchoolRoutines] = useState([]);

  const [addSlotModalVisible, setAddSlotModalVisible] = useState(false);

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
      const [meResponse, capsResponse, settingsResponse] = await Promise.all([
        api('/api/me'),

        api('/api/routines/v1/caps'),

        api('/api/settings/v1?keys=routine_mode'),
      ]);

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
      const settingsItems = Array.isArray(settingsResponse?.items)
        ? settingsResponse.items
        : [];

      const modeSetting = settingsItems.find(
        item => item?.key === 'routine_mode',
      );

      const mode = String(modeSetting?.value || '').trim();

      setRoutineMode(mode);

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

        const slotsResponse = await api('/api/routines/v1/tutorial-slots');

        setSlots(Array.isArray(slotsResponse) ? slotsResponse : []);

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
      const studentClass = String(me?.student_profile?.class_name || '')
        .trim()
        .toLowerCase();

      const studentSection = String(me?.student_profile?.section || '')
        .trim()
        .toLowerCase();

      return slots.filter(slot => {
        const slotClass = String(slot?.class_name || '')
          .trim()
          .toLowerCase();

        const slotSection = String(slot?.class_section || '')
          .trim()
          .toLowerCase();

        return slotClass === studentClass && slotSection === studentSection;
      });
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
                <View key={group.day} style={styles.dayCard}>
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

                  <View style={styles.daySlots}>
                    {group.items.map(slot => (
                      <RoutineSlotCard key={String(slot.id)} slot={slot} />
                    ))}
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
              <Text style={styles.addSlotModalTitle}>Add Slot</Text>

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

              {slotClassIds.length > 0 ? (
                <Text style={styles.addSlotSelectionHint}>
                  {slotClassIds.length}{' '}
                  {slotClassIds.length === 1
                    ? 'class selected'
                    : 'classes selected'}
                </Text>
              ) : null}

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

              {slotCourseIds.length > 0 ? (
                <Text style={styles.addSlotSelectionHint}>
                  {slotCourseIds.length}{' '}
                  {slotCourseIds.length === 1
                    ? 'subject selected'
                    : 'subjects selected'}
                </Text>
              ) : null}

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
                  onPress={handleSaveSlot}
                  style={({ pressed }) => [
                    styles.addSlotSaveButton,

                    savingSlot && styles.controlDisabled,

                    pressed && !savingSlot && styles.controlPressed,
                  ]}
                >
                  {savingSlot ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.addSlotSaveText}>Save</Text>
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
