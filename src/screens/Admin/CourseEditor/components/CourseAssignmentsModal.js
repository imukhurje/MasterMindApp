import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { COLORS, styles } from './CourseAssignmentsModal.styles';

function getErrorMessage(error, fallback) {
  return (
    error?.payload?.message ||
    error?.payload?.error ||
    error?.message ||
    fallback
  );
}

function normalizeIds(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return [
    ...new Set(
      values
        .map(value => Number(value))
        .filter(value => Number.isFinite(value)),
    ),
  ].sort((a, b) => a - b);
}

function serializeIds(values) {
  return normalizeIds(values).join(',');
}

function getInitials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
}

function setStudentMembership(ids, studentId, shouldInclude) {
  const numericStudentId = Number(studentId);

  const set = new Set(normalizeIds(ids));

  if (shouldInclude) {
    set.add(numericStudentId);
  } else {
    set.delete(numericStudentId);
  }

  return Array.from(set).sort((a, b) => a - b);
}

export default function CourseAssignmentsModal({ visible, onClose }) {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  const isTablet = width >= 700 && width < 1050;

  /*
   * Main course-assignment screen.
   */

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [loadError, setLoadError] = useState('');

  const [courses, setCourses] = useState([]);

  const [students, setStudents] = useState([]);

  const [classGroups, setClassGroups] = useState([]);

  const [assignments, setAssignments] = useState({});

  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const [savedStudentIds, setSavedStudentIds] = useState([]);

  const [studentSearch, setStudentSearch] = useState('');

  const [classGroupSearch, setClassGroupSearch] = useState('');

  const [selectedClassGroupIds, setSelectedClassGroupIds] = useState([]);

  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  /*
   * Per-student assignment editor.
   */

  const [studentEditorVisible, setStudentEditorVisible] = useState(false);

  const [studentEditorLoading, setStudentEditorLoading] = useState(false);

  const [studentEditorSaving, setStudentEditorSaving] = useState(false);

  const [studentEditorError, setStudentEditorError] = useState('');

  const [studentEditorData, setStudentEditorData] = useState(null);

  const [studentAssignedCourseIds, setStudentAssignedCourseIds] = useState([]);

  const [savedStudentCourseIds, setSavedStudentCourseIds] = useState([]);

  const [selectedAssignedCourseIds, setSelectedAssignedCourseIds] = useState(
    [],
  );

  const [selectedAvailableCourseIds, setSelectedAvailableCourseIds] = useState(
    [],
  );

  /*
   * Main screen computed values.
   */

  const changed = useMemo(() => {
    return serializeIds(selectedStudentIds) !== serializeIds(savedStudentIds);
  }, [selectedStudentIds, savedStudentIds]);

  const selectedCourse = useMemo(() => {
    return courses.find(
      course => String(course?.id) === String(selectedCourseId),
    );
  }, [courses, selectedCourseId]);

  const classGroupMap = useMemo(() => {
    const map = new Map();

    classGroups.forEach(group => {
      map.set(String(group?.id), group);
    });

    return map;
  }, [classGroups]);

  const selectedStudentIdSet = useMemo(() => {
    return new Set(normalizeIds(selectedStudentIds).map(String));
  }, [selectedStudentIds]);

  const filteredClassGroups = useMemo(() => {
    const query = classGroupSearch.trim().toLowerCase();

    if (!query) {
      return [];
    }

    const selectedSet = new Set(selectedClassGroupIds.map(String));

    return classGroups
      .filter(group => {
        if (selectedSet.has(String(group?.id))) {
          return false;
        }

        const label = String(group?.label || '').toLowerCase();

        const name = String(group?.name || '').toLowerCase();

        return label.includes(query) || name.includes(query);
      })
      .slice(0, 12);
  }, [classGroupSearch, classGroups, selectedClassGroupIds]);

  const selectedClassGroups = useMemo(() => {
    return selectedClassGroupIds
      .map(id => classGroupMap.get(String(id)))
      .filter(Boolean);
  }, [classGroupMap, selectedClassGroupIds]);

  const visibleStudents = useMemo(() => {
    const search = studentSearch.trim().toLowerCase();

    const selectedGroupSet = new Set(selectedClassGroupIds.map(String));

    return students.filter(student => {
      const name = String(student?.name || '').toLowerCase();

      const email = String(student?.email || '').toLowerCase();

      if (search && !name.includes(search) && !email.includes(search)) {
        return false;
      }

      if (selectedGroupSet.size > 0) {
        const studentGroups = Array.isArray(student?.class_group_ids)
          ? student.class_group_ids
          : [];

        const matchesGroup = studentGroups.some(groupId =>
          selectedGroupSet.has(String(groupId)),
        );

        if (!matchesGroup) {
          return false;
        }
      }

      return true;
    });
  }, [students, studentSearch, selectedClassGroupIds]);

  /*
   * Per-student editor computed values.
   */

  const studentEditorChanged = useMemo(() => {
    return (
      serializeIds(studentAssignedCourseIds) !==
      serializeIds(savedStudentCourseIds)
    );
  }, [studentAssignedCourseIds, savedStudentCourseIds]);

  const studentAllCourses = useMemo(() => {
    const map = new Map();

    const assigned = Array.isArray(studentEditorData?.assigned_courses)
      ? studentEditorData.assigned_courses
      : [];

    const unassigned = Array.isArray(studentEditorData?.unassigned_courses)
      ? studentEditorData.unassigned_courses
      : [];

    [...assigned, ...unassigned].forEach(course => {
      if (!course?.id) {
        return;
      }

      map.set(String(course.id), course);
    });

    return Array.from(map.values());
  }, [studentEditorData]);

  const studentAssignedCourseIdSet = useMemo(() => {
    return new Set(normalizeIds(studentAssignedCourseIds).map(String));
  }, [studentAssignedCourseIds]);

  const studentAssignedCourses = useMemo(() => {
    return studentAllCourses.filter(course =>
      studentAssignedCourseIdSet.has(String(course?.id)),
    );
  }, [studentAllCourses, studentAssignedCourseIdSet]);

  const studentAvailableCourses = useMemo(() => {
    return studentAllCourses.filter(
      course => !studentAssignedCourseIdSet.has(String(course?.id)),
    );
  }, [studentAllCourses, studentAssignedCourseIdSet]);

  /*
   * Load main assignment data.
   */

  const loadAssignments = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const response = await api('/api/online/assignments', {
        method: 'GET',
      });

      const nextCourses = Array.isArray(response?.courses)
        ? response.courses
        : [];

      const nextStudents = Array.isArray(response?.students)
        ? response.students
        : [];

      const nextClassGroups = Array.isArray(response?.class_groups)
        ? response.class_groups
        : [];

      const nextAssignments =
        response?.assignments && typeof response.assignments === 'object'
          ? response.assignments
          : {};

      setCourses(nextCourses);

      setStudents(nextStudents);

      setClassGroups(nextClassGroups);

      setAssignments(nextAssignments);

      const nextCourseId = nextCourses.length > 0 ? nextCourses[0].id : null;

      setSelectedCourseId(nextCourseId);

      const currentAssigned = normalizeIds(
        nextAssignments?.[String(nextCourseId)] || [],
      );

      setSelectedStudentIds(currentAssigned);

      setSavedStudentIds(currentAssigned);

      setStudentSearch('');

      setClassGroupSearch('');

      setSelectedClassGroupIds([]);

      setCourseDropdownOpen(false);

      setStudentEditorVisible(false);

      setStudentEditorData(null);
    } catch (error) {
      console.log('Course assignments load error:', error);

      setLoadError(
        getErrorMessage(error, 'Could not load course assignments.'),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    loadAssignments();
  }, [visible, loadAssignments]);

  /*
   * Main course selector.
   */

  function applyCourseSelection(courseId) {
    const assignmentIds = normalizeIds(assignments?.[String(courseId)] || []);

    setSelectedCourseId(courseId);

    setSelectedStudentIds(assignmentIds);

    setSavedStudentIds(assignmentIds);

    setStudentSearch('');

    setClassGroupSearch('');

    setSelectedClassGroupIds([]);

    setCourseDropdownOpen(false);
  }

  function handleCourseSelection(courseId) {
    if (String(courseId) === String(selectedCourseId)) {
      setCourseDropdownOpen(false);

      return;
    }

    if (!changed) {
      applyCourseSelection(courseId);

      return;
    }

    Alert.alert(
      'Discard unsaved changes?',
      'Switching courses will discard the unsaved assignment changes for the current course.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Discard',
          style: 'destructive',

          onPress: () => applyCourseSelection(courseId),
        },
      ],
    );
  }

  /*
   * Main student selection.
   */

  function handleToggleStudent(studentId) {
    if (saving) {
      return;
    }

    const numericId = Number(studentId);

    setSelectedStudentIds(previous => {
      const set = new Set(normalizeIds(previous));

      if (set.has(numericId)) {
        set.delete(numericId);
      } else {
        set.add(numericId);
      }

      return Array.from(set).sort((a, b) => a - b);
    });
  }

  function handleSelectVisible() {
    if (saving || visibleStudents.length === 0) {
      return;
    }

    setSelectedStudentIds(previous => {
      const set = new Set(normalizeIds(previous));

      visibleStudents.forEach(student => {
        const id = Number(student?.id);

        if (Number.isFinite(id)) {
          set.add(id);
        }
      });

      return Array.from(set).sort((a, b) => a - b);
    });
  }

  function handleClear() {
    if (saving) {
      return;
    }

    setSelectedStudentIds([]);
  }

  /*
   * Class group filters.
   */

  function handleAddClassGroup(groupId) {
    const numericId = Number(groupId);

    if (!Number.isFinite(numericId)) {
      return;
    }

    setSelectedClassGroupIds(previous => {
      if (previous.some(id => Number(id) === numericId)) {
        return previous;
      }

      return [...previous, numericId];
    });

    setClassGroupSearch('');
  }

  function handleRemoveClassGroup(groupId) {
    setSelectedClassGroupIds(previous =>
      previous.filter(id => String(id) !== String(groupId)),
    );
  }

  function getStudentClassLabel(student) {
    const groupIds = Array.isArray(student?.class_group_ids)
      ? student.class_group_ids
      : [];

    const labels = groupIds
      .map(groupId => classGroupMap.get(String(groupId))?.label)
      .filter(Boolean);

    if (labels.length === 0) {
      return 'No Class-group';
    }

    return labels.join(', ');
  }

  /*
   * Save assignments for the
   * currently selected course.
   */

  async function handleSave() {
    if (saving || !changed || !selectedCourseId) {
      return;
    }

    const studentIds = normalizeIds(selectedStudentIds);

    try {
      setSaving(true);

      const response = await api(
        `/api/online/assignments/${selectedCourseId}`,
        {
          method: 'PUT',

          body: JSON.stringify({
            student_ids: studentIds,
          }),
        },
      );

      if (!response?.ok) {
        throw new Error('The server did not confirm the assignment update.');
      }

      const finalStudentIds = normalizeIds(
        Array.isArray(response?.student_ids)
          ? response.student_ids
          : studentIds,
      );

      setSelectedStudentIds(finalStudentIds);

      setSavedStudentIds(finalStudentIds);

      setAssignments(previous => ({
        ...previous,

        [String(selectedCourseId)]: finalStudentIds,
      }));

      Alert.alert(
        'Assignments Saved',
        `${response?.assigned_count ?? finalStudentIds.length} student${
          (response?.assigned_count ?? finalStudentIds.length) === 1 ? '' : 's'
        } assigned to this course.`,
      );
    } catch (error) {
      console.log('Course assignment save error:', error);

      Alert.alert(
        'Could not save assignments',
        getErrorMessage(error, 'The course assignments could not be saved.'),
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * Open one student's
   * course-assignment editor.
   *
   * GET
   * /api/online/assignments/student/{id}
   */

  async function handleOpenStudentEditor(studentId) {
    if (studentEditorLoading || saving) {
      return;
    }

    try {
      setStudentEditorVisible(true);

      setStudentEditorLoading(true);

      setStudentEditorError('');

      setStudentEditorData(null);

      setSelectedAssignedCourseIds([]);

      setSelectedAvailableCourseIds([]);

      const response = await api(
        `/api/online/assignments/student/${studentId}`,
        {
          method: 'GET',
        },
      );

      if (!response?.student?.id) {
        throw new Error(
          'The server did not return the student assignment information.',
        );
      }

      const assignedIds = normalizeIds(
        Array.isArray(response?.assigned_courses)
          ? response.assigned_courses.map(course => course.id)
          : [],
      );

      setStudentEditorData(response);

      setStudentAssignedCourseIds(assignedIds);

      setSavedStudentCourseIds(assignedIds);
    } catch (error) {
      console.log('Student course assignment load error:', error);

      setStudentEditorError(
        getErrorMessage(
          error,
          'Could not load this student’s course assignments.',
        ),
      );
    } finally {
      setStudentEditorLoading(false);
    }
  }

  function closeStudentEditor() {
    if (studentEditorSaving) {
      return;
    }

    if (!studentEditorChanged) {
      setStudentEditorVisible(false);

      setStudentEditorData(null);

      return;
    }

    Alert.alert(
      'Discard unsaved changes?',
      'The course changes made for this student have not been saved.',
      [
        {
          text: 'Keep Editing',
          style: 'cancel',
        },

        {
          text: 'Discard',
          style: 'destructive',

          onPress: () => {
            setStudentEditorVisible(false);

            setStudentEditorData(null);
          },
        },
      ],
    );
  }

  /*
   * Toggle course selection inside
   * Assigned / Available panes.
   */

  function toggleAssignedCourseSelection(courseId) {
    const numericId = Number(courseId);

    setSelectedAssignedCourseIds(previous => {
      const set = new Set(normalizeIds(previous));

      if (set.has(numericId)) {
        set.delete(numericId);
      } else {
        set.add(numericId);
      }

      return Array.from(set);
    });
  }

  function toggleAvailableCourseSelection(courseId) {
    const numericId = Number(courseId);

    setSelectedAvailableCourseIds(previous => {
      const set = new Set(normalizeIds(previous));

      if (set.has(numericId)) {
        set.delete(numericId);
      } else {
        set.add(numericId);
      }

      return Array.from(set);
    });
  }

  /*
   * Available -> Assigned.
   */

  function moveToAssigned() {
    if (selectedAvailableCourseIds.length === 0) {
      return;
    }

    setStudentAssignedCourseIds(previous =>
      normalizeIds([...previous, ...selectedAvailableCourseIds]),
    );

    setSelectedAvailableCourseIds([]);
  }

  /*
   * Assigned -> Available.
   */

  function moveToAvailable() {
    if (selectedAssignedCourseIds.length === 0) {
      return;
    }

    const removalSet = new Set(selectedAssignedCourseIds.map(String));

    setStudentAssignedCourseIds(previous =>
      normalizeIds(
        previous.filter(courseId => !removalSet.has(String(courseId))),
      ),
    );

    setSelectedAssignedCourseIds([]);
  }

  /*
   * Sync one student's saved courses
   * back into the main assignments map.
   */

  function syncStudentAssignmentState(studentId, assignedCourseIds) {
    const numericStudentId = Number(studentId);

    const assignedCourseSet = new Set(
      normalizeIds(assignedCourseIds).map(String),
    );

    setAssignments(previous => {
      const next = {
        ...previous,
      };

      const knownCourseIds = new Set([
        ...courses.map(course => String(course.id)),

        ...Object.keys(previous),

        ...Array.from(assignedCourseSet),
      ]);

      knownCourseIds.forEach(courseId => {
        const currentlyAssigned = normalizeIds(previous?.[courseId] || []);

        next[courseId] = setStudentMembership(
          currentlyAssigned,
          numericStudentId,
          assignedCourseSet.has(String(courseId)),
        );
      });

      return next;
    });

    /*
     * Keep the currently selected
     * course UI synchronized too.
     */
    if (selectedCourseId !== null && selectedCourseId !== undefined) {
      const assignedToCurrentCourse = assignedCourseSet.has(
        String(selectedCourseId),
      );

      setSelectedStudentIds(previous =>
        setStudentMembership(
          previous,
          numericStudentId,
          assignedToCurrentCourse,
        ),
      );

      setSavedStudentIds(previous =>
        setStudentMembership(
          previous,
          numericStudentId,
          assignedToCurrentCourse,
        ),
      );
    }
  }

  /*
   * PUT
   * /api/online/assignments/student/{id}
   *
   * {
   *   course_ids: [...]
   * }
   */

  async function saveStudentCourseAssignments() {
    const studentId = studentEditorData?.student?.id;

    if (!studentId || studentEditorSaving || !studentEditorChanged) {
      return;
    }

    const courseIds = normalizeIds(studentAssignedCourseIds);

    try {
      setStudentEditorSaving(true);

      const response = await api(
        `/api/online/assignments/student/${studentId}`,
        {
          method: 'PUT',

          body: JSON.stringify({
            course_ids: courseIds,
          }),
        },
      );

      if (!response?.ok) {
        throw new Error(
          'The server did not confirm the student assignment update.',
        );
      }

      const finalCourseIds = normalizeIds(
        Array.isArray(response?.course_ids) ? response.course_ids : courseIds,
      );

      setStudentAssignedCourseIds(finalCourseIds);

      setSavedStudentCourseIds(finalCourseIds);

      setSelectedAssignedCourseIds([]);

      setSelectedAvailableCourseIds([]);

      syncStudentAssignmentState(studentId, finalCourseIds);

      Alert.alert(
        'Course Assignments Updated',
        `${response?.assigned_count ?? finalCourseIds.length} course${
          (response?.assigned_count ?? finalCourseIds.length) === 1 ? '' : 's'
        } assigned to ${studentEditorData?.student?.name || 'this student'}.`,
      );
    } catch (error) {
      console.log('Student course assignment save error:', error);

      Alert.alert(
        'Could not save changes',
        getErrorMessage(
          error,
          'The student’s course assignments could not be saved.',
        ),
      );
    } finally {
      setStudentEditorSaving(false);
    }
  }

  /*
   * Close complete Assignments modal.
   */

  function closeModal() {
    if (studentEditorVisible) {
      closeStudentEditor();

      return;
    }

    if (saving) {
      return;
    }

    if (!changed) {
      onClose?.();

      return;
    }

    Alert.alert(
      'Discard unsaved changes?',
      'You have unsaved assignment changes.',
      [
        {
          text: 'Keep Editing',
          style: 'cancel',
        },

        {
          text: 'Discard',
          style: 'destructive',

          onPress: () => onClose?.(),
        },
      ],
    );
  }

  /*
   * Student editor UI.
   */

  function renderStudentEditor() {
    if (studentEditorLoading) {
      return (
        <View style={styles.studentEditorState}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />

          <Text style={styles.stateText}>
            Loading student course assignments...
          </Text>
        </View>
      );
    }

    if (studentEditorError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>
            Could not load student assignments
          </Text>

          <Text style={styles.errorText}>{studentEditorError}</Text>

          <Pressable
            onPress={() =>
              handleOpenStudentEditor(studentEditorData?.student?.id)
            }
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    const student = studentEditorData?.student;

    if (!student) {
      return null;
    }

    const selectedAssignedSet = new Set(selectedAssignedCourseIds.map(String));

    const selectedAvailableSet = new Set(
      selectedAvailableCourseIds.map(String),
    );

    return (
      <>
        {/* Student editor header */}

        <View style={styles.studentEditorHeader}>
          <View style={styles.studentEditorHeaderText}>
            <Text style={styles.studentEditorTitle}>
              Course assignments — {student.name}
            </Text>

            <Text style={styles.studentEditorSubtitle}>
              Move selected courses between the two panes, then save.
            </Text>
          </View>

          <Pressable
            onPress={closeStudentEditor}
            disabled={studentEditorSaving}
            style={({ pressed }) => [
              styles.studentCloseButton,

              pressed && !studentEditorSaving && styles.buttonPressed,

              studentEditorSaving && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.studentCloseButtonText}>Close</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.studentEditorScroll}
          contentContainerStyle={styles.studentEditorContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Student summary */}

          <View style={styles.studentSummaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Name</Text>

              <Text style={styles.summaryValue} numberOfLines={2}>
                {student.name || '—'}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Class</Text>

              <Text style={styles.summaryValue}>{student.class || '—'}</Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Section</Text>

              <Text style={styles.summaryValue}>{student.section || '—'}</Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Roll Number</Text>

              <Text style={styles.summaryValue}>
                {student.roll_number || '—'}
              </Text>
            </View>
          </View>

          {/* Course panes */}

          <View
            style={[
              styles.courseTransferLayout,

              isMobile && styles.courseTransferLayoutMobile,
            ]}
          >
            {/* Assigned */}

            <View style={styles.coursePane}>
              <View style={styles.coursePaneHeader}>
                <Text style={styles.coursePaneTitle}>Assigned courses</Text>

                <Text style={styles.coursePaneCount}>
                  {studentAssignedCourses.length}
                </Text>
              </View>

              <View style={styles.coursePaneBody}>
                {studentAssignedCourses.length === 0 ? (
                  <Text style={styles.emptyPaneText}>No courses assigned</Text>
                ) : (
                  studentAssignedCourses.map(course => {
                    const selected = selectedAssignedSet.has(String(course.id));

                    return (
                      <Pressable
                        key={course.id}
                        onPress={() => toggleAssignedCourseSelection(course.id)}
                        style={({ pressed }) => [
                          styles.courseSelectionRow,

                          selected && styles.courseSelectionRowSelected,

                          pressed && styles.buttonPressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.courseCheckbox,

                            selected && styles.courseCheckboxSelected,
                          ]}
                        >
                          {selected ? (
                            <Text style={styles.courseCheckboxTick}>✓</Text>
                          ) : null}
                        </View>

                        <Text
                          style={styles.courseSelectionTitle}
                          numberOfLines={2}
                        >
                          {course.title}
                        </Text>
                      </Pressable>
                    );
                  })
                )}
              </View>
            </View>

            {/* Transfer arrows */}

            <View
              style={[
                styles.transferControls,

                isMobile && styles.transferControlsMobile,
              ]}
            >
              <Pressable
                onPress={moveToAssigned}
                disabled={
                  selectedAvailableCourseIds.length === 0 || studentEditorSaving
                }
                style={({ pressed }) => [
                  styles.transferButton,

                  (selectedAvailableCourseIds.length === 0 ||
                    studentEditorSaving) &&
                    styles.buttonDisabled,

                  pressed &&
                    selectedAvailableCourseIds.length > 0 &&
                    styles.buttonPressed,
                ]}
              >
                <Text style={styles.transferButtonText}>
                  {isMobile ? '← Assign' : '←'}
                </Text>
              </Pressable>

              <Pressable
                onPress={moveToAvailable}
                disabled={
                  selectedAssignedCourseIds.length === 0 || studentEditorSaving
                }
                style={({ pressed }) => [
                  styles.transferButton,

                  (selectedAssignedCourseIds.length === 0 ||
                    studentEditorSaving) &&
                    styles.buttonDisabled,

                  pressed &&
                    selectedAssignedCourseIds.length > 0 &&
                    styles.buttonPressed,
                ]}
              >
                <Text style={styles.transferButtonText}>
                  {isMobile ? 'Unassign →' : '→'}
                </Text>
              </Pressable>
            </View>

            {/* Available */}

            <View style={styles.coursePane}>
              <View style={styles.coursePaneHeader}>
                <Text style={styles.coursePaneTitle}>Available courses</Text>

                <Text style={styles.coursePaneCount}>
                  {studentAvailableCourses.length}
                </Text>
              </View>

              <View style={styles.coursePaneBody}>
                {studentAvailableCourses.length === 0 ? (
                  <Text style={styles.emptyPaneText}>
                    No additional courses available
                  </Text>
                ) : (
                  studentAvailableCourses.map(course => {
                    const selected = selectedAvailableSet.has(
                      String(course.id),
                    );

                    return (
                      <Pressable
                        key={course.id}
                        onPress={() =>
                          toggleAvailableCourseSelection(course.id)
                        }
                        style={({ pressed }) => [
                          styles.courseSelectionRow,

                          selected && styles.courseSelectionRowSelected,

                          pressed && styles.buttonPressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.courseCheckbox,

                            selected && styles.courseCheckboxSelected,
                          ]}
                        >
                          {selected ? (
                            <Text style={styles.courseCheckboxTick}>✓</Text>
                          ) : null}
                        </View>

                        <Text
                          style={styles.courseSelectionTitle}
                          numberOfLines={2}
                        >
                          {course.title}
                        </Text>
                      </Pressable>
                    );
                  })
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Student editor footer */}

        <View
          style={[
            styles.studentEditorFooter,

            isMobile && styles.studentEditorFooterMobile,
          ]}
        >
          <Pressable
            onPress={closeStudentEditor}
            disabled={studentEditorSaving}
            style={({ pressed }) => [
              styles.studentCancelButton,

              isMobile && styles.studentFooterButtonMobile,

              pressed && !studentEditorSaving && styles.buttonPressed,
            ]}
          >
            <Text style={styles.studentCancelButtonText}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={saveStudentCourseAssignments}
            disabled={studentEditorSaving || !studentEditorChanged}
            style={({ pressed }) => [
              styles.studentSaveButton,

              isMobile && styles.studentFooterButtonMobile,

              (studentEditorSaving || !studentEditorChanged) &&
                styles.buttonDisabled,

              pressed &&
                !studentEditorSaving &&
                studentEditorChanged &&
                styles.buttonPressed,
            ]}
          >
            {studentEditorSaving ? (
              <ActivityIndicator size="small" color={COLORS.TEXT} />
            ) : (
              <Text style={styles.studentSaveButtonText}>Save changes</Text>
            )}
          </Pressable>
        </View>
      </>
    );
  }

  /*
   * Main assignment screen.
   */

  function renderMainAssignments() {
    return (
      <>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.modalTitle}>Assign Published Courses</Text>

            <Text style={styles.modalSubtitle}>
              Choose a course, select students individually or by Class-group,
              then save.
            </Text>
          </View>

          <Pressable
            onPress={closeModal}
            disabled={saving}
            style={({ pressed }) => [
              styles.closeButton,

              pressed && !saving && styles.buttonPressed,

              saving && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={COLORS.BLUE} />

            <Text style={styles.stateText}>Loading assignments...</Text>
          </View>
        ) : loadError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Could not load assignments</Text>

            <Text style={styles.errorText}>{loadError}</Text>

            <Pressable onPress={loadAssignments} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  styles.topFieldsRow,

                  isMobile && styles.topFieldsRowMobile,
                ]}
              >
                {/* Course */}

                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Published course</Text>

                  <Pressable
                    onPress={() => setCourseDropdownOpen(previous => !previous)}
                    style={styles.selectButton}
                  >
                    <Text style={styles.selectButtonText} numberOfLines={1}>
                      {selectedCourse?.title || 'Select a course'}
                    </Text>

                    <Text style={styles.chevron}>
                      {courseDropdownOpen ? '⌃' : '⌄'}
                    </Text>
                  </Pressable>

                  {courseDropdownOpen ? (
                    <View style={styles.dropdownList}>
                      {courses.map(course => {
                        const selected =
                          String(course.id) === String(selectedCourseId);

                        return (
                          <Pressable
                            key={course.id}
                            onPress={() => handleCourseSelection(course.id)}
                            style={[
                              styles.dropdownItem,

                              selected && styles.dropdownItemSelected,
                            ]}
                          >
                            <Text style={styles.dropdownItemText}>
                              {course.title}
                            </Text>

                            {selected ? (
                              <Text style={styles.dropdownCheck}>✓</Text>
                            ) : null}
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : null}
                </View>

                {/* Student Search */}

                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Find a student</Text>

                  <TextInput
                    value={studentSearch}
                    onChangeText={setStudentSearch}
                    placeholder="Search by name or email"
                    placeholderTextColor={COLORS.PLACEHOLDER}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* Class Filter */}

              <View style={styles.classFilterSection}>
                <Text style={styles.fieldLabel}>
                  Filter and select by Class-group
                </Text>

                <TextInput
                  value={classGroupSearch}
                  onChangeText={setClassGroupSearch}
                  placeholder="Type to find a Class-group..."
                  placeholderTextColor={COLORS.PLACEHOLDER}
                  style={[styles.textInput, styles.classGroupInput]}
                />

                {filteredClassGroups.length > 0 ? (
                  <View style={styles.classSearchResults}>
                    {filteredClassGroups.map(group => (
                      <Pressable
                        key={group.id}
                        onPress={() => handleAddClassGroup(group.id)}
                        style={styles.classSearchItem}
                      >
                        <View style={styles.classSearchText}>
                          <Text style={styles.classSearchLabel}>
                            {group.label}
                          </Text>

                          <Text style={styles.classSearchCount}>
                            {Array.isArray(group?.student_ids)
                              ? group.student_ids.length
                              : 0}{' '}
                            students
                          </Text>
                        </View>

                        <Text style={styles.classSearchAdd}>+</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}

                <View style={styles.selectedGroupsContainer}>
                  {selectedClassGroups.length === 0 ? (
                    <Text style={styles.noGroupsText}>
                      No Class-groups selected
                    </Text>
                  ) : (
                    selectedClassGroups.map(group => (
                      <View key={group.id} style={styles.groupChip}>
                        <Text style={styles.groupChipText}>{group.label}</Text>

                        <Pressable
                          onPress={() => handleRemoveClassGroup(group.id)}
                          style={styles.groupChipRemove}
                        >
                          <Text style={styles.groupChipRemoveText}>×</Text>
                        </Pressable>
                      </View>
                    ))
                  )}
                </View>
              </View>

              {/* Toolbar */}

              <View
                style={[
                  styles.selectionToolbar,

                  isMobile && styles.selectionToolbarMobile,
                ]}
              >
                <View>
                  <Text style={styles.selectedCount}>
                    {selectedStudentIds.length} students selected
                  </Text>

                  {studentSearch.trim() || selectedClassGroupIds.length > 0 ? (
                    <Text style={styles.visibleCount}>
                      {visibleStudents.length} students visible
                    </Text>
                  ) : null}
                </View>

                <View style={styles.selectionActions}>
                  <Pressable
                    onPress={handleSelectVisible}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>
                      Select visible
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleClear}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Clear</Text>
                  </Pressable>
                </View>
              </View>

              {/* Students */}

              <View style={styles.studentGrid}>
                {visibleStudents.map(student => {
                  const selected = selectedStudentIdSet.has(String(student.id));

                  return (
                    <View
                      key={student.id}
                      style={[
                        styles.studentCard,

                        isMobile
                          ? styles.studentCardMobile
                          : isTablet
                          ? styles.studentCardTablet
                          : styles.studentCardDesktop,

                        selected && styles.studentCardSelected,
                      ]}
                    >
                      <Pressable
                        onPress={() => handleToggleStudent(student.id)}
                        style={styles.studentSelectArea}
                      >
                        <View style={styles.avatar}>
                          <Text style={styles.avatarText}>
                            {getInitials(student.name)}
                          </Text>
                        </View>

                        <View style={styles.studentInfo}>
                          <Text style={styles.studentName} numberOfLines={1}>
                            {student.name}
                          </Text>

                          <Text style={styles.studentClass} numberOfLines={1}>
                            {getStudentClassLabel(student)}
                          </Text>

                          {student?.email ? (
                            <Text style={styles.studentEmail} numberOfLines={1}>
                              {student.email}
                            </Text>
                          ) : null}
                        </View>

                        <View
                          style={[
                            styles.checkbox,

                            selected && styles.checkboxSelected,
                          ]}
                        >
                          {selected ? (
                            <Text style={styles.checkboxTick}>✓</Text>
                          ) : null}
                        </View>
                      </Pressable>

                      {/* Student Course View */}

                      <Pressable
                        onPress={() => handleOpenStudentEditor(student.id)}
                        style={({ pressed }) => [
                          styles.studentViewButton,

                          pressed && styles.buttonPressed,
                        ]}
                      >
                        <Text style={styles.studentViewButtonText}>
                          View Courses
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            {/* Main Footer */}

            <View style={[styles.footer, isMobile && styles.footerMobile]}>
              <View style={styles.footerInfo}>
                <Text style={styles.footerCourse}>
                  {selectedCourse?.title || 'No course selected'}
                </Text>

                <Text style={styles.footerCount}>
                  {selectedStudentIds.length} selected
                </Text>
              </View>

              <Pressable
                onPress={handleSave}
                disabled={saving || !changed}
                style={[
                  styles.saveButton,

                  (saving || !changed) && styles.buttonDisabled,
                ]}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT} />
                ) : (
                  <Text style={styles.saveButtonText}>Save assignments</Text>
                )}
              </Pressable>
            </View>
          </>
        )}
      </>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={closeModal}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={styles.overlay}>
          <View style={[styles.modalCard, isMobile && styles.modalCardMobile]}>
            {studentEditorVisible
              ? renderStudentEditor()
              : renderMainAssignments()}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
