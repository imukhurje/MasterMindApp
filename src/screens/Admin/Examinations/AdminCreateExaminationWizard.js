import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';
import styles from './AdminCreateExaminationWizard.styles';
import AdminManageExamPapers from './AdminManageExamPapers';
import AdminExaminationSchedule from './AdminExaminationSchedule';

const STEPS = [
  { id: 1, title: 'Details', subtitle: 'Examination details' },
  { id: 2, title: 'Exam Papers', subtitle: 'Exam Papers' },
  { id: 3, title: 'Scheduling', subtitle: 'Scheduling' },
  { id: 4, title: 'Finish', subtitle: 'Finish' },
];

export default function AdminCreateExaminationWizard({ navigation }) {
  const insets = useSafeAreaInsets();
  const submittingRef = useRef(false);

  const [step, setStep] = useState(1);
  const [examinationName, setExaminationName] = useState('');
  const [saving, setSaving] = useState(false);
  const [createdExaminationId, setCreatedExaminationId] = useState(null);
  const [scheduleSummary, setScheduleSummary] = useState({
    total: 0,
    scheduled: 0,
  });

  const [createdExaminationName, setCreatedExaminationName] = useState('');

  const [finishMode, setFinishMode] = useState('draft');

  const [finishLoading, setFinishLoading] = useState(false);

  const [finishData, setFinishData] = useState(null);

  const [finishError, setFinishError] = useState('');

  const currentStep = STEPS[step - 1];

  const closeWizard = () => {
    if (submittingRef.current) return;
    navigation.goBack();
  };

  const previousStep = () => {
    if (saving || step <= 1) return;
    setStep(current => current - 1);
  };

  const nextStep = async () => {
    if (submittingRef.current || saving || step >= 4) {
      return;
    }

    if (step === 1) {
      const name = examinationName.trim();

      if (!name) {
        Alert.alert(
          'Examination Name Required',
          'Please enter an examination name.',
        );
        return;
      }

      // Already created: never create a duplicate.
      if (createdExaminationId) {
        setStep(2);
        return;
      }

      try {
        submittingRef.current = true;
        setSaving(true);

        const response = await api('/api/examinations/v1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            status: 'draft',
          }),
        });

        const id = Number(response?.data?.id);

        if (response?.ok !== true || !Number.isInteger(id) || id <= 0) {
          throw new Error(
            'Examination creation was not confirmed. Check the examination list before retrying.',
          );
        }

        setCreatedExaminationId(id);
        setCreatedExaminationName(String(response.data.name || name));

        // API successful -> Step 2
        setStep(2);
      } catch (error) {
        console.log('[CREATE EXAMINATION ERROR]', {
          status: error?.status,
          message: error?.message,
        });

        Alert.alert(
          'Create Examination',
          error?.message || 'Could not create the examination.',
        );
      } finally {
        submittingRef.current = false;
        setSaving(false);
      }

      return;
    }

    setStep(current => Math.min(current + 1, 4));
  };

  const saveDraft = async () => {
    if (submittingRef.current || saving) return;

    const name = examinationName.trim();

    if (!name) {
      setStep(1);
      Alert.alert(
        'Examination Name Required',
        'Please enter an examination name.',
      );
      return;
    }

    try {
      submittingRef.current = true;
      setSaving(true);

      // Step 1 Next may have already created the examination.
      if (!createdExaminationId) {
        const response = await api('/api/examinations/v1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            status: 'draft',
          }),
        });

        const id = Number(response?.data?.id);

        if (response?.ok !== true || !Number.isInteger(id) || id <= 0) {
          throw new Error(
            'Draft creation was not confirmed. Check the Examinations list before retrying.',
          );
        }

        setCreatedExaminationId(id);
        setCreatedExaminationName(String(response.data.name || name));
      }

      Alert.alert('Draft Saved', 'Examination draft saved successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log('[SAVE EXAM DRAFT ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      Alert.alert(
        'Save Failed',
        error?.message || 'Could not save examination draft.',
      );
    } finally {
      submittingRef.current = false;
      setSaving(false);
    }
  };

  const handleScheduleChange = useCallback(summary => {
    setScheduleSummary({
      total: Number(summary?.total ?? 0),
      scheduled: Number(summary?.scheduled ?? 0),
    });
  }, []);

  const loadFinishExamination = useCallback(async () => {
    const id = Number(createdExaminationId);

    if (!Number.isInteger(id) || id <= 0) {
      setFinishError('Examination ID is missing.');
      return;
    }

    try {
      setFinishLoading(true);
      setFinishError('');

      const response = await api(`/api/examinations/v1/${id}`, {
        method: 'GET',
      });

      const examination = response?.data;

      if (!examination || Number(examination.id) !== id) {
        throw new Error('Could not verify examination details.');
      }

      setFinishData(examination);

      // Select current status when editing an existing draft.
      setFinishMode(examination.status === 'published' ? 'published' : 'draft');

      return examination;
    } catch (error) {
      console.log('[EXAM FINISH LOAD ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      setFinishData(null);
      setFinishError(error?.message || 'Could not load examination details.');

      return null;
    } finally {
      setFinishLoading(false);
    }
  }, [createdExaminationId]);

  useEffect(() => {
    if (step !== 4) return;

    loadFinishExamination();
  }, [step, loadFinishExamination]);

  const handleFinishSave = async (modeOverride = null) => {
    if (submittingRef.current || saving || finishLoading) {
      return;
    }

    const id = Number(createdExaminationId);

    if (!Number.isInteger(id) || id <= 0) {
      Alert.alert('Examination', 'Examination ID is missing.');
      return;
    }

    const targetStatus =
      modeOverride === 'draft' || modeOverride === 'published'
        ? modeOverride
        : finishMode;

    try {
      submittingRef.current = true;
      setSaving(true);

      // Verify current server state before final save.
      const detailResponse = await api(`/api/examinations/v1/${id}`, {
        method: 'GET',
      });

      const examination = detailResponse?.data;

      if (!examination || Number(examination.id) !== id) {
        throw new Error('Unable to verify the examination.');
      }

      const name = String(
        examination.name || createdExaminationName || '',
      ).trim();

      if (!name) {
        throw new Error('Examination name is missing.');
      }

      // Existing examination was created in Step 1.
      // Update it instead of sending another POST.
      const response = await api(`/api/examinations/v1/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          status: targetStatus,
        }),
      });

      if (
        response?.ok !== true ||
        Number(response?.data?.id) !== id ||
        response?.data?.status !== targetStatus
      ) {
        throw new Error('The examination status update was not confirmed.');
      }

      Alert.alert(
        'Examination Saved',
        targetStatus === 'published'
          ? 'Examination published successfully.'
          : 'Examination saved as draft successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );
    } catch (error) {
      console.log('[EXAM FINAL SAVE ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      Alert.alert(
        'Save Failed',
        error?.message ||
          'Could not save examination. Please check its status before retrying.',
      );
    } finally {
      submittingRef.current = false;
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.formCard}>
            <Text style={styles.fieldLabel}>Examination name *</Text>

            <TextInput
              value={examinationName}
              onChangeText={setExaminationName}
              placeholder="e.g., 2nd Term, 2026"
              placeholderTextColor="#8091AA"
              maxLength={150}
              autoCapitalize="words"
              editable={!saving && !createdExaminationId}
              style={styles.textInput}
            />
          </View>
        );

      case 2:
        return null;

      case 3:
        return null;

      case 4:
        return (
          <View style={styles.finishContainer}>
            {finishLoading ? (
              <View style={styles.finishLoadingBox}>
                <ActivityIndicator size="small" color="#7DD3FC" />

                <Text style={styles.finishLoadingText}>
                  Loading examination details...
                </Text>
              </View>
            ) : finishError || !finishData ? (
              <View style={styles.finishErrorCard}>
                <Text style={styles.finishErrorText}>
                  {finishError || 'Examination details are unavailable.'}
                </Text>

                <Pressable
                  onPress={loadFinishExamination}
                  style={styles.finishRetryButton}
                >
                  <Text style={styles.finishRetryText}>Retry</Text>
                </Pressable>
              </View>
            ) : (
              <>
                {/* Save as Draft */}
                <Pressable
                  onPress={() => setFinishMode('draft')}
                  disabled={saving}
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked: finishMode === 'draft',
                  }}
                  style={[
                    styles.finishOptionCard,
                    finishMode === 'draft' && styles.finishOptionSelected,
                  ]}
                >
                  <View style={styles.finishOptionRow}>
                    <MaterialCommunityIcons
                      name={
                        finishMode === 'draft'
                          ? 'radiobox-marked'
                          : 'radiobox-blank'
                      }
                      size={21}
                      color={finishMode === 'draft' ? '#7DD3FC' : '#94A3B8'}
                    />

                    <View style={styles.finishOptionContent}>
                      <Text style={styles.finishOptionTitle}>
                        Save as Draft
                      </Text>

                      <Text style={styles.finishOptionDescription}>
                        Keep the examination hidden from students and parents.
                      </Text>
                    </View>
                  </View>
                </Pressable>

                {/* Publish Examination */}
                <Pressable
                  onPress={() => setFinishMode('published')}
                  disabled={saving}
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked: finishMode === 'published',
                  }}
                  style={[
                    styles.finishOptionCard,
                    finishMode === 'published' && styles.finishOptionSelected,
                  ]}
                >
                  <View style={styles.finishOptionRow}>
                    <MaterialCommunityIcons
                      name={
                        finishMode === 'published'
                          ? 'radiobox-marked'
                          : 'radiobox-blank'
                      }
                      size={21}
                      color={finishMode === 'published' ? '#7DD3FC' : '#94A3B8'}
                    />

                    <View style={styles.finishOptionContent}>
                      <Text style={styles.finishOptionTitle}>
                        Publish the examination
                      </Text>

                      <Text style={styles.finishOptionDescription}>
                        Make scheduled exam papers available at their assigned
                        times.
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: 12 }]}>
        <View style={styles.headerTextArea}>
          <Text style={styles.headerTitle}>Create Examination</Text>

          <Text style={styles.headerSubtitle}>
            Step {step} of 4 · {currentStep.subtitle}
          </Text>
        </View>

        <Pressable
          onPress={closeWizard}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel="Close create examination"
          style={styles.closeButton}
        >
          <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Step Navigation */}
      <View style={styles.stepsContainer}>
        {STEPS.map(item => {
          const active = step === item.id;
          const completed = step > item.id;

          return (
            <Pressable
              key={item.id}
              onPress={() => {
                if (!saving && item.id < step) {
                  setStep(item.id);
                }
              }}
              disabled={saving || item.id >= step}
              style={[
                styles.stepButton,
                active && styles.stepButtonActive,
                completed && styles.stepButtonCompleted,
              ]}
            >
              <Text
                numberOfLines={2}
                style={[
                  styles.stepButtonText,
                  active && styles.stepButtonTextActive,
                ]}
              >
                {item.id}. {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Wizard Content */}

      {step === 2 ? (
        <View style={styles.embeddedStepContent}>
          {createdExaminationId ? (
            <AdminManageExamPapers
              embedded
              examinationId={createdExaminationId}
              examinationName={createdExaminationName}
              navigation={navigation}
            />
          ) : (
            <Text style={styles.stepCardDescription}>
              Please create the examination first.
            </Text>
          )}
        </View>
      ) : step === 3 ? (
        <View style={styles.embeddedStepContent}>
          {/* Scheduling Summary */}
          <View style={styles.scheduleSummaryRow}>
            <View style={styles.scheduleSummaryBadge}>
              <Text style={styles.scheduleSummaryText}>
                {scheduleSummary.scheduled} of {scheduleSummary.total} Exam
                Papers scheduled
              </Text>
            </View>
          </View>

          {/* Reuse existing scheduling component */}
          {createdExaminationId ? (
            <View style={styles.scheduleComponent}>
              <AdminExaminationSchedule
                embedded
                examinationId={createdExaminationId}
                examinationName={createdExaminationName}
                navigation={navigation}
                onScheduleChange={handleScheduleChange}
              />
            </View>
          ) : (
            <Text style={styles.stepCardDescription}>
              Please create the examination first.
            </Text>
          )}
        </View>
      ) : (
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderStepContent()}
        </ScrollView>
      )}

      {/* Fixed Footer */}
      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}
      >
        <Pressable
          onPress={previousStep}
          disabled={saving || step === 1}
          style={[
            styles.previousButton,
            (saving || step === 1) && styles.disabledButton,
          ]}
        >
          <Text style={styles.previousButtonText}>Previous</Text>
        </Pressable>

        <View style={styles.footerRight}>
          <Pressable
            onPress={step === 4 ? () => handleFinishSave('draft') : saveDraft}
            disabled={
              saving ||
              (step === 4
                ? finishLoading || !finishData || !!finishError
                : !examinationName.trim())
            }
            style={[
              styles.draftButton,
              (saving || !examinationName.trim()) && styles.disabledButton,
            ]}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.draftButtonText}>Save as Draft</Text>
            )}
          </Pressable>

          <Pressable
            onPress={step === 4 ? () => handleFinishSave() : nextStep}
            disabled={
              saving ||
              (step === 4 && (finishLoading || !finishData || !!finishError))
            }
            style={[
              styles.nextButton,
              (saving ||
                (step === 4 &&
                  (finishLoading || !finishData || !!finishError))) &&
                styles.disabledButton,
            ]}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.nextButtonText}>
                {step === 4 ? 'Save' : 'Next'}
              </Text>
            )}

            {step < 4 && !saving && (
              <MaterialCommunityIcons
                name="chevron-right"
                size={16}
                color="#FFFFFF"
              />
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
