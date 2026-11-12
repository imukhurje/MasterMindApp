import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
  Modal,
  TextInput,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';
import styles from './AdminExaminationSchedule.styles';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatApiDate(date) {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-');
}

function getIsoWeekday(date) {
  const day = date.getDay();

  return day === 0 ? 7 : day;
}

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthEnd(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function buildCalendarCells(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDay = new Date(year, month, 1);

  const totalDays = new Date(year, month + 1, 0).getDate();

  const firstIsoWeekday = getIsoWeekday(firstDay);

  const cells = [];

  // Empty cells before day 1
  for (let index = 1; index < firstIsoWeekday; index += 1) {
    cells.push(null);
  }

  // Only current month dates
  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(new Date(year, month, day));
  }

  // Complete final calendar row
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function getMonthTitle(date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function normalizeDateOnly(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

function isHolidayForDate(date, holidays) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return holidays.find(holiday => {
    const holidayDate = normalizeDateOnly(holiday?.date);

    if (!holidayDate) {
      return false;
    }

    if (holiday?.repeats_annually === true) {
      return holidayDate.month === month && holidayDate.day === day;
    }

    return (
      holidayDate.year === year &&
      holidayDate.month === month &&
      holidayDate.day === day
    );
  });
}

function isSameCalendarDay(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function isTruthyScheduled(value) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

function getBusyDateSet(papers) {
  const busyDates = new Set();

  papers.forEach(paper => {
    if (!isTruthyScheduled(paper?.is_scheduled)) {
      return;
    }

    if (!paper?.starts_at) {
      return;
    }

    const startDate = new Date(paper.starts_at);

    if (Number.isNaN(startDate.getTime())) {
      return;
    }

    busyDates.add(formatApiDate(startDate));
  });

  return busyDates;
}

function formatTime(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getDayAssignments(papers, dateKey) {
  const groups = {};

  papers.forEach(paper => {
    if (!isTruthyScheduled(paper?.is_scheduled) || !paper?.starts_at) {
      return;
    }

    const startDate = new Date(paper.starts_at);

    if (Number.isNaN(startDate.getTime())) {
      return;
    }

    if (formatApiDate(startDate) !== dateKey) {
      return;
    }

    const startTime = formatTime(paper.starts_at);

    const endTime = formatTime(paper.ends_at);

    if (!startTime || !endTime) {
      return;
    }

    const key = `${startTime}|${endTime}`;

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(paper);
  });

  return Object.entries(groups)
    .map(([key, items]) => {
      const [startTime, endTime] = key.split('|');

      return {
        key,
        startTime,
        endTime,
        papers: items,
      };
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export default function AdminExaminationSchedule({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const examinationId = Number(route?.params?.examinationId);

  const examinationName = route?.params?.examinationName || 'Examination';

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();

    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [weekendDays, setWeekendDays] = useState([]);

  const [holidays, setHolidays] = useState([]);

  const [loading, setLoading] = useState(true);

  const [monthLoading, setMonthLoading] = useState(false);

  const [selectedDateKey, setSelectedDateKey] = useState(null);

  const [papers, setPapers] = useState([]);

  const [slotTemplates, setSlotTemplates] = useState([]);

  const [slotTemplatesLoading, setSlotTemplatesLoading] = useState(false);

  const [addSlotModalVisible, setAddSlotModalVisible] = useState(false);

  const [selectedTemplateKey, setSelectedTemplateKey] = useState(null);

  const [customSlot, setCustomSlot] = useState(false);

  const [slotStartTime, setSlotStartTime] = useState('');

  const [slotEndTime, setSlotEndTime] = useState('');

  const [slotLabel, setSlotLabel] = useState('');

  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const [paperPickerVisible, setPaperPickerVisible] = useState(false);

  const [availablePapers, setAvailablePapers] = useState([]);

  const [selectedPaperIds, setSelectedPaperIds] = useState(new Set());

  const [slotSaving, setSlotSaving] = useState(false);

  const [selectedScheduledPaperIds, setSelectedScheduledPaperIds] = useState(
    new Set(),
  );

  const [moveTargetBySlot, setMoveTargetBySlot] = useState({});

  const [movePickerVisible, setMovePickerVisible] = useState(false);

  const [movePickerSlotKey, setMovePickerSlotKey] = useState(null);

  const [moveTemplatesLoading, setMoveTemplatesLoading] = useState(false);

  const [scheduledActionLoading, setScheduledActionLoading] = useState(false);

  const calendarCells = useMemo(
    () => buildCalendarCells(currentMonth),
    [currentMonth],
  );

  const selectedDaySlots = useMemo(() => {
    if (!selectedDateKey) {
      return [];
    }

    return getDayAssignments(papers, selectedDateKey);
  }, [papers, selectedDateKey]);

  const busyDateSet = useMemo(() => getBusyDateSet(papers), [papers]);

  const loadWeekendDays = useCallback(async () => {
    const response = await api('/api/settings/v1?keys=weekend_days');

    const items = Array.isArray(response?.items) ? response.items : [];

    const weekendItem = items.find(item => item?.key === 'weekend_days');

    const values = Array.isArray(weekendItem?.value) ? weekendItem.value : [];

    setWeekendDays(values.map(Number).filter(value => Number.isFinite(value)));
  }, []);

  const loadHolidays = useCallback(
    async (monthDate, { initial = false } = {}) => {
      try {
        if (initial) {
          setLoading(true);
        } else {
          setMonthLoading(true);
        }

        const from = getMonthStart(monthDate);

        const to = getMonthEnd(monthDate);

        const response = await api(
          `/api/calendar/v1/holidays?from=${encodeURIComponent(
            formatApiDate(from),
          )}&to=${encodeURIComponent(formatApiDate(to))}`,
        );

        setHolidays(Array.isArray(response) ? response : []);
      } catch (error) {
        console.log('Schedule holidays load error:', error);

        setHolidays([]);

        Alert.alert(
          'Schedule Papers',
          error?.message || 'Could not load calendar holidays.',
        );
      } finally {
        setLoading(false);
        setMonthLoading(false);
      }
    },
    [],
  );

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);

      const from = getMonthStart(currentMonth);

      const to = getMonthEnd(currentMonth);

      const [settingsResponse, holidaysResponse, examinationResponse] =
        await Promise.all([
          api('/api/settings/v1?keys=weekend_days'),

          api(
            `/api/calendar/v1/holidays?from=${encodeURIComponent(
              formatApiDate(from),
            )}&to=${encodeURIComponent(formatApiDate(to))}`,
          ),

          api(`/api/examinations/v1/${examinationId}`),
        ]);

      const items = Array.isArray(settingsResponse?.items)
        ? settingsResponse.items
        : [];

      const weekendItem = items.find(item => item?.key === 'weekend_days');

      const weekendValues = Array.isArray(weekendItem?.value)
        ? weekendItem.value
        : [];

      setWeekendDays(
        weekendValues.map(Number).filter(value => Number.isFinite(value)),
      );

      setPapers(
        Array.isArray(examinationResponse?.data?.exams)
          ? examinationResponse.data.exams
          : [],
      );

      setHolidays(Array.isArray(holidaysResponse) ? holidaysResponse : []);

      navigation.setOptions({
        title: 'Schedule Papers',
      });
    } catch (error) {
      console.log('Schedule initialization error:', error);

      Alert.alert(
        'Schedule Papers',
        error?.message || 'Could not load the schedule calendar.',
      );
    } finally {
      setLoading(false);
    }
  }, [currentMonth, navigation]);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function changeMonth(offset) {
    if (monthLoading) {
      return;
    }

    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + offset,
      1,
    );

    setCurrentMonth(nextMonth);
    setSelectedDateKey(null);

    await loadHolidays(nextMonth);
  }

  async function selectCalendarDay(dateKey) {
    setSelectedDateKey(dateKey);

    try {
      setSlotTemplatesLoading(true);

      const response = await api(
        `/api/examinations/v1/${examinationId}/slot-templates`,
      );

      setSlotTemplates(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.log('Slot templates load error:', error);

      setSlotTemplates([]);
    } finally {
      setSlotTemplatesLoading(false);
    }
  }

  function openAddSlotModal() {
    if (!selectedDateKey) {
      return;
    }

    setSelectedTemplateKey(null);
    setCustomSlot(slotTemplates.length === 0);
    setSlotStartTime('');
    setSlotEndTime('');
    setSlotLabel('');

    setAddSlotModalVisible(true);
  }

  async function loadUnscheduledPapers() {
    try {
      const response = await api(
        `/api/examinations/v1/${examinationId}/unscheduled-exams`,
      );

      setAvailablePapers(Array.isArray(response?.data) ? response.data : []);

      setSelectedPaperIds(new Set());

      setPaperPickerVisible(true);
    } catch (error) {
      console.log('Unscheduled papers load error:', error);

      Alert.alert(
        'Add Papers',
        error?.message || 'Could not load available papers.',
      );
    }
  }

  async function createSlot() {
    if (
      !/^\d{2}:\d{2}$/.test(slotStartTime) ||
      !/^\d{2}:\d{2}$/.test(slotEndTime)
    ) {
      Alert.alert('Invalid time', 'Please enter a valid start and end time.');
      return;
    }

    try {
      setSlotSaving(true);

      const payload = {
        start_time: slotStartTime,
        end_time: slotEndTime,
        label: slotLabel.trim() || null,
      };

      console.log('Create slot payload:', payload);

      const response = await api(
        `/api/examinations/v1/${examinationId}/slots`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const slotId = Number(response?.data?.id);

      if (!Number.isFinite(slotId)) {
        throw new Error('Slot ID was not returned.');
      }

      setSelectedSlotId(slotId);

      setAddSlotModalVisible(false);

      await loadUnscheduledPapers();
    } catch (error) {
      console.log('Create slot error:', error);

      Alert.alert('Add Slot', error?.message || 'Could not create the slot.');
    } finally {
      setSlotSaving(false);
    }
  }

  async function addPapersToExistingSlot(slot) {
    try {
      setSlotSaving(true);

      const response = await api(
        `/api/examinations/v1/${examinationId}/slots`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            start_time: slot.startTime,
            end_time: slot.endTime,
          }),
        },
      );

      const slotId = Number(response?.data?.id);

      if (!Number.isFinite(slotId)) {
        throw new Error('Could not resolve the slot.');
      }

      setSelectedSlotId(slotId);

      await loadUnscheduledPapers();
    } catch (error) {
      console.log('Add papers error:', error);

      Alert.alert(
        'Add Papers',
        error?.message || 'Could not open the available paper list.',
      );
    } finally {
      setSlotSaving(false);
    }
  }

  function togglePaperSelection(paper) {
    const paperId = Number(paper?.id);

    if (!Number.isFinite(paperId)) {
      return;
    }

    setSelectedPaperIds(current => {
      const next = new Set(current);

      if (next.has(paperId)) {
        next.delete(paperId);
        return next;
      }

      const sameClassSelected = availablePapers.some(item => {
        const itemId = Number(item?.id);

        return (
          next.has(itemId) &&
          Number(item?.class_group_id) === Number(paper?.class_group_id)
        );
      });

      if (sameClassSelected) {
        Alert.alert(
          'Class already selected',
          'Only one paper from the same class can be assigned to this slot.',
        );

        return current;
      }

      next.add(paperId);

      return next;
    });
  }

  async function reloadExaminationPapers() {
    try {
      const response = await api(`/api/examinations/v1/${examinationId}`);

      setPapers(
        Array.isArray(response?.data?.exams) ? response.data.exams : [],
      );
    } catch (error) {
      console.log('Schedule refresh error:', error);
    }
  }

  async function savePaperAssignments() {
    const examIds = Array.from(selectedPaperIds);

    if (examIds.length === 0) {
      Alert.alert('Add Papers', 'Please select at least one paper.');
      return;
    }

    if (!Number.isFinite(Number(selectedSlotId)) || !selectedDateKey) {
      Alert.alert('Add Papers', 'Slot information is missing.');
      return;
    }

    try {
      setSlotSaving(true);

      const payload = {
        exam_ids: examIds,
        date: selectedDateKey,
      };

      console.log('Attach papers payload:', payload);

      await api(
        `/api/examinations/v1/${examinationId}/slots/${selectedSlotId}/attach`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      setPaperPickerVisible(false);

      setSelectedPaperIds(new Set());

      setAvailablePapers([]);

      setSelectedSlotId(null);

      await reloadExaminationPapers();
    } catch (error) {
      console.log('Paper assignment error:', error);

      Alert.alert(
        'Add Papers',
        error?.message || 'Could not assign papers to the slot.',
      );
    } finally {
      setSlotSaving(false);
    }
  }

  function toggleScheduledPaperSelection(paperId) {
    const normalizedId = Number(paperId);

    if (!Number.isFinite(normalizedId)) {
      return;
    }

    setSelectedScheduledPaperIds(current => {
      const next = new Set(current);

      if (next.has(normalizedId)) {
        next.delete(normalizedId);
      } else {
        next.add(normalizedId);
      }

      return next;
    });
  }

  function getSelectedIdsForSlot(slot) {
    return (slot?.papers || [])
      .map(paper => Number(paper?.id))
      .filter(id => Number.isFinite(id) && selectedScheduledPaperIds.has(id));
  }

  function confirmUnschedule(slot) {
    const examIds = getSelectedIdsForSlot(slot);

    if (examIds.length === 0) {
      Alert.alert('Unschedule', 'Please select at least one paper.');
      return;
    }

    Alert.alert(
      'Unschedule Papers',
      'Unschedule selected papers from this day?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => unscheduleSelectedPapers(examIds),
        },
      ],
    );
  }

  async function unscheduleSelectedPapers(examIds) {
    try {
      setScheduledActionLoading(true);

      await Promise.all(
        examIds.map(examId =>
          api(`/api/exams/${examId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              starts_at: null,
              ends_at: null,
              is_scheduled: false,
            }),
          }),
        ),
      );

      setSelectedScheduledPaperIds(new Set());

      await reloadExaminationPapers();
    } catch (error) {
      console.log('Unschedule papers error:', error);

      Alert.alert(
        'Unschedule failed',
        error?.message || 'Could not unschedule the selected papers.',
      );
    } finally {
      setScheduledActionLoading(false);
    }
  }

  async function openMoveSlotPicker(slot) {
    setMovePickerSlotKey(slot.key);

    setMovePickerVisible(true);

    try {
      setMoveTemplatesLoading(true);

      const response = await api(
        `/api/examinations/v1/${examinationId}/slot-templates`,
      );

      setSlotTemplates(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.log('Move templates load error:', error);

      Alert.alert(
        'Move Papers',
        error?.message || 'Could not load time slots.',
      );
    } finally {
      setMoveTemplatesLoading(false);
    }
  }

  async function moveSelectedPapers(slot) {
    const examIds = getSelectedIdsForSlot(slot);

    if (examIds.length === 0) {
      Alert.alert('Move Papers', 'Please select at least one paper.');
      return;
    }

    const target = moveTargetBySlot[slot.key];

    if (!target?.start_hm || !target?.end_hm) {
      Alert.alert('Move Papers', 'Please select a destination slot.');
      return;
    }

    const targetKey = `${target.start_hm}|${target.end_hm}`;

    if (targetKey === slot.key) {
      Alert.alert('Move Papers', 'Please select a different time slot.');
      return;
    }

    try {
      setScheduledActionLoading(true);

      const slotResponse = await api(
        `/api/examinations/v1/${examinationId}/slots`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            start_time: target.start_hm,
            end_time: target.end_hm,
          }),
        },
      );

      const destinationSlotId = Number(slotResponse?.data?.id);

      if (!Number.isFinite(destinationSlotId)) {
        throw new Error('Destination slot ID was not returned.');
      }

      await api(
        `/api/examinations/v1/${examinationId}/slots/${destinationSlotId}/attach`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            exam_ids: examIds,
            date: selectedDateKey,
          }),
        },
      );

      setSelectedScheduledPaperIds(new Set());

      setMoveTargetBySlot(current => {
        const next = {
          ...current,
        };

        delete next[slot.key];

        return next;
      });

      await reloadExaminationPapers();
    } catch (error) {
      console.log('Move papers error:', error);

      Alert.alert(
        'Move failed',
        error?.message || 'Could not move the selected papers.',
      );
    } finally {
      setScheduledActionLoading(false);
    }
  }

  function renderCalendarDay(date, index) {
    if (!date) {
      return (
        <View
          key={`empty-${index}`}
          style={[styles.dayCell, styles.dayCellEmpty]}
        />
      );
    }

    const dateKey = formatApiDate(date);

    const isoWeekday = getIsoWeekday(date);

    const weekend = weekendDays.includes(isoWeekday);

    const holiday = isHolidayForDate(date, holidays);

    const busy = busyDateSet.has(dateKey);

    const holidayOrWeekend = weekend || Boolean(holiday);

    const selected = selectedDateKey === dateKey;

    const today = isSameCalendarDay(date, new Date());

    return (
      <Pressable
        key={dateKey}
        onPress={() => selectCalendarDay(dateKey)}
        accessibilityRole="button"
        accessibilityLabel={`Select ${date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}`}
        style={({ pressed }) => [
          styles.dayCell,

          busy && styles.dayCellBusy,

          holidayOrWeekend && styles.dayCellHoliday,

          today && styles.dayCellToday,

          selected && styles.dayCellSelected,

          pressed && styles.dayCellPressed,
        ]}
      >
        <View style={styles.dayTopRow}>
          <View
            style={[
              styles.dayNumberCircle,

              today && styles.dayNumberCircleToday,

              selected && styles.dayNumberCircleSelected,
            ]}
          >
            <Text
              style={[
                styles.dayNumber,

                holidayOrWeekend && styles.dayNumberHoliday,

                (today || selected) && styles.dayNumberActive,
              ]}
            >
              {date.getDate()}
            </Text>
          </View>

          {selected ? <Text style={styles.selectedIndicator}>✓</Text> : null}
        </View>

        {holiday ? (
          <View style={styles.holidayBadge}>
            <Text numberOfLines={2} style={styles.holidayName}>
              {holiday.name}
            </Text>

            {busy ? <Text style={styles.busyText}>Busy</Text> : null}
          </View>
        ) : weekend ? (
          <View>
            <Text numberOfLines={1} style={styles.weekendText}>
              Weekend
            </Text>

            {busy ? <Text style={styles.busyText}>Busy</Text> : null}
          </View>
        ) : busy ? (
          <Text style={styles.busyText}>Busy</Text>
        ) : (
          <Text style={styles.availableText}>Available</Text>
        )}
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading schedule...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.screenContent,
        {
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <Text style={styles.pageTitle}>Schedule Papers</Text>

        <Text numberOfLines={2} style={styles.examinationName}>
          {examinationName}
        </Text>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.legendBusy]} />

          <Text style={styles.legendText}>Busy (has one or more papers)</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.legendHoliday]} />

          <Text style={styles.legendText}>Holiday (weekend / listed)</Text>
        </View>
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.calendarHeader}>
          <Pressable
            onPress={() => changeMonth(-1)}
            disabled={monthLoading}
            style={({ pressed }) => [
              styles.monthButton,

              monthLoading && styles.controlDisabled,

              pressed && !monthLoading && styles.controlPressed,
            ]}
          >
            <Text style={styles.monthButtonText}>←</Text>
          </Pressable>

          <View style={styles.monthTitleWrap}>
            <Text style={styles.monthTitle}>{getMonthTitle(currentMonth)}</Text>

            {monthLoading ? (
              <ActivityIndicator
                size="small"
                style={{
                  marginLeft: 8,
                }}
              />
            ) : null}
          </View>

          <Pressable
            onPress={() => changeMonth(1)}
            disabled={monthLoading}
            style={({ pressed }) => [
              styles.monthButton,

              monthLoading && styles.controlDisabled,

              pressed && !monthLoading && styles.controlPressed,
            ]}
          >
            <Text style={styles.monthButtonText}>→</Text>
          </Pressable>
        </View>

        <View style={styles.weekHeader}>
          {WEEK_DAYS.map(day => (
            <View key={day} style={styles.weekDay}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {calendarCells.map(renderCalendarDay)}
        </View>

        {selectedDateKey ? (
          <View style={styles.slotsSection}>
            <View style={styles.slotsTopRow}>
              <View style={styles.slotsTitleSection}>
                <Text style={styles.slotsTitle}>
                  Slots for {selectedDateKey}
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  setSelectedDateKey(null);
                  setSlotTemplates([]);
                }}
                style={({ pressed }) => [
                  styles.clearSelectedButton,
                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.clearSelectedText}>Clear</Text>
              </Pressable>
            </View>

            <View style={styles.assignmentsHeader}>
              <Text style={styles.assignmentsTitle}>
                Assignments for {selectedDateKey}
              </Text>

              <Pressable
                onPress={() => openAddSlotModal()}
                style={({ pressed }) => [
                  styles.addSlotButton,
                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.addSlotButtonText}>+ Add Slot</Text>
              </Pressable>
            </View>

            {selectedDaySlots.length === 0 ? (
              <View style={styles.noSlotsCard}>
                <Text style={styles.noSlotsText}>
                  No papers scheduled for this day.
                </Text>
              </View>
            ) : (
              selectedDaySlots.map(slot => {
                const selectedIds = getSelectedIdsForSlot(slot);

                const hasSelection = selectedIds.length > 0;

                const moveTarget = moveTargetBySlot[slot.key];

                return (
                  <View key={slot.key} style={styles.slotCard}>
                    <View style={styles.slotHeader}>
                      <Text style={styles.slotTime}>
                        {slot.startTime}
                        {' – '}
                        {slot.endTime}
                      </Text>

                      <Pressable
                        onPress={() => addPapersToExistingSlot(slot)}
                        disabled={scheduledActionLoading}
                        style={({ pressed }) => [
                          styles.addPapersButton,

                          scheduledActionLoading && styles.controlDisabled,

                          pressed &&
                            !scheduledActionLoading &&
                            styles.controlPressed,
                        ]}
                      >
                        <Text style={styles.addPapersButtonText}>
                          Add papers
                        </Text>
                      </Pressable>
                    </View>

                    <View style={styles.slotPapersList}>
                      {slot.papers.map(paper => {
                        const paperId = Number(paper.id);

                        const selected = selectedScheduledPaperIds.has(paperId);

                        return (
                          <Pressable
                            key={String(paper.id)}
                            onPress={() =>
                              toggleScheduledPaperSelection(paperId)
                            }
                            disabled={scheduledActionLoading}
                            style={({ pressed }) => [
                              styles.slotPaperRow,

                              selected && styles.slotPaperRowSelected,

                              pressed &&
                                !scheduledActionLoading &&
                                styles.controlPressed,
                            ]}
                          >
                            <View
                              style={[
                                styles.scheduledCheckbox,

                                selected && styles.scheduledCheckboxSelected,
                              ]}
                            >
                              {selected ? (
                                <Text style={styles.scheduledCheckboxCheck}>
                                  ✓
                                </Text>
                              ) : null}
                            </View>

                            <View style={styles.slotPaperContent}>
                              <Text
                                numberOfLines={1}
                                style={styles.slotPaperText}
                              >
                                {paper?.class_group?.name ||
                                  paper?.class_name ||
                                  '-'}
                                {' – '}
                                {paper?.course?.title ||
                                  paper?.course_title ||
                                  '-'}
                              </Text>

                              <Text
                                numberOfLines={1}
                                style={styles.slotPaperTime}
                              >
                                {formatTime(paper.starts_at)}
                                {'–'}
                                {formatTime(paper.ends_at)}
                              </Text>
                            </View>
                          </Pressable>
                        );
                      })}
                    </View>

                    {hasSelection ? (
                      <View style={styles.selectedPaperActions}>
                        <View style={styles.unscheduleRow}>
                          <Pressable
                            onPress={() => confirmUnschedule(slot)}
                            disabled={scheduledActionLoading}
                            style={({ pressed }) => [
                              styles.unscheduleButton,

                              scheduledActionLoading && styles.controlDisabled,

                              pressed &&
                                !scheduledActionLoading &&
                                styles.controlPressed,
                            ]}
                          >
                            <Text style={styles.unscheduleButtonText}>
                              Unschedule
                            </Text>
                          </Pressable>

                          <Text style={styles.orMoveText}>or move to</Text>
                        </View>

                        <View style={styles.moveRow}>
                          <Pressable
                            onPress={() => openMoveSlotPicker(slot)}
                            disabled={scheduledActionLoading}
                            style={({ pressed }) => [
                              styles.moveSelectField,

                              pressed &&
                                !scheduledActionLoading &&
                                styles.controlPressed,
                            ]}
                          >
                            <Text
                              numberOfLines={1}
                              style={styles.moveSelectText}
                            >
                              {moveTarget
                                ? `${moveTarget.start_hm} – ${
                                    moveTarget.end_hm
                                  }${
                                    moveTarget.label
                                      ? ` · ${moveTarget.label}`
                                      : ''
                                  }`
                                : 'Select another slot'}
                            </Text>

                            <Text style={styles.moveSelectArrow}>⌄</Text>
                          </Pressable>

                          <Pressable
                            onPress={() => moveSelectedPapers(slot)}
                            disabled={!moveTarget || scheduledActionLoading}
                            style={({ pressed }) => [
                              styles.moveButton,

                              (!moveTarget || scheduledActionLoading) &&
                                styles.controlDisabled,

                              pressed &&
                                moveTarget &&
                                !scheduledActionLoading &&
                                styles.controlPressed,
                            ]}
                          >
                            {scheduledActionLoading ? (
                              <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                              <Text style={styles.moveButtonText}>Move</Text>
                            )}
                          </Pressable>
                        </View>
                      </View>
                    ) : null}
                  </View>
                );
              })
            )}
          </View>
        ) : null}
      </View>

      <Modal
        transparent
        visible={addSlotModalVisible}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setAddSlotModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => {
              if (!slotSaving) {
                setAddSlotModalVisible(false);
              }
            }}
          />

          <View style={styles.slotModal}>
            <Text style={styles.modalTitle}>Add Slot</Text>

            <Text style={styles.modalDate}>{selectedDateKey}</Text>

            <Text style={styles.fieldLabel}>Select Time Slot</Text>

            {slotTemplatesLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator />
                <Text style={styles.modalLoadingText}>
                  Loading slot templates...
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.templateList} nestedScrollEnabled>
                {slotTemplates.map((template, index) => {
                  const key = `${template.start_hm}|${template.end_hm}`;

                  const selected = !customSlot && selectedTemplateKey === key;

                  return (
                    <Pressable
                      key={`${key}-${index}`}
                      onPress={() => {
                        setCustomSlot(false);

                        setSelectedTemplateKey(key);

                        setSlotStartTime(template.start_hm);

                        setSlotEndTime(template.end_hm);

                        setSlotLabel('');
                      }}
                      style={({ pressed }) => [
                        styles.templateRow,

                        selected && styles.templateRowSelected,

                        pressed && styles.controlPressed,
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.templateTime}>
                          {template.start_hm}
                          {' – '}
                          {template.end_hm}
                        </Text>

                        {template.label ? (
                          <Text style={styles.templateLabel}>
                            {template.label}
                          </Text>
                        ) : null}
                      </View>

                      {selected ? (
                        <Text style={styles.templateCheck}>✓</Text>
                      ) : null}
                    </Pressable>
                  );
                })}

                <Pressable
                  onPress={() => {
                    setCustomSlot(true);
                    setSelectedTemplateKey(null);
                    setSlotStartTime('');
                    setSlotEndTime('');
                    setSlotLabel('');
                  }}
                  style={({ pressed }) => [
                    styles.templateRow,

                    customSlot && styles.templateRowSelected,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.templateTime}>+ New Time Slot</Text>
                </Pressable>
              </ScrollView>
            )}

            {customSlot ? (
              <View style={styles.customSlotFields}>
                <View style={styles.timeFieldsRow}>
                  <View style={styles.timeField}>
                    <Text style={styles.fieldLabel}>Start</Text>

                    <TextInput
                      value={slotStartTime}
                      onChangeText={setSlotStartTime}
                      placeholder="10:30"
                      placeholderTextColor="#64748B"
                      maxLength={5}
                      style={styles.timeInput}
                    />
                  </View>

                  <View style={styles.timeField}>
                    <Text style={styles.fieldLabel}>End</Text>

                    <TextInput
                      value={slotEndTime}
                      onChangeText={setSlotEndTime}
                      placeholder="11:30"
                      placeholderTextColor="#64748B"
                      maxLength={5}
                      style={styles.timeInput}
                    />
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Label (optional)</Text>

                <TextInput
                  value={slotLabel}
                  onChangeText={setSlotLabel}
                  placeholder="e.g., Morning"
                  placeholderTextColor="#64748B"
                  style={styles.timeInput}
                />
              </View>
            ) : null}

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setAddSlotModalVisible(false)}
                disabled={slotSaving}
                style={({ pressed }) => [
                  styles.modalCancelButton,

                  slotSaving && styles.controlDisabled,

                  pressed && !slotSaving && styles.controlPressed,
                ]}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={createSlot}
                disabled={slotSaving || !slotStartTime || !slotEndTime}
                style={({ pressed }) => [
                  styles.modalSaveButton,

                  (slotSaving || !slotStartTime || !slotEndTime) &&
                    styles.controlDisabled,

                  pressed && !slotSaving && styles.controlPressed,
                ]}
              >
                {slotSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSaveText}>
                    Save template & Continue
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={paperPickerVisible}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setPaperPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => {
              if (!slotSaving) {
                setPaperPickerVisible(false);
              }
            }}
          />

          <View style={styles.paperPickerModal}>
            <Text style={styles.modalTitle}>Add Papers</Text>

            <Text style={styles.modalDate}>{selectedDateKey}</Text>

            <Text style={styles.paperPickerHelper}>
              Select papers to assign to this time slot.
            </Text>

            <ScrollView style={styles.paperPickerList} nestedScrollEnabled>
              {availablePapers.length === 0 ? (
                <View style={styles.noAvailablePapers}>
                  <Text style={styles.noAvailablePapersText}>
                    No unscheduled papers are available.
                  </Text>
                </View>
              ) : (
                availablePapers.map(paper => {
                  const paperId = Number(paper.id);

                  const selected = selectedPaperIds.has(paperId);

                  const sameClassUsed =
                    !selected &&
                    availablePapers.some(
                      item =>
                        selectedPaperIds.has(Number(item.id)) &&
                        Number(item.class_group_id) ===
                          Number(paper.class_group_id),
                    );

                  return (
                    <Pressable
                      key={String(paper.id)}
                      onPress={() => togglePaperSelection(paper)}
                      disabled={sameClassUsed}
                      style={({ pressed }) => [
                        styles.paperPickerRow,

                        selected && styles.paperPickerRowSelected,

                        sameClassUsed && styles.paperPickerRowDisabled,

                        pressed && !sameClassUsed && styles.controlPressed,
                      ]}
                    >
                      <View
                        style={[
                          styles.paperCheckbox,

                          selected && styles.paperCheckboxSelected,
                        ]}
                      >
                        {selected ? (
                          <Text style={styles.paperCheckboxCheck}>✓</Text>
                        ) : null}
                      </View>

                      <View style={styles.paperPickerContent}>
                        <Text style={styles.paperPickerName}>
                          {paper?.class_group?.name ||
                            paper?.class_name ||
                            'Class'}
                          {' – '}
                          {paper?.course?.title ||
                            paper?.course_title ||
                            'Subject'}
                        </Text>

                        {paper?.name ? (
                          <Text
                            numberOfLines={2}
                            style={styles.paperPickerSubtext}
                          >
                            {paper.name}
                          </Text>
                        ) : null}
                      </View>
                    </Pressable>
                  );
                })
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setPaperPickerVisible(false)}
                disabled={slotSaving}
                style={({ pressed }) => [
                  styles.modalCancelButton,

                  slotSaving && styles.controlDisabled,

                  pressed && !slotSaving && styles.controlPressed,
                ]}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={savePaperAssignments}
                disabled={slotSaving || selectedPaperIds.size === 0}
                style={({ pressed }) => [
                  styles.modalSaveButton,

                  (slotSaving || selectedPaperIds.size === 0) &&
                    styles.controlDisabled,

                  pressed && !slotSaving && styles.controlPressed,
                ]}
              >
                {slotSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSaveText}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        visible={movePickerVisible}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setMovePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setMovePickerVisible(false)}
          />

          <View style={styles.movePickerModal}>
            <Text style={styles.modalTitle}>Move to Slot</Text>

            <Text style={styles.modalDate}>{selectedDateKey}</Text>

            {moveTemplatesLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator />

                <Text style={styles.modalLoadingText}>
                  Loading time slots...
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.moveTemplateList} nestedScrollEnabled>
                {slotTemplates
                  .filter(template => {
                    const templateKey = `${template.start_hm}|${template.end_hm}`;

                    return templateKey !== movePickerSlotKey;
                  })
                  .map((template, index) => {
                    const templateKey = `${template.start_hm}|${template.end_hm}`;

                    const selected =
                      moveTargetBySlot[movePickerSlotKey] &&
                      `${moveTargetBySlot[movePickerSlotKey].start_hm}|${moveTargetBySlot[movePickerSlotKey].end_hm}` ===
                        templateKey;

                    return (
                      <Pressable
                        key={`${templateKey}-${index}`}
                        onPress={() => {
                          setMoveTargetBySlot(current => ({
                            ...current,

                            [movePickerSlotKey]: {
                              start_hm: template.start_hm,

                              end_hm: template.end_hm,

                              label: template.label || null,
                            },
                          }));

                          setMovePickerVisible(false);
                        }}
                        style={({ pressed }) => [
                          styles.templateRow,

                          selected && styles.templateRowSelected,

                          pressed && styles.controlPressed,
                        ]}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.templateTime}>
                            {template.start_hm}
                            {' – '}
                            {template.end_hm}
                          </Text>

                          {template.label ? (
                            <Text style={styles.templateLabel}>
                              {template.label}
                            </Text>
                          ) : null}
                        </View>

                        {selected ? (
                          <Text style={styles.templateCheck}>✓</Text>
                        ) : null}
                      </Pressable>
                    );
                  })}
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setMovePickerVisible(false)}
                style={({ pressed }) => [
                  styles.modalCancelButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.hiddenMetadata}>
        <Text>{examinationId}</Text>
      </View>
    </ScrollView>
  );
}
