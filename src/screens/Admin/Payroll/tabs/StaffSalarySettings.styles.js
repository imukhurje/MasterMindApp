import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 13,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 14,
  },

  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
  },

  sectionDescription: {
    color: '#B8C7DB',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  workspace: {
    gap: 12,
    marginTop: 14,
  },

  workspaceWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  employeePanel: {
    padding: 11,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 12,
  },

  employeePanelWide: {
    width: 280,
  },

  settingPanel: {
    flex: 1,
    padding: 12,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 12,
  },

  panelTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
  },

  searchInput: {
    minHeight: 45,
    marginTop: 8,
    paddingHorizontal: 11,
    color: '#F8FAFC',
    fontSize: 13,
    backgroundColor: '#102742',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
  },

  staffList: {
    gap: 7,
    marginTop: 10,
  },

  staffCard: {
    minHeight: 62,
    justifyContent: 'center',
    paddingHorizontal: 11,
    paddingVertical: 9,
    backgroundColor: '#102742',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 10,
  },

  staffCardSelected: {
    borderColor: '#7DD3FC',
    backgroundColor: '#15324D',
  },

  staffNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  staffName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
  },

  staffRole: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },

  pageButton: {
    width: 43,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
  },

  pageText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },

  settingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 9,
  },

  employeeSummary: {
    color: '#AFC2DA',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  newSettingButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 9,
  },

  newSettingText: {
    color: '#F1F5F9',
    fontSize: 11,
    fontWeight: '800',
  },

  draftNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#A87910',
    backgroundColor: '#332812',
    borderRadius: 8,
  },

  draftNoticeText: {
    flex: 1,
    color: '#D8C9AB',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
  },

  label: {
    color: '#DCE7F5',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 13,
    marginBottom: 6,
  },

  dateButton: {
    minHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
    backgroundColor: '#102742',
  },

  dateButtonText: {
    color: '#F8FAFC',
    fontSize: 13,
  },

  helperText: {
    color: '#9FB1C8',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
  },

  checkboxRow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },

  checkboxText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },

  lineList: {
    gap: 8,
    marginTop: 12,
  },

  componentLine: {
    gap: 7,
  },

  headSelector: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 11,
    backgroundColor: '#102742',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
  },

  headSelectorText: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 12,
    marginRight: 8,
  },

  amountInput: {
    minHeight: 44,
    paddingHorizontal: 11,
    color: '#F8FAFC',
    fontSize: 13,
    backgroundColor: '#102742',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
  },

  removeButton: {
    alignSelf: 'flex-start',
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: '#6A5B67',
    borderRadius: 8,
  },

  removeText: {
    color: '#FCA5A5',
    fontSize: 11,
    fontWeight: '800',
  },

  addLineButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 9,
  },

  addLineText: {
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: '800',
  },

  saveButton: {
    minHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 10,
    backgroundColor: '#2563EB',
    borderRadius: 9,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  disabledButton: {
    opacity: 0.45,
  },

  previousSection: {
    marginTop: 16,
  },

  previousTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 9,
  },

  previousCard: {
    padding: 11,
    marginBottom: 8,
    backgroundColor: '#102742',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 9,
  },

  previousHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  previousDate: {
    flex: 1,
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: '900',
  },

  previousStatus: {
    color: '#CBD5E1',
    fontSize: 11,
  },

  previousLines: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 8,
  },

  previousLineText: {
    color: '#AFC2DA',
    fontSize: 11,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 18,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },

  pickerModal: {
    maxHeight: '70%',
    padding: 14,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 14,
  },

  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  pickerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  closeButton: {
    width: 39,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 9,
  },

  pickerScroll: {
    flexGrow: 0,
  },

  pickerOption: {
    minHeight: 55,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#274D6A',
  },

  pickerOptionTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
  },

  pickerOptionSub: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 3,
  },
});
