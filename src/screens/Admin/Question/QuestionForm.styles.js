import { Platform, StatusBar, StyleSheet } from 'react-native';

export const COLORS = {
  BG: '#081321',

  CARD: '#102742',
  CARD_DARK: '#0B1A2E',
  CARD_LIGHT: '#142B49',

  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',

  BORDER: '#376D99',
  BORDER_SOFT: '#294B69',

  PRIMARY: '#2563EB',
  CYAN: '#67D1F0',

  RED: '#EF4444',
  GREEN: '#22C55E',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,

    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },

  header: {
    minHeight: 58,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: COLORS.CARD_DARK,

    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_SOFT,

    paddingHorizontal: 14,
  },

  backButton: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 5,
  },

  backText: {
    color: COLORS.TEXT,
    fontSize: 25,
    lineHeight: 28,
  },

  headerTitle: {
    color: COLORS.TEXT,

    fontSize: 17,
    fontWeight: '900',
  },

  content: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 35,
  },

  formCard: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 14,

    padding: 13,

    marginBottom: 13,
  },

  responsiveRow: {
    flexDirection: 'row',

    gap: 12,
  },

  responsiveColumn: {
    flexDirection: 'column',

    gap: 0,
  },

  questionArea: {
    width: '100%',
  },

  questionAreaWide: {
    flex: 1.3,
  },

  previewArea: {
    width: '100%',
  },

  previewAreaWide: {
    flex: 0.9,
  },

  halfField: {
    flex: 1,
    minWidth: 0,
  },

  fullField: {
    width: '100%',
  },

  typeFieldWide: {
    flex: 0.8,
  },

  onlineCourseFieldWide: {
    flex: 1.35,
  },

  chapterFieldWide: {
    flex: 1,
  },

  label: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '700',

    marginTop: 10,
    marginBottom: 6,
  },

  questionInput: {
    minHeight: 105,

    backgroundColor: COLORS.CARD_DARK,

    color: COLORS.TEXT,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 10,

    paddingHorizontal: 12,
    paddingVertical: 11,

    fontSize: 13,
    lineHeight: 19,

    textAlignVertical: 'top',
  },

  previewBox: {
    minHeight: 72,

    justifyContent: 'center',

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderStyle: 'dashed',

    borderRadius: 10,

    padding: 11,
  },

  previewText: {
    color: COLORS.TEXT,

    fontSize: 12,
    lineHeight: 18,
  },

  previewPlaceholder: {
    color: COLORS.MUTED,
  },

  dropdown: {
    minHeight: 46,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 10,

    paddingHorizontal: 11,
  },

  dropdownPlaceholder: {
    color: COLORS.MUTED,
    fontSize: 12,
  },

  dropdownSelectedText: {
    color: COLORS.TEXT,
    fontSize: 12,
  },

  dropdownItemText: {
    color: COLORS.TEXT,
    fontSize: 12,
  },

  dropdownSearchInput: {
    color: COLORS.TEXT,

    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 8,

    fontSize: 12,
    paddingHorizontal: 10,
  },

  dropdownContainer: {
    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,

    overflow: 'hidden',
  },

  selectedChip: {
    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 8,
  },

  disabledControl: {
    opacity: 0.48,
  },

  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',

    alignSelf: 'flex-start',

    marginTop: 15,
    marginBottom: 2,
  },

  checkboxBox: {
    width: 19,
    height: 19,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 4,

    backgroundColor: COLORS.CARD_DARK,

    marginRight: 8,
  },

  checkboxBoxSelected: {
    backgroundColor: COLORS.GREEN,

    borderColor: COLORS.GREEN,
  },

  checkboxTick: {
    color: '#FFFFFF',

    fontSize: 13,
    fontWeight: '900',
  },

  activeText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '800',
  },

  sectionHeader: {
    marginBottom: 11,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 14,
    fontWeight: '900',
  },

  sectionDescription: {
    color: COLORS.MUTED,

    fontSize: 10,
    lineHeight: 15,

    marginTop: 3,
  },

  choiceCard: {
    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 11,

    padding: 10,

    marginBottom: 9,
  },

  choiceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 7,
  },

  answerSelector: {
    width: 20,
    height: 20,

    borderWidth: 1.5,
    borderColor: '#8293A9',

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  answerSelectorSelected: {
    borderColor: COLORS.CYAN,
  },

  answerSelectorDot: {
    width: 10,
    height: 10,

    borderRadius: 5,

    backgroundColor: COLORS.CYAN,
  },

  choiceInput: {
    flex: 1,

    minHeight: 44,

    backgroundColor: COLORS.CARD,

    color: COLORS.TEXT,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,

    paddingHorizontal: 11,

    fontSize: 12,
  },

  choicePreview: {
    minHeight: 38,

    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#315E84',
    borderStyle: 'dashed',

    borderRadius: 8,

    paddingHorizontal: 10,

    marginLeft: 27,
    marginTop: 8,
    marginRight: 45,
  },

  choicePreviewText: {
    color: '#DCE7F5',

    fontSize: 11,
    lineHeight: 16,
  },

  removeButton: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.RED,

    borderRadius: 9,
  },

  removeText: {
    color: '#FFFFFF',

    fontSize: 20,
    fontWeight: '900',

    lineHeight: 22,
  },

  addChoiceButton: {
    alignSelf: 'flex-start',

    minHeight: 40,

    justifyContent: 'center',

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,

    paddingHorizontal: 13,

    marginTop: 2,
  },

  addChoiceButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,
    fontWeight: '900',
  },

  modelAnswerInput: {
    minHeight: 115,

    backgroundColor: COLORS.CARD_DARK,

    color: COLORS.TEXT,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 10,

    paddingHorizontal: 12,
    paddingVertical: 11,

    marginTop: 12,

    fontSize: 12,
    lineHeight: 18,

    textAlignVertical: 'top',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    gap: 8,

    marginTop: 3,
  },

  cancelButton: {
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,

    paddingHorizontal: 16,
  },

  cancelButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  createButton: {
    minWidth: 100,
    minHeight: 44,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.PRIMARY,

    borderRadius: 9,

    paddingHorizontal: 18,
  },

  createText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.45,
  },
});
