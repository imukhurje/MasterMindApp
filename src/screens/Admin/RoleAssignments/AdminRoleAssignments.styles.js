// src/screens/Admin/RoleAssignments/AdminRoleAssignments.styles.js

import { StyleSheet } from 'react-native';

const BG = '#081524';
const CARD = '#0B1C32';
const CARD_LIGHT = '#102844';
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
    backgroundColor: BG,

    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: MUTED,
    fontSize: 13,

    marginTop: 10,
  },

  content: {
    padding: 14,
    paddingBottom: 24,
  },

  filterCard: {
    backgroundColor: CARD_LIGHT,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 15,

    padding: 12,

    marginBottom: 16,
  },

  scopeSection: {
    marginBottom: 12,
  },

  coreFilterSection: {
    marginBottom: 12,
  },

  searchSection: {
    marginTop: 3,
  },

  filterLabel: {
    color: '#DCE7F5',

    fontSize: 12,
    fontWeight: '800',

    marginBottom: 6,
  },

  scopeBox: {
    minHeight: 46,

    justifyContent: 'center',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  scopeText: {
    color: '#FFFFFF',

    fontSize: 13,
    fontWeight: '800',
  },

  roleFilterField: {
    minHeight: 52,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  roleChips: {
    flex: 1,

    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  roleChip: {
    minHeight: 29,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#315F87',

    borderRadius: 15,

    paddingLeft: 9,
    paddingRight: 6,

    marginRight: 5,
    marginVertical: 2,
  },

  roleChipText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '700',

    marginRight: 4,
  },

  roleFilterPlaceholder: {
    color: '#718096',
    fontSize: 12,
  },

  roleFilterPanel: {
    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    overflow: 'hidden',

    marginTop: 5,
  },

  roleFilterSearchBox: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',

    borderBottomWidth: 1,
    borderBottomColor: '#315F87',

    paddingHorizontal: 10,
  },

  roleFilterSearchInput: {
    flex: 1,

    color: TEXT,
    fontSize: 12,

    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  roleFilterOptions: {
    maxHeight: 220,
  },

  roleFilterOption: {
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 12,
  },

  roleFilterOptionSelected: {
    backgroundColor: '#173B60',
  },

  roleFilterOptionText: {
    color: TEXT,
    fontSize: 12,
  },

  applyFilterButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    margin: 8,

    borderRadius: 9,
  },

  applyFilterButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  filterHelp: {
    color: MUTED,

    fontSize: 10,
    lineHeight: 15,

    marginTop: 5,
  },

  searchBox: {
    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 10,
  },

  searchInput: {
    flex: 1,

    color: TEXT,
    fontSize: 13,

    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  searchButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 8,
  },

  searchButton: {
    minWidth: 82,
    minHeight: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 14,
  },

  searchButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  clearButton: {
    minWidth: 70,
    minHeight: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 14,

    marginLeft: 8,
  },

  clearButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 10,
  },

  listHeadingTitle: {
    color: TEXT,

    fontSize: 17,
    fontWeight: '900',
  },

  listHeadingMeta: {
    color: MUTED,
    fontSize: 11,
  },

  userCard: {
    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 13,
  },

  userInfo: {
    marginBottom: 12,
  },

  userName: {
    color: TEXT,

    fontSize: 15,
    fontWeight: '900',
  },

  userMeta: {
    color: MUTED,

    fontSize: 11,
    lineHeight: 16,

    marginTop: 4,
  },

  roleArea: {
    borderTopWidth: 1,
    borderTopColor: '#234565',

    paddingTop: 10,
  },

  roleLabel: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '800',

    marginBottom: 6,
  },

  roleDropdown: {
    minHeight: 48,

    backgroundColor: CARD_LIGHT,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 11,
  },

  roleDropdownLocked: {
    opacity: 0.65,
  },

  dropdownContainer: {
    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    overflow: 'hidden',
  },

  dropdownSelectedText: {
    color: TEXT,

    fontSize: 13,
    fontWeight: '700',
  },

  dropdownItemText: {
    color: TEXT,
    fontSize: 13,
  },

  dropdownPlaceholder: {
    color: MUTED,
    fontSize: 13,
  },

  roleHelp: {
    color: MUTED,

    fontSize: 10,
    lineHeight: 15,

    marginTop: 5,
  },

  roleUpdatingBox: {
    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: CARD_LIGHT,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  roleUpdatingText: {
    color: MUTED,

    fontSize: 11,

    marginLeft: 8,
  },

  separator: {
    height: 10,
  },

  emptyCard: {
    minHeight: 180,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 20,
  },

  emptyTitle: {
    color: TEXT,

    fontSize: 15,
    fontWeight: '900',

    marginTop: 10,
  },

  emptyText: {
    color: MUTED,

    fontSize: 11,

    marginTop: 5,

    textAlign: 'center',
  },

  loadMoreButton: {
    minHeight: 46,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    marginTop: 14,
  },

  loadMoreText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.45,
  },

  footerSpace: {
    height: 20,
  },
});
