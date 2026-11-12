// src/screens/auth/PasswordRegistration.styles.js

import { StyleSheet } from 'react-native';

export const COLORS = {
  BG: '#0F172A',
  CARD: '#0B1220',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',
  BORDER: '#334155',
  INPUT_BORDER: '#3B82F6',
  ACTION: '#3B82F6',
  ACTION_DARK: '#2563EB',
  LINK: '#60A5FA',
  PLACEHOLDER: '#64748B',
  WHITE: '#FFFFFF',
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },

  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },

  header: {
    marginBottom: 22,
  },

  title: {
    color: COLORS.TEXT,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },

  description: {
    color: COLORS.TEXT,
    fontSize: 14,
    lineHeight: 21,
  },

  card: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 16,
    backgroundColor: COLORS.CARD,
    padding: 16,
  },

  label: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
  },

  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.INPUT_BORDER,
    borderRadius: 10,
    backgroundColor: COLORS.BG,
    paddingHorizontal: 14,
    color: COLORS.TEXT,
    fontSize: 15,
    marginBottom: 8,
  },

  selectInput: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.INPUT_BORDER,
    borderRadius: 10,
    backgroundColor: COLORS.BG,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  selectText: {
    flex: 1,
    color: COLORS.TEXT,
    fontSize: 15,
    fontWeight: '500',
  },

  placeholderText: {
    color: COLORS.PLACEHOLDER,
  },

  chevron: {
    color: COLORS.MUTED,
    fontSize: 16,
    marginLeft: 10,
  },

  helperText: {
    color: COLORS.MUTED,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },

  submitButton: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: COLORS.ACTION,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  submitButtonText: {
    color: COLORS.WHITE,
    fontSize: 15,
    fontWeight: '700',
  },

  backButton: {
    minHeight: 44,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.INPUT_BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  backButtonText: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '600',
  },

  academicYearText: {
    color: COLORS.MUTED,
    fontSize: 12,
    marginTop: 20,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.MUTED,
    fontSize: 14,
    marginTop: 12,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  roleModal: {
    backgroundColor: '#111C30',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 14,
    paddingVertical: 8,
    overflow: 'hidden',
  },

  roleModalTitle: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },

  roleOption: {
    minHeight: 54,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },

  roleOptionSelected: {
    backgroundColor: '#172554',
  },

  roleOptionPressed: {
    opacity: 0.75,
  },

  roleOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  roleOptionText: {
    color: COLORS.TEXT,
    fontSize: 15,
    marginLeft: 12,
  },

  roleOptionTextSelected: {
    fontWeight: '600',
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

  disabledButton: {
    opacity: 0.5,
  },

  pressed: {
    opacity: 0.78,
  },

  classSectionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },

  classSectionField: {
    flex: 1,
  },

  classSectionSelect: {
    marginBottom: 8,
  },

  studentField: {
    flex: 1,
  },

  studentSelect: {
    marginBottom: 8,
  },

  studentInput: {
    marginBottom: 8,
  },

  disabledSelect: {
    opacity: 0.45,
  },
  passwordInputWrapper: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.INPUT_BORDER,
    borderRadius: 10,
    backgroundColor: COLORS.BG,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  usernameCheckingText: {
    color: COLORS.MUTED,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },

  usernameAvailableText: {
    color: '#22C55E',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },

  usernameUnavailableText: {
    color: '#EF4444',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },

  usernameCheckErrorText: {
    color: '#F59E0B',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  studentDetailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
});

export default styles;
