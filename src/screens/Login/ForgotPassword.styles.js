// src/screens/Login/ForgotPassword.styles.js

import { StyleSheet } from 'react-native';

export const COLORS = {
  BG: '#0F172A',
  CARD: '#132A4D',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',
  BORDER: '#3B82F6',
  ACTION: '#3B82F6',
  PLACEHOLDER: '#64748B',
  WHITE: '#FFFFFF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
    paddingHorizontal: 18,
    paddingTop: 24,
  },

  card: {
    width: '100%',
  },

  title: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 22,
  },

  label: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    backgroundColor: COLORS.BG,
    color: COLORS.TEXT,
    paddingHorizontal: 14,
    fontSize: 15,
  },

  continueButton: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.ACTION,
    borderRadius: 10,
    marginTop: 10,
    minHeight: 44,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '700',
  },

  backButton: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },

  backText: {
    color: '#60A5FA',
    fontSize: 14,
  },

  pressed: {
    opacity: 0.78,
  },

  sendCodeSection: {
    marginTop: 14,
  },

  optionSelector: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    backgroundColor: COLORS.BG,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionSelectorText: {
    flex: 1,
    color: COLORS.TEXT,
    fontSize: 15,
  },

  optionChevron: {
    color: COLORS.MUTED,
    fontSize: 16,
    marginLeft: 10,
  },

  sendCodeButton: {
    backgroundColor: COLORS.ACTION,
    borderRadius: 10,
    minHeight: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendCodeButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '700',
  },

  resetHelperText: {
    color: COLORS.MUTED,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.5,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  optionModal: {
    backgroundColor: '#111C30',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    overflow: 'hidden',
  },

  optionModalTitle: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },

  optionItem: {
    minHeight: 58,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  optionItemSelected: {
    backgroundColor: '#172554',
  },

  optionItemLabel: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '600',
  },

  optionItemDestination: {
    color: COLORS.MUTED,
    fontSize: 12,
    marginTop: 3,
  },

  verificationSection: {
    marginTop: 18,
  },

  verifyCodeButton: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.ACTION,
    borderRadius: 10,
    minHeight: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  verifyCodeButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '700',
  },

  resetCodeMessage: {
    color: COLORS.TEXT,
    fontSize: 14,
    marginTop: 12,
    lineHeight: 20,
  },

  newPasswordSection: {
    marginTop: 18,
  },

  passwordInputWrapper: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    backgroundColor: COLORS.BG,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  passwordInput: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: 14,
    paddingRight: 4,
    color: COLORS.TEXT,
    fontSize: 15,
  },

  eyeButton: {
    width: 48,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  setPasswordButton: {
    backgroundColor: COLORS.ACTION,
    borderRadius: 10,
    minHeight: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  setPasswordButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '700',
  },

  verifiedMessage: {
    color: COLORS.TEXT,
    fontSize: 14,
    marginTop: 12,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 16,
  },
  actionHelperText: {
    flex: 1,
    color: COLORS.MUTED,
    fontSize: 12,
    lineHeight: 18,
    marginRight: 12,
  },
});

export default styles;
