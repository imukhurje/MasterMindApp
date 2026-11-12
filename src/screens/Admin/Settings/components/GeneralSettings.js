import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { COLORS, styles } from './GeneralSettings.styles';

import GeneralBasicSettings from './GeneralBasicSettings';
import RoutineModeSettings from './RoutineModeSettings';
import AcademicYearSettings from './AcademicYearSettings';
import BrandLogoSettings from './BrandLogoSettings';
import AttendanceFrequencySettings from './AttendanceFrequencySettings';
import PaymentQrSettings from './PaymentQrSettings';
import StudentIdCardSettings from './StudentIdCardSettings';
import StudentSubjectsByClassSettings from './StudentSubjectsByClassSettings';
import SubjectCombinationsSettings from './SubjectCombinationsSettings';
import BillingCouponCodesSettings from './BillingCouponCodesSettings';
import BillingDeliverySettings from './BillingDeliverySettings';
import StudentAccessArchivesSettings from './StudentAccessArchivesSettings';
import TutorialAttendanceSheetsSettings from './TutorialAttendanceSheetsSettings';
import ExaminationConfigSettings from './ExaminationConfigSettings';
import AutoLogoutSettings from './AutoLogoutSettings';
import StudentAccessMonitoringSettings from './StudentAccessMonitoringSettings';

const SETTINGS_ENDPOINT = '/api/settings/v1?keys=weekend_days';

const DEFAULT_WEEKEND_DAYS = [6, 7];

const WEEK_DAYS = [
  {
    id: 1,
    label: 'Monday',
    aliases: ['monday', 'mon', 'mo'],
  },
  {
    id: 2,
    label: 'Tuesday',
    aliases: ['tuesday', 'tue', 'tues', 'tu'],
  },
  {
    id: 3,
    label: 'Wednesday',
    aliases: ['wednesday', 'wed', 'we'],
  },
  {
    id: 4,
    label: 'Thursday',
    aliases: ['thursday', 'thu', 'thur', 'thurs', 'th'],
  },
  {
    id: 5,
    label: 'Friday',
    aliases: ['friday', 'fri', 'fr'],
  },
  {
    id: 6,
    label: 'Saturday',
    aliases: ['saturday', 'sat', 'sa'],
  },
  {
    id: 7,
    label: 'Sunday',
    aliases: ['sunday', 'sun', 'su'],
  },
];

function getSettingValue(response, key) {
  const items = Array.isArray(response?.items) ? response.items : [];

  return items.find(item => item?.key === key)?.value;
}

function normalizeWeekendDays(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value
        .map(day => Number(day))
        .filter(day => Number.isInteger(day) && day >= 1 && day <= 7),
    ),
  ].sort((a, b) => a - b);
}

function findWeekDayByInput(value) {
  const normalized = String(value || '')
    .trim()
    .toLowerCase();

  if (!normalized) {
    return null;
  }

  return WEEK_DAYS.find(day => day.aliases.includes(normalized)) || null;
}

function normalizeRoutineMode(value) {
  const normalized = String(value || '')
    .trim()
    .toLowerCase();

  if (normalized === 'school') {
    return 'School';
  }

  if (normalized === 'tutorial') {
    return 'Tutorial';
  }

  return null;
}

