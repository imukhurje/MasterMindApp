import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { api, absoluteUrl, getToken } from '../../../api/client';
import styles from './AdminMarksheets.styles';

function getSettingValue(items, key, fallback = '') {
  const item = (items || []).find(row => row?.key === key);

  if (item?.value === null || item?.value === undefined) {
    return fallback;
  }

  return item.value;
}

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function sumMarkItems(items) {
  if (!Array.isArray(items)) {
    return 0;
  }

  return items.reduce((sum, item) => {
    if (typeof item === 'number' || typeof item === 'string') {
      return sum + toNumber(item);
    }

    return (
      sum +
      toNumber(item?.marks ?? item?.mark ?? item?.awarded_marks ?? item?.value)
    );
  }, 0);
}

function sumMaxMarkItems(items) {
  if (!Array.isArray(items)) {
    return 0;
  }

  return items.reduce((sum, item) => {
    if (typeof item === 'number' || typeof item === 'string') {
      return sum + toNumber(item);
    }

    return (
      sum +
      toNumber(item?.max_marks ?? item?.marks ?? item?.max_mark ?? item?.value)
    );
  }, 0);
}

function getCourseTotal(course) {
  return toNumber(course?.exam_mark) + sumMarkItems(course?.extras);
}

function getCourseMaxTotal(course) {
  return toNumber(course?.max_exam_mark) + sumMaxMarkItems(course?.max_extras);
}

function formatMark(value) {
  const number = toNumber(value);

  return Number.isInteger(number) ? String(number) : number.toFixed(2);
}

function formatMarkWithMax(value, maxValue) {
  return `${formatMark(value)} (${formatMark(maxValue)})`;
}

