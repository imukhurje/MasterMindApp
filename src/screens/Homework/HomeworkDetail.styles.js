// src/screens/HomeworkDetail.styles.js

import { StyleSheet } from 'react-native';

export const COLORS = {
  BG: '#0F172A',
  CARD: '#0B1220',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',
  BORDER: '#334155',
  CTA: '#22C55E',
  INFO: '#2563EB',
  DANGER: '#EF4444',
  DARK_BUTTON: '#1F2937',
  REVIEW: '#F59E0B',
  OPTION_BORDER: '#4B5563',
};

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  headerTitle: {
    color: COLORS.TEXT,
    fontWeight: '800',
    fontSize: 18,
  },

  timezoneText: {
    color: COLORS.MUTED,
    marginTop: 2,
  },

  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },

  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: COLORS.BORDER,
  },

  actionButtonPressed: {
    backgroundColor: COLORS.DARK_BUTTON,
  },

  actionButtonDisabled: {
    backgroundColor: COLORS.DARK_BUTTON,
    opacity: 0.5,
  },

  actionButtonText: {
    color: COLORS.TEXT,
    fontWeight: '700',
  },

  submitButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: COLORS.DANGER,
  },

  submitButtonPressed: {
    backgroundColor: '#B91C1C',
  },

  submitButtonDisabled: {
    backgroundColor: COLORS.DARK_BUTTON,
    opacity: 0.5,
  },

  submitButtonText: {
    color: COLORS.BG,
    fontWeight: '700',
  },

  card: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  questionCard: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    padding: 14,
  },

  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryLeft: {
    flex: 1,
    paddingRight: 12,
  },

  summaryTitle: {
    color: COLORS.TEXT,
    fontWeight: '800',
  },

  summarySubjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  summarySubject: {
    color: COLORS.MUTED,
    flex: 1,
    paddingRight: 12,
  },

  summaryMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  className: {
    color: COLORS.MUTED,
    marginLeft: 10,
    fontWeight: '700',
  },

  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  dueText: {
    color: COLORS.TEXT,
    flex: 1,
    paddingRight: 12,
  },

  dueLabel: {
    fontWeight: '800',
  },

  lateSubmissionText: {
    color: COLORS.MUTED,
    fontSize: 12,
    marginTop: 4,
  },

  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.12)',
    borderWidth: 1,
    borderColor: '#2E4EA8',
    marginLeft: 8,
  },

  pillText: {
    fontWeight: '700',
    fontSize: 12,
  },

  miniPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(148,163,184,0.10)',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginLeft: 8,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  countdownText: {
    color: COLORS.MUTED,
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 6,
  },

  sectionTitle: {
    color: COLORS.TEXT,
    fontWeight: '800',
    marginBottom: 10,
  },

  attachmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  attachmentName: {
    color: COLORS.TEXT,
    flex: 1,
  },

  downloadButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: COLORS.CTA,
  },

  downloadButtonPressed: {
    backgroundColor: '#16A34A',
  },

  downloadButtonText: {
    color: COLORS.BG,
    fontWeight: '700',
  },

  emptyText: {
    color: COLORS.MUTED,
  },

  answerFilesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  answerFilesTitle: {
    color: COLORS.TEXT,
    fontWeight: '800',
  },

  refreshButton: {
    padding: 6,
  },

  disabledControl: {
    opacity: 0.35,
  },

  answerEmptyText: {
    color: COLORS.MUTED,
    marginTop: 8,
  },

  answerFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  answerFileName: {
    color: COLORS.TEXT,
    flex: 1,
  },

  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginLeft: 10,
  },

  deleteButtonPressed: {
    backgroundColor: COLORS.DARK_BUTTON,
  },

  deleteButtonDisabled: {
    opacity: 0.3,
  },

  questionBlock: {
    marginBottom: 16,
    paddingBottom: 12,
  },

  questionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#223047',
  },

  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  questionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  questionTitle: {
    color: COLORS.TEXT,
    fontWeight: '800',
    marginRight: 8,
  },

  questionType: {
    fontWeight: '400',
    color: COLORS.MUTED,
  },

  marksPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: '#166534',
  },

  marksText: {
    color: COLORS.CTA,
    fontWeight: '700',
    fontSize: 12,
  },

  reviewControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  reviewControlDisabled: {
    opacity: 0.55,
  },

  reviewDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.BORDER,
  },

  reviewDotActive: {
    backgroundColor: COLORS.REVIEW,
  },

  reviewCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    backgroundColor: 'transparent',
  },

  reviewCheckboxActive: {
    backgroundColor: COLORS.CTA,
  },

  reviewCheckboxInner: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.CARD,
  },

  reviewText: {
    color: COLORS.TEXT,
  },

  promptText: {
    color: COLORS.TEXT,
    marginBottom: 8,
    lineHeight: 20,
  },

  optionButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.BG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },

  optionButtonSelected: {
    borderColor: COLORS.CTA,
  },

  optionButtonPressed: {
    opacity: 0.95,
  },

  optionButtonDisabled: {
    opacity: 0.65,
  },

  optionIndicator: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: COLORS.OPTION_BORDER,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionIndicatorSingle: {
    borderRadius: 999,
  },

  optionIndicatorMulti: {
    borderRadius: 4,
  },

  optionIndicatorSelected: {
    borderColor: COLORS.CTA,
  },

  optionIndicatorInner: {
    width: 10,
    height: 10,
    backgroundColor: COLORS.CTA,
  },

  optionIndicatorInnerSingle: {
    borderRadius: 999,
  },

  optionIndicatorInnerMulti: {
    borderRadius: 2,
  },

  optionText: {
    color: COLORS.TEXT,
    flex: 1,
    lineHeight: 20,
  },

  subjectiveBox: {
    backgroundColor: COLORS.BG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    minHeight: 100,
    padding: 10,
  },

  subjectiveInput: {
    color: COLORS.TEXT,
    lineHeight: 20,
  },

  subjectiveInputDisabled: {
    opacity: 0.65,
  },

  bottomSpacer: {
    height: 24,
  },
  evaluatedCard: {
    backgroundColor: '#102541',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  evaluatedHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  evaluatedTitle: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  evaluatedNotes: {
    color: COLORS.MUTED,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  evaluatedBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: '#166534',
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginLeft: 10,
  },

  evaluatedBadgeText: {
    color: '#86EFAC',
    fontSize: 9,
    fontWeight: '900',
  },

  evaluatedQuestion: {
    backgroundColor: '#132B4D',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 11,
    padding: 12,
    marginTop: 10,
  },

  evaluatedQuestionDivider: {
    marginBottom: 2,
  },

  evaluatedQuestionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  evaluatedQuestionTitle: {
    flex: 1,
    color: COLORS.TEXT,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '800',
    paddingRight: 8,
  },

  evaluatedAnswer: {
    color: COLORS.TEXT,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 9,
  },

  evaluatedMarks: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 7,
  },

  correctBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(34,197,94,0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
  },

  correctBadgeText: {
    color: '#86EFAC',
    fontSize: 8,
    fontWeight: '900',
  },

  incorrectBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(239,68,68,0.14)',
    paddingHorizontal: 7,
    paddingVertical: 3,
  },

  incorrectBadgeText: {
    color: '#FCA5A5',
    fontSize: 8,
    fontWeight: '900',
  },

  examinerNoteBox: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(59,113,151,0.45)',
    marginTop: 10,
    paddingTop: 9,
  },

  examinerNoteLabel: {
    color: COLORS.MUTED,
    fontSize: 9,
    fontWeight: '800',
  },

  examinerNoteText: {
    color: COLORS.TEXT,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
});
