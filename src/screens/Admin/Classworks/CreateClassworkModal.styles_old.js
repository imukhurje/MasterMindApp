import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',

  FIELD: '#0B1C32',

  DROPDOWN: '#162B46',

  TEXT: '#FFFFFF',

  MUTED: '#AAB7CB',

  BLUE: '#3478F6',

  RED: '#E64750',

  GREEN: '#4FD1B5',

  OVERLAY: 'rgba(2, 8, 23, 0.88)',
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

    maxWidth: 760,

    backgroundColor: COLORS.CARD,

    borderRadius: 18,

    overflow: 'visible',
  },

  header: {
    minHeight: 64,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 16,

    paddingTop: 12,

    paddingBottom: 8,

    zIndex: 100,
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

    backgroundColor: COLORS.RED,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',
  },

  closeButtonText: {
    color: COLORS.TEXT,

    fontSize: 23,

    lineHeight: 24,
  },

  content: {
    paddingHorizontal: 16,

    paddingTop: 6,

    paddingBottom: 16,

    overflow: 'visible',
  },

  fieldGroup: {
    marginBottom: 16,
  },

  classFieldGroup: {
    zIndex: 500,
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

  noteInput: {
    minHeight: 115,
  },

  selectWrapper: {
    width: '100%',

    position: 'relative',

    zIndex: 1,
  },

  selectWrapperOpen: {
    zIndex: 10000,

    elevation: 100,
  },

  selectButton: {
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    paddingHorizontal: 12,

    flexDirection: 'row',

    alignItems: 'center',
  },

  selectValue: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '600',
  },

  selectArrow: {
    color: COLORS.TEXT,

    fontSize: 18,

    marginLeft: 8,
  },

  selectMenu: {
    position: 'absolute',

    top: 50,

    left: 0,

    right: 0,

    maxHeight: 230,

    backgroundColor: COLORS.DROPDOWN,

    borderRadius: 10,

    overflow: 'hidden',

    zIndex: 20000,

    elevation: 100,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.35,

    shadowRadius: 8,
  },

  selectMenuScroll: {
    maxHeight: 230,
  },

  selectOption: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 12,
  },

  selectOptionSelected: {
    backgroundColor: '#203E62',
  },

  selectOptionText: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '600',
  },

  checkMark: {
    color: COLORS.GREEN,

    fontSize: 14,

    fontWeight: '900',
  },

  noClassesText: {
    color: '#FFB4BA',

    fontSize: 10,

    marginTop: 6,
  },

  actions: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'flex-end',

    gap: 8,

    marginTop: 2,
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

  createButton: {
    minWidth: 84,

    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignItems: 'center',

    justifyContent: 'center',
  },

  createButtonText: {
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
