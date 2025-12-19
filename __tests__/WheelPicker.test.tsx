import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { WheelPicker } from '../src';
import { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_ITEMS } from '../src/constants';

describe('WheelPicker', () => {
  const mockData = ['00', '01', '02', '03', '04'];
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
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

      // Should render items (virtualization may render duplicates for infinite scroll)
      expect(screen.getAllByText('00').length).toBeGreaterThan(0);
      expect(screen.getAllByText('02').length).toBeGreaterThan(0);
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

      // Virtualization may render duplicates for infinite scroll
      mockData.forEach((item) => {
        expect(screen.getAllByText(item).length).toBeGreaterThan(0);
      });
    });
  });

  describe('constants', () => {
    it('exports default values', () => {
      expect(DEFAULT_ITEM_HEIGHT).toBe(40);
      expect(DEFAULT_VISIBLE_ITEMS).toBe(5);
    });
  });

  describe('Animation', () => {
    it('renders items with animated styles', () => {
      const { getByTestId } = render(
        <WheelPicker.Root
          data={mockData}
          value="02"
          onValueChange={mockOnValueChange}
        >
          <WheelPicker.Indicator />
          <WheelPicker.Viewport />
        </WheelPicker.Root>
      );

      // 선택된 아이템이 렌더링되는지 확인
      const selectedItem = getByTestId('wheel-picker-item-02');
      expect(selectedItem).toBeTruthy();

      // 애니메이션 스타일(transform, opacity)이 적용되는지 확인
      expect(selectedItem).toHaveAnimatedStyle({
        opacity: 1,
        transform: [{ translateY: 80 }, { scale: 1 }],
      });
    });

    it('applies correct opacity to selected item', () => {
      const { getByTestId } = render(
        <WheelPicker.Root
          data={mockData}
          value="02"
          onValueChange={mockOnValueChange}
        >
          <WheelPicker.Viewport />
        </WheelPicker.Root>
      );

      jest.advanceTimersByTime(300);

      const selectedItem = getByTestId('wheel-picker-item-02');
      // 중앙에 위치한 아이템은 opacity가 1에 가까워야 함
      expect(selectedItem).toHaveAnimatedStyle({
        opacity: 1,
      });
    });

    it('updates animation when value changes', () => {
      const { rerender, getByTestId } = render(
        <WheelPicker.Root
          data={mockData}
          value="00"
          onValueChange={mockOnValueChange}
        >
          <WheelPicker.Viewport />
        </WheelPicker.Root>
      );

      rerender(
        <WheelPicker.Root
          data={mockData}
          value="02"
          onValueChange={mockOnValueChange}
        >
          <WheelPicker.Viewport />
        </WheelPicker.Root>
      );

      // spring 애니메이션 완료 대기
      jest.advanceTimersByTime(500);

      const item = getByTestId('wheel-picker-item-02');
      expect(item).toHaveAnimatedStyle({
        opacity: 1,
      });
    });
  });
});
