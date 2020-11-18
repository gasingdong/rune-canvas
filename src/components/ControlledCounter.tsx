import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface ControlledCounterProps {
  decrement: (event: GestureResponderEvent) => void;
  increment: (event: GestureResponderEvent) => void;
  value: number;
  title: string;
}

const styles = StyleSheet.create({
  controller: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  disabled: {
    opacity: 0.2,
  },
});

const ControlledCounter: React.FC<ControlledCounterProps> = (
  props: ControlledCounterProps
) => {
  const { decrement, increment, value, title } = props;

  return (
    <View>
      <Text>{title}</Text>
      <View style={styles.controller}>
        <TouchableOpacity disabled={value <= 0} onPress={decrement}>
          <AntDesign
            name="minuscircle"
            size={24}
            color="black"
            style={value <= 0 && styles.disabled}
          />
        </TouchableOpacity>
        <Text>{value}</Text>
        <TouchableOpacity disabled={value >= 99} onPress={increment}>
          <AntDesign
            name="pluscircle"
            size={24}
            color="black"
            style={value >= 99 && styles.disabled}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ControlledCounter;
