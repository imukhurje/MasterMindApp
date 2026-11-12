import { StyleSheet } from 'react-native';

const COLORS = {
  BG: '#081321',

  CARD: '#102742',
  CARD_DARK: '#0B1A2E',

  TEXT: '#F1F5F9',
  MUTED: '#AFC0D8',

  BORDER: '#376D99',

  PRIMARY: '#3B82F6',
  CYAN: '#7DD3FC',

  RED: '#EF4444',
  GREEN: '#22C55E',
};

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  loadingContainer: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 50,
  },

  loadingText: {
    color: COLORS.MUTED,

    fontSize: 12,

    marginTop: 10,
  },

  chargeTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,

    paddingHorizontal: 10,
    paddingTop: 10,
  },

  chargeTab: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 15,
  },

  chargeTabActive: {
    backgroundColor: '#67D1F0',

    borderColor: '#67D1F0',
  },

  chargeTabText: {
    color: '#E2E8F0',

    fontSize: 13,
    fontWeight: '800',
  },

  chargeTabTextActive: {
    color: '#082032',
  },

  listContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 30,
  },

  sectionDivider: {
    height: 1,

    backgroundColor: 'rgba(55,109,153,0.35)',

    marginBottom: 14,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 10,

    marginBottom: 14,
  },

  description: {
    flex: 1,

    color: COLORS.MUTED,

    fontSize: 11,
    lineHeight: 17,
  },

  addButton: {
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,

    backgroundColor: COLORS.PRIMARY,

    borderRadius: 10,

    paddingHorizontal: 13,
  },

  addButtonText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  separator: {
    height: 10,
  },

  chargeCard: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 15,

    padding: 13,
  },

  chargeMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 10,
  },

  chargeInfo: {
    flex: 1,
  },

  chargeName: {
    color: COLORS.TEXT,

    fontSize: 15,
    fontWeight: '900',
  },

  chargeMeta: {
    color: COLORS.MUTED,

    fontSize: 11,
    lineHeight: 16,

    marginTop: 4,
  },

  amountBadge: {
    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 999,

    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  amountBadgeText: {
    color: '#E2E8F0',

    fontSize: 11,
    fontWeight: '800',
  },

  chargeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 10,

    marginTop: 13,
  },

  statusBadge: {
    borderWidth: 1,

    borderRadius: 999,

    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  activeBadge: {
    borderColor: 'rgba(34,197,94,0.75)',

    backgroundColor: 'rgba(34,197,94,0.10)',
  },

  inactiveBadge: {
    borderColor: '#64748B',

    backgroundColor: 'rgba(100,116,139,0.10)',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },

  activeText: {
    color: '#86EFAC',
  },

  inactiveText: {
    color: '#CBD5E1',
  },

  actionRow: {
    flexDirection: 'row',

    gap: 8,
  },

  editButton: {
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

  editButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  deleteButton: {
    minHeight: 38,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,

    backgroundColor: COLORS.RED,

    borderRadius: 9,

    paddingHorizontal: 12,
  },

  deleteButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  emptyCard: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 15,

    alignItems: 'center',

    padding: 22,
  },

  studentChargesPlaceholder: {
    margin: 10,

    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 15,

    alignItems: 'center',

    padding: 24,
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
    lineHeight: 17,

    textAlign: 'center',

    marginTop: 5,
  },

  controlPressed: {
    opacity: 0.72,
  },
  chargeModalBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.76)',

    paddingHorizontal: 10,
    paddingVertical: 22,
  },

  chargeModal: {
    width: '100%',
    maxHeight: '94%',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 15,

    overflow: 'hidden',
  },

  chargeModalHeader: {
    minHeight: 62,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 15,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  chargeModalTitle: {
    color: '#FFFFFF',

    fontSize: 17,
    fontWeight: '900',
  },

  chargeModalCloseButton: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  chargeModalContent: {
    padding: 15,

    paddingBottom: 18,
  },

  chargeFieldLabel: {
    color: '#DCE7F5',

    fontSize: 12,
    fontWeight: '700',

    marginTop: 10,
    marginBottom: 7,
  },

  chargeInput: {
    minHeight: 48,

    color: '#FFFFFF',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,

    fontSize: 13,
  },

  chargeDropdown: {
    minHeight: 48,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  chargeDropdownContainer: {
    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    overflow: 'hidden',
  },

  chargeDropdownSelectedText: {
    color: '#F8FAFC',

    fontSize: 13,
  },

  chargeDropdownItemText: {
    color: '#F8FAFC',

    fontSize: 13,
  },

  chargeDropdownPlaceholder: {
    color: '#94A3B8',

    fontSize: 13,
  },

  chargeFieldDisabled: {
    opacity: 0.42,
  },

  chargeClassField: {
    minHeight: 50,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 10,
  },

  chargeClassFieldContent: {
    flex: 1,
  },

  chargeClassPlaceholder: {
    color: '#718096',

    fontSize: 12,
  },

  selectedChargeClasses: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 5,

    paddingVertical: 5,
  },

  chargeClassChip: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 5,

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 999,

    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  chargeClassChipText: {
    color: '#E2E8F0',

    fontSize: 10,
    fontWeight: '700',
  },

  chargeClassPicker: {
    marginTop: 5,

    backgroundColor: '#102A49',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    overflow: 'hidden',
  },

  chargeClassSearchBox: {
    minHeight: 45,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 7,

    paddingHorizontal: 10,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  chargeClassSearchInput: {
    flex: 1,

    color: '#FFFFFF',

    fontSize: 12,

    paddingVertical: 0,
  },

  chargeClassOptions: {
    maxHeight: 220,
  },

  chargeClassOption: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 11,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55,109,153,0.35)',
  },

  chargeClassOptionSelected: {
    backgroundColor: '#173B60',
  },

  chargeClassOptionText: {
    color: '#F8FAFC',

    fontSize: 12,
  },

  chargeClassEmpty: {
    color: '#A8B6C9',

    textAlign: 'center',

    fontSize: 11,

    paddingVertical: 18,
  },

  chargeModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 18,
  },

  chargeCancelButton: {
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 17,

    marginRight: 8,
  },

  chargeCancelText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  chargeSaveButton: {
    minWidth: 78,
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 9,

    paddingHorizontal: 18,
  },

  chargeSaveText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },
  controlDisabled: {
    opacity: 0.45,
  },
});
