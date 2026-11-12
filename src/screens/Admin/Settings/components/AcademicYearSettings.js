import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Calendar } from 'react-native-calendars';

import { api } from '../../../../api/client';

import { COLORS, styles } from './AcademicYearSettings.styles';

function formatDisplayDate(value) {
  if (!value) {
    return '';
  }

  const parts = String(value).split('-');

  if (parts.length !== 3) {
    return value;
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
}

function getApiErrorMessage(error) {
  const startsOnError =
    error?.errors?.starts_on?.[0] || error?.payload?.errors?.starts_on?.[0];

  if (startsOnError) {
    return startsOnError;
  }

  const labelError =
    error?.errors?.label?.[0] || error?.payload?.errors?.label?.[0];

  if (labelError) {
    return labelError;
  }

  return error?.message || 'The academic year could not be saved.';
}

function getStatusLabel(year) {
  const status = String(year?.status || '').toLowerCase();

  if (status === 'closed') {
    return 'Past';
  }

  if (status === 'planned') {
    return 'Planned';
  }

  if (status === 'current') {
    return 'Current';
  }

  return year?.status || '';
}

export default function AcademicYearSettings() {
  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [currentYear, setCurrentYear] = useState(null);

  const [years, setYears] = useState([]);

  const [currentLabel, setCurrentLabel] = useState('');

  const [currentStartDate, setCurrentStartDate] = useState('');

  const [savedCurrentLabel, setSavedCurrentLabel] = useState('');

  const [savedCurrentStartDate, setSavedCurrentStartDate] = useState('');

  const [savingCurrent, setSavingCurrent] = useState(false);

  /*
   * Future Academic Year
   */
  const [futureModalVisible, setFutureModalVisible] = useState(false);

  const [futureLabel, setFutureLabel] = useState('');

  const [futureStartDate, setFutureStartDate] = useState('');

  const [creatingFuture, setCreatingFuture] = useState(false);

  /*
   * Edit existing past/planned year
   */
  const [editYear, setEditYear] = useState(null);

  const [editLabel, setEditLabel] = useState('');

  const [editStartDate, setEditStartDate] = useState('');

  const [savingEdit, setSavingEdit] = useState(false);

  /*
   * Calendar target:
   * current | future | edit
   */
  const [calendarTarget, setCalendarTarget] = useState(null);

  const loadAcademicYears = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const response = await api('/api/settings/v1/academic-years', {
        method: 'GET',
      });

      const current = response?.current || null;

      const allYears = Array.isArray(response?.years) ? response.years : [];

      setCurrentYear(current);

      setYears(allYears);

      const label = String(current?.label || '');

      const startDate = String(current?.starts_on || '');

      setCurrentLabel(label);

      setSavedCurrentLabel(label);

      setCurrentStartDate(startDate);

      setSavedCurrentStartDate(startDate);
    } catch (error) {
      console.log('Academic years load error:', error);

      setLoadError(error?.message || 'Could not load academic years.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAcademicYears();
  }, [loadAcademicYears]);

  const currentChanged = useMemo(() => {
    return (
      currentLabel.trim() !== savedCurrentLabel.trim() ||
      currentStartDate !== savedCurrentStartDate
    );
  }, [
    currentLabel,
    savedCurrentLabel,
    currentStartDate,
    savedCurrentStartDate,
  ]);

  const otherYears = useMemo(() => {
    return years.filter(year => String(year?.id) !== String(currentYear?.id));
  }, [years, currentYear]);

  async function handleSaveCurrent() {
    if (!currentYear?.id || savingCurrent) {
      return;
    }

    const label = currentLabel.trim();

    if (!label) {
      Alert.alert('Academic Year', 'Please enter a label.');

      return;
    }

    if (currentYear?.can_edit_start && !currentStartDate) {
      Alert.alert('Academic Year', 'Please select a start date.');

      return;
    }

    const payload = {
      label,
    };

    if (currentYear?.can_edit_start) {
      payload.starts_on = currentStartDate;
    }

    try {
      setSavingCurrent(true);

      const response = await api(
        `/api/settings/v1/academic-years/${currentYear.id}`,
        {
          method: 'PUT',

          body: JSON.stringify(payload),
        },
      );

      const item = response?.item;

      if (!item) {
        throw new Error('The server did not return the updated academic year.');
      }

      setCurrentYear(item);

      setCurrentLabel(String(item?.label || ''));

      setSavedCurrentLabel(String(item?.label || ''));

      setCurrentStartDate(String(item?.starts_on || ''));

      setSavedCurrentStartDate(String(item?.starts_on || ''));

      await loadAcademicYears();

      Alert.alert(
        'Academic Year Updated',
        'The academic year has been saved successfully.',
      );
    } catch (error) {
      console.log('Current academic year save error:', error);

      Alert.alert('Could not save academic year', getApiErrorMessage(error));
    } finally {
      setSavingCurrent(false);
    }
  }

  function openFutureModal() {
    setCalendarTarget(null);

    setFutureLabel('');

    setFutureStartDate('');

    setFutureModalVisible(true);
  }

  async function handleCreateFuture() {
    const label = futureLabel.trim();

    if (!label) {
      Alert.alert('Academic Year', 'Please enter a label.');

      return;
    }

    if (!futureStartDate) {
      Alert.alert('Academic Year', 'Please select a start date.');

      return;
    }

    try {
      setCreatingFuture(true);

      const response = await api('/api/settings/v1/academic-years', {
        method: 'POST',

        body: JSON.stringify({
          label,

          starts_on: futureStartDate,
        }),
      });

      if (!response?.item) {
        throw new Error('The server did not return the new academic year.');
      }

      setFutureModalVisible(false);

      setFutureLabel('');

      setFutureStartDate('');

      await loadAcademicYears();

      Alert.alert(
        'Academic Year Added',
        'The future academic year has been added successfully.',
      );
    } catch (error) {
      console.log('Future academic year create error:', error);

      Alert.alert('Could not add academic year', getApiErrorMessage(error));
    } finally {
      setCreatingFuture(false);
    }
  }

  function openEditYear(year) {
    setCalendarTarget(null);

    setEditYear(year);

    setEditLabel(String(year?.label || ''));

    setEditStartDate(String(year?.starts_on || ''));
  }

  function closeEditYear() {
    if (savingEdit) {
      return;
    }

    setCalendarTarget(null);

    setEditYear(null);

    setEditLabel('');

    setEditStartDate('');
  }

  async function handleSaveEdit() {
    if (!editYear?.id || savingEdit) {
      return;
    }

    const label = editLabel.trim();

    if (!label) {
      Alert.alert('Academic Year', 'Please enter a label.');

      return;
    }

    const payload = {
      label,
    };

    /*
     * Closed/past academic years
     * cannot have their start date changed.
     */
    if (editYear?.can_edit_start) {
      if (!editStartDate) {
        Alert.alert('Academic Year', 'Please select a start date.');

        return;
      }

      payload.starts_on = editStartDate;
    }

    try {
      setSavingEdit(true);

      const response = await api(
        `/api/settings/v1/academic-years/${editYear.id}`,
        {
          method: 'PUT',

          body: JSON.stringify(payload),
        },
      );

      if (!response?.item) {
        throw new Error('The server did not return the updated academic year.');
      }

      closeEditYear();

      await loadAcademicYears();

      Alert.alert(
        'Academic Year Updated',
        'The academic year has been updated successfully.',
      );
    } catch (error) {
      console.log('Academic year edit error:', error);

      Alert.alert('Could not update academic year', getApiErrorMessage(error));
    } finally {
      setSavingEdit(false);
    }
  }

  function openCalendar(target) {
    setCalendarTarget(target);
  }

  function getCalendarDate() {
    if (calendarTarget === 'future') {
      return futureStartDate;
    }

    if (calendarTarget === 'edit') {
      return editStartDate;
    }

    return currentStartDate;
  }

  function handleCalendarDayPress(day) {
    const date = day?.dateString;

    if (!date) {
      return;
    }

    if (calendarTarget === 'future') {
      setFutureStartDate(date);
    } else if (calendarTarget === 'edit') {
      setEditStartDate(date);
    } else {
      setCurrentStartDate(date);
    }

    setCalendarTarget(null);
  }

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={COLORS.BLUE} />

          <Text style={styles.loadingText}>Loading academic years...</Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Year</Text>

        <Text style={styles.errorText}>{loadError}</Text>

        <Pressable onPress={loadAcademicYears} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Year</Text>

        {currentYear ? (
          <>
            <View style={styles.currentRow}>
              {/* Label */}

              <View style={styles.labelField}>
                <Text style={styles.label}>Label</Text>

                <TextInput
                  value={currentLabel}
                  onChangeText={setCurrentLabel}
                  editable={!savingCurrent}
                  placeholder="Academic Year"
                  placeholderTextColor={COLORS.MUTED}
                  style={styles.textInput}
                />
              </View>

              {/* Start Date */}

              <View style={styles.dateFieldGroup}>
                <Text style={styles.label}>Start date</Text>

                <Pressable
                  disabled={!currentYear?.can_edit_start || savingCurrent}
                  onPress={() => openCalendar('current')}
                  style={[
                    styles.dateInput,

                    !currentYear?.can_edit_start && styles.disabledField,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,

                      !currentStartDate && styles.placeholderText,
                    ]}
                  >
                    {currentStartDate
                      ? formatDisplayDate(currentStartDate)
                      : 'dd/mm/yyyy'}
                  </Text>

                  <Text style={styles.calendarIcon}>▣</Text>
                </Pressable>
              </View>

              {/* Save */}

              <Pressable
                onPress={handleSaveCurrent}
                disabled={savingCurrent || !currentChanged}
                style={[
                  styles.primaryButton,

                  (savingCurrent || !currentChanged) && styles.buttonDisabled,
                ]}
              >
                {savingCurrent ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT} />
                ) : (
                  <Text style={styles.primaryButtonText}>Save</Text>
                )}
              </Pressable>

              {/* Add Future */}

              <Pressable
                onPress={openFutureModal}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>
                  Add a future Academic Year
                </Text>
              </Pressable>
            </View>

            <Text style={styles.helperText}>
              The current academic year is loaded above. Its label is used
              anywhere an academic year is displayed.
            </Text>
          </>
        ) : (
          <Text style={styles.helperText}>
            No current academic year is configured.
          </Text>
        )}

        {/* Past / Planned Years */}

        {otherYears.length > 0 ? (
          <View style={styles.yearsList}>
            {otherYears.map(year => (
              <Pressable
                key={year.id}
                onPress={() => openEditYear(year)}
                style={({ pressed }) => [
                  styles.yearPill,

                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.yearPillLabel}>
                  {year?.label || year?.code}
                </Text>

                <Text style={styles.yearPillMeta}>
                  {getStatusLabel(year)}
                  {' · '}
                  {year?.starts_on}
                  {' – '}
                  {year?.ends_on}
                </Text>

                <Text style={styles.editIcon}>✎</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      {/* Add Future Academic Year Modal */}

      <Modal
        visible={futureModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !creatingFuture && setFutureModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add a future Academic Year</Text>

              <Pressable
                disabled={creatingFuture}
                onPress={() => {
                  setCalendarTarget(null);

                  setFutureModalVisible(false);
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            <Text style={styles.label}>Label</Text>

            <TextInput
              value={futureLabel}
              onChangeText={setFutureLabel}
              editable={!creatingFuture}
              placeholder="e.g. Academic Year 2027-28"
              placeholderTextColor={COLORS.MUTED}
              style={styles.modalTextInput}
            />

            <Text style={[styles.label, styles.modalFieldSpacing]}>
              Start date
            </Text>

            <Pressable
              disabled={creatingFuture}
              onPress={() => openCalendar('future')}
              style={styles.modalDateInput}
            >
              <Text
                style={[
                  styles.dateText,

                  !futureStartDate && styles.placeholderText,
                ]}
              >
                {futureStartDate
                  ? formatDisplayDate(futureStartDate)
                  : 'dd/mm/yyyy'}
              </Text>

              <Text style={styles.calendarIcon}>▣</Text>
            </Pressable>
            {calendarTarget === 'future' ? (
              <View style={styles.inlineCalendar}>
                <Calendar
                  current={futureStartDate || undefined}
                  markedDates={
                    futureStartDate
                      ? {
                          [futureStartDate]: {
                            selected: true,
                          },
                        }
                      : {}
                  }
                  onDayPress={day => {
                    setFutureStartDate(day.dateString);

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
            <Text style={styles.modalHelperText}>
              The end date and internal period code are derived automatically.
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                disabled={creatingFuture}
                onPress={() => {
                  setCalendarTarget(null);

                  setFutureModalVisible(false);
                }}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={
                  creatingFuture || !futureLabel.trim() || !futureStartDate
                }
                onPress={handleCreateFuture}
                style={[
                  styles.primaryButton,

                  (creatingFuture || !futureLabel.trim() || !futureStartDate) &&
                    styles.buttonDisabled,
                ]}
              >
                {creatingFuture ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT} />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    Add Academic Year
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Existing Academic Year */}

      <Modal
        visible={Boolean(editYear)}
        transparent
        animationType="fade"
        onRequestClose={closeEditYear}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editYear?.status === 'closed'
                  ? 'Edit past Academic Year'
                  : 'Edit Academic Year'}
              </Text>

              <Pressable
                disabled={savingEdit}
                onPress={closeEditYear}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            <Text style={styles.label}>Label</Text>

            <TextInput
              value={editLabel}
              onChangeText={setEditLabel}
              editable={!savingEdit}
              placeholder="Academic year label"
              placeholderTextColor={COLORS.MUTED}
              style={styles.modalTextInput}
            />

            {editYear?.can_edit_start ? (
              <>
                <Text style={[styles.label, styles.modalFieldSpacing]}>
                  Start date
                </Text>

                <Pressable
                  disabled={savingEdit}
                  onPress={() => openCalendar('edit')}
                  style={styles.modalDateInput}
                >
                  <Text style={styles.dateText}>
                    {formatDisplayDate(editStartDate)}
                  </Text>

                  <Text style={styles.calendarIcon}>▣</Text>
                </Pressable>

                {calendarTarget === 'edit' ? (
                  <View style={styles.inlineCalendar}>
                    <Calendar
                      current={editStartDate || undefined}
                      markedDates={
                        editStartDate
                          ? {
                              [editStartDate]: {
                                selected: true,
                              },
                            }
                          : {}
                      }
                      onDayPress={day => {
                        setEditStartDate(day.dateString);

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
              </>
            ) : (
              <Text style={styles.modalHelperText}>
                Past academic years are locked; only the label can be changed.
              </Text>
            )}

            <View style={styles.modalActions}>
              <Pressable
                disabled={savingEdit}
                onPress={closeEditYear}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={savingEdit || !editLabel.trim()}
                onPress={handleSaveEdit}
                style={[
                  styles.primaryButton,

                  (savingEdit || !editLabel.trim()) && styles.buttonDisabled,
                ]}
              >
                {savingEdit ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT} />
                ) : (
                  <Text style={styles.primaryButtonText}>Save Changes</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Calendar */}

      <Modal
        visible={calendarTarget === 'current'}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarTarget(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Start Date</Text>

              <Pressable
                onPress={() => setCalendarTarget(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            <Calendar
              current={getCalendarDate() || undefined}
              markedDates={
                getCalendarDate()
                  ? {
                      [getCalendarDate()]: {
                        selected: true,
                      },
                    }
                  : {}
              }
              onDayPress={handleCalendarDayPress}
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
        </View>
      </Modal>
    </>
  );
}
