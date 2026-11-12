// src/screens/Dashboard.js
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
  Alert,
  TextInput,
  useWindowDimensions,
  BackHandler,
  Platform,
  Linking,
  Modal,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import DeviceInfo from 'react-native-device-info';

import ForceUpdateModal from '../components/ForceUpdate/ForceUpdateModal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  api,
  getToken,
  setToken,
  getBase,
  IS_SET_CAMPUS,
  setActiveLocationId,
  clearActiveLocationId,
} from '../api/client';
import LinearGradient from 'react-native-linear-gradient';
import Config from 'react-native-config';

const BG = '#0F172A';
const CARD = '#0B1220';
const TEXT = '#FFFFFF';
const MUTED = '#94A3B8';
const BORDER = '#334155';
const BORDER_SOFT = '#1F2937';
const CTA = '#22C55E';

const ANDROID_UPDATE_URL = Config.ANDROID_UPDATE_URL;

function compareVersions(versionA, versionB) {
  const normalize = value =>
    String(value || '')
      .trim()
      .replace(/^v/i, '')
      .split('.')
      .map(part => {
        const parsed = parseInt(part, 10);

        return Number.isFinite(parsed) ? parsed : 0;
      });

  const a = normalize(versionA);
  const b = normalize(versionB);

  const length = Math.max(a.length, b.length);

  for (let index = 0; index < length; index += 1) {
    const aPart = a[index] || 0;
    const bPart = b[index] || 0;

    if (aPart > bPart) {
      return 1;
    }

    if (aPart < bPart) {
      return -1;
    }
  }

  return 0;
}

