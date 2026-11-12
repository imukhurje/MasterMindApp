import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { COLORS, styles } from './AttendanceFrequencySettings.styles';

const FREQUENCY_LECTURE = 'Once every Lecture';

const FREQUENCY_DAY = 'Once every Day';

function normalizeClass(item) {
  const id = Number(item?.id);

  if (!Number.isFinite(id)) {
    return null;
  }

  return {
    id,
    label: String(item?.label || item?.name || `Class ${id}`),
  };
}

function normalizeClasses(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  const seen = new Set();

  return items
    .map(normalizeClass)
    .filter(Boolean)
    .filter(item => {
      if (seen.has(item.id)) {
        return false;
      }

      seen.add(item.id);

      return true;
    });
}

function getSearchResults(response) {
  if (Array.isArray(response)) {
    return normalizeClasses(response);
  }

  if (Array.isArray(response?.data)) {
    return normalizeClasses(response.data);
  }

  if (Array.isArray(response?.classes)) {
    return normalizeClasses(response.classes);
  }

  return [];
}

function getSortedIds(items) {
  return items
    .map(item => Number(item.id))
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
}

function sameIds(first, second) {
  return (
    JSON.stringify(getSortedIds(first)) === JSON.stringify(getSortedIds(second))
  );
}

function ClassFrequencyColumn({
  title,
  searchText,
  setSearchText,
  selectedSearchClass,
  setSelectedSearchClass,
  searchResults,
  searching,
  classes,
  onAdd,
  onRemove,
  disabled,
}) {
  const visibleResults =
    searchText.trim().length > 0 ? searchResults.slice(0, 8) : [];

  return (
    <View style={styles.frequencyColumn}>
      <Text style={styles.frequencyTitle}>{title}</Text>

      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            value={searchText}
            onChangeText={value => {
              setSearchText(value);

              setSelectedSearchClass(null);
            }}
            editable={!disabled}
            placeholder="Type a class name..."
            placeholderTextColor={COLORS.MUTED}
            style={styles.searchInput}
          />

          {searching ? (
            <ActivityIndicator
              size="small"
              color={COLORS.BLUE}
              style={styles.searchIndicator}
            />
          ) : null}

          {visibleResults.length > 0 ? (
            <View style={styles.searchResults}>
              {visibleResults.map(item => {
                const selected = selectedSearchClass?.id === item.id;

                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      setSelectedSearchClass(item);

                      setSearchText(item.label);
                    }}
                    style={({ pressed }) => [
                      styles.searchResultItem,

                      selected && styles.searchResultSelected,

                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.searchResultText} numberOfLines={1}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>

        <Pressable
          onPress={onAdd}
          disabled={disabled || !selectedSearchClass}
          style={({ pressed }) => [
            styles.addButton,

            pressed && !disabled && selectedSearchClass && styles.buttonPressed,

            (disabled || !selectedSearchClass) && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <View style={styles.classPills}>
        {classes.map(item => (
          <View key={item.id} style={styles.classPill}>
            <Text style={styles.classPillText} numberOfLines={1}>
              {item.label}
            </Text>

            <Pressable
              onPress={() => onRemove(item.id)}
              disabled={disabled}
              hitSlop={6}
              style={({ pressed }) => [
                styles.removeButton,

                pressed && !disabled && styles.buttonPressed,
              ]}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function AttendanceFrequencySettings() {
  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [defaultFrequency, setDefaultFrequency] = useState('');

  const [lectureClasses, setLectureClasses] = useState([]);

  const [dayClasses, setDayClasses] = useState([]);

  const [savedLectureClasses, setSavedLectureClasses] = useState([]);

  const [savedDayClasses, setSavedDayClasses] = useState([]);

  const [lectureSearch, setLectureSearch] = useState('');

  const [daySearch, setDaySearch] = useState('');

  const [lectureSearchResults, setLectureSearchResults] = useState([]);

  const [daySearchResults, setDaySearchResults] = useState([]);

  const [selectedLectureClass, setSelectedLectureClass] = useState(null);

  const [selectedDayClass, setSelectedDayClass] = useState(null);

  const [searchingLecture, setSearchingLecture] = useState(false);

  const [searchingDay, setSearchingDay] = useState(false);

  const [saving, setSaving] = useState(false);

  const loadAttendanceFrequency = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');

      const response = await api('/api/settings/v1/attendance-frequency', {
        method: 'GET',
      });

      const classes = Array.isArray(response?.classes) ? response.classes : [];

      const lecture = [];
      const daily = [];

      classes.forEach(item => {
        const normalized = normalizeClass(item);

        if (!normalized) {
          return;
        }

        if (item?.frequency === FREQUENCY_LECTURE) {
          lecture.push(normalized);

          return;
        }

        if (item?.frequency === FREQUENCY_DAY) {
          daily.push(normalized);
        }
      });

      setDefaultFrequency(String(response?.default_frequency || ''));

      setLectureClasses(lecture);
      setDayClasses(daily);

      setSavedLectureClasses(
        lecture.map(item => ({
          ...item,
        })),
      );

      setSavedDayClasses(
        daily.map(item => ({
          ...item,
        })),
      );
    } catch (error) {
      console.log('Attendance frequency load error:', error);

      setLoadError(
        error?.message || 'Could not load attendance frequency settings.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttendanceFrequency();
  }, [loadAttendanceFrequency]);

  useEffect(() => {
    const query = lectureSearch.trim();

    if (query.length < 1) {
      setLectureSearchResults([]);
      setSearchingLecture(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setSearchingLecture(true);

        const response = await api(
          `/api/ott/classgroups?q=${encodeURIComponent(query)}`,
          {
            method: 'GET',
          },
        );

        if (cancelled) {
          return;
        }

        setLectureSearchResults(getSearchResults(response));
      } catch (error) {
        if (!cancelled) {
          console.log('Lecture class search error:', error);

          setLectureSearchResults([]);
        }
      } finally {
        if (!cancelled) {
          setSearchingLecture(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [lectureSearch]);

  useEffect(() => {
    const query = daySearch.trim();

    if (query.length < 1) {
      setDaySearchResults([]);
      setSearchingDay(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setSearchingDay(true);

        const response = await api(
          `/api/ott/classgroups?q=${encodeURIComponent(query)}`,
          {
            method: 'GET',
          },
        );

        if (cancelled) {
          return;
        }

        setDaySearchResults(getSearchResults(response));
      } catch (error) {
        if (!cancelled) {
          console.log('Day class search error:', error);

          setDaySearchResults([]);
        }
      } finally {
        if (!cancelled) {
          setSearchingDay(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [daySearch]);

  const hasChanges = useMemo(() => {
    return (
      !sameIds(lectureClasses, savedLectureClasses) ||
      !sameIds(dayClasses, savedDayClasses)
    );
  }, [lectureClasses, dayClasses, savedLectureClasses, savedDayClasses]);

  function addToLecture() {
    if (!selectedLectureClass) {
      return;
    }

    const selected = selectedLectureClass;

    /*
     * A class can belong to only one frequency.
     * Remove it from Once every Day first.
     */
    setDayClasses(previous => previous.filter(item => item.id !== selected.id));

    setLectureClasses(previous => {
      const alreadyExists = previous.some(item => item.id === selected.id);

      if (alreadyExists) {
        return previous;
      }

      return [...previous, selected];
    });

    setLectureSearch('');
    setLectureSearchResults([]);
    setSelectedLectureClass(null);
  }

  function addToDay() {
    if (!selectedDayClass) {
      return;
    }

    const selected = selectedDayClass;

    /*
     * A class can belong to only one frequency.
     * Remove it from Once every Lecture first.
     */
    setLectureClasses(previous =>
      previous.filter(item => item.id !== selected.id),
    );

    setDayClasses(previous => {
      const alreadyExists = previous.some(item => item.id === selected.id);

      if (alreadyExists) {
        return previous;
      }

      return [...previous, selected];
    });

    setDaySearch('');
    setDaySearchResults([]);
    setSelectedDayClass(null);
  }

  function removeLectureClass(classId) {
    setLectureClasses(previous =>
      previous.filter(item => Number(item.id) !== Number(classId)),
    );
  }

  function removeDayClass(classId) {
    setDayClasses(previous =>
      previous.filter(item => Number(item.id) !== Number(classId)),
    );
  }

  async function handleSave() {
    if (saving || !hasChanges) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        once_every_lecture_class_ids: getSortedIds(lectureClasses),

        once_every_day_class_ids: getSortedIds(dayClasses),
      };

      console.log('Attendance frequency payload:', payload);

      const response = await api('/api/settings/v1/attendance-frequency', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (!response?.ok) {
        throw new Error(
          'The server did not confirm the attendance frequency update.',
        );
      }

      setSavedLectureClasses(
        lectureClasses.map(item => ({
          ...item,
        })),
      );

      setSavedDayClasses(
        dayClasses.map(item => ({
          ...item,
        })),
      );

      Alert.alert(
        'Attendance Frequency Updated',
        'Class attendance frequencies have been saved successfully.',
      );
    } catch (error) {
      console.log('Attendance frequency save error:', error);

      Alert.alert(
        'Could not save frequencies',
        error?.message || 'Attendance frequency settings could not be saved.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />

          <Text style={styles.stateText}>
            Loading attendance frequencies...
          </Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.section}>
        <View style={styles.stateContainer}>
          <Text style={styles.errorTitle}>
            Could not load attendance frequencies
          </Text>

          <Text style={styles.errorDescription}>{loadError}</Text>

          <Pressable
            onPress={loadAttendanceFrequency}
            style={({ pressed }) => [
              styles.saveButton,

              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.saveButtonText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Student Attendance Frequency by Class
      </Text>

      <Text style={styles.description}>
        Assign each class to one frequency. Classes added later use the default
        attendance frequency until saved here.
      </Text>

      {defaultFrequency ? (
        <Text style={styles.defaultText}>
          Default frequency:{' '}
          <Text style={styles.defaultValue}>{defaultFrequency}</Text>
        </Text>
      ) : null}

      <View style={styles.columnsContainer}>
        <ClassFrequencyColumn
          title={FREQUENCY_LECTURE}
          searchText={lectureSearch}
          setSearchText={setLectureSearch}
          selectedSearchClass={selectedLectureClass}
          setSelectedSearchClass={setSelectedLectureClass}
          searchResults={lectureSearchResults}
          searching={searchingLecture}
          classes={lectureClasses}
          onAdd={addToLecture}
          onRemove={removeLectureClass}
          disabled={saving}
        />

        <ClassFrequencyColumn
          title={FREQUENCY_DAY}
          searchText={daySearch}
          setSearchText={setDaySearch}
          selectedSearchClass={selectedDayClass}
          setSelectedSearchClass={setSelectedDayClass}
          searchResults={daySearchResults}
          searching={searchingDay}
          classes={dayClasses}
          onAdd={addToDay}
          onRemove={removeDayClass}
          disabled={saving}
        />
      </View>

      <Pressable
        onPress={handleSave}
        disabled={saving || !hasChanges}
        style={({ pressed }) => [
          styles.saveButton,

          pressed && !saving && hasChanges && styles.buttonPressed,

          (saving || !hasChanges) && styles.buttonDisabled,
        ]}
      >
        {saving ? (
          <ActivityIndicator size="small" color={COLORS.TEXT} />
        ) : (
          <Text style={styles.saveButtonText}>Save Class Frequencies</Text>
        )}
      </Pressable>
    </View>
  );
}
