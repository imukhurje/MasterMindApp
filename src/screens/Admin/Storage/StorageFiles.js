// src/screens/Admin/Storage/StorageFiles.js

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { api } from '../../../api/client';
import LinearGradient from 'react-native-linear-gradient';

const BG = '#0F172A';
const CARD = '#142B49';
const CARD_DARK = '#0B1C32';
const TEXT = '#FFFFFF';
const MUTED = '#94A3B8';
const BORDER = '#3B7197';
const DANGER = '#EF4444';
const DANGER_DARK = '#B91C1C';
const PER_PAGE = 20;

function formatBytes(value) {
  const bytes = Number(value || 0);

  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const size = bytes / 1024 ** unitIndex;
  const decimals = unitIndex === 0 ? 0 : 1;

  return `${size.toFixed(decimals)} ${units[unitIndex]}`;
}

function TrashIcon({ color = '#FFFFFF' }) {
  return (
    <View
      style={{
        width: 18,
        height: 20,
        alignItems: 'center',
      }}
    >
      {/* Handle */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: 7,
          height: 3,
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          backgroundColor: color,
        }}
      />

      {/* Lid */}
      <View
        style={{
          position: 'absolute',
          top: 4,
          width: 16,
          height: 3,
          borderRadius: 2,
          backgroundColor: color,
        }}
      />

      {/* Bin body */}
      <View
        style={{
          position: 'absolute',
          top: 8,
          width: 13,
          height: 11,
          borderWidth: 2,
          borderTopWidth: 0,
          borderColor: color,
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 3,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          paddingTop: 2,
        }}
      >
        <View
          style={{
            width: 1.5,
            height: 6,
            borderRadius: 1,
            backgroundColor: color,
          }}
        />

        <View
          style={{
            width: 1.5,
            height: 6,
            borderRadius: 1,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

export default function StorageFiles() {
  const [files, setFiles] = useState([]);
  const [storageLabel, setStorageLabel] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    page: 1,
    per_page: PER_PAGE,
    total: 0,
    last_page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [changingPage, setChangingPage] = useState(false);
  const [deletingKey, setDeletingKey] = useState(null);

  const loadStorageUsage = useCallback(async () => {
    try {
      const response = await api('/api/storage-usage');

      setStorageLabel(response?.label?.replace(/^\s*\[|\]\s*$/g, '') || '');
    } catch (error) {
      console.log('Storage usage API error:', error);
      setStorageLabel('');
    }
  }, []);

  const loadStorageFiles = useCallback(
    async ({ showInitialLoader = false, showRefreshLoader = false } = {}) => {
      try {
        if (showInitialLoader) {
          setLoading(true);
        }

        if (showRefreshLoader) {
          setRefreshing(true);
        }

        const response = await api(
          `/api/storage-files?page=${page}&per_page=${PER_PAGE}`,
        );

        const responseFiles = Array.isArray(response?.data)
          ? response.data
          : [];

        const responseMeta = response?.meta || {};

        setFiles(responseFiles);
        setMeta({
          page: Number(responseMeta?.page || page),
          per_page: Number(responseMeta?.per_page || PER_PAGE),
          total: Number(responseMeta?.total || 0),
          last_page: Math.max(Number(responseMeta?.last_page || 1), 1),
        });
      } catch (error) {
        console.log('Storage files API error:', error);

        Alert.alert(
          'Storage files',
          error?.message || 'Could not load storage information.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
        setChangingPage(false);
      }
    },
    [page],
  );

  useEffect(() => {
    loadStorageUsage();
  }, [loadStorageUsage]);

  useEffect(() => {
    loadStorageFiles({ showInitialLoader: page === 1 });
  }, [loadStorageFiles]);

  function onRefresh() {
    Promise.all([
      loadStorageUsage(),
      loadStorageFiles({ showRefreshLoader: true }),
    ]).catch(() => {});
  }

  function goToPreviousPage() {
    if (changingPage || page <= 1) {
      return;
    }

    setChangingPage(true);
    setPage(currentPage => Math.max(currentPage - 1, 1));
  }

  function goToNextPage() {
    if (changingPage || page >= meta.last_page) {
      return;
    }

    setChangingPage(true);
    setPage(currentPage => Math.min(currentPage + 1, meta.last_page));
  }

  async function deleteStorageFile(item) {
    const fileKey = getFileKey(item);

    try {
      setDeletingKey(fileKey);

      const response = await api('/api/storage-files', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disk: item?.disk,
          path: item?.path,
        }),
      });

      const isLastItemOnPage = files.length === 1 && page > 1;

      await loadStorageUsage();

      if (isLastItemOnPage) {
        setChangingPage(true);
        setPage(currentPage => Math.max(currentPage - 1, 1));
      } else {
        await loadStorageFiles();
      }

      Alert.alert(
        'File deleted',
        response?.message || 'The file was deleted successfully.',
      );
    } catch (error) {
      console.log('Delete storage file error:', error);

      Alert.alert(
        'Delete failed',
        error?.message || 'The file could not be deleted.',
      );
    } finally {
      setDeletingKey(null);
    }
  }

  function confirmDelete(item) {
    if (deletingKey) {
      return;
    }

    Alert.alert(
      'Delete file',
      'Are you sure you want to permanently delete this file? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteStorageFile(item),
        },
      ],
    );
  }

  function getFileKey(file) {
    return `${file?.disk || ''}:${file?.path || ''}`;
  }

  function renderFile({ item, index }) {
    const serialNumber = (meta.page - 1) * meta.per_page + index + 1;
    const fileKey = getFileKey(item);
    const isDeleting = deletingKey === fileKey;
    const anotherFileIsDeleting = Boolean(deletingKey) && !isDeleting;

    return (
      <View
        style={{
          paddingVertical: 14,
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderBottomColor: BORDER,
          backgroundColor:
            index % 2 === 0 ? 'rgba(20, 43, 73, 0.18)' : 'transparent',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {/* Serial number */}
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: CARD,
              borderWidth: 1,
              borderColor: BORDER,
              marginRight: 10,
            }}
          >
            <Text
              style={{
                color: TEXT,
                fontSize: 12,
                fontWeight: '800',
              }}
            >
              {serialNumber}
            </Text>
          </View>

          {/* File information */}
          <View
            style={{
              flex: 1,
              paddingRight: 8,
            }}
          >
            <Text
              selectable
              numberOfLines={3}
              ellipsizeMode="middle"
              style={{
                color: TEXT,
                fontSize: 13,
                fontWeight: '700',
                lineHeight: 19,
              }}
            >
              {item?.name || item?.path || 'Unknown file'}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <View
                style={{
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  borderRadius: 7,
                  backgroundColor: 'rgba(59, 113, 151, 0.18)',
                  borderWidth: 1,
                  borderColor: BORDER,
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    color: '#BFDBFE',
                    fontSize: 10,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  {item?.disk || 'Unknown'}
                </Text>
              </View>

              <Text
                style={{
                  color: MUTED,
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                {formatBytes(item?.size_bytes)}
              </Text>
            </View>
          </View>

          {/* Delete action */}
          <Pressable
            onPress={() => confirmDelete(item)}
            disabled={Boolean(deletingKey)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${item?.name || item?.path || 'file'}`}
            style={({ pressed }) => ({
              width: 42,
              height: 42,
              marginLeft: 6,
              borderRadius: 12,
              opacity: anotherFileIsDeleting ? 0.4 : pressed ? 0.82 : 1,

              elevation: 5,

              shadowColor: DANGER,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            })}
          >
            {({ pressed }) => (
              <LinearGradient
                colors={
                  pressed ? [DANGER_DARK, '#991B1B'] : ['#F87171', DANGER]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.18)',
                }}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <TrashIcon />
                )}
              </LinearGradient>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: BG,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ color: MUTED, marginTop: 12 }}>
          Loading storage files...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: BG,
        padding: 16,
      }}
    >
      <View style={{ marginBottom: 14 }}>
        <Text
          style={{
            color: TEXT,
            fontSize: 20,
            fontWeight: '800',
          }}
        >
          Storage files
        </Text>

        <Text
          style={{
            color: MUTED,
            marginTop: 5,
            lineHeight: 20,
          }}
        >
          Files stored in the public and private upload areas.
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          {storageLabel ? (
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 7,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: BORDER,
                backgroundColor: CARD,
                marginRight: 8,
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  color: TEXT,
                  fontSize: 12,
                  fontWeight: '800',
                }}
              >
                {storageLabel}
              </Text>
            </View>
          ) : null}

          <Text
            style={{
              color: MUTED,
              fontSize: 12,
              marginBottom: 6,
            }}
          >
            {meta.total} files
          </Text>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: BORDER,
          borderRadius: 14,
          overflow: 'hidden',
          backgroundColor: CARD_DARK,
        }}
      >
        <FlatList
          data={files}
          keyExtractor={(item, index) =>
            `${item?.disk || 'disk'}:${item?.path || index}`
          }
          renderItem={renderFile}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={TEXT}
              colors={[TEXT]}
            />
          }
          ListEmptyComponent={
            <View
              style={{
                paddingVertical: 60,
                paddingHorizontal: 20,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: MUTED,
                  textAlign: 'center',
                }}
              >
                No storage files found.
              </Text>
            </View>
          }
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 12,
        }}
      >
        <Pressable
          onPress={goToPreviousPage}
          disabled={page <= 1 || changingPage}
          style={({ pressed }) => ({
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: BORDER,
            backgroundColor: CARD,
            opacity: page <= 1 || changingPage ? 0.45 : pressed ? 0.75 : 1,
          })}
        >
          <Text style={{ color: TEXT, fontWeight: '700' }}>Previous</Text>
        </Pressable>

        <View style={{ alignItems: 'center' }}>
          {changingPage ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={{ color: MUTED, fontSize: 12 }}>
              Page {meta.page} of {meta.last_page}
            </Text>
          )}
        </View>

        <Pressable
          onPress={goToNextPage}
          disabled={page >= meta.last_page || changingPage}
          style={({ pressed }) => ({
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: BORDER,
            backgroundColor: CARD,
            opacity:
              page >= meta.last_page || changingPage
                ? 0.45
                : pressed
                ? 0.75
                : 1,
          })}
        >
          <Text style={{ color: TEXT, fontWeight: '700' }}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
