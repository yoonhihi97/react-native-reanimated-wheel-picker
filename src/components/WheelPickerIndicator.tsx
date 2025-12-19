import { View, type ViewStyle } from 'react-native';

import { useWheelPickerAnimation } from '../context';
import { styles } from '../styles';
import type { WheelPickerIndicatorProps } from '../types';
import { Slot } from '../utils';

/**
 * Indicator component that shows the selection highlight area.
 * Can be fully customized with style prop or replaced with asChild.
 *
 * @example
 * ```tsx
 * // Default style
 * <WheelPicker.Indicator />
 *
 * // Custom style
 * <WheelPicker.Indicator style={{ backgroundColor: 'rgba(0,0,255,0.1)' }} />
 *
 * // Custom component with asChild
 * <WheelPicker.Indicator asChild>
 *   <CustomIndicator />
 * </WheelPicker.Indicator>
 * ```
 */
export function WheelPickerIndicator({
  style,
  asChild = false,
  children,
}: WheelPickerIndicatorProps) {
  const { centerY, itemHeight } = useWheelPickerAnimation();

  const indicatorStyle: ViewStyle = {
    position: 'absolute',
    left: 4,
    right: 4,
    top: centerY,
    height: itemHeight,
  };

  if (asChild) {
    return (
      <Slot style={[indicatorStyle, style]} pointerEvents="none">
        {children}
      </Slot>
    );
  }

  return (
    <View
      style={[styles.indicator, indicatorStyle, style]}
      pointerEvents="none"
    />
  );
}

WheelPickerIndicator.displayName = 'WheelPicker.Indicator';
