import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';

import { api } from '../../../api/client';

import { COLORS, styles } from './AdminClassworks.styles';
import CreateClassworkModal from './CreateClassworkModal';

const PAGE_SIZE = 12;

const BLOCKED_MEDIA_EXTENSIONS = new Set([
  'mp4',
  'mov',
  'm4v',
  'avi',
  'mkv',
  'webm',
  '3gp',
  'mp3',
  'wav',
  'm4a',
  'aac',
  'ogg',
  'flac',
]);

const IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'bmp',
  'heic',
  'heif',
]);

function getExtension(fileName) {
  const name = String(fileName || '');

  const parts = name.split('.');

  if (parts.length < 2) {
    return '';
  }

  return String(parts[parts.length - 1]).toLowerCase();
}

function isImageFileName(fileName) {
  return IMAGE_EXTENSIONS.has(getExtension(fileName));
}

function isBlockedMediaFile(file) {
  const mimeType = String(file?.type || '').toLowerCase();

  if (mimeType.startsWith('video/') || mimeType.startsWith('audio/')) {
    return true;
  }

  return BLOCKED_MEDIA_EXTENSIONS.has(getExtension(file?.name));
}

function normalizeClassGroups(response) {
  const classes = Array.isArray(response?.classes) ? response.classes : [];

  return classes
    .map(item => {
      const id = Number(item?.id);

      if (!Number.isFinite(id)) {
        return null;
      }

      const name = String(item?.name || `Class ${id}`);

      const section =
        item?.section === null || item?.section === undefined
          ? ''
          : String(item.section);

      return {
        ...item,

        id,

        label: section ? `${name} (${section})` : name,
      };
    })
    .filter(Boolean);
}

function normalizeClassworks(response) {
  const items = Array.isArray(response?.items) ? response.items : [];

  return items
    .map(item => {
      const id = Number(item?.id);

      if (!Number.isFinite(id)) {
        return null;
      }

      return {
        ...item,

        id,

        title: String(item?.title || ''),

        body:
          item?.body === null || item?.body === undefined
            ? ''
            : String(item.body),

        class_group_id: Number(item?.class_group_id) || null,
      };
    })
    .filter(Boolean);
}

function normalizeFiles(response) {
  const files = Array.isArray(response?.files) ? response.files : [];

  return files.filter(item => item?.id && item?.url);
}

function normalizeMessages(response) {
  return Array.isArray(response) ? response : [];
}

function formatClassworkDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const day = String(date.getDate()).padStart(2, '0');

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');

  const minutes = String(date.getMinutes()).padStart(2, '0');

  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year}, ` + `${hours}:${minutes}:${seconds}`;
}

function formatFileSize(size) {
  const bytes = Number(size);

  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminClassworks() {
  const { width } = useWindowDimensions();

  const compact = width < 720;

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [creatingClasswork, setCreatingClasswork] = useState(false);
  const [classGroups, setClassGroups] = useState([]);

  const [classworks, setClassworks] = useState([]);

  const [selectedClasswork, setSelectedClasswork] = useState(null);

  const [searchText, setSearchText] = useState('');

  const [page, setPage] = useState(1);

  const [loadingClassworks, setLoadingClassworks] = useState(true);

  const [classworksError, setClassworksError] = useState('');

  const [files, setFiles] = useState([]);

  const [messages, setMessages] = useState([]);

  const [loadingDetails, setLoadingDetails] = useState(false);

  const [detailsError, setDetailsError] = useState('');

  const [uploadingFiles, setUploadingFiles] = useState(false);

  const [messageBody, setMessageBody] = useState('');

  const [sendingMessage, setSendingMessage] = useState(false);

  const loadClassGroups = useCallback(async () => {
    try {
      const response = await api('/api/class-groups', {
        method: 'GET',
      });

      setClassGroups(normalizeClassGroups(response));
    } catch (error) {
      /*
       * Class groups are only needed for
       * the future create functionality,
       * so failure must not block this page.
       */
      console.log('Class groups API error:', error);
    }
  }, []);

  const loadClassworks = useCallback(async ({ selectId = null } = {}) => {
    try {
      setLoadingClassworks(true);

      setClassworksError('');

      const response = await api('/api/classworks', {
        method: 'GET',
      });

      const items = normalizeClassworks(response);

      setClassworks(items);

      setSelectedClasswork(previous => {
        /*
         * After create, explicitly select
         * the newly created classwork.
         */
        if (selectId) {
          const created = items.find(
            item => String(item.id) === String(selectId),
          );

          if (created) {
            return created;
          }
        }

        /*
         * Otherwise preserve the current
         * selected classwork.
         */
        if (previous?.id) {
          const existing = items.find(
            item => String(item.id) === String(previous.id),
          );

          if (existing) {
            return existing;
          }
        }

        return items[0] || null;
      });
    } catch (error) {
      console.log('Classworks API error:', error);

      setClassworksError(error?.message || 'Could not load classworks.');
    } finally {
      setLoadingClassworks(false);
    }
  }, []);

  useEffect(() => {
    loadClassworks();

    loadClassGroups();
  }, [loadClassworks, loadClassGroups]);

  /*
   * Load the files and messages whenever
   * the selected classwork changes.
   */
  useEffect(() => {
    const classworkId = selectedClasswork?.id;

    if (!classworkId) {
      setFiles([]);
      setMessages([]);
      return;
    }

    let cancelled = false;

    async function loadDetails() {
      try {
        setLoadingDetails(true);

        setDetailsError('');

        const [filesResponse, messagesResponse] = await Promise.all([
          api(`/api/classworks/${classworkId}/files`, {
            method: 'GET',
          }),

          api(`/api/classworks/${classworkId}/messages`, {
            method: 'GET',
          }),
        ]);

        if (cancelled) {
          return;
        }

        setFiles(normalizeFiles(filesResponse));

        setMessages(normalizeMessages(messagesResponse));
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.log('Classwork detail API error:', error);

        setDetailsError(error?.message || 'Could not load classwork details.');
      } finally {
        if (!cancelled) {
          setLoadingDetails(false);
        }
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [selectedClasswork?.id]);

  const filteredClassworks = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return classworks;
    }

    return classworks.filter(item => {
      const title = String(item?.title || '').toLowerCase();

      const body = String(item?.body || '').toLowerCase();

      return title.includes(query) || body.includes(query);
    });
  }, [classworks, searchText]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredClassworks.length / PAGE_SIZE),
  );

  useEffect(() => {
    setPage(1);
  }, [searchText]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return filteredClassworks.slice(start, start + PAGE_SIZE);
  }, [filteredClassworks, page]);

  const showingStart =
    filteredClassworks.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

  const showingEnd =
    filteredClassworks.length === 0
      ? 0
      : Math.min(page * PAGE_SIZE, filteredClassworks.length);

  function handleAddClasswork() {
    if (creatingClasswork) {
      return;
    }

    if (classGroups.length === 0) {
      Alert.alert(
        'No Classes Available',
        'Class groups could not be found. Please refresh and try again.',
      );

      return;
    }

    setCreateModalVisible(true);
  }

  function handleCloseCreateModal() {
    if (creatingClasswork) {
      return;
    }

    setCreateModalVisible(false);
  }

  async function handleCreateClasswork(values) {
    if (creatingClasswork) {
      return;
    }

    const title = String(values?.title || '').trim();

    const classGroupId = Number(values?.class_group_id);

    const body = String(values?.body || '').trim();

    if (!title) {
      Alert.alert('Title Required', 'Please enter a classwork title.');

      return;
    }

    if (!Number.isFinite(classGroupId)) {
      Alert.alert('Class Required', 'Please select a class.');

      return;
    }

    try {
      setCreatingClasswork(true);

      const payload = {
        title,

        class_group_id: classGroupId,

        body: body || null,
      };

      console.log('Create classwork payload:', payload);

      const response = await api('/api/classworks', {
        method: 'POST',

        body: JSON.stringify(payload),
      });

      if (!response?.ok || !response?.id) {
        throw new Error('The server did not confirm classwork creation.');
      }

      setCreateModalVisible(false);

      /*
       * Reload because the POST response only
       * contains id and ok, not the full object.
       */
      await loadClassworks({
        selectId: response.id,
      });

      Alert.alert(
        'Classwork Created',
        'The classwork has been created successfully.',
      );
    } catch (error) {
      console.log('Create classwork error:', error);

      Alert.alert(
        'Could not create classwork',
        error?.message || 'The classwork could not be created.',
      );
    } finally {
      setCreatingClasswork(false);
    }
  }

  async function handleChooseFiles() {
    const classworkId = selectedClasswork?.id;

    if (!classworkId || uploadingFiles) {
      return;
    }

    try {
      const result = await pick({
        type: [types.allFiles],

        allowMultiSelection: true,

        mode: 'import',
      });

      const pickedFiles = Array.isArray(result) ? result : [];

      if (pickedFiles.length === 0) {
        return;
      }

      const blockedFiles = pickedFiles.filter(isBlockedMediaFile);

      if (blockedFiles.length > 0) {
        Alert.alert(
          'Unsupported Files',
          'Audio and video files cannot be uploaded to classwork.',
        );

        return;
      }

      await uploadFiles(pickedFiles);
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      console.log('Classwork file picker error:', error);

      Alert.alert(
        'Could not select files',
        error?.message || 'The files could not be selected.',
      );
    }
  }

  async function uploadFiles(pickedFiles) {
    const classworkId = selectedClasswork?.id;

    if (!classworkId) {
      return;
    }

    try {
      setUploadingFiles(true);

      const formData = new FormData();

      pickedFiles.forEach((file, index) => {
        formData.append('files[]', {
          uri: file.uri,

          name: file.name || `attachment-${Date.now()}-${index}`,

          type: file.type || 'application/octet-stream',
        });
      });

      const response = await api(`/api/classworks/${classworkId}/files`, {
        method: 'POST',

        body: formData,
      });

      const uploadedFiles = normalizeFiles(response);

      if (uploadedFiles.length === 0) {
        throw new Error('The server did not return the uploaded files.');
      }

      setFiles(previous => {
        const map = new Map();

        [...previous, ...uploadedFiles].forEach(file => {
          map.set(String(file.id), file);
        });

        return Array.from(map.values());
      });

      Alert.alert(
        'Attachments Uploaded',
        `${uploadedFiles.length} file${
          uploadedFiles.length === 1 ? '' : 's'
        } uploaded successfully.`,
      );
    } catch (error) {
      console.log('Classwork upload error:', error);

      Alert.alert(
        'Could not upload attachments',
        error?.message || 'The attachments could not be uploaded.',
      );
    } finally {
      setUploadingFiles(false);
    }
  }

  async function handleOpenFile(file) {
    const url = String(file?.url || '').trim();

    if (!url) {
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        throw new Error('This attachment cannot be opened on this device.');
      }

      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        'Could not open attachment',
        error?.message || 'The attachment could not be opened.',
      );
    }
  }

  async function handleSendMessage() {
    const classworkId = selectedClasswork?.id;

    const body = messageBody.trim();

    if (!classworkId || !body || sendingMessage) {
      return;
    }

    try {
      setSendingMessage(true);

      const response = await api(`/api/classworks/${classworkId}/messages`, {
        method: 'POST',

        body: JSON.stringify({
          body,
        }),
      });

      if (!response?.id) {
        throw new Error('The server did not return the created message.');
      }

      setMessages(previous => [...previous, response]);

      setMessageBody('');
    } catch (error) {
      console.log('Classwork message send error:', error);

      Alert.alert(
        'Could not send message',
        error?.message || 'The message could not be sent.',
      );
    } finally {
      setSendingMessage(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screenScroll}
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Classwork Selector */}

        <View style={styles.selectorSection}>
          <View style={styles.selectorTitleRow}>
            <Text style={styles.sectionTitle}>Classwork Selector</Text>

            <Pressable
              onPress={handleAddClasswork}
              style={({ pressed }) => [
                styles.addClassworkButton,

                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.addClassworkButtonText}>+ Add Classwork</Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.selectorControls,

              compact && styles.selectorControlsCompact,
            ]}
          >
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search classworks..."
              placeholderTextColor={COLORS.MUTED}
              style={styles.searchInput}
            />

            <View style={styles.paginationArea}>
              <Text style={styles.showingText}>
                Showing {showingStart}-{showingEnd} of{' '}
                {filteredClassworks.length}
              </Text>

              <View style={styles.paginationControls}>
                <Pressable
                  onPress={() => setPage(previous => Math.max(1, previous - 1))}
                  disabled={page <= 1}
                  style={({ pressed }) => [
                    styles.pageButton,

                    pressed && page > 1 && styles.buttonPressed,

                    page <= 1 && styles.buttonDisabled,
                  ]}
                >
                  <Text style={styles.pageButtonText}>Prev</Text>
                </Pressable>

                <Text style={styles.pageText}>
                  Page {page} / {totalPages}
                </Text>

                <Pressable
                  onPress={() =>
                    setPage(previous => Math.min(totalPages, previous + 1))
                  }
                  disabled={page >= totalPages}
                  style={({ pressed }) => [
                    styles.pageButton,

                    pressed && page < totalPages && styles.buttonPressed,

                    page >= totalPages && styles.buttonDisabled,
                  ]}
                >
                  <Text style={styles.pageButtonText}>Next</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {loadingClassworks ? (
            <View style={styles.selectorLoading}>
              <ActivityIndicator size="large" color={COLORS.BLUE} />

              <Text style={styles.loadingText}>Loading classworks...</Text>
            </View>
          ) : classworksError ? (
            <View style={styles.selectorError}>
              <Text style={styles.errorText}>{classworksError}</Text>

              <Pressable
                onPress={() => loadClassworks()}
                style={({ pressed }) => [
                  styles.retryButton,

                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          ) : pageItems.length === 0 ? (
            <View style={styles.selectorEmpty}>
              <Text style={styles.emptyText}>No classworks found.</Text>
            </View>
          ) : (
            <View
              style={[
                styles.classworkListViewport,

                compact && styles.classworkListViewportCompact,
              ]}
            >
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator
                persistentScrollbar
                contentContainerStyle={styles.classworkListScrollContent}
              >
                <View style={styles.classworkGrid}>
                  {pageItems.map(item => {
                    const selected =
                      String(selectedClasswork?.id) === String(item.id);

                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => setSelectedClasswork(item)}
                        style={({ pressed }) => [
                          styles.classworkCard,

                          compact && styles.classworkCardCompact,

                          selected && styles.classworkCardSelected,

                          pressed && styles.buttonPressed,
                        ]}
                      >
                        <Text style={styles.classworkTitle} numberOfLines={1}>
                          {item.title || 'Untitled Classwork'}
                        </Text>

                        <Text style={styles.classworkDate} numberOfLines={1}>
                          {formatClassworkDate(item.created_at)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        {/* Selected Classwork */}

        {selectedClasswork ? (
          <View style={styles.detailSection}>
            <View
              style={[styles.detailTop, compact && styles.detailTopCompact]}
            >
              <View style={styles.classworkInformation}>
                <Text style={styles.selectedTitle}>
                  {selectedClasswork.title}
                </Text>

                {selectedClasswork.body ? (
                  <Text style={styles.selectedBody}>
                    {selectedClasswork.body}
                  </Text>
                ) : (
                  <Text style={styles.noBodyText}>
                    No classwork description.
                  </Text>
                )}
              </View>

              {/* Upload Attachments */}

              <View style={styles.uploadCard}>
                <Text style={styles.uploadTitle}>Upload attachments</Text>

                <Text style={styles.uploadHint}>
                  Images, PDF, Word, Excel and other document files are allowed.
                </Text>

                <View style={styles.uploadDropArea}>
                  <Text style={styles.uploadDropText}>
                    Select one or multiple files
                  </Text>

                  <Text style={styles.uploadOrText}>
                    Audio and video are not allowed
                  </Text>

                  <Pressable
                    onPress={handleChooseFiles}
                    disabled={uploadingFiles}
                    style={({ pressed }) => [
                      styles.chooseFilesButton,

                      pressed && !uploadingFiles && styles.buttonPressed,

                      uploadingFiles && styles.buttonDisabled,
                    ]}
                  >
                    {uploadingFiles ? (
                      <ActivityIndicator size="small" color={COLORS.TEXT} />
                    ) : (
                      <Text style={styles.chooseFilesButtonText}>
                        Choose files
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </View>

            {loadingDetails ? (
              <View style={styles.detailLoading}>
                <ActivityIndicator size="large" color={COLORS.BLUE} />

                <Text style={styles.loadingText}>
                  Loading attachments and messages...
                </Text>
              </View>
            ) : (
              <>
                {detailsError ? (
                  <Text style={styles.detailErrorText}>{detailsError}</Text>
                ) : null}

                {/* Attachments */}

                <View style={styles.attachmentsSection}>
                  <Text style={styles.subSectionTitle}>Attachments</Text>

                  {files.length === 0 ? (
                    <Text style={styles.emptyText}>No attachments.</Text>
                  ) : (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.attachmentsRow}
                    >
                      {files.map(file => (
                        <AttachmentCard
                          key={file.id}
                          file={file}
                          onPress={() => handleOpenFile(file)}
                        />
                      ))}
                    </ScrollView>
                  )}
                </View>

                {/* Messages */}

                <View style={styles.messagesSection}>
                  <Text style={styles.subSectionTitle}>Messages</Text>

                  <View style={styles.messagesContainer}>
                    {messages.length === 0 ? (
                      <Text style={styles.emptyText}>No messages yet.</Text>
                    ) : (
                      messages.map(message => (
                        <View key={message.id} style={styles.messageBubble}>
                          <Text style={styles.messageBody}>{message.body}</Text>

                          <Text style={styles.messageMeta}>
                            {message?.user?.name || 'User'}
                            {' · '}
                            {message.created_at}
                          </Text>
                        </View>
                      ))
                    )}
                  </View>

                  <View style={styles.messageInputRow}>
                    <TextInput
                      value={messageBody}
                      onChangeText={setMessageBody}
                      editable={!sendingMessage}
                      placeholder="Write a message..."
                      placeholderTextColor={COLORS.MUTED}
                      multiline
                      style={styles.messageInput}
                    />

                    <Pressable
                      onPress={handleSendMessage}
                      disabled={sendingMessage || !messageBody.trim()}
                      style={({ pressed }) => [
                        styles.sendButton,

                        pressed &&
                          !sendingMessage &&
                          messageBody.trim() &&
                          styles.buttonPressed,

                        (sendingMessage || !messageBody.trim()) &&
                          styles.buttonDisabled,
                      ]}
                    >
                      {sendingMessage ? (
                        <ActivityIndicator size="small" color={COLORS.TEXT} />
                      ) : (
                        <Text style={styles.sendButtonText}>Send</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          </View>
        ) : null}
      </ScrollView>

      <CreateClassworkModal
        visible={createModalVisible}
        classGroups={classGroups}
        saving={creatingClasswork}
        onClose={handleCloseCreateModal}
        onCreate={handleCreateClasswork}
      />
    </SafeAreaView>
  );
}

function AttachmentCard({ file, onPress }) {
  const fileName = String(file?.original_name || 'Attachment');

  const isImage = isImageFileName(fileName);

  const extension = getExtension(fileName);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.attachmentCard,

        pressed && styles.buttonPressed,
      ]}
    >
      {isImage ? (
        <Image
          source={{
            uri: file.url,
          }}
          resizeMode="cover"
          style={styles.attachmentImage}
        />
      ) : (
        <View style={styles.documentPreview}>
          <Text style={styles.documentIcon}>📄</Text>

          <Text style={styles.documentExtension}>
            {extension ? extension.toUpperCase() : 'FILE'}
          </Text>
        </View>
      )}

      <Text style={styles.attachmentName} numberOfLines={1}>
        {fileName}
      </Text>

      {file?.size ? (
        <Text style={styles.attachmentSize}>{formatFileSize(file.size)}</Text>
      ) : null}
    </Pressable>
  );
}
