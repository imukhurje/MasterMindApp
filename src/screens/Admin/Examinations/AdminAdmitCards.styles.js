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
    paddingHorizontal: 14,
    paddingTop: 14,
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

  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: CARD,
    padding: 11,
    marginBottom: 10,
  },

  headerTextSection: {
    flex: 1,
    paddingRight: 8,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '900',
  },

  examinationName: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  downloadButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.20)',
    paddingHorizontal: 10,
  },

  downloadButtonText: {
    color: TEXT,
    fontSize: 9,
    fontWeight: '900',
  },

  selectionCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: 'rgba(20, 43, 73, 0.42)',
    padding: 10,
    marginBottom: 10,
  },

  selectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 22,
    height: 22,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 5,
    backgroundColor: CARD_DARK,
    marginRight: 9,
  },

  checkboxSelected: {
    borderColor: '#60A5FA',
    backgroundColor: PRIMARY,
  },

  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  selectAllText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  selectedCount: {
    color: MUTED,
    fontSize: 9,
    marginTop: 8,
    marginLeft: 31,
  },

  listContent: {
    paddingBottom: 24,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  candidateCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.68)',
    borderRadius: 13,
    backgroundColor: 'rgba(20, 43, 73, 0.52)',
    padding: 11,
    marginBottom: 8,
  },

  candidateCardSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },

  candidateContent: {
    flex: 1,
  },

  candidateName: {
    color: TEXT,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
  },

  metadataRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 9,
  },

  metadataItem: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(11, 28, 50, 0.50)',
    paddingHorizontal: 8,
  },

  metadataLabel: {
    color: MUTED,
    fontSize: 8,
  },

  metadataValue: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 3,
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
    opacity: 0.42,
  },
});
