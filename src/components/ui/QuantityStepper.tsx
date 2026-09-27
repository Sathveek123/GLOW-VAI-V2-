import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { safeHapticImpact } from '../../utils/haptics';

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function QuantityStepper({ quantity, onIncrement, onDecrement }: QuantityStepperProps) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const bump = () => {
    safeHapticImpact();
    scale.value = withSpring(1.08, { damping: 6 }, () => {
      scale.value = withSpring(1, { damping: 8 });
    });
  };

  return (
    <Animated.View style={[styles.container, style]}>
      <Pressable
        style={styles.btn}
        onPress={() => {
          bump();
          onDecrement();
        }}
      >
        <Text style={styles.btnText}>−</Text>
      </Pressable>
      <Text style={styles.count}>{quantity}</Text>
      <Pressable
        style={styles.btn}
        onPress={() => {
          bump();
          onIncrement();
        }}
      >
        <Text style={styles.btnText}>+</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D9D5F', // Colors.shop.cartGreen
    borderRadius: 18,
    height: 32,
    paddingHorizontal: 4,
  },
  btn: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 18,
  },
  count: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    minWidth: 18,
    textAlign: 'center',
  },
});
