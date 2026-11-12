// src/screens/Admin/Attendance/AdminMarkAttendance.styles.js

import { StyleSheet } from 'react-native';

const BG = '#081524';
const CARD = '#102844';
const CARD_DARK = '#09192D';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';
const BORDER = '#3E79A8';
const PRIMARY = '#3B82F6';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  centeredScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG,
  },

  loadingText: {
    color: MUTED,
    fontSize: 13,
    marginTop: 10,
  },

  header: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,

    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  title: {
    color: TEXT,
    fontSize: 19,
    fontWeight: '900',
  },

  sessionMeta: {
    color: '#BFD1E6',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  tabs: {
    flexDirection: 'row',
    marginTop: 12,
  },

  tabButton: {
    minHeight: 44,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 10,

    backgroundColor: CARD,

    paddingHorizontal: 14,

    marginRight: 8,
  },

  tabButtonActive: {
    borderColor: '#67D1F0',
    backgroundColor: '#163A5E',
  },

  tabButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 6,
  },

  content: {
    padding: 12,
    paddingBottom: 28,
  },

  cameraCard: {
    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 15,

    backgroundColor: CARD,

    padding: 12,
  },

  cameraContainer: {
    height: 260,

    borderRadius: 13,
    overflow: 'hidden',

    backgroundColor: '#000000',
  },

  camera: {
    ...StyleSheet.absoluteFillObject,
  },

  scanFrame: {
    ...StyleSheet.absoluteFillObject,

    alignItems: 'center',
    justifyContent: 'center',
  },

  scanBox: {
    width: '72%',
    height: 150,

    borderWidth: 2,
    borderColor: '#67D1F0',

    borderRadius: 14,

    backgroundColor: 'transparent',
  },

  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(2,8,23,0.65)',
  },

  scanningText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
  },

  cameraPlaceholder: {
    minHeight: 210,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 13,

    backgroundColor: CARD_DARK,

    padding: 20,
  },

  cameraPlaceholderTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 10,
  },

  cameraPlaceholderText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 7,
  },

  startCameraButton: {
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#2563EB',

    borderWidth: 1,
    borderColor: '#60A5FA',

    borderRadius: 10,

    paddingHorizontal: 14,

    marginTop: 10,
  },

  stopCameraButton: {
    flex: 1,
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#B91C1C',

    borderWidth: 1,
    borderColor: '#EF4444',

    borderRadius: 10,

    paddingHorizontal: 10,

    marginRight: 8,
  },

  restartCameraButton: {
    flex: 1,
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#183A5C',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 10,

    paddingHorizontal: 10,
  },

  cameraActionButtonText: {
    color: '#FFFFFF',

    fontSize: 13,
    fontWeight: '900',

    marginLeft: 6,
  },

  startCameraButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  infoCard: {
    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 14,

    backgroundColor: CARD,

    padding: 13,

    marginTop: 12,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '900',
  },

  sectionValue: {
    color: '#BFDBFE',
    fontSize: 13,
    marginTop: 8,
  },

  emptyText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
  },

  recentScanCard: {
    minHeight: 62,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: '#315D86',

    borderRadius: 11,

    padding: 11,

    marginTop: 9,
  },

  recentScanName: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  recentScanMeta: {
    color: MUTED,
    fontSize: 11,
    marginTop: 4,
  },

  presentSection: {
    marginTop: 16,
  },

  searchInput: {
    minHeight: 50,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 11,

    backgroundColor: CARD,

    color: TEXT,

    fontSize: 13,

    paddingHorizontal: 13,

    marginTop: 10,
  },

  studentCard: {
    minHeight: 70,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 12,

    padding: 12,

    marginTop: 8,
  },

  emptyStudentCard: {
    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 12,

    padding: 16,

    marginTop: 8,
  },

  studentMain: {
    flex: 1,
    minWidth: 0,
  },

  studentName: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
  },

  studentClass: {
    color: MUTED,
    fontSize: 11,
    marginTop: 4,
  },

  rollSection: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },

  rollLabel: {
    color: MUTED,
    fontSize: 9,
  },

  rollValue: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },

  manualContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 4,
  },

  manualList: {
    paddingTop: 4,
    paddingBottom: 100,
  },

  manualStudentCard: {
    minHeight: 72,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: CARD_DARK,

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 12,

    paddingHorizontal: 12,
    paddingVertical: 10,

    marginTop: 8,
  },

  manualStudentInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },

  manualFooter: {
    position: 'absolute',

    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: BG,

    borderTopWidth: 1,
    borderTopColor: BORDER,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  presentCount: {
    color: MUTED,
    fontSize: 11,
    marginBottom: 8,
  },

  footerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  closeButton: {
    minHeight: 46,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: BORDER,

    borderRadius: 10,

    paddingHorizontal: 16,

    marginRight: 8,
  },

  closeButtonText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '900',
  },

  saveButton: {
    minHeight: 46,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 10,

    backgroundColor: PRIMARY,

    paddingHorizontal: 17,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.45,
  },
  cameraActionRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 10,
  },
});
