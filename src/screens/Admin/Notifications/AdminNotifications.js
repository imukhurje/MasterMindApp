// src/screens/Admin/Notifications/AdminNotifications.js

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
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../../api/client';
import styles from './AdminNotifications.styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AdminNotificationHistory from './AdminNotificationHistory';
import AdminAutoNotifications from './AdminAutoNotifications';
import AdminNotificationSettings from './AdminNotificationSettings';
import AdminNotificationWhatsAppErrors from './AdminNotificationWhatsAppErrors';

const MESSAGE_LIMIT = 200;
const USERS_PER_PAGE = 10;

const ROLE_OPTIONS = [
  { label: 'All roles', value: '' },
  { label: 'Super admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Teacher', value: 'teacher' },
  { label: 'Staff', value: 'staff' },
  { label: 'Parent', value: 'parent' },
  { label: 'Student', value: 'student' },
];

const NOTIFICATION_TABS = [
  { id: 'compose', label: 'Compose' },
  { id: 'history', label: 'History' },
  { id: 'auto', label: 'Auto Notifications' },
  { id: 'settings', label: 'Settings' },
  { id: 'whatsapp_errors', label: 'WhatsApp Send Errors' },
];

function getUserId(user) {
  return String(user?.id ?? '');
}

function getUserLabel(user) {
  const name = String(user?.name || 'Unnamed user').trim();
  const email = String(user?.email || '').trim();
  return email ? `${name} [${email}]` : name;
}

function getRoleLabel(user) {
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  return roles.length > 0 ? roles.join(', ') : 'Unknown';
}

function normalizeClasses(response) {
  const source = Array.isArray(response)
    ? response
    : Array.isArray(response?.classes)
    ? response.classes
    : Array.isArray(response?.data)
    ? response.data
    : [];

  return source
    .map((item, index) => ({
      value: String(
        item?.id ??
          item?.class_id ??
          item?.class_group_id ??
          item?.value ??
          index,
      ),
      label: String(
        item?.label ??
          item?.name ??
          item?.class_name ??
          item?.title ??
          `Class ${index + 1}`,
      ),
    }))
    .filter(item => item.value && item.label);
}

function Checkbox({ checked, onPress, disabled = false, label }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked, disabled }}
      hitSlop={8}
      style={({ pressed }) => [
        styles.checkbox,
        checked && styles.checkboxChecked,
        disabled && styles.controlDisabled,
        pressed && !disabled && styles.controlPressed,
      ]}
    >
      {checked ? <Text style={styles.checkboxTick}>✓</Text> : null}
    </Pressable>
  );
}

