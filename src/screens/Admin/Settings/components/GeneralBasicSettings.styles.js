import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',
  FIELD: '#0B1C32',
  FIELD_SELECTED: '#172C47',

  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',

  BLUE: '#3478F6',

  DROPDOWN: '#142942',

  CHECKBOX: '#172840',
  CHECKED: '#69B5DA',
};

export const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    padding: 16,

    borderWidth: 0,

    /*
     * Needed so the attendance dropdown
     * can appear above sections below it.
     */
    zIndex: 50,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 16,
    fontWeight: '900',

    marginBottom: 18,
  },

  fieldsRow: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    flexWrap: 'wrap',

    gap: 16,

    zIndex: 60,
  },

  settingField: {
    flexGrow: 1,

    flexBasis: 270,

    minWidth: 250,
  },

  frequencyField: {
    zIndex: 100,
  },

  label: {
    color: COLORS.MUTED,

    fontSize: 12,
    fontWeight: '600',

    marginBottom: 8,
  },

  inputSaveRow: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,
  },

  textInput: {
    flex: 1,

    minWidth: 0,

    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    paddingHorizontal: 12,

    color: COLORS.TEXT,

    fontSize: 13,
  },

  saveIconButton: {
    width: 50,
    height: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  saveIconText: {
    fontSize: 17,
  },

  dropdownWrapper: {
    flex: 1,

    position: 'relative',

    zIndex: 150,
  },

  dropdownButton: {
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 12,
  },

  dropdownValue: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 13,
    fontWeight: '600',
  },

  dropdownArrow: {
    color: COLORS.TEXT,

    fontSize: 19,

    marginLeft: 8,
  },

  dropdownMenu: {
    position: 'absolute',

    top: 50,

    left: 0,
    right: 0,

    backgroundColor: COLORS.DROPDOWN,

    borderRadius: 10,

    overflow: 'hidden',

    zIndex: 500,

    elevation: 30,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.3,

    shadowRadius: 8,
  },

  dropdownOption: {
    minHeight: 46,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 12,
  },

  dropdownOptionSelected: {
    backgroundColor: COLORS.FIELD_SELECTED,
  },

  dropdownOptionText: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '600',
  },

  checkMark: {
    color: '#4FD1B5',

    fontSize: 14,

    fontWeight: '900',
  },

  forumSection: {
    marginTop: 24,
  },

  forumActions: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 14,
  },

  checkbox: {
    width: 24,
    height: 24,

    backgroundColor: COLORS.CHECKBOX,

    borderRadius: 5,

    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: COLORS.CHECKED,
  },

  checkboxTick: {
    color: '#FFFFFF',

    fontSize: 15,

    fontWeight: '900',
  },

  stateContainer: {
    minHeight: 180,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 20,
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
    marginBottom: 12,
  },

  saveButton: {
    minHeight: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 15,

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
    opacity: 0.4,
  },
});
