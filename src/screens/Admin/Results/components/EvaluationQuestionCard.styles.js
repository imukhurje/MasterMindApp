import { StyleSheet } from 'react-native';

const COLORS = {
  CARD: '#0D4038',

  INPUT: '#07182D',

  TEXT: '#FFFFFF',

  MUTED: '#BCD0D4',

  BLUE: '#3478F6',

  GREEN: '#4FD1B5',

  BORDER: '#3B789A',
};

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.CARD,

    borderRadius: 12,

    padding: 12,

    width: '100%',
  },

  gradingRow: {
    flexDirection: 'row',

    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 8,

    marginTop: 12,
  },

  markInput: {
    minWidth: 100,

    flexGrow: 1,

    maxWidth: 190,

    minHeight: 40,

    backgroundColor: COLORS.INPUT,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 8,

    color: COLORS.TEXT,

    fontSize: 12,

    textAlign: 'right',

    paddingHorizontal: 10,
  },

  studentAnswerBox: {
    minHeight: 70,

    backgroundColor: COLORS.INPUT,

    borderRadius: 9,

    marginTop: 5,

    padding: 10,
  },

  notesInput: {
    minHeight: 55,

    backgroundColor: COLORS.INPUT,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 8,

    color: COLORS.TEXT,

    fontSize: 11,

    paddingHorizontal: 10,

    paddingVertical: 8,
  },

  titleRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 10,
  },

  questionNumber: {
    color: COLORS.TEXT,

    fontSize: 15,

    fontWeight: '900',
  },

  fullMarks: {
    color: COLORS.MUTED,

    fontSize: 10,

    fontWeight: '600',
  },

  questionText: {
    color: COLORS.TEXT,

    fontSize: 12,

    lineHeight: 18,

    marginTop: 8,
  },

  /*
   * MCQ options
   */

  options: {
    gap: 6,

    marginTop: 8,
  },

  optionRow: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: 8,
  },

  optionCheck: {
    width: 18,

    height: 18,

    backgroundColor: COLORS.INPUT,

    borderRadius: 3,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 1,
  },

  optionCheckSelected: {
    backgroundColor: '#6A7380',
  },

  optionTick: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',
  },

  optionText: {
    flex: 1,

    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,
  },

  /*
   * Student answer
   */

  studentLabel: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',

    marginTop: 10,
  },

  studentAnswer: {
    color: COLORS.TEXT,

    fontSize: 11,

    lineHeight: 17,
  },

  selectedAnswers: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 6,

    marginTop: 5,
  },

  answerBadge: {
    minHeight: 26,

    backgroundColor: '#123950',

    borderRadius: 13,

    paddingHorizontal: 9,

    alignItems: 'center',

    justifyContent: 'center',
  },

  answerBadgeText: {
    color: COLORS.TEXT,

    fontSize: 9,

    fontWeight: '600',
  },

  /*
   * Files
   */

  uploadLabel: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',

    marginTop: 12,

    marginBottom: 5,
  },

  filesRow: {
    flexDirection: 'row',

    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 7,
  },

  fileButton: {
    minHeight: 35,

    backgroundColor: '#123950',

    borderRadius: 17,

    paddingHorizontal: 10,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 7,
  },

  fileName: {
    color: COLORS.TEXT,

    fontSize: 10,

    maxWidth: 180,
  },

  fileAction: {
    color: '#AEE9FF',

    fontSize: 10,

    fontWeight: '800',
  },

  /*
   * Grading
   */

  gradingLabel: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  autoBadge: {
    minHeight: 25,

    backgroundColor: COLORS.INPUT,

    borderRadius: 13,

    paddingHorizontal: 9,

    alignItems: 'center',

    justifyContent: 'center',
  },

  autoBadgeText: {
    color: COLORS.TEXT,

    fontSize: 9,

    fontWeight: '600',
  },

  evaluatedRow: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,
  },

  evaluatedText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '700',
  },

  smallCheckbox: {
    width: 18,

    height: 18,

    backgroundColor: COLORS.INPUT,

    borderRadius: 4,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    alignItems: 'center',

    justifyContent: 'center',
  },

  smallCheckboxChecked: {
    backgroundColor: COLORS.BLUE,
  },

  smallTick: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',
  },

  /*
   * Examiner note
   */

  notesLabel: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',

    marginTop: 12,

    marginBottom: 5,
  },
});
