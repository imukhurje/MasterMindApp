import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SectionList,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';
import styles from './AdminForums.styles';

const CATEGORY_ORDER = ['Classes', 'Class & subject', 'Teachers'];

function normalizeForum(item) {
  return {
    id: Number(item?.id),

    type: String(item?.type || '').toLowerCase(),

    category: String(item?.category || ''),

    name: String(item?.name || ''),

    title: String(item?.title || item?.name || 'Untitled forum'),

    subtitle: String(item?.subtitle || ''),

    classGroupId:
      item?.class_group_id != null ? Number(item.class_group_id) : null,

    teacherId: item?.teacher_id != null ? Number(item.teacher_id) : null,

    courseId: item?.course_id != null ? Number(item.course_id) : null,

    lastMessage: item?.last_message || null,
  };
}

function getAvatarText(item) {
  const title = String(item?.title || item?.name || '')
    .replace(/[·\-]+/g, ' ')
    .trim();

  if (!title) {
    return '?';
  }

  const words = title.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] || ''}${
    words[words.length - 1][0] || ''
  }`.toUpperCase();
}

function getPreviewText(item) {
  const message = item?.lastMessage;

  if (message?.body && message?.sender) {
    return `${message.sender}: ${message.body}`;
  }

  if (message?.body) {
    return String(message.body);
  }

  return item?.subtitle || 'Community';
}

function normalizePrivateMessageDate(value) {
  if (!value) {
    return value;
  }

  const text = String(value).trim();

  // Convert "2026-09-08 18:13:17"
  // into an ISO-compatible local datetime.
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(text)) {
    return text.replace(' ', 'T');
  }

  return text;
}

function formatLastMessageDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();

  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getCategoryTitle(category) {
  if (String(category).toLowerCase() === 'class & subject') {
    return 'CLASS & SUBJECT';
  }

  return String(category || '').toUpperCase();
}

export default function AdminForums({ navigation }) {
  const insets = useSafeAreaInsets();

  const [me, setMe] = useState(null);

  const [forums, setForums] = useState([]);

  const [privateMessages, setPrivateMessages] = useState([]);

  const [privateRecipients, setPrivateRecipients] = useState([]);

  const [privateMeta, setPrivateMeta] = useState({
    maxRecipients: 0,
    channelUserId: null,
  });

  const [searchText, setSearchText] = useState('');

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const roleCandidates = [
    me?.primary_role,
    me?.role,
    me?.actual_primary_role,
    me?.actual_role,
    ...(Array.isArray(me?.roles) ? me.roles : []),
  ]
    .filter(Boolean)
    .map(role => String(role).trim().toLowerCase());

  const isAdmin = me?.is_admin === true || roleCandidates.includes('admin');

  const isSuperAdmin =
    me?.is_super_admin === true || roleCandidates.includes('super_admin');

  const showBlockUnblock = isAdmin || isSuperAdmin;

  const loadForums = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [
          meResponse,
          forumsResponse,
          privateMessagesResponse,
          recipientsResponse,
        ] = await Promise.all([
          api('/api/me'),

          api('/api/forums'),

          api('/api/forums/private-messages'),

          api('/api/forums/private-messages/recipients'),
        ]);

        setMe(meResponse || null);

        const forumRows = Array.isArray(forumsResponse)
          ? forumsResponse
          : Array.isArray(forumsResponse?.items)
          ? forumsResponse.items
          : [];

        setForums(
          forumRows
            .map(normalizeForum)
            .filter(item => Number.isFinite(item.id)),
        );

        const privateRows = Array.isArray(privateMessagesResponse)
          ? privateMessagesResponse
          : Array.isArray(privateMessagesResponse?.items)
          ? privateMessagesResponse.items
          : [];

        setPrivateMessages(privateRows);

        setPrivateRecipients(
          Array.isArray(recipientsResponse?.items)
            ? recipientsResponse.items
            : [],
        );

        setPrivateMeta({
          maxRecipients: Number(recipientsResponse?.max_recipients) || 0,

          channelUserId:
            recipientsResponse?.channel_user_id != null
              ? Number(recipientsResponse.channel_user_id)
              : null,
        });

        navigation.setOptions({
          title: 'Forums',
        });
      } catch (error) {
        console.log('Admin forums load error:', error);

        Alert.alert('Forums', error?.message || 'Could not load forums.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigation],
  );

  useFocusEffect(
    useCallback(() => {
      loadForums();
    }, [loadForums]),
  );

  const sections = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    const filtered = query
      ? forums.filter(item => {
          const searchable = [
            item.title,
            item.name,
            item.subtitle,
            item.category,
            item?.lastMessage?.body,
            item?.lastMessage?.sender,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return searchable.includes(query);
        })
      : forums;

    return CATEGORY_ORDER.map(category => ({
      title: getCategoryTitle(category),

      data: filtered.filter(
        item =>
          String(item.category).toLowerCase() ===
          String(category).toLowerCase(),
      ),
    })).filter(section => section.data.length > 0);
  }, [forums, searchText]);

  function openBlockUnblock() {
    navigation.navigate('AdminForumAccess');
  }

  function openForum(forum) {
    const forumId = Number(forum?.id);

    if (!Number.isFinite(forumId)) {
      Alert.alert('Forum', 'Forum ID is missing.');
      return;
    }

    navigation.navigate('AdminForumChat', {
      forumId,

      forumTitle: forum?.title || forum?.name,

      forumSubtitle: forum?.subtitle,

      forumType: forum?.type,

      classGroupId: forum?.classGroupId,

      teacherId: forum?.teacherId,

      courseId: forum?.courseId,

      currentUserId: Number(me?.id),
    });
  }

  function openPrivateMessages() {
    navigation.navigate('AdminPrivateMessages');
  }

  function renderForum({ item }) {
    const avatarStyle =
      item.type === 'teacher'
        ? styles.teacherAvatar
        : item.type === 'class_subject'
        ? styles.subjectAvatar
        : styles.classAvatar;

    return (
      <Pressable
        onPress={() => openForum(item)}
        style={({ pressed }) => [styles.forumRow, pressed && styles.rowPressed]}
      >
        <View style={[styles.avatar, avatarStyle]}>
          <Text style={styles.avatarText}>{getAvatarText(item)}</Text>
        </View>

        <View style={styles.forumContent}>
          <View style={styles.forumTitleRow}>
            <Text numberOfLines={1} style={styles.forumTitle}>
              {item.title}
            </Text>

            {item?.lastMessage?.created_at ? (
              <Text style={styles.messageDate}>
                {formatLastMessageDate(item.lastMessage.created_at)}
              </Text>
            ) : null}
          </View>

          <Text numberOfLines={1} style={styles.forumPreview}>
            {getPreviewText(item)}
          </Text>
        </View>
      </Pressable>
    );
  }

  function renderMyMessages() {
    const lastPrivateMessage =
      privateMessages.length > 0
        ? privateMessages[privateMessages.length - 1]
        : null;

    let preview = 'Private messages sent only to you';

    if (lastPrivateMessage?.body) {
      preview =
        lastPrivateMessage?.private_direction === 'sent'
          ? `You: ${lastPrivateMessage.body}`
          : lastPrivateMessage.body;
    }

    const lastMessageDate = lastPrivateMessage?.created_at
      ? formatLastMessageDate(
          normalizePrivateMessageDate(lastPrivateMessage.created_at),
        )
      : '';

    return (
      <Pressable
        onPress={openPrivateMessages}
        style={({ pressed }) => [
          styles.forumRow,
          styles.privateMessageRow,
          pressed && styles.rowPressed,
        ]}
      >
        <View style={[styles.avatar, styles.privateAvatar]}>
          <Text style={styles.avatarText}>MM</Text>
        </View>

        <View style={styles.forumContent}>
          <View style={styles.forumTitleRow}>
            <Text numberOfLines={1} style={styles.forumTitle}>
              My Messages
            </Text>

            {!!lastMessageDate && (
              <Text style={styles.messageDate}>{lastMessageDate}</Text>
            )}
          </View>

          <Text numberOfLines={1} style={styles.forumPreview}>
            {preview}
          </Text>
        </View>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading chats...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 0),
        },
      ]}
    >
      <View style={styles.topSection}>
        <View style={styles.topHeaderRow}>
          <View style={styles.topHeaderText}>
            <Text style={styles.pageTitle}>Chats</Text>

            <Text style={styles.pageSubtitle}>Your school forums</Text>
          </View>

          {showBlockUnblock ? (
            <Pressable
              onPress={openBlockUnblock}
              style={({ pressed }) => [
                styles.blockButton,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.blockButtonText}>Block / Unblock</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.searchCard}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search or start a chat"
            placeholderTextColor="#8091AA"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            style={styles.searchInput}
          />
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => `${item.type}-${item.id}`}
        renderItem={renderForum}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        ListHeaderComponent={renderMyMessages}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No chats found.</Text>
          </View>
        }
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadForums({
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.hiddenMetadata}>
        <Text>{me?.id || ''}</Text>

        <Text>{privateRecipients.length}</Text>

        <Text>{privateMeta.maxRecipients}</Text>

        <Text>{privateMeta.channelUserId || ''}</Text>
      </View>
    </View>
  );
}
