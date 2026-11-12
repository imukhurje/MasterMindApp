import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { api, getToken, absoluteUrl } from '../../../api/client';
import styles from './AdminAdmitCards.styles';

function normalizeCandidate(item) {
  return {
    id: Number(item?.id),
    className: String(item?.class || '-'),
    rollNo: String(item?.roll_no || ''),
    name: String(item?.name || 'Unnamed student'),
    paperCount: Number(item?.paper_count || 0),
  };
}

export default function AdminAdmitCards({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const examinationId = Number(route?.params?.examinationId);

  const examinationName = route?.params?.examinationName || 'Examination';

  const [candidates, setCandidates] = useState([]);

  const [selectedCandidateIds, setSelectedCandidateIds] = useState(new Set());

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [downloading, setDownloading] = useState(false);

  const loadCandidates = useCallback(
    async ({ refresh = false } = {}) => {
      if (!Number.isFinite(examinationId)) {
        Alert.alert('Admit Cards', 'Examination ID is missing.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);

        return;
      }

      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await api(
          `/api/examinations/v1/${examinationId}/admit-card-candidates`,
        );

        const rows = (Array.isArray(response?.rows) ? response.rows : [])
          .map(normalizeCandidate)
          .filter(item => Number.isFinite(item.id));

        setCandidates(rows);

        /*
         * Web screen initially selects
         * all candidates.
         */
        setSelectedCandidateIds(new Set(rows.map(item => item.id)));

        navigation.setOptions({
          title: 'Admit Cards',
        });
      } catch (error) {
        console.log('Admit card candidates error:', error);

        Alert.alert(
          'Admit Cards',
          error?.message || 'Could not load admit card candidates.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [examinationId, navigation],
  );

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const allSelected = useMemo(
    () =>
      candidates.length > 0 &&
      candidates.every(item => selectedCandidateIds.has(item.id)),
    [candidates, selectedCandidateIds],
  );

  const selectedCount = selectedCandidateIds.size;

  function toggleCandidate(candidateId) {
    const normalizedId = Number(candidateId);

    if (!Number.isFinite(normalizedId)) {
      return;
    }

    setSelectedCandidateIds(current => {
      const next = new Set(current);

      if (next.has(normalizedId)) {
        next.delete(normalizedId);
      } else {
        next.add(normalizedId);
      }

      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedCandidateIds(new Set());

      return;
    }

    setSelectedCandidateIds(new Set(candidates.map(item => item.id)));
  }

  async function downloadAdmitCards() {
    if (selectedCandidateIds.size === 0) {
      Alert.alert('Admit Cards', 'Please select at least one student.');
      return;
    }

    if (downloading) {
      return;
    }

    try {
      setDownloading(true);

      const token = await getToken();

      const studentIds = Array.from(selectedCandidateIds)
        .map(Number)
        .filter(Number.isFinite);

      if (studentIds.length === 0) {
        throw new Error('No valid students were selected.');
      }

      const studentIdsQuery = encodeURIComponent(studentIds.join(','));

      // const url = `https://argus.ascendlearn.org/examinations/${examinationId}/admit-cards/pdf?student_ids=${studentIdsQuery}`;
      const url = absoluteUrl(
        `/examinations/${examinationId}/admit-cards/pdf?student_ids=${studentIdsQuery}`,
      );

      const fileName = `examination-${examinationId}-admit-cards.pdf`;

      const tempPath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${fileName}`;

      const headers = {
        Accept: 'application/pdf',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log('Admit cards download URL:', url);

      console.log('Selected student IDs:', studentIds);

      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
        path: tempPath,
      }).fetch('GET', url, headers);

      const info = response.info();

      const status = Number(info?.status);

      console.log('Admit cards response status:', status);

      console.log('Admit cards response headers:', info?.headers);

      if (status < 200 || status >= 300) {
        throw new Error(`Server returned HTTP ${status}.`);
      }

      const contentType =
        info?.headers?.['Content-Type'] ||
        info?.headers?.['content-type'] ||
        '';

      console.log('Admit cards content type:', contentType);

      if (!String(contentType).toLowerCase().includes('pdf')) {
        throw new Error(
          `Expected PDF but received ${
            contentType || 'an unknown response type'
          }.`,
        );
      }

      await saveAdmitCardsPdf(tempPath, fileName);
    } catch (error) {
      console.log('Admit cards download error:', error);

      Alert.alert(
        'Download failed',
        error?.message || 'Could not download the admit cards.',
      );
    } finally {
      setDownloading(false);
    }
  }

  async function saveAdmitCardsPdf(sourcePath, fileName) {
    if (Platform.OS === 'android') {
      await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
        {
          name: fileName,
          parentFolder: 'Argus',
          mimeType: 'application/pdf',
        },
        'Download',
        sourcePath,
      );

      Alert.alert(
        'Download complete',
        `${fileName} was saved to Downloads/Argus.`,
      );

      return;
    }

    const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

    await ReactNativeBlobUtil.fs.cp(sourcePath, destination);

    Alert.alert(
      'Download complete',
      'The admit cards were downloaded successfully.',
    );
  }

  function renderCandidate({ item }) {
    const selected = selectedCandidateIds.has(item.id);

    return (
      <Pressable
        onPress={() => toggleCandidate(item.id)}
        style={({ pressed }) => [
          styles.candidateCard,

          selected && styles.candidateCardSelected,

          pressed && styles.controlPressed,
        ]}
      >
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected ? <Text style={styles.checkboxCheck}>✓</Text> : null}
        </View>

        <View style={styles.candidateContent}>
          <Text numberOfLines={2} style={styles.candidateName}>
            {item.name}
          </Text>

          <View style={styles.metadataRow}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Class</Text>

              <Text style={styles.metadataValue}>{item.className}</Text>
            </View>

            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Roll No</Text>

              <Text style={styles.metadataValue}>{item.rollNo || '—'}</Text>
            </View>

            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Papers</Text>

              <Text style={styles.metadataValue}>{item.paperCount}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading admit card candidates...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <View style={styles.headerCard}>
        <View style={styles.headerTextSection}>
          <Text style={styles.pageTitle}>Admit Cards</Text>

          <Text numberOfLines={2} style={styles.examinationName}>
            {examinationName}
          </Text>
        </View>

        <Pressable
          onPress={downloadAdmitCards}
          disabled={selectedCount === 0 || downloading}
          style={({ pressed }) => [
            styles.downloadButton,

            (selectedCount === 0 || downloading) && styles.controlDisabled,

            pressed &&
              selectedCount > 0 &&
              !downloading &&
              styles.controlPressed,
          ]}
        >
          {downloading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.downloadButtonText}>Download Admit Cards</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.selectionCard}>
        <Pressable
          onPress={toggleSelectAll}
          style={({ pressed }) => [
            styles.selectAllRow,

            pressed && styles.controlPressed,
          ]}
        >
          <View
            style={[styles.checkbox, allSelected && styles.checkboxSelected]}
          >
            {allSelected ? <Text style={styles.checkboxCheck}>✓</Text> : null}
          </View>

          <Text style={styles.selectAllText}>Select / Deselect All</Text>
        </Pressable>

        <Text style={styles.selectedCount}>
          {selectedCount} selected of {candidates.length}
        </Text>
      </View>

      <FlatList
        data={candidates}
        keyExtractor={item => String(item.id)}
        renderItem={renderCandidate}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadCandidates({
                refresh: true,
              })
            }
            tintColor="#FFFFFF"
            colors={['#FFFFFF']}
          />
        }
        contentContainerStyle={[
          styles.listContent,

          candidates.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No candidates found</Text>

            <Text style={styles.emptyStateText}>
              No students are available for admit cards in this examination.
            </Text>
          </View>
        }
      />
    </View>
  );
}
