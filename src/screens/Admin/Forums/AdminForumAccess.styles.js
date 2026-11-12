import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#112441';
const CARD_DARK = '#08172D';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  centeredScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG,
  },

  loadingText: {
    color: MUTED,
    fontSize: 11,
    marginTop: 10,
  },

  headerSection: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 113, 151, 0.45)',
  },

  pageTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  pageSubtitle: {
    color: '#C6D7ED',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 7,
  },

  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 8,
  },

  searchInput: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD,
    color: TEXT,
    fontSize: 11,
    paddingHorizontal: 11,
  },

  filterButton: {
    width: 165,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderRadius: 9,
    backgroundColor: CARD,
    paddingHorizontal: 10,
  },

  filterButtonText: {
    flex: 1,
    color: TEXT,
    fontSize: 10,
    fontWeight: '700',
  },

  filterArrow: {
    color: TEXT,
    fontSize: 13,
  },

  resultSummary: {
    paddingHorizontal: 12,
    paddingBottom: 5,
  },

  resultSummaryText: {
    color: MUTED,
    fontSize: 9,
  },

  listContent: {
    paddingBottom: 20,
  },

  userRow: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 113, 151, 0.32)',
    backgroundColor: 'rgba(17, 36, 65, 0.58)',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  avatar: {
    width: 42,
    height: 42,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: '#66C4E2',
    marginRight: 11,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  userContent: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },

  userName: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '900',
  },

  userEmail: {
    color: MUTED,
    fontSize: 9,
    marginTop: 3,
  },

  roleBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 5,
  },

  roleBadgeText: {
    color: '#67D1F0',
    fontSize: 7,
    fontWeight: '900',
  },

  accessButton: {
    minWidth: 74,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderRadius: 9,
    backgroundColor: 'rgba(20, 43, 73, 0.60)',
    paddingHorizontal: 12,
  },

  unblockButton: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.10)',
  },

  accessButtonText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '900',
  },

  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  filterModal: {
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: CARD_DARK,
    padding: 12,
  },

  modalTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 10,
  },

  filterOption: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.50)',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
  },

  filterOptionSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
  },

  filterOptionText: {
    flex: 1,
    color: TEXT,
    fontSize: 11,
  },

  filterOptionTextSelected: {
    fontWeight: '900',
  },

  filterCheck: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '900',
  },

  modalCloseButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    marginTop: 4,
  },

  modalCloseButtonText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '800',
  },

  emptyListContent: {
    flexGrow: 1,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  emptyStateTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  emptyStateText: {
    color: MUTED,
    fontSize: 10,
    marginTop: 5,
  },

  controlPressed: {
    opacity: 0.72,
  },
  controlDisabled: {
    opacity: 0.45,
  },
});
