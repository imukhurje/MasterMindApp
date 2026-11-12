// src/screens/Admin/Forum/AdminPrivateMessages.js

import React, { useCallback, useMemo, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';

import { api, getToken } from '../../../api/client';
import styles from './AdminPrivateMessages.styles';

function normalizePrivateMessage(item) {
  return {
    id: Number(item?.id),

    forumId: item?.forum_id != null ? Number(item.forum_id) : null,

    body: String(item?.body || ''),

    createdAt: String(item?.created_at || ''),

    isPrivate: Boolean(item?.private),

    direction: String(item?.private_direction || '').toLowerCase(),

    user: {
      id: item?.user?.id != null ? Number(item.user.id) : null,

      name: String(item?.user?.name || 'Unknown user'),

      email: String(item?.user?.email || ''),
    },

    recipients: Array.isArray(item?.private_recipients)
      ? item.private_recipients.map(recipient => ({
          id: Number(recipient?.id),

          name: String(recipient?.name || 'Unknown user'),

          email: String(recipient?.email || ''),
        }))
      : [],

    replyTo: item?.reply_to || null,

    attachment: item?.attachment || null,
  };
}

function normalizeRecipient(item) {
  return {
    id: Number(item?.id),

    name: String(item?.name || 'Unknown user'),

    email: String(item?.email || ''),

    role: String(item?.role || ''),
  };
}

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  const text = String(value).trim();

  const normalized = text.includes('T') ? text : text.replace(' ', 'T');

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatMessageTime(value) {
  const date = normalizeDate(value);

  if (!date) {
    return String(value || '');
  }

  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatRole(role) {
  return String(role || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function isImageAttachment(attachment) {
  const type = String(attachment?.type || '').toLowerCase();

  const mime = String(attachment?.mime || '').toLowerCase();

  return type === 'image' || mime.startsWith('image/');
}

function formatFileSize(size) {
  const bytes = Number(size || 0);

  if (!bytes) {
    return '';
  }

  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
}

export default function AdminPrivateMessages({ navigation }) {
  const insets = useSafeAreaInsets();

  const messageListRef = useRef(null);

  const messageInputRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [messages, setMessages] = useState([]);

  const [recipients, setRecipients] = useState([]);

  const [maxRecipients, setMaxRecipients] = useState(5);

  const [channelUserId, setChannelUserId] = useState(null);

  const [authToken, setAuthToken] = useState(null);

  const [recipientSearch, setRecipientSearch] = useState('');

  const [recipientSearchFocused, setRecipientSearchFocused] = useState(false);

  const [selectedRecipientIds, setSelectedRecipientIds] = useState(new Set());

  const [messageText, setMessageText] = useState('');

  const [selectedMedia, setSelectedMedia] = useState(null);

  const [sending, setSending] = useState(false);

  const loadPrivateMessages = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const token = await getToken();

        setAuthToken(token || null);

        const [messageResponse, recipientResponse] = await Promise.all([
          api('/api/forums/private-messages'),

          api('/api/forums/private-messages/recipients'),
        ]);

        const messageRows = Array.isArray(messageResponse)
          ? messageResponse
          : Array.isArray(messageResponse?.items)
          ? messageResponse.items
          : [];

        const normalizedMessages = messageRows
          .map(normalizePrivateMessage)
          .filter(item => Number.isFinite(item.id))
          .sort((a, b) => {
            const aDate = normalizeDate(a.createdAt);

            const bDate = normalizeDate(b.createdAt);

            return (aDate?.getTime() || 0) - (bDate?.getTime() || 0);
          });

        const recipientRows = Array.isArray(recipientResponse?.items)
          ? recipientResponse.items
          : [];

        setMessages(normalizedMessages);

        setRecipients(
          recipientRows
            .map(normalizeRecipient)
            .filter(item => Number.isFinite(item.id)),
        );

        setMaxRecipients(Number(recipientResponse?.max_recipients) || 5);

        const currentUserId = Number(recipientResponse?.channel_user_id);

        setChannelUserId(Number.isFinite(currentUserId) ? currentUserId : null);

        navigation.setOptions({
          title: 'My Messages',
        });

        setTimeout(() => {
          messageListRef.current?.scrollToEnd?.({
            animated: false,
          });
        }, 100);
      } catch (error) {
        console.log('Private messages load error:', error);

        Alert.alert(
          'My Messages',
          error?.message || 'Could not load private messages.',
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
      loadPrivateMessages();

      return undefined;
    }, [loadPrivateMessages]),
  );

  const filteredRecipients = useMemo(() => {
    const query = recipientSearch.trim().toLowerCase();

    if (!query) {
      return recipients;
    }

    return recipients.filter(recipient => {
      const searchable = [recipient.name, recipient.email, recipient.role]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [recipients, recipientSearch]);

  const selectedRecipients = useMemo(() => {
    return recipients.filter(recipient =>
      selectedRecipientIds.has(recipient.id),
    );
  }, [recipients, selectedRecipientIds]);

  function toggleRecipient(recipient) {
    const recipientId = Number(recipient?.id);

    if (!Number.isFinite(recipientId)) {
      return;
    }

    setSelectedRecipientIds(current => {
      const next = new Set(current);

      if (next.has(recipientId)) {
        next.delete(recipientId);

        return next;
      }

      if (next.size >= maxRecipients) {
        Alert.alert(
          'Recipients',
          `You can select up to ${maxRecipients} recipients.`,
        );

        return current;
      }

      next.add(recipientId);

      return next;
    });
  }

  function removeRecipient(recipientId) {
    setSelectedRecipientIds(current => {
      const next = new Set(current);

      next.delete(Number(recipientId));

      return next;
    });
  }

  async function chooseMedia() {
    try {
      const result = await pick({
        allowMultiSelection: false,

        type: [types.images, types.video],

        mode: 'import',
      });

      const file = Array.isArray(result) ? result[0] : result;

      if (!file?.uri) {
        return;
      }

      setSelectedMedia({
        uri: file.uri,

        name: file.name || `attachment_${Date.now()}`,

        type: file.type || 'application/octet-stream',

        size: Number(file.size || 0),
      });
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      console.log('Private message picker error:', error);

      Alert.alert('Attachment', error?.message || 'Could not select the file.');
    }
  }

  async function sendPrivateMessage() {
    if (sending) {
      return;
    }

    const body = messageText.trim();

    if (selectedRecipientIds.size === 0) {
      Alert.alert('Recipients', 'Please select at least one recipient.');

      return;
    }

    if (!body && !selectedMedia) {
      Alert.alert('Message', 'Please enter a message or select an attachment.');

      return;
    }

    try {
      setSending(true);

      const formData = new FormData();

      /*
       * Message body.
       */
      formData.append('body', body);

      /*
       * Recipients.
       * Backend expects recipient_ids[].
       */
      Array.from(selectedRecipientIds).forEach(recipientId => {
        formData.append('recipient_ids[]', String(recipientId));
      });

      /*
       * Optional image/video attachment.
       */
      if (selectedMedia?.uri) {
        formData.append('attachment', {
          uri: selectedMedia.uri,

          name: selectedMedia.name || `attachment_${Date.now()}`,

          type: selectedMedia.type || 'application/octet-stream',
        });
      }

      const response = await api('/api/forums/private-messages', {
        method: 'POST',
        body: formData,
      });

      const historyMessage = response?.history_message;

      /*
       * history_message contains direction,
       * recipients and attachment information,
       * so use this version in the chat.
       */
      if (historyMessage) {
        const normalized = normalizePrivateMessage(historyMessage);

        setMessages(current => {
          const alreadyExists = current.some(
            item => Number(item.id) === Number(normalized.id),
          );

          if (alreadyExists) {
            return current;
          }

          return [...current, normalized];
        });
      } else {
        /*
         * Fallback if history_message
         * is not returned.
         */
        await loadPrivateMessages({
          refresh: true,
        });
      }

      /*
       * Clear composer after successful send.
       */
      setMessageText('');
      setSelectedMedia(null);

      setSelectedRecipientIds(new Set());

      setRecipientSearch('');
      setRecipientSearchFocused(false);

      setTimeout(() => {
        messageListRef.current?.scrollToEnd?.({
          animated: true,
        });
      }, 150);
    } catch (error) {
      console.log('Private message send error:', error);

      Alert.alert(
        'Send failed',
        error?.message || 'Could not send the private message.',
      );
    } finally {
      setSending(false);
    }
  }

  function replyPrivately(item) {
    const senderId = Number(item?.user?.id);

    if (!Number.isFinite(senderId)) {
      return;
    }

    /*
     * Reply only to the sender of this private message.
     */
    setSelectedRecipientIds(new Set([senderId]));

    setRecipientSearch('');
    setRecipientSearchFocused(false);

    setTimeout(() => {
      messageInputRef.current?.focus?.();
    }, 100);
  }

  function renderMessage({ item }) {
    const isMine =
      item.direction === 'sent' ||
      (Number.isFinite(Number(channelUserId)) &&
        Number(item?.user?.id) === Number(channelUserId));

    const recipientNames = item.recipients
      .map(recipient => recipient.name)
      .filter(Boolean)
      .join(', ');

    return (
      <View style={[styles.messageRow, isMine && styles.messageRowMine]}>
        <View
          style={[styles.messageBubble, isMine && styles.messageBubbleMine]}
        >
          {/* Header */}
          <View style={styles.messageHeader}>
            <Text style={styles.messageSender} numberOfLines={1}>
              {isMine ? 'You' : item?.user?.name || 'Unknown user'}
            </Text>

            <Text style={styles.messageDate} numberOfLines={1}>
              {isMine && recipientNames ? `To: ${recipientNames} • ` : ''}

              {item?.forum?.name ? `${item.forum.name} • ` : ''}

              {formatMessageTime(item.createdAt)}
            </Text>
          </View>

          {/* Reply / quoted message */}
          {!!item?.replyTo && (
            <View style={styles.replyPreview}>
              <Text style={styles.replyPreviewSender} numberOfLines={1}>
                {item?.replyTo?.user?.name || 'Unknown user'}
              </Text>

              <Text style={styles.replyPreviewBody} numberOfLines={3}>
                {item?.replyTo?.body || ''}
              </Text>
            </View>
          )}

          {/* Main message */}
          {!!item.body && <Text style={styles.messageBody}>{item.body}</Text>}

          {/* Attachment */}
          {!!item?.attachment && (
            <View style={styles.messageAttachment}>
              {isImageAttachment(item.attachment) && item?.attachment?.url ? (
                <Image
                  source={{
                    uri: item.attachment.url,

                    ...(authToken
                      ? {
                          headers: {
                            Authorization: `Bearer ${authToken}`,
                          },
                        }
                      : {}),
                  }}
                  resizeMode="cover"
                  style={styles.messageAttachmentImage}
                />
              ) : (
                <View style={styles.fileAttachmentPreview}>
                  <MaterialCommunityIcons
                    name={
                      String(item?.attachment?.type || '').toLowerCase() ===
                      'video'
                        ? 'play-circle-outline'
                        : 'file-outline'
                    }
                    size={30}
                    color="#7DD3FC"
                  />
                </View>
              )}

              <View style={styles.attachmentInfo}>
                <Text style={styles.messageAttachmentName} numberOfLines={1}>
                  {item?.attachment?.name || 'Attachment'}
                </Text>

                {!!item?.attachment?.size && (
                  <Text style={styles.messageAttachmentSize}>
                    {formatFileSize(item.attachment.size)}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Reply privately */}
          {!isMine && item?.user?.id ? (
            <View style={styles.replyActionRow}>
              <Pressable
                onPress={() => replyPrivately(item)}
                style={({ pressed }) => [
                  styles.replyPrivateButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="reply"
                  size={15}
                  color="#FFFFFF"
                />

                <Text style={styles.replyPrivateButtonText}>
                  Reply privately
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  function renderRecipient({ item }) {
    const selected = selectedRecipientIds.has(item.id);

    return (
      <Pressable
        onPress={() => toggleRecipient(item)}
        style={({ pressed }) => [
          styles.recipientRow,

          selected && styles.recipientRowSelected,

          pressed && styles.controlPressed,
        ]}
      >
        <View style={styles.recipientSelection}>
          <View
            style={[styles.radioOuter, selected && styles.radioOuterSelected]}
          >
            {selected ? <View style={styles.radioInner} /> : null}
          </View>
        </View>

        <View style={styles.recipientInfo}>
          <Text numberOfLines={1} style={styles.recipientName}>
            {item.name}
          </Text>

          <Text numberOfLines={1} style={styles.recipientEmail}>
            {item.email || 'No email address'}
          </Text>
        </View>

        <Text style={styles.recipientRole} numberOfLines={1}>
          {formatRole(item.role)}
        </Text>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading private messages...</Text>
      </View>
    );
  }

  const canSend =
    selectedRecipientIds.size > 0 &&
    (messageText.trim().length > 0 || selectedMedia !== null) &&
    !sending;

  const showRecipientList =
    recipientSearchFocused || recipientSearch.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      {/* Chat header */}
      <View style={styles.chatHeader}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backButton,

            pressed && styles.controlPressed,
          ]}
        >
          <MaterialCommunityIcons name="arrow-left" size={21} color="#FFFFFF" />
        </Pressable>

        <View style={styles.privateAvatar}>
          <Text style={styles.privateAvatarText}>ME</Text>
        </View>

        <View style={styles.headerTextSection}>
          <Text style={styles.headerTitle}>My Messages</Text>

          <Text style={styles.headerSubtitle}>
            Private messages sent only to you
          </Text>
        </View>
      </View>

      {/* Message history */}
      <FlatList
        ref={messageListRef}
        data={messages}
        keyExtractor={item => String(item.id)}
        renderItem={renderMessage}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
        contentContainerStyle={
          messages.length === 0
            ? styles.emptyMessageContent
            : styles.messageContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadPrivateMessages({
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No private messages yet</Text>

            <Text style={styles.emptyText}>
              Select a recipient and start a private conversation.
            </Text>
          </View>
        }
      />

      {/* Composer */}
      <View
        style={[
          styles.composer,
          {
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ]}
      >
        <View style={styles.recipientPanel}>
          <View style={styles.recipientHeader}>
            <Text style={styles.recipientTitle}>To</Text>

            <Text style={styles.recipientCount}>
              {selectedRecipientIds.size} / {maxRecipients} selected
            </Text>
          </View>

          {selectedRecipients.length > 0 ? (
            <View style={styles.selectedRecipients}>
              {selectedRecipients.map(recipient => (
                <Pressable
                  key={String(recipient.id)}
                  onPress={() => removeRecipient(recipient.id)}
                  style={styles.selectedRecipientChip}
                >
                  <Text style={styles.selectedRecipientText} numberOfLines={1}>
                    {recipient.name}
                  </Text>

                  <Text style={styles.selectedRecipientClose}>×</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <View style={styles.searchBox}>
            <MaterialCommunityIcons name="magnify" size={18} color="#8DA4BE" />

            <TextInput
              value={recipientSearch}
              onChangeText={setRecipientSearch}
              onFocus={() => setRecipientSearchFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setRecipientSearchFocused(false);
                }, 150);
              }}
              placeholder="Search users by name or email..."
              placeholderTextColor="#7D8EA7"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.searchInput}
            />
          </View>

          {showRecipientList ? (
            <View style={styles.recipientListContainer}>
              <FlatList
                data={filteredRecipients}
                keyExtractor={item => String(item.id)}
                renderItem={renderRecipient}
                keyboardShouldPersistTaps="always"
                nestedScrollEnabled
                showsVerticalScrollIndicator
                style={styles.recipientList}
                ListEmptyComponent={
                  <View style={styles.emptyRecipient}>
                    <Text style={styles.emptyRecipientText}>
                      No matching users found.
                    </Text>
                  </View>
                }
              />
            </View>
          ) : null}

          <Text style={styles.recipientHelp}>
            Select between 1 and {maxRecipients} recipients.
          </Text>
        </View>

        {selectedMedia ? (
          <View style={styles.selectedMediaCard}>
            <MaterialCommunityIcons
              name={
                String(selectedMedia.type).startsWith('video/')
                  ? 'video-outline'
                  : 'image-outline'
              }
              size={22}
              color="#7DD3FC"
            />

            <View style={styles.selectedMediaInfo}>
              <Text numberOfLines={1} style={styles.selectedMediaName}>
                {selectedMedia.name}
              </Text>
            </View>

            <Pressable
              onPress={() => setSelectedMedia(null)}
              style={styles.removeMediaButton}
            >
              <MaterialCommunityIcons name="close" size={18} color="#FFFFFF" />
            </Pressable>
          </View>
        ) : null}

        <Pressable
          onPress={chooseMedia}
          style={({ pressed }) => [
            styles.addButton,

            pressed && styles.controlPressed,
          ]}
        >
          <MaterialCommunityIcons name="plus" size={22} color="#FFFFFF" />
        </Pressable>

        <View style={styles.inputRow}>
          <TextInput
            ref={messageInputRef}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={2000}
            placeholder="Type a private message..."
            placeholderTextColor="#73849E"
            style={styles.messageInput}
          />

          <Pressable
            onPress={sendPrivateMessage}
            disabled={!canSend}
            style={({ pressed }) => [
              styles.sendButton,

              !canSend && styles.controlDisabled,

              pressed && canSend && styles.controlPressed,
            ]}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.sendButtonText}>Send privately</Text>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
