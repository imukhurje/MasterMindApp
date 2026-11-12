import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { api } from '../../../api/client';
import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';

const BG = '#0F172A';
const CARD = '#0B1220';
const CARD_DARK = '#111827';
const TEXT = '#FFFFFF';
const MUTED = '#94A3B8';
const BORDER = '#334155';
const BORDER_SOFT = '#1F2937';
const GREEN = '#22C55E';

export default function AINewPrompt() {
  const navigation = useNavigation();
  const route = useRoute();

  const [loading, setLoading] = useState(true);
  const [estimatingCost, setEstimatingCost] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [estimate, setEstimate] = useState(null);

  const [prompt, setPrompt] = useState('');

  const [improvingPrompt, setImprovingPrompt] = useState(false);
  const [notice, setNotice] = useState(null);
  const [submitNotice, setSubmitNotice] = useState(null);
  const [submitCompleted, setSubmitCompleted] = useState(false);
  const [model, setModel] = useState('');
  const [sourceType, setSourceType] = useState('raw_files');

  const [classIds, setClassIds] = useState([]);
  const [courseIds, setCourseIds] = useState([]);

  const [onlineCourseId, setOnlineCourseId] = useState('');
  const [chapterId, setChapterId] = useState('');

  const [onlineCourseOptions, setOnlineCourseOptions] = useState([]);
  const [chapterOptions, setChapterOptions] = useState([
    { label: 'Select chapter', value: '' },
  ]);

  const [modelOptions, setModelOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const suggestedPrompt = route?.params?.suggestedPrompt;

    if (typeof suggestedPrompt === 'string' && suggestedPrompt.trim()) {
      setPrompt(suggestedPrompt);

      navigation.setParams({
        suggestedPrompt: undefined,
      });
    }
  }, [route?.params?.suggestedPrompt]);

  useEffect(() => {
    if (!notice) return;

    // Submit success message screen e thakbe, auto-hide hobe na
    if (submitCompleted && notice.type === 'success') {
      return;
    }

    const timer = setTimeout(() => {
      setNotice(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notice, submitCompleted]);

  async function loadInitialData() {
    try {
      setLoading(true);

      const [metaRes] = await Promise.all([
        api('/api/question-bank-ai/meta'),
        loadClassGroups(''),
        loadCourses(''),
      ]);

      const models = Array.isArray(metaRes?.models) ? metaRes.models : [];

      const options = models.map(item => ({
        label: item.label,
        value: item.id,
      }));

      setModelOptions(options);

      if (options.length > 0) {
        setModel(options[0].value);
      }
    } catch (e) {
      console.log('New Prompt init error', e);
      Alert.alert('New Prompt', e?.message || 'Failed to load page data.');
    } finally {
      setLoading(false);
    }
  }

  async function loadClassGroups(q = '') {
    try {
      const res = await api(
        `/api/questions/class-groups?q=${encodeURIComponent(q)}`,
      );

      const classes = Array.isArray(res?.classes) ? res.classes : [];

      setClassOptions(
        classes.map(item => ({
          label: item.label,
          value: String(item.id),
        })),
      );
    } catch (e) {
      console.log('Class groups load error', e);
      setClassOptions([]);
    }
  }

  async function loadCourses(q = '') {
    try {
      const res = await api(
        `/api/questions/courses?q=${encodeURIComponent(q)}`,
      );

      const courses = Array.isArray(res?.courses) ? res.courses : [];

      setCourseOptions(
        courses.map(item => ({
          label: item.label,
          value: String(item.id),
        })),
      );
    } catch (e) {
      console.log('Courses load error', e);
      setCourseOptions([]);
    }
  }

  async function loadOttCoursesByCourse(courseId) {
    try {
      if (!courseId) {
        setOnlineCourseOptions([]);
        return;
      }

      const res = await api(`/api/courses/${courseId}/ottcourses`);

      const ottcourses = Array.isArray(res?.ottcourses)
        ? res.ottcourses
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];

      setOnlineCourseOptions(
        ottcourses.map(item => ({
          label: item.title || item.label || item.name || 'Untitled',
          value: String(item.id),
        })),
      );
    } catch (e) {
      console.log('Online courses load error', e);
      setOnlineCourseOptions([]);
    }
  }

  async function loadChapters(ottcourseId = '') {
    try {
      if (!ottcourseId) {
        setChapterOptions([{ label: 'Select chapter', value: '' }]);
        return;
      }

      const res = await api(`/api/courses/ottcourses/${ottcourseId}/chapters`);

      const chapters = Array.isArray(res) ? res : [];

      setChapterOptions([
        { label: 'Select chapter', value: '' },
        ...chapters.map(item => ({
          label: item.title,
          value: String(item.id),
        })),
      ]);
    } catch (e) {
      console.log('Chapters load error', e);
      setChapterOptions([{ label: 'Select chapter', value: '' }]);
    }
  }

  function onChangeOnlineCourse(item) {
    setOnlineCourseId(item.value);
    setChapterId('');
    loadChapters(item.value);
  }

  function onChangeSubjects(selectedCourseIds) {
    const previousIds = courseIds || [];
    const nextIds = Array.isArray(selectedCourseIds) ? selectedCourseIds : [];

    setCourseIds(nextIds);
    setOnlineCourseId('');
    setChapterId('');
    setOnlineCourseOptions([]);
    setChapterOptions([{ label: 'Select chapter', value: '' }]);

    if (nextIds.length === 0) return;

    const newlySelectedId =
      nextIds.find(id => !previousIds.includes(id)) ||
      nextIds[nextIds.length - 1];

    loadOttCoursesByCourse(newlySelectedId);
  }

  async function onChooseFiles() {
    try {
      const pickedFiles = await pick({
        allowMultiSelection: true,
        type: [types.pdf, types.plainText],
        mode: 'import',
      });

      const formattedFiles = pickedFiles.map(file => ({
        uri: file.uri,
        name: file.name || 'unknown-file',
        type: file.type || 'application/octet-stream',
        size: file.size || 0,
      }));

      setSelectedFiles(formattedFiles);
    } catch (e) {
      if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED) {
        return;
      }

      console.log('File picker error', e);
      Alert.alert('Files', e?.message || 'Could not select files.');
    }
  }

  function getSourceMode() {
    if (sourceType === 'raw_files') {
      return 'upload';
    }

    return 'online_course_chapter';
  }

  function formatMoney(value) {
    if (value === null || value === undefined) return '-';

    const amount = Number(value);

    if (Number.isNaN(amount)) return '-';
    if (amount >= 0.1) return `$${amount.toFixed(2)}`;
    if (amount >= 0.01) return `$${amount.toFixed(3)}`;
    if (amount >= 0.001) return `$${amount.toFixed(4)}`;

    return `$${amount.toFixed(6)}`;
  }

  async function onEstimateCost() {
    if (!validatePromptForm(true)) {
      return;
    }

    try {
      setEstimatingCost(true);
      setEstimate(null);

      const formData = buildPromptFormData();

      const res = await api('/api/question-bank-ai/estimate', {
        method: 'POST',
        body: formData,
      });

      setEstimate(res || {});
    } catch (e) {
      console.log('Estimate cost error', e);
      const message = getApiErrorMessage(e);
      Alert.alert('Estimate Cost', message);
    } finally {
      setEstimatingCost(false);
    }
  }

  function getApiErrorMessage(e) {
    if (e?.errors) {
      const firstKey = Object.keys(e.errors)[0];

      if (firstKey && Array.isArray(e.errors[firstKey])) {
        return e.errors[firstKey][0];
      }
    }

    return e?.message || 'Something went wrong.';
  }

  function validatePromptForm(showAlert = true) {
    const cleanPrompt = prompt.trim();

    if (!cleanPrompt) {
      if (showAlert) {
        Alert.alert('Submit', 'Enter a prompt first.');
      }
      return false;
    }

    if (!model) {
      if (showAlert) {
        Alert.alert('Submit', 'Please select a model.');
      }
      return false;
    }

    // if (sourceType === 'raw_files') {
    //   if (selectedFiles.length === 0) {
    //     if (showAlert) {
    //       Alert.alert('Submit', 'Please choose at least one file.');
    //     }
    //     return false;
    //   }
    // }

    if (sourceType === 'existing_chapter') {
      if (classIds.length === 0) {
        if (showAlert) {
          Alert.alert('Submit', 'Please select at least one class.');
        }
        return false;
      }

      if (courseIds.length === 0) {
        if (showAlert) {
          Alert.alert('Submit', 'Please select at least one subject.');
        }
        return false;
      }

      if (!onlineCourseId) {
        if (showAlert) {
          Alert.alert('Submit', 'Please select an online course.');
        }
        return false;
      }

      if (!chapterId) {
        if (showAlert) {
          Alert.alert('Submit', 'Please select a chapter.');
        }
        return false;
      }
    }

    return true;
  }

  function getSubmitValidationMessage() {
    const cleanPrompt = prompt.trim();

    if (!cleanPrompt) {
      return 'Enter a prompt first.';
    }

    if (!model) {
      return 'Please select a model.';
    }

    if (sourceType === 'existing_chapter') {
      if (classIds.length === 0) {
        return 'Please select at least one class.';
      }

      if (courseIds.length === 0) {
        return 'Please select at least one subject.';
      }

      if (!onlineCourseId) {
        return 'Please select an online course.';
      }

      if (!chapterId) {
        return 'Please select a chapter.';
      }
    }

    return '';
  }

  function buildPromptFormData() {
    const formData = new FormData();

    formData.append('prompt', prompt.trim());
    formData.append('model', model);
    formData.append('source_mode', getSourceMode());

    classIds.forEach(id => {
      formData.append('class_group_ids[]', String(id));
    });

    courseIds.forEach(id => {
      formData.append('course_ids[]', String(id));
    });

    if (sourceType === 'existing_chapter') {
      formData.append('ottcourse_id', String(onlineCourseId));
      formData.append('chapter_id', String(chapterId));
    }

    if (sourceType === 'raw_files') {
      selectedFiles.forEach(file => {
        formData.append('files[]', {
          uri: file.uri,
          name: file.name,
          type: file.type || 'application/octet-stream',
        });
      });
    }

    return formData;
  }

  async function onImprovePrompt() {
    const cleanPrompt = prompt.trim();

    if (!cleanPrompt) {
      Alert.alert(
        'Improve Prompt',
        'Enter a prompt first so it can be improved.',
      );
      return;
    }

    try {
      setImprovingPrompt(true);
      setNotice({
        type: 'warning',
        text: `Improving your prompt with ${
          modelOptions.find(item => item.value === model)?.label || model
        }. Please be patient.`,
      });

      const res = await api('/api/question-bank-ai/optimize-prompt', {
        method: 'POST',
        body: JSON.stringify({
          prompt: cleanPrompt,
        }),
      });

      const optimizedPrompt = res?.optimized_prompt || '';
      const questionCount = res?.question_count;

      if (optimizedPrompt) {
        setPrompt(optimizedPrompt);
        setNotice({
          type: 'success',
          text:
            questionCount !== null && questionCount !== undefined
              ? `Prompt improved. Detected question count: ${questionCount}.`
              : 'Prompt improved.',
        });
      } else {
        setNotice({
          type: 'error',
          text: 'Prompt improvement completed, but no optimized prompt was returned.',
        });
      }
    } catch (e) {
      console.log('Improve prompt error', e);
      setNotice({
        type: 'error',
        text: e?.message || 'Could not improve prompt.',
      });
    } finally {
      setImprovingPrompt(false);
    }
  }

  async function onSubmit() {
    const validationMessage = getSubmitValidationMessage();

    if (validationMessage) {
      setSubmitNotice({
        type: 'error',
        text: validationMessage,
      });
      return;
    }

    try {
      setSubmitting(true);
      setSubmitCompleted(false);

      // top notice clear kore dibo, karon submit message estimate-er niche show hobe
      setNotice(null);

      setSubmitNotice({
        type: 'warning',
        text: 'This may take a while. Please be patient.',
      });

      const formData = buildPromptFormData();

      const res = await api('/api/question-bank-ai/prompts', {
        method: 'POST',
        body: formData,
      });

      const generatedCount =
        res?.generated_count ??
        res?.prompt?.generated_count ??
        res?.questions_count ??
        res?.added_count ??
        0;

      const actualCost =
        res?.actual_cost_usd ??
        res?.prompt?.actual_cost_usd ??
        res?.cost_actual_usd ??
        null;

      const estimatedCost =
        res?.estimated_cost_usd ??
        res?.prompt?.estimated_cost_usd ??
        estimate?.estimated_cost_usd ??
        null;

      setSubmitCompleted(true);

      setSubmitNotice({
        type: 'success',
        text: `${generatedCount} questions generated.${
          actualCost !== null && actualCost !== undefined
            ? ` Actual cost: ${formatMoney(actualCost)}.`
            : ''
        }${
          estimatedCost !== null && estimatedCost !== undefined
            ? ` Estimated cost: ${formatMoney(estimatedCost)}.`
            : ''
        }`,
      });
    } catch (e) {
      console.log('Submit prompt error', e);

      setSubmitCompleted(false);

      setSubmitNotice({
        type: 'error',
        text: getApiErrorMessage(e),
      });
    } finally {
      setSubmitting(false);
    }
  }

  function onPromptHelp() {
    navigation.navigate('AIHelp');
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
        <Text style={styles.loaderText}>Loading new prompt...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageSubtitle}>
              Create a prompt run for OpenAI question generation.
            </Text>
          </View>
        </View>

        {notice ? (
          <View
            style={[
              styles.noticeBox,
              notice.type === 'success' && styles.noticeSuccess,
              notice.type === 'warning' && styles.noticeWarning,
              notice.type === 'error' && styles.noticeError,
            ]}
          >
            <Text style={styles.noticeText}>{notice.text}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Prompt</Text>

        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Describe how the questions should be generated..."
          placeholderTextColor={MUTED}
          multiline
          textAlignVertical="top"
          style={styles.promptInput}
        />

        <View style={styles.promptActionRow}>
          <Pressable
            onPress={onImprovePrompt}
            disabled={improvingPrompt}
            style={[
              styles.promptActionButton,
              improvingPrompt && styles.disabledButton,
            ]}
          >
            <Text style={styles.buttonText}>
              {improvingPrompt ? 'Improving...' : 'Improve Prompt'}
            </Text>
          </Pressable>

          <Pressable onPress={onPromptHelp} style={styles.promptActionButton}>
            <Text style={styles.buttonText}>Prompt Help</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Model</Text>

        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownSelectedText}
          itemTextStyle={styles.dropdownItemText}
          containerStyle={styles.dropdownContainer}
          activeColor="#1E3A8A"
          data={modelOptions}
          labelField="label"
          valueField="value"
          placeholder="Select model"
          value={model}
          onChange={item => setModel(item.value)}
        />

        <Text style={styles.label}>Source</Text>

        <View style={styles.radioGroup}>
          <Pressable
            onPress={() => {
              setSourceType('raw_files');
              setOnlineCourseId('');
              setChapterId('');
            }}
            style={styles.radioRow}
          >
            <Text style={styles.radioMark}>
              {sourceType === 'raw_files' ? '◉' : '○'}
            </Text>
            <Text style={styles.radioLabel}>Upload raw files</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setSourceType('existing_chapter');
            }}
            style={styles.radioRow}
          >
            <Text style={styles.radioMark}>
              {sourceType === 'existing_chapter' ? '◉' : '○'}
            </Text>
            <Text style={styles.radioLabel}>
              Upload an existing chapter from an online course
            </Text>
          </Pressable>
        </View>

        {sourceType === 'raw_files' ? (
          <>
            <Text style={styles.label}>Files</Text>

            <View style={styles.fileBox}>
              <Pressable
                onPress={onChooseFiles}
                style={styles.chooseFileButton}
              >
                <Text style={styles.buttonText}>Choose Files</Text>
              </Pressable>

              <Text style={styles.fileText}>
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} file selected`
                  : 'No file chosen'}
              </Text>
            </View>

            <Text style={styles.helperText}>
              PDF and text files are supported. You can upload more than one.
            </Text>

            {selectedFiles.length > 0 ? (
              <View style={styles.selectedFileList}>
                {selectedFiles.map((file, index) => (
                  <View
                    key={`${file.uri}-${index}`}
                    style={styles.selectedFileRow}
                  >
                    <Text style={styles.selectedFileName} numberOfLines={1}>
                      {file.name}
                    </Text>

                    <Pressable
                      onPress={() =>
                        setSelectedFiles(prev =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                      style={styles.removeFileButton}
                    >
                      <Text style={styles.removeFileText}>×</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noFilesText}>No files selected.</Text>
            )}
          </>
        ) : (
          <View style={styles.onlineChapterInfoCard}>
            <Text style={styles.onlineChapterInfoTitle}>
              Online chapter source
            </Text>
            <Text style={styles.onlineChapterInfoText}>
              Only text, HTML, and PDF materials from the selected chapter will
              be sent to OpenAI.
            </Text>
          </View>
        )}

        <Text style={styles.label}>Attach Classes</Text>

        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownSelectedText}
          itemTextStyle={styles.dropdownItemText}
          inputSearchStyle={styles.dropdownSearchInput}
          containerStyle={styles.dropdownContainer}
          activeColor="#1E3A8A"
          data={classOptions}
          search
          searchPlaceholder="Type to search classes..."
          labelField="label"
          valueField="value"
          placeholder="Type to search classes..."
          value={classIds}
          onChange={setClassIds}
          onChangeText={text => loadClassGroups(text)}
          selectedStyle={styles.selectedChip}
        />

        <Text style={styles.label}>Attach Subjects</Text>

        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownSelectedText}
          itemTextStyle={styles.dropdownItemText}
          inputSearchStyle={styles.dropdownSearchInput}
          containerStyle={styles.dropdownContainer}
          activeColor="#1E3A8A"
          data={courseOptions}
          search
          searchPlaceholder="Type to search courses..."
          labelField="label"
          valueField="value"
          placeholder="Type to search courses..."
          value={courseIds}
          onChange={onChangeSubjects}
          onChangeText={text => loadCourses(text)}
          selectedStyle={styles.selectedChip}
        />

        {sourceType === 'existing_chapter' ? (
          <>
            <Text style={styles.label}>Online Course</Text>

            <Dropdown
              style={[
                styles.dropdown,
                courseIds.length === 0 && { opacity: 0.6 },
              ]}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              itemTextStyle={styles.dropdownItemText}
              inputSearchStyle={styles.dropdownSearchInput}
              containerStyle={styles.dropdownContainer}
              activeColor="#1E3A8A"
              data={onlineCourseOptions}
              search
              searchPlaceholder="Type to search online courses..."
              labelField="label"
              valueField="value"
              placeholder={
                courseIds.length === 0
                  ? 'Select subject first'
                  : 'Type to search online courses...'
              }
              value={onlineCourseId}
              disable={courseIds.length === 0}
              onChange={onChangeOnlineCourse}
            />

            <Text style={styles.onlineCourseHelperText}>
              Online courses linked to the selected classes will appear, and the
              selected subject will narrow them further.
            </Text>

            <Text style={styles.label}>Chapter</Text>

            <Dropdown
              style={[styles.dropdown, !onlineCourseId && { opacity: 0.6 }]}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              itemTextStyle={styles.dropdownItemText}
              inputSearchStyle={styles.dropdownSearchInput}
              containerStyle={styles.dropdownContainer}
              activeColor="#1E3A8A"
              data={chapterOptions}
              search
              searchPlaceholder="Search chapter..."
              labelField="label"
              valueField="value"
              placeholder="Select chapter"
              value={chapterId}
              disable={!onlineCourseId}
              onChange={item => setChapterId(item.value)}
            />
          </>
        ) : null}

        <View style={styles.estimateCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.estimateTitle}>Estimate</Text>

            {estimate ? (
              <Text style={styles.estimateText}>
                Approx. questions: {estimate.estimated_question_count || 0}
                {estimate.estimated_question_count_source
                  ? ` (${estimate.estimated_question_count_source})`
                  : ''}
                {'\n'}
                Prompt tokens: {estimate.estimated_prompt_tokens || 0} | File
                tokens: {estimate.estimated_file_tokens || 0}
                {'\n'}
                Input: {estimate.estimated_input_tokens || 0} | Output:{' '}
                {estimate.estimated_output_tokens || 0} | Estimated cost:{' '}
                {formatMoney(estimate.estimated_cost_usd)}
                {'\n'}
                Base {formatMoney(estimate.estimated_cost_base_usd)},
                calibration x{estimate.estimated_cost_calibration_factor || '-'}{' '}
                | Range {formatMoney(estimate.estimated_cost_low_usd)}-
                {formatMoney(estimate.estimated_cost_high_usd)}
              </Text>
            ) : (
              <Text style={styles.estimateText}>No estimate yet.</Text>
            )}
          </View>

          <Pressable
            onPress={onEstimateCost}
            disabled={estimatingCost}
            style={[
              styles.secondaryButton,
              estimatingCost && styles.disabledButton,
            ]}
          >
            {estimatingCost ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Estimate Cost</Text>
            )}
          </Pressable>
        </View>

        {submitNotice ? (
          <View
            style={[
              styles.submitNoticeBox,
              submitNotice.type === 'success' && styles.noticeSuccess,
              submitNotice.type === 'warning' && styles.noticeWarning,
              submitNotice.type === 'error' && styles.noticeError,
            ]}
          >
            <Text style={styles.noticeText}>{submitNotice.text}</Text>
          </View>
        ) : null}

        <View style={styles.bottomActions}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.secondaryButton}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>

          {/* <Pressable
            onPress={onImprovePrompt}
            disabled={improvingPrompt}
            style={[
              styles.secondaryButton,
              improvingPrompt && styles.disabledButton,
            ]}
          >
            <Text style={styles.buttonText}>
              {improvingPrompt ? 'Improving...' : 'Improve Prompt'}
            </Text>
          </Pressable>

          <Pressable onPress={onPromptHelp} style={styles.secondaryButton}>
            <Text style={styles.buttonText}>Prompt Help</Text>
          </Pressable> */}

          <Pressable
            onPress={() => {
              if (submitCompleted) {
                navigation.goBack();
                return;
              }

              onSubmit();
            }}
            disabled={submitting}
            style={[styles.submitButton, submitting && styles.disabledButton]}
          >
            {submitting ? (
              <Text style={styles.submitButtonText}>Submitting...</Text>
            ) : (
              <Text style={styles.submitButtonText}>
                {submitCompleted ? 'OK' : 'Submit'}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  loader: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    color: MUTED,
    marginTop: 10,
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  pageTitle: {
    color: TEXT,
    fontSize: 20,
    fontWeight: '900',
  },
  pageSubtitle: {
    color: MUTED,
    fontSize: 13,
    marginTop: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#000',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 25,
  },
  label: {
    color: TEXT,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 8,
  },
  promptInput: {
    minHeight: 220,
    backgroundColor: CARD,
    color: TEXT,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  dropdown: {
    minHeight: 48,
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
  },
  dropdownPlaceholder: {
    color: MUTED,
    fontSize: 14,
  },
  dropdownSelectedText: {
    color: TEXT,
    fontSize: 14,
  },
  dropdownItemText: {
    color: TEXT,
    fontSize: 14,
  },
  dropdownSearchInput: {
    color: TEXT,
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 8,
  },
  selectedChip: {
    borderRadius: 8,
    backgroundColor: '#1E293B',
    borderColor: BORDER,
  },
  radioGroup: {
    gap: 10,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioMark: {
    color: GREEN,
    fontSize: 18,
    marginRight: 10,
    lineHeight: 20,
  },
  radioLabel: {
    color: TEXT,
    flex: 1,
    lineHeight: 20,
  },
  fileBox: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  chooseFileButton: {
    backgroundColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  fileText: {
    color: TEXT,
  },
  helperText: {
    color: MUTED,
    marginTop: 10,
    lineHeight: 20,
  },
  noFilesText: {
    color: MUTED,
    marginTop: 8,
  },
  estimateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_DARK,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
  },
  estimateTitle: {
    color: TEXT,
    fontWeight: '900',
    fontSize: 15,
  },
  estimateText: {
    color: MUTED,
    marginTop: 6,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },
  secondaryButton: {
    backgroundColor: '#334155',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: GREEN,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  buttonText: {
    color: TEXT,
    fontWeight: '800',
  },
  submitButtonText: {
    color: '#000',
    fontWeight: '900',
  },
  onlineChapterInfoCard: {
    backgroundColor: CARD_DARK,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
  },
  onlineChapterInfoTitle: {
    color: TEXT,
    fontWeight: '900',
    fontSize: 15,
    marginBottom: 8,
  },
  onlineChapterInfoText: {
    color: MUTED,
    lineHeight: 20,
  },
  onlineCourseHelperText: {
    color: MUTED,
    marginTop: 10,
    lineHeight: 20,
  },
  selectedFileList: {
    marginTop: 10,
    gap: 8,
  },
  selectedFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: BORDER_SOFT,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  selectedFileName: {
    color: TEXT,
    flex: 1,
    marginRight: 8,
  },
  removeFileButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeFileText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
  },

  noticeBox: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginTop: 10,
    marginBottom: 10,
  },
  noticeWarning: {
    backgroundColor: '#9A3412',
    borderColor: '#F59E0B',
  },
  noticeSuccess: {
    backgroundColor: '#1E293B',
    borderColor: '#3B82F6',
  },
  noticeError: {
    backgroundColor: '#450A0A',
    borderColor: '#EF4444',
  },
  noticeText: {
    color: TEXT,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
  promptActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
    marginBottom: 8,
  },
  promptActionButton: {
    backgroundColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitNoticeBox: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginTop: 10,
  },
});
