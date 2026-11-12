// src/screens/Admin/Accounts/tabs/ReportsTab.js

import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ReactNativeBlobUtil from 'react-native-blob-util';

import { api, absoluteUrl, getToken } from '../../../../api/client';

import DatePickerModal from '../modals/DatePickerModal';

import RunReportModal from '../modals/RunReportModal';

import {
  formatDisplayDate,
  getSevenDaysAgoIso,
  getTodayIso,
} from '../utils/accountsHelpers';

import styles from './ReportsTab.styles';

const BASE = '/api/plugins/financial-accounting';

function formatMoney(value) {
  return `₹${Number(value || 0).toFixed(2)}`;
}

function flattenTrialBalance(response) {
  const data = response?.data || {};

  const filters = data?.filters || {};

  const accounts = Array.isArray(data?.accounts) ? data.accounts : [];

  const totals = data?.totals || {};

  const rows = [];

  if (filters?.date_from) {
    rows.push({
      id: 'filter-date-from',
      label: 'Filters / Date From',
      date: filters.date_from,
      debit: 0,
      credit: 0,
    });
  }

  if (filters?.date_to) {
    rows.push({
      id: 'filter-date-to',
      label: 'Filters / Date To',
      date: filters.date_to,
      debit: 0,
      credit: 0,
    });
  }

  accounts.forEach((item, index) => {
    const code = item?.code || item?.account_code || '';

    const name = item?.name || item?.account_name || '';

    rows.push({
      id: item?.id ?? `account-${index}`,

      label: [code, name].filter(Boolean).join(' - ') || `Account ${index + 1}`,

      date: '-',

      debit: Number(item?.debit ?? item?.debit_balance ?? 0) || 0,

      credit: Number(item?.credit ?? item?.credit_balance ?? 0) || 0,
    });
  });

  rows.push({
    id: 'totals',
    label: 'Totals',
    date: '-',
    debit: Number(totals?.debit) || 0,
    credit: Number(totals?.credit) || 0,
  });

  return rows;
}

