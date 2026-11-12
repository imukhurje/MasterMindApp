import React, { useCallback, useMemo, useState } from 'react';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { loadClassroomInitialData } from './classroomApi';
import styles from './AdminClassRoom.styles';

export default function AdminClassRoom() {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [groupCount, setGroupCount] = useState(0);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try {
      const result = await loadClassroomInitialData();
      setItems(result.items);
      setAcademicYear(result.onboarding?.academic_year?.label || '');
      setGroupCount(result.classGroups.length);
      if (result.optionalErrors.length)
        console.log(
          '[CLASSROOM] Optional API failures:',
          result.optionalErrors,
        );
      setError('');
    } catch (e) {
      setError(e?.message || 'Failed to load classrooms.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter(item =>
      [
        item.title,
        item.className,
        item.section,
        item.teacher,
        item.subject,
      ].some(text => text.toLowerCase().includes(term)),
    );
  }, [items, query]);

  const openClassroom = item =>
    navigation.navigate('AdminClassroomDetails', {
      classroomId: item.id,
      classroom: item,
    });

  const renderItem = ({ item }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.title}`}
      onPress={() => openClassroom(item)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.cardTop}>
        <View style={styles.classroomIcon}>
          <Ionicons name="school-outline" size={21} color="#93C5FD" />
        </View>
        <View style={styles.cardTitleWrap}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {!!item.className && (
            <Text style={styles.cardSub}>
              {[item.className, item.section].filter(Boolean).join(' · ')}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </View>
      {!!item.description && (
        <Text numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>
      )}
      <View style={styles.metaWrap}>
        {!!item.teacher && (
          <Text style={styles.chip}>Teacher: {item.teacher}</Text>
        )}
        {!!item.subject && <Text style={styles.chip}>{item.subject}</Text>}
        {item.students != null && (
          <Text style={styles.chip}>{item.students} Students</Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarTitleWrap}>
          <Text style={styles.title}>Classrooms</Text>
          <Text style={styles.subtitle}>
            {items.length} classrooms{academicYear ? ` · ${academicYear}` : ''}
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('AdminClassroomCreate')}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="add" size={18} color="#FFF" />
          <Text style={styles.primaryButtonText}>New Classroom</Text>
        </Pressable>
      </View>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#94A3B8" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search classrooms..."
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
          autoCorrect={false}
        />
        {!!query && (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" color="#94A3B8" size={19} />
          </Pressable>
        )}
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#60A5FA" size="large" />
          <Text style={styles.muted}>Loading classrooms...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              tintColor="#60A5FA"
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name={error ? 'alert-circle-outline' : 'school-outline'}
                size={32}
                color="#93C5FD"
              />
              <Text style={styles.emptyTitle}>
                {error ? 'Unable to load classrooms' : 'No classrooms found'}
              </Text>
              <Text style={styles.muted}>
                {error ||
                  (query
                    ? 'Try another search.'
                    : 'No classrooms have been created yet. Tap "+ New Classroom" to get started.')}
              </Text>
              {!!error && (
                <Pressable onPress={() => load()} style={styles.retryButton}>
                  <Text style={styles.retryText}>Retry</Text>
                </Pressable>
              )}
            </View>
          }
        />
      )}
    </View>
  );
}
