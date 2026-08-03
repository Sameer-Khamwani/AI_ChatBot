import { StyleSheet } from 'react-native';
import { colors } from '../../Utils/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  innerContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export const getHorizontalPadding = (paddingHorizontal: number) => ({
  paddingHorizontal,
});

export const getScrollContentPadding = (
  paddingHorizontal: number,
  paddingBottom: number,
) => ({
  paddingHorizontal,
  paddingBottom,
});
