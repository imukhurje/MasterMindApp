import { StyleSheet } from 'react-native';

export const COLORS = {
  BG: '#0F172A',
  CARD: '#142B49',
  CARD_DARK: '#0B1C32',
  TEXT: '#FFFFFF',
  MUTED: '#94A3B8',
  BORDER: '#3B7197',
  BLUE: '#3B82F6',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  dragListContainer: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  list: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  listContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  listHeader: {
    width: '100%',
  },

  chaptersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 14,
    marginBottom: 10,
  },

  chaptersHeaderText: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },

  chaptersTitle: {
    color: COLORS.TEXT,
    fontSize: 17,
    fontWeight: '800',
  },

  chaptersCount: {
    color: COLORS.MUTED,
    fontSize: 11,
    marginTop: 2,
  },

  chapterHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 1,
    gap: 6,
  },

  addChapterButton: {
    minHeight: 36,
    backgroundColor: COLORS.BLUE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,

    shadowColor: COLORS.BLUE,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,

    elevation: 3,
  },

  addChapterButtonText: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  addChapterButtonPressed: {
    opacity: 0.75,
  },

  addChapterButtonDisabled: {
    opacity: 0.4,
  },

  dragHintBadge: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: 18,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },

  dragHintIcon: {
    color: COLORS.MUTED,
    fontSize: 14,
    fontWeight: '800',
    marginRight: 4,
  },

  dragHintText: {
    color: COLORS.MUTED,
    fontSize: 10,
    fontWeight: '700',
  },

  chapterWrapper: {
    marginHorizontal: 14,
    marginBottom: 10,
  },

  emptyContainer: {
    minHeight: 130,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 16,
    marginHorizontal: 14,
    padding: 20,
  },

  emptyIcon: {
    fontSize: 34,
  },

  emptyTitle: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
  },
});
