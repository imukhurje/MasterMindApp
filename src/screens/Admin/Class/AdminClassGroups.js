// src/screens/Admin/Class/AdminClassGroups.js

import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Dropdown } from 'react-native-element-dropdown';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api, absoluteUrl, getToken } from '../../../api/client';

import styles from './AdminClassGroups.styles';

import ReactNativeBlobUtil from 'react-native-blob-util';

function getClassLabel(item) {
  const name = String(item?.name || '').trim();

  const section = String(item?.section || '').trim();

  if (!name) {
    return 'Class Group';
  }

  return section ? `${name} (${section})` : name;
}

function getAcademicYearLabel(item) {
  return (
    item?.academic_year?.label ||
    item?.academic_year?.name ||
    item?.academic_year?.code ||
    'No academic year'
  );
}

export default function AdminClassGroups({ navigation }) {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [me, setMe] = useState(null);

  const [onboarding, setOnboarding] = useState(null);

  const [meta, setMeta] = useState(null);

  const [classGroups, setClassGroups] = useState([]);

  const [totalCount, setTotalCount] = useState(0);

  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const [creatingClassGroup, setCreatingClassGroup] = useState(false);

  const [newClassName, setNewClassName] = useState('');

  const [newSection, setNewSection] = useState('');

  const [newDescription, setNewDescription] = useState('');

  const [newAcademicYearId, setNewAcademicYearId] = useState(null);

  const [editModalVisible, setEditModalVisible] = useState(false);

  const [editingClassGroup, setEditingClassGroup] = useState(null);

  const [savingClassGroup, setSavingClassGroup] = useState(false);

  const [editClassName, setEditClassName] = useState('');

  const [editSection, setEditSection] = useState('');

  const [editDescription, setEditDescription] = useState('');

  const [editAcademicYearId, setEditAcademicYearId] = useState(null);

  const [deletingClassGroupId, setDeletingClassGroupId] = useState(null);

  const [downloadingData, setDownloadingData] = useState(false);

  const loadScreen = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [
          meResponse,
          onboardingResponse,
          metaResponse,
          classGroupsResponse,
        ] = await Promise.all([
          api('/api/me'),

          api('/api/settings/v1/onboarding'),

          api('/api/class-groups/meta'),

          api('/api/class-groups'),
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
            'Only administrators can manage class groups.',
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

        const rows = Array.isArray(classGroupsResponse?.classes)
          ? classGroupsResponse.classes
          : [];

        setClassGroups(rows);

        setTotalCount(Number(classGroupsResponse?.count) || rows.length);
      } catch (error) {
        console.log('Class groups load error:', error);

        Alert.alert(
          'Class Groups',
          error?.message || 'Could not load class groups.',
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
      loadScreen();

      return undefined;
    }, [loadScreen]),
  );

  const academicYearOptions = useMemo(() => {
    const years = Array.isArray(meta?.academic_years)
      ? meta.academic_years
      : [];

    return [
      {
        label: 'All academic years',
        value: null,
      },

      ...years.map(item => ({
        label:
          item?.label ||
          item?.name ||
          item?.code ||
          `Academic Year ${item?.id}`,

        value: Number(item?.id),
      })),
    ];
  }, [meta?.academic_years]);

  const visibleClassGroups = useMemo(() => {
    if (!selectedAcademicYearId) {
      return classGroups;
    }

    return classGroups.filter(
      item => Number(item?.academic_year_id) === Number(selectedAcademicYearId),
    );
  }, [classGroups, selectedAcademicYearId]);

  const handleDownloadData = useCallback(async () => {
    if (downloadingData) {
      return;
    }

    let tempPath = null;

    try {
      setDownloadingData(true);

      const token = await getToken();

      const url = absoluteUrl('/api/class-groups/download.xlsx');

      const fileName = `Class-Groups-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;

      const headers = {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: 'xlsx',
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
        await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
          {
            name: fileName,

            parentFolder: 'ClassGroups',

            mimeType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          'Download',
          tempPath,
        );

        Alert.alert(
          'Download Complete',
          `Class group data saved to:\n\nDownloads/ClassGroups\n\n${fileName}`,
        );

        return;
      }

      /*
       * iOS fallback.
       */
      const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

      await ReactNativeBlobUtil.fs.cp(tempPath, destination);

      Alert.alert('Download Complete', 'Class group data has been saved.');
    } catch (error) {
      console.log('Class group download error:', error);

      Alert.alert(
        'Download Data',
        error?.message || 'Could not download class group data.',
      );
    } finally {
      if (tempPath) {
        try {
          const exists = await ReactNativeBlobUtil.fs.exists(tempPath);

          if (exists) {
            await ReactNativeBlobUtil.fs.unlink(tempPath);
          }
        } catch (error) {
          console.log('Class group temp cleanup error:', error);
        }
      }

      setDownloadingData(false);
    }
  }, [downloadingData]);

  const handleAddClassGroup = useCallback(() => {
    const currentYearId = Number(
      meta?.academic_years?.find(
        item =>
          String(item?.status || '')
            .trim()
            .toLowerCase() === 'current',
      )?.id || onboarding?.academic_year?.id,
    );

    setNewClassName('');
    setNewSection('');
    setNewDescription('');

    setNewAcademicYearId(Number.isFinite(currentYearId) ? currentYearId : null);

    setCreateModalVisible(true);
  }, [meta?.academic_years, onboarding?.academic_year?.id]);

  const handleCloseCreateModal = useCallback(() => {
    if (creatingClassGroup) {
      return;
    }

    setCreateModalVisible(false);

    setNewClassName('');
    setNewSection('');
    setNewDescription('');
    setNewAcademicYearId(null);
  }, [creatingClassGroup]);

  const handleCloseEditModal = useCallback(() => {
    if (savingClassGroup) {
      return;
    }

    setEditModalVisible(false);

    setEditingClassGroup(null);

    setEditClassName('');
    setEditSection('');
    setEditDescription('');
    setEditAcademicYearId(null);
  }, [savingClassGroup]);

  const handleSaveClassGroup = useCallback(async () => {
    const classGroupId = Number(editingClassGroup?.id);

    const name = String(editClassName || '').trim();

    const section = String(editSection || '').trim();

    const description = String(editDescription || '').trim();

    if (!Number.isFinite(classGroupId)) {
      Alert.alert('Edit Class Group', 'A valid class group ID is required.');

      return;
    }

    if (!name) {
      Alert.alert('Edit Class Group', 'Class name is required.');

      return;
    }

    if (savingClassGroup) {
      return;
    }

    try {
      setSavingClassGroup(true);

      const response = await api(
        `/api/class-groups/${encodeURIComponent(classGroupId)}`,
        {
          method: 'PUT',

          body: JSON.stringify({
            name,

            section: section || null,

            description: description || null,
          }),
        },
      );

      if (response?.ok !== true) {
        throw new Error('Could not update the class group.');
      }

      setEditModalVisible(false);

      setEditingClassGroup(null);

      setEditClassName('');
      setEditSection('');
      setEditDescription('');
      setEditAcademicYearId(null);

      await refreshClassGroupData();

      Alert.alert('Class Group Updated', 'Class group updated successfully.');
    } catch (error) {
      console.log('Update class group error:', error);

      Alert.alert(
        'Edit Class Group',
        error?.message || 'Could not update the class group.',
      );
    } finally {
      setSavingClassGroup(false);
    }
  }, [
    editingClassGroup?.id,
    editClassName,
    editSection,
    editDescription,
    savingClassGroup,
    refreshClassGroupData,
  ]);

  const refreshClassGroupData = useCallback(async () => {
    const [metaResponse, classGroupsResponse] = await Promise.all([
      api('/api/class-groups/meta'),
      api('/api/class-groups'),
    ]);

    setMeta(metaResponse || null);

    const rows = Array.isArray(classGroupsResponse?.classes)
      ? classGroupsResponse.classes
      : [];

    setClassGroups(rows);

    setTotalCount(Number(classGroupsResponse?.count) || rows.length);
  }, []);

  const handleCreateClassGroup = useCallback(async () => {
    const name = String(newClassName || '').trim();

    const section = String(newSection || '').trim();

    const description = String(newDescription || '').trim();

    const academicYearId = Number(newAcademicYearId);

    if (!name) {
      Alert.alert('Create Class Group', 'Class name is required.');

      return;
    }

    if (!Number.isFinite(academicYearId)) {
      Alert.alert('Create Class Group', 'Academic year is required.');

      return;
    }

    if (creatingClassGroup) {
      return;
    }

    try {
      setCreatingClassGroup(true);

      const response = await api('/api/class-groups', {
        method: 'POST',

        body: JSON.stringify({
          name,

          section: section || null,

          description: description || null,

          academic_year_id: academicYearId,
        }),
      });

      if (response?.ok !== true) {
        throw new Error('Could not create the class group.');
      }

      setCreateModalVisible(false);

      setNewClassName('');
      setNewSection('');
      setNewDescription('');
      setNewAcademicYearId(null);

      await refreshClassGroupData();

      Alert.alert('Class Group Created', 'Class group created successfully.');
    } catch (error) {
      console.log('Create class group error:', error);

      Alert.alert(
        'Create Class Group',
        error?.message || 'Could not create the class group.',
      );
    } finally {
      setCreatingClassGroup(false);
    }
  }, [
    newClassName,
    newSection,
    newDescription,
    newAcademicYearId,
    creatingClassGroup,
    refreshClassGroupData,
  ]);

  const createAcademicYearOptions = useMemo(() => {
    const years = Array.isArray(meta?.academic_years)
      ? meta.academic_years
      : [];

    return years.map(item => ({
      label:
        item?.label || item?.name || item?.code || `Academic Year ${item?.id}`,

      value: Number(item?.id),
    }));
  }, [meta?.academic_years]);

  const existingSectionsForEdit = useMemo(() => {
    if (!editingClassGroup) {
      return [];
    }

    const currentName = String(editClassName || '')
      .trim()
      .toLowerCase();

    const academicYearId = Number(editAcademicYearId);

    if (!currentName || !Number.isFinite(academicYearId)) {
      return [];
    }

    return classGroups
      .filter(item => {
        return (
          String(item?.name || '')
            .trim()
            .toLowerCase() === currentName &&
          Number(item?.academic_year_id) === academicYearId
        );
      })
      .map(item => String(item?.section || '').trim())
      .filter(Boolean);
  }, [classGroups, editingClassGroup, editClassName, editAcademicYearId]);

  const handleEditClassGroup = useCallback(item => {
    const classGroupId = Number(item?.id);

    if (!Number.isFinite(classGroupId)) {
      Alert.alert('Edit Class Group', 'A valid class group ID is required.');

      return;
    }

    setEditingClassGroup(item);

    setEditClassName(String(item?.name || ''));

    setEditSection(String(item?.section || ''));

    setEditDescription(String(item?.description || ''));

    setEditAcademicYearId(Number(item?.academic_year_id) || null);

    setEditModalVisible(true);
  }, []);

  const handleDeleteClassGroup = useCallback(
    item => {
      const classGroupId = Number(item?.id);

      if (!Number.isFinite(classGroupId)) {
        Alert.alert(
          'Delete Class Group',
          'A valid class group ID is required.',
        );

        return;
      }

      if (deletingClassGroupId !== null) {
        return;
      }

      Alert.alert('Delete Class Group', 'Delete this class group?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            try {
              setDeletingClassGroupId(classGroupId);

              const response = await api(
                `/api/class-groups/${encodeURIComponent(classGroupId)}`,
                {
                  method: 'DELETE',
                },
              );

              if (response?.ok !== true) {
                throw new Error('Could not delete the class group.');
              }

              await refreshClassGroupData();

              Alert.alert(
                'Class Group Deleted',
                'Class group deleted successfully.',
              );
            } catch (error) {
              console.log('Delete class group error:', error);

              Alert.alert(
                'Delete Class Group',
                error?.message || 'Could not delete the class group.',
              );
            } finally {
              setDeletingClassGroupId(null);
            }
          },
        },
      ]);
    },
    [deletingClassGroupId, refreshClassGroupData],
  );

  const renderClassGroup = useCallback(
    ({ item }) => {
      return (
        <View style={styles.classCard}>
          <View style={styles.classCardTop}>
            <View style={styles.classInfo}>
              <Text style={styles.className}>{getClassLabel(item)}</Text>
            </View>

            <View style={styles.cardActions}>
              <Pressable
                onPress={() => handleEditClassGroup(item)}
                style={({ pressed }) => [
                  styles.editButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>

              <Pressable
                disabled={deletingClassGroupId === Number(item?.id)}
                onPress={() => handleDeleteClassGroup(item)}
                style={({ pressed }) => [
                  styles.deleteButton,

                  deletingClassGroupId === Number(item?.id) &&
                    styles.controlDisabled,

                  pressed &&
                    deletingClassGroupId !== Number(item?.id) &&
                    styles.controlPressed,
                ]}
              >
                {deletingClassGroupId === Number(item?.id) ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete</Text>
                )}
              </Pressable>
            </View>
          </View>

          <Text style={styles.academicYearText}>
            Academic year: {getAcademicYearLabel(item)}
          </Text>

          {item?.description ? (
            <Text style={styles.descriptionText}>{item.description}</Text>
          ) : null}
        </View>
      );
    },
    [handleEditClassGroup, handleDeleteClassGroup],
  );

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading class groups...</Text>
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
        data={visibleClassGroups}
        keyExtractor={item => String(item?.id)}
        renderItem={renderClassGroup}
        showsVerticalScrollIndicator={false}
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
            <View style={styles.topActions}>
              <Pressable
                disabled={downloadingData}
                onPress={handleDownloadData}
                style={({ pressed }) => [
                  styles.downloadButton,

                  downloadingData && styles.controlDisabled,

                  pressed && !downloadingData && styles.controlPressed,
                ]}
              >
                {downloadingData ? (
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
                      size={17}
                      color="#FFFFFF"
                    />

                    <Text style={styles.downloadButtonText}>Download Data</Text>
                  </>
                )}
              </Pressable>

              <Pressable
                onPress={handleAddClassGroup}
                style={({ pressed }) => [
                  styles.addButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />

                <Text style={styles.addButtonText}>Add Class Group</Text>
              </Pressable>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Academic year</Text>

              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                selectedTextStyle={styles.dropdownSelectedText}
                itemTextStyle={styles.dropdownItemText}
                placeholderStyle={styles.dropdownPlaceholder}
                activeColor="#173B60"
                iconColor="#DCE7F5"
                data={academicYearOptions}
                labelField="label"
                valueField="value"
                value={selectedAcademicYearId}
                placeholder="All academic years"
                onChange={item =>
                  setSelectedAcademicYearId(item?.value ?? null)
                }
              />
            </View>

            <View style={styles.listHeading}>
              <Text style={styles.listHeadingTitle}>Class Groups</Text>

              <Text style={styles.listHeadingCount}>
                {visibleClassGroups.length}{' '}
                {visibleClassGroups.length === 1
                  ? 'class group'
                  : 'class groups'}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="google-classroom"
              size={40}
              color="#718096"
            />

            <Text style={styles.emptyTitle}>No class groups found</Text>

            <Text style={styles.emptyText}>
              No class groups are available for the selected academic year.
            </Text>
          </View>
        }
        ListFooterComponent={<View style={styles.footerSpace} />}
      />
      <Modal
        visible={createModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseCreateModal}
      >
        <View style={styles.createModalBackdrop}>
          <View style={styles.createModal}>
            <View style={styles.createModalHeader}>
              <Text style={styles.createModalTitle}>Create Class Group</Text>

              <Pressable
                disabled={creatingClassGroup}
                onPress={handleCloseCreateModal}
                style={({ pressed }) => [
                  styles.createModalCloseButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Text style={styles.createFieldLabel}>Name</Text>

            <TextInput
              value={newClassName}
              onChangeText={setNewClassName}
              editable={!creatingClassGroup}
              placeholder="Search or add a class"
              placeholderTextColor="#718096"
              autoCapitalize="words"
              style={styles.createInput}
            />

            <Text style={styles.createFieldLabel}>Section</Text>

            <TextInput
              value={newSection}
              onChangeText={setNewSection}
              editable={!creatingClassGroup}
              placeholder="A"
              placeholderTextColor="#718096"
              autoCapitalize="characters"
              style={styles.createInput}
            />

            <Text style={styles.createFieldLabel}>
              Academic year
              <Text style={styles.requiredText}> *</Text>
            </Text>

            <Dropdown
              style={styles.createDropdown}
              containerStyle={styles.dropdownContainer}
              selectedTextStyle={styles.dropdownSelectedText}
              itemTextStyle={styles.dropdownItemText}
              placeholderStyle={styles.dropdownPlaceholder}
              activeColor="#173B60"
              iconColor="#DCE7F5"
              data={createAcademicYearOptions}
              labelField="label"
              valueField="value"
              value={newAcademicYearId}
              placeholder="Select academic year"
              onChange={item => setNewAcademicYearId(item?.value ?? null)}
            />

            <Text style={styles.createFieldLabel}>Description</Text>

            <TextInput
              value={newDescription}
              onChangeText={setNewDescription}
              editable={!creatingClassGroup}
              placeholder="Optional notes"
              placeholderTextColor="#718096"
              multiline
              textAlignVertical="top"
              style={[styles.createInput, styles.descriptionInput]}
            />

            <View style={styles.createModalActions}>
              <Pressable
                disabled={creatingClassGroup}
                onPress={handleCloseCreateModal}
                style={({ pressed }) => [
                  styles.createCancelButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.createCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={creatingClassGroup}
                onPress={handleCreateClassGroup}
                style={({ pressed }) => [
                  styles.createButton,

                  creatingClassGroup && styles.controlDisabled,

                  pressed && !creatingClassGroup && styles.controlPressed,
                ]}
              >
                {creatingClassGroup ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.createButtonText}>Create</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseEditModal}
      >
        <View style={styles.createModalBackdrop}>
          <View style={styles.createModal}>
            <View style={styles.createModalHeader}>
              <Text style={styles.createModalTitle}>Edit Class Group</Text>

              <Pressable
                disabled={savingClassGroup}
                onPress={handleCloseEditModal}
                style={({ pressed }) => [
                  styles.createModalCloseButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Text style={styles.createFieldLabel}>Name</Text>

            <TextInput
              value={editClassName}
              onChangeText={setEditClassName}
              editable={!savingClassGroup}
              placeholder="Class name"
              placeholderTextColor="#718096"
              style={styles.createInput}
            />

            <Text style={styles.createFieldLabel}>Section</Text>

            <TextInput
              value={editSection}
              onChangeText={setEditSection}
              editable={!savingClassGroup}
              placeholder="A"
              placeholderTextColor="#718096"
              autoCapitalize="characters"
              style={styles.createInput}
            />

            <Text style={styles.createFieldLabel}>
              Academic year
              <Text style={styles.requiredText}> *</Text>
            </Text>

            <Dropdown
              style={[styles.createDropdown, styles.disabledDropdown]}
              containerStyle={styles.dropdownContainer}
              selectedTextStyle={styles.dropdownSelectedText}
              itemTextStyle={styles.dropdownItemText}
              placeholderStyle={styles.dropdownPlaceholder}
              data={createAcademicYearOptions}
              labelField="label"
              valueField="value"
              value={editAcademicYearId}
              placeholder="Select academic year"
              disable
              iconColor="#AFC0D8"
            />

            {existingSectionsForEdit.length > 0 ? (
              <View style={styles.existingSectionsArea}>
                <Text style={styles.existingSectionsLabel}>
                  Sections already in this class for the selected academic year
                </Text>

                <View style={styles.sectionChips}>
                  {existingSectionsForEdit.map(section => (
                    <View key={section} style={styles.sectionChip}>
                      <Text style={styles.sectionChipText}>{section}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            <Text style={styles.createFieldLabel}>Description</Text>

            <TextInput
              value={editDescription}
              onChangeText={setEditDescription}
              editable={!savingClassGroup}
              placeholder="Optional notes"
              placeholderTextColor="#718096"
              multiline
              textAlignVertical="top"
              style={[styles.createInput, styles.descriptionInput]}
            />

            <View style={styles.createModalActions}>
              <Pressable
                disabled={savingClassGroup}
                onPress={handleCloseEditModal}
                style={({ pressed }) => [
                  styles.createCancelButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.createCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={savingClassGroup}
                onPress={handleSaveClassGroup}
                style={({ pressed }) => [
                  styles.createButton,

                  savingClassGroup && styles.controlDisabled,

                  pressed && !savingClassGroup && styles.controlPressed,
                ]}
              >
                {savingClassGroup ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.createButtonText}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
