import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api } from '../../../../api/client';

import { COLORS, styles } from './ClassRoomsSettings.styles';

function normalizeRooms(response) {
  const items = Array.isArray(response?.items) ? response.items : [];

  return items
    .map(item => {
      const id = Number(item?.id);

      if (!Number.isFinite(id)) {
        return null;
      }

      return {
        id,

        name: String(item?.name || ''),

        description:
          item?.description === null || item?.description === undefined
            ? ''
            : String(item.description),
      };
    })
    .filter(Boolean);
}

export default function ClassRoomsSettings() {
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const [name, setName] = useState('');

  const [description, setDescription] = useState('');

  const [saving, setSaving] = useState(false);

  const loadRooms = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');

      const response = await api('/api/settings/v1/physical-class-rooms', {
        method: 'GET',
      });

      setRooms(normalizeRooms(response));
    } catch (error) {
      console.log('Physical class rooms load error:', error);

      setLoadError(error?.message || 'Could not load physical class rooms.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const cleanName = name.trim();

  const cleanDescription = description.trim();

  const addDisabled = saving || !cleanName;

  const roomCountLabel = useMemo(() => {
    const count = rooms.length;

    return `${count} ${count === 1 ? 'class room' : 'class rooms'}`;
  }, [rooms.length]);

  async function handleAddRoom() {
    if (addDisabled) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: cleanName,

        description: cleanDescription || null,
      };

      console.log('Add physical class room payload:', payload);

      const response = await api('/api/settings/v1/physical-class-rooms', {
        method: 'POST',

        body: JSON.stringify(payload),
      });

      if (!response?.ok || !response?.item?.id) {
        throw new Error('The server did not return the created class room.');
      }

      const createdRoom = {
        id: Number(response.item.id),

        name: String(response.item?.name || cleanName),

        description:
          response.item?.description === null ||
          response.item?.description === undefined
            ? ''
            : String(response.item.description),
      };

      /*
       * Append the newly created room
       * without reloading the full list.
       */
      setRooms(previous => [...previous, createdRoom]);

      setName('');
      setDescription('');

      Alert.alert(
        'Class Room Added',
        'The physical class room has been added successfully.',
      );
    } catch (error) {
      console.log('Add physical class room error:', error);

      Alert.alert(
        'Could not add class room',
        error?.message || 'The physical class room could not be added.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color={COLORS.BLUE} />

        <Text style={styles.stateText}>Loading class rooms...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.errorTitle}>Could not load class rooms</Text>

        <Text style={styles.errorDescription}>{loadError}</Text>

        <Pressable
          onPress={loadRooms}
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
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Add Class Room */}

      <View style={styles.addCard}>
        <Text style={styles.sectionTitle}>Physical Class Rooms</Text>

        <Text style={styles.description}>
          Add the rooms used for in-person classes at the school.
        </Text>

        <View style={styles.formRow}>
          <View style={styles.nameFieldGroup}>
            <Text style={styles.label}>Name</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              editable={!saving}
              placeholder="e.g. Room 101"
              placeholderTextColor={COLORS.MUTED}
              returnKeyType="next"
              style={styles.textInput}
            />
          </View>

          <View style={styles.descriptionFieldGroup}>
            <Text style={styles.label}>Description</Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              editable={!saving}
              placeholder="Optional details about the room"
              placeholderTextColor={COLORS.MUTED}
              multiline
              textAlignVertical="top"
              style={[styles.textInput, styles.descriptionInput]}
            />
          </View>
        </View>

        <Pressable
          onPress={handleAddRoom}
          disabled={addDisabled}
          style={({ pressed }) => [
            styles.addButton,

            pressed && !addDisabled && styles.buttonPressed,

            addDisabled && styles.buttonDisabled,
          ]}
        >
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.TEXT} />
          ) : (
            <Text style={styles.addButtonText}>Add Class Room</Text>
          )}
        </Pressable>
      </View>

      {/* Room Count */}

      <Text style={styles.countText}>{roomCountLabel}</Text>

      {/* Room Listing */}

      {rooms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No class rooms found</Text>

          <Text style={styles.emptyDescription}>
            Add your first physical class room using the form above.
          </Text>
        </View>
      ) : (
        <View style={styles.roomsContainer}>
          {rooms.map(room => (
            <View key={room.id} style={styles.roomCard}>
              <Text style={styles.roomName}>{room.name || 'Unnamed Room'}</Text>

              {room.description ? (
                <Text style={styles.roomDescription}>{room.description}</Text>
              ) : (
                <Text style={styles.noDescription}>No description</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
