import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',
  FIELD: '#0B1C32',

  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',

  BLUE: '#3478F6',
  ERROR: '#FFB4BA',

  OVERLAY: 'rgba(2, 8, 23, 0.86)',
};

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: COLORS.OVERLAY,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 16,
  },

  modalCard: {
    width: '94%',
    maxWidth: 780,

    maxHeight: '94%',

    backgroundColor: COLORS.CARD,

    borderRadius: 18,

    overflow: 'hidden',
  },

  header: {
    minHeight: 64,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },

  title: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 17,
    fontWeight: '900',
  },

  closeButton: {
    width: 40,
    height: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButtonText: {
    color: COLORS.TEXT,

    fontSize: 24,
    lineHeight: 25,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 16,
  },

  fieldGroup: {
    marginBottom: 14,
  },

  label: {
    color: COLORS.MUTED,

    fontSize: 12,
    fontWeight: '700',

    marginBottom: 7,
  },

  textInput: {
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    color: COLORS.TEXT,

    fontSize: 13,

    paddingHorizontal: 12,
  },

  dateFieldsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 14,

    marginBottom: 8,
  },

  dateFieldGroup: {
    flexGrow: 1,
    flexBasis: 260,

    minWidth: 220,
  },

  dateButton: {
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    paddingHorizontal: 12,

    flexDirection: 'row',
    alignItems: 'center',
  },

  dateButtonText: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 13,
    fontWeight: '700',
  },

  calendarIcon: {
    color: COLORS.TEXT,

    fontSize: 15,
  },

  calendarContainer: {
    backgroundColor: COLORS.FIELD,

    borderRadius: 12,

    overflow: 'hidden',

    marginTop: 10,
  },

  calendarHeader: {
    minHeight: 45,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 12,
  },

  calendarTitle: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '800',
  },

  calendarClose: {
    color: COLORS.TEXT,

    fontSize: 20,
  },

  errorText: {
    color: COLORS.ERROR,

    fontSize: 10,

    marginTop: 4,
  },

  actions: {
    flexDirection: 'row',

    justifyContent: 'flex-end',

    gap: 8,

    marginTop: 16,
  },

  cancelButton: {
    minHeight: 42,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '800',
  },

  saveButton: {
    minWidth: 78,
    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
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
