import { StyleSheet } from 'react-native';

export const COLORS = {
  BACKGROUND: '#071426',
  CARD: '#111E34',
  FIELD: '#0B1C32',

  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',

  BLUE: '#3478F6',

  BORDER: '#29435F',
  FIELD_BORDER: '#3B7197',

  PILL: '#10243D',

  OVERLAY: 'rgba(2, 8, 23, 0.82)',
};

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    gap: 16,
    paddingBottom: 40,
  },

  section: {
    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    padding: 16,

    /*
     * Neutral subtle separation.
     * No bluish outer border.
     */
    borderWidth: 0,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 16,
    fontWeight: '900',

    marginBottom: 12,
  },

  description: {
    color: COLORS.MUTED,

    fontSize: 12,
    lineHeight: 18,

    marginBottom: 8,
  },

  academicContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',

    gap: 14,
  },

  fieldGroup: {
    width: 190,
    maxWidth: '100%',
  },

  label: {
    color: COLORS.MUTED,

    fontSize: 12,
    fontWeight: '600',

    marginBottom: 8,
  },

  dateField: {
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,
    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  dateFieldText: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 14,
    fontWeight: '700',
  },

  placeholderText: {
    color: COLORS.MUTED,
    fontWeight: '500',
  },

  calendarIcon: {
    color: COLORS.TEXT,

    fontSize: 16,

    marginLeft: 8,
  },

  saveAcademicButton: {
    minWidth: 70,
    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 14,
  },

  helperText: {
    color: COLORS.MUTED,

    fontSize: 11,
    lineHeight: 17,

    marginTop: 10,
  },

  weekendInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',

    gap: 8,
  },

  weekendInput: {
    width: 260,
    maxWidth: '100%',

    minHeight: 44,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,
    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    color: COLORS.TEXT,

    paddingHorizontal: 12,

    fontSize: 13,
  },

  addButton: {
    minWidth: 62,
    minHeight: 44,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,
    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 14,
  },

  addButtonText: {
    color: COLORS.TEXT,

    fontSize: 13,
    fontWeight: '800',
  },

  selectedLabel: {
    color: COLORS.MUTED,

    fontSize: 12,
    fontWeight: '600',

    marginTop: 12,
    marginBottom: 8,
  },

  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 7,
  },

  dayPill: {
    minHeight: 38,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: COLORS.PILL,

    borderWidth: 1,
    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 19,

    paddingLeft: 10,
    paddingRight: 5,
  },

  dayPillText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '700',
  },

  removeDayButton: {
    width: 28,
    height: 28,

    borderRadius: 14,

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 5,

    backgroundColor: '#162F50',
  },

  removeDayText: {
    color: COLORS.MUTED,

    fontSize: 20,
    lineHeight: 21,
  },

  weekendBottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',

    gap: 10,

    marginTop: 10,
  },

  primaryButton: {
    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 16,
  },

  primaryButtonText: {
    color: COLORS.TEXT,

    fontSize: 13,
    fontWeight: '900',
  },

  resetButton: {
    minHeight: 42,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,
    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 15,
  },

  resetButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '800',
  },

  modalOverlay: {
    flex: 1,

    backgroundColor: COLORS.OVERLAY,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 18,
  },

  calendarModal: {
    width: '100%',
    maxWidth: 420,

    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    overflow: 'hidden',
  },

  calendarModalHeader: {
    minHeight: 55,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 14,
  },

  calendarModalTitle: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 15,
    fontWeight: '900',
  },

  closeButton: {
    width: 36,
    height: 36,

    borderRadius: 9,

    backgroundColor: '#E64750',

    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButtonText: {
    color: COLORS.TEXT,

    fontSize: 22,
    lineHeight: 23,
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

    fontSize: 16,
    fontWeight: '900',

    textAlign: 'center',
  },

  errorDescription: {
    color: COLORS.MUTED,

    fontSize: 12,
    lineHeight: 18,

    textAlign: 'center',

    marginTop: 7,
    marginBottom: 14,
  },

  buttonPressed: {
    opacity: 0.72,
  },

  buttonDisabled: {
    opacity: 0.45,
  },
});
