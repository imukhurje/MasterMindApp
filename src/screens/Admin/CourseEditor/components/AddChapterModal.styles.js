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
    maxWidth: 700,
    maxHeight: '92%',
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
    paddingHorizontal: 16,
    paddingVertical: 15,
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
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  closeButton: {
    width: 42,
    height: 42,
    backgroundColor: COLORS.RED,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: COLORS.RED,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,

    elevation: 5,
  },

  closeButtonText: {
    color: COLORS.TEXT,
    fontSize: 27,
    fontWeight: '400',
    lineHeight: 29,
  },

  formScrollView: {
    flexGrow: 0,
  },

  formContent: {
    padding: 16,
  },

  fieldGroup: {
    marginBottom: 14,
  },

  fieldLabel: {
    color: COLORS.TEXT,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7,
  },

  titleInput: {
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

  descriptionInput: {
    minHeight: 110,
    maxHeight: 220,
    backgroundColor: COLORS.FIELD,
    color: COLORS.TEXT,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingTop: 13,
    paddingBottom: 13,
    fontSize: 14,
    lineHeight: 20,
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
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: '#203B5E',
  },

  cancelButton: {
    minWidth: 84,
    minHeight: 41,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  cancelButtonText: {
    color: COLORS.TEXT,
    fontSize: 13,
    fontWeight: '800',
  },

  submitButton: {
    minWidth: 70,
    minHeight: 41,
    backgroundColor: COLORS.BLUE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },

  submitButtonText: {
    color: COLORS.TEXT,
    fontSize: 13,
    fontWeight: '800',
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonDisabled: {
    opacity: 0.4,
  },
});
