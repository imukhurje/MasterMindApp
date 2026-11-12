import { StyleSheet } from 'react-native';

const BG = '#0F172A';
const SURFACE = '#142B49';
const DEEP = '#0B1C32';
const BORDER = '#3B7197';
const TEXT = '#F8FAFC';
const MUTED = '#AFC0D8';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG, padding: 10 },
  searchOuter: { backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 15, padding: 10, marginBottom: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 7 },
  searchInput: { flexGrow: 1, flexBasis: 165, minWidth: 145, minHeight: 45, borderColor: BORDER, borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, backgroundColor: DEEP, color: TEXT, fontSize: 12 },
  statusSelect: { minWidth: 91, minHeight: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 3, paddingHorizontal: 9, borderRadius: 9, borderWidth: 1, borderColor: BORDER, backgroundColor: DEEP },
  statusSelectText: { color: TEXT, fontSize: 12, fontWeight: '700' },
  actionButton: { minHeight: 45, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 11, borderWidth: 1, borderColor: BORDER, backgroundColor: SURFACE, borderRadius: 9 },
  actionText: { color: TEXT, fontSize: 12, fontWeight: '800' },
  resultsOuter: { flex: 1, backgroundColor: SURFACE, borderRadius: 15, borderColor: BORDER, borderWidth: 1, padding: 10 },
  listContent: { flexGrow: 1, paddingBottom: 12 },
  emptyState: { minHeight: 100, borderStyle: 'dashed', borderWidth: 1, borderColor: BORDER, borderRadius: 12, backgroundColor: '#0B172A', alignItems: 'center', justifyContent: 'center', padding: 16 },
  emptyText: { color: MUTED, fontSize: 13, textAlign: 'center' },
  centered: { minHeight: 160, justifyContent: 'center', alignItems: 'center', gap: 12 },
  helpText: { color: MUTED, fontSize: 13, textAlign: 'center' },
  retryButton: { marginTop: 10, borderColor: BORDER, backgroundColor: DEEP, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 9 },
  purchaseCard: { borderWidth: 1, borderColor: BORDER, borderRadius: 12, backgroundColor: DEEP, marginBottom: 10, padding: 13, gap: 6 },
  purchaseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  purchaseHeaderText: { flex: 1 },
  purchaseTitle: { color: TEXT, fontSize: 14, fontWeight: '900' },
  purchaseText: { color: '#E2EAF5', fontSize: 12 },
  purchaseMuted: { color: MUTED, fontSize: 11, marginTop: 3 },
  statusPill: { borderWidth: 1, borderColor: BORDER, borderRadius: 7, backgroundColor: SURFACE, paddingVertical: 5, paddingHorizontal: 8 },
  statusText: { color: '#BFDBFE', fontSize: 10, fontWeight: '800', textTransform: 'capitalize' },
  footer: { padding: 8, alignItems: 'center', gap: 10 },
  pageText: { color: MUTED, fontSize: 11 },
  loadMoreButton: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#2563EB', borderRadius: 9 },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.75)', padding: 18 },
  modalCard: { width: '100%', maxWidth: 450, alignSelf: 'center', padding: 14, borderRadius: 14, borderColor: BORDER, borderWidth: 1, backgroundColor: DEEP },
  modalTitle: { color: TEXT, fontWeight: '900', fontSize: 16, marginBottom: 12 },
  modalOption: { minHeight: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, borderRadius: 9, borderColor: BORDER, borderWidth: 1, marginBottom: 8, backgroundColor: SURFACE },
  modalOptionSelected: { borderColor: '#60A5FA', backgroundColor: '#193A66' },
  modalOptionText: { color: TEXT, fontWeight: '700', fontSize: 13 },
  closeButton: { alignSelf: 'flex-end', padding: 12 },
});
