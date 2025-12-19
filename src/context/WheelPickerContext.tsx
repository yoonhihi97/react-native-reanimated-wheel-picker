import { createContext, useContext } from 'react';
import type { MutableRefObject } from 'react';
import type { SharedValue } from 'react-native-reanimated';

import type { WheelPickerGroupContextValue } from './WheelPickerGroupContext';

/**
 * Animation context - contains SharedValues that don't trigger re-renders
 * Used by WheelPickerItem for animations
 */
export interface WheelPickerAnimationContextValue {
  scrollY: SharedValue<number>;
  itemHeight: number;
  centerY: number;
  cycleHeight: number;
  containerHeight: number;
}

/**
 * Control context - contains values needed for gesture handling
 * Used by WheelPickerViewport
 */
export interface WheelPickerControlContextValue {
  data: string[];
  onValueChange: (value: string) => void;
  dataLength: number;
  scrollY: SharedValue<number>;
  startY: SharedValue<number>;
  currentIdx: SharedValue<number>;
  isInternalChangeRef: MutableRefObject<boolean>;
  itemHeight: number;
  centerY: number;
  visibleItems: number;
  isReady: boolean;
  group: WheelPickerGroupContextValue | null;
}

export const WheelPickerAnimationContext =
  createContext<WheelPickerAnimationContextValue | null>(null);
export const WheelPickerControlContext =
  createContext<WheelPickerControlContextValue | null>(null);

/**
 * Hook for Item components - only subscribes to animation context
 * Does NOT re-render when value changes
 */
export function useWheelPickerAnimation(): WheelPickerAnimationContextValue {
  const context = useContext(WheelPickerAnimationContext);
  if (!context) {
    throw new Error('WheelPicker.Item must be used within WheelPicker.Root');
  }
  return context;
}

/**
 * Hook for Viewport/Indicator - subscribes to control context
 */
export function useWheelPickerControl(): WheelPickerControlContextValue {
  const context = useContext(WheelPickerControlContext);
  if (!context) {
    throw new Error(
      'WheelPicker components must be used within WheelPicker.Root'
    );
  }
  return context;
}

WheelPickerAnimationContext.displayName = 'WheelPickerAnimationContext';
WheelPickerControlContext.displayName = 'WheelPickerControlContext';
