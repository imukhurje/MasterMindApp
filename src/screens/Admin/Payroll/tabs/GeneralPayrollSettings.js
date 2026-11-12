import React, { useEffect, useMemo, useState } from 'react';

import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DatePickerModal from '../modals/DatePickerModal';

import styles from './GeneralPayrollSettings.styles';

const SALARY_FREQUENCIES = [
  {
    value: 'monthly',
    label: 'Monthly',
  },
];

function normalizeDate(value) {
  if (!value) {
    return '';
  }

  return String(value).slice(0, 10);
}

function formatDisplayDate(value) {
  if (!value) {
    return 'Select date';
  }

  const [year, month, day] = String(value).slice(0, 10).split('-');

  if (!year || !month || !day) {
    return value;
  }

  return `${day}-${month}-${year}`;
}

function formatAccount(item) {
  if (!item) {
    return 'Select account';
  }

  return `${item.code || '-'} — ${item.name || '-'}`;
}

function SelectionModal({
  visible,
  title,
  options = [],
  selectedValue,
  getValue,
  getLabel,
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
      <View style={styles.modalBackdrop}>
        <View style={styles.selectionModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.optionScroll}
            showsVerticalScrollIndicator={false}
          >
            {options.map((item, index) => {
              const value = getValue ? getValue(item) : item?.value;

              const label = getLabel ? getLabel(item) : item?.label;

              const selected = String(value) === String(selectedValue);

              return (
                <Pressable
                  key={String(value ?? index)}
                  onPress={() => onSelect?.(item)}
                  style={[
                    styles.optionRow,

                    selected && styles.optionRowSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,

                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {label}
                  </Text>

                  {selected && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color="#60A5FA"
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

export default function GeneralPayrollSettings({
  general = null,

  accountMapping = null,

  assetAccounts = [],

  paymentAccounts = [],

  savingSchedule = false,

  savingAccountMapping = false,

  onSaveSchedule,

  onSaveAccountMapping,
}) {
  const [salaryFrequency, setSalaryFrequency] = useState('monthly');

  const [payrollStartsOn, setPayrollStartsOn] = useState('');

  const [receivableAccountId, setReceivableAccountId] = useState(null);

  const [bankAccountId, setBankAccountId] = useState(null);

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [frequencyModalVisible, setFrequencyModalVisible] = useState(false);

  const [receivableModalVisible, setReceivableModalVisible] = useState(false);

  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  const normalizedAssetAccounts = useMemo(
    () => (Array.isArray(assetAccounts) ? assetAccounts : []),
    [assetAccounts],
  );

  const normalizedPaymentAccounts = useMemo(
    () => (Array.isArray(paymentAccounts) ? paymentAccounts : []),
    [paymentAccounts],
  );

  useEffect(() => {
    setSalaryFrequency(general?.salary_frequency || 'monthly');

    setPayrollStartsOn(normalizeDate(general?.payroll_starts_on));
  }, [general]);

  useEffect(() => {
    setReceivableAccountId(
      accountMapping?.receivable_account_id
        ? Number(accountMapping.receivable_account_id)
        : null,
    );

    setBankAccountId(
      accountMapping?.bank_account_id
        ? Number(accountMapping.bank_account_id)
        : null,
    );
  }, [accountMapping]);

  const selectedFrequency = useMemo(
    () =>
      SALARY_FREQUENCIES.find(item => item.value === salaryFrequency) ||
      SALARY_FREQUENCIES[0],
    [salaryFrequency],
  );

  const selectedReceivableAccount = useMemo(
    () =>
      normalizedAssetAccounts.find(
        item => Number(item?.id) === Number(receivableAccountId),
      ) || null,
    [normalizedAssetAccounts, receivableAccountId],
  );

  const selectedBankAccount = useMemo(
    () =>
      normalizedPaymentAccounts.find(
        item => Number(item?.id) === Number(bankAccountId),
      ) || null,
    [normalizedPaymentAccounts, bankAccountId],
  );

  const cashAccount = useMemo(() => {
    const mappedCashId = Number(accountMapping?.cash_account_id);

    return (
      normalizedPaymentAccounts.find(
        item => Number(item?.id) === mappedCashId,
      ) ||
      normalizedPaymentAccounts.find(
        item => String(item?.code || '') === '1200',
      ) ||
      null
    );
  }, [normalizedPaymentAccounts, accountMapping]);

  function handleSaveSchedule() {
    if (savingSchedule || !salaryFrequency || !payrollStartsOn) {
      return;
    }

    onSaveSchedule?.({
      salary_frequency: salaryFrequency,

      payroll_starts_on: payrollStartsOn,
    });
  }

  function handleSaveMapping() {
    if (
      savingAccountMapping ||
      !receivableAccountId ||
      !cashAccount?.id ||
      !bankAccountId
    ) {
      return;
    }

    onSaveAccountMapping?.({
      receivable_account_id: Number(receivableAccountId),

      cash_account_id: Number(cashAccount.id),

      bank_account_id: Number(bankAccountId),
    });
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <Text style={styles.sectionDescription}>
          Maintain salary heads and direct staff salary settings. Advance
          deductions are calculated from outstanding staff advances only.
        </Text>

        {/* Payroll schedule */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payroll run schedule</Text>

          <Text style={styles.cardDescription}>
            Payroll begins from this date. Earlier periods are intentionally
            excluded.
          </Text>

          <Text style={styles.label}>Salary frequency</Text>

          <Pressable
            onPress={() => setFrequencyModalVisible(true)}
            style={styles.selectButton}
          >
            <Text style={styles.selectButtonText}>
              {selectedFrequency?.label || 'Select frequency'}
            </Text>

            <MaterialCommunityIcons
              name="chevron-down"
              size={21}
              color="#DCE7F5"
            />
          </Pressable>

          <Text style={styles.label}>Payroll starts from</Text>

          <Pressable
            onPress={() => setCalendarVisible(true)}
            style={styles.selectButton}
          >
            <Text style={styles.selectButtonText}>
              {formatDisplayDate(payrollStartsOn)}
            </Text>

            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={20}
              color="#DCE7F5"
            />
          </Pressable>

          <Pressable
            disabled={savingSchedule || !payrollStartsOn}
            onPress={handleSaveSchedule}
            style={[
              styles.saveButton,

              (savingSchedule || !payrollStartsOn) && styles.disabledButton,
            ]}
          >
            <MaterialCommunityIcons
              name="content-save-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.saveButtonText}>
              {savingSchedule ? 'Saving...' : 'Save payroll schedule'}
            </Text>
          </Pressable>
        </View>

        {/* Advance account mapping */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Advance account mapping</Text>

          <Text style={styles.cardDescription}>
            Debit the receivable account and credit the selected Bank/Cash
            ledger for staff advances.
          </Text>

          <Text style={styles.label}>Staff advance receivable</Text>

          <Pressable
            onPress={() => setReceivableModalVisible(true)}
            style={styles.selectButton}
          >
            <Text numberOfLines={1} style={styles.selectButtonText}>
              {formatAccount(selectedReceivableAccount)}
            </Text>

            <MaterialCommunityIcons
              name="chevron-down"
              size={21}
              color="#DCE7F5"
            />
          </Pressable>

          <Text style={styles.label}>Bank/Cash ledger</Text>

          <Pressable
            onPress={() => setPaymentModalVisible(true)}
            style={styles.selectButton}
          >
            <Text numberOfLines={1} style={styles.selectButtonText}>
              {formatAccount(selectedBankAccount)}
            </Text>

            <MaterialCommunityIcons
              name="chevron-down"
              size={21}
              color="#DCE7F5"
            />
          </Pressable>

          {!!cashAccount && (
            <Text style={styles.helperText}>
              Cash advances use: {formatAccount(cashAccount)}.
            </Text>
          )}

          <Pressable
            disabled={
              savingAccountMapping ||
              !receivableAccountId ||
              !cashAccount?.id ||
              !bankAccountId
            }
            onPress={handleSaveMapping}
            style={[
              styles.saveButton,

              (savingAccountMapping ||
                !receivableAccountId ||
                !cashAccount?.id ||
                !bankAccountId) &&
                styles.disabledButton,
            ]}
          >
            <MaterialCommunityIcons
              name="content-save-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.saveButtonText}>
              {savingAccountMapping ? 'Saving...' : 'Save account mapping'}
            </Text>
          </Pressable>
        </View>
      </View>

      <DatePickerModal
        visible={calendarVisible}
        title="Payroll Start Date"
        subtitle="Select the first payroll date"
        selectedDate={payrollStartsOn}
        onClose={() => setCalendarVisible(false)}
        onDayPress={day => {
          if (day?.dateString) {
            setPayrollStartsOn(day.dateString);
          }

          setCalendarVisible(false);
        }}
      />

      <SelectionModal
        visible={frequencyModalVisible}
        title="Salary Frequency"
        options={SALARY_FREQUENCIES}
        selectedValue={salaryFrequency}
        onClose={() => setFrequencyModalVisible(false)}
        onSelect={item => {
          setSalaryFrequency(item.value);

          setFrequencyModalVisible(false);
        }}
      />

      <SelectionModal
        visible={receivableModalVisible}
        title="Staff Advance Receivable"
        options={normalizedAssetAccounts}
        selectedValue={receivableAccountId}
        getValue={item => item.id}
        getLabel={formatAccount}
        onClose={() => setReceivableModalVisible(false)}
        onSelect={item => {
          setReceivableAccountId(Number(item.id));

          setReceivableModalVisible(false);
        }}
      />

      <SelectionModal
        visible={paymentModalVisible}
        title="Bank/Cash Ledger"
        options={normalizedPaymentAccounts}
        selectedValue={bankAccountId}
        getValue={item => item.id}
        getLabel={formatAccount}
        onClose={() => setPaymentModalVisible(false)}
        onSelect={item => {
          setBankAccountId(Number(item.id));

          setPaymentModalVisible(false);
        }}
      />
    </>
  );
}
