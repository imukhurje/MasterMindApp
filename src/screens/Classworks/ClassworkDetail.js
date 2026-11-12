// src/screens/ClassworkDetail.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Pressable,
  Linking,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../../api/client';

import styles, { COLORS } from './ClassworkDetail.styles';

const { BG, CARD, TEXT, MUTED, BORDER, PRIMARY, DANGER } = COLORS;

const fmtAbsTZ = ts => {
  if (!ts) return '';
  const d = new Date(ts);
  if (Number.isNaN(+d)) return '';
  try {
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return d.toLocaleString();
  }
};

export default function ClassworkDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};

  const classworkId = params.id;
  const initialCw = params.cw || null;

  const [cw, setCw] = useState(initialCw);
  const [me, setMe] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [toast, setToast] = useState(null);

  const canPost = useMemo(() => {
    const role = String(me?.role || me?.primary_role || '').toLowerCase();
    return ['teacher', 'admin'].includes(role);
  }, [me]);

  const showToast = (message, type = 'ok') => {
    setToast({ message, type });
  };
  const clearToast = () => setToast(null);

  const isMine = m => !!me && (m?.user?.id === me.id || m?.user_id === me.id);

  const loadMe = async () => {
    try {
      const meRes = await api('/api/me');
      setMe(meRes);
    } catch (e) {
      console.log('Failed to load /api/me', e);
    }
  };

  const loadAttachments = async () => {
    if (!classworkId) return;
    try {
      const res = await api(`/api/classworks/${classworkId}/files`);
      setAttachments(res?.files || []);
    } catch (e) {
      console.log('Failed to load files', e);
      setAttachments([]);
    }
  };

  const loadMessages = async () => {
    if (!classworkId) return;
    setLoadingMsgs(true);
    try {
      const res = await api(`/api/classworks/${classworkId}/messages`);
      setMessages(Array.isArray(res) ? res : []);
    } catch (e) {
      console.log('Failed to load messages', e);
      setMessages([]);
    } finally {
      setLoadingMsgs(false);
    }
  };

  const loadAll = async () => {
    if (!classworkId) return;
    clearToast();
    setLoading(true);
    try {
      await Promise.all([loadMe(), loadAttachments(), loadMessages()]);
      if (!cw && initialCw) setCw(initialCw);
    } catch (e) {
      console.log('Failed to load classwork detail', e);
      showToast('Could not load classwork.', 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      await loadAll();
      if (!alive) return;
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classworkId]);

  const handleSend = async () => {
    if (!canPost || !classworkId || !msgText.trim()) return;
    const body = msgText.trim();
    setSending(true);
    setMsgText('');
    try {
      const res = await api(`/api/classworks/${classworkId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      });
      if (Array.isArray(res)) {
        setMessages(res);
      } else if (res) {
        setMessages(prev => [...prev, res]);
      }
    } catch (e) {
      console.log('Send failed', e);
      showToast('Send failed.', 'err');
    } finally {
      setSending(false);
    }
  };

  const handleOpenAttachment = async file => {
    console.log('file', file);
    try {
      const url = file.url || file.path;
      if (!url) {
        showToast('No download URL for this file.', 'err');
        return;
      }
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        showToast('Cannot open this file URL.', 'err');
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      console.log('Open attachment failed', e);
      showToast('Failed to open file.', 'err');
    }
  };

  const renderAttachmentCard = file => {
    const name = file.original_name || file.name || `file-${file.id ?? ''}`;
    const ext = String(name).split('.').pop().toLowerCase();
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext);

    const imageUrl = file.url; // make sure this is a direct image URL

    let label = 'FILE';
    if (ext === 'pdf') label = 'PDF';
    else if (['doc', 'docx'].includes(ext)) label = 'DOC';
    else if (['xls', 'xlsx', 'csv'].includes(ext)) label = 'XLS';
    else if (['zip', 'rar', '7z'].includes(ext)) label = 'ZIP';

    return (
      <Pressable
        key={file.id || name}
        onPress={() => handleOpenAttachment(file)}
        style={styles.attachmentCard}
        android_ripple={{ color: 'rgba(255,255,255,0.08)', borderless: false }}
      >
        <View style={styles.attachmentThumb}>
          {isImage && !!imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.attachmentImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.attachmentIcon}>{`📄 ${label}`}</Text>
          )}
        </View>

        <Text style={styles.attachmentName} numberOfLines={1}>
          {name}
        </Text>
      </Pressable>
    );
  };

  const renderMessage = m => {
    const mine = isMine(m);
    return (
      <View
        key={m.id?.toString() || Math.random().toString(36)}
        style={[
          styles.msgBubble,
          mine ? styles.msgBubbleMe : styles.msgBubbleThey,
          { alignSelf: mine ? 'flex-end' : 'flex-start' },
        ]}
      >
        <Text style={styles.msgBody}>{m.body}</Text>
        <Text style={styles.msgMeta}>
          {(m.user?.name || m.user?.email || 'User') +
            ' • ' +
            (m.created_at || '')}
        </Text>
      </View>
    );
  };

  if (!classworkId) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: BG,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: TEXT }}>No classwork selected.</Text>
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
        <ActivityIndicator />
      </View>
    );
  }

  const title = cw?.title || 'Classwork';
  const created = cw?.created_at;
  const body = cw?.body || '';

  const className = cw?.class_name || cw?.class_group_name || '';

  const section = cw?.section || '';

  const classLabel = [className, section].filter(Boolean).join(' - ');

  return (
    <View style={styles.screen}>
      {/* Toast */}
      {toast?.message ? (
        <View
          style={[
            styles.toast,
            toast.type === 'err' ? styles.toastErr : styles.toastOk,
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={styles.heroCard}>
          {/* <Text style={styles.heroLabel}>Classwork</Text> */}

          <Text style={styles.heroTitle} numberOfLines={3}>
            {title}
          </Text>

          <View style={styles.heroMetaRow}>
            {!!classLabel && (
              <View style={styles.metaPill}>
                <Text style={styles.metaPillText}>🏫 {classLabel}</Text>
              </View>
            )}

            {!!created && (
              <View style={styles.metaPill}>
                <Text style={styles.metaPillText}>🕒 {fmtAbsTZ(created)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Details */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBox}>
              <Text style={styles.sectionIcon}>📝</Text>
            </View>

            <View style={styles.sectionHeadingArea}>
              <Text style={styles.sectionTitle}>Classwork Details</Text>

              <Text style={styles.sectionSubtitle}>
                Instructions and notes for this classwork
              </Text>
            </View>
          </View>

          <View style={styles.detailBox}>
            {body ? (
              <Text style={styles.detailBody}>{body}</Text>
            ) : (
              <Text style={styles.mutedText}>No note has been provided.</Text>
            )}
          </View>
        </View>

        {/* Attachments */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBox}>
              <Text style={styles.sectionIcon}>📎</Text>
            </View>

            <View style={styles.sectionHeadingArea}>
              <Text style={styles.sectionTitle}>Attachments</Text>

              <Text style={styles.sectionSubtitle}>
                View or download shared files
              </Text>
            </View>
          </View>

          {attachments?.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.attachmentsTrack}
            >
              {attachments.map(renderAttachmentCard)}
            </ScrollView>
          ) : (
            <View style={styles.detailBox}>
              <Text style={styles.mutedText}>No attachments yet.</Text>
            </View>
          )}
        </View>

        {/* Messages */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBox}>
              <Text style={styles.sectionIcon}>💬</Text>
            </View>

            <View style={styles.sectionHeadingArea}>
              <Text style={styles.sectionTitle}>Messages</Text>

              <Text style={styles.sectionSubtitle}>
                Updates from teachers and administrators
              </Text>
            </View>
          </View>

          {loadingMsgs && !messages.length ? (
            <View style={styles.center}>
              <ActivityIndicator />
            </View>
          ) : messages.length ? (
            <View style={styles.msgList}>{messages.map(renderMessage)}</View>
          ) : (
            <View style={styles.detailBox}>
              <Text style={styles.mutedText}>No messages yet.</Text>
            </View>
          )}

          {canPost ? (
            <View style={styles.composerRow}>
              <TextInput
                style={styles.input}
                placeholder="Write a message..."
                placeholderTextColor={MUTED}
                value={msgText}
                onChangeText={setMsgText}
                onSubmitEditing={handleSend}
                editable={!sending}
              />

              <Pressable
                style={[
                  styles.sendButton,
                  (sending || !msgText.trim()) && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={sending || !msgText.trim()}
              >
                <Text style={styles.sendButtonText}>
                  {sending ? 'Sending...' : 'Send'}
                </Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.readOnlyNote}>
              This channel is read-only for your role.
            </Text>
          )}
        </View>

        {/* Bottom action */}
        <View style={styles.bottomActions}>
          <Pressable
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Back</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
