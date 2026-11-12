import { StyleSheet } from 'react-native';

const COLORS = {
  BACKDROP: 'rgba(0, 0, 0, 0.72)',

  MODAL: '#102742',
  CARD: '#0B1A2E',

  TEXT: '#F1F5F9',
  BODY: '#E0E7F1',
  MUTED: '#B9C8DC',

  BORDER: '#4E92C7',
  BORDER_SOFT: '#315D84',

  DANGER: '#EF4444',
};

export default StyleSheet.create({
  backdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.BACKDROP,

    paddingHorizontal: 14,
    paddingVertical: 28,
  },

  modal: {
    backgroundColor: COLORS.MODAL,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 16,

    overflow: 'hidden',

    elevation: 12,
  },

  header: {
    flexShrink: 0,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    minHeight: 68,

    paddingLeft: 15,
    paddingRight: 10,
    paddingVertical: 10,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  headerTextArea: {
    flex: 1,

    paddingRight: 12,
  },

  title: {
    color: COLORS.TEXT,

    fontSize: 16,
    lineHeight: 21,

    fontWeight: '900',
  },

  subtitle: {
    color: COLORS.MUTED,

    fontSize: 11,
    lineHeight: 16,

    marginTop: 2,
  },

  closeButton: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.DANGER,

    borderRadius: 10,

    elevation: 4,
  },

  scrollView: {
    flex: 1,

    minHeight: 0,
  },

  scrollContent: {
    flexGrow: 0,

    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 30,
  },

  card: {
    width: '100%',

    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 14,

    paddingHorizontal: 13,
    paddingVertical: 14,

    marginBottom: 12,
  },

  cardTitle: {
    color: COLORS.TEXT,

    fontSize: 13,
    lineHeight: 18,

    fontWeight: '900',

    marginBottom: 9,
  },

  paragraph: {
    color: COLORS.BODY,

    fontSize: 11,
    lineHeight: 18,
  },

  paragraphSpacing: {
    marginTop: 8,
  },

  bold: {
    color: '#FFFFFF',

    fontWeight: '900',
  },

  bulletRow: {
    width: '100%',

    flexDirection: 'row',
    alignItems: 'flex-start',

    paddingRight: 4,

    marginBottom: 7,
  },

  bullet: {
    width: 17,

    color: COLORS.TEXT,

    fontSize: 12,
    lineHeight: 18,

    textAlign: 'center',
  },

  bulletText: {
    flex: 1,

    color: COLORS.BODY,

    fontSize: 11,
    lineHeight: 18,
  },

  bottomSpacer: {
    height: 8,
  },

  pressed: {
    opacity: 0.7,
  },
});
