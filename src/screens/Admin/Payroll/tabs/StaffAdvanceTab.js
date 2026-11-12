// src/screens/Admin/Payroll/tabs/StaffAdvanceTab.js

import React, { useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './PayrollTabs.styles';

function money(value, symbol = '₹') {
  return `${symbol}${(Number(value) || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  return value ? String(value).slice(0, 10) : '-';
}

function formatRepaymentMode(value) {
  if (!value) {
    return '-';
  }

  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}

export default function StaffAdvanceTab({
  data,
  staffDirectory = [],
  selectedData,
  selectedStaffId,
  loadingSelected,
  onSelectStaff,
  onNewAdvance,
  onEditAdvance,
}) {
  const [search, setSearch] = useState('');

  const advanceStaff = Array.isArray(data?.staff) ? data.staff : [];

  const detailedStaff = Array.isArray(staffDirectory) ? staffDirectory : [];

  /*
   * Merge the advance staff list with the payroll staff directory
   * so designation and role are available.
   */
  const staff = useMemo(() => {
    return advanceStaff.map(item => {
      const details = detailedStaff.find(
        staffItem => Number(staffItem?.id) === Number(item?.id),
      );

      return {
        ...item,
        designation:
          details?.designation ||
          details?.role ||
          item?.designation ||
          item?.role ||
          '',
        role: details?.role || item?.role || '',
      };
    });
  }, [advanceStaff, detailedStaff]);

  const filteredStaff = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return staff;
    }

    return staff.filter(item => {
      const searchable = [
        item?.name,
        item?.email,
        item?.designation,
        item?.role,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [staff, search]);

  const selectedStaff = useMemo(() => {
    return (
      staff.find(item => Number(item?.id) === Number(selectedStaffId)) || null
    );
  }, [staff, selectedStaffId]);

  const selected = selectedData || data;

  const advances = Array.isArray(selected?.advances) ? selected.advances : [];

  const balance = Array.isArray(selected?.balances)
    ? selected.balances.find(
        item => Number(item?.user_id) === Number(selectedStaffId),
      ) || selected.balances[0]
    : null;

  const currencySymbol =
    selected?.currency_symbol || data?.currency_symbol || '₹';

  const outstandingBalance = Number(balance?.outstanding_balance) || 0;

  const advanceCount = Number(balance?.advance_count) || advances.length || 0;

  return (
    <View style={styles.areaContent}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Staff-wise Advance</Text>

        <Text style={styles.sectionDescription}>
          Review one employee's advance ledger at a time, then record a new
          advance when needed.
        </Text>

        {/* Employee search */}

        <View style={styles.advanceSearchSection}>
          <Text style={styles.fieldLabel}>Search employees</Text>

          <View style={styles.advanceSearchInputWrap}>
            <MaterialCommunityIcons
              name="account-search-outline"
              size={19}
              color="#8FA5BE"
            />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Name, designation, or role"
              placeholderTextColor="#718096"
              style={styles.advanceSearchInput}
            />

            {!!search && (
              <Pressable onPress={() => setSearch('')}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={19}
                  color="#8FA5BE"
                />
              </Pressable>
            )}
          </View>
        </View>

        {/* Employee list */}

        <View style={styles.advanceEmployeeGrid}>
          {filteredStaff.map(item => {
            const active = Number(item.id) === Number(selectedStaffId);

            return (
              <Pressable
                key={String(item.id)}
                disabled={loadingSelected}
                onPress={() => onSelectStaff?.(item.id)}
                style={({ pressed }) => [
                  styles.advanceEmployeeCard,

                  active && styles.advanceEmployeeCardActive,

                  pressed &&
                    !loadingSelected &&
                    styles.advanceEmployeeCardPressed,
                ]}
              >
                <View style={styles.advanceEmployeeAvatar}>
                  <MaterialCommunityIcons
                    name="account"
                    size={22}
                    color={active ? '#FFFFFF' : '#7DD3FC'}
                  />
                </View>

                <View style={styles.advanceEmployeeInfo}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.advanceEmployeeName,

                      active && styles.advanceEmployeeNameActive,
                    ]}
                  >
                    {item.name || '-'}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.advanceEmployeeRole,

                      active && styles.advanceEmployeeRoleActive,
                    ]}
                  >
                    {item.designation || item.role || 'Staff'}
                  </Text>
                </View>

                {active && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color="#34D399"
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        {filteredStaff.length === 0 && (
          <Text style={styles.emptyText}>
            No employees match the current search.
          </Text>
        )}
      </View>

      {/* Selected staff advance workspace */}

      <View style={styles.sectionCard}>
        <View style={styles.advanceLedgerHeader}>
          <View style={styles.advanceLedgerTitleWrap}>
            <Text style={styles.subSectionTitle}>Advance ledger</Text>

            <Text style={styles.advanceSelectedEmployee}>
              {selectedStaff?.name || 'Select employee'}
              {selectedStaff?.designation || selectedStaff?.role
                ? ` · ${selectedStaff.designation || selectedStaff.role}`
                : ''}
            </Text>
          </View>

          {/*
           * New Advance API has not been supplied yet.
           * The button can be connected once that endpoint is available.
           */}
          <Pressable
            onPress={() => {
              if (!selectedStaffId) {
                return;
              }

              onNewAdvance?.({
                staffId: Number(selectedStaffId),
                staff: selectedStaff,
                data: selected,
              });
            }}
            disabled={!selectedStaffId || loadingSelected}
            style={({ pressed }) => [
              styles.newAdvanceButton,

              (!selectedStaffId || loadingSelected) &&
                styles.newAdvanceButtonDisabled,

              pressed &&
                selectedStaffId &&
                !loadingSelected &&
                styles.advanceEmployeeCardPressed,
            ]}
          >
            <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />

            <Text style={styles.newAdvanceButtonText}>New Advance</Text>
          </Pressable>
        </View>

        {loadingSelected ? (
          <View style={styles.loadingSection}>
            <ActivityIndicator size="small" color="#60A5FA" />

            <Text style={styles.loadingText}>Loading staff advances...</Text>
          </View>
        ) : (
          <>
            {/* Net pay */}

            <View style={styles.advanceSummaryCard}>
              <View style={styles.advanceSummaryTextWrap}>
                <Text style={styles.advanceSummaryLabel}>
                  Current net pay before advance adjustments
                </Text>

                {!!selected?.net_pay?.period_label && (
                  <Text style={styles.advanceSummarySubLabel}>
                    {selected.net_pay.period_label}
                  </Text>
                )}
              </View>

              <Text style={styles.advanceSummaryValue}>
                {selected?.net_pay
                  ? money(selected.net_pay.amount, currencySymbol)
                  : '-'}
              </Text>
            </View>

            {/* Outstanding */}

            <View style={styles.advanceSummaryCard}>
              <View style={styles.advanceSummaryTextWrap}>
                <Text style={styles.advanceSummaryLabel}>
                  Outstanding advance balance
                </Text>

                <Text style={styles.advanceSummarySubLabel}>
                  {advanceCount} advance(s) recorded
                </Text>
              </View>

              <Text style={styles.advanceOutstandingValue}>
                {money(outstandingBalance, currencySymbol)}
              </Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.subSectionTitle}>Advance records</Text>

            {advances.length === 0 ? (
              <View style={styles.advanceEmptyCard}>
                <MaterialCommunityIcons
                  name="cash-remove"
                  size={31}
                  color="#718096"
                />

                <Text style={styles.advanceEmptyTitle}>No advances</Text>

                <Text style={styles.advanceEmptyText}>
                  No advance entries were found for this employee.
                </Text>
              </View>
            ) : (
              advances.map(item => (
                <View key={String(item.id)} style={styles.advanceRecordCard}>
                  <View style={styles.advanceRecordHeader}>
                    <View style={styles.advanceRecordHeaderText}>
                      <Text style={styles.advanceReference}>
                        {item.reference || '-'}
                      </Text>

                      {!!item.notes && (
                        <Text
                          numberOfLines={2}
                          style={styles.advanceRecordNote}
                        >
                          {item.notes}
                        </Text>
                      )}
                    </View>

                    <View style={styles.advanceRecordHeaderActions}>
                      <View
                        style={[
                          styles.statusBadge,

                          item.status === 'open'
                            ? styles.draftBadge
                            : styles.activeBadge,
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {String(item.status || '-').toUpperCase()}
                        </Text>
                      </View>

                      {Array.isArray(item?.repayment_schedule) &&
                        item.repayment_schedule.length > 0 && (
                          <Pressable
                            onPress={() => onEditAdvance?.(item)}
                            style={({ pressed }) => [
                              styles.editAdvanceButton,

                              pressed && styles.editAdvanceButtonPressed,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="pencil-outline"
                              size={18}
                              color="#FFFFFF"
                            />
                          </Pressable>
                        )}
                    </View>
                  </View>

                  <View style={styles.advanceRecordDivider} />

                  <View style={styles.advanceRecordGrid}>
                    <View style={styles.advanceRecordItem}>
                      <Text style={styles.infoLabel}>Issued on</Text>

                      <Text style={styles.infoValue}>
                        {formatDate(item.issued_on)}
                      </Text>
                    </View>

                    <View style={styles.advanceRecordItem}>
                      <Text style={styles.infoLabel}>Original</Text>

                      <Text style={styles.infoValue}>
                        {money(item.original_amount, currencySymbol)}
                      </Text>
                    </View>

                    <View style={styles.advanceRecordItem}>
                      <Text style={styles.infoLabel}>Outstanding</Text>

                      <Text style={styles.warningValue}>
                        {money(item.outstanding_amount, currencySymbol)}
                      </Text>
                    </View>

                    <View style={styles.advanceRecordItem}>
                      <Text style={styles.infoLabel}>Method</Text>

                      <Text style={styles.infoValue}>
                        {formatRepaymentMode(item.disbursement_method)}
                      </Text>
                    </View>

                    <View style={styles.advanceRecordItem}>
                      <Text style={styles.infoLabel}>Repayment</Text>

                      <Text style={styles.infoValue}>
                        {formatRepaymentMode(item.repayment_mode)}
                      </Text>
                    </View>

                    <View style={styles.advanceRecordItem}>
                      <Text style={styles.infoLabel}>Schedule</Text>

                      <Text style={styles.infoValue}>
                        {Array.isArray(item.repayment_schedule)
                          ? item.repayment_schedule.length
                          : 0}{' '}
                        period(s)
                      </Text>
                    </View>
                  </View>

                  {Array.isArray(item.repayment_schedule) &&
                    item.repayment_schedule.length > 0 && (
                      <View style={styles.repaymentScheduleBox}>
                        <Text style={styles.repaymentScheduleTitle}>
                          Repayment schedule
                        </Text>

                        {item.repayment_schedule.map((schedule, index) => (
                          <View
                            key={`${item.id}-${schedule.period}-${index}`}
                            style={styles.repaymentScheduleRow}
                          >
                            <Text style={styles.repaymentPeriod}>
                              {schedule.period || '-'}
                            </Text>

                            <Text style={styles.repaymentAmount}>
                              {money(schedule.amount, currencySymbol)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}

                  {!!item?.journal_entry?.entry_number && (
                    <View style={styles.advanceJournalRow}>
                      <MaterialCommunityIcons
                        name="book-open-page-variant-outline"
                        size={16}
                        color="#7DD3FC"
                      />

                      <Text style={styles.advanceJournalText}>
                        {item.journal_entry.entry_number}
                      </Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </>
        )}
      </View>
    </View>
  );
}
