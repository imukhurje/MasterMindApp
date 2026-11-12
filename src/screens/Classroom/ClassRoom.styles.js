import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111F',
  },

  contentContainer: {
    padding: 14,
    paddingBottom: 32,
    gap: 12,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07111F',
  },

  loadingText: {
    color: '#AFC2DA',
    fontSize: 14,
    marginTop: 10,
  },

  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 14,
  },

  welcomeIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B1C31',
    borderRadius: 13,
  },

  welcomeContent: {
    flex: 1,
  },

  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
  },

  welcomeSubtitle: {
    color: '#AFC2DA',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  profileCard: {
    padding: 14,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 14,
  },

  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 26,
  },

  profileContent: {
    flex: 1,
    marginLeft: 11,
  },

  studentName: {
    color: '#F8FAFC',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
  },

  roleText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },

  profileInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },

  profileInfo: {
    width: '48%',
    minHeight: 63,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: '#0B1C31',
    borderRadius: 9,
  },

  infoLabel: {
    color: '#8FA5BE',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
  },

  infoValue: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
    marginTop: 4,
  },

  sectionCard: {
    padding: 13,
    backgroundColor: '#102B48',
    borderWidth: 1,
    borderColor: '#3F7BA7',
    borderRadius: 14,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },

  sectionHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },

  countBadge: {
    minWidth: 29,
    height: 25,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B1C31',
    borderRadius: 20,
  },

  countBadgeText: {
    color: '#7DD3FC',
    fontSize: 11,
    fontWeight: '900',
  },

  currentClassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 11,
  },

  currentClassIcon: {
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 11,
  },

  currentClassContent: {
    flex: 1,
  },

  currentClassTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
  },

  currentClassYear: {
    color: '#AFC2DA',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  currentClassDescription: {
    color: '#8FA5BE',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },

  currentBadge: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    backgroundColor: '#064E3B',
    borderRadius: 20,
  },

  currentBadgeText: {
    color: '#6EE7B7',
    fontSize: 8,
    fontWeight: '900',
  },

  classroomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 11,
    marginBottom: 8,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 10,
  },

  classroomIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#102742',
    borderRadius: 10,
  },

  classroomContent: {
    flex: 1,
  },

  classroomTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
  },

  classroomDescription: {
    color: '#AFC2DA',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  integrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 12,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 10,
  },

  integrationIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#102742',
    borderRadius: 11,
  },

  integrationContent: {
    flex: 1,
  },

  integrationTitle: {
    color: '#F1F5F9',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
  },

  integrationDescription: {
    color: '#8FA5BE',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  searchBox: {
    minHeight: 47,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: 11,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 9,
  },

  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
    paddingVertical: 0,
  },

  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 61,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 10,
  },

  classItemCurrent: {
    borderColor: '#34D399',
    backgroundColor: '#0B2630',
  },

  classIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#102742',
    borderRadius: 10,
  },

  classIconCurrent: {
    backgroundColor: '#047857',
  },

  classContent: {
    flex: 1,
  },

  classTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
  },

  classYear: {
    color: '#8FA5BE',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  emptyState: {
    minHeight: 135,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    backgroundColor: '#0B1C31',
    borderWidth: 1,
    borderColor: '#315F84',
    borderRadius: 10,
  },

  emptyTitle: {
    color: '#F1F5F9',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
    marginTop: 9,
    textAlign: 'center',
  },

  emptyDescription: {
    color: '#8FA5BE',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
    textAlign: 'center',
  },
});
