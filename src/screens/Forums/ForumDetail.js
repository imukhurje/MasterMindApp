import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from './../../api/client';

const BG = '#0F172A';
const CARD = '#0B1220';
const TEXT = '#E2E8F0';
const MUTED = '#94A3B8';
const BORDER = '#334155';
const PRIMARY = '#2563eb';
const SEND = '#22C55E';

const fmtTime = ts => {
  if (!ts) return '';
  const d = new Date(ts);
  if (Number.isNaN(+d)) return String(ts);
  try {
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return d.toLocaleString();
  }
};

export default function ForumDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const mounted = useRef(true);
  const scrollRef = useRef(null);

  const forum = route.params?.forum || null;

  const currentUserId = route.params?.currentUserId ?? null;

  const [busy, setBusy] = useState(true);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    mounted.current = true;
    if (!forum) {
      setBusy(false);
      return;
    }

    const unsub = navigation.addListener('focus', () => {
      loadMessages();
    });

    loadMessages();

    return () => {
      mounted.current = false;
      unsub && unsub();
    };
  }, [navigation, forum?.id]);

  const loadMessages = async () => {
    if (!forum) return;
    try {
      setBusy(true);
      const res = await api(`/api/forums/${forum.id}/messages`);
      if (!mounted.current) return;
      setMessages(Array.isArray(res) ? res : []);
    } catch (e) {
      if (!mounted.current) return;
      Alert.alert('Forum', e?.message || 'Failed to load messages.');
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  const handleSend = async () => {
    const body = text.trim();
    if (!body || !forum) return;

    try {
      setSending(true);

      // 🔽 Adjust this call if your api() helper uses a different POST signature
      await api(`/api/forums/${forum.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      });

      setText('');
      await loadMessages();
      // Scroll to bottom after send
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (e) {
      Alert.alert('Forum', e?.message || 'Could not send message.');
    } finally {
      setSending(false);
    }
  };

  if (!forum) {
    return (
      <View style={styles.center}>
        <Text style={{ color: TEXT }}>No forum selected.</Text>
      </View>
    );
  }

  if (busy && !messages.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{forum.title || forum.name}</Text>
      </View>

      {/* Chat card */}
      <View style={styles.card}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: false })
          }
        >
          {messages.map(msg => {
            const isMine =
              currentUserId != null && msg?.user?.id === currentUserId;

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  { justifyContent: isMine ? 'flex-end' : 'flex-start' },
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    isMine ? styles.bubbleMine : styles.bubbleOther,
                  ]}
                >
                  <Text style={styles.bubbleText}>{msg.body}</Text>
                  <Text style={styles.metaText}>
                    {msg.user?.name || 'Unknown'} • {fmtTime(msg.created_at)}
                  </Text>
                </View>
              </View>
            );
          })}

          {!messages.length && !busy && (
            <Text style={{ color: MUTED, textAlign: 'center', marginTop: 16 }}>
              No messages yet. Be the first to post.
            </Text>
          )}
        </ScrollView>

        {/* Input row */}
        <View style={styles.inputRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#64748B"
            multiline
            style={styles.input}
          />
          <Pressable
            onPress={handleSend}
            disabled={sending || !text.trim()}
            style={({ pressed }) => [
              styles.sendBtn,
              (pressed || sending || !text.trim()) && { opacity: 0.8 },
            ]}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendText}>Send</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  center: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '800',
  },
  card: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },
  messagesContent: {
    paddingBottom: 12,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  bubbleOther: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  bubbleMine: {
    backgroundColor: '#2563eb', // bright blue for my messages
  },
  bubbleText: {
    color: '#f9fafb',
    fontSize: 14,
  },
  metaText: {
    marginTop: 4,
    fontSize: 10,
    color: '#e5e7eb',
  },

  inputRow: {
    flexDirection: 'row',
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    color: TEXT,
    fontSize: 14,
    paddingVertical: 4,
    paddingRight: 8,
  },
  sendBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: SEND,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  sendText: {
    color: '#022c22',
    fontWeight: '700',
    fontSize: 14,
  },
});
