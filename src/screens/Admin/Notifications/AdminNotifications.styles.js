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
    flex: 1,
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

  flexField: {
    flex: 1,
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
    flex: 1,
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
});
