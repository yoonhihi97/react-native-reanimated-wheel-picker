import {
  WheelPickerGroup,
  WheelPickerIndicator,
  WheelPickerItem,
  WheelPickerRoot,
  WheelPickerViewport,
} from './components';

/**
 * WheelPicker compound component for building customizable wheel picker UIs.
 * Follows the Radix/shadcn compound component pattern with asChild support.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <WheelPicker.Root data={hours} value={hour} onValueChange={setHour}>
 *   <WheelPicker.Indicator />
 *   <WheelPicker.Viewport />
 * </WheelPicker.Root>
 *
 * // Multiple pickers with Group (for better performance)
 * <WheelPicker.Group>
 *   <WheelPicker.Root data={hours} value={hour} onValueChange={setHour}>
 *     <WheelPicker.Viewport />
 *   </WheelPicker.Root>
 *   <WheelPicker.Root data={minutes} value={minute} onValueChange={setMinute}>
 *     <WheelPicker.Viewport />
 *   </WheelPicker.Root>
 * </WheelPicker.Group>
 * ```
 */
export const WheelPicker = Object.assign(WheelPickerRoot, {
  Root: WheelPickerRoot,
  Group: WheelPickerGroup,
  Viewport: WheelPickerViewport,
  Indicator: WheelPickerIndicator,
  Item: WheelPickerItem,
});

// Re-export individual components for direct import if needed
export {
  WheelPickerGroup,
  WheelPickerIndicator,
  WheelPickerItem,
  WheelPickerRoot,
  WheelPickerViewport,
} from './components';

// Re-export types
export type {
  WheelPickerRootProps,
  WheelPickerViewportProps,
  WheelPickerIndicatorProps,
  WheelPickerItemProps,
} from './types';

// Re-export context hooks for advanced usage
export { useWheelPickerAnimation, useWheelPickerControl } from './context';

// Re-export hooks
export { useWheelPickerReady } from './hooks';

// Re-export constants
export { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_ITEMS } from './constants';
