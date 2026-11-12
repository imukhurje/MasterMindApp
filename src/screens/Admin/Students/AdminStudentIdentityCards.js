// src/screens/Admin/Student/AdminStudentIdentityCards.js

import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
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

import { api, getToken, absoluteUrl } from '../../../api/client';

import styles from './AdminStudentIdentityCards.styles';

import ReactNativeBlobUtil from 'react-native-blob-util';

const PER_PAGE = 20;

const CARD_HOLDER_OPTIONS = [
  {
    label: 'Students',
    value: 'student',
  },
  {
    label: 'Teachers',
    value: 'teacher',
  },
  {
    label: 'Staff & admins',
    value: 'staff',
  },
];

export default function AdminStudentIdentityCards({ navigation }) {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [pageLoading, setPageLoading] = useState(false);

  const [cardType, setCardType] = useState('student');

  const [rows, setRows] = useState([]);

  const [classes, setClasses] = useState([]);

  const [meta, setMeta] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
    per_page: PER_PAGE,
  });

  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const [searchText, setSearchText] = useState('');

  const [appliedSearch, setAppliedSearch] = useState('');

  const [selectedClass, setSelectedClass] = useState(null);

  const [appliedClass, setAppliedClass] = useState(null);

  const [downloadingCards, setDownloadingCards] = useState(false);

  const loadCandidates = useCallback(
    async ({ type = cardType, requestedPage = 1, refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else if (requestedPage === 1) {
          setLoading(true);
        } else {
          setPageLoading(true);
        }

        const response = await api(
          `/api/students/id-card-candidates?card_type=${encodeURIComponent(
            type,
          )}&page=${encodeURIComponent(requestedPage)}&per_page=${PER_PAGE}`,
        );

        setRows(Array.isArray(response?.rows) ? response.rows : []);

        setClasses(Array.isArray(response?.classes) ? response.classes : []);

        setMeta({
          total: Number(response?.meta?.total) || 0,

          current_page: Number(response?.meta?.current_page) || requestedPage,

          last_page: Number(response?.meta?.last_page) || 1,

          per_page: Number(response?.meta?.per_page) || PER_PAGE,
        });
      } catch (error) {
        console.log('ID card candidates error:', error);

        Alert.alert(
          'Identity Cards',
          error?.message || 'Could not load card holders.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
        setPageLoading(false);
      }
    },
    [cardType],
  );

  useFocusEffect(
    useCallback(() => {
      loadCandidates({
        type: cardType,
        requestedPage: 1,
      });

      return undefined;
    }, [cardType, loadCandidates]),
  );

  const classOptions = useMemo(() => {
    return [
      {
        label: 'All Classes',
        value: null,
      },

      ...classes.map(className => ({
        label: className,
        value: className,
      })),
    ];
  }, [classes]);

  const visibleRows = useMemo(() => {
    const query = String(appliedSearch || '')
      .trim()
      .toLowerCase();

    return rows.filter(item => {
      const matchesSearch =
        !query ||
        String(item?.name || '')
          .toLowerCase()
          .includes(query);

      const matchesClass =
        cardType !== 'student' ||
        !appliedClass ||
        String(item?.class || '') === String(appliedClass);

      return matchesSearch && matchesClass;
    });
  }, [rows, appliedSearch, appliedClass, cardType]);

  const visibleIds = useMemo(() => {
    return visibleRows.map(item => Number(item?.id)).filter(Number.isFinite);
  }, [visibleRows]);

  const visibleSelectedCount = useMemo(() => {
    return visibleIds.filter(id => selectedIds.has(id)).length;
  }, [visibleIds, selectedIds]);

  const allVisibleSelected =
    visibleIds.length > 0 && visibleSelectedCount === visibleIds.length;

  const handleCardTypeChange = useCallback(item => {
    const value = item?.value || 'student';

    setCardType(value);

    setRows([]);
    setClasses([]);

    setSearchText('');
    setAppliedSearch('');

    setSelectedClass(null);
    setAppliedClass(null);

    setSelectedIds(new Set());
  }, []);

  const handleSearch = useCallback(() => {
    setAppliedSearch(searchText.trim());

    setAppliedClass(cardType === 'student' ? selectedClass : null);

    setSelectedIds(new Set());
  }, [searchText, selectedClass, cardType]);

  const handleClear = useCallback(() => {
    setSearchText('');
    setAppliedSearch('');

    setSelectedClass(null);
    setAppliedClass(null);

    setSelectedIds(new Set());
  }, []);

  const toggleItem = useCallback(idValue => {
    const id = Number(idValue);

    if (!Number.isFinite(id)) {
      return;
    }

    setSelectedIds(current => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    setSelectedIds(current => {
      const next = new Set(current);

      if (allVisibleSelected) {
        visibleIds.forEach(id => {
          next.delete(id);
        });
      } else {
        visibleIds.forEach(id => {
          next.add(id);
        });
      }

      return next;
    });
  }, [allVisibleSelected, visibleIds]);

  const goToPage = useCallback(
    async nextPage => {
      if (nextPage < 1 || nextPage > meta.last_page || pageLoading) {
        return;
      }

      await loadCandidates({
        type: cardType,
        requestedPage: nextPage,
      });
    },
    [meta.last_page, pageLoading, loadCandidates, cardType],
  );

  const handleDownload = useCallback(async () => {
    if (downloadingCards) {
      return;
    }

    const ids = Array.from(selectedIds).map(Number).filter(Number.isFinite);

    if (ids.length === 0) {
      Alert.alert('Identity Cards', 'Select at least one card holder.');

      return;
    }

    setDownloadingCards(true);

    let tempPath = null;

    try {
      const token = await getToken();

      const cardIds = ids.join(',');

      const path =
        `/students/identity-cards/pdf` +
        `?card_type=${encodeURIComponent(cardType)}` +
        `&card_ids=${encodeURIComponent(cardIds)}`;

      const url = absoluteUrl(path);

      console.log('Identity cards download URL:', url);

      const fileName = `identity-cards-${cardType}-${Date.now()}.pdf`;

      const headers = {
        Accept: 'application/pdf',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      /*
       * Download to app cache first.
       * This allows us to inspect the HTTP response
       * instead of relying on Android DownloadManager.
       */
      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: 'pdf',
      }).fetch('GET', url, headers);

      const info = response.info();

      console.log('Identity card PDF response:', info);

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
              parentFolder: 'IdentityCards',
              mimeType: 'application/pdf',
            },
            'Download',
            tempPath,
          );

        console.log('Identity cards saved URI:', savedUri);

        Alert.alert(
          'Download Complete',
          `Identity cards PDF saved in:\n\nDownloads/IdentityCards\n\n${fileName}`,
        );

        return;
      }

      const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

      await ReactNativeBlobUtil.fs.cp(tempPath, destination);

      console.log('Identity cards PDF:', destination);

      Alert.alert('Download Complete', 'Identity cards PDF has been saved.');
    } catch (error) {
      console.log('Identity cards download error:', error);

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
          console.log('PDF temp cleanup error:', cleanupError);
        }
      }

      setDownloadingCards(false);
    }
  }, [selectedIds, cardType, downloadingCards]);

  const renderCandidate = useCallback(
    ({ item }) => {
      const id = Number(item?.id);

      const isSelected = selectedIds.has(id);

      return (
        <Pressable
          onPress={() => toggleItem(id)}
          style={({ pressed }) => [
            styles.candidateCard,

            isSelected && styles.candidateCardSelected,

            pressed && styles.controlPressed,
          ]}
        >
          <View style={styles.candidateCheck}>
            <MaterialCommunityIcons
              name={isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={23}
              color={isSelected ? '#93C5FD' : '#94A3B8'}
            />
          </View>

          <View style={styles.candidateInfo}>
            <Text style={styles.candidateName} numberOfLines={2}>
              {item?.name || 'Unnamed'}
            </Text>

            <Text style={styles.candidateRole}>{item?.role || ''}</Text>

            {cardType === 'student' ? (
              <View style={styles.studentMeta}>
                <Text style={styles.studentMetaText}>
                  Class: {item?.class || 'Not assigned'}
                </Text>

                <Text style={styles.studentMetaText}>
                  Roll No: {item?.roll_no || '—'}
                </Text>
              </View>
            ) : null}
          </View>
        </Pressable>
      );
    },
    [selectedIds, toggleItem, cardType],
  );

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading identity card holders...</Text>
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
        data={visibleRows}
        extraData={selectedIds}
        keyExtractor={item => `${cardType}-${item?.id}`}
        renderItem={renderCandidate}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadCandidates({
                type: cardType,
                requestedPage: meta.current_page,
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.filterCard}>
              <Text style={styles.fieldLabel}>Card holders</Text>

              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                itemTextStyle={styles.dropdownItemText}
                selectedTextStyle={styles.dropdownSelectedText}
                activeColor="#173B60"
                iconColor="#D7E3F4"
                data={CARD_HOLDER_OPTIONS}
                labelField="label"
                valueField="value"
                value={cardType}
                onChange={handleCardTypeChange}
              />

              <Text style={[styles.fieldLabel, styles.searchLabel]}>
                Search by name
              </Text>

              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
                placeholder="Search by name..."
                placeholderTextColor="#718096"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                style={styles.input}
              />

              {cardType === 'student' ? (
                <>
                  <Text style={[styles.fieldLabel, styles.searchLabel]}>
                    Class
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
                    value={selectedClass}
                    placeholder="All Classes"
                    onChange={item => setSelectedClass(item?.value ?? null)}
                  />
                </>
              ) : null}

              <View style={styles.searchActions}>
                <Pressable
                  onPress={handleSearch}
                  style={({ pressed }) => [
                    styles.searchButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="magnify"
                    size={17}
                    color="#FFFFFF"
                  />

                  <Text style={styles.searchButtonText}>Search</Text>
                </Pressable>

                <Pressable
                  onPress={handleClear}
                  style={({ pressed }) => [
                    styles.clearButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.selectionCard}>
              <Pressable
                disabled={visibleIds.length === 0}
                onPress={handleToggleAll}
                style={({ pressed }) => [
                  styles.selectAllRow,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name={
                    allVisibleSelected
                      ? 'checkbox-marked'
                      : 'checkbox-blank-outline'
                  }
                  size={22}
                  color="#93C5FD"
                />

                <Text style={styles.selectAllText}>Select / Deselect All</Text>
              </Pressable>

              <Text style={styles.selectionText}>
                {visibleSelectedCount} selected of {visibleRows.length} matching
              </Text>
            </View>

            <View style={styles.resultHeader}>
              <Text style={styles.resultHeaderText}>
                Page {meta.current_page} of {meta.last_page}
                {' · '}
                {meta.total} total
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="card-account-details-outline"
              size={40}
              color="#718096"
            />

            <Text style={styles.emptyTitle}>No card holders found</Text>
          </View>
        }
        ListFooterComponent={
          <>
            {meta.last_page > 1 ? (
              <View style={styles.pagination}>
                <Pressable
                  disabled={pageLoading || meta.current_page <= 1}
                  onPress={() => goToPage(meta.current_page - 1)}
                  style={({ pressed }) => [
                    styles.pageButton,

                    (pageLoading || meta.current_page <= 1) &&
                      styles.controlDisabled,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.pageButtonText}>Previous</Text>
                </Pressable>

                <Text style={styles.pageText}>
                  {meta.current_page} / {meta.last_page}
                </Text>

                <Pressable
                  disabled={pageLoading || meta.current_page >= meta.last_page}
                  onPress={() => goToPage(meta.current_page + 1)}
                  style={({ pressed }) => [
                    styles.pageButton,

                    (pageLoading || meta.current_page >= meta.last_page) &&
                      styles.controlDisabled,

                    pressed && styles.controlPressed,
                  ]}
                >
                  {pageLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.pageButtonText}>Next</Text>
                  )}
                </Pressable>
              </View>
            ) : null}

            <Pressable
              disabled={selectedIds.size === 0 || downloadingCards}
              onPress={handleDownload}
              style={({ pressed }) => [
                styles.downloadButton,

                selectedIds.size === 0 && styles.controlDisabled,

                pressed && selectedIds.size > 0 && styles.controlPressed,
              ]}
            >
              {downloadingCards ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="download"
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text style={styles.downloadButtonText}>
                    Download Identity Cards
                  </Text>
                </>
              )}
            </Pressable>

            <View style={styles.footerSpace} />
          </>
        }
      />
    </View>
  );
}
