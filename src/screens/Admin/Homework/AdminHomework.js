// src/screens/Admin/Homework/AdminHomework.js

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';
import styles from './AdminHomework.styles';
import { useFocusEffect } from '@react-navigation/native';

function formatDateTime(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getHomeworkSubjects(homework) {
  const subjects = Array.isArray(homework?.courses)
    ? homework.courses
        .map(course =>
          String(course?.title || course?.course_title || '').trim(),
        )
        .filter(Boolean)
    : [];

  const uniqueSubjects = [...new Set(subjects)];

  if (uniqueSubjects.length > 0) {
    return uniqueSubjects.join(', ');
  }

  return homework?.course_title || homework?.subject_name || 'No subject';
}

export default function AdminHomework({ navigation }) {
  const insets = useSafeAreaInsets();

  const [me, setMe] = useState(null);

  const [homeworks, setHomeworks] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
  });

  const [searchText, setSearchText] = useState('');

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [homeworkMeta, setHomeworkMeta] = useState(null);

  const loadHomeworks = useCallback(
    async ({ refresh = false, page = 1 } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const requestedPage = Math.max(1, Number(page) || 1);

        const [meResponse, homeworksResponse, metaResponse] = await Promise.all(
          [
            api('/api/me'),

            api(
              `/api/homeworks?window_days=30&page=${requestedPage}&per_page=20`,
            ),

            api('/api/homeworks/meta'),
          ],
        );

        setMe(meResponse || null);
        setHomeworkMeta(metaResponse || {});

        const items = Array.isArray(homeworksResponse?.items)
          ? homeworksResponse.items
          : [];

        setHomeworks(items);

        const pageInfo = homeworksResponse?.pagination || {};

        setPagination({
          currentPage: Number(pageInfo.current_page ?? requestedPage),
          lastPage: Math.max(1, Number(pageInfo.last_page ?? 1)),
          perPage: Number(pageInfo.per_page ?? 20),
          total: Number(
            pageInfo.total ?? homeworksResponse?.count ?? items.length,
          ),
        });

        navigation.setOptions({
          title: 'HomeWorks',
        });
      } catch (error) {
        console.log('Homework load error:', error);

        Alert.alert('HomeWorks', error?.message || 'Could not load homeworks.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigation],
  );

  useFocusEffect(
    useCallback(() => {
      loadHomeworks();
    }, [loadHomeworks]),
  );

  const filteredHomeworks = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return homeworks;
    }

    return homeworks.filter(item => {
      const searchableText = [
        item?.name,
        item?.title,
        item?.class_name,
        item?.course_title,
        item?.subject_name,
        getHomeworkSubjects(item),
        item?.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [homeworks, searchText]);

  function changePage(nextPage) {
    if (
      loading ||
      refreshing ||
      nextPage < 1 ||
      nextPage > pagination.lastPage ||
      nextPage === pagination.currentPage
    ) {
      return;
    }

    setSearchText('');

    loadHomeworks({
      page: nextPage,
    });
  }

  function openAddHomework() {
    navigation.navigate('AdminHomeworkForm', {
      mode: 'add',

      currentUser: me,

      homeworkMeta,
    });
  }

  function editHomework(homework) {
    navigation.navigate('AdminHomeworkForm', {
      mode: 'edit',

      homework,

      currentUser: me,

      homeworkMeta,
    });
  }

  function deleteHomework(homework) {
    Alert.alert(
      'Delete Homework',
      `Delete ${homework?.name || 'this homework'}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Delete Homework', 'Delete API is not connected yet.');
          },
        },
      ],
    );
  }

  function assignStudents(homework) {
    const homeworkId = Number(homework?.id);

    if (!Number.isFinite(homeworkId)) {
      Alert.alert('Assign Students', 'Homework ID is missing.');
      return;
    }

    navigation.navigate('AdminAssignHomeworkStudents', {
      homeworkId,

      homeworkName: homework?.name,

      classGroupId: homework?.class_group_id,

      className: homework?.class_name,

      courseId: homework?.course_id,

      courseTitle: homework?.course_title,
    });
  }

  function assignQuestions(homework) {
    const homeworkId = Number(homework?.id);

    if (!Number.isFinite(homeworkId)) {
      Alert.alert('Assign Questions', 'Homework ID is missing.');

      return;
    }

    navigation.navigate('AdminAssignHomeworkQuestions', {
      homeworkId,

      homeworkName: homework?.name,

      classGroupId: homework?.class_group_id,

      className: homework?.class_name,

      courseId: homework?.course_id,

      courseTitle: homework?.course_title,
    });
  }

  function renderHomework({ item }) {
    const status = String(item?.status || '')
      .trim()
      .toLowerCase();

    return (
      <View style={styles.homeworkCard}>
        <View style={styles.homeworkTopRow}>
          <View style={styles.homeworkTitleSection}>
            <Text numberOfLines={2} style={styles.homeworkTitle}>
              {item?.name || 'Untitled Homework'}
            </Text>
          </View>

          <View style={styles.homeworkBadges}>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>
                Students: {Number(item?.students_count || 0)}
              </Text>
            </View>

            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>
                Questions: {Number(item?.questions_count || 0)}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,

                status === 'scheduled' && styles.statusScheduled,

                status === 'draft' && styles.statusDraft,

                status === 'evaluated' && styles.statusEvaluated,
              ]}
            >
              <Text style={styles.statusText}>
                {status ? status.replace(/_/g, ' ') : 'unknown'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.homeworkInfoRow}>
          <Text
            numberOfLines={2}
            style={[
              styles.courseText,
              {
                flex: 1,
                flexShrink: 1,
                lineHeight: 17,
              },
            ]}
          >
            {getHomeworkSubjects(item)}
          </Text>

          <Text numberOfLines={1} style={[styles.classText, { marginLeft: 8 }]}>
            {item?.class_name || 'No class'}
          </Text>
        </View>

        <Text style={styles.dueText}>
          <Text style={styles.dueLabel}>Due: </Text>

          {formatDateTime(item?.ends_at)}
        </Text>

        <View style={styles.homeworkActions}>
          <View style={styles.leftActions}>
            <Pressable
              onPress={() => editHomework(item)}
              style={({ pressed }) => [
                styles.outlineButton,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.outlineButtonText}>Edit</Text>
            </Pressable>

            <Pressable
              onPress={() => deleteHomework(item)}
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>

          <View style={styles.rightActions}>
            <Pressable
              onPress={() => assignStudents(item)}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Assign Students</Text>
            </Pressable>

            <Pressable
              onPress={() => assignQuestions(item)}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Assign Questions</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading homeworks...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <View style={styles.headerCard}>
        <View style={styles.headerTextSection}>
          <Text style={styles.pageTitle}>HomeWorks</Text>

          <Text style={styles.pageSubtitle}>
            Create, search, and manage homework.
          </Text>
        </View>

        <Pressable
          onPress={openAddHomework}
          style={({ pressed }) => [
            styles.addHomeworkButton,

            pressed && styles.controlPressed,
          ]}
        >
          <Text style={styles.addHomeworkButtonText}>+ Add Homework</Text>
        </Pressable>
      </View>

      <View style={styles.contentCard}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search homeworks..."
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={styles.searchInput}
        />

        <View style={styles.resultSummary}>
          <Text style={styles.resultSummaryText}>
            {searchText.trim()
              ? `Showing ${filteredHomeworks.length} matching homeworks on this page`
              : `Showing ${
                  pagination.total === 0
                    ? 0
                    : (pagination.currentPage - 1) * pagination.perPage + 1
                }–${Math.min(
                  pagination.currentPage * pagination.perPage,
                  pagination.total,
                )} of ${pagination.total} homeworks`}
          </Text>
        </View>

        <FlatList
          data={filteredHomeworks}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={renderHomework}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() =>
                loadHomeworks({
                  refresh: true,
                  page: pagination.currentPage,
                })
              }
              tintColor="#FFFFFF"
              colors={['#FFFFFF']}
            />
          }
          contentContainerStyle={[
            styles.listContent,

            filteredHomeworks.length === 0 && styles.emptyListContent,
          ]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchText.trim()
                  ? 'No matching homeworks found.'
                  : 'No homeworks found.'}
              </Text>
            </View>
          }
        />

        <View style={styles.paginationContainer}>
          <View style={styles.paginationLeft}>
            <Text style={styles.paginationTotalText}>
              {pagination.total} total
            </Text>
          </View>

          <View style={styles.paginationRight}>
            <Pressable
              onPress={() => changePage(pagination.currentPage - 1)}
              disabled={loading || refreshing || pagination.currentPage <= 1}
              style={({ pressed }) => [
                styles.paginationButton,
                (loading || refreshing || pagination.currentPage <= 1) &&
                  styles.paginationButtonDisabled,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.paginationArrow}>←</Text>
            </Pressable>

            <View style={styles.paginationPageIndicator}>
              <Text style={styles.paginationPageText}>
                {pagination.currentPage}/{pagination.lastPage}
              </Text>
            </View>

            <Pressable
              onPress={() => changePage(pagination.currentPage + 1)}
              disabled={
                loading ||
                refreshing ||
                pagination.currentPage >= pagination.lastPage
              }
              style={({ pressed }) => [
                styles.paginationButton,
                (loading ||
                  refreshing ||
                  pagination.currentPage >= pagination.lastPage) &&
                  styles.paginationButtonDisabled,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.paginationArrow}>→</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.hiddenMetadata}>
        <Text>{me?.id || ''}</Text>

        <Text>{pagination.currentPage}</Text>

        <Text>{pagination.lastPage}</Text>

        <Text>{pagination.total}</Text>
      </View>
    </View>
  );
}
