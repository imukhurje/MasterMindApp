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

import styles from './AdminStudentCreate.styles';

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

export default function AdminStudentCreate({ navigation }) {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [classes, setClasses] = useState([]);

  const [fullName, setFullName] = useState('');

  const [email, setEmail] = useState('');

  const [studentCode, setStudentCode] = useState('');

  const [dateOfBirth, setDateOfBirth] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [phone, setPhone] = useState('');

  const [rollNumber, setRollNumber] = useState('');

  const [selectedClassGroupId, setSelectedClassGroupId] = useState(null);

  const [status, setStatus] = useState('active');

  const [photo, setPhoto] = useState(null);

  const [birthCertificate, setBirthCertificate] = useState(null);

  const [idProof, setIdProof] = useState(null);

  const [addressProof, setAddressProof] = useState(null);

  const [transferCertificate, setTransferCertificate] = useState(null);

  const [otherDocuments, setOtherDocuments] = useState([]);

  const loadClasses = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api('/api/class-groups');

      setClasses(Array.isArray(response?.classes) ? response.classes : []);
    } catch (error) {
      console.log('Student class groups error:', error);

      Alert.alert(
        'Create Student',
        error?.message || 'Could not load classes.',
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
    Boolean(selectedClassGroupId);

  const handleCreate = useCallback(async () => {
    if (!canSubmit || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      /*
       * Step 1:
       * Create the student.
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

      if (photo?.uri) {
        appendFileToFormData(studentFormData, 'photo', photo);
      }

      const createResponse = await api('/api/students', {
        method: 'POST',
        body: studentFormData,
      });

      const studentId = Number(createResponse?.id);

      if (createResponse?.ok !== true || !Number.isFinite(studentId)) {
        throw new Error('Student was not created successfully.');
      }

      /*
       * Step 2:
       * Upload documents after the student
       * has been created.
       */
      const hasDocuments =
        Boolean(birthCertificate?.uri) ||
        Boolean(idProof?.uri) ||
        Boolean(addressProof?.uri) ||
        Boolean(transferCertificate?.uri) ||
        otherDocuments.length > 0;

      if (hasDocuments) {
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

        await api(`/api/students/${encodeURIComponent(studentId)}/documents`, {
          method: 'POST',
          body: documentsFormData,
        });
      }

      Alert.alert('Student Created', 'The student was created successfully.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.log('Create student error:', error);

      Alert.alert(
        'Create Student',
        error?.message || 'Could not create the student.',
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    canSubmit,
    submitting,
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
    navigation,
  ]);

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading student form...</Text>
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
              ) : (
                <MaterialCommunityIcons
                  name="image-outline"
                  size={18}
                  color="#D7E3F4"
                />
              )}

              <Text numberOfLines={1} style={styles.fileButtonText}>
                {photo?.name || 'Choose File'}
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
              onChange={item => setSelectedClassGroupId(item.value)}
            />
          </View>
        </View>

        {/* Status */}
        <View style={styles.field}>
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

        {/* Documents */}
        <View style={styles.documentsCard}>
          <Text style={styles.documentsTitle}>Student documents</Text>

          <Text style={styles.documentsEmptyText}>
            No documents have been uploaded for this student.
          </Text>

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
            onPress={handleCreate}
            style={({ pressed }) => [
              styles.createButton,

              (!canSubmit || submitting) && styles.controlDisabled,

              pressed && canSubmit && !submitting && styles.controlPressed,
            ]}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>Create</Text>
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
