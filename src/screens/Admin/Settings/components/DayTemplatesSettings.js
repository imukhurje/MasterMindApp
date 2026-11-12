import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { api } from '../../../../api/client';

import { COLORS, styles } from './DayTemplatesSettings.styles';
import DayTemplateModal from './DayTemplateModal';
import PeriodModal from './PeriodModal';

function normalizePeriods(periods) {
  if (!Array.isArray(periods)) {
    return [];
  }

  return [...periods].sort(
    (first, second) =>
      Number(first?.period_order || 0) - Number(second?.period_order || 0),
  );
}

function normalizeTemplates(response) {
  if (!Array.isArray(response)) {
    return [];
  }

  return response.map(template => ({
    ...template,

    periods: normalizePeriods(template?.periods),
  }));
}

export default function DayTemplatesSettings() {
  const [dayTemplates, setDayTemplates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadError, setLoadError] = useState('');

  const [editTemplateModalVisible, setEditTemplateModalVisible] =
    useState(false);

  const [periodModalVisible, setPeriodModalVisible] = useState(false);
  const [periodModalMode, setPeriodModalMode] = useState('add');
  const [selectedPeriodTemplate, setSelectedPeriodTemplate] = useState(null);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [savingPeriod, setSavingPeriod] = useState(false);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [templateModalMode, setTemplateModalMode] = useState('add');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [deletingTemplateId, setDeletingTemplateId] = useState(null);

  const loadDayTemplates = useCallback(async (mode = 'initial') => {
    try {
      if (mode === 'initial') {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setLoadError('');

      const response = await api('/api/routines/v1/day-templates', {
        method: 'GET',
      });

      const templates = normalizeTemplates(response);

      setDayTemplates(templates);
    } catch (error) {
      console.log('Day templates load error:', error);

      setLoadError(error?.message || 'Could not load day templates.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDayTemplates('initial');
  }, [loadDayTemplates]);

  const templateCountLabel = useMemo(() => {
    const count = dayTemplates.length;

    return `${count} ${count === 1 ? 'template' : 'templates'}`;
  }, [dayTemplates.length]);

  function handleNewDayTemplate() {
    if (savingTemplate) {
      return;
    }

    setTemplateModalMode('add');

    setEditingTemplate(null);

    setTemplateModalVisible(true);
  }

  function handleAddPeriod(template) {
    if (!template?.id || savingPeriod) {
      return;
    }

    setPeriodModalMode('add');

    setSelectedPeriodTemplate(template);

    setEditingPeriod(null);

    setPeriodModalVisible(true);
  }

  function handleCloseAddPeriod() {
    if (savingPeriod) {
      return;
    }

    setAddPeriodModalVisible(false);

    setAddPeriodTemplate(null);
  }

  async function handleSavePeriod(values) {
    const templateId = selectedPeriodTemplate?.id;

    const periodId = editingPeriod?.id;

    const isEdit = periodModalMode === 'edit';

    if (!templateId || savingPeriod) {
      return;
    }

    if (isEdit && !periodId) {
      return;
    }

    const label = String(values?.label || '').trim();

    const startTime = String(values?.start_time || '').trim();

    const endTime = String(values?.end_time || '').trim();

    if (!label || !startTime || !endTime) {
      Alert.alert(
        'Invalid Period',
        'Label, start time and end time are required.',
      );

      return;
    }

    try {
      setSavingPeriod(true);

      const payload = {
        label,
        start_time: startTime,
        end_time: endTime,
      };

      console.log(
        isEdit ? 'Update period payload:' : 'Add period payload:',
        payload,
      );

      const response = await api(
        isEdit
          ? `/api/routines/v1/periods/${periodId}`
          : `/api/routines/v1/day-templates/${templateId}/periods`,
        {
          method: isEdit ? 'PUT' : 'POST',

          body: JSON.stringify(payload),
        },
      );

      if (!response?.id) {
        throw new Error(
          isEdit
            ? 'The server did not return the updated period.'
            : 'The server did not return the created period.',
        );
      }

      setDayTemplates(previous =>
        previous.map(template => {
          if (String(template?.id) !== String(templateId)) {
            return template;
          }

          const currentPeriods = Array.isArray(template?.periods)
            ? template.periods
            : [];

          let nextPeriods;

          if (isEdit) {
            nextPeriods = currentPeriods.map(currentPeriod =>
              String(currentPeriod?.id) === String(periodId)
                ? {
                    ...currentPeriod,
                    ...response,
                  }
                : currentPeriod,
            );
          } else {
            nextPeriods = [...currentPeriods, response];
          }

          return {
            ...template,

            periods: normalizePeriods(nextPeriods),
          };
        }),
      );

      setPeriodModalVisible(false);
      setSelectedPeriodTemplate(null);
      setEditingPeriod(null);
      setPeriodModalMode('add');

      Alert.alert(
        isEdit ? 'Period Updated' : 'Period Added',

        isEdit
          ? 'The period has been updated successfully.'
          : 'The period has been added successfully.',
      );
    } catch (error) {
      console.log(
        isEdit ? 'Period update API error:' : 'Add period API error:',
        error,
      );

      Alert.alert(
        isEdit ? 'Could not update period' : 'Could not add period',

        error?.message ||
          (isEdit
            ? 'The period could not be updated.'
            : 'The period could not be added.'),
      );
    } finally {
      setSavingPeriod(false);
    }
  }

  function handleCloseTemplateModal() {
    if (savingTemplate) {
      return;
    }

    setTemplateModalVisible(false);

    setTemplateModalMode('add');

    setEditingTemplate(null);
  }

  function handleEditTemplate(template) {
    if (!template?.id || savingTemplate) {
      return;
    }

    setTemplateModalMode('edit');

    setEditingTemplate(template);

    setTemplateModalVisible(true);
  }

  async function handleSaveTemplate(values) {
    const isEdit = templateModalMode === 'edit';

    const templateId = editingTemplate?.id;

    if (savingTemplate || (isEdit && !templateId)) {
      return;
    }

    const name = String(values?.name || '').trim();

    const description = String(values?.description || '').trim();

    if (!name) {
      Alert.alert('Template Name Required', 'Please enter a template name.');

      return;
    }

    try {
      setSavingTemplate(true);

      const payload = {
        name,

        description: description || null,
      };

      console.log(
        isEdit ? 'Day template update payload:' : 'New day template payload:',
        payload,
      );

      const response = await api(
        isEdit
          ? `/api/routines/v1/day-templates/${templateId}`
          : '/api/routines/v1/day-templates',
        {
          method: isEdit ? 'PUT' : 'POST',

          body: JSON.stringify(payload),
        },
      );

      if (!response?.id) {
        throw new Error(
          isEdit
            ? 'The server did not return the updated day template.'
            : 'The server did not return the created day template.',
        );
      }

      if (isEdit) {
        const updatedTemplate = {
          ...response,

          periods: normalizePeriods(response?.periods),
        };

        setDayTemplates(previous =>
          previous.map(template =>
            String(template?.id) === String(templateId)
              ? updatedTemplate
              : template,
          ),
        );
      } else {
        /*
         * POST response currently does not contain periods,
         * so initialise it with an empty array.
         */
        const createdTemplate = {
          ...response,

          periods: Array.isArray(response?.periods)
            ? normalizePeriods(response.periods)
            : [],
        };

        /*
         * GET currently returns newer templates first,
         * so add the new template at the top.
         */
        setDayTemplates(previous => [createdTemplate, ...previous]);
      }

      setTemplateModalVisible(false);

      setTemplateModalMode('add');

      setEditingTemplate(null);

      Alert.alert(
        isEdit ? 'Day Template Updated' : 'Day Template Created',

        isEdit
          ? 'The day template has been updated successfully.'
          : 'The new day template has been created successfully.',
      );
    } catch (error) {
      console.log(
        isEdit ? 'Day template update error:' : 'Day template create error:',
        error,
      );

      Alert.alert(
        isEdit ? 'Could not update template' : 'Could not create template',

        error?.message ||
          (isEdit
            ? 'The day template could not be updated.'
            : 'The day template could not be created.'),
      );
    } finally {
      setSavingTemplate(false);
    }
  }

  function handleCloseEditTemplate() {
    if (savingTemplate) {
      return;
    }

    setEditTemplateModalVisible(false);

    setEditingTemplate(null);
  }

  async function handleSaveEditedTemplate(values) {
    const templateId = editingTemplate?.id;

    if (!templateId || savingTemplate) {
      return;
    }

    const cleanName = String(values?.name || '').trim();

    const cleanDescription = String(values?.description || '').trim();

    if (!cleanName) {
      Alert.alert('Template Name Required', 'Please enter a template name.');

      return;
    }

    try {
      setSavingTemplate(true);

      const payload = {
        name: cleanName,

        description: cleanDescription || null,
      };

      console.log('Day template update payload:', payload);

      const response = await api(
        `/api/routines/v1/day-templates/${templateId}`,
        {
          method: 'PUT',

          body: JSON.stringify(payload),
        },
      );

      if (!response?.id) {
        throw new Error('The server did not return the updated day template.');
      }

      const updatedTemplate = {
        ...response,

        periods: normalizePeriods(response?.periods),
      };

      /*
       * Update only the edited card.
       * No need to reload the full list.
       */
      setDayTemplates(previous =>
        previous.map(template =>
          String(template?.id) === String(templateId)
            ? updatedTemplate
            : template,
        ),
      );

      setEditTemplateModalVisible(false);

      setEditingTemplate(null);

      Alert.alert(
        'Day Template Updated',
        'The day template has been updated successfully.',
      );
    } catch (error) {
      console.log('Day template update error:', error);

      Alert.alert(
        'Could not update template',
        error?.message || 'The day template could not be updated.',
      );
    } finally {
      setSavingTemplate(false);
    }
  }

  function handleDeleteTemplate(template) {
    if (
      !template?.id ||
      deletingTemplateId !== null ||
      savingTemplate ||
      savingPeriod
    ) {
      return;
    }

    Alert.alert(
      'Delete Day Template',
      `Are you sure you want to delete "${template?.name || 'this template'}"?`,
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
              setDeletingTemplateId(template.id);

              const response = await api(
                `/api/routines/v1/day-templates/${template.id}`,
                {
                  method: 'DELETE',
                },
              );

              if (!response?.ok) {
                throw new Error(
                  'The server did not confirm the template deletion.',
                );
              }

              /*
               * Remove only the deleted template
               * from the local list.
               */
              setDayTemplates(previous =>
                previous.filter(
                  currentTemplate =>
                    String(currentTemplate?.id) !== String(template.id),
                ),
              );

              Alert.alert(
                'Day Template Deleted',
                `"${
                  template?.name || 'Day Template'
                }" has been deleted successfully.`,
              );
            } catch (error) {
              console.log('Day template delete error:', error);

              Alert.alert(
                'Could not delete template',
                error?.message || 'The day template could not be deleted.',
              );
            } finally {
              setDeletingTemplateId(null);
            }
          },
        },
      ],
    );
  }

  function handleClosePeriodModal() {
    if (savingPeriod) {
      return;
    }

    setPeriodModalVisible(false);

    setSelectedPeriodTemplate(null);

    setEditingPeriod(null);

    setPeriodModalMode('add');
  }

  function handleEditPeriod(template, period) {
    if (!template?.id || !period?.id || savingPeriod) {
      return;
    }

    setPeriodModalMode('edit');

    setSelectedPeriodTemplate(template);

    setEditingPeriod(period);

    setPeriodModalVisible(true);
  }

  if (loading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color={COLORS.BLUE} />

        <Text style={styles.stateText}>Loading day templates...</Text>
      </View>
    );
  }

  if (loadError && dayTemplates.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.errorTitle}>Could not load day templates</Text>

        <Text style={styles.errorDescription}>{loadError}</Text>

        <Pressable
          onPress={() => loadDayTemplates('initial')}
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
              Create a reusable list of periods for a day.
            </Text>

            <Text style={styles.countText}>{templateCountLabel}</Text>
          </View>

          <View style={styles.topActions}>
            <Pressable
              onPress={() => loadDayTemplates('refresh')}
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
              onPress={handleNewDayTemplate}
              style={({ pressed }) => [
                styles.newTemplateButton,

                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.newTemplateButtonText}>
                + New Day Template
              </Text>
            </Pressable>
          </View>
        </View>

        {loadError ? (
          <View style={styles.inlineError}>
            <Text style={styles.inlineErrorText}>{loadError}</Text>
          </View>
        ) : null}

        {dayTemplates.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🗓️</Text>

            <Text style={styles.emptyTitle}>No day templates found</Text>

            <Text style={styles.emptyDescription}>
              Create a day template to start defining periods.
            </Text>
          </View>
        ) : (
          <View style={styles.templatesContainer}>
            {dayTemplates.map(template => (
              <DayTemplateCard
                key={template.id}
                template={template}
                onAddPeriod={handleAddPeriod}
                onEditTemplate={handleEditTemplate}
                onDeleteTemplate={handleDeleteTemplate}
                onEditPeriod={handleEditPeriod}
                deleting={String(deletingTemplateId) === String(template.id)}
                actionsDisabled={
                  deletingTemplateId !== null || savingTemplate || savingPeriod
                }
              />
            ))}
          </View>
        )}
      </ScrollView>

      <DayTemplateModal
        visible={templateModalVisible}
        mode={templateModalMode}
        template={editingTemplate}
        saving={savingTemplate}
        onClose={handleCloseTemplateModal}
        onSave={handleSaveTemplate}
      />

      <PeriodModal
        visible={periodModalVisible}
        mode={periodModalMode}
        template={selectedPeriodTemplate}
        period={editingPeriod}
        saving={savingPeriod}
        onClose={handleClosePeriodModal}
        onSave={handleSavePeriod}
      />
    </View>
  );
}

