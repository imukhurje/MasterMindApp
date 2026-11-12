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

import { COLORS, styles } from './PaymentQrSettings.styles';

function getErrorMessage(error, fallback) {
  return (
    error?.payload?.message ||
    error?.payload?.error ||
    error?.message ||
    fallback
  );
}

function normalizeText(value) {
  return String(value || '').trim();
}

export default function PaymentQrSettings() {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [gateway, setGateway] = useState('');

  const [configured, setConfigured] = useState(false);

  /*
   * Editable values
   */
  const [vpa, setVpa] = useState('');

  const [merchantName, setMerchantName] = useState('');

  /*
   * Last saved values
   */
  const [savedVpa, setSavedVpa] = useState('');

  const [savedMerchantName, setSavedMerchantName] = useState('');

  const [saving, setSaving] = useState(false);

  /*
   * Load current payment configuration.
   */
  const loadPaymentConfig = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const response = await api('/api/settings/v1/payment-config', {
        method: 'GET',
      });

      const currentGateway = String(response?.gateway || '');

      const currentVpa = String(response?.qrcode_manual_vpa || '');

      const currentMerchant = String(
        response?.qrcode_manual_merchant_name || '',
      );

      setGateway(currentGateway);

      setConfigured(Boolean(response?.qrcode_manual_configured));

      setVpa(currentVpa);

      setSavedVpa(currentVpa);

      setMerchantName(currentMerchant);

      setSavedMerchantName(currentMerchant);
    } catch (error) {
      console.log('Payment config load error:', error);

      setLoadError(
        getErrorMessage(error, 'Could not load online payment settings.'),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPaymentConfig();
  }, [loadPaymentConfig]);

  const hasChanges = useMemo(() => {
    return (
      normalizeText(vpa) !== normalizeText(savedVpa) ||
      normalizeText(merchantName) !== normalizeText(savedMerchantName)
    );
  }, [vpa, savedVpa, merchantName, savedMerchantName]);

  /*
   * Keep VPA validation deliberately
   * light because different UPI providers
   * may use different handles.
   */
  function validate() {
    const cleanVpa = normalizeText(vpa);

    const cleanMerchant = normalizeText(merchantName);

    if (!cleanVpa) {
      Alert.alert('Online Payment', 'Please enter a VPA / UPI ID.');

      return false;
    }

    if (!cleanVpa.includes('@')) {
      Alert.alert('Online Payment', 'Please enter a valid VPA / UPI ID.');

      return false;
    }

    if (!cleanMerchant) {
      Alert.alert('Online Payment', 'Please enter the merchant name.');

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
      vpa: normalizeText(vpa),

      merchant_name: normalizeText(merchantName),
    };

    try {
      setSaving(true);

      console.log('QR code manual payload:', payload);

      const response = await api('/api/settings/v1/qrcode-manual', {
        method: 'PUT',

        body: JSON.stringify(payload),
      });

      if (!response?.ok) {
        throw new Error(
          'The server did not confirm the UPI configuration update.',
        );
      }

      const updatedVpa = String(response?.vpa || payload.vpa);

      const updatedMerchant = String(
        response?.merchant_name || payload.merchant_name,
      );

      setVpa(updatedVpa);

      setSavedVpa(updatedVpa);

      setMerchantName(updatedMerchant);

      setSavedMerchantName(updatedMerchant);

      setConfigured(true);

      /*
       * Reload gateway as backend
       * authoritative state.
       */
      try {
        const config = await api('/api/settings/v1/payment-config', {
          method: 'GET',
        });

        setGateway(String(config?.gateway || gateway || ''));

        setConfigured(Boolean(config?.qrcode_manual_configured));
      } catch (reloadError) {
        console.log('Payment config reload error:', reloadError);
      }

      Alert.alert(
        'UPI Details Saved',
        'The online payment UPI details have been updated successfully.',
      );
    } catch (error) {
      console.log('QR code manual save error:', error);

      Alert.alert(
        'Could not save UPI details',
        getErrorMessage(
          error,
          'The online payment settings could not be saved.',
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * Clear only the editable form.
   *
   * We do not send blank data immediately
   * because no separate remove/clear API
   * has been provided.
   */
  function handleClear() {
    if (saving) {
      return;
    }

    if (!vpa && !merchantName) {
      return;
    }

    Alert.alert(
      'Clear UPI Details?',
      'This will clear the values from the form. Nothing will be changed on the server until you save valid UPI details.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Clear',
          style: 'destructive',

          onPress: () => {
            setVpa('');

            setMerchantName('');
          },
        },
      ],
    );
  }

  function handleReset() {
    if (saving) {
      return;
    }

    setVpa(savedVpa);

    setMerchantName(savedMerchantName);
  }

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />

          <Text style={styles.stateText}>
            Loading online payment settings...
          </Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Online Payment (Dynamic UPI QR)</Text>

        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>
            Could not load payment configuration
          </Text>

          <Text style={styles.errorDescription}>{loadError}</Text>

          <Pressable
            onPress={loadPaymentConfig}
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

      <View style={[styles.headerRow, isMobile && styles.headerRowMobile]}>
        <View style={styles.headerText}>
          <Text style={styles.sectionTitle}>
            Online Payment (Dynamic UPI QR)
          </Text>

          <View style={styles.gatewayRow}>
            <Text style={styles.gatewayLabel}>Current gateway:</Text>

            <Text style={styles.gatewayValue}>
              {gateway || 'Not configured'}
            </Text>

            {configured ? (
              <View style={styles.configuredBadge}>
                <Text style={styles.configuredBadgeText}>Configured</Text>
              </View>
            ) : (
              <View style={styles.notConfiguredBadge}>
                <Text style={styles.notConfiguredBadgeText}>
                  Not configured
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Form */}

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>VPA / UPI ID</Text>

          <TextInput
            value={vpa}
            onChangeText={setVpa}
            editable={!saving}
            placeholder="e.g. merchant@upi"
            placeholderTextColor={COLORS.MUTED}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.textInput}
          />

          <Text style={styles.fieldHelper}>
            Enter the UPI ID that should receive customer payments.
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Merchant Name</Text>

          <TextInput
            value={merchantName}
            onChangeText={setMerchantName}
            editable={!saving}
            placeholder="e.g. School or Institution Name"
            placeholderTextColor={COLORS.MUTED}
            autoCapitalize="words"
            style={styles.textInput}
          />
        </View>
      </View>

      {/* Info */}

      <View style={styles.infoBox}>
        <View style={styles.infoIcon}>
          <Text style={styles.infoIconText}>₹</Text>
        </View>

        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Dynamic payment amount</Text>

          <Text style={styles.infoDescription}>
            Each payment QR will be generated with the exact amount of the bills
            selected by the user.
          </Text>
        </View>
      </View>

      {/* Actions */}

      <View style={[styles.actions, isMobile && styles.actionsMobile]}>
        <Pressable
          onPress={handleSave}
          disabled={
            saving ||
            !hasChanges ||
            !normalizeText(vpa) ||
            !normalizeText(merchantName)
          }
          style={({ pressed }) => [
            styles.primaryButton,

            isMobile && styles.mobileButton,

            (saving ||
              !hasChanges ||
              !normalizeText(vpa) ||
              !normalizeText(merchantName)) &&
              styles.buttonDisabled,

            pressed && !saving && hasChanges && styles.buttonPressed,
          ]}
        >
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.TEXT} />
          ) : (
            <Text style={styles.primaryButtonText}>Save UPI Details</Text>
          )}
        </Pressable>

        <Pressable
          onPress={handleClear}
          disabled={saving || (!vpa && !merchantName)}
          style={({ pressed }) => [
            styles.secondaryButton,

            isMobile && styles.mobileButton,

            (saving || (!vpa && !merchantName)) && styles.buttonDisabled,

            pressed && !saving && styles.buttonPressed,
          ]}
        >
          <Text style={styles.secondaryButtonText}>Clear</Text>
        </Pressable>

        {hasChanges ? (
          <Pressable
            onPress={handleReset}
            disabled={saving}
            style={({ pressed }) => [
              styles.resetButton,

              isMobile && styles.mobileButton,

              pressed && !saving && styles.buttonPressed,
            ]}
          >
            <Text style={styles.resetButtonText}>Reset Changes</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
