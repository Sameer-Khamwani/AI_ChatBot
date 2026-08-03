import { StyleSheet } from 'react-native';
import { heightPixel } from '../../Utils/helper';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    width: heightPixel(110),
    height: heightPixel(110),
    borderRadius: heightPixel(12),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  text: {
    marginTop: heightPixel(12),
    textAlign: 'center',
  },
});
