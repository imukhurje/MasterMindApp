import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',
  PANEL: '#0A182B',
  FIELD: '#0B1C32',
  FIELD_SELECTED: '#182F4D',

  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',

  BLUE: '#3478F6',

  PILL: '#10243D',
  PILL_BUTTON: '#162F50',

  DIVIDER: '#233A53',
};

export const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    padding: 16,

    borderWidth: 0,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 16,
    fontWeight: '900',

    marginBottom: 6,
  },

  description: {
    color: COLORS.MUTED,

    fontSize: 12,
    lineHeight: 18,
  },

  defaultText: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 7,
    marginBottom: 12,
  },

  defaultValue: {
    color: COLORS.TEXT,
    fontWeight: '800',
  },

  columnsContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    flexWrap: 'wrap',

    gap: 12,

    marginTop: 12,
  },

  frequencyColumn: {
    flexGrow: 1,
    flexBasis: 330,

    minWidth: 280,
    minHeight: 240,

    backgroundColor: COLORS.PANEL,

    borderRadius: 13,

    padding: 14,
  },

  frequencyTitle: {
    color: COLORS.TEXT,

    fontSize: 14,
    fontWeight: '800',

    marginBottom: 12,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 8,

    zIndex: 30,
  },

  searchInputWrapper: {
    flex: 1,

    position: 'relative',

    zIndex: 40,
  },

  searchInput: {
    width: '100%',
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    color: COLORS.TEXT,

    fontSize: 13,

    paddingLeft: 12,
    paddingRight: 40,
  },

  searchIndicator: {
    position: 'absolute',

    right: 12,
    top: 13,
  },

  searchResults: {
    position: 'absolute',

    left: 0,
    right: 0,
    top: 50,

    backgroundColor: '#142942',

    borderRadius: 10,

    overflow: 'hidden',

    zIndex: 100,
    elevation: 30,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  searchResultItem: {
    minHeight: 42,

    justifyContent: 'center',

    paddingHorizontal: 12,

    borderBottomWidth: StyleSheet.hairlineWidth,

    borderBottomColor: COLORS.DIVIDER,
  },

  searchResultSelected: {
    backgroundColor: COLORS.FIELD_SELECTED,
  },

  searchResultText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '600',
  },

  addButton: {
    width: 60,
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 10,
  },

  addButtonText: {
    color: COLORS.TEXT,

    fontSize: 13,
    fontWeight: '900',
  },

  classPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 7,

    marginTop: 14,

    zIndex: 1,
  },

  classPill: {
    minHeight: 38,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: COLORS.PILL,

    borderRadius: 19,

    paddingLeft: 10,
    paddingRight: 5,

    maxWidth: '100%',
  },

  classPillText: {
    color: COLORS.TEXT,

    fontSize: 11,
    fontWeight: '700',

    flexShrink: 1,
  },

  removeButton: {
    width: 28,
    height: 28,

    marginLeft: 5,

    borderRadius: 14,

    backgroundColor: COLORS.PILL_BUTTON,

    alignItems: 'center',
    justifyContent: 'center',
  },

  removeButtonText: {
    color: COLORS.MUTED,

    fontSize: 19,
    lineHeight: 20,
  },

  saveButton: {
    minHeight: 42,

    alignSelf: 'flex-start',

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 14,
  },

  saveButtonText: {
    color: COLORS.TEXT,

    fontSize: 13,
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
  },

  buttonPressed: {
    opacity: 0.72,
  },

  buttonDisabled: {
    opacity: 0.42,
  },
});
