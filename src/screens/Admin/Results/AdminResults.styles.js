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
    padding: 15,

    paddingBottom: 40,
  },

  /*
   * Header / Tabs
   */

  topRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    flexWrap: 'wrap',

    gap: 10,

    marginBottom: 16,
  },

  tabsContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 8,
  },

  tabButton: {
    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 14,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 7,
  },

  tabButtonActive: {
    backgroundColor: COLORS.ACTIVE,

    borderWidth: 2,

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
    minHeight: 40,

    backgroundColor: COLORS.CARD_DARK,

    borderRadius: 10,

    paddingHorizontal: 14,

    alignItems: 'center',

    justifyContent: 'center',
  },

  refreshButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  /*
   * Cards
   */

  cardsContainer: {
    gap: 14,
  },

  resultCard: {
    backgroundColor: COLORS.CARD,

    borderRadius: 18,

    padding: 17,

    minHeight: 190,
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

  resultTitle: {
    color: COLORS.TEXT,

    fontSize: 16,

    fontWeight: '900',

    lineHeight: 21,
  },

  dateRangeText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '800',

    marginTop: 8,

    lineHeight: 18,
  },

  windowText: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 3,
  },

  tagsContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'flex-end',

    flexWrap: 'wrap',

    gap: 6,

    maxWidth: '45%',
  },

  tagBadge: {
    minHeight: 26,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 13,

    paddingHorizontal: 9,

    alignItems: 'center',

    justifyContent: 'center',
  },

  tagText: {
    color: COLORS.TEXT,

    fontSize: 9,

    fontWeight: '600',

    maxWidth: 150,
  },

  /*
   * Bottom
   */

  cardBottomRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    flexWrap: 'wrap',

    gap: 12,

    marginTop: 14,
  },

  statBadge: {
    minHeight: 27,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 14,

    paddingHorizontal: 9,

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
    minWidth: 72,

    minHeight: 40,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    paddingHorizontal: 14,

    alignItems: 'center',

    justifyContent: 'center',
  },

  openButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
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
