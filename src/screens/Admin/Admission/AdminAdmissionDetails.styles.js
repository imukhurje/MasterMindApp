// src/screens/Admin/Admission/AdminAdmissionDetails.styles.js

import { StyleSheet } from 'react-native';

const BG = '#081524';
const CARD = '#0B1C32';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#315F87';

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
  },

  headerCard: {
    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 13,

    marginBottom: 10,
  },

  headerTitleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  headerTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '900',

    marginRight: 9,
    marginBottom: 5,
  },

  statusBadge: {
    minHeight: 26,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,

    borderRadius: 14,

    paddingHorizontal: 9,

    marginBottom: 5,
  },

  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  submittedBadge: {
    backgroundColor: '#16334D',
    borderColor: '#67D1F0',
  },

  passedBadge: {
    backgroundColor: '#063F32',
    borderColor: '#10B981',
  },

  scheduledBadge: {
    backgroundColor: '#3A3015',
    borderColor: '#D99A00',
  },

  admittedBadge: {
    backgroundColor: '#063F32',
    borderColor: '#10B981',
  },

  rejectedBadge: {
    backgroundColor: '#3D2027',
    borderColor: '#EF4444',
  },

  printButton: {
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'flex-start',

    backgroundColor: '#2563EB',

    borderRadius: 10,

    paddingHorizontal: 14,

    marginTop: 8,
  },

  printButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 6,
  },

  sectionCard: {
    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 13,

    marginBottom: 10,
  },

  sectionTitle: {
    color: TEXT,

    fontSize: 15,
    fontWeight: '900',

    marginBottom: 11,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    marginBottom: 7,
  },

  infoLabel: {
    width: 110,

    color: MUTED,

    fontSize: 11,
    lineHeight: 17,
    fontWeight: '800',
  },

  infoValue: {
    flex: 1,

    color: '#E2E8F0',

    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },

  addressText: {
    color: '#E2E8F0',

    fontSize: 12,
    lineHeight: 19,
  },

  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#274D71',

    borderRadius: 10,

    padding: 10,

    marginBottom: 8,
  },

  documentInfo: {
    flex: 1,
    minWidth: 0,

    paddingRight: 8,
  },

  documentName: {
    color: TEXT,

    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
  },

  documentAvailable: {
    color: '#86EFAC',

    fontSize: 10,
    fontWeight: '700',

    marginTop: 3,
  },

  documentMissing: {
    color: '#FCA5A5',

    fontSize: 10,
    fontWeight: '700',

    marginTop: 3,
  },

  documentButton: {
    minHeight: 36,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 8,

    paddingHorizontal: 10,
  },

  documentButtonText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',

    marginLeft: 5,
  },

  declineReasonBox: {
    backgroundColor: '#2A1820',

    borderWidth: 1,
    borderColor: '#B9475F',

    borderRadius: 9,

    padding: 10,

    marginTop: 5,
  },

  declineReasonLabel: {
    color: '#FCA5A5',
    fontSize: 11,
    fontWeight: '900',
  },

  declineReasonText: {
    color: '#FDE2E7',

    fontSize: 11,
    lineHeight: 16,

    marginTop: 4,
  },

  declineButton: {
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'flex-start',

    backgroundColor: '#DC3545',

    borderRadius: 10,

    paddingHorizontal: 18,

    marginTop: 3,
  },

  declineButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',

    marginLeft: 6,
  },

  controlPressed: {
    opacity: 0.72,
  },
  declineModalBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.72)',

    paddingHorizontal: 18,
  },

  declineModal: {
    width: '100%',

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#3B7197',

    borderRadius: 16,

    padding: 15,
  },

  declineModalTitle: {
    color: '#FFFFFF',

    fontSize: 17,
    fontWeight: '900',

    marginBottom: 15,
  },

  declineModalLabel: {
    color: '#DCE7F5',

    fontSize: 13,
    fontWeight: '800',

    marginBottom: 7,
  },

  requiredText: {
    color: '#EF4444',
  },

  declineReasonInput: {
    minHeight: 90,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    color: '#FFFFFF',
    fontSize: 14,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  declineModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 14,
  },

  declineCancelButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 18,

    marginRight: 8,
  },

  declineCancelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  declineConfirmButton: {
    minWidth: 80,
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#DC3545',

    borderRadius: 10,

    paddingHorizontal: 18,
  },

  declineConfirmText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  rescheduleButton: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'flex-start',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 16,

    marginTop: 3,
  },

  rescheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 6,
  },

  rescheduleModalBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.72)',

    paddingHorizontal: 18,
  },

  rescheduleModal: {
    width: '100%',

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#3B7197',

    borderRadius: 16,

    padding: 15,
  },

  rescheduleModalTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 14,
  },

  rescheduleModalLabel: {
    color: '#DCE7F5',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 7,
  },

  rescheduleOption: {
    minHeight: 60,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#3B7197',

    borderRadius: 10,

    padding: 10,
    marginBottom: 8,
  },

  rescheduleOptionSelected: {
    backgroundColor: '#173B60',
    borderColor: '#60A5FA',
  },

  rescheduleRadio: {
    width: 20,
    height: 20,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 2,
    borderColor: '#93C5FD',

    borderRadius: 10,

    marginRight: 10,
  },

  rescheduleRadioInner: {
    width: 10,
    height: 10,

    backgroundColor: '#60A5FA',

    borderRadius: 5,
  },

  rescheduleOptionInfo: {
    flex: 1,
  },

  rescheduleOptionId: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '800',
  },

  rescheduleOptionLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 3,
  },

  rescheduleRollField: {
    marginTop: 8,
  },

  rescheduleRollInput: {
    minHeight: 48,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    color: '#FFFFFF',
    fontSize: 14,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  rescheduleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 14,
  },

  rescheduleCancelButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 18,

    marginRight: 8,
  },

  rescheduleCancelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  rescheduleConfirmButton: {
    minWidth: 80,
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 10,

    paddingHorizontal: 18,
  },

  rescheduleConfirmText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
});
