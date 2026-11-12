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

import { styles, COLORS } from './HtmlMaterialModal.styles';

export default function HtmlMaterialModal({
  visible,
  chapterId,
  material,
  onClose,
  onSaved,
}) {
  const [title, setTitle] = useState('');
  const [htmlContent, setHtmlContent] = useState('');

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

    setHtmlContent(isEditMode ? String(material?.html_content || '') : '');

    setErrorMessage('');
    setSaving(false);
  }, [visible, isEditMode, material]);

  function handleClose() {
    if (saving) {
      return;
    }

    onClose?.();
  }

  async function handleSubmit() {
    const cleanTitle = title.trim();
    const cleanHtmlContent = htmlContent.trim();

    if (!cleanTitle) {
      setErrorMessage('Material title is required.');
      return;
    }

    if (!cleanHtmlContent) {
      setErrorMessage('HTML content is required.');
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
          html_content: cleanHtmlContent,
        };

        const response = await api(`/api/ott/materials/${material.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });

        const updatedMaterial = {
          ...material,
          ...(response && typeof response === 'object' ? response : {}),
          title: response?.title || cleanTitle,
          html_content: response?.html_content || cleanHtmlContent,
          type: 'html',
        };

        onSaved?.({
          mode: 'edit',
          material: updatedMaterial,
        });

        return;
      }

      const payload = {
        type: 'html',
        title: cleanTitle,
        html_content: cleanHtmlContent,
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
       * the complete material object, so a local material object
       * is created from the submitted payload and response.
       */
      const createdMaterial = {
        id: createdFile.id,
        chapter_id: chapterId,
        title: createdFile.name || cleanTitle,
        type: 'html',
        description: null,
        disk: null,
        path: null,
        mime: 'text/html',
        size_bytes: createdFile.size ?? cleanHtmlContent.length,
        duration_seconds: null,
        pages: null,
        html_content: cleanHtmlContent,
        external_url: createdFile.url || null,
        is_preview: false,
        position: 0,
      };

      onSaved?.({
        mode: 'create',
        material: createdMaterial,
      });
    } catch (error) {
      console.log('HTML material save API error:', error);

      setErrorMessage(
        error?.message || 'The HTML material could not be saved.',
      );
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
                <Text style={styles.modalTitle}>
                  {isEditMode ? 'Edit HTML Material' : 'Add HTML Material'}
                </Text>

                <Text style={styles.modalSubtitle}>
                  {isEditMode
                    ? 'Update the title and HTML content.'
                    : 'Create a new HTML document for this chapter.'}
                </Text>
              </View>
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

                    if (errorMessage) {
                      setErrorMessage('');
                    }
                  }}
                  editable={!saving}
                  placeholder="e.g., Notes for Chapter 1"
                  placeholderTextColor={COLORS.PLACEHOLDER}
                  returnKeyType="next"
                  style={styles.titleInput}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>HTML</Text>

                <TextInput
                  value={htmlContent}
                  onChangeText={value => {
                    setHtmlContent(value);

                    if (errorMessage) {
                      setErrorMessage('');
                    }
                  }}
                  editable={!saving}
                  placeholder="<h2>Intro</h2>..."
                  placeholderTextColor={COLORS.PLACEHOLDER}
                  multiline
                  autoCapitalize="none"
                  autoCorrect={false}
                  textAlignVertical="top"
                  style={styles.htmlInput}
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
                disabled={saving || !title.trim() || !htmlContent.trim()}
                style={({ pressed }) => [
                  styles.submitButton,

                  pressed && !saving && styles.buttonPressed,

                  (saving || !title.trim() || !htmlContent.trim()) &&
                    styles.buttonDisabled,
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
