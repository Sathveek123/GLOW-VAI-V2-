import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as Location from 'expo-location';

import { syncUserOnboardingData } from '../src/services/userSyncService';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'MinniePlay-Bold': require('../assets/fonts/Bunch-Heavy.ttf'),
    'HelveticaNow-Regular': require('../assets/fonts/Bunch-Regular.ttf'),
    'HelveticaNow-Medium': require('../assets/fonts/Bunch-Medium.ttf'),
    'HelveticaNow-Bold': require('../assets/fonts/Bunch-Bold.ttf'),
    'Syne-Bold': require('../assets/fonts/Bunch-Bold.ttf'),
    'Manrope-Bold': require('../assets/fonts/Bunch-Bold.ttf'),
    'Manrope-SemiBold': require('../assets/fonts/Bunch-SemiBold.ttf'),
    'Manrope-Medium': require('../assets/fonts/Bunch-Medium.ttf'),
    'Inter-Regular': require('../assets/fonts/Bunch-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Bunch-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Bunch-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Bunch-Bold.ttf'),
  });

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'glowvai-web-outline-reset';
      if (!document.getElementById(styleId)) {
        const styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.innerHTML = `
          input, textarea, select, button {
            outline: none !important;
            box-shadow: none !important;
            border-width: 0px !important;
            border-style: none !important;
            border-color: transparent !important;
            background-color: transparent !important;
          }
          input:focus, textarea:focus, select:focus, button:focus {
            outline: none !important;
            box-shadow: none !important;
            border-width: 0px !important;
            border-style: none !important;
            border-color: transparent !important;
          }
        `;
        document.head.appendChild(styleEl);
      }
    }

    try {
      Location.requestForegroundPermissionsAsync()
        .then(perm => {
          syncUserOnboardingData({
            locationGranted: perm.status === 'granted',
          }).catch(() => null);
        })
        .catch(() => null);
    } catch {
      // safe fallback
    }
  }, []);

  const [fontTimeoutExpired, setFontTimeoutExpired] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFontTimeoutExpired(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Render app once fonts loaded, error occurred, or 1s timeout safety reached
  if (!fontsLoaded && !fontError && !fontTimeoutExpired) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 200,
              gestureEnabled: true,
              fullScreenGestureEnabled: true,
            }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(customer)" />
            <Stack.Screen name="(vendor)" />
            <Stack.Screen name="(admin)" />
          </Stack>
        </SafeAreaProvider>
      </ErrorBoundary>
    </View>
  );
}
