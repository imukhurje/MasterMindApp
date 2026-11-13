// src/screens/ExamHall.js
import React, { useCallback, useEffect, useRef, useState, memo } from 'react';

import {
  Alert,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Platform,
  AppState,
  Modal,
} from 'react-native';

import { WebView } from 'react-native-webview';

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { api } from '../../api/client';

import { initEcho, joinExamChannel } from '../../realtime/echo';

import AttachOptionalSection from './AttachOptionalSection';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles, { COLORS } from './ExamHall.styles';

const { BG, CARD, TEXT, MUTED, BORDER, DANGER } = COLORS;

/* ---------- KaTeX-in-WebView label (with mhchem) ---------- */
const MathLabel = memo(function MathLabel({
  value = '',
  style,
  minHeight = 24,
  maxHeight = 280,
}) {
  const [height, setHeight] = useState(minHeight);

  // Simple sanitizer to avoid accidental <script> etc.; KaTeX will render math parts.
  // We inject the content as textContent (not innerHTML) anyway.
  const safeText = String(value ?? '');

  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1"
  />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
  <style>
    :root {
      color-scheme: dark;
    }
    html, body {
      margin:0; padding:0; background:#0b1220; overflow:hidden;
      font-family: -apple-system, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Segoe UI", system-ui, sans-serif;
    }
    .wrap {
      color:#e2e8f0; font-size:16px; line-height:1.35;
      padding: 0; margin: 0;
      word-break: break-word; overflow-wrap:anywhere;
    }
    .katex-display { margin: .5rem 0 .5rem 0; }
    .katex { color: #e2e8f0; }
  </style>
</head>
<body>
  <div id="root" class="wrap"></div>

  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/mhchem.min.js"></script>
  <script>
    // Receive text from RN, set as textContent, then auto-render
    function doRender(text){
      var el = document.getElementById('root');
      el.textContent = text || '';
      try {
        renderMathInElement(el, {
          delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "\\\\[", right: "\\\\]", display: true},
            {left: "$", right: "$", display: false},
            {left: "\\\\(", right: "\\\\)", display: false}
          ],
          throwOnError: false
        });
      } catch(_) {}
      // Post height
      setTimeout(function(){
        var h = Math.min(${maxHeight}, Math.max(${minHeight}, document.documentElement.scrollHeight || el.scrollHeight || 0));
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(String(h));
      }, 0);
    }
    // Initial render with placeholder; real text will be posted after load
    doRender(${JSON.stringify(safeText)});
  </script>
</body>
</html>
  `;

  return (
    <View style={[{ minHeight, overflow: 'hidden' }, style]}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        onMessage={e => {
          const h = parseInt(e.nativeEvent.data, 10);
          if (!Number.isNaN(h)) setHeight(h);
        }}
        // Perf + safety knobs
        setSupportMultipleWindows={false}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        style={{ height, backgroundColor: 'transparent' }}
      />
    </View>
  );
});

/* ---------- Pills & Screen ---------- */
const Pill = ({ children, danger }) => (
  <View style={[styles.pill, danger && styles.pillDanger]}>
    <Text style={styles.pillText}>{children}</Text>
  </View>
);

export default function ExamHall() {
  const navigation = useNavigation();
  const route = useRoute();
  const examId = route.params?.examId;
  const examName = route.params?.examName || 'Examination Hall';

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [index, setIndex] = useState(1);
  const [current, setCurrent] = useState(null);
  const [startsAt, setStartsAt] = useState(null);
  const [endsAt, setEndsAt] = useState(null);
  const [preCountdown, setPreCountdown] = useState('--');
  const [remain, setRemain] = useState('--');

  const [me, setMe] = useState(null);
  const [answerFiles, setAnswerFiles] = useState([]);
  const [loadingAnswerFiles, setLoadingAnswerFiles] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [attachmentResetKey, setAttachmentResetKey] = useState(0);

  const [focusLocked, setFocusLocked] = useState(false);
  const [lockReason, setLockReason] = useState(null);

  const [examCompleted, setExamCompleted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submittingExam, setSubmittingExam] = useState(false);

  const [reviewVisible, setReviewVisible] = useState(false);

  const [examReview, setExamReview] = useState([]);

  const submissionInFlightRef = useRef(false);

  const [deletingFileId, setDeletingFileId] = useState(null);

  const appStateRef = useRef(AppState.currentState);

  const examSessionActiveRef = useRef(false);
  const focusLockedRef = useRef(false);
  const violationSendingRef = useRef(false);
  const intentionalExitRef = useRef(false);
  const startCalledRef = useRef(false);

  const nativePickerActiveRef = useRef(false);

  const answersRef = useRef(new Map());
  const [, force] = useState(0);

  const serverNowAtLoad = useRef(null);
  const clientLoadAt = useRef(Date.now());
  const rafRef = useRef(null);

  const toastTimerRef = useRef(null);

  const showToast = useCallback((type, message) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToast({
      type,
      msg: message,
    });

    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 5000);
  }, []);

  const showOk = useCallback(
    message => {
      showToast('ok', message);
    },
    [showToast],
  );

  const showErr = useCallback(
    message => {
      showToast('error', message);
    },
    [showToast],
  );

  const serverNow = () => {
    if (!serverNowAtLoad.current) return new Date();
    const drift = Date.now() - clientLoadAt.current;
    return new Date(new Date(serverNowAtLoad.current).getTime() + drift);
  };

  const coerceType = t => String(t || '').toLowerCase();
  const isSingle = t =>
    [
      'mcq_single',
      'single_mcq',
      'single',
      'scq',
      'single_choice',
      'mcq',
    ].includes(coerceType(t));

  const isSubjective = type => {
    const value = coerceType(type);

    return (
      value === 'subjective' ||
      value === 'text' ||
      value === 'descriptive' ||
      value === 'long_answer' ||
      value === 'short_answer' ||
      value.includes('subject')
    );
  };
  const isMulti = t =>
    [
      'mcq_multi',
      'multiple_mcq',
      'multiple',
      'msq',
      'multiple_choice',
    ].includes(coerceType(t));

  const canSaveCurrent = () => {
    if (!current) return false;
    const cache = answersRef.current.get(String(current.id)) || {};
    if (isSingle(current.type)) return !!cache.single;
    if (isMulti(current.type))
      return Array.isArray(cache.multi) && cache.multi.length > 0;
    return !!(cache.text && cache.text.trim().length > 0);
  };

  const setCachedAnswer = (qId, rec) => {
    const prev = answersRef.current.get(String(qId)) || {};
    answersRef.current.set(String(qId), { ...prev, ...rec });
    force(x => x + 1);
  };

  const hydrateSavedAnswer = useCallback(question => {
    if (!question?.id) {
      return;
    }

    const key = String(question.id);

    // Keep local in-memory edits if this question was already opened.
    if (answersRef.current.has(key)) {
      return;
    }

    const saved = question?.saved_answer;

    if (!saved) {
      return;
    }

    const next = {};

    if (isSingle(question.type)) {
      let selected = saved?.selected;

      if (Array.isArray(selected)) {
        selected = selected[0];
      }

      if (
        selected !== null &&
        selected !== undefined &&
        String(selected).trim() !== ''
      ) {
        next.single = String(selected);
      }
    } else if (isMulti(question.type)) {
      const selected = Array.isArray(saved?.selected)
        ? saved.selected
        : saved?.selected !== null && saved?.selected !== undefined
        ? [saved.selected]
        : [];

      next.multi = selected.map(String);
    } else {
      next.text =
        saved?.text !== null && saved?.text !== undefined
          ? String(saved.text)
          : '';
    }

    answersRef.current.set(key, next);

    // Re-render so AnswerArea gets the restored value.
    force(value => value + 1);
  }, []);

  const fetchAnswerFiles = useCallback(
    async questionId => {
      if (!examId || !questionId) {
        setAnswerFiles([]);
        return;
      }

      try {
        setLoadingAnswerFiles(true);

        const response = await api(
          `/api/exams/${encodeURIComponent(
            examId,
          )}/answers/${encodeURIComponent(questionId)}/files`,
        );

        setAnswerFiles(Array.isArray(response?.files) ? response.files : []);
      } catch (error) {
        console.log('Answer files load error:', error);

        setAnswerFiles([]);
      } finally {
        setLoadingAnswerFiles(false);
      }
    },
    [examId],
  );

  const deleteAnswerFile = useCallback(
    async file => {
      const fileId = file?.id;

      if (!fileId || deletingFileId) {
        return;
      }

      try {
        setDeletingFileId(fileId);

        await api(`/api/exams/answers/files/${encodeURIComponent(fileId)}`, {
          method: 'DELETE',
        });

        // Reload attachments for the current question.
        if (current?.id) {
          await fetchAnswerFiles(current.id);
        }

        showOk('Attachment deleted.');
      } catch (error) {
        console.log('Delete attachment error:', error);

        showErr(error?.message || 'Could not delete the attachment.');
      } finally {
        setDeletingFileId(null);
      }
    },
    [current?.id, deletingFileId, fetchAnswerFiles],
  );

  const confirmDeleteAnswerFile = useCallback(
    file => {
      if (!file?.id) {
        return;
      }

      Alert.alert('Delete file', 'Delete this file?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAnswerFile(file),
        },
      ]);
    },
    [deleteAnswerFile],
  );

  const handleSubjectiveFiles = useCallback(
    async files => {
      if (
        !examId ||
        !current?.id ||
        !isSubjective(current?.type) ||
        !Array.isArray(files) ||
        files.length === 0
      ) {
        return;
      }

      try {
        setUploadingFiles(true);

        const formData = new FormData();

        files.forEach((file, fileIndex) => {
          if (!file?.uri) {
            return;
          }

          formData.append('files[]', {
            uri: file.uri,

            name: file.name || `attachment_${fileIndex + 1}`,

            type: file.type || 'application/octet-stream',
          });
        });

        const response = await api(
          `/api/exams/${encodeURIComponent(
            examId,
          )}/answers/${encodeURIComponent(current.id)}/files`,
          {
            method: 'POST',
            body: formData,
          },
        );

        console.log('Exam attachment upload response:', response);

        // Reload the complete attachment list.
        await fetchAnswerFiles(current.id);

        // Clear temporary selection from picker UI.
        setAttachmentResetKey(key => key + 1);

        showOk(
          files.length === 1 ? 'Attachment uploaded.' : 'Attachments uploaded.',
        );
      } catch (error) {
        console.log('Exam attachment upload error:', error);

        showErr(error?.message || 'Could not upload attachment.');
      } finally {
        setUploadingFiles(false);
      }
    },
    [examId, current, fetchAnswerFiles],
  );

  const ensureExamStarted = useCallback(async () => {
    if (!examId || startCalledRef.current) {
      return;
    }

    try {
      startCalledRef.current = true;

      await api(`/api/exams/${encodeURIComponent(examId)}/start`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
    } catch (error) {
      startCalledRef.current = false;
      throw error;
    }
  }, [examId]);

  const loadState = useCallback(
    async desiredIndex => {
      const qs = desiredIndex != null ? `?index=${desiredIndex}` : '';
      const s = await api(`/api/exams/${examId}/hall/state${qs}`);

      serverNowAtLoad.current =
        s.server_now || serverNowAtLoad.current || s.starts_at;
      setStartsAt(new Date(s.starts_at));
      setEndsAt(new Date(s.ends_at));
      setStarted(!!s.started);
      setEnded(!!s.ended);
      setQuestionCount(s.question_count || 0);

      const st = String(s?.attempt?.status || '').toLowerCase();

      const attemptLocked =
        st === 'focus_locked' ||
        Boolean(s?.attempt?.locked_at) ||
        Boolean(s?.attempt?.lock_reason);

      const isSubmitted = st === 'submitted' || st === 'auto_submitted';

      if (isSubmitted) {
        setAlreadySubmitted(true);

        setFocusLocked(false);
        focusLockedRef.current = false;

        setExamCompleted(false);
        setCurrent(null);

        intentionalExitRef.current = true;
        examSessionActiveRef.current = false;

        setRemain('--');

        return s;
      }

      setAlreadySubmitted(false);

      /*
       * Locked session.
       */
      if (attemptLocked) {
        setFocusLocked(true);
        focusLockedRef.current = true;

        setLockReason(s?.attempt?.lock_reason || 'visibility_hidden');

        examSessionActiveRef.current = false;

        return s;
      }

      /*
       * Upcoming exam.
       *
       * Important:
       * Do not treat an old submitted / auto-submitted
       * attempt as a finished exam before the exam starts.
       */
      if (s?.started !== true && s?.ended !== true) {
        setFocusLocked(false);
        focusLockedRef.current = false;

        examSessionActiveRef.current = false;

        setCurrent(null);

        return s;
      }

      /*
       * The exam itself has ended.
       */
      if (s?.ended === true) {
        intentionalExitRef.current = true;
        examSessionActiveRef.current = false;

        Alert.alert('Exam finished', 'This attempt is closed.', [
          {
            text: 'OK',
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Exams',
                  },
                ],
              }),
          },
        ]);

        return null;
      }

      if (s.question) {
        hydrateSavedAnswer(s.question);

        setIndex(s.question.index || 1);
        setCurrent(s.question);
      } else {
        setCurrent(null);
      }
      return s;
    },
    [examId, navigation, hydrateSavedAnswer],
  );

  const initializeExamHall = useCallback(async () => {
    // 1. Load the first question and attempt state.
    const state = await loadState(1);

    if (!state) {
      return null;
    }

    const attemptStatus = String(state?.attempt?.status || '').toLowerCase();

    // Stop if the attempt is already locked or closed.
    const isClosed =
      state?.ended === true ||
      attemptStatus === 'focus_locked' ||
      attemptStatus === 'submitted' ||
      attemptStatus === 'auto_submitted' ||
      Boolean(state?.attempt?.locked_at) ||
      Boolean(state?.attempt?.lock_reason);

    if (isClosed) {
      return state;
    }

    // 2. Start or confirm the active exam attempt.
    if (state.started === true) {
      await ensureExamStarted();
    }

    // 3. Load the logged-in user without blocking the exam.
    try {
      const meResponse = await api('/api/me');
      setMe(meResponse || null);
    } catch (error) {
      console.log('[EXAM HALL ME ERROR]', error?.message);
    }

    // 4. Load current question attachments.
    if (state?.question?.id) {
      await fetchAnswerFiles(state.question.id);
    } else {
      setAnswerFiles([]);
    }

    // 5. Activate examination focus monitoring.
    const status = String(state?.attempt?.status || '').toLowerCase();

    if (
      state.started === true &&
      !state.ended &&
      status !== 'submitted' &&
      status !== 'auto_submitted' &&
      status !== 'focus_locked' &&
      !state?.attempt?.locked_at &&
      !state?.attempt?.lock_reason
    ) {
      examSessionActiveRef.current = true;
    }

    return state;
  }, [loadState, ensureExamStarted, fetchAnswerFiles]);

  const fetchQuestionAt = useCallback(
    async idx => {
      const s = await api(`/api/exams/${examId}/hall/state?index=${idx}`);
      serverNowAtLoad.current = s.server_now || serverNowAtLoad.current;
      setStarted(!!s.started);
      setEnded(!!s.ended);
      setStartsAt(new Date(s.starts_at));
      setEndsAt(new Date(s.ends_at));
      setQuestionCount(s.question_count || 0);

      if (!s.started) throw new Error('Exam has not started yet.');
      if (s.ended) throw new Error('This exam has ended.');
      if (!s.question) throw new Error('No question at this index.');

      hydrateSavedAnswer(s.question);

      setIndex(s.question.index || idx);

      setCurrent(s.question);

      await fetchAnswerFiles(s.question.id);
    },
    [examId, fetchAnswerFiles, hydrateSavedAnswer],
  );

  const bindRealtime = useCallback(async () => {
    try {
      await initEcho();
    } catch (e) {
      console.warn('[Echo] init failed (continuing)', e?.message || e);
      return () => {};
    }

    return joinExamChannel(examId, {
      started: async () => {
        setStarted(true);

        try {
          await ensureExamStarted();
          await loadState(1);
        } catch {}
      },

      ended: () => {
        autoSubmit();
      },
    });
  }, [examId, loadState, ensureExamStarted]);

  useEffect(() => {
    if (!startsAt || !endsAt) return;
    const tick = () => {
      const now = serverNow();

      if (!started) {
        const ms = startsAt - now;
        setPreCountdown(ms > 0 ? Math.ceil(ms / 1000) + ' s' : 'Starting…');
        if (ms <= 0) {
          (async () => {
            try {
              await ensureExamStarted();
              await loadState(1);
            } catch {}
          })();
        }
      }

      if (
        started &&
        !ended &&
        !alreadySubmitted &&
        !intentionalExitRef.current
      ) {
        const ms = endsAt - now;
        setRemain(ms > 0 ? Math.max(0, Math.ceil(ms / 1000)) + ' s' : '0 s');
        if (ms <= 0) {
          autoSubmit();
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [examId, started, ended, startsAt, endsAt, loadState, ensureExamStarted]);

  const sendFocusViolation = useCallback(
    async ({ updateScreen = true } = {}) => {
      if (!examId) {
        return null;
      }

      if (
        intentionalExitRef.current ||
        focusLockedRef.current ||
        nativePickerActiveRef.current ||
        !examSessionActiveRef.current ||
        violationSendingRef.current
      ) {
        return null;
      }

      try {
        violationSendingRef.current = true;

        const response = await api(
          `/api/exams/${encodeURIComponent(examId)}/focus-violation`,
          {
            method: 'POST',
            body: JSON.stringify({
              reason: 'visibility_hidden',
              answer: null,
            }),
          },
        );

        const locked =
          response?.locked === true || response?.status === 'focus_locked';

        if (locked) {
          // Always update refs because backend session is locked.
          focusLockedRef.current = true;
          examSessionActiveRef.current = false;

          // Only show the locked screen when required.
          if (updateScreen) {
            setFocusLocked(true);
            setLockReason('visibility_hidden');
            setEnded(true);
          }
        }

        return response;
      } catch (error) {
        console.log('Focus violation error:', error);

        return null;
      } finally {
        violationSendingRef.current = false;
      }
    },
    [examId],
  );

  const handleExitHall = useCallback(async () => {
    try {
      const response = await sendFocusViolation();

      const locked =
        response?.locked === true ||
        response?.status === 'focus_locked' ||
        focusLockedRef.current;

      if (!locked) {
        showErr('Could not close and lock the exam session.');
        return;
      }

      // Allow intentional navigation only after the
      // server confirms that the session is locked.
      intentionalExitRef.current = true;
      examSessionActiveRef.current = false;

      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Exams',
          },
        ],
      });
    } catch (error) {
      console.log('Exit hall error:', error);

      showErr(error?.message || 'Could not exit the examination hall.');
    }
  }, [navigation, sendFocusViolation, showErr]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      let unbind = null;

      intentionalExitRef.current = false;

      (async () => {
        try {
          setLoading(true);

          const state = await initializeExamHall();

          if (!active) {
            return;
          }

          setLoading(false);

          if (!state) {
            return;
          }

          const attemptStatus = state?.attempt?.status;

          const normalizedAttemptStatus = String(
            attemptStatus || '',
          ).toLowerCase();

          const closed =
            state?.ended === true ||
            normalizedAttemptStatus === 'focus_locked' ||
            Boolean(state?.attempt?.locked_at) ||
            Boolean(state?.attempt?.lock_reason) ||
            (state?.started === true &&
              (normalizedAttemptStatus === 'submitted' ||
                normalizedAttemptStatus === 'auto_submitted'));

          /*
           * 5. Bind realtime.
           *
           * joinExamChannel() will trigger
           * /broadcasting/auth for private-exam.{id}.
           */
          if (!closed) {
            try {
              unbind = await bindRealtime();
            } catch (error) {
              console.log('Realtime bind error:', error);
            }
          }
        } catch (error) {
          if (!active) {
            return;
          }

          setLoading(false);

          showErr(error?.message || 'Failed to load exam hall.');
        }
      })();

      return () => {
        active = false;

        if (unbind) {
          unbind();
        }
      };
    }, [initializeExamHall, bindRealtime]),
  );

  useEffect(() => {
    focusLockedRef.current = focusLocked;
  }, [focusLocked]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      const previousState = appStateRef.current;

      appStateRef.current = nextState;

      const leftForeground =
        previousState === 'active' &&
        (nextState === 'inactive' || nextState === 'background');

      if (leftForeground) {
        sendFocusViolation();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [sendFocusViolation]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (intentionalExitRef.current) {
        return;
      }

      if (!examSessionActiveRef.current) {
        return;
      }

      // Stop navigation temporarily until
      // the lock API finishes.
      event.preventDefault();

      (async () => {
        const response = await sendFocusViolation({
          updateScreen: false,
        });

        const locked =
          response?.locked === true || response?.status === 'focus_locked';

        if (!locked) {
          showErr('Could not lock the exam session.');
          return;
        }

        // Allow the original Back action.
        intentionalExitRef.current = true;

        navigation.dispatch(event.data.action);
      })();
    });

    return unsubscribe;
  }, [navigation, sendFocusViolation, showErr]);

  const gotoIndex = async nextIndex => {
    if (nextIndex < 1) nextIndex = 1;
    if (questionCount) nextIndex = Math.min(nextIndex, questionCount);
    try {
      await fetchQuestionAt(nextIndex);
    } catch (e) {
      showErr(e.message || 'Unable to load question.');
    }
  };

  const saveAndMaybeNext = async (jumpToNext = true) => {
    if (!current) return;
    if (!canSaveCurrent()) {
      showErr('Please answer before saving.');
      return;
    }
    try {
      const rec = answersRef.current.get(String(current.id)) || {};
      const payload = {
        question_id: current.id,
        is_marked: Boolean(current?.is_marked ?? false),
      };
      if (isSingle(current.type))
        payload.selected_options = rec.single ? [String(rec.single)] : [];
      else if (isMulti(current.type))
        payload.selected_options = Array.isArray(rec.multi)
          ? rec.multi.map(String)
          : [];
      else payload.text_answer = rec.text || '';
      const response = await api(`/api/exams/${examId}/answers`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response?.ok !== true) {
        throw new Error('Answer could not be saved.');
      }
      showOk('Answer saved.');

      // Last question completed.
      if (index >= questionCount) {
        setExamCompleted(true);
        return;
      }

      // Move to the next question.
      if (jumpToNext) {
        await gotoIndex(index + 1);
      }
    } catch (e) {
      const msg =
        e?.payload?.message ||
        e?.payload?.error ||
        (e?.payload?.errors
          ? Object.values(e.payload.errors).flat().join(' ')
          : null) ||
        e?.message ||
        'Save failed.';
      showErr(msg);
      try {
        await loadState(index);
      } catch {}
    }
  };

  const submitAnswerSheet = async () => {
    if (submissionInFlightRef.current || focusLockedRef.current || ended) {
      return;
    }

    submissionInFlightRef.current = true;

    try {
      setSubmittingExam(true);

      const response = await api(
        `/api/exams/${encodeURIComponent(examId)}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        },
      );

      if (response?.ok !== true) {
        throw new Error('Could not submit the answer sheet.');
      }

      // The server has accepted the final submission.
      // Stop focus monitoring and exam countdown submission.
      intentionalExitRef.current = true;
      examSessionActiveRef.current = false;

      setEnded(true);

      const review = Array.isArray(response?.review) ? response.review : [];

      setExamReview(review);

      // Show the review only after successful submission.
      setReviewVisible(true);
    } catch (error) {
      console.log('[EXAM MANUAL SUBMIT ERROR]', {
        message: error?.message,
        status: error?.status,
        payload: error?.payload,
      });

      showErr(
        error?.payload?.message ||
          error?.message ||
          'Failed to submit the answer sheet.',
      );
    } finally {
      submissionInFlightRef.current = false;
      setSubmittingExam(false);
    }
  };

  const confirmSubmitAnswerSheet = () => {
    if (submittingExam || submissionInFlightRef.current) {
      return;
    }

    Alert.alert(
      'Submit answer sheet',
      'Submit your answer sheet? You will not be able to edit further.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: submitAnswerSheet,
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const autoSubmit = async () => {
    if (
      submissionInFlightRef.current ||
      intentionalExitRef.current ||
      focusLockedRef.current
    ) {
      return;
    }

    submissionInFlightRef.current = true;

    try {
      const response = await api(
        `/api/exams/${encodeURIComponent(examId)}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        },
      );

      if (response?.ok !== true) {
        throw new Error('Automatic submission failed.');
      }

      intentionalExitRef.current = true;
      examSessionActiveRef.current = false;

      setEnded(true);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error) {
      console.log('[EXAM AUTO SUBMIT ERROR]', error);

      showErr(error?.message || 'Could not submit the exam automatically.');

      // Keep the screen open so submission failure is not
      // incorrectly reported as success.
    } finally {
      submissionInFlightRef.current = false;
    }
  };

  if (!examId) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.err}>Invalid exam.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}></Text>

        {!!endsAt && <Pill>Ends: {endsAt.toLocaleString()}</Pill>}
      </View>

      {/* Exam screen warning */}
      {!loading && started && !focusLocked && (!ended || alreadySubmitted) && (
        <View style={styles.examWarningContainer} accessibilityRole="alert">
          <MaterialCommunityIcons
            name="alert-outline"
            size={22}
            color="#F87171"
          />

          <Text style={styles.examWarningText}>
            <Text style={styles.examWarningBold}>
              Stay on this exam screen.
            </Text>{' '}
            Minimizing the browser or app, changing tabs, or opening another
            mobile app will immediately submit and lock your test. Only an
            administrator can unlock it.
          </Text>
        </View>
      )}

      {!!toast && (
        <View
          style={[
            styles.toast,
            toast.type === 'ok' ? styles.toastOk : styles.toastErr,
          ]}
        >
          <Text style={styles.toastText}>{toast.msg}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : alreadySubmitted ? (
        <View style={styles.completedCard}>
          <View style={styles.completedHeader}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.completedTitle}>Answer sheet submitted</Text>

              <Text style={styles.completedSubtitle}>
                This attempt can no longer be edited
              </Text>
            </View>

            <Pill>⏱ --</Pill>
          </View>

          <View style={styles.submittedBody}>
            <MaterialCommunityIcons name="check" size={46} color="#E2E8F0" />

            <Text style={styles.submittedTitle}>
              Your answer sheet has been submitted
            </Text>

            <Text style={styles.submittedDescription}>
              You cannot re-enter or change this attempt.
            </Text>

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary]}
              onPress={() => {
                intentionalExitRef.current = true;
                examSessionActiveRef.current = false;

                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Dashboard' }],
                });
              }}
            >
              <Text style={styles.btnSecondaryText}>Return to dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : focusLocked ? (
        <View style={styles.lockCard}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.lockTitle}>
                Exam submitted and session locked
              </Text>

              <Text style={styles.lockSubtitle}>
                Administrator action required
              </Text>
            </View>

            <Pill>⏱ --</Pill>
          </View>

          <View style={styles.lockBody}>
            <Text style={styles.lockIcon}>🔒</Text>

            <Text style={styles.lockWarning}>Your test was auto-submitted</Text>

            <Text style={styles.lockMessage}>
              This session was locked because the exam screen lost visibility.
              You cannot re-enter this test until an administrator unlocks your
              session.
            </Text>

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary]}
              onPress={() => {
                intentionalExitRef.current = true;

                examSessionActiveRef.current = false;

                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Dashboard',
                    },
                  ],
                });
              }}
            >
              <Text style={styles.btnText}>Return to dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : examCompleted ? (
        <View style={styles.completedCard}>
          <View style={styles.completedHeader}>
            <View>
              <Text style={styles.completedTitle}>
                Completed ({questionCount} questions)
              </Text>

              <Text style={styles.completedSubtitle}>Exam completed</Text>
            </View>

            <Pill>⏱ {remain}</Pill>
          </View>

          <View style={styles.completedBody}>
            <Text style={styles.completedMessageTitle}>
              You have completed the exam.
            </Text>

            <Text style={styles.completedMessage}>
              Submit your answer sheet to see the automatic review.
            </Text>

            <View style={styles.completedActions}>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary]}
                onPress={async () => {
                  try {
                    await fetchQuestionAt(1);
                    setExamCompleted(false);
                  } catch (error) {
                    showErr(error?.message || 'Could not restart the exam.');
                  }
                }}
              >
                <Text style={styles.btnText}>Restart Exam</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.btnPrimary,
                  submittingExam && styles.btnDisabled,
                ]}
                onPress={confirmSubmitAnswerSheet}
                disabled={submittingExam}
              >
                {submittingExam ? (
                  <View style={styles.row}>
                    <ActivityIndicator size="small" color="#FFFFFF" />

                    <Text style={styles.btnText}>Submitting...</Text>
                  </View>
                ) : (
                  <Text style={styles.btnText}>Submit answer sheet</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : !started ? (
        <View style={styles.card}>
          <Text style={styles.h1}>Your exam will begin shortly…</Text>
          {!!startsAt && (
            <Text style={styles.muted}>
              Starts at: {startsAt.toLocaleString()}
            </Text>
          )}
          <Text style={[styles.h1, { marginTop: 8 }]}>⏳ {preCountdown}</Text>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.qtitle}>
                Question {index} of {questionCount || 0}
              </Text>
              <View style={styles.row}>
                <Text style={styles.muted}>
                  {coerceType(current?.type).includes('subject')
                    ? 'Subjective'
                    : coerceType(current?.type).includes('multi')
                    ? 'Multiple choice'
                    : 'Single choice'}
                </Text>
                {Number.isFinite(current?.marks) && (
                  <Pill>⭐ Full Marks: {String(current.marks)}</Pill>
                )}
              </View>
            </View>
            <Pill>⏱ {remain}</Pill>
          </View>

          <ScrollView
            style={styles.qhost}
            contentContainerStyle={styles.questionScrollContent}
          >
            <MathLabel
              value={current?.text || ''}
              style={styles.questionText}
            />

            <AnswerArea
              current={current}
              saved={answersRef.current.get(String(current?.id)) || {}}
              onToggle={optId => {
                if (!current) return;

                if (isSingle(current.type)) {
                  setCachedAnswer(current.id, {
                    single: String(optId),
                    multi: undefined,
                  });
                } else if (isMulti(current.type)) {
                  const prev = answersRef.current.get(String(current.id)) || {};

                  const selected = new Set((prev.multi || []).map(String));

                  if (selected.has(String(optId))) {
                    selected.delete(String(optId));
                  } else {
                    selected.add(String(optId));
                  }

                  setCachedAnswer(current.id, {
                    multi: Array.from(selected.values()),
                  });
                }
              }}
              onText={text => {
                if (!current) return;

                setCachedAnswer(current.id, {
                  text,
                });
              }}
            />
          </ScrollView>

          {/* Only subjective questions can have attachments. */}
          {isSubjective(current?.type) ? (
            <View style={styles.attachmentWrapper}>
              <AttachOptionalSection
                BG={BG}
                CARD={CARD}
                TEXT={TEXT}
                MUTED={MUTED}
                BORDER={BORDER}
                DANGER={DANGER}
                resetKey={attachmentResetKey}
                uploading={uploadingFiles}
                onPickedFiles={handleSubjectiveFiles}
                onPickerActivityChange={active => {
                  nativePickerActiveRef.current = active;
                }}
              />

              {loadingAnswerFiles ? (
                <View style={styles.answerFilesLoading}>
                  <ActivityIndicator />
                </View>
              ) : answerFiles.length > 0 ? (
                <View style={styles.answerFilesBox}>
                  <Text style={styles.answerFilesTitle}>Attached files</Text>

                  {answerFiles.map((file, fileIndex) => {
                    const isDeleting = deletingFileId === file?.id;

                    return (
                      <View
                        key={
                          file?.id ??
                          `${file?.original_name || file?.name}-${fileIndex}`
                        }
                        style={styles.answerFileRow}
                      >
                        <View style={styles.answerFileInfo}>
                          <Text style={styles.answerFileName} numberOfLines={1}>
                            {file?.original_name || file?.name || 'Attachment'}
                          </Text>

                          {!!file?.size && (
                            <Text style={styles.answerFileMeta}>
                              {(Number(file.size) / 1024 / 1024).toFixed(2)} MB
                            </Text>
                          )}
                        </View>

                        <TouchableOpacity
                          disabled={isDeleting}
                          onPress={() => confirmDeleteAnswerFile(file)}
                          style={({ pressed }) => [
                            styles.answerFileDeleteButton,

                            pressed && styles.answerFileDeleteButtonPressed,

                            isDeleting && styles.answerFileDeleteButtonDisabled,
                          ]}
                        >
                          {isDeleting ? (
                            <ActivityIndicator size="small" color={DANGER} />
                          ) : (
                            <MaterialCommunityIcons
                              name="trash-can-outline"
                              size={20}
                              color={DANGER}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </View>
          ) : null}

          <View style={styles.navigationRow}>
            {index > 1 ? (
              <TouchableOpacity
                style={[styles.btn, styles.btnSecondary]}
                onPress={() => gotoIndex(index - 1)}
              >
                <Text style={styles.btnSecondaryText}>← Previous</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnPrimary,
                !canSaveCurrent() && styles.btnDisabled,
              ]}
              disabled={!canSaveCurrent()}
              onPress={() => saveAndMaybeNext(true)}
            >
              <Text style={styles.btnText}>Save & Next →</Text>
            </TouchableOpacity>

            {index < questionCount ? (
              <TouchableOpacity
                style={[styles.btn, styles.btnSecondary]}
                onPress={() => gotoIndex(index + 1)}
              >
                <Text style={styles.btnSecondaryText}>Next →</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}
      <Modal
        visible={reviewVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {}}
      >
        <View style={styles.reviewModalOverlay}>
          <View style={styles.reviewModalCard}>
            <View style={styles.reviewModalHeader}>
              <Text style={styles.reviewModalTitle}>Exam complete</Text>

              <Text style={styles.reviewModalSubtitle}>
                Your answers have been submitted. Review the automatic MCQ
                scores below.
              </Text>
            </View>

            <ScrollView
              style={styles.reviewModalScroll}
              contentContainerStyle={styles.reviewModalContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              scrollEnabled={true}
              bounces={false}
            >
              {examReview.length === 0 ? (
                <Text style={styles.reviewEmptyText}>
                  Your answer sheet was submitted successfully. No automatic
                  review is available.
                </Text>
              ) : (
                examReview.map((item, itemIndex) => {
                  const studentChoices = Array.isArray(
                    item?.student_answer?.choices,
                  )
                    ? item.student_answer.choices
                    : [];

                  const correctChoices = Array.isArray(
                    item?.correct_answer?.choices,
                  )
                    ? item.correct_answer.choices
                    : [];

                  const studentAnswer = studentChoices.length
                    ? studentChoices.join(', ')
                    : 'No answer';

                  const correctAnswer = correctChoices.length
                    ? correctChoices.join(', ')
                    : 'Not available';

                  const earned = item?.score?.earned;
                  const fullMarks = item?.score?.full_marks;

                  return (
                    <View
                      key={`review-${item?.index ?? itemIndex}-${itemIndex}`}
                      style={styles.reviewQuestionCard}
                    >
                      <View style={styles.reviewQuestionHeader}>
                        <Text style={styles.reviewQuestionTitle}>
                          {item?.index ?? itemIndex + 1}. {item?.question || ''}
                        </Text>
                      </View>

                      <View style={styles.reviewQuestionBody}>
                        <View style={styles.reviewAnswerBox}>
                          <View style={styles.reviewAnswerTopRow}>
                            <Text style={styles.reviewAnswerLabel}>
                              Your answer
                            </Text>

                            {earned != null && fullMarks != null ? (
                              <View style={styles.reviewScoreBadge}>
                                <Text style={styles.reviewScoreText}>
                                  Score: {earned} / {fullMarks}
                                </Text>
                              </View>
                            ) : null}
                          </View>

                          <Text style={styles.reviewAnswerText}>
                            {studentAnswer}
                          </Text>
                        </View>

                        <View style={styles.reviewCorrectBox}>
                          <Text style={styles.reviewAnswerLabel}>
                            Correct answer(s)
                          </Text>

                          <Text style={styles.reviewAnswerText}>
                            {correctAnswer}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>

            <View style={styles.reviewModalFooter}>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary]}
                onPress={() => {
                  setReviewVisible(false);

                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Dashboard' }],
                  });
                }}
              >
                <Text style={styles.btnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function AnswerArea({ current, saved, onToggle, onText }) {
  if (!current) return null;
  const t = String(current.type || '').toLowerCase();
  const options = Array.isArray(current.options) ? current.options : [];

  const isChoice =
    [
      'mcq_single',
      'single_mcq',
      'single',
      'scq',
      'single_choice',
      'mcq',
    ].includes(t) ||
    [
      'mcq_multi',
      'multiple_mcq',
      'multiple',
      'msq',
      'multiple_choice',
    ].includes(t);

  if (isChoice) {
    const chosen = new Set(
      [
        'mcq_single',
        'single_mcq',
        'single',
        'scq',
        'single_choice',
        'mcq',
      ].includes(t)
        ? saved.single
          ? [String(saved.single)]
          : []
        : (saved.multi || []).map(String),
    );

    if (!options.length)
      return (
        <Text style={styles.muted}>No options provided for this question.</Text>
      );

    return (
      <View style={styles.answerArea}>
        {options.map(opt => {
          const isOn = chosen.has(String(opt.id));
          return (
            <TouchableOpacity
              key={String(opt.id)}
              style={[styles.opt, isOn && styles.optOn]}
              onPress={() => onToggle(String(opt.id))}
            >
              <View style={[styles.check, isOn && styles.checkOn]}>
                {isOn ? <Text style={styles.checkText}>✓</Text> : null}
              </View>
              {/* Option text with LaTeX */}
              <View style={styles.optionTextContainer}>
                <MathLabel value={String(opt.text ?? '')} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  // Subjective
  return (
    <View style={styles.answerArea}>
      <TextInput
        value={saved.text || ''}
        onChangeText={onText}
        placeholder="Type your answer…"
        placeholderTextColor="#64748b"
        multiline
        textAlignVertical="top"
        style={styles.textarea}
      />
    </View>
  );
}
