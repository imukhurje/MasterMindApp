import { StyleSheet } from 'react-native';

const COLORS = {
  BG: '#081321',

  CARD: '#102742',
  CARD_DARK: '#0B1A2E',

  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',

  BORDER: '#376D99',

  PRIMARY: '#3B82F6',
  CYAN: '#7DD3FC',
};

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 32,
  },

  loading: {
    flex: 1,
    backgroundColor: COLORS.BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.MUTED,
    fontSize: 12,
    marginTop: 9,
  },

  // Header
  headerCard: {
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 16,
    padding: 15,
    marginBottom: 18,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  headerTextArea: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: '900',
  },

  subtitle: {
    color: COLORS.MUTED,
    fontSize: 11,
    marginTop: 4,
  },

  modeBadge: {
    borderWidth: 1,
    borderColor: '#3B82F6',
    backgroundColor: '#102D4A',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  modeBadgeText: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '800',
  },

  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,113,151,0.35)',
  },

  studentInfoLabel: {
    color: COLORS.MUTED,
    fontSize: 10,
    marginRight: 8,
  },

  studentInfoValue: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  // Section
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  slotCount: {
    color: COLORS.MUTED,
    fontSize: 10,
  },

  // Day card
  dayCard: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },

  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  dayIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#173B60',
    borderWidth: 1,
    borderColor: '#376D99',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  dayIconText: {
    color: COLORS.CYAN,
    fontSize: 14,
    fontWeight: '900',
  },

  dayName: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  daySubtitle: {
    color: COLORS.MUTED,
    fontSize: 9,
    marginTop: 2,
  },

  daySlots: {
    gap: 9,
  },

  // Individual routine slot
  slotCard: {
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: '#294B69',
    borderRadius: 13,
    padding: 11,
  },

  slotTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102E4A',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  timeText: {
    color: '#E0F2FE',
    fontSize: 11,
    fontWeight: '800',
  },

  timeSeparator: {
    color: COLORS.MUTED,
    marginHorizontal: 3,
    fontSize: 10,
  },

  subjectBadge: {
    flexShrink: 1,
    marginLeft: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(59,130,246,0.14)',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  subjectBadgeText: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '800',
  },

  slotDetails: {
    gap: 6,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailLabel: {
    width: 52,
    color: COLORS.MUTED,
    fontSize: 9,
  },

  detailValue: {
    flex: 1,
    color: '#DCE6F3',
    fontSize: 10,
    fontWeight: '600',
  },

  // Empty
  emptyCard: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },

  emptyTitle: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  emptyText: {
    color: COLORS.MUTED,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 6,
  },

  adminRoutineActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },

  addSlotButton: {
    minHeight: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 9,

    paddingHorizontal: 16,
  },

  addSlotButtonText: {
    color: '#FFFFFF',

    fontSize: 13,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  addSlotBackdrop: {
    flex: 1,
    justifyContent: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.72)',

    paddingHorizontal: 14,
    paddingVertical: 30,
  },

  addSlotModal: {
    width: '100%',
    maxHeight: '92%',

    backgroundColor: '#0D2038',

    borderWidth: 1,
    borderColor: '#3B7197',

    borderRadius: 16,

    padding: 14,
  },

  addSlotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 12,
  },

  addSlotModalTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '900',
  },

  addSlotCloseButton: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 10,
  },

  addSlotCloseText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 24,
  },

  addSlotForm: {
    paddingBottom: 4,
  },

  addSlotTwoColumnRow: {
    flexDirection: 'row',
    gap: 10,
  },

  addSlotHalfField: {
    flex: 1,
    minWidth: 0,
  },

  addSlotLabel: {
    color: '#DCE7F5',

    fontSize: 13,
    fontWeight: '700',

    marginTop: 10,
    marginBottom: 6,
  },

  addSlotInputButton: {
    minHeight: 48,

    justifyContent: 'center',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  addSlotInputText: {
    color: '#F8FAFC',
    fontSize: 14,
  },

  addSlotDropdown: {
    minHeight: 48,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 12,
  },

  addSlotDropdownContainer: {
    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    overflow: 'hidden',
  },

  addSlotSelectedText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },

  addSlotItemText: {
    color: '#F8FAFC',
    fontSize: 13,
  },

  addSlotPlaceholder: {
    color: '#70839F',
    fontSize: 13,
  },

  addSlotSelectionHint: {
    color: '#93C5FD',

    fontSize: 10,
    fontWeight: '700',

    marginTop: 5,
  },

  addSlotActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 18,
  },

  addSlotCancelButton: {
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 18,

    marginRight: 8,
  },

  addSlotCancelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  addSlotSaveButton: {
    minWidth: 78,
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderRadius: 10,

    paddingHorizontal: 18,
  },

  addSlotSaveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  controlDisabled: {
    opacity: 0.45,
  },
  schoolSummaryCard: {
    backgroundColor: '#142B49',

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 16,

    padding: 14,

    marginBottom: 16,
  },

  schoolSummaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  schoolSummaryText: {
    flex: 1,
    paddingRight: 10,
  },

  schoolRoutineName: {
    color: COLORS.TEXT,

    fontSize: 16,
    fontWeight: '900',
  },

  schoolRoutineClass: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 4,
  },

  schoolModeBadge: {
    backgroundColor: '#102D4A',

    borderWidth: 1,
    borderColor: '#3B82F6',

    borderRadius: 999,

    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  schoolModeBadgeText: {
    color: '#93C5FD',

    fontSize: 10,
    fontWeight: '800',
  },

  schoolDayCard: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 16,

    padding: 12,

    marginBottom: 12,
  },

  schoolDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 11,
  },

  schoolDayHeaderText: {
    flex: 1,
  },

  schoolPeriodCount: {
    color: COLORS.MUTED,

    fontSize: 10,
  },

  schoolPeriods: {
    gap: 8,
  },

  schoolPeriodCard: {
    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 12,

    padding: 11,
  },

  schoolBreakCard: {
    backgroundColor: '#10253A',
  },

  schoolPeriodTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  schoolPeriodNumber: {
    width: 35,
    height: 35,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#376D99',

    marginRight: 9,
  },

  schoolPeriodNumberText: {
    color: COLORS.CYAN,

    fontSize: 11,
    fontWeight: '900',
  },

  schoolPeriodHeading: {
    flex: 1,
  },

  schoolPeriodLabel: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '800',
  },

  schoolPeriodTime: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 3,
  },

  schoolAssignment: {
    marginTop: 10,

    paddingTop: 9,

    borderTopWidth: 1,
    borderTopColor: 'rgba(59,113,151,0.38)',
  },

  schoolSubject: {
    color: '#BFDBFE',

    fontSize: 13,
    fontWeight: '900',
  },

  schoolAssignmentMeta: {
    marginTop: 5,

    gap: 3,
  },

  schoolTeacher: {
    color: '#DCE6F3',

    fontSize: 10,
  },

  schoolRoom: {
    color: COLORS.MUTED,

    fontSize: 10,
  },

  schoolEmptyAssignment: {
    marginTop: 9,

    paddingTop: 8,

    borderTopWidth: 1,
    borderTopColor: 'rgba(59,113,151,0.28)',
  },

  schoolEmptyAssignmentText: {
    color: '#718096',

    fontSize: 10,
    fontStyle: 'italic',
  },

  schoolBreakText: {
    color: '#FBBF24',

    fontSize: 11,
    fontWeight: '800',
  },

  schoolNoClassBox: {
    minHeight: 48,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.CARD_DARK,

    borderRadius: 10,
  },

  schoolNoClassText: {
    color: COLORS.MUTED,

    fontSize: 10,
    fontStyle: 'italic',
  },

  tutorialAdminDayCard: {
    backgroundColor: '#102742',
    borderWidth: 1,
    borderColor: '#376D99',
    borderRadius: 14,
    padding: 10,
  },

  tutorialAdminDaySlots: {
    gap: 8,
  },

  tutorialAdminSlotCard: {
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#4E92C7',
    borderRadius: 13,
    paddingHorizontal: 11,
    paddingVertical: 11,
  },

  tutorialAdminSlotTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  tutorialAdminSlotInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },

  tutorialAdminSlotTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 18,
  },

  tutorialAdminSlotMeta: {
    color: '#AFC0D8',
    fontSize: 11,
    lineHeight: 16,
  },

  tutorialAdminSlotClasses: {
    color: '#93C5FD',
    fontSize: 10,
    lineHeight: 15,
  },

  tutorialAdminSlotActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  tutorialAdminIconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#2563EB',
  },

  tutorialAdminIconText: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  slotSelectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 8,
    marginBottom: 5,
  },

  slotSelectedChip: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#3B7197',
    backgroundColor: '#1E3A66',
  },

  slotSelectedChipText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },

  slotSelectedChipRemove: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 16,
    fontWeight: '700',
  },
});
