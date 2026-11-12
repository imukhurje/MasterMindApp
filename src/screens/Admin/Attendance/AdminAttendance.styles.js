// src/screens/Admin/Attendance/AdminAttendance.styles.js

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

    fontSize: 12,

    marginTop: 10,
  },

  listContent: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 20,
  },

  headerCard: {
    minHeight: 72,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 15,

    paddingHorizontal: 14,
    paddingVertical: 11,

    marginBottom: 12,
  },

  headerTextSection: {
    flex: 1,
    minWidth: 0,
  },

  pageTitle: {
    color: TEXT,

    fontSize: 18,
    fontWeight: '900',
  },

  pageSubtitle: {
    color: MUTED,

    fontSize: 10,

    marginTop: 4,
  },

  roleBadge: {
    borderWidth: 1,
    borderColor: '#60A5FA',

    borderRadius: 999,

    backgroundColor: 'rgba(59,130,246,0.15)',

    paddingHorizontal: 10,
    paddingVertical: 5,

    marginLeft: 10,
  },

  roleBadgeText: {
    color: '#BFDBFE',

    fontSize: 9,
    fontWeight: '900',
  },

  statsCard: {
    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 15,

    backgroundColor: CARD,

    paddingHorizontal: 14,
    paddingVertical: 14,

    marginBottom: 12,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },

  sectionSubtitle: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 14,
  },

  statItem: {
    flex: 1,
  },

  statItemCenter: {
    alignItems: 'center',
  },

  statItemRight: {
    alignItems: 'flex-end',
  },

  statLabel: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 16,
  },

  statValue: {
    color: TEXT,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
    marginTop: 4,
  },

  timetableCard: {
    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 15,

    backgroundColor: CARD,

    paddingHorizontal: 14,
    paddingVertical: 14,

    marginBottom: 16,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  sectionHeaderContent: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },

  modeBadge: {
    flexShrink: 0,

    minHeight: 28,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 14,

    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  modeBadgeText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },

  slotWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    marginTop: 12,
  },

  slotChip: {
    maxWidth: '100%',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    backgroundColor: 'rgba(20,43,73,0.90)',

    paddingHorizontal: 12,
    paddingVertical: 10,

    marginRight: 7,
    marginBottom: 8,
  },

  slotChipText: {
    color: TEXT,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
  },

  sessionsHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 10,
  },

  countBadge: {
    minWidth: 34,
    height: 28,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 999,

    backgroundColor: CARD,

    paddingHorizontal: 8,
  },

  countBadgeText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '900',
  },

  dailySessionCard: {
    minHeight: 72,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 13,

    backgroundColor: CARD_DARK,

    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  dailySessionDate: {
    flex: 1,
    color: TEXT,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
    paddingRight: 10,
  },

  lectureCard: {
    minHeight: 82,

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 13,

    backgroundColor: CARD_DARK,

    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  lectureInfo: {
    flex: 1,
    minWidth: 0,

    paddingRight: 10,
  },

  lectureTitle: {
    color: TEXT,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
  },

  lectureMeta: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  markButton: {
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: PRIMARY,

    borderWidth: 1,
    borderColor: '#60A5FA',

    borderRadius: 10,

    paddingHorizontal: 14,
    paddingVertical: 9,
  },

  markButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
  },

  separator: {
    height: 9,
  },

  emptyCard: {
    alignItems: 'center',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 13,

    backgroundColor: CARD,

    padding: 20,
  },

  emptyTitle: {
    color: TEXT,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
  },

  emptyText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  loadMoreButton: {
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 11,

    backgroundColor: PRIMARY,

    marginTop: 14,
  },

  loadMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.4,
  },

  footerSpace: {
    height: 16,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 12,
  },

  newAttendanceButton: {
    flex: 1,
    minHeight: 46,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#3B82F6',

    borderWidth: 1,
    borderColor: '#60A5FA',

    borderRadius: 10,

    paddingHorizontal: 10,

    marginRight: 8,
  },

  newAttendanceButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '900',
  },

  reportsButton: {
    minWidth: 100,
    minHeight: 46,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#3E79A8',

    borderRadius: 10,

    paddingHorizontal: 14,
  },

  reportsButtonText: {
    color: '#F8FAFC',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '900',
  },
  newSheetOverlay: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(2,8,23,0.78)',

    paddingHorizontal: 12,
  },

  newSheetModal: {
    width: '100%',

    borderWidth: 1,
    borderColor: '#315D86',

    borderRadius: 16,

    backgroundColor: '#08172D',

    padding: 15,
  },

  newSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 8,
  },

  newSheetTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
  },

  newSheetClose: {
    width: 42,
    height: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 10,

    backgroundColor: '#EF4444',
  },

  twoColumnRow: {
    flexDirection: 'row',

    marginHorizontal: -5,
  },

  halfField: {
    flex: 1,

    marginHorizontal: 5,
  },

  modalField: {
    marginTop: 10,
  },

  modalLabel: {
    color: '#D7E2EF',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    marginBottom: 6,
  },

  modalSelect: {
    minHeight: 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderWidth: 1,
    borderColor: '#3E79A8',
    borderRadius: 10,

    backgroundColor: '#102844',

    paddingHorizontal: 13,
  },

  modalSelectText: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 19,
    paddingRight: 8,
  },

  modalPlaceholder: {
    color: '#AFC0D8',
  },

  dateField: {
    minHeight: 50,

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#3E79A8',

    borderRadius: 10,

    backgroundColor: '#102844',

    paddingHorizontal: 13,
  },

  dateInput: {
    flex: 1,

    minHeight: 44,

    color: '#F8FAFC',

    fontSize: 12,

    paddingVertical: 0,
  },

  timeslotHelp: {
    color: '#AFC0D8',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 7,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 16,
  },

  modalCancelButton: {
    minHeight: 46,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#3E79A8',

    borderRadius: 10,

    paddingHorizontal: 18,

    marginRight: 8,
  },

  modalCancelText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
  },

  modalCreateButton: {
    minHeight: 46,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 10,

    backgroundColor: '#3B82F6',

    paddingHorizontal: 20,
  },

  modalCreateText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  selectionOverlay: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(2,8,23,0.82)',

    paddingHorizontal: 20,
  },

  selectionCard: {
    width: '100%',
    maxHeight: '70%',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#3E79A8',

    borderRadius: 15,

    overflow: 'hidden',
  },

  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 14,
    paddingVertical: 12,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(62,121,168,0.35)',
  },

  selectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },

  selectionClose: {
    width: 32,
    height: 32,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 8,

    backgroundColor: '#183A5C',
  },

  selectionList: {
    maxHeight: 420,
  },

  selectionOption: {
    minHeight: 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(62,121,168,0.22)',
  },

  selectionOptionSelected: {
    backgroundColor: 'rgba(59,130,246,0.15)',
  },

  selectionOptionText: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
    lineHeight: 18,
  },

  selectionOptionTextSelected: {
    color: '#BFDBFE',

    fontWeight: '900',
  },

  selectionEmpty: {
    padding: 20,
    alignItems: 'center',
  },

  selectionEmptyText: {
    color: '#AFC0D8',
    fontSize: 12,
  },

  dateValue: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 19,
  },

  calendarOverlay: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(2,8,23,0.82)',

    paddingHorizontal: 18,
  },

  calendarCard: {
    width: '100%',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#3E79A8',

    borderRadius: 16,

    overflow: 'hidden',
  },

  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 14,
    paddingVertical: 12,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(62,121,168,0.35)',
  },

  calendarTitle: {
    color: '#F8FAFC',

    fontSize: 14,
    fontWeight: '900',
  },

  calendarCloseButton: {
    width: 32,
    height: 32,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 8,

    backgroundColor: '#183A5C',
  },
});
