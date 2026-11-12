import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  AppState,
  Linking,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../api/client';
import { CLASSROOM_API, createClassroom } from './classroomApi';
import styles from './AdminClassroomCreate.styles';
import { Calendar } from 'react-native-calendars';

const COLORS = {
  text: '#F8FAFC',
  muted: '#AFC0D8',
  border: '#3B7197',
  primary: '#2563EB',
};

function SelectionField({ label, value, placeholder, onPress, disabled }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.selectField,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[styles.selectText, !value && styles.placeholderText]}
        >
          {value || placeholder}
        </Text>

        <MaterialCommunityIcons
          name="chevron-down"
          size={21}
          color={COLORS.text}
        />
      </Pressable>
    </View>
  );
}

export default function AdminClassroomCreate() {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState(null);
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [provider] = useState('google');
  const [googleAccountId, setGoogleAccountId] = useState(null);
  const [note, setNote] = useState('');

  const [classes, setClasses] = useState([]);
  const [googleAccounts, setGoogleAccounts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerType, setPickerType] = useState(null);

  const [datePickerType, setDatePickerType] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('10');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [timePickerType, setTimePickerType] = useState(null);
  const [connectingGoogle, setConnectingGoogle] = useState(false);

  const googleAuthStartedRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  const pad2 = value => String(value).padStart(2, '0');

  const dateToKey = date => {
    return [
      date.getFullYear(),
      pad2(date.getMonth() + 1),
      pad2(date.getDate()),
    ].join('-');
  };

  const openDatePicker = type => {
    const existingValue = type === 'start' ? startsAt : endsAt;

    // Existing format: DD-MM-YYYY HH:mm
    const match = existingValue.match(
      /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/,
    );

    if (match) {
      setSelectedDate(`${match[3]}-${match[2]}-${match[1]}`);
      setSelectedHour(match[4]);
      setSelectedMinute(match[5]);
    } else {
      setSelectedDate(dateToKey(new Date()));
      setSelectedHour('10');
      setSelectedMinute('00');
    }

    setDatePickerType(type);
    setTimePickerType(null);
  };

  const saveDateSelection = () => {
    if (!selectedDate) {
      Alert.alert('Select Date', 'Please select a date.');
      return;
    }

    const [year, month, day] = selectedDate.split('-');

    const formatted = `${day}-${month}-${year} ${selectedHour}:${selectedMinute}`;

    if (datePickerType === 'start') {
      setStartsAt(formatted);
    } else {
      setEndsAt(formatted);
    }

    setDatePickerType(null);
    setTimePickerType(null);
  };

  const clearDateSelection = () => {
    if (datePickerType === 'start') {
      setStartsAt('');
    } else {
      setEndsAt('');
    }

    setDatePickerType(null);
    setTimePickerType(null);
  };

  const loadOptions = useCallback(async () => {
    try {
      setLoading(true);

      const [onboardingResult, groupsResult, accountsResult] =
        await Promise.allSettled([
          api('/api/settings/v1/onboarding'),
          api('/api/class-groups'),
          api('/api/video-accounts?provider=google'),
        ]);

      // Prefer the current class groups returned by the API.
      const groupRows =
        groupsResult.status === 'fulfilled' &&
        Array.isArray(groupsResult.value?.classes)
          ? groupsResult.value.classes
          : [];

      const onboardingRows =
        onboardingResult.status === 'fulfilled' &&
        Array.isArray(onboardingResult.value?.classes)
          ? onboardingResult.value.classes
          : [];

      const source = groupRows.length ? groupRows : onboardingRows;

      setClasses(
        source
          .filter(item => item?.id != null)
          .map(item => ({
            id: Number(item.id),
            label:
              item.label ||
              [item.name, item.section]
                .filter(Boolean)
                .join(' (')
                .replace(/\($/, '') + (item.section ? ')' : ''),
          })),
      );

      const accounts =
        accountsResult.status === 'fulfilled' &&
        Array.isArray(accountsResult.value?.items)
          ? accountsResult.value.items
          : [];

      setGoogleAccounts(accounts);

      if (
        groupsResult.status === 'rejected' &&
        onboardingResult.status === 'rejected'
      ) {
        Alert.alert(
          'Unable to Load Classes',
          'Could not load classes. Please try again.',
        );
      }
    } catch (error) {
      console.log('Create classroom options error:', error);

      Alert.alert(
        'Something Went Wrong',
        'Could not load classroom information.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOptions();
    }, [loadOptions]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      const wasInBackground =
        appStateRef.current === 'background' ||
        appStateRef.current === 'inactive';

      const returnedToApp = wasInBackground && nextAppState === 'active';

      appStateRef.current = nextAppState;

      if (returnedToApp && googleAuthStartedRef.current) {
        googleAuthStartedRef.current = false;

        // Refresh connected accounts after returning.
        loadOptions();
      }
    });

    return () => subscription.remove();
  }, [loadOptions]);

  const selectedClass = classes.find(
    item => Number(item.id) === Number(classId),
  );

  const selectedAccount = googleAccounts.find(
    item => String(item.id) === String(googleAccountId),
  );

  const accountLabel = account =>
    account?.email ||
    account?.name ||
    account?.label ||
    `Google Account ${account?.id}`;

  const pickerItems =
    pickerType === 'class'
      ? classes
      : pickerType === 'account'
      ? googleAccounts
      : [];

  const parseDate = value => {
    if (!value.trim()) return null;

    // Format: DD-MM-YYYY HH:mm
    const match = value
      .trim()
      .match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})$/);

    if (!match) return undefined;

    const [, dd, mm, yyyy, hh, min] = match.map(Number);

    const date = new Date(yyyy, mm - 1, dd, hh, min, 0);

    if (
      date.getFullYear() !== yyyy ||
      date.getMonth() !== mm - 1 ||
      date.getDate() !== dd ||
      date.getHours() !== hh ||
      date.getMinutes() !== min
    ) {
      return undefined;
    }

    return date;
  };

  const handleConnectNew = async () => {
    if (connectingGoogle || saving) {
      return;
    }

    try {
      setConnectingGoogle(true);

      // Start Google OAuth connection.
      const response = await api('/api/integrations/google/start', {
        method: 'POST',
      });

      const authUrl = String(response?.url || '').trim();

      const parsedUrl = new URL(authUrl);

      console.log('[GOOGLE OAUTH DEBUG]', {
        host: parsedUrl.hostname,
        clientIdPresent: Boolean(parsedUrl.searchParams.get('client_id')),
        redirectUriPresent: Boolean(parsedUrl.searchParams.get('redirect_uri')),
        responseType: parsedUrl.searchParams.get('response_type'),
        scopePresent: Boolean(parsedUrl.searchParams.get('scope')),
      });

      if (!authUrl) {
        throw new Error('Google sign-in link was not returned.');
      }

      // Only open HTTPS authorization URLs.
      if (!/^https:\/\//i.test(authUrl)) {
        throw new Error('Invalid Google authorization URL.');
      }

      const supported = await Linking.canOpenURL(authUrl);

      if (!supported) {
        throw new Error('Unable to open Google sign-in.');
      }

      googleAuthStartedRef.current = true;

      if (!parsedUrl.searchParams.get('client_id')) {
        Alert.alert(
          'Google Connection Unavailable',
          'Google account connection is not configured correctly. Please contact your administrator.',
        );
        return;
      }

      // Open the external browser for OAuth.
      await Linking.openURL(authUrl);
    } catch (error) {
      googleAuthStartedRef.current = false;

      console.log('[GOOGLE CONNECTION ERROR]', {
        status: error?.status,
        code: error?.code,
        message: error?.message,
      });

      Alert.alert(
        'Google Connection Failed',
        'Unable to connect your Google account. Please try again.',
      );
    } finally {
      setConnectingGoogle(false);
    }
  };

  const handleCreate = async () => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      Alert.alert('Validation', 'Please enter classroom title.');
      return;
    }

    if (!classId) {
      Alert.alert('Validation', 'Please select a class.');
      return;
    }

    const startDate = parseDate(startsAt);
    const endDate = parseDate(endsAt);

    if (startDate === undefined) {
      Alert.alert('Invalid Start Date', 'Use DD-MM-YYYY HH:mm format.');
      return;
    }

    if (endDate === undefined) {
      Alert.alert('Invalid End Date', 'Use DD-MM-YYYY HH:mm format.');
      return;
    }

    if (startDate && endDate && endDate.getTime() <= startDate.getTime()) {
      Alert.alert('Invalid Date Range', 'End date must be after start date.');
      return;
    }

    if (!googleAccountId) {
      Alert.alert(
        'Google Account Required',
        'Please select a connected Google Account.',
      );
      return;
    }

    if (!CLASSROOM_API.create) {
      Alert.alert(
        'Create Unavailable',
        'Classroom creation is not available yet.',
      );
      return;
    }

    try {
      setSaving(true);

      // Provisional payload.
      // Match these keys with the backend POST contract.
      await createClassroom({
        title: cleanTitle,
        class_group_id: Number(classId),
        starts_at: startDate ? startDate.toISOString() : null,
        ends_at: endDate ? endDate.toISOString() : null,
        provider,
        video_account_id: googleAccountId,
        description: note.trim(),
      });

      Alert.alert(
        'Classroom Created',
        'Your classroom has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.log('Create classroom error:', {
        status: error?.status,
        code: error?.code,
        message: error?.message,
      });

      Alert.alert(
        'Unable to Create Classroom',
        'Could not create classroom. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Title *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            editable={!saving}
            style={styles.input}
            placeholder="e.g., Algebra Doubt Clearing"
            placeholderTextColor="#8291A9"
          />
        </View>

        {/* Class */}
        <SelectionField
          label="Class *"
          value={selectedClass?.label}
          placeholder={loading ? 'Loading classes...' : 'Select...'}
          disabled={loading || saving}
          onPress={() => setPickerType('class')}
        />

        {/* Starts At */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Starts At (optional)</Text>

          <Pressable
            onPress={() => openDatePicker('start')}
            disabled={saving}
            style={({ pressed }) => [
              styles.dateInputRow,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.datePickerValue,
                !startsAt && styles.placeholderText,
              ]}
            >
              {startsAt || 'DD-MM-YYYY HH:mm'}
            </Text>

            <MaterialCommunityIcons
              name="calendar-clock"
              size={21}
              color="#AFC0D8"
            />
          </Pressable>
        </View>

        {/* Ends At */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Ends At (optional)</Text>

          <Pressable
            onPress={() => openDatePicker('end')}
            disabled={saving}
            style={({ pressed }) => [
              styles.dateInputRow,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.datePickerValue,
                !endsAt && styles.placeholderText,
              ]}
            >
              {endsAt || 'DD-MM-YYYY HH:mm'}
            </Text>

            <MaterialCommunityIcons
              name="calendar-clock"
              size={21}
              color="#AFC0D8"
            />
          </Pressable>
        </View>

        {/* Provider */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Provider</Text>

          <View style={styles.selectField}>
            <Text style={styles.selectText}>Google Meet</Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color="#AFC0D8"
            />
          </View>
        </View>

        {/* Google Account */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Google Account *</Text>

          <View style={styles.accountRow}>
            <View style={{ flex: 1 }}>
              <SelectionField
                label=""
                value={selectedAccount ? accountLabel(selectedAccount) : ''}
                placeholder="Select connected account..."
                disabled={loading || saving}
                onPress={() => setPickerType('account')}
              />
            </View>

            <Pressable
              onPress={handleConnectNew}
              disabled={saving || connectingGoogle}
              style={({ pressed }) => [
                styles.connectButton,
                (saving || connectingGoogle) && styles.disabled,
                pressed && styles.pressed,
              ]}
            >
              {connectingGoogle ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.connectButtonText}>Connect new</Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Note */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Note (optional)</Text>

          <TextInput
            value={note}
            onChangeText={setNote}
            editable={!saving}
            multiline
            textAlignVertical="top"
            style={[styles.input, styles.textArea]}
            placeholder="Optional description"
            placeholderTextColor="#8291A9"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            onPress={() => navigation.goBack()}
            disabled={saving}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={handleCreate}
            disabled={saving || loading}
            style={[
              styles.createButton,
              (saving || loading) && styles.disabled,
            ]}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.createText}>Create</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {/* Selection Modal */}
      <Modal
        visible={Boolean(pickerType)}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerType(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {pickerType === 'class'
                  ? 'Select Class'
                  : 'Select Google Account'}
              </Text>

              <Pressable
                onPress={() => setPickerType(null)}
                style={styles.modalClose}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <FlatList
              data={pickerItems}
              keyExtractor={item => String(item.id)}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  {pickerType === 'class'
                    ? 'No classes available.'
                    : 'No Google Accounts connected.'}
                </Text>
              }
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    if (pickerType === 'class') {
                      setClassId(item.id);
                    } else {
                      setGoogleAccountId(item.id);
                    }
                    setPickerType(null);
                  }}
                  style={styles.modalOption}
                >
                  <Text style={styles.modalOptionText}>
                    {pickerType === 'class' ? item.label : accountLabel(item)}
                  </Text>

                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color="#93C5FD"
                  />
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={Boolean(datePickerType)}
        transparent
        animationType="fade"
        onRequestClose={() => setDatePickerType(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dateModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {datePickerType === 'start'
                  ? 'Select Start Date & Time'
                  : 'Select End Date & Time'}
              </Text>

              <Pressable
                onPress={() => setDatePickerType(null)}
                style={styles.modalClose}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            {/* Calendar */}
            <Calendar
              current={selectedDate || dateToKey(new Date())}
              onDayPress={day => {
                setSelectedDate(day.dateString);
              }}
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
                calendarBackground: '#101D35',
                monthTextColor: '#FFFFFF',
                dayTextColor: '#E2EAF5',
                textDisabledColor: '#64748B',
                todayTextColor: '#60A5FA',
                selectedDayBackgroundColor: '#2563EB',
                selectedDayTextColor: '#FFFFFF',
                arrowColor: '#60A5FA',
                textSectionTitleColor: '#AFC0D8',
              }}
              style={styles.calendar}
            />

            {/* Time Picker */}
            <Text style={styles.timeHeading}>Select Time (24-hour format)</Text>

            <View style={styles.timeRow}>
              <Pressable
                onPress={() => setTimePickerType('hour')}
                style={styles.timeSelectButton}
              >
                <Text style={styles.timeSelectValue}>{selectedHour}</Text>
                <Text style={styles.timeSelectLabel}>Hour</Text>
              </Pressable>

              <Text style={styles.timeSeparator}>:</Text>

              <Pressable
                onPress={() => setTimePickerType('minute')}
                style={styles.timeSelectButton}
              >
                <Text style={styles.timeSelectValue}>{selectedMinute}</Text>
                <Text style={styles.timeSelectLabel}>Minute</Text>
              </Pressable>
            </View>

            {/* Hour / Minute Options */}
            {timePickerType ? (
              <View style={styles.timeOptionsContainer}>
                <View style={styles.timeOptionsHeader}>
                  <Text style={styles.timeOptionsTitle}>
                    {timePickerType === 'hour'
                      ? 'Select Hour'
                      : 'Select Minute'}
                  </Text>

                  <Pressable onPress={() => setTimePickerType(null)}>
                    <MaterialCommunityIcons
                      name="close"
                      size={18}
                      color="#FFFFFF"
                    />
                  </Pressable>
                </View>

                <FlatList
                  data={
                    timePickerType === 'hour'
                      ? Array.from({ length: 24 }, (_, i) => pad2(i))
                      : Array.from({ length: 60 }, (_, i) => pad2(i))
                  }
                  numColumns={6}
                  keyExtractor={item => item}
                  style={{ maxHeight: 160 }}
                  renderItem={({ item }) => {
                    const isSelected =
                      timePickerType === 'hour'
                        ? selectedHour === item
                        : selectedMinute === item;

                    return (
                      <Pressable
                        onPress={() => {
                          if (timePickerType === 'hour') {
                            setSelectedHour(item);
                          } else {
                            setSelectedMinute(item);
                          }

                          setTimePickerType(null);
                        }}
                        style={[
                          styles.timeOption,
                          isSelected && styles.timeOptionSelected,
                        ]}
                      >
                        <Text style={styles.timeOptionText}>{item}</Text>
                      </Pressable>
                    );
                  }}
                />
              </View>
            ) : null}

            {/* Footer */}
            <View style={styles.dateModalFooter}>
              <Pressable
                onPress={clearDateSelection}
                style={styles.dateClearButton}
              >
                <Text style={styles.dateClearText}>Clear</Text>
              </Pressable>

              <Pressable
                onPress={saveDateSelection}
                style={styles.createButton}
              >
                <Text style={styles.createText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
