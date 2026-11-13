import React, { useCallback, useMemo, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { api } from '../../api/client';
import styles from './TeacherFinancialAccountingStaffAttendance.styles';
import DateTimePicker from '@react-native-community/datetimepicker';

const API = '/api/plugins/financial-accounting/hr/self-service/attendance';
const two = v => String(v).padStart(2, '0');
const toYMD = date =>
  `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}`;
const show = value => (value == null || value === '' ? '—' : String(value));
const readableDate = value => {
  if (!value) return '—';
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : String(value);
};
const readableTime = value => (value ? String(value).slice(0, 5) : '—');
const items = response =>
  Array.isArray(response?.items) ? response.items : [];

function Section({ title, subtitle, children }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}
function Empty({ text }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}
function Field({
  label,
  value,
  placeholder,
  onChangeText,
  multiline,
  editable = true,
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8194B0"
        editable={editable}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[
          styles.input,
          multiline && styles.multiline,
          !editable && styles.disabled,
        ]}
      />
    </View>
  );
}
function DataRow({ label, value }) {
  return (
    <View style={styles.dataRow}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{show(value)}</Text>
    </View>
  );
}
function SimpleCard({ children }) {
  return <View style={styles.dataCard}>{children}</View>;
}

export default function TeacherFinancialAccountingStaffAttendance() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [events, setEvents] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [queries, setQueries] = useState([]);
  const [edits, setEdits] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [canRequestEdit, setCanRequestEdit] = useState(false);
  const [subject, setSubject] = useState('');
  const [queryDate, setQueryDate] = useState('');
  const [queryText, setQueryText] = useState('');
  const [submittingQuery, setSubmittingQuery] = useState(false);
  const [swapDate, setSwapDate] = useState('');
  const [swapReason, setSwapReason] = useState('');
  const [calendarTarget, setCalendarTarget] = useState(null);

  const [editAttendanceDate, setEditAttendanceDate] = useState('');
  const [editRequestedTime, setEditRequestedTime] = useState(null);
  const [editEventType, setEditEventType] = useState('clock_in');
  const [editReference, setEditReference] = useState('');
  const [editReason, setEditReason] = useState('');

  const [showEditDatePicker, setShowEditDatePicker] = useState(false);
  const [showEditTimePicker, setShowEditTimePicker] = useState(false);
  const [showEventDropdown, setShowEventDropdown] = useState(false);

  const formatRequestedDateTime = date => {
    if (!(date instanceof Date)) {
      return 'Select date and time';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const time = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return `${day}-${month}-${year} ${time}`;
  };

  const formatSelectedTime = date => {
    if (!(date instanceof Date)) return 'Select time';

    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const range = useMemo(() => {
    const today = new Date();
    return {
      from: toYMD(new Date(today.getFullYear(), today.getMonth(), 1)),
      to: toYMD(today),
    };
  }, []);

  const load = useCallback(
    async (refresh = false) => {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      setError('');
      try {
        const suffix = `date_from=${range.from}&date_to=${range.to}`;
        const requests = await Promise.allSettled([
          api(`${API}/summaries?${suffix}`),
          api(`${API}/events?limit=20`),
          api(`${API}/shifts?date_from=${range.from}`),
          api(`${API}/queries`),
          api(`${API}/edit-requests`),
          api(`${API}/shift-swaps`),
        ]);
        const setters = [
          setSummaries,
          setEvents,
          setShifts,
          setQueries,
          setEdits,
          setSwaps,
        ];
        const names = [
          'summaries',
          'events',
          'shifts',
          'queries',
          'edit requests',
          'shift swaps',
        ];
        const failed = [];
        requests.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value?.ok !== false) {
            setters[index](items(result.value));
          } else {
            failed.push(names[index]);
            console.log(
              '[MY ATTENDANCE] Request failed',
              names[index],
              result.status === 'rejected'
                ? {
                    status: result.reason?.status,
                    message: result.reason?.message,
                  }
                : result.value?.message,
            );
          }
        });
        if (requests[4].status === 'fulfilled') {
          setCanRequestEdit(
            requests[4].value?.settings?.allow_attendance_edit_requests ===
              true,
          );
        }
        if (failed.length)
          setError(
            'Some attendance information could not be loaded. Pull down to try again.',
          );
      } catch (e) {
        console.log('[MY ATTENDANCE] Load failed', {
          status: e?.status,
          message: e?.message,
        });
        setError('Unable to load attendance. Pull down to try again.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [range],
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );
  const openCalendar = target => setCalendarTarget(target);
  const selectedCalendarDay =
    calendarTarget === 'query'
      ? queryDate
      : calendarTarget === 'edit'
      ? editAttendanceDate
      : swapDate;
  const selectDay = day => {
    if (calendarTarget === 'query') {
      setQueryDate(day.dateString);
    } else if (calendarTarget === 'edit') {
      setEditAttendanceDate(day.dateString);
    } else if (calendarTarget === 'swap') {
      setSwapDate(day.dateString);
    }

    setCalendarTarget(null);
  };

  // Other write endpoints are not yet confirmed; only attendance queries support POST.
  const notifyMissingSubmitAPI = () =>
    Alert.alert(
      'Not available yet',
      'This action will be available after the submission service is connected.',
    );

  const handleRaiseAttendanceQuery = useCallback(async () => {
    if (submittingQuery) return;

    const cleanSubject = subject.trim();
    const cleanQuery = queryText.trim();
    if (!cleanSubject) {
      Alert.alert('Attendance Query', 'Please enter a subject.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(queryDate)) {
      Alert.alert('Attendance Query', 'Please select an attendance date.');
      return;
    }
    if (!cleanQuery) {
      Alert.alert('Attendance Query', 'Please describe your query.');
      return;
    }

    try {
      setSubmittingQuery(true);
      const response = await api(`${API}/queries`, {
        method: 'POST',
        body: JSON.stringify({
          subject: cleanSubject,
          attendance_date: queryDate,
          query_text: cleanQuery,
        }),
      });

      if (response?.ok !== true || !response?.attendance_query?.id) {
        throw new Error(response?.message || 'The query was not confirmed.');
      }

      setSubject('');
      setQueryDate('');
      setQueryText('');
      // Re-fetch all six sections after a successful submission.
      await load(true);
      Alert.alert(
        'Attendance Query',
        'Your attendance query has been submitted.',
      );
    } catch (error) {
      console.log('[MY ATTENDANCE] Submit query failed', {
        status: error?.status,
        message: error?.message,
        errors: error?.payload?.errors,
      });
      Alert.alert(
        'Attendance Query',
        error?.payload?.message ||
          error?.message ||
          'Could not submit your query. Please try again.',
      );
    } finally {
      setSubmittingQuery(false);
    }
  }, [submittingQuery, subject, queryDate, queryText, load]);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        alwaysBounceVertical
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
            colors={['#2563EB']}
            tintColor="#60A5FA"
            progressBackgroundColor="#142B49"
          />
        }
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>FINANCIAL ACCOUNTING</Text>
          <Text style={styles.heroTitle}>Attendance self-service</Text>
          <Text style={styles.heroBody}>
            Your attendance activity is scoped to your account. Exceptions stay
            request-based so approvals remain auditable.
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statText}>
                <Text style={styles.statBold}>Logs: {events.length}</Text>
                {'  '}
                {summaries.length
                  ? `${summaries.length} day summaries`
                  : 'No summaries available yet.'}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statText}>
                <Text style={styles.statBold}>Schedules: {shifts.length}</Text>
                {'  '}
                {canRequestEdit
                  ? 'Attendance edit requests are enabled.'
                  : 'Attendance edit requests are disabled; queries and shift swaps remain available.'}
              </Text>
            </View>
          </View>
        </View>

        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={() => load(true)}>
              <Text style={styles.retry}>Retry</Text>
            </Pressable>
          </View>
        )}
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#60A5FA" />
            <Text style={styles.hint}>Loading attendance...</Text>
          </View>
        ) : (
          <>
            <Section
              title="Attendance logs"
              subtitle="Recent events and day summaries for your account only."
            >
              <Text style={styles.tableTitle}>Day summaries</Text>
              {summaries.length ? (
                summaries.map((row, i) => (
                  <SimpleCard key={String(row.id ?? i)}>
                    <DataRow
                      label="Date"
                      value={readableDate(row.date || row.attendance_date)}
                    />
                    <DataRow label="Status" value={row.status} />
                    <DataRow
                      label="Worked"
                      value={
                        row.worked_duration ||
                        row.worked_hours ||
                        row.worked_minutes
                      }
                    />
                    <DataRow
                      label="Shift"
                      value={row.shift_name || row.shift?.name}
                    />
                    <DataRow
                      label="Events"
                      value={row.events_count ?? row.event_count}
                    />
                  </SimpleCard>
                ))
              ) : (
                <Empty text="No attendance summaries yet." />
              )}
              <Text style={styles.tableTitle}>Recent events</Text>
              {events.length ? (
                events.map((row, i) => (
                  <SimpleCard key={String(row.id ?? i)}>
                    <DataRow
                      label="Occurred at"
                      value={row.occurred_at || row.event_at || row.created_at}
                    />
                    <DataRow label="Type" value={row.type || row.event_type} />
                    <DataRow label="Source" value={row.source} />
                    <DataRow
                      label="Reference"
                      value={row.reference || row.reference_no}
                    />
                  </SimpleCard>
                ))
              ) : (
                <Empty text="No attendance logs yet." />
              )}
            </Section>

            <Section title="Attendance queries">
              {queries.length ? (
                queries.map((row, i) => (
                  <SimpleCard key={String(row.id ?? i)}>
                    <Text style={styles.cardHeading}>
                      {row.subject || `Query ${row.id ?? i + 1}`}
                    </Text>
                    <DataRow
                      label="Date"
                      value={readableDate(row.attendance_date || row.date)}
                    />
                    <DataRow label="Status" value={row.status} />
                    {!!(row.query_text || row.query) && (
                      <Text style={styles.cardText}>
                        {row.query_text || row.query}
                      </Text>
                    )}
                    {!row.response_text && (
                      <Text style={styles.cardText}>Awaiting response</Text>
                    )}
                    {!!row.response_text && (
                      <Text style={styles.cardText}>
                        Response: {row.response_text}
                      </Text>
                    )}
                  </SimpleCard>
                ))
              ) : (
                <Empty text="No attendance queries yet." />
              )}
            </Section>

            <Section
              title="Shift schedule"
              subtitle="Your current and upcoming assignment windows."
            >
              {shifts.length ? (
                shifts.map((row, i) => (
                  <SimpleCard key={String(row.id ?? i)}>
                    <Text style={styles.cardHeading}>
                      {row.shift_name ||
                        row.shift?.name ||
                        row.name ||
                        'Assigned shift'}
                    </Text>
                    <DataRow
                      label="Window"
                      value={
                        row.window ||
                        `${readableDate(
                          row.date || row.shift_date,
                        )}  ${readableTime(row.start_time)} – ${readableTime(
                          row.end_time,
                        )}`
                      }
                    />
                    <DataRow label="Type" value={row.type || row.shift_type} />
                  </SimpleCard>
                ))
              ) : (
                <Empty text="No shift assignments found." />
              )}
            </Section>

            <Section
              title="Queries and requests"
              subtitle="Raise exceptions instead of changing attendance directly."
            >
              <Text style={styles.formHeading}>Raise attendance query</Text>
              <Field
                label="Subject"
                value={subject}
                onChangeText={setSubject}
                placeholder="Enter subject"
              />
              <Text style={styles.fieldLabel}>Attendance date</Text>
              <Pressable
                onPress={() => openCalendar('query')}
                style={styles.dateButton}
              >
                <Text
                  style={[styles.dateText, !queryDate && styles.placeholder]}
                >
                  {queryDate
                    ? readableDate(queryDate)
                    : 'Select attendance date'}
                </Text>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={20}
                  color="#AFC0D8"
                />
              </Pressable>
              <Field
                label="Query"
                value={queryText}
                onChangeText={setQueryText}
                multiline
                placeholder="Describe your attendance query"
              />
              <Pressable
                style={[
                  styles.actionButton,
                  submittingQuery && styles.disabled,
                ]}
                disabled={submittingQuery}
                onPress={handleRaiseAttendanceQuery}
              >
                {submittingQuery ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.actionText}>Raise attendance query</Text>
                )}
              </Pressable>
              <View style={styles.separator} />

              <Text style={styles.formHeading}>Request attendance edit</Text>

              {!canRequestEdit && (
                <Text style={styles.hint}>
                  Attendance edit requests are currently disabled.
                </Text>
              )}

              {/* 1. Attendance Date */}
              <Text style={styles.fieldLabel}>Attendance date</Text>

              <Pressable
                onPress={() => openCalendar('edit')}
                style={styles.dateButton}
              >
                <Text
                  style={[
                    styles.dateText,
                    !editAttendanceDate && styles.placeholder,
                  ]}
                >
                  {editAttendanceDate
                    ? readableDate(editAttendanceDate)
                    : 'Select attendance date'}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={20}
                  color="#AFC0D8"
                />
              </Pressable>

              {/* 2. Requested Date & Time */}
              <Text style={styles.fieldLabel}>Requested time</Text>

              <Pressable
                onPress={() => setShowEditDatePicker(true)}
                style={styles.dateButton}
              >
                <Text
                  style={[
                    styles.dateText,
                    !editRequestedTime && styles.placeholder,
                  ]}
                >
                  {formatRequestedDateTime(editRequestedTime)}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={20}
                  color="#AFC0D8"
                />
              </Pressable>

              {/* Step 1: Select Date */}
              {showEditDatePicker && (
                <DateTimePicker
                  value={editRequestedTime || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === 'android') {
                      setShowEditDatePicker(false);
                    }

                    if (event?.type === 'dismissed' || !selectedDate) {
                      return;
                    }

                    const previous = editRequestedTime || new Date();

                    const updated = new Date(selectedDate);
                    updated.setHours(
                      previous.getHours(),
                      previous.getMinutes(),
                      0,
                      0,
                    );

                    setEditRequestedTime(updated);

                    setShowEditTimePicker(true);
                  }}
                />
              )}

              {/* Step 2: Select Time */}
              {showEditTimePicker && (
                <DateTimePicker
                  value={editRequestedTime || new Date()}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedTime) => {
                    if (Platform.OS === 'android') {
                      setShowEditTimePicker(false);
                    }

                    if (event?.type === 'dismissed' || !selectedTime) {
                      return;
                    }

                    setEditRequestedTime(previous => {
                      const updated = new Date(previous || new Date());

                      updated.setHours(
                        selectedTime.getHours(),
                        selectedTime.getMinutes(),
                        0,
                        0,
                      );

                      return updated;
                    });
                  }}
                />
              )}

              {/* 3. Event Type */}
              <Text style={styles.fieldLabel}>Event type</Text>

              <Pressable
                style={styles.dateButton}
                onPress={() => setShowEventDropdown(!showEventDropdown)}
              >
                <Text style={styles.dateText}>
                  {editEventType === 'clock_in' ? 'Clock In' : 'Clock Out'}
                </Text>

                <MaterialCommunityIcons
                  name={showEventDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#AFC0D8"
                />
              </Pressable>

              {showEventDropdown && (
                <View style={styles.editDropdown}>
                  {[
                    { label: 'Clock In', value: 'clock_in' },
                    { label: 'Clock Out', value: 'clock_out' },
                  ].map(item => (
                    <Pressable
                      key={item.value}
                      style={styles.editDropdownItem}
                      onPress={() => {
                        setEditEventType(item.value);
                        setShowEventDropdown(false);
                      }}
                    >
                      <Text style={styles.editDropdownText}>{item.label}</Text>

                      {editEventType === item.value && (
                        <MaterialCommunityIcons
                          name="check"
                          size={18}
                          color="#60A5FA"
                        />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}

              {/* 4. Reference */}
              <Field
                label="Reference"
                value={editReference}
                onChangeText={setEditReference}
                placeholder="Enter reference (optional)"
              />

              {/* 5. Reason */}
              <Field
                label="Reason"
                value={editReason}
                onChangeText={setEditReason}
                multiline
                placeholder="Explain why the attendance needs correction"
              />

              {/* Submit Button */}
              <Pressable
                style={[
                  styles.actionButton,
                  !canRequestEdit && styles.disabled,
                ]}
                disabled={!canRequestEdit}
                onPress={() => {
                  if (
                    !editAttendanceDate ||
                    !editRequestedTime ||
                    !editReason.trim()
                  ) {
                    Alert.alert(
                      'Validation',
                      'Please enter attendance date, requested time and reason.',
                    );
                    return;
                  }

                  notifyMissingSubmitAPI();
                }}
              >
                <Text style={styles.actionText}>Request attendance edit</Text>
              </Pressable>

              <View style={styles.separator} />
              <Text style={styles.formHeading}>Request shift swap</Text>
              <Text style={styles.fieldLabel}>Swap date</Text>
              <Pressable
                onPress={() => openCalendar('swap')}
                style={styles.dateButton}
              >
                <Text
                  style={[styles.dateText, !swapDate && styles.placeholder]}
                >
                  {swapDate ? readableDate(swapDate) : 'Select swap date'}
                </Text>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={20}
                  color="#AFC0D8"
                />
              </Pressable>
              <Text style={styles.hint}>
                Your assignment and swap partner options depend on available
                shift records.
              </Text>
              <Field
                label="Reason"
                value={swapReason}
                onChangeText={setSwapReason}
                multiline
                placeholder="Reason for swap"
              />
              <Pressable
                style={[
                  styles.actionButton,
                  shifts.length === 0 && styles.disabled,
                ]}
                disabled={shifts.length === 0}
                onPress={notifyMissingSubmitAPI}
              >
                <Text style={styles.actionText}>Request shift swap</Text>
              </Pressable>
            </Section>

            <Section title="Edit and swap status">
              {edits.length === 0 && swaps.length === 0 ? (
                <Empty text="No edit or swap requests yet." />
              ) : (
                <>
                  {edits.map((row, i) => (
                    <SimpleCard key={`edit-${row.id ?? i}`}>
                      <Text style={styles.cardHeading}>Attendance edit</Text>
                      <DataRow label="Status" value={row.status} />
                      <DataRow
                        label="Date"
                        value={readableDate(row.attendance_date || row.date)}
                      />
                    </SimpleCard>
                  ))}
                  {swaps.map((row, i) => (
                    <SimpleCard key={`swap-${row.id ?? i}`}>
                      <Text style={styles.cardHeading}>Shift swap</Text>
                      <DataRow label="Status" value={row.status} />
                      <DataRow
                        label="Date"
                        value={readableDate(row.swap_date || row.date)}
                      />
                    </SimpleCard>
                  ))}
                </>
              )}
            </Section>
          </>
        )}
      </ScrollView>
      <Modal
        visible={Boolean(calendarTarget)}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarTarget(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Text style={styles.sectionTitle}>Select date</Text>
              <Pressable onPress={() => setCalendarTarget(null)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#F8FAFC"
                />
              </Pressable>
            </View>
            <Calendar
              current={selectedCalendarDay || toYMD(new Date())}
              onDayPress={selectDay}
              markedDates={
                selectedCalendarDay
                  ? {
                      [selectedCalendarDay]: {
                        selected: true,
                        selectedColor: '#2563EB',
                      },
                    }
                  : {}
              }
              theme={{
                calendarBackground: '#102039',
                monthTextColor: '#FFFFFF',
                dayTextColor: '#E2E8F0',
                textDisabledColor: '#64748B',
                todayTextColor: '#60A5FA',
                selectedDayTextColor: '#FFFFFF',
                arrowColor: '#60A5FA',
                textSectionTitleColor: '#AFC0D8',
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
