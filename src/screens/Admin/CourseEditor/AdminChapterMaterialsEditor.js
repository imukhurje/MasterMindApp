import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import DraggableFlatList from 'react-native-draggable-flatlist';
import QuizMaterialModal from './components/QuizMaterialModal';
import { api } from '../../../api/client';
import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import VideoMaterialModal from './components/VideoMaterialModal';
import PdfMaterialModal from './components/PdfMaterialModal';
import MaterialItemCard from './components/MaterialItemCard';
import HtmlMaterialModal from './components/HtmlMaterialModal';
import YoutubeMaterialModal from './components/YoutubeMaterialModal';
import { styles, COLORS } from './AdminChapterMaterialsEditor.styles';

function getMaterialPosition(material) {
  const position = Number(material?.position);

  if (Number.isFinite(position) && position > 0) {
    return position;
  }

  return Number.MAX_SAFE_INTEGER;
}

function sortMaterials(materials) {
  if (!Array.isArray(materials)) {
    return [];
  }

  return [...materials].sort((first, second) => {
    const positionDifference =
      getMaterialPosition(first) - getMaterialPosition(second);

    if (positionDifference !== 0) {
      return positionDifference;
    }

    return Number(first?.id || 0) - Number(second?.id || 0);
  });
}

function normalizeMaterialPositions(materials) {
  return materials.map((material, index) => ({
    ...material,
    position: index + 1,
  }));
}

function extractMaterialsFromResponse(response) {
  if (Array.isArray(response?.materials)) {
    return response.materials;
  }

  if (Array.isArray(response?.data?.materials)) {
    return response.data.materials;
  }

  if (Array.isArray(response)) {
    return response;
  }

  return null;
}

function mergeServerMaterials(serverMaterials, localMaterials) {
  if (!Array.isArray(serverMaterials)) {
    return localMaterials;
  }

  const localMaterialMap = new Map(
    localMaterials.map(material => [String(material?.id), material]),
  );

  const mergedMaterials = serverMaterials.map(serverMaterial => ({
    ...localMaterialMap.get(String(serverMaterial?.id)),
    ...serverMaterial,
  }));

  return normalizeMaterialPositions(sortMaterials(mergedMaterials));
}

