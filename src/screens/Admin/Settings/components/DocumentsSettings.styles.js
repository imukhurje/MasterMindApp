import { StyleSheet } from 'react-native';

export const COLORS = {
  BG: '#071426',

  CARD: '#111E34',

  INNER: '#08172B',

  FIELD: '#0B1C32',

  TEXT: '#FFFFFF',

  MUTED: '#94A3B8',

  SECONDARY_TEXT: '#CBD5E1',

  BLUE: '#3478F6',

  BLUE_DARK: '#1852B4',

  BORDER: '#29435F',

  FIELD_BORDER: '#3B7197',

  DANGER: '#E5484D',

  DANGER_BORDER: '#F06468',

  ERROR: '#FFB4BA',
};

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 36,
  },

  /*
   * Page Header
   */

  pageHeader: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    justifyContent: 'space-between',

    flexWrap: 'wrap',

    gap: 12,

    marginBottom: 14,
  },

  pageHeaderText: {
    flex: 1,

    minWidth: 220,
  },

  pageTitle: {
    color: COLORS.TEXT,

    fontSize: 20,

    fontWeight: '900',
  },

  pageDescription: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 18,

    marginTop: 5,

    maxWidth: 700,
  },

  refreshButton: {
    minHeight: 40,

    minWidth: 90,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    backgroundColor: COLORS.FIELD,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 14,
  },

  refreshButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',
  },

  /*
   * Add Section
   */

  addSection: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 16,

    padding: 16,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 16,

    fontWeight: '900',
  },

  sectionDescription: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

    marginTop: 5,

    marginBottom: 14,
  },

  addRow: {
    flexDirection: 'row',

    alignItems: 'flex-end',

    gap: 12,
  },

  addRowMobile: {
    flexDirection: 'column',

    alignItems: 'stretch',
  },

  addNameColumn: {
    flex: 1,

    minWidth: 0,
  },

  requirementColumn: {
    width: 180,

    flexShrink: 0,
  },

  requirementColumnMobile: {
    width: '100%',
  },

  addActionColumn: {
    flexShrink: 0,
  },

  addActionColumnMobile: {
    width: '100%',
  },

  fieldLabel: {
    color: COLORS.SECONDARY_TEXT,

    fontSize: 10,

    fontWeight: '700',

    marginBottom: 6,
  },

  textInput: {
    minHeight: 45,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    color: COLORS.TEXT,

    fontSize: 12,

    paddingHorizontal: 12,

    paddingVertical: 9,
  },

  /*
   * Requirement Selector
   */

  requirementSelector: {
    width: '100%',
  },

  requirementButton: {
    minHeight: 45,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    paddingHorizontal: 12,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  requirementButtonOpen: {
    borderColor: COLORS.BLUE,

    borderBottomLeftRadius: 7,

    borderBottomRightRadius: 7,
  },

  requirementButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '700',
  },

  chevron: {
    color: COLORS.SECONDARY_TEXT,

    fontSize: 18,

    marginLeft: 10,
  },

  /*
   * Dropdown deliberately remains in normal
   * flow to avoid clipping inside ScrollView.
   */

  requirementOptions: {
    marginTop: 5,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    overflow: 'hidden',
  },

  requirementOption: {
    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingHorizontal: 12,

    borderBottomWidth: StyleSheet.hairlineWidth,

    borderBottomColor: COLORS.BORDER,
  },

  requirementOptionSelected: {
    backgroundColor: '#123158',
  },

  requirementOptionText: {
    color: COLORS.SECONDARY_TEXT,

    fontSize: 11,

    fontWeight: '700',
  },

  requirementOptionTextSelected: {
    color: COLORS.TEXT,

    fontWeight: '900',
  },

  optionCheck: {
    color: '#82B1FF',

    fontSize: 13,

    fontWeight: '900',
  },

  /*
   * Buttons
   */

  addButton: {
    minHeight: 45,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignItems: 'center',

    justifyContent: 'center',
  },

  addButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  saveButton: {
    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',

    justifyContent: 'center',
  },

  saveButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',
  },

  deleteButton: {
    minHeight: 42,

    backgroundColor: COLORS.DANGER,

    borderWidth: 1,

    borderColor: COLORS.DANGER_BORDER,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',

    justifyContent: 'center',
  },

  deleteButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',
  },

  mobileActionButton: {
    flex: 1,
  },

  /*
   * Existing Documents
   */

  documentsList: {
    gap: 10,

    marginTop: 10,
  },

  documentCard: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 14,

    padding: 14,
  },

  documentRow: {
    flexDirection: 'row',

    alignItems: 'flex-end',

    gap: 12,
  },

  documentRowMobile: {
    flexDirection: 'column',

    alignItems: 'stretch',
  },

  documentNameColumn: {
    flex: 1,

    minWidth: 0,
  },

  rowActions: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

    flexShrink: 0,
  },

  rowActionsMobile: {
    width: '100%',
  },

  /*
   * Empty
   */

  emptyCard: {
    minHeight: 100,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderStyle: 'dashed',

    borderColor: COLORS.BORDER,

    borderRadius: 12,

    padding: 18,

    alignItems: 'center',

    justifyContent: 'center',
  },

  emptyTitle: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  emptyDescription: {
    color: COLORS.MUTED,

    fontSize: 9,

    lineHeight: 15,

    textAlign: 'center',

    marginTop: 4,
  },

  sectionDivider: {
    height: 22,
  },

  /*
   * Loading / Error
   */

  stateContainer: {
    flex: 1,

    minHeight: 280,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 20,
  },

  stateText: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 10,
  },

  errorTitle: {
    color: COLORS.TEXT,

    fontSize: 14,

    fontWeight: '900',

    textAlign: 'center',
  },

  errorDescription: {
    color: COLORS.ERROR,

    fontSize: 10,

    lineHeight: 16,

    textAlign: 'center',

    marginTop: 6,

    marginBottom: 14,
  },

  retryButton: {
    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 18,

    alignItems: 'center',

    justifyContent: 'center',
  },

  retryButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.72,
  },

  buttonDisabled: {
    opacity: 0.4,
  },
});
