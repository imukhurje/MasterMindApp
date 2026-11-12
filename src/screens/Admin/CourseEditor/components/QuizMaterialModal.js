import React, { useEffect, useMemo, useRef, useState } from 'react';

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

import QuizQuestionEditor from './QuizQuestionEditor';

import { styles, COLORS } from './QuizMaterialModal.styles';

let localIdCounter = 0;

function createLocalId(prefix) {
  localIdCounter += 1;

  return `${prefix}-${Date.now()}-${localIdCounter}`;
}

function createEmptyOption(isCorrect = false) {
  return {
    id: null,
    localId: createLocalId('option'),
    text: '',
    is_correct: isCorrect,
    position: 0,
  };
}

function createEmptyQuestion() {
  return {
    id: null,
    localId: createLocalId('question'),
    kind: 'single',
    body: '',
    position: 0,
    options: [createEmptyOption(true), createEmptyOption(false)],
  };
}

function createInitialForm() {
  return {
    title: '',
    duration: '10',
    questions: [],
  };
}

function getPosition(item) {
  const position = Number(item?.position);

  if (Number.isFinite(position)) {
    return position;
  }

  return Number.MAX_SAFE_INTEGER;
}

function sortByPosition(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return [...items].sort(
    (firstItem, secondItem) => getPosition(firstItem) - getPosition(secondItem),
  );
}

function mapOptionFromApi(option) {
  return {
    ...option,
    id: option?.id || null,
    localId: option?.id ? `option-${option.id}` : createLocalId('option'),
    text: String(option?.text || ''),
    is_correct: Boolean(option?.is_correct),
  };
}

function mapQuestionFromApi(question) {
  return {
    ...question,
    id: question?.id || null,
    localId: question?.id
      ? `question-${question.id}`
      : createLocalId('question'),
    kind: String(question?.kind || 'single'),
    body: String(question?.body || ''),
    options: sortByPosition(question?.options).map(mapOptionFromApi),
  };
}

function mapQuizResponseToForm(response) {
  return {
    title: String(response?.material?.title || ''),

    duration: String(response?.time_limit_minutes ?? 10),

    questions: sortByPosition(response?.questions).map(mapQuestionFromApi),
  };
}

function validateQuizForm(form) {
  const cleanTitle = String(form?.title || '').trim();

  const duration = Number(form?.duration);

  if (!cleanTitle) {
    return 'Quiz name is required.';
  }

  if (!Number.isInteger(duration) || duration <= 0) {
    return 'Duration must be a positive whole number.';
  }

  const questions = Array.isArray(form?.questions) ? form.questions : [];

  if (questions.length === 0) {
    return 'Add at least one question.';
  }

  for (
    let questionIndex = 0;
    questionIndex < questions.length;
    questionIndex += 1
  ) {
    const question = questions[questionIndex];

    const questionNumber = questionIndex + 1;

    if (!String(question?.body || '').trim()) {
      return `Question ${questionNumber} is required.`;
    }

    const options = Array.isArray(question?.options) ? question.options : [];

    if (options.length < 2) {
      return `Question ${questionNumber} must have at least two options.`;
    }

    const hasEmptyOption = options.some(
      option => !String(option?.text || '').trim(),
    );

    if (hasEmptyOption) {
      return `All options in question ${questionNumber} are required.`;
    }

    const correctOptions = options.filter(option =>
      Boolean(option?.is_correct),
    );

    if (correctOptions.length !== 1) {
      return `Question ${questionNumber} must have exactly one correct option.`;
    }
  }

  return '';
}

function createQuestionPayload(question) {
  return {
    kind: String(question?.kind || 'single'),

    body: String(question?.body || '').trim(),

    options: question.options.map(option => ({
      text: String(option?.text || '').trim(),

      is_correct: Boolean(option?.is_correct),
    })),
  };
}

function createQuizMaterial({
  existingMaterial,
  quizResponse,
  fallbackTitle,
  chapterId,
}) {
  const responseMaterial = quizResponse?.material || {};

  return {
    ...(existingMaterial || {}),
    ...responseMaterial,

    id:
      responseMaterial?.id || quizResponse?.material_id || existingMaterial?.id,

    chapter_id:
      responseMaterial?.chapter_id || quizResponse?.chapter_id || chapterId,

    title: responseMaterial?.title || fallbackTitle,

    type: 'quiz',

    position: existingMaterial?.position ?? responseMaterial?.position ?? 0,

    quiz: {
      id: quizResponse?.id,
      chapter_id: quizResponse?.chapter_id || chapterId,
      material_id: quizResponse?.material_id || responseMaterial?.id,
      time_limit_minutes: quizResponse?.time_limit_minutes,
      shuffle_questions: quizResponse?.shuffle_questions,
      shuffle_options: quizResponse?.shuffle_options,
      created_at: quizResponse?.created_at,
      updated_at: quizResponse?.updated_at,
      questions: Array.isArray(quizResponse?.questions)
        ? quizResponse.questions
        : [],
    },
  };
}

