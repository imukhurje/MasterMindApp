import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  sectionCard: {
    backgroundColor: '#102E4A',

    borderWidth: 1,
    borderColor: '#3B82B4',

    borderRadius: 14,

    padding: 13,
    marginBottom: 12,
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

  informationCard: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: 9,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#315E84',

    borderRadius: 12,

    padding: 12,

    marginTop: 13,
  },

  informationText: {
    flex: 1,

    color: '#DCE7F5',

    fontSize: 10,
    lineHeight: 17,
  },

  reloadButton: {
    alignSelf: 'flex-start',

    minHeight: 40,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,

    paddingHorizontal: 12,

    marginTop: 11,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  reloadButtonText: {
    color: '#F1F5F9',

    fontSize: 10,
    fontWeight: '900',
  },

  filterLabel: {
    color: '#B8C7DA',

    fontSize: 10,
    fontWeight: '700',

    marginTop: 13,
    marginBottom: 5,
  },

  searchInput: {
    minHeight: 44,

    backgroundColor: '#0B1A2E',

    color: '#F1F5F9',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 9,

    paddingHorizontal: 11,

    fontSize: 11,
  },

  coreRoleWrap: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 7,
  },

  coreRoleChip: {
    minHeight: 35,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 4,

    paddingHorizontal: 10,

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 18,

    backgroundColor: '#0B1A2E',
  },

  coreRoleChipActive: {
    backgroundColor: '#2563EB',

    borderColor: '#4F8DF7',
  },

  coreRoleText: {
    color: '#C7D5E8',

    fontSize: 10,
    fontWeight: '800',
  },

  coreRoleTextActive: {
    color: '#FFFFFF',
  },

  applyButton: {
    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    marginTop: 13,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  applyButtonText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',
  },

  divider: {
    height: 1,

    backgroundColor: '#1F5277',

    marginVertical: 13,
  },

  cardList: {
    gap: 9,
  },

  userCard: {
    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#315E84',

    borderRadius: 12,

    padding: 11,
  },

  userHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,
  },

  employeeBadge: {
    minWidth: 82,

    minHeight: 34,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 9,

    paddingHorizontal: 8,
  },

  employeeBadgeText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',
  },

  userIdentity: {
    flex: 1,
  },

  userName: {
    color: '#F1F5F9',

    fontSize: 13,
    fontWeight: '900',
  },

  userEmail: {
    color: '#9FB1C8',

    fontSize: 9,
    lineHeight: 14,

    marginTop: 2,
  },

  dataDivider: {
    height: 1,

    backgroundColor: '#244C6B',

    marginVertical: 10,
  },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,
  },

  infoItem: {
    width: '48%',
  },

  infoLabel: {
    color: '#8195AE',

    fontSize: 8,
    fontWeight: '700',
  },

  infoValue: {
    color: '#F1F5F9',

    fontSize: 10,
    fontWeight: '800',

    marginTop: 3,
  },

  effectiveRoleText: {
    color: '#7DD3FC',
  },

  sourceBadge: {
    alignSelf: 'flex-start',

    flexDirection: 'row',
    alignItems: 'center',

    gap: 5,

    marginTop: 11,

    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 16,

    borderWidth: 1,
  },

  inheritedBadge: {
    backgroundColor: '#08314D',

    borderColor: '#176792',
  },

  noAccessBadge: {
    backgroundColor: '#101C30',

    borderColor: '#3B526C',
  },

  sourceBadgeText: {
    color: '#DCE7F5',

    fontSize: 9,
    fontWeight: '800',
  },

  roleSelectorLabel: {
    color: '#B8C7DA',

    fontSize: 9,
    fontWeight: '800',

    marginTop: 12,
    marginBottom: 5,
  },

  dropdown: {
    minHeight: 44,

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 9,

    paddingHorizontal: 10,
  },

  dropdownContainer: {
    backgroundColor: '#102742',

    borderColor: '#376D99',

    borderRadius: 9,
  },

  dropdownItemText: {
    color: '#F1F5F9',

    fontSize: 11,
  },

  dropdownSelectedText: {
    color: '#F1F5F9',

    fontSize: 10,
    fontWeight: '700',
  },

  dropdownPlaceholder: {
    color: '#8EA1B8',

    fontSize: 10,
  },

  actionRow: {
    flexDirection: 'row',

    gap: 8,

    marginTop: 11,
  },

  saveButton: {
    flex: 1,

    minHeight: 40,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,

    backgroundColor: '#2563EB',

    borderRadius: 8,
  },

  saveButtonText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',
  },

  clearButton: {
    minWidth: 90,

    minHeight: 40,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,

    borderWidth: 1,
    borderColor: '#456B8C',

    borderRadius: 8,
  },

  clearButtonText: {
    color: '#DCE7F5',

    fontSize: 10,
    fontWeight: '900',
  },

  buttonDisabled: {
    opacity: 0.4,
  },

  pressed: {
    opacity: 0.78,
  },

  resultCount: {
    color: '#9FB1C8',

    fontSize: 9,

    marginTop: 12,
  },

  emptyCard: {
    alignItems: 'center',

    paddingVertical: 22,

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
});
