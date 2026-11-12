// src/screens/Admin/Billing/AdminBillingSettings.styles.js

import { StyleSheet } from 'react-native';

const COLORS = {
  BG: '#081321',
  CARD: '#102742',
  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',
  BORDER: '#376D99',
  PRIMARY: '#2563EB',
};

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  content: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 35,
  },

  loadingScreen: {
    flex: 1,
    minHeight: 350,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.BG,
  },

  loadingText: {
    color: COLORS.MUTED,

    fontSize: 12,

    marginTop: 9,
  },

  card: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 14,

    padding: 14,

    marginBottom: 13,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 10,
  },

  cardHeaderText: {
    flex: 1,
  },

  cardTitle: {
    color: COLORS.TEXT,

    fontSize: 15,
    fontWeight: '800',
  },

  cardDescription: {
    color: '#B8C5D8',

    fontSize: 11,
    lineHeight: 17,

    marginTop: 6,
  },

  primaryButton: {
    minHeight: 40,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,

    backgroundColor: COLORS.PRIMARY,

    borderRadius: 9,

    paddingHorizontal: 12,
  },

  primaryButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  emptyText: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 12,
  },

  listArea: {
    marginTop: 11,
  },

  listCard: {
    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 9,

    padding: 11,

    marginTop: 7,
  },

  listTitle: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '800',
  },

  listSubtitle: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 4,
  },

  dueDaysRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 14,
    marginBottom: 9,
  },

  bodyText: {
    color: '#DCE7F5',

    fontSize: 11,
  },

  dueDaysInput: {
    width: 72,
    minHeight: 40,

    color: '#FFFFFF',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 11,

    marginHorizontal: 8,

    fontSize: 12,
  },

  radioOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    marginTop: 10,
  },

  radioOuter: {
    width: 14,
    height: 14,

    borderRadius: 7,

    borderWidth: 1,
    borderColor: '#93C5FD',

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 2,
    marginRight: 9,
  },

  radioInner: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: '#67D1F0',
  },

  radioContent: {
    flex: 1,
  },

  radioTitle: {
    color: '#E2E8F0',

    fontSize: 11,
    fontWeight: '800',
  },

  radioDescription: {
    color: COLORS.MUTED,

    fontSize: 10,
    lineHeight: 15,

    marginTop: 4,
  },

  saveButton: {
    alignSelf: 'flex-start',

    minHeight: 41,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.PRIMARY,

    borderRadius: 9,

    paddingHorizontal: 13,

    marginTop: 13,
  },

  saveButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  gatewayText: {
    color: '#B8C5D8',

    fontSize: 11,

    marginTop: 9,
    marginBottom: 6,
  },

  fieldLabel: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '700',

    marginTop: 9,
    marginBottom: 6,
  },

  input: {
    minHeight: 46,

    color: '#FFFFFF',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 11,

    fontSize: 12,
  },

  helperText: {
    color: COLORS.MUTED,

    fontSize: 10,
    lineHeight: 15,

    marginTop: 8,
  },

  paymentActions: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },

  clearButton: {
    minHeight: 41,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 15,

    marginTop: 13,
  },

  clearButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '800',
  },

  controlPressed: {
    opacity: 0.72,
  },
  couponList: {
    marginTop: 10,
  },

  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,

    paddingTop: 8,
  },

  couponInfo: {
    flex: 1,
  },

  couponSummary: {
    color: '#F1F5F9',

    fontSize: 11,
    fontWeight: '800',

    lineHeight: 17,
  },

  couponActions: {
    flexDirection: 'row',

    gap: 6,
  },

  couponEditButton: {
    width: 40,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 8,
  },

  couponDeleteButton: {
    width: 40,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 8,
  },

  couponModalBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.76)',

    paddingHorizontal: 8,
    paddingVertical: 25,
  },

  couponModal: {
    width: '100%',
    maxHeight: '90%',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 14,

    overflow: 'hidden',
  },

  couponModalHeader: {
    minHeight: 58,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 14,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  couponModalTitle: {
    color: '#FFFFFF',

    fontSize: 16,
    fontWeight: '900',
  },

  couponCloseButton: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 9,
  },

  couponModalContent: {
    padding: 14,
    paddingBottom: 18,
  },

  couponHelpText: {
    color: '#B8C5D8',

    fontSize: 11,
    lineHeight: 16,

    marginBottom: 10,
  },

  couponTypeOptions: {
    gap: 9,
  },

  couponTypeCard: {
    backgroundColor: '#2563EB',

    borderRadius: 10,

    padding: 14,
  },

  couponTypeTitle: {
    color: '#FFFFFF',

    fontSize: 14,
    fontWeight: '900',
  },

  couponTypeDescription: {
    color: '#DBEAFE',

    fontSize: 10,
    lineHeight: 15,

    marginTop: 5,
  },

  couponFieldLabel: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '700',

    marginTop: 10,
    marginBottom: 6,
  },

  couponInput: {
    minHeight: 46,

    color: '#FFFFFF',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 11,

    fontSize: 12,
  },

  couponDropdown: {
    minHeight: 46,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 11,
  },

  couponDropdownContainer: {
    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  couponDropdownSelected: {
    color: '#FFFFFF',
    fontSize: 12,
  },

  couponDropdownItem: {
    color: '#FFFFFF',
    fontSize: 12,
  },

  couponDateField: {
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 11,
  },

  couponDateValue: {
    color: '#FFFFFF',

    fontSize: 12,
  },

  couponDatePlaceholder: {
    color: '#94A3B8',

    fontSize: 12,
  },

  couponModalActions: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 18,
  },

  couponSecondaryButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 13,

    marginRight: 7,
  },

  couponSecondaryText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '800',
  },

  couponSaveButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 9,

    paddingHorizontal: 14,
  },

  couponSaveText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  couponCancelButton: {
    alignSelf: 'flex-start',

    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 15,

    marginTop: 12,
  },

  couponCancelText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '800',
  },

  calendarBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.76)',

    padding: 16,
  },

  calendarModal: {
    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 14,

    overflow: 'hidden',
  },

  calendarHeader: {
    minHeight: 52,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 14,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  calendarTitle: {
    color: '#FFFFFF',

    fontSize: 14,
    fontWeight: '900',
  },

  controlDisabled: {
    opacity: 0.45,
  },

  ladderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',

    gap: 10,

    marginTop: 20,
    marginBottom: 9,
  },

  ladderTitle: {
    color: '#FFFFFF',

    fontSize: 14,
    fontWeight: '900',
  },

  ladderDescription: {
    color: '#B8C5D8',

    fontSize: 10,
    lineHeight: 15,

    marginTop: 3,
  },

  addTierButton: {
    minHeight: 39,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 12,
  },

  addTierButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  ladderList: {
    gap: 8,
  },

  ladderTierCard: {
    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 10,

    padding: 10,
  },

  ladderTierFields: {
    flexDirection: 'row',
    alignItems: 'flex-end',

    gap: 7,
  },

  ladderThresholdField: {
    flex: 1.15,
  },

  ladderDiscountField: {
    flex: 1,
  },

  ladderValueField: {
    flex: 1,
  },

  ladderDeleteField: {
    width: 40,
  },

  ladderFieldLabel: {
    color: '#DCE7F5',

    fontSize: 9,
    fontWeight: '600',

    marginBottom: 5,
  },

  ladderDeleteSpacer: {
    fontSize: 9,

    marginBottom: 5,
  },

  ladderInput: {
    height: 42,

    color: '#FFFFFF',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 8,

    paddingHorizontal: 9,

    fontSize: 11,
  },

  ladderDropdown: {
    height: 42,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 8,

    paddingHorizontal: 8,
  },

  ladderDeleteButton: {
    width: 40,
    height: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#60A5FA',

    borderRadius: 8,
  },

  couponDropdownPlaceholder: {
    color: '#94A3B8',
    fontSize: 11,
  },

  lateFeeModal: {
    width: '100%',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 14,

    overflow: 'hidden',
  },

  lateFeeSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 12,

    gap: 8,
  },

  lateFeeSummaryText: {
    flex: 1,

    color: '#F1F5F9',

    fontSize: 11,
    fontWeight: '800',

    lineHeight: 17,
  },

  lateFeeActions: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,
  },
});
