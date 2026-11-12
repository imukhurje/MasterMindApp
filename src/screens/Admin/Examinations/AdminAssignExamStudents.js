// src/screens/Admin/Examinations/AdminAssignExamStudents.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';
import styles from './AdminAssignExamStudents.styles';

function normalizeStudent(student) {
  return {
    id: Number(student?.id),
    name: String(student?.name || 'Unnamed student'),
    email: student?.email ? String(student.email) : '',
    rollNo:
      student?.roll_no !== null && student?.roll_no !== undefined
        ? String(student.roll_no)
        : '',
  };
}

function normalizeClassGroup(classGroup) {
  return {
    id: Number(classGroup?.id),
    name: String(classGroup?.name || 'Unnamed class'),
    section: classGroup?.section ? String(classGroup.section) : '',
  };
}

function getClassGroupLabel(classGroup) {
  if (!classGroup) {
    return 'Select class';
  }

  return classGroup.section
    ? `${classGroup.name} (${classGroup.section})`
    : classGroup.name;
}

function studentMatchesSearch(student, searchValue) {
  const query = String(searchValue || '')
    .trim()
    .toLowerCase();

  if (!query) {
    return true;
  }

  return (
    student.name.toLowerCase().includes(query) ||
    student.email.toLowerCase().includes(query) ||
    student.rollNo.toLowerCase().includes(query)
  );
}

