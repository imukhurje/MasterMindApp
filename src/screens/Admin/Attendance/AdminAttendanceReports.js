// src/screens/Admin/Attendance/AdminAttendanceReports.js

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api, absoluteUrl, getToken } from '../../../api/client';
import styles from './AdminAttendanceReports.styles';
import ReactNativeBlobUtil from 'react-native-blob-util';

const RANGE_OPTIONS = [
  {
    value: 'this_week',
    label: 'This Week',
  },
  {
    value: 'mtd',
    label: 'Month to Date',
  },
  {
    value: 'ytd',
    label: 'Year to Date',
  },
  {
    value: 'last_month',
    label: 'Last Month',
  },
];

function formatDate(value) {
  if (!value) {
    return '';
  }

  const parts = String(value).split('-');

  if (parts.length !== 3) {
    return String(value);
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
}

function SelectionModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalCard}
          onPress={event => event.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>

            <Pressable onPress={onClose} style={styles.modalClose}>
              <MaterialCommunityIcons name="close" size={21} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView style={styles.optionList}>
            {options.map(option => {
              const selected = String(option.value) === String(selectedValue);

              return (
                <Pressable
                  key={String(option.value)}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.optionRow,

                    selected && styles.optionRowSelected,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,

                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>

                  {selected ? (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="#60A5FA"
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function safeFileName(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export default function AdminAttendanceReports({ navigation }) {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [reportLoading, setReportLoading] = useState(false);

  const [meta, setMeta] = useState(null);

  const [report, setReport] = useState(null);

  const [selectedClassId, setSelectedClassId] = useState(null);

  const [selectedRange, setSelectedRange] = useState('this_week');

  const [classPickerVisible, setClassPickerVisible] = useState(false);

  const [rangePickerVisible, setRangePickerVisible] = useState(false);

  const [downloadingReport, setDownloadingReport] = useState(false);

  const classOptions = useMemo(() => {
    const classes = Array.isArray(meta?.classes) ? meta.classes : [];

    return classes.map(item => ({
      value: item.id,
      label: item.label,
    }));
  }, [meta?.classes]);

  const selectedClassLabel = useMemo(() => {
    return (
      classOptions.find(item => Number(item.value) === Number(selectedClassId))
        ?.label || 'Select Class'
    );
  }, [classOptions, selectedClassId]);

  const selectedRangeLabel = useMemo(() => {
    return (
      RANGE_OPTIONS.find(item => item.value === selectedRange)?.label ||
      'Select Range'
    );
  }, [selectedRange]);

  const loadReport = useCallback(async ({ classId, range }) => {
    if (!classId || !range) {
      setReport(null);
      return;
    }

    try {
      setReportLoading(true);

      const response = await api(
        `/api/attendance/reports?class_group_id=${encodeURIComponent(
          classId,
        )}&range=${encodeURIComponent(range)}`,
      );

      setReport(response || null);
    } catch (error) {
      console.log('Attendance report load error:', error);

      setReport(null);

      Alert.alert(
        'Attendance Reports',
        error?.message || 'Could not load attendance report.',
      );
    } finally {
      setReportLoading(false);
    }
  }, []);

  const loadInitialData = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const metaResponse = await api('/api/attendance/meta');

        setMeta(metaResponse || null);

        const classes = Array.isArray(metaResponse?.classes)
          ? metaResponse.classes
          : [];

        const firstClassId = selectedClassId || classes?.[0]?.id || null;

        if (firstClassId) {
          setSelectedClassId(firstClassId);

          await loadReport({
            classId: firstClassId,
            range: selectedRange,
          });
        }
      } catch (error) {
        console.log('Attendance reports initial load error:', error);

        Alert.alert(
          'Attendance Reports',
          error?.message || 'Could not load attendance reports.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loadReport, selectedClassId, selectedRange],
  );

  useFocusEffect(
    useCallback(() => {
      loadInitialData();

      return undefined;
    }, [loadInitialData]),
  );

  useEffect(() => {
    if (!selectedClassId || !selectedRange) {
      return;
    }

    loadReport({
      classId: selectedClassId,
      range: selectedRange,
    });
  }, [selectedClassId, selectedRange, loadReport]);

  const handleClassSelect = useCallback(option => {
    setSelectedClassId(Number(option.value));
  }, []);

  const handleRangeSelect = useCallback(option => {
    setSelectedRange(option.value);
  }, []);

  const handleDownloadReport = useCallback(async () => {
    if (!selectedClassId || !selectedRange || downloadingReport) {
      return;
    }

    let tempPath = null;

    try {
      setDownloadingReport(true);

      const token = await getToken();

      const url = absoluteUrl(
        `/api/attendance/reports.xlsx?class_group_id=${encodeURIComponent(
          selectedClassId,
        )}&range=${encodeURIComponent(selectedRange)}`,
      );

      const className = safeFileName(
        report?.class_label || selectedClassLabel || 'Class',
      );

      const rangeName = safeFileName(
        report?.range_label || selectedRangeLabel || selectedRange,
      );

      const fileName = `Attendance_${className}_${rangeName}.xlsx`;

      tempPath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${fileName}`;

      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
        path: tempPath,
      }).fetch('GET', url, {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      });

      const info = response.info();

      const status = Number(info?.status) || 0;

      if (status < 200 || status >= 300) {
        throw new Error(`Download failed with status ${status}.`);
      }

      const downloadedPath = response.path();

      if (Platform.OS === 'android') {
        await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
          {
            name: fileName,

            parentFolder: '',

            mimeType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          'Download',
          downloadedPath,
        );

        Alert.alert(
          'Report Downloaded',
          `${fileName} has been saved to Downloads.`,
        );
      } else {
        const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

        await ReactNativeBlobUtil.fs.cp(downloadedPath, destination);

        Alert.alert(
          'Report Downloaded',
          'The attendance report has been downloaded.',
        );

        /*
         * Open the XLSX using an available
         * document application on iOS.
         */
        await ReactNativeBlobUtil.ios.openDocument(destination);
      }
    } catch (error) {
      console.log('Attendance report download error:', error);

      Alert.alert(
        'Download failed',
        error?.message || 'Could not download the attendance report.',
      );
    } finally {
      setDownloadingReport(false);

      if (tempPath) {
        try {
          const exists = await ReactNativeBlobUtil.fs.exists(tempPath);

          if (exists) {
            await ReactNativeBlobUtil.fs.unlink(tempPath);
          }
        } catch (cleanupError) {
          console.log('Report temp file cleanup error:', cleanupError);
        }
      }
    }
  }, [
    selectedClassId,
    selectedRange,
    downloadingReport,
    report?.class_label,
    report?.range_label,
    selectedClassLabel,
    selectedRangeLabel,
  ]);

  const rows = Array.isArray(report?.rows) ? report.rows : [];

  const renderStudent = useCallback(
    ({ item }) => {
      const percentage = Number(item?.attendance_percent) || 0;

      return (
        <View style={styles.studentCard}>
          <View style={styles.studentTopRow}>
            <View style={styles.studentIdentity}>
              <View style={styles.rollBadge}>
                <Text style={styles.rollBadgeText}>{item?.roll_no || '—'}</Text>
              </View>

              <View style={styles.studentText}>
                <Text style={styles.studentName} numberOfLines={2}>
                  {item?.name || 'Student'}
                </Text>

                <Text style={styles.classText}>
                  {item?.class_section || report?.class_label || '—'}
                </Text>
              </View>
            </View>

            <View style={styles.percentBadge}>
              <Text style={styles.percentValue}>{percentage.toFixed(1)}%</Text>

              <Text style={styles.percentLabel}>Attendance</Text>
            </View>
          </View>

          <View style={styles.studentStatsRow}>
            <View style={styles.studentStat}>
              <Text style={styles.studentStatLabel}>Attended Classes</Text>

              <Text style={styles.studentStatValue}>
                {Number(item?.attended_classes) || 0}
              </Text>
            </View>

            <View style={styles.studentStat}>
              <Text style={styles.studentStatLabel}>Total Classes</Text>

              <Text style={styles.studentStatValue}>
                {Number(report?.total_classes) || 0}
              </Text>
            </View>
          </View>
        </View>
      );
    },
    [report],
  );

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 6),
        },
      ]}
    >
      <FlatList
        data={rows}
        keyExtractor={item => String(item?.student_id)}
        renderItem={renderStudent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadInitialData({
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
        ListHeaderComponent={
          <>
            {/* Filters */}
            <View style={styles.filterCard}>
              <Text style={styles.pageTitle}>Attendance Reports</Text>

              <Text style={styles.pageSubtitle}>
                Review student attendance by class and date range
              </Text>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Class</Text>

                <Pressable
                  onPress={() => setClassPickerVisible(true)}
                  style={styles.selectBox}
                >
                  <Text style={styles.selectText} numberOfLines={1}>
                    {selectedClassLabel}
                  </Text>

                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={21}
                    color="#E2E8F0"
                  />
                </Pressable>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Date Range</Text>

                <Pressable
                  onPress={() => setRangePickerVisible(true)}
                  style={styles.selectBox}
                >
                  <Text style={styles.selectText}>{selectedRangeLabel}</Text>

                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={21}
                    color="#E2E8F0"
                  />
                </Pressable>
              </View>
            </View>

            {/* Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryTopRow}>
                <View>
                  <Text style={styles.summaryClass}>
                    {report?.class_label || selectedClassLabel}
                  </Text>

                  <Text style={styles.summaryRange}>
                    {report?.range_label || selectedRangeLabel}
                  </Text>
                </View>

                <View style={styles.totalClassBadge}>
                  <Text style={styles.totalClassValue}>
                    {Number(report?.total_classes) || 0}
                  </Text>

                  <Text style={styles.totalClassLabel}>Total Classes</Text>
                </View>
              </View>

              {!!report?.range_from && !!report?.range_to ? (
                <Text style={styles.rangeText}>
                  {formatDate(report.range_from)}
                  {'  —  '}
                  {formatDate(report.range_to)}
                </Text>
              ) : null}

              <Pressable
                disabled={downloadingReport}
                onPress={handleDownloadReport}
                style={({ pressed }) => [
                  styles.downloadButton,

                  downloadingReport && styles.controlDisabled,

                  pressed && !downloadingReport && styles.controlPressed,
                ]}
              >
                {downloadingReport ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />

                    <Text style={styles.downloadButtonText}>
                      Downloading...
                    </Text>
                  </>
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="download-outline"
                      size={19}
                      color="#FFFFFF"
                    />

                    <Text style={styles.downloadButtonText}>
                      Download Report
                    </Text>
                  </>
                )}
              </Pressable>
            </View>

            <View style={styles.studentsHeading}>
              <Text style={styles.studentsTitle}>Students</Text>

              <View style={styles.studentCountBadge}>
                <Text style={styles.studentCountText}>{rows.length}</Text>
              </View>
            </View>

            {reportLoading ? (
              <View style={styles.reportLoading}>
                <ActivityIndicator size="small" color="#67D1F0" />

                <Text style={styles.reportLoadingText}>Loading report...</Text>
              </View>
            ) : null}
          </>
        }
        ListEmptyComponent={
          !reportLoading ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="account-school-outline"
                size={32}
                color="#7D93AD"
              />

              <Text style={styles.emptyTitle}>No students / no data</Text>

              <Text style={styles.emptyText}>
                No attendance data is available for this class and date range.
              </Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <SelectionModal
        visible={classPickerVisible}
        title="Select Class"
        options={classOptions}
        selectedValue={selectedClassId}
        onSelect={handleClassSelect}
        onClose={() => setClassPickerVisible(false)}
      />

      <SelectionModal
        visible={rangePickerVisible}
        title="Select Date Range"
        options={RANGE_OPTIONS}
        selectedValue={selectedRange}
        onSelect={handleRangeSelect}
        onClose={() => setRangePickerVisible(false)}
      />
    </View>
  );
}
