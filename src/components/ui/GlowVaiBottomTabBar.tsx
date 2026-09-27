import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { storage } from '../../utils/storage';
import { useCartStore } from '../../store/useCartStore';
import { Typography } from '../../design/typography';
import { safeHapticImpact } from '../../utils/haptics';
import { logTouch } from '../../utils/touchDoctor';

export function GlowVaiBottomTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const { totalCount: totalCartCount } = useCartStore();
  const { width } = useWindowDimensions();

  const activeRouteName = state.routes[state.index]?.name;

  // Hide bottom tab bar on PC / Desktop viewports (width >= 768) OR on the Cart screen
  // so the bottom Checkout CTA is never covered by the floating tab bar
  if (width >= 768 || activeRouteName === 'cart') {
    return null;
  }

  const handleLaunchFaceScan = async () => {
    logTouch('Center AI Scan FAB', { screen: activeRouteName, component: 'BottomTabBar' });
    await safeHapticImpact();
    try {
      const scanHistoryStr = await storage.getItem('@glowvai_scan_history');
      if (scanHistoryStr) {
        router.push('/(customer)/scan/report');
      } else {
        router.push('/(customer)/scan/camera');
      }
    } catch {
      router.push('/(customer)/scan/camera');
    }
  };

  const tabs = [
    {
      name: 'index',
      label: 'Home',
      iconActive: 'home' as const,
      iconInactive: 'home-outline' as const,
    },
    {
      name: 'shop',
      label: 'Categories',
      iconActive: 'grid' as const,
      iconInactive: 'grid-outline' as const,
    },
    {
      name: 'scan',
      label: 'AI Scan',
      isCenterFab: true,
    },
    {
      name: 'cart',
      label: 'Cart',
      iconActive: 'cart' as const,
      iconInactive: 'cart-outline' as const,
      badge: totalCartCount,
    },
    {
      name: 'profile',
      label: 'Profile',
      iconActive: 'person' as const,
      iconInactive: 'person-outline' as const,
    },
  ];

  return (
    <View style={styles.bottomNavWrapper} pointerEvents="box-none">
      <View style={styles.bottomNavBar}>
        {tabs.map((tab) => {
          if (tab.isCenterFab) {
            return (
              <TouchableOpacity
                key="center-scan-fab"
                style={styles.scanFabButton}
                onPress={handleLaunchFaceScan}
                activeOpacity={0.85}
                delayPressIn={0}
              >
                <LinearGradient
                  colors={['#7A0C1F', '#4A0006']}
                  style={styles.scanFabGradient}
                >
                  <MaterialCommunityIcons name="face-recognition" size={24} color="#FFFDD0" />
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          const isFocused = activeRouteName === tab.name;

          const onPress = () => {
            logTouch(`BottomTab "${tab.label}" Press`, { screen: tab.name, component: 'BottomTabBar' });
            safeHapticImpact();
            const event = navigation.emit({
              type: 'tabPress',
              target: tab.name,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.navItem}
              onPress={onPress}
              activeOpacity={0.7}
              delayPressIn={0}
              hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
            >
              <View>
                <Ionicons
                  name={isFocused ? tab.iconActive! : tab.iconInactive!}
                  size={20}
                  color={isFocused ? '#7A0C1F' : '#64748B'}
                />
                {!!tab.badge && tab.badge > 0 && (
                  <View style={styles.cartBadgeCount}>
                    <Text style={styles.cartBadgeCountText}>
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.navItemLabel,
                  isFocused && styles.navItemLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 12,
    left: 18,
    right: 18,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  bottomNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: 73,
    backgroundColor: '#FFFFFF',
    borderRadius: 38,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ECECEF',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
      },
      android: {
        elevation: 12,
      },
      web: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
      },
    }),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  navItemLabel: {
    ...Typography.bodySm,
    color: '#73777C',
    fontSize: 10,
    marginTop: 3,
  },
  navItemLabelActive: {
    ...Typography.labelSm,
    color: '#900D2F',
    fontWeight: '700',
    fontSize: 10,
  },
  scanFabButton: {
    top: -14,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#900D2F',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
      web: {
        shadowColor: '#900D2F',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
    }),
  },
  scanFabGradient: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cartBadgeCount: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#900D2F',
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cartBadgeCountText: {
    ...Typography.labelSm,
    color: '#FFFFFF',
    fontSize: 9,
    lineHeight: 11,
  },
});
