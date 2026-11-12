import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#142B49',
  CARD_DARK: '#0B1C32',
  FIELD: '#0E203A',
  TEXT: '#FFFFFF',
  MUTED: '#94A3B8',
  BORDER: '#3B7197',
  BLUE: '#3B82F6',
  GREEN: '#22C55E',
  GREEN_DARK: '#123A2A',
  ORANGE: '#F59E0B',
  ORANGE_DARK: '#402E0A',
  ERROR: '#F87171',
  ERROR_BG: '#3A1721',
};

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    padding: 13,
    marginTop: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '800',
  },

  subtitle: {
    color: COLORS.MUTED,
    fontSize: 11,
    marginTop: 3,
  },

  searchContainer: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.FIELD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    paddingHorizontal: 11,
    marginBottom: 11,
  },

  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: COLORS.TEXT,
    fontSize: 13,
    paddingVertical: 8,
  },

  clearButtonText: {
    color: COLORS.MUTED,
    fontSize: 14,
    fontWeight: '800',
  },

  subjectList: {
    gap: 8,
  },

  subjectCard: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: '#284C70',
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },

  subjectCardSelected: {
    borderColor: COLORS.BLUE,
    backgroundColor: '#102E52',
  },

  subjectCardAttached: {
    borderColor: COLORS.GREEN,
    backgroundColor: COLORS.GREEN_DARK,
  },

  subjectCardPressed: {
    opacity: 0.75,
  },

  checkbox: {
    width: 21,
    height: 21,
    borderWidth: 1,
    borderColor: COLORS.MUTED,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  checkboxSelected: {
    backgroundColor: COLORS.BLUE,
    borderColor: COLORS.BLUE,
  },

  checkboxText: {
    color: COLORS.TEXT,
    fontSize: 13,
    fontWeight: '900',
  },

  subjectTextContainer: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },

  subjectTitle: {
    color: COLORS.TEXT,
    fontSize: 13,
    fontWeight: '800',
  },

  subjectDescription: {
    color: '#CBD5E1',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
  },

  classGroupText: {
    color: COLORS.MUTED,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 4,
  },

  attachedBadge: {
    backgroundColor: COLORS.GREEN,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  attachedBadgeText: {
    color: '#052E16',
    fontSize: 9,
    fontWeight: '900',
  },

  pendingBadge: {
    backgroundColor: COLORS.ORANGE_DARK,
    borderWidth: 1,
    borderColor: COLORS.ORANGE,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  pendingBadgeText: {
    color: '#FCD34D',
    fontSize: 9,
    fontWeight: '900',
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.ERROR_BG,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 10,
  },

  errorText: {
    flex: 1,
    color: COLORS.ERROR,
    fontSize: 11,
    paddingRight: 10,
  },

  retryText: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 18,
  },

  emptyText: {
    color: COLORS.MUTED,
    fontSize: 12,
  },
});
