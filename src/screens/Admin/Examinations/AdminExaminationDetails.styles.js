// src/screens/Admin/Examinations/AdminExaminationDetails.styles.js

import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#142B49';
const CARD_DARK = '#0B1C32';
const TEXT = '#FFFFFF';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';
const CHECKED = '#7DD3FC';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    padding: 14,
  },

  centeredScreen: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: MUTED,
    marginTop: 12,
  },

  headerCard: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: CARD,
    padding: 12,
    marginBottom: 10,
  },

  headerMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingRight: 10,
  },

  examinationName: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 23,
  },

  statusBadge: {
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
  },

  statusDraft: {
    backgroundColor: 'rgba(100, 116, 139, 0.18)',
    borderColor: 'rgba(148, 163, 184, 0.48)',
  },

  statusPublished: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(74, 222, 128, 0.48)',
  },

  statusResultPublished: {
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
    borderColor: 'rgba(96, 165, 250, 0.50)',
  },

  statusText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '800',
  },

  actionsButton: {
    minWidth: 100,
    minHeight: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  actionsButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  infoCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 43, 73, 0.38)',
    padding: 10,
    marginBottom: 10,
    gap: 8,
  },

  infoItem: {
    flexGrow: 1,
    minWidth: 94,
    borderRadius: 9,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  infoLabel: {
    color: MUTED,
    fontSize: 9,
    marginBottom: 4,
  },

  infoValue: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  papersSection: {
    flex: 1,
    minHeight: 180,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 43, 73, 0.30)',
    overflow: 'hidden',
  },

  sectionHeader: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  sectionTitleContent: {
    flex: 1,
    paddingRight: 8,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  sectionSubtitle: {
    color: MUTED,
    fontSize: 10,
    marginTop: 4,
  },

  sectionActions: {
    flexDirection: 'row',
    gap: 7,
  },

  collapseButton: {
    width: 42,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  collapseButtonText: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
  },

  tableHeader: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingHorizontal: 12,
  },

  tableNumber: {
    width: 38,
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
  },

  tablePaper: {
    flex: 1,
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
  },

  tableStatus: {
    width: 70,
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'right',
  },

  paperList: {
    flex: 1,
  },

  paperListContent: {
    padding: 10,
    paddingBottom: 18,
  },

  paperCard: {
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.75)',
    borderRadius: 14,
    backgroundColor: 'rgba(11, 28, 50, 0.82)',
    padding: 12,
    marginBottom: 10,
  },

  paperNumber: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  paperNumberText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
  },

  paperContent: {
    flex: 1,
  },

  paperName: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
  },

  paperMetadata: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 9,
  },

  metadataItem: {
    flex: 1,
  },

  metadataLabel: {
    color: MUTED,
    fontSize: 9,
  },

  metadataValue: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },

  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 50,
  },

  emptyStateTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
  },

  emptyStateText: {
    color: MUTED,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 7,
  },

  collapsedContent: {
    paddingVertical: 30,
    alignItems: 'center',
  },

  collapsedText: {
    color: MUTED,
    fontSize: 12,
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.38,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  actionsModal: {
    width: '100%',
    maxWidth: 430,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    backgroundColor: CARD_DARK,
    padding: 14,
  },

  actionsModalTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
  },

  actionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 62,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 11,
    backgroundColor: CARD,
    padding: 10,
  },

  actionOptionIcon: {
    color: CHECKED,
    fontSize: 24,
    marginRight: 11,
  },

  actionOptionContent: {
    flex: 1,
  },

  actionOptionTitle: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '800',
  },

  actionOptionDescription: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  modalCloseButton: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  modalCloseText: {
    color: TEXT,
    fontWeight: '800',
  },

  statusBadgePressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  statusEditIcon: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '900',
  },

  statusModal: {
    width: '100%',
    maxWidth: 430,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    backgroundColor: CARD_DARK,
    padding: 14,
  },

  statusModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  statusModalTitle: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '900',
  },

  statusModalCloseButton: {
    width: 42,
    height: 42,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
  },

  statusModalCloseIcon: {
    color: TEXT,
    fontSize: 27,
    lineHeight: 29,
    fontWeight: '400',
  },

  statusFieldLabel: {
    color: MUTED,
    fontSize: 12,
    marginBottom: 9,
  },

  statusOptions: {
    gap: 7,
  },

  statusOption: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(20, 43, 73, 0.28)',
  },

  statusOptionSelected: {
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
    borderColor: CHECKED,
  },

  statusRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: MUTED,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  statusRadioSelected: {
    borderColor: CHECKED,
  },

  statusRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: CHECKED,
  },

  statusOptionText: {
    color: MUTED,
    fontSize: 14,
  },

  statusOptionTextSelected: {
    color: TEXT,
    fontWeight: '800',
  },

  statusModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 9,
    marginTop: 18,
  },

  statusCancelButton: {
    minWidth: 82,
    minHeight: 44,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
    backgroundColor: CARD,
  },

  statusCancelButtonText: {
    color: TEXT,
    fontWeight: '800',
  },

  statusSaveButton: {
    minWidth: 82,
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
    backgroundColor: '#2563EB',
  },

  statusSaveButtonText: {
    color: TEXT,
    fontWeight: '900',
  },
  actionsButtonActive: {
    borderColor: CHECKED,
    backgroundColor: '#17375D',
  },

  actionsMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.20)',
  },

  actionsDropdown: {
    position: 'absolute',
    right: 14,
    width: 218,
    borderWidth: 1,
    borderColor: CHECKED,
    borderRadius: 15,
    backgroundColor: CARD_DARK,
    padding: 6,

    elevation: 12,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },

  actionsDropdownItem: {
    minHeight: 42,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 5,
    backgroundColor: CARD,
  },

  actionsDropdownItemPressed: {
    backgroundColor: '#1D4A73',
  },

  actionsDropdownItemText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '800',
  },

  actionsDropdownDeactivateItem: {
    marginBottom: 0,
    borderColor: '#EF4444',
    backgroundColor: '#EF4444',
  },

  actionsDropdownDeactivatePressed: {
    backgroundColor: '#B91C1C',
  },

  actionsDropdownDeactivateText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  evaluationIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    borderWidth: 1,
  },

  evaluationIconBoxSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.14)',
    borderColor: 'rgba(34, 197, 94, 0.55)',
  },

  evaluationIconBoxPending: {
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
    borderColor: 'rgba(239, 68, 68, 0.55)',
  },

  evaluationIcon: {
    fontSize: 17,
    lineHeight: 19,
    fontWeight: '900',
  },

  evaluationIconSuccess: {
    color: '#22C55E',
  },

  evaluationIconPending: {
    color: '#EF4444',
  },
  paperTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  paperInfoRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 13,
  },

  paperInfoItem: {
    flex: 1,
    borderRadius: 9,
    backgroundColor: 'rgba(20, 43, 73, 0.45)',
    paddingHorizontal: 9,
    paddingVertical: 7,
  },

  scheduleBlock: {
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(20, 43, 73, 0.42)',
    paddingHorizontal: 10,
    paddingVertical: 9,
  },

  scheduleContent: {
    marginTop: 7,
    paddingLeft: 2,
  },

  scheduleDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  scheduleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
    marginRight: 8,
  },

  scheduleDotEnd: {
    backgroundColor: '#818CF8',
  },

  scheduleConnector: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(148, 163, 184, 0.50)',
    marginLeft: 3.5,
  },

  scheduleDateText: {
    flex: 1,
    color: TEXT,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 15,
  },

  scheduleEmpty: {
    color: MUTED,
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 5,
  },

  paperBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  evaluationBadge: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 9,
    gap: 5,
  },

  evaluationBadgeSuccess: {
    borderColor: 'rgba(34, 197, 94, 0.65)',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },

  evaluationBadgePending: {
    borderColor: 'rgba(245, 158, 11, 0.65)',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },

  evaluationBadgeIcon: {
    fontSize: 13,
    fontWeight: '900',
  },

  evaluationBadgeIconSuccess: {
    color: '#22C55E',
  },

  evaluationBadgeIconPending: {
    color: '#F59E0B',
  },

  evaluationBadgeText: {
    fontSize: 9,
    fontWeight: '900',
  },

  evaluationBadgeTextSuccess: {
    color: '#4ADE80',
  },

  evaluationBadgeTextPending: {
    color: '#FBBF24',
  },
});
