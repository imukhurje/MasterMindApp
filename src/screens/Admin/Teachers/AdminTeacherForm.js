import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';
import styles from './AdminTeacherForm.styles';
import {
  pick,
  types,
  errorCodes,
  isErrorWithCode,
} from '@react-native-documents/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function normalizeClass(item) {
  return {
    id: Number(item?.id),

    name: String(item?.name || ''),

    section: String(item?.section || ''),

    label: String(
      item?.label ||
        (item?.section ? `${item?.name} (${item?.section})` : item?.name) ||
        'Unnamed class',
    ),
  };
}

function normalizeCourse(item) {
  return {
    id: Number(item?.id),

    label: String(item?.label || item?.title || 'Untitled course'),
  };
}

function MultiSelectModal({
  visible,
  title,
  placeholder,
  options,
  selectedIds,
  onChange,
  onClose,
}) {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (!visible) {
      setSearchText('');
    }
  }, [visible]);

  const filteredOptions = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return options;
    }

    return options.filter(item =>
      String(item?.label || '')
        .toLowerCase()
        .includes(query),
    );
  }, [options, searchText]);

  function toggleOption(itemId) {
    const id = Number(itemId);

    if (!Number.isFinite(id)) {
      return;
    }

    const next = new Set(selectedIds);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    onChange(next);
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />

        <View style={styles.multiSelectModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.modalCloseIcon,

                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.modalCloseIconText}>×</Text>
            </Pressable>
          </View>

          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={placeholder}
            placeholderTextColor="#64748B"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.modalSearchInput}
          />

          <FlatList
            data={filteredOptions}
            keyExtractor={item => String(item.id)}
            keyboardShouldPersistTaps="handled"
            style={styles.modalList}
            contentContainerStyle={styles.modalListContent}
            ListEmptyComponent={
              <View style={styles.modalEmpty}>
                <Text style={styles.modalEmptyText}>No options found.</Text>
              </View>
            }
            renderItem={({ item }) => {
              const selected = selectedIds.has(item.id);

              return (
                <Pressable
                  onPress={() => toggleOption(item.id)}
                  style={({ pressed }) => [
                    styles.optionRow,

                    selected && styles.optionRowSelected,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.checkbox,

                      selected && styles.checkboxSelected,
                    ]}
                  >
                    {selected ? (
                      <Text style={styles.checkboxText}>✓</Text>
                    ) : null}
                  </View>

                  <Text numberOfLines={2} style={styles.optionText}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            }}
          />

          <View style={styles.modalFooter}>
            <Text style={styles.selectedCountText}>
              {selectedIds.size} selected
            </Text>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.doneButton,

                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SelectedItems({ items, selectedIds, onRemove }) {
  const selectedItems = items.filter(item => selectedIds.has(item.id));

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.selectedItemsWrap}>
      {selectedItems.map(item => (
        <View key={String(item.id)} style={styles.selectedChip}>
          <Text numberOfLines={1} style={styles.selectedChipText}>
            {item.label}
          </Text>

          <Pressable onPress={() => onRemove(item.id)} hitSlop={8}>
            <Text style={styles.selectedChipRemove}>×</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

export default function AdminTeacherForm({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const mode = route?.params?.mode === 'edit' ? 'edit' : 'add';

  const existingTeacher = route?.params?.teacher || null;

  const isEdit = mode === 'edit';

  const [classes, setClasses] = useState([]);

  const [courses, setCourses] = useState([]);

  const [fullName, setFullName] = useState(
    isEdit ? String(existingTeacher?.name || '') : '',
  );

  const [email, setEmail] = useState(
    isEdit ? String(existingTeacher?.email || '') : '',
  );

  const [addressLine1, setAddressLine1] = useState(
    String(existingTeacher?.address_line1 ?? ''),
  );

  const [addressLine2, setAddressLine2] = useState(
    String(existingTeacher?.address_line2 ?? ''),
  );

  const [city, setCity] = useState(String(existingTeacher?.city ?? ''));

  const [stateProvince, setStateProvince] = useState(
    String(existingTeacher?.state ?? ''),
  );

  const [postalCode, setPostalCode] = useState(
    String(existingTeacher?.postal_code ?? ''),
  );

  const [department, setDepartment] = useState(
    isEdit ? String(existingTeacher?.department || '') : '',
  );

  const [designation, setDesignation] = useState(
    isEdit ? String(existingTeacher?.designation || '') : '',
  );

  const [phone, setPhone] = useState(
    isEdit ? String(existingTeacher?.phone || '') : '',
  );

  const [bio, setBio] = useState(
    isEdit ? String(existingTeacher?.bio || '') : '',
  );

  const [selectedClassIds, setSelectedClassIds] = useState(() => {
    const ids = new Set();

    if (isEdit) {
      const rows = Array.isArray(existingTeacher?.classGroups)
        ? existingTeacher.classGroups
        : Array.isArray(existingTeacher?.class_groups)
        ? existingTeacher.class_groups
        : [];

      rows.forEach(item => {
        const id = Number(item?.id);

        if (Number.isFinite(id)) {
          ids.add(id);
        }
      });
    }

    return ids;
  });

  const [selectedCourseIds, setSelectedCourseIds] = useState(() => {
    const ids = new Set();

    if (isEdit) {
      const rows = Array.isArray(existingTeacher?.courses)
        ? existingTeacher.courses
        : [];

      rows.forEach(item => {
        const id = Number(item?.id);

        if (Number.isFinite(id)) {
          ids.add(id);
        }
      });
    }

    return ids;
  });

  const [classModalVisible, setClassModalVisible] = useState(false);

  const [courseModalVisible, setCourseModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [savingDraft, setSavingDraft] = useState(false);

  const [documentDefinitions, setDocumentDefinitions] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState({});
  const [existingDocuments, setExistingDocuments] = useState({});
  const [existingDocumentsLoading, setExistingDocumentsLoading] =
    useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [pickingDocumentId, setPickingDocumentId] = useState(null);
  const [createdDraftUserId, setCreatedDraftUserId] = useState(null);

  const loadOptions = useCallback(async () => {
    try {
      setLoading(true);

      const [classResponse, courseResponse, documentResponse] =
        await Promise.all([
          api('/api/teachers/class-groups?q='),
          api('/api/teachers/courses?q='),
          api('/api/settings/v1/personnel-documents'),
        ]);

      if (!Array.isArray(documentResponse?.items)) {
        throw new Error('Invalid personnel documents response.');
      }

      setDocumentDefinitions(
        documentResponse.items
          .filter(item => item?.id && item?.name)
          .map(item => ({
            id: String(item.id),
            name: String(item.name),
            mandatory: item.mandatory === true,
          })),
      );

      setClasses(
        (Array.isArray(classResponse?.classes) ? classResponse.classes : [])
          .map(normalizeClass)
          .filter(item => Number.isFinite(item.id)),
      );

      setCourses(
        (Array.isArray(courseResponse?.courses) ? courseResponse.courses : [])
          .map(normalizeCourse)
          .filter(item => Number.isFinite(item.id)),
      );

      navigation.setOptions({
        title: isEdit ? 'Edit Teacher' : 'Add Teacher',
      });
    } catch (error) {
      console.log('Teacher form options error:', error);

      Alert.alert(
        isEdit ? 'Edit Teacher' : 'Add Teacher',
        error?.message || 'Could not load teacher form options.',
      );
    } finally {
      setLoading(false);
    }
  }, [isEdit, navigation]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  useEffect(() => {
    if (!isEdit) return;

    const userId = Number(existingTeacher?.userId ?? existingTeacher?.user_id);

    if (Number.isInteger(userId) && userId > 0) {
      loadExistingTeacherDocuments(userId);
    }
  }, [isEdit, existingTeacher?.userId, existingTeacher?.user_id]);

  function removeClass(classId) {
    setSelectedClassIds(current => {
      const next = new Set(current);

      next.delete(Number(classId));

      return next;
    });
  }

  function removeCourse(courseId) {
    setSelectedCourseIds(current => {
      const next = new Set(current);

      next.delete(Number(courseId));

      return next;
    });
  }

  const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

  const DOCUMENT_MIME_TYPES = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
  };

  async function chooseTeacherDocument(documentId) {
    if (saving || pickingDocumentId) return;

    try {
      setPickingDocumentId(documentId);

      const files = await pick({
        type: [types.pdf, types.images],
        allowMultiSelection: false,
      });

      const file = files?.[0];

      if (!file?.uri) return;

      const name = String(file.name || '');
      const extension = name.split('.').pop()?.toLowerCase();

      const expectedType = DOCUMENT_MIME_TYPES[extension];

      if (!expectedType) {
        Alert.alert('Unsupported File', 'Select a PDF, JPG, PNG or WebP file.');
        return;
      }

      if (
        file.type &&
        file.type !== expectedType &&
        file.type !== 'application/octet-stream'
      ) {
        Alert.alert(
          'Invalid File',
          'File type does not match the selected file extension.',
        );
        return;
      }

      const size = Number(file.size);

      if (!Number.isFinite(size) || size < 0) {
        Alert.alert(
          'File Size Unknown',
          'Unable to verify the file size. Please select another file.',
        );
        return;
      }

      if (size > MAX_DOCUMENT_SIZE) {
        Alert.alert('File Too Large', 'Maximum file size is 10 MB.');
        return;
      }

      setSelectedDocuments(previous => ({
        ...previous,
        [documentId]: {
          uri: file.uri,
          name,
          type: expectedType,
          size,
        },
      }));
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      console.log('[TEACHER DOCUMENT PICK ERROR]', {
        message: error?.message,
        code: error?.code,
      });

      Alert.alert(
        'Document Selection Failed',
        error?.message || 'Could not select document.',
      );
    } finally {
      setPickingDocumentId(null);
    }
  }

  function removeTeacherDocument(documentId) {
    setSelectedDocuments(previous => {
      const next = { ...previous };
      delete next[documentId];
      return next;
    });
  }

  const loadExistingTeacherDocuments = async userId => {
    if (!Number.isInteger(Number(userId)) || Number(userId) <= 0) {
      return;
    }

    try {
      setExistingDocumentsLoading(true);

      const response = await api(
        `/api/personnel/${encodeURIComponent(userId)}/documents`,
        { method: 'GET' },
      );

      const rows = Array.isArray(response?.items) ? response.items : [];

      const documentsMap = {};

      rows.forEach(item => {
        if (!item?.id) return;

        documentsMap[String(item.id)] = {
          id: String(item.id),
          name: String(item.name || ''),
          mandatory: item.mandatory === true,

          document: item.document
            ? {
                id: item.document.id,
                name: String(item.document.name || ''),
                size: Number(item.document.size_bytes ?? 0),
                url: String(item.document.url || ''),
              }
            : null,
        };
      });

      setExistingDocuments(documentsMap);
    } catch (error) {
      console.log('[TEACHER DOCUMENTS LOAD ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      Alert.alert(
        'Teacher Documents',
        error?.message || 'Could not load existing documents.',
      );
    } finally {
      setExistingDocumentsLoading(false);
    }
  };

  function validateForm() {
    if (!isEdit) {
      if (!fullName.trim()) {
        Alert.alert('Full Name required', 'Please enter the teacher name.');

        return false;
      }

      if (!email.trim()) {
        Alert.alert('Email required', 'Please enter the teacher email.');

        return false;
      }

      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

      if (!validEmail) {
        Alert.alert('Invalid email', 'Please enter a valid email address.');

        return false;
      }
    }

    return true;
  }

  async function uploadTeacherDocuments(userId, draft = false) {
    const documentEntries = Object.entries(selectedDocuments).filter(
      ([, file]) => file?.uri,
    );

    if (documentEntries.length === 0) {
      return;
    }

    const formData = new FormData();

    documentEntries.forEach(([documentId, file]) => {
      formData.append(documentId, {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    });

    if (draft) {
      formData.append('draft', '1');
    }

    const response = await api(
      `/api/personnel/${encodeURIComponent(userId)}/documents`,
      {
        method: 'POST',
        body: formData,
        // Do not set Content-Type manually.
        // React Native must generate the multipart boundary.
      },
    );

    if (!Array.isArray(response?.items)) {
      throw new Error('The server did not confirm the document upload.');
    }

    // Confirm each selected document was returned.
    const uploadedIds = new Set(
      response.items
        .filter(item => item?.document?.id)
        .map(item => String(item.id)),
    );

    const missingIds = documentEntries
      .map(([documentId]) => documentId)
      .filter(documentId => !uploadedIds.has(documentId));

    if (missingIds.length > 0) {
      throw new Error(
        `Document upload could not be confirmed for: ${missingIds.join(', ')}`,
      );
    }
  }

  async function handleSaveDraft() {
    if (saving || savingDraft || isEdit) return;

    // Validate before creating a new teacher.
    // If a draft was already created, allow document-upload retry.
    if (!createdDraftUserId && !validateForm()) {
      return;
    }

    let userId = createdDraftUserId;
    let profileCreated = Boolean(userId);

    try {
      setSavingDraft(true);

      if (!userId) {
        const payload = {
          department: department.trim() || null,
          designation: designation.trim() || null,
          phone: phone.trim() || null,
          bio: bio.trim() || null,

          address_line1: addressLine1.trim() || null,
          address_line2: addressLine2.trim() || null,
          city: city.trim() || null,
          state: stateProvince.trim() || null,
          postal_code: postalCode.trim() || null,

          class_group_ids: Array.from(selectedClassIds),
          course_ids: Array.from(selectedCourseIds),

          name: fullName.trim(),
          email: email.trim(),
          draft: true,
        };

        const response = await api('/api/teachers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response?.ok !== true) {
          throw new Error('Could not create teacher draft.');
        }

        userId = Number(response.user_id);
        const profileId = Number(response.profile_id);

        if (
          !Number.isInteger(userId) ||
          userId <= 0 ||
          !Number.isInteger(profileId) ||
          profileId <= 0
        ) {
          throw new Error(
            'Teacher draft was created, but the server returned invalid identifiers. Please check the Teachers list before retrying.',
          );
        }

        profileCreated = true;

        // Preserve user_id for an upload retry.
        setCreatedDraftUserId(userId);
      }

      // Upload selected documents to the newly created user.
      await uploadTeacherDocuments(userId, true);

      setCreatedDraftUserId(null);

      Alert.alert('Draft Saved', 'Teacher draft saved successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log('[SAVE TEACHER DRAFT ERROR]', {
        message: error?.message,
        status: error?.status,
      });

      Alert.alert(
        'Save Draft Failed',
        profileCreated
          ? `The teacher draft was created, but document upload was not completed.\n\n${
              error?.message || 'Please try again.'
            }`
          : error?.message || 'Could not save teacher draft.',
      );
    } finally {
      setSavingDraft(false);
    }
  }

  async function submitTeacher() {
    if (saving || savingDraft) return;

    if (!isEdit && createdDraftUserId) {
      Alert.alert(
        'Teacher Already Created',
        'A draft teacher already exists. Complete the draft upload before creating another teacher.',
      );
      return;
    }

    if (!validateForm()) return;

    const commonPayload = {
      department: department.trim() || null,
      designation: designation.trim() || null,
      phone: phone.trim() || null,
      bio: bio.trim() || null,

      address_line1: addressLine1.trim() || null,
      address_line2: addressLine2.trim() || null,
      city: city.trim() || null,
      state: stateProvince.trim() || null,
      postal_code: postalCode.trim() || null,

      class_group_ids: Array.from(selectedClassIds),
      course_ids: Array.from(selectedCourseIds),
    };

    // Ensure required documents are selected before creating.
    // For Edit, an existing uploaded document is acceptable.
    const missingDocuments = documentDefinitions.filter(
      item =>
        item.mandatory &&
        !selectedDocuments[item.id]?.uri &&
        !(isEdit && existingDocuments[item.id]?.document?.id),
    );

    if (missingDocuments.length > 0) {
      Alert.alert(
        'Documents Required',
        `Please select: ${missingDocuments.map(item => item.name).join(', ')}`,
      );
      return;
    }

    let teacherSaved = false;
    let documentUserId = null;

    try {
      setSaving(true);

      if (isEdit) {
        const teacherId = Number(existingTeacher?.id);

        if (!Number.isInteger(teacherId) || teacherId <= 0) {
          throw new Error('Teacher profile ID is missing.');
        }

        const response = await api(`/api/teachers/${teacherId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commonPayload),
        });

        if (response?.ok !== true) {
          throw new Error('Could not update the teacher.');
        }

        teacherSaved = true;

        documentUserId = Number(
          existingTeacher?.userId ?? existingTeacher?.user_id,
        );
      } else {
        const payload = {
          ...commonPayload,
          name: fullName.trim(),
          email: email.trim(),
        };

        // Step 1: Create Teacher
        const response = await api('/api/teachers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response?.ok !== true) {
          throw new Error('Could not create the teacher.');
        }

        teacherSaved = true;

        documentUserId = Number(response.user_id);

        if (!Number.isInteger(documentUserId) || documentUserId <= 0) {
          throw new Error(
            'Teacher was created, but no valid user_id was returned. Check the Teachers list before retrying.',
          );
        }

        // Store ID so a failed upload does not create duplicates.
        setCreatedDraftUserId(documentUserId);
      }

      // Step 2: Upload selected documents
      const hasNewDocuments = Object.values(selectedDocuments).some(file =>
        Boolean(file?.uri),
      );

      if (hasNewDocuments) {
        if (!Number.isInteger(documentUserId) || documentUserId <= 0) {
          throw new Error(
            'Teacher was saved, but the document user ID is missing.',
          );
        }

        await uploadTeacherDocuments(documentUserId, false);
      }

      setSelectedDocuments({});

      Alert.alert(
        isEdit ? 'Teacher Updated' : 'Teacher Created',
        isEdit
          ? 'Teacher details and selected documents saved successfully.'
          : 'Teacher and documents created successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.log('[TEACHER SAVE ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      Alert.alert(
        teacherSaved ? 'Documents Not Completed' : 'Save Failed',
        teacherSaved
          ? `Teacher details were saved, but document upload was not completed.\n\n${
              error?.message || 'Please retry uploading the documents.'
            }`
          : error?.message || 'Could not save teacher.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading teacher form...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.screenContent,

        {
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>
          {isEdit ? 'Edit Teacher' : 'Create Teacher'}
        </Text>

        <Text style={styles.fieldLabel}>Full Name</Text>

        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Jane Doe"
          placeholderTextColor="#64748B"
          editable={!saving && !isEdit}
          style={[styles.textInput, isEdit && styles.readOnlyInput]}
        />

        <Text style={styles.fieldLabel}>Email</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="jane@example.com"
          placeholderTextColor="#64748B"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!saving && !isEdit}
          style={[styles.textInput, isEdit && styles.readOnlyInput]}
        />

        {/* Email information */}
        <Text style={styles.emailHelperText}>
          This is the teacher's sign-in email. Changing it does not change their
          password.
        </Text>

        {/* Address Line 1 */}
        <Text style={styles.fieldLabel}>Address line 1</Text>

        <TextInput
          value={addressLine1}
          onChangeText={setAddressLine1}
          placeholder="Street address"
          placeholderTextColor="#64748B"
          editable={!saving}
          autoCapitalize="words"
          style={styles.textInput}
        />

        {/* Address Line 2 */}
        <Text style={styles.fieldLabel}>Address line 2 (optional)</Text>

        <TextInput
          value={addressLine2}
          onChangeText={setAddressLine2}
          placeholder="Apartment, locality, etc."
          placeholderTextColor="#64748B"
          editable={!saving}
          autoCapitalize="words"
          style={styles.textInput}
        />

        {/* City */}
        <Text style={styles.fieldLabel}>City</Text>

        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="Enter city"
          placeholderTextColor="#64748B"
          editable={!saving}
          autoCapitalize="words"
          style={styles.textInput}
        />

        {/* State / Province */}
        <Text style={styles.fieldLabel}>State / Province</Text>

        <TextInput
          value={stateProvince}
          onChangeText={setStateProvince}
          placeholder="Enter state or province"
          placeholderTextColor="#64748B"
          editable={!saving}
          autoCapitalize="words"
          style={styles.textInput}
        />

        {/* Postal Code */}
        <Text style={styles.fieldLabel}>Postal code</Text>

        <TextInput
          value={postalCode}
          onChangeText={setPostalCode}
          placeholder="Enter postal code"
          placeholderTextColor="#64748B"
          editable={!saving}
          keyboardType="default"
          autoCapitalize="characters"
          style={styles.textInput}
        />

        <Text style={styles.fieldLabel}>Department</Text>

        <TextInput
          value={department}
          onChangeText={setDepartment}
          placeholder="Mathematics"
          placeholderTextColor="#64748B"
          editable={!saving}
          style={styles.textInput}
        />

        <Text style={styles.fieldLabel}>Designation</Text>

        <TextInput
          value={designation}
          onChangeText={setDesignation}
          placeholder="Senior Teacher"
          placeholderTextColor="#64748B"
          editable={!saving}
          style={styles.textInput}
        />

        <Text style={styles.fieldLabel}>Phone</Text>

        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="+1 555 0100"
          placeholderTextColor="#64748B"
          keyboardType="phone-pad"
          editable={!saving}
          style={styles.textInput}
        />

        <Text style={styles.fieldLabel}>Assigned Classes</Text>

        <Pressable
          onPress={() => setClassModalVisible(true)}
          disabled={saving}
          style={({ pressed }) => [
            styles.multiSelectField,

            saving && styles.controlDisabled,

            pressed && !saving && styles.controlPressed,
          ]}
        >
          <Text
            style={[
              styles.multiSelectFieldText,

              selectedClassIds.size === 0 && styles.placeholderText,
            ]}
          >
            {selectedClassIds.size > 0
              ? `${selectedClassIds.size} class${
                  selectedClassIds.size === 1 ? '' : 'es'
                } selected`
              : 'Type to search classes...'}
          </Text>

          <Text style={styles.selectArrow}>⌄</Text>
        </Pressable>

        <SelectedItems
          items={classes}
          selectedIds={selectedClassIds}
          onRemove={removeClass}
        />

        <Text style={styles.fieldLabel}>Assigned Courses</Text>

        <Pressable
          onPress={() => setCourseModalVisible(true)}
          disabled={saving}
          style={({ pressed }) => [
            styles.multiSelectField,

            saving && styles.controlDisabled,

            pressed && !saving && styles.controlPressed,
          ]}
        >
          <Text
            style={[
              styles.multiSelectFieldText,

              selectedCourseIds.size === 0 && styles.placeholderText,
            ]}
          >
            {selectedCourseIds.size > 0
              ? `${selectedCourseIds.size} course${
                  selectedCourseIds.size === 1 ? '' : 's'
                } selected`
              : 'Type to search courses...'}
          </Text>

          <Text style={styles.selectArrow}>⌄</Text>
        </Pressable>

        <SelectedItems
          items={courses}
          selectedIds={selectedCourseIds}
          onRemove={removeCourse}
        />

        <Text style={styles.fieldLabel}>Bio</Text>

        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Short bio (optional)"
          placeholderTextColor="#64748B"
          editable={!saving}
          multiline
          textAlignVertical="top"
          style={[styles.textInput, styles.bioInput]}
        />

        {/* Teacher Documents */}
        <View style={styles.documentsSection}>
          <Text style={styles.documentsTitle}>Documents</Text>

          <Text style={styles.documentsDescription}>
            Upload the documents configured in Settings → Documents. Files may
            be PDF, JPG, PNG, or WebP and up to 10 MB each.
          </Text>

          {documentDefinitions.length === 0 ? (
            <Text style={styles.documentsEmptyText}>
              No document requirements configured.
            </Text>
          ) : (
            documentDefinitions.map(document => {
              const selectedFile = selectedDocuments[document.id];
              const existingFile =
                existingDocuments[document.id]?.document || null;

              const picking = pickingDocumentId === document.id;

              return (
                <View key={document.id} style={styles.documentField}>
                  <Text style={styles.documentLabel}>
                    {document.name}
                    {document.mandatory ? ' *' : ''}
                  </Text>

                  <Pressable
                    onPress={() => chooseTeacherDocument(document.id)}
                    disabled={saving || Boolean(pickingDocumentId)}
                    style={[
                      styles.documentPickerButton,
                      selectedFile && styles.documentPickerSelected,
                    ]}
                    accessibilityRole="button"
                  >
                    {picking ? (
                      <ActivityIndicator size="small" color="#7DD3FC" />
                    ) : (
                      <Text style={styles.documentChooseText}>Choose File</Text>
                    )}

                    {isEdit &&
                      existingDocumentsLoading &&
                      !existingFile &&
                      !selectedFile && (
                        <Text style={styles.existingDocumentLoadingText}>
                          Loading existing document...
                        </Text>
                      )}

                    <Text style={styles.documentFileName} numberOfLines={1}>
                      {selectedFile?.name ||
                        existingFile?.name ||
                        'No file chosen'}
                    </Text>
                  </Pressable>

                  {/* Existing uploaded document information */}
                  {isEdit && existingFile && !selectedFile && (
                    <View style={styles.existingDocumentInfo}>
                      <MaterialCommunityIcons
                        name="check-circle-outline"
                        size={16}
                        color="#86EFAC"
                      />

                      <Text
                        style={styles.existingDocumentText}
                        numberOfLines={2}
                      >
                        Already uploaded
                        {existingFile.size > 0
                          ? ` · ${(existingFile.size / 1024 / 1024).toFixed(
                              2,
                            )} MB`
                          : ''}
                      </Text>
                    </View>
                  )}

                  {selectedFile && (
                    <View style={styles.documentSelectedInfo}>
                      <Text style={styles.documentSelectedText}>
                        File selected
                        {' · '}
                        {(selectedFile.size / 1024 / 1024).toFixed(2)}
                        {' MB'}
                      </Text>

                      <Pressable
                        onPress={() => removeTeacherDocument(document.id)}
                        disabled={saving}
                        style={styles.documentRemoveButton}
                      >
                        <Text style={styles.documentRemoveText}>Remove</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={() => navigation.goBack()}
            disabled={saving || savingDraft}
            style={[
              styles.cancelButton,
              (saving || savingDraft) && styles.controlDisabled,
            ]}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

          {!isEdit && (
            <Pressable
              onPress={handleSaveDraft}
              disabled={saving || savingDraft}
              style={[
                styles.draftButton,
                (saving || savingDraft) && styles.controlDisabled,
              ]}
            >
              {savingDraft ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.draftButtonText}>Save Draft</Text>
              )}
            </Pressable>
          )}

          <Pressable
            onPress={submitTeacher}
            disabled={saving || savingDraft || Boolean(createdDraftUserId)}
            style={[
              styles.saveButton,
              (saving || savingDraft || Boolean(createdDraftUserId)) &&
                styles.controlDisabled,
            ]}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEdit ? 'Save' : 'Create'}
              </Text>
            )}
          </Pressable>
        </View>
      </View>

      <MultiSelectModal
        visible={classModalVisible}
        title="Assigned Classes"
        placeholder="Search classes..."
        options={classes}
        selectedIds={selectedClassIds}
        onChange={setSelectedClassIds}
        onClose={() => setClassModalVisible(false)}
      />

      <MultiSelectModal
        visible={courseModalVisible}
        title="Assigned Courses"
        placeholder="Search courses..."
        options={courses}
        selectedIds={selectedCourseIds}
        onChange={setSelectedCourseIds}
        onClose={() => setCourseModalVisible(false)}
      />
    </ScrollView>
  );
}
