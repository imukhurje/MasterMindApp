import React, { memo, useMemo } from 'react';

import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './AccountsHelpModal.styles';

function HelpCard({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>

      {children}
    </View>
  );
}

function HelpParagraph({ children, style }) {
  return <Text style={[styles.paragraph, style]}>{children}</Text>;
}

function HelpBullet({ children }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>

      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function AccountsHelpModal({ visible, onClose }) {
  const { width, height } = useWindowDimensions();

  /*
   * Give the modal a real numeric height.
   * This makes Android ScrollView calculate
   * its scrollable area correctly.
   */
  const modalSize = useMemo(() => {
    const horizontalGap = 28;

    const calculatedWidth = Math.min(width - horizontalGap, 560);

    const calculatedHeight = Math.min(
      Math.max(height * 0.76, 430),
      height - 120,
    );

    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  }, [width, height]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      hardwareAccelerated
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.modal, modalSize]}>
          {/* Fixed header */}
          <View style={styles.header}>
            <View style={styles.headerTextArea}>
              <Text style={styles.title}>Accounts Help for Operators</Text>

              <Text style={styles.subtitle}>Plain language daily guide</Text>
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons name="close" size={23} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Scrollable body */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator
            persistentScrollbar
            nestedScrollEnabled
            scrollEnabled
            bounces
            overScrollMode="always"
            keyboardShouldPersistTaps="handled"
            scrollEventThrottle={16}
          >
            <HelpCard title="What this area is for">
              <HelpParagraph>
                Use Accounts to answer four practical questions: who owes the
                organization, who the organization owes, how much cash is on
                hand, and what the bank balance should be.
              </HelpParagraph>
            </HelpCard>

            <HelpCard title="Your everyday routine">
              <HelpBullet>
                Start with yesterday's unfinished items: unpaid fees, unpaid
                supplier bills, and unreconciled bank items.
              </HelpBullet>

              <HelpBullet>
                As customers pay, record one receipt per payment method and keep
                the reference number.
              </HelpBullet>

              <HelpBullet>
                As suppliers send bills, enter the bill before any payment is
                made.
              </HelpBullet>

              <HelpBullet>
                Before paying a supplier, check that the bill amount and due
                date match the paper bill.
              </HelpBullet>

              <HelpBullet>
                At day end, compare actual cash with the cash book and compare
                bank messages with the bank book.
              </HelpBullet>
            </HelpCard>

            <HelpCard title="Simple rules when you are unsure">
              <HelpBullet>If money came in, make a receipt.</HelpBullet>

              <HelpBullet>
                If the organization received a bill, record a payable even if
                you will pay later.
              </HelpBullet>

              <HelpBullet>
                If no money moved yet, do not mark it as paid.
              </HelpBullet>

              <HelpBullet>
                If a mistake is found, correct it clearly. Do not quietly
                overwrite history.
              </HelpBullet>
            </HelpCard>

            <HelpCard title="Two date settings that protect you">
              <HelpParagraph>
                <Text style={styles.bold}>Posting lock date </Text>
                means nobody should add or edit accounting entries dated on or
                before that day. Use it after you finish checking a period so
                old numbers do not move by accident.
              </HelpParagraph>

              <HelpParagraph style={styles.paragraphSpacing}>
                <Text style={styles.bold}>Closed through date </Text>
                means the books are treated as fully closed up to that date. Use
                it for months or terms you consider final.
              </HelpParagraph>

              <HelpParagraph style={styles.paragraphSpacing}>
                A practical habit is to use posting lock date first, then move
                closed through date only after you are completely satisfied with
                the reports.
              </HelpParagraph>
            </HelpCard>

            <HelpCard title="How to fill fiscal year start">
              <HelpParagraph>
                Enter it as <Text style={styles.bold}>MM-DD</Text>. For example,{' '}
                <Text style={styles.bold}>01-01</Text> means January 1 and{' '}
                <Text style={styles.bold}>04-01</Text> means April 1. This field
                marks the first day of your accounting year, not today's date.
              </HelpParagraph>
            </HelpCard>

            <HelpCard title="Weekly checks you can do without an accountant">
              <HelpBullet>
                Receivables aging: counterparties who still owe money.
              </HelpBullet>

              <HelpBullet>
                Payables aging: suppliers you must pay soon.
              </HelpBullet>

              <HelpBullet>
                Cash book: whether office cash looks reasonable.
              </HelpBullet>

              <HelpBullet>
                Bank book: whether deposits and withdrawals match your
                statement.
              </HelpBullet>

              <HelpBullet>
                Trial balance: a quick sign that entries are staying balanced.
              </HelpBullet>
            </HelpCard>

            <HelpCard title="Low-cost discipline that matters most">
              <HelpBullet>
                Keep photo copies or phone scans of receipts, bills, and
                vouchers.
              </HelpBullet>

              <HelpBullet>
                Use one person to collect cash and another person to review
                totals when possible.
              </HelpBullet>

              <HelpBullet>
                Close each day before starting the next one. Small delays become
                expensive confusion.
              </HelpBullet>
            </HelpCard>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default memo(AccountsHelpModal);
