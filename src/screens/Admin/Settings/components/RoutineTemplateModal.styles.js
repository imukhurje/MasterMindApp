import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',

  FIELD: '#0B1C32',

  PANEL: '#10233C',

  DROPDOWN: '#162B46',

  TEXT: '#FFFFFF',

  MUTED: '#AAB7CB',

  BLUE: '#3478F6',

  GREEN: '#4FD1B5',

  ERROR: '#FFB4BA',

  OVERLAY: 'rgba(2, 8, 23, 0.88)',
};

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: COLORS.OVERLAY,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 12,
  },

  modalCard: {
    width: '96%',
    maxWidth: 800,

    maxHeight: '94%',

    backgroundColor: COLORS.CARD,

    borderRadius: 18,

    overflow: 'hidden',
  },

  header: {
    minHeight: 64,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 16,

    paddingTop: 12,

    paddingBottom: 8,
  },

  title: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 17,

    fontWeight: '900',
  },

  closeButton: {
    width: 40,
    height: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',

    marginLeft: 12,
  },

  closeButtonText: {
    color: COLORS.TEXT,

    fontSize: 24,

    lineHeight: 25,
  },

  contentScroll: {
    flexGrow: 0,
  },

  content: {
    paddingHorizontal: 16,

    paddingTop: 6,

    paddingBottom: 16,
  },

  fieldGroup: {
    marginBottom: 14,
  },

  label: {
    color: COLORS.MUTED,

    fontSize: 12,

    fontWeight: '700',

    marginBottom: 7,
  },

  smallLabel: {
    color: COLORS.MUTED,

    fontSize: 11,

    fontWeight: '600',

    marginBottom: 6,
  },

  textInput: {
    width: '100%',

    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    color: COLORS.TEXT,

    fontSize: 13,

    paddingHorizontal: 12,

    paddingVertical: 10,
  },

  descriptionInput: {
    minHeight: 85,
  },

  activeRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 14,

    paddingHorizontal: 2,
  },

  activeDescription: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: -3,
  },

  checkbox: {
    width: 26,
    height: 26,

    backgroundColor: COLORS.FIELD,

    borderRadius: 6,

    alignItems: 'center',

    justifyContent: 'center',
  },

  checkboxActive: {
    backgroundColor: '#6BB8DC',
  },

  checkboxTick: {
    color: COLORS.TEXT,

    fontSize: 16,

    fontWeight: '900',
  },

  mappingSection: {
    backgroundColor: COLORS.PANEL,

    borderRadius: 14,

    padding: 14,

    position: 'relative',

    /*
     * Dropdowns must be allowed to render
     * outside their own field area.
     */
    overflow: 'visible',

    zIndex: 100,
  },

  mappingTitle: {
    color: COLORS.TEXT,

    fontSize: 14,

    fontWeight: '900',

    marginBottom: 12,
  },

  masterSelectContainer: {
    zIndex: 1000,

    marginBottom: 10,
  },

  quickActions: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    flexWrap: 'wrap',

    gap: 8,

    marginBottom: 16,

    zIndex: 900,
  },

  quickButton: {
    minHeight: 40,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',

    justifyContent: 'center',
  },

  quickButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '800',
  },

  dayFieldOpen: {
    zIndex: 10000,
    elevation: 100,
  },

  daysGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 14,

    position: 'relative',

    overflow: 'visible',

    zIndex: 800,
  },

  dayField: {
    flexGrow: 1,

    flexBasis: 290,

    minWidth: 240,

    maxWidth: '100%',

    position: 'relative',

    zIndex: 1,
  },

  dayLabel: {
    color: COLORS.MUTED,

    fontSize: 11,

    fontWeight: '700',

    marginBottom: 6,
  },

  selectWrapperOpen: {
    zIndex: 20000,
    elevation: 100,
  },

  selectButton: {
    minHeight: 44,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    paddingHorizontal: 12,

    flexDirection: 'row',

    alignItems: 'center',
  },

  selectValue: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 13,

    fontWeight: '600',
  },

  selectArrow: {
    color: COLORS.TEXT,

    fontSize: 18,

    marginLeft: 8,
  },

  selectMenu: {
    position: 'absolute',
    top: 48,
    left: 0,

    right: 0,

    maxHeight: 220,

    backgroundColor: COLORS.DROPDOWN,

    borderRadius: 10,

    overflow: 'hidden',

    zIndex: 50000,

    elevation: 100,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.35,

    shadowRadius: 8,
  },

  selectMenuScroll: {
    maxHeight: 220,
  },

  selectOption: {
    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 12,
  },

  selectOptionSelected: {
    backgroundColor: '#203E62',
  },

  selectOptionText: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '600',
  },

  checkMark: {
    color: COLORS.GREEN,

    fontSize: 14,

    fontWeight: '900',

    marginLeft: 8,
  },

  blankHint: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 16,

    marginTop: 12,
  },

  noDayWarning: {
    color: '#E8C77A',

    fontSize: 10,

    marginTop: 5,
  },

  templatesLoading: {
    minHeight: 100,

    alignItems: 'center',

    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 8,
  },

  templateError: {
    minHeight: 100,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 12,
  },

  templateErrorText: {
    color: COLORS.ERROR,

    fontSize: 11,

    textAlign: 'center',
  },

  retryButton: {
    minHeight: 36,

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

  actions: {
    flexDirection: 'row',

    justifyContent: 'flex-end',

    alignItems: 'center',

    gap: 8,

    marginTop: 14,
  },

  cancelButton: {
    minHeight: 42,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignItems: 'center',

    justifyContent: 'center',
  },

  cancelButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '800',
  },

  saveButton: {
    minWidth: 78,

    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignItems: 'center',

    justifyContent: 'center',
  },

  saveButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.72,
  },

  buttonDisabled: {
    opacity: 0.42,
  },
});
