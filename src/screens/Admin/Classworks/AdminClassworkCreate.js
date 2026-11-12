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

  const selectedClass = useMemo(() => {
    return classes.find(item => Number(item?.id) === Number(selectedClassId));
  }, [classes, selectedClassId]);

  const canCreate =
    title.trim().length > 0 && selectedClassId !== null && !saving;

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

    if (saving) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: trimmedTitle,
        body: trimmedNote || null,
        class_group_id: Number(selectedClassId),
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
    </View>
  );
}
