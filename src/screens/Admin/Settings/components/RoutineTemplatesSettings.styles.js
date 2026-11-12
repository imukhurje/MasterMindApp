import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',
  FIELD: '#0B1C32',

  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',

  BLUE: '#3478F6',
  RED: '#E64750',
  GREEN: '#42D3AA',

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

  newRoutineButton: {
    minHeight: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',
    justifyContent: 'center',
  },

  newRoutineButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  routinesContainer: {
    gap: 14,
  },

  routineCard: {
    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    padding: 16,

    borderWidth: 0,
  },

  routineHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 10,
  },

  routineHeaderText: {
    flex: 1,
    minWidth: 0,
  },

  routineName: {
    color: COLORS.TEXT,

    fontSize: 16,
    fontWeight: '900',
  },

  routineDescription: {
    color: COLORS.MUTED,

    fontSize: 11,
    lineHeight: 17,

    marginTop: 4,
  },

  activeBadge: {
    minHeight: 28,

    backgroundColor: 'rgba(66, 211, 170, 0.12)',

    borderRadius: 14,

    paddingHorizontal: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  activeBadgeText: {
    color: COLORS.GREEN,

    fontSize: 10,
    fontWeight: '800',
  },

  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 7,

    marginTop: 12,
  },

  dayPill: {
    minHeight: 32,

    maxWidth: 230,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,
    borderColor: COLORS.CONTROL_BORDER,

    borderRadius: 16,

    paddingHorizontal: 9,

    alignItems: 'center',
    justifyContent: 'center',
  },

  dayPillText: {
    color: COLORS.TEXT,

    fontSize: 10,
    fontWeight: '600',
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',

    gap: 8,

    marginTop: 12,
  },

  editButton: {
    minHeight: 39,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,
    borderColor: COLORS.CONTROL_BORDER,

    borderRadius: 10,

    paddingHorizontal: 14,

    alignItems: 'center',
    justifyContent: 'center',
  },

  editButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '800',
  },

  deleteButton: {
    minHeight: 39,

    backgroundColor: COLORS.RED,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
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
