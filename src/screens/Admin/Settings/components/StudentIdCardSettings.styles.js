import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',
  FIELD: '#0B1C32',

  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',

  BLUE: '#3478F6',
  CYAN: '#62D4FF',

  BORDER: '#29435F',
  FIELD_BORDER: '#3B7197',

  OVERLAY: 'rgba(2, 8, 23, 0.86)',

  ERROR: '#FFB4BA',
};

export const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    padding: 16,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 16,

    fontWeight: '900',
  },

  description: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

    marginTop: 6,

    marginBottom: 16,
  },

  layoutGroups: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 14,
  },

  layoutGroup: {
    flex: 1,

    minWidth: 280,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 13,

    padding: 12,
  },

  groupTitle: {
    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '900',

    marginBottom: 10,
  },

  layoutCards: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 10,
  },

  layoutCard: {
    flex: 1,

    minWidth: 120,

    minHeight: 112,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 9,
  },

  layoutCardSelected: {
    borderColor: COLORS.BLUE,

    borderWidth: 2,

    backgroundColor: '#102845',
  },

  cardIllustration: {
    backgroundColor: '#F8FAFC',

    borderRadius: 4,

    overflow: 'hidden',

    position: 'relative',
  },

  cardIllustrationPortrait: {
    width: 42,

    height: 61,
  },

  cardIllustrationLandscape: {
    width: 68,

    height: 44,
  },

  illustrationAccent: {
    position: 'absolute',

    left: 0,
    top: 0,

    width: 6,

    height: '100%',

    backgroundColor: '#3D32C8',
  },

  illustrationPhoto: {
    position: 'absolute',

    left: 12,
    top: 14,

    width: 12,
    height: 15,

    borderWidth: 1,

    borderColor: '#3D32C8',
  },

  illustrationLine: {
    position: 'absolute',

    left: 28,
    top: 18,

    width: 11,
    height: 2,

    backgroundColor: '#3D32C8',
  },

  layoutLabel: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '700',

    marginTop: 9,

    textAlign: 'center',
  },

  /*
   * Custom
   */

  customGroup: {
    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 13,

    padding: 12,

    marginTop: 14,
  },

  customCard: {
    minHeight: 76,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 10,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,

    padding: 10,
  },

  customCardSelected: {
    borderColor: COLORS.BLUE,

    borderWidth: 2,
  },

  customPreviewIcon: {
    width: 70,

    height: 44,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,

    borderStyle: 'dashed',

    borderColor: '#3D32C8',

    alignItems: 'center',

    justifyContent: 'center',
  },

  customPreviewPlus: {
    color: '#3D32C8',

    fontSize: 20,

    fontWeight: '700',
  },

  customInfo: {
    flex: 1,

    minWidth: 0,
  },

  customTitle: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  customSubtitle: {
    color: COLORS.MUTED,

    fontSize: 9,

    marginTop: 3,
  },

  openDesignerButton: {
    minHeight: 36,

    borderWidth: 1,

    borderColor: COLORS.BLUE,

    borderRadius: 8,

    paddingHorizontal: 12,

    alignItems: 'center',

    justifyContent: 'center',
  },

  openDesignerText: {
    color: COLORS.CYAN,

    fontSize: 9,

    fontWeight: '900',
  },

  /*
   * Controls
   */

  designControls: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 18,

    marginTop: 18,
  },

  controlField: {
    flex: 1,

    minWidth: 220,
  },

  label: {
    color: COLORS.MUTED,

    fontSize: 11,

    fontWeight: '600',

    marginBottom: 7,
  },

  colorInputRow: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,
  },

  colorPreview: {
    width: 48,

    height: 38,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 8,
  },

  colorTextInput: {
    flex: 1,

    minHeight: 42,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 9,

    color: COLORS.TEXT,

    paddingHorizontal: 10,

    fontSize: 11,

    fontWeight: '700',
  },

  selectField: {
    minHeight: 44,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 9,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 12,
  },

  selectValue: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '700',
  },

  selectArrow: {
    color: COLORS.TEXT,

    fontSize: 18,
  },

  /*
   * Actions
   */

  bottomActions: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    alignItems: 'center',

    gap: 10,

    marginTop: 18,
  },

  primaryButton: {
    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 9,

    paddingHorizontal: 16,

    alignItems: 'center',

    justifyContent: 'center',
  },

  primaryButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  previewButton: {
    minHeight: 42,

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 9,

    paddingHorizontal: 16,

    alignItems: 'center',

    justifyContent: 'center',
  },

  previewButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  buttonDisabled: {
    opacity: 0.42,
  },

  buttonPressed: {
    opacity: 0.72,
  },

  /*
   * Modal
   */

  modalOverlay: {
    flex: 1,

    backgroundColor: COLORS.OVERLAY,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 18,
  },

  fontModal: {
    width: '100%',

    maxWidth: 420,

    backgroundColor: COLORS.CARD,

    borderRadius: 15,

    padding: 14,
  },

  previewModal: {
    width: '100%',

    maxWidth: 520,

    backgroundColor: COLORS.CARD,

    borderRadius: 15,

    padding: 14,
  },

  designerModal: {
    width: '100%',

    maxWidth: 720,

    maxHeight: '90%',

    backgroundColor: COLORS.CARD,

    borderRadius: 15,

    padding: 14,
  },

  modalHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 10,

    marginBottom: 12,
  },

  modalTitle: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 14,

    fontWeight: '900',
  },

  closeButton: {
    width: 38,

    height: 38,

    backgroundColor: COLORS.BLUE,

    borderRadius: 9,

    alignItems: 'center',

    justifyContent: 'center',
  },

  closeButtonText: {
    color: COLORS.TEXT,

    fontSize: 22,

    lineHeight: 23,
  },

  fontOption: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    borderRadius: 8,

    paddingHorizontal: 11,
  },

  fontOptionSelected: {
    backgroundColor: '#153552',
  },

  fontOptionText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '700',
  },

  selectedCheck: {
    color: COLORS.CYAN,

    fontSize: 13,

    fontWeight: '900',
  },

  /*
   * Preview
   */

  previewStage: {
    minHeight: 350,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: '#08172A',

    borderRadius: 12,

    padding: 20,
  },

  previewCard: {
    borderRadius: 9,

    alignItems: 'center',

    padding: 16,

    elevation: 4,
  },

  previewCardPortrait: {
    width: 220,

    height: 310,
  },

  previewCardLandscape: {
    width: 340,

    height: 215,
  },

  previewPhoto: {
    width: 72,

    height: 88,

    backgroundColor: '#CBD5E1',

    borderRadius: 6,

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 20,
  },

  previewPhotoText: {
    color: '#475569',

    fontSize: 9,

    fontWeight: '800',
  },

  previewStudentName: {
    fontSize: 18,

    fontWeight: '900',

    marginTop: 18,
  },

  previewStudentRole: {
    fontSize: 10,

    fontWeight: '900',

    marginTop: 6,
  },

  previewDetails: {
    fontSize: 10,

    marginTop: 12,
  },

  designerDescription: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 16,

    marginBottom: 12,
  },

  /*
   * State
   */

  stateContainer: {
    minHeight: 120,

    alignItems: 'center',

    justifyContent: 'center',
  },

  stateText: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 8,
  },

  errorText: {
    color: COLORS.ERROR,

    fontSize: 10,

    marginVertical: 10,
  },
});
