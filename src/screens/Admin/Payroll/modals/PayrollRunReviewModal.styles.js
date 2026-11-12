import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 24,
    backgroundColor: 'rgba(1, 8, 18, 0.82)',
  },

  modal: {
    width: '100%',
    maxWidth: 900,
    maxHeight: '90%',
    alignSelf: 'center',
    padding: 14,
    backgroundColor: '#132C4B',
    borderWidth: 1,
    borderColor: '#4784B1',
    borderRadius: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '900',
  },

  subtitle: {
    color: '#AFC2DA',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 3,
  },

  closeButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 11,
  },

  loadingContainer: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#AFC2DA',
    fontSize: 14,
    marginTop: 10,
  },

  toolbar: {
    marginTop: 20,
  },

  searchSection: {
    width: '100%',
  },

  fieldLabel: {
    color: '#DCE7F5',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    marginBottom: 7,
  },

  searchBox: {
    width: '100%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 13,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 10,
  },

  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    paddingVertical: 0,
  },

  mobileActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 10,
  },

  refreshButton: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 9,
    backgroundColor: '#0F2945',
  },

  refreshButtonText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
  },

  toolbarActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
  },

  iconButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 10,
    backgroundColor: '#0F2945',
  },

  verifyAllButton: {
    flex: 1,
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 9,
    backgroundColor: '#163450',
  },

  verifyAllButtonText: {
    flexShrink: 1,
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '900',
  },

  scrollContent: {
    paddingTop: 15,
    paddingBottom: 8,
  },

  table: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 14,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#214568',
  },

  tableHeaderCell: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 13,
    borderRightWidth: 1,
    borderRightColor: '#315F84',
  },

  tableHeaderText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
  },

  tableRow: {
    flexDirection: 'row',
    minHeight: 72,
    borderTopWidth: 1,
    borderTopColor: '#315F84',
    backgroundColor: '#0E2038',
  },

  tableCell: {
    justifyContent: 'center',
    paddingHorizontal: 13,
  },

  statusColumn: {
    flex: 0.9,
  },

  verifyColumn: {
    flex: 1,
  },

  staffColumn: {
    flex: 1.35,
  },

  payslipColumn: {
    flex: 1.1,
  },

  statusText: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '900',
  },

  staffName: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
  },

  staffDesignation: {
    color: '#AFC2DA',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  payslipText: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 18,
  },

  verifiedIcon: {
    width: 23,
    height: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 20,
  },

  verifyButton: {
    alignSelf: 'flex-start',
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 9,
    backgroundColor: '#143653',
  },

  verifyButtonText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
  },

  dashText: {
    color: '#AFC2DA',
    fontSize: 17,
  },

  mobileList: {
    gap: 10,
  },

  mobileCard: {
    padding: 12,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 11,
  },

  mobileCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },

  verifiedStatusBadge: {
    backgroundColor: '#065F46',
  },

  settledStatusBadge: {
    backgroundColor: '#1E4F78',
  },

  unsettledStatusBadge: {
    backgroundColor: '#5B4300',
  },

  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  mobileInfoRow: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 13,
  },

  mobileInfoBlock: {
    flex: 1,
    minHeight: 58,
    padding: 9,
    backgroundColor: '#102742',
    borderRadius: 8,
  },

  mobileVerifyBlock: {
    flex: 1,
    minHeight: 58,
    padding: 9,
    backgroundColor: '#102742',
    borderRadius: 8,
  },

  mobileLabel: {
    color: '#8FA5BE',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
  },

  mobileValue: {
    color: '#F8FAFC',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 6,
  },

  mobileVerification: {
    marginTop: 6,
  },

  emptyCard: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 12,
  },

  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 9,
  },

  emptyText: {
    color: '#91A5BD',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 5,
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
