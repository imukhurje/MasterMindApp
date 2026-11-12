// src/screens/Admin/Management/AdminManagementDashboard.styles.js

import { StyleSheet } from 'react-native';

const COLORS = {
  BG: '#081321',

  CARD: '#102742',
  CARD_DARK: '#0B1A2E',
  CARD_LIGHT: '#142B49',

  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',

  BORDER: '#376D99',
  BORDER_SOFT: '#294B69',

  PRIMARY: '#2563EB',
  CYAN: '#7DD3FC',

  INCOME: '#34D399',
  EXPENSE: '#F472B6',
};

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  content: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 30,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.MUTED,
    fontSize: 12,
    marginTop: 10,
  },

  heroCard: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 16,

    padding: 14,

    marginBottom: 18,
  },

  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroTextArea: {
    flex: 1,
    paddingRight: 10,
  },

  heroTitle: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: '900',
  },

  heroSubtitle: {
    color: COLORS.MUTED,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  heroIcon: {
    width: 44,
    height: 44,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 13,
  },

  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,

    marginTop: 13,
    paddingTop: 11,

    borderTopWidth: 1,
    borderTopColor: 'rgba(55,109,153,0.35)',
  },

  schoolName: {
    flex: 1,

    color: COLORS.MUTED,

    fontSize: 11,
    fontWeight: '700',
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 15,
    fontWeight: '900',

    marginBottom: 10,
  },

  feeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,

    marginBottom: 18,
  },

  feeGridMobile: {
    flexDirection: 'column',
  },

  feeCard: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 14,

    padding: 13,
  },

  feeCardWide: {
    flex: 1,
    minWidth: 180,
  },

  feeCardMobile: {
    width: '100%',
  },

  feeCardIcon: {
    width: 36,
    height: 36,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderRadius: 10,

    marginBottom: 11,
  },

  feeLabel: {
    color: COLORS.MUTED,

    fontSize: 11,
    fontWeight: '700',
  },

  feeValue: {
    color: COLORS.TEXT,

    fontSize: 22,
    fontWeight: '900',

    marginTop: 4,
  },

  analyticsGrid: {
    gap: 12,
  },

  analyticsGridWide: {
    flexDirection: 'row',
  },

  analyticsColumn: {
    width: '100%',
  },

  analyticsColumnWide: {
    flex: 1,
    minWidth: 0,
  },

  analyticsCard: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 16,

    padding: 13,

    marginBottom: 12,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 13,
  },

  cardTitle: {
    color: COLORS.TEXT,

    fontSize: 14,
    fontWeight: '900',
  },

  cardCountBadge: {
    minWidth: 26,
    height: 26,

    paddingHorizontal: 7,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#173B60',

    borderRadius: 999,
  },

  cardCountText: {
    color: COLORS.CYAN,

    fontSize: 10,
    fontWeight: '900',
  },

  distributionList: {
    gap: 12,
  },

  distributionItem: {
    width: '100%',
  },

  distributionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 5,
  },

  distributionLabel: {
    flex: 1,

    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '700',

    paddingRight: 10,
  },

  distributionValue: {
    color: COLORS.TEXT,

    fontSize: 11,
    fontWeight: '900',
  },

  progressTrack: {
    width: '100%',
    height: 8,

    backgroundColor: COLORS.CARD_DARK,

    borderRadius: 999,

    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',

    backgroundColor: '#60A5FA',

    borderRadius: 999,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 24,
  },

  emptyText: {
    color: COLORS.MUTED,

    fontSize: 11,
    textAlign: 'center',

    marginTop: 7,
  },

  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 14,

    marginTop: 11,
    marginBottom: 14,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 5,
  },

  legendDot: {
    width: 8,
    height: 8,

    borderRadius: 4,
  },

  incomeDot: {
    backgroundColor: COLORS.INCOME,
  },

  expenseDot: {
    backgroundColor: COLORS.EXPENSE,
  },

  legendText: {
    color: COLORS.MUTED,

    fontSize: 10,
    fontWeight: '700',
  },

  financialList: {
    gap: 14,
  },

  financialMonth: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(55,109,153,0.28)',

    paddingTop: 11,
  },

  monthLabel: {
    color: COLORS.TEXT,

    fontSize: 12,
    fontWeight: '900',

    marginBottom: 8,
  },

  monthBars: {
    gap: 7,
  },

  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 7,
  },

  amountTypeLabel: {
    width: 52,

    color: COLORS.MUTED,

    fontSize: 9,
    fontWeight: '700',
  },

  amountBarTrack: {
    flex: 1,
    height: 9,

    backgroundColor: COLORS.CARD_DARK,

    borderRadius: 999,

    overflow: 'hidden',
  },

  incomeBar: {
    height: '100%',

    backgroundColor: COLORS.INCOME,

    borderRadius: 999,
  },

  expenseBar: {
    height: '100%',

    backgroundColor: COLORS.EXPENSE,

    borderRadius: 999,
  },

  amountValue: {
    width: 76,

    color: '#DCE7F5',

    textAlign: 'right',

    fontSize: 9,
    fontWeight: '800',
  },

  pieChartWrapper: {
    width: 170,
    height: 170,

    alignSelf: 'center',

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 4,
    marginBottom: 18,
  },

  pieCenterLabel: {
    position: 'absolute',

    width: 68,
    height: 68,

    borderRadius: 34,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#102742',
  },

  pieTotalValue: {
    color: '#F1F5F9',

    fontSize: 18,
    fontWeight: '900',
  },

  pieTotalLabel: {
    color: '#A8B6C9',

    fontSize: 9,
    fontWeight: '700',

    marginTop: 1,
  },

  pieLegend: {
    width: '100%',

    gap: 9,
  },

  pieLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',

    minHeight: 24,
  },

  pieLegendDot: {
    width: 9,
    height: 9,

    borderRadius: 5,

    marginRight: 8,
  },

  pieLegendLabel: {
    flex: 1,

    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '700',

    paddingRight: 5,
  },

  pieLegendValue: {
    minWidth: 25,

    color: '#F1F5F9',

    fontSize: 11,
    fontWeight: '900',

    textAlign: 'right',
  },

  pieLegendPercentage: {
    width: 48,

    color: '#A8B6C9',

    fontSize: 9,
    fontWeight: '700',

    textAlign: 'right',

    marginLeft: 5,
  },

  barChartWrapper: {
    width: '100%',

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 12,

    paddingHorizontal: 4,
    paddingTop: 8,

    overflow: 'hidden',
  },

  financialSummaryFooter: {
    marginTop: 12,

    gap: 7,
  },

  financialSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 9,

    paddingHorizontal: 10,
    paddingVertical: 8,

    gap: 8,
  },

  financialSummaryMonth: {
    width: 35,

    color: '#F1F5F9',

    fontSize: 10,
    fontWeight: '900',
  },

  financialIncomeText: {
    flex: 1,

    color: '#34D399',

    fontSize: 9,
    fontWeight: '800',
  },

  financialExpenseText: {
    flex: 1,

    color: '#F472B6',

    fontSize: 9,
    fontWeight: '800',

    textAlign: 'right',
  },
});
