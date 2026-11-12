// src/screens/Admin/Accounts/tabs/AccountsPayableTab.styles.js

import { StyleSheet } from 'react-native';

const COLORS = {
  CARD: '#102742',
  CARD_DARK: '#0B1A2E',

  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',

  BORDER: '#376D99',
  BORDER_SOFT: '#294B69',

  PRIMARY: '#2563EB',

  GREEN: '#34D399',
};

export default StyleSheet.create({
  areaContent: {
    gap: 11,
  },

  pressed: {
    opacity: 0.82,
  },

  secondaryTabs: {
    flexDirection: 'row',

    gap: 8,

    marginBottom: 1,
  },

  secondaryTab: {
    minHeight: 40,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,

    paddingHorizontal: 14,

    backgroundColor: COLORS.CARD_DARK,
  },

  secondaryTabActive: {
    backgroundColor: COLORS.PRIMARY,
  },

  secondaryTabText: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '800',
  },

  secondaryTabTextActive: {
    color: '#FFFFFF',
  },

  sectionCard: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 16,

    padding: 13,
  },

  sectionTitleRow: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: 10,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 16,
    fontWeight: '900',
  },

  sectionDescription: {
    color: COLORS.MUTED,

    fontSize: 11,
    lineHeight: 17,

    marginTop: 5,
    marginBottom: 13,
  },

  sectionDescriptionCompact: {
    color: COLORS.MUTED,

    fontSize: 10,
    lineHeight: 15,

    marginTop: 4,
  },

  primaryButton: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'flex-start',

    gap: 7,

    backgroundColor: COLORS.PRIMARY,

    borderRadius: 10,

    paddingHorizontal: 15,
  },

  receivablePrimaryButton: {
    marginTop: 13,
  },

  primaryButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  lastSevenButton: {
    minHeight: 40,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'flex-start',

    gap: 6,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,

    paddingHorizontal: 12,

    marginBottom: 12,
  },

  lastSevenText: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '800',
  },

  recentReceiptHeader: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: 10,

    marginBottom: 12,
  },

  filterGrid: {
    gap: 10,
  },

  filterField: {
    width: '100%',
  },

  receiptDateRow: {
    flexDirection: 'row',

    gap: 8,
  },

  receiptDateField: {
    flex: 1,
  },

  filterLabel: {
    color: '#B9C8DC',

    fontSize: 10,
    fontWeight: '700',

    marginBottom: 5,
  },

  datePickerButton: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,

    paddingHorizontal: 11,
  },

  datePickerText: {
    color: COLORS.TEXT,

    fontSize: 11,
    fontWeight: '700',
  },

  input: {
    minHeight: 44,

    color: COLORS.TEXT,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,

    paddingHorizontal: 11,

    fontSize: 11,
  },

  amountFilterRow: {
    flexDirection: 'row',

    gap: 8,
  },

  amountFilter: {
    flex: 1,
  },

  outlineButton: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 14,

    marginTop: 12,
  },

  outlineButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,
    fontWeight: '900',
  },

  receiptFilterButton: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,

    marginTop: 12,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  receiptFilterButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,
    fontWeight: '900',
  },

  listDivider: {
    height: 1,

    backgroundColor: 'rgba(55,109,153,0.35)',

    marginVertical: 12,
  },

  emptyCard: {
    alignItems: 'center',

    paddingVertical: 28,
    paddingHorizontal: 15,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 12,
  },

  emptyTitle: {
    color: COLORS.TEXT,

    fontSize: 13,
    fontWeight: '900',

    marginTop: 8,
  },

  emptyText: {
    color: COLORS.MUTED,

    fontSize: 10,
    lineHeight: 15,

    textAlign: 'center',

    marginTop: 4,
  },

  receiptList: {
    gap: 9,
  },

  supplierBillCard: {
    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 13,

    padding: 12,
  },

  supplierBillTop: {
    flexDirection: 'row',

    alignItems: 'flex-start',
    justifyContent: 'space-between',

    gap: 10,
  },

  supplierBillMain: {
    flex: 1,
  },

  supplierBillNumber: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  supplierVendor: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '700',

    marginTop: 4,
  },

  supplierStatusBadge: {
    borderWidth: 1,
    borderColor: '#F59E0B',

    backgroundColor: 'rgba(245,158,11,0.10)',

    borderRadius: 999,

    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  supplierStatusSettled: {
    borderColor: COLORS.GREEN,

    backgroundColor: 'rgba(52,211,153,0.10)',
  },

  supplierStatusText: {
    color: COLORS.TEXT,

    fontSize: 8,
    fontWeight: '900',
  },

  supplierDescription: {
    color: COLORS.MUTED,

    fontSize: 10,
    lineHeight: 15,

    marginTop: 8,
  },

  supplierDivider: {
    height: 1,

    backgroundColor: 'rgba(55,109,153,0.30)',

    marginVertical: 11,
  },

  supplierInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    rowGap: 12,
  },

  supplierInfoItem: {
    width: '50%',
  },

  supplierInfoLabel: {
    color: COLORS.MUTED,

    fontSize: 9,
  },

  supplierInfoValue: {
    color: COLORS.TEXT,

    fontSize: 10,
    fontWeight: '800',

    marginTop: 3,
  },

  supplierOutstanding: {
    color: '#FBBF24',

    fontSize: 11,
    fontWeight: '900',

    marginTop: 3,
  },

  transactionList: {
    gap: 9,
  },

  transactionCard: {
    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 12,

    padding: 12,
  },

  transactionTop: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: 10,
  },

  transactionText: {
    flex: 1,
  },

  transactionTitle: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  transactionSubtitle: {
    color: COLORS.MUTED,

    fontSize: 9,

    marginTop: 3,
  },

  amountText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  transactionBottom: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginTop: 10,

    paddingTop: 9,

    borderTopWidth: 1,

    borderTopColor: 'rgba(55,109,153,0.25)',
  },

  mutedLabel: {
    color: COLORS.MUTED,

    fontSize: 9,
  },

  transactionStatus: {
    color: '#7DD3FC',

    fontSize: 9,
    fontWeight: '900',

    textTransform: 'uppercase',
  },

  resultCount: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 12,
  },
});
