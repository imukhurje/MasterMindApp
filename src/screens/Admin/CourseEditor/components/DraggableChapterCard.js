import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { styles, COLORS } from './DraggableChapterCard.styles';

function getMaterialIcon(type) {
  switch (String(type || '').toLowerCase()) {
    case 'pdf':
      return '📄';

    case 'youtube':
      return '▶️';

    case 'video':
      return '🎬';

    case 'quiz':
      return '🧩';

    case 'html':
      return '🌐';

    default:
      return '📎';
  }
}

function formatFileSize(sizeBytes) {
  const size = Number(sizeBytes);

  if (!Number.isFinite(size) || size <= 0) {
    return null;
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getMaterialPosition(material) {
  const position = Number(material?.position);

  if (Number.isFinite(position)) {
    return position;
  }

  return Number.MAX_SAFE_INTEGER;
}

function isChapterEnabled(chapter) {
  return chapter?.is_active === true || Number(chapter?.is_active) === 1;
}

export default function DraggableChapterCard({
  chapter,
  index,
  expanded,
  onToggle,
  onDragStart,
  onDragEnd,
  onSaveTitle,

  onToggleActive,
  statusUpdating = false,

  onOpen,
  onDelete,

  deleting = false,

  /*
   * This represents the
   * DraggableFlatList drag state,
   * NOT the chapter's is_active.
   */
  isDragging = false,

  dragDisabled,
}) {
  const currentTitle = String(chapter?.title || '');

  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [titleDraft, setTitleDraft] = useState(currentTitle);

  const [savingTitle, setSavingTitle] = useState(false);

  const [editError, setEditError] = useState('');

  const chapterIsActive = isChapterEnabled(chapter);

  const actionBusy = savingTitle || deleting || isDragging || statusUpdating;

  useEffect(() => {
    if (!isEditingTitle) {
      setTitleDraft(currentTitle);
    }
  }, [currentTitle, isEditingTitle]);

  const materials = useMemo(() => {
    const materialList = Array.isArray(chapter?.materials)
      ? chapter.materials
      : [];

    return [...materialList].sort(
      (firstMaterial, secondMaterial) =>
        getMaterialPosition(firstMaterial) -
        getMaterialPosition(secondMaterial),
    );
  }, [chapter?.materials]);

  const dragUnavailable =
    dragDisabled || isEditingTitle || savingTitle || statusUpdating;

  function handleDragStart() {
    if (dragUnavailable) {
      return;
    }

    onDragStart?.();
  }

  function handleDragEnd() {
    if (dragUnavailable) {
      return;
    }

    onDragEnd?.();
  }

  function startEditingTitle() {
    if (actionBusy) {
      return;
    }

    setTitleDraft(currentTitle);

    setEditError('');

    setIsEditingTitle(true);
  }

  function cancelEditingTitle() {
    if (savingTitle) {
      return;
    }

    setTitleDraft(currentTitle);

    setEditError('');

    setIsEditingTitle(false);
  }

  async function saveChapterTitle() {
    const cleanTitle = titleDraft.trim();

    if (!cleanTitle) {
      setEditError('Chapter title is required.');

      return;
    }

    if (cleanTitle === currentTitle.trim()) {
      setEditError('');

      setIsEditingTitle(false);

      return;
    }

    try {
      setSavingTitle(true);

      setEditError('');

      await onSaveTitle?.(chapter.id, cleanTitle);

      setIsEditingTitle(false);
    } catch (error) {
      console.log('Chapter title update error:', error);

      setEditError(error?.message || 'Could not update chapter title.');
    } finally {
      setSavingTitle(false);
    }
  }

  return (
    <View
      style={[
        styles.chapterCard,

        isDragging && styles.chapterCardActive,

        !chapterIsActive && styles.chapterCardInactive,
      ]}
    >
      <View style={styles.chapterHeader}>
        {/* Drag Handle */}

        <Pressable
          onPressIn={handleDragStart}
          onPressOut={handleDragEnd}
          disabled={dragUnavailable}
          style={({ pressed }) => [
            styles.dragHandle,

            isDragging && styles.dragHandleActive,

            dragUnavailable && styles.dragHandleDisabled,

            pressed && !dragUnavailable && styles.dragHandlePressed,
          ]}
        >
          {dragDisabled ? (
            <ActivityIndicator size="small" color={COLORS.MUTED} />
          ) : (
            <Text style={styles.dragHandleText}>☰</Text>
          )}
        </Pressable>

        {/* Expand / Collapse */}

        <Pressable
          onPress={onToggle}
          disabled={isDragging || isEditingTitle || statusUpdating}
          style={({ pressed }) => [
            styles.chapterHeaderMain,

            pressed && styles.chapterHeaderPressed,
          ]}
        >
          <View style={styles.chapterPosition}>
            <Text style={styles.chapterPositionText}>{index + 1}</Text>
          </View>

          <View style={styles.chapterInfo}>
            <Text style={styles.chapterTitle} numberOfLines={2}>
              {currentTitle || `Chapter ${index + 1}`}
            </Text>

            <View style={styles.chapterMetaRow}>
              <Text style={styles.chapterMaterialCount}>
                {materials.length}{' '}
                {materials.length === 1 ? 'material' : 'materials'}
              </Text>

              {!chapterIsActive ? (
                <View style={styles.inactiveBadge}>
                  <Text style={styles.inactiveBadgeText}>Inactive</Text>
                </View>
              ) : null}
            </View>
          </View>

          <Text style={styles.expandIcon}>{expanded ? '⌃' : '⌄'}</Text>
        </Pressable>
      </View>

      {/* Chapter Actions */}

      <View style={styles.chapterActions}>
        {/* Active / Inactive */}

        <Pressable
          onPress={onToggleActive}
          disabled={!onToggleActive || actionBusy || isEditingTitle}
          style={({ pressed }) => [
            styles.statusButton,

            chapterIsActive
              ? styles.statusButtonActive
              : styles.statusButtonInactive,

            pressed && !actionBusy && styles.actionButtonPressed,

            (!onToggleActive || actionBusy || isEditingTitle) &&
              styles.actionButtonDisabled,
          ]}
        >
          {statusUpdating ? (
            <ActivityIndicator size="small" color={COLORS.TEXT} />
          ) : (
            <>
              <Text
                style={[
                  styles.statusIcon,

                  chapterIsActive
                    ? styles.statusIconActive
                    : styles.statusIconInactive,
                ]}
              >
                {chapterIsActive ? '✓' : '○'}
              </Text>

              <Text
                style={[
                  styles.statusButtonText,

                  !chapterIsActive && styles.statusButtonTextInactive,
                ]}
              >
                {chapterIsActive ? 'Active' : 'Inactive'}
              </Text>
            </>
          )}
        </Pressable>

        {/* Edit */}

        <Pressable
          onPress={startEditingTitle}
          disabled={actionBusy || isEditingTitle}
          style={({ pressed }) => [
            styles.actionButton,

            styles.editButton,

            pressed && styles.actionButtonPressed,

            (actionBusy || isEditingTitle) && styles.actionButtonDisabled,
          ]}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </Pressable>

        {/* Open */}

        <Pressable
          onPress={onOpen}
          disabled={!onOpen || actionBusy}
          style={({ pressed }) => [
            styles.actionButton,

            styles.openButton,

            pressed && styles.actionButtonPressed,

            (!onOpen || actionBusy) && styles.actionButtonDisabled,
          ]}
        >
          <Text style={styles.actionButtonText}>Open</Text>
        </Pressable>

        {/* Delete */}

        <Pressable
          onPress={onDelete}
          disabled={!onDelete || actionBusy}
          style={({ pressed }) => [
            styles.actionButton,

            styles.deleteButton,

            pressed && styles.actionButtonPressed,

            (!onDelete || actionBusy) && styles.actionButtonDisabled,
          ]}
        >
          {deleting ? (
            <ActivityIndicator size="small" color={COLORS.TEXT} />
          ) : (
            <Text style={styles.actionButtonText}>Delete</Text>
          )}
        </Pressable>
      </View>

      {/* Inline Title Editor */}

      {isEditingTitle ? (
        <View style={styles.editContainer}>
          <Text style={styles.editLabel}>Chapter title</Text>

          <TextInput
            value={titleDraft}
            onChangeText={value => {
              setTitleDraft(value);

              if (editError) {
                setEditError('');
              }
            }}
            placeholder="Enter chapter title"
            placeholderTextColor={COLORS.MUTED}
            autoFocus
            editable={!savingTitle}
            returnKeyType="done"
            onSubmitEditing={saveChapterTitle}
            style={styles.titleInput}
          />

          {editError ? <Text style={styles.editError}>{editError}</Text> : null}

          <View style={styles.editActions}>
            <Pressable
              onPress={cancelEditingTitle}
              disabled={savingTitle}
              style={({ pressed }) => [
                styles.cancelButton,

                pressed && styles.actionButtonPressed,

                savingTitle && styles.actionButtonDisabled,
              ]}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={saveChapterTitle}
              disabled={savingTitle || !titleDraft.trim()}
              style={({ pressed }) => [
                styles.saveButton,

                pressed && styles.actionButtonPressed,

                (savingTitle || !titleDraft.trim()) &&
                  styles.actionButtonDisabled,
              ]}
            >
              {savingTitle ? (
                <ActivityIndicator size="small" color={COLORS.TEXT} />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </Pressable>
          </View>
        </View>
      ) : null}

      {/* Materials */}

      {expanded ? (
        <View style={styles.materialContainer}>
          {chapter?.description ? (
            <Text style={styles.chapterDescription}>{chapter.description}</Text>
          ) : null}

          {materials.length === 0 ? (
            <Text style={styles.noMaterialText}>
              No materials in this chapter.
            </Text>
          ) : (
            materials.map((material, materialIndex) => {
              const fileSize = formatFileSize(material?.size_bytes);

              return (
                <View
                  key={String(material?.id || materialIndex)}
                  style={styles.materialRow}
                >
                  <View style={styles.materialIconContainer}>
                    <Text style={styles.materialIcon}>
                      {getMaterialIcon(material?.type)}
                    </Text>
                  </View>

                  <View style={styles.materialInfo}>
                    <Text style={styles.materialTitle} numberOfLines={2}>
                      {material?.title || 'Untitled material'}
                    </Text>

                    <View style={styles.materialMetaRow}>
                      <Text style={styles.materialType}>
                        {String(material?.type || 'file').toUpperCase()}
                      </Text>

                      {fileSize ? (
                        <Text style={styles.materialSize}>• {fileSize}</Text>
                      ) : null}

                      {material?.is_preview ? (
                        <Text style={styles.previewBadge}>Preview</Text>
                      ) : null}
                    </View>

                    {material?.external_url ? (
                      <Text style={styles.externalUrl} numberOfLines={1}>
                        {material.external_url}
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            })
          )}
        </View>
      ) : null}
    </View>
  );
}
