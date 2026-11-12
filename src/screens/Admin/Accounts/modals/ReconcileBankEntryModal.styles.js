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

  headerText: {
    flex: 1,
  },

  title: {
    color: '#F1F5F9',

    fontSize: 17,
    fontWeight: '900',
  },

  subtitle: {
    color: '#DCE7F5',

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
    paddingBottom: 24,
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

  readOnlyField: {
    justifyContent: 'center',
  },

  readOnlyText: {
    color: '#F1F5F9',

    fontSize: 11,
    fontWeight: '700',
  },

  selectButton: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 8,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 9,

    paddingHorizontal: 11,
  },

  selectValue: {
    flex: 1,

    color: '#F1F5F9',

    fontSize: 10,
    fontWeight: '700',
  },

  selectPlaceholder: {
    flex: 1,

    color: '#718096',

    fontSize: 10,
  },

  disabledField: {
    opacity: 0.48,
  },

  noEntryMessage: {
    color: '#DCE7F5',

    fontSize: 10,
    lineHeight: 16,

    marginTop: 9,
  },

  checkLabel: {
    color: '#B9C8DC',

    fontSize: 10,
    fontWeight: '700',

    marginTop: 13,
    marginBottom: 5,
  },

  checkBox: {
    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 11,

    padding: 12,
  },

  checkBoxSuccess: {
    borderColor: '#34D399',

    backgroundColor: 'rgba(52,211,153,0.10)',
  },

  checkText: {
    color: '#F1F5F9',

    fontSize: 10,
    lineHeight: 16,
  },

  helpText: {
    color: '#DCE7F5',

    fontSize: 10,
    lineHeight: 16,

    marginTop: 14,
  },

  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,

    marginTop: 16,
  },

  cancelButton: {
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 14,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  cancelButtonText: {
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
    opacity: 0.45,
  },

  submitButtonText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',

    textAlign: 'center',
  },

  selectorBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.78)',

    padding: 16,
  },

  selectorCard: {
    maxHeight: '70%',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 16,

    overflow: 'hidden',
  },

  selectorHeader: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    padding: 13,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  selectorTitle: {
    color: '#F1F5F9',

    fontSize: 15,
    fontWeight: '900',
  },

  selectorClose: {
    width: 36,
    height: 36,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 9,
  },

  selectorScroll: {
    flexGrow: 0,
  },

  selectorOption: {
    minHeight: 56,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

    paddingHorizontal: 13,
    paddingVertical: 9,

    borderTopWidth: 1,
    borderTopColor: 'rgba(55,109,153,0.25)',
  },

  selectorOptionTitle: {
    color: '#F1F5F9',

    fontSize: 11,
    fontWeight: '800',
  },

  selectorOptionSubtitle: {
    color: '#A8B6C9',

    fontSize: 9,

    marginTop: 3,
  },

  selectorEmpty: {
    color: '#A8B6C9',

    fontSize: 11,

    textAlign: 'center',

    padding: 24,
  },
});
