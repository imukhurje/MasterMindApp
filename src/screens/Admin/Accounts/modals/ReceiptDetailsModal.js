import React from 'react';

import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './ReceiptDetailsModal.styles';

function formatMoney(value, symbol = '₹') {
  const amount = Number(value) || 0;

  return `${symbol}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function DetailBox({ label, value }) {
  return (
    <View style={styles.detailBox}>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>{value || '--'}</Text>
    </View>
  );
}

export default function ReceiptDetailsModal({
  visible,
  receipt,
  currencySymbol = '₹',
  onClose,
}) {
  if (!receipt) {
    return null;
  }

  const isBank = String(receipt?.payment_method || '').toLowerCase() === 'bank';

  const isReconciled = Boolean(receipt?.reconciled_at);

  const bankStatus = !isBank
    ? 'Not applicable'
    : isReconciled
    ? 'Reconciled'
    : 'Not reconciled';

  const recordedAt = receipt?.created_at?.slice?.(0, 10) || '--';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Receipt details</Text>

              <Text style={styles.subtitle}>
                Receipt {receipt?.receipt_number || `#${receipt?.id}`}
              </Text>
            </View>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={23} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              <DetailBox
                label="Receipt number"
                value={receipt?.receipt_number}
              />

              <DetailBox label="Receipt date" value={receipt?.receipt_date} />

              <DetailBox
                label="Bill reference"
                value={receipt?.source_reference}
              />

              <DetailBox
                label="Amount"
                value={formatMoney(receipt?.amount, currencySymbol)}
              />

              <DetailBox
                label="Payment method"
                value={
                  receipt?.payment_method
                    ? String(receipt.payment_method).charAt(0).toUpperCase() +
                      String(receipt.payment_method).slice(1)
                    : '--'
                }
              />

              <DetailBox
                label="Status"
                value={
                  receipt?.status
                    ? String(receipt.status).charAt(0).toUpperCase() +
                      String(receipt.status).slice(1)
                    : '--'
                }
              />

              <DetailBox label="Reference" value={receipt?.reference || '--'} />

              <DetailBox label="Bank status" value={bankStatus} />

              <DetailBox
                label="Statement reference"
                value={receipt?.bank_statement_reference || '--'}
              />

              <DetailBox
                label="Description"
                value={receipt?.description || '--'}
              />

              <DetailBox
                label="Journal entry ID"
                value={
                  receipt?.journal_entry_id != null
                    ? String(receipt.journal_entry_id)
                    : '--'
                }
              />

              <DetailBox label="Recorded at" value={recordedAt} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
