import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../api/client';

import styles from './ClassRoom.styles';

function getClassLabel(item) {
  if (!item) {
    return '-';
  }

  return [item?.name, item?.section].filter(Boolean).join(' - ');
}

function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function matchesStudentClass(classItem, studentProfile) {
  if (!classItem || !studentProfile) {
    return false;
  }

  return (
    normalize(classItem?.name) === normalize(studentProfile?.class_name) &&
    normalize(classItem?.section) === normalize(studentProfile?.section)
  );
}

export default function ClassRoom() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [me, setMe] = useState(null);

  const [classGroupsData, setClassGroupsData] = useState({
    role: '',
    count: 0,
    classes: [],
  });

  const [videoAccountsData, setVideoAccountsData] = useState({
    items: [],
  });

  const [classroomsData, setClassroomsData] = useState({
    items: [],
  });

  const [search, setSearch] = useState('');

  const loadData = useCallback(async ({ refresh = false } = {}) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const results = await Promise.allSettled([
        api('/api/me', {
          method: 'GET',
        }),

        api('/api/class-groups', {
          method: 'GET',
        }),

        api('/api/video-accounts?provider=google', {
          method: 'GET',
        }),

        api('/api/classrooms', {
          method: 'GET',
        }),
      ]);

      const meResult =
        results[0]?.status === 'fulfilled' ? results[0].value : null;

      const classGroupsResult =
        results[1]?.status === 'fulfilled' ? results[1].value : null;

      const videoAccountsResult =
        results[2]?.status === 'fulfilled' ? results[2].value : null;

      const classroomsResult =
        results[3]?.status === 'fulfilled' ? results[3].value : null;

      setMe(meResult);

      setClassGroupsData({
        role: classGroupsResult?.role || '',
        count: Number(classGroupsResult?.count) || 0,
        classes: Array.isArray(classGroupsResult?.classes)
          ? classGroupsResult.classes
          : [],
      });

      setVideoAccountsData({
        items: Array.isArray(videoAccountsResult?.items)
          ? videoAccountsResult.items
          : [],
      });

      setClassroomsData({
        items: Array.isArray(classroomsResult?.items)
          ? classroomsResult.items
          : [],
      });

      const failedRequests = results.filter(
        item => item?.status === 'rejected',
      );

      if (failedRequests.length > 0) {
        console.log(
          'Class room initial API failures:',
          failedRequests.map(item => item?.reason),
        );
      }
    } catch (error) {
      console.log('Class room load error:', error);

      Alert.alert(
        'Class Room',
        error?.message || 'Could not load classroom information.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const classes = useMemo(() => {
    return Array.isArray(classGroupsData?.classes)
      ? classGroupsData.classes
      : [];
  }, [classGroupsData]);

  const studentProfile = me?.student_profile || null;

  const currentClass = useMemo(() => {
    if (!studentProfile) {
      return null;
    }

    return (
      classes.find(item => matchesStudentClass(item, studentProfile)) || null
    );
  }, [classes, studentProfile]);

  const filteredClasses = useMemo(() => {
    const query = normalize(search);

    if (!query) {
      return classes;
    }

    return classes.filter(item => {
      const searchable = [
        item?.name,
        item?.section,
        item?.description,
        item?.academic_year?.code,
        item?.academic_year?.name,
        item?.academic_year?.label,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [classes, search]);

  const videoAccounts = Array.isArray(videoAccountsData?.items)
    ? videoAccountsData.items
    : [];

  const classrooms = Array.isArray(classroomsData?.items)
    ? classroomsData.items
    : [];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#60A5FA" />

        <Text style={styles.loadingText}>Loading classroom...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadData({
                refresh: true,
              })
            }
            tintColor="#60A5FA"
            colors={['#60A5FA']}
          />
        }
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIcon}>
            <MaterialCommunityIcons
              name="google-classroom"
              size={28}
              color="#7DD3FC"
            />
          </View>

          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>Class Room</Text>

            <Text style={styles.welcomeSubtitle}>
              View your class and available classroom information.
            </Text>
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons
                name="account-school-outline"
                size={28}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.profileContent}>
              <Text style={styles.studentName}>{me?.name || 'Student'}</Text>

              <Text style={styles.roleText}>
                {String(
                  me?.primary_role ||
                    me?.role ||
                    classGroupsData?.role ||
                    'Student',
                ).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.profileInfoGrid}>
            <View style={styles.profileInfo}>
              <Text style={styles.infoLabel}>Class</Text>

              <Text style={styles.infoValue}>
                {studentProfile?.class_name || '-'}
              </Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.infoLabel}>Section</Text>

              <Text style={styles.infoValue}>
                {studentProfile?.section || '-'}
              </Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.infoLabel}>Roll number</Text>

              <Text style={styles.infoValue}>
                {studentProfile?.roll_no || '-'}
              </Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.infoLabel}>Available classes</Text>

              <Text style={styles.infoValue}>
                {classGroupsData?.count || classes.length}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialCommunityIcons
                name="school-outline"
                size={21}
                color="#7DD3FC"
              />

              <Text style={styles.sectionTitle}>My Class</Text>
            </View>
          </View>

          {currentClass ? (
            <View style={styles.currentClassCard}>
              <View style={styles.currentClassIcon}>
                <MaterialCommunityIcons
                  name="account-group-outline"
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.currentClassContent}>
                <Text style={styles.currentClassTitle}>
                  {getClassLabel(currentClass)}
                </Text>

                <Text style={styles.currentClassYear}>
                  {currentClass?.academic_year?.label ||
                    currentClass?.academic_year?.code ||
                    'Academic year not available'}
                </Text>

                {!!currentClass?.description && (
                  <Text style={styles.currentClassDescription}>
                    {currentClass.description}
                  </Text>
                )}
              </View>

              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>CURRENT</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="school-outline"
                size={34}
                color="#64748B"
              />

              <Text style={styles.emptyTitle}>Current class not matched</Text>

              <Text style={styles.emptyDescription}>
                Your profile class is available, but no exact matching class
                group was found.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialCommunityIcons
                name="video-outline"
                size={21}
                color="#7DD3FC"
              />

              <Text style={styles.sectionTitle}>Classrooms</Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{classrooms.length}</Text>
            </View>
          </View>

          {classrooms.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="video-off-outline"
                size={36}
                color="#64748B"
              />

              <Text style={styles.emptyTitle}>No classrooms available</Text>

              <Text style={styles.emptyDescription}>
                No classroom has been assigned or created for your account yet.
              </Text>
            </View>
          ) : (
            classrooms.map((item, index) => (
              <View
                key={String(item?.id ?? index)}
                style={styles.classroomCard}
              >
                <View style={styles.classroomIcon}>
                  <MaterialCommunityIcons
                    name="video-outline"
                    size={22}
                    color="#7DD3FC"
                  />
                </View>

                <View style={styles.classroomContent}>
                  <Text style={styles.classroomTitle}>
                    {item?.name ||
                      item?.title ||
                      item?.class_name ||
                      `Classroom ${index + 1}`}
                  </Text>

                  {!!item?.description && (
                    <Text style={styles.classroomDescription}>
                      {item.description}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialCommunityIcons name="google" size={20} color="#7DD3FC" />

              <Text style={styles.sectionTitle}>Google Video Account</Text>
            </View>
          </View>

          {videoAccounts.length === 0 ? (
            <View style={styles.integrationCard}>
              <View style={styles.integrationIcon}>
                <MaterialCommunityIcons
                  name="video-account"
                  size={25}
                  color="#94A3B8"
                />
              </View>

              <View style={styles.integrationContent}>
                <Text style={styles.integrationTitle}>
                  No Google video account connected
                </Text>

                <Text style={styles.integrationDescription}>
                  There is currently no Google video account available for this
                  user.
                </Text>
              </View>
            </View>
          ) : (
            videoAccounts.map((item, index) => (
              <View
                key={String(item?.id ?? index)}
                style={styles.integrationCard}
              >
                <View style={styles.integrationIcon}>
                  <MaterialCommunityIcons
                    name="google"
                    size={24}
                    color="#7DD3FC"
                  />
                </View>

                <View style={styles.integrationContent}>
                  <Text style={styles.integrationTitle}>
                    {item?.name || item?.email || `Google account ${index + 1}`}
                  </Text>

                  {!!item?.email && item?.name && (
                    <Text style={styles.integrationDescription}>
                      {item.email}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={21}
                color="#7DD3FC"
              />

              <Text style={styles.sectionTitle}>Available Classes</Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {filteredClasses.length}
              </Text>
            </View>
          </View>

          <View style={styles.searchBox}>
            <MaterialCommunityIcons name="magnify" size={20} color="#8295AE" />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search class, section, academic year"
              placeholderTextColor="#718096"
              style={styles.searchInput}
              autoCorrect={false}
            />
          </View>

          {filteredClasses.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="magnify-close"
                size={34}
                color="#64748B"
              />

              <Text style={styles.emptyTitle}>No classes found</Text>
            </View>
          ) : (
            filteredClasses.map(item => {
              const isCurrent = matchesStudentClass(item, studentProfile);

              return (
                <View
                  key={String(item.id)}
                  style={[
                    styles.classItem,
                    isCurrent && styles.classItemCurrent,
                  ]}
                >
                  <View
                    style={[
                      styles.classIcon,
                      isCurrent && styles.classIconCurrent,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="school-outline"
                      size={21}
                      color={isCurrent ? '#FFFFFF' : '#7DD3FC'}
                    />
                  </View>

                  <View style={styles.classContent}>
                    <Text style={styles.classTitle}>{getClassLabel(item)}</Text>

                    <Text style={styles.classYear}>
                      {item?.academic_year?.label ||
                        item?.academic_year?.code ||
                        '-'}
                    </Text>
                  </View>

                  {isCurrent && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={21}
                      color="#34D399"
                    />
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
