import { StyleSheet } from 'react-native';

export const COLORS = {
  BACKGROUND: '#071426',

  CARD: '#111E34',

  CARD_DARK: '#0A182B',

  CARD_SELECTED: '#203B59',

  FIELD: '#0B1C32',

  TEXT: '#FFFFFF',

  MUTED: '#AAB7CB',

  MUTED_DARK: '#66758B',

  BLUE: '#3478F6',

  BORDER: '#2E678F',

  MESSAGE: '#61B4D0',

  ERROR: '#FFB4BA',
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,

    backgroundColor: COLORS.BACKGROUND,
  },

  screenScroll: {
    flex: 1,
  },

  screenContent: {
    padding: 14,

    paddingBottom: 40,

    gap: 14,
  },

  /*
   * Selector
   */

  selectorSection: {
    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    padding: 14,
  },

  selectorTitleRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    flexWrap: 'wrap',

    gap: 10,

    marginBottom: 12,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 16,

    fontWeight: '900',
  },

  addClassworkButton: {
    minHeight: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',

    justifyContent: 'center',
  },

  addClassworkButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  selectorControls: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 14,

    marginBottom: 12,
  },

  selectorControlsCompact: {
    flexDirection: 'column',

    alignItems: 'stretch',
  },

  searchInput: {
    flex: 1,

    minWidth: 220,

    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    color: COLORS.TEXT,

    fontSize: 13,

    paddingHorizontal: 12,
  },

  paginationArea: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'flex-end',

    flexWrap: 'wrap',

    gap: 12,
  },

  showingText: {
    color: COLORS.MUTED,

    fontSize: 11,
  },

  paginationControls: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 9,
  },

  pageButton: {
    minHeight: 38,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    paddingHorizontal: 14,

    alignItems: 'center',

    justifyContent: 'center',
  },

  pageButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  pageText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '700',

    minWidth: 70,

    textAlign: 'center',
  },

  classworkGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 8,
  },

  classworkCard: {
    flexGrow: 1,

    flexBasis: '31%',

    minWidth: 240,

    maxWidth: '100%',

    minHeight: 62,

    backgroundColor: COLORS.CARD_DARK,

    borderRadius: 10,

    paddingHorizontal: 11,

    paddingVertical: 9,

    justifyContent: 'center',
  },

  classworkCardCompact: {
    flexBasis: '100%',

    width: '100%',

    minWidth: 0,
  },

  classworkCardSelected: {
    backgroundColor: COLORS.CARD_SELECTED,
  },

  classworkTitle: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  classworkDate: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 4,
  },

  selectorLoading: {
    minHeight: 160,

    alignItems: 'center',

    justifyContent: 'center',
  },

  selectorError: {
    minHeight: 120,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 16,
  },

  selectorEmpty: {
    minHeight: 100,

    alignItems: 'center',

    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 8,
  },

  errorText: {
    color: COLORS.ERROR,

    fontSize: 11,

    textAlign: 'center',
  },

  retryButton: {
    minHeight: 38,

    backgroundColor: COLORS.BLUE,

    borderRadius: 9,

    paddingHorizontal: 14,

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 10,
  },

  retryButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  /*
   * Detail area
   */

  detailSection: {
    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    padding: 14,
  },

  detailTop: {
    flexDirection: 'row',

    alignItems: 'stretch',

    gap: 16,

    paddingBottom: 16,
  },

  detailTopCompact: {
    flexDirection: 'column',
  },

  classworkInformation: {
    flex: 1,

    minWidth: 0,

    justifyContent: 'center',

    paddingHorizontal: 4,

    paddingVertical: 8,
  },

  selectedTitle: {
    color: COLORS.TEXT,

    fontSize: 17,

    fontWeight: '900',
  },

  selectedBody: {
    color: COLORS.MUTED,

    fontSize: 12,

    lineHeight: 19,

    marginTop: 12,
  },

  noBodyText: {
    color: COLORS.MUTED_DARK,

    fontSize: 11,

    fontStyle: 'italic',

    marginTop: 10,
  },

  /*
   * Upload
   */

  uploadCard: {
    width: 390,

    maxWidth: '100%',

    backgroundColor: COLORS.CARD_DARK,

    borderRadius: 14,

    padding: 12,
  },

  uploadTitle: {
    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '900',
  },

  uploadHint: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 15,

    marginTop: 4,
  },

  uploadDropArea: {
    minHeight: 130,

    backgroundColor: COLORS.FIELD,

    borderRadius: 12,

    marginTop: 10,

    padding: 14,

    alignItems: 'center',

    justifyContent: 'center',
  },

  uploadDropText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',

    textAlign: 'center',
  },

  uploadOrText: {
    color: COLORS.MUTED,

    fontSize: 9,

    marginTop: 5,

    textAlign: 'center',
  },

  chooseFilesButton: {
    minHeight: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 12,
  },

  chooseFilesButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  detailLoading: {
    minHeight: 160,

    alignItems: 'center',

    justifyContent: 'center',
  },

  detailErrorText: {
    color: COLORS.ERROR,

    fontSize: 10,

    marginBottom: 10,
  },

  /*
   * Attachments
   */

  attachmentsSection: {
    paddingTop: 14,

    borderTopWidth: StyleSheet.hairlineWidth,

    borderTopColor: '#28415D',
  },

  subSectionTitle: {
    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '900',

    marginBottom: 10,
  },

  attachmentsRow: {
    gap: 8,

    paddingBottom: 3,
  },

  attachmentCard: {
    width: 112,

    backgroundColor: COLORS.CARD_DARK,

    borderRadius: 11,

    padding: 7,
  },

  attachmentImage: {
    width: '100%',

    height: 82,

    borderRadius: 8,

    backgroundColor: COLORS.FIELD,
  },

  documentPreview: {
    width: '100%',

    height: 82,

    backgroundColor: COLORS.FIELD,

    borderRadius: 8,

    alignItems: 'center',

    justifyContent: 'center',
  },

  documentIcon: {
    fontSize: 28,
  },

  documentExtension: {
    color: COLORS.MUTED,

    fontSize: 9,

    fontWeight: '900',

    marginTop: 4,
  },

  attachmentName: {
    color: COLORS.TEXT,

    fontSize: 9,

    fontWeight: '600',

    marginTop: 6,
  },

  attachmentSize: {
    color: COLORS.MUTED,

    fontSize: 8,

    marginTop: 2,
  },

  /*
   * Messages
   */

  messagesSection: {
    marginTop: 16,
  },

  messagesContainer: {
    minHeight: 85,

    backgroundColor: COLORS.CARD_DARK,

    borderRadius: 12,

    padding: 12,

    gap: 8,
  },

  messageBubble: {
    width: '76%',

    maxWidth: 760,

    alignSelf: 'flex-end',

    backgroundColor: COLORS.MESSAGE,

    borderRadius: 11,

    paddingHorizontal: 12,

    paddingVertical: 9,
  },

  messageBody: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '700',
  },

  messageMeta: {
    color: 'rgba(255,255,255,0.70)',

    fontSize: 8,

    marginTop: 4,
  },

  messageInputRow: {
    flexDirection: 'row',

    alignItems: 'stretch',

    gap: 8,

    marginTop: 10,
  },

  messageInput: {
    flex: 1,

    minHeight: 50,

    maxHeight: 120,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    color: COLORS.TEXT,

    fontSize: 12,

    paddingHorizontal: 12,

    paddingVertical: 10,
  },

  sendButton: {
    minWidth: 72,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 12,

    alignItems: 'center',

    justifyContent: 'center',
  },

  sendButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  emptyText: {
    color: COLORS.MUTED,

    fontSize: 10,
  },

  buttonPressed: {
    opacity: 0.72,
  },

  buttonDisabled: {
    opacity: 0.42,
  },

  classworkListViewport: {
    height: 220,

    backgroundColor: 'transparent',

    borderRadius: 10,

    overflow: 'hidden',
  },

  classworkListViewportCompact: {
    height: 300,
  },

  classworkListScrollContent: {
    paddingRight: 4,

    paddingBottom: 4,
  },
});
