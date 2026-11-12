import React, { useCallback, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { COLORS, styles } from './DocumentsSettings.styles';

const DOCUMENT_CONFIG = {
  admission: {
    endpoint: '/api/settings/v1/admission-documents',

    title: 'Admission Documents',

    description:
      'Choose the document labels shown on the admission form and whether each upload is mandatory.',

    placeholder: 'e.g. Immunization record',

    defaultMandatory: false,
  },

  personnel: {
    endpoint: '/api/settings/v1/personnel-documents',

    title: 'Teacher/Staff Documents',

    description:
      'Choose the document labels required when adding or editing teachers and staff members.',

    placeholder: 'e.g. Employment certificate',

    defaultMandatory: true,
  },
};

function getErrorMessage(error, fallback) {
  return (
    error?.payload?.message ||
    error?.payload?.error ||
    error?.message ||
    fallback
  );
}

function normalizeItem(item) {
  const name = String(item?.name || '');

  const mandatory = Boolean(item?.mandatory);

  return {
    id: String(item?.id || ''),

    name,

    mandatory,

    /*
     * Saved values are kept separately so
     * the Save button can detect row changes.
     */
    savedName: name,

    savedMandatory: mandatory,
  };
}

function normalizeItems(response) {
  const items = Array.isArray(response?.items) ? response.items : [];

  return items.map(normalizeItem);
}

function RequirementSelector({
  value,
  pickerKey,
  openPickerKey,
  setOpenPickerKey,
  onChange,
  disabled = false,
}) {
  const isOpen = openPickerKey === pickerKey;

  const label = value ? 'Mandatory' : 'Optional';

  function toggleDropdown() {
    if (disabled) {
      return;
    }

    setOpenPickerKey(isOpen ? null : pickerKey);
  }

  function selectValue(nextValue) {
    if (disabled) {
      return;
    }

    onChange(nextValue);

    setOpenPickerKey(null);
  }

  return (
    <View style={styles.requirementSelector}>
      <Pressable
        disabled={disabled}
        onPress={toggleDropdown}
        style={({ pressed }) => [
          styles.requirementButton,

          isOpen && styles.requirementButtonOpen,

          disabled && styles.buttonDisabled,

          pressed && !disabled && styles.buttonPressed,
        ]}
      >
        <Text style={styles.requirementButtonText}>{label}</Text>

        <Text style={styles.chevron}>{isOpen ? '⌃' : '⌄'}</Text>
      </Pressable>

      {isOpen && !disabled ? (
        <View style={styles.requirementOptions}>
          <Pressable
            onPress={() => selectValue(true)}
            style={({ pressed }) => [
              styles.requirementOption,

              value && styles.requirementOptionSelected,

              pressed && styles.buttonPressed,
            ]}
          >
            <Text
              style={[
                styles.requirementOptionText,

                value && styles.requirementOptionTextSelected,
              ]}
            >
              Mandatory
            </Text>

            {value ? <Text style={styles.optionCheck}>✓</Text> : null}
          </Pressable>

          <Pressable
            onPress={() => selectValue(false)}
            style={({ pressed }) => [
              styles.requirementOption,

              !value && styles.requirementOptionSelected,

              pressed && styles.buttonPressed,
            ]}
          >
            <Text
              style={[
                styles.requirementOptionText,

                !value && styles.requirementOptionTextSelected,
              ]}
            >
              Optional
            </Text>

            {!value ? <Text style={styles.optionCheck}>✓</Text> : null}
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function DocumentRow({
  sectionKey,
  item,
  index,
  isMobile,
  openPickerKey,
  setOpenPickerKey,
  onChange,
  onSave,
  onDelete,
  saving,
  deleting,
}) {
  const changed =
    item.name.trim() !== item.savedName.trim() ||
    item.mandatory !== item.savedMandatory;

  const busy = saving || deleting;

  const saveDisabled = busy || !changed || !item.name.trim();

  return (
    <View style={styles.documentCard}>
      <View style={[styles.documentRow, isMobile && styles.documentRowMobile]}>
        {/* Document Name */}

        <View style={styles.documentNameColumn}>
          <Text style={styles.fieldLabel}>Document label</Text>

          <TextInput
            value={item.name}
            editable={!busy}
            onChangeText={value =>
              onChange(index, {
                name: value,
              })
            }
            placeholder="Document label"
            placeholderTextColor={COLORS.MUTED}
            style={[styles.textInput, busy && styles.buttonDisabled]}
          />
        </View>

        {/* Requirement */}

        <View
          style={[
            styles.requirementColumn,

            isMobile && styles.requirementColumnMobile,
          ]}
        >
          <Text style={styles.fieldLabel}>Requirement</Text>

          <RequirementSelector
            value={item.mandatory}
            pickerKey={`${sectionKey}:${item.id}`}
            openPickerKey={openPickerKey}
            setOpenPickerKey={setOpenPickerKey}
            disabled={busy}
            onChange={value =>
              onChange(index, {
                mandatory: value,
              })
            }
          />
        </View>

        {/* Actions */}

        <View style={[styles.rowActions, isMobile && styles.rowActionsMobile]}>
          <Pressable
            disabled={saveDisabled}
            onPress={() => onSave(item)}
            style={({ pressed }) => [
              styles.saveButton,

              isMobile && styles.mobileActionButton,

              saveDisabled && styles.buttonDisabled,

              pressed && !saveDisabled && styles.buttonPressed,
            ]}
          >
            {saving ? (
              <ActivityIndicator size="small" color={COLORS.TEXT} />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </Pressable>

          <Pressable
            disabled={busy}
            onPress={() => onDelete(item)}
            style={({ pressed }) => [
              styles.deleteButton,

              isMobile && styles.mobileActionButton,

              busy && styles.buttonDisabled,

              pressed && !busy && styles.buttonPressed,
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
    </View>
  );
}

function DocumentSection({
  sectionKey,
  items,
  setItems,

  draftName,
  setDraftName,

  draftMandatory,
  setDraftMandatory,

  isMobile,

  openPickerKey,
  setOpenPickerKey,

  creatingSection,
  savingRowKey,
  deletingRowKey,

  onAdd,
  onSave,
  onDelete,
}) {
  const config = DOCUMENT_CONFIG[sectionKey];

  const isCreating = creatingSection === sectionKey;

  function handleItemChange(index, patch) {
    setItems(previous =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  }

  return (
    <>
      {/* Add New Document */}

      <View style={styles.addSection}>
        <Text style={styles.sectionTitle}>{config.title}</Text>

        <Text style={styles.sectionDescription}>{config.description}</Text>

        <View style={[styles.addRow, isMobile && styles.addRowMobile]}>
          <View style={styles.addNameColumn}>
            <Text style={styles.fieldLabel}>Document label</Text>

            <TextInput
              value={draftName}
              editable={!isCreating}
              onChangeText={setDraftName}
              placeholder={config.placeholder}
              placeholderTextColor={COLORS.MUTED}
              returnKeyType="done"
              onSubmitEditing={() => {
                if (draftName.trim() && !isCreating) {
                  onAdd(sectionKey);
                }
              }}
              style={[styles.textInput, isCreating && styles.buttonDisabled]}
            />
          </View>

          <View
            style={[
              styles.requirementColumn,

              isMobile && styles.requirementColumnMobile,
            ]}
          >
            <Text style={styles.fieldLabel}>Requirement</Text>

            <RequirementSelector
              value={draftMandatory}
              pickerKey={`${sectionKey}:new`}
              openPickerKey={openPickerKey}
              setOpenPickerKey={setOpenPickerKey}
              disabled={isCreating}
              onChange={setDraftMandatory}
            />
          </View>

          <View
            style={[
              styles.addActionColumn,

              isMobile && styles.addActionColumnMobile,
            ]}
          >
            <Pressable
              disabled={isCreating || !draftName.trim()}
              onPress={() => onAdd(sectionKey)}
              style={({ pressed }) => [
                styles.addButton,

                isMobile && styles.mobileActionButton,

                (isCreating || !draftName.trim()) && styles.buttonDisabled,

                pressed &&
                  !isCreating &&
                  Boolean(draftName.trim()) &&
                  styles.buttonPressed,
              ]}
            >
              {isCreating ? (
                <ActivityIndicator size="small" color={COLORS.TEXT} />
              ) : (
                <Text style={styles.addButtonText}>+ Add Document</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>

      {/* Existing Documents */}

      <View style={styles.documentsList}>
        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No documents configured</Text>

            <Text style={styles.emptyDescription}>
              Documents added for this section will appear here.
            </Text>
          </View>
        ) : (
          items.map((item, index) => {
            const rowKey = `${sectionKey}:${item.id}`;

            return (
              <DocumentRow
                key={rowKey}
                sectionKey={sectionKey}
                item={item}
                index={index}
                isMobile={isMobile}
                openPickerKey={openPickerKey}
                setOpenPickerKey={setOpenPickerKey}
                onChange={handleItemChange}
                onSave={currentItem => onSave(sectionKey, currentItem)}
                onDelete={currentItem => onDelete(sectionKey, currentItem)}
                saving={savingRowKey === rowKey}
                deleting={deletingRowKey === rowKey}
              />
            );
          })
        )}
      </View>
    </>
  );
}

export default function DocumentsSettings() {
  const { width } = useWindowDimensions();

  const isMobile = width < 760;

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [admissionDocuments, setAdmissionDocuments] = useState([]);

  const [personnelDocuments, setPersonnelDocuments] = useState([]);

  /*
   * Admission screenshot uses Optional
   * as the default for a new document.
   */
  const [admissionDraftName, setAdmissionDraftName] = useState('');

  const [admissionDraftMandatory, setAdmissionDraftMandatory] = useState(false);

  /*
   * Teacher/Staff screenshot uses Mandatory
   * as the default for a new document.
   */
  const [personnelDraftName, setPersonnelDraftName] = useState('');

  const [personnelDraftMandatory, setPersonnelDraftMandatory] = useState(true);

  const [openPickerKey, setOpenPickerKey] = useState(null);

  const [creatingSection, setCreatingSection] = useState(null);

  const [savingRowKey, setSavingRowKey] = useState(null);

  const [deletingRowKey, setDeletingRowKey] = useState(null);

  /*
   * Load both document groups.
   */
  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const [admissionResponse, personnelResponse] = await Promise.all([
        api('/api/settings/v1/admission-documents', {
          method: 'GET',
        }),

        api('/api/settings/v1/personnel-documents', {
          method: 'GET',
        }),
      ]);

      setAdmissionDocuments(normalizeItems(admissionResponse));

      setPersonnelDocuments(normalizeItems(personnelResponse));
    } catch (error) {
      console.log('Documents settings load error:', error);

      setLoadError(getErrorMessage(error, 'Could not load document settings.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  function getItemsSetter(sectionKey) {
    return sectionKey === 'admission'
      ? setAdmissionDocuments
      : setPersonnelDocuments;
  }

  function getDraftData(sectionKey) {
    if (sectionKey === 'admission') {
      return {
        name: admissionDraftName,

        mandatory: admissionDraftMandatory,
      };
    }

    return {
      name: personnelDraftName,

      mandatory: personnelDraftMandatory,
    };
  }

  function resetDraft(sectionKey) {
    if (sectionKey === 'admission') {
      setAdmissionDraftName('');

      setAdmissionDraftMandatory(false);

      return;
    }

    setPersonnelDraftName('');

    setPersonnelDraftMandatory(true);
  }

  /*
   * POST:
   *
   * /admission-documents
   * /personnel-documents
   */
  async function handleAddDocument(sectionKey) {
    if (creatingSection) {
      return;
    }

    const config = DOCUMENT_CONFIG[sectionKey];

    if (!config) {
      return;
    }

    const draft = getDraftData(sectionKey);

    const name = String(draft.name || '').trim();

    if (!name) {
      Alert.alert('Document Label Required', 'Please enter a document label.');

      return;
    }

    const payload = {
      name,

      mandatory: Boolean(draft.mandatory),
    };

    try {
      setCreatingSection(sectionKey);

      setOpenPickerKey(null);

      const response = await api(config.endpoint, {
        method: 'POST',

        body: JSON.stringify(payload),
      });

      if (!response?.item?.id) {
        throw new Error('The server did not return the created document.');
      }

      const newItem = normalizeItem(response.item);

      const setItems = getItemsSetter(sectionKey);

      /*
       * New documents are appended at the end,
       * matching the backend list order.
       */
      setItems(previous => [...previous, newItem]);

      resetDraft(sectionKey);

      Alert.alert(
        'Document Added',
        `"${newItem.name}" has been added successfully.`,
      );
    } catch (error) {
      console.log(`${sectionKey} document add error:`, error);

      Alert.alert(
        'Could not add document',
        getErrorMessage(error, 'The document could not be added.'),
      );
    } finally {
      setCreatingSection(null);
    }
  }

  /*
   * PUT:
   *
   * /admission-documents/{id}
   * /personnel-documents/{id}
   */
  async function handleSaveDocument(sectionKey, item) {
    if (!item?.id || savingRowKey || deletingRowKey) {
      return;
    }

    const config = DOCUMENT_CONFIG[sectionKey];

    if (!config) {
      return;
    }

    const name = String(item.name || '').trim();

    if (!name) {
      Alert.alert('Document Label Required', 'Document label cannot be empty.');

      return;
    }

    const rowKey = `${sectionKey}:${item.id}`;

    const payload = {
      name,

      mandatory: Boolean(item.mandatory),
    };

    try {
      setSavingRowKey(rowKey);

      setOpenPickerKey(null);

      const response = await api(
        `${config.endpoint}/${encodeURIComponent(item.id)}`,
        {
          method: 'PUT',

          body: JSON.stringify(payload),
        },
      );

      if (!response?.item?.id) {
        throw new Error('The server did not return the updated document.');
      }

      const updatedItem = normalizeItem(response.item);

      const setItems = getItemsSetter(sectionKey);

      setItems(previous =>
        previous.map(currentItem =>
          String(currentItem.id) === String(item.id)
            ? updatedItem
            : currentItem,
        ),
      );

      Alert.alert(
        'Document Updated',
        `"${updatedItem.name}" has been saved successfully.`,
      );
    } catch (error) {
      console.log(`${sectionKey} document update error:`, error);

      Alert.alert(
        'Could not update document',
        getErrorMessage(error, 'The document could not be updated.'),
      );
    } finally {
      setSavingRowKey(null);
    }
  }

  /*
   * DELETE confirmation.
   */
  function handleDeleteDocument(sectionKey, item) {
    if (!item?.id || savingRowKey || deletingRowKey) {
      return;
    }

    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete "${item.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: () => deleteDocument(sectionKey, item),
        },
      ],
    );
  }

  /*
   * DELETE:
   *
   * /admission-documents/{id}
   * /personnel-documents/{id}
   */
  async function deleteDocument(sectionKey, item) {
    const config = DOCUMENT_CONFIG[sectionKey];

    if (!config || !item?.id) {
      return;
    }

    const rowKey = `${sectionKey}:${item.id}`;

    try {
      setDeletingRowKey(rowKey);

      setOpenPickerKey(null);

      await api(`${config.endpoint}/${encodeURIComponent(item.id)}`, {
        method: 'DELETE',
      });

      const setItems = getItemsSetter(sectionKey);

      setItems(previous =>
        previous.filter(
          currentItem => String(currentItem.id) !== String(item.id),
        ),
      );

      Alert.alert(
        'Document Deleted',
        `"${item.name}" has been deleted successfully.`,
      );
    } catch (error) {
      console.log(`${sectionKey} document delete error:`, error);

      Alert.alert(
        'Could not delete document',
        getErrorMessage(error, 'The document could not be deleted.'),
      );
    } finally {
      setDeletingRowKey(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color={COLORS.BLUE} />

        <Text style={styles.stateText}>Loading document settings...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.errorTitle}>Could not load documents</Text>

        <Text style={styles.errorDescription}>{loadError}</Text>

        <Pressable
          onPress={loadDocuments}
          style={({ pressed }) => [
            styles.retryButton,

            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={() => setOpenPickerKey(null)}
    >
      {/* Admission Documents */}

      <DocumentSection
        sectionKey="admission"
        items={admissionDocuments}
        setItems={setAdmissionDocuments}
        draftName={admissionDraftName}
        setDraftName={setAdmissionDraftName}
        draftMandatory={admissionDraftMandatory}
        setDraftMandatory={setAdmissionDraftMandatory}
        isMobile={isMobile}
        openPickerKey={openPickerKey}
        setOpenPickerKey={setOpenPickerKey}
        creatingSection={creatingSection}
        savingRowKey={savingRowKey}
        deletingRowKey={deletingRowKey}
        onAdd={handleAddDocument}
        onSave={handleSaveDocument}
        onDelete={handleDeleteDocument}
      />

      <View style={styles.sectionDivider} />

      {/* Teacher / Staff Documents */}

      <DocumentSection
        sectionKey="personnel"
        items={personnelDocuments}
        setItems={setPersonnelDocuments}
        draftName={personnelDraftName}
        setDraftName={setPersonnelDraftName}
        draftMandatory={personnelDraftMandatory}
        setDraftMandatory={setPersonnelDraftMandatory}
        isMobile={isMobile}
        openPickerKey={openPickerKey}
        setOpenPickerKey={setOpenPickerKey}
        creatingSection={creatingSection}
        savingRowKey={savingRowKey}
        deletingRowKey={deletingRowKey}
        onAdd={handleAddDocument}
        onSave={handleSaveDocument}
        onDelete={handleDeleteDocument}
      />
    </ScrollView>
  );
}
