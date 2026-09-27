import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children: React.ReactNode;
  footer?: React.ReactNode;
  backgroundColor?: string;
  paddingHorizontal?: number;
}

export function OnboardingScreenLayout({
  children,
  footer,
  backgroundColor = '#FFFFFF',
  paddingHorizontal = 24,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { backgroundColor }]}>
      {/* Real device-specific top safe area gap */}
      <View style={{ height: Math.max(insets.top, 24) }} />
      <View style={[styles.content, { paddingHorizontal }]}>{children}</View>
      {footer && (
        <View style={[styles.footer, { paddingHorizontal, paddingBottom: Math.max(insets.bottom, 20) }]}>
          {footer}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingTop: 12,
  },
});
