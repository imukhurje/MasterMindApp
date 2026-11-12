import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',

  FIELD: '#07182D',

  TEXT: '#FFFFFF',

  MUTED: '#AAB7CB',

  BLUE: '#3478F6',

  BORDER: '#29435F',

  FIELD_BORDER: '#3B7197',

  PILL: '#0B1B32',

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

    marginBottom: 7,
  },

  description: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

    marginBottom: 14,
  },

  /*
   * Two main columns.
   */
  columnsContainer: {
    flexDirection: 'row',

    alignItems: 'stretch',

    flexWrap: 'wrap',

    gap: 14,
  },

  allocationColumn: {
    flex: 1,

    minWidth: 290,

    minHeight: 300,

    backgroundColor: '#08172B',

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 12,

    padding: 12,
  },

  allocationTitle: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '800',

    marginBottom: 10,
  },

  /*
   * Search
   */
  searchRow: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: 8,

    marginBottom: 11,

    zIndex: 30,
  },

  searchInputWrapper: {
    flex: 1,

    minWidth: 0,

    position: 'relative',

    zIndex: 40,
  },

  searchInput: {
    width: '100%',

    minHeight: 44,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 9,

    color: COLORS.TEXT,

    fontSize: 11,

    paddingHorizontal: 12,
  },

  searchResults: {
    position: 'absolute',

    top: 48,

    left: 0,

    right: 0,

    maxHeight: 230,

    backgroundColor: '#0D2039',

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 9,

    overflow: 'hidden',

    zIndex: 999,

    elevation: 12,
  },

  searchResultItem: {
    minHeight: 40,

    justifyContent: 'center',

    paddingHorizontal: 11,

    borderBottomWidth: StyleSheet.hairlineWidth,

    borderBottomColor: COLORS.BORDER,
  },

  searchResultSelected: {
    backgroundColor: '#163A5A',
  },

  searchResultText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '700',
  },

  addButton: {
    width: 42,

    height: 42,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 9,

    alignItems: 'center',

    justifyContent: 'center',

    flexShrink: 0,
  },

  addButtonText: {
    color: COLORS.TEXT,

    fontSize: 18,

    lineHeight: 20,

    fontWeight: '900',
  },

  /*
   * Class pills
   */
  classPills: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    alignItems: 'flex-start',

    gap: 7,

    zIndex: 1,
  },

  classPill: {
    minHeight: 38,

    maxWidth: '100%',

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: COLORS.PILL,

    borderWidth: 1,

    borderColor: '#296398',

    borderRadius: 19,

    paddingLeft: 10,

    paddingRight: 5,
  },

  classPillText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '700',

    maxWidth: 160,
  },

  removeButton: {
    width: 27,

    height: 27,

    borderRadius: 14,

    backgroundColor: '#142B4A',

    marginLeft: 5,

    alignItems: 'center',

    justifyContent: 'center',
  },

  removeButtonText: {
    color: COLORS.MUTED,

    fontSize: 16,

    lineHeight: 18,

    fontWeight: '900',
  },

  /*
   * Save
   */
  saveButton: {
    alignSelf: 'flex-start',

    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 9,

    paddingHorizontal: 15,

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 14,
  },

  saveButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  unassignedText: {
    color: '#FACC15',

    fontSize: 9,

    marginTop: 9,
  },

  /*
   * State
   */
  stateContainer: {
    minHeight: 160,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 16,
  },

  stateText: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 8,
  },

  errorTitle: {
    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '900',
  },

  errorDescription: {
    color: COLORS.ERROR,

    fontSize: 10,

    lineHeight: 16,

    textAlign: 'center',

    marginTop: 6,
  },

  buttonPressed: {
    opacity: 0.72,
  },

  buttonDisabled: {
    opacity: 0.42,
  },
});
