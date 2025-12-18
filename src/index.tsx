import { WheelPickerIndicator } from './WheelPickerIndicator';
import { WheelPickerItem } from './WheelPickerItem';
import { WheelPickerRoot } from './WheelPickerRoot';
import { WheelPickerViewport } from './WheelPickerViewport';

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
 * // Custom indicator style
 * <WheelPicker.Root data={hours} value={hour} onValueChange={setHour}>
 *   <WheelPicker.Indicator style={{ backgroundColor: 'rgba(0,0,255,0.1)' }} />
 *   <WheelPicker.Viewport />
 * </WheelPicker.Root>
 *
 * // Custom items with asChild
 * <WheelPicker.Root data={hours} value={hour} onValueChange={setHour}>
 *   <WheelPicker.Indicator />
 *   <WheelPicker.Viewport>
 *     {hours.map((h, index) => (
 *       <WheelPicker.Item key={h} value={h} index={index} asChild>
 *         <CustomText>{h}시</CustomText>
 *       </WheelPicker.Item>
 *     ))}
 *   </WheelPicker.Viewport>
 * </WheelPicker.Root>
 * ```
 */
export const WheelPicker = Object.assign(WheelPickerRoot, {
  Root: WheelPickerRoot,
  Viewport: WheelPickerViewport,
  Indicator: WheelPickerIndicator,
  Item: WheelPickerItem,
});

// Re-export individual components for direct import if needed
export { WheelPickerRoot } from './WheelPickerRoot';
export { WheelPickerViewport } from './WheelPickerViewport';
export { WheelPickerIndicator } from './WheelPickerIndicator';
export { WheelPickerItem } from './WheelPickerItem';

// Re-export types
export type {
  WheelPickerRootProps,
  WheelPickerViewportProps,
  WheelPickerIndicatorProps,
  WheelPickerItemProps,
} from './types';

// Re-export context hooks for advanced usage
export {
  useWheelPickerAnimation,
  useWheelPickerControl,
} from './context/WheelPickerContext';

// Re-export hooks
export { useWheelPickerReady } from './hooks/useWheelPickerReady';

// Re-export constants
export { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_ITEMS } from './constants';
