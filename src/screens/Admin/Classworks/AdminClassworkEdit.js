import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import styles from './AdminClassworkEdit.styles';

import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';

import { api } from '../../../api/client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function formatCreatedAt(value) {
  if (!value) {
    return '';
  }

  const raw = String(value).trim();
  const [datePart, timePart] = raw.split(' ');

  if (!datePart) {
    return raw;
  }

  const parts = datePart.split('-');

  if (parts.length !== 3) {
    return raw;
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}${timePart ? `, ${timePart}` : ''}`;
}

function formatFileSize(bytes) {
  const size = Number(bytes || 0);

  if (!size) {
    return '';
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export default function AdminClassworkEdit() {
  const navigation = useNavigation();

  const route = useRoute();

  const id = route?.params?.id;

  const classwork = route?.params?.classwork || {};

  const [title, setTitle] = useState(String(classwork?.title || ''));

  const [note, setNote] = useState(String(classwork?.body || ''));

  const [message, setMessage] = useState('');

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [attachments, setAttachments] = useState([]);
  const [messages, setMessages] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const [deletingFileId, setDeletingFileId] = useState(null);
  const [savingChanges, setSavingChanges] = useState(false);

  const classText = useMemo(() => {
    const name = String(classwork?.class_name || '').trim();

    const section = String(classwork?.section || '').trim();

    if (name && section) {
      return `${name} — ${section}`;
    }

    return name;
  }, [classwork]);

  const handleChooseFiles = async () => {
    try {
      const result = await pick({
        type: [types.images, types.pdf],
        allowMultiSelection: true,
      });

      const normalizedFiles = result.map(file => ({
        uri: file.uri,
        name: file.name || 'File',
        type: file.type || 'application/octet-stream',
        size: Number(file.size || 0),
      }));

      setSelectedFiles(prev => [...prev, ...normalizedFiles]);
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      console.log('Choose files error:', error);

      Alert.alert('Attachments', error?.message || 'Could not select files.');
    }
  };

  const removeSelectedFile = index => {
    setSelectedFiles(prev =>
      prev.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  const loadAttachments = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      const response = await api(
        `/api/classworks/${encodeURIComponent(id)}/files`,
      );

      setAttachments(Array.isArray(response?.files) ? response.files : []);
    } catch (error) {
      console.log('Classwork attachments load error:', error);
    }
  }, [id]);

  const loadMessages = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      const response = await api(
        `/api/classworks/${encodeURIComponent(id)}/messages`,
      );

      setMessages(Array.isArray(response) ? response : []);
    } catch (error) {
      console.log('Classwork messages load error:', error);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    loadAttachments();
    loadMessages();
  }, [id, loadAttachments, loadMessages]);

  const handleUploadFiles = async () => {
    if (!id) {
      return;
    }

    if (selectedFiles.length === 0) {
      Alert.alert('Attachments', 'Please choose at least one file.');
      return;
    }

    if (uploading) {
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      selectedFiles.forEach(file => {
        formData.append('files[]', {
          uri: file.uri,
          name: file.name || `attachment_${Date.now()}`,
          type: file.type || 'application/octet-stream',
        });
      });

      const response = await api(
        `/api/classworks/${encodeURIComponent(id)}/files`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!Array.isArray(response?.files)) {
        throw new Error('Could not upload the selected files.');
      }

      // Clear local selections after successful upload.
      setSelectedFiles([]);

      // Reload attachments from server.
      await loadAttachments();
    } catch (error) {
      console.log('Classwork file upload error:', error);

      Alert.alert(
        'Upload failed',
        error?.message || 'Could not upload the selected files.',
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    if (!id || sendingMessage) {
      return;
    }

    try {
      setSendingMessage(true);

      const response = await api(
        `/api/classworks/${encodeURIComponent(id)}/messages`,
        {
          method: 'POST',
          body: JSON.stringify({
            body: trimmedMessage,
          }),
        },
      );

      if (!response?.id) {
        throw new Error('Could not send the message.');
      }

      setMessage('');

      // Reload complete message history.
      await loadMessages();
    } catch (error) {
      console.log('Classwork send message error:', error);

      Alert.alert('Message', error?.message || 'Could not send the message.');
    } finally {
      setSendingMessage(false);
    }
  };

  const confirmDeleteAttachment = file => {
    if (!file?.id) {
      return;
    }

    Alert.alert(
      'Remove attachment',
      'Remove this attachment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => handleDeleteAttachment(file),
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const handleDeleteAttachment = async file => {
    if (!id || !file?.id || deletingFileId) {
      return;
    }

    try {
      setDeletingFileId(file.id);

      await api(
        `/api/classworks/${encodeURIComponent(id)}/files/${encodeURIComponent(
          file.id,
        )}`,
        {
          method: 'DELETE',
        },
      );

      // Reload attachments after successful deletion.
      await loadAttachments();
    } catch (error) {
      console.log('Classwork attachment delete error:', error);

      Alert.alert(
        'Remove failed',
        error?.message || 'Could not remove the attachment.',
      );
    } finally {
      setDeletingFileId(null);
    }
  };

  const handleSaveChanges = async () => {
    const trimmedTitle = title.trim();
    const trimmedNote = note.trim();

    if (!id || savingChanges) {
      return;
    }

    if (!trimmedTitle) {
      Alert.alert('Classwork', 'Please enter a title.');
      return;
    }

    try {
      setSavingChanges(true);

      const payload = {
        title: trimmedTitle,
        body: trimmedNote || null,
      };

      const response = await api(`/api/classworks/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (response?.ok !== true) {
        throw new Error('Could not update the classwork.');
      }

      Alert.alert('Classwork updated', 'Changes saved successfully.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.log('Classwork update error:', error);

      Alert.alert(
        'Save failed',
        error?.message || 'Could not save the classwork changes.',
      );
    } finally {
      setSavingChanges(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>Edit Classwork</Text>

        <Text style={styles.metaText}>
          {classText}

          {!!classwork?.created_at &&
            ` · ${formatCreatedAt(classwork.created_at)}`}
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Note</Text>

          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            textAlignVertical="top"
            style={[styles.input, styles.noteInput]}
          />
        </View>

        <View style={styles.divider} />

        {/* Attachments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments</Text>

          <Text style={styles.sectionSubtitle}>Download shared files</Text>

          <View style={styles.attachmentControls}>
            <Pressable style={styles.chooseButton} onPress={handleChooseFiles}>
              <Text style={styles.chooseButtonText}>
                {selectedFiles.length > 0
                  ? `Choose Files · ${selectedFiles.length} selected`
                  : 'Choose Files'}
              </Text>
            </Pressable>

            <Pressable
              disabled={selectedFiles.length === 0 || uploading}
              onPress={handleUploadFiles}
              style={({ pressed }) => [
                styles.uploadButton,

                (selectedFiles.length === 0 || uploading) &&
                  styles.buttonDisabled,

                pressed &&
                  !uploading &&
                  selectedFiles.length > 0 &&
                  styles.controlPressed,
              ]}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.uploadButtonText}>Upload</Text>
              )}
            </Pressable>
          </View>

          {/* Newly selected files waiting for upload */}
          {selectedFiles.length > 0 ? (
            <View style={styles.selectedFilesList}>
              <Text style={styles.pendingFilesTitle}>Ready to upload</Text>

              {selectedFiles.map((file, index) => (
                <View
                  key={`${file.uri}-${index}`}
                  style={styles.selectedFileCard}
                >
                  <View style={styles.selectedFileInfo}>
                    <Text style={styles.selectedFileName} numberOfLines={1}>
                      {file.name}
                    </Text>

                    {file.size > 0 ? (
                      <Text style={styles.selectedFileSize}>
                        {formatFileSize(file.size)}
                      </Text>
                    ) : null}
                  </View>

                  <Pressable
                    onPress={() => removeSelectedFile(index)}
                    style={styles.removeSelectedFileButton}
                  >
                    <Text style={styles.removeSelectedFileText}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : null}

          {/* Existing uploaded attachments */}
          {attachments.length === 0 ? (
            <Text style={styles.emptyText}>No attachments yet.</Text>
          ) : (
            <View style={styles.attachmentsGrid}>
              {attachments.map(file => (
                <View key={String(file.id)} style={styles.attachmentCard}>
                  <View style={styles.attachmentContent}>
                    <Text style={styles.attachmentName} numberOfLines={1}>
                      {file.original_name || 'Attachment'}
                    </Text>

                    <Text style={styles.attachmentSize}>
                      {formatFileSize(file.size)}
                    </Text>
                  </View>

                  <Pressable
                    disabled={deletingFileId === file.id}
                    onPress={() => confirmDeleteAttachment(file)}
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.attachmentDeleteButton,

                      deletingFileId === file.id && styles.buttonDisabled,

                      pressed &&
                        deletingFileId !== file.id &&
                        styles.controlPressed,
                    ]}
                  >
                    {deletingFileId === file.id ? (
                      <ActivityIndicator size="small" color="#EF4444" />
                    ) : (
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={19}
                        color="#EF4444"
                      />
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Messages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Messages</Text>

          <Text style={styles.sectionSubtitle}>
            Updates from teachers and administrators
          </Text>

          {messages.length === 0 ? (
            <Text style={styles.emptyText}>No messages yet.</Text>
          ) : (
            <View style={styles.messagesList}>
              {messages.map(item => (
                <View key={String(item.id)} style={styles.messageCard}>
                  <Text style={styles.messageBody}>{item.body}</Text>

                  <Text style={styles.messageMeta}>
                    {item?.user?.name || 'User'}
                    {' · '}
                    {item.created_at || ''}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.messageRow}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Write a message..."
              placeholderTextColor="#74879E"
              multiline
              style={styles.messageInput}
            />

            <Pressable
              disabled={!message.trim() || sendingMessage}
              onPress={handleSendMessage}
              style={({ pressed }) => [
                styles.sendButton,

                (!message.trim() || sendingMessage) && styles.buttonDisabled,

                pressed &&
                  message.trim() &&
                  !sendingMessage &&
                  styles.controlPressed,
              ]}
            >
              {sendingMessage ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.sendButtonText}>Send</Text>
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomActions}>
          <Pressable
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

          <Pressable
            disabled={savingChanges}
            onPress={handleSaveChanges}
            style={({ pressed }) => [
              styles.saveButton,

              savingChanges && styles.buttonDisabled,

              pressed && !savingChanges && styles.controlPressed,
            ]}
          >
            {savingChanges ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save changes</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
