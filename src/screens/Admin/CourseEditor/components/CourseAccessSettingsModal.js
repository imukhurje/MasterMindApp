import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { COLORS, styles } from './CourseAccessSettingsModal.styles';

const AUDIENCE_BOTH = 'school_and_online_students';
const AUDIENCE_SCHOOL_ONLY = 'school_students_only';

const VISIBILITY_CURRENT_CLASS = 'current_class_group';
const VISIBILITY_ASSIGNED_ONLY = 'assigned_only';

function getErrorMessage(error, fallback) {
  return (
    error?.payload?.message ||
    error?.payload?.error ||
    error?.message ||
    fallback
  );
}

function RadioOption({ selected, title, description, onPress, disabled }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,

        selected && styles.optionCardSelected,

        pressed && !disabled && styles.optionCardPressed,

        disabled && styles.disabled,
      ]}
    >
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>

      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{title}</Text>

        <Text style={styles.optionDescription}>{description}</Text>
      </View>
    </Pressable>
  );
}

export default function CourseAccessSettingsModal({
  visible,
  onClose,
  onSaved,
}) {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [courseAudience, setCourseAudience] = useState(AUDIENCE_SCHOOL_ONLY);

  const [savedCourseAudience, setSavedCourseAudience] =
    useState(AUDIENCE_SCHOOL_ONLY);

  const [schoolVisibility, setSchoolVisibility] = useState(
    VISIBILITY_CURRENT_CLASS,
  );

  const [savedSchoolVisibility, setSavedSchoolVisibility] = useState(
    VISIBILITY_CURRENT_CLASS,
  );

  const [assignmentsEnabled, setAssignmentsEnabled] = useState(false);

  const changed = useMemo(() => {
    return (
      courseAudience !== savedCourseAudience ||
      schoolVisibility !== savedSchoolVisibility
    );
  }, [
    courseAudience,
    savedCourseAudience,
    schoolVisibility,
    savedSchoolVisibility,
  ]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    loadSettings();
  }, [visible]);

  async function loadSettings() {
    try {
      setLoading(true);
      setErrorMessage('');

      const response = await api('/api/online/settings/access', {
        method: 'GET',
      });

      const nextAudience =
        response?.course_audience === AUDIENCE_BOTH
          ? AUDIENCE_BOTH
          : AUDIENCE_SCHOOL_ONLY;

      const nextVisibility =
        response?.school_student_course_visibility === VISIBILITY_ASSIGNED_ONLY
          ? VISIBILITY_ASSIGNED_ONLY
          : VISIBILITY_CURRENT_CLASS;

      setCourseAudience(nextAudience);

      setSavedCourseAudience(nextAudience);

      setSchoolVisibility(nextVisibility);

      setSavedSchoolVisibility(nextVisibility);

      setAssignmentsEnabled(Boolean(response?.assignments_enabled));
    } catch (error) {
      console.log('Course access settings load error:', error);

      setErrorMessage(
        getErrorMessage(error, 'Could not load course access settings.'),
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (saving) {
      return;
    }

    onClose?.();
  }

  async function handleSave() {
    if (saving || loading || !changed) {
      return;
    }

    const payload = {
      course_audience: courseAudience,

      school_student_course_visibility: schoolVisibility,
    };

    try {
      setSaving(true);
      setErrorMessage('');

      console.log('Course access settings payload:', payload);

      const response = await api('/api/online/settings/access', {
        method: 'PUT',

        body: JSON.stringify(payload),
      });

      if (!response?.ok) {
        throw new Error('The server did not confirm the settings update.');
      }

      const finalAudience =
        response?.course_audience === AUDIENCE_BOTH
          ? AUDIENCE_BOTH
          : AUDIENCE_SCHOOL_ONLY;

      const finalVisibility =
        response?.school_student_course_visibility === VISIBILITY_ASSIGNED_ONLY
          ? VISIBILITY_ASSIGNED_ONLY
          : VISIBILITY_CURRENT_CLASS;

      setCourseAudience(finalAudience);

      setSavedCourseAudience(finalAudience);

      setSchoolVisibility(finalVisibility);

      setSavedSchoolVisibility(finalVisibility);

      setAssignmentsEnabled(Boolean(response?.assignments_enabled));

      onSaved?.(response);

      Alert.alert(
        'Settings Updated',
        'Online course access settings have been saved successfully.',
        [
          {
            text: 'OK',
            onPress: () => onClose?.(),
          },
        ],
      );
    } catch (error) {
      console.log('Course access settings save error:', error);

      Alert.alert(
        'Could not save settings',
        getErrorMessage(error, 'Course access settings could not be saved.'),
      );
    } finally {
      setSaving(false);
    }
  }

  function resetChanges() {
    if (saving) {
      return;
    }

    setCourseAudience(savedCourseAudience);

    setSchoolVisibility(savedSchoolVisibility);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.overlay}>
        <View style={[styles.modalCard, isMobile && styles.modalCardMobile]}>
          {/* Header */}

          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Online Course Settings</Text>

              <Text style={styles.subtitle}>
                Control who can discover and access published online courses.
              </Text>
            </View>

            <Pressable
              onPress={handleClose}
              disabled={saving}
              hitSlop={8}
              style={({ pressed }) => [
                styles.closeButton,

                pressed && !saving && styles.buttonPressed,

                saving && styles.disabled,
              ]}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.BLUE} />

              <Text style={styles.loadingText}>Loading course settings...</Text>
            </View>
          ) : errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Could not load settings</Text>

              <Text style={styles.errorText}>{errorMessage}</Text>

              <Pressable
                onPress={loadSettings}
                style={({ pressed }) => [
                  styles.retryButton,

                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* General Course Visibility */}

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    General Course Visibility
                  </Text>

                  <Text style={styles.sectionDescription}>
                    Choose who can discover and view published online courses.
                  </Text>

                  <View style={styles.optionsContainer}>
                    <RadioOption
                      selected={courseAudience === AUDIENCE_BOTH}
                      disabled={saving}
                      onPress={() => setCourseAudience(AUDIENCE_BOTH)}
                      title="Both School and Online Students can view courses"
                      description="Online students can view free courses immediately. Paid courses must be purchased first."
                    />

                    <RadioOption
                      selected={courseAudience === AUDIENCE_SCHOOL_ONLY}
                      disabled={saving}
                      onPress={() => setCourseAudience(AUDIENCE_SCHOOL_ONLY)}
                      title="Only School Students can view courses"
                      description="Online registration is disabled. School students see published courses tagged with their class."
                    />
                  </View>
                </View>

                {/* School Student Visibility */}

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    School Student Course Visibility
                  </Text>

                  <Text style={styles.sectionDescription}>
                    Choose how published courses are made available to school
                    students.
                  </Text>

                  <View style={styles.optionsContainer}>
                    <RadioOption
                      selected={schoolVisibility === VISIBILITY_CURRENT_CLASS}
                      disabled={saving}
                      onPress={() =>
                        setSchoolVisibility(VISIBILITY_CURRENT_CLASS)
                      }
                      title="Students can see all courses tagged with their own current Class-group"
                      description="This is the default. Course class tags automatically control student visibility."
                    />

                    <RadioOption
                      selected={schoolVisibility === VISIBILITY_ASSIGNED_ONLY}
                      disabled={saving}
                      onPress={() =>
                        setSchoolVisibility(VISIBILITY_ASSIGNED_ONLY)
                      }
                      title="Students can see only the courses assigned to them by Teachers or Admins"
                      description="Use the Assignments tab to select one student, a whole class-group, or any combination."
                    />
                  </View>

                  {schoolVisibility === VISIBILITY_ASSIGNED_ONLY ? (
                    <View style={styles.assignmentInfo}>
                      <View
                        style={[
                          styles.assignmentDot,

                          assignmentsEnabled && styles.assignmentDotEnabled,
                        ]}
                      />

                      <Text style={styles.assignmentInfoText}>
                        Course assignments will be enabled when this setting is
                        saved.
                      </Text>
                    </View>
                  ) : null}
                </View>
              </ScrollView>

              {/* Footer */}

              <View style={[styles.footer, isMobile && styles.footerMobile]}>
                {changed ? (
                  <Pressable
                    disabled={saving}
                    onPress={resetChanges}
                    style={({ pressed }) => [
                      styles.resetButton,

                      isMobile && styles.footerButtonMobile,

                      pressed && !saving && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.resetButtonText}>Reset Changes</Text>
                  </Pressable>
                ) : (
                  <View />
                )}

                <Pressable
                  onPress={handleSave}
                  disabled={saving || !changed}
                  style={({ pressed }) => [
                    styles.saveButton,

                    isMobile && styles.footerButtonMobile,

                    (saving || !changed) && styles.disabled,

                    pressed && !saving && changed && styles.buttonPressed,
                  ]}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={COLORS.TEXT} />
                  ) : (
                    <Text style={styles.saveButtonText}>Save settings</Text>
                  )}
                </Pressable>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
