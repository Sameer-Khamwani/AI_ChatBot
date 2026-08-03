import { StyleSheet } from 'react-native';
import { heightPixel, widthPixel } from '../../../Utils/helper';
import colors from '../../../Utils/theme';

export const styles = StyleSheet.create({
  hint: {
    marginBottom: heightPixel(20),
    lineHeight: heightPixel(20),
  },
  card: {
    backgroundColor: colors.lightPrimaryBackground,
    borderRadius: heightPixel(16),
    padding: widthPixel(16),
    marginBottom: heightPixel(14),
    borderWidth: 1,
    borderColor: colors.darkButton,
  },
  switchCopy: {
    flex: 1,
    paddingRight: widthPixel(12),
    gap: heightPixel(4),
  },
  fieldLabel: {
    marginBottom: heightPixel(6),
  },
  fieldHint: {
    marginBottom: heightPixel(12),
    lineHeight: heightPixel(18),
  },
  about: {
    marginTop: heightPixel(8),
    lineHeight: heightPixel(18),
  },
  aboutTitle: {
    marginTop: heightPixel(10),
  },
});
