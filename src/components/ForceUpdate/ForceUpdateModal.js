import React from 'react';

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './ForceUpdateModal.styles';

export default function ForceUpdateModal({
  visible,
  installedVersion,
  latestVersion,
  updating,
  onUpdatePress,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.iconWrap}>
            <MaterialCommunityIcons
              name="rocket-launch-outline"
              size={30}
              color="#67D1F0"
            />
          </View>

          <Text style={styles.title}>New Update Available</Text>

          <Text style={styles.subtitle}>
            Update the app to continue enjoying the latest features and
            improvements.
          </Text>

          <View style={styles.versionCard}>
            <View style={styles.versionBox}>
              <MaterialCommunityIcons
                name="cellphone"
                size={24}
                color="#A8B6C9"
                style={styles.versionIcon}
              />

              <Text style={styles.versionLabel}>Installed</Text>

              <Text style={styles.versionValue}>
                {installedVersion || '--'}
              </Text>
            </View>

            <View style={styles.arrowArea}>
              <MaterialCommunityIcons
                name="arrow-right"
                size={25}
                color="#A8B6C9"
              />
            </View>

            <View style={[styles.versionBox, styles.latestBox]}>
              <MaterialCommunityIcons
                name="cellphone-arrow-down"
                size={24}
                color="#67D1F0"
                style={styles.versionIcon}
              />

              <Text style={styles.versionLabel}>Latest</Text>

              <Text style={styles.versionValue}>{latestVersion || '--'}</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.updateButton}
            onPress={onUpdatePress}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="download"
                  size={20}
                  color="#FFFFFF"
                />

                <Text style={styles.updateButtonText}>Update Now</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
