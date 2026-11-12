import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.78)',

    paddingHorizontal: 16,
    paddingVertical: 28,
  },

  modal: {
    width: '100%',
    maxHeight: '84%',

    backgroundColor: '#102742',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 16,

    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',

    alignItems: 'flex-start',
    justifyContent: 'space-between',

    gap: 10,

    padding: 14,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: '#F1F5F9',

    fontSize: 17,
    fontWeight: '900',
  },

  subtitle: {
    color: '#DCE7F5',

    fontSize: 11,

    marginTop: 4,
  },

  closeButton: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },

  scroll: {
    flexGrow: 0,
  },

  content: {
    padding: 14,
    paddingBottom: 24,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 9,
  },

  detailBox: {
    width: '48%',

    minHeight: 78,

    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 12,

    padding: 11,
  },

  detailLabel: {
    color: '#A8B6C9',

    fontSize: 9,
  },

  detailValue: {
    color: '#F1F5F9',

    fontSize: 11,
    lineHeight: 17,

    fontWeight: '700',

    marginTop: 7,
  },

  linesCard: {
    backgroundColor: '#0B1A2E',

    borderWidth: 1,
    borderColor: '#294B69',

    borderRadius: 12,

    padding: 12,

    marginTop: 10,
  },

  linesTitle: {
    color: '#F1F5F9',

    fontSize: 12,
    fontWeight: '800',

    marginBottom: 9,
  },

  lineItem: {
    flexDirection: 'row',

    gap: 6,

    marginBottom: 7,
  },

  lineNumber: {
    color: '#F1F5F9',

    fontSize: 10,
    fontWeight: '900',
  },

  lineBody: {
    flex: 1,
  },

  lineText: {
    color: '#F1F5F9',

    fontSize: 10,
    lineHeight: 16,
  },

  lineDescription: {
    color: '#A8B6C9',

    fontSize: 9,
    lineHeight: 14,

    marginTop: 2,
  },

  emptyText: {
    color: '#A8B6C9',

    fontSize: 10,
  },
});
