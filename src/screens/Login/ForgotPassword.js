// src/screens/Login/ForgotPassword.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles, { COLORS } from './ForgotPassword.styles';
import {
  getPasswordResetOptions,
  sendPasswordResetCode,
  verifyPasswordResetCode,
  completePasswordReset,
} from '../../api/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ForgotPassword() {
  const navigation = useNavigation();

  const [identifier, setIdentifier] = useState('');
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [resetOptions, setResetOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [optionDropdownOpen, setOptionDropdownOpen] = useState(false);

  const [sendingCode, setSendingCode] = useState(false);

  const [challengeId, setChallengeId] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [resetCodeMessage, setResetCodeMessage] = useState('');

  const [verifyingCode, setVerifyingCode] = useState(false);
  const [resetToken, setResetToken] = useState(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [settingPassword, setSettingPassword] = useState(false);

  async function onContinue() {
    const value = identifier.trim();

    if (!value) {
      Alert.alert('Required', 'Please enter your username or student email.');
      return;
    }

    try {
      setLoadingOptions(true);

      // Clear previous result before checking a new account.
      setResetOptions([]);
      setSelectedOption(null);
      setOptionDropdownOpen(false);

      const response = await getPasswordResetOptions(value);

      const options = Array.isArray(response?.options) ? response.options : [];

      if (options.length === 0) {
        Alert.alert(
          'Password reset',
          response?.message ||
            'No password-reset options were found for this account.',
        );
        return;
      }

      setResetOptions(options);

      // If only one option exists, select it automatically.
      if (options.length === 1) {
        setSelectedOption(options[0]);
      }
    } catch (error) {
      Alert.alert(
        'Password reset',
        error?.message ||
          'Unable to find password-reset options. Please try again.',
      );
    } finally {
      setLoadingOptions(false);
    }
  }

  async function onSendCode() {
    const value = identifier.trim();

    if (!selectedOption) {
      Alert.alert(
        'Required',
        'Please select where you want to receive the verification code.',
      );
      return;
    }

    try {
      setSendingCode(true);

      setChallengeId(null);
      setVerificationCode('');
      setResetCodeMessage('');

      const response = await sendPasswordResetCode(value, selectedOption.key);

      if (!response?.challenge_id) {
        throw new Error(
          response?.message || 'Unable to start password reset verification.',
        );
      }

      setChallengeId(response.challenge_id);

      setResetCodeMessage(response?.message || 'A reset code has been sent.');
    } catch (error) {
      Alert.alert(
        'Unable to send code',
        error?.message ||
          'The verification code could not be sent. Please try again.',
      );
    } finally {
      setSendingCode(false);
    }
  }

  async function onVerifyResetCode() {
    const code = verificationCode.trim();

    if (!code) {
      Alert.alert(
        'Verification code required',
        'Please enter the verification code.',
      );
      return;
    }

    try {
      setVerifyingCode(true);

      const response = await verifyPasswordResetCode(challengeId, code);

      if (!response?.reset_token) {
        throw new Error(
          'Verification succeeded but reset token was not returned.',
        );
      }

      setResetToken(response.reset_token);

      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      Alert.alert(
        'Verification failed',
        error?.message || 'The verification code is invalid or has expired.',
      );
    } finally {
      setVerifyingCode(false);
    }
  }

  async function onSetNewPassword() {
    if (!newPassword) {
      Alert.alert('Password required', 'Please enter your new password.');
      return;
    }

    if (newPassword.length < 10) {
      Alert.alert(
        'Invalid password',
        'Password must be at least 10 characters.',
      );
      return;
    }

    if (!confirmNewPassword) {
      Alert.alert('Confirm password', 'Please confirm your new password.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert(
        'Passwords do not match',
        'New password and confirm password must match.',
      );
      return;
    }

    if (!challengeId || !resetToken) {
      Alert.alert(
        'Password reset expired',
        'Password reset verification is missing. Please start again.',
      );
      return;
    }

    try {
      setSettingPassword(true);

      const response = await completePasswordReset({
        challengeId,
        resetToken,
        password: newPassword,
        passwordConfirmation: confirmNewPassword,
      });

      if (response?.ok === true) {
        Alert.alert(
          'Password reset successful',
          'Your password has been changed. You can now sign in with your new password.',
          [
            {
              text: 'Back to sign in',
              onPress: () => {
                navigation.goBack();
              },
            },
          ],
        );

        return;
      }

      throw new Error(response?.message || 'Unable to reset password.');
    } catch (error) {
      Alert.alert(
        'Password reset failed',
        error?.message || 'Unable to set your new password. Please try again.',
      );
    } finally {
      setSettingPassword(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset student password</Text>

        <Text style={styles.label}>Username or student email</Text>

        <TextInput
          value={identifier}
          onChangeText={value => {
            setIdentifier(value);
            setResetOptions([]);
            setSelectedOption(null);
            setOptionDropdownOpen(false);
          }}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Enter username or student email"
          placeholderTextColor={COLORS.PLACEHOLDER}
          style={styles.input}
          returnKeyType="next"
          onSubmitEditing={onContinue}
        />

        <Pressable
          onPress={onContinue}
          disabled={loadingOptions}
          style={({ pressed }) => [
            styles.continueButton,
            loadingOptions && styles.disabledButton,
            pressed && !loadingOptions && styles.pressed,
          ]}
        >
          {loadingOptions ? (
            <ActivityIndicator size="small" color={COLORS.WHITE} />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </Pressable>

        {resetOptions.length > 0 && (
          <View style={styles.sendCodeSection}>
            <Text style={styles.label}>Send code to</Text>

            <Pressable
              onPress={() => {
                if (resetOptions.length > 1) {
                  setOptionDropdownOpen(true);
                }
              }}
              style={({ pressed }) => [
                styles.optionSelector,
                pressed && resetOptions.length > 1 && styles.pressed,
              ]}
            >
              <Text style={styles.optionSelectorText}>
                {selectedOption?.label || 'Select an option'}
              </Text>

              {resetOptions.length > 1 ? (
                <Text style={styles.optionChevron}>▾</Text>
              ) : null}
            </Pressable>

            <View style={styles.actionRow}>
              <Text style={styles.actionHelperText}>
                Choose where to receive your verification code.
              </Text>

              <Pressable
                onPress={onSendCode}
                disabled={!selectedOption || sendingCode}
                style={({ pressed }) => [
                  styles.sendCodeButton,
                  (!selectedOption || sendingCode) && styles.disabledButton,
                  pressed && selectedOption && !sendingCode && styles.pressed,
                ]}
              >
                {sendingCode ? (
                  <ActivityIndicator size="small" color={COLORS.WHITE} />
                ) : (
                  <Text style={styles.sendCodeButtonText}>Send code</Text>
                )}
              </Pressable>
            </View>
          </View>
        )}

        {challengeId && !resetToken && (
          <View style={styles.verificationSection}>
            <Text style={styles.label}>Verification code</Text>

            <TextInput
              value={verificationCode}
              onChangeText={value =>
                setVerificationCode(value.replace(/[^0-9]/g, ''))
              }
              keyboardType="number-pad"
              placeholder="Enter verification code"
              placeholderTextColor={COLORS.PLACEHOLDER}
              style={styles.input}
            />

            <Pressable
              onPress={onVerifyResetCode}
              disabled={verifyingCode}
              style={({ pressed }) => [
                styles.verifyCodeButton,
                verifyingCode && styles.disabledButton,
                pressed && !verifyingCode && styles.pressed,
              ]}
            >
              {verifyingCode ? (
                <ActivityIndicator size="small" color={COLORS.WHITE} />
              ) : (
                <Text style={styles.verifyCodeButtonText}>Verify code</Text>
              )}
            </Pressable>

            {resetCodeMessage ? (
              <Text style={styles.resetCodeMessage}>{resetCodeMessage}</Text>
            ) : null}
          </View>
        )}

        {resetToken && (
          <View style={styles.newPasswordSection}>
            <Text style={styles.label}>New password</Text>

            <View style={styles.passwordInputWrapper}>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor={COLORS.PLACEHOLDER}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.passwordInput}
              />

              <Pressable
                onPress={() => setShowNewPassword(prev => !prev)}
                style={styles.eyeButton}
                hitSlop={10}
              >
                <Ionicons
                  name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={21}
                  color={COLORS.MUTED}
                />
              </Pressable>
            </View>

            <Text style={styles.label}>Confirm new password</Text>

            <View style={styles.passwordInputWrapper}>
              <TextInput
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                placeholder="Confirm new password"
                placeholderTextColor={COLORS.PLACEHOLDER}
                secureTextEntry={!showConfirmNewPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.passwordInput}
              />

              <Pressable
                onPress={() => setShowConfirmNewPassword(prev => !prev)}
                style={styles.eyeButton}
                hitSlop={10}
              >
                <Ionicons
                  name={
                    showConfirmNewPassword ? 'eye-off-outline' : 'eye-outline'
                  }
                  size={21}
                  color={COLORS.MUTED}
                />
              </Pressable>
            </View>

            <View style={styles.actionRow}>
              <Text style={styles.actionHelperText}>
                Code verified. Choose a new password.
              </Text>

              <Pressable
                onPress={onSetNewPassword}
                disabled={settingPassword}
                style={({ pressed }) => [
                  styles.setPasswordButton,
                  settingPassword && styles.disabledButton,
                  pressed && !settingPassword && styles.pressed,
                ]}
              >
                {settingPassword ? (
                  <ActivityIndicator size="small" color={COLORS.WHITE} />
                ) : (
                  <Text style={styles.setPasswordButtonText}>
                    Set new password
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
