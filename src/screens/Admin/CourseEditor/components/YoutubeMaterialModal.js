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

import { styles, COLORS } from './YoutubeMaterialModal.styles';

function isValidYoutubeUrl(value) {
  try {
    const parsedUrl = new URL(value);

    const hostname = String(parsedUrl.hostname || '').toLowerCase();

    return (
      hostname === 'youtu.be' ||
      hostname === 'youtube.com' ||
      hostname.endsWith('.youtube.com')
    );
  } catch {
    return false;
  }
}

export default function YoutubeMaterialModal({
  visible,
  chapterId,
  material,
  onClose,
  onSaved,
}) {
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isEditMode = Boolean(material?.id);

  const actionLabel = useMemo(() => {
    return isEditMode ? 'Save' : 'Add';
  }, [isEditMode]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setTitle(isEditMode ? String(material?.title || '') : '');

    setYoutubeUrl(isEditMode ? String(material?.external_url || '') : '');

    setErrorMessage('');
    setSaving(false);
  }, [visible, isEditMode, material]);

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
    const cleanYoutubeUrl = youtubeUrl.trim();

    if (!cleanTitle) {
      setErrorMessage('Video title is required.');
      return;
    }

    if (!cleanYoutubeUrl) {
      setErrorMessage('YouTube URL is required.');
      return;
    }

    if (!isValidYoutubeUrl(cleanYoutubeUrl)) {
      setErrorMessage('Please enter a valid YouTube URL.');
      return;
    }

    if (!isEditMode && !chapterId) {
      setErrorMessage('Chapter ID was not provided.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');

      if (isEditMode) {
        const payload = {
          title: cleanTitle,
          external_url: cleanYoutubeUrl,
        };

        const response = await api(`/api/ott/materials/${material.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });

        const updatedMaterial = {
          ...material,
          ...(response && typeof response === 'object' ? response : {}),
          title: response?.title || cleanTitle,
          external_url: response?.external_url || cleanYoutubeUrl,
          type: 'youtube',
        };

        onSaved?.({
          mode: 'edit',
          material: updatedMaterial,
        });

        return;
      }

      const payload = {
        type: 'youtube',
        title: cleanTitle,
        url: cleanYoutubeUrl,
      };

      const response = await api(`/api/ott/chapters/${chapterId}/materials`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const createdFile = Array.isArray(response?.files)
        ? response.files[0]
        : null;

      if (!createdFile?.id) {
        throw new Error('The server did not return the created material ID.');
      }

      /*
       * The create endpoint returns file metadata instead of
       * the complete material object.
       */
      const createdMaterial = {
        id: createdFile.id,
        chapter_id: chapterId,
        title: createdFile.name || cleanTitle,
        type: 'youtube',
        description: null,
        disk: null,
        path: null,
        mime: 'text/html',
        size_bytes: null,
        duration_seconds: null,
        pages: null,
        html_content: null,
        external_url: createdFile.url || cleanYoutubeUrl,
        is_preview: false,
        position: 0,
      };

      onSaved?.({
        mode: 'create',
        material: createdMaterial,
      });
    } catch (error) {
      console.log('YouTube material save API error:', error);

      setErrorMessage(
        error?.message || 'The YouTube material could not be saved.',
      );
    } finally {
      setSaving(false);
    }
  }

  const submitDisabled = saving || !title.trim() || !youtubeUrl.trim();

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
              <Text style={styles.modalTitle}>
                {isEditMode ? 'Edit YouTube Video' : 'Add YouTube Video'}
              </Text>

              <Text style={styles.modalSubtitle}>
                {isEditMode
                  ? 'Update the video title and YouTube URL.'
                  : 'Add a YouTube video to this chapter.'}
              </Text>
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
                  placeholder="e.g., Intro video"
                  placeholderTextColor={COLORS.PLACEHOLDER}
                  returnKeyType="next"
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>YouTube URL</Text>

                <TextInput
                  value={youtubeUrl}
                  onChangeText={value => {
                    setYoutubeUrl(value);
                    clearError();
                  }}
                  editable={!saving}
                  placeholder="https://www.youtube.com/watch?v=..."
                  placeholderTextColor={COLORS.PLACEHOLDER}
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  style={styles.input}
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
                  <Text style={styles.submitButtonText}>{actionLabel}</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
