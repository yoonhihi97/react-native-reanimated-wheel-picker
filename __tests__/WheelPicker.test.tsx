import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { WheelPicker } from '../src';
import { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_ITEMS } from '../src/constants';

describe('WheelPicker', () => {
  const mockData = ['00', '01', '02', '03', '04'];
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('WheelPicker.Root', () => {
    it('renders without crashing', () => {
      render(
        <WheelPicker.Root
          data={mockData}
          value="02"
          onValueChange={mockOnValueChange}
        >
          <WheelPicker.Indicator />
          <WheelPicker.Viewport />
        </WheelPicker.Root>
      );

      // Should render all items
      expect(screen.getByText('00')).toBeTruthy();
      expect(screen.getByText('02')).toBeTruthy();
    });

    it('renders with custom itemHeight and visibleItems', () => {
      const { toJSON } = render(
        <WheelPicker.Root
          data={mockData}
          value="00"
          onValueChange={mockOnValueChange}
          itemHeight={50}
          visibleItems={3}
        >
          <WheelPicker.Viewport />
        </WheelPicker.Root>
      );

      expect(toJSON()).toBeTruthy();
    });

    it('renders children correctly', () => {
      render(
        <WheelPicker.Root
          data={mockData}
          value="00"
          onValueChange={mockOnValueChange}
        >
          <Text testID="custom-child">Custom Child</Text>
        </WheelPicker.Root>
      );

      expect(screen.getByTestId('custom-child')).toBeTruthy();
    });
  });

  describe('WheelPicker.Indicator', () => {
    it('renders indicator with default style', () => {
      const { toJSON } = render(
        <WheelPicker.Root
          data={mockData}
          value="00"
          onValueChange={mockOnValueChange}
        >
          <WheelPicker.Indicator />
          <WheelPicker.Viewport />
        </WheelPicker.Root>
      );

      expect(toJSON()).toBeTruthy();
    });

    it('renders indicator with custom style', () => {
      const customStyle = { backgroundColor: 'red' };

      const { toJSON } = render(
        <WheelPicker.Root
          data={mockData}
          value="00"
          onValueChange={mockOnValueChange}
        >
          <WheelPicker.Indicator style={customStyle} />
          <WheelPicker.Viewport />
        </WheelPicker.Root>
      );

      expect(toJSON()).toBeTruthy();
    });
  });

  describe('WheelPicker.Viewport', () => {
    it('auto-generates items from data', () => {
      render(
        <WheelPicker.Root
          data={mockData}
          value="00"
          onValueChange={mockOnValueChange}
        >
          <WheelPicker.Viewport />
        </WheelPicker.Root>
      );

      mockData.forEach((item) => {
        expect(screen.getByText(item)).toBeTruthy();
      });
    });
  });

  describe('constants', () => {
    it('exports default values', () => {
      expect(DEFAULT_ITEM_HEIGHT).toBe(40);
      expect(DEFAULT_VISIBLE_ITEMS).toBe(5);
    });
  });
});
