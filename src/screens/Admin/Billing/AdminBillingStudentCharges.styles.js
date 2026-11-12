import { StyleSheet } from 'react-native';

const COLORS = {
  BG: '#081321',
  CARD: '#102742',
  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',
  BORDER: '#376D99',
};

export default StyleSheet.create({
  content: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 30,
  },

  loadingContainer: {
    flex: 1,
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.MUTED,
    fontSize: 12,
    marginTop: 9,
  },

  searchBox: {
    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 11,

    marginBottom: 10,
  },

  searchInput: {
    flex: 1,

    color: '#FFFFFF',

    fontSize: 13,

    paddingVertical: 0,
  },

  listSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginBottom: 8,
  },

  listSummaryText: {
    color: COLORS.MUTED,
    fontSize: 10,
  },

  listSummaryHint: {
    color: '#67D1F0',
    fontSize: 9,
  },

  studentRow: {
    minHeight: 63,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#0C1B30',

    borderWidth: 1,
    borderColor: '#294B69',

    paddingHorizontal: 12,
    paddingVertical: 10,

    marginBottom: 1,
  },

  studentInfo: {
    flex: 1,
    paddingRight: 10,
  },

  studentName: {
    color: COLORS.TEXT,

    fontSize: 13,
    fontWeight: '900',
  },

  studentMeta: {
    color: '#B8C5D8',

    fontSize: 10,

    marginTop: 4,
  },

  modifiedIcon: {
    width: 20,
    height: 20,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#67D1F0',
  },

  emptyCard: {
    alignItems: 'center',

    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 14,

    padding: 25,
  },

  emptyTitle: {
    color: COLORS.TEXT,

    fontSize: 14,
    fontWeight: '900',

    marginTop: 8,
  },

  emptyText: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 5,
  },

  loadMoreButton: {
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 9,

    marginTop: 12,
  },

  loadMoreText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  footerSpace: {
    height: 18,
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.45,
  },
  detailsScreen: {
    flex: 1,
    backgroundColor: '#081321',
  },

  detailsContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 30,
  },

  backToStudentsButton: {
    alignSelf: 'flex-start',
    minHeight: 38,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 11,

    marginBottom: 14,
  },

  backToStudentsText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  detailsLoader: {
    minHeight: 260,

    alignItems: 'center',
    justifyContent: 'center',
  },

  studentDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 10,
  },

  studentDetailsInfo: {
    flex: 1,
  },

  detailsStudentName: {
    color: '#F1F5F9',

    fontSize: 16,
    fontWeight: '900',
  },

  detailsStudentMeta: {
    color: '#B8C5D8',

    fontSize: 11,

    marginTop: 5,
  },

  addStudentChargeButton: {
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,

    backgroundColor: '#2563EB',

    borderRadius: 10,

    paddingHorizontal: 11,
  },

  addStudentChargeText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',
  },

  detailsDivider: {
    height: 1,

    backgroundColor: 'rgba(55,109,153,0.45)',

    marginVertical: 16,
  },

  detailsSectionTitle: {
    color: '#F1F5F9',

    fontSize: 14,
    fontWeight: '900',
  },

  additionalSectionTitle: {
    marginTop: 20,
  },

  detailsSectionDescription: {
    color: '#A8B6C9',

    fontSize: 10,
    lineHeight: 15,

    marginTop: 5,
    marginBottom: 10,
  },

  studentChargeCard: {
    minHeight: 60,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 10,

    backgroundColor: '#0C1B30',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 10,

    padding: 11,

    marginBottom: 8,
  },

  studentChargeLeft: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 9,
  },

  studentChargeInfo: {
    flex: 1,
  },

  chargeCheckbox: {
    width: 18,
    height: 18,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#67D1F0',

    borderRadius: 2,
  },

  chargeCheckboxChecked: {
    backgroundColor: '#67D1F0',
  },

  studentChargeName: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  studentChargeCycle: {
    color: '#A8B6C9',

    fontSize: 9,

    marginTop: 3,
  },

  studentChargeAmountBadge: {
    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 999,

    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  studentChargeAmountText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '700',
  },

  studentChargesEmpty: {
    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 10,

    padding: 16,

    alignItems: 'center',
  },

  additionalChargesEmpty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#376D99',

    borderRadius: 10,

    padding: 18,

    alignItems: 'center',

    marginTop: 8,
  },

  studentChargesEmptyText: {
    color: '#B8C5D8',

    fontSize: 11,
    textAlign: 'center',
  },
  additionalChargeCard: {
    backgroundColor: '#0C1B30',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 10,

    padding: 11,

    marginTop: 8,
  },

  additionalChargeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 10,
  },

  additionalChargeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    gap: 8,

    marginTop: 10,
  },

  additionalChargeEditButton: {
    minHeight: 38,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 12,
  },

  additionalChargeEditText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  additionalChargeDeleteButton: {
    minHeight: 38,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,

    backgroundColor: '#EF4444',

    borderRadius: 9,

    paddingHorizontal: 12,
  },

  additionalChargeDeleteText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },
  chargeCheckboxUpdating: {
    opacity: 0.65,
  },
  studentChargeModalBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.76)',

    paddingHorizontal: 10,
    paddingVertical: 22,
  },

  studentChargeModal: {
    width: '100%',
    maxHeight: '94%',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 15,

    overflow: 'hidden',
  },

  studentChargeModalHeader: {
    minHeight: 60,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 15,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  studentChargeModalTitle: {
    color: '#FFFFFF',

    fontSize: 16,
    fontWeight: '900',
  },

  studentChargeModalClose: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  studentChargeModalContent: {
    padding: 15,
    paddingBottom: 18,
  },

  studentChargeFieldLabel: {
    color: '#DCE7F5',

    fontSize: 12,
    fontWeight: '700',

    marginTop: 10,
    marginBottom: 7,
  },

  studentChargePickerField: {
    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 11,
  },

  studentChargePickerValue: {
    flex: 1,

    color: '#FFFFFF',

    fontSize: 12,
  },

  studentChargePickerPlaceholder: {
    flex: 1,

    color: '#94A3B8',

    fontSize: 12,
  },

  studentChargeCatalogPanel: {
    marginTop: 4,

    backgroundColor: '#102A49',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    overflow: 'hidden',
  },

  studentChargeCatalogOption: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 8,

    paddingHorizontal: 11,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55,109,153,0.35)',
  },

  studentChargeCatalogOptionDisabled: {
    opacity: 0.45,
  },

  studentChargeCatalogText: {
    flex: 1,

    color: '#F8FAFC',

    fontSize: 12,
  },

  studentChargeCatalogTextDisabled: {
    color: '#94A3B8',
  },

  newChargeOptionText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  alreadyAttachedText: {
    color: '#94A3B8',

    fontSize: 9,
  },

  newChargeModeField: {
    minHeight: 46,

    justifyContent: 'center',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 11,
  },

  newChargeModeText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '700',
  },

  studentChargeInput: {
    minHeight: 48,

    color: '#FFFFFF',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 11,

    fontSize: 13,
  },

  studentChargeDropdown: {
    minHeight: 48,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 11,
  },

  studentChargeDropdownContainer: {
    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,
  },

  studentChargeDropdownSelected: {
    color: '#FFFFFF',

    fontSize: 12,
  },

  studentChargeDropdownItem: {
    color: '#FFFFFF',

    fontSize: 12,
  },

  studentChargeFieldDisabled: {
    opacity: 0.42,
  },

  studentChargeModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 18,
  },

  studentChargeCancelButton: {
    minHeight: 43,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 17,

    marginRight: 8,
  },

  studentChargeCancelText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  studentChargeSaveButton: {
    minWidth: 76,
    minHeight: 43,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 9,

    paddingHorizontal: 17,
  },

  studentChargeSaveText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  studentChargeDropdownPlaceholder: {
    color: '#94A3B8',
    fontSize: 12,
  },
});
