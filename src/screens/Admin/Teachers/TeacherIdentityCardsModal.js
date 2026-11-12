import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeBlobUtil from 'react-native-blob-util';

import { absoluteUrl, api, getToken } from '../../../api/client';

import styles from './TeacherIdentityCardsModal.styles';

const PER_PAGE = 20;

export default function TeacherIdentityCardsModal({ visible, onClose }) {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    per_page: PER_PAGE,
    current_page: 1,
    last_page: 1,
  });

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [selectedIds, setSelectedIds] = useState([]);

  const loadCandidates = useCallback(async targetPage => {
    try {
      setLoading(true);

      const response = await api(
        `/api/students/id-card-candidates?card_type=teacher&page=${targetPage}&per_page=${PER_PAGE}`,
        {
          method: 'GET',
        },
      );

      const nextRows = Array.isArray(response?.rows) ? response.rows : [];

      const ids = Array.isArray(response?.ids)
        ? response.ids.map(Number).filter(Number.isFinite)
        : nextRows.map(item => Number(item?.id)).filter(Number.isFinite);

      setRows(nextRows);

      setMeta({
        total: Number(response?.meta?.total) || nextRows.length,
        per_page: Number(response?.meta?.per_page) || PER_PAGE,
        current_page: Number(response?.meta?.current_page) || targetPage,
        last_page: Number(response?.meta?.last_page) || 1,
      });

      /*
       * According to the web screen, all matching teachers
       * are selected by default when the modal opens.
       */
      setSelectedIds(ids);
    } catch (error) {
      console.log('Teacher identity card candidates error:', error);

      Alert.alert(
        'Identity Cards',
        error?.data?.message ||
          error?.message ||
          'Could not load identity card candidates.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setPage(1);
    setSearch('');

    loadCandidates(1);
  }, [visible, loadCandidates]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return rows;
    }

    return rows.filter(item => {
      const haystack = [item?.name, item?.role, item?.class, item?.roll_no]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [rows, search]);

  const matchingIds = useMemo(() => {
    return filteredRows.map(item => Number(item?.id)).filter(Number.isFinite);
  }, [filteredRows]);

  const allMatchingSelected =
    matchingIds.length > 0 && matchingIds.every(id => selectedIds.includes(id));

  function toggleTeacher(id) {
    const numericId = Number(id);

    if (!Number.isFinite(numericId)) {
      return;
    }

    setSelectedIds(current => {
      if (current.includes(numericId)) {
        return current.filter(item => item !== numericId);
      }

      return [...current, numericId];
    });
  }

  function toggleSelectAll() {
    setSelectedIds(current => {
      if (allMatchingSelected) {
        return current.filter(id => !matchingIds.includes(id));
      }

      return Array.from(new Set([...current, ...matchingIds]));
    });
  }

  async function changePage(nextPage) {
    if (loading || nextPage < 1 || nextPage > Number(meta.last_page || 1)) {
      return;
    }

    setPage(nextPage);

    await loadCandidates(nextPage);
  }

  async function downloadIdentityCards() {
    if (downloading || selectedIds.length === 0) {
      if (selectedIds.length === 0) {
        Alert.alert('Identity Cards', 'Please select at least one teacher.');
      }
      return;
    }

    let tempPath = null;

    try {
      setDownloading(true);

      const token = await getToken();

      // Convert selected teacher IDs into comma-separated values.
      const cardIds = selectedIds.join(',');

      // Use the existing teacher identity card PDF endpoint.
      const path = `/students/identity-cards/pdf?card_type=teacher&card_ids=${encodeURIComponent(
        cardIds,
      )}`;

      const url = absoluteUrl(path);

      const fileName = `Teacher-Identity-Cards-${Date.now()}.pdf`;

      const headers = {
        Accept: 'application/pdf',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log('========== ID CARD PDF DEBUG ==========');
      console.log('Download URL:', url);
      console.log('Selected teacher IDs:', selectedIds);
      console.log('Bearer token available:', Boolean(token));

      console.log('[STEP 1] Starting PDF request');

      let response;

      try {
        response = await ReactNativeBlobUtil.config({
          fileCache: true,
          appendExt: 'pdf',
        }).fetch('GET', url, headers);

        console.log('[STEP 2] Request completed');
        console.log('HTTP Status:', response.info()?.status);
        console.log('Response Headers:', response.info()?.headers);
        console.log('Downloaded Path:', response.path());
      } catch (fetchError) {
        console.log('[STEP 2 FAILED] PDF request interrupted');
        console.log('Error message:', fetchError?.message);
        console.log('Error code:', fetchError?.code);
        console.log('Full error:', JSON.stringify(fetchError));

        throw fetchError;
      }

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
        // Save PDF to Downloads/IdentityCards using MediaStore.
        const savedUri =
          await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
            {
              name: fileName,
              parentFolder: 'IdentityCards',
              mimeType: 'application/pdf',
            },
            'Download',
            tempPath,
          );

        if (!savedUri) {
          throw new Error('Failed to save identity card PDF.');
        }

        console.log('Teacher identity cards PDF saved:', savedUri);

        Alert.alert(
          'Download Complete',
          `Teacher identity cards saved in:\n\nDownloads/IdentityCards\n\n${fileName}`,
        );

        return;
      }

      // iOS: Save PDF to application Documents directory.
      const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

      await ReactNativeBlobUtil.fs.cp(tempPath, destination);

      Alert.alert(
        'Download Complete',
        'Teacher identity cards PDF has been saved.',
      );
    } catch (error) {
      console.log('Teacher identity cards PDF error:', error);

      Alert.alert(
        'Download Failed',
        error?.message || 'Could not download teacher identity cards.',
      );
    } finally {
      // Remove temporary file after saving the PDF.
      if (tempPath) {
        try {
          const exists = await ReactNativeBlobUtil.fs.exists(tempPath);

          if (exists) {
            await ReactNativeBlobUtil.fs.unlink(tempPath);
          }
        } catch (error) {
          console.log('Teacher identity cards PDF cleanup error:', error);
        }
      }

      setDownloading(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!downloading) {
          onClose?.();
        }
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Identity Cards</Text>

              <Text style={styles.subtitle}>
                Select teachers and download their identity cards.
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              disabled={downloading}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons name="close" size={23} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <MaterialCommunityIcons
                name="magnify"
                size={19}
                color="#8FA5BE"
              />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search by name..."
                placeholderTextColor="#718096"
                style={styles.searchInput}
              />
            </View>

            {!!search && (
              <Pressable
                onPress={() => setSearch('')}
                style={({ pressed }) => [
                  styles.outlineButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.outlineButtonText}>Clear</Text>
              </Pressable>
            )}
          </View>

          <Pressable onPress={toggleSelectAll} style={styles.selectAllRow}>
            <MaterialCommunityIcons
              name={
                allMatchingSelected
                  ? 'checkbox-marked'
                  : 'checkbox-blank-outline'
              }
              size={21}
              color={allMatchingSelected ? '#60A5FA' : '#AFC2DA'}
            />

            <Text style={styles.selectAllText}>Select / Deselect All</Text>
          </Pressable>

          <Text style={styles.selectedCount}>
            {selectedIds.length} selected of {meta.total} matching
          </Text>

          <ScrollView
            style={styles.listScroll}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#60A5FA" />

                <Text style={styles.loadingText}>Loading teachers...</Text>
              </View>
            ) : filteredRows.length === 0 ? (
              <View style={styles.emptyBox}>
                <MaterialCommunityIcons
                  name="account-search-outline"
                  size={32}
                  color="#718096"
                />

                <Text style={styles.emptyTitle}>No teachers found</Text>
              </View>
            ) : (
              filteredRows.map(item => {
                const id = Number(item.id);

                const selected = selectedIds.includes(id);

                return (
                  <Pressable
                    key={String(item.id)}
                    onPress={() => toggleTeacher(id)}
                    style={({ pressed }) => [
                      styles.teacherRow,
                      selected && styles.teacherRowSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        selected ? 'checkbox-marked' : 'checkbox-blank-outline'
                      }
                      size={21}
                      color={selected ? '#60A5FA' : '#AFC2DA'}
                    />

                    <View style={styles.roleColumn}>
                      <Text style={styles.columnLabel}>Role</Text>

                      <Text style={styles.roleText}>{item?.role || '-'}</Text>
                    </View>

                    <View style={styles.nameColumn}>
                      <Text style={styles.columnLabel}>Name</Text>

                      <Text style={styles.nameText}>{item?.name || '-'}</Text>
                    </View>
                  </Pressable>
                );
              })
            )}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.pageRow}>
              <Text style={styles.pageText}>
                Page {meta.current_page} of {meta.last_page} · {meta.total}{' '}
                matching
              </Text>

              <View style={styles.paginationButtons}>
                <Pressable
                  disabled={loading || Number(meta.current_page) <= 1}
                  onPress={() => changePage(page - 1)}
                  style={({ pressed }) => [
                    styles.pageButton,
                    (loading || Number(meta.current_page) <= 1) &&
                      styles.disabled,
                    pressed && styles.pressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={19}
                    color="#FFFFFF"
                  />
                </Pressable>

                <Pressable
                  disabled={
                    loading ||
                    Number(meta.current_page) >= Number(meta.last_page)
                  }
                  onPress={() => changePage(page + 1)}
                  style={({ pressed }) => [
                    styles.pageButton,
                    (loading ||
                      Number(meta.current_page) >= Number(meta.last_page)) &&
                      styles.disabled,
                    pressed && styles.pressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={19}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              disabled={downloading || selectedIds.length === 0}
              onPress={downloadIdentityCards}
              style={({ pressed }) => [
                styles.downloadButton,
                (downloading || selectedIds.length === 0) && styles.disabled,
                pressed && !downloading && styles.pressed,
              ]}
            >
              {downloading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <MaterialCommunityIcons
                  name="file-pdf-box"
                  size={20}
                  color="#FFFFFF"
                />
              )}

              <Text style={styles.downloadButtonText}>
                {downloading ? 'Downloading...' : 'Download Identity Cards'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
