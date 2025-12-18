import type { ViewStyle, TextStyle } from 'react-native';

/**
 * Props for WheelPicker.Root component
 */
export interface WheelPickerRootProps {
  /** Array of string values to display */
  data: string[];
  /** Currently selected value */
  value: string;
  /** Callback when value changes */
  onValueChange: (value: string) => void;
  /** Height of each item in pixels */
  itemHeight?: number;
  /** Number of visible items (must be odd for center alignment) */
  visibleItems?: number;
  /** Custom container style */
  style?: ViewStyle;
  /** Children components (Indicator, Viewport, etc.) */
  children: React.ReactNode;
}

/**
 * Props for WheelPicker.Viewport component
 */
export interface WheelPickerViewportProps {
  /** Custom style for the gesture area */
  style?: ViewStyle;
  /** Custom children (for custom Item rendering) */
  children?: React.ReactNode;
  /** Render as child element instead of wrapper */
  asChild?: boolean;
}

/**
 * Props for WheelPicker.Indicator component
 */
export interface WheelPickerIndicatorProps {
  /** Custom style for the indicator */
  style?: ViewStyle;
  /** Render as child element instead of wrapper */
  asChild?: boolean;
  /** Children to render inside indicator */
  children?: React.ReactNode;
}

/**
 * Props for WheelPicker.Item component
 */
export interface WheelPickerItemProps {
  /** Value of this item (must match one in data array) */
  value: string;
  /** Optional explicit index (auto-calculated from value if not provided) */
  index?: number;
  /** Render as child element instead of wrapper */
  asChild?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom text style (only applies when asChild is false) */
  textStyle?: TextStyle;
  /** Children to render (text content or custom component with asChild) */
  children?: React.ReactNode;
}

/**
 * Internal props for auto-generated items
 */
export interface WheelPickerItemInternalProps {
  index: number;
  label: string;
}
