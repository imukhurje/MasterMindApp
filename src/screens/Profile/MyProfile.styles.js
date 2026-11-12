import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const CARD = '#102541';
const CARD_DARK = '#0B1C32';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#3B7197';
const PRIMARY = '#2563EB';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  screenContent: {
    padding: 12,
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

  profileHero: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    backgroundColor: CARD,
    padding: 14,
    marginBottom: 12,
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#294C73',
    borderWidth: 2,
    borderColor: '#4E8AB8',
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 39,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
  },

  heroInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 13,
  },

  heroName: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '900',
  },

  heroEmail: {
    color: MUTED,
    fontSize: 11,
    marginTop: 4,
  },

  heroBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 9,
  },

  infoBadge: {
    borderWidth: 1,
    borderColor: '#407BAB',
    borderRadius: 12,
    backgroundColor: 'rgba(59, 113, 151, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  infoBadgeText: {
    color: '#D5E8FA',
    fontSize: 9,
    fontWeight: '800',
  },

  statusBadge: {
    borderRadius: 12,
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  statusBadgeText: {
    color: '#86EFAC',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  sectionCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    backgroundColor: CARD_DARK,
    padding: 14,
    marginBottom: 12,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  sectionSubtitle: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
    marginBottom: 6,
  },

  field: {
    marginTop: 12,
  },

  fieldLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },

  required: {
    color: '#F87171',
  },

  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD,
    color: TEXT,
    fontSize: 12,
    paddingHorizontal: 12,
  },

  readOnlyInput: {
    opacity: 0.7,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
  },

  checkbox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: 5,
    marginRight: 8,
  },

  checkboxSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#22C55E',
  },

  checkboxCheck: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '900',
  },

  checkboxLabel: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '700',
  },

  photoPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 68,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: CARD,
    padding: 12,
    marginTop: 10,
  },

  photoPickerIcon: {
    fontSize: 25,
  },

  photoPickerText: {
    flex: 1,
    marginLeft: 12,
  },

  photoPickerTitle: {
    color: TEXT,
    fontSize: 11,
    fontWeight: '900',
  },

  photoPickerSubtitle: {
    color: MUTED,
    fontSize: 9,
    marginTop: 4,
  },

  documentPickerCard: {
    borderWidth: 1,
    borderColor: 'rgba(59, 113, 151, 0.55)',
    borderRadius: 11,
    backgroundColor: CARD,
    padding: 11,
    marginTop: 10,
  },

  documentPickerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  documentPickerText: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },

  documentPickerTitle: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '800',
  },

  documentRequirement: {
    color: MUTED,
    fontSize: 8,
    marginTop: 3,
  },

  chooseFileButton: {
    minWidth: 72,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderRadius: 9,
    paddingHorizontal: 10,
  },

  chooseFileButtonText: {
    color: '#BFDBFE',
    fontSize: 9,
    fontWeight: '900',
  },

  selectedFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 113, 151, 0.35)',
    marginTop: 9,
    paddingTop: 9,
  },

  selectedFileName: {
    flex: 1,
    color: MUTED,
    fontSize: 9,
    paddingRight: 8,
  },

  removeFileText: {
    color: '#F87171',
    fontSize: 9,
    fontWeight: '900',
  },

  fileNote: {
    color: MUTED,
    fontSize: 8,
    lineHeight: 13,
    marginTop: 10,
  },

  saveButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: PRIMARY,
    marginTop: 2,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.45,
  },

  optionalLabel: {
    color: MUTED,
    fontWeight: '500',
  },

  datePickerField: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: CARD,
    paddingHorizontal: 12,
  },

  datePickerText: {
    flex: 1,
    color: TEXT,
    fontSize: 12,
  },

  datePickerPlaceholder: {
    color: '#64748B',
  },

  calendarIcon: {
    fontSize: 17,
    marginLeft: 10,
  },

  datePickerDoneButton: {
    alignSelf: 'flex-end',
    minWidth: 70,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
    marginTop: 8,
  },

  datePickerDoneText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  documentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },

  uploadedBadge: {
    borderRadius: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
    paddingHorizontal: 7,
    paddingVertical: 3,
  },

  uploadedBadgeText: {
    color: '#86EFAC',
    fontSize: 8,
    fontWeight: '900',
  },

  existingDocumentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 113, 151, 0.35)',
    marginTop: 10,
    paddingTop: 10,
  },

  existingDocumentImage: {
    width: 54,
    height: 54,
    borderRadius: 9,
    backgroundColor: '#142B49',
  },

  documentTypeBox: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.45)',
  },

  documentTypeText: {
    color: '#FCA5A5',
    fontSize: 10,
    fontWeight: '900',
  },

  existingDocumentInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },

  existingDocumentName: {
    color: TEXT,
    fontSize: 10,
    fontWeight: '800',
  },

  existingDocumentHint: {
    color: '#7DD3FC',
    fontSize: 8,
    marginTop: 4,
  },

  documentOpenArrow: {
    color: '#93C5FD',
    fontSize: 24,
    marginLeft: 8,
  },

  pendingReplaceText: {
    color: '#FBBF24',
    fontSize: 8,
    marginTop: 3,
  },

  noDocumentText: {
    color: MUTED,
    fontSize: 8,
    marginTop: 8,
  },

  bioInput: {
    minHeight: 110,
    paddingTop: 12,
    paddingBottom: 12,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },

  avatarCameraButton: {
    position: 'absolute',
    right: -3,
    bottom: -3,

    width: 28,
    height: 28,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 14,

    backgroundColor: '#2563EB',

    borderWidth: 2,
    borderColor: '#0F172A',

    elevation: 4,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },

  avatarCameraIcon: {
    fontSize: 13,
  },
});
