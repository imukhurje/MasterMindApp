import { StyleSheet } from 'react-native';

export const COLORS = {
  OVERLAY: 'rgba(2, 8, 23, 0.88)',

  CARD: '#10203B',

  HEADER: '#0A1830',

  INNER: '#08172B',

  INNER_ALT: '#0B1C32',

  FIELD: '#0D213C',

  TEXT: '#FFFFFF',

  MUTED: '#A8B8D0',

  PLACEHOLDER: '#718096',

  BORDER: '#3B7197',

  BORDER_SOFT: '#294466',

  BLUE: '#347AF2',

  GREEN: '#22C55E',

  ERROR: '#FCA5A5',

  ERROR_BG: '#3A1721',

  ERROR_BORDER: '#EF4444',
};

export const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },

  overlay: {
    flex: 1,

    backgroundColor: COLORS.OVERLAY,

    justifyContent: 'center',

    alignItems: 'center',

    padding: 10,
  },

  modalCard: {
    width: '100%',

    maxWidth: 1120,

    maxHeight: '95%',

    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 18,

    overflow: 'hidden',

    elevation: 14,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.35,

    shadowRadius: 18,
  },

  modalCardMobile: {
    maxHeight: '98%',
  },

  /*
   * Main header
   */

  header: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    backgroundColor: COLORS.HEADER,

    borderBottomWidth: 1,

    borderBottomColor: COLORS.BORDER_SOFT,

    paddingHorizontal: 16,

    paddingVertical: 14,
  },

  headerTextContainer: {
    flex: 1,

    minWidth: 0,

    paddingRight: 12,
  },

  modalTitle: {
    color: COLORS.TEXT,

    fontSize: 18,

    fontWeight: '900',
  },

  modalSubtitle: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

    marginTop: 4,
  },

  closeButton: {
    width: 42,

    height: 42,

    borderRadius: 11,

    backgroundColor: '#162A46',

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    alignItems: 'center',

    justifyContent: 'center',
  },

  closeButtonText: {
    color: COLORS.TEXT,

    fontSize: 25,

    lineHeight: 27,
  },

  scrollView: {
    flexShrink: 1,
  },

  scrollContent: {
    padding: 14,

    paddingBottom: 22,
  },

  topFieldsRow: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: 12,
  },

  topFieldsRowMobile: {
    flexDirection: 'column',

    alignItems: 'stretch',
  },

  fieldColumn: {
    flex: 1,

    minWidth: 0,
  },

  fieldLabel: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',

    marginBottom: 6,
  },

  textInput: {
    width: '100%',

    minHeight: 46,

    color: COLORS.TEXT,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    paddingHorizontal: 12,

    paddingVertical: 9,

    fontSize: 12,
  },

  selectButton: {
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingHorizontal: 12,
  },

  selectButtonText: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '700',

    marginRight: 10,
  },

  chevron: {
    color: COLORS.TEXT,

    fontSize: 18,
  },

  dropdownList: {
    marginTop: 6,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    overflow: 'hidden',
  },

  dropdownItem: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    borderBottomWidth: StyleSheet.hairlineWidth,

    borderBottomColor: COLORS.BORDER_SOFT,

    paddingHorizontal: 12,

    paddingVertical: 9,
  },

  dropdownItemSelected: {
    backgroundColor: '#13345A',
  },

  dropdownItemText: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 11,
  },

  dropdownCheck: {
    color: '#8CC4FF',

    fontWeight: '900',
  },

  /*
   * Class groups
   */

  classFilterSection: {
    marginTop: 17,
  },

  classGroupInput: {
    maxWidth: 580,
  },

  classSearchResults: {
    width: '100%',

    maxWidth: 580,

    marginTop: 6,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    overflow: 'hidden',
  },

  classSearchItem: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingHorizontal: 12,

    paddingVertical: 8,

    borderBottomWidth: StyleSheet.hairlineWidth,

    borderBottomColor: COLORS.BORDER_SOFT,
  },

  classSearchText: {
    flex: 1,
  },

  classSearchLabel: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  classSearchCount: {
    color: COLORS.MUTED,

    fontSize: 9,

    marginTop: 2,
  },

  classSearchAdd: {
    color: '#8CC4FF',

    fontSize: 20,

    fontWeight: '900',
  },

  selectedGroupsContainer: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 7,

    marginTop: 10,

    minHeight: 29,
  },

  noGroupsText: {
    color: COLORS.MUTED,

    fontSize: 10,
  },

  groupChip: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#122E4F',

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 18,

    paddingLeft: 10,

    paddingRight: 4,

    minHeight: 32,
  },

  groupChipText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '700',
  },

  groupChipRemove: {
    width: 27,

    height: 27,

    alignItems: 'center',

    justifyContent: 'center',

    marginLeft: 4,
  },

  groupChipRemoveText: {
    color: COLORS.MUTED,

    fontSize: 17,
  },

  /*
   * Selection toolbar
   */

  selectionToolbar: {
    minHeight: 65,

    marginTop: 16,

    borderTopWidth: 1,

    borderBottomWidth: 1,

    borderColor: COLORS.BORDER_SOFT,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 12,

    paddingVertical: 10,
  },

  selectionToolbarMobile: {
    flexDirection: 'column',

    alignItems: 'stretch',
  },

  selectedCount: {
    color: COLORS.MUTED,

    fontSize: 11,

    fontWeight: '700',
  },

  visibleCount: {
    color: '#7F95B5',

    fontSize: 9,

    marginTop: 3,
  },

  selectionActions: {
    flexDirection: 'row',

    gap: 8,
  },

  secondaryButton: {
    minHeight: 40,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    backgroundColor: COLORS.INNER_ALT,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 14,
  },

  secondaryButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '800',
  },

  /*
   * Student cards
   */

  studentGrid: {
    width: '100%',

    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 10,

    marginTop: 15,
  },

  studentCard: {
    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 12,

    overflow: 'hidden',
  },

  studentCardDesktop: {
    width: '32%',
  },

  studentCardTablet: {
    width: '48.5%',
  },

  studentCardMobile: {
    width: '100%',
  },

  studentCardSelected: {
    borderColor: '#D4EAFF',

    backgroundColor: '#0D2039',
  },

  studentSelectArea: {
    minHeight: 82,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 10,

    paddingVertical: 10,
  },

  avatar: {
    width: 38,

    height: 38,

    borderRadius: 19,

    backgroundColor: COLORS.BLUE,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 10,
  },

  avatarText: {
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
  },

  studentClass: {
    color: '#BCCBE0',

    fontSize: 9,

    marginTop: 3,
  },

  studentEmail: {
    color: COLORS.MUTED,

    fontSize: 8,

    marginTop: 3,
  },

  checkbox: {
    width: 18,

    height: 18,

    borderRadius: 3,

    borderWidth: 1,

    borderColor: '#76859A',

    backgroundColor: '#2A2E32',

    alignItems: 'center',

    justifyContent: 'center',

    marginLeft: 8,
  },

  checkboxSelected: {
    backgroundColor: '#A6CFF5',

    borderColor: '#D1EAFF',
  },

  checkboxTick: {
    color: '#16304C',

    fontSize: 12,

    fontWeight: '900',
  },

  studentViewButton: {
    minHeight: 36,

    backgroundColor: '#102845',

    borderTopWidth: 1,

    borderTopColor: COLORS.BORDER_SOFT,

    alignItems: 'center',

    justifyContent: 'center',
  },

  studentViewButtonText: {
    color: '#91C7FF',

    fontSize: 10,

    fontWeight: '900',
  },

  /*
   * Main footer
   */

  footer: {
    minHeight: 70,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 12,

    backgroundColor: COLORS.HEADER,

    borderTopWidth: 1,

    borderTopColor: COLORS.BORDER_SOFT,

    paddingHorizontal: 15,

    paddingVertical: 11,
  },

  footerMobile: {
    flexDirection: 'column',

    alignItems: 'stretch',
  },

  footerInfo: {
    flex: 1,

    minWidth: 0,
  },

  footerCourse: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '800',
  },

  footerCount: {
    color: COLORS.MUTED,

    fontSize: 9,

    marginTop: 2,
  },

  saveButton: {
    minWidth: 160,

    minHeight: 44,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 16,
  },

  saveButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  /*
   * Student course editor
   */

  studentEditorHeader: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    justifyContent: 'space-between',

    backgroundColor: COLORS.HEADER,

    borderBottomWidth: 1,

    borderBottomColor: COLORS.BORDER_SOFT,

    padding: 14,

    gap: 12,
  },

  studentEditorHeaderText: {
    flex: 1,

    minWidth: 0,
  },

  studentEditorTitle: {
    color: COLORS.TEXT,

    fontSize: 16,

    fontWeight: '900',
  },

  studentEditorSubtitle: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 16,

    marginTop: 4,
  },

  studentCloseButton: {
    minWidth: 72,

    minHeight: 40,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 13,
  },

  studentCloseButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  studentEditorState: {
    minHeight: 350,

    alignItems: 'center',

    justifyContent: 'center',
  },

  studentEditorScroll: {
    flexShrink: 1,
  },

  studentEditorContent: {
    padding: 14,

    paddingBottom: 24,
  },

  /*
   * Student details
   */

  studentSummaryGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 10,
  },

  summaryCard: {
    flexGrow: 1,

    flexBasis: 180,

    minHeight: 70,

    backgroundColor: COLORS.INNER_ALT,

    borderWidth: 1,

    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 10,

    padding: 11,
  },

  summaryLabel: {
    color: COLORS.MUTED,

    fontSize: 9,
  },

  summaryValue: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',

    marginTop: 6,
  },

  /*
   * Assigned / Available panes
   */

  courseTransferLayout: {
    flexDirection: 'row',

    alignItems: 'stretch',

    gap: 10,

    marginTop: 14,
  },

  courseTransferLayoutMobile: {
    flexDirection: 'column',
  },

  coursePane: {
    flex: 1,

    minWidth: 0,

    backgroundColor: COLORS.INNER_ALT,

    borderWidth: 1,

    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 12,

    overflow: 'hidden',
  },

  coursePaneHeader: {
    minHeight: 46,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    backgroundColor: COLORS.INNER,

    borderBottomWidth: 1,

    borderBottomColor: COLORS.BORDER_SOFT,

    paddingHorizontal: 12,
  },

  coursePaneTitle: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  coursePaneCount: {
    color: COLORS.MUTED,

    fontSize: 11,
  },

  coursePaneBody: {
    padding: 8,

    minHeight: 250,

    gap: 7,
  },

  courseSelectionRow: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#0C1E36',

    borderWidth: 1,

    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 8,

    paddingHorizontal: 10,

    paddingVertical: 7,
  },

  courseSelectionRowSelected: {
    borderColor: '#CBE6FF',

    backgroundColor: '#112D4C',
  },

  courseCheckbox: {
    width: 17,

    height: 17,

    borderRadius: 2,

    borderWidth: 1,

    borderColor: '#7E8998',

    backgroundColor: '#313334',

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 9,
  },

  courseCheckboxSelected: {
    backgroundColor: '#AAD4FB',
  },

  courseCheckboxTick: {
    color: '#17314D',

    fontSize: 11,

    fontWeight: '900',
  },

  courseSelectionTitle: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '700',

    lineHeight: 15,
  },

  emptyPaneText: {
    color: COLORS.MUTED,

    fontSize: 10,

    textAlign: 'center',

    paddingVertical: 30,
  },

  /*
   * Transfer controls
   */

  transferControls: {
    alignSelf: 'center',

    gap: 8,

    width: 50,
  },

  transferControlsMobile: {
    width: '100%',

    flexDirection: 'row',

    justifyContent: 'center',
  },

  transferButton: {
    minWidth: 48,

    minHeight: 42,

    backgroundColor: COLORS.INNER_ALT,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 10,
  },

  transferButtonText: {
    color: COLORS.MUTED,

    fontSize: 14,

    fontWeight: '900',
  },

  /*
   * Student editor footer
   */

  studentEditorFooter: {
    minHeight: 68,

    flexDirection: 'row',

    justifyContent: 'flex-end',

    alignItems: 'center',

    gap: 8,

    backgroundColor: COLORS.HEADER,

    borderTopWidth: 1,

    borderTopColor: COLORS.BORDER_SOFT,

    paddingHorizontal: 14,

    paddingVertical: 11,
  },

  studentEditorFooterMobile: {
    flexDirection: 'column-reverse',

    alignItems: 'stretch',
  },

  studentCancelButton: {
    minWidth: 90,

    minHeight: 42,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 14,
  },

  studentCancelButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  studentSaveButton: {
    minWidth: 135,

    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 15,
  },

  studentSaveButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  studentFooterButtonMobile: {
    width: '100%',
  },

  /*
   * States
   */

  stateContainer: {
    minHeight: 320,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 20,
  },

  stateText: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 10,
  },

  errorContainer: {
    margin: 14,

    backgroundColor: COLORS.ERROR_BG,

    borderWidth: 1,

    borderColor: COLORS.ERROR_BORDER,

    borderRadius: 12,

    padding: 15,
  },

  errorTitle: {
    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '900',
  },

  errorText: {
    color: COLORS.ERROR,

    fontSize: 10,

    lineHeight: 16,

    marginTop: 5,

    marginBottom: 12,
  },

  retryButton: {
    alignSelf: 'flex-start',

    minHeight: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 9,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 15,
  },

  retryButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.74,
  },

  buttonDisabled: {
    opacity: 0.4,
  },
});
