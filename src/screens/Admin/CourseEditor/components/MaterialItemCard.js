import React, { useRef } from 'react';

import {
  Pressable,
  Text,
  useWindowDimensions,
  View,
  ActivityIndicator,
} from 'react-native';

import { styles } from './MaterialItemCard.styles';

function getMaterialIcon(type) {
  switch (String(type || '').toLowerCase()) {
    case 'pdf':
      return '📄';

    case 'youtube':
      return '▶️';

    case 'video':
      return '🎬';

    case 'html':
      return '🌐';

    case 'quiz':
      return '🧩';

    default:
      return '📎';
  }
}

function getMaterialTypeLabel(type) {
  return String(type || 'file')
    .trim()
    .toUpperCase();
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

export default function MaterialItemCard({
  material,
  index,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  isActive = false,
  reorderDisabled = false,
  deleting = false,
}) {
  const { width } = useWindowDimensions();

  const isCompactScreen = width < 520;

  const dragStartedRef = useRef(false);

  const fileSize = formatFileSize(material?.size_bytes);

  function handleLongPress() {
    if (reorderDisabled) {
      return;
    }

    dragStartedRef.current = true;

    onDragStart?.();
  }

  function handlePressOut() {
    if (!dragStartedRef.current) {
      return;
    }

    dragStartedRef.current = false;

    onDragEnd?.();
  }

  return (
    <View style={[styles.card, isActive && styles.cardActive]}>
      <View style={[styles.cardRow, isCompactScreen && styles.cardRowCompact]}>
        <Pressable
          onLongPress={handleLongPress}
          onPressOut={handlePressOut}
          delayLongPress={250}
          disabled={reorderDisabled}
          style={({ pressed }) => [
            styles.dragTouchArea,

            isCompactScreen && styles.dragTouchAreaCompact,

            pressed && !reorderDisabled && styles.dragTouchAreaPressed,

            isActive && styles.dragTouchAreaActive,

            reorderDisabled && styles.dragTouchAreaDisabled,
          ]}
        >
          <View style={styles.materialIconContainer}>
            <Text style={styles.materialIcon}>
              {getMaterialIcon(material?.type)}
            </Text>
          </View>

          <View style={styles.materialInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.materialTitle} numberOfLines={2}>
                {material?.title || `Material ${index + 1}`}
              </Text>

              <View style={styles.dragHandleIndicator}>
                <Text style={styles.dragHandleIndicatorText}>☰</Text>
              </View>
            </View>

            <View style={styles.materialMetaRow}>
              <Text style={styles.materialType}>
                {getMaterialTypeLabel(material?.type)}
              </Text>

              {fileSize ? (
                <Text style={styles.materialSize}>• {fileSize}</Text>
              ) : null}

              {material?.is_preview ? (
                <Text style={styles.previewLabel}>Preview</Text>
              ) : null}
            </View>

            {material?.external_url ? (
              <Text style={styles.externalUrl} numberOfLines={1}>
                {material.external_url}
              </Text>
            ) : null}
          </View>
        </Pressable>

        {!isCompactScreen ? (
          <MaterialActions
            onEdit={onEdit}
            onDelete={onDelete}
            deleting={deleting}
            disabled={isActive || reorderDisabled || deleting}
          />
        ) : null}
      </View>

      {isCompactScreen ? (
        <View style={styles.mobileActions}>
          <MaterialActions
            onEdit={onEdit}
            onDelete={onDelete}
            deleting={deleting}
            disabled={isActive || reorderDisabled || deleting}
          />
        </View>
      ) : null}
    </View>
  );
}

function MaterialActions({ onEdit, onDelete, deleting, disabled }) {
  return (
    <View style={styles.actions}>
      <Pressable
        onPress={onEdit}
        disabled={disabled}
        style={({ pressed }) => [
          styles.editButton,

          pressed && styles.buttonPressed,

          disabled && styles.actionButtonDisabled,
        ]}
      >
        <Text style={styles.actionButtonText}>Edit</Text>
      </Pressable>

      <Pressable
        onPress={onDelete}
        disabled={disabled}
        style={({ pressed }) => [
          styles.deleteButton,

          pressed && styles.buttonPressed,

          disabled && styles.actionButtonDisabled,
        ]}
      >
        {deleting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.actionButtonText}>Delete</Text>
        )}
      </Pressable>
    </View>
  );
}
