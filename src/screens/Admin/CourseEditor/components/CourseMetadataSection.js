import React, { useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  ScrollView,
} from 'react-native';

import ClassGroupsEditor from './ClassGroupsEditor';
import CategoriesEditor from './CategoriesEditor';
import TagsEditor from './TagsEditor';

import { styles, COLORS } from './CourseMetadataSection.styles';

function addUniqueValue(values, newValue) {
  const cleanValue = String(newValue || '').trim();

  if (!cleanValue) {
    return values;
  }

  const alreadyExists = values.some(
    item => String(item).toLowerCase() === cleanValue.toLowerCase(),
  );

  if (alreadyExists) {
    return values;
  }

  return [...values, cleanValue];
}

function removeValue(values, valueToRemove) {
  return values.filter(item => item !== valueToRemove);
}

function normalizeSubjectIds(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .map(value => Number(value))
        .filter(value => Number.isFinite(value)),
    ),
  );
}

function mergeSubjectOptions(attachedSubjects, subjectOptions) {
  const subjectMap = new Map();

  [
    ...(Array.isArray(attachedSubjects) ? attachedSubjects : []),

    ...(Array.isArray(subjectOptions) ? subjectOptions : []),
  ].forEach(subject => {
    if (!subject?.id) {
      return;
    }

    subjectMap.set(String(subject.id), subject);
  });

  return Array.from(subjectMap.values()).sort((first, second) =>
    String(first?.title || first?.name || '').localeCompare(
      String(second?.title || second?.name || ''),
    ),
  );
}

function getSubjectTitle(subject) {
  return String(subject?.title || subject?.name || 'Untitled Subject');
}

function getSubjectClassGroups(subject) {
  const classGroups = Array.isArray(subject?.class_groups)
    ? subject.class_groups
    : [];

  if (classGroups.length === 0) {
    return 'No class groups';
  }

  return classGroups
    .map(classGroup => {
      const name = classGroup?.name || 'Unnamed Class';

      const section = classGroup?.section;

      return section ? `${name} - ${section}` : name;
    })
    .join(', ');
}

function Chip({ label, onRemove }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText} numberOfLines={1}>
        {label}
      </Text>

      <Pressable onPress={onRemove} hitSlop={8} style={styles.chipRemoveButton}>
        <Text style={styles.chipRemoveText}>×</Text>
      </Pressable>
    </View>
  );
}

