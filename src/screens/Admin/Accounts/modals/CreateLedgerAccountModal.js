import React, { useEffect, useMemo, useState } from 'react';

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

import DatePickerModal from './DatePickerModal';

import { formatDisplayDate, getTodayIso } from '../utils/accountsHelpers';

import styles from './CreateLedgerAccountModal.styles';

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

          <ScrollView keyboardShouldPersistTaps="handled">
            {options.map(item => {
              const active = selectedValue === item.value;

              return (
                <Pressable
                  key={String(item.value)}
                  onPress={() => onSelect(item.value)}
                  style={[
                    styles.selectionOption,

                    active && styles.selectionOptionActive,
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.selectionOptionText,

                        active && styles.selectionOptionTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>

                    {!!item.caption && (
                      <Text style={styles.selectionOptionCaption}>
                        {item.caption}
                      </Text>
                    )}
                  </View>

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
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const OPENING_SIDE_OPTIONS = [
  {
    value: 'debit',
    label: 'Debit',
  },
  {
    value: 'credit',
    label: 'Credit',
  },
];

const BOOLEAN_OPTIONS = [
  {
    value: true,
    label: 'Yes',
  },
  {
    value: false,
    label: 'No',
  },
];

export default function CreateLedgerAccountModal({
  visible,
  accountTypes = [],
  accounts = [],
  submitting = false,
  onClose,
  onSubmit,
}) {
  const [accountTypeId, setAccountTypeId] = useState(null);

  const [parentAccountId, setParentAccountId] = useState(null);

  const [code, setCode] = useState('');

  const [name, setName] = useState('');

  const [description, setDescription] = useState('');

  const [openingBalance, setOpeningBalance] = useState('');

  const [openingBalanceSide, setOpeningBalanceSide] = useState('debit');

  const [openingBalanceDate, setOpeningBalanceDate] = useState(getTodayIso());

  const [allowsPosting, setAllowsPosting] = useState(true);

  const [isActive, setIsActive] = useState(true);

  const [accountTypeVisible, setAccountTypeVisible] = useState(false);

  const [parentVisible, setParentVisible] = useState(false);

  const [openingSideVisible, setOpeningSideVisible] = useState(false);

  const [postingVisible, setPostingVisible] = useState(false);

  const [activeVisible, setActiveVisible] = useState(false);

  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setAccountTypeId(null);
    setParentAccountId(null);

    setCode('');
    setName('');
    setDescription('');

    setOpeningBalance('');
    setOpeningBalanceSide('debit');
    setOpeningBalanceDate(getTodayIso());

    setAllowsPosting(true);
    setIsActive(true);

    setAccountTypeVisible(false);
    setParentVisible(false);
    setOpeningSideVisible(false);
    setPostingVisible(false);
    setActiveVisible(false);
    setCalendarVisible(false);
  }, [visible]);

  const accountTypeOptions = useMemo(() => {
    return (Array.isArray(accountTypes) ? accountTypes : []).map(item => ({
      value: Number(item.id),

      label: item?.code
        ? `${item.code} - ${item.name}`
        : item?.name || 'Account group',

      caption: [item?.category, item?.normal_balance]
        .filter(Boolean)
        .join(' · '),
    }));
  }, [accountTypes]);

  const parentOptions = useMemo(() => {
    const result = [
      {
        value: null,
        label: 'No parent ledger',
        caption: '',
      },
    ];

    const ledgerOptions = (Array.isArray(accounts) ? accounts : [])
      .filter(item => item?.is_active !== false)
      .map(item => ({
        value: Number(item.id),

        label: item?.code
          ? `${item.code} - ${item.name}`
          : item?.name || 'Ledger',

        caption: item?.account_type || '',
      }));

    return [...result, ...ledgerOptions];
  }, [accounts]);

  const selectedAccountType = accountTypeOptions.find(
    item => item.value === accountTypeId,
  );

  const selectedParent = parentOptions.find(
    item => item.value === parentAccountId,
  );

  function clearForm() {
    setAccountTypeId(null);
    setParentAccountId(null);

    setCode('');
    setName('');
    setDescription('');

    setOpeningBalance('');
    setOpeningBalanceSide('debit');

    setOpeningBalanceDate(getTodayIso());

    setAllowsPosting(true);
    setIsActive(true);
  }

  function handleSubmit() {
    const cleanCode = code.trim();

    const cleanName = name.trim();

    if (!accountTypeId || Number(accountTypeId) <= 0) {
      Alert.alert('Ledger Account', 'Please select an account group.');

      return;
    }

    if (!cleanCode) {
      Alert.alert('Ledger Account', 'Ledger code is required.');

      return;
    }

    if (!cleanName) {
      Alert.alert('Ledger Account', 'Ledger name is required.');

      return;
    }

    const openingValue =
      openingBalance.trim() === '' ? null : Number(openingBalance);

    if (openingValue !== null && !Number.isFinite(openingValue)) {
      Alert.alert('Ledger Account', 'Opening balance must be a valid number.');

      return;
    }

    onSubmit?.({
      account_type_id: Number(accountTypeId),

      parent_account_id: parentAccountId ? Number(parentAccountId) : null,

      code: cleanCode,

      name: cleanName,

      description: description.trim() || null,

      opening_balance: openingValue,

      opening_balance_side: openingBalanceSide,

      opening_balance_date: openingBalanceDate,

      allows_posting: Boolean(allowsPosting),

      is_active: Boolean(isActive),
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
                <Text style={styles.title}>Create ledger account</Text>

                <Text style={styles.subtitle}>
                  Every posting should point to a real ledger account. Use a
                  parent ledger only when you want a subgroup.
                </Text>
              </View>

              <Pressable
                disabled={submitting}
                onPress={onClose}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Account group</Text>

                  <Pressable
                    onPress={() => setAccountTypeVisible(true)}
                    style={styles.selectButton}
                  >
                    <Text
                      numberOfLines={1}
                      style={
                        selectedAccountType
                          ? styles.selectText
                          : styles.placeholderText
                      }
                    >
                      {selectedAccountType?.label || 'Select group'}
                    </Text>

                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={20}
                      color="#A8B6C9"
                    />
                  </Pressable>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Parent ledger</Text>

                  <Pressable
                    onPress={() => setParentVisible(true)}
                    style={styles.selectButton}
                  >
                    <Text numberOfLines={1} style={styles.selectText}>
                      {selectedParent?.label || 'No parent ledger'}
                    </Text>

                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={20}
                      color="#A8B6C9"
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Ledger code</Text>

                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    autoCapitalize="characters"
                    placeholder="1300"
                    placeholderTextColor="#718096"
                    style={styles.input}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Ledger name</Text>

                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Library Income"
                    placeholderTextColor="#718096"
                    style={styles.input}
                  />
                </View>
              </View>

              <Text style={styles.label}>Description</Text>

              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Optional note"
                placeholderTextColor="#718096"
                style={styles.input}
              />

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Opening balance</Text>

                  <TextInput
                    value={openingBalance}
                    onChangeText={setOpeningBalance}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#718096"
                    style={styles.input}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Opening side</Text>

                  <Pressable
                    onPress={() => setOpeningSideVisible(true)}
                    style={styles.selectButton}
                  >
                    <Text style={styles.selectText}>
                      {openingBalanceSide === 'credit' ? 'Credit' : 'Debit'}
                    </Text>

                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={20}
                      color="#A8B6C9"
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Opening balance date</Text>

                  <Pressable
                    onPress={() => setCalendarVisible(true)}
                    style={styles.selectButton}
                  >
                    <Text style={styles.selectText}>
                      {formatDisplayDate(openingBalanceDate)}
                    </Text>

                    <MaterialCommunityIcons
                      name="calendar-month-outline"
                      size={19}
                      color="#A8B6C9"
                    />
                  </Pressable>
                </View>

                <View style={styles.field}>
                  <Text style={styles.helpText}>
                    Use this only on creation. Later balance corrections should
                    go through a journal entry.
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Allow direct posting</Text>

                  <Pressable
                    onPress={() => setPostingVisible(true)}
                    style={styles.selectButton}
                  >
                    <Text style={styles.selectText}>
                      {allowsPosting ? 'Yes' : 'No'}
                    </Text>

                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={20}
                      color="#A8B6C9"
                    />
                  </Pressable>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Active</Text>

                  <Pressable
                    onPress={() => setActiveVisible(true)}
                    style={styles.selectButton}
                  >
                    <Text style={styles.selectText}>
                      {isActive ? 'Yes' : 'No'}
                    </Text>

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
                  disabled={submitting}
                  onPress={clearForm}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Clear</Text>
                </Pressable>

                <Pressable
                  disabled={submitting}
                  onPress={onClose}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
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
                      name="book-plus-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                  )}

                  <Text style={styles.submitText}>
                    {submitting ? 'Posting...' : 'Post ledger account'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <SelectionModal
        visible={accountTypeVisible}
        title="Account Group"
        options={accountTypeOptions}
        selectedValue={accountTypeId}
        onClose={() => setAccountTypeVisible(false)}
        onSelect={value => {
          setAccountTypeId(value);

          setAccountTypeVisible(false);
        }}
      />

      <SelectionModal
        visible={parentVisible}
        title="Parent Ledger"
        options={parentOptions}
        selectedValue={parentAccountId}
        onClose={() => setParentVisible(false)}
        onSelect={value => {
          setParentAccountId(value);

          setParentVisible(false);
        }}
      />

      <SelectionModal
        visible={openingSideVisible}
        title="Opening Side"
        options={OPENING_SIDE_OPTIONS}
        selectedValue={openingBalanceSide}
        onClose={() => setOpeningSideVisible(false)}
        onSelect={value => {
          setOpeningBalanceSide(value);

          setOpeningSideVisible(false);
        }}
      />

      <SelectionModal
        visible={postingVisible}
        title="Allow Direct Posting"
        options={BOOLEAN_OPTIONS}
        selectedValue={allowsPosting}
        onClose={() => setPostingVisible(false)}
        onSelect={value => {
          setAllowsPosting(value);

          setPostingVisible(false);
        }}
      />

      <SelectionModal
        visible={activeVisible}
        title="Active"
        options={BOOLEAN_OPTIONS}
        selectedValue={isActive}
        onClose={() => setActiveVisible(false)}
        onSelect={value => {
          setIsActive(value);

          setActiveVisible(false);
        }}
      />

      <DatePickerModal
        visible={calendarVisible}
        title="Opening Balance Date"
        selectedDate={openingBalanceDate}
        onClose={() => setCalendarVisible(false)}
        onDayPress={day => {
          setOpeningBalanceDate(day.dateString);

          setCalendarVisible(false);
        }}
      />
    </>
  );
}
