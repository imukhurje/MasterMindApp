import { StyleSheet } from 'react-native';

const COLORS = {
  CARD: '#102742',
  CARD_DARK: '#0B1A2E',

  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',

  BORDER: '#376D99',
  BORDER_SOFT: '#294B69',

  PRIMARY: '#2563EB',
  GREEN: '#34D399',
};

export default StyleSheet.create({
  areaContent: {
    gap: 11,
  },

  pressed: {
    opacity: 0.82,
  },

  secondaryTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 7,
  },

  secondaryTab: {
    minHeight: 39,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 11,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 9,
  },

  secondaryTabActive: {
    backgroundColor: COLORS.PRIMARY,

    borderColor: '#60A5FA',
  },

  secondaryTabText: {
    color: '#DCE7F5',

    fontSize: 9,
    fontWeight: '800',
  },

  secondaryTabTextActive: {
    color: '#FFFFFF',
  },

  sectionCard: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 16,

    padding: 13,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 16,
    fontWeight: '900',
  },

  sectionDescription: {
    color: COLORS.MUTED,

    fontSize: 10,
    lineHeight: 16,

    marginTop: 5,
    marginBottom: 13,
  },

  helperText: {
    color: '#DCE7F5',

    fontSize: 10,
    lineHeight: 16,

    marginTop: 12,
  },

  primaryButton: {
    minHeight: 43,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'flex-start',

    gap: 6,

    paddingHorizontal: 14,

    backgroundColor: COLORS.PRIMARY,

    borderRadius: 9,
  },

  primaryButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  outlineButton: {
    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'flex-start',

    gap: 7,

    paddingHorizontal: 13,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  outlineButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,
    fontWeight: '900',
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  divider: {
    height: 1,

    backgroundColor: 'rgba(55,109,153,0.30)',

    marginVertical: 13,
  },

  cardList: {
    gap: 9,
  },

  dataCard: {
    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 12,

    padding: 11,
  },

  dataCardHeader: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: 10,
  },

  dataCardTitle: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',
  },

  dataCardCode: {
    color: COLORS.MUTED,

    fontSize: 9,

    marginTop: 4,
  },

  dataDivider: {
    height: 1,

    backgroundColor: 'rgba(55,109,153,0.25)',

    marginVertical: 10,
  },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    rowGap: 11,
  },

  infoItem: {
    width: '50%',
  },

  infoItemLabel: {
    color: COLORS.MUTED,

    fontSize: 8,
  },

  infoItemValue: {
    color: COLORS.TEXT,

    fontSize: 9,
    fontWeight: '800',

    marginTop: 3,
  },

  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,

    borderWidth: 1,

    borderRadius: 999,
  },

  systemBadge: {
    borderColor: '#60A5FA',

    backgroundColor: 'rgba(37,99,235,0.15)',
  },

  customBadge: {
    borderColor: '#F59E0B',

    backgroundColor: 'rgba(245,158,11,0.12)',
  },

  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,

    backgroundColor: 'rgba(52,211,153,0.13)',

    borderWidth: 1,
    borderColor: COLORS.GREEN,

    borderRadius: 999,
  },

  typeBadgeText: {
    color: COLORS.TEXT,

    fontSize: 8,
    fontWeight: '900',
  },

  settingsList: {
    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 11,

    overflow: 'hidden',
  },

  settingRow: {
    minHeight: 48,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 12,

    paddingHorizontal: 11,
    paddingVertical: 9,

    backgroundColor: COLORS.CARD_DARK,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55,109,153,0.25)',
  },

  settingLabel: {
    flex: 1,

    color: COLORS.MUTED,

    fontSize: 10,
    fontWeight: '700',
  },

  settingValue: {
    flex: 1,

    color: COLORS.TEXT,

    fontSize: 10,
    fontWeight: '800',

    textAlign: 'right',
  },

  emptyCard: {
    alignItems: 'center',

    paddingVertical: 26,
    paddingHorizontal: 14,

    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,

    borderRadius: 12,
  },

  emptyTitle: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',

    marginTop: 7,
  },

  emptyText: {
    color: COLORS.MUTED,

    fontSize: 9,
    lineHeight: 14,

    textAlign: 'center',

    marginTop: 4,
  },

  roleText: {
    color: '#7DD3FC',

    fontSize: 10,
    fontWeight: '800',

    marginTop: 7,
  },
  groupFilterSection: {
    marginTop: 15,
  },

  lastSevenButton: {
    minHeight: 40,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'flex-start',

    gap: 6,

    paddingHorizontal: 12,

    marginBottom: 12,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  lastSevenText: {
    color: '#DCE7F5',

    fontSize: 10,
    fontWeight: '900',
  },

  filterRow: {
    flexDirection: 'row',

    gap: 8,

    marginBottom: 10,
  },

  filterField: {
    flex: 1,
  },

  filterLabel: {
    color: '#B9C8DC',

    fontSize: 9,
    fontWeight: '700',

    marginBottom: 5,
  },

  dateButton: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 6,

    paddingHorizontal: 10,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 9,
  },

  dateButtonText: {
    color: '#F1F5F9',

    fontSize: 10,
    fontWeight: '700',
  },

  filterInput: {
    minHeight: 44,

    justifyContent: 'center',

    paddingHorizontal: 10,

    color: '#F1F5F9',

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 9,

    fontSize: 10,

    marginBottom: 10,
  },

  disabledFilter: {
    opacity: 0.55,

    marginBottom: 0,
  },

  disabledFilterText: {
    color: '#718096',

    fontSize: 10,
  },

  applyFilterButton: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  applyFilterButtonText: {
    color: '#F1F5F9',

    fontSize: 10,
    fontWeight: '900',
  },

  resultCount: {
    color: '#A8B6C9',

    fontSize: 9,

    marginTop: 12,
  },
  ledgerFilterSection: {
    marginTop: 4,
  },

  filterInputNoMargin: {
    minHeight: 44,

    justifyContent: 'center',

    paddingHorizontal: 10,

    color: '#F1F5F9',

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 9,

    fontSize: 10,
  },

  inactiveBadge: {
    backgroundColor: 'rgba(239,68,68,0.13)',

    borderColor: '#EF4444',
  },

  registrationActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,
  },

  registrationActionButton: {
    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    paddingHorizontal: 12,

    backgroundColor: '#2563EB',

    borderRadius: 9,
  },

  registrationActionText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',
  },

  registrationStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,

    backgroundColor: 'rgba(52,211,153,0.13)',

    borderWidth: 1,
    borderColor: '#34D399',

    borderRadius: 999,
  },
  registrationActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,
  },

  registrationActionButton: {
    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    paddingHorizontal: 12,

    backgroundColor: '#2563EB',

    borderRadius: 9,
  },

  registrationActionText: {
    color: '#FFFFFF',

    fontSize: 10,
    fontWeight: '900',
  },
  financeSettingsList: {
    gap: 8,
  },

  financeSettingCard: {
    minHeight: 62,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 12,

    paddingHorizontal: 12,
    paddingVertical: 10,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 10,
  },

  financeSettingLabel: {
    flex: 1,

    color: '#B9C8DC',

    fontSize: 10,
    fontWeight: '700',
  },

  financeSettingValue: {
    flex: 1,

    color: '#F1F5F9',

    fontSize: 11,
    fontWeight: '900',

    textAlign: 'right',
  },
});
