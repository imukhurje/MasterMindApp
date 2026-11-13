import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api } from '../../../api/client';
import styles from './AdminNotificationHistory.styles';
import { Calendar } from 'react-native-calendars';

const PER_PAGE = 25;

const STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Read', value: 'read' },
  { label: 'Unread', value: 'unread' },
];

function formatDate(value) {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

function dateKey(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).formatToParts(date);

  const get = type => parts.find(part => part.type === type)?.value || '';

  return `${get('year')}-${get('month')}-${get('day')}`;
}

function isValidDate(value) {
  if (!value) return true;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

function formatDisplayDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return 'dd-mm-yyyy';
  }

  const [year, month, day] = value.split('-');
  return `${day}-${month}-${year}`;
}

export default function AdminNotificationHistory() {
  const requestIdRef = useRef(0);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: PER_PAGE,
    total: 0,
    last_page: 1,
  });

  // Draft filters
  const [status, setStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchText, setSearchText] = useState('');

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    search: '',
  });

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [calendarField, setCalendarField] = useState(null);

  const loadHistory = useCallback(async (page = 1) => {
    const requestId = ++requestIdRef.current;

    try {
      setLoading(true);

      const response = await api(
        `/api/notifications/admin/history?page=${page}&per_page=${PER_PAGE}`,
      );

      if (requestId !== requestIdRef.current) return;

      if (response?.ok !== true) {
        throw new Error('Could not load notification history.');
      }

      const rows = Array.isArray(response?.history) ? response.history : [];

      const meta = response?.pagination || {};

      setHistory(rows);

      setPagination({
        page: Number(meta.page ?? page),
        per_page: Number(meta.per_page ?? PER_PAGE),
        total: Number(meta.total ?? rows.length),
        last_page: Math.max(1, Number(meta.last_page ?? 1)),
      });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.log('[NOTIFICATION HISTORY ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      Alert.alert(
        'Notification History',
        error?.message || 'Could not load history.',
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadHistory(1);

    return () => {
      requestIdRef.current += 1;
    };
  }, [loadHistory]);

  // Temporary current-page filtering until the backend
  // search/status/date query contract is confirmed.
  const filteredHistory = useMemo(() => {
    const query = appliedFilters.search.toLowerCase();

    return history.filter(item => {
      const isRead = item?.is_read === true;

      if (appliedFilters.status === 'read' && !isRead) return false;

      if (appliedFilters.status === 'unread' && isRead) return false;

      const itemDate = dateKey(item?.created_at);

      if (appliedFilters.dateFrom && itemDate < appliedFilters.dateFrom)
        return false;

      if (appliedFilters.dateTo && itemDate > appliedFilters.dateTo)
        return false;

      if (query) {
        const searchable = [
          item?.message,
          item?.sender?.name,
          item?.sender?.email,
          item?.recipient?.name,
          item?.recipient?.email,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchable.includes(query)) return false;
      }

      return true;
    });
  }, [history, appliedFilters]);

  const applyFilters = () => {
    const from = dateFrom.trim();
    const to = dateTo.trim();

    if (!isValidDate(from) || !isValidDate(to)) {
      Alert.alert('Invalid Date', 'Please enter dates in YYYY-MM-DD format.');
      return;
    }

    if (from && to && from > to) {
      Alert.alert('Invalid Date Range', 'From date cannot be after To date.');
      return;
    }

    setAppliedFilters({
      status,
      dateFrom: from,
      dateTo: to,
      search: searchText.trim(),
    });
  };

  const clearFilters = () => {
    setStatus('all');
    setDateFrom('');
    setDateTo('');
    setSearchText('');
    setStatusDropdownOpen(false);

    setAppliedFilters({
      status: 'all',
      dateFrom: '',
      dateTo: '',
      search: '',
    });
  };

  const changePage = page => {
    if (
      loading ||
      page < 1 ||
      page > pagination.last_page ||
      page === pagination.page
    )
      return;

    loadHistory(page);
  };

  const pageFrom =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.per_page + 1;

  const pageTo = Math.min(
    (pagination.page - 1) * pagination.per_page + history.length,
    pagination.total,
  );

  return (
    <View style={styles.container}>
      {/* FILTERS */}
      <View style={styles.filterCard}>
        <Pressable
          style={styles.statusSelect}
          onPress={() => setStatusDropdownOpen(previous => !previous)}
        >
          <Text style={styles.statusSelectText}>
            {STATUS_OPTIONS.find(option => option.value === status)?.label}
          </Text>

          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color="#E2E8F0"
          />
        </Pressable>

        {statusDropdownOpen && (
          <View style={styles.statusOptions}>
            {STATUS_OPTIONS.map(option => (
              <Pressable
                key={option.value}
                style={styles.statusOption}
                onPress={() => {
                  setStatus(option.value);
                  setStatusDropdownOpen(false);
                }}
              >
                <Text style={styles.statusOptionText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* From Date and To Date */}
        <View style={styles.dateRow}>
          <Pressable
            onPress={() => setCalendarField('from')}
            style={styles.calendarDateField}
          >
            <View style={styles.calendarDateContent}>
              <Text style={styles.calendarDateLabel}>From Date</Text>
              <Text
                style={[
                  styles.calendarDateValue,
                  !dateFrom && styles.calendarDatePlaceholder,
                ]}
              >
                {formatDisplayDate(dateFrom)}
              </Text>
            </View>

            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={20}
              color="#93C5FD"
            />
          </Pressable>

          <Pressable
            onPress={() => setCalendarField('to')}
            style={styles.calendarDateField}
          >
            <View style={styles.calendarDateContent}>
              <Text style={styles.calendarDateLabel}>To Date</Text>
              <Text
                style={[
                  styles.calendarDateValue,
                  !dateTo && styles.calendarDatePlaceholder,
                ]}
              >
                {formatDisplayDate(dateTo)}
              </Text>
            </View>

            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={20}
              color="#93C5FD"
            />
          </Pressable>
        </View>

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search message, sender, or recipient..."
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
          autoCorrect={false}
          onSubmitEditing={applyFilters}
          returnKeyType="search"
        />

        <View style={styles.filterButtons}>
          <Pressable onPress={applyFilters} style={styles.searchButton}>
            <Text style={styles.buttonText}>Search</Text>
          </Pressable>

          <Pressable onPress={clearFilters} style={styles.clearButton}>
            <Text style={styles.buttonText}>Clear</Text>
          </Pressable>

          <Pressable
            disabled={loading}
            onPress={() => loadHistory(pagination.page)}
            style={[styles.refreshButton, loading && { opacity: 0.5 }]}
          >
            <MaterialCommunityIcons name="refresh" size={19} color="#E2E8F0" />
          </Pressable>
        </View>
      </View>

      <Text style={styles.filterNote}>
        Status, date and text search currently filter this page only.
      </Text>

      {/* SERVER PAGINATION */}
      <View style={styles.paginationRow}>
        <Text style={styles.paginationInfo}>
          Showing {pageFrom}-{pageTo} of {pagination.total} deliveries
        </Text>

        <View style={styles.paginationButtons}>
          <Pressable
            disabled={loading || pagination.page <= 1}
            onPress={() => changePage(pagination.page - 1)}
            style={[
              styles.pageButton,
              (loading || pagination.page <= 1) && styles.disabled,
            ]}
          >
            <Text style={styles.pageButtonText}>Prev</Text>
          </Pressable>

          <View style={styles.pageIndicator}>
            <Text style={styles.pageIndicatorText}>
              {pagination.page} / {pagination.last_page}
            </Text>
          </View>

          <Pressable
            disabled={loading || pagination.page >= pagination.last_page}
            onPress={() => changePage(pagination.page + 1)}
            style={[
              styles.pageButton,
              (loading || pagination.page >= pagination.last_page) &&
                styles.disabled,
            ]}
          >
            <Text style={styles.pageButtonText}>Next</Text>
          </Pressable>
        </View>
      </View>

      {/* HISTORY RECORDS */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#7DD3FC" />
          <Text style={styles.mutedText}>Loading notification history...</Text>
        </View>
      ) : filteredHistory.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No history found</Text>
          <Text style={styles.mutedText}>
            No matching deliveries on this page.
          </Text>
        </View>
      ) : (
        filteredHistory.map(item => (
          <View key={String(item.id)} style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>

              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  {item.is_read ? 'Read' : 'Unread'}
                </Text>
              </View>
            </View>

            <Text style={styles.messageText}>{item.message || '-'}</Text>

            <View style={styles.personSection}>
              <Text style={styles.personLabel}>Sender</Text>
              <Text style={styles.personName}>{item.sender?.name || '-'}</Text>
              <Text style={styles.personEmail}>
                {item.sender?.email || 'No email'}
              </Text>
            </View>

            <View style={styles.personSection}>
              <Text style={styles.personLabel}>Recipient</Text>
              <Text style={styles.personName}>
                {item.recipient?.name || '-'}
              </Text>
              <Text style={styles.personEmail}>
                {item.recipient?.email || 'No email'}
              </Text>
            </View>
          </View>
        ))
      )}

      {/* BOTTOM PAGINATION */}
      {pagination.last_page > 1 && (
        <View style={styles.bottomPagination}>
          <Text style={styles.paginationInfo}>
            Page {pagination.page} of {pagination.last_page}
          </Text>

          <View style={styles.paginationButtons}>
            <Pressable
              disabled={loading || pagination.page <= 1}
              onPress={() => changePage(pagination.page - 1)}
              style={[
                styles.pageButton,
                (loading || pagination.page <= 1) && styles.disabled,
              ]}
            >
              <Text style={styles.pageButtonText}>Prev</Text>
            </Pressable>

            <Pressable
              disabled={loading || pagination.page >= pagination.last_page}
              onPress={() => changePage(pagination.page + 1)}
              style={[
                styles.pageButton,
                (loading || pagination.page >= pagination.last_page) &&
                  styles.disabled,
              ]}
            >
              <Text style={styles.pageButtonText}>Next</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Date Picker Modal */}
      <Modal
        visible={calendarField !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarField(null)}
      >
        <View style={styles.calendarModalOverlay}>
          <View style={styles.calendarModalCard}>
            <View style={styles.calendarModalHeader}>
              <Text style={styles.calendarModalTitle}>
                {calendarField === 'from'
                  ? 'Select From Date'
                  : 'Select To Date'}
              </Text>

              <Pressable
                onPress={() => setCalendarField(null)}
                style={styles.calendarCloseButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Calendar
              key={calendarField || 'calendar'}
              current={
                calendarField === 'from'
                  ? dateFrom || dateTo || undefined
                  : dateTo || dateFrom || undefined
              }
              onDayPress={day => {
                if (calendarField === 'from') {
                  setDateFrom(day.dateString);

                  // Reset invalid end date.
                  if (dateTo && day.dateString > dateTo) {
                    setDateTo('');
                  }
                } else {
                  if (dateFrom && day.dateString < dateFrom) {
                    Alert.alert(
                      'Invalid Date',
                      'To Date cannot be before From Date.',
                    );
                    return;
                  }

                  setDateTo(day.dateString);
                }

                setCalendarField(null);
              }}
              minDate={
                calendarField === 'to' && dateFrom ? dateFrom : undefined
              }
              markedDates={{
                ...(dateFrom
                  ? {
                      [dateFrom]: {
                        selected: true,
                        selectedColor: '#2563EB',
                      },
                    }
                  : {}),
                ...(dateTo
                  ? {
                      [dateTo]: {
                        selected: true,
                        selectedColor: '#38BDF8',
                      },
                    }
                  : {}),
              }}
              theme={{
                calendarBackground: '#142B49',
                dayTextColor: '#F8FAFC',
                monthTextColor: '#F8FAFC',
                textSectionTitleColor: '#AFC0D8',
                arrowColor: '#7DD3FC',
                todayTextColor: '#38BDF8',
                selectedDayBackgroundColor: '#2563EB',
                selectedDayTextColor: '#FFFFFF',
                textDisabledColor: '#475569',
              }}
            />

            <View style={styles.calendarModalActions}>
              <Pressable
                onPress={() => {
                  if (calendarField === 'from') {
                    setDateFrom('');
                  } else {
                    setDateTo('');
                  }
                  setCalendarField(null);
                }}
                style={styles.calendarClearButton}
              >
                <Text style={styles.calendarClearText}>Clear Date</Text>
              </Pressable>

              <Pressable
                onPress={() => setCalendarField(null)}
                style={styles.calendarDoneButton}
              >
                <Text style={styles.calendarDoneText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
