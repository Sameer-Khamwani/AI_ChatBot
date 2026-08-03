import { StyleSheet } from 'react-native';
import { fonts } from '../../Assets/Fonts';
import { vh, vw } from '../../Utils/helper';

export const styles = StyleSheet.create({
  light: {
    fontFamily: fonts.Poppins.light,
  },
  regular: {
    fontFamily: fonts.Poppins.regular,
  },
  semibold: {
    fontFamily: fonts.Poppins.semiBold,
  },
  bold: {
    fontFamily: fonts.Poppins.bold,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  required: {
    marginLeft: vw * 0.5,
    fontSize: vh * 1.5,
    height: vh * 2,
    color: 'red',
  },
  labelContainer: {},
});
