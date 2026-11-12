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

import { COLORS, styles } from './ExaminationConfigSettings.styles';

const WORKFLOW_FULL = 'routine_slots';
const WORKFLOW_SIMPLE = 'simple_marks_entry';

function getErrorMessage(error, fallback) {
  return (
    error?.payload?.message ||
    error?.payload?.error ||
    error?.message ||
    fallback
  );
}

function normalizeWorkflow(response) {
  const value = response?.workflow ?? response?.mode ?? '';

  if (value === WORKFLOW_SIMPLE) {
    return WORKFLOW_SIMPLE;
  }

  return WORKFLOW_FULL;
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

export default function ExaminationConfigSettings() {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [available, setAvailable] = useState(true);

  const [workflow, setWorkflow] = useState(WORKFLOW_FULL);

  const [savedWorkflow, setSavedWorkflow] = useState(WORKFLOW_FULL);

  const [saving, setSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const response = await api(
        '/api/settings/v1/tutorial-examination-workflow',
        {
          method: 'GET',
        },
      );

      setAvailable(response?.available !== false);

      const currentWorkflow = normalizeWorkflow(response);

      setWorkflow(currentWorkflow);

      setSavedWorkflow(currentWorkflow);
    } catch (error) {
      console.log('Tutorial examination workflow load error:', error);

      setLoadError(
        getErrorMessage(error, 'Could not load examination workflow settings.'),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const hasChanges = useMemo(() => {
    return workflow !== savedWorkflow;
  }, [workflow, savedWorkflow]);

  async function handleSave() {
    if (saving || !hasChanges || !available) {
      return;
    }

    /*
     * Use the exact payload shapes
     * currently expected by the backend.
     */
    const payload =
      workflow === WORKFLOW_SIMPLE
        ? {
            workflow: WORKFLOW_SIMPLE,
          }
        : {
            mode: WORKFLOW_FULL,
          };

    try {
      setSaving(true);

      console.log('Tutorial examination workflow payload:', payload);

      const response = await api(
        '/api/settings/v1/tutorial-examination-workflow',
        {
          method: 'PUT',

          body: JSON.stringify(payload),
        },
      );

      if (!response?.ok) {
        throw new Error(
          'The server did not confirm the examination workflow update.',
        );
      }

      /*
       * Response can currently return
       * either workflow or mode.
       */
      const updatedWorkflow = normalizeWorkflow({
        workflow:
          response?.workflow ??
          (workflow === WORKFLOW_SIMPLE ? WORKFLOW_SIMPLE : undefined),

        mode:
          response?.mode ??
          (workflow === WORKFLOW_FULL ? WORKFLOW_FULL : undefined),
      });

      setWorkflow(updatedWorkflow);

      setSavedWorkflow(updatedWorkflow);

      Alert.alert(
        'Examination Workflow Updated',
        'Tutorial examination workflow has been saved successfully.',
      );
    } catch (error) {
      console.log('Tutorial examination workflow save error:', error);

      Alert.alert(
        'Could not save examination workflow',
        getErrorMessage(
          error,
          'Tutorial examination workflow could not be saved.',
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

          <Text style={styles.stateText}>Loading examination workflow...</Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Examination Config</Text>

        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>
            Could not load examination workflow
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
        <Text style={styles.sectionTitle}>Examination Config</Text>

        <Text style={styles.description}>
          Choose the examination workflow available to your Tutorial staff.
        </Text>

        <View style={styles.unavailableBox}>
          <Text style={styles.unavailableTitle}>
            Examination workflow unavailable
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
      <Text style={styles.sectionTitle}>Examination Config</Text>

      <Text style={styles.description}>
        Choose the examination workflow available to your Tutorial staff.
      </Text>

      <View style={styles.optionsContainer}>
        <RadioOption
          selected={workflow === WORKFLOW_FULL}
          disabled={saving}
          onPress={() => setWorkflow(WORKFLOW_FULL)}
          title="Use the full examination workflow"
          description="Create examination papers, schedules, and online or offline examinations using the existing process."
        />

        <RadioOption
          selected={workflow === WORKFLOW_SIMPLE}
          disabled={saving}
          onPress={() => setWorkflow(WORKFLOW_SIMPLE)}
          title="Record marks directly for a Tutorial examination"
          description="Record the held date, class, subjects, and marks in one spreadsheet-style screen. No exam papers, slots, or online examinations are required."
        />
      </View>

      <View style={styles.summaryBox}>
        <View style={styles.summaryIcon}>
          <Text style={styles.summaryIconText}>✓</Text>
        </View>

        <View style={styles.summaryTextContainer}>
          <Text style={styles.summaryTitle}>
            {workflow === WORKFLOW_FULL
              ? 'Full examination workflow'
              : 'Simple marks entry'}
          </Text>

          <Text style={styles.summaryDescription}>
            {workflow === WORKFLOW_FULL
              ? 'Tutorial staff will use the complete examination creation and evaluation process.'
              : 'Tutorial staff can directly record marks without creating examination papers or examination slots.'}
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
              Save Examination Workflow
            </Text>
          )}
        </Pressable>

        {hasChanges ? (
          <Pressable
            disabled={saving}
            onPress={() => setWorkflow(savedWorkflow)}
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
