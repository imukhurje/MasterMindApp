import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { api } from '../../api/client';
import { useNavigation } from '@react-navigation/native';

const BG = '#0E172A';
const TEXT = '#E2E8F0';
const MUTED = '#94A3B8';
const CARD = '#1E293B';
const GREEN = '#21C55E';
const BLUE = '#3B82F6';

const StaffAttendanceDashboard = () => {
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Meta data for dropdowns
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [canManage, setCanManage] = useState(false);

  // Mark Attendance Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingSession, setLoadingSession] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Session Modal states
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');

  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [metaRes, sessionsRes] = await Promise.all([
        api('/api/attendance/meta'),
        api('/api/attendance/sessions?page=1&per_page=20'),
      ]);
      setStats(metaRes.stats);
      setClasses(metaRes.classes || []);
      setCourses(metaRes.courses || []);
      setCanManage(metaRes.can_manage || false);
      setSessions(sessionsRes.rows);
      setHasMore(sessionsRes.rows.length === 20);
      setPage(1);
    } catch (err) {
      console.log('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;

    try {
      const nextPage = page + 1;
      const res = await api(
        `/api/attendance/sessions?page=${nextPage}&per_page=20`,
      );
      setSessions(prev => [...prev, ...res.rows]);
      setPage(nextPage);
      setHasMore(res.rows.length === 20);
    } catch (err) {
      console.log('Error loading more', err);
    }
  };

  const formatDate = datetime => {
    const date = new Date(datetime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleMarkAttendance = async sessionId => {
    setLoadingSession(true);
    try {
      const res = await api(`/api/attendance/sessions/${sessionId}`);
      setSelectedSession(res.session);
      setStudents(res.students);
      setModalVisible(true);
    } catch (err) {
      console.log('Error fetching session', err);
    } finally {
      setLoadingSession(false);
    }
  };

  const toggleStudentPresent = studentId => {
    setStudents(prev =>
      prev.map(student =>
        student.student_id === studentId
          ? { ...student, present: !student.present }
          : student,
      ),
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSession(null);
    setStudents([]);
    setSearchQuery('');
  };

  const saveAttendance = async () => {
    try {
      const absentIds = students
        .filter(student => !student.present)
        .map(student => student.student_id);

      await api(`/api/attendance/sessions/${selectedSession.id}/mark`, {
        method: 'POST',
        body: JSON.stringify({ absent_ids: absentIds }),
      });

      closeModal();
    } catch (err) {
      console.log('Error saving attendance', err);
    }
  };

  // Add Session Modal Functions
  const openAddModal = () => {
    setAddModalVisible(true);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setSelectedHour('09');
    setSelectedMinute('00');
    setSelectedPeriod('AM');
  };

  const closeAddModal = () => {
    setAddModalVisible(false);
    setSelectedClassId(null);
    setSelectedCourseId(null);
    setSelectedDate('');
    setSelectedHour('09');
    setSelectedMinute('00');
    setSelectedPeriod('AM');
  };

  const saveNewSession = async () => {
    if (!selectedClassId || !selectedCourseId || !selectedDate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      // Convert 12-hour to 24-hour format
      let hour24 = parseInt(selectedHour);
      if (selectedPeriod === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (selectedPeriod === 'AM' && hour24 === 12) {
        hour24 = 0;
      }

      const timeStr = `${String(hour24).padStart(2, '0')}:${selectedMinute}`;
      const startsAt = `${selectedDate}T${timeStr}`;

      const res = await api('/api/attendance/sessions', {
        method: 'POST',
        body: JSON.stringify({
          class_group_id: selectedClassId,
          course_id: selectedCourseId,
          starts_at: startsAt,
        }),
      });

      if (res.id) {
        Alert.alert('Success', res.message);
        closeAddModal();
        await fetchData();
      }
    } catch (err) {
      console.log('Error saving new session', err);
      Alert.alert('Error', 'Failed to create session');
    }
  };

  const handleDateSelect = day => {
    setSelectedDate(day.dateString);
  };

  // Generate hour options (1-12)
  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0'),
  );

  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0'),
  );

  const filteredStudents = students.filter(
    student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.roll_no && student.roll_no.toString().includes(searchQuery)),
  );

  const renderSession = ({ item }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionTitle}>
          {item.class_label} · {item.course_label}
        </Text>
        <Text style={styles.sessionMeta}>
          {formatDate(item.starts_at)} · Teacher - {item.teacher_name}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.markBtn}
        onPress={() => handleMarkAttendance(item.id)}
      >
        <Text style={styles.markBtnText}>Mark Attendance</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={renderSession}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <>
            {/* <View style={styles.header}>
              <Text style={styles.title}>Attendance Portal</Text>
            </View> */}

            <View style={styles.card}>
              <Text style={styles.cardTitle}>% Present</Text>

              {loading ? (
                <ActivityIndicator color={TEXT} />
              ) : (
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Week</Text>
                    <Text style={styles.statValue}>{stats?.week}%</Text>
                  </View>

                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>MTD</Text>
                    <Text style={styles.statValue}>{stats?.mtd}%</Text>
                  </View>

                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>YTD</Text>
                    <Text style={styles.statValue}>{stats?.ytd}%</Text>
                  </View>
                </View>
              )}
            </View>

            {canManage && (
              <View style={styles.topActionsRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnPrimary]}
                  onPress={openAddModal}
                >
                  <Text style={styles.actionBtnTextPrimary}>+ New Lecture</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnSecondary]}
                  onPress={() => {
                    navigation.navigate('AttendanceReports', {
                      classes,
                      defaultClassId:
                        selectedClassId || classes?.[0]?.id || null,
                      defaultRange: 'this_week',
                    });
                  }}
                >
                  <Text style={styles.actionBtnTextSecondary}>Reports</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={TEXT}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
      />

      {/* Mark Attendance Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {loadingSession ? (
              <ActivityIndicator color={TEXT} size="large" />
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>
                      {selectedSession?.class_label} ·{' '}
                      {selectedSession?.course_label}
                    </Text>
                    <Text style={styles.modalSubtitle}>
                      {selectedSession && formatDate(selectedSession.starts_at)}{' '}
                      · Teacher - {selectedSession?.teacher_name}
                    </Text>
                  </View>

                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search student by name or roll no..."
                    placeholderTextColor={MUTED}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                <ScrollView
                  style={styles.studentsList}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
                  {filteredStudents.length === 0 ? (
                    <Text style={styles.noResults}>No students found</Text>
                  ) : (
                    filteredStudents.map(student => (
                      <TouchableOpacity
                        key={student.student_id}
                        style={styles.studentRow}
                        onPress={() => toggleStudentPresent(student.student_id)}
                      >
                        <Text style={styles.studentName}>
                          {student.name}
                          {student.roll_no && ` - Roll No ${student.roll_no}`}
                        </Text>
                        <View style={styles.checkbox}>
                          {student.present && (
                            <View style={styles.checkboxInner} />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={closeModal}
                  >
                    <Text style={styles.closeBtnText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={saveAttendance}
                  >
                    <Text style={styles.saveBtnText}>Save Attendance</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Session Modal */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeAddModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Session</Text>
              <Text style={styles.modalSubtitle}>
                Create a new lecture session
              </Text>
            </View>

            <ScrollView
              style={styles.formContainer}
              contentContainerStyle={{ paddingBottom: 20 }}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              {/* Class Selection */}
              <Text style={styles.fieldLabel}>Select Class</Text>
              <View style={styles.dropdownContainer}>
                {classes.map(cls => (
                  <TouchableOpacity
                    key={cls.id}
                    style={[
                      styles.dropdownItem,
                      selectedClassId === cls.id && styles.dropdownItemSelected,
                    ]}
                    onPress={() => setSelectedClassId(cls.id)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedClassId === cls.id &&
                          styles.dropdownItemTextSelected,
                      ]}
                    >
                      {cls.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Course Selection */}
              <Text style={styles.fieldLabel}>Select Course / Subject</Text>
              <View style={styles.dropdownContainer}>
                {courses.map(course => (
                  <TouchableOpacity
                    key={course.id}
                    style={[
                      styles.dropdownItem,
                      selectedCourseId === course.id &&
                        styles.dropdownItemSelected,
                    ]}
                    onPress={() => setSelectedCourseId(course.id)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedCourseId === course.id &&
                          styles.dropdownItemTextSelected,
                      ]}
                    >
                      {course.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Inline Calendar */}
              <Text style={styles.fieldLabel}>Select Date</Text>
              <Calendar
                onDayPress={handleDateSelect}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    selectedColor: BLUE,
                  },
                }}
                theme={{
                  calendarBackground: BG,
                  textSectionTitleColor: MUTED,
                  selectedDayBackgroundColor: BLUE,
                  selectedDayTextColor: '#FFFFFF',
                  todayTextColor: GREEN,
                  dayTextColor: TEXT,
                  textDisabledColor: '#475569',
                  monthTextColor: TEXT,
                  arrowColor: BLUE,
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 12,
                }}
                style={styles.calendar}
              />

              {/* Inline Time Picker */}
              <Text style={styles.fieldLabel}>Select Time</Text>
              <View style={styles.timePickerContainer}>
                {/* Hour Selector */}
                <View style={styles.timeColumn}>
                  <Text style={styles.timeColumnLabel}>Hour</Text>
                  <ScrollView
                    style={styles.timeScroll}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    onStartShouldSetResponderCapture={() => true}
                  >
                    {hours.map(hour => (
                      <TouchableOpacity
                        key={hour}
                        style={[
                          styles.timeOption,
                          selectedHour === hour && styles.timeOptionSelected,
                        ]}
                        onPress={() => setSelectedHour(hour)}
                      >
                        <Text
                          style={[
                            styles.timeOptionText,
                            selectedHour === hour &&
                              styles.timeOptionTextSelected,
                          ]}
                        >
                          {hour}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Minute Selector */}
                <View style={styles.timeColumn}>
                  <Text style={styles.timeColumnLabel}>Minute</Text>
                  <ScrollView
                    style={styles.timeScroll}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    onStartShouldSetResponderCapture={() => true}
                  >
                    {minutes.map(minute => (
                      <TouchableOpacity
                        key={minute}
                        style={[
                          styles.timeOption,
                          selectedMinute === minute &&
                            styles.timeOptionSelected,
                        ]}
                        onPress={() => setSelectedMinute(minute)}
                      >
                        <Text
                          style={[
                            styles.timeOptionText,
                            selectedMinute === minute &&
                              styles.timeOptionTextSelected,
                          ]}
                        >
                          {minute}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* AM/PM Selector */}
                <View style={styles.timeColumn}>
                  <Text style={styles.timeColumnLabel}>Period</Text>
                  <ScrollView
                    style={styles.timeScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    {['AM', 'PM'].map(period => (
                      <TouchableOpacity
                        key={period}
                        style={[
                          styles.timeOption,
                          selectedPeriod === period &&
                            styles.timeOptionSelected,
                        ]}
                        onPress={() => setSelectedPeriod(period)}
                      >
                        <Text
                          style={[
                            styles.timeOptionText,
                            selectedPeriod === period &&
                              styles.timeOptionTextSelected,
                          ]}
                        >
                          {period}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Selected Time Display */}
              <View style={styles.selectedTimeDisplay}>
                <Text style={styles.selectedTimeText}>
                  Selected: {selectedHour}:{selectedMinute} {selectedPeriod}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.closeBtn} onPress={closeAddModal}>
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveNewSession}>
                <Text style={styles.saveBtnText}>Save Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  listContent: {
    padding: 16,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    color: TEXT,
    fontSize: 24,
    fontWeight: '800',
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },

  cardTitle: {
    color: MUTED,
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  statsRow: {
    flexDirection: 'row',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statLabel: {
    color: MUTED,
    fontSize: 13,
    marginBottom: 4,
  },

  statValue: {
    color: TEXT,
    fontSize: 28,
    fontWeight: '700',
  },

  addSessionBtn: {
    backgroundColor: BLUE,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },

  addSessionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  sessionCard: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },

  sessionInfo: {
    flex: 1,
    marginRight: 12,
  },

  sessionTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },

  sessionMeta: {
    color: MUTED,
    fontSize: 13,
  },

  markBtn: {
    backgroundColor: GREEN,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },

  markBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: CARD,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#334155',
  },

  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  modalTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },

  modalSubtitle: {
    color: MUTED,
    fontSize: 14,
  },

  searchInput: {
    backgroundColor: BG,
    color: TEXT,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },

  studentsList: {
    maxHeight: 400,
    padding: 16,
  },

  noResults: {
    color: MUTED,
    textAlign: 'center',
    paddingVertical: 32,
    fontSize: 15,
  },

  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: BG,
    borderRadius: 8,
    marginBottom: 8,
  },

  studentName: {
    color: TEXT,
    fontSize: 15,
    flex: 1,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: GREEN,
  },

  modalActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },

  closeBtn: {
    flex: 1,
    backgroundColor: BG,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },

  closeBtnText: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '600',
  },

  saveBtn: {
    flex: 1,
    backgroundColor: GREEN,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  formContainer: {
    padding: 20,
  },

  fieldLabel: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },

  dropdownContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },

  dropdownItem: {
    backgroundColor: BG,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },

  dropdownItemSelected: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },

  dropdownItemText: {
    color: TEXT,
    fontSize: 14,
  },

  dropdownItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  calendar: {
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },

  timePickerContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  timeColumn: {
    flex: 1,
    backgroundColor: BG,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },

  timeColumnLabel: {
    color: MUTED,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 8,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    fontWeight: '600',
  },

  timeScroll: {
    maxHeight: 150,
  },

  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  timeOptionSelected: {
    backgroundColor: BLUE,
  },

  timeOptionText: {
    color: TEXT,
    fontSize: 16,
  },

  timeOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  selectedTimeDisplay: {
    backgroundColor: BG,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    marginBottom: 16,
  },

  selectedTimeText: {
    color: GREEN,
    fontSize: 18,
    fontWeight: '700',
  },

  topActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  actionBtnPrimary: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },

  actionBtnSecondary: {
    backgroundColor: BG,
    borderColor: '#334155',
  },

  actionBtnTextPrimary: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  actionBtnTextSecondary: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default StaffAttendanceDashboard;
