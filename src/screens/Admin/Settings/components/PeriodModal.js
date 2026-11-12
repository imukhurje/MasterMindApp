import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  PanResponder,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { COLORS, styles } from './PeriodModal.styles';

const MINUTES_IN_DAY = 24 * 60;

const TIME_STEP = 15;
const ZOOM_STEP = 30;

const DEFAULT_START = 9 * 60;
const DEFAULT_END = 10 * 60;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function snap(value, step) {
  return Math.round(value / step) * step;
}

function timeToMinutes(value) {
  if (!value) {
    return null;
  }

  const match = String(value)
    .trim()
    .match(/^(\d{1,2}):(\d{2})$/);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

function minutesToTime(value) {
  const safeMinutes = clamp(Math.round(value), 0, MINUTES_IN_DAY - 1);

  const hours = Math.floor(safeMinutes / 60);

  const minutes = safeMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0',
  )}`;
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function DualRangeSlider({
  startValue,
  endValue,
  minimumValue,
  maximumValue,
  step,
  occupiedRanges = [],
  disabled = false,
  onStartChange,
  onEndChange,
}) {
  const [trackWidth, setTrackWidth] = useState(0);

  const usableRange = maximumValue - minimumValue;

  function valueToX(value) {
    if (!trackWidth || usableRange <= 0) {
      return 0;
    }

    return ((value - minimumValue) / usableRange) * trackWidth;
  }

  function xToValue(x) {
    if (!trackWidth || usableRange <= 0) {
      return minimumValue;
    }

    const ratio = clamp(x, 0, trackWidth) / trackWidth;

    return snap(minimumValue + ratio * usableRange, step);
  }

  const startX = valueToX(startValue);

  const endX = valueToX(endValue);

  const startPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,

        onMoveShouldSetPanResponder: () => !disabled,

        onPanResponderMove: (_event, gesture) => {
          const nextX = startX + gesture.dx;

          let nextValue = xToValue(nextX);

          nextValue = clamp(nextValue, minimumValue, endValue - step);

          onStartChange?.(nextValue);
        },
      }),
    [
      disabled,
      startX,
      endValue,
      step,
      minimumValue,
      trackWidth,
      usableRange,
      onStartChange,
    ],
  );

  const endPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,

        onMoveShouldSetPanResponder: () => !disabled,

        onPanResponderMove: (_event, gesture) => {
          const nextX = endX + gesture.dx;

          let nextValue = xToValue(nextX);

          nextValue = clamp(nextValue, startValue + step, maximumValue);

          onEndChange?.(nextValue);
        },
      }),
    [
      disabled,
      endX,
      startValue,
      step,
      maximumValue,
      trackWidth,
      usableRange,
      onEndChange,
    ],
  );

  const selectedLeft = trackWidth > 0 ? (startX / trackWidth) * 100 : 0;

  const selectedWidth =
    trackWidth > 0 ? ((endX - startX) / trackWidth) * 100 : 0;

  return (
    <View style={[styles.sliderWrapper, disabled && styles.disabledControl]}>
      <View
        style={styles.sliderTouchArea}
        onLayout={event => {
          setTrackWidth(event.nativeEvent.layout.width);
        }}
      >
        <View style={styles.sliderTrack}>
          {occupiedRanges.map((range, index) => {
            const visibleStart = clamp(range.start, minimumValue, maximumValue);

            const visibleEnd = clamp(range.end, minimumValue, maximumValue);

            if (visibleEnd <= visibleStart) {
              return null;
            }

            const left = ((visibleStart - minimumValue) / usableRange) * 100;

            const width = ((visibleEnd - visibleStart) / usableRange) * 100;

            return (
              <View
                key={`${range.start}-${range.end}-${index}`}
                style={[
                  styles.occupiedRange,
                  {
                    left: `${left}%`,
                    width: `${width}%`,
                  },
                ]}
              />
            );
          })}

          <View
            style={[
              styles.selectedRange,
              {
                left: `${selectedLeft}%`,
                width: `${selectedWidth}%`,
              },
            ]}
          />

          <View
            {...startPanResponder.panHandlers}
            style={[
              styles.sliderThumb,
              {
                left: startX - 10,
              },
            ]}
          />

          <View
            {...endPanResponder.panHandlers}
            style={[
              styles.sliderThumb,
              {
                left: endX - 10,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

export default function PeriodModal({
  visible,
  mode = 'add',
  template,
  period = null,
  saving = false,
  onClose,
  onSave,
}) {
  const isEdit = mode === 'edit';

  const [label, setLabel] = useState('');

  const [startMinutes, setStartMinutes] = useState(DEFAULT_START);

  const [endMinutes, setEndMinutes] = useState(DEFAULT_END);

  const [startTimeInput, setStartTimeInput] = useState(
    minutesToTime(DEFAULT_START),
  );

  const [endTimeInput, setEndTimeInput] = useState(minutesToTime(DEFAULT_END));

  const [zoomStart, setZoomStart] = useState(0);

  const [zoomEnd, setZoomEnd] = useState(MINUTES_IN_DAY);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (isEdit && period) {
      const parsedStart = timeToMinutes(period?.start_time);

      const parsedEnd = timeToMinutes(period?.end_time);

      const finalStart = parsedStart ?? DEFAULT_START;

      const finalEnd = parsedEnd ?? DEFAULT_END;

      setLabel(String(period?.label || ''));

      setStartMinutes(finalStart);
      setEndMinutes(finalEnd);

      setStartTimeInput(minutesToTime(finalStart));

      setEndTimeInput(minutesToTime(finalEnd));

      /*
       * Open the zoom around the
       * current period when editing.
       */
      setZoomStart(Math.max(0, snap(finalStart - 120, ZOOM_STEP)));

      setZoomEnd(Math.min(MINUTES_IN_DAY, snap(finalEnd + 120, ZOOM_STEP)));

      return;
    }

    setLabel('');

    setStartMinutes(DEFAULT_START);

    setEndMinutes(DEFAULT_END);

    setStartTimeInput(minutesToTime(DEFAULT_START));

    setEndTimeInput(minutesToTime(DEFAULT_END));

    setZoomStart(0);
    setZoomEnd(MINUTES_IN_DAY);
  }, [visible, isEdit, period]);

  const existingRanges = useMemo(() => {
    const periods = Array.isArray(template?.periods) ? template.periods : [];

    return periods
      .filter(currentPeriod => {
        /*
         * During edit, the current period
         * must not conflict with itself.
         */
        if (
          isEdit &&
          period?.id &&
          String(currentPeriod?.id) === String(period.id)
        ) {
          return false;
        }

        return true;
      })
      .map(currentPeriod => {
        const start = timeToMinutes(currentPeriod?.start_time);

        const end = timeToMinutes(currentPeriod?.end_time);

        return {
          start: start ?? 0,

          end: end ?? 0,

          label: currentPeriod?.label || 'Period',
        };
      });
  }, [template?.periods, isEdit, period?.id]);

  const hasConflict = useMemo(() => {
    return existingRanges.some(range =>
      rangesOverlap(startMinutes, endMinutes, range.start, range.end),
    );
  }, [existingRanges, startMinutes, endMinutes]);

  function handleStartSliderChange(value) {
    setStartMinutes(value);

    setStartTimeInput(minutesToTime(value));
  }

  function handleEndSliderChange(value) {
    setEndMinutes(value);

    setEndTimeInput(minutesToTime(value));
  }

  function handleStartTimeBlur() {
    const parsed = timeToMinutes(startTimeInput);

    if (parsed === null) {
      setStartTimeInput(minutesToTime(startMinutes));

      Alert.alert(
        'Invalid Start Time',
        'Please enter the time in HH:mm format, for example 09:45.',
      );

      return;
    }

    if (parsed >= endMinutes) {
      setStartTimeInput(minutesToTime(startMinutes));

      Alert.alert(
        'Invalid Start Time',
        'Start time must be earlier than end time.',
      );

      return;
    }

    setStartMinutes(parsed);

    setStartTimeInput(minutesToTime(parsed));

    /*
     * Expand zoom automatically when
     * manually entered time is outside it.
     */
    if (parsed < zoomStart) {
      setZoomStart(Math.max(0, snap(parsed - 60, ZOOM_STEP)));
    }
  }

  function handleEndTimeBlur() {
    const parsed = timeToMinutes(endTimeInput);

    if (parsed === null) {
      setEndTimeInput(minutesToTime(endMinutes));

      Alert.alert(
        'Invalid End Time',
        'Please enter the time in HH:mm format, for example 13:15.',
      );

      return;
    }

    if (parsed <= startMinutes) {
      setEndTimeInput(minutesToTime(endMinutes));

      Alert.alert(
        'Invalid End Time',
        'End time must be later than start time.',
      );

      return;
    }

    setEndMinutes(parsed);

    setEndTimeInput(minutesToTime(parsed));

    if (parsed > zoomEnd) {
      setZoomEnd(Math.min(MINUTES_IN_DAY, snap(parsed + 60, ZOOM_STEP)));
    }
  }

  function handleSubmit() {
    const cleanLabel = label.trim();

    const parsedStart = timeToMinutes(startTimeInput);

    const parsedEnd = timeToMinutes(endTimeInput);

    if (!cleanLabel) {
      Alert.alert('Label Required', 'Please enter a period label.');

      return;
    }

    if (parsedStart === null || parsedEnd === null) {
      Alert.alert(
        'Invalid Time',
        'Please enter start and end time in HH:mm format.',
      );

      return;
    }

    if (parsedEnd <= parsedStart) {
      Alert.alert('Invalid Time Range', 'End time must be after start time.');

      return;
    }

    const conflict = existingRanges.some(range =>
      rangesOverlap(parsedStart, parsedEnd, range.start, range.end),
    );

    if (conflict) {
      Alert.alert(
        'Time Slot Unavailable',
        'This time range overlaps with another period.',
      );

      return;
    }

    onSave?.({
      label: cleanLabel,

      start_time: minutesToTime(parsedStart),

      end_time: minutesToTime(parsedEnd),
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        if (!saving) {
          onClose?.();
        }
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>
                {isEdit ? 'Edit Period' : 'Add Period'}
              </Text>

              <Text style={styles.subtitle}>
                {template?.name || 'Day Template'}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              disabled={saving}
              style={({ pressed }) => [
                styles.closeButton,

                pressed && !saving && styles.buttonPressed,

                saving && styles.disabledControl,
              ]}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Label</Text>

            <TextInput
              value={label}
              onChangeText={setLabel}
              editable={!saving}
              placeholder="e.g., First Period"
              placeholderTextColor={COLORS.MUTED}
              style={styles.textInput}
            />

            <Text style={styles.rangeLabel}>Time Range (24h)</Text>

            {/* Manual time entry */}

            <View style={styles.timeFieldsRow}>
              <View style={styles.timeFieldGroup}>
                <Text style={styles.timeFieldLabel}>Start Time</Text>

                <TextInput
                  value={startTimeInput}
                  onChangeText={setStartTimeInput}
                  onBlur={handleStartTimeBlur}
                  editable={!saving}
                  placeholder="09:45"
                  placeholderTextColor={COLORS.MUTED}
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                  selectTextOnFocus
                  style={styles.timeInput}
                />
              </View>

              <View style={styles.timeSeparatorContainer}>
                <Text style={styles.timeSeparator}>→</Text>
              </View>

              <View style={styles.timeFieldGroup}>
                <Text style={styles.timeFieldLabel}>End Time</Text>

                <TextInput
                  value={endTimeInput}
                  onChangeText={setEndTimeInput}
                  onBlur={handleEndTimeBlur}
                  editable={!saving}
                  placeholder="11:45"
                  placeholderTextColor={COLORS.MUTED}
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                  selectTextOnFocus
                  style={styles.timeInput}
                />
              </View>
            </View>

            <DualRangeSlider
              startValue={startMinutes}
              endValue={endMinutes}
              minimumValue={zoomStart}
              maximumValue={zoomEnd}
              step={TIME_STEP}
              occupiedRanges={existingRanges}
              disabled={saving}
              onStartChange={handleStartSliderChange}
              onEndChange={handleEndSliderChange}
            />

            <View style={styles.selectedTimeRow}>
              <View
                style={[
                  styles.selectedTimeBadge,

                  hasConflict && styles.selectedTimeBadgeConflict,
                ]}
              >
                <Text
                  style={[
                    styles.selectedTimeText,

                    hasConflict && styles.conflictText,
                  ]}
                >
                  {minutesToTime(startMinutes)}
                  {'  →  '}
                  {minutesToTime(endMinutes)}
                </Text>
              </View>

              <Text style={styles.durationText}>
                {Math.max(0, endMinutes - startMinutes)} min
              </Text>
            </View>

            {hasConflict ? (
              <Text style={styles.conflictMessage}>
                Selected time overlaps with another period.
              </Text>
            ) : null}

            <View style={styles.zoomHeader}>
              <Text style={styles.rangeLabel}>Zoom window (30-min steps)</Text>

              <Text style={styles.zoomValue}>
                {minutesToTime(zoomStart)} –{' '}
                {zoomEnd === MINUTES_IN_DAY ? '24:00' : minutesToTime(zoomEnd)}
              </Text>
            </View>

            <DualRangeSlider
              startValue={zoomStart}
              endValue={zoomEnd}
              minimumValue={0}
              maximumValue={MINUTES_IN_DAY}
              step={ZOOM_STEP}
              occupiedRanges={[]}
              disabled={saving}
              onStartChange={value => {
                const next = Math.min(value, zoomEnd - 60);

                setZoomStart(next);
              }}
              onEndChange={value => {
                const next = Math.max(value, zoomStart + 60);

                setZoomEnd(next);
              }}
            />

            <View style={styles.actions}>
              <Pressable
                onPress={onClose}
                disabled={saving}
                style={({ pressed }) => [
                  styles.cancelButton,

                  pressed && !saving && styles.buttonPressed,

                  saving && styles.disabledControl,
                ]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                disabled={saving || !label.trim()}
                style={({ pressed }) => [
                  styles.addButton,

                  pressed && !saving && label.trim() && styles.buttonPressed,

                  (saving || !label.trim()) && styles.disabledControl,
                ]}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT} />
                ) : (
                  <Text style={styles.addButtonText}>
                    {isEdit ? 'Save Changes' : 'Add'}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
