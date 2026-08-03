import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { heightPixel, widthPixel } from '../../Utils/helper';
import { IAppWrapper } from '../../Utils/interface';
import {
  getHorizontalPadding,
  getScrollContentPadding,
  styles,
} from './style';

const AppWrapper = ({
  children,
  style,
  disableBottomPadding = false,
  bottomPadding,
  paddingHorizontal,
  disableScrollWrapper = false,
}: IAppWrapper) => {
  const insets = useSafeAreaInsets();
  const resolvedBottomPadding =
    bottomPadding ??
    (disableBottomPadding ? 0 : heightPixel(20) + insets.bottom);
  const resolvedHorizontalPadding = paddingHorizontal ?? widthPixel(14);

  if (disableScrollWrapper) {
    return (
      <SafeAreaView
        edges={['bottom', 'left', 'right']}
        style={[styles.container, style]}>
        <View
          style={[
            styles.innerContainer,
            getHorizontalPadding(resolvedHorizontalPadding),
          ]}>
          {children}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          getScrollContentPadding(
            resolvedHorizontalPadding,
            resolvedBottomPadding,
          ),
          style,
        ]}
        enableOnAndroid
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {children}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default AppWrapper;