function TokenEditor({ label, placeholder, values, onChange }) {
  const [inputValue, setInputValue] = useState('');

  function handleAdd() {
    const updatedValues = addUniqueValue(values, inputValue);

    onChange(updatedValues);

    if (updatedValues.length !== values.length) {
      setInputValue('');
    }
  }

  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.tokenInputRow}>
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={placeholder}
          placeholderTextColor={COLORS.MUTED}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={handleAdd}
          style={styles.tokenInput}
        />

        <Pressable
          onPress={handleAdd}
          style={({ pressed }) => [
            styles.plusButton,

            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.plusButtonText}>+</Text>
        </Pressable>
      </View>

      {values.length > 0 ? (
        <View style={styles.chipContainer}>
          {values.map(value => (
            <Chip
              key={value}
              label={value}
              onRemove={() => onChange(removeValue(values, value))}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default function CourseMetadataSection({
  courseId,
  form,

  subjectOptions = [],
  attachedSubjects = [],
  attachedSubjectIds = [],
  loadingSubjects = false,
  subjectErrorMessage = '',
  onRetrySubjects,

  onChangeField,
  onSave,
  onDelete,

  saving = false,
  deleting = false,

  updatingPublishStatus = false,
  onPublishStatusChange,
}) {
  const { width } = useWindowDimensions();

  const isWideLayout = width >= 720;

  const [subjectSearchText, setSubjectSearchText] = useState('');

  const selectedSubjectIds = useMemo(
    () => normalizeSubjectIds(form?.selectedSubjectIds),
    [form?.selectedSubjectIds],
  );

  const normalizedAttachedIds = useMemo(
    () => normalizeSubjectIds(attachedSubjectIds),
    [attachedSubjectIds],
  );

  const allSubjectOptions = useMemo(
    () => mergeSubjectOptions(attachedSubjects, subjectOptions),
    [attachedSubjects, subjectOptions],
  );

  const filteredSubjectOptions = useMemo(() => {
    const query = subjectSearchText.trim().toLowerCase();

    if (!query) {
      return allSubjectOptions;
    }

    return allSubjectOptions.filter(subject => {
      const title = getSubjectTitle(subject).toLowerCase();

      const description = String(subject?.description || '').toLowerCase();

      const classGroups = getSubjectClassGroups(subject).toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query) ||
        classGroups.includes(query)
      );
    });
  }, [allSubjectOptions, subjectSearchText]);

  const metadataBusy = saving || deleting || updatingPublishStatus;

  function toggleSubject(subjectId) {
    if (metadataBusy) {
      return;
    }

    const numericSubjectId = Number(subjectId);

    if (!Number.isFinite(numericSubjectId)) {
      return;
    }

    const selected = selectedSubjectIds.includes(numericSubjectId);

    const nextSelectedIds = selected
      ? selectedSubjectIds.filter(id => id !== numericSubjectId)
      : [...selectedSubjectIds, numericSubjectId];

    onChangeField('selectedSubjectIds', normalizeSubjectIds(nextSelectedIds));
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>Description & Metadata</Text>

          <Text style={styles.sectionSubtitle}>
            Edit general course information
          </Text>
        </View>

        <View style={styles.publishContainer}>
          <Text style={styles.publishLabel}>
            {form.isPublished ? 'Published' : 'Draft'}
          </Text>

          <Switch
            value={form.isPublished}
            disabled={updatingPublishStatus}
            onValueChange={onPublishStatusChange}
            trackColor={{
              false: '#475569',
              true: '#2563EB',
            }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View
        style={[
          styles.topFields,

          isWideLayout ? styles.topFieldsWide : styles.topFieldsMobile,
        ]}
      >
        <View
          style={[styles.fieldBlock, isWideLayout && styles.titleFieldWide]}
        >
          <Text style={styles.label}>Title</Text>

          <TextInput
            value={form.title}
            onChangeText={value => onChangeField('title', value)}
            placeholder="Course title"
            placeholderTextColor={COLORS.MUTED}
            style={styles.textInput}
          />
        </View>

        <View
          style={[styles.fieldBlock, isWideLayout && styles.smallFieldWide]}
        >
          <Text style={styles.label}>Price</Text>

          <TextInput
            value={form.price}
            onChangeText={value => onChangeField('price', value)}
            placeholder="0"
            placeholderTextColor={COLORS.MUTED}
            keyboardType="decimal-pad"
            style={styles.textInput}
          />
        </View>

        <View
          style={[styles.fieldBlock, isWideLayout && styles.smallFieldWide]}
        >
          <Text style={styles.label}>Currency</Text>

          <TextInput
            value={form.currency}
            onChangeText={value => onChangeField('currency', value)}
            placeholder="₹"
            placeholderTextColor={COLORS.MUTED}
            style={styles.textInput}
          />
        </View>
      </View>

      <ClassGroupsEditor
        courseId={courseId}
        selectedClassGroups={form.classGroups}
        onChange={classGroups => onChangeField('classGroups', classGroups)}
      />

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Description</Text>

        <TextInput
          value={form.description}
          onChangeText={value => onChangeField('description', value)}
          placeholder="Course description"
          placeholderTextColor={COLORS.MUTED}
          multiline
          textAlignVertical="top"
          style={[styles.textInput, styles.descriptionInput]}
        />
      </View>

      <View style={styles.fieldBlock}>
        <View style={styles.subjectHeaderRow}>
          <View style={styles.subjectHeaderText}>
            <Text style={styles.label}>Subjects</Text>

            <Text style={styles.subjectCountText}>
              {selectedSubjectIds.length}{' '}
              {selectedSubjectIds.length === 1
                ? 'subject selected'
                : 'subjects selected'}
            </Text>
          </View>

          {loadingSubjects ? (
            <ActivityIndicator size="small" color={COLORS.BLUE} />
          ) : null}
        </View>

        <View style={styles.subjectSearchContainer}>
          <Text style={styles.subjectSearchIcon}>🔍</Text>

          <TextInput
            value={subjectSearchText}
            onChangeText={setSubjectSearchText}
            editable={!metadataBusy}
            placeholder="Search subjects"
            placeholderTextColor={COLORS.MUTED}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.subjectSearchInput}
          />

          {subjectSearchText.length > 0 ? (
            <Pressable
              onPress={() => setSubjectSearchText('')}
              hitSlop={10}
              style={styles.subjectSearchClearButton}
            >
              <Text style={styles.subjectSearchClearText}>✕</Text>
            </Pressable>
          ) : null}
        </View>

        {subjectErrorMessage ? (
          <View style={styles.subjectErrorContainer}>
            <Text style={styles.subjectErrorText}>{subjectErrorMessage}</Text>

            {onRetrySubjects ? (
              <Pressable onPress={onRetrySubjects} disabled={loadingSubjects}>
                <Text style={styles.subjectRetryText}>Retry</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        <View style={styles.subjectContainer}>
          {loadingSubjects && allSubjectOptions.length === 0 ? (
            <View style={styles.subjectLoadingContainer}>
              <ActivityIndicator size="small" color={COLORS.BLUE} />

              <Text style={styles.subjectLoadingText}>Loading subjects...</Text>
            </View>
          ) : null}

          {!loadingSubjects &&
          !subjectErrorMessage &&
          filteredSubjectOptions.length === 0 ? (
            <Text style={styles.subjectEmptyText}>No subjects found.</Text>
          ) : null}

          {filteredSubjectOptions.length > 0 ? (
            <ScrollView
              style={styles.subjectScrollView}
              contentContainerStyle={styles.subjectScrollContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator
              persistentScrollbar
              keyboardShouldPersistTaps="handled"
            >
              {filteredSubjectOptions.map(subject => {
                const subjectId = Number(subject?.id);

                const selected = selectedSubjectIds.includes(subjectId);

                const attached = normalizedAttachedIds.includes(subjectId);

                return (
                  <Pressable
                    key={String(subjectId)}
                    onPress={() => toggleSubject(subjectId)}
                    disabled={metadataBusy}
                    style={({ pressed }) => [
                      styles.subjectOption,

                      selected && styles.subjectOptionSelected,

                      attached && styles.subjectOptionAttached,

                      metadataBusy && styles.subjectOptionDisabled,

                      pressed && !metadataBusy && styles.buttonPressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.subjectCheckbox,

                        selected && styles.subjectCheckboxSelected,
                      ]}
                    >
                      {selected ? (
                        <Text style={styles.subjectCheckmark}>✓</Text>
                      ) : null}
                    </View>

                    <View style={styles.subjectTextContainer}>
                      <Text
                        style={[
                          styles.subjectText,

                          selected && styles.subjectTextSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {getSubjectTitle(subject)}
                      </Text>

                      {subject?.description ? (
                        <Text
                          style={styles.subjectDescription}
                          numberOfLines={2}
                        >
                          {subject.description}
                        </Text>
                      ) : null}

                      <Text style={styles.subjectClassGroups} numberOfLines={2}>
                        {getSubjectClassGroups(subject)}
                      </Text>
                    </View>

                    {attached && selected ? (
                      <View
                        style={[
                          styles.subjectBadge,
                          styles.subjectAttachedBadge,
                        ]}
                      >
                        <Text style={styles.subjectAttachedBadgeText}>
                          Attached
                        </Text>
                      </View>
                    ) : attached && !selected ? (
                      <View
                        style={[
                          styles.subjectBadge,
                          styles.subjectPendingBadge,
                        ]}
                      >
                        <Text style={styles.subjectPendingBadgeText}>
                          Will remove
                        </Text>
                      </View>
                    ) : selected ? (
                      <View
                        style={[
                          styles.subjectBadge,
                          styles.subjectPendingBadge,
                        ]}
                      >
                        <Text style={styles.subjectPendingBadgeText}>
                          Will attach
                        </Text>
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}
        </View>
      </View>

      <CategoriesEditor
        courseId={courseId}
        selectedCategories={form.categories}
        onChange={categories => onChangeField('categories', categories)}
      />

      <TagsEditor
        courseId={courseId}
        selectedTags={form.tags}
        onChange={tags => onChangeField('tags', tags)}
      />

      <View style={styles.actionContainer}>
        <Pressable
          onPress={onDelete}
          disabled={deleting || saving || updatingPublishStatus}
          style={({ pressed }) => [
            styles.deleteButton,

            pressed && !deleting && styles.buttonPressed,

            (deleting || saving || updatingPublishStatus) &&
              styles.buttonDisabled,
          ]}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.deleteButtonText}>Delete Course</Text>
          )}
        </Pressable>

        <Pressable
          onPress={onSave}
          disabled={saving}
          style={({ pressed }) => [
            styles.saveButton,

            pressed && !saving && styles.buttonPressed,

            saving && styles.buttonDisabled,
          ]}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
