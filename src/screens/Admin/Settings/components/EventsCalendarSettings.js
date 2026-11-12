import React, { useCallback, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import EventModal from './EventModal';

import { COLORS, styles } from './EventsCalendarSettings.styles';

function getDateOnly(value) {
  if (!value) {
    return '';
  }

  return String(value).slice(0, 10);
}

function normalizeEvents(response) {
  const rows = Array.isArray(response?.rows) ? response.rows : [];

  return rows.map(item => ({
    ...item,

    start_date: getDateOnly(item?.start_date),

    end_date: getDateOnly(item?.end_date),
  }));
}

function getDateRangeLabel(event) {
  const startDate = getDateOnly(event?.start_date);

  const endDate = getDateOnly(event?.end_date);

  if (!startDate && !endDate) {
    return '—';
  }

  if (!endDate || startDate === endDate) {
    return startDate;
  }

  return `${startDate} → ${endDate}`;
}

export default function EventsCalendarSettings() {
  const [academicYear, setAcademicYear] = useState({
    start: '',
    end: '',
  });

  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [eventModalVisible, setEventModalVisible] = useState(false);

  const [eventModalMode, setEventModalMode] = useState('add');

  const [editingEvent, setEditingEvent] = useState(null);

  const [savingEvent, setSavingEvent] = useState(false);

  const [deletingEventId, setDeletingEventId] = useState(null);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');

      const response = await api('/api/calendar/v1/events', {
        method: 'GET',
      });

      setAcademicYear({
        start: getDateOnly(response?.academic_year?.start),

        end: getDateOnly(response?.academic_year?.end),
      });

      setEvents(normalizeEvents(response));
    } catch (error) {
      console.log('Events calendar load error:', error);

      setLoadError(error?.message || 'Could not load events.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  function handleAddEvent() {
    if (savingEvent || deletingEventId !== null) {
      return;
    }

    setEventModalMode('add');

    setEditingEvent(null);

    setEventModalVisible(true);
  }

  function handleEditEvent(event) {
    if (!event?.id || savingEvent || deletingEventId !== null) {
      return;
    }

    setEventModalMode('edit');

    setEditingEvent(event);

    setEventModalVisible(true);
  }

  function handleCloseEventModal() {
    if (savingEvent) {
      return;
    }

    setEventModalVisible(false);

    setEventModalMode('add');

    setEditingEvent(null);
  }

  async function handleSaveEvent(values) {
    const isEdit = eventModalMode === 'edit';

    const eventId = editingEvent?.id;

    if (savingEvent || (isEdit && !eventId)) {
      return;
    }

    const name = String(values?.name || '').trim();

    const startDate = String(values?.start_date || '').trim();

    const endDate = String(values?.end_date || '').trim();

    if (!name || !startDate || !endDate) {
      Alert.alert(
        'Invalid Event',
        'Event name, start date and end date are required.',
      );

      return;
    }

    try {
      setSavingEvent(true);

      const payload = {
        name,
        start_date: startDate,
        end_date: endDate,
      };

      console.log(
        isEdit ? 'Event update payload:' : 'Event create payload:',
        payload,
      );

      const response = await api(
        isEdit
          ? `/api/calendar/v1/events/${eventId}`
          : '/api/calendar/v1/events',
        {
          method: isEdit ? 'PUT' : 'POST',

          body: JSON.stringify(payload),
        },
      );

      if (!response?.id) {
        throw new Error(
          isEdit
            ? 'The server did not return the updated event.'
            : 'The server did not return the created event.',
        );
      }

      const finalEvent = {
        ...response,

        start_date: getDateOnly(response.start_date),

        end_date: getDateOnly(response.end_date),
      };

      if (isEdit) {
        setEvents(previous =>
          previous.map(item =>
            String(item?.id) === String(eventId) ? finalEvent : item,
          ),
        );
      } else {
        setEvents(previous => [...previous, finalEvent]);
      }

      setEventModalVisible(false);

      setEventModalMode('add');

      setEditingEvent(null);

      Alert.alert(
        isEdit ? 'Event Updated' : 'Event Added',
        isEdit
          ? 'The event has been updated successfully.'
          : 'The event has been added successfully.',
      );
    } catch (error) {
      console.log(
        isEdit ? 'Event update error:' : 'Event create error:',
        error,
      );

      Alert.alert(
        isEdit ? 'Could not update event' : 'Could not add event',
        error?.message || 'The event could not be saved.',
      );
    } finally {
      setSavingEvent(false);
    }
  }

  function handleDeleteEvent(event) {
    if (!event?.id || deletingEventId !== null || savingEvent) {
      return;
    }

    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event?.name || 'this event'}"?`,
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
              setDeletingEventId(event.id);

              const response = await api(
                `/api/calendar/v1/events/${event.id}`,
                {
                  method: 'DELETE',
                },
              );

              if (!response?.ok) {
                throw new Error(
                  'The server did not confirm the event deletion.',
                );
              }

              setEvents(previous =>
                previous.filter(item => String(item?.id) !== String(event.id)),
              );
            } catch (error) {
              console.log('Event delete error:', error);

              Alert.alert(
                'Could not delete event',
                error?.message || 'The event could not be deleted.',
              );
            } finally {
              setDeletingEventId(null);
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

        <Text style={styles.stateText}>Loading events...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.errorTitle}>Could not load events</Text>

        <Text style={styles.errorDescription}>{loadError}</Text>

        <Pressable
          onPress={loadEvents}
          style={({ pressed }) => [
            styles.primaryButton,

            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Retry</Text>
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
            Manage events for the current academic year.
          </Text>

          <Pressable
            onPress={handleAddEvent}
            disabled={savingEvent || deletingEventId !== null}
            style={({ pressed }) => [
              styles.addEventButton,

              pressed && !savingEvent && styles.buttonPressed,

              (savingEvent || deletingEventId !== null) &&
                styles.buttonDisabled,
            ]}
          >
            <Text style={styles.addEventButtonText}>+ Add Event</Text>
          </Pressable>
        </View>

        <View style={styles.eventsCard}>
          <Text style={styles.academicYearText}>
            Academic year: {academicYear.start || '—'} →{' '}
            {academicYear.end || '—'}
          </Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.nameColumn]}>
              Event Name
            </Text>

            <Text style={[styles.tableHeaderText, styles.dateColumn]}>
              Date Range
            </Text>

            <Text style={[styles.tableHeaderText, styles.actionColumn]}>
              Actions
            </Text>
          </View>

          {events.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No events found</Text>

              <Text style={styles.emptyDescription}>
                Add an event for the current academic year.
              </Text>
            </View>
          ) : (
            <View style={styles.rows}>
              {events.map(event => {
                const deleting = String(deletingEventId) === String(event.id);

                const actionsDisabled = deletingEventId !== null || savingEvent;

                return (
                  <View key={event.id} style={styles.eventRow}>
                    <Text
                      style={[styles.eventName, styles.nameColumn]}
                      numberOfLines={2}
                    >
                      {event.name}
                    </Text>

                    <Text style={[styles.dateRange, styles.dateColumn]}>
                      {getDateRangeLabel(event)}
                    </Text>

                    <View style={[styles.rowActions, styles.actionColumn]}>
                      <Pressable
                        onPress={() => handleEditEvent(event)}
                        disabled={actionsDisabled}
                        style={({ pressed }) => [
                          styles.editButton,

                          pressed && !actionsDisabled && styles.buttonPressed,

                          actionsDisabled && styles.buttonDisabled,
                        ]}
                      >
                        <Text style={styles.actionIcon}>✏️</Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handleDeleteEvent(event)}
                        disabled={actionsDisabled}
                        style={({ pressed }) => [
                          styles.deleteButton,

                          pressed && !actionsDisabled && styles.buttonPressed,

                          actionsDisabled && styles.buttonDisabled,
                        ]}
                      >
                        {deleting ? (
                          <ActivityIndicator size="small" color={COLORS.TEXT} />
                        ) : (
                          <Text style={styles.actionIcon}>🗑</Text>
                        )}
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <EventModal
        visible={eventModalVisible}
        mode={eventModalMode}
        event={editingEvent}
        academicYear={academicYear}
        saving={savingEvent}
        onClose={handleCloseEventModal}
        onSave={handleSaveEvent}
      />
    </View>
  );
}
