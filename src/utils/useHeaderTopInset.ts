import { StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Custom hook to calculate a rock-solid, dynamic top header inset across iOS and Android.
 * Ensures mobile time, battery, signal icons, notch, and punch-hole cameras never overlap app header elements.
 */
export function useHeaderTopInset(extraPadding: number = 8): number {
  const insets = useSafeAreaInsets();
  const statusBarHeight = StatusBar.currentHeight || 0;

  // iOS top insets are typically 20-59px depending on notch/Dynamic Island.
  // Android top insets are 24-48px, but StatusBar.currentHeight is returned if translucent.
  const minInset = Platform.OS === 'ios' ? 44 : 24;
  const topInset = Math.max(insets.top || 0, statusBarHeight, minInset);

  return topInset + extraPadding;
}
