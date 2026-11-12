import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { Calendar } from 'react-native-calendars';

import { api } from '../../../../api/client';

import { COLORS, styles } from './BillingCouponCodesSettings.styles';

const TYPE_PERCENTAGE = 'percentage';
const TYPE_AMOUNT = 'amount';

const DISCOUNT_OPTIONS = [
  {
    value: TYPE_PERCENTAGE,
    label: 'Percentage',
  },
  {
    value: TYPE_AMOUNT,
    label: 'Fixed Amount (Site Currency)',
  },
];

function getErrorMessage(error, fallback) {
  return (
    error?.payload?.message ||
    error?.payload?.error ||
    error?.message ||
    fallback
  );
}

function normalizeDate(value) {
  if (!value) {
    return '';
  }

  return String(value).slice(0, 10);
}

function formatDisplayDate(value) {
  const normalized = normalizeDate(value);

  if (!normalized) {
    return '';
  }

  const parts = normalized.split('-');

  if (parts.length !== 3) {
    return normalized;
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
}

function formatDiscountValue(coupon) {
  const value = Number(coupon?.discount_value || 0);

  if (coupon?.discount_type === TYPE_PERCENTAGE) {
    return `${value}% off`;
  }

  return `${value.toFixed(2)} off`;
}

function normalizeCoupon(item) {
  const id = Number(item?.id);

  if (!Number.isFinite(id)) {
    return null;
  }

  return {
    ...item,

    id,

    code: String(item?.code || ''),

    discount_type:
      item?.discount_type === TYPE_AMOUNT ? TYPE_AMOUNT : TYPE_PERCENTAGE,

    discount_value: String(item?.discount_value ?? ''),

    valid_from: normalizeDate(item?.valid_from),

    valid_until: normalizeDate(item?.valid_until),
  };
}

/*
 * --------------------------------
 * Add / Edit Coupon Modal
 * --------------------------------
 */

function CouponFormModal({ visible, mode, coupon, saving, onClose, onSave }) {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  const [code, setCode] = useState('');

  const [discountType, setDiscountType] = useState(TYPE_PERCENTAGE);

  const [discountTypeOpen, setDiscountTypeOpen] = useState(false);

  const [discountValue, setDiscountValue] = useState('');

  const [validFrom, setValidFrom] = useState('');

  const [validUntil, setValidUntil] = useState('');

  /*
   * from | until | null
   */
  const [calendarTarget, setCalendarTarget] = useState(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setDiscountTypeOpen(false);

    setCalendarTarget(null);

    if (mode === 'edit' && coupon) {
      setCode(String(coupon?.code || ''));

      setDiscountType(
        coupon?.discount_type === TYPE_AMOUNT ? TYPE_AMOUNT : TYPE_PERCENTAGE,
      );

      setDiscountValue(
        String(coupon?.discount_value ?? '').replace(/\.00$/, ''),
      );

      setValidFrom(normalizeDate(coupon?.valid_from));

      setValidUntil(normalizeDate(coupon?.valid_until));

      return;
    }

    setCode('');

    setDiscountType(TYPE_PERCENTAGE);

    setDiscountValue('');

    setValidFrom('');

    setValidUntil('');
  }, [visible, mode, coupon]);

  const selectedTypeLabel = useMemo(() => {
    return (
      DISCOUNT_OPTIONS.find(option => option.value === discountType)?.label ||
      'Percentage'
    );
  }, [discountType]);

  function closeModal() {
    if (saving) {
      return;
    }

    setCalendarTarget(null);

    setDiscountTypeOpen(false);

    onClose();
  }

  function handleSubmit() {
    const cleanCode = code.trim().toUpperCase();

    const numericValue = Number(discountValue);

    if (!cleanCode) {
      Alert.alert('Billing Coupon', 'Please enter a coupon code.');

      return;
    }

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      Alert.alert(
        'Billing Coupon',
        'Please enter a valid discount value greater than 0.',
      );

      return;
    }

    if (discountType === TYPE_PERCENTAGE && numericValue > 100) {
      Alert.alert(
        'Billing Coupon',
        'Percentage discount cannot be greater than 100%.',
      );

      return;
    }

    if (!validFrom) {
      Alert.alert('Billing Coupon', 'Please select a valid-from date.');

      return;
    }

    if (!validUntil) {
      Alert.alert('Billing Coupon', 'Please select a valid-through date.');

      return;
    }

    if (validUntil < validFrom) {
      Alert.alert(
        'Billing Coupon',
        'Valid-through date cannot be earlier than the valid-from date.',
      );

      return;
    }

    onSave({
      code: cleanCode,

      discount_type: discountType,

      discount_value: numericValue,

      valid_from: validFrom,

      valid_until: validUntil,
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={closeModal}
    >
      <SafeAreaView style={styles.modalSafeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalCard, isMobile && styles.modalCardMobile]}
            >
              {/* Header */}

              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>
                    {mode === 'edit' ? 'Edit Coupon' : 'Add Coupon'}
                  </Text>

                  <Text style={styles.modalSubtitle}>
                    Configure the coupon code, discount and validity period.
                  </Text>
                </View>

                <Pressable
                  disabled={saving}
                  onPress={closeModal}
                  style={({ pressed }) => [
                    styles.closeButton,

                    pressed && !saving && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </Pressable>
              </View>

              {/* Scrollable Body */}

              <ScrollView
                style={styles.modalBodyScroll}
                contentContainerStyle={styles.modalBodyContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator
                nestedScrollEnabled
              >
                <View
                  style={[styles.formGrid, isMobile && styles.formGridMobile]}
                >
                  {/* Code */}

                  <View
                    style={[
                      styles.formField,

                      isMobile && styles.formFieldMobile,
                    ]}
                  >
                    <Text style={styles.fieldLabel}>Code</Text>

                    <TextInput
                      value={code}
                      onChangeText={setCode}
                      editable={!saving}
                      autoCapitalize="characters"
                      autoCorrect={false}
                      placeholder="e.g. EARLYBIRD"
                      placeholderTextColor={COLORS.MUTED}
                      style={styles.textInput}
                    />
                  </View>

                  {/* Discount Type */}

                  <View
                    style={[
                      styles.formField,

                      isMobile && styles.formFieldMobile,
                    ]}
                  >
                    <Text style={styles.fieldLabel}>Discount</Text>

                    <Pressable
                      disabled={saving}
                      onPress={() => {
                        setCalendarTarget(null);

                        setDiscountTypeOpen(previous => !previous);
                      }}
                      style={({ pressed }) => [
                        styles.dropdownButton,

                        pressed && !saving && styles.buttonPressed,
                      ]}
                    >
                      <Text style={styles.dropdownButtonText}>
                        {selectedTypeLabel}
                      </Text>

                      <Text style={styles.dropdownArrow}>
                        {discountTypeOpen ? '⌃' : '⌄'}
                      </Text>
                    </Pressable>

                    {discountTypeOpen ? (
                      <View style={styles.dropdownOptions}>
                        {DISCOUNT_OPTIONS.map(option => {
                          const selected = option.value === discountType;

                          return (
                            <Pressable
                              key={option.value}
                              onPress={() => {
                                setDiscountType(option.value);

                                setDiscountTypeOpen(false);
                              }}
                              style={({ pressed }) => [
                                styles.dropdownOption,

                                selected && styles.dropdownOptionSelected,

                                pressed && styles.buttonPressed,
                              ]}
                            >
                              <Text style={styles.dropdownOptionText}>
                                {option.label}
                              </Text>

                              {selected ? (
                                <Text style={styles.dropdownCheck}>✓</Text>
                              ) : null}
                            </Pressable>
                          );
                        })}
                      </View>
                    ) : null}
                  </View>

                  {/* Value */}

                  <View
                    style={[
                      styles.formField,

                      isMobile && styles.formFieldMobile,
                    ]}
                  >
                    <Text style={styles.fieldLabel}>Value</Text>

                    <TextInput
                      value={discountValue}
                      onChangeText={setDiscountValue}
                      editable={!saving}
                      keyboardType="decimal-pad"
                      placeholder={
                        discountType === TYPE_PERCENTAGE
                          ? 'e.g. 10'
                          : 'e.g. 250'
                      }
                      placeholderTextColor={COLORS.MUTED}
                      style={styles.textInput}
                    />

                    <Text style={styles.fieldHelper}>
                      {discountType === TYPE_PERCENTAGE
                        ? 'Enter a percentage between 0 and 100.'
                        : 'Amount uses the current site currency.'}
                    </Text>
                  </View>

                  {/* Valid From */}

                  <View
                    style={[
                      styles.formField,

                      isMobile && styles.formFieldMobile,
                    ]}
                  >
                    <Text style={styles.fieldLabel}>Valid from</Text>

                    <Pressable
                      disabled={saving}
                      onPress={() => {
                        setDiscountTypeOpen(false);

                        setCalendarTarget(previous =>
                          previous === 'from' ? null : 'from',
                        );
                      }}
                      style={({ pressed }) => [
                        styles.dateButton,

                        calendarTarget === 'from' && styles.dateButtonActive,

                        pressed && !saving && styles.buttonPressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dateButtonText,

                          !validFrom && styles.datePlaceholder,
                        ]}
                      >
                        {validFrom
                          ? formatDisplayDate(validFrom)
                          : 'dd/mm/yyyy'}
                      </Text>

                      <Text style={styles.calendarIcon}>▣</Text>
                    </Pressable>

                    {/* Inline Valid From Calendar */}

                    {calendarTarget === 'from' ? (
                      <View style={styles.inlineCalendar}>
                        <View style={styles.inlineCalendarHeader}>
                          <Text style={styles.inlineCalendarTitle}>
                            Select valid-from date
                          </Text>

                          <Pressable
                            onPress={() => setCalendarTarget(null)}
                            hitSlop={6}
                          >
                            <Text style={styles.inlineCalendarClose}>×</Text>
                          </Pressable>
                        </View>

                        <Calendar
                          current={validFrom || undefined}
                          markedDates={
                            validFrom
                              ? {
                                  [validFrom]: {
                                    selected: true,
                                  },
                                }
                              : {}
                          }
                          onDayPress={day => {
                            const date = day?.dateString;

                            if (!date) {
                              return;
                            }

                            setValidFrom(date);

                            /*
                             * Clear end date when
                             * it becomes invalid.
                             */
                            if (validUntil && validUntil < date) {
                              setValidUntil('');
                            }

                            setCalendarTarget(null);
                          }}
                          theme={{
                            backgroundColor: COLORS.CARD,

                            calendarBackground: COLORS.CARD,

                            textSectionTitleColor: COLORS.MUTED,

                            selectedDayBackgroundColor: COLORS.BLUE,

                            selectedDayTextColor: COLORS.TEXT,

                            todayTextColor: COLORS.BLUE,

                            dayTextColor: COLORS.TEXT,

                            textDisabledColor: '#516077',

                            monthTextColor: COLORS.TEXT,

                            arrowColor: COLORS.BLUE,
                          }}
                        />
                      </View>
                    ) : null}
                  </View>

                  {/* Valid Through */}

                  <View
                    style={[
                      styles.formField,

                      isMobile && styles.formFieldMobile,
                    ]}
                  >
                    <Text style={styles.fieldLabel}>Valid through</Text>

                    <Pressable
                      disabled={saving}
                      onPress={() => {
                        setDiscountTypeOpen(false);

                        setCalendarTarget(previous =>
                          previous === 'until' ? null : 'until',
                        );
                      }}
                      style={({ pressed }) => [
                        styles.dateButton,

                        calendarTarget === 'until' && styles.dateButtonActive,

                        pressed && !saving && styles.buttonPressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dateButtonText,

                          !validUntil && styles.datePlaceholder,
                        ]}
                      >
                        {validUntil
                          ? formatDisplayDate(validUntil)
                          : 'dd/mm/yyyy'}
                      </Text>

                      <Text style={styles.calendarIcon}>▣</Text>
                    </Pressable>

                    {/* Inline Valid Through Calendar */}

                    {calendarTarget === 'until' ? (
                      <View style={styles.inlineCalendar}>
                        <View style={styles.inlineCalendarHeader}>
                          <Text style={styles.inlineCalendarTitle}>
                            Select valid-through date
                          </Text>

                          <Pressable
                            onPress={() => setCalendarTarget(null)}
                            hitSlop={6}
                          >
                            <Text style={styles.inlineCalendarClose}>×</Text>
                          </Pressable>
                        </View>

                        <Calendar
                          current={validUntil || validFrom || undefined}
                          minDate={validFrom || undefined}
                          markedDates={
                            validUntil
                              ? {
                                  [validUntil]: {
                                    selected: true,
                                  },
                                }
                              : {}
                          }
                          onDayPress={day => {
                            const date = day?.dateString;

                            if (!date) {
                              return;
                            }

                            if (validFrom && date < validFrom) {
                              Alert.alert(
                                'Billing Coupon',
                                'Valid-through date cannot be earlier than the valid-from date.',
                              );

                              return;
                            }

                            setValidUntil(date);

                            setCalendarTarget(null);
                          }}
                          theme={{
                            backgroundColor: COLORS.CARD,

                            calendarBackground: COLORS.CARD,

                            textSectionTitleColor: COLORS.MUTED,

                            selectedDayBackgroundColor: COLORS.BLUE,

                            selectedDayTextColor: COLORS.TEXT,

                            todayTextColor: COLORS.BLUE,

                            dayTextColor: COLORS.TEXT,

                            textDisabledColor: '#516077',

                            monthTextColor: COLORS.TEXT,

                            arrowColor: COLORS.BLUE,
                          }}
                        />
                      </View>
                    ) : null}
                  </View>
                </View>
              </ScrollView>

              {/* Footer */}

              <View
                style={[
                  styles.modalFooter,

                  isMobile && styles.modalFooterMobile,
                ]}
              >
                <Pressable
                  disabled={saving}
                  onPress={closeModal}
                  style={({ pressed }) => [
                    styles.secondaryButton,

                    isMobile && styles.mobileFooterButton,

                    pressed && !saving && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={saving}
                  onPress={handleSubmit}
                  style={({ pressed }) => [
                    styles.primaryButton,

                    isMobile && styles.mobileFooterButton,

                    saving && styles.buttonDisabled,

                    pressed && !saving && styles.buttonPressed,
                  ]}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={COLORS.TEXT} />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      {mode === 'edit' ? 'Save Changes' : 'Add Coupon'}
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

/*
 * --------------------------------
 * Main
 * --------------------------------
 */

export default function BillingCouponCodesSettings() {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [coupons, setCoupons] = useState([]);

  const [formVisible, setFormVisible] = useState(false);

  const [formMode, setFormMode] = useState('add');

  const [editingCoupon, setEditingCoupon] = useState(null);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const loadCoupons = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const response = await api('/api/settings/v1/billing-coupons', {
        method: 'GET',
      });

      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setCoupons(list.map(normalizeCoupon).filter(Boolean));
    } catch (error) {
      console.log('Billing coupons load error:', error);

      setLoadError(getErrorMessage(error, 'Could not load billing coupons.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  function openAdd() {
    setFormMode('add');

    setEditingCoupon(null);

    setFormVisible(true);
  }

  function openEdit(coupon) {
    setFormMode('edit');

    setEditingCoupon(coupon);

    setFormVisible(true);
  }

  async function handleSave(payload) {
    if (saving) {
      return;
    }

    try {
      setSaving(true);

      let response;

      if (formMode === 'edit' && editingCoupon?.id) {
        response = await api(
          `/api/settings/v1/billing-coupons/${editingCoupon.id}`,
          {
            method: 'PUT',

            body: JSON.stringify(payload),
          },
        );
      } else {
        response = await api('/api/settings/v1/billing-coupons', {
          method: 'POST',

          body: JSON.stringify(payload),
        });
      }

      if (!response?.id) {
        throw new Error('The server did not return the saved coupon.');
      }

      setFormVisible(false);

      setEditingCoupon(null);

      await loadCoupons();

      Alert.alert(
        formMode === 'edit' ? 'Coupon Updated' : 'Coupon Added',

        formMode === 'edit'
          ? 'The billing coupon has been updated successfully.'
          : 'The billing coupon has been added successfully.',
      );
    } catch (error) {
      console.log('Billing coupon save error:', error);

      Alert.alert(
        'Could not save coupon',
        getErrorMessage(error, 'The billing coupon could not be saved.'),
      );
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(coupon) {
    Alert.alert(
      'Delete Coupon',
      `Are you sure you want to delete "${coupon?.code || 'this coupon'}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: () => deleteCoupon(coupon),
        },
      ],
    );
  }

  async function deleteCoupon(coupon) {
    if (!coupon?.id || deletingId) {
      return;
    }

    try {
      setDeletingId(coupon.id);

      const response = await api(
        `/api/settings/v1/billing-coupons/${coupon.id}`,
        {
          method: 'DELETE',
        },
      );

      if (!response?.ok) {
        throw new Error('The server did not confirm coupon deletion.');
      }

      await loadCoupons();

      Alert.alert(
        'Coupon Deleted',
        'The billing coupon has been deleted successfully.',
      );
    } catch (error) {
      console.log('Billing coupon delete error:', error);

      Alert.alert(
        'Could not delete coupon',
        getErrorMessage(error, 'The billing coupon could not be deleted.'),
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />

          <Text style={styles.stateText}>Loading billing coupons...</Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Billing Coupon Codes</Text>

        <Text style={styles.errorText}>{loadError}</Text>

        <Pressable onPress={loadCoupons} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <View style={styles.section}>
        <View
          style={[styles.sectionHeader, isMobile && styles.sectionHeaderMobile]}
        >
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>Billing Coupon Codes</Text>

            <Text style={styles.description}>
              Create codes that families can enter while paying unpaid bills.
              Codes are valid through the selected date; delivery is managed
              outside the app.
            </Text>
          </View>

          <Pressable
            onPress={openAdd}
            style={({ pressed }) => [
              styles.primaryButton,

              isMobile && styles.addButtonMobile,

              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>+ Add Coupon</Text>
          </Pressable>
        </View>

        {coupons.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No coupon codes yet</Text>

            <Text style={styles.emptyStateText}>
              Create your first billing coupon to offer a payment discount.
            </Text>
          </View>
        ) : (
          <View style={styles.couponList}>
            {coupons.map(coupon => (
              <View
                key={coupon.id}
                style={[styles.couponCard, isMobile && styles.couponCardMobile]}
              >
                <View style={styles.couponInfo}>
                  <View style={styles.codeRow}>
                    <Text style={styles.couponCode}>{coupon.code}</Text>

                    <View style={styles.discountBadge}>
                      <Text style={styles.discountBadgeText}>
                        {formatDiscountValue(coupon)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.couponDates}>
                    From {formatDisplayDate(coupon.valid_from)} · Through{' '}
                    {formatDisplayDate(coupon.valid_until)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.couponActions,

                    isMobile && styles.couponActionsMobile,
                  ]}
                >
                  <Pressable
                    onPress={() => openEdit(coupon)}
                    style={({ pressed }) => [
                      styles.editButton,

                      isMobile && styles.actionButtonMobile,

                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.editButtonText}>✎ Edit</Text>
                  </Pressable>

                  <Pressable
                    disabled={deletingId === coupon.id}
                    onPress={() => confirmDelete(coupon)}
                    style={({ pressed }) => [
                      styles.deleteButton,

                      isMobile && styles.actionButtonMobile,

                      deletingId === coupon.id && styles.buttonDisabled,

                      pressed &&
                        deletingId !== coupon.id &&
                        styles.buttonPressed,
                    ]}
                  >
                    {deletingId === coupon.id ? (
                      <ActivityIndicator size="small" color={COLORS.TEXT} />
                    ) : (
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <CouponFormModal
        visible={formVisible}
        mode={formMode}
        coupon={editingCoupon}
        saving={saving}
        onClose={() => {
          if (saving) {
            return;
          }

          setFormVisible(false);

          setEditingCoupon(null);
        }}
        onSave={handleSave}
      />
    </>
  );
}
