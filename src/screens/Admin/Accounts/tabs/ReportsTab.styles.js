// src/screens/Admin/Accounts/tabs/ReportsTab.styles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  areaContent: {
    gap: 12,
  },

  secondaryTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,
  },

  secondaryTabActive: {
    minHeight: 38,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,

    paddingHorizontal: 13,

    backgroundColor: '#2563EB',

    borderRadius: 9,
  },

  secondaryTabTextActive: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',
  },

  sectionCard: {
    backgroundColor: '#102E4A',

    borderWidth: 1,
    borderColor: '#3B82B4',

    borderRadius: 14,

    padding: 13,
  },

  sectionTitle: {
    color: '#F1F5F9',

    fontSize: 15,
    fontWeight: '900',
  },

  sectionDescription: {
    color: '#B8C7DA',

    fontSize: 10,
    lineHeight: 16,

    marginTop: 4,
  },

  primaryButton: {
    alignSelf: 'flex-start',

    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    marginTop: 13,

    paddingHorizontal: 13,

    backgroundColor: '#2563EB',

    borderRadius: 9,
  },

  primaryButtonText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',
  },

  filterHeader: {
    alignItems: 'flex-start',

    marginTop: 13,
    marginBottom: 2,
  },

  clearDateButton: {
    minHeight: 38,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,

    paddingHorizontal: 11,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    backgroundColor: '#0B1A2E',
  },

  clearDateButtonText: {
    color: '#F1F5F9',

    fontSize: 9,
    fontWeight: '800',
  },

  filterRow: {
    flexDirection: 'row',

    gap: 8,

    marginTop: 8,
  },

  filterField: {
    flex: 1,
  },

  filterLabel: {
    color: '#B8C7DA',

    fontSize: 9,
    fontWeight: '700',

    marginTop: 9,
    marginBottom: 5,
  },

  dateButton: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 6,

    paddingHorizontal: 10,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 9,
  },

  dateButtonText: {
    color: '#F1F5F9',

    fontSize: 10,
    fontWeight: '700',
  },

  placeholder: {
    color: '#718096',
  },

  filterInput: {
    minHeight: 44,

    color: '#F1F5F9',

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 9,

    paddingHorizontal: 10,

    fontSize: 10,
  },

  filterInputNoMargin: {
    minHeight: 44,

    color: '#F1F5F9',

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 9,

    paddingHorizontal: 10,

    fontSize: 10,
  },

  applyFilterButton: {
    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    marginTop: 12,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    backgroundColor: '#0B1A2E',
  },

  applyFilterButtonText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',
  },

  divider: {
    height: 1,

    backgroundColor: '#1F5277',

    marginVertical: 13,
  },

  emptyCard: {
    alignItems: 'center',

    paddingVertical: 23,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#315E84',

    borderRadius: 11,
  },

  emptyTitle: {
    color: '#F1F5F9',

    fontSize: 12,
    fontWeight: '900',

    marginTop: 7,
  },

  emptyText: {
    color: '#8EA1B8',

    fontSize: 9,

    marginTop: 4,
  },

  cardList: {
    gap: 9,
  },

  reportCard: {
    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#315E84',

    borderRadius: 11,

    padding: 11,
  },

  reportCardHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,
  },

  reportCardTitle: {
    color: '#F1F5F9',

    fontSize: 11,
    fontWeight: '900',
  },

  reportCardDate: {
    color: '#8EA1B8',

    fontSize: 9,

    marginTop: 3,
  },

  dataDivider: {
    height: 1,

    backgroundColor: '#244C6B',

    marginVertical: 9,
  },

  amountRow: {
    flexDirection: 'row',

    gap: 10,
  },

  amountItem: {
    flex: 1,
  },

  amountLabel: {
    color: '#8195AE',

    fontSize: 8,
    fontWeight: '700',
  },

  debitValue: {
    color: '#34D399',

    fontSize: 11,
    fontWeight: '900',

    marginTop: 3,
  },

  creditValue: {
    color: '#FBBF24',

    fontSize: 11,
    fontWeight: '900',

    marginTop: 3,
  },

  resultCount: {
    color: '#9FB1C8',

    fontSize: 9,

    marginTop: 12,
  },

  pressed: {
    opacity: 0.78,
  },
  downloadRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,

    marginTop: 12,
  },

  downloadPrimaryButton: {
    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    paddingHorizontal: 13,

    backgroundColor: '#2563EB',

    borderRadius: 9,
  },

  downloadPrimaryText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',
  },

  downloadOutlineButton: {
    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    paddingHorizontal: 13,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  downloadOutlineText: {
    color: '#F1F5F9',

    fontSize: 10,
    fontWeight: '900',
  },

  buttonDisabled: {
    opacity: 0.5,
  },
});
