import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';
import styles from './AdminAssignHomeworkStudents.styles';

function normalizeStudent(item) {
  return {
    id: Number(item?.id),

    name: String(item?.name || 'Unnamed student'),

    email: String(item?.email || ''),

    rollNo: String(item?.roll_no || ''),
  };
}

function normalizeClass(item) {
  const name = String(item?.name || 'Unnamed class');

  const section = String(item?.section || '').trim();

  return {
    id: Number(item?.id),

    name: section ? `${name} (${section})` : name,
  };
}

function ClassSelectModal({
  visible,
  classes,
  selectedClassId,
  itemClassId,
  onSelect,
  onClose,
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

        <View style={styles.classModal}>
          <Text style={styles.modalTitle}>Filter by Class</Text>

          <Pressable
            onPress={() => {
              onSelect(null);
              onClose();
            }}
            style={({ pressed }) => [
              styles.classOption,

              selectedClassId === null && styles.classOptionSelected,

              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.classOptionText}>All Students</Text>
          </Pressable>

          {classes.map(item => {
            const selected = Number(selectedClassId) === item.id;

            const isItemClass = Number(itemClassId) === item.id;

            return (
              <Pressable
                key={String(item.id)}
                onPress={() => {
                  onSelect(item.id);
                  onClose();
                }}
                style={({ pressed }) => [
                  styles.classOption,

                  selected && styles.classOptionSelected,

                  pressed && styles.controlPressed,
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.classOptionText}>{item.name}</Text>

                  {isItemClass ? (
                    <Text style={styles.itemClassHint}>Homework's Class</Text>
                  ) : null}
                </View>

                {selected ? (
                  <Text style={styles.classOptionCheck}>✓</Text>
                ) : null}
              </Pressable>
            );
          })}

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

export default function AdminAssignHomeworkStudents({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const homeworkId = Number(route?.params?.homeworkId);

  const homeworkName = route?.params?.homeworkName || 'Homework';

  const homeworkClassId = Number(route?.params?.classGroupId);

  const homeworkClassName = route?.params?.className || '';

  const homeworkCourseTitle = route?.params?.courseTitle || '';

  const [students, setStudents] = useState([]);

  const [classes, setClasses] = useState([]);

  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());

  const [selectedClassId, setSelectedClassId] = useState(
    Number.isFinite(homeworkClassId) ? homeworkClassId : null,
  );

  const [searchText, setSearchText] = useState('');

  const [classModalVisible, setClassModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);

  const [studentsLoading, setStudentsLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const loadStudentOptions = useCallback(
    async classId => {
      if (!Number.isFinite(homeworkId)) {
        return;
      }

      try {
        setStudentsLoading(true);

        let endpoint = `/api/homeworks/${homeworkId}/students/options`;

        if (Number.isFinite(Number(classId))) {
          endpoint += `?class_group_id=${encodeURIComponent(
            Number(classId),
          )}&only_class=1`;
        }

        const response = await api(endpoint);

        const rows = (
          Array.isArray(response?.students) ? response.students : []
        )
          .map(normalizeStudent)
          .filter(item => Number.isFinite(item.id));

        setStudents(rows);
      } catch (error) {
        console.log('Homework student options error:', error);

        setStudents([]);

        Alert.alert(
          'Assign Students',
          error?.message || 'Could not load students.',
        );
      } finally {
        setStudentsLoading(false);
      }
    },
    [homeworkId],
  );

  const loadInitialData = useCallback(async () => {
    if (!Number.isFinite(homeworkId)) {
      Alert.alert('Assign Students', 'Homework ID is missing.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);

      return;
    }

    try {
      setLoading(true);

      const [assignedResponse, classesResponse] = await Promise.all([
        api(`/api/homeworks/${homeworkId}/students`),

        api('/api/class-groups'),
      ]);

      const assignedIds = Array.isArray(assignedResponse?.assigned_ids)
        ? assignedResponse.assigned_ids.map(Number).filter(Number.isFinite)
        : [];

      setSelectedStudentIds(new Set(assignedIds));

      const nextClasses = (
        Array.isArray(classesResponse?.classes) ? classesResponse.classes : []
      )
        .map(normalizeClass)
        .filter(item => Number.isFinite(item.id));

      setClasses(nextClasses);

      navigation.setOptions({
        title: 'Assign Students',
      });

      await loadStudentOptions(
        Number.isFinite(homeworkClassId) ? homeworkClassId : null,
      );
    } catch (error) {
      console.log('Assign homework students load error:', error);

      Alert.alert(
        'Assign Students',
        error?.message || 'Could not load student assignment.',
      );
    } finally {
      setLoading(false);
    }
  }, [homeworkClassId, homeworkId, loadStudentOptions, navigation]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const selectedClassLabel = useMemo(() => {
    if (selectedClassId === null) {
      return 'All Students';
    }

    const classItem = classes.find(item => item.id === Number(selectedClassId));

    if (classItem) {
      if (Number(selectedClassId) === homeworkClassId) {
        return `${classItem.name} (Item's Class)`;
      }

      return classItem.name;
    }

    if (Number(selectedClassId) === homeworkClassId && homeworkClassName) {
      return `${homeworkClassName} (Item's Class)`;
    }

    return 'Select class';
  }, [classes, homeworkClassId, homeworkClassName, selectedClassId]);

  const filteredStudents = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter(student => {
      const haystack = [student.name, student.email, student.rollNo]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [searchText, students]);

  const allVisibleSelected = useMemo(
    () =>
      filteredStudents.length > 0 &&
      filteredStudents.every(item => selectedStudentIds.has(item.id)),
    [filteredStudents, selectedStudentIds],
  );

  function toggleStudent(studentId) {
    const id = Number(studentId);

    if (!Number.isFinite(id)) {
      return;
    }

    setSelectedStudentIds(current => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  function selectAllVisible() {
    setSelectedStudentIds(current => {
      const next = new Set(current);

      filteredStudents.forEach(student => {
        next.add(student.id);
      });

      return next;
    });
  }

  function clearAll() {
    setSelectedStudentIds(new Set());
  }

  async function changeClass(classId) {
    setSelectedClassId(
      Number.isFinite(Number(classId)) ? Number(classId) : null,
    );

    setSearchText('');

    await loadStudentOptions(classId);
  }

  async function saveStudents() {
    if (saving) {
      return;
    }

    const studentIds = Array.from(selectedStudentIds)
      .map(Number)
      .filter(Number.isFinite);

    try {
      setSaving(true);

      const payload = {
        student_ids: studentIds,
      };

      console.log('Assign homework students payload:', payload);

      const response = await api(`/api/homeworks/${homeworkId}/students`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(payload),
      });

      if (response?.ok !== true) {
        throw new Error('Could not save student assignments.');
      }

      navigation.goBack();
    } catch (error) {
      console.log('Assign homework students error:', error);

      Alert.alert(
        'Save failed',
        error?.message || 'Could not assign students.',
      );
    } finally {
      setSaving(false);
    }
  }

  function renderStudent({ item }) {
    const selected = selectedStudentIds.has(item.id);

    return (
      <Pressable
        onPress={() => toggleStudent(item.id)}
        style={({ pressed }) => [
          styles.studentCard,

          selected && styles.studentCardSelected,

          pressed && styles.controlPressed,
        ]}
      >
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected ? <Text style={styles.checkboxCheck}>✓</Text> : null}
        </View>

        <View style={styles.studentContent}>
          <Text numberOfLines={1} style={styles.studentName}>
            {item.name}
          </Text>

          {item.email ? (
            <Text numberOfLines={1} style={styles.studentSecondary}>
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
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <View style={styles.headerCard}>
        <Text style={styles.pageTitle}>Assign Students</Text>

        <Text numberOfLines={2} style={styles.homeworkName}>
          {homeworkName}
          {homeworkCourseTitle ? ` • ${homeworkCourseTitle}` : ''}
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.fieldLabel}>Filter by Class</Text>

        <Pressable
          onPress={() => setClassModalVisible(true)}
          style={({ pressed }) => [
            styles.selectField,

            pressed && styles.controlPressed,
          ]}
        >
          <Text numberOfLines={1} style={styles.selectFieldText}>
            {selectedClassLabel}
          </Text>

          <Text style={styles.selectArrow}>⌄</Text>
        </Pressable>

        <Text style={styles.fieldLabel}>Search (name/email/roll)</Text>

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Type to filter..."
          placeholderTextColor="#64748B"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.searchInput}
        />

        <View style={styles.selectionActions}>
          <Pressable
            onPress={selectAllVisible}
            disabled={filteredStudents.length === 0}
            style={({ pressed }) => [
              styles.outlineButton,

              filteredStudents.length === 0 && styles.controlDisabled,

              pressed && filteredStudents.length > 0 && styles.controlPressed,
            ]}
          >
            <Text style={styles.outlineButtonText}>Select All</Text>
          </Pressable>

          <Pressable
            onPress={clearAll}
            disabled={selectedStudentIds.size === 0}
            style={({ pressed }) => [
              styles.outlineButton,

              selectedStudentIds.size === 0 && styles.controlDisabled,

              pressed && selectedStudentIds.size > 0 && styles.controlPressed,
            ]}
          >
            <Text style={styles.outlineButtonText}>Clear All</Text>
          </Pressable>

          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>
              {selectedStudentIds.size} selected
            </Text>
          </View>
        </View>

        <View style={styles.studentListCard}>
          {studentsLoading ? (
            <View style={styles.listLoading}>
              <ActivityIndicator />

              <Text style={styles.loadingText}>Loading students...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredStudents}
              keyExtractor={item => String(item.id)}
              renderItem={renderStudent}
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.studentListContent}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No students found.</Text>
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

      <ClassSelectModal
        visible={classModalVisible}
        classes={classes}
        selectedClassId={selectedClassId}
        itemClassId={homeworkClassId}
        onSelect={changeClass}
        onClose={() => setClassModalVisible(false)}
      />
    </View>
  );
}
