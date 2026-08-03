import { StyleSheet } from 'react-native';
import { heightPixel, widthPixel } from '../../../Utils/helper';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCopy: {
    paddingHorizontal: widthPixel(16),
    paddingBottom: heightPixel(12),
    gap: heightPixel(4),
  },
  subtitle: {
    marginTop: heightPixel(2),
  },
  listContent: {
    paddingHorizontal: widthPixel(16),
    paddingBottom: heightPixel(100),
  },
  separator: {
    height: heightPixel(12),
  },
});
