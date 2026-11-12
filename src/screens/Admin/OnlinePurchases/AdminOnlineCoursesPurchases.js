import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { api } from '../../../api/client';
import styles from './AdminOnlineCoursesPurchases.styles';

const PAGE_SIZE = 50;
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'all', label: 'All' },
];

const readable = value =>
  value === null || value === undefined || value === ''
    ? ''
    : String(value);

function PurchaseCard({ item }) {
  // Exact populated-row contract has not been supplied; show only known values.
  const student = item?.student || {};
  const course = item?.course || {};
  const name = readable(item?.student_name || student?.name || item?.name);
  const email = readable(item?.student_email || student?.email || item?.email);
  const courseName = readable(item?.course_title || item?.course_name || course?.title || course?.name);
  const status = readable(item?.status);
  const reference = readable(item?.id);
  const requestedAt = readable(item?.created_at || item?.requested_at);

  return (
    <View style={styles.purchaseCard}>
      <View style={styles.purchaseHeader}>
        <View style={styles.purchaseHeaderText}>
          <Text style={styles.purchaseTitle}>{name || 'Purchase request'}</Text>
          {!!email && <Text style={styles.purchaseMuted}>{email}</Text>}
        </View>
        {!!status && (
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        )}
      </View>
      {!!courseName && <Text style={styles.purchaseText}>Course: {courseName}</Text>}
      {!!reference && <Text style={styles.purchaseMuted}>Request #{reference}</Text>}
      {!!requestedAt && <Text style={styles.purchaseMuted}>{requestedAt}</Text>}
    </View>
  );
}

export default function AdminOnlineCoursesPurchases() {
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [status, setStatus] = useState('pending');
  const [statusVisible, setStatusVisible] = useState(false);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState({ q: '', status: 'pending' });
  const generation = useRef(0);
  const runningMore = useRef(false);

  const fetchPage = useCallback(async (targetPage, filters, append = false, kind = 'initial') => {
    const requestId = append ? generation.current : ++generation.current;
    if (kind === 'refresh') setRefreshing(true);
    else if (append) setLoadingMore(true);
    else setLoading(true);
    if (!append) setError(false);

    try {
      const query =
        `?q=${encodeURIComponent(filters.q)}` +
        `&status=${encodeURIComponent(filters.status)}` +
        `&page=${targetPage}&per_page=${PAGE_SIZE}`;
      const result = await api(`/api/online-purchases${query}`, { method: 'GET' });
      if (requestId !== generation.current) return;
      const incoming = Array.isArray(result?.rows) ? result.rows : [];
      setRows(previous => {
        if (!append) return incoming;
        const existing = new Set(previous.map((x, i) => String(x?.id ?? `old-${i}`)));
        return [...previous, ...incoming.filter((x, i) => {
          const key = String(x?.id ?? `new-${targetPage}-${i}`);
          if (existing.has(key)) return false;
          existing.add(key);
          return true;
        })];
      });
      setPage(Number(result?.page) || targetPage);
      setLastPage(Math.max(1, Number(result?.last_page) || 1));
      setCount(Number(result?.count) || 0);
    } catch (e) {
      if (requestId === generation.current) {
        console.log('[ONLINE PURCHASES] Request failed', { status: e?.status, message: e?.message });
        if (!append) {
          setError(true);
          setRows([]);
        }
      }
    } finally {
      if (requestId === generation.current) {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
      if (append) runningMore.current = false;
    }
  }, []);

  useFocusEffect(useCallback(() => {
    let active = true;
    const initialize = async () => {
      // These APIs are part of the page boot sequence. List request can still
      // succeed if either auxiliary endpoint is unavailable.
      const auxiliary = await Promise.allSettled([
        api('/api/me'),
        api('/api/settings/v1/onboarding'),
        api('/api/online-students/meta'),
      ]);
      if (!active) return;
      auxiliary.forEach((outcome, index) => {
        if (outcome.status === 'rejected') {
          console.log('[ONLINE PURCHASES] Initial metadata unavailable', index);
        }
      });
      await fetchPage(1, filter);
    };
    initialize();
    return () => {
      active = false;
      generation.current += 1;
    };
    // On screen re-focus, reload current filters; filters are intentionally not a dependency.
  }, [fetchPage]));

  const apply = (q, nextStatus) => {
    const next = { q: q.trim(), status: nextStatus };
    setFilter(next);
    setAppliedSearch(next.q);
    setPage(1);
    fetchPage(1, next);
  };

  const clear = () => {
    setSearch('');
    setStatus('pending');
    apply('', 'pending');
  };

  const loadMore = () => {
    if (runningMore.current || loading || refreshing || loadingMore || error || page >= lastPage) return;
    runningMore.current = true;
    fetchPage(page + 1, filter, true);
  };

  const statusLabel = STATUS_OPTIONS.find(x => x.value === status)?.label || 'Pending';

  return (
    <View style={styles.screen}>
      <View style={styles.searchOuter}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by student email/name or course..."
            placeholderTextColor="#91A4BF"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => apply(search, status)}
            returnKeyType="search"
          />
          <Pressable
            onPress={() => setStatusVisible(true)}
            style={styles.statusSelect}
            accessibilityRole="button"
            accessibilityLabel={`Filter by status: ${statusLabel}`}
          >
            <Text style={styles.statusSelectText} numberOfLines={1}>{statusLabel}</Text>
            <MaterialCommunityIcons name="chevron-down" color="#FFFFFF" size={17} />
          </Pressable>
          <Pressable onPress={() => apply(search, status)} style={styles.actionButton}>
            <Text style={styles.actionText}>Search</Text>
          </Pressable>
          <Pressable onPress={clear} style={styles.actionButton}>
            <Text style={styles.actionText}>Clear</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.resultsOuter}>
        {loading && rows.length === 0 ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#60A5FA" />
            <Text style={styles.helpText}>Loading purchase requests...</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.helpText}>Unable to load purchase requests.</Text>
            <Pressable style={styles.retryButton} onPress={() => fetchPage(1, filter)}>
              <Text style={styles.actionText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item, i) => String(item?.id ?? `${page}-${i}`)}
            renderItem={({ item }) => <PurchaseCard item={item} />}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => fetchPage(1, filter, false, 'refresh')} tintColor="#60A5FA" colors={['#2563EB']} />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No purchase requests found.</Text>
              </View>
            }
            ListFooterComponent={
              rows.length ? (
                <View style={styles.footer}>
                  <Text style={styles.pageText}>{rows.length} of {count} requests</Text>
                  {page < lastPage && (
                    <Pressable disabled={loadingMore} style={styles.loadMoreButton} onPress={loadMore}>
                      {loadingMore ? <ActivityIndicator color="#FFF" /> : <Text style={styles.actionText}>Load more</Text>}
                    </Pressable>
                  )}
                </View>
              ) : null
            }
          />
        )}
      </View>

      <Modal visible={statusVisible} transparent animationType="fade" onRequestClose={() => setStatusVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Purchase Status</Text>
            {STATUS_OPTIONS.map(option => (
              <Pressable
                key={option.value}
                style={[styles.modalOption, status === option.value && styles.modalOptionSelected]}
                onPress={() => { setStatusVisible(false); setStatus(option.value); apply(search, option.value); }}
              >
                <Text style={styles.modalOptionText}>{option.label}</Text>
                {status === option.value && <MaterialCommunityIcons name="check" color="#93C5FD" size={20} />}
              </Pressable>
            ))}
            <Pressable style={styles.closeButton} onPress={() => setStatusVisible(false)}>
              <Text style={styles.actionText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
