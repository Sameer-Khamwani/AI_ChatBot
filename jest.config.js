module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-redux|@reduxjs/toolkit|redux-persist|immer|react-native-gesture-handler|react-native-reanimated|react-native-worklets|react-native-linear-gradient|react-native-toast-message|react-native-keyboard-aware-scroll-view|react-native-safe-area-context|react-native-screens)/)',
  ],
};
