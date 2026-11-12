import { StyleSheet } from 'react-native';

export const COLORS = {
  BACKGROUND: '#071426',
  CARD: '#0B192D',
  CARD_SECONDARY: '#10243D',
  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 14,
  },

  settingsContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',

    backgroundColor: COLORS.CARD,

    borderRadius: 16,

    /*
     * No blue border.
     */
    borderWidth: 0,
  },

  contentContainer: {
    flex: 1,
    paddingTop: 16,
  },
});
