import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { COLORS, styles } from './TutorialAttendanceSheetsSettings.styles';

const MODE_ROUTINE_SLOTS = 'routine_slots';

const MODE_CLASS_ON_DEMAND = 'class_on_demand';

function getErrorMessage(error, fallback) {
  return (
    error?.payload?.message ||
    error?.payload?.error ||
    error?.message ||
    fallback
  );
}

function RadioOption({ selected, title, description, onPress, disabled }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.radioOption,

        selected && styles.radioOptionSelected,

        pressed && !disabled && styles.buttonPressed,

        disabled && styles.buttonDisabled,
      ]}
    >
      <View
        style={[styles.radioCircle, selected && styles.radioCircleSelected]}
      >
        {selected ? <View style={styles.radioDot} /> : null}
      </View>

      <View style={styles.radioTextContainer}>
        <Text style={styles.radioTitle}>{title}</Text>

        <Text style={styles.radioDescription}>{description}</Text>
      </View>
    </Pressable>
  );
}

export default function TutorialAttendanceSheetsSettings() {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [available, setAvailable] = useState(true);

  const [mode, setMode] = useState(MODE_ROUTINE_SLOTS);

  const [savedMode, setSavedMode] = useState(MODE_ROUTINE_SLOTS);

  const [saving, setSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const response = await api(
        '/api/settings/v1/tutorial-attendance-session',
        {
          method: 'GET',
        },
      );

      const isAvailable = response?.available !== false;

      const apiMode =
        response?.mode === MODE_CLASS_ON_DEMAND
          ? MODE_CLASS_ON_DEMAND
          : MODE_ROUTINE_SLOTS;

      setAvailable(isAvailable);

      setMode(apiMode);

      setSavedMode(apiMode);
    } catch (error) {
      console.log('Tutorial attendance session load error:', error);

      setLoadError(
        getErrorMessage(error, 'Could not load tutorial attendance settings.'),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const hasChanges = useMemo(() => {
    return mode !== savedMode;
  }, [mode, savedMode]);

  async function handleSave() {
    if (saving || !hasChanges || !available) {
      return;
    }

    const payload = {
      mode,
    };

    try {
      setSaving(true);

      const response = await api(
        '/api/settings/v1/tutorial-attendance-session',
        {
          method: 'PUT',

          body: JSON.stringify(payload),
        },
      );

      if (!response?.ok) {
        throw new Error(
          'The server did not confirm the attendance workflow update.',
        );
      }

      const updatedMode =
        response?.mode === MODE_CLASS_ON_DEMAND
          ? MODE_CLASS_ON_DEMAND
          : MODE_ROUTINE_SLOTS;

      setMode(updatedMode);

      setSavedMode(updatedMode);

      Alert.alert(
        'Attendance Workflow Updated',
        'Tutorial attendance-sheet workflow has been saved successfully.',
      );
    } catch (error) {
      console.log('Tutorial attendance session save error:', error);

      Alert.alert(
        'Could not save attendance workflow',
        getErrorMessage(
          error,
          'Tutorial attendance settings could not be saved.',
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />

          <Text style={styles.stateText}>
            Loading tutorial attendance settings...
          </Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tutorial Attendance Sheets</Text>

        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>
            Could not load attendance workflow
          </Text>

          <Text style={styles.errorDescription}>{loadError}</Text>

          <Pressable
            onPress={loadSettings}
            style={({ pressed }) => [
              styles.primaryButton,

              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!available) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tutorial Attendance Sheets</Text>

        <Text style={styles.description}>
          Choose whether lecture attendance follows the weekly tutorial routine
          or is created as a one-off class session.
        </Text>

        <View style={styles.unavailableBox}>
          <Text style={styles.unavailableTitle}>
            Tutorial attendance workflow unavailable
          </Text>

          <Text style={styles.unavailableText}>
            This setting is not currently available for the selected institution
            configuration.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tutorial Attendance Sheets</Text>

      <Text style={styles.description}>
        Choose whether lecture attendance follows the weekly tutorial routine or
        is created as a one-off class session.
      </Text>

      <View style={styles.optionsContainer}>
        <RadioOption
          selected={mode === MODE_ROUTINE_SLOTS}
          disabled={saving}
          onPress={() => setMode(MODE_ROUTINE_SLOTS)}
          title="Use weekly routine slots"
          description="Require the selected class and subject to use a slot configured in Tutorial Routines. This remains the default."
        />

        <RadioOption
          selected={mode === MODE_CLASS_ON_DEMAND}
          disabled={saving}
          onPress={() => setMode(MODE_CLASS_ON_DEMAND)}
          title="Create a one-off sheet from the selected class"
          description="Let staff choose a class, subject, and date in New Attendance Sheet without a routine slot. It never creates or changes a routine slot."
        />
      </View>

      <View style={styles.currentModeBox}>
        <View style={styles.currentModeIcon}>
          <Text style={styles.currentModeIconText}>✓</Text>
        </View>

        <View style={styles.currentModeText}>
          <Text style={styles.currentModeTitle}>
            {mode === MODE_ROUTINE_SLOTS
              ? 'Weekly routine slots'
              : 'One-off class sheets'}
          </Text>

          <Text style={styles.currentModeDescription}>
            {mode === MODE_ROUTINE_SLOTS
              ? 'Attendance sheets must follow a configured Tutorial Routine slot.'
              : 'Staff can create attendance sheets directly by selecting the class, subject and date.'}
          </Text>
        </View>
      </View>

      <View style={[styles.actions, isMobile && styles.actionsMobile]}>
        <Pressable
          onPress={handleSave}
          disabled={saving || !hasChanges}
          style={({ pressed }) => [
            styles.primaryButton,

            isMobile && styles.mobileButton,

            (saving || !hasChanges) && styles.buttonDisabled,

            pressed && !saving && hasChanges && styles.buttonPressed,
          ]}
        >
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.TEXT} />
          ) : (
            <Text style={styles.primaryButtonText}>
              Save Attendance-sheet Workflow
            </Text>
          )}
        </Pressable>

        {hasChanges ? (
          <Pressable
            disabled={saving}
            onPress={() => setMode(savedMode)}
            style={({ pressed }) => [
              styles.secondaryButton,

              isMobile && styles.mobileButton,

              pressed && !saving && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Reset Changes</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
