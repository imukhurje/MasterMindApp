import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 30,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(1, 8, 18, 0.82)',
  },

  modalCard: {
    width: '100%',
    maxHeight: '88%',
    alignSelf: 'center',
    backgroundColor: '#142F52',
    borderWidth: 1,
    borderColor: '#4A86B3',
    borderRadius: 17,
    overflow: 'hidden',
  },

  scrollContent: {
    padding: 18,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },

  subtitle: {
    color: '#AFC2DA',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 4,
  },

  closeButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 10,
  },

  label: {
    color: '#DCE7F5',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    marginTop: 13,
    marginBottom: 7,
  },

  input: {
    minHeight: 44,
    paddingHorizontal: 12,
    color: '#F8FAFC',
    fontSize: 14,
    backgroundColor: '#0D2039',
    borderWidth: 1,
    borderColor: '#4281B1',
    borderRadius: 9,
  },

  selectInput: {
    minHeight: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: '#0D2039',
    borderWidth: 1,
    borderColor: '#4281B1',
    borderRadius: 9,
  },

  selectText: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
  },

  twoColumnRow: {
    flexDirection: 'row',
    gap: 10,
  },

  flexField: {
    flex: 1,
  },

  detailsInput: {
    minHeight: 92,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#F8FAFC',
    fontSize: 14,
    backgroundColor: '#0D2039',
    borderWidth: 1,
    borderColor: '#4281B1',
    borderRadius: 9,
  },

  submitButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 15,
    backgroundColor: '#2563EB',
    borderRadius: 9,
  },

  submitButtonDisabled: {
    opacity: 0.45,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  buttonPressed: {
    opacity: 0.78,
  },

  selectionOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  selectionBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(1, 8, 18, 0.82)',
  },

  selectionCard: {
    maxHeight: '68%',
    backgroundColor: '#142F52',
    borderWidth: 1,
    borderColor: '#4A86B3',
    borderRadius: 15,
    padding: 14,
  },

  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  selectionTitle: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
  },

  smallCloseButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 8,
  },

  selectionList: {
    maxHeight: 360,
  },

  selectionOption: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#0D2039',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 9,
  },

  selectionOptionActive: {
    backgroundColor: '#2563EB',
    borderColor: '#60A5FA',
  },

  selectionOptionText: {
    flex: 1,
    color: '#DCE7F5',
    fontSize: 14,
    fontWeight: '600',
  },

  selectionOptionTextActive: {
    color: '#FFFFFF',
  },
});
