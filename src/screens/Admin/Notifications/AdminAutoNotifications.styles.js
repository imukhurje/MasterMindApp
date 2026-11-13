import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#142B49';
const INPUT = '#0B1C32';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';
const PRIMARY = '#2563EB';

export default StyleSheet.create({
  container: {
    paddingBottom: 20,
  },

  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 12,
  },

  filterCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: CARD,
    padding: 10,
    gap: 10,
  },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },

  eventField: {
    flex: 1.4,
    minWidth: 0,
  },

  statusField: {
    flex: 1,
    minWidth: 0,
  },

  dropdownWrapper: {
    width: '100%',
  },

  dropdownButton: {
    minHeight: 46,
    backgroundColor: INPUT,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
  },

  dropdownText: {
    color: TEXT,
    fontSize: 12,
    flex: 1,
    fontWeight: '600',
  },

  dropdownOptions: {
    backgroundColor: INPUT,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden',
  },

  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59,113,151,0.3)',
  },

  dropdownOptionSelected: {
    backgroundColor: 'rgba(37,99,235,0.18)',
  },

  dropdownOptionText: {
    color: TEXT,
    fontSize: 12,
  },

  searchInput: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: INPUT,
    color: TEXT,
    paddingHorizontal: 12,
    fontSize: 12,
  },

  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },

  primaryButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 9,
    paddingHorizontal: 14,
    gap: 5,
  },

  secondaryButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD,
    paddingHorizontal: 12,
  },

  addButton: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },

  actionText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },

  disabled: {
    opacity: 0.45,
  },

  filterHint: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 9,
  },

  paginationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 12,
    gap: 8,
  },

  paginationInfo: {
    color: MUTED,
    fontSize: 11,
  },

  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  pageButton: {
    minHeight: 36,
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  pageIndicator: {
    minHeight: 36,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: '#7DD3FC',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },

  pageIndicatorText: {
    color: '#082F49',
    fontSize: 12,
    fontWeight: '900',
  },

  tableCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: INPUT,
    overflow: 'hidden',
  },

  tableHeader: {
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    padding: 13,
  },

  tableHeaderText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
  },

  emptyState: {
    paddingHorizontal: 14,
    paddingVertical: 25,
    alignItems: 'center',
    gap: 9,
  },

  emptyText: {
    color: MUTED,
    fontSize: 12,
    textAlign: 'center',
  },

  mutedText: {
    color: MUTED,
    fontSize: 12,
    textAlign: 'center',
  },

  ruleCard: {
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 10,
  },

  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },

  ruleName: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
    flex: 1,
  },

  ruleStatus: {
    color: '#7DD3FC',
    fontSize: 11,
    fontWeight: '800',
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  detailLabel: {
    color: MUTED,
    fontSize: 11,
    width: 65,
  },

  detailValue: {
    color: TEXT,
    fontSize: 11,
    flex: 1,
    textAlign: 'right',
  },

  addModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.82)',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 25,
  },

  addModalCard: {
    width: '100%',
    maxWidth: 720,
    maxHeight: '94%',
    alignSelf: 'center',
    backgroundColor: '#0B162B',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 16,
    overflow: 'hidden',
  },

  addModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59,113,151,0.35)',
  },

  addModalTitle: {
    color: '#E2E8F0',
    fontSize: 17,
    fontWeight: '700',
  },

  addModalClose: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#142B49',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addModalScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },

  addModalContent: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 18,
    gap: 17,
  },

  addFormField: {
    gap: 8,
  },

  addFormLabel: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
  },

  addFormInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#0B1C32',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    fontSize: 13,
  },

  addEventSelector: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#0B1C32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },

  addEventText: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },

  addEventOptions: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#102844',
    overflow: 'hidden',
  },

  addEventOption: {
    minHeight: 43,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59,113,151,0.3)',
  },

  addEventOptionSelected: {
    backgroundColor: 'rgba(37,99,235,0.2)',
  },

  addEventOptionText: {
    color: '#F8FAFC',
    fontSize: 12,
    flex: 1,
  },

  addEventDescription: {
    color: '#AFC0D8',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },

  addEventInfo: {
    color: '#AFC0D8',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },

  addTemplateInput: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#0B1C32',
    color: '#F8FAFC',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    fontSize: 13,
    lineHeight: 20,
  },

  addTagsSection: {
    gap: 9,
  },

  addTagsLabel: {
    color: '#AFC0D8',
    fontSize: 12,
  },

  addTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  addTagChip: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 20,
    backgroundColor: '#0B1C32',
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  addTagText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },

  addDeliveryCard: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 12,
    backgroundColor: '#142B49',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },

  addDeliveryTitle: {
    color: '#AFC0D8',
    fontSize: 12,
  },

  addCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    minHeight: 30,
  },

  addCheckboxLabel: {
    color: '#E2E8F0',
    fontSize: 13,
  },

  addActiveLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  addModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,113,151,0.35)',
  },

  addCancelButton: {
    minHeight: 40,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#142B49',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addSaveButton: {
    minHeight: 40,
    paddingHorizontal: 15,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  ruleNameSection: {
    flex: 1,
    gap: 4,
  },

  ruleDeliveryCount: {
    color: '#AFC0D8',
    fontSize: 11,
    textAlign: 'left',
  },

  ruleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  ruleEditButton: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ruleDeleteButton: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionPressed: {
    opacity: 0.7,
  },

  eventSettingsContainer: {
    marginTop: 12,
    gap: 14,
  },

  occasionFieldsRow: {
    flexDirection: 'row',
    gap: 10,
  },

  occasionField: {
    flex: 1,
    minWidth: 0,
    gap: 7,
  },

  occasionRolesRow: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: '#0B1C32',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  occasionSelectedRole: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  occasionRoleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 3,
  },

  occasionRoleChip: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 18,
    backgroundColor: '#0B1C32',
  },

  occasionRoleChipSelected: {
    borderColor: '#7DD3FC',
    backgroundColor: '#183A5C',
  },

  occasionRoleChipText: {
    color: '#E2E8F0',
    fontSize: 11,
    textTransform: 'capitalize',
  },
});
