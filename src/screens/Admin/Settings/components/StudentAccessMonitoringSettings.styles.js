import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',

  INNER: '#08172B',

  INNER_HOVER: '#0C203A',

  TEXT: '#FFFFFF',

  MUTED: '#AAB7CB',

  SECONDARY_TEXT: '#C7D3E6',

  BLUE: '#3478F6',

  BLUE_SOFT: '#173B66',

  BORDER: '#29435F',

  FIELD_BORDER: '#3B7197',

  SUCCESS: '#46C98D',

  SUCCESS_BG: '#11352F',

  INFO_BG: '#0B1B31',
};

export const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 16,

    padding: 16,
  },

  /*
   * Header
   */

  header: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    justifyContent: 'space-between',

    flexWrap: 'wrap',

    gap: 12,
  },

  headerText: {
    flex: 1,

    minWidth: 220,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 17,

    fontWeight: '900',
  },

  description: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 18,

    marginTop: 6,

    maxWidth: 620,
  },

  statusBadge: {
    minHeight: 28,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: COLORS.SUCCESS_BG,

    borderWidth: 1,

    borderColor: '#245C4B',

    borderRadius: 14,

    paddingHorizontal: 10,
  },

  statusDot: {
    width: 7,

    height: 7,

    borderRadius: 4,

    backgroundColor: COLORS.SUCCESS,

    marginRight: 6,
  },

  statusBadgeText: {
    color: COLORS.SUCCESS,

    fontSize: 9,

    fontWeight: '900',
  },

  /*
   * Action Cards
   */

  actionsGrid: {
    flexDirection: 'row',

    alignItems: 'stretch',

    gap: 12,

    marginTop: 16,
  },

  actionsGridMobile: {
    flexDirection: 'column',
  },

  actionCard: {
    flex: 1,

    minWidth: 0,

    minHeight: 180,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 14,

    padding: 14,

    justifyContent: 'space-between',
  },

  actionCardMobile: {
    width: '100%',

    flex: 0,

    minHeight: 170,
  },

  actionCardPressed: {
    backgroundColor: COLORS.INNER_HOVER,

    borderColor: COLORS.BLUE,

    opacity: 0.92,
  },

  actionTopRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  iconBox: {
    width: 42,

    height: 42,

    borderRadius: 12,

    backgroundColor: COLORS.BLUE_SOFT,

    borderWidth: 1,

    borderColor: '#285A91',

    alignItems: 'center',

    justifyContent: 'center',
  },

  iconText: {
    color: '#8CB8FF',

    fontSize: 19,

    fontWeight: '900',
  },

  arrowBox: {
    width: 30,

    height: 30,

    borderRadius: 15,

    backgroundColor: '#102640',

    alignItems: 'center',

    justifyContent: 'center',
  },

  arrowText: {
    color: COLORS.MUTED,

    fontSize: 22,

    lineHeight: 24,

    fontWeight: '500',
  },

  actionContent: {
    marginTop: 14,
  },

  actionTitle: {
    color: COLORS.TEXT,

    fontSize: 13,

    lineHeight: 19,

    fontWeight: '900',
  },

  actionDescription: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 16,

    marginTop: 5,
  },

  actionFooter: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 10,

    borderTopWidth: StyleSheet.hairlineWidth,

    borderTopColor: COLORS.BORDER,

    marginTop: 15,

    paddingTop: 11,
  },

  actionFooterText: {
    color: '#91B9F8',

    fontSize: 9,

    fontWeight: '800',
  },

  actionFooterArrow: {
    color: '#91B9F8',

    fontSize: 15,

    fontWeight: '900',
  },

  /*
   * Information
   */

  infoBox: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    backgroundColor: COLORS.INFO_BG,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 12,

    padding: 12,

    marginTop: 14,
  },

  infoIcon: {
    width: 28,

    height: 28,

    borderRadius: 14,

    backgroundColor: '#17365B',

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 9,

    flexShrink: 0,
  },

  infoIconText: {
    color: '#8CB8FF',

    fontSize: 12,

    fontWeight: '900',
  },

  infoText: {
    flex: 1,

    color: COLORS.MUTED,

    fontSize: 9,

    lineHeight: 15,
  },
});
