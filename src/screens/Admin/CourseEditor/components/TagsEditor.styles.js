import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD_DARK: '#0B1C32',
  TEXT: '#FFFFFF',
  MUTED: '#94A3B8',
  BORDER: '#3B7197',
  BLUE: '#3B82F6',
  GREEN: '#22C55E',
};

export const styles = StyleSheet.create({
  fieldBlock: {
    marginBottom: 16,
  },

  label: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 7,
  },

  searchContainer: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
  },

  searchInput: {
    flex: 1,
    color: COLORS.TEXT,
    fontSize: 14,
    paddingVertical: 11,
    paddingRight: 10,
  },

  searchIcon: {
    color: COLORS.MUTED,
    fontSize: 22,
  },

  clearButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17233B',
  },

  clearButtonText: {
    color: COLORS.MUTED,
    fontSize: 20,
    lineHeight: 22,
  },

  suggestionContainer: {
    backgroundColor: '#101D34',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    marginTop: 7,
    overflow: 'hidden',
  },

  suggestionRow: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#294466',
  },

  suggestionRowPressed: {
    backgroundColor: '#173C65',
  },

  suggestionInfo: {
    flex: 1,
    paddingRight: 10,
  },

  suggestionName: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '700',
  },

  suggestionId: {
    color: COLORS.MUTED,
    fontSize: 11,
    marginTop: 3,
  },

  addButton: {
    backgroundColor: COLORS.BLUE,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 9,
  },

  addButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  createRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  createIcon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: COLORS.GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  createIconText: {
    color: COLORS.TEXT,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },

  createTitle: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '800',
  },

  createDescription: {
    color: COLORS.MUTED,
    fontSize: 11,
    marginTop: 3,
  },

  noResultContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },

  noResultText: {
    color: COLORS.MUTED,
    fontSize: 13,
    textAlign: 'center',
  },

  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    marginTop: 7,
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },

  chip: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 20,
    paddingLeft: 11,
    paddingRight: 5,
    paddingVertical: 5,
  },

  chipText: {
    color: COLORS.TEXT,
    fontSize: 12,
    maxWidth: 180,
  },

  chipRemoveButton: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#17233B',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
  },

  chipRemoveText: {
    color: COLORS.MUTED,
    fontSize: 19,
    lineHeight: 21,
  },

  emptySelectedText: {
    color: COLORS.MUTED,
    fontSize: 12,
    marginTop: 9,
  },
});
