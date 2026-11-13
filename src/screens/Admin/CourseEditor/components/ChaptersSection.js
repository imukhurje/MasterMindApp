import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  Text,
  View,
  Pressable,
} from 'react-native';

import DraggableFlatList from 'react-native-draggable-flatlist';
import { useNavigation } from '@react-navigation/native';

import { api } from '../../../../api/client';

import AddChapterModal from './AddChapterModal';
import DraggableChapterCard from './DraggableChapterCard';

import { styles, COLORS } from './ChaptersSection.styles';

function getChapterPosition(chapter) {
  const position = Number(chapter?.position);

  if (Number.isFinite(position) && position > 0) {
    return position;
  }

  return Number.MAX_SAFE_INTEGER;
}

function sortChapters(chapters) {
  if (!Array.isArray(chapters)) {
    return [];
  }

  return [...chapters].sort((firstChapter, secondChapter) => {
    const positionDifference =
      getChapterPosition(firstChapter) - getChapterPosition(secondChapter);

    if (positionDifference !== 0) {
      return positionDifference;
    }

    return Number(firstChapter?.id || 0) - Number(secondChapter?.id || 0);
  });
}

function normalizeChapterPositions(chapters) {
  return chapters.map((chapter, index) => ({
    ...chapter,
    position: index + 1,
  }));
}

function getChaptersFromResponse(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.chapters)) {
    return response.chapters;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return null;
}

function mergeServerChapters(serverChapters, localChapters) {
  if (
    !Array.isArray(serverChapters) ||
    serverChapters.length !== localChapters.length
  ) {
    return localChapters;
  }

  const localChapterMap = new Map(
    localChapters.map(chapter => [String(chapter.id), chapter]),
  );

  const hasAllChapters = serverChapters.every(chapter =>
    localChapterMap.has(String(chapter?.id)),
  );

  if (!hasAllChapters) {
    return localChapters;
  }

  const mergedChapters = serverChapters.map(serverChapter => ({
    ...localChapterMap.get(String(serverChapter.id)),

    ...serverChapter,
  }));

  return normalizeChapterPositions(sortChapters(mergedChapters));
}

function isChapterEnabled(chapter) {
  return chapter?.is_active === true || Number(chapter?.is_active) === 1;
}

