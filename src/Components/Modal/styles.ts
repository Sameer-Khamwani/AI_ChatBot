import { StyleSheet } from 'react-native';
import { heightPixel, vh, widthPixel } from '../../Utils/helper';
import { colors } from '../../Utils/theme';

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalView: {
    backgroundColor: colors.lightPrimaryBackground,
    justifyContent: 'space-between',
    borderRadius: heightPixel(30),
    paddingVertical: heightPixel(40),
    paddingHorizontal: widthPixel(15),
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: heightPixel(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: heightPixel(15),
    right: widthPixel(15),
    zIndex: 1,
  },
  modalText: {
    width: '100%',
    marginVertical: vh,
    textAlign: 'center',
    lineHeight: vh * 2.5,
  },
  customButton: {
    marginVertical: heightPixel(20),
    height: heightPixel(42),
    minWidth: widthPixel(110),
  },
  childrenContainer: {
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  headerText: {
    textAlign: 'center',
    marginTop: heightPixel(20),
  },
  buttonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
