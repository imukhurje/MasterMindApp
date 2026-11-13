// src/screens/Admin/Examinations/AdminManageExamPapers.styles.js

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
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: CARD,
    padding: 11,
    marginBottom: 10,
  },

  headerText: {
    flex: 1,
    paddingRight: 10,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '900',
  },

  examinationName: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  addButton: {
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    paddingHorizontal: 13,
  },

  addButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '900',
  },

  summaryCard: {
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 43, 73, 0.38)',
    padding: 9,
    marginBottom: 10,
  },

  summaryItem: {
    flex: 1,
    minHeight: 50,
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: CARD_DARK,
    paddingHorizontal: 9,
  },

  summaryLabel: {
    color: MUTED,
    fontSize: 9,
  },

  summaryValue: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 4,
  },

  listCard: {
    flex: 1,
    minHeight: 180,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: 'rgba(20, 43, 73, 0.30)',
    overflow: 'hidden',
  },

  list: {
    flex: 1,
  },

  listContent: {
    padding: 10,
    paddingBottom: 18,
  },

  examCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    backgroundColor: 'rgba(20, 43, 73, 0.78)',
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 12,
  },

  examCardUpcoming: {
    borderColor: '#f59e0b',
    borderWidth: 2,
    backgroundColor: 'rgba(245, 158, 11, 0.10)',
  },

  examCardRunning: {
    borderColor: '#22C55E',
    borderWidth: 2,
    backgroundColor: 'rgba(34, 197, 94, 0.10)',
  },

  examCardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },

  examTitleSection: {
    flex: 1,
    paddingRight: 8,
  },

  examNumberBox: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CARD,
    marginRight: 9,
  },

  examNumberText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '900',
  },

  examContent: {
    flex: 1,
  },

  examTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
  },

  examTitle: {
    color: TEXT,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '900',
  },

  examBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 6,
    maxWidth: '58%',
  },

  infoBadge: {
    minHeight: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    backgroundColor: 'rgba(11, 28, 50, 0.46)',
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  examInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },

  subjectText: {
    flex: 1,
    color: MUTED,
    fontSize: 12,
  },

  classText: {
    flexShrink: 1,
    maxWidth: '55%',
    color: '#AFC0D8',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'right',
  },

  scheduleText: {
    color: TEXT,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 4,
  },

  scheduleSection: {
    marginTop: 12,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 113, 151, 0.30)',
  },

  scheduleLabel: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
  },

  notScheduledText: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: '700',
    fontStyle: 'italic',
    marginTop: 4,
  },

  examActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 14,
  },

  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  outlineActionButton: {
    minWidth: 68,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: 'rgba(11, 28, 50, 0.40)',
    paddingHorizontal: 13,
  },

  outlineActionButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  deleteActionButton: {
    minWidth: 76,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#DC3545',
    paddingHorizontal: 13,
  },

  deleteActionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  primaryActionButton: {
    minWidth: 145,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
  },

  primaryActionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  actionButtonDisabled: {
    opacity: 0.46,
  },

  actionButtonTextDisabled: {
    color: '#CBD5E1',
  },

  infoBadgeText: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  statusBadge: {
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  statusDraft: {
    backgroundColor: 'rgba(100, 116, 139, 0.16)',
    borderColor: 'rgba(148, 163, 184, 0.42)',
  },

  statusScheduled: {
    backgroundColor: 'rgba(37, 99, 235, 0.17)',
    borderColor: 'rgba(96, 165, 250, 0.50)',
  },

  statusEvaluated: {
    backgroundColor: 'rgba(34, 197, 94, 0.14)',
    borderColor: 'rgba(74, 222, 128, 0.48)',
  },

  statusCancelled: {
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
    borderColor: 'rgba(248, 113, 113, 0.48)',
  },

  statusText: {
    color: TEXT,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'capitalize',
  },

  metadataRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 9,
  },

  metadataItem: {
    flex: 1,
  },

  metadataLabel: {
    color: MUTED,
    fontSize: 9,
  },

  metadataValue: {
    color: TEXT,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '700',
    marginTop: 3,
  },

  scheduleBlock: {
    marginTop: 9,
  },

  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 10,
  },

  metricText: {
    color: MUTED,
    fontSize: 9,
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.55)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: 'rgba(20, 43, 73, 0.48)',
  },

  openArrow: {
    color: '#7DD3FC',
    fontSize: 28,
    marginLeft: 8,
  },

  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  emptyState: {
    alignItems: 'center',
    margin: 12,
    paddingHorizontal: 20,
    paddingVertical: 34,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 28, 50, 0.42)',
  },

  emptyStateTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
  },

  emptyStateText: {
    color: MUTED,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 7,
  },

  emptyAddButton: {
    minHeight: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    paddingHorizontal: 13,
    marginTop: 16,
  },

  emptyAddButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.42,
  },

  hiddenMetadata: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
