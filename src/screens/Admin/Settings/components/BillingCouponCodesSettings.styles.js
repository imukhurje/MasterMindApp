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

  ERROR: '#FFB4BA',

  DELETE: '#963846',

  DELETE_BORDER: '#B94B59',

  OVERLAY: 'rgba(1, 7, 18, 0.92)',
};

export const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 16,

    padding: 16,
  },

  sectionHeader: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'flex-start',

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

  addButtonMobile: {
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
   * Coupon Cards
   */

  couponList: {
    marginTop: 16,

    gap: 9,
  },

  couponCard: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 12,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 13,

    padding: 12,
  },

  couponCardMobile: {
    flexDirection: 'column',

    alignItems: 'stretch',
  },

  couponInfo: {
    flex: 1,

    minWidth: 0,
  },

  codeRow: {
    flexDirection: 'row',

    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 7,
  },

  couponCode: {
    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '900',

    letterSpacing: 0.3,
  },

  discountBadge: {
    minHeight: 26,

    backgroundColor: '#16345B',

    borderRadius: 13,

    paddingHorizontal: 9,

    alignItems: 'center',

    justifyContent: 'center',
  },

  discountBadgeText: {
    color: '#CFE0FA',

    fontSize: 9,

    fontWeight: '900',
  },

  couponDates: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 15,

    marginTop: 6,
  },

  couponActions: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 7,
  },

  couponActionsMobile: {
    width: '100%',
  },

  actionButtonMobile: {
    flex: 1,
  },

  editButton: {
    minHeight: 38,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    backgroundColor: '#10223D',

    borderRadius: 9,

    paddingHorizontal: 13,

    alignItems: 'center',

    justifyContent: 'center',
  },

  editButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '800',
  },

  deleteButton: {
    minHeight: 38,

    backgroundColor: COLORS.DELETE,

    borderWidth: 1,

    borderColor: COLORS.DELETE_BORDER,

    borderRadius: 9,

    paddingHorizontal: 13,

    alignItems: 'center',

    justifyContent: 'center',
  },

  deleteButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',
  },

  /*
   * Empty State
   */

  emptyState: {
    minHeight: 120,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderStyle: 'dashed',

    borderColor: COLORS.BORDER,

    borderRadius: 13,

    marginTop: 16,

    padding: 18,

    alignItems: 'center',

    justifyContent: 'center',
  },

  emptyStateTitle: {
    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '900',
  },

  emptyStateText: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 16,

    textAlign: 'center',

    marginTop: 5,
  },

  /*
   * Modal
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

    maxHeight: '94%',

    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 18,

    overflow: 'hidden',
  },

  modalCardMobile: {
    maxWidth: '100%',

    maxHeight: '97%',

    borderRadius: 14,
  },

  modalHeader: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'flex-start',

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
  },

  modalBodyScroll: {
    flexShrink: 1,
  },

  modalBodyContent: {
    padding: 16,

    paddingBottom: 28,
  },

  /*
   * Form
   */

  formGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    alignItems: 'flex-start',

    gap: 14,
  },

  formGridMobile: {
    flexDirection: 'column',
  },

  formField: {
    width: '48%',

    minWidth: 280,

    flexGrow: 1,
  },

  formFieldMobile: {
    width: '100%',

    minWidth: 0,
  },

  fieldLabel: {
    color: COLORS.SECONDARY_TEXT,

    fontSize: 11,

    fontWeight: '800',

    marginBottom: 7,
  },

  fieldHelper: {
    color: COLORS.MUTED,

    fontSize: 9,

    lineHeight: 14,

    marginTop: 5,
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
   * Discount Dropdown
   */

  dropdownButton: {
    minHeight: 46,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  dropdownButtonText: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '700',
  },

  dropdownArrow: {
    color: COLORS.TEXT,

    fontSize: 15,

    marginLeft: 10,
  },

  /*
   * Dropdown is normal-flow,
   * not absolute positioned.
   */
  dropdownOptions: {
    backgroundColor: '#0D2039',

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    marginTop: 7,

    overflow: 'hidden',
  },

  dropdownOption: {
    minHeight: 43,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 10,

    paddingHorizontal: 12,

    borderBottomWidth: StyleSheet.hairlineWidth,

    borderBottomColor: COLORS.BORDER,
  },

  dropdownOptionSelected: {
    backgroundColor: '#173B5D',
  },

  dropdownOptionText: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '700',
  },

  dropdownCheck: {
    color: '#72A7FF',

    fontSize: 13,

    fontWeight: '900',
  },

  /*
   * Date
   */

  dateButton: {
    minHeight: 46,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  dateButtonActive: {
    borderColor: COLORS.BLUE,
  },

  dateButtonText: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '700',
  },

  datePlaceholder: {
    color: COLORS.MUTED,

    fontWeight: '500',
  },

  calendarIcon: {
    color: COLORS.TEXT,

    fontSize: 15,

    marginLeft: 8,
  },

  /*
   * Inline Calendar
   */

  inlineCalendar: {
    width: '100%',

    marginTop: 10,

    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 12,

    overflow: 'hidden',
  },

  inlineCalendarHeader: {
    minHeight: 40,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 10,

    paddingHorizontal: 12,

    borderBottomWidth: StyleSheet.hairlineWidth,

    borderBottomColor: COLORS.BORDER,
  },

  inlineCalendarTitle: {
    flex: 1,

    color: COLORS.SECONDARY_TEXT,

    fontSize: 10,

    fontWeight: '800',
  },

  inlineCalendarClose: {
    color: COLORS.TEXT,

    fontSize: 20,

    lineHeight: 22,

    fontWeight: '700',
  },

  /*
   * Footer
   */

  modalFooter: {
    flexDirection: 'row',

    justifyContent: 'flex-end',

    alignItems: 'center',

    gap: 8,

    padding: 14,

    backgroundColor: '#0D1B31',

    borderTopWidth: StyleSheet.hairlineWidth,

    borderTopColor: COLORS.BORDER,
  },

  modalFooterMobile: {
    flexDirection: 'column-reverse',

    alignItems: 'stretch',
  },

  mobileFooterButton: {
    width: '100%',
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
