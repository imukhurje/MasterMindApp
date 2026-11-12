import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#142B49';
const CARD_DARK = '#0B1C32';
const TEXT = '#FFFFFF';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';
const PRIMARY = '#2563EB';
const DANGER = '#EF4444';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  centeredScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG,
  },

  loadingText: {
    color: MUTED,
    fontSize: 11,
    marginTop: 10,
  },

  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 43, 73, 0.55)',
    padding: 12,
    marginBottom: 10,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  pageSubtitle: {
    color: MUTED,
    fontSize: 9,
    marginTop: 4,
  },

  summary: {
    minWidth: 55,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 7,
  },

  summaryValue: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '900',
  },

  summaryLabel: {
    color: MUTED,
    fontSize: 7,
    marginTop: 2,
  },

  listCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 43, 73, 0.28)',
    overflow: 'hidden',
  },

  listContent: {
    padding: 10,
  },

  registrationCard: {
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.55)',
    borderRadius: 13,
    backgroundColor: 'rgba(11, 28, 50, 0.92)',
    padding: 12,
    marginBottom: 10,
  },

  cardTopRow: {
    gap: 10,
  },

  registrationInfo: {
    flex: 1,
    minWidth: 0,
  },

  registrationName: {
    color: TEXT,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '900',
  },

  metadataWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },

  metadataText: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
  },

  metadataValue: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },

  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },

  roleBadge: {
    borderRadius: 8,
    backgroundColor: 'rgba(34, 211, 238, 0.13)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  roleBadgeText: {
    color: '#67D1F0',
    fontSize: 9,
    fontWeight: '900',
  },

  statusBadge: {
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.13)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  statusBadgeText: {
    color: '#FBBF24',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },

  approveButton: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
  },

  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  rejectButton: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: DANGER,
    paddingHorizontal: 12,
  },

  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  emptyListContent: {
    flexGrow: 1,
  },

  emptyState: {
    flex: 1,
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  emptyStateTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  emptyStateText: {
    color: MUTED,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
  },

  loadMoreButton: {
    alignSelf: 'center',
    minWidth: 110,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    marginTop: 4,
    marginBottom: 10,
  },

  loadMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.42,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    padding: 14,
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  associateModal: {
    width: '100%',
    maxWidth: 520,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: '#0B1C32',
    padding: 14,
  },

  associateTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
  },

  associateSubtitle: {
    color: '#D5E1F2',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },

  noCandidatesCard: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: 'rgba(8, 23, 45, 0.70)',
    padding: 18,
    marginTop: 10,
  },

  noCandidatesText: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },

  manualMatchButton: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderRadius: 9,
    backgroundColor: 'rgba(20, 43, 73, 0.75)',
    paddingHorizontal: 13,
    marginTop: 10,
  },

  manualMatchButtonText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '900',
  },

  candidatesList: {
    marginTop: 10,
  },

  candidateRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.55)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 7,
  },

  candidateRowSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
  },

  radioOuter: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 9,
    marginRight: 10,
  },

  radioOuterSelected: {
    borderColor: '#60A5FA',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#60A5FA',
  },

  candidateInfo: {
    flex: 1,
  },

  candidateName: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
  },

  candidateMeta: {
    color: MUTED,
    fontSize: 9,
    marginTop: 3,
  },

  candidateLoading: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },

  candidateLoadingText: {
    color: MUTED,
    fontSize: 10,
    marginTop: 8,
  },

  associateFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 9,
    marginTop: 14,
  },

  modalCancelButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    paddingHorizontal: 14,
  },

  modalCancelButtonText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '900',
  },

  modalApproveButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
  },

  modalApproveButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  manualSearchSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 113, 151, 0.45)',
    paddingTop: 14,
    marginTop: 14,
  },

  manualSearchTitle: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 8,
  },

  manualSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  manualSearchInput: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: '#142B49',
    color: TEXT,
    fontSize: 10,
    paddingHorizontal: 11,
  },

  manualSearchButton: {
    minWidth: 72,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderRadius: 9,
    backgroundColor: '#142B49',
    paddingHorizontal: 12,
  },

  manualSearchButtonText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '900',
  },

  manualResults: {
    gap: 7,
    marginTop: 10,
  },

  manualResultRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.55)',
    borderRadius: 9,
    backgroundColor: 'rgba(20, 43, 73, 0.35)',
    padding: 10,
  },

  manualResultRowSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
  },
});
