// src/screens/Admin/Staff/AdminStaffs.js

import React, { useCallback, useMemo, useRef, useState } from 'react';

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
  TextInput,
  View,
  Image,
} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';

import ReactNativeBlobUtil from 'react-native-blob-util';

import { pick, types } from '@react-native-documents/picker';

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api, absoluteUrl, getToken } from '../../../api/client';

import styles from './AdminStaffs.styles';

const PER_PAGE = 20;

function getInitials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'ST';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function AdminStaffs({ navigation }) {
  const insets = useSafeAreaInsets();

  const searchRef = useRef('');

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [searching, setSearching] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [me, setMe] = useState(null);

  const [onboarding, setOnboarding] = useState(null);

  const [staffs, setStaffs] = useState([]);

  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const [createStaffModalVisible, setCreateStaffModalVisible] = useState(false);

  const [personnelDocumentsLoading, setPersonnelDocumentsLoading] =
    useState(false);

  const [personnelDocumentRequirements, setPersonnelDocumentRequirements] =
    useState([]);

  const [selectedPersonnelDocuments, setSelectedPersonnelDocuments] = useState(
    {},
  );

  const [creatingStaff, setCreatingStaff] = useState(false);

  const [newStaffName, setNewStaffName] = useState('');

  const [newStaffEmail, setNewStaffEmail] = useState('');

  const [newStaffAddressLine1, setNewStaffAddressLine1] = useState('');

  const [newStaffAddressLine2, setNewStaffAddressLine2] = useState('');

  const [newStaffCity, setNewStaffCity] = useState('');

  const [newStaffState, setNewStaffState] = useState('');

  const [newStaffPostalCode, setNewStaffPostalCode] = useState('');

  const [newStaffPhone, setNewStaffPhone] = useState('');

  const [newStaffDesignation, setNewStaffDesignation] = useState('');

  const [editStaffModalVisible, setEditStaffModalVisible] = useState(false);

  const [editingStaff, setEditingStaff] = useState(null);

  const [savingStaff, setSavingStaff] = useState(false);

  const [editDocumentsLoading, setEditDocumentsLoading] = useState(false);

  const [editDocumentRequirements, setEditDocumentRequirements] = useState([]);

  const [selectedEditDocuments, setSelectedEditDocuments] = useState({});

  const [editStaffName, setEditStaffName] = useState('');

  const [editStaffEmail, setEditStaffEmail] = useState('');

  const [editStaffAddressLine1, setEditStaffAddressLine1] = useState('');

  const [editStaffAddressLine2, setEditStaffAddressLine2] = useState('');

  const [editStaffCity, setEditStaffCity] = useState('');

  const [editStaffState, setEditStaffState] = useState('');

  const [editStaffPostalCode, setEditStaffPostalCode] = useState('');

  const [editStaffPhone, setEditStaffPhone] = useState('');

  const [editStaffDesignation, setEditStaffDesignation] = useState('');

  const [staffCredentialsModalVisible, setStaffCredentialsModalVisible] =
    useState(false);

  const [staffCredentialsLoading, setStaffCredentialsLoading] = useState(false);

  const [staffCredentialsSaving, setStaffCredentialsSaving] = useState(false);

  const [staffCredentialRows, setStaffCredentialRows] = useState([]);

  const [credentialsMessageModalVisible, setCredentialsMessageModalVisible] =
    useState(false);

  const [credentialsMessageLoading, setCredentialsMessageLoading] =
    useState(false);

  const [credentialsMessageData, setCredentialsMessageData] = useState(null);

  const [sendingCredentialsEmail, setSendingCredentialsEmail] = useState(false);

  const [deletingStaffId, setDeletingStaffId] = useState(null);

  const [downloadingData, setDownloadingData] = useState(false);

  const [identityModalVisible, setIdentityModalVisible] = useState(false);

  const [identityLoading, setIdentityLoading] = useState(false);

  const [identityRows, setIdentityRows] = useState([]);

  const [identitySelectedIds, setIdentitySelectedIds] = useState(
    () => new Set(),
  );

  const [identitySearch, setIdentitySearch] = useState('');

  const [identityPage, setIdentityPage] = useState(1);

  const [identityLastPage, setIdentityLastPage] = useState(1);

  const [identityTotal, setIdentityTotal] = useState(0);

  const [downloadingIdentityCards, setDownloadingIdentityCards] =
    useState(false);

  const loadStaffs = useCallback(
    async ({ requestedPage = 1, query = '', append = false } = {}) => {
      const response = await api(
        `/api/staffs?q=${encodeURIComponent(query)}&page=${encodeURIComponent(
          requestedPage,
        )}&per_page=${PER_PAGE}`,
      );

      const rows = Array.isArray(response?.data) ? response.data : [];

      if (append) {
        setStaffs(current => {
          const map = new Map();

          current.forEach(item => {
            map.set(Number(item?.id), item);
          });

          rows.forEach(item => {
            map.set(Number(item?.id), item);
          });

          return Array.from(map.values());
        });
      } else {
        setStaffs(rows);
      }

      const responseMeta = response?.meta || {};

      setPage(Number(responseMeta?.current_page) || requestedPage);

      setLastPage(Number(responseMeta?.last_page) || 1);

      setTotalCount(Number(responseMeta?.total) || rows.length);
    },
    [],
  );

  const loadScreen = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [meResponse, onboardingResponse] = await Promise.all([
          api('/api/me'),

          api('/api/settings/v1/onboarding'),
        ]);

        const role = String(
          meResponse?.primary_role ||
            meResponse?.role ||
            meResponse?.actual_primary_role ||
            meResponse?.actual_role ||
            '',
        )
          .trim()
          .toLowerCase();

        const hasAccess =
          meResponse?.is_admin === true ||
          meResponse?.is_super_admin === true ||
          role === 'admin' ||
          role === 'super_admin';

        if (!hasAccess) {
          Alert.alert(
            'Access denied',
            'Only administrators can manage staff.',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ],
          );

          return;
        }

        setMe(meResponse || null);

        setOnboarding(onboardingResponse || null);

        await loadStaffs({
          requestedPage: 1,
          query: searchRef.current,
          append: false,
        });
      } catch (error) {
        console.log('Admin staffs load error:', error);

        Alert.alert('Staff', error?.message || 'Could not load staff.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigation, loadStaffs],
  );

  useFocusEffect(
    useCallback(() => {
      loadScreen();

      return undefined;
    }, [loadScreen]),
  );

  const handleSearchChange = useCallback(value => {
    setSearch(value);

    searchRef.current = value;
  }, []);

  const handleSearch = useCallback(async () => {
    try {
      setSearching(true);

      const query = String(search || '').trim();

      searchRef.current = query;

      await loadStaffs({
        requestedPage: 1,
        query,
        append: false,
      });
    } catch (error) {
      console.log('Staff search error:', error);

      Alert.alert('Staff', error?.message || 'Could not search staff.');
    } finally {
      setSearching(false);
    }
  }, [search, loadStaffs]);

  const handleClearSearch = useCallback(async () => {
    try {
      setSearch('');

      searchRef.current = '';

      setSearching(true);

      await loadStaffs({
        requestedPage: 1,
        query: '',
        append: false,
      });
    } catch (error) {
      console.log('Clear staff search error:', error);
    } finally {
      setSearching(false);
    }
  }, [loadStaffs]);

  const loadNextPage = useCallback(async () => {
    if (loadingMore || page >= lastPage) {
      return;
    }

    try {
      setLoadingMore(true);

      await loadStaffs({
        requestedPage: page + 1,

        query: searchRef.current,

        append: true,
      });
    } catch (error) {
      console.log('Load more staff error:', error);

      Alert.alert('Staff', error?.message || 'Could not load more staff.');
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, page, lastPage, loadStaffs]);

  const downloadProtectedFile = useCallback(
    async ({ path, fileName, mimeType }) => {
      let tempPath = null;

      try {
        const token = await getToken();

        const url = absoluteUrl(path);

        const headers = {
          Accept: mimeType,
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const extension =
          String(fileName || '')
            .split('.')
            .pop() || 'bin';

        const response = await ReactNativeBlobUtil.config({
          fileCache: true,
          appendExt: extension,
        }).fetch('GET', url, headers);

        const info = response.info();

        const status = Number(info?.status);

        if (!Number.isFinite(status) || status < 200 || status >= 300) {
          throw new Error(`Download failed with HTTP ${status || 'unknown'}.`);
        }

        tempPath = response.path();

        if (!tempPath) {
          throw new Error('Downloaded file path was not returned.');
        }

        if (Platform.OS === 'android') {
          const savedUri =
            await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
              {
                name: fileName,

                parentFolder: 'Staff',

                mimeType,
              },
              'Download',
              tempPath,
            );

          console.log('Downloaded file:', savedUri);

          return {
            location: 'Downloads/Staff',
          };
        }

        const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

        await ReactNativeBlobUtil.fs.cp(tempPath, destination);

        return {
          location: destination,
        };
      } finally {
        if (tempPath) {
          try {
            const exists = await ReactNativeBlobUtil.fs.exists(tempPath);

            if (exists) {
              await ReactNativeBlobUtil.fs.unlink(tempPath);
            }
          } catch (error) {
            console.log('Temporary download cleanup error:', error);
          }
        }
      }
    },
    [],
  );

  const handleIdentityCards = useCallback(async () => {
    setIdentitySearch('');

    setIdentityRows([]);

    setIdentitySelectedIds(new Set());

    setIdentityModalVisible(true);

    await loadIdentityCandidates({
      requestedPage: 1,
      initializeSelection: true,
    });
  }, [loadIdentityCandidates]);

  const visibleIdentityRows = useMemo(() => {
    const query = String(identitySearch || '')
      .trim()
      .toLowerCase();

    if (!query) {
      return identityRows;
    }

    return identityRows.filter(
      item =>
        String(item?.name || '')
          .toLowerCase()
          .includes(query) ||
        String(item?.role || '')
          .toLowerCase()
          .includes(query),
    );
  }, [identityRows, identitySearch]);

  const allVisibleIdentitySelected =
    visibleIdentityRows.length > 0 &&
    visibleIdentityRows.every(item =>
      identitySelectedIds.has(Number(item?.id)),
    );

  const toggleIdentityCard = useCallback(userId => {
    const id = Number(userId);

    if (!Number.isFinite(id)) {
      return;
    }

    setIdentitySelectedIds(current => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const toggleAllIdentityCards = useCallback(() => {
    setIdentitySelectedIds(current => {
      const next = new Set(current);

      const allSelected =
        visibleIdentityRows.length > 0 &&
        visibleIdentityRows.every(item => next.has(Number(item?.id)));

      visibleIdentityRows.forEach(item => {
        const id = Number(item?.id);

        if (!Number.isFinite(id)) {
          return;
        }

        if (allSelected) {
          next.delete(id);
        } else {
          next.add(id);
        }
      });

      return next;
    });
  }, [visibleIdentityRows]);

  const handleDownloadIdentityCards = useCallback(async () => {
    const ids = Array.from(identitySelectedIds)
      .map(Number)
      .filter(Number.isFinite);

    if (ids.length === 0) {
      Alert.alert('Identity Cards', 'Select at least one staff member.');

      return;
    }

    if (downloadingIdentityCards) {
      return;
    }

    try {
      setDownloadingIdentityCards(true);

      const cardIds = ids.join(',');

      const result = await downloadProtectedFile({
        path: `/students/identity-cards/pdf?card_type=staff&card_ids=${encodeURIComponent(
          cardIds,
        )}`,

        fileName: 'staff-identity-cards.pdf',

        mimeType: 'application/pdf',
      });

      Alert.alert(
        'Download Complete',
        `Identity cards saved in:\n\n${result.location}`,
      );
    } catch (error) {
      console.log('Identity cards download error:', error);

      Alert.alert(
        'Identity Cards',
        error?.message || 'Could not download identity cards.',
      );
    } finally {
      setDownloadingIdentityCards(false);
    }
  }, [identitySelectedIds, downloadingIdentityCards, downloadProtectedFile]);

  const handleDownloadData = useCallback(async () => {
    if (downloadingData) {
      return;
    }

    try {
      setDownloadingData(true);

      const result = await downloadProtectedFile({
        path: '/api/staffs/download.zip',

        fileName: 'staff-data.zip',

        mimeType: 'application/zip',
      });

      Alert.alert(
        'Download Complete',
        `Staff data saved in:\n\n${result.location}`,
      );
    } catch (error) {
      console.log('Staff data download error:', error);

      Alert.alert(
        'Download Data',
        error?.message || 'Could not download staff data.',
      );
    } finally {
      setDownloadingData(false);
    }
  }, [downloadingData, downloadProtectedFile]);

  const handleGenerateCredentials = useCallback(() => {
    const userIds = staffs
      .map(item => Number(item?.id))
      .filter(Number.isFinite);

    if (userIds.length === 0) {
      Alert.alert('Generate Credentials', 'No staff members are available.');

      return;
    }

    openStaffCredentialsModal(userIds);
  }, [staffs, openStaffCredentialsModal]);

  const handleAddStaff = useCallback(async () => {
    try {
      resetCreateStaffForm();

      setCreateStaffModalVisible(true);

      setPersonnelDocumentsLoading(true);

      const response = await api('/api/settings/v1/personnel-documents');

      const items = Array.isArray(response?.items) ? response.items : [];

      setPersonnelDocumentRequirements(items);
    } catch (error) {
      console.log('Personnel document requirements error:', error);

      setCreateStaffModalVisible(false);

      Alert.alert(
        'Create Staff',
        error?.message || 'Could not load staff document requirements.',
      );
    } finally {
      setPersonnelDocumentsLoading(false);
    }
  }, [resetCreateStaffForm]);

  const handleCloseCreateStaff = useCallback(() => {
    if (creatingStaff) {
      return;
    }

    setCreateStaffModalVisible(false);

    resetCreateStaffForm();
  }, [creatingStaff, resetCreateStaffForm]);

  const handlePickPersonnelDocument = useCallback(async documentItem => {
    const documentId = String(documentItem?.id || '');

    if (!documentId) {
      return;
    }

    try {
      const result = await pick({
        type: documentId === 'photo' ? [types.images] : [types.allFiles],

        allowMultiSelection: false,
      });

      const file = Array.isArray(result) ? result[0] : result;

      if (!file) {
        return;
      }

      const fileSize = Number(file?.size) || 0;

      const maxSize = 10 * 1024 * 1024;

      if (fileSize > maxSize) {
        Alert.alert('Staff Document', 'File size must be 10 MB or smaller.');

        return;
      }

      setSelectedPersonnelDocuments(current => ({
        ...current,

        [documentId]: file,
      }));
    } catch (error) {
      const message = String(error?.message || '').toLowerCase();

      if (message.includes('cancel')) {
        return;
      }

      console.log('Staff document picker error:', error);

      Alert.alert(
        'Staff Document',
        error?.message || 'Could not select the document.',
      );
    }
  }, []);

  const handleCreateStaff = useCallback(async () => {
    const name = String(newStaffName || '').trim();

    const email = String(newStaffEmail || '').trim();

    const phone = String(newStaffPhone || '').trim();

    const designation = String(newStaffDesignation || '').trim();

    const addressLine1 = String(newStaffAddressLine1 || '').trim();

    const addressLine2 = String(newStaffAddressLine2 || '').trim();

    const city = String(newStaffCity || '').trim();

    const state = String(newStaffState || '').trim();

    const postalCode = String(newStaffPostalCode || '').trim();

    if (!name) {
      Alert.alert('Create Staff', 'Full Name is required.');

      return;
    }

    if (!email) {
      Alert.alert('Create Staff', 'Email is required.');

      return;
    }

    const missingRequiredDocument = personnelDocumentRequirements.find(
      item =>
        item?.mandatory === true && !selectedPersonnelDocuments?.[item?.id],
    );

    if (missingRequiredDocument) {
      Alert.alert(
        'Create Staff',
        `${missingRequiredDocument?.name || 'Required document'} is required.`,
      );

      return;
    }

    if (creatingStaff) {
      return;
    }

    let createdStaffId = null;

    try {
      setCreatingStaff(true);

      /*
       * Step 1: Create staff record.
       */
      const createResponse = await api('/api/staffs', {
        method: 'POST',

        body: JSON.stringify({
          name,
          email,

          phone: phone || null,

          designation: designation || null,

          address_line1: addressLine1 || null,

          address_line2: addressLine2 || null,

          city: city || null,

          state: state || null,

          postal_code: postalCode || null,
        }),
      });

      createdStaffId = Number(createResponse?.data?.id);

      if (
        createResponse?.created !== true ||
        !Number.isFinite(createdStaffId)
      ) {
        throw new Error('Staff member was not created.');
      }

      /*
       * Step 2: Upload configured personnel documents.
       */
      const documentEntries = Object.entries(selectedPersonnelDocuments).filter(
        ([, file]) => file?.uri,
      );

      if (documentEntries.length > 0) {
        const formData = new FormData();

        documentEntries.forEach(([documentId, file]) => {
          formData.append(documentId, {
            uri: file.uri,

            name: file.name || `${documentId}-${createdStaffId}`,

            type: file.type || 'application/octet-stream',
          });
        });

        await api(
          `/api/personnel/${encodeURIComponent(createdStaffId)}/documents`,
          {
            method: 'POST',

            body: formData,
          },
        );
      }

      /*
       * Step 3: Close modal and refresh staff list.
       */
      setCreateStaffModalVisible(false);

      resetCreateStaffForm();

      await loadStaffs({
        requestedPage: 1,
        query: searchRef.current,
        append: false,
      });

      Alert.alert('Staff Created', 'Staff member created successfully.');
    } catch (error) {
      console.log('Create staff error:', error);

      /*
       * Staff may already have been created if
       * document upload fails afterwards.
       */
      if (Number.isFinite(createdStaffId)) {
        setCreateStaffModalVisible(false);

        resetCreateStaffForm();

        await loadStaffs({
          requestedPage: 1,
          query: searchRef.current,
          append: false,
        });

        Alert.alert(
          'Staff Created',
          'Staff member was created, but one or more documents could not be uploaded.',
        );

        return;
      }

      Alert.alert(
        'Create Staff',
        error?.message || 'Could not create the staff member.',
      );
    } finally {
      setCreatingStaff(false);
    }
  }, [
    newStaffName,
    newStaffEmail,
    newStaffPhone,
    newStaffDesignation,
    newStaffAddressLine1,
    newStaffAddressLine2,
    newStaffCity,
    newStaffState,
    newStaffPostalCode,
    personnelDocumentRequirements,
    selectedPersonnelDocuments,
    creatingStaff,
    resetCreateStaffForm,
    loadStaffs,
  ]);

  const handleSaveStaffDraft = useCallback(async () => {
    const name = String(newStaffName || '').trim();

    const email = String(newStaffEmail || '').trim();

    const phone = String(newStaffPhone || '').trim();

    const designation = String(newStaffDesignation || '').trim();

    const addressLine1 = String(newStaffAddressLine1 || '').trim();

    const addressLine2 = String(newStaffAddressLine2 || '').trim();

    const city = String(newStaffCity || '').trim();

    const state = String(newStaffState || '').trim();

    const postalCode = String(newStaffPostalCode || '').trim();

    if (!name) {
      Alert.alert('Save Draft', 'Full Name is required.');

      return;
    }

    if (!email) {
      Alert.alert('Save Draft', 'Email is required.');

      return;
    }

    if (creatingStaff) {
      return;
    }

    let createdStaffId = null;

    try {
      setCreatingStaff(true);

      /*
       * Step 1: Create the staff record as a draft.
       */
      const createResponse = await api('/api/staffs', {
        method: 'POST',

        body: JSON.stringify({
          name,
          email,

          phone: phone || null,

          designation: designation || null,

          address_line1: addressLine1 || null,

          address_line2: addressLine2 || null,

          city: city || null,

          state: state || null,

          postal_code: postalCode || null,

          draft: true,
        }),
      });

      createdStaffId = Number(createResponse?.data?.id);

      if (
        createResponse?.created !== true ||
        !Number.isFinite(createdStaffId)
      ) {
        throw new Error('Staff draft was not created.');
      }

      /*
       * Step 2: Upload any documents selected
       * while saving the draft.
       *
       * Mandatory documents are not required
       * for Save Draft.
       */
      const documentEntries = Object.entries(selectedPersonnelDocuments).filter(
        ([, file]) => file?.uri,
      );

      if (documentEntries.length > 0) {
        const formData = new FormData();

        documentEntries.forEach(([documentId, file]) => {
          formData.append(documentId, {
            uri: file.uri,

            name: file.name || `${documentId}-${createdStaffId}`,

            type: file.type || 'application/octet-stream',
          });
        });

        /*
         * The backend uses this flag to treat
         * the document upload as a draft upload.
         */
        formData.append('draft', '1');

        await api(
          `/api/personnel/${encodeURIComponent(createdStaffId)}/documents`,
          {
            method: 'POST',

            body: formData,
          },
        );
      }

      /*
       * Step 3: Close modal and refresh.
       */
      setCreateStaffModalVisible(false);

      resetCreateStaffForm();

      await loadStaffs({
        requestedPage: 1,
        query: searchRef.current,
        append: false,
      });

      Alert.alert('Draft Saved', 'Staff draft saved successfully.');
    } catch (error) {
      console.log('Save staff draft error:', error);

      /*
       * The staff draft may already exist
       * if the document upload failed.
       */
      if (Number.isFinite(createdStaffId)) {
        setCreateStaffModalVisible(false);

        resetCreateStaffForm();

        await loadStaffs({
          requestedPage: 1,
          query: searchRef.current,
          append: false,
        });

        Alert.alert(
          'Draft Saved',
          'Staff draft was saved, but one or more documents could not be uploaded.',
        );

        return;
      }

      Alert.alert(
        'Save Draft',
        error?.message || 'Could not save the staff draft.',
      );
    } finally {
      setCreatingStaff(false);
    }
  }, [
    newStaffName,
    newStaffEmail,
    newStaffPhone,
    newStaffDesignation,
    newStaffAddressLine1,
    newStaffAddressLine2,
    newStaffCity,
    newStaffState,
    newStaffPostalCode,
    selectedPersonnelDocuments,
    creatingStaff,
    resetCreateStaffForm,
    loadStaffs,
  ]);

  const handleEditStaff = useCallback(
    async item => {
      const staffId = Number(item?.id);

      if (!Number.isFinite(staffId)) {
        Alert.alert('Edit Staff', 'A valid staff ID is required.');

        return;
      }

      setEditingStaff(item);

      setEditStaffName(String(item?.name || ''));

      setEditStaffEmail(String(item?.email || ''));

      setEditStaffAddressLine1(String(item?.address_line1 || ''));

      setEditStaffAddressLine2(String(item?.address_line2 || ''));

      setEditStaffCity(String(item?.city || ''));

      setEditStaffState(String(item?.state || ''));

      setEditStaffPostalCode(String(item?.postal_code || ''));

      setEditStaffPhone(String(item?.phone || ''));

      setEditStaffDesignation(String(item?.designation || ''));

      setSelectedEditDocuments({});
      setEditDocumentRequirements([]);

      setEditStaffModalVisible(true);

      try {
        setEditDocumentsLoading(true);

        const response = await api(
          `/api/personnel/${encodeURIComponent(staffId)}/documents`,
        );

        setEditDocumentRequirements(
          Array.isArray(response?.items) ? response.items : [],
        );
      } catch (error) {
        console.log('Load staff documents error:', error);

        setEditStaffModalVisible(false);

        resetEditStaffForm();

        Alert.alert(
          'Edit Staff',
          error?.message || 'Could not load staff documents.',
        );
      } finally {
        setEditDocumentsLoading(false);
      }
    },
    [resetEditStaffForm],
  );

  const handlePickEditDocument = useCallback(async documentItem => {
    const documentId = String(documentItem?.id || '');

    if (!documentId) {
      return;
    }

    try {
      const result = await pick({
        type: documentId === 'photo' ? [types.images] : [types.allFiles],

        allowMultiSelection: false,
      });

      const file = Array.isArray(result) ? result[0] : result;

      if (!file) {
        return;
      }

      const fileSize = Number(file?.size) || 0;

      const maxSize = 10 * 1024 * 1024;

      if (fileSize > maxSize) {
        Alert.alert('Staff Document', 'File size must be 10 MB or smaller.');

        return;
      }

      setSelectedEditDocuments(current => ({
        ...current,

        [documentId]: file,
      }));
    } catch (error) {
      const message = String(error?.message || '').toLowerCase();

      if (message.includes('cancel')) {
        return;
      }

      Alert.alert(
        'Staff Document',
        error?.message || 'Could not select the document.',
      );
    }
  }, []);

  const handleCloseEditStaff = useCallback(() => {
    if (savingStaff) {
      return;
    }

    setEditStaffModalVisible(false);

    resetEditStaffForm();
  }, [savingStaff, resetEditStaffForm]);

  const handleSaveStaff = useCallback(async () => {
    const staffId = Number(editingStaff?.id);

    const name = String(editStaffName || '').trim();

    const email = String(editStaffEmail || '').trim();

    const phone = String(editStaffPhone || '').trim();

    const designation = String(editStaffDesignation || '').trim();

    const addressLine1 = String(editStaffAddressLine1 || '').trim();

    const addressLine2 = String(editStaffAddressLine2 || '').trim();

    const city = String(editStaffCity || '').trim();

    const state = String(editStaffState || '').trim();

    const postalCode = String(editStaffPostalCode || '').trim();

    if (!Number.isFinite(staffId)) {
      Alert.alert('Edit Staff', 'A valid staff ID is required.');

      return;
    }

    if (!name) {
      Alert.alert('Edit Staff', 'Full Name is required.');

      return;
    }

    if (!email) {
      Alert.alert('Edit Staff', 'Email is required.');

      return;
    }

    if (savingStaff) {
      return;
    }

    let profileUpdated = false;

    try {
      setSavingStaff(true);

      /*
       * Step 1: Update staff details.
       */
      const response = await api(`/api/staffs/${encodeURIComponent(staffId)}`, {
        method: 'PUT',

        body: JSON.stringify({
          name,
          email,

          phone: phone || null,

          designation: designation || null,

          address_line1: addressLine1 || null,

          address_line2: addressLine2 || null,

          city: city || null,

          state: state || null,

          postal_code: postalCode || null,
        }),
      });

      if (!response?.data) {
        throw new Error('Updated staff data was not returned.');
      }

      profileUpdated = true;

      /*
       * Step 2: Replace only documents selected
       * in the edit modal.
       */
      const documentEntries = Object.entries(selectedEditDocuments).filter(
        ([, file]) => file?.uri,
      );

      if (documentEntries.length > 0) {
        const formData = new FormData();

        documentEntries.forEach(([documentId, file]) => {
          formData.append(documentId, {
            uri: file.uri,

            name: file.name || `${documentId}-${staffId}`,

            type: file.type || 'application/octet-stream',
          });
        });

        await api(`/api/personnel/${encodeURIComponent(staffId)}/documents`, {
          method: 'POST',

          body: formData,
        });
      }

      setEditStaffModalVisible(false);

      resetEditStaffForm();

      await loadStaffs({
        requestedPage: 1,
        query: searchRef.current,
        append: false,
      });

      Alert.alert('Staff Updated', 'Staff member updated successfully.');
    } catch (error) {
      console.log('Update staff error:', error);

      if (profileUpdated) {
        setEditStaffModalVisible(false);

        resetEditStaffForm();

        await loadStaffs({
          requestedPage: 1,
          query: searchRef.current,
          append: false,
        });

        Alert.alert(
          'Staff Updated',
          'Staff details were updated, but one or more documents could not be replaced.',
        );

        return;
      }

      Alert.alert(
        'Edit Staff',
        error?.message || 'Could not update the staff member.',
      );
    } finally {
      setSavingStaff(false);
    }
  }, [
    editingStaff?.id,
    editStaffName,
    editStaffEmail,
    editStaffPhone,
    editStaffDesignation,
    editStaffAddressLine1,
    editStaffAddressLine2,
    editStaffCity,
    editStaffState,
    editStaffPostalCode,
    selectedEditDocuments,
    savingStaff,
    resetEditStaffForm,
    loadStaffs,
  ]);

  const handleDeleteStaff = useCallback(
    item => {
      const staffId = Number(item?.id);

      if (!Number.isFinite(staffId)) {
        Alert.alert('Remove Staff Access', 'A valid staff ID is required.');

        return;
      }

      const identifier = item?.email || item?.name || 'this staff member';

      Alert.alert(
        'Remove Staff Access',
        `Remove staff access for ${identifier}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            style: 'destructive',

            onPress: async () => {
              if (deletingStaffId !== null) {
                return;
              }

              try {
                setDeletingStaffId(staffId);

                const response = await api(
                  `/api/staffs/${encodeURIComponent(staffId)}`,
                  {
                    method: 'DELETE',
                  },
                );

                if (response?.ok !== true) {
                  throw new Error('Could not remove staff access.');
                }

                await loadStaffs({
                  requestedPage: 1,

                  query: searchRef.current,

                  append: false,
                });

                Alert.alert(
                  'Staff Access Removed',
                  'Staff access removed successfully.',
                );
              } catch (error) {
                console.log('Delete staff error:', error);

                Alert.alert(
                  'Remove Staff Access',
                  error?.message || 'Could not remove staff access.',
                );
              } finally {
                setDeletingStaffId(null);
              }
            },
          },
        ],
      );
    },
    [deletingStaffId, loadStaffs],
  );

  const handleShowCredentials = useCallback(async item => {
    const userId = Number(item?.id);

    if (!Number.isFinite(userId)) {
      Alert.alert('Credentials Message', 'A valid staff ID is required.');

      return;
    }

    try {
      setCredentialsMessageModalVisible(true);

      setCredentialsMessageLoading(true);

      setCredentialsMessageData(null);

      const response = await api(
        `/api/personnel/${encodeURIComponent(
          userId,
        )}/credentials/message?role=staff`,
      );

      if (!response?.message) {
        throw new Error('Credentials message was not returned.');
      }

      setCredentialsMessageData({
        ...response,

        user_id: userId,

        staff_name: item?.name || '',
      });
    } catch (error) {
      console.log('Staff credentials message error:', error);

      setCredentialsMessageModalVisible(false);

      Alert.alert(
        'Credentials Message',
        error?.message || 'Could not load the credentials message.',
      );
    } finally {
      setCredentialsMessageLoading(false);
    }
  }, []);

  const handleCopyCredentialsMessage = useCallback(() => {
    const message = String(credentialsMessageData?.message || '');

    if (!message) {
      return;
    }

    Clipboard.setString(message);

    Alert.alert('Copied', 'Credentials message copied to clipboard.');
  }, [credentialsMessageData?.message]);

  const handleSendCredentialsEmail = useCallback(async () => {
    const userId = Number(credentialsMessageData?.user_id);

    if (!Number.isFinite(userId)) {
      Alert.alert('Send Email', 'A valid staff ID is required.');

      return;
    }

    if (sendingCredentialsEmail) {
      return;
    }

    try {
      setSendingCredentialsEmail(true);

      const response = await api(
        `/api/personnel/${encodeURIComponent(userId)}/credentials/email`,
        {
          method: 'POST',

          body: JSON.stringify({
            role: 'staff',
          }),
        },
      );

      if (response?.ok !== true) {
        throw new Error('Credentials email could not be sent.');
      }

      Alert.alert('Email Sent', 'Credentials email sent successfully.');
    } catch (error) {
      console.log('Staff credentials email error:', error);

      Alert.alert(
        'Send Email',
        error?.message || 'Could not send credentials email.',
      );
    } finally {
      setSendingCredentialsEmail(false);
    }
  }, [credentialsMessageData?.user_id, sendingCredentialsEmail]);

  const handleCloseCredentialsMessage = useCallback(() => {
    if (sendingCredentialsEmail) {
      return;
    }

    setCredentialsMessageModalVisible(false);

    setCredentialsMessageData(null);
  }, [sendingCredentialsEmail]);

  const handleCredentialAction = useCallback(
    item => {
      const userId = Number(item?.id);

      if (!Number.isFinite(userId)) {
        Alert.alert('Staff Credentials', 'A valid staff ID is required.');

        return;
      }

      openStaffCredentialsModal([userId]);
    },
    [openStaffCredentialsModal],
  );

  const handleStaffCredentialUsernameChange = useCallback((userId, value) => {
    setStaffCredentialRows(current =>
      current.map(row =>
        Number(row?.user_id) === Number(userId)
          ? {
              ...row,
              username: value,
            }
          : row,
      ),
    );
  }, []);

  const handleStaffCredentialPasswordChange = useCallback((userId, value) => {
    setStaffCredentialRows(current =>
      current.map(row =>
        Number(row?.user_id) === Number(userId)
          ? {
              ...row,
              password: value,
            }
          : row,
      ),
    );
  }, []);

  const handleCloseStaffCredentials = useCallback(() => {
    if (staffCredentialsSaving) {
      return;
    }

    setStaffCredentialsModalVisible(false);
    setStaffCredentialRows([]);
  }, [staffCredentialsSaving]);

  const handleSaveStaffCredentials = useCallback(async () => {
    if (staffCredentialsSaving || staffCredentialRows.length === 0) {
      return;
    }

    const credentials = staffCredentialRows.map(row => ({
      user_id: Number(row?.user_id),

      username: String(row?.username || '').trim(),

      password: String(row?.password || '').trim(),
    }));

    const invalidRow = credentials.find(
      item =>
        !Number.isFinite(item.user_id) || !item.username || !item.password,
    );

    if (invalidRow) {
      Alert.alert(
        'Staff Credentials',
        'Username and password are required for every staff member.',
      );

      return;
    }

    try {
      setStaffCredentialsSaving(true);

      const response = await api('/api/personnel/credentials', {
        method: 'POST',

        body: JSON.stringify({
          role: 'staff',
          credentials,
        }),
      });

      const savedRows = Array.isArray(response?.rows) ? response.rows : [];

      if (savedRows.length === 0) {
        throw new Error('Credentials were not saved.');
      }

      setStaffCredentialsModalVisible(false);

      setStaffCredentialRows([]);

      await loadStaffs({
        requestedPage: 1,
        query: searchRef.current,
        append: false,
      });

      Alert.alert(
        'Credentials Saved',
        savedRows.length === 1
          ? 'Staff credentials saved successfully.'
          : `${savedRows.length} staff credentials saved successfully.`,
      );
    } catch (error) {
      console.log('Save staff credentials error:', error);

      Alert.alert(
        'Staff Credentials',
        error?.message || 'Could not save staff credentials.',
      );
    } finally {
      setStaffCredentialsSaving(false);
    }
  }, [staffCredentialRows, staffCredentialsSaving, loadStaffs]);

  const resetCreateStaffForm = useCallback(() => {
    setNewStaffName('');
    setNewStaffEmail('');

    setNewStaffAddressLine1('');
    setNewStaffAddressLine2('');

    setNewStaffCity('');
    setNewStaffState('');
    setNewStaffPostalCode('');

    setNewStaffPhone('');
    setNewStaffDesignation('');

    setPersonnelDocumentRequirements([]);
    setSelectedPersonnelDocuments({});
  }, []);

  const resetEditStaffForm = useCallback(() => {
    setEditingStaff(null);

    setEditStaffName('');
    setEditStaffEmail('');

    setEditStaffAddressLine1('');
    setEditStaffAddressLine2('');

    setEditStaffCity('');
    setEditStaffState('');
    setEditStaffPostalCode('');

    setEditStaffPhone('');
    setEditStaffDesignation('');

    setEditDocumentRequirements([]);
    setSelectedEditDocuments({});
  }, []);

  const openStaffCredentialsModal = useCallback(async userIds => {
    const ids = Array.isArray(userIds)
      ? userIds.map(Number).filter(Number.isFinite)
      : [];

    if (ids.length === 0) {
      Alert.alert('Staff Credentials', 'No valid staff members were selected.');

      return;
    }

    try {
      setStaffCredentialsModalVisible(true);
      setStaffCredentialsLoading(true);
      setStaffCredentialRows([]);

      const response = await api('/api/personnel/credentials/preview', {
        method: 'POST',

        body: JSON.stringify({
          role: 'staff',
          user_ids: ids,
        }),
      });

      const rows = Array.isArray(response?.rows) ? response.rows : [];

      if (rows.length === 0) {
        throw new Error('Credential preview was not returned.');
      }

      setStaffCredentialRows(
        rows.map(row => ({
          ...row,

          username: String(row?.username || ''),

          password: String(row?.password || ''),
        })),
      );
    } catch (error) {
      console.log('Staff credential preview error:', error);

      setStaffCredentialsModalVisible(false);
      setStaffCredentialRows([]);

      Alert.alert(
        'Staff Credentials',
        error?.message || 'Could not generate staff credentials.',
      );
    } finally {
      setStaffCredentialsLoading(false);
    }
  }, []);

  const loadIdentityCandidates = useCallback(
    async ({ requestedPage = 1, initializeSelection = false } = {}) => {
      try {
        setIdentityLoading(true);

        const response = await api(
          `/api/students/id-card-candidates?card_type=staff&page=${encodeURIComponent(
            requestedPage,
          )}&per_page=20`,
        );

        const rows = Array.isArray(response?.rows) ? response.rows : [];

        setIdentityRows(rows);

        const meta = response?.meta || {};

        setIdentityPage(Number(meta?.current_page) || requestedPage);

        setIdentityLastPage(Number(meta?.last_page) || 1);

        setIdentityTotal(Number(meta?.total) || rows.length);

        if (initializeSelection) {
          const ids = Array.isArray(response?.ids)
            ? response.ids.map(Number).filter(Number.isFinite)
            : rows.map(item => Number(item?.id)).filter(Number.isFinite);

          setIdentitySelectedIds(new Set(ids));
        }
      } catch (error) {
        console.log('Identity card candidates error:', error);

        Alert.alert(
          'Identity Cards',
          error?.message || 'Could not load identity card candidates.',
        );
      } finally {
        setIdentityLoading(false);
      }
    },
    [],
  );

  const renderStaff = useCallback(
    ({ item }) => {
      const photoUrl = String(item?.photo_url || '').trim();

      const status = String(item?.status || '')
        .trim()
        .toLowerCase();

      const isActive = status === 'active';

      const isDraft = status === 'draft' || item?.is_draft === true;

      return (
        <View style={styles.staffCard}>
          <View style={styles.staffTop}>
            <View style={styles.avatar}>
              {photoUrl ? (
                <Image
                  source={{
                    uri: photoUrl,
                  }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.initials}>{getInitials(item?.name)}</Text>
              )}
            </View>

            <View style={styles.staffInfo}>
              <Text style={styles.staffName}>{item?.name || 'Staff'}</Text>

              <View style={styles.contactRow}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={14}
                  color="#AFC0D8"
                />

                <Text style={styles.contactText} numberOfLines={1}>
                  {item?.email || 'No email'}
                </Text>
              </View>

              <View style={styles.contactRow}>
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={14}
                  color="#AFC0D8"
                />

                <Text style={styles.contactText}>
                  {item?.phone || 'No phone'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Designation</Text>

              <Text style={styles.detailValue}>
                {item?.designation || 'Not assigned'}
              </Text>
            </View>

            {!!item?.address_line1 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Address</Text>

                <Text style={styles.detailValue}>
                  {[
                    item?.address_line1,
                    item?.address_line2,
                    item?.city,
                    item?.state,
                    item?.postal_code,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.badgesRow}>
            {isDraft ? (
              <View style={[styles.statusBadge, styles.draftBadge]}>
                <Text style={[styles.statusBadgeText, styles.draftBadgeText]}>
                  DRAFT
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.statusBadge,

                  isActive ? styles.activeBadge : styles.inactiveBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,

                    isActive
                      ? styles.activeBadgeText
                      : styles.inactiveBadgeText,
                  ]}
                >
                  {isActive ? 'ACTIVE' : 'INACTIVE'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.staffActions}>
            <View style={styles.topActionRow}>
              <Pressable
                onPress={() => handleEditStaff(item)}
                style={({ pressed }) => [
                  styles.editButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>

              <Pressable
                disabled={deletingStaffId === Number(item?.id)}
                onPress={() => handleDeleteStaff(item)}
                style={({ pressed }) => [
                  styles.deleteButton,

                  deletingStaffId === Number(item?.id) &&
                    styles.controlDisabled,

                  pressed &&
                    deletingStaffId !== Number(item?.id) &&
                    styles.controlPressed,
                ]}
              >
                {deletingStaffId === Number(item?.id) ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete</Text>
                )}
              </Pressable>
            </View>

            <View style={styles.bottomActionRow}>
              {item?.has_login_credentials === true ? (
                <Pressable
                  onPress={() => handleShowCredentials(item)}
                  style={({ pressed }) => [
                    styles.credentialsButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.credentialsButtonText}>
                    Show Credentials Message
                  </Text>
                </Pressable>
              ) : (
                <View style={styles.credentialsSpacer} />
              )}

              <Pressable
                onPress={() => handleCredentialAction(item)}
                style={({ pressed }) => [
                  styles.iconOnlyButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="shield-outline"
                  size={18}
                  color="#DCE7F5"
                />
              </Pressable>
            </View>
          </View>
        </View>
      );
    },
    [
      handleEditStaff,
      handleDeleteStaff,
      handleShowCredentials,
      handleCredentialAction,
    ],
  );

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading staff...</Text>
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
        data={staffs}
        keyExtractor={item => String(item?.id)}
        renderItem={renderStaff}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadScreen({
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.topButtons}>
              <View style={styles.topButtonRow}>
                <Pressable
                  onPress={handleIdentityCards}
                  style={({ pressed }) => [
                    styles.secondaryTopButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="card-account-details-outline"
                    size={17}
                    color="#FFFFFF"
                  />

                  <Text style={styles.secondaryTopButtonText}>
                    Identity Cards
                  </Text>
                </Pressable>

                <Pressable
                  disabled={downloadingData}
                  onPress={handleDownloadData}
                  style={({ pressed }) => [
                    styles.secondaryTopButton,

                    downloadingData && styles.controlDisabled,

                    pressed && !downloadingData && styles.controlPressed,
                  ]}
                >
                  {downloadingData ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name="download-outline"
                        size={17}
                        color="#FFFFFF"
                      />

                      <Text style={styles.secondaryTopButtonText}>
                        Download Data
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>

              <View style={[styles.topButtonRow, styles.secondTopButtonRow]}>
                <Pressable
                  onPress={handleGenerateCredentials}
                  style={({ pressed }) => [
                    styles.secondaryTopButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="shield-key-outline"
                    size={17}
                    color="#FFFFFF"
                  />

                  <Text style={styles.secondaryTopButtonText}>
                    Generate Credentials
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleAddStaff}
                  style={({ pressed }) => [
                    styles.primaryTopButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text style={styles.primaryTopButtonText}>Add Staff</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.searchPanel}>
              <View style={styles.searchBox}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={19}
                  color="#94A3B8"
                />

                <TextInput
                  value={search}
                  onChangeText={handleSearchChange}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                  placeholder="Search by name or email..."
                  placeholderTextColor="#718096"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.searchInput}
                />
              </View>

              <View style={styles.searchActions}>
                <Pressable
                  disabled={searching}
                  onPress={handleSearch}
                  style={({ pressed }) => [
                    styles.searchButton,

                    searching && styles.controlDisabled,

                    pressed && !searching && styles.controlPressed,
                  ]}
                >
                  {searching ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.searchButtonText}>Search</Text>
                  )}
                </Pressable>

                <Pressable
                  disabled={searching}
                  onPress={handleClearSearch}
                  style={({ pressed }) => [
                    styles.clearButton,

                    pressed && !searching && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.listHeading}>
              <Text style={styles.listHeadingTitle}>Staff</Text>

              <Text style={styles.listHeadingMeta}>
                {totalCount}{' '}
                {totalCount === 1 ? 'staff member' : 'staff members'}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={40}
              color="#718096"
            />

            <Text style={styles.emptyTitle}>No staff found</Text>

            <Text style={styles.emptyText}>Try another search term.</Text>
          </View>
        }
        ListFooterComponent={
          page < lastPage ? (
            <Pressable
              disabled={loadingMore}
              onPress={loadNextPage}
              style={({ pressed }) => [
                styles.loadMoreButton,

                loadingMore && styles.controlDisabled,

                pressed && !loadingMore && styles.controlPressed,
              ]}
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.loadMoreText}>Load More</Text>
              )}
            </Pressable>
          ) : (
            <View style={styles.footerSpace} />
          )
        }
      />
      <Modal
        visible={createStaffModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseCreateStaff}
      >
        <View style={styles.createStaffBackdrop}>
          <View style={styles.createStaffModal}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.createStaffContent}
            >
              <View style={styles.createStaffHeader}>
                <Text style={styles.createStaffTitle}>Create Staff</Text>

                <Pressable
                  disabled={creatingStaff}
                  onPress={handleCloseCreateStaff}
                  style={({ pressed }) => [
                    styles.createStaffCloseButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={22}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>

              <Text style={styles.createStaffLabel}>Full Name</Text>

              <TextInput
                value={newStaffName}
                onChangeText={setNewStaffName}
                editable={!creatingStaff}
                placeholder="Full name"
                placeholderTextColor="#718096"
                style={styles.createStaffInput}
              />

              <Text style={styles.createStaffLabel}>Email</Text>

              <TextInput
                value={newStaffEmail}
                onChangeText={setNewStaffEmail}
                editable={!creatingStaff}
                placeholder="staff@example.com"
                placeholderTextColor="#718096"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.createStaffInput}
              />

              <Text style={styles.createStaffLabel}>Address line 1</Text>

              <TextInput
                value={newStaffAddressLine1}
                onChangeText={setNewStaffAddressLine1}
                editable={!creatingStaff}
                placeholder="Address line 1"
                placeholderTextColor="#718096"
                style={styles.createStaffInput}
              />

              <Text style={styles.createStaffLabel}>
                Address line 2 (optional)
              </Text>

              <TextInput
                value={newStaffAddressLine2}
                onChangeText={setNewStaffAddressLine2}
                editable={!creatingStaff}
                placeholder="Address line 2"
                placeholderTextColor="#718096"
                style={styles.createStaffInput}
              />

              <View style={styles.createStaffTwoColumnRow}>
                <View style={styles.createStaffHalfField}>
                  <Text style={styles.createStaffLabel}>City</Text>

                  <TextInput
                    value={newStaffCity}
                    onChangeText={setNewStaffCity}
                    editable={!creatingStaff}
                    placeholder="City"
                    placeholderTextColor="#718096"
                    style={styles.createStaffInput}
                  />
                </View>

                <View style={styles.createStaffHalfField}>
                  <Text style={styles.createStaffLabel}>State / Province</Text>

                  <TextInput
                    value={newStaffState}
                    onChangeText={setNewStaffState}
                    editable={!creatingStaff}
                    placeholder="State"
                    placeholderTextColor="#718096"
                    style={styles.createStaffInput}
                  />
                </View>
              </View>

              <Text style={styles.createStaffLabel}>Postal code</Text>

              <TextInput
                value={newStaffPostalCode}
                onChangeText={setNewStaffPostalCode}
                editable={!creatingStaff}
                placeholder="Postal code"
                placeholderTextColor="#718096"
                keyboardType="number-pad"
                style={styles.createStaffInput}
              />

              <Text style={styles.createStaffLabel}>Phone</Text>

              <TextInput
                value={newStaffPhone}
                onChangeText={setNewStaffPhone}
                editable={!creatingStaff}
                placeholder="+91 90000 00000"
                placeholderTextColor="#718096"
                keyboardType="phone-pad"
                style={styles.createStaffInput}
              />

              <Text style={styles.createStaffLabel}>Role</Text>

              <View style={styles.createStaffReadOnlyInput}>
                <Text style={styles.createStaffReadOnlyText}>staff</Text>
              </View>

              <Text style={styles.createStaffLabel}>
                Designation (optional)
              </Text>

              <TextInput
                value={newStaffDesignation}
                onChangeText={setNewStaffDesignation}
                editable={!creatingStaff}
                placeholder="Office Manager"
                placeholderTextColor="#718096"
                style={styles.createStaffInput}
              />

              <Text style={styles.documentsTitle}>Documents</Text>

              <Text style={styles.documentsHelp}>
                Upload the documents configured in Settings → Documents. Files
                may be PDF, JPG, PNG, or WebP and up to 10 MB each.
              </Text>

              {personnelDocumentsLoading ? (
                <View style={styles.documentsLoader}>
                  <ActivityIndicator size="small" color="#67D1F0" />

                  <Text style={styles.documentsLoaderText}>
                    Loading document requirements...
                  </Text>
                </View>
              ) : (
                personnelDocumentRequirements.map(item => {
                  const selectedFile = selectedPersonnelDocuments?.[item?.id];

                  return (
                    <View key={String(item?.id)} style={styles.documentField}>
                      <Text style={styles.documentLabel}>
                        {item?.name || 'Document'}
                        {item?.mandatory === true ? ' (required)' : ''}
                      </Text>

                      <Pressable
                        disabled={creatingStaff}
                        onPress={() => handlePickPersonnelDocument(item)}
                        style={({ pressed }) => [
                          styles.documentPickerButton,

                          pressed && styles.controlPressed,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="paperclip"
                          size={17}
                          color="#DCE7F5"
                        />

                        <Text
                          style={styles.documentPickerText}
                          numberOfLines={1}
                        >
                          {selectedFile?.name || 'Choose File'}
                        </Text>
                      </Pressable>
                    </View>
                  );
                })
              )}

              <View style={styles.createStaffActions}>
                <Pressable
                  disabled={creatingStaff}
                  onPress={handleCloseCreateStaff}
                  style={({ pressed }) => [
                    styles.createStaffCancelButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.createStaffCancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={creatingStaff}
                  onPress={handleSaveStaffDraft}
                  style={({ pressed }) => [
                    styles.saveDraftButton,

                    creatingStaff && styles.controlDisabled,

                    pressed && !creatingStaff && styles.controlPressed,
                  ]}
                >
                  {creatingStaff ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveDraftText}>Save Draft</Text>
                  )}
                </Pressable>

                <Pressable
                  disabled={creatingStaff || personnelDocumentsLoading}
                  onPress={handleCreateStaff}
                  style={({ pressed }) => [
                    styles.createStaffButton,

                    (creatingStaff || personnelDocumentsLoading) &&
                      styles.controlDisabled,

                    pressed && !creatingStaff && styles.controlPressed,
                  ]}
                >
                  {creatingStaff ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.createStaffButtonText}>Create</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        visible={editStaffModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseEditStaff}
      >
        <View style={styles.createStaffBackdrop}>
          <View style={styles.createStaffModal}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.createStaffContent}
            >
              <View style={styles.createStaffHeader}>
                <Text style={styles.createStaffTitle}>Edit Staff</Text>

                <Pressable
                  disabled={savingStaff}
                  onPress={handleCloseEditStaff}
                  style={({ pressed }) => [
                    styles.createStaffCloseButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={22}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>

              <Text style={styles.createStaffLabel}>Full Name</Text>

              <TextInput
                value={editStaffName}
                onChangeText={setEditStaffName}
                editable={!savingStaff}
                placeholder="Full name"
                placeholderTextColor="#718096"
                style={styles.createStaffInput}
              />

              <Text style={styles.createStaffLabel}>Email</Text>

              <TextInput
                value={editStaffEmail}
                onChangeText={setEditStaffEmail}
                editable={!savingStaff}
                placeholder="staff@example.com"
                placeholderTextColor="#718096"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.createStaffInput}
              />

              <Text style={styles.createStaffLabel}>Address line 1</Text>

              <TextInput
                value={editStaffAddressLine1}
                onChangeText={setEditStaffAddressLine1}
                editable={!savingStaff}
                placeholder="Address line 1"
                placeholderTextColor="#718096"
                style={styles.createStaffInput}
              />

              <Text style={styles.createStaffLabel}>
                Address line 2 (optional)
              </Text>

              <TextInput
                value={editStaffAddressLine2}
                onChangeText={setEditStaffAddressLine2}
                editable={!savingStaff}
                placeholder="Address line 2"
                placeholderTextColor="#718096"
                style={styles.createStaffInput}
              />

              <View style={styles.createStaffTwoColumnRow}>
                <View style={styles.createStaffHalfField}>
                  <Text style={styles.createStaffLabel}>City</Text>

                  <TextInput
                    value={editStaffCity}
                    onChangeText={setEditStaffCity}
                    editable={!savingStaff}
                    placeholder="City"
                    placeholderTextColor="#718096"
                    style={styles.createStaffInput}
                  />
                </View>

                <View style={styles.createStaffHalfField}>
                  <Text style={styles.createStaffLabel}>State / Province</Text>

                  <TextInput
                    value={editStaffState}
                    onChangeText={setEditStaffState}
                    editable={!savingStaff}
                    placeholder="State"
                    placeholderTextColor="#718096"
                    style={styles.createStaffInput}
                  />
                </View>
              </View>

              <Text style={styles.createStaffLabel}>Postal code</Text>

              <TextInput
                value={editStaffPostalCode}
                onChangeText={setEditStaffPostalCode}
                editable={!savingStaff}
                placeholder="Postal code"
                placeholderTextColor="#718096"
                keyboardType="number-pad"
                style={styles.createStaffInput}
              />

              <Text style={styles.createStaffLabel}>Phone</Text>

              <TextInput
                value={editStaffPhone}
                onChangeText={setEditStaffPhone}
                editable={!savingStaff}
                placeholder="+91 90000 00000"
                placeholderTextColor="#718096"
                keyboardType="phone-pad"
                style={styles.createStaffInput}
              />

              <Text style={styles.createStaffLabel}>Role</Text>

              <View style={styles.createStaffReadOnlyInput}>
                <Text style={styles.createStaffReadOnlyText}>staff</Text>
              </View>

              <Text style={styles.createStaffLabel}>
                Designation (optional)
              </Text>

              <TextInput
                value={editStaffDesignation}
                onChangeText={setEditStaffDesignation}
                editable={!savingStaff}
                placeholder="Office Manager"
                placeholderTextColor="#718096"
                style={styles.createStaffInput}
              />

              <Text style={styles.documentsTitle}>Documents</Text>

              <Text style={styles.documentsHelp}>
                Upload the documents configured in Settings → Documents. Files
                may be PDF, JPG, PNG, or WebP and up to 10 MB each.
              </Text>

              {editDocumentsLoading ? (
                <View style={styles.documentsLoader}>
                  <ActivityIndicator size="small" color="#67D1F0" />

                  <Text style={styles.documentsLoaderText}>
                    Loading documents...
                  </Text>
                </View>
              ) : (
                editDocumentRequirements.map(item => {
                  const selectedFile = selectedEditDocuments?.[item?.id];

                  const currentDocument = item?.document || null;

                  return (
                    <View key={String(item?.id)} style={styles.documentField}>
                      <Text style={styles.documentLabel}>
                        {item?.name || 'Document'}
                        {item?.mandatory === true ? ' (required)' : ''}
                      </Text>

                      <View style={styles.editDocumentRow}>
                        <Pressable
                          disabled={savingStaff}
                          onPress={() => handlePickEditDocument(item)}
                          style={({ pressed }) => [
                            styles.documentPickerButton,
                            styles.editDocumentPicker,

                            pressed && styles.controlPressed,
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="paperclip"
                            size={17}
                            color="#DCE7F5"
                          />

                          <Text
                            style={styles.documentPickerText}
                            numberOfLines={1}
                          >
                            {selectedFile?.name || 'Choose File'}
                          </Text>
                        </Pressable>

                        {currentDocument?.name ? (
                          <Text
                            style={styles.currentDocumentText}
                            numberOfLines={1}
                          >
                            Current: {currentDocument.name}
                          </Text>
                        ) : (
                          <Text style={styles.currentDocumentText}>
                            No current file
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })
              )}

              <View style={styles.createStaffActions}>
                <Pressable
                  disabled={savingStaff}
                  onPress={handleCloseEditStaff}
                  style={({ pressed }) => [
                    styles.createStaffCancelButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.createStaffCancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={savingStaff || editDocumentsLoading}
                  onPress={handleSaveStaff}
                  style={({ pressed }) => [
                    styles.createStaffButton,

                    (savingStaff || editDocumentsLoading) &&
                      styles.controlDisabled,

                    pressed && !savingStaff && styles.controlPressed,
                  ]}
                >
                  {savingStaff ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.createStaffButtonText}>Save</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        visible={staffCredentialsModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseStaffCredentials}
      >
        <View style={styles.staffCredentialsBackdrop}>
          <View style={styles.staffCredentialsModal}>
            <View style={styles.staffCredentialsHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.staffCredentialsTitle}>
                  Generate Staff Member Credentials
                </Text>

                <Text style={styles.staffCredentialsSubtitle}>
                  Review usernames and passwords before saving. Usernames are
                  unique across every account type.
                </Text>
              </View>

              <Pressable
                disabled={staffCredentialsSaving}
                onPress={handleCloseStaffCredentials}
                style={({ pressed }) => [
                  styles.staffCredentialsClose,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            {staffCredentialsLoading ? (
              <View style={styles.staffCredentialsLoader}>
                <ActivityIndicator size="large" color="#67D1F0" />

                <Text style={styles.staffCredentialsLoadingText}>
                  Generating credentials...
                </Text>
              </View>
            ) : (
              <>
                <ScrollView
                  style={styles.staffCredentialsRows}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {staffCredentialRows.map(row => (
                    <View
                      key={String(row?.user_id)}
                      style={styles.staffCredentialCard}
                    >
                      <View style={styles.staffCredentialIdentity}>
                        <Text style={styles.staffCredentialName}>
                          {row?.name || 'Staff Member'}
                        </Text>

                        <Text style={styles.staffCredentialEmail}>
                          {row?.email || 'No email'}
                        </Text>

                        {row?.has_existing_credentials === true ? (
                          <Text style={styles.staffCredentialExisting}>
                            Replaces existing credentials
                          </Text>
                        ) : null}
                      </View>

                      <Text style={styles.staffCredentialLabel}>Username</Text>

                      <TextInput
                        value={row?.username}
                        onChangeText={value =>
                          handleStaffCredentialUsernameChange(
                            row?.user_id,
                            value,
                          )
                        }
                        editable={!staffCredentialsSaving}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.staffCredentialInput}
                      />

                      <Text style={styles.staffCredentialLabel}>Password</Text>

                      <TextInput
                        value={row?.password}
                        onChangeText={value =>
                          handleStaffCredentialPasswordChange(
                            row?.user_id,
                            value,
                          )
                        }
                        editable={!staffCredentialsSaving}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.staffCredentialInput}
                      />
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.staffCredentialsFooter}>
                  <Pressable
                    disabled={staffCredentialsSaving}
                    onPress={handleCloseStaffCredentials}
                    style={({ pressed }) => [
                      styles.staffCredentialsCancelButton,

                      pressed && styles.controlPressed,
                    ]}
                  >
                    <Text style={styles.staffCredentialsCancelText}>Close</Text>
                  </Pressable>

                  <Pressable
                    disabled={
                      staffCredentialsSaving || staffCredentialRows.length === 0
                    }
                    onPress={handleSaveStaffCredentials}
                    style={({ pressed }) => [
                      styles.staffCredentialsSaveButton,

                      staffCredentialsSaving && styles.controlDisabled,

                      pressed &&
                        !staffCredentialsSaving &&
                        styles.controlPressed,
                    ]}
                  >
                    {staffCredentialsSaving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.staffCredentialsSaveText}>
                        Save Credentials
                      </Text>
                    )}
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        visible={credentialsMessageModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseCredentialsMessage}
      >
        <View style={styles.staffCredentialsBackdrop}>
          <View style={styles.credentialsMessageModal}>
            <View style={styles.credentialsMessageHeader}>
              <Text style={styles.credentialsMessageTitle}>
                Credentials Message
                {credentialsMessageData?.staff_name
                  ? ` — ${credentialsMessageData.staff_name}`
                  : ''}
              </Text>

              <Pressable
                disabled={sendingCredentialsEmail}
                onPress={handleCloseCredentialsMessage}
                style={({ pressed }) => [
                  styles.credentialsMessageClose,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            {credentialsMessageLoading ? (
              <View style={styles.credentialsMessageLoader}>
                <ActivityIndicator size="large" color="#67D1F0" />

                <Text style={styles.staffCredentialsLoadingText}>
                  Loading credentials message...
                </Text>
              </View>
            ) : credentialsMessageData ? (
              <>
                <ScrollView
                  style={styles.credentialsMessageBody}
                  showsVerticalScrollIndicator={false}
                >
                  <Text selectable style={styles.credentialsMessageText}>
                    {credentialsMessageData.message}
                  </Text>
                </ScrollView>

                <View style={styles.credentialsMessageActions}>
                  <Pressable
                    onPress={handleCopyCredentialsMessage}
                    style={({ pressed }) => [
                      styles.credentialsMessageButton,

                      pressed && styles.controlPressed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="content-copy"
                      size={17}
                      color="#FFFFFF"
                    />

                    <Text style={styles.credentialsMessageButtonText}>
                      Copy
                    </Text>
                  </Pressable>

                  <Pressable
                    disabled={
                      sendingCredentialsEmail || !credentialsMessageData?.email
                    }
                    onPress={handleSendCredentialsEmail}
                    style={({ pressed }) => [
                      styles.credentialsMessageButton,

                      (sendingCredentialsEmail ||
                        !credentialsMessageData?.email) &&
                        styles.controlDisabled,

                      pressed &&
                        !sendingCredentialsEmail &&
                        styles.controlPressed,
                    ]}
                  >
                    {sendingCredentialsEmail ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <MaterialCommunityIcons
                          name="email-outline"
                          size={17}
                          color="#FFFFFF"
                        />

                        <Text style={styles.credentialsMessageButtonText}>
                          Send Email
                        </Text>
                      </>
                    )}
                  </Pressable>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
      <Modal
        visible={identityModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          if (!downloadingIdentityCards) {
            setIdentityModalVisible(false);
          }
        }}
      >
        <View style={styles.staffCredentialsBackdrop}>
          <View style={styles.identityModal}>
            <View style={styles.identityHeader}>
              <Text style={styles.identityTitle}>Identity Cards</Text>

              <Pressable
                onPress={() => setIdentityModalVisible(false)}
                style={styles.credentialsMessageClose}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <View style={styles.identitySearchRow}>
              <View style={styles.identitySearchBox}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={18}
                  color="#94A3B8"
                />

                <TextInput
                  value={identitySearch}
                  onChangeText={setIdentitySearch}
                  placeholder="Search by name..."
                  placeholderTextColor="#718096"
                  style={styles.identitySearchInput}
                />
              </View>

              <Pressable
                onPress={() => setIdentitySearch('')}
                style={styles.identityClearButton}
              >
                <Text style={styles.identityClearText}>Clear</Text>
              </Pressable>
            </View>

            {identityLoading ? (
              <View style={styles.credentialsMessageLoader}>
                <ActivityIndicator size="large" color="#67D1F0" />
              </View>
            ) : (
              <>
                <Pressable
                  onPress={toggleAllIdentityCards}
                  style={styles.identitySelectAll}
                >
                  <MaterialCommunityIcons
                    name={
                      allVisibleIdentitySelected
                        ? 'checkbox-marked'
                        : 'checkbox-blank-outline'
                    }
                    size={20}
                    color="#93C5FD"
                  />

                  <Text style={styles.identitySelectAllText}>
                    Select / Deselect All
                  </Text>
                </Pressable>

                <Text style={styles.identitySelectedCount}>
                  {identitySelectedIds.size} selected of {identityTotal}{' '}
                  matching
                </Text>

                <ScrollView style={styles.identityList}>
                  {visibleIdentityRows.map(item => {
                    const id = Number(item?.id);

                    const selected = identitySelectedIds.has(id);

                    return (
                      <Pressable
                        key={String(id)}
                        onPress={() => toggleIdentityCard(id)}
                        style={styles.identityRow}
                      >
                        <MaterialCommunityIcons
                          name={
                            selected
                              ? 'checkbox-marked'
                              : 'checkbox-blank-outline'
                          }
                          size={20}
                          color={selected ? '#93C5FD' : '#94A3B8'}
                        />

                        <Text style={styles.identityRole}>
                          {item?.role || 'STAFF'}
                        </Text>

                        <Text style={styles.identityName}>
                          {item?.name || 'Staff'}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <View style={styles.identityPagination}>
                  <Text style={styles.identityPageText}>
                    Page {identityPage} of {identityLastPage}
                  </Text>

                  <View style={styles.identityPageButtons}>
                    <Pressable
                      disabled={identityPage <= 1}
                      onPress={() =>
                        loadIdentityCandidates({
                          requestedPage: identityPage - 1,
                        })
                      }
                      style={[
                        styles.identityPageButton,

                        identityPage <= 1 && styles.controlDisabled,
                      ]}
                    >
                      <Text style={styles.identityPageButtonText}>
                        Previous
                      </Text>
                    </Pressable>

                    <Pressable
                      disabled={identityPage >= identityLastPage}
                      onPress={() =>
                        loadIdentityCandidates({
                          requestedPage: identityPage + 1,
                        })
                      }
                      style={[
                        styles.identityPageButton,

                        identityPage >= identityLastPage &&
                          styles.controlDisabled,
                      ]}
                    >
                      <Text style={styles.identityPageButtonText}>Next</Text>
                    </Pressable>
                  </View>
                </View>

                <Pressable
                  disabled={
                    downloadingIdentityCards || identitySelectedIds.size === 0
                  }
                  onPress={handleDownloadIdentityCards}
                  style={[
                    styles.identityDownloadButton,

                    (downloadingIdentityCards ||
                      identitySelectedIds.size === 0) &&
                      styles.controlDisabled,
                  ]}
                >
                  {downloadingIdentityCards ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name="download-outline"
                        size={18}
                        color="#FFFFFF"
                      />

                      <Text style={styles.identityDownloadText}>
                        Download Identity Cards
                      </Text>
                    </>
                  )}
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
