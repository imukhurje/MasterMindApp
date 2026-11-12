import React, { useEffect, useMemo, useState } from 'react';

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

import { Calendar } from 'react-native-calendars';

import { COLORS, styles } from './EventModal.styles';

function getDateOnly(value) {
  if (!value) {
    return '';
  }

  return String(value).slice(0, 10);
}

function formatDisplayDate(value) {
  const date = getDateOnly(value);

  if (!date) {
    return 'dd/mm/yyyy';
  }

  const parts = date.split('-');

  if (parts.length !== 3) {
    return date;
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export default function EventModal({
  visible,
  mode = 'add',
  event = null,
  academicYear,
  saving = false,
  onClose,
  onSave,
}) {
  const isEdit = mode === 'edit';

  const [name, setName] = useState('');

  const [startDate, setStartDate] = useState('');

  const [endDate, setEndDate] = useState('');

  const [calendarType, setCalendarType] = useState(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setCalendarType(null);

    if (isEdit && event) {
      setName(String(event?.name || ''));

      setStartDate(getDateOnly(event?.start_date));

      setEndDate(getDateOnly(event?.end_date));

      return;
    }

    setName('');

    /*
     * For a new event use today's date
     * when it falls inside the academic year.
     */
    const today = new Date().toISOString().slice(0, 10);

    const academicStart = getDateOnly(academicYear?.start);

    const academicEnd = getDateOnly(academicYear?.end);

    const defaultDate =
      academicStart &&
      academicEnd &&
      today >= academicStart &&
      today <= academicEnd
        ? today
        : academicStart || today;

    setStartDate(defaultDate);

    setEndDate(defaultDate);
  }, [visible, isEdit, event, academicYear]);

  const cleanName = name.trim();

  const invalidRange = Boolean(startDate && endDate && endDate < startDate);

  const outsideAcademicYear = useMemo(() => {
    const academicStart = getDateOnly(academicYear?.start);

    const academicEnd = getDateOnly(academicYear?.end);

    if (!academicStart || !academicEnd) {
      return false;
    }

    return startDate < academicStart || endDate > academicEnd;
  }, [academicYear, startDate, endDate]);

  function handleSubmit() {
    if (!cleanName) {
      Alert.alert('Event Name Required', 'Please enter an event name.');

      return;
    }

    if (!startDate || !endDate) {
      Alert.alert('Date Required', 'Please select both start and end dates.');

      return;
    }

    if (invalidRange) {
      Alert.alert(
        'Invalid Date Range',
        'End date cannot be before start date.',
      );

      return;
    }

    if (outsideAcademicYear) {
      Alert.alert(
        'Outside Academic Year',
        'The event dates must fall within the current academic year.',
      );

      return;
    }

    onSave?.({
      name: cleanName,

      start_date: startDate,

      end_date: endDate,
    });
  }

  function handleCalendarDate(date) {
    if (calendarType === 'start') {
      setStartDate(date.dateString);

      if (endDate && endDate < date.dateString) {
        setEndDate(date.dateString);
      }
    } else if (calendarType === 'end') {
      setEndDate(date.dateString);
    }

    setCalendarType(null);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        if (!saving) {
          onClose?.();
        }
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEdit ? 'Edit Event' : 'New Event'}
            </Text>

            <Pressable
              onPress={onClose}
              disabled={saving}
              style={({ pressed }) => [
                styles.closeButton,

                pressed && !saving && styles.buttonPressed,

                saving && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Event Name</Text>

              <TextInput
                value={name}
                onChangeText={setName}
                editable={!saving}
                placeholder="Event name"
                placeholderTextColor={COLORS.MUTED}
                style={styles.textInput}
              />
            </View>

            <View style={styles.dateFieldsRow}>
              <View style={styles.dateFieldGroup}>
                <Text style={styles.label}>Start Date</Text>

                <Pressable
                  onPress={() => setCalendarType('start')}
                  disabled={saving}
                  style={({ pressed }) => [
                    styles.dateButton,

                    pressed && !saving && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDisplayDate(startDate)}
                  </Text>

                  <Text style={styles.calendarIcon}>▣</Text>
                </Pressable>
              </View>

              <View style={styles.dateFieldGroup}>
                <Text style={styles.label}>End Date</Text>

                <Pressable
                  onPress={() => setCalendarType('end')}
                  disabled={saving}
                  style={({ pressed }) => [
                    styles.dateButton,

                    pressed && !saving && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDisplayDate(endDate)}
                  </Text>

                  <Text style={styles.calendarIcon}>▣</Text>
                </Pressable>
              </View>
            </View>

            {invalidRange ? (
              <Text style={styles.errorText}>
                End date cannot be before start date.
              </Text>
            ) : null}

            {outsideAcademicYear ? (
              <Text style={styles.errorText}>
                Event must be within {academicYear?.start} → {academicYear?.end}
                .
              </Text>
            ) : null}

            {calendarType ? (
              <View style={styles.calendarContainer}>
                <View style={styles.calendarHeader}>
                  <Text style={styles.calendarTitle}>
                    Select {calendarType === 'start' ? 'Start' : 'End'} Date
                  </Text>

                  <Pressable onPress={() => setCalendarType(null)}>
                    <Text style={styles.calendarClose}>×</Text>
                  </Pressable>
                </View>

                <Calendar
                  current={calendarType === 'start' ? startDate : endDate}
                  minDate={
                    calendarType === 'end'
                      ? startDate || academicYear?.start
                      : academicYear?.start
                  }
                  maxDate={academicYear?.end}
                  markedDates={{
                    [calendarType === 'start' ? startDate : endDate]: {
                      selected: true,
                    },
                  }}
                  onDayPress={handleCalendarDate}
                  theme={{
                    backgroundColor: COLORS.CARD,
                    calendarBackground: COLORS.CARD,
                    textSectionTitleColor: COLORS.MUTED,
                    selectedDayBackgroundColor: COLORS.BLUE,
                    selectedDayTextColor: COLORS.TEXT,
                    todayTextColor: COLORS.BLUE,
                    dayTextColor: COLORS.TEXT,
                    textDisabledColor: '#506077',
                    monthTextColor: COLORS.TEXT,
                    arrowColor: COLORS.BLUE,
                  }}
                />
              </View>
            ) : null}

            <View style={styles.actions}>
              <Pressable
                onPress={onClose}
                disabled={saving}
                style={({ pressed }) => [
                  styles.cancelButton,

                  pressed && !saving && styles.buttonPressed,

                  saving && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                disabled={
                  saving || !cleanName || invalidRange || outsideAcademicYear
                }
                style={({ pressed }) => [
                  styles.saveButton,

                  pressed &&
                    !saving &&
                    cleanName &&
                    !invalidRange &&
                    !outsideAcademicYear &&
                    styles.buttonPressed,

                  (saving ||
                    !cleanName ||
                    invalidRange ||
                    outsideAcademicYear) &&
                    styles.buttonDisabled,
                ]}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT} />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {isEdit ? 'Save Changes' : 'Save'}
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
