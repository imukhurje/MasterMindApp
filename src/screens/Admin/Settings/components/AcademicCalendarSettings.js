import React, { useCallback, useEffect, useMemo, useState } from 'react';

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

import { api } from '../../../../api/client';

import { COLORS, styles } from './AcademicCalendarSettings.styles';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_SHORT_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function pad2(value) {
  return String(value).padStart(2, '0');
}

function getDateOnly(value) {
  if (!value) {
    return '';
  }

  return String(value).slice(0, 10);
}

function getSettingValue(response, key) {
  const items = Array.isArray(response?.items) ? response.items : [];

  return items.find(item => item?.key === key)?.value;
}

function normalizeHoliday(item) {
  const date = getDateOnly(item?.date);

  if (!date) {
    return null;
  }

  const parts = date.split('-');

  if (parts.length !== 3) {
    return null;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return null;
  }

  return {
    ...item,

    date,
    year,
    month,
    day,

    repeats_annually: Boolean(item?.repeats_annually),
  };
}

function normalizeHolidays(response) {
  if (!Array.isArray(response)) {
    return [];
  }

  return response.map(normalizeHoliday).filter(Boolean);
}

function createCalendarCells(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1);

  /*
   * Convert:
   * Sunday = 0
   * Monday = 1
   *
   * Into:
   * Monday = 0
   * Sunday = 6
   */
  const mondayOffset = (firstDay.getDay() + 6) % 7;

  const gridStart = new Date(year, monthIndex, 1 - mondayOffset);

  const cells = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);

    date.setDate(gridStart.getDate() + index);

    const cellYear = date.getFullYear();

    const cellMonth = date.getMonth();

    const cellDay = date.getDate();

    cells.push({
      key: `${cellYear}-` + `${pad2(cellMonth + 1)}-` + `${pad2(cellDay)}`,

      year: cellYear,

      monthIndex: cellMonth,

      month: cellMonth + 1,

      day: cellDay,

      isCurrentMonth: cellMonth === monthIndex && cellYear === year,
    });
  }

  return cells;
}

function getHolidaysForCell(holidays, cell) {
  return holidays.filter(holiday => {
    if (holiday.repeats_annually) {
      return holiday.month === cell.month && holiday.day === cell.day;
    }

    return (
      holiday.year === cell.year &&
      holiday.month === cell.month &&
      holiday.day === cell.day
    );
  });
}

function formatSelectedDate(cell) {
  if (!cell) {
    return '';
  }

  const date = new Date(cell.year, cell.monthIndex, cell.day);

  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
    date.getDay()
  ];

  return (
    `${weekday}, ` +
    `${cell.day} ` +
    `${MONTH_SHORT_NAMES[cell.monthIndex]} ` +
    `${cell.year}`
  );
}

