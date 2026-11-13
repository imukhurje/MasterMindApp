import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#142B49';
const CARD_DARK = '#0B1C32';
const BORDER = '#3B7197';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const PRIMARY = '#2563EB';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#101D35',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 12,
  },

  headerTextArea: {
    flex: 1,
    gap: 5,
  },

  headerTitle: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '800',
  },

  headerSubtitle: {
    color: MUTED,
    fontSize: 12,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 10,
    gap: 5,
    backgroundColor: CARD_DARK,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  stepButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    paddingHorizontal: 2,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepButtonActive: {
    backgroundColor: '#193565',
    borderWidth: 1,
    borderColor: '#2563EB',
  },

  stepButtonCompleted: {
    backgroundColor: '#152E4D',
  },

  stepButtonText: {
    color: '#AFC0D8',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },

  stepButtonTextActive: {
    color: TEXT,
    fontWeight: '900',
  },

  contentScroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 14,
    paddingTop: 26,
    paddingBottom: 30,
    flexGrow: 1,
  },

  formCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    backgroundColor: CARD,
    padding: 14,
    gap: 10,
  },

  fieldLabel: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '800',
  },

  textInput: {
    minHeight: 50,
    color: TEXT,
    backgroundColor: CARD_DARK,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
  },

  stepCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    backgroundColor: CARD,
    padding: 18,
    alignItems: 'center',
    gap: 12,
  },

  stepCardTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

  stepCardDescription: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
  },

  finishCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    backgroundColor: CARD,
    padding: 16,
    gap: 14,
    alignItems: 'center',
  },

  reviewRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingVertical: 10,
  },

  reviewLabel: {
    color: MUTED,
    fontSize: 12,
    flex: 1,
  },

  reviewValue: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '700',
    flex: 1.5,
    textAlign: 'right',
  },

  draftText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '800',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    paddingHorizontal: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    backgroundColor: CARD_DARK,
  },

  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 1,
    gap: 6,
  },

  previousButton: {
    minHeight: 42,
    paddingHorizontal: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },

  previousButtonText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  draftButton: {
    minHeight: 42,
    paddingHorizontal: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    justifyContent: 'center',
    alignItems: 'center',
  },

  draftButtonText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '800',
  },

  nextButton: {
    minHeight: 42,
    paddingHorizontal: 11,
    borderRadius: 9,
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextButtonText: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
  },

  disabledButton: {
    opacity: 0.4,
  },

  embeddedStepContent: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#0F172A',
  },

  scheduleSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 8,
  },

  scheduleSummaryBadge: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 20,
    backgroundColor: '#0B1C32',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  scheduleSummaryText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '800',
  },

  scheduleComponent: {
    flex: 1,
    minHeight: 0,
  },

  finishContainer: {
    width: '100%',
    gap: 12,
    paddingTop: 12,
    paddingBottom: 20,
  },

  finishOptionCard: {
    minHeight: 86,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 13,
    backgroundColor: '#142B49',
    paddingHorizontal: 14,
    paddingVertical: 15,
  },

  finishOptionSelected: {
    borderWidth: 2,
    borderColor: '#7DD3FC',
    backgroundColor: '#193565',
  },

  finishOptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
  },

  finishOptionContent: {
    flex: 1,
    gap: 6,
  },

  finishOptionTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
  },

  finishOptionDescription: {
    color: '#AFC0D8',
    fontSize: 11,
    lineHeight: 17,
  },

  finishLoadingBox: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  finishLoadingText: {
    color: '#AFC0D8',
    fontSize: 12,
  },

  finishErrorCard: {
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#2A1828',
    gap: 12,
  },

  finishErrorText: {
    color: '#FCA5A5',
    fontSize: 12,
    lineHeight: 18,
  },

  finishRetryButton: {
    alignSelf: 'flex-start',
    borderRadius: 9,
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  finishRetryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