export default function ChaptersSection({
  courseId,
  chapters = [],
  onChaptersChange,
  headerComponent,
  refreshing = false,
  onRefresh,
}) {
  const navigation = useNavigation();

  const dragListRef = useRef(null);

  const courseHeaderHeightRef = useRef(0);

  const currentScrollOffsetRef = useRef(0);

  const isDraggingRef = useRef(false);

  const [addChapterModalVisible, setAddChapterModalVisible] = useState(false);

  const [deletingChapterId, setDeletingChapterId] = useState(null);

  const [orderedChapters, setOrderedChapters] = useState([]);

  const [expandedChapterIds, setExpandedChapterIds] = useState({});

  const [reorderSaving, setReorderSaving] = useState(false);

  const [updatingChapterId, setUpdatingChapterId] = useState(null);

  /*
   * Separate state for chapter
   * Active / Inactive update.
   */
  const [updatingActiveChapterId, setUpdatingActiveChapterId] = useState(null);

  useEffect(() => {
    const sortedChapters = normalizeChapterPositions(sortChapters(chapters));

    setOrderedChapters(sortedChapters);
  }, [chapters]);

  function toggleChapter(chapterId) {
    if (reorderSaving) {
      return;
    }

    setExpandedChapterIds(previous => ({
      ...previous,

      [chapterId]: !previous[chapterId],
    }));
  }

  const chapterCountLabel = useMemo(() => {
    const count = orderedChapters.length;

    return `${count} ${count === 1 ? 'chapter' : 'chapters'}`;
  }, [orderedChapters.length]);

  /*
   * Reorder chapters.
   */
  const handleReordered = useCallback(
    async ({ data, from, to }) => {
      isDraggingRef.current = false;

      if (
        reorderSaving ||
        updatingActiveChapterId !== null ||
        !courseId ||
        from === to
      ) {
        return;
      }

      const previousOrder = orderedChapters.map(chapter => ({
        ...chapter,
      }));

      const reorderedChapters = normalizeChapterPositions(
        Array.isArray(data) ? data : orderedChapters,
      );

      setOrderedChapters(reorderedChapters);

      onChaptersChange?.(reorderedChapters);

      setReorderSaving(true);

      try {
        const chapterIds = reorderedChapters.map(chapter => chapter.id);

        console.log('Chapter reorder payload:', chapterIds);

        const response = await api(
          `/api/ott/ottcourses/${courseId}/chapters/reorder`,
          {
            method: 'POST',

            body: JSON.stringify({
              order: chapterIds,
            }),
          },
        );

        const serverChapters = getChaptersFromResponse(response);

        if (serverChapters) {
          const finalChapters = mergeServerChapters(
            serverChapters,
            reorderedChapters,
          );

          setOrderedChapters(finalChapters);

          onChaptersChange?.(finalChapters);
        }
      } catch (error) {
        console.log('Chapter reorder API error:', error);

        setOrderedChapters(previousOrder);

        onChaptersChange?.(previousOrder);

        Alert.alert(
          'Could not reorder chapters',
          error?.message || 'Previous chapter order has been restored.',
        );
      } finally {
        setReorderSaving(false);
      }
    },
    [
      courseId,
      onChaptersChange,
      orderedChapters,
      reorderSaving,
      updatingActiveChapterId,
    ],
  );

  /*
   * Update chapter title.
   */
  const handleSaveChapterTitle = useCallback(
    async (chapterId, newTitle) => {
      const cleanTitle = String(newTitle || '').trim();

      if (!chapterId) {
        throw new Error('Chapter ID was not provided.');
      }

      if (!cleanTitle) {
        throw new Error('Chapter title is required.');
      }

      if (updatingChapterId !== null || updatingActiveChapterId !== null) {
        throw new Error('Another chapter is currently being updated.');
      }

      setUpdatingChapterId(chapterId);

      try {
        const response = await api(`/api/ott/chapters/${chapterId}`, {
          method: 'PUT',

          body: JSON.stringify({
            title: cleanTitle,
          }),
        });

        const responseChapter =
          response && typeof response === 'object' ? response : {};

        /*
         * API response may not include
         * materials, so preserve them.
         */
        const updatedChapters = orderedChapters.map(chapter => {
          if (String(chapter?.id) !== String(chapterId)) {
            return chapter;
          }

          return {
            ...chapter,
            ...responseChapter,

            title: String(responseChapter?.title || cleanTitle),

            materials: Array.isArray(responseChapter?.materials)
              ? responseChapter.materials
              : chapter?.materials || [],
          };
        });

        setOrderedChapters(updatedChapters);

        onChaptersChange?.(updatedChapters);

        return responseChapter;
      } catch (error) {
        console.log('Chapter update API error:', error);

        throw error;
      } finally {
        setUpdatingChapterId(null);
      }
    },
    [
      onChaptersChange,
      orderedChapters,
      updatingChapterId,
      updatingActiveChapterId,
    ],
  );

  /*
   * Toggle chapter Active / Inactive.
   *
   * PUT /api/ott/chapters/{id}
   *
   * {
   *   is_active: true / false
   * }
   */
  const handleToggleChapterActive = useCallback(
    async chapter => {
      if (
        !chapter?.id ||
        updatingActiveChapterId !== null ||
        updatingChapterId !== null ||
        deletingChapterId !== null ||
        reorderSaving
      ) {
        return;
      }

      const currentStatus = isChapterEnabled(chapter);

      const nextStatus = !currentStatus;

      const chapterId = chapter.id;

      try {
        setUpdatingActiveChapterId(chapterId);

        const response = await api(`/api/ott/chapters/${chapterId}`, {
          method: 'PUT',

          body: JSON.stringify({
            is_active: nextStatus,
          }),
        });

        const responseChapter =
          response && typeof response === 'object' ? response : {};

        /*
         * Update only this chapter.
         * Preserve materials because
         * status PUT response does not
         * necessarily include them.
         */
        const updatedChapters = orderedChapters.map(currentChapter => {
          if (String(currentChapter?.id) !== String(chapterId)) {
            return currentChapter;
          }

          return {
            ...currentChapter,
            ...responseChapter,

            is_active: responseChapter?.is_active ?? (nextStatus ? 1 : 0),

            materials: Array.isArray(responseChapter?.materials)
              ? responseChapter.materials
              : currentChapter?.materials || [],
          };
        });

        setOrderedChapters(updatedChapters);

        onChaptersChange?.(updatedChapters);
      } catch (error) {
        console.log('Chapter active status update error:', error);

        Alert.alert(
          nextStatus
            ? 'Could not activate chapter'
            : 'Could not deactivate chapter',
          error?.message || 'The chapter status could not be updated.',
        );
      } finally {
        setUpdatingActiveChapterId(null);
      }
    },
    [
      deletingChapterId,
      onChaptersChange,
      orderedChapters,
      reorderSaving,
      updatingActiveChapterId,
      updatingChapterId,
    ],
  );

  const handleOpenAddChapter = useCallback(() => {
    if (
      reorderSaving ||
      updatingChapterId !== null ||
      updatingActiveChapterId !== null ||
      deletingChapterId !== null
    ) {
      return;
    }

    setAddChapterModalVisible(true);
  }, [
    deletingChapterId,
    reorderSaving,
    updatingChapterId,
    updatingActiveChapterId,
  ]);

  const handleCloseAddChapter = useCallback(() => {
    setAddChapterModalVisible(false);
  }, []);

  const handleChapterCreated = useCallback(
    createdChapter => {
      if (!createdChapter?.id) {
        return;
      }

      setOrderedChapters(previousChapters => {
        const chapterWithMaterials = {
          ...createdChapter,

          /*
           * A newly created chapter is
           * Active by default.
           *
           * If backend returns its own
           * value, use that value.
           */
          is_active: createdChapter?.is_active ?? 1,

          materials: Array.isArray(createdChapter?.materials)
            ? createdChapter.materials
            : [],
        };

        const updatedChapters = normalizeChapterPositions([
          ...previousChapters,
          chapterWithMaterials,
        ]);

        onChaptersChange?.(updatedChapters);

        return updatedChapters;
      });

      setAddChapterModalVisible(false);
    },
    [onChaptersChange],
  );

  /*
   * Delete chapter.
   */
  const handleDeleteChapter = useCallback(
    chapter => {
      if (
        !chapter?.id ||
        deletingChapterId !== null ||
        updatingChapterId !== null ||
        updatingActiveChapterId !== null ||
        reorderSaving
      ) {
        return;
      }

      Alert.alert(
        'Delete Chapter',
        `Are you sure you want to delete "${chapter.title}"?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },

          {
            text: 'Delete',
            style: 'destructive',

            onPress: async () => {
              try {
                setDeletingChapterId(chapter.id);

                await api(`/api/ott/chapters/${chapter.id}`, {
                  method: 'DELETE',
                });

                const updatedChapters = normalizeChapterPositions(
                  orderedChapters.filter(
                    currentChapter =>
                      String(currentChapter?.id) !== String(chapter.id),
                  ),
                );

                setOrderedChapters(updatedChapters);

                onChaptersChange?.(updatedChapters);

                setExpandedChapterIds(previous => {
                  const updatedExpandedState = {
                    ...previous,
                  };

                  delete updatedExpandedState[chapter.id];

                  return updatedExpandedState;
                });
              } catch (error) {
                console.log('Chapter delete API error:', error);

                Alert.alert(
                  'Could not delete chapter',
                  error?.message || 'The chapter could not be deleted.',
                );
              } finally {
                setDeletingChapterId(null);
              }
            },
          },
        ],
      );
    },
    [
      deletingChapterId,
      updatingChapterId,
      updatingActiveChapterId,
      reorderSaving,
      orderedChapters,
      onChaptersChange,
    ],
  );

  const handleDragBegin = useCallback(() => {
    isDraggingRef.current = true;

    const minimumOffset = Math.max(0, courseHeaderHeightRef.current);

    /*
     * When dragging starts,
     * keep the Course Builder
     * header outside the
     * draggable area.
     */
    if (currentScrollOffsetRef.current < minimumOffset) {
      currentScrollOffsetRef.current = minimumOffset;

      requestAnimationFrame(() => {
        dragListRef.current?.scrollToOffset?.({
          offset: minimumOffset,

          animated: false,
        });
      });
    }
  }, []);

  const handleDragScroll = useCallback(offset => {
    const nextOffset = Number(offset) || 0;

    if (!isDraggingRef.current) {
      currentScrollOffsetRef.current = nextOffset;

      return;
    }

    const minimumOffset = Math.max(0, courseHeaderHeightRef.current);

    if (nextOffset < minimumOffset) {
      currentScrollOffsetRef.current = minimumOffset;

      dragListRef.current?.scrollToOffset?.({
        offset: minimumOffset,

        animated: false,
      });

      return;
    }

    currentScrollOffsetRef.current = nextOffset;
  }, []);

  const renderChapterItem = useCallback(
    ({ item, drag, isActive, getIndex }) => {
      const index = getIndex?.() ?? 0;

      /*
       * `isActive` above belongs to
       * DraggableFlatList. It means
       * this row is currently being
       * dragged.
       */
      const isDragging = Boolean(isActive);

      const dragDisabled =
        reorderSaving ||
        refreshing ||
        updatingChapterId !== null ||
        updatingActiveChapterId !== null ||
        deletingChapterId !== null;

      return (
        <View style={styles.chapterWrapper}>
          <DraggableChapterCard
            chapter={item}
            index={index}
            expanded={Boolean(expandedChapterIds[item.id])}
            onToggle={() => toggleChapter(item.id)}
            onDragStart={dragDisabled ? undefined : drag}
            onDragEnd={() => {}}
            onSaveTitle={handleSaveChapterTitle}
            onToggleActive={() => handleToggleChapterActive(item)}
            statusUpdating={updatingActiveChapterId === item.id}
            onOpen={() => {
              navigation.navigate('AdminChapterMaterialsEditor', {
                courseId,

                chapter: item,
              });
            }}
            onDelete={() => handleDeleteChapter(item)}
            deleting={deletingChapterId === item.id}
            isDragging={isDragging}
            dragDisabled={dragDisabled}
          />
        </View>
      );
    },
    [
      expandedChapterIds,
      reorderSaving,
      refreshing,
      updatingChapterId,
      updatingActiveChapterId,
      deletingChapterId,
      handleSaveChapterTitle,
      handleToggleChapterActive,
      handleDeleteChapter,
      navigation,
      courseId,
    ],
  );

  const renderListHeader = useCallback(() => {
    return (
      <View style={styles.listHeader} collapsable={false}>
        <View
          collapsable={false}
          onLayout={event => {
            courseHeaderHeightRef.current = event.nativeEvent.layout.height;
          }}
        >
          {headerComponent}
        </View>

        <View style={styles.chaptersHeader}>
          <View style={styles.chaptersHeaderText}>
            <Text style={styles.chaptersTitle}>Chapters</Text>

            <Text style={styles.chaptersCount}>{chapterCountLabel}</Text>
          </View>

          <View style={styles.chapterHeaderActions}>
            <Pressable
              onPress={handleOpenAddChapter}
              disabled={
                reorderSaving ||
                updatingChapterId !== null ||
                updatingActiveChapterId !== null ||
                deletingChapterId !== null
              }
              style={({ pressed }) => [
                styles.addChapterButton,

                pressed && styles.addChapterButtonPressed,

                (reorderSaving ||
                  updatingChapterId !== null ||
                  updatingActiveChapterId !== null ||
                  deletingChapterId !== null) &&
                  styles.addChapterButtonDisabled,
              ]}
            >
              <Text style={styles.addChapterButtonText}>+ Add Chapter</Text>
            </Pressable>

            <View style={styles.dragHintBadge}>
              <Text style={styles.dragHintIcon}>☰</Text>

              <Text style={styles.dragHintText}>Hold and drag</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }, [
    headerComponent,
    chapterCountLabel,
    reorderSaving,
    handleOpenAddChapter,
    updatingChapterId,
    updatingActiveChapterId,
    deletingChapterId,
  ]);

  const renderEmptyComponent = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📚</Text>

        <Text style={styles.emptyTitle}>No chapters found</Text>
      </View>
    );
  }, []);

  const renderFooter = useCallback(() => {
    return <View style={styles.footerSpace} />;
  }, []);

  return (
    <View style={styles.container}>
      <DraggableFlatList
        ref={dragListRef}
        data={orderedChapters}
        keyExtractor={item => String(item.id)}
        renderItem={renderChapterItem}
        onDragBegin={handleDragBegin}
        onDragEnd={handleReordered}
        onRelease={() => {
          /*
           * Keep boundary active
           * until drop animation
           * finishes.
           */
        }}
        onScrollOffsetChange={handleDragScroll}
        dragItemOverflow={false}
        autoscrollThreshold={55}
        autoscrollSpeed={80}
        containerStyle={styles.dragListContainer}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderListHeader()}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        extraData={{
          expandedChapterIds,

          reorderSaving,

          refreshing,

          updatingChapterId,

          updatingActiveChapterId,

          deletingChapterId,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            enabled={
              !reorderSaving &&
              updatingChapterId === null &&
              updatingActiveChapterId === null &&
              deletingChapterId === null
            }
            tintColor={COLORS.BLUE}
            colors={[COLORS.BLUE]}
          />
        }
      />

      <AddChapterModal
        visible={addChapterModalVisible}
        courseId={courseId}
        onClose={handleCloseAddChapter}
        onCreated={handleChapterCreated}
      />
    </View>
  );
}
