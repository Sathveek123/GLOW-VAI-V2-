import { Stack } from 'expo-router';
import React from 'react';

export default function VendorLayout() {
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
