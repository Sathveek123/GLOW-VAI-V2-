import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

interface Props {
  expiresAt: number; // epoch ms
  onExpire?: () => void;
  textStyle?: StyleProp<TextStyle>;
}

export function LiveCountdown({ expiresAt, onExpire, textStyle }: Props) {
  const [remaining, setRemaining] = useState(Math.max(0, expiresAt - Date.now()));
  const pulse = useSharedValue(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(0, expiresAt - Date.now());
      setRemaining(diff);
      if (diff === 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const isUrgent = remaining < 60000 && remaining > 0;

  useEffect(() => {
    if (isUrgent) {
      pulse.value = withRepeat(
        withSequence(withTiming(1.08, { duration: 400 }), withTiming(1, { duration: 400 })),
        -1,
        true
      );
    } else {
      pulse.value = 1;
    }
  }, [isUrgent, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);

  return (
    <Animated.Text
      style={[styles.text, textStyle, isUrgent && styles.urgent, animatedStyle]}
    >
      {`${mins}:${secs.toString().padStart(2, '0')}`}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: { fontWeight: '700', fontSize: 14, color: '#FFFDD0' },
  urgent: { color: '#FF4D4D' },
});
