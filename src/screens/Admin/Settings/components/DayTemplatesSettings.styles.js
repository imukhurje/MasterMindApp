import { StyleSheet } from 'react-native';

export const COLORS = {
  BACKGROUND: '#071426',

  CARD: '#111E34',
  CARD_DARK: '#0A182B',
  FIELD: '#0B1C32',

  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',

  BLUE: '#3478F6',
  RED: '#E64750',

  CONTROL_BORDER: '#356B96',

  ERROR_BG: '#2A1720',
  ERROR_TEXT: '#FFB4BA',
};

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  topRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    flexWrap: 'wrap',

    gap: 12,

    marginBottom: 14,
  },

  topText: {
    flex: 1,

    minWidth: 220,
  },

  description: {
    color: COLORS.MUTED,

    fontSize: 12,
    lineHeight: 18,
  },

  countText: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 3,
  },

  topActions: {
    flexDirection: 'row',

    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 8,
  },

  refreshButton: {
    minHeight: 40,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    paddingHorizontal: 14,

    alignItems: 'center',
    justifyContent: 'center',
  },

  refreshButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '800',
  },

  newTemplateButton: {
    minHeight: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',
    justifyContent: 'center',
  },

  newTemplateButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  templatesContainer: {
    gap: 14,
  },

  periodsRow: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    alignItems: 'center',

    gap: 7,

    marginTop: 12,
  },

  periodText: {
    flexShrink: 1,

    color: COLORS.TEXT,

    fontSize: 11,

    paddingLeft: 10,
    paddingRight: 8,
  },

  templateCard: {
    backgroundColor: COLORS.CARD,

    borderRadius: 18,

    padding: 18,

    borderWidth: 0,
  },

  templateCardCompact: {
    padding: 16,
  },

  templateHeader: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    justifyContent: 'space-between',

    gap: 10,
  },

  templateHeaderText: {
    flex: 1,

    minWidth: 0,
  },

  templateName: {
    color: COLORS.TEXT,

    fontSize: 17,

    fontWeight: '900',
  },

  templateDescription: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

    marginTop: 4,
  },

  periodCountBadge: {
    minHeight: 28,

    backgroundColor: COLORS.FIELD,

    borderRadius: 14,

    paddingHorizontal: 9,

    alignItems: 'center',

    justifyContent: 'center',
  },

  periodCountText: {
    color: COLORS.MUTED,

    fontSize: 9,

    fontWeight: '700',
  },

  periodsContainer: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    alignItems: 'center',

    gap: 8,

    marginTop: 16,
  },

  periodsContainerCompact: {
    flexDirection: 'column',

    alignItems: 'stretch',

    gap: 8,
  },

  periodPill: {
    minHeight: 44,

    minWidth: 250,

    maxWidth: 360,

    flexDirection: 'row',

    alignItems: 'stretch',

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.CONTROL_BORDER,

    borderRadius: 12,

    overflow: 'hidden',
  },

  periodPillCompact: {
    width: '100%',

    minWidth: 0,

    maxWidth: '100%',
  },

  periodInformation: {
    flex: 1,

    minWidth: 0,

    justifyContent: 'center',

    paddingHorizontal: 12,

    paddingVertical: 8,
  },

  periodLabel: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '800',
  },

  periodTime: {
    color: COLORS.MUTED,

    fontSize: 10,

    fontWeight: '600',

    marginTop: 3,
  },

  periodEditButton: {
    width: 54,

    minHeight: 44,

    backgroundColor: COLORS.BLUE,

    alignItems: 'center',

    justifyContent: 'center',
  },

  periodEditIcon: {
    fontSize: 15,
  },

  noPeriodsContainer: {
    minHeight: 60,

    marginTop: 14,

    backgroundColor: COLORS.FIELD,

    borderRadius: 12,

    alignItems: 'center',

    justifyContent: 'center',
  },

  noPeriodsText: {
    color: COLORS.MUTED,

    fontSize: 11,
  },

  templateActions: {
    flexDirection: 'row',

    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 8,

    marginTop: 16,
  },

  templateActionsCompact: {
    width: '100%',

    flexWrap: 'nowrap',
  },

  secondaryButton: {
    minHeight: 42,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.CONTROL_BORDER,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignItems: 'center',

    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '800',
  },

  deleteButton: {
    minHeight: 42,

    backgroundColor: COLORS.RED,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignItems: 'center',

    justifyContent: 'center',
  },

  deleteButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  actionButtonCompact: {
    flex: 1,

    minWidth: 0,

    paddingHorizontal: 8,
  },

  inlineError: {
    backgroundColor: COLORS.ERROR_BG,

    borderRadius: 10,

    padding: 10,

    marginBottom: 12,
  },

  inlineErrorText: {
    color: COLORS.ERROR_TEXT,

    fontSize: 11,
  },

  emptyContainer: {
    minHeight: 220,

    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 24,
  },

  emptyIcon: {
    fontSize: 32,
  },

  emptyTitle: {
    color: COLORS.TEXT,

    fontSize: 15,

    fontWeight: '900',

    marginTop: 8,
  },

  emptyDescription: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

    textAlign: 'center',

    marginTop: 5,
  },

  stateContainer: {
    minHeight: 260,

    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 24,
  },

  stateText: {
    color: COLORS.MUTED,

    fontSize: 12,

    marginTop: 10,
  },

  errorTitle: {
    color: COLORS.TEXT,

    fontSize: 15,

    fontWeight: '900',

    textAlign: 'center',
  },

  errorDescription: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

    textAlign: 'center',

    marginTop: 7,
    marginBottom: 14,
  },

  primaryButton: {
    minHeight: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.72,
  },

  buttonDisabled: {
    opacity: 0.42,
  },

  screenContainer: {
    flex: 1,
  },
});
