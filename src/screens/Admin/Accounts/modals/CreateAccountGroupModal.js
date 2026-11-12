import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './CreateAccountGroupModal.styles';

const CATEGORY_OPTIONS = [
  {
    value: 'asset',
    label: 'Asset',
  },
  {
    value: 'liability',
    label: 'Liability',
  },
  {
    value: 'income',
    label: 'Income',
  },
  {
    value: 'expense',
    label: 'Expense',
  },
  {
    value: 'equity',
    label: 'Equity',
  },
];

const NORMAL_BALANCE_OPTIONS = [
  {
    value: 'debit',
    label: 'Debit',
  },
  {
    value: 'credit',
    label: 'Credit',
  },
];

function SelectionModal({
  visible,
  title,
  options = [],
  selectedValue,
  onSelect,
  onClose,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.selectionBackdrop}>
        <View style={styles.selectionModal}>
          <View style={styles.selectionHeader}>
            <Text style={styles.selectionTitle}>{title}</Text>

            <Pressable onPress={onClose} style={styles.selectionClose}>
              <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {options.map(item => {
            const active = selectedValue === item.value;

            return (
              <Pressable
                key={item.value}
                onPress={() => onSelect(item.value)}
                style={[
                  styles.selectionOption,

                  active && styles.selectionOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.selectionOptionText,

                    active && styles.selectionOptionTextActive,
                  ]}
                >
                  {item.label}
                </Text>

                {active && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color="#7DD3FC"
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

export default function CreateAccountGroupModal({
  visible,
  submitting = false,
  onClose,
  onSubmit,
}) {
  const [code, setCode] = useState('');

  const [name, setName] = useState('');

  const [category, setCategory] = useState('asset');

  const [normalBalance, setNormalBalance] = useState('debit');

  const [categoryVisible, setCategoryVisible] = useState(false);

  const [normalBalanceVisible, setNormalBalanceVisible] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setCode('');
    setName('');
    setCategory('asset');
    setNormalBalance('debit');

    setCategoryVisible(false);
    setNormalBalanceVisible(false);
  }, [visible]);

  const categoryLabel =
    CATEGORY_OPTIONS.find(item => item.value === category)?.label || 'Asset';

  const normalBalanceLabel =
    NORMAL_BALANCE_OPTIONS.find(item => item.value === normalBalance)?.label ||
    'Debit';

  function handleSubmit() {
    const cleanCode = code.trim();

    const cleanName = name.trim();

    if (!cleanCode) {
      Alert.alert('Account Group', 'Group code is required.');

      return;
    }

    if (!cleanName) {
      Alert.alert('Account Group', 'Group name is required.');

      return;
    }

    onSubmit?.({
      code: cleanCode.toUpperCase(),
      name: cleanName,
      category,
      normal_balance: normalBalance,
    });
  }

  return (
    <>
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
                <Text style={styles.title}>Create account group</Text>

                <Text style={styles.subtitle}>
                  Use groups to separate assets, liabilities, income, expenses,
                  debtors, creditors, and banks.
                </Text>
              </View>

              <Pressable
                onPress={onClose}
                disabled={submitting}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <View style={styles.content}>
              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Group code</Text>

                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    autoCapitalize="characters"
                    placeholder="DEBTORS"
                    placeholderTextColor="#718096"
                    style={styles.input}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Group name</Text>

                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Debtors"
                    placeholderTextColor="#718096"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Category</Text>

                  <Pressable
                    onPress={() => setCategoryVisible(true)}
                    style={styles.selectButton}
                  >
                    <Text style={styles.selectText}>{categoryLabel}</Text>

                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={20}
                      color="#A8B6C9"
                    />
                  </Pressable>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Normal balance</Text>

                  <Pressable
                    onPress={() => setNormalBalanceVisible(true)}
                    style={styles.selectButton}
                  >
                    <Text style={styles.selectText}>{normalBalanceLabel}</Text>

                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={20}
                      color="#A8B6C9"
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable
                  onPress={onClose}
                  disabled={submitting}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={handleSubmit}
                  disabled={submitting}
                  style={[
                    styles.submitButton,

                    submitting && styles.submitDisabled,
                  ]}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons
                      name="plus-circle-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                  )}

                  <Text style={styles.submitText}>
                    {submitting ? 'Posting...' : 'Post account group'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <SelectionModal
        visible={categoryVisible}
        title="Category"
        options={CATEGORY_OPTIONS}
        selectedValue={category}
        onClose={() => setCategoryVisible(false)}
        onSelect={value => {
          setCategory(value);
          setCategoryVisible(false);
        }}
      />

      <SelectionModal
        visible={normalBalanceVisible}
        title="Normal balance"
        options={NORMAL_BALANCE_OPTIONS}
        selectedValue={normalBalance}
        onClose={() => setNormalBalanceVisible(false)}
        onSelect={value => {
          setNormalBalance(value);
          setNormalBalanceVisible(false);
        }}
      />
    </>
  );
}
