import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { COLORS, styles } from './StudentIdCardSettings.styles';

function normalizeHex(value, fallback) {
  const text = String(value || '').trim();

  if (/^#[0-9A-Fa-f]{6}$/.test(text)) {
    return text.toUpperCase();
  }

  return fallback;
}

function getOrientationFromLayout(layoutId, layouts) {
  const item = layouts.find(layout => layout?.id === layoutId);

  return item?.orientation || 'portrait';
}

export default function StudentIdCardSettings() {
  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [layouts, setLayouts] = useState([]);

  const [fonts, setFonts] = useState([]);

  const [selectedLayout, setSelectedLayout] = useState('');

  const [savedLayout, setSavedLayout] = useState('');

  const [orientation, setOrientation] = useState('portrait');

  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const [savedBackgroundColor, setSavedBackgroundColor] = useState('#FFFFFF');

  const [fontColor, setFontColor] = useState('#2929B3');

  const [savedFontColor, setSavedFontColor] = useState('#2929B3');

  const [fontFace, setFontFace] = useState('');

  const [savedFontFace, setSavedFontFace] = useState('');

  const [customDesign, setCustomDesign] = useState(null);

  const [fontPickerVisible, setFontPickerVisible] = useState(false);

  const [previewVisible, setPreviewVisible] = useState(false);

  const [designerVisible, setDesignerVisible] = useState(false);

  const [saving, setSaving] = useState(false);

  const loadDesign = useCallback(async () => {
    try {
      setLoading(true);

      setLoadError('');

      const response = await api('/api/settings/v1/id-card-design', {
        method: 'GET',
      });

      const design = response?.design || {};

      const apiLayouts = Array.isArray(response?.layouts)
        ? response.layouts
        : [];

      const apiFonts = Array.isArray(response?.fonts) ? response.fonts : [];

      const layout = String(design?.layout || '');

      const bg = normalizeHex(design?.background_color, '#FFFFFF');

      const fg = normalizeHex(design?.font_color, '#2929B3');

      const face = String(design?.font_face || apiFonts[0] || '');

      setLayouts(apiLayouts);

      setFonts(apiFonts);

      setSelectedLayout(layout);

      setSavedLayout(layout);

      setOrientation(
        design?.orientation || getOrientationFromLayout(layout, apiLayouts),
      );

      setBackgroundColor(bg);

      setSavedBackgroundColor(bg);

      setFontColor(fg);

      setSavedFontColor(fg);

      setFontFace(face);

      setSavedFontFace(face);

      setCustomDesign(design?.custom_design || null);
    } catch (error) {
      console.log('ID card design load error:', error);

      setLoadError(error?.message || 'Could not load ID card design.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDesign();
  }, [loadDesign]);

  const portraitLayouts = useMemo(
    () =>
      layouts.filter(
        item => item?.orientation === 'portrait' && item?.id !== 'custom',
      ),
    [layouts],
  );

  const landscapeLayouts = useMemo(
    () =>
      layouts.filter(
        item => item?.orientation === 'landscape' && item?.id !== 'custom',
      ),
    [layouts],
  );

  const changed = useMemo(() => {
    return (
      selectedLayout !== savedLayout ||
      normalizeHex(backgroundColor, '#FFFFFF') !==
        normalizeHex(savedBackgroundColor, '#FFFFFF') ||
      normalizeHex(fontColor, '#2929B3') !==
        normalizeHex(savedFontColor, '#2929B3') ||
      fontFace !== savedFontFace
    );
  }, [
    selectedLayout,
    savedLayout,
    backgroundColor,
    savedBackgroundColor,
    fontColor,
    savedFontColor,
    fontFace,
    savedFontFace,
  ]);

  function handleSelectLayout(layout) {
    if (!layout?.id) {
      return;
    }

    setSelectedLayout(layout.id);

    setOrientation(layout?.orientation || 'portrait');
  }

  function handleSelectCustom() {
    setSelectedLayout('custom');

    setOrientation(customDesign?.orientation || 'portrait');
  }

  async function handleSave() {
    if (saving || !selectedLayout) {
      return;
    }

    const bg = normalizeHex(backgroundColor, '');

    const fg = normalizeHex(fontColor, '');

    if (!bg) {
      Alert.alert(
        'Invalid Background Color',
        'Please enter a valid HEX color, for example #FFFFFF.',
      );

      return;
    }

    if (!fg) {
      Alert.alert(
        'Invalid Font Color',
        'Please enter a valid HEX color, for example #2929B3.',
      );

      return;
    }

    if (!fontFace) {
      Alert.alert('Font Required', 'Please select a font.');

      return;
    }

    try {
      setSaving(true);

      const payload = {
        layout: selectedLayout,

        background_color: bg,

        font_color: fg,

        font_face: fontFace,
      };

      const response = await api('/api/settings/v1/id-card-design', {
        method: 'PUT',

        body: JSON.stringify(payload),
      });

      if (!response?.ok) {
        throw new Error('The server did not confirm the ID card update.');
      }

      const design = response?.design || {};

      const finalLayout = String(design?.layout || selectedLayout);

      const finalBg = normalizeHex(design?.background_color, bg);

      const finalFg = normalizeHex(design?.font_color, fg);

      const finalFont = String(design?.font_face || fontFace);

      setSelectedLayout(finalLayout);

      setSavedLayout(finalLayout);

      setOrientation(design?.orientation || orientation);

      setBackgroundColor(finalBg);

      setSavedBackgroundColor(finalBg);

      setFontColor(finalFg);

      setSavedFontColor(finalFg);

      setFontFace(finalFont);

      setSavedFontFace(finalFont);

      setCustomDesign(design?.custom_design || customDesign);

      Alert.alert(
        'ID Card Design Updated',
        'The student ID card design has been saved successfully.',
      );
    } catch (error) {
      console.log('ID card design save error:', error);

      Alert.alert(
        'Could not save ID card design',
        error?.message || 'The ID card design could not be saved.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="small" color={COLORS.BLUE} />

          <Text style={styles.stateText}>Loading ID card design...</Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student ID Card</Text>

        <Text style={styles.errorText}>{loadError}</Text>

        <Pressable onPress={loadDesign} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student ID Card</Text>

        <Text style={styles.description}>
          Choose the design used when identity-card PDFs are downloaded from
          Students.
        </Text>

        <View style={styles.layoutGroups}>
          <LayoutGroup
            title="Portrait"
            layouts={portraitLayouts}
            selectedLayout={selectedLayout}
            onSelect={handleSelectLayout}
          />

          <LayoutGroup
            title="Landscape"
            layouts={landscapeLayouts}
            selectedLayout={selectedLayout}
            onSelect={handleSelectLayout}
          />
        </View>

        {/* Custom Layout */}

        <View style={styles.customGroup}>
          <Text style={styles.groupTitle}>Build your own</Text>

          <Pressable
            onPress={handleSelectCustom}
            style={[
              styles.customCard,

              selectedLayout === 'custom' && styles.customCardSelected,
            ]}
          >
            <View style={styles.customPreviewIcon}>
              <Text style={styles.customPreviewPlus}>+</Text>
            </View>

            <View style={styles.customInfo}>
              <Text style={styles.customTitle}>Custom layout</Text>

              <Text style={styles.customSubtitle}>
                Drag, resize and position every element
              </Text>
            </View>

            <Pressable
              onPress={() => {
                handleSelectCustom();

                setDesignerVisible(true);
              }}
              style={styles.openDesignerButton}
            >
              <Text style={styles.openDesignerText}>Open designer →</Text>
            </Pressable>
          </Pressable>
        </View>

        {/* Design Controls */}

        <View style={styles.designControls}>
          <ColorField
            label="Background color"
            value={backgroundColor}
            onChangeText={setBackgroundColor}
          />

          <ColorField
            label="Font color"
            value={fontColor}
            onChangeText={setFontColor}
          />

          <View style={styles.controlField}>
            <Text style={styles.label}>Font</Text>

            <Pressable
              onPress={() => setFontPickerVisible(true)}
              style={styles.selectField}
            >
              <Text style={styles.selectValue} numberOfLines={1}>
                {fontFace || 'Select font'}
              </Text>

              <Text style={styles.selectArrow}>⌄</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomActions}>
          <Pressable
            onPress={() => setPreviewVisible(true)}
            style={({ pressed }) => [
              styles.previewButton,

              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.previewButtonText}>Preview</Text>
          </Pressable>

          <Pressable
            onPress={handleSave}
            disabled={saving || !changed}
            style={({ pressed }) => [
              styles.primaryButton,

              (saving || !changed) && styles.buttonDisabled,

              pressed && !saving && changed && styles.buttonPressed,
            ]}
          >
            {saving ? (
              <ActivityIndicator size="small" color={COLORS.TEXT} />
            ) : (
              <Text style={styles.primaryButtonText}>Save ID Card Design</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* Font Picker */}

      <Modal
        visible={fontPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFontPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.fontModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Font</Text>

              <Pressable
                onPress={() => setFontPickerVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            {fonts.map(font => (
              <Pressable
                key={font}
                onPress={() => {
                  setFontFace(font);

                  setFontPickerVisible(false);
                }}
                style={[
                  styles.fontOption,

                  fontFace === font && styles.fontOptionSelected,
                ]}
              >
                <Text style={styles.fontOptionText}>{font}</Text>

                {fontFace === font ? (
                  <Text style={styles.selectedCheck}>✓</Text>
                ) : null}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      {/* Preview */}

      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.previewModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ID Card Preview</Text>

              <Pressable
                onPress={() => setPreviewVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            <IdCardPreview
              layout={selectedLayout}
              orientation={orientation}
              backgroundColor={normalizeHex(backgroundColor, '#FFFFFF')}
              fontColor={normalizeHex(fontColor, '#2929B3')}
              customDesign={customDesign}
            />
          </View>
        </View>
      </Modal>

      {/* Custom Designer Shell */}

      <Modal
        visible={designerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDesignerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.designerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Custom ID Card Designer</Text>

              <Pressable
                onPress={() => setDesignerVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            <Text style={styles.designerDescription}>
              Custom layout is available. Drag, resize and element editing will
              be connected in the next phase.
            </Text>

            <IdCardPreview
              layout="custom"
              orientation={customDesign?.orientation || 'portrait'}
              backgroundColor={
                customDesign?.background_color || backgroundColor
              }
              fontColor={fontColor}
              customDesign={customDesign}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

function LayoutGroup({ title, layouts, selectedLayout, onSelect }) {
  return (
    <View style={styles.layoutGroup}>
      <Text style={styles.groupTitle}>{title}</Text>

      <View style={styles.layoutCards}>
        {layouts.map(layout => (
          <LayoutOptionCard
            key={layout.id}
            layout={layout}
            selected={selectedLayout === layout.id}
            onPress={() => onSelect(layout)}
          />
        ))}
      </View>
    </View>
  );
}

function LayoutOptionCard({ layout, selected, onPress }) {
  const landscape = layout?.orientation === 'landscape';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.layoutCard,

        selected && styles.layoutCardSelected,

        pressed && styles.buttonPressed,
      ]}
    >
      <View
        style={[
          styles.cardIllustration,

          landscape
            ? styles.cardIllustrationLandscape
            : styles.cardIllustrationPortrait,
        ]}
      >
        <View style={styles.illustrationAccent} />

        <View style={styles.illustrationPhoto} />

        <View style={styles.illustrationLine} />
      </View>

      <Text style={styles.layoutLabel} numberOfLines={1}>
        {layout?.label}
      </Text>
    </Pressable>
  );
}

function ColorField({ label, value, onChangeText }) {
  const previewColor = normalizeHex(value, '#FFFFFF');

  return (
    <View style={styles.controlField}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.colorInputRow}>
        <View
          style={[
            styles.colorPreview,

            {
              backgroundColor: previewColor,
            },
          ]}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={7}
          style={styles.colorTextInput}
        />
      </View>
    </View>
  );
}

function IdCardPreview({ orientation, backgroundColor, fontColor }) {
  const landscape = orientation === 'landscape';

  return (
    <View style={styles.previewStage}>
      <View
        style={[
          styles.previewCard,

          landscape ? styles.previewCardLandscape : styles.previewCardPortrait,

          {
            backgroundColor,
          },
        ]}
      >
        <View style={styles.previewPhoto}>
          <Text style={styles.previewPhotoText}>PHOTO</Text>
        </View>

        <Text
          style={[
            styles.previewStudentName,

            {
              color: fontColor,
            },
          ]}
        >
          Alex Morgan
        </Text>

        <Text
          style={[
            styles.previewStudentRole,

            {
              color: fontColor,
            },
          ]}
        >
          STUDENT
        </Text>

        <Text
          style={[
            styles.previewDetails,

            {
              color: fontColor,
            },
          ]}
        >
          Class V • Roll 01
        </Text>
      </View>
    </View>
  );
}
