import React, { useCallback, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../api/client';
import styles from './AdminNotificationSettings.styles';

const createEmptySettings = () => ({
  template: '',
  body: '',
  variables: [],
});

const formatFieldLabel = value => {
  const labels = {
    name: 'Full name',
    first_name: 'First name',
    student_name: 'Student full name',
    app_name: 'App name',
    occasion_name: 'Occasion name',
    bill_id: 'Bill ID',
    bill_caption: 'Bill caption',
    due_date: 'Due date',
    days_overdue: 'Days overdue',
    days_until_due: 'Days until due',
    payment_reference: 'Payment reference',
    payment_method: 'Payment method',
    paid_at: 'Paid at',
  };

  return labels[value] || value.replace(/_/g, ' ');
};

const normalizeVariable = variable => {
  if (typeof variable === 'string') {
    return variable;
  }

  if (variable && typeof variable === 'object') {
    return String(
      variable.field ?? variable.tag ?? variable.value ?? variable.key ?? '',
    );
  }

  return '';
};

export default function AdminNotificationSettings() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [catalogEvents, setCatalogEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');

  const [eventSettings, setEventSettings] = useState({});

  const [openParameterIndex, setOpenParameterIndex] = useState(null);

  const loadSettings = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [catalogResponse, settingsResponse] = await Promise.all([
        api('/api/notifications/admin/auto/catalog'),
        api('/api/notifications/admin/auto/whatsapp-settings'),
      ]);

      if (catalogResponse?.ok !== true) {
        throw new Error('Could not load notification event catalog.');
      }

      if (settingsResponse?.ok !== true) {
        throw new Error('Could not load event template settings.');
      }

      const events = Array.isArray(catalogResponse.events)
        ? catalogResponse.events
        : [];

      const savedEvents = settingsResponse.events || {};

      const nextSettings = {};

      events.forEach(event => {
        const saved = savedEvents[event.value] || {};

        const variables = Array.isArray(saved.variables) ? saved.variables : [];

        nextSettings[event.value] = {
          template: String(saved.template ?? ''),
          body: String(saved.body ?? ''),
          variables: variables.map(normalizeVariable),
        };
      });

      setCatalogEvents(events);
      setEventSettings(nextSettings);

      setSelectedEvent(previous =>
        events.some(event => event.value === previous)
          ? previous
          : events[0]?.value || '',
      );

      setOpenParameterIndex(null);
    } catch (error) {
      console.log('[NOTIFICATION SETTINGS ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      Alert.alert(
        'Settings Error',
        error?.message || 'Could not load notification settings.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const selectedCatalogEvent = catalogEvents.find(
    event => event.value === selectedEvent,
  );

  const currentSettings = eventSettings[selectedEvent] || createEmptySettings();

  const availableFields = Array.isArray(selectedCatalogEvent?.tags)
    ? selectedCatalogEvent.tags
    : [];

  const updateCurrentSettings = changes => {
    if (!selectedEvent) return;

    setEventSettings(previous => ({
      ...previous,
      [selectedEvent]: {
        ...(previous[selectedEvent] || createEmptySettings()),
        ...changes,
      },
    }));
  };

  const handleEventChange = eventValue => {
    setSelectedEvent(eventValue);
    setOpenParameterIndex(null);
  };

  const handleAddParameter = () => {
    updateCurrentSettings({
      variables: [...currentSettings.variables, ''],
    });

    setOpenParameterIndex(null);
  };

  const handleRemoveParameter = index => {
    const nextVariables = currentSettings.variables.filter(
      (_, itemIndex) => itemIndex !== index,
    );

    updateCurrentSettings({
      variables: nextVariables,
    });

    setOpenParameterIndex(null);
  };

  const handleParameterChange = (index, field) => {
    const nextVariables = [...currentSettings.variables];

    nextVariables[index] = field;

    updateCurrentSettings({
      variables: nextVariables,
    });

    setOpenParameterIndex(null);
  };

  const handleSaveEventTemplates = async () => {
    if (saving || loading || refreshing) return;

    if (catalogEvents.length === 0) {
      Alert.alert('No Events', 'No notification events are available.');
      return;
    }

    const eventsPayload = {};

    for (const event of catalogEvents) {
      const eventType = event.value;

      const config = eventSettings[eventType] || createEmptySettings();

      const template = String(config.template ?? '').trim();
      const body = String(config.body ?? '');

      const variables = Array.isArray(config.variables)
        ? config.variables.map(value => String(value ?? '').trim())
        : [];

      const allowedFields = Array.isArray(event.tags) ? event.tags : [];

      // Validate mapped system fields.
      if (variables.some(field => !field || !allowedFields.includes(field))) {
        Alert.alert(
          'Invalid Body Parameters',
          `Please select valid system fields for ${event.label}.`,
        );
        setSelectedEvent(eventType);
        return;
      }

      // Check numbered placeholders when a body is configured.
      if (body.trim()) {
        const matches = [...body.matchAll(/\{\{\s*(\d+)\s*\}\}/g)];

        const placeholderNumbers = [
          ...new Set(matches.map(match => Number(match[1]))),
        ];

        const invalidMapping = placeholderNumbers.some(
          number =>
            !Number.isInteger(number) ||
            number < 1 ||
            number > variables.length,
        );

        if (invalidMapping) {
          Alert.alert(
            'Invalid Template Mapping',
            `${event.label}: Every numbered placeholder must have a matching body parameter.`,
          );
          setSelectedEvent(eventType);
          return;
        }
      }

      eventsPayload[eventType] = {
        template,
        body,
        variables,
      };
    }

    const payload = {
      events: eventsPayload,
    };

    try {
      setSaving(true);
      setOpenParameterIndex(null);

      const response = await api(
        '/api/notifications/admin/auto/whatsapp-settings',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (response?.ok !== true || !response?.events) {
        throw new Error('Could not save event templates.');
      }

      // Update local state with the saved backend data.
      const savedSettings = {};

      catalogEvents.forEach(event => {
        const config = response.events[event.value] || {};

        savedSettings[event.value] = {
          template: String(config.template ?? ''),
          body: String(config.body ?? ''),
          variables: Array.isArray(config.variables)
            ? config.variables.map(normalizeVariable)
            : [],
        };
      });

      setEventSettings(savedSettings);

      Alert.alert('Templates Saved', 'Event templates saved successfully.');
    } catch (error) {
      console.log('[SAVE EVENT TEMPLATES ERROR]', {
        status: error?.status,
        message: error?.message,
        payload: error?.payload,
      });

      Alert.alert(
        'Save Failed',
        error?.message || 'Could not save event templates.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7DD3FC" />

        <Text style={styles.loadingText}>Loading event templates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Description */}
      <Text style={styles.description}>
        Choose an event, enter its message template name, and map each numbered
        body parameter to a relevant system field. Leave the template empty to
        prevent delivery and record a send error.
      </Text>

      {/* Refresh */}
      <View style={styles.toolbar}>
        <Pressable
          onPress={() => loadSettings(true)}
          disabled={refreshing}
          style={styles.refreshButton}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialCommunityIcons name="refresh" size={18} color="#FFFFFF" />
          )}

          <Text style={styles.refreshButtonText}>Refresh</Text>
        </Pressable>
      </View>

      {/* Event Selector */}
      <View style={styles.eventSelectorSection}>
        <Text style={styles.sectionTitle}>Select Event</Text>

        <View style={styles.eventButtonsContainer}>
          {catalogEvents.map(event => {
            const active = selectedEvent === event.value;

            return (
              <Pressable
                key={event.value}
                onPress={() => handleEventChange(event.value)}
                style={[styles.eventButton, active && styles.eventButtonActive]}
              >
                <Text
                  style={[
                    styles.eventButtonText,
                    active && styles.eventButtonTextActive,
                  ]}
                >
                  {event.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Selected Event Settings */}
      {selectedCatalogEvent ? (
        <View style={styles.settingsCard}>
          <Text style={styles.selectedEventTitle}>
            {selectedCatalogEvent.label}
          </Text>

          {/* Message Body */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Message body</Text>

            <TextInput
              value={currentSettings.body}
              onChangeText={value =>
                updateCurrentSettings({
                  body: value,
                })
              }
              placeholder="Full email and app notification message..."
              placeholderTextColor="#7F8DA5"
              multiline
              textAlignVertical="top"
              style={styles.messageBodyInput}
            />

            <Text style={styles.helperText}>
              Use numbered placeholders, such as {'{{1}}'} and {'{{2}}'}. They
              use the field mappings below, and this body is shared by in-app
              and email notifications.
            </Text>
          </View>

          {/* Template Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Message template name</Text>

            <TextInput
              value={currentSettings.template}
              onChangeText={value =>
                updateCurrentSettings({
                  template: value,
                })
              }
              placeholder="Message template name"
              placeholderTextColor="#7F8DA5"
              autoCapitalize="none"
              style={styles.templateInput}
            />
          </View>

          {/* Body Parameters */}
          <View style={styles.parametersSection}>
            <Text style={styles.helperText}>
              Body parameters are sent in the order shown.
            </Text>

            {currentSettings.variables.length === 0 ? (
              <Text style={styles.emptyParametersText}>
                No body parameters configured.
              </Text>
            ) : (
              currentSettings.variables.map((field, index) => (
                <View
                  key={`${selectedEvent}-${index}`}
                  style={styles.parameterGroup}
                >
                  <View style={styles.parameterRow}>
                    <Text style={styles.parameterNumber}>{index + 1}</Text>

                    <Pressable
                      onPress={() =>
                        setOpenParameterIndex(
                          openParameterIndex === index ? null : index,
                        )
                      }
                      style={styles.parameterSelect}
                    >
                      <Text
                        style={styles.parameterSelectText}
                        numberOfLines={1}
                      >
                        {field
                          ? formatFieldLabel(field)
                          : 'Select a system field'}
                      </Text>

                      <MaterialCommunityIcons
                        name={
                          openParameterIndex === index
                            ? 'chevron-up'
                            : 'chevron-down'
                        }
                        size={20}
                        color="#F8FAFC"
                      />
                    </Pressable>

                    <Pressable
                      onPress={() => handleRemoveParameter(index)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </Pressable>
                  </View>

                  {openParameterIndex === index && (
                    <ScrollView
                      nestedScrollEnabled
                      style={styles.parameterDropdown}
                      keyboardShouldPersistTaps="handled"
                    >
                      {availableFields.map(fieldOption => (
                        <Pressable
                          key={fieldOption}
                          onPress={() =>
                            handleParameterChange(index, fieldOption)
                          }
                          style={[
                            styles.parameterOption,
                            field === fieldOption &&
                              styles.parameterOptionActive,
                          ]}
                        >
                          <Text style={styles.parameterOptionText}>
                            {formatFieldLabel(fieldOption)}
                          </Text>

                          {field === fieldOption && (
                            <MaterialCommunityIcons
                              name="check"
                              size={17}
                              color="#7DD3FC"
                            />
                          )}
                        </Pressable>
                      ))}
                    </ScrollView>
                  )}
                </View>
              ))
            )}

            <Pressable
              onPress={handleAddParameter}
              style={styles.addParameterButton}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />

              <Text style={styles.addParameterText}>Add body parameter</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text style={styles.emptyParametersText}>
          No notification events available.
        </Text>
      )}

      {/* Save Footer */}
      <View style={styles.footer}>
        <Pressable
          onPress={handleSaveEventTemplates}
          disabled={
            saving || refreshing || loading || catalogEvents.length === 0
          }
          accessibilityRole="button"
          accessibilityState={{
            disabled:
              saving || refreshing || loading || catalogEvents.length === 0,
          }}
          style={({ pressed }) => [
            styles.saveButton,
            (saving || refreshing || loading || catalogEvents.length === 0) &&
              styles.saveButtonDisabled,
            pressed && { opacity: 0.8 },
          ]}
        >
          {saving ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <ActivityIndicator size="small" color="#FFFFFF" />

              <Text style={styles.saveButtonText}>Saving...</Text>
            </View>
          ) : (
            <Text style={styles.saveButtonText}>Save event templates</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
