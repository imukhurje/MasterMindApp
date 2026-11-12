// src/screens/Admin/Admission/AdminAdmissionDetails.js

import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api, absoluteUrl, getToken } from '../../../api/client';

import styles from './AdminAdmissionDetails.styles';

import ReactNativeBlobUtil from 'react-native-blob-util';

function formatDate(value) {
  if (!value) {
    return 'Not available';
  }

  const parts = String(value).split('-');

  if (parts.length !== 3) {
    return String(value);
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatGender(value) {
  const text = String(value || '')
    .trim()
    .toLowerCase();

  if (!text) {
    return 'Not available';
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getStatusLabel(status) {
  const value = String(status || '')
    .trim()
    .toLowerCase();

  if (value === 'admission_scheduled') {
    return 'Admission Scheduled';
  }

  if (!value) {
    return 'Unknown';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AdminAdmissionDetails({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const admissionId = Number(route?.params?.admissionId);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [admission, setAdmission] = useState(null);

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const [declineModalVisible, setDeclineModalVisible] = useState(false);

  const [declineReason, setDeclineReason] = useState('');

  const [decliningAdmission, setDecliningAdmission] = useState(false);

  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);

  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  const [reschedulingAdmission, setReschedulingAdmission] = useState(false);

  const [rescheduleOptions, setRescheduleOptions] = useState([]);

  const [selectedRescheduleClassGroupId, setSelectedRescheduleClassGroupId] =
    useState(null);

  const [rescheduleRollNo, setRescheduleRollNo] = useState('');

  const loadAdmission = useCallback(
    async ({ refresh = false } = {}) => {
      if (!Number.isFinite(admissionId)) {
        Alert.alert('Admission', 'A valid admission ID is required.');

        return;
      }

      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await api(
          `/api/admissions/admin/${encodeURIComponent(admissionId)}`,
        );

        setAdmission(response || null);
      } catch (error) {
        console.log('Admission details error:', error);

        Alert.alert(
          'Admission',
          error?.message || 'Could not load the admission application.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [admissionId],
  );

  useFocusEffect(
    useCallback(() => {
      loadAdmission();

      return undefined;
    }, [loadAdmission]),
  );

  const student = admission?.student || {};

  const address = student?.address || {};

  const parents = admission?.parents || {};

  const father = parents?.father || {};

  const mother = parents?.mother || {};

  const documents = admission?.documents || {};

  const requirements = useMemo(
    () =>
      Array.isArray(admission?.document_requirements)
        ? admission.document_requirements
        : [],
    [admission?.document_requirements],
  );

  const fullName =
    [student?.first_name, student?.last_name].filter(Boolean).join(' ') ||
    'Not available';

  const status = String(admission?.status || '')
    .trim()
    .toLowerCase();

  const statusLabel = getStatusLabel(status);

  const openDocument = useCallback(async url => {
    const documentUrl = String(url || '').trim();

    if (!documentUrl) {
      return;
    }

    try {
      const supported = await Linking.canOpenURL(documentUrl);

      if (!supported) {
        throw new Error('Document URL cannot be opened.');
      }

      await Linking.openURL(documentUrl);
    } catch (error) {
      Alert.alert('Document', error?.message || 'Could not open the document.');
    }
  }, []);

  const handlePrintPdf = useCallback(async () => {
    if (downloadingPdf || !Number.isFinite(admissionId)) {
      return;
    }

    let tempPath = null;

    try {
      setDownloadingPdf(true);

      const token = await getToken();

      const path = `/api/admissions/admin/${encodeURIComponent(
        admissionId,
      )}/pdf`;

      const url = absoluteUrl(path);

      const fileName = `Admission-${
        admission?.application_no || admissionId
      }.pdf`;

      const headers = {
        Accept: 'application/pdf',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: 'pdf',
      }).fetch('GET', url, headers);

      const info = response.info();

      const status = Number(info?.status);

      if (!Number.isFinite(status) || status < 200 || status >= 300) {
        throw new Error(
          `PDF download failed with HTTP ${status || 'unknown'}.`,
        );
      }

      tempPath = response.path();

      if (!tempPath) {
        throw new Error('Downloaded PDF file path was not returned.');
      }

      if (Platform.OS === 'android') {
        const savedUri =
          await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
            {
              name: fileName,
              parentFolder: 'Admissions',
              mimeType: 'application/pdf',
            },
            'Download',
            tempPath,
          );

        console.log('Admission PDF saved:', savedUri);

        Alert.alert(
          'Download Complete',
          `Admission PDF saved in:\n\nDownloads/Admissions\n\n${fileName}`,
        );

        return;
      }

      const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

      await ReactNativeBlobUtil.fs.cp(tempPath, destination);

      Alert.alert('Download Complete', 'Admission PDF has been saved.');
    } catch (error) {
      console.log('Admission PDF error:', error);

      Alert.alert(
        'Print / PDF',
        error?.message || 'Could not download the admission PDF.',
      );
    } finally {
      if (tempPath) {
        try {
          const exists = await ReactNativeBlobUtil.fs.exists(tempPath);

          if (exists) {
            await ReactNativeBlobUtil.fs.unlink(tempPath);
          }
        } catch (error) {
          console.log('Admission PDF cleanup error:', error);
        }
      }

      setDownloadingPdf(false);
    }
  }, [admissionId, admission?.application_no, downloadingPdf]);

  const handleDecline = useCallback(() => {
    if (decliningAdmission || !Number.isFinite(admissionId)) {
      return;
    }

    Alert.alert(
      'Decline Application',
      'Decline this application? The applicant will not be admitted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setDeclineReason('');
            setDeclineModalVisible(true);
          },
        },
      ],
    );
  }, [admissionId, decliningAdmission]);

  const handleConfirmDecline = useCallback(async () => {
    const reason = String(declineReason || '').trim();

    if (!reason) {
      Alert.alert('Decline Application', 'Decline reason is required.');

      return;
    }

    if (decliningAdmission || !Number.isFinite(admissionId)) {
      return;
    }

    try {
      setDecliningAdmission(true);

      const response = await api('/api/admissions/admin/status', {
        method: 'POST',

        body: JSON.stringify({
          id: admissionId,
          action: 'reject',
          reason,
        }),
      });

      if (
        String(response?.status || '')
          .trim()
          .toLowerCase() !== 'rejected'
      ) {
        throw new Error(
          response?.message || 'Could not decline the application.',
        );
      }

      setDeclineModalVisible(false);

      setDeclineReason('');

      Alert.alert(
        'Admission Declined',
        response?.message || 'Admission declined.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );
    } catch (error) {
      console.log('Decline admission error:', error);

      Alert.alert(
        'Decline Application',
        error?.message || 'Could not decline the application.',
      );
    } finally {
      setDecliningAdmission(false);
    }
  }, [admissionId, declineReason, decliningAdmission, navigation]);

  const handleReschedulePress = useCallback(() => {
    if (
      rescheduleLoading ||
      reschedulingAdmission ||
      !Number.isFinite(admissionId)
    ) {
      return;
    }

    Alert.alert(
      'Re-schedule Admission',
      'Re-schedule this application for admission?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              setRescheduleLoading(true);

              const response = await api(
                `/api/admissions/admin/${encodeURIComponent(admissionId)}`,
              );

              const optionsList = Array.isArray(response?.allocation_options)
                ? response.allocation_options
                : [];

              if (optionsList.length === 0) {
                throw new Error(
                  'No destination offering is available for this application.',
                );
              }

              const existingClassGroupId = Number(
                response?.allocation?.class_group_id,
              );

              const existingRollNo = String(
                response?.allocation?.roll_no || '',
              ).trim();

              const hasExistingOption = optionsList.some(
                option => Number(option?.id) === existingClassGroupId,
              );

              setRescheduleOptions(optionsList);

              setSelectedRescheduleClassGroupId(
                hasExistingOption
                  ? existingClassGroupId
                  : Number(optionsList[0]?.id),
              );

              setRescheduleRollNo(existingRollNo);

              setRescheduleModalVisible(true);
            } catch (error) {
              console.log('Reschedule admission load error:', error);

              Alert.alert(
                'Re-schedule Admission',
                error?.message ||
                  'Could not load admission scheduling information.',
              );
            } finally {
              setRescheduleLoading(false);
            }
          },
        },
      ],
    );
  }, [admissionId, rescheduleLoading, reschedulingAdmission]);

  const handleCloseRescheduleModal = useCallback(() => {
    if (reschedulingAdmission) {
      return;
    }

    setRescheduleModalVisible(false);

    setRescheduleOptions([]);

    setSelectedRescheduleClassGroupId(null);

    setRescheduleRollNo('');
  }, [reschedulingAdmission]);

  const handleConfirmReschedule = useCallback(async () => {
    const classGroupId = Number(selectedRescheduleClassGroupId);

    const rollNo = String(rescheduleRollNo || '').trim();

    if (!Number.isFinite(classGroupId)) {
      Alert.alert(
        'Re-schedule Admission',
        'Please select a destination offering.',
      );

      return;
    }

    if (!rollNo) {
      Alert.alert(
        'Re-schedule Admission',
        'Please enter the student roll number.',
      );

      return;
    }

    if (reschedulingAdmission || !Number.isFinite(admissionId)) {
      return;
    }

    try {
      setReschedulingAdmission(true);

      const response = await api('/api/admissions/admin/status', {
        method: 'POST',

        body: JSON.stringify({
          id: admissionId,

          action: 'reschedule',

          class_group_id: classGroupId,

          roll_no: rollNo,
        }),
      });

      if (
        String(response?.status || '')
          .trim()
          .toLowerCase() !== 'admission_scheduled'
      ) {
        throw new Error(
          response?.message || 'Could not re-schedule the application.',
        );
      }

      setRescheduleModalVisible(false);

      setRescheduleOptions([]);

      setSelectedRescheduleClassGroupId(null);

      setRescheduleRollNo('');

      Alert.alert(
        'Admission Re-scheduled',
        response?.message || 'Application re-scheduled for admission.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );
    } catch (error) {
      console.log('Re-schedule admission error:', error);

      Alert.alert(
        'Re-schedule Admission',
        error?.message || 'Could not re-schedule the application.',
      );
    } finally {
      setReschedulingAdmission(false);
    }
  }, [
    admissionId,
    selectedRescheduleClassGroupId,
    rescheduleRollNo,
    reschedulingAdmission,
    navigation,
  ]);

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading admission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: Math.max(insets.bottom, 18),
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadAdmission({
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
      >
        <View style={styles.headerCard}>
          <View style={styles.headerTitleArea}>
            <Text style={styles.headerTitle}>Admission Application</Text>

            <View
              style={[
                styles.statusBadge,

                status === 'admission_scheduled' && styles.scheduledBadge,

                status === 'passed' && styles.passedBadge,

                status === 'admitted' && styles.admittedBadge,

                status === 'rejected' && styles.rejectedBadge,

                status === 'submitted' && styles.submittedBadge,
              ]}
            >
              <Text style={styles.statusBadgeText}>{statusLabel}</Text>
            </View>
          </View>

          <Pressable
            disabled={downloadingPdf}
            onPress={handlePrintPdf}
            style={({ pressed }) => [
              styles.printButton,

              downloadingPdf && styles.controlDisabled,

              pressed && !downloadingPdf && styles.controlPressed,
            ]}
          >
            {downloadingPdf ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="printer-outline"
                  size={17}
                  color="#FFFFFF"
                />

                <Text style={styles.printButtonText}>Print / PDF</Text>
              </>
            )}
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Student Details</Text>

          <InfoRow label="Name" value={fullName} />

          <InfoRow label="DOB" value={formatDate(student?.dob)} />

          <InfoRow label="Gender" value={formatGender(student?.gender)} />

          <InfoRow
            label="Class"
            value={student?.class_applied || 'Not available'}
          />

          <InfoRow
            label="Academic Year"
            value={student?.academic_year || 'Not available'}
          />

          {!!admission?.application_no && (
            <InfoRow label="Application No." value={admission.application_no} />
          )}

          {admission?.allocation ? (
            <>
              <InfoRow
                label="Assigned Roll"
                value={admission.allocation?.roll_no || 'Not available'}
              />

              <InfoRow
                label="Class Group ID"
                value={String(
                  admission.allocation?.class_group_id || 'Not available',
                )}
              />
            </>
          ) : null}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Address</Text>

          <Text style={styles.addressText}>
            {address?.line1 || 'Address not provided'}
          </Text>

          {!!address?.line2 && (
            <Text style={styles.addressText}>{address.line2}</Text>
          )}

          <Text style={styles.addressText}>
            {[address?.city, address?.state, address?.pincode]
              .filter(Boolean)
              .join(', ') || 'Not available'}
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Parent / Guardian</Text>

          <InfoRow label="Father" value={father?.name || 'Not available'} />

          <InfoRow label="Mother" value={mother?.name || 'Not available'} />

          <InfoRow
            label="Phone"
            value={father?.phone || mother?.phone || 'Not available'}
          />

          <InfoRow
            label="Email"
            value={father?.email || mother?.email || 'Not available'}
          />

          <InfoRow
            label="Primary Contact"
            value={
              parents?.primary_contact
                ? formatGender(parents.primary_contact)
                : 'Not available'
            }
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Documents Status</Text>

          {requirements.map(requirement => {
            const documentUrl = documents[requirement.id];

            return (
              <View key={requirement.id} style={styles.documentRow}>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>
                    {requirement.name}

                    {requirement?.mandatory ? ' *' : ''}
                  </Text>

                  <Text
                    style={
                      documentUrl
                        ? styles.documentAvailable
                        : styles.documentMissing
                    }
                  >
                    {documentUrl ? 'Uploaded' : 'Not uploaded'}
                  </Text>
                </View>

                {documentUrl ? (
                  <Pressable
                    onPress={() => openDocument(documentUrl)}
                    style={({ pressed }) => [
                      styles.documentButton,

                      pressed && styles.controlPressed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="download-outline"
                      size={16}
                      color="#FFFFFF"
                    />

                    <Text style={styles.documentButtonText}>Open</Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Admission Information</Text>

          <InfoRow label="Status" value={statusLabel} />

          <InfoRow
            label="Submitted"
            value={admission?.submitted_at || 'Not available'}
          />

          <InfoRow
            label="Updated"
            value={admission?.updated_at || 'Not available'}
          />

          {admission?.decline_reason ? (
            <View style={styles.declineReasonBox}>
              <Text style={styles.declineReasonLabel}>Decline Reason</Text>

              <Text style={styles.declineReasonText}>
                {admission.decline_reason}
              </Text>
            </View>
          ) : null}
        </View>

        {status === 'rejected' ? (
          <Pressable
            disabled={rescheduleLoading}
            onPress={handleReschedulePress}
            style={({ pressed }) => [
              styles.rescheduleButton,

              rescheduleLoading && styles.controlDisabled,

              pressed && !rescheduleLoading && styles.controlPressed,
            ]}
          >
            {rescheduleLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="calendar-refresh-outline"
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.rescheduleButtonText}>
                  Re-schedule for Admission
                </Text>
              </>
            )}
          </Pressable>
        ) : status !== 'admitted' ? (
          <Pressable
            onPress={handleDecline}
            style={({ pressed }) => [
              styles.declineButton,

              pressed && styles.controlPressed,
            ]}
          >
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.declineButtonText}>Decline</Text>
          </Pressable>
        ) : null}
      </ScrollView>
      <Modal
        visible={declineModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          if (!decliningAdmission) {
            setDeclineModalVisible(false);
          }
        }}
      >
        <View style={styles.declineModalBackdrop}>
          <View style={styles.declineModal}>
            <Text style={styles.declineModalTitle}>Decline Application</Text>

            <Text style={styles.declineModalLabel}>
              Decline Reason
              <Text style={styles.requiredText}> *</Text>
            </Text>

            <TextInput
              value={declineReason}
              onChangeText={setDeclineReason}
              editable={!decliningAdmission}
              placeholder="Enter decline reason"
              placeholderTextColor="#718096"
              multiline
              textAlignVertical="top"
              style={styles.declineReasonInput}
            />

            <View style={styles.declineModalActions}>
              <Pressable
                disabled={decliningAdmission}
                onPress={() => {
                  setDeclineModalVisible(false);

                  setDeclineReason('');
                }}
                style={({ pressed }) => [
                  styles.declineCancelButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.declineCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={decliningAdmission}
                onPress={handleConfirmDecline}
                style={({ pressed }) => [
                  styles.declineConfirmButton,

                  decliningAdmission && styles.controlDisabled,

                  pressed && !decliningAdmission && styles.controlPressed,
                ]}
              >
                {decliningAdmission ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.declineConfirmText}>OK</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={rescheduleModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseRescheduleModal}
      >
        <View style={styles.rescheduleModalBackdrop}>
          <View style={styles.rescheduleModal}>
            <Text style={styles.rescheduleModalTitle}>
              Re-schedule for Admission
            </Text>

            <Text style={styles.rescheduleModalLabel}>
              Choose the destination offering
            </Text>

            {rescheduleOptions.map(option => {
              const optionId = Number(option?.id);

              const isSelected =
                Number(selectedRescheduleClassGroupId) === optionId;

              return (
                <Pressable
                  key={String(optionId)}
                  onPress={() => setSelectedRescheduleClassGroupId(optionId)}
                  style={({ pressed }) => [
                    styles.rescheduleOption,

                    isSelected && styles.rescheduleOptionSelected,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <View style={styles.rescheduleRadio}>
                    {isSelected ? (
                      <View style={styles.rescheduleRadioInner} />
                    ) : null}
                  </View>

                  <View style={styles.rescheduleOptionInfo}>
                    <Text style={styles.rescheduleOptionId}>
                      Offering ID: {optionId}
                    </Text>

                    <Text style={styles.rescheduleOptionLabel}>
                      {option?.label || 'Destination offering'}
                    </Text>
                  </View>
                </Pressable>
              );
            })}

            <View style={styles.rescheduleRollField}>
              <Text style={styles.rescheduleModalLabel}>
                Assign the student roll number
              </Text>

              <TextInput
                value={rescheduleRollNo}
                onChangeText={setRescheduleRollNo}
                editable={!reschedulingAdmission}
                placeholder="Enter roll number"
                placeholderTextColor="#718096"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.rescheduleRollInput}
              />
            </View>

            <View style={styles.rescheduleActions}>
              <Pressable
                disabled={reschedulingAdmission}
                onPress={handleCloseRescheduleModal}
                style={({ pressed }) => [
                  styles.rescheduleCancelButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.rescheduleCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={reschedulingAdmission}
                onPress={handleConfirmReschedule}
                style={({ pressed }) => [
                  styles.rescheduleConfirmButton,

                  reschedulingAdmission && styles.controlDisabled,

                  pressed && !reschedulingAdmission && styles.controlPressed,
                ]}
              >
                {reschedulingAdmission ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.rescheduleConfirmText}>OK</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>

      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}
