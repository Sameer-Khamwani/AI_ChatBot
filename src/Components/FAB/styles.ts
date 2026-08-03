import { StyleSheet } from 'react-native';
import { heightPixel, widthPixel } from '../../Utils/helper';
import colors from '../../Utils/theme';

export const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: widthPixel(20),
    bottom: heightPixel(28),
    width: heightPixel(56),
    height: heightPixel(56),
    borderRadius: heightPixel(28),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
});
