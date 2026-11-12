import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.78)',

    paddingHorizontal: 14,
    paddingVertical: 26,
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

    gap: 10,

    padding: 14,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  title: {
    color: '#F1F5F9',

    fontSize: 17,
    fontWeight: '900',
  },

  subtitle: {
    color: '#A8B6C9',

    fontSize: 10,
    lineHeight: 15,

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
    paddingBottom: 22,
  },

  label: {
    color: '#B9C8DC',

    fontSize: 10,
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

    fontSize: 11,
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

    fontSize: 11,
    fontWeight: '700',
  },

  sectionHeader: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 18,
    marginBottom: 8,
  },

  sectionTitle: {
    color: '#F1F5F9',

    fontSize: 14,
    fontWeight: '900',
  },

  lineCount: {
    color: '#A8B6C9',

    fontSize: 9,
  },

  lineCard: {
    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 11,

    padding: 11,

    marginBottom: 9,
  },

  lineTitle: {
    color: '#F1F5F9',

    fontSize: 11,
    fontWeight: '900',
  },

  accountText: {
    color: '#A8B6C9',

    fontSize: 10,
    lineHeight: 15,

    marginTop: 5,
  },

  amountRow: {
    flexDirection: 'row',

    gap: 8,
  },

  amountField: {
    flex: 1,
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

  submitText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',

    textAlign: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.55,
  },
});
