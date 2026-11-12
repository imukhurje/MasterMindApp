import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Video from 'react-native-video';
import { WebView } from 'react-native-webview';
import { api, getBase } from '../../api/client';
import { CourseContentSection } from './../CourseOverview/OnlineCourseOverviewLanding';
import LearningHelperPanel from '../../screens/CourseOverview/LearningHelperPanel';
import Orientation from 'react-native-orientation-locker';

const getYouTubeEmbedUrl = rawUrl => {
  if (!rawUrl) return null;

  try {
    let videoId = '';
    let startSeconds = 0;

    // t=5s / t=120
    const tMatch = rawUrl.match(/[?&]t=(\d+)/);
    if (tMatch) {
      startSeconds = parseInt(tMatch[1], 10);
    }

    // https://youtu.be/VIDEO_ID
    const shortMatch = rawUrl.match(/youtu\.be\/([^?&]+)/);
    // https://www.youtube.com/watch?v=VIDEO_ID
    const longMatch = rawUrl.match(/[?&]v=([^&]+)/);

    if (shortMatch) videoId = shortMatch[1];
    else if (longMatch) videoId = longMatch[1];

    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId}?controls=1&autoplay=0${
      startSeconds ? `&start=${startSeconds}` : ''
    }`;
  } catch (e) {
    console.log('getYouTubeEmbedUrl error', e);
    return null;
  }
};

const OnlineCourseWorkspaceScreen = ({ route, navigation }) => {
  const { courseId, slug, initialMaterialId } = route?.params || {};
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [isDocFullscreen, setIsDocFullscreen] = useState(false);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [expandedChapters, setExpandedChapters] = useState([]);
  const [activeMaterial, setActiveMaterial] = useState(null);

  // helper panel state
  const [helperTab, setHelperTab] = useState('notes');

  // 🔹 history (read-only)
  const [notesHistory, setNotesHistory] = useState('');
  const [chatHistory, setChatHistory] = useState('');

  // 🔹 draft (user typing now)
  const [notes, setNotes] = useState('');
  const [question, setQuestion] = useState('');

  const findFirstMaterial = data => {
    for (const ch of data?.chapters || []) {
      if (ch.materials && ch.materials.length > 0) {
        return ch.materials[0];
      }
    }
    return null;
  };

  const findMaterialById = (data, materialId) => {
    if (!materialId) return null;
    for (const ch of data?.chapters || []) {
      for (const m of ch.materials || []) {
        if (m.id === materialId) return m;
      }
    }
    return null;
  };

  const fetchCourse = useCallback(async () => {
    if (!courseId) {
      setError('No course id provided.');
      setLoading(false);
      return;
    }

    try {
      setError('');
      setLoading(true);

      const data = await api(`/api/online/course/${courseId}`, {
        method: 'GET',
      });

      setCourse(data || null);

      const firstChapterId = data?.chapters?.[0]?.id;
      if (firstChapterId) {
        setExpandedChapters([firstChapterId]);
      }

      let initial = null;
      if (initialMaterialId) {
        initial = findMaterialById(data, initialMaterialId);
      }
      if (!initial) {
        initial = findFirstMaterial(data);
      }
      setActiveMaterial(initial);
    } catch (e) {
      console.log('fetchCourse workspace error', e);
      setError('Failed to load course.');
    } finally {
      setLoading(false);
    }
  }, [courseId, initialMaterialId]);

  // 🔹 NOTES HISTORY: { notes: [ { id, content, created_at }, ... ] }
  const fetchNotes = useCallback(async () => {
    if (!courseId) return;

    try {
      const data = await api(`/api/online/course/${courseId}/notes`, {
        method: 'GET',
      });

      const arr = data?.notes || [];

      if (Array.isArray(arr) && arr.length > 0) {
        const combined = arr
          .map(n => {
            const d = n.created_at ? new Date(n.created_at) : null;
            const dateStr = d
              ? d.toLocaleString('en-GB', { hour12: false })
              : '';
            return dateStr ? `${dateStr}\n${n.content}` : n.content;
          })
          .join('\n\n');

        setNotesHistory(combined);
      } else {
        setNotesHistory('');
      }
    } catch (e) {
      console.log('fetchNotes error', e);
    }
  }, [courseId]);

  // 🔹 CHAT HISTORY: { ok: true, messages: [ { content, created_at }, ... ] }
  const fetchAskMessages = useCallback(async () => {
    if (!courseId) return;

    try {
      const data = await api(
        `/api/online/course/${courseId}/chat/messages?other_user_id=1`,
        {
          method: 'GET',
        },
      );

      const msgs = data?.messages || [];
      if (msgs.length > 0) {
        const combined = msgs
          .map(m => {
            const d = m.created_at ? new Date(m.created_at) : null;
            const dateStr = d
              ? d.toLocaleString('en-GB', { hour12: false })
              : '';
            return dateStr ? `${dateStr}\n${m.content}` : m.content;
          })
          .join('\n\n');

        setChatHistory(combined);
      } else {
        setChatHistory('');
      }
    } catch (e) {
      console.log('fetchAskMessages error', e);
    }
  }, [courseId]);

  useEffect(() => {
    console.log('OnlineCourseWorkspaceScreen params ==>', {
      courseId,
      slug,
      initialMaterialId,
    });
    fetchCourse();
  }, [courseId, slug, initialMaterialId, fetchCourse]);

  useEffect(() => {
    if (!courseId) return;
    fetchNotes();
    fetchAskMessages();
  }, [courseId, fetchNotes, fetchAskMessages]);

  const toggleChapter = chapterId => {
    setExpandedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId],
    );
  };

  const handleSelectMaterial = (material, chapter) => {
    const type = (material.type || '').toLowerCase();

    // QUIZ: navigate + close currently open viewer
    if (type === 'quiz') {
      const quizId = material.quiz_id || material.id;

      setActiveMaterial(null);
      setIsDocFullscreen(false);
      setIsVideoFullscreen(false);

      navigation.navigate('OnlineQuizScreen', { quizId });
      return;
    }

    // NORMAL materials (video, pdf, html...)
    setActiveMaterial(material);

    setExpandedChapters(prev =>
      prev.includes(chapter.id) ? prev : [...prev, chapter.id],
    );
  };

  const handleSaveNotes = async () => {
    if (!courseId) return;
    if (!notes.trim()) return; // khaali note pathabo na

    try {
      const payload = {
        content: notes.trim(),
      };

      await api(`/api/online/course/${courseId}/notes`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      await fetchNotes();
      setNotes('');
    } catch (e) {
      console.log('handleSaveNotes error', e);
    }
  };

  const handleSendQuestion = async () => {
    if (!courseId) return;
    if (!question.trim()) return; // khaali message pathabo na

    try {
      const payload = {
        message: question.trim(),
      };

      await api(`/api/online/course/${courseId}/chat/send`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      await fetchAskMessages();

      setQuestion('');
    } catch (e) {
      console.log('handleSendQuestion error', e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.centerText}>Loading course...</Text>
      </View>
    );
  }

  if (error || !course) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>{error || 'Course not found.'}</Text>
      </View>
    );
  }

  const handleEnterFullscreen = () => {
    setIsVideoFullscreen(true);
    Orientation.lockToLandscape();
  };

  const handleExitFullscreen = () => {
    Orientation.lockToPortrait();
    setIsVideoFullscreen(false);
  };

  const handleToggleDocFullscreen = () => {
    setIsDocFullscreen(prev => !prev);
  };

  const canAccess = course?.can_access && !course?.access_locked;

  return (
    <View style={styles.container}>
      <View style={[styles.topSection, isDocFullscreen && { flex: 1 }]}>
        <View style={[styles.viewerBox, isDocFullscreen && { height: '100%' }]}>
          <MaterialViewer
            material={activeMaterial}
            onEnterFullscreen={handleEnterFullscreen}
            onExitFullscreen={handleExitFullscreen}
            isDocFullscreen={isDocFullscreen}
            onToggleDocFullscreen={handleToggleDocFullscreen}
          />
        </View>

        {!isDocFullscreen && (
          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            <CourseContentSection
              chapters={course.chapters || []}
              expandedChapters={expandedChapters}
              onToggleChapter={toggleChapter}
              onSelectMaterial={handleSelectMaterial}
              activeMaterialId={activeMaterial?.id}
              canAccess={canAccess}
            />
          </ScrollView>
        )}
      </View>

      {!isDocFullscreen && (
        <LearningHelperPanel
          activeTab={helperTab}
          onTabChange={setHelperTab}
          // history (read-only)
          notesHistory={notesHistory}
          chatHistory={chatHistory}
          // draft (editable)
          notes={notes}
          onNotesChange={setNotes}
          question={question}
          onQuestionChange={setQuestion}
          onSendQuestion={handleSendQuestion}
          showAsk={true}
          onSaveNotes={handleSaveNotes}
        />
      )}
    </View>
  );
};

/**
 * Dynamic material viewer
 */
const MaterialViewer = ({
  material,
  onEnterFullscreen,
  onExitFullscreen,
  isDocFullscreen,
  onToggleDocFullscreen,
}) => {
  if (!material) {
    return (
      <View style={styles.viewerPlaceholder}>
        <Text style={styles.viewerPlaceholderText}>
          Select a lesson to start.
        </Text>
      </View>
    );
  }

  const type = (material.type || '').toLowerCase();

  const url =
    material.stream_url ||
    material.file_url ||
    material.url ||
    material.external_url ||
    null;

  const htmlContent = material.html || material.html_body || null;
  const textContent = material.text || material.description || material.title;

  if (type === 'video' || type === 'mp4') {
    if (!url) {
      return (
        <View style={styles.viewerPlaceholder}>
          <Text style={styles.viewerPlaceholderText}>Video URL not found.</Text>
        </View>
      );
    }

    return (
      <Video
        source={{ uri: url }}
        style={styles.video}
        controls
        resizeMode="contain"
        paused={false}
        fullscreenAutorotate
        fullscreenOrientation="landscape"
        onFullscreenPlayerWillPresent={onEnterFullscreen}
        onFullscreenPlayerWillDismiss={onExitFullscreen}
      />
    );
  }

  if (type === 'youtube') {
    const rawUrl = material.external_url || material.url || url;
    const embedUrl = getYouTubeEmbedUrl(rawUrl);

    if (!embedUrl) {
      return (
        <View style={styles.viewerPlaceholder}>
          <Text style={styles.viewerPlaceholderText}>
            YouTube video link not available.
          </Text>
        </View>
      );
    }

    return (
      <WebView
        style={styles.webview}
        source={{
          uri: embedUrl,
          headers: {
            Referer: getBase().endsWith('/') ? getBase() : `${getBase()}/`,
          },
        }}
        javaScriptEnabled
        domStorageEnabled
        allowsFullscreenVideo
      />
    );
  }

  // if (type === 'pdf') {
  //   if (!url) {
  //     return (
  //       <View style={styles.viewerPlaceholder}>
  //         <Text style={styles.viewerPlaceholderText}>
  //           PDF link not available.
  //         </Text>
  //       </View>
  //     );
  //   }
  //   return (
  //     <DocContainer
  //       title={material.title}
  //       isDocFullscreen={isDocFullscreen}
  //       onToggle={onToggleDocFullscreen}
  //     >
  //       <WebView style={styles.webview} source={{ uri: url }} />
  //     </DocContainer>
  //   );
  // }

  if (type === 'pdf') {
    if (!url) {
      return (
        <View style={styles.viewerPlaceholder}>
          <Text style={styles.viewerPlaceholderText}>
            PDF link not available.
          </Text>
        </View>
      );
    }

    const [pdfProgress, setPdfProgress] = useState(0);
    const [pdfLoading, setPdfLoading] = useState(true);

    useEffect(() => {
      // reset when url changes
      setPdfProgress(0);
      setPdfLoading(true);
    }, [url]);

    const onProgress = p => {
      // some versions send 0..1, some might send 0..100
      const pct = p <= 1 ? Math.round(p * 100) : Math.round(p);
      setPdfProgress(Math.max(0, Math.min(100, pct)));
    };

    return (
      <DocContainer
        title={material.title}
        isDocFullscreen={isDocFullscreen}
        onToggle={onToggleDocFullscreen}
      >
        <View style={{ flex: 1 }}>
          <Pdf
            key={url} // force reload if url changes
            source={{ uri: url, cache: true }}
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
            }}
            trustAllCerts={false}
            onLoadProgress={onProgress}
            onLoadComplete={() => {
              setPdfProgress(100);
              setPdfLoading(false);
            }}
            onError={error => {
              console.log('PDF error:', error);
              setPdfLoading(false);
            }}
          />

          {pdfLoading && (
            <View style={styles.pdfLoaderOverlay} pointerEvents="none">
              <ActivityIndicator size="large" color="#22C55E" />
              <Text style={styles.pdfLoaderText}>
                Loading PDF… {pdfProgress}%
              </Text>

              <View style={styles.pdfBarOuter}>
                <View
                  style={[styles.pdfBarInner, { width: `${pdfProgress}%` }]}
                />
              </View>
            </View>
          )}
        </View>
      </DocContainer>
    );
  }

  if (type === 'html') {
    if (htmlContent) {
      return (
        <DocContainer
          title={material.title}
          isDocFullscreen={isDocFullscreen}
          onToggle={onToggleDocFullscreen}
        >
          <WebView
            style={styles.webview}
            originWhitelist={['*']}
            source={{ html: htmlContent }}
          />
        </DocContainer>
      );
    }
    if (url) {
      return (
        <DocContainer
          title={material.title}
          isDocFullscreen={isDocFullscreen}
          onToggle={onToggleDocFullscreen}
        >
          <WebView style={styles.webview} source={{ uri: url }} />
        </DocContainer>
      );
    }
  }

  if (type === 'doc' || type === 'docx') {
    if (!url) {
      return (
        <View style={styles.viewerPlaceholder}>
          <Text style={styles.viewerPlaceholderText}>
            Document link not available.
          </Text>
        </View>
      );
    }
    const gview = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(
      url,
    )}`;
    return (
      <DocContainer
        title={material.title}
        isDocFullscreen={isDocFullscreen}
        onToggle={onToggleDocFullscreen}
      >
        <WebView style={styles.webview} source={{ uri: gview }} />
      </DocContainer>
    );
  }

  // fallback: plain text
  return (
    <DocContainer
      title={material.title}
      isDocFullscreen={isDocFullscreen}
      onToggle={onToggleDocFullscreen}
    >
      <ScrollView style={styles.textViewer}>
        <Text style={styles.textViewerText}>{textContent}</Text>
      </ScrollView>
    </DocContainer>
  );
};

