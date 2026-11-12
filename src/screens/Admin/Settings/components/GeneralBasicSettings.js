import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { COLORS, styles } from './GeneralBasicSettings.styles';

const SETTINGS_URL = '/api/settings/v1/declared';

function getSettingValue(response, key) {
  const items = Array.isArray(response?.items) ? response.items : [];

  return items.find(item => item?.key === key)?.value;
}

function normalizeBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  const normalized = String(value ?? '').toLowerCase();

  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

export default function GeneralBasicSettings() {
  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  /*
   * School Name
   */
  const [schoolName, setSchoolName] = useState('');

  const [savedSchoolName, setSavedSchoolName] = useState('');

  /*
   * School Address
   */
  const [schoolAddress, setSchoolAddress] = useState('');

  const [savedSchoolAddress, setSavedSchoolAddress] = useState('');

  /*
   * Phone Number
   *
   * Keep this as a string so values
   * such as 09088530766 retain
   * their leading zero.
   */
  const [schoolPhone, setSchoolPhone] = useState('');

  const [savedSchoolPhone, setSavedSchoolPhone] = useState('');

  /*
   * Forum Permission
   */
  const [allowStudentsForums, setAllowStudentsForums] = useState(false);

  const [savedAllowStudentsForums, setSavedAllowStudentsForums] =
    useState(false);

  /*
   * Contains the setting key
   * currently being saved.
   */
  const [savingKey, setSavingKey] = useState(null);

  /*
   * Load Website General Settings
   */
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const response = await api(SETTINGS_URL, {
        method: 'GET',
      });

      const schoolNameValue = String(
        getSettingValue(response, '__SCHOOL_NAME__') || '',
      );

      const schoolAddressValue = String(
        getSettingValue(response, '__SCHOOL_ADDRESS__') || '',
      );

      const schoolPhoneValue = String(
        getSettingValue(response, 'school.phone') || '',
      );

      const forumsValue = normalizeBoolean(
        getSettingValue(response, 'forums.allow_students'),
      );

      setSchoolName(schoolNameValue);

      setSavedSchoolName(schoolNameValue);

      setSchoolAddress(schoolAddressValue);

      setSavedSchoolAddress(schoolAddressValue);

      setSchoolPhone(schoolPhoneValue);

      setSavedSchoolPhone(schoolPhoneValue);

      setAllowStudentsForums(forumsValue);

      setSavedAllowStudentsForums(forumsValue);
    } catch (error) {
      console.log('General basic settings load error:', error);

      setLoadError(error?.message || 'Could not load general settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  /*
   * Dirty checks
   */
  const schoolNameChanged = useMemo(
    () => schoolName.trim() !== savedSchoolName.trim(),
    [schoolName, savedSchoolName],
  );

  const schoolAddressChanged = useMemo(
    () => schoolAddress.trim() !== savedSchoolAddress.trim(),
    [schoolAddress, savedSchoolAddress],
  );

  const schoolPhoneChanged = useMemo(
    () => schoolPhone.trim() !== savedSchoolPhone.trim(),
    [schoolPhone, savedSchoolPhone],
  );

  const forumsChanged = allowStudentsForums !== savedAllowStudentsForums;

  /*
   * Generic setting save
   */
  async function saveSetting(key, value, successMessage) {
    if (savingKey !== null) {
      return null;
    }

    try {
      setSavingKey(key);

      const response = await api('/api/settings/v1/item', {
        method: 'PUT',

        body: JSON.stringify({
          key,
          value,
        }),
      });

      if (!response?.ok) {
        throw new Error('The server did not confirm the settings update.');
      }

      Alert.alert('Settings Updated', successMessage);

      return response;
    } catch (error) {
      console.log(`Setting save error (${key}):`, error);

      Alert.alert(
        'Could not save setting',
        error?.message || 'The setting could not be saved.',
      );

      return null;
    } finally {
      setSavingKey(null);
    }
  }

  /*
   * Save School Name
   */
  async function handleSaveSchoolName() {
    const value = schoolName.trim();

    if (!value) {
      Alert.alert('School Name Required', 'Please enter the school name.');

      return;
    }

    const response = await saveSetting(
      '__SCHOOL_NAME__',
      value,
      'School name has been saved successfully.',
    );

    if (!response) {
      return;
    }

    const finalValue = String(response?.value ?? value);

    setSchoolName(finalValue);

    setSavedSchoolName(finalValue);
  }

  /*
   * Save School Address
   */
  async function handleSaveSchoolAddress() {
    const value = schoolAddress.trim();

    if (!value) {
      Alert.alert(
        'School Address Required',
        'Please enter the school address.',
      );

      return;
    }

    const response = await saveSetting(
      '__SCHOOL_ADDRESS__',
      value,
      'School address has been saved successfully.',
    );

    if (!response) {
      return;
    }

    const finalValue = String(response?.value ?? value);

    setSchoolAddress(finalValue);

    setSavedSchoolAddress(finalValue);
  }

  /*
   * Save Phone Number
   */
  async function handleSaveSchoolPhone() {
    const value = schoolPhone.trim();

    if (!value) {
      Alert.alert(
        'Phone Number Required',
        'Please enter the school phone number.',
      );

      return;
    }

    const response = await saveSetting(
      'school.phone',
      value,
      'School phone number has been saved successfully.',
    );

    if (!response) {
      return;
    }

    const finalValue = String(response?.value ?? value);

    setSchoolPhone(finalValue);

    setSavedSchoolPhone(finalValue);
  }

  /*
   * Save Forum Permission
   */
  async function handleSaveForums() {
    const response = await saveSetting(
      'forums.allow_students',
      Boolean(allowStudentsForums),
      'Forum access setting has been saved successfully.',
    );

    if (!response) {
      return;
    }

    const finalValue = normalizeBoolean(response?.value ?? allowStudentsForums);

    setAllowStudentsForums(finalValue);

    setSavedAllowStudentsForums(finalValue);
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />

          <Text style={styles.stateText}>Loading general settings...</Text>
        </View>
      </View>
    );
  }

  /*
   * Error
   */
  if (loadError) {
    return (
      <View style={styles.section}>
        <View style={styles.stateContainer}>
          <Text style={styles.errorTitle}>Could not load general settings</Text>

          <Text style={styles.errorDescription}>{loadError}</Text>

          <Pressable
            onPress={loadSettings}
            style={({ pressed }) => [
              styles.saveButton,

              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.saveButtonText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>General Settings</Text>

      <View style={styles.fieldsRow}>
        {/* School Name */}

        <View style={styles.settingField}>
          <Text style={styles.label}>School Name</Text>

          <View style={styles.inputSaveRow}>
            <TextInput
              value={schoolName}
              onChangeText={setSchoolName}
              editable={savingKey === null}
              placeholder="School name"
              placeholderTextColor={COLORS.MUTED}
              style={styles.textInput}
            />

            <SaveIconButton
              loading={savingKey === '__SCHOOL_NAME__'}
              disabled={!schoolNameChanged || savingKey !== null}
              onPress={handleSaveSchoolName}
            />
          </View>
        </View>

        {/* School Address */}

        <View style={styles.settingField}>
          <Text style={styles.label}>School Address</Text>

          <View style={styles.inputSaveRow}>
            <TextInput
              value={schoolAddress}
              onChangeText={setSchoolAddress}
              editable={savingKey === null}
              placeholder="School address"
              placeholderTextColor={COLORS.MUTED}
              style={styles.textInput}
            />

            <SaveIconButton
              loading={savingKey === '__SCHOOL_ADDRESS__'}
              disabled={!schoolAddressChanged || savingKey !== null}
              onPress={handleSaveSchoolAddress}
            />
          </View>
        </View>

        {/* Phone Numbers */}

        <View style={styles.settingField}>
          <Text style={styles.label}>Phone Numbers</Text>

          <View style={styles.inputSaveRow}>
            <TextInput
              value={schoolPhone}
              onChangeText={setSchoolPhone}
              editable={savingKey === null}
              keyboardType="phone-pad"
              placeholder="Phone number"
              placeholderTextColor={COLORS.MUTED}
              style={styles.textInput}
            />

            <SaveIconButton
              loading={savingKey === 'school.phone'}
              disabled={!schoolPhoneChanged || savingKey !== null}
              onPress={handleSaveSchoolPhone}
            />
          </View>
        </View>
      </View>

      {/* Forums */}

      <View style={styles.forumSection}>
        <Text style={styles.label}>Allow students into Forums</Text>

        <View style={styles.forumActions}>
          <Pressable
            onPress={() => {
              if (savingKey !== null) {
                return;
              }

              setAllowStudentsForums(previous => !previous);
            }}
            style={({ pressed }) => [
              styles.checkbox,

              allowStudentsForums && styles.checkboxChecked,

              pressed && savingKey === null && styles.buttonPressed,
            ]}
          >
            {allowStudentsForums ? (
              <Text style={styles.checkboxTick}>✓</Text>
            ) : null}
          </Pressable>

          <SaveIconButton
            loading={savingKey === 'forums.allow_students'}
            disabled={!forumsChanged || savingKey !== null}
            onPress={handleSaveForums}
          />
        </View>
      </View>
    </View>
  );
}

function SaveIconButton({ loading = false, disabled = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.saveIconButton,

        pressed && !disabled && styles.buttonPressed,

        disabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.TEXT} />
      ) : (
        <Text style={styles.saveIconText}>💾</Text>
      )}
    </Pressable>
  );
}
