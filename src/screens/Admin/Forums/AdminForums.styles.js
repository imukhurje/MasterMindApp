import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#112441';
const CARD_DARK = '#08172D';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#315D86';

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

  topSection: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
  },

  pageSubtitle: {
    color: MUTED,
    fontSize: 12,
    marginTop: 3,
  },

  searchCard: {
    borderWidth: 1,
    borderColor: '#2875A9',
    borderRadius: 14,
    backgroundColor: 'rgba(20, 43, 73, 0.72)',
    padding: 10,
    marginHorizontal: 2,
    marginTop: 2,
    marginBottom: 2,
  },

  searchBox: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9,
    backgroundColor: CARD_DARK,
    paddingHorizontal: 12,
  },

  searchIcon: {
    color: '#9EB4CD',
    fontSize: 18,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    minHeight: 42,
    color: TEXT,
    fontSize: 13,
    paddingVertical: 0,
  },

  listContent: {
    paddingBottom: 20,
  },

  privateMessageRow: {
    borderTopWidth: 0,
  },

  sectionHeader: {
    minHeight: 31,
    justifyContent: 'center',
    backgroundColor: BG,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(49, 93, 134, 0.38)',
    paddingHorizontal: 14,
  },

  sectionTitle: {
    color: '#67D1F0',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  forumRow: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 36, 65, 0.64)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(49, 93, 134, 0.42)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  rowPressed: {
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
  },

  avatar: {
    width: 48,
    height: 48,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    marginRight: 13,
  },

  classAvatar: {
    backgroundColor: '#66C4E2',
  },

  subjectAvatar: {
    backgroundColor: '#7660C6',
  },

  teacherAvatar: {
    backgroundColor: '#539568',
  },

  privateAvatar: {
    backgroundColor: '#DA8C1F',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  forumContent: {
    flex: 1,
    minWidth: 0,
  },

  forumTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  forumTitle: {
    flex: 1,
    color: TEXT,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
  },

  messageDate: {
    color: MUTED,
    fontSize: 10,
    marginLeft: 10,
  },

  forumPreview: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  emptyState: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  emptyStateText: {
    color: MUTED,
    fontSize: 12,
  },

  hiddenMetadata: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },

  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  topHeaderText: {
    flex: 1,
    paddingRight: 10,
  },

  blockButton: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 10,
    backgroundColor: 'rgba(20, 43, 73, 0.72)',
    paddingHorizontal: 12,
  },

  blockButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
});
