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

  SUCCESS: '#32D583',

  SUCCESS_BG: '#123C38',

  WARNING: '#F5B942',

  WARNING_BG: '#3A3019',

  INFO_BG: '#0B1B31',

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

  /*
   * Header
   */

  headerRow: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    justifyContent: 'space-between',

    gap: 12,
  },

  headerRowMobile: {
    flexDirection: 'column',
  },

  headerText: {
    flex: 1,

    minWidth: 0,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 17,

    fontWeight: '900',
  },

  gatewayRow: {
    flexDirection: 'row',

    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 5,

    marginTop: 8,
  },

  gatewayLabel: {
    color: COLORS.MUTED,

    fontSize: 11,

    fontWeight: '600',
  },

  gatewayValue: {
    color: COLORS.SECONDARY_TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  configuredBadge: {
    minHeight: 23,

    backgroundColor: COLORS.SUCCESS_BG,

    borderRadius: 12,

    paddingHorizontal: 8,

    alignItems: 'center',

    justifyContent: 'center',

    marginLeft: 3,
  },

  configuredBadgeText: {
    color: COLORS.SUCCESS,

    fontSize: 8,

    fontWeight: '900',
  },

  notConfiguredBadge: {
    minHeight: 23,

    backgroundColor: COLORS.WARNING_BG,

    borderRadius: 12,

    paddingHorizontal: 8,

    alignItems: 'center',

    justifyContent: 'center',

    marginLeft: 3,
  },

  notConfiguredBadgeText: {
    color: COLORS.WARNING,

    fontSize: 8,

    fontWeight: '900',
  },

  /*
   * Form
   */

  form: {
    marginTop: 18,

    gap: 15,
  },

  fieldGroup: {
    width: '100%',
  },

  label: {
    color: COLORS.SECONDARY_TEXT,

    fontSize: 11,

    fontWeight: '800',

    marginBottom: 7,
  },

  textInput: {
    width: '100%',

    minHeight: 48,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 11,

    color: COLORS.TEXT,

    fontSize: 13,

    paddingHorizontal: 13,

    paddingVertical: 10,
  },

  fieldHelper: {
    color: COLORS.MUTED,

    fontSize: 9,

    lineHeight: 14,

    marginTop: 5,
  },

  /*
   * Information
   */

  infoBox: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    backgroundColor: COLORS.INFO_BG,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 12,

    padding: 12,

    marginTop: 16,
  },

  infoIcon: {
    width: 34,

    height: 34,

    borderRadius: 17,

    backgroundColor: '#173C66',

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 10,

    flexShrink: 0,
  },

  infoIconText: {
    color: '#8AB6FF',

    fontSize: 15,

    fontWeight: '900',
  },

  infoTextContainer: {
    flex: 1,

    minWidth: 0,
  },

  infoTitle: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  infoDescription: {
    color: COLORS.MUTED,

    fontSize: 10,

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

    fontSize: 11,

    fontWeight: '800',
  },

  resetButton: {
    minHeight: 44,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignItems: 'center',

    justifyContent: 'center',
  },

  resetButtonText: {
    color: COLORS.MUTED,

    fontSize: 10,

    fontWeight: '800',
  },

  mobileButton: {
    width: '100%',
  },

  /*
   * Error / Loading
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
