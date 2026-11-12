// src/screens/Admin/Examinations/AdminEditExamPaper.js

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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';
import styles from './AdminEditExamPaper.styles';

function normalizeTeacher(item) {
  return {
    id: Number(item?.id),
    name: String(item?.name || 'Unnamed user'),
    role: String(item?.role || 'teacher').toLowerCase(),
  };
}

function normalizeClass(item) {
  return {
    id: Number(item?.id),
    name: String(item?.name || 'Unnamed class'),
  };
}

function normalizeCourse(item) {
  return {
    id: Number(item?.id),
    title: String(item?.title || 'Untitled course'),
  };
}

function normalizeExamination(item) {
  return {
    id: Number(item?.id),
    name: String(item?.name || 'Untitled examination'),
  };
}

function normalizeTemplate(item) {
  return {
    id: Number(item?.id),
    name: String(item?.name || 'Unnamed template'),
    totalMarks: Number(item?.total_marks || 0),
  };
}

function SelectModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
  loading = false,
  emptyText = 'No options available.',
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />

        <View style={styles.selectModal}>
          <Text style={styles.selectModalTitle}>{title}</Text>

          {loading ? (
            <View style={styles.modalState}>
              <ActivityIndicator size="large" />
              <Text style={styles.modalStateText}>Loading options...</Text>
            </View>
          ) : options.length === 0 ? (
            <View style={styles.modalState}>
              <Text style={styles.modalStateText}>{emptyText}</Text>
            </View>
          ) : (
            <FlatList
              data={options}
              keyExtractor={item => String(item.value)}
              style={styles.selectOptionsList}
              renderItem={({ item }) => {
                const selected = String(item.value) === String(selectedValue);

                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item.value);
                      onClose();
                    }}
                    style={({ pressed }) => [
                      styles.selectOption,
                      selected && styles.selectOptionSelected,
                      pressed && styles.controlPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,
                        selected && styles.selectOptionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>

                    {selected ? (
                      <Text style={styles.selectOptionCheck}>✓</Text>
                    ) : null}
                  </Pressable>
                );
              }}
            />
          )}

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.modalCloseButton,
              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function AdminEditExamPaper({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const exam = route?.params?.exam || null;
  const examId = Number(route?.params?.examId ?? exam?.id);
  const initialTeacherId = Number(exam?.created_by);

  const initialTeacherOptions = Array.isArray(route?.params?.teacherOptions)
    ? route.params.teacherOptions
    : [];

  const [teachers] = useState(
    initialTeacherOptions
      .map(normalizeTeacher)
      .filter(item => Number.isFinite(item.id)),
  );

  const [examinations, setExaminations] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [additionalItems, setAdditionalItems] = useState([]);

  const [totalMarks, setTotalMarks] = useState(
    String(Number(exam?.total_marks ?? exam?.full_marks ?? 100)),
  );

  const [selectedTeacherId, setSelectedTeacherId] = useState(
    Number.isFinite(initialTeacherId) ? initialTeacherId : null,
  );
  const [selectedExaminationId, setSelectedExaminationId] = useState(
    Number.isFinite(Number(exam?.examination_id))
      ? Number(exam.examination_id)
      : null,
  );
  const [selectedCourseId, setSelectedCourseId] = useState(
    Number.isFinite(Number(exam?.course_id)) ? Number(exam.course_id) : null,
  );
  const [selectedClassId, setSelectedClassId] = useState(
    Number.isFinite(Number(exam?.class_group_id))
      ? Number(exam.class_group_id)
      : null,
  );

  const [isOnline, setIsOnline] = useState(exam?.is_online !== false);

  const [teacherModalVisible, setTeacherModalVisible] = useState(false);
  const [examinationModalVisible, setExaminationModalVisible] = useState(false);
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [classModalVisible, setClassModalVisible] = useState(false);

  const [templates, setTemplates] = useState([]);

  const [saveTemplateModalVisible, setSaveTemplateModalVisible] =
    useState(false);

  const [templatePickerModalVisible, setTemplatePickerModalVisible] =
    useState(false);

  const [templateName, setTemplateName] = useState('');

  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const [savingTemplate, setSavingTemplate] = useState(false);

  const [applyingTemplate, setApplyingTemplate] = useState(false);

  const [loading, setLoading] = useState(true);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const teacherOptions = useMemo(
    () =>
      teachers.map(item => ({
        value: item.id,
        label: `${item.name} (${item.role})`,
      })),
    [teachers],
  );

  const examinationOptions = useMemo(
    () => [
      { value: 'none', label: 'None' },
      ...examinations.map(item => ({ value: item.id, label: item.name })),
    ],
    [examinations],
  );

  const courseOptions = useMemo(
    () => courses.map(item => ({ value: item.id, label: item.title })),
    [courses],
  );

  const classOptions = useMemo(
    () => classes.map(item => ({ value: item.id, label: item.name })),
    [classes],
  );

  const selectedTeacherLabel = useMemo(() => {
    const teacher = teachers.find(item => item.id === selectedTeacherId);
    return teacher ? `${teacher.name} (${teacher.role})` : 'Select...';
  }, [selectedTeacherId, teachers]);

  const selectedExaminationLabel = useMemo(() => {
    if (!selectedExaminationId) {
      return 'None';
    }

    return (
      examinations.find(item => item.id === selectedExaminationId)?.name ||
      'None'
    );
  }, [examinations, selectedExaminationId]);

  const selectedCourseLabel = useMemo(
    () =>
      courses.find(item => item.id === selectedCourseId)?.title ||
      exam?.course_title ||
      'Select...',
    [courses, exam?.course_title, selectedCourseId],
  );

  const selectedClassLabel = useMemo(
    () =>
      classes.find(item => item.id === selectedClassId)?.name ||
      exam?.class_name ||
      'Select...',
    [classes, exam?.class_name, selectedClassId],
  );

  const totalMarksNumber = useMemo(() => {
    const value = Number(totalMarks);

    return Number.isFinite(value) && value >= 0 ? value : 0;
  }, [totalMarks]);

  const additionalMarks = useMemo(
    () =>
      additionalItems.reduce((sum, item) => {
        const value = Number(item.marks);

        return sum + (Number.isFinite(value) && value >= 0 ? value : 0);
      }, 0),
    [additionalItems],
  );

  const examProperMarks = Math.max(totalMarksNumber - additionalMarks, 0);

  const loadTeacherResources = useCallback(async teacherId => {
    const normalizedTeacherId = Number(teacherId);

    if (!Number.isFinite(normalizedTeacherId)) {
      setClasses([]);
      setCourses([]);
      return;
    }

    try {
      setResourcesLoading(true);

      const response = await api(
        `/api/exams/resources-for-teacher/${normalizedTeacherId}`,
      );

      const nextClasses = (
        Array.isArray(response?.classes) ? response.classes : []
      )
        .map(normalizeClass)
        .filter(item => Number.isFinite(item.id));

      const nextCourses = (
        Array.isArray(response?.courses) ? response.courses : []
      )
        .map(normalizeCourse)
        .filter(item => Number.isFinite(item.id));

      setClasses(nextClasses);
      setCourses(nextCourses);

      setSelectedClassId(current =>
        nextClasses.some(item => item.id === current) ? current : null,
      );
      setSelectedCourseId(current =>
        nextCourses.some(item => item.id === current) ? current : null,
      );
    } catch (error) {
      console.log('Edit exam resources error:', error);

      Alert.alert(
        'Edit Exam',
        error?.message || 'Could not load teacher resources.',
      );
    } finally {
      setResourcesLoading(false);
    }
  }, []);

  const loadTemplates = useCallback(
    async (classGroupId, courseId, { openModal = false } = {}) => {
      const nextClassId = Number(classGroupId);

      const nextCourseId = Number(courseId);

      if (!Number.isFinite(nextClassId) || !Number.isFinite(nextCourseId)) {
        setTemplates([]);
        return [];
      }

      try {
        const response = await api(
          `/api/exams/templates?class_group_id=${encodeURIComponent(
            nextClassId,
          )}&course_id=${encodeURIComponent(nextCourseId)}`,
        );

        const rows = (
          Array.isArray(response?.templates) ? response.templates : []
        )
          .map(normalizeTemplate)
          .filter(item => Number.isFinite(item.id));

        setTemplates(rows);

        if (openModal && rows.length > 0) {
          setSelectedTemplateId(null);
          setTemplatePickerModalVisible(true);
        }

        return rows;
      } catch (error) {
        console.log('Exam templates load error:', error);

        setTemplates([]);

        Alert.alert(
          'Edit Exam',
          error?.message || 'Could not load exam templates.',
        );

        return [];
      }
    },
    [],
  );

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      if (!Number.isFinite(examId) || !Number.isFinite(initialTeacherId)) {
        Alert.alert('Edit Exam', 'Exam or teacher information is missing.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
        return;
      }

      try {
        setLoading(true);

        const [examinationsResponse, extrasResponse, resourcesResponse] =
          await Promise.all([
            api('/api/examinations/v1/options'),
            api(`/api/exams/${examId}/extras`),
            api(`/api/exams/resources-for-teacher/${initialTeacherId}`),
          ]);

        if (!active) {
          return;
        }

        setExaminations(
          (Array.isArray(examinationsResponse?.data)
            ? examinationsResponse.data
            : []
          )
            .map(normalizeExamination)
            .filter(item => Number.isFinite(item.id)),
        );

        const extraRows = Array.isArray(extrasResponse?.extras)
          ? extrasResponse.extras
          : [];

        setAdditionalItems(
          extraRows.map((item, index) => ({
            id: item?.id ?? `existing-${index}`,

            serverId: item?.id ?? null,

            label: String(item?.name || ''),

            marks: String(Number(item?.marks || 0)),
          })),
        );

        setClasses(
          (Array.isArray(resourcesResponse?.classes)
            ? resourcesResponse.classes
            : []
          )
            .map(normalizeClass)
            .filter(item => Number.isFinite(item.id)),
        );

        setCourses(
          (Array.isArray(resourcesResponse?.courses)
            ? resourcesResponse.courses
            : []
          )
            .map(normalizeCourse)
            .filter(item => Number.isFinite(item.id)),
        );

        if (
          Number.isFinite(Number(exam?.class_group_id)) &&
          Number.isFinite(Number(exam?.course_id))
        ) {
          await loadTemplates(
            Number(exam.class_group_id),
            Number(exam.course_id),
            {
              openModal: false,
            },
          );
        }

        navigation.setOptions({ title: 'Edit Exam' });
      } catch (error) {
        console.log('Edit exam initialization error:', error);

        Alert.alert(
          'Edit Exam',
          error?.message || 'Could not load exam details.',
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      active = false;
    };
  }, [examId, initialTeacherId, navigation, loadTemplates]);

  async function changeTeacher(value) {
    const nextTeacherId = Number(value);

    if (
      !Number.isFinite(nextTeacherId) ||
      nextTeacherId === selectedTeacherId
    ) {
      return;
    }

    setSelectedTeacherId(nextTeacherId);
    await loadTeacherResources(nextTeacherId);
  }

  function changeCourse(value) {
    const nextCourseId = Number(value);

    if (!Number.isFinite(nextCourseId)) {
      return;
    }

    setSelectedCourseId(nextCourseId);

    /*
     * Class must be selected again because
     * templates depend on class + course.
     */
    setSelectedClassId(null);

    setTemplates([]);
    setSelectedTemplateId(null);
  }

  async function changeClass(value) {
    const nextClassId = Number(value);

    if (!Number.isFinite(nextClassId)) {
      return;
    }

    if (!selectedCourseId) {
      Alert.alert('Course required', 'Please select a course first.');
      return;
    }

    setSelectedClassId(nextClassId);

    await loadTemplates(nextClassId, selectedCourseId, {
      openModal: true,
    });
  }

  function addAdditionalItem() {
    setAdditionalItems(current => [
      ...current,
      {
        id: `new-${Date.now()}-${current.length}`,
        serverId: null,
        label: '',
        marks: '0',
      },
    ]);
  }

  function updateAdditionalItem(itemId, field, value) {
    setAdditionalItems(current =>
      current.map(item =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function removeAdditionalItem(itemId) {
    setAdditionalItems(current => current.filter(item => item.id !== itemId));
  }

  function saveAsTemplate() {
    if (!selectedCourseId) {
      Alert.alert('Course required', 'Please select a course first.');
      return;
    }

    if (!selectedClassId) {
      Alert.alert('Class required', 'Please select a class first.');
      return;
    }

    if (totalMarksNumber <= 0) {
      Alert.alert(
        'Invalid marks',
        'Exam total marks must be greater than zero.',
      );
      return;
    }

    if (additionalMarks > totalMarksNumber) {
      Alert.alert(
        'Invalid additional marks',
        'Additional requirement marks cannot exceed the exam total marks.',
      );
      return;
    }

    setTemplateName('');

    setSaveTemplateModalVisible(true);
  }

  async function submitTemplate() {
    const trimmedName = templateName.trim();

    if (!trimmedName) {
      Alert.alert('Template name required', 'Please enter a template name.');
      return;
    }

    const extras = additionalItems
      .filter(item => item.label.trim())
      .map(item => ({
        name: item.label.trim(),
        marks: Number(item.marks || 0),
      }));

    const payload = {
      name: trimmedName,
      class_group_id: selectedClassId,
      course_id: selectedCourseId,
      total_marks: totalMarksNumber,
      extras,
    };

    try {
      setSavingTemplate(true);

      const response = await api('/api/exams/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!Number.isFinite(Number(response?.id))) {
        throw new Error('Invalid template response.');
      }

      setSaveTemplateModalVisible(false);
      setTemplateName('');

      await loadTemplates(selectedClassId, selectedCourseId, {
        openModal: false,
      });

      Alert.alert(
        'Template saved',
        'The exam template was saved successfully.',
      );
    } catch (error) {
      console.log('Save template error:', error);

      Alert.alert(
        'Save failed',
        error?.message || 'Could not save the template.',
      );
    } finally {
      setSavingTemplate(false);
    }
  }

  async function applyTemplate() {
    /*
     * None selected means keep the
     * current exam values unchanged.
     */
    if (!selectedTemplateId) {
      setTemplatePickerModalVisible(false);
      return;
    }

    try {
      setApplyingTemplate(true);

      const response = await api(`/api/exams/templates/${selectedTemplateId}`);

      const nextTotalMarks = Number(response?.total_marks || 0);

      const items = Array.isArray(response?.items) ? response.items : [];

      if (Number.isFinite(nextTotalMarks) && nextTotalMarks > 0) {
        setTotalMarks(String(nextTotalMarks));
      }

      setAdditionalItems(
        items.map((item, index) => ({
          id: `template-${item?.id ?? index}-${Date.now()}`,
          serverId: null,
          label: String(item?.name || ''),
          marks: String(Number(item?.marks || 0)),
        })),
      );

      setTemplatePickerModalVisible(false);
      setSelectedTemplateId(null);
    } catch (error) {
      console.log('Apply template error:', error);

      Alert.alert(
        'Template failed',
        error?.message || 'Could not load the selected template.',
      );
    } finally {
      setApplyingTemplate(false);
    }
  }

  function changeExamination(value) {
    if (value === 'none') {
      setSelectedExaminationId(null);
      return;
    }

    const nextId = Number(value);
    setSelectedExaminationId(Number.isFinite(nextId) ? nextId : null);
  }

  async function saveExam() {
    if (saving) {
      return;
    }

    if (!selectedTeacherId) {
      Alert.alert(
        'Teacher/Admin required',
        'Please select a teacher or admin.',
      );
      return;
    }

    if (!selectedCourseId) {
      Alert.alert('Course required', 'Please select a course.');
      return;
    }

    if (!selectedClassId) {
      Alert.alert('Class required', 'Please select a class.');
      return;
    }

    if (totalMarksNumber <= 0) {
      Alert.alert(
        'Invalid marks',
        'Exam total marks must be greater than zero.',
      );
      return;
    }

    if (additionalMarks > totalMarksNumber) {
      Alert.alert(
        'Invalid additional marks',
        'Additional requirement marks cannot exceed the exam total marks.',
      );
      return;
    }

    const extraItems = additionalItems
      .filter(item => item.label.trim())
      .map(item => ({
        name: item.label.trim(),
        marks: Number(item.marks || 0),
      }));

    /*
     * Starts At and Ends At are no longer editable,
     * so preserve the existing exam schedule.
     */
    const startsAt = exam?.starts_at
      ? new Date(exam.starts_at).toISOString()
      : new Date().toISOString();

    const endsAt = exam?.ends_at
      ? new Date(exam.ends_at).toISOString()
      : startsAt;

    const payload = {
      class_group_id: selectedClassId,
      course_id: selectedCourseId,
      ends_at: endsAt,
      examination_id: selectedExaminationId || null,
      is_online: isOnline,
      starts_at: startsAt,
      total_marks: totalMarksNumber,
      teacher_id: selectedTeacherId,
      extra_items: extraItems,
    };

    try {
      setSaving(true);

      console.log('Edit exam payload:', payload);

      const response = await api(`/api/exams/${examId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Edit exam response:', response);

      if (!response?.id) {
        throw new Error('Invalid response while updating exam.');
      }

      navigation.goBack();
    } catch (error) {
      console.log('Edit exam error:', error);

      Alert.alert(
        'Update failed',
        error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          'Could not update the exam.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading exam...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.screenContent,
        { paddingBottom: Math.max(insets.bottom, 20) },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formCard}>
        <Text style={styles.pageTitle}>Edit Exam</Text>

        <Text style={styles.fieldLabel}>Teacher/Admin</Text>
        <Pressable
          onPress={() => setTeacherModalVisible(true)}
          disabled={saving}
          style={({ pressed }) => [
            styles.selectField,
            saving && styles.controlDisabled,
            pressed && !saving && styles.controlPressed,
          ]}
        >
          <Text numberOfLines={1} style={styles.selectFieldText}>
            {selectedTeacherLabel}
          </Text>
          <Text style={styles.selectArrow}>⌄</Text>
        </Pressable>

        <Text style={styles.fieldLabel}>Examination (optional)</Text>
        <Pressable
          onPress={() => setExaminationModalVisible(true)}
          disabled={saving}
          style={({ pressed }) => [
            styles.selectField,
            saving && styles.controlDisabled,
            pressed && !saving && styles.controlPressed,
          ]}
        >
          <Text numberOfLines={1} style={styles.selectFieldText}>
            {selectedExaminationLabel}
          </Text>
          <Text style={styles.selectArrow}>⌄</Text>
        </Pressable>

        <Text style={styles.fieldLabel}>Course</Text>
        <Pressable
          onPress={() => setCourseModalVisible(true)}
          disabled={saving || resourcesLoading || courses.length === 0}
          style={({ pressed }) => [
            styles.selectField,
            (saving || resourcesLoading || courses.length === 0) &&
              styles.controlDisabled,
            pressed &&
              !saving &&
              !resourcesLoading &&
              courses.length > 0 &&
              styles.controlPressed,
          ]}
        >
          <Text numberOfLines={1} style={styles.selectFieldText}>
            {selectedCourseLabel}
          </Text>
          {resourcesLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.selectArrow}>⌄</Text>
          )}
        </Pressable>

        <Text style={styles.fieldLabel}>Class</Text>
        <Pressable
          onPress={() => setClassModalVisible(true)}
          disabled={saving || resourcesLoading || classes.length === 0}
          style={({ pressed }) => [
            styles.selectField,
            (saving || resourcesLoading || classes.length === 0) &&
              styles.controlDisabled,
            pressed &&
              !saving &&
              !resourcesLoading &&
              classes.length > 0 &&
              styles.controlPressed,
          ]}
        >
          <Text numberOfLines={1} style={styles.selectFieldText}>
            {selectedClassLabel}
          </Text>
          {resourcesLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.selectArrow}>⌄</Text>
          )}
        </Pressable>

        <Text style={styles.fieldLabel}>Delivery</Text>
        <Pressable
          onPress={() => setIsOnline(value => !value)}
          disabled={saving}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isOnline }}
          style={styles.deliveryRow}
        >
          <View style={[styles.checkbox, isOnline && styles.checkboxSelected]}>
            {isOnline ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.deliveryText}>Online</Text>
        </Pressable>
        <Text style={styles.helperText}>
          Turn this off to mark the exam as offline.
        </Text>

        <Text style={styles.fieldLabel}>Exam Total Marks</Text>

        <TextInput
          value={totalMarks}
          onChangeText={value => setTotalMarks(value.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          maxLength={4}
          editable={!saving}
          style={styles.marksInput}
        />

        <Text style={styles.examProperText}>
          Exam proper will be:{' '}
          <Text style={styles.examProperValue}>{examProperMarks}</Text>
        </Text>

        <View style={styles.requirementsHeader}>
          <Text style={styles.sectionTitle}>Additional Requirements</Text>

          <View style={styles.requirementsActions}>
            <Pressable
              onPress={addAdditionalItem}
              disabled={saving}
              style={({ pressed }) => [
                styles.addItemButton,
                saving && styles.controlDisabled,
                pressed && !saving && styles.controlPressed,
              ]}
            >
              <Text style={styles.addItemButtonText}>+ Add item</Text>
            </Pressable>

            <Pressable
              onPress={saveAsTemplate}
              disabled={saving}
              style={({ pressed }) => [
                styles.templateButton,
                saving && styles.controlDisabled,
                pressed && !saving && styles.controlPressed,
              ]}
            >
              <Text style={styles.templateButtonText}>Save as Template</Text>
            </Pressable>
          </View>
        </View>

        {additionalItems.length === 0 ? (
          <Text style={styles.emptyRequirementsText}>
            No additional items added yet.
          </Text>
        ) : (
          <View style={styles.requirementsList}>
            {additionalItems.map(item => (
              <View key={String(item.id)} style={styles.requirementRow}>
                <TextInput
                  value={item.label}
                  onChangeText={value =>
                    updateAdditionalItem(item.id, 'label', value)
                  }
                  placeholder="e.g., Practical / Project / Overall Performance"
                  placeholderTextColor="#64748B"
                  editable={!saving}
                  style={styles.requirementNameInput}
                />

                <TextInput
                  value={item.marks}
                  onChangeText={value =>
                    updateAdditionalItem(
                      item.id,
                      'marks',
                      value.replace(/[^0-9]/g, ''),
                    )
                  }
                  keyboardType="number-pad"
                  maxLength={4}
                  editable={!saving}
                  style={styles.requirementMarksInput}
                />

                <Pressable
                  onPress={() => removeAdditionalItem(item.id)}
                  disabled={saving}
                  style={({ pressed }) => [
                    styles.removeItemButton,
                    saving && styles.controlDisabled,
                    pressed && !saving && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.removeItemButtonText}>✕</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Pressable
            onPress={() => navigation.goBack()}
            disabled={saving}
            style={({ pressed }) => [
              styles.cancelButton,
              saving && styles.controlDisabled,
              pressed && !saving && styles.controlPressed,
            ]}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={saveExam}
            disabled={saving}
            style={({ pressed }) => [
              styles.saveButton,
              saving && styles.controlDisabled,
              pressed && !saving && styles.controlPressed,
            ]}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </Pressable>
        </View>
      </View>

      <SelectModal
        visible={teacherModalVisible}
        title="Teacher/Admin"
        options={teacherOptions}
        selectedValue={selectedTeacherId}
        onSelect={changeTeacher}
        onClose={() => setTeacherModalVisible(false)}
        emptyText="No teachers or admins available."
      />

      <SelectModal
        visible={examinationModalVisible}
        title="Examination"
        options={examinationOptions}
        selectedValue={selectedExaminationId || 'none'}
        onSelect={changeExamination}
        onClose={() => setExaminationModalVisible(false)}
      />

      <SelectModal
        visible={courseModalVisible}
        title="Course"
        options={courseOptions}
        selectedValue={selectedCourseId}
        onSelect={changeCourse}
        onClose={() => setCourseModalVisible(false)}
        loading={resourcesLoading}
        emptyText="No courses are available for this teacher."
      />

      <SelectModal
        visible={classModalVisible}
        title="Class"
        options={classOptions}
        selectedValue={selectedClassId}
        onSelect={changeClass}
        onClose={() => setClassModalVisible(false)}
        loading={resourcesLoading}
        emptyText="No classes are available for this teacher."
      />
      <Modal
        transparent
        visible={saveTemplateModalVisible}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          if (!savingTemplate) {
            setSaveTemplateModalVisible(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => {
              if (!savingTemplate) {
                setSaveTemplateModalVisible(false);
              }
            }}
          />

          <View style={styles.templateSaveModal}>
            <Text style={styles.templateModalTitle}>Save as Template</Text>

            <Text style={styles.templateFieldLabel}>Template Name</Text>

            <TextInput
              value={templateName}
              onChangeText={setTemplateName}
              placeholder="e.g., Midterm Pattern"
              placeholderTextColor="#64748B"
              editable={!savingTemplate}
              autoFocus
              style={styles.templateNameInput}
            />

            <View style={styles.templateModalFooter}>
              <Pressable
                onPress={() => setSaveTemplateModalVisible(false)}
                disabled={savingTemplate}
                style={({ pressed }) => [
                  styles.cancelButton,
                  savingTemplate && styles.controlDisabled,
                  pressed && !savingTemplate && styles.controlPressed,
                ]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={submitTemplate}
                disabled={savingTemplate}
                style={({ pressed }) => [
                  styles.saveButton,
                  savingTemplate && styles.controlDisabled,
                  pressed && !savingTemplate && styles.controlPressed,
                ]}
              >
                {savingTemplate ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        visible={templatePickerModalVisible}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          if (!applyingTemplate) {
            setTemplatePickerModalVisible(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => {
              if (!applyingTemplate) {
                setTemplatePickerModalVisible(false);
              }
            }}
          />

          <View style={styles.templatePickerModal}>
            <Text style={styles.templateModalTitle}>Use a saved template?</Text>

            <Pressable
              onPress={() => setSelectedTemplateId(null)}
              style={styles.templateRadioRow}
            >
              <View
                style={[
                  styles.radioOuter,
                  selectedTemplateId === null && styles.radioOuterSelected,
                ]}
              >
                {selectedTemplateId === null ? (
                  <View style={styles.radioInner} />
                ) : null}
              </View>

              <Text style={styles.templateRadioText}>None</Text>
            </Pressable>

            {templates.map(template => {
              const selected =
                Number(selectedTemplateId) === Number(template.id);

              return (
                <Pressable
                  key={String(template.id)}
                  onPress={() => setSelectedTemplateId(template.id)}
                  style={styles.templateRadioRow}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      selected && styles.radioOuterSelected,
                    ]}
                  >
                    {selected ? <View style={styles.radioInner} /> : null}
                  </View>

                  <Text style={styles.templateRadioText}>
                    {template.name}
                    {template.totalMarks > 0
                      ? ` (Total: ${template.totalMarks})`
                      : ''}
                  </Text>
                </Pressable>
              );
            })}

            <View style={styles.templateModalFooter}>
              <Pressable
                onPress={() => setTemplatePickerModalVisible(false)}
                disabled={applyingTemplate}
                style={({ pressed }) => [
                  styles.cancelButton,
                  applyingTemplate && styles.controlDisabled,
                  pressed && !applyingTemplate && styles.controlPressed,
                ]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={applyTemplate}
                disabled={applyingTemplate}
                style={({ pressed }) => [
                  styles.saveButton,
                  applyingTemplate && styles.controlDisabled,
                  pressed && !applyingTemplate && styles.controlPressed,
                ]}
              >
                {applyingTemplate ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Apply</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
