import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.78)',

    paddingHorizontal: 12,
    paddingVertical: 24,
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
    paddingBottom: 24,
  },

  label: {
    color: '#B9C8DC',

    fontSize: 10,
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

  helperText: {
    color: '#DCE7F5',

    fontSize: 10,
    lineHeight: 16,

    marginTop: 15,
  },

  linesHeader: {
    marginTop: 17,
  },

  sectionTitle: {
    color: '#F1F5F9',

    fontSize: 14,
    fontWeight: '900',
  },

  sectionHelp: {
    color: '#A8B6C9',

    fontSize: 10,
    lineHeight: 15,

    marginTop: 4,
  },

  debitCreditHeader: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginTop: 15,
    paddingHorizontal: 6,
  },

  debitCreditTitle: {
    color: '#F1F5F9',

    fontSize: 12,
    fontWeight: '900',
  },

  lineCard: {
    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 13,

    padding: 11,

    marginTop: 9,
  },

  lineTop: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 8,
  },

  lineTitle: {
    color: '#F1F5F9',

    fontSize: 12,
    fontWeight: '900',
  },

  lineActions: {
    flexDirection: 'row',

    gap: 7,
  },

  lineIconButton: {
    width: 40,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  lineSavedButton: {
    backgroundColor: 'rgba(52,211,153,0.16)',

    borderColor: '#34D399',
  },

  removeButton: {
    backgroundColor: '#2563EB',
  },

  pairRow: {
    flexDirection: 'row',

    gap: 8,

    marginTop: 12,
  },

  pairSide: {
    flex: 1,

    flexDirection: 'row',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 10,

    overflow: 'hidden',
  },

  accountButton: {
    flex: 1,

    minHeight: 48,

    justifyContent: 'center',

    paddingHorizontal: 9,
  },

  accountText: {
    color: '#F1F5F9',

    fontSize: 10,
    fontWeight: '700',
  },

  placeholderText: {
    color: '#718096',

    fontSize: 10,
  },

  amountInput: {
    width: 78,

    color: '#F1F5F9',

    backgroundColor: '#0B1A2E',

    paddingHorizontal: 8,

    fontSize: 11,
  },

  balanceBox: {
    padding: 12,

    marginTop: 15,

    borderWidth: 1,

    borderRadius: 11,
  },

  balanceBoxValid: {
    backgroundColor: 'rgba(16,185,129,0.12)',

    borderColor: '#34D399',
  },

  balanceBoxInvalid: {
    backgroundColor: 'rgba(245,158,11,0.12)',

    borderColor: '#F59E0B',
  },

  balanceText: {
    color: '#F1F5F9',

    fontSize: 10,
    lineHeight: 16,

    fontWeight: '700',
  },

  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,

    marginTop: 13,
  },

  secondaryButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 13,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  secondaryButtonText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',
  },

  primaryButton: {
    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    paddingHorizontal: 14,

    backgroundColor: '#2563EB',

    borderRadius: 9,
  },

  primaryButtonText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  accountPicker: {
    width: '100%',
    maxHeight: '72%',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 16,

    overflow: 'hidden',
  },

  accountPickerHeader: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    padding: 12,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  accountPickerTitle: {
    color: '#F1F5F9',

    fontSize: 15,
    fontWeight: '900',
  },

  smallCloseButton: {
    width: 36,
    height: 36,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 9,
  },

  accountSearch: {
    margin: 12,
  },

  accountOption: {
    minHeight: 55,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

    paddingHorizontal: 13,
    paddingVertical: 9,

    borderTopWidth: 1,
    borderTopColor: 'rgba(55,109,153,0.25)',
  },

  accountOptionTitle: {
    color: '#F1F5F9',

    fontSize: 11,
    fontWeight: '800',
  },

  accountOptionMeta: {
    color: '#A8B6C9',

    fontSize: 9,

    marginTop: 3,
  },

  noAccountText: {
    color: '#A8B6C9',

    fontSize: 11,

    textAlign: 'center',

    padding: 24,
  },
});
