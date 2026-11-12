import { StyleSheet } from 'react-native';

export const COLORS = {
  BG: '#0F172A',
  CARD: '#142B49',
  CARD_DARK: '#0B1C32',
  TEXT: '#FFFFFF',
  MUTED: '#94A3B8',
  BORDER: '#3B7197',
  GREEN: '#22C55E',
  RED: '#EF4444',
  BLUE: '#38BDF8',
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  loadingText: {
    color: COLORS.MUTED,
    fontSize: 15,
    marginTop: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  headerTextContainer: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: 9,
  },

  createCourseButton: {
    minHeight: 36,
    backgroundColor: COLORS.BLUE,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  createCourseButtonText: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  createCourseButtonPressed: {
    opacity: 0.75,
  },

  refreshButton: {
    width: 38,
    height: 38,
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  refreshButtonText: {
    color: COLORS.TEXT,
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 25,
  },

  refreshButtonPressed: {
    opacity: 0.75,
  },

  disabledButton: {
    opacity: 0.4,
  },

  screenTitle: {
    color: COLORS.TEXT,
    fontSize: 22,
    fontWeight: '800',
  },

  courseCount: {
    color: COLORS.MUTED,
    fontSize: 13,
    marginTop: 4,
  },

  searchContainer: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    paddingHorizontal: 13,
    marginBottom: 14,
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: COLORS.TEXT,
    fontSize: 15,
    paddingVertical: 12,
  },

  clearButton: {
    padding: 5,
  },

  clearButtonText: {
    color: COLORS.MUTED,
    fontSize: 16,
    fontWeight: '700',
  },

  inlineError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3F1D2A',
    borderWidth: 1,
    borderColor: COLORS.RED,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },

  inlineErrorText: {
    flex: 1,
    color: '#FCA5A5',
    fontSize: 13,
  },

  inlineRetryText: {
    color: COLORS.TEXT,
    fontWeight: '800',
    marginLeft: 10,
  },

  listContent: {
    paddingBottom: 30,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  courseRow: {
    gap: 12,
    marginBottom: 12,
  },

  courseCard: {
    flex: 1,
    backgroundColor: COLORS.CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    overflow: 'hidden',
  },

  courseCardPressed: {
    opacity: 0.82,
  },

  imageContainer: {
    height: 100,
    backgroundColor: COLORS.CARD_DARK,
    position: 'relative',
  },

  courseImage: {
    width: '100%',
    height: '100%',
  },

  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderEmoji: {
    fontSize: 34,
  },

  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },

  publishedBadge: {
    backgroundColor: COLORS.GREEN,
  },

  draftBadge: {
    backgroundColor: COLORS.RED,
  },

  statusText: {
    color: COLORS.TEXT,
    fontSize: 10,
    fontWeight: '800',
  },

  cardContent: {
    padding: 12,
  },

  courseTitle: {
    color: COLORS.TEXT,
    fontSize: 15,
    fontWeight: '800',
    minHeight: 38,
  },

  description: {
    color: COLORS.MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
    minHeight: 34,
  },

  slug: {
    color: '#7DD3FC',
    fontSize: 11,
    marginTop: 8,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#294466',
  },

  courseId: {
    color: COLORS.MUTED,
    fontSize: 11,
  },

  price: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '800',
  },

  freePrice: {
    color: COLORS.GREEN,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: '800',
  },

  emptyDescription: {
    color: COLORS.MUTED,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },

  errorIcon: {
    fontSize: 45,
  },

  errorTitle: {
    color: COLORS.TEXT,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 12,
  },

  errorDescription: {
    color: COLORS.MUTED,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },

  retryButton: {
    backgroundColor: COLORS.BLUE,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 18,
  },

  retryButtonPressed: {
    opacity: 0.8,
  },

  retryButtonText: {
    color: COLORS.BG,
    fontSize: 14,
    fontWeight: '800',
  },

  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },

  footerLoaderText: {
    color: COLORS.MUTED,
    fontSize: 13,
    marginLeft: 10,
  },

  footerSpace: {
    height: 12,
  },

  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },

  screenHeaderText: {
    flex: 1,
    minWidth: 180,
    paddingRight: 10,
  },

  screenTitle: {
    color: COLORS.TEXT,
    fontSize: 22,
    fontWeight: '800',
  },

  screenSubtitle: {
    color: COLORS.MUTED,
    fontSize: 12,
    marginTop: 4,
  },
});
