// src/screens/Admin/Billing/AdminBillingTemplates.js

import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';

import { useFocusEffect } from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Dropdown } from 'react-native-element-dropdown';

import { WebView } from 'react-native-webview';

import { api } from '../../../api/client';

import styles from './AdminBillingTemplates.styles';

function extractHtmlTags(html) {
  const source = String(html || '');

  const matches = source.match(/__[A-Z0-9_]+__/g) || [];

  return Array.from(new Set(matches)).map(value => ({
    label: value,
    value,
  }));
}

export default function AdminBillingTemplates() {
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [docxMeta, setDocxMeta] = useState(null);

  const [templates, setTemplates] = useState([]);

  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const [templateName, setTemplateName] = useState('');

  const [templateHtml, setTemplateHtml] = useState('');

  const [isDefault, setIsDefault] = useState(true);

  const [selectedTag, setSelectedTag] = useState(null);

  const [selectedDocxFile, setSelectedDocxFile] = useState(null);

  const [choosingDocx, setChoosingDocx] = useState(false);

  const [savingTemplate, setSavingTemplate] = useState(false);

  const [previewLoading, setPreviewLoading] = useState(false);

  const [previewModalVisible, setPreviewModalVisible] = useState(false);

  const [previewHtml, setPreviewHtml] = useState('');

  const loadTemplateDetails = useCallback(async templateId => {
    const id = Number(templateId);

    if (!Number.isFinite(id)) {
      return;
    }

    const response = await api(
      `/api/billing/v2/templates/${encodeURIComponent(id)}`,
    );

    setSelectedTemplateId(Number(response?.id));

    setTemplateName(String(response?.name || ''));

    setTemplateHtml(String(response?.html || ''));

    setIsDefault(
      Number(response?.is_default) === 1 || response?.is_default === true,
    );
  }, []);

  const loadScreen = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [docxResponse, templatesResponse] = await Promise.all([
          api('/api/billing/v2/templates/docx'),

          api('/api/billing/v2/templates'),
        ]);

        setDocxMeta(docxResponse || null);

        const rows = Array.isArray(templatesResponse) ? templatesResponse : [];

        setTemplates(rows);

        const defaultTemplate =
          rows.find(
            item => Number(item?.is_default) === 1 || item?.is_default === true,
          ) || rows[0];

        if (defaultTemplate?.id) {
          await loadTemplateDetails(defaultTemplate.id);
        } else {
          setSelectedTemplateId(null);

          setTemplateName('');
          setTemplateHtml('');
          setIsDefault(false);
        }
      } catch (error) {
        console.log('Billing templates load error:', error);

        Alert.alert(
          'Templates',
          error?.message || 'Could not load billing templates.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loadTemplateDetails],
  );

  useFocusEffect(
    useCallback(() => {
      loadScreen();

      return undefined;
    }, [loadScreen]),
  );

  const htmlTagOptions = useMemo(
    () => extractHtmlTags(templateHtml),
    [templateHtml],
  );

  const docxPlaceholders = useMemo(() => {
    return Array.isArray(docxMeta?.placeholders) ? docxMeta.placeholders : [];
  }, [docxMeta]);

  const handleTemplateChange = useCallback(
    async item => {
      const id = Number(item?.value);

      if (!Number.isFinite(id)) {
        return;
      }

      try {
        setLoading(true);

        await loadTemplateDetails(id);
      } catch (error) {
        console.log('Template details error:', error);

        Alert.alert(
          'Templates',
          error?.message || 'Could not load the template.',
        );
      } finally {
        setLoading(false);
      }
    },
    [loadTemplateDetails],
  );

  const handleInsertTag = useCallback(item => {
    const value = String(item?.value || '');

    if (!value) {
      return;
    }

    setTemplateHtml(current => `${current}${current ? '\n' : ''}${value}`);

    setSelectedTag(null);
  }, []);

  const handlePreview = useCallback(async () => {
    const html = String(templateHtml || '');

    if (!html.trim()) {
      Alert.alert('Template Preview', 'Template HTML is required.');

      return;
    }

    if (previewLoading) {
      return;
    }

    try {
      setPreviewLoading(true);

      const response = await api('/api/billing/v2/templates/preview', {
        method: 'POST',

        body: JSON.stringify({
          html,
        }),
      });

      const renderedHtml = String(response?.html || '');

      if (!renderedHtml) {
        throw new Error('Preview HTML was not returned.');
      }

      setPreviewHtml(renderedHtml);

      setPreviewModalVisible(true);
    } catch (error) {
      console.log('Template preview error:', error);

      Alert.alert(
        'Template Preview',
        error?.message || 'Could not generate the template preview.',
      );
    } finally {
      setPreviewLoading(false);
    }
  }, [templateHtml, previewLoading]);

  const handleSave = useCallback(async () => {
    const templateId = Number(selectedTemplateId);

    const name = String(templateName || '').trim();

    const html = String(templateHtml || '');

    if (!Number.isFinite(templateId)) {
      Alert.alert('Template', 'A valid template is required.');

      return;
    }

    if (!name) {
      Alert.alert('Template', 'Template name is required.');

      return;
    }

    if (!html.trim()) {
      Alert.alert('Template', 'Template HTML is required.');

      return;
    }

    if (savingTemplate) {
      return;
    }

    try {
      setSavingTemplate(true);

      const response = await api(
        `/api/billing/v2/templates/${encodeURIComponent(templateId)}`,
        {
          method: 'PUT',

          body: JSON.stringify({
            name,
            html,
            is_default: isDefault === true,
          }),
        },
      );

      if (!response?.id) {
        throw new Error('Updated template ID was not returned.');
      }

      /*
       * Keep local state aligned with
       * the server response.
       */
      setSelectedTemplateId(Number(response.id));

      setTemplateName(String(response?.name || ''));

      setTemplateHtml(String(response?.html || ''));

      setIsDefault(
        Number(response?.is_default) === 1 || response?.is_default === true,
      );

      /*
       * Refresh the template list so
       * default/name changes are reflected.
       */
      const templatesResponse = await api('/api/billing/v2/templates');

      setTemplates(Array.isArray(templatesResponse) ? templatesResponse : []);

      Alert.alert('Template Saved', 'Billing template saved successfully.');
    } catch (error) {
      console.log('Save billing template error:', error);

      Alert.alert(
        'Template',
        error?.message || 'Could not save the billing template.',
      );
    } finally {
      setSavingTemplate(false);
    }
  }, [
    selectedTemplateId,
    templateName,
    templateHtml,
    isDefault,
    savingTemplate,
  ]);

  const handleChooseDocx = useCallback(async () => {
    if (choosingDocx) {
      return;
    }

    try {
      setChoosingDocx(true);

      const result = await pick({
        type: [types.docx],
        allowMultiSelection: false,
        mode: 'import',
      });

      const file = Array.isArray(result) ? result[0] : result;

      if (!file) {
        return;
      }

      setSelectedDocxFile({
        uri: file.uri,
        name: file.name || 'billing-template.docx',
        type:
          file.type ||
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: file.size || 0,
      });
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      console.log('DOCX picker error:', error);

      Alert.alert(
        'Word Template',
        error?.message || 'Could not select the Word template.',
      );
    } finally {
      setChoosingDocx(false);
    }
  }, [choosingDocx]);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading templates...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadScreen({
                refresh: true,
              })
            }
            tintColor="#67D1F0"
          />
        }
      >
        {/* DOCX section */}
        <View style={styles.docxCard}>
          <Text style={styles.cardTitle}>Word bill template (DOCX)</Text>

          <Text style={styles.cardDescription}>
            Keep your school name, logo, address, signature, and layout in Word.
            The app fills only bill values when a Word bill is downloaded.
          </Text>

          <Text style={styles.fieldLabel}>DOCX template</Text>

          <Pressable
            disabled={choosingDocx}
            onPress={handleChooseDocx}
            style={({ pressed }) => [
              styles.filePickerButton,

              choosingDocx && styles.controlDisabled,

              pressed && !choosingDocx && styles.controlPressed,
            ]}
          >
            {choosingDocx ? (
              <ActivityIndicator size="small" color="#67D1F0" />
            ) : (
              <MaterialCommunityIcons
                name="file-word-outline"
                size={18}
                color="#93C5FD"
              />
            )}

            <Text style={styles.filePickerText} numberOfLines={1}>
              {selectedDocxFile?.name || 'Choose File'}
            </Text>
          </Pressable>

          {docxMeta?.template ? (
            <Text style={styles.docxStatusText}>Word template available.</Text>
          ) : (
            <Text style={styles.docxStatusText}>
              No Word template uploaded. PDF bills continue to use the HTML
              template below.
            </Text>
          )}

          <Text style={styles.placeholderHeading}>
            Available DOCX placeholders
          </Text>

          <View style={styles.placeholderWrap}>
            {docxPlaceholders.map(item => (
              <View key={item} style={styles.placeholderChip}>
                <Text style={styles.placeholderChipText}>{`{{${item}}}`}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Template selector */}
        {templates.length > 1 ? (
          <>
            <Text style={styles.fieldLabel}>Template</Text>

            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              selectedTextStyle={styles.dropdownSelected}
              itemTextStyle={styles.dropdownItem}
              activeColor="#173B60"
              iconColor="#DCE7F5"
              data={templates.map(item => ({
                label: item?.name || `Template ${item?.id}`,
                value: Number(item?.id),
              }))}
              labelField="label"
              valueField="value"
              value={selectedTemplateId}
              onChange={handleTemplateChange}
            />
          </>
        ) : null}

        <View style={styles.templateActionsRow}>
          <View style={styles.nameField}>
            <Text style={styles.fieldLabel}>Template Name</Text>

            <TextInput
              value={templateName}
              onChangeText={setTemplateName}
              placeholder="Template name"
              placeholderTextColor="#718096"
              style={styles.input}
            />
          </View>

          <View style={styles.tagField}>
            <Text style={styles.fieldLabel}>Insert Tag</Text>

            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              selectedTextStyle={styles.dropdownSelected}
              placeholderStyle={styles.dropdownPlaceholder}
              itemTextStyle={styles.dropdownItem}
              activeColor="#173B60"
              iconColor="#DCE7F5"
              data={htmlTagOptions}
              labelField="label"
              valueField="value"
              value={selectedTag}
              placeholder="—"
              onChange={handleInsertTag}
            />
          </View>
        </View>

        <View style={styles.defaultRow}>
          <Text style={styles.defaultLabel}>Default</Text>

          <Pressable
            onPress={() => setIsDefault(current => !current)}
            style={[
              styles.defaultButton,

              isDefault && styles.defaultButtonActive,
            ]}
          >
            <Text style={styles.defaultButtonText}>
              {isDefault ? 'Yes' : 'No'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.fieldLabel}>HTML Template</Text>

        <TextInput
          value={templateHtml}
          onChangeText={setTemplateHtml}
          multiline
          textAlignVertical="top"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.htmlEditor}
        />

        <View style={styles.editorActions}>
          <Pressable
            disabled={previewLoading}
            onPress={handlePreview}
            style={({ pressed }) => [
              styles.previewButton,

              previewLoading && styles.controlDisabled,

              pressed && !previewLoading && styles.controlPressed,
            ]}
          >
            {previewLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="eye-outline"
                  size={17}
                  color="#FFFFFF"
                />

                <Text style={styles.previewButtonText}>Preview</Text>
              </>
            )}
          </Pressable>

          <Pressable
            disabled={savingTemplate}
            onPress={handleSave}
            style={({ pressed }) => [
              styles.saveButton,

              savingTemplate && styles.controlDisabled,

              pressed && !savingTemplate && styles.controlPressed,
            ]}
          >
            {savingTemplate ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="content-save-outline"
                  size={17}
                  color="#FFFFFF"
                />

                <Text style={styles.saveButtonText}>Save</Text>
              </>
            )}
          </Pressable>
        </View>

        <Text style={styles.previewTitle}>Preview</Text>

        <View style={styles.previewCard}>
          <WebView
            originWhitelist={['*']}
            source={{
              html: previewHtml,
            }}
            scrollEnabled={false}
            style={styles.webView}
          />
        </View>
      </ScrollView>
      <Modal
        visible={previewModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <View style={styles.previewModalBackdrop}>
          <View style={styles.previewModal}>
            <View style={styles.previewModalHeader}>
              <Text style={styles.previewModalTitle}>Template Preview</Text>

              <Pressable
                onPress={() => setPreviewModalVisible(false)}
                style={({ pressed }) => [
                  styles.previewModalCloseButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={23}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <View style={styles.previewWebViewContainer}>
              <WebView
                originWhitelist={['*']}
                source={{
                  html: previewHtml,
                }}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                renderLoading={() => (
                  <View style={styles.previewWebViewLoader}>
                    <ActivityIndicator size="large" color="#67D1F0" />

                    <Text style={styles.loadingText}>Loading preview...</Text>
                  </View>
                )}
                style={styles.previewModalWebView}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
