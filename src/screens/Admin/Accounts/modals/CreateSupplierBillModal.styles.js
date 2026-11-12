import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.78)',

    paddingHorizontal: 14,
    paddingVertical: 30,
  },

  modal: {
    width: '100%',
    maxHeight: '88%',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 16,

    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',

    padding: 14,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  headerText: {
    flex: 1,

    paddingRight: 12,
  },

  title: {
    color: '#F1F5F9',

    fontSize: 17,
    fontWeight: '900',
  },

  subtitle: {
    color: '#DCE7F5',

    fontSize: 11,
    lineHeight: 17,

    marginTop: 4,
  },

  closeButton: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  scroll: {
    flexGrow: 0,
  },

  content: {
    padding: 14,
    paddingBottom: 18,
  },

  label: {
    color: '#B9C8DC',

    fontSize: 11,
    fontWeight: '700',

    marginTop: 11,
    marginBottom: 5,
  },

  input: {
    minHeight: 44,

    color: '#F1F5F9',

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 9,

    paddingHorizontal: 11,

    fontSize: 12,
  },

  descriptionInput: {
    minHeight: 74,

    paddingTop: 11,

    textAlignVertical: 'top',
  },

  selectButton: {
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 9,

    paddingHorizontal: 11,
  },

  selectText: {
    flex: 1,

    color: '#F1F5F9',

    fontSize: 12,
    fontWeight: '700',
  },

  placeholderText: {
    flex: 1,

    color: '#718096',

    fontSize: 12,
  },

  disabledField: {
    opacity: 0.5,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 8,

    marginTop: 9,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 9,

    padding: 10,
  },

  infoText: {
    flex: 1,

    color: '#DCE7F5',

    fontSize: 10,
    lineHeight: 16,
  },

  dateButton: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 9,

    paddingHorizontal: 11,
  },

  dateText: {
    color: '#F1F5F9',

    fontSize: 12,
  },

  actions: {
    flexDirection: 'row',

    gap: 8,

    marginTop: 18,
  },

  cancelButton: {
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 14,
  },

  cancelText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  submitButton: {
    flex: 1,
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    backgroundColor: '#2563EB',

    borderRadius: 9,

    paddingHorizontal: 10,
  },

  submitDisabled: {
    opacity: 0.4,
  },

  submitText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  selectionModal: {
    width: '100%',
    maxHeight: '70%',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 16,

    overflow: 'hidden',
  },

  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    padding: 12,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  selectionTitle: {
    color: '#F1F5F9',

    fontSize: 16,
    fontWeight: '900',
  },

  smallClose: {
    width: 36,
    height: 36,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 9,
  },

  selectionItem: {
    minHeight: 52,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 13,
    paddingVertical: 9,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55,109,153,0.30)',
  },

  selectionItemText: {
    flex: 1,

    color: '#F1F5F9',

    fontSize: 12,
    fontWeight: '700',
  },

  calendarModal: {
    width: '100%',
    maxWidth: 430,

    backgroundColor: '#0D2038',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 16,

    overflow: 'hidden',
  },

  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    padding: 11,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  calendarTitle: {
    color: '#F1F5F9',

    fontSize: 15,
    fontWeight: '900',
  },
});
