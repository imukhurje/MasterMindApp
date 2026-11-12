import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',
  CARD_SECONDARY: '#0D1B2F',

  FIELD: '#0A1A2E',
  FIELD_ACTIVE: '#102845',

  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',

  BLUE: '#3478F6',
  BLUE_SOFT: '#649CFB',

  RED: '#D94B55',
  RED_SOFT: '#FFB4BA',

  TRACK: '#294963',
  TRACK_SELECTED: '#3478F6',

  OVERLAY: 'rgba(2, 8, 23, 0.86)',
};

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: COLORS.OVERLAY,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 18,
  },

  modalCard: {
    width: '94%',
    maxWidth: 720,

    backgroundColor: COLORS.CARD,

    borderRadius: 20,

    overflow: 'hidden',

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.35,
    shadowRadius: 24,

    elevation: 20,
  },

  header: {
    minHeight: 68,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },

  headerText: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    color: COLORS.TEXT,

    fontSize: 20,
    fontWeight: '900',
  },

  subtitle: {
    color: COLORS.MUTED,

    fontSize: 12,
    fontWeight: '600',

    marginTop: 3,
  },

  closeButton: {
    width: 42,
    height: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 14,
  },

  closeButtonText: {
    color: COLORS.TEXT,

    fontSize: 25,
    lineHeight: 26,

    fontWeight: '500',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },

  label: {
    color: COLORS.MUTED,

    fontSize: 12,
    fontWeight: '700',

    marginBottom: 7,
  },

  textInput: {
    minHeight: 48,

    backgroundColor: COLORS.FIELD,

    borderRadius: 11,

    color: COLORS.TEXT,

    fontSize: 14,
    fontWeight: '600',

    paddingHorizontal: 14,
  },

  rangeLabel: {
    color: COLORS.MUTED,

    fontSize: 12,
    fontWeight: '800',

    marginTop: 17,
    marginBottom: 8,
  },

  /*
   * Start and End time remain on one row.
   */
  timeFieldsRow: {
    width: '100%',

    flexDirection: 'row',
    alignItems: 'flex-end',

    gap: 10,

    marginBottom: 10,
  },

  timeFieldGroup: {
    flex: 1,

    minWidth: 0,
  },

  timeFieldLabel: {
    color: COLORS.MUTED,

    fontSize: 11,
    fontWeight: '700',

    marginBottom: 6,
  },

  timeInput: {
    width: '100%',
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderRadius: 11,

    color: COLORS.TEXT,

    fontSize: 15,
    fontWeight: '800',

    paddingHorizontal: 14,
  },

  timeSeparatorContainer: {
    width: 30,
    height: 46,

    alignItems: 'center',
    justifyContent: 'center',
  },

  timeSeparator: {
    color: COLORS.MUTED,

    fontSize: 18,
    fontWeight: '700',
  },

  sliderWrapper: {
    width: '100%',
  },

  sliderTouchArea: {
    height: 40,

    justifyContent: 'center',
  },

  sliderTrack: {
    width: '100%',
    height: 8,

    backgroundColor: COLORS.TRACK,

    borderRadius: 5,

    position: 'relative',
    overflow: 'visible',
  },

  occupiedRange: {
    position: 'absolute',

    top: 0,
    bottom: 0,

    backgroundColor: COLORS.RED,

    borderRadius: 5,

    opacity: 0.9,

    zIndex: 2,
  },

  selectedRange: {
    position: 'absolute',

    top: 0,
    bottom: 0,

    backgroundColor: COLORS.TRACK_SELECTED,

    borderRadius: 5,

    zIndex: 3,
  },

  sliderThumb: {
    position: 'absolute',

    top: -7,

    width: 22,
    height: 22,

    borderRadius: 11,

    backgroundColor: COLORS.BLUE,

    borderWidth: 2,
    borderColor: COLORS.BLUE_SOFT,

    zIndex: 5,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.3,
    shadowRadius: 4,

    elevation: 6,
  },

  selectedTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 8,

    marginTop: 5,
  },

  selectedTimeBadge: {
    minHeight: 34,

    backgroundColor: COLORS.FIELD_ACTIVE,

    borderRadius: 17,

    paddingHorizontal: 12,

    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedTimeBadgeConflict: {
    backgroundColor: '#3A1C26',
  },

  selectedTimeText: {
    color: COLORS.TEXT,

    fontSize: 13,
    fontWeight: '900',
  },

  durationText: {
    color: COLORS.MUTED,

    fontSize: 11,
    fontWeight: '600',
  },

  conflictText: {
    color: COLORS.RED_SOFT,
  },

  conflictMessage: {
    color: COLORS.RED_SOFT,

    fontSize: 10,
    fontWeight: '600',

    marginTop: 5,
  },

  zoomHeader: {
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 10,

    marginTop: 6,
  },

  zoomValue: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '800',

    marginTop: 17,
  },

  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',

    gap: 16,

    marginTop: 7,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,
  },

  legendColor: {
    width: 18,
    height: 6,

    borderRadius: 3,
  },

  availableLegend: {
    backgroundColor: COLORS.BLUE,
  },

  occupiedLegend: {
    backgroundColor: COLORS.RED,
  },

  legendText: {
    color: COLORS.MUTED,

    fontSize: 10,
    fontWeight: '600',
  },

  actions: {
    flexDirection: 'row',

    justifyContent: 'flex-end',
    alignItems: 'center',

    gap: 9,

    marginTop: 18,
  },

  cancelButton: {
    minWidth: 90,
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

  addButton: {
    minWidth: 125,
    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 17,

    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.72,
  },

  disabledControl: {
    opacity: 0.42,
  },
});
