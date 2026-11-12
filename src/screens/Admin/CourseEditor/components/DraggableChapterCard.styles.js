import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD_DARK: '#0B1C32',
  TEXT: '#FFFFFF',
  MUTED: '#94A3B8',
  BORDER: '#3B7197',
  BLUE: '#3B82F6',
  GREEN: '#22C55E',
  RED: '#EF4444',
  ORANGE: '#F59E0B',
};

export const styles = StyleSheet.create({
  chapterCard: {
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    overflow: 'hidden',
  },

  /*
   * Visual state only while the
   * row is being dragged.
   */
  chapterCardActive: {
    borderColor: COLORS.BLUE,
    borderWidth: 2,
    opacity: 0.96,
    elevation: 8,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  chapterCardInactive: {
    borderColor: '#40516A',
  },

  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  dragHandle: {
    width: 48,
    minHeight: 68,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101D34',
    borderRightWidth: 1,
    borderRightColor: '#294466',
  },

  dragHandlePressed: {
    backgroundColor: '#173C65',
  },

  dragHandleActive: {
    backgroundColor: COLORS.BLUE,
  },

  dragHandleDisabled: {
    opacity: 0.55,
  },

  dragHandleText: {
    color: COLORS.MUTED,
    fontSize: 22,
    fontWeight: '800',
  },

  chapterHeaderMain: {
    flex: 1,
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 10,
  },

  chapterHeaderPressed: {
    backgroundColor: '#101D34',
  },

  chapterPosition: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  chapterPositionText: {
    color: COLORS.TEXT,
    fontSize: 13,
    fontWeight: '800',
  },

  chapterInfo: {
    flex: 1,
    minWidth: 0,
  },

  chapterTitle: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '800',
  },

  chapterMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 4,
  },

  chapterMaterialCount: {
    color: COLORS.MUTED,
    fontSize: 11,
  },

  inactiveBadge: {
    backgroundColor: '#252D3B',
    borderWidth: 1,
    borderColor: '#59677D',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },

  inactiveBadgeText: {
    color: '#B7C1D1',
    fontSize: 9,
    fontWeight: '800',
  },

  expandIcon: {
    color: COLORS.TEXT,
    fontSize: 20,
    marginLeft: 8,
  },

  /*
   * On a narrow/mobile screen four
   * actions can wrap naturally.
   */
  chapterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: '#101D34',
    borderTopWidth: 1,
    borderTopColor: '#294466',
  },

  /*
   * Active / Inactive button.
   */
  statusButton: {
    flex: 1,
    flexGrow: 1,
    minWidth: 105,
    minHeight: 38,
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 9,
  },

  statusButtonActive: {
    backgroundColor: '#102E29',
    borderColor: '#217A5B',
  },

  statusButtonInactive: {
    backgroundColor: '#232A38',
    borderColor: '#56647A',
  },

  statusIcon: {
    fontSize: 13,
    fontWeight: '900',
    marginRight: 6,
  },

  statusIconActive: {
    color: COLORS.GREEN,
  },

  statusIconInactive: {
    color: '#A7B2C3',
  },

  statusButtonText: {
    color: '#D8FFE9',
    fontSize: 12,
    fontWeight: '800',
  },

  statusButtonTextInactive: {
    color: '#C1CAD8',
  },

  actionButton: {
    flex: 1,
    flexGrow: 1,
    minWidth: 78,
    minHeight: 38,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  editButton: {
    backgroundColor: COLORS.BLUE,
  },

  openButton: {
    backgroundColor: COLORS.GREEN,
  },

  deleteButton: {
    backgroundColor: COLORS.RED,
  },

  actionButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  actionButtonPressed: {
    opacity: 0.75,
  },

  actionButtonDisabled: {
    opacity: 0.4,
  },

  editContainer: {
    backgroundColor: '#101D34',
    borderTopWidth: 1,
    borderTopColor: '#294466',
    padding: 11,
  },

  editLabel: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
  },

  titleInput: {
    minHeight: 47,
    color: COLORS.TEXT,
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },

  editError: {
    color: '#FCA5A5',
    fontSize: 11,
    marginTop: 7,
  },

  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 10,
  },

  cancelButton: {
    minWidth: 88,
    minHeight: 40,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  cancelButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  saveButton: {
    minWidth: 88,
    minHeight: 40,
    backgroundColor: COLORS.BLUE,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  saveButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  materialContainer: {
    borderTopWidth: 1,
    borderTopColor: '#294466',
    padding: 11,
  },

  chapterDescription: {
    color: COLORS.MUTED,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },

  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101D34',
    borderRadius: 11,
    padding: 10,
    marginBottom: 8,
  },

  materialIconContainer: {
    width: 39,
    height: 39,
    borderRadius: 10,
    backgroundColor: '#173C65',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  materialIcon: {
    fontSize: 19,
  },

  materialInfo: {
    flex: 1,
    minWidth: 0,
  },

  materialTitle: {
    color: COLORS.TEXT,
    fontSize: 13,
    fontWeight: '700',
  },

  materialMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 5,
  },

  materialType: {
    color: '#7DD3FC',
    fontSize: 10,
    fontWeight: '800',
  },

  materialSize: {
    color: COLORS.MUTED,
    fontSize: 10,
    marginLeft: 4,
  },

  previewBadge: {
    color: COLORS.GREEN,
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 8,
  },

  externalUrl: {
    color: '#7DD3FC',
    fontSize: 10,
    marginTop: 5,
  },

  noMaterialText: {
    color: COLORS.MUTED,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 12,
  },
});
