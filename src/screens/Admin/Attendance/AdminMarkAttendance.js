// src/screens/Admin/Attendance/AdminMarkAttendance.js

import React, { useCallback, useMemo, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect, useRoute } from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Camera, CameraType } from 'react-native-camera-kit';

import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

import { api } from '../../../api/client';
import styles from './AdminMarkAttendance.styles';

function formatSessionDateTime(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',

    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',

    hour12: false,
  });
}

const CAMERA_PERMISSION =
  Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

function parseStudentCardCode(rawValue) {
  const raw = String(rawValue || '').trim();

  if (!raw) {
    return null;
  }

  const prefix = 'ARGUS_STUDENT_CARD_V1:';

  if (raw.startsWith(prefix)) {
    try {
      const payload = JSON.parse(raw.slice(prefix.length));

      const studentId = Number(payload?.student_db_id);

      if (!Number.isFinite(studentId)) {
        return null;
      }

      return {
        studentId,
        payload,
      };
    } catch (error) {
      console.log('Student QR parse error:', error);

      return null;
    }
  }

  /*
   * Optional fallback for cards that contain
   * only the numeric student database ID.
   */
  const numericId = Number(raw);

  if (Number.isFinite(numericId)) {
    return {
      studentId: numericId,
      payload: null,
    };
  }

  return null;
}

