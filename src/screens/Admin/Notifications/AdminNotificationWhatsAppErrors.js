import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../api/client';
import styles from './AdminNotificationWhatsAppErrors.styles';

const PER_PAGE = 100;

const BASE_URL = '/api/notifications/admin/auto/whatsapp-errors';

const asText = value => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'object') {
    return value.name || value.label || value.title || '—';
  }

  return String(value);
};

const formatDate = value => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return asText(value);
  }

  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// Fallback mapping until a non-empty errors response
// confirms the exact fields returned by the backend.
const getErrorDetails = item => ({
  date: formatDate(item.created_at ?? item.sent_at ?? item.date),
  event: asText(item.event_label ?? item.event_type ?? item.event),
  recipient: asText(
    item.recipient?.name ??
      item.recipient_name ??
      item.recipient ??
      item.recipient_id,
  ),
  rule: asText(item.rule?.name ?? item.rule_name ?? item.rule ?? item.rule_id),
  reason: asText(
    item.reason ?? item.error_message ?? item.error ?? item.message,
  ),
});

export default function AdminNotificationWhatsAppErrors() {
  const requestIdRef = useRef(0);

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: PER_PAGE,
    total: 0,
    last_page: 1,
  });

  const loadErrors = useCallback(async (page = 1, isRefresh = false) => {
    const requestId = ++requestIdRef.current;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const url =
        `${BASE_URL}?per_page=${PER_PAGE}` + (page > 1 ? `&page=${page}` : '');

      const response = await api(url);

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (response?.ok !== true) {
        throw new Error('Could not load WhatsApp send errors.');
      }

      const rows = Array.isArray(response.errors) ? response.errors : [];

      const pageInfo = response.pagination || {};

      setErrors(rows);

      setPagination({
        page: Number(pageInfo.page ?? page),
        per_page: Number(pageInfo.per_page ?? PER_PAGE),
        total: Number(pageInfo.total ?? rows.length),
        last_page: Math.max(1, Number(pageInfo.last_page ?? 1)),
      });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.log('[WHATSAPP SEND ERRORS API ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      Alert.alert(
        'WhatsApp Send Errors',
        error?.message || 'Unable to load WhatsApp send errors.',
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    loadErrors(1);

    return () => {
      requestIdRef.current += 1;
    };
  }, [loadErrors]);

  const changePage = nextPage => {
    if (loading || refreshing) return;

    if (
      nextPage < 1 ||
      nextPage > pagination.last_page ||
      nextPage === pagination.page
    ) {
      return;
    }

    loadErrors(nextPage);
  };

  const renderMobileError = (item, index) => {
    const details = getErrorDetails(item);

    return (
      <View key={String(item.id ?? index)} style={styles.mobileCard}>
        <View style={styles.mobileHeader}>
          <Text style={styles.mobileDate}>{details.date}</Text>

          <View style={styles.errorBadge}>
            <Text style={styles.errorBadgeText}>Send Error</Text>
          </View>
        </View>

        {[
          ['Event', details.event],
          ['Recipient', details.recipient],
          ['Rule', details.rule],
          ['Reason', details.reason],
        ].map(([label, value]) => (
          <View key={label} style={styles.mobileDetailRow}>
            <Text style={styles.mobileDetailLabel}>{label}</Text>

            <Text style={styles.mobileDetailValue}>{value}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderDesktopError = (item, index) => {
    const details = getErrorDetails(item);

    return (
      <View key={String(item.id ?? index)} style={styles.tableRow}>
        <Text style={[styles.cellText, styles.dateColumn]}>{details.date}</Text>

        <Text style={[styles.cellText, styles.eventColumn]}>
          {details.event}
        </Text>

        <Text style={[styles.cellText, styles.recipientColumn]}>
          {details.recipient}
        </Text>

        <Text style={[styles.cellText, styles.ruleColumn]}>{details.rule}</Text>

        <Text style={[styles.cellText, styles.reasonColumn]}>
          {details.reason}
        </Text>
      </View>
    );
  };

  const start =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.per_page + 1;

  const end =
    pagination.total === 0
      ? 0
      : Math.min(start + errors.length - 1, pagination.total);

  return (
    <View style={styles.container}>
      {/* Header and Refresh */}
      <View style={styles.topBar}>
        <View style={styles.topBarText}>
          <Text style={styles.title}>WhatsApp Send Errors</Text>

          <Text style={styles.subtitle}>
            Review notification delivery errors.
          </Text>
        </View>

        <Pressable
          onPress={() => loadErrors(pagination.page, true)}
          disabled={loading || refreshing}
          style={styles.refreshButton}
          accessibilityRole="button"
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialCommunityIcons name="refresh" size={18} color="#FFFFFF" />
          )}
        </Pressable>
      </View>

      {/* Errors */}

      {/* WhatsApp Send Errors - Mobile Only */}
      {loading ? (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="large" color="#7DD3FC" />
          <Text style={styles.emptyText}>Loading WhatsApp send errors...</Text>
        </View>
      ) : errors.length === 0 ? (
        <View style={styles.mobileCard}>
          <Text style={styles.emptyText}>No WhatsApp send errors found.</Text>
        </View>
      ) : (
        <View style={styles.mobileList}>{errors.map(renderMobileError)}</View>
      )}

      {/* Pagination */}
      {!loading && pagination.total > 0 && (
        <View style={styles.paginationRow}>
          <Text style={styles.paginationInfo}>
            Showing {start}-{end} of {pagination.total}
          </Text>

          <View style={styles.paginationButtons}>
            <Pressable
              onPress={() => changePage(pagination.page - 1)}
              disabled={loading || refreshing || pagination.page <= 1}
              style={[
                styles.pageButton,
                pagination.page <= 1 && styles.disabledButton,
              ]}
            >
              <Text style={styles.pageButtonText}>Prev</Text>
            </Pressable>

            <View style={styles.pageBadge}>
              <Text style={styles.pageBadgeText}>
                {pagination.page} / {pagination.last_page}
              </Text>
            </View>

            <Pressable
              onPress={() => changePage(pagination.page + 1)}
              disabled={
                loading || refreshing || pagination.page >= pagination.last_page
              }
              style={[
                styles.pageButton,
                pagination.page >= pagination.last_page &&
                  styles.disabledButton,
              ]}
            >
              <Text style={styles.pageButtonText}>Next</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
