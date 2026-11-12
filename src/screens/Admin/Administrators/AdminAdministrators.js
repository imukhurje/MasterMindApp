// src/screens/Admin/Administrators/AdminAdministrators.js

import React, { useCallback, useRef, useState, useMemo } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';

import { pick, types } from '@react-native-documents/picker';

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api, absoluteUrl, getToken } from '../../../api/client';

import ReactNativeBlobUtil from 'react-native-blob-util';

import styles from './AdminAdministrators.styles';

import Clipboard from '@react-native-clipboard/clipboard';

const PER_PAGE = 20;

function getInitials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'AD';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getLocationsText(item) {
  const locations = Array.isArray(item?.locations) ? item.locations : [];

  if (locations.length === 0) {
    return 'All locations';
  }

  return locations
    .map(location => location?.name)
    .filter(Boolean)
    .join(', ');
}

export default function AdminAdministrators({ navigation }) {
  const insets = useSafeAreaInsets();

  const searchRef = useRef('');

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [searching, setSearching] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [me, setMe] = useState(null);

  const [onboarding, setOnboarding] = useState(null);

  const [meta, setMeta] = useState(null);

  const [admins, setAdmins] = useState([]);

  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const [createAdminModalVisible, setCreateAdminModalVisible] = useState(false);

  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const [newAdminName, setNewAdminName] = useState('');

  const [newAdminEmail, setNewAdminEmail] = useState('');

  const [newAdminDesignation, setNewAdminDesignation] = useState('');

  const [newAdminPhone, setNewAdminPhone] = useState('');

  const [newAdminRole, setNewAdminRole] = useState('admin');

  const [newAdminPhoto, setNewAdminPhoto] = useState(null);

  const [selectedLocationIds, setSelectedLocationIds] = useState([]);

  const [locationSearch, setLocationSearch] = useState('');

  const [editAdminModalVisible, setEditAdminModalVisible] = useState(false);

  const [editingAdmin, setEditingAdmin] = useState(null);

  const [savingAdmin, setSavingAdmin] = useState(false);

  const [editAdminName, setEditAdminName] = useState('');

  const [editAdminEmail, setEditAdminEmail] = useState('');

  const [editAdminDesignation, setEditAdminDesignation] = useState('');

  const [editAdminPhone, setEditAdminPhone] = useState('');

  const [editAdminRole, setEditAdminRole] = useState('');

  const [editAdminPhoto, setEditAdminPhoto] = useState(null);

  const [editExistingPhotoUrl, setEditExistingPhotoUrl] = useState('');

  const [editLocationIds, setEditLocationIds] = useState([]);

  const [editLocationSearch, setEditLocationSearch] = useState('');

  const [adminCredentialsModalVisible, setAdminCredentialsModalVisible] =
    useState(false);

  const [adminCredentialsLoading, setAdminCredentialsLoading] = useState(false);

  const [adminCredentialsSaving, setAdminCredentialsSaving] = useState(false);

  const [adminCredentialRows, setAdminCredentialRows] = useState([]);

  const [credentialsMessageModalVisible, setCredentialsMessageModalVisible] =
    useState(false);

  const [credentialsMessageLoading, setCredentialsMessageLoading] =
    useState(false);

  const [credentialsMessageData, setCredentialsMessageData] = useState(null);

  const [sendingCredentialsEmail, setSendingCredentialsEmail] = useState(false);

  const [deletingAdminId, setDeletingAdminId] = useState(null);

  const [downloadingData, setDownloadingData] = useState(false);

  const [identityCardsModalVisible, setIdentityCardsModalVisible] =
    useState(false);

  const [identityCardsLoading, setIdentityCardsLoading] = useState(false);

  const [identityCardsDownloading, setIdentityCardsDownloading] =
    useState(false);

  const [identityCardRows, setIdentityCardRows] = useState([]);

  const [identityCardIds, setIdentityCardIds] = useState([]);

  const [selectedIdentityCardIds, setSelectedIdentityCardIds] = useState(
    () => new Set(),
  );

  const [identityCardMeta, setIdentityCardMeta] = useState(null);

  const [identityCardSearch, setIdentityCardSearch] = useState('');

  const [identityCardAppliedSearch, setIdentityCardAppliedSearch] =
    useState('');

  const loadAdministrators = useCallback(
    async ({ requestedPage = 1, query = '', append = false } = {}) => {
      const response = await api(
        `/api/administrators?q=${encodeURIComponent(
          query,
        )}&page=${encodeURIComponent(requestedPage)}&per_page=${PER_PAGE}`,
      );

      const rows = Array.isArray(response?.data) ? response.data : [];

      if (append) {
        setAdmins(current => {
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
        setAdmins(rows);
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

        const [meResponse, onboardingResponse, metaResponse] =
          await Promise.all([
            api('/api/me'),

            api('/api/settings/v1/onboarding'),

            api('/api/administrators/meta'),
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
          role === 'super_admin' ||
          metaResponse?.can_manage === true;

        if (!hasAccess) {
          Alert.alert(
            'Access denied',
            'Only administrators can access this page.',
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

        setMeta(metaResponse || null);

        await loadAdministrators({
          requestedPage: 1,
          query: searchRef.current,
          append: false,
        });
      } catch (error) {
        console.log('Administrators load error:', error);

        Alert.alert(
          'Administrators',
          error?.message || 'Could not load administrators.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigation, loadAdministrators],
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

      await loadAdministrators({
        requestedPage: 1,
        query,
        append: false,
      });
    } catch (error) {
      console.log('Administrator search error:', error);

      Alert.alert(
        'Administrators',
        error?.message || 'Could not search administrators.',
      );
    } finally {
      setSearching(false);
    }
  }, [search, loadAdministrators]);

  const handleClearSearch = useCallback(async () => {
    try {
      setSearch('');

      searchRef.current = '';

      setSearching(true);

      await loadAdministrators({
        requestedPage: 1,
        query: '',
        append: false,
      });
    } catch (error) {
      console.log('Clear administrator search error:', error);
    } finally {
      setSearching(false);
    }
  }, [loadAdministrators]);

  const loadNextPage = useCallback(async () => {
    if (loadingMore || page >= lastPage) {
      return;
    }

    try {
      setLoadingMore(true);

      await loadAdministrators({
        requestedPage: page + 1,

        query: searchRef.current,

        append: true,
      });
    } catch (error) {
      console.log('Load more administrators error:', error);

      Alert.alert(
        'Administrators',
        error?.message || 'Could not load more administrators.',
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, page, lastPage, loadAdministrators]);

  const handleIdentityCards = useCallback(async () => {
    try {
      setIdentityCardsModalVisible(true);
      setIdentityCardsLoading(true);

      setIdentityCardRows([]);
      setIdentityCardIds([]);
      setSelectedIdentityCardIds(new Set());

      setIdentityCardMeta(null);

      setIdentityCardSearch('');
      setIdentityCardAppliedSearch('');

      await loadIdentityCardCandidates({
        requestedPage: 1,
        resetSelection: true,
      });
    } catch (error) {
      console.log('Administrator identity cards error:', error);

      setIdentityCardsModalVisible(false);

      Alert.alert(
        'Identity Cards',
        error?.message || 'Could not load identity card candidates.',
      );
    } finally {
      setIdentityCardsLoading(false);
    }
  }, [loadIdentityCardCandidates]);

  const handleCloseIdentityCards = useCallback(() => {
    if (identityCardsDownloading) {
      return;
    }

    setIdentityCardsModalVisible(false);

    setIdentityCardRows([]);
    setIdentityCardIds([]);

    setSelectedIdentityCardIds(new Set());

    setIdentityCardMeta(null);

    setIdentityCardSearch('');
    setIdentityCardAppliedSearch('');
  }, [identityCardsDownloading]);

  const toggleIdentityCardSelection = useCallback(userId => {
    const id = Number(userId);

    if (!Number.isFinite(id)) {
      return;
    }

    setSelectedIdentityCardIds(current => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const allIdentityCardsSelected =
    identityCardIds.length > 0 &&
    identityCardIds.every(id => selectedIdentityCardIds.has(Number(id)));

  const handleToggleAllIdentityCards = useCallback(() => {
    if (allIdentityCardsSelected) {
      setSelectedIdentityCardIds(new Set());

      return;
    }

    setSelectedIdentityCardIds(new Set(identityCardIds.map(Number)));
  }, [allIdentityCardsSelected, identityCardIds]);

  const handleDownloadData = useCallback(async () => {
    if (downloadingData) {
      return;
    }

    let tempPath = null;

    try {
      setDownloadingData(true);

      const token = await getToken();

      const url = absoluteUrl('/api/administrators/download.zip');

      const datePart = new Date().toISOString().slice(0, 10);

      const fileName = `Administrators-${datePart}.zip`;

      const headers = {
        Accept: 'application/zip',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: 'zip',
      }).fetch('GET', url, headers);

      const status = Number(response.info()?.status);

      if (!Number.isFinite(status) || status < 200 || status >= 300) {
        throw new Error(`Download failed with HTTP ${status || 'unknown'}.`);
      }

      tempPath = response.path();

      if (!tempPath) {
        throw new Error('Downloaded file path was not returned.');
      }

      if (Platform.OS === 'android') {
        await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
          {
            name: fileName,

            parentFolder: 'Administrators',

            mimeType: 'application/zip',
          },
          'Download',
          tempPath,
        );

        Alert.alert(
          'Download Complete',
          `Administrator data has been saved to:\n\nDownloads/Administrators\n\n${fileName}`,
        );

        return;
      }

      const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

      await ReactNativeBlobUtil.fs.cp(tempPath, destination);

      Alert.alert(
        'Download Complete',
        'Administrator data has been saved successfully.',
      );
    } catch (error) {
      console.log('Administrator data download error:', error);

      Alert.alert(
        'Download Data',
        error?.message || 'Could not download administrator data.',
      );
    } finally {
      if (tempPath) {
        try {
          const exists = await ReactNativeBlobUtil.fs.exists(tempPath);

          if (exists) {
            await ReactNativeBlobUtil.fs.unlink(tempPath);
          }
        } catch (cleanupError) {
          console.log('Administrator download cleanup error:', cleanupError);
        }
      }

      setDownloadingData(false);
    }
  }, [downloadingData]);

  const loadIdentityCardCandidates = useCallback(
    async ({ requestedPage = 1, resetSelection = false } = {}) => {
      const response = await api(
        `/api/students/id-card-candidates?card_type=admin&page=${encodeURIComponent(
          requestedPage,
        )}&per_page=20`,
      );

      const rows = Array.isArray(response?.rows) ? response.rows : [];

      const ids = Array.isArray(response?.ids)
        ? response.ids.map(Number).filter(Number.isFinite)
        : [];

      setIdentityCardRows(rows);
      setIdentityCardIds(ids);
      setIdentityCardMeta(response?.meta || null);

      if (resetSelection) {
        setSelectedIdentityCardIds(new Set(ids));
      }
    },
    [],
  );

  const handleGenerateCredentials = useCallback(async () => {
    const userIds = admins
      .map(item => Number(item?.id))
      .filter(Number.isFinite);

    if (userIds.length === 0) {
      Alert.alert('Generate Credentials', 'No administrators are available.');

      return;
    }

    try {
      setAdminCredentialsModalVisible(true);
      setAdminCredentialsLoading(true);
      setAdminCredentialRows([]);

      const response = await api('/api/personnel/credentials/preview', {
        method: 'POST',

        body: JSON.stringify({
          role: 'admin',
          user_ids: userIds,
        }),
      });

      const rows = Array.isArray(response?.rows) ? response.rows : [];

      if (rows.length === 0) {
        throw new Error('Credential preview was not returned.');
      }

      setAdminCredentialRows(
        rows.map(row => ({
          ...row,

          username: String(row?.username || ''),

          password: String(row?.password || ''),
        })),
      );
    } catch (error) {
      console.log('Bulk administrator credential preview error:', error);

      setAdminCredentialsModalVisible(false);
      setAdminCredentialRows([]);

      Alert.alert(
        'Generate Credentials',
        error?.message || 'Could not generate administrator credentials.',
      );
    } finally {
      setAdminCredentialsLoading(false);
    }
  }, [admins]);

  const handleAddAdmin = useCallback(() => {
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminDesignation('');
    setNewAdminPhone('');
    setNewAdminRole('admin');
    setNewAdminPhoto(null);

    setSelectedLocationIds([]);
    setLocationSearch('');

    setCreateAdminModalVisible(true);
  }, []);

  const handleCloseCreateAdmin = useCallback(() => {
    if (creatingAdmin) {
      return;
    }

    setCreateAdminModalVisible(false);

    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminDesignation('');
    setNewAdminPhone('');
    setNewAdminRole('admin');
    setNewAdminPhoto(null);

    setSelectedLocationIds([]);
    setLocationSearch('');
  }, [creatingAdmin]);

  const handlePickAdminPhoto = useCallback(async () => {
    try {
      const result = await pick({
        type: [types.images],
        allowMultiSelection: false,
      });

      const file = Array.isArray(result) ? result[0] : result;

      if (!file) {
        return;
      }

      const size = Number(file?.size) || 0;

      const maxSize = 5 * 1024 * 1024;

      if (size > maxSize) {
        Alert.alert('Admin Photo', 'Photo must be 5 MB or smaller.');

        return;
      }

      setNewAdminPhoto(file);
    } catch (error) {
      /*
       * Document picker cancellation does not
       * require an error message.
       */
      if (
        String(error?.message || '')
          .toLowerCase()
          .includes('cancel')
      ) {
        return;
      }

      console.log('Admin photo picker error:', error);

      Alert.alert(
        'Admin Photo',
        error?.message || 'Could not select the photo.',
      );
    }
  }, []);

  const toggleAdminLocation = useCallback(locationId => {
    const id = Number(locationId);

    if (!Number.isFinite(id)) {
      return;
    }

    setSelectedLocationIds(current => {
      if (current.includes(id)) {
        return current.filter(itemId => itemId !== id);
      }

      return [...current, id];
    });
  }, []);

  const handleNewAdminRoleChange = useCallback(item => {
    const value = String(item?.value || '');

    setNewAdminRole(value);

    if (value === 'super_admin') {
      setSelectedLocationIds([]);
    }
  }, []);

  const handleCreateAdmin = useCallback(async () => {
    const name = String(newAdminName || '').trim();
    const email = String(newAdminEmail || '').trim();
    const phone = String(newAdminPhone || '').trim();
    const designation = String(newAdminDesignation || '').trim();
    const role = String(newAdminRole || '').trim();

    if (!name) {
      Alert.alert('Create Admin', 'Full Name is required.');

      return;
    }

    if (!email) {
      Alert.alert('Create Admin', 'Email is required.');

      return;
    }

    if (!role) {
      Alert.alert('Create Admin', 'Role is required.');

      return;
    }

    if (creatingAdmin) {
      return;
    }

    let createdAdminId = null;

    try {
      setCreatingAdmin(true);

      const createResponse = await api('/api/administrators', {
        method: 'POST',

        body: JSON.stringify({
          name,
          email,

          phone: phone || null,

          designation: designation || null,

          role,

          location_ids:
            role === 'super_admin' ? [] : selectedLocationIds.map(Number),
        }),
      });

      createdAdminId = Number(createResponse?.data?.id);

      if (
        createResponse?.created !== true ||
        !Number.isFinite(createdAdminId)
      ) {
        throw new Error('Administrator was not created.');
      }

      /*
       * Upload photo only after the administrator
       * record has been created successfully.
       */
      if (newAdminPhoto?.uri) {
        const photoFormData = new FormData();

        photoFormData.append('photo', {
          uri: newAdminPhoto.uri,

          name: newAdminPhoto.name || `admin-${createdAdminId}.jpg`,

          type: newAdminPhoto.type || 'image/jpeg',
        });

        await api(
          `/api/administrators/${encodeURIComponent(createdAdminId)}/photo`,
          {
            method: 'POST',

            body: photoFormData,
          },
        );
      }

      /*
       * Reset and close the modal.
       */
      setCreateAdminModalVisible(false);

      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminDesignation('');
      setNewAdminPhone('');
      setNewAdminRole('admin');
      setNewAdminPhoto(null);

      setSelectedLocationIds([]);
      setLocationSearch('');

      /*
       * Refresh the administrator list.
       */
      await loadAdministrators({
        requestedPage: 1,
        query: searchRef.current,
        append: false,
      });

      Alert.alert(
        'Administrator Created',
        'Administrator created successfully.',
      );
    } catch (error) {
      console.log('Create administrator error:', error);

      /*
       * The administrator may already exist if
       * the photo upload fails after creation.
       */
      if (Number.isFinite(createdAdminId)) {
        setCreateAdminModalVisible(false);

        await loadAdministrators({
          requestedPage: 1,
          query: searchRef.current,
          append: false,
        });

        Alert.alert(
          'Administrator Created',
          'Administrator was created, but the photo could not be uploaded.',
        );
      } else {
        Alert.alert(
          'Create Admin',
          error?.message || 'Could not create the administrator.',
        );
      }
    } finally {
      setCreatingAdmin(false);
    }
  }, [
    newAdminName,
    newAdminEmail,
    newAdminPhone,
    newAdminDesignation,
    newAdminRole,
    selectedLocationIds,
    newAdminPhoto,
    creatingAdmin,
    loadAdministrators,
  ]);

  const handleEditAdmin = useCallback(item => {
    const adminId = Number(item?.id);

    if (!Number.isFinite(adminId)) {
      Alert.alert(
        'Edit Administrator',
        'A valid administrator ID is required.',
      );

      return;
    }

    setEditingAdmin(item);

    setEditAdminName(String(item?.name || ''));

    setEditAdminEmail(String(item?.email || ''));

    setEditAdminDesignation(String(item?.designation || ''));

    setEditAdminPhone(String(item?.phone || ''));

    setEditAdminRole(String(item?.role || 'admin'));

    setEditExistingPhotoUrl(String(item?.photo_url || ''));

    /*
     * This contains the already assigned locations.
     * Keep these even for Super Admin so they are
     * preserved in the PUT payload.
     */
    setEditLocationIds(
      Array.isArray(item?.location_ids)
        ? item.location_ids.map(Number).filter(Number.isFinite)
        : [],
    );

    setEditAdminPhoto(null);
    setEditLocationSearch('');

    setEditAdminModalVisible(true);
  }, []);

  const handleCloseEditAdmin = useCallback(() => {
    if (savingAdmin) {
      return;
    }

    setEditAdminModalVisible(false);

    setEditingAdmin(null);

    setEditAdminName('');
    setEditAdminEmail('');
    setEditAdminDesignation('');
    setEditAdminPhone('');
    setEditAdminRole('');

    setEditAdminPhoto(null);
    setEditExistingPhotoUrl('');

    setEditLocationIds([]);
    setEditLocationSearch('');
  }, [savingAdmin]);

  const handlePickEditAdminPhoto = useCallback(async () => {
    try {
      const result = await pick({
        type: [types.images],
        allowMultiSelection: false,
      });

      const file = Array.isArray(result) ? result[0] : result;

      if (!file) {
        return;
      }

      const size = Number(file?.size) || 0;

      const maxSize = 5 * 1024 * 1024;

      if (size > maxSize) {
        Alert.alert('Admin Photo', 'Photo must be 5 MB or smaller.');

        return;
      }

      setEditAdminPhoto(file);
    } catch (error) {
      const message = String(error?.message || '').toLowerCase();

      if (message.includes('cancel')) {
        return;
      }

      console.log('Edit admin photo picker error:', error);

      Alert.alert(
        'Admin Photo',
        error?.message || 'Could not select the photo.',
      );
    }
  }, []);

  const toggleEditAdminLocation = useCallback(locationId => {
    const id = Number(locationId);

    if (!Number.isFinite(id)) {
      return;
    }

    setEditLocationIds(current => {
      if (current.includes(id)) {
        return current.filter(itemId => itemId !== id);
      }

      return [...current, id];
    });
  }, []);

  const handleEditAdminRoleChange = useCallback(item => {
    const value = String(item?.value || '').trim();

    if (!value) {
      return;
    }

    setEditAdminRole(value);
  }, []);

  const handleSaveAdmin = useCallback(async () => {
    const adminId = Number(editingAdmin?.id);

    const name = String(editAdminName || '').trim();

    const email = String(editAdminEmail || '').trim();

    const phone = String(editAdminPhone || '').trim();

    const designation = String(editAdminDesignation || '').trim();

    const role = String(editAdminRole || '').trim();

    if (!Number.isFinite(adminId)) {
      Alert.alert('Edit Admin', 'A valid administrator ID is required.');

      return;
    }

    if (!name) {
      Alert.alert('Edit Admin', 'Full Name is required.');

      return;
    }

    if (!email) {
      Alert.alert('Edit Admin', 'Email is required.');

      return;
    }

    if (!role) {
      Alert.alert('Edit Admin', 'Role is required.');

      return;
    }

    if (savingAdmin) {
      return;
    }

    let profileUpdated = false;

    try {
      setSavingAdmin(true);

      /*
       * Step 1: Update administrator details.
       */
      const response = await api(
        `/api/administrators/${encodeURIComponent(adminId)}`,
        {
          method: 'PUT',

          body: JSON.stringify({
            name,
            email,

            phone: phone || null,

            designation: designation || null,

            role,

            location_ids: editLocationIds.map(Number),
          }),
        },
      );

      if (!response?.data) {
        throw new Error('Updated administrator was not returned.');
      }

      profileUpdated = true;

      /*
       * Step 2: Upload a new photo only when
       * the user has selected one.
       */
      if (editAdminPhoto?.uri) {
        const formData = new FormData();

        formData.append('photo', {
          uri: editAdminPhoto.uri,

          name: editAdminPhoto.name || `admin-${adminId}.jpg`,

          type: editAdminPhoto.type || 'image/jpeg',
        });

        await api(`/api/administrators/${encodeURIComponent(adminId)}/photo`, {
          method: 'POST',

          body: formData,
        });
      }

      setEditAdminModalVisible(false);

      setEditingAdmin(null);

      setEditAdminName('');
      setEditAdminEmail('');
      setEditAdminDesignation('');
      setEditAdminPhone('');
      setEditAdminRole('');

      setEditAdminPhoto(null);
      setEditExistingPhotoUrl('');

      setEditLocationIds([]);
      setEditLocationSearch('');

      /*
       * Step 3: Refresh administrator list.
       */
      await loadAdministrators({
        requestedPage: 1,
        query: searchRef.current,
        append: false,
      });

      Alert.alert(
        'Administrator Updated',
        'Administrator updated successfully.',
      );
    } catch (error) {
      console.log('Update administrator error:', error);

      /*
       * PUT may have succeeded while the
       * separate photo upload failed.
       */
      if (profileUpdated) {
        setEditAdminModalVisible(false);

        await loadAdministrators({
          requestedPage: 1,
          query: searchRef.current,
          append: false,
        });

        Alert.alert(
          'Administrator Updated',
          'Administrator details were updated, but the new photo could not be uploaded.',
        );

        return;
      }

      Alert.alert(
        'Edit Admin',
        error?.message || 'Could not update the administrator.',
      );
    } finally {
      setSavingAdmin(false);
    }
  }, [
    editingAdmin?.id,
    editAdminName,
    editAdminEmail,
    editAdminPhone,
    editAdminDesignation,
    editAdminRole,
    editLocationIds,
    editAdminPhoto,
    savingAdmin,
    loadAdministrators,
  ]);

  const handleDeleteAdmin = useCallback(
    item => {
      const adminId = Number(item?.id);

      if (!Number.isFinite(adminId)) {
        Alert.alert(
          'Remove Admin Access',
          'A valid administrator ID is required.',
        );

        return;
      }

      const email = String(item?.email || '').trim();

      const confirmationMessage = email
        ? `Remove admin access for ${email}?`
        : 'Remove admin access for this administrator?';

      Alert.alert('Remove Admin Access', confirmationMessage, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',

          onPress: async () => {
            if (deletingAdminId !== null) {
              return;
            }

            try {
              setDeletingAdminId(adminId);

              const response = await api(
                `/api/administrators/${encodeURIComponent(adminId)}`,
                {
                  method: 'DELETE',
                },
              );

              if (response?.ok !== true) {
                throw new Error('Admin access could not be removed.');
              }

              await loadAdministrators({
                requestedPage: 1,
                query: searchRef.current,
                append: false,
              });

              Alert.alert(
                'Admin Access Removed',
                'Administrator access removed successfully.',
              );
            } catch (error) {
              console.log('Delete administrator error:', error);

              Alert.alert(
                'Remove Admin Access',
                error?.message || 'Could not remove administrator access.',
              );
            } finally {
              setDeletingAdminId(null);
            }
          },
        },
      ]);
    },
    [deletingAdminId, loadAdministrators],
  );

  const handleShowCredentials = useCallback(async item => {
    const userId = Number(item?.id);

    if (!Number.isFinite(userId)) {
      Alert.alert(
        'Credentials Message',
        'A valid administrator ID is required.',
      );

      return;
    }

    try {
      setCredentialsMessageModalVisible(true);
      setCredentialsMessageLoading(true);
      setCredentialsMessageData(null);

      const response = await api(
        `/api/personnel/${encodeURIComponent(
          userId,
        )}/credentials/message?role=admin`,
      );

      if (!response?.message) {
        throw new Error('Credentials message was not returned.');
      }

      setCredentialsMessageData({
        ...response,

        user_id: userId,

        name: String(item?.name || ''),
      });
    } catch (error) {
      console.log('Administrator credentials message error:', error);

      setCredentialsMessageModalVisible(false);

      Alert.alert(
        'Credentials Message',
        error?.message || 'Could not load credentials message.',
      );
    } finally {
      setCredentialsMessageLoading(false);
    }
  }, []);

  const handleCloseCredentialsMessage = useCallback(() => {
    if (sendingCredentialsEmail) {
      return;
    }

    setCredentialsMessageModalVisible(false);
    setCredentialsMessageData(null);
  }, [sendingCredentialsEmail]);

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
      Alert.alert('Send Email', 'A valid administrator ID is required.');

      return;
    }

    if (!credentialsMessageData?.email) {
      Alert.alert(
        'Send Email',
        'This administrator does not have an email address.',
      );

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
            role: 'admin',
          }),
        },
      );

      if (response?.ok !== true) {
        throw new Error('Credentials email could not be sent.');
      }

      Alert.alert('Email Sent', 'The credentials email was sent successfully.');
    } catch (error) {
      console.log('Administrator credentials email error:', error);

      Alert.alert(
        'Send Email',
        error?.message || 'Could not send credentials email.',
      );
    } finally {
      setSendingCredentialsEmail(false);
    }
  }, [
    credentialsMessageData?.user_id,
    credentialsMessageData?.email,
    sendingCredentialsEmail,
  ]);

  const handleCredentialAction = useCallback(async item => {
    const userId = Number(item?.id);

    if (!Number.isFinite(userId)) {
      Alert.alert(
        'Administrator Credentials',
        'A valid administrator ID is required.',
      );

      return;
    }

    try {
      setAdminCredentialsModalVisible(true);
      setAdminCredentialsLoading(true);
      setAdminCredentialRows([]);

      const response = await api('/api/personnel/credentials/preview', {
        method: 'POST',

        body: JSON.stringify({
          role: 'admin',
          user_ids: [userId],
        }),
      });

      const rows = Array.isArray(response?.rows) ? response.rows : [];

      if (rows.length === 0) {
        throw new Error('Credential preview was not returned.');
      }

      setAdminCredentialRows(
        rows.map(row => ({
          ...row,

          username: String(row?.username || ''),

          password: String(row?.password || ''),
        })),
      );
    } catch (error) {
      console.log('Administrator credential preview error:', error);

      setAdminCredentialsModalVisible(false);
      setAdminCredentialRows([]);

      Alert.alert(
        'Administrator Credentials',
        error?.message || 'Could not generate credential preview.',
      );
    } finally {
      setAdminCredentialsLoading(false);
    }
  }, []);

  const handleAdminCredentialUsernameChange = useCallback((userId, value) => {
    setAdminCredentialRows(current =>
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

  const handleAdminCredentialPasswordChange = useCallback((userId, value) => {
    setAdminCredentialRows(current =>
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

  const handleCloseAdminCredentialsModal = useCallback(() => {
    if (adminCredentialsSaving) {
      return;
    }

    setAdminCredentialsModalVisible(false);
    setAdminCredentialRows([]);
  }, [adminCredentialsSaving]);

  const handleSaveAdminCredentials = useCallback(async () => {
    if (adminCredentialsSaving || adminCredentialRows.length === 0) {
      return;
    }

    const credentials = adminCredentialRows.map(row => ({
      user_id: Number(row?.user_id),

      username: String(row?.username || '').trim(),

      password: String(row?.password || '').trim(),
    }));

    const invalidRow = credentials.find(
      row => !Number.isFinite(row.user_id) || !row.username || !row.password,
    );

    if (invalidRow) {
      Alert.alert(
        'Administrator Credentials',
        'Username and password are required.',
      );

      return;
    }

    try {
      setAdminCredentialsSaving(true);

      const response = await api('/api/personnel/credentials', {
        method: 'POST',

        body: JSON.stringify({
          role: 'admin',
          credentials,
        }),
      });

      const savedRows = Array.isArray(response?.rows) ? response.rows : [];

      if (savedRows.length === 0) {
        throw new Error('Credentials were not saved.');
      }

      setAdminCredentialsModalVisible(false);
      setAdminCredentialRows([]);

      await loadAdministrators({
        requestedPage: 1,
        query: searchRef.current,
        append: false,
      });

      Alert.alert(
        'Credentials Saved',
        'Administrator credentials saved successfully.',
      );
    } catch (error) {
      console.log('Save administrator credentials error:', error);

      Alert.alert(
        'Administrator Credentials',
        error?.message || 'Could not save administrator credentials.',
      );
    } finally {
      setAdminCredentialsSaving(false);
    }
  }, [adminCredentialsSaving, adminCredentialRows, loadAdministrators]);

  const adminRoleOptions = useMemo(() => {
    const options = Array.isArray(meta?.role_options) ? meta.role_options : [];

    return options.map(item => ({
      label: item?.label || item?.value || 'Role',
      value: String(item?.value || ''),
    }));
  }, [meta?.role_options]);

  const filteredLocations = useMemo(() => {
    const locations = Array.isArray(meta?.locations) ? meta.locations : [];

    const query = locationSearch.trim().toLowerCase();

    if (!query) {
      return locations;
    }

    return locations.filter(item =>
      String(item?.name || '')
        .toLowerCase()
        .includes(query),
    );
  }, [meta?.locations, locationSearch]);

  const filteredEditLocations = useMemo(() => {
    const locations = Array.isArray(meta?.locations) ? meta.locations : [];

    const query = String(editLocationSearch || '')
      .trim()
      .toLowerCase();

    if (!query) {
      return locations;
    }

    return locations.filter(item =>
      String(item?.name || '')
        .toLowerCase()
        .includes(query),
    );
  }, [meta?.locations, editLocationSearch]);

  const visibleIdentityCardRows = useMemo(() => {
    const query = String(identityCardAppliedSearch || '')
      .trim()
      .toLowerCase();

    if (!query) {
      return identityCardRows;
    }

    return identityCardRows.filter(item => {
      const name = String(item?.name || '').toLowerCase();

      const role = String(item?.role || '').toLowerCase();

      return name.includes(query) || role.includes(query);
    });
  }, [identityCardRows, identityCardAppliedSearch]);

  const handleIdentityCardSearch = useCallback(() => {
    setIdentityCardAppliedSearch(identityCardSearch.trim());
  }, [identityCardSearch]);

  const handleClearIdentityCardSearch = useCallback(() => {
    setIdentityCardSearch('');
    setIdentityCardAppliedSearch('');
  }, []);

  const handleIdentityCardPageChange = useCallback(
    async nextPage => {
      const pageNumber = Number(nextPage);

      if (
        !Number.isFinite(pageNumber) ||
        pageNumber < 1 ||
        pageNumber > Number(identityCardMeta?.last_page || 1)
      ) {
        return;
      }

      try {
        setIdentityCardsLoading(true);

        await loadIdentityCardCandidates({
          requestedPage: pageNumber,
          resetSelection: false,
        });
      } catch (error) {
        console.log('Identity card pagination error:', error);

        Alert.alert(
          'Identity Cards',
          error?.message || 'Could not load identity card candidates.',
        );
      } finally {
        setIdentityCardsLoading(false);
      }
    },
    [identityCardMeta?.last_page, loadIdentityCardCandidates],
  );

  const handleDownloadIdentityCards = useCallback(async () => {
    if (identityCardsDownloading) {
      return;
    }

    const selectedIds = Array.from(selectedIdentityCardIds)
      .map(Number)
      .filter(Number.isFinite);

    if (selectedIds.length === 0) {
      Alert.alert('Identity Cards', 'Select at least one administrator.');

      return;
    }

    let tempPath = null;

    try {
      setIdentityCardsDownloading(true);

      const token = await getToken();

      const cardIds = selectedIds.join(',');

      const url = absoluteUrl(
        `/students/identity-cards/pdf?card_type=admin&card_ids=${encodeURIComponent(
          cardIds,
        )}`,
      );

      const now = new Date();

      const datePart = now.toISOString().slice(0, 10);

      const timePart = [
        String(now.getHours()).padStart(2, '0'),

        String(now.getMinutes()).padStart(2, '0'),

        String(now.getSeconds()).padStart(2, '0'),
      ].join('-');

      const fileName = `Administrator-Identity-Cards-${datePart}-${timePart}.pdf`;

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

      const status = Number(response.info()?.status);

      if (!Number.isFinite(status) || status < 200 || status >= 300) {
        throw new Error(`Download failed with HTTP ${status || 'unknown'}.`);
      }

      tempPath = response.path();

      if (!tempPath) {
        throw new Error('Downloaded PDF path was not returned.');
      }

      if (Platform.OS === 'android') {
        await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
          {
            name: fileName,

            parentFolder: 'IdentityCards/Administrators',

            mimeType: 'application/pdf',
          },
          'Download',
          tempPath,
        );

        Alert.alert(
          'Download Complete',
          `Identity cards saved to:\n\nDownloads/IdentityCards/Administrators\n\n${fileName}`,
        );

        return;
      }

      const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

      await ReactNativeBlobUtil.fs.cp(tempPath, destination);

      Alert.alert(
        'Download Complete',
        'Administrator identity cards were saved successfully.',
      );
    } catch (error) {
      console.log('Administrator identity card download error:', error);

      Alert.alert(
        'Identity Cards',
        error?.message || 'Could not download identity cards.',
      );
    } finally {
      if (tempPath) {
        try {
          const exists = await ReactNativeBlobUtil.fs.exists(tempPath);

          if (exists) {
            await ReactNativeBlobUtil.fs.unlink(tempPath);
          }
        } catch (cleanupError) {
          console.log('Identity card temp cleanup error:', cleanupError);
        }
      }

      setIdentityCardsDownloading(false);
    }
  }, [selectedIdentityCardIds, identityCardsDownloading]);

  const isEditSuperAdminRole = editAdminRole === 'super_admin';

  const isSuperAdminRole = newAdminRole === 'super_admin';

  const renderAdministrator = useCallback(
    ({ item }) => {
      const photoUrl = String(item?.photo_url || '').trim();

      const currentUser = Number(item?.id) === Number(meta?.current_user_id);

      return (
        <View style={styles.adminCard}>
          <View style={styles.adminTop}>
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

            <View style={styles.adminInfo}>
              <Text style={styles.adminName}>
                {item?.name || 'Administrator'}
              </Text>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={14}
                  color="#AFC0D8"
                />

                <Text style={styles.infoText} numberOfLines={1}>
                  {item?.email || 'No email'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={14}
                  color="#AFC0D8"
                />

                <Text style={styles.infoText}>{item?.phone || 'No phone'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Role</Text>

              <Text style={styles.detailValue}>
                {item?.role_label || item?.role || 'Administrator'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Locations</Text>

              <Text style={styles.detailValue}>{getLocationsText(item)}</Text>
            </View>

            {item?.designation ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Designation</Text>

                <Text style={styles.detailValue}>{item.designation}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.adminActions}>
            <View style={styles.topActionRow}>
              <Pressable
                onPress={() => handleEditAdmin(item)}
                style={({ pressed }) => [
                  styles.editButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>

              <Pressable
                disabled={currentUser || deletingAdminId === Number(item?.id)}
                onPress={() => handleDeleteAdmin(item)}
                style={({ pressed }) => [
                  styles.deleteButton,

                  (currentUser || deletingAdminId === Number(item?.id)) &&
                    styles.controlDisabled,

                  pressed &&
                    !currentUser &&
                    deletingAdminId !== Number(item?.id) &&
                    styles.controlPressed,
                ]}
              >
                {deletingAdminId === Number(item?.id) ? (
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
      meta?.current_user_id,
      deletingAdminId,
      handleEditAdmin,
      handleDeleteAdmin,
      handleShowCredentials,
      handleCredentialAction,
    ],
  );

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading administrators...</Text>
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
        data={admins}
        keyExtractor={item => String(item?.id)}
        renderItem={renderAdministrator}
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
                    <>
                      <ActivityIndicator size="small" color="#FFFFFF" />

                      <Text style={styles.secondaryTopButtonText}>
                        Downloading...
                      </Text>
                    </>
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
                  onPress={handleAddAdmin}
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

                  <Text style={styles.primaryTopButtonText}>Add Admin</Text>
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
              <Text style={styles.listHeadingTitle}>Administrators</Text>

              <Text style={styles.listHeadingMeta}>
                {totalCount}{' '}
                {totalCount === 1 ? 'administrator' : 'administrators'}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="account-tie-outline"
              size={40}
              color="#718096"
            />

            <Text style={styles.emptyTitle}>No administrators found</Text>

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
        visible={createAdminModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseCreateAdmin}
      >
        <View style={styles.createAdminBackdrop}>
          <View style={styles.createAdminModal}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.createAdminContent}
            >
              <View style={styles.createAdminHeader}>
                <Text style={styles.createAdminTitle}>Create Admin</Text>

                <Pressable
                  disabled={creatingAdmin}
                  onPress={handleCloseCreateAdmin}
                  style={({ pressed }) => [
                    styles.createAdminCloseButton,
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

              <Text style={styles.createAdminLabel}>Full Name</Text>

              <TextInput
                value={newAdminName}
                onChangeText={setNewAdminName}
                editable={!creatingAdmin}
                placeholder="Jane Doe"
                placeholderTextColor="#718096"
                style={styles.createAdminInput}
              />

              <Text style={styles.createAdminLabel}>Email</Text>

              <TextInput
                value={newAdminEmail}
                onChangeText={setNewAdminEmail}
                editable={!creatingAdmin}
                placeholder="jane@example.com"
                placeholderTextColor="#718096"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.createAdminInput}
              />

              <Text style={styles.createAdminLabel}>
                Designation (optional)
              </Text>

              <TextInput
                value={newAdminDesignation}
                onChangeText={setNewAdminDesignation}
                editable={!creatingAdmin}
                placeholder="Principal"
                placeholderTextColor="#718096"
                style={styles.createAdminInput}
              />

              <Text style={styles.createAdminLabel}>
                Photo (JPG, PNG, or WebP; max 5 MB)
              </Text>

              <Pressable
                disabled={creatingAdmin}
                onPress={handlePickAdminPhoto}
                style={({ pressed }) => [
                  styles.photoPicker,
                  pressed && styles.controlPressed,
                ]}
              >
                <View style={styles.photoPreviewCircle}>
                  {newAdminPhoto?.uri ? (
                    <Image
                      source={{
                        uri: newAdminPhoto.uri,
                      }}
                      style={styles.createAdminPhoto}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.photoInitial}>
                      {newAdminName
                        ? getInitials(newAdminName).slice(0, 1)
                        : 'A'}
                    </Text>
                  )}
                </View>

                <View style={styles.photoFileArea}>
                  <MaterialCommunityIcons
                    name="paperclip"
                    size={17}
                    color="#DCE7F5"
                  />

                  <Text style={styles.photoFileText} numberOfLines={1}>
                    {newAdminPhoto?.name || 'Choose File'}
                  </Text>
                </View>
              </Pressable>

              <Text style={styles.createAdminLabel}>Phone</Text>

              <TextInput
                value={newAdminPhone}
                onChangeText={setNewAdminPhone}
                editable={!creatingAdmin}
                placeholder="+91 90000 00000"
                placeholderTextColor="#718096"
                keyboardType="phone-pad"
                style={styles.createAdminInput}
              />

              <Text style={styles.createAdminLabel}>Role</Text>

              <Dropdown
                style={styles.createAdminDropdown}
                containerStyle={styles.createAdminDropdownContainer}
                selectedTextStyle={styles.createAdminDropdownText}
                itemTextStyle={styles.createAdminDropdownItemText}
                placeholderStyle={styles.createAdminDropdownPlaceholder}
                activeColor="#173B60"
                iconColor="#DCE7F5"
                data={adminRoleOptions}
                labelField="label"
                valueField="value"
                value={newAdminRole}
                placeholder="Select role"
                onChange={handleNewAdminRoleChange}
              />

              {!isSuperAdminRole ? (
                <>
                  <Text style={styles.createAdminLabel}>Locations</Text>

                  <View style={styles.locationBox}>
                    <View style={styles.locationSearchBox}>
                      <MaterialCommunityIcons
                        name="magnify"
                        size={18}
                        color="#94A3B8"
                      />

                      <TextInput
                        value={locationSearch}
                        onChangeText={setLocationSearch}
                        placeholder="Filter locations..."
                        placeholderTextColor="#718096"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.locationSearchInput}
                      />
                    </View>

                    {filteredLocations.map(location => {
                      const locationId = Number(location?.id);

                      const selected = selectedLocationIds.includes(locationId);

                      return (
                        <Pressable
                          key={String(locationId)}
                          onPress={() => toggleAdminLocation(locationId)}
                          style={({ pressed }) => [
                            styles.locationOption,
                            selected && styles.locationOptionSelected,
                            pressed && styles.controlPressed,
                          ]}
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

                          <Text style={styles.locationOptionText}>
                            {location?.name || 'Location'}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Text style={styles.locationStatusText}>
                    {selectedLocationIds.length === 0
                      ? 'No locations selected.'
                      : `${selectedLocationIds.length} location${
                          selectedLocationIds.length === 1 ? '' : 's'
                        } selected.`}
                  </Text>

                  <Text style={styles.locationHelpText}>
                    Admins can access only the locations selected here. Super
                    admins automatically get all locations.
                  </Text>
                </>
              ) : (
                <Text style={styles.superAdminHelp}>
                  Super admins automatically get access to all locations.
                </Text>
              )}

              <View style={styles.createAdminActions}>
                <Pressable
                  disabled={creatingAdmin}
                  onPress={handleCloseCreateAdmin}
                  style={({ pressed }) => [
                    styles.createAdminCancelButton,
                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.createAdminCancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={creatingAdmin}
                  onPress={handleCreateAdmin}
                  style={({ pressed }) => [
                    styles.createAdminCreateButton,

                    creatingAdmin && styles.controlDisabled,

                    pressed && !creatingAdmin && styles.controlPressed,
                  ]}
                >
                  {creatingAdmin ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.createAdminCreateText}>Create</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        visible={editAdminModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseEditAdmin}
      >
        <View style={styles.createAdminBackdrop}>
          <View style={styles.createAdminModal}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.createAdminContent}
            >
              <View style={styles.createAdminHeader}>
                <Text style={styles.createAdminTitle}>Edit Admin</Text>

                <Pressable
                  disabled={savingAdmin}
                  onPress={handleCloseEditAdmin}
                  style={({ pressed }) => [
                    styles.createAdminCloseButton,

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

              <Text style={styles.createAdminLabel}>Full Name</Text>

              <TextInput
                value={editAdminName}
                onChangeText={setEditAdminName}
                editable={!savingAdmin}
                placeholder="Jane Doe"
                placeholderTextColor="#718096"
                style={styles.createAdminInput}
              />

              <Text style={styles.createAdminLabel}>Email</Text>

              <TextInput
                value={editAdminEmail}
                onChangeText={setEditAdminEmail}
                editable={!savingAdmin}
                placeholder="jane@example.com"
                placeholderTextColor="#718096"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.createAdminInput}
              />

              <Text style={styles.createAdminLabel}>
                Designation (optional)
              </Text>

              <TextInput
                value={editAdminDesignation}
                onChangeText={setEditAdminDesignation}
                editable={!savingAdmin}
                placeholder="Principal"
                placeholderTextColor="#718096"
                style={styles.createAdminInput}
              />

              <Text style={styles.createAdminLabel}>
                Photo (JPG, PNG, or WebP; max 5 MB)
              </Text>

              <Pressable
                disabled={savingAdmin}
                onPress={handlePickEditAdminPhoto}
                style={({ pressed }) => [
                  styles.photoPicker,

                  pressed && styles.controlPressed,
                ]}
              >
                <View style={styles.photoPreviewCircle}>
                  {editAdminPhoto?.uri ? (
                    <Image
                      source={{
                        uri: editAdminPhoto.uri,
                      }}
                      style={styles.createAdminPhoto}
                      resizeMode="cover"
                    />
                  ) : editExistingPhotoUrl ? (
                    <Image
                      source={{
                        uri: editExistingPhotoUrl,
                      }}
                      style={styles.createAdminPhoto}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.photoInitial}>
                      {editAdminName
                        ? getInitials(editAdminName).slice(0, 1)
                        : 'A'}
                    </Text>
                  )}
                </View>

                <View style={styles.photoFileArea}>
                  <MaterialCommunityIcons
                    name="paperclip"
                    size={17}
                    color="#DCE7F5"
                  />

                  <Text style={styles.photoFileText} numberOfLines={1}>
                    {editAdminPhoto?.name || 'Choose File'}
                  </Text>
                </View>
              </Pressable>

              <Text style={styles.createAdminLabel}>Phone</Text>

              <TextInput
                value={editAdminPhone}
                onChangeText={setEditAdminPhone}
                editable={!savingAdmin}
                placeholder="+91 90000 00000"
                placeholderTextColor="#718096"
                keyboardType="phone-pad"
                style={styles.createAdminInput}
              />

              <Text style={styles.createAdminLabel}>Role</Text>

              <Dropdown
                style={styles.createAdminDropdown}
                containerStyle={styles.createAdminDropdownContainer}
                selectedTextStyle={styles.createAdminDropdownText}
                itemTextStyle={styles.createAdminDropdownItemText}
                placeholderStyle={styles.createAdminDropdownPlaceholder}
                activeColor="#173B60"
                iconColor="#DCE7F5"
                data={adminRoleOptions}
                labelField="label"
                valueField="value"
                value={editAdminRole}
                placeholder="Select role"
                onChange={handleEditAdminRoleChange}
              />

              {!isEditSuperAdminRole ? (
                <>
                  <Text style={styles.createAdminLabel}>Locations</Text>

                  <View style={styles.locationBox}>
                    <View style={styles.locationSearchBox}>
                      <MaterialCommunityIcons
                        name="magnify"
                        size={18}
                        color="#94A3B8"
                      />

                      <TextInput
                        value={editLocationSearch}
                        onChangeText={setEditLocationSearch}
                        placeholder="Filter locations..."
                        placeholderTextColor="#718096"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.locationSearchInput}
                      />
                    </View>

                    {filteredEditLocations.map(location => {
                      const locationId = Number(location?.id);

                      const selected = editLocationIds.includes(locationId);

                      return (
                        <Pressable
                          key={String(locationId)}
                          onPress={() => toggleEditAdminLocation(locationId)}
                          style={({ pressed }) => [
                            styles.locationOption,

                            selected && styles.locationOptionSelected,

                            pressed && styles.controlPressed,
                          ]}
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

                          <Text style={styles.locationOptionText}>
                            {location?.name || 'Location'}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Text style={styles.locationStatusText}>
                    {editLocationIds.length === 0
                      ? 'No locations selected.'
                      : `${editLocationIds.length} location${
                          editLocationIds.length === 1 ? '' : 's'
                        } selected.`}
                  </Text>

                  <Text style={styles.locationHelpText}>
                    Admins can access only the locations selected here.
                  </Text>
                </>
              ) : (
                <Text style={styles.superAdminHelp}>
                  Super admins automatically get access to all locations.
                </Text>
              )}

              <View style={styles.createAdminActions}>
                <Pressable
                  disabled={savingAdmin}
                  onPress={handleCloseEditAdmin}
                  style={({ pressed }) => [
                    styles.createAdminCancelButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.createAdminCancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={savingAdmin}
                  onPress={handleSaveAdmin}
                  style={({ pressed }) => [
                    styles.createAdminCreateButton,

                    savingAdmin && styles.controlDisabled,

                    pressed && !savingAdmin && styles.controlPressed,
                  ]}
                >
                  {savingAdmin ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.createAdminCreateText}>Save</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        visible={adminCredentialsModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseAdminCredentialsModal}
      >
        <View style={styles.adminCredentialsBackdrop}>
          <View style={styles.adminCredentialsModal}>
            <View style={styles.adminCredentialsHeader}>
              <View style={styles.adminCredentialsHeaderText}>
                <Text style={styles.adminCredentialsTitle}>
                  Generate Administrator Credentials
                </Text>

                <Text style={styles.adminCredentialsSubtitle}>
                  Review usernames and passwords before saving. Usernames are
                  unique across every account type.
                </Text>
              </View>

              <Pressable
                disabled={adminCredentialsSaving}
                onPress={handleCloseAdminCredentialsModal}
                style={({ pressed }) => [
                  styles.adminCredentialsCloseButton,

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

            {adminCredentialsLoading ? (
              <View style={styles.adminCredentialsLoader}>
                <ActivityIndicator size="large" color="#67D1F0" />

                <Text style={styles.adminCredentialsLoadingText}>
                  Generating credentials...
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.adminCredentialsRows}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {adminCredentialRows.map(row => (
                  <View
                    key={String(row?.user_id)}
                    style={styles.adminCredentialCard}
                  >
                    <View style={styles.adminCredentialIdentity}>
                      <Text style={styles.adminCredentialName}>
                        {row?.name || 'Administrator'}
                      </Text>

                      <Text style={styles.adminCredentialEmail}>
                        {row?.email || 'No email'}
                      </Text>

                      <Text
                        style={
                          row?.has_existing_credentials === true
                            ? styles.adminCredentialExistingText
                            : styles.adminCredentialNewText
                        }
                      >
                        {row?.has_existing_credentials === true
                          ? 'Replaces existing credentials'
                          : 'New credentials will be created'}
                      </Text>
                    </View>

                    <Text style={styles.adminCredentialLabel}>Username</Text>

                    <TextInput
                      value={row.username}
                      onChangeText={value =>
                        handleAdminCredentialUsernameChange(row?.user_id, value)
                      }
                      editable={!adminCredentialsSaving}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={styles.adminCredentialInput}
                    />

                    <Text style={styles.adminCredentialLabel}>Password</Text>

                    <TextInput
                      value={row.password}
                      onChangeText={value =>
                        handleAdminCredentialPasswordChange(row?.user_id, value)
                      }
                      editable={!adminCredentialsSaving}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={styles.adminCredentialInput}
                    />
                  </View>
                ))}
              </ScrollView>
            )}

            {!adminCredentialsLoading && adminCredentialRows.length > 0 ? (
              <View style={styles.adminCredentialsFooter}>
                <Pressable
                  disabled={adminCredentialsSaving}
                  onPress={handleCloseAdminCredentialsModal}
                  style={({ pressed }) => [
                    styles.adminCredentialsCancelButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.adminCredentialsCancelText}>Close</Text>
                </Pressable>

                <Pressable
                  disabled={adminCredentialsSaving}
                  onPress={handleSaveAdminCredentials}
                  style={({ pressed }) => [
                    styles.adminCredentialsSaveButton,

                    adminCredentialsSaving && styles.controlDisabled,

                    pressed && !adminCredentialsSaving && styles.controlPressed,
                  ]}
                >
                  {adminCredentialsSaving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.adminCredentialsSaveText}>
                      Save Credentials
                    </Text>
                  )}
                </Pressable>
              </View>
            ) : null}
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
        <View style={styles.credentialsMessageBackdrop}>
          <View style={styles.credentialsMessageModal}>
            <View style={styles.credentialsMessageHeader}>
              <Text style={styles.credentialsMessageTitle}>
                Credentials Message
                {credentialsMessageData?.name
                  ? ` — ${credentialsMessageData.name}`
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

                <Text style={styles.credentialsMessageLoadingText}>
                  Loading credentials message...
                </Text>
              </View>
            ) : credentialsMessageData ? (
              <>
                <ScrollView
                  style={styles.credentialsMessageBody}
                  contentContainerStyle={styles.credentialsMessageBodyContent}
                  showsVerticalScrollIndicator={false}
                >
                  <Text selectable style={styles.credentialsMessageText}>
                    {credentialsMessageData.message}
                  </Text>
                </ScrollView>

                <View style={styles.credentialsMessageFooter}>
                  <Pressable
                    onPress={handleCopyCredentialsMessage}
                    style={({ pressed }) => [
                      styles.credentialsMessageButton,

                      pressed && styles.controlPressed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="content-copy"
                      size={18}
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
                        !!credentialsMessageData?.email &&
                        styles.controlPressed,
                    ]}
                  >
                    {sendingCredentialsEmail ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <MaterialCommunityIcons
                          name="email-outline"
                          size={18}
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
        visible={identityCardsModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseIdentityCards}
      >
        <View style={styles.identityCardsBackdrop}>
          <View style={styles.identityCardsModal}>
            <View style={styles.identityCardsHeader}>
              <Text style={styles.identityCardsTitle}>Identity Cards</Text>

              <Pressable
                disabled={identityCardsDownloading}
                onPress={handleCloseIdentityCards}
                style={({ pressed }) => [
                  styles.identityCardsCloseButton,
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

            <View style={styles.identityCardsSearchRow}>
              <View style={styles.identityCardsSearchBox}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={18}
                  color="#94A3B8"
                />

                <TextInput
                  value={identityCardSearch}
                  onChangeText={setIdentityCardSearch}
                  onSubmitEditing={handleIdentityCardSearch}
                  placeholder="Search by name..."
                  placeholderTextColor="#718096"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="search"
                  style={styles.identityCardsSearchInput}
                />
              </View>

              <Pressable
                onPress={handleIdentityCardSearch}
                style={({ pressed }) => [
                  styles.identityCardsSearchButton,
                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.identityCardsSearchButtonText}>Search</Text>
              </Pressable>

              <Pressable
                onPress={handleClearIdentityCardSearch}
                style={({ pressed }) => [
                  styles.identityCardsClearButton,
                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.identityCardsClearButtonText}>Clear</Text>
              </Pressable>
            </View>

            {identityCardsLoading ? (
              <View style={styles.identityCardsLoader}>
                <ActivityIndicator size="large" color="#67D1F0" />

                <Text style={styles.identityCardsLoadingText}>
                  Loading identity cards...
                </Text>
              </View>
            ) : (
              <>
                <Pressable
                  onPress={handleToggleAllIdentityCards}
                  style={styles.identityCardsSelectAll}
                >
                  <MaterialCommunityIcons
                    name={
                      allIdentityCardsSelected
                        ? 'checkbox-marked'
                        : 'checkbox-blank-outline'
                    }
                    size={20}
                    color={allIdentityCardsSelected ? '#93C5FD' : '#94A3B8'}
                  />

                  <Text style={styles.identityCardsSelectAllText}>
                    Select / Deselect All
                  </Text>
                </Pressable>

                <Text style={styles.identityCardsSelectedText}>
                  {selectedIdentityCardIds.size} selected of{' '}
                  {Number(identityCardMeta?.total) || 0} matching
                </Text>

                <View style={styles.identityCardsTable}>
                  <View style={styles.identityCardsTableHeader}>
                    <View style={styles.identityCheckboxColumn} />

                    <Text
                      style={[
                        styles.identityTableHeaderText,
                        styles.identityRoleColumn,
                      ]}
                    >
                      Role
                    </Text>

                    <Text
                      style={[
                        styles.identityTableHeaderText,
                        styles.identityNameColumn,
                      ]}
                    >
                      Name
                    </Text>
                  </View>

                  <ScrollView
                    style={styles.identityCardsRows}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                  >
                    {visibleIdentityCardRows.map(item => {
                      const id = Number(item?.id);

                      const selected = selectedIdentityCardIds.has(id);

                      return (
                        <Pressable
                          key={String(id)}
                          onPress={() => toggleIdentityCardSelection(id)}
                          style={({ pressed }) => [
                            styles.identityCardRow,

                            pressed && styles.controlPressed,
                          ]}
                        >
                          <View style={styles.identityCheckboxColumn}>
                            <MaterialCommunityIcons
                              name={
                                selected
                                  ? 'checkbox-marked'
                                  : 'checkbox-blank-outline'
                              }
                              size={19}
                              color={selected ? '#93C5FD' : '#94A3B8'}
                            />
                          </View>

                          <Text
                            style={[
                              styles.identityCardCell,
                              styles.identityRoleColumn,
                            ]}
                          >
                            {item?.role || 'STAFF'}
                          </Text>

                          <Text
                            style={[
                              styles.identityCardCell,
                              styles.identityNameColumn,
                            ]}
                            numberOfLines={1}
                          >
                            {item?.name || 'Administrator'}
                          </Text>
                        </Pressable>
                      );
                    })}

                    {visibleIdentityCardRows.length === 0 ? (
                      <Text style={styles.identityCardsEmptyText}>
                        No administrators found.
                      </Text>
                    ) : null}
                  </ScrollView>
                </View>

                <View style={styles.identityPaginationRow}>
                  <Text style={styles.identityPaginationText}>
                    Page {Number(identityCardMeta?.current_page) || 1} of{' '}
                    {Number(identityCardMeta?.last_page) || 1} ·{' '}
                    {Number(identityCardMeta?.total) || 0} matching
                  </Text>

                  <View style={styles.identityPaginationButtons}>
                    <Pressable
                      disabled={Number(identityCardMeta?.current_page) <= 1}
                      onPress={() =>
                        handleIdentityCardPageChange(
                          Number(identityCardMeta?.current_page) - 1,
                        )
                      }
                      style={({ pressed }) => [
                        styles.identityPageButton,

                        Number(identityCardMeta?.current_page) <= 1 &&
                          styles.controlDisabled,

                        pressed && styles.controlPressed,
                      ]}
                    >
                      <Text style={styles.identityPageButtonText}>
                        Previous
                      </Text>
                    </Pressable>

                    <Pressable
                      disabled={
                        Number(identityCardMeta?.current_page) >=
                        Number(identityCardMeta?.last_page)
                      }
                      onPress={() =>
                        handleIdentityCardPageChange(
                          Number(identityCardMeta?.current_page) + 1,
                        )
                      }
                      style={({ pressed }) => [
                        styles.identityPageButton,

                        Number(identityCardMeta?.current_page) >=
                          Number(identityCardMeta?.last_page) &&
                          styles.controlDisabled,

                        pressed && styles.controlPressed,
                      ]}
                    >
                      <Text style={styles.identityPageButtonText}>Next</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.identityCardsFooter}>
                  <Pressable
                    disabled={
                      identityCardsDownloading ||
                      selectedIdentityCardIds.size === 0
                    }
                    onPress={handleDownloadIdentityCards}
                    style={({ pressed }) => [
                      styles.identityDownloadButton,

                      (identityCardsDownloading ||
                        selectedIdentityCardIds.size === 0) &&
                        styles.controlDisabled,

                      pressed &&
                        !identityCardsDownloading &&
                        styles.controlPressed,
                    ]}
                  >
                    {identityCardsDownloading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <MaterialCommunityIcons
                        name="file-pdf-box"
                        size={19}
                        color="#FFFFFF"
                      />
                    )}

                    <Text style={styles.identityDownloadButtonText}>
                      {identityCardsDownloading
                        ? 'Downloading...'
                        : 'Download Identity Cards'}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
