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

import { COLORS, styles } from './BillingDeliverySettings.styles';

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

export default function BillingDeliverySettings() {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  /*
   * Editable values
   */
  const [dueDays, setDueDays] = useState('');

  const [autoSend, setAutoSend] = useState(false);

  /*
   * Last saved values
   */
  const [savedDueDays, setSavedDueDays] = useState('');

  const [savedAutoSend, setSavedAutoSend] = useState(false);

  const [saving, setSaving] = useState(false);

  /*
   * Load current configuration.
   */
  const loadBillingDelivery = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const response = await api('/api/settings/v1/billing-delivery', {
        method: 'GET',
      });

      const apiDueDays = Number(response?.due_days);

      const normalizedDueDays = Number.isFinite(apiDueDays)
        ? String(apiDueDays)
        : '';

      const apiAutoSend = Boolean(response?.auto_send_on_generation);

      setDueDays(normalizedDueDays);

      setSavedDueDays(normalizedDueDays);

      setAutoSend(apiAutoSend);

      setSavedAutoSend(apiAutoSend);
    } catch (error) {
      console.log('Billing delivery load error:', error);

      setLoadError(
        getErrorMessage(error, 'Could not load billing delivery settings.'),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBillingDelivery();
  }, [loadBillingDelivery]);

  /*
   * Detect unsaved changes.
   */
  const hasChanges = useMemo(() => {
    return (
      String(dueDays).trim() !== String(savedDueDays).trim() ||
      autoSend !== savedAutoSend
    );
  }, [dueDays, savedDueDays, autoSend, savedAutoSend]);

  function handleDueDaysChange(value) {
    /*
     * Keep integer digits only.
     */
    const cleaned = String(value || '').replace(/[^0-9]/g, '');

    setDueDays(cleaned);
  }

  async function handleSave() {
    if (saving || !hasChanges) {
      return;
    }

    const numericDueDays = Number(dueDays);

    if (!dueDays || !Number.isInteger(numericDueDays) || numericDueDays <= 0) {
      Alert.alert(
        'Billing Delivery',
        'Please enter a valid number of due days greater than 0.',
      );

      return;
    }

    const payload = {
      auto_send_on_generation: autoSend,

      due_days: numericDueDays,
    };

    try {
      setSaving(true);

      console.log('Billing delivery payload:', payload);

      const response = await api('/api/settings/v1/billing-delivery', {
        method: 'PUT',

        body: JSON.stringify(payload),
      });

      if (!response?.ok) {
        throw new Error(
          'The server did not confirm the billing delivery update.',
        );
      }

      const updatedDueDays = Number(response?.due_days ?? numericDueDays);

      const updatedAutoSend = Boolean(response?.auto_send_on_generation);

      setDueDays(String(updatedDueDays));

      setSavedDueDays(String(updatedDueDays));

      setAutoSend(updatedAutoSend);

      setSavedAutoSend(updatedAutoSend);

      Alert.alert(
        'Billing Delivery Updated',
        'Billing delivery settings have been saved successfully.',
      );
    } catch (error) {
      console.log('Billing delivery save error:', error);

      Alert.alert(
        'Could not save billing delivery',
        getErrorMessage(error, 'Billing delivery settings could not be saved.'),
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
            Loading billing delivery settings...
          </Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Billing Delivery</Text>

        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Could not load billing delivery</Text>

          <Text style={styles.errorDescription}>{loadError}</Text>

          <Pressable
            onPress={loadBillingDelivery}
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
      {/* Header */}

      <Text style={styles.sectionTitle}>Billing Delivery</Text>

      <Text style={styles.description}>
        Monthly bills are generated automatically at 5:00 AM India time on the
        first day of each month.
      </Text>

      {/* Due Days */}

      <View style={styles.dueSection}>
        <Text style={styles.dueText}>Bills are due in</Text>

        <TextInput
          value={dueDays}
          onChangeText={handleDueDaysChange}
          editable={!saving}
          keyboardType="number-pad"
          maxLength={3}
          selectTextOnFocus
          style={styles.dueInput}
        />

        <Text style={styles.dueText}>days</Text>
      </View>

      {/* Delivery Mode */}

      <View style={styles.optionsContainer}>
        <RadioOption
          selected={!autoSend}
          disabled={saving}
          title="I will send bills manually"
          description="Bills are generated but no family notification is sent automatically."
          onPress={() => setAutoSend(false)}
        />

        <RadioOption
          selected={autoSend}
          disabled={saving}
          title="Auto-send bills on generation"
          description="Email the parent first, then the student, with the bill PDF attached. If no email is recorded, WhatsApp is used only when a live provider adapter is installed."
          onPress={() => setAutoSend(true)}
        />
      </View>

      {/* Current Selection Summary */}

      <View style={styles.summaryBox}>
        <View style={styles.summaryIcon}>
          <Text style={styles.summaryIconText}>{autoSend ? '↗' : '✓'}</Text>
        </View>

        <View style={styles.summaryText}>
          <Text style={styles.summaryTitle}>
            {autoSend
              ? 'Automatic delivery enabled'
              : 'Manual delivery selected'}
          </Text>

          <Text style={styles.summaryDescription}>
            {autoSend
              ? `Bills will be due ${
                  dueDays || '—'
                } days after generation and notifications will be sent automatically.`
              : `Bills will be due ${
                  dueDays || '—'
                } days after generation. You will handle bill delivery manually.`}
          </Text>
        </View>
      </View>

      {/* Actions */}

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
            <Text style={styles.primaryButtonText}>Save Billing Delivery</Text>
          )}
        </Pressable>

        {hasChanges ? (
          <Pressable
            disabled={saving}
            onPress={() => {
              setDueDays(savedDueDays);

              setAutoSend(savedAutoSend);
            }}
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
