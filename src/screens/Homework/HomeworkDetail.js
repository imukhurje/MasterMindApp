// src/screens/HomeworkDetail.js
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  Alert,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import RNFetchBlob from 'react-native-blob-util';
import { api, getToken, absoluteUrl } from '../../api/client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AttachOptionalSection from './AttachOptionalSection';
import styles, { COLORS } from './HomeworkDetail.styles';

const { BG, CARD, TEXT, MUTED, BORDER, CTA, INFO, DANGER } = COLORS;

const Pill = ({ label, color = INFO }) => (
  <View style={styles.pill}>
    <Text style={[styles.pillText, { color }]}>{label}</Text>
  </View>
);

const fmtAbsTZ = (ts, tz) => {
  if (!ts) return '';
  const d = new Date(ts);
  if (Number.isNaN(+d)) return '';
  try {
    return d.toLocaleString(undefined, {
      timeZone: tz || undefined,
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

const fmtCountdown = secs => {
  if (!Number.isFinite(secs)) return '';
  let s = Math.max(0, Math.floor(secs));

  const d = Math.floor(s / 86400);
  s %= 86400;
  const h = Math.floor(s / 3600);
  s %= 3600;
  const m = Math.floor(s / 60);
  const r = s % 60;

  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h || d) parts.push(`${h}h`);
  if (m || h || d) parts.push(`${m}m`);
  parts.push(`${r}s`);
  return parts.join(' ');
};

const MiniPill = ({ children }) => (
  <View style={styles.miniPill}>{children}</View>
);

/** ------------------------------
 * ✅ saved_answer helpers
 * ------------------------------ */
const normType = t => String(t || '').toLowerCase();

const getSelectedAnswerText = question => {
  const selected = Array.isArray(question?.student?.selected)
    ? question.student.selected.map(String)
    : [];

  const options = Array.isArray(question?.options) ? question.options : [];

  if (selected.length > 0) {
    return selected
      .map(selectedId => {
        const option = options.find(
          item => String(item?.id) === String(selectedId),
        );

        if (!option) {
          return selectedId;
        }

        return `${selectedId} — ${option?.text || ''}`;
      })
      .join(', ');
  }

  const textAnswer = question?.student?.text;

  if (
    textAnswer !== null &&
    textAnswer !== undefined &&
    String(textAnswer).trim()
  ) {
    return String(textAnswer);
  }

  return 'No answer provided';
};

const hasAnswerValue = v => {
  if (Array.isArray(v)) return v.length > 0;
  if (v === null || v === undefined) return false;
  return String(v).trim().length > 0;
};

const valueFromSavedAnswer = (qType, saved) => {
  const t = normType(qType);
  if (!saved) return t === 'mcq_multi' ? [] : '';

  if (t === 'mcq_single') return saved?.choice ?? '';
  if (t === 'mcq_multi')
    return Array.isArray(saved?.choices) ? saved.choices : [];
  return saved?.text ?? '';
};

const savedAnswerFromValue = (qType, value) => {
  const t = normType(qType);

  if (t === 'mcq_single') return { choice: String(value ?? '') };

  if (t === 'mcq_multi') {
    const arr = Array.isArray(value) ? value : [];
    return { choices: arr.map(x => String(x)) };
  }

  return { text: String(value ?? '') };
};

const getEvaluationNotes = result => {
  const notes =
    result?.attempt?.review_notes || result?.attempt?.notes_for_student || '';

  return String(notes).trim();
};

export default function HomeworkDetail() {
  const route = useRoute();
  const id = route?.params?.id;
  const hwCard = route?.params?.hw || {};
  const tzFromList = route?.params?.timezone || null;

  const mounted = useRef(true);

  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [attemptResult, setAttemptResult] = useState(null);

  const [pane, setPane] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [countdown, setCountdown] = useState(null); // seconds

  // answers: { [qid]: { type, value, markReview } }
  const [answers, setAnswers] = useState({});
  const [dirty, setDirty] = useState(false);

  const title = pane?.name || hwCard?.name || 'Homework';
  const subject = pane?.course_title || hwCard?.course_title || '';
  const className = pane?.class_name || hwCard?.class_name || '';
  const status = (pane?.status || hwCard?.status || '').toLowerCase();
  const tz = pane?.ui_timezone || tzFromList || null;
  const due = pane?.ends_at || hwCard?.ends_at || null;

  const attemptId =
    route?.params?.attemptId ??
    route?.params?.attempt_id ??
    pane?.attempt_id ??
    pane?.attempt?.id ??
    null;

  const dueTimestamp = due ? new Date(due).getTime() : NaN;

  const dueOver =
    Number.isFinite(dueTimestamp) &&
    (Number.isFinite(countdown) ? countdown <= 0 : dueTimestamp <= Date.now());

  const isReadOnly = submitted || dueOver;

  const [newUploads, setNewUploads] = useState([]);
  const [answerFiles, setAnswerFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadResetKey, setUploadResetKey] = useState(0);

  const evaluationNotes = getEvaluationNotes(attemptResult);

  const ANSWER_FILES_PATH = `/api/homeworks/${encodeURIComponent(
    id,
  )}/answer-files`;
  const ANSWER_FILES_URL = absoluteUrl(ANSWER_FILES_PATH);

  const UPLOAD_FIELD_NAME = 'files[]';

  const normalizePathForBlob = async uri => {
    if (!uri) return null;
    if (uri.startsWith('file://')) return uri.replace('file://', '');

    try {
      const stat = await RNFetchBlob.fs.stat(uri);
      if (stat?.path) return stat.path;
    } catch (_) {}

    return uri;
  };

  const uploadPickedFilesNow = async (pickedFiles = []) => {
    if (isReadOnly) {
      return;
    }
    if (!id) return;
    if (!Array.isArray(pickedFiles) || pickedFiles.length === 0) return;

    try {
      setUploadingFiles(true);

      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      for (const f of pickedFiles) {
        const path = await normalizePathForBlob(f.uri);
        if (!path) continue;

        await RNFetchBlob.fetch(
          'POST',
          ANSWER_FILES_URL,
          {
            ...headers,
            'Content-Type': 'multipart/form-data',
          },
          [
            {
              name: UPLOAD_FIELD_NAME,
              filename: f.name || 'file',
              type: f.type || 'application/octet-stream',
              data: RNFetchBlob.wrap(path),
            },
          ],
        );
      }

      await fetchAnswerFiles();
      setUploadResetKey(k => k + 1);
    } catch (e) {
      Alert.alert('Upload failed', e?.message || 'Could not upload files.');
    } finally {
      setUploadingFiles(false);
    }
  };

  const questions = useMemo(() => {
    const list = Array.isArray(pane?.questions)
      ? pane.questions
      : Array.isArray(pane?.items)
      ? pane.items
      : Array.isArray(pane?.data)
      ? pane.data
      : [];
    return list;
  }, [pane]);

  const parseAttachments = res => {
    const list = Array.isArray(res?.attachments)
      ? res.attachments
      : Array.isArray(res?.items)
      ? res.items
      : Array.isArray(res?.data)
      ? res.data
      : [];
    return list.map(a => ({
      id: a?.id ?? a?.uuid ?? String(a?.name || a?.filename || 'file'),
      name: a?.name || a?.filename || a?.title || 'Attachment',
      url: a?.url || a?.link || a?.download_url || a?.href || null,
      dl: a?.dl || null,
      mime: a?.mime || 'application/octet-stream',
    }));
  };

  const parseAnswerFiles = res => {
    const list = Array.isArray(res?.files)
      ? res.files
      : Array.isArray(res?.uploaded)
      ? res.uploaded
      : [];

    return list.map(f => ({
      id: f?.id ?? String(f?.name || Math.random()),
      name: f?.name || 'File',
      url: f?.url || null,
      dl: f?.dl || null,
      mime: f?.mime || 'application/octet-stream',
      size: Number(f?.size || 0),
    }));
  };

  const fetchAnswerFiles = useCallback(async () => {
    if (!id) return;

    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const resp = await RNFetchBlob.fetch('GET', ANSWER_FILES_URL, headers);

      let json;
      try {
        json = resp.json();
      } catch {
        json = JSON.parse(resp.data || '{}');
      }

      setAnswerFiles(parseAnswerFiles(json));
    } catch (e) {
      Alert.alert('Answer files', e?.message || 'Failed to load answer files');
    }
  }, [id, ANSWER_FILES_URL]);

  const deleteAnswerFile = async fileId => {
    if (isReadOnly) {
      return;
    }
    if (!id || !fileId) return;

    const url = absoluteUrl(
      `/api/homeworks/${encodeURIComponent(
        id,
      )}/answer-files/${encodeURIComponent(fileId)}`,
    );

    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const resp = await RNFetchBlob.fetch('DELETE', url, headers);

      const status = resp?.info?.().status;
      if (status && status >= 400) {
        throw new Error(`Delete failed (HTTP ${status})`);
      }

      await fetchAnswerFiles();
    } catch (e) {
      Alert.alert('Delete failed', e?.message || 'Unable to delete file.');
    }
  };

  const confirmDeleteAnswerFile = file => {
    Alert.alert('Delete file', 'Are you sure you want to delete this file?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteAnswerFile(file?.id),
      },
    ]);
  };

  const applyAttemptResultAnswers = result => {
    const resultQuestions = Array.isArray(result?.questions)
      ? result.questions
      : [];

    if (resultQuestions.length === 0) {
      return;
    }

    const resultAnswers = {};

    resultQuestions.forEach(question => {
      const qid = question?.question_id;

      if (qid === null || qid === undefined) {
        return;
      }

      const qType = normType(question?.type);

      const selected = Array.isArray(question?.student?.selected)
        ? question.student.selected.map(String)
        : [];

      let value = '';

      if (qType === 'mcq_multi') {
        value = selected;
      } else if (qType === 'mcq_single' || qType === 'mcq') {
        value = selected.length > 0 ? selected[0] : '';
      } else {
        value = question?.student?.text ?? '';
      }

      resultAnswers[qid] = {
        type: qType,
        value,
        markReview: false,
      };
    });

    setAnswers(previous => ({
      ...previous,
      ...resultAnswers,
    }));
  };

  const fetchAttemptResult = useCallback(async () => {
    if (!id || !attemptId) {
      return;
    }

    try {
      const response = await api(
        `/api/results/homeworks/${encodeURIComponent(
          id,
        )}/attempts/${encodeURIComponent(attemptId)}`,
      );

      if (!mounted.current) {
        return;
      }

      setAttemptResult(response);

      if (response?.attempt?.submitted_at) {
        setSubmitted(true);
      }

      applyAttemptResultAnswers(response);
    } catch (error) {
      console.log('Homework attempt result error:', error);
    }
  }, [id, attemptId]);

  const load = useCallback(async () => {
    if (!id) {
      Alert.alert('Homework', 'Missing homework id');
      return;
    }
    try {
      setBusy(true);
      const [p, atts] = await Promise.all([
        api(`/api/homeworks/${encodeURIComponent(id)}/pane/state`),
        api(`/api/homeworks/${encodeURIComponent(id)}/attachments`),
      ]);

      if (!mounted.current) return;

      setPane(p || {});
      setAttachments(parseAttachments(atts));
      const alreadySubmitted =
        p?.is_submitted === true ||
        p?.is_submitted === 1 ||
        Boolean(p?.submitted_at) ||
        String(p?.status || '').toLowerCase() === 'submitted';

      setSubmitted(alreadySubmitted);

      await fetchAnswerFiles();

      /** ✅ pre-seed from API saved_answer + is_marked */
      const initial = {};
      const qs = Array.isArray(p?.questions) ? p.questions : [];

      qs.forEach((q, idx) => {
        const qid = q?.id ?? String(idx);
        const qType = normType(q?.type || q?.kind || q?.question_type);

        initial[qid] = {
          type: qType,
          value: valueFromSavedAnswer(qType, q?.saved_answer),
          markReview: !!q?.is_marked || !!q?.mark_for_review,
        };
      });

      setAnswers(initial);

      const rawSecs = p?.remaining_seconds ?? p?.seconds_remaining ?? null;
      if (typeof rawSecs === 'number') setCountdown(rawSecs);
      else if (due) {
        const diff = Math.floor((new Date(due).getTime() - Date.now()) / 1000);
        setCountdown(diff > 0 ? diff : 0);
      }
    } catch (e) {
      if (mounted.current)
        Alert.alert('Error', e?.message || 'Failed to load homework');
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, [id, due, fetchAnswerFiles]);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
    };
  }, [load]);

  useEffect(() => {
    if (!isReadOnly || !attemptId) {
      return;
    }

    fetchAttemptResult();
  }, [isReadOnly, attemptId, fetchAttemptResult]);

  useEffect(() => {
    if (countdown == null) return;
    const t = setInterval(() => {
      setCountdown(prev => (prev == null ? prev : Math.max(0, prev - 1)));
    }, 1000);
    return () => clearInterval(t);
  }, [countdown != null]);

  const downloadAttachment = async att => {
    try {
      let url = att?.dl || att?.url;
      if (!url) {
        Alert.alert('Download', 'No download URL found.');
        return;
      }
      if (!att?.dl && !url.includes('download=1'))
        url += (url.includes('?') ? '&' : '?') + 'download=1';

      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (Platform.OS === 'android') {
        await RNFetchBlob.config({
          addAndroidDownloads: {
            useDownloadManager: true,
            title: att?.name || 'attachment',
            description: 'Downloading attachment',
            mime: att?.mime || 'application/octet-stream',
            mediaScannable: true,
            notification: true,
          },
        }).fetch('GET', url, headers);
      } else {
        const path = `${RNFetchBlob.fs.dirs.DocumentDir}/${
          att?.name || 'attachment'
        }`;
        const res = await RNFetchBlob.config({ path }).fetch(
          'GET',
          url,
          headers,
        );
        RNFetchBlob.ios.openDocument(res.path());
      }
    } catch (e) {
      Alert.alert(
        'Download failed',
        e?.message || 'Unable to download attachment.',
      );
    }
  };

  /** ------------------------------
   * ✅ Answer setters + payload
   * ------------------------------ */
  const setAnswer = (qid, type, value) => {
    if (isReadOnly) {
      return;
    }

    setAnswers(prev => {
      const next = {
        ...(prev || {}),
      };

      const prevMR = !!next[qid]?.markReview;

      next[qid] = {
        type,
        value,
        markReview: prevMR,
      };

      return next;
    });

    setDirty(true);
  };

  const toggleMarkReview = qid => {
    if (isReadOnly) {
      return;
    }

    setAnswers(prev => {
      const cur = prev[qid] || {
        type: 'unknown',
        value: '',
        markReview: false,
      };

      return {
        ...prev,
        [qid]: {
          ...cur,
          markReview: !cur.markReview,
        },
      };
    });

    setDirty(true);
  };

  const toQuestionId = qid => {
    const n = Number(qid);
    return Number.isFinite(n) ? n : qid;
  };

  const buildSingleAnswerPayload = (qid, qType, ansObj) => {
    const type = String(qType || '').toLowerCase();
    const is_marked = !!ansObj?.markReview;

    // mcq_multi => selected_options: ["0","1"]
    if (type === 'mcq_multi') {
      const arr = Array.isArray(ansObj?.value) ? ansObj.value : [];
      return {
        question_id: toQuestionId(qid),
        is_marked,
        selected_options: arr.map(String),
      };
    }

    // mcq_single => selected_options: ["1"]
    if (type === 'mcq_single' || type === 'mcq') {
      const v = ansObj?.value;
      const selected_options =
        v === null || v === undefined || String(v).trim() === ''
          ? []
          : [String(v)];

      return {
        question_id: toQuestionId(qid),
        is_marked,
        selected_options,
      };
    }

    // subjective/text => text_answer: "..."
    return {
      question_id: toQuestionId(qid),
      is_marked,
      text_answer: String(ansObj?.value ?? ''),
    };
  };

  const persistAllAnswers = async () => {
    const answersUrl = `/api/homeworks/${encodeURIComponent(id)}/answers`;

    for (const q of questions) {
      const qid = q?.id;

      if (qid === null || qid === undefined) {
        continue;
      }

      const qType = q?.type || q?.kind || q?.question_type || 'subjective';

      const normalizedType = String(qType || '').toLowerCase();

      const answer = answers?.[qid] || {
        type: normalizedType,
        value: normalizedType === 'mcq_multi' ? [] : '',
        markReview: false,
      };

      const payload = buildSingleAnswerPayload(qid, qType, answer);

      console.log('Saving homework answer:', payload);

      const response = await api(answersUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response?.ok !== true) {
        throw new Error(`Could not save answer for question ${qid}.`);
      }
    }
  };

  const saveAll = async () => {
    if (isReadOnly) {
      return;
    }

    try {
      setSaving(true);

      await persistAllAnswers();

      setDirty(false);

      Alert.alert('Saved', 'All answers saved.');
    } catch (e) {
      Alert.alert('Save failed', e?.message || 'Could not save answers.');
    } finally {
      setSaving(false);
    }
  };

  const submitHomework = async () => {
    if (isReadOnly || submitting) {
      return;
    }

    Alert.alert(
      'Submit Homework',
      'Submit your homework? You will not be able to edit it after submission.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          style: 'destructive',

          onPress: async () => {
            try {
              setSubmitting(true);

              /*
               * Save every question first.
               */
              await persistAllAnswers();

              /*
               * Final homework submission.
               */
              const response = await api(
                `/api/homeworks/${encodeURIComponent(id)}/submit`,
                {
                  method: 'POST',

                  body: JSON.stringify({}),
                },
              );

              if (response?.ok !== true) {
                throw new Error('Could not submit homework.');
              }

              setDirty(false);

              /*
               * Immediately lock the page.
               * Do not navigate away.
               */
              setSubmitted(true);
              await load();
            } catch (e) {
              console.log('Submit homework error:', e);

              Alert.alert(
                'Submit failed',
                e?.message || 'Could not submit homework.',
              );
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
    );
  };

  if (busy) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  const evaluatedQuestions = Array.isArray(attemptResult?.questions)
    ? attemptResult.questions
    : [];

  const hasSubmittedAttempt =
    submitted && Boolean(attemptResult?.attempt?.submitted_at);

  const isAttemptEvaluated =
    hasSubmittedAttempt && evaluatedQuestions.length > 0;

  const canSubmit = questions.length > 0 && !isReadOnly;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header row with actions */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>{/* HomeworkDetail */}</Text>
          {/* {!!pane?.ui_timezone && (
            <Text style={styles.timezoneText}>TZ: {pane.ui_timezone}</Text>
          )} */}
        </View>
        {!isReadOnly ? (
          <View style={styles.headerActions}>
            <Pressable
              disabled={!dirty || saving || submitting}
              onPress={saveAll}
              style={({ pressed }) => [
                styles.actionButton,

                pressed &&
                  dirty &&
                  !saving &&
                  !submitting &&
                  styles.actionButtonPressed,

                (!dirty || saving || submitting) && styles.actionButtonDisabled,
              ]}
            >
              {saving ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.actionButtonText}>Save All</Text>
              )}
            </Pressable>

            <Pressable
              disabled={!canSubmit || submitting || saving}
              onPress={submitHomework}
              style={({ pressed }) => [
                styles.submitButton,

                pressed &&
                  canSubmit &&
                  !submitting &&
                  !saving &&
                  styles.submitButtonPressed,

                (!canSubmit || submitting || saving) &&
                  styles.submitButtonDisabled,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color={BG} />
              ) : (
                <Text style={styles.submitButtonText}>Submit Homework</Text>
              )}
            </Pressable>
          </View>
        ) : null}
      </View>

      {/* Summary card */}
      <View style={styles.card}>
        <View style={styles.summaryTopRow}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle} numberOfLines={1}>
              {title}
            </Text>

            {(!!subject || Number.isFinite(countdown)) && (
              <View style={styles.summarySubjectRow}>
                {!!subject && (
                  <Text style={styles.summarySubject} numberOfLines={1}>
                    {subject}
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.summaryMetaRow}>
            {questions.length > 0 && (
              <Pill label={`Questions: ${questions.length}`} />
            )}

            {!!status && <Pill label={status} />}

            {!!className && <Text style={styles.className}>{className}</Text>}
          </View>
        </View>

        <View style={styles.dueRow}>
          <Text style={styles.dueText} numberOfLines={1}>
            <Text style={styles.dueLabel}>Due: </Text>

            {fmtAbsTZ(due, tz)}
          </Text>

          {Number.isFinite(countdown) && (
            <MiniPill>
              <MaterialCommunityIcons
                name="timer-outline"
                color={MUTED}
                size={14}
              />

              <Text style={styles.countdownText}>
                {fmtCountdown(countdown)}
              </Text>
            </MiniPill>
          )}
        </View>

        <Text style={styles.lateSubmissionText}>
          {submitted
            ? 'Homework submitted.'
            : dueOver
            ? 'Submission closed because the due date has passed.'
            : 'Submit your homework before the due date.'}
        </Text>
      </View>

      {/* Attachments */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Attachments</Text>

        {attachments.length === 0 ? (
          <Text style={styles.emptyText}>No attachments.</Text>
        ) : (
          attachments.map(att => (
            <View key={`att-${att.id}`} style={styles.attachmentRow}>
              <Text style={styles.attachmentName} numberOfLines={1}>
                {att.name}
              </Text>

              <Pressable
                onPress={() => downloadAttachment(att)}
                style={({ pressed }) => [
                  styles.downloadButton,
                  pressed && styles.downloadButtonPressed,
                ]}
              >
                <Text style={styles.downloadButtonText}>Download</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>

      {!isReadOnly ? (
        <AttachOptionalSection
          BG={BG}
          CARD={CARD}
          TEXT={TEXT}
          MUTED={MUTED}
          BORDER={BORDER}
          DANGER={DANGER}
          resetKey={uploadResetKey}
          uploading={uploadingFiles}
          onPickedFiles={async files => {
            setNewUploads(files);

            await uploadPickedFilesNow(files);
          }}
        />
      ) : null}

      {/* Answer Files */}
      <View style={styles.card}>
        <View style={styles.answerFilesHeader}>
          <Text style={styles.answerFilesTitle}>
            Answer Files ({answerFiles.length})
          </Text>

          {!isReadOnly ? (
            <Pressable onPress={fetchAnswerFiles} style={styles.refreshButton}>
              <MaterialCommunityIcons name="refresh" size={18} color={MUTED} />
            </Pressable>
          ) : null}
        </View>

        {answerFiles.length === 0 ? (
          <Text style={styles.answerEmptyText}>No uploaded files yet.</Text>
        ) : (
          answerFiles.map(f => (
            <View key={`af-${f.id}`} style={styles.answerFileRow}>
              <Text style={styles.answerFileName} numberOfLines={1}>
                {f.name}
              </Text>

              {!isReadOnly ? (
                <Pressable
                  onPress={() => confirmDeleteAnswerFile(f)}
                  style={({ pressed }) => [
                    styles.deleteButton,

                    pressed && styles.deleteButtonPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={20}
                    color={DANGER}
                  />
                </Pressable>
              ) : null}
            </View>
          ))
        )}
      </View>

      {isAttemptEvaluated ? (
        <View style={styles.evaluatedCard}>
          <View style={styles.evaluatedHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.evaluatedTitle}>Evaluated Answer Sheet</Text>

              <Text style={styles.evaluatedNotes}>
                {evaluationNotes || 'No notes were provided.'}
              </Text>
            </View>

            <View style={styles.evaluatedBadge}>
              <Text style={styles.evaluatedBadgeText}>Evaluated</Text>
            </View>
          </View>

          {evaluatedQuestions.map((question, index) => {
            const awardedMarks = Number(question?.grading?.awarded_marks ?? 0);

            const fullMarks = Number(question?.full_marks ?? 0);

            const isCorrect = question?.auto?.is_correct;

            const selectedText = getSelectedAnswerText(question);

            const examinerNotes = String(
              question?.grading?.examiner_notes || '',
            ).trim();

            return (
              <View
                key={`evaluated-${question.question_id}`}
                style={[
                  styles.evaluatedQuestion,

                  index !== evaluatedQuestions.length - 1 &&
                    styles.evaluatedQuestionDivider,
                ]}
              >
                <View style={styles.evaluatedQuestionHeader}>
                  <Text style={styles.evaluatedQuestionTitle}>
                    {index + 1}. {question?.text || 'Question'}
                  </Text>

                  {isCorrect === true ? (
                    <View style={styles.correctBadge}>
                      <Text style={styles.correctBadgeText}>Correct</Text>
                    </View>
                  ) : isCorrect === false ? (
                    <View style={styles.incorrectBadge}>
                      <Text style={styles.incorrectBadgeText}>Incorrect</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.evaluatedAnswer}>
                  Selected: {selectedText}
                </Text>

                <Text style={styles.evaluatedMarks}>
                  Marks: {awardedMarks} / {fullMarks}
                </Text>

                {examinerNotes ? (
                  <View style={styles.examinerNoteBox}>
                    <Text style={styles.examinerNoteLabel}>Examiner Note</Text>

                    <Text style={styles.examinerNoteText}>{examinerNotes}</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : null}

      {/* Questions (interactive) */}
      {!isAttemptEvaluated ? (
        <View style={styles.questionCard}>
          {questions.length === 0 ? (
            <Text style={{ color: MUTED }}>
              No questions for this homework.
            </Text>
          ) : (
            questions.map((q, idx) => {
              const qType = normType(q?.type || q?.kind || q?.question_type);
              const marks = q?.marks ?? q?.points ?? q?.score ?? '';
              const prompt =
                q?.text || q?.prompt || q?.title || q?.question || '';
              const options = Array.isArray(q?.options)
                ? q.options
                : Array.isArray(q?.choices)
                ? q.choices
                : [];

              const qid = q?.id ?? String(idx);
              const a = answers[qid] || {
                type: qType,
                value: qType === 'mcq_multi' ? [] : '',
                markReview: false,
              };

              const isMulti = qType === 'mcq_multi';

              return (
                <View
                  key={`q-${qid}`}
                  style={[
                    styles.questionBlock,

                    idx !== questions.length - 1 && styles.questionDivider,
                  ]}
                >
                  {/* Header line + Mark for review */}
                  <View style={styles.questionHeader}>
                    <View style={styles.questionTitleGroup}>
                      <Text style={styles.questionTitle}>
                        {`Q${idx + 1}`}{' '}
                        <Text style={styles.questionType}>
                          {qType || 'question'}
                        </Text>
                      </Text>

                      {marks !== '' && (
                        <View style={styles.marksPill}>
                          <Text style={styles.marksText}>★ {marks}</Text>
                        </View>
                      )}
                    </View>

                    {/* Mark for review control */}
                    <Pressable
                      onPress={() => toggleMarkReview(qid)}
                      disabled={isReadOnly}
                      style={[
                        styles.reviewControl,

                        isReadOnly && styles.reviewControlDisabled,
                      ]}
                    >
                      <View
                        style={[
                          styles.reviewDot,

                          a.markReview && styles.reviewDotActive,
                        ]}
                      />

                      <View
                        style={[
                          styles.reviewCheckbox,

                          a.markReview && styles.reviewCheckboxActive,
                        ]}
                      >
                        {a.markReview ? (
                          <View style={styles.reviewCheckboxInner} />
                        ) : null}
                      </View>

                      <Text style={styles.reviewText}>Mark for review</Text>
                    </Pressable>
                  </View>

                  {!!prompt && <Text style={styles.promptText}>{prompt}</Text>}

                  {/* MCQ */}
                  {options.length > 0 ? (
                    <View>
                      {options.map((op, oi) => {
                        const optId = op?.id ?? oi;
                        const label = op?.text || op?.title || String(op);

                        const selected = isMulti
                          ? Array.isArray(a.value)
                            ? a.value.map(String).includes(String(optId))
                            : false
                          : String(a.value) === String(optId);

                        const onPick = () => {
                          if (isMulti) {
                            const cur = Array.isArray(a.value)
                              ? a.value.map(String)
                              : [];
                            const sid = String(optId);
                            const nextArr = cur.includes(sid)
                              ? cur.filter(x => x !== sid)
                              : [...cur, sid];
                            setAnswer(qid, qType, nextArr);
                          } else {
                            setAnswer(
                              qid,
                              qType || 'mcq_single',
                              String(optId),
                            );
                          }
                        };

                        return (
                          <Pressable
                            key={`q${qid}-opt-${optId}`}
                            onPress={onPick}
                            disabled={isReadOnly}
                            style={({ pressed }) => [
                              styles.optionButton,

                              selected && styles.optionButtonSelected,

                              pressed &&
                                !isReadOnly &&
                                styles.optionButtonPressed,

                              isReadOnly && styles.optionButtonDisabled,
                            ]}
                          >
                            <View
                              style={[
                                styles.optionIndicator,

                                isMulti
                                  ? styles.optionIndicatorMulti
                                  : styles.optionIndicatorSingle,

                                selected && styles.optionIndicatorSelected,
                              ]}
                            >
                              {selected ? (
                                <View
                                  style={[
                                    styles.optionIndicatorInner,

                                    isMulti
                                      ? styles.optionIndicatorInnerMulti
                                      : styles.optionIndicatorInnerSingle,
                                  ]}
                                />
                              ) : null}
                            </View>

                            <Text style={styles.optionText}>{label}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : (
                    // Subjective / text
                    <View style={styles.subjectiveBox}>
                      <TextInput
                        value={String(a.value ?? '')}
                        onChangeText={text =>
                          setAnswer(qid, qType || 'subjective', text)
                        }
                        editable={!isReadOnly}
                        multiline
                        placeholder="Type your answer…"
                        placeholderTextColor="#64748B"
                        style={[
                          styles.subjectiveInput,

                          isReadOnly && styles.subjectiveInputDisabled,
                        ]}
                      />
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      ) : null}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}
