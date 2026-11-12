import { StyleSheet } from 'react-native';

const COLORS = {
  BG: '#0F172A',

  SHEET: '#0B1A2E',
  CARD: '#102742',
  CARD_LIGHT: '#16365B',

  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',

  BORDER: '#376D99',

  PRIMARY: '#2563EB',
  CYAN: '#67D1F0',
};

export default StyleSheet.create({
  overlay: {
    flex: 1,

    justifyContent: 'flex-end',

    backgroundColor: 'rgba(3, 10, 20, 0.42)',
  },

  sheet: {
    width: '100%',

    backgroundColor: '#0B1A2E',

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#376D99',

    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.28,
    shadowRadius: 14,

    elevation: 18,
  },

  handle: {
    alignSelf: 'center',

    width: 52,
    height: 5,

    borderRadius: 999,

    backgroundColor: '#6B8199',

    marginBottom: 22,
  },

  iconOuter: {
    alignSelf: 'center',

    width: 68,
    height: 68,

    borderRadius: 34,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#102D4A',

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    marginBottom: 20,
  },

  iconInner: {
    width: 56,
    height: 56,

    borderRadius: 28,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',
  },

  title: {
    color: COLORS.TEXT,

    fontSize: 23,
    fontWeight: '900',

    textAlign: 'center',
  },

  subtitle: {
    color: COLORS.MUTED,

    fontSize: 13,
    lineHeight: 20,

    textAlign: 'center',

    marginTop: 8,
    marginBottom: 24,

    paddingHorizontal: 8,
  },

  versionCard: {
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 18,

    padding: 12,

    marginBottom: 24,
  },

  versionBox: {
    flex: 1,

    minHeight: 106,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.BG,

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 15,
  },

  latestVersionBox: {
    backgroundColor: COLORS.CARD_LIGHT,

    borderColor: '#4E92C7',
  },

  versionIcon: {
    marginBottom: 7,
  },

  versionLabel: {
    color: COLORS.MUTED,

    fontSize: 11,
    fontWeight: '700',

    marginBottom: 6,
  },

  versionValue: {
    color: COLORS.TEXT,

    fontSize: 18,
    fontWeight: '900',
  },

  arrowArea: {
    width: 38,

    alignItems: 'center',
    justifyContent: 'center',
  },

  updateButton: {
    width: '100%',
    minHeight: 54,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 9,

    backgroundColor: '#2563EB',

    borderRadius: 14,

    paddingHorizontal: 18,
  },

  updateButtonText: {
    color: '#FFFFFF',

    fontSize: 16,
    fontWeight: '900',
  },

  pressed: {
    opacity: 0.78,
  },

  disabled: {
    opacity: 0.55,
  },
  iconWrap: {
    alignSelf: 'center',

    width: 62,
    height: 62,

    borderRadius: 31,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#102D4A',

    borderWidth: 1,
    borderColor: '#376D99',

    marginBottom: 18,
  },

  icon: {
    fontSize: 28,
  },
});