export default function ReportsTab() {
  const [dateFrom, setDateFrom] = useState(getSevenDaysAgoIso());

  const [dateTo, setDateTo] = useState(getTodayIso());

  const [search, setSearch] = useState('');

  const [minAmount, setMinAmount] = useState('');

  const [maxAmount, setMaxAmount] = useState('');

  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: getSevenDaysAgoIso(),
    dateTo: getTodayIso(),
    search: '',
    minAmount: '',
    maxAmount: '',
  });

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [calendarTarget, setCalendarTarget] = useState(null);

  const [reportModalVisible, setReportModalVisible] = useState(false);

  const [runningReport, setRunningReport] = useState(false);

  const [reportResult, setReportResult] = useState(null);

  const [reportRows, setReportRows] = useState([]);

  const [downloadingType, setDownloadingType] = useState(null);

  const filteredRows = useMemo(() => {
    const {
      dateFrom: appliedFrom,
      dateTo: appliedTo,
      search: appliedSearch,
      minAmount: appliedMin,
      maxAmount: appliedMax,
    } = appliedFilters;

    const searchText = String(appliedSearch || '')
      .trim()
      .toLowerCase();

    const min = appliedMin === '' ? null : Number(appliedMin);

    const max = appliedMax === '' ? null : Number(appliedMax);

    return reportRows.filter(item => {
      const itemDate = item?.date && item.date !== '-' ? item.date : '';

      if (appliedFrom && itemDate && itemDate < appliedFrom) {
        return false;
      }

      if (appliedTo && itemDate && itemDate > appliedTo) {
        return false;
      }

      if (searchText) {
        const haystack = [item?.label, item?.date]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(searchText)) {
          return false;
        }
      }

      const debit = Number(item?.debit) || 0;

      const credit = Number(item?.credit) || 0;

      const amount = Math.max(debit, credit);

      if (min !== null && Number.isFinite(min) && amount < min) {
        return false;
      }

      if (max !== null && Number.isFinite(max) && amount > max) {
        return false;
      }

      return true;
    });
  }, [reportRows, appliedFilters]);

  function openCalendar(target) {
    setCalendarTarget(target);
    setCalendarVisible(true);
  }

  function closeCalendar() {
    setCalendarVisible(false);
    setCalendarTarget(null);
  }

  function handleCalendarDayPress(day) {
    const value = day?.dateString;

    if (!value) {
      return;
    }

    if (calendarTarget === 'from') {
      setDateFrom(value);

      if (dateTo && value > dateTo) {
        setDateTo(value);
      }
    }

    if (calendarTarget === 'to') {
      setDateTo(value);

      if (dateFrom && value < dateFrom) {
        setDateFrom(value);
      }
    }

    closeCalendar();
  }

  function applyFilters() {
    setAppliedFilters({
      dateFrom,
      dateTo,
      search: search.trim(),
      minAmount: minAmount.trim(),
      maxAmount: maxAmount.trim(),
    });
  }

  function clearDateFilters() {
    setDateFrom('');
    setDateTo('');

    setAppliedFilters(current => ({
      ...current,
      dateFrom: '',
      dateTo: '',
    }));
  }

  const handleRunReport = useCallback(
    async ({ dateFrom: requestedFrom, dateTo: requestedTo }) => {
      if (runningReport) {
        return;
      }

      try {
        setRunningReport(true);

        const path =
          `${BASE}/reports/trial-balance` +
          `?date_from=${encodeURIComponent(requestedFrom)}` +
          `&date_to=${encodeURIComponent(requestedTo)}`;

        const response = await api(path, {
          method: 'GET',
        });

        if (response?.ok === false) {
          throw new Error(response?.message || 'Could not run the report.');
        }

        setReportResult(response);

        setReportRows(flattenTrialBalance(response));

        /*
         * Keep page filters in sync
         * with the report window.
         */
        setDateFrom(requestedFrom);

        setDateTo(requestedTo);

        setAppliedFilters(current => ({
          ...current,

          dateFrom: requestedFrom,

          dateTo: requestedTo,
        }));

        setReportModalVisible(false);
      } catch (error) {
        console.log('Run trial balance report error:', error);

        Alert.alert(
          'Run Report',
          error?.message || 'Could not run the trial balance report.',
        );
      } finally {
        setRunningReport(false);
      }
    },
    [runningReport],
  );

  const saveReportFile = useCallback(
    async type => {
      if (downloadingType || !reportResult) {
        return;
      }

      const isPdf = type === 'pdf';

      const extension = isPdf ? 'pdf' : 'docx';

      const mimeType = isPdf
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      const endpoint = `${BASE}/reports/trial-balance/${extension}`;

      const from = reportResult?.data?.filters?.date_from || dateFrom || 'from';

      const to = reportResult?.data?.filters?.date_to || dateTo || 'to';

      const fileName = `trial_balance_${from}_to_${to}.${extension}`;

      let tempPath = null;

      try {
        setDownloadingType(type);

        const token = await getToken();

        if (!token) {
          throw new Error(
            'Your login session could not be found. Please log in again.',
          );
        }

        const response = await ReactNativeBlobUtil.config({
          fileCache: true,

          appendExt: extension,
        }).fetch('POST', absoluteUrl(endpoint), {
          Authorization: `Bearer ${token}`,

          Accept: mimeType,

          'Content-Type': 'application/json',
        });

        const info = response.info();

        const statusCode = Number(info?.status);

        if (
          !Number.isFinite(statusCode) ||
          statusCode < 200 ||
          statusCode >= 300
        ) {
          throw new Error(
            `${isPdf ? 'PDF' : 'DOCX'} download failed with HTTP ${
              statusCode || 'unknown'
            }.`,
          );
        }

        tempPath = response.path();

        if (!tempPath) {
          throw new Error('Downloaded report file path was not returned.');
        }

        if (Platform.OS === 'android') {
          const savedUri =
            await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
              {
                name: fileName,

                parentFolder: 'Accounts',

                mimeType,
              },

              'Download',

              tempPath,
            );

          if (!savedUri) {
            throw new Error('Could not save the report to Downloads.');
          }

          Alert.alert(
            'Download Complete',
            `Report saved in:\n\nDownloads/Accounts\n\n${fileName}`,
          );
        } else {
          const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

          await ReactNativeBlobUtil.fs.cp(tempPath, destination);

          Alert.alert(
            'Download Complete',
            `Report saved in Documents:\n\n${fileName}`,
          );
        }
      } catch (error) {
        console.log(`${type} report download error:`, error);

        Alert.alert(
          isPdf ? 'Download PDF' : 'Download DOCX',

          error?.message || 'Could not download the report.',
        );
      } finally {
        if (tempPath) {
          try {
            const exists = await ReactNativeBlobUtil.fs.exists(tempPath);

            if (exists) {
              await ReactNativeBlobUtil.fs.unlink(tempPath);
            }
          } catch (cleanupError) {
            console.log('Report temp cleanup error:', cleanupError);
          }
        }

        setDownloadingType(null);
      }
    },
    [downloadingType, reportResult, dateFrom, dateTo],
  );

  return (
    <>
      <View style={styles.areaContent}>
        <View style={styles.secondaryTabs}>
          <View style={styles.secondaryTabActive}>
            <MaterialCommunityIcons
              name="chart-box-outline"
              size={16}
              color="#FFFFFF"
            />

            <Text style={styles.secondaryTabTextActive}>Reports</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Run a report</Text>

          <Text style={styles.sectionDescription}>
            Choose a report and date window, then inspect the latest result
            below.
          </Text>

          <Pressable
            onPress={() => setReportModalVisible(true)}
            style={({ pressed }) => [
              styles.primaryButton,

              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons
              name="play-circle-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.primaryButtonText}>Run a report</Text>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Latest report result</Text>

          <Text style={styles.sectionDescription}>
            The latest report is flattened into table rows so it is easier to
            scan.
          </Text>

          {reportResult && (
            <View style={styles.downloadRow}>
              <Pressable
                disabled={downloadingType !== null}
                onPress={() => saveReportFile('pdf')}
                style={[
                  styles.downloadPrimaryButton,

                  downloadingType !== null && styles.buttonDisabled,
                ]}
              >
                {downloadingType === 'pdf' ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <MaterialCommunityIcons
                    name="file-pdf-box"
                    size={18}
                    color="#FFFFFF"
                  />
                )}

                <Text style={styles.downloadPrimaryText}>
                  {downloadingType === 'pdf'
                    ? 'Downloading...'
                    : 'Download PDF'}
                </Text>
              </Pressable>

              <Pressable
                disabled={downloadingType !== null}
                onPress={() => saveReportFile('docx')}
                style={[
                  styles.downloadOutlineButton,

                  downloadingType !== null && styles.buttonDisabled,
                ]}
              >
                {downloadingType === 'docx' ? (
                  <ActivityIndicator size="small" color="#F1F5F9" />
                ) : (
                  <MaterialCommunityIcons
                    name="file-word-outline"
                    size={18}
                    color="#F1F5F9"
                  />
                )}

                <Text style={styles.downloadOutlineText}>
                  {downloadingType === 'docx'
                    ? 'Downloading...'
                    : 'Download Docx'}
                </Text>
              </Pressable>
            </View>
          )}

          <View style={styles.filterHeader}>
            <Pressable
              onPress={clearDateFilters}
              style={({ pressed }) => [
                styles.clearDateButton,

                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="calendar-remove-outline"
                size={17}
                color="#F1F5F9"
              />

              <Text style={styles.clearDateButtonText}>Clear date filters</Text>
            </Pressable>
          </View>

          <View style={styles.filterRow}>
            <View style={styles.filterField}>
              <Text style={styles.filterLabel}>Date from</Text>

              <Pressable
                onPress={() => openCalendar('from')}
                style={styles.dateButton}
              >
                <Text
                  style={[
                    styles.dateButtonText,

                    !dateFrom && styles.placeholder,
                  ]}
                >
                  {dateFrom ? formatDisplayDate(dateFrom) : 'dd-mm-yyyy'}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={18}
                  color="#A8B6C9"
                />
              </Pressable>
            </View>

            <View style={styles.filterField}>
              <Text style={styles.filterLabel}>Date to</Text>

              <Pressable
                onPress={() => openCalendar('to')}
                style={styles.dateButton}
              >
                <Text
                  style={[styles.dateButtonText, !dateTo && styles.placeholder]}
                >
                  {dateTo ? formatDisplayDate(dateTo) : 'dd-mm-yyyy'}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={18}
                  color="#A8B6C9"
                />
              </Pressable>
            </View>
          </View>

          <Text style={styles.filterLabel}>Search text</Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search report rows..."
            placeholderTextColor="#718096"
            style={styles.filterInput}
            returnKeyType="search"
            onSubmitEditing={applyFilters}
          />

          <View style={styles.filterRow}>
            <View style={styles.filterField}>
              <Text style={styles.filterLabel}>Min amount</Text>

              <TextInput
                value={minAmount}
                onChangeText={setMinAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#718096"
                style={styles.filterInputNoMargin}
              />
            </View>

            <View style={styles.filterField}>
              <Text style={styles.filterLabel}>Max amount</Text>

              <TextInput
                value={maxAmount}
                onChangeText={setMaxAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#718096"
                style={styles.filterInputNoMargin}
              />
            </View>
          </View>

          <Pressable
            onPress={applyFilters}
            style={({ pressed }) => [
              styles.applyFilterButton,

              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons
              name="filter-outline"
              size={18}
              color="#F1F5F9"
            />

            <Text style={styles.applyFilterButtonText}>Apply filters</Text>
          </Pressable>

          <View style={styles.divider} />

          {filteredRows.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="file-chart-outline"
                size={32}
                color="#718096"
              />

              <Text style={styles.emptyTitle}>No report result</Text>

              <Text style={styles.emptyText}>
                Run a report to see rows here.
              </Text>
            </View>
          ) : (
            <View style={styles.cardList}>
              {filteredRows.map(item => (
                <View key={String(item.id)} style={styles.reportCard}>
                  <View style={styles.reportCardHeader}>
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text style={styles.reportCardTitle}>{item.label}</Text>

                      <Text style={styles.reportCardDate}>{item.date}</Text>
                    </View>

                    <MaterialCommunityIcons
                      name="chart-line"
                      size={21}
                      color="#7DD3FC"
                    />
                  </View>

                  <View style={styles.dataDivider} />

                  <View style={styles.amountRow}>
                    <View style={styles.amountItem}>
                      <Text style={styles.amountLabel}>Debit</Text>

                      <Text style={styles.debitValue}>
                        {formatMoney(item.debit)}
                      </Text>
                    </View>

                    <View style={styles.amountItem}>
                      <Text style={styles.amountLabel}>Credit</Text>

                      <Text style={styles.creditValue}>
                        {formatMoney(item.credit)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.resultCount}>
            Showing {filteredRows.length} of {reportRows.length}
          </Text>
        </View>
      </View>

      <RunReportModal
        visible={reportModalVisible}
        submitting={runningReport}
        initialDateFrom={dateFrom || getSevenDaysAgoIso()}
        initialDateTo={dateTo || getTodayIso()}
        onClose={() => {
          if (!runningReport) {
            setReportModalVisible(false);
          }
        }}
        onSubmit={handleRunReport}
      />

      <DatePickerModal
        visible={calendarVisible}
        title="Select Date"
        subtitle={
          calendarTarget === 'from'
            ? 'Select starting date'
            : 'Select ending date'
        }
        selectedDate={
          calendarTarget === 'from'
            ? dateFrom || undefined
            : dateTo || undefined
        }
        minDate={calendarTarget === 'to' ? dateFrom || undefined : undefined}
        maxDate={calendarTarget === 'from' ? dateTo || undefined : undefined}
        onClose={closeCalendar}
        onDayPress={handleCalendarDayPress}
      />
    </>
  );
}
