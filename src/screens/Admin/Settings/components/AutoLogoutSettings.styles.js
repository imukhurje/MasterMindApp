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
   * Mode options
   */

  optionsContainer: {
    marginTop: 16,

    gap: 10,
  },

  modeOption: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 13,

    padding: 13,
  },

  modeOptionSelected: {
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

  optionText: {
    flex: 1,

    minWidth: 0,
  },

  optionTitle: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',

    lineHeight: 18,
  },

  optionDescription: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 16,

    marginTop: 4,
  },

  /*
   * Minutes
   */

  minutesCard: {
    marginTop: 14,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 13,

    padding: 13,
  },

  minutesHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    flexWrap: 'wrap',

    gap: 12,
  },

  minutesHeaderText: {
    flex: 1,

    minWidth: 180,
  },

  fieldLabel: {
    color: COLORS.SECONDARY_TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  fieldHelper: {
    color: COLORS.MUTED,

    fontSize: 9,

    lineHeight: 14,

    marginTop: 4,
  },

  minutesInputRow: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,
  },

  minutesInput: {
    width: 120,

    minHeight: 44,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '800',

    paddingHorizontal: 12,

    textAlign: 'center',
  },

  minutesSuffix: {
    color: COLORS.MUTED,

    fontSize: 10,

    fontWeight: '800',
  },

  /*
   * Current setting
   */

  currentSettingBox: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#0B1B31',

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 12,

    padding: 12,

    marginTop: 14,
  },

  currentSettingIcon: {
    width: 36,

    height: 36,

    borderRadius: 18,

    backgroundColor: COLORS.SUCCESS_BG,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 10,

    flexShrink: 0,
  },

  currentSettingIconText: {
    color: COLORS.SUCCESS,

    fontSize: 16,

    fontWeight: '900',
  },

  currentSettingText: {
    flex: 1,

    minWidth: 0,
  },

  currentSettingLabel: {
    color: COLORS.MUTED,

    fontSize: 9,

    fontWeight: '700',
  },

  currentSettingValue: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',

    marginTop: 2,
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
    marginTop: 14,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 12,

    padding: 14,

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
