import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',

  FIELD: '#0B1C32',

  TEXT: '#FFFFFF',

  MUTED: '#AAB7CB',

  MUTED_DARK: '#66758B',

  BLUE: '#3478F6',
};

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  addCard: {
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

    fontSize: 12,

    lineHeight: 18,

    marginTop: 6,

    marginBottom: 18,
  },

  formRow: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    flexWrap: 'wrap',

    gap: 16,
  },

  nameFieldGroup: {
    flexGrow: 1,

    flexBasis: 240,

    minWidth: 220,

    maxWidth: 300,
  },

  descriptionFieldGroup: {
    flexGrow: 2,

    flexBasis: 420,

    minWidth: 260,
  },

  label: {
    color: COLORS.MUTED,

    fontSize: 12,

    fontWeight: '600',

    marginBottom: 7,
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
    minHeight: 94,
  },

  addButton: {
    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 16,

    alignSelf: 'flex-start',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 14,
  },

  addButtonText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  countText: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 12,

    marginBottom: 7,

    paddingHorizontal: 2,
  },

  roomsContainer: {
    gap: 12,
  },

  roomCard: {
    minHeight: 84,

    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    padding: 16,

    justifyContent: 'center',
  },

  roomName: {
    color: COLORS.TEXT,

    fontSize: 14,

    fontWeight: '900',
  },

  roomDescription: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

    marginTop: 6,
  },

  noDescription: {
    color: COLORS.MUTED_DARK,

    fontSize: 10,

    marginTop: 5,

    fontStyle: 'italic',
  },

  emptyContainer: {
    minHeight: 170,

    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 24,
  },

  emptyTitle: {
    color: COLORS.TEXT,

    fontSize: 14,

    fontWeight: '900',
  },

  emptyDescription: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 17,

    textAlign: 'center',

    marginTop: 5,
  },

  stateContainer: {
    minHeight: 260,

    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 24,
  },

  stateText: {
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

    marginTop: 7,

    marginBottom: 14,
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

  buttonPressed: {
    opacity: 0.72,
  },

  buttonDisabled: {
    opacity: 0.42,
  },
});
