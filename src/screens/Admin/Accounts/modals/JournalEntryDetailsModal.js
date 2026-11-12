import React from 'react';

import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './JournalEntryDetailsModal.styles';

import { formatMoney } from '../utils/accountsHelpers';

function getLines(journal) {
  if (Array.isArray(journal?.lines)) {
    return journal.lines;
  }

  if (Array.isArray(journal?.journal_lines)) {
    return journal.journal_lines;
  }

  return [];
}

function getDate(value) {
  if (!value) {
    return '-';
  }

  return String(value).slice(0, 10);
}

function DetailBox({ label, value }) {
  return (
    <View style={styles.detailBox}>
      <Text style={styles.detailLabel}>{label}</Text>

      <Text style={styles.detailValue}>{value ?? '-'}</Text>
    </View>
  );
}

export default function JournalEntryDetailsModal({
  visible,
  journal,
  currencySymbol = '₹',
  onClose,
}) {
  if (!journal) {
    return null;
  }

  const lines = getLines(journal);

  const debitTotal =
    Number(
      journal?.debit_total ?? journal?.total_debit ?? journal?.debit ?? 0,
    ) || 0;

  const creditTotal =
    Number(
      journal?.credit_total ?? journal?.total_credit ?? journal?.credit ?? 0,
    ) || 0;

  const entryNumber =
    journal?.entry_number ||
    journal?.journal_number ||
    `Journal #${journal?.id}`;

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
              <Text style={styles.title}>Journal entry details</Text>

              <Text style={styles.subtitle} numberOfLines={2}>
                Journal {entryNumber}
              </Text>
            </View>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator
          >
            <View style={styles.grid}>
              <DetailBox label="Entry number" value={entryNumber} />

              <DetailBox
                label="Posting date"
                value={getDate(
                  journal?.posting_date ||
                    journal?.journal_date ||
                    journal?.entry_date,
                )}
              />

              <DetailBox
                label="Description"
                value={journal?.description || '-'}
              />

              <DetailBox
                label="Entry type"
                value={journal?.entry_type || '-'}
              />

              <DetailBox label="Status" value={journal?.status || 'Posted'} />

              <DetailBox
                label="Reference"
                value={journal?.source_reference || journal?.reference || '-'}
              />

              <DetailBox
                label="Source type"
                value={journal?.source_type || '-'}
              />

              <DetailBox
                label="Debit total"
                value={formatMoney(debitTotal, currencySymbol)}
              />

              <DetailBox
                label="Credit total"
                value={formatMoney(creditTotal, currencySymbol)}
              />

              <DetailBox
                label="Line count"
                value={String(lines.length || journal?.line_count || 0)}
              />

              <DetailBox
                label="Posted at"
                value={getDate(journal?.posted_at || journal?.posting_date)}
              />

              <DetailBox
                label="Created at"
                value={getDate(journal?.created_at)}
              />
            </View>

            <View style={styles.linesCard}>
              <Text style={styles.linesTitle}>Lines</Text>

              {lines.length === 0 ? (
                <Text style={styles.emptyText}>
                  No journal lines available.
                </Text>
              ) : (
                lines.map((line, index) => {
                  const accountCode =
                    line?.account_code || line?.account?.code || '';

                  const accountName =
                    line?.account_name ||
                    line?.account?.name ||
                    line?.description ||
                    'Account';

                  const debit = Number(line?.debit) || 0;

                  const credit = Number(line?.credit) || 0;

                  const amountText =
                    debit > 0
                      ? `Dr ${formatMoney(debit, currencySymbol)}`
                      : `Cr ${formatMoney(credit, currencySymbol)}`;

                  return (
                    <View
                      key={line?.id ? String(line.id) : String(index)}
                      style={styles.lineItem}
                    >
                      <Text style={styles.lineNumber}>{index + 1}.</Text>

                      <View style={styles.lineBody}>
                        <Text style={styles.lineText}>
                          {accountCode
                            ? `${accountCode} - ${accountName}`
                            : accountName}{' '}
                          {amountText}
                        </Text>

                        {!!line?.description && (
                          <Text style={styles.lineDescription}>
                            {line.description}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
