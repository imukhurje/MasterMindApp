import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { COLORS, styles } from './CreateCourseModal.styles';

const CURRENCY_OPTIONS = [
  {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
  },
  {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
  },
  {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
  },
];

function getInitialForm() {
  return {
    title: '',
    price: '0',
    currency: 'INR',
    description: '',
  };
}

export default function CreateCourseModal({ visible, onClose, onCreated }) {
  const { width } = useWindowDimensions();

  const isCompactScreen = width < 620;

  const [step, setStep] = useState('method');
  const [selectedMethod, setSelectedMethod] = useState('blank');

  const [form, setForm] = useState(getInitialForm);

  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    setStep('method');
    setSelectedMethod('blank');
    setForm(getInitialForm());
    setSaving(false);
    setErrorMessage('');
  }, [visible]);

  const createDisabled = useMemo(() => {
    return saving || !form.title.trim() || !form.price.trim() || !form.currency;
  }, [form.currency, form.price, form.title, saving]);

  function clearError() {
    if (errorMessage) {
      setErrorMessage('');
    }
  }

  function updateFormField(fieldName, value) {
    setForm(previousForm => ({
      ...previousForm,
      [fieldName]: value,
    }));

    clearError();
  }

  function handleClose() {
    if (saving) {
      return;
    }

    onClose?.();
  }

  function handleNext() {
    if (selectedMethod !== 'blank') {
      return;
    }

    setErrorMessage('');
    setStep('blank');
  }

  function handleBack() {
    if (saving) {
      return;
    }

    setErrorMessage('');
    setStep('method');
  }

  async function handleCreateCourse() {
    const cleanTitle = form.title.trim();
    const cleanDescription = form.description.trim();

    const numericPrice = Number(form.price);

    if (!cleanTitle) {
      setErrorMessage('Course title is required.');
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setErrorMessage('Please enter a valid course price.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');

      const payload = {
        title: cleanTitle,
        price: numericPrice,
        currency: form.currency,
        description: cleanDescription,
      };

      console.log('Create course payload:', payload);

      const response = await api('/api/ott/ottcourses', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response?.id) {
        throw new Error('The server did not return the created course.');
      }

      onCreated?.({
        ...response,
        images: [],
        chapters: [],
        categories: [],
        tags: [],
        class_groups: [],
      });
    } catch (error) {
      console.log('Course create API error:', error);

      setErrorMessage(error?.message || 'The course could not be created.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.modalTitle}>
                  {step === 'method' ? 'Create Course' : 'Create Blank Course'}
                </Text>

                <Text style={styles.modalSubtitle}>
                  {step === 'method'
                    ? 'Choose how you want to start this online course.'
                    : 'Enter the basic details for the new course.'}
                </Text>
              </View>

              <Pressable
                onPress={handleClose}
                disabled={saving}
                style={({ pressed }) => [
                  styles.closeButton,

                  pressed && !saving && styles.buttonPressed,

                  saving && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            {step === 'method' ? (
              <CourseMethodStep
                selectedMethod={selectedMethod}
                onSelectMethod={setSelectedMethod}
              />
            ) : (
              <BlankCourseStep
                form={form}
                saving={saving}
                isCompactScreen={isCompactScreen}
                onChangeField={updateFormField}
              />
            )}

            {errorMessage ? (
              <View style={styles.errorWrapper}>
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.footer}>
              <Pressable
                onPress={handleClose}
                disabled={saving}
                style={({ pressed }) => [
                  styles.cancelButton,

                  pressed && !saving && styles.buttonPressed,

                  saving && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              {step === 'blank' ? (
                <Pressable
                  onPress={handleBack}
                  disabled={saving}
                  style={({ pressed }) => [
                    styles.backButton,

                    pressed && !saving && styles.buttonPressed,

                    saving && styles.buttonDisabled,
                  ]}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </Pressable>
              ) : null}

              <Pressable
                onPress={step === 'method' ? handleNext : handleCreateCourse}
                disabled={
                  step === 'method'
                    ? selectedMethod !== 'blank'
                    : createDisabled
                }
                style={({ pressed }) => [
                  styles.primaryButton,

                  pressed && !saving && styles.buttonPressed,

                  ((step === 'method' && selectedMethod !== 'blank') ||
                    (step === 'blank' && createDisabled)) &&
                    styles.buttonDisabled,
                ]}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT} />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {step === 'method' ? 'Next' : 'Create'}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function CourseMethodStep({ selectedMethod, onSelectMethod }) {
  return (
    <View style={styles.methodContent}>
      <Pressable
        onPress={() => onSelectMethod('blank')}
        style={({ pressed }) => [
          styles.methodCard,

          selectedMethod === 'blank' && styles.methodCardSelected,

          pressed && styles.methodCardPressed,
        ]}
      >
        <View
          style={[
            styles.radioOuter,

            selectedMethod === 'blank' && styles.radioOuterSelected,
          ]}
        >
          {selectedMethod === 'blank' ? (
            <View style={styles.radioInner} />
          ) : null}
        </View>

        <View style={styles.methodTextContainer}>
          <Text style={styles.methodTitle}>Create a blank course</Text>

          <Text style={styles.methodDescription}>
            Start with the course details form and add chapters and materials
            yourself.
          </Text>
        </View>
      </Pressable>

      <View style={[styles.methodCard, styles.methodCardDisabled]}>
        <View style={styles.radioOuter} />

        <View style={styles.methodTextContainer}>
          <View style={styles.methodTitleRow}>
            <Text style={styles.methodTitle}>
              Create a course from an uploaded PowerPoint file
            </Text>

            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonBadgeText}>Coming soon</Text>
            </View>
          </View>

          <Text style={styles.methodDescription}>
            Import slides into HTML materials and extract embedded media into
            the current course structure.
          </Text>
        </View>
      </View>
    </View>
  );
}

function BlankCourseStep({ form, saving, isCompactScreen, onChangeField }) {
  return (
    <ScrollView
      style={styles.formScrollView}
      contentContainerStyle={styles.formContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.topFieldsRow,

          isCompactScreen && styles.topFieldsRowCompact,
        ]}
      >
        <View style={styles.titleFieldContainer}>
          <Text style={styles.fieldLabel}>Title</Text>

          <TextInput
            value={form.title}
            onChangeText={value => onChangeField('title', value)}
            editable={!saving}
            placeholder="e.g., Algebra Masterclass"
            placeholderTextColor={COLORS.PLACEHOLDER}
            returnKeyType="next"
            style={styles.input}
          />
        </View>

        <View
          style={[
            styles.priceFieldContainer,

            isCompactScreen && styles.priceFieldContainerCompact,
          ]}
        >
          <Text style={styles.fieldLabel}>Price</Text>

          <TextInput
            value={form.price}
            onChangeText={value =>
              onChangeField('price', value.replace(/[^0-9.]/g, ''))
            }
            editable={!saving}
            placeholder="0.00"
            placeholderTextColor={COLORS.PLACEHOLDER}
            keyboardType="decimal-pad"
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Currency</Text>

        <View style={styles.currencyGrid}>
          {CURRENCY_OPTIONS.map(option => {
            const selected = form.currency === option.code;

            return (
              <Pressable
                key={option.code}
                onPress={() => onChangeField('currency', option.code)}
                disabled={saving}
                style={({ pressed }) => [
                  styles.currencyButton,

                  selected && styles.currencyButtonSelected,

                  pressed && !saving && styles.buttonPressed,

                  saving && styles.buttonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.currencySymbol,

                    selected && styles.currencyTextSelected,
                  ]}
                >
                  {option.symbol}
                </Text>

                <View style={styles.currencyTextContainer}>
                  <Text
                    style={[
                      styles.currencyCode,

                      selected && styles.currencyTextSelected,
                    ]}
                  >
                    {option.code}
                  </Text>

                  <Text
                    style={[
                      styles.currencyName,

                      selected && styles.currencyNameSelected,
                    ]}
                  >
                    {option.name}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Description</Text>

        <TextInput
          value={form.description}
          onChangeText={value => onChangeField('description', value)}
          editable={!saving}
          placeholder="Optional description"
          placeholderTextColor={COLORS.PLACEHOLDER}
          multiline
          textAlignVertical="top"
          style={styles.descriptionInput}
        />
      </View>
    </ScrollView>
  );
}