export default function Dashboard() {
  const navigation = useNavigation();
  const mounted = useRef(true);

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit this app?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Exit',
              style: 'destructive',
              onPress: () => {
                BackHandler.exitApp();
              },
            },
          ],
          {
            cancelable: true,
          },
        );

        // Prevent the default back action.
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );

      return () => {
        subscription.remove();
      };
    }, []),
  );

  const { width } = useWindowDimensions();

  const dashboardHorizontalPadding = 16;
  const cardGap = 12;

  const cardWidth = (width - dashboardHorizontalPadding * 2 - cardGap) / 2;

  const [meName, setMeName] = useState(null);
  const [meEmail, setMeEmail] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [meRole, setMeRole] = useState(null);

  const [meActualRole, setMeActualRole] = useState(null);
  const [busy, setBusy] = useState(true);
  const [role, setRole] = useState(null);
  const [cards, setCards] = useState([]);
  const [hasParentToken, setHasParentToken] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [storageLabel, setStorageLabel] = useState('');

  const [forceUpdateVisible, setForceUpdateVisible] = useState(false);

  const [installedVersion, setInstalledVersion] = useState('');

  const [latestVersion, setLatestVersion] = useState('');

  const [openingUpdate, setOpeningUpdate] = useState(false);

  const [locationItems, setLocationItems] = useState([]);
  const [activeLocation, setActiveLocation] = useState(null);
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [locationSelectorEnabled, setLocationSelectorEnabled] = useState(false);

  // Keep the selected ID available without waiting for React state updates.
  const activeLocationIdRef = useRef(null);

  // const routeMap = {
  //   '/dashboard': 'Dashboard',
  //   '/students': 'Students',
  //   '/exams': 'Exams',
  //   '/teachers': 'Teachers',
  //   '/parents': 'Parents',
  //   '/classes': 'Classes',
  //   '/courses': 'Courses',
  //   '/question_bank': 'QuestionBank',
  //   '/settings': 'Settings',
  //   '/notifications': 'Notifications',
  //   '/exams?mode=homework': 'Homework',
  //   '/classworks': 'Classworks',
  //   '/online': 'OnlineCourses',
  //   '/attendance': 'Attendance',
  //   '/forum': 'Forums',
  //   '/examinations': 'Results',
  //   '/routines': 'Routine',
  //   '/billing': 'BillingDashboard',
  //   '/qweb/classrooms': 'ClassRoom',
  // };

  const routeMapStudent = {
    '/dashboard': 'Dashboard',
    '/plugins/online-courses/catalog': 'OnlineCourses',
    '/exams': 'Exams',
    '/exams?mode=homework': 'Homework',
    '/classworks': 'Classworks',
    '/qweb/classrooms': 'ClassRoom',
    '/routines': 'Routine',
    '/attendance': 'Attendance',
    '/examinations': 'Results',
    '/my-profile': 'MyProfile',
    '/notifications': 'Notifications',
    '/forum': 'AdminForums',
    '/billing': 'BillingDashboard',
  };

  const routeMapParent = {
    '/dashboard': 'Dashboard',
    '/notifications': 'Notifications',
    '/exams?mode=homework': 'Homework',
    '/classworks': 'Classworks',
    '/students': 'Students',
    '/routines': 'Routine',
    '/forum': 'Forums',
    '/attendance': 'Attendance',
    '/examinations': 'Results',
    '/billing': 'BillingDashboard',
  };

  const routeMapTeacher = {
    '/dashboard': 'Dashboard',
    '/forum': 'AdminForums',
    '/attendance': 'AdminAttendance',
    '/question_bank': 'QuestionBank',
    '/plugins/online-courses/catalog': 'OnlineCourses',
    '/plugins/online-courses/editor': 'AdminOnlineCoursesEditor',
    '/notifications': 'Notifications',
    '/examinations': 'AdminExaminations',
    '/exams?mode=homework': 'AdminHomework',
    '/plugins/financial-accounting/payroll/payslips':
      'TeacherFinancialAccountingPayrollPayslips',
    '/plugins/financial-accounting/staff-attendance/my':
      'TeacherFinancialAccountingStaffAttendance',
    '/plugins/financial-accounting/leave-register/my':
      'TeacherFinancialAccoutingLeaveRegister',
    '/classworks': 'AdminClassworks',
    '/qweb/classrooms': 'AdminClassRoom',
    '/results': 'AdminResults',
    '/my-profile': 'MyProfile',
    '/routines': 'Routine',
  };

  const routeMapAdmin = {
    '/dashboard': 'Dashboard',
    '/forum': 'AdminForums',
    '/attendance': 'AdminAttendance',
    '/question_bank': 'QuestionBank',
    '/plugins/online-courses/catalog': 'OnlineCourses',
    '/plugins/online-courses/editor': 'AdminOnlineCoursesEditor',
    '/notifications/admin': 'AdminNotifications',
    '/examinations': 'AdminExaminations',
    '/exams?mode=homework': 'AdminHomework',
    '/classworks': 'AdminClassworks',
    '/qweb/classrooms': 'AdminClassRoom',
    '/results': 'AdminResults',
    '/routines': 'Routine',
    '/teachers': 'AdminTeachers',
    '/students': 'AdminStudents',
    '/plugins/online-courses/students': 'AdminOnlineCoursesStudent',
    '/plugins/online-courses/purchases': 'AdminOnlineCoursesPurchases',
    '/parents': 'AdminParents',
    '/classes': 'AdminClassGroups',
    '/courses': 'AdminCourses',
    '/billing': 'AdminBilling',
    '/admins': 'AdminAdministrators',
    '/settings': 'AdminSettings',
    '/password-registrations': 'AdminPasswordRegistrations',
    '/my-profile': 'MyProfile',
    '/admissions/admin': 'AdminAdmissions',
    '/staffs': 'AdminStaffs',
    '/role-assignments': 'AdminRoleAssignments',
    '/management-dashboard': 'AdminManagementDashboard',
    '/plugins/financial-accounting/accounts': 'AdminAccounts',
    '/plugins/financial-accounting/payroll': 'AdminPayroll',
  };

  useFocusEffect(
    useCallback(() => {
      mounted.current = true;

      reload();

      return () => {
        mounted.current = false;
      };
    }, []),
  );

  async function checkAndroidVersion() {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const currentInstalledVersion = DeviceInfo.getVersion();

      setInstalledVersion(currentInstalledVersion);

      const response = await api('/api/android-version');

      const serverVersion = String(response?.android_current_ver || '').trim();
      // const serverVersion = '0.0.9';

      if (!serverVersion) {
        return true;
      }

      setLatestVersion(serverVersion);

      const needsUpdate =
        compareVersions(currentInstalledVersion, serverVersion) < 0;

      setForceUpdateVisible(needsUpdate);

      return !needsUpdate;
    } catch (error) {
      console.log('Android version check error:', error);

      /*
       * Do not block the whole app because of
       * a temporary version-check API failure.
       */
      return true;
    }
  }

  async function reload() {
    try {
      setBusy(true);

      const tok = await getToken();
      if (!tok) {
        // no token → go to Login without noise
        navigation.replace('Login');
        return;
      }

      const canContinue = await checkAndroidVersion();

      if (!canContinue) {
        /*
         * Do not load /api/me,
         * dashboard cards, storage, etc.
         * until the app is updated.
         */
        return;
      }

      // store /api/me response
      console.log('[DASHBOARD] Calling /api/me');
      const me = await api('/api/me');
      console.log('[DASHBOARD] /api/me success');
      await AsyncStorage.setItem('me', JSON.stringify(me));

      if (mounted.current) {
        setMeName(me?.name || null);
        setMeEmail(me?.email || null);

        setMeRole(me?.primary_role || me?.role || null);

        setStudentProfile(me?.student_profile || null);

        setMeActualRole(me?.actual_role || null);
      }

      // detect Act-As presence
      const pt = await AsyncStorage.getItem('parent_token');
      if (mounted.current) setHasParentToken(!!pt);

      // Load location context only when campus mode is enabled.

      if (IS_SET_CAMPUS) {
        console.log('[DASHBOARD] Loading location context');

        const context = await api('/api/auth/location-context', {
          method: 'GET',
        });

        const items = Array.isArray(context?.items)
          ? context.items.filter(
              item => Number.isInteger(Number(item?.id)) && Number(item.id) > 0,
            )
          : [];

        setLocationItems(items);

        setLocationSelectorEnabled(
          context?.applicable === true &&
            context?.show_location === true &&
            context?.show_selector === true,
        );

        const currentId = Number(context?.current?.id);

        const activeId =
          Number.isInteger(currentId) && currentId > 0 ? currentId : null;

        const selectedLocation =
          items.find(item => Number(item.id) === activeId) ||
          (activeId ? context?.current : null);

        // Important: update the centralized API location context.
        activeLocationIdRef.current = activeId;
        setActiveLocationId(activeId);
        setActiveLocation(selectedLocation || null);

        console.log('[LOCATION CONTEXT]', {
          applicable: context?.applicable,
          currentId: activeId,
          selectionRequired: context?.selection_required,
          associationRequired: context?.association_required,
          availableLocations: items.length,
        });

        if (
          context?.applicable === true &&
          (context?.selection_required === true ||
            context?.association_required === true ||
            !activeId)
        ) {
          setCards([]);
          setLocationPickerVisible(true);
          return;
        }

        setLocationPickerVisible(false);
      } else {
        clearActiveLocationId();

        activeLocationIdRef.current = null;
        setActiveLocation(null);
        setLocationItems([]);
        setLocationPickerVisible(false);
        setLocationSelectorEnabled(false);
      }

      const data = await api('/api/dashboard-elements');

      console.log('[DASHBOARD] Dashboard elements loaded');

      if (!mounted.current) return;

      setRole(data?.role || null);

      const role = (data?.role || '').toLowerCase();

      const rawCards = Array.isArray(data?.cards) ? data.cards : [];

      const cards = rawCards.map(card => ({
        ...card,
        link: normalizeDashboardLink(card?.link),
      }));

      console.log('Normalized cards ===>', cards);

      const actualRole = (me?.actual_role || '').toLowerCase();

      const isAdminUser =
        role === 'admin' ||
        role === 'super_admin' ||
        actualRole === 'super_admin';

      if (isAdminUser) {
        loadStorageUsage();
      } else {
        setStorageLabel('');
      }

      const allowedLinksByRole = {
        // teacher: new Set([
        //   '/attendance',
        //   '/forum',
        //   '/question_bank',
        //   '/online',
        // ]),

        admin: new Set([
          '/forum',
          '/attendance',
          '/question_bank',
          '/plugins/online-courses/catalog',
          '/plugins/online-courses/editor',
          '/notifications/admin',
          '/examinations',
          '/exams?mode=homework',
          '/classworks',
          '/qweb/classrooms',
          '/results',
          '/routines',
          '/teachers',
          '/students',
          '/plugins/online-courses/students',
          '/plugins/online-courses/purchases',
          '/parents',
          '/classes',
          '/courses',
          '/billing',
          '/admins',
          '/settings',
          '/password-registrations',
          '/my-profile',
          '/admissions/admin',
          '/staffs',
          '/role-assignments',
          '/management-dashboard',
          '/plugins/financial-accounting/accounts',
          '/plugins/financial-accounting/payroll',
        ]),
      };

      const allowedLinks = allowedLinksByRole[role];

      const cardFilterData = allowedLinks
        ? cards.filter(card =>
            allowedLinks.has((card?.link || '').trim().toLowerCase()),
          )
        : cards;

      setCards(cardFilterData);
    } catch (e) {
      // If unauthorized, silently bounce to Login (no "Unauthenticated" alert)
      if (e && e.status === 401) {
        if (mounted.current) navigation.replace('Login');
        return;
      }
      console.log('[DASHBOARD ERROR]', {
        message: e?.message,
        status: e?.status,
        data: e?.data,
      });
      if (mounted.current) {
        Alert.alert('Error', e?.message || 'Failed to load dashboard');
      }
    } finally {
      if (mounted.current) setBusy(false);
    }
  }

  async function handleSelectLocation(location) {
    const actualRole = String(meActualRole || '').toLowerCase();

    if (
      !IS_SET_CAMPUS ||
      actualRole !== 'super_admin' ||
      !locationSelectorEnabled
    ) {
      Alert.alert(
        'Access Denied',
        'Only Super Admin can change the active location.',
      );
      return;
    }
    if (!IS_SET_CAMPUS) {
      return;
    }

    const locationId = Number(location?.id);

    if (!Number.isInteger(locationId) || locationId <= 0) {
      Alert.alert('Location', 'Please select a valid location.');
      return;
    }

    try {
      setBusy(true);

      // Persist the selected campus on the backend.
      const response = await api('/api/auth/location-context', {
        method: 'PUT',
        body: JSON.stringify({
          location_id: locationId,
        }),
      });

      const confirmedId = Number(response?.current?.id);

      if (confirmedId !== locationId) {
        throw new Error('Server did not confirm the selected campus.');
      }

      // Update both centralized and local context.
      setActiveLocationId(confirmedId);
      activeLocationIdRef.current = confirmedId;

      setActiveLocation(response.current);
      setLocationPickerVisible(false);

      console.log('[LOCATION] Campus selected:', confirmedId);
    } catch (error) {
      console.log('[LOCATION] Selection error:', {
        status: error?.status,
        code: error?.code,
        message: error?.message,
      });

      Alert.alert(
        'Location Selection Failed',
        error?.message || 'Could not select campus.',
      );

      return;
    } finally {
      setBusy(false);
    }

    // Fetch the latest backend context and dashboard cards.
    await reload();
  }

  function normalizeDashboardLink(link) {
    const value = String(link || '').trim();

    if (!value) {
      return '';
    }

    const baseUrl = String(getBase() || '').replace(/\/+$/, '');

    if (!baseUrl) {
      return value;
    }

    if (value === baseUrl) {
      return '/';
    }

    if (value.startsWith(`${baseUrl}/`)) {
      return value.slice(baseUrl.length);
    }

    return value;
  }

  async function openAttendanceForStudent() {
    try {
      const meta = await api('/api/attendance/meta');
      console.log('attendance meta ===> ', meta);

      // 1) Try wards (Parent-style / multi-child style)
      const wards = Array.isArray(meta?.wards) ? meta.wards : [];
      let ward = wards[0] || null;

      // 2) Fallback for Student-style response
      if (!ward && meta?.student) {
        ward = {
          id: meta.student.student_id,
          name: meta.student.name,
          class_group_id:
            meta.student.class_group_id ||
            meta.student.class_group?.id ||
            meta.student.class_id,
          class_label:
            meta.student.class_label ||
            meta.student.class_group?.label ||
            meta.student.class_group?.name,
        };
      }

      if (!ward) {
        Alert.alert(
          'Attendance',
          'No attendance profile found for this student.',
        );
        return;
      }

      // 👉 Go to Calendar screen instead of AnnualAttendance
      navigation.navigate('Calendar', {
        ward,
        student_id: ward.id,
        class_group_id: ward.class_group_id,
      });
    } catch (e) {
      console.log('openAttendanceForStudent error', e);
      Alert.alert('Attendance', e?.message || 'Could not open attendance.');
    }
  }

  async function handleForceUpdate() {
    if (openingUpdate) {
      return;
    }

    try {
      setOpeningUpdate(true);

      const supported = await Linking.canOpenURL(ANDROID_UPDATE_URL);

      if (!supported) {
        throw new Error(
          'Google Play Store link cannot be opened on this device.',
        );
      }

      await Linking.openURL(ANDROID_UPDATE_URL);
    } catch (error) {
      console.log('Open Play Store error:', error);

      Alert.alert(
        'Update App',
        error?.message || 'Could not open Google Play Store.',
      );
    } finally {
      setOpeningUpdate(false);
    }
  }

  async function openCard(link) {
    console.log('link==>', link);
    const normalizedRole = (role || '').toLowerCase();
    const normalizedActualRole = (meActualRole || '').toLowerCase();

    const normalizedLink = normalizeDashboardLink(link);

    console.log('Normalized link ==>', normalizedLink);

    if (normalizedRole === 'student') {
      if (normalizedLink === '/attendance') {
        await openAttendanceForStudent();
        return;
      }
      const routeName = routeMapStudent[normalizedLink];
      if (routeName) {
        navigation.navigate(routeName);
      } else {
        Alert.alert(
          'Not Implemented',
          `No native screen is mapped for ${link} yet.`,
        );
      }
    } else if (normalizedRole === 'parent') {
      const routeName = routeMapParent[normalizedLink];
      if (routeName) {
        navigation.navigate(routeName);
      } else {
        Alert.alert(
          'Not Implemented',
          `No native screen is mapped for ${link} yet.`,
        );
      }
    } else if (normalizedRole === 'teacher') {
      const routeName = routeMapTeacher[normalizedLink];
      if (routeName) {
        navigation.navigate(routeName);
      } else {
        Alert.alert(
          'Not Implemented',
          `No native screen is mapped for ${link} yet.`,
        );
      }
    } else if (
      normalizedRole === 'admin' ||
      normalizedRole === 'super_admin' ||
      normalizedActualRole === 'super_admin'
    ) {
      const routeName = routeMapAdmin[normalizedLink];
      if (routeName) {
        navigation.navigate(routeName);
      } else {
        Alert.alert(
          'Not Implemented',
          `No native screen is mapped for ${link} yet.`,
        );
      }
    }
  }

  async function onBackToParent() {
    try {
      const pt = await AsyncStorage.getItem('parent_token');
      if (!pt) {
        Alert.alert('Back to Parent', 'No parent token found.');
        return;
      }
      await setToken(String(pt));
      await AsyncStorage.removeItem('parent_token');
      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
    } catch (e) {
      Alert.alert(
        'Back to Parent',
        e?.message || 'Could not switch back to parent.',
      );
    }
  }

  async function onLogout() {
    // 1) Snapshot current token (for a best-effort server logout)
    const tok = await getToken();

    // 2) Immediately clear local auth & navigate to Login (avoid 401 flashes)
    await setToken(null);
    clearActiveLocationId();
    await AsyncStorage.removeItem('parent_token');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

    // 3) Fire-and-forget server logout with bearer if we had one.
    //    Use fetch directly so it never throws into UI.
    try {
      if (tok) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tok}`,
          },
          body: '{}',
        }).catch(() => {});
      }
    } catch {
      // ignore
    }
  }

  async function loadStorageUsage() {
    try {
      const response = await api('/api/storage-usage');

      if (!mounted.current) return;

      setStorageLabel(response?.label?.replace(/^\s*\[|\]\s*$/g, '') || '');
    } catch (error) {
      console.log('Storage usage API error:', error);

      if (mounted.current) {
        setStorageLabel('');
      }
    }
  }

  if (busy) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: BG,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  const roleUpper =
    meActualRole == 'super_admin'
      ? 'SUPER ADMIN'
      : (role || '').toString().toUpperCase();
  const headerRole = String(meRole || role || '').toLowerCase();

  const isStudent = headerRole === 'student';

  const isTeacher = headerRole === 'teacher';
  const isAdmin = headerRole === 'admin' || headerRole === 'super_admin';
  const studentClassText = [studentProfile?.class_name, studentProfile?.section]
    .filter(Boolean)
    .join(' - ');

  const normalizedRole = (role || '').toString().toLowerCase();
  const normalizedActualRole = (meActualRole || '').toString().toLowerCase();

  // Only Super Admin can change the active campus.
  const canChangeLocation =
    IS_SET_CAMPUS &&
    (normalizedActualRole === 'super_admin' ||
      normalizedRole === 'super_admin');

  const canShowDashboardSettings =
    normalizedRole === 'student' ||
    normalizedRole === 'teacher' ||
    normalizedRole === 'admin' ||
    normalizedRole === 'super_admin';

  const isAdminOrSuperAdmin =
    normalizedRole === 'admin' ||
    normalizedRole === 'super_admin' ||
    normalizedActualRole === 'super_admin';

  const canSearchMenu =
    normalizedRole === 'student' ||
    normalizedRole === 'teacher' ||
    normalizedRole === 'admin' ||
    normalizedRole === 'super_admin' ||
    normalizedActualRole === 'super_admin';

  const normalizedMenuSearch = menuSearch.trim().toLowerCase();

  const filteredCards = normalizedMenuSearch
    ? cards.filter(card => {
        const name = (card?.name || '').toString().toLowerCase();
        const link = (card?.link || '').toString().toLowerCase();

        return (
          name.includes(normalizedMenuSearch) ||
          link.includes(normalizedMenuSearch)
        );
      })
    : cards;

  return (
    <View style={{ flex: 1, backgroundColor: BG, padding: 16 }}>
      <ForceUpdateModal
        visible={forceUpdateVisible}
        installedVersion={installedVersion}
        latestVersion={latestVersion}
        updating={openingUpdate}
        onUpdatePress={handleForceUpdate}
      />

      {IS_SET_CAMPUS && (
        <Modal
          visible={
            locationPickerVisible &&
            !busy &&
            (canChangeLocation || !activeLocation)
          }
          transparent
          animationType="fade"
          onRequestClose={() => {
            if (activeLocation) {
              setLocationPickerVisible(false);
            }
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.75)',
              justifyContent: 'center',
              padding: 18,
            }}
          >
            <View
              style={{
                backgroundColor: '#0B1C32',
                borderWidth: 1,
                borderColor: '#3B7197',
                borderRadius: 14,
                padding: 16,
                maxHeight: '75%',
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 17,
                  fontWeight: '900',
                  marginBottom: 5,
                }}
              >
                Select Location
              </Text>

              <Text
                style={{
                  color: '#AFC0D8',
                  fontSize: 12,
                  marginBottom: 15,
                }}
              >
                Choose a location to continue to the dashboard.
              </Text>

              <FlatList
                data={locationItems}
                keyExtractor={item => String(item.id)}
                ListEmptyComponent={
                  <Text style={{ color: '#AFC0D8', paddingVertical: 12 }}>
                    No locations available for this account.
                  </Text>
                }
                renderItem={({ item }) => {
                  const selected =
                    Number(activeLocation?.id) === Number(item.id);

                  return (
                    <Pressable
                      onPress={() => handleSelectLocation(item)}
                      style={{
                        minHeight: 48,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: selected ? '#1D4ED8' : '#142B49',
                        borderWidth: 1,
                        borderColor: selected ? '#60A5FA' : '#3B7197',
                        borderRadius: 9,
                        paddingHorizontal: 13,
                        marginBottom: 9,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          color: '#FFFFFF',
                          fontSize: 13,
                          fontWeight: '700',
                        }}
                      >
                        {item.name}
                      </Text>

                      {selected ? (
                        <Text style={{ color: '#FFFFFF', fontSize: 17 }}>
                          ✓
                        </Text>
                      ) : null}
                    </Pressable>
                  );
                }}
              />

              {activeLocation ? (
                <Pressable
                  onPress={() => setLocationPickerVisible(false)}
                  style={{
                    minHeight: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#3B7197',
                    borderRadius: 9,
                    marginTop: 10,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>
                    Close
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </Modal>
      )}

      {/* Top bar with Logout */}
      {/* Top bar */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        {/* Left side: Dashboard + Storage */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Text
              style={{
                color: TEXT,
                fontWeight: '800',
                fontSize: 18,
              }}
            >
              Dashboard
            </Text>

            {isAdminOrSuperAdmin ? (
              <Pressable
                onPress={() => navigation.navigate('StorageFiles')}
                disabled={!storageLabel}
                style={({ pressed }) => ({
                  paddingVertical: 7,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#3B82A0',
                  backgroundColor: pressed ? '#203A5F' : '#142B49',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: !storageLabel ? 0.6 : pressed ? 0.8 : 1,
                })}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: TEXT,
                    fontSize: 12,
                    fontWeight: '800',
                  }}
                >
                  {storageLabel || 'Loading...'}
                </Text>
              </Pressable>
            ) : null}
          </View>

          {headerRole ? (
            isStudent ? (
              <View
                style={{
                  marginTop: 5,
                }}
              >
                {meName ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#C7D5EA',
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                  >
                    {meName || 'Email not provided'}
                  </Text>
                ) : null}

                {meEmail ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#C7D5EA',
                      fontSize: 12,
                      fontWeight: '600',
                    }}
                  >
                    {meEmail || 'Email not provided'}
                  </Text>
                ) : null}

                <Text
                  numberOfLines={1}
                  style={{
                    color: MUTED,
                    fontSize: 12,
                    fontWeight: '700',
                    marginTop: 3,
                  }}
                >
                  {studentClassText || 'Class not available'}

                  {studentProfile?.roll_no
                    ? ` · Roll: ${studentProfile.roll_no}`
                    : ''}
                </Text>
              </View>
            ) : isTeacher || isAdmin ? (
              <View
                style={{
                  marginTop: 5,
                }}
              >
                {meEmail ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#C7D5EA',
                      fontSize: 12,
                      fontWeight: '600',
                    }}
                  >
                    {meEmail || 'Email not provided'}
                  </Text>
                ) : null}

                <Text
                  style={{
                    color: '#93C5FD',
                    fontSize: 12,
                    fontWeight: '800',
                    marginTop: 3,
                  }}
                >
                  {roleUpper}
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  color: MUTED,
                  marginTop: 4,
                  fontWeight: '700',
                }}
              >
                {roleUpper}
              </Text>
            )
          ) : null}
        </View>

        {/* Right side: Settings + Logout */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {canShowDashboardSettings ? (
            <Pressable
              onPress={() => navigation.navigate('AdminDashboardPreferences')}
              style={({ pressed }) => ({
                width: 42,
                height: 38,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#3B82A0',
                backgroundColor: pressed ? '#203A5F' : '#142B49',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text
                style={{
                  color: TEXT,
                  fontSize: 17,
                }}
              >
                ⚙️
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={onLogout}
            style={({ pressed }) => ({
              paddingVertical: 9,
              paddingHorizontal: 13,
              borderRadius: 10,
              backgroundColor: pressed ? '#b91c1c' : '#ef4444',
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text
              style={{
                color: TEXT,
                fontWeight: '700',
              }}
            >
              Logout
            </Text>
          </Pressable>
        </View>
      </View>

      {IS_SET_CAMPUS && activeLocation ? (
        <Pressable
          onPress={() => {
            if (canChangeLocation && locationSelectorEnabled) {
              setLocationPickerVisible(true);
            }
          }}
          disabled={!canChangeLocation || !locationSelectorEnabled}
          style={{
            minHeight: 45,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#142B49',
            borderWidth: 1,
            borderColor: '#3B7197',
            borderRadius: 10,
            paddingHorizontal: 13,
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ color: '#94A3B8', fontSize: 10 }}>
              Active Location
            </Text>

            <Text
              numberOfLines={1}
              style={{
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: '800',
                marginTop: 3,
              }}
            >
              {activeLocation.name}
            </Text>
          </View>

          {canChangeLocation && locationSelectorEnabled ? (
            // <Text style={{ color: '#93C5FD', fontSize: 19 }}>⌄</Text>
            <Ionicons name={'chevron-down'} size={19} color={'#93C5FD'} />
          ) : null}
        </Pressable>
      ) : null}

      {/* Back to Parent banner if we have a stored parent token */}
      {hasParentToken ? (
        <View
          style={{
            padding: 10,
            borderRadius: 12,
            marginBottom: 12,
            backgroundColor: CARD,
            borderWidth: 1,
            borderColor: BORDER,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: MUTED }}>Acting as Student</Text>
            <Pressable
              onPress={onBackToParent}
              style={({ pressed }) => ({
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 10,
                backgroundColor: pressed ? '#1F2937' : CTA,
              })}
            >
              <Text style={{ color: BG, fontWeight: '700' }}>
                Back to Parent
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {canSearchMenu ? (
        <View style={{ marginBottom: 12 }}>
          <TextInput
            value={menuSearch}
            onChangeText={setMenuSearch}
            placeholder="Type to filter or jump to a menu item"
            placeholderTextColor={MUTED}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
            style={{
              minHeight: 50,
              color: TEXT,
              backgroundColor: CARD,
              borderWidth: 1,
              borderColor: '#3B7197',
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
            }}
          />
        </View>
      ) : null}

      {/* Cards */}
      <FlatList
        data={filteredCards}
        keyExtractor={(item, idx) => String(item?.link || idx)}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: cardGap,
        }}
        contentContainerStyle={{
          paddingBottom: 28,
        }}
        ListEmptyComponent={
          <Text
            style={{
              color: MUTED,
              textAlign: 'center',
              marginTop: 24,
            }}
          >
            No dashboard items.
          </Text>
        }
        renderItem={({ item }) => {
          const emoji = item?.emoji || '📦';

          const name = item?.name || 'Unknown';

          const link = item?.link || '';

          return (
            <Pressable
              onPress={() => openCard(link)}
              style={({ pressed }) => ({
                width: cardWidth,
                height: 118,
                borderRadius: 16,
                overflow: 'hidden',
                opacity: pressed ? 0.82 : 1,
              })}
            >
              <LinearGradient
                colors={['#203A5F', '#142B49', '#0B1C32']}
                start={{
                  x: 0,
                  y: 0,
                }}
                end={{
                  x: 1,
                  y: 1,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderWidth: 1,
                  borderColor: '#3B7197',
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 8,
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 35,
                      lineHeight: 42,
                      textAlign: 'center',
                    }}
                  >
                    {emoji}
                  </Text>

                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    allowFontScaling={false}
                    style={{
                      color: TEXT,
                      fontSize: 13,
                      lineHeight: 17,
                      fontWeight: '900',
                      textAlign: 'center',
                      marginTop: 5,
                    }}
                  >
                    {name}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
