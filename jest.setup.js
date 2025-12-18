/* eslint-disable no-undef */
import '@testing-library/jest-native/extend-expect';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // Override useSharedValue to return a mock with .value
  Reanimated.useSharedValue = (initialValue) => ({
    value: initialValue,
  });

  // Override useAnimatedStyle to return empty style
  Reanimated.useAnimatedStyle = (fn) => {
    return {};
  };

  return Reanimated;
});

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
