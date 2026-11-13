import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../api/client';
import styles from './AdminAutoNotifications.styles';

const PER_PAGE = 20;

const STATUS_OPTIONS = [
  { label: 'All statuses', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

function FilterDropdown({ value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);

  const selected = options.find(item => item.value === value);

  return (
    <View style={styles.dropdownWrapper}>
      <Pressable
        onPress={() => setOpen(previous => !previous)}
        style={styles.dropdownButton}
        accessibilityRole="button"
      >
        <Text numberOfLines={1} style={styles.dropdownText}>
          {selected?.label || placeholder}
        </Text>

        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#F8FAFC"
        />
      </Pressable>

      {open && (
        <View style={styles.dropdownOptions}>
          {options.map(option => (
            <Pressable
              key={String(option.value)}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
              style={[
                styles.dropdownOption,
                option.value === value && styles.dropdownOptionSelected,
              ]}
            >
              <Text style={styles.dropdownOptionText}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function getRuleStatus(rule) {
  if (rule?.is_active === true) return 'Active';
  if (rule?.is_active === false) return 'Inactive';

  return String(rule?.status || 'Unknown');
}

function getRuleName(rule) {
  return String(rule?.name || rule?.title || `Rule #${rule?.id}`);
}

function formatDate(value) {
  if (!value) return 'Never';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminAutoNotifications() {
  const requestIdRef = useRef(0);

  const [catalog, setCatalog] = useState({
    events: [],
    roles: [],
    channels: {
      email: false,
      sms: false,
      whatsapp: false,
    },
  });

  const [rules, setRules] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: PER_PAGE,
    total: 0,
    last_page: 1,
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchText, setSearchText] = useState('');

  const [appliedFilters, setAppliedFilters] = useState({
    event: '',
    status: '',
    search: '',
  });
  const [runningNow, setRunningNow] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [notificationName, setNotificationName] = useState('');
  const [notificationEvent, setNotificationEvent] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');

  const [notificationSendEmail, setNotificationSendEmail] = useState(false);

  const [notificationActive, setNotificationActive] = useState(true);

  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [savingNotification, setSavingNotification] = useState(false);
  const [deletingRuleId, setDeletingRuleId] = useState(null);

  const [occasionMonthDay, setOccasionMonthDay] = useState('');
  const [occasionName, setOccasionName] = useState('');
  const [occasionRecipientRole, setOccasionRecipientRole] = useState('');

  const [numberOfDays, setNumberOfDays] = useState('7');
  const [occasionRoleDropdownOpen, setOccasionRoleDropdownOpen] =
    useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null);

  const eventOptions = useMemo(
    () => [
      { label: 'All events', value: '' },
      ...catalog.events.map(event => ({
        label: event.label,
        value: event.value,
      })),
    ],
    [catalog.events],
  );

  const loadCatalog = useCallback(async () => {
    const response = await api('/api/notifications/admin/auto/catalog');

    if (response?.ok !== true) {
      throw new Error('Could not load notification catalog.');
    }

    setCatalog({
      events: Array.isArray(response.events) ? response.events : [],
      roles: Array.isArray(response.roles) ? response.roles : [],
      channels: response.channels || {
        email: false,
        sms: false,
        whatsapp: false,
      },
    });
  }, []);

  const loadRules = useCallback(async (page = 1) => {
    const requestId = ++requestIdRef.current;

    try {
      setRulesLoading(true);

      const response = await api(
        `/api/notifications/admin/auto?page=${page}&per_page=${PER_PAGE}`,
      );

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (response?.ok !== true) {
        throw new Error('Could not load auto notifications.');
      }

      const rows = Array.isArray(response.rules) ? response.rules : [];

      const meta = response.pagination || {};

      setRules(rows);

      setPagination({
        page: Number(meta.page ?? page),
        per_page: Number(meta.per_page ?? PER_PAGE),
        total: Number(meta.total ?? rows.length),
        last_page: Math.max(1, Number(meta.last_page ?? 1)),
      });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.log('[AUTO NOTIFICATIONS ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      Alert.alert(
        'Auto Notifications',
        error?.message || 'Could not load rules.',
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setRulesLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      try {
        await Promise.all([loadCatalog(), loadRules(1)]);
      } catch (error) {
        if (active) {
          Alert.alert(
            'Auto Notifications',
            error?.message || 'Unable to load catalog.',
          );
        }
      } finally {
        if (active) setInitialLoading(false);
      }
    };

    initialize();

    return () => {
      active = false;
      requestIdRef.current += 1;
    };
  }, [loadCatalog, loadRules]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);

      await Promise.all([loadCatalog(), loadRules(pagination.page)]);
    } catch (error) {
      Alert.alert('Refresh Failed', error?.message || 'Unable to refresh.');
    } finally {
      setRefreshing(false);
    }
  };

  // These filters apply to the current API page only.
  // Move filtering to backend when parameters are confirmed.
  const filteredRules = useMemo(() => {
    const query = appliedFilters.search.toLowerCase();

    return rules.filter(rule => {
      const eventValue = String(rule?.event || rule?.event_type || '');

      if (appliedFilters.event && eventValue !== appliedFilters.event) {
        return false;
      }

      if (appliedFilters.status) {
        const active = rule?.is_active === true || rule?.status === 'active';

        if (appliedFilters.status === 'active' && !active) {
          return false;
        }

        if (appliedFilters.status === 'inactive' && active) {
          return false;
        }
      }

      if (query) {
        const text = [
          rule?.name,
          rule?.title,
          rule?.template,
          rule?.message_template,
          eventValue,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!text.includes(query)) return false;
      }

      return true;
    });
  }, [rules, appliedFilters]);

  const applyFilters = () => {
    setAppliedFilters({
      event: selectedEvent,
      status: selectedStatus,
      search: searchText.trim(),
    });
  };

  const clearFilters = () => {
    setSelectedEvent('');
    setSelectedStatus('');
    setSearchText('');

    setAppliedFilters({
      event: '',
      status: '',
      search: '',
    });
  };

  const changePage = nextPage => {
    if (
      rulesLoading ||
      nextPage < 1 ||
      nextPage > pagination.last_page ||
      nextPage === pagination.page
    ) {
      return;
    }

    loadRules(nextPage);
  };

  const handleRunNow = () => {
    if (runningNow || rulesLoading) {
      return;
    }

    Alert.alert(
      'Run Auto Notifications',
      'Process all active auto notifications for today now?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Run Now',
          onPress: async () => {
            if (runningNow) return;

            try {
              setRunningNow(true);

              const response = await api('/api/notifications/admin/auto/run', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
              });

              if (response?.ok !== true) {
                throw new Error('Unable to process auto notifications.');
              }

              const summary = response?.summary || {};

              const rules = Number(summary.rules ?? 0);
              const deliveries = Number(summary.deliveries ?? 0);
              const skipped = Number(summary.skipped ?? 0);
              const failed = Number(summary.failed ?? 0);

              // Reload current rules page after processing.
              await loadRules(pagination.page);

              Alert.alert(
                'Auto Notifications Processed',
                `Rules processed: ${rules}\n` +
                  `Deliveries: ${deliveries}\n` +
                  `Skipped: ${skipped}\n` +
                  `Failed: ${failed}`,
                [{ text: 'OK' }],
              );
            } catch (error) {
              console.log('[AUTO NOTIFICATION RUN ERROR]', {
                status: error?.status,
                message: error?.message,
                payload: error?.payload,
              });

              Alert.alert(
                'Run Failed',
                error?.message || 'Could not process auto notifications.',
              );
            } finally {
              setRunningNow(false);
            }
          },
        },
      ],
    );
  };

  const showingFrom =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.per_page + 1;

  const showingTo = Math.min(
    (pagination.page - 1) * pagination.per_page + rules.length,
    pagination.total,
  );

  const selectedCatalogEvent = catalog.events.find(
    event => event.value === notificationEvent,
  );

  const availableTags = Array.isArray(selectedCatalogEvent?.tags)
    ? selectedCatalogEvent.tags
    : [];

  const openAddNotificationModal = () => {
    setEditingRuleId(null);
    setNotificationName('');
    setNotificationEvent(catalog.events[0]?.value || '');
    setMessageTemplate('');

    setNotificationSendEmail(false);
    setNotificationActive(true);

    setOccasionMonthDay('');
    setOccasionName('');
    setOccasionRecipientRole('');
    setNumberOfDays('7');

    setEventDropdownOpen(false);
    setAddModalVisible(true);
    setOccasionRoleDropdownOpen(false);
  };

  const closeAddNotificationModal = () => {
    if (savingNotification) return;

    setEventDropdownOpen(false);
    setOccasionRoleDropdownOpen(false);
    setAddModalVisible(false);
    setEditingRuleId(null);
  };
  const handleSaveNotification = async () => {
    if (savingNotification) return;

    const name = notificationName.trim();
    const eventType = notificationEvent;
    const template = messageTemplate.trim();
    const isEditMode = editingRuleId !== null;

    // Basic validation
    if (!name) {
      Alert.alert('Name Required', 'Please enter a notification name.');
      return;
    }

    const supportedEvents = [
      'student_birthday',
      'annual_occasion',
      'bill_overdue',
      'bill_due_soon',
      'bill_generated',
      'payment_received',
    ];

    if (
      !supportedEvents.includes(eventType) ||
      !catalog.events.some(event => event.value === eventType)
    ) {
      Alert.alert('Invalid Event', 'Please select a valid notification event.');
      return;
    }

    if (!template) {
      Alert.alert('Message Required', 'Please enter a message template.');
      return;
    }

    // Event-specific settings
    let eventSettings = {};

    if (eventType === 'annual_occasion') {
      if (!isValidMonthDay(occasionMonthDay)) {
        Alert.alert(
          'Invalid Date',
          'Please enter a valid month and day (MM-DD).',
        );
        return;
      }

      if (!occasionName.trim()) {
        Alert.alert(
          'Occasion Name Required',
          'Please enter the occasion or festival name.',
        );
        return;
      }

      if (
        occasionRecipientRole &&
        !catalog.roles.includes(occasionRecipientRole)
      ) {
        Alert.alert(
          'Invalid Recipients',
          'Please select a valid recipient role.',
        );
        return;
      }

      eventSettings = {
        month_day: occasionMonthDay.trim(),
        occasion_name: occasionName.trim(),
        recipient_role: occasionRecipientRole || '',
      };
    } else if (eventType === 'bill_overdue' || eventType === 'bill_due_soon') {
      const days = Number(numberOfDays);

      if (
        !/^\d+$/.test(numberOfDays) ||
        !Number.isSafeInteger(days) ||
        days < 1
      ) {
        Alert.alert(
          'Invalid Number of Days',
          'Please enter a positive number of days.',
        );
        return;
      }

      eventSettings = {
        days,
      };
    }

    // student_birthday, bill_generated, payment_received
    // continue to use settings: {}.

    const payload = {
      name,
      event_type: eventType,
      message_template: template,
      settings: eventSettings,
      send_email: notificationSendEmail,
      send_sms: false,
      send_whatsapp: false,
      is_active: notificationActive,
    };

    const endpoint = isEditMode
      ? `/api/notifications/admin/auto/${editingRuleId}`
      : '/api/notifications/admin/auto';

    const method = isEditMode ? 'PUT' : 'POST';

    try {
      setSavingNotification(true);

      const response = await api(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response?.ok !== true || !response?.rule?.id) {
        throw new Error(
          isEditMode
            ? 'Could not update auto notification.'
            : 'Could not create auto notification.',
        );
      }

      // Close modal after successful save.
      setEventDropdownOpen(false);
      setOccasionRoleDropdownOpen(false);
      setAddModalVisible(false);
      setEditingRuleId(null);

      // Refresh rules list.
      await loadRules(isEditMode ? pagination.page : 1);

      Alert.alert(
        isEditMode ? 'Notification Updated' : 'Notification Saved',
        isEditMode
          ? 'Auto notification updated successfully.'
          : 'Auto notification created successfully.',
      );
    } catch (error) {
      console.log('[AUTO NOTIFICATION SAVE ERROR]', {
        status: error?.status,
        message: error?.message,
        payload: error?.payload,
      });

      Alert.alert(
        isEditMode ? 'Update Failed' : 'Save Failed',
        error?.message || 'Unable to save auto notification.',
      );
    } finally {
      setSavingNotification(false);
    }
  };

  const insertTemplateTag = tag => {
    const placeholder = `{${tag}}`;

    setMessageTemplate(previous => previous + placeholder);
  };

  const handleEditRule = rule => {
    if (savingNotification) return;

    const ruleId = Number(rule?.id);

    if (!Number.isInteger(ruleId) || ruleId <= 0) {
      Alert.alert('Edit Failed', 'Invalid notification rule.');
      return;
    }

    const eventType = String(rule.event_type || '');

    // Backend may return [] instead of {} for empty settings.
    const settings =
      rule.settings &&
      !Array.isArray(rule.settings) &&
      typeof rule.settings === 'object'
        ? rule.settings
        : {};

    setEditingRuleId(ruleId);

    setNotificationName(String(rule.name || ''));
    setNotificationEvent(eventType);
    setMessageTemplate(String(rule.message_template || ''));

    setNotificationSendEmail(rule.send_email === true);
    setNotificationActive(rule.is_active === true);

    // Annual occasion
    setOccasionMonthDay(String(settings.month_day || ''));
    setOccasionName(String(settings.occasion_name || ''));
    setOccasionRecipientRole(String(settings.recipient_role || ''));

    // Bill events
    if (eventType === 'bill_overdue') {
      setNumberOfDays(String(settings.days ?? 7));
    } else if (eventType === 'bill_due_soon') {
      setNumberOfDays(String(settings.days ?? 3));
    } else {
      setNumberOfDays('');
    }

    setEventDropdownOpen(false);
    setOccasionRoleDropdownOpen(false);

    // Open the SAME modal in Edit Mode.
    setAddModalVisible(true);
  };

  const handleDeleteRule = rule => {
    if (deletingRuleId !== null || rulesLoading) {
      return;
    }

    const ruleId = Number(rule?.id);

    if (!Number.isInteger(ruleId) || ruleId <= 0) {
      Alert.alert('Delete Failed', 'Invalid auto notification rule.');
      return;
    }

    Alert.alert(
      'Delete Auto Notification',
      'Delete this auto notification? Past deliveries will also be removed.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (deletingRuleId !== null) return;

            try {
              setDeletingRuleId(ruleId);

              const response = await api(
                `/api/notifications/admin/auto/${ruleId}`,
                {
                  method: 'DELETE',
                },
              );

              if (response?.ok !== true) {
                throw new Error('Could not delete auto notification.');
              }

              // If this was the last rule on the current
              // page, return to the previous page.
              const currentPage = pagination.page;
              const nextPage =
                rules.length === 1 && currentPage > 1
                  ? currentPage - 1
                  : currentPage;

              // Clear filters so the refreshed list
              // displays available rules.
              clearFilters();

              // Refresh rules after successful deletion.
              await loadRules(nextPage);

              Alert.alert(
                'Deleted Successfully',
                'Auto notification deleted successfully.',
              );
            } catch (error) {
              console.log('[DELETE AUTO NOTIFICATION ERROR]', {
                status: error?.status,
                message: error?.message,
                payload: error?.payload,
              });

              Alert.alert(
                'Delete Failed',
                error?.message || 'Unable to delete auto notification.',
              );
            } finally {
              setDeletingRuleId(null);
            }
          },
        },
      ],
    );
  };

  const handleNotificationEventChange = eventValue => {
    setNotificationEvent(eventValue);
    setEventDropdownOpen(false);

    // Reset event-specific values
    setOccasionMonthDay('');
    setOccasionName('');
    setOccasionRecipientRole('');

    if (eventValue === 'bill_overdue') {
      setNumberOfDays('7');
    } else if (eventValue === 'bill_due_soon') {
      setNumberOfDays('3');
    } else {
      setNumberOfDays('');
    }

    // Prevent placeholders from a different event
    // remaining in a newly selected template.
    setMessageTemplate('');
    setOccasionRoleDropdownOpen(false);
  };

  const isValidMonthDay = value => {
    if (!/^\d{2}-\d{2}$/.test(value)) return false;

    const [month, day] = value.split('-').map(Number);

    if (month < 1 || month > 12) return false;

    // Leap year allows annual occasions on February 29.
    const daysInMonth = new Date(2024, month, 0).getDate();

    return day >= 1 && day <= daysInMonth;
  };

  const renderPagination = () => (
    <View style={styles.paginationRow}>
      <Text style={styles.paginationInfo}>
        Showing {showingFrom}-{showingTo} of {pagination.total} rules
      </Text>

      <View style={styles.paginationButtons}>
        <Pressable
          disabled={rulesLoading || pagination.page <= 1}
          onPress={() => changePage(pagination.page - 1)}
          style={[
            styles.pageButton,
            (rulesLoading || pagination.page <= 1) && styles.disabled,
          ]}
        >
          <Text style={styles.pageButtonText}>Prev</Text>
        </Pressable>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>{pagination.page}</Text>
        </View>

        <Pressable
          disabled={rulesLoading || pagination.page >= pagination.last_page}
          onPress={() => changePage(pagination.page + 1)}
          style={[
            styles.pageButton,
            (rulesLoading || pagination.page >= pagination.last_page) &&
              styles.disabled,
          ]}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );

  if (initialLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7DD3FC" />
        <Text style={styles.mutedText}>Loading auto notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* FILTERS */}
      <View style={styles.filterCard}>
        <View style={styles.filterRow}>
          <View style={styles.eventField}>
            <FilterDropdown
              value={selectedEvent}
              options={eventOptions}
              onChange={setSelectedEvent}
              placeholder="All events"
            />
          </View>

          <View style={styles.statusField}>
            <FilterDropdown
              value={selectedStatus}
              options={STATUS_OPTIONS}
              onChange={setSelectedStatus}
              placeholder="All statuses"
            />
          </View>
        </View>

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search name or template..."
          placeholderTextColor="#94A3B8"
          autoCorrect={false}
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={applyFilters}
        />

        <View style={styles.actionRow}>
          <Pressable onPress={applyFilters} style={styles.primaryButton}>
            <Text style={styles.actionText}>Search</Text>
          </Pressable>

          <Pressable onPress={clearFilters} style={styles.secondaryButton}>
            <Text style={styles.actionText}>Clear</Text>
          </Pressable>

          <Pressable
            onPress={handleRunNow}
            disabled={runningNow || rulesLoading}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.secondaryButton,
              (runningNow || rulesLoading) && styles.disabled,
              pressed && { opacity: 0.75 },
            ]}
          >
            {runningNow ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.actionText}>Running...</Text>
              </View>
            ) : (
              <Text style={styles.actionText}>Run Now</Text>
            )}
          </Pressable>
        </View>

        <Pressable
          onPress={openAddNotificationModal}
          style={({ pressed }) => [
            styles.primaryButton,
            styles.addButton,
            pressed && { opacity: 0.75 },
          ]}
        >
          <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.actionText}>Add Notification</Text>
        </Pressable>
      </View>

      <Text style={styles.filterHint}>
        Search filters the current page. Rule creation and Run Now will be
        enabled after their APIs are configured.
      </Text>

      {/* TOP PAGINATION */}
      {renderPagination()}

      {/* RULES LIST */}
      <View style={styles.tableCard}>
        {rulesLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator color="#7DD3FC" size="large" />
            <Text style={styles.mutedText}>Loading rules...</Text>
          </View>
        ) : filteredRules.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No auto notifications found.</Text>
          </View>
        ) : (
          filteredRules.map(rule => {
            const eventValue = String(rule?.event || rule?.event_type || '');

            const eventLabel =
              catalog.events.find(event => event.value === eventValue)?.label ||
              eventValue ||
              '-';

            const deliveryChannels = ['In-app'];

            if (rule.send_email === true) {
              deliveryChannels.push('Email');
            }

            if (rule.send_sms === true) {
              deliveryChannels.push('SMS');
            }

            if (rule.send_whatsapp === true) {
              deliveryChannels.push('WhatsApp');
            }

            return (
              <View key={String(rule.id)} style={styles.ruleCard}>
                {/* Rule Name, Delivery Count and Actions */}
                <View style={styles.ruleHeader}>
                  <View style={styles.ruleNameSection}>
                    <Text style={styles.ruleName}>{getRuleName(rule)}</Text>

                    <Text style={styles.ruleDeliveryCount}>
                      {Number(rule.deliveries_count ?? 0)} deliveries
                    </Text>
                  </View>

                  <View style={styles.ruleActions}>
                    <Pressable
                      onPress={() => handleEditRule(rule)}
                      accessibilityRole="button"
                      accessibilityLabel={`Edit ${getRuleName(rule)}`}
                      style={({ pressed }) => [
                        styles.ruleEditButton,
                        pressed && styles.actionPressed,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="pencil"
                        size={18}
                        color="#FFFFFF"
                      />
                    </Pressable>

                    <Pressable
                      onPress={() => handleDeleteRule(rule)}
                      disabled={deletingRuleId !== null || rulesLoading}
                      accessibilityRole="button"
                      accessibilityLabel={`Delete ${getRuleName(rule)}`}
                      style={({ pressed }) => [
                        styles.ruleDeleteButton,
                        (deletingRuleId !== null || rulesLoading) &&
                          styles.disabled,
                        pressed && styles.actionPressed,
                      ]}
                    >
                      {deletingRuleId === Number(rule.id) ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <MaterialCommunityIcons
                          name="delete-outline"
                          size={19}
                          color="#FFFFFF"
                        />
                      )}
                    </Pressable>
                  </View>
                </View>

                {/* Status */}
                <Text style={styles.ruleStatus}>{getRuleStatus(rule)}</Text>

                {/* Event */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Event</Text>
                  <Text style={styles.detailValue}>{eventLabel}</Text>
                </View>

                {/* Delivery */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Delivery</Text>
                  <Text style={styles.detailValue}>
                    {deliveryChannels.join(', ')}
                  </Text>
                </View>

                {/* Last Run */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Last run</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(rule.last_run_at || rule.last_run)}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* BOTTOM PAGINATION */}
      {renderPagination()}

      {/* Add Auto Notification Modal */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeAddNotificationModal}
      >
        <View style={styles.addModalOverlay}>
          <View style={styles.addModalCard}>
            {/* Modal Header */}
            <View style={styles.addModalHeader}>
              <Text style={styles.addModalTitle}>
                {editingRuleId !== null
                  ? 'Edit Auto Notification'
                  : 'Add Auto Notification'}
              </Text>

              <Pressable
                onPress={closeAddNotificationModal}
                style={styles.addModalClose}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={23}
                  color="#F8FAFC"
                />
              </Pressable>
            </View>

            <ScrollView
              style={styles.addModalScroll}
              contentContainerStyle={styles.addModalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Name */}
              <View style={styles.addFormField}>
                <Text style={styles.addFormLabel}>Name</Text>

                <TextInput
                  value={notificationName}
                  onChangeText={setNotificationName}
                  placeholder="e.g. Birthday greeting"
                  placeholderTextColor="#8193AD"
                  style={styles.addFormInput}
                />
              </View>

              {/* Event */}
              <View style={styles.addFormField}>
                <Text style={styles.addFormLabel}>Event</Text>

                <Pressable
                  onPress={() => setEventDropdownOpen(previous => !previous)}
                  style={styles.addEventSelector}
                >
                  <Text style={styles.addEventText}>
                    {selectedCatalogEvent?.label || 'Select event'}
                  </Text>

                  <MaterialCommunityIcons
                    name={eventDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={21}
                    color="#E2E8F0"
                  />
                </Pressable>

                {eventDropdownOpen && (
                  <View style={styles.addEventOptions}>
                    {catalog.events.map(event => (
                      <Pressable
                        key={event.value}
                        onPress={() =>
                          handleNotificationEventChange(event.value)
                        }
                        style={[
                          styles.addEventOption,
                          notificationEvent === event.value &&
                            styles.addEventOptionSelected,
                        ]}
                      >
                        <Text style={styles.addEventOptionText}>
                          {event.label}
                        </Text>

                        {notificationEvent === event.value && (
                          <MaterialCommunityIcons
                            name="check"
                            size={18}
                            color="#7DD3FC"
                          />
                        )}
                      </Pressable>
                    ))}
                  </View>
                )}

                {selectedCatalogEvent?.description ? (
                  <Text style={styles.addEventDescription}>
                    {selectedCatalogEvent.description}
                  </Text>
                ) : null}

                {/* Event-specific settings */}

                {notificationEvent === 'annual_occasion' && (
                  <View style={styles.eventSettingsContainer}>
                    <View style={styles.occasionFieldsRow}>
                      {/* Month and Day */}
                      <View style={styles.occasionField}>
                        <Text style={styles.addFormLabel}>
                          Month and day (MM-DD)
                        </Text>

                        <TextInput
                          value={occasionMonthDay}
                          onChangeText={text => {
                            const cleaned = text.replace(/[^0-9-]/g, '');
                            setOccasionMonthDay(cleaned.slice(0, 5));
                          }}
                          placeholder="12-25"
                          placeholderTextColor="#8193AD"
                          keyboardType="numbers-and-punctuation"
                          maxLength={5}
                          style={styles.addFormInput}
                        />
                      </View>

                      {/* Occasion Name */}
                      <View style={styles.occasionField}>
                        <Text style={styles.addFormLabel}>
                          Occasion / festival name
                        </Text>

                        <TextInput
                          value={occasionName}
                          onChangeText={setOccasionName}
                          placeholder="e.g. Christmas"
                          placeholderTextColor="#8193AD"
                          style={styles.addFormInput}
                        />
                      </View>
                    </View>

                    {/* Recipients */}
                    <View style={styles.addFormField}>
                      <Text style={styles.addFormLabel}>Recipients</Text>

                      <Pressable
                        onPress={() =>
                          setOccasionRoleDropdownOpen(previous => !previous)
                        }
                        style={styles.addEventSelector}
                      >
                        <Text style={styles.addEventText}>
                          {occasionRecipientRole
                            ? occasionRecipientRole.replace(/_/g, ' ')
                            : 'All roles'}
                        </Text>

                        <MaterialCommunityIcons
                          name={
                            occasionRoleDropdownOpen
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={20}
                          color="#E2E8F0"
                        />
                      </Pressable>

                      {occasionRoleDropdownOpen && (
                        <View style={styles.addEventOptions}>
                          {[
                            { label: 'All roles', value: '' },
                            ...catalog.roles.map(role => ({
                              label: role.replace(/_/g, ' '),
                              value: role,
                            })),
                          ].map(option => (
                            <Pressable
                              key={option.value || 'all'}
                              onPress={() => {
                                setOccasionRecipientRole(option.value);
                                setOccasionRoleDropdownOpen(false);
                              }}
                              style={[
                                styles.addEventOption,
                                occasionRecipientRole === option.value &&
                                  styles.addEventOptionSelected,
                              ]}
                            >
                              <Text style={styles.addEventOptionText}>
                                {option.label}
                              </Text>

                              {occasionRecipientRole === option.value && (
                                <MaterialCommunityIcons
                                  name="check"
                                  size={18}
                                  color="#7DD3FC"
                                />
                              )}
                            </Pressable>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {(notificationEvent === 'bill_overdue' ||
                  notificationEvent === 'bill_due_soon') && (
                  <View style={styles.addFormField}>
                    <Text style={styles.addFormLabel}>Number of days</Text>

                    <TextInput
                      value={numberOfDays}
                      onChangeText={text =>
                        setNumberOfDays(text.replace(/[^0-9]/g, ''))
                      }
                      keyboardType="number-pad"
                      placeholder={
                        notificationEvent === 'bill_overdue' ? '7' : '3'
                      }
                      placeholderTextColor="#8193AD"
                      style={styles.addFormInput}
                      maxLength={4}
                    />
                  </View>
                )}

                {[
                  'student_birthday',
                  'bill_generated',
                  'payment_received',
                ].includes(notificationEvent) && (
                  <Text style={styles.addEventInfo}>
                    No additional event settings are required.
                  </Text>
                )}
              </View>

              {/* Message Template */}
              <View style={styles.addFormField}>
                <Text style={styles.addFormLabel}>Message template</Text>

                <TextInput
                  value={messageTemplate}
                  onChangeText={setMessageTemplate}
                  placeholder="Write the notification message..."
                  placeholderTextColor="#8193AD"
                  multiline
                  textAlignVertical="top"
                  style={styles.addTemplateInput}
                />
              </View>

              {/* Available Tags */}
              <View style={styles.addTagsSection}>
                <Text style={styles.addTagsLabel}>
                  Available tags — click to insert
                </Text>

                <View style={styles.addTagsRow}>
                  {availableTags.map(tag => (
                    <Pressable
                      key={tag}
                      onPress={() => insertTemplateTag(tag)}
                      style={styles.addTagChip}
                    >
                      <Text style={styles.addTagText}>{`{${tag}}`}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Delivery Channels */}
              <View style={styles.addDeliveryCard}>
                <Text style={styles.addDeliveryTitle}>
                  Additional delivery channels
                </Text>

                <Pressable
                  onPress={() =>
                    setNotificationSendEmail(previous => !previous)
                  }
                  disabled={catalog.channels?.email !== true}
                  style={styles.addCheckboxRow}
                  accessibilityRole="checkbox"
                  accessibilityState={{
                    checked: notificationSendEmail,
                    disabled: catalog.channels?.email !== true,
                  }}
                >
                  <MaterialCommunityIcons
                    name={
                      notificationSendEmail
                        ? 'checkbox-marked'
                        : 'checkbox-blank-outline'
                    }
                    size={22}
                    color={notificationSendEmail ? '#7DD3FC' : '#94A3B8'}
                  />

                  <Text style={styles.addCheckboxLabel}>Send Email</Text>
                </Pressable>
              </View>

              {/* Active */}
              <Pressable
                onPress={() => setNotificationActive(previous => !previous)}
                style={styles.addCheckboxRow}
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: notificationActive,
                }}
              >
                <MaterialCommunityIcons
                  name={
                    notificationActive
                      ? 'checkbox-marked'
                      : 'checkbox-blank-outline'
                  }
                  size={22}
                  color={notificationActive ? '#7DD3FC' : '#94A3B8'}
                />

                <Text style={styles.addActiveLabel}>Active</Text>
              </Pressable>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.addModalFooter}>
              <Pressable
                onPress={closeAddNotificationModal}
                style={styles.addCancelButton}
              >
                <Text style={styles.addButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleSaveNotification}
                disabled={savingNotification}
                accessibilityRole="button"
                accessibilityState={{ disabled: savingNotification }}
                style={({ pressed }) => [
                  styles.addSaveButton,
                  savingNotification && { opacity: 0.5 },
                  pressed && !savingNotification && { opacity: 0.8 },
                ]}
              >
                {savingNotification ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.addButtonText}>
                    {editingRuleId !== null
                      ? 'Update Notification'
                      : 'Save Notification'}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
