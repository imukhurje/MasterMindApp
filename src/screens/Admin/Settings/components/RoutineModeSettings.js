import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

import { api } from '../../../../api/client';

import { COLORS, styles } from './RoutineModeSettings.styles';

const OPTIONS = ['School', 'Tutorial'];

function getSettingValue(response, key) {
  const items = Array.isArray(response?.items) ? response.items : [];

  return items.find(item => item?.key === key)?.value;
}

function normalizeRoutineMode(value) {
  const rawValue = String(value || '').trim();

  return OPTIONS.includes(rawValue) ? rawValue : 'Tutorial';
}

export default function RoutineModeSettings({ onModeResolved }) {
  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [routineMode, setRoutineMode] = useState('Tutorial');

  const [savedRoutineMode, setSavedRoutineMode] = useState('Tutorial');

  const [saving, setSaving] = useState(false);

  /*
   * Notify the parent only with an
   * authoritative/saved routine mode.
   */
  const notifyParentMode = useCallback(
    value => {
      if (typeof onModeResolved !== 'function') {
        return;
      }

      onModeResolved(normalizeRoutineMode(value));
    },
    [onModeResolved],
  );

  const loadRoutineMode = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const response = await api('/api/settings/v1/declared', {
        method: 'GET',
      });

      const value = getSettingValue(response, 'routine_mode');

      const finalValue = normalizeRoutineMode(value);

      setRoutineMode(finalValue);

      setSavedRoutineMode(finalValue);

      /*
       * Inform GeneralSettings after
       * loading the saved backend mode.
       */
      notifyParentMode(finalValue);
    } catch (error) {
      console.log('Routine mode load error:', error);

      setLoadError(error?.message || 'Could not load routine mode.');
    } finally {
      setLoading(false);
    }
  }, [notifyParentMode]);

  useEffect(() => {
    loadRoutineMode();
  }, [loadRoutineMode]);

  const changed = useMemo(
    () => routineMode !== savedRoutineMode,
    [routineMode, savedRoutineMode],
  );

  async function handleSave() {
    if (saving || !changed || !OPTIONS.includes(routineMode)) {
      return;
    }

    try {
      setSaving(true);

      const response = await api('/api/settings/v1/item', {
        method: 'PUT',

        body: JSON.stringify({
          key: 'routine_mode',

          value: routineMode,
        }),
      });

      if (!response?.ok) {
        throw new Error('The server did not confirm the routine mode update.');
      }

      const finalValue = normalizeRoutineMode(response?.value ?? routineMode);

      setRoutineMode(finalValue);

      setSavedRoutineMode(finalValue);

      /*
       * Important:
       * Change the parent layout only
       * after the backend save succeeds.
       */
      notifyParentMode(finalValue);

      Alert.alert(
        'Routine Mode Updated',
        `Routine mode has been changed to ${finalValue}.`,
      );
    } catch (error) {
      console.log('Routine mode save error:', error);

      Alert.alert(
        'Could not save routine mode',
        error?.message || 'Routine mode could not be saved.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.section}>
        <ActivityIndicator size="small" color={COLORS.BLUE} />
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Routine Mode</Text>

        <Text style={styles.errorText}>{loadError}</Text>

        <Pressable onPress={loadRoutineMode} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Routine Mode</Text>

      <Text style={styles.description}>
        School uses Day Templates and Routine Templates. Tutorial uses simple
        weekly slots.
      </Text>

      <Text style={styles.label}>Mode</Text>

      <View style={styles.modeRow}>
        {OPTIONS.map(option => {
          const selected = routineMode === option;

          return (
            <Pressable
              key={option}
              onPress={() => {
                if (saving) {
                  return;
                }

                /*
                 * Local selection only.
                 * Do not notify parent yet.
                 */
                setRoutineMode(option);
              }}
              style={({ pressed }) => [
                styles.modeOption,

                selected && styles.modeOptionSelected,

                pressed && !saving && styles.buttonPressed,
              ]}
            >
              <View
                style={[styles.checkbox, selected && styles.checkboxChecked]}
              >
                {selected ? <Text style={styles.checkboxTick}>✓</Text> : null}
              </View>

              <Text
                style={[
                  styles.modeOptionText,

                  selected && styles.modeOptionTextSelected,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={handleSave}
          disabled={saving || !changed}
          style={({ pressed }) => [
            styles.saveButton,

            (saving || !changed) && styles.disabledButton,

            pressed && !saving && changed && styles.buttonPressed,
          ]}
        >
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.TEXT} />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
