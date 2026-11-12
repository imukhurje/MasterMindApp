import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.78)',

    paddingHorizontal: 14,
    paddingVertical: 32,
  },

  modal: {
    width: '100%',
    maxHeight: '90%',

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
    paddingBottom: 20,
  },

  label: {
    color: '#B9C8DC',

    fontSize: 11,
    fontWeight: '700',

    marginTop: 10,
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

  readOnlyField: {
    minHeight: 44,

    justifyContent: 'center',

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 9,

    paddingHorizontal: 11,
  },

  readOnlyText: {
    color: '#E0E7F1',

    fontSize: 12,
  },

  disabledField: {
    opacity: 0.5,
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

  checkCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 9,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 11,

    padding: 12,
  },

  checkText: {
    flex: 1,

    color: '#E0E7F1',

    fontSize: 11,
    lineHeight: 17,
  },

  notice: {
    color: '#DCE7F5',

    fontSize: 11,
    lineHeight: 17,

    marginTop: 14,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    gap: 8,

    marginTop: 16,
  },

  cancelButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 13,
  },

  cancelText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  submitButton: {
    flex: 1,
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    backgroundColor: '#2563EB',

    borderRadius: 9,

    paddingHorizontal: 10,
  },

  submitText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',

    textAlign: 'center',
  },

  calendarBackdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.78)',

    padding: 16,
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

  calendarClose: {
    width: 36,
    height: 36,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 9,
  },
});
