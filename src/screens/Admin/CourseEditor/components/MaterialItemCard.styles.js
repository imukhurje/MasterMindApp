import { StyleSheet } from 'react-native';

const COLORS = {
  CARD_DARK: '#08152A',
  PANEL: '#101D34',
  TEXT: '#FFFFFF',
  MUTED: '#A5B4CC',
  BORDER: '#3B7197',
  BLUE: '#3177ED',
  RED: '#EF4D5E',
};

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: '#213D61',
    borderRadius: 14,
    overflow: 'hidden',
  },

  cardActive: {
    borderWidth: 2,
    borderColor: COLORS.BLUE,
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

  cardRow: {
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardRowCompact: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },

  dragTouchArea: {
    flex: 1,
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },

  dragTouchAreaCompact: {
    alignItems: 'flex-start',
  },

  dragTouchAreaPressed: {
    backgroundColor: '#102440',
  },

  dragTouchAreaActive: {
    backgroundColor: '#173C65',
  },

  dragTouchAreaDisabled: {
    opacity: 0.55,
  },

  materialIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 11,
    backgroundColor: COLORS.PANEL,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  materialIcon: {
    fontSize: 22,
  },

  materialInfo: {
    flex: 1,
    minWidth: 0,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  materialTitle: {
    flex: 1,
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '800',
    paddingRight: 10,
  },

  materialMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 6,
  },

  materialType: {
    color: '#BCD4F6',
    fontSize: 10,
    fontWeight: '800',
  },

  materialSize: {
    color: COLORS.MUTED,
    fontSize: 10,
    marginLeft: 4,
  },

  previewLabel: {
    color: '#4ADE80',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 8,
  },

  externalUrl: {
    color: '#7DD3FC',
    fontSize: 10,
    marginTop: 5,
  },

  dragHandleIndicator: {
    width: 30,
    height: 28,
    borderRadius: 7,
    backgroundColor: COLORS.PANEL,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  dragHandleIndicatorText: {
    color: COLORS.MUTED,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 19,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingRight: 12,
  },

  mobileActions: {
    borderTopWidth: 1,
    borderTopColor: '#213D61',
    padding: 10,
    alignItems: 'flex-end',
  },

  editButton: {
    minWidth: 67,
    height: 40,
    backgroundColor: '#173552',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  deleteButton: {
    minWidth: 75,
    height: 40,
    backgroundColor: COLORS.RED,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  actionButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  actionButtonDisabled: {
    opacity: 0.4,
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