export default function AdminAssignExamStudents({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const optionsRequestId = useRef(0);

  const examId = route?.params?.examId;
  const examName = route?.params?.examName || 'Exam Paper';
  const itemClassName = route?.params?.className || 'Item Class';

  const parsedItemClassGroupId = Number(route?.params?.classGroupId);

  const itemClassGroupId = Number.isFinite(parsedItemClassGroupId)
    ? parsedItemClassGroupId
    : null;

  const [students, setStudents] = useState([]);
  const [classGroups, setClassGroups] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(itemClassGroupId);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [searchText, setSearchText] = useState('');
  const [classModalVisible, setClassModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const [studentOptionsLoading, setStudentOptionsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedClass = useMemo(
    () =>
      classGroups.find(classGroup => classGroup.id === selectedClassId) || null,
    [classGroups, selectedClassId],
  );

  const selectedClassLabel = useMemo(() => {
    const baseLabel = selectedClass
      ? getClassGroupLabel(selectedClass)
      : itemClassName;

    return selectedClassId === itemClassGroupId
      ? `${baseLabel} (Item's Class)`
      : baseLabel;
  }, [itemClassGroupId, itemClassName, selectedClass, selectedClassId]);

  const filteredStudents = useMemo(
    () => students.filter(student => studentMatchesSearch(student, searchText)),
    [searchText, students],
  );

  const selectedCount = selectedIds.size;

  const getOptionsUrl = useCallback(
    classGroupId => {
      const hasClassGroupId =
        classGroupId !== null &&
        classGroupId !== undefined &&
        String(classGroupId).trim() !== '';

      if (!hasClassGroupId) {
        return `/api/exams/${examId}/students/options`;
      }

      const parsedClassGroupId = Number(classGroupId);

      if (!Number.isFinite(parsedClassGroupId)) {
        return `/api/exams/${examId}/students/options`;
      }

      return (
        `/api/exams/${examId}/students/options` +
        `?class_group_id=${encodeURIComponent(parsedClassGroupId)}&only_class=1`
      );
    },
    [examId],
  );

  const applyStudentOptions = useCallback(response => {
    const optionStudents = Array.isArray(response?.students)
      ? response.students
      : [];

    const normalizedStudents = optionStudents
      .map(normalizeStudent)
      .filter(student => Number.isFinite(student.id));

    setStudents(normalizedStudents);
  }, []);

  const loadInitialData = useCallback(
    async ({ refresh = false } = {}) => {
      if (!examId) {
        Alert.alert('Assign Students', 'Exam paper ID is missing.', [
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

        const optionsUrl = refresh
          ? getOptionsUrl(selectedClassId)
          : getOptionsUrl(null);

        const [assignedResponse, optionsResponse, classesResponse] =
          await Promise.all([
            api(`/api/exams/${examId}/students`),
            api(optionsUrl),
            api('/api/class-groups'),
          ]);

        const assignedIds = Array.isArray(assignedResponse?.assigned_ids)
          ? assignedResponse.assigned_ids
              .map(id => Number(id))
              .filter(id => Number.isFinite(id))
          : [];

        const responseClasses = Array.isArray(classesResponse?.classes)
          ? classesResponse.classes
          : Array.isArray(classesResponse?.data?.classes)
          ? classesResponse.data.classes
          : [];

        const normalizedClasses = responseClasses
          .map(normalizeClassGroup)
          .filter(classGroup => Number.isFinite(classGroup.id));

        console.log('Loaded class groups:', normalizedClasses);

        setClassGroups(normalizedClasses);
        setSelectedIds(new Set(assignedIds));
        applyStudentOptions(optionsResponse);

        if (selectedClassId === null && itemClassGroupId !== null) {
          setSelectedClassId(itemClassGroupId);
        }

        navigation.setOptions({
          title: 'Assign Students',
        });
      } catch (error) {
        console.log('Assign students load error:', error);

        Alert.alert(
          'Assign Students',
          error?.message || 'Could not load students.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [applyStudentOptions, examId, getOptionsUrl, itemClassGroupId, navigation],
  );

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const loadStudentsForClass = useCallback(
    async classGroupId => {
      const requestId = optionsRequestId.current + 1;
      optionsRequestId.current = requestId;

      try {
        setStudentOptionsLoading(true);

        const response = await api(getOptionsUrl(classGroupId));

        if (requestId !== optionsRequestId.current) {
          return;
        }

        applyStudentOptions(response);
      } catch (error) {
        if (requestId !== optionsRequestId.current) {
          return;
        }

        console.log('Filter students by class error:', error);

        setStudents([]);

        Alert.alert(
          'Assign Students',
          error?.message || 'Could not load students for the selected class.',
        );
      } finally {
        if (requestId === optionsRequestId.current) {
          setStudentOptionsLoading(false);
        }
      }
    },
    [applyStudentOptions, getOptionsUrl],
  );

  async function changeClass(classGroupId) {
    const nextClassId = Number(classGroupId);

    setClassModalVisible(false);

    if (!Number.isFinite(nextClassId) || nextClassId === selectedClassId) {
      return;
    }

    setSelectedClassId(nextClassId);
    setSearchText('');

    await loadStudentsForClass(nextClassId);
  }

  function toggleStudent(studentId) {
    setSelectedIds(current => {
      const next = new Set(current);

      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }

      return next;
    });
  }

  function selectAllVisible() {
    setSelectedIds(current => {
      const next = new Set(current);

      filteredStudents.forEach(student => {
        next.add(student.id);
      });

      return next;
    });
  }

  function clearAll() {
    setSelectedIds(new Set());
  }

  async function saveStudents() {
    if (!examId || saving) {
      return;
    }

    const studentIds = Array.from(selectedIds)
      .map(id => Number(id))
      .filter(id => Number.isFinite(id));

    try {
      setSaving(true);

      const payload = {
        student_ids: studentIds,
      };

      console.log('Assign students payload:', payload);

      const response = await api(`/api/exams/${examId}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response?.ok !== true) {
        throw new Error('Could not assign students.');
      }

      navigation.goBack();
    } catch (error) {
      console.log('Assign students error:', error);

      Alert.alert(
        'Save failed',
        error?.message || 'Could not assign students.',
      );
    } finally {
      setSaving(false);
    }
  }

  function renderStudent({ item }) {
    const selected = selectedIds.has(item.id);

    return (
      <Pressable
        onPress={() => toggleStudent(item.id)}
        accessibilityRole="checkbox"
        accessibilityLabel={`Select ${item.name}`}
        accessibilityState={{ checked: selected }}
        style={({ pressed }) => [
          styles.studentRow,
          selected && styles.studentRowSelected,
          pressed && styles.controlPressed,
        ]}
      >
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>

        <View style={styles.studentContent}>
          <Text numberOfLines={1} style={styles.studentName}>
            {item.name}
          </Text>

          {item.email ? (
            <Text numberOfLines={1} style={styles.studentMeta}>
              {item.email}
            </Text>
          ) : null}
        </View>

        {item.rollNo ? (
          <Text style={styles.rollNumber}>{item.rollNo}</Text>
        ) : null}
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading students...</Text>
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
        <Text style={styles.pageTitle}>Assign Students</Text>

        <Text numberOfLines={2} style={styles.examName}>
          {examName}
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.fieldLabel}>Filter by Class</Text>

        <Pressable
          onPress={() => setClassModalVisible(true)}
          disabled={studentOptionsLoading || saving}
          accessibilityRole="button"
          accessibilityLabel="Filter students by class"
          style={({ pressed }) => [
            styles.classSelect,
            (studentOptionsLoading || saving) && styles.controlDisabled,
            pressed &&
              !studentOptionsLoading &&
              !saving &&
              styles.controlPressed,
          ]}
        >
          <Text numberOfLines={1} style={styles.classSelectText}>
            {selectedClassLabel}
          </Text>

          {studentOptionsLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.classSelectArrow}>▼</Text>
          )}
        </Pressable>

        <Text style={styles.fieldLabel}>Search (name/email/roll)</Text>

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Type to filter..."
          placeholderTextColor="#64748B"
          autoCorrect={false}
          editable={!studentOptionsLoading}
          style={styles.searchInput}
        />

        <View style={styles.listActions}>
          <Pressable
            onPress={selectAllVisible}
            disabled={filteredStudents.length === 0 || studentOptionsLoading}
            style={({ pressed }) => [
              styles.secondaryButton,
              (filteredStudents.length === 0 || studentOptionsLoading) &&
                styles.controlDisabled,
              pressed &&
                filteredStudents.length > 0 &&
                !studentOptionsLoading &&
                styles.controlPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Select All</Text>
          </Pressable>

          <Pressable
            onPress={clearAll}
            disabled={selectedCount === 0 || studentOptionsLoading}
            style={({ pressed }) => [
              styles.secondaryButton,
              (selectedCount === 0 || studentOptionsLoading) &&
                styles.controlDisabled,
              pressed &&
                selectedCount > 0 &&
                !studentOptionsLoading &&
                styles.controlPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Clear All</Text>
          </Pressable>

          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>
              {selectedCount} selected
            </Text>
          </View>
        </View>

        <View style={styles.listWrapper}>
          {studentOptionsLoading ? (
            <View style={styles.optionsLoading}>
              <ActivityIndicator size="large" />

              <Text style={styles.optionsLoadingText}>Loading students...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredStudents}
              keyExtractor={item => String(item.id)}
              renderItem={renderStudent}
              style={styles.list}
              contentContainerStyle={
                filteredStudents.length === 0
                  ? styles.emptyListContent
                  : styles.listContent
              }
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => loadInitialData({ refresh: true })}
                  tintColor="#FFFFFF"
                  colors={['#FFFFFF']}
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateTitle}>No students found</Text>

                  <Text style={styles.emptyStateText}>
                    No students are available for the selected class.
                  </Text>
                </View>
              }
            />
          )}
        </View>

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
            onPress={saveStudents}
            disabled={saving || studentOptionsLoading}
            style={({ pressed }) => [
              styles.saveButton,
              (saving || studentOptionsLoading) && styles.controlDisabled,
              pressed &&
                !saving &&
                !studentOptionsLoading &&
                styles.controlPressed,
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

      <Modal
        transparent
        visible={classModalVisible}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setClassModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setClassModalVisible(false)}
          />

          <View style={styles.classModal}>
            <Text style={styles.classModalTitle}>Filter by Class</Text>

            {classGroups.length === 0 ? (
              <View style={styles.emptyClassList}>
                <Text style={styles.emptyClassListText}>No classes found.</Text>
              </View>
            ) : (
              <FlatList
                data={classGroups}
                keyExtractor={item => String(item.id)}
                style={styles.classOptionsList}
                renderItem={({ item }) => {
                  const selected = item.id === selectedClassId;

                  const itemClass = item.id === itemClassGroupId;

                  return (
                    <Pressable
                      onPress={() => changeClass(item.id)}
                      style={({ pressed }) => [
                        styles.classOption,
                        selected && styles.classOptionSelected,
                        pressed && styles.controlPressed,
                      ]}
                    >
                      <View style={styles.classOptionTextWrapper}>
                        <Text
                          style={[
                            styles.classOptionText,
                            selected && styles.classOptionTextSelected,
                          ]}
                        >
                          {getClassGroupLabel(item)}
                        </Text>

                        {itemClass ? (
                          <Text style={styles.itemClassText}>
                            Item&apos;s Class
                          </Text>
                        ) : null}
                      </View>

                      {selected ? (
                        <Text style={styles.classOptionCheck}>✓</Text>
                      ) : null}
                    </Pressable>
                  );
                }}
              />
            )}

            <Pressable
              onPress={() => setClassModalVisible(false)}
              style={({ pressed }) => [
                styles.modalCloseButton,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
