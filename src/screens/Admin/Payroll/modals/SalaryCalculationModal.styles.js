import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 14,
    backgroundColor: 'rgba(1, 7, 16, 0.88)',
  },

  modalCard: {
    width: '100%',
    maxWidth: 760,
    maxHeight: '94%',
    alignSelf: 'center',
    backgroundColor: '#142F52',
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 18,
    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '800',
  },

  subtitle: {
    color: '#B9C9DD',
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

  content: {
    paddingHorizontal: 16,
    paddingBottom: 18,
  },

  label: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    marginTop: 13,
    marginBottom: 7,
  },

  input: {
    minHeight: 44,
    color: '#F8FAFC',
    fontSize: 14,
    paddingHorizontal: 11,
    paddingVertical: 9,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
  },

  reasonInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },

  paymentDetailsInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },

  readOnlyField: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 11,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
  },

  fieldText: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
  },

  previewLoading: {
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    backgroundColor: '#102742',
    borderRadius: 10,
  },

  previewLoadingText: {
    color: '#B9C9DD',
    fontSize: 13,
  },

  errorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 13,
    marginTop: 16,
    backgroundColor: '#3A2E0A',
    borderWidth: 1,
    borderColor: '#B98100',
    borderRadius: 10,
  },

  errorText: {
    flex: 1,
    color: '#FDE68A',
    fontSize: 13,
    lineHeight: 19,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 14,
    marginTop: 16,
    backgroundColor: '#102742',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 10,
  },

  infoText: {
    flex: 1,
    color: '#B9C9DD',
    fontSize: 13,
    lineHeight: 19,
  },

  previewCard: {
    padding: 14,
    marginTop: 16,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 12,
  },

  previewTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
  },

  previewDays: {
    color: '#B9C9DD',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 14,
  },

  previewColumns: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 16,
  },

  previewColumn: {
    flex: 1,
  },

  columnTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 7,
  },

  previewRow: {
    minHeight: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 7,
  },

  previewName: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 12,
  },

  previewAmount: {
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: '800',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 8,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#3F7BA7',
  },

  totalLabel: {
    color: '#B9C9DD',
    fontSize: 13,
    fontWeight: '800',
  },

  totalValue: {
    color: '#B9C9DD',
    fontSize: 13,
    fontWeight: '900',
  },

  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingTop: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#3F7BA7',
  },

  netLabel: {
    color: '#B9C9DD',
    fontSize: 15,
    fontWeight: '900',
  },

  netValue: {
    color: '#B9C9DD',
    fontSize: 15,
    fontWeight: '900',
  },

  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    marginTop: 17,
    marginBottom: 8,
  },

  adjustmentCard: {
    gap: 8,
    padding: 10,
    marginBottom: 9,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 10,
  },

  kindRow: {
    flexDirection: 'row',
    gap: 8,
  },

  kindButton: {
    flex: 1,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 8,
  },

  kindButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#60A5FA',
  },

  kindButtonText: {
    color: '#B9C9DD',
    fontSize: 12,
    fontWeight: '800',
  },

  kindButtonTextActive: {
    color: '#FFFFFF',
  },

  removeButton: {
    minHeight: 38,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#A94E59',
    borderRadius: 8,
  },

  removeButtonText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '800',
  },

  outlineButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 9,
  },

  outlineButtonText: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    marginTop: 16,
    backgroundColor: '#3F7BA7',
  },

  paymentMethodRow: {
    flexDirection: 'row',
    gap: 8,
  },

  paymentMethodButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
  },

  paymentMethodButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#60A5FA',
  },

  paymentMethodText: {
    color: '#B9C9DD',
    fontSize: 13,
    fontWeight: '800',
  },

  paymentMethodTextActive: {
    color: '#FFFFFF',
  },

  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 14,
  },

  saveDraftButton: {
    minHeight: 43,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 9,
  },

  saveDraftButtonText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
  },

  settleButton: {
    minHeight: 43,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#2563EB',
    borderRadius: 9,
  },

  settleButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  calendarOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 18,
    backgroundColor: 'rgba(1, 7, 16, 0.85)',
  },

  calendarCard: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    padding: 13,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 14,
  },

  calendarTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },

  pressed: {
    opacity: 0.75,
  },

  disabled: {
    opacity: 0.5,
  },
});
