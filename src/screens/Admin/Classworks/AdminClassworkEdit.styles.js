import { StyleSheet } from 'react-native';

const BG = '#081524';
const CARD = '#102844';
const INPUT = '#0D2138';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#3E79A8';
const PRIMARY = '#3B82F6';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    padding: 14,
    paddingBottom: 30,
  },

  pageTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '900',
  },

  metaText: {
    color: MUTED,
    fontSize: 11,
    marginTop: 4,
  },

  field: {
    marginTop: 17,
  },

  label: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 7,
  },

  input: {
    minHeight: 46,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 11,

    backgroundColor: INPUT,

    color: TEXT,
    fontSize: 13,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  noteInput: {
    minHeight: 140,
    paddingTop: 12,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(62,121,168,0.35)',

    marginTop: 20,
  },

  section: {
    paddingTop: 18,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '900',
  },

  sectionSubtitle: {
    color: MUTED,
    fontSize: 11,
    marginTop: 3,
  },

  attachmentControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 13,
  },

  chooseButton: {
    flex: 1,
    minHeight: 43,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 10,

    backgroundColor: INPUT,

    marginRight: 9,
  },

  chooseButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '700',
  },

  uploadButton: {
    minHeight: 43,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 10,

    backgroundColor: CARD,

    paddingHorizontal: 16,
  },

  uploadButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '900',
  },

  emptyText: {
    color: MUTED,
    fontSize: 11,
    marginTop: 13,
  },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',

    marginTop: 13,
  },

  messageInput: {
    flex: 1,
    minHeight: 46,
    maxHeight: 100,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 10,

    backgroundColor: INPUT,

    color: TEXT,
    fontSize: 12,

    paddingHorizontal: 12,
    paddingVertical: 10,

    marginRight: 8,
  },

  sendButton: {
    minWidth: 67,
    minHeight: 46,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 10,

    backgroundColor: PRIMARY,
  },

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    marginTop: 20,
  },

  cancelButton: {
    minHeight: 43,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 10,

    backgroundColor: INPUT,

    paddingHorizontal: 15,

    marginRight: 9,
  },

  cancelButtonText: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '800',
  },

  saveButton: {
    minHeight: 43,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 10,

    backgroundColor: PRIMARY,

    paddingHorizontal: 17,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  selectedFilesList: {
    marginTop: 12,
  },

  selectedFileCard: {
    minHeight: 54,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#0D2138',

    borderWidth: 1,
    borderColor: '#315D86',

    borderRadius: 10,

    paddingHorizontal: 11,
    paddingVertical: 8,

    marginBottom: 8,
  },

  selectedFileInfo: {
    flex: 1,
    minWidth: 0,
  },

  selectedFileName: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
  },

  selectedFileSize: {
    color: '#AFC0D8',
    fontSize: 9,
    marginTop: 3,
  },

  removeSelectedFileButton: {
    width: 30,
    height: 30,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 8,

    backgroundColor: '#7F1D1D',

    marginLeft: 10,
  },

  removeSelectedFileText: {
    color: '#FFFFFF',
    fontSize: 19,
    lineHeight: 21,
    fontWeight: '700',
  },
  attachmentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },

  attachmentCard: {
    width: '48%',
    minHeight: 78,

    backgroundColor: '#0D2138',

    borderWidth: 1,
    borderColor: '#315D86',

    borderRadius: 11,

    padding: 11,

    marginRight: '2%',
    marginBottom: 8,
  },

  attachmentName: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
  },

  attachmentSize: {
    color: '#AFC0D8',
    fontSize: 9,
    marginTop: 6,
  },

  pendingFiles: {
    marginTop: 12,

    borderWidth: 1,
    borderColor: '#315D86',

    borderRadius: 10,

    backgroundColor: '#0D2138',

    padding: 10,
  },

  pendingFilesTitle: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 7,
  },

  pendingFileRow: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 6,
  },

  pendingFileName: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 10,
  },

  pendingRemove: {
    color: '#F87171',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 10,
  },

  messagesList: {
    marginTop: 12,
  },

  messageCard: {
    backgroundColor: '#0D2138',

    borderWidth: 1,
    borderColor: '#315D86',

    borderRadius: 11,

    paddingHorizontal: 12,
    paddingVertical: 10,

    marginBottom: 8,
  },

  messageBody: {
    color: '#F8FAFC',
    fontSize: 12,
    lineHeight: 18,
  },

  messageMeta: {
    color: '#93C5FD',
    fontSize: 9,
    marginTop: 6,
  },

  buttonDisabled: {
    opacity: 0.45,
  },
  attachmentCard: {
    width: '48%',
    minHeight: 82,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#0D2138',

    borderWidth: 1,
    borderColor: '#315D86',

    borderRadius: 11,

    paddingHorizontal: 11,
    paddingVertical: 10,

    marginRight: '2%',
    marginBottom: 8,
  },

  attachmentContent: {
    flex: 1,
    minWidth: 0,
  },

  attachmentName: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
  },

  attachmentSize: {
    color: '#AFC0D8',
    fontSize: 9,
    marginTop: 5,
  },

  attachmentDeleteButton: {
    width: 34,
    height: 34,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 9,

    backgroundColor: 'rgba(239, 68, 68, 0.10)',

    marginLeft: 8,
  },
});
