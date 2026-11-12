import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { COLORS, styles } from './SubjectCombinationsSettings.styles';

const DESKTOP_PAGE_SIZE = 8;
const MOBILE_PAGE_SIZE = 5;

function normalizeIdArray(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return [...new Set(items.map(item => Number(item)).filter(Number.isFinite))];
}

function normalizeStudent(item) {
  const id = Number(item?.id);

  if (!Number.isFinite(id)) {
    return null;
  }

  return {
    id,

    name: String(item?.name || `Student ${id}`),

    className: String(item?.class || ''),

    rollNo:
      item?.roll_no === null || item?.roll_no === undefined
        ? ''
        : String(item.roll_no),
  };
}

function getErrorMessage(error, fallback) {
  return (
    error?.payload?.message ||
    error?.payload?.error ||
    error?.message ||
    fallback
  );
}

function includesText(value, query) {
  return String(value || '')
    .toLowerCase()
    .includes(
      String(query || '')
        .trim()
        .toLowerCase(),
    );
}

/*
 * Search selector.
 *
 * Search results intentionally render
 * in normal layout flow.
 *
 * This avoids zIndex / clipping issues
 * inside React Native modals and ScrollViews.
 */
function SelectionSearch({ placeholder, items, selectedIds, onAdd, disabled }) {
  const [search, setSearch] = useState('');

  const [selectedItem, setSelectedItem] = useState(null);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    /*
     * Once one item is selected,
     * hide the result list and let
     * the user press +.
     */
    if (!query || selectedItem) {
      return [];
    }

    const selectedSet = new Set(selectedIds.map(Number));

    return items
      .filter(item => {
        if (selectedSet.has(Number(item.id))) {
          return false;
        }

        return includesText(item.label, query);
      })
      .slice(0, 8);
  }, [search, items, selectedIds, selectedItem]);

  function handleAdd() {
    if (!selectedItem) {
      return;
    }

    onAdd(selectedItem);

    setSearch('');

    setSelectedItem(null);
  }

  return (
    <View style={styles.selectionSearchContainer}>
      <View style={styles.selectionSearchRow}>
        <TextInput
          value={search}
          onChangeText={value => {
            setSearch(value);

            setSelectedItem(null);
          }}
          editable={!disabled}
          placeholder={placeholder}
          placeholderTextColor={COLORS.MUTED}
          autoCorrect={false}
          style={[styles.textInput, styles.selectionSearchInput]}
        />

        <Pressable
          onPress={handleAdd}
          disabled={disabled || !selectedItem}
          style={({ pressed }) => [
            styles.addSmallButton,

            (disabled || !selectedItem) && styles.buttonDisabled,

            pressed && !disabled && selectedItem && styles.buttonPressed,
          ]}
        >
          <Text style={styles.addSmallButtonText}>+</Text>
        </Pressable>
      </View>

      {selectedItem ? (
        <View style={styles.selectedSearchHint}>
          <Text style={styles.selectedSearchHintText}>
            Selected: {selectedItem.label}
          </Text>

          <Text style={styles.selectedSearchHintAction}>Tap + to add</Text>
        </View>
      ) : null}

      {visibleItems.length > 0 ? (
        <View style={styles.searchResultsBox}>
          {visibleItems.map(item => (
            <Pressable
              key={item.id}
              onPress={() => {
                setSelectedItem(item);

                setSearch(item.label);
              }}
              style={({ pressed }) => [
                styles.searchResultItem,

                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.searchResultText} numberOfLines={2}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function SelectedChips({ items, onRemove, disabled }) {
  if (!items.length) {
    return null;
  }

  return (
    <View style={styles.selectedChips}>
      {items.map(item => (
        <View key={item.id} style={styles.selectedChip}>
          <Text style={styles.selectedChipText} numberOfLines={2}>
            {item.label}
          </Text>

          <Pressable
            disabled={disabled}
            onPress={() => onRemove(item.id)}
            hitSlop={6}
            style={styles.selectedChipRemoveButton}
          >
            <Text style={styles.selectedChipRemove}>×</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

/*
 * Add / Edit Combination Modal
 */
function CombinationModal({
  visible,
  mode,
  combination,

  classes,
  subjects,

  saving,

  onClose,
  onSave,
}) {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  const [name, setName] = useState('');

  const [selectedClassIds, setSelectedClassIds] = useState([]);

  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (mode === 'edit' && combination) {
      setName(String(combination?.name || ''));

      setSelectedClassIds(normalizeIdArray(combination?.class_ids));

      setSelectedSubjectIds(normalizeIdArray(combination?.subject_ids));

      return;
    }

    setName('');

    setSelectedClassIds([]);

    setSelectedSubjectIds([]);
  }, [visible, mode, combination]);

  const selectedClasses = useMemo(() => {
    const selectedSet = new Set(selectedClassIds.map(Number));

    return classes.filter(item => selectedSet.has(Number(item.id)));
  }, [classes, selectedClassIds]);

  const selectedSubjects = useMemo(() => {
    const selectedSet = new Set(selectedSubjectIds.map(Number));

    return subjects.filter(item => selectedSet.has(Number(item.id)));
  }, [subjects, selectedSubjectIds]);

  function addClass(item) {
    const id = Number(item?.id);

    if (!Number.isFinite(id)) {
      return;
    }

    setSelectedClassIds(previous => {
      if (previous.includes(id)) {
        return previous;
      }

      return [...previous, id];
    });
  }

  function addSubject(item) {
    const id = Number(item?.id);

    if (!Number.isFinite(id)) {
      return;
    }

    setSelectedSubjectIds(previous => {
      if (previous.includes(id)) {
        return previous;
      }

      return [...previous, id];
    });
  }

  function removeClass(classId) {
    setSelectedClassIds(previous =>
      previous.filter(id => Number(id) !== Number(classId)),
    );
  }

  function removeSubject(subjectId) {
    setSelectedSubjectIds(previous =>
      previous.filter(id => Number(id) !== Number(subjectId)),
    );
  }

  function submit() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('Subject Combination', 'Please enter a combination name.');

      return;
    }

    if (selectedClassIds.length === 0) {
      Alert.alert('Subject Combination', 'Please select at least one class.');

      return;
    }

    if (selectedSubjectIds.length === 0) {
      Alert.alert('Subject Combination', 'Please select at least one subject.');

      return;
    }

    onSave({
      name: trimmedName,

      class_ids: selectedClassIds,

      subject_ids: selectedSubjectIds,
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
          onClose();
        }
      }}
    >
      <SafeAreaView style={styles.modalSafeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalCard, isMobile && styles.modalCardMobile]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>
                    {mode === 'edit'
                      ? 'Edit Subject Combination'
                      : 'Add Subject Combination'}
                  </Text>

                  <Text style={styles.modalSubtitle}>
                    Choose the classes and subjects for this combination.
                  </Text>
                </View>

                <Pressable
                  disabled={saving}
                  onPress={onClose}
                  style={({ pressed }) => [
                    styles.closeButton,

                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </Pressable>
              </View>

              <ScrollView
                style={styles.modalBodyScroll}
                contentContainerStyle={styles.modalBodyContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator
                nestedScrollEnabled
              >
                <View style={styles.formSection}>
                  <Text style={styles.fieldLabel}>Combination Name</Text>

                  <TextInput
                    value={name}
                    onChangeText={setName}
                    editable={!saving}
                    placeholder="e.g. Science with Computer Science"
                    placeholderTextColor={COLORS.MUTED}
                    style={styles.textInput}
                  />
                </View>

                <View style={styles.formSection}>
                  <View style={styles.formSectionHeader}>
                    <Text style={styles.fieldLabel}>Classes</Text>

                    <Text style={styles.selectionCount}>
                      {selectedClassIds.length} selected
                    </Text>
                  </View>

                  <SelectionSearch
                    placeholder="Type a class name..."
                    items={classes}
                    selectedIds={selectedClassIds}
                    onAdd={addClass}
                    disabled={saving}
                  />

                  <SelectedChips
                    items={selectedClasses}
                    onRemove={removeClass}
                    disabled={saving}
                  />
                </View>

                <View style={styles.formSection}>
                  <View style={styles.formSectionHeader}>
                    <Text style={styles.fieldLabel}>Subjects</Text>

                    <Text style={styles.selectionCount}>
                      {selectedSubjectIds.length} selected
                    </Text>
                  </View>

                  <SelectionSearch
                    placeholder="Type a subject name..."
                    items={subjects}
                    selectedIds={selectedSubjectIds}
                    onAdd={addSubject}
                    disabled={saving}
                  />

                  <SelectedChips
                    items={selectedSubjects}
                    onRemove={removeSubject}
                    disabled={saving}
                  />
                </View>
              </ScrollView>

              <View
                style={[
                  styles.modalFooter,

                  isMobile && styles.modalFooterMobile,
                ]}
              >
                <Pressable
                  disabled={saving}
                  onPress={onClose}
                  style={({ pressed }) => [
                    styles.secondaryButton,

                    isMobile && styles.mobileFooterButton,

                    pressed && !saving && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={saving}
                  onPress={submit}
                  style={({ pressed }) => [
                    styles.primaryButton,

                    isMobile && styles.mobileFooterButton,

                    saving && styles.buttonDisabled,

                    pressed && !saving && styles.buttonPressed,
                  ]}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={COLORS.TEXT} />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      {mode === 'edit' ? 'Save Changes' : 'Add Combination'}
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

/*
 * Student list
 */
function StudentPanel({
  title,

  students,

  selectedIds,
  setSelectedIds,

  search,
  setSearch,

  page,
  setPage,

  pageSize,

  mobile,
}) {
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter(
      student =>
        includesText(student.name, query) ||
        includesText(student.className, query) ||
        includesText(student.rollNo, query),
    );
  }, [students, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const safePage = Math.min(page, totalPages);

  const pageItems = filtered.slice(
    (safePage - 1) * pageSize,

    safePage * pageSize,
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages, setPage]);

  function toggleStudent(studentId) {
    const id = Number(studentId);

    setSelectedIds(previous => {
      if (previous.includes(id)) {
        return previous.filter(currentId => currentId !== id);
      }

      return [...previous, id];
    });
  }

  return (
    <View style={[styles.studentPanel, mobile && styles.studentPanelMobile]}>
      <View style={styles.studentPanelHeader}>
        <Text style={styles.studentPanelTitle}>{title}</Text>

        <View style={styles.studentCountBadge}>
          <Text style={styles.studentCountBadgeText}>{students.length}</Text>
        </View>
      </View>

      <TextInput
        value={search}
        onChangeText={value => {
          setSearch(value);

          setPage(1);
        }}
        placeholder="Search name, class or roll number..."
        placeholderTextColor={COLORS.MUTED}
        style={styles.studentSearch}
      />

      <View style={styles.studentListContent}>
        {pageItems.length === 0 ? (
          <View style={styles.emptyStudentBox}>
            <Text style={styles.emptyStudentTitle}>No students available</Text>

            <Text style={styles.emptyStudentText}>
              Students matching this section will appear here.
            </Text>
          </View>
        ) : (
          pageItems.map(student => {
            const checked = selectedIds.includes(Number(student.id));

            return (
              <Pressable
                key={student.id}
                onPress={() => toggleStudent(student.id)}
                style={({ pressed }) => [
                  styles.studentCard,

                  checked && styles.studentCardSelected,

                  pressed && styles.buttonPressed,
                ]}
              >
                <View
                  style={[styles.checkbox, checked && styles.checkboxChecked]}
                >
                  {checked ? <Text style={styles.checkboxTick}>✓</Text> : null}
                </View>

                <View style={styles.studentInfo}>
                  <Text style={styles.studentName} numberOfLines={2}>
                    {student.name}
                  </Text>

                  <Text style={styles.studentMeta} numberOfLines={2}>
                    {student.className}

                    {student.rollNo ? ` · Roll ${student.rollNo}` : ''}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </View>

      <View style={styles.paginationRow}>
        <Pressable
          disabled={safePage <= 1}
          onPress={() => setPage(previous => Math.max(1, previous - 1))}
          style={({ pressed }) => [
            styles.pageButton,

            safePage <= 1 && styles.buttonDisabled,

            pressed && safePage > 1 && styles.buttonPressed,
          ]}
        >
          <Text style={styles.pageButtonText}>‹</Text>
        </Pressable>

        <Text style={styles.pageMeta}>
          {filtered.length} students · Page {safePage} of {totalPages}
        </Text>

        <Pressable
          disabled={safePage >= totalPages}
          onPress={() =>
            setPage(previous => Math.min(totalPages, previous + 1))
          }
          style={({ pressed }) => [
            styles.pageButton,

            safePage >= totalPages && styles.buttonDisabled,

            pressed && safePage < totalPages && styles.buttonPressed,
          ]}
        >
          <Text style={styles.pageButtonText}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}

/*
 * Assign Students Modal
 */
function AssignStudentsModal({
  visible,
  combination,

  onClose,
  onSaved,
}) {
  const { width } = useWindowDimensions();

  const isMobile = width < 760;

  const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [allStudents, setAllStudents] = useState([]);

  const [assignedIds, setAssignedIds] = useState([]);

  const [selectedAvailableIds, setSelectedAvailableIds] = useState([]);

  const [selectedAssignedIds, setSelectedAssignedIds] = useState([]);

  const [availableSearch, setAvailableSearch] = useState('');

  const [assignedSearch, setAssignedSearch] = useState('');

  const [availablePage, setAvailablePage] = useState(1);

  const [assignedPage, setAssignedPage] = useState(1);

  const loadStudents = useCallback(async () => {
    if (!visible || !combination?.id) {
      return;
    }

    try {
      setLoading(true);

      const response = await api(
        `/api/settings/v1/subject-combinations/${combination.id}/students`,
        {
          method: 'GET',
        },
      );

      const students = Array.isArray(response?.students)
        ? response.students.map(normalizeStudent).filter(Boolean)
        : [];

      setAllStudents(students);

      setAssignedIds(normalizeIdArray(response?.assigned_student_ids));

      setSelectedAvailableIds([]);

      setSelectedAssignedIds([]);

      setAvailableSearch('');

      setAssignedSearch('');

      setAvailablePage(1);

      setAssignedPage(1);
    } catch (error) {
      console.log('Combination students load error:', error);

      Alert.alert(
        'Assign Students',
        getErrorMessage(error, 'Could not load students.'),
      );

      onClose();
    } finally {
      setLoading(false);
    }
  }, [visible, combination?.id, onClose]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const assignedSet = useMemo(
    () => new Set(assignedIds.map(Number)),
    [assignedIds],
  );

  const availableStudents = useMemo(
    () => allStudents.filter(student => !assignedSet.has(Number(student.id))),
    [allStudents, assignedSet],
  );

  const assignedStudents = useMemo(
    () => allStudents.filter(student => assignedSet.has(Number(student.id))),
    [allStudents, assignedSet],
  );

  function moveToAssigned() {
    if (selectedAvailableIds.length === 0) {
      return;
    }

    setAssignedIds(previous =>
      normalizeIdArray([...previous, ...selectedAvailableIds]),
    );

    setSelectedAvailableIds([]);

    setAvailablePage(1);

    setAssignedPage(1);
  }

  function moveToAvailable() {
    if (selectedAssignedIds.length === 0) {
      return;
    }

    const removing = new Set(selectedAssignedIds.map(Number));

    setAssignedIds(previous =>
      previous.filter(id => !removing.has(Number(id))),
    );

    setSelectedAssignedIds([]);

    setAvailablePage(1);

    setAssignedPage(1);
  }

  async function saveAssignments() {
    if (!combination?.id || saving) {
      return;
    }

    try {
      setSaving(true);

      const response = await api(
        `/api/settings/v1/subject-combinations/${combination.id}/students`,
        {
          method: 'PUT',

          body: JSON.stringify({
            student_ids: normalizeIdArray(assignedIds),
          }),
        },
      );

      if (!response?.ok) {
        throw new Error('The server did not confirm the student assignments.');
      }

      onClose();

      await onSaved();

      Alert.alert(
        'Assignments Updated',
        'Student assignments have been saved successfully.',
      );
    } catch (error) {
      console.log('Save combination students error:', error);

      Alert.alert(
        'Could not save assignments',
        getErrorMessage(error, 'Student assignments could not be saved.'),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        if (!saving) {
          onClose();
        }
      }}
    >
      <SafeAreaView style={styles.modalSafeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.assignModalCard,

                isMobile && styles.assignModalCardMobile,
              ]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>Assign Students</Text>

                  <Text style={styles.assignCombinationName}>
                    {combination?.name || ''}
                  </Text>

                  <Text style={styles.assignSubtitle}>
                    {combination?.classLabels?.join(' · ') || ''}
                  </Text>
                </View>

                <Pressable
                  disabled={saving}
                  onPress={onClose}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </Pressable>
              </View>

              {loading ? (
                <View style={styles.assignLoading}>
                  <ActivityIndicator size="large" color={COLORS.BLUE} />

                  <Text style={styles.stateText}>Loading students...</Text>
                </View>
              ) : (
                <>
                  <ScrollView
                    style={styles.assignBodyScroll}
                    contentContainerStyle={styles.assignBodyContent}
                    showsVerticalScrollIndicator
                    keyboardShouldPersistTaps="handled"
                  >
                    <View
                      style={[
                        styles.assignPanelsRow,

                        isMobile && styles.assignPanelsColumn,
                      ]}
                    >
                      <StudentPanel
                        title="Available Students"
                        students={availableStudents}
                        selectedIds={selectedAvailableIds}
                        setSelectedIds={setSelectedAvailableIds}
                        search={availableSearch}
                        setSearch={setAvailableSearch}
                        page={availablePage}
                        setPage={setAvailablePage}
                        pageSize={pageSize}
                        mobile={isMobile}
                      />

                      <View
                        style={[
                          styles.moveButtons,

                          isMobile && styles.moveButtonsMobile,
                        ]}
                      >
                        <Pressable
                          disabled={selectedAvailableIds.length === 0}
                          onPress={moveToAssigned}
                          style={({ pressed }) => [
                            styles.moveButton,

                            selectedAvailableIds.length === 0 &&
                              styles.buttonDisabled,

                            pressed &&
                              selectedAvailableIds.length > 0 &&
                              styles.buttonPressed,
                          ]}
                        >
                          <Text style={styles.moveButtonText}>
                            {isMobile ? '↓' : '→'}
                          </Text>
                        </Pressable>

                        <Pressable
                          disabled={selectedAssignedIds.length === 0}
                          onPress={moveToAvailable}
                          style={({ pressed }) => [
                            styles.moveButton,

                            selectedAssignedIds.length === 0 &&
                              styles.buttonDisabled,

                            pressed &&
                              selectedAssignedIds.length > 0 &&
                              styles.buttonPressed,
                          ]}
                        >
                          <Text style={styles.moveButtonText}>
                            {isMobile ? '↑' : '←'}
                          </Text>
                        </Pressable>
                      </View>

                      <StudentPanel
                        title="Assigned Students"
                        students={assignedStudents}
                        selectedIds={selectedAssignedIds}
                        setSelectedIds={setSelectedAssignedIds}
                        search={assignedSearch}
                        setSearch={setAssignedSearch}
                        page={assignedPage}
                        setPage={setAssignedPage}
                        pageSize={pageSize}
                        mobile={isMobile}
                      />
                    </View>
                  </ScrollView>

                  <View
                    style={[
                      styles.modalFooter,

                      isMobile && styles.modalFooterMobile,
                    ]}
                  >
                    <Pressable
                      disabled={saving}
                      onPress={onClose}
                      style={[
                        styles.secondaryButton,

                        isMobile && styles.mobileFooterButton,
                      ]}
                    >
                      <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </Pressable>

                    <Pressable
                      disabled={saving}
                      onPress={saveAssignments}
                      style={[
                        styles.primaryButton,

                        isMobile && styles.mobileFooterButton,

                        saving && styles.buttonDisabled,
                      ]}
                    >
                      {saving ? (
                        <ActivityIndicator size="small" color={COLORS.TEXT} />
                      ) : (
                        <Text style={styles.primaryButtonText}>
                          Save Assignments
                        </Text>
                      )}
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

export default function SubjectCombinationsSettings() {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [classes, setClasses] = useState([]);

  const [subjects, setSubjects] = useState([]);

  const [combinations, setCombinations] = useState([]);

  const [combinationModalVisible, setCombinationModalVisible] = useState(false);

  const [combinationMode, setCombinationMode] = useState('add');

  const [editingCombination, setEditingCombination] = useState(null);

  const [savingCombination, setSavingCombination] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [assignModalVisible, setAssignModalVisible] = useState(false);

  const [assigningCombination, setAssigningCombination] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const response = await api('/api/settings/v1/subject-allocation', {
        method: 'GET',
      });

      const apiClasses = Array.isArray(response?.classes)
        ? response.classes
        : [];

      const differentClasses = apiClasses
        .filter(item => item?.allocation === 'different')
        .map(item => ({
          id: Number(item.id),

          label: String(item?.label || `Class ${item.id}`),
        }))
        .filter(item => Number.isFinite(item.id));

      const apiSubjects = Array.isArray(response?.subjects)
        ? response.subjects
        : [];

      const normalizedSubjects = apiSubjects
        .map(item => ({
          id: Number(item.id),

          label: String(item?.label || item?.title || `Subject ${item.id}`),
        }))
        .filter(item => Number.isFinite(item.id));

      const apiCombinations = Array.isArray(response?.combinations)
        ? response.combinations
        : [];

      setClasses(differentClasses);

      setSubjects(normalizedSubjects);

      setCombinations(apiCombinations);
    } catch (error) {
      console.log('Subject combinations load error:', error);

      setLoadError(
        getErrorMessage(error, 'Could not load subject combinations.'),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const classMap = useMemo(() => {
    const map = new Map();

    classes.forEach(item => {
      map.set(Number(item.id), item.label);
    });

    return map;
  }, [classes]);

  const subjectMap = useMemo(() => {
    const map = new Map();

    subjects.forEach(item => {
      map.set(Number(item.id), item.label);
    });

    return map;
  }, [subjects]);

  function getCombinationClassLabels(combination) {
    return normalizeIdArray(combination?.class_ids).map(
      id => classMap.get(id) || `Class ${id}`,
    );
  }

  function getCombinationSubjectLabels(combination) {
    return normalizeIdArray(combination?.subject_ids).map(
      id => subjectMap.get(id) || `Subject ${id}`,
    );
  }

  function openAdd() {
    setCombinationMode('add');

    setEditingCombination(null);

    setCombinationModalVisible(true);
  }

  function openEdit(combination) {
    setCombinationMode('edit');

    setEditingCombination(combination);

    setCombinationModalVisible(true);
  }

  async function saveCombination(payload) {
    if (savingCombination) {
      return;
    }

    try {
      setSavingCombination(true);

      let response;

      if (combinationMode === 'edit' && editingCombination?.id) {
        response = await api(
          `/api/settings/v1/subject-combinations/${editingCombination.id}`,
          {
            method: 'PUT',

            body: JSON.stringify(payload),
          },
        );
      } else {
        response = await api('/api/settings/v1/subject-combinations', {
          method: 'POST',

          body: JSON.stringify(payload),
        });
      }

      if (!response?.ok || !response?.combination) {
        throw new Error('The server did not confirm the subject combination.');
      }

      setCombinationModalVisible(false);

      setEditingCombination(null);

      await loadData();

      Alert.alert(
        combinationMode === 'edit'
          ? 'Combination Updated'
          : 'Combination Added',

        combinationMode === 'edit'
          ? 'The subject combination has been updated successfully.'
          : 'The subject combination has been added successfully.',
      );
    } catch (error) {
      console.log('Save subject combination error:', error);

      Alert.alert(
        'Could not save combination',
        getErrorMessage(error, 'The subject combination could not be saved.'),
      );
    } finally {
      setSavingCombination(false);
    }
  }

  function confirmDelete(combination) {
    Alert.alert(
      'Delete Subject Combination',
      `Are you sure you want to delete "${
        combination?.name || 'this combination'
      }"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: () => deleteCombination(combination),
        },
      ],
    );
  }

  async function deleteCombination(combination) {
    if (!combination?.id || deletingId) {
      return;
    }

    try {
      setDeletingId(combination.id);

      const response = await api(
        `/api/settings/v1/subject-combinations/${combination.id}`,
        {
          method: 'DELETE',
        },
      );

      if (!response?.ok) {
        throw new Error('The server did not confirm deletion.');
      }

      await loadData();

      Alert.alert(
        'Combination Deleted',
        'The subject combination has been deleted successfully.',
      );
    } catch (error) {
      console.log('Delete combination error:', error);

      Alert.alert(
        'Could not delete combination',
        getErrorMessage(error, 'The subject combination could not be deleted.'),
      );
    } finally {
      setDeletingId(null);
    }
  }

  function openAssignStudents(combination) {
    setAssigningCombination({
      ...combination,

      classLabels: getCombinationClassLabels(combination),
    });

    setAssignModalVisible(true);
  }

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />

          <Text style={styles.stateText}>Loading subject combinations...</Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subject Combinations</Text>

        <Text style={styles.errorText}>{loadError}</Text>

        <Pressable onPress={loadData} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <View style={styles.section}>
        <View
          style={[styles.sectionHeader, isMobile && styles.sectionHeaderMobile]}
        >
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>Subject Combinations</Text>

            <Text style={styles.description}>
              Create the subject lists that can be allotted to students in the
              classes selected above.
            </Text>
          </View>

          <Pressable
            onPress={openAdd}
            style={({ pressed }) => [
              styles.primaryButton,

              isMobile && styles.addCombinationButtonMobile,

              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>+ Add Combination</Text>
          </Pressable>
        </View>

        {combinations.length === 0 ? (
          <View style={styles.emptyCombination}>
            <Text style={styles.emptyCombinationTitle}>
              No combinations yet
            </Text>

            <Text style={styles.emptyCombinationText}>
              Add a subject combination to start assigning students.
            </Text>
          </View>
        ) : (
          <View style={styles.combinationList}>
            {combinations.map(combination => {
              const classIds = normalizeIdArray(combination?.class_ids);

              const classLabels = getCombinationClassLabels(combination);

              const subjectLabels = getCombinationSubjectLabels(combination);

              return (
                <View key={combination.id} style={styles.combinationCard}>
                  <View
                    style={[
                      styles.combinationTopRow,

                      isMobile && styles.combinationTopRowMobile,
                    ]}
                  >
                    <View style={styles.combinationTitleArea}>
                      <Text style={styles.combinationName}>
                        {combination.name}
                      </Text>

                      <Text style={styles.combinationStudentTotal}>
                        {Number(combination?.student_count || 0)} students
                        assigned
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.combinationActions,

                        isMobile && styles.combinationActionsMobile,
                      ]}
                    >
                      <Pressable
                        onPress={() => openAssignStudents(combination)}
                        style={[
                          styles.outlineButton,

                          isMobile && styles.actionButtonMobile,
                        ]}
                      >
                        <Text style={styles.outlineButtonText}>
                          Assign Students
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => openEdit(combination)}
                        style={[
                          styles.outlineButton,

                          isMobile && styles.actionButtonMobile,
                        ]}
                      >
                        <Text style={styles.outlineButtonText}>Edit</Text>
                      </Pressable>

                      <Pressable
                        disabled={deletingId === combination.id}
                        onPress={() => confirmDelete(combination)}
                        style={[
                          styles.deleteButton,

                          isMobile && styles.actionButtonMobile,

                          deletingId === combination.id &&
                            styles.buttonDisabled,
                        ]}
                      >
                        {deletingId === combination.id ? (
                          <ActivityIndicator size="small" color={COLORS.TEXT} />
                        ) : (
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        )}
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.combinationDivider} />

                  <Text style={styles.groupLabel}>CLASSES</Text>

                  <View style={styles.displayChips}>
                    {classLabels.map((label, index) => {
                      const classId = classIds[index];

                      const count = Number(
                        combination?.class_student_counts?.[String(classId)] ||
                          0,
                      );

                      return (
                        <View
                          key={`${classId}-${index}`}
                          style={styles.displayChip}
                        >
                          <Text style={styles.displayChipText}>{label}</Text>

                          <View style={styles.chipCountBadge}>
                            <Text style={styles.chipCountText}>{count}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  <Text style={[styles.groupLabel, styles.subjectGroupLabel]}>
                    SUBJECTS
                  </Text>

                  <View style={styles.displayChips}>
                    {subjectLabels.map((label, index) => (
                      <View
                        key={`${label}-${index}`}
                        style={styles.displayChip}
                      >
                        <Text style={styles.displayChipText}>{label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <CombinationModal
        visible={combinationModalVisible}
        mode={combinationMode}
        combination={editingCombination}
        classes={classes}
        subjects={subjects}
        saving={savingCombination}
        onClose={() => {
          if (savingCombination) {
            return;
          }

          setCombinationModalVisible(false);

          setEditingCombination(null);
        }}
        onSave={saveCombination}
      />

      <AssignStudentsModal
        visible={assignModalVisible}
        combination={assigningCombination}
        onClose={() => {
          setAssignModalVisible(false);

          setAssigningCombination(null);
        }}
        onSaved={loadData}
      />
    </>
  );
}
