import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#101D35';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';
const PRIMARY = '#2563EB';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    padding: 14,
    paddingBottom: 32,
    gap: 18,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },

  fieldGroup: {
    gap: 7,
  },

  fieldLabel: {
    color: '#E2EAF5',
    fontSize: 13,
    fontWeight: '700',
  },

  input: {
    minHeight: 46,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    color: TEXT,
    fontSize: 13,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },

  selectField: {
    minHeight: 46,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  selectText: {
    flex: 1,
    color: TEXT,
    fontSize: 13,
  },

  placeholderText: {
    color: '#8291A9',
  },

  dateInputRow: {
    minHeight: 46,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 13,
  },

  dateInput: {
    flex: 1,
    minHeight: 44,
    color: TEXT,
    fontSize: 13,
    paddingHorizontal: 13,
  },

  accountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },

  connectButton: {
    minHeight: 46,
    maxWidth: 105,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: '#18304C',
    paddingHorizontal: 10,
  },

  connectButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },

  cancelButton: {
    minHeight: 43,
    paddingHorizontal: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
  },

  cancelText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
  },

  createButton: {
    minHeight: 43,
    minWidth: 88,
    paddingHorizontal: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 10,
  },

  createText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  disabled: {
    opacity: 0.45,
  },

  pressed: {
    opacity: 0.75,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'center',
    padding: 16,
  },

  modalCard: {
    width: '100%',
    maxHeight: '75%',
    backgroundColor: '#0B1528',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  modalTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  modalClose: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#EF4444',
  },

  modalOption: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: '#345C84',
    borderRadius: 9,
    paddingHorizontal: 13,
    marginBottom: 8,
  },

  modalOptionText: {
    flex: 1,
    color: TEXT,
    fontSize: 13,
    fontWeight: '700',
  },

  emptyText: {
    color: MUTED,
    textAlign: 'center',
    fontSize: 13,
    paddingVertical: 25,
  },

  datePickerValue: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
    paddingHorizontal: 13,
  },

  dateModalCard: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '90%',
    alignSelf: 'center',
    backgroundColor: '#0B1528',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 14,
    padding: 12,
  },

  calendar: {
    borderRadius: 10,
    backgroundColor: '#101D35',
    overflow: 'hidden',
  },

  timeHeading: {
    color: '#E2EAF5',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 15,
    marginBottom: 10,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  timeSelectButton: {
    minWidth: 92,
    minHeight: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#142B49',
  },

  timeSelectValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },

  timeSelectLabel: {
    color: '#AFC0D8',
    fontSize: 10,
    marginTop: 3,
  },

  timeSeparator: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },

  timeOptionsContainer: {
    marginTop: 12,
    maxHeight: 220,
    borderWidth: 1,
    borderColor: '#3B7197',
    backgroundColor: '#101D35',
    borderRadius: 10,
    padding: 8,
  },

  timeOptionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  timeOptionsTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  timeOption: {
    flex: 1,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
    borderRadius: 7,
    backgroundColor: '#142B49',
  },

  timeOptionSelected: {
    backgroundColor: '#2563EB',
  },

  timeOptionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  dateModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 17,
    gap: 12,
  },

  dateClearButton: {
    minHeight: 42,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#142B49',
  },

  dateClearText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
