import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#142B49';
const CARD_DARK = '#0B1C32';
const TEXT = '#FFFFFF';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';
const PRIMARY = '#2563EB';

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
    marginTop: 12,
  },

  listContent: {
    padding: 14,
    paddingBottom: 28,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  pageHeader: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '900',
  },

  pageSubtitle: {
    maxWidth: 180,
    color: MUTED,
    fontSize: 9,
    marginTop: 3,
  },

  downloadAllButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: 'rgba(11, 28, 50, 0.65)',
    paddingHorizontal: 11,
  },

  downloadAllButtonText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '900',
  },

  marksheetCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: 'rgba(20, 43, 73, 0.52)',
    padding: 10,
    marginBottom: 14,
  },

  institutionSection: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  logoFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(37, 99, 235, 0.20)',
  },

  logoFallbackText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  schoolName: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 9,
  },

  schoolAddress: {
    color: MUTED,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },

  examinationTitle: {
    color: TEXT,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 9,
  },

  marksheetTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 6,
  },

  printButton: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: 'rgba(11, 28, 50, 0.55)',
    paddingHorizontal: 12,
    marginTop: 9,
  },

  printButtonText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '800',
  },

  studentInfoCard: {
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.70)',
    borderRadius: 11,
    backgroundColor: CARD_DARK,
    padding: 10,
    marginTop: 3,
  },

  studentInfoRow: {
    flexDirection: 'row',
    gap: 10,
  },

  studentInfoItem: {
    flex: 1,
  },

  classInfoBlock: {
    marginTop: 10,
  },

  infoLabel: {
    color: MUTED,
    fontSize: 8,
    fontWeight: '700',
  },

  infoValue: {
    color: TEXT,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    marginTop: 3,
  },

  table: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 9,
  },

  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  tableHeaderText: {
    color: TEXT,
    fontSize: 9,
    fontWeight: '900',
    paddingHorizontal: 7,
    paddingVertical: 9,
  },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    backgroundColor: 'rgba(11, 28, 50, 0.62)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 113, 151, 0.38)',
  },

  tableCell: {
    color: TEXT,
    fontSize: 9,
    lineHeight: 13,
    paddingHorizontal: 7,
    paddingVertical: 8,
  },

  courseColumn: {
    flex: 1.55,
  },

  markColumn: {
    flex: 1.1,
    textAlign: 'right',
  },

  totalColumn: {
    flex: 1.1,
    textAlign: 'right',
  },

  emptyCourseRow: {
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CARD_DARK,
  },

  emptyCourseText: {
    color: MUTED,
    fontSize: 10,
  },

  grandTotalRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD,
    paddingHorizontal: 9,
  },

  grandTotalLabel: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
  },

  grandTotalMaximum: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
  },

  extraInfoText: {
    color: MUTED,
    fontSize: 8,
    lineHeight: 12,
    marginTop: 7,
  },

  sheetCounter: {
    color: '#64748B',
    fontSize: 8,
    textAlign: 'right',
    marginTop: 8,
  },

  emptyState: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(11, 28, 50, 0.40)',
    padding: 24,
  },

  emptyStateTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
  },

  emptyStateText: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 6,
  },

  controlPressed: {
    opacity: 0.72,
  },
  controlDisabled: {
    opacity: 0.45,
  },
});
