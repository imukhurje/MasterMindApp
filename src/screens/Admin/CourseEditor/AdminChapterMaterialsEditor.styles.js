import { StyleSheet } from 'react-native';

export const COLORS = {
  BG: '#0F172A',
  CARD: '#142B49',
  CARD_DARK: '#08152A',
  PANEL: '#0D1C34',
  TEXT: '#FFFFFF',
  MUTED: '#9FB0C9',
  BORDER: '#3B7197',
  BORDER_BRIGHT: '#8BDCF8',
  BLUE: '#3177ED',
};

export const styles = StyleSheet.create({
  safeArea: {
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
    paddingBottom: 10,
  },

  listHeader: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  pageHeader: {
    marginBottom: 14,
  },

  pageTitle: {
    color: COLORS.TEXT,
    fontSize: 23,
    fontWeight: '800',
  },

  pageSubtitle: {
    color: COLORS.MUTED,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },

  headerMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 10,
  },

  metaBadge: {
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  metaBadgeText: {
    color: COLORS.MUTED,
    fontSize: 11,
    fontWeight: '700',
  },

  editorSection: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionHeaderText: {
    flex: 1,
  },

  sectionTitle: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: '800',
  },

  sectionTitleSecondary: {
    color: COLORS.MUTED,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },

  materialCreatorLayout: {
    gap: 12,
  },

  materialCreatorLayoutWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  materialCreatorLayoutMobile: {
    flexDirection: 'column',
  },

  quickActionsColumn: {
    gap: 9,
  },

  quickActionsColumnWide: {
    width: 130,
  },

  quickActionsColumnMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  quickActionButton: {
    minHeight: 43,
    backgroundColor: COLORS.PANEL,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  quickActionButtonText: {
    color: COLORS.TEXT,
    fontSize: 13,
    fontWeight: '800',
  },

  uploadCardsContainer: {
    flex: 1,
    gap: 12,
  },

  uploadCardsContainerWide: {
    flexDirection: 'row',
  },

  uploadCardsContainerMobile: {
    flexDirection: 'column',
  },

  uploadPanel: {
    flex: 1,
    minWidth: 0,
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER_BRIGHT,
    borderRadius: 15,
    padding: 12,
  },

  uploadPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },

  uploadPanelTitle: {
    flex: 1,
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '800',
  },

  uploadPanelSubtitle: {
    color: COLORS.MUTED,
    fontSize: 11,
    textAlign: 'right',
  },

  dropArea: {
    minHeight: 170,
    backgroundColor: '#16314A',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.BORDER_BRIGHT,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  dropAreaPressed: {
    opacity: 0.8,
  },

  dropAreaIcon: {
    fontSize: 31,
  },

  dropAreaTitle: {
    color: COLORS.TEXT,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
  },

  dropAreaText: {
    color: COLORS.MUTED,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 5,
  },

  chooseFileButton: {
    backgroundColor: COLORS.BLUE,
    borderRadius: 10,
    paddingHorizontal: 17,
    paddingVertical: 11,
    marginTop: 14,
  },

  chooseFileButtonText: {
    color: COLORS.TEXT,
    fontSize: 13,
    fontWeight: '800',
  },

  itemsHeaderCard: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },

  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemsHeaderText: {
    flex: 1,
    paddingRight: 10,
  },

  itemsTitle: {
    color: COLORS.TEXT,
    fontSize: 17,
    fontWeight: '800',
  },

  itemsSubtitle: {
    color: COLORS.MUTED,
    fontSize: 11,
    marginTop: 3,
  },

  itemsCountBadge: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemsCountText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  reorderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  reorderStatusText: {
    color: COLORS.MUTED,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 7,
  },

  materialItemWrapper: {
    marginHorizontal: 14,
    marginBottom: 10,
  },

  emptyContainer: {
    minHeight: 170,
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginHorizontal: 14,
  },

  emptyIcon: {
    fontSize: 38,
  },

  emptyTitle: {
    color: COLORS.TEXT,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 10,
  },

  emptyDescription: {
    color: COLORS.MUTED,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 6,
  },

  footerSpace: {
    height: 30,
  },

  buttonPressed: {
    opacity: 0.75,
  },
  dropAreaDisabled: {
    opacity: 0.55,
  },
});
