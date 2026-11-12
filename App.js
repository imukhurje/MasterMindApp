import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './src/screens/Login/Login';
import Dashboard from './src/screens/Dashboard';
import Students from './src/screens/Students';
import ExamsScreen from './src/screens/Exam/ExamsScreen';
import ExamHall from './src/screens/Exam/ExamHall';
import Notifications from './src/screens/Notifications';
import Homework from './src/screens/Homework/Homework';
import HomeworkDetail from './src/screens/Homework/HomeworkDetail';
import Classworks from './src/screens/Classworks/Classworks';
import ClassworkDetail from './src/screens/Classworks/ClassworkDetail';
import OnlineCourses from './src/screens/OnlineCourses';
import OnlineCourseOverviewLanding from './src/screens/CourseOverview/OnlineCourseOverviewLanding';
import OnlineCourseWorkspaceScreen from './src/screens/CourseOverview/OnlineCourseWorkspaceScreen';
import OnlineQuizScreen from './src/screens/CourseOverview/OnlineQuizScreen';
import AttendanceWards from './src/screens/Attendance/AttendanceWards';
import AttendanceCalendar from './src/screens/Attendance/AttendanceCalendar';
import AnnualAttendance from './src/screens/Attendance/AnnualAttendance';
import Forums from './src/screens/Forums/Forums';
import ForumDetail from './src/screens/Forums/ForumDetail';
import Results from './src/screens/Result/Results';
import Marksheet from './src/screens/Result/Marksheet';
import Routine from './src/screens/Routines/Routine';
// import OrgSelect from './src/screens/OrgSelect';
import Billing from './src/screens/Billing/BillingDashboard';
import StaffAttendance from './src/screens/Attendance/StaffAttendanceDashboard';
import ClassRoom from './src/screens/Classroom/ClassRoom';
import AttendanceReports from './src/screens/Attendance/AttendanceReports';
import QuestionBank from './src/screens/Admin/Question/QuestionBank';
import QuestionForm from './src/screens/Admin/Question/QuestionForm';
import AIGenerator from './src/screens/Admin/Question/AIGenerator';
import AIHelp from './src/screens/Admin/Question/AIHelp';
import AINewPrompt from './src/screens/Admin/Question/AINewPrompt';
import AIPromptQuestions from './src/screens/Admin/Question/AIPromptQuestions';
import StorageFiles from './src/screens/Admin/Storage/StorageFiles';
import AdminDashboardPreferences from './src/screens/Admin/DashboardPreferences/AdminDashboardPreferences';
import AdminNotifications from './src/screens/Admin/Notifications/AdminNotifications';
import AdminExaminations from './src/screens/Admin/Examinations/AdminExaminations';
import AdminExaminationDetails from './src/screens/Admin/Examinations/AdminExaminationDetails';
import AdminManageExamPapers from './src/screens/Admin/Examinations/AdminManageExamPapers';
import AdminAssignExamStudents from './src/screens/Admin/Examinations/AdminAssignExamStudents';
import AdminAssignExamQuestions from './src/screens/Admin/Examinations/AdminAssignExamQuestions';
import AdminOnlineCourseEditor from './src/screens/Admin/CourseEditor/AdminOnlineCoursesEditor';
import AdminOnlineCourseDetailsEditor from './src/screens/Admin/CourseEditor/AdminOnlineCourseDetailsEditor';
import AdminChapterMaterialsEditor from './src/screens/Admin/CourseEditor/AdminChapterMaterialsEditor';
import AdminAddExamPaper from './src/screens/Admin/Examinations/AdminAddExamPaper';
import AdminEditExamPaper from './src/screens/Admin/Examinations/AdminEditExamPaper';
import AdminExamPaperOverview from './src/screens/Admin/Examinations/AdminExamPaperOverview';
import AdminExaminationSchedule from './src/screens/Admin/Examinations/AdminExaminationSchedule';
import AdminMarksheets from './src/screens/Admin/Examinations/AdminMarksheets';
import AdminAdmitCards from './src/screens/Admin/Examinations/AdminAdmitCards';
import AdminSettings from './src/screens/Admin/Settings/AdminSettings';
import AdminHomework from './src/screens/Admin/Homework/AdminHomework';
import AdminHomeworkForm from './src/screens/Admin/Homework/AdminHomeworkForm';
import AdminAssignHomeworkStudents from './src/screens/Admin/Homework/AdminAssignHomeworkStudents';
import AdminAssignHomeworkQuestions from './src/screens/Admin/Homework/AdminAssignHomeworkQuestions';
import AdminForums from './src/screens/Admin/Forums/AdminForums';
import AdminForumChat from './src/screens/Admin/Forums/AdminForumChat';
import AdminForumAccess from './src/screens/Admin/Forums/AdminForumAccess';
import AdminPrivateMessages from './src/screens/Admin/Forums/AdminPrivateMessages';
import AdminClassworks from './src/screens/Admin/Classworks/AdminClassworks';
import AdminResults from './src/screens/Admin/Results/AdminResults';
import AdminTeachers from './src/screens/Admin/Teachers/AdminTeachers';
import AdminTeacherForm from './src/screens/Admin/Teachers/AdminTeacherForm';
import PasswordRegistration from './src/screens/Registration/PasswordRegistration';
import AdminPasswordRegistrations from './src/screens/Admin/Registrations/AdminPasswordRegistrations';
import ForgotPassword from './src/screens/Login/ForgotPassword';
import MyProfile from './src/screens/Profile/MyProfile';
import ExamResultDetail from './src/screens/Exam/ExamResultDetail';
import AdminClassworkCreate from './src/screens/Admin/Classworks/AdminClassworkCreate';
import AdminClassworkEdit from './src/screens/Admin/Classworks/AdminClassworkEdit';
import AdminAttendance from './src/screens/Admin/Attendance/AdminAttendance';
import AdminAttendanceReports from './src/screens/Admin/Attendance/AdminAttendanceReports';
import AdminMarkAttendance from './src/screens/Admin/Attendance/AdminMarkAttendance';
import AdminStudents from './src/screens/Admin/Students/AdminStudents';
import AdminStudentCreate from './src/screens/Admin/Students/AdminStudentCreate';
import AdminStudentEdit from './src/screens/Admin/Students/AdminStudentEdit';
import AdminStudentIdentityCards from './src/screens/Admin/Students/AdminStudentIdentityCards';
import AdminAdmissions from './src/screens/Admin/Admission/AdminAdmissions';
import AdminAdmissionDetails from './src/screens/Admin/Admission/AdminAdmissionDetails';
import AdminClassGroups from './src/screens/Admin/Class/AdminClassGroups';
import AdminCourses from './src/screens/Admin/Course/AdminCourses';
import AdminRoleAssignments from './src/screens/Admin/RoleAssignments/AdminRoleAssignments';
import AdminAdministrators from './src/screens/Admin/Administrators/AdminAdministrators';
import AdminStaffs from './src/screens/Admin/Staff/AdminStaffs';
import AdminBilling from './src/screens/Admin/Billing/AdminBilling';
import AdminBillingPaymentDetails from './src/screens/Admin/Billing/AdminBillingPaymentDetails';
import AdminManagementDashboard from './src/screens/Admin/Management/AdminManagementDashboard';
import AdminAccounts from './src/screens/Admin/Accounts/AdminAccounts';
import AdminPayroll from './src/screens/Admin/Payroll/AdminPayroll';
import AdminClassRoom from './src/screens/Admin/Classroom/AdminClassRoom';
import AdminClassroomDetails from './src/screens/Admin/Classroom/AdminClassroomDetails';
import AdminClassroomCreate from './src/screens/Admin/Classroom/AdminClassroomCreate';
import AdminOnlineCoursesStudent from './src/screens/Admin/OnlineStudents/AdminOnlineCoursesStudent';
import AdminOnlineCoursesPurchases from './src/screens/Admin/OnlinePurchases/AdminOnlineCoursesPurchases';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            // initialRouteName="OrgSelect"
            initialRouteName="Login"
            screenOptions={{
              headerShown: true,
              headerStyle: { backgroundColor: '#0b1220' },
              headerTintColor: '#e2e8f0',
            }}
          >
            {/* <Stack.Screen
              name="OrgSelect"
              component={OrgSelect}
              options={{ headerShown: false }}
            /> */}
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PasswordRegistration"
              component={PasswordRegistration}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              options={{
                title: 'Reset student password',
              }}
            />
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Students" component={Students} />
            <Stack.Screen name="Exams" component={ExamsScreen} />
            <Stack.Screen
              name="ExamHall"
              component={ExamHall}
              options={{ title: 'Examination Hall' }}
            />
            <Stack.Screen
              name="ExamResultDetail"
              component={ExamResultDetail}
              options={{
                title: 'Exam Result',
              }}
            />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Homework" component={Homework} />
            <Stack.Screen
              name="HomeworkDetail"
              component={HomeworkDetail}
              options={{
                title: 'Homework Detail',
              }}
            />
            <Stack.Screen name="Classworks" component={Classworks} />
            <Stack.Screen
              name="ClassworkDetail"
              component={ClassworkDetail}
              options={{
                title: 'Classwork Detail',
              }}
            />
            <Stack.Screen name="Attendance" component={AttendanceWards} />
            <Stack.Screen name="Calendar" component={AttendanceCalendar} />
            <Stack.Screen
              name="AnnualAttendance"
              component={AnnualAttendance}
            />
            <Stack.Screen name="Forums" component={Forums} />
            <Stack.Screen name="ForumDetail" component={ForumDetail} />
            <Stack.Screen
              name="QuestionBank"
              component={QuestionBank}
              options={{
                title: 'Question Bank',
              }}
            />
            <Stack.Screen
              name="QuestionForm"
              component={QuestionForm}
              options={{
                title: '',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AIGenerator"
              component={AIGenerator}
              options={{
                title: 'AI Generator',
              }}
            />
            <Stack.Screen
              name="AIHelp"
              component={AIHelp}
              options={{
                title: 'Prompt Help',
              }}
            />
            <Stack.Screen
              name="AINewPrompt"
              component={AINewPrompt}
              options={{
                title: 'New Prompt',
              }}
            />
            <Stack.Screen
              name="AIPromptQuestions"
              component={AIPromptQuestions}
              options={{
                title: 'Generated Questions',
              }}
            />
            <Stack.Screen name="Results" component={Results} />
            <Stack.Screen name="Marksheet" component={Marksheet} />
            <Stack.Screen
              name="OnlineCourses"
              component={OnlineCourses}
              options={{
                title: '',
              }}
            />
            <Stack.Screen
              name="OnlineCourseOverviewLanding"
              component={OnlineCourseOverviewLanding}
              options={{
                title: '',
              }}
            />
            {/* <Stack.Screen
          name="OnlineCourseOverview"
          component={OnlineCourseOverviewLanding}
        /> */}
            <Stack.Screen
              name="OnlineCourseWorkspace"
              component={OnlineCourseWorkspaceScreen}
              options={{
                title: '',
              }}
            />
            <Stack.Screen
              name="OnlineQuizScreen"
              component={OnlineQuizScreen}
              options={{
                title: '',
              }}
            />
            <Stack.Screen
              name="Routine"
              component={Routine}
              options={{
                title: 'Routine',
              }}
            />
            <Stack.Screen
              name="BillingDashboard"
              component={Billing}
              options={{
                title: 'My Bills',
              }}
            />
            <Stack.Screen
              name="StaffAttendance"
              component={StaffAttendance}
              options={{
                title: 'Attendance',
              }}
            />
            <Stack.Screen
              name="ClassRoom"
              component={ClassRoom}
              options={{ title: 'Class room' }}
            />
            <Stack.Screen
              name="AttendanceReports"
              component={AttendanceReports}
              options={{ title: 'Attendance Reports' }}
            />
            <Stack.Screen
              name="StorageFiles"
              component={StorageFiles}
              options={{
                title: 'Storage files',
              }}
            />
            <Stack.Screen
              name="AdminDashboardPreferences"
              component={AdminDashboardPreferences}
              options={{
                title: 'Customize Dashboard',
              }}
            />
            <Stack.Screen
              name="AdminNotifications"
              component={AdminNotifications}
              options={{
                title: 'Admin Notifications',
              }}
            />
            <Stack.Screen
              name="AdminExaminations"
              component={AdminExaminations}
              options={{
                title: 'Examinations',
              }}
            />
            <Stack.Screen
              name="AdminExaminationDetails"
              component={AdminExaminationDetails}
              options={{
                title: 'Examination Details',
              }}
            />
            <Stack.Screen
              name="AdminManageExamPapers"
              component={AdminManageExamPapers}
              options={{
                title: 'Manage Exam Papers',
              }}
            />
            <Stack.Screen
              name="AdminAssignExamStudents"
              component={AdminAssignExamStudents}
              options={{
                title: 'Assign Students',
              }}
            />
            <Stack.Screen
              name="AdminAssignExamQuestions"
              component={AdminAssignExamQuestions}
              options={{
                title: 'Assign Questions',
              }}
            />
            <Stack.Screen
              name="AdminOnlineCoursesEditor"
              component={AdminOnlineCourseEditor}
              options={{
                title: 'Online Course Editor',
              }}
            />
            <Stack.Screen
              name="AdminOnlineCourseDetailsEditor"
              component={AdminOnlineCourseDetailsEditor}
              options={{
                title: 'Edit Online Course',
              }}
            />
            <Stack.Screen
              name="AdminChapterMaterialsEditor"
              component={AdminChapterMaterialsEditor}
              options={{
                title: 'Chapter Materials',
              }}
            />
            <Stack.Screen
              name="AdminAddExamPaper"
              component={AdminAddExamPaper}
              options={{
                title: 'Add Exam Paper',
              }}
            />
            <Stack.Screen
              name="AdminEditExamPaper"
              component={AdminEditExamPaper}
              options={{
                title: 'Edit Exam',
              }}
            />
            <Stack.Screen
              name="AdminExamPaperOverview"
              component={AdminExamPaperOverview}
              options={{
                title: 'Exam Paper Overview',
              }}
            />
            <Stack.Screen
              name="AdminExaminationSchedule"
              component={AdminExaminationSchedule}
              options={{
                title: 'Schedule Papers',
              }}
            />
            <Stack.Screen
              name="AdminMarksheets"
              component={AdminMarksheets}
              options={{
                title: 'Marksheets',
              }}
            />
            <Stack.Screen
              name="AdminAdmitCards"
              component={AdminAdmitCards}
              options={{
                title: 'Admit Cards',
              }}
            />
            <Stack.Screen
              name="AdminSettings"
              component={AdminSettings}
              options={{
                title: 'Settings',
              }}
            />
            <Stack.Screen
              name="AdminHomework"
              component={AdminHomework}
              options={{
                title: 'HomeWorks',
              }}
            />
            <Stack.Screen
              name="AdminHomeworkForm"
              component={AdminHomeworkForm}
              options={{
                title: 'Homework',
              }}
            />
            <Stack.Screen
              name="AdminAssignHomeworkStudents"
              component={AdminAssignHomeworkStudents}
              options={{
                title: 'Assign Students',
              }}
            />
            <Stack.Screen
              name="AdminAssignHomeworkQuestions"
              component={AdminAssignHomeworkQuestions}
              options={{
                title: 'Assign Questions',
              }}
            />
            <Stack.Screen
              name="AdminForums"
              component={AdminForums}
              options={{
                title: 'Forums',
              }}
            />
            <Stack.Screen
              name="AdminForumChat"
              component={AdminForumChat}
              options={{
                title: '',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AdminForumAccess"
              component={AdminForumAccess}
              options={{
                title: 'Forum Access',
              }}
            />
            <Stack.Screen
              name="AdminPrivateMessages"
              component={AdminPrivateMessages}
              options={{
                title: '',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AdminClassworks"
              component={AdminClassworks}
              options={{
                title: 'Classworks',
              }}
            />
            <Stack.Screen
              name="AdminResults"
              component={AdminResults}
              options={{
                title: 'Results',
              }}
            />
            <Stack.Screen
              name="AdminTeachers"
              component={AdminTeachers}
              options={{
                title: 'Teachers',
              }}
            />
            <Stack.Screen
              name="AdminTeacherForm"
              component={AdminTeacherForm}
              options={{
                title: 'Teacher',
              }}
            />
            <Stack.Screen
              name="AdminPasswordRegistrations"
              component={AdminPasswordRegistrations}
              options={{
                title: 'Registrations',
              }}
            />
            <Stack.Screen
              name="MyProfile"
              component={MyProfile}
              options={{
                title: 'My Profile',
              }}
            />
            <Stack.Screen
              name="AdminClassworkCreate"
              component={AdminClassworkCreate}
              options={{
                title: 'Create Classwork',
              }}
            />
            <Stack.Screen
              name="AdminClassworkEdit"
              component={AdminClassworkEdit}
              options={{
                title: 'Edit Classwork',
              }}
            />
            <Stack.Screen
              name="AdminAttendance"
              component={AdminAttendance}
              options={{
                title: 'Student Attendance',
              }}
            />
            <Stack.Screen
              name="AdminAttendanceReports"
              component={AdminAttendanceReports}
              options={{
                title: 'Attendance Reports',
              }}
            />
            <Stack.Screen
              name="AdminMarkAttendance"
              component={AdminMarkAttendance}
              options={{
                title: 'Mark Attendance',
              }}
            />
            <Stack.Screen
              name="AdminStudents"
              component={AdminStudents}
              options={{
                title: 'Students',
              }}
            />
            <Stack.Screen
              name="AdminStudentCreate"
              component={AdminStudentCreate}
              options={{
                title: 'Create Student',
              }}
            />
            <Stack.Screen
              name="AdminStudentEdit"
              component={AdminStudentEdit}
              options={{
                title: 'Edit Student',
              }}
            />
            <Stack.Screen
              name="AdminStudentIdentityCards"
              component={AdminStudentIdentityCards}
              options={{
                title: 'Identity Cards',
              }}
            />
            <Stack.Screen
              name="AdminAdmissions"
              component={AdminAdmissions}
              options={{
                title: 'Admissions',
              }}
            />
            <Stack.Screen
              name="AdminAdmissionDetails"
              component={AdminAdmissionDetails}
              options={{
                title: 'Admission Application',
              }}
            />
            <Stack.Screen
              name="AdminClassGroups"
              component={AdminClassGroups}
              options={{
                title: 'Class Groups',
              }}
            />
            <Stack.Screen
              name="AdminCourses"
              component={AdminCourses}
              options={{
                title: 'Subjects',
              }}
            />
            <Stack.Screen
              name="AdminRoleAssignments"
              component={AdminRoleAssignments}
              options={{
                title: 'Role Assignments',
              }}
            />
            <Stack.Screen
              name="AdminAdministrators"
              component={AdminAdministrators}
              options={{
                title: 'Administrators',
              }}
            />
            <Stack.Screen
              name="AdminStaffs"
              component={AdminStaffs}
              options={{
                title: 'Staff',
              }}
            />
            <Stack.Screen
              name="AdminBilling"
              component={AdminBilling}
              options={{
                title: 'Billing',
              }}
            />

            <Stack.Screen
              name="AdminBillingPaymentDetails"
              component={AdminBillingPaymentDetails}
              options={{
                title: 'Payment Details',
              }}
            />
            <Stack.Screen
              name="AdminManagementDashboard"
              component={AdminManagementDashboard}
              options={{
                title: 'Management Dashboard',
              }}
            />
            <Stack.Screen
              name="AdminAccounts"
              component={AdminAccounts}
              options={{
                title: 'Accounts',
              }}
            />
            <Stack.Screen
              name="AdminPayroll"
              component={AdminPayroll}
              options={{
                title: 'Payroll',
              }}
            />
            <Stack.Screen
              name="AdminClassRoom"
              component={AdminClassRoom}
              options={{ title: 'Classrooms' }}
            />

            <Stack.Screen
              name="AdminClassroomDetails"
              component={AdminClassroomDetails}
              options={{ title: 'Classroom Details' }}
            />

            <Stack.Screen
              name="AdminClassroomCreate"
              component={AdminClassroomCreate}
              options={{ title: 'Create Classroom' }}
            />

            <Stack.Screen
              name="AdminOnlineCoursesStudent"
              component={AdminOnlineCoursesStudent}
              options={{
                title: 'Online Students',
              }}
            />

            <Stack.Screen
              name="AdminOnlineCoursesPurchases"
              component={AdminOnlineCoursesPurchases}
              options={{
                title: 'Online Purchases',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
