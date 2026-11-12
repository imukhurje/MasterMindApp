import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { COLORS, styles } from './DayTemplateModal.styles';

export default function DayTemplateModal({
  visible,
  mode = 'add',
  template = null,
  saving = false,
  onClose,
  onSave,
}) {
  const isEdit = mode === 'edit';

  const [name, setName] = useState('');

  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (isEdit && template) {
      setName(String(template?.name || ''));

      setDescription(String(template?.description || ''));

      return;
    }

    setName('');
    setDescription('');
  }, [visible, isEdit, template]);

  const cleanName = name.trim();

  const cleanDescription = description.trim();

  const originalName = String(template?.name || '').trim();

  const originalDescription = String(template?.description || '').trim();

  const hasChanges = useMemo(() => {
    if (!isEdit) {
      return Boolean(cleanName || cleanDescription);
    }

    return (
      cleanName !== originalName || cleanDescription !== originalDescription
    );
  }, [cleanName, cleanDescription, isEdit, originalName, originalDescription]);

  const saveDisabled = saving || !cleanName || (isEdit && !hasChanges);

  function handleSave() {
    if (saveDisabled) {
      return;
    }

    onSave?.({
      name: cleanName,

      description: cleanDescription || null,
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        if (!saving) {
          onClose?.();
        }
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>
                {isEdit ? 'Edit Day Template' : 'New Day Template'}
              </Text>

              {isEdit ? (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {template?.name || 'Day Template'}
                </Text>
              ) : null}
            </View>

            <Pressable
              onPress={onClose}
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
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Template Name (required)</Text>

              <TextInput
                value={name}
                onChangeText={setName}
                editable={!saving}
                placeholder="e.g., Regular Day"
                placeholderTextColor={COLORS.MUTED}
                style={styles.textInput}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Description</Text>

              <TextInput
                value={description}
                onChangeText={setDescription}
                editable={!saving}
                placeholder="Optional notes"
                placeholderTextColor={COLORS.MUTED}
                multiline
                textAlignVertical="top"
                style={[styles.textInput, styles.descriptionInput]}
              />
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={onClose}
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
                onPress={handleSave}
                disabled={saveDisabled}
                style={({ pressed }) => [
                  styles.saveButton,

                  pressed && !saveDisabled && styles.buttonPressed,

                  saveDisabled && styles.buttonDisabled,
                ]}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT} />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {isEdit ? 'Save Changes' : 'Save'}
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
