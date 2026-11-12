// src/screens/Admin/Examinations/AdminAssignExamStudents.styles.js

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
    padding: 12,
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
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: CARD,
    padding: 11,
    marginBottom: 10,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '900',
  },

  examName: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  formCard: {
    flex: 1,
    minHeight: 240,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: CARD_DARK,
    padding: 11,
  },

  fieldLabel: {
    color: MUTED,
    fontSize: 11,
    marginBottom: 7,
  },

  classSelect: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD,
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  classSelectText: {
    flex: 1,
    color: TEXT,
    fontSize: 12,
  },

  classSelectArrow: {
    color: TEXT,
    fontSize: 18,
    marginLeft: 8,
  },

  searchInput: {
    minHeight: 46,
    color: TEXT,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  listActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },

  secondaryButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD,
    paddingHorizontal: 12,
  },

  secondaryButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  selectedBadge: {
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: CARD,
    paddingHorizontal: 10,
  },

  selectedBadgeText: {
    color: MUTED,
    fontSize: 10,
  },

  listWrapper: {
    flex: 1,
    minHeight: 120,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    overflow: 'hidden',
  },

  list: {
    flex: 1,
  },

  listContent: {
    padding: 5,
  },

  optionsLoading: {
    flex: 1,
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionsLoadingText: {
    color: MUTED,
    marginTop: 10,
  },

  studentRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.60)',
    borderRadius: 9,
    backgroundColor: 'rgba(20, 43, 73, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 5,
  },

  studentRowSelected: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },

  checkbox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 3,
    backgroundColor: CARD_DARK,
    marginRight: 10,
  },

  checkboxSelected: {
    borderColor: SUCCESS,
    backgroundColor: SUCCESS,
  },

  checkmark: {
    color: '#082F1A',
    fontSize: 13,
    fontWeight: '900',
  },

  studentContent: {
    flex: 1,
  },

  studentName: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  studentMeta: {
    color: MUTED,
    fontSize: 10,
    marginTop: 4,
  },

  rollNumber: {
    color: TEXT,
    fontSize: 11,
    marginLeft: 9,
  },

  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 36,
  },

  emptyStateTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  emptyStateText: {
    color: MUTED,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 9,
    paddingTop: 11,
  },

  cancelButton: {
    minWidth: 80,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD,
    paddingHorizontal: 12,
  },

  cancelButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  saveButton: {
    minWidth: 80,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
  },

  saveButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '900',
  },

  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  emptyClassList: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyClassListText: {
    color: MUTED,
    fontSize: 12,
  },

  modalBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
  },

  classModal: {
    width: '100%',
    maxWidth: 430,
    maxHeight: '78%',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    backgroundColor: CARD_DARK,
    padding: 14,
  },

  classModalTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },

  classOptionsList: {
    flexGrow: 0,
  },

  classOption: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.55)',
    borderRadius: 10,
    backgroundColor: CARD,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 6,
  },

  classOptionSelected: {
    borderColor: '#7DD3FC',
    backgroundColor: 'rgba(37, 99, 235, 0.20)',
  },

  classOptionTextWrapper: {
    flex: 1,
  },

  classOptionText: {
    color: MUTED,
    fontSize: 13,
  },

  classOptionTextSelected: {
    color: TEXT,
    fontWeight: '800',
  },

  itemClassText: {
    color: '#7DD3FC',
    fontSize: 9,
    marginTop: 3,
  },

  classOptionCheck: {
    color: '#7DD3FC',
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 10,
  },

  modalCloseButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD,
    marginTop: 8,
  },

  modalCloseText: {
    color: TEXT,
    fontWeight: '800',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.42,
  },
});
