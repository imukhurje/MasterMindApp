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

  SUCCESS: '#46C98D',

  SUCCESS_BG: '#11352F',

  ERROR: '#FFB4BA',
};

export const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 16,

    padding: 16,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 17,

    fontWeight: '900',
  },

  description: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 18,

    marginTop: 6,
  },

  /*
   * Due Days
   */

  dueSection: {
    flexDirection: 'row',

    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 9,

    marginTop: 18,
  },

  dueText: {
    color: COLORS.SECONDARY_TEXT,

    fontSize: 11,

    fontWeight: '600',
  },

  dueInput: {
    width: 88,

    minHeight: 44,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '800',

    textAlign: 'center',

    paddingHorizontal: 10,

    paddingVertical: 8,
  },

  /*
   * Radio Options
   */

  optionsContainer: {
    marginTop: 18,

    gap: 10,
  },

  radioOption: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 12,

    padding: 12,
  },

  radioOptionSelected: {
    borderColor: COLORS.BLUE,

    backgroundColor: '#0B1D36',
  },

  radioCircle: {
    width: 19,

    height: 19,

    borderRadius: 10,

    borderWidth: 1,

    borderColor: '#7D8DA5',

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 10,

    marginTop: 1,

    flexShrink: 0,
  },

  radioCircleSelected: {
    borderColor: '#75A9FF',
  },

  radioDot: {
    width: 9,

    height: 9,

    borderRadius: 5,

    backgroundColor: COLORS.BLUE,
  },

  radioTextContainer: {
    flex: 1,

    minWidth: 0,
  },

  radioTitle: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',

    lineHeight: 17,
  },

  radioDescription: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 16,

    marginTop: 4,
  },

  /*
   * Summary
   */

  summaryBox: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    backgroundColor: '#0B1B31',

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 12,

    padding: 12,

    marginTop: 16,
  },

  summaryIcon: {
    width: 34,

    height: 34,

    borderRadius: 17,

    backgroundColor: COLORS.SUCCESS_BG,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 10,

    flexShrink: 0,
  },

  summaryIconText: {
    color: COLORS.SUCCESS,

    fontSize: 15,

    fontWeight: '900',
  },

  summaryText: {
    flex: 1,

    minWidth: 0,
  },

  summaryTitle: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  summaryDescription: {
    color: COLORS.MUTED,

    fontSize: 9,

    lineHeight: 15,

    marginTop: 3,
  },

  /*
   * Buttons
   */

  actions: {
    flexDirection: 'row',

    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 8,

    marginTop: 16,
  },

  actionsMobile: {
    flexDirection: 'column',

    alignItems: 'stretch',
  },

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

    fontSize: 11,

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

    fontSize: 10,

    fontWeight: '800',
  },

  mobileButton: {
    width: '100%',
  },

  /*
   * Loading / Error
   */

  stateContainer: {
    minHeight: 150,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 16,
  },

  stateText: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 8,

    textAlign: 'center',
  },

  errorBox: {
    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 12,

    padding: 14,

    marginTop: 14,

    alignItems: 'flex-start',
  },

  errorTitle: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  errorDescription: {
    color: COLORS.ERROR,

    fontSize: 10,

    lineHeight: 16,

    marginTop: 5,

    marginBottom: 12,
  },

  buttonPressed: {
    opacity: 0.72,
  },

  buttonDisabled: {
    opacity: 0.4,
  },
});
