import { StyleSheet } from 'react-native';
import { heightPixel, widthPixel } from '../../Utils/helper';
import colors from '../../Utils/theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lightPrimaryBackground,
    borderRadius: heightPixel(16),
    padding: widthPixel(16),
    borderWidth: 1,
    borderColor: colors.darkButton,
  },
  content: {
    flex: 1,
    paddingRight: widthPixel(12),
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.lightPrimary,
    paddingHorizontal: widthPixel(8),
    paddingVertical: heightPixel(2),
    borderRadius: heightPixel(6),
    marginBottom: heightPixel(8),
  },
  title: {
    marginBottom: heightPixel(4),
  },
  summary: {
    marginBottom: heightPixel(8),
    lineHeight: heightPixel(18),
  },
  date: {
    marginTop: heightPixel(2),
  },
});
