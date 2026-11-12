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
import styles from './AdminTeacherForm.styles';

function normalizeClass(item) {
  return {
    id: Number(item?.id),

    name: String(item?.name || ''),

    section: String(item?.section || ''),

    label: String(
      item?.label ||
        (item?.section ? `${item?.name} (${item?.section})` : item?.name) ||
        'Unnamed class',
    ),
  };
}

function normalizeCourse(item) {
  return {
    id: Number(item?.id),

    label: String(item?.label || item?.title || 'Untitled course'),
  };
}

function MultiSelectModal({
  visible,
  title,
  placeholder,
  options,
  selectedIds,
  onChange,
  onClose,
}) {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (!visible) {
      setSearchText('');
    }
  }, [visible]);

  const filteredOptions = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return options;
    }

    return options.filter(item =>
      String(item?.label || '')
        .toLowerCase()
        .includes(query),
    );
  }, [options, searchText]);

  function toggleOption(itemId) {
    const id = Number(itemId);

    if (!Number.isFinite(id)) {
      return;
    }

    const next = new Set(selectedIds);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    onChange(next);
  }

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

        <View style={styles.multiSelectModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.modalCloseIcon,

                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.modalCloseIconText}>×</Text>
            </Pressable>
          </View>

          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={placeholder}
            placeholderTextColor="#64748B"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.modalSearchInput}
          />

          <FlatList
            data={filteredOptions}
            keyExtractor={item => String(item.id)}
            keyboardShouldPersistTaps="handled"
            style={styles.modalList}
            contentContainerStyle={styles.modalListContent}
            ListEmptyComponent={
              <View style={styles.modalEmpty}>
                <Text style={styles.modalEmptyText}>No options found.</Text>
              </View>
            }
            renderItem={({ item }) => {
              const selected = selectedIds.has(item.id);

              return (
                <Pressable
                  onPress={() => toggleOption(item.id)}
                  style={({ pressed }) => [
                    styles.optionRow,

                    selected && styles.optionRowSelected,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.checkbox,

                      selected && styles.checkboxSelected,
                    ]}
                  >
                    {selected ? (
                      <Text style={styles.checkboxText}>✓</Text>
                    ) : null}
                  </View>

                  <Text numberOfLines={2} style={styles.optionText}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            }}
          />

          <View style={styles.modalFooter}>
            <Text style={styles.selectedCountText}>
              {selectedIds.size} selected
            </Text>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.doneButton,

                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SelectedItems({ items, selectedIds, onRemove }) {
  const selectedItems = items.filter(item => selectedIds.has(item.id));

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.selectedItemsWrap}>
      {selectedItems.map(item => (
        <View key={String(item.id)} style={styles.selectedChip}>
          <Text numberOfLines={1} style={styles.selectedChipText}>
            {item.label}
          </Text>

          <Pressable onPress={() => onRemove(item.id)} hitSlop={8}>
            <Text style={styles.selectedChipRemove}>×</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

export default function AdminTeacherForm({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const mode = route?.params?.mode === 'edit' ? 'edit' : 'add';

  const existingTeacher = route?.params?.teacher || null;

  const isEdit = mode === 'edit';

  const [classes, setClasses] = useState([]);

  const [courses, setCourses] = useState([]);

  const [fullName, setFullName] = useState(
    isEdit ? String(existingTeacher?.name || '') : '',
  );

  const [email, setEmail] = useState(
    isEdit ? String(existingTeacher?.email || '') : '',
  );

  const [department, setDepartment] = useState(
    isEdit ? String(existingTeacher?.department || '') : '',
  );

  const [designation, setDesignation] = useState(
    isEdit ? String(existingTeacher?.designation || '') : '',
  );

  const [phone, setPhone] = useState(
    isEdit ? String(existingTeacher?.phone || '') : '',
  );

  const [bio, setBio] = useState(
    isEdit ? String(existingTeacher?.bio || '') : '',
  );

  const [selectedClassIds, setSelectedClassIds] = useState(() => {
    const ids = new Set();

    if (isEdit) {
      const rows = Array.isArray(existingTeacher?.classGroups)
        ? existingTeacher.classGroups
        : Array.isArray(existingTeacher?.class_groups)
        ? existingTeacher.class_groups
        : [];

      rows.forEach(item => {
        const id = Number(item?.id);

        if (Number.isFinite(id)) {
          ids.add(id);
        }
      });
    }

    return ids;
  });

  const [selectedCourseIds, setSelectedCourseIds] = useState(() => {
    const ids = new Set();

    if (isEdit) {
      const rows = Array.isArray(existingTeacher?.courses)
        ? existingTeacher.courses
        : [];

      rows.forEach(item => {
        const id = Number(item?.id);

        if (Number.isFinite(id)) {
          ids.add(id);
        }
      });
    }

    return ids;
  });

  const [classModalVisible, setClassModalVisible] = useState(false);

  const [courseModalVisible, setCourseModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const loadOptions = useCallback(async () => {
    try {
      setLoading(true);

      const [classResponse, courseResponse] = await Promise.all([
        api('/api/teachers/class-groups?q='),

        api('/api/teachers/courses?q='),
      ]);

      setClasses(
        (Array.isArray(classResponse?.classes) ? classResponse.classes : [])
          .map(normalizeClass)
          .filter(item => Number.isFinite(item.id)),
      );

      setCourses(
        (Array.isArray(courseResponse?.courses) ? courseResponse.courses : [])
          .map(normalizeCourse)
          .filter(item => Number.isFinite(item.id)),
      );

      navigation.setOptions({
        title: isEdit ? 'Edit Teacher' : 'Add Teacher',
      });
    } catch (error) {
      console.log('Teacher form options error:', error);

      Alert.alert(
        isEdit ? 'Edit Teacher' : 'Add Teacher',
        error?.message || 'Could not load teacher form options.',
      );
    } finally {
      setLoading(false);
    }
  }, [isEdit, navigation]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  function removeClass(classId) {
    setSelectedClassIds(current => {
      const next = new Set(current);

      next.delete(Number(classId));

      return next;
    });
  }

  function removeCourse(courseId) {
    setSelectedCourseIds(current => {
      const next = new Set(current);

      next.delete(Number(courseId));

      return next;
    });
  }

  function validateForm() {
    if (!isEdit) {
      if (!fullName.trim()) {
        Alert.alert('Full Name required', 'Please enter the teacher name.');

        return false;
      }

      if (!email.trim()) {
        Alert.alert('Email required', 'Please enter the teacher email.');

        return false;
      }

      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

      if (!validEmail) {
        Alert.alert('Invalid email', 'Please enter a valid email address.');

        return false;
      }
    }

    return true;
  }

  async function submitTeacher() {
    if (saving) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const commonPayload = {
      department: department.trim() || null,

      designation: designation.trim() || null,

      phone: phone.trim() || null,

      bio: bio.trim() || null,

      class_group_ids: Array.from(selectedClassIds),

      course_ids: Array.from(selectedCourseIds),
    };

    try {
      setSaving(true);

      let response;

      if (isEdit) {
        const teacherId = Number(existingTeacher?.id);

        if (!Number.isFinite(teacherId)) {
          throw new Error('Teacher profile ID is missing.');
        }

        const payload = {
          ...commonPayload,
        };

        console.log('Update teacher payload:', payload);

        response = await api(`/api/teachers/${teacherId}`, {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        });
      } else {
        const payload = {
          ...commonPayload,

          name: fullName.trim(),

          email: email.trim(),
        };

        console.log('Create teacher payload:', payload);

        response = await api('/api/teachers', {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        });
      }

      console.log(
        isEdit ? 'Update teacher response:' : 'Create teacher response:',
        response,
      );

      if (response?.ok !== true) {
        throw new Error(
          isEdit
            ? 'Could not update the teacher.'
            : 'Could not create the teacher.',
        );
      }

      navigation.goBack();
    } catch (error) {
      console.log(
        isEdit ? 'Update teacher error:' : 'Create teacher error:',
        error,
      );

      Alert.alert(
        isEdit ? 'Update failed' : 'Create failed',

        error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          (isEdit
            ? 'Could not update the teacher.'
            : 'Could not create the teacher.'),
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading teacher form...</Text>
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
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>
          {isEdit ? 'Edit Teacher' : 'Create Teacher'}
        </Text>

        <Text style={styles.fieldLabel}>Full Name</Text>

        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Jane Doe"
          placeholderTextColor="#64748B"
          editable={!saving && !isEdit}
          style={[styles.textInput, isEdit && styles.readOnlyInput]}
        />

        <Text style={styles.fieldLabel}>Email</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="jane@example.com"
          placeholderTextColor="#64748B"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!saving && !isEdit}
          style={[styles.textInput, isEdit && styles.readOnlyInput]}
        />

        <Text style={styles.fieldLabel}>Department</Text>

        <TextInput
          value={department}
          onChangeText={setDepartment}
          placeholder="Mathematics"
          placeholderTextColor="#64748B"
          editable={!saving}
          style={styles.textInput}
        />

        <Text style={styles.fieldLabel}>Designation</Text>

        <TextInput
          value={designation}
          onChangeText={setDesignation}
          placeholder="Senior Teacher"
          placeholderTextColor="#64748B"
          editable={!saving}
          style={styles.textInput}
        />

        <Text style={styles.fieldLabel}>Phone</Text>

        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="+1 555 0100"
          placeholderTextColor="#64748B"
          keyboardType="phone-pad"
          editable={!saving}
          style={styles.textInput}
        />

        <Text style={styles.fieldLabel}>Assigned Classes</Text>

        <Pressable
          onPress={() => setClassModalVisible(true)}
          disabled={saving}
          style={({ pressed }) => [
            styles.multiSelectField,

            saving && styles.controlDisabled,

            pressed && !saving && styles.controlPressed,
          ]}
        >
          <Text
            style={[
              styles.multiSelectFieldText,

              selectedClassIds.size === 0 && styles.placeholderText,
            ]}
          >
            {selectedClassIds.size > 0
              ? `${selectedClassIds.size} class${
                  selectedClassIds.size === 1 ? '' : 'es'
                } selected`
              : 'Type to search classes...'}
          </Text>

          <Text style={styles.selectArrow}>⌄</Text>
        </Pressable>

        <SelectedItems
          items={classes}
          selectedIds={selectedClassIds}
          onRemove={removeClass}
        />

        <Text style={styles.fieldLabel}>Assigned Courses</Text>

        <Pressable
          onPress={() => setCourseModalVisible(true)}
          disabled={saving}
          style={({ pressed }) => [
            styles.multiSelectField,

            saving && styles.controlDisabled,

            pressed && !saving && styles.controlPressed,
          ]}
        >
          <Text
            style={[
              styles.multiSelectFieldText,

              selectedCourseIds.size === 0 && styles.placeholderText,
            ]}
          >
            {selectedCourseIds.size > 0
              ? `${selectedCourseIds.size} course${
                  selectedCourseIds.size === 1 ? '' : 's'
                } selected`
              : 'Type to search courses...'}
          </Text>

          <Text style={styles.selectArrow}>⌄</Text>
        </Pressable>

        <SelectedItems
          items={courses}
          selectedIds={selectedCourseIds}
          onRemove={removeCourse}
        />

        <Text style={styles.fieldLabel}>Bio</Text>

        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Short bio (optional)"
          placeholderTextColor="#64748B"
          editable={!saving}
          multiline
          textAlignVertical="top"
          style={[styles.textInput, styles.bioInput]}
        />

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
            onPress={submitTeacher}
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
              <Text style={styles.saveButtonText}>
                {isEdit ? 'Save' : 'Create'}
              </Text>
            )}
          </Pressable>
        </View>
      </View>

      <MultiSelectModal
        visible={classModalVisible}
        title="Assigned Classes"
        placeholder="Search classes..."
        options={classes}
        selectedIds={selectedClassIds}
        onChange={setSelectedClassIds}
        onClose={() => setClassModalVisible(false)}
      />

      <MultiSelectModal
        visible={courseModalVisible}
        title="Assigned Courses"
        placeholder="Search courses..."
        options={courses}
        selectedIds={selectedCourseIds}
        onChange={setSelectedCourseIds}
        onClose={() => setCourseModalVisible(false)}
      />
    </ScrollView>
  );
}
