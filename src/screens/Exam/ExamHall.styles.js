// src/screens/ExamHall.styles.js

import { StyleSheet } from 'react-native';

export const COLORS = {
  BG: '#081321',
  CARD: '#102742',
  INNER: '#0B1A2E',

  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',

  BORDER: '#376D99',

  PRIMARY: '#3B82F6',
  PRIMARY_PRESSED: '#2563EB',

  SUCCESS: '#22C55E',

  DANGER: '#DC3545',
  DANGER_PRESSED: '#B91C1C',

  WARNING: '#F59E0B',
};

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  header: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomColor: '#182B40',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: '800',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  err: {
    color: '#F87171',
  },

  toast: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 11,
    borderRadius: 10,
  },

  toastOk: {
    backgroundColor: '#102A43',
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
  },

  toastErr: {
    backgroundColor: '#321B24',
    borderColor: COLORS.DANGER,
    borderWidth: 1,
  },

  toastText: {
    color: COLORS.TEXT,
  },

  pill: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    backgroundColor: COLORS.INNER,
  },

  pillDanger: {
    borderColor: '#7F1D1D',
    backgroundColor: '#2B1114',
  },

  pillText: {
    color: '#D2DCE9',
    fontSize: 12,
  },

  card: {
    margin: 16,
    padding: 13,
    borderRadius: 16,
    backgroundColor: COLORS.CARD,
    borderColor: COLORS.BORDER,
    borderWidth: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  h1: {
    color: COLORS.TEXT,
    fontWeight: '800',
    fontSize: 16,
  },

  muted: {
    color: COLORS.MUTED,
    marginTop: 4,
  },

  qtitle: {
    color: COLORS.TEXT,
    fontWeight: '900',
    fontSize: 14,
    marginBottom: 4,
  },

  qhost: {
    marginTop: 12,
    backgroundColor: COLORS.INNER,
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    borderRadius: 13,
    padding: 12,
    maxHeight: 520,
  },

  questionScrollContent: {
    paddingBottom: 16,
  },

  questionText: {
    marginTop: 4,
  },

  answerArea: {
    marginTop: 10,
  },

  opt: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 11,
    borderRadius: 10,
    borderColor: '#29415E',
    borderWidth: 1,
    backgroundColor: '#0A1729',
    marginTop: 7,
  },

  optOn: {
    borderColor: COLORS.SUCCESS,
    backgroundColor: '#102F2A',
  },

  check: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderColor: '#64748B',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkOn: {
    borderColor: COLORS.SUCCESS,
    backgroundColor: '#123524',
  },

  checkText: {
    color: COLORS.SUCCESS,
    fontWeight: '800',
  },

  optionTextContainer: {
    flex: 1,
  },

  textarea: {
    backgroundColor: '#091628',
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    borderRadius: 11,
    padding: 12,
    color: COLORS.TEXT,
    minHeight: 150,
    maxHeight: 280,
    fontSize: 14,
    lineHeight: 21,
  },

  attachmentWrapper: {
    marginTop: 14,
  },

  answerFilesLoading: {
    paddingVertical: 10,
    alignItems: 'center',
  },

  answerFilesBox: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 11,
    backgroundColor: '#0C1E34',
  },

  answerFilesTitle: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 7,
  },

  answerFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderTopWidth: 1,
    borderTopColor: '#203D58',

    paddingVertical: 8,
  },

  answerFileName: {
    color: COLORS.MUTED,
    fontSize: 12,
  },

  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },

  btn: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },

  btnPrimary: {
    backgroundColor: COLORS.PRIMARY,
  },

  btnSecondary: {
    backgroundColor: COLORS.INNER,
    borderColor: COLORS.BORDER,
    borderWidth: 1,
  },

  btnSecondaryText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '700',
  },

  submitButton: {
    backgroundColor: COLORS.DANGER,
    borderColor: '#F87171',
    borderWidth: 1,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },

  btnDisabled: {
    opacity: 0.45,
  },

  btnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },

  lockCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.CARD,
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    minHeight: 280,
  },

  lockTitle: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '800',
  },

  lockSubtitle: {
    color: COLORS.MUTED,
    fontSize: 13,
    marginTop: 6,
  },

  lockBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  lockIcon: {
    fontSize: 38,
    marginBottom: 12,
  },

  lockWarning: {
    color: '#F87171',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },

  lockMessage: {
    color: COLORS.TEXT,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 520,
    marginBottom: 16,
  },
  answerFileMeta: {
    color: COLORS.MUTED,
    fontSize: 10,
    marginTop: 3,
  },
  answerFileInfo: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },

  answerFileName: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '600',
  },

  answerFileMeta: {
    color: COLORS.MUTED,
    fontSize: 10,
    marginTop: 3,
  },

  answerFileDeleteButton: {
    width: 36,
    height: 36,
    borderRadius: 9,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
    backgroundColor: 'rgba(239,68,68,0.06)',

    marginLeft: 8,
  },

  answerFileDeleteButtonPressed: {
    backgroundColor: 'rgba(239,68,68,0.16)',
  },

  answerFileDeleteButtonDisabled: {
    opacity: 0.5,
  },

  completedCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },

  completedHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  completedTitle: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  completedSubtitle: {
    color: COLORS.MUTED,
    fontSize: 13,
    marginTop: 6,
  },

  completedBody: {
    marginTop: 10,
    minHeight: 190,
    backgroundColor: COLORS.INNER,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    padding: 16,
  },

  completedMessageTitle: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 22,
  },

  completedMessage: {
    color: COLORS.MUTED,
    fontSize: 13,
    lineHeight: 20,
  },

  completedActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 28,
  },

  examWarningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,

    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 2,

    paddingHorizontal: 12,
    paddingVertical: 13,

    backgroundColor: 'rgba(220, 53, 69, 0.17)',

    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 12,
  },

  examWarningText: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '500',
  },

  examWarningBold: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  reviewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    padding: 12,
  },

  reviewModalCard: {
    width: '100%',
    height: '70%',
    maxHeight: '75%',
    backgroundColor: '#101D34',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 15,
    overflow: 'hidden',
  },

  reviewModalHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#294C6A',
  },

  reviewModalTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  reviewModalSubtitle: {
    color: '#AFC0D8',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  reviewModalScroll: {
    flex: 1,
    minHeight: 0,
  },

  reviewModalContent: {
    padding: 12,
    paddingBottom: 18,
    gap: 12,
  },

  reviewQuestionCard: {
    backgroundColor: '#081629',
    borderWidth: 1,
    borderColor: '#294C6A',
    borderRadius: 12,
    overflow: 'hidden',
  },

  reviewQuestionHeader: {
    backgroundColor: '#19334B',
    padding: 12,
  },

  reviewQuestionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 20,
  },

  reviewQuestionBody: {
    padding: 10,
    gap: 10,
  },

  reviewAnswerBox: {
    backgroundColor: '#0B172D',
    borderWidth: 1,
    borderColor: '#25466F',
    borderRadius: 10,
    padding: 11,
  },

  reviewCorrectBox: {
    backgroundColor: '#0D302E',
    borderWidth: 1,
    borderColor: '#168269',
    borderRadius: 10,
    padding: 11,
  },

  reviewAnswerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },

  reviewAnswerLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  reviewAnswerText: {
    color: '#E2E8F0',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },

  reviewScoreBadge: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  reviewScoreText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  reviewEmptyText: {
    color: '#AFC0D8',
    textAlign: 'center',
    fontSize: 12,
    paddingVertical: 25,
  },

  reviewModalFooter: {
    flexShrink: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',

    borderTopWidth: 1,
    borderTopColor: '#294C6A',

    backgroundColor: '#101D34',

    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  submittedBody: {
    minHeight: 230,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 14,
    gap: 14,
  },

  submittedTitle: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },

  submittedDescription: {
    color: '#A8B6C9',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },
});
