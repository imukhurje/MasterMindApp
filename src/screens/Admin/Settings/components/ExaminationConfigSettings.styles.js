import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',

  INNER: '#08172B',

  FIELD: '#0B1C32',

  TEXT: '#FFFFFF',

  MUTED: '#AAB7CB',

  BLUE: '#3478F6',

  BORDER: '#29435F',

  FIELD_BORDER: '#3B7197',

  SUCCESS: '#46C98D',

  SUCCESS_BG: '#11352F',

  WARNING: '#F5B942',

  WARNING_BG: '#3A3019',

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
   * Workflow options
   */

  optionsContainer: {
    marginTop: 16,

    gap: 10,
  },

  radioOption: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 13,

    padding: 13,
  },

  radioOptionSelected: {
    borderColor: COLORS.BLUE,

    backgroundColor: '#0B1D36',
  },

  radioCircle: {
    width: 20,

    height: 20,

    borderRadius: 10,

    borderWidth: 1,

    borderColor: '#7D8DA5',

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 11,

    marginTop: 1,

    flexShrink: 0,
  },

  radioCircleSelected: {
    borderColor: '#75A9FF',
  },

  radioDot: {
    width: 10,

    height: 10,

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

    lineHeight: 18,
  },

  radioDescription: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 16,

    marginTop: 4,
  },

  /*
   * Selection summary
   */

  summaryBox: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    backgroundColor: '#0B1B31',

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 12,

    padding: 12,

    marginTop: 14,
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

    fontSize: 14,

    fontWeight: '900',
  },

  summaryTextContainer: {
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
   * Actions
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
   * Unavailable
   */

  unavailableBox: {
    marginTop: 14,

    backgroundColor: COLORS.WARNING_BG,

    borderWidth: 1,

    borderColor: '#655526',

    borderRadius: 12,

    padding: 14,
  },

  unavailableTitle: {
    color: COLORS.WARNING,

    fontSize: 11,

    fontWeight: '900',
  },

  unavailableText: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 16,

    marginTop: 4,
  },

  /*
   * Loading / error
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