function SelectField({ label, value, options, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);

  const selectedOption =
    options.find(option => option.value === value) || options[0];

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [
          styles.selectField,
          disabled && styles.controlDisabled,
          pressed && !disabled && styles.controlPressed,
        ]}
      >
        <Text numberOfLines={1} style={styles.selectText}>
          {selectedOption?.label || label}
        </Text>

        <MaterialCommunityIcons name="chevron-down" size={21} color="#E2E8F0" />
      </Pressable>

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <Pressable
            style={styles.modalCard}
            onPress={event => event.stopPropagation()}
          >
            <Text style={styles.modalTitle}>{label}</Text>

            <FlatList
              data={options}
              keyExtractor={item => String(item.value ?? 'all')}
              style={styles.modalList}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const selected = item.value === value;

                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.modalOption,
                      selected && styles.modalOptionSelected,
                      pressed && styles.controlPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        selected && styles.modalOptionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>

                    {selected ? (
                      <Text style={styles.modalOptionCheck}>✓</Text>
                    ) : null}
                  </Pressable>
                );
              }}
            />

            <Pressable
              onPress={() => setOpen(false)}
              style={({ pressed }) => [
                styles.modalCloseButton,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const formatTemplatePreview = (body, variables = []) => {
  return String(body || '').replace(/\{\{\s*(\d+)\s*\}\}/g, (match, index) => {
    const field = variables[Number(index) - 1];
    return field ? `{{${field}}}` : match;
  });
};

export default function AdminNotifications({ navigation }) {
  const insets = useSafeAreaInsets();
  const latestRequestId = useRef(0);

  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const [classSearchText, setClassSearchText] = useState('');
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [appliedSearchText, setAppliedSearchText] = useState('');
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [appliedClassIds, setAppliedClassIds] = useState([]);
  const [users, setUsers] = useState([]);
  const [classOptions, setClassOptions] = useState([
    { label: 'All classes', value: '' },
  ]);
  const [selectedUserIds, setSelectedUserIds] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);

  const [activeTab, setActiveTab] = useState('compose');
  const [useTemplate, setUseTemplate] = useState(false);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedTemplateEvent, setSelectedTemplateEvent] = useState('');
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);

  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);

  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
  const [appliedLocationIds, setAppliedLocationIds] = useState([]);
  const [appliedRole, setAppliedRole] = useState('');
  const [campusSearch, setCampusSearch] = useState('');
  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);

  const [userPage, setUserPage] = useState(1);

  const [userPagination, setUserPagination] = useState({
    page: 1,
    per_page: USERS_PER_PAGE,
    total: 0,
    last_page: 1,
  });

  const showClassFilter = ['teacher', 'parent', 'student'].includes(
    selectedRole,
  );

  const filteredClassOptions = useMemo(() => {
    const query = classSearchText.trim().toLowerCase();

    return classOptions.filter(option => {
      const id = String(option.value);

      return (
        id !== '' &&
        !selectedClassIds.includes(id) &&
        option.label.toLowerCase().includes(query)
      );
    });
  }, [classOptions, classSearchText, selectedClassIds]);

  const selectedClasses = useMemo(() => {
    return classOptions.filter(option =>
      selectedClassIds.includes(String(option.value)),
    );
  }, [classOptions, selectedClassIds]);

  const toggleClassSelection = classId => {
    const id = String(classId);

    setSelectedClassIds(previous =>
      previous.includes(id)
        ? previous.filter(value => value !== id)
        : [...previous, id],
    );
  };

  const clearClassSelection = () => {
    setSelectedClassIds([]);
    setClassSearchText('');
  };

  const filteredLocationOptions = useMemo(() => {
    const query = campusSearch.trim().toLowerCase();

    return locations.filter(location => {
      const notSelected = !selectedLocationIds.includes(Number(location.id));

      const matchesSearch =
        !query || location.name.toLowerCase().includes(query);

      return notSelected && matchesSearch;
    });
  }, [locations, campusSearch, selectedLocationIds]);

  const selectedLocations = useMemo(
    () =>
      locations.filter(location =>
        selectedLocationIds.includes(Number(location.id)),
      ),
    [locations, selectedLocationIds],
  );

  const toggleLocation = useCallback(locationId => {
    const id = Number(locationId);

    setSelectedLocationIds(previous =>
      previous.includes(id)
        ? previous.filter(value => value !== id)
        : [...previous, id],
    );

    setCampusSearch('');
    setUserPage(1);
  }, []);

  const clearSelectedLocations = useCallback(() => {
    setSelectedLocationIds([]);
    setCampusSearch('');
    setUserPage(1);
  }, []);

  const visibleUsers = users;

  const totalFilteredUsers = userPagination.total;

  const totalUserPages = userPagination.last_page;

  const currentUserPage = userPagination.page;

  const pageStartIndex = (currentUserPage - 1) * userPagination.per_page;

  const paginatedUsers = users;

  const showingFrom = totalFilteredUsers === 0 ? 0 : pageStartIndex + 1;

  const showingTo = Math.min(pageStartIndex + users.length, totalFilteredUsers);

  const visibleUserIds = useMemo(
    () => paginatedUsers.map(getUserId).filter(Boolean),
    [paginatedUsers],
  );

  const allVisibleSelected =
    visibleUserIds.length > 0 &&
    visibleUserIds.every(userId => selectedUserIds.has(userId));

  const canSend =
    activeTab === 'compose' &&
    (useTemplate
      ? selectedTemplateEvent.trim().length > 0 &&
        templateOptions.some(item => item.value === selectedTemplateEvent)
      : message.trim().length > 0) &&
    selectedUserIds.size > 0 &&
    !sending &&
    !templatesLoading;

  const loadCurrentUser = useCallback(async () => {
    const response = await api('/api/me');

    const isAllowed =
      response?.is_admin === true ||
      response?.is_super_admin === true ||
      ['admin', 'super_admin'].includes(
        String(response?.actual_role || response?.role || '').toLowerCase(),
      );

    if (!isAllowed) {
      Alert.alert('Access denied', 'Only administrators can open this page.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      return null;
    }

    setCurrentUser(response);
    return response;
  }, [navigation]);

  const loadClasses = useCallback(async () => {
    try {
      setClassesLoading(true);
      const response = await api('/api/notifications/admin/classes');
      const normalized = normalizeClasses(response);

      setClassOptions([{ label: 'All classes', value: '' }, ...normalized]);
    } catch (error) {
      console.log('Notification classes API error:', error);
      setClassOptions([{ label: 'All classes', value: '' }]);
      Alert.alert('Classes', error?.message || 'Could not load classes.');
    } finally {
      setClassesLoading(false);
    }
  }, []);

  const loadNotificationTemplates = useCallback(async () => {
    try {
      setTemplatesLoading(true);

      const response = await api(
        '/api/notifications/admin/auto/whatsapp-settings',
      );

      if (response?.ok !== true) {
        throw new Error('Unable to load notification templates.');
      }

      const eventLabels = {
        student_birthday: 'Student birthday',
        annual_occasion: 'Festival / annual occasion',
        bill_overdue: 'Bill overdue',
        bill_due_soon: 'Bill due soon',
        bill_generated: 'Bill generated',
        payment_received: 'Payment received',
      };

      const events = response?.events || {};

      // Only configured templates are selectable.
      const options = Object.entries(eventLabels)
        .map(([eventType, label]) => {
          const config = events[eventType] || {};

          return {
            value: eventType,
            label,
            template: String(config.template || ''),
            body: String(config.body || ''),
            variables: Array.isArray(config.variables) ? config.variables : [],
          };
        })
        .filter(item => item.template.trim() && item.body.trim());

      setTemplateOptions(options);

      setSelectedTemplateEvent(previous =>
        options.some(item => item.value === previous) ? previous : '',
      );

      return options;
    } catch (error) {
      console.log('[NOTIFICATION TEMPLATES ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      Alert.alert('Templates', error?.message || 'Could not load templates.');

      return [];
    } finally {
      setTemplatesLoading(false);
    }
  }, []);

  const handleUseTemplateChange = async () => {
    const nextValue = !useTemplate;

    setUseTemplate(nextValue);
    setTemplateDropdownOpen(false);

    if (!nextValue) {
      setSelectedTemplateEvent('');
      return;
    }

    await loadNotificationTemplates();
  };

  const loadLocations = useCallback(async () => {
    try {
      setLocationsLoading(true);

      const response = await api('/api/notifications/admin/locations');

      if (response?.ok !== true) {
        throw new Error('Unable to load campuses.');
      }

      const rows = Array.isArray(response?.locations) ? response.locations : [];

      setLocations(
        rows
          .filter(item => item?.id != null)
          .map(item => ({
            id: Number(item.id),
            name: String(item.name || '').trim(),
          }))
          .filter(item => Number.isInteger(item.id) && item.name),
      );
    } catch (error) {
      console.log('[NOTIFICATION LOCATIONS ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      setLocations([]);
      Alert.alert('Campuses', error?.message || 'Could not load campuses.');
    } finally {
      setLocationsLoading(false);
    }
  }, []);

  const loadUsers = useCallback(
    async (
      roleValue = '',
      page = 1,
      locationIds = [],
      searchQuery = '',
      classIds = [],
    ) => {
      const requestId = ++latestRequestId.current;

      try {
        setUsersLoading(true);

        const query = [];

        // Role
        if (roleValue) {
          query.push(`role=${encodeURIComponent(roleValue)}`);
        }

        // Name / Email search
        const q = String(searchQuery || '').trim();

        if (q) {
          query.push(`q=${encodeURIComponent(q)}`);
        }

        // Selected class groups
        if (['teacher', 'parent', 'student'].includes(roleValue)) {
          classIds.forEach(id => {
            const classId = Number(id);

            if (Number.isInteger(classId) && classId > 0) {
              query.push(
                `class_group_ids%5B%5D=${encodeURIComponent(classId)}`,
              );
            }
          });
        }

        // Selected campuses
        locationIds.forEach(id => {
          const locationId = Number(id);

          if (Number.isInteger(locationId) && locationId > 0) {
            query.push(`location_ids%5B%5D=${encodeURIComponent(locationId)}`);
          }
        });

        query.push(`page=${encodeURIComponent(page)}`);
        query.push(`per_page=${USERS_PER_PAGE}`);

        const url = `/api/notifications/admin/users?${query.join('&')}`;

        console.log('[NOTIFICATION USERS REQUEST]', url);

        const response = await api(url);

        if (requestId !== latestRequestId.current) return;

        if (response?.ok !== true) {
          throw new Error('Unable to load notification users.');
        }

        const rows = Array.isArray(response.users) ? response.users : [];

        const pagination = response.pagination || {};

        setUsers(rows);

        setUserPagination({
          page: Number(pagination.page ?? page),
          per_page: Number(pagination.per_page ?? USERS_PER_PAGE),
          total: Number(pagination.total ?? rows.length),
          last_page: Math.max(1, Number(pagination.last_page ?? 1)),
        });

        setUserPage(Number(pagination.page ?? page));
      } catch (error) {
        if (requestId !== latestRequestId.current) return;

        console.log('[NOTIFICATION USERS ERROR]', {
          status: error?.status,
          message: error?.message,
        });

        Alert.alert(
          'Notification Users',
          error?.message || 'Could not load users.',
        );
      } finally {
        if (requestId === latestRequestId.current) {
          setUsersLoading(false);
        }
      }
    },
    [],
  );

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const me = await loadCurrentUser();
      if (!me) return;
      await Promise.all([loadUsers('', 1, []), loadLocations()]);
    } catch (error) {
      console.log('Admin notifications initialization error:', error);
      Alert.alert(
        'Admin notifications',
        error?.message || 'Could not open admin notifications.',
      );
    } finally {
      setLoading(false);
    }
  }, [loadCurrentUser, loadUsers, loadLocations]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  async function handleRoleChange(nextRole) {
    setUserPage(1);
    setSelectedRole(nextRole);

    // Reset previous class selection
    setSelectedClassIds([]);
    setAppliedClassIds([]);
    setClassSearchText('');
    setClassDropdownOpen(false);

    // Show/load classes for Teacher, Parent and Student
    const needsClassFilter = ['teacher', 'parent', 'student'].includes(
      nextRole,
    );

    if (needsClassFilter && classOptions.length <= 1) {
      await loadClasses();
    }
  }

  async function applyFilters() {
    const locationIds = [...selectedLocationIds];
    const searchQuery = searchText.trim();

    const classIds = ['teacher', 'parent', 'student'].includes(selectedRole)
      ? [...selectedClassIds]
      : [];

    setUserPage(1);

    setAppliedRole(selectedRole);
    setAppliedLocationIds(locationIds);
    setAppliedSearchText(searchQuery);
    setAppliedClassIds(classIds);

    setClassDropdownOpen(false);
    setClassSearchText('');

    setCampusDropdownOpen(false);
    setCampusSearch('');

    await loadUsers(selectedRole, 1, locationIds, searchQuery, classIds);
  }

  async function clearFilters() {
    setUserPage(1);

    setSelectedRole('');

    setClassSearchText('');
    setClassDropdownOpen(false);
    setSearchText('');

    setAppliedRole('');
    setAppliedSearchText('');
    setSelectedClassIds([]);
    setAppliedClassIds([]);
    setClassSearchText('');
    setClassDropdownOpen(false);

    setSelectedLocationIds([]);
    setAppliedLocationIds([]);

    setCampusSearch('');
    setCampusDropdownOpen(false);

    await loadUsers('', 1, []);
  }

  async function onRefresh() {
    try {
      setRefreshing(true);

      const requests = [
        loadCurrentUser(),
        loadUsers(
          appliedRole,
          userPagination.page,
          appliedLocationIds,
          appliedSearchText,
          appliedClassIds,
        ),
        loadLocations(),
      ];

      if (['teacher', 'parent', 'student'].includes(appliedRole)) {
        requests.push(loadClasses());
      }

      await Promise.all(requests);
    } finally {
      setRefreshing(false);
    }
  }

  function toggleUser(user) {
    const userId = getUserId(user);
    if (!userId) return;

    setSelectedUserIds(current => {
      const next = new Set(current);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }

  function toggleAllVisibleUsers() {
    setSelectedUserIds(current => {
      const next = new Set(current);

      if (allVisibleSelected) {
        visibleUserIds.forEach(userId => next.delete(userId));
      } else {
        visibleUserIds.forEach(userId => next.add(userId));
      }

      return next;
    });
  }

  const changeUserPage = useCallback(
    async nextPage => {
      if (usersLoading) return;

      if (
        nextPage < 1 ||
        nextPage > userPagination.last_page ||
        nextPage === userPagination.page
      ) {
        return;
      }

      await loadUsers(
        appliedRole,
        nextPage,
        appliedLocationIds,
        appliedSearchText,
        appliedClassIds,
      );
    },
    [
      usersLoading,
      userPagination.last_page,
      userPagination.page,
      appliedRole,
      appliedLocationIds,
      appliedSearchText,
      appliedClassIds,
      loadUsers,
    ],
  );

  async function sendNotification() {
    if (sending || activeTab !== 'compose') {
      return;
    }

    const isTemplateMode = useTemplate;

    const trimmedMessage = isTemplateMode ? '' : message.trim();

    const templateEvent = isTemplateMode ? selectedTemplateEvent : '';

    // Validate template or message
    if (isTemplateMode) {
      const selectedTemplate = templateOptions.find(
        item => item.value === templateEvent,
      );

      if (!selectedTemplate) {
        Alert.alert(
          'Template Required',
          'Please select a notification template.',
        );
        return;
      }
    } else if (!trimmedMessage) {
      Alert.alert('Message Required', 'Please enter a notification message.');
      return;
    }

    // Selected recipient IDs
    const recipientIds = [
      ...new Set(
        Array.from(selectedUserIds)
          .map(Number)
          .filter(id => Number.isInteger(id) && id > 0),
      ),
    ];

    if (recipientIds.length === 0) {
      Alert.alert(
        'Recipients Required',
        'Please select at least one recipient.',
      );
      return;
    }

    try {
      setSending(true);

      const locationIds = [
        ...new Set(
          appliedLocationIds
            .map(Number)
            .filter(id => Number.isInteger(id) && id > 0),
        ),
      ];

      const payload = {
        message: trimmedMessage,
        template_event: templateEvent,
        recipient_ids: recipientIds,
        location_ids: locationIds,
        send_email: sendEmail,
        send_sms: false,
        send_whatsapp: false,
      };

      console.log('[SEND NOTIFICATION REQUEST]', {
        mode: isTemplateMode ? 'template' : 'message',
        payload,
      });

      const response = await api('/api/notifications/admin/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response?.ok !== true) {
        throw new Error('Could not send the notification.');
      }

      const sentCount = Number(response.count ?? 0);
      const deliveryCounts = response.delivery_counts || {};

      // Reset only after successful submission.
      if (isTemplateMode) {
        setSelectedTemplateEvent('');
      } else {
        setMessage('');
      }

      setSelectedUserIds(new Set());
      setSendEmail(false);

      Alert.alert(
        'Notification Sent',
        `Notification sent successfully to ${sentCount} recipient(s).` +
          (sendEmail
            ? `\nEmail deliveries: ${Number(deliveryCounts.email ?? 0)}`
            : ''),
      );
    } catch (error) {
      console.log('[SEND NOTIFICATION ERROR]', {
        status: error?.status,
        message: error?.message,
        payload: error?.payload,
      });

      Alert.alert(
        'Send Failed',
        error?.message || 'Could not send the notification.',
      );
    } finally {
      setSending(false);
    }
  }

  function renderUser({ item }) {
    const userId = getUserId(item);
    const selected = selectedUserIds.has(userId);

    return (
      <Pressable
        onPress={() => toggleUser(item)}
        style={({ pressed }) => [
          styles.userRow,
          selected && styles.userRowSelected,
          pressed && styles.controlPressed,
        ]}
      >
        <Checkbox
          checked={selected}
          onPress={() => toggleUser(item)}
          label={`Select ${getUserLabel(item)}`}
        />

        <Text numberOfLines={2} style={styles.userName}>
          {getUserLabel(item)}
        </Text>

        <Text numberOfLines={2} style={styles.userRole}>
          {getRoleLabel(item)}
        </Text>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading admin notifications...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* FIXED HEADER */}
      <View style={styles.fixedHeader}>
        {/* FIXED TABS */}
        {/* <View style={styles.notificationTabsContainer}> */}
        <View style={styles.notificationTabsRow}>
          {NOTIFICATION_TABS.map(tab => {
            const selected = activeTab === tab.id;

            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  styles.notificationTab,
                  selected && styles.notificationTabActive,
                  pressed && styles.controlPressed,
                ]}
              >
                <Text
                  style={[
                    styles.notificationTabText,
                    selected && styles.notificationTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {/* </View> */}
      </View>

      {/* SCROLLABLE BODY */}
      <ScrollView
        style={styles.pageScroll}
        contentContainerStyle={styles.pageScrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          activeTab === 'compose' ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
              colors={['#FFFFFF']}
            />
          ) : undefined
        }
      >
        <View style={styles.content}>
          {activeTab === 'compose' ? (
            <>
              {/* COMPOSE FORM */}
              <View style={styles.headerSection}>
                {/* Use a template */}
                <Pressable
                  onPress={handleUseTemplateChange}
                  accessibilityRole="checkbox"
                  accessibilityLabel="Use a template"
                  accessibilityState={{ checked: useTemplate }}
                  style={styles.useTemplateRow}
                >
                  <View
                    style={[
                      styles.checkbox,
                      useTemplate && styles.checkboxChecked,
                    ]}
                  >
                    {useTemplate ? (
                      <Text style={styles.checkboxTick}>✓</Text>
                    ) : null}
                  </View>

                  <Text style={styles.useTemplateText}>Use a template</Text>
                </Pressable>

                {/* Template Selection */}
                {useTemplate && (
                  <View style={styles.templateSection}>
                    <Text style={styles.fieldLabel}>Template</Text>

                    <Pressable
                      onPress={() =>
                        setTemplateDropdownOpen(previous => !previous)
                      }
                      disabled={templatesLoading}
                      style={styles.templateSelector}
                    >
                      <Text
                        style={styles.templateSelectorText}
                        numberOfLines={1}
                      >
                        {templatesLoading
                          ? 'Loading templates...'
                          : templateOptions.find(
                              item => item.value === selectedTemplateEvent,
                            )?.label || 'Select a template'}
                      </Text>

                      {templatesLoading ? (
                        <ActivityIndicator size="small" color="#7DD3FC" />
                      ) : (
                        <MaterialCommunityIcons
                          name={
                            templateDropdownOpen ? 'chevron-up' : 'chevron-down'
                          }
                          size={20}
                          color="#E2E8F0"
                        />
                      )}
                    </Pressable>

                    {templateDropdownOpen && !templatesLoading && (
                      <View style={styles.templateDropdown}>
                        <Pressable
                          onPress={() => {
                            setSelectedTemplateEvent('');
                            setTemplateDropdownOpen(false);
                          }}
                          style={styles.templateDropdownOption}
                        >
                          <Text style={styles.templateDropdownText}>
                            Select a template
                          </Text>
                        </Pressable>

                        {templateOptions.map(item => (
                          <Pressable
                            key={item.value}
                            onPress={() => {
                              setSelectedTemplateEvent(item.value);
                              setTemplateDropdownOpen(false);
                            }}
                            style={[
                              styles.templateDropdownOption,
                              selectedTemplateEvent === item.value &&
                                styles.templateDropdownOptionSelected,
                            ]}
                          >
                            <Text style={styles.templateDropdownText}>
                              {item.label}
                            </Text>

                            {selectedTemplateEvent === item.value && (
                              <MaterialCommunityIcons
                                name="check"
                                size={18}
                                color="#7DD3FC"
                              />
                            )}
                          </Pressable>
                        ))}

                        {templateOptions.length === 0 && (
                          <Text style={styles.templateEmptyText}>
                            No configured templates found.
                          </Text>
                        )}
                      </View>
                    )}

                    {selectedTemplateEvent !== '' && (
                      <View style={styles.templatePreview}>
                        <Text style={styles.templatePreviewLabel}>
                          Template preview
                        </Text>

                        <Text style={styles.templatePreviewText}>
                          {(() => {
                            const selected = templateOptions.find(
                              item => item.value === selectedTemplateEvent,
                            );

                            return formatTemplatePreview(
                              selected?.body,
                              selected?.variables,
                            );
                          })()}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Message - show only when Use a template is unchecked */}
                {!useTemplate && (
                  <>
                    <Text style={styles.fieldLabel}>
                      Message (max {MESSAGE_LIMIT} chars)
                    </Text>

                    <TextInput
                      value={message}
                      onChangeText={setMessage}
                      maxLength={MESSAGE_LIMIT}
                      multiline
                      textAlignVertical="top"
                      placeholder="Write the notification message..."
                      placeholderTextColor="#64748B"
                      style={styles.messageInput}
                      editable={!sending}
                    />

                    <Text style={styles.characterCount}>
                      {message.length}/{MESSAGE_LIMIT}
                    </Text>
                  </>
                )}

                {/* Additional Delivery Channels */}
                <View style={styles.deliveryChannelsContainer}>
                  <Text style={styles.deliveryChannelsTitle}>
                    Additional delivery channels
                  </Text>

                  <Pressable
                    onPress={() => setSendEmail(previous => !previous)}
                    accessibilityRole="checkbox"
                    accessibilityLabel="Send Email"
                    accessibilityState={{ checked: sendEmail }}
                    style={styles.sendEmailRow}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        sendEmail && styles.checkboxChecked,
                      ]}
                    >
                      {sendEmail ? (
                        <Text style={styles.checkboxTick}>✓</Text>
                      ) : null}
                    </View>

                    <Text style={styles.sendEmailText}>Send Email</Text>
                  </Pressable>
                </View>

                {/* Recipient Filters */}
                <View style={styles.filterCard}>
                  <View style={styles.mobileRoleClassRow}>
                    <View style={styles.flexField}>
                      <SelectField
                        label="Select role"
                        value={selectedRole}
                        options={ROLE_OPTIONS}
                        onChange={handleRoleChange}
                        disabled={usersLoading}
                      />
                    </View>

                    {showClassFilter && (
                      <View style={styles.flexField}>
                        <View style={styles.classSearchContainer}>
                          {/* Selected chips and searchable input */}
                          <View style={styles.classMultiSelectBox}>
                            {selectedClasses.map(item => (
                              <Pressable
                                key={String(item.value)}
                                onPress={() => toggleClassSelection(item.value)}
                                style={styles.classSelectedChip}
                                accessibilityRole="button"
                                accessibilityLabel={`Remove ${item.label}`}
                              >
                                <Text
                                  style={styles.classSelectedChipText}
                                  numberOfLines={1}
                                >
                                  {item.label}
                                </Text>

                                <MaterialCommunityIcons
                                  name="close"
                                  size={14}
                                  color="#E2E8F0"
                                />
                              </Pressable>
                            ))}

                            <TextInput
                              value={classSearchText}
                              onChangeText={value => {
                                setClassSearchText(value);
                                setClassDropdownOpen(true);
                              }}
                              onFocus={() => setClassDropdownOpen(true)}
                              placeholder={
                                classesLoading
                                  ? 'Loading classes...'
                                  : selectedClassIds.length > 0
                                  ? 'Search more classes...'
                                  : 'Search current-year classes...'
                              }
                              placeholderTextColor="#94A3B8"
                              editable={!classesLoading && !usersLoading}
                              autoCorrect={false}
                              style={styles.classMultiSelectInput}
                            />

                            <Pressable
                              onPress={() => {
                                setClassDropdownOpen(previous => !previous);
                              }}
                              disabled={classesLoading || usersLoading}
                              style={styles.classDropdownButton}
                            >
                              <MaterialCommunityIcons
                                name={
                                  classDropdownOpen
                                    ? 'chevron-up'
                                    : 'chevron-down'
                                }
                                size={20}
                                color="#AFC0D8"
                              />
                            </Pressable>
                          </View>

                          {/* Dropdown */}
                          {classDropdownOpen && !classesLoading && (
                            <View style={styles.classDropdown}>
                              <ScrollView
                                style={styles.classDropdownScroll}
                                nestedScrollEnabled
                                keyboardShouldPersistTaps="always"
                              >
                                {filteredClassOptions.length === 0 ? (
                                  <Text style={styles.classEmptyText}>
                                    No more matching classes.
                                  </Text>
                                ) : (
                                  filteredClassOptions.map(item => (
                                    <Pressable
                                      key={String(item.value)}
                                      onPress={() => {
                                        toggleClassSelection(item.value);
                                        setClassSearchText('');
                                        // Keep dropdown open for multi-selection
                                      }}
                                      style={styles.classDropdownItem}
                                    >
                                      <Text style={styles.classDropdownText}>
                                        {item.label}
                                      </Text>

                                      <MaterialCommunityIcons
                                        name="plus"
                                        size={18}
                                        color="#7DD3FC"
                                      />
                                    </Pressable>
                                  ))
                                )}
                              </ScrollView>

                              <View style={styles.classDropdownFooter}>
                                <Pressable
                                  onPress={clearClassSelection}
                                  style={styles.classDropdownFooterButton}
                                >
                                  <Text style={styles.classClearText}>
                                    Clear Selection
                                  </Text>
                                </Pressable>

                                <Pressable
                                  onPress={() => {
                                    setClassDropdownOpen(false);
                                    setClassSearchText('');
                                  }}
                                  style={styles.classDoneButton}
                                >
                                  <Text style={styles.classDoneText}>Done</Text>
                                </Pressable>
                              </View>
                            </View>
                          )}
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Campus Multi-Select Filter */}
                  <View style={styles.campusFilterContainer}>
                    <Pressable
                      onPress={() =>
                        setCampusDropdownOpen(previous => !previous)
                      }
                      disabled={locationsLoading}
                      style={styles.campusFilterBox}
                    >
                      {selectedLocations.length > 0 && (
                        <View style={styles.campusChipsRow}>
                          {selectedLocations.map(location => (
                            <Pressable
                              key={String(location.id)}
                              onPress={() => toggleLocation(location.id)}
                              style={styles.campusChip}
                            >
                              <Text
                                numberOfLines={1}
                                style={styles.campusChipText}
                              >
                                {location.name}
                              </Text>

                              <MaterialCommunityIcons
                                name="close"
                                size={15}
                                color="#DCEBFF"
                              />
                            </Pressable>
                          ))}
                        </View>
                      )}

                      <View style={styles.campusFilterInputRow}>
                        <Text style={styles.campusFilterPlaceholder}>
                          {locationsLoading
                            ? 'Loading campuses...'
                            : 'Filter recipient campuses...'}
                        </Text>

                        <MaterialCommunityIcons
                          name={
                            campusDropdownOpen ? 'chevron-up' : 'chevron-down'
                          }
                          size={20}
                          color="#AFC0D8"
                        />
                      </View>
                    </Pressable>

                    {campusDropdownOpen && (
                      <View style={styles.campusDropdown}>
                        <TextInput
                          value={campusSearch}
                          onChangeText={setCampusSearch}
                          placeholder="Search campuses..."
                          placeholderTextColor="#94A3B8"
                          style={styles.campusSearchInput}
                          autoCorrect={false}
                        />

                        {filteredLocationOptions.length === 0 ? (
                          <Text style={styles.campusEmptyText}>
                            No matching campuses.
                          </Text>
                        ) : (
                          filteredLocationOptions.map(location => (
                            <Pressable
                              key={String(location.id)}
                              onPress={() => toggleLocation(location.id)}
                              style={styles.campusOption}
                            >
                              <Text style={styles.campusOptionText}>
                                {location.name}
                              </Text>

                              <MaterialCommunityIcons
                                name="plus"
                                size={19}
                                color="#93C5FD"
                              />
                            </Pressable>
                          ))
                        )}

                        <View style={styles.campusDropdownActions}>
                          <Pressable
                            onPress={clearSelectedLocations}
                            style={styles.campusClearButton}
                          >
                            <Text style={styles.campusActionText}>
                              Clear Selection
                            </Text>
                          </Pressable>

                          <Pressable
                            onPress={() => {
                              setCampusDropdownOpen(false);
                              setCampusSearch('');
                            }}
                            style={styles.campusDoneButton}
                          >
                            <Text style={styles.campusDoneText}>Done</Text>
                          </Pressable>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Search */}
                  <View style={styles.searchRow}>
                    <TextInput
                      value={searchText}
                      onChangeText={setSearchText}
                      placeholder="Search by name or email..."
                      placeholderTextColor="#64748B"
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="search"
                      onSubmitEditing={applyFilters}
                      style={styles.searchInput}
                    />

                    <Pressable
                      onPress={applyFilters}
                      disabled={usersLoading}
                      style={({ pressed }) => [
                        styles.searchButton,
                        usersLoading && styles.controlDisabled,
                        pressed && !usersLoading && styles.controlPressed,
                      ]}
                    >
                      {usersLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.searchButtonText}>Search</Text>
                      )}
                    </Pressable>

                    <Pressable
                      onPress={clearFilters}
                      disabled={usersLoading}
                      style={({ pressed }) => [
                        styles.clearButton,
                        usersLoading && styles.controlDisabled,
                        pressed && !usersLoading && styles.controlPressed,
                      ]}
                    >
                      <Text style={styles.clearButtonText}>Clear</Text>
                    </Pressable>
                  </View>
                </View>

                <Text style={styles.showingText}>
                  Showing {totalFilteredUsers} users
                </Text>
              </View>

              {/* User Pagination */}
              <View style={styles.userPaginationRow}>
                <Text style={styles.userPaginationInfo}>
                  Showing {showingFrom}-{showingTo} of {totalFilteredUsers}{' '}
                  users
                </Text>

                <View style={styles.userPaginationButtons}>
                  <Pressable
                    disabled={usersLoading || currentUserPage <= 1}
                    onPress={() => changeUserPage(currentUserPage - 1)}
                    style={[
                      styles.userPageButton,
                      currentUserPage <= 1 && styles.controlDisabled,
                    ]}
                  >
                    <Text style={styles.userPageButtonText}>Prev</Text>
                  </Pressable>

                  <View style={styles.currentPageBadge}>
                    <Text style={styles.currentPageText}>
                      {currentUserPage} / {totalUserPages}
                    </Text>
                  </View>

                  <Pressable
                    disabled={usersLoading || currentUserPage >= totalUserPages}
                    onPress={() => changeUserPage(currentUserPage + 1)}
                    style={[
                      styles.userPageButton,
                      currentUserPage >= totalUserPages &&
                        styles.controlDisabled,
                    ]}
                  >
                    <Text style={styles.userPageButtonText}>Next</Text>
                  </Pressable>
                </View>
              </View>

              {/* RECIPIENTS TABLE */}
              <View style={styles.tableCard}>
                <View style={styles.tableHeader}>
                  <Checkbox
                    checked={allVisibleSelected}
                    onPress={toggleAllVisibleUsers}
                    disabled={users.length === 0 || usersLoading}
                    label="Select all visible users"
                  />

                  <Text style={styles.tableHeaderUser}>User</Text>

                  <Text style={styles.tableHeaderRole}>Role</Text>
                </View>

                {/* Normal View instead of nested FlatList */}
                <View style={styles.userList}>
                  {usersLoading ? (
                    <View style={styles.emptyState}>
                      <ActivityIndicator size="large" color="#7DD3FC" />

                      <Text style={styles.emptyStateText}>
                        Loading users...
                      </Text>
                    </View>
                  ) : users.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateTitle}>No users found</Text>

                      <Text style={styles.emptyStateText}>
                        Change the role or search criteria and try again.
                      </Text>
                    </View>
                  ) : (
                    paginatedUsers.map(item => (
                      <View key={getUserId(item)}>{renderUser({ item })}</View>
                    ))
                  )}
                </View>
              </View>
            </>
          ) : activeTab === 'history' ? (
            <AdminNotificationHistory />
          ) : activeTab === 'auto' ? (
            <AdminAutoNotifications />
          ) : activeTab === 'settings' ? (
            <AdminNotificationSettings />
          ) : activeTab === 'whatsapp_errors' ? (
            <AdminNotificationWhatsAppErrors />
          ) : (
            /* OTHER FOUR TABS */
            <View style={styles.tabPlaceholder}>
              <Text style={styles.tabPlaceholderTitle}>
                {NOTIFICATION_TABS.find(tab => tab.id === activeTab)?.label ||
                  'Notifications'}
              </Text>

              <Text style={styles.tabPlaceholderText}>
                This section is not connected yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FIXED FOOTER: COMPOSE ONLY */}
      {activeTab === 'compose' && (
        <View
          style={[
            styles.footer,
            {
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}
        >
          <Text style={styles.selectedCount}>
            Recipients selected: {selectedUserIds.size}
          </Text>

          <Pressable
            onPress={sendNotification}
            disabled={!canSend}
            style={({ pressed }) => [
              styles.sendButton,
              !canSend && styles.sendButtonDisabled,
              pressed && canSend && styles.controlPressed,
            ]}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.sendButtonText}>Send Notification</Text>
            )}
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
