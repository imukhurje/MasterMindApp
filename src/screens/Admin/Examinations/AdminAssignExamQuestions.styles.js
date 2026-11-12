// src/screens/Admin/Examinations/AdminAssignExamQuestions.styles.js

import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#142B49';
const CARD_DARK = '#0B1C32';
const TEXT = '#FFFFFF';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';
const PRIMARY = '#2563EB';
const SUCCESS = '#22C55E';
const WARNING = '#F59E0B';
const DANGER = '#EF4444';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  screenContent: {
    padding: 10,
    flexGrow: 1,
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

  headerCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: CARD_DARK,
    padding: 10,
    marginBottom: 8,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '900',
  },

  examName: {
    color: MUTED,
    fontSize: 10,
    marginTop: 4,
  },

  filtersCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: CARD_DARK,
    padding: 9,
    marginBottom: 8,
  },

  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },

  filterField: {
    flexGrow: 1,
    flexBasis: 190,
  },

  filterLabel: {
    color: MUTED,
    fontSize: 10,
    marginBottom: 5,
  },

  filterInput: {
    minHeight: 44,
    color: TEXT,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD,
    paddingHorizontal: 11,
  },

  selectField: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD,
    paddingHorizontal: 11,
  },

  selectFieldText: {
    flex: 1,
    color: TEXT,
    fontSize: 11,
  },

  selectArrow: {
    color: TEXT,
    fontSize: 16,
    marginLeft: 8,
  },

  lockedField: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD,
    paddingHorizontal: 11,
  },

  lockedFieldText: {
    flex: 1,
    color: MUTED,
    fontSize: 11,
  },

  disabledField: {
    opacity: 0.6,
  },

  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },

  paginationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },

  paginationText: {
    color: MUTED,
    fontSize: 10,
  },

  pageButton: {
    minHeight: 36,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 9,
  },

  pageButtonText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '700',
  },

  currentPageButton: {
    minHeight: 36,
    minWidth: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#5BB8DD',
    paddingHorizontal: 9,
  },

  currentPageText: {
    color: TEXT,
    fontWeight: '900',
  },

  toolbarActions: {
    flexDirection: 'row',
    gap: 7,
  },

  secondaryButton: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 12,
  },

  secondaryButtonText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  assignmentArea: {
    minHeight: 220,
  },

  assignmentAreaWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },

  assignmentAreaNarrow: {
    gap: 10,
  },

  questionPanel: {
    height: 330,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: CARD,
    padding: 8,
    overflow: 'hidden',
  },

  questionPanelWide: {
    flex: 1,
  },

  panelTitle: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 7,
  },

  examPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  marksBadge: {
    minHeight: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: WARNING,
    borderRadius: 13,
    paddingHorizontal: 8,
    marginBottom: 7,
  },

  marksBadgeError: {
    borderColor: DANGER,
  },

  marksBadgeText: {
    color: '#FFD166',
    fontSize: 10,
    fontWeight: '900',
  },

  questionList: {
    flex: 1,
    minHeight: 0,
  },

  questionListContent: {
    paddingBottom: 4,
  },

  questionCard: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 9,
    backgroundColor: CARD_DARK,
    padding: 8,
    marginBottom: 5,
  },

  questionCardDisabled: {
    opacity: 0.46,
  },

  checkbox: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginRight: 8,
    marginTop: 1,
  },

  checkboxSelected: {
    borderColor: SUCCESS,
    backgroundColor: SUCCESS,
  },

  checkmark: {
    color: '#082F1A',
    fontSize: 12,
    fontWeight: '900',
  },

  questionContent: {
    flex: 1,
    color: TEXT,
    fontSize: 11,
    lineHeight: 16,
    paddingRight: 7,
  },

  questionTypeBadge: {
    maxWidth: 72,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  questionTypeText: {
    color: MUTED,
    fontSize: 9,
    textAlign: 'center',
  },

  transferControls: {
    justifyContent: 'center',
    gap: 8,
  },

  transferControlsNarrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  transferPrimary: {
    minWidth: 44,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: PRIMARY,
    paddingHorizontal: 10,
  },

  transferPrimaryText: {
    color: TEXT,
    fontWeight: '900',
  },

  transferSecondary: {
    minWidth: 44,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 10,
  },

  transferSecondaryText: {
    color: TEXT,
    fontWeight: '900',
  },

  assignedQuestionCard: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9,
    backgroundColor: CARD_DARK,
    padding: 8,
    marginBottom: 5,
  },

  assignedQuestionCardSelected: {
    borderWidth: 1,
    borderColor: '#5BB8DD',
  },

  assignedQuestionBody: {
    flex: 1,
    paddingRight: 8,
  },

  assignedQuestionContent: {
    color: TEXT,
    fontSize: 11,
    lineHeight: 16,
  },

  assignedQuestionType: {
    color: MUTED,
    fontSize: 9,
    marginTop: 4,
  },

  marksInput: {
    width: 54,
    minHeight: 40,
    color: TEXT,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD,
    paddingHorizontal: 5,
  },

  panelLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  emptyStateText: {
    color: MUTED,
    fontSize: 11,
    textAlign: 'center',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    paddingBottom: 2,
  },

  cancelButton: {
    minWidth: 78,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 12,
  },

  cancelButtonText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  saveButton: {
    minWidth: 78,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
  },

  saveButtonText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
  },

  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  modalBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(2,6,23,0.78)',
  },

  selectModal: {
    width: '100%',
    maxWidth: 430,
    maxHeight: '76%',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: CARD_DARK,
    padding: 12,
  },

  selectModalTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 9,
  },

  selectOptionsList: {
    flexGrow: 0,
  },

  selectOption: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(59,113,151,0.55)',
    borderRadius: 9,
    backgroundColor: CARD,
    paddingHorizontal: 11,
    marginBottom: 5,
  },

  selectOptionSelected: {
    borderColor: '#7DD3FC',
    backgroundColor: 'rgba(37,99,235,0.20)',
  },

  selectOptionText: {
    flex: 1,
    color: MUTED,
    fontSize: 12,
  },

  selectOptionTextSelected: {
    color: TEXT,
    fontWeight: '800',
  },

  selectOptionCheck: {
    color: '#7DD3FC',
    fontWeight: '900',
  },

  modalCloseButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD,
    marginTop: 7,
  },

  modalCloseButtonText: {
    color: TEXT,
    fontWeight: '800',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.42,
  },

  fullWidthFilterRow: {
    width: '100%',
    marginBottom: 9,
  },

  filterFieldFull: {
    width: '100%',
  },

  twoColumnRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 9,
  },

  halfFilterField: {
    flex: 1,
    minWidth: 0,
  },
  moreOptionsButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD,
    paddingHorizontal: 13,
    gap: 7,
  },

  moreOptionsText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  moreOptionsArrow: {
    color: MUTED,
    fontSize: 10,
  },

  advancedFilters: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 113, 151, 0.35)',
  },
  marksBadgeSuccess: {
    borderColor: SUCCESS,
  },

  marksBadgeTextSuccess: {
    color: SUCCESS,
  },

  marksBadgeTextError: {
    color: DANGER,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTextSection: {
    flex: 1,
    paddingRight: 10,
  },

  addQuestionButton: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: 'rgba(11, 28, 50, 0.65)',
    paddingHorizontal: 12,
  },

  addQuestionButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
