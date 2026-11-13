// src/screens/Admin/Billing/AdminBillingPaymentDetails.js

import React, { useCallback, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { api, absoluteUrl, getToken } from '../../../api/client';

import ReactNativeBlobUtil from 'react-native-blob-util';

import styles from './AdminBillingPaymentDetails.styles';

function formatMoney(value) {
  const amount = Number(value || 0);

  return `₹${amount.toFixed(2)}`;
}

function formatMonth(value) {
  if (!value) {
    return '';
  }

  const monthValue = String(value).slice(0, 7);

  const [year, month] = monthValue.split('-').map(Number);

  if (!year || !month) {
    return monthValue;
  }

  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

const PAYMENT_METHOD_OPTIONS = [
  {
    label: 'Cash',
    value: 'cash',
  },
  {
    label: 'Bank',
    value: 'bank',
  },
];

export default function AdminBillingPaymentDetails({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const itemType = route?.params?.itemType || 'bill';

  const selectedItem = route?.params?.item || null;

  const selectedMonth = String(route?.params?.month || '').slice(0, 7);

  const bankPaymentAccounts = Array.isArray(route?.params?.bankPaymentAccounts)
    ? route.params.bankPaymentAccounts
    : [];

  const [loading, setLoading] = useState(itemType === 'missing');

  const [generatingBill, setGeneratingBill] = useState(false);

  const [preview, setPreview] = useState(null);

  const [downloadingBillPdf, setDownloadingBillPdf] = useState(false);

  const [downloadingReceiptPdf, setDownloadingReceiptPdf] = useState(false);

  const [markPaidModalVisible, setMarkPaidModalVisible] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('cash');

  const [selectedBankAccountId, setSelectedBankAccountId] = useState(null);

  const [paymentReference, setPaymentReference] = useState('');

  const [markingPaid, setMarkingPaid] = useState(false);

  const [regeneratingBill, setRegeneratingBill] = useState(false);

  const bankAccountOptions = bankPaymentAccounts.map(item => ({
    value: Number(item?.id),

    label: `${item?.code || ''}${item?.code && item?.name ? ' — ' : ''}${
      item?.name || 'Bank Account'
    }${item?.is_default === true ? ' (default)' : ''}`,
  }));

  const savePdfToLocalDrive = useCallback(
    async ({ url, fileName, headers = {} }) => {
      if (!url) {
        throw new Error('PDF download URL was not returned.');
      }

      let tempPath = null;

      const downloadUrl = /^https?:\/\//i.test(url) ? url : absoluteUrl(url);

      try {
        const response = await ReactNativeBlobUtil.config({
          fileCache: true,
          appendExt: 'pdf',
        }).fetch('GET', downloadUrl, {
          Accept: 'application/pdf',
          ...headers,
        });

        const info = response.info();

        const statusCode = Number(info?.status);

        if (
          !Number.isFinite(statusCode) ||
          statusCode < 200 ||
          statusCode >= 300
        ) {
          throw new Error(
            `PDF download failed with HTTP ${statusCode || 'unknown'}.`,
          );
        }

        tempPath = response.path();

        if (!tempPath) {
          throw new Error('Downloaded PDF file path was not returned.');
        }

        /*
         * Android:
         * Save the file in Downloads/Billing.
         */
        if (Platform.OS === 'android') {
          const savedUri =
            await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
              {
                name: fileName,
                parentFolder: 'Billing',
                mimeType: 'application/pdf',
              },
              'Download',
              tempPath,
            );

          if (!savedUri) {
            throw new Error('Could not save the PDF to Downloads.');
          }

          return {
            savedUri,
            location: 'Downloads/Billing',
          };
        }

        /*
         * iOS:
         * Save inside the app Documents directory.
         */
        const destination = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

        await ReactNativeBlobUtil.fs.cp(tempPath, destination);

        return {
          savedUri: destination,
          location: 'Documents',
        };
      } finally {
        if (tempPath && Platform.OS === 'android') {
          try {
            const exists = await ReactNativeBlobUtil.fs.exists(tempPath);

            if (exists) {
              await ReactNativeBlobUtil.fs.unlink(tempPath);
            }
          } catch (cleanupError) {
            console.log('Temporary PDF cleanup error:', cleanupError);
          }
        }
      }
    },
    [],
  );

  const handleDownloadBillPdf = useCallback(async () => {
    const billId = Number(selectedItem?.id);

    if (!Number.isFinite(billId) || downloadingBillPdf) {
      return;
    }

    try {
      setDownloadingBillPdf(true);

      /*
       * First request a signed bill PDF URL.
       */
      const response = await api(
        `/api/billing/v2/bills/${encodeURIComponent(billId)}/signed-url`,
        {
          method: 'POST',
          body: JSON.stringify({}),
        },
      );

      const signedUrl = String(response?.url || '').trim();

      if (!signedUrl) {
        throw new Error('Bill PDF URL was not returned.');
      }

      const result = await savePdfToLocalDrive({
        url: signedUrl,

        fileName: `Bill-${billId}.pdf`,
      });

      Alert.alert(
        'Download Complete',
        `Bill PDF saved in:\n\n${result.location}\n\nBill-${billId}.pdf`,
      );
    } catch (error) {
      console.log('Download bill PDF error:', error);

      Alert.alert(
        'Download Bill PDF',
        error?.message || 'Could not download the bill PDF.',
      );
    } finally {
      setDownloadingBillPdf(false);
    }
  }, [selectedItem?.id, downloadingBillPdf, savePdfToLocalDrive]);

  const handleOpenMarkPaid = useCallback(() => {
    const defaultBank =
      bankPaymentAccounts.find(item => item?.is_default === true) ||
      bankPaymentAccounts[0] ||
      null;

    setPaymentMethod('cash');

    setSelectedBankAccountId(defaultBank ? Number(defaultBank.id) : null);

    setPaymentReference('');

    setMarkPaidModalVisible(true);
  }, [bankPaymentAccounts]);

  const handleCloseMarkPaid = useCallback(() => {
    if (markingPaid) {
      return;
    }

    setMarkPaidModalVisible(false);
  }, [markingPaid]);

  const handleConfirmMarkPaid = useCallback(async () => {
    const billId = Number(selectedItem?.id);

    if (!Number.isFinite(billId)) {
      Alert.alert('Mark Bill Paid', 'A valid bill ID is required.');

      return;
    }

    if (
      paymentMethod === 'bank' &&
      !Number.isFinite(Number(selectedBankAccountId))
    ) {
      Alert.alert('Mark Bill Paid', 'Select a bank account.');

      return;
    }

    if (markingPaid) {
      return;
    }

    try {
      setMarkingPaid(true);

      const response = await api('/api/billing/v2/payments/mark-paid', {
        method: 'POST',

        body: JSON.stringify({
          bill_ids: [billId],

          payment_method: paymentMethod,

          payment_ref:
            paymentMethod === 'bank'
              ? String(paymentReference || '').trim() || null
              : null,

          bank_account_id:
            paymentMethod === 'bank' ? Number(selectedBankAccountId) : null,
        }),
      });

      if (Number(response?.updated) < 1) {
        throw new Error('The bill was not updated.');
      }

      setMarkPaidModalVisible(false);

      Alert.alert('Payment Recorded', 'The bill has been marked as paid.', [
        {
          text: 'OK',

          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log('Mark bill paid error:', error);

      Alert.alert(
        'Mark Bill Paid',
        error?.message || 'Could not mark the bill as paid.',
      );
    } finally {
      setMarkingPaid(false);
    }
  }, [
    selectedItem?.id,
    paymentMethod,
    paymentReference,
    selectedBankAccountId,
    markingPaid,
    navigation,
  ]);

  const handleRegenerateBill = useCallback(() => {
    const billId = Number(selectedItem?.id);

    if (!Number.isFinite(billId) || regeneratingBill) {
      return;
    }

    Alert.alert(
      'Regenerate Bill',
      'Regenerate this unpaid bill using the current charges and concessions? Its items, total, and PDF will be replaced.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Regenerate',

          onPress: async () => {
            try {
              setRegeneratingBill(true);

              const response = await api(
                `/api/billing/v2/bills/${encodeURIComponent(
                  billId,
                )}/regenerate`,
                {
                  method: 'POST',

                  body: JSON.stringify({}),
                },
              );

              if (response?.ok !== true) {
                throw new Error('The bill could not be regenerated.');
              }

              Alert.alert(
                'Bill Regenerated',
                `Bill regenerated successfully. New amount: ${formatMoney(
                  response?.amount,
                )}`,
                [
                  {
                    text: 'OK',

                    onPress: () => navigation.goBack(),
                  },
                ],
              );
            } catch (error) {
              console.log('Regenerate bill error:', error);

              Alert.alert(
                'Regenerate Bill',
                error?.message || 'Could not regenerate the bill.',
              );
            } finally {
              setRegeneratingBill(false);
            }
          },
        },
      ],
    );
  }, [selectedItem?.id, regeneratingBill, navigation]);

  const handleDownloadReceiptPdf = useCallback(async () => {
    const receiptId = Number(selectedItem?.receipt?.id);

    if (!Number.isFinite(receiptId) || downloadingReceiptPdf) {
      return;
    }

    try {
      setDownloadingReceiptPdf(true);

      const token = await getToken();

      if (!token) {
        throw new Error(
          'Your login session could not be found. Please log in again.',
        );
      }

      const receiptNumber = String(
        selectedItem?.receipt?.receipt_number || receiptId,
      )
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, '-');

      const path = `/api/billing/v2/receipts/${encodeURIComponent(
        receiptId,
      )}/download`;

      const result = await savePdfToLocalDrive({
        url: absoluteUrl(path),

        fileName: `Receipt-${receiptNumber}.pdf`,

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert(
        'Download Complete',
        `Receipt PDF saved in:\n\n${result.location}\n\nReceipt-${receiptNumber}.pdf`,
      );
    } catch (error) {
      console.log('Download receipt PDF error:', error);

      Alert.alert(
        'Download Receipt PDF',
        error?.message || 'Could not download the receipt PDF.',
      );
    } finally {
      setDownloadingReceiptPdf(false);
    }
  }, [
    selectedItem?.receipt?.id,
    selectedItem?.receipt?.receipt_number,
    downloadingReceiptPdf,
    savePdfToLocalDrive,
  ]);

  const handleGenerateIndividualBill = useCallback(async () => {
    const studentId = Number(selectedItem?.student_id);
    const month = selectedMonth;

    if (generatingBill) return;

    if (!Number.isInteger(studentId) || studentId <= 0) {
      Alert.alert('Generate Bill', 'Invalid student ID.');
      return;
    }

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      Alert.alert('Generate Bill', 'Invalid billing month.');
      return;
    }

    if (preview?.can_generate !== true) {
      Alert.alert(
        'Generate Bill',
        preview?.reason || 'This bill cannot be generated.',
      );
      return;
    }

    let createdBillId = null;

    try {
      setGeneratingBill(true);

      // 1. Generate the bill.
      const response = await api(
        `/api/billing/v2/payments/missing-students/${studentId}/generate`,
        {
          method: 'POST',
          body: JSON.stringify({ month }),
        },
      );

      const billId = Number(response?.bill_id);

      if (response?.ok !== true || !Number.isInteger(billId) || billId <= 0) {
        throw new Error('Bill generation failed or bill ID is missing.');
      }

      createdBillId = billId;

      // 2. Fetch latest bills to find the newly generated bill.
      // Search additional pages if the bill is not on page 1.
      let newBill = null;
      let currentPage = 1;
      let lastPage = 1;

      do {
        const paymentsResponse = await api(
          `/api/billing/v2/payments?page=${currentPage}&months%5B%5D=${encodeURIComponent(
            month,
          )}`,
        );

        const paymentRows = Array.isArray(paymentsResponse?.rows)
          ? paymentsResponse.rows
          : [];

        newBill =
          paymentRows.find(item => Number(item.id) === createdBillId) || null;

        lastPage = Math.max(1, Number(paymentsResponse?.last_page) || 1);

        currentPage += 1;
      } while (!newBill && currentPage <= lastPage);

      if (!newBill) {
        Alert.alert(
          'Bill Generated',
          `Bill #${createdBillId} was created successfully, but its updated details could not be found in the payment list. Please refresh Billing.`,
        );
        return;
      }

      // 3. Stay on the SAME Payment Details screen.
      // Change the route from "missing" to "bill".
      navigation.setParams({
        itemType: 'bill',
        item: newBill,
        month,
      });

      // Do not call navigation.goBack().
      // PDF signed URL is requested by the existing
      // Download Bill PDF button when needed.
    } catch (error) {
      console.log('[GENERATE BILL ERROR]', {
        status: error?.status,
        message: error?.message,
        createdBillId,
      });

      Alert.alert(
        createdBillId ? 'Bill Generated' : 'Generate Bill Failed',
        createdBillId
          ? `Bill #${createdBillId} was created, but its details could not be loaded. Please refresh Billing. ${
              error?.message || ''
            }`
          : error?.message || 'Could not generate the bill.',
      );
    } finally {
      setGeneratingBill(false);
    }
  }, [
    selectedItem?.student_id,
    selectedMonth,
    generatingBill,
    preview?.can_generate,
    preview?.reason,
    navigation,
  ]);

  const loadMissingPreview = useCallback(async () => {
    if (itemType !== 'missing') {
      return;
    }

    const studentId = Number(selectedItem?.student_id);

    if (!Number.isFinite(studentId)) {
      Alert.alert('Billing', 'A valid student ID is required.');

      navigation.goBack();

      return;
    }

    try {
      setLoading(true);

      const response = await api(
        `/api/billing/v2/payments/missing-students/${encodeURIComponent(
          studentId,
        )}/preview?month=${encodeURIComponent(selectedMonth)}`,
      );

      setPreview(response || null);
    } catch (error) {
      console.log('Missing bill preview error:', error);

      Alert.alert('Billing', error?.message || 'Could not load bill preview.');
    } finally {
      setLoading(false);
    }
  }, [itemType, selectedItem?.student_id, selectedMonth, navigation]);

  useEffect(() => {
    loadMissingPreview();
  }, [loadMissingPreview]);

  if (loading) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#67D1F0" />

        <Text style={styles.loadingText}>Loading payment details...</Text>
      </View>
    );
  }

  const studentName = selectedItem?.student_name || 'Student';

  const classLabel = selectedItem?.class_label || 'No class';

  const roll = selectedItem?.student_roll || '-';

  if (itemType === 'missing') {
    const items = Array.isArray(preview?.items) ? preview.items : [];

    const canGenerate = preview?.can_generate === true;

    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>{studentName}</Text>

              <Text style={styles.studentMeta}>
                {classLabel} · Roll {roll}
              </Text>
            </View>

            <View style={styles.missingBadge}>
              <Text style={styles.missingBadgeText}>Bill not generated</Text>
            </View>
          </View>

          <Text style={styles.billingMonth}>{formatMonth(selectedMonth)}</Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Applicable charges</Text>

          {items.length === 0 ? (
            <Text style={styles.emptyDescription}>
              No active common or student-specific charges apply to this student
              for the selected month.
            </Text>
          ) : (
            items.map((item, index) => (
              <View key={`${item?.caption}-${index}`} style={styles.chargeRow}>
                <Text style={styles.chargeCaption}>
                  {item?.caption || 'Charge'}
                </Text>

                <Text style={styles.chargeAmount}>
                  {formatMoney(item?.amount)}
                </Text>
              </View>
            ))
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>

            <Text style={styles.totalValue}>
              {formatMoney(preview?.amount)}
            </Text>
          </View>

          {!canGenerate ? (
            <View style={styles.infoBox}>
              <MaterialCommunityIcons
                name="information-outline"
                size={18}
                color="#93C5FD"
              />

              <Text style={styles.infoText}>
                {Number(preview?.amount || 0) === 0
                  ? 'A zero-value bill will not be created.'
                  : preview?.reason ||
                    'This bill cannot currently be generated.'}
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleGenerateIndividualBill}
            disabled={!canGenerate || generatingBill}
            accessibilityRole="button"
            accessibilityLabel="Generate Bill"
            style={({ pressed }) => [
              styles.primaryButton,
              (!canGenerate || generatingBill) && styles.controlDisabled,
              pressed &&
                canGenerate &&
                !generatingBill &&
                styles.controlPressed,
            ]}
          >
            {generatingBill ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 9,
                }}
              >
                <ActivityIndicator size="small" color="#FFFFFF" />

                <Text style={styles.primaryButtonText}>Generating Bill...</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Generate Bill</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  const items = Array.isArray(selectedItem?.items) ? selectedItem.items : [];

  const status = String(selectedItem?.status || '').toLowerCase();

  const isPaid = status === 'paid';

  const hasReceipt = Number.isFinite(Number(selectedItem?.receipt?.id));

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>{studentName}</Text>

              <Text style={styles.studentMeta}>
                {classLabel} · Roll {roll}
              </Text>
            </View>

            <View
              style={[
                styles.billStatusBadge,

                status === 'paid' ? styles.paidBadge : styles.unpaidBadge,
              ]}
            >
              <Text
                style={[
                  styles.billStatusText,

                  status === 'paid' ? styles.paidText : styles.unpaidText,
                ]}
              >
                {status ? status.toUpperCase() : 'UNKNOWN'}
              </Text>
            </View>
          </View>

          <Text style={styles.billingMonth}>
            Bill #{selectedItem?.id} · {formatMonth(selectedItem?.bill_month)}
          </Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Bill details</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Due date</Text>

            <Text style={styles.metaValue}>
              {selectedItem?.due_date || '-'}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Payment reference</Text>

            <Text style={styles.metaValue}>
              {selectedItem?.payment_ref || '-'}
            </Text>
          </View>

          {selectedItem?.paid_at ? (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Paid at</Text>

              <Text style={styles.metaValue}>{selectedItem.paid_at}</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Charges</Text>

          {items.map((item, index) => (
            <View key={`${item?.caption}-${index}`} style={styles.chargeRow}>
              <Text style={styles.chargeCaption}>
                {item?.caption || 'Charge'}
              </Text>

              <Text style={styles.chargeAmount}>
                {formatMoney(item?.amount)}
              </Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>

            <Text style={styles.totalValue}>
              {formatMoney(selectedItem?.amount)}
            </Text>
          </View>
        </View>

        {selectedItem?.receipt ? (
          <View style={styles.detailCard}>
            <Text style={styles.sectionTitle}>Receipt</Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Receipt Number</Text>

              <Text style={styles.metaValue}>
                {selectedItem?.receipt?.receipt_number || '-'}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Amount</Text>

              <Text style={styles.metaValue}>
                {formatMoney(selectedItem?.receipt?.amount)}
              </Text>
            </View>
          </View>
        ) : null}

        {isPaid ? (
          <View style={styles.billActionsCard}>
            <Text style={styles.sectionTitle}>Bill Actions</Text>

            <Pressable
              disabled={downloadingBillPdf}
              onPress={handleDownloadBillPdf}
              style={({ pressed }) => [
                styles.billActionButton,

                downloadingBillPdf && styles.controlDisabled,

                pressed && !downloadingBillPdf && styles.controlPressed,
              ]}
            >
              {downloadingBillPdf ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="file-pdf-box"
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text style={styles.billActionButtonText}>
                    Download Bill PDF
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              disabled={downloadingReceiptPdf || !hasReceipt}
              onPress={handleDownloadReceiptPdf}
              style={({ pressed }) => [
                styles.billActionButton,

                (downloadingReceiptPdf || !hasReceipt) &&
                  styles.controlDisabled,

                pressed &&
                  !downloadingReceiptPdf &&
                  hasReceipt &&
                  styles.controlPressed,
              ]}
            >
              {downloadingReceiptPdf ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="receipt-text-outline"
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text style={styles.billActionButtonText}>
                    Download Receipt PDF
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              disabled
              style={[
                styles.billActionButton,
                styles.regenerateDisabledButton,
                styles.controlDisabled,
              ]}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={19}
                color="#94A3B8"
              />

              <Text style={styles.regenerateDisabledText}>
                Regenerate this bill
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.billActionsCard}>
            <Text style={styles.sectionTitle}>Bill Actions</Text>

            <Pressable
              disabled={downloadingBillPdf}
              onPress={handleDownloadBillPdf}
              style={({ pressed }) => [
                styles.billActionButton,

                downloadingBillPdf && styles.controlDisabled,

                pressed && !downloadingBillPdf && styles.controlPressed,
              ]}
            >
              {downloadingBillPdf ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="file-pdf-box"
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text style={styles.billActionButtonText}>
                    Download Bill PDF
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              disabled={markingPaid}
              onPress={handleOpenMarkPaid}
              style={({ pressed }) => [
                styles.markPaidButton,

                markingPaid && styles.controlDisabled,

                pressed && !markingPaid && styles.controlPressed,
              ]}
            >
              <MaterialCommunityIcons
                name="cash-check"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.markPaidButtonText}>Mark Paid</Text>
            </Pressable>

            <Pressable
              disabled={regeneratingBill}
              onPress={handleRegenerateBill}
              style={({ pressed }) => [
                styles.regenerateButton,

                regeneratingBill && styles.controlDisabled,

                pressed && !regeneratingBill && styles.controlPressed,
              ]}
            >
              {regeneratingBill ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="refresh"
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text style={styles.regenerateButtonText}>
                    Regenerate this bill
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        )}
      </ScrollView>
      <Modal
        visible={markPaidModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseMarkPaid}
      >
        <View style={styles.markPaidBackdrop}>
          <View style={styles.markPaidModal}>
            <View style={styles.markPaidHeader}>
              <Text style={styles.markPaidTitle}>Mark Bill Paid</Text>

              <Pressable
                disabled={markingPaid}
                onPress={handleCloseMarkPaid}
                style={({ pressed }) => [
                  styles.markPaidCloseButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Text style={styles.markPaidDescription}>
              Record payment for 1 bill.
            </Text>

            <Text style={styles.markPaidLabel}>Payment mode</Text>

            <Dropdown
              style={styles.markPaidDropdown}
              containerStyle={styles.markPaidDropdownContainer}
              selectedTextStyle={styles.markPaidSelectedText}
              itemTextStyle={styles.markPaidItemText}
              placeholderStyle={styles.markPaidPlaceholder}
              activeColor="#173B60"
              iconColor="#DCE7F5"
              data={PAYMENT_METHOD_OPTIONS}
              labelField="label"
              valueField="value"
              value={paymentMethod}
              onChange={item => {
                const value = item?.value || 'cash';

                setPaymentMethod(value);

                if (value === 'cash') {
                  setPaymentReference('');
                }
              }}
            />

            {paymentMethod === 'bank' ? (
              <>
                <Text style={styles.markPaidLabel}>Bank account</Text>

                <Dropdown
                  style={styles.markPaidDropdown}
                  containerStyle={styles.markPaidDropdownContainer}
                  selectedTextStyle={styles.markPaidSelectedText}
                  itemTextStyle={styles.markPaidItemText}
                  placeholderStyle={styles.markPaidPlaceholder}
                  activeColor="#173B60"
                  iconColor="#DCE7F5"
                  data={bankAccountOptions}
                  labelField="label"
                  valueField="value"
                  value={selectedBankAccountId}
                  placeholder="Select bank account"
                  onChange={item =>
                    setSelectedBankAccountId(Number(item?.value))
                  }
                />

                <Text style={styles.markPaidHelp}>
                  The selected account receives the payment in Financial
                  Accounting.
                </Text>

                <Text style={styles.markPaidLabel}>
                  Payment reference (optional)
                </Text>

                <TextInput
                  value={paymentReference}
                  onChangeText={setPaymentReference}
                  editable={!markingPaid}
                  placeholder="Cheque no., UTR, statement reference, etc."
                  placeholderTextColor="#718096"
                  style={styles.markPaidInput}
                />
              </>
            ) : null}

            <View style={styles.markPaidActions}>
              <Pressable
                disabled={markingPaid}
                onPress={handleCloseMarkPaid}
                style={({ pressed }) => [
                  styles.markPaidCancelButton,

                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={styles.markPaidCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={
                  markingPaid ||
                  (paymentMethod === 'bank' &&
                    !Number.isFinite(Number(selectedBankAccountId)))
                }
                onPress={handleConfirmMarkPaid}
                style={({ pressed }) => [
                  styles.markPaidConfirmButton,

                  (markingPaid ||
                    (paymentMethod === 'bank' &&
                      !Number.isFinite(Number(selectedBankAccountId)))) &&
                    styles.controlDisabled,

                  pressed && !markingPaid && styles.controlPressed,
                ]}
              >
                {markingPaid ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.markPaidConfirmText}>Mark Paid</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
