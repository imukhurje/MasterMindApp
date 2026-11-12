// src/screens/Admin/Class/AdminClassGroups.styles.js

import { StyleSheet } from 'react-native';

const BG = '#081524';
const CARD = '#102844';
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
    padding: 14,
    paddingBottom: 22,
  },

  topActions: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 14,
  },

  downloadButton: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 14,

    marginRight: 8,
  },

  downloadButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',

    marginLeft: 6,
  },

  addButton: {
    flex: 1,

    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 10,

    paddingHorizontal: 13,
  },

  addButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',

    marginLeft: 5,
  },

  filterSection: {
    marginBottom: 14,
  },

  filterLabel: {
    color: '#DCE7F5',

    fontSize: 13,
    fontWeight: '800',

    marginBottom: 7,
  },

  dropdown: {
    minHeight: 48,

    backgroundColor: CARD,

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

  dropdownSelectedText: {
    color: TEXT,

    fontSize: 13,
    fontWeight: '700',
  },

  dropdownItemText: {
    color: TEXT,

    fontSize: 13,
  },

  dropdownPlaceholder: {
    color: MUTED,

    fontSize: 13,
  },

  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 10,
  },

  listHeadingTitle: {
    color: TEXT,

    fontSize: 17,
    fontWeight: '900',
  },

  listHeadingCount: {
    color: MUTED,

    fontSize: 11,
  },

  classCard: {
    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 13,
  },

  classCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  classInfo: {
    flex: 1,
    minWidth: 0,

    paddingRight: 8,
  },

  className: {
    color: TEXT,

    fontSize: 15,
    lineHeight: 20,

    fontWeight: '900',
  },

  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  editButton: {
    minHeight: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 13,

    marginRight: 7,
  },

  editButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  deleteButton: {
    minHeight: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 9,

    paddingHorizontal: 13,
  },

  deleteButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  academicYearText: {
    color: MUTED,

    fontSize: 11,
    lineHeight: 17,

    marginTop: 11,
  },

  descriptionText: {
    color: '#C6D4E8',

    fontSize: 11,
    lineHeight: 17,

    marginTop: 5,
  },

  separator: {
    height: 10,
  },

  emptyCard: {
    minHeight: 170,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 20,
  },

  emptyTitle: {
    color: TEXT,

    fontSize: 15,
    fontWeight: '900',

    marginTop: 10,
  },

  emptyText: {
    color: MUTED,

    fontSize: 11,
    lineHeight: 17,

    textAlign: 'center',

    marginTop: 5,
  },

  controlPressed: {
    opacity: 0.72,
  },

  footerSpace: {
    height: 20,
  },
  createModalBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.72)',

    paddingHorizontal: 14,
  },

  createModal: {
    width: '100%',

    backgroundColor: '#0D2038',

    borderWidth: 1,
    borderColor: '#3B7197',

    borderRadius: 16,

    padding: 15,
  },

  createModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 14,
  },

  createModalTitle: {
    color: '#F8FAFC',

    fontSize: 17,
    fontWeight: '900',
  },

  createModalCloseButton: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  createFieldLabel: {
    color: '#DCE7F5',

    fontSize: 13,
    fontWeight: '700',

    marginTop: 10,
    marginBottom: 7,
  },

  requiredText: {
    color: '#EF4444',
  },

  createInput: {
    minHeight: 48,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    color: '#FFFFFF',
    fontSize: 14,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  descriptionInput: {
    minHeight: 100,
  },

  createDropdown: {
    minHeight: 48,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  createModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 16,
  },

  createCancelButton: {
    minHeight: 43,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 17,

    marginRight: 8,
  },

  createCancelText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  createButton: {
    minWidth: 82,
    minHeight: 43,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 9,

    paddingHorizontal: 17,
  },

  createButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  controlDisabled: {
    opacity: 0.45,
  },
  disabledDropdown: {
    opacity: 0.75,
  },

  existingSectionsArea: {
    marginTop: 10,
  },

  existingSectionsLabel: {
    color: '#AFC0D8',

    fontSize: 11,
    lineHeight: 16,

    marginBottom: 8,
  },

  sectionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  sectionChip: {
    minWidth: 30,
    minHeight: 30,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#67D1F0',

    borderRadius: 15,

    paddingHorizontal: 9,

    marginRight: 7,
    marginBottom: 5,
  },

  sectionChipText: {
    color: '#D8F5FF',

    fontSize: 11,
    fontWeight: '800',
  },
});
