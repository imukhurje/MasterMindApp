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

import { styles, COLORS } from './CategoriesEditor.styles';

function normalizeCategories(response) {
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

export default function CategoriesEditor({
  courseId,
  selectedCategories = [],
  onChange,
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');

  const searchRequestId = useRef(0);

  const selectedCategoryIds = useMemo(() => {
    return new Set(selectedCategories.map(category => String(category?.id)));
  }, [selectedCategories]);

  const availableSuggestions = useMemo(() => {
    return suggestions.filter(
      category => !selectedCategoryIds.has(String(category?.id)),
    );
  }, [suggestions, selectedCategoryIds]);

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
          `/api/ott/categories?q=${encodeURIComponent(cleanQuery)}`,
          {
            method: 'GET',
          },
        );

        // পুরোনো search response যেন নতুন result overwrite না করে
        if (searchRequestId.current !== currentRequestId) {
          return;
        }

        setSuggestions(normalizeCategories(response));
      } catch (error) {
        if (searchRequestId.current !== currentRequestId) {
          return;
        }

        console.log('Category search error:', error);

        setSuggestions([]);

        setErrorMessage(error?.message || 'Could not search categories.');
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

  async function addCategory(category) {
    if (!courseId || addingId !== null || removingId !== null) {
      return;
    }

    try {
      setAddingId(category.id);
      setErrorMessage('');

      const response = await api(`/api/ott/ottcourses/${courseId}/categories`, {
        method: 'POST',
        body: JSON.stringify({
          category_id: category.id,
        }),
      });

      // POST response-এ complete updated category array আসছে
      const updatedCategories = normalizeCategories(response);

      onChange(updatedCategories);

      setQuery('');
      setSuggestions([]);
    } catch (error) {
      console.log('Add category error:', error);

      setErrorMessage(error?.message || 'Could not add the selected category.');
    } finally {
      setAddingId(null);
    }
  }

  function confirmRemoveCategory(category) {
    Alert.alert(
      'Remove Category',
      `Remove "${category.name}" from this course?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeCategory(category),
        },
      ],
    );
  }

  async function removeCategory(category) {
    if (!courseId || addingId !== null || removingId !== null) {
      return;
    }

    try {
      setRemovingId(category.id);
      setErrorMessage('');

      await api(`/api/ott/ottcourses/${courseId}/categories/${category.id}`, {
        method: 'DELETE',
      });

      // DELETE successful হলে locally category remove
      const updatedCategories = selectedCategories.filter(
        selectedCategory =>
          String(selectedCategory?.id) !== String(category.id),
      );

      onChange(updatedCategories);
    } catch (error) {
      console.log('Remove category error:', error);

      setErrorMessage(
        error?.message || 'Could not remove the selected category.',
      );
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>Categories</Text>

      <View style={styles.searchContainer}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Type to search..."
          placeholderTextColor={COLORS.MUTED}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="search"
          style={styles.searchInput}
        />

        {searching ? (
          <ActivityIndicator size="small" color={COLORS.BLUE} />
        ) : query.length > 0 ? (
          <Pressable
            onPress={() => {
              searchRequestId.current += 1;

              setQuery('');
              setSuggestions([]);
              setErrorMessage('');
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
            availableSuggestions.map(category => {
              const isAdding = addingId === category.id;

              return (
                <Pressable
                  key={String(category.id)}
                  onPress={() => addCategory(category)}
                  disabled={addingId !== null || removingId !== null}
                  style={({ pressed }) => [
                    styles.suggestionRow,
                    pressed && styles.suggestionRowPressed,
                  ]}
                >
                  <View style={styles.suggestionInfo}>
                    <Text style={styles.suggestionName}>{category.name}</Text>

                    <Text style={styles.suggestionId}>ID: {category.id}</Text>
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
              <Text style={styles.noResultText}>No new category found.</Text>
            </View>
          )}
        </View>
      ) : null}

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {selectedCategories.length > 0 ? (
        <View style={styles.chipContainer}>
          {selectedCategories.map(category => {
            const isRemoving = removingId === category.id;

            return (
              <View key={String(category.id)} style={styles.chip}>
                <Text style={styles.chipText} numberOfLines={1}>
                  {category.name}
                </Text>

                <Pressable
                  onPress={() => confirmRemoveCategory(category)}
                  disabled={addingId !== null || removingId !== null}
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
          No categories added to this course.
        </Text>
      )}
    </View>
  );
}
