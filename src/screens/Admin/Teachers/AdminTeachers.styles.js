import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#142B49';
const CARD_DARK = '#0B1C32';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';
const PRIMARY = '#2563EB';
const DANGER = '#EF4444';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  centeredScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG,
  },

  loadingText: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
  },

  // =========================
  // Header
  // =========================

  headerCard: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 43, 73, 0.60)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },

  headerTextSection: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
  },

  pageSubtitle: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  countBadge: {
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 10,
  },

  countBadgeText: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
  },

  addTeacherButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 13,
  },

  addTeacherButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
  },

  // =========================
  // Search
  // =========================

  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 43, 73, 0.48)',
    padding: 10,
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD_DARK,
    color: TEXT,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  searchButton: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderRadius: 9,
    backgroundColor: CARD,
    paddingHorizontal: 13,
  },

  searchButtonText: {
    color: TEXT,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
  },

  clearButton: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 12,
  },

  clearButtonText: {
    color: TEXT,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
  },

  // =========================
  // List
  // =========================

  listContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 43, 73, 0.28)',
    overflow: 'hidden',
  },

  listContent: {
    padding: 10,
  },

  columnWrapper: {
    gap: 10,
  },

  // =========================
  // Teacher Card
  // =========================

  teacherCard: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: CARD_DARK,
    overflow: 'hidden',
    marginBottom: 11,
  },

  teacherDetails: {
    flex: 1,
    padding: 13,
  },

  teacherProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },

  teacherAvatarSection: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: '#4F6482',
    overflow: 'hidden',
  },

  teacherPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 11,
  },

  teacherInitials: {
    color: '#EAF2FF',
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '900',
  },

  teacherIdentity: {
    flex: 1,
    minWidth: 0,
  },

  teacherName: {
    color: TEXT,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
  },

  teacherEmail: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },

  designationBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.45)',
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 7,
  },

  designationBadgeText: {
    color: '#93C5FD',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
  },

  // =========================
  // Teacher Information
  // =========================

  infoSection: {
    marginTop: 12,
    gap: 7,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoLabel: {
    width: 82,
    flexShrink: 0,
    color: '#9FB3CC',
    fontSize: 11,
    lineHeight: 17,
    fontWeight: '800',
  },

  infoValue: {
    flex: 1,
    color: '#E2EAF5',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },

  moreText: {
    color: '#60A5FA',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '900',
  },

  bioText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },

  // =========================
  // Actions
  // =========================

  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 7,
    marginTop: 14,
  },

  credentialsButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderRadius: 9,
    backgroundColor: 'rgba(20, 43, 73, 0.80)',
    paddingHorizontal: 12,
  },

  credentialsButtonText: {
    color: '#E2EAF5',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
  },

  securityButton: {
    width: 44,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderRadius: 9,
    backgroundColor: 'rgba(20, 43, 73, 0.80)',
  },

  editButton: {
    minWidth: 72,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderRadius: 9,
    backgroundColor: 'rgba(20, 43, 73, 0.80)',
    paddingHorizontal: 13,
  },

  editButtonText: {
    color: TEXT,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
  },

  deleteButton: {
    minWidth: 78,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: DANGER,
    paddingHorizontal: 13,
  },

  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
  },

  // =========================
  // Empty State
  // =========================

  emptyListContent: {
    flexGrow: 1,
  },

  emptyState: {
    flex: 1,
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  emptyStateTitle: {
    color: TEXT,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },

  emptyStateText: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },

  // =========================
  // Pagination
  // =========================

  loadMoreButton: {
    alignSelf: 'center',
    minWidth: 120,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 10,
  },

  loadMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.42,
  },

  hiddenMetadata: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },

  topActionsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: 10,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 14,
  },

  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  identityCardsButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2563EB',
    borderRadius: 9,
  },

  identityCardsButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  teacherCountBadge: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 20,
  },

  teacherCountText: {
    color: '#DCE7F5',
    fontSize: 10,
    fontWeight: '700',
  },

  addTeacherButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 10,
    backgroundColor: '#2563EB',
    borderRadius: 9,
  },

  addTeacherButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  pressed: {
    opacity: 0.78,
  },

  credentialsModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 12,
  },

  credentialsModalCard: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 15,
    backgroundColor: '#0B1528',
    padding: 15,
  },

  credentialsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingBottom: 12,
  },

  credentialsModalTitle: {
    flex: 1,
    color: '#E2EAF5',
    fontSize: 15,
    fontWeight: '900',
  },

  credentialsCloseButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#D94B50',
  },

  credentialsMessageContainer: {
    minHeight: 200,
    maxHeight: 300,
    backgroundColor: '#101D35',
    padding: 10,
  },

  credentialsMessageText: {
    color: '#E2EAF5',
    fontSize: 13,
    lineHeight: 23,
  },

  credentialsModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },

  credentialsCopyButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
    backgroundColor: '#102B48',
    paddingHorizontal: 13,
  },

  credentialsSendButton: {
    minHeight: 40,
    minWidth: 105,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
    backgroundColor: '#102B48',
    paddingHorizontal: 13,
  },

  credentialsFooterButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  securityModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    paddingHorizontal: 12,
    paddingVertical: 20,
  },

  securityModalCard: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    backgroundColor: '#0B1528',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 15,
    padding: 14,
  },

  securityModalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 15,
  },

  securityModalHeaderText: {
    flex: 1,
  },

  securityModalTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 23,
  },

  securityModalSubtitle: {
    color: '#AFC0D8',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  securityModalClose: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D94B50',
    borderRadius: 10,
  },

  securityLoadingContainer: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  securityLoadingText: {
    color: '#AFC0D8',
    fontSize: 12,
  },

  securityTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#203E60',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: '#3B7197',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  securityTableHeading: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },

  securityTableBody: {
    backgroundColor: '#101D35',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#3B7197',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 10,
    gap: 12,
  },

  securityTeacherInfo: {
    gap: 3,
  },

  securityTeacherName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
  },

  securityTeacherEmail: {
    color: '#AFC0D8',
    fontSize: 11,
  },

  securityExistingText: {
    color: '#FBBF24',
    fontSize: 11,
    marginTop: 3,
  },

  securityNewText: {
    color: '#86EFAC',
    fontSize: 11,
    marginTop: 3,
  },

  securityInputSection: {
    gap: 5,
  },

  securityInputLabel: {
    color: '#AFC0D8',
    fontSize: 11,
    fontWeight: '700',
  },

  securityInput: {
    minHeight: 42,
    backgroundColor: '#0B1C32',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 8,
    paddingHorizontal: 11,
    fontSize: 13,
  },

  securityPasswordBox: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B1C32',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 8,
  },

  securityPasswordInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },

  securityEyeButton: {
    width: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  securityModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 17,
  },

  securityCancelButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
  },

  securityCancelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  securitySaveButton: {
    minHeight: 40,
    minWidth: 130,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
    backgroundColor: '#2563EB',
    borderRadius: 9,
  },

  securitySaveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  teacherBulkActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  teacherBulkButton: {
    flexGrow: 1,
    minHeight: 44,
    paddingHorizontal: 10,
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  teacherBulkButtonText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },

  bulkModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.82)',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 20,
  },

  bulkModalCard: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: '#0B162B',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 15,
    overflow: 'hidden',
  },

  bulkModalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    backgroundColor: '#101F39',
  },

  bulkModalTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },

  bulkModalSubtitle: {
    color: '#AFC0D8',
    fontSize: 11,
    lineHeight: 18,
    marginTop: 5,
  },

  bulkCloseButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#3B7197',
    backgroundColor: '#142B49',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bulkLoading: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  bulkModalScroll: {
    flexShrink: 1,
  },

  bulkModalContent: {
    padding: 12,
    paddingBottom: 20,
    gap: 12,
  },

  bulkTeacherCard: {
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },

  bulkTeacherName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },

  bulkTeacherEmail: {
    color: '#AFC0D8',
    fontSize: 11,
  },

  bulkExistingText: {
    color: '#FBBF24',
    fontSize: 11,
  },

  bulkNewText: {
    color: '#86EFAC',
    fontSize: 11,
  },

  bulkInputLabel: {
    color: '#AFC0D8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },

  bulkInput: {
    minHeight: 44,
    backgroundColor: '#0B1C32',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    paddingHorizontal: 11,
    color: '#FFFFFF',
    fontSize: 13,
  },

  bulkPasswordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#0B1C32',
  },

  bulkPasswordInput: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 11,
    color: '#FFFFFF',
    fontSize: 13,
  },

  bulkEyeButton: {
    width: 42,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bulkModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 9,
    padding: 12,
    backgroundColor: '#101F39',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },

  bulkCancelButton: {
    minHeight: 42,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#142B49',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bulkSaveButton: {
    minHeight: 42,
    paddingHorizontal: 15,
    borderRadius: 9,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bulkButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  teacherNameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },

  draftBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#B45363',
    borderRadius: 20,
    backgroundColor: '#3A1D2B',
  },

  draftBadgeText: {
    color: '#FBC2CB',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
