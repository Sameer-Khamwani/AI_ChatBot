import { StyleSheet } from 'react-native';
import { fonts } from '../../Assets/Fonts';
import { font, heightPixel, vh, vw } from '../../Utils/helper';
import { colors } from '../../Utils/theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  label: {
    fontSize: vh * 1.8,
  },
  required: {
    marginLeft: vw * 0.5,
    fontSize: vh * 1.5,
    color: 'red',
  },
  labelContainer: {
    marginTop: heightPixel(5),
  },
  textInputContainer: {
    paddingHorizontal: vw * 2,
    borderRadius: heightPixel(12),
    backgroundColor: 'transparent',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.lightText,
    height: vh * 6,
  },
  multilineContainer: {
    height: vh * 22,
    alignItems: 'flex-start',
    paddingVertical: heightPixel(10),
  },
  textInput: {
    paddingHorizontal: vw * 2,
    fontSize: font(14),
    fontFamily: fonts.Poppins.regular,
    color: colors.white,
    width: '100%',
    backgroundColor: 'transparent',
  },
  multilineInput: {
    height: '100%',
    textAlignVertical: 'top',
  },
  eyeView: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  inputErrorSpacing: {
    marginTop: heightPixel(4),
  },
  inputFill: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default styles;
