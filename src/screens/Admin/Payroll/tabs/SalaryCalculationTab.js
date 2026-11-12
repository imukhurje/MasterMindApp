import React, { useEffect, useMemo, useState } from 'react';

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
  if (!value) {
    return '-';
  }

  return String(value).slice(0, 10);
}

function getStaffRole(item) {
  return item?.designation || item?.role || 'Staff';
}

export default function SalaryCalculationTab({
  data,
  currencySymbol = '₹',
  loading = false,
  onRefresh,
  onEditCalculation,
  onDownloadPayslip,
  downloadingPayslipId,
  onCompletePayrollRun,
}) {
  const [search, setSearch] = useState('');

  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const staff = useMemo(() => {
    return Array.isArray(data?.staff) ? data.staff : [];
  }, [data?.staff]);

  const calculations = useMemo(() => {
    return Array.isArray(data?.calculations) ? data.calculations : [];
  }, [data?.calculations]);

  const eligiblePeriod = data?.eligible_period || null;

  const eligibleStart = eligiblePeriod?.start
    ? String(eligiblePeriod.start).slice(0, 10)
    : null;

  function getCurrentCalculation(userId) {
    const userCalculations = calculations.filter(
      item => Number(item?.user_id) === Number(userId),
    );

    if (!eligibleStart) {
      return userCalculations[0] || null;
    }

    return (
      userCalculations.find(item => {
        return formatDate(item?.period_start) === eligibleStart;
      }) || null
    );
  }

  /*
   * Order:
   * 1. Draft/incomplete staff
   * 2. Staff without calculation
   * 3. Paid staff
   *
   * This matches the desktop screenshot where Dipak,
   * whose salary is already paid, appears after pending staff.
   */
  const sortedStaff = useMemo(() => {
    return [...staff].sort((a, b) => {
      const calcA = getCurrentCalculation(a.id);
      const calcB = getCurrentCalculation(b.id);

      const score = calculation => {
        if (calculation?.status === 'draft') {
          return 0;
        }

        if (!calculation) {
          return 1;
        }

        if (calculation?.status === 'paid') {
          return 2;
        }

        return 1;
      };

      return score(calcA) - score(calcB);
    });
  }, [staff, calculations, eligibleStart]);

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return sortedStaff;
    }

    return sortedStaff.filter(item => {
      return [item?.name, item?.email, item?.designation, item?.role]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [sortedStaff, search]);

  /*
   * Default selection:
   * Prefer the first draft calculation.
   *
   * With the supplied response this selects Kundan Mistry,
   * which matches the screenshot.
   */
  useEffect(() => {
    if (selectedStaffId) {
      const stillExists = staff.some(
        item => Number(item?.id) === Number(selectedStaffId),
      );

      if (stillExists) {
        return;
      }
    }

    const draftCalculation = calculations.find(item => {
      if (item?.status !== 'draft') {
        return false;
      }

      if (!eligibleStart) {
        return true;
      }

      return formatDate(item?.period_start) === eligibleStart;
    });

    const defaultStaffId =
      Number(draftCalculation?.user_id) || Number(sortedStaff?.[0]?.id) || null;

    setSelectedStaffId(defaultStaffId);
  }, [staff, calculations, eligibleStart, sortedStaff, selectedStaffId]);

  const selectedStaff = useMemo(() => {
    return (
      staff.find(item => Number(item?.id) === Number(selectedStaffId)) || null
    );
  }, [staff, selectedStaffId]);

  const selectedCalculations = useMemo(() => {
    return calculations
      .filter(item => Number(item?.user_id) === Number(selectedStaffId))
      .sort((a, b) => {
        const dateA = String(a?.period_start || a?.calculation_month || '');

        const dateB = String(b?.period_start || b?.calculation_month || '');

        return dateB.localeCompare(dateA);
      });
  }, [calculations, selectedStaffId]);

  const hasEligiblePeriodCalculation = useMemo(() => {
    if (!eligibleStart) {
      return false;
    }

    return selectedCalculations.some(item => {
      const itemPeriodStart = formatDate(
        item?.period_start || item?.calculation_month,
      );

      return itemPeriodStart === eligibleStart;
    });
  }, [selectedCalculations, eligibleStart]);

  const showUnsavedEligibleDraft =
    !!selectedStaff && !!eligiblePeriod && !hasEligiblePeriodCalculation;

  const completedRun = data?.completed_run || null;

  return (
    <View style={styles.areaContent}>
      <View style={styles.salaryCalculationHeader}>
        <View style={styles.salaryCalculationHeading}>
          <Text style={styles.sectionTitle}>Salary Calculation</Text>

          {!!eligiblePeriod && (
            <Text style={styles.salaryEligiblePeriod}>
              Eligible period: {eligiblePeriod.label || '-'}
            </Text>
          )}

          <Text style={styles.salaryCalculationDescription}>
            Review one employee at a time. The eligible period is marked Draft
            until its salary is settled.
          </Text>
        </View>

        <Pressable
          onPress={onCompletePayrollRun}
          disabled={!onCompletePayrollRun || loading}
          style={({ pressed }) => [
            styles.completePayrollButton,

            (!onCompletePayrollRun || loading) && styles.buttonDisabled,

            pressed &&
              !!onCompletePayrollRun &&
              !loading &&
              styles.advanceEmployeeCardPressed,
          ]}
        >
          <MaterialCommunityIcons name="check-all" size={18} color="#F1F5F9" />

          <Text style={styles.completePayrollButtonText}>
            Complete Payroll Run
          </Text>
        </Pressable>
      </View>

      {!!completedRun && (
        <View style={styles.salaryCompletedNotice}>
          <MaterialCommunityIcons
            name="check-decagram-outline"
            size={20}
            color="#34D399"
          />

          <Text style={styles.salaryCompletedNoticeText}>
            Payroll run for this eligible period has been completed.
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingSection}>
          <ActivityIndicator size="small" color="#60A5FA" />

          <Text style={styles.loadingText}>Loading salary calculations...</Text>
        </View>
      ) : (
        <>
          <View style={styles.salaryEmployeeSection}>
            <Text style={styles.subSectionTitle}>Employees</Text>

            <View style={styles.salarySearchWrap}>
              <MaterialCommunityIcons
                name="magnify"
                size={19}
                color="#8FA5BE"
              />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Name, designation, or role"
                placeholderTextColor="#718096"
                style={styles.salarySearchInput}
              />
            </View>

            {filteredStaff.length === 0 ? (
              <View style={styles.advanceEmptyCard}>
                <MaterialCommunityIcons
                  name="account-search-outline"
                  size={30}
                  color="#718096"
                />

                <Text style={styles.advanceEmptyTitle}>No employees</Text>

                <Text style={styles.advanceEmptyText}>
                  No employees match the current search.
                </Text>
              </View>
            ) : (
              <View style={styles.salaryEmployeeGrid}>
                {filteredStaff.map(item => {
                  const active = Number(item.id) === Number(selectedStaffId);

                  const currentCalculation = getCurrentCalculation(item.id);

                  const paid = currentCalculation?.status === 'paid';

                  return (
                    <Pressable
                      key={String(item.id)}
                      onPress={() => setSelectedStaffId(Number(item.id))}
                      style={({ pressed }) => [
                        styles.salaryEmployeeCard,

                        active && styles.salaryEmployeeCardActive,

                        pressed && styles.advanceEmployeeCardPressed,
                      ]}
                    >
                      <View style={styles.salaryEmployeeAvatar}>
                        <MaterialCommunityIcons
                          name="account"
                          size={20}
                          color={active ? '#FFFFFF' : '#7DD3FC'}
                        />
                      </View>

                      <View style={styles.salaryEmployeeInfo}>
                        <View style={styles.salaryEmployeeNameRow}>
                          <Text
                            numberOfLines={1}
                            style={styles.salaryEmployeeName}
                          >
                            {item?.name || 'Employee'}
                          </Text>

                          <MaterialCommunityIcons
                            name={
                              paid
                                ? 'check-circle-outline'
                                : 'alert-circle-outline'
                            }
                            size={19}
                            color={paid ? '#34D399' : '#FBBF24'}
                          />
                        </View>

                        <Text
                          numberOfLines={1}
                          style={styles.salaryEmployeeRole}
                        >
                          {getStaffRole(item)}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            <Text style={styles.resultCount}>
              Showing {filteredStaff.length} of {staff.length}
            </Text>
          </View>

          <View style={styles.salaryHistorySection}>
            <View style={styles.salaryHistoryHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.subSectionTitle}>Salary calculations</Text>

                <Text style={styles.salarySelectedStaff}>
                  {selectedStaff
                    ? `${selectedStaff.name} · ${getStaffRole(selectedStaff)}`
                    : 'Select an employee'}
                </Text>
              </View>

              <Pressable
                onPress={onRefresh}
                disabled={loading}
                style={({ pressed }) => [
                  styles.salaryRefreshButton,

                  pressed && !loading && styles.advanceEmployeeCardPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="refresh"
                  size={19}
                  color="#DCE7F5"
                />
              </Pressable>
            </View>

            <View style={styles.salaryHistoryCard}>
              <Text style={styles.salaryHistoryTitle}>
                Salary calculation history
              </Text>

              {!selectedStaff ? (
                <Text style={styles.emptyText}>
                  Select an employee to review salary calculations.
                </Text>
              ) : selectedCalculations.length === 0 ? (
                <>
                  {showUnsavedEligibleDraft && (
                    <View style={styles.salaryHistoryItem}>
                      <View style={styles.salaryHistoryItemHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.salaryHistoryPeriod}>
                            {eligiblePeriod?.label || 'Eligible period'}
                          </Text>

                          <View
                            style={[
                              styles.salaryHistoryStatus,
                              styles.salaryDraftStatus,
                            ]}
                          >
                            <Text style={styles.salaryHistoryStatusText}>
                              DRAFT
                            </Text>
                          </View>
                        </View>

                        <Pressable
                          onPress={() =>
                            onEditCalculation?.({
                              id: null,
                              isNewCalculation: true,

                              user_id: Number(selectedStaff.id),

                              user: selectedStaff,

                              calculation_month: eligiblePeriod?.start || null,

                              period_start: eligiblePeriod?.start || null,

                              period_end: eligiblePeriod?.end || null,

                              status: 'draft',

                              earnings_total: 0,
                              deductions_total: 0,
                              advance_total: 0,
                              net_salary: 0,

                              lines: [],
                            })
                          }
                          disabled={!onEditCalculation}
                          style={({ pressed }) => [
                            styles.salaryEditButton,

                            !onEditCalculation && styles.buttonDisabled,

                            pressed &&
                              !!onEditCalculation && {
                                opacity: 0.75,
                              },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="pencil-outline"
                            size={19}
                            color="#FFFFFF"
                          />
                        </Pressable>
                      </View>

                      <Text style={styles.unsavedCalculationText}>
                        No calculation saved for this eligible period.
                      </Text>
                    </View>
                  )}

                  {selectedCalculations.map(item => {
                    const paid =
                      String(item?.status || '').toLowerCase() === 'paid';

                    return (
                      <View
                        key={String(item.id)}
                        style={styles.salaryHistoryItem}
                      >
                        <View style={styles.salaryHistoryItemHeader}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.salaryHistoryPeriod}>
                              {formatDate(item.period_start)}
                              {' to '}
                              {formatDate(item.period_end)}
                            </Text>

                            <View
                              style={[
                                styles.salaryHistoryStatus,

                                paid
                                  ? styles.salaryPaidStatus
                                  : styles.salaryDraftStatus,
                              ]}
                            >
                              <Text style={styles.salaryHistoryStatusText}>
                                {String(item?.status || 'draft').toUpperCase()}
                              </Text>
                            </View>
                          </View>

                          {paid ? (
                            !!item?.payslip?.id && (
                              <Pressable
                                disabled={
                                  Number(downloadingPayslipId) ===
                                  Number(item.payslip.id)
                                }
                                onPress={() => onDownloadPayslip?.(item)}
                                style={({ pressed }) => [
                                  styles.payslipButton,

                                  Number(downloadingPayslipId) ===
                                    Number(item.payslip.id) &&
                                    styles.buttonDisabled,

                                  pressed &&
                                    Number(downloadingPayslipId) !==
                                      Number(item.payslip.id) && {
                                      opacity: 0.75,
                                    },
                                ]}
                              >
                                {Number(downloadingPayslipId) ===
                                Number(item.payslip.id) ? (
                                  <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                  />
                                ) : (
                                  <>
                                    <MaterialCommunityIcons
                                      name="file-download-outline"
                                      size={18}
                                      color="#FFFFFF"
                                    />

                                    <Text style={styles.payslipButtonText}>
                                      Payslip
                                    </Text>
                                  </>
                                )}
                              </Pressable>
                            )
                          ) : (
                            <Pressable
                              onPress={() => onEditCalculation?.(item)}
                              disabled={!onEditCalculation}
                              style={({ pressed }) => [
                                styles.salaryEditButton,

                                !onEditCalculation && styles.buttonDisabled,

                                pressed &&
                                  !!onEditCalculation && {
                                    opacity: 0.75,
                                  },
                              ]}
                            >
                              <MaterialCommunityIcons
                                name="pencil-outline"
                                size={19}
                                color="#FFFFFF"
                              />
                            </Pressable>
                          )}
                        </View>

                        <View style={styles.salaryTotalsGrid}>
                          <View style={styles.salaryTotalItem}>
                            <Text style={styles.infoLabel}>Earnings</Text>

                            <Text style={styles.positiveValue}>
                              {money(item.earnings_total, currencySymbol)}
                            </Text>
                          </View>

                          <View style={styles.salaryTotalItem}>
                            <Text style={styles.infoLabel}>Deductions</Text>

                            <Text style={styles.warningValue}>
                              {money(item.deductions_total, currencySymbol)}
                            </Text>
                          </View>

                          <View style={styles.salaryTotalItem}>
                            <Text style={styles.infoLabel}>Advance</Text>

                            <Text style={styles.infoValue}>
                              {money(item.advance_total, currencySymbol)}
                            </Text>
                          </View>

                          <View style={styles.salaryTotalItem}>
                            <Text style={styles.infoLabel}>Net salary</Text>

                            <Text style={styles.netValue}>
                              {money(item.net_salary, currencySymbol)}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.salaryHistoryMetaRow}>
                          <View style={styles.salaryMetaItem}>
                            <Text style={styles.infoLabel}>Payable days</Text>

                            <Text style={styles.infoValue}>
                              {item?.payable_days_override ??
                                item?.calculated_working_days ??
                                '-'}
                            </Text>
                          </View>

                          <View style={styles.salaryMetaItem}>
                            <Text style={styles.infoLabel}>Salary lines</Text>

                            <Text style={styles.infoValue}>
                              {Array.isArray(item?.lines)
                                ? item.lines.length
                                : 0}
                            </Text>
                          </View>
                        </View>

                        {!!item?.working_days_fallback_reason && (
                          <View style={styles.salaryReasonCard}>
                            <MaterialCommunityIcons
                              name="information-outline"
                              size={17}
                              color="#7DD3FC"
                            />

                            <Text style={styles.salaryReasonText}>
                              {item.working_days_fallback_reason}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}

                  {!showUnsavedEligibleDraft &&
                    selectedCalculations.length === 0 && (
                      <View style={styles.advanceEmptyCard}>
                        <MaterialCommunityIcons
                          name="calculator-variant-outline"
                          size={30}
                          color="#718096"
                        />

                        <Text style={styles.advanceEmptyTitle}>
                          No salary calculations
                        </Text>

                        <Text style={styles.advanceEmptyText}>
                          No salary calculation has been recorded for this
                          employee.
                        </Text>
                      </View>
                    )}
                </>
              ) : (
                selectedCalculations.map(item => {
                  const paid = item?.status === 'paid';

                  return (
                    <View
                      key={String(item.id)}
                      style={styles.salaryHistoryItem}
                    >
                      <View style={styles.salaryHistoryItemHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.salaryHistoryPeriod}>
                            {formatDate(item.period_start)}
                            {' to '}
                            {formatDate(item.period_end)}
                          </Text>

                          <View
                            style={[
                              styles.salaryHistoryStatus,

                              paid
                                ? styles.salaryPaidStatus
                                : styles.salaryDraftStatus,
                            ]}
                          >
                            <Text style={styles.salaryHistoryStatusText}>
                              {String(item?.status || 'draft').toUpperCase()}
                            </Text>
                          </View>
                        </View>

                        {String(item?.status || '').toLowerCase() === 'paid' ? (
                          !!item?.payslip?.id && (
                            <Pressable
                              disabled={
                                Number(downloadingPayslipId) ===
                                Number(item.payslip.id)
                              }
                              onPress={() => onDownloadPayslip?.(item)}
                              style={({ pressed }) => [
                                styles.payslipButton,

                                Number(downloadingPayslipId) ===
                                  Number(item.payslip.id) &&
                                  styles.buttonDisabled,

                                pressed &&
                                  Number(downloadingPayslipId) !==
                                    Number(item.payslip.id) && {
                                    opacity: 0.75,
                                  },
                              ]}
                            >
                              {Number(downloadingPayslipId) ===
                              Number(item.payslip.id) ? (
                                <ActivityIndicator
                                  size="small"
                                  color="#FFFFFF"
                                />
                              ) : (
                                <>
                                  <MaterialCommunityIcons
                                    name="file-download-outline"
                                    size={18}
                                    color="#FFFFFF"
                                  />

                                  <Text style={styles.payslipButtonText}>
                                    Payslip
                                  </Text>
                                </>
                              )}
                            </Pressable>
                          )
                        ) : (
                          <Pressable
                            onPress={() => onEditCalculation?.(item)}
                            disabled={!onEditCalculation}
                            style={({ pressed }) => [
                              styles.salaryEditButton,

                              !onEditCalculation && styles.buttonDisabled,

                              pressed &&
                                !!onEditCalculation && {
                                  opacity: 0.75,
                                },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="pencil-outline"
                              size={19}
                              color="#FFFFFF"
                            />
                          </Pressable>
                        )}
                      </View>

                      <View style={styles.salaryTotalsGrid}>
                        <View style={styles.salaryTotalItem}>
                          <Text style={styles.infoLabel}>Earnings</Text>

                          <Text style={styles.positiveValue}>
                            {money(item.earnings_total, currencySymbol)}
                          </Text>
                        </View>

                        <View style={styles.salaryTotalItem}>
                          <Text style={styles.infoLabel}>Deductions</Text>

                          <Text style={styles.warningValue}>
                            {money(item.deductions_total, currencySymbol)}
                          </Text>
                        </View>

                        <View style={styles.salaryTotalItem}>
                          <Text style={styles.infoLabel}>Advance</Text>

                          <Text style={styles.infoValue}>
                            {money(item.advance_total, currencySymbol)}
                          </Text>
                        </View>

                        <View style={styles.salaryTotalItem}>
                          <Text style={styles.infoLabel}>Net salary</Text>

                          <Text style={styles.netValue}>
                            {money(item.net_salary, currencySymbol)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.salaryHistoryMetaRow}>
                        <View style={styles.salaryMetaItem}>
                          <Text style={styles.infoLabel}>Payable days</Text>

                          <Text style={styles.infoValue}>
                            {item?.payable_days_override ??
                              item?.calculated_working_days ??
                              '-'}
                          </Text>
                        </View>

                        <View style={styles.salaryMetaItem}>
                          <Text style={styles.infoLabel}>Salary lines</Text>

                          <Text style={styles.infoValue}>
                            {Array.isArray(item?.lines) ? item.lines.length : 0}
                          </Text>
                        </View>
                      </View>

                      {!!item?.working_days_fallback_reason && (
                        <View style={styles.salaryReasonCard}>
                          <MaterialCommunityIcons
                            name="information-outline"
                            size={17}
                            color="#7DD3FC"
                          />

                          <Text style={styles.salaryReasonText}>
                            {item.working_days_fallback_reason}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </>
      )}
    </View>
  );
}
