import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { styles, COLORS } from './PdfMaterialModal.styles';

export default function PdfMaterialModal({
  visible,
  material,
  onClose,
  onSaved,
}) {
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    setTitle(String(material?.title || ''));
    setSaving(false);
    setErrorMessage('');
  }, [visible, material]);

  const submitDisabled = useMemo(() => {
    return saving || !title.trim();
  }, [saving, title]);

  function handleClose() {
    if (saving) {
      return;
    }

    onClose?.();
  }

  async function handleSubmit() {
    const cleanTitle = title.trim();

    if (!material?.id) {
      setErrorMessage('Material ID was not provided.');
      return;
    }

    if (!cleanTitle) {
      setErrorMessage('PDF title is required.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');

      const response = await api(`/api/ott/materials/${material.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: cleanTitle,
        }),
      });

      const updatedMaterial = {
        ...material,
        ...(response && typeof response === 'object' ? response : {}),
        title: response?.title || cleanTitle,
        type: 'pdf',

        // Preserve the current material position.
        position: material?.position,
      };

      onSaved?.({
        mode: 'edit',
        material: updatedMaterial,
      });
    } catch (error) {
      console.log('PDF material update API error:', error);

      setErrorMessage(error?.message || 'The PDF title could not be updated.');
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
              <Text style={styles.modalTitle}>Edit PDF</Text>

              <Text style={styles.modalSubtitle}>
                Update the display name of this PDF.
              </Text>
            </View>

            <View style={styles.formContent}>
              <Text style={styles.fieldLabel}>PDF title</Text>

              <TextInput
                value={title}
                onChangeText={value => {
                  setTitle(value);

                  if (errorMessage) {
                    setErrorMessage('');
                  }
                }}
                editable={!saving}
                placeholder="Enter PDF title"
                placeholderTextColor={COLORS.PLACEHOLDER}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                style={styles.input}
              />

              <Text style={styles.helperText}>
                The uploaded PDF file will not be replaced. Only its title will
                change.
              </Text>

              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}
            </View>

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
                  <Text style={styles.submitButtonText}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
