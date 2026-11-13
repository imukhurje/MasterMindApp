import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#142B49';
const CARD_DARK = '#0B1C32';
const BORDER = '#3B7197';
const TEXT = '#E2E8F0';
const MUTED = '#AFC0D8';
const PRIMARY = '#2563EB';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 14,
    paddingBottom: 35,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: MUTED,
    fontSize: 12,
    marginTop: 12,
  },

  filterCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    padding: 14,
  },

  filterTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  label: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '700',
  },

  selectField: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectText: {
    flex: 1,
    color: TEXT,
    fontSize: 12,
  },

  placeholderText: {
    color: MUTED,
  },

  chevron: {
    color: TEXT,
    fontSize: 20,
    marginLeft: 8,
  },

  saveButton: {
    minHeight: 40,
    backgroundColor: PRIMARY,
    borderRadius: 9,
    paddingHorizontal: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  disabledButton: {
    opacity: 0.45,
  },

  helpText: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 12,
  },

  coursesContainer: {
    marginTop: 14,
    padding: 15,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    minHeight: 110,
    justifyContent: 'center',
  },

  emptyState: {
    gap: 8,
  },

  emptyTitle: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },

  emptyText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },

  courseCard: {
    minHeight: 72,
    backgroundColor: '#0B1629',
    borderWidth: 1,
    borderColor: '#223F62',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  courseTitle: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },

  dragIcon: {
    color: MUTED,
    fontSize: 22,
    marginLeft: 10,
  },

  errorBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: '#321B24',
  },

  errorText: {
    color: '#FCA5A5',
    fontSize: 11,
  },

  retryText: {
    color: '#93C5FD',
    marginTop: 8,
    fontWeight: '800',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modalCard: {
    width: '100%',
    maxWidth: 430,
    maxHeight: '75%',
    backgroundColor: CARD_DARK,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 15,
    padding: 14,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  modalTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
  },

  modalClose: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC3545',
    borderRadius: 8,
  },

  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  categoryList: {
    flexGrow: 0,
    maxHeight: 370,
  },

  categoryOption: {
    minHeight: 46,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#294B6A',
    backgroundColor: CARD,
    borderRadius: 9,
    marginBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  categoryOptionSelected: {
    borderColor: '#60A5FA',
    backgroundColor: '#1D3F6D',
  },

  categoryOptionText: {
    color: TEXT,
    fontSize: 12,
    flex: 1,
  },

  categoryCheck: {
    color: '#93C5FD',
    fontSize: 17,
    fontWeight: '900',
  },
  courseCardDragging: {
    borderColor: '#60A5FA',
    backgroundColor: '#1B3557',
    elevation: 8,
  },

  dragHandle: {
    width: 30,
    height: 34,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3B7197',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dragIcon: {
    color: '#DCEAFF',
    fontSize: 19,
  },

  courseInfo: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },

  courseMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },

  courseSlug: {
    flexShrink: 1,
    color: '#AFC0D8',
    fontSize: 10,
  },

  statusBadge: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  publishedBadge: {
    borderColor: '#22C55E',
  },

  draftBadge: {
    borderColor: '#EF4444',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },

  publishedText: {
    color: '#86EFAC',
  },

  draftText: {
    color: '#FCA5A5',
  },

  unsavedText: {
    color: '#FCD34D',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 10,
  },
});
