import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#0B1C32';
const CARD_ALT = '#142B49';
const TEXT = '#F8FAFC';
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG,
  },

  loadingText: {
    color: MUTED,
    fontSize: 11,
    marginTop: 10,
  },

  formCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(11, 28, 50, 0.92)',
    padding: 14,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 16,
  },

  fieldLabel: {
    color: '#CBD5E1',
    fontSize: 10,
    marginBottom: 7,
    marginTop: 12,
  },

  textInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD_ALT,
    color: TEXT,
    fontSize: 11,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },

  bioInput: {
    minHeight: 100,
  },

  multiSelectField: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD_ALT,
    paddingHorizontal: 11,
  },

  multiSelectFieldText: {
    flex: 1,
    color: TEXT,
    fontSize: 11,
  },

  placeholderText: {
    color: '#8091AA',
  },

  selectArrow: {
    color: TEXT,
    fontSize: 14,
    marginLeft: 8,
  },

  selectedItemsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },

  selectedChip: {
    maxWidth: '100%',
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.55)',
    borderRadius: 14,
    backgroundColor: 'rgba(37, 99, 235, 0.14)',
    paddingLeft: 9,
    paddingRight: 6,
    paddingVertical: 4,
  },

  selectedChipText: {
    flexShrink: 1,
    color: '#BFDBFE',
    fontSize: 9,
  },

  selectedChipRemove: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 16,
    fontWeight: '900',
    paddingLeft: 7,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },

  cancelButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD,
    paddingHorizontal: 15,
  },

  cancelButtonText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '900',
  },

  saveButton: {
    minWidth: 74,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 15,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    padding: 18,
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  multiSelectModal: {
    width: '100%',
    maxWidth: 430,
    maxHeight: '78%',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: CARD,
    padding: 12,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  modalTitle: {
    flex: 1,
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  modalCloseIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: CARD_ALT,
  },

  modalCloseIconText: {
    color: TEXT,
    fontSize: 19,
    fontWeight: '700',
  },

  modalSearchInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD_ALT,
    color: TEXT,
    fontSize: 11,
    paddingHorizontal: 11,
    marginBottom: 9,
  },

  modalList: {
    flexGrow: 0,
  },

  modalListContent: {
    paddingBottom: 5,
  },

  optionRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.42)',
    borderRadius: 9,
    paddingHorizontal: 10,
    marginBottom: 6,
  },

  optionRowSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(37, 99, 235, 0.16)',
  },

  checkbox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: 4,
    marginRight: 10,
  },

  checkboxSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#22C55E',
  },

  checkboxText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '900',
  },

  optionText: {
    flex: 1,
    color: TEXT,
    fontSize: 11,
  },

  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 113, 151, 0.40)',
    paddingTop: 10,
    marginTop: 5,
  },

  selectedCountText: {
    color: MUTED,
    fontSize: 9,
  },

  doneButton: {
    minWidth: 70,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
  },

  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  modalEmpty: {
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalEmptyText: {
    color: MUTED,
    fontSize: 10,
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.42,
  },
  readOnlyInput: {
    opacity: 0.68,
    backgroundColor: 'rgba(20, 43, 73, 0.45)',
  },

  documentsSection: {
    marginTop: 22,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,113,151,0.38)',
    gap: 10,
  },

  documentsTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },

  documentsDescription: {
    color: '#AFC0D8',
    fontSize: 11,
    lineHeight: 18,
  },

  documentsEmptyText: {
    color: '#94A3B8',
    fontSize: 11,
  },

  documentField: {
    gap: 7,
    marginTop: 5,
  },

  documentLabel: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },

  documentPickerButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 11,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#3B7197',
    backgroundColor: '#142B49',
  },

  documentPickerSelected: {
    borderColor: '#60A5FA',
  },

  documentChooseText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  documentFileName: {
    flex: 1,
    color: '#AFC0D8',
    fontSize: 11,
  },

  documentSelectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  documentSelectedText: {
    flex: 1,
    color: '#86EFAC',
    fontSize: 10,
  },

  documentRemoveButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: '#3B1828',
  },

  documentRemoveText: {
    color: '#FCA5A5',
    fontSize: 10,
    fontWeight: '700',
  },
  emailHelperText: {
    color: '#AFC0D8',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 6,
    marginBottom: 8,
  },

  draftButton: {
    minHeight: 42,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#142B49',
    paddingHorizontal: 10,
  },

  draftButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  existingDocumentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 5,
    paddingHorizontal: 3,
  },

  existingDocumentText: {
    flex: 1,
    color: '#86EFAC',
    fontSize: 10,
    lineHeight: 16,
  },

  existingDocumentLoadingText: {
    color: '#AFC0D8',
    fontSize: 10,
    marginTop: 5,
  },
});
