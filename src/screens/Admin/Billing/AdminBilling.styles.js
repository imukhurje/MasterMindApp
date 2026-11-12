// src/screens/Admin/Billing/AdminBilling.styles.js

import { StyleSheet } from 'react-native';

const COLORS = {
  BG: '#081321',
  CARD: '#102742',
  CARD_DARK: '#0B1A2E',
  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',
  BORDER: '#376D99',
  PRIMARY: '#3B82F6',
};

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  centeredScreen: {
    flex: 1,
    backgroundColor: COLORS.BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.MUTED,
    fontSize: 12,
    marginTop: 10,
  },

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 7,
  },

  tabButton: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4E92C7',
    borderRadius: 10,
    backgroundColor: '#102844',
    paddingHorizontal: 6,
  },

  tabButtonActive: {
    backgroundColor: '#73D8F3',
  },

  tabText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '800',
  },

  tabTextActive: {
    color: '#062238',
  },

  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 30,
  },

  selectorGrid: {
    backgroundColor: '#10233D',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },

  filterBlock: {
    marginBottom: 12,
  },

  filterLabel: {
    color: '#DCE7F5',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },

  multiSelectField: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#102844',
    borderWidth: 1,
    borderColor: '#4E92C7',
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  multiSelectPlaceholder: {
    flex: 1,
    color: '#94A3B8',
    fontSize: 13,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 7,
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#4E92C7',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: '#10253E',
  },

  filterChipText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '700',
  },

  searchPanel: {
    backgroundColor: '#10233D',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    padding: 12,
    marginBottom: 15,
  },

  statusField: {
    marginBottom: 11,
  },

  dropdown: {
    minHeight: 48,
    backgroundColor: '#102844',
    borderWidth: 1,
    borderColor: '#4E92C7',
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  dropdownContainer: {
    backgroundColor: '#0B1C32',
    borderColor: '#4E92C7',
    borderRadius: 10,
  },

  dropdownSelectedText: {
    color: '#F8FAFC',
    fontSize: 13,
  },

  dropdownItemText: {
    color: '#F8FAFC',
    fontSize: 13,
  },

  dropdownPlaceholder: {
    color: '#718096',
    fontSize: 13,
  },

  studentSearchField: {
    marginBottom: 11,
  },

  studentSearchBox: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#102844',
    borderWidth: 1,
    borderColor: '#4E92C7',
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  studentSearchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
    paddingVertical: 0,
  },

  searchActionRow: {
    flexDirection: 'row',
    gap: 8,
  },

  generateButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 9,
    paddingHorizontal: 10,
  },

  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },

  clearButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4E92C7',
    borderRadius: 9,
    paddingHorizontal: 16,
  },

  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
    paddingHorizontal: 2,
  },

  listHeadingTitle: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  listHeadingSubtitle: {
    color: COLORS.MUTED,
    fontSize: 10,
    marginTop: 3,
  },

  generatedBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: '#123D32',
    borderWidth: 1,
    borderColor: '#22C55E',
  },

  generatedBadgeText: {
    color: '#86EFAC',
    fontSize: 9,
    fontWeight: '800',
  },

  paymentCard: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    padding: 12,
  },

  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  paymentHeaderText: {
    flex: 1,
    paddingRight: 8,
  },

  studentName: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  studentMeta: {
    color: COLORS.MUTED,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  statusBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  missingBadge: {
    borderColor: '#4E92C7',
    backgroundColor: '#10253E',
  },

  paidBadge: {
    borderColor: '#22C55E',
    backgroundColor: '#123D32',
  },

  unpaidBadge: {
    borderColor: '#F59E0B',
    backgroundColor: '#3B2A10',
  },

  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },

  missingBadgeText: {
    color: '#BFDBFE',
  },

  paidBadgeText: {
    color: '#86EFAC',
  },

  unpaidBadgeText: {
    color: '#FBBF24',
  },

  paymentDivider: {
    height: 1,
    backgroundColor: '#274664',
    marginVertical: 10,
  },

  paymentBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  monthLabel: {
    color: COLORS.MUTED,
    fontSize: 9,
  },

  monthValue: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },

  amountArea: {
    alignItems: 'flex-end',
  },

  amountLabel: {
    color: COLORS.MUTED,
    fontSize: 9,
  },

  amountValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 3,
  },

  separator: {
    height: 9,
  },

  emptyCard: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    backgroundColor: COLORS.CARD,
    alignItems: 'center',
    padding: 24,
  },

  emptyTitle: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 9,
  },

  emptyText: {
    color: COLORS.MUTED,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 5,
  },

  loadMoreButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    marginTop: 14,
  },

  loadMoreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  footerSpace: {
    height: 18,
  },

  placeholderCard: {
    margin: 14,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 15,
  },

  placeholderTitle: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 10,
  },

  placeholderText: {
    color: COLORS.MUTED,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 5,
  },

  selectorBackdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 16,
  },

  selectorModal: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#0D2038',
    borderWidth: 1,
    borderColor: '#4E92C7',
    borderRadius: 16,
    padding: 13,
  },

  selectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },

  selectorTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  selectorClose: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectorSearch: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#4E92C7',
    borderRadius: 9,
    paddingHorizontal: 10,
    backgroundColor: '#102844',
    marginBottom: 8,
  },

  selectorSearchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    paddingVertical: 0,
  },

  selectorList: {
    maxHeight: 340,
  },

  selectorOption: {
    minHeight: 47,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#294B69',
    paddingHorizontal: 10,
  },

  selectorOptionSelected: {
    backgroundColor: '#173B60',
  },

  selectorOptionText: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 12,
    paddingRight: 8,
  },

  selectorOptionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  selectorOptionAction: {
    color: '#AFC0D8',
    fontSize: 10,
  },

  selectorEmpty: {
    color: COLORS.MUTED,
    fontSize: 11,
    textAlign: 'center',
    padding: 20,
  },

  selectorDoneButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 9,
    marginTop: 10,
  },

  selectorDoneText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.45,
  },

  paymentReportAction: {
    flexDirection: 'row',

    justifyContent: 'flex-start',

    marginBottom: 12,
  },

  downloadReportButton: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,

    backgroundColor: '#2563EB',

    borderRadius: 10,

    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  downloadReportButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },
});
