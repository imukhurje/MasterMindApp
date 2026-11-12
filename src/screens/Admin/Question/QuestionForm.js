import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import styles, { COLORS } from './QuestionForm.styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { api } from '../../../api/client';

const typeOptions = [
  { label: 'Single Correct (MCQ)', value: 'single_mcq' },
  { label: 'Multiple Correct (MCQ)', value: 'multiple_mcq' },
  { label: 'Long Form', value: 'long_form' },
];

export default function QuestionForm() {
  const navigation = useNavigation();
  const route = useRoute();

  const { width } = useWindowDimensions();

  const isWideScreen = width >= 700;

  const editQuestion = route?.params?.question || null;
  const isEdit = !!editQuestion;

  const source = route?.params?.source || '';

  const presetClassGroupId = Number(route?.params?.presetClassGroupId);

  const presetCourseId = Number(route?.params?.presetCourseId);

  const [saving, setSaving] = useState(false);

  const [content, setContent] = useState('');
  const [type, setType] = useState('single_mcq');
  const [isActive, setIsActive] = useState(true);

  const [classIds, setClassIds] = useState([]);
  const [courseIds, setCourseIds] = useState([]);
  const [onlineCourseId, setOnlineCourseId] = useState('');
  const [chapterId, setChapterId] = useState('');

  const [choices, setChoices] = useState(['', '']);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [modelAnswer, setModelAnswer] = useState('');

  const [classOptions, setClassOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [onlineCourseOptions, setOnlineCourseOptions] = useState([]);
  const [chapterOptions, setChapterOptions] = useState([
    { label: 'Select chapter', value: '' },
  ]);

  const [onlineCourseLoading, setOnlineCourseLoading] = useState(false);

  useEffect(() => {
    async function initializeForm() {
      await loadInitialData();

      if (isEdit) {
        hydrateEditData(editQuestion);
        return;
      }

      if (Number.isFinite(presetClassGroupId)) {
        setClassIds([String(presetClassGroupId)]);
      }

      if (Number.isFinite(presetCourseId)) {
        setCourseIds([String(presetCourseId)]);

        await loadOttCoursesByCourse(String(presetCourseId));
      }
    }

    initializeForm();
  }, []);

  async function loadInitialData() {
    await Promise.allSettled([loadClassGroups(''), loadCourses('')]);
  }

  function hydrateEditData(item) {
    setContent(item?.content || item?.question || '');
    setType(item?.type || 'single_mcq');
    setIsActive(item?.is_active !== false);
    setModelAnswer(item?.model_answer || '');

    const existingChoices = Array.isArray(item?.choices)
      ? item.choices
      : Array.isArray(item?.options)
      ? item.options
      : ['', ''];

    setChoices(existingChoices.length >= 2 ? existingChoices : ['', '']);

    if (Array.isArray(item?.correct_answers)) {
      setCorrectAnswers(item.correct_answers.map(Number));
    }

    if (Array.isArray(item?.class_groups)) {
      setClassIds(item.class_groups.map(cls => String(cls.id)));
    }

    if (Array.isArray(item?.courses)) {
      const selectedCourses = item.courses.map(course => String(course.id));
      setCourseIds(selectedCourses);

      if (selectedCourses.length > 0) {
        loadOttCoursesByCourse(selectedCourses[selectedCourses.length - 1]);
      }
    }

    if (item?.chapter?.ottcourse?.id) {
      setOnlineCourseId(String(item.chapter.ottcourse.id));
    }

    if (item?.chapter?.id) {
      setChapterId(String(item.chapter.id));
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
      console.log('Selected subject/course id ===>', courseId);

      if (!courseId) {
        setOnlineCourseOptions([]);
        return;
      }

      setOnlineCourseLoading(true);

      const res = await api(`/api/courses/${courseId}/ottcourses`);

      console.log('Ott courses response ===>', res);

      const ottcourses = Array.isArray(res?.ottcourses)
        ? res.ottcourses
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];

      const options = ottcourses
        .map(item => ({
          label: item.title || item.label || item.name || 'Untitled',
          value: String(item.id),
        }))
        .filter(item => item.value);

      console.log('Ott course options ===>', options);

      setOnlineCourseOptions(options);
    } catch (e) {
      console.log('Online courses by course load error', e);
      Alert.alert(
        'Online Courses',
        e?.message || 'Could not load online courses for this subject.',
      );
      setOnlineCourseOptions([]);
    } finally {
      setOnlineCourseLoading(false);
    }
  }

  function onChangeSubjects(selectedCourseIds) {
    console.log('Selected subject ids ===>', selectedCourseIds);

    const previousIds = courseIds || [];
    const nextIds = Array.isArray(selectedCourseIds) ? selectedCourseIds : [];

    setCourseIds(nextIds);

    setOnlineCourseId('');
    setChapterId('');
    setOnlineCourseOptions([]);
    setChapterOptions([{ label: 'Select chapter', value: '' }]);

    if (nextIds.length === 0) {
      return;
    }

    const newlySelectedId =
      nextIds.find(id => !previousIds.includes(id)) ||
      nextIds[nextIds.length - 1];

    loadOttCoursesByCourse(newlySelectedId);
  }

  async function loadChapters(ottcourseId = '', q = '') {
    try {
      if (!ottcourseId) {
        setChapterOptions([{ label: 'Select chapter', value: '' }]);
        return;
      }

      const res = await api(
        `/api/questions/chapters?ottcourse_id=${ottcourseId}&q=${encodeURIComponent(
          q,
        )}`,
      );

      const chapters = Array.isArray(res?.chapters) ? res.chapters : [];

      setChapterOptions([
        { label: 'Select chapter', value: '' },
        ...chapters.map(item => ({
          label: item.title || item.label,
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
    loadChapters(item.value, '');
  }

  function updateChoice(index, value) {
    setChoices(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function addChoice() {
    setChoices(prev => [...prev, '']);
  }

  function removeChoice(index) {
    if (choices.length <= 2) {
      Alert.alert('Choices', 'At least 2 choices are required.');
      return;
    }

    setChoices(prev => prev.filter((_, i) => i !== index));
    setCorrectAnswers(prev =>
      prev
        .filter(answerIndex => answerIndex !== index)
        .map(answerIndex =>
          answerIndex > index ? answerIndex - 1 : answerIndex,
        ),
    );
  }

  function toggleCorrectAnswer(index) {
    if (type === 'single_mcq') {
      setCorrectAnswers([index]);
      return;
    }

    if (type === 'multiple_mcq') {
      setCorrectAnswers(prev => {
        if (prev.includes(index)) {
          return prev.filter(i => i !== index);
        }
        return [...prev, index];
      });
    }
  }

  function validateForm() {
    if (!content.trim()) {
      Alert.alert('Question', 'Please enter the question text.');
      return false;
    }

    if (type === 'long_form' && !modelAnswer.trim()) {
      Alert.alert('Model Answer', 'Please enter the model answer.');
      return false;
    }

    if (type !== 'long_form') {
      const validChoices = choices.filter(choice => choice.trim());

      if (validChoices.length < 2) {
        Alert.alert('Choices', 'Please enter at least 2 choices.');
        return false;
      }

      if (correctAnswers.length === 0) {
        Alert.alert('Correct Answer', 'Please select the correct answer.');
        return false;
      }
    }

    return true;
  }

  async function submitQuestion() {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const cleanedChoices = choices
        .map(choice => choice.trim())
        .filter(Boolean);

      const payload = {
        type,
        content: content.trim(),
        choices: type === 'long_form' ? [] : cleanedChoices,
        correct_answers: type === 'long_form' ? [] : correctAnswers,
        model_answer: type === 'long_form' ? modelAnswer.trim() : null,
        is_active: isActive,
        class_group_ids: classIds.map(Number),
        course_ids: courseIds.map(Number),
        ottcourse_id: onlineCourseId ? Number(onlineCourseId) : null,
        chapter_id: chapterId ? Number(chapterId) : null,
      };

      if (isEdit) {
        await api(`/api/questions/${editQuestion.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });

        Alert.alert('Question', 'Question updated successfully.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        await api('/api/questions', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (source === 'assign_exam_questions') {
          navigation.goBack();
          return;
        }

        Alert.alert('Question', 'Question created successfully.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (e) {
      console.log('Save question error', e);
      Alert.alert('Question', e?.message || 'Could not save question.');
    } finally {
      setSaving(false);
    }
  }

  const isLongForm = type === 'long_form';

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.BG}
        translucent={false}
      />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.controlPressed,
          ]}
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>
          {isEdit ? 'Edit Question' : 'Create Question'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          {/* Question + Preview */}
          <View
            style={[
              styles.responsiveRow,
              !isWideScreen && styles.responsiveColumn,
            ]}
          >
            <View
              style={[
                styles.questionArea,
                isWideScreen && styles.questionAreaWide,
              ]}
            >
              <Text style={styles.label}>Question</Text>

              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Enter the question text..."
                placeholderTextColor={COLORS.MUTED}
                multiline
                style={styles.questionInput}
              />
            </View>

            <View
              style={[
                styles.previewArea,
                isWideScreen && styles.previewAreaWide,
              ]}
            >
              <Text style={styles.label}>Preview</Text>

              <View style={styles.previewBox}>
                <Text
                  style={[
                    styles.previewText,
                    !content && styles.previewPlaceholder,
                  ]}
                >
                  {content || 'Question preview will appear here...'}
                </Text>
              </View>
            </View>
          </View>

          {/* Classes + Subjects */}
          <View
            style={[
              styles.responsiveRow,
              !isWideScreen && styles.responsiveColumn,
            ]}
          >
            <View style={styles.halfField}>
              <Text style={styles.label}>Attach Classes</Text>

              <MultiSelect
                style={styles.dropdown}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                itemTextStyle={styles.dropdownItemText}
                inputSearchStyle={styles.dropdownSearchInput}
                containerStyle={styles.dropdownContainer}
                activeColor="#173B60"
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
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>Attach Subjects</Text>

              <MultiSelect
                style={styles.dropdown}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                itemTextStyle={styles.dropdownItemText}
                inputSearchStyle={styles.dropdownSearchInput}
                containerStyle={styles.dropdownContainer}
                activeColor="#173B60"
                data={courseOptions}
                search
                searchPlaceholder="Type to search subjects..."
                labelField="label"
                valueField="value"
                placeholder="Type to search subjects..."
                value={courseIds}
                onChange={onChangeSubjects}
                onChangeText={text => loadCourses(text)}
                selectedStyle={styles.selectedChip}
              />
            </View>
          </View>

          {/* Type + Online Course + Chapter */}
          <View
            style={[
              styles.responsiveRow,
              !isWideScreen && styles.responsiveColumn,
            ]}
          >
            <View
              style={isWideScreen ? styles.typeFieldWide : styles.fullField}
            >
              <Text style={styles.label}>Type</Text>

              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                itemTextStyle={styles.dropdownItemText}
                containerStyle={styles.dropdownContainer}
                activeColor="#173B60"
                data={typeOptions}
                labelField="label"
                valueField="value"
                placeholder="Select type"
                value={type}
                onChange={item => {
                  setType(item.value);
                  setCorrectAnswers([]);
                }}
              />
            </View>

            <View
              style={
                isWideScreen ? styles.onlineCourseFieldWide : styles.fullField
              }
            >
              <Text style={styles.label}>Online Course</Text>

              <Dropdown
                style={[
                  styles.dropdown,
                  courseIds.length === 0 && styles.disabledControl,
                ]}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                itemTextStyle={styles.dropdownItemText}
                inputSearchStyle={styles.dropdownSearchInput}
                containerStyle={styles.dropdownContainer}
                activeColor="#173B60"
                data={onlineCourseOptions}
                search
                searchPlaceholder="Search online course..."
                labelField="label"
                valueField="value"
                placeholder={
                  courseIds.length === 0
                    ? 'Select subject first'
                    : onlineCourseLoading
                    ? 'Loading online courses...'
                    : 'Select Online Course'
                }
                value={onlineCourseId}
                disable={courseIds.length === 0 || onlineCourseLoading}
                onChange={onChangeOnlineCourse}
              />
            </View>

            <View
              style={isWideScreen ? styles.chapterFieldWide : styles.fullField}
            >
              <Text style={styles.label}>Chapter</Text>

              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                itemTextStyle={styles.dropdownItemText}
                inputSearchStyle={styles.dropdownSearchInput}
                containerStyle={styles.dropdownContainer}
                activeColor="#173B60"
                data={chapterOptions}
                search
                searchPlaceholder="Search chapter..."
                labelField="label"
                valueField="value"
                placeholder="Select chapter"
                value={chapterId}
                onChange={item => setChapterId(item.value)}
                onChangeText={text => loadChapters(onlineCourseId, text)}
              />
            </View>
          </View>

          <Pressable
            onPress={() => setIsActive(prev => !prev)}
            style={styles.activeRow}
          >
            <View
              style={[
                styles.checkboxBox,
                isActive && styles.checkboxBoxSelected,
              ]}
            >
              {isActive ? <Text style={styles.checkboxTick}>✓</Text> : null}
            </View>

            <Text style={styles.activeText}>Active</Text>
          </Pressable>
        </View>

        {/* Choices */}
        {!isLongForm ? (
          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Choices</Text>

                <Text style={styles.sectionDescription}>
                  Select the correct answer using the circle beside each choice.
                </Text>
              </View>
            </View>

            {choices.map((choice, index) => {
              const selected = correctAnswers.includes(index);

              return (
                <View key={index} style={styles.choiceCard}>
                  <View style={styles.choiceTopRow}>
                    <Pressable
                      onPress={() => toggleCorrectAnswer(index)}
                      style={[
                        styles.answerSelector,
                        selected && styles.answerSelectorSelected,
                      ]}
                    >
                      {selected ? (
                        <View style={styles.answerSelectorDot} />
                      ) : null}
                    </Pressable>

                    <TextInput
                      value={choice}
                      onChangeText={value => updateChoice(index, value)}
                      placeholder={`Choice ${index + 1}`}
                      placeholderTextColor={COLORS.MUTED}
                      style={styles.choiceInput}
                    />

                    <Pressable
                      onPress={() => removeChoice(index)}
                      style={({ pressed }) => [
                        styles.removeButton,
                        pressed && styles.controlPressed,
                      ]}
                    >
                      <Text style={styles.removeText}>×</Text>
                    </Pressable>
                  </View>

                  <View style={styles.choicePreview}>
                    <Text
                      style={[
                        styles.choicePreviewText,
                        !choice && styles.previewPlaceholder,
                      ]}
                    >
                      {choice || `Choice ${index + 1} preview`}
                    </Text>
                  </View>
                </View>
              );
            })}

            <Pressable
              onPress={addChoice}
              style={({ pressed }) => [
                styles.addChoiceButton,
                pressed && styles.controlPressed,
              ]}
            >
              <Text style={styles.addChoiceButtonText}>+ Add choice</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Model Answer</Text>

            <Text style={styles.sectionDescription}>
              Add a reference answer for this long-form question.
            </Text>

            <TextInput
              value={modelAnswer}
              onChangeText={setModelAnswer}
              placeholder="Enter a reference answer..."
              placeholderTextColor={COLORS.MUTED}
              multiline
              style={styles.modelAnswerInput}
            />
          </View>
        )}

        <View style={styles.footer}>
          <Pressable
            onPress={() => navigation.goBack()}
            disabled={saving}
            style={({ pressed }) => [
              styles.cancelButton,
              saving && styles.controlDisabled,
              pressed && !saving && styles.controlPressed,
            ]}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={submitQuestion}
            disabled={saving}
            style={({ pressed }) => [
              styles.createButton,
              saving && styles.controlDisabled,
              pressed && !saving && styles.controlPressed,
            ]}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.createText}>
                {isEdit ? 'Save Changes' : 'Create'}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
