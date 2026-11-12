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

import { COLORS, styles } from './StudentSubjectsByClassSettings.styles';

const ALLOCATION_SHARED = 'shared';
const ALLOCATION_DIFFERENT = 'different';

/*
 * Normalize class data from different APIs.
 */
function normalizeClass(item) {
  const id = Number(item?.id);

  if (!Number.isFinite(id)) {
    return null;
  }

  let label = String(item?.label || '').trim();

  /*
   * classgroups API may return
   * name + section instead of label.
   */
  if (!label) {
    const name = String(item?.name || '').trim();

    const section = String(item?.section || '').trim();

    if (name && section) {
      label = `${name} (${section})`;
    } else if (name) {
      label = name;
    } else {
      label = `Class ${id}`;
    }
  }

  return {
    id,
    label,
  };
}

/*
 * Remove duplicate classes by ID.
 */
function normalizeClassList(items) {
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

/*
 * Handle different class search API
 * response structures.
 */
function getClassSearchResults(response) {
  if (Array.isArray(response)) {
    return normalizeClassList(response);
  }

  if (Array.isArray(response?.data)) {
    return normalizeClassList(response.data);
  }

  if (Array.isArray(response?.classes)) {
    return normalizeClassList(response.classes);
  }

  if (Array.isArray(response?.data?.data)) {
    return normalizeClassList(response.data.data);
  }

  return [];
}

function getSortedIds(items) {
  return items
    .map(item => Number(item?.id))
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
}

function sameIds(first, second) {
  return (
    JSON.stringify(getSortedIds(first)) === JSON.stringify(getSortedIds(second))
  );
}

/*
 * One allocation box.
 */
function AllocationColumn({
  title,

  searchText,
  setSearchText,

  selectedClass,
  setSelectedClass,

  searchResults,
  searching,

  assignedIds,

  lockedClassInfo,

  classes,

  onAdd,
  onRemove,

  disabled,
}) {
  /*
   * IMPORTANT:
   *
   * Any class already assigned to
   * Shared OR Different must not
   * appear in either dropdown.
   */
  const visibleResults = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return searchResults
      .filter(item => {
        return !assignedIds.has(Number(item.id));
      })
      .slice(0, 8);
  }, [searchText, searchResults, assignedIds]);

  function showLockedMessage(item) {
    const info = lockedClassInfo?.[Number(item.id)];

    if (!info) {
      return;
    }

    const count = Number(info.studentCount || 0);

    const studentText = count === 1 ? 'student is' : 'students are';

    Alert.alert(
      'Class Cannot Be Changed',
      `${count} ${studentText} currently assigned to "${
        info.combinationName
      }". Unassign ${
        count === 1 ? 'the student' : 'these students'
      } from the subject combination before changing this class allocation.`,
    );
  }

  return (
    <View style={styles.allocationColumn}>
      <Text style={styles.allocationTitle}>{title}</Text>

      {/* Class Search */}

      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            value={searchText}
            onChangeText={value => {
              setSearchText(value);

              setSelectedClass(null);
            }}
            editable={!disabled}
            placeholder="Type a class name..."
            placeholderTextColor={COLORS.MUTED}
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.searchInput}
          />

          {searching ? (
            <View
              style={{
                position: 'absolute',

                right: 12,

                top: 12,
              }}
            >
              <ActivityIndicator size="small" color={COLORS.BLUE} />
            </View>
          ) : null}

          {/* Search Results */}

          {visibleResults.length > 0 ? (
            <View style={styles.searchResults}>
              {visibleResults.map(item => {
                const selected = Number(selectedClass?.id) === Number(item.id);

                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      setSelectedClass(item);

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

        {/* Add */}

        <Pressable
          onPress={onAdd}
          disabled={disabled || !selectedClass}
          style={({ pressed }) => [
            styles.addButton,

            (disabled || !selectedClass) && styles.buttonDisabled,

            pressed && !disabled && selectedClass && styles.buttonPressed,
          ]}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {/* Assigned Classes */}

      <View style={styles.classPills}>
        {classes.map(item => {
          const lockInfo = lockedClassInfo?.[Number(item.id)] || null;

          const isLocked = Boolean(lockInfo);

          return (
            <View key={item.id} style={styles.classPill}>
              <Text style={styles.classPillText} numberOfLines={1}>
                {item.label}
              </Text>

              {isLocked ? (
                /*
                 * Students are already assigned
                 * through a subject combination.
                 *
                 * Do not allow this class
                 * to be removed.
                 */
                <Pressable
                  onPress={() => showLockedMessage(item)}
                  hitSlop={6}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>🔒</Text>
                </Pressable>
              ) : (
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
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function StudentSubjectsByClassSettings() {
  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  /*
   * Current allocation.
   */
  const [sharedClasses, setSharedClasses] = useState([]);

  const [differentClasses, setDifferentClasses] = useState([]);

  /*
   * Saved allocation snapshot.
   */
  const [savedSharedClasses, setSavedSharedClasses] = useState([]);

  const [savedDifferentClasses, setSavedDifferentClasses] = useState([]);

  /*
   * Classes that cannot be moved
   * because students are assigned
   * through a subject combination.
   */
  const [lockedClassInfo, setLockedClassInfo] = useState({});

  /*
   * Shared search.
   */
  const [sharedSearch, setSharedSearch] = useState('');

  const [sharedSearchResults, setSharedSearchResults] = useState([]);

  const [selectedSharedClass, setSelectedSharedClass] = useState(null);

  const [searchingShared, setSearchingShared] = useState(false);

  /*
   * Different combination search.
   */
  const [differentSearch, setDifferentSearch] = useState('');

  const [differentSearchResults, setDifferentSearchResults] = useState([]);

  const [selectedDifferentClass, setSelectedDifferentClass] = useState(null);

  const [searchingDifferent, setSearchingDifferent] = useState(false);

  const [saving, setSaving] = useState(false);

  /*
   * Load current subject allocation.
   */
  const loadSubjectAllocation = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const response = await api('/api/settings/v1/subject-allocation', {
        method: 'GET',
      });

      const apiClasses = Array.isArray(response?.classes)
        ? response.classes
        : [];

      const shared = [];

      const different = [];

      /*
       * Split current classes into
       * Shared and Different.
       */
      apiClasses.forEach(item => {
        const normalized = normalizeClass(item);

        if (!normalized) {
          return;
        }

        if (item?.allocation === ALLOCATION_DIFFERENT) {
          different.push(normalized);

          return;
        }

        shared.push(normalized);
      });

      /*
       * Build lock information
       * from Subject Combinations.
       */
      const combinations = Array.isArray(response?.combinations)
        ? response.combinations
        : [];

      const nextLockedInfo = {};

      combinations.forEach(combination => {
        const combinationName = String(
          combination?.name || 'Subject Combination',
        );

        const counts =
          combination?.class_student_counts &&
          typeof combination.class_student_counts === 'object'
            ? combination.class_student_counts
            : {};

        Object.entries(counts).forEach(([classId, count]) => {
          const numericClassId = Number(classId);

          const studentCount = Number(count || 0);

          if (!Number.isFinite(numericClassId) || studentCount <= 0) {
            return;
          }

          /*
           * Usually one class belongs
           * to one combination.
           *
           * If multiple combinations
           * somehow contain students
           * from the same class,
           * aggregate the count.
           */
          if (nextLockedInfo[numericClassId]) {
            const previous = nextLockedInfo[numericClassId];

            nextLockedInfo[numericClassId] = {
              combinationName: `${previous.combinationName}, ${combinationName}`,

              studentCount: Number(previous.studentCount || 0) + studentCount,
            };

            return;
          }

          nextLockedInfo[numericClassId] = {
            combinationId: combination?.id,

            combinationName,

            studentCount,
          };
        });
      });

      setLockedClassInfo(nextLockedInfo);

      setSharedClasses(shared);

      setDifferentClasses(different);

      setSavedSharedClasses(
        shared.map(item => ({
          ...item,
        })),
      );

      setSavedDifferentClasses(
        different.map(item => ({
          ...item,
        })),
      );
    } catch (error) {
      console.log('Subject allocation load error:', error);

      setLoadError(
        error?.message || 'Could not load subject allocation settings.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjectAllocation();
  }, [loadSubjectAllocation]);

  /*
   * Every class present in either side
   * is considered assigned.
   *
   * These classes must be hidden
   * from BOTH dropdowns.
   */
  const assignedIds = useMemo(() => {
    return new Set([
      ...sharedClasses.map(item => Number(item.id)),

      ...differentClasses.map(item => Number(item.id)),
    ]);
  }, [sharedClasses, differentClasses]);

  /*
   * Search classes for Shared side.
   *
   * Master class source:
   * /api/ott/classgroups?q=
   */
  useEffect(() => {
    const query = sharedSearch.trim();

    if (query.length < 1) {
      setSharedSearchResults([]);

      setSearchingShared(false);

      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setSearchingShared(true);

        const response = await api(
          `/api/ott/classgroups?q=${encodeURIComponent(query)}`,
          {
            method: 'GET',
          },
        );

        if (cancelled) {
          return;
        }

        setSharedSearchResults(getClassSearchResults(response));
      } catch (error) {
        console.log('Shared class search error:', error);

        if (!cancelled) {
          setSharedSearchResults([]);
        }
      } finally {
        if (!cancelled) {
          setSearchingShared(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;

      clearTimeout(timer);
    };
  }, [sharedSearch]);

  /*
   * Search classes for
   * Different Combination side.
   */
  useEffect(() => {
    const query = differentSearch.trim();

    if (query.length < 1) {
      setDifferentSearchResults([]);

      setSearchingDifferent(false);

      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setSearchingDifferent(true);

        const response = await api(
          `/api/ott/classgroups?q=${encodeURIComponent(query)}`,
          {
            method: 'GET',
          },
        );

        if (cancelled) {
          return;
        }

        setDifferentSearchResults(getClassSearchResults(response));
      } catch (error) {
        console.log('Different class search error:', error);

        if (!cancelled) {
          setDifferentSearchResults([]);
        }
      } finally {
        if (!cancelled) {
          setSearchingDifferent(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;

      clearTimeout(timer);
    };
  }, [differentSearch]);

  /*
   * Detect unsaved changes.
   */
  const hasChanges = useMemo(() => {
    return (
      !sameIds(sharedClasses, savedSharedClasses) ||
      !sameIds(differentClasses, savedDifferentClasses)
    );
  }, [
    sharedClasses,
    differentClasses,
    savedSharedClasses,
    savedDifferentClasses,
  ]);

  /*
   * Add an unassigned class
   * to Shared.
   */
  function addToShared() {
    if (!selectedSharedClass) {
      return;
    }

    const selected = selectedSharedClass;

    /*
     * Extra safety.
     *
     * UI already filters these,
     * but do not allow duplicates
     * even if state changed meanwhile.
     */
    if (assignedIds.has(Number(selected.id))) {
      Alert.alert(
        'Class Already Assigned',
        'This class is already assigned. Remove it from its existing allocation before assigning it again.',
      );

      return;
    }

    setSharedClasses(previous => [...previous, selected]);

    setSharedSearch('');

    setSharedSearchResults([]);

    setSelectedSharedClass(null);
  }

  /*
   * Add an unassigned class
   * to Different Combination.
   */
  function addToDifferent() {
    if (!selectedDifferentClass) {
      return;
    }

    const selected = selectedDifferentClass;

    if (assignedIds.has(Number(selected.id))) {
      Alert.alert(
        'Class Already Assigned',
        'This class is already assigned. Remove it from its existing allocation before assigning it again.',
      );

      return;
    }

    setDifferentClasses(previous => [...previous, selected]);

    setDifferentSearch('');

    setDifferentSearchResults([]);

    setSelectedDifferentClass(null);
  }

  /*
   * Remove Shared class.
   *
   * Locked classes cannot normally
   * reach this function because
   * the UI shows the lock button.
   */
  function removeSharedClass(classId) {
    const numericClassId = Number(classId);

    const lockInfo = lockedClassInfo?.[numericClassId];

    if (lockInfo) {
      Alert.alert(
        'Class Cannot Be Changed',
        `${lockInfo.studentCount} student${
          lockInfo.studentCount === 1 ? '' : 's'
        } ${
          lockInfo.studentCount === 1 ? 'is' : 'are'
        } currently assigned to "${
          lockInfo.combinationName
        }". Unassign them before changing this class allocation.`,
      );

      return;
    }

    setSharedClasses(previous =>
      previous.filter(item => Number(item.id) !== numericClassId),
    );

    /*
     * Clear searches so stale results
     * are not shown.
     */
    setSharedSearch('');

    setDifferentSearch('');

    setSharedSearchResults([]);

    setDifferentSearchResults([]);

    setSelectedSharedClass(null);

    setSelectedDifferentClass(null);
  }

  /*
   * Remove Different class.
   */
  function removeDifferentClass(classId) {
    const numericClassId = Number(classId);

    const lockInfo = lockedClassInfo?.[numericClassId];

    if (lockInfo) {
      Alert.alert(
        'Class Cannot Be Changed',
        `${lockInfo.studentCount} student${
          lockInfo.studentCount === 1 ? '' : 's'
        } ${
          lockInfo.studentCount === 1 ? 'is' : 'are'
        } currently assigned to "${
          lockInfo.combinationName
        }". Unassign them before changing this class allocation.`,
      );

      return;
    }

    setDifferentClasses(previous =>
      previous.filter(item => Number(item.id) !== numericClassId),
    );

    setSharedSearch('');

    setDifferentSearch('');

    setSharedSearchResults([]);

    setDifferentSearchResults([]);

    setSelectedSharedClass(null);

    setSelectedDifferentClass(null);
  }

  /*
   * Save subject allocation.
   */
  async function handleSave() {
    if (saving || !hasChanges) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        different_combination_class_ids: getSortedIds(differentClasses),

        shared_class_ids: getSortedIds(sharedClasses),
      };

      console.log('Subject allocation payload:', payload);

      const response = await api('/api/settings/v1/subject-allocation', {
        method: 'PUT',

        body: JSON.stringify(payload),
      });

      if (!response?.ok) {
        throw new Error(
          'The server did not confirm the subject allocation update.',
        );
      }

      /*
       * Reload backend-authoritative state.
       */
      await loadSubjectAllocation();

      setSharedSearch('');

      setDifferentSearch('');

      setSharedSearchResults([]);

      setDifferentSearchResults([]);

      setSelectedSharedClass(null);

      setSelectedDifferentClass(null);

      Alert.alert(
        'Subject Allocation Updated',
        'Student subject allocation by class has been saved successfully.',
      );
    } catch (error) {
      console.log('Subject allocation save error:', error);

      const message =
        error?.payload?.message ||
        error?.message ||
        'Student subject allocation could not be saved.';

      Alert.alert('Could not save subject allocation', message);
    } finally {
      setSaving(false);
    }
  }

  /*
   * Loading.
   */
  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />

          <Text style={styles.stateText}>Loading subject allocation...</Text>
        </View>
      </View>
    );
  }

  /*
   * Load error.
   */
  if (loadError) {
    return (
      <View style={styles.section}>
        <View style={styles.stateContainer}>
          <Text style={styles.errorTitle}>
            Could not load subject allocation
          </Text>

          <Text style={styles.errorDescription}>{loadError}</Text>

          <Pressable
            onPress={loadSubjectAllocation}
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
      <Text style={styles.sectionTitle}>Student Subjects by Class</Text>

      <Text style={styles.description}>
        Choose whether every student in a class takes the same subjects or can
        be allotted a named subject combination.
      </Text>

      <View style={styles.columnsContainer}>
        {/* Shared Subject List */}

        <AllocationColumn
          title="All students share same subject list"
          searchText={sharedSearch}
          setSearchText={setSharedSearch}
          selectedClass={selectedSharedClass}
          setSelectedClass={setSelectedSharedClass}
          searchResults={sharedSearchResults}
          searching={searchingShared}
          assignedIds={assignedIds}
          lockedClassInfo={lockedClassInfo}
          classes={sharedClasses}
          onAdd={addToShared}
          onRemove={removeSharedClass}
          disabled={saving}
        />

        {/* Different Subject Combinations */}

        <AllocationColumn
          title="Students are allotted different subject combinations"
          searchText={differentSearch}
          setSearchText={setDifferentSearch}
          selectedClass={selectedDifferentClass}
          setSelectedClass={setSelectedDifferentClass}
          searchResults={differentSearchResults}
          searching={searchingDifferent}
          assignedIds={assignedIds}
          lockedClassInfo={lockedClassInfo}
          classes={differentClasses}
          onAdd={addToDifferent}
          onRemove={removeDifferentClass}
          disabled={saving}
        />
      </View>

      {/* Save */}

      <Pressable
        onPress={handleSave}
        disabled={saving || !hasChanges}
        style={({ pressed }) => [
          styles.saveButton,

          (saving || !hasChanges) && styles.buttonDisabled,

          pressed && !saving && hasChanges && styles.buttonPressed,
        ]}
      >
        {saving ? (
          <ActivityIndicator size="small" color={COLORS.TEXT} />
        ) : (
          <Text style={styles.saveButtonText}>Save Subject Allocation</Text>
        )}
      </Pressable>
    </View>
  );
}
