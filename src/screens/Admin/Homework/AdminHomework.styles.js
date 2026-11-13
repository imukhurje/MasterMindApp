// src/screens/Admin/Homework/AdminHomework.styles.js

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
    minHeight: 74,
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
    paddingRight: 10,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '900',
  },

  pageSubtitle: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  addHomeworkButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: PRIMARY,
    paddingHorizontal: 13,
  },

  addHomeworkButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  contentCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: 'rgba(20, 43, 73, 0.55)',
    padding: 10,
  },

  searchInput: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: 'rgba(11, 28, 50, 0.65)',
    color: TEXT,
    fontSize: 12,
    paddingHorizontal: 12,
  },

  resultSummary: {
    minHeight: 31,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 113, 151, 0.35)',
    marginBottom: 8,
  },

  resultSummaryText: {
    color: MUTED,
    fontSize: 9,
  },

  listContent: {
    paddingBottom: 20,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  emptyState: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 14,
  },

  emptyStateText: {
    color: MUTED,
    fontSize: 11,
    textAlign: 'center',
  },

  homeworkCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: 'rgba(20, 43, 73, 0.78)',
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 10,
  },

  homeworkTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },

  homeworkTitleSection: {
    flex: 1,
    paddingRight: 6,
  },

  homeworkTitle: {
    color: TEXT,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '900',
  },

  homeworkBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 6,
    maxWidth: '62%',
  },

  infoBadge: {
    minHeight: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 28, 50, 0.45)',
    paddingHorizontal: 7,
  },

  infoBadgeText: {
    color: MUTED,
    fontSize: 8,
    fontWeight: '700',
  },

  statusBadge: {
    minHeight: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
  },

  statusScheduled: {
    borderColor: 'rgba(96, 165, 250, 0.55)',
    backgroundColor: 'rgba(37, 99, 235, 0.16)',
  },

  statusDraft: {
    borderColor: 'rgba(148, 163, 184, 0.45)',
    backgroundColor: 'rgba(100, 116, 139, 0.14)',
  },

  statusEvaluated: {
    borderColor: 'rgba(34, 197, 94, 0.55)',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },

  statusText: {
    color: TEXT,
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'capitalize',
  },

  homeworkInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
  },

  courseText: {
    flex: 1,
    color: MUTED,
    fontSize: 11,
  },

  classText: {
    color: MUTED,
    fontSize: 11,
    textAlign: 'right',
  },

  dueText: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 10,
  },

  dueLabel: {
    color: TEXT,
    fontWeight: '900',
  },

  homeworkActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 9,
    marginTop: 13,
  },

  leftActions: {
    flexDirection: 'row',
    gap: 8,
  },

  rightActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  outlineButton: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: 'rgba(11, 28, 50, 0.45)',
    paddingHorizontal: 12,
  },

  outlineButtonText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '800',
  },

  deleteButton: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#EF4444',
    paddingHorizontal: 13,
  },

  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  primaryButton: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  hiddenMetadata: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },

  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#3B7197',
    backgroundColor: '#0F172A',
  },

  paginationLeft: {
    flex: 1,
  },

  paginationTotalText: {
    color: '#AFC0D8',
    fontSize: 12,
    fontWeight: '600',
  },

  paginationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  paginationButton: {
    width: 43,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 11,
    backgroundColor: '#142B49',
  },

  paginationButtonDisabled: {
    opacity: 0.4,
  },

  paginationArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  paginationPageIndicator: {
    minWidth: 48,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 18,
    backgroundColor: '#142B49',
    paddingHorizontal: 8,
  },

  paginationPageText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
});
