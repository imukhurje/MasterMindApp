import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#08172D',
  FIELD: '#0E203A',
  TEXT: '#FFFFFF',
  MUTED: '#A9B8CF',
  PLACEHOLDER: '#75849E',
  BORDER: '#356A94',
  BORDER_BRIGHT: '#79D4F5',
  BLUE: '#347AF2',
};

export const styles = StyleSheet.create({
  questionCard: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: '#204469',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },

  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  questionNumberBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  questionNumberText: {
    color: COLORS.TEXT,
    fontSize: 15,
    fontWeight: '800',
  },

  questionFieldContainer: {
    flex: 1,
    minWidth: 0,
  },

  fieldLabel: {
    color: COLORS.MUTED,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
  },

  questionInput: {
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: COLORS.FIELD,
    color: COLORS.TEXT,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    lineHeight: 19,
  },

  deleteQuestionButton: {
    minWidth: 79,
    minHeight: 40,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 22,
  },

  deleteQuestionButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  optionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
    marginBottom: 9,
  },

  optionsTitle: {
    color: COLORS.MUTED,
    fontSize: 12,
    fontWeight: '700',
  },

  addOptionButton: {
    minHeight: 38,
    backgroundColor: COLORS.BLUE,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
    marginLeft: 10,
  },

  addOptionButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  optionsContainer: {
    alignItems: 'flex-start',
  },

  optionRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    padding: 8,
    marginBottom: 7,
  },

  checkboxButton: {
    width: 27,
    height: 27,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  checkboxButtonSelected: {
    backgroundColor: COLORS.BLUE,
    borderColor: COLORS.BLUE,
  },

  checkboxTick: {
    color: COLORS.TEXT,
    fontSize: 15,
    fontWeight: '900',
  },

  optionInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 43,
    backgroundColor: COLORS.FIELD,
    color: COLORS.TEXT,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 8,
    fontSize: 13,
  },

  removeOptionButton: {
    minWidth: 81,
    minHeight: 40,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 11,
    marginLeft: 8,
  },

  removeOptionButtonText: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonDisabled: {
    opacity: 0.4,
  },
});
