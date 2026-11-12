// src/screens/Admin/Administrators/AdminAdministrators.styles.js

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

  adminCard: {
    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 12,
  },

  adminTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 76,
    height: 76,

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

  adminInfo: {
    flex: 1,
    minWidth: 0,

    marginLeft: 11,
  },

  adminName: {
    color: TEXT,

    fontSize: 15,
    fontWeight: '900',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 6,
  },

  infoText: {
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
    width: 78,

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

  adminActions: {
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
    opacity: 0.4,
  },

  footerSpace: {
    height: 20,
  },
  createAdminBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.72)',

    paddingHorizontal: 12,
    paddingVertical: 18,
  },

  createAdminModal: {
    width: '100%',
    maxHeight: '92%',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 16,

    overflow: 'hidden',
  },

  createAdminContent: {
    padding: 15,
  },

  createAdminHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 8,
  },

  createAdminTitle: {
    color: '#F8FAFC',

    fontSize: 17,
    fontWeight: '900',
  },

  createAdminCloseButton: {
    width: 39,
    height: 39,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  createAdminLabel: {
    color: '#DCE7F5',

    fontSize: 12,
    fontWeight: '700',

    marginTop: 13,
    marginBottom: 7,
  },

  createAdminInput: {
    minHeight: 49,

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    color: '#FFFFFF',
    fontSize: 14,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  photoPicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  photoPreviewCircle: {
    width: 52,
    height: 52,

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 26,
  },

  createAdminPhoto: {
    width: '100%',
    height: '100%',
  },

  photoInitial: {
    color: '#FFFFFF',

    fontSize: 17,
    fontWeight: '900',
  },

  photoFileArea: {
    flex: 1,
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#254C72',

    borderRadius: 8,

    marginLeft: 10,

    paddingHorizontal: 10,
  },

  photoFileText: {
    flex: 1,

    color: '#FFFFFF',

    fontSize: 12,

    marginLeft: 7,
  },

  createAdminDropdown: {
    minHeight: 49,

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  createAdminDropdownContainer: {
    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    overflow: 'hidden',
  },

  createAdminDropdownText: {
    color: '#F8FAFC',

    fontSize: 14,
    fontWeight: '600',
  },

  createAdminDropdownItemText: {
    color: '#F8FAFC',
    fontSize: 13,
  },

  createAdminDropdownPlaceholder: {
    color: '#718096',
    fontSize: 14,
  },

  locationBox: {
    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    overflow: 'hidden',
  },

  locationSearchBox: {
    minHeight: 45,

    flexDirection: 'row',
    alignItems: 'center',

    borderBottomWidth: 1,
    borderBottomColor: '#315F87',

    paddingHorizontal: 10,
  },

  locationSearchInput: {
    flex: 1,

    color: '#FFFFFF',
    fontSize: 13,

    paddingHorizontal: 8,
  },

  locationOption: {
    minHeight: 43,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 11,
  },

  locationOptionSelected: {
    backgroundColor: '#173B60',
  },

  locationOptionText: {
    color: '#F8FAFC',

    fontSize: 12,

    marginLeft: 8,
  },

  locationStatusText: {
    color: '#AFC0D8',

    fontSize: 11,

    marginTop: 8,
  },

  locationHelpText: {
    color: '#AFC0D8',

    fontSize: 11,
    lineHeight: 16,

    marginTop: 5,
  },

  superAdminHelp: {
    color: '#AFC0D8',

    fontSize: 11,
    lineHeight: 16,

    marginTop: 10,
  },

  createAdminActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 18,
  },

  createAdminCancelButton: {
    minHeight: 43,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 17,

    marginRight: 8,
  },

  createAdminCancelText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  createAdminCreateButton: {
    minWidth: 82,
    minHeight: 43,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 9,

    paddingHorizontal: 17,
  },

  createAdminCreateText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  adminCredentialsBackdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.72)',

    paddingHorizontal: 13,
    paddingVertical: 20,
  },

  adminCredentialsModal: {
    width: '100%',
    maxHeight: '88%',

    backgroundColor: '#0D2038',

    borderWidth: 1,
    borderColor: '#3B7197',

    borderRadius: 15,

    padding: 14,
  },

  adminCredentialsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    marginBottom: 12,
  },

  adminCredentialsHeaderText: {
    flex: 1,
    minWidth: 0,

    paddingRight: 10,
  },

  adminCredentialsTitle: {
    color: '#F8FAFC',

    fontSize: 16,
    fontWeight: '900',
  },

  adminCredentialsSubtitle: {
    color: '#AFC0D8',

    fontSize: 11,
    lineHeight: 16,

    marginTop: 4,
  },

  adminCredentialsCloseButton: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  adminCredentialsLoader: {
    minHeight: 160,

    alignItems: 'center',
    justifyContent: 'center',
  },

  adminCredentialsLoadingText: {
    color: '#AFC0D8',

    fontSize: 12,

    marginTop: 9,
  },

  adminCredentialsRows: {
    maxHeight: 430,
  },

  adminCredentialCard: {
    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 12,

    padding: 12,

    marginBottom: 9,
  },

  adminCredentialIdentity: {
    marginBottom: 10,
  },

  adminCredentialName: {
    color: '#F8FAFC',

    fontSize: 14,
    fontWeight: '900',
  },

  adminCredentialEmail: {
    color: '#AFC0D8',

    fontSize: 11,

    marginTop: 3,
  },

  adminCredentialExistingText: {
    color: '#FDE68A',

    fontSize: 10,

    marginTop: 5,
  },

  adminCredentialNewText: {
    color: '#86EFAC',

    fontSize: 10,

    marginTop: 5,
  },

  adminCredentialLabel: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '800',

    marginTop: 8,
    marginBottom: 5,
  },

  adminCredentialInput: {
    minHeight: 46,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    color: '#FFFFFF',
    fontSize: 13,

    paddingHorizontal: 11,
    paddingVertical: 9,
  },

  adminCredentialsFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 12,
  },

  adminCredentialsCancelButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 16,

    marginRight: 8,
  },

  adminCredentialsCancelText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  adminCredentialsSaveButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 9,

    paddingHorizontal: 16,
  },

  adminCredentialsSaveText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },
  credentialsMessageBackdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.72)',

    paddingHorizontal: 13,
    paddingVertical: 20,
  },

  credentialsMessageModal: {
    width: '100%',
    maxHeight: '82%',

    backgroundColor: '#0D2038',

    borderWidth: 1,
    borderColor: '#3B7197',

    borderRadius: 15,

    padding: 14,
  },

  credentialsMessageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    marginBottom: 12,
  },

  credentialsMessageTitle: {
    flex: 1,

    color: '#F8FAFC',

    fontSize: 16,
    lineHeight: 21,

    fontWeight: '900',

    paddingRight: 10,
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
    minHeight: 180,

    alignItems: 'center',
    justifyContent: 'center',
  },

  credentialsMessageLoadingText: {
    color: '#AFC0D8',

    fontSize: 12,

    marginTop: 9,
  },

  credentialsMessageBody: {
    maxHeight: 340,

    backgroundColor: '#102844',
  },

  credentialsMessageBodyContent: {
    padding: 12,
  },

  credentialsMessageText: {
    color: '#F8FAFC',

    fontSize: 13,
    lineHeight: 22,
  },

  credentialsMessageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 12,
  },

  credentialsMessageButton: {
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 14,

    marginLeft: 8,
  },

  credentialsMessageButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',

    marginLeft: 6,
  },
  identityCardsBackdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.72)',

    paddingHorizontal: 12,
    paddingVertical: 18,
  },

  identityCardsModal: {
    width: '100%',
    maxHeight: '90%',

    backgroundColor: '#0D2038',

    borderWidth: 1,
    borderColor: '#3B7197',

    borderRadius: 15,

    padding: 14,
  },

  identityCardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 12,
  },

  identityCardsTitle: {
    color: '#F8FAFC',

    fontSize: 17,
    fontWeight: '900',
  },

  identityCardsCloseButton: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  identityCardsSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 12,
  },

  identityCardsSearchBox: {
    flex: 1,
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 9,
  },

  identityCardsSearchInput: {
    flex: 1,

    color: '#FFFFFF',
    fontSize: 12,

    paddingHorizontal: 7,
  },

  identityCardsSearchButton: {
    minWidth: 70,
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    marginLeft: 7,
  },

  identityCardsSearchButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  identityCardsClearButton: {
    minWidth: 64,
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    marginLeft: 7,
  },

  identityCardsClearButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  identityCardsLoader: {
    minHeight: 230,

    alignItems: 'center',
    justifyContent: 'center',
  },

  identityCardsLoadingText: {
    color: '#AFC0D8',
    fontSize: 12,
    marginTop: 9,
  },

  identityCardsSelectAll: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 7,
  },

  identityCardsSelectAllText: {
    color: '#F8FAFC',

    fontSize: 12,

    marginLeft: 6,
  },

  identityCardsSelectedText: {
    color: '#AFC0D8',

    fontSize: 11,

    marginBottom: 10,
  },

  identityCardsTable: {
    borderWidth: 1,
    borderColor: '#3B7197',

    borderRadius: 11,

    overflow: 'hidden',
  },

  identityCardsTableHeader: {
    minHeight: 43,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#20456E',

    paddingHorizontal: 9,
  },

  identityCardsRows: {
    maxHeight: 300,
  },

  identityCardRow: {
    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',

    borderTopWidth: 1,
    borderTopColor: '#315F87',

    paddingHorizontal: 9,
  },

  identityCheckboxColumn: {
    width: 34,

    alignItems: 'center',
  },

  identityRoleColumn: {
    width: 90,
  },

  identityNameColumn: {
    flex: 1,
  },

  identityTableHeaderText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  identityCardCell: {
    color: '#E2E8F0',

    fontSize: 12,
  },

  identityCardsEmptyText: {
    color: '#AFC0D8',

    fontSize: 12,

    textAlign: 'center',

    paddingVertical: 24,
  },

  identityPaginationRow: {
    marginTop: 12,
  },

  identityPaginationText: {
    color: '#AFC0D8',

    fontSize: 11,
  },

  identityPaginationButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 8,
  },

  identityPageButton: {
    minHeight: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 13,

    marginLeft: 7,
  },

  identityPageButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  identityCardsFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 12,
  },

  identityDownloadButton: {
    minHeight: 43,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 14,
  },

  identityDownloadButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',

    marginLeft: 6,
  },
});