function formatSheetDate(value) {
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

export default function AdminMarkAttendance({ navigation }) {
  const route = useRoute();

  const rawSessionId =
    route?.params?.sessionId ?? route?.params?.id ?? route?.params?.session?.id;

  const routeSessionType = String(route?.params?.sessionType || '')
    .trim()
    .toLowerCase();

  const sheetDate = String(route?.params?.sheetDate || '').trim();

  const classGroupId = Number(
    route?.params?.classGroupId ??
      route?.params?.class_group_id ??
      route?.params?.session?.class_group_id,
  );

  const sessionKey = String(rawSessionId ?? '').trim();

  const isDailyAttendance =
    routeSessionType === 'daily' || sessionKey.startsWith('daily:');

  const isTutorialAttendance =
    routeSessionType === 'tutorial' || sessionKey.startsWith('tutorial:');

  const tutorialMatch = sessionKey.match(
    /^tutorial:(\d{4}-\d{2}-\d{2}):(\d+)$/,
  );

  const tutorialDate = tutorialMatch?.[1] || sheetDate;

  const tutorialSheetId = tutorialMatch
    ? Number(tutorialMatch[2])
    : Number(route?.params?.tutorialSheetId);

  const sessionId =
    isDailyAttendance || isTutorialAttendance
      ? sessionKey
      : Number(rawSessionId);

  const scanLockRef = useRef(false);

  const lastScanRef = useRef({
    value: '',
    time: 0,
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [markingScan, setMarkingScan] = useState(false);

  const [session, setSession] = useState(null);

  const [students, setStudents] = useState([]);

  const [activeTab, setActiveTab] = useState(
    isTutorialAttendance || route?.params?.initialTab === 'manual'
      ? 'manual'
      : 'qr',
  );

  const [search, setSearch] = useState('');

  const [cameraEnabled, setCameraEnabled] = useState(false);

  const [cameraPermission, setCameraPermission] = useState(null);

  const [cameraMessage, setCameraMessage] = useState(
    'Tap Start Camera to scan a student identity card.',
  );

  const [manualPresentIds, setManualPresentIds] = useState(new Set());

  const [recentScans, setRecentScans] = useState([]);

  const loadSession = useCallback(
    async ({ showLoader = true } = {}) => {
      if (isDailyAttendance) {
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(sheetDate) ||
          !Number.isInteger(classGroupId) ||
          classGroupId <= 0
        ) {
          Alert.alert(
            'Attendance',
            'Attendance date or class information is missing.',
          );
          return;
        }
      } else if (isTutorialAttendance) {
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(tutorialDate) ||
          !Number.isInteger(tutorialSheetId) ||
          tutorialSheetId <= 0
        ) {
          Alert.alert('Attendance', 'Invalid tutorial attendance information.');
          return;
        }
      } else if (!Number.isInteger(sessionId) || sessionId <= 0) {
        Alert.alert('Attendance', 'Attendance session ID is missing.');
        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        }

        let response;

        if (isDailyAttendance) {
          response = await api(
            `/api/attendance/daily-sheets/${encodeURIComponent(
              sheetDate,
            )}?class_group_id=${encodeURIComponent(classGroupId)}`,
          );
        } else if (isTutorialAttendance) {
          response = await api(
            `/api/attendance/tutorial-sheets/${encodeURIComponent(
              tutorialDate,
            )}/${encodeURIComponent(tutorialSheetId)}`,
          );
        } else {
          response = await api(
            `/api/attendance/sessions/${encodeURIComponent(sessionId)}`,
          );
        }

        const rows = Array.isArray(response?.students) ? response.students : [];

        setSession(response?.session || null);
        setStudents(rows);

        setManualPresentIds(
          new Set(
            rows
              .filter(item => item?.present === true)
              .map(item => Number(item.student_id)),
          ),
        );
      } catch (error) {
        console.log('Attendance session load error:', {
          status: error?.status,
          message: error?.message,
        });

        Alert.alert(
          'Mark Attendance',
          error?.message || 'Could not load attendance.',
        );
      } finally {
        setLoading(false);
      }
    },
    [
      sessionId,
      sheetDate,
      classGroupId,
      isDailyAttendance,
      isTutorialAttendance,
      tutorialDate,
      tutorialSheetId,
      navigation,
    ],
  );

  useFocusEffect(
    useCallback(() => {
      const initialTab =
        isTutorialAttendance || route?.params?.initialTab === 'manual'
          ? 'manual'
          : 'qr';

      setActiveTab(initialTab);

      if (initialTab === 'manual') {
        setCameraEnabled(false);
      }

      loadSession();

      return () => {
        setCameraEnabled(false);
      };
    }, [loadSession, route?.params?.initialTab, isTutorialAttendance]),
  );

  const startCamera = useCallback(async () => {
    try {
      let status = await check(CAMERA_PERMISSION);

      if (status === RESULTS.DENIED) {
        status = await request(CAMERA_PERMISSION);
      }

      setCameraPermission(status);

      if (status === RESULTS.GRANTED) {
        setCameraMessage(
          'Scanner is live. Show the student identity card QR code to the camera.',
        );

        setCameraEnabled(true);

        return;
      }

      setCameraEnabled(false);

      if (status === RESULTS.BLOCKED) {
        setCameraMessage(
          'Camera permission is blocked. Please enable it from app settings.',
        );

        Alert.alert(
          'Camera Permission',
          'Camera permission is blocked. Please enable it from app settings.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => {
                openSettings().catch(error => {
                  console.log('Open settings error:', error);
                });
              },
            },
          ],
        );

        return;
      }

      setCameraMessage(
        'Camera permission is required to scan student identity cards.',
      );
    } catch (error) {
      console.log('Camera permission error:', error);

      setCameraEnabled(false);

      setCameraMessage('Could not start the camera.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    setCameraEnabled(false);

    setCameraMessage(
      'Camera is stopped. Tap Start Camera to scan a student identity card.',
    );

    scanLockRef.current = false;

    lastScanRef.current = {
      value: '',
      time: 0,
    };
  }, []);

  const restartCamera = useCallback(async () => {
    try {
      /*
       * Stop the camera first.
       */
      setCameraEnabled(false);

      scanLockRef.current = false;

      lastScanRef.current = {
        value: '',
        time: 0,
      };

      /*
       * Give the native camera a short time
       * to release before starting again.
       */
      await new Promise(resolve => setTimeout(resolve, 300));

      let status = await check(CAMERA_PERMISSION);

      if (status === RESULTS.DENIED) {
        status = await request(CAMERA_PERMISSION);
      }

      setCameraPermission(status);

      if (status !== RESULTS.GRANTED) {
        setCameraMessage(
          'Camera permission is required to scan student identity cards.',
        );

        return;
      }

      setCameraMessage(
        'Scanner is live. Show the student identity card QR code to the camera.',
      );

      setCameraEnabled(true);
    } catch (error) {
      console.log('Restart camera error:', error);

      setCameraEnabled(false);

      setCameraMessage('Could not restart the camera.');
    }
  }, []);

  const markStudentFromScan = useCallback(
    async studentId => {
      const student = students.find(
        item => Number(item?.student_id) === Number(studentId),
      );

      if (!student) {
        Alert.alert(
          'Invalid Student',
          'This student does not belong to this attendance session.',
        );

        return;
      }

      if (markingScan) {
        return;
      }

      try {
        setMarkingScan(true);

        /*
         * The mark endpoint receives the complete list
         * of students that should be present.
         *
         * Keep existing present students and add
         * the newly scanned student.
         */
        const presentIds = students
          .filter(item => item?.present === true)
          .map(item => Number(item.student_id));

        const nextPresentIds = Array.from(
          new Set([...presentIds, Number(studentId)]),
        );

        let endpoint;

        if (isDailyAttendance) {
          endpoint = `/api/attendance/daily-sheets/${encodeURIComponent(
            sheetDate,
          )}/mark`;
        } else {
          endpoint = `/api/attendance/sessions/${encodeURIComponent(
            sessionId,
          )}/mark`;
        }

        const response = await api(endpoint, {
          method: 'POST',

          body: JSON.stringify({
            present_ids: nextPresentIds,
          }),
        });

        if (!response?.message) {
          throw new Error('Could not update attendance.');
        }

        setRecentScans(current => {
          const withoutExisting = current.filter(
            item => Number(item.student_id) !== Number(studentId),
          );

          return [
            {
              ...student,
              scanned_at: new Date().toISOString(),
            },
            ...withoutExisting,
          ].slice(0, 10);
        });

        await loadSession({
          showLoader: false,
        });
      } catch (error) {
        console.log('QR attendance mark error:', error);

        Alert.alert(
          'Scan failed',
          error?.message || 'Could not mark the student present.',
        );
      } finally {
        setMarkingScan(false);

        setTimeout(() => {
          scanLockRef.current = false;
        }, 900);
      }
    },
    [
      students,
      sessionId,
      sheetDate,
      isDailyAttendance,
      markingScan,
      loadSession,
    ],
  );

  const handleScannedValue = useCallback(
    rawValue => {
      const value = String(rawValue || '').trim();

      if (!value || scanLockRef.current) {
        return;
      }

      const now = Date.now();

      if (
        lastScanRef.current.value === value &&
        now - lastScanRef.current.time < 1500
      ) {
        return;
      }

      lastScanRef.current = {
        value,
        time: now,
      };

      const parsed = parseStudentCardCode(value);

      if (!parsed) {
        scanLockRef.current = true;

        Alert.alert(
          'Invalid Identity Card',
          'The scanned QR code is not a valid student identity card.',
          [
            {
              text: 'OK',
              onPress: () => {
                scanLockRef.current = false;
              },
            },
          ],
        );

        return;
      }

      scanLockRef.current = true;

      markStudentFromScan(parsed.studentId);
    },
    [markStudentFromScan],
  );

  const toggleManualStudent = useCallback(studentId => {
    const id = Number(studentId);

    setManualPresentIds(current => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const handleSaveManualAttendance = useCallback(async () => {
    if (saving) {
      return;
    }

    try {
      setSaving(true);

      // All currently selected Present student IDs
      const presentIds = Array.from(manualPresentIds)
        .map(Number)
        .filter(id => Number.isInteger(id) && id > 0);

      let endpoint;

      if (isTutorialAttendance) {
        // Tutorial Attendance
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(tutorialDate) ||
          !Number.isInteger(tutorialSheetId) ||
          tutorialSheetId <= 0
        ) {
          throw new Error('Invalid tutorial attendance information.');
        }

        endpoint =
          `/api/attendance/tutorial-sheets/` +
          `${encodeURIComponent(tutorialDate)}/` +
          `${encodeURIComponent(tutorialSheetId)}/mark`;
      } else if (isDailyAttendance) {
        // Daily Attendance
        if (!sheetDate) {
          throw new Error('Attendance sheet date is missing.');
        }

        endpoint =
          `/api/attendance/daily-sheets/` +
          `${encodeURIComponent(sheetDate)}/mark`;
      } else {
        // Regular Lecture Attendance
        if (!Number.isInteger(sessionId) || sessionId <= 0) {
          throw new Error('Attendance session ID is missing.');
        }

        endpoint =
          `/api/attendance/sessions/` + `${encodeURIComponent(sessionId)}/mark`;
      }

      const response = await api(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          present_ids: presentIds,
        }),
      });

      if (!response?.message) {
        throw new Error('Could not update attendance.');
      }

      // Reload saved attendance data
      try {
        await loadSession({ showLoader: false });
      } catch (refreshError) {
        console.log('Attendance refresh error:', refreshError);
      }

      Alert.alert('Attendance Saved', response.message, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log('[SAVE ATTENDANCE ERROR]', {
        status: error?.status,
        message: error?.message,
        payload: error?.payload,
      });

      Alert.alert(
        'Save failed',
        error?.message || 'Could not save attendance.',
      );
    } finally {
      setSaving(false);
    }
  }, [
    saving,
    manualPresentIds,
    isDailyAttendance,
    isTutorialAttendance,
    sheetDate,
    tutorialDate,
    tutorialSheetId,
    sessionId,
    loadSession,
    navigation,
  ]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter(student => {
      const searchable = [student?.name, student?.roll_no, student?.class_label]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [students, search]);

  const presentStudents = useMemo(
    () => students.filter(item => item?.present === true),
    [students],
  );

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading attendance...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Mark Attendance</Text>

        <Text style={styles.sessionMeta} numberOfLines={2}>
          {isDailyAttendance ? (
            <>
              Daily Attendance
              {' · '}
              {formatSheetDate(session?.sheet_date || sheetDate)}
            </>
          ) : (
            <>
              {session?.class_label || 'Class'}
              {' · '}
              {session?.course_label || 'Course'}
              {' · '}
              {formatSessionDateTime(session?.starts_at)}

              {session?.teacher_name
                ? ` · Teacher: ${session.teacher_name}`
                : ''}
            </>
          )}
        </Text>

        <View style={styles.tabs}>
          <Pressable
            onPress={() => setActiveTab('qr')}
            style={[
              styles.tabButton,

              activeTab === 'qr' && styles.tabButtonActive,
            ]}
          >
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.tabButtonText}>QR Capture</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setActiveTab('manual');

              setCameraEnabled(false);
            }}
            style={[
              styles.tabButton,

              activeTab === 'manual' && styles.tabButtonActive,
            ]}
          >
            <MaterialCommunityIcons
              name="account-check-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.tabButtonText}>Manual Entry</Text>
          </Pressable>
        </View>
      </View>

      {activeTab === 'qr' ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Camera */}
          <View style={styles.cameraCard}>
            {cameraEnabled && cameraPermission === RESULTS.GRANTED ? (
              <View style={styles.cameraContainer}>
                <Camera
                  style={styles.camera}
                  cameraType={CameraType.Back}
                  scanBarcode={true}
                  showFrame={true}
                  laserColor="#67D1F0"
                  frameColor="#67D1F0"
                  barcodeFrameSize={{
                    width: 260,
                    height: 180,
                  }}
                  onReadCode={event => {
                    if (markingScan) {
                      return;
                    }

                    const value = String(
                      event?.nativeEvent?.codeStringValue || '',
                    ).trim();

                    if (!value) {
                      return;
                    }

                    handleScannedValue(value);
                  }}
                />

                {markingScan ? (
                  <View style={styles.scanningOverlay}>
                    <ActivityIndicator size="large" color="#FFFFFF" />

                    <Text style={styles.scanningText}>
                      Marking attendance...
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : (
              <View style={styles.cameraPlaceholder}>
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={38}
                  color="#67D1F0"
                />

                <Text style={styles.cameraPlaceholderTitle}>
                  Camera Scanner
                </Text>

                <Text style={styles.cameraPlaceholderText}>
                  {cameraMessage}
                </Text>
              </View>
            )}

            {!cameraEnabled ? (
              <Pressable
                onPress={startCamera}
                style={({ pressed }) => [
                  styles.startCameraButton,
                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.cameraActionButtonText}>Start Camera</Text>
              </Pressable>
            ) : (
              <View style={styles.cameraActionRow}>
                <Pressable
                  onPress={stopCamera}
                  style={({ pressed }) => [
                    styles.stopCameraButton,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="camera-off-outline"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text style={styles.cameraActionButtonText}>Stop Camera</Text>
                </Pressable>

                <Pressable
                  onPress={restartCamera}
                  style={({ pressed }) => [
                    styles.restartCameraButton,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="restart"
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text style={styles.cameraActionButtonText}>
                    Restart Camera
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Scan summary */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Scan Summary</Text>

            <Text style={styles.sectionValue}>
              {recentScans.length}{' '}
              {recentScans.length === 1
                ? 'student scanned'
                : 'students scanned'}
            </Text>
          </View>

          {/* Recent scans */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>

            {recentScans.length === 0 ? (
              <Text style={styles.emptyText}>No scans yet.</Text>
            ) : (
              recentScans.map(student => (
                <View
                  key={String(student.student_id)}
                  style={styles.recentScanCard}
                >
                  <View>
                    <Text style={styles.recentScanName}>{student.name}</Text>

                    <Text style={styles.recentScanMeta}>
                      {student.class_label}
                      {' · Roll '}
                      {student.roll_no || '—'}
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    name="check-circle"
                    size={23}
                    color="#22C55E"
                  />
                </View>
              ))
            )}
          </View>

          {/* Present Students */}
          <View style={styles.presentSection}>
            <Text style={styles.sectionTitle}>Present Students</Text>

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search by name, class, or roll number"
              placeholderTextColor="#73849E"
              style={styles.searchInput}
            />

            {presentStudents.length === 0 ? (
              <View style={styles.emptyStudentCard}>
                <Text style={styles.emptyText}>
                  No students are marked present yet.
                </Text>
              </View>
            ) : (
              presentStudents.map(student => {
                const query = search.trim().toLowerCase();

                if (
                  query &&
                  ![student.name, student.roll_no, student.class_label]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(query)
                ) {
                  return null;
                }

                return (
                  <View
                    key={String(student.student_id)}
                    style={styles.studentCard}
                  >
                    <View style={styles.studentMain}>
                      <Text style={styles.studentName}>{student.name}</Text>

                      <Text style={styles.studentClass}>
                        {student.class_label}
                      </Text>
                    </View>

                    <View style={styles.rollSection}>
                      <Text style={styles.rollLabel}>Roll</Text>

                      <Text style={styles.rollValue}>
                        {student.roll_no || '—'}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.manualContainer}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search student by name or roll number"
            placeholderTextColor="#73849E"
            style={styles.searchInput}
          />

          <FlatList
            data={filteredStudents}
            keyExtractor={item => String(item.student_id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.manualList}
            renderItem={({ item }) => {
              const checked = manualPresentIds.has(Number(item.student_id));

              return (
                <Pressable
                  onPress={() => toggleManualStudent(item.student_id)}
                  style={({ pressed }) => [
                    styles.manualStudentCard,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      checked ? 'checkbox-marked' : 'checkbox-blank-outline'
                    }
                    size={26}
                    color={checked ? '#60A5FA' : '#71839B'}
                  />

                  <View style={styles.manualStudentInfo}>
                    <Text style={styles.studentName}>{item.name}</Text>

                    <Text style={styles.studentClass}>{item.class_label}</Text>
                  </View>

                  <View style={styles.rollSection}>
                    <Text style={styles.rollLabel}>Roll</Text>

                    <Text style={styles.rollValue}>{item.roll_no || '—'}</Text>
                  </View>
                </Pressable>
              );
            }}
          />

          <View style={styles.manualFooter}>
            <Text style={styles.presentCount}>
              {manualPresentIds.size} of {students.length} present
            </Text>

            <View style={styles.footerActions}>
              <Pressable
                disabled={saving}
                onPress={() => navigation.goBack()}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>

              <Pressable
                disabled={saving}
                onPress={handleSaveManualAttendance}
                style={[styles.saveButton, saving && styles.controlDisabled]}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Attendance</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
