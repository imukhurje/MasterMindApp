import React, { useCallback, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { api } from '../../../../api/client';
import RoutineTemplateModal from './RoutineTemplateModal';
import { COLORS, styles } from './RoutineTemplatesSettings.styles';

const WEEK_DAYS = [
  {
    id: 1,
    shortLabel: 'Mon',
    fullLabel: 'Monday',
  },
  {
    id: 2,
    shortLabel: 'Tue',
    fullLabel: 'Tuesday',
  },
  {
    id: 3,
    shortLabel: 'Wed',
    fullLabel: 'Wednesday',
  },
  {
    id: 4,
    shortLabel: 'Thu',
    fullLabel: 'Thursday',
  },
  {
    id: 5,
    shortLabel: 'Fri',
    fullLabel: 'Friday',
  },
  {
    id: 6,
    shortLabel: 'Sat',
    fullLabel: 'Saturday',
  },
  {
    id: 7,
    shortLabel: 'Sun',
    fullLabel: 'Sunday',
  },
];

function normalizeRoutines(response) {
  if (!Array.isArray(response)) {
    return [];
  }

  return response.map(routine => ({
    ...routine,

    days: Array.isArray(routine?.days)
      ? [...routine.days].sort(
          (first, second) =>
            Number(first?.day_of_week || 0) - Number(second?.day_of_week || 0),
        )
      : [],
  }));
}

function getRoutineDayMap(routine) {
  const map = new Map();

  const days = Array.isArray(routine?.days) ? routine.days : [];

  days.forEach(day => {
    const dayOfWeek = Number(day?.day_of_week);

    if (Number.isInteger(dayOfWeek) && dayOfWeek >= 1 && dayOfWeek <= 7) {
      map.set(dayOfWeek, day);
    }
  });

  return map;
}

export default function RoutineTemplatesSettings() {
  const [routines, setRoutines] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadError, setLoadError] = useState('');

  const [routineModalVisible, setRoutineModalVisible] = useState(false);

  const [routineModalMode, setRoutineModalMode] = useState('add');

  const [editingRoutine, setEditingRoutine] = useState(null);

  const [savingRoutine, setSavingRoutine] = useState(false);

  const [deletingRoutineId, setDeletingRoutineId] = useState(null);

  const loadRoutines = useCallback(async (mode = 'initial') => {
    try {
      if (mode === 'initial') {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setLoadError('');

      const response = await api('/api/routines/v1', {
        method: 'GET',
      });

      setRoutines(normalizeRoutines(response));
    } catch (error) {
      console.log('Routine templates load error:', error);

      setLoadError(error?.message || 'Could not load routine templates.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRoutines('initial');
  }, [loadRoutines]);

  function handleNewRoutineTemplate() {
    if (savingRoutine || deletingRoutineId !== null) {
      return;
    }

    setRoutineModalMode('add');

    setEditingRoutine(null);

    setRoutineModalVisible(true);
  }

  async function handleSaveRoutine(values, dayTemplates) {
    const isEdit = routineModalMode === 'edit';

    const routineId = editingRoutine?.id;

    if (savingRoutine || (isEdit && !routineId)) {
      return;
    }

    const name = String(values?.name || '').trim();

    const description = String(values?.description || '').trim();

    if (!name) {
      Alert.alert(
        'Routine Name Required',
        'Please enter a routine template name.',
      );

      return;
    }

    /*
     * Every weekday must be included.
     * Blank days are explicitly sent as null.
     */
    const days = {
      1: values?.days?.[1] ?? null,
      2: values?.days?.[2] ?? null,
      3: values?.days?.[3] ?? null,
      4: values?.days?.[4] ?? null,
      5: values?.days?.[5] ?? null,
      6: values?.days?.[6] ?? null,
      7: values?.days?.[7] ?? null,
    };

    const payload = {
      name,

      description: description || null,

      active: Boolean(values?.active),

      days,
    };

    try {
      setSavingRoutine(true);

      console.log(
        isEdit
          ? 'Routine template update payload:'
          : 'Routine template create payload:',
        payload,
      );

      const response = await api(
        isEdit ? `/api/routines/v1/${routineId}` : '/api/routines/v1',
        {
          method: isEdit ? 'PUT' : 'POST',

          body: JSON.stringify(payload),
        },
      );

      if (!response?.id) {
        throw new Error(
          isEdit
            ? 'The server did not return the updated routine.'
            : 'The server did not return the created routine.',
        );
      }

      /*
       * The POST/PUT response contains
       * day_template_id but does not contain
       * the nested template object.
       *
       * Restore template names from the
       * day-template list already loaded
       * inside the modal.
       */
      const templateMap = new Map(
        (Array.isArray(dayTemplates) ? dayTemplates : []).map(template => [
          Number(template.id),
          template,
        ]),
      );

      const responseDays = Array.isArray(response?.days) ? response.days : [];

      const finalDays = responseDays.map(day => {
        const templateId = Number(day?.day_template_id);

        const matchedTemplate = templateMap.get(templateId);

        return {
          ...day,

          template: matchedTemplate
            ? {
                id: matchedTemplate.id,

                name: matchedTemplate.name,

                description: matchedTemplate.description ?? null,
              }
            : null,
        };
      });

      const finalRoutine = {
        ...response,

        days: finalDays,
      };

      if (isEdit) {
        /*
         * Replace only the edited card.
         */
        setRoutines(previous =>
          previous.map(routine =>
            String(routine?.id) === String(routineId) ? finalRoutine : routine,
          ),
        );
      } else {
        /*
         * Add newly created routine at the top.
         */
        setRoutines(previous => [finalRoutine, ...previous]);
      }

      setRoutineModalVisible(false);

      setRoutineModalMode('add');

      setEditingRoutine(null);

      Alert.alert(
        isEdit ? 'Routine Template Updated' : 'Routine Template Created',

        isEdit
          ? 'The routine template has been updated successfully.'
          : 'The routine template has been created successfully.',
      );
    } catch (error) {
      console.log(
        isEdit
          ? 'Routine template update error:'
          : 'Routine template create error:',
        error,
      );

      Alert.alert(
        isEdit ? 'Could not update routine' : 'Could not create routine',

        error?.message ||
          (isEdit
            ? 'The routine template could not be updated.'
            : 'The routine template could not be created.'),
      );
    } finally {
      setSavingRoutine(false);
    }
  }

  function handleCloseRoutineModal() {
    if (savingRoutine) {
      return;
    }

    setRoutineModalVisible(false);

    setRoutineModalMode('add');

    setEditingRoutine(null);
  }

  function handleEditRoutine(routine) {
    if (!routine?.id || savingRoutine || deletingRoutineId !== null) {
      return;
    }

    setRoutineModalMode('edit');

    setEditingRoutine(routine);

    setRoutineModalVisible(true);
  }

  function handleDeleteRoutine(routine) {
    if (!routine?.id || deletingRoutineId !== null || savingRoutine) {
      return;
    }

    Alert.alert(
      'Delete Routine Template',
      `Are you sure you want to delete "${routine?.name || 'this routine'}"?`,
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
              setDeletingRoutineId(routine.id);

              const response = await api(`/api/routines/v1/${routine.id}`, {
                method: 'DELETE',
              });

              if (!response?.ok) {
                throw new Error(
                  'The server did not confirm the routine deletion.',
                );
              }

              /*
               * Remove the deleted routine
               * from the local list.
               */
              setRoutines(previous =>
                previous.filter(
                  currentRoutine =>
                    String(currentRoutine?.id) !== String(routine.id),
                ),
              );

              Alert.alert(
                'Routine Template Deleted',
                `"${
                  routine?.name || 'Routine Template'
                }" has been deleted successfully.`,
              );
            } catch (error) {
              console.log('Routine template delete error:', error);

              Alert.alert(
                'Could not delete routine',
                error?.message || 'The routine template could not be deleted.',
              );
            } finally {
              setDeletingRoutineId(null);
            }
          },
        },
      ],
    );
  }

  if (loading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color={COLORS.BLUE} />

        <Text style={styles.stateText}>Loading routine templates...</Text>
      </View>
    );
  }

  if (loadError && routines.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.errorTitle}>Could not load routine templates</Text>

        <Text style={styles.errorDescription}>{loadError}</Text>

        <Pressable
          onPress={() => loadRoutines('initial')}
          style={({ pressed }) => [
            styles.primaryButton,

            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <View style={styles.topText}>
            <Text style={styles.description}>
              Compose a weekly routine template by mapping weekdays to day
              templates.
            </Text>
          </View>

          <View style={styles.topActions}>
            <Pressable
              onPress={() => loadRoutines('refresh')}
              disabled={refreshing}
              style={({ pressed }) => [
                styles.refreshButton,

                pressed && !refreshing && styles.buttonPressed,

                refreshing && styles.buttonDisabled,
              ]}
            >
              {refreshing ? (
                <ActivityIndicator size="small" color={COLORS.TEXT} />
              ) : (
                <Text style={styles.refreshButtonText}>↻ Refresh</Text>
              )}
            </Pressable>

            <Pressable
              onPress={handleNewRoutineTemplate}
              style={({ pressed }) => [
                styles.newRoutineButton,

                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.newRoutineButtonText}>
                + New Routine Template
              </Text>
            </Pressable>
          </View>
        </View>

        {loadError ? (
          <View style={styles.inlineError}>
            <Text style={styles.inlineErrorText}>{loadError}</Text>
          </View>
        ) : null}

        {routines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🗓️</Text>

            <Text style={styles.emptyTitle}>No routine templates found</Text>

            <Text style={styles.emptyDescription}>
              Create a routine template to map weekdays to day templates.
            </Text>
          </View>
        ) : (
          <View style={styles.routinesContainer}>
            {routines.map(routine => (
              <RoutineTemplateCard
                key={routine.id}
                routine={routine}
                onEdit={handleEditRoutine}
                onDelete={handleDeleteRoutine}
                deleting={String(deletingRoutineId) === String(routine.id)}
                actionsDisabled={deletingRoutineId !== null || savingRoutine}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <RoutineTemplateModal
        visible={routineModalVisible}
        mode={routineModalMode}
        routine={editingRoutine}
        saving={savingRoutine}
        onClose={handleCloseRoutineModal}
        onSave={handleSaveRoutine}
      />
    </View>
  );
}

function RoutineTemplateCard({
  routine,
  onEdit,
  onDelete,
  deleting = false,
  actionsDisabled = false,
}) {
  const dayMap = getRoutineDayMap(routine);

  return (
    <View style={styles.routineCard}>
      <View style={styles.routineHeader}>
        <View style={styles.routineHeaderText}>
          <Text style={styles.routineName}>
            {routine?.name || 'Unnamed Routine'}
          </Text>

          {routine?.description ? (
            <Text style={styles.routineDescription}>{routine.description}</Text>
          ) : null}
        </View>

        {Number(routine?.active) === 1 ? (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Active</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.daysContainer}>
        {WEEK_DAYS.map(weekDay => {
          const routineDay = dayMap.get(weekDay.id);

          const templateName = routineDay?.template?.name || '—';

          return (
            <View key={weekDay.id} style={styles.dayPill}>
              <Text style={styles.dayPillText} numberOfLines={1}>
                {weekDay.shortLabel}: {templateName}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          onPress={() => onEdit?.(routine)}
          disabled={actionsDisabled}
          style={({ pressed }) => [
            styles.editButton,

            pressed && !actionsDisabled && styles.buttonPressed,

            actionsDisabled && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>

        <Pressable
          onPress={() => onDelete?.(routine)}
          disabled={actionsDisabled}
          style={({ pressed }) => [
            styles.deleteButton,

            pressed && !actionsDisabled && styles.buttonPressed,

            actionsDisabled && styles.buttonDisabled,
          ]}
        >
          {deleting ? (
            <ActivityIndicator size="small" color={COLORS.TEXT} />
          ) : (
            <Text style={styles.deleteButtonText}>Delete</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
