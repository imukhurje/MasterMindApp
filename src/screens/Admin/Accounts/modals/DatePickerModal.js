import React from 'react';

import { Modal, Pressable, Text, View } from 'react-native';

import { Calendar } from 'react-native-calendars';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './DatePickerModal.styles';

export default function DatePickerModal({
  visible,
  title = 'Select Date',
  subtitle,
  selectedDate,
  minDate,
  maxDate,
  onClose,
  onDayPress,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.calendarBackdrop}>
        <View style={styles.calendarModal}>
          <View style={styles.calendarHeader}>
            <View style={styles.headerText}>
              <Text style={styles.calendarTitle}>{title}</Text>

              {!!subtitle && (
                <Text style={styles.calendarSubtitle}>{subtitle}</Text>
              )}
            </View>

            <Pressable onPress={onClose} style={styles.calendarClose}>
              <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <Calendar
            current={selectedDate}
            minDate={minDate}
            maxDate={maxDate}
            onDayPress={onDayPress}
            markedDates={
              selectedDate
                ? {
                    [selectedDate]: {
                      selected: true,
                      selectedColor: '#2563EB',
                    },
                  }
                : {}
            }
            enableSwipeMonths
            theme={{
              calendarBackground: '#0B1A2E',

              textSectionTitleColor: '#A8B6C9',

              selectedDayBackgroundColor: '#2563EB',
              selectedDayTextColor: '#FFFFFF',

              todayTextColor: '#7DD3FC',

              dayTextColor: '#F1F5F9',

              textDisabledColor: '#52647A',

              monthTextColor: '#F1F5F9',

              arrowColor: '#7DD3FC',

              textDayFontWeight: '600',
              textMonthFontWeight: '900',
              textDayHeaderFontWeight: '700',
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
