import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import MainNavigation from './src/Navigation/MainNavigation';
import { persistor, store } from './src/Redux/Store';
import colors from './src/Utils/theme';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={styles.root}>
          <SafeAreaProvider>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'light-content'}
              backgroundColor={colors.primaryBackground}
            />
            <MainNavigation />
            <Toast />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
});

export default App;
