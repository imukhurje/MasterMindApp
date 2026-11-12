// src/screens/OnlineCourseOverviewLanding.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { api } from '../../api/client';

const OnlineCourseOverviewLanding = ({ route, navigation }) => {
  const { slug, id } = route?.params || {};

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedChapters, setExpandedChapters] = useState([]);

  const fetchCourse = useCallback(async () => {
    if (!id) {
      setError('No course id provided.');
      setLoading(false);
      return;
    }

    try {
      setError('');
      setLoading(true);

      const data = await api(`/api/online/course/${id}`, {
        method: 'GET',
      });

      setCourse(data || null);

      const firstChapterId = data?.chapters?.[0]?.id;
      if (firstChapterId) {
        setExpandedChapters([firstChapterId]);
      }
    } catch (e) {
      console.log('fetchCourse error', e);
      setError('Failed to load course details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    console.log('OnlineCourseOverviewLanding params ==>', { slug, id });
    fetchCourse();
  }, [slug, id, fetchCourse]);

  const toggleChapter = chapterId => {
    setExpandedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(item => item !== chapterId)
        : [...prev, chapterId],
    );
  };

  const getFirstMaterial = () => {
    const chapters = Array.isArray(course?.chapters) ? course.chapters : [];

    for (const chapter of chapters) {
      if (Array.isArray(chapter.materials) && chapter.materials.length > 0) {
        return {
          chapter,
          material: chapter.materials[0],
        };
      }
    }

    return null;
  };

  const handleStartCourse = () => {
    const first = getFirstMaterial();

    if (!first) {
      Alert.alert('No material', 'No course material found.');
      return;
    }

    navigation.navigate('OnlineCourseWorkspace', {
      courseId: course.id,
      slug: course.slug || slug,
      courseTitle: course.title,
      chapterId: first.chapter.id,
      chapterTitle: first.chapter.title,
      initialMaterialId: first.material.id,
      initialMaterial: first.material,
    });
  };

  const handleMaterialPress = (material, chapter) => {
    navigation.navigate('OnlineCourseWorkspace', {
      courseId: course.id,
      slug: course.slug || slug,
      courseTitle: course.title,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      initialMaterialId: material.id,
      initialMaterial: material,
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#67D7F7" />
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

  const learnItems = normalizeTags(course.tags);
  const canStart = course.can_access && !course.access_locked;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageShell}>
        <CourseHero course={course} />

        <CourseMetaCard course={course} />

        <WhatYoullLearnSection items={learnItems} />

        <ActionButtons canStart={canStart} onStartCourse={handleStartCourse} />

        <CourseContentSection
          chapters={course.chapters || []}
          expandedChapters={expandedChapters}
          onToggleChapter={toggleChapter}
          onSelectMaterial={handleMaterialPress}
          canAccess={canStart}
        />
      </View>
    </ScrollView>
  );
};

/* ---------------- Components ---------------- */

const CourseHero = ({ course }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const title = course?.title || '';
  const firstLetter = title.trim() ? title.trim()[0].toUpperCase() : '?';

  const coverUrl = course?.cover_image || course?.hero_image || '';
  const showImage = !!coverUrl && !imageFailed;

  return (
    <View style={styles.heroCard}>
      {showImage ? (
        <Image
          source={{ uri: coverUrl }}
          style={styles.heroImage}
          resizeMode="cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <ImageBackground
          source={require('./../../../assets/gradients/thumb-gradient.jpg')}
          style={styles.heroImageFallback}
          imageStyle={styles.heroImageFallbackImg}
        >
          <Text style={styles.heroFallbackLetter}>{firstLetter}</Text>
        </ImageBackground>
      )}

      <View style={styles.heroTextWrap}>
        <Text numberOfLines={2} style={styles.heroTitle}>
          {course.title}
        </Text>

        <Text numberOfLines={2} style={styles.heroDesc}>
          {course.description || 'No description available'}
        </Text>
      </View>
    </View>
  );
};

const CourseMetaCard = ({ course }) => {
  const tags = normalizeTags(course.tags).join(', ');
  const lastUpdated = formatUpdatedAt(course.updated_at);
  const durationText = getCourseDuration(course.chapters);

  const hasRating = course.rating_count && course.rating_count > 0;
  const ratingText = hasRating
    ? Number(course.rating_avg || 0).toFixed(1)
    : '—';

  return (
    <View style={styles.metaCard}>
      <View style={styles.metaTopRow}>
        <View style={styles.metaLeft}>
          <View style={styles.metaLine}>
            <Text style={styles.metaLabel}>created by</Text>
            <Text style={styles.metaValue}>{course.author || 'Unknown'}</Text>
          </View>

          <View style={styles.metaLine}>
            <Text style={styles.metaLabel}>Purpose</Text>
            <Text style={styles.metaValue}>{tags || '—'}</Text>
          </View>
        </View>

        <View style={styles.metaRight}>
          <View style={styles.ratingBlock}>
            <Text style={styles.ratingScore}>{ratingText}</Text>

            <View style={styles.ratingStarsRow}>
              {[1, 2, 3, 4, 5].map(i => (
                <Icon
                  key={i}
                  name="star"
                  size={10}
                  solid={hasRating && i <= Math.round(course.rating_avg || 0)}
                  color="#94A3B8"
                />
              ))}
            </View>

            <Text style={styles.ratingSmall}>
              {hasRating ? `${course.rating_count} ratings` : 'No ratings'}
            </Text>
          </View>

          <View style={styles.learnersBlock}>
            <Icon name="user-friends" size={15} color="#E5E7EB" />
            <Text style={styles.learnersNumber}>{course.learners || 0}</Text>
            <Text style={styles.learnersLabel}>learners</Text>
          </View>
        </View>
      </View>

      <View style={styles.metaBottomRow}>
        <View style={styles.metaInlineRow}>
          <Icon name="clock" size={12} color="#E5E7EB" />
          <Text style={styles.metaInlineText}>Duration {durationText}</Text>
        </View>

        <Text style={styles.dot}>•</Text>

        <View style={styles.metaInlineRow}>
          <Icon name="sync" size={12} color="#E5E7EB" />
          <Text style={styles.metaInlineText}>
            Last updated on {lastUpdated}
          </Text>
        </View>
      </View>
    </View>
  );
};

const WhatYoullLearnSection = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.learnBox}>
      <Text style={styles.learnTitle}>What you'll learn</Text>
      <Text style={styles.learnText}>{items.join(', ')}</Text>
    </View>
  );
};

