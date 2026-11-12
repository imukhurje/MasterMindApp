import { StyleSheet } from 'react-native';

const COLORS = {
  CARD: '#0B192D',
  FIELD: '#14263E',
  FIELD_OPEN: '#182D48',
  DROPDOWN: '#10243B',

  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',

  SELECTED: '#1C3857',
  DIVIDER: '#243950',

  GREEN: '#40D4B2',
};

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 320,

    position: 'relative',

    zIndex: 100,
    elevation: 20,
  },

  label: {
    color: COLORS.MUTED,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
  },

  selectButton: {
    minHeight: 46,

    backgroundColor: COLORS.FIELD,

    borderRadius: 11,

    /*
     * No blue outline.
     */
    borderWidth: 0,

    paddingHorizontal: 14,

    flexDirection: 'row',
    alignItems: 'center',
  },

  selectButtonOpen: {
    backgroundColor: COLORS.FIELD_OPEN,
  },

  selectedText: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 14,
    fontWeight: '800',
  },

  chevron: {
    color: COLORS.MUTED,

    fontSize: 18,

    marginLeft: 10,
  },

  chevronOpen: {
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },

  dropdown: {
    position: 'absolute',

    top: 70,
    left: 0,
    right: 0,

    backgroundColor: COLORS.DROPDOWN,

    borderRadius: 11,

    overflow: 'hidden',

    zIndex: 200,
    elevation: 30,

    /*
     * No blue dropdown border.
     */
    borderWidth: 0,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  option: {
    minHeight: 46,

    paddingHorizontal: 14,

    flexDirection: 'row',
    alignItems: 'center',
  },

  optionSelected: {
    backgroundColor: COLORS.SELECTED,
  },

  optionDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,

    borderBottomColor: COLORS.DIVIDER,
  },

  optionText: {
    flex: 1,

    color: COLORS.MUTED,

    fontSize: 13,
    fontWeight: '600',
  },

  optionTextSelected: {
    color: COLORS.TEXT,
    fontWeight: '800',
  },

  checkMark: {
    color: COLORS.GREEN,

    fontSize: 15,
    fontWeight: '900',

    marginLeft: 10,
  },

  buttonPressed: {
    opacity: 0.72,
  },
});
