import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { COLORS, styles } from './AutoLogoutSettings.styles';

function getErrorMessage(error, fallback) {
  return (
    error?.payload?.message ||
    error?.payload?.error ||
    error?.message ||
    fallback
  );
}

export default function AutoLogoutSettings() {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [never, setNever] = useState(true);

  const [minutes, setMinutes] = useState('');

  const [savedNever, setSavedNever] = useState(true);

  const [savedMinutes, setSavedMinutes] = useState('');

  const [minMinutes, setMinMinutes] = useState(1);

  const [maxMinutes, setMaxMinutes] = useState(10080);

  const [saving, setSaving] = useState(false);

  const loadPolicy = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const response = await api('/api/auth/auto-logout-policy', {
        method: 'GET',
      });

      const apiNever = Boolean(response?.never);

      const apiMinutes =
        response?.minutes === null || response?.minutes === undefined
          ? ''
          : String(response.minutes);

      const apiMin = Number(response?.min_minutes);

      const apiMax = Number(response?.max_minutes);

      setNever(apiNever);

      setSavedNever(apiNever);

      setMinutes(apiMinutes);

      setSavedMinutes(apiMinutes);

      if (Number.isFinite(apiMin)) {
        setMinMinutes(apiMin);
      }

      if (Number.isFinite(apiMax)) {
        setMaxMinutes(apiMax);
      }
    } catch (error) {
      console.log('Auto logout policy load error:', error);

      setLoadError(
        getErrorMessage(error, 'Could not load auto-logout settings.'),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPolicy();
  }, [loadPolicy]);

  const hasChanges = useMemo(() => {
    if (never !== savedNever) {
      return true;
    }

    if (never) {
      return false;
    }

    return String(minutes).trim() !== String(savedMinutes).trim();
  }, [never, savedNever, minutes, savedMinutes]);

  function handleMinutesChange(value) {
    const cleaned = String(value || '').replace(/[^0-9]/g, '');

    setMinutes(cleaned);

    if (cleaned) {
      setNever(false);
    }
  }

  function chooseNever() {
    if (saving) {
      return;
    }

    setNever(true);
  }

  function chooseTimeout() {
    if (saving) {
      return;
    }

    setNever(false);

    if (!minutes) {
      const fallback = savedMinutes || String(Math.max(minMinutes, 30));

      setMinutes(fallback);
    }
  }

  function validate() {
    if (never) {
      return true;
    }

    const numericMinutes = Number(minutes);

    if (!minutes || !Number.isInteger(numericMinutes)) {
      Alert.alert('Auto-logout', 'Please enter a valid number of minutes.');

      return false;
    }

    if (numericMinutes < minMinutes) {
      Alert.alert(
        'Auto-logout',
        `Minimum inactivity time is ${minMinutes} minute${
          minMinutes === 1 ? '' : 's'
        }.`,
      );

      return false;
    }

    if (numericMinutes > maxMinutes) {
      Alert.alert(
        'Auto-logout',
        `Maximum inactivity time is ${maxMinutes} minutes.`,
      );

      return false;
    }

    return true;
  }

  async function handleSave() {
    if (saving || !hasChanges) {
      return;
    }

    if (!validate()) {
      return;
    }

    const payload = {
      minutes: never ? null : Number(minutes),
    };

    try {
      setSaving(true);

      console.log('Auto logout payload:', payload);

      const response = await api('/api/settings/v1/auto-logout', {
        method: 'PUT',

        body: JSON.stringify(payload),
      });

      if (!response?.ok) {
        throw new Error('The server did not confirm the auto-logout update.');
      }

      const updatedNever = Boolean(response?.never);

      const updatedMinutes =
        response?.minutes === null || response?.minutes === undefined
          ? ''
          : String(response.minutes);

      setNever(updatedNever);

      setSavedNever(updatedNever);

      setMinutes(updatedMinutes);

      setSavedMinutes(updatedMinutes);

      Alert.alert(
        'Auto-logout Updated',
        updatedNever
          ? 'Automatic logout has been disabled.'
          : `Users will now be logged out after ${updatedMinutes} minutes of inactivity.`,
      );
    } catch (error) {
      console.log('Auto logout save error:', error);

      Alert.alert(
        'Could not save auto-logout setting',
        getErrorMessage(error, 'The auto-logout setting could not be saved.'),
      );
    } finally {
      setSaving(false);
    }
  }

  function resetChanges() {
    if (saving) {
      return;
    }

    setNever(savedNever);

    setMinutes(savedMinutes);
  }

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />

          <Text style={styles.stateText}>Loading auto-logout policy...</Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Auto-logout</Text>

        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>
            Could not load auto-logout policy
          </Text>

          <Text style={styles.errorDescription}>{loadError}</Text>

          <Pressable
            onPress={loadPolicy}
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

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Auto-logout</Text>

      <Text style={styles.description}>
        Log users out after this many minutes without activity on the app. Leave
        the value empty for Never.
      </Text>

      <View style={styles.optionsContainer}>
        <Pressable
          disabled={saving}
          onPress={chooseNever}
          style={({ pressed }) => [
            styles.modeOption,

            never && styles.modeOptionSelected,

            pressed && !saving && styles.buttonPressed,
          ]}
        >
          <View
            style={[styles.radioCircle, never && styles.radioCircleSelected]}
          >
            {never ? <View style={styles.radioDot} /> : null}
          </View>

          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Never</Text>

            <Text style={styles.optionDescription}>
              Keep users signed in until they log out manually.
            </Text>
          </View>
        </Pressable>

        <Pressable
          disabled={saving}
          onPress={chooseTimeout}
          style={({ pressed }) => [
            styles.modeOption,

            !never && styles.modeOptionSelected,

            pressed && !saving && styles.buttonPressed,
          ]}
        >
          <View
            style={[styles.radioCircle, !never && styles.radioCircleSelected]}
          >
            {!never ? <View style={styles.radioDot} /> : null}
          </View>

          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Logout after inactivity</Text>

            <Text style={styles.optionDescription}>
              Automatically end the session after the configured inactivity
              period.
            </Text>
          </View>
        </Pressable>
      </View>

      {!never ? (
        <View style={styles.minutesCard}>
          <View style={styles.minutesHeader}>
            <View style={styles.minutesHeaderText}>
              <Text style={styles.fieldLabel}>Minutes of inactivity</Text>

              <Text style={styles.fieldHelper}>
                Allowed range: {minMinutes}
                {' – '}
                {maxMinutes}
                {' minutes'}
              </Text>
            </View>

            <View style={styles.minutesInputRow}>
              <TextInput
                value={minutes}
                onChangeText={handleMinutesChange}
                editable={!saving}
                keyboardType="number-pad"
                placeholder="e.g. 480"
                placeholderTextColor={COLORS.MUTED}
                style={styles.minutesInput}
              />

              <Text style={styles.minutesSuffix}>min</Text>
            </View>
          </View>
        </View>
      ) : null}

      <View style={styles.currentSettingBox}>
        <View style={styles.currentSettingIcon}>
          <Text style={styles.currentSettingIconText}>{never ? '∞' : '⏱'}</Text>
        </View>

        <View style={styles.currentSettingText}>
          <Text style={styles.currentSettingLabel}>Current selection</Text>

          <Text style={styles.currentSettingValue}>
            {never ? 'Never' : `${minutes || '—'} minutes`}
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
            <Text style={styles.primaryButtonText}>Save Auto-logout</Text>
          )}
        </Pressable>

        {hasChanges ? (
          <Pressable
            disabled={saving}
            onPress={resetChanges}
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