export default function AdminChapterMaterialsEditor({ route }) {
  const { width } = useWindowDimensions();
  const [pdfUploading, setPdfUploading] = useState(false);

  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  const [editingPdfMaterial, setEditingPdfMaterial] = useState(null);
  const routeChapter = route?.params?.chapter || null;

  const courseId = route?.params?.courseId || null;

  const [chapter, setChapter] = useState(routeChapter);

  const [materials, setMaterials] = useState(
    normalizeMaterialPositions(sortMaterials(routeChapter?.materials)),
  );
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [editingQuizMaterial, setEditingQuizMaterial] = useState(null);
  const [reorderSaving, setReorderSaving] = useState(false);
  const [deletingMaterialId, setDeletingMaterialId] = useState(null);
  const [htmlModalVisible, setHtmlModalVisible] = useState(false);

  const [editingHtmlMaterial, setEditingHtmlMaterial] = useState(null);
  const [youtubeModalVisible, setYoutubeModalVisible] = useState(false);

  const [editingYoutubeMaterial, setEditingYoutubeMaterial] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);

  const [videoModalVisible, setVideoModalVisible] = useState(false);

  const [editingVideoMaterial, setEditingVideoMaterial] = useState(null);
  const [dragging, setDragging] = useState(false);

  const isWideScreen = width >= 760;

  const chapterId = chapter?.id || route?.params?.chapterId;

  useEffect(() => {
    if (!routeChapter) {
      return;
    }

    setChapter(routeChapter);

    setMaterials(
      normalizeMaterialPositions(sortMaterials(routeChapter?.materials)),
    );
  }, [routeChapter]);

  const materialCountLabel = useMemo(() => {
    return `${materials.length} ${materials.length === 1 ? 'item' : 'items'}`;
  }, [materials.length]);

  function showPendingMessage(actionName) {
    Alert.alert(
      actionName,
      `${actionName} functionality will be connected later.`,
    );
  }

  const handleOpenAddQuiz = useCallback(() => {
    if (reorderSaving || deletingMaterialId !== null) {
      return;
    }

    setEditingQuizMaterial(null);
    setQuizModalVisible(true);
  }, [deletingMaterialId, reorderSaving]);

  const handleCloseQuizModal = useCallback(() => {
    setQuizModalVisible(false);
    setEditingQuizMaterial(null);
  }, []);

  const handleOpenAddHtml = useCallback(() => {
    if (reorderSaving || deletingMaterialId !== null) {
      return;
    }

    setEditingHtmlMaterial(null);
    setHtmlModalVisible(true);
  }, [deletingMaterialId, reorderSaving]);

  const handlePickAndUploadVideos = useCallback(async () => {
    if (
      !chapterId ||
      videoUploading ||
      pdfUploading ||
      reorderSaving ||
      deletingMaterialId !== null
    ) {
      return;
    }

    try {
      const selectedFiles = await pick({
        type: [types.video],
        allowMultiSelection: true,
        mode: 'import',
      });

      if (!Array.isArray(selectedFiles) || selectedFiles.length === 0) {
        return;
      }

      const invalidFile = selectedFiles.find(
        file => file?.error || file?.hasRequestedType === false,
      );

      if (invalidFile) {
        Alert.alert('Invalid file', 'Please select video files only.');
        return;
      }

      const formData = new FormData();

      selectedFiles.forEach((file, fileIndex) => {
        const fallbackName = `video-${Date.now()}-${fileIndex + 1}.mp4`;

        formData.append('files[]', {
          uri: file.uri,

          name: file.name || fallbackName,

          type: file.type || 'video/mp4',
        });
      });

      setVideoUploading(true);

      const response = await api(
        `/api/ott/chapters/${chapterId}/materials?type=video`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const responseFiles = Array.isArray(response?.files)
        ? response.files
        : [];

      if (responseFiles.length === 0) {
        throw new Error(
          'The server did not return the uploaded video details.',
        );
      }

      const createdMaterials = responseFiles.map((responseFile, index) => {
        const selectedFile = selectedFiles[index];

        return {
          id: responseFile.id,
          chapter_id: chapterId,

          title:
            responseFile.name || selectedFile?.name || `Video ${index + 1}`,

          type: 'video',
          description: null,
          disk: 'private',
          path: null,

          mime: selectedFile?.type || 'video/mp4',

          size_bytes: responseFile.size ?? selectedFile?.size ?? null,

          duration_seconds: null,
          pages: null,
          html_content: null,
          external_url: null,
          is_preview: false,
          position: 0,
          quiz: null,
          assets: [],
        };
      });

      // Insert newly uploaded videos at the top.
      const finalMaterials = normalizeMaterialPositions([
        ...createdMaterials,
        ...materials,
      ]);

      setMaterials(finalMaterials);

      setChapter(previousChapter => {
        if (!previousChapter) {
          return previousChapter;
        }

        return {
          ...previousChapter,
          materials: finalMaterials,
        };
      });

      try {
        await api(`/api/ott/chapters/${chapterId}/materials/reorder`, {
          method: 'POST',

          body: JSON.stringify({
            order: finalMaterials.map(currentMaterial => currentMaterial.id),
          }),
        });
      } catch (reorderError) {
        console.log('Uploaded video order save error:', reorderError);

        Alert.alert(
          'Video uploaded',
          'The video was uploaded, but its position could not be saved.',
        );
      }
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      console.log('Video upload error:', error);

      Alert.alert(
        'Could not upload video',
        error?.message || 'The selected video could not be uploaded.',
      );
    } finally {
      setVideoUploading(false);
    }
  }, [
    chapterId,
    deletingMaterialId,
    materials,
    pdfUploading,
    reorderSaving,
    videoUploading,
  ]);

  const handleCloseVideoModal = useCallback(() => {
    setVideoModalVisible(false);
    setEditingVideoMaterial(null);
  }, []);

  const handleVideoMaterialSaved = useCallback(
    ({ material }) => {
      if (!material?.id) {
        return;
      }

      const updatedMaterials = materials.map(currentMaterial => {
        if (String(currentMaterial?.id) !== String(material.id)) {
          return currentMaterial;
        }

        return {
          ...currentMaterial,
          ...material,

          // Preserve the existing list position.
          position: currentMaterial.position,
        };
      });

      setMaterials(updatedMaterials);

      setChapter(previousChapter => {
        if (!previousChapter) {
          return previousChapter;
        }

        return {
          ...previousChapter,
          materials: updatedMaterials,
        };
      });

      setVideoModalVisible(false);
      setEditingVideoMaterial(null);
    },
    [materials],
  );

  const handleQuizMaterialSaved = useCallback(
    async ({ mode, material }) => {
      if (!material?.id) {
        return;
      }

      let finalMaterials;

      if (mode === 'edit') {
        finalMaterials = materials.map(currentMaterial => {
          if (String(currentMaterial?.id) !== String(material.id)) {
            return currentMaterial;
          }

          // Preserve the current material position.
          return {
            ...currentMaterial,
            ...material,
            position: currentMaterial.position,
          };
        });
      } else {
        finalMaterials = normalizeMaterialPositions([material, ...materials]);
      }

      setMaterials(finalMaterials);

      setChapter(previousChapter => {
        if (!previousChapter) {
          return previousChapter;
        }

        return {
          ...previousChapter,
          materials: finalMaterials,
        };
      });

      setQuizModalVisible(false);
      setEditingQuizMaterial(null);

      if (mode !== 'create' || !chapterId) {
        return;
      }

      try {
        await api(`/api/ott/chapters/${chapterId}/materials/reorder`, {
          method: 'POST',

          body: JSON.stringify({
            order: finalMaterials.map(currentMaterial => currentMaterial.id),
          }),
        });
      } catch (error) {
        console.log('New quiz material order save error:', error);

        Alert.alert(
          'Quiz created',
          'The quiz was created, but its material order could not be saved.',
        );
      }
    },
    [chapterId, materials],
  );

  const handlePickAndUploadPdfs = useCallback(async () => {
    if (
      !chapterId ||
      pdfUploading ||
      reorderSaving ||
      deletingMaterialId !== null
    ) {
      return;
    }

    try {
      const selectedFiles = await pick({
        type: [types.pdf],
        allowMultiSelection: true,
      });

      if (!Array.isArray(selectedFiles) || selectedFiles.length === 0) {
        return;
      }

      const formData = new FormData();

      selectedFiles.forEach((file, fileIndex) => {
        const fallbackName = `document-${Date.now()}-${fileIndex + 1}.pdf`;

        formData.append('files[]', {
          uri: file.uri,
          name: file.name || fallbackName,
          type: file.type || 'application/pdf',
        });
      });

      setPdfUploading(true);

      const response = await api(
        `/api/ott/chapters/${chapterId}/materials?type=pdf`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const responseFiles = Array.isArray(response?.files)
        ? response.files
        : [];

      if (responseFiles.length === 0) {
        throw new Error('The server did not return the uploaded PDF details.');
      }

      const createdMaterials = responseFiles.map((responseFile, index) => {
        const selectedFile = selectedFiles[index];

        return {
          id: responseFile.id,
          chapter_id: chapterId,
          title: responseFile.name || selectedFile?.name || `PDF ${index + 1}`,
          type: 'pdf',
          description: null,
          disk: 'private',
          path: null,
          mime: 'application/pdf',
          size_bytes: responseFile.size ?? selectedFile?.size ?? null,
          duration_seconds: null,
          pages: null,
          html_content: null,
          external_url: null,
          is_preview: false,
          position: 0,
          quiz: null,
          assets: [],
        };
      });

      // Insert newly uploaded PDFs at the top.
      const finalMaterials = normalizeMaterialPositions([
        ...createdMaterials,
        ...materials,
      ]);

      setMaterials(finalMaterials);

      setChapter(previousChapter => {
        if (!previousChapter) {
          return previousChapter;
        }

        return {
          ...previousChapter,
          materials: finalMaterials,
        };
      });

      try {
        await api(`/api/ott/chapters/${chapterId}/materials/reorder`, {
          method: 'POST',
          body: JSON.stringify({
            order: finalMaterials.map(currentMaterial => currentMaterial.id),
          }),
        });
      } catch (reorderError) {
        console.log('Uploaded PDF order save error:', reorderError);

        Alert.alert(
          'PDF uploaded',
          'The PDF was uploaded, but its position could not be saved.',
        );
      }
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      console.log('PDF upload error:', error);

      Alert.alert(
        'Could not upload PDF',
        error?.message || 'The selected PDF could not be uploaded.',
      );
    } finally {
      setPdfUploading(false);
    }
  }, [chapterId, deletingMaterialId, materials, pdfUploading, reorderSaving]);

  const handleClosePdfModal = useCallback(() => {
    setPdfModalVisible(false);
    setEditingPdfMaterial(null);
  }, []);

  const handlePdfMaterialSaved = useCallback(
    ({ material }) => {
      if (!material?.id) {
        return;
      }

      const updatedMaterials = materials.map(currentMaterial => {
        if (String(currentMaterial?.id) !== String(material.id)) {
          return currentMaterial;
        }

        return {
          ...currentMaterial,
          ...material,

          // Preserve the existing list position.
          position: currentMaterial.position,
        };
      });

      setMaterials(updatedMaterials);

      setChapter(previousChapter => {
        if (!previousChapter) {
          return previousChapter;
        }

        return {
          ...previousChapter,
          materials: updatedMaterials,
        };
      });

      setPdfModalVisible(false);
      setEditingPdfMaterial(null);
    },
    [materials],
  );

  const handleEditMaterial = useCallback(
    material => {
      if (!material?.id || reorderSaving || deletingMaterialId !== null) {
        return;
      }

      const materialType = String(material?.type || '').toLowerCase();

      if (materialType === 'html') {
        setEditingHtmlMaterial(material);
        setHtmlModalVisible(true);
        return;
      }

      if (materialType === 'youtube') {
        setEditingYoutubeMaterial(material);
        setYoutubeModalVisible(true);
        return;
      }
      if (materialType === 'pdf') {
        setEditingPdfMaterial(material);
        setPdfModalVisible(true);
        return;
      }

      if (materialType === 'video') {
        setEditingVideoMaterial(material);
        setVideoModalVisible(true);
        return;
      }

      if (materialType === 'quiz') {
        const quizId = material?.quiz?.id;

        if (!quizId) {
          Alert.alert(
            'Could not edit quiz',
            'Quiz ID is missing from this material.',
          );
          return;
        }

        setEditingQuizMaterial(material);
        setQuizModalVisible(true);
        return;
      }

      showPendingMessage(`Edit ${materialType.toUpperCase()} Material`);
    },
    [deletingMaterialId, reorderSaving],
  );

  const handleCloseHtmlModal = useCallback(() => {
    setHtmlModalVisible(false);
    setEditingHtmlMaterial(null);
  }, []);

  const handleHtmlMaterialSaved = useCallback(
    async ({ mode, material }) => {
      if (!material?.id) {
        return;
      }

      let updatedMaterials;

      if (mode === 'edit') {
        updatedMaterials = materials.map(currentMaterial => {
          if (String(currentMaterial?.id) !== String(material.id)) {
            return currentMaterial;
          }

          // Preserve the existing position during an update.
          return {
            ...currentMaterial,
            ...material,
            position: currentMaterial.position,
          };
        });
      } else {
        // Insert the newly created material at the top.
        updatedMaterials = [material, ...materials];
      }

      const finalMaterials = normalizeMaterialPositions(updatedMaterials);

      setMaterials(finalMaterials);

      setChapter(previousChapter => {
        if (!previousChapter) {
          return previousChapter;
        }

        return {
          ...previousChapter,
          materials: finalMaterials,
        };
      });

      setHtmlModalVisible(false);
      setEditingHtmlMaterial(null);

      if (mode === 'create' && chapterId) {
        try {
          await api(`/api/ott/chapters/${chapterId}/materials/reorder`, {
            method: 'POST',
            body: JSON.stringify({
              order: finalMaterials.map(currentMaterial => currentMaterial.id),
            }),
          });
        } catch (error) {
          console.log('New material order save error:', error);

          Alert.alert(
            'Material added',
            'The material was added, but its order could not be saved.',
          );
        }
      }
    },
    [chapterId, materials],
  );

  const handleOpenAddYoutube = useCallback(() => {
    if (reorderSaving || deletingMaterialId !== null) {
      return;
    }

    setEditingYoutubeMaterial(null);
    setYoutubeModalVisible(true);
  }, [deletingMaterialId, reorderSaving]);

  const handleCloseYoutubeModal = useCallback(() => {
    setYoutubeModalVisible(false);
    setEditingYoutubeMaterial(null);
  }, []);

  const handleYoutubeMaterialSaved = useCallback(
    async ({ mode, material }) => {
      if (!material?.id) {
        return;
      }

      let updatedMaterials;

      if (mode === 'edit') {
        updatedMaterials = materials.map(currentMaterial => {
          if (String(currentMaterial?.id) !== String(material.id)) {
            return currentMaterial;
          }

          /*
           * Preserve the existing position because
           * the update endpoint may return position zero.
           */
          return {
            ...currentMaterial,
            ...material,
            position: currentMaterial.position,
          };
        });
      } else {
        // Insert the newly created material at the top.
        updatedMaterials = [material, ...materials];
      }

      const finalMaterials = normalizeMaterialPositions(updatedMaterials);

      setMaterials(finalMaterials);

      setChapter(previousChapter => {
        if (!previousChapter) {
          return previousChapter;
        }

        return {
          ...previousChapter,
          materials: finalMaterials,
        };
      });

      setYoutubeModalVisible(false);
      setEditingYoutubeMaterial(null);

      if (mode !== 'create' || !chapterId) {
        return;
      }

      try {
        await api(`/api/ott/chapters/${chapterId}/materials/reorder`, {
          method: 'POST',
          body: JSON.stringify({
            order: finalMaterials.map(currentMaterial => currentMaterial.id),
          }),
        });
      } catch (error) {
        console.log('New YouTube material order save error:', error);

        Alert.alert(
          'YouTube video added',
          'The video was added, but its order could not be saved.',
        );
      }
    },
    [chapterId, materials],
  );

  const handleMaterialReordered = useCallback(
    async ({ data, from, to }) => {
      setDragging(false);

      if (reorderSaving || !chapterId || from === to) {
        return;
      }

      const previousMaterials = materials.map(material => ({
        ...material,
      }));

      /*
       * DraggableFlatList already returns the
       * reordered data in the correct order.
       */
      const reorderedMaterials = normalizeMaterialPositions(
        Array.isArray(data) ? data : materials,
      );

      // Update the UI immediately.
      setMaterials(reorderedMaterials);

      setChapter(previousChapter => {
        if (!previousChapter) {
          return previousChapter;
        }

        return {
          ...previousChapter,
          materials: reorderedMaterials,
        };
      });

      setReorderSaving(true);

      try {
        const payload = {
          order: reorderedMaterials.map(material => material.id),
        };

        console.log('Material reorder payload:', payload);

        const response = await api(
          `/api/ott/chapters/${chapterId}/materials/reorder`,
          {
            method: 'POST',

            body: JSON.stringify(payload),
          },
        );

        const serverMaterials = extractMaterialsFromResponse(response);

        const finalMaterials = serverMaterials
          ? mergeServerMaterials(serverMaterials, reorderedMaterials)
          : reorderedMaterials;

        setMaterials(finalMaterials);

        setChapter(previousChapter => ({
          ...(previousChapter || {}),

          ...(response && typeof response === 'object' ? response : {}),

          materials: finalMaterials,
        }));
      } catch (error) {
        console.log('Material reorder API error:', error);

        // Restore previous order if the API request fails.
        setMaterials(previousMaterials);

        setChapter(previousChapter => {
          if (!previousChapter) {
            return previousChapter;
          }

          return {
            ...previousChapter,
            materials: previousMaterials,
          };
        });

        Alert.alert(
          'Could not reorder materials',
          error?.message || 'The previous material order has been restored.',
        );
      } finally {
        setReorderSaving(false);
        setDragging(false);
      }
    },
    [chapterId, materials, reorderSaving],
  );

  const handleDeleteMaterial = useCallback(
    material => {
      if (!material?.id || reorderSaving || deletingMaterialId !== null) {
        return;
      }

      Alert.alert(
        'Delete Material',
        `Are you sure you want to delete "${
          material?.title || 'this material'
        }"?`,
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
                setDeletingMaterialId(material.id);

                await api(`/api/ott/materials/${material.id}`, {
                  method: 'DELETE',
                });

                // Remove the deleted material and normalize positions.
                const updatedMaterials = normalizeMaterialPositions(
                  materials.filter(
                    currentMaterial =>
                      String(currentMaterial?.id) !== String(material.id),
                  ),
                );

                setMaterials(updatedMaterials);

                setChapter(previousChapter => {
                  if (!previousChapter) {
                    return previousChapter;
                  }

                  return {
                    ...previousChapter,
                    materials: updatedMaterials,
                  };
                });
              } catch (error) {
                console.log('Material delete API error:', error);

                Alert.alert(
                  'Could not delete material',
                  error?.message || 'The material could not be deleted.',
                );
              } finally {
                setDeletingMaterialId(null);
              }
            },
          },
        ],
      );
    },
    [deletingMaterialId, materials, reorderSaving],
  );

  const renderMaterialItem = useCallback(
    ({ item, drag, isActive, getIndex }) => {
      const index = getIndex?.() ?? 0;

      const reorderDisabled = reorderSaving || deletingMaterialId !== null;

      return (
        <View style={styles.materialItemWrapper}>
          <MaterialItemCard
            material={item}
            index={index}
            /*
             * Existing MaterialItemCard can keep
             * calling onDragStart from its drag handle.
             */
            onDragStart={reorderDisabled ? undefined : drag}
            /*
             * DraggableFlatList handles the actual
             * drag release itself.
             */
            onDragEnd={() => {}}
            isActive={isActive}
            reorderDisabled={reorderDisabled}
            onEdit={() => handleEditMaterial(item)}
            onDelete={() => handleDeleteMaterial(item)}
            deleting={deletingMaterialId === item.id}
          />
        </View>
      );
    },
    [
      reorderSaving,
      deletingMaterialId,
      handleEditMaterial,
      handleDeleteMaterial,
    ],
  );

  const renderListHeader = useCallback(() => {
    return (
      <View style={styles.listHeader} collapsable={false}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Chapter Materials</Text>

          <Text style={styles.pageSubtitle}>
            {chapter?.title || 'Untitled Chapter'}
          </Text>

          <View style={styles.headerMetaRow}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>
                Chapter ID: {chapterId || 'N/A'}
              </Text>
            </View>

            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>
                Course ID: {courseId || 'N/A'}
              </Text>
            </View>

            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>{materialCountLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.editorSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionTitle}>Materials</Text>

              <Text style={styles.sectionTitleSecondary} numberOfLines={2}>
                {chapter?.title || 'Untitled Chapter'}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.materialCreatorLayout,
              isWideScreen
                ? styles.materialCreatorLayoutWide
                : styles.materialCreatorLayoutMobile,
            ]}
          >
            <View
              style={[
                styles.quickActionsColumn,
                isWideScreen
                  ? styles.quickActionsColumnWide
                  : styles.quickActionsColumnMobile,
              ]}
            >
              <Pressable
                onPress={handleOpenAddHtml}
                style={({ pressed }) => [
                  styles.quickActionButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.quickActionButtonText}>+ Add HTML</Text>
              </Pressable>

              <Pressable
                onPress={handleOpenAddYoutube}
                style={({ pressed }) => [
                  styles.quickActionButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.quickActionButtonText}>+ YouTube</Text>
              </Pressable>

              <Pressable
                onPress={handleOpenAddQuiz}
                style={({ pressed }) => [
                  styles.quickActionButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.quickActionButtonText}>+ Add Quiz</Text>
              </Pressable>
            </View>

            <View
              style={[
                styles.uploadCardsContainer,
                isWideScreen
                  ? styles.uploadCardsContainerWide
                  : styles.uploadCardsContainerMobile,
              ]}
            >
              <UploadPanel
                title="Upload Videos"
                subtitle="MP4 / MOV / MKV / WEBM"
                icon="🎬"
                buttonLabel={videoUploading ? 'Uploading...' : 'Choose videos'}
                loading={videoUploading}
                disabled={
                  videoUploading ||
                  pdfUploading ||
                  reorderSaving ||
                  deletingMaterialId !== null
                }
                onPress={handlePickAndUploadVideos}
              />

              <UploadPanel
                title="Upload PDFs"
                subtitle="PDF documents"
                icon="📄"
                buttonLabel={pdfUploading ? 'Uploading...' : 'Choose PDFs'}
                loading={pdfUploading}
                disabled={
                  pdfUploading ||
                  videoUploading ||
                  reorderSaving ||
                  deletingMaterialId !== null
                }
                onPress={handlePickAndUploadPdfs}
              />
            </View>
          </View>
        </View>

        <View style={styles.itemsHeaderCard}>
          <View style={styles.itemsHeader}>
            <View style={styles.itemsHeaderText}>
              <Text style={styles.itemsTitle}>Items</Text>

              <Text style={styles.itemsSubtitle}>
                Existing materials in this chapter
              </Text>
            </View>

            {reorderSaving ? (
              <View style={styles.reorderStatus}>
                <ActivityIndicator size="small" color={COLORS.BLUE} />

                <Text style={styles.reorderStatusText}>Saving order...</Text>
              </View>
            ) : dragging ? (
              <View style={styles.reorderStatus}>
                <Text style={styles.reorderStatusText}>Reordering...</Text>
              </View>
            ) : (
              <View style={styles.itemsCountBadge}>
                <Text style={styles.itemsCountText}>{materials.length}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }, [
    chapter?.title,
    chapterId,
    courseId,
    dragging,
    isWideScreen,
    materialCountLabel,
    materials.length,
    reorderSaving,
    handleOpenAddHtml,
    handleOpenAddYoutube,
    handleOpenAddQuiz,
    deletingMaterialId,
    handlePickAndUploadPdfs,
    pdfUploading,
    handlePickAndUploadVideos,
    pdfUploading,
    videoUploading,
  ]);

  const renderEmptyComponent = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📦</Text>

        <Text style={styles.emptyTitle}>No materials found</Text>

        <Text style={styles.emptyDescription}>
          Upload a video or PDF, or add HTML, YouTube content or a quiz.
        </Text>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <DraggableFlatList
        data={materials}
        keyExtractor={item => String(item.id)}
        renderItem={renderMaterialItem}
        /*
         * The dragged material should stay within
         * the draggable list viewport.
         */
        dragItemOverflow={false}
        /*
         * Keep auto-scroll available when there
         * are many materials.
         */
        autoscrollThreshold={55}
        autoscrollSpeed={80}
        onDragBegin={() => {
          if (reorderSaving || deletingMaterialId !== null) {
            return;
          }

          setDragging(true);
        }}
        onRelease={() => {
          /*
           * Do not reset dragging here.
           * onDragEnd fires after the drop animation
           * and saves the final order.
           */
        }}
        onDragEnd={handleMaterialReordered}
        containerStyle={styles.dragListContainer}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={<View style={styles.footerSpace} />}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        extraData={{
          reorderSaving,
          dragging,
          deletingMaterialId,
        }}
      />

      <HtmlMaterialModal
        visible={htmlModalVisible}
        chapterId={chapterId}
        material={editingHtmlMaterial}
        onClose={handleCloseHtmlModal}
        onSaved={handleHtmlMaterialSaved}
      />

      <YoutubeMaterialModal
        visible={youtubeModalVisible}
        chapterId={chapterId}
        material={editingYoutubeMaterial}
        onClose={handleCloseYoutubeModal}
        onSaved={handleYoutubeMaterialSaved}
      />
      <QuizMaterialModal
        visible={quizModalVisible}
        chapterId={chapterId}
        material={editingQuizMaterial}
        onClose={handleCloseQuizModal}
        onSaved={handleQuizMaterialSaved}
      />
      <PdfMaterialModal
        visible={pdfModalVisible}
        material={editingPdfMaterial}
        onClose={handleClosePdfModal}
        onSaved={handlePdfMaterialSaved}
      />
      <VideoMaterialModal
        visible={videoModalVisible}
        material={editingVideoMaterial}
        onClose={handleCloseVideoModal}
        onSaved={handleVideoMaterialSaved}
      />
    </SafeAreaView>
  );
}

function UploadPanel({
  title,
  subtitle,
  icon,
  buttonLabel,
  loading = false,
  disabled = false,
  onPress,
}) {
  return (
    <View style={styles.uploadPanel}>
      <View style={styles.uploadPanelHeader}>
        <Text style={styles.uploadPanelTitle}>{title}</Text>

        <Text style={styles.uploadPanelSubtitle}>{subtitle}</Text>
      </View>

      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.dropArea,
          pressed && !disabled && styles.dropAreaPressed,
          disabled && styles.dropAreaDisabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.BLUE} />
        ) : (
          <Text style={styles.dropAreaIcon}>{icon}</Text>
        )}

        <Text style={styles.dropAreaTitle}>
          {loading ? 'Uploading PDF files...' : 'Select files to upload'}
        </Text>

        <Text style={styles.dropAreaText}>
          {loading
            ? 'Please wait until the upload is complete.'
            : 'You can select one or multiple PDF files.'}
        </Text>

        <View style={styles.chooseFileButton}>
          <Text style={styles.chooseFileButtonText}>{buttonLabel}</Text>
        </View>
      </Pressable>
    </View>
  );
}