function getInitials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'AI';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function AdminMarksheets({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const examinationId = Number(route?.params?.examinationId);

  const examinationName = route?.params?.examinationName || 'Examination';

  const [settings, setSettings] = useState([]);

  const [students, setStudents] = useState([]);

  const [extraKeys, setExtraKeys] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);
  const [downloadingStudentId, setDownloadingStudentId] = useState(null);

  const schoolName = useMemo(
    () => String(getSettingValue(settings, '__SCHOOL_NAME__', 'Institution')),
    [settings],
  );

  const schoolAddress = useMemo(
    () => String(getSettingValue(settings, '__SCHOOL_ADDRESS__', '')),
    [settings],
  );

  const logoUrl = useMemo(
    () => getSettingValue(settings, 'ui.logo_url', null),
    [settings],
  );

  const logoHeight = useMemo(() => {
    const value = Number(getSettingValue(settings, 'ui.logo_height', 58));

    if (!Number.isFinite(value)) {
      return 58;
    }

    return Math.min(Math.max(value, 42), 80);
  }, [settings]);

  const loadMarksheets = useCallback(
    async ({ refresh = false } = {}) => {
      if (!Number.isFinite(examinationId)) {
        Alert.alert('Marksheets', 'Examination ID is missing.', [
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

        const [settingsResponse, marksheetsResponse] = await Promise.all([
          api('/api/settings/v1/declared'),

          api(`/api/examinations/v1/${examinationId}/marksheets`),
        ]);

        setSettings(
          Array.isArray(settingsResponse?.items) ? settingsResponse.items : [],
        );

        setStudents(
          Array.isArray(marksheetsResponse?.data?.students)
            ? marksheetsResponse.data.students
            : [],
        );

        setExtraKeys(
          Array.isArray(marksheetsResponse?.data?.extra_keys)
            ? marksheetsResponse.data.extra_keys
            : [],
        );

        navigation.setOptions({
          title: 'Marksheets',
        });
      } catch (error) {
        console.log('Marksheets load error:', error);

        Alert.alert(
          'Marksheets',
          error?.message || 'Could not load marksheets.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [examinationId, navigation],
  );

  useEffect(() => {
    loadMarksheets();
  }, [loadMarksheets]);

  async function downloadStudentMarksheet(student) {
    const studentId = Number(student?.id);

    if (!Number.isFinite(studentId) || !Number.isFinite(examinationId)) {
      Alert.alert(
        'Download Marksheet',
        'Student or examination ID is missing.',
      );
      return;
    }

    if (downloadingStudentId !== null) {
      return;
    }

    try {
      setDownloadingStudentId(studentId);

      const token = await getToken();

      const safeStudentName = String(student?.name || `student-${studentId}`)
        .replace(/[^a-zA-Z0-9-_]+/g, '_')
        .replace(/^_+|_+$/g, '');

      const fileName = `${
        safeStudentName || `student-${studentId}`
      }-marksheet.pdf`;

      // const url = `https://argus.ascendlearn.org/examinations/${examinationId}/marksheets/${studentId}/pdf`;

      const url = absoluteUrl(
        `/examinations/${examinationId}/marksheets/${studentId}/pdf`,
      );

      const tempPath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${fileName}`;

      const headers = {
        Accept: 'application/pdf',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log('Marksheet download URL:', url);
      console.log('Marksheet auth token exists:', Boolean(token));

      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
        path: tempPath,
      }).fetch('GET', url, headers);

      const info = response.info();

      console.log('Marksheet response status:', info?.status);

      console.log('Marksheet response headers:', info?.headers);

      const status = Number(info?.status);

      if (status < 200 || status >= 300) {
        throw new Error(`Server returned HTTP ${status}.`);
      }

      const contentType =
        info?.headers?.['Content-Type'] ||
        info?.headers?.['content-type'] ||
        '';

      console.log('Marksheet content type:', contentType);

      if (!String(contentType).toLowerCase().includes('pdf')) {
        throw new Error(
          `Expected PDF but received ${
            contentType || 'an unknown response type'
          }.`,
        );
      }

      await savePdfToDevice(tempPath, fileName);
    } catch (error) {
      console.log('Marksheet download error:', error);

      Alert.alert(
        'Download failed',
        error?.message || 'Could not download the marksheet.',
      );
    } finally {
      setDownloadingStudentId(null);
    }
  }

  async function savePdfToDevice(sourcePath, fileName) {
    if (Platform.OS === 'android') {
      await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
        {
          name: fileName,
          parentFolder: 'Argus',
          mimeType: 'application/pdf',
        },
        'Download',
        sourcePath,
      );

      Alert.alert(
        'Download complete',
        `${fileName} was saved to Downloads/Argus.`,
      );

      return;
    }

    const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

    await ReactNativeBlobUtil.fs.cp(sourcePath, destination);

    Alert.alert(
      'Download complete',
      'The marksheet was downloaded successfully.',
    );
  }

  function renderStudentMarksheet({ item: student, index }) {
    const courses = Array.isArray(student?.courses) ? student.courses : [];

    const grandTotal = courses.reduce(
      (sum, course) => sum + getCourseTotal(course),
      0,
    );

    const grandMaximum = courses.reduce(
      (sum, course) => sum + getCourseMaxTotal(course),
      0,
    );

    const className = student?.class_group?.name || '-';

    return (
      <View style={styles.marksheetCard}>
        <View style={styles.institutionSection}>
          {/* {typeof logoUrl === 'string' && logoUrl.startsWith('http') ? ( */}
          <Image
            source={{ uri: absoluteUrl('/images/logo.png') }}
            resizeMode="contain"
            style={{
              width: logoHeight,
              height: logoHeight,
            }}
          />
          {/* ) : (
            <View
              style={[
                styles.logoFallback,
                {
                  width: logoHeight,
                  height: logoHeight,
                  borderRadius: logoHeight / 2,
                },
              ]}
            >
              <Text style={styles.logoFallbackText}>
                {getInitials(schoolName)}
              </Text>
            </View>
          )} */}

          <Text style={styles.schoolName}>{schoolName}</Text>

          {schoolAddress ? (
            <Text style={styles.schoolAddress}>{schoolAddress}</Text>
          ) : null}

          <Text numberOfLines={2} style={styles.examinationTitle}>
            {examinationName}
          </Text>

          <Text style={styles.marksheetTitle}>Marksheet</Text>

          <Pressable
            onPress={() => downloadStudentMarksheet(student)}
            disabled={downloadingStudentId !== null}
            style={({ pressed }) => [
              styles.printButton,

              downloadingStudentId !== null && styles.controlDisabled,

              pressed && downloadingStudentId === null && styles.controlPressed,
            ]}
          >
            {downloadingStudentId === Number(student?.id) ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.printButtonText}>Print / Download PDF</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.studentInfoCard}>
          <View style={styles.studentInfoRow}>
            <View style={styles.studentInfoItem}>
              <Text style={styles.infoLabel}>Roll Number</Text>

              <Text style={styles.infoValue}>{student?.roll_no || '—'}</Text>
            </View>

            <View style={styles.studentInfoItem}>
              <Text style={styles.infoLabel}>Name</Text>

              <Text numberOfLines={2} style={styles.infoValue}>
                {student?.name || '—'}
              </Text>
            </View>
          </View>

          <View style={styles.classInfoBlock}>
            <Text style={styles.infoLabel}>Class</Text>

            <Text style={styles.infoValue}>{className}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.courseColumn]}>
              Course
            </Text>

            <Text style={[styles.tableHeaderText, styles.markColumn]}>
              Exam Mark
            </Text>

            <Text style={[styles.tableHeaderText, styles.totalColumn]}>
              Total
            </Text>
          </View>

          {courses.length === 0 ? (
            <View style={styles.emptyCourseRow}>
              <Text style={styles.emptyCourseText}>
                No course marks available.
              </Text>
            </View>
          ) : (
            courses.map(course => {
              const examMark = toNumber(course?.exam_mark);

              const maxExamMark = toNumber(course?.max_exam_mark);

              const total = getCourseTotal(course);

              const maxTotal = getCourseMaxTotal(course);

              return (
                <View
                  key={String(course?.course_id ?? course?.course_title)}
                  style={styles.tableRow}
                >
                  <Text
                    numberOfLines={2}
                    style={[styles.tableCell, styles.courseColumn]}
                  >
                    {course?.course_title || 'Untitled course'}
                  </Text>

                  <Text style={[styles.tableCell, styles.markColumn]}>
                    {formatMarkWithMax(examMark, maxExamMark)}
                  </Text>

                  <Text style={[styles.tableCell, styles.totalColumn]}>
                    {formatMarkWithMax(total, maxTotal)}
                  </Text>
                </View>
              );
            })
          )}

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>
              Grand Total: {formatMark(grandTotal)}
            </Text>

            <Text style={styles.grandTotalMaximum}>
              Out of {formatMark(grandMaximum)}
            </Text>
          </View>
        </View>

        {extraKeys.length > 0 ? (
          <Text style={styles.extraInfoText}>
            Additional requirement marks are included in the course totals.
          </Text>
        ) : null}

        <Text style={styles.sheetCounter}>
          Marksheet {index + 1} of {students.length}
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading marksheets...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <FlatList
        data={students}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={renderStudentMarksheet}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadMarksheets({
                refresh: true,
              })
            }
            tintColor="#FFFFFF"
            colors={['#FFFFFF']}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          students.length === 0 && styles.emptyListContent,
        ]}
        ListHeaderComponent={
          <View style={styles.pageHeader}>
            <View>
              <Text style={styles.pageTitle}>Marksheets</Text>

              <Text numberOfLines={1} style={styles.pageSubtitle}>
                {examinationName}
              </Text>
            </View>

            {/* <Pressable
              onPress={showDownloadPending}
              style={({ pressed }) => [
                styles.downloadAllButton,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.downloadAllButtonText}>
                Download Marksheets
              </Text>
            </Pressable> */}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No marksheets found</Text>

            <Text style={styles.emptyStateText}>
              There are no student marksheets available for this examination.
            </Text>
          </View>
        }
      />
    </View>
  );
}
