import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { api } from '../../api/client';
import RNBlobUtil from 'react-native-blob-util';
import styles, { COLORS } from './BillingDashboardOld.styles';
import QRCode from 'react-native-qrcode-svg';

const { BG, TEXT, MUTED, PRIMARY } = COLORS;

const BillingDashboardOld = () => {
  const [capabilities, setCapabilities] = useState(null);
  const [bills, setBills] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('unpaid'); // 'unpaid' or 'paid'
  const [pdfPath, setPdfPath] = useState(null);
  const [invoiceRemoteUrl, setInvoiceRemoteUrl] = useState(null);
  const errorTimerRef = useRef(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentQr, setPaymentQr] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentRefError, setPaymentRefError] = useState('');
  const paymentErrorTimerRef = useRef(null);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const loadData = useCallback(async (isRefresh = false) => {
    setError('');

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [caps, allBills] = await Promise.all([
        api('/api/billing/v2/capabilities'),
        api('/api/billing/v2/my-bills'),
      ]);

      setCapabilities(caps);
      setBills(Array.isArray(allBills) ? allBills : []);

      // Remove selections that no longer apply after refresh.
      setSelectedIds([]);
    } catch (e) {
      console.log('[BILLING REFRESH ERROR]', {
        status: e?.status,
        message: e?.message,
      });

      setError('Unable to load bills. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    if (refreshing || loading) {
      return;
    }

    await loadData(true);
  }, [loadData, refreshing, loading]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  // Filter bills based on active tab
  const filteredBills = bills.filter(bill =>
    activeTab === 'paid' ? bill.status === 'paid' : bill.status !== 'paid',
  );

  const toggleSelectAll = () => {
    const selectableBills = filteredBills.filter(
      b => b.status !== 'paid' && !b.payment_ref,
    );

    if (
      selectedIds.length === selectableBills.length &&
      selectableBills.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectableBills.map(b => b.id));
    }
  };

  const toggleBill = id => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const showTemporaryError = message => {
    setError(message);

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = setTimeout(() => {
      setError('');
    }, 5000);
  };

  const handlePaySelected = async () => {
    if (selectedIds.length === 0) {
      showTemporaryError('Select at least one bill.');
      return;
    }

    try {
      setError('');
      setPaymentLoading(true);
      setPaymentRefError('');

      /*
       * Step 1:
       * Verify that manual UPI QR payment is enabled.
       */
      const configResponse = await api('/api/billing/v2/payment-config');

      const qrEnabled =
        configResponse?.gateway === 'QRCODE_MANUAL' &&
        configResponse?.qrcode_manual?.enabled === true &&
        configResponse?.qrcode_manual?.configured === true;

      if (!qrEnabled) {
        showTemporaryError('UPI QR payment is not available right now.');
        return;
      }

      /*
       * Step 2:
       * Generate a payment-specific UPI QR.
       */
      const qrResponse = await api('/api/billing/v2/payment-qr', {
        method: 'POST',
        body: JSON.stringify({
          bill_ids: selectedIds,
          coupon_code: couponCode.trim(),
        }),
      });

      if (qrResponse?.ok !== true || !qrResponse?.upi_uri) {
        throw new Error('Could not generate the UPI payment QR.');
      }

      setPaymentConfig(configResponse);
      setPaymentQr(qrResponse);

      setPaymentRef('');

      setShowPaymentModal(true);
    } catch (e) {
      console.log('Payment QR error:', e);

      showTemporaryError(e?.message || 'Failed to generate payment QR.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);

    setPaymentConfig(null);
    setPaymentQr(null);

    setPaymentRef('');
    setPaymentRefError('');
  };

  const handleOpenUpiApp = async () => {
    const upiUri = paymentQr?.upi_uri;

    if (!upiUri) {
      showPaymentRefError('UPI payment link is not available.');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(upiUri);

      if (!supported) {
        showPaymentRefError('No supported UPI app was found on this device.');
        return;
      }

      await Linking.openURL(upiUri);
    } catch (e) {
      console.log('Open UPI app error:', e);

      showPaymentRefError('Could not open a UPI app.');
    }
  };

  const getPaymentQrAmount = () => {
    const amount = Number(paymentQr?.amount || 0);

    return amount / 100;
  };

  const handleSubmitPaymentReference = async () => {
    const utr = paymentRef.trim();

    if (utr && !isValidPaymentReference(utr)) {
      showPaymentRefError('Enter a valid UTR / payment reference.');

      return;
    }

    try {
      setPaymentRefError('');
      setPaymentSubmitting(true);

      const response = await api('/api/billing/v2/checkout-intent', {
        method: 'POST',
        body: JSON.stringify({
          bill_ids: selectedIds,
          payment_reference: utr,
        }),
      });

      if (response?.ok) {
        setBills(prev =>
          prev.map(b =>
            selectedIds.includes(b.id) ? { ...b, payment_ref: utr } : b,
          ),
        );

        closePaymentModal();
        setSelectedIds([]);

        showTemporaryError(
          response?.message ||
            'Payment reference submitted. The school office will verify the payment.',
        );

        loadData();
        return;
      }

      showPaymentRefError(
        response?.message || 'Failed to submit payment reference.',
      );
    } catch (e) {
      showPaymentRefError(e?.message || 'Failed to submit payment reference.');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handlePrintInvoice = async bill => {
    try {
      setError('');
      setPdfLoading(true);

      const response = await api(
        `/api/billing/v2/bills/${bill.id}/signed-url`,
        { method: 'POST' },
      );

      if (!response?.url) {
        setError('Failed to generate invoice URL');
        return;
      }

      // ✅ signed URL store so we can download later to Downloads folder
      setInvoiceRemoteUrl(response.url);

      // ✅ preview cache download (fast + safe)
      const fileName = `invoice_${bill.id}_${Date.now()}.pdf`;
      const cachePath = `${RNBlobUtil.fs.dirs.CacheDir}/${fileName}`;

      const res = await RNBlobUtil.config({
        path: cachePath,
        fileCache: true,
        appendExt: 'pdf',
      }).fetch('GET', response.url, {
        Accept: 'application/pdf',
      });

      const localUri =
        Platform.OS === 'android' ? `file://${res.path()}` : res.path();

      setPdfPath(localUri);
      setShowPdfModal(true);
    } catch (e) {
      setError('Failed to load invoice: ' + (e.message || 'Unknown error'));
    } finally {
      setPdfLoading(false);
    }
  };

  const downloadInvoiceToDownloads = async () => {
    if (!invoiceRemoteUrl) return;

    const fileName = `invoice_${Date.now()}.pdf`;

    try {
      if (Platform.OS === 'android') {
        await RNBlobUtil.config({
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            title: fileName,
            description: 'Invoice PDF',
            mime: 'application/pdf',
            mediaScannable: true,

            // ✅ IMPORTANT: path দেবেন না
            storeInDownloads: true, // ✅ Downloads folder
          },
        }).fetch('GET', invoiceRemoteUrl, {
          Accept: 'application/pdf',
        });

        alert('Saved to Downloads ✅');
        return;
      }

      // iOS: Downloads folder concept নেই; Documents/Share use করুন
    } catch (e) {
      setError('Download failed: ' + (e.message || 'Unknown error'));
    }
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setPdfPath(null);
    setInvoiceRemoteUrl(null);
  };

  const getTotalSelected = () => {
    return filteredBills
      .filter(b => selectedIds.includes(b.id))
      .reduce((sum, b) => sum + b.amount, 0);
  };

  const showPaymentRefError = message => {
    setPaymentRefError(message);

    if (paymentErrorTimerRef.current) {
      clearTimeout(paymentErrorTimerRef.current);
    }

    paymentErrorTimerRef.current = setTimeout(() => {
      setPaymentRefError('');
    }, 5000);
  };

  const isValidPaymentReference = value => {
    const ref = String(value || '').trim();

    // Basic rule:
    // minimum 8 characters
    // only letters, numbers, slash, dash allowed
    const regex = /^[A-Za-z0-9/-]{8,35}$/;

    return regex.test(ref);
  };

  const renderBill = ({ item }) => {
    const selected = selectedIds.includes(item.id);
    const isPaid = item.status === 'paid';

    const hasPaymentRef = !!item.payment_ref;
    const canSelectBill = !isPaid && !hasPaymentRef;

    return (
      <TouchableOpacity
        style={[styles.billCard, selected && styles.billCardSelected]}
        onPress={() => canSelectBill && toggleBill(item.id)}
        activeOpacity={canSelectBill ? 0.85 : 1}
        disabled={!canSelectBill}
      >
        <View style={styles.billHeader}>
          <View style={styles.billHeaderLeft}>
            {!isPaid && (
              <View
                style={[
                  styles.checkbox,
                  selected && styles.checkboxSelected,
                  hasPaymentRef && styles.checkboxDisabled,
                ]}
              >
                {selected && <Text style={styles.checkmark}>✓</Text>}
              </View>
            )}

            <View style={styles.billHeaderText}>
              <Text style={styles.billTitle} numberOfLines={2}>
                {item.student} — {item.caption}
              </Text>

              {(item?.bill_month || item?.due_date) && (
                <Text
                  style={[styles.billDates, isPaid && styles.billDatesPaid]}
                >
                  {item?.bill_month
                    ? `Month ${formatDate(item.bill_month)}`
                    : ''}

                  {item?.bill_month && item?.due_date ? ' · ' : ''}

                  {item?.due_date ? `Due ${formatDate(item.due_date)}` : ''}
                </Text>
              )}

              {!!item?.class_label && (
                <Text style={styles.classLabel}>{item.class_label}</Text>
              )}

              {hasPaymentRef ? (
                <Text
                  style={[
                    styles.paymentRefText,
                    isPaid && styles.paymentRefTextPaid,
                  ]}
                >
                  Payment submitted: {item.payment_ref}
                </Text>
              ) : null}
            </View>
          </View>

          <View
            style={[
              styles.statusPill,
              isPaid ? styles.statusPillPaid : styles.statusPillUnpaid,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isPaid ? styles.statusTextPaid : styles.statusTextUnpaid,
              ]}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {item.items.map((lineItem, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemLabel} numberOfLines={1}>
              {lineItem.caption}
            </Text>

            <View style={styles.amountPill}>
              <Text style={styles.amountText}>
                {formatINR(lineItem.amount)}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>{formatINR(item.amount)}</Text>
        </View>

        <TouchableOpacity
          style={styles.printBtn}
          onPress={() => handlePrintInvoice(item)}
          activeOpacity={0.85}
        >
          <Text style={styles.printText}>Print Invoice</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading bills...</Text>
      </View>
    );
  }

  const selectableBills = filteredBills.filter(
    b => b.status !== 'paid' && !b.payment_ref,
  );

  const allSelected =
    selectedIds.length === selectableBills.length && selectableBills.length > 0;

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bills</Text>
      </View> */}

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unpaid' && styles.tabActive]}
          onPress={() => {
            setActiveTab('unpaid');
            setSelectedIds([]);
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'unpaid' && styles.tabTextActive,
            ]}
          >
            Unpaid ({bills.filter(b => b.status !== 'paid').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'paid' && styles.tabActive]}
          onPress={() => {
            setActiveTab('paid');
            setSelectedIds([]);
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'paid' && styles.tabTextActive,
            ]}
          >
            Paid ({bills.filter(b => b.status === 'paid').length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'unpaid' && (
        <View style={styles.actionSection}>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.selectAllBtn}
              onPress={toggleSelectAll}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  allSelected && styles.checkboxSelected,
                ]}
              >
                {allSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>

              <Text style={styles.selectAllText}>
                {allSelected ? 'Unselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>

            <View style={styles.couponSection}>
              <Text style={styles.couponLabel}>Coupon code (optional)</Text>

              <TextInput
                value={couponCode}
                onChangeText={setCouponCode}
                placeholder="Enter coupon code"
                placeholderTextColor="#8293AA"
                autoCapitalize="characters"
                autoCorrect={false}
                style={styles.couponInput}
              />
            </View>

            {capabilities?.can_pay && (
              <TouchableOpacity
                style={[styles.payBtn, paymentLoading && styles.payBtnDisabled]}
                onPress={handlePaySelected}
                disabled={paymentLoading}
                activeOpacity={0.85}
              >
                {paymentLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.payText}>Pay by UPI QR</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <FlatList
        style={{ flex: 1 }}
        data={filteredBills}
        keyExtractor={item => String(item.id)}
        renderItem={renderBill}
        contentContainerStyle={[
          styles.listContent,
          filteredBills.length === 0 && {
            flexGrow: 1,
            justifyContent: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ffffff']}
            tintColor="#2563EB"
            progressBackgroundColor="#142B49"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {activeTab === 'paid' ? 'No paid bills' : 'No unpaid bills'}
            </Text>

            <Text
              style={{
                color: '#94A3B8',
                fontSize: 12,
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              Pull down to refresh
            </Text>
          </View>
        }
      />

      {selectedIds.length > 0 && activeTab === 'unpaid' && (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>
            Total Amount to Pay ({selectedIds.length}{' '}
            {selectedIds.length === 1 ? 'bill' : 'bills'})
          </Text>
          <Text style={styles.summaryAmount}>
            {formatINR(getTotalSelected())}
          </Text>
        </View>
      )}

      <Modal
        visible={showPdfModal}
        animationType="slide"
        onRequestClose={closePdfModal}
      >
        <SafeAreaView style={styles.pdfModalContainer}>
          <View style={styles.pdfHeader}>
            <Text style={styles.pdfHeaderTitle}>Invoice Preview</Text>

            <TouchableOpacity
              onPress={closePdfModal}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pdfBody}>
            {pdfPath && (
              <Pdf
                key={pdfPath}
                source={{ uri: pdfPath }}
                onError={e => console.log('PDF ERROR:', e)}
                style={styles.pdf}
              />
            )}
          </View>

          <View style={styles.pdfFooter}>
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={downloadInvoiceToDownloads}
            >
              <Text style={styles.downloadText}>⬇ Download Invoice</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="fade"
        onRequestClose={closePaymentModal}
      >
        <KeyboardAvoidingView
          style={styles.paymentOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.paymentModal}>
            {/* Header */}
            <View style={styles.paymentHeader}>
              <View style={styles.paymentHeaderText}>
                <Text style={styles.paymentTitle}>Pay Bills</Text>

                <Text style={styles.paymentSubtitle}>
                  Scan the QR code or continue with your UPI app
                </Text>
              </View>

              <TouchableOpacity
                style={styles.paymentCloseBtn}
                onPress={closePaymentModal}
                activeOpacity={0.8}
              >
                <Text style={styles.paymentCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            {paymentRefError ? (
              <View style={styles.paymentErrorBox}>
                <Text style={styles.paymentErrorText}>{paymentRefError}</Text>
              </View>
            ) : null}

            <ScrollView
              style={styles.paymentScroll}
              contentContainerStyle={styles.paymentBody}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Amount summary */}
              <View style={styles.paymentSummaryCard}>
                <Text style={styles.paymentSummaryLabel}>Amount to Pay</Text>

                <Text style={styles.paymentSummaryAmount}>
                  {formatINR(getPaymentQrAmount())}
                </Text>

                <Text style={styles.paymentSelectedText}>
                  {selectedIds.length}{' '}
                  {selectedIds.length === 1
                    ? 'bill selected'
                    : 'bills selected'}
                </Text>
              </View>

              {/* QR section */}
              <View style={styles.qrSection}>
                <Text style={styles.qrSectionTitle}>Scan to Pay</Text>

                <Text style={styles.qrSectionSubtitle}>
                  Use any UPI app to scan this QR code
                </Text>

                <View style={styles.qrBox}>
                  {!!paymentQr?.upi_uri && (
                    <QRCode
                      value={paymentQr.upi_uri}
                      size={185}
                      backgroundColor="#FFFFFF"
                      color="#000000"
                    />
                  )}
                </View>

                <View style={styles.merchantCard}>
                  <Text style={styles.merchantName}>
                    {paymentQr?.merchant_name || 'Merchant'}
                  </Text>

                  {!!paymentQr?.vpa && (
                    <Text style={styles.merchantVpa}>{paymentQr.vpa}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.upiAppButton}
                  onPress={handleOpenUpiApp}
                  activeOpacity={0.85}
                >
                  <Text style={styles.upiAppButtonText}>Pay with UPI App</Text>
                </TouchableOpacity>
              </View>

              {/* Payment details */}
              <View style={styles.paymentForm}>
                {!!paymentQr?.transaction_reference && (
                  <View style={styles.transactionBox}>
                    <Text style={styles.transactionLabel}>
                      Transaction Reference
                    </Text>

                    <Text
                      style={styles.transactionValue}
                      selectable
                      numberOfLines={2}
                    >
                      {paymentQr.transaction_reference}
                    </Text>
                  </View>
                )}

                <Text style={styles.paymentInputLabel}>
                  UTR / Payment Reference
                  <Text style={styles.optionalText}> (optional)</Text>
                </Text>

                <TextInput
                  value={paymentRef}
                  onChangeText={text => {
                    setPaymentRef(text);

                    if (paymentRefError) {
                      setPaymentRefError('');
                    }
                  }}
                  placeholder="Enter UTR if available"
                  placeholderTextColor="#8495AC"
                  autoCapitalize="characters"
                  style={[
                    styles.paymentInput,
                    paymentRefError ? styles.paymentInputError : null,
                  ]}
                />

                <View style={styles.paymentHintBox}>
                  <Text style={styles.paymentHintText}>
                    Complete the payment first, then submit the payment details
                    for verification.
                  </Text>
                </View>

                <View style={styles.paymentActionRow}>
                  <TouchableOpacity
                    style={styles.paymentCancelBtn}
                    onPress={closePaymentModal}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.paymentCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.paymentSubmitBtn,
                      paymentSubmitting && styles.paymentSubmitBtnDisabled,
                    ]}
                    onPress={handleSubmitPaymentReference}
                    activeOpacity={0.85}
                    disabled={paymentSubmitting}
                  >
                    {paymentSubmitting ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.paymentSubmitText}>
                        Submit Payment
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const formatDate = date => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatINR = amount => `₹${amount.toFixed(2)}`;

export default BillingDashboardOld;
