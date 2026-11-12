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

import { COLORS, styles } from './CreateClassworkModal.styles';

export default function CreateClassworkModal({
  visible,
  classGroups = [],
  saving = false,
  onClose,
  onCreate,
}) {
  const [title, setTitle] = useState('');

  const [body, setBody] = useState('');

  const [selectedClassGroupId, setSelectedClassGroupId] = useState(null);

  const [classDropdownOpen, setClassDropdownOpen] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setTitle('');
    setBody('');

    setClassDropdownOpen(false);

    /*
     * Select the first class by default.
     */
    setSelectedClassGroupId(classGroups?.[0]?.id ?? null);
  }, [visible, classGroups]);

  const cleanTitle = title.trim();

  const cleanBody = body.trim();

  const selectedClass = useMemo(() => {
    return classGroups.find(
      item => String(item?.id) === String(selectedClassGroupId),
    );
  }, [classGroups, selectedClassGroupId]);

  const createDisabled = saving || !cleanTitle || !selectedClassGroupId;

  function handleCreate() {
    if (createDisabled) {
      return;
    }

    onCreate?.({
      title: cleanTitle,

      class_group_id: Number(selectedClassGroupId),

      body: cleanBody || null,
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
            <Text style={styles.title}>Create Classwork</Text>

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
            removeClippedSubviews={false}
          >
            {/* Title */}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Title</Text>

              <TextInput
                value={title}
                onChangeText={setTitle}
                editable={!saving}
                placeholder="Enter classwork title"
                placeholderTextColor={COLORS.MUTED}
                style={styles.textInput}
              />
            </View>

            {/* Class */}

            <View style={[styles.fieldGroup, styles.classFieldGroup]}>
              <Text style={styles.label}>Class</Text>

              <View
                style={[
                  styles.selectWrapper,

                  classDropdownOpen && styles.selectWrapperOpen,
                ]}
              >
                <Pressable
                  onPress={() => {
                    if (!saving) {
                      setClassDropdownOpen(previous => !previous);
                    }
                  }}
                  disabled={saving}
                  style={({ pressed }) => [
                    styles.selectButton,

                    pressed && !saving && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.selectValue} numberOfLines={1}>
                    {selectedClass?.label || 'Select a class'}
                  </Text>

                  <Text style={styles.selectArrow}>▾</Text>
                </Pressable>

                {classDropdownOpen ? (
                  <View style={styles.selectMenu}>
                    <ScrollView
                      style={styles.selectMenuScroll}
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                    >
                      {classGroups.map(item => {
                        const selected =
                          String(item?.id) === String(selectedClassGroupId);

                        return (
                          <Pressable
                            key={item.id}
                            onPress={() => {
                              setSelectedClassGroupId(item.id);

                              setClassDropdownOpen(false);
                            }}
                            style={({ pressed }) => [
                              styles.selectOption,

                              selected && styles.selectOptionSelected,

                              pressed && styles.buttonPressed,
                            ]}
                          >
                            <Text
                              style={styles.selectOptionText}
                              numberOfLines={1}
                            >
                              {item.label}
                            </Text>

                            {selected ? (
                              <Text style={styles.checkMark}>✓</Text>
                            ) : null}
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>
                ) : null}
              </View>

              {classGroups.length === 0 ? (
                <Text style={styles.noClassesText}>
                  No classes are currently available.
                </Text>
              ) : null}
            </View>

            {/* Note */}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Note (optional)</Text>

              <TextInput
                value={body}
                onChangeText={setBody}
                editable={!saving}
                placeholder="Optional classwork note"
                placeholderTextColor={COLORS.MUTED}
                multiline
                textAlignVertical="top"
                style={[styles.textInput, styles.noteInput]}
              />
            </View>

            {/* Actions */}

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
                onPress={handleCreate}
                disabled={createDisabled}
                style={({ pressed }) => [
                  styles.createButton,

                  pressed && !createDisabled && styles.buttonPressed,

                  createDisabled && styles.buttonDisabled,
                ]}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT} />
                ) : (
                  <Text style={styles.createButtonText}>Create</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
