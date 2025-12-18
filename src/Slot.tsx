import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  View,
  Text,
  Pressable,
  type ViewProps,
  type TextProps,
  type PressableProps,
} from 'react-native';
import Animated from 'react-native-reanimated';

type AnyProps = Record<string, unknown>;

/**
 * Merges props from parent and child, with child props taking precedence.
 * Handles special cases like style arrays and event handler composition.
 */
function mergeProps(parentProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...parentProps };

  for (const key in childProps) {
    const parentValue = parentProps[key];
    const childValue = childProps[key];

    // Merge styles as array
    if (key === 'style') {
      merged[key] = [parentValue, childValue].filter(Boolean);
    }
    // Compose event handlers
    else if (
      typeof parentValue === 'function' &&
      typeof childValue === 'function' &&
      key.startsWith('on')
    ) {
      merged[key] = (...args: unknown[]) => {
        (childValue as (...args: unknown[]) => void)(...args);
        (parentValue as (...args: unknown[]) => void)(...args);
      };
    }
    // Child value takes precedence
    else if (childValue !== undefined) {
      merged[key] = childValue;
    }
  }

  return merged;
}

/**
 * Slot component for implementing the asChild pattern.
 * When asChild is true, merges props onto the child element instead of wrapping.
 */
export interface SlotProps extends ViewProps {
  children?: ReactNode;
}

export const Slot = forwardRef(function Slot(
  { children, ...props }: SlotProps,
  ref: Ref<View>
) {
  const childArray = Children.toArray(children);
  const child = childArray[0];

  if (isValidElement(child)) {
    const mergedProps = mergeProps(props as AnyProps, child.props as AnyProps);
    return cloneElement(child, {
      ...mergedProps,
      ref,
    } as AnyProps);
  }

  return (
    <View ref={ref as any} {...props}>
      {children}
    </View>
  );
});

Slot.displayName = 'Slot';

/**
 * AnimatedSlot for use with Animated.View children
 */
export interface AnimatedSlotProps {
  children?: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any; // Accept animated styles
  collapsable?: boolean;
}

export const AnimatedSlot = forwardRef(function AnimatedSlot(
  { children, ...props }: AnimatedSlotProps,
  ref: Ref<View>
) {
  const childArray = Children.toArray(children);
  const child = childArray[0];

  if (isValidElement(child)) {
    const mergedProps = mergeProps(props as AnyProps, child.props as AnyProps);
    return cloneElement(child, {
      ...mergedProps,
      ref,
    } as AnyProps);
  }

  return (
    <Animated.View ref={ref as any} {...(props as object)}>
      {children}
    </Animated.View>
  );
});

AnimatedSlot.displayName = 'AnimatedSlot';

/**
 * TextSlot for use with Text children
 */
export interface TextSlotProps extends TextProps {
  children?: ReactNode;
}

export const TextSlot = forwardRef(function TextSlot(
  { children, ...props }: TextSlotProps,
  ref: Ref<Text>
) {
  const childArray = Children.toArray(children);
  const child = childArray[0];

  if (isValidElement(child)) {
    const mergedProps = mergeProps(props as AnyProps, child.props as AnyProps);
    return cloneElement(child, {
      ...mergedProps,
      ref,
    } as AnyProps);
  }

  return (
    <Text ref={ref as any} {...props}>
      {children}
    </Text>
  );
});

TextSlot.displayName = 'TextSlot';

/**
 * PressableSlot for use with Pressable children
 */
export interface PressableSlotProps extends PressableProps {
  children?: ReactNode;
}

export const PressableSlot = forwardRef(function PressableSlot(
  { children, ...props }: PressableSlotProps,
  ref: Ref<View>
) {
  const childArray = Children.toArray(children);
  const child = childArray[0];

  if (isValidElement(child)) {
    const mergedProps = mergeProps(props as AnyProps, child.props as AnyProps);
    return cloneElement(child, {
      ...mergedProps,
      ref,
    } as AnyProps);
  }

  return (
    <Pressable ref={ref as any} {...props}>
      {children}
    </Pressable>
  );
});

PressableSlot.displayName = 'PressableSlot';
