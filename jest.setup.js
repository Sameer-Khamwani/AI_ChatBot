import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: () => null,
  show: jest.fn(),
}));

jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(),
  isCancel: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
    initialWindowMetrics: { insets: inset, frame: { x: 0, y: 0, width: 390, height: 844 } },
  };
});
