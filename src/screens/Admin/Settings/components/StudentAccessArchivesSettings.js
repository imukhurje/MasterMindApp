import React, { useCallback, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import RNBlobUtil from 'react-native-blob-util';

import { absoluteUrl, api, getToken } from '../../../../api/client';

import { COLORS, styles } from './StudentAccessArchivesSettings.styles';

const XLSX_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/*
 * Convert UTC API timestamp to India time.
 *
 * Example:
 * 2026-08-24T05:57:19Z
 * ->
 * 24/08/2026, 11:27:19
 */
function formatIndiaDateTime(value) {
  if (!value) {
    return '—';
  }

  const sourceDate = new Date(value);

  if (Number.isNaN(sourceDate.getTime())) {
    return String(value);
  }

  /*
   * India = UTC + 05:30.
   *
   * Using UTC getters after manually
   * adding the offset keeps the result
   * independent of device timezone.
   */
  const indiaTime = new Date(sourceDate.getTime() + 5.5 * 60 * 60 * 1000);

  const pad = number => String(number).padStart(2, '0');

  const day = pad(indiaTime.getUTCDate());

  const month = pad(indiaTime.getUTCMonth() + 1);

  const year = indiaTime.getUTCFullYear();

  const hour = pad(indiaTime.getUTCHours());

  const minute = pad(indiaTime.getUTCMinutes());

  const second = pad(indiaTime.getUTCSeconds());

  return `${day}/${month}/${year}, ${hour}:${minute}:${second}`;
}

function formatFileSize(bytes) {
  const value = Number(bytes);

  if (!Number.isFinite(value) || value < 0) {
    return '—';
  }

  if (value < 1024) {
    return `${value} B`;
  }

  const kb = value / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  const mb = kb / 1024;

  return `${mb.toFixed(1)} MB`;
}

function sanitizeFilename(value) {
  const filename = String(value || 'student-access-archive.xlsx')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '_');

  if (filename.toLowerCase().endsWith('.xlsx')) {
    return filename;
  }

  return `${filename}.xlsx`;
}

function getErrorMessage(error, fallback) {
  return (
    error?.payload?.message ||
    error?.payload?.error ||
    error?.message ||
    fallback
  );
}

