/* eslint-disable no-undef */
import '@testing-library/jest-native/extend-expect';

// Mock react-native-worklets (must be before reanimated import)
jest.mock('react-native-worklets', () => ({
  scheduleOnRN: (fn, ...args) => fn(...args),
  scheduleOnUI: jest.fn((fn) => fn),
  createSerializable: jest.fn((value) => value),
  useWorklet: jest.fn((fn) => fn),
  runOnRN: jest.fn((fn, ...args) => fn(...args)),
  isWorkletFunction: jest.fn(() => true),
  RuntimeKind: { UI: 'UI', RN: 'RN' },
  serializableMappingCache: new Map(),
  makeShareable: jest.fn((value) => value),
  makeShareableCloneRecursive: jest.fn((value) => value),
}));

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
