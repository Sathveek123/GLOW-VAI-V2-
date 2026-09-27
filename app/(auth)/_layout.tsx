import { Stack, Redirect } from 'expo-router';
import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';

export default function AuthLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  if (isDesktop) {
    return <Redirect href="/(customer)/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 200,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        contentStyle: {
          backgroundColor: '#090D16',
        },
      }}
    />
  );
}

