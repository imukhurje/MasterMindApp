// src/screens/Admin/Forum/AdminPrivateMessages.styles.js

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
    fontSize: 12,
    marginTop: 10,
  },

  chatHeader: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: 'rgba(13,34,64,0.96)',

    borderBottomWidth: 1,
    borderBottomColor: BORDER,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  backButton: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 20,

    borderWidth: 1,
    borderColor: BORDER,

    backgroundColor: 'rgba(8,23,45,0.72)',

    marginRight: 10,
  },

  privateAvatar: {
    width: 48,
    height: 48,

    borderRadius: 24,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#DA8C1F',

    marginRight: 12,
  },

  privateAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  headerTextSection: {
    flex: 1,
    minWidth: 0,
  },

  headerTitle: {
    color: TEXT,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },

  headerSubtitle: {
    color: MUTED,
    fontSize: 11,
    marginTop: 3,
  },

  messageContent: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },

  emptyMessageContent: {
    flexGrow: 1,
  },

  messageRow: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  messageRowMine: {
    alignItems: 'flex-end',
  },

  messageBubble: {
    width: '82%',
    maxWidth: 500,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 13,
    borderTopLeftRadius: 5,

    backgroundColor: CARD,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  messageBubbleMine: {
    backgroundColor: '#244762',

    borderTopLeftRadius: 13,
    borderTopRightRadius: 5,
  },

  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 7,
  },

  messageSender: {
    flexShrink: 0,

    color: '#DCE8F5',

    fontSize: 10,
    fontWeight: '900',

    marginRight: 10,
  },

  messageDate: {
    flex: 1,

    color: MUTED,

    fontSize: 9,
    textAlign: 'right',
  },

  messageBody: {
    color: TEXT,

    fontSize: 14,
    lineHeight: 20,
  },

  messageAttachment: {
    marginTop: 10,

    borderRadius: 11,

    overflow: 'hidden',
  },

  messageAttachmentImage: {
    width: '100%',
    height: 220,

    borderRadius: 10,

    backgroundColor: '#08172D',
  },

  fileAttachmentPreview: {
    width: '100%',
    height: 100,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 10,

    backgroundColor: '#08172D',

    borderWidth: 1,
    borderColor: 'rgba(49,93,134,0.55)',
  },

  attachmentInfo: {
    marginTop: 7,
  },

  messageAttachmentName: {
    color: '#FFFFFF',

    fontSize: 10,
    lineHeight: 14,

    fontWeight: '700',
  },

  messageAttachmentSize: {
    color: '#AFC0D8',

    fontSize: 9,

    marginTop: 2,
  },

  messageAttachmentText: {
    flex: 1,

    color: '#7DD3FC',

    fontSize: 10,
    fontWeight: '700',

    marginLeft: 6,
  },

  emptyState: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 24,
  },

  emptyTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  emptyText: {
    color: MUTED,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5,
  },

  composer: {
    borderTopWidth: 1,
    borderTopColor: BORDER,

    backgroundColor: BG,

    paddingHorizontal: 10,
    paddingTop: 10,
  },

  recipientPanel: {
    borderWidth: 1,
    borderColor: '#315D86',

    borderRadius: 13,

    backgroundColor: 'rgba(13,34,64,0.76)',

    padding: 10,

    marginBottom: 8,
  },

  recipientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 8,
  },

  recipientTitle: {
    color: TEXT,

    fontSize: 14,
    fontWeight: '900',
  },

  recipientCount: {
    color: MUTED,

    fontSize: 10,
    fontWeight: '700',
  },

  selectedRecipients: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    marginBottom: 7,
  },

  selectedRecipientChip: {
    flexDirection: 'row',
    alignItems: 'center',

    maxWidth: '48%',

    borderRadius: 999,

    backgroundColor: 'rgba(37,99,235,0.20)',

    borderWidth: 1,
    borderColor: '#3B82F6',

    paddingLeft: 9,
    paddingRight: 5,
    paddingVertical: 5,

    marginRight: 6,
    marginBottom: 6,
  },

  selectedRecipientText: {
    flexShrink: 1,

    color: '#DBEAFE',

    fontSize: 9,
    fontWeight: '800',
  },

  selectedRecipientClose: {
    color: '#FFFFFF',

    fontSize: 15,
    lineHeight: 16,

    marginLeft: 5,
  },

  searchBox: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 10,

    borderWidth: 1,
    borderColor: '#3B7197',

    backgroundColor: '#0B1C32',

    paddingHorizontal: 11,
  },

  searchInput: {
    flex: 1,

    minHeight: 44,

    color: TEXT,

    fontSize: 12,

    paddingHorizontal: 8,
    paddingVertical: 0,
  },

  recipientListContainer: {
    maxHeight: 190,

    borderWidth: 1,
    borderColor: 'rgba(49,93,134,0.55)',

    borderRadius: 10,

    backgroundColor: '#08172D',

    marginTop: 6,

    overflow: 'hidden',
  },

  recipientList: {
    maxHeight: 190,
  },

  recipientRow: {
    minHeight: 58,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 10,
    paddingVertical: 8,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(49,93,134,0.30)',
  },

  recipientRowSelected: {
    backgroundColor: 'rgba(37,99,235,0.16)',
  },

  recipientSelection: {
    width: 24,
    alignItems: 'flex-start',
  },

  radioOuter: {
    width: 14,
    height: 14,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#94A3B8',

    borderRadius: 7,
  },

  radioOuterSelected: {
    borderColor: '#7DD3FC',
  },

  radioInner: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: '#7DD3FC',
  },

  recipientInfo: {
    flex: 1,
    minWidth: 0,
  },

  recipientName: {
    color: TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  recipientEmail: {
    color: MUTED,

    fontSize: 9,

    marginTop: 3,
  },

  recipientRole: {
    maxWidth: 90,

    color: '#C7D5E6',

    fontSize: 9,

    marginLeft: 8,
  },

  recipientHelp: {
    color: MUTED,

    fontSize: 9,

    marginTop: 6,
  },

  emptyRecipient: {
    padding: 15,
    alignItems: 'center',
  },

  emptyRecipientText: {
    color: MUTED,
    fontSize: 10,
  },

  selectedMediaCard: {
    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#3B7197',

    borderRadius: 10,

    backgroundColor: 'rgba(32,58,95,0.82)',

    paddingHorizontal: 10,
    paddingVertical: 7,

    marginBottom: 8,
  },

  selectedMediaInfo: {
    flex: 1,
    minWidth: 0,

    marginLeft: 8,
  },

  selectedMediaName: {
    color: TEXT,

    fontSize: 10,
    fontWeight: '800',
  },

  removeMediaButton: {
    width: 30,
    height: 30,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 8,

    backgroundColor: '#EF4444',

    marginLeft: 8,
  },

  addButton: {
    width: 46,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 10,

    backgroundColor: 'rgba(13,34,64,0.80)',

    marginBottom: 8,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  messageInput: {
    flex: 1,

    minHeight: 44,
    maxHeight: 110,

    borderRadius: 22,

    backgroundColor: 'rgba(17,36,65,0.95)',

    color: TEXT,

    fontSize: 12,

    paddingHorizontal: 14,
    paddingTop: 11,
    paddingBottom: 11,
  },

  sendButton: {
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 10,

    backgroundColor: PRIMARY,

    paddingHorizontal: 14,

    marginLeft: 8,
  },

  sendButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.4,
  },
  replyPreview: {
    borderLeftWidth: 3,
    borderLeftColor: '#60A5FA',

    backgroundColor: 'rgba(59,130,246,0.10)',

    borderRadius: 7,

    paddingHorizontal: 9,
    paddingVertical: 7,

    marginBottom: 10,
  },

  replyPreviewSender: {
    color: '#DBEAFE',

    fontSize: 10,
    fontWeight: '900',

    marginBottom: 3,
  },

  replyPreviewBody: {
    color: '#D7E2EF',

    fontSize: 11,
    lineHeight: 16,
  },

  replyActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 12,
  },

  replyPrivateButton: {
    minHeight: 36,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#3B82F6',

    borderWidth: 1,
    borderColor: '#60A5FA',

    borderRadius: 10,

    paddingHorizontal: 13,
  },

  replyPrivateButtonText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',

    marginLeft: 5,
  },
});
