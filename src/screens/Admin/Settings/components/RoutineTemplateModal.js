import React, { useEffect, useMemo, useState } from 'react';

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

import { api } from '../../../../api/client';

import { COLORS, styles } from './RoutineTemplateModal.styles';

const WEEK_DAYS = [
  {
    id: 1,
    label: 'Monday',
  },
  {
    id: 2,
    label: 'Tuesday',
  },
  {
    id: 3,
    label: 'Wednesday',
  },
  {
    id: 4,
    label: 'Thursday',
  },
  {
    id: 5,
    label: 'Friday',
  },
  {
    id: 6,
    label: 'Saturday',
  },
  {
    id: 7,
    label: 'Sunday',
  },
];

function normalizeDayTemplates(response) {
  if (!Array.isArray(response)) {
    return [];
  }

  return response
    .map(item => ({
      id: Number(item?.id),

      name: String(item?.name || `Template ${item?.id}`),
    }))
    .filter(item => Number.isFinite(item.id));
}

function DayTemplateSelect({
  value,
  options,
  allowBlank = true,
  disabled = false,
  open,
  onToggle,
  onSelect,
}) {
  const selectedOption =
    options.find(item => Number(item.id) === Number(value)) || null;

  return (
    <View style={[styles.selectWrapper, open && styles.selectWrapperOpen]}>
      <Pressable
        onPress={() => {
          if (!disabled) {
            onToggle?.();
          }
        }}
        disabled={disabled}
        style={({ pressed }) => [
          styles.selectButton,

          pressed && !disabled && styles.buttonPressed,

          disabled && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.selectValue} numberOfLines={1}>
          {selectedOption?.name || '—'}
        </Text>

        <Text style={styles.selectArrow}>▾</Text>
      </Pressable>

      {open ? (
        <View style={styles.selectMenu}>
          <ScrollView
            style={styles.selectMenuScroll}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {allowBlank ? (
              <Pressable
                onPress={() => onSelect?.(null)}
                style={({ pressed }) => [
                  styles.selectOption,

                  value === null && styles.selectOptionSelected,

                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.selectOptionText}>—</Text>

                {value === null ? (
                  <Text style={styles.checkMark}>✓</Text>
                ) : null}
              </Pressable>
            ) : null}

            {options.map(option => {
              const selected = Number(value) === Number(option.id);

              return (
                <Pressable
                  key={option.id}
                  onPress={() => onSelect?.(option.id)}
                  style={({ pressed }) => [
                    styles.selectOption,

                    selected && styles.selectOptionSelected,

                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.selectOptionText} numberOfLines={1}>
                    {option.name}
                  </Text>

                  {selected ? <Text style={styles.checkMark}>✓</Text> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

export default function RoutineTemplateModal({
  visible,
  mode = 'add',
  routine = null,
  saving = false,
  onClose,
  onSave,
}) {
  const isEdit = mode === 'edit';
  const [name, setName] = useState('');

  const [description, setDescription] = useState('');

  const [active, setActive] = useState(true);

  const [dayTemplates, setDayTemplates] = useState([]);

  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const [templateLoadError, setTemplateLoadError] = useState('');

  const [masterTemplateId, setMasterTemplateId] = useState(null);

  const [selectedDays, setSelectedDays] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
  });

  /*
   * Example values:
   * master
   * day_1
   * day_2
   */
  const [openSelectKey, setOpenSelectKey] = useState(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setOpenSelectKey(null);

    if (isEdit && routine) {
      setName(String(routine?.name || ''));

      setDescription(String(routine?.description || ''));

      setActive(
        Boolean(Number(routine?.active) === 1 || routine?.active === true),
      );

      const populatedDays = {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
      };

      const routineDays = Array.isArray(routine?.days) ? routine.days : [];

      routineDays.forEach(day => {
        const dayOfWeek = Number(day?.day_of_week);

        const templateId = Number(day?.day_template_id);

        if (dayOfWeek >= 1 && dayOfWeek <= 7 && Number.isFinite(templateId)) {
          populatedDays[dayOfWeek] = templateId;
        }
      });

      setSelectedDays(populatedDays);

      /*
       * Use the first assigned day template
       * as the quick-assign selection.
       */
      const firstAssigned = routineDays.find(day =>
        Number.isFinite(Number(day?.day_template_id)),
      );

      const preferredMasterId = firstAssigned
        ? Number(firstAssigned.day_template_id)
        : null;

      setMasterTemplateId(preferredMasterId);

      loadDayTemplates(preferredMasterId);

      return;
    }

    // New routine defaults
    setName('');
    setDescription('');
    setActive(true);

    setSelectedDays({
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
      7: null,
    });

    setMasterTemplateId(null);

    loadDayTemplates(null);
  }, [visible, isEdit, routine]);

  async function loadDayTemplates(preferredMasterId = null) {
    try {
      setLoadingTemplates(true);
      setTemplateLoadError('');

      const response = await api('/api/routines/v1/day-templates', {
        method: 'GET',
      });

      const templates = normalizeDayTemplates(response);

      setDayTemplates(templates);

      if (
        preferredMasterId &&
        templates.some(item => Number(item.id) === Number(preferredMasterId))
      ) {
        setMasterTemplateId(Number(preferredMasterId));
      } else if (templates.length > 0) {
        setMasterTemplateId(templates[0].id);
      } else {
        setMasterTemplateId(null);
      }
    } catch (error) {
      console.log('Routine modal day templates load error:', error);

      setTemplateLoadError(error?.message || 'Could not load day templates.');
    } finally {
      setLoadingTemplates(false);
    }
  }

  const cleanName = name.trim();

  const cleanDescription = description.trim();

  const hasAnyAssignedDay = useMemo(() => {
    return Object.values(selectedDays).some(value => value !== null);
  }, [selectedDays]);

  function updateDay(dayId, templateId) {
    setSelectedDays(previous => ({
      ...previous,

      [dayId]: templateId === null ? null : Number(templateId),
    }));

    setOpenSelectKey(null);
  }

  function applyMasterToDays(dayIds) {
    if (!masterTemplateId) {
      Alert.alert('Select Day Template', 'Please select a day template first.');

      return;
    }

    setSelectedDays(previous => {
      const next = {
        ...previous,
      };

      dayIds.forEach(dayId => {
        next[dayId] = Number(masterTemplateId);
      });

      return next;
    });
  }

  function handleSubmit() {
    if (!cleanName) {
      Alert.alert(
        'Routine Name Required',
        'Please enter a routine template name.',
      );

      return;
    }

    if (dayTemplates.length === 0) {
      Alert.alert(
        'Day Templates Required',
        'No day templates are currently available.',
      );

      return;
    }

    /*
     * All seven keys are always included.
     * Blank weekdays are explicitly sent as null.
     */
    const days = {
      1: selectedDays[1] ?? null,

      2: selectedDays[2] ?? null,

      3: selectedDays[3] ?? null,

      4: selectedDays[4] ?? null,

      5: selectedDays[5] ?? null,

      6: selectedDays[6] ?? null,

      7: selectedDays[7] ?? null,
    };

    onSave?.(
      {
        name: cleanName,

        description: cleanDescription || null,

        active: Boolean(active),

        days,
      },

      dayTemplates,
    );
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
            <Text style={styles.title}>
              {isEdit ? 'Edit Routine Template' : 'New Routine Template'}
            </Text>

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
            style={styles.contentScroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={false}
          >
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Routine Template Name (required)</Text>

              <TextInput
                value={name}
                onChangeText={setName}
                editable={!saving}
                placeholder="e.g., Daily Classes"
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
                multiline
                textAlignVertical="top"
                placeholder="Optional notes"
                placeholderTextColor={COLORS.MUTED}
                style={[styles.textInput, styles.descriptionInput]}
              />
            </View>

            <View style={styles.activeRow}>
              <View>
                <Text style={styles.label}>Active</Text>

                <Text style={styles.activeDescription}>
                  Enable this routine template.
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  if (!saving) {
                    setActive(previous => !previous);
                  }
                }}
                disabled={saving}
                style={({ pressed }) => [
                  styles.checkbox,

                  active && styles.checkboxActive,

                  pressed && !saving && styles.buttonPressed,
                ]}
              >
                {active ? <Text style={styles.checkboxTick}>✓</Text> : null}
              </Pressable>
            </View>

            <View style={styles.mappingSection}>
              <Text style={styles.mappingTitle}>Weekday → Day Template</Text>

              {loadingTemplates ? (
                <View style={styles.templatesLoading}>
                  <ActivityIndicator size="small" color={COLORS.BLUE} />

                  <Text style={styles.loadingText}>
                    Loading day templates...
                  </Text>
                </View>
              ) : templateLoadError ? (
                <View style={styles.templateError}>
                  <Text style={styles.templateErrorText}>
                    {templateLoadError}
                  </Text>

                  <Pressable
                    onPress={loadDayTemplates}
                    style={({ pressed }) => [
                      styles.retryButton,

                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  {/* Master Template */}

                  <View style={styles.masterSelectContainer}>
                    <Text style={styles.smallLabel}>Template to apply</Text>

                    <DayTemplateSelect
                      value={masterTemplateId}
                      options={dayTemplates}
                      allowBlank={false}
                      disabled={saving}
                      open={openSelectKey === 'master'}
                      onToggle={() =>
                        setOpenSelectKey(previous =>
                          previous === 'master' ? null : 'master',
                        )
                      }
                      onSelect={value => {
                        setMasterTemplateId(value);

                        setOpenSelectKey(null);
                      }}
                    />
                  </View>

                  {/* Quick Assign */}

                  <View style={styles.quickActions}>
                    <Pressable
                      onPress={() => applyMasterToDays([1, 2, 3, 4, 5])}
                      disabled={saving}
                      style={({ pressed }) => [
                        styles.quickButton,

                        pressed && !saving && styles.buttonPressed,

                        saving && styles.buttonDisabled,
                      ]}
                    >
                      <Text style={styles.quickButtonText}>Set Mon–Fri</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => applyMasterToDays([6])}
                      disabled={saving}
                      style={({ pressed }) => [
                        styles.quickButton,

                        pressed && !saving && styles.buttonPressed,

                        saving && styles.buttonDisabled,
                      ]}
                    >
                      <Text style={styles.quickButtonText}>Set Sat</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => applyMasterToDays([7])}
                      disabled={saving}
                      style={({ pressed }) => [
                        styles.quickButton,

                        pressed && !saving && styles.buttonPressed,

                        saving && styles.buttonDisabled,
                      ]}
                    >
                      <Text style={styles.quickButtonText}>Set Sun</Text>
                    </Pressable>
                  </View>

                  {/* Individual Days */}

                  <View style={styles.daysGrid}>
                    {WEEK_DAYS.map(weekDay => {
                      const selectKey = `day_${weekDay.id}`;

                      return (
                        <View
                          key={weekDay.id}
                          style={[
                            styles.dayField,

                            openSelectKey === selectKey && styles.dayFieldOpen,
                          ]}
                        >
                          <Text style={styles.dayLabel}>{weekDay.label}</Text>

                          <DayTemplateSelect
                            value={selectedDays[weekDay.id]}
                            options={dayTemplates}
                            allowBlank
                            disabled={saving}
                            open={openSelectKey === selectKey}
                            onToggle={() =>
                              setOpenSelectKey(previous =>
                                previous === selectKey ? null : selectKey,
                              )
                            }
                            onSelect={value => updateDay(weekDay.id, value)}
                          />
                        </View>
                      );
                    })}
                  </View>

                  <Text style={styles.blankHint}>
                    Leave a day blank for “no classes”.
                  </Text>

                  {!hasAnyAssignedDay ? (
                    <Text style={styles.noDayWarning}>
                      No weekdays are currently assigned.
                    </Text>
                  ) : null}
                </>
              )}
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
                onPress={handleSubmit}
                disabled={
                  saving ||
                  loadingTemplates ||
                  !cleanName ||
                  dayTemplates.length === 0
                }
                style={({ pressed }) => [
                  styles.saveButton,

                  pressed && !saving && cleanName && styles.buttonPressed,

                  (saving ||
                    loadingTemplates ||
                    !cleanName ||
                    dayTemplates.length === 0) &&
                    styles.buttonDisabled,
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
