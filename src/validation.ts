import { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_ITEMS } from './constants';

const isDev = __DEV__;

/**
 * Validates that data array is not empty.
 * Returns false if empty (component should not render).
 */
export function validateData(data: string[]): boolean {
  if (!data || data.length === 0) {
    if (isDev) {
      console.warn(
        '[WheelPicker] data prop is empty. WheelPicker requires at least one item.'
      );
    }
    return false;
  }
  return true;
}

/**
 * Validates that value exists in data array.
 * Logs warning in DEV if not found.
 */
export function validateValue(data: string[], value: string): void {
  if (isDev && data.length > 0 && !data.includes(value)) {
    console.warn(
      `[WheelPicker] value "${value}" not found in data array. Falling back to first item "${data[0]}".`
    );
  }
}

/**
 * Validates and normalizes visibleItems to be an odd number.
 * Returns normalized value.
 */
export function validateVisibleItems(visibleItems: number): number {
  if (visibleItems <= 0) {
    if (isDev) {
      console.warn(
        `[WheelPicker] visibleItems must be positive. Using default value ${DEFAULT_VISIBLE_ITEMS}.`
      );
    }
    return DEFAULT_VISIBLE_ITEMS;
  }

  if (visibleItems % 2 === 0) {
    const adjusted = visibleItems + 1;
    if (isDev) {
      console.warn(
        `[WheelPicker] visibleItems should be odd for center alignment. Adjusting ${visibleItems} to ${adjusted}.`
      );
    }
    return adjusted;
  }

  return visibleItems;
}

/**
 * Validates itemHeight is positive.
 * Returns normalized value.
 */
export function validateItemHeight(itemHeight: number): number {
  if (itemHeight <= 0) {
    if (isDev) {
      console.warn(
        `[WheelPicker] itemHeight must be positive. Using default value ${DEFAULT_ITEM_HEIGHT}.`
      );
    }
    return DEFAULT_ITEM_HEIGHT;
  }
  return itemHeight;
}
