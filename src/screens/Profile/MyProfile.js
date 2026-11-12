import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';

import { api, absoluteUrl } from '../../api/client';
import styles from './MyProfile.styles';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function formatDateForDisplay(value) {
  if (!value) {
    return '';
  }

  const parts = String(value).split('-');

  if (parts.length !== 3) {
    return String(value);
  }

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function parseDisplayDate(value) {
  if (!value) {
    return new Date();
  }

  const parts = String(value).split('-');

  if (parts.length !== 3) {
    return new Date();
  }

  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);

  const date = new Date(year, month - 1, day);

  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function formatDateFromPicker(date) {
  const day = String(date.getDate()).padStart(2, '0');

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  keyboardType = 'default',
  required = false,
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        editable={editable}
        keyboardType={keyboardType}
        style={[styles.input, !editable && styles.readOnlyInput]}
      />
    </View>
  );
}

function DocumentPickerCard({
  title,
  required,
  file,
  existingPath,
  onPress,
  onRemove,
}) {
  const existingUrl = getExistingDocumentUrl(existingPath);

  const hasExistingDocument = Boolean(existingPath);

  const hasNewFile = Boolean(file);

  const existingIsImage = isImageDocument(existingPath);

  const existingIsPdf = isPdfDocument(existingPath);

  async function openExistingDocument() {
    if (!existingUrl) {
      return;
    }

    try {
      const supported = await Linking.canOpenURL(existingUrl);

      if (!supported) {
        throw new Error('This document cannot be opened.');
      }

      await Linking.openURL(existingUrl);
    } catch (error) {
      Alert.alert('Document', error?.message || 'Could not open the document.');
    }
  }

  return (
    <View style={styles.documentPickerCard}>
      <View style={styles.documentPickerTop}>
        <View style={styles.documentPickerText}>
          <View style={styles.documentTitleRow}>
            <Text style={styles.documentPickerTitle}>{title}</Text>

            {hasExistingDocument ? (
              <View style={styles.uploadedBadge}>
                <Text style={styles.uploadedBadgeText}>Uploaded</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.documentRequirement}>
            {required ? 'Required' : 'Optional'}
          </Text>
        </View>

        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.chooseFileButton,

            pressed && styles.controlPressed,
          ]}
        >
          <Text style={styles.chooseFileButtonText}>
            {hasNewFile || hasExistingDocument ? 'Replace' : 'Choose'}
          </Text>
        </Pressable>
      </View>

      {hasNewFile ? (
        <View style={styles.selectedFileRow}>
          <View
            style={{
              flex: 1,
            }}
          >
            <Text numberOfLines={1} style={styles.selectedFileName}>
              {file.name}
            </Text>

            <Text style={styles.pendingReplaceText}>Selected for upload</Text>
          </View>

          <Pressable onPress={onRemove} hitSlop={8}>
            <Text style={styles.removeFileText}>Remove</Text>
          </Pressable>
        </View>
      ) : hasExistingDocument ? (
        <Pressable
          onPress={openExistingDocument}
          style={({ pressed }) => [
            styles.existingDocumentRow,

            pressed && styles.controlPressed,
          ]}
        >
          {existingIsImage ? (
            <Image
              source={{
                uri: existingUrl,
              }}
              style={styles.existingDocumentImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.documentTypeBox}>
              <Text style={styles.documentTypeText}>
                {existingIsPdf ? 'PDF' : 'FILE'}
              </Text>
            </View>
          )}

          <View style={styles.existingDocumentInfo}>
            <Text numberOfLines={1} style={styles.existingDocumentName}>
              {getDocumentFileName(existingPath)}
            </Text>

            <Text style={styles.existingDocumentHint}>Tap to view</Text>
          </View>

          <Text style={styles.documentOpenArrow}>›</Text>
        </Pressable>
      ) : (
        <Text style={styles.noDocumentText}>No document uploaded yet</Text>
      )}
    </View>
  );
}

function getExistingDocumentUrl(path) {
  if (!path) {
    return null;
  }

  const value = String(path).trim();

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return absoluteUrl(`/storage/${value.replace(/^\/+/, '')}`);
}

function isImageDocument(path) {
  if (!path) {
    return false;
  }

  const cleanPath = String(path).split('?')[0].toLowerCase();

  return /\.(jpg|jpeg|png|webp)$/.test(cleanPath);
}

