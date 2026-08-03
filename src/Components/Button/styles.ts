import { StyleSheet } from 'react-native';
import { heightPixel, widthPixel } from '../../Utils/helper';
import colors from '../../Utils/theme';

export const styles = StyleSheet.create({
  primaryButtonContainer: {
    height: '100%',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: heightPixel(12),
    flexDirection: 'row',
  },
  secondaryButtonContainer: {
    height: heightPixel(55),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: heightPixel(12),
    flexDirection: 'row',
  },
  secondaryInnerContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightPrimaryBackground,
    borderRadius: heightPixel(12),
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: widthPixel(10),
  },
  labelText: {
    textAlign: 'center',
  },
  buttonHeight: {
    height: heightPixel(55),
  },
  disabledOverlay: {
    opacity: 0.5,
  },
});
