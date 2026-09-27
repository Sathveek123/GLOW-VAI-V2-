import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { Redirect } from 'expo-router';
import SplashScreen from '../src/features/onboarding/SplashScreen';

export default function AppEntryScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  if (isDesktop) {
    return <Redirect href="/(customer)/(tabs)" />;
  }

  return <SplashScreen />;
}




