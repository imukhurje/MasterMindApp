// src/screens/Question/QuestionBank.styles.js

import { StyleSheet } from 'react-native';

export const COLORS = {
  BG: '#081321',

  CARD: '#102742',
  CARD_DARK: '#0B1A2E',
  CARD_LIGHT: '#142B49',

  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',

  BORDER: '#376D99',
  BORDER_SOFT: '#294B69',

  PRIMARY: '#2563EB',
  CYAN: '#67D1F0',

  RED: '#EF4444',
  GREEN: '#22C55E',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  loader: {
    flex: 1,
    backgroundColor: COLORS.BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topSection: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,

    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_SOFT,

    zIndex: 10,
  },

  topButtonRow: {
    gap: 8,
    paddingRight: 6,
    marginBottom: 14,
  },

  secondaryButton: {
    minHeight: 42,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 10,

    paddingHorizontal: 14,
  },

  secondaryButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  primaryButton: {
    minHeight: 42,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.PRIMARY,

    borderRadius: 10,

    paddingHorizontal: 15,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  searchInput: {
    minHeight: 48,

    backgroundColor: COLORS.CARD_DARK,

    color: COLORS.TEXT,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 11,

    paddingHorizontal: 13,

    fontSize: 13,

    marginBottom: 12,
  },

  filterPanel: {
    backgroundColor: '#102742',
    borderWidth: 1,
    borderColor: '#376D99',
    borderRadius: 14,
    padding: 11,
    marginBottom: 8,
  },

  filterTitle: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  filterSubtitle: {
    color: COLORS.MUTED,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  clearFilterButton: {
    minHeight: 34,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 8,

    paddingHorizontal: 11,
  },

  clearFilterButtonText: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  filterField: {
    width: '100%',
  },

  filterLabel: {
    color: '#DCE6F3',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },

  dropdown: {
    minHeight: 46,
    backgroundColor: '#0B1A2E',
    borderWidth: 1,
    borderColor: '#376D99',
    borderRadius: 12,
    paddingHorizontal: 12,
  },

  dropdownPlaceholder: {
    color: COLORS.TEXT,
    fontSize: 12,
  },

  dropdownSelectedText: {
    color: COLORS.TEXT,
    fontSize: 12,
  },

  dropdownItemText: {
    color: COLORS.TEXT,
    fontSize: 12,
  },

  dropdownContainer: {
    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,

    overflow: 'hidden',
  },

  dropdownSearchInput: {
    color: COLORS.TEXT,

    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 8,

    fontSize: 12,
    paddingHorizontal: 10,
  },

  listArea: {
    flex: 1,
    minHeight: 0,
  },

  listContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 30,
  },

  listContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 30,
  },

  showingText: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginBottom: 12,
  },

  listLoading: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    paddingTop: 40,
  },

  loadingText: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 9,
  },

  emptyText: {
    color: COLORS.MUTED,

    textAlign: 'center',

    fontSize: 12,

    marginTop: 30,
  },

  questionCard: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 14,

    padding: 13,

    marginBottom: 12,
  },

  badge: {
    alignSelf: 'flex-start',

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 999,

    paddingVertical: 4,
    paddingHorizontal: 9,

    marginBottom: 9,
  },

  badgeText: {
    color: '#DCE7F5',

    fontSize: 10,
    fontWeight: '700',
  },

  questionTitle: {
    color: COLORS.TEXT,

    fontSize: 14,
    lineHeight: 20,

    fontWeight: '900',

    marginBottom: 10,
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    marginBottom: 5,
  },

  correctOptionMark: {
    color: COLORS.GREEN,

    width: 20,

    fontSize: 12,
  },

  optionMark: {
    color: COLORS.MUTED,

    width: 20,

    fontSize: 12,
  },

  optionText: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 12,
    lineHeight: 17,
  },

  metaText: {
    color: COLORS.MUTED,

    fontSize: 15,
    lineHeight: 16,

    marginTop: 10,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },

  editButton: {
    minHeight: 38,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.CARD_LIGHT,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,

    paddingHorizontal: 14,
  },

  deleteButton: {
    minHeight: 38,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.RED,

    borderRadius: 9,

    paddingHorizontal: 14,
  },

  buttonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '800',
  },

  deleteText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  loadMoreButton: {
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.PRIMARY,

    borderRadius: 10,

    marginTop: 5,
  },

  loadMoreText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },
  filterRowTwo: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },

  filterRowThree: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },

  filterFieldHalf: {
    flex: 1,
    minWidth: 0,
  },

  filterFieldThird: {
    flex: 1,
    minWidth: 0,
  },

  dropdownCompact: {
    minHeight: 44,
    backgroundColor: '#0B1A2E',
    borderWidth: 1,
    borderColor: '#376D99',
    borderRadius: 12,
    paddingHorizontal: 10,
  },

  dropdownPlaceholderCompact: {
    color: '#A8B6C9',
    fontSize: 12,
  },

  dropdownSelectedTextCompact: {
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: '700',
  },

  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  filterHeaderText: {
    flex: 1,
    paddingRight: 10,
  },

  filterHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  filterBody: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(55,109,153,0.45)',
  },

  modelAnswer: {
    color: '#C7D7EC',
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 8,
    fontFamily: 'monospace',
  },

  questionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  questionCheckboxButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  bulkActionsContainer: {
    marginTop: 12,
    marginBottom: 12,
  },

  bulkActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },

  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minHeight: 38,
    paddingHorizontal: 11,
    borderRadius: 9,
    backgroundColor: '#2563EB',
  },

  deselectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minHeight: 38,
    paddingHorizontal: 11,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#3B7197',
    backgroundColor: '#142B49',
  },

  deleteSelectedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minHeight: 38,
    paddingHorizontal: 11,
    borderRadius: 9,
    backgroundColor: '#DC2626',
  },

  bulkButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  bulkButtonDisabled: {
    opacity: 0.4,
  },

  selectedCountText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 9,
  },
});
