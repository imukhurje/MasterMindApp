// src/screens/ExamsScreen.styles.js

import { StyleSheet } from 'react-native';

export const COLORS = {
  BG: '#0F172A',
  CARD: '#0B1C32',
  CARD_LIGHT: '#142B49',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',
  BORDER: '#3B7197',
  PRIMARY: '#2563EB',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.BG,
  },

  pageTitle: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: '900',
  },

  pageSubtitle: {
    color: COLORS.MUTED,
    fontSize: 12,
    marginTop: 3,
    marginBottom: 14,
  },

  searchInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 11,
    backgroundColor: COLORS.CARD,
    color: COLORS.TEXT,
    paddingHorizontal: 13,
    fontSize: 13,
    marginBottom: 12,
  },

  dateFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  dateButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    backgroundColor: COLORS.CARD,
    paddingHorizontal: 10,
  },

  dateLabel: {
    color: COLORS.MUTED,
    fontSize: 8,
    fontWeight: '700',
  },

  dateValue: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },

  datePlaceholder: {
    color: '#64748B',
  },

  calendarIcon: {
    fontSize: 15,
    marginLeft: 6,
  },

  clearButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.CARD_LIGHT,
  },

  clearButtonPressed: {
    opacity: 0.7,
  },

  clearButtonText: {
    color: COLORS.TEXT,
    fontSize: 10,
    fontWeight: '800',
  },

  sectionTitle: {
    color: '#AFC0D8',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 9,
  },

  examCard: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 15,
    backgroundColor: COLORS.CARD,
    padding: 14,
    marginBottom: 10,
  },

  examCardPressed: {
    opacity: 0.82,
  },

  examTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  examTitleArea: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },

  examTitle: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 19,
  },

  examCourse: {
    color: COLORS.MUTED,
    fontSize: 11,
    marginTop: 6,
  },

  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxWidth: '52%',
    gap: 5,
  },

  badge: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },

  badgeText: {
    color: '#C8D5E8',
    fontSize: 8,
    fontWeight: '700',
  },

  pastStatusBadge: {
    backgroundColor: 'rgba(148,163,184,0.08)',
  },

  pastStatusText: {
    color: COLORS.MUTED,
  },

  examMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  examTime: {
    flex: 1,
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 17,
    paddingRight: 10,
  },

  examClass: {
    color: COLORS.MUTED,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'right',
  },

  empty: {
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.CARD,
    marginTop: 18,
  },

  emptyTitle: {
    color: COLORS.TEXT,
    fontWeight: '800',
    marginBottom: 4,
  },

  muted: {
    color: COLORS.MUTED,
  },

  toastErr: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#EF4444',
  },

  errorText: {
    color: COLORS.TEXT,
  },

  examCardActive: {
    backgroundColor: '#103A33',
    borderColor: '#22C55E',
    borderWidth: 1.5,
  },

  examCardStartingSoon: {
    backgroundColor: '#3A3214',
    borderColor: '#F59E0B',
    borderWidth: 1.5,
  },

  liveBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginBottom: 6,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#22C55E',
    marginRight: 5,
  },

  liveBadgeText: {
    color: '#86EFAC',
    fontSize: 8,
    fontWeight: '900',
  },

  startingSoonBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginBottom: 6,
  },

  startingSoonBadgeText: {
    color: '#FCD34D',
    fontSize: 8,
    fontWeight: '900',
  },
});
