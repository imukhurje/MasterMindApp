import React, { useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './PayrollRunReviewModal.styles';

function normalizeStatus(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

export default function PayrollRunReviewModal({
  visible,
  data,
  loading = false,
  onClose,
  onRefresh,
  onVerifyOne,
  onVerifyAll,
}) {
  const { width } = useWindowDimensions();

  const [search, setSearch] = useState('');

  const isWide = width >= 700;

  const rows = Array.isArray(data?.rows) ? data.rows : [];

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return rows;
    }

    return rows.filter(item => {
      return [item?.name, item?.designation, item?.status, item?.payslip_number]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(keyword);
    });
  }, [rows, search]);

  const settledRows = useMemo(() => {
    return rows.filter(item => normalizeStatus(item?.status) === 'settled');
  }, [rows]);

  function renderVerification(item) {
    const status = normalizeStatus(item?.status);

    if (status === 'verified') {
      return (
        <View style={styles.verifiedIcon}>
          <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
        </View>
      );
    }

    if (status === 'settled') {
      return (
        <Pressable
          disabled={!onVerifyOne}
          onPress={() => onVerifyOne?.(item)}
          style={({ pressed }) => [
            styles.verifyButton,
            !onVerifyOne && styles.buttonDisabled,
            pressed && !!onVerifyOne && styles.buttonPressed,
          ]}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </Pressable>
      );
    }

    return <Text style={styles.dashText}>—</Text>;
  }

  function renderWideRow(item) {
    return (
      <View key={String(item.user_id)} style={styles.tableRow}>
        <View style={[styles.tableCell, styles.statusColumn]}>
          <Text style={styles.statusText}>{item.status || '-'}</Text>
        </View>

        <View style={[styles.tableCell, styles.verifyColumn]}>
          {renderVerification(item)}
        </View>

        <View style={[styles.tableCell, styles.staffColumn]}>
          <Text style={styles.staffName}>{item.name || '-'}</Text>

          <Text style={styles.staffDesignation}>
            {item.designation || 'Staff'}
          </Text>
        </View>

        <View style={[styles.tableCell, styles.payslipColumn]}>
          <Text style={styles.payslipText}>{item.payslip_number || '—'}</Text>
        </View>
      </View>
    );
  }

  function renderMobileRow(item) {
    return (
      <View key={String(item.user_id)} style={styles.mobileCard}>
        <View style={styles.mobileCardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.staffName}>{item.name || '-'}</Text>

            <Text style={styles.staffDesignation}>
              {item.designation || 'Staff'}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              normalizeStatus(item.status) === 'verified' &&
                styles.verifiedStatusBadge,
              normalizeStatus(item.status) === 'settled' &&
                styles.settledStatusBadge,
              normalizeStatus(item.status) === 'unsettled' &&
                styles.unsettledStatusBadge,
            ]}
          >
            <Text style={styles.statusBadgeText}>{item.status || '-'}</Text>
          </View>
        </View>

        <View style={styles.mobileInfoRow}>
          <View style={styles.mobileInfoBlock}>
            <Text style={styles.mobileLabel}>Payslip</Text>

            <Text style={styles.mobileValue}>{item.payslip_number || '—'}</Text>
          </View>

          <View style={styles.mobileVerifyBlock}>
            <Text style={styles.mobileLabel}>Verification</Text>

            <View style={styles.mobileVerification}>
              {renderVerification(item)}
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Payroll Run Review</Text>

              <Text style={styles.subtitle}>
                Review {data?.period?.label || 'payroll period'}
              </Text>
            </View>

            <Pressable
              disabled={loading}
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <MaterialCommunityIcons name="close" size={23} color="#FFFFFF" />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#60A5FA" />

              <Text style={styles.loadingText}>
                Loading payroll run review...
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.toolbar}>
                <View style={styles.searchSection}>
                  <Text style={styles.fieldLabel}>Search payslips</Text>

                  <View style={styles.searchBox}>
                    <MaterialCommunityIcons
                      name="magnify"
                      size={20}
                      color="#8FA5BE"
                    />

                    <TextInput
                      value={search}
                      onChangeText={setSearch}
                      placeholder="Name or designation"
                      placeholderTextColor="#718096"
                      style={styles.searchInput}
                    />
                  </View>
                </View>

                <View style={styles.mobileActionRow}>
                  {!!onRefresh && (
                    <Pressable
                      onPress={onRefresh}
                      style={({ pressed }) => [
                        styles.refreshButton,
                        pressed && styles.buttonPressed,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="refresh"
                        size={20}
                        color="#FFFFFF"
                      />

                      <Text style={styles.refreshButtonText}>Refresh</Text>
                    </Pressable>
                  )}

                  <Pressable
                    disabled={settledRows.length === 0 || !onVerifyAll}
                    onPress={() => onVerifyAll?.(settledRows)}
                    style={({ pressed }) => [
                      styles.verifyAllButton,

                      (settledRows.length === 0 || !onVerifyAll) &&
                        styles.buttonDisabled,

                      pressed &&
                        settledRows.length > 0 &&
                        !!onVerifyAll &&
                        styles.buttonPressed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="check-all"
                      size={18}
                      color="#FFFFFF"
                    />

                    <Text numberOfLines={1} style={styles.verifyAllButtonText}>
                      Verify all Settled Payslips
                    </Text>
                  </Pressable>
                </View>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {filteredRows.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <MaterialCommunityIcons
                      name="file-document-alert-outline"
                      size={34}
                      color="#718096"
                    />

                    <Text style={styles.emptyTitle}>No payroll records</Text>

                    <Text style={styles.emptyText}>
                      No payroll review rows match the current search.
                    </Text>
                  </View>
                ) : isWide ? (
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <View
                        style={[styles.tableHeaderCell, styles.statusColumn]}
                      >
                        <Text style={styles.tableHeaderText}>Status</Text>
                      </View>

                      <View
                        style={[styles.tableHeaderCell, styles.verifyColumn]}
                      >
                        <Text style={styles.tableHeaderText}>Verification</Text>
                      </View>

                      <View
                        style={[styles.tableHeaderCell, styles.staffColumn]}
                      >
                        <Text style={styles.tableHeaderText}>Staff member</Text>
                      </View>

                      <View
                        style={[styles.tableHeaderCell, styles.payslipColumn]}
                      >
                        <Text style={styles.tableHeaderText}>Payslip</Text>
                      </View>
                    </View>

                    {filteredRows.map(renderWideRow)}
                  </View>
                ) : (
                  <View style={styles.mobileList}>
                    {filteredRows.map(renderMobileRow)}
                  </View>
                )}
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
