import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',
  CELL: '#0D1B30',
  CELL_OUTSIDE: '#091629',

  FIELD: '#0A1A2E',

  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',
  MUTED_DARK: '#56637A',

  BLUE: '#3478F6',

  GREEN: '#22C879',
  GREEN_BG: 'rgba(34, 200, 121, 0.10)',

  HOLIDAY: '#EF4444',
  HOLIDAY_BG: 'rgba(239, 68, 68, 0.08)',

  RED: '#E64750',

  OVERLAY: 'rgba(2, 8, 23, 0.48)',
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

    gap: 10,

    marginBottom: 12,
  },

  description: {
    flex: 1,
    minWidth: 240,

    color: COLORS.MUTED,

    fontSize: 12,
    lineHeight: 18,
  },

  startBadge: {
    minHeight: 30,

    backgroundColor: COLORS.FIELD,

    borderRadius: 15,

    paddingHorizontal: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  startBadgeText: {
    color: COLORS.TEXT,

    fontSize: 10,
    fontWeight: '600',
  },

  calendarCard: {
    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    padding: 12,
  },

  calendarHeader: {
    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 5,
  },

  navButton: {
    width: 42,
    height: 38,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  navButtonText: {
    color: COLORS.TEXT,

    fontSize: 20,
    fontWeight: '900',
  },

  monthTitle: {
    flex: 1,

    color: COLORS.TEXT,

    textAlign: 'center',

    fontSize: 16,
    fontWeight: '900',
  },

  weekHeader: {
    flexDirection: 'row',

    marginBottom: 5,
  },

  weekHeaderCell: {
    width: `${100 / 7}%`,

    paddingVertical: 8,
    paddingHorizontal: 5,
  },

  weekHeaderText: {
    color: COLORS.MUTED,

    fontSize: 11,
    fontWeight: '800',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dayCell: {
    width: `${100 / 7}%`,

    minHeight: 88,

    backgroundColor: COLORS.CELL,

    borderRadius: 9,

    borderWidth: 3,
    borderColor: COLORS.CARD,

    padding: 7,

    alignItems: 'center',
  },

  dayCellOutside: {
    backgroundColor: COLORS.CELL_OUTSIDE,
  },

  dayCellPressed: {
    opacity: 0.7,
  },

  dayNumber: {
    color: COLORS.TEXT,

    fontSize: 13,
    fontWeight: '600',

    marginTop: 3,
  },

  dayNumberOutside: {
    color: COLORS.MUTED_DARK,
  },

  academicStartBadge: {
    maxWidth: '100%',

    minHeight: 30,

    backgroundColor: COLORS.GREEN_BG,

    borderWidth: 1,

    borderColor: COLORS.GREEN,

    borderRadius: 15,

    paddingHorizontal: 7,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 5,
  },

  academicStartText: {
    color: COLORS.GREEN,

    fontSize: 8,

    fontWeight: '700',

    textAlign: 'center',
  },

  holidaysContainer: {
    width: '100%',

    alignItems: 'center',

    marginTop: 5,

    gap: 3,
  },

  holidayBadge: {
    maxWidth: '100%',

    minHeight: 25,

    backgroundColor: COLORS.HOLIDAY_BG,

    borderWidth: 1,

    borderColor: COLORS.HOLIDAY,

    borderRadius: 13,

    paddingHorizontal: 7,

    alignItems: 'center',
    justifyContent: 'center',
  },

  holidayText: {
    color: COLORS.HOLIDAY,

    fontSize: 9,
    fontWeight: '600',
  },

  moreHolidaysText: {
    color: COLORS.MUTED,

    fontSize: 8,
  },

  datePanelOverlay: {
    flex: 1,

    backgroundColor: COLORS.OVERLAY,

    justifyContent: 'center',
    alignItems: 'flex-end',

    padding: 16,
  },

  datePanel: {
    width: '100%',
    maxWidth: 390,

    backgroundColor: '#10243D',

    borderRadius: 16,

    padding: 15,

    maxHeight: '90%',
  },

  datePanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 10,
  },

  datePanelTitle: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 15,
    fontWeight: '900',
  },

  panelCloseIcon: {
    width: 34,
    height: 34,

    borderRadius: 9,

    backgroundColor: COLORS.FIELD,

    alignItems: 'center',
    justifyContent: 'center',
  },

  panelCloseIconText: {
    color: COLORS.TEXT,

    fontSize: 20,
  },

  datePanelSummary: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 7,
  },

  academicToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 10,

    marginTop: 14,
  },

  checkbox: {
    width: 28,
    height: 28,

    backgroundColor: COLORS.FIELD,

    borderRadius: 6,

    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: COLORS.BLUE,
  },

  checkboxTick: {
    color: COLORS.TEXT,

    fontSize: 15,
    fontWeight: '900',
  },

  academicToggleText: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 11,
    lineHeight: 16,
  },

  panelDivider: {
    height: StyleSheet.hairlineWidth,

    backgroundColor: '#30445F',

    marginVertical: 15,
  },

  panelSectionTitle: {
    color: COLORS.TEXT,

    fontSize: 14,
    fontWeight: '900',
  },

  existingHolidays: {
    marginTop: 9,

    gap: 7,
  },

  holidayRow: {
    minHeight: 48,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 10,

    gap: 8,
  },

  holidayRowInfo: {
    flex: 1,
  },

  holidayRowName: {
    color: COLORS.TEXT,

    fontSize: 11,
    fontWeight: '800',
  },

  holidayRowMeta: {
    color: COLORS.MUTED,

    fontSize: 9,

    marginTop: 2,
  },

  deleteHolidayButton: {
    width: 34,
    height: 34,

    backgroundColor: COLORS.RED,

    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteHolidayText: {
    fontSize: 14,
  },

  noHolidayText: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 8,
  },

  addHolidayArea: {
    marginTop: 12,

    gap: 9,
  },

  holidayInput: {
    minHeight: 44,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    color: COLORS.TEXT,

    fontSize: 12,

    paddingHorizontal: 12,
  },

  repeatRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,

    alignSelf: 'flex-start',
  },

  smallCheckbox: {
    width: 22,
    height: 22,

    backgroundColor: COLORS.FIELD,

    borderRadius: 5,

    alignItems: 'center',
    justifyContent: 'center',
  },

  smallCheckboxTick: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  repeatText: {
    color: COLORS.MUTED,

    fontSize: 11,
  },

  addHolidayButton: {
    minHeight: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 14,

    alignSelf: 'flex-start',

    alignItems: 'center',
    justifyContent: 'center',
  },

  addHolidayButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  closePanelButton: {
    minHeight: 40,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignSelf: 'flex-end',

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 15,
  },

  closePanelButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  stateContainer: {
    minHeight: 280,

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

  retryButton: {
    minHeight: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',
    justifyContent: 'center',
  },

  retryButtonText: {
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
