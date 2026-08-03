import { StyleSheet } from 'react-native';
import { heightPixel } from '../../../Utils/helper';

export const styles = StyleSheet.create({
  hint: {
    marginBottom: heightPixel(20),
    lineHeight: heightPixel(20),
  },
  field: {
    marginBottom: heightPixel(16),
  },
  pickButton: {
    marginBottom: heightPixel(12),
  },
  saveButton: {
    marginTop: heightPixel(8),
  },
});
