// src/screens/Admin/Attendance/AdminAttendanceReports.styles.js

import { StyleSheet } from 'react-native';

const BG = '#081524';
const CARD = '#102844';
const CARD_DARK = '#09192D';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#3E79A8';
const PRIMARY = '#3B82F6';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  centeredScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG,
  },

  loadingText: {
    color: MUTED,
    fontSize: 13,
    marginTop: 10,
  },

  listContent: {
    padding: 12,
    paddingBottom: 24,
  },

  filterCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    padding: 14,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '900',
  },

  pageSubtitle: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    marginBottom: 6,
  },

  filterSection: {
    marginTop: 12,
  },

  filterLabel: {
    color: '#DCE7F5',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },

  selectBox: {
    minHeight: 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: '#0C2039',

    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,

    paddingHorizontal: 13,
  },

  selectText: {
    flex: 1,
    color: TEXT,
    fontSize: 14,
    paddingRight: 8,
  },

  summaryCard: {
    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,

    padding: 14,

    marginTop: 12,
    marginBottom: 16,
  },

  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  summaryClass: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  summaryRange: {
    color: MUTED,
    fontSize: 12,
    marginTop: 4,
  },

  totalClassBadge: {
    minWidth: 78,

    alignItems: 'center',

    backgroundColor: '#0C2039',

    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,

    paddingHorizontal: 10,
    paddingVertical: 8,

    marginLeft: 10,
  },

  totalClassValue: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '900',
  },

  totalClassLabel: {
    color: MUTED,
    fontSize: 9,
    marginTop: 2,
  },

  rangeText: {
    color: '#C6D5E8',
    fontSize: 12,
    marginTop: 12,
  },

  downloadButton: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: PRIMARY,

    borderRadius: 10,

    marginTop: 14,
  },

  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 6,
  },

  studentsHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 10,
  },

  studentsTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  studentCountBadge: {
    minWidth: 32,
    height: 28,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 999,

    paddingHorizontal: 8,
  },

  studentCountText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
  },

  studentCard: {
    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 13,

    padding: 13,
  },

  studentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  studentIdentity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },

  rollBadge: {
    width: 42,
    height: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#1D426B',

    borderRadius: 10,

    marginRight: 10,
  },

  rollBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  studentText: {
    flex: 1,
    minWidth: 0,
  },

  studentName: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  classText: {
    color: MUTED,
    fontSize: 11,
    marginTop: 4,
  },

  percentBadge: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },

  percentValue: {
    color: '#67D1F0',
    fontSize: 16,
    fontWeight: '900',
  },

  percentLabel: {
    color: MUTED,
    fontSize: 9,
    marginTop: 2,
  },

  studentStatsRow: {
    flexDirection: 'row',

    borderTopWidth: 1,
    borderTopColor: 'rgba(62,121,168,0.30)',

    marginTop: 12,
    paddingTop: 10,
  },

  studentStat: {
    flex: 1,
  },

  studentStatLabel: {
    color: MUTED,
    fontSize: 10,
  },

  studentStatValue: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 3,
  },

  separator: {
    height: 9,
  },

  reportLoading: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 12,
  },

  reportLoadingText: {
    color: MUTED,
    fontSize: 12,
    marginLeft: 8,
  },

  emptyCard: {
    alignItems: 'center',

    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 13,

    padding: 24,
  },

  emptyTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 8,
  },

  emptyText: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 5,
  },

  modalOverlay: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(2,8,23,0.82)',

    paddingHorizontal: 18,
  },

  modalCard: {
    width: '100%',
    maxHeight: '72%',

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 15,

    overflow: 'hidden',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 14,
    paddingVertical: 12,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(62,121,168,0.35)',
  },

  modalTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  modalClose: {
    width: 34,
    height: 34,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 8,

    backgroundColor: '#183A5C',
  },

  optionList: {
    maxHeight: 430,
  },

  optionRow: {
    minHeight: 52,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(62,121,168,0.22)',
  },

  optionRowSelected: {
    backgroundColor: 'rgba(59,130,246,0.15)',
  },

  optionText: {
    flex: 1,

    color: TEXT,

    fontSize: 13,
  },

  optionTextSelected: {
    color: '#BFDBFE',
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },
});
