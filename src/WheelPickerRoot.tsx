import { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';

import { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_ITEMS } from './constants';
import {
  WheelPickerAnimationContext,
  type WheelPickerAnimationContextValue,
  WheelPickerControlContext,
  type WheelPickerControlContextValue,
} from './context/WheelPickerContext';
import { useWheelPickerReady } from './hooks/useWheelPickerReady';
import { styles } from './styles';
import type { WheelPickerRootProps } from './types';

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
      isReady,
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
      isReady,
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
