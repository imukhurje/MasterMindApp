import React from 'react';

import { Pressable, Text, useWindowDimensions, View } from 'react-native';

import { COLORS, styles } from './StudentAccessMonitoringSettings.styles';

export default function StudentAccessMonitoringSettings() {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  /*
   * Functionality will be added later.
   */
  function handleCurrentWeekAccessLog() {
    // TODO: Add Current Week Access Log functionality.
  }

  function handleRecentAccessEvents() {
    // TODO: Add Recent Access Events functionality.
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.sectionTitle}>Student Access Monitoring</Text>

          <Text style={styles.description}>
            Review student portal access activity and recent access events.
          </Text>
        </View>

        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />

          <Text style={styles.statusBadgeText}>Monitoring</Text>
        </View>
      </View>

      <View style={[styles.actionsGrid, isMobile && styles.actionsGridMobile]}>
        {/* Current Week Access Log */}

        <Pressable
          onPress={handleCurrentWeekAccessLog}
          style={({ pressed }) => [
            styles.actionCard,

            isMobile && styles.actionCardMobile,

            pressed && styles.actionCardPressed,
          ]}
        >
          <View style={styles.actionTopRow}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>↗</Text>
            </View>

            <View style={styles.arrowBox}>
              <Text style={styles.arrowText}>›</Text>
            </View>
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Current Week Access Log</Text>

            <Text style={styles.actionDescription}>
              Review student access activity recorded during the current week.
            </Text>
          </View>

          <View style={styles.actionFooter}>
            <Text style={styles.actionFooterText}>Open access log</Text>

            <Text style={styles.actionFooterArrow}>→</Text>
          </View>
        </Pressable>

        {/* Recent Access Events */}

        <Pressable
          onPress={handleRecentAccessEvents}
          style={({ pressed }) => [
            styles.actionCard,

            isMobile && styles.actionCardMobile,

            pressed && styles.actionCardPressed,
          ]}
        >
          <View style={styles.actionTopRow}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>◷</Text>
            </View>

            <View style={styles.arrowBox}>
              <Text style={styles.arrowText}>›</Text>
            </View>
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Recent Access Events</Text>

            <Text style={styles.actionDescription}>
              View the latest student login, activity, and access-related
              events.
            </Text>
          </View>

          <View style={styles.actionFooter}>
            <Text style={styles.actionFooterText}>View recent events</Text>

            <Text style={styles.actionFooterArrow}>→</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoIcon}>
          <Text style={styles.infoIconText}>i</Text>
        </View>

        <Text style={styles.infoText}>
          Weekly access records are monitored here. Completed records may also
          be available from Student Access Archives.
        </Text>
      </View>
    </View>
  );
}
