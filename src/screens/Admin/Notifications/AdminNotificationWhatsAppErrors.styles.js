import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#142B49';
const BORDER = '#3B7197';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';

export default StyleSheet.create({
  container: {
    backgroundColor: BG,
    gap: 14,
    paddingVertical: 12,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  topBarText: {
    flex: 1,
    gap: 4,
  },

  title: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '700',
  },

  subtitle: {
    color: MUTED,
    fontSize: 12,
  },

  refreshButton: {
    width: 38,
    height: 38,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingArea: {
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },

  tableContainer: {
    width: '100%',
    minWidth: 0,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    overflow: 'hidden',
    backgroundColor: '#0B162B',
  },

  tableHeader: {
    minHeight: 47,
    backgroundColor: '#1D3B5C',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  headerText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
  },

  tableRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  cellText: {
    color: TEXT,
    fontSize: 12,
    paddingHorizontal: 10,
  },

  dateColumn: {
    width: 165,
  },

  eventColumn: {
    width: 165,
  },

  recipientColumn: {
    width: 185,
  },

  ruleColumn: {
    width: 145,
  },

  reasonColumn: {
    flex: 1,
    minWidth: 180,
  },

  emptyRow: {
    padding: 14,
    minHeight: 48,
    justifyContent: 'center',
  },

  emptyText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 19,
  },

  mobileList: {
    gap: 12,
  },

  mobileCard: {
    backgroundColor: '#0B162B',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    width: '100%',
  },

  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  mobileDate: {
    flex: 1,
    color: TEXT,
    fontWeight: '700',
    fontSize: 12,
  },

  errorBadge: {
    backgroundColor: '#3B1828',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  errorBadgeText: {
    color: '#FCA5A5',
    fontWeight: '700',
    fontSize: 10,
  },

  mobileDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },

  mobileDetailLabel: {
    color: MUTED,
    fontSize: 11,
    flex: 1,
  },

  mobileDetailValue: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '600',
    flex: 1.6,
    textAlign: 'right',
  },

  paginationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  paginationInfo: {
    color: MUTED,
    fontSize: 11,
  },

  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  pageButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    opacity: 0.4,
  },

  pageButtonText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '700',
  },

  pageBadge: {
    minHeight: 36,
    minWidth: 43,
    paddingHorizontal: 7,
    backgroundColor: '#2563EB',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pageBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
