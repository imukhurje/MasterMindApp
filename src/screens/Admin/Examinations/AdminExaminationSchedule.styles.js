import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#142B49';
const CARD_DARK = '#0B1C32';
const TEXT = '#FFFFFF';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';
const PRIMARY = '#2563EB';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  screenContent: {
    padding: 14,
  },

  centeredScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG,
  },

  loadingText: {
    color: MUTED,
    marginTop: 12,
  },

  headerCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: CARD,
    padding: 13,
    marginBottom: 10,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '900',
  },

  examinationName: {
    color: MUTED,
    fontSize: 10,
    marginTop: 4,
  },

  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 10,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendBox: {
    width: 12,
    height: 9,
    borderRadius: 3,
    borderWidth: 1,
    marginRight: 6,
  },

  legendBusy: {
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
    borderColor: 'rgba(96, 165, 250, 0.65)',
  },

  legendHoliday: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(248, 113, 113, 0.75)',
  },

  legendText: {
    color: MUTED,
    fontSize: 9,
  },

  calendarCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 43, 73, 0.40)',
    padding: 9,
  },

  calendarHeader: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    marginBottom: 4,
  },

  monthTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  monthTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  monthButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.65)',
    borderRadius: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
  },

  monthButtonText: {
    color: '#93C5FD',
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 10,
  },

  weekHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 113, 151, 0.30)',
    paddingBottom: 6,
    marginBottom: 7,
  },

  weekDay: {
    width: '14.2857%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  weekDayText: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
  },

  dayCell: {
    width: '14.2857%',
    minHeight: 74,
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.55)',
    backgroundColor: 'rgba(11, 28, 50, 0.88)',
    paddingHorizontal: 5,
    paddingVertical: 7,
  },
  dayCellEmpty: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },

  dayCellOutside: {
    backgroundColor: 'rgba(11, 28, 50, 0.45)',
  },

  dayCellHoliday: {
    borderColor: 'rgba(239, 68, 68, 0.60)',
    backgroundColor: 'rgba(239, 68, 68, 0.10)',
  },

  dayCellToday: {
    borderColor: '#38BDF8',
    borderWidth: 2,
  },

  dayCellSelected: {
    borderColor: '#60A5FA',
    borderWidth: 2,
    backgroundColor: 'rgba(37, 99, 235, 0.24)',
  },

  dayCellPressed: {
    opacity: 0.72,
  },

  dayTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dayNumberCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayNumberCircleToday: {
    backgroundColor: 'rgba(56, 189, 248, 0.20)',
  },

  dayNumberCircleSelected: {
    backgroundColor: '#2563EB',
  },

  dayNumber: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '900',
  },

  dayNumberOutside: {
    color: '#64748B',
  },

  dayNumberHoliday: {
    color: '#FCA5A5',
  },
  holidayBadge: {
    marginTop: 8,
  },

  holidayName: {
    color: '#FCA5A5',
    fontSize: 7,
    lineHeight: 10,
    fontWeight: '700',
  },

  weekendText: {
    color: '#FCA5A5',
    fontSize: 7,
    marginTop: 10,
  },

  availableText: {
    color: '#64748B',
    fontSize: 7,
    marginTop: 10,
  },

  dayNumberActive: {
    color: '#FFFFFF',
  },

  selectedIndicator: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.42,
  },

  hiddenMetadata: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },

  clearSelectedButton: {
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: 9,
  },

  clearSelectedText: {
    color: '#7DD3FC',
    fontSize: 9,
    fontWeight: '800',
  },
  dayCellBusy: {
    borderColor: '#3B82F6',
    borderWidth: 2,
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
  },

  busyText: {
    color: '#60A5FA',
    fontSize: 7,
    fontWeight: '900',
    marginTop: 8,
  },
  slotsSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 113, 151, 0.35)',
    paddingTop: 14,
  },

  slotsTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 12,
  },

  assignmentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },

  assignmentsTitle: {
    flex: 1,
    color: TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  addSlotButton: {
    minHeight: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
  },

  addSlotButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  noSlotsCard: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: 'rgba(11, 28, 50, 0.40)',
    padding: 14,
  },

  noSlotsText: {
    color: MUTED,
    fontSize: 10,
    textAlign: 'center',
  },

  slotCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 28, 50, 0.70)',
    padding: 10,
    marginBottom: 9,
  },

  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  slotTime: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
  },

  addPapersButton: {
    minHeight: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: 'rgba(20, 43, 73, 0.70)',
    paddingHorizontal: 10,
  },

  addPapersButtonText: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '800',
  },

  slotPapersList: {
    marginTop: 9,
    gap: 6,
  },

  slotPaperRow: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.50)',
    borderRadius: 8,
    backgroundColor: 'rgba(20, 43, 73, 0.35)',
    paddingHorizontal: 9,
    paddingVertical: 8,
  },

  slotPaperText: {
    flex: 1,
    color: TEXT,
    fontSize: 10,
    fontWeight: '800',
    marginRight: 8,
  },

  slotPaperTime: {
    color: MUTED,
    fontSize: 9,
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.64)',
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  slotModal: {
    width: '100%',
    maxWidth: 430,
    maxHeight: '82%',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: '#0B1C32',
    padding: 14,
  },

  paperPickerModal: {
    width: '100%',
    maxWidth: 430,
    maxHeight: '82%',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: '#0B1C32',
    padding: 14,
  },

  modalTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  modalDate: {
    color: MUTED,
    fontSize: 10,
    marginTop: 4,
    marginBottom: 14,
  },

  modalLoading: {
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalLoadingText: {
    color: MUTED,
    fontSize: 10,
    marginTop: 8,
  },

  fieldLabel: {
    color: MUTED,
    fontSize: 10,
    marginTop: 10,
    marginBottom: 5,
  },

  templateList: {
    maxHeight: 250,
  },

  templateRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.45)',
    borderRadius: 9,
    backgroundColor: 'rgba(20, 43, 73, 0.40)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 6,
  },

  templateRowSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
  },

  templateTime: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  templateLabel: {
    color: MUTED,
    fontSize: 9,
    marginTop: 3,
  },

  templateCheck: {
    color: '#60A5FA',
    fontSize: 16,
    fontWeight: '900',
  },

  customSlotFields: {
    marginTop: 8,
  },

  timeFieldsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  timeField: {
    flex: 1,
  },

  timeInput: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: CARD,
    color: TEXT,
    paddingHorizontal: 10,
    fontSize: 11,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 14,
  },

  modalCancelButton: {
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    paddingHorizontal: 14,
  },

  modalCancelText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  modalSaveButton: {
    minWidth: 85,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
  },

  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  paperPickerHelper: {
    color: MUTED,
    fontSize: 10,
    marginBottom: 10,
  },

  paperPickerList: {
    maxHeight: 390,
  },

  paperPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.45)',
    borderRadius: 10,
    backgroundColor: 'rgba(20, 43, 73, 0.40)',
    padding: 10,
    marginBottom: 7,
  },

  paperPickerRowSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(37, 99, 235, 0.20)',
  },

  paperPickerRowDisabled: {
    opacity: 0.35,
  },

  paperCheckbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  paperCheckboxSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#22C55E',
  },

  paperCheckboxCheck: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  paperPickerContent: {
    flex: 1,
  },

  paperPickerName: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  paperPickerSubtext: {
    color: MUTED,
    fontSize: 9,
    lineHeight: 13,
    marginTop: 3,
  },

  noAvailablePapers: {
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noAvailablePapersText: {
    color: MUTED,
    fontSize: 10,
    textAlign: 'center',
  },

  slotsTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },

  slotsTitleSection: {
    flex: 1,
  },

  selectedDayText: {
    color: MUTED,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  clearSelectedButton: {
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: 'rgba(11, 28, 50, 0.50)',
    paddingHorizontal: 11,
  },

  clearSelectedText: {
    color: '#7DD3FC',
    fontSize: 10,
    fontWeight: '800',
  },
  slotPaperRowSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(37, 99, 235, 0.14)',
  },

  scheduledCheckbox: {
    width: 21,
    height: 21,
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  scheduledCheckboxSelected: {
    borderColor: '#60A5FA',
    backgroundColor: '#2563EB',
  },

  scheduledCheckboxCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  slotPaperContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },

  selectedPaperActions: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 113, 151, 0.40)',
    marginTop: 10,
    paddingTop: 10,
  },

  unscheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  unscheduleButton: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#EF4444',
    paddingHorizontal: 13,
  },

  unscheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  orMoveText: {
    color: MUTED,
    fontSize: 10,
  },

  moveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 9,
  },

  moveSelectField: {
    flex: 1,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: 'rgba(11, 28, 50, 0.65)',
    paddingHorizontal: 9,
  },

  moveSelectText: {
    flex: 1,
    color: TEXT,
    fontSize: 10,
    fontWeight: '700',
  },

  moveSelectArrow: {
    color: MUTED,
    fontSize: 13,
    marginLeft: 7,
  },

  moveButton: {
    minWidth: 72,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
  },

  moveButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  movePickerModal: {
    width: '100%',
    maxWidth: 430,
    maxHeight: '75%',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    backgroundColor: '#0B1C32',
    padding: 14,
  },

  moveTemplateList: {
    maxHeight: 420,
  },
});
