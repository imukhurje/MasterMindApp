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
    paddingBottom: 20,
  },

  row: {
    flexDirection: 'row',

    gap: 10,
  },

  contactRow: {
    marginTop: 10,
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

  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,

    marginTop: 14,
  },

  cancelButton: {
    minHeight: 43,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 14,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  cancelText: {
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
});
