import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DatePickerModal from './DatePickerModal';

import { formatDisplayDate } from '../utils/accountsHelpers';

import styles from './EditFinanceSettingsModal.styles';

export default function EditFinanceSettingsModal({
  visible,
  settings,
  submitting = false,
  reloading = false,
  onClose,
  onSubmit,
  onReload,
}) {
  const [organizationName, setOrganizationName] = useState('');

  const [currencyCode, setCurrencyCode] = useState('INR');

  const [currencySymbol, setCurrencySymbol] = useState('₹');

  const [fiscalYearStart, setFiscalYearStart] = useState('01-01');

  const [postingLockDate, setPostingLockDate] = useState('');

  const [closedThroughDate, setClosedThroughDate] = useState('');

  const [correctionMethod, setCorrectionMethod] = useState(
    'reversal_and_replacement',
  );

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [calendarTarget, setCalendarTarget] = useState(null);

  function populateForm(data) {
    setOrganizationName(data?.organization_name || '');

    setCurrencyCode(data?.currency_code || 'INR');

    setCurrencySymbol(data?.currency_symbol || '₹');

    setFiscalYearStart(data?.fiscal_year_start || '01-01');

    setPostingLockDate(data?.posting_lock_date || '');

    setClosedThroughDate(data?.closed_through_date || '');

    setCorrectionMethod(
      data?.journal_correction_method || 'reversal_and_replacement',
    );
  }

  useEffect(() => {
    if (!visible) {
      return;
    }

    populateForm(settings);
  }, [visible, settings]);

  function openCalendar(target) {
    setCalendarTarget(target);
    setCalendarVisible(true);
  }

  function closeCalendar() {
    setCalendarVisible(false);
    setCalendarTarget(null);
  }

  function handleDateSelect(day) {
    const value = day?.dateString;

    if (!value) {
      return;
    }

    if (calendarTarget === 'posting_lock') {
      setPostingLockDate(value);
    }

    if (calendarTarget === 'closed_through') {
      setClosedThroughDate(value);
    }

    closeCalendar();
  }

  async function handleReload() {
    const result = await onReload?.();

    if (result) {
      populateForm(result);
    }
  }

  function validateFiscalYearStart(value) {
    const match = /^(\d{2})-(\d{2})$/.exec(value);

    if (!match) {
      return false;
    }

    const month = Number(match[1]);

    const day = Number(match[2]);

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }

    return true;
  }

  function handleSubmit() {
    const cleanCurrencyCode = currencyCode.trim().toUpperCase();

    const cleanCurrencySymbol = currencySymbol.trim();

    const cleanFiscalYearStart = fiscalYearStart.trim();

    if (!cleanCurrencyCode) {
      Alert.alert('Finance Settings', 'Currency code is required.');

      return;
    }

    if (!cleanCurrencySymbol) {
      Alert.alert('Finance Settings', 'Currency symbol is required.');

      return;
    }

    if (!validateFiscalYearStart(cleanFiscalYearStart)) {
      Alert.alert(
        'Finance Settings',
        'Fiscal year start must use MM-DD format.',
      );

      return;
    }

    onSubmit?.({
      organization_name: organizationName.trim() || null,

      currency_code: cleanCurrencyCode,

      currency_symbol: cleanCurrencySymbol,

      fiscal_year_start: cleanFiscalYearStart,

      posting_lock_date: postingLockDate || null,

      closed_through_date: closedThroughDate || null,

      journal_correction_method: correctionMethod,
    });
  }

  const selectedCalendarDate =
    calendarTarget === 'posting_lock' ? postingLockDate : closedThroughDate;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          if (!submitting && !reloading) {
            onClose?.();
          }
        }}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>Finance settings</Text>

                <Text style={styles.subtitle}>
                  Save the basic controls your organization will use daily.
                </Text>
              </View>

              <Pressable
                disabled={submitting || reloading}
                onPress={onClose}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.content}
            >
              <Text style={styles.label}>Organization name</Text>

              <TextInput
                value={organizationName}
                onChangeText={setOrganizationName}
                placeholder="Organization name"
                placeholderTextColor="#718096"
                style={styles.input}
              />

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Currency code</Text>

                  <TextInput
                    value={currencyCode}
                    onChangeText={setCurrencyCode}
                    autoCapitalize="characters"
                    placeholder="INR"
                    placeholderTextColor="#718096"
                    style={styles.input}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Currency symbol</Text>

                  <TextInput
                    value={currencySymbol}
                    onChangeText={setCurrencySymbol}
                    placeholder="₹"
                    placeholderTextColor="#718096"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Fiscal year start (MM-DD)</Text>

                  <TextInput
                    value={fiscalYearStart}
                    onChangeText={setFiscalYearStart}
                    placeholder="01-01"
                    placeholderTextColor="#718096"
                    style={styles.input}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Posting lock date</Text>

                  <View style={styles.dateRow}>
                    <Pressable
                      onPress={() => openCalendar('posting_lock')}
                      style={styles.dateButton}
                    >
                      <Text
                        style={[
                          styles.dateText,

                          !postingLockDate && styles.placeholder,
                        ]}
                      >
                        {postingLockDate
                          ? formatDisplayDate(postingLockDate)
                          : 'dd-mm-yyyy'}
                      </Text>

                      <MaterialCommunityIcons
                        name="calendar-month-outline"
                        size={18}
                        color="#A8B6C9"
                      />
                    </Pressable>

                    {!!postingLockDate && (
                      <Pressable
                        onPress={() => setPostingLockDate('')}
                        style={styles.clearDateButton}
                      >
                        <MaterialCommunityIcons
                          name="close"
                          size={17}
                          color="#F1F5F9"
                        />
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>

              <Text style={styles.label}>Closed through date</Text>

              <View style={styles.dateRow}>
                <Pressable
                  onPress={() => openCalendar('closed_through')}
                  style={styles.dateButton}
                >
                  <Text
                    style={[
                      styles.dateText,

                      !closedThroughDate && styles.placeholder,
                    ]}
                  >
                    {closedThroughDate
                      ? formatDisplayDate(closedThroughDate)
                      : 'dd-mm-yyyy'}
                  </Text>

                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={18}
                    color="#A8B6C9"
                  />
                </Pressable>

                {!!closedThroughDate && (
                  <Pressable
                    onPress={() => setClosedThroughDate('')}
                    style={styles.clearDateButton}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={17}
                      color="#F1F5F9"
                    />
                  </Pressable>
                )}
              </View>

              <Text style={styles.label}>Journal rectification method</Text>

              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyText}>
                  Create reversal and replacement entries (recommended)
                </Text>
              </View>

              <Text style={styles.helpText}>
                Direct amendment requires a reason and retains a before/after
                audit record. Locked or closed periods still require reversal
                and replacement.
              </Text>

              <View style={styles.actions}>
                <Pressable
                  disabled={submitting || reloading}
                  onPress={handleReload}
                  style={styles.secondaryButton}
                >
                  {reloading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons
                      name="reload"
                      size={17}
                      color="#FFFFFF"
                    />
                  )}

                  <Text style={styles.secondaryButtonText}>Reload</Text>
                </Pressable>

                <Pressable
                  disabled={submitting || reloading}
                  onPress={onClose}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={submitting || reloading}
                  onPress={handleSubmit}
                  style={[
                    styles.submitButton,

                    (submitting || reloading) && styles.buttonDisabled,
                  ]}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons
                      name="content-save-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                  )}

                  <Text style={styles.submitButtonText}>
                    {submitting ? 'Posting...' : 'Post finance settings'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <DatePickerModal
        visible={calendarVisible}
        title={
          calendarTarget === 'posting_lock'
            ? 'Posting Lock Date'
            : 'Closed Through Date'
        }
        selectedDate={selectedCalendarDate || undefined}
        onClose={closeCalendar}
        onDayPress={handleDateSelect}
      />
    </>
  );
}