const ActionButtons = ({ canStart, onStartCourse }) => {
  return (
    <View style={styles.actionRow}>
      <TouchableOpacity
        style={[styles.startButton, !canStart && styles.disabledButton]}
        onPress={onStartCourse}
        disabled={!canStart}
        activeOpacity={0.85}
      >
        <Text style={styles.startButtonText}>
          {canStart ? 'Start Course' : 'Course Locked'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.offlineButton}
        activeOpacity={0.85}
        onPress={() => {
          Alert.alert(
            'Offline Viewing',
            'Offline viewing will be available soon.',
          );
        }}
      >
        <Text style={styles.offlineButtonText}>Save for Offline</Text>
      </TouchableOpacity>
    </View>
  );
};

const CourseContentSection = ({
  chapters,
  expandedChapters,
  onToggleChapter,
  onSelectMaterial,
  canAccess,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Course Content</Text>

      {chapters.map(chapter => {
        const isOpen = expandedChapters.includes(chapter.id);
        const materials = Array.isArray(chapter.materials)
          ? chapter.materials
          : [];

        return (
          <View key={chapter.id} style={styles.chapterCard}>
            <TouchableOpacity
              style={styles.chapterHeader}
              onPress={() => onToggleChapter(chapter.id)}
              activeOpacity={0.85}
            >
              <View style={styles.chapterHeaderLeft}>
                <Icon name="book-open" size={16} color="#0F172A" />
                <Text numberOfLines={1} style={styles.chapterTitle}>
                  {chapter.title}
                </Text>
              </View>

              <Icon
                name={isOpen ? 'caret-up' : 'caret-down'}
                size={16}
                color="#0F172A"
              />
            </TouchableOpacity>

            {isOpen ? (
              <View style={styles.materialList}>
                {materials.map((material, index) => (
                  <MaterialRow
                    key={material.id}
                    material={material}
                    locked={!canAccess && !material.is_preview}
                    isLast={index === materials.length - 1}
                    onPress={() => onSelectMaterial(material, chapter)}
                  />
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

const MaterialRow = ({ material, onPress, locked, isLast }) => {
  const iconName = getMaterialIcon(material.type);
  const iconColor = getMaterialIconColor(material.type);

  return (
    <TouchableOpacity
      style={[
        styles.materialRow,
        isLast && styles.materialRowLast,
        locked && styles.materialRowLocked,
      ]}
      onPress={onPress}
      disabled={locked}
      activeOpacity={0.75}
    >
      <View style={styles.materialIconWrap}>
        <Icon
          name={locked ? 'lock' : iconName}
          size={14}
          color={locked ? '#94A3B8' : iconColor}
        />
      </View>

      <Text numberOfLines={2} style={styles.materialTitle}>
        {material.title}
      </Text>
    </TouchableOpacity>
  );
};

/* ---------------- Helpers ---------------- */

const normalizeTags = tagsString =>
  String(tagsString || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

const formatUpdatedAt = updatedAt => {
  if (!updatedAt) return '—';

  try {
    const d = new Date(String(updatedAt).replace(' ', 'T'));
    if (Number.isNaN(d.getTime())) return updatedAt;

    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${month}/${year}`;
  } catch {
    return updatedAt;
  }
};

const getCourseDuration = chapters => {
  const list = Array.isArray(chapters) ? chapters : [];

  let totalSeconds = 0;

  list.forEach(chapter => {
    const materials = Array.isArray(chapter.materials) ? chapter.materials : [];

    materials.forEach(material => {
      totalSeconds += Number(material.duration_seconds || 0);
    });
  });

  if (!totalSeconds) return '—';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours && minutes) return `${hours} hr ${minutes} min`;
  if (hours) return `${hours} hr`;
  return `${minutes} min`;
};

const getMaterialIcon = type => {
  const t = String(type || '').toLowerCase();

  if (t === 'pdf') return 'file-alt';
  if (t === 'youtube') return 'play-circle';
  if (t === 'video') return 'play-circle';
  if (t === 'quiz') return 'question';

  return 'file-alt';
};

const getMaterialIconColor = type => {
  const t = String(type || '').toLowerCase();

  if (t === 'quiz') return '#FF3B1F';
  if (t === 'pdf') return '#E5E7EB';
  if (t === 'youtube') return '#E5E7EB';
  if (t === 'video') return '#E5E7EB';

  return '#E5E7EB';
};

const getMaterialTypeLabel = type => {
  const t = String(type || '').toLowerCase();

  if (t === 'pdf') return 'PDF';
  if (t === 'youtube') return 'YouTube Video';
  if (t === 'video') return 'Video';

  return 'Material';
};

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },

  contentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },

  pageShell: {
    borderWidth: 1,
    borderColor: '#1F5C96',
    borderRadius: 18,
    padding: 12,
    backgroundColor: '#071224',
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

  heroCard: {
    minHeight: 135,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#263B5F',
    backgroundColor: '#081326',
    padding: 12,
    flexDirection: 'row',
    marginBottom: 14,
  },

  heroImage: {
    width: 88,
    height: 112,
    borderRadius: 8,
    backgroundColor: '#111827',
  },

  heroImageFallback: {
    width: 88,
    height: 112,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  heroImageFallbackImg: {
    borderRadius: 8,
  },

  heroFallbackLetter: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
  },

  heroTextWrap: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },

  heroTitle: {
    color: '#F9FAFB',
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '900',
    marginBottom: 8,
  },

  heroDesc: {
    color: '#E5E7EB',
    fontSize: 13,
    lineHeight: 18,
  },

  metaCard: {
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#6B7280',
    backgroundColor: '#081326',
    padding: 12,
    marginBottom: 12,
  },

  metaTopRow: {
    flexDirection: 'row',
  },

  metaLeft: {
    flex: 1.25,
    paddingRight: 8,
  },

  metaRight: {
    flex: 0.85,
    alignItems: 'flex-end',
  },

  metaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  metaLabel: {
    width: 78,
    color: '#CBD5E1',
    fontSize: 13,
  },

  metaValue: {
    flex: 1,
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '800',
  },

  ratingBlock: {
    alignItems: 'center',
    marginBottom: 12,
  },

  ratingScore: {
    color: '#E5E7EB',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 3,
  },

  ratingStarsRow: {
    flexDirection: 'row',
  },

  ratingSmall: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 5,
  },

  learnersBlock: {
    alignItems: 'center',
  },

  learnersNumber: {
    color: '#E5E7EB',
    fontSize: 13,
    marginTop: 4,
  },

  learnersLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 2,
  },

  metaBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },

  metaInlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
    marginTop: 4,
  },

  metaInlineText: {
    color: '#CBD5E1',
    fontSize: 12,
    marginLeft: 6,
  },

  dot: {
    color: '#94A3B8',
    marginHorizontal: 6,
    marginTop: 4,
  },

  learnBox: {
    borderWidth: 1,
    borderColor: '#6B7280',
    backgroundColor: '#081326',
    paddingHorizontal: 14,
    paddingVertical: 18,
    marginBottom: 14,
  },

  learnTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    marginBottom: 14,
  },

  learnText: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  startButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#67D7F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,

    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 12,
    elevation: 8,
  },

  disabledButton: {
    backgroundColor: '#64748B',
  },

  startButtonText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
  },

  offlineButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#284F6A',
    borderWidth: 1,
    borderColor: '#67D7F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  offlineButtonText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
  },

  section: {
    marginBottom: 8,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    marginBottom: 12,
  },

  chapterCard: {
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#64748B',
    backgroundColor: '#081326',
  },

  chapterHeader: {
    minHeight: 47,
    backgroundColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    paddingVertical: 10,
  },

  chapterHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  chapterTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },

  materialList: {
    backgroundColor: '#081326',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  materialRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingVertical: 9,
  },

  materialRowLast: {
    borderBottomWidth: 0,
  },

  materialRowLocked: {
    opacity: 0.55,
  },

  materialIconWrap: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },

  materialTitle: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '500',
  },
});

export { CourseContentSection, MaterialRow };

export default OnlineCourseOverviewLanding;
