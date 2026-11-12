import { StyleSheet } from 'react-native';

const COLORS = {
  CARD: '#142B49',
  CARD_DARK: '#0B1C32',
  FIELD: '#0E203A',
  TEXT: '#FFFFFF',
  MUTED: '#94A3B8',
  BORDER: '#3B7197',
  BLUE: '#3B82F6',
  RED: '#EF4444',
  GREEN: '#22C55E',
  ORANGE: '#F59E0B',
  OVERLAY: 'rgba(2, 8, 23, 0.86)',
};

export const styles = StyleSheet.create({
  section: {
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
    minWidth: 0,
    paddingRight: 10,
  },

  sectionTitle: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: COLORS.MUTED,
    fontSize: 12,
    marginTop: 3,
  },

  uploadButton: {
    minHeight: 40,
    minWidth: 115,
    backgroundColor: COLORS.BLUE,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  uploadButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  pendingSection: {
    backgroundColor: '#102747',
    borderWidth: 1,
    borderColor: COLORS.BLUE,
    borderRadius: 14,
    padding: 11,
    marginBottom: 14,
  },

  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  pendingHeaderText: {
    flex: 1,
    paddingRight: 8,
  },

  pendingTitle: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '800',
  },

  pendingCount: {
    color: COLORS.MUTED,
    fontSize: 10,
    marginTop: 2,
  },

  pendingHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  clearPendingButton: {
    minHeight: 36,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 11,
  },

  clearPendingButtonText: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  uploadSelectedButton: {
    minHeight: 36,
    minWidth: 115,
    backgroundColor: COLORS.GREEN,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  uploadSelectedButtonText: {
    color: '#052E16',
    fontSize: 11,
    fontWeight: '900',
  },

  pendingImageList: {
    gap: 10,
    paddingRight: 4,
  },

  pendingImageCard: {
    width: 210,
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 13,
    overflow: 'hidden',
  },

  pendingPreview: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.FIELD,
  },

  pendingImageInfo: {
    padding: 10,
  },

  pendingImageName: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  pendingImageSize: {
    color: COLORS.MUTED,
    fontSize: 10,
    marginTop: 3,
    marginBottom: 8,
  },

  removePendingButton: {
    minHeight: 34,
    borderWidth: 1,
    borderColor: COLORS.RED,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  removePendingButtonText: {
    color: '#FCA5A5',
    fontSize: 10,
    fontWeight: '800',
  },

  imageList: {
    gap: 12,
    paddingRight: 4,
  },

  imageCard: {
    width: 215,
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    overflow: 'hidden',
  },

  posterImage: {
    width: '100%',
    height: 125,
    backgroundColor: COLORS.FIELD,
  },

  placeholder: {
    height: 125,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.FIELD,
  },

  placeholderIcon: {
    fontSize: 36,
  },

  imageInfo: {
    padding: 10,
  },

  imageName: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '700',
  },

  imageType: {
    color: COLORS.MUTED,
    fontSize: 10,
    marginTop: 4,
    marginBottom: 8,
  },

  typeButton: {
    minHeight: 47,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.FIELD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  typeButtonText: {
    flex: 1,
    minWidth: 0,
    paddingRight: 7,
  },

  typeButtonLabel: {
    color: COLORS.MUTED,
    fontSize: 9,
    fontWeight: '700',
  },

  typeButtonValue: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },

  typeButtonChevron: {
    color: COLORS.TEXT,
    fontSize: 17,
  },

  emptyContainer: {
    minHeight: 130,
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  emptyIcon: {
    fontSize: 34,
  },

  emptyTitle: {
    color: COLORS.TEXT,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
  },

  emptyDescription: {
    color: COLORS.MUTED,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.OVERLAY,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },

  typeModalCard: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 17,
    padding: 14,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.36,
    shadowRadius: 18,
    elevation: 12,
  },

  typeModalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  typeModalHeaderText: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },

  typeModalTitle: {
    color: COLORS.TEXT,
    fontSize: 17,
    fontWeight: '800',
  },

  typeModalSubtitle: {
    color: COLORS.MUTED,
    fontSize: 11,
    marginTop: 3,
  },

  modalCloseButton: {
    width: 35,
    height: 35,
    backgroundColor: COLORS.RED,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCloseText: {
    color: COLORS.TEXT,
    fontSize: 23,
    lineHeight: 25,
  },

  typeOptionList: {
    gap: 9,
  },

  typeModalOption: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },

  typeModalOptionSelected: {
    backgroundColor: '#173C65',
    borderColor: '#78D2F7',
  },

  typeRadio: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.MUTED,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  typeRadioSelected: {
    borderColor: '#78D2F7',
  },

  typeRadioInner: {
    width: 11,
    height: 11,
    backgroundColor: '#78D2F7',
    borderRadius: 6,
  },

  typeModalOptionText: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },

  typeModalOptionTitle: {
    color: COLORS.TEXT,
    fontSize: 13,
    fontWeight: '800',
  },

  typeModalOptionDescription: {
    color: COLORS.MUTED,
    fontSize: 10,
    marginTop: 3,
  },

  typeNumberBadge: {
    backgroundColor: '#273850',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  typeNumberBadgeText: {
    color: '#CBD5E1',
    fontSize: 9,
    fontWeight: '800',
  },

  buttonPressed: {
    opacity: 0.74,
  },

  buttonDisabled: {
    opacity: 0.42,
  },
});
