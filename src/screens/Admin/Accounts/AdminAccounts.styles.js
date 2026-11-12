// src/screens/Admin/Accounts/AdminAccounts.styles.js

import { StyleSheet } from 'react-native';

const COLORS = {
  BG: '#081321',

  CARD: '#102742',
  CARD_DARK: '#0B1A2E',
  CARD_LIGHT: '#142B49',

  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',

  BORDER: '#376D99',
  BORDER_SOFT: '#294B69',

  PRIMARY: '#2563EB',
  CYAN: '#7DD3FC',

  GREEN: '#34D399',
  RED: '#F87171',
};

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  content: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 32,
  },

  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BG,
  },

  loadingText: {
    color: COLORS.MUTED,
    fontSize: 12,
    marginTop: 10,
  },

  workspaceCard: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 16,

    padding: 13,

    marginBottom: 12,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  headerTextArea: {
    flex: 1,
    paddingRight: 10,
  },

  eyebrow: {
    color: '#B9C8DC',

    fontSize: 11,
    fontWeight: '800',

    letterSpacing: 0.5,
  },

  workspaceTitle: {
    color: COLORS.TEXT,

    fontSize: 18,
    fontWeight: '900',

    marginTop: 5,
  },

  workspaceSubtitle: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 4,
  },

  helpButton: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 10,
  },

  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 9,

    marginTop: 16,
  },

  summaryCard: {
    width: '48.5%',

    minHeight: 128,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 13,

    padding: 12,
  },

  summaryIcon: {
    width: 34,
    height: 34,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderRadius: 10,

    marginBottom: 10,
  },

  summaryTitle: {
    color: COLORS.TEXT,

    fontSize: 13,
    lineHeight: 18,

    fontWeight: '900',
  },

  summaryDescription: {
    color: COLORS.MUTED,

    fontSize: 10,
    lineHeight: 15,

    marginTop: 7,
  },

  functionCard: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 16,

    padding: 13,

    marginBottom: 12,
  },

  functionHint: {
    color: COLORS.MUTED,

    fontSize: 11,
    lineHeight: 16,

    marginTop: 5,
    marginBottom: 12,
  },

  functionTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,

    width: '100%',
  },

  functionTab: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 10,

    paddingHorizontal: 12,
    paddingVertical: 8,

    flexGrow: 1,
    flexShrink: 1,

    minWidth: '30%',
  },

  functionTabActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: '#60A5FA',
  },

  functionTabText: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '800',

    textAlign: 'center',
  },

  functionTabTextActive: {
    color: '#FFFFFF',
  },

  areaContent: {
    gap: 11,
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

  primaryButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
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

  filterGrid: {
    gap: 10,
  },

  filterField: {
    width: '100%',
  },

  filterLabel: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '700',

    marginBottom: 5,
  },

  input: {
    minHeight: 44,

    color: COLORS.TEXT,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,

    paddingHorizontal: 11,

    fontSize: 12,
  },

  amountFilterRow: {
    flexDirection: 'row',

    gap: 9,
  },

  amountFilter: {
    flex: 1,
  },

  listDivider: {
    height: 1,

    backgroundColor: 'rgba(55,109,153,0.35)',

    marginVertical: 15,
  },

  transactionCard: {
    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 13,

    padding: 12,
  },

  transactionTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 8,
  },

  transactionText: {
    flex: 1,
  },

  transactionTitle: {
    color: COLORS.TEXT,

    fontSize: 13,
    fontWeight: '900',
  },

  transactionSubtitle: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 4,
  },

  transactionDescription: {
    color: '#C3D0E2',

    fontSize: 11,
    lineHeight: 16,

    marginTop: 9,
  },

  transactionBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 11,
  },

  mutedLabel: {
    color: COLORS.MUTED,

    fontSize: 10,
  },

  amountText: {
    color: COLORS.TEXT,

    fontSize: 13,
    fontWeight: '900',
  },

  transactionStatus: {
    color: COLORS.CYAN,

    fontSize: 10,
    fontWeight: '800',

    textTransform: 'uppercase',
  },

  statusBadge: {
    backgroundColor: 'rgba(52,211,153,0.12)',

    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.45)',

    borderRadius: 999,

    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  statusText: {
    color: '#6EE7B7',

    fontSize: 9,
    fontWeight: '900',
  },

  totalStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 10,

    padding: 11,

    marginTop: 3,
  },

  totalStripLabel: {
    color: COLORS.MUTED,

    fontSize: 11,
    fontWeight: '700',
  },

  totalStripValue: {
    color: COLORS.TEXT,

    fontSize: 16,
    fontWeight: '900',
  },

  miniStatsRow: {
    flexDirection: 'row',

    gap: 8,

    marginTop: 12,
  },

  miniStat: {
    flex: 1,

    alignItems: 'center',

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 10,

    paddingHorizontal: 5,
    paddingVertical: 10,
  },

  miniStatValue: {
    color: COLORS.TEXT,

    fontSize: 16,
    fontWeight: '900',
  },

  miniStatLabel: {
    color: COLORS.MUTED,

    fontSize: 9,

    textAlign: 'center',

    marginTop: 4,
  },

  debitCreditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 10,

    gap: 10,
  },

  debitText: {
    flex: 1,

    color: COLORS.GREEN,

    fontSize: 10,
    fontWeight: '700',
  },

  creditText: {
    flex: 1,

    color: '#F9A8D4',

    fontSize: 10,
    fontWeight: '700',

    textAlign: 'right',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    gap: 12,

    paddingVertical: 10,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55,109,153,0.25)',
  },

  infoLabel: {
    flex: 1,

    color: COLORS.MUTED,

    fontSize: 11,
  },

  infoValue: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 11,
    fontWeight: '800',

    textAlign: 'right',
  },

  reportIcon: {
    width: 48,
    height: 48,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderRadius: 13,

    marginBottom: 12,
  },

  resultCount: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 12,
  },

  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 13,

    padding: 20,
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
    lineHeight: 16,

    textAlign: 'center',

    marginTop: 5,
  },

  pressed: {
    opacity: 0.72,
  },

  receivableActionTabs: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 1,
  },

  receivableActionButton: {
    minHeight: 40,

    alignSelf: 'flex-start',

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.PRIMARY,

    borderRadius: 9,

    paddingHorizontal: 15,
    paddingVertical: 9,
  },

  receivableActionButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 10,
  },

  sectionIcon: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 10,
  },

  sectionDescriptionCompact: {
    color: COLORS.MUTED,

    fontSize: 11,
    lineHeight: 17,

    marginTop: 4,
  },

  receivablePrimaryButton: {
    marginTop: 14,
  },

  outlineActionButton: {
    minHeight: 44,

    alignSelf: 'flex-start',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 14,

    marginTop: 14,
  },

  outlineActionButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  recentReceiptHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 10,

    marginBottom: 12,
  },

  receiptDateRow: {
    flexDirection: 'row',

    gap: 9,
  },

  receiptDateField: {
    flex: 1,
  },

  receiptFilterButton: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    backgroundColor: COLORS.CARD_DARK,

    marginTop: 12,
  },

  receiptFilterButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  receiptList: {
    gap: 10,
  },

  receiptCard: {
    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 13,

    padding: 12,
  },

  receiptCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',

    gap: 10,
  },

  receiptCardMain: {
    flex: 1,
  },

  receiptNumber: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  receiptBillRef: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 4,
  },

  receiptAmount: {
    color: COLORS.TEXT,

    fontSize: 14,
    fontWeight: '900',
  },

  receiptDivider: {
    height: 1,

    backgroundColor: 'rgba(55,109,153,0.30)',

    marginVertical: 11,
  },

  receiptInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    rowGap: 10,
  },

  receiptInfoItem: {
    width: '50%',
  },

  receiptInfoLabel: {
    color: COLORS.MUTED,

    fontSize: 9,
  },

  receiptInfoValue: {
    color: COLORS.TEXT,

    fontSize: 10,
    fontWeight: '800',

    marginTop: 3,
  },

  unreconciledText: {
    color: '#FBBF24',
  },

  reconciledText: {
    color: COLORS.GREEN,
  },

  receiptReferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 12,

    marginTop: 11,

    paddingTop: 10,

    borderTopWidth: 1,
    borderTopColor: 'rgba(55,109,153,0.25)',
  },

  receiptReference: {
    flex: 1,

    color: '#DCE7F5',

    fontSize: 10,
    fontWeight: '700',

    textAlign: 'right',
  },

  receiptDescription: {
    color: '#C3D0E2',

    fontSize: 10,
    lineHeight: 15,

    marginTop: 9,
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
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '700',
  },

  calendarBackdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.72)',

    paddingHorizontal: 16,
  },

  calendarModal: {
    width: '100%',
    maxWidth: 430,

    backgroundColor: '#0D2038',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 16,

    overflow: 'hidden',

    paddingBottom: 10,
  },

  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingLeft: 15,
    paddingRight: 10,
    paddingVertical: 11,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  calendarTitle: {
    color: '#F1F5F9',

    fontSize: 16,
    fontWeight: '900',
  },

  calendarSubtitle: {
    color: '#A8B6C9',

    fontSize: 10,

    marginTop: 3,
  },

  calendarClose: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  receiptActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',

    gap: 8,

    marginTop: 11,
    paddingTop: 10,

    borderTopWidth: 1,
    borderTopColor: 'rgba(55,109,153,0.25)',
  },

  receiptActionButton: {
    width: 42,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.PRIMARY,

    borderRadius: 9,

    borderWidth: 1,
    borderColor: '#60A5FA',
  },
  controlDisabled: {
    opacity: 0.5,
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
    borderColor: '#34D399',

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
});
