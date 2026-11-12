import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LearningHelperPanel = ({
  activeTab,
  onTabChange,
  // history
  notesHistory,
  chatHistory,
  // draft
  notes,
  onNotesChange,
  question,
  onQuestionChange,
  onSendQuestion,
  showAsk = true,
  onSaveNotes,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: 12 + insets.bottom }]}>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'notes' && styles.tabButtonActive,
          ]}
          onPress={() => onTabChange && onTabChange('notes')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'notes' && styles.tabTextActive,
            ]}
          >
            Notes
          </Text>
        </TouchableOpacity>

        {showAsk && (
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'ask' && styles.tabButtonActive,
            ]}
            onPress={() => onTabChange && onTabChange('ask')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'ask' && styles.tabTextActive,
              ]}
            >
              Ask
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {activeTab === 'notes' || !showAsk ? (
        <View style={styles.contentWrapper}>
          {/* READ-ONLY HISTORY */}
          {notesHistory ? (
            <ScrollView style={styles.historyBox}>
              <Text style={styles.historyText}>{notesHistory}</Text>
            </ScrollView>
          ) : null}

          {/* EDITABLE INPUT */}
          <TextInput
            style={[styles.textArea, { marginTop: notesHistory ? 8 : 0 }]}
            value={notes}
            onChangeText={onNotesChange}
            placeholder="Write a new note for this lesson..."
            placeholderTextColor="#6B7280"
            multiline
          />
          <TouchableOpacity
            style={styles.notesSaveButton}
            onPress={() => onSaveNotes && onSaveNotes()}
          >
            <Text style={styles.notesSaveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.contentWrapper}>
          {/* READ-ONLY CHAT HISTORY */}
          {chatHistory ? (
            <ScrollView style={styles.historyBox}>
              <Text style={styles.historyText}>{chatHistory}</Text>
            </ScrollView>
          ) : null}

          {/* EDITABLE INPUT */}
          <TextInput
            style={[styles.textArea, { marginTop: chatHistory ? 8 : 0 }]}
            value={question}
            onChangeText={onQuestionChange}
            placeholder="Type your question..."
            placeholderTextColor="#6B7280"
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={onSendQuestion}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    backgroundColor: '#020617',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#22C55E',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#F9FAFB',
  },

  contentWrapper: {
    flex: 1,
  },

  /** HISTORY (READ-ONLY) **/
  historyBox: {
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 4,
    backgroundColor: '#020617',
  },
  historyText: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  /** SHARED TEXTAREA FOR INPUT **/
  textArea: {
    flex: 1,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#F9FAFB',
    fontSize: 13,
    textAlignVertical: 'top',
  },

  /** NOTES SAVE BUTTON **/
  notesSaveButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 8,
  },
  notesSaveButtonText: {
    color: '#022C22',
    fontSize: 13,
    fontWeight: '600',
  },

  /** ASK SEND BUTTON **/
  sendButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 8,
  },
  sendButtonText: {
    color: '#022C22',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default LearningHelperPanel;
