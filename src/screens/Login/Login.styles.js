// src/screens/Login.styles.js

import { StyleSheet } from 'react-native';

export const COLORS = {
  BG: '#0F172A',
  CARD: '#0B1220',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',
  BORDER: '#334155',
  INPUT_BORDER: '#3B82F6',
  ACTION: '#3B82F6',
  LINK: '#60A5FA',
  PLACEHOLDER: '#64748B',
  BUTTON_TEXT: '#FFFFFF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  orgHeader: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  logo: {
    width: 260,
    height: 130,
    marginBottom: 12,
    alignSelf: 'center',
  },

  orgName: {
    color: COLORS.TEXT,
    fontWeight: '800',
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
  },

  changeOrgButton: {
    marginTop: 10,
  },

  changeOrgText: {
    color: COLORS.LINK,
  },

  loginCard: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 16,
    padding: 16,
  },

  label: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    minHeight: 52,
    paddingHorizontal: 14,
    color: COLORS.TEXT,
    backgroundColor: COLORS.BG,
    marginBottom: 16,
    fontSize: 15,
  },

  loginMethodSection: {
    marginBottom: 16,
    zIndex: 100,
  },

  loginMethodDropdown: {
    position: 'relative',
    zIndex: 100,
  },

  loginMethodButton: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    backgroundColor: COLORS.BG,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  loginMethodButtonActive: {
    borderColor: COLORS.ACTION,
  },

  loginMethodButtonText: {
    flex: 1,
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '600',
  },

  loginMethodChevron: {
    color: COLORS.MUTED,
    fontSize: 16,
    marginLeft: 12,
  },

  loginMethodPopup: {
    position: 'absolute',

    // This is the key part.
    // The popup floats instead of taking layout space.
    top: 58,
    left: 0,
    right: 0,

    backgroundColor: '#111C30',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,

    overflow: 'hidden',

    zIndex: 999,

    // Android shadow
    elevation: 12,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.28,
    shadowRadius: 10,
  },

  loginMethodOption: {
    minHeight: 66,
    paddingHorizontal: 14,
    paddingVertical: 11,
    justifyContent: 'center',
  },

  loginMethodOptionSelected: {
    backgroundColor: '#172554',
  },

  loginMethodOptionPressed: {
    opacity: 0.8,
  },

  loginMethodOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  loginMethodOptionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  loginMethodOptionTitle: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '600',
  },

  loginMethodOptionDescription: {
    color: COLORS.MUTED,
    fontSize: 11,
    marginTop: 3,
    lineHeight: 15,
  },

  loginMethodDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: COLORS.MUTED,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioOuterSelected: {
    borderColor: COLORS.ACTION,
  },

  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.ACTION,
  },

  primaryButton: {
    minHeight: 48,
    backgroundColor: COLORS.ACTION,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: COLORS.BUTTON_TEXT,
    fontSize: 15,
    fontWeight: '700',
  },

  disabledButton: {
    opacity: 0.5,
  },

  helperText: {
    color: COLORS.MUTED,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
    textAlign: 'center',
  },

  codeSentText: {
    color: COLORS.MUTED,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },

  emailHighlight: {
    color: COLORS.TEXT,
    fontWeight: '600',
  },

  otpInput: {
    textAlign: 'center',
    letterSpacing: 6,
    fontSize: 18,
    fontWeight: '600',
  },

  otpActions: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  linkText: {
    color: COLORS.LINK,
    fontSize: 14,
  },

  registerButton: {
    marginTop: 18,
    paddingVertical: 7,
    alignItems: 'center',
  },

  registerText: {
    color: '#60A5FA',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.78,
  },
  passwordInputWrapper: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    backgroundColor: COLORS.BG,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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

  forgotPasswordButton: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#38BDF8',
    borderRadius: 10,
  },

  forgotPasswordText: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default styles;