const DocContainer = ({ title, children, isDocFullscreen, onToggle }) => (
  <View style={{ flex: 1 }}>
    <View style={styles.docHeader}>
      <Text style={styles.docTitle} numberOfLines={1}>
        {title || 'Document'}
      </Text>
      <TouchableOpacity onPress={onToggle}>
        <Text style={styles.docFullscreenText}>
          {isDocFullscreen ? 'Exit full screen' : 'Full screen'}
        </Text>
      </TouchableOpacity>
    </View>
    <View style={styles.docBody}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  center: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    color: '#E5E7EB',
  },
  topSection: {
    flex: 7,
  },
  viewerBox: {
    height: '55%',
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
    backgroundColor: '#000',
  },
  viewerPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  viewerPlaceholderText: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
  },
  video: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#020617',
  },
  textViewer: {
    flex: 1,
    padding: 12,
  },
  textViewerText: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  docHeader: {
    height: 40,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#020617',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  docTitle: {
    color: '#E5E7EB',
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  docFullscreenText: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '600',
  },
  docBody: {
    flex: 1,
  },
  pdfLoaderOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.55)',
  },

  pdfLoaderText: {
    marginTop: 10,
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '700',
  },

  pdfBarOuter: {
    marginTop: 10,
    width: 220,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
    overflow: 'hidden',
  },

  pdfBarInner: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#22C55E',
  },
});

export default OnlineCourseWorkspaceScreen;
