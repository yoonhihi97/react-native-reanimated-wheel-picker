/* eslint-disable no-undef */
import '@testing-library/jest-native/extend-expect';

// 공식 worklets mock 사용 (must be before reanimated import)
jest.mock('react-native-worklets', () =>
  require('react-native-worklets/lib/module/mock')
);

// Setup react-native-reanimated mocks
require('react-native-reanimated').setUpTests();

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureDetector: ({ children }) => children,
    Gesture: {
      Pan: () => ({
        onStart: () => ({ onUpdate: () => ({ onEnd: () => ({}) }) }),
        onUpdate: () => ({ onEnd: () => ({}) }),
        onEnd: () => ({}),
      }),
    },
    GestureHandlerRootView: View,
  };
});

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
