// src/screens/Admin/Student/AdminStudentIdentityCards.styles.js

import { StyleSheet } from 'react-native';

const BG = '#081524';
const CARD = '#0D2038';
const CARD_DARK = '#0B1C32';
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG,
  },

  loadingText: {
    color: MUTED,
    fontSize: 12,
    marginTop: 10,
  },

  content: {
    padding: 14,
    paddingBottom: 20,
  },

  filterCard: {
    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 12,
  },

  fieldLabel: {
    color: '#DCE7F5',
    fontSize: 12,
    fontWeight: '800',

    marginBottom: 6,
  },

  searchLabel: {
    marginTop: 12,
  },

  dropdown: {
    minHeight: 48,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  dropdownContainer: {
    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    overflow: 'hidden',
  },

  dropdownItemText: {
    color: TEXT,
    fontSize: 13,
  },

  dropdownSelectedText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '700',
  },

  dropdownPlaceholder: {
    color: '#8294AD',
    fontSize: 13,
  },

  input: {
    minHeight: 48,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    color: TEXT,
    fontSize: 13,

    paddingHorizontal: 12,
  },

  searchActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 12,
  },

  searchButton: {
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 10,

    paddingHorizontal: 17,

    marginRight: 8,
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',

    marginLeft: 6,
  },

  clearButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#17304C',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 18,
  },

  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  selectionCard: {
    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 12,

    padding: 11,

    marginTop: 10,
  },

  selectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectAllText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '800',

    marginLeft: 7,
  },

  selectionText: {
    color: MUTED,
    fontSize: 11,

    marginTop: 7,
    marginLeft: 29,
  },

  resultHeader: {
    marginTop: 14,
    marginBottom: 9,
  },

  resultHeaderText: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '700',
  },

  candidateCard: {
    minHeight: 90,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 13,

    padding: 12,
  },

  candidateCardSelected: {
    borderColor: '#60A5FA',
    backgroundColor: '#102844',
  },

  candidateCheck: {
    width: 34,

    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  candidateInfo: {
    flex: 1,
    minWidth: 0,
  },

  candidateName: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  candidateRole: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '800',

    marginTop: 4,
  },

  studentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    marginTop: 8,
  },

  studentMetaText: {
    color: MUTED,
    fontSize: 11,

    marginRight: 14,
    marginBottom: 3,
  },

  separator: {
    height: 8,
  },

  emptyCard: {
    minHeight: 170,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 13,

    padding: 20,
  },

  emptyTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',

    marginTop: 8,
  },

  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 14,
  },

  pageButton: {
    minWidth: 92,
    minHeight: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  pageButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  pageText: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '700',
  },

  downloadButton: {
    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 11,

    marginTop: 14,
  },

  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',

    marginLeft: 7,
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.45,
  },

  footerSpace: {
    height: 18,
  },
});
