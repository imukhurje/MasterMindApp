import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#142B49';
const CARD_DARK = '#0B1C32';
const TEXT = '#FFFFFF';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';
const PRIMARY = '#2563EB';
const SUCCESS = '#22C55E';

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

  headerCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: CARD,
    padding: 14,
  },

  paperName: {
    color: TEXT,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
  },

  paperMetadata: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  paperStatusRow: {
    flexDirection: 'row',
    marginTop: 11,
  },

  paperStatusBadge: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.45)',
    borderRadius: 12,
    backgroundColor: 'rgba(100, 116, 139, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  paperStatusText: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '900',
  },

  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },

  metricCard: {
    width: '48%',
    minHeight: 62,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    justifyContent: 'center',
    backgroundColor: CARD_DARK,
    paddingHorizontal: 11,
  },

  metricCardPrimary: {
    borderColor: 'rgba(96, 165, 250, 0.75)',
    backgroundColor: 'rgba(37, 99, 235, 0.16)',
  },

  metricLabel: {
    color: MUTED,
    fontSize: 9,
  },

  metricValue: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 4,
  },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 17,
    marginBottom: 8,
  },

  listTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
  },

  listCount: {
    color: MUTED,
    fontSize: 10,
  },

  studentCard: {
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.72)',
    borderRadius: 14,
    backgroundColor: 'rgba(20, 43, 73, 0.55)',
    padding: 11,
    marginBottom: 9,
  },

  studentTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  studentNumberBox: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CARD,
    marginRight: 9,
  },

  studentNumberText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
  },

  studentMain: {
    flex: 1,
  },

  studentName: {
    color: TEXT,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
  },

  rollText: {
    color: MUTED,
    fontSize: 9,
    marginTop: 3,
  },

  studentInfoBox: {
    borderRadius: 9,
    backgroundColor: 'rgba(11, 28, 50, 0.45)',
    paddingHorizontal: 9,
    paddingVertical: 7,
    marginTop: 10,
  },

  infoLabel: {
    color: MUTED,
    fontSize: 8,
    fontWeight: '700',
  },

  infoValue: {
    color: TEXT,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  studentStatusRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 9,
  },

  studentStatusColumn: {
    flex: 1,
  },

  statusBadge: {
    minHeight: 30,
    justifyContent: 'center',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 8,
    marginTop: 4,
  },

  statusBadgeNeutral: {
    borderColor: 'rgba(148, 163, 184, 0.30)',
    backgroundColor: 'rgba(100, 116, 139, 0.10)',
  },

  statusBadgeSuccess: {
    borderColor: 'rgba(34, 197, 94, 0.55)',
    backgroundColor: 'rgba(34, 197, 94, 0.10)',
  },

  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },

  statusTextNeutral: {
    color: MUTED,
  },

  statusTextSuccess: {
    color: SUCCESS,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(11, 28, 50, 0.40)',
    padding: 24,
  },

  emptyStateTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  emptyStateText: {
    color: MUTED,
    textAlign: 'center',
    marginTop: 6,
  },
  metricCardSelected: {
    borderColor: '#60A5FA',
    borderWidth: 2,
    backgroundColor: '#2563EB',
  },
  metricLabelSelected: {
    color: '#DBEAFE',
  },

  metricValueSelected: {
    color: '#FFFFFF',
  },
});
