import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api, getBase, getToken } from '../../../api/client';
import styles from './AdminForumChat.styles';
import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function normalizeMessage(item) {
  return {
    id: Number(item?.id),

    forumId: Number(item?.forum_id),

    body: String(item?.body || ''),

    createdAt: String(item?.created_at || ''),

    isPrivate: Boolean(item?.private),

    user: {
      id: Number(item?.user?.id),

      name: String(item?.user?.name || 'Unknown user'),

      email: String(item?.user?.email || ''),
    },

    forum: item?.forum || null,

    replyTo: item?.reply_to || null,

    attachment: item?.attachment || null,
  };
}

function formatMessageTime(value) {
  if (!value) {
    return '';
  }

  /*
   * Backend returns:
   * 2026-05-17 15:36:19
   *
   * Replace space with T so JavaScript
   * can parse it more reliably.
   */
  const normalized = String(value).includes('T')
    ? String(value)
    : String(value).replace(' ', 'T');

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return String(value);
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

function formatFileSize(bytes) {
  const size = Number(bytes || 0);

  if (!size) {
    return '';
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getForumAvatarText(title) {
  const value = String(title || '')
    .replace(/[·\-]+/g, ' ')
    .trim();

  if (!value) {
    return '?';
  }

  const words = value.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0]?.[0] || ''}${
    words[words.length - 1]?.[0] || ''
  }`.toUpperCase();
}

export default function AdminForumChat({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const listRef = useRef(null);

  const forumId = Number(route?.params?.forumId);

  const forumTitle = route?.params?.forumTitle || 'Forum';

  const forumSubtitle = route?.params?.forumSubtitle || 'Community';

  const forumType = route?.params?.forumType || '';

  const routeCurrentUserId = Number(route?.params?.currentUserId);

  const [currentUserId, setCurrentUserId] = useState(
    Number.isFinite(routeCurrentUserId) ? routeCurrentUserId : null,
  );

  const [authToken, setAuthToken] = useState(null);

  const [messages, setMessages] = useState([]);

  const [messageText, setMessageText] = useState('');

  const [replyingTo, setReplyingTo] = useState(null);

  const [selectedMedia, setSelectedMedia] = useState(null);

  const [sendReplyPrivately, setSendReplyPrivately] = useState(false);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [sending, setSending] = useState(false);

  const loadMessages = useCallback(
    async ({ refresh = false } = {}) => {
      if (!Number.isFinite(forumId)) {
        Alert.alert('Forum', 'Forum ID is missing.', [
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

        const response = await api(`/api/forums/${forumId}/messages`);

        const rows = Array.isArray(response)
          ? response
          : Array.isArray(response?.messages)
          ? response.messages
          : [];

        const normalizedRows = rows
          .map(normalizeMessage)
          .filter(item => Number.isFinite(item.id));

        setMessages(normalizedRows);

        navigation.setOptions({
          title: forumTitle,
        });
      } catch (error) {
        console.log('Forum messages load error:', error);

        Alert.alert('Forum', error?.message || 'Could not load messages.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [forumId, forumTitle, navigation],
  );

  useEffect(() => {
    let active = true;

    async function loadViewerInfo() {
      try {
        const [token, me] = await Promise.all([getToken(), api('/api/me')]);

        if (!active) {
          return;
        }

        setAuthToken(token || null);

        const meId = Number(me?.id);

        if (Number.isFinite(meId)) {
          setCurrentUserId(meId);
        }
      } catch (error) {
        console.log('Forum viewer info error:', error);
      }
    }

    loadViewerInfo();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      listRef.current?.scrollToEnd?.({
        animated: false,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages.length]);

  const messageCount = messages.length;

  const canSend =
    (messageText.trim().length > 0 || selectedMedia !== null) && !sending;

  function startReply(message) {
    setReplyingTo(message);

    setSendReplyPrivately(false);
  }

  function cancelReply() {
    setReplyingTo(null);

    setSendReplyPrivately(false);
  }

  async function chooseMedia() {
    try {
      if (sending) {
        return;
      }

      const result = await pick({
        allowMultiSelection: false,

        type: [types.images, types.video],

        mode: 'import',
      });

      const file = Array.isArray(result) ? result[0] : result;

      if (!file?.uri) {
        return;
      }

      console.log('Picked forum media:', file);

      const mimeType = String(
        file?.type || file?.nativeType || '',
      ).toLowerCase();

      const fileName = String(file?.name || '').toLowerCase();

      const isImage =
        mimeType.startsWith('image/') ||
        /\.(jpg|jpeg|png|gif|webp|heic|heif)$/i.test(fileName);

      const isVideo =
        mimeType.startsWith('video/') ||
        /\.(mp4|mov|m4v|avi|webm|mkv)$/i.test(fileName);

      if (!isImage && !isVideo) {
        Alert.alert('Attachment', 'Only image and video files are allowed.');

        return;
      }

      setSelectedMedia({
        uri: file.uri,

        name: file.name || `attachment_${Date.now()}`,

        type: file.type || (isImage ? 'image/jpeg' : 'video/mp4'),

        size: Number(file.size || 0),
      });
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      console.log('Forum media picker error:', error);

      Alert.alert('Attachment', error?.message || 'Could not select the file.');
    }
  }

  async function sendMessage() {
    if (sending) {
      return;
    }

    const trimmedBody = messageText.trim();

    if (!trimmedBody && !selectedMedia) {
      return;
    }

    /*
     * Reply API fields are not included
     * here until the backend payload for
     * replies is confirmed.
     */
    if (replyingTo) {
      Alert.alert(
        'Reply',
        'The reply send payload still needs to be connected.',
      );
      return;
    }

    try {
      setSending(true);

      const formData = new FormData();

      formData.append('body', trimmedBody);

      if (selectedMedia?.uri) {
        formData.append('attachment', {
          uri: selectedMedia.uri,

          name: selectedMedia.name || `attachment_${Date.now()}`,

          type: selectedMedia.type || 'application/octet-stream',
        });
      }

      const token = await getToken();

      const baseUrl = String(getBase() || '').replace(/\/+$/, '');

      const url = `${baseUrl}/api/forums/${forumId}/messages`;

      const headers = {
        Accept: 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      /*
       * Do not set Content-Type manually.
       * React Native creates the multipart
       * boundary automatically.
       */
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const responseText = await response.text();

      let responseData = null;

      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch {
        responseData = {
          message: responseText,
        };
      }

      console.log('Forum send response:', responseData);

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            `Could not send message. HTTP ${response.status}`,
        );
      }

      const newMessage = normalizeMessage(responseData);

      if (!Number.isFinite(newMessage.id)) {
        throw new Error('Message was sent but no message ID was returned.');
      }

      setMessages(current => {
        const alreadyExists = current.some(item => item.id === newMessage.id);

        if (alreadyExists) {
          return current;
        }

        return [...current, newMessage];
      });

      setMessageText('');

      setSelectedMedia(null);

      setReplyingTo(null);

      setSendReplyPrivately(false);

      setTimeout(() => {
        listRef.current?.scrollToEnd?.({
          animated: true,
        });
      }, 100);
    } catch (error) {
      console.log('Forum send message error:', error);

      Alert.alert(
        'Send failed',
        error?.message || 'Could not send the message.',
      );
    } finally {
      setSending(false);
    }
  }

  function openAttachment(attachment) {
    if (!attachment) {
      return;
    }

    Alert.alert(
      'Attachment',
      'Attachment download/view API will be connected when its response format is available.',
    );
  }

  const headerSubtitle = useMemo(() => {
    if (forumSubtitle) {
      return forumSubtitle;
    }

    if (forumType === 'teacher') {
      return 'Teacher community';
    }

    return 'Class community';
  }, [forumSubtitle, forumType]);

  function renderMessage({ item }) {
    const isMine =
      Number.isFinite(Number(currentUserId)) &&
      Number(item?.user?.id) === Number(currentUserId);

    const attachmentType = String(item?.attachment?.type || '').toLowerCase();

    const attachmentMime = String(item?.attachment?.mime || '').toLowerCase();

    const isImageAttachment =
      attachmentType === 'image' || attachmentMime.startsWith('image/');

    const isVideoAttachment =
      attachmentType === 'video' || attachmentMime.startsWith('video/');

    return (
      <View style={[styles.messageRow, isMine && styles.messageRowMine]}>
        <View
          style={[styles.messageBubble, isMine && styles.messageBubbleMine]}
        >
          {item.replyTo ? (
            <View style={styles.replyPreview}>
              <Text numberOfLines={1} style={styles.replyPreviewTitle}>
                Reply
              </Text>

              <Text numberOfLines={2} style={styles.replyPreviewText}>
                {item.replyTo?.body || 'Previous message'}
              </Text>
            </View>
          ) : null}

          {item.body ? (
            <Text style={styles.messageBody}>{item.body}</Text>
          ) : null}

          {item.attachment ? (
            <View style={styles.messageAttachment}>
              {isImageAttachment ? (
                <Image
                  source={{
                    uri: item.attachment.url,

                    headers: authToken
                      ? {
                          Authorization: `Bearer ${authToken}`,
                        }
                      : {},
                  }}
                  resizeMode="cover"
                  style={styles.messageAttachmentImage}
                  onError={event => {
                    console.log('Forum image load error:', event?.nativeEvent);
                  }}
                />
              ) : isVideoAttachment ? (
                <View style={styles.videoAttachmentPreview}>
                  <Text style={styles.videoAttachmentText}>▶ VIDEO</Text>
                </View>
              ) : (
                <View style={styles.videoAttachmentPreview}>
                  <Text style={styles.videoAttachmentText}>ATTACHMENT</Text>
                </View>
              )}

              <Text numberOfLines={1} style={styles.attachmentName}>
                {item.attachment.name}

                {item.attachment.size
                  ? ` • ${formatFileSize(item.attachment.size)}`
                  : ''}
              </Text>
            </View>
          ) : null}

          <View style={styles.messageMetaRow}>
            <Text numberOfLines={1} style={styles.messageMeta}>
              {item.user.name}
              {' • '}
              {formatMessageTime(item.createdAt)}
            </Text>
          </View>

          <Pressable
            onPress={() => startReply(item)}
            style={({ pressed }) => [
              styles.replyButton,

              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.replyButtonText}>↪ Reply</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={styles.chatHeader}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.controlPressed,
          ]}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="#FFFFFF" />
        </Pressable>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getForumAvatarText(forumTitle)}
          </Text>
        </View>

        <View style={styles.headerTextSection}>
          <Text numberOfLines={1} style={styles.forumTitle}>
            {forumTitle}
          </Text>

          <Text numberOfLines={1} style={styles.forumSubtitle}>
            {headerSubtitle}
          </Text>
        </View>

        <View style={styles.messageCountBadge}>
          <Text style={styles.messageCountText}>{messageCount}</Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => String(item.id)}
        renderItem={renderMessage}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadMessages({
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
        contentContainerStyle={
          messages.length === 0
            ? styles.emptyMessagesContent
            : styles.messagesContent
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No messages yet</Text>

            <Text style={styles.emptyStateText}>Start the conversation.</Text>
          </View>
        }
      />

      <View
        style={[
          styles.composerSection,

          {
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ]}
      >
        {replyingTo ? (
          <View style={styles.replyingToCard}>
            <View style={styles.replyingToTopRow}>
              <View style={styles.replyingToTextSection}>
                <Text style={styles.replyingToTitle}>
                  Replying to {replyingTo?.user?.name || 'message'}
                </Text>

                <Text numberOfLines={2} style={styles.replyingToText}>
                  {replyingTo?.body || 'Attachment'}
                </Text>
              </View>

              <Pressable
                onPress={cancelReply}
                style={({ pressed }) => [
                  styles.replyCloseButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.replyCloseButtonText}>×</Text>
              </Pressable>
            </View>

            <View style={styles.replyPrivacyRow}>
              <Pressable
                onPress={() => setSendReplyPrivately(false)}
                style={styles.replyPrivacyOption}
              >
                <View
                  style={[
                    styles.radioOuter,

                    !sendReplyPrivately && styles.radioOuterSelected,
                  ]}
                >
                  {!sendReplyPrivately ? (
                    <View style={styles.radioInner} />
                  ) : null}
                </View>

                <Text style={styles.replyPrivacyText}>Send</Text>
              </Pressable>

              <Pressable
                onPress={() => setSendReplyPrivately(true)}
                style={styles.replyPrivacyOption}
              >
                <View
                  style={[
                    styles.radioOuter,

                    sendReplyPrivately && styles.radioOuterSelected,
                  ]}
                >
                  {sendReplyPrivately ? (
                    <View style={styles.radioInner} />
                  ) : null}
                </View>

                <Text style={styles.replyPrivacyText}>Send privately</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {selectedMedia ? (
          <View style={styles.selectedMediaCard}>
            <View style={styles.selectedMediaIcon}>
              <Text style={styles.selectedMediaIconText}>
                {String(selectedMedia.type).startsWith('video/')
                  ? 'VIDEO'
                  : 'IMAGE'}
              </Text>
            </View>

            <View style={styles.selectedMediaInfo}>
              <Text numberOfLines={1} style={styles.selectedMediaName}>
                {selectedMedia.name}
              </Text>

              <Text style={styles.selectedMediaType}>
                {String(selectedMedia.type).startsWith('video/')
                  ? 'Video attachment'
                  : 'Image attachment'}
              </Text>
            </View>

            <Pressable
              onPress={() => setSelectedMedia(null)}
              disabled={sending}
              style={({ pressed }) => [
                styles.removeMediaButton,

                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.removeMediaButtonText}>×</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.composerTopRow}>
          <Pressable
            onPress={chooseMedia}
            disabled={sending}
            style={({ pressed }) => [
              styles.addButton,

              sending && styles.controlDisabled,

              pressed && !sending && styles.controlPressed,
            ]}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder={replyingTo ? 'Type a reply...' : 'Type a message...'}
            placeholderTextColor="#73849E"
            multiline
            maxLength={2000}
            style={styles.messageInput}
          />

          <Pressable
            onPress={sendMessage}
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
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
