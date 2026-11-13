// src/screens/Admin/Classworks/AdminClassworkCreate.js

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../api/client';
import styles from './AdminClassworkCreate.styles';

function buildClassLabel(item) {
  const name = String(item?.name || '').trim();

  const section = String(item?.section || '').trim();

  const academicYear = String(item?.academic_year?.label || '').trim();

  const classLabel =
    name && section ? `${name} (${section})` : name || section || 'Class';

  return academicYear ? `${classLabel} · ${academicYear}` : classLabel;
}

export default function AdminClassworkCreate() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [role, setRole] = useState('');

  const [classes, setClasses] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState(null);

  const [classModalVisible, setClassModalVisible] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState(false);
  const [subjectModalVisible, setSubjectModalVisible] = useState(false);

  const [title, setTitle] = useState('');

  const [note, setNote] = useState('');

  const loadClasses = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api('/api/class-groups');

      const rows = Array.isArray(response?.classes) ? response.classes : [];

      setRole(String(response?.role || '').toLowerCase());

      setClasses(rows);
    } catch (error) {
      console.log('Class groups load error:', error);

      Alert.alert(
        'Create Classwork',
        error?.message || 'Could not load classes.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    // Reset subjects whenever the selected class changes.
    setSubjects([]);
    setSelectedSubjectIds([]);
    setSubjectModalVisible(false);
    setSubjectsError(false);

    if (selectedClassId == null) {
      setSubjectsLoading(false);
      return;
    }

    let cancelled = false;

    const loadSubjects = async () => {
      try {
        setSubjectsLoading(true);

        const response = await api(
          `/api/classworks/courses?class_group_id=${encodeURIComponent(
            selectedClassId,
          )}`,
        );

        if (cancelled) return;

        const rows = Array.isArray(response?.courses) ? response.courses : [];

        setSubjects(
          rows
            .filter(item => item?.id != null)
            .map(item => ({
              id: Number(item.id),
              label: String(item.label || item.title || ''),
            })),
        );
      } catch (error) {
        if (cancelled) return;

        console.log('[CLASSWORK SUBJECTS ERROR]', {
          status: error?.status,
          message: error?.message,
        });

        setSubjects([]);
        setSubjectsError(true);
      } finally {
        if (!cancelled) {
          setSubjectsLoading(false);
        }
      }
    };

    loadSubjects();

    // Ignore outdated responses when switching classes quickly.
    return () => {
      cancelled = true;
    };
  }, [selectedClassId]);

  const selectedClass = useMemo(() => {
    return classes.find(item => Number(item?.id) === Number(selectedClassId));
  }, [classes, selectedClassId]);

  const toggleSubject = useCallback(subjectId => {
    const id = Number(subjectId);

    setSelectedSubjectIds(previous => {
      if (previous.includes(id)) {
        return previous.filter(value => value !== id);
      }

      return [...previous, id];
    });
  }, []);

  const selectedSubjects = useMemo(
    () => subjects.filter(item => selectedSubjectIds.includes(Number(item.id))),
    [subjects, selectedSubjectIds],
  );

  const canCreate =
    title.trim().length > 0 &&
    selectedClassId !== null &&
    selectedSubjectIds.length > 0 &&
    !subjectsLoading &&
    !saving;

  const handleCreate = useCallback(async () => {
    const trimmedTitle = title.trim();
    const trimmedNote = note.trim();

    if (!trimmedTitle) {
      Alert.alert('Create Classwork', 'Please enter a title.');
      return;
    }

    if (selectedClassId === null) {
      Alert.alert('Create Classwork', 'Please select a class.');
      return;
    }

    if (selectedSubjectIds.length === 0) {
      Alert.alert('Create Classwork', 'Please select at least one subject.');
      return;
    }

    if (saving) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: trimmedTitle,
        body: trimmedNote || null,
        class_group_id: Number(selectedClassId),
        course_ids: selectedSubjectIds,
      };

      console.log('Create classwork payload:', payload);

      const response = await api('/api/classworks', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response?.ok !== true || !response?.id) {
        throw new Error('Could not create the classwork.');
      }

      const createdId = Number(response.id);

      /*
       * Reload the list so we get the
       * server-generated created_at,
       * class name and section.
       */
      let createdClasswork = null;

      try {
        const classworksResponse = await api('/api/classworks');

        const classworkItems = Array.isArray(classworksResponse?.items)
          ? classworksResponse.items
          : [];

        createdClasswork =
          classworkItems.find(item => Number(item?.id) === createdId) || null;
      } catch (refreshError) {
        console.log('Reload created classwork error:', refreshError);
      }

      /*
       * Fallback data if list reload fails.
       */
      const fallbackClasswork = {
        id: createdId,
        title: trimmedTitle,
        body: trimmedNote || null,

        class_group_id: Number(selectedClassId),

        class_name: selectedClass?.name || '',

        section: selectedClass?.section || '',

        created_at: null,
      };

      navigation.replace('AdminClassworkEdit', {
        id: createdId,

        classwork: createdClasswork || fallbackClasswork,
      });
    } catch (error) {
      console.log('Create classwork error:', error);

      Alert.alert(
        'Create Classwork',
        error?.message || 'Could not create the classwork.',
      );
    } finally {
      setSaving(false);
    }
  }, [title, note, selectedClassId, selectedClass, saving, navigation]);

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading classes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!!role && (
          <Text style={styles.roleText}>
            {role === 'teacher' ? 'Teacher' : role === 'admin' ? 'Admin' : role}
          </Text>
        )}

        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Title
            <Text style={styles.requiredMark}> *</Text>
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter classwork title"
            placeholderTextColor="#73869F"
            style={styles.input}
            maxLength={150}
          />
        </View>

        {/* Class */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Class
            <Text style={styles.requiredMark}> *</Text>
          </Text>

          <Pressable
            onPress={() => setClassModalVisible(true)}
            style={({ pressed }) => [
              styles.selectBox,

              pressed && styles.controlPressed,
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.selectText,

                !selectedClass && styles.selectPlaceholder,
              ]}
            >
              {selectedClass ? buildClassLabel(selectedClass) : 'Select class'}
            </Text>

            <MaterialCommunityIcons
              name="chevron-down"
              size={22}
              color="#B8C7D9"
            />
          </Pressable>
        </View>

        {/* Subjects - Multi Select */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Subjects
            <Text style={styles.requiredMark}> *</Text>
          </Text>

          <Pressable
            disabled={selectedClassId == null || subjectsLoading || saving}
            onPress={() => setSubjectModalVisible(true)}
            style={({ pressed }) => [
              styles.selectBox,
              (selectedClassId == null || subjectsLoading || saving) &&
                styles.buttonDisabled,
              pressed && styles.controlPressed,
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.selectText,
                selectedSubjectIds.length === 0 && styles.selectPlaceholder,
              ]}
            >
              {selectedClassId == null
                ? 'Select class first'
                : subjectsLoading
                ? 'Loading subjects...'
                : selectedSubjectIds.length > 0
                ? `${selectedSubjectIds.length} subjects selected`
                : 'Select subjects'}
            </Text>

            {subjectsLoading ? (
              <ActivityIndicator size="small" color="#67D1F0" />
            ) : (
              <MaterialCommunityIcons
                name="chevron-down"
                size={22}
                color="#B8C7D9"
              />
            )}
          </Pressable>

          {subjectsError && (
            <Text style={styles.subjectHint}>
              Unable to load subjects. Select the class again to retry.
            </Text>
          )}

          {/* Selected Subjects */}
          {selectedSubjects.length > 0 && (
            <View style={styles.selectedSubjectsRow}>
              {selectedSubjects.map(item => (
                <Pressable
                  key={String(item.id)}
                  disabled={saving}
                  onPress={() => toggleSubject(item.id)}
                  style={styles.selectedSubjectChip}
                >
                  <Text style={styles.selectedSubjectText}>{item.label}</Text>

                  <MaterialCommunityIcons
                    name="close"
                    size={14}
                    color="#DCEBFF"
                  />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Note */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Note</Text>

          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Enter classwork note"
            placeholderTextColor="#73869F"
            multiline
            textAlignVertical="top"
            style={[styles.input, styles.noteInput]}
            maxLength={3000}
          />
        </View>

        <View style={styles.divider} />

        {/* Attachments */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons
              name="paperclip"
              size={19}
              color="#7DD3FC"
            />

            <Text style={styles.sectionTitle}>Attachments</Text>
          </View>

          <Text style={styles.sectionSubtitle}>
            Download and manage shared files
          </Text>

          <View style={styles.lockedInfo}>
            <MaterialCommunityIcons
              name="information-outline"
              size={18}
              color="#93C5FD"
            />

            <Text style={styles.lockedInfoText}>
              Save the classwork before adding attachments.
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Messages */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons
              name="message-outline"
              size={19}
              color="#7DD3FC"
            />

            <Text style={styles.sectionTitle}>Messages</Text>
          </View>

          <Text style={styles.sectionSubtitle}>
            Updates from teachers and administrators
          </Text>

          <View style={styles.lockedInfo}>
            <MaterialCommunityIcons
              name="information-outline"
              size={18}
              color="#93C5FD"
            />

            <Text style={styles.lockedInfoText}>
              Save the classwork before adding messages.
            </Text>
          </View>
        </View>

        <View style={styles.bottomActions}>
          <Pressable
            disabled={saving}
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.cancelButton,

              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

          <Pressable
            disabled={!canCreate}
            onPress={handleCreate}
            style={({ pressed }) => [
              styles.createButton,

              !canCreate && styles.buttonDisabled,

              pressed && canCreate && styles.controlPressed,
            ]}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>Create</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {/* Class selection modal */}
      <Modal
        visible={classModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setClassModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setClassModalVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select Class</Text>

                <Text style={styles.modalSubtitle}>
                  Choose the class for this classwork.
                </Text>
              </View>

              <Pressable
                onPress={() => setClassModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ScrollView style={styles.classList} showsVerticalScrollIndicator>
              {classes.map(item => {
                const selected = Number(selectedClassId) === Number(item?.id);

                return (
                  <Pressable
                    key={String(item.id)}
                    onPress={() => {
                      setSelectedClassId(item.id);

                      setClassModalVisible(false);
                    }}
                    style={({ pressed }) => [
                      styles.classOption,

                      selected && styles.classOptionSelected,

                      pressed && styles.controlPressed,
                    ]}
                  >
                    <View style={styles.classOptionTextSection}>
                      <Text style={styles.classOptionTitle}>
                        {item?.name || 'Class'}
                        {item?.section ? ` (${item.section})` : ''}
                      </Text>

                      {!!item?.academic_year?.label && (
                        <Text style={styles.classOptionSubtitle}>
                          {item.academic_year.label}
                        </Text>
                      )}
                    </View>

                    {selected ? (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={21}
                        color="#67D1F0"
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="circle-outline"
                        size={21}
                        color="#60758F"
                      />
                    )}
                  </Pressable>
                );
              })}

              {classes.length === 0 ? (
                <View style={styles.emptyClasses}>
                  <Text style={styles.emptyClassesText}>
                    No classes available.
                  </Text>
                </View>
              ) : null}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Subjects Multi-Select Modal */}
      <Modal
        visible={subjectModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSubjectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Select Subjects</Text>

                <Text style={styles.modalSubtitle}>
                  Select one or more subjects.
                </Text>
              </View>

              <Pressable
                onPress={() => setSubjectModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <View style={styles.subjectSelectionHeader}>
              <Text style={styles.subjectCount}>
                {selectedSubjectIds.length} selected
              </Text>

              <Pressable
                onPress={() => {
                  if (selectedSubjectIds.length === subjects.length) {
                    setSelectedSubjectIds([]);
                  } else {
                    setSelectedSubjectIds(
                      subjects.map(item => Number(item.id)),
                    );
                  }
                }}
              >
                <Text style={styles.selectAllSubjects}>
                  {selectedSubjectIds.length === subjects.length &&
                  subjects.length > 0
                    ? 'Deselect All'
                    : 'Select All'}
                </Text>
              </Pressable>
            </View>

            <ScrollView style={styles.classList} showsVerticalScrollIndicator>
              {subjects.map(item => {
                const selected = selectedSubjectIds.includes(Number(item.id));

                return (
                  <Pressable
                    key={String(item.id)}
                    onPress={() => toggleSubject(item.id)}
                    style={[
                      styles.classOption,
                      selected && styles.classOptionSelected,
                    ]}
                  >
                    <Text style={styles.subjectOptionText}>{item.label}</Text>

                    <MaterialCommunityIcons
                      name={
                        selected ? 'checkbox-marked' : 'checkbox-blank-outline'
                      }
                      size={22}
                      color={selected ? '#60A5FA' : '#8294AA'}
                    />
                  </Pressable>
                );
              })}

              {subjects.length === 0 && (
                <View style={styles.emptyClasses}>
                  <Text style={styles.emptyClassesText}>
                    No subjects available for this class.
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.subjectModalFooter}>
              <Pressable
                onPress={() => setSubjectModalVisible(false)}
                style={styles.subjectDoneButton}
              >
                <Text style={styles.subjectDoneText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
