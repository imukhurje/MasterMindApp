import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../api/client';

import styles from './AdminPasswordRegistrations.styles';

function normalizeRegistration(item) {
  return {
    id: Number(item?.id),

    role: String(item?.role || '').toLowerCase(),

    name: String(item?.name || 'Unnamed applicant'),

    email: item?.email ? String(item.email) : '',

    classGroupId: Number(item?.class_group_id),

    rollNo: String(item?.roll_no || ''),

    username: String(item?.username || ''),

    usernameReservation: String(item?.username_reservation || ''),

    status: String(item?.status || ''),

    matchedUserId: item?.matched_user_id ?? null,

    matchedStudentId: item?.matched_student_id ?? null,

    reviewedBy: item?.reviewed_by ?? null,

    reviewedAt: item?.reviewed_at ?? null,

    createdAt: String(item?.created_at || ''),
  };
}

function formatRole(role) {
  const value = String(role || '').trim();

  if (!value) {
    return 'Unknown';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AdminPasswordRegistrations({ navigation }) {
  const insets = useSafeAreaInsets();

  const [registrations, setRegistrations] = useState([]);

  const [page, setPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [rejectingRegistrationId, setRejectingRegistrationId] = useState(null);

  const [matchingRegistrationId, setMatchingRegistrationId] = useState(null);

  const [associateModalVisible, setAssociateModalVisible] = useState(false);

  const [activeRegistration, setActiveRegistration] = useState(null);

  const [candidates, setCandidates] = useState([]);

  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  const [candidatesLoading, setCandidatesLoading] = useState(false);

  const [manualMatchVisible, setManualMatchVisible] = useState(false);

  const [manualSearchText, setManualSearchText] = useState('');

  const [manualSearchResults, setManualSearchResults] = useState([]);

  const [manualSearching, setManualSearching] = useState(false);

  const [selectedManualUser, setSelectedManualUser] = useState(null);
  const [approvingRegistration, setApprovingRegistration] = useState(false);

  const loadRegistrations = useCallback(
    async ({ requestedPage = 1, refresh = false, append = false } = {}) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await api(
          `/api/password-registrations?page=${requestedPage}`,
        );

        const rows = (Array.isArray(response?.data) ? response.data : [])
          .map(normalizeRegistration)
          .filter(item => Number.isFinite(item.id));

        if (append) {
          setRegistrations(current => {
            const map = new Map();

            current.forEach(item => {
              map.set(item.id, item);
            });

            rows.forEach(item => {
              map.set(item.id, item);
            });

            return Array.from(map.values());
          });
        } else {
          setRegistrations(rows);
        }

        setPage(Number(response?.current_page) || requestedPage);

        setLastPage(Number(response?.last_page) || 1);

        setTotal(Number(response?.total) || 0);

        navigation.setOptions({
          title: 'Registrations',
        });
      } catch (error) {
        console.log('Password registrations load error:', error);

        Alert.alert(
          'Registrations',
          error?.message || 'Could not load registrations.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [navigation],
  );

  useFocusEffect(
    useCallback(() => {
      loadRegistrations({
        requestedPage: 1,
      });
    }, [loadRegistrations]),
  );

  const pendingCount = useMemo(
    () => registrations.filter(item => item.status === 'pending_admin').length,
    [registrations],
  );

  function loadNextPage() {
    if (loadingMore || page >= lastPage) {
      return;
    }

    loadRegistrations({
      requestedPage: page + 1,

      append: true,
    });
  }

  async function matchAndApprove(registration) {
    const registrationId = Number(registration?.id);

    if (!Number.isFinite(registrationId)) {
      Alert.alert('Match & Approve', 'Registration ID is missing.');

      return;
    }

    try {
      setMatchingRegistrationId(registrationId);

      setCandidatesLoading(true);

      const response = await api(
        `/api/password-registrations/${registrationId}/candidates`,
      );

      const rows = Array.isArray(response?.candidates)
        ? response.candidates
        : [];

      setActiveRegistration(registration);

      setCandidates(rows);

      setSelectedCandidateId(null);

      setAssociateModalVisible(true);

      setManualMatchVisible(false);

      setManualSearchText('');

      setManualSearchResults([]);

      setSelectedManualUser(null);
    } catch (error) {
      console.log('Registration candidates load error:', error);

      Alert.alert(
        'Match & Approve',
        error?.message || 'Could not load matching candidates.',
      );
    } finally {
      setCandidatesLoading(false);

      setMatchingRegistrationId(null);
    }
  }

  function rejectRegistration(registration) {
    const registrationId = Number(registration?.id);

    if (!Number.isFinite(registrationId)) {
      Alert.alert('Reject registration', 'Registration ID is missing.');

      return;
    }

    Alert.alert('Reject registration', 'Reject this registration?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Reject',
        style: 'destructive',

        onPress: () => confirmRejectRegistration(registrationId),
      },
    ]);
  }

  async function confirmRejectRegistration(registrationId) {
    try {
      setRejectingRegistrationId(registrationId);

      const response = await api(
        `/api/password-registrations/${registrationId}/reject`,
        {
          method: 'POST',
        },
      );

      if (response?.ok !== true) {
        throw new Error('Could not reject the registration.');
      }

      await loadRegistrations({
        requestedPage: 1,
      });
    } catch (error) {
      console.log('Reject registration error:', error);

      Alert.alert(
        'Reject failed',
        error?.message || 'Could not reject the registration.',
      );
    } finally {
      setRejectingRegistrationId(null);
    }
  }

  async function searchManualUsers() {
    const query = manualSearchText.trim();

    if (!query) {
      Alert.alert('Search', 'Please enter a name, email, or roll number.');
      return;
    }

    const registrationId = Number(activeRegistration?.id);

    if (!Number.isFinite(registrationId)) {
      Alert.alert('Search', 'Registration ID is missing.');
      return;
    }

    try {
      setManualSearching(true);

      setManualSearchResults([]);

      const response = await api(
        `/api/password-registrations/${registrationId}/candidates?q=${encodeURIComponent(
          query,
        )}`,
      );

      const rows = Array.isArray(response?.candidates)
        ? response.candidates
        : [];

      setManualSearchResults(rows);

      setSelectedManualUser(null);
      setSelectedCandidateId(null);
    } catch (error) {
      console.log('Manual registration search error:', error);

      setManualSearchResults([]);

      Alert.alert('Search failed', error?.message || 'Could not search users.');
    } finally {
      setManualSearching(false);
    }
  }

  async function approveSelectedUser() {
    if (approvingRegistration) {
      return;
    }

    const registrationId = Number(activeRegistration?.id);

    if (!Number.isFinite(registrationId)) {
      Alert.alert('Approve registration', 'Registration ID is missing.');
      return;
    }

    let targetType = '';
    let targetId = null;

    /*
     * Manual search selection
     */
    if (selectedManualUser) {
      targetType = String(selectedManualUser?.target_type || '');

      targetId = Number(selectedManualUser?.target_id);
    }

    /*
     * Suggested candidate selection
     */
    if (!selectedManualUser && selectedCandidateId !== null) {
      const selectedCandidate = candidates.find(candidate => {
        const candidateId = Number(
          candidate?.target_id ??
            candidate?.id ??
            candidate?.user_id ??
            candidate?.student_id,
        );

        return candidateId === Number(selectedCandidateId);
      });

      if (selectedCandidate) {
        targetId = Number(
          selectedCandidate?.target_id ??
            selectedCandidate?.id ??
            selectedCandidate?.user_id ??
            selectedCandidate?.student_id,
        );

        if (selectedCandidate?.target_type) {
          targetType = String(selectedCandidate.target_type);
        } else if (selectedCandidate?.student_id) {
          targetType = 'student';
        } else if (selectedCandidate?.user_id) {
          targetType = 'user';
        }
      }
    }

    if (!targetType || !Number.isFinite(targetId)) {
      Alert.alert('Approve registration', 'Please select a valid user first.');
      return;
    }

    const payload = {
      target_type: targetType,
      target_id: targetId,
    };

    try {
      setApprovingRegistration(true);

      console.log('Approve registration payload:', payload);

      const response = await api(
        `/api/password-registrations/${registrationId}/approve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (response?.ok !== true) {
        throw new Error('Could not approve the registration.');
      }

      setAssociateModalVisible(false);

      setActiveRegistration(null);
      setCandidates([]);
      setSelectedCandidateId(null);

      setManualMatchVisible(false);
      setManualSearchText('');
      setManualSearchResults([]);
      setSelectedManualUser(null);

      await loadRegistrations({
        requestedPage: 1,
      });
    } catch (error) {
      console.log('Approve registration error:', error);

      Alert.alert(
        'Approval failed',
        error?.message || 'Could not approve the selected user.',
      );
    } finally {
      setApprovingRegistration(false);
    }
  }

  function renderRegistration({ item }) {
    const rejecting = rejectingRegistrationId === item.id;
    const roleLabel = formatRole(item.role);
    const matching = matchingRegistrationId === item.id;

    return (
      <View style={styles.registrationCard}>
        <View style={styles.cardTopRow}>
          <View style={styles.registrationInfo}>
            <Text numberOfLines={2} style={styles.registrationName}>
              {item.name}
              {' • '}
              {item.role || 'unknown'}
            </Text>

            <View style={styles.metadataWrap}>
              <Text style={styles.metadataText}>
                Username:{' '}
                <Text style={styles.metadataValue}>
                  {item.username || 'Not provided'}
                </Text>
              </Text>

              <Text style={styles.metadataText}>
                Email:{' '}
                <Text style={styles.metadataValue}>
                  {item.email || 'Not provided'}
                </Text>
              </Text>

              <Text style={styles.metadataText}>
                Roll:{' '}
                <Text style={styles.metadataValue}>
                  {item.rollNo || 'Not provided'}
                </Text>
              </Text>
            </View>

            <View style={styles.badgesRow}>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{roleLabel}</Text>
              </View>

              {item.status ? (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {item.status.replace(/_/g, ' ')}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={() => matchAndApprove(item)}
              disabled={matching}
              style={({ pressed }) => [
                styles.approveButton,

                matching && styles.controlDisabled,

                pressed && !matching && styles.controlPressed,
              ]}
            >
              {matching ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.approveButtonText}>Match & approve</Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => rejectRegistration(item)}
              disabled={rejecting}
              style={({ pressed }) => [
                styles.rejectButton,

                rejecting && styles.controlDisabled,

                pressed && !rejecting && styles.controlPressed,
              ]}
            >
              {rejecting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.rejectButtonText}>Reject</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (loading && registrations.length === 0) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading registrations...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.pageTitle}>Registrations</Text>

          <Text style={styles.pageSubtitle}>
            Review pending password registrations
          </Text>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryValue}>{total}</Text>

          <Text style={styles.summaryLabel}>Total</Text>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryValue}>{pendingCount}</Text>

          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
      </View>

      <View style={styles.listCard}>
        <FlatList
          data={registrations}
          keyExtractor={item => String(item.id)}
          renderItem={renderRegistration}
          showsVerticalScrollIndicator
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() =>
                loadRegistrations({
                  requestedPage: 1,
                  refresh: true,
                })
              }
              tintColor="#67D1F0"
            />
          }
          contentContainerStyle={
            registrations.length === 0
              ? styles.emptyListContent
              : styles.listContent
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No registrations found</Text>

              <Text style={styles.emptyStateText}>
                There are no pending password registrations.
              </Text>
            </View>
          }
          ListFooterComponent={
            page < lastPage ? (
              <Pressable
                onPress={loadNextPage}
                disabled={loadingMore}
                style={({ pressed }) => [
                  styles.loadMoreButton,

                  loadingMore && styles.controlDisabled,

                  pressed && !loadingMore && styles.controlPressed,
                ]}
              >
                {loadingMore ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.loadMoreButtonText}>Load More</Text>
                )}
              </Pressable>
            ) : null
          }
        />
      </View>
      <Modal
        transparent
        visible={associateModalVisible}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setAssociateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setAssociateModalVisible(false)}
          />

          <View style={styles.associateModal}>
            <Text style={styles.associateTitle}>Associate registration</Text>

            <Text style={styles.associateSubtitle}>
              {activeRegistration?.name || 'This user'} requested{' '}
              {activeRegistration?.role || 'user'} access as{' '}
              {activeRegistration?.username || '—'}.
            </Text>

            {candidatesLoading ? (
              <View style={styles.candidateLoading}>
                <ActivityIndicator size="large" color="#67D1F0" />

                <Text style={styles.candidateLoadingText}>
                  Finding likely matches...
                </Text>
              </View>
            ) : candidates.length === 0 ? (
              <View style={styles.noCandidatesCard}>
                <Text style={styles.noCandidatesText}>
                  No likely matches found. Check the person’s name, role, class,
                  and roll number in the relevant user list.
                </Text>

                <Pressable
                  onPress={() => {
                    setManualMatchVisible(true);
                  }}
                  style={({ pressed }) => [
                    styles.manualMatchButton,

                    pressed && styles.controlPressed,
                  ]}
                >
                  <Text style={styles.manualMatchButtonText}>
                    Match manually
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.candidatesList}>
                {candidates.map(candidate => {
                  const candidateId = Number(
                    candidate?.target_id ??
                      candidate?.id ??
                      candidate?.user_id ??
                      candidate?.student_id,
                  );

                  const selected = selectedCandidateId === candidateId;

                  return (
                    <Pressable
                      key={String(candidateId)}
                      onPress={() => setSelectedCandidateId(candidateId)}
                      style={({ pressed }) => [
                        styles.candidateRow,

                        selected && styles.candidateRowSelected,

                        pressed && styles.controlPressed,
                      ]}
                    >
                      <View
                        style={[
                          styles.radioOuter,

                          selected && styles.radioOuterSelected,
                        ]}
                      >
                        {selected ? <View style={styles.radioInner} /> : null}
                      </View>

                      <View style={styles.candidateInfo}>
                        <Text style={styles.candidateName}>
                          {candidate?.name || 'Unnamed user'}
                        </Text>

                        <Text style={styles.candidateMeta}>
                          {candidate?.email ||
                            candidate?.username ||
                            'No email'}

                          {candidate?.detail ? ` • ${candidate.detail}` : ''}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {manualMatchVisible ? (
              <View style={styles.manualSearchSection}>
                <Text style={styles.manualSearchTitle}>
                  Search the relevant user list
                </Text>

                <View style={styles.manualSearchRow}>
                  <TextInput
                    value={manualSearchText}
                    onChangeText={setManualSearchText}
                    onSubmitEditing={searchManualUsers}
                    placeholder="Search by name, email, or roll number"
                    placeholderTextColor="#8091AA"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="search"
                    editable={!manualSearching}
                    style={styles.manualSearchInput}
                  />

                  <Pressable
                    onPress={searchManualUsers}
                    disabled={manualSearching}
                    style={({ pressed }) => [
                      styles.manualSearchButton,

                      manualSearching && styles.controlDisabled,

                      pressed && !manualSearching && styles.controlPressed,
                    ]}
                  >
                    {manualSearching ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.manualSearchButtonText}>Search</Text>
                    )}
                  </Pressable>
                </View>

                {manualSearchResults.length > 0 ? (
                  <View style={styles.manualResults}>
                    {manualSearchResults.map(user => {
                      const targetId = Number(user?.target_id);

                      const targetType = String(user?.target_type || '');

                      const selected =
                        Number(selectedManualUser?.target_id) === targetId &&
                        String(selectedManualUser?.target_type || '') ===
                          targetType;

                      return (
                        <Pressable
                          key={`${targetType}-${targetId}`}
                          onPress={() => {
                            setSelectedManualUser(user);

                            setSelectedCandidateId(null);
                          }}
                          style={({ pressed }) => [
                            styles.manualResultRow,

                            selected && styles.manualResultRowSelected,

                            pressed && styles.controlPressed,
                          ]}
                        >
                          <View
                            style={[
                              styles.radioOuter,

                              selected && styles.radioOuterSelected,
                            ]}
                          >
                            {selected ? (
                              <View style={styles.radioInner} />
                            ) : null}
                          </View>

                          <View style={styles.candidateInfo}>
                            <Text style={styles.candidateName}>
                              {user?.name || 'Unnamed user'}
                            </Text>

                            <Text style={styles.candidateMeta}>
                              {user?.email || 'No email'}

                              {user?.detail ? ` • ${user.detail}` : ''}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            ) : null}

            <View style={styles.associateFooter}>
              <Pressable
                onPress={() => setAssociateModalVisible(false)}
                style={({ pressed }) => [
                  styles.modalCancelButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={approveSelectedUser}
                disabled={
                  approvingRegistration ||
                  (selectedCandidateId === null && selectedManualUser === null)
                }
                style={({ pressed }) => [
                  styles.modalApproveButton,

                  (approvingRegistration ||
                    (selectedCandidateId === null &&
                      selectedManualUser === null)) &&
                    styles.controlDisabled,

                  pressed &&
                    !approvingRegistration &&
                    (selectedCandidateId !== null ||
                      selectedManualUser !== null) &&
                    styles.controlPressed,
                ]}
              >
                {approvingRegistration ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalApproveButtonText}>
                    Approve selected user
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
