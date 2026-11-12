// src/screens/Admin/Payroll/AdminPayroll.styles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111F',
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07111F',
  },

  loadingText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },

  header: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#172C46',
    backgroundColor: '#081220',
  },

  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 8,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '900',
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },

  fixedTopArea: {
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 10,
  },

  bodyScroll: {
    flex: 1,
  },

  bodyScrollContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },

  subTabsCard: {
    padding: 9,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 12,
  },

  subTabs: {
    flexDirection: 'row',
    gap: 7,
  },

  subTab: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
    backgroundColor: '#0A1B30',
  },

  subTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#4B8CFF',
  },

  subTabText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },

  subTabTextActive: {
    color: '#FFFFFF',
  },

  summaryCard: {
    padding: 14,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 14,
  },

  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  eyebrow: {
    color: '#AFC2DA',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  summaryTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 5,
  },

  summarySubtitle: {
    color: '#AFC2DA',
    fontSize: 10,
    marginTop: 3,
  },

  payrollIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#124D78',
  },

  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },

  statCard: {
    width: '48%',
    minHeight: 72,
    justifyContent: 'center',
    padding: 11,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 10,
  },

  statValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  statLabel: {
    color: '#9FB1C8',
    fontSize: 9,
    marginTop: 5,
  },

  tabsCard: {
    padding: 12,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 14,
  },

  tabHint: {
    color: '#9FB1C8',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },

  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 11,
  },

  tab: {
    flexGrow: 1,
    minWidth: '30%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
    backgroundColor: '#0A1B30',
  },

  tabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#4B8CFF',
  },

  tabText: {
    color: '#E2E8F0',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    textAlign: 'center',
  },

  tabTextActive: {
    color: '#FFFFFF',
  },

  pressed: {
    opacity: 0.78,
  },
});