export default function GeneralSettings() {
  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  /*
   * The saved routine mode is supplied
   * by RoutineModeSettings after its
   * backend GET or successful PUT.
   *
   * null means the routine mode has not
   * been resolved yet.
   */
  const [routineMode, setRoutineMode] = useState(null);

  const [selectedWeekendDays, setSelectedWeekendDays] = useState([]);

  const [savedWeekendDays, setSavedWeekendDays] = useState([]);

  const [weekendInput, setWeekendInput] = useState('');

  const [savingWeekendDays, setSavingWeekendDays] = useState(false);

  const loadGeneralSettings = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const response = await api(SETTINGS_ENDPOINT, {
        method: 'GET',
      });

      const weekendValue = getSettingValue(response, 'weekend_days');

      const normalizedWeekendValue = normalizeWeekendDays(weekendValue);

      setSelectedWeekendDays(normalizedWeekendValue);

      setSavedWeekendDays(normalizedWeekendValue);
    } catch (error) {
      console.log('General settings load error:', error);

      setLoadError(error?.message || 'Could not load general settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGeneralSettings();
  }, [loadGeneralSettings]);

  /*
   * Called by RoutineModeSettings:
   *
   * 1. After routine mode GET succeeds.
   * 2. After a routine mode PUT succeeds.
   *
   * A temporary unsaved radio selection
   * does not change the page layout.
   */
  const handleRoutineModeResolved = useCallback(value => {
    const normalized = normalizeRoutineMode(value);

    if (!normalized) {
      return;
    }

    setRoutineMode(normalized);
  }, []);

  const isSchoolMode = routineMode === 'School';

  const isTutorialMode = routineMode === 'Tutorial';

  const weekendDaysChanged = useMemo(() => {
    return (
      JSON.stringify(normalizeWeekendDays(selectedWeekendDays)) !==
      JSON.stringify(normalizeWeekendDays(savedWeekendDays))
    );
  }, [selectedWeekendDays, savedWeekendDays]);

  const selectedWeekendItems = useMemo(() => {
    return normalizeWeekendDays(selectedWeekendDays)
      .map(dayId => WEEK_DAYS.find(day => day.id === dayId))
      .filter(Boolean);
  }, [selectedWeekendDays]);

  function handleAddWeekendDays() {
    const rawInput = weekendInput.trim();

    if (!rawInput) {
      return;
    }

    const tokens = rawInput
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    const matchedDays = [];

    const invalidValues = [];

    tokens.forEach(token => {
      const day = findWeekDayByInput(token);

      if (day) {
        matchedDays.push(day.id);
      } else {
        invalidValues.push(token);
      }
    });

    if (invalidValues.length > 0) {
      Alert.alert(
        'Invalid weekday',
        `Could not recognise: ${invalidValues.join(', ')}`,
      );

      return;
    }

    setSelectedWeekendDays(previous =>
      normalizeWeekendDays([...previous, ...matchedDays]),
    );

    setWeekendInput('');
  }

  function handleRemoveWeekendDay(dayId) {
    if (selectedWeekendDays.length <= 1) {
      Alert.alert(
        'Weekend Day Required',
        'You must have at least one weekend day.',
      );

      return;
    }

    setSelectedWeekendDays(previous => previous.filter(day => day !== dayId));
  }

  function handleResetWeekendDays() {
    setSelectedWeekendDays([...DEFAULT_WEEKEND_DAYS]);

    setWeekendInput('');
  }

  async function handleSaveWeekendDays() {
    if (savingWeekendDays) {
      return;
    }

    const days = normalizeWeekendDays(selectedWeekendDays);

    if (days.length === 0) {
      Alert.alert(
        'Weekend Day Required',
        'You must select at least one weekend day.',
      );

      return;
    }

    try {
      setSavingWeekendDays(true);

      const response = await api('/api/settings/v1/weekend-days', {
        method: 'PUT',

        body: JSON.stringify({
          days,
        }),
      });

      const finalDays = normalizeWeekendDays(response?.value);

      const savedDays = finalDays.length > 0 ? finalDays : days;

      setSelectedWeekendDays(savedDays);

      setSavedWeekendDays(savedDays);

      Alert.alert(
        'Weekend Days Updated',
        'Weekend days have been saved successfully.',
      );
    } catch (error) {
      console.log('Weekend days save error:', error);

      Alert.alert(
        'Could not save weekend days',
        error?.message || 'Weekend days could not be saved.',
      );
    } finally {
      setSavingWeekendDays(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color={COLORS.BLUE} />

        <Text style={styles.stateText}>Loading general settings...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.errorTitle}>Could not load general settings</Text>

        <Text style={styles.errorDescription}>{loadError}</Text>

        <Pressable onPress={loadGeneralSettings} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ================================================
          COMMON — SCHOOL + TUTORIAL
      ================================================= */}

      {/* General Settings */}

      <GeneralBasicSettings />

      {/* Routine Mode */}

      <RoutineModeSettings onModeResolved={handleRoutineModeResolved} />

      {/* ================================================
          TUTORIAL ONLY
      ================================================= */}

      {isTutorialMode ? (
        <>
          <TutorialAttendanceSheetsSettings />

          <ExaminationConfigSettings />
        </>
      ) : null}

      {/* ================================================
          COMMON — SCHOOL + TUTORIAL
      ================================================= */}

      {/* Academic Year */}

      <AcademicYearSettings />

      {/* Weekend Days */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekend Days</Text>

        <Text style={styles.description}>
          Add days you want to set as weekend days
        </Text>

        <View style={styles.weekendInputRow}>
          <TextInput
            value={weekendInput}
            onChangeText={setWeekendInput}
            onSubmitEditing={handleAddWeekendDays}
            returnKeyType="done"
            placeholder="Type a weekday... e.g. Sat, Sun"
            placeholderTextColor={COLORS.MUTED}
            style={styles.weekendInput}
          />

          <Pressable
            onPress={handleAddWeekendDays}
            style={({ pressed }) => [
              styles.addButton,

              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>

        <Text style={styles.selectedLabel}>Selected weekend days</Text>

        <View style={styles.pillsContainer}>
          {selectedWeekendItems.map(day => (
            <View key={day.id} style={styles.dayPill}>
              <Text style={styles.dayPillText}>{day.label}</Text>

              <Pressable
                onPress={() => handleRemoveWeekendDay(day.id)}
                hitSlop={7}
                style={({ pressed }) => [
                  styles.removeDayButton,

                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.removeDayText}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <Text style={styles.helperText}>Must have at least one day.</Text>

        <View style={styles.weekendBottomActions}>
          <Pressable
            onPress={handleSaveWeekendDays}
            disabled={savingWeekendDays || !weekendDaysChanged}
            style={[
              styles.primaryButton,

              (savingWeekendDays || !weekendDaysChanged) &&
                styles.buttonDisabled,
            ]}
          >
            {savingWeekendDays ? (
              <ActivityIndicator size="small" color={COLORS.TEXT} />
            ) : (
              <Text style={styles.primaryButtonText}>Save Weekend Days</Text>
            )}
          </Pressable>

          <Pressable
            onPress={handleResetWeekendDays}
            disabled={savingWeekendDays}
            style={[
              styles.resetButton,

              savingWeekendDays && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.resetButtonText}>Reset to Sat & Sun</Text>
          </Pressable>
        </View>
      </View>

      {/* Brand Logo */}

      <BrandLogoSettings />

      {/* Student ID Card */}
      {/* <StudentIdCardSettings /> */}

      {/* Attendance Frequency */}

      <AttendanceFrequencySettings />

      {/* Student Subjects by Class */}

      <StudentSubjectsByClassSettings />

      {/* Subject Combinations */}

      <SubjectCombinationsSettings />

      {/* ================================================
          SCHOOL ONLY
      ================================================= */}

      {isSchoolMode ? (
        <>
          {/* Billing Coupon Codes */}

          <BillingCouponCodesSettings />

          {/* Billing Delivery */}

          <BillingDeliverySettings />

          {/* Online Payment / Manual QR */}

          <PaymentQrSettings />
        </>
      ) : null}

      {/* ================================================
          COMMON — SCHOOL + TUTORIAL
      ================================================= */}

      {/* Auto-logout */}

      <AutoLogoutSettings />

      {/* Student Access Archives */}

      <StudentAccessArchivesSettings />

      {/* Student Access Monitoring / Access Log */}

      <StudentAccessMonitoringSettings />
    </ScrollView>
  );
}
