import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { ShoppingBag, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCartStore } from '../../state/cartStore';

const Colors = { primary: '#1A73E8', white: '#FFFFFF' };

export function CompactCartPill() {
  // SINGLE SOURCE OF TRUTH
  const totalCount = useCartStore((s) => s.totalCount);
  const scale = useSharedValue(0);
  const countBounce = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(totalCount > 0 ? 1 : 0, { damping: 12, stiffness: 120 });
  }, [totalCount]);

  useEffect(() => {
    if (totalCount > 0) {
      countBounce.value = withSequence(
        withSpring(1.15, { damping: 6 }),
        withSpring(1, { damping: 8 })
      );
    }
  }, [totalCount]);

  const containerStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const countStyle = useAnimatedStyle(() => ({ transform: [{ scale: countBounce.value }] }));

  if (totalCount === 0) return null; // fully unmounts when count === 0

  return (
    <Animated.View style={[styles.pill, containerStyle]}>
      <Pressable
        style={styles.pillInner}
        onPress={() => router.push('/(customer)/(tabs)/cart')}
      >
        <ShoppingBag size={16} color={Colors.white} />
        <Animated.Text style={[styles.text, countStyle]}>
          {totalCount} item{totalCount > 1 ? 's' : ''}
        </Animated.Text>
        <ChevronRight size={14} color={Colors.white} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    bottom: 80, // above tab bar (64px) + margin
    alignSelf: 'center',
    zIndex: 50,
  },
  pillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 22,
    height: 44,
    paddingHorizontal: 16,
    gap: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  text: { color: '#FFF', fontFamily: 'Poppins-SemiBold', fontSize: 13 },
});

export default CompactCartPill;
