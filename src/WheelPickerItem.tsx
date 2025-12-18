import { memo } from 'react';
import { Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { useWheelPickerAnimation } from './context/WheelPickerContext';
import { AnimatedSlot } from './Slot';
import { styles } from './styles';
import type {
  WheelPickerItemProps,
  WheelPickerItemInternalProps,
} from './types';

/**
 * Hook to create animated style for wheel picker items.
 * Uses Animation context only - won't re-render when value changes.
 * Optimized: uses direct math instead of interpolate() for 3D effects.
 */
function useItemAnimatedStyle(index: number) {
  const { scrollY, itemHeight, centerY, cycleHeight, containerHeight } =
    useWheelPickerAnimation();

  const baseY = index * itemHeight;
  const maxDistance = itemHeight * 2;

  return useAnimatedStyle(() => {
    'worklet';
    // Calculate position with scroll offset
    let y = baseY + scrollY.value;

    // Infinite loop using modulo
    y = ((y % cycleHeight) + cycleHeight) % cycleHeight;

    // Adjust for items beyond container
    if (y > containerHeight) {
      y -= cycleHeight;
    }

    // Calculate distance from center and direction
    const distance = Math.abs(y - centerY);

    // Normalized distance [0, 1] for interpolation
    const t = Math.min(distance / maxDistance, 1);

    // Direct math instead of interpolate() for better performance
    // opacity: 1 → 0.3 (fade out distant items)
    const opacity = 1 - t * 0.7;

    // scale: 1 → 0.8 (shrink distant items for depth effect)
    const scale = 1 - t * 0.2;

    return {
      transform: [{ translateY: y }, { scale }],
      opacity,
    };
  });
}

/**
 * Internal item component used by Viewport for auto-generation.
 * Uses Animation context only - optimized to not re-render on value changes.
 */
export const WheelPickerItemInternal = memo(function WheelPickerItemInternal({
  index,
  label,
}: WheelPickerItemInternalProps) {
  const { itemHeight } = useWheelPickerAnimation();
  const animatedStyle = useItemAnimatedStyle(index);

  return (
    <Animated.View
      collapsable={false}
      // @ts-expect-error - animated style array type complexity
      style={[styles.item, { height: itemHeight }, animatedStyle]}
    >
      <Text style={styles.itemText}>{label}</Text>
    </Animated.View>
  );
});

/**
 * Public Item component with asChild support.
 * Use this for custom item rendering.
 */
export function WheelPickerItem({
  value,
  index: indexProp,
  asChild = false,
  style,
  textStyle,
  children,
}: WheelPickerItemProps) {
  const { itemHeight } = useWheelPickerAnimation();
  const animatedStyle = useItemAnimatedStyle(indexProp ?? 0);

  if (asChild) {
    return (
      <AnimatedSlot
        collapsable={false}
        style={[{ height: itemHeight }, animatedStyle, style]}
      >
        {children}
      </AnimatedSlot>
    );
  }

  return (
    <Animated.View
      collapsable={false}
      style={[styles.item, { height: itemHeight }, animatedStyle, style]}
    >
      <Text style={[styles.itemText, textStyle]}>{children ?? value}</Text>
    </Animated.View>
  );
}

WheelPickerItem.displayName = 'WheelPicker.Item';
