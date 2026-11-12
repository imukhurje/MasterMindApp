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

import { styles, COLORS } from './ClassGroupsEditor.styles';

function normalizeClassGroups(response) {
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

export default function ClassGroupsEditor({
  courseId,
  selectedClassGroups = [],
  onChange,
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');

  const searchRequestId = useRef(0);

  const selectedIds = useMemo(() => {
    return new Set(selectedClassGroups.map(item => String(item?.id)));
  }, [selectedClassGroups]);

  const availableSuggestions = useMemo(() => {
    return suggestions.filter(item => !selectedIds.has(String(item?.id)));
  }, [suggestions, selectedIds]);

  useEffect(() => {
    const cleanQuery = query.trim();

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
          `/api/ott/classgroups?q=${encodeURIComponent(cleanQuery)}`,
          {
            method: 'GET',
          },
        );

        if (searchRequestId.current !== currentRequestId) {
          return;
        }

        setSuggestions(normalizeClassGroups(response));
      } catch (error) {
        if (searchRequestId.current !== currentRequestId) {
          return;
        }

        console.log('Class group search error:', error);

        setSuggestions([]);

        setErrorMessage(error?.message || 'Could not search classes.');
      } finally {
        if (searchRequestId.current === currentRequestId) {
          setSearching(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [query]);

  async function addClassGroup(classGroup) {
    if (!courseId || addingId || removingId) {
      return;
    }

    try {
      setAddingId(classGroup.id);
      setErrorMessage('');

      const response = await api(
        `/api/ott/ottcourses/${courseId}/classgroups`,
        {
          method: 'POST',
          body: JSON.stringify({
            class_group_id: classGroup.id,
          }),
        },
      );

      const updatedClassGroups = normalizeClassGroups(response);

      onChange(updatedClassGroups);

      setQuery('');
      setSuggestions([]);
    } catch (error) {
      console.log('Add class group error:', error);

      setErrorMessage(error?.message || 'Could not add the selected class.');
    } finally {
      setAddingId(null);
    }
  }

  function requestRemoveClassGroup(classGroup) {
    Alert.alert(
      'Remove Class',
      `Remove "${classGroup.name}" from this course?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeClassGroup(classGroup),
        },
      ],
    );
  }

  async function removeClassGroup(classGroup) {
    if (!courseId || addingId || removingId) {
      return;
    }

    try {
      setRemovingId(classGroup.id);
      setErrorMessage('');

      await api(
        `/api/ott/ottcourses/${courseId}/classgroups/${classGroup.id}`,
        {
          method: 'DELETE',
        },
      );

      const updatedClassGroups = selectedClassGroups.filter(
        item => String(item?.id) !== String(classGroup.id),
      );

      onChange(updatedClassGroups);
    } catch (error) {
      console.log('Remove class group error:', error);

      setErrorMessage(error?.message || 'Could not remove the selected class.');
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>Classes</Text>

      <View style={styles.searchContainer}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Type to search..."
          placeholderTextColor={COLORS.MUTED}
          autoCapitalize="words"
          autoCorrect={false}
          style={styles.searchInput}
        />

        {searching ? (
          <ActivityIndicator size="small" color={COLORS.BLUE} />
        ) : query.length > 0 ? (
          <Pressable
            onPress={() => {
              setQuery('');
              setSuggestions([]);
            }}
            hitSlop={10}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </Pressable>
        ) : (
          <Text style={styles.searchIcon}>⌕</Text>
        )}
      </View>

      {query.trim() && !searching ? (
        <View style={styles.suggestionContainer}>
          {availableSuggestions.length > 0 ? (
            availableSuggestions.map(item => {
              const isAdding = addingId === item.id;

              return (
                <Pressable
                  key={String(item.id)}
                  onPress={() => addClassGroup(item)}
                  disabled={Boolean(addingId) || Boolean(removingId)}
                  style={({ pressed }) => [
                    styles.suggestionRow,
                    pressed && styles.suggestionRowPressed,
                  ]}
                >
                  <View style={styles.suggestionInfo}>
                    <Text style={styles.suggestionName}>{item.name}</Text>

                    <Text style={styles.suggestionId}>ID: {item.id}</Text>
                  </View>

                  {isAdding ? (
                    <ActivityIndicator size="small" color={COLORS.TEXT} />
                  ) : (
                    <View style={styles.addButton}>
                      <Text style={styles.addButtonText}>+ Add</Text>
                    </View>
                  )}
                </Pressable>
              );
            })
          ) : (
            <View style={styles.noResultContainer}>
              <Text style={styles.noResultText}>No new class found.</Text>
            </View>
          )}
        </View>
      ) : null}

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {selectedClassGroups.length > 0 ? (
        <View style={styles.chipContainer}>
          {selectedClassGroups.map(classGroup => {
            const isRemoving = removingId === classGroup.id;

            return (
              <View key={String(classGroup.id)} style={styles.chip}>
                <Text style={styles.chipText} numberOfLines={1}>
                  {classGroup.name}
                </Text>

                <Pressable
                  onPress={() => requestRemoveClassGroup(classGroup)}
                  disabled={Boolean(addingId) || Boolean(removingId)}
                  hitSlop={8}
                  style={styles.chipRemoveButton}
                >
                  {isRemoving ? (
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
          No classes added to this course.
        </Text>
      )}
    </View>
  );
}
