import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { safeHapticImpact } from '../../utils/haptics';

interface Props {
  productId: string;
  onAdd: (productId: string) => Promise<void>; // real Firestore write / store sync
  style?: StyleProp<ViewStyle>;
  buttonText?: string;
  addedText?: string;
}

export function OptimisticCartButton({ productId, onAdd, style, buttonText = 'Add', addedText = '✓ Added' }: Props) {
  const [added, setAdded] = useState(false);
  const scale = useSharedValue(1);

  const handlePress = async () => {
    setAdded(true); // optimistic state update
    safeHapticImpact();

    scale.value = withSequence(
      withSpring(1.3, { damping: 6 }),
      withSpring(1, { damping: 8 })
    );

    try {
      await onAdd(productId); // TODO: wire to Firestore users/{uid}/cart/{itemId}
    } catch (err) {
      setAdded(false); // rollback on failure
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.btn, style, added && styles.btnAdded, animatedStyle]}>
        <Text style={[styles.text, added && styles.textAdded]}>{added ? addedText : buttonText}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#7A0C1F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAdded: {
    backgroundColor: '#059669',
  },
  text: { color: '#FFFDD0', fontWeight: '600', fontSize: 13 },
  textAdded: { color: '#FFFFFF' },
});
