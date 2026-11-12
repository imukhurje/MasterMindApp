import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    gap: 12,
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
    marginTop: -4,
  },

  card: {
    padding: 14,

    backgroundColor: '#0B1C31',

    borderWidth: 1,
    borderColor: '#3F7BA7',

    borderRadius: 13,
  },

  cardTitle: {
    color: '#F8FAFC',

    fontSize: 15,
    lineHeight: 20,

    fontWeight: '900',
  },

  cardDescription: {
    color: '#AFC2DA',

    fontSize: 12,
    lineHeight: 18,

    marginTop: 7,
    marginBottom: 4,
  },

  label: {
    color: '#E2E8F0',

    fontSize: 12,
    fontWeight: '800',

    marginTop: 13,
    marginBottom: 6,
  },

  selectButton: {
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 8,

    paddingHorizontal: 12,

    backgroundColor: '#10233B',

    borderWidth: 1,
    borderColor: '#3F7BA7',

    borderRadius: 9,
  },

  selectButtonText: {
    flex: 1,

    color: '#F8FAFC',

    fontSize: 13,
    lineHeight: 18,

    fontWeight: '600',
  },

  helperText: {
    color: '#AFC2DA',

    fontSize: 11,
    lineHeight: 16,

    marginTop: 8,
  },

  saveButton: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,

    marginTop: 13,

    paddingHorizontal: 14,

    backgroundColor: '#163653',

    borderWidth: 1,
    borderColor: '#4B89B6',

    borderRadius: 9,
  },

  saveButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    lineHeight: 17,

    fontWeight: '900',
  },

  disabledButton: {
    opacity: 0.5,
  },

  modalBackdrop: {
    flex: 1,

    justifyContent: 'center',

    paddingHorizontal: 18,

    backgroundColor: 'rgba(0, 0, 0, 0.78)',
  },

  selectionModal: {
    maxHeight: '70%',

    padding: 14,

    backgroundColor: '#102B48',

    borderWidth: 1,
    borderColor: '#4B89B6',

    borderRadius: 14,
  },

  modalHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,

    marginBottom: 10,
  },

  modalTitle: {
    flex: 1,

    color: '#F8FAFC',

    fontSize: 16,
    fontWeight: '900',
  },

  closeButton: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 9,
  },

  optionScroll: {
    flexGrow: 0,
  },

  optionRow: {
    minHeight: 50,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 8,

    paddingHorizontal: 11,

    borderBottomWidth: 1,
    borderBottomColor: '#294D6C',
  },

  optionRowSelected: {
    backgroundColor: '#15334F',
  },

  optionText: {
    flex: 1,

    color: '#CBD5E1',

    fontSize: 13,
    lineHeight: 18,

    fontWeight: '600',
  },

  optionTextSelected: {
    color: '#FFFFFF',

    fontWeight: '900',
  },
});
