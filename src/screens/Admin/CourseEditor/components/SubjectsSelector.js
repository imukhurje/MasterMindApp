import React, { useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { COLORS, styles } from './SubjectsSelector.styles';

function normalizeIds(values) {
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

function getClassGroupLabel(subject) {
  const classGroups = Array.isArray(subject?.class_groups)
    ? subject.class_groups
    : [];

  if (classGroups.length === 0) {
    return 'No class group';
  }

  return classGroups
    .map(classGroup => {
      const name = classGroup?.name || 'Unnamed class';

      const section = classGroup?.section;

      return section ? `${name} - ${section}` : name;
    })
    .join(', ');
}

export default function SubjectsSelector({
  subjects = [],
  selectedSubjectIds = [],
  attachedSubjectIds = [],
  loading = false,
  errorMessage = '',
  disabled = false,
  onChange,
  onRetry,
}) {
  const [searchText, setSearchText] = useState('');

  const selectedIds = useMemo(
    () => normalizeIds(selectedSubjectIds),
    [selectedSubjectIds],
  );

  const attachedIds = useMemo(
    () => normalizeIds(attachedSubjectIds),
    [attachedSubjectIds],
  );

  const filteredSubjects = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return subjects;
    }

    return subjects.filter(subject => {
      const title = String(subject?.title || '').toLowerCase();

      const description = String(subject?.description || '').toLowerCase();

      const classGroupText = getClassGroupLabel(subject).toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query) ||
        classGroupText.includes(query)
      );
    });
  }, [searchText, subjects]);

  function handleToggleSubject(subjectId) {
    if (disabled) {
      return;
    }

    const numericSubjectId = Number(subjectId);

    if (!Number.isFinite(numericSubjectId)) {
      return;
    }

    /*
     * Already attached subjects remain selected
     * until the detach API is available.
     */
    if (attachedIds.includes(numericSubjectId)) {
      return;
    }

    const isSelected = selectedIds.includes(numericSubjectId);

    const nextSelectedIds = isSelected
      ? selectedIds.filter(id => id !== numericSubjectId)
      : [...selectedIds, numericSubjectId];

    onChange?.(nextSelectedIds);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Subjects</Text>

          <Text style={styles.subtitle}>
            {selectedIds.length}{' '}
            {selectedIds.length === 1
              ? 'subject selected'
              : 'subjects selected'}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={COLORS.BLUE} />
        ) : null}
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          editable={!disabled}
          placeholder="Search subjects"
          placeholderTextColor={COLORS.MUTED}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.searchInput}
        />

        {searchText.length > 0 ? (
          <Pressable onPress={() => setSearchText('')} hitSlop={10}>
            <Text style={styles.clearButtonText}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>

          {onRetry ? (
            <Pressable onPress={onRetry} disabled={loading}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {!loading && !errorMessage && filteredSubjects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No subjects found.</Text>
        </View>
      ) : null}

      <View style={styles.subjectList}>
        {filteredSubjects.map(subject => {
          const subjectId = Number(subject?.id);

          const isAttached = attachedIds.includes(subjectId);

          const isSelected = selectedIds.includes(subjectId);

          return (
            <Pressable
              key={String(subjectId)}
              onPress={() => handleToggleSubject(subjectId)}
              disabled={disabled || isAttached}
              style={({ pressed }) => [
                styles.subjectCard,

                isSelected && styles.subjectCardSelected,

                isAttached && styles.subjectCardAttached,

                pressed &&
                  !isAttached &&
                  !disabled &&
                  styles.subjectCardPressed,
              ]}
            >
              <View
                style={[styles.checkbox, isSelected && styles.checkboxSelected]}
              >
                {isSelected ? <Text style={styles.checkboxText}>✓</Text> : null}
              </View>

              <View style={styles.subjectTextContainer}>
                <Text style={styles.subjectTitle} numberOfLines={1}>
                  {subject?.title || 'Untitled Subject'}
                </Text>

                {subject?.description ? (
                  <Text style={styles.subjectDescription} numberOfLines={2}>
                    {subject.description}
                  </Text>
                ) : null}

                <Text style={styles.classGroupText} numberOfLines={2}>
                  {getClassGroupLabel(subject)}
                </Text>
              </View>

              {isAttached ? (
                <View style={styles.attachedBadge}>
                  <Text style={styles.attachedBadgeText}>Attached</Text>
                </View>
              ) : isSelected ? (
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>Will attach</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
