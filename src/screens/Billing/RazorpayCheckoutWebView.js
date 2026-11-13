import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function RazorpayCheckoutWebView({
  visible,
  order,
  onEvent,
  onClose,
}) {
  const openingExternalAppRef = useRef(false);

  if (!order) return null;

  const options = {
    key: order.key_id,
    order_id: order.order_id,
    amount: order.amount,
    currency: order.currency,
    name: 'School fees',
    webview_intent: true,
  };

  const safeOptions = JSON.stringify(options).replace(/</g, '\\u003c');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,maximum-scale=1"
      />
      <style>
        body {
          margin: 0;
          background: #081524;
          color: white;
          font-family: sans-serif;
        }
      </style>
    </head>

    <body>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

      <script>
        var checkoutStarted = false;

        function send(type) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: type })
            );
          }
        }

        function startCheckout() {
          if (checkoutStarted) return;

          if (!window.Razorpay) {
            send('load_error');
            return;
          }

          checkoutStarted = true;

          var options = ${safeOptions};

          options.handler = function(response) {
            send('payment_callback');
          };

          options.modal = {
            ondismiss: function() {
              send('dismissed');
            }
          };

          try {
            var checkout = new Razorpay(options);

            checkout.on('payment.failed', function() {
              send('failed');
            });

            checkout.open();
          
            } catch (error) {
            send('load_error');
            }
        }

        // Start Razorpay after the page finishes loading.
        if (document.readyState === 'complete') {
            startCheckout();
        } else {
            window.addEventListener(
            'load',
            startCheckout,
            { once: true }
            );
        }
        </script>

    </body>
    </html>
  `;

  const openExternalPaymentApp = async url => {
    if (openingExternalAppRef.current) {
      return;
    }

    openingExternalAppRef.current = true;

    try {
      console.log('[RAZORPAY OPEN EXTERNAL APP]', {
        scheme: url.split(':')[0],
      });

      await Linking.openURL(url);

      console.log('[RAZORPAY EXTERNAL APP OPEN REQUESTED]');
    } catch (error) {
      console.log('[RAZORPAY EXTERNAL APP ERROR]', {
        code: error?.code,
        message: error?.message,
      });

      Alert.alert(
        'Payment App',
        'Could not open the selected UPI app. Please check that it is installed and try another payment option.',
      );
    } finally {
      openingExternalAppRef.current = false;
    }
  };

  const handleNavigation = request => {
    const url = String(request?.url || '').trim();

    if (!url) return false;

    const scheme = url.split(':')[0].toLowerCase();

    console.log('[RAZORPAY NAVIGATION]', { scheme });

    if (scheme === 'https' || url === 'about:blank') {
      return true;
    }

    const supportedPaymentSchemes = ['gpay', 'upi', 'phonepe', 'paytm'];

    if (Platform.OS === 'android' && supportedPaymentSchemes.includes(scheme)) {
      // Open Google Pay / UPI app through Android.
      // Never load these URLs inside WebView.
      openExternalPaymentApp(url);
      return false;
    }

    if (scheme === 'intent') {
      console.log(
        '[RAZORPAY INTENT URL]',
        'Android native intent handling required',
      );

      Alert.alert(
        'Payment App',
        'This payment method requires additional Android intent support.',
      );

      return false;
    }

    console.log('[RAZORPAY BLOCKED URL SCHEME]', scheme);
    return false;
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#081524',
        }}
      >
        <TouchableOpacity
          onPress={onClose}
          style={{
            padding: 16,
            backgroundColor: '#081524',
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: '800',
            }}
          >
            Close Payment
          </Text>
        </TouchableOpacity>

        <WebView
          originWhitelist={['https://*', 'about:blank']}
          source={{
            html,
            baseUrl: 'https://learning.sciencegateacademy.com',
          }}
          javaScriptEnabled
          domStorageEnabled
          javaScriptCanOpenWindowsAutomatically
          setSupportMultipleWindows={false}
          onShouldStartLoadWithRequest={handleNavigation}
          onMessage={event => {
            try {
              const data = JSON.parse(event.nativeEvent.data);

              console.log('[RAZORPAY MESSAGE]', data.type);

              onEvent?.(data.type);
            } catch (error) {
              console.log('[RAZORPAY MESSAGE ERROR]', error?.message);
            }
          }}
          onError={({ nativeEvent }) => {
            const scheme = String(nativeEvent.url || '')
              .split(':')[0]
              .toLowerCase();

            console.log('[RAZORPAY WEBVIEW ERROR DETAILS]', {
              code: nativeEvent.code,
              description: nativeEvent.description,
              scheme,
            });

            // External app redirects must not be
            // treated as failed HTTPS checkout loads.
            if (
              ['gpay', 'upi', 'phonepe', 'paytm', 'intent'].includes(scheme) &&
              nativeEvent.code === -10
            ) {
              console.log('[RAZORPAY EXTERNAL URL ERROR IGNORED]', scheme);
              return;
            }

            onEvent?.('load_error');
          }}
          style={{ flex: 1 }}
        />
      </View>
    </Modal>
  );
}
