// src/screens/Admin/Payroll/modals/RepaymentAdjustmentModal.styles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 40,
    backgroundColor: 'rgba(1, 8, 18, 0.84)',
  },

  modalCard: {
    width: '100%',
    maxHeight: '82%',
    backgroundColor: '#122D4D',
    borderWidth: 1,
    borderColor: '#4A8ABC',
    borderRadius: 18,
    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#285577',
  },

  headerText: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '800',
  },

  subtitle: {
    color: '#AFC2DA',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },

  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 10,
  },

  content: {
    padding: 16,
    paddingBottom: 20,
  },

  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#102D36',
    borderWidth: 1,
    borderColor: '#3B82A0',
    borderRadius: 10,
  },

  successText: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 19,
  },

  fieldRow: {
    flexDirection: 'row',
    gap: 10,
  },

  fieldColumn: {
    flex: 1,
  },

  fieldLabel: {
    color: '#C9D7E9',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },

  selectButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
  },

  selectText: {
    flex: 1,
    color: '#F1F5F9',
    fontSize: 13,
  },

  input: {
    minHeight: 48,
    paddingHorizontal: 12,
    color: '#F8FAFC',
    fontSize: 13,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
  },

  periodDropdown: {
    marginTop: 6,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
    overflow: 'hidden',
  },

  periodOption: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#294C69',
  },

  periodOptionActive: {
    backgroundColor: '#173C63',
  },

  periodOptionText: {
    color: '#DCE7F5',
    fontSize: 13,
    fontWeight: '700',
  },

  periodOptionTextActive: {
    color: '#FFFFFF',
  },

  periodAmount: {
    color: '#AFC2DA',
    fontSize: 12,
  },

  scheduledText: {
    color: '#AFC2DA',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 13,
  },

  helpText: {
    color: '#AFC2DA',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 14,
  },

  futureCard: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 11,
  },

  futureTitle: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },

  futureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#244A69',
  },

  futureRowLast: {
    borderBottomWidth: 0,
  },

  futureLabel: {
    color: '#8FA5BE',
    fontSize: 10,
    marginBottom: 4,
  },

  futureValue: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '700',
  },

  futureAmountBlock: {
    alignItems: 'flex-end',
  },

  futureAmount: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
  },

  futureEmpty: {
    paddingVertical: 12,
  },

  futureEmptyText: {
    color: '#8FA5BE',
    fontSize: 12,
  },

  saveButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 14,
    paddingHorizontal: 14,
    backgroundColor: '#2563EB',
    borderRadius: 9,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  emptyCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },

  emptyTitle: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
  },

  emptyText: {
    color: '#91A5BD',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 4,
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  pressed: {
    opacity: 0.82,
  },
});
