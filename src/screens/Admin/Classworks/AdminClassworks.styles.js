// src/screens/Admin/Classworks/AdminClassworks.styles.js

import { StyleSheet } from 'react-native';

const BG = '#081524';
const CARD = '#132A46';
const CARD_PRESSED = '#183856';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#3E79A8';

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

  topSection: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchBox: {
    flex: 1,
    maxWidth: 520,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 11,

    backgroundColor: '#0D2138',
  },

  searchInput: {
    minHeight: 46,

    paddingHorizontal: 13,
    paddingVertical: 10,

    color: TEXT,
    fontSize: 13,
  },

  countText: {
    color: MUTED,

    fontSize: 14,
    fontWeight: '600',

    marginLeft: 14,
  },

  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 28,
  },

  separator: {
    height: 12,
  },

  card: {
    minHeight: 150,

    backgroundColor: CARD,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 17,

    paddingHorizontal: 16,
    paddingVertical: 15,
  },

  cardPressed: {
    backgroundColor: CARD_PRESSED,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  cardInfo: {
    flex: 1,
    minWidth: 0,
  },

  cardTitle: {
    color: TEXT,

    fontSize: 16,
    lineHeight: 21,

    fontWeight: '900',
  },

  classDate: {
    color: '#B5C8DD',

    fontSize: 12,
    lineHeight: 18,

    marginTop: 3,
  },

  cardBody: {
    color: '#E2E8F0',

    fontSize: 13,
    lineHeight: 19,

    marginTop: 13,

    paddingRight: 4,
  },

  emptyBody: {
    color: '#91A5BD',
  },

  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',

    marginTop: 15,
  },

  editButton: {
    minWidth: 62,
    minHeight: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#10263E',

    borderWidth: 1,
    borderColor: '#4C8BB9',

    borderRadius: 11,

    paddingHorizontal: 13,

    marginRight: 10,
  },

  editButtonText: {
    color: '#EAF4FF',

    fontSize: 12,
    fontWeight: '900',
  },

  deleteButton: {
    minWidth: 76,
    minHeight: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#E5484D',

    borderWidth: 1,
    borderColor: '#FF6B70',

    borderRadius: 11,

    paddingHorizontal: 14,
  },

  deleteButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  emptyCard: {
    minHeight: 160,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: BORDER,
    borderStyle: 'dashed',

    borderRadius: 16,

    backgroundColor: 'rgba(19,42,70,0.55)',

    padding: 20,

    marginTop: 12,
  },

  emptyTitle: {
    color: TEXT,

    fontSize: 14,
    fontWeight: '900',
  },

  emptyText: {
    color: MUTED,

    fontSize: 11,

    textAlign: 'center',

    marginTop: 5,
  },
  disabledActionButton: {
    backgroundColor: '#152A3F',
    borderColor: '#36536F',
    opacity: 0.55,
  },

  disabledDeleteButton: {
    backgroundColor: '#71343B',
    borderColor: '#8A434A',
    opacity: 0.55,
  },

  disabledActionText: {
    color: '#9AA9BA',
  },
  topActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  pageTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '900',
  },

  addClassworkButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#3B82F6',

    borderWidth: 1,
    borderColor: '#60A5FA',

    borderRadius: 11,

    paddingHorizontal: 16,
  },

  addClassworkButtonText: {
    color: '#FFFFFF',

    fontSize: 13,
    fontWeight: '900',
  },
  subjectText: {
    color: '#AFC0D8',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    marginTop: 5,
  },
});
