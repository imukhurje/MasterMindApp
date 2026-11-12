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

  ERROR: '#FFB4BA',
};

export const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    padding: 16,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 16,

    fontWeight: '900',

    marginBottom: 14,
  },

  currentRow: {
    flexDirection: 'row',

    alignItems: 'flex-end',

    flexWrap: 'wrap',

    gap: 12,
  },

  labelField: {
    width: 240,

    maxWidth: '100%',
  },

  dateFieldGroup: {
    width: 170,

    maxWidth: '100%',
  },

  label: {
    color: COLORS.MUTED,

    fontSize: 12,

    fontWeight: '600',

    marginBottom: 7,
  },

  textInput: {
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    color: COLORS.TEXT,

    fontSize: 14,

    fontWeight: '700',

    paddingHorizontal: 12,
  },

  dateInput: {
    minHeight: 46,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  dateText: {
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

    fontSize: 15,

    marginLeft: 8,
  },

  helperText: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

    marginTop: 10,
  },

  primaryButton: {
    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignItems: 'center',

    justifyContent: 'center',
  },

  primaryButtonText: {
    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '900',
  },

  secondaryButton: {
    minHeight: 42,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',

    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '800',
  },

  yearsList: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 8,

    marginTop: 14,
  },

  yearPill: {
    minHeight: 38,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: COLORS.PILL,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 19,

    paddingHorizontal: 11,

    gap: 6,
  },

  yearPillLabel: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '800',
  },

  yearPillMeta: {
    color: COLORS.MUTED,

    fontSize: 10,

    fontWeight: '600',
  },

  editIcon: {
    color: COLORS.TEXT,

    fontSize: 12,
  },

  disabledField: {
    opacity: 0.55,
  },

  disabledButton: {
    opacity: 0.45,
  },

  buttonPressed: {
    opacity: 0.72,
  },

  loadingBox: {
    minHeight: 100,

    alignItems: 'center',

    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 8,
  },

  errorText: {
    color: COLORS.ERROR,

    fontSize: 11,

    marginBottom: 12,
  },

  /*
   * Modal
   */

  modalOverlay: {
    flex: 1,

    backgroundColor: COLORS.OVERLAY,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 18,
  },

  modalCard: {
    width: '100%',

    maxWidth: 520,

    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 16,

    padding: 16,
  },

  modalHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 12,

    marginBottom: 14,
  },

  modalTitle: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 15,

    fontWeight: '900',
  },

  closeButton: {
    width: 40,

    height: 40,

    borderRadius: 10,

    backgroundColor: COLORS.BLUE,

    alignItems: 'center',

    justifyContent: 'center',
  },

  closeButtonText: {
    color: COLORS.TEXT,

    fontSize: 23,

    lineHeight: 24,

    fontWeight: '500',
  },

  modalTextInput: {
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    color: COLORS.TEXT,

    fontSize: 14,

    paddingHorizontal: 12,
  },

  modalDateInput: {
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    paddingHorizontal: 12,

    flexDirection: 'row',

    alignItems: 'center',
  },

  modalFieldSpacing: {
    marginTop: 12,
  },

  modalHelperText: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

    marginTop: 10,
  },

  modalActions: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'flex-end',

    flexWrap: 'wrap',

    gap: 8,

    marginTop: 16,
  },

  calendarModal: {
    width: '100%',

    maxWidth: 420,

    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    overflow: 'hidden',

    padding: 12,
  },

  inlineCalendar: {
    marginTop: 10,

    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 12,

    overflow: 'hidden',
  },
});
