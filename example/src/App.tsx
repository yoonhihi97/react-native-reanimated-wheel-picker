import { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WheelPicker } from 'react-native-reanimated-wheel-picker';

const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, '0')
);
const minutes = Array.from({ length: 12 }, (_, i) =>
  (i * 5).toString().padStart(2, '0')
);

export default function App() {
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>WheelPicker Demo</Text>
      <Text style={styles.time}>
        {hour}:{minute}
      </Text>

      <WheelPicker.Group>
        <View style={styles.pickerContainer}>
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
      </WheelPicker.Group>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  time: {
    fontSize: 48,
    fontWeight: '300',
    marginBottom: 40,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  picker: {
    width: 80,
  },
  colon: {
    fontSize: 32,
    fontWeight: '500',
    marginHorizontal: 8,
  },
});
