// src/screens/Admin/Examinations/AdminAddExamPaper.js

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
import styles from './AdminAddExamPaper.styles';

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
            <View style={styles.modalLoading}>
              <ActivityIndicator size="large" />
              <Text style={styles.modalLoadingText}>Loading options...</Text>
            </View>
          ) : options.length === 0 ? (
            <View style={styles.modalEmpty}>
              <Text style={styles.modalEmptyText}>{emptyText}</Text>
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

export default function AdminAddExamPaper({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const examinationId = Number(route?.params?.examinationId);
  const examinationName = route?.params?.examinationName || 'Examination';
  const currentUserId = Number(route?.params?.currentUserId);

  const passedTeachers = Array.isArray(route?.params?.teacherOptions)
    ? route.params.teacherOptions
    : [];

  const [examinationOptions, setExaminationOptions] = useState([]);
  const [combos, setCombos] = useState([]);

  const [teachers, setTeachers] = useState(
    passedTeachers
      .map(normalizeTeacher)
      .filter(item => Number.isFinite(item.id)),
  );

  const [templates, setTemplates] = useState([]);

  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedTeacherId, setSelectedTeacherId] = useState(
    Number.isFinite(currentUserId) ? currentUserId : null,
  );
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const [isOnline, setIsOnline] = useState(true);
  const [totalMarks, setTotalMarks] = useState('100');
  const [additionalItems, setAdditionalItems] = useState([]);

  const [teacherModalVisible, setTeacherModalVisible] = useState(false);
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [classModalVisible, setClassModalVisible] = useState(false);

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
  const [creating, setCreating] = useState(false);

  const teacherOptions = useMemo(
    () =>
      teachers.map(item => ({
        value: item.id,
        label: `${item.name} (${item.role})`,
      })),
    [teachers],
  );

  const classOptions = useMemo(
    () =>
      classes.map(item => ({
        value: item.id,
        label: item.name,
      })),
    [classes],
  );

  const courseOptions = useMemo(
    () =>
      courses.map(item => ({
        value: item.id,
        label: item.title,
      })),
    [courses],
  );

  const selectedTeacherLabel = useMemo(() => {
    const teacher = teachers.find(item => item.id === selectedTeacherId);

    return teacher ? `${teacher.name} (${teacher.role})` : 'Select...';
  }, [selectedTeacherId, teachers]);

  const selectedClassLabel = useMemo(
    () =>
      classes.find(item => item.id === selectedClassId)?.name || 'Select...',
    [classes, selectedClassId],
  );

  const selectedCourseLabel = useMemo(
    () =>
      courses.find(item => item.id === selectedCourseId)?.title || 'Select...',
    [courses, selectedCourseId],
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

      setClasses(
        (Array.isArray(response?.classes) ? response.classes : [])
          .map(normalizeClass)
          .filter(item => Number.isFinite(item.id)),
      );

      setCourses(
        (Array.isArray(response?.courses) ? response.courses : [])
          .map(normalizeCourse)
          .filter(item => Number.isFinite(item.id)),
      );
    } catch (error) {
      console.log('Teacher resources load error:', error);
      setClasses([]);
      setCourses([]);

      Alert.alert(
        'Add Exam Paper',
        error?.message || 'Could not load teacher resources.',
      );
    } finally {
      setResourcesLoading(false);
    }
  }, []);

  const loadTemplates = useCallback(
    async (classGroupId, courseId, { openModal = false } = {}) => {
      const normalizedClassId = Number(classGroupId);

      const normalizedCourseId = Number(courseId);

      if (
        !Number.isFinite(normalizedClassId) ||
        !Number.isFinite(normalizedCourseId)
      ) {
        setTemplates([]);
        return [];
      }

      try {
        const response = await api(
          `/api/exams/templates?class_group_id=${encodeURIComponent(
            normalizedClassId,
          )}&course_id=${encodeURIComponent(normalizedCourseId)}`,
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
          'Add Exam Paper',
          error?.message || 'Could not load exam templates.',
        );

        return [];
      }
    },
    [],
  );

  const loadInitialData = useCallback(async () => {
    if (!Number.isFinite(examinationId)) {
      Alert.alert('Add Exam Paper', 'Examination ID is missing.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
      return;
    }

    if (!Number.isFinite(currentUserId)) {
      Alert.alert('Add Exam Paper', 'Current user ID is missing.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
      return;
    }

    try {
      setLoading(true);

      const [examinationsResponse, combosResponse, resourcesResponse] =
        await Promise.all([
          api('/api/examinations/v1/options'),
          api(`/api/examinations/v1/${examinationId}/combos`),
          api(`/api/exams/resources-for-teacher/${currentUserId}`),
        ]);

      setExaminationOptions(
        Array.isArray(examinationsResponse?.data)
          ? examinationsResponse.data
          : [],
      );

      setCombos(
        Array.isArray(combosResponse?.combos) ? combosResponse.combos : [],
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

      navigation.setOptions({
        title: 'Add Exam Paper',
      });
    } catch (error) {
      console.log('Add exam paper initialization error:', error);

      Alert.alert(
        'Add Exam Paper',
        error?.message || 'Could not load exam paper options.',
      );
    } finally {
      setLoading(false);
    }
  }, [currentUserId, examinationId, navigation]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  async function changeTeacher(teacherId) {
    const nextTeacherId = Number(teacherId);

    if (
      !Number.isFinite(nextTeacherId) ||
      nextTeacherId === selectedTeacherId
    ) {
      return;
    }

    try {
      setResourcesLoading(true);

      const response = await api(
        `/api/exams/resources-for-teacher/${nextTeacherId}`,
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

      setSelectedTeacherId(nextTeacherId);
      setClasses(nextClasses);
      setCourses(nextCourses);

      setSelectedClassId(currentClassId =>
        nextClasses.some(item => item.id === currentClassId)
          ? currentClassId
          : null,
      );

      setSelectedCourseId(currentCourseId =>
        nextCourses.some(item => item.id === currentCourseId)
          ? currentCourseId
          : null,
      );
    } catch (error) {
      console.log('Teacher resources load error:', error);

      Alert.alert(
        'Add Exam Paper',
        error?.message || 'Could not load teacher resources.',
      );
    } finally {
      setResourcesLoading(false);
    }
  }

  async function changeCourse(courseId) {
    const nextCourseId = Number(courseId);

    if (!Number.isFinite(nextCourseId)) {
      return;
    }

    setSelectedCourseId(nextCourseId);
    setSelectedClassId(null);
    setTemplates([]);

    try {
      setResourcesLoading(true);

      const response = await api(
        `/api/exams/teachers-for?course_id=${encodeURIComponent(nextCourseId)}`,
      );

      const teacherRows = Array.isArray(response?.teachers)
        ? response.teachers
        : [];

      const normalizedTeachers = teacherRows
        .map(normalizeTeacher)
        .filter(item => Number.isFinite(item.id));

      setTeachers(normalizedTeachers);

      const currentTeacherStillAvailable = normalizedTeachers.some(
        item => item.id === selectedTeacherId,
      );

      if (!currentTeacherStillAvailable) {
        setSelectedTeacherId(null);
        setClasses([]);
      }
    } catch (error) {
      console.log('Teachers for course load error:', error);

      Alert.alert(
        'Add Exam Paper',
        error?.message || 'Could not load teachers for the selected course.',
      );
    } finally {
      setResourcesLoading(false);
    }
  }

  async function changeClass(classId) {
    const nextClassId = Number(classId);

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
        id: `${Date.now()}-${current.length}`,
        label: '',
        marks: '0',
      },
    ]);
  }

  function updateAdditionalItem(itemId, field, value) {
    setAdditionalItems(current =>
      current.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item,
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

      console.log('Save template payload:', payload);

      const response = await api('/api/exams/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const templateId = Number(response?.id);

      if (!Number.isFinite(templateId)) {
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
    if (!selectedTemplateId) {
      setTemplatePickerModalVisible(false);
      return;
    }

    try {
      setApplyingTemplate(true);

      const response = await api(`/api/exams/templates/${selectedTemplateId}`);

      const nextTotalMarks = Number(response?.total_marks || 0);

      const templateItems = Array.isArray(response?.items)
        ? response.items
        : [];

      if (Number.isFinite(nextTotalMarks) && nextTotalMarks > 0) {
        setTotalMarks(String(nextTotalMarks));
      }

      setAdditionalItems(
        templateItems.map((item, index) => ({
          id: `template-${item?.id ?? index}-${Date.now()}`,
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

  async function createExamPaper() {
    if (creating) {
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

    const extras = additionalItems
      .filter(item => item.label.trim())
      .map(item => ({
        name: item.label.trim(),
        marks: Number(item.marks || 0),
      }));

    const nowIso = new Date().toISOString();

    const payload = {
      class_group_id: selectedClassId,
      course_id: selectedCourseId,
      ends_at: nowIso,
      examination_id: examinationId,
      is_online: isOnline,
      starts_at: nowIso,
      total_marks: totalMarksNumber,
      extras,
      teacher_id: selectedTeacherId,
    };

    try {
      setCreating(true);

      console.log('Create exam paper payload:', payload);

      const response = await api('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const createdExamId = Number(response?.id ?? response?.exam_id);

      if (!Number.isFinite(createdExamId)) {
        throw new Error('Exam paper was created but no exam ID was returned.');
      }

      const extrasResponse = await api(`/api/exams/${createdExamId}/extras`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extras,
        }),
      });

      if (extrasResponse?.ok !== true) {
        throw new Error(
          'Exam paper was created, but additional requirements could not be saved.',
        );
      }

      navigation.goBack();
    } catch (error) {
      console.log('Create exam paper error:', error);

      Alert.alert(
        'Create failed',
        error?.message || 'Could not create the exam paper.',
      );
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading exam paper form...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.screenContent,
        {
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <Text style={styles.pageTitle}>Add Exam Paper</Text>
        <Text numberOfLines={2} style={styles.examinationName}>
          {examinationName}
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Create Exam</Text>

        <Text style={styles.fieldLabel}>Teacher/Admin</Text>
        <Pressable
          onPress={() => setTeacherModalVisible(true)}
          disabled={creating}
          style={({ pressed }) => [
            styles.selectField,
            creating && styles.controlDisabled,
            pressed && !creating && styles.controlPressed,
          ]}
        >
          <Text numberOfLines={1} style={styles.selectFieldText}>
            {selectedTeacherLabel}
          </Text>
          <Text style={styles.selectArrow}>⌄</Text>
        </Pressable>

        <Text style={styles.fieldLabel}>Course</Text>
        <Pressable
          onPress={() => setCourseModalVisible(true)}
          disabled={creating || resourcesLoading || courses.length === 0}
          style={({ pressed }) => [
            styles.selectField,
            (creating || resourcesLoading || courses.length === 0) &&
              styles.controlDisabled,
            pressed &&
              !creating &&
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
          disabled={creating || resourcesLoading || classes.length === 0}
          style={({ pressed }) => [
            styles.selectField,
            (creating || resourcesLoading || classes.length === 0) &&
              styles.controlDisabled,
            pressed &&
              !creating &&
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
          disabled={creating}
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
          editable={!creating}
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
              disabled={creating}
              style={({ pressed }) => [
                styles.addItemButton,
                creating && styles.controlDisabled,
                pressed && !creating && styles.controlPressed,
              ]}
            >
              <Text style={styles.addItemButtonText}>+ Add item</Text>
            </Pressable>

            <Pressable
              onPress={saveAsTemplate}
              disabled={creating}
              style={({ pressed }) => [
                styles.templateButton,
                creating && styles.controlDisabled,
                pressed && !creating && styles.controlPressed,
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
              <View key={item.id} style={styles.requirementRow}>
                <TextInput
                  value={item.label}
                  onChangeText={value =>
                    updateAdditionalItem(item.id, 'label', value)
                  }
                  placeholder="e.g., Practical / Project / Overall Performance"
                  placeholderTextColor="#64748B"
                  editable={!creating}
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
                  editable={!creating}
                  style={styles.requirementMarksInput}
                />

                <Pressable
                  onPress={() => removeAdditionalItem(item.id)}
                  disabled={creating}
                  style={({ pressed }) => [
                    styles.removeItemButton,
                    creating && styles.controlDisabled,
                    pressed && !creating && styles.controlPressed,
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
            disabled={creating}
            style={({ pressed }) => [
              styles.cancelButton,
              creating && styles.controlDisabled,
              pressed && !creating && styles.controlPressed,
            ]}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={createExamPaper}
            disabled={creating}
            style={({ pressed }) => [
              styles.createButton,
              creating && styles.controlDisabled,
              pressed && !creating && styles.controlPressed,
            ]}
          >
            {creating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>Create</Text>
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.hiddenMetadata}>
        <Text>{examinationOptions.length}</Text>
        <Text>{combos.length}</Text>
        <Text>{templates.length}</Text>
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
        onRequestClose={() => setSaveTemplateModalVisible(false)}
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
                  styles.createButton,
                  savingTemplate && styles.controlDisabled,
                  pressed && !savingTemplate && styles.controlPressed,
                ]}
              >
                {savingTemplate ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.createButtonText}>Save</Text>
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
        onRequestClose={() => setTemplatePickerModalVisible(false)}
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
                  styles.createButton,
                  applyingTemplate && styles.controlDisabled,
                  pressed && !applyingTemplate && styles.controlPressed,
                ]}
              >
                {applyingTemplate ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.createButtonText}>Apply</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
