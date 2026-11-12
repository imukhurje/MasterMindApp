import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',

  INNER: '#08172B',

  FIELD: '#0B1C32',

  TEXT: '#FFFFFF',

  MUTED: '#AAB7CB',

  SECONDARY_TEXT: '#C7D3E6',

  BLUE: '#3478F6',

  BORDER: '#29435F',

  FIELD_BORDER: '#3B7197',

  PILL: '#10243D',

  ERROR: '#FFB4BA',

  DELETE: '#963846',

  OVERLAY: 'rgba(1, 7, 18, 0.92)',
};

export const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 16,

    padding: 16,

    overflow: 'visible',
  },

  sectionHeader: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    justifyContent: 'space-between',

    gap: 16,
  },

  sectionHeaderMobile: {
    flexDirection: 'column',
  },

  sectionHeaderText: {
    flex: 1,

    minWidth: 0,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 17,

    fontWeight: '900',
  },

  description: {
    color: COLORS.MUTED,

    fontSize: 12,

    lineHeight: 18,

    marginTop: 5,
  },

  addCombinationButtonMobile: {
    alignSelf: 'stretch',

    width: '100%',
  },

  /*
   * Buttons
   */

  primaryButton: {
    minHeight: 44,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignItems: 'center',

    justifyContent: 'center',
  },

  primaryButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',

    textAlign: 'center',
  },

  secondaryButton: {
    minHeight: 44,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignItems: 'center',

    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '800',
  },

  /*
   * Combination list
   */

  combinationList: {
    marginTop: 16,

    gap: 12,
  },

  combinationCard: {
    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 14,

    padding: 14,
  },

  combinationTopRow: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    justifyContent: 'space-between',

    gap: 14,
  },

  combinationTopRowMobile: {
    flexDirection: 'column',
  },

  combinationTitleArea: {
    flex: 1,

    minWidth: 0,
  },

  combinationName: {
    color: COLORS.TEXT,

    fontSize: 14,

    fontWeight: '900',
  },

  combinationStudentTotal: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 4,
  },

  combinationActions: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 8,
  },

  combinationActionsMobile: {
    width: '100%',

    flexDirection: 'row',

    alignItems: 'stretch',
  },

  actionButtonMobile: {
    flex: 1,

    minWidth: 90,
  },

  outlineButton: {
    minHeight: 38,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    backgroundColor: '#0C1B30',

    borderRadius: 10,

    paddingHorizontal: 13,

    alignItems: 'center',

    justifyContent: 'center',
  },

  outlineButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',

    textAlign: 'center',
  },

  deleteButton: {
    minHeight: 38,

    backgroundColor: COLORS.DELETE,

    borderRadius: 10,

    paddingHorizontal: 14,

    alignItems: 'center',

    justifyContent: 'center',
  },

  deleteButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  combinationDivider: {
    height: StyleSheet.hairlineWidth,

    backgroundColor: COLORS.BORDER,

    marginTop: 13,
  },

  groupLabel: {
    color: '#B8CBE9',

    fontSize: 10,

    fontWeight: '900',

    letterSpacing: 0.7,

    marginTop: 13,

    marginBottom: 7,
  },

  subjectGroupLabel: {
    marginTop: 14,
  },

  displayChips: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 7,
  },

  displayChip: {
    minHeight: 32,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: COLORS.PILL,

    borderWidth: 1,

    borderColor: '#28689D',

    borderRadius: 18,

    paddingLeft: 10,

    paddingRight: 5,

    paddingVertical: 4,
  },

  displayChipText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '700',

    flexShrink: 1,
  },

  chipCountBadge: {
    minWidth: 22,

    height: 22,

    borderRadius: 11,

    backgroundColor: '#183253',

    alignItems: 'center',

    justifyContent: 'center',

    marginLeft: 6,

    paddingHorizontal: 5,
  },

  chipCountText: {
    color: COLORS.TEXT,

    fontSize: 9,

    fontWeight: '900',
  },

  /*
   * Empty
   */

  emptyCombination: {
    minHeight: 120,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderStyle: 'dashed',

    borderColor: COLORS.BORDER,

    borderRadius: 14,

    marginTop: 16,

    padding: 20,

    alignItems: 'center',

    justifyContent: 'center',
  },

  emptyCombinationTitle: {
    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '900',
  },

  emptyCombinationText: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

    marginTop: 5,

    textAlign: 'center',
  },

  /*
   * Modal shell
   */

  modalSafeArea: {
    flex: 1,

    backgroundColor: COLORS.OVERLAY,
  },

  keyboardAvoiding: {
    flex: 1,
  },

  modalOverlay: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 14,
  },

  modalCard: {
    width: '100%',

    maxWidth: 760,

    maxHeight: '92%',

    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 18,

    overflow: 'hidden',
  },

  modalCardMobile: {
    maxWidth: '100%',

    maxHeight: '96%',

    borderRadius: 14,
  },

  modalHeader: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    justifyContent: 'space-between',

    gap: 12,

    paddingHorizontal: 16,

    paddingTop: 16,

    paddingBottom: 13,

    borderBottomWidth: StyleSheet.hairlineWidth,

    borderBottomColor: COLORS.BORDER,
  },

  modalHeaderText: {
    flex: 1,

    minWidth: 0,
  },

  modalTitle: {
    color: COLORS.TEXT,

    fontSize: 16,

    fontWeight: '900',
  },

  modalSubtitle: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 15,

    marginTop: 4,
  },

  closeButton: {
    width: 40,

    height: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',

    flexShrink: 0,
  },

  closeButtonText: {
    color: COLORS.TEXT,

    fontSize: 23,

    lineHeight: 25,

    fontWeight: '500',
  },

  modalBodyScroll: {
    flexShrink: 1,
  },

  modalBodyContent: {
    padding: 16,

    paddingBottom: 24,
  },

  /*
   * Forms
   */

  formSection: {
    marginBottom: 18,
  },

  formSectionHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 10,

    marginBottom: 7,
  },

  fieldLabel: {
    color: COLORS.SECONDARY_TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  selectionCount: {
    color: COLORS.MUTED,

    fontSize: 9,

    fontWeight: '700',
  },

  textInput: {
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    color: COLORS.TEXT,

    fontSize: 12,

    paddingHorizontal: 12,

    paddingVertical: 10,
  },

  /*
   * Search selector
   */

  selectionSearchContainer: {
    width: '100%',
  },

  selectionSearchRow: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,
  },

  selectionSearchInput: {
    flex: 1,

    minWidth: 0,
  },

  addSmallButton: {
    width: 46,

    height: 46,

    backgroundColor: '#10233D',

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',

    flexShrink: 0,
  },

  addSmallButtonText: {
    color: COLORS.TEXT,

    fontSize: 20,

    lineHeight: 22,

    fontWeight: '900',
  },

  /*
   * IMPORTANT:
   * Results are not absolute.
   * They expand the modal naturally.
   */
  searchResultsBox: {
    backgroundColor: '#0D2039',

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    marginTop: 7,

    overflow: 'hidden',
  },

  searchResultItem: {
    minHeight: 42,

    justifyContent: 'center',

    paddingHorizontal: 12,

    paddingVertical: 8,

    borderBottomWidth: StyleSheet.hairlineWidth,

    borderBottomColor: COLORS.BORDER,
  },

  searchResultText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '700',

    lineHeight: 16,
  },

  selectedSearchHint: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 6,

    backgroundColor: '#102744',

    borderRadius: 8,

    marginTop: 7,

    paddingHorizontal: 10,

    paddingVertical: 8,
  },

  selectedSearchHintText: {
    color: COLORS.SECONDARY_TEXT,

    fontSize: 10,

    fontWeight: '700',
  },

  selectedSearchHintAction: {
    color: '#72A7FF',

    fontSize: 9,

    fontWeight: '800',
  },

  selectedChips: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 7,

    marginTop: 9,
  },

  selectedChip: {
    maxWidth: '100%',

    minHeight: 34,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: COLORS.PILL,

    borderWidth: 1,

    borderColor: '#28689D',

    borderRadius: 18,

    paddingLeft: 10,

    paddingRight: 4,
  },

  selectedChipText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '700',

    flexShrink: 1,

    paddingVertical: 6,
  },

  selectedChipRemoveButton: {
    width: 28,

    height: 28,

    borderRadius: 14,

    backgroundColor: '#172E4C',

    marginLeft: 5,

    alignItems: 'center',

    justifyContent: 'center',
  },

  selectedChipRemove: {
    color: COLORS.MUTED,

    fontSize: 16,

    lineHeight: 18,

    fontWeight: '900',
  },

  /*
   * Modal footer
   */

  modalFooter: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'flex-end',

    gap: 8,

    padding: 14,

    borderTopWidth: StyleSheet.hairlineWidth,

    borderTopColor: COLORS.BORDER,

    backgroundColor: '#0D1B31',
  },

  modalFooterMobile: {
    flexDirection: 'column-reverse',

    alignItems: 'stretch',
  },

  mobileFooterButton: {
    width: '100%',
  },

  /*
   * Assign students
   */

  assignModalCard: {
    width: '100%',

    maxWidth: 1120,

    maxHeight: '94%',

    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 18,

    overflow: 'hidden',
  },

  assignModalCardMobile: {
    maxWidth: '100%',

    maxHeight: '97%',

    borderRadius: 14,
  },

  assignCombinationName: {
    color: '#83ADFF',

    fontSize: 12,

    fontWeight: '800',

    marginTop: 4,
  },

  assignSubtitle: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 15,

    marginTop: 3,
  },

  assignBodyScroll: {
    flexShrink: 1,
  },

  assignBodyContent: {
    padding: 14,

    paddingBottom: 22,
  },

  assignPanelsRow: {
    flexDirection: 'row',

    alignItems: 'stretch',

    gap: 12,
  },

  assignPanelsColumn: {
    flexDirection: 'column',
  },

  studentPanel: {
    flex: 1,

    minWidth: 0,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 14,

    padding: 12,
  },

  studentPanelMobile: {
    width: '100%',

    flex: 0,
  },

  studentPanelHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 8,

    marginBottom: 9,
  },

  studentPanelTitle: {
    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '900',
  },

  studentCountBadge: {
    minWidth: 28,

    height: 24,

    borderRadius: 12,

    backgroundColor: '#173154',

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 7,
  },

  studentCountBadgeText: {
    color: '#BBD2F5',

    fontSize: 9,

    fontWeight: '900',
  },

  studentSearch: {
    minHeight: 44,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    color: COLORS.TEXT,

    paddingHorizontal: 12,

    fontSize: 11,

    marginBottom: 10,
  },

  studentListContent: {
    gap: 8,

    minHeight: 100,
  },

  studentCard: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    backgroundColor: '#0A1930',

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    padding: 11,
  },

  studentCardSelected: {
    borderColor: '#4C8CFF',

    backgroundColor: '#10294A',
  },

  checkbox: {
    width: 18,

    height: 18,

    borderWidth: 1,

    borderColor: '#8090A7',

    borderRadius: 4,

    marginRight: 9,

    marginTop: 1,

    alignItems: 'center',

    justifyContent: 'center',

    flexShrink: 0,
  },

  checkboxChecked: {
    backgroundColor: COLORS.BLUE,

    borderColor: COLORS.BLUE,
  },

  checkboxTick: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',
  },

  studentInfo: {
    flex: 1,

    minWidth: 0,
  },

  studentName: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',

    lineHeight: 16,
  },

  studentMeta: {
    color: '#B9C8DF',

    fontSize: 10,

    lineHeight: 15,

    marginTop: 3,
  },

  emptyStudentBox: {
    minHeight: 100,

    borderWidth: 1,

    borderStyle: 'dashed',

    borderColor: '#28689D',

    borderRadius: 10,

    padding: 14,

    alignItems: 'center',

    justifyContent: 'center',
  },

  emptyStudentTitle: {
    color: COLORS.SECONDARY_TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  emptyStudentText: {
    color: COLORS.MUTED,

    fontSize: 9,

    lineHeight: 14,

    textAlign: 'center',

    marginTop: 4,
  },

  /*
   * Move students
   */

  moveButtons: {
    alignSelf: 'center',

    gap: 9,
  },

  moveButtonsMobile: {
    flexDirection: 'row',

    alignSelf: 'center',

    justifyContent: 'center',

    paddingVertical: 2,
  },

  moveButton: {
    width: 46,

    height: 42,

    backgroundColor: '#10243E',

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',
  },

  moveButtonText: {
    color: COLORS.TEXT,

    fontSize: 21,

    lineHeight: 23,

    fontWeight: '900',
  },

  /*
   * Pagination
   */

  paginationRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 8,

    marginTop: 12,
  },

  pageButton: {
    width: 34,

    height: 32,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    backgroundColor: '#10213A',

    borderRadius: 9,

    alignItems: 'center',

    justifyContent: 'center',
  },

  pageButtonText: {
    color: COLORS.TEXT,

    fontSize: 18,

    lineHeight: 20,

    fontWeight: '800',
  },

  pageMeta: {
    flex: 1,

    color: COLORS.MUTED,

    fontSize: 9,

    textAlign: 'center',
  },

  assignLoading: {
    minHeight: 360,

    alignItems: 'center',

    justifyContent: 'center',
  },

  /*
   * State
   */

  stateContainer: {
    minHeight: 140,

    alignItems: 'center',

    justifyContent: 'center',
  },

  stateText: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 8,
  },

  errorText: {
    color: COLORS.ERROR,

    fontSize: 11,

    lineHeight: 17,

    marginTop: 10,

    marginBottom: 12,
  },

  buttonPressed: {
    opacity: 0.72,
  },

  buttonDisabled: {
    opacity: 0.4,
  },
});
