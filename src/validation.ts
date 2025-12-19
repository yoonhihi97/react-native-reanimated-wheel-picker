const isDev = process.env.NODE_ENV !== 'production';

/**
 * Validates that data array is not empty.
 * Returns false if invalid (component should return null).
 */
export function validateData(data: string[]): boolean {
  if (!data || data.length === 0) {
    if (isDev) {
      console.warn(
        '[WheelPicker] data prop is empty. WheelPicker will not render.'
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
  if (!data.includes(value)) {
    if (isDev) {
      console.warn(
        `[WheelPicker] value "${value}" not found in data. Defaulting to first item.`
      );
    }
  }
}

/**
 * Validates visibleItems is an odd number >= 1.
 * Returns corrected value if invalid.
 */
export function validateVisibleItems(visibleItems: number): number {
  if (visibleItems < 1) {
    if (isDev) {
      console.warn(
        `[WheelPicker] visibleItems must be at least 1. Received: ${visibleItems}. Defaulting to 5.`
      );
    }
    return 5;
  }

  if (visibleItems % 2 === 0) {
    const corrected = visibleItems + 1;
    if (isDev) {
      console.warn(
        `[WheelPicker] visibleItems must be odd for center alignment. Received: ${visibleItems}. Using: ${corrected}.`
      );
    }
    return corrected;
  }

  return visibleItems;
}

/**
 * Validates itemHeight is a positive number.
 * Returns corrected value if invalid.
 */
export function validateItemHeight(itemHeight: number): number {
  if (itemHeight <= 0) {
    if (isDev) {
      console.warn(
        `[WheelPicker] itemHeight must be positive. Received: ${itemHeight}. Defaulting to 40.`
      );
    }
    return 40;
  }
  return itemHeight;
}
