// src/screens/Registration/PasswordRegistration.js

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import {
  getPasswordRegistrationMeta,
  checkUsernameAvailability,
  submitPasswordRegistration,
} from '../../api/passwordRegistration';

import styles, { COLORS } from './PasswordRegistration.styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function PasswordRegistration() {
  const navigation = useNavigation();

  const [loadingMeta, setLoadingMeta] = useState(true);

  const [roles, setRoles] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYear, setAcademicYear] = useState(null);

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);
  const [rollNumber, setRollNumber] = useState('');

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameCheckError, setUsernameCheckError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMeta();
  }, []);

  useEffect(() => {
    const cleanUsername = username.trim();

    setUsernameCheckError('');

    // Do not check usernames shorter than 5 characters.
    if (cleanUsername.length < 5) {
      setUsernameAvailable(null);
      setCheckingUsername(false);
      return;
    }

    // Clear previous result while user is typing.
    setUsernameAvailable(null);

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setCheckingUsername(true);

        const response = await checkUsernameAvailability(cleanUsername);

        if (cancelled) {
          return;
        }

        setUsernameAvailable(response?.available === true);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setUsernameAvailable(null);

        setUsernameCheckError(
          error?.message || 'Unable to check username availability.',
        );
      } finally {
        if (!cancelled) {
          setCheckingUsername(false);
        }
      }
    }, 2000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [username]);

  async function loadMeta() {
    try {
      setLoadingMeta(true);

      const response = await getPasswordRegistrationMeta();

      setRoles(Array.isArray(response?.roles) ? response.roles : []);

      setClasses(Array.isArray(response?.classes) ? response.classes : []);

      setAcademicYear(response?.academic_year || null);
    } catch (error) {
      Alert.alert(
        'Unable to load registration',
        error?.message ||
          'Registration information could not be loaded. Please try again.',
      );
    } finally {
      setLoadingMeta(false);
    }
  }

  const formattedRole = useMemo(() => {
    if (!role) {
      return 'Select role';
    }

    return role.charAt(0).toUpperCase() + role.slice(1);
  }, [role]);

  const classOptions = useMemo(() => {
    const names = classes.map(item => item?.name).filter(Boolean);

    return [...new Set(names)];
  }, [classes]);

  const sectionOptions = useMemo(() => {
    if (!selectedClass) {
      return [];
    }

    const sections = classes
      .filter(item => item?.name === selectedClass)
      .map(item => item?.section)
      .filter(Boolean);

    return [...new Set(sections)];
  }, [classes, selectedClass]);

  const selectedClassRecord = useMemo(() => {
    if (!selectedClass || !selectedSection) {
      return null;
    }

    return (
      classes.find(
        item =>
          item?.name === selectedClass && item?.section === selectedSection,
      ) || null
    );
  }, [classes, selectedClass, selectedSection]);

  function validateForm() {
    const cleanFullName = fullName.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    if (!role) {
      Alert.alert('Role required', 'Please select your role.');
      return false;
    }

    if (!cleanFullName) {
      Alert.alert('Full name required', 'Please enter your full name.');
      return false;
    }

    if (role === 'student') {
      if (!selectedClass) {
        Alert.alert('Class required', 'Please select your class.');
        return false;
      }

      if (!selectedSection) {
        Alert.alert('Section required', 'Please select your section.');
        return false;
      }

      if (!rollNumber.trim()) {
        Alert.alert('Roll number required', 'Please enter your roll number.');
        return false;
      }
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return false;
    }

    if (cleanUsername.length < 5) {
      Alert.alert(
        'Invalid username',
        'Username must contain at least 5 characters.',
      );
      return false;
    }

    if (checkingUsername) {
      Alert.alert(
        'Please wait',
        'Username availability is still being checked.',
      );
      return false;
    }

    if (usernameAvailable !== true) {
      Alert.alert(
        'Username unavailable',
        'Please choose an available username before submitting.',
      );
      return false;
    }

    if (password.length < 10) {
      Alert.alert(
        'Invalid password',
        'Password must contain at least 10 characters.',
      );
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      Alert.alert(
        'Invalid password',
        'Password must contain at least one uppercase letter.',
      );
      return false;
    }

    if (!/[a-z]/.test(password)) {
      Alert.alert(
        'Invalid password',
        'Password must contain at least one lowercase letter.',
      );
      return false;
    }

    if (!/[0-9]/.test(password)) {
      Alert.alert(
        'Invalid password',
        'Password must contain at least one number.',
      );
      return false;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      Alert.alert(
        'Invalid password',
        'Password must contain at least one symbol.',
      );
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Passwords do not match',
        'Password and confirm password must be the same.',
      );
      return false;
    }

    return true;
  }

  async function onSubmitRegistration() {
    if (!validateForm()) {
      return;
    }

    if (checkingUsername) {
      Alert.alert(
        'Please wait',
        'Username availability is still being checked.',
      );
      return;
    }

    if (usernameAvailable !== true) {
      Alert.alert(
        'Username unavailable',
        'Please choose an available username before submitting.',
      );
      return;
    }

    if (role === 'student' && !selectedClassRecord?.id) {
      Alert.alert('Class required', 'Please select a valid class and section.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        role,
        name: fullName.trim(),

        // API expects null if email is not supplied.
        email: email.trim() || null,

        ...(role === 'student'
          ? {
              class_group_id: String(selectedClassRecord.id),
              roll_no: rollNumber.trim(),
            }
          : {}),

        username: username.trim(),
        password,
        password_confirmation: confirmPassword,
      };

      console.log('Password registration payload =>', payload);

      const response = await submitPasswordRegistration(payload);

      console.log('Password registration response =>', response);

      Alert.alert(
        'Registration submitted',
        response?.message || 'Your registration request has been submitted.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Registration failed',
        error?.message || 'Unable to submit registration. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  function onBackToSignIn() {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Login');
  }

  function renderRoleItem({ item }) {
    const selected = role === item;

    const label = item.charAt(0).toUpperCase() + item.slice(1);

    return (
      <Pressable
        onPress={() => {
          setRole(item);
          setRoleDropdownOpen(false);

          if (item !== 'student') {
            setSelectedClass('');
            setSelectedSection('');
            setRollNumber('');
            setClassDropdownOpen(false);
            setSectionDropdownOpen(false);
          }
        }}
        style={({ pressed }) => [
          styles.roleOption,
          selected && styles.roleOptionSelected,
          pressed && styles.roleOptionPressed,
        ]}
      >
        <View style={styles.roleOptionLeft}>
          <View
            style={[styles.radioOuter, selected && styles.radioOuterSelected]}
          >
            {selected ? <View style={styles.radioInner} /> : null}
          </View>

          <Text
            style={[
              styles.roleOptionText,
              selected && styles.roleOptionTextSelected,
            ]}
          >
            {label}
          </Text>
        </View>
      </Pressable>
    );
  }

  if (loadingMeta) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.ACTION} />

        <Text style={styles.loadingText}>Loading registration...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Password Registration</Text>

          <Text style={styles.description}>
            Tell us which existing school record belongs to you. Requests that
            cannot be matched uniquely will be reviewed by an administrator.
          </Text>
        </View>

        <View style={styles.card}>
          {/* Role */}
          <Text style={styles.label}>Role</Text>

          <Pressable
            onPress={() => setRoleDropdownOpen(true)}
            style={({ pressed }) => [
              styles.selectInput,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.selectText, !role && styles.placeholderText]}>
              {formattedRole}
            </Text>

            <Text style={styles.chevron}>▾</Text>
          </Pressable>

          {/* Full name */}
          <Text style={styles.label}>Full name</Text>

          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            placeholderTextColor={COLORS.PLACEHOLDER}
            style={styles.input}
            autoCapitalize="words"
            editable={!submitting}
          />

          {role === 'student' && (
            <View style={styles.studentDetailsRow}>
              {/* Class */}
              <View style={styles.studentField}>
                <Text style={styles.label}>Class</Text>

                <Pressable
                  onPress={() => setClassDropdownOpen(true)}
                  style={({ pressed }) => [
                    styles.selectInput,
                    styles.studentSelect,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.selectText,
                      !selectedClass && styles.placeholderText,
                    ]}
                  >
                    {selectedClass || 'Select class'}
                  </Text>

                  <Text style={styles.chevron}>▾</Text>
                </Pressable>
              </View>

              {/* Section */}
              <View style={styles.studentField}>
                <Text style={styles.label}>Section</Text>

                <Pressable
                  disabled={!selectedClass}
                  onPress={() => {
                    if (selectedClass) {
                      setSectionDropdownOpen(true);
                    }
                  }}
                  style={({ pressed }) => [
                    styles.selectInput,
                    styles.studentSelect,
                    !selectedClass && styles.disabledSelect,
                    pressed && selectedClass && styles.pressed,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.selectText,
                      !selectedSection && styles.placeholderText,
                    ]}
                  >
                    {selectedSection || 'Select section'}
                  </Text>

                  <Text style={styles.chevron}>▾</Text>
                </Pressable>
              </View>

              {/* Roll number */}
              <View style={styles.studentField}>
                <Text style={styles.label}>Roll number</Text>

                <TextInput
                  value={rollNumber}
                  onChangeText={setRollNumber}
                  placeholder="Roll number"
                  placeholderTextColor={COLORS.PLACEHOLDER}
                  style={[styles.input, styles.studentInput]}
                  keyboardType="number-pad"
                  editable={!submitting}
                />
              </View>
            </View>
          )}

          {/* Email */}
          <Text style={styles.label}>
            {role === 'student'
              ? 'Student or registered parent email (optional)'
              : 'Email (optional)'}
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={COLORS.PLACEHOLDER}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!submitting}
          />

          <Text style={styles.helperText}>
            {role === 'student'
              ? 'You may enter your own email or the email of a registered parent linked to you. If your name, class, section, and roll number match, the OTP will be sent there.'
              : 'If your details match one record, we’ll send an OTP to this address.'}
          </Text>

          {/* Username */}
          <Text style={styles.label}>Username</Text>

          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
            placeholderTextColor={COLORS.PLACEHOLDER}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!submitting}
          />

          {username.trim().length < 5 ? (
            <Text style={styles.helperText}>Enter at least 5 characters.</Text>
          ) : checkingUsername ? (
            <Text style={styles.usernameCheckingText}>
              Checking username availability...
            </Text>
          ) : usernameAvailable === true ? (
            <Text style={styles.usernameAvailableText}>
              Username is available.
            </Text>
          ) : usernameAvailable === false ? (
            <Text style={styles.usernameUnavailableText}>
              Username is already taken. Please choose another one.
            </Text>
          ) : usernameCheckError ? (
            <Text style={styles.usernameCheckErrorText}>
              {usernameCheckError}
            </Text>
          ) : null}

          {/* Password */}
          <Text style={styles.label}>Password</Text>

          <View style={styles.passwordInputWrapper}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.PLACEHOLDER}
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!submitting}
            />

            <Pressable
              onPress={() => setShowPassword(prev => !prev)}
              style={styles.eyeButton}
              hitSlop={10}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={COLORS.MUTED}
              />
            </Pressable>
          </View>

          <Text style={styles.helperText}>
            At least 10 characters with uppercase, lowercase, number, and
            symbol.
          </Text>

          {/* Confirm password */}
          <Text style={styles.label}>Confirm password</Text>

          <View style={styles.passwordInputWrapper}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter your password"
              placeholderTextColor={COLORS.PLACEHOLDER}
              style={styles.passwordInput}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!submitting}
              returnKeyType="done"
              onSubmitEditing={onSubmitRegistration}
            />

            <Pressable
              onPress={() => setShowConfirmPassword(prev => !prev)}
              style={styles.eyeButton}
              hitSlop={10}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={COLORS.MUTED}
              />
            </Pressable>
          </View>

          {/* Submit */}
          <Pressable
            onPress={onSubmitRegistration}
            disabled={submitting}
            style={({ pressed }) => [
              styles.submitButton,
              submitting && styles.disabledButton,
              pressed && !submitting && styles.pressed,
            ]}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.WHITE} />
            ) : (
              <Text style={styles.submitButtonText}>Submit registration</Text>
            )}
          </Pressable>

          {/* Back */}
          <Pressable
            onPress={onBackToSignIn}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.backButtonText}>Back to sign in</Text>
          </Pressable>

          {academicYear?.name ? (
            <Text style={styles.academicYearText}>
              Academic year: {academicYear.name}
            </Text>
          ) : null}
        </View>
      </ScrollView>

      {/* Role selector */}
      <Modal
        visible={roleDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setRoleDropdownOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setRoleDropdownOpen(false)}
        >
          <Pressable style={styles.roleModal} onPress={() => {}}>
            <Text style={styles.roleModalTitle}>Select role</Text>

            <FlatList
              data={roles}
              keyExtractor={item => item}
              renderItem={renderRoleItem}
              bounces={false}
            />
          </Pressable>
        </Pressable>
      </Modal>
      {/* Class selector */}
      <Modal
        visible={classDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setClassDropdownOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setClassDropdownOpen(false)}
        >
          <Pressable style={styles.roleModal} onPress={() => {}}>
            <Text style={styles.roleModalTitle}>Select class</Text>

            <FlatList
              data={classOptions}
              keyExtractor={item => item}
              bounces={false}
              renderItem={({ item }) => {
                const selected = selectedClass === item;

                return (
                  <Pressable
                    onPress={() => {
                      setSelectedClass(item);

                      // Reset old section whenever class changes.
                      setSelectedSection('');

                      setClassDropdownOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.roleOption,
                      selected && styles.roleOptionSelected,
                      pressed && styles.roleOptionPressed,
                    ]}
                  >
                    <View style={styles.roleOptionLeft}>
                      <View
                        style={[
                          styles.radioOuter,
                          selected && styles.radioOuterSelected,
                        ]}
                      >
                        {selected ? <View style={styles.radioInner} /> : null}
                      </View>

                      <Text
                        style={[
                          styles.roleOptionText,
                          selected && styles.roleOptionTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
      {/* Section selector */}
      <Modal
        visible={sectionDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSectionDropdownOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSectionDropdownOpen(false)}
        >
          <Pressable style={styles.roleModal} onPress={() => {}}>
            <Text style={styles.roleModalTitle}>Select section</Text>

            <FlatList
              data={sectionOptions}
              keyExtractor={item => item}
              bounces={false}
              renderItem={({ item }) => {
                const selected = selectedSection === item;

                return (
                  <Pressable
                    onPress={() => {
                      setSelectedSection(item);
                      setSectionDropdownOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.roleOption,
                      selected && styles.roleOptionSelected,
                      pressed && styles.roleOptionPressed,
                    ]}
                  >
                    <View style={styles.roleOptionLeft}>
                      <View
                        style={[
                          styles.radioOuter,
                          selected && styles.radioOuterSelected,
                        ]}
                      >
                        {selected ? <View style={styles.radioInner} /> : null}
                      </View>

                      <Text
                        style={[
                          styles.roleOptionText,
                          selected && styles.roleOptionTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}
