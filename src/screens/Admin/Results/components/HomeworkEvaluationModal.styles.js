import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B1C32',
    borderBottomWidth: 1,
    borderBottomColor: '#3B7197',
    paddingHorizontal: 14,
    paddingTop: 38,
    paddingBottom: 14,
  },

  headerInfo: {
    flex: 1,
    paddingRight: 10,
  },

  headerTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '900',
  },

  headerSubtitle: {
    color: '#AFC0D8',
    fontSize: 11,
    marginTop: 5,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#142B49',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },

  scroll: {
    flex: 1,
  },

  content: {
    padding: 12,
    paddingBottom: 40,
    gap: 12,
  },

  summaryCard: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 13,
    backgroundColor: '#142B49',
    padding: 12,
    gap: 7,
  },

  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
  },

  muted: {
    color: '#AFC0D8',
    fontSize: 11,
    lineHeight: 18,
  },

  searchInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#142B49',
    color: '#FFFFFF',
    fontSize: 12,
    paddingHorizontal: 12,
  },

  studentCard: {
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 11,
    backgroundColor: '#0B1C32',
    padding: 12,
    gap: 5,
  },

  studentCardSelected: {
    borderColor: '#7DD3FC',
    backgroundColor: '#193565',
  },

  studentName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  emptyCard: {
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 11,
    alignItems: 'center',
  },

  detailsSection: {
    gap: 12,
    marginTop: 8,
  },

  scoreCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 12,
    backgroundColor: '#142B49',
    padding: 14,
  },

  scoreText: {
    color: '#86EFAC',
    fontSize: 17,
    fontWeight: '900',
  },

  fileButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#0B1C32',
    borderWidth: 1,
    borderColor: '#3B7197',
  },

  fileText: {
    flexShrink: 1,
    color: '#7DD3FC',
    fontSize: 11,
  },

  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },

  attemptNotesSection: {
    marginTop: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#3B7197',
    borderRadius: 12,
    backgroundColor: '#0B1C32',
    padding: 12,
    gap: 9,
  },

  attemptNotesTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },

  attemptNotesLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },

  attemptNotesInput: {
    minHeight: 48,
    maxHeight: 110,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#142B49',
    color: '#FFFFFF',
    fontSize: 12,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },

  attemptNotesActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },

  attemptNotesCloseButton: {
    minHeight: 42,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#3B7197',
    borderRadius: 9,
    backgroundColor: '#142B49',
    alignItems: 'center',
    justifyContent: 'center',
  },

  attemptNotesSaveButton: {
    minWidth: 100,
    minHeight: 42,
    paddingHorizontal: 14,
    borderRadius: 9,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  attemptNotesButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
