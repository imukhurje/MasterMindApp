// src/screens/Admin/Student/AdminStudentCreate.js

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { Dropdown } from 'react-native-element-dropdown';

import { launchImageLibrary } from 'react-native-image-picker';

import { pick, types } from '@react-native-documents/picker';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';

import styles from './AdminStudentEdit.styles';

import { useRoute } from '@react-navigation/native';

function formatDateForApi(date) {
  if (!(date instanceof Date)) {
    return '';
  }

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDateForDisplay(date) {
  if (!(date instanceof Date)) {
    return '';
  }

  const day = String(date.getDate()).padStart(2, '0');

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function normalizePickedFile(file) {
  if (!file) {
    return null;
  }

  return {
    uri: file.uri,
    name: file.name || file.fileName || 'document',
    type: file.type || file.mimeType || 'application/octet-stream',
    size: file.size || file.fileSize || null,
  };
}

function appendFileToFormData(formData, fieldName, file) {
  if (!file?.uri) {
    return;
  }

  formData.append(fieldName, {
    uri: file.uri,
    name: file.name || `file-${Date.now()}`,
    type: file.type || 'application/octet-stream',
  });
}

function parseApiDate(value) {
  if (!value) {
    return null;
  }

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;

  return new Date(Number(year), Number(month) - 1, Number(day));
}

function getInitialClassGroupId(student) {
  const placementId = Number(student?.placement?.class_group?.id);

  if (Number.isFinite(placementId)) {
    return placementId;
  }

  const firstClassId = Number(student?.class_groups?.[0]?.id);

  return Number.isFinite(firstClassId) ? firstClassId : null;
}

function FileField({
  label,
  file,
  multipleFiles,
  onPress,
  onClear,
  multiple = false,
}) {
  let displayText = 'Choose File';

  if (multiple) {
    if (Array.isArray(multipleFiles) && multipleFiles.length > 0) {
      displayText = `${multipleFiles.length} file(s) selected`;
    } else {
      displayText = 'Choose Files';
    }
  } else if (file?.name) {
    displayText = file.name;
  }

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.fileButton,
          pressed && styles.controlPressed,
        ]}
      >
        <MaterialCommunityIcons name="paperclip" size={17} color="#D7E3F4" />

        <Text numberOfLines={1} style={styles.fileButtonText}>
          {displayText}
        </Text>

        {file || multipleFiles?.length > 0 ? (
          <Pressable
            onPress={event => {
              event.stopPropagation();

              onClear?.();
            }}
            hitSlop={8}
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={19}
              color="#94A3B8"
            />
          </Pressable>
        ) : null}
      </Pressable>
    </View>
  );
}

