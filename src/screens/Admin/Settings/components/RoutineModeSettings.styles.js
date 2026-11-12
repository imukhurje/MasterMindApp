import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#0F1E34',
  INPUT: '#08182D',

  TEXT: '#FFFFFF',
  MUTED: '#B7C4D8',

  BORDER: '#3272A3',

  BLUE: '#3478F6',
  ERROR: '#FFB4BA',
};

export const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 14,

    padding: 16,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 15,

    fontWeight: '900',
  },

  description: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

    marginTop: 7,

    marginBottom: 17,
  },

  label: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginBottom: 8,
  },

  modeRow: {
    flexDirection: 'row',

    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 12,
  },

  modeOption: {
    minHeight: 42,

    backgroundColor: COLORS.INPUT,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 9,

    paddingHorizontal: 13,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,
  },

  modeOptionSelected: {
    backgroundColor: '#143554',

    borderColor: '#63D4FF',
  },

  checkbox: {
    width: 20,

    height: 20,

    backgroundColor: COLORS.INPUT,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 5,

    alignItems: 'center',

    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: COLORS.BLUE,

    borderColor: COLORS.BLUE,
  },

  checkboxTick: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  modeOptionText: {
    color: COLORS.MUTED,

    fontSize: 11,

    fontWeight: '700',
  },

  modeOptionTextSelected: {
    color: COLORS.TEXT,
  },

  saveButton: {
    minWidth: 68,

    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 9,

    paddingHorizontal: 14,

    alignItems: 'center',

    justifyContent: 'center',
  },

  saveButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  retryButton: {
    alignSelf: 'flex-start',

    minHeight: 38,

    backgroundColor: COLORS.BLUE,

    borderRadius: 8,

    paddingHorizontal: 14,

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 10,
  },

  retryButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  errorText: {
    color: COLORS.ERROR,

    fontSize: 10,

    marginTop: 7,
  },

  disabledButton: {
    opacity: 0.45,
  },

  buttonPressed: {
    opacity: 0.72,
  },
});
