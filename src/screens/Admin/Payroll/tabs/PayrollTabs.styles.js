// src/screens/Admin/Payroll/tabs/PayrollTabs.styles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  areaContent: {
    gap: 11,
  },

  secondaryTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    padding: 11,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 14,
  },

  secondaryTab: {
    flexGrow: 1,
    minWidth: '30%',
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
    backgroundColor: '#0A1B30',
  },

  secondaryTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#4B8CFF',
  },

  secondaryTabText: {
    color: '#DCE7F5',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },

  secondaryTabTextActive: {
    color: '#FFFFFF',
  },

  sectionCard: {
    padding: 13,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 14,
  },

  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
  },

  sectionDescription: {
    color: '#AFC2DA',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  subSectionTitle: {
    color: '#F1F5F9',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
    marginBottom: 10,
  },

  fieldLabel: {
    color: '#C8D6E8',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },

  input: {
    minHeight: 46,
    color: '#F8FAFC',
    fontSize: 13,
    paddingHorizontal: 12,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
  },

  primaryButton: {
    alignSelf: 'flex-start',
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 14,
    marginTop: 10,
    backgroundColor: '#2563EB',
    borderRadius: 9,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  divider: {
    height: 1,
    backgroundColor: '#244D6E',
    marginVertical: 13,
  },

  dataCard: {
    padding: 11,
    marginBottom: 9,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 11,
  },

  dataCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  dataCardTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
  },

  dataCardSubtitle: {
    color: '#8FA5BE',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },

  activeBadge: {
    backgroundColor: '#064E3B',
  },

  inactiveBadge: {
    backgroundColor: '#4B1D2A',
  },

  draftBadge: {
    backgroundColor: '#5B4300',
  },

  statusText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 11,
  },

  infoItem: {
    width: '48%',
    minHeight: 50,
    padding: 8,
    backgroundColor: '#102742',
    borderRadius: 8,
  },

  infoLabel: {
    color: '#8FA5BE',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
  },

  infoValue: {
    color: '#F1F5F9',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
    marginTop: 4,
  },

  positiveValue: {
    color: '#34D399',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 4,
  },

  warningValue: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 4,
  },

  netValue: {
    color: '#7DD3FC',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4,
  },

  bigValue: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 4,
  },

  smallText: {
    color: '#8FA5BE',
    fontSize: 10,
    marginTop: 3,
  },

  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 10,
  },

  outlineButton: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 8,
  },

  outlineButtonText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '800',
  },

  resultCount: {
    color: '#91A5BD',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 7,
  },

  emptyText: {
    color: '#91A5BD',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingVertical: 20,
  },

  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 10,
    marginTop: 12,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 9,
  },

  noticeTitle: {
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: '900',
  },

  noticeText: {
    color: '#AFC2DA',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  staffWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  staffChip: {
    maxWidth: '48%',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 20,
  },

  staffChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#60A5FA',
  },

  staffChipText: {
    color: '#C8D6E8',
    fontSize: 11,
    fontWeight: '800',
  },

  staffChipTextActive: {
    color: '#FFFFFF',
  },

  loadingSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },

  loadingText: {
    color: '#AFC2DA',
    fontSize: 11,
    marginTop: 8,
  },

  summaryMiniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 13,
  },

  summaryMiniCard: {
    width: '48%',
    minHeight: 69,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 9,
  },

  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    padding: 9,
    marginTop: 9,
    backgroundColor: '#102742',
    borderRadius: 8,
  },

  noteText: {
    flex: 1,
    color: '#C8D6E8',
    fontSize: 11,
    lineHeight: 16,
  },
  buttonDisabled: {
    opacity: 0.55,
  },

  deactivateText: {
    color: '#FCA5A5',
  },

  activateText: {
    color: '#6EE7B7',
  },
  advanceSearchSection: {
    marginTop: 8,
  },

  advanceSearchInputWrap: {
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,

    paddingHorizontal: 11,

    backgroundColor: '#0B1C31',

    borderWidth: 1,
    borderColor: '#3F7BA7',

    borderRadius: 9,
  },

  advanceSearchInput: {
    flex: 1,

    minHeight: 44,

    paddingVertical: 0,

    color: '#F8FAFC',

    fontSize: 13,
  },

  advanceEmployeeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,

    marginTop: 12,
  },

  advanceEmployeeCard: {
    width: '48%',

    minHeight: 67,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,

    padding: 10,

    backgroundColor: '#0B1C31',

    borderWidth: 1,
    borderColor: '#315F84',

    borderRadius: 11,
  },

  advanceEmployeeCardActive: {
    backgroundColor: '#143858',

    borderColor: '#60A5FA',
  },

  advanceEmployeeCardPressed: {
    opacity: 0.8,
  },

  advanceEmployeeAvatar: {
    width: 34,
    height: 34,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#163653',

    borderRadius: 17,
  },

  advanceEmployeeInfo: {
    flex: 1,
  },

  advanceEmployeeName: {
    color: '#F1F5F9',

    fontSize: 12,
    lineHeight: 17,

    fontWeight: '900',
  },

  advanceEmployeeNameActive: {
    color: '#FFFFFF',
  },

  advanceEmployeeRole: {
    color: '#91A5BD',

    fontSize: 10,
    lineHeight: 15,

    marginTop: 2,

    fontWeight: '700',
  },

  advanceEmployeeRoleActive: {
    color: '#CFE7FF',
  },

  advanceLedgerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 10,

    marginBottom: 13,
  },

  advanceLedgerTitleWrap: {
    flex: 1,
  },

  advanceSelectedEmployee: {
    color: '#AFC2DA',

    fontSize: 12,
    lineHeight: 17,

    marginTop: -5,
  },

  newAdvanceButton: {
    minHeight: 40,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    paddingHorizontal: 13,

    backgroundColor: '#2563EB',

    borderWidth: 1,
    borderColor: '#4B8CFF',

    borderRadius: 9,
  },

  newAdvanceButtonDisabled: {
    opacity: 0.45,
  },

  newAdvanceButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  advanceSummaryCard: {
    minHeight: 62,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 10,

    padding: 12,

    marginBottom: 9,

    backgroundColor: '#0B1C31',

    borderWidth: 1,
    borderColor: '#3F7BA7',

    borderRadius: 10,
  },

  advanceSummaryTextWrap: {
    flex: 1,
  },

  advanceSummaryLabel: {
    color: '#F1F5F9',

    fontSize: 12,
    lineHeight: 17,

    fontWeight: '900',
  },

  advanceSummarySubLabel: {
    color: '#AFC2DA',

    fontSize: 11,
    lineHeight: 16,

    marginTop: 3,
  },

  advanceSummaryValue: {
    color: '#34D399',

    fontSize: 14,

    fontWeight: '900',
  },

  advanceOutstandingValue: {
    color: '#FBBF24',

    fontSize: 14,

    fontWeight: '900',
  },

  advanceRecordCard: {
    padding: 11,

    marginBottom: 10,

    backgroundColor: '#0B1C31',

    borderWidth: 1,
    borderColor: '#315F84',

    borderRadius: 11,
  },

  advanceRecordHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 8,
  },

  advanceRecordHeaderText: {
    flex: 1,
  },

  advanceReference: {
    color: '#F8FAFC',

    fontSize: 12,
    lineHeight: 17,

    fontWeight: '900',
  },

  advanceRecordNote: {
    color: '#AFC2DA',

    fontSize: 11,
    lineHeight: 16,

    marginTop: 4,
  },

  advanceRecordDivider: {
    height: 1,

    backgroundColor: '#1E4362',

    marginVertical: 10,
  },

  advanceRecordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 7,
  },

  advanceRecordItem: {
    width: '48%',

    minHeight: 53,

    padding: 8,

    backgroundColor: '#102742',

    borderRadius: 8,
  },

  repaymentScheduleBox: {
    marginTop: 10,

    padding: 10,

    backgroundColor: '#102742',

    borderRadius: 8,
  },

  repaymentScheduleTitle: {
    color: '#E2E8F0',

    fontSize: 11,
    fontWeight: '900',

    marginBottom: 7,
  },

  repaymentScheduleRow: {
    minHeight: 31,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderBottomWidth: 1,
    borderBottomColor: '#1E4362',
  },

  repaymentPeriod: {
    color: '#AFC2DA',

    fontSize: 11,
  },

  repaymentAmount: {
    color: '#F8FAFC',

    fontSize: 11,

    fontWeight: '900',
  },

  advanceJournalRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,

    marginTop: 9,
  },

  advanceJournalText: {
    flex: 1,

    color: '#7DD3FC',

    fontSize: 10,
    lineHeight: 15,
  },

  advanceEmptyCard: {
    alignItems: 'center',

    paddingVertical: 25,
    paddingHorizontal: 12,

    backgroundColor: '#0B1C31',

    borderWidth: 1,
    borderColor: '#315F84',

    borderRadius: 10,
  },

  advanceEmptyTitle: {
    color: '#F1F5F9',

    fontSize: 13,

    fontWeight: '900',

    marginTop: 8,
  },

  advanceEmptyText: {
    color: '#91A5BD',

    fontSize: 11,
    lineHeight: 16,

    textAlign: 'center',

    marginTop: 4,
  },
  advanceHeaderActions: {
    alignItems: 'flex-end',
    gap: 8,
  },

  advanceRecordHeaderActions: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    gap: 8,
  },

  editAdvanceButton: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#123250',

    borderWidth: 1,
    borderColor: '#4B89B6',

    borderRadius: 9,
  },

  editAdvanceButtonPressed: {
    opacity: 0.72,
  },

  salaryCalculationHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    padding: 13,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 14,
  },

  salaryCalculationHeading: {
    flex: 1,
    minWidth: 220,
  },

  salaryEligiblePeriod: {
    color: '#C7D7EA',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 9,
    fontWeight: '700',
  },

  salaryCalculationDescription: {
    color: '#AFC2DA',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },

  completePayrollButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 9,
    backgroundColor: '#102742',
  },

  completePayrollButtonText: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '900',
  },

  salaryCompletedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 11,
    backgroundColor: '#063C36',
    borderWidth: 1,
    borderColor: '#059669',
    borderRadius: 10,
  },

  salaryCompletedNoticeText: {
    flex: 1,
    color: '#D1FAE5',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },

  salaryEmployeeSection: {
    padding: 13,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 14,
  },

  salarySearchWrap: {
    minHeight: 47,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 11,
    marginBottom: 12,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
  },

  salarySearchInput: {
    flex: 1,
    minHeight: 45,
    paddingVertical: 0,
    color: '#F8FAFC',
    fontSize: 14,
  },

  salaryEmployeeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  salaryEmployeeCard: {
    width: '48%',
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 10,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 11,
  },

  salaryEmployeeCardActive: {
    backgroundColor: '#153B5C',
    borderColor: '#60A5FA',
  },

  salaryEmployeeAvatar: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#163653',
    borderRadius: 18,
  },

  salaryEmployeeInfo: {
    flex: 1,
  },

  salaryEmployeeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  salaryEmployeeName: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
  },

  salaryEmployeeRole: {
    color: '#AFC2DA',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
    fontWeight: '700',
  },

  salaryHistorySection: {
    padding: 13,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 14,
  },

  salaryHistoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },

  salarySelectedStaff: {
    color: '#AFC2DA',
    fontSize: 13,
    lineHeight: 18,
    marginTop: -4,
  },

  salaryRefreshButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 9,
    backgroundColor: '#0B1C31',
  },

  salaryHistoryCard: {
    padding: 11,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 11,
  },

  salaryHistoryTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
    marginBottom: 11,
  },

  salaryHistoryItem: {
    padding: 11,
    marginBottom: 10,
    backgroundColor: '#102742',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 10,
  },

  salaryHistoryItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  salaryHistoryPeriod: {
    color: '#F8FAFC',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
  },

  salaryHistoryStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 6,
    borderRadius: 14,
  },

  salaryDraftStatus: {
    backgroundColor: '#5B4300',
  },

  salaryPaidStatus: {
    backgroundColor: '#064E3B',
  },

  salaryHistoryStatusText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },

  salaryEditButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 9,
    backgroundColor: '#143858',
  },

  salaryTotalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 11,
  },

  salaryTotalItem: {
    width: '48%',
    minHeight: 57,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#0B1C31',
    borderRadius: 8,
  },

  salaryHistoryMetaRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 7,
  },

  salaryMetaItem: {
    flex: 1,
    minHeight: 55,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#0B1C31',
    borderRadius: 8,
  },

  salaryReasonCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    padding: 9,
    marginTop: 9,
    backgroundColor: '#0B1C31',
    borderRadius: 8,
  },

  salaryReasonText: {
    flex: 1,
    color: '#AFC2DA',
    fontSize: 11,
    lineHeight: 17,
  },
  payslipButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 13,
    backgroundColor: '#143858',
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 9,
  },

  payslipButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
  },
  unsavedCalculationText: {
    color: '#C8D6E8',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
});
