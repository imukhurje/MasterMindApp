import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Alert,
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
import { api, getToken, getBase } from '../../api/client';
import RNBlobUtil from 'react-native-blob-util';
import styles, { COLORS } from './BillingDashboard.styles';
import QRCode from 'react-native-qrcode-svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Config from 'react-native-config';
import RazorpayCheckoutWebView from './RazorpayCheckoutWebView';

const { BG, TEXT, MUTED, PRIMARY } = COLORS;
const PARENT_FOLDER =
  String(Config.PARENT_FOLDER || 'Sciencegate')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '_') || 'Sciencegate';

const BillingDashboard = () => {
  const [capabilities, setCapabilities] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [reconciling, setReconciling] = useState(false);
  const reconciliationInProgressRef = useRef(false);
  const [bills, setBills] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [paymentBillIds, setPaymentBillIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [activeTab, setActiveTab] = useState('unpaid'); // 'unpaid' or 'paid'
  const [pdfPath, setPdfPath] = useState(null);
  const [invoiceRemoteUrl, setInvoiceRemoteUrl] = useState(null);
  const errorTimerRef = useRef(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentQr, setPaymentQr] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentRefError, setPaymentRefError] = useState('');
  const paymentErrorTimerRef = useRef(null);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [razorpayVisible, setRazorpayVisible] = useState(false);
  const [razorpayChecking, setRazorpayChecking] = useState(false);

  const razorpayPollRef = useRef(null);
  const razorpayCheckingRef = useRef(false);

  const loadData = useCallback(async (isRefresh = false) => {
    setError('');

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Initial 4 GET API calls
      const [
        meResponse,
        capabilitiesResponse,
        paymentConfigResponse,
        billsResponse,
      ] = await Promise.all([
        api('/api/me'),
        api('/api/billing/v2/capabilities'),
        api('/api/billing/v2/payment-config'),
        api('/api/billing/v2/my-bills'),
      ]);

      setCurrentUser(meResponse);
      setCapabilities(capabilitiesResponse);
      setPaymentConfig(paymentConfigResponse);

      const billRows = Array.isArray(billsResponse) ? billsResponse : [];

      setBills(billRows);

      // Clear old checkbox selections on refresh
      setSelectedIds([]);

      console.log('[MY BILLS INITIAL API]', {
        role: meResponse?.role,
        canPay: capabilitiesResponse?.can_pay,
        gateway: paymentConfigResponse?.gateway,
        totalBills: billRows.length,
      });

      // Reconcile existing pending gateway orders.
      const pendingOrderIds = [
        ...new Set(
          billRows
            .filter(
              bill =>
                String(bill?.status).toLowerCase() === 'gateway_pending' &&
                Number.isInteger(Number(bill?.gateway_order_id)) &&
                Number(bill.gateway_order_id) > 0,
            )
            .map(bill => Number(bill.gateway_order_id)),
        ),
      ];

      if (pendingOrderIds.length > 0 && !reconciliationInProgressRef.current) {
        reconciliationInProgressRef.current = true;
        setReconciling(true);

        try {
          const results = await Promise.allSettled(
            pendingOrderIds.map(async orderId => {
              const response = await api(
                `/api/billing/v2/gateway-orders/${orderId}/reconcile`,
                {
                  method: 'POST',
                  body: JSON.stringify({}),
                },
              );

              console.log('[GATEWAY RECONCILE]', {
                orderId,
                response,
              });

              return { orderId, response };
            }),
          );

          results.forEach((result, index) => {
            if (result.status === 'rejected') {
              console.log('[GATEWAY RECONCILE ERROR]', {
                orderId: pendingOrderIds[index],
                message: result.reason?.message,
                status: result.reason?.status,
              });
            }
          });
        } finally {
          reconciliationInProgressRef.current = false;
          setReconciling(false);
        }
      }
    } catch (error) {
      console.log('[BILLING INITIAL LOAD ERROR]', {
        status: error?.status,
        message: error?.message,
      });

      setError(error?.message || 'Unable to load bills. Please try again.');
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
      if (razorpayPollRef.current) {
        clearTimeout(razorpayPollRef.current);
      }

      razorpayCheckingRef.current = false;
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

  const handlePaySelected = async (billIds = selectedIds) => {
    const ids = [
      ...new Set(
        (Array.isArray(billIds) ? billIds : [])
          .map(Number)
          .filter(id => Number.isInteger(id) && id > 0),
      ),
    ];

    if (paymentLoading || paymentSubmitting) return;

    if (ids.length === 0) {
      showTemporaryError('Select at least one bill.');
      return;
    }

    // Only allow payment for currently available unpaid bills.
    const payableIds = new Set(
      bills
        .filter(bill => bill.status !== 'paid' && !bill.payment_ref)
        .map(bill => Number(bill.id)),
    );

    if (!ids.every(id => payableIds.has(id))) {
      Alert.alert(
        'Payment Unavailable',
        'One or more selected bills cannot be paid. Refresh the bills and try again.',
      );
      return;
    }

    try {
      setError('');
      setPaymentLoading(true);
      setPaymentRefError('');

      const configResponse = await api('/api/billing/v2/payment-config');

      if (configResponse?.gateway === 'RAZORPAY') {
        if (
          configResponse?.razorpay?.enabled !== true ||
          configResponse?.razorpay?.configured !== true
        ) {
          throw new Error('Razorpay is not configured.');
        }

        const order = await api('/api/billing/v2/checkout-intent', {
          method: 'POST',
          body: JSON.stringify({
            bill_ids: ids,
            coupon_code: couponCode.trim(),
          }),
        });

        await openRazorpayOrder(order);
        return;
      }

      const qrEnabled =
        configResponse?.gateway === 'QRCODE_MANUAL' &&
        configResponse?.qrcode_manual?.enabled === true &&
        configResponse?.qrcode_manual?.configured === true;

      if (!qrEnabled) {
        Alert.alert(
          'Payment Unavailable',
          'UPI QR payment is not available right now.',
        );
        return;
      }

      const qrResponse = await api('/api/billing/v2/payment-qr', {
        method: 'POST',
        body: JSON.stringify({
          bill_ids: ids,
          coupon_code: couponCode.trim(),
        }),
      });

      if (qrResponse?.ok !== true || !qrResponse?.upi_uri) {
        throw new Error('Could not generate the UPI payment QR.');
      }

      // Preserve exactly the IDs used in the QR request.
      setPaymentBillIds(ids);

      setPaymentConfig(configResponse);
      setPaymentQr(qrResponse);
      setPaymentRef('');
      setShowPaymentModal(true);
    } catch (error) {
      console.log('[CONTINUE PAYMENT ERROR]', {
        billIds: ids,
        status: error?.status,
        message: error?.message,
      });

      Alert.alert(
        'Payment Failed',
        error?.message || 'Could not start payment.',
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleContinuePayment = async bill => {
    if (paymentLoading || paymentSubmitting) return;

    const billId = Number(bill?.id);

    if (!Number.isSafeInteger(billId) || billId <= 0) {
      Alert.alert('Payment', 'Invalid bill ID.');
      return;
    }

    if (bill.status === 'paid') {
      Alert.alert('Payment', 'This bill is already paid.');
      return;
    }

    if (bill.payment_ref) {
      Alert.alert('Payment Pending', 'A payment has already been submitted.');
      return;
    }

    if (isRazorpayEnabled) {
      const gatewayOrderId = Number(bill.gateway_order_id);

      if (
        bill.status === 'gateway_pending' &&
        Number.isSafeInteger(gatewayOrderId) &&
        gatewayOrderId > 0
      ) {
        try {
          setPaymentLoading(true);

          // Same flow as the Web App
          const status = await checkRazorpayStatus(gatewayOrderId);

          if (status !== 'created') {
            await loadData(true);

            Alert.alert(
              'Payment Status',
              status === 'paid'
                ? 'Payment has been confirmed.'
                : ['review', 'refund_review', 'test_retired'].includes(status)
                ? 'Payment requires review. Contact the school office.'
                : 'Payment is pending or unavailable. Refresh before retrying.',
            );
            return;
          }

          const order = await api(
            `/api/billing/v2/gateway-orders/${gatewayOrderId}/resume`,
          );

          await openRazorpayOrder(order);
        } catch (error) {
          Alert.alert(
            'Payment Failed',
            error?.message || 'Unable to resume payment.',
          );
        } finally {
          setPaymentLoading(false);
        }

        return;
      }
    }

    handlePaySelected([billId]);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);

    setPaymentConfig(null);
    setPaymentQr(null);

    setPaymentRef('');
    setPaymentRefError('');
    setPaymentBillIds([]);
  };

  const checkRazorpayStatus = async orderId => {
    const response = await api(
      `/api/billing/v2/gateway-orders/${orderId}/reconcile`,
      {
        method: 'POST',
        body: JSON.stringify({}),
      },
    );

    return String(response?.status || '').toLowerCase();
  };

  const stopRazorpayPolling = () => {
    if (razorpayPollRef.current) {
      clearTimeout(razorpayPollRef.current);
      razorpayPollRef.current = null;
    }

    razorpayCheckingRef.current = false;
    setRazorpayChecking(false);
  };

  const closeRazorpayAndRefresh = async () => {
    const orderId = Number(razorpayOrder?.payment_order_id);

    // Stop any previous polling
    stopRazorpayPolling();

    // Close checkout immediately
    setRazorpayVisible(false);
    setRazorpayOrder(null);

    try {
      // Check payment status once, even after dismissal
      if (Number.isSafeInteger(orderId) && orderId > 0) {
        await checkRazorpayStatus(orderId);
      }
    } catch (error) {
      console.log('[RAZORPAY EXIT RECONCILE ERROR]', error?.message);
    } finally {
      // Refresh list without showing the full-page loader
      try {
        const response = await api('/api/billing/v2/my-bills');

        if (Array.isArray(response)) {
          setBills(response);
        }

        setSelectedIds([]);
      } catch (error) {
        console.log('[RAZORPAY EXIT REFRESH ERROR]', error?.message);
      }
    }
  };

  const verifyRazorpayPayment = async orderId => {
    if (razorpayCheckingRef.current) return;

    const paymentOrderId = Number(orderId);

    if (!Number.isSafeInteger(paymentOrderId) || paymentOrderId <= 0) {
      Alert.alert('Payment', 'Invalid payment order.');
      return;
    }

    razorpayCheckingRef.current = true;
    setRazorpayChecking(true);

    let attempts = 0;

    const check = async () => {
      if (!razorpayCheckingRef.current) return;

      attempts += 1;

      try {
        const status = await checkRazorpayStatus(paymentOrderId);

        console.log('[RAZORPAY VERIFY]', {
          paymentOrderId,
          status,
          attempts,
        });

        if (status === 'paid') {
          stopRazorpayPolling();

          setRazorpayVisible(false);
          setRazorpayOrder(null);

          await loadData(true);

          Alert.alert('Payment Successful', 'Your payment has been confirmed.');

          return;
        }

        if (['review', 'refund_review', 'test_retired'].includes(status)) {
          stopRazorpayPolling();

          setRazorpayVisible(false);
          setRazorpayOrder(null);

          await loadData(true);

          Alert.alert(
            'Payment Under Review',
            'Please contact the school office for confirmation.',
          );

          return;
        }
      } catch (error) {
        console.log('[RAZORPAY VERIFY ERROR]', error?.message);
      }

      if (!razorpayCheckingRef.current) return;

      if (attempts >= 24) {
        stopRazorpayPolling();

        await loadData(true);

        Alert.alert(
          'Payment Pending',
          'Payment has not yet been confirmed. Refresh your bills before attempting another payment.',
        );

        return;
      }

      razorpayPollRef.current = setTimeout(check, 5000);
    };

    await check();
  };

  const openRazorpayOrder = async order => {
    if (
      order?.ok === false ||
      order?.gateway !== 'RAZORPAY' ||
      !order?.order_id ||
      !order?.key_id ||
      !Number.isSafeInteger(Number(order?.payment_order_id)) ||
      Number(order?.payment_order_id) <= 0 ||
      !Number.isSafeInteger(Number(order?.amount)) ||
      Number(order?.amount) <= 0 ||
      order?.currency !== 'INR'
    ) {
      throw new Error('Invalid Razorpay checkout details.');
    }

    setRazorpayOrder(order);
    setRazorpayVisible(true);
  };

  const handleRazorpayEvent = async eventType => {
    console.log('[RAZORPAY WEBVIEW EVENT]', eventType);

    if (eventType === 'payment_callback') {
      const orderId = Number(razorpayOrder?.payment_order_id);

      if (!Number.isSafeInteger(orderId) || orderId <= 0) {
        await closeRazorpayAndRefresh();
        return;
      }

      setRazorpayVisible(false);

      // Payment callback is not proof of successful payment.
      // Wait for backend confirmation.
      await verifyRazorpayPayment(orderId);
      return;
    }

    if (eventType === 'dismissed') {
      console.log('[RAZORPAY USER EXIT]');

      await closeRazorpayAndRefresh();
      return;
    }

    if (eventType === 'failed') {
      await closeRazorpayAndRefresh();

      Alert.alert(
        'Payment Not Completed',
        'The payment was not confirmed. Please check your bill status before trying again.',
      );
      return;
    }

    if (eventType === 'load_error') {
      await closeRazorpayAndRefresh();

      Alert.alert(
        'Checkout Error',
        'Unable to load Razorpay Checkout. Please try again.',
      );
    }
  };

  const handleCloseRazorpay = async () => {
    await closeRazorpayAndRefresh();
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
          bill_ids: paymentBillIds,
          payment_reference: utr,
        }),
      });

      if (response?.ok) {
        setBills(prev =>
          prev.map(b =>
            paymentBillIds.includes(Number(b.id))
              ? { ...b, payment_ref: utr }
              : b,
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

  const handleDownloadBillPdf = async bill => {
    const billId = Number(bill?.id);

    if (!Number.isInteger(billId) || billId <= 0) {
      Alert.alert('Download Bill', 'Invalid bill ID.');
      return;
    }

    if (downloadingFile !== null) {
      return;
    }

    let tempPath = null;

    try {
      setDownloadingFile({
        billId,
        type: 'bill',
      });

      // Step 1: Get signed PDF URL
      const response = await api(`/api/billing/v2/bills/${billId}/signed-url`, {
        method: 'POST',
      });

      if (!response?.url) {
        throw new Error('Bill PDF URL was not returned.');
      }

      // Step 2: Download PDF to temporary storage
      const fileName = `Bill_${billId}.pdf`;

      tempPath =
        `${RNBlobUtil.fs.dirs.CacheDir}/` + `bill_${billId}_${Date.now()}.pdf`;

      const result = await RNBlobUtil.config({
        path: tempPath,
        fileCache: true,
      }).fetch('GET', response.url, {
        Accept: 'application/pdf',
      });

      const status = Number(result.info()?.status);

      if (status < 200 || status >= 300) {
        throw new Error(`PDF download failed. HTTP ${status}`);
      }

      // Step 3: Save file
      if (Platform.OS === 'android') {
        const savedUri = await RNBlobUtil.MediaCollection.copyToMediaStore(
          {
            name: fileName,
            parentFolder: PARENT_FOLDER,
            mimeType: 'application/pdf',
          },
          'Download',
          result.path(),
        );

        console.log('[BILL PDF SAVED]', {
          savedUri,
          parentFolder: PARENT_FOLDER,
        });

        Alert.alert(
          'Download Complete',
          `${fileName} saved to Downloads/${PARENT_FOLDER}.`,
        );
      } else {
        const destination = `${RNBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

        await RNBlobUtil.fs.cp(tempPath, destination);

        Alert.alert(
          'Download Complete',
          'Bill PDF saved to the app documents folder.',
        );
      }
    } catch (error) {
      console.log('[BILL PDF DOWNLOAD ERROR]', {
        billId,
        message: error?.message,
        status: error?.status,
      });

      Alert.alert(
        'Download Failed',
        error?.message || 'Unable to download bill PDF.',
      );
    } finally {
      if (tempPath) {
        try {
          const exists = await RNBlobUtil.fs.exists(tempPath);

          if (exists) {
            await RNBlobUtil.fs.unlink(tempPath);
          }
        } catch (error) {
          console.log('[PDF CLEANUP ERROR]', error);
        }
      }

      setDownloadingFile(null);
    }
  };

  const downloadBillingFile = async ({ endpoint, fileName, mimeType }) => {
    const token = await getToken();

    const baseUrl = String(getBase() || '').replace(/\/+$/, '');
    const url = `${baseUrl}${endpoint}`;

    const tempPath = `${RNBlobUtil.fs.dirs.CacheDir}/${Date.now()}_${fileName}`;

    try {
      console.log('[BILLING FILE DOWNLOAD START]', {
        endpoint,
        url,
        fileName,
      });

      const response = await RNBlobUtil.config({
        path: tempPath,
        fileCache: true,
      }).fetch('GET', url, {
        Accept: mimeType,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      });

      const status = Number(response.info()?.status);

      console.log('[BILLING FILE DOWNLOAD STATUS]', status);

      if (status < 200 || status >= 300) {
        throw new Error(`Download failed. HTTP ${status}`);
      }

      // Verify the server actually returned the expected file.
      const contentType = String(
        response.info()?.headers?.['Content-Type'] ||
          response.info()?.headers?.['content-type'] ||
          '',
      ).toLowerCase();

      if (
        contentType.includes('application/json') ||
        contentType.includes('text/html')
      ) {
        throw new Error(
          'Server returned a response instead of the requested file.',
        );
      }

      if (Platform.OS === 'android') {
        const savedUri = await RNBlobUtil.MediaCollection.copyToMediaStore(
          {
            name: fileName,
            parentFolder: PARENT_FOLDER,
            mimeType,
          },
          'Download',
          response.path(),
        );

        console.log('[BILLING FILE SAVED]', {
          savedUri,
          fileName,
          parentFolder: PARENT_FOLDER,
        });

        Alert.alert(
          'Download Complete',
          `${fileName} saved to Downloads/${PARENT_FOLDER}.`,
        );
      } else {
        const destination = `${RNBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

        await RNBlobUtil.fs.cp(tempPath, destination);

        Alert.alert('Download Complete', `${fileName} saved to app documents.`);
      }
    } finally {
      try {
        if (await RNBlobUtil.fs.exists(tempPath)) {
          await RNBlobUtil.fs.unlink(tempPath);
        }
      } catch (error) {
        console.log('[DOWNLOAD CLEANUP ERROR]', error);
      }
    }
  };

  const handleDownloadReceiptPdf = async bill => {
    const billId = Number(bill?.id);

    const receiptId = Number(bill?.receipt?.id ?? bill?.receipt_id);

    console.log('[RECEIPT DOWNLOAD CLICK]', {
      billId,
      receiptId,
      receipt: bill?.receipt,
    });

    if (!Number.isInteger(receiptId) || receiptId <= 0) {
      Alert.alert(
        'Receipt Unavailable',
        'Receipt ID was not found for this bill.',
      );
      return;
    }

    if (downloadingFile !== null) return;

    try {
      setDownloadingFile({
        billId,
        type: 'receipt',
      });

      await downloadBillingFile({
        endpoint: `/api/billing/v2/receipts/${receiptId}/download`,
        fileName: `Receipt_${receiptId}.pdf`,
        mimeType: 'application/pdf',
      });
    } catch (error) {
      console.log('[RECEIPT DOWNLOAD ERROR]', error);

      Alert.alert(
        'Download Failed',
        error?.message || 'Could not download receipt PDF.',
      );
    } finally {
      setDownloadingFile(null);
    }
  };

  const handleDownloadWord = async bill => {
    const billId = Number(bill?.id);

    console.log('[WORD DOWNLOAD CLICK]', { billId });

    if (!Number.isInteger(billId) || billId <= 0) {
      Alert.alert('Download Word', 'Invalid bill ID.');
      return;
    }

    if (downloadingFile !== null) return;

    try {
      setDownloadingFile({
        billId,
        type: 'word',
      });

      await downloadBillingFile({
        endpoint: `/api/billing/v2/bills/${billId}/docx`,
        fileName: `Bill_${billId}.docx`,
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
    } catch (error) {
      console.log('[WORD DOWNLOAD ERROR]', error);

      Alert.alert(
        'Download Failed',
        error?.message || 'Could not download Word document.',
      );
    } finally {
      setDownloadingFile(null);
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

  const gateway = String(paymentConfig?.gateway || '').toUpperCase();

  const isRazorpayEnabled =
    gateway === 'RAZORPAY' &&
    paymentConfig?.razorpay?.enabled === true &&
    paymentConfig?.razorpay?.configured === true;

  const isManualQrEnabled =
    gateway === 'QRCODE_MANUAL' &&
    paymentConfig?.qrcode_manual?.enabled === true &&
    paymentConfig?.qrcode_manual?.configured === true;

  const renderBill = ({ item }) => {
    const selected = selectedIds.includes(item.id);
    const isPaid = item.status === 'paid';

    const isGatewayPending =
      String(item.status).toLowerCase() === 'gateway_pending';

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
              {isGatewayPending
                ? 'GATEWAY PENDING'
                : String(item.status || '').toUpperCase()}
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

        {isPaid ? (
          <View style={styles.paidDownloadActions}>
            {/* Download Bill PDF */}
            <TouchableOpacity
              style={[
                styles.paidDownloadButton,
                styles.billDownloadButton,
                downloadingFile !== null && styles.downloadDisabled,
              ]}
              onPress={() => handleDownloadBillPdf(item)}
              disabled={downloadingFile !== null}
              activeOpacity={0.8}
            >
              {downloadingFile?.billId === Number(item.id) &&
              downloadingFile?.type === 'bill' ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.paidDownloadButtonText}>
                  <AntDesign name="download" color="#fff" size={17} />
                  {'  '}Download Bill PDF
                </Text>
              )}
            </TouchableOpacity>

            {/* Download Receipt PDF */}
            <TouchableOpacity
              style={[
                styles.paidDownloadButton,
                downloadingFile !== null && styles.downloadDisabled,
              ]}
              onPress={() => handleDownloadReceiptPdf(item)}
              disabled={downloadingFile !== null}
              activeOpacity={0.8}
            >
              {downloadingFile?.billId === Number(item.id) &&
              downloadingFile?.type === 'receipt' ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.paidDownloadButtonText}>
                  <AntDesign name="download" color="#fff" size={17} />
                  {'  '}Download Receipt PDF
                </Text>
              )}
            </TouchableOpacity>

            {/* Download Word */}
            <TouchableOpacity
              style={[
                styles.paidDownloadButton,
                downloadingFile !== null && styles.downloadDisabled,
              ]}
              onPress={() => handleDownloadWord(item)}
              disabled={downloadingFile !== null}
              activeOpacity={0.8}
            >
              {downloadingFile?.billId === Number(item.id) &&
              downloadingFile?.type === 'word' ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.paidDownloadButtonText}>
                  <AntDesign name="download" color="#fff" size={17} />
                  {'  '}Download Word
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.unpaidDownloadActions}>
            {/* Download Bill PDF */}
            <TouchableOpacity
              style={[
                styles.paidDownloadButton,
                downloadingFile !== null && styles.downloadDisabled,
              ]}
              onPress={() => handleDownloadBillPdf(item)}
              disabled={downloadingFile !== null}
              activeOpacity={0.8}
            >
              {downloadingFile?.billId === Number(item.id) &&
              downloadingFile?.type === 'bill' ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.paidDownloadButtonText}>
                  Download Bill PDF
                </Text>
              )}
            </TouchableOpacity>

            {/* Continue Payment */}
            <TouchableOpacity
              style={[
                styles.paidDownloadButton,
                styles.continuePaymentButton,
                (paymentLoading || paymentSubmitting || !!item.payment_ref) &&
                  styles.downloadDisabled,
              ]}
              onPress={() => handleContinuePayment(item)}
              disabled={
                paymentLoading || paymentSubmitting || !!item.payment_ref
              }
              activeOpacity={0.8}
            >
              {paymentLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.paidDownloadButtonText}>
                  Continue Payment
                </Text>
              )}
            </TouchableOpacity>

            {/* Download Word */}
            <TouchableOpacity
              style={[
                styles.paidDownloadButton,
                downloadingFile !== null && styles.downloadDisabled,
              ]}
              onPress={() => handleDownloadWord(item)}
              disabled={downloadingFile !== null}
              activeOpacity={0.8}
            >
              {downloadingFile?.billId === Number(item.id) &&
              downloadingFile?.type === 'word' ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.paidDownloadButtonText}>Download Word</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
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
                onPress={() => handlePaySelected()}
                disabled={paymentLoading}
                activeOpacity={0.85}
              >
                {paymentLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.payText}>
                    {isRazorpayEnabled
                      ? 'Pay with Razorpay'
                      : isManualQrEnabled
                      ? 'Pay by UPI QR'
                      : 'Payment Unavailable'}
                  </Text>
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
      <RazorpayCheckoutWebView
        visible={razorpayVisible}
        order={razorpayOrder}
        onEvent={handleRazorpayEvent}
        onClose={handleCloseRazorpay}
      />

      {razorpayChecking && (
        <View
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            backgroundColor: '#142B49',
            borderColor: '#3B7197',
            borderWidth: 1,
            borderRadius: 12,
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <ActivityIndicator size="small" color="#4F8CFF" />

          <Text style={{ color: '#FFFFFF', flex: 1 }}>
            Verifying payment with the server...
          </Text>
        </View>
      )}
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

export default BillingDashboard;