export default function StudentAccessArchivesSettings() {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadError, setLoadError] = useState('');

  const [archives, setArchives] = useState([]);

  const [downloadingId, setDownloadingId] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  /*
   * Load archives.
   */
  const loadArchives = useCallback(async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setLoadError('');

      const response = await api('/api/settings/v1/student-access-archives', {
        method: 'GET',
      });

      const list = Array.isArray(response?.archives) ? response.archives : [];

      setArchives(list);
    } catch (error) {
      console.log('Student access archives load error:', error);

      setLoadError(
        getErrorMessage(error, 'Could not load student access archives.'),
      );
    } finally {
      setLoading(false);

      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadArchives();
  }, [loadArchives]);

  /*
   * Direct XLSX download.
   *
   * This endpoint does not return JSON.
   * It returns the file directly.
   */
  async function handleDownload(archive) {
    if (!archive?.id || downloadingId) {
      return;
    }

    if (archive?.available === false) {
      Alert.alert(
        'Archive Unavailable',
        'This archive file is no longer available for download.',
      );

      return;
    }

    const archiveId = Number(archive.id);

    const filename = sanitizeFilename(archive?.filename);

    const url = absoluteUrl(
      `/api/settings/v1/student-access-archives/${archiveId}/download`,
    );

    try {
      setDownloadingId(archiveId);

      const token = await getToken();

      const headers = {
        Accept: XLSX_MIME,

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      };

      if (Platform.OS === 'android') {
        /*
         * Android Download Manager handles
         * the file directly and shows a
         * system download notification.
         */
        await RNBlobUtil.config({
          addAndroidDownloads: {
            useDownloadManager: true,

            notification: true,

            title: filename,

            description: 'Downloading student access archive',

            mime: XLSX_MIME,

            mediaScannable: true,
          },
        }).fetch('GET', url, headers);

        Alert.alert(
          'Download Started',
          `${filename} has been sent to your Downloads folder.`,
        );

        return;
      }

      /*
       * iOS:
       * Save to the app Documents folder
       * and open the document viewer.
       */
      const path = `${RNBlobUtil.fs.dirs.DocumentDir}/${filename}`;

      const response = await RNBlobUtil.config({
        path,

        fileCache: true,
      }).fetch('GET', url, headers);

      const status = Number(response?.info?.()?.status || 200);

      if (status < 200 || status >= 300) {
        throw new Error(`Download failed with status ${status}.`);
      }

      await RNBlobUtil.ios.openDocument(response.path());
    } catch (error) {
      console.log('Student archive download error:', error);

      Alert.alert(
        'Download Failed',
        getErrorMessage(
          error,
          'Could not download the student access archive.',
        ),
      );
    } finally {
      setDownloadingId(null);
    }
  }

  function confirmDelete(archive) {
    if (!archive?.id || deletingId) {
      return;
    }

    Alert.alert(
      'Delete Archive',
      `Are you sure you want to permanently delete "${
        archive?.filename || 'this archive'
      }"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: () => deleteArchive(archive),
        },
      ],
    );
  }

  /*
   * Delete archive.
   */
  async function deleteArchive(archive) {
    if (!archive?.id || deletingId) {
      return;
    }

    const archiveId = Number(archive.id);

    try {
      setDeletingId(archiveId);

      const response = await api(
        `/api/settings/v1/student-access-archives/${archiveId}`,
        {
          method: 'DELETE',
        },
      );

      /*
       * Some DELETE APIs may return
       * { ok: true } while others may
       * return an empty successful body.
       *
       * api() will already throw for a
       * non-2xx response, so reaching
       * here means the delete succeeded.
       */
      console.log('Delete student access archive response:', response);

      /*
       * Remove immediately for a faster UI.
       */
      setArchives(previous =>
        previous.filter(item => Number(item?.id) !== archiveId),
      );

      Alert.alert(
        'Archive Deleted',
        'The student access archive has been deleted successfully.',
      );
    } catch (error) {
      console.log('Student access archive delete error:', error);

      Alert.alert(
        'Could not delete archive',
        getErrorMessage(
          error,
          'The student access archive could not be deleted.',
        ),
      );
    } finally {
      setDeletingId(null);
    }
  }

  /*
   * Initial loading state.
   */
  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />

          <Text style={styles.stateText}>
            Loading student access archives...
          </Text>
        </View>
      </View>
    );
  }

  /*
   * Load error.
   */
  if (loadError && archives.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student Access Archives</Text>

        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Could not load archives</Text>

          <Text style={styles.errorDescription}>{loadError}</Text>

          <Pressable
            onPress={() => loadArchives()}
            style={({ pressed }) => [
              styles.primaryButton,

              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      {/* Header */}

      <Text style={styles.sectionTitle}>Student Access Archives</Text>

      <Text style={styles.description}>
        Access records are kept for the current week. Every Sunday, completed
        records are moved to a private XLSX archive and removed from the
        database.
      </Text>

      {/* Refresh */}

      <View style={styles.topActions}>
        <Pressable
          disabled={refreshing}
          onPress={() => loadArchives(true)}
          style={({ pressed }) => [
            styles.refreshButton,

            refreshing && styles.buttonDisabled,

            pressed && !refreshing && styles.buttonPressed,
          ]}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color={COLORS.TEXT} />
          ) : (
            <Text style={styles.refreshButtonText}>↻ Refresh</Text>
          )}
        </Pressable>
      </View>

      {loadError ? (
        <View style={styles.inlineError}>
          <Text style={styles.inlineErrorText}>{loadError}</Text>
        </View>
      ) : null}

      {/* Archive Count */}

      <View style={styles.archiveSummaryRow}>
        <Text style={styles.archiveCount}>
          {archives.length} private{' '}
          {archives.length === 1 ? 'archive' : 'archives'}
        </Text>

        <View style={styles.privateBadge}>
          <Text style={styles.privateBadgeText}>PRIVATE XLSX</Text>
        </View>
      </View>

      {/* Empty State */}

      {archives.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>XLSX</Text>
          </View>

          <Text style={styles.emptyTitle}>No archives yet</Text>

          <Text style={styles.emptyDescription}>
            Completed weekly student access records will appear here after they
            are archived.
          </Text>
        </View>
      ) : (
        <View style={styles.archiveList}>
          {archives.map(archive => {
            const isDownloading = downloadingId === Number(archive.id);

            const isDeleting = deletingId === Number(archive.id);

            const isBusy = isDownloading || isDeleting;

            return (
              <View
                key={archive.id}
                style={[
                  styles.archiveCard,

                  isMobile && styles.archiveCardMobile,

                  archive?.available === false && styles.archiveCardUnavailable,
                ]}
              >
                {/* File Information */}

                <View style={styles.archiveInfo}>
                  <View style={styles.filenameRow}>
                    <View style={styles.fileIcon}>
                      <Text style={styles.fileIconText}>X</Text>
                    </View>

                    <View style={styles.filenameContent}>
                      <Text style={styles.filename}>{archive.filename}</Text>

                      {archive?.available === false ? (
                        <Text style={styles.unavailableText}>
                          File unavailable
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  {/* Period */}

                  <View style={styles.metadataSection}>
                    <Text style={styles.metadataLabel}>ARCHIVE PERIOD</Text>

                    <Text style={styles.periodText}>
                      {formatIndiaDateTime(archive.period_started_at)}
                      {'  –  '}
                      {formatIndiaDateTime(archive.period_ended_at)}
                    </Text>
                  </View>

                  {/* Statistics */}

                  <View style={styles.statsRow}>
                    <View style={styles.statChip}>
                      <Text style={styles.statValue}>
                        {Number(archive?.event_count || 0)}
                      </Text>

                      <Text style={styles.statLabel}>events</Text>
                    </View>

                    <View style={styles.statChip}>
                      <Text style={styles.statValue}>
                        {Number(archive?.alert_count || 0)}
                      </Text>

                      <Text style={styles.statLabel}>alerts</Text>
                    </View>

                    <View style={styles.statChip}>
                      <Text style={styles.statValue}>
                        {formatFileSize(archive?.size_bytes)}
                      </Text>

                      <Text style={styles.statLabel}>size</Text>
                    </View>
                  </View>
                </View>

                {/* Actions */}

                <View
                  style={[
                    styles.archiveActions,

                    isMobile && styles.archiveActionsMobile,
                  ]}
                >
                  <Pressable
                    disabled={isBusy || archive?.available === false}
                    onPress={() => handleDownload(archive)}
                    style={({ pressed }) => [
                      styles.downloadButton,

                      isMobile && styles.mobileActionButton,

                      (isBusy || archive?.available === false) &&
                        styles.buttonDisabled,

                      pressed &&
                        !isBusy &&
                        archive?.available !== false &&
                        styles.buttonPressed,
                    ]}
                  >
                    {isDownloading ? (
                      <ActivityIndicator size="small" color={COLORS.TEXT} />
                    ) : (
                      <>
                        <Text style={styles.downloadIcon}>↓</Text>

                        <Text style={styles.downloadButtonText}>Download</Text>
                      </>
                    )}
                  </Pressable>

                  <Pressable
                    disabled={isBusy}
                    onPress={() => confirmDelete(archive)}
                    style={({ pressed }) => [
                      styles.deleteButton,

                      isMobile && styles.mobileActionButton,

                      isBusy && styles.buttonDisabled,

                      pressed && !isBusy && styles.buttonPressed,
                    ]}
                  >
                    {isDeleting ? (
                      <ActivityIndicator size="small" color={COLORS.TEXT} />
                    ) : (
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
