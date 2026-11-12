import React, { useCallback, useRef, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { api } from '../../../api/client';
import styles from './AdminOnlineCoursesStudent.styles';

const PER_PAGE = 200;

function normalizeRow(row, index) {
  // Only render fields that the server actually supplies.
  return {
    ...row,
    _key: String(row?.id ?? row?.user_id ?? row?.student_id ?? `row-${index}`),
    displayName: String(row?.name ?? row?.student_name ?? row?.full_name ?? 'Student'),
    displayEmail: String(row?.email ?? row?.user?.email ?? ''),
    displayPhone: String(row?.phone ?? row?.mobile ?? row?.phone_number ?? ''),
  };
}

export default function AdminOnlineCoursesStudent() {
  const [queryInput, setQueryInput] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [role, setRole] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const requestSeq = useRef(0);
  const busyMore = useRef(false);

  const loadRows = useCallback(async (nextPage = 1, search = '', mode = 'normal') => {
    const seq = ++requestSeq.current;
    if (mode === 'refresh') setRefreshing(true);
    else if (nextPage > 1) {
      busyMore.current = true;
      setLoadingMore(true);
    } else setLoading(true);

    if (nextPage === 1) setError(false);

    try {
      const path = `/api/online-students?q=${encodeURIComponent(search)}&page=${nextPage}&per_page=${PER_PAGE}`;
      const response = await api(path, { method: 'GET' });
      if (seq !== requestSeq.current) return;
      const incoming = Array.isArray(response?.rows) ? response.rows : [];
      const mapped = incoming.map((row, index) => normalizeRow(row, (nextPage - 1) * PER_PAGE + index));
      setRows(previous => nextPage === 1 ? mapped : [
        ...previous,
        ...mapped.filter(row => !previous.some(old => old._key === row._key)),
      ]);
      setPage(Number(response?.page) || nextPage);
      setLastPage(Math.max(1, Number(response?.last_page) || 1));
      setCount(Math.max(0, Number(response?.count) || 0));
      setAppliedQuery(search);
    } catch (e) {
      if (seq !== requestSeq.current) return;
      console.log('[ONLINE STUDENTS] Load failed:', { status: e?.status, code: e?.code, message: e?.message });
      if (nextPage === 1) {
        setRows([]);
        setError(true);
      } else {
        Alert.alert('Unable to Load More', 'Please try again.');
      }
    } finally {
      if (seq === requestSeq.current) {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
        busyMore.current = false;
      }
    }
  }, []);

  useFocusEffect(useCallback(() => {
    let active = true;
    const initialize = async () => {
      // These auxiliary requests should not prevent the student list from loading.
      const [me, setup, meta] = await Promise.allSettled([
        api('/api/me'),
        api('/api/settings/v1/onboarding'),
        api('/api/online-students/meta'),
      ]);
      if (!active) return;
      if (meta.status === 'fulfilled') setRole(String(meta.value?.role || ''));
      else if (me.status === 'fulfilled') setRole(String(me.value?.actual_role || me.value?.role || ''));
      if (setup.status === 'fulfilled') setAcademicYear(String(setup.value?.academic_year?.label || ''));
    };
    initialize();
    loadRows(1, appliedQuery);
    return () => {
      active = false;
      requestSeq.current += 1;
    };
  // Reload list whenever this page becomes focused again.
  }, [loadRows]));

  const search = () => loadRows(1, queryInput.trim());
  const clear = () => {
    setQueryInput('');
    loadRows(1, '');
  };
  const refresh = () => loadRows(1, appliedQuery, 'refresh');
  const more = () => {
    if (loading || refreshing || loadingMore || busyMore.current || error || page >= lastPage) return;
    loadRows(page + 1, appliedQuery);
  };

  const renderStudent = ({ item }) => (
    <View style={styles.studentCard}>
      <View style={styles.avatar}>
        <MaterialCommunityIcons name="account-school-outline" size={23} color="#93C5FD" />
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.displayName}</Text>
        {item.displayEmail ? <Text style={styles.studentMeta}>{item.displayEmail}</Text> : null}
        {item.displayPhone ? <Text style={styles.studentMeta}>{item.displayPhone}</Text> : null}
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.searchCard}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={queryInput}
            onChangeText={setQueryInput}
            placeholder="Search by name, email or phone..."
            placeholderTextColor="#8898B1"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={search}
          />
          <Pressable onPress={search} style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>Search</Text>
          </Pressable>
          <Pressable onPress={clear} style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>Clear</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.listCard}>
        {loading && !refreshing ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#60A5FA" />
            <Text style={styles.stateText}>Loading online students...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <MaterialCommunityIcons name="alert-circle-outline" size={27} color="#FCA5A5" />
            <Text style={styles.stateTitle}>Unable to load online students</Text>
            <Text style={styles.stateText}>Please check your connection and try again.</Text>
            <Pressable onPress={refresh} style={styles.retryButton}><Text style={styles.buttonText}>Retry</Text></Pressable>
          </View>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={item => item._key}
            renderItem={renderStudent}
            contentContainerStyle={rows.length ? styles.listContent : styles.emptyListContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#60A5FA" colors={['#2563EB']} />}
            ListEmptyComponent={<View style={styles.emptyState}><Text style={styles.stateText}>{appliedQuery ? 'No matching online students found.' : 'No online students found.'}</Text></View>}
            ListHeaderComponent={rows.length > 0 ? <Text style={styles.countText}>{count} online student{count === 1 ? '' : 's'}{academicYear ? ` · ${academicYear}` : ''}</Text> : null}
            ListFooterComponent={loadingMore ? <ActivityIndicator style={styles.footerLoader} color="#60A5FA" /> : null}
            onEndReached={more}
            onEndReachedThreshold={0.35}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </View>
  );
}
