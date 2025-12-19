import { memo, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  type SharedValue,
  withDecay,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useWheelPickerControl } from '../context';
import { styles } from '../styles';
import type { WheelPickerViewportProps } from '../types';
import { AnimatedSlot } from '../utils';
import { WheelPickerItemInternal } from './WheelPickerItem';

// Animation configuration
const SPRING_CONFIG = {
  damping: 26,
  stiffness: 300,
  mass: 0.6,
};

const VELOCITY_THRESHOLD = 500;
const DECAY_DECELERATION = 0.992;

// ============================================================================
// Utility Functions (worklets)
// ============================================================================

const calculateScrollY = (
  centerY: number,
  index: number,
  itemHeight: number
): number => {
  'worklet';
  return centerY - index * itemHeight;
};

const calculateIndexFromScrollY = (
  centerY: number,
  scrollY: number,
  itemHeight: number
): number => {
  'worklet';
  return Math.round((centerY - scrollY) / itemHeight);
};

const normalizeIndex = (index: number, dataLength: number): number => {
  'worklet';
  return ((index % dataLength) + dataLength) % dataLength;
};

// ============================================================================
// GestureLayer - Memoized to prevent gesture recreation
// ============================================================================

interface GestureLayerProps {
  scrollY: SharedValue<number>;
  startY: SharedValue<number>;
  itemHeight: number;
  dataLength: number;
  centerY: number;
  otherScrollYs: SharedValue<number>[];
  onSnapComplete: (idx: number) => void;
}

const GestureLayer = memo(function GestureLayer({
  scrollY,
  startY,
  itemHeight,
  dataLength,
  centerY,
  otherScrollYs,
  onSnapComplete,
}: GestureLayerProps) {
  // Memoized gesture - only recreates when stable values change
  const panGesture = useMemo(() => {
    const getSnapTarget = (currentScrollY: number) => {
      'worklet';
      const rawIndex = calculateIndexFromScrollY(
        centerY,
        currentScrollY,
        itemHeight
      );
      const normalizedIndex = normalizeIndex(rawIndex, dataLength);
      return {
        scrollY: calculateScrollY(centerY, rawIndex, itemHeight),
        index: normalizedIndex,
      };
    };

    return Gesture.Pan()
      .onBegin(() => {
        // Runs on JS thread - cancel animations on other pickers
        for (const sv of otherScrollYs) {
          cancelAnimation(sv);
        }
      })
      .onStart(() => {
        'worklet';
        // Cancel any running animation on this picker
        cancelAnimation(scrollY);
        startY.value = scrollY.value;
      })
      .onUpdate((event) => {
        'worklet';
        scrollY.value = startY.value + event.translationY;
      })
      .onEnd((event) => {
        'worklet';
        const velocity = event.velocityY;

        if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
          scrollY.value = withDecay(
            { velocity, deceleration: DECAY_DECELERATION },
            () => {
              'worklet';
              const snap = getSnapTarget(scrollY.value);
              scrollY.value = withSpring(
                snap.scrollY,
                SPRING_CONFIG,
                (finished) => {
                  'worklet';
                  if (finished) {
                    scheduleOnRN(onSnapComplete, snap.index);
                  }
                }
              );
            }
          );
        } else {
          const snap = getSnapTarget(scrollY.value);
          scrollY.value = withSpring(
            snap.scrollY,
            SPRING_CONFIG,
            (finished) => {
              'worklet';
              if (finished) {
                scheduleOnRN(onSnapComplete, snap.index);
              }
            }
          );
        }
      });
  }, [
    scrollY,
    startY,
    itemHeight,
    dataLength,
    centerY,
    otherScrollYs,
    onSnapComplete,
  ]);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={StyleSheet.absoluteFill} collapsable={false} />
    </GestureDetector>
  );
});

// ============================================================================
// WheelPickerViewport
// ============================================================================

/**
 * Viewport component that handles gesture detection and scrolling.
 * Contains the scrollable area with items.
 */
export function WheelPickerViewport({
  style,
  children,
  asChild = false,
}: WheelPickerViewportProps) {
  const {
    data,
    onValueChange,
    itemHeight,
    dataLength,
    centerY,
    scrollY,
    startY,
    currentIdx,
    isReady,
    isInternalChangeRef,
    group,
  } = useWheelPickerControl();

  // Get other pickers' scrollY values from group context
  const otherScrollYs = useMemo(() => {
    return group ? group.getOthers(scrollY) : [];
  }, [group, scrollY]);

  // Callback for when snap animation completes
  const handleSnapComplete = useCallback(
    (idx: number) => {
      if (idx !== currentIdx.value) {
        currentIdx.value = idx;
        isInternalChangeRef.current = true;
        onValueChange(data[idx]!);
      }
    },
    [currentIdx, isInternalChangeRef, onValueChange, data]
  );

  // Render children if provided (custom items), otherwise auto-generate
  // All items are rendered - worklet early exit handles performance
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    // Generate all items - useAnimatedStyle early exit optimizes invisible items
    return data.map((item, index) => (
      <WheelPickerItemInternal key={index} index={index} label={item} />
    ));
  }, [children, data]);

  // Render content immediately, only delay gesture layer
  if (asChild) {
    return (
      <AnimatedSlot collapsable={false} style={style}>
        {content}
        {isReady && (
          <GestureLayer
            scrollY={scrollY}
            startY={startY}
            itemHeight={itemHeight}
            dataLength={dataLength}
            centerY={centerY}
            otherScrollYs={otherScrollYs}
            onSnapComplete={handleSnapComplete}
          />
        )}
      </AnimatedSlot>
    );
  }

  return (
    <Animated.View collapsable={false} style={[styles.gestureArea, style]}>
      {content}
      {isReady && (
        <GestureLayer
          scrollY={scrollY}
          startY={startY}
          itemHeight={itemHeight}
          dataLength={dataLength}
          centerY={centerY}
          otherScrollYs={otherScrollYs}
          onSnapComplete={handleSnapComplete}
        />
      )}
    </Animated.View>
  );
}

WheelPickerViewport.displayName = 'WheelPicker.Viewport';
