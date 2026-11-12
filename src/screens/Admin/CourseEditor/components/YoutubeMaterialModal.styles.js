import { StyleSheet } from 'react-native';

export const COLORS = {
  OVERLAY: 'rgba(2, 8, 23, 0.82)',
  CARD: '#0D1D36',
  FIELD: '#0E203A',
  TEXT: '#FFFFFF',
  MUTED: '#A7B5CC',
  PLACEHOLDER: '#75849E',
  BORDER: '#3B7197',
  BLUE: '#3177ED',
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
    maxWidth: 620,
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 16,
    overflow: 'hidden',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 18,

    elevation: 12,
  },

  modalHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#203B5E',
  },

  modalTitle: {
    color: COLORS.TEXT,
    fontSize: 17,
    fontWeight: '800',
  },

  modalSubtitle: {
    color: COLORS.MUTED,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
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
    minWidth: 65,
    minHeight: 41,
    backgroundColor: COLORS.BLUE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,

    shadowColor: COLORS.BLUE,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.28,
    shadowRadius: 8,

    elevation: 5,
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
