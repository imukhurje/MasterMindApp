import React, { useCallback, useState } from 'react';

import { SafeAreaView, View } from 'react-native';

import SettingsDropdown from './components/SettingsDropdown';

import GeneralSettings from './components/GeneralSettings';
import DayTemplatesSettings from './components/DayTemplatesSettings';
import RoutineTemplatesSettings from './components/RoutineTemplatesSettings';
import AcademicCalendarSettings from './components/AcademicCalendarSettings';
import EventsCalendarSettings from './components/EventsCalendarSettings';
import ClassRoomsSettings from './components/ClassRoomsSettings';
import DocumentsSettings from './components/DocumentsSettings';

import { styles } from './AdminSettings.styles';

const SETTINGS_OPTIONS = [
  {
    key: 'general',
    label: 'General',
  },
  {
    key: 'day_templates',
    label: 'Day Templates',
  },
  {
    key: 'routine_templates',
    label: 'Routine Templates',
  },
  {
    key: 'academic_calendar',
    label: 'Academic Calendar',
  },
  {
    key: 'events_calendar',
    label: 'Events Calendar',
  },
  {
    key: 'class_rooms',
    label: 'Class Rooms',
  },

  /*
   * Keep Documents as the last Settings option.
   */
  {
    key: 'documents',
    label: 'Documents',
  },
];

export default function AdminSettings() {
  /*
   * General is selected by default.
   */
  const [activeSection, setActiveSection] = useState('general');

  const handleSectionChange = useCallback(sectionKey => {
    setActiveSection(sectionKey);
  }, []);

  function renderActiveContent() {
    switch (activeSection) {
      case 'day_templates':
        return <DayTemplatesSettings />;

      case 'routine_templates':
        return <RoutineTemplatesSettings />;

      case 'academic_calendar':
        return <AcademicCalendarSettings />;

      case 'events_calendar':
        return <EventsCalendarSettings />;

      case 'class_rooms':
        return <ClassRoomsSettings />;

      case 'documents':
        return <DocumentsSettings />;

      case 'general':
      default:
        return <GeneralSettings />;
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.settingsContainer}>
          <SettingsDropdown
            options={SETTINGS_OPTIONS}
            value={activeSection}
            onChange={handleSectionChange}
          />

          <View style={styles.contentContainer}>{renderActiveContent()}</View>
        </View>
      </View>
    </SafeAreaView>
  );
}
