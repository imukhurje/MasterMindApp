// src/screens/Login.js

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
  BackHandler,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import ForceUpdateModal from '../../components/ForceUpdate/ForceUpdateModal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  requestOtp,
  verifyOtp,
  loginWithPassword,
  isEmail,
  extractToken,
} from '../../api/auth';
import {
  getToken,
  setToken,
  clearToken,
  api,
  getOrg,
  clearOrg,
} from '../../api/client';
import Config from 'react-native-config';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles, { COLORS } from './Login.styles';

const LOGIN_METHOD = {
  EMAIL_CODE: 'email_code',
  PASSWORD: 'password',
};

const ANDROID_UPDATE_URL = Config.ANDROID_UPDATE_URL;
const DEFAULT_APP_NAME = Config.APP_NAME;

function compareVersions(versionA, versionB) {
  const normalize = value =>
    String(value || '')
      .trim()
      .replace(/^v/i, '')
      .split('.')
      .map(part => {
        const parsed = parseInt(part, 10);

        return Number.isFinite(parsed) ? parsed : 0;
      });

  const a = normalize(versionA);
  const b = normalize(versionB);

  const length = Math.max(a.length, b.length);

  for (let index = 0; index < length; index += 1) {
    const aPart = a[index] || 0;
    const bPart = b[index] || 0;

    if (aPart > bPart) {
      return 1;
    }

    if (aPart < bPart) {
      return -1;
    }
  }

  return 0;
}

