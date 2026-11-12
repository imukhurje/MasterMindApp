import { StyleSheet } from 'react-native';

const BG = '#08162A';
const CARD = '#0D2240';
const CARD_ALT = '#112D52';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#245C91';
const PRIMARY = '#2563EB';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  centeredScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG,
  },

  loadingText: {
    color: MUTED,
    fontSize: 11,
    marginTop: 10,
  },

  chatHeader: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: 'rgba(13, 34, 64, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  avatar: {
    width: 50,
    height: 50,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#68C5E1',
    marginRight: 12,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  headerTextSection: {
    flex: 1,
    minWidth: 0,
  },

  forumTitle: {
    color: TEXT,

    fontSize: 16,
    lineHeight: 21,

    fontWeight: '900',
  },

  forumSubtitle: {
    color: MUTED,

    fontSize: 11,
    lineHeight: 16,

    marginTop: 3,
  },

  messageCountBadge: {
    minWidth: 30,
    height: 30,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 15,

    backgroundColor: 'rgba(8, 22, 42, 0.70)',

    paddingHorizontal: 7,
  },

  messageCountText: {
    color: '#D7E3F0',

    fontSize: 10,
    fontWeight: '900',
  },

  messagesContent: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    gap: 8,
  },

  emptyMessagesContent: {
    flexGrow: 1,
  },

  messageRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  messageRowMine: {
    justifyContent: 'flex-end',
  },

  messageBubble: {
    width: '82%',
    maxWidth: 380,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,
    borderTopLeftRadius: 6,

    backgroundColor: CARD,

    paddingHorizontal: 13,
    paddingVertical: 12,
  },

  messageBubbleMine: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 6,

    backgroundColor: '#2C6685',
  },

  messageBody: {
    color: TEXT,

    fontSize: 14,
    lineHeight: 21,

    fontWeight: '500',
  },

  messageMetaRow: {
    marginTop: 7,
  },

  messageMeta: {
    color: '#9FB3CC',

    fontSize: 9,
    lineHeight: 13,
  },

  replyButton: {
    alignSelf: 'flex-end',

    minHeight: 34,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 9,

    backgroundColor: PRIMARY,

    paddingHorizontal: 12,

    marginTop: 9,
  },

  replyButtonText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',
  },

  replyPreview: {
    borderLeftWidth: 3,
    borderLeftColor: '#60A5FA',

    borderRadius: 7,

    backgroundColor: 'rgba(8, 22, 42, 0.55)',

    paddingHorizontal: 9,
    paddingVertical: 7,

    marginBottom: 9,
  },

  replyPreviewTitle: {
    color: '#7DD3FC',

    fontSize: 9,
    fontWeight: '900',
  },

  replyPreviewText: {
    color: MUTED,

    fontSize: 10,
    lineHeight: 15,

    marginTop: 2,
  },

  attachmentButton: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    backgroundColor: 'rgba(8, 22, 42, 0.65)',
    paddingHorizontal: 9,
    paddingVertical: 8,
    marginTop: 8,
  },

  attachmentButtonText: {
    color: '#7DD3FC',
    fontSize: 9,
    fontWeight: '800',
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  emptyStateTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  emptyStateText: {
    color: MUTED,
    fontSize: 10,
    marginTop: 5,
  },

  composerSection: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: BG,
    paddingHorizontal: 8,
    paddingTop: 8,
  },

  composerTopRow: {
    flexDirection: 'row',
    marginBottom: 7,
  },

  addButton: {
    width: 44,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 9,
    backgroundColor: 'rgba(13, 34, 64, 0.75)',
  },

  addButtonText: {
    color: TEXT,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },

  messageInput: {
    flex: 1,

    minHeight: 46,
    maxHeight: 120,

    borderRadius: 23,

    backgroundColor: 'rgba(17, 36, 65, 0.95)',

    color: TEXT,

    fontSize: 13,

    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 12,
  },

  sendButton: {
    minWidth: 70,
    minHeight: 46,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 10,

    backgroundColor: PRIMARY,

    paddingHorizontal: 14,
  },

  sendButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  replyingToCard: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderLeftWidth: 4,
    borderLeftColor: '#67D1F0',
    borderRadius: 10,
    backgroundColor: '#203A5F',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },

  replyingToTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  replyingToTextSection: {
    flex: 1,
    paddingRight: 10,
  },

  replyingToTitle: {
    color: '#67D1F0',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '900',
  },

  replyingToText: {
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  replyCloseButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#2563EB',
  },

  replyCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
  },

  replyPrivacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 7,
  },

  replyPrivacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  replyPrivacyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 5,
  },

  radioOuter: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 6,
  },

  radioOuterSelected: {
    borderColor: '#7DD3FC',
  },

  radioInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7DD3FC',
  },

  replyCancelButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginLeft: 8,
  },

  replyCancelText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.42,
  },
  selectedMediaCard: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: 'rgba(32, 58, 95, 0.82)',
    paddingHorizontal: 9,
    paddingVertical: 8,
    marginBottom: 8,
  },

  selectedMediaIcon: {
    width: 52,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#142B49',
    marginRight: 9,
  },

  selectedMediaIconText: {
    color: '#7DD3FC',
    fontSize: 8,
    fontWeight: '900',
  },

  selectedMediaInfo: {
    flex: 1,
    minWidth: 0,
  },

  selectedMediaName: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  selectedMediaType: {
    color: '#AFC0D8',
    fontSize: 8,
    marginTop: 3,
  },

  removeMediaButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#EF4444',
    marginLeft: 8,
  },

  removeMediaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '800',
  },
  messageAttachment: {
    marginTop: 8,
  },

  messageAttachmentImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    backgroundColor: '#08172D',
  },

  videoAttachmentPreview: {
    width: '100%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#08172D',
  },

  videoAttachmentText: {
    color: '#7DD3FC',
    fontSize: 12,
    fontWeight: '900',
  },

  attachmentName: {
    color: '#FFFFFF',
    fontSize: 9,
    lineHeight: 14,
    fontWeight: '700',
    marginTop: 6,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(17, 45, 82, 0.95)',
    borderWidth: 1,
    borderColor: BORDER,
    marginRight: 10,
  },
});
