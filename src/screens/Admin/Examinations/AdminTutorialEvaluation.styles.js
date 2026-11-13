import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#142B49';
const INPUT = '#0B1C32';
const BORDER = '#3B7197';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  center: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  content: { padding: 14, paddingBottom: 32, gap: 13 },
  pageTitle: { color: TEXT, fontSize: 19, fontWeight: '900' },
  sectionTitle: { color: TEXT, fontSize: 15, fontWeight: '900', marginTop: 12 },
  hint: { color: MUTED, fontSize: 11, lineHeight: 17 },
  card: {
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 14,
    padding: 13,
    gap: 8,
  },
  label: { color: '#E2E8F0', fontSize: 11, fontWeight: '700', marginTop: 10 },
  input: {
    minHeight: 44,
    color: TEXT,
    backgroundColor: INPUT,
    borderRadius: 9,
    borderColor: BORDER,
    borderWidth: 1,
    paddingHorizontal: 11,
    fontSize: 12,
  },
  select: {
    minHeight: 44,
    backgroundColor: INPUT,
    borderRadius: 9,
    borderColor: BORDER,
    borderWidth: 1,
    paddingHorizontal: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  arrow: { color: '#7DD3FC', fontSize: 18 },
  bodyText: { color: TEXT, fontSize: 12, flexShrink: 1 },
  subjectCard: {
    marginTop: 7,
    padding: 10,
    backgroundColor: INPUT,
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    gap: 4,
  },
  primaryButton: {
    minHeight: 44,
    backgroundColor: '#2563EB',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginTop: 9,
  },
  secondaryButton: {
    minHeight: 38,
    backgroundColor: INPUT,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
    alignSelf: 'flex-start',
  },
  removeButton: {
    minHeight: 36,
    backgroundColor: '#DC3545',
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  buttonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  checkboxRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingVertical: 4,
  },
  checkbox: { color: '#7DD3FC', fontSize: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  savedCard: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: INPUT,
    borderRadius: 9,
    borderColor: '#334155',
    borderWidth: 1,
  },
  studentCard: {
    backgroundColor: INPUT,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  studentName: { color: TEXT, fontSize: 12, fontWeight: '800' },
  markRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  markLabel: { color: MUTED, fontSize: 11, flex: 1 },
  markInput: {
    width: 74,
    minHeight: 38,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    backgroundColor: CARD,
    color: TEXT,
    textAlign: 'center',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
  },
  backdrop: { ...StyleSheet.absoluteFillObject },
  modalCard: {
    width: '100%',
    maxHeight: '77%',
    backgroundColor: INPUT,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    padding: 14,
    gap: 10,
  },
  modalTitle: { color: TEXT, fontSize: 15, fontWeight: '900' },
  modalList: { flexGrow: 0 },
  modalOption: {
    minHeight: 45,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: CARD,
    borderRadius: 8,
    marginBottom: 6,
  },

  marksGridSection: {
    marginTop: 14,
    gap: 10,
  },

  marksStudentCard: {
    backgroundColor: '#0B1C32',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 12,
    padding: 12,
    gap: 11,
  },

  marksAbsentCard: {
    backgroundColor: 'rgba(100,116,139,0.14)',
    borderColor: '#64748B',
  },

  marksStudentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  marksStudentInfo: {
    flex: 1,
  },

  marksStudentName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
  },

  marksRoll: {
    color: '#AFC0D8',
    fontSize: 10,
    marginTop: 4,
  },

  absentControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    minHeight: 38,
    paddingHorizontal: 5,
  },

  absentCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  absentCheckboxChecked: {
    backgroundColor: '#60A5FA',
    borderColor: '#60A5FA',
  },

  absentTick: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '900',
  },

  absentLabel: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },

  subjectMarksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  subjectMarksInfo: {
    flex: 1,
    minWidth: 0,
  },

  subjectMarksName: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '800',
  },

  subjectFullMarks: {
    color: '#94A3B8',
    fontSize: 9,
    marginTop: 3,
  },

  studentMarkInput: {
    width: 115,
    minHeight: 42,
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    color: '#FFFFFF',
    fontSize: 12,
    paddingHorizontal: 10,
  },

  studentMarkInputDisabled: {
    backgroundColor: '#111827',
    opacity: 0.45,
  },

  marksGridFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },

  reviewMarksButton: {
    minHeight: 42,
    backgroundColor: '#2563EB',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  reviewMarksButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  newEvaluationButton: {
    minHeight: 42,
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  newEvaluationButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  marksReviewCard: {
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    gap: 7,
  },

  reviewSubjectText: {
    color: '#E2E8F0',
    fontSize: 11,
  },

  reviewNotice: {
    color: '#FBBF24',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 10,
  },

  confirmSection: {
    gap: 12,
    paddingBottom: 25,
  },

  confirmTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '900',
  },

  confirmDescription: {
    color: '#AFC0D8',
    fontSize: 11,
    lineHeight: 18,
  },

  confirmDetailsCard: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 12,
    backgroundColor: '#142B49',
    padding: 12,
    gap: 12,
  },

  confirmDetailRow: {
    gap: 5,
  },

  confirmDetailLabel: {
    color: '#AFC0D8',
    fontSize: 10,
  },

  confirmDetailValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  confirmSectionLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 5,
  },

  confirmStudentCard: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 12,
    backgroundColor: '#0B1C32',
    padding: 12,
    gap: 10,
  },

  confirmAbsentCard: {
    backgroundColor: 'rgba(100,116,139,0.14)',
    borderColor: '#64748B',
  },

  confirmStudentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 10,
  },

  confirmStudentName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  confirmStudentRoll: {
    color: '#AFC0D8',
    fontSize: 10,
    marginTop: 4,
  },

  confirmAbsentBadge: {
    borderRadius: 8,
    backgroundColor: '#374151',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  confirmAbsentBadgeText: {
    color: '#E2E8F0',
    fontSize: 9,
    fontWeight: '800',
  },

  confirmMarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  confirmSubjectName: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },

  confirmFullMarks: {
    color: '#94A3B8',
    fontSize: 9,
    marginTop: 3,
  },

  confirmMarkValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'right',
    minWidth: 65,
  },

  confirmAbsentText: {
    color: '#94A3B8',
    fontSize: 12,
  },

  confirmActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 9,
    marginTop: 10,
  },

  confirmBackButton: {
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#142B49',
    paddingHorizontal: 14,
  },

  confirmSaveButton: {
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
  },

  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  openMarksheetButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3B7197',
    backgroundColor: '#142B49',
  },

  openMarksheetButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  readOnlyInput: {
    backgroundColor: '#101E33',
    borderColor: '#334155',
    color: '#CBD5E1',
    opacity: 0.75,
  },

  readOnlyField: {
    backgroundColor: '#101E33',
    borderColor: '#334155',
    opacity: 0.65,
  },

  disabledButton: {
    opacity: 0.4,
  },
});
