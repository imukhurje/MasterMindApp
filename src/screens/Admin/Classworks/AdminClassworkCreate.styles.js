// src/screens/Admin/Classworks/AdminClassworkCreate.styles.js

import { StyleSheet } from 'react-native';

const BG = '#081524';
const CARD = '#102844';
const INPUT = '#0D2138';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#3E79A8';
const PRIMARY = '#3B82F6';

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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 19,
    fontWeight: '900',
  },

  roleText: {
    alignSelf: 'flex-start',

    color: '#7DD3FC',

    fontSize: 10,
    fontWeight: '800',

    marginTop: 4,
    marginBottom: 12,
  },

  field: {
    marginTop: 16,
  },

  fieldLabel: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 7,
  },

  requiredMark: {
    color: '#F87171',
  },

  input: {
    width: '100%',
    minHeight: 46,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 11,

    backgroundColor: INPUT,

    color: TEXT,

    fontSize: 13,

    paddingHorizontal: 13,
    paddingVertical: 10,
  },

  noteInput: {
    minHeight: 130,
    paddingTop: 12,
  },

  selectBox: {
    width: '100%',
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 11,

    backgroundColor: INPUT,

    paddingHorizontal: 13,
  },

  selectText: {
    flex: 1,

    color: TEXT,

    fontSize: 13,

    paddingRight: 8,
  },

  selectPlaceholder: {
    color: '#73869F',
  },

  divider: {
    height: 1,

    backgroundColor: 'rgba(62,121,168,0.35)',

    marginTop: 20,
  },

  section: {
    paddingTop: 18,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionTitle: {
    color: TEXT,

    fontSize: 15,
    fontWeight: '900',

    marginLeft: 7,
  },

  sectionSubtitle: {
    color: MUTED,

    fontSize: 11,

    marginTop: 4,
  },

  lockedInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    backgroundColor: 'rgba(59,130,246,0.08)',

    borderWidth: 1,
    borderColor: 'rgba(62,121,168,0.40)',

    borderRadius: 10,

    paddingHorizontal: 11,
    paddingVertical: 10,

    marginTop: 11,
  },

  lockedInfoText: {
    flex: 1,

    color: '#B8C8DB',

    fontSize: 11,
    lineHeight: 16,

    marginLeft: 8,
  },

  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',

    marginTop: 24,
  },

  cancelButton: {
    minWidth: 84,
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#0D2138',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 11,

    paddingHorizontal: 15,

    marginRight: 10,
  },

  cancelButtonText: {
    color: '#E2E8F0',

    fontSize: 12,
    fontWeight: '900',
  },

  createButton: {
    minWidth: 94,
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: PRIMARY,

    borderWidth: 1,
    borderColor: '#60A5FA',

    borderRadius: 11,

    paddingHorizontal: 17,
  },

  createButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  buttonDisabled: {
    opacity: 0.42,
  },

  controlPressed: {
    opacity: 0.72,
  },

  modalOverlay: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(2,8,23,0.78)',

    paddingHorizontal: 18,
  },

  modalCard: {
    width: '100%',
    maxHeight: '76%',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 17,

    overflow: 'hidden',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 15,
    paddingVertical: 13,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(62,121,168,0.40)',
  },

  modalTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  modalSubtitle: {
    color: MUTED,
    fontSize: 10,
    marginTop: 3,
  },

  modalCloseButton: {
    width: 34,
    height: 34,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 10,

    backgroundColor: '#183A5C',
  },

  classList: {
    maxHeight: 430,
  },

  classOption: {
    minHeight: 62,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(62,121,168,0.24)',
  },

  classOptionSelected: {
    backgroundColor: 'rgba(37,99,235,0.17)',
  },

  classOptionTextSection: {
    flex: 1,
    paddingRight: 10,
  },

  classOptionTitle: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '900',
  },

  classOptionSubtitle: {
    color: MUTED,
    fontSize: 9,
    marginTop: 4,
  },

  emptyClasses: {
    padding: 20,
    alignItems: 'center',
  },

  emptyClassesText: {
    color: MUTED,
    fontSize: 11,
  },

  subjectHint: {
    color: '#FCA5A5',
    fontSize: 11,
    marginTop: 7,
  },

  selectedSubjectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 10,
  },

  selectedSubjectChip: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: '#3E79A8',
    borderRadius: 8,
    backgroundColor: '#173E66',
  },

  selectedSubjectText: {
    color: '#DCEBFF',
    fontSize: 11,
    fontWeight: '700',
  },

  subjectSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  subjectCount: {
    color: '#AFC0D8',
    fontSize: 11,
    fontWeight: '700',
  },

  selectAllSubjects: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '800',
  },

  subjectOptionText: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },

  subjectModalFooter: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(62,121,168,0.35)',
    alignItems: 'flex-end',
  },

  subjectDoneButton: {
    minWidth: 90,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 9,
    paddingHorizontal: 16,
  },

  subjectDoneText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
});