function isPdfDocument(path) {
  if (!path) {
    return false;
  }

  const cleanPath = String(path).split('?')[0].toLowerCase();

  return cleanPath.endsWith('.pdf');
}

function getDocumentFileName(path) {
  if (!path) {
    return 'Document';
  }

  const parts = String(path).split('/');

  return parts[parts.length - 1] || 'Document';
}

function formatDateForApi(value) {
  if (!value) {
    return null;
  }

  const parts = String(value).trim().split('-');

  if (parts.length !== 3) {
    return value;
  }

  const [day, month, year] = parts;

  return `${year}-${month}-${day}`;
}

export default function MyProfile({ navigation }) {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [me, setMe] = useState(null);

  const [profileResponse, setProfileResponse] = useState(null);

  const [name, setName] = useState('');

  const [lastName, setLastName] = useState('');

  const [email, setEmail] = useState('');

  const [studentId, setStudentId] = useState('');

  const [dateOfBirth, setDateOfBirth] = useState('');

  const [showDateOfBirthPicker, setShowDateOfBirthPicker] = useState(false);

  const [phone, setPhone] = useState('');

  const [whatsapp, setWhatsapp] = useState('');

  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(false);

  const [rollNo, setRollNo] = useState('');

  const [status, setStatus] = useState('');

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [documentFiles, setDocumentFiles] = useState({});

  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');

  const requirements = useMemo(
    () =>
      Array.isArray(profileResponse?.requirements)
        ? profileResponse.requirements
        : [],
    [profileResponse],
  );

  const existingDocuments = profileResponse?.documents || {};

  const profileType = String(profileResponse?.profile_type || '')
    .trim()
    .toLowerCase();

  const currentRole = String(
    me?.primary_role ||
      me?.role ||
      me?.actual_primary_role ||
      me?.actual_role ||
      '',
  )
    .trim()
    .toLowerCase();

  const isStudent = profileType === 'student';

  const isTeacher = profileType === 'teacher' || currentRole === 'teacher';

  const isAdminUser =
    me?.is_admin === true ||
    me?.is_super_admin === true ||
    currentRole === 'admin' ||
    currentRole === 'super_admin';
  const teacherPersonnelDocuments = useMemo(() => {
    if (!isTeacher) {
      return [];
    }

    const personnelDocuments = Array.isArray(
      profileResponse?.personnel_documents,
    )
      ? profileResponse.personnel_documents
      : [];

    const allowedIds = ['id_proof', 'latest_marksheet'];

    return allowedIds.map(documentId => {
      const apiDocument = personnelDocuments.find(
        item => String(item?.id || '') === documentId,
      );

      if (apiDocument) {
        return {
          id: documentId,
          name:
            apiDocument?.name ||
            (documentId === 'id_proof'
              ? 'ID Proof (Aadhar/passport, etc)'
              : 'Latest Marksheet'),

          mandatory: apiDocument?.mandatory !== false,

          existingPath: apiDocument?.document?.url || null,
        };
      }

      // Keep required fields visible even if the API
      // does not return an existing document entry.
      return {
        id: documentId,

        name:
          documentId === 'id_proof'
            ? 'ID Proof (Aadhar/passport, etc)'
            : 'Latest Marksheet',

        mandatory: true,

        existingPath: null,
      };
    });
  }, [profileResponse, isTeacher]);

  const existingPhotoUrl = useMemo(() => {
    // Teacher profile photo comes from personnel_documents.
    if (isTeacher) {
      const personnelDocuments = Array.isArray(
        profileResponse?.personnel_documents,
      )
        ? profileResponse.personnel_documents
        : [];

      const photoDocument = personnelDocuments.find(
        item => String(item?.id || '') === 'photo',
      );

      const teacherPhotoUrl = photoDocument?.document?.url;

      if (teacherPhotoUrl) {
        return absoluteUrl(teacherPhotoUrl);
      }

      return null;
    }

    // Student photo_url has priority.
    if (profileResponse?.photo_url) {
      return absoluteUrl(profileResponse.photo_url);
    }

    const studentPhotoPath = profileResponse?.documents?.student_photo;

    if (!studentPhotoPath) {
      return null;
    }

    return absoluteUrl(
      `/storage/${String(studentPhotoPath).replace(/^\/+/, '')}`,
    );
  }, [profileResponse, isTeacher]);

  const studentProfile = me?.student_profile || {};

  const classText = [studentProfile?.class_name, studentProfile?.section]
    .filter(Boolean)
    .join(' - ');

  const initials = String(name || me?.name || 'Student')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');

  const loadProfile = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [profileData, meData] = await Promise.all([
          api('/api/my-profile'),
          api('/api/me'),
        ]);

        const role = String(
          meData?.primary_role ||
            meData?.role ||
            meData?.actual_primary_role ||
            meData?.actual_role ||
            '',
        )
          .trim()
          .toLowerCase();

        const isAdminRole =
          meData?.is_admin === true ||
          meData?.is_super_admin === true ||
          role === 'admin' ||
          role === 'super_admin' ||
          (Array.isArray(meData?.roles) &&
            meData.roles.some(item =>
              ['admin', 'super_admin'].includes(
                String(item || '')
                  .trim()
                  .toLowerCase(),
              ),
            ));

        if (isAdminRole) {
          await api('/api/settings/v1/onboarding');
        }

        const profile = profileData?.profile || {};

        setProfileResponse(profileData);

        setMe(meData);

        setName(String(profile?.name || meData?.name || ''));

        setLastName(String(profile?.last_name || ''));

        setEmail(String(profile?.email || meData?.email || ''));

        setStudentId(profile?.student_id ? String(profile.student_id) : '');

        setDateOfBirth(formatDateForDisplay(profile?.date_of_birth));

        setPhone(profile?.phone ? String(profile.phone) : '');

        setWhatsapp(profile?.whatsapp ? String(profile.whatsapp) : '');

        setWhatsappSameAsPhone(Boolean(profile?.whatsapp_same_as_phone));

        setRollNo(
          String(profile?.roll_no || meData?.student_profile?.roll_no || ''),
        );

        setStatus(String(profile?.status || ''));

        setAddressLine1(String(profile?.address_line1 || ''));

        setAddressLine2(String(profile?.address_line2 || ''));

        setCity(String(profile?.city || ''));

        setStateProvince(String(profile?.state || ''));

        setPostalCode(String(profile?.postal_code || ''));

        setDepartment(String(profile?.department || ''));

        setDesignation(String(profile?.designation || ''));

        setBio(String(profile?.bio || ''));

        navigation.setOptions({
          title: 'My Profile',
        });
      } catch (error) {
        console.log('My profile load error:', error);

        Alert.alert(
          'My Profile',
          error?.message || 'Could not load your profile.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigation],
  );

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  function toggleWhatsAppSameAsPhone() {
    const next = !whatsappSameAsPhone;

    setWhatsappSameAsPhone(next);

    if (next) {
      setWhatsapp(phone);
    }
  }

  async function choosePhoto() {
    try {
      const result = await pick({
        allowMultiSelection: false,
        type: [types.images],
        mode: 'import',
      });

      const file = result?.[0];

      if (!file) {
        return;
      }

      if (Number(file?.size || 0) > MAX_FILE_SIZE) {
        Alert.alert('Photo', 'Maximum file size is 5 MB.');

        return;
      }

      setSelectedPhoto({
        uri: file.uri,
        name: file.name || `photo_${Date.now()}`,
        type: file.mimeType || 'image/jpeg',
        size: file.size || 0,
      });
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      Alert.alert('Photo', error?.message || 'Could not select the photo.');
    }
  }

  async function chooseDocument(requirementId) {
    try {
      const result = await pick({
        allowMultiSelection: false,
        type: [types.images, types.pdf],
        mode: 'import',
      });

      const file = result?.[0];

      if (!file) {
        return;
      }

      if (Number(file?.size || 0) > MAX_FILE_SIZE) {
        Alert.alert('Document', 'Maximum file size is 5 MB.');

        return;
      }

      setDocumentFiles(current => ({
        ...current,

        [requirementId]: {
          uri: file.uri,
          name: file.name || `document_${Date.now()}`,
          type: file.mimeType || 'application/octet-stream',
          size: file.size || 0,
        },
      }));
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      Alert.alert(
        'Document',
        error?.message || 'Could not select the document.',
      );
    }
  }

  function removeDocument(requirementId) {
    setDocumentFiles(current => {
      const next = {
        ...current,
      };

      delete next[requirementId];

      return next;
    });
  }

  async function uploadStudentDocuments() {
    const formData = new FormData();

    let fileCount = 0;

    if (selectedPhoto?.uri) {
      formData.append('photo', {
        uri: selectedPhoto.uri,
        name: selectedPhoto.name || `student_photo_${Date.now()}.jpg`,
        type: selectedPhoto.type || 'image/jpeg',
      });

      fileCount += 1;
    }

    Object.entries(documentFiles).forEach(([documentKey, file]) => {
      if (!file?.uri) {
        return;
      }

      // Other supporting documents need their
      // exact backend field name before uploading.
      if (documentKey === 'other_supporting_documents') {
        return;
      }

      formData.append(documentKey, {
        uri: file.uri,
        name: file.name || `${documentKey}_${Date.now()}`,
        type: file.type || 'application/octet-stream',
      });

      fileCount += 1;
    });

    if (fileCount === 0) {
      return null;
    }

    console.log('Uploading student documents:', fileCount);

    const response = await api('/api/my-profile/student-documents', {
      method: 'POST',
      body: formData,
    });

    if (response?.ok !== true) {
      throw new Error('Could not upload the selected documents.');
    }

    return response;
  }

  async function uploadPersonnelDocuments() {
    const formData = new FormData();

    let fileCount = 0;

    if (selectedPhoto?.uri) {
      formData.append('photo', {
        uri: selectedPhoto.uri,
        name: selectedPhoto.name || `personnel_photo_${Date.now()}.jpg`,
        type: selectedPhoto.type || 'image/jpeg',
      });

      fileCount += 1;
    }

    Object.entries(documentFiles).forEach(([documentKey, file]) => {
      if (!file?.uri) {
        return;
      }

      if (documentKey === 'other_supporting_documents') {
        return;
      }

      formData.append(documentKey, {
        uri: file.uri,
        name: file.name || `${documentKey}_${Date.now()}`,
        type: file.type || 'application/octet-stream',
      });

      fileCount += 1;
    });

    if (fileCount === 0) {
      return null;
    }

    console.log('Uploading personnel documents:', fileCount);

    const response = await api('/api/my-profile/personnel-documents', {
      method: 'POST',
      body: formData,
    });

    if (response?.ok !== true) {
      throw new Error('Could not upload the selected personnel documents.');
    }

    return response;
  }

  async function saveProfile() {
    if (saving) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('My Profile', 'Full name is required.');

      return;
    }

    try {
      setSaving(true);

      let payload;

      if (isAdminUser) {
        payload = {
          name: trimmedName,

          last_name: lastName.trim() || null,

          address_line1: addressLine1.trim() || null,

          address_line2: addressLine2.trim() || null,

          city: city.trim() || null,

          state: stateProvince.trim() || null,

          postal_code: postalCode.trim() || null,
        };
      } else if (isTeacher) {
        payload = {
          name: trimmedName,

          email: email.trim() || null,

          phone: phone.trim() || null,

          address_line_1: addressLine1.trim() || null,

          address_line_2: addressLine2.trim() || null,

          city: city.trim() || null,

          state_province: stateProvince.trim() || null,

          postal_code: postalCode.trim() || null,

          department: department.trim() || null,

          designation: designation.trim() || null,

          bio: bio.trim() || null,
        };
      } else {
        payload = {
          name: trimmedName,

          email: email.trim() || null,

          phone: phone.trim() || null,

          whatsapp: whatsappSameAsPhone
            ? phone.trim() || null
            : whatsapp.trim() || null,

          whatsapp_same_as_phone: Boolean(whatsappSameAsPhone),

          date_of_birth: dateOfBirth ? formatDateForApi(dateOfBirth) : null,
        };
      }

      console.log('Save profile payload:', payload);

      const profileResponse = await api('/api/my-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (profileResponse?.ok !== true) {
        throw new Error('Could not save the profile.');
      }

      if ((isStudent || isTeacher) && hasPendingDocumentUploads()) {
        let uploadResponse;

        if (isTeacher) {
          uploadResponse = await uploadPersonnelDocuments();

          console.log('Personnel documents upload response:', uploadResponse);
        } else {
          uploadResponse = await uploadStudentDocuments();

          console.log('Student documents upload response:', uploadResponse);
        }
      }

      // Clear newly selected local files.
      setSelectedPhoto(null);
      setDocumentFiles({});

      // Reload latest profile/documents from server.
      await loadProfile();

      Alert.alert(
        'Profile saved',
        'Your profile has been updated successfully.',
      );
    } catch (error) {
      console.log('Save profile error:', error);

      Alert.alert(
        'Save failed',
        error?.message || 'Could not save your profile.',
      );
    } finally {
      setSaving(false);
    }
  }

  function handleDateOfBirthChange(event, selectedDate) {
    if (Platform.OS === 'android') {
      setShowDateOfBirthPicker(false);
    }

    if (event?.type === 'dismissed' || !selectedDate) {
      return;
    }

    setDateOfBirth(formatDateFromPicker(selectedDate));
  }

  function hasPendingDocumentUploads() {
    return Boolean(
      selectedPhoto?.uri ||
        Object.values(documentFiles).some(file => file?.uri),
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.screenContent,
        {
          paddingBottom: Math.max(insets.bottom, 24),
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() =>
            loadProfile({
              refresh: true,
            })
          }
          tintColor="#67D1F0"
        />
      }
    >
      {!isAdminUser ? (
        <View style={styles.profileHero}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              {selectedPhoto?.uri ? (
                <Image
                  source={{
                    uri: selectedPhoto.uri,
                  }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : existingPhotoUrl ? (
                <Image
                  source={{
                    uri: existingPhotoUrl,
                  }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarText}>{initials || 'S'}</Text>
              )}
            </View>

            <Pressable
              onPress={choosePhoto}
              hitSlop={8}
              style={({ pressed }) => [
                styles.avatarCameraButton,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.avatarCameraIcon}>📷</Text>
            </Pressable>
          </View>

          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{name || 'Student'}</Text>

            <Text style={styles.heroEmail}>
              {email || 'Email not provided'}
            </Text>

            <View style={styles.heroBadges}>
              {classText ? (
                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>{classText}</Text>
                </View>
              ) : null}

              {rollNo ? (
                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>Roll {rollNo}</Text>
                </View>
              ) : null}

              {status ? (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{status}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      ) : null}

      {isAdminUser ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Professional Information</Text>

          <Text style={styles.sectionSubtitle}>
            Keep your professional and contact information up to date.
          </Text>

          <Field
            label="Full Name"
            required
            value={name}
            onChangeText={setName}
            placeholder="Full name"
          />

          <Field
            label="Last name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
          />

          <Field
            label="Address line 1"
            value={addressLine1}
            onChangeText={setAddressLine1}
            placeholder="Address line 1"
          />

          <Field
            label="Address line 2"
            value={addressLine2}
            onChangeText={setAddressLine2}
            placeholder="Address line 2"
          />

          <Field
            label="City"
            value={city}
            onChangeText={setCity}
            placeholder="City"
          />

          <Field
            label="State / Province"
            value={stateProvince}
            onChangeText={setStateProvince}
            placeholder="State / Province"
          />

          <Field
            label="Postal code"
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder="Postal code"
            keyboardType="number-pad"
          />
        </View>
      ) : (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <Text style={styles.sectionSubtitle}>
            Keep your basic information up to date.
          </Text>

          <Field
            label="Full Name"
            required
            value={name}
            onChangeText={setName}
            placeholder="Full name"
          />

          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            keyboardType="email-address"
          />

          {isStudent ? (
            <>
              <Field
                label="Student ID"
                value={studentId}
                onChangeText={setStudentId}
                placeholder="Student ID"
              />

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>
                  Date of Birth
                  <Text style={styles.optionalLabel}> (optional)</Text>
                </Text>

                <Pressable
                  onPress={() => setShowDateOfBirthPicker(true)}
                  style={({ pressed }) => [
                    styles.datePickerField,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.datePickerText,
                      !dateOfBirth && styles.datePickerPlaceholder,
                    ]}
                  >
                    {dateOfBirth || 'DD-MM-YYYY'}
                  </Text>

                  <Text style={styles.calendarIcon}>📅</Text>
                </Pressable>

                {showDateOfBirthPicker ? (
                  <DateTimePicker
                    value={parseDisplayDate(dateOfBirth)}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                    maximumDate={new Date()}
                    onChange={handleDateOfBirthChange}
                  />
                ) : null}

                {Platform.OS === 'ios' && showDateOfBirthPicker ? (
                  <Pressable
                    onPress={() => setShowDateOfBirthPicker(false)}
                    style={styles.datePickerDoneButton}
                  >
                    <Text style={styles.datePickerDoneText}>Done</Text>
                  </Pressable>
                ) : null}
              </View>

              <Field
                label="Roll Number"
                value={rollNo}
                onChangeText={setRollNo}
                placeholder="Roll number"
              />

              <Field
                label="Status"
                value={status}
                onChangeText={setStatus}
                editable={false}
                placeholder="Status"
              />
            </>
          ) : null}
        </View>
      )}

      {isTeacher ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Professional Information</Text>

          <Text style={styles.sectionSubtitle}>
            Keep your professional and contact information up to date.
          </Text>

          <Field
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            keyboardType="phone-pad"
          />

          <Field
            label="Address line 1"
            value={addressLine1}
            onChangeText={setAddressLine1}
            placeholder="Address line 1"
          />

          <Field
            label="Address line 2"
            value={addressLine2}
            onChangeText={setAddressLine2}
            placeholder="Address line 2"
          />

          <Field
            label="City"
            value={city}
            onChangeText={setCity}
            placeholder="City"
          />

          <Field
            label="State / Province"
            value={stateProvince}
            onChangeText={setStateProvince}
            placeholder="State / Province"
          />

          <Field
            label="Postal code"
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder="Postal code"
            keyboardType="number-pad"
          />

          <Field
            label="Department"
            value={department}
            onChangeText={setDepartment}
            placeholder="Department"
          />

          <Field
            label="Designation"
            value={designation}
            onChangeText={setDesignation}
            placeholder="Designation"
          />

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Bio</Text>

            <TextInput
              value={bio}
              onChangeText={setBio}
              multiline
              textAlignVertical="top"
              placeholder="Enter professional bio"
              placeholderTextColor="#64748B"
              style={[styles.input, styles.bioInput]}
            />
          </View>
        </View>
      ) : null}

      {isStudent ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <Field
            label="Phone"
            value={phone}
            onChangeText={value => {
              setPhone(value);

              if (whatsappSameAsPhone) {
                setWhatsapp(value);
              }
            }}
            placeholder="Phone number"
            keyboardType="phone-pad"
          />

          <Field
            label="WhatsApp"
            value={whatsapp}
            onChangeText={setWhatsapp}
            placeholder="WhatsApp number"
            keyboardType="phone-pad"
            editable={!whatsappSameAsPhone}
          />

          <Pressable
            onPress={toggleWhatsAppSameAsPhone}
            style={styles.checkboxRow}
          >
            <View
              style={[
                styles.checkbox,

                whatsappSameAsPhone && styles.checkboxSelected,
              ]}
            >
              {whatsappSameAsPhone ? (
                <Text style={styles.checkboxCheck}>✓</Text>
              ) : null}
            </View>

            <Text style={styles.checkboxLabel}>Same as Phone</Text>
          </Pressable>
        </View>
      ) : null}

      {isStudent || isTeacher ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {isTeacher ? 'Personnel Documents' : 'Student Documents'}
          </Text>

          <Text style={styles.sectionSubtitle}>
            {isTeacher
              ? 'Upload or replace your personnel documents.'
              : 'Upload or replace the required supporting documents.'}
          </Text>

          {isTeacher
            ? teacherPersonnelDocuments.map(document => (
                <DocumentPickerCard
                  key={document.id}
                  title={document.name}
                  required={Boolean(document.mandatory)}
                  existingPath={document.existingPath}
                  file={documentFiles[document.id]}
                  onPress={() => chooseDocument(document.id)}
                  onRemove={() => removeDocument(document.id)}
                />
              ))
            : requirements
                .filter(item => item?.id !== 'student_photo')
                .map(requirement => (
                  <DocumentPickerCard
                    key={requirement.id}
                    title={requirement.name}
                    required={Boolean(requirement.mandatory)}
                    existingPath={existingDocuments[requirement.id]}
                    file={documentFiles[requirement.id]}
                    onPress={() => chooseDocument(requirement.id)}
                    onRemove={() => removeDocument(requirement.id)}
                  />
                ))}

          {!isTeacher ? (
            <DocumentPickerCard
              title="Other supporting documents"
              required={false}
              file={documentFiles.other_supporting_documents}
              onPress={() => chooseDocument('other_supporting_documents')}
              onRemove={() => removeDocument('other_supporting_documents')}
            />
          ) : null}

          <Text style={styles.fileNote}>
            PDF, JPG, JPEG, PNG or WebP. Maximum 5 MB per file.
          </Text>
        </View>
      ) : null}

      <Pressable
        onPress={saveProfile}
        disabled={saving}
        style={({ pressed }) => [
          styles.saveButton,

          saving && styles.controlDisabled,

          pressed && !saving && styles.controlPressed,
        ]}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.saveButtonText}>Save Profile</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
