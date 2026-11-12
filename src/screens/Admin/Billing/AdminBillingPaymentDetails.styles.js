// src/screens/Admin/Billing/AdminBillingPaymentDetails.styles.js

import { StyleSheet } from 'react-native';

const COLORS = {
  BG: '#081321',
  CARD: '#102742',
  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',
  BORDER: '#376D99',
  PRIMARY: '#3B82F6',
};

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  content: {
    padding: 14,
  },

  centeredScreen: {
    flex: 1,
    backgroundColor: COLORS.BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.MUTED,
    fontSize: 12,
    marginTop: 9,
  },

  headerCard: {
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 15,
    padding: 14,
    marginBottom: 12,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  studentName: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  studentMeta: {
    color: COLORS.MUTED,
    fontSize: 11,
    marginTop: 4,
  },

  billingMonth: {
    color: '#BFDBFE',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 9,
  },

  missingBadge: {
    borderWidth: 1,
    borderColor: '#4E92C7',
    borderRadius: 999,
    backgroundColor: '#10253E',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  missingBadgeText: {
    color: '#BFDBFE',
    fontSize: 9,
    fontWeight: '800',
  },

  billStatusBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  paidBadge: {
    backgroundColor: '#123D32',
    borderColor: '#22C55E',
  },

  unpaidBadge: {
    backgroundColor: '#3B2A10',
    borderColor: '#F59E0B',
  },

  billStatusText: {
    fontSize: 9,
    fontWeight: '900',
  },

  paidText: {
    color: '#86EFAC',
  },

  unpaidText: {
    color: '#FBBF24',
  },

  detailCard: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 15,
    padding: 13,
    marginBottom: 12,
  },

  sectionTitle: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 10,
  },

  emptyDescription: {
    color: COLORS.MUTED,
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 12,
  },

  chargeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#294B69',
  },

  chargeCaption: {
    flex: 1,
    color: '#DCE7F5',
    fontSize: 11,
  },

  chargeAmount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 13,
  },

  totalLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  totalValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  infoBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#102844',
    borderWidth: 1,
    borderColor: '#376D99',
    borderRadius: 10,
    padding: 11,
    marginTop: 12,
  },

  infoText: {
    flex: 1,
    color: '#BFDBFE',
    fontSize: 10,
    lineHeight: 16,
  },

  primaryButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 9,
    marginTop: 13,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 6,
  },

  metaLabel: {
    color: COLORS.MUTED,
    fontSize: 10,
  },

  metaValue: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: '#294B69',
    marginVertical: 11,
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.45,
  },

  billActionsCard: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 15,

    padding: 13,

    marginBottom: 12,
  },

  billActionButton: {
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    backgroundColor: '#143657',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 14,

    marginBottom: 9,
  },

  billActionButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  regenerateDisabledButton: {
    backgroundColor: '#102238',

    borderColor: '#3D526B',
  },

  regenerateDisabledText: {
    color: '#94A3B8',

    fontSize: 12,
    fontWeight: '900',
  },

  paidInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 8,

    marginTop: 3,

    backgroundColor: 'rgba(34, 197, 94, 0.08)',

    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.35)',

    borderRadius: 10,

    padding: 10,
  },

  paidInfoText: {
    flex: 1,

    color: '#BBF7D0',

    fontSize: 10,
    lineHeight: 15,
  },
  markPaidButton: {
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    backgroundColor: '#2563EB',

    borderRadius: 10,

    paddingHorizontal: 14,

    marginBottom: 9,
  },

  markPaidButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  regenerateButton: {
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    backgroundColor: '#143657',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 14,
  },

  regenerateButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  markPaidBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.75)',

    paddingHorizontal: 14,
  },

  markPaidModal: {
    width: '100%',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 15,

    padding: 14,
  },

  markPaidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 14,
  },

  markPaidTitle: {
    color: '#FFFFFF',

    fontSize: 17,
    fontWeight: '900',
  },

  markPaidCloseButton: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  markPaidDescription: {
    color: '#C7D4E6',

    fontSize: 12,
    lineHeight: 18,

    marginBottom: 13,
  },

  markPaidLabel: {
    color: '#DCE7F5',

    fontSize: 12,
    fontWeight: '700',

    marginBottom: 6,
    marginTop: 8,
  },

  markPaidDropdown: {
    minHeight: 49,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  markPaidDropdownContainer: {
    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    overflow: 'hidden',
  },

  markPaidSelectedText: {
    color: '#F8FAFC',

    fontSize: 13,
  },

  markPaidItemText: {
    color: '#F8FAFC',

    fontSize: 13,
  },

  markPaidPlaceholder: {
    color: '#718096',

    fontSize: 13,
  },

  markPaidHelp: {
    color: '#AFC0D8',

    fontSize: 10,
    lineHeight: 15,

    marginTop: 6,
  },

  markPaidInput: {
    minHeight: 48,

    color: '#FFFFFF',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,

    fontSize: 13,
  },

  markPaidActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 18,
  },

  markPaidCancelButton: {
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 17,

    marginRight: 8,
  },

  markPaidCancelText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  markPaidConfirmButton: {
    minWidth: 105,
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 10,

    paddingHorizontal: 17,
  },

  markPaidConfirmText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },
});
