// src/screens/Admin/Staff/AdminStaffs.styles.js

import { StyleSheet } from 'react-native';

const BG = '#081524';
const CARD = '#0B1C32';
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

  topButtons: {
    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 9,

    marginBottom: 12,
  },

  topButtonRow: {
    flexDirection: 'row',
    gap: 8,
  },

  secondTopButtonRow: {
    marginTop: 8,
  },

  secondaryTopButton: {
    flex: 1,

    minHeight: 43,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 7,
  },

  secondaryTopButtonText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',

    marginLeft: 5,

    textAlign: 'center',
  },

  primaryTopButton: {
    flex: 1,

    minHeight: 43,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 9,

    paddingHorizontal: 8,
  },

  primaryTopButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',

    marginLeft: 5,
  },

  searchPanel: {
    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 9,

    marginBottom: 14,
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
    paddingVertical: 9,
  },

  searchActions: {
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

    marginLeft: 8,

    paddingHorizontal: 14,
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
    fontSize: 10,
  },

  staffCard: {
    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 12,
  },

  staffTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 78,
    height: 78,

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',

    backgroundColor: '#3D4C64',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 12,
  },

  photo: {
    width: '100%',
    height: '100%',
  },

  initials: {
    color: '#FFFFFF',

    fontSize: 21,
    fontWeight: '900',
  },

  staffInfo: {
    flex: 1,
    minWidth: 0,

    marginLeft: 11,
  },

  staffName: {
    color: TEXT,

    fontSize: 15,
    fontWeight: '900',
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 6,
  },

  contactText: {
    flex: 1,

    color: MUTED,

    fontSize: 11,

    marginLeft: 6,
  },

  detailsSection: {
    marginTop: 12,

    borderTopWidth: 1,
    borderTopColor: '#234565',

    paddingTop: 9,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    marginTop: 5,
  },

  detailLabel: {
    width: 92,

    color: MUTED,

    fontSize: 11,
    fontWeight: '700',
  },

  detailValue: {
    flex: 1,

    color: '#DCE7F5',

    fontSize: 12,
    lineHeight: 17,

    fontWeight: '700',
  },

  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    marginTop: 11,
  },

  statusBadge: {
    minHeight: 25,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,

    borderRadius: 13,

    paddingHorizontal: 9,

    marginRight: 6,
  },

  statusBadgeText: {
    fontSize: 9,
    fontWeight: '900',
  },

  activeBadge: {
    backgroundColor: '#063F3A',
    borderColor: '#10B981',
  },

  activeBadgeText: {
    color: '#D1FAE5',
  },

  inactiveBadge: {
    backgroundColor: '#3D2027',
    borderColor: '#EF4444',
  },

  inactiveBadgeText: {
    color: '#FECACA',
  },

  draftBadge: {
    backgroundColor: '#3A301D',
    borderColor: '#D7A43A',
  },

  draftBadgeText: {
    color: '#FDE7A9',
  },

  staffActions: {
    marginTop: 12,
  },

  topActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  editButton: {
    minWidth: 64,
    minHeight: 39,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 13,
  },

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  deleteButton: {
    minWidth: 70,
    minHeight: 39,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 9,

    paddingHorizontal: 13,

    marginLeft: 7,
  },

  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  bottomActionRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 8,
  },

  credentialsButton: {
    flex: 1,
    minHeight: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 8,
  },

  credentialsButtonText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',

    textAlign: 'center',
  },

  credentialsSpacer: {
    flex: 1,
  },

  iconOnlyButton: {
    width: 42,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    marginLeft: 7,
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
  createStaffBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.72)',

    paddingHorizontal: 10,
    paddingVertical: 16,
  },

  createStaffModal: {
    width: '100%',
    maxHeight: '94%',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 15,

    overflow: 'hidden',
  },

  createStaffContent: {
    padding: 14,
  },

  createStaffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 5,
  },

  createStaffTitle: {
    color: '#F8FAFC',

    fontSize: 17,
    fontWeight: '900',
  },

  createStaffCloseButton: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  createStaffLabel: {
    color: '#DCE7F5',

    fontSize: 12,
    fontWeight: '700',

    marginTop: 12,
    marginBottom: 6,
  },

  createStaffInput: {
    minHeight: 47,

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    color: '#FFFFFF',
    fontSize: 13,

    paddingHorizontal: 11,
    paddingVertical: 9,
  },

  createStaffReadOnlyInput: {
    minHeight: 47,

    justifyContent: 'center',

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 11,
  },

  createStaffReadOnlyText: {
    color: '#DCE7F5',

    fontSize: 13,
  },

  createStaffTwoColumnRow: {
    flexDirection: 'row',

    gap: 9,
  },

  createStaffHalfField: {
    flex: 1,
    minWidth: 0,
  },

  documentsTitle: {
    color: '#F8FAFC',

    fontSize: 14,
    fontWeight: '900',

    marginTop: 18,
  },

  documentsHelp: {
    color: '#AFC0D8',

    fontSize: 10,
    lineHeight: 15,

    marginTop: 5,
    marginBottom: 5,
  },

  documentsLoader: {
    flexDirection: 'row',
    alignItems: 'center',

    minHeight: 50,
  },

  documentsLoaderText: {
    color: '#AFC0D8',

    fontSize: 11,

    marginLeft: 8,
  },

  documentField: {
    marginTop: 10,
  },

  documentLabel: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '700',

    marginBottom: 5,
  },

  documentPickerButton: {
    minHeight: 43,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#315F87',

    borderRadius: 8,

    paddingHorizontal: 10,
  },

  documentPickerText: {
    flex: 1,

    color: '#FFFFFF',

    fontSize: 11,

    marginLeft: 7,
  },

  createStaffActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 18,
  },

  createStaffCancelButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 13,
  },

  createStaffCancelText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  saveDraftButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 13,

    marginLeft: 7,
  },

  saveDraftText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  createStaffButton: {
    minWidth: 72,
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 9,

    paddingHorizontal: 14,

    marginLeft: 7,
  },

  createStaffButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },
  editDocumentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  editDocumentPicker: {
    flex: 1,
  },

  currentDocumentText: {
    flex: 1,

    color: '#BFDBFE',

    fontSize: 10,
    lineHeight: 14,

    marginLeft: 8,
  },
  staffCredentialsBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.75)',

    paddingHorizontal: 12,
    paddingVertical: 18,
  },

  staffCredentialsModal: {
    width: '100%',
    maxHeight: '90%',

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#3B7197',

    borderRadius: 14,

    padding: 14,
  },

  staffCredentialsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    marginBottom: 12,
  },

  staffCredentialsTitle: {
    color: '#F8FAFC',

    fontSize: 16,
    fontWeight: '900',
  },

  staffCredentialsSubtitle: {
    color: '#AFC0D8',

    fontSize: 11,
    lineHeight: 16,

    marginTop: 4,
    marginRight: 8,
  },

  staffCredentialsClose: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  staffCredentialsLoader: {
    minHeight: 180,

    alignItems: 'center',
    justifyContent: 'center',
  },

  staffCredentialsLoadingText: {
    color: '#AFC0D8',

    fontSize: 12,

    marginTop: 9,
  },

  staffCredentialsRows: {
    maxHeight: 480,
  },

  staffCredentialCard: {
    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#3B7197',

    borderRadius: 11,

    padding: 12,

    marginBottom: 9,
  },

  staffCredentialIdentity: {
    marginBottom: 10,
  },

  staffCredentialName: {
    color: '#F8FAFC',

    fontSize: 14,
    fontWeight: '900',
  },

  staffCredentialEmail: {
    color: '#AFC0D8',

    fontSize: 11,

    marginTop: 4,
  },

  staffCredentialExisting: {
    color: '#BFDBFE',

    fontSize: 10,

    marginTop: 5,
  },

  staffCredentialLabel: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '700',

    marginTop: 7,
    marginBottom: 5,
  },

  staffCredentialInput: {
    minHeight: 43,

    backgroundColor: '#081B31',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 8,

    color: '#FFFFFF',
    fontSize: 13,

    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  staffCredentialsFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 10,
  },

  staffCredentialsCancelButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 16,
  },

  staffCredentialsCancelText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  staffCredentialsSaveButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 9,

    paddingHorizontal: 16,

    marginLeft: 8,
  },

  staffCredentialsSaveText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },
  credentialsMessageModal: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#0B1C32',
    borderWidth: 1,
    borderColor: '#315F87',
    borderRadius: 14,
    padding: 14,
  },

  credentialsMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  credentialsMessageTitle: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '900',
    marginRight: 10,
  },

  credentialsMessageClose: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 10,
  },

  credentialsMessageLoader: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },

  credentialsMessageBody: {
    maxHeight: 330,
    backgroundColor: '#102844',
    padding: 12,
  },

  credentialsMessageText: {
    color: '#F1F5F9',
    fontSize: 13,
    lineHeight: 21,
  },

  credentialsMessageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
  },

  credentialsMessageButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4E92C7',
    borderRadius: 9,
    paddingHorizontal: 14,
    marginLeft: 8,
  },

  credentialsMessageButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
  },

  identityModal: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#0B1C32',
    borderWidth: 1,
    borderColor: '#315F87',
    borderRadius: 14,
    padding: 14,
  },

  identityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  identityTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '900',
  },

  identitySearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  identitySearchBox: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102844',
    borderWidth: 1,
    borderColor: '#315F87',
    borderRadius: 9,
    paddingHorizontal: 10,
  },

  identitySearchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 7,
  },

  identityClearButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4E92C7',
    borderRadius: 9,
    paddingHorizontal: 13,
    marginLeft: 8,
  },

  identityClearText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  identitySelectAll: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },

  identitySelectAllText: {
    color: '#F1F5F9',
    fontSize: 12,
    marginLeft: 7,
  },

  identitySelectedCount: {
    color: '#AFC0D8',
    fontSize: 11,
    marginBottom: 10,
  },

  identityList: {
    maxHeight: 370,
    borderWidth: 1,
    borderColor: '#315F87',
    borderRadius: 10,
  },

  identityRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#315F87',
    paddingHorizontal: 10,
  },

  identityRole: {
    width: 105,
    color: '#DCE7F5',
    fontSize: 12,
    marginLeft: 10,
  },

  identityName: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },

  identityPagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  identityPageText: {
    color: '#AFC0D8',
    fontSize: 11,
  },

  identityPageButtons: {
    flexDirection: 'row',
  },

  identityPageButton: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4E92C7',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginLeft: 7,
  },

  identityPageButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  identityDownloadButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#173B60',
    borderWidth: 1,
    borderColor: '#4E92C7',
    borderRadius: 9,
    paddingHorizontal: 14,
    marginTop: 12,
  },

  identityDownloadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 6,
  },
});
