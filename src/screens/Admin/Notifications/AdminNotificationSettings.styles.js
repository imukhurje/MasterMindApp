import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    gap: 14,
  },

  loadingContainer: {
    minHeight: 250,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },

  loadingText: {
    color: '#AFC0D8',
    fontSize: 13,
  },

  description: {
    color: '#AFC0D8',
    fontSize: 12,
    lineHeight: 20,
  },

  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 9,
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
  },

  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  eventSelectorSection: {
    gap: 10,
  },

  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },

  eventButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  eventButton: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#142B49',
    minWidth: '47%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  eventButtonActive: {
    backgroundColor: '#7DD3FC',
    borderColor: '#7DD3FC',
  },

  eventButtonText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  eventButtonTextActive: {
    color: '#0B1C32',
  },

  settingsCard: {
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 15,
    gap: 20,
  },

  selectedEventTitle: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },

  fieldGroup: {
    gap: 9,
  },

  fieldLabel: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
  },

  messageBodyInput: {
    minHeight: 135,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 9,
    backgroundColor: '#0B162B',
    color: '#F8FAFC',
    fontSize: 13,
    lineHeight: 20,
  },

  helperText: {
    color: '#AFC0D8',
    fontSize: 12,
    lineHeight: 20,
  },

  templateInput: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 9,
    backgroundColor: '#0B162B',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    fontSize: 13,
  },

  parametersSection: {
    gap: 12,
  },

  emptyParametersText: {
    color: '#AFC0D8',
    fontSize: 12,
    lineHeight: 18,
  },

  parameterGroup: {
    gap: 6,
  },

  parameterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  parameterNumber: {
    width: 19,
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },

  parameterSelect: {
    flex: 1,
    minWidth: 0,
    minHeight: 43,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#0B1C32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    gap: 5,
  },

  parameterSelectText: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 12,
  },

  removeButton: {
    paddingHorizontal: 10,
    minHeight: 43,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#3B7197',
    backgroundColor: '#142B49',
    alignItems: 'center',
    justifyContent: 'center',
  },

  removeButtonText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },

  parameterDropdown: {
    marginLeft: 26,
    maxHeight: 190,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#0B1C32',
  },

  parameterOption: {
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#243D5C',
  },

  parameterOptionActive: {
    backgroundColor: '#183A5C',
  },

  parameterOptionText: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 12,
  },

  addParameterButton: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#142B49',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  addParameterText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },

  saveButton: {
    minHeight: 43,
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  saveHint: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'right',
  },
});
