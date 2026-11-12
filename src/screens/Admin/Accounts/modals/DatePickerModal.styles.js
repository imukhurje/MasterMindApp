import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  calendarBackdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.72)',

    paddingHorizontal: 16,
  },

  calendarModal: {
    width: '100%',
    maxWidth: 430,

    backgroundColor: '#0D2038',

    borderWidth: 1,
    borderColor: '#4E92C7',

    borderRadius: 16,

    overflow: 'hidden',
  },

  calendarHeader: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    paddingLeft: 15,
    paddingRight: 10,
    paddingVertical: 11,

    borderBottomWidth: 1,
    borderBottomColor: '#376D99',
  },

  headerText: {
    flex: 1,
    paddingRight: 10,
  },

  calendarTitle: {
    color: '#F1F5F9',

    fontSize: 16,
    fontWeight: '900',
  },

  calendarSubtitle: {
    color: '#A8B6C9',

    fontSize: 10,

    marginTop: 3,
  },

  calendarClose: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EF4444',

    borderRadius: 10,
  },
});
