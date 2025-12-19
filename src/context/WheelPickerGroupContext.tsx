import { createContext, useContext, useRef } from 'react';
import type { SharedValue } from 'react-native-reanimated';

/**
 * Group context for managing multiple pickers together.
 * Used to cancel animations on other pickers when one is touched.
 */
export interface WheelPickerGroupContextValue {
  /** Register a picker's scrollY SharedValue */
  register: (scrollY: SharedValue<number>) => void;
  /** Unregister a picker's scrollY SharedValue */
  unregister: (scrollY: SharedValue<number>) => void;
  /** Get all registered scrollY SharedValues except the given one */
  getOthers: (scrollY: SharedValue<number>) => SharedValue<number>[];
}

export const WheelPickerGroupContext =
  createContext<WheelPickerGroupContextValue | null>(null);

/**
 * Hook to access group context (optional - returns null if not in a group)
 */
export function useWheelPickerGroup(): WheelPickerGroupContextValue | null {
  return useContext(WheelPickerGroupContext);
}

/**
 * Hook to create group context value
 */
export function useWheelPickerGroupValue(): WheelPickerGroupContextValue {
  const scrollYsRef = useRef<Set<SharedValue<number>>>(new Set());

  const register = (scrollY: SharedValue<number>) => {
    scrollYsRef.current.add(scrollY);
  };

  const unregister = (scrollY: SharedValue<number>) => {
    scrollYsRef.current.delete(scrollY);
  };

  const getOthers = (scrollY: SharedValue<number>) => {
    const others: SharedValue<number>[] = [];
    scrollYsRef.current.forEach((sv) => {
      if (sv !== scrollY) {
        others.push(sv);
      }
    });
    return others;
  };

  return { register, unregister, getOthers };
}

WheelPickerGroupContext.displayName = 'WheelPickerGroupContext';
