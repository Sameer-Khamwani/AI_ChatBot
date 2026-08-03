import { StyleSheet } from 'react-native';
import { heightPixel, widthPixel } from '../../Utils/helper';
import colors from '../../Utils/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: widthPixel(32),
  },
  iconCircle: {
    width: heightPixel(72),
    height: heightPixel(72),
    borderRadius: heightPixel(36),
    backgroundColor: colors.lightPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightPixel(16),
  },
  title: {
    marginBottom: heightPixel(8),
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: heightPixel(20),
    marginBottom: heightPixel(24),
  },
  cta: {
    width: '100%',
    maxWidth: widthPixel(220),
  },
});
