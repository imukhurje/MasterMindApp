import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { styles, COLORS } from './TagsEditor.styles';

function normalizeTags(response) {
  const items = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
    ? response.data
    : [];

  return items
    .map(item => ({
      ...item,
      id: Number(item?.id),
      name: String(item?.name || '').trim(),
    }))
    .filter(item => item.id && item.name);
}

function normalizeName(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

export default function TagsEditor({ courseId, selectedTags = [], onChange }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const [searching, setSearching] = useState(false);
  const [savingTagKey, setSavingTagKey] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');

  const searchRequestId = useRef(0);

  const cleanQuery = query.trim();

  const selectedTagIds = useMemo(() => {
    return new Set(selectedTags.map(tag => String(tag?.id)));
  }, [selectedTags]);

  const availableSuggestions = useMemo(() => {
    return suggestions.filter(tag => !selectedTagIds.has(String(tag?.id)));
  }, [suggestions, selectedTagIds]);

  const exactTagAlreadyExists = useMemo(() => {
    if (!cleanQuery) {
      return false;
    }

    const normalizedQuery = normalizeName(cleanQuery);

    const existsInSuggestions = suggestions.some(
      tag => normalizeName(tag?.name) === normalizedQuery,
    );

    const existsInSelectedTags = selectedTags.some(
      tag => normalizeName(tag?.name) === normalizedQuery,
    );

    return existsInSuggestions || existsInSelectedTags;
  }, [cleanQuery, suggestions, selectedTags]);

  const canCreateNewTag =
    Boolean(cleanQuery) &&
    !searching &&
    !errorMessage &&
    !exactTagAlreadyExists;

  useEffect(() => {
    if (!cleanQuery) {
      searchRequestId.current += 1;

      setSuggestions([]);
      setSearching(false);
      setErrorMessage('');

      return;
    }

    const currentRequestId = searchRequestId.current + 1;

    searchRequestId.current = currentRequestId;

    const debounceTimer = setTimeout(async () => {
      try {
        setSearching(true);
        setErrorMessage('');

        const response = await api(
          `/api/ott/tags?q=${encodeURIComponent(cleanQuery)}`,
          {
            method: 'GET',
          },
        );

        if (searchRequestId.current !== currentRequestId) {
          return;
        }

        setSuggestions(normalizeTags(response));
      } catch (error) {
        if (searchRequestId.current !== currentRequestId) {
          return;
        }

        console.log('Tag search error:', error);

        setSuggestions([]);

        setErrorMessage(error?.message || 'Could not search tags.');
      } finally {
        if (searchRequestId.current === currentRequestId) {
          setSearching(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [cleanQuery]);

  function clearSearch() {
    searchRequestId.current += 1;

    setQuery('');
    setSuggestions([]);
    setSearching(false);
    setErrorMessage('');
  }

  async function addExistingTag(tag) {
    if (!courseId || savingTagKey !== null || removingId !== null) {
      return;
    }

    try {
      setSavingTagKey(`existing-${tag.id}`);
      setErrorMessage('');

      const response = await api(`/api/ott/ottcourses/${courseId}/tags`, {
        method: 'POST',
        body: JSON.stringify({
          tag_id: tag.id,
        }),
      });

      onChange(normalizeTags(response));

      clearSearch();
    } catch (error) {
      console.log('Add existing tag error:', error);

      setErrorMessage(error?.message || 'Could not add the selected tag.');
    } finally {
      setSavingTagKey(null);
    }
  }

  async function createAndAddTag() {
    const newTagName = query.trim();

    if (
      !courseId ||
      !newTagName ||
      exactTagAlreadyExists ||
      savingTagKey !== null ||
      removingId !== null
    ) {
      return;
    }

    try {
      setSavingTagKey('new-tag');
      setErrorMessage('');

      const response = await api(`/api/ott/ottcourses/${courseId}/tags`, {
        method: 'POST',
        body: JSON.stringify({
          name: newTagName,
        }),
      });

      onChange(normalizeTags(response));

      clearSearch();
    } catch (error) {
      console.log('Create tag error:', error);

      setErrorMessage(error?.message || 'Could not create the new tag.');
    } finally {
      setSavingTagKey(null);
    }
  }

  function confirmRemoveTag(tag) {
    Alert.alert('Remove Tag', `Remove "${tag.name}" from this course?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeTag(tag),
      },
    ]);
  }

  async function removeTag(tag) {
    if (!courseId || savingTagKey !== null || removingId !== null) {
      return;
    }

    try {
      setRemovingId(tag.id);
      setErrorMessage('');

      await api(`/api/ott/ottcourses/${courseId}/tags/${tag.id}`, {
        method: 'DELETE',
      });

      const updatedTags = selectedTags.filter(
        selectedTag => String(selectedTag?.id) !== String(tag.id),
      );

      onChange(updatedTags);
    } catch (error) {
      console.log('Remove tag error:', error);

      setErrorMessage(error?.message || 'Could not remove the selected tag.');
    } finally {
      setRemovingId(null);
    }
  }

  const hasSearchResult = availableSuggestions.length > 0 || canCreateNewTag;

  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>Tags</Text>

      <View style={styles.searchContainer}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search or create a tag..."
          placeholderTextColor={COLORS.MUTED}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={() => {
            if (canCreateNewTag) {
              createAndAddTag();
            }
          }}
          style={styles.searchInput}
        />

        {searching ? (
          <ActivityIndicator size="small" color={COLORS.BLUE} />
        ) : query.length > 0 ? (
          <Pressable
            onPress={clearSearch}
            hitSlop={10}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </Pressable>
        ) : (
          <Text style={styles.searchIcon}>⌕</Text>
        )}
      </View>

      {cleanQuery && !searching ? (
        <View style={styles.suggestionContainer}>
          {availableSuggestions.map(tag => {
            const saving = savingTagKey === `existing-${tag.id}`;

            return (
              <Pressable
                key={String(tag.id)}
                onPress={() => addExistingTag(tag)}
                disabled={savingTagKey !== null || removingId !== null}
                style={({ pressed }) => [
                  styles.suggestionRow,
                  pressed && styles.suggestionRowPressed,
                ]}
              >
                <View style={styles.suggestionInfo}>
                  <Text style={styles.suggestionName}>{tag.name}</Text>

                  <Text style={styles.suggestionId}>
                    Existing tag • ID: {tag.id}
                  </Text>
                </View>

                {saving ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT} />
                ) : (
                  <View style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Add</Text>
                  </View>
                )}
              </Pressable>
            );
          })}

          {canCreateNewTag ? (
            <Pressable
              onPress={createAndAddTag}
              disabled={savingTagKey !== null || removingId !== null}
              style={({ pressed }) => [
                styles.createRow,
                pressed && styles.suggestionRowPressed,
              ]}
            >
              <View style={styles.createIcon}>
                <Text style={styles.createIconText}>+</Text>
              </View>

              <View style={styles.suggestionInfo}>
                <Text style={styles.createTitle}>Create “{cleanQuery}”</Text>

                <Text style={styles.createDescription}>
                  Create a new tag and add it to this course
                </Text>
              </View>

              {savingTagKey === 'new-tag' ? (
                <ActivityIndicator size="small" color={COLORS.TEXT} />
              ) : null}
            </Pressable>
          ) : null}

          {!hasSearchResult && !errorMessage ? (
            <View style={styles.noResultContainer}>
              <Text style={styles.noResultText}>
                This tag is already added to the course.
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {selectedTags.length > 0 ? (
        <View style={styles.chipContainer}>
          {selectedTags.map(tag => {
            const removing = removingId === tag.id;

            return (
              <View key={String(tag.id)} style={styles.chip}>
                <Text style={styles.chipText} numberOfLines={1}>
                  {tag.name}
                </Text>

                <Pressable
                  onPress={() => confirmRemoveTag(tag)}
                  disabled={savingTagKey !== null || removingId !== null}
                  hitSlop={8}
                  style={styles.chipRemoveButton}
                >
                  {removing ? (
                    <ActivityIndicator size="small" color={COLORS.MUTED} />
                  ) : (
                    <Text style={styles.chipRemoveText}>×</Text>
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={styles.emptySelectedText}>
          No tags added to this course.
        </Text>
      )}
    </View>
  );
}
