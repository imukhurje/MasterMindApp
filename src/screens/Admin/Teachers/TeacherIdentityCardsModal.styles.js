import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(2, 8, 20, 0.88)',
  },

  modalCard: {
    width: '100%',
    maxHeight: '88%',
    padding: 15,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
  },

  subtitle: {
    color: '#AFC2DA',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 10,
  },

  searchRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },

  searchBox: {
    flex: 1,
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 9,
  },

  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
    marginLeft: 8,
    paddingVertical: 0,
  },

  outlineButton: {
    minHeight: 46,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 9,
  },

  outlineButtonText: {
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: '800',
  },

  selectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 14,
  },

  selectAllText: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '700',
  },

  selectedCount: {
    color: '#AFC2DA',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 10,
  },

  listScroll: {
    flexGrow: 0,
  },

  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 66,
    padding: 10,
    marginBottom: 7,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 10,
  },

  teacherRowSelected: {
    borderColor: '#60A5FA',
  },

  roleColumn: {
    width: '34%',
  },

  nameColumn: {
    flex: 1,
  },

  columnLabel: {
    color: '#8FA5BE',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },

  roleText: {
    color: '#DCE7F5',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },

  nameText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },

  loadingBox: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#AFC2DA',
    fontSize: 12,
    marginTop: 10,
  },

  emptyBox: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
  },

  footer: {
    paddingTop: 12,
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#244D6E',
  },

  pageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  pageText: {
    flex: 1,
    color: '#AFC2DA',
    fontSize: 11,
  },

  paginationButtons: {
    flexDirection: 'row',
    gap: 7,
  },

  pageButton: {
    width: 38,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4B89B6',
    borderRadius: 8,
  },

  downloadButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 14,
    marginTop: 12,
    backgroundColor: '#2563EB',
    borderRadius: 9,
  },

  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  disabled: {
    opacity: 0.45,
  },

  pressed: {
    opacity: 0.78,
  },
});
