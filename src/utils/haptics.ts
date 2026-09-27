import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export const safeHapticImpact = (
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light
) => {
  if (Platform.OS === 'web') return;
  try {
    Haptics.impactAsync(style).catch(() => {});
  } catch (e) {
    // web / emulator fallback
  }
};

export const safeHapticSelection = () => {
  if (Platform.OS === 'web') return;
  try {
    Haptics.selectionAsync().catch(() => {});
  } catch (e) {
    // web / emulator fallback
  }
};
