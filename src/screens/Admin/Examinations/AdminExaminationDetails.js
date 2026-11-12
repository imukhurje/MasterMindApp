// src/screens/Admin/Examinations/AdminExaminationDetails.js

import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';
import styles from './AdminExaminationDetails.styles';

const EXAMINATION_STATUS_OPTIONS = [
  {
    label: 'Draft',
    value: 'draft',
  },
  {
    label: 'Scheduled',
    value: 'published',
  },
  {
    label: 'Result Published',
    value: 'result_published',
  },
];

function normalizeStatus(value) {
  return String(value || 'unknown')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function formatDateTime(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getStatusStyle(status) {
  switch (normalizeStatus(status)) {
    case 'published':
      return styles.statusPublished;

    case 'result_published':
      return styles.statusResultPublished;

    default:
      return styles.statusDraft;
  }
}

function getPaperName(item) {
  return (
    item?.name ||
    item?.title ||
    item?.paper_name ||
    item?.exam_name ||
    'Untitled paper'
  );
}

function getClassName(item) {
  return (
    item?.class_name ||
    item?.class_label ||
    item?.class_group?.name ||
    item?.class_group?.label ||
    '-'
  );
}

function getSubjectName(item) {
  return (
    item?.course_title ||
    item?.subject_name ||
    item?.subject?.name ||
    item?.course?.title ||
    '-'
  );
}

function getScheduleRange(item) {
  if (item?.is_scheduled === false) {
    return {
      isScheduled: false,
      start: null,
      end: null,
    };
  }

  const startValue =
    item?.starts_at ||
    item?.start_at ||
    item?.scheduled_at ||
    item?.schedule_at ||
    item?.exam_date;

  const endValue = item?.ends_at || item?.end_at;

  if (!startValue) {
    return {
      isScheduled: false,
      start: null,
      end: null,
    };
  }

  return {
    isScheduled: true,
    start: formatDateTime(startValue),
    end: endValue ? formatDateTime(endValue) : null,
  };
}

function isPaperEvaluated(item) {
  return (
    String(item?.status || '')
      .trim()
      .toLowerCase() === 'evaluated'
  );
}

export default function AdminExaminationDetails({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const examinationId = route?.params?.examinationId;
  const initialName = route?.params?.examinationName || '';

  const [examination, setExamination] = useState(null);
  const [papersExpanded, setPapersExpanded] = useState(true);

  const actionsButtonRef = useRef(null);

  const [actionsVisible, setActionsVisible] = useState(false);

  const [actionsMenuTop, setActionsMenuTop] = useState(0);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('draft');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [deactivating, setDeactivating] = useState(false);

  const loadExamination = useCallback(
    async ({ refresh = false } = {}) => {
      if (!examinationId) {
        Alert.alert('Examination', 'Examination ID is missing.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);

        return;
      }

      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await api(`/api/examinations/v1/${examinationId}`);

        const responseData = response?.data || null;

        if (!responseData) {
          throw new Error('Examination details were not found.');
        }

        setExamination(responseData);

        setSelectedStatus(normalizeStatus(responseData?.status || 'draft'));

        navigation.setOptions({
          title: responseData?.name || initialName || 'Examination',
        });
      } catch (error) {
        console.log('Examination details API error:', error);

        Alert.alert(
          'Examination',
          error?.message || 'Could not load examination details.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [examinationId, initialName, navigation],
  );

  useEffect(() => {
    loadExamination();
  }, [loadExamination]);

  function refreshDetails() {
    setActionsVisible(false);
    loadExamination({ refresh: true });
  }

  async function updateExaminationStatus() {
    if (!examination?.id) {
      Alert.alert('Examination', 'Examination ID is missing.');
      return;
    }

    if (!examination?.name) {
      Alert.alert('Examination', 'Examination name is missing.');
      return;
    }

    try {
      setUpdatingStatus(true);

      const payload = {
        name: examination.name,
        status: selectedStatus,
      };

      console.log('Update examination status payload:', payload);

      const response = await api(`/api/examinations/v1/${examination.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response?.ok !== true || !response?.data) {
        throw new Error('Could not update the examination status.');
      }

      setExamination(currentExamination => ({
        ...currentExamination,
        ...response.data,
        exams: Array.isArray(currentExamination?.exams)
          ? currentExamination.exams
          : [],
      }));

      setSelectedStatus(
        normalizeStatus(response.data?.status || selectedStatus),
      );

      setStatusModalVisible(false);

      Alert.alert(
        'Status updated',
        'The examination status was updated successfully.',
      );
    } catch (error) {
      console.log('Update examination status error:', error);

      Alert.alert(
        'Update failed',
        error?.message || 'Could not update the examination status.',
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  function openStatusModal() {
    setSelectedStatus(normalizeStatus(examination?.status || 'draft'));

    setStatusModalVisible(true);
  }

  function openActionsMenu() {
    actionsButtonRef.current?.measureInWindow((x, y, width, height) => {
      setActionsMenuTop(y + height + 6);
      setActionsVisible(true);
    });
  }

  function openSchedule() {
    setActionsVisible(false);

    if (!examination?.id) {
      Alert.alert('Schedule', 'Examination ID is missing.');
      return;
    }

    navigation.navigate('AdminExaminationSchedule', {
      examinationId: examination.id,

      examinationName: examination.name,
    });
  }

  function openManageExamPapers() {
    setActionsVisible(false);

    navigation.navigate('AdminManageExamPapers', {
      examinationId: examination?.id,
      examinationName: examination?.name,
    });
  }

  function openAdmitCards() {
    setActionsVisible(false);

    if (!examination?.id) {
      Alert.alert('Admit Cards', 'Examination ID is missing.');
      return;
    }

    navigation.navigate('AdminAdmitCards', {
      examinationId: examination.id,

      examinationName: examination.name,
    });
  }

  function confirmDeactivateExamination() {
    setActionsVisible(false);

    Alert.alert(
      'Deactivate examination',
      'Deactivate this examination? It will be hidden from the active examinations listing.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: deactivateExamination,
        },
      ],
    );
  }

  async function deactivateExamination() {
    if (!examination?.id || deactivating) {
      return;
    }

    try {
      setDeactivating(true);

      const response = await api(
        `/api/examinations/v1/${examination.id}/active`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            is_active: false,
          }),
        },
      );

      console.log('Deactivate examination response:', response);

      Alert.alert(
        'Examination deactivated',
        'The examination was deactivated successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.replace('AdminExaminations');
            },
          },
        ],
      );
    } catch (error) {
      console.log('Deactivate examination error:', error);

      Alert.alert(
        'Deactivate failed',
        error?.message || 'Could not deactivate the examination.',
      );
    } finally {
      setDeactivating(false);
    }
  }

  function openMarksheets() {
    setActionsVisible(false);

    if (!examination?.id) {
      Alert.alert('Marksheets', 'Examination ID is missing.');
      return;
    }

    navigation.navigate('AdminMarksheets', {
      examinationId: examination.id,

      examinationName: examination.name,
    });
  }

  function openPaperOverview(item) {
    if (!item?.id) {
      return;
    }

    navigation.navigate('AdminExamPaperOverview', {
      examinationId: examination?.id,

      paperId: item.id,

      paperName: getPaperName(item),

      className: getClassName(item),

      subjectName: getSubjectName(item),
    });
  }

  function renderPaper({ item, index }) {
    const evaluated = isPaperEvaluated(item);

    const schedule = getScheduleRange(item);

    return (
      <Pressable
        onPress={() => openPaperOverview(item)}
        accessibilityRole="button"
        accessibilityLabel={`Open ${getPaperName(item)}`}
        style={({ pressed }) => [
          styles.paperCard,
          pressed && styles.controlPressed,
        ]}
      >
        <View style={styles.paperTopRow}>
          <View style={styles.paperNumber}>
            <Text style={styles.paperNumberText}>{index + 1}</Text>
          </View>

          <View style={styles.paperContent}>
            <Text numberOfLines={2} style={styles.paperName}>
              {getPaperName(item)}
            </Text>
          </View>
        </View>

        <View style={styles.paperInfoRow}>
          <View style={styles.paperInfoItem}>
            <Text style={styles.metadataLabel}>Class</Text>

            <Text numberOfLines={1} style={styles.metadataValue}>
              {getClassName(item)}
            </Text>
          </View>

          <View style={styles.paperInfoItem}>
            <Text style={styles.metadataLabel}>Subject</Text>

            <Text numberOfLines={1} style={styles.metadataValue}>
              {getSubjectName(item)}
            </Text>
          </View>
        </View>

        <View style={styles.scheduleBlock}>
          <Text style={styles.metadataLabel}>Schedule</Text>

          {!schedule.isScheduled ? (
            <Text style={styles.scheduleEmpty}>--</Text>
          ) : (
            <View style={styles.scheduleContent}>
              <View style={styles.scheduleDateRow}>
                <View style={styles.scheduleDot} />

                <Text style={styles.scheduleDateText}>{schedule.start}</Text>
              </View>

              {schedule.end ? (
                <>
                  <View style={styles.scheduleConnector} />

                  <View style={styles.scheduleDateRow}>
                    <View style={[styles.scheduleDot, styles.scheduleDotEnd]} />

                    <Text style={styles.scheduleDateText}>{schedule.end}</Text>
                  </View>
                </>
              ) : null}
            </View>
          )}
        </View>

        <View style={styles.paperBottomRow}>
          <Text style={styles.metadataLabel}>Evaluated</Text>

          <View
            accessible
            accessibilityRole="text"
            accessibilityLabel={evaluated ? 'Evaluated' : 'Pending evaluation'}
            style={[
              styles.evaluationBadge,
              evaluated
                ? styles.evaluationBadgeSuccess
                : styles.evaluationBadgePending,
            ]}
          >
            <Text
              style={[
                styles.evaluationBadgeIcon,
                evaluated
                  ? styles.evaluationBadgeIconSuccess
                  : styles.evaluationBadgeIconPending,
              ]}
            >
              {evaluated ? '✓' : '◷'}
            </Text>

            <Text
              style={[
                styles.evaluationBadgeText,
                evaluated
                  ? styles.evaluationBadgeTextSuccess
                  : styles.evaluationBadgeTextPending,
              ]}
            >
              {evaluated ? 'Evaluated' : 'Pending'}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading examination details...</Text>
      </View>
    );
  }

  const papers = Array.isArray(examination?.exams) ? examination.exams : [];

  const status = normalizeStatus(examination?.status);

  const canSchedule = status === 'draft' || status === 'published';

  const canShowAdmitCards = status === 'published';

  const canShowMarksheets = status === 'result_published';

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      {/* Examination header */}
      <View style={styles.headerCard}>
        <View style={styles.headerMain}>
          <Text numberOfLines={2} style={styles.examinationName}>
            {examination?.name || initialName || 'Examination'}
          </Text>

          <Pressable
            onPress={openStatusModal}
            accessibilityRole="button"
            accessibilityLabel="Update examination status"
            style={({ pressed }) => [
              styles.statusBadge,
              getStatusStyle(status),
              styles.statusBadgePressable,
              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.statusText}>{status.replace(/_/g, ' ')}</Text>

            <Text style={styles.statusEditIcon}>▼</Text>
          </Pressable>
        </View>

        <Pressable
          ref={actionsButtonRef}
          onPress={openActionsMenu}
          accessibilityRole="button"
          accessibilityLabel="Open examination actions"
          style={({ pressed }) => [
            styles.actionsButton,
            actionsVisible && styles.actionsButtonActive,
            pressed && styles.controlPressed,
          ]}
        >
          <Text style={styles.actionsButtonText}>Actions ▼</Text>
        </Pressable>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Examination ID</Text>
          <Text style={styles.infoValue}>{examination?.id ?? '-'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Papers</Text>
          <Text style={styles.infoValue}>{papers.length}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Last updated</Text>
          <Text style={styles.infoValue}>
            {formatDateTime(examination?.updated_at)}
          </Text>
        </View>
      </View>

      {/* Exam papers section */}
      <View style={styles.papersSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContent}>
            <Text style={styles.sectionTitle}>
              Exam Papers in this Examination
            </Text>
          </View>

          {/* <View style={styles.sectionActions}>
            <Pressable
              onPress={() => setPapersExpanded(false)}
              disabled={!papersExpanded}
              style={({ pressed }) => [
                styles.collapseButton,
                !papersExpanded && styles.controlDisabled,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.collapseButtonText}>▲</Text>
            </Pressable>

            <Pressable
              onPress={() => setPapersExpanded(true)}
              disabled={papersExpanded}
              style={({ pressed }) => [
                styles.collapseButton,
                papersExpanded && styles.controlDisabled,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.collapseButtonText}>▼</Text>
            </Pressable>
          </View> */}
        </View>

        {papersExpanded ? (
          <>
            <View style={styles.tableHeader}>
              <Text style={styles.tableNumber}>#</Text>
              <Text style={styles.tablePaper}>Paper</Text>
              {/* <Text style={styles.tableStatus}>Status</Text> */}
            </View>

            <FlatList
              data={papers}
              keyExtractor={(item, index) => String(item?.id ?? index)}
              renderItem={renderPaper}
              style={styles.paperList}
              contentContainerStyle={
                papers.length === 0
                  ? styles.emptyListContent
                  : styles.paperListContent
              }
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshDetails}
                  tintColor="#FFFFFF"
                  colors={['#FFFFFF']}
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateTitle}>
                    No exam papers found
                  </Text>

                  <Text style={styles.emptyStateText}>
                    No papers have been added to this examination yet.
                  </Text>
                </View>
              }
            />
          </>
        ) : (
          <View style={styles.collapsedContent}>
            <Text style={styles.collapsedText}>
              Papers section is collapsed.
            </Text>
          </View>
        )}
      </View>

      {/* Actions modal */}
      <Modal
        transparent
        visible={actionsVisible}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setActionsVisible(false)}
      >
        <Pressable
          style={styles.actionsMenuOverlay}
          onPress={() => setActionsVisible(false)}
        >
          <View
            style={[
              styles.actionsDropdown,
              {
                top: actionsMenuTop,
              },
            ]}
          >
            {/* Available for draft and published examinations */}
            {canSchedule ? (
              <Pressable
                onPress={openSchedule}
                style={({ pressed }) => [
                  styles.actionsDropdownItem,
                  pressed && styles.actionsDropdownItemPressed,
                ]}
              >
                <Text style={styles.actionsDropdownItemText}>Schedule</Text>
              </Pressable>
            ) : null}

            {/* Available for all examination statuses */}
            <Pressable
              onPress={openManageExamPapers}
              style={({ pressed }) => [
                styles.actionsDropdownItem,
                pressed && styles.actionsDropdownItemPressed,
              ]}
            >
              <Text style={styles.actionsDropdownItemText}>
                Manage Exam Papers
              </Text>
            </Pressable>

            {/* Available only for published examinations */}
            {canShowAdmitCards ? (
              <Pressable
                onPress={openAdmitCards}
                style={({ pressed }) => [
                  styles.actionsDropdownItem,
                  pressed && styles.actionsDropdownItemPressed,
                ]}
              >
                <Text style={styles.actionsDropdownItemText}>Admit Cards</Text>
              </Pressable>
            ) : null}

            {/* Available only after results are published */}
            {canShowMarksheets ? (
              <Pressable
                onPress={openMarksheets}
                style={({ pressed }) => [
                  styles.actionsDropdownItem,
                  pressed && styles.actionsDropdownItemPressed,
                ]}
              >
                <Text style={styles.actionsDropdownItemText}>Marksheets</Text>
              </Pressable>
            ) : null}

            {/* Available for every examination status */}
            <Pressable
              onPress={confirmDeactivateExamination}
              disabled={deactivating}
              style={({ pressed }) => [
                styles.actionsDropdownItem,
                styles.actionsDropdownDeactivateItem,
                deactivating && styles.controlDisabled,
                pressed &&
                  !deactivating &&
                  styles.actionsDropdownDeactivatePressed,
              ]}
            >
              {deactivating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.actionsDropdownDeactivateText}>
                  Deactivate
                </Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* ========================= */}
      <Modal
        transparent
        visible={statusModalVisible}
        animationType="fade"
        onRequestClose={() => {
          if (!updatingStatus) {
            setStatusModalVisible(false);
          }
        }}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            if (!updatingStatus) {
              setStatusModalVisible(false);
            }
          }}
        >
          <Pressable
            style={styles.statusModal}
            onPress={event => event.stopPropagation()}
          >
            <View style={styles.statusModalHeader}>
              <Text style={styles.statusModalTitle}>Update Status</Text>

              <Pressable
                onPress={() => setStatusModalVisible(false)}
                disabled={updatingStatus}
                accessibilityRole="button"
                accessibilityLabel="Close status modal"
                style={({ pressed }) => [
                  styles.statusModalCloseButton,
                  updatingStatus && styles.controlDisabled,
                  pressed && !updatingStatus && styles.controlPressed,
                ]}
              >
                <Text style={styles.statusModalCloseIcon}>×</Text>
              </Pressable>
            </View>

            <Text style={styles.statusFieldLabel}>Examination status</Text>

            <View style={styles.statusOptions}>
              {EXAMINATION_STATUS_OPTIONS.map(option => {
                const isSelected = selectedStatus === option.value;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setSelectedStatus(option.value)}
                    disabled={updatingStatus}
                    style={({ pressed }) => [
                      styles.statusOption,
                      isSelected && styles.statusOptionSelected,
                      updatingStatus && styles.controlDisabled,
                      pressed && !updatingStatus && styles.controlPressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.statusRadio,
                        isSelected && styles.statusRadioSelected,
                      ]}
                    >
                      {isSelected ? (
                        <View style={styles.statusRadioDot} />
                      ) : null}
                    </View>

                    <Text
                      style={[
                        styles.statusOptionText,
                        isSelected && styles.statusOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.statusModalFooter}>
              <Pressable
                onPress={() => setStatusModalVisible(false)}
                disabled={updatingStatus}
                style={({ pressed }) => [
                  styles.statusCancelButton,
                  updatingStatus && styles.controlDisabled,
                  pressed && !updatingStatus && styles.controlPressed,
                ]}
              >
                <Text style={styles.statusCancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={updateExaminationStatus}
                disabled={
                  updatingStatus ||
                  selectedStatus === normalizeStatus(examination?.status)
                }
                style={({ pressed }) => [
                  styles.statusSaveButton,
                  (updatingStatus ||
                    selectedStatus === normalizeStatus(examination?.status)) &&
                    styles.controlDisabled,
                  pressed &&
                    !updatingStatus &&
                    selectedStatus !== normalizeStatus(examination?.status) &&
                    styles.controlPressed,
                ]}
              >
                {updatingStatus ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.statusSaveButtonText}>Save</Text>
                )}
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
