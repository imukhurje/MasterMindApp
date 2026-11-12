import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#142B49',
  CARD_DARK: '#0B1C32',
  TEXT: '#FFFFFF',
  MUTED: '#94A3B8',
  BORDER: '#3B7197',
  BLUE: '#3B82F6',
  RED: '#EF4444',
  GREEN: '#22C55E',
  ORANGE: '#F59E0B',
};

export const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  sectionHeaderText: {
    flex: 1,
    paddingRight: 10,
  },

  sectionTitle: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: COLORS.MUTED,
    fontSize: 12,
    marginTop: 3,
  },

  publishContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  publishLabel: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '700',
    marginRight: 6,
  },

  topFields: {
    gap: 12,
  },

  topFieldsWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  topFieldsMobile: {
    flexDirection: 'column',
  },

  titleFieldWide: {
    flex: 2,
  },

  smallFieldWide: {
    flex: 1,
  },

  fieldBlock: {
    marginBottom: 16,
  },

  label: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 7,
  },

  textInput: {
    minHeight: 48,
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    color: COLORS.TEXT,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },

  descriptionInput: {
    minHeight: 120,
  },

  tokenInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tokenInput: {
    flex: 1,
    minHeight: 48,
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    color: COLORS.TEXT,
    fontSize: 14,
    paddingHorizontal: 12,
  },

  plusButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.BLUE,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 9,
  },

  plusButtonText: {
    color: COLORS.TEXT,
    fontSize: 24,
    fontWeight: '700',
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 9,
  },

  chip: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 20,
    paddingLeft: 11,
    paddingRight: 5,
    paddingVertical: 5,
  },

  chipText: {
    color: COLORS.TEXT,
    fontSize: 12,
    maxWidth: 180,
  },

  chipRemoveButton: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#17233B',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
  },

  chipRemoveText: {
    color: COLORS.MUTED,
    fontSize: 18,
    lineHeight: 20,
  },

  subjectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  subjectHeaderText: {
    flex: 1,
    paddingRight: 10,
  },

  subjectCountText: {
    color: COLORS.MUTED,
    fontSize: 10,
    marginTop: -3,
  },

  subjectSearchContainer: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 11,
    paddingHorizontal: 11,
    marginBottom: 9,
  },

  subjectSearchIcon: {
    fontSize: 13,
    marginRight: 8,
  },

  subjectSearchInput: {
    flex: 1,
    color: COLORS.TEXT,
    fontSize: 13,
    paddingVertical: 8,
  },

  subjectSearchClearButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  subjectSearchClearText: {
    color: COLORS.MUTED,
    fontSize: 13,
    fontWeight: '800',
  },

  subjectErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3A1721',
    borderWidth: 1,
    borderColor: COLORS.RED,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 9,
  },

  subjectErrorText: {
    flex: 1,
    color: '#FCA5A5',
    fontSize: 11,
    paddingRight: 10,
  },

  subjectRetryText: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: '800',
  },
  subjectContainer: {
    backgroundColor: COLORS.CARD_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    padding: 6,
    overflow: 'hidden',
  },

  subjectScrollView: {
    maxHeight: 200,
  },

  subjectScrollContent: {
    padding: 4,
    gap: 7,
  },

  subjectLoadingContainer: {
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  subjectLoadingText: {
    color: COLORS.MUTED,
    fontSize: 11,
    marginLeft: 8,
  },

  subjectEmptyText: {
    color: COLORS.MUTED,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 16,
  },

  subjectOption: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  subjectOptionSelected: {
    backgroundColor: '#173C65',
    borderColor: COLORS.BLUE,
  },

  subjectOptionAttached: {
    backgroundColor: '#123A2A',
    borderColor: COLORS.GREEN,
  },

  subjectOptionDisabled: {
    opacity: 0.55,
  },

  subjectCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  subjectCheckboxSelected: {
    backgroundColor: COLORS.BLUE,
    borderColor: COLORS.BLUE,
  },

  subjectCheckmark: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: '900',
  },

  subjectTextContainer: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },

  subjectText: {
    color: COLORS.MUTED,
    fontSize: 14,
    fontWeight: '600',
  },

  subjectTextSelected: {
    color: COLORS.TEXT,
    fontWeight: '700',
  },

  subjectDescription: {
    color: '#CBD5E1',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
  },

  subjectClassGroups: {
    color: COLORS.MUTED,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 4,
  },

  subjectBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  subjectAttachedBadge: {
    backgroundColor: COLORS.GREEN,
  },

  subjectPendingBadge: {
    backgroundColor: '#402E0A',
    borderWidth: 1,
    borderColor: COLORS.ORANGE,
  },

  subjectAttachedBadgeText: {
    color: '#052E16',
    fontSize: 9,
    fontWeight: '900',
  },

  subjectPendingBadgeText: {
    color: '#FCD34D',
    fontSize: 9,
    fontWeight: '900',
  },

  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },

  saveButton: {
    minWidth: 90,
    backgroundColor: COLORS.BLUE,
    borderRadius: 11,
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  saveButtonText: {
    color: COLORS.TEXT,
    fontWeight: '800',
  },

  deleteButton: {
    minWidth: 90,
    backgroundColor: COLORS.RED,
    borderRadius: 11,
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  deleteButtonText: {
    color: COLORS.TEXT,
    fontWeight: '800',
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonDisabled: {
    opacity: 0.4,
  },
});
