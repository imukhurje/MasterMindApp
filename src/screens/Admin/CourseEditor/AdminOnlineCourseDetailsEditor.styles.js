import { StyleSheet } from 'react-native';

export const COLORS = {
  BG: '#0F172A',
  CARD: '#142B49',
  CARD_DARK: '#0B1C32',
  TEXT: '#FFFFFF',
  MUTED: '#94A3B8',
  BORDER: '#3B7197',
  BLUE: '#3B82F6',
  RED: '#EF4444',
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  headerContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BG,
    padding: 24,
  },

  loadingText: {
    color: COLORS.MUTED,
    fontSize: 14,
    marginTop: 14,
  },

  header: {
    marginBottom: 14,
  },

  screenTitle: {
    color: COLORS.TEXT,
    fontSize: 23,
    fontWeight: '800',
  },

  courseMeta: {
    color: COLORS.MUTED,
    fontSize: 13,
    marginTop: 4,
  },

  inlineError: {
    backgroundColor: '#3F1D2A',
    borderWidth: 1,
    borderColor: COLORS.RED,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },

  inlineErrorText: {
    color: '#FCA5A5',
    fontSize: 13,
  },

  errorIcon: {
    fontSize: 44,
  },

  errorTitle: {
    color: COLORS.TEXT,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 12,
  },

  errorDescription: {
    color: COLORS.MUTED,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },

  retryText: {
    color: COLORS.BLUE,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 18,
  },
});
