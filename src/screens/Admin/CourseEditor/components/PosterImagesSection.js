import React, { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';

import { api } from '../../../../api/client';

import { styles } from './PosterImagesSection.styles';

const IMAGE_TYPE_OPTIONS = [
  {
    value: 1,
    title: 'Listing Image',
    description: '1:1 — preferred 400×400',
  },
  {
    value: 2,
    title: 'Banner Image',
    description: 'Wide promotional banner image',
  },
  {
    value: 3,
    title: 'Detail Page Image',
    description: '16:9 — preferred 720×405',
  },
];

function getImageTypeOption(type) {
  const numericType = Number(type);

  return (
    IMAGE_TYPE_OPTIONS.find(option => option.value === numericType) || null
  );
}

function formatFileSize(size) {
  const numericSize = Number(size);

  if (!Number.isFinite(numericSize) || numericSize <= 0) {
    return '';
  }

  if (numericSize < 1024) {
    return `${numericSize} B`;
  }

  if (numericSize < 1024 * 1024) {
    return `${Math.round(numericSize / 1024)} KB`;
  }

  return `${(numericSize / (1024 * 1024)).toFixed(1)} MB`;
}

function getExistingImageName(image, index, courseTitle) {
  if (image?.name) {
    return image.name;
  }

  const imagePath = image?.path || image?.public_url || image?.displayUrl || '';

  const pathParts = String(imagePath).split('/');
  const fileName = pathParts[pathParts.length - 1];

  return fileName || courseTitle || `Course Image ${index + 1}`;
}

export default function PosterImagesSection({
  courseId,
  images = [],
  courseTitle = '',
  onImagesChange,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [pickingImages, setPickingImages] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [updatingImageTypeId, setUpdatingImageTypeId] = useState(null);

  /*
   * typeTarget:
   * {
   *   kind: 'existing' | 'pending',
   *   imageId?: number,
   *   fileKey?: string,
   *   currentType?: number
   * }
   */
  const [typeTarget, setTypeTarget] = useState(null);

  const busy = pickingImages || uploadingImages || updatingImageTypeId !== null;

  async function handlePickImages() {
    if (busy || !courseId) {
      return;
    }

    try {
      setPickingImages(true);

      const pickedFiles = await pick({
        type: [types.images],
        allowMultiSelection: true,
      });

      const createdAt = Date.now();

      const normalizedFiles = pickedFiles.map((file, index) => ({
        ...file,

        key: `${createdAt}-${index}-${file.uri}`,

        /*
         * Listing image is the default type.
         * The user can change it before uploading.
         */
        imageType: 1,
      }));

      setSelectedFiles(previousFiles => [...previousFiles, ...normalizedFiles]);
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      console.log('Image picker error:', error);

      Alert.alert(
        'Could not select images',
        error?.message || 'The selected images could not be opened.',
      );
    } finally {
      setPickingImages(false);
    }
  }

  function handleRemovePendingFile(fileKey) {
    if (uploadingImages) {
      return;
    }

    setSelectedFiles(previousFiles =>
      previousFiles.filter(file => file.key !== fileKey),
    );
  }

  function handleClearPendingFiles() {
    if (uploadingImages) {
      return;
    }

    setSelectedFiles([]);
  }

  function openPendingTypeSelector(file) {
    if (busy) {
      return;
    }

    setTypeTarget({
      kind: 'pending',
      fileKey: file.key,
      currentType: Number(file.imageType) || 1,
    });
  }

  function openExistingTypeSelector(image) {
    if (busy || !image?.id) {
      return;
    }

    setTypeTarget({
      kind: 'existing',
      imageId: image.id,
      currentType: Number(image?.type) || null,
    });
  }

  function closeTypeSelector() {
    setTypeTarget(null);
  }

  async function handleSelectImageType(nextType) {
    const currentTarget = typeTarget;

    if (!currentTarget) {
      return;
    }

    setTypeTarget(null);

    if (currentTarget.kind === 'pending') {
      setSelectedFiles(previousFiles =>
        previousFiles.map(file =>
          file.key === currentTarget.fileKey
            ? {
                ...file,
                imageType: nextType,
              }
            : file,
        ),
      );

      return;
    }

    if (currentTarget.kind === 'existing') {
      await handleExistingImageTypeChange(currentTarget.imageId, nextType);
    }
  }

  async function handleExistingImageTypeChange(imageId, nextType) {
    const currentImage = images.find(
      image => String(image?.id) === String(imageId),
    );

    if (!currentImage || !courseId) {
      return;
    }

    if (Number(currentImage?.type) === Number(nextType)) {
      return;
    }

    try {
      setUpdatingImageTypeId(imageId);

      const response = await api(
        `/api/ott/ottcourses/${courseId}/images/${imageId}/type`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            type: nextType,
          }),
        },
      );

      const updatedImages = images.map(image => {
        if (String(image?.id) !== String(imageId)) {
          return image;
        }

        const updatedUrl =
          response?.url || image?.public_url || image?.displayUrl || null;

        return {
          ...image,

          type: Number(response?.type) || Number(nextType),

          public_url: updatedUrl,
          displayUrl: updatedUrl,
        };
      });

      onImagesChange?.(updatedImages);
    } catch (error) {
      console.log('Image type update API error:', error);

      Alert.alert(
        'Could not update image type',
        error?.message || 'The image type could not be updated.',
      );
    } finally {
      setUpdatingImageTypeId(null);
    }
  }

  async function handleUploadImages() {
    if (uploadingImages || selectedFiles.length === 0 || !courseId) {
      return;
    }

    try {
      setUploadingImages(true);

      const formData = new FormData();

      selectedFiles.forEach((file, index) => {
        formData.append('files[]', {
          uri: file.uri,

          name: file.name || `course-image-${Date.now()}-${index}.jpg`,

          type: file.type || 'image/jpeg',
        });
      });

      const uploadResponse = await api(
        `/api/ott/ottcourses/${courseId}/images`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const uploadedFiles = Array.isArray(uploadResponse?.files)
        ? uploadResponse.files
        : [];

      if (uploadedFiles.length === 0) {
        throw new Error('The server did not return the uploaded images.');
      }

      /*
       * The upload response follows the same order
       * as the FormData files[] entries.
       */
      const typeUpdateResults = await Promise.allSettled(
        uploadedFiles.map((uploadedFile, index) => {
          const selectedFile = selectedFiles[index];

          const selectedType = Number(selectedFile?.imageType) || 1;

          return api(
            `/api/ott/ottcourses/${courseId}/images/${uploadedFile.id}/type`,
            {
              method: 'PATCH',
              body: JSON.stringify({
                type: selectedType,
              }),
            },
          );
        }),
      );

      const newImages = uploadedFiles.map((uploadedFile, index) => {
        const selectedFile = selectedFiles[index];

        const typeResult = typeUpdateResults[index];

        const typeResponse =
          typeResult?.status === 'fulfilled' ? typeResult.value : null;

        const updatedUrl =
          typeResponse?.url || uploadedFile?.url || selectedFile?.uri || null;

        return {
          id: uploadedFile.id,

          ottcourse_id: courseId,

          /*
           * Null means the image upload succeeded,
           * but its type PATCH request failed.
           * The user can retry by selecting a type.
           */
          type:
            typeResult?.status === 'fulfilled'
              ? Number(typeResponse?.type ?? selectedFile?.imageType ?? 1)
              : null,

          name:
            uploadedFile?.name ||
            selectedFile?.name ||
            `Course Image ${index + 1}`,

          public_url: updatedUrl,
          displayUrl: updatedUrl,

          path: null,

          mime: selectedFile?.type || 'image/jpeg',

          size_bytes: Number(uploadedFile?.size ?? selectedFile?.size) || null,
        };
      });

      onImagesChange?.([...images, ...newImages]);

      setSelectedFiles([]);

      const failedTypeUpdates = typeUpdateResults.filter(
        result => result.status === 'rejected',
      ).length;

      if (failedTypeUpdates > 0) {
        Alert.alert(
          'Images uploaded',
          `${uploadedFiles.length} image(s) were uploaded, but ${failedTypeUpdates} image type update(s) failed. Select the image type again to retry.`,
        );
      } else {
        Alert.alert(
          'Images Uploaded',
          `${uploadedFiles.length} image(s) were uploaded successfully.`,
        );
      }
    } catch (error) {
      console.log('Course image upload API error:', error);

      Alert.alert(
        'Could not upload images',
        error?.message || 'The selected images could not be uploaded.',
      );
    } finally {
      setUploadingImages(false);
    }
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>Course Images</Text>

          <Text style={styles.sectionSubtitle}>
            Listing, banner and detail-page artwork
          </Text>
        </View>

        <Pressable
          onPress={handlePickImages}
          disabled={busy || !courseId}
          style={({ pressed }) => [
            styles.uploadButton,

            pressed && !busy && styles.buttonPressed,

            (busy || !courseId) && styles.buttonDisabled,
          ]}
        >
          {pickingImages ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.uploadButtonText}>+ Select Images</Text>
          )}
        </Pressable>
      </View>

      {selectedFiles.length > 0 ? (
        <View style={styles.pendingSection}>
          <View style={styles.pendingHeader}>
            <View style={styles.pendingHeaderText}>
              <Text style={styles.pendingTitle}>Selected for upload</Text>

              <Text style={styles.pendingCount}>
                {selectedFiles.length}{' '}
                {selectedFiles.length === 1 ? 'image' : 'images'}
              </Text>
            </View>

            <View style={styles.pendingHeaderActions}>
              <Pressable
                onPress={handleClearPendingFiles}
                disabled={uploadingImages}
                style={({ pressed }) => [
                  styles.clearPendingButton,

                  pressed && !uploadingImages && styles.buttonPressed,

                  uploadingImages && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.clearPendingButtonText}>Clear</Text>
              </Pressable>

              <Pressable
                onPress={handleUploadImages}
                disabled={uploadingImages}
                style={({ pressed }) => [
                  styles.uploadSelectedButton,

                  pressed && !uploadingImages && styles.buttonPressed,

                  uploadingImages && styles.buttonDisabled,
                ]}
              >
                {uploadingImages ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.uploadSelectedButtonText}>
                    Upload Selected
                  </Text>
                )}
              </Pressable>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pendingImageList}
          >
            {selectedFiles.map((file, index) => {
              const selectedType = getImageTypeOption(file.imageType);

              return (
                <View key={file.key} style={styles.pendingImageCard}>
                  <Image
                    source={{
                      uri: file.uri,
                    }}
                    style={styles.pendingPreview}
                    resizeMode="cover"
                  />

                  <View style={styles.pendingImageInfo}>
                    <Text style={styles.pendingImageName} numberOfLines={1}>
                      {file.name || `Image ${index + 1}`}
                    </Text>

                    <Text style={styles.pendingImageSize}>
                      {formatFileSize(file.size) || 'Image file'}
                    </Text>

                    <Pressable
                      onPress={() => openPendingTypeSelector(file)}
                      disabled={uploadingImages}
                      style={({ pressed }) => [
                        styles.typeButton,

                        pressed && !uploadingImages && styles.buttonPressed,

                        uploadingImages && styles.buttonDisabled,
                      ]}
                    >
                      <View style={styles.typeButtonText}>
                        <Text style={styles.typeButtonLabel}>Image Type</Text>

                        <Text style={styles.typeButtonValue} numberOfLines={1}>
                          {selectedType?.title || 'Choose image type'}
                        </Text>
                      </View>

                      <Text style={styles.typeButtonChevron}>▾</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleRemovePendingFile(file.key)}
                      disabled={uploadingImages}
                      style={({ pressed }) => [
                        styles.removePendingButton,

                        pressed && !uploadingImages && styles.buttonPressed,

                        uploadingImages && styles.buttonDisabled,
                      ]}
                    >
                      <Text style={styles.removePendingButtonText}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      {images.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageList}
        >
          {images.map((image, index) => {
            const imageType = getImageTypeOption(image?.type);

            const updatingType =
              String(updatingImageTypeId) === String(image?.id);

            return (
              <View key={String(image?.id || index)} style={styles.imageCard}>
                {image?.displayUrl ? (
                  <Image
                    source={{
                      uri: image.displayUrl,
                    }}
                    style={styles.posterImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholder}>
                    <Text style={styles.placeholderIcon}>🖼️</Text>
                  </View>
                )}

                <View style={styles.imageInfo}>
                  <Text style={styles.imageName} numberOfLines={1}>
                    {getExistingImageName(image, index, courseTitle)}
                  </Text>

                  <Text style={styles.imageType}>
                    {image?.mime || 'Image'}

                    {image?.size_bytes
                      ? ` • ${formatFileSize(image.size_bytes)}`
                      : ''}
                  </Text>

                  <Pressable
                    onPress={() => openExistingTypeSelector(image)}
                    disabled={busy || !image?.id}
                    style={({ pressed }) => [
                      styles.typeButton,

                      pressed && !busy && styles.buttonPressed,

                      (busy || !image?.id) && styles.buttonDisabled,
                    ]}
                  >
                    {updatingType ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <View style={styles.typeButtonText}>
                          <Text style={styles.typeButtonLabel}>Image Type</Text>

                          <Text
                            style={styles.typeButtonValue}
                            numberOfLines={1}
                          >
                            {imageType?.title || 'Choose image type'}
                          </Text>
                        </View>

                        <Text style={styles.typeButtonChevron}>▾</Text>
                      </>
                    )}
                  </Pressable>
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🖼️</Text>

          <Text style={styles.emptyTitle}>No course images</Text>

          <Text style={styles.emptyDescription}>
            Select listing, banner or detail-page images to upload.
          </Text>
        </View>
      )}

      <Modal
        visible={Boolean(typeTarget)}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeTypeSelector}
      >
        <Pressable style={styles.modalOverlay} onPress={closeTypeSelector}>
          <Pressable style={styles.typeModalCard} onPress={() => {}}>
            <View style={styles.typeModalHeader}>
              <View style={styles.typeModalHeaderText}>
                <Text style={styles.typeModalTitle}>Select Image Type</Text>

                <Text style={styles.typeModalSubtitle}>
                  Choose where this image will be used.
                </Text>
              </View>

              <Pressable
                onPress={closeTypeSelector}
                hitSlop={8}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>×</Text>
              </Pressable>
            </View>

            <View style={styles.typeOptionList}>
              {IMAGE_TYPE_OPTIONS.map(option => {
                const selected =
                  Number(typeTarget?.currentType) === option.value;

                return (
                  <Pressable
                    key={String(option.value)}
                    onPress={() => handleSelectImageType(option.value)}
                    style={({ pressed }) => [
                      styles.typeModalOption,

                      selected && styles.typeModalOptionSelected,

                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.typeRadio,

                        selected && styles.typeRadioSelected,
                      ]}
                    >
                      {selected ? <View style={styles.typeRadioInner} /> : null}
                    </View>

                    <View style={styles.typeModalOptionText}>
                      <Text style={styles.typeModalOptionTitle}>
                        {option.title}
                      </Text>

                      <Text style={styles.typeModalOptionDescription}>
                        {option.description}
                      </Text>
                    </View>

                    <View style={styles.typeNumberBadge}>
                      <Text style={styles.typeNumberBadgeText}>
                        Type {option.value}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
