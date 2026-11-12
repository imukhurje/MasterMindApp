// src/screens/ClassworkDetail.styles.js

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
  DANGER: '#EF4444',
};

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 32,
  },

  // Header / hero
  heroCard: {
    backgroundColor: '#142B49',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
  },

  heroLabel: {
    color: '#7DD3FC',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  heroTitle: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },

  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 7,
  },

  metaPill: {
    borderWidth: 1,
    borderColor: '#3B7197',
    backgroundColor: '#0E223A',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  metaPillText: {
    color: '#C8D5E8',
    fontSize: 10,
    fontWeight: '700',
  },

  // Main section cards
  card: {
    backgroundColor: COLORS.CARD,
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  sectionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#173B60',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  sectionIcon: {
    fontSize: 16,
  },

  sectionHeadingArea: {
    flex: 1,
  },

  sectionTitle: {
    color: COLORS.TEXT,
    fontWeight: '900',
    fontSize: 14,
  },

  sectionSubtitle: {
    color: COLORS.MUTED,
    fontSize: 10,
    marginTop: 2,
  },

  detailBox: {
    backgroundColor: COLORS.INNER,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#29415E',
    padding: 12,
  },

  detailBody: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 20,
  },

  mutedText: {
    color: COLORS.MUTED,
    fontSize: 12,
  },

  // Attachments
  attachmentsTrack: {
    paddingTop: 2,
    paddingBottom: 2,
  },

  attachmentCard: {
    width: 130,
    backgroundColor: COLORS.INNER,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#376D99',
    padding: 7,
    marginRight: 9,
  },

  attachmentThumb: {
    height: 78,
    borderRadius: 9,
    backgroundColor: '#081525',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
    overflow: 'hidden',
  },

  attachmentImage: {
    width: '100%',
    height: '100%',
  },

  attachmentIcon: {
    fontSize: 18,
    color: '#CBD5E1',
  },

  attachmentName: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: '700',
  },

  attachmentMeta: {
    color: COLORS.MUTED,
    fontSize: 9,
    marginTop: 2,
  },

  // Messages
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },

  msgList: {
    marginTop: 2,
  },

  msgBubble: {
    maxWidth: '84%',
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 13,
    marginVertical: 4,
  },

  msgBubbleMe: {
    backgroundColor: '#1D4ED8',
  },

  msgBubbleThey: {
    backgroundColor: COLORS.INNER,
    borderWidth: 1,
    borderColor: '#29415E',
  },

  msgBody: {
    color: COLORS.TEXT,
    fontSize: 13,
    lineHeight: 18,
  },

  msgMeta: {
    color: '#B8C5D6',
    fontSize: 9,
    marginTop: 5,
  },

  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  input: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 11,
    paddingHorizontal: 12,
    backgroundColor: COLORS.INNER,
    color: COLORS.TEXT,
    fontSize: 13,
  },

  sendButton: {
    minHeight: 44,
    marginLeft: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: COLORS.PRIMARY,
  },

  sendButtonDisabled: {
    opacity: 0.45,
  },

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  readOnlyNote: {
    color: COLORS.MUTED,
    fontSize: 11,
    marginTop: 8,
  },

  // Toast
  toast: {
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: COLORS.CARD,
  },

  toastOk: {
    borderColor: COLORS.PRIMARY,
  },

  toastErr: {
    borderColor: COLORS.DANGER,
  },

  toastText: {
    color: COLORS.TEXT,
    fontSize: 12,
  },

  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },

  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.INNER,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  cancelButtonText: {
    color: COLORS.TEXT,
    fontWeight: '800',
    fontSize: 12,
  },
});
