import { StyleSheet } from 'react-native';

export const COLORS = {
  OVERLAY: 'rgba(2, 8, 23, 0.84)',
  CARD: '#10203B',
  HEADER: '#0A1830',
  FIELD: '#0E203A',
  TEXT: '#FFFFFF',
  MUTED: '#A8B8D0',
  PLACEHOLDER: '#77869F',
  BORDER: '#3B7197',
  BLUE: '#347AF2',
  RED: '#E84F56',
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
    padding: 14,
  },

  modalCard: {
    width: '100%',
    maxWidth: 760,
    maxHeight: '94%',
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 18,
    overflow: 'hidden',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.36,
    shadowRadius: 18,

    elevation: 12,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.HEADER,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#203B5E',
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },

  modalTitle: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: '800',
  },

  modalSubtitle: {
    color: COLORS.MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  closeButton: {
    width: 41,
    height: 41,
    backgroundColor: COLORS.RED,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButtonText: {
    color: COLORS.TEXT,
    fontSize: 26,
    lineHeight: 28,
  },

  methodContent: {
    padding: 14,
    gap: 12,
  },

  methodCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.HEADER,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    padding: 16,
  },

  methodCardSelected: {
    borderColor: '#73C7F4',
    backgroundColor: '#102747',
  },

  methodCardDisabled: {
    opacity: 0.52,
  },

  methodCardPressed: {
    opacity: 0.8,
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: COLORS.MUTED,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 13,
  },

  radioOuterSelected: {
    borderColor: '#78D2F7',
  },

  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: '#78D2F7',
    borderRadius: 5,
  },

  methodTextContainer: {
    flex: 1,
  },

  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },

  methodTitle: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '800',
  },

  methodDescription: {
    color: COLORS.MUTED,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  comingSoonBadge: {
    backgroundColor: '#273850',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  comingSoonBadgeText: {
    color: COLORS.MUTED,
    fontSize: 9,
    fontWeight: '800',
  },

  formScrollView: {
    flexGrow: 0,
  },

  formContent: {
    padding: 14,
  },

  topFieldsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  topFieldsRowCompact: {
    flexDirection: 'column',
  },

  titleFieldContainer: {
    flex: 1,
    minWidth: 0,
  },

  priceFieldContainer: {
    width: 220,
  },

  priceFieldContainerCompact: {
    width: '100%',
  },

  fieldGroup: {
    marginTop: 15,
  },

  fieldLabel: {
    color: COLORS.TEXT,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7,
  },

  input: {
    minHeight: 48,
    backgroundColor: COLORS.FIELD,
    color: COLORS.TEXT,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 10,
    fontSize: 14,
  },

  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  currencyButton: {
    minWidth: 145,
    flexGrow: 1,
    flexBasis: '30%',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.FIELD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },

  currencyButtonSelected: {
    backgroundColor: '#173C65',
    borderColor: '#78D2F7',
  },

  currencySymbol: {
    width: 28,
    color: COLORS.MUTED,
    fontSize: 17,
    fontWeight: '800',
  },

  currencyTextContainer: {
    flex: 1,
  },

  currencyCode: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  currencyName: {
    color: COLORS.MUTED,
    fontSize: 9,
    marginTop: 2,
  },

  currencyTextSelected: {
    color: COLORS.TEXT,
  },

  currencyNameSelected: {
    color: '#CDEBFA',
  },

  descriptionInput: {
    minHeight: 105,
    maxHeight: 220,
    backgroundColor: COLORS.FIELD,
    color: COLORS.TEXT,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },

  errorWrapper: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },

  errorContainer: {
    backgroundColor: COLORS.ERROR_BG,
    borderWidth: 1,
    borderColor: COLORS.ERROR_BORDER,
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },

  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    lineHeight: 17,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 9,
    backgroundColor: COLORS.HEADER,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#203B5E',
  },

  cancelButton: {
    minWidth: 82,
    minHeight: 41,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
  },

  cancelButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  backButton: {
    minWidth: 70,
    minHeight: 41,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
  },

  backButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  primaryButton: {
    minWidth: 70,
    minHeight: 41,
    backgroundColor: COLORS.BLUE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },

  primaryButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonDisabled: {
    opacity: 0.4,
  },
});
