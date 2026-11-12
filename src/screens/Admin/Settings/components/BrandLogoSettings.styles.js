import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',
  FIELD: '#0B1C32',
  FIELD_SECONDARY: '#172840',

  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',

  BLUE: '#3478F6',
  GREEN: '#4FD1B5',

  TRACK: '#3D4A5D',
  TRACK_ACTIVE: '#8FC7FF',

  DISABLED: 0.42,
};

export const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    padding: 16,

    borderWidth: 0,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 16,
    fontWeight: '900',

    marginBottom: 8,
  },

  description: {
    color: COLORS.MUTED,

    fontSize: 12,
    lineHeight: 18,

    marginBottom: 14,
  },

  label: {
    color: COLORS.MUTED,

    fontSize: 12,
    fontWeight: '600',

    marginBottom: 7,
  },

  filePicker: {
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderRadius: 10,

    flexDirection: 'row',
    alignItems: 'center',

    overflow: 'hidden',
  },

  chooseFileButton: {
    minHeight: 46,

    backgroundColor: COLORS.FIELD_SECONDARY,

    paddingHorizontal: 14,

    alignItems: 'center',
    justifyContent: 'center',
  },

  chooseFileButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '800',
  },

  fileName: {
    flex: 1,

    color: COLORS.MUTED,

    fontSize: 12,

    marginHorizontal: 12,
  },

  logoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',

    gap: 8,

    marginTop: 9,
  },

  uploadButton: {
    minHeight: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButton: {
    minHeight: 40,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  removeButton: {
    minHeight: 40,

    backgroundColor: COLORS.FIELD_SECONDARY,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',
    justifyContent: 'center',
  },

  removeButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '800',
  },

  logoHeightSection: {
    marginTop: 16,

    maxWidth: 390,
  },

  logoHeightText: {
    color: COLORS.MUTED,

    fontSize: 12,
    fontWeight: '700',

    marginBottom: 5,
  },

  sliderContainer: {
    width: '100%',
  },

  sliderTrackTouchArea: {
    width: '100%',

    height: 34,

    justifyContent: 'center',
  },

  sliderTrack: {
    height: 6,

    backgroundColor: COLORS.TRACK,

    borderRadius: 4,

    position: 'relative',
  },

  sliderProgress: {
    position: 'absolute',

    left: 0,
    top: 0,
    bottom: 0,

    backgroundColor: COLORS.TRACK_ACTIVE,

    borderRadius: 4,
  },

  sliderThumb: {
    position: 'absolute',

    top: -5,

    width: 16,
    height: 16,

    borderRadius: 8,

    backgroundColor: COLORS.TRACK_ACTIVE,

    transform: [
      {
        translateX: -8,
      },
    ],
  },

  sliderLimits: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginTop: -3,
  },

  sliderLimitText: {
    color: COLORS.MUTED,

    fontSize: 9,
  },

  helperText: {
    color: COLORS.MUTED,

    fontSize: 11,
    lineHeight: 17,

    marginTop: 8,

    maxWidth: 350,
  },

  saveSizeButton: {
    minHeight: 40,

    alignSelf: 'flex-start',

    backgroundColor: COLORS.FIELD_SECONDARY,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 9,
  },

  saveSizeButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  previewSection: {
    marginTop: 16,
  },

  previewTitle: {
    color: COLORS.MUTED,

    fontSize: 12,
    fontWeight: '700',

    marginBottom: 8,
  },

  previewBox: {
    minWidth: 90,
    minHeight: 90,

    alignSelf: 'flex-start',

    backgroundColor: COLORS.FIELD,

    borderRadius: 12,

    padding: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  logoPreviewImage: {
    width: 220,
    maxWidth: 220,
  },

  previewUnavailable: {
    color: COLORS.MUTED,

    fontSize: 11,
  },

  logoStatusText: {
    color: COLORS.MUTED,

    fontSize: 11,
    lineHeight: 17,

    marginTop: 10,
  },

  savedPathText: {
    color: COLORS.MUTED,

    fontSize: 11,
    lineHeight: 17,

    marginTop: 8,
  },

  loadingContainer: {
    minHeight: 180,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 20,
  },

  loadingText: {
    color: COLORS.MUTED,

    fontSize: 12,

    marginTop: 10,
  },

  errorTitle: {
    color: COLORS.TEXT,

    fontSize: 15,
    fontWeight: '900',

    textAlign: 'center',
  },

  errorDescription: {
    color: COLORS.MUTED,

    fontSize: 11,
    lineHeight: 17,

    textAlign: 'center',

    marginTop: 6,
    marginBottom: 12,
  },

  buttonPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: COLORS.DISABLED,
  },
});
