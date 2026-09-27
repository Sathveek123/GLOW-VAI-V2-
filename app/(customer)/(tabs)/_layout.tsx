import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { GlowVaiBottomTabBar } from '../../../src/components/ui/GlowVaiBottomTabBar';

export default function CustomerTabsLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <Tabs
      initialRouteName="index"
      tabBar={(props) => (isDesktop ? null : <GlowVaiBottomTabBar {...props} />)}
      screenOptions={{
        headerShown: false,
        tabBarStyle: isDesktop ? { display: 'none' } : undefined,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="shop" options={{ title: 'Categories' }} />
      <Tabs.Screen name="scan" options={{ title: 'AI Scan' }} />
      <Tabs.Screen name="cart" options={{ title: 'Cart' }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}