export default function AdminStudentEdit({ navigation }) {
  const route = useRoute();

  const student = route?.params?.student || null;

  const studentId = Number(route?.params?.studentId || student?.id);

  const studentMeta = route?.params?.studentMeta || null;

  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [classes, setClasses] = useState([]);

  const [fullName, setFullName] = useState(String(student?.name || ''));

  const [email, setEmail] = useState(String(student?.email || ''));

  const [studentCode, setStudentCode] = useState(
    String(student?.student_id || ''),
  );

  const [dateOfBirth, setDateOfBirth] = useState(
    parseApiDate(student?.date_of_birth),
  );

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [phone, setPhone] = useState(String(student?.phone || ''));

  const [rollNumber, setRollNumber] = useState(String(student?.roll_no || ''));

  const [status, setStatus] = useState(String(student?.status || 'active'));

  const [selectedClassGroupId, setSelectedClassGroupId] = useState(
    getInitialClassGroupId(student),
  );

  const [selectedSubjectCombinationId, setSelectedSubjectCombinationId] =
    useState(() => {
      const combinationId =
        student?.subject_combination?.id ||
        student?.combination_id ||
        student?.subject_combination_id ||
        null;

      return combinationId ? String(combinationId) : null;
    });

  const [photo, setPhoto] = useState(null);

  const existingPhotoUrl = String(student?.photo_url || '').trim();

  const [birthCertificate, setBirthCertificate] = useState(null);

  const [idProof, setIdProof] = useState(null);

  const [addressProof, setAddressProof] = useState(null);

  const [transferCertificate, setTransferCertificate] = useState(null);

  const [otherDocuments, setOtherDocuments] = useState([]);

  const existingDocuments = useMemo(() => {
    const admissionDocuments = Array.isArray(student?.admission_documents)
      ? student.admission_documents
      : [];

    const studentDocuments = Array.isArray(student?.student_documents)
      ? student.student_documents
      : [];

    const map = new Map();

    [...admissionDocuments, ...studentDocuments].forEach(document => {
      if (!document?.url) {
        return;
      }

      map.set(`${document?.type}-${document?.url}`, document);
    });

    return Array.from(map.values());
  }, [student]);

  const loadClasses = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api('/api/class-groups');

      setClasses(Array.isArray(response?.classes) ? response.classes : []);
    } catch (error) {
      console.log('Student class groups error:', error);

      Alert.alert(
        'Edit Student',
        error?.message || 'Could not load student information.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const classOptions = useMemo(() => {
    return classes.map(item => {
      const name = String(item?.name || '').trim();

      const section = String(item?.section || '').trim();

      const academicYear =
        item?.academic_year?.name || item?.academic_year?.code || '';

      const classLabel = section ? `${name} (${section})` : name;

      return {
        value: item.id,

        label: academicYear ? `${classLabel} — ${academicYear}` : classLabel,

        data: item,
      };
    });
  }, [classes]);

  const selectedClassMeta = useMemo(() => {
    const metaClasses = Array.isArray(studentMeta?.classes)
      ? studentMeta.classes
      : [];

    return (
      metaClasses.find(
        item => Number(item?.id) === Number(selectedClassGroupId),
      ) || null
    );
  }, [studentMeta, selectedClassGroupId]);

  const subjectCombinationOptions = useMemo(() => {
    let combinations = Array.isArray(selectedClassMeta?.subject_combinations)
      ? selectedClassMeta.subject_combinations
      : [];

    /*
     * Fallback to the current student's options
     * when editing the student's existing class.
     */
    if (
      combinations.length === 0 &&
      Number(selectedClassGroupId) ===
        Number(getInitialClassGroupId(student)) &&
      Array.isArray(student?.subject_combination_options)
    ) {
      combinations = student.subject_combination_options;
    }

    return combinations.map(item => ({
      label: String(item?.name || ''),
      value: String(item?.id || ''),
    }));
  }, [selectedClassMeta, selectedClassGroupId, student]);

  const subjectCombinationEnabled =
    selectedClassMeta?.subject_combination_enabled === true ||
    subjectCombinationOptions.length > 0;

  const subjectCombinationRequired =
    subjectCombinationEnabled && subjectCombinationOptions.length > 0;

  useEffect(() => {
    if (!subjectCombinationEnabled) {
      setSelectedSubjectCombinationId(null);
      return;
    }

    if (!selectedSubjectCombinationId) {
      return;
    }

    const stillValid = subjectCombinationOptions.some(
      item => String(item.value) === String(selectedSubjectCombinationId),
    );

    if (!stillValid) {
      setSelectedSubjectCombinationId(null);
    }
  }, [
    subjectCombinationEnabled,
    subjectCombinationOptions,
    selectedSubjectCombinationId,
  ]);

  const statusOptions = [
    {
      label: 'Active',
      value: 'active',
    },
    {
      label: 'Inactive',
      value: 'inactive',
    },
  ];

  const selectPhoto = useCallback(async () => {
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.9,
      });

      if (response?.didCancel || !response?.assets?.length) {
        return;
      }

      const asset = response.assets[0];

      setPhoto({
        uri: asset.uri,

        name: asset.fileName || `student-photo-${Date.now()}.jpg`,

        type: asset.type || 'image/jpeg',

        size: asset.fileSize || null,
      });
    } catch (error) {
      console.log('Photo picker error:', error);

      Alert.alert('Photo', 'Could not select the student photo.');
    }
  }, []);

  const pickSingleDocument = useCallback(async setter => {
    try {
      const result = await pick({
        type: [types.images, types.pdf],

        allowMultiSelection: false,
      });

      const file = Array.isArray(result) ? result[0] : result;

      if (file) {
        setter(normalizePickedFile(file));
      }
    } catch (error) {
      /*
       * Picker cancellation should
       * not show an error alert.
       */
      if (
        String(error?.message || '')
          .toLowerCase()
          .includes('cancel')
      ) {
        return;
      }

      console.log('Document picker error:', error);

      Alert.alert('Documents', 'Could not select the document.');
    }
  }, []);

  const pickOtherDocuments = useCallback(async () => {
    try {
      const result = await pick({
        type: [types.images, types.pdf],

        allowMultiSelection: true,
      });

      const rows = Array.isArray(result) ? result : [result];

      setOtherDocuments(rows.map(normalizePickedFile).filter(Boolean));
    } catch (error) {
      if (
        String(error?.message || '')
          .toLowerCase()
          .includes('cancel')
      ) {
        return;
      }

      console.log('Other documents picker error:', error);

      Alert.alert('Documents', 'Could not select supporting documents.');
    }
  }, []);

  const handleDateChange = useCallback((event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event?.type === 'dismissed') {
      return;
    }

    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  }, []);

  const canSubmit =
    Boolean(fullName.trim()) &&
    Boolean(rollNumber.trim()) &&
    Boolean(selectedClassGroupId) &&
    (!subjectCombinationRequired || Boolean(selectedSubjectCombinationId));

  const handleSaveChanges = useCallback(async () => {
    if (!canSubmit || submitting) {
      return;
    }

    if (!Number.isFinite(studentId)) {
      Alert.alert('Edit Student', 'A valid student ID is required.');

      return;
    }

    try {
      setSubmitting(true);

      /*
       * Step 1:
       * Update the existing student.
       */
      const studentFormData = new FormData();

      studentFormData.append('name', fullName.trim());

      studentFormData.append('class_group_id', String(selectedClassGroupId));

      if (email.trim()) {
        studentFormData.append('email', email.trim());
      }

      if (studentCode.trim()) {
        studentFormData.append('student_id', studentCode.trim());
      }

      if (dateOfBirth) {
        studentFormData.append('date_of_birth', formatDateForApi(dateOfBirth));
      }

      if (phone.trim()) {
        studentFormData.append('phone', phone.trim());
      }

      studentFormData.append('roll_no', rollNumber.trim());

      studentFormData.append('status', status);

      if (selectedSubjectCombinationId) {
        studentFormData.append(
          'combination_id',
          String(selectedSubjectCombinationId),
        );
      }

      /*
       * Laravel method spoofing.
       * The request itself remains POST.
       */
      studentFormData.append('_method', 'PUT');

      /*
       * Send a replacement photo only
       * when the user selected a new photo.
       */
      if (photo?.uri) {
        appendFileToFormData(studentFormData, 'photo', photo);
      }

      const updateResponse = await api(
        `/api/students/${encodeURIComponent(studentId)}`,
        {
          method: 'POST',
          body: studentFormData,
        },
      );

      if (updateResponse?.ok !== true) {
        throw new Error('Student details could not be updated.');
      }

      /*
       * Step 2:
       * Upload only newly selected documents.
       * Existing documents do not need to
       * be uploaded again.
       */
      const hasNewDocuments =
        Boolean(birthCertificate?.uri) ||
        Boolean(idProof?.uri) ||
        Boolean(addressProof?.uri) ||
        Boolean(transferCertificate?.uri) ||
        otherDocuments.length > 0;

      if (hasNewDocuments) {
        const documentsFormData = new FormData();

        appendFileToFormData(
          documentsFormData,
          'birth_certificate',
          birthCertificate,
        );

        appendFileToFormData(documentsFormData, 'id_proof', idProof);

        appendFileToFormData(documentsFormData, 'address_proof', addressProof);

        appendFileToFormData(
          documentsFormData,
          'transfer_certificate',
          transferCertificate,
        );

        otherDocuments.forEach(file => {
          appendFileToFormData(documentsFormData, 'other_docs[]', file);
        });

        const documentsResponse = await api(
          `/api/students/${encodeURIComponent(studentId)}/documents`,
          {
            method: 'POST',
            body: documentsFormData,
          },
        );

        if (documentsResponse?.ok !== true) {
          throw new Error(
            'Student details were updated, but documents could not be uploaded.',
          );
        }
      }

      Alert.alert('Student Updated', 'The student was updated successfully.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.log('Update student error:', error);

      Alert.alert(
        'Edit Student',
        error?.message || 'Could not update the student.',
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    canSubmit,
    submitting,
    studentId,
    fullName,
    selectedClassGroupId,
    email,
    studentCode,
    dateOfBirth,
    phone,
    rollNumber,
    status,
    photo,
    birthCertificate,
    idProof,
    addressProof,
    transferCertificate,
    otherDocuments,
    selectedSubjectCombinationId,
    subjectCombinationRequired,
    navigation,
  ]);

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading student...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,

          {
            paddingBottom: Math.max(insets.bottom, 12) + 20,
          },
        ]}
      >
        {/* <Text style={styles.pageTitle}>Create Student</Text> */}

        {/* Full Name */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Full Name
            <Text style={styles.required}> *</Text>
          </Text>

          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Alex Student"
            placeholderTextColor="#70839F"
            style={styles.input}
          />
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Text style={styles.label}>Email (optional)</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Leave blank if none"
            placeholderTextColor="#70839F"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        {/* Student ID / DOB */}
        <View style={styles.twoColumnRow}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Student ID (optional)</Text>

            <TextInput
              value={studentCode}
              onChangeText={setStudentCode}
              placeholder="e.g. STD-2026-0001"
              placeholderTextColor="#70839F"
              style={styles.input}
            />
          </View>

          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Date of Birth (optional)</Text>

            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              <Text
                style={[
                  styles.dateText,

                  !dateOfBirth && styles.placeholderText,
                ]}
              >
                {dateOfBirth ? formatDateForDisplay(dateOfBirth) : 'dd-mm-yyyy'}
              </Text>

              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={20}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </View>

        {/* Phone / Roll */}
        <View style={styles.twoColumnRow}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Phone (optional)</Text>

            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Leave blank if none"
              placeholderTextColor="#70839F"
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>
              Roll Number
              <Text style={styles.required}> *</Text>
            </Text>

            <TextInput
              value={rollNumber}
              onChangeText={setRollNumber}
              placeholder="e.g. S0001"
              placeholderTextColor="#70839F"
              style={styles.input}
            />
          </View>
        </View>

        {/* Photo / Class */}
        <View style={styles.twoColumnRow}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Photo (optional)</Text>

            <Pressable onPress={selectPhoto} style={styles.fileButton}>
              {photo?.uri ? (
                <Image
                  source={{
                    uri: photo.uri,
                  }}
                  style={styles.photoPreview}
                />
              ) : existingPhotoUrl ? (
                <Image
                  source={{
                    uri: existingPhotoUrl,
                  }}
                  style={styles.photoPreview}
                />
              ) : (
                <MaterialCommunityIcons
                  name="image-outline"
                  size={18}
                  color="#D7E3F4"
                />
              )}

              <Text numberOfLines={1} style={styles.fileButtonText}>
                {photo?.name ||
                  (existingPhotoUrl ? 'Current photo' : 'Choose File')}
              </Text>

              {photo ? (
                <Pressable
                  onPress={event => {
                    event.stopPropagation();

                    setPhoto(null);
                  }}
                  hitSlop={8}
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={19}
                    color="#94A3B8"
                  />
                </Pressable>
              ) : null}
            </Pressable>
          </View>

          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>
              Class and section
              <Text style={styles.required}> *</Text>
            </Text>

            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              itemTextStyle={styles.dropdownItemText}
              selectedTextStyle={styles.dropdownSelectedText}
              placeholderStyle={styles.dropdownPlaceholder}
              activeColor="#173B60"
              iconColor="#D7E3F4"
              data={classOptions}
              labelField="label"
              valueField="value"
              value={selectedClassGroupId}
              placeholder="Select class and section..."
              search
              searchPlaceholder="Search class..."
              onChange={item => {
                const nextClassId = Number(item.value);

                if (nextClassId !== Number(selectedClassGroupId)) {
                  setSelectedSubjectCombinationId(null);
                }

                setSelectedClassGroupId(nextClassId);
              }}
            />
          </View>
        </View>

        {/* Status / Subject Combination */}
        <View style={styles.twoColumnRow}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Status</Text>

            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              itemTextStyle={styles.dropdownItemText}
              selectedTextStyle={styles.dropdownSelectedText}
              activeColor="#173B60"
              iconColor="#D7E3F4"
              data={statusOptions}
              labelField="label"
              valueField="value"
              value={status}
              onChange={item => setStatus(item.value)}
            />
          </View>

          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>
              Subject Combination
              {subjectCombinationRequired ? (
                <Text style={styles.required}> *</Text>
              ) : null}
            </Text>

            <Dropdown
              style={[
                styles.dropdown,
                (!subjectCombinationEnabled ||
                  subjectCombinationOptions.length === 0) &&
                  styles.controlDisabled,
              ]}
              containerStyle={styles.dropdownContainer}
              itemTextStyle={styles.dropdownItemText}
              selectedTextStyle={styles.dropdownSelectedText}
              placeholderStyle={styles.dropdownPlaceholder}
              activeColor="#173B60"
              iconColor="#D7E3F4"
              data={subjectCombinationOptions}
              labelField="label"
              valueField="value"
              value={selectedSubjectCombinationId}
              placeholder={
                subjectCombinationEnabled ? 'Select...' : 'Not required'
              }
              search
              searchPlaceholder="Search combination..."
              disable={
                !subjectCombinationEnabled ||
                subjectCombinationOptions.length === 0
              }
              onChange={item => {
                setSelectedSubjectCombinationId(String(item.value));
              }}
            />

            {subjectCombinationRequired && !selectedSubjectCombinationId ? (
              <Text style={styles.fieldHelp}>Required for this class.</Text>
            ) : subjectCombinationEnabled &&
              subjectCombinationOptions.length === 0 ? (
              <Text style={styles.fieldHelp}>
                No subject combinations configured for this class.
              </Text>
            ) : null}
          </View>
        </View>

        {/* Documents */}
        <View style={styles.documentsCard}>
          <Text style={styles.documentsTitle}>Student documents</Text>

          {existingDocuments.length > 0 ? (
            <View style={styles.existingDocuments}>
              {existingDocuments.map(document => (
                <View
                  key={`${document.type}-${document.url}`}
                  style={styles.existingDocumentRow}
                >
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={18}
                    color="#93C5FD"
                  />

                  <View style={styles.existingDocumentInfo}>
                    <Text style={styles.existingDocumentLabel}>
                      {document.label || document.type}
                    </Text>

                    <Text numberOfLines={1} style={styles.existingDocumentName}>
                      {document.name}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.documentsEmptyText}>
              No documents have been uploaded for this student.
            </Text>
          )}

          <Text style={styles.documentsSubtitle}>
            Upload or replace documents
          </Text>

          <View style={styles.twoColumnRow}>
            <View style={styles.halfField}>
              <FileField
                label="Birth certificate"
                file={birthCertificate}
                onPress={() => pickSingleDocument(setBirthCertificate)}
                onClear={() => setBirthCertificate(null)}
              />
            </View>

            <View style={styles.halfField}>
              <FileField
                label="ID proof"
                file={idProof}
                onPress={() => pickSingleDocument(setIdProof)}
                onClear={() => setIdProof(null)}
              />
            </View>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.halfField}>
              <FileField
                label="Address proof"
                file={addressProof}
                onPress={() => pickSingleDocument(setAddressProof)}
                onClear={() => setAddressProof(null)}
              />
            </View>

            <View style={styles.halfField}>
              <FileField
                label="Transfer certificate"
                file={transferCertificate}
                onPress={() => pickSingleDocument(setTransferCertificate)}
                onClear={() => setTransferCertificate(null)}
              />
            </View>
          </View>

          <FileField
            label="Other supporting documents"
            multiple
            multipleFiles={otherDocuments}
            onPress={pickOtherDocuments}
            onClear={() => setOtherDocuments([])}
          />

          <Text style={styles.documentHelp}>
            Selected files are uploaded when you save the student.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            disabled={submitting}
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.cancelButton,

              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

          <Pressable
            disabled={!canSubmit || submitting}
            onPress={handleSaveChanges}
            style={({ pressed }) => [
              styles.createButton,

              (!canSubmit || submitting) && styles.controlDisabled,

              pressed && canSubmit && !submitting && styles.controlPressed,
            ]}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>Save Changes</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {showDatePicker ? (
        <DateTimePicker
          value={dateOfBirth || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      ) : null}
    </View>
  );
}
