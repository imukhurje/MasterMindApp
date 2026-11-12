// src/screens/Admin/Billing/AdminBillingTemplates.styles.js

import { StyleSheet } from 'react-native';

const COLORS = {
  BG: '#081321',
  CARD: '#102742',
  CARD_DARK: '#0B1A2E',
  TEXT: '#F1F5F9',
  MUTED: '#A8B6C9',
  BORDER: '#376D99',
  PRIMARY: '#2563EB',
};

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  content: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 34,
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
    marginTop: 9,
  },

  docxCard: {
    backgroundColor: COLORS.CARD_DARK,

    borderWidth: 1,
    borderColor: COLORS.BORDER,

    borderRadius: 14,

    padding: 14,

    marginBottom: 16,
  },

  cardTitle: {
    color: COLORS.TEXT,

    fontSize: 15,
    fontWeight: '900',
  },

  cardDescription: {
    color: '#B8C5D8',

    fontSize: 11,
    lineHeight: 17,

    marginTop: 6,
    marginBottom: 12,
  },

  fieldLabel: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '700',

    marginBottom: 6,
    marginTop: 9,
  },

  filePickerButton: {
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 12,
  },

  filePickerText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '700',
  },

  docxStatusText: {
    color: COLORS.MUTED,

    fontSize: 10,
    lineHeight: 15,

    marginTop: 9,
  },

  placeholderHeading: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '800',

    marginTop: 13,
    marginBottom: 7,
  },

  placeholderWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 6,
  },

  placeholderChip: {
    backgroundColor: '#173B60',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 7,

    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  placeholderChipText: {
    color: '#BFDBFE',

    fontSize: 9,
  },

  templateActionsRow: {
    gap: 4,
  },

  nameField: {
    flex: 1,
  },

  tagField: {
    flex: 1,
  },

  input: {
    minHeight: 46,

    color: '#FFFFFF',

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 11,

    fontSize: 12,
  },

  dropdown: {
    minHeight: 46,

    backgroundColor: '#102844',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 11,
  },

  dropdownContainer: {
    backgroundColor: '#0B1C32',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  dropdownSelected: {
    color: '#FFFFFF',
    fontSize: 12,
  },

  dropdownItem: {
    color: '#FFFFFF',
    fontSize: 12,
  },

  dropdownPlaceholder: {
    color: '#94A3B8',
    fontSize: 12,
  },

  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 10,
  },

  defaultLabel: {
    color: '#DCE7F5',

    fontSize: 11,
    fontWeight: '700',
  },

  defaultButton: {
    minWidth: 72,
    minHeight: 40,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,
  },

  defaultButtonActive: {
    backgroundColor: '#173B60',
  },

  defaultButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '800',
  },

  htmlEditor: {
    minHeight: 220,

    color: '#E2E8F0',

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 10,

    padding: 11,

    fontSize: 11,
    lineHeight: 17,
  },

  editorActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    gap: 8,

    marginTop: 10,
  },

  previewButton: {
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 9,

    paddingHorizontal: 15,
  },

  previewButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  saveButton: {
    minHeight: 42,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    backgroundColor: COLORS.PRIMARY,

    borderRadius: 9,

    paddingHorizontal: 16,
  },

  saveButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',
  },

  previewTitle: {
    color: COLORS.TEXT,

    fontSize: 14,
    fontWeight: '900',

    marginTop: 18,
    marginBottom: 8,
  },

  previewCard: {
    height: 430,

    overflow: 'hidden',

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#376D99',

    borderRadius: 10,
  },

  webView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  controlPressed: {
    opacity: 0.72,
  },

  controlDisabled: {
    opacity: 0.45,
  },

  previewModalBackdrop: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.76)',

    paddingHorizontal: 8,
    paddingVertical: 24,
  },

  previewModal: {
    width: '100%',
    height: '92%',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 14,

    overflow: 'hidden',
  },

  previewModalHeader: {
    minHeight: 58,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 14,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  previewModalTitle: {
    color: '#FFFFFF',

    fontSize: 15,
    fontWeight: '900',
  },

  previewModalCloseButton: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  previewWebViewContainer: {
    flex: 1,

    backgroundColor: '#FFFFFF',
  },

  previewModalWebView: {
    flex: 1,

    backgroundColor: '#FFFFFF',
  },

  previewWebViewLoader: {
    position: 'absolute',

    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FFFFFF',
  },
});
