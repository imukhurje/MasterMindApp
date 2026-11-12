import { StyleSheet } from 'react-native';

export const COLORS = {
  OVERLAY: 'rgba(2, 8, 23, 0.88)',

  CARD: '#0F1E34',
  PANEL: '#10233D',
  PANEL_DARK: '#08172B',

  TEXT: '#FFFFFF',
  MUTED: '#AAB7CB',
  MUTED_DARK: '#64748B',

  BORDER: '#316D99',

  BLUE: '#3478F6',
  GREEN: '#43D19E',
  RED: '#E64750',

  INPUT: '#08182D',

  ERROR: '#FFB4BA',
};

export const styles = StyleSheet.create({
  /*
   * Modal
   */

  overlay: {
    flex: 1,

    backgroundColor: COLORS.OVERLAY,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 10,
  },

  modalCard: {
    width: '96%',
    maxWidth: 1120,

    height: '94%',

    backgroundColor: COLORS.CARD,

    borderRadius: 18,

    overflow: 'hidden',
  },

  /*
   * Header
   */

  header: {
    minHeight: 68,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 16,
    paddingVertical: 12,

    gap: 12,

    position: 'relative',
  },

  headerCompact: {
    flexDirection: 'column',

    alignItems: 'stretch',

    paddingTop: 16,
    paddingRight: 66,
    paddingBottom: 14,

    gap: 10,
  },

  headerTitleArea: {
    flex: 1,

    minWidth: 0,
  },

  headerTitleAreaCompact: {
    width: '100%',

    flex: 0,
  },

  headerTitle: {
    color: COLORS.TEXT,

    fontSize: 16,
    lineHeight: 21,

    fontWeight: '900',
  },

  examTitle: {
    color: COLORS.MUTED,

    fontSize: 11,
    lineHeight: 16,

    marginTop: 3,
  },

  examTitleCompact: {
    width: '100%',

    fontSize: 11,
    lineHeight: 17,

    paddingRight: 4,
  },

  headerOptions: {
    flexDirection: 'row',

    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 10,
  },

  headerOptionsCompact: {
    width: '100%',

    flexDirection: 'column',

    alignItems: 'flex-start',

    gap: 4,

    marginTop: 2,
  },

  optionRow: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,
  },

  optionRowCompact: {
    minHeight: 34,

    backgroundColor: 'transparent',

    borderRadius: 8,

    paddingHorizontal: 0,
    paddingVertical: 4,

    alignSelf: 'flex-start',
  },

  optionLabel: {
    color: COLORS.TEXT,

    fontSize: 11,
    lineHeight: 16,

    fontWeight: '700',
  },

  checkbox: {
    width: 20,
    height: 20,

    backgroundColor: COLORS.INPUT,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 5,

    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: COLORS.BLUE,

    borderColor: COLORS.BLUE,
  },

  tick: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  closeButton: {
    width: 42,
    height: 42,

    backgroundColor: COLORS.RED,

    borderRadius: 11,

    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButtonCompact: {
    position: 'absolute',

    top: 14,
    right: 14,

    width: 42,
    height: 42,

    zIndex: 20,
  },

  closeText: {
    color: COLORS.TEXT,

    fontSize: 25,
    lineHeight: 27,

    fontWeight: '700',
  },

  /*
   * Common states
   */

  loadingContainer: {
    flex: 1,

    minHeight: 180,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 24,
  },

  loadingText: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 9,
  },

  errorText: {
    color: COLORS.ERROR,

    fontSize: 11,

    textAlign: 'center',
  },

  retryButton: {
    minHeight: 38,

    backgroundColor: COLORS.BLUE,

    borderRadius: 9,

    paddingHorizontal: 14,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 12,
  },

  retryText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.72,
  },

  disabledButton: {
    opacity: 0.42,
  },

  /*
   * Online evaluation
   */

  onlineBody: {
    flex: 1,

    flexDirection: 'row',

    gap: 14,

    paddingHorizontal: 12,
    paddingBottom: 12,
  },

  onlineBodyCompact: {
    flexDirection: 'column',

    gap: 14,

    paddingHorizontal: 14,
    paddingBottom: 14,
  },

  /*
   * Students panel
   */

  studentsPanel: {
    width: 320,

    backgroundColor: COLORS.PANEL_DARK,

    borderRadius: 16,

    padding: 12,

    overflow: 'hidden',
  },

  studentsPanelCompact: {
    width: '100%',

    maxHeight: 320,

    flexShrink: 0,
  },

  studentsHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 10,

    marginBottom: 10,
  },

  panelTitle: {
    color: COLORS.TEXT,

    fontSize: 15,

    fontWeight: '900',
  },

  studentCountText: {
    color: COLORS.MUTED,

    fontSize: 9,

    marginTop: 2,
  },

  submissionSummary: {
    minHeight: 26,

    backgroundColor: '#102B40',

    borderRadius: 13,

    paddingHorizontal: 9,

    alignItems: 'center',
    justifyContent: 'center',
  },

  submissionSummaryText: {
    color: '#71D8FF',

    fontSize: 8,

    fontWeight: '800',
  },

  studentSearchWrapper: {
    minHeight: 42,

    backgroundColor: COLORS.INPUT,

    borderRadius: 10,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 10,

    gap: 7,

    marginBottom: 9,
  },

  searchIcon: {
    color: COLORS.MUTED,

    fontSize: 15,
  },

  studentSearchInput: {
    flex: 1,

    minWidth: 0,

    color: COLORS.TEXT,

    fontSize: 11,

    paddingVertical: 8,
  },

  clearSearchText: {
    color: COLORS.MUTED,

    fontSize: 18,
    lineHeight: 19,
  },

  studentListContent: {
    paddingBottom: 6,
  },

  studentRow: {
    minHeight: 58,

    backgroundColor: 'transparent',

    borderRadius: 11,

    marginBottom: 6,

    paddingHorizontal: 9,
    paddingVertical: 8,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 9,
  },

  studentRowSelected: {
    backgroundColor: '#123147',

    borderWidth: 1,

    borderColor: '#63D4FF',
  },

  studentRowPressed: {
    opacity: 0.76,
  },

  studentAvatar: {
    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: '#173752',

    alignItems: 'center',
    justifyContent: 'center',
  },

  studentAvatarText: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  studentInfo: {
    flex: 1,

    minWidth: 0,
  },

  studentName: {
    flex: 1,

    minWidth: 0,

    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  studentIdText: {
    color: COLORS.MUTED_DARK,

    fontSize: 8,

    marginTop: 2,
  },

  notSubmittedText: {
    color: COLORS.MUTED_DARK,
  },

  statusBadge: {
    minHeight: 25,

    borderRadius: 13,

    paddingHorizontal: 8,

    alignItems: 'center',
    justifyContent: 'center',
  },

  submittedBadge: {
    backgroundColor: 'rgba(66, 211, 170, 0.12)',
  },

  notSubmittedBadge: {
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
  },

  statusBadgeText: {
    fontSize: 8,

    fontWeight: '800',
  },

  submittedBadgeText: {
    color: '#68E0B3',
  },

  notSubmittedBadgeText: {
    color: COLORS.MUTED_DARK,
  },

  noStudentsFound: {
    minHeight: 100,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 14,
  },

  noStudentsFoundTitle: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  noStudentsFoundText: {
    color: COLORS.MUTED,

    fontSize: 9,

    marginTop: 3,
  },

  /*
   * Evaluation panel
   */

  evaluationPanel: {
    flex: 1,

    minWidth: 0,
    minHeight: 0,

    backgroundColor: '#0D2238',

    borderRadius: 16,

    overflow: 'hidden',
  },

  questionsContent: {
    padding: 12,

    gap: 12,

    paddingBottom: 24,
  },

  noSubmission: {
    flex: 1,

    minHeight: 240,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 24,
  },

  noSubmissionTitle: {
    color: COLORS.TEXT,

    fontSize: 15,

    fontWeight: '900',
  },

  noSubmissionText: {
    color: COLORS.MUTED,

    fontSize: 11,

    marginTop: 6,

    textAlign: 'center',
  },

  /*
   * Extra items
   */

  extraSection: {
    backgroundColor: COLORS.PANEL_DARK,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderStyle: 'dashed',

    borderRadius: 12,

    padding: 10,

    marginTop: 4,
  },

  extraHeaderRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 10,

    paddingHorizontal: 2,

    marginBottom: 9,
  },

  extraTitle: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  extraHelperText: {
    flexShrink: 1,

    color: COLORS.MUTED,

    fontSize: 9,

    fontWeight: '600',

    textAlign: 'right',
  },

  extraItemsList: {
    gap: 7,
  },

  extraItemRow: {
    minHeight: 50,

    backgroundColor: '#07162A',

    borderWidth: 1,

    borderColor: '#2E6794',

    borderRadius: 10,

    paddingHorizontal: 9,
    paddingVertical: 6,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 10,
  },

  extraItemName: {
    flex: 1,

    minWidth: 0,

    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '900',
  },

  extraMarksArea: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

    flexShrink: 0,
  },

  extraFullMarksText: {
    color: '#DCE7F5',

    fontSize: 11,

    fontWeight: '700',
  },

  extraMarksInput: {
    width: 120,

    height: 38,

    backgroundColor: '#0B1D34',

    borderWidth: 1,

    borderColor: '#3975A4',

    borderRadius: 9,

    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '800',

    textAlign: 'right',

    paddingHorizontal: 14,

    paddingVertical: 0,
  },

  extraText: {
    color: COLORS.MUTED,

    fontSize: 10,

    paddingVertical: 8,
  },

  extraBottomActions: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'flex-end',

    gap: 8,

    marginTop: 8,
  },

  extraCloseButton: {
    minWidth: 74,

    height: 38,

    backgroundColor: '#10233D',

    borderWidth: 1,

    borderColor: '#4C8AB7',

    borderRadius: 9,

    paddingHorizontal: 12,

    alignItems: 'center',

    justifyContent: 'center',
  },

  extraCloseButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',
  },

  extraSaveButton: {
    minWidth: 160,

    height: 38,

    backgroundColor: COLORS.BLUE,

    borderRadius: 9,

    paddingHorizontal: 14,

    alignItems: 'center',

    justifyContent: 'center',
  },

  extraSaveButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',
  },

  /*
   * Offline evaluation
   */

  offlineContainer: {
    flex: 1,

    minHeight: 0,

    paddingHorizontal: 12,
    paddingBottom: 12,
  },

  offlineHeaderRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    flexWrap: 'wrap',

    gap: 10,

    marginBottom: 12,
  },

  offlineHeaderText: {
    flex: 1,

    minWidth: 180,
  },

  offlineTitle: {
    color: COLORS.TEXT,

    fontSize: 15,

    fontWeight: '900',
  },

  offlineSubtitle: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 3,
  },

  totalMarksBadge: {
    minHeight: 30,

    backgroundColor: COLORS.PANEL_DARK,

    borderRadius: 15,

    paddingHorizontal: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  totalMarksBadgeText: {
    color: COLORS.TEXT,

    fontSize: 9,

    fontWeight: '800',
  },

  /*
   * Desktop / Tablet Offline Table
   */

  offlineTableResponsive: {
    flex: 1,

    minHeight: 0,

    backgroundColor: COLORS.PANEL_DARK,

    borderRadius: 13,

    overflow: 'hidden',
  },

  responsiveTableHeader: {
    minHeight: 48,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#1B4266',

    paddingHorizontal: 8,
  },

  responsiveHeaderText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',

    paddingHorizontal: 8,
  },

  responsiveRowsScroll: {
    flex: 1,
  },

  responsiveTableRow: {
    minHeight: 58,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: COLORS.INPUT,

    paddingHorizontal: 8,

    borderBottomWidth: StyleSheet.hairlineWidth,

    borderBottomColor: '#294866',
  },

  responsiveRollColumn: {
    flex: 0.65,

    minWidth: 0,
  },

  responsiveStudentColumn: {
    flex: 1.85,

    minWidth: 0,
  },

  responsiveMarkColumn: {
    flex: 1.1,

    minWidth: 0,

    paddingHorizontal: 8,

    justifyContent: 'center',
  },

  responsiveActionColumn: {
    flex: 0.65,

    minWidth: 0,

    paddingHorizontal: 8,

    alignItems: 'center',
    justifyContent: 'center',
  },

  responsiveCellText: {
    color: COLORS.TEXT,

    fontSize: 10,

    paddingHorizontal: 8,
  },

  responsiveStudentText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '700',

    paddingHorizontal: 8,
  },

  responsiveMarkInput: {
    width: 90,

    minHeight: 38,

    backgroundColor: COLORS.PANEL_DARK,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 8,

    color: COLORS.TEXT,

    fontSize: 11,

    textAlign: 'center',

    paddingHorizontal: 6,
  },

  responsiveSaveButton: {
    minWidth: 58,

    minHeight: 36,

    backgroundColor: COLORS.BLUE,

    borderRadius: 8,

    paddingHorizontal: 8,

    alignItems: 'center',
    justifyContent: 'center',
  },

  responsiveSaveButtonText: {
    color: COLORS.TEXT,

    fontSize: 9,

    fontWeight: '900',
  },

  /*
   * Mobile Offline Layout
   *
   * Student + Marks + Full Marks + Save
   * stay in the same row.
   */

  mobileOfflineList: {
    flex: 1,

    minHeight: 0,
  },

  mobileOfflineListContent: {
    gap: 8,

    paddingBottom: 10,
  },

  offlineCompactRow: {
    width: '100%',

    minHeight: 62,

    backgroundColor: COLORS.PANEL_DARK,

    borderRadius: 11,

    paddingHorizontal: 10,
    paddingVertical: 8,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,
  },

  offlineCompactStudent: {
    flex: 1,

    minWidth: 0,
  },

  offlineCompactStudentName: {
    color: COLORS.TEXT,

    fontSize: 10,
    lineHeight: 14,

    fontWeight: '900',
  },

  offlineCompactRoll: {
    color: COLORS.MUTED,

    fontSize: 8,

    marginTop: 2,
  },

  offlineCompactMarks: {
    flexDirection: 'row',

    alignItems: 'center',

    flexShrink: 0,

    gap: 3,
  },

  offlineCompactMarkInput: {
    width: 58,
    height: 36,

    backgroundColor: COLORS.INPUT,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 8,

    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '800',

    textAlign: 'center',

    paddingHorizontal: 4,
    paddingVertical: 0,
  },

  offlineCompactSlash: {
    color: COLORS.MUTED,

    fontSize: 10,
  },

  offlineCompactFullMarks: {
    minWidth: 20,
    maxWidth: 32,

    color: COLORS.TEXT,

    fontSize: 9,

    fontWeight: '800',

    textAlign: 'center',
  },

  offlineCompactSaveButton: {
    width: 52,
    height: 36,

    backgroundColor: COLORS.BLUE,

    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',

    flexShrink: 0,
  },

  offlineCompactSaveText: {
    color: COLORS.TEXT,

    fontSize: 9,

    fontWeight: '900',
  },

  evaluationCompleteNotice: {
    backgroundColor: 'rgba(52, 120, 246, 0.08)',

    borderRadius: 9,

    paddingHorizontal: 10,
    paddingVertical: 8,

    marginTop: 9,
  },

  evaluationCompleteNoticeText: {
    color: COLORS.MUTED,

    fontSize: 9,
    lineHeight: 14,
  },
});
