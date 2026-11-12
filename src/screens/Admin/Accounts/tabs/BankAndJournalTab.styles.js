// src/screens/Admin/Accounts/tabs/BankAndJournalTab.styles.js

import { StyleSheet } from 'react-native';

const COLORS = {
  CARD: '#102742',
  CARD_DARK: '#0B1A2E',

  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',

  BORDER: '#376D99',
  BORDER_SOFT: '#294B69',

  PRIMARY: '#2563EB',
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
    flexWrap: 'wrap',

    gap: 8,
  },

  secondaryTab: {
    minHeight: 40,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 13,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,
  },

  secondaryTabActive: {
    backgroundColor: COLORS.PRIMARY,

    borderColor: '#60A5FA',
  },

  secondaryTabText: {
    color: '#DCE7F5',

    fontSize: 10,
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

    fontSize: 10,
    lineHeight: 16,

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

    paddingHorizontal: 14,

    backgroundColor: COLORS.PRIMARY,

    borderRadius: 9,
  },

  primaryButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  lastSevenButton: {
    minHeight: 40,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'flex-start',

    gap: 6,

    marginBottom: 12,

    paddingHorizontal: 12,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,
  },

  lastSevenText: {
    color: '#DCE7F5',

    fontSize: 10,
    fontWeight: '800',
  },

  filterGrid: {
    gap: 10,
  },

  dateRow: {
    flexDirection: 'row',

    gap: 8,
  },

  dateField: {
    flex: 1,
  },

  amountRow: {
    flexDirection: 'row',

    gap: 8,
  },

  amountField: {
    flex: 1,
  },

  filterLabel: {
    color: '#B9C8DC',

    fontSize: 9,
    fontWeight: '700',

    marginBottom: 5,
  },

  datePickerButton: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 10,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,
  },

  datePickerText: {
    color: COLORS.TEXT,

    fontSize: 10,
    fontWeight: '700',
  },

  input: {
    minHeight: 44,

    paddingHorizontal: 10,

    color: COLORS.TEXT,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,

    fontSize: 10,
  },

  filterButton: {
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

  filterButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,
    fontWeight: '900',
  },

  divider: {
    height: 1,

    marginVertical: 12,

    backgroundColor: 'rgba(55,109,153,0.32)',
  },

  emptyCard: {
    alignItems: 'center',

    paddingVertical: 28,
    paddingHorizontal: 14,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 12,
  },

  emptyTitle: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',

    marginTop: 8,
  },

  emptyText: {
    color: COLORS.MUTED,

    fontSize: 9,
    lineHeight: 14,

    textAlign: 'center',

    marginTop: 4,
  },

  journalList: {
    gap: 9,
  },

  journalCard: {
    padding: 11,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 12,
  },

  journalTop: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: 10,
  },

  journalMain: {
    flex: 1,
  },

  journalNumber: {
    color: COLORS.TEXT,

    fontSize: 11,
    fontWeight: '900',
  },

  journalDescription: {
    color: COLORS.MUTED,

    fontSize: 9,
    lineHeight: 14,

    marginTop: 4,
  },

  journalDate: {
    color: COLORS.MUTED,

    fontSize: 9,
    fontWeight: '700',
  },

  journalDivider: {
    height: 1,

    marginVertical: 10,

    backgroundColor: 'rgba(55,109,153,0.25)',
  },

  journalInfoGrid: {
    flexDirection: 'row',

    gap: 8,
  },

  journalInfoItem: {
    flex: 1,
  },

  journalInfoLabel: {
    color: COLORS.MUTED,

    fontSize: 8,
  },

  journalInfoValue: {
    color: COLORS.TEXT,

    fontSize: 10,
    fontWeight: '800',

    marginTop: 3,
  },

  debitValue: {
    color: '#34D399',

    fontSize: 10,
    fontWeight: '900',

    marginTop: 3,
  },

  creditValue: {
    color: '#FBBF24',

    fontSize: 10,
    fontWeight: '900',

    marginTop: 3,
  },

  amountValue: {
    color: COLORS.TEXT,

    fontSize: 11,
    fontWeight: '900',
  },

  summaryBox: {
    marginTop: 11,

    padding: 9,

    backgroundColor: '#102742',

    borderRadius: 8,

    borderWidth: 1,
    borderColor: 'rgba(55,109,153,0.35)',
  },

  summaryText: {
    color: '#DCE7F5',

    fontSize: 9,
    lineHeight: 14,

    marginTop: 4,
  },

  resultCount: {
    color: COLORS.MUTED,

    fontSize: 9,

    marginTop: 12,
  },

  totalStrip: {
    padding: 12,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 10,
  },

  totalStripLabel: {
    color: COLORS.MUTED,

    fontSize: 9,
  },

  totalStripValue: {
    color: COLORS.TEXT,

    fontSize: 17,
    fontWeight: '900',

    marginTop: 4,
  },

  bankEntryFooter: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 10,

    marginTop: 10,
  },

  bankAmountRow: {
    flexDirection: 'row',

    gap: 10,
  },
  journalActions: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'flex-end',

    gap: 8,

    marginTop: 10,
    paddingTop: 10,

    borderTopWidth: 1,
    borderTopColor: 'rgba(55,109,153,0.25)',
  },

  journalActionButton: {
    width: 42,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderWidth: 1,
    borderColor: '#60A5FA',

    borderRadius: 9,
  },

  controlDisabled: {
    opacity: 0.5,
  },

  bankHelpText: {
    color: '#DCE7F5',

    fontSize: 10,
    lineHeight: 16,

    marginBottom: 12,
  },

  reloadButton: {
    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'flex-start',

    gap: 7,

    paddingHorizontal: 13,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    marginBottom: 13,
  },

  reloadButtonText: {
    color: '#F1F5F9',

    fontSize: 10,
    fontWeight: '900',
  },

  bankList: {
    gap: 9,
  },

  bankCard: {
    padding: 11,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 12,
  },

  bankCardTop: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: 10,
  },

  bankCardMain: {
    flex: 1,
  },

  bankEntryNumber: {
    color: '#F1F5F9',

    fontSize: 10,
    lineHeight: 15,

    fontWeight: '900',
  },

  bankDescription: {
    color: '#A8B6C9',

    fontSize: 9,
    lineHeight: 14,

    marginTop: 4,
  },

  bankMovement: {
    color: '#F1F5F9',

    fontSize: 11,
    fontWeight: '900',
  },

  bankCardDivider: {
    height: 1,

    backgroundColor: 'rgba(55,109,153,0.28)',

    marginVertical: 10,
  },

  bankInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    rowGap: 11,
  },

  bankInfoItem: {
    width: '50%',
  },

  bankInfoLabel: {
    color: '#A8B6C9',

    fontSize: 8,
  },

  bankInfoValue: {
    color: '#F1F5F9',

    fontSize: 9,
    fontWeight: '800',

    marginTop: 3,
  },

  bankStatusOpen: {
    color: '#FBBF24',
  },

  bankStatusReconciled: {
    color: '#34D399',
  },

  bankReferenceBox: {
    marginTop: 10,

    padding: 9,

    backgroundColor: '#102742',

    borderRadius: 8,

    borderWidth: 1,
    borderColor: 'rgba(55,109,153,0.35)',
  },

  bankReferenceText: {
    color: '#F1F5F9',

    fontSize: 9,
    lineHeight: 14,

    marginTop: 3,
  },
});
