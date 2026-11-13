import { StyleSheet } from 'react-native';

const BORDER = '#3B7197';
const CARD = '#142B49';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';

export default StyleSheet.create({
  container: {
    gap: 16,
    paddingVertical: 14,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },

  headerText: {
    flex: 1,
    gap: 6,
  },

  title: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '800',
  },

  subtitle: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 19,
  },

  addButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  addButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '700',
  },

  filtersSection: {
    gap: 12,
  },

  filterField: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },

  filterLabel: {
    color: TEXT,
    fontSize: 12,
  },

  searchInput: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 150,
    minHeight: 43,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: '#0B1C32',
    color: TEXT,
    paddingHorizontal: 12,
    fontSize: 12,
  },

  searchButton: {
    width: 43,
    height: 43,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageSizeSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },

  pageSizeButton: {
    minWidth: 78,
    minHeight: 40,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: '#0B1C32',
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  pageSizeText: {
    color: TEXT,
    fontSize: 12,
  },

  pageSizeOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },

  pageSizeOption: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    backgroundColor: CARD,
  },

  dateFiltersRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  dateFilter: {
    flexGrow: 1,
    gap: 7,
    minWidth: 140,
  },

  dateButton: {
    minHeight: 43,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#0B1C32',
    borderRadius: 9,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  dateText: {
    color: TEXT,
    fontSize: 12,
  },

  dateNoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },

  dateNote: {
    color: MUTED,
    fontSize: 11,
  },

  clearText: {
    color: '#7DD3FC',
    fontSize: 12,
    fontWeight: '700',
  },

  table: {
    width: 860,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
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

  headerCell: {
    fontSize: 12,
    color: TEXT,
    fontWeight: '800',
    paddingHorizontal: 10,
  },

  tableRow: {
    minHeight: 63,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
  },

  cellText: {
    fontSize: 12,
    color: TEXT,
    paddingHorizontal: 10,
  },

  dateCell: {
    width: 112,
  },

  typeCell: {
    width: 95,
  },

  accountCell: {
    width: 175,
  },

  cashCell: {
    width: 90,
  },

  amountCell: {
    width: 115,
  },

  statusCell: {
    width: 100,
    paddingHorizontal: 10,
  },

  actionsCell: {
    width: 170,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 6,
  },

  statusText: {
    color: MUTED,
    fontSize: 12,
  },

  approvedText: {
    color: '#86EFAC',
    fontWeight: '700',
  },

  editButton: {
    height: 35,
    width: 35,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButton: {
    height: 35,
    width: 35,
    backgroundColor: '#DC3545',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  historyButton: {
    minHeight: 35,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },

  historyButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT,
  },

  emptyState: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  emptyText: {
    fontSize: 12,
    color: MUTED,
  },

  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 10,
  },

  pageButton: {
    minHeight: 38,
    paddingHorizontal: 12,
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pageButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '700',
  },

  disabledButton: {
    opacity: 0.4,
  },

  paginationText: {
    color: TEXT,
    fontSize: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 20,
  },

  calendarCard: {
    backgroundColor: CARD,
    padding: 15,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
  },

  calendarTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },

  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 9,
    marginTop: 12,
  },

  closeButtonText: {
    color: TEXT,
    fontWeight: '700',
    fontSize: 12,
  },
  mobileList: {
    gap: 12,
  },

  mobileCard: {
    backgroundColor: '#0B162B',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 14,
    padding: 12,
  },

  mobileCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  mobileCardTopLeft: {
    flex: 1,
    paddingRight: 10,
  },

  mobileDate: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },

  mobileType: {
    color: '#AFC0D8',
    fontSize: 12,
    marginTop: 4,
  },

  mobileStatus: {
    color: '#AFC0D8',
    fontSize: 12,
    fontWeight: '700',
  },

  mobileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
    gap: 12,
  },

  mobileLabel: {
    color: '#AFC0D8',
    fontSize: 12,
    flex: 1,
  },

  mobileValue: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
    flex: 1.4,
    textAlign: 'right',
  },

  mobileAmount: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
    flex: 1.4,
    textAlign: 'right',
  },

  mobileActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 8,
  },

  mobileEditButton: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#142B49',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  mobileDeleteButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    backgroundColor: '#DC3545',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  mobileHistoryButton: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#142B49',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mobileActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  mobileHistoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  entryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.78)',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 22,
  },

  entryModalCard: {
    width: '100%',
    maxWidth: 680,
    maxHeight: '95%',
    alignSelf: 'center',
    backgroundColor: '#0B162B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3B7197',
    overflow: 'hidden',
  },

  entryModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    backgroundColor: '#101F39',
  },

  entryModalTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },

  entryModalSubtitle: {
    color: '#AFC0D8',
    fontSize: 12,
    marginTop: 5,
  },

  entryModalClose: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#3B7197',
  },

  entryModalScroll: {
    flexShrink: 1,
  },

  entryModalContent: {
    padding: 15,
    gap: 16,
    paddingBottom: 24,
  },

  entryFormGroup: {
    gap: 8,
  },

  entryFormLabel: {
    color: '#AFC0D8',
    fontSize: 12,
    fontWeight: '600',
  },

  entryInputRow: {
    minHeight: 47,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#0F203C',
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 9,
  },

  entryInputText: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 12,
  },

  entryTextInput: {
    minHeight: 47,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#0F203C',
    color: '#F8FAFC',
    fontSize: 13,
    paddingHorizontal: 12,
  },

  entryRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },

  entryRadioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  entryRadioText: {
    color: '#F8FAFC',
    fontSize: 13,
  },

  entryHelperText: {
    color: '#AFC0D8',
    fontSize: 11,
    lineHeight: 18,
  },

  entryDropdown: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#142B49',
    overflow: 'hidden',
  },

  entryDropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#294967',
  },

  entryDropdownText: {
    color: '#F8FAFC',
    fontSize: 12,
  },

  entryApproveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    minHeight: 30,
  },

  entryModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 9,
    padding: 12,
    backgroundColor: '#101F39',
    borderTopWidth: 1,
    borderTopColor: '#294967',
  },

  entryCancelButton: {
    paddingHorizontal: 14,
    minHeight: 41,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#142B49',
  },

  entrySaveButton: {
    paddingHorizontal: 15,
    minHeight: 41,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
    backgroundColor: '#2563EB',
  },

  entryFooterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  simpleActionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.82)',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 20,
  },

  simpleActionCard: {
    width: '100%',
    maxWidth: 680,
    maxHeight: '85%',
    alignSelf: 'center',
    backgroundColor: '#0B162B',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 16,
    padding: 15,
    gap: 17,
  },

  simpleActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  simpleActionTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },

  simpleActionClose: {
    width: 38,
    height: 38,
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  simpleActionLoading: {
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  simpleActionMuted: {
    color: '#AFC0D8',
    fontSize: 12,
    lineHeight: 19,
  },

  deleteDescription: {
    color: '#E2E8F0',
    fontSize: 12,
    lineHeight: 21,
  },

  deleteFieldGroup: {
    gap: 7,
  },

  deleteFieldLabel: {
    color: '#AFC0D8',
    fontSize: 12,
    fontWeight: '600',
  },

  deleteReasonInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#7DD3FC',
    borderRadius: 10,
    backgroundColor: '#0F203C',
    paddingHorizontal: 12,
    paddingTop: 12,
    color: '#F8FAFC',
    fontSize: 13,
  },

  simpleActionFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 4,
  },

  simpleCancelButton: {
    minHeight: 40,
    paddingHorizontal: 15,
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  simpleDeleteButton: {
    minHeight: 40,
    paddingHorizontal: 15,
    backgroundColor: '#DC3545',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  simpleActionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  simpleButtonDisabled: {
    opacity: 0.45,
  },

  historyVerticalScroll: {
    flexGrow: 0,
    flexShrink: 1,
    maxHeight: 380,
  },

  historyTable: {
    width: 600,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    overflow: 'hidden',
  },

  historyTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D3B5C',
    minHeight: 46,
  },

  historyHeaderText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
  },

  historyTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 49,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    backgroundColor: '#0B162B',
  },

  historyCellText: {
    color: '#E2E8F0',
    fontSize: 12,
    paddingHorizontal: 10,
  },

  mobileHistoryScroll: {
    flexGrow: 0,
    flexShrink: 1,
    maxHeight: 420,
  },

  mobileHistoryList: {
    gap: 10,
    paddingBottom: 8,
  },

  mobileHistoryCard: {
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 11,
    padding: 12,
    gap: 11,
  },

  mobileHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  mobileHistoryDate: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },

  mobileHistoryBadge: {
    borderWidth: 1,
    borderColor: '#3B7197',
    backgroundColor: '#0B1C32',
    borderRadius: 16,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  mobileHistoryBadgeText: {
    color: '#7DD3FC',
    fontSize: 11,
    fontWeight: '700',
  },

  mobileHistoryDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  mobileHistoryLabel: {
    color: '#AFC0D8',
    fontSize: 11,
    flex: 1,
  },

  mobileHistoryValue: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1.3,
  },
});
