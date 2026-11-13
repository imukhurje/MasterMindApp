// src/screens/Admin/AdminStudents.styles.js

import { StyleSheet } from 'react-native';

const BG = '#081524';
const CARD = '#102844';
const CARD_DARK = '#0B1C32';
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
    marginTop: 10,
    color: MUTED,
    fontSize: 13,
  },

  listContent: {
    padding: 14,
    paddingBottom: 24,
  },

  summaryCard: {
    minHeight: 76,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 15,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  totalBadge: {
    minWidth: 62,
    minHeight: 54,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 12,

    paddingHorizontal: 10,
  },

  totalValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  totalLabel: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 12,
  },

  searchBox: {
    flex: 1,
    minHeight: 50,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 12,

    paddingHorizontal: 12,
  },

  searchInput: {
    flex: 1,

    color: TEXT,
    fontSize: 14,

    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  searchButton: {
    width: 50,
    height: 50,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 12,

    marginLeft: 8,
  },

  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 18,
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

  studentCard: {
    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 15,

    padding: 13,
  },

  studentTop: {
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

    borderRadius: 13,
  },

  photo: {
    width: '100%',
    height: '100%',
  },

  initials: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },

  studentInfo: {
    flex: 1,
    minWidth: 0,

    marginLeft: 12,
  },

  studentName: {
    color: TEXT,
    fontSize: 15,
    lineHeight: 20,
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

  rollBox: {
    minWidth: 48,

    alignItems: 'center',

    marginLeft: 8,
  },

  rollLabel: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
  },

  rollValue: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 3,
  },

  detailsSection: {
    marginTop: 13,

    borderTopWidth: 1,
    borderTopColor: '#234565',

    paddingTop: 10,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    marginTop: 5,
  },

  detailLabel: {
    width: 105,

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

    marginTop: 12,
  },

  statusBadge: {
    minHeight: 26,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,

    borderRadius: 13,

    paddingHorizontal: 9,

    marginRight: 7,
    marginBottom: 4,
  },

  statusBadgeText: {
    fontSize: 10,
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

  loginBadge: {
    backgroundColor: '#152C4D',
    borderColor: '#60A5FA',
  },

  loginBadgeText: {
    color: '#BFDBFE',
  },

  separator: {
    height: 10,
  },

  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',

    minHeight: 180,

    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 15,

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
    fontSize: 12,
    marginTop: 6,
  },

  loadMoreButton: {
    minHeight: 48,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 11,

    marginTop: 14,
  },

  loadMoreText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  footerSpace: {
    height: 18,
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.5,
  },

  filtersRow: {
    marginTop: 12,
  },

  filterField: {
    marginBottom: 10,
  },

  filterLabel: {
    color: '#AFC0D8',
    fontSize: 12,
    fontWeight: '800',

    marginBottom: 6,
  },

  dropdown: {
    minHeight: 50,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 12,

    paddingHorizontal: 12,
  },

  dropdownContainer: {
    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    overflow: 'hidden',
  },

  dropdownSelectedText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },

  dropdownPlaceholder: {
    color: '#F8FAFC',
    fontSize: 14,
  },

  dropdownItemText: {
    color: '#F8FAFC',
    fontSize: 14,
  },

  summaryActionRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

    marginRight: 10,
  },

  primaryHeaderButton: {
    flex: 1,
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 10,

    paddingHorizontal: 8,

    marginRight: 7,
  },

  primaryHeaderButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',

    marginLeft: 5,
  },

  secondaryHeaderButton: {
    flex: 1.15,
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 7,
  },

  secondaryHeaderButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',

    marginLeft: 5,
  },

  studentActions: {
    marginTop: 14,
  },

  topActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  bottomActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },

  editButton: {
    minHeight: 38,
    minWidth: 72,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 12,

    paddingHorizontal: 16,
    marginLeft: 8,
  },

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  deleteButton: {
    minHeight: 38,
    minWidth: 78,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#E45454',

    borderWidth: 1,
    borderColor: '#EF6B6B',

    borderRadius: 12,

    paddingHorizontal: 16,
    marginLeft: 8,
  },

  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  credentialsButton: {
    flex: 1,
    minHeight: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#17304C',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 12,

    paddingHorizontal: 14,
  },

  credentialsButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },

  iconOnlyButton: {
    width: 46,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#17304C',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 12,

    marginLeft: 10,
  },

  correctionBox: {
    marginTop: 10,

    backgroundColor: '#2A1830',

    borderWidth: 1,
    borderColor: '#D9467A',

    borderRadius: 9,

    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  correctionText: {
    color: '#F8D7E3',
    fontSize: 11,
    lineHeight: 16,
  },

  correctionTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  credentialsModalBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.72)',

    paddingHorizontal: 14,
  },

  credentialsModal: {
    width: '100%',
    maxHeight: '86%',

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#315F87',

    borderRadius: 16,

    padding: 14,

    position: 'relative',
  },

  credentialsRowsScroll: {
    maxHeight: 470,
    marginTop: 10,
  },

  credentialsRowsContent: {
    paddingBottom: 4,
  },

  credentialsModalTitle: {
    color: '#FFFFFF',

    fontSize: 17,
    fontWeight: '900',

    paddingRight: 48,
  },

  credentialsModalSubtitle: {
    color: '#AFC0D8',

    fontSize: 11,
    lineHeight: 16,

    marginTop: 6,

    paddingRight: 48,
  },

  credentialsCloseIcon: {
    position: 'absolute',

    top: 12,
    right: 12,

    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#E45454',

    borderRadius: 10,

    zIndex: 10,
    elevation: 10,
  },

  credentialsLoader: {
    minHeight: 180,

    alignItems: 'center',
    justifyContent: 'center',
  },

  credentialsLoadingText: {
    color: '#AFC0D8',

    fontSize: 12,

    marginTop: 10,
  },

  credentialStudentCard: {
    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 13,

    padding: 12,

    marginTop: 14,
  },

  credentialStudentInfo: {
    marginBottom: 13,
  },

  credentialStudentName: {
    color: '#FFFFFF',

    fontSize: 15,
    fontWeight: '900',
  },

  credentialStudentMeta: {
    color: '#DCE7F5',

    fontSize: 12,

    marginTop: 4,
  },

  credentialExistingText: {
    color: '#AFC0D8',

    fontSize: 11,

    marginTop: 5,
  },

  credentialNewText: {
    color: '#86EFAC',

    fontSize: 11,

    marginTop: 5,
  },

  credentialField: {
    marginBottom: 12,
  },

  credentialLabel: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '800',

    marginBottom: 6,
  },

  credentialInput: {
    minHeight: 46,

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    color: '#FFFFFF',

    fontSize: 13,

    paddingHorizontal: 12,
  },

  credentialPostSaveActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 2,
  },

  credentialActionButton: {
    width: 46,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    marginLeft: 8,
  },

  credentialsSuccessBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    backgroundColor: '#0C332A',

    borderWidth: 1,
    borderColor: '#16866A',

    borderRadius: 10,

    padding: 10,

    marginTop: 12,
  },

  credentialsSuccessText: {
    flex: 1,

    color: '#D1FAE5',

    fontSize: 11,
    lineHeight: 16,

    marginLeft: 7,
  },

  credentialsFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 14,
  },

  credentialsCancelButton: {
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 18,

    marginRight: 8,
  },

  credentialsCancelText: {
    color: '#FFFFFF',

    fontSize: 13,
    fontWeight: '900',
  },

  credentialsSaveButton: {
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#3B82F6',

    borderRadius: 10,

    paddingHorizontal: 18,
  },

  credentialsSaveText: {
    color: '#FFFFFF',

    fontSize: 13,
    fontWeight: '900',
  },

  credentialsMessageBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.72)',

    paddingHorizontal: 14,
  },

  credentialsMessageModal: {
    width: '100%',
    maxHeight: '78%',

    position: 'relative',

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#315F87',

    borderRadius: 16,

    padding: 14,
  },

  credentialsMessageTitle: {
    color: '#FFFFFF',

    fontSize: 16,
    fontWeight: '900',

    paddingRight: 50,
    marginBottom: 12,
  },

  credentialsMessageClose: {
    position: 'absolute',

    top: 10,
    right: 10,

    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#E45454',

    borderRadius: 10,

    zIndex: 10,
    elevation: 10,
  },

  credentialsMessageLoader: {
    minHeight: 200,

    alignItems: 'center',
    justifyContent: 'center',
  },

  credentialsMessageBody: {
    maxHeight: 360,

    backgroundColor: '#10203A',

    borderRadius: 8,
  },

  credentialsMessageBodyContent: {
    padding: 12,
  },

  credentialsMessageText: {
    color: '#F1F5F9',

    fontSize: 13,
    lineHeight: 22,
  },

  credentialsMessageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 14,
  },

  credentialsMessageButton: {
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 14,

    marginLeft: 8,
  },

  credentialsMessageButtonText: {
    color: '#FFFFFF',

    fontSize: 13,
    fontWeight: '900',

    marginLeft: 6,
  },
  studentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  studentCheckButton: {
    width: 28,
    height: 28,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 7,

    marginRight: 5,
  },

  studentCheckButtonSelected: {
    backgroundColor: '#173B60',
  },
  bulkActionBar: {
    minHeight: 54,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#0D2038',

    borderWidth: 1,
    borderColor: '#315F87',

    borderRadius: 12,

    paddingHorizontal: 10,
    paddingVertical: 7,

    marginTop: 10,
  },

  bulkActionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    marginRight: 10,
  },

  bulkSelectButton: {
    minHeight: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  bulkSelectButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  selectedCountText: {
    color: '#AFC0D8',

    fontSize: 11,
    fontWeight: '700',

    marginLeft: 10,

    textAlign: 'left',
  },

  generateCredentialsButton: {
    minHeight: 38,
    minWidth: 132,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  generateCredentialsButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  studentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  studentCheckButton: {
    width: 28,
    height: 28,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 7,

    marginRight: 5,
  },

  studentCheckButtonSelected: {
    backgroundColor: '#173B60',
  },
  detailsAndSelectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  detailsLeft: {
    flex: 1,
    minWidth: 0,
  },

  studentCheckSideButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#142B49',
    alignItems: 'center',
    justifyContent: 'center',
  },

  studentCheckSideButtonSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
  },
  selectionOnlyRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
  },

  subjectCombinationSection: {
    marginTop: 10,
    gap: 7,
  },

  subjectCombinationLabel: {
    color: '#AFC0D8',
    fontSize: 10,
    fontWeight: '700',
  },

  subjectCombinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  subjectCombinationValue: {
    flexShrink: 1,
    maxWidth: '100%',
    minHeight: 38,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 20,
    backgroundColor: '#142B49',
    paddingLeft: 12,
    paddingRight: 8,
  },

  subjectCombinationText: {
    color: '#E2E8F0',
    fontSize: 11,
  },

  subjectCombinationEditButton: {
    width: 40,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },

  subjectCombinationEditText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },

  combinationModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 16,
  },

  combinationModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  combinationModalCard: {
    width: '100%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 14,
    backgroundColor: '#0B1C32',
    padding: 15,
  },

  combinationModalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  combinationModalTitle: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '900',
  },

  combinationCloseButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#DC3545',
  },

  combinationCloseText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },

  combinationClassText: {
    color: '#AFC0D8',
    fontSize: 12,
    marginTop: 10,
  },

  combinationFieldLabel: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },

  combinationOptionsList: {
    flexGrow: 0,
    maxHeight: 250,
  },

  combinationOption: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 9,
    backgroundColor: '#142B49',
    paddingHorizontal: 11,
    paddingVertical: 10,
    marginBottom: 7,
    gap: 10,
  },

  combinationOptionSelected: {
    borderColor: '#7DD3FC',
    backgroundColor: 'rgba(37,99,235,0.25)',
  },

  combinationOptionText: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 12,
  },

  combinationRadio: {
    color: '#7DD3FC',
    fontSize: 20,
  },

  combinationEmptyText: {
    color: '#94A3B8',
    fontSize: 11,
    paddingVertical: 15,
  },

  combinationModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 9,
    marginTop: 16,
  },

  combinationCancelButton: {
    minHeight: 42,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#142B49',
  },

  combinationSaveButton: {
    minWidth: 75,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#2563EB',
  },

  combinationButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
