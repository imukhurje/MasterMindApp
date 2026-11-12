// src/screens/Admin/Course/AdminCourses.styles.js

import { StyleSheet } from 'react-native';

const BG = '#081524';
const CARD = '#0B1C32';
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

    marginBottom: 12,
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

    paddingHorizontal: 13,

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

  searchPanel: {
    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 13,

    padding: 10,

    marginBottom: 14,
  },

  searchBox: {
    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 11,
  },

  searchInput: {
    flex: 1,

    color: TEXT,
    fontSize: 13,

    paddingHorizontal: 8,
    paddingVertical: 10,
  },

  searchActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 9,
  },

  searchButton: {
    minWidth: 82,
    minHeight: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 13,
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  clearButton: {
    minWidth: 70,
    minHeight: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 13,

    marginLeft: 8,
  },

  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
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

  courseCard: {
    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    padding: 13,
  },

  courseTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  courseInfo: {
    flex: 1,
    minWidth: 0,

    paddingRight: 8,
  },

  courseTitle: {
    color: TEXT,

    fontSize: 15,
    lineHeight: 20,

    fontWeight: '900',
  },

  courseDescription: {
    color: MUTED,

    fontSize: 11,
    lineHeight: 16,

    marginTop: 2,
  },

  courseActions: {
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

  classSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',

    marginTop: 11,

    borderTopWidth: 1,
    borderTopColor: '#234565',

    paddingTop: 9,
  },

  classLabel: {
    color: MUTED,

    fontSize: 11,
    lineHeight: 17,

    fontWeight: '700',

    marginRight: 4,
  },

  classValue: {
    flex: 1,

    color: '#DCE7F5',

    fontSize: 11,
    lineHeight: 17,
  },

  separator: {
    height: 10,
  },

  emptyCard: {
    minHeight: 170,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: CARD,

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

    marginTop: 5,
  },

  loadMoreButton: {
    minHeight: 46,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    marginTop: 13,
  },

  loadMoreText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.45,
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
    maxHeight: '90%',

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

    marginBottom: 12,
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

    fontSize: 12,
    fontWeight: '700',

    marginTop: 11,
    marginBottom: 7,
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

  assignedClassField: {
    minHeight: 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  assignedClassPlaceholder: {
    flex: 1,

    color: '#718096',
    fontSize: 13,
  },

  selectedClassChips: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  selectedClassChip: {
    minHeight: 30,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 15,

    paddingLeft: 9,
    paddingRight: 6,

    marginRight: 6,
    marginVertical: 2,
  },

  selectedClassChipText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '700',

    marginRight: 5,
  },

  assignedClassHint: {
    color: '#DCE7F5',
    fontSize: 12,
    marginLeft: 3,
  },

  classPickerPanel: {
    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    marginTop: 5,

    overflow: 'hidden',
  },

  classSearchBox: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#0B1C32',

    borderBottomWidth: 1,
    borderBottomColor: '#315F87',

    paddingHorizontal: 10,
  },

  classSearchInput: {
    flex: 1,

    color: '#FFFFFF',
    fontSize: 13,

    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  classOptionsList: {
    maxHeight: 190,
  },

  classOption: {
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 12,
  },

  classOptionSelected: {
    backgroundColor: '#173B60',
  },

  classOptionText: {
    color: '#F8FAFC',
    fontSize: 13,
  },

  classOptionsLoader: {
    minHeight: 90,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  classOptionsLoadingText: {
    color: '#AFC0D8',
    fontSize: 11,
    marginLeft: 7,
  },

  noClassOptionsText: {
    color: '#AFC0D8',

    fontSize: 12,

    padding: 14,
    textAlign: 'center',
  },

  createModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 16,
  },

  createCancelButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 18,

    marginRight: 8,
  },

  createCancelText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  createButton: {
    minWidth: 82,
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 9,

    paddingHorizontal: 18,
  },

  createButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },
});
