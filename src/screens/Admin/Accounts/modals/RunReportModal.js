import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DatePickerModal from './DatePickerModal';

import {
  formatDisplayDate,
  getSevenDaysAgoIso,
  getTodayIso,
} from '../utils/accountsHelpers';

import styles from './RunReportModal.styles';

export default function RunReportModal({
  visible,
  submitting = false,
  initialDateFrom,
  initialDateTo,
  onClose,
  onSubmit,
}) {
  const [dateFrom, setDateFrom] = useState(getSevenDaysAgoIso());

  const [dateTo, setDateTo] = useState(getTodayIso());

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [calendarTarget, setCalendarTarget] = useState(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setDateFrom(initialDateFrom || getSevenDaysAgoIso());

    setDateTo(initialDateTo || getTodayIso());
  }, [visible, initialDateFrom, initialDateTo]);

  function openCalendar(target) {
    setCalendarTarget(target);
    setCalendarVisible(true);
  }

  function closeCalendar() {
    setCalendarVisible(false);
    setCalendarTarget(null);
  }

  function handleDayPress(day) {
    const value = day?.dateString;

    if (!value) {
      return;
    }

    if (calendarTarget === 'from') {
      setDateFrom(value);

      if (dateTo && value > dateTo) {
        setDateTo(value);
      }
    }

    if (calendarTarget === 'to') {
      setDateTo(value);

      if (dateFrom && value < dateFrom) {
        setDateFrom(value);
      }
    }

    closeCalendar();
  }

  function handleSubmit() {
    if (!dateFrom || !dateTo) {
      Alert.alert('Run Report', 'Please select both dates.');

      return;
    }

    if (dateFrom > dateTo) {
      Alert.alert('Run Report', 'Date from cannot be after Date to.');

      return;
    }

    onSubmit?.({
      report: 'trial-balance',
      dateFrom,
      dateTo,
    });
  }

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          if (!submitting) {
            onClose?.();
          }
        }}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>Run a report</Text>

                <Text style={styles.subtitle}>
                  Choose a report and date window, then inspect the latest
                  result below as a table.
                </Text>
              </View>

              <Pressable
                disabled={submitting}
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

            <View style={styles.content}>
              <Text style={styles.label}>Report</Text>

              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyText}>Trial balance</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Date from</Text>

                  <Pressable
                    onPress={() => openCalendar('from')}
                    style={styles.dateButton}
                  >
                    <Text style={styles.dateText}>
                      {formatDisplayDate(dateFrom)}
                    </Text>

                    <MaterialCommunityIcons
                      name="calendar-month-outline"
                      size={18}
                      color="#A8B6C9"
                    />
                  </Pressable>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Date to</Text>

                  <Pressable
                    onPress={() => openCalendar('to')}
                    style={styles.dateButton}
                  >
                    <Text style={styles.dateText}>
                      {formatDisplayDate(dateTo)}
                    </Text>

                    <MaterialCommunityIcons
                      name="calendar-month-outline"
                      size={18}
                      color="#A8B6C9"
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable
                  disabled={submitting}
                  onPress={onClose}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={submitting}
                  onPress={handleSubmit}
                  style={[
                    styles.submitButton,

                    submitting && styles.disabledButton,
                  ]}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons
                      name="file-chart-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                  )}

                  <Text style={styles.submitText}>
                    {submitting ? 'Running...' : 'Post report request'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <DatePickerModal
        visible={calendarVisible}
        title="Select Date"
        subtitle={
          calendarTarget === 'from'
            ? 'Select starting date'
            : 'Select ending date'
        }
        selectedDate={calendarTarget === 'from' ? dateFrom : dateTo}
        minDate={calendarTarget === 'to' ? dateFrom || undefined : undefined}
        maxDate={calendarTarget === 'from' ? dateTo || undefined : undefined}
        onClose={closeCalendar}
        onDayPress={handleDayPress}
      />
    </>
  );
}