export default function AcademicCalendarSettings() {
  const now = new Date();

  const [visibleYear, setVisibleYear] = useState(now.getFullYear());

  const [visibleMonth, setVisibleMonth] = useState(now.getMonth());

  const [academicYearStart, setAcademicYearStart] = useState('');

  const [holidays, setHolidays] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [selectedCell, setSelectedCell] = useState(null);

  const [datePanelVisible, setDatePanelVisible] = useState(false);

  const [holidayName, setHolidayName] = useState('');

  const [holidayRepeats, setHolidayRepeats] = useState(false);

  const [savingAcademicStart, setSavingAcademicStart] = useState(false);

  const [savingHoliday, setSavingHoliday] = useState(false);

  const [deletingHolidayId, setDeletingHolidayId] = useState(null);

  const loadCalendarData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');

      const [settingsResponse, holidaysResponse] = await Promise.all([
        api('/api/settings/v1?keys=academic_year_start', {
          method: 'GET',
        }),

        api('/api/calendar/v1/holidays', {
          method: 'GET',
        }),
      ]);

      const academicStart = getSettingValue(
        settingsResponse,
        'academic_year_start',
      );

      setAcademicYearStart(
        typeof academicStart === 'string' ? academicStart : '',
      );

      setHolidays(normalizeHolidays(holidaysResponse));
    } catch (error) {
      console.log('Academic calendar load error:', error);

      setLoadError(error?.message || 'Could not load the academic calendar.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  const calendarCells = useMemo(
    () => createCalendarCells(visibleYear, visibleMonth),
    [visibleYear, visibleMonth],
  );

  const selectedHolidays = useMemo(() => {
    if (!selectedCell) {
      return [];
    }

    return getHolidaysForCell(holidays, selectedCell);
  }, [holidays, selectedCell]);

  const selectedIsAcademicStart = Boolean(
    selectedCell && academicYearStart && selectedCell.key === academicYearStart,
  );

  function goPreviousMonth() {
    if (visibleMonth === 0) {
      setVisibleMonth(11);

      setVisibleYear(previous => previous - 1);

      return;
    }

    setVisibleMonth(previous => previous - 1);
  }

  function goNextMonth() {
    if (visibleMonth === 11) {
      setVisibleMonth(0);

      setVisibleYear(previous => previous + 1);

      return;
    }

    setVisibleMonth(previous => previous + 1);
  }

  function handleDayPress(cell) {
    setSelectedCell(cell);

    setHolidayName('');

    setHolidayRepeats(false);

    setDatePanelVisible(true);
  }

  async function handleAcademicStartToggle() {
    if (!selectedCell || savingAcademicStart) {
      return;
    }

    try {
      setSavingAcademicStart(true);

      /*
       * If this date is already the academic
       * year start, uncheck it.
       */
      if (selectedIsAcademicStart) {
        const response = await api('/api/settings/v1/academic-year-start', {
          method: 'PUT',

          body: JSON.stringify({
            date: null,
          }),
        });

        if (!response?.ok) {
          throw new Error('The server did not confirm the update.');
        }

        setAcademicYearStart('');

        return;
      }

      /*
       * Set the selected date as the
       * academic year start.
       */
      const response = await api('/api/settings/v1/academic-year-start', {
        method: 'PUT',

        body: JSON.stringify({
          date: selectedCell.key,
        }),
      });

      if (!response?.ok) {
        throw new Error('The server did not confirm the update.');
      }

      setAcademicYearStart(
        typeof response?.value === 'string' ? response.value : selectedCell.key,
      );
    } catch (error) {
      console.log('Academic year start update error:', error);

      Alert.alert(
        'Could not update academic year',
        error?.message || 'The academic year start date could not be updated.',
      );
    } finally {
      setSavingAcademicStart(false);
    }
  }

  async function handleAddHoliday() {
    if (!selectedCell || savingHoliday) {
      return;
    }

    const name = holidayName.trim();

    if (!name) {
      Alert.alert('Holiday Name Required', 'Please enter a holiday name.');

      return;
    }

    try {
      setSavingHoliday(true);

      const payload = {
        date: selectedCell.key,

        name,

        repeats_annually: Boolean(holidayRepeats),
      };

      console.log('Add holiday payload:', payload);

      const response = await api('/api/calendar/v1/holiday', {
        method: 'POST',

        body: JSON.stringify(payload),
      });

      if (!response?.id) {
        throw new Error('The server did not return the created holiday.');
      }

      const createdHoliday = normalizeHoliday(response);

      if (createdHoliday) {
        setHolidays(previous => [...previous, createdHoliday]);
      }

      setHolidayName('');
      setHolidayRepeats(false);

      Alert.alert('Holiday Added', 'The holiday has been added successfully.');
    } catch (error) {
      console.log('Add holiday error:', error);

      Alert.alert(
        'Could not add holiday',
        error?.message || 'The holiday could not be added.',
      );
    } finally {
      setSavingHoliday(false);
    }
  }

  function handleDeleteHoliday(holiday) {
    if (!holiday?.id || deletingHolidayId !== null) {
      return;
    }

    Alert.alert(
      'Delete Holiday',
      `Are you sure you want to delete "${holiday?.name || 'this holiday'}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            try {
              setDeletingHolidayId(holiday.id);

              const response = await api(
                `/api/calendar/v1/holiday/${holiday.id}`,
                {
                  method: 'DELETE',
                },
              );

              if (!response?.ok) {
                throw new Error(
                  'The server did not confirm the holiday deletion.',
                );
              }

              setHolidays(previous =>
                previous.filter(
                  item => String(item?.id) !== String(holiday.id),
                ),
              );
            } catch (error) {
              console.log('Delete holiday error:', error);

              Alert.alert(
                'Could not delete holiday',
                error?.message || 'The holiday could not be deleted.',
              );
            } finally {
              setDeletingHolidayId(null);
            }
          },
        },
      ],
    );
  }

  if (loading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color={COLORS.BLUE} />

        <Text style={styles.stateText}>Loading academic calendar...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.errorTitle}>Could not load academic calendar</Text>

        <Text style={styles.errorDescription}>{loadError}</Text>

        <Pressable
          onPress={loadCalendarData}
          style={({ pressed }) => [
            styles.retryButton,

            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Text style={styles.description}>
            View the academic calendar. Admins can set the start date and mark
            holidays.
          </Text>

          {academicYearStart ? (
            <View style={styles.startBadge}>
              <Text style={styles.startBadgeText}>
                Start: {academicYearStart}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Pressable
              onPress={goPreviousMonth}
              style={({ pressed }) => [
                styles.navButton,

                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.navButtonText}>←</Text>
            </Pressable>

            <Text style={styles.monthTitle}>
              {MONTH_NAMES[visibleMonth]} {visibleYear}
            </Text>

            <Pressable
              onPress={goNextMonth}
              style={({ pressed }) => [
                styles.navButton,

                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.navButtonText}>→</Text>
            </Pressable>
          </View>

          <View style={styles.weekHeader}>
            {WEEK_DAYS.map(day => (
              <View key={day} style={styles.weekHeaderCell}>
                <Text style={styles.weekHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarCells.map(cell => {
              const cellHolidays = getHolidaysForCell(holidays, cell);

              const isAcademicStart = Boolean(
                academicYearStart && cell.key === academicYearStart,
              );

              return (
                <Pressable
                  key={cell.key}
                  onPress={() => handleDayPress(cell)}
                  style={({ pressed }) => [
                    styles.dayCell,

                    !cell.isCurrentMonth && styles.dayCellOutside,

                    pressed && styles.dayCellPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayNumber,

                      !cell.isCurrentMonth && styles.dayNumberOutside,
                    ]}
                  >
                    {cell.day}
                  </Text>

                  {isAcademicStart ? (
                    <View style={styles.academicStartBadge}>
                      <Text style={styles.academicStartText} numberOfLines={2}>
                        Academic Year Start
                      </Text>
                    </View>
                  ) : null}

                  {cellHolidays.length > 0 ? (
                    <View style={styles.holidaysContainer}>
                      {cellHolidays.slice(0, 2).map(holiday => (
                        <View key={holiday.id} style={styles.holidayBadge}>
                          <Text style={styles.holidayText} numberOfLines={1}>
                            {holiday.name}
                          </Text>
                        </View>
                      ))}

                      {cellHolidays.length > 2 ? (
                        <Text style={styles.moreHolidaysText}>
                          +{cellHolidays.length - 2} more
                        </Text>
                      ) : null}
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Selected Date Panel */}

      <Modal
        visible={datePanelVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setDatePanelVisible(false)}
      >
        <View style={styles.datePanelOverlay}>
          <View style={styles.datePanel}>
            <View style={styles.datePanelHeader}>
              <Text style={styles.datePanelTitle}>
                {formatSelectedDate(selectedCell)}
              </Text>

              <Pressable
                onPress={() => setDatePanelVisible(false)}
                style={({ pressed }) => [
                  styles.panelCloseIcon,

                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.panelCloseIconText}>×</Text>
              </Pressable>
            </View>

            <Text style={styles.datePanelSummary}>
              {selectedHolidays.length === 0
                ? 'No holidays on this date.'
                : `${selectedHolidays.length} holiday${
                    selectedHolidays.length > 1 ? 's' : ''
                  } on this date.`}
            </Text>

            {/* Academic year start */}

            <Pressable
              onPress={handleAcademicStartToggle}
              disabled={savingAcademicStart}
              style={({ pressed }) => [
                styles.academicToggleRow,

                pressed && !savingAcademicStart && styles.buttonPressed,
              ]}
            >
              <View
                style={[
                  styles.checkbox,

                  selectedIsAcademicStart && styles.checkboxChecked,
                ]}
              >
                {savingAcademicStart ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT} />
                ) : selectedIsAcademicStart ? (
                  <Text style={styles.checkboxTick}>✓</Text>
                ) : null}
              </View>

              <Text style={styles.academicToggleText}>
                Set as Start of the Academic Calendar
              </Text>
            </Pressable>

            <View style={styles.panelDivider} />

            <Text style={styles.panelSectionTitle}>Holidays</Text>

            {/* Existing holidays */}

            {selectedHolidays.length > 0 ? (
              <View style={styles.existingHolidays}>
                {selectedHolidays.map(holiday => (
                  <View key={holiday.id} style={styles.holidayRow}>
                    <View style={styles.holidayRowInfo}>
                      <Text style={styles.holidayRowName}>{holiday.name}</Text>

                      <Text style={styles.holidayRowMeta}>
                        {holiday.repeats_annually
                          ? 'Repeats every year'
                          : 'One-time holiday'}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => handleDeleteHoliday(holiday)}
                      disabled={deletingHolidayId !== null}
                      style={({ pressed }) => [
                        styles.deleteHolidayButton,

                        pressed &&
                          deletingHolidayId === null &&
                          styles.buttonPressed,

                        deletingHolidayId !== null && styles.buttonDisabled,
                      ]}
                    >
                      {String(deletingHolidayId) === String(holiday.id) ? (
                        <ActivityIndicator size="small" color={COLORS.TEXT} />
                      ) : (
                        <Text style={styles.deleteHolidayText}>🗑</Text>
                      )}
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noHolidayText}>
                No holidays on this date.
              </Text>
            )}

            {/* Add holiday */}

            <View style={styles.addHolidayArea}>
              <TextInput
                value={holidayName}
                onChangeText={setHolidayName}
                editable={!savingHoliday}
                placeholder="Holiday name"
                placeholderTextColor={COLORS.MUTED}
                style={styles.holidayInput}
              />

              <Pressable
                onPress={() => setHolidayRepeats(previous => !previous)}
                disabled={savingHoliday}
                style={styles.repeatRow}
              >
                <View
                  style={[
                    styles.smallCheckbox,

                    holidayRepeats && styles.checkboxChecked,
                  ]}
                >
                  {holidayRepeats ? (
                    <Text style={styles.smallCheckboxTick}>✓</Text>
                  ) : null}
                </View>

                <Text style={styles.repeatText}>Repeats every year</Text>
              </Pressable>

              <Pressable
                onPress={handleAddHoliday}
                disabled={savingHoliday || !holidayName.trim()}
                style={({ pressed }) => [
                  styles.addHolidayButton,

                  pressed &&
                    !savingHoliday &&
                    holidayName.trim() &&
                    styles.buttonPressed,

                  (savingHoliday || !holidayName.trim()) &&
                    styles.buttonDisabled,
                ]}
              >
                {savingHoliday ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT} />
                ) : (
                  <Text style={styles.addHolidayButtonText}>+ Add Holiday</Text>
                )}
              </Pressable>
            </View>

            <Pressable
              onPress={() => setDatePanelVisible(false)}
              style={({ pressed }) => [
                styles.closePanelButton,

                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.closePanelButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
