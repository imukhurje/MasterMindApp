import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { api } from '../../../api/client';
import styles from './AdminTutorialEvaluation.styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

const initialSubject = () => ({
  localId: `${Date.now()}-${Math.random()}`,
  courseId: null,
  fullMarks: '100',
});

function localDateString(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}-${m}-${date.getFullYear()}`;
}

function formatApiDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function SelectOptionsModal({ visible, title, options, onSelect, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={item => String(item.id)}
            style={styles.modalList}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={styles.hint}>No options available.</Text>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                style={styles.modalOption}
              >
                <Text style={styles.bodyText}>{item.label}</Text>
              </Pressable>
            )}
          />
          <Pressable onPress={onClose} style={styles.secondaryButton}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function AdminTutorialEvaluation({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [meta, setMeta] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [name, setName] = useState('');
  const [heldOn, setHeldOn] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [classId, setClassId] = useState(null);
  const [subjects, setSubjects] = useState([initialSubject()]);
  const [publishResults, setPublishResults] = useState(false);
  const [picker, setPicker] = useState(null); // null | { type: 'class' } | { type: 'subject', localId }
  const [gridVisible, setGridVisible] = useState(false);
  const [marks, setMarks] = useState({});
  const [absentStudents, setAbsentStudents] = useState([]);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [savingEvaluation, setSavingEvaluation] = useState(false);
  const [savedEvaluation, setSavedEvaluation] = useState(null);
  const [editingEvaluationId, setEditingEvaluationId] = useState(null);
  const [openingEvaluationId, setOpeningEvaluationId] = useState(null);

  const isEditMode = editingEvaluationId !== null;

  const loadData = useCallback(async () => {
    try {
      const me = await api('/api/me');
      const canAccess =
        me?.is_admin === true ||
        me?.is_super_admin === true ||
        ['admin', 'super_admin'].some(role =>
          [
            me?.role,
            me?.primary_role,
            me?.actual_role,
            me?.actual_primary_role,
            ...(me?.roles || []),
          ].includes(role),
        );
      if (!canAccess) {
        Alert.alert(
          'Access denied',
          'Only administrators can record tutorial evaluations.',
        );
        navigation.goBack();
        return;
      }

      const [metadata, onboarding, saved] = await Promise.all([
        api('/api/tutorial-evaluations/v1/meta'),
        api('/api/settings/v1/onboarding'),
        api('/api/tutorial-evaluations/v1'),
      ]);
      const isTutorialMode =
        String(
          onboarding?.organization?.institution_type || '',
        ).toLowerCase() === 'tutorial';
      if (metadata?.enabled !== true || !isTutorialMode) {
        setEnabled(false);
        Alert.alert(
          'Unavailable',
          'Tutorial evaluations are not enabled for this institution.',
        );
        navigation.goBack();
        return;
      }
      setEnabled(true);
      setMeta(metadata);
      setEvaluations(Array.isArray(saved?.data) ? saved.data : []);
    } catch (error) {
      console.log('[TUTORIAL EVALUATION LOAD]', error);
      Alert.alert(
        'Tutorial Evaluation',
        error?.message || 'Could not load evaluation data.',
      );
    }
  }, [navigation]);

  useEffect(() => {
    let active = true;
    // Native fetch cannot be cancelled through the existing api helper here.
    (async () => {
      try {
        await loadData();
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [loadData]);

  const classes = useMemo(
    () => (Array.isArray(meta?.classes) ? meta.classes : []),
    [meta],
  );
  const courses = useMemo(
    () =>
      Array.isArray(meta?.courses_by_class?.[String(classId)])
        ? meta.courses_by_class[String(classId)]
        : [],
    [meta, classId],
  );
  const students = useMemo(
    () =>
      Array.isArray(meta?.students_by_class?.[String(classId)])
        ? meta.students_by_class[String(classId)]
        : [],
    [meta, classId],
  );
  const currentClass = classes.find(
    item => Number(item.id) === Number(classId),
  );
  const selectedCourseIds = subjects
    .map(row => Number(row.courseId))
    .filter(Number.isFinite);

  function updateSubject(localId, patch) {
    setSubjects(current =>
      current.map(item =>
        item.localId === localId ? { ...item, ...patch } : item,
      ),
    );

    setMarks({});
    setGridVisible(false);
    setReviewVisible(false);
  }

  function removeSubject(localId) {
    setSubjects(current =>
      current.length > 1
        ? current.filter(item => item.localId !== localId)
        : [initialSubject()],
    );
    setGridVisible(false);
  }

  function changeClass(item) {
    setClassId(Number(item.id));
    setSubjects([initialSubject()]);
    setMarks({});
    setAbsentStudents([]);
    setGridVisible(false);
    setReviewVisible(false);
  }

  function toggleAbsent(studentId) {
    const id = Number(studentId);

    setAbsentStudents(current =>
      current.includes(id)
        ? current.filter(value => value !== id)
        : [...current, id],
    );

    setReviewVisible(false);
  }

  function updateStudentMark(studentId, courseId, value, fullMarks) {
    const next = String(value).trim();
    const maximum = Number(fullMarks);

    if (next !== '' && !/^\d+(\.\d{0,2})?$/.test(next)) {
      return;
    }

    if (next !== '' && Number(next) > maximum) {
      return;
    }

    setMarks(current => ({
      ...current,
      [`${studentId}:${courseId}`]: next,
    }));

    setReviewVisible(false);
  }

  function startNewEvaluation() {
    setName('');
    setHeldOn(new Date());
    setClassId(null);
    setSubjects([initialSubject()]);
    setMarks({});
    setAbsentStudents([]);
    setGridVisible(false);
    setReviewVisible(false);
    setPicker(null);
    setPublishResults(false);
    setSavedEvaluation(null);
    setEditingEvaluationId(null);
    setSavedEvaluation(null);
  }

  function reviewMarks() {
    for (const student of students) {
      if (absentStudents.includes(Number(student.id))) {
        continue;
      }

      for (const subject of subjects) {
        const key = `${student.id}:${subject.courseId}`;
        const enteredMark = String(marks[key] ?? '').trim();

        if (enteredMark === '') {
          Alert.alert(
            'Missing Marks',
            `Enter marks for ${student.name}, or mark the student absent.`,
          );
          return;
        }

        const number = Number(enteredMark);
        const maximum = Number(subject.fullMarks);

        if (!Number.isFinite(number) || number < 0 || number > maximum) {
          Alert.alert(
            'Invalid Marks',
            `${student.name}: marks must be between 0 and ${maximum}.`,
          );
          return;
        }
      }
    }

    setReviewVisible(true);
  }

  function getReviewMark(studentId, courseId) {
    const isAbsent = absentStudents.includes(Number(studentId));

    if (isAbsent) {
      return 'Absent';
    }

    const key = `${studentId}:${courseId}`;

    return String(marks[key] ?? '').trim() || '—';
  }

  function backToEditMarks() {
    setReviewVisible(false);
  }

  async function handleSaveEvaluation() {
    if (isEditMode) {
      Alert.alert(
        'Update Evaluation',
        'The existing evaluation update API is not configured yet.',
      );
      return;
    }
    if (savingEvaluation || !reviewVisible || savedEvaluation) {
      return;
    }

    const examinationName = name.trim();
    const selectedClassId = Number(classId);
    const heldOnDate = formatApiDate(heldOn);

    if (!examinationName) {
      Alert.alert('Examination Name', 'Please enter an examination name.');
      return;
    }

    if (!heldOnDate) {
      Alert.alert('Date Held', 'Please select a valid date.');
      return;
    }

    if (!Number.isInteger(selectedClassId) || selectedClassId <= 0) {
      Alert.alert('Class', 'Please select a class.');
      return;
    }

    if (!Array.isArray(subjects) || subjects.length === 0) {
      Alert.alert('Subjects', 'Please add at least one subject.');
      return;
    }

    if (!Array.isArray(students) || students.length === 0) {
      Alert.alert('Students', 'No students are available.');
      return;
    }

    const subjectPayload = [];
    const usedCourseIds = new Set();

    for (const subject of subjects) {
      const courseId = Number(subject.courseId);
      const maximum = Number(subject.fullMarks);

      if (
        !Number.isInteger(courseId) ||
        courseId <= 0 ||
        !Number.isFinite(maximum) ||
        maximum <= 0
      ) {
        Alert.alert(
          'Invalid Subject',
          'Please select a subject and enter valid full marks.',
        );
        return;
      }

      if (usedCourseIds.has(courseId)) {
        Alert.alert(
          'Duplicate Subject',
          'The same subject cannot be selected twice.',
        );
        return;
      }

      usedCourseIds.add(courseId);

      subjectPayload.push({
        course_id: courseId,
        max_marks: maximum,
      });
    }

    const absentIds = [...new Set(absentStudents.map(Number))];

    const absentSet = new Set(absentIds);

    const marksPayload = [];

    for (const student of students) {
      const studentId = Number(student.id);

      if (!Number.isInteger(studentId) || studentId <= 0) {
        Alert.alert('Student', 'Invalid student ID.');
        return;
      }

      const isAbsent = absentSet.has(studentId);
      const values = {};

      for (const subject of subjectPayload) {
        const courseId = subject.course_id;
        const key = `${studentId}:${courseId}`;

        if (isAbsent) {
          values[String(courseId)] = null;
          continue;
        }

        const rawMark = String(marks[key] ?? '').trim();

        if (rawMark === '') {
          Alert.alert(
            'Missing Marks',
            `Please enter marks for ${student.name}.`,
          );
          return;
        }

        const enteredMark = Number(rawMark);

        if (
          !Number.isFinite(enteredMark) ||
          enteredMark < 0 ||
          enteredMark > subject.max_marks
        ) {
          Alert.alert(
            'Invalid Marks',
            `${student.name}: marks must be between 0 and ${subject.max_marks}.`,
          );
          return;
        }

        values[String(courseId)] = enteredMark;
      }

      marksPayload.push({
        student_id: studentId,
        values,
      });
    }

    const payload = {
      name: examinationName,
      held_on: heldOnDate,
      class_group_id: selectedClassId,
      subjects: subjectPayload,
      marks: marksPayload,
      absent_student_ids: absentIds,
      publish_results: publishResults === true,
    };

    try {
      setSavingEvaluation(true);

      console.log('[TUTORIAL EVALUATION SAVE PAYLOAD]', payload);

      const response = await api('/api/tutorial-evaluations/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('[TUTORIAL EVALUATION SAVE RESPONSE]', response);

      if (response?.ok !== true || !response?.data?.id) {
        throw new Error('Evaluation save was not confirmed by the server.');
      }

      const savedEvaluation = response.data;

      // Save is already confirmed. Refresh failure must not
      // cause a second POST or be reported as a save failure.
      try {
        const listResponse = await api('/api/tutorial-evaluations/v1');

        setEvaluations(
          Array.isArray(listResponse?.data) ? listResponse.data : [],
        );
      } catch (refreshError) {
        console.log('[TUTORIAL EVALUATION REFRESH ERROR]', refreshError);

        // Keep the newly saved record visible locally.
        setEvaluations(current => [
          {
            id: savedEvaluation.id,
            name: savedEvaluation.name,
            held_on: savedEvaluation.held_on,
            status: savedEvaluation.status,
          },
          ...current.filter(
            item => Number(item.id) !== Number(savedEvaluation.id),
          ),
        ]);
      }

      // Clear the old form only after successful save.

      // Keep the saved marks grid visible.
      // Do not call startNewEvaluation() here.

      setSavedEvaluation({
        id: Number(savedEvaluation.id),
        name: savedEvaluation.name || examinationName,
        status: savedEvaluation.status,
        publishResults: payload.publish_results === true,
      });

      setReviewVisible(false);
      setGridVisible(true);

      Alert.alert(
        'Evaluation Saved',
        payload.publish_results === true
          ? 'Evaluation saved successfully. You can now open the marksheet.'
          : 'Evaluation saved successfully without publishing results.',
      );
    } catch (error) {
      console.log('[TUTORIAL EVALUATION SAVE ERROR]', error);

      Alert.alert(
        'Save Failed',
        error?.message || 'Could not save the tutorial evaluation.',
      );
    } finally {
      setSavingEvaluation(false);
    }
  }

  function openSavedMarksheet() {
    const examinationId = Number(savedEvaluation?.id);

    if (!Number.isInteger(examinationId) || examinationId <= 0) {
      Alert.alert('Marksheet', 'Saved examination ID is missing.');
      return;
    }

    if (
      savedEvaluation?.publishResults !== true ||
      savedEvaluation?.status !== 'result_published'
    ) {
      Alert.alert(
        'Marksheet',
        'Results must be published before opening the marksheet.',
      );
      return;
    }

    navigation.navigate('AdminExaminationDetails', {
      examinationId,
      examinationName: savedEvaluation.name,
    });
  }

  function prepareGrid() {
    if (!name.trim()) {
      Alert.alert('Examination name', 'Enter an examination name.');
      return;
    }
    if (!classId) {
      Alert.alert('Class', 'Select a class.');
      return;
    }
    if (
      subjects.some(
        item =>
          !item.courseId ||
          !Number.isFinite(Number(item.fullMarks)) ||
          Number(item.fullMarks) <= 0,
      )
    ) {
      Alert.alert(
        'Subjects',
        'Select a subject and enter valid full marks in every row.',
      );
      return;
    }
    if (new Set(selectedCourseIds).size !== selectedCourseIds.length) {
      Alert.alert('Subjects', 'The same subject cannot be added twice.');
      return;
    }
    if (students.length === 0) {
      Alert.alert('Students', 'There are no students in the selected class.');
      return;
    }
    setGridVisible(true);
  }

  async function openSavedEvaluation(item) {
    const evaluationId = Number(item?.id);

    if (
      !Number.isInteger(evaluationId) ||
      evaluationId <= 0 ||
      openingEvaluationId !== null ||
      savingEvaluation
    ) {
      return;
    }

    try {
      setOpeningEvaluationId(evaluationId);

      const response = await api(
        `/api/tutorial-evaluations/v1/${evaluationId}`,
      );

      const data = response?.data;

      if (!data || Number(data.id) !== evaluationId) {
        throw new Error('Evaluation details were not found.');
      }

      const nextClassId = Number(data.class_group_id);

      const nextSubjects = (
        Array.isArray(data.subjects) ? data.subjects : []
      ).map((subject, index) => ({
        localId: `edit-${evaluationId}-${subject.course_id}-${index}`,
        courseId: Number(subject.course_id),
        fullMarks: String(subject.max_marks ?? 100),
      }));

      const nextMarks = {};
      const nextAbsentIds = [];

      (Array.isArray(data.students) ? data.students : []).forEach(student => {
        const studentId = Number(student.id);

        if (student.absent === true) {
          nextAbsentIds.push(studentId);
        }

        nextSubjects.forEach(subject => {
          const courseId = subject.courseId;

          const markValue = student.marks?.[String(courseId)] ?? null;

          nextMarks[`${studentId}:${courseId}`] =
            markValue === null ? '' : String(markValue);
        });
      });

      // Parse the API date as a local calendar date.
      const dateText = String(data.held_on || '').slice(0, 10);
      const [year, month, day] = dateText.split('-').map(Number);

      const parsedDate = new Date(year, month - 1, day);

      if (
        !year ||
        !month ||
        !day ||
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() !== month - 1 ||
        parsedDate.getDate() !== day
      ) {
        throw new Error('The evaluation date is invalid.');
      }

      setEditingEvaluationId(evaluationId);
      setName(String(data.name || ''));
      setHeldOn(parsedDate);
      setClassId(nextClassId);

      setSubjects(nextSubjects.length > 0 ? nextSubjects : [initialSubject()]);

      setMarks(nextMarks);
      setAbsentStudents(nextAbsentIds);

      setPublishResults(data.status === 'result_published');

      setGridVisible(true);
      setReviewVisible(false);
      setPicker(null);

      // Keep the existing saved record available
      // for Open Marksheet navigation.
      setSavedEvaluation({
        id: evaluationId,
        name: String(data.name || ''),
        status: String(data.status || ''),
        publishResults: data.status === 'result_published',
      });
    } catch (error) {
      console.log('[OPEN TUTORIAL EVALUATION ERROR]', error);

      Alert.alert(
        'Open Evaluation Failed',
        error?.message || 'Could not load evaluation details.',
      );
    } finally {
      setOpeningEvaluationId(null);
    }
  }

  async function refreshSaved() {
    try {
      setRefreshing(true);
      const response = await api('/api/tutorial-evaluations/v1');
      setEvaluations(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      Alert.alert(
        'Refresh failed',
        error?.message || 'Could not refresh evaluations.',
      );
    } finally {
      setRefreshing(false);
    }
  }

  const pickerOptions =
    picker?.type === 'class'
      ? classes
      : picker?.type === 'subject'
      ? courses.filter(item => {
          const selectedElsewhere = subjects.some(
            row =>
              row.localId !== picker.localId &&
              Number(row.courseId) === Number(item.id),
          );
          return !selectedElsewhere;
        })
      : [];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#7DD3FC" size="large" />
        <Text style={styles.hint}>Loading tutorial evaluations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>
          {isEditMode
            ? 'Edit Tutorial Evaluation'
            : 'Record Tutorial Evaluation'}
        </Text>
        <Text style={styles.hint}>
          Create the examination and enter offline marks in one worksheet.
        </Text>

        {enabled && (
          <>
            {!reviewVisible && (
              <View style={styles.card}>
                <Text style={styles.label}>Examination name</Text>
                <TextInput
                  editable={!isEditMode && !savingEvaluation}
                  selectTextOnFocus={!isEditMode && !savingEvaluation}
                  style={[styles.input, isEditMode && styles.readOnlyInput]}
                  value={name}
                  onChangeText={value => {
                    setName(value);
                    setGridVisible(false);
                  }}
                  placeholder="e.g. September Assessment"
                  placeholderTextColor="#8091AA"
                />

                <Text style={styles.label}>Date held</Text>
                <Pressable
                  disabled={isEditMode || savingEvaluation}
                  style={[styles.select, isEditMode && styles.readOnlyField]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.bodyText}>{localDateString(heldOn)}</Text>
                  <Text style={styles.arrow}>▦</Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={heldOn}
                    mode="date"
                    onChange={(event, date) => {
                      setShowDatePicker(false);
                      if (event.type !== 'dismissed' && date) setHeldOn(date);
                    }}
                  />
                )}

                <Text style={styles.label}>Class</Text>
                <Pressable
                  disabled={isEditMode || savingEvaluation}
                  style={[styles.select, isEditMode && styles.readOnlyField]}
                  onPress={() => setPicker({ type: 'class' })}
                >
                  <Text style={styles.bodyText}>
                    {currentClass?.label || 'Select a class...'}
                  </Text>

                  <Ionicons name={'chevron-down'} size={15} color={'#7DD3FC'} />
                </Pressable>

                <Text style={styles.sectionTitle}>Subjects and full marks</Text>
                <Text style={styles.hint}>
                  Add every subject assessed in this evaluation.
                </Text>
                {subjects.map((row, index) => {
                  const subject = courses.find(
                    item => Number(item.id) === Number(row.courseId),
                  );
                  return (
                    <View key={row.localId} style={styles.subjectCard}>
                      <Text style={styles.hint}>Subject {index + 1}</Text>
                      <Pressable
                        style={[
                          styles.select,
                          isEditMode && styles.readOnlyField,
                        ]}
                        disabled={!classId || isEditMode || savingEvaluation}
                        onPress={() =>
                          setPicker({ type: 'subject', localId: row.localId })
                        }
                      >
                        <Text style={styles.bodyText}>
                          {subject?.label ||
                            (classId
                              ? 'Select a subject...'
                              : 'Select class first')}
                        </Text>
                        <Ionicons
                          name={'chevron-down'}
                          size={15}
                          color={'#7DD3FC'}
                        />
                      </Pressable>
                      <Text style={styles.label}>Full marks</Text>
                      <TextInput
                        style={[
                          styles.input,
                          isEditMode && styles.readOnlyInput,
                        ]}
                        value={row.fullMarks}
                        editable={!isEditMode && !savingEvaluation}
                        selectTextOnFocus={!isEditMode && !savingEvaluation}
                        onChangeText={value =>
                          updateSubject(row.localId, { fullMarks: value })
                        }
                        keyboardType="numeric"
                        placeholder="100"
                        placeholderTextColor="#8091AA"
                      />
                      {subjects.length > 1 && (
                        <Pressable
                          disabled={isEditMode || savingEvaluation}
                          style={[
                            styles.removeButton,
                            isEditMode && styles.disabledButton,
                          ]}
                          onPress={() => removeSubject(row.localId)}
                        >
                          <Text style={styles.buttonText}>Remove</Text>
                        </Pressable>
                      )}
                    </View>
                  );
                })}
                <Pressable
                  disabled={!classId || isEditMode || savingEvaluation}
                  onPress={() => {
                    setSubjects(current => [...current, initialSubject()]);
                    setGridVisible(false);
                  }}
                  style={[
                    styles.secondaryButton,
                    isEditMode && styles.disabledButton,
                  ]}
                >
                  <Text style={styles.buttonText}>+ Add Subject</Text>
                </Pressable>

                <Pressable
                  disabled={isEditMode || savingEvaluation}
                  onPress={prepareGrid}
                  style={[
                    styles.primaryButton,
                    isEditMode && styles.disabledButton,
                  ]}
                >
                  <Text style={styles.buttonText}>Prepare Marks Grid</Text>
                </Pressable>
                <Pressable
                  disabled={isEditMode || savingEvaluation}
                  style={[
                    styles.checkboxRow,
                    isEditMode && styles.disabledButton,
                  ]}
                  onPress={() => setPublishResults(value => !value)}
                >
                  <Text style={styles.checkbox}>
                    {publishResults ? '☑' : '☐'}
                  </Text>
                  <Text style={styles.bodyText}>
                    Publish results after saving
                  </Text>
                </Pressable>
              </View>
            )}

            {gridVisible && !reviewVisible && (
              <View style={styles.marksGridSection}>
                <Text style={styles.sectionTitle}>Student Marks</Text>

                <Text style={styles.hint}>
                  {students.length} students · {subjects.length} subjects
                </Text>

                {students.map(student => {
                  const isAbsent = absentStudents.includes(Number(student.id));

                  return (
                    <View
                      key={`student-${student.id}`}
                      style={[
                        styles.marksStudentCard,
                        isAbsent && styles.marksAbsentCard,
                      ]}
                    >
                      <View style={styles.marksStudentHeader}>
                        <View style={styles.marksStudentInfo}>
                          <Text style={styles.marksStudentName}>
                            {student.name}
                          </Text>

                          <Text style={styles.marksRoll}>
                            Roll: {student.roll_no || '—'}
                          </Text>
                        </View>

                        <Pressable
                          onPress={() => toggleAbsent(student.id)}
                          disabled={
                            savingEvaluation ||
                            (!isEditMode && !!savedEvaluation)
                          }
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: isAbsent }}
                          style={styles.absentControl}
                        >
                          <View
                            style={[
                              styles.absentCheckbox,
                              isAbsent && styles.absentCheckboxChecked,
                            ]}
                          >
                            {isAbsent && (
                              <Text style={styles.absentTick}>✓</Text>
                            )}
                          </View>

                          <Text style={styles.absentLabel}>Absent</Text>
                        </Pressable>
                      </View>

                      {subjects.map(subjectRow => {
                        const subject = courses.find(
                          course =>
                            Number(course.id) === Number(subjectRow.courseId),
                        );

                        const key = `${student.id}:${subjectRow.courseId}`;

                        return (
                          <View
                            key={`mark-${student.id}-${subjectRow.courseId}`}
                            style={styles.subjectMarksRow}
                          >
                            <View style={styles.subjectMarksInfo}>
                              <Text style={styles.subjectMarksName}>
                                {subject?.label || 'Subject'}
                              </Text>

                              <Text style={styles.subjectFullMarks}>
                                Out of {subjectRow.fullMarks}
                              </Text>
                            </View>

                            <TextInput
                              value={isAbsent ? '' : String(marks[key] ?? '')}
                              onChangeText={value =>
                                updateStudentMark(
                                  student.id,
                                  subjectRow.courseId,
                                  value,
                                  subjectRow.fullMarks,
                                )
                              }
                              editable={
                                !isAbsent &&
                                !savingEvaluation &&
                                (isEditMode || !savedEvaluation)
                              }
                              keyboardType="decimal-pad"
                              placeholder={isAbsent ? 'Absent' : 'Enter marks'}
                              placeholderTextColor="#8091AA"
                              style={[
                                styles.studentMarkInput,
                                isAbsent && styles.studentMarkInputDisabled,
                              ]}
                            />
                          </View>
                        );
                      })}
                    </View>
                  );
                })}

                <View style={styles.marksGridFooter}>
                  <Pressable
                    onPress={reviewMarks}
                    disabled={
                      savingEvaluation || (!isEditMode && !!savedEvaluation)
                    }
                    style={({ pressed }) => [
                      styles.reviewMarksButton,
                      pressed && styles.controlPressed,
                      !isEditMode && savedEvaluation && { opacity: 0.45 },
                    ]}
                  >
                    <Text style={styles.reviewMarksButtonText}>
                      Review Marks
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      Alert.alert(
                        'Start New Evaluation',
                        'Discard the current unsaved marks and start a new evaluation?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Start New',
                            style: 'destructive',
                            onPress: startNewEvaluation,
                          },
                        ],
                      )
                    }
                    style={({ pressed }) => [
                      styles.newEvaluationButton,
                      pressed && styles.controlPressed,
                    ]}
                  >
                    <Text style={styles.newEvaluationButtonText}>
                      Start New Evaluation
                    </Text>
                  </Pressable>

                  {savedEvaluation?.publishResults === true &&
                    savedEvaluation?.status === 'result_published' && (
                      <Pressable
                        onPress={openSavedMarksheet}
                        accessibilityRole="button"
                        accessibilityLabel="Open Marksheet"
                        style={({ pressed }) => [
                          styles.openMarksheetButton,
                          pressed && styles.controlPressed,
                        ]}
                      >
                        <Ionicons
                          name="document-text-outline"
                          size={16}
                          color="#FFFFFF"
                        />

                        <Text style={styles.openMarksheetButtonText}>
                          Open Marksheet
                        </Text>
                      </Pressable>
                    )}
                </View>

                {reviewVisible && (
                  <View style={styles.marksReviewCard}>
                    <Text style={styles.sectionTitle}>Review Marks</Text>

                    <Text style={styles.hint}>Examination: {name}</Text>

                    <Text style={styles.hint}>
                      Class: {currentClass?.label || '—'}
                    </Text>

                    <Text style={styles.hint}>
                      Present: {students.length - absentStudents.length}
                      {' · '}
                      Absent: {absentStudents.length}
                    </Text>

                    {subjects.map(subject => {
                      const course = courses.find(
                        item => Number(item.id) === Number(subject.courseId),
                      );

                      return (
                        <Text
                          key={`review-subject-${subject.localId}`}
                          style={styles.reviewSubjectText}
                        >
                          {course?.label || 'Subject'} — {subject.fullMarks}{' '}
                          marks
                        </Text>
                      );
                    })}

                    <Text style={styles.reviewNotice}>
                      Marks have been validated locally. They have not been
                      saved to the server yet.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {reviewVisible && (
              <View style={styles.confirmSection}>
                <Text style={styles.confirmTitle}>Confirm Tutorial Marks</Text>

                <Text style={styles.confirmDescription}>
                  Review this read-only record before it is saved. Use Back to
                  Edit if anything needs changing.
                </Text>

                <View style={styles.confirmDetailsCard}>
                  <View style={styles.confirmDetailRow}>
                    <Text style={styles.confirmDetailLabel}>Examination</Text>
                    <Text style={styles.confirmDetailValue}>{name}</Text>
                  </View>

                  <View style={styles.confirmDetailRow}>
                    <Text style={styles.confirmDetailLabel}>Date held</Text>
                    <Text style={styles.confirmDetailValue}>
                      {[
                        heldOn.getFullYear(),
                        String(heldOn.getMonth() + 1).padStart(2, '0'),
                        String(heldOn.getDate()).padStart(2, '0'),
                      ].join('-')}
                    </Text>
                  </View>

                  <View style={styles.confirmDetailRow}>
                    <Text style={styles.confirmDetailLabel}>Class</Text>
                    <Text style={styles.confirmDetailValue}>
                      {currentClass?.label || '—'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.confirmSectionLabel}>Student Marks</Text>

                {students.map(student => {
                  const isAbsent = absentStudents.includes(Number(student.id));

                  return (
                    <View
                      key={`confirm-${student.id}`}
                      style={[
                        styles.confirmStudentCard,
                        isAbsent && styles.confirmAbsentCard,
                      ]}
                    >
                      <View style={styles.confirmStudentHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.confirmStudentName}>
                            {student.name}
                          </Text>

                          <Text style={styles.confirmStudentRoll}>
                            Roll: {student.roll_no || '—'}
                          </Text>
                        </View>

                        {isAbsent && (
                          <View style={styles.confirmAbsentBadge}>
                            <Text style={styles.confirmAbsentBadgeText}>
                              ABSENT
                            </Text>
                          </View>
                        )}
                      </View>

                      {subjects.map(subjectRow => {
                        const course = courses.find(
                          item =>
                            Number(item.id) === Number(subjectRow.courseId),
                        );

                        return (
                          <View
                            key={`confirm-mark-${student.id}-${subjectRow.courseId}`}
                            style={styles.confirmMarkRow}
                          >
                            <View style={{ flex: 1 }}>
                              <Text style={styles.confirmSubjectName}>
                                {course?.label || 'Subject'}
                              </Text>

                              <Text style={styles.confirmFullMarks}>
                                Out of {subjectRow.fullMarks}
                              </Text>
                            </View>

                            <Text
                              style={[
                                styles.confirmMarkValue,
                                isAbsent && styles.confirmAbsentText,
                              ]}
                            >
                              {getReviewMark(student.id, subjectRow.courseId)}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}

                <View style={styles.confirmActions}>
                  <Pressable
                    onPress={backToEditMarks}
                    disabled={savingEvaluation}
                    style={[
                      styles.confirmBackButton,
                      savingEvaluation && { opacity: 0.55 },
                    ]}
                  >
                    <Text style={styles.confirmButtonText}>Back to Edit</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleSaveEvaluation}
                    disabled={savingEvaluation}
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.confirmSaveButton,
                      savingEvaluation && { opacity: 0.55 },
                      pressed && !savingEvaluation && styles.controlPressed,
                    ]}
                  >
                    {savingEvaluation ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <ActivityIndicator size="small" color="#FFFFFF" />

                        <Text style={styles.confirmButtonText}>Saving...</Text>
                      </View>
                    ) : (
                      <Text style={styles.confirmButtonText}>
                        Save Evaluation
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            )}

            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Saved Evaluations</Text>
                <Pressable
                  onPress={refreshSaved}
                  disabled={refreshing}
                  style={styles.secondaryButton}
                >
                  {refreshing ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Refresh</Text>
                  )}
                </Pressable>
              </View>
              {evaluations.length === 0 && (
                <Text style={styles.hint}>No saved evaluations found.</Text>
              )}
              {evaluations.map(item => (
                <View style={styles.savedCard} key={String(item.id)}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.studentName}>{item.name}</Text>
                    <Text style={styles.hint}>
                      {item.held_on
                        ? String(item.held_on).slice(0, 10)
                        : 'No date'}{' '}
                      · {item.status}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => openSavedEvaluation(item)}
                    disabled={openingEvaluationId !== null || savingEvaluation}
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      openingEvaluationId !== null && { opacity: 0.55 },
                      pressed && styles.controlPressed,
                    ]}
                  >
                    {openingEvaluationId === Number(item.id) ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.buttonText}>Open</Text>
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
      <SelectOptionsModal
        visible={picker !== null}
        title={picker?.type === 'class' ? 'Select Class' : 'Select Subject'}
        options={pickerOptions}
        onClose={() => setPicker(null)}
        onSelect={item => {
          if (picker?.type === 'class') changeClass(item);
          if (picker?.type === 'subject')
            updateSubject(picker.localId, { courseId: Number(item.id) });
        }}
      />
    </View>
  );
}
