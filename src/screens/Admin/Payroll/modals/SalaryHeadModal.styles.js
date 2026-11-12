import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backdrop: {
    flex: 1,

    justifyContent: 'center',

    paddingHorizontal: 14,

    backgroundColor: 'rgba(0, 0, 0, 0.78)',
  },

  modalCard: {
    width: '100%',

    padding: 16,

    backgroundColor: '#102B48',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 16,
  },

  header: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 10,

    marginBottom: 16,
  },

  title: {
    flex: 1,

    color: '#F8FAFC',

    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
  },

  closeButton: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  label: {
    color: '#C8D6E8',

    fontSize: 12,
    fontWeight: '700',

    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    minHeight: 46,

    paddingHorizontal: 12,

    color: '#F8FAFC',

    fontSize: 13,

    backgroundColor: '#0B1C31',

    borderWidth: 1,
    borderColor: '#3F7BA7',

    borderRadius: 9,
  },

  readOnlyInput: {
    color: '#B7C5D8',

    backgroundColor: '#10233B',
  },

  selectButton: {
    minHeight: 46,

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
    color: '#F8FAFC',

    fontSize: 13,
    fontWeight: '600',
  },

  dropdownMenu: {
    marginTop: 5,

    padding: 5,

    backgroundColor: '#08182A',

    borderWidth: 1,
    borderColor: '#3F7BA7',

    borderRadius: 9,
  },

  dropdownOption: {
    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 10,

    borderRadius: 7,
  },

  dropdownOptionSelected: {
    backgroundColor: '#102E4A',
  },

  dropdownOptionText: {
    color: '#CBD5E1',

    fontSize: 12,
    fontWeight: '600',
  },

  dropdownOptionTextSelected: {
    color: '#FFFFFF',

    fontWeight: '800',
  },

  saveButton: {
    minHeight: 46,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,

    marginTop: 15,

    backgroundColor: '#2563EB',

    borderRadius: 9,
  },

  saveButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  disabledButton: {
    opacity: 0.5,
  },
});
