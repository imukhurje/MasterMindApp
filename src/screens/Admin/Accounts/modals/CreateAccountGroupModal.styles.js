import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.78)',

    paddingHorizontal: 14,
    paddingVertical: 28,
  },

  modal: {
    width: '100%',

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
    lineHeight: 16,

    marginTop: 5,
  },

  closeButton: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  content: {
    padding: 14,
  },

  row: {
    flexDirection: 'row',

    gap: 9,

    marginBottom: 11,
  },

  field: {
    flex: 1,
  },

  label: {
    color: '#B9C8DC',

    fontSize: 10,
    fontWeight: '700',

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

  selectButton: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 6,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 9,

    paddingHorizontal: 11,
  },

  selectText: {
    color: '#F1F5F9',

    fontSize: 11,
    fontWeight: '700',
  },

  actions: {
    flexDirection: 'row',

    gap: 8,

    marginTop: 4,
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

  cancelText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  submitButton: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    paddingHorizontal: 14,

    backgroundColor: '#2563EB',

    borderRadius: 9,
  },

  submitDisabled: {
    opacity: 0.55,
  },

  submitText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  selectionBackdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.78)',

    paddingHorizontal: 24,
  },

  selectionModal: {
    width: '100%',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 14,

    padding: 12,
  },

  selectionHeader: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 8,
  },

  selectionTitle: {
    color: '#F1F5F9',

    fontSize: 15,
    fontWeight: '900',
  },

  selectionClose: {
    width: 34,
    height: 34,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 8,
  },

  selectionOption: {
    minHeight: 48,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 10,

    borderTopWidth: 1,
    borderTopColor: 'rgba(55,109,153,0.28)',
  },

  selectionOptionActive: {
    backgroundColor: 'rgba(37,99,235,0.12)',
  },

  selectionOptionText: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '700',
  },

  selectionOptionTextActive: {
    color: '#7DD3FC',
  },
});
