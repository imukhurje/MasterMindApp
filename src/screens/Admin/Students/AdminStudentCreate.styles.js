// src/screens/Admin/Student/AdminStudentCreate.styles.js

import { StyleSheet } from 'react-native';

const BG = '#081524';
const CARD = '#102844';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  centeredScreen: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: MUTED,
    fontSize: 13,
    marginTop: 10,
  },

  content: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 16,
  },

  field: {
    flex: 1,
    marginBottom: 14,
  },

  label: {
    color: '#DCE7F5',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
  },

  required: {
    color: '#EF4444',
  },

  input: {
    minHeight: 50,
    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 11,

    color: TEXT,
    fontSize: 14,

    paddingHorizontal: 13,
    paddingVertical: 10,
  },

  placeholderText: {
    color: '#70839F',
  },

  twoColumnRow: {
    flexDirection: 'row',
    gap: 10,
  },

  halfField: {
    flex: 1,
    minWidth: 0,
  },

  dateButton: {
    minHeight: 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 11,

    paddingHorizontal: 13,
  },

  dateText: {
    color: TEXT,
    fontSize: 14,
  },

  fileButton: {
    minHeight: 50,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 11,

    paddingHorizontal: 11,
  },

  fileButtonText: {
    flex: 1,

    color: TEXT,
    fontSize: 12,

    marginHorizontal: 8,
  },

  photoPreview: {
    width: 32,
    height: 32,
    borderRadius: 7,
  },

  dropdown: {
    minHeight: 50,

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 11,

    paddingHorizontal: 12,
  },

  dropdownContainer: {
    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    overflow: 'hidden',
  },

  dropdownSelectedText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '600',
  },

  dropdownPlaceholder: {
    color: '#70839F',
    fontSize: 14,
  },

  dropdownItemText: {
    color: TEXT,
    fontSize: 14,
  },

  documentsCard: {
    backgroundColor: '#0D2038',

    borderWidth: 1,
    borderColor: '#254C72',

    borderRadius: 14,

    padding: 13,

    marginTop: 2,
  },

  documentsTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  documentsEmptyText: {
    color: '#BFDBFE',
    fontSize: 12,
    lineHeight: 17,

    marginTop: 10,
  },

  documentsSubtitle: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',

    marginTop: 17,
    marginBottom: 10,
  },

  documentHelp: {
    color: '#93C5FD',
    fontSize: 11,
    lineHeight: 16,

    marginTop: 3,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 14,
    marginBottom: 8,
  },

  cancelButton: {
    minHeight: 46,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 18,

    marginRight: 8,
  },

  cancelButtonText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
  },

  createButton: {
    minWidth: 82,
    minHeight: 46,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#3B82F6',

    borderRadius: 10,

    paddingHorizontal: 18,
  },

  createButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.45,
  },
});
