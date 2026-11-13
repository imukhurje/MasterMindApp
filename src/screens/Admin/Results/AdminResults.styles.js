import { StyleSheet } from 'react-native';

export const COLORS = {
  BACKGROUND: '#071426',

  CARD: '#112744',

  CARD_DARK: '#0B1C32',

  TEXT: '#FFFFFF',

  MUTED: '#AAB7CB',

  BLUE: '#3478F6',

  ACTIVE: '#63B6D2',

  GREEN: '#4FD1B5',

  BORDER: '#3473A0',

  ERROR: '#FFB4BA',

  ERROR_BG: 'rgba(230, 71, 80, 0.10)',
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,

    backgroundColor: COLORS.BACKGROUND,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 35,
  },

  /*
   * Header / Tabs
   */

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },

  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 7,
  },

  tabButton: {
    minHeight: 38,
    backgroundColor: COLORS.BLUE,
    borderRadius: 9,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  tabButtonActive: {
    backgroundColor: COLORS.ACTIVE,
    borderWidth: 1,
    borderColor: '#A8EDFF',
  },

  tabButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  tabButtonTextActive: {
    color: COLORS.TEXT,
  },

  tabCountBadge: {
    minWidth: 20,

    height: 20,

    borderRadius: 10,

    backgroundColor: 'rgba(0,0,0,0.18)',

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 5,
  },

  tabCountBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },

  tabCountText: {
    color: COLORS.TEXT,

    fontSize: 9,

    fontWeight: '900',
  },

  refreshButton: {
    minHeight: 38,
    backgroundColor: COLORS.CARD_DARK,
    borderRadius: 9,
    paddingHorizontal: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardsContainer: {
    gap: 10,
  },

  refreshButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  /*
   * Cards
   */

  resultCard: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    padding: 12,
  },

  resultTitle: {
    color: COLORS.TEXT,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 19,
  },

  cardTopRow: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    justifyContent: 'space-between',

    flexWrap: 'wrap',

    gap: 12,
  },

  cardMainInfo: {
    flex: 1,

    minWidth: 220,
  },

  dateRangeText: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 17,
    marginTop: 10,
  },

  windowText: {
    color: COLORS.MUTED,
    fontSize: 10,
    marginTop: 4,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 9,
  },

  tagBadge: {
    minHeight: 23,
    maxWidth: '100%',
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tagText: {
    color: COLORS.TEXT,
    fontSize: 9,
    fontWeight: '600',
  },

  /*
   * Bottom
   */

  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(52, 115, 160, 0.42)',
  },

  cardStatsGroup: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },

  statBadge: {
    minHeight: 24,
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statText: {
    color: COLORS.TEXT,
    fontSize: 9,
    fontWeight: '600',
  },

  rightActions: {
    marginLeft: 'auto',

    alignItems: 'flex-end',

    gap: 8,
  },

  typeBadge: {
    minHeight: 27,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 14,

    paddingHorizontal: 10,

    alignItems: 'center',

    justifyContent: 'center',
  },

  typeText: {
    color: COLORS.TEXT,

    fontSize: 9,

    fontWeight: '600',
  },

  openButton: {
    minWidth: 68,
    minHeight: 38,
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 9,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  openButtonText: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: '900',
  },

  cardTypeRow: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },

  cardTypeText: {
    color: COLORS.MUTED,
    fontSize: 9,
    fontWeight: '600',
  },

  /*
   * Loading / error / empty
   */

  stateContainer: {
    flex: 1,

    minHeight: 280,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 24,
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

    marginBottom: 14,
  },

  retryButton: {
    minHeight: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',

    justifyContent: 'center',
  },

  retryButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  inlineError: {
    backgroundColor: COLORS.ERROR_BG,

    borderRadius: 10,

    padding: 10,

    marginBottom: 12,
  },

  inlineErrorText: {
    color: COLORS.ERROR,

    fontSize: 10,
  },

  emptyContainer: {
    minHeight: 220,

    backgroundColor: COLORS.CARD,

    borderRadius: 18,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 24,
  },

  emptyTitle: {
    color: COLORS.TEXT,

    fontSize: 15,

    fontWeight: '900',
  },

  emptyDescription: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

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
