# react-native-reanimated-wheel-picker

A performant, customizable wheel picker for React Native using Reanimated and Gesture Handler. Built with compound component pattern (Radix/shadcn style) for maximum flexibility.

## Features

- **60fps animations** - Powered by React Native Reanimated
- **Smooth gestures** - Built on Gesture Handler for native-like feel
- **Infinite scroll** - Seamless looping through items
- **Compound components** - Flexible composition with Root, Viewport, Indicator, Item
- **`asChild` pattern** - Replace default components with your own
- **Customizable** - Style indicator, items, and animations
- **TypeScript** - Full type support

## Installation

```bash
npm install react-native-reanimated-wheel-picker
# or
yarn add react-native-reanimated-wheel-picker
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install react-native-reanimated react-native-gesture-handler
```

Make sure to follow the installation instructions for:
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)
- [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation)

## Quick Start

```tsx
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WheelPicker } from 'react-native-reanimated-wheel-picker';

const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, '0')
);

export default function App() {
  const [hour, setHour] = useState('09');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WheelPicker.Root
        data={hours}
        value={hour}
        onValueChange={setHour}
      >
        <WheelPicker.Indicator />
        <WheelPicker.Viewport />
      </WheelPicker.Root>
    </GestureHandlerRootView>
  );
}
```

## API Reference

### WheelPicker.Root

The root component that provides context and manages state.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `string[]` | **required** | Array of values to display |
| `value` | `string` | **required** | Currently selected value |
| `onValueChange` | `(value: string) => void` | **required** | Callback when value changes |
| `itemHeight` | `number` | `40` | Height of each item in pixels |
| `visibleItems` | `number` | `5` | Number of visible items (should be odd) |
| `style` | `ViewStyle` | - | Container style |
| `children` | `ReactNode` | **required** | Indicator and Viewport components |

### WheelPicker.Viewport

The scrollable area containing the items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `style` | `ViewStyle` | - | Custom style for the gesture area |
| `children` | `ReactNode` | - | Custom Item components (auto-generated if not provided) |
| `asChild` | `boolean` | `false` | Merge props onto child element |

### WheelPicker.Indicator

The selection highlight area.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `style` | `ViewStyle` | - | Custom indicator style |
| `asChild` | `boolean` | `false` | Replace with custom component |
| `children` | `ReactNode` | - | Custom indicator content |

### WheelPicker.Item

Custom item component (use when you need custom rendering).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Item value |
| `index` | `number` | - | Item index (required for custom items) |
| `style` | `ViewStyle` | - | Container style |
| `textStyle` | `TextStyle` | - | Text style |
| `asChild` | `boolean` | `false` | Merge props onto child |
| `children` | `ReactNode` | - | Custom content |

## Examples

### Time Picker

```tsx
import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WheelPicker } from 'react-native-reanimated-wheel-picker';

const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, '0')
);
const minutes = Array.from({ length: 12 }, (_, i) =>
  (i * 5).toString().padStart(2, '0')
);

function TimePicker() {
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');

  return (
    <View style={styles.container}>
      <WheelPicker.Root
        data={hours}
        value={hour}
        onValueChange={setHour}
        style={styles.picker}
      >
        <WheelPicker.Indicator />
        <WheelPicker.Viewport />
      </WheelPicker.Root>

      <Text style={styles.colon}>:</Text>

      <WheelPicker.Root
        data={minutes}
        value={minute}
        onValueChange={setMinute}
        style={styles.picker}
      >
        <WheelPicker.Indicator />
        <WheelPicker.Viewport />
      </WheelPicker.Root>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    width: 60,
  },
  colon: {
    fontSize: 24,
    marginHorizontal: 8,
  },
});
```

### Custom Indicator Style

```tsx
<WheelPicker.Root data={data} value={value} onValueChange={setValue}>
  <WheelPicker.Indicator
    style={{
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
      borderRadius: 12,
      left: 0,
      right: 0,
    }}
  />
  <WheelPicker.Viewport />
</WheelPicker.Root>
```

### Custom Items with asChild

```tsx
<WheelPicker.Root data={data} value={value} onValueChange={setValue}>
  <WheelPicker.Indicator />
  <WheelPicker.Viewport>
    {data.map((item, index) => (
      <WheelPicker.Item key={item} value={item} index={index} asChild>
        <Animated.View style={styles.customItem}>
          <Text style={styles.customText}>{item}시</Text>
        </Animated.View>
      </WheelPicker.Item>
    ))}
  </WheelPicker.Viewport>
</WheelPicker.Root>
```

## Performance Tips

1. **Wrap your app** with `GestureHandlerRootView` at the root level
2. **Use memo** for parent components to prevent unnecessary re-renders
3. **Stable callbacks** - Use `useCallback` for `onValueChange`
4. The library uses **context splitting** internally to minimize re-renders

## Advanced Usage

### Accessing Context Hooks

For advanced customization, you can access the internal context:

```tsx
import {
  useWheelPickerAnimation,
  useWheelPickerControl
} from 'react-native-reanimated-wheel-picker';

function CustomItem() {
  const { scrollY, itemHeight, centerY } = useWheelPickerAnimation();
  // Use scrollY SharedValue for custom animations
}
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
