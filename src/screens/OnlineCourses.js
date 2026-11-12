// src/screens/OnlineCourses.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';

import CourseCard from '../components/CourseCard';
import { api } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnlineCourses = ({ navigation }) => {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchCatalog = useCallback(async () => {
    try {
      setError('');

      const raw = await AsyncStorage.getItem('me');
      const me = raw ? JSON.parse(raw) : null;

      /**
       * Student login:
       * body -> { student_id: studentId }
       *
       * Admin / Teacher login:
       * body -> { student_id: null }
       */

      const role = String(me?.role || me?.role_name || '').toLowerCase();

      const isAdminOrTeacher =
        role.includes('admin') || role.includes('teacher');

      let studentId = null;

      if (!isAdminOrTeacher) {
        studentId = me?.student_id ?? me?.id ?? null;
      }

      const data = await api('/api/online/catalog', {
        method: 'POST',
        body: JSON.stringify({
          student_id: studentId,
        }),
      });

      const categories = Array.isArray(data?.categories) ? data.categories : [];

      setCatalog(categories);
    } catch (e) {
      console.log('fetchCatalog error', e);

      if (e.status === 401) {
        setError('Please log in to view online courses.');
      } else {
        setError('Failed to load courses. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCatalog();
  };

  const renderCourseItem = ({ item, categoryId }) => {
    return (
      <CourseCard
        title={item.title}
        description={item.description}
        author={item.author}
        priceMinor={item.price_minor}
        currency={item.currency}
        imageUrl={item.image_url}
        rating={4}
        onPress={() => {
          navigation?.navigate('OnlineCourseOverviewLanding', {
            slug: item.slug,
            id: item.id,
          });
        }}
      />
    );
  };

  const renderCategory = category => {
    if (!category.courses || category.courses.length === 0) return null;

    return (
      <View key={category.id} style={styles.categoryBlock}>
        <Text style={styles.categoryLabel}>{category.label}</Text>

        <FlatList
          data={category.courses}
          renderItem={({ item }) =>
            renderCourseItem({ item, categoryId: category.id })
          }
          keyExtractor={course => `${category.id}-${course.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.screenTitle}>Online Courses</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {!error && catalog.length === 0 ? (
        <Text style={styles.emptyText}>No courses found.</Text>
      ) : null}

      {catalog.map(renderCategory)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 22,
    fontWeight: '900',
    color: '#E5E7EB',
    marginBottom: 12,
  },

  categoryBlock: {
    marginBottom: 26,
  },
  center: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 8,
  },
  errorText: {
    color: '#F97373',
    marginBottom: 12,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 8,
  },
});

export default OnlineCourses;
