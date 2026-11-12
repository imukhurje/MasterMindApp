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

  controlDisabled: {
    opacity: 0.5,
  },

  receivableActionTabs: {
    flexDirection: 'row',
    gap: 8,
  },

  receivableActionButton: {
    minHeight: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.PRIMARY,

    borderRadius: 9,

    paddingHorizontal: 14,
  },

  receivableActionButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
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

  sectionIcon: {
    width: 34,
    height: 34,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderRadius: 9,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 16,
    fontWeight: '900',
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

  outlineActionButton: {
    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'flex-start',

    gap: 7,

    marginTop: 13,

    paddingHorizontal: 13,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    backgroundColor: COLORS.CARD_DARK,
  },

  outlineActionButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,
    fontWeight: '900',
  },

  recentReceiptHeader: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: 10,

    marginBottom: 12,
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

  receiptCard: {
    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 12,

    padding: 11,
  },

  receiptCardTop: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: 10,
  },

  receiptCardMain: {
    flex: 1,
  },

  receiptNumber: {
    color: COLORS.TEXT,

    fontSize: 11,
    fontWeight: '900',
  },

  receiptBillRef: {
    color: COLORS.MUTED,

    fontSize: 9,

    marginTop: 3,
  },

  receiptAmount: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  receiptDivider: {
    height: 1,

    backgroundColor: 'rgba(55,109,153,0.30)',

    marginVertical: 10,
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

    fontSize: 8,
  },

  receiptInfoValue: {
    color: COLORS.TEXT,

    fontSize: 9,
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

    gap: 10,

    marginTop: 10,
  },

  receiptReference: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 9,
    fontWeight: '700',

    textAlign: 'right',
  },

  receiptDescription: {
    color: COLORS.MUTED,

    fontSize: 9,
    lineHeight: 14,

    marginTop: 9,
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

  resultCount: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 12,
  },
});
