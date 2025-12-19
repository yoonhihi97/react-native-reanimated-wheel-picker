import { memo } from 'react';
import { Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { useWheelPickerAnimation } from '../context';
import { styles } from '../styles';
import type {
  WheelPickerItemProps,
  WheelPickerItemInternalProps,
} from '../types';
import { AnimatedSlot } from '../utils';

/**
 * Hook to create animated style for wheel picker items.
 * Uses Animation context only - won't re-render when value changes.
 * Optimized: uses direct math instead of interpolate() for 3D effects.
 */
function useItemAnimatedStyle(index: number) {
  // Extract primitive values to avoid capturing entire context object in worklet
  const ctx = useWheelPickerAnimation();
  const scrollYSV = ctx.scrollY;
  const itemHeightVal = ctx.itemHeight;
  const centerYVal = ctx.centerY;
  const cycleHeightVal = ctx.cycleHeight;
  const containerHeightVal = ctx.containerHeight;

  // Pre-calculate constants outside worklet
  const baseY = index * itemHeightVal;
  const maxDistance = itemHeightVal * 2;

  return useAnimatedStyle(() => {
    'worklet';
    // Calculate position with scroll offset
    const rawY = baseY + scrollYSV.value;

    // Optimized modulo for infinite loop (single operation when possible)
    let y = rawY % cycleHeightVal;
    if (y < 0) y += cycleHeightVal;

    // Adjust for items beyond container
    if (y > containerHeightVal) {
      y -= cycleHeightVal;
    }

    // Early exit for items far outside visible area
    if (y < -itemHeightVal || y > containerHeightVal + itemHeightVal) {
      return {
        transform: [{ translateY: y }, { scale: 0.8 }],
        opacity: 0,
      };
    }

    // Calculate distance from center
    const distance = y - centerYVal;
    const absDistance = distance < 0 ? -distance : distance;

    // Normalized distance [0, 1] for interpolation
    const t = absDistance > maxDistance ? 1 : absDistance / maxDistance;

    // Direct math for opacity and scale
    // opacity: 1 → 0.3, scale: 1 → 0.8
    return {
      transform: [{ translateY: y }, { scale: 1 - t * 0.2 }],
      opacity: 1 - t * 0.7,
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
      testID={`wheel-picker-item-${label}`}
      collapsable={false}
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
  accessibilityLabel: accessibilityLabelProp,
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
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabelProp ?? value}
      collapsable={false}
      style={[styles.item, { height: itemHeight }, animatedStyle, style]}
    >
      <Text style={[styles.itemText, textStyle]}>{children ?? value}</Text>
    </Animated.View>
  );
}

WheelPickerItem.displayName = 'WheelPicker.Item';
