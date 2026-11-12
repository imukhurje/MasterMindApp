import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  PanResponder,
  Pressable,
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

import { COLORS, styles } from './BrandLogoSettings.styles';

const DEFAULT_MIN_LOGO_HEIGHT = 32;
const DEFAULT_MAX_LOGO_HEIGHT = 120;
const DEFAULT_LOGO_HEIGHT = 64;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getNumber(value, fallback) {
  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function LogoHeightSlider({
  value,
  minimumValue,
  maximumValue,
  disabled = false,
  onChange,
}) {
  const [trackWidth, setTrackWidth] = useState(0);

  const currentValue = clamp(Number(value), minimumValue, maximumValue);

  const percentage =
    maximumValue === minimumValue
      ? 0
      : (currentValue - minimumValue) / (maximumValue - minimumValue);

  const updateFromPosition = useCallback(
    x => {
      if (disabled || !trackWidth) {
        return;
      }

      const safeX = clamp(Number(x) || 0, 0, trackWidth);

      const ratio = safeX / trackWidth;

      const nextValue = minimumValue + ratio * (maximumValue - minimumValue);

      onChange?.(Math.round(nextValue));
    },
    [disabled, maximumValue, minimumValue, onChange, trackWidth],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,

        onMoveShouldSetPanResponder: () => !disabled,

        onPanResponderGrant: event => {
          updateFromPosition(event.nativeEvent.locationX);
        },

        onPanResponderMove: event => {
          updateFromPosition(event.nativeEvent.locationX);
        },
      }),
    [disabled, updateFromPosition],
  );

  return (
    <View style={[styles.sliderContainer, disabled && styles.controlDisabled]}>
      <View
        style={styles.sliderTrackTouchArea}
        onLayout={event => {
          setTrackWidth(event.nativeEvent.layout.width);
        }}
        {...panResponder.panHandlers}
      >
        <View style={styles.sliderTrack}>
          <View
            style={[
              styles.sliderProgress,
              {
                width: `${percentage * 100}%`,
              },
            ]}
          />

          <View
            style={[
              styles.sliderThumb,
              {
                left: `${percentage * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.sliderLimits}>
        <Text style={styles.sliderLimitText}>{minimumValue}px</Text>

        <Text style={styles.sliderLimitText}>{maximumValue}px</Text>
      </View>
    </View>
  );
}

export default function BrandLogoSettings() {
  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [logoConfig, setLogoConfig] = useState({
    logoUrl: null,
    imageUrl: null,
    effectiveImageUrl: '',
    usesCustomLogo: false,
    minimumHeight: DEFAULT_MIN_LOGO_HEIGHT,
    maximumHeight: DEFAULT_MAX_LOGO_HEIGHT,
  });

  const [logoHeight, setLogoHeight] = useState(DEFAULT_LOGO_HEIGHT);

  const [savedLogoHeight, setSavedLogoHeight] = useState(DEFAULT_LOGO_HEIGHT);

  const [selectedFile, setSelectedFile] = useState(null);

  const [selectingFile, setSelectingFile] = useState(false);

  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [deletingLogo, setDeletingLogo] = useState(false);

  const [savingLogoHeight, setSavingLogoHeight] = useState(false);

  const loadLogoConfig = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');

      const response = await api('/api/settings/v1/logo-config', {
        method: 'GET',
      });

      const minimumHeight = getNumber(
        response?.min_logo_height,
        DEFAULT_MIN_LOGO_HEIGHT,
      );

      const maximumHeight = getNumber(
        response?.max_logo_height,
        DEFAULT_MAX_LOGO_HEIGHT,
      );

      const currentHeight = clamp(
        getNumber(response?.logo_height, DEFAULT_LOGO_HEIGHT),
        minimumHeight,
        maximumHeight,
      );

      setLogoConfig({
        logoUrl: response?.logo_url || null,

        imageUrl: response?.image_url || null,

        effectiveImageUrl:
          response?.effective_image_url || response?.image_url || '',

        usesCustomLogo: Boolean(response?.uses_custom_logo),

        minimumHeight,
        maximumHeight,
      });

      setLogoHeight(currentHeight);

      setSavedLogoHeight(currentHeight);
    } catch (error) {
      console.log('Logo config load error:', error);

      setLoadError(error?.message || 'Could not load logo settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogoConfig();
  }, [loadLogoConfig]);

  const logoHeightChanged = logoHeight !== savedLogoHeight;

  const operationInProgress = uploadingLogo || deletingLogo || savingLogoHeight;

  async function handleChooseLogo() {
    if (selectingFile || operationInProgress) {
      return;
    }

    try {
      setSelectingFile(true);

      const result = await pick({
        type: [types.images],
        allowMultiSelection: false,
        mode: 'import',
      });

      const file = Array.isArray(result) ? result[0] : null;

      if (!file) {
        return;
      }

      if (file?.error || file?.hasRequestedType === false) {
        Alert.alert('Invalid Image', 'Please select a valid image file.');

        return;
      }

      setSelectedFile(file);
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      console.log('Logo image picker error:', error);

      Alert.alert(
        'Could not select image',
        error?.message || 'The logo image could not be selected.',
      );
    } finally {
      setSelectingFile(false);
    }
  }

  async function handleUploadLogo() {
    if (!selectedFile?.uri || uploadingLogo || deletingLogo) {
      return;
    }

    try {
      setUploadingLogo(true);

      const formData = new FormData();

      formData.append('logo_image', {
        uri: selectedFile.uri,

        name: selectedFile.name || `logo-${Date.now()}.png`,

        type: selectedFile.type || 'image/png',
      });

      const response = await api('/api/settings/v1/logo/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response?.ok) {
        throw new Error('The server did not confirm the logo upload.');
      }

      setLogoConfig(previous => ({
        ...previous,

        logoUrl: response?.logo_url ?? previous.logoUrl,

        imageUrl: response?.image_url ?? previous.imageUrl,

        effectiveImageUrl:
          response?.effective_image_url ||
          response?.image_url ||
          previous.effectiveImageUrl,

        usesCustomLogo: Boolean(response?.uses_custom_logo),
      }));

      setSelectedFile(null);

      Alert.alert(
        'Logo Uploaded',
        'The brand logo has been uploaded successfully.',
      );
    } catch (error) {
      console.log('Logo upload error:', error);

      Alert.alert(
        'Could not upload logo',
        error?.message || 'The logo could not be uploaded.',
      );
    } finally {
      setUploadingLogo(false);
    }
  }

  function handleRemoveLogo() {
    if (!logoConfig.usesCustomLogo || deletingLogo) {
      return;
    }

    Alert.alert(
      'Remove Logo',
      'This will remove the custom logo and restore the bundled default logo.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',

          onPress: async () => {
            try {
              setDeletingLogo(true);

              const response = await api('/api/settings/v1/logo', {
                method: 'DELETE',
              });

              if (!response?.ok) {
                throw new Error('The server did not confirm logo removal.');
              }

              setLogoConfig(previous => ({
                ...previous,

                logoUrl: response?.logo_url ?? null,

                imageUrl: response?.image_url ?? null,

                effectiveImageUrl: response?.effective_image_url || '',

                usesCustomLogo: Boolean(response?.uses_custom_logo),
              }));

              setSelectedFile(null);

              Alert.alert(
                'Logo Removed',
                'The bundled default logo is now active.',
              );
            } catch (error) {
              console.log('Logo delete error:', error);

              Alert.alert(
                'Could not remove logo',
                error?.message || 'The custom logo could not be removed.',
              );
            } finally {
              setDeletingLogo(false);
            }
          },
        },
      ],
    );
  }

  async function handleSaveLogoHeight() {
    if (savingLogoHeight || !logoHeightChanged) {
      return;
    }

    try {
      setSavingLogoHeight(true);

      const response = await api('/api/settings/v1/item', {
        method: 'PUT',

        body: JSON.stringify({
          key: 'ui.logo_height',
          value: logoHeight,
        }),
      });

      if (!response?.ok) {
        throw new Error('The server did not confirm the logo size update.');
      }

      const finalHeight = clamp(
        getNumber(response?.value, logoHeight),
        logoConfig.minimumHeight,
        logoConfig.maximumHeight,
      );

      setLogoHeight(finalHeight);

      setSavedLogoHeight(finalHeight);

      Alert.alert(
        'Logo Size Updated',
        'The logo height has been saved successfully.',
      );
    } catch (error) {
      console.log('Logo height save error:', error);

      Alert.alert(
        'Could not save logo size',
        error?.message || 'The logo size could not be saved.',
      );
    } finally {
      setSavingLogoHeight(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />

          <Text style={styles.loadingText}>Loading logo settings...</Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.section}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorTitle}>Could not load logo settings</Text>

          <Text style={styles.errorDescription}>{loadError}</Text>

          <Pressable
            onPress={loadLogoConfig}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Brand Logo</Text>

      <Text style={styles.description}>
        Upload a client logo and the app will automatically save its public path
        into ui.logo_url.
      </Text>

      <Text style={styles.label}>Logo image</Text>

      <Pressable
        onPress={handleChooseLogo}
        disabled={selectingFile || operationInProgress}
        style={({ pressed }) => [
          styles.filePicker,

          pressed && !operationInProgress && styles.buttonPressed,

          (selectingFile || operationInProgress) && styles.controlDisabled,
        ]}
      >
        <View style={styles.chooseFileButton}>
          {selectingFile ? (
            <ActivityIndicator size="small" color={COLORS.TEXT} />
          ) : (
            <Text style={styles.chooseFileButtonText}>Choose file</Text>
          )}
        </View>

        <Text style={styles.fileName} numberOfLines={1}>
          {selectedFile?.name || 'No file chosen'}
        </Text>
      </Pressable>

      <View style={styles.logoActions}>
        <Pressable
          onPress={handleUploadLogo}
          disabled={!selectedFile || operationInProgress}
          style={({ pressed }) => [
            styles.uploadButton,

            pressed &&
              selectedFile &&
              !operationInProgress &&
              styles.buttonPressed,

            (!selectedFile || operationInProgress) && styles.controlDisabled,
          ]}
        >
          {uploadingLogo ? (
            <ActivityIndicator size="small" color={COLORS.TEXT} />
          ) : (
            <Text style={styles.primaryButtonText}>Upload Logo</Text>
          )}
        </Pressable>

        <Pressable
          onPress={handleRemoveLogo}
          disabled={!logoConfig.usesCustomLogo || operationInProgress}
          style={({ pressed }) => [
            styles.removeButton,

            pressed &&
              logoConfig.usesCustomLogo &&
              !operationInProgress &&
              styles.buttonPressed,

            (!logoConfig.usesCustomLogo || operationInProgress) &&
              styles.controlDisabled,
          ]}
        >
          {deletingLogo ? (
            <ActivityIndicator size="small" color={COLORS.TEXT} />
          ) : (
            <Text style={styles.removeButtonText}>Remove Logo</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.logoHeightSection}>
        <Text style={styles.logoHeightText}>Logo height: {logoHeight} px</Text>

        <LogoHeightSlider
          value={logoHeight}
          minimumValue={logoConfig.minimumHeight}
          maximumValue={logoConfig.maximumHeight}
          disabled={operationInProgress}
          onChange={setLogoHeight}
        />

        <Text style={styles.helperText}>
          Controls the logo size in the page header while preserving its
          proportions.
        </Text>

        <Pressable
          onPress={handleSaveLogoHeight}
          disabled={savingLogoHeight || !logoHeightChanged}
          style={({ pressed }) => [
            styles.saveSizeButton,

            pressed &&
              logoHeightChanged &&
              !savingLogoHeight &&
              styles.buttonPressed,

            (!logoHeightChanged || savingLogoHeight) && styles.controlDisabled,
          ]}
        >
          {savingLogoHeight ? (
            <ActivityIndicator size="small" color={COLORS.TEXT} />
          ) : (
            <Text style={styles.saveSizeButtonText}>Save Logo Size</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.previewSection}>
        <Text style={styles.previewTitle}>Current Logo</Text>

        <View style={styles.previewBox}>
          {logoConfig.effectiveImageUrl ? (
            <Image
              source={{
                uri: logoConfig.effectiveImageUrl,
              }}
              resizeMode="contain"
              style={[
                styles.logoPreviewImage,
                {
                  height: logoHeight,
                },
              ]}
            />
          ) : (
            <Text style={styles.previewUnavailable}>
              Logo preview unavailable
            </Text>
          )}
        </View>

        <Text style={styles.logoStatusText}>
          {logoConfig.usesCustomLogo
            ? 'The custom logo is currently in use.'
            : 'The bundled default logo is currently in use.'}
        </Text>

        <Text style={styles.savedPathText}>
          Saved logo path:{' '}
          {logoConfig.usesCustomLogo && logoConfig.logoUrl
            ? logoConfig.logoUrl
            : 'default bundled logo'}
        </Text>
      </View>
    </View>
  );
}
