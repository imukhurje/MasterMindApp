// src/screens/Admin/Examinations/AdminExaminations.styles.js

import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#142B49';
const CARD_DARK = '#0B1C32';
const TEXT = '#FFFFFF';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';
const PRIMARY = '#2563EB';
const CHECKED = '#7DD3FC';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  centeredScreen: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: MUTED,
    marginTop: 12,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  pageHeaderText: {
    flex: 1,
  },
  pageTitle: {
    color: TEXT,
    fontSize: 20,
    fontWeight: '900',
  },
  pageSubtitle: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  adminBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
  },
  adminBadgeText: {
    color: CHECKED,
    fontSize: 9,
    fontWeight: '900',
  },
  createCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 43, 73, 0.42)',
    padding: 10,
    marginBottom: 12,
    gap: 9,
  },
  createInput: {
    minHeight: 48,
    color: TEXT,
    backgroundColor: CARD_DARK,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 11,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  createActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  statusSelectWrapper: {
    flex: 1,
  },
  selectField: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 11,
    paddingHorizontal: 12,
    backgroundColor: CARD_DARK,
  },
  selectText: {
    flex: 1,
    color: TEXT,
    fontSize: 13,
    fontWeight: '700',
  },
  selectArrow: {
    color: TEXT,
    fontSize: 18,
    marginLeft: 8,
  },
  createButton: {
    minWidth: 88,
    minHeight: 46,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: PRIMARY,
  },
  createButtonText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
  },
  listSection: {
    flex: 1,
    minHeight: 180,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 43, 73, 0.30)',
    overflow: 'hidden',
  },
  searchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 7,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  searchInput: {
    flex: 1,
    minWidth: 190,
    minHeight: 44,
    color: TEXT,
    backgroundColor: CARD_DARK,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 11,
    fontSize: 13,
  },
  searchButton: {
    minWidth: 72,
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 11,
    backgroundColor: PRIMARY,
  },
  searchButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '900',
  },
  clearButton: {
    minWidth: 58,
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_DARK,
  },
  clearButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '800',
  },
  refreshButton: {
    minWidth: 66,
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_DARK,
  },
  refreshButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '800',
  },
  countRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 113, 151, 0.45)',
  },
  countText: {
    color: MUTED,
    fontSize: 11,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 10,
    paddingBottom: 18,
  },
  examinationCard: {
    minHeight: 126,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    backgroundColor: 'rgba(11, 28, 50, 0.76)',
    marginBottom: 10,
    overflow: 'hidden',
  },
  examinationMain: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  examinationName: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 19,
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
  },
  statusDraft: {
    backgroundColor: 'rgba(100, 116, 139, 0.18)',
    borderColor: 'rgba(148, 163, 184, 0.46)',
  },
  statusPublished: {
    backgroundColor: 'rgba(34, 197, 94, 0.14)',
    borderColor: 'rgba(74, 222, 128, 0.46)',
  },
  statusResultPublished: {
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
    borderColor: 'rgba(96, 165, 250, 0.52)',
  },
  statusText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '800',
  },
  paperBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: 'rgba(20, 43, 73, 0.74)',
    borderWidth: 1,
    borderColor: BORDER,
  },
  paperLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
  },
  paperCount: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
  },
  updatedLabel: {
    color: MUTED,
    fontSize: 10,
  },
  updatedValue: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  manageButtonText: {
    color: CHECKED,
    fontSize: 12,
    fontWeight: '900',
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '800',
  },
  emptyStateText: {
    color: MUTED,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 7,
  },
  controlPressed: {
    opacity: 0.74,
  },
  controlDisabled: {
    opacity: 0.45,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_DARK,
    padding: 14,
  },
  modalTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },
  modalOption: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  modalOptionSelected: {
    backgroundColor: 'rgba(37, 99, 235, 0.24)',
    borderWidth: 1,
    borderColor: BORDER,
  },
  modalOptionText: {
    flex: 1,
    color: MUTED,
    fontSize: 14,
  },
  modalOptionTextSelected: {
    color: TEXT,
    fontWeight: '800',
  },
  modalOptionCheck: {
    color: CHECKED,
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 10,
  },
  modalCloseButton: {
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    marginTop: 8,
  },
  modalCloseText: {
    color: TEXT,
    fontWeight: '800',
  },
  inactiveToggle: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 11,
  },

  inactiveCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 9,
  },

  inactiveCheckboxSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },

  inactiveCheckmark: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 15,
    fontWeight: '900',
  },

  inactiveToggleText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '700',
  },
  rowActionCell: {
    width: 92,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: BORDER,
    backgroundColor: 'rgba(20, 43, 73, 0.48)',
    paddingHorizontal: 7,
  },

  manageActionButton: {
    minWidth: 74,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },

  activateButton: {
    minWidth: 78,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
  },

  activateButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  createActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    paddingVertical: 4,
  },

  topCreateButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  topCreateButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  tutorialButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#3B7197',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  tutorialButtonText: {
    color: '#7DD3FC',
    fontSize: 13,
    fontWeight: '800',
  },

  createModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.82)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  createModalCard: {
    width: '100%',
    backgroundColor: '#0B1C32',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 15,
    padding: 16,
    gap: 10,
  },

  createModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  createModalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  createModalClose: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#3B7197',
    alignItems: 'center',
    justifyContent: 'center',
  },

  createModalCloseText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },

  createModalLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },

  createStatusRow: {
    flexDirection: 'row',
    gap: 9,
  },

  createStatusOption: {
    flex: 1,
    minHeight: 44,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#3B7197',
    backgroundColor: '#142B49',
    justifyContent: 'center',
    alignItems: 'center',
  },

  createStatusSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#60A5FA',
  },

  createStatusText: {
    color: '#AFC0D8',
    fontSize: 12,
    fontWeight: '700',
  },

  createStatusTextSelected: {
    color: '#FFFFFF',
  },

  createModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 9,
    marginTop: 14,
  },

  createCancelButton: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#142B49',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  createCancelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  draftWarningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#302E2A',
    borderWidth: 1,
    borderColor: '#A16207',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 13,
    marginBottom: 12,
  },

  draftWarningText: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 19,
  },
  statusDraftText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
  },
});
