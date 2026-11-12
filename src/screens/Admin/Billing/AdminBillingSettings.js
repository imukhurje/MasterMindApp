// src/screens/Admin/Billing/AdminBillingSettings.js

import React, { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Calendar } from 'react-native-calendars';

import { Dropdown } from 'react-native-element-dropdown';

import { useFocusEffect } from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../api/client';

import styles from './AdminBillingSettings.styles';

const COUPON_DISCOUNT_TYPES = [
  {
    label: 'Percentage',
    value: 'percentage',
  },
  {
    label: 'Fixed amount (site currency)',
    value: 'fixed',
  },
];

const LATE_FEE_TRIGGER_OPTIONS = [
  {
    label: 'Days after bill date',
    value: 'after_bill_date',
  },
];

const LATE_FEE_TYPE_OPTIONS = [
  {
    label: 'Percentage',
    value: 'percentage',
  },
];

function formatDisplayDate(value) {
  if (!value) {
    return 'dd-mm-yyyy';
  }

  const parts = String(value).split('-');

  if (parts.length !== 3) {
    return value;
  }

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function formatApiDate(value) {
  if (!value) {
    return '';
  }

  return String(value).slice(0, 10);
}

function getCouponDiscountText(item) {
  const type = String(item?.discount_type || '')
    .trim()
    .toLowerCase();

  if (type === 'ladder') {
    const tiers = Array.isArray(item?.ladder_tiers) ? item.ladder_tiers : [];

    return `Discount ladder · ${tiers.length} tier${
      tiers.length === 1 ? '' : 's'
    }`;
  }

  const value = Number(item?.discount_value || 0);

  if (type === 'percentage') {
    return `${value}% off`;
  }

  return `₹${value.toFixed(2)} off`;
}

export default function AdminBillingSettings() {
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [paymentConfig, setPaymentConfig] = useState(null);

  const [billingCoupons, setBillingCoupons] = useState([]);

  const [latePenalty, setLatePenalty] = useState(null);

  const [lateFeeModalVisible, setLateFeeModalVisible] = useState(false);

  const [savingLateFee, setSavingLateFee] = useState(false);

  const [lateFeeTriggerType, setLateFeeTriggerType] =
    useState('after_bill_date');

  const [lateFeeTriggerValue, setLateFeeTriggerValue] = useState('');

  const [lateFeeType, setLateFeeType] = useState('percentage');

  const [lateFeeValue, setLateFeeValue] = useState('');

  const [dueDays, setDueDays] = useState('10');

  const [autoSendOnGeneration, setAutoSendOnGeneration] = useState(false);

  const [vpa, setVpa] = useState('');

  const [merchantName, setMerchantName] = useState('');

  const [couponModalVisible, setCouponModalVisible] = useState(false);

  const [couponMode, setCouponMode] = useState(null);

  const [couponCode, setCouponCode] = useState('');

  const [couponDiscountType, setCouponDiscountType] = useState('percentage');

  const [couponDiscountValue, setCouponDiscountValue] = useState('');

  const [couponValidFrom, setCouponValidFrom] = useState('');

  const [couponValidUntil, setCouponValidUntil] = useState('');

  const [couponCalendarField, setCouponCalendarField] = useState(null);

  const [savingCoupon, setSavingCoupon] = useState(false);

  const [editingCoupon, setEditingCoupon] = useState(null);

  const [deletingCouponId, setDeletingCouponId] = useState(null);

  const [editingLateFee, setEditingLateFee] = useState(false);

  const [deletingLateFee, setDeletingLateFee] = useState(false);

  const [savingBillingDelivery, setSavingBillingDelivery] = useState(false);

  const [savingUpiDetails, setSavingUpiDetails] = useState(false);

  const [couponLadderTiers, setCouponLadderTiers] = useState([
    {
      threshold: '0',
      discount_type: 'percentage',
      value: '0',
    },
  ]);

  const loadSettings = useCallback(async ({ refresh = false } = {}) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [
        paymentResponse,
        deliveryResponse,
        couponsResponse,
        penaltyResponse,
      ] = await Promise.all([
        api('/api/settings/v1/payment-config'),

        api('/api/settings/v1/billing-delivery'),

        api('/api/settings/v1/billing-coupons'),

        api('/api/settings/v1/late-payment-penalty'),
      ]);

      setPaymentConfig(paymentResponse || null);

      setBillingCoupons(Array.isArray(couponsResponse) ? couponsResponse : []);

      setLatePenalty(
        penaltyResponse && typeof penaltyResponse === 'object'
          ? penaltyResponse
          : {},
      );

      setDueDays(String(deliveryResponse?.due_days ?? 10));

      setAutoSendOnGeneration(
        deliveryResponse?.auto_send_on_generation === true,
      );

      setVpa(String(paymentResponse?.qrcode_manual_vpa || ''));

      setMerchantName(
        String(paymentResponse?.qrcode_manual_merchant_name || ''),
      );
    } catch (error) {
      console.log('Billing settings load error:', error);

      Alert.alert(
        'Billing Settings',
        error?.message || 'Could not load billing settings.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSettings();

      return undefined;
    }, [loadSettings]),
  );

  const handleAddCoupon = useCallback(() => {
    setEditingCoupon(null);
    setCouponMode(null);

    setCouponCode('');
    setCouponDiscountType('percentage');
    setCouponDiscountValue('');

    setCouponValidFrom('');
    setCouponValidUntil('');

    setCouponCalendarField(null);

    setCouponModalVisible(true);
    setCouponLadderTiers([
      {
        threshold: '0',
        discount_type: 'percentage',
        value: '0',
      },
    ]);
  }, []);

  const handleCloseCouponModal = useCallback(() => {
    if (savingCoupon) {
      return;
    }

    setEditingCoupon(null);

    setCouponModalVisible(false);

    setCouponMode(null);

    setCouponCode('');
    setCouponDiscountType('percentage');
    setCouponDiscountValue('');

    setCouponValidFrom('');
    setCouponValidUntil('');

    setCouponCalendarField(null);

    setCouponLadderTiers([
      {
        threshold: '0',
        discount_type: 'percentage',
        value: '0',
      },
    ]);
  }, [savingCoupon]);

  const handleSaveCoupon = useCallback(async () => {
    const code = String(couponCode || '').trim();

    if (!code) {
      Alert.alert('Add Coupon', 'Coupon code is required.');

      return;
    }

    if (!couponValidFrom) {
      Alert.alert('Add Coupon', 'Select a valid from date.');

      return;
    }

    if (!couponValidUntil) {
      Alert.alert('Add Coupon', 'Select a valid through date.');

      return;
    }

    if (couponValidUntil < couponValidFrom) {
      Alert.alert(
        'Add Coupon',
        'Valid through date cannot be before valid from date.',
      );

      return;
    }

    let payload = null;

    /*
     * Flat discount
     */
    if (couponMode === 'flat') {
      const discountValue = Number(couponDiscountValue);

      if (!Number.isFinite(discountValue) || discountValue <= 0) {
        Alert.alert('Add Coupon', 'Enter a valid discount value.');

        return;
      }

      if (couponDiscountType === 'percentage' && discountValue > 100) {
        Alert.alert(
          'Add Coupon',
          'Percentage discount cannot be greater than 100.',
        );

        return;
      }

      payload = {
        code,

        discount_type: couponDiscountType,

        discount_value: discountValue,

        valid_from: couponValidFrom,

        valid_until: couponValidUntil,
      };
    }

    /*
     * Discount ladder
     */
    if (couponMode === 'ladder') {
      if (!Array.isArray(couponLadderTiers) || couponLadderTiers.length === 0) {
        Alert.alert('Add Coupon', 'Add at least one discount tier.');

        return;
      }

      const ladderTiers = [];

      for (let index = 0; index < couponLadderTiers.length; index += 1) {
        const tier = couponLadderTiers[index];

        const minimumAmount = Number(tier?.threshold);

        const discountValue = Number(tier?.value);

        const discountType = String(tier?.discount_type || '').trim();

        if (!Number.isFinite(minimumAmount) || minimumAmount < 0) {
          Alert.alert(
            'Add Coupon',
            `Enter a valid minimum amount for tier ${index + 1}.`,
          );

          return;
        }

        if (!Number.isFinite(discountValue) || discountValue < 0) {
          Alert.alert(
            'Add Coupon',
            `Enter a valid discount value for tier ${index + 1}.`,
          );

          return;
        }

        if (discountType === 'percentage' && discountValue > 100) {
          Alert.alert(
            'Add Coupon',
            `Percentage discount for tier ${
              index + 1
            } cannot be greater than 100.`,
          );

          return;
        }

        ladderTiers.push({
          minimum_amount: minimumAmount,

          discount_type: discountType,

          discount_value: discountValue,
        });
      }

      /*
       * Sort tiers from lowest threshold
       * to highest threshold.
       */
      ladderTiers.sort((a, b) => a.minimum_amount - b.minimum_amount);

      payload = {
        code,

        discount_type: 'ladder',

        discount_value: 0,

        valid_from: couponValidFrom,

        valid_until: couponValidUntil,

        ladder_tiers: ladderTiers,
      };
    }

    if (!payload) {
      Alert.alert('Add Coupon', 'Select a coupon type.');

      return;
    }

    if (savingCoupon) {
      return;
    }

    try {
      setSavingCoupon(true);

      const editingCouponId = Number(editingCoupon?.id);

      const isEditing = Number.isFinite(editingCouponId);

      const endpoint = isEditing
        ? `/api/settings/v1/billing-coupons/${encodeURIComponent(
            editingCouponId,
          )}`
        : '/api/settings/v1/billing-coupons';

      const response = await api(endpoint, {
        method: isEditing ? 'PUT' : 'POST',

        body: JSON.stringify(payload),
      });

      if (!response?.id) {
        throw new Error('Created coupon ID was not returned.');
      }

      /*
       * Refresh coupon list.
       */
      const couponsResponse = await api('/api/settings/v1/billing-coupons');

      setBillingCoupons(Array.isArray(couponsResponse) ? couponsResponse : []);

      /*
       * Close and reset modal.
       */
      setEditingCoupon(null);
      setCouponModalVisible(false);

      setCouponMode(null);

      setCouponCode('');

      setCouponDiscountType('percentage');

      setCouponDiscountValue('');

      setCouponValidFrom('');

      setCouponValidUntil('');

      setCouponCalendarField(null);

      setCouponLadderTiers([
        {
          threshold: '0',
          discount_type: 'percentage',
          value: '0',
        },
      ]);

      Alert.alert(
        isEditing ? 'Coupon Updated' : 'Coupon Added',

        isEditing
          ? 'Billing coupon updated successfully.'
          : 'Billing coupon created successfully.',
      );
    } catch (error) {
      console.log('Create billing coupon error:', error);

      Alert.alert(
        'Add Coupon',
        error?.message || 'Could not create the billing coupon.',
      );
    } finally {
      setSavingCoupon(false);
    }
  }, [
    couponMode,
    couponCode,
    couponDiscountType,
    couponDiscountValue,
    couponValidFrom,
    couponValidUntil,
    couponLadderTiers,
    savingCoupon,
    editingCoupon,
  ]);

  const handleAddLateFee = useCallback(() => {
    setEditingLateFee(false);

    setLateFeeTriggerType('after_bill_date');
    setLateFeeTriggerValue('');
    setLateFeeType('percentage');
    setLateFeeValue('');

    setLateFeeModalVisible(true);
  }, []);

  const handleEditLateFee = useCallback(() => {
    if (!latePenalty || Object.keys(latePenalty).length === 0) {
      return;
    }

    setEditingLateFee(true);

    setLateFeeTriggerType(
      String(latePenalty?.trigger_type || 'after_bill_date'),
    );

    setLateFeeTriggerValue(String(latePenalty?.trigger_value ?? ''));

    setLateFeeType(String(latePenalty?.fee_type || 'percentage'));

    setLateFeeValue(String(latePenalty?.fee_value ?? ''));

    setLateFeeModalVisible(true);
  }, [latePenalty]);

  const handleCloseLateFeeModal = useCallback(() => {
    if (savingLateFee) {
      return;
    }

    setLateFeeModalVisible(false);

    setEditingLateFee(false);

    setLateFeeTriggerType('after_bill_date');
    setLateFeeTriggerValue('');
    setLateFeeType('percentage');
    setLateFeeValue('');
  }, [savingLateFee]);

  const handleSaveLateFee = useCallback(async () => {
    const triggerValue = Number(lateFeeTriggerValue);

    const feeValue = Number(lateFeeValue);

    if (!Number.isFinite(triggerValue) || triggerValue < 0) {
      Alert.alert('Late Payment Penalty', 'Enter a valid number of days.');

      return;
    }

    if (!Number.isFinite(feeValue) || feeValue <= 0) {
      Alert.alert('Late Payment Penalty', 'Enter a valid late fee value.');

      return;
    }

    if (lateFeeType === 'percentage' && feeValue > 100) {
      Alert.alert(
        'Late Payment Penalty',
        'Percentage cannot be greater than 100.',
      );

      return;
    }

    if (savingLateFee) {
      return;
    }

    try {
      setSavingLateFee(true);

      const response = await api('/api/settings/v1/late-payment-penalty', {
        method: editingLateFee ? 'PUT' : 'POST',

        body: JSON.stringify({
          trigger_type: lateFeeTriggerType,

          trigger_value: triggerValue,

          fee_type: lateFeeType,

          fee_value: feeValue,
        }),
      });

      setLatePenalty(response && typeof response === 'object' ? response : {});

      setLateFeeModalVisible(false);
      setEditingLateFee(false);

      setLateFeeTriggerType('after_bill_date');

      setLateFeeTriggerValue('');
      setLateFeeType('percentage');
      setLateFeeValue('');

      Alert.alert(
        editingLateFee ? 'Late Fee Updated' : 'Late Fee Saved',

        editingLateFee
          ? 'Late payment penalty updated successfully.'
          : 'Late payment penalty saved successfully.',
      );
    } catch (error) {
      console.log('Save late payment penalty error:', error);

      Alert.alert(
        'Late Payment Penalty',
        error?.message || 'Could not save the late payment penalty.',
      );
    } finally {
      setSavingLateFee(false);
    }
  }, [
    lateFeeTriggerType,
    lateFeeTriggerValue,
    lateFeeType,
    lateFeeValue,
    savingLateFee,
    editingLateFee,
  ]);

  const handleDeleteLateFee = useCallback(() => {
    Alert.alert(
      'Delete Late Payment Penalty',
      'Delete the late payment penalty?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            if (deletingLateFee) {
              return;
            }

            try {
              setDeletingLateFee(true);

              const response = await api(
                '/api/settings/v1/late-payment-penalty',
                {
                  method: 'DELETE',
                },
              );

              if (response?.ok !== true) {
                throw new Error('Could not delete the late payment penalty.');
              }

              setLatePenalty({});
            } catch (error) {
              console.log('Delete late payment penalty error:', error);

              Alert.alert(
                'Delete Late Payment Penalty',
                error?.message || 'Could not delete the late payment penalty.',
              );
            } finally {
              setDeletingLateFee(false);
            }
          },
        },
      ],
    );
  }, [deletingLateFee]);

  const handleSaveBillingDelivery = useCallback(async () => {
    const parsedDueDays = Number(dueDays);

    if (!Number.isFinite(parsedDueDays) || parsedDueDays < 0) {
      Alert.alert('Billing Delivery', 'Enter a valid number of due days.');

      return;
    }

    if (savingBillingDelivery) {
      return;
    }

    try {
      setSavingBillingDelivery(true);

      const response = await api('/api/settings/v1/billing-delivery', {
        method: 'PUT',

        body: JSON.stringify({
          auto_send_on_generation: autoSendOnGeneration,

          due_days: parsedDueDays,
        }),
      });

      setDueDays(String(response?.due_days ?? parsedDueDays));

      setAutoSendOnGeneration(response?.auto_send_on_generation === true);

      Alert.alert(
        'Billing Delivery',
        'Billing delivery settings saved successfully.',
      );
    } catch (error) {
      console.log('Save billing delivery error:', error);

      Alert.alert(
        'Billing Delivery',
        error?.message || 'Could not save billing delivery settings.',
      );
    } finally {
      setSavingBillingDelivery(false);
    }
  }, [dueDays, autoSendOnGeneration, savingBillingDelivery]);

  const handleSaveUpiDetails = useCallback(async () => {
    const cleanVpa = String(vpa || '').trim();

    const cleanMerchantName = String(merchantName || '').trim();

    if (!cleanVpa) {
      Alert.alert('UPI Details', 'VPA / UPI ID is required.');

      return;
    }

    if (!cleanMerchantName) {
      Alert.alert('UPI Details', 'Merchant name is required.');

      return;
    }

    if (savingUpiDetails) {
      return;
    }

    try {
      setSavingUpiDetails(true);

      const response = await api('/api/settings/v1/qrcode-manual', {
        method: 'PUT',

        body: JSON.stringify({
          vpa: cleanVpa,

          merchant_name: cleanMerchantName,
        }),
      });

      setVpa(String(response?.vpa || cleanVpa));

      setMerchantName(String(response?.merchant_name || cleanMerchantName));

      /*
       * Keep the existing payment config
       * in sync with the saved UPI values.
       */
      setPaymentConfig(current => ({
        ...(current || {}),

        qrcode_manual_vpa: response?.vpa || cleanVpa,

        qrcode_manual_merchant_name:
          response?.merchant_name || cleanMerchantName,

        qrcode_manual_configured: true,
      }));

      Alert.alert('UPI Details', 'UPI details saved successfully.');
    } catch (error) {
      console.log('Save UPI details error:', error);

      Alert.alert(
        'UPI Details',
        error?.message || 'Could not save UPI details.',
      );
    } finally {
      setSavingUpiDetails(false);
    }
  }, [vpa, merchantName, savingUpiDetails]);

  const handleAddCouponTier = useCallback(() => {
    setCouponLadderTiers(current => [
      ...current,
      {
        threshold: '',
        discount_type: 'percentage',
        value: '0',
      },
    ]);
  }, []);

  const handleEditCoupon = useCallback(item => {
    const couponId = Number(item?.id);

    if (!Number.isFinite(couponId)) {
      Alert.alert('Edit Coupon', 'A valid coupon is required.');

      return;
    }

    const type = String(item?.discount_type || '')
      .trim()
      .toLowerCase();

    setEditingCoupon(item);

    setCouponCode(String(item?.code || ''));

    setCouponValidFrom(formatApiDate(item?.valid_from));

    setCouponValidUntil(formatApiDate(item?.valid_until));

    setCouponCalendarField(null);

    if (type === 'ladder') {
      setCouponMode('ladder');

      const tiers = Array.isArray(item?.ladder_tiers) ? item.ladder_tiers : [];

      setCouponLadderTiers(
        tiers.length > 0
          ? tiers.map(tier => ({
              threshold: String(tier?.minimum_amount ?? 0),

              discount_type: String(tier?.discount_type || 'percentage'),

              value: String(tier?.discount_value ?? 0),
            }))
          : [
              {
                threshold: '0',
                discount_type: 'percentage',
                value: '0',
              },
            ],
      );

      setCouponDiscountType('percentage');

      setCouponDiscountValue('');
    } else {
      setCouponMode('flat');

      setCouponDiscountType(type || 'percentage');

      setCouponDiscountValue(String(item?.discount_value ?? ''));

      setCouponLadderTiers([
        {
          threshold: '0',
          discount_type: 'percentage',
          value: '0',
        },
      ]);
    }

    setCouponModalVisible(true);
  }, []);

  const handleUpdateCouponTier = useCallback((index, field, value) => {
    setCouponLadderTiers(current =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }, []);

  const handleRemoveCouponTier = useCallback(index => {
    setCouponLadderTiers(current => {
      if (current.length <= 1) {
        return current;
      }

      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  }, []);

  const handleDeleteCoupon = useCallback(
    item => {
      const couponId = Number(item?.id);

      const code = String(item?.code || 'Coupon');

      if (!Number.isFinite(couponId)) {
        Alert.alert('Delete Coupon', 'A valid coupon is required.');

        return;
      }

      Alert.alert('Delete Coupon', `Delete coupon code ${code}?`, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            if (deletingCouponId !== null) {
              return;
            }

            try {
              setDeletingCouponId(couponId);

              await api(
                `/api/settings/v1/billing-coupons/${encodeURIComponent(
                  couponId,
                )}`,
                {
                  method: 'DELETE',
                },
              );

              const response = await api('/api/settings/v1/billing-coupons');

              setBillingCoupons(Array.isArray(response) ? response : []);
            } catch (error) {
              console.log('Delete billing coupon error:', error);

              Alert.alert(
                'Delete Coupon',
                error?.message || 'Could not delete the coupon.',
              );
            } finally {
              setDeletingCouponId(null);
            }
          },
        },
      ]);
    },
    [deletingCouponId],
  );

  const handleClearUpi = useCallback(() => {
    setVpa('');
    setMerchantName('');
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading billing settings...</Text>
      </View>
    );
  }

  const hasLatePenalty = latePenalty && Object.keys(latePenalty).length > 0;

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadSettings({
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
      >
        {/* Billing Coupon Codes */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>Billing Coupon Codes</Text>

              <Text style={styles.cardDescription}>
                Create codes that families can enter while paying unpaid bills.
                Codes are valid through the selected date.
              </Text>
            </View>

            <Pressable
              onPress={handleAddCoupon}
              style={({ pressed }) => [
                styles.primaryButton,

                pressed && styles.controlPressed,
              ]}
            >
              <MaterialCommunityIcons name="plus" size={17} color="#FFFFFF" />

              <Text style={styles.primaryButtonText}>Add Coupon</Text>
            </Pressable>
          </View>

          {billingCoupons.length === 0 ? (
            <Text style={styles.emptyText}>No active coupon codes.</Text>
          ) : (
            <View style={styles.couponList}>
              {billingCoupons.map(item => (
                <View key={String(item?.id)} style={styles.couponRow}>
                  <View style={styles.couponInfo}>
                    <Text style={styles.couponSummary}>
                      {item?.code || 'Coupon'}
                      {' · '}
                      {getCouponDiscountText(item)}
                      {' · from '}
                      {formatApiDate(item?.valid_from)}
                      {' · through '}
                      {formatApiDate(item?.valid_until)}
                    </Text>
                  </View>

                  <View style={styles.couponActions}>
                    <Pressable
                      onPress={() => handleEditCoupon(item)}
                      style={({ pressed }) => [
                        styles.couponEditButton,
                        pressed && styles.controlPressed,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="pencil-outline"
                        size={17}
                        color="#FFFFFF"
                      />
                    </Pressable>

                    <Pressable
                      disabled={deletingCouponId !== null}
                      onPress={() => handleDeleteCoupon(item)}
                      style={({ pressed }) => [
                        styles.couponDeleteButton,

                        deletingCouponId === Number(item?.id) &&
                          styles.controlDisabled,

                        pressed &&
                          deletingCouponId === null &&
                          styles.controlPressed,
                      ]}
                    >
                      {deletingCouponId === Number(item?.id) ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <MaterialCommunityIcons
                          name="delete-outline"
                          size={17}
                          color="#FFFFFF"
                        />
                      )}
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Late Payment Penalty */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>Late Payment Penalty</Text>

              <Text style={styles.cardDescription}>
                Add one automatic late fee for overdue bills. It is calculated
                when a family starts payment.
              </Text>
            </View>

            <Pressable
              onPress={handleAddLateFee}
              style={({ pressed }) => [
                styles.primaryButton,

                pressed && styles.controlPressed,
              ]}
            >
              <MaterialCommunityIcons name="plus" size={17} color="#FFFFFF" />

              <Text style={styles.primaryButtonText}>Add Late Fee</Text>
            </Pressable>
          </View>

          {!hasLatePenalty ? (
            <Text style={styles.emptyText}>No Late Fee Configured.</Text>
          ) : (
            <View style={styles.lateFeeSummaryRow}>
              <Text style={styles.lateFeeSummaryText}>
                Late Fee
                {' · '}
                {Number(latePenalty?.trigger_value || 0)} days after bill date
                {' · '}
                {latePenalty?.fee_type === 'percentage'
                  ? `${Number(latePenalty?.fee_value || 0)}%`
                  : String(latePenalty?.fee_value || '')}
              </Text>

              <View style={styles.lateFeeActions}>
                <Pressable
                  onPress={handleEditLateFee}
                  style={({ pressed }) => [
                    styles.couponEditButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={17}
                    color="#FFFFFF"
                  />
                </Pressable>

                <Pressable
                  disabled={deletingLateFee}
                  onPress={handleDeleteLateFee}
                  style={({ pressed }) => [
                    styles.couponDeleteButton,

                    deletingLateFee && styles.controlDisabled,

                    pressed && !deletingLateFee && styles.controlPressed,
                  ]}
                >
                  {deletingLateFee ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={17}
                      color="#FFFFFF"
                    />
                  )}
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* Billing Delivery */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Billing delivery</Text>

          <Text style={styles.cardDescription}>
            Monthly bills are generated automatically at 5:00 AM India time on
            the first day of each month.
          </Text>

          <View style={styles.dueDaysRow}>
            <Text style={styles.bodyText}>Bills are due in</Text>

            <TextInput
              value={dueDays}
              onChangeText={value => setDueDays(value.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              style={styles.dueDaysInput}
            />

            <Text style={styles.bodyText}>days</Text>
          </View>

          <Pressable
            onPress={() => setAutoSendOnGeneration(false)}
            style={styles.radioOption}
          >
            <View style={styles.radioOuter}>
              {!autoSendOnGeneration ? (
                <View style={styles.radioInner} />
              ) : null}
            </View>

            <View style={styles.radioContent}>
              <Text style={styles.radioTitle}>I will send bills manually</Text>

              <Text style={styles.radioDescription}>
                Bills are generated but no family notification is sent
                automatically.
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setAutoSendOnGeneration(true)}
            style={styles.radioOption}
          >
            <View style={styles.radioOuter}>
              {autoSendOnGeneration ? <View style={styles.radioInner} /> : null}
            </View>

            <View style={styles.radioContent}>
              <Text style={styles.radioTitle}>
                Auto-send bills on generation
              </Text>

              <Text style={styles.radioDescription}>
                Email the parent first, then the student, with the bill PDF
                attached. If no email is recorded, WhatsApp is used only when a
                live provider adapter is installed.
              </Text>
            </View>
          </Pressable>

          <Pressable
            disabled={savingBillingDelivery}
            onPress={handleSaveBillingDelivery}
            style={({ pressed }) => [
              styles.saveButton,

              savingBillingDelivery && styles.controlDisabled,

              pressed && !savingBillingDelivery && styles.controlPressed,
            ]}
          >
            {savingBillingDelivery ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Billing Delivery</Text>
            )}
          </Pressable>
        </View>

        {/* Online Payment */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Online Payment (Dynamic UPI QR)</Text>

          <Text style={styles.gatewayText}>
            Current gateway: {paymentConfig?.gateway || 'Not configured'}
          </Text>

          <Text style={styles.fieldLabel}>VPA / UPI ID</Text>

          <TextInput
            value={vpa}
            onChangeText={setVpa}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="example@upi"
            placeholderTextColor="#718096"
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>Merchant Name</Text>

          <TextInput
            value={merchantName}
            onChangeText={setMerchantName}
            placeholder="Merchant name"
            placeholderTextColor="#718096"
            style={styles.input}
          />

          <Text style={styles.helperText}>
            Each payment QR will be generated with the selected bills' exact
            amount.
          </Text>

          <View style={styles.paymentActions}>
            <Pressable
              disabled={savingUpiDetails}
              onPress={handleSaveUpiDetails}
              style={({ pressed }) => [
                styles.saveButton,

                savingUpiDetails && styles.controlDisabled,

                pressed && !savingUpiDetails && styles.controlPressed,
              ]}
            >
              {savingUpiDetails ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save UPI Details</Text>
              )}
            </Pressable>

            <Pressable
              onPress={handleClearUpi}
              style={({ pressed }) => [
                styles.clearButton,

                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={couponModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseCouponModal}
      >
        <View style={styles.couponModalBackdrop}>
          <View style={styles.couponModal}>
            <View style={styles.couponModalHeader}>
              <Text style={styles.couponModalTitle}>
                {editingCoupon ? 'Edit Coupon' : 'Add Coupon'}
              </Text>

              <Pressable
                disabled={savingCoupon}
                onPress={handleCloseCouponModal}
                style={({ pressed }) => [
                  styles.couponCloseButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={23}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.couponModalContent}
            >
              {couponMode === null ? (
                <>
                  <Text style={styles.couponHelpText}>
                    Choose how this coupon should calculate its discount.
                  </Text>

                  <View style={styles.couponTypeOptions}>
                    <Pressable
                      onPress={() => setCouponMode('flat')}
                      style={({ pressed }) => [
                        styles.couponTypeCard,

                        pressed && styles.controlPressed,
                      ]}
                    >
                      <Text style={styles.couponTypeTitle}>Flat discount</Text>

                      <Text style={styles.couponTypeDescription}>
                        A single percentage or fixed discount for every eligible
                        payment.
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        setCouponMode('ladder');

                        setCouponLadderTiers([
                          {
                            threshold: '0',
                            discount_type: 'percentage',
                            value: '0',
                          },
                        ]);
                      }}
                      style={({ pressed }) => [
                        styles.couponTypeCard,

                        pressed && styles.controlPressed,
                      ]}
                    >
                      <Text style={styles.couponTypeTitle}>
                        Discount ladder
                      </Text>

                      <Text style={styles.couponTypeDescription}>
                        Use a different percentage or fixed discount at each
                        payment-total threshold.
                      </Text>
                    </Pressable>
                  </View>

                  <Pressable
                    onPress={handleCloseCouponModal}
                    style={({ pressed }) => [
                      styles.couponCancelButton,

                      pressed && styles.controlPressed,
                    ]}
                  >
                    <Text style={styles.couponCancelText}>Cancel</Text>
                  </Pressable>
                </>
              ) : couponMode === 'flat' ? (
                <>
                  <Text style={styles.couponFieldLabel}>Code</Text>

                  <TextInput
                    value={couponCode}
                    onChangeText={setCouponCode}
                    autoCapitalize="characters"
                    placeholder="e.g. EARLYBIRD"
                    placeholderTextColor="#718096"
                    style={styles.couponInput}
                  />

                  <Text style={styles.couponFieldLabel}>Discount</Text>

                  <Dropdown
                    style={styles.couponDropdown}
                    containerStyle={styles.couponDropdownContainer}
                    selectedTextStyle={styles.couponDropdownSelected}
                    itemTextStyle={styles.couponDropdownItem}
                    activeColor="#173B60"
                    iconColor="#DCE7F5"
                    data={COUPON_DISCOUNT_TYPES}
                    labelField="label"
                    valueField="value"
                    value={couponDiscountType}
                    onChange={item => setCouponDiscountType(item?.value)}
                  />

                  <Text style={styles.couponFieldLabel}>Value</Text>

                  <TextInput
                    value={couponDiscountValue}
                    onChangeText={value =>
                      setCouponDiscountValue(value.replace(/[^0-9.]/g, ''))
                    }
                    keyboardType="decimal-pad"
                    placeholder="e.g. 10"
                    placeholderTextColor="#718096"
                    style={styles.couponInput}
                  />

                  <Text style={styles.couponFieldLabel}>Valid from</Text>

                  <Pressable
                    onPress={() => setCouponCalendarField('from')}
                    style={styles.couponDateField}
                  >
                    <Text
                      style={
                        couponValidFrom
                          ? styles.couponDateValue
                          : styles.couponDatePlaceholder
                      }
                    >
                      {formatDisplayDate(couponValidFrom)}
                    </Text>

                    <MaterialCommunityIcons
                      name="calendar-outline"
                      size={18}
                      color="#DCE7F5"
                    />
                  </Pressable>

                  <Text style={styles.couponFieldLabel}>Valid through</Text>

                  <Pressable
                    onPress={() => setCouponCalendarField('until')}
                    style={styles.couponDateField}
                  >
                    <Text
                      style={
                        couponValidUntil
                          ? styles.couponDateValue
                          : styles.couponDatePlaceholder
                      }
                    >
                      {formatDisplayDate(couponValidUntil)}
                    </Text>

                    <MaterialCommunityIcons
                      name="calendar-outline"
                      size={18}
                      color="#DCE7F5"
                    />
                  </Pressable>

                  <View style={styles.couponModalActions}>
                    {!editingCoupon ? (
                      <Pressable
                        disabled={savingCoupon}
                        onPress={() => setCouponMode(null)}
                        style={styles.couponSecondaryButton}
                      >
                        <Text style={styles.couponSecondaryText}>Back</Text>
                      </Pressable>
                    ) : null}

                    <Pressable
                      disabled={savingCoupon}
                      onPress={handleCloseCouponModal}
                      style={styles.couponSecondaryButton}
                    >
                      <Text style={styles.couponSecondaryText}>Cancel</Text>
                    </Pressable>

                    <Pressable
                      disabled={savingCoupon}
                      onPress={handleSaveCoupon}
                      style={[
                        styles.couponSaveButton,

                        savingCoupon && styles.controlDisabled,
                      ]}
                    >
                      {savingCoupon ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.couponSaveText}>
                          {editingCoupon ? 'Save Changes' : 'Add Coupon'}
                        </Text>
                      )}
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <>
                    <Text style={styles.couponFieldLabel}>Code</Text>

                    <TextInput
                      value={couponCode}
                      onChangeText={setCouponCode}
                      autoCapitalize="characters"
                      placeholder="e.g. EARLYBIRD"
                      placeholderTextColor="#718096"
                      editable={!savingCoupon}
                      style={styles.couponInput}
                    />

                    <Text style={styles.couponFieldLabel}>Valid from</Text>

                    <Pressable
                      disabled={savingCoupon}
                      onPress={() => setCouponCalendarField('from')}
                      style={styles.couponDateField}
                    >
                      <Text
                        style={
                          couponValidFrom
                            ? styles.couponDateValue
                            : styles.couponDatePlaceholder
                        }
                      >
                        {formatDisplayDate(couponValidFrom)}
                      </Text>

                      <MaterialCommunityIcons
                        name="calendar-outline"
                        size={18}
                        color="#DCE7F5"
                      />
                    </Pressable>

                    <Text style={styles.couponFieldLabel}>Valid through</Text>

                    <Pressable
                      disabled={savingCoupon}
                      onPress={() => setCouponCalendarField('until')}
                      style={styles.couponDateField}
                    >
                      <Text
                        style={
                          couponValidUntil
                            ? styles.couponDateValue
                            : styles.couponDatePlaceholder
                        }
                      >
                        {formatDisplayDate(couponValidUntil)}
                      </Text>

                      <MaterialCommunityIcons
                        name="calendar-outline"
                        size={18}
                        color="#DCE7F5"
                      />
                    </Pressable>

                    <View style={styles.ladderHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.ladderTitle}>Discount ladder</Text>

                        <Text style={styles.ladderDescription}>
                          Each tier starts at the shown total payable. The
                          highest matching tier is used.
                        </Text>
                      </View>

                      <Pressable
                        disabled={savingCoupon}
                        onPress={handleAddCouponTier}
                        style={({ pressed }) => [
                          styles.addTierButton,

                          pressed && styles.controlPressed,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="plus"
                          size={17}
                          color="#FFFFFF"
                        />

                        <Text style={styles.addTierButtonText}>Add tier</Text>
                      </Pressable>
                    </View>

                    <View style={styles.ladderList}>
                      {couponLadderTiers.map((tier, index) => (
                        <View
                          key={`tier-${index}`}
                          style={styles.ladderTierCard}
                        >
                          <View style={styles.ladderTierFields}>
                            <View style={styles.ladderThresholdField}>
                              <Text style={styles.ladderFieldLabel}>
                                From total payable
                              </Text>

                              <TextInput
                                value={tier.threshold}
                                onChangeText={value =>
                                  handleUpdateCouponTier(
                                    index,
                                    'threshold',
                                    value.replace(/[^0-9.]/g, ''),
                                  )
                                }
                                editable={!savingCoupon}
                                keyboardType="decimal-pad"
                                placeholder="0"
                                placeholderTextColor="#718096"
                                style={styles.ladderInput}
                              />
                            </View>

                            <View style={styles.ladderDiscountField}>
                              <Text style={styles.ladderFieldLabel}>
                                Discount
                              </Text>

                              <Dropdown
                                style={styles.ladderDropdown}
                                containerStyle={styles.couponDropdownContainer}
                                selectedTextStyle={
                                  styles.couponDropdownSelected
                                }
                                itemTextStyle={styles.couponDropdownItem}
                                placeholderStyle={
                                  styles.couponDropdownPlaceholder
                                }
                                activeColor="#173B60"
                                iconColor="#DCE7F5"
                                data={COUPON_DISCOUNT_TYPES}
                                labelField="label"
                                valueField="value"
                                value={tier.discount_type}
                                onChange={item =>
                                  handleUpdateCouponTier(
                                    index,
                                    'discount_type',
                                    item?.value,
                                  )
                                }
                              />
                            </View>

                            <View style={styles.ladderValueField}>
                              <Text style={styles.ladderFieldLabel}>Value</Text>

                              <TextInput
                                value={tier.value}
                                onChangeText={value =>
                                  handleUpdateCouponTier(
                                    index,
                                    'value',
                                    value.replace(/[^0-9.]/g, ''),
                                  )
                                }
                                editable={!savingCoupon}
                                keyboardType="decimal-pad"
                                placeholder="0"
                                placeholderTextColor="#718096"
                                style={styles.ladderInput}
                              />
                            </View>

                            <View style={styles.ladderDeleteField}>
                              <Text style={styles.ladderDeleteSpacer}> </Text>

                              <Pressable
                                disabled={
                                  savingCoupon || couponLadderTiers.length <= 1
                                }
                                onPress={() => handleRemoveCouponTier(index)}
                                style={({ pressed }) => [
                                  styles.ladderDeleteButton,

                                  couponLadderTiers.length <= 1 &&
                                    styles.controlDisabled,

                                  pressed && styles.controlPressed,
                                ]}
                              >
                                <MaterialCommunityIcons
                                  name="delete-outline"
                                  size={17}
                                  color="#081321"
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>

                    <View style={styles.couponModalActions}>
                      <Pressable
                        disabled={savingCoupon}
                        onPress={() => setCouponMode(null)}
                        style={styles.couponSecondaryButton}
                      >
                        <Text style={styles.couponSecondaryText}>Back</Text>
                      </Pressable>

                      <Pressable
                        disabled={savingCoupon}
                        onPress={handleCloseCouponModal}
                        style={styles.couponSecondaryButton}
                      >
                        <Text style={styles.couponSecondaryText}>Cancel</Text>
                      </Pressable>

                      <Pressable
                        disabled={savingCoupon}
                        onPress={handleSaveCoupon}
                        style={({ pressed }) => [
                          styles.couponSaveButton,

                          savingCoupon && styles.controlDisabled,

                          pressed && !savingCoupon && styles.controlPressed,
                        ]}
                      >
                        {savingCoupon ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <Text style={styles.couponSaveText}>
                            {editingCoupon ? 'Save Changes' : 'Add Coupon'}
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  </>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        visible={couponCalendarField !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setCouponCalendarField(null)}
      >
        <View style={styles.calendarBackdrop}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>
                {couponCalendarField === 'from'
                  ? 'Valid From'
                  : 'Valid Through'}
              </Text>

              <Pressable onPress={() => setCouponCalendarField(null)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Calendar
              current={
                couponCalendarField === 'from'
                  ? couponValidFrom || undefined
                  : couponValidUntil || couponValidFrom || undefined
              }
              markedDates={{
                ...(couponValidFrom
                  ? {
                      [couponValidFrom]: {
                        selected: couponCalendarField === 'from',
                      },
                    }
                  : {}),

                ...(couponValidUntil
                  ? {
                      [couponValidUntil]: {
                        selected: couponCalendarField === 'until',
                      },
                    }
                  : {}),
              }}
              onDayPress={day => {
                const value = day?.dateString;

                if (!value) {
                  return;
                }

                if (couponCalendarField === 'from') {
                  setCouponValidFrom(value);

                  if (couponValidUntil && couponValidUntil < value) {
                    setCouponValidUntil('');
                  }
                } else {
                  setCouponValidUntil(value);
                }

                setCouponCalendarField(null);
              }}
              theme={{
                calendarBackground: '#102742',

                dayTextColor: '#F8FAFC',

                monthTextColor: '#FFFFFF',

                textDisabledColor: '#53657C',

                arrowColor: '#67D1F0',

                selectedDayBackgroundColor: '#2563EB',

                selectedDayTextColor: '#FFFFFF',

                todayTextColor: '#67D1F0',
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal
        visible={lateFeeModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseLateFeeModal}
      >
        <View style={styles.couponModalBackdrop}>
          <View style={styles.lateFeeModal}>
            <View style={styles.couponModalHeader}>
              <Text style={styles.couponModalTitle}>
                {editingLateFee
                  ? 'Edit Late Payment Penalty'
                  : 'Add Late Payment Penalty'}
              </Text>

              <Pressable
                disabled={savingLateFee}
                onPress={handleCloseLateFeeModal}
                style={({ pressed }) => [
                  styles.couponCloseButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={23}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.couponModalContent}
            >
              <Text style={styles.couponFieldLabel}>Apply</Text>

              <Dropdown
                style={styles.couponDropdown}
                containerStyle={styles.couponDropdownContainer}
                selectedTextStyle={styles.couponDropdownSelected}
                itemTextStyle={styles.couponDropdownItem}
                activeColor="#173B60"
                iconColor="#DCE7F5"
                data={LATE_FEE_TRIGGER_OPTIONS}
                labelField="label"
                valueField="value"
                value={lateFeeTriggerType}
                onChange={item => setLateFeeTriggerType(item?.value)}
              />

              <Text style={styles.couponFieldLabel}>Number of days</Text>

              <TextInput
                value={lateFeeTriggerValue}
                onChangeText={value =>
                  setLateFeeTriggerValue(value.replace(/[^0-9]/g, ''))
                }
                editable={!savingLateFee}
                keyboardType="number-pad"
                placeholder="e.g. 5"
                placeholderTextColor="#718096"
                style={styles.couponInput}
              />

              <Text style={styles.couponFieldLabel}>Late Fee</Text>

              <Dropdown
                style={styles.couponDropdown}
                containerStyle={styles.couponDropdownContainer}
                selectedTextStyle={styles.couponDropdownSelected}
                itemTextStyle={styles.couponDropdownItem}
                activeColor="#173B60"
                iconColor="#DCE7F5"
                data={LATE_FEE_TYPE_OPTIONS}
                labelField="label"
                valueField="value"
                value={lateFeeType}
                onChange={item => setLateFeeType(item?.value)}
              />

              <Text style={styles.couponFieldLabel}>Value</Text>

              <TextInput
                value={lateFeeValue}
                onChangeText={value =>
                  setLateFeeValue(value.replace(/[^0-9.]/g, ''))
                }
                editable={!savingLateFee}
                keyboardType="decimal-pad"
                placeholder="e.g. 20"
                placeholderTextColor="#718096"
                style={styles.couponInput}
              />

              <View style={styles.couponModalActions}>
                <Pressable
                  disabled={savingLateFee}
                  onPress={handleCloseLateFeeModal}
                  style={styles.couponSecondaryButton}
                >
                  <Text style={styles.couponSecondaryText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={savingLateFee}
                  onPress={handleSaveLateFee}
                  style={({ pressed }) => [
                    styles.couponSaveButton,

                    savingLateFee && styles.controlDisabled,

                    pressed && !savingLateFee && styles.controlPressed,
                  ]}
                >
                  {savingLateFee ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.couponSaveText}>
                      {editingLateFee ? 'Save Changes' : 'Save Late Fee'}
                    </Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
