import { StyleSheet } from 'react-native';

export const COLORS = {
  OVERLAY: 'rgba(2, 8, 23, 0.88)',

  CARD: '#10203B',

  HEADER: '#0A1830',

  INNER: '#08172B',

  TEXT: '#FFFFFF',

  MUTED: '#A8B8D0',

  BORDER: '#3B7197',

  BORDER_SOFT: '#294466',

  BLUE: '#347AF2',

  BLUE_LIGHT: '#7CB7F5',

  GREEN: '#22C55E',

  ERROR: '#FCA5A5',

  ERROR_BG: '#3A1721',

  ERROR_BORDER: '#EF4444',
};

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: COLORS.OVERLAY,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 14,
  },

  modalCard: {
    width: '100%',

    maxWidth: 900,

    maxHeight: '92%',

    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 18,

    overflow: 'hidden',

    elevation: 12,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.36,

    shadowRadius: 18,
  },

  modalCardMobile: {
    maxHeight: '96%',
  },

  /*
   * Header
   */

  header: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    backgroundColor: COLORS.HEADER,

    borderBottomWidth: 1,

    borderBottomColor: COLORS.BORDER_SOFT,

    paddingHorizontal: 16,

    paddingVertical: 15,
  },

  headerText: {
    flex: 1,

    minWidth: 0,

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

    lineHeight: 17,

    marginTop: 4,
  },

  closeButton: {
    width: 42,

    height: 42,

    borderRadius: 11,

    backgroundColor: '#182D49',

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    alignItems: 'center',

    justifyContent: 'center',
  },

  closeButtonText: {
    color: COLORS.TEXT,

    fontSize: 25,

    lineHeight: 27,

    fontWeight: '500',
  },

  /*
   * Scroll content
   */

  scrollView: {
    flexGrow: 0,
  },

  scrollContent: {
    padding: 14,

    gap: 14,
  },

  section: {
    backgroundColor: '#112442',

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 15,

    padding: 14,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 15,

    fontWeight: '900',
  },

  sectionDescription: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

    marginTop: 4,
  },

  optionsContainer: {
    marginTop: 13,

    gap: 10,
  },

  /*
   * Radio cards
   */

  optionCard: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    minHeight: 78,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 12,

    padding: 13,
  },

  optionCardSelected: {
    borderColor: COLORS.BLUE_LIGHT,

    backgroundColor: '#0A1C35',
  },

  optionCardPressed: {
    opacity: 0.8,
  },

  radioOuter: {
    width: 18,

    height: 18,

    borderRadius: 9,

    borderWidth: 1,

    borderColor: '#7B8799',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 2,

    marginRight: 11,

    flexShrink: 0,
  },

  radioOuterSelected: {
    borderColor: COLORS.BLUE_LIGHT,
  },

  radioInner: {
    width: 10,

    height: 10,

    borderRadius: 5,

    backgroundColor: COLORS.BLUE_LIGHT,
  },

  optionContent: {
    flex: 1,

    minWidth: 0,
  },

  optionTitle: {
    color: COLORS.TEXT,

    fontSize: 12,

    lineHeight: 18,

    fontWeight: '900',
  },

  optionDescription: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 16,

    marginTop: 4,
  },

  /*
   * Assignment info
   */

  assignmentInfo: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 11,

    backgroundColor: '#0B1C32',

    borderRadius: 9,

    paddingHorizontal: 10,

    paddingVertical: 8,
  },

  assignmentDot: {
    width: 8,

    height: 8,

    borderRadius: 4,

    backgroundColor: '#64748B',

    marginRight: 7,
  },

  assignmentDotEnabled: {
    backgroundColor: COLORS.GREEN,
  },

  assignmentInfoText: {
    flex: 1,

    color: COLORS.MUTED,

    fontSize: 9,

    lineHeight: 14,
  },

  /*
   * Footer
   */

  footer: {
    minHeight: 68,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 10,

    backgroundColor: COLORS.HEADER,

    borderTopWidth: 1,

    borderTopColor: COLORS.BORDER_SOFT,

    paddingHorizontal: 16,

    paddingVertical: 12,
  },

  footerMobile: {
    flexDirection: 'column-reverse',

    alignItems: 'stretch',
  },

  footerButtonMobile: {
    width: '100%',
  },

  saveButton: {
    minHeight: 44,

    minWidth: 140,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 16,
  },

  saveButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  resetButton: {
    minHeight: 44,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 16,
  },

  resetButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  /*
   * Loading / Error
   */

  loadingContainer: {
    minHeight: 280,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 20,
  },

  loadingText: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 10,
  },

  errorContainer: {
    margin: 14,

    backgroundColor: COLORS.ERROR_BG,

    borderWidth: 1,

    borderColor: COLORS.ERROR_BORDER,

    borderRadius: 12,

    padding: 15,

    alignItems: 'flex-start',
  },

  errorTitle: {
    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '900',
  },

  errorText: {
    color: COLORS.ERROR,

    fontSize: 10,

    lineHeight: 16,

    marginTop: 5,

    marginBottom: 12,
  },

  retryButton: {
    minHeight: 41,

    backgroundColor: COLORS.BLUE,

    borderRadius: 9,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 15,
  },

  retryButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.75,
  },

  disabled: {
    opacity: 0.4,
  },
});
