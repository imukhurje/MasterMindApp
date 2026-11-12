import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './RegistrationFormModal.styles';

const CONFIG = {
  counterparty: {
    title: 'Register counterparty',

    subtitle:
      'Create a receivable-side ledger for any customer, account holder, or party that owes the organization money.',

    codeLabel: 'Counterparty code',

    codePlaceholder: 'DB-001',

    nameLabel: 'Counterparty name',

    namePlaceholder: 'Transport Debtors',

    submitText: 'Post counterparty',

    showDescription: true,

    showPhone: false,

    showEmail: false,
  },

  creditor_vendor: {
    title: 'Register creditor or vendor',

    subtitle:
      'Create the supplier record and matching creditor ledger together so purchases and payments stay traceable.',

    codeLabel: 'Vendor or creditor code',

    codePlaceholder: 'CR-001',

    nameLabel: 'Name',

    namePlaceholder: 'Bright Stationers',

    submitText: 'Post creditor and vendor',

    showDescription: false,

    showPhone: true,

    showEmail: true,
  },

  vendor: {
    title: 'Create vendor',

    subtitle:
      'Register the supplier here so later bills can point to the right vendor from one registration area.',

    codeLabel: 'Vendor code',

    codePlaceholder: 'STATIONERY',

    nameLabel: 'Vendor name',

    namePlaceholder: 'Stationery World',

    submitText: 'Post vendor',

    showDescription: false,

    showPhone: true,

    showEmail: true,
  },
};

export default function RegistrationFormModal({
  visible,
  mode,
  submitting = false,
  onClose,
  onSubmit,
}) {
  const config = CONFIG[mode] || CONFIG.counterparty;

  const [code, setCode] = useState('');

  const [name, setName] = useState('');

  const [description, setDescription] = useState('');

  const [phone, setPhone] = useState('');

  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    setCode('');
    setName('');
    setDescription('');
    setPhone('');
    setEmail('');
  }, [visible, mode]);

  function handleSubmit() {
    const cleanName = name.trim();

    if (!cleanName) {
      Alert.alert('Registration', 'Name is required.');

      return;
    }

    if ((mode === 'counterparty' || mode === 'bank') && !code.trim()) {
      Alert.alert(
        'Registration',
        mode === 'bank'
          ? 'Bank ledger code is required.'
          : 'Counterparty code is required.',
      );

      return;
    }

    onSubmit?.({
      code: code.trim(),
      name: cleanName,

      description: description.trim(),

      phone: phone.trim(),

      email: email.trim(),
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        if (!submitting) {
          onClose?.();
        }
      }}
    >
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>{config.title}</Text>

              <Text style={styles.subtitle}>{config.subtitle}</Text>
            </View>

            <Pressable
              disabled={submitting}
              onPress={onClose}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>{config.codeLabel}</Text>

                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder={config.codePlaceholder}
                  placeholderTextColor="#718096"
                  autoCapitalize="characters"
                  style={styles.input}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>{config.nameLabel}</Text>

                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={config.namePlaceholder}
                  placeholderTextColor="#718096"
                  style={styles.input}
                />
              </View>
            </View>

            {config.showDescription && (
              <>
                <Text style={styles.label}>Description</Text>

                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Optional note"
                  placeholderTextColor="#718096"
                  style={styles.input}
                />
              </>
            )}

            {(config.showPhone || config.showEmail) && (
              <View style={[styles.row, styles.contactRow]}>
                {config.showPhone && (
                  <View style={styles.field}>
                    <Text style={styles.label}>Phone</Text>

                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="+1 555 0000"
                      placeholderTextColor="#718096"
                      keyboardType="phone-pad"
                      style={styles.input}
                    />
                  </View>
                )}

                {config.showEmail && (
                  <View style={styles.field}>
                    <Text style={styles.label}>Email</Text>

                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="vendor@example.com"
                      placeholderTextColor="#718096"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.input}
                    />
                  </View>
                )}
              </View>
            )}

            <View style={styles.actions}>
              <Pressable
                disabled={submitting}
                onPress={onClose}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={submitting}
                onPress={handleSubmit}
                style={[
                  styles.submitButton,

                  submitting && styles.submitDisabled,
                ]}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                )}

                <Text style={styles.submitText}>
                  {submitting ? 'Posting...' : config.submitText}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
