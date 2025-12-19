import { memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import {
  cancelAnimation,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_ITEMS } from '../constants';
import {
  useWheelPickerGroup,
  WheelPickerAnimationContext,
  type WheelPickerAnimationContextValue,
  WheelPickerControlContext,
  type WheelPickerControlContextValue,
} from '../context';
import { useWheelPickerReady } from '../hooks';
import { styles } from '../styles';
import type { WheelPickerRootProps } from '../types';

// ============================================================================
// Utility Functions
// ============================================================================

const findIndexInData = (data: string[], value: string): number => {
  const idx = data.findIndex((item) => item === value);
  return idx === -1 ? 0 : idx;
};

const calculateScrollY = (
  centerY: number,
  index: number,
  itemHeight: number
): number => {
  return centerY - index * itemHeight;
};

const SPRING_CONFIG = {
  damping: 26,
  stiffness: 300,
  mass: 0.6,
};

/**
 * Root component for WheelPicker compound pattern.
 * Provides context and manages shared state for child components.
 */
function WheelPickerRootInner({
  data,
  value,
  onValueChange,
  itemHeight = DEFAULT_ITEM_HEIGHT,
  visibleItems = DEFAULT_VISIBLE_ITEMS,
  style,
  children,
}: WheelPickerRootProps) {
  const isReady = useWheelPickerReady();
  const group = useWheelPickerGroup();

  // Derived measurements
  const dataLength = data.length;
  const containerHeight = itemHeight * visibleItems;
  const centerY = containerHeight / 2 - itemHeight / 2;
  const cycleHeight = dataLength * itemHeight;

  // Calculate initial scroll position (only once on mount)
  const initialIndexRef = useRef<number | null>(null);
  if (initialIndexRef.current === null) {
    const idx = data.findIndex((item) => item === value);
    initialIndexRef.current = idx === -1 ? 0 : idx;
  }

  // Shared values for animation
  const initialScrollY = calculateScrollY(
    centerY,
    initialIndexRef.current,
    itemHeight
  );
  const scrollY = useSharedValue(initialScrollY);
  const startY = useSharedValue(initialScrollY);
  const currentIdx = useSharedValue(initialIndexRef.current);

  // Register with group context for cross-picker animation cancellation
  useEffect(() => {
    if (group) {
      group.register(scrollY);
      return () => group.unregister(scrollY);
    }
    return undefined;
  }, [group, scrollY]);

  // Track internal vs external value changes
  const isInternalChangeRef = useRef(false);
  const isFirstMount = useRef(true);

  // Sync scroll position with value prop (for external changes)
  useLayoutEffect(() => {
    const targetIndex = findIndexInData(data, value);
    const targetScrollY = calculateScrollY(centerY, targetIndex, itemHeight);

    if (isFirstMount.current) {
      isFirstMount.current = false;
      scrollY.value = targetScrollY;
      startY.value = targetScrollY;
      currentIdx.value = targetIndex;
    } else if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
    } else {
      // Cancel any running animation before starting new one
      cancelAnimation(scrollY);
      scrollY.value = withSpring(targetScrollY, SPRING_CONFIG);
      currentIdx.value = targetIndex;
    }
  }, [value, data, itemHeight, centerY, scrollY, startY, currentIdx]);

  // Animation context - stable, only changes when layout props change
  // Items subscribe to this - won't re-render when value changes
  const animationContext = useMemo<WheelPickerAnimationContextValue>(
    () => ({
      scrollY,
      itemHeight,
      centerY,
      cycleHeight,
      containerHeight,
    }),
    [scrollY, itemHeight, centerY, cycleHeight, containerHeight]
  );

  // Control context - changes when data/callbacks change
  // Only Viewport subscribes to this
  const controlContext = useMemo<WheelPickerControlContextValue>(
    () => ({
      data,
      onValueChange,
      dataLength,
      scrollY,
      startY,
      currentIdx,
      isInternalChangeRef,
      itemHeight,
      centerY,
      visibleItems,
      isReady,
      group,
    }),
    [
      data,
      onValueChange,
      dataLength,
      scrollY,
      startY,
      currentIdx,
      isInternalChangeRef,
      itemHeight,
      centerY,
      visibleItems,
      isReady,
      group,
    ]
  );

  return (
    <WheelPickerAnimationContext.Provider value={animationContext}>
      <WheelPickerControlContext.Provider value={controlContext}>
        <View
          style={[styles.rootContainer, { height: containerHeight }, style]}
        >
          {children}
        </View>
      </WheelPickerControlContext.Provider>
    </WheelPickerAnimationContext.Provider>
  );
}

// Memo to prevent re-render when sibling picker's value changes
export const WheelPickerRoot = memo(WheelPickerRootInner);
WheelPickerRoot.displayName = 'WheelPicker.Root';
