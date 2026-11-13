// src/screens/Admin/Notifications/AdminNotifications.styles.js

import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#142B49';
const CARD_DARK = '#0B1C32';
const TEXT = '#FFFFFF';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';
const PRIMARY = '#2563EB';
const CHECKED = '#7DD3FC';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  centeredScreen: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: MUTED,
    marginTop: 12,
  },

  headerSection: {
    flexShrink: 0,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },

  titleContent: {
    flex: 1,
  },

  title: {
    color: TEXT,
    fontSize: 20,
    fontWeight: '900',
  },

  subtitle: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  adminBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
  },

  adminBadgeText: {
    color: CHECKED,
    fontSize: 9,
    fontWeight: '900',
  },

  fieldLabel: {
    color: MUTED,
    fontSize: 12,
    marginBottom: 7,
  },

  messageInput: {
    minHeight: 105,
    maxHeight: 135,
    color: TEXT,
    backgroundColor: CARD_DARK,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    lineHeight: 20,
  },

  characterCount: {
    color: MUTED,
    fontSize: 11,
    marginTop: 6,
    marginBottom: 12,
  },

  filterCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 10,
    backgroundColor: 'rgba(20, 43, 73, 0.42)',
    gap: 9,
  },

  roleClassRow: {
    flexDirection: 'row',
    gap: 9,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  selectField: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 11,
    paddingHorizontal: 12,
    backgroundColor: CARD_DARK,
  },

  selectText: {
    flex: 1,
    color: TEXT,
    fontSize: 13,
    fontWeight: '700',
  },

  selectArrow: {
    color: TEXT,
    fontSize: 18,
    marginLeft: 8,
  },

  searchInput: {
    flex: 1,
    minHeight: 46,
    color: TEXT,
    backgroundColor: CARD_DARK,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 11,
    paddingHorizontal: 12,
    fontSize: 13,
  },

  searchButton: {
    minWidth: 72,
    height: 46,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
  },

  searchButtonText: {
    color: TEXT,
    fontWeight: '800',
    fontSize: 13,
  },

  clearButton: {
    minWidth: 64,
    height: 46,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 10,
  },

  clearButtonText: {
    color: TEXT,
    fontWeight: '800',
    fontSize: 13,
  },

  showingText: {
    color: MUTED,
    fontSize: 12,
    marginTop: 12,
    marginBottom: 8,
  },

  tableCard: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 43, 73, 0.32)',
    marginBottom: 10,
  },

  tableHeader: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: CARD,
  },

  tableHeaderUser: {
    flex: 1,
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 12,
  },

  tableHeaderRole: {
    width: 96,
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
  },

  userList: {
    flex: 1,
  },

  userListContent: {
    paddingBottom: 6,
  },

  userRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 113, 151, 0.38)',
  },

  userRowSelected: {
    backgroundColor: 'rgba(37, 99, 235, 0.14)',
  },

  userName: {
    flex: 1,
    color: TEXT,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginLeft: 12,
    paddingRight: 8,
  },

  userRole: {
    width: 96,
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CARD_DARK,
  },

  checkboxChecked: {
    borderColor: CHECKED,
    backgroundColor: CHECKED,
  },

  checkboxTick: {
    color: '#082F49',
    fontSize: 15,
    lineHeight: 17,
    fontWeight: '900',
  },

  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  emptyState: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },

  emptyStateTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '800',
  },

  emptyStateText: {
    color: MUTED,
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 18,
  },

  footer: {
    flexShrink: 0,
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: '#10213C',
  },

  selectedCount: {
    flex: 1,
    color: MUTED,
    fontSize: 12,
    textAlign: 'right',
  },

  sendButton: {
    minWidth: 154,
    minHeight: 44,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: PRIMARY,
  },

  sendButtonDisabled: {
    opacity: 0.42,
  },

  sendButtonText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.74,
  },

  controlDisabled: {
    opacity: 0.45,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  modalCard: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '72%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_DARK,
    padding: 14,
  },

  modalTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },

  modalList: {
    flexGrow: 0,
  },

  modalOption: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
  },

  modalOptionSelected: {
    backgroundColor: 'rgba(37, 99, 235, 0.24)',
    borderWidth: 1,
    borderColor: BORDER,
  },

  modalOptionText: {
    flex: 1,
    color: MUTED,
    fontSize: 14,
  },

  modalOptionTextSelected: {
    color: TEXT,
    fontWeight: '800',
  },

  modalOptionCheck: {
    color: CHECKED,
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 10,
  },

  modalCloseButton: {
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    marginTop: 8,
  },

  modalCloseText: {
    color: TEXT,
    fontWeight: '800',
  },

  notificationTabsContainer: {
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(59,113,151,0.35)',
    paddingBottom: 12,
    marginBottom: 14,
  },

  notificationTabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },

  notificationTab: {
    minHeight: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3B7197',
    backgroundColor: '#142B49',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationTabActive: {
    backgroundColor: '#7DD3FC',
    borderColor: '#38BDF8',
  },

  notificationTabText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },

  notificationTabTextActive: {
    color: '#082F49',
  },

  useTemplateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 9,
    marginBottom: 14,
    minHeight: 32,
  },

  useTemplateText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '800',
  },

  tabPlaceholder: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 14,
    backgroundColor: '#142B49',
    padding: 20,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabPlaceholderTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },

  tabPlaceholderText: {
    color: '#AFC0D8',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },

  deliveryChannelsContainer: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 13,
    backgroundColor: '#142B49',
    paddingHorizontal: 13,
    paddingTop: 15,
    paddingBottom: 12,
    marginBottom: 14,
    marginTop: 4,
  },

  deliveryChannelsTitle: {
    color: '#AFC0D8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },

  sendEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 28,
  },

  sendEmailText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },

  pageScroll: {
    flex: 1,
  },

  pageScrollContent: {
    flexGrow: 1,
    paddingBottom: 18,
  },

  fixedHeader: {
    flexShrink: 0,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 2,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59,113,151,0.35)',
  },

  campusFilterContainer: {
    marginTop: 10,
    marginBottom: 10,
  },

  campusFilterBox: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 11,
    backgroundColor: '#0B1C32',
    paddingHorizontal: 11,
    paddingVertical: 10,
    minHeight: 46,
  },

  campusFilterInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  campusFilterPlaceholder: {
    flex: 1,
    color: '#94A3B8',
    fontSize: 12,
  },

  campusChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },

  campusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#214764',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  campusChipText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
    maxWidth: 210,
  },

  campusDropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 11,
    backgroundColor: '#0B1C32',
    padding: 9,
  },

  campusSearchInput: {
    height: 42,
    borderWidth: 1,
    borderColor: '#315D86',
    borderRadius: 9,
    color: '#FFFFFF',
    backgroundColor: '#081524',
    paddingHorizontal: 11,
    fontSize: 12,
    marginBottom: 7,
  },

  campusOption: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59,113,151,0.25)',
  },

  campusOptionText: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 12,
  },

  campusEmptyText: {
    color: '#AFC0D8',
    padding: 12,
    fontSize: 12,
  },

  campusDropdownActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 9,
    marginTop: 10,
  },

  campusClearButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  campusActionText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '700',
  },

  campusDoneButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },

  campusDoneText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  userPaginationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 9,
    marginTop: 10,
    marginBottom: 12,
  },

  userPaginationInfo: {
    color: '#AFC0D8',
    fontSize: 11,
  },

  userPaginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  userPageButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  userPageButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },

  currentPageBadge: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#3B7197',
  },

  currentPageText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  classSearchContainer: {
    position: 'relative',
    width: '100%',
  },

  classSearchInputRow: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 11,
    backgroundColor: '#0B1C32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 11,
  },

  classSearchInput: {
    flex: 1,
    minWidth: 0,
    height: 45,
    color: '#F8FAFC',
    fontSize: 12,
    paddingVertical: 0,
  },

  classDropdownButton: {
    width: 40,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },

  classDropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#0B162B',
    overflow: 'hidden',
  },

  classDropdownScroll: {
    maxHeight: 225,
  },

  classDropdownItem: {
    minHeight: 43,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#263B55',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  classDropdownItemSelected: {
    backgroundColor: '#183A5C',
  },

  classDropdownText: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 12,
  },

  classEmptyText: {
    color: '#AFC0D8',
    fontSize: 12,
    padding: 13,
  },
  classMultiSelectBox: {
    minHeight: 46,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 7,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 11,
    backgroundColor: '#0B1C32',
  },
  classSelectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    maxWidth: '90%',
    paddingHorizontal: 9,
    paddingVertical: 7,
    backgroundColor: '#214764',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 18,
  },

  classSelectedChipText: {
    flexShrink: 1,
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },

  classMultiSelectInput: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 110,
    height: 34,
    paddingVertical: 0,
    color: '#F8FAFC',
    fontSize: 12,
  },

  classDropdownFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#263B55',
    gap: 10,
  },

  classDropdownFooterButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  classClearText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '700',
  },

  classDoneButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },

  classDoneText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  mobileRoleClassRow: {
    flexDirection: 'column',
    gap: 10,
  },

  flexField: {
    width: '100%',
  },

  templateSection: {
    marginBottom: 16,
    gap: 8,
  },

  templateSelector: {
    minHeight: 46,
    backgroundColor: '#0B1C32',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 11,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  templateSelectorText: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },

  templateDropdown: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#0B1C32',
    overflow: 'hidden',
  },

  templateDropdownOption: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#263B55',
  },

  templateDropdownOptionSelected: {
    backgroundColor: '#183A5C',
  },

  templateDropdownText: {
    color: '#E2E8F0',
    fontSize: 12,
    flex: 1,
  },

  templateEmptyText: {
    color: '#AFC0D8',
    fontSize: 12,
    padding: 12,
  },

  templatePreview: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 9,
    padding: 12,
    backgroundColor: '#142B49',
    gap: 7,
  },

  templatePreviewLabel: {
    color: '#AFC0D8',
    fontSize: 11,
    fontWeight: '700',
  },

  templatePreviewText: {
    color: '#F8FAFC',
    fontSize: 13,
    lineHeight: 20,
  },
});
