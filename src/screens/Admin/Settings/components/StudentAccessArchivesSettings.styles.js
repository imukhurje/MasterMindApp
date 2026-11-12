import { StyleSheet } from 'react-native';

export const COLORS = {
  CARD: '#111E34',

  INNER: '#08172B',

  FIELD: '#0B1C32',

  TEXT: '#FFFFFF',

  MUTED: '#AAB7CB',

  SECONDARY_TEXT: '#C7D3E6',

  BLUE: '#3478F6',

  BORDER: '#29435F',

  FIELD_BORDER: '#3B7197',

  GREEN: '#46C98D',

  GREEN_BG: '#11352F',

  DELETE: '#C74957',

  DELETE_BORDER: '#DE6672',

  ERROR: '#FFB4BA',
};

export const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.CARD,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 16,

    padding: 16,
  },

  sectionTitle: {
    color: COLORS.TEXT,

    fontSize: 17,

    fontWeight: '900',
  },

  description: {
    color: COLORS.MUTED,

    fontSize: 11,

    lineHeight: 18,

    marginTop: 6,
  },

  /*
   * Header actions
   */

  topActions: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 14,
  },

  refreshButton: {
    minHeight: 40,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: COLORS.FIELD,

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    paddingHorizontal: 15,
  },

  refreshButtonText: {
    color: COLORS.TEXT,

    fontSize: 11,

    fontWeight: '800',
  },

  /*
   * Summary
   */

  archiveSummaryRow: {
    flexDirection: 'row',

    alignItems: 'center',

    flexWrap: 'wrap',

    gap: 8,

    marginTop: 15,
  },

  archiveCount: {
    color: COLORS.SECONDARY_TEXT,

    fontSize: 11,

    fontWeight: '700',
  },

  privateBadge: {
    minHeight: 23,

    backgroundColor: '#173154',

    borderRadius: 12,

    paddingHorizontal: 8,

    alignItems: 'center',

    justifyContent: 'center',
  },

  privateBadgeText: {
    color: '#AECBFA',

    fontSize: 8,

    fontWeight: '900',

    letterSpacing: 0.4,
  },

  /*
   * Archive List
   */

  archiveList: {
    marginTop: 12,

    gap: 10,
  },

  archiveCard: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 14,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 14,

    padding: 14,
  },

  archiveCardMobile: {
    flexDirection: 'column',

    alignItems: 'stretch',
  },

  archiveCardUnavailable: {
    opacity: 0.65,
  },

  archiveInfo: {
    flex: 1,

    minWidth: 0,
  },

  /*
   * Filename
   */

  filenameRow: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: 9,
  },

  fileIcon: {
    width: 34,

    height: 34,

    borderRadius: 9,

    backgroundColor: COLORS.GREEN_BG,

    borderWidth: 1,

    borderColor: '#24634D',

    alignItems: 'center',

    justifyContent: 'center',

    flexShrink: 0,
  },

  fileIconText: {
    color: COLORS.GREEN,

    fontSize: 11,

    fontWeight: '900',
  },

  filenameContent: {
    flex: 1,

    minWidth: 0,
  },

  filename: {
    color: COLORS.TEXT,

    fontSize: 12,

    lineHeight: 18,

    fontWeight: '900',

    flexShrink: 1,
  },

  unavailableText: {
    color: COLORS.ERROR,

    fontSize: 9,

    fontWeight: '700',

    marginTop: 3,
  },

  /*
   * Metadata
   */

  metadataSection: {
    marginTop: 11,
  },

  metadataLabel: {
    color: '#8192AD',

    fontSize: 8,

    fontWeight: '900',

    letterSpacing: 0.7,

    marginBottom: 4,
  },

  periodText: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 16,
  },

  /*
   * Stats
   */

  statsRow: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 7,

    marginTop: 10,
  },

  statChip: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#0E2039',

    borderWidth: 1,

    borderColor: '#253F5F',

    borderRadius: 15,

    paddingHorizontal: 9,

    paddingVertical: 5,
  },

  statValue: {
    color: COLORS.TEXT,

    fontSize: 9,

    fontWeight: '900',
  },

  statLabel: {
    color: COLORS.MUTED,

    fontSize: 8,

    fontWeight: '600',

    marginLeft: 4,
  },

  /*
   * Actions
   */

  archiveActions: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

    flexShrink: 0,
  },

  archiveActionsMobile: {
    width: '100%',

    alignItems: 'stretch',
  },

  mobileActionButton: {
    flex: 1,
  },

  downloadButton: {
    minHeight: 42,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: '#10233D',

    borderWidth: 1,

    borderColor: COLORS.FIELD_BORDER,

    borderRadius: 10,

    paddingHorizontal: 14,
  },

  downloadIcon: {
    color: '#8FB8FF',

    fontSize: 16,

    fontWeight: '900',

    marginRight: 6,
  },

  downloadButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',
  },

  deleteButton: {
    minHeight: 42,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: COLORS.DELETE,

    borderWidth: 1,

    borderColor: COLORS.DELETE_BORDER,

    borderRadius: 10,

    paddingHorizontal: 14,
  },

  deleteButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',
  },

  /*
   * Empty State
   */

  emptyState: {
    minHeight: 160,

    marginTop: 12,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderStyle: 'dashed',

    borderColor: COLORS.BORDER,

    borderRadius: 14,

    padding: 20,

    alignItems: 'center',

    justifyContent: 'center',
  },

  emptyIcon: {
    width: 48,

    height: 48,

    borderRadius: 14,

    backgroundColor: COLORS.GREEN_BG,

    alignItems: 'center',

    justifyContent: 'center',
  },

  emptyIconText: {
    color: COLORS.GREEN,

    fontSize: 10,

    fontWeight: '900',
  },

  emptyTitle: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',

    marginTop: 10,
  },

  emptyDescription: {
    color: COLORS.MUTED,

    fontSize: 10,

    lineHeight: 16,

    textAlign: 'center',

    marginTop: 5,

    maxWidth: 360,
  },

  /*
   * Error
   */

  inlineError: {
    marginTop: 10,

    backgroundColor: '#351D28',

    borderWidth: 1,

    borderColor: '#69404A',

    borderRadius: 10,

    padding: 10,
  },

  inlineErrorText: {
    color: COLORS.ERROR,

    fontSize: 9,

    lineHeight: 15,
  },

  errorBox: {
    marginTop: 14,

    backgroundColor: COLORS.INNER,

    borderWidth: 1,

    borderColor: COLORS.BORDER,

    borderRadius: 12,

    padding: 14,

    alignItems: 'flex-start',
  },

  errorTitle: {
    color: COLORS.TEXT,

    fontSize: 12,

    fontWeight: '900',
  },

  errorDescription: {
    color: COLORS.ERROR,

    fontSize: 10,

    lineHeight: 16,

    marginTop: 5,

    marginBottom: 12,
  },

  /*
   * Generic
   */

  primaryButton: {
    minHeight: 42,

    backgroundColor: COLORS.BLUE,

    borderRadius: 10,

    paddingHorizontal: 15,

    alignItems: 'center',

    justifyContent: 'center',
  },

  primaryButtonText: {
    color: COLORS.TEXT,

    fontSize: 10,

    fontWeight: '900',
  },

  stateContainer: {
    minHeight: 150,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 16,
  },

  stateText: {
    color: COLORS.MUTED,

    fontSize: 10,

    marginTop: 8,

    textAlign: 'center',
  },

  buttonPressed: {
    opacity: 0.72,
  },

  buttonDisabled: {
    opacity: 0.4,
  },
});
