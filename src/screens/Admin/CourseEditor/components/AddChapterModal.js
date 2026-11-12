import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { styles, COLORS } from './AddChapterModal.styles';

export default function AddChapterModal({
  visible,
  courseId,
  onClose,
  onCreated,
}) {
  const [title, setTitle] = useState('');

  const [description, setDescription] = useState('');

  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    setTitle('');

    setDescription('');

    setSaving(false);

    setErrorMessage('');
  }, [visible]);

  const submitDisabled = useMemo(() => {
    return saving || !title.trim();
  }, [saving, title]);

  function clearError() {
    if (errorMessage) {
      setErrorMessage('');
    }
  }

  function handleClose() {
    if (saving) {
      return;
    }

    onClose?.();
  }

  async function handleSubmit() {
    const cleanTitle = title.trim();

    const cleanDescription = description.trim();

    if (!courseId) {
      setErrorMessage('Course ID was not provided.');

      return;
    }

    if (!cleanTitle) {
      setErrorMessage('Chapter title is required.');

      return;
    }

    try {
      setSaving(true);

      setErrorMessage('');

      const response = await api(`/api/ott/ottcourses/${courseId}/chapters`, {
        method: 'POST',

        body: JSON.stringify({
          title: cleanTitle,

          description: cleanDescription || null,

          /*
           * Every newly created
           * chapter starts Active.
           */
          is_active: true,
        }),
      });

      if (!response?.id) {
        throw new Error('The server did not return the created chapter.');
      }

      const createdChapter = {
        ...response,

        title: response?.title || cleanTitle,

        description: response?.description ?? cleanDescription ?? null,

        /*
         * Respect backend response.
         * Fall back to Active when
         * is_active is omitted.
         */
        is_active: response?.is_active ?? 1,

        materials: Array.isArray(response?.materials) ? response.materials : [],
      };

      onCreated?.(createdChapter);
    } catch (error) {
      console.log('Chapter create API error:', error);

      setErrorMessage(error?.message || 'The chapter could not be created.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.modalTitle}>Add Chapter</Text>

                <Text style={styles.modalSubtitle}>
                  Add a new chapter to this course. New chapters are active by
                  default.
                </Text>
              </View>

              <Pressable
                onPress={handleClose}
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

            <ScrollView
              style={styles.formScrollView}
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Title</Text>

                <TextInput
                  value={title}
                  onChangeText={value => {
                    setTitle(value);

                    clearError();
                  }}
                  editable={!saving}
                  placeholder="Enter chapter title"
                  placeholderTextColor={COLORS.PLACEHOLDER}
                  returnKeyType="next"
                  style={styles.titleInput}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Description (optional)</Text>

                <TextInput
                  value={description}
                  onChangeText={value => {
                    setDescription(value);

                    clearError();
                  }}
                  editable={!saving}
                  placeholder="Enter chapter description"
                  placeholderTextColor={COLORS.PLACEHOLDER}
                  multiline
                  textAlignVertical="top"
                  style={styles.descriptionInput}
                />
              </View>

              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                onPress={handleClose}
                disabled={saving}
                style={({ pressed }) => [
                  styles.cancelButton,

                  pressed && !saving && styles.buttonPressed,

                  saving && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                disabled={submitDisabled}
                style={({ pressed }) => [
                  styles.submitButton,

                  pressed && !submitDisabled && styles.buttonPressed,

                  submitDisabled && styles.buttonDisabled,
                ]}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT} />
                ) : (
                  <Text style={styles.submitButtonText}>Add</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
