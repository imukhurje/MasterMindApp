import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Calendar } from 'react-native-calendars';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './CreateSupplierBillModal.styles';

function getTodayIso() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value) {
  if (!value) {
    return 'Select date';
  }

  const parts = String(value).split('-');

  if (parts.length !== 3) {
    return value;
  }

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function getVendorLabel(item) {
  return (
    item?.name ||
    item?.vendor_name ||
    item?.company_name ||
    item?.display_name ||
    `Vendor #${item?.id}`
  );
}

export default function CreateSupplierBillModal({
  visible,
  vendors = [],
  accounts = [],
  submitting = false,
  onClose,
  onSubmit,
}) {
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  const [billNumber, setBillNumber] = useState('');

  const [amount, setAmount] = useState('');

  const [billDate, setBillDate] = useState(getTodayIso());

  const [dueDate, setDueDate] = useState('');

  const [description, setDescription] = useState('');

  const [selectedExpenseAccountId, setSelectedExpenseAccountId] =
    useState(null);

  const [vendorPickerVisible, setVendorPickerVisible] = useState(false);

  const [expensePickerVisible, setExpensePickerVisible] = useState(false);

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [calendarTarget, setCalendarTarget] = useState(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setSelectedVendorId(null);
    setBillNumber('');
    setAmount('');
    setBillDate(getTodayIso());
    setDueDate('');
    setDescription('');
    setSelectedExpenseAccountId(null);

    setVendorPickerVisible(false);
    setExpensePickerVisible(false);
    setCalendarVisible(false);
    setCalendarTarget(null);
  }, [visible]);

  const selectedVendor = useMemo(
    () =>
      vendors.find(item => Number(item?.id) === Number(selectedVendorId)) ||
      null,
    [vendors, selectedVendorId],
  );

  const expenseAccounts = useMemo(
    () =>
      accounts.filter(item => {
        const category = String(item?.category || '').toLowerCase();

        return (
          category === 'expense' &&
          item?.is_active !== false &&
          item?.allows_posting !== false
        );
      }),
    [accounts],
  );

  const selectedExpenseAccount = useMemo(
    () =>
      expenseAccounts.find(
        item => Number(item?.id) === Number(selectedExpenseAccountId),
      ) || null,
    [expenseAccounts, selectedExpenseAccountId],
  );

  const numericAmount = Number(amount);

  const canSubmit =
    Boolean(selectedVendorId) &&
    Boolean(billNumber.trim()) &&
    Number.isFinite(numericAmount) &&
    numericAmount > 0 &&
    Boolean(billDate) &&
    !submitting;

  const calendarDate =
    calendarTarget === 'due_date' ? dueDate || billDate : billDate;

  function openCalendar(target) {
    setCalendarTarget(target);
    setCalendarVisible(true);
  }

  function handleDayPress(day) {
    const value = day?.dateString;

    if (!value) {
      return;
    }

    if (calendarTarget === 'bill_date') {
      setBillDate(value);

      if (dueDate && dueDate < value) {
        setDueDate('');
      }
    }

    if (calendarTarget === 'due_date') {
      setDueDate(value);
    }

    setCalendarVisible(false);
    setCalendarTarget(null);
  }

  function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    onSubmit?.({
      vendor_id: Number(selectedVendorId),

      amount: numericAmount,

      bill_number: billNumber.trim(),

      bill_date: billDate,

      due_date: dueDate || null,

      description: description.trim() || null,

      expense_account_id: selectedExpenseAccountId
        ? Number(selectedExpenseAccountId)
        : null,
    });
  }

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={submitting ? () => {} : onClose}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>Create supplier bill</Text>

                <Text style={styles.subtitle}>
                  Record the bill before money goes out so the payable stays
                  visible.
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
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>Vendor</Text>

              {vendors.length === 0 ? (
                <>
                  <View style={[styles.selectButton, styles.disabledField]}>
                    <Text style={styles.placeholderText}>
                      No vendors available
                    </Text>
                  </View>

                  <View style={styles.infoBox}>
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={19}
                      color="#7DD3FC"
                    />

                    <Text style={styles.infoText}>
                      A vendor must exist before a supplier bill can be posted.
                    </Text>
                  </View>
                </>
              ) : (
                <Pressable
                  onPress={() => setVendorPickerVisible(true)}
                  style={styles.selectButton}
                >
                  <Text
                    style={
                      selectedVendor
                        ? styles.selectText
                        : styles.placeholderText
                    }
                    numberOfLines={1}
                  >
                    {selectedVendor
                      ? getVendorLabel(selectedVendor)
                      : 'Select vendor'}
                  </Text>

                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={21}
                    color="#A8B6C9"
                  />
                </Pressable>
              )}

              <Text style={styles.label}>Bill number</Text>

              <TextInput
                value={billNumber}
                onChangeText={setBillNumber}
                placeholder="SUP-1001"
                placeholderTextColor="#718096"
                style={styles.input}
              />

              <Text style={styles.label}>Amount</Text>

              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#718096"
                style={styles.input}
              />

              <Text style={styles.label}>Bill date</Text>

              <Pressable
                onPress={() => openCalendar('bill_date')}
                style={styles.dateButton}
              >
                <Text style={styles.dateText}>
                  {formatDisplayDate(billDate)}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={19}
                  color="#DCE7F5"
                />
              </Pressable>

              <Text style={styles.label}>Due date</Text>

              <Pressable
                onPress={() => openCalendar('due_date')}
                style={styles.dateButton}
              >
                <Text
                  style={dueDate ? styles.dateText : styles.placeholderText}
                >
                  {dueDate ? formatDisplayDate(dueDate) : 'Select due date'}
                </Text>

                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={19}
                  color="#DCE7F5"
                />
              </Pressable>

              <Text style={styles.label}>Expense account</Text>

              <Pressable
                onPress={() => setExpensePickerVisible(true)}
                style={styles.selectButton}
              >
                <Text
                  style={
                    selectedExpenseAccount
                      ? styles.selectText
                      : styles.placeholderText
                  }
                  numberOfLines={1}
                >
                  {selectedExpenseAccount
                    ? `${selectedExpenseAccount.code} - ${selectedExpenseAccount.name}`
                    : 'Use default operating expense account'}
                </Text>

                <MaterialCommunityIcons
                  name="chevron-down"
                  size={21}
                  color="#A8B6C9"
                />
              </Pressable>

              <Text style={styles.label}>Description</Text>

              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Stationery purchase"
                placeholderTextColor="#718096"
                multiline
                style={[styles.input, styles.descriptionInput]}
              />

              <View style={styles.actions}>
                <Pressable
                  disabled={submitting}
                  onPress={onClose}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  disabled={!canSubmit}
                  onPress={handleSubmit}
                  style={[
                    styles.submitButton,
                    !canSubmit && styles.submitDisabled,
                  ]}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons
                      name="file-document-plus-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                  )}

                  <Text style={styles.submitText}>
                    {submitting ? 'Posting...' : 'Post supplier bill'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Vendor picker */}
      <Modal
        visible={vendorPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setVendorPickerVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.selectionModal}>
            <View style={styles.selectionHeader}>
              <Text style={styles.selectionTitle}>Select Vendor</Text>

              <Pressable
                onPress={() => setVendorPickerVisible(false)}
                style={styles.smallClose}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ScrollView>
              {vendors.map(item => (
                <Pressable
                  key={String(item.id)}
                  onPress={() => {
                    setSelectedVendorId(item.id);

                    setVendorPickerVisible(false);
                  }}
                  style={styles.selectionItem}
                >
                  <Text style={styles.selectionItemText}>
                    {getVendorLabel(item)}
                  </Text>

                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color="#A8B6C9"
                  />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Expense account picker */}
      <Modal
        visible={expensePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setExpensePickerVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.selectionModal}>
            <View style={styles.selectionHeader}>
              <Text style={styles.selectionTitle}>Expense Account</Text>

              <Pressable
                onPress={() => setExpensePickerVisible(false)}
                style={styles.smallClose}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                setSelectedExpenseAccountId(null);

                setExpensePickerVisible(false);
              }}
              style={styles.selectionItem}
            >
              <Text style={styles.selectionItemText}>
                Use default operating expense account
              </Text>
            </Pressable>

            <ScrollView>
              {expenseAccounts.map(item => (
                <Pressable
                  key={String(item.id)}
                  onPress={() => {
                    setSelectedExpenseAccountId(item.id);

                    setExpensePickerVisible(false);
                  }}
                  style={styles.selectionItem}
                >
                  <Text style={styles.selectionItemText}>
                    {item.code} - {item.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Calendar */}
      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>
                {calendarTarget === 'due_date' ? 'Due Date' : 'Bill Date'}
              </Text>

              <Pressable
                onPress={() => setCalendarVisible(false)}
                style={styles.smallClose}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Calendar
              current={calendarDate}
              minDate={calendarTarget === 'due_date' ? billDate : undefined}
              onDayPress={handleDayPress}
              markedDates={{
                [calendarDate]: {
                  selected: true,
                  selectedColor: '#2563EB',
                },
              }}
              enableSwipeMonths
              theme={{
                calendarBackground: '#0B1A2E',

                textSectionTitleColor: '#A8B6C9',

                selectedDayBackgroundColor: '#2563EB',

                selectedDayTextColor: '#FFFFFF',

                todayTextColor: '#7DD3FC',

                dayTextColor: '#F1F5F9',

                textDisabledColor: '#52647A',

                monthTextColor: '#F1F5F9',

                arrowColor: '#7DD3FC',
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
