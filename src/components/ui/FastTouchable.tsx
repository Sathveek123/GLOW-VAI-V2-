import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { safeHapticImpact } from '../../utils/haptics';

export interface FastTouchableProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  haptic?: boolean;
  disabled?: boolean;
  activeScale?: number;
  hitSlop?: number | { top?: number; bottom?: number; left?: number; right?: number };
}

export const FastTouchable: React.FC<FastTouchableProps> = ({
  children,
  onPress,
  onLongPress,
  style,
  haptic = true,
  disabled = false,
  activeScale = 0.96,
  hitSlop = { top: 8, bottom: 8, left: 8, right: 8 },
}) => {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withTiming(activeScale, { duration: 60 });
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withTiming(1, { duration: 90 });
  };

  const handlePress = () => {
    if (disabled) return;
    if (haptic) {
      safeHapticImpact();
    }
    onPress?.();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={onLongPress}
      disabled={disabled}
      hitSlop={hitSlop}
    >
      <Animated.View style={[style, animStyle]}>{children}</Animated.View>
    </Pressable>
  );
};