export default function Login() {
  const navigation = useNavigation();

  const [loginMethod, setLoginMethod] = useState(LOGIN_METHOD.EMAIL_CODE);
  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);

  // Email code login
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Username/password login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [busy, setBusy] = useState(false);
  const [org, setOrgState] = useState(null);

  const [forceUpdateVisible, setForceUpdateVisible] = useState(false);

  const [installedVersion, setInstalledVersion] = useState('');

  const [latestVersion, setLatestVersion] = useState('');

  const [openingUpdate, setOpeningUpdate] = useState(false);

  const timerRef = useRef(null);
  const authCheckStartedRef = useRef(false);

  async function checkAndroidVersion() {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const currentInstalledVersion = DeviceInfo.getVersion();

      setInstalledVersion(currentInstalledVersion);

      const response = await api('/api/android-version');

      const serverVersion = String(response?.android_current_ver || '').trim();
      // const serverVersion = '0.0.10';

      if (!serverVersion) {
        return true;
      }

      setLatestVersion(serverVersion);

      const needsUpdate =
        compareVersions(currentInstalledVersion, serverVersion) < 0;

      setForceUpdateVisible(needsUpdate);

      return !needsUpdate;
    } catch (error) {
      console.log('Android version check error:', error);

      /*
       * Do not block the whole app because of
       * a temporary version-check API failure.
       */
      return true;
    }
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const o = await getOrg();

      if (!cancelled) {
        setOrgState(o);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (authCheckStartedRef.current) {
      return undefined;
    }

    authCheckStartedRef.current = true;

    const checkExistingSession = async () => {
      try {
        /*
         * Always check the Android app version first.
         */
        const canContinue = await checkAndroidVersion();

        if (cancelled || !canContinue) {
          return;
        }

        /*
         * Then check whether a user is already logged in.
         */
        const token = await getToken();

        if (!token || cancelled) {
          /*
           * No stored login.
           * Stay on Login screen.
           */
          return;
        }

        /*
         * Validate the stored login.
         */
        await api('/api/me');

        if (cancelled) {
          return;
        }

        /*
         * Valid existing login.
         * Go directly to Dashboard.
         */
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      } catch (error) {
        console.log('Stored session is invalid:', error);

        /*
         * Invalid token.
         * Clear it and remain on Login.
         */
        await clearToken();
      }
    };

    checkExistingSession();

    return () => {
      cancelled = true;
    };
  }, [navigation]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  function startCooldown(seconds = 45) {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setCooldown(seconds);

    timerRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  }

  function changeLoginMethod(method) {
    setLoginMethod(method);
    setMethodDropdownOpen(false);

    // Reset OTP state when switching login methods.
    setOtp('');
    setOtpSent(false);
    setCooldown(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function saveLoginToken(res) {
    let token = extractToken(res);

    if (!token) {
      try {
        const minted = await api('/api/auth/mint-token', {
          method: 'POST',
          body: '{}',
        });

        token =
          extractToken(minted) || minted?.token || minted?.access_token || null;
      } catch (_) {}
    }

    if (!token) {
      throw new Error('Token missing in response');
    }

    await setToken(String(token));

    const canContinue = await checkAndroidVersion();

    if (!canContinue) {
      /*
       * Token stays stored.
       * After installing the update,
       * the user will already be logged in.
       */
      return;
    }

    navigation?.reset?.({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });
  }

  async function onSendOtp() {
    const value = email.trim().toLowerCase();

    if (!isEmail(value)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    try {
      setBusy(true);

      // Guest auto-login user
      const guestEmail = Config.GUEST_LOGIN_EMAIL;
      const guestOtp = Config.GUEST_LOGIN_PARENT_OTP;

      if (value === guestEmail) {
        const res = await verifyOtp(value, guestOtp);
        await saveLoginToken(res);
        return;
      }

      await requestOtp(value);

      setOtp('');
      setOtpSent(true);
      startCooldown(45);
    } catch (e) {
      Alert.alert('Error', e?.message || 'Failed to send the 6-digit code.');
    } finally {
      setBusy(false);
    }
  }

  async function onVerifyOtp() {
    const value = email.trim().toLowerCase();
    const code = otp.trim();

    if (!/^\d{6}$/.test(code)) {
      Alert.alert(
        'Invalid code',
        'Please enter the 6-digit code sent to your email.',
      );
      return;
    }

    try {
      setBusy(true);

      const res = await verifyOtp(value, code);

      await saveLoginToken(res);
    } catch (e) {
      Alert.alert('Error', e?.message || 'Code verification failed.');
    } finally {
      setBusy(false);
    }
  }

  async function onPasswordSignIn() {
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      Alert.alert('Username required', 'Please enter your username.');
      return;
    }

    if (!password) {
      Alert.alert('Password required', 'Please enter your password.');
      return;
    }

    try {
      setBusy(true);

      const res = await loginWithPassword(cleanUsername, password);

      await saveLoginToken(res);
    } catch (e) {
      Alert.alert(
        'Sign in failed',
        e?.message || 'Invalid username or password. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  function onRegisterPassword() {
    navigation.navigate('PasswordRegistration');
  }

  function onForgotPassword() {
    navigation.navigate('ForgotPassword');
  }

  async function onChangeOrg() {
    try {
      await setToken(null);
      await clearOrg();

      navigation?.reset?.({
        index: 0,
        routes: [{ name: 'OrgSelect' }],
      });
    } catch (e) {
      Alert.alert('Error', e?.message || 'Failed to change organization.');
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== 'android') {
        return undefined;
      }

      const handleBackPress = () => {
        /*
         * Force update modal must remain blocking.
         */
        if (forceUpdateVisible) {
          return true;
        }

        Alert.alert(
          'Exit App',
          'Are you sure you want to exit this app?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Exit',
              style: 'destructive',
              onPress: () => {
                BackHandler.exitApp();
              },
            },
          ],
          {
            cancelable: true,
          },
        );

        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );

      return () => {
        subscription.remove();
      };
    }, [forceUpdateVisible]),
  );

  async function handleForceUpdate() {
    if (openingUpdate) {
      return;
    }

    try {
      setOpeningUpdate(true);

      const supported = await Linking.canOpenURL(ANDROID_UPDATE_URL);

      if (!supported) {
        throw new Error(
          'Google Play Store link cannot be opened on this device.',
        );
      }

      await Linking.openURL(ANDROID_UPDATE_URL);
    } catch (error) {
      console.log('Open Play Store error:', error);

      Alert.alert(
        'Update App',
        error?.message || 'Could not open Google Play Store.',
      );
    } finally {
      setOpeningUpdate(false);
    }
  }

  const isEmailCodeMethod = loginMethod === LOGIN_METHOD.EMAIL_CODE;

  return (
    <View style={styles.container}>
      <ForceUpdateModal
        visible={forceUpdateVisible}
        installedVersion={installedVersion}
        latestVersion={latestVersion}
        updating={openingUpdate}
        onUpdatePress={handleForceUpdate}
      />
      {/* Organization header */}
      <View style={styles.orgHeader}>
        {org?.logo_url ? (
          <Image
            source={{ uri: org.logo_url }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        )}

        <Text style={styles.orgName}>{org?.name || DEFAULT_APP_NAME}</Text>
      </View>

      <View style={styles.loginCard}>
        {/* Login method */}
        <View style={styles.loginMethodSection}>
          <Text style={styles.label}>Login method</Text>

          <View style={styles.loginMethodDropdown}>
            <Pressable
              onPress={() => setMethodDropdownOpen(prev => !prev)}
              style={({ pressed }) => [
                styles.loginMethodButton,
                methodDropdownOpen && styles.loginMethodButtonActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.loginMethodButtonText}>
                {isEmailCodeMethod
                  ? '6-digit code to email'
                  : 'Username and password'}
              </Text>
              <Ionicons
                name={methodDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={19}
                color={COLORS.MUTED}
              />
            </Pressable>

            {methodDropdownOpen && (
              <View style={styles.loginMethodPopup}>
                <Pressable
                  onPress={() => changeLoginMethod(LOGIN_METHOD.EMAIL_CODE)}
                  style={({ pressed }) => [
                    styles.loginMethodOption,
                    isEmailCodeMethod && styles.loginMethodOptionSelected,
                    pressed && styles.loginMethodOptionPressed,
                  ]}
                >
                  <View style={styles.loginMethodOptionContent}>
                    <View
                      style={[
                        styles.radioOuter,
                        isEmailCodeMethod && styles.radioOuterSelected,
                      ]}
                    >
                      {isEmailCodeMethod && <View style={styles.radioInner} />}
                    </View>

                    <View style={styles.loginMethodOptionTextContainer}>
                      <Text style={styles.loginMethodOptionTitle}>
                        6-digit code to email
                      </Text>

                      <Text style={styles.loginMethodOptionDescription}>
                        Receive a temporary sign-in code by email
                      </Text>
                    </View>
                  </View>
                </Pressable>

                <View style={styles.loginMethodDivider} />

                <Pressable
                  onPress={() => changeLoginMethod(LOGIN_METHOD.PASSWORD)}
                  style={({ pressed }) => [
                    styles.loginMethodOption,
                    !isEmailCodeMethod && styles.loginMethodOptionSelected,
                    pressed && styles.loginMethodOptionPressed,
                  ]}
                >
                  <View style={styles.loginMethodOptionContent}>
                    <View
                      style={[
                        styles.radioOuter,
                        !isEmailCodeMethod && styles.radioOuterSelected,
                      ]}
                    >
                      {!isEmailCodeMethod && <View style={styles.radioInner} />}
                    </View>

                    <View style={styles.loginMethodOptionTextContainer}>
                      <Text style={styles.loginMethodOptionTitle}>
                        Username and password
                      </Text>

                      <Text style={styles.loginMethodOptionDescription}>
                        Sign in using your account credentials
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {isEmailCodeMethod ? (
          <>
            {!otpSent ? (
              <>
                <Text style={styles.label}>Email</Text>

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  placeholderTextColor={COLORS.PLACEHOLDER}
                  style={styles.input}
                  editable={!busy}
                  returnKeyType="send"
                  onSubmitEditing={onSendOtp}
                />

                <Pressable
                  onPress={onSendOtp}
                  disabled={busy}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    busy && styles.disabledButton,
                    pressed && !busy && styles.pressed,
                  ]}
                >
                  {busy ? (
                    <ActivityIndicator color={COLORS.BUTTON_TEXT} />
                  ) : (
                    <Text style={styles.primaryButtonText}>Send code</Text>
                  )}
                </Pressable>

                <Text style={styles.helperText}>
                  We’ll email a 6-digit code valid for 3 minutes.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.codeSentText}>
                  Enter the 6-digit code sent to{' '}
                  <Text style={styles.emailHighlight}>{email}</Text>
                </Text>

                <Text style={styles.label}>6-digit code</Text>

                <TextInput
                  value={otp}
                  onChangeText={value => setOtp(value.replace(/\D/g, ''))}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholder="000000"
                  placeholderTextColor={COLORS.PLACEHOLDER}
                  style={[styles.input, styles.otpInput]}
                  editable={!busy}
                />

                <Pressable
                  onPress={onVerifyOtp}
                  disabled={busy}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    busy && styles.disabledButton,
                    pressed && !busy && styles.pressed,
                  ]}
                >
                  {busy ? (
                    <ActivityIndicator color={COLORS.BUTTON_TEXT} />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      Verify & Continue
                    </Text>
                  )}
                </Pressable>

                <View style={styles.otpActions}>
                  <Pressable
                    disabled={cooldown > 0 || busy}
                    onPress={onSendOtp}
                    style={({ pressed }) => ({
                      opacity: cooldown > 0 || busy ? 0.45 : pressed ? 0.75 : 1,
                    })}
                  >
                    <Text style={styles.linkText}>
                      {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setOtp('');
                      setOtpSent(false);
                    }}
                    disabled={busy}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.75 : 1,
                    })}
                  >
                    <Text style={styles.linkText}>Change email</Text>
                  </Pressable>
                </View>

                <Text style={styles.helperText}>
                  The 6-digit code is valid for 3 minutes.
                </Text>
              </>
            )}
          </>
        ) : (
          <>
            <Text style={styles.label}>Username</Text>

            <TextInput
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Your username"
              placeholderTextColor={COLORS.PLACEHOLDER}
              style={styles.input}
              editable={!busy}
            />

            <Text style={styles.label}>Password</Text>

            <View style={styles.passwordInputWrapper}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showPassword}
                placeholder="Your password"
                placeholderTextColor={COLORS.PLACEHOLDER}
                style={styles.passwordInput}
                editable={!busy}
                returnKeyType="done"
                onSubmitEditing={onPasswordSignIn}
              />

              <Pressable
                onPress={() => setShowPassword(prev => !prev)}
                style={styles.eyeButton}
                hitSlop={10}
                disabled={busy}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={21}
                  color={COLORS.MUTED}
                />
              </Pressable>
            </View>

            <Pressable
              onPress={onPasswordSignIn}
              disabled={busy}
              style={({ pressed }) => [
                styles.primaryButton,
                busy && styles.disabledButton,
                pressed && !busy && styles.pressed,
              ]}
            >
              {busy ? (
                <ActivityIndicator color={COLORS.BUTTON_TEXT} />
              ) : (
                <Text style={styles.primaryButtonText}>Sign in</Text>
              )}
            </Pressable>
            <Pressable
              onPress={onForgotPassword}
              style={({ pressed }) => [
                styles.forgotPasswordButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </Pressable>
          </>
        )}

        {/* Common registration option for both login methods */}
        <Pressable
          onPress={onRegisterPassword}
          style={({ pressed }) => [
            styles.registerButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.registerText}>
            Register for password-based login
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