export default function QuizMaterialModal({
  visible,
  chapterId,
  material,
  onClose,
  onSaved,
}) {
  const { width } = useWindowDimensions();

  const isCompactScreen = width < 620;

  const originalQuizRef = useRef(null);

  const [form, setForm] = useState(createInitialForm);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const quizId = material?.quiz?.id;

  const isEditMode = Boolean(material?.id && quizId);

  useEffect(() => {
    let cancelled = false;

    if (!visible) {
      return undefined;
    }

    setSaving(false);
    setErrorMessage('');
    originalQuizRef.current = null;

    if (!isEditMode) {
      setLoading(false);
      setForm(createInitialForm());

      return undefined;
    }

    async function loadQuizDetails() {
      try {
        setLoading(true);

        const response = await api(`/api/ott/quizzes/${quizId}`, {
          method: 'GET',
        });

        if (cancelled) {
          return;
        }

        originalQuizRef.current = response;

        setForm(mapQuizResponseToForm(response));
      } catch (error) {
        console.log('Quiz details API error:', error);

        if (!cancelled) {
          setErrorMessage(error?.message || 'Could not load quiz details.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadQuizDetails();

    return () => {
      cancelled = true;
    };
  }, [visible, isEditMode, quizId]);

  const submitDisabled = useMemo(() => {
    return (
      loading ||
      saving ||
      !form.title.trim() ||
      !form.duration.trim() ||
      form.questions.length === 0
    );
  }, [form.duration, form.questions.length, form.title, loading, saving]);

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

  function addQuestion() {
    setForm(previousForm => ({
      ...previousForm,
      questions: [...previousForm.questions, createEmptyQuestion()],
    }));

    clearError();
  }

  function deleteQuestion(questionLocalId) {
    if (saving) {
      return;
    }

    setForm(previousForm => ({
      ...previousForm,

      questions: previousForm.questions.filter(
        question => question.localId !== questionLocalId,
      ),
    }));

    clearError();
  }

  function updateQuestionBody(questionLocalId, value) {
    setForm(previousForm => ({
      ...previousForm,

      questions: previousForm.questions.map(question => {
        if (question.localId !== questionLocalId) {
          return question;
        }

        return {
          ...question,
          body: value,
        };
      }),
    }));

    clearError();
  }

  function addOption(questionLocalId) {
    setForm(previousForm => ({
      ...previousForm,

      questions: previousForm.questions.map(question => {
        if (question.localId !== questionLocalId) {
          return question;
        }

        return {
          ...question,

          options: [...question.options, createEmptyOption(false)],
        };
      }),
    }));

    clearError();
  }

  function updateOptionText(questionLocalId, optionLocalId, value) {
    setForm(previousForm => ({
      ...previousForm,

      questions: previousForm.questions.map(question => {
        if (question.localId !== questionLocalId) {
          return question;
        }

        return {
          ...question,

          options: question.options.map(option => {
            if (option.localId !== optionLocalId) {
              return option;
            }

            return {
              ...option,
              text: value,
            };
          }),
        };
      }),
    }));

    clearError();
  }

  function selectCorrectOption(questionLocalId, optionLocalId) {
    setForm(previousForm => ({
      ...previousForm,

      questions: previousForm.questions.map(question => {
        if (question.localId !== questionLocalId) {
          return question;
        }

        return {
          ...question,

          options: question.options.map(option => ({
            ...option,

            is_correct: option.localId === optionLocalId,
          })),
        };
      }),
    }));

    clearError();
  }

  function removeOption(questionLocalId, optionLocalId) {
    setForm(previousForm => ({
      ...previousForm,

      questions: previousForm.questions.map(question => {
        if (question.localId !== questionLocalId) {
          return question;
        }

        if (question.options.length <= 2) {
          return question;
        }

        const updatedOptions = question.options.filter(
          option => option.localId !== optionLocalId,
        );

        const hasCorrectOption = updatedOptions.some(
          option => option.is_correct,
        );

        const normalizedOptions = hasCorrectOption
          ? updatedOptions
          : updatedOptions.map((option, optionIndex) => ({
              ...option,

              is_correct: optionIndex === 0,
            }));

        return {
          ...question,
          options: normalizedOptions,
        };
      }),
    }));

    clearError();
  }

  async function createQuiz() {
    const quizPayload = {
      title: form.title.trim(),

      time_limit_minutes: Number(form.duration),

      shuffle_questions: false,
      shuffle_options: false,
    };

    const quizCreateResponse = await api(
      `/api/ott/chapters/${chapterId}/quizzes`,
      {
        method: 'POST',

        body: JSON.stringify(quizPayload),
      },
    );

    const createdMaterialId = quizCreateResponse?.id;

    const createdQuizId = quizCreateResponse?.quiz?.id;

    if (!createdMaterialId || !createdQuizId) {
      throw new Error('The server did not return the created quiz IDs.');
    }

    for (const question of form.questions) {
      await api(`/api/ott/quizzes/${createdQuizId}/questions`, {
        method: 'POST',

        body: JSON.stringify(createQuestionPayload(question)),
      });
    }

    const finalQuizResponse = await api(`/api/ott/quizzes/${createdQuizId}`, {
      method: 'GET',
    });

    const createdMaterial = createQuizMaterial({
      existingMaterial: {
        id: createdMaterialId,
        position: 0,
      },

      quizResponse: finalQuizResponse,

      fallbackTitle: form.title.trim(),

      chapterId,
    });

    onSaved?.({
      mode: 'create',
      material: createdMaterial,
    });
  }

  async function updateExistingQuestion(question, originalQuiz) {
    await api(`/api/ott/questions/${question.id}`, {
      method: 'PUT',

      body: JSON.stringify({
        kind: String(question?.kind || 'single'),

        body: String(question?.body || '').trim(),
      }),
    });

    const originalQuestion = originalQuiz.questions.find(
      currentQuestion => String(currentQuestion?.id) === String(question.id),
    );

    const originalOptions = Array.isArray(originalQuestion?.options)
      ? originalQuestion.options
      : [];

    const currentExistingOptionIds = new Set(
      question.options
        .filter(option => option?.id)
        .map(option => String(option.id)),
    );

    const deletedOptions = originalOptions.filter(
      originalOption =>
        !currentExistingOptionIds.has(String(originalOption.id)),
    );

    for (const deletedOption of deletedOptions) {
      await api(`/api/ott/options/${deletedOption.id}`, {
        method: 'DELETE',
      });
    }

    const savedOptions = [];

    for (const option of question.options) {
      const optionPayload = {
        text: String(option?.text || '').trim(),

        is_correct: Boolean(option?.is_correct),
      };

      let savedOption;

      if (option?.id) {
        savedOption = await api(`/api/ott/options/${option.id}`, {
          method: 'PUT',

          body: JSON.stringify(optionPayload),
        });
      } else {
        savedOption = await api(`/api/ott/questions/${question.id}/options`, {
          method: 'POST',

          body: JSON.stringify(optionPayload),
        });
      }

      if (!savedOption?.id) {
        throw new Error(`An option in "${question.body}" could not be saved.`);
      }

      savedOptions.push(savedOption);
    }

    await api(`/api/ott/questions/${question.id}/options/reorder`, {
      method: 'POST',

      body: JSON.stringify({
        order: savedOptions.map(option => option.id),
      }),
    });
  }

  async function updateQuiz() {
    const originalQuiz = originalQuizRef.current;

    if (!originalQuiz?.id) {
      throw new Error('Original quiz data is unavailable.');
    }

    const quizPayload = {
      title: form.title.trim(),

      time_limit_minutes: Number(form.duration),

      shuffle_questions: false,
      shuffle_options: false,
    };

    await api(`/api/ott/quizzes/${quizId}`, {
      method: 'PUT',

      body: JSON.stringify(quizPayload),
    });

    const currentExistingQuestionIds = new Set(
      form.questions
        .filter(question => question?.id)
        .map(question => String(question.id)),
    );

    const originalQuestions = Array.isArray(originalQuiz?.questions)
      ? originalQuiz.questions
      : [];

    const deletedQuestions = originalQuestions.filter(
      originalQuestion =>
        !currentExistingQuestionIds.has(String(originalQuestion.id)),
    );

    for (const deletedQuestion of deletedQuestions) {
      await api(`/api/ott/questions/${deletedQuestion.id}`, {
        method: 'DELETE',
      });
    }

    for (const question of form.questions) {
      if (question?.id) {
        await updateExistingQuestion(question, originalQuiz);

        continue;
      }

      await api(`/api/ott/quizzes/${quizId}/questions`, {
        method: 'POST',

        body: JSON.stringify(createQuestionPayload(question)),
      });
    }

    const finalQuizResponse = await api(`/api/ott/quizzes/${quizId}`, {
      method: 'GET',
    });

    const updatedMaterial = createQuizMaterial({
      existingMaterial: material,
      quizResponse: finalQuizResponse,
      fallbackTitle: form.title.trim(),
      chapterId,
    });

    onSaved?.({
      mode: 'edit',
      material: updatedMaterial,
    });
  }

  async function handleSubmit() {
    const validationError = validateQuizForm(form);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (!chapterId) {
      setErrorMessage('Chapter ID was not provided.');
      return;
    }

    if (isEditMode && !quizId) {
      setErrorMessage('Quiz ID was not provided.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');

      if (isEditMode) {
        await updateQuiz();
      } else {
        await createQuiz();
      }
    } catch (error) {
      console.log('Quiz save API error:', error);

      setErrorMessage(
        error?.message ||
          (isEditMode
            ? 'The quiz could not be updated. Some changes may already have been saved.'
            : 'The quiz could not be created.'),
      );
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
              <Text style={styles.modalTitle}>
                {isEditMode ? 'Edit Quiz' : 'Add Quiz'}
              </Text>

              <Text style={styles.modalSubtitle}>
                {isEditMode
                  ? 'Update quiz details, questions and answers.'
                  : 'Create a quiz and add single-choice questions.'}
              </Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.BLUE} />

                <Text style={styles.loadingText}>Loading quiz details...</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.formScrollView}
                contentContainerStyle={styles.formContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View
                  style={[
                    styles.quizInfoRow,

                    isCompactScreen && styles.quizInfoRowCompact,
                  ]}
                >
                  <View style={styles.quizNameContainer}>
                    <Text style={styles.fieldLabel}>Quiz name</Text>

                    <TextInput
                      value={form.title}
                      onChangeText={value => updateFormField('title', value)}
                      editable={!saving}
                      placeholder="e.g., Chapter 1 Quiz"
                      placeholderTextColor={COLORS.PLACEHOLDER}
                      returnKeyType="next"
                      style={styles.input}
                    />
                  </View>

                  <View
                    style={[
                      styles.durationContainer,

                      isCompactScreen && styles.durationContainerCompact,
                    ]}
                  >
                    <Text style={styles.fieldLabel}>Duration (minutes)</Text>

                    <TextInput
                      value={form.duration}
                      onChangeText={value =>
                        updateFormField(
                          'duration',

                          value.replace(/[^0-9]/g, ''),
                        )
                      }
                      editable={!saving}
                      placeholder="10"
                      placeholderTextColor={COLORS.PLACEHOLDER}
                      keyboardType="number-pad"
                      style={styles.input}
                    />
                  </View>
                </View>

                <View style={styles.questionsHeader}>
                  <View style={styles.questionsHeaderText}>
                    <Text style={styles.questionsTitle}>Questions</Text>

                    <Text style={styles.questionsSubtitle}>
                      {form.questions.length}{' '}
                      {form.questions.length === 1 ? 'question' : 'questions'}
                    </Text>
                  </View>

                  <Pressable
                    onPress={addQuestion}
                    disabled={saving}
                    style={({ pressed }) => [
                      styles.addQuestionButton,

                      pressed && !saving && styles.buttonPressed,

                      saving && styles.buttonDisabled,
                    ]}
                  >
                    <Text style={styles.addQuestionButtonText}>
                      + Add Question
                    </Text>
                  </Pressable>
                </View>

                {form.questions.length === 0 ? (
                  <View style={styles.emptyQuestionsContainer}>
                    <Text style={styles.emptyQuestionsIcon}>🧩</Text>

                    <Text style={styles.emptyQuestionsTitle}>
                      No questions added
                    </Text>

                    <Text style={styles.emptyQuestionsDescription}>
                      Press Add Question to create the first quiz question.
                    </Text>
                  </View>
                ) : (
                  form.questions.map((question, questionIndex) => (
                    <QuizQuestionEditor
                      key={question.localId}
                      question={question}
                      questionNumber={questionIndex + 1}
                      disabled={saving}
                      onChangeBody={value =>
                        updateQuestionBody(question.localId, value)
                      }
                      onAddOption={() => addOption(question.localId)}
                      onChangeOptionText={(optionLocalId, value) =>
                        updateOptionText(question.localId, optionLocalId, value)
                      }
                      onSelectCorrectOption={optionLocalId =>
                        selectCorrectOption(question.localId, optionLocalId)
                      }
                      onRemoveOption={optionLocalId =>
                        removeOption(question.localId, optionLocalId)
                      }
                      onDeleteQuestion={() => deleteQuestion(question.localId)}
                    />
                  ))
                )}

                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}
              </ScrollView>
            )}

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

              <Pressable
                onPress={handleSubmit}
                disabled={submitDisabled}
                style={({ pressed }) => [
                  styles.submitButton,

                  pressed && !submitDisabled && styles.buttonPressed,

                  submitDisabled && styles.buttonDisabled,
                ]}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT} />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isEditMode ? 'Save Changes' : 'Create Quiz'}
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
