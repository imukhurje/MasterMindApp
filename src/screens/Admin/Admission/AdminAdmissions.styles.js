// src/screens/Admin/Admission/AdminAdmissions.styles.js

import { StyleSheet } from 'react-native';

const BG = '#081524';
const CARD = '#102844';
const CARD_DARK = '#0B1C32';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  centeredScreen: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: MUTED,
    fontSize: 13,
    marginTop: 10,
  },

  content: {
    padding: 14,
    paddingBottom: 20,
  },

  headerCard: {
    minHeight: 82,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 13,
  },

  headerTitle: {
    color: TEXT,
    fontSize: 19,
    fontWeight: '900',
  },

  headerSubtitle: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  totalBadge: {
    minWidth: 60,
    minHeight: 52,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 11,

    marginLeft: 10,
  },

  totalValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  totalLabel: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },

  filtersCard: {
    backgroundColor: '#0D2038',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 12,

    marginTop: 11,
  },

  filterLabel: {
    color: '#DCE7F5',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
  },

  filterSpacing: {
    marginTop: 12,
  },

  dropdown: {
    minHeight: 48,

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  dropdownContainer: {
    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    overflow: 'hidden',
  },

  dropdownItemText: {
    color: TEXT,
    fontSize: 13,
  },

  dropdownSelectedText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '700',
  },

  dropdownPlaceholder: {
    color: '#718096',
    fontSize: 13,
  },

  searchBox: {
    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 11,
  },

  searchInput: {
    flex: 1,

    color: TEXT,
    fontSize: 13,

    paddingHorizontal: 8,
    paddingVertical: 10,
  },

  clearButton: {
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'flex-end',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 14,

    marginTop: 12,
  },

  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    marginLeft: 6,
  },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 17,
    marginBottom: 9,
  },

  listTitle: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '900',
  },

  listMeta: {
    color: MUTED,
    fontSize: 11,
  },

  admissionCard: {
    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 13,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  cardTitleArea: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },

  studentName: {
    color: TEXT,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },

  applicationNo: {
    color: '#93C5FD',
    fontSize: 10,
    marginTop: 4,
  },

  statusBadge: {
    minHeight: 32,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,

    borderRadius: 16,

    paddingHorizontal: 12,
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },

  admittedBadge: {
    backgroundColor: '#3A3015',
    borderColor: '#D99A00',
  },

  admittedBadgeText: {
    color: '#FBBF24',
  },

  rejectedBadge: {
    backgroundColor: '#132743',
    borderColor: '#4E92C7',
  },

  rejectedBadgeText: {
    color: '#DCE7F5',
  },

  infoBlock: {
    marginTop: 11,
  },

  infoText: {
    color: '#C6D4E8',
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 2,
  },

  infoLabel: {
    color: MUTED,
    fontWeight: '800',
  },

  declineBox: {
    backgroundColor: '#2A1820',

    borderWidth: 1,
    borderColor: '#B9475F',

    borderRadius: 9,

    padding: 9,

    marginTop: 9,
  },

  declineLabel: {
    color: '#FCA5A5',
    fontSize: 10,
    fontWeight: '900',
  },

  declineText: {
    color: '#FDE2E7',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  separator: {
    height: 10,
  },

  emptyCard: {
    minHeight: 170,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 20,
  },

  emptyTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 9,
  },

  emptyText: {
    color: MUTED,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 5,
  },

  paginationCard: {
    backgroundColor: '#0D2038',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 12,

    padding: 10,

    marginTop: 12,
  },

  paginationInfo: {
    color: MUTED,
    fontSize: 11,
    textAlign: 'center',
  },

  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 10,
  },

  pageButton: {
    minWidth: 82,
    minHeight: 40,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 11,
  },

  pageButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  pageNumber: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.45,
  },

  footerSpace: {
    height: 18,
  },
  completeScheduledButton: {
    flex: 1,
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,

    marginRight: 10,
  },

  completeScheduledButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 7,
  },
  submittedBadge: {
    backgroundColor: '#16334D',
    borderColor: '#67D1F0',
  },

  submittedBadgeText: {
    color: '#D8F5FF',
  },

  passedBadge: {
    backgroundColor: '#063F32',
    borderColor: '#10B981',
  },

  passedBadgeText: {
    color: '#D1FAE5',
  },

  statusActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',

    marginTop: 6,
  },

  statusActionLabel: {
    color: '#DCE7F5',
    fontSize: 11,
    fontWeight: '700',

    marginRight: 6,
  },
  allocationModalBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.72)',

    paddingHorizontal: 18,
  },

  allocationModal: {
    width: '100%',

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#3B7197',

    borderRadius: 16,

    padding: 15,
  },

  allocationModalTitle: {
    color: '#FFFFFF',

    fontSize: 17,
    fontWeight: '900',
  },

  allocationModalSubtitle: {
    color: '#AFC0D8',

    fontSize: 12,
    lineHeight: 17,

    marginTop: 5,
  },

  allocationOptions: {
    marginTop: 14,
  },

  allocationOption: {
    minHeight: 62,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#3B7197',

    borderRadius: 11,

    paddingHorizontal: 11,
    paddingVertical: 9,

    marginBottom: 9,
  },

  allocationOptionSelected: {
    borderColor: '#60A5FA',
    backgroundColor: '#173B60',
  },

  allocationRadio: {
    width: 20,
    height: 20,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 2,
    borderColor: '#93C5FD',

    borderRadius: 10,

    marginRight: 10,
  },

  allocationRadioInner: {
    width: 10,
    height: 10,

    backgroundColor: '#60A5FA',

    borderRadius: 5,
  },

  allocationOptionInfo: {
    flex: 1,
    minWidth: 0,
  },

  allocationOptionId: {
    color: '#93C5FD',

    fontSize: 10,
    fontWeight: '800',
  },

  allocationOptionLabel: {
    color: '#FFFFFF',

    fontSize: 13,
    fontWeight: '800',

    marginTop: 3,
  },

  allocationModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 8,
  },

  allocationCancelButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 18,

    marginRight: 8,
  },

  allocationCancelText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  allocationConfirmButton: {
    minWidth: 80,
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 10,

    paddingHorizontal: 18,
  },

  allocationConfirmText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },
  scheduleLoaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  scheduleLoadingText: {
    color: '#AFC0D8',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 6,
  },
  scheduleRollField: {
    marginTop: 8,
    marginBottom: 6,
  },

  scheduleRollLabel: {
    color: '#DCE7F5',

    fontSize: 13,
    fontWeight: '800',

    marginBottom: 7,
  },

  scheduleRollInput: {
    minHeight: 48,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    color: '#FFFFFF',
    fontSize: 14,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  scheduledBadge: {
    backgroundColor: '#172E4A',
    borderColor: '#60A5FA',
  },

  scheduledBadgeText: {
    color: '#DBEAFE',
  },
});
