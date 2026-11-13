import { Platform, StatusBar, StyleSheet, Dimensions } from 'react-native';

export const COLORS = {
  BG: '#081524',
  CARD: '#132A46',
  CARD_SOFT: '#193554',
  TEXT: '#F8FAFC',
  MUTED: '#B8C7D9',
  BORDER: '#3E79A8',
  BORDER_SOFT: '#244766',
  PRIMARY: '#4F8CFF',
  CTA: '#22C55E',
  DANGER: '#EF4444',
  WARNING_BG: '#3B2A10',
  WARNING_TEXT: '#F6C76B',
};

const {
  BG,
  CARD,
  CARD_SOFT,
  TEXT,
  MUTED,
  BORDER,
  BORDER_SOFT,
  PRIMARY,
  CTA,
  DANGER,
  WARNING_BG,
  WARNING_TEXT,
} = COLORS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: MUTED,
    fontWeight: '600',
  },

  errorBox: {
    backgroundColor: '#3F1212',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
  },

  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: '600',
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: CARD,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_SOFT,
  },

  tab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 10,
  },

  tabActive: {
    backgroundColor: '#214A72',
  },

  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: MUTED,
  },

  tabTextActive: {
    color: TEXT,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },

  selectAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102742',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4F8CFF',
    gap: 8,
  },

  selectAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT,
  },

  payBtn: {
    backgroundColor: '#3D7BFA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6AA6FF',
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  payBtnDisabled: {
    opacity: 0.55,
  },

  payText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CARD_SOFT,
  },

  checkboxSelected: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  checkmark: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },

  emptyState: {
    backgroundColor: CARD,
    margin: 16,
    padding: 42,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_SOFT,
  },

  emptyText: {
    fontSize: 15,
    color: MUTED,
    fontWeight: '600',
  },

  billCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },

  billCardSelected: {
    borderColor: PRIMARY,
    backgroundColor: '#1A3555',
  },

  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },

  billHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },

  billHeaderText: {
    flex: 1,
  },

  billTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 3,
  },

  billSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 5,
  },

  billDates: {
    fontSize: 12,
    color: '#FCA5A5',
    lineHeight: 18,
    fontWeight: '600',
    marginTop: 2,
  },

  billDatesPaid: {
    color: '#AFC0D8',
  },

  classLabel: {
    fontSize: 11,
    color: '#93C5FD',
    fontWeight: '700',
    marginTop: 4,
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },

  statusPillUnpaid: {
    backgroundColor: '#2B1F0E',
    borderColor: '#C58B2A',
  },

  statusPillPaid: {
    backgroundColor: '#0E2D22',
    borderColor: '#2FA36B',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  statusTextUnpaid: {
    color: WARNING_TEXT,
  },

  statusTextPaid: {
    color: '#86EFAC',
  },

  divider: {
    height: 1,
    backgroundColor: BORDER_SOFT,
    marginVertical: 14,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },

  itemLabel: {
    fontSize: 14,
    color: '#E2E8F0',
    flex: 1,
    paddingRight: 12,
    fontWeight: '500',
  },

  amountPill: {
    backgroundColor: '#0E2137',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4A86B6',
  },

  amountText: {
    fontSize: 13,
    fontWeight: '800',
    color: TEXT,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: TEXT,
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#DDEBFF',
  },

  printBtn: {
    marginTop: 14,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#14314F',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5EA2DA',
  },

  printText: {
    fontSize: 14,
    color: '#EAF4FF',
    fontWeight: '800',
  },

  summaryBox: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: '#102742',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A86B6',
  },

  summaryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: MUTED,
    flex: 1,
    paddingRight: 12,
  },

  summaryAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: TEXT,
  },

  pdfModalContainer: {
    flex: 1,
    backgroundColor: BG,
  },

  pdfHeader: {
    backgroundColor: BG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_SOFT,
  },

  pdfHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT,
  },

  closeIcon: {
    fontSize: 28,
    color: TEXT,
  },

  pdfBody: {
    flex: 1,
    backgroundColor: '#020617',
  },

  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },

  pdfFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER_SOFT,
    backgroundColor: BG,
  },

  downloadBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  downloadText: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '800',
  },
  paymentOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(2, 8, 23, 0.78)',

    paddingHorizontal: 14,
    paddingVertical: 20,
  },

  paymentModal: {
    width: '100%',
    maxWidth: 430,
    maxHeight: '92%',

    backgroundColor: '#102742',

    borderRadius: 20,

    borderWidth: 1,
    borderColor: '#4384B5',

    overflow: 'hidden',
  },

  paymentHeader: {
    minHeight: 72,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 16,
    paddingVertical: 13,

    borderBottomWidth: 1,
    borderBottomColor: '#294E70',

    backgroundColor: '#132E4C',
  },

  paymentHeaderText: {
    flex: 1,
    paddingRight: 12,
  },

  paymentTitle: {
    color: '#F8FAFC',

    fontSize: 18,
    lineHeight: 22,

    fontWeight: '900',
  },

  paymentSubtitle: {
    color: '#AFC0D8',

    fontSize: 10,
    lineHeight: 15,

    marginTop: 4,
  },

  paymentCloseBtn: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 12,

    backgroundColor: '#EF4444',
  },

  paymentCloseText: {
    color: '#FFFFFF',

    fontSize: 24,
    lineHeight: 26,

    fontWeight: '700',
  },

  paymentScroll: {
    flexGrow: 0,
  },

  paymentBody: {
    padding: 14,
    flexDirection: 'column',
  },

  paymentLoadingBox: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  paymentLoadingText: {
    color: '#CBD5E1',
    marginTop: 10,
    fontWeight: '600',
  },

  qrSection: {
    width: '100%',

    alignItems: 'center',

    backgroundColor: '#0D223B',

    borderWidth: 1,
    borderColor: '#315D86',

    borderRadius: 16,

    padding: 14,

    marginBottom: 12,
  },

  qrSectionTitle: {
    color: '#F8FAFC',

    fontSize: 15,
    fontWeight: '900',
  },

  qrSectionSubtitle: {
    color: '#9FB3CC',

    fontSize: 10,
    lineHeight: 14,

    textAlign: 'center',

    marginTop: 3,
    marginBottom: 12,
  },

  qrBox: {
    width: 215,
    height: 215,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FFFFFF',

    borderRadius: 15,

    padding: 12,
  },

  merchantCard: {
    width: '100%',

    alignItems: 'center',

    backgroundColor: '#08192B',

    borderRadius: 10,

    paddingHorizontal: 10,
    paddingVertical: 8,

    marginTop: 11,
  },

  merchantName: {
    color: '#F8FAFC',

    fontSize: 12,
    fontWeight: '800',
  },

  merchantVpa: {
    color: '#93C5FD',

    fontSize: 10,

    marginTop: 2,
  },

  upiAppButton: {
    width: '100%',
    minHeight: 46,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#3B82F6',

    borderRadius: 11,

    marginTop: 10,
  },

  upiAppButtonText: {
    color: '#FFFFFF',

    fontSize: 13,
    fontWeight: '900',
  },

  qrImage: {
    width: '100%',
    height: '100%',
  },

  merchantText: {
    color: '#AFC0D8',

    fontSize: 10,

    marginTop: 9,
  },

  paymentForm: {
    width: '100%',

    backgroundColor: '#0D223B',

    borderWidth: 1,
    borderColor: '#315D86',

    borderRadius: 16,

    padding: 13,
  },

  paymentSummaryCard: {
    alignItems: 'center',

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#315D86',

    borderRadius: 14,

    paddingHorizontal: 14,
    paddingVertical: 12,

    marginBottom: 12,
  },

  paymentSummaryLabel: {
    color: '#9FB3CC',

    fontSize: 10,
    fontWeight: '700',
  },

  paymentSummaryAmount: {
    color: '#FFFFFF',

    fontSize: 26,
    lineHeight: 32,

    fontWeight: '900',

    marginTop: 3,
  },

  paymentSelectedText: {
    color: '#93C5FD',

    fontSize: 10,
    fontWeight: '700',

    marginTop: 2,
  },

  transactionBox: {
    backgroundColor: '#08192B',

    borderWidth: 1,
    borderColor: '#294E70',

    borderRadius: 11,

    padding: 11,

    marginBottom: 13,
  },

  transactionLabel: {
    color: '#94A3B8',

    fontSize: 9,
    fontWeight: '700',

    marginBottom: 5,
  },

  transactionValue: {
    color: '#DCEBFA',

    fontSize: 11,
    lineHeight: 16,

    fontWeight: '700',
  },

  paymentInputLabel: {
    color: '#E2E8F0',

    fontSize: 11,
    fontWeight: '800',

    marginBottom: 7,
  },

  optionalText: {
    color: '#94A3B8',
    fontWeight: '500',
  },

  paymentInput: {
    width: '100%',
    minHeight: 46,

    borderWidth: 1,
    borderColor: '#4384B5',

    borderRadius: 11,

    backgroundColor: '#08192B',

    color: '#FFFFFF',

    fontSize: 13,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  paymentInputError: {
    borderColor: '#EF4444',
  },

  paymentHintBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',

    borderRadius: 10,

    padding: 10,

    marginTop: 10,
  },

  paymentHintText: {
    color: '#AFC0D8',

    fontSize: 10,
    lineHeight: 15,
  },

  paymentActionRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 14,
  },

  paymentCancelBtn: {
    flex: 1,

    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4384B5',

    borderRadius: 11,

    backgroundColor: '#08192B',

    marginRight: 8,
  },

  paymentCancelText: {
    color: '#E2E8F0',

    fontSize: 12,
    fontWeight: '800',
  },

  paymentSubmitBtn: {
    flex: 1.4,

    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 11,

    backgroundColor: '#3B82F6',
  },

  paymentSubmitBtnDisabled: {
    opacity: 0.5,
  },

  paymentSubmitText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  paymentErrorBox: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: '#13284A',
  },

  paymentErrorText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  paymentRefText: {
    marginTop: 6,
    fontSize: 12,
    color: '#FCA5A5',
    fontWeight: '800',
  },

  paymentRefTextPaid: {
    color: '#86EFAC',
  },

  checkboxDisabled: {
    backgroundColor: '#334155',
    borderColor: '#64748B',
    opacity: 0.6,
  },

  actionSection: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 10,
  },

  selectAllBtn: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#102742',

    paddingHorizontal: 12,

    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4F8CFF',

    gap: 8,
  },

  couponSection: {
    flex: 1,
    minWidth: 140,
  },

  couponLabel: {
    color: '#B8C7D9',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },

  couponInput: {
    minHeight: 46,

    borderWidth: 1,
    borderColor: '#4A86B6',

    borderRadius: 10,

    backgroundColor: '#0E2137',

    color: '#F8FAFC',

    fontSize: 13,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  payBtn: {
    minHeight: 46,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#3D7BFA',

    paddingHorizontal: 16,

    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6AA6FF',
  },

  payText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

export default styles;
