import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',
  FIELD: '#0B1C32',

  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',

  BLUE: '#3478F6',

  OVERLAY: 'rgba(2, 8, 23, 0.86)',
};

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: COLORS.OVERLAY,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 18,
  },

  modalCard: {
    width: '94%',
    maxWidth: 780,

    backgroundColor: COLORS.CARD,

    borderRadius: 18,

    overflow: 'hidden',
  },

  header: {
    minHeight: 64,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },

  headerText: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    color: COLORS.TEXT,

    fontSize: 17,
    fontWeight: '900',
  },

  subtitle: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 3,
  },

  closeButton: {
    width: 40,
    height: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 12,
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
    marginBottom: 13,
  },

  label: {
    color: COLORS.MUTED,

    fontSize: 12,
    fontWeight: '700',

    marginBottom: 7,
  },

  textInput: {
    width: '100%',
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    color: COLORS.TEXT,

    fontSize: 13,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  descriptionInput: {
    minHeight: 95,
  },

  actions: {
    flexDirection: 'row',

    justifyContent: 'flex-end',
    alignItems: 'center',

    gap: 8,

    marginTop: 5,
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
    minWidth: 74,
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