function DayTemplateCard({
  template,
  onAddPeriod,
  onEditTemplate,
  onDeleteTemplate,
  onEditPeriod,
  deleting = false,
  actionsDisabled = false,
}) {
  const { width } = useWindowDimensions();

  const compact = width < 700;

  const periods = Array.isArray(template?.periods) ? template.periods : [];

  return (
    <View style={[styles.templateCard, compact && styles.templateCardCompact]}>
      <View style={styles.templateHeader}>
        <View style={styles.templateHeaderText}>
          <Text style={styles.templateName}>
            {template?.name || 'Unnamed Day Template'}
          </Text>

          {template?.description ? (
            <Text style={styles.templateDescription}>
              {template.description}
            </Text>
          ) : null}
        </View>

        <View style={styles.periodCountBadge}>
          <Text style={styles.periodCountText}>
            {periods.length} {periods.length === 1 ? 'period' : 'periods'}
          </Text>
        </View>
      </View>

      {periods.length > 0 ? (
        <View
          style={[
            styles.periodsContainer,

            compact && styles.periodsContainerCompact,
          ]}
        >
          {periods.map(period => (
            <PeriodPill
              key={period.id}
              period={period}
              compact={compact}
              disabled={actionsDisabled}
              onEdit={() => onEditPeriod?.(template, period)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.noPeriodsContainer}>
          <Text style={styles.noPeriodsText}>No periods added yet.</Text>
        </View>
      )}

      <View
        style={[
          styles.templateActions,

          compact && styles.templateActionsCompact,
        ]}
      >
        <Pressable
          onPress={() => onAddPeriod?.(template)}
          disabled={actionsDisabled}
          style={({ pressed }) => [
            styles.secondaryButton,

            compact && styles.actionButtonCompact,

            pressed && !actionsDisabled && styles.buttonPressed,

            actionsDisabled && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.secondaryButtonText}>+ Period</Text>
        </Pressable>

        <Pressable
          onPress={() => onEditTemplate?.(template)}
          disabled={actionsDisabled}
          style={({ pressed }) => [
            styles.secondaryButton,

            compact && styles.actionButtonCompact,

            pressed && !actionsDisabled && styles.buttonPressed,

            actionsDisabled && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.secondaryButtonText}>Edit</Text>
        </Pressable>

        <Pressable
          onPress={() => onDeleteTemplate?.(template)}
          disabled={actionsDisabled}
          style={({ pressed }) => [
            styles.deleteButton,

            compact && styles.actionButtonCompact,

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

function PeriodPill({ period, onEdit, compact = false, disabled = false }) {
  return (
    <View style={[styles.periodPill, compact && styles.periodPillCompact]}>
      <View style={styles.periodInformation}>
        <Text style={styles.periodLabel} numberOfLines={1}>
          #{period?.period_order} {period?.label || 'Period'}
        </Text>

        <Text style={styles.periodTime} numberOfLines={1}>
          {period?.start_time || '--:--'}
          {'  →  '}
          {period?.end_time || '--:--'}
        </Text>
      </View>

      <Pressable
        onPress={onEdit}
        disabled={disabled}
        hitSlop={5}
        style={({ pressed }) => [
          styles.periodEditButton,

          pressed && !disabled && styles.buttonPressed,

          disabled && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.periodEditIcon}>✏️</Text>
      </Pressable>
    </View>
  );
}
