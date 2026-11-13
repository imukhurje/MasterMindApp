import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    paddingBottom: 25,
  },

  filterCard: {
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 14,
    padding: 10,
    gap: 9,
  },

  statusSelect: {
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3B7197',
    backgroundColor: '#0B1C32',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusSelectText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },

  statusOptions: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3B7197',
    backgroundColor: '#0B1C32',
    overflow: 'hidden',
  },

  statusOption: {
    paddingVertical: 12,
    paddingHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#253E59',
  },

  statusOptionText: {
    color: '#E2E8F0',
    fontSize: 12,
  },

  dateRow: {
    flexDirection: 'row',
    gap: 8,
  },

  dateInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    backgroundColor: '#0B1C32',
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 11,
  },

  searchInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#0B1C32',
    color: '#F8FAFC',
    paddingHorizontal: 12,
    fontSize: 12,
  },

  filterButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },

  searchButton: {
    minHeight: 38,
    paddingHorizontal: 17,
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 9,
  },

  clearButton: {
    minHeight: 38,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#0B1C32',
  },

  refreshButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#142B49',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#3B7197',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  filterNote: {
    color: '#94A3B8',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 8,
  },

  paginationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 9,
    marginTop: 16,
    marginBottom: 12,
  },

  paginationInfo: {
    color: '#AFC0D8',
    fontSize: 11,
  },

  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  pageButton: {
    minHeight: 35,
    backgroundColor: '#2563EB',
    borderRadius: 9,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  pageIndicator: {
    minHeight: 35,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    paddingHorizontal: 10,
    backgroundColor: '#142B49',
  },

  pageIndicatorText: {
    color: '#7DD3FC',
    fontSize: 11,
    fontWeight: '800',
  },

  disabled: {
    opacity: 0.4,
  },

  loadingBox: {
    paddingVertical: 45,
    alignItems: 'center',
    gap: 12,
  },

  emptyBox: {
    backgroundColor: '#142B49',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B7197',
    alignItems: 'center',
    padding: 26,
    gap: 8,
  },

  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },

  mutedText: {
    color: '#AFC0D8',
    fontSize: 12,
    textAlign: 'center',
  },

  historyCard: {
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
    gap: 10,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  dateText: {
    color: '#AFC0D8',
    fontSize: 11,
  },

  statusBadge: {
    borderWidth: 1,
    borderColor: '#38BDF8',
    backgroundColor: '#0B1C32',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  statusBadgeText: {
    color: '#7DD3FC',
    fontWeight: '800',
    fontSize: 10,
  },

  messageText: {
    color: '#F8FAFC',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },

  personSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,113,151,0.35)',
    paddingTop: 8,
    gap: 3,
  },

  personLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },

  personName: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
  },

  personEmail: {
    color: '#AFC0D8',
    fontSize: 11,
  },

  bottomPagination: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
    paddingVertical: 12,
  },

  calendarDateField: {
    flex: 1,
    minWidth: 0,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#0B1C32',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },

  calendarDateContent: {
    flex: 1,
  },

  calendarDateLabel: {
    color: '#AFC0D8',
    fontSize: 10,
    marginBottom: 4,
  },

  calendarDateValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  calendarDatePlaceholder: {
    color: '#94A3B8',
    fontWeight: '400',
  },

  calendarModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    backgroundColor: 'rgba(2,6,23,0.82)',
  },

  calendarModalCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3B7197',
    backgroundColor: '#142B49',
    padding: 12,
    overflow: 'hidden',
  },

  calendarModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  calendarModalTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  calendarCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
  },

  calendarModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },

  calendarClearButton: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
  },

  calendarClearText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },

  calendarDoneButton: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 9,
    backgroundColor: '#2563EB',
  },

  calendarDoneText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
