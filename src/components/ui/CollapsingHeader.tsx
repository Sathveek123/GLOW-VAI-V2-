import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
  Extrapolation,
} from 'react-native-reanimated';

interface Props {
  scrollY: SharedValue<number>;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function CollapsingHeader({ scrollY, children, style }: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 100],
      [64, 44],
      Extrapolation.CLAMP
    );
    return { height };
  });

  return <Animated.View style={[styles.header, style, animatedStyle]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#7A0C1F',
    justifyContent: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
});
