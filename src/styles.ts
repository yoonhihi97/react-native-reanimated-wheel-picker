import { StyleSheet } from 'react-native';

/**
 * Internal styles for WheelPicker components
 * Using StyleSheet for minimal dependencies
 */
export const styles = StyleSheet.create({
  // WheelPickerRoot
  rootContainer: {
    overflow: 'hidden',
  },

  // WheelPickerIndicator
  indicator: {
    backgroundColor: 'rgba(120, 120, 128, 0.12)',
    borderRadius: 8,
    zIndex: 0,
  },

  // WheelPickerViewport
  gestureArea: {
    flex: 1,
  },

  // WheelPickerItem
  item: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1C1C1E',
  },
});
