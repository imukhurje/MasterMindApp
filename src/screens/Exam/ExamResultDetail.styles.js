import { StyleSheet } from 'react-native';

const COLORS = {
  BG: '#0F172A',
  CARD: '#142B49',
  CARD_DARK: '#0B1C32',
  TEXT: '#E2E8F0',
  MUTED: '#AFC0D8',
  BORDER: '#3B7197',
};

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BG,
  },

  sheetCard: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 16,
    padding: 16,
  },

  sheetTitle: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  notes: {
    color: COLORS.MUTED,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
  },

  questions: {
    marginTop: 14,
  },

  questionCard: {
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 11,
    padding: 13,
    marginBottom: 10,
  },

  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  questionTitle: {
    flex: 1,
    color: COLORS.TEXT,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
    paddingRight: 8,
  },

  correct: {
    color: '#86EFAC',
    fontSize: 9,
    fontWeight: '900',
  },

  incorrect: {
    color: '#FCA5A5',
    fontSize: 9,
    fontWeight: '900',
  },

  answer: {
    color: COLORS.TEXT,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },

  marks: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 7,
  },

  examinerNotes: {
    color: COLORS.MUTED,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
  },

  examHeader: {
    backgroundColor: '#102742',
    borderWidth: 1,
    borderColor: '#376D99',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  examLabel: {
    color: '#7DD3FC',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 5,
  },

  examName: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },

  sheetHeader: {
    marginBottom: 12,
  },

  correctAnswer: {
    color: '#86EFAC',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    fontWeight: '600',
  },

  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sheetTitleArea: {
    flex: 1,
    paddingRight: 12,
  },

  totalMarksBadge: {
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#3B82F6',

    borderRadius: 10,

    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  totalMarksLabel: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '700',
    marginBottom: 2,
  },

  totalMarksValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '900',
  },
});
