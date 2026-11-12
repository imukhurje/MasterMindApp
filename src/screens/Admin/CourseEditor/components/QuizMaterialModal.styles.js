import { StyleSheet } from 'react-native';

export const COLORS = {
  OVERLAY: 'rgba(2, 8, 23, 0.84)',
  CARD: '#10203B',
  HEADER: '#09172D',
  FIELD: '#0E203A',
  TEXT: '#FFFFFF',
  MUTED: '#A8B8D0',
  PLACEHOLDER: '#77869F',
  BORDER: '#356A94',
  BLUE: '#347AF2',
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
    padding: 12,
  },

  modalCard: {
    width: '100%',
    maxWidth: 900,
    maxHeight: '94%',
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
    backgroundColor: COLORS.HEADER,
    paddingHorizontal: 15,
    paddingVertical: 14,
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
    padding: 14,
  },

  quizInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  quizNameContainer: {
    flex: 1,
    minWidth: 0,
  },

  durationContainer: {
    width: 210,
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
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },

  questionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 11,
  },

  questionsHeaderText: {
    flex: 1,
    paddingRight: 10,
  },

  questionsTitle: {
    color: COLORS.TEXT,
    fontSize: 15,
    fontWeight: '800',
  },

  questionsSubtitle: {
    color: COLORS.MUTED,
    fontSize: 10,
    marginTop: 3,
  },

  addQuestionButton: {
    minHeight: 40,
    backgroundColor: COLORS.BLUE,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  addQuestionButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  emptyQuestionsContainer: {
    minHeight: 150,
    backgroundColor: COLORS.HEADER,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.BORDER,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  emptyQuestionsIcon: {
    fontSize: 31,
  },

  emptyQuestionsTitle: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
  },

  emptyQuestionsDescription: {
    color: COLORS.MUTED,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 5,
  },

  errorContainer: {
    backgroundColor: COLORS.ERROR_BG,
    borderWidth: 1,
    borderColor: COLORS.ERROR_BORDER,
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginTop: 4,
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
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: '#203B5E',
    backgroundColor: COLORS.HEADER,
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
    minWidth: 112,
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

  quizInfoRowCompact: {
    flexDirection: 'column',
  },

  durationContainerCompact: {
    width: '100%',
  },

  loadingContainer: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  loadingText: {
    color: COLORS.MUTED,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
  },

  quizInfoRowCompact: {
    flexDirection: 'column',
  },

  durationContainerCompact: {
    width: '100%',
  },
});
