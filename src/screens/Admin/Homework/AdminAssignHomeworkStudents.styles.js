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
    fontSize: 10,
    marginTop: 7,
  },

  headerCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: CARD,
    padding: 11,
    marginBottom: 9,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
  },

  homeworkName: {
    color: MUTED,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  formCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 43, 73, 0.38)',
    padding: 10,
  },

  fieldLabel: {
    color: MUTED,
    fontSize: 9,
    marginBottom: 6,
    marginTop: 5,
  },

  selectField: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD,
    paddingHorizontal: 10,
  },

  selectFieldText: {
    flex: 1,
    color: TEXT,
    fontSize: 11,
    fontWeight: '700',
  },

  selectArrow: {
    color: TEXT,
    fontSize: 13,
  },

  searchInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD,
    color: TEXT,
    fontSize: 11,
    paddingHorizontal: 10,
  },

  selectionActions: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 7,
  },

  outlineButton: {
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 10,
  },

  outlineButtonText: {
    color: TEXT,
    fontSize: 9,
    fontWeight: '900',
  },

  selectedBadge: {
    minHeight: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 8,
  },

  selectedBadgeText: {
    color: MUTED,
    fontSize: 8,
    fontWeight: '700',
  },

  studentListCard: {
    flex: 1,
    minHeight: 250,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD_DARK,
    overflow: 'hidden',
  },

  studentListContent: {
    padding: 5,
  },

  studentCard: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.52)',
    borderRadius: 8,
    backgroundColor: 'rgba(11, 28, 50, 0.60)',
    paddingHorizontal: 9,
    paddingVertical: 7,
    marginBottom: 4,
  },

  studentCardSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(37, 99, 235, 0.16)',
  },

  checkbox: {
    width: 20,
    height: 20,
    flexShrink: 0,
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

  checkboxCheck: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '900',
  },

  studentContent: {
    flex: 1,
  },

  studentName: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
  },

  studentSecondary: {
    color: MUTED,
    fontSize: 8,
    marginTop: 3,
  },

  rollNumber: {
    color: TEXT,
    fontSize: 10,
    marginLeft: 8,
  },

  listLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyState: {
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyStateText: {
    color: MUTED,
    fontSize: 10,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 10,
  },

  cancelButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 14,
  },

  cancelButtonText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '800',
  },

  saveButton: {
    minWidth: 70,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
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
    padding: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  classModal: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: CARD_DARK,
    padding: 12,
  },

  modalTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 10,
  },

  classOption: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.45)',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
  },

  classOptionSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
  },

  classOptionText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '700',
  },

  itemClassHint: {
    color: '#7DD3FC',
    fontSize: 8,
    marginTop: 2,
  },

  classOptionCheck: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '900',
  },

  modalCloseButton: {
    minHeight: 39,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    marginTop: 4,
  },

  modalCloseButtonText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '800',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.42,
  },
});
