import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera } from 'react-native-image-picker';
import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';

export default function AttachOptionalSection({
  BG,
  CARD,
  TEXT,
  MUTED,
  BORDER,
  DANGER,
  resetKey = 0,
  uploading = false,
  onPickedFiles,
  onFilesChanged,
}) {
  const [files, setFiles] = useState([]); // { uri, name, type, size? }

  // ✅ clear local selection after successful upload
  useEffect(() => {
    setFiles([]);
  }, [resetKey]);

  const mergeFiles = useCallback((prev, newFiles) => {
    const next = [...prev];
    newFiles.forEach(f => {
      const key = `${f.uri}|${f.name}`;
      if (!next.some(x => `${x.uri}|${x.name}` === key)) next.push(f);
    });
    return next;
  }, []);

  const addFiles = useCallback(
    async newFiles => {
      if (!Array.isArray(newFiles) || newFiles.length === 0) {
        return;
      }

      setFiles(prev => {
        const next = mergeFiles(prev, newFiles);

        onFilesChanged?.(next);

        return next;
      });

      await onPickedFiles?.(newFiles);
    },
    [mergeFiles, onFilesChanged, onPickedFiles],
  );

  const removeFile = idx => {
    setFiles(prev => {
      const next = prev.filter((_, i) => i !== idx);

      onFilesChanged?.(next);

      return next;
    });
  };

  const onCamera = async () => {
    try {
      if (uploading) return;

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Camera', 'Camera permission denied');
          return;
        }
      }

      const res = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: false,
        quality: 0.85,
      });

      if (res?.didCancel) return;

      if (res?.errorCode) {
        Alert.alert('Camera', res?.errorMessage || res.errorCode);
        return;
      }

      const a = res?.assets?.[0];
      if (!a?.uri) return;

      await addFiles([
        {
          uri: a.uri,
          name: a.fileName || `camera_${Date.now()}.jpg`,
          type: a.type || 'image/jpeg',
          size: a.fileSize,
        },
      ]);
    } catch (e) {
      Alert.alert('Camera', e?.message || 'Could not open camera');
    }
  };

  const onPickFiles = async () => {
    try {
      if (uploading) return;

      const picks = await pick({
        allowMultiSelection: true,
        type: [types.images, types.pdf],
        mode: 'import',
      });

      const mapped = picks.map(p => ({
        uri: p.uri,
        name: p.name || `file_${Date.now()}`,
        type: p.mimeType || 'application/octet-stream',
        size: p.size,
      }));

      await addFiles(mapped);
    } catch (e) {
      if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED)
        return;
      Alert.alert('Attach', e?.message || 'Could not pick files');
    }
  };

  return (
    <View
      style={{
        backgroundColor: CARD,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Text style={{ color: TEXT, fontWeight: '800' }}>
          Attach images/PDF (optional)
        </Text>

        {uploading ? <ActivityIndicator /> : null}
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable
          onPress={onCamera}
          disabled={uploading}
          style={({ pressed }) => ({
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: BORDER,
            backgroundColor: pressed ? '#111C33' : BG,
            opacity: uploading ? 0.6 : 1,
          })}
        >
          <MaterialCommunityIcons name="camera" size={18} color={TEXT} />
          <Text style={{ color: TEXT, fontWeight: '700', marginLeft: 8 }}>
            Camera
          </Text>
        </Pressable>

        <Pressable
          onPress={onPickFiles}
          disabled={uploading}
          style={({ pressed }) => ({
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: BORDER,
            backgroundColor: pressed ? '#111C33' : BG,
            opacity: uploading ? 0.6 : 1,
          })}
        >
          <MaterialCommunityIcons name="paperclip" size={18} color={TEXT} />
          <Text style={{ color: TEXT, fontWeight: '700', marginLeft: 8 }}>
            Attach
          </Text>
        </Pressable>
      </View>

      {files.length > 0 && (
        <View style={{ marginTop: 12 }}>
          <Text
            style={{
              color: MUTED,
              marginBottom: 8,
            }}
          >
            Selected: {files.length}
          </Text>

          {files.map((f, idx) => (
            <View
              key={`${f.uri}-${idx}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 8,
                borderTopWidth: 1,
                borderTopColor: '#223047',
              }}
            >
              <Text style={{ color: TEXT, flex: 1 }} numberOfLines={1}>
                {f.name}
              </Text>

              <Pressable
                onPress={() => removeFile(idx)}
                disabled={uploading}
                style={({ pressed }) => ({
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 10,
                  backgroundColor: pressed ? '#7f1d1d' : DANGER,
                  marginLeft: 10,
                  opacity: uploading ? 0.6 : 1,
                })}
              >
                <Text style={{ color: BG, fontWeight: '800' }}>Remove</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
