import type { ReactNode } from 'react';
import { WheelPickerGroupContext, useWheelPickerGroupValue } from '../context';

export interface WheelPickerGroupProps {
  children: ReactNode;
}

/**
 * Optional wrapper for grouping multiple WheelPickers together.
 * When one picker is touched, animations on other pickers are cancelled.
 * This improves performance when switching between pickers rapidly.
 *
 * @example
 * ```tsx
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
export function WheelPickerGroup({ children }: WheelPickerGroupProps) {
  const groupValue = useWheelPickerGroupValue();

  return (
    <WheelPickerGroupContext.Provider value={groupValue}>
      {children}
    </WheelPickerGroupContext.Provider>
  );
}

WheelPickerGroup.displayName = 'WheelPicker.Group';
