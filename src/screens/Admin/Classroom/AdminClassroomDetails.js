import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getClassroom } from './classroomApi';
import styles from './AdminClassRoom.styles';

function InfoRow({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{String(value)}</Text>
    </View>
  );
}

export default function AdminClassroomDetails() {
  const { params } = useRoute();
  const id = params?.classroomId;
  const [item, setItem] = useState(params?.classroom || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        if (!id) return;
        try {
          setLoading(true);
          const result = await getClassroom(id, params?.classroom);
          if (active) {
            setItem(result);
            setError('');
          }
        } catch (e) {
          if (active) setError(e?.message || 'Failed to load classroom.');
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [id, params?.classroom]),
  );

  if (!item && loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#60A5FA" />
      </View>
    );
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.detailsContent}
    >
      {!!error && <Text style={styles.errorText}>{error}</Text>}
      {!item ? (
        <Text style={styles.muted}>Classroom details unavailable.</Text>
      ) : (
        <>
          <View style={styles.detailHero}>
            <View style={styles.classroomIcon}>
              <Ionicons name="school-outline" size={25} color="#93C5FD" />
            </View>
            <Text style={styles.detailTitle}>{item.title}</Text>
            {!!item.description && (
              <Text style={styles.description}>{item.description}</Text>
            )}
          </View>
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Classroom Information</Text>
            <InfoRow label="Classroom ID" value={item.id} />
            <InfoRow label="Class / Group" value={item.className} />
            <InfoRow label="Section" value={item.section} />
            <InfoRow label="Subject" value={item.subject} />
            <InfoRow label="Teacher" value={item.teacher} />
            <InfoRow label="Students" value={item.students} />
          </View>
          <Text style={styles.note}>
            Additional classroom details require the backend detail response
            mapping.
          </Text>
        </>
      )}
    </ScrollView>
  );
}
