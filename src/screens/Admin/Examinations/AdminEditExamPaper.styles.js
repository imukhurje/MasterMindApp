// src/screens/Admin/Examinations/AdminEditExamPaper.styles.js

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
  screenContent: {
    padding: 12,
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
  formCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    backgroundColor: CARD_DARK,
    padding: 13,
  },
  pageTitle: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 6,
  },
  fieldLabel: {
    color: MUTED,
    fontSize: 11,
    marginTop: 18,
    marginBottom: 7,
  },
  selectField: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD,
    paddingHorizontal: 12,
  },
  selectFieldText: {
    flex: 1,
    color: TEXT,
    fontSize: 12,
  },
  selectArrow: {
    color: TEXT,
    fontSize: 17,
    marginLeft: 8,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    minHeight: 28,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CARD,
    marginRight: 9,
  },
  checkboxSelected: {
    borderColor: '#5BB8DD',
    backgroundColor: '#5BB8DD',
  },
  checkmark: {
    color: '#0B1C32',
    fontSize: 13,
    fontWeight: '900',
  },
  deliveryText: {
    color: TEXT,
    fontSize: 12,
  },
  helperText: {
    color: MUTED,
    fontSize: 10,
    marginTop: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 9,
    marginTop: 22,
  },
  cancelButton: {
    minWidth: 82,
    minHeight: 44,
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
    minWidth: 82,
    minHeight: 44,
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
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(2,6,23,0.80)',
  },
  selectModal: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '78%',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    backgroundColor: CARD_DARK,
    padding: 13,
  },
  selectModalTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },
  selectOptionsList: {
    flexGrow: 0,
  },
  selectOption: {
    minHeight: 48,
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
    backgroundColor: 'rgba(37,99,235,0.22)',
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
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 8,
  },
  modalState: {
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStateText: {
    color: MUTED,
    marginTop: 8,
    textAlign: 'center',
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
  sectionTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
  },

  marksInput: {
    minHeight: 48,
    color: TEXT,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD,
    paddingHorizontal: 12,
    fontSize: 13,
  },

  examProperText: {
    color: MUTED,
    fontSize: 11,
    marginTop: 17,
  },

  examProperValue: {
    color: TEXT,
    fontWeight: '900',
  },

  requirementsHeader: {
    marginTop: 22,
  },

  requirementsActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },

  addItemButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: PRIMARY,
    paddingHorizontal: 13,
  },

  addItemButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '900',
  },

  templateButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD,
    paddingHorizontal: 13,
  },

  templateButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  emptyRequirementsText: {
    color: MUTED,
    fontSize: 11,
    marginTop: 18,
    marginLeft: 8,
  },

  requirementsList: {
    gap: 8,
    marginTop: 12,
  },

  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.45)',
    borderRadius: 10,
    backgroundColor: 'rgba(20, 43, 73, 0.35)',
    padding: 8,
  },

  requirementNameInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    color: TEXT,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD,
    paddingHorizontal: 10,
    fontSize: 11,
  },

  requirementMarksInput: {
    width: 78,
    minHeight: 44,
    color: TEXT,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD,
    paddingHorizontal: 7,
  },

  removeItemButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: PRIMARY,
  },

  removeItemButtonText: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
  },
  templateSaveModal: {
    width: '90%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: CARD_DARK,
    padding: 14,
  },

  templatePickerModal: {
    width: '90%',
    maxWidth: 430,
    maxHeight: '75%',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: CARD_DARK,
    padding: 14,
  },

  templateModalTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
  },

  templateFieldLabel: {
    color: MUTED,
    fontSize: 11,
    marginBottom: 7,
  },

  templateNameInput: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD,
    color: TEXT,
    paddingHorizontal: 12,
    fontSize: 12,
  },

  templateModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 9,
    marginTop: 14,
  },

  templateRadioRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  radioOuterSelected: {
    borderColor: '#7DD3FC',
  },

  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7DD3FC',
  },

  templateRadioText: {
    flex: 1,
    color: TEXT,
    fontSize: 12,
  },

  sectionsContainer: {
    marginTop: 12,
    marginBottom: 8,
  },

  sectionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 9,
    marginTop: 6,
  },

  sectionChip: {
    minWidth: 42,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 22,
    backgroundColor: '#0B1C32',
  },

  sectionChipSelected: {
    borderColor: '#60A5FA',
    backgroundColor: '#2563EB',
  },

  sectionChipText: {
    color: '#AFC0D8',
    fontSize: 12,
    fontWeight: '700',
  },

  sectionChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  sectionCheckIcon: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  sectionHelper: {
    color: '#AFC0D8',
    fontSize: 10,
    marginTop: 7,
  },
});
