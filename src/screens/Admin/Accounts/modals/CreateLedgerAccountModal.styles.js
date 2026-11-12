import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.78)',

    paddingHorizontal: 14,
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

  scroll: {
    flexGrow: 0,
  },

  content: {
    padding: 14,
    paddingBottom: 24,
  },

  row: {
    flexDirection: 'row',

    gap: 9,

    marginBottom: 10,
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

    gap: 7,

    paddingHorizontal: 11,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 9,
  },

  selectText: {
    flex: 1,

    color: '#F1F5F9',

    fontSize: 11,
    fontWeight: '700',
  },

  placeholderText: {
    flex: 1,

    color: '#718096',

    fontSize: 11,
  },

  helpText: {
    color: '#A8B6C9',

    fontSize: 10,
    lineHeight: 16,

    marginTop: 20,
  },

  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,

    marginTop: 8,
  },

  secondaryButton: {
    minHeight: 43,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 14,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  secondaryButtonText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',
  },

  submitButton: {
    minHeight: 43,

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

    fontSize: 10,
    fontWeight: '900',
  },

  selectionBackdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.78)',

    paddingHorizontal: 20,
  },

  selectionModal: {
    width: '100%',
    maxHeight: '70%',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 14,

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
    minHeight: 53,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 8,

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderTopWidth: 1,
    borderTopColor: 'rgba(55,109,153,0.28)',
  },

  selectionOptionActive: {
    backgroundColor: 'rgba(37,99,235,0.14)',
  },

  selectionOptionText: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '800',
  },

  selectionOptionTextActive: {
    color: '#7DD3FC',
  },

  selectionOptionCaption: {
    color: '#A8B6C9',

    fontSize: 9,

    marginTop: 3,
  },
});
