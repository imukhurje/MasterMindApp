import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',
  ROW: '#0A182B',

  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',

  BLUE: '#3478F6',
  RED: '#E64750',
};

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },

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

    marginBottom: 12,
  },

  description: {
    flex: 1,
    minWidth: 220,

    color: COLORS.MUTED,

    fontSize: 12,
    lineHeight: 18,
  },

  addEventButton: {
    minHeight: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',
    justifyContent: 'center',
  },

  addEventButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  eventsCard: {
    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    padding: 16,
  },

  academicYearText: {
    color: COLORS.MUTED,

    fontSize: 12,

    marginBottom: 14,
  },

  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 8,

    paddingBottom: 9,
  },

  tableHeaderText: {
    color: COLORS.MUTED,

    fontSize: 11,
    fontWeight: '800',
  },

  nameColumn: {
    flex: 1.3,
  },

  dateColumn: {
    flex: 1,
  },

  actionColumn: {
    width: 100,
  },

  rows: {
    gap: 7,
  },

  eventRow: {
    minHeight: 58,

    backgroundColor: COLORS.ROW,

    borderRadius: 10,

    paddingHorizontal: 9,

    paddingVertical: 8,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },

  eventName: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '800',
  },

  dateRange: {
    color: COLORS.TEXT,

    fontSize: 12,
  },

  rowActions: {
    flexDirection: 'row',

    justifyContent: 'flex-end',

    gap: 7,
  },

  editButton: {
    width: 46,
    height: 38,

    backgroundColor: COLORS.BLUE,

    borderRadius: 9,

    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButton: {
    width: 46,
    height: 38,

    backgroundColor: COLORS.BLUE,

    borderRadius: 9,

    alignItems: 'center',
    justifyContent: 'center',
  },

  actionIcon: {
    fontSize: 15,
  },

  emptyContainer: {
    minHeight: 150,

    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    color: COLORS.TEXT,

    fontSize: 14,
    fontWeight: '900',
  },

  emptyDescription: {
    color: COLORS.MUTED,

    fontSize: 11,

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
  },

  errorDescription: {
    color: COLORS.MUTED,

    fontSize: 11,

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
});
