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
    padding: 14,
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

  formCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: 'rgba(11, 28, 50, 0.72)',
    padding: 13,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },

  fieldLabel: {
    color: MUTED,
    fontSize: 10,
    marginTop: 12,
    marginBottom: 6,
  },

  selectField: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 11,
  },

  selectFieldText: {
    flex: 1,
    color: TEXT,
    fontSize: 12,
  },

  selectArrow: {
    color: TEXT,
    fontSize: 15,
    marginLeft: 8,
  },

  textInput: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD_DARK,
    color: TEXT,
    fontSize: 12,
    paddingHorizontal: 11,
  },

  dateField: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 11,
  },

  dateFieldText: {
    flex: 1,
    color: TEXT,
    fontSize: 12,
  },

  calendarIcon: {
    fontSize: 15,
  },

  attachmentsSection: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BORDER,
    borderRadius: 12,
    padding: 11,
    marginTop: 15,
  },

  attachmentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  attachmentsTitle: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
  },

  attachmentsHint: {
    color: MUTED,
    fontSize: 9,
  },

  dropArea: {
    minHeight: 112,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(59, 113, 151, 0.70)',
    borderRadius: 10,
    backgroundColor: 'rgba(20, 43, 73, 0.20)',
    marginTop: 10,
  },

  dropAreaTitle: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  dropAreaOr: {
    color: MUTED,
    fontSize: 9,
    marginVertical: 6,
  },

  chooseFilesButton: {
    minHeight: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 13,
  },

  chooseFilesButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  existingAttachmentsSection: {
    marginTop: 14,
  },

  existingAttachmentsTitle: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 7,
  },

  attachmentChip: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: CARD,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 6,
  },

  attachmentChipText: {
    color: MUTED,
    fontSize: 9,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },

  cancelButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 15,
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
    paddingHorizontal: 15,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  selectModal: {
    width: '100%',
    maxWidth: 430,
    maxHeight: '75%',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: CARD_DARK,
    padding: 13,
  },

  selectModalTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 10,
  },

  selectOptionsList: {
    maxHeight: 360,
  },

  selectOption: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.40)',
    borderRadius: 9,
    paddingHorizontal: 10,
    marginBottom: 6,
  },

  selectOptionSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(37, 99, 235, 0.20)',
  },

  selectOptionText: {
    flex: 1,
    color: TEXT,
    fontSize: 11,
  },

  selectOptionTextSelected: {
    fontWeight: '900',
  },

  selectOptionCheck: {
    color: '#60A5FA',
    fontSize: 15,
    fontWeight: '900',
  },

  modalLoading: {
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalLoadingText: {
    color: MUTED,
    marginTop: 7,
  },

  modalEmpty: {
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalEmptyText: {
    color: MUTED,
    fontSize: 10,
  },

  modalCloseButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    marginTop: 8,
  },

  modalCloseButtonText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.42,
  },
  attachmentSectionSpacing: {
    marginTop: 14,
  },

  existingAttachmentsSection: {
    marginTop: 18,
  },

  existingAttachmentsTitle: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 10,
  },

  existingAttachmentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  existingAttachmentCard: {
    width: '47%',
    minHeight: 150,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(11, 28, 50, 0.78)',
  },

  attachmentPreview: {
    height: 95,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 43, 73, 0.60)',
  },

  existingAttachmentImage: {
    width: '100%',
    height: '100%',
  },

  documentPreview: {
    width: 58,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },

  documentTypeText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '900',
  },

  pdfTypeText: {
    color: '#FCA5A5',
  },

  attachmentCardBody: {
    flex: 1,
    paddingHorizontal: 9,
    paddingVertical: 8,
  },

  attachmentCardName: {
    color: TEXT,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '700',
  },

  attachmentDownloadText: {
    color: '#7DD3FC',
    fontSize: 8,
    fontWeight: '700',
    marginTop: 5,
  },
});
