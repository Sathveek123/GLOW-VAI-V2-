import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography } from '../../design';
import { safeHapticImpact } from '../../utils/haptics';
import { getCurrentUser } from '../../services/authService';
import { storage } from '../../utils/storage';
import { syncUserOnboardingData } from '../../services/userSyncService';

export const OnboardingSuccessScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState<string>('');
  const [coinBalance, setCoinBalance] = useState<number>(0);

  // Animated progress dots opacity
  const progressAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    storage.setItem('glowvai_onboarding_completed', 'true');
    syncUserOnboardingData({ onboardingCompleted: true }).catch(() => {});

    const user = getCurrentUser();
    if (user?.displayName) {
      const firstName = user.displayName.split(' ')[0];
      setUserName(firstName || '');
    }

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      handleNavigateToHome();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigateToHome = async () => {
    await safeHapticImpact();
    router.replace('/(customer)/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.centerViewport}>
        {/* 96px Success Checkmark Badge */}
        <View style={styles.checkmarkBadge}>
          <Ionicons name="checkmark-circle" size={72} color={Colors.onboarding.success} />
        </View>

        {/* Personalized Headline */}
        <Text style={[Typography.displayLg, styles.headlineText]}>
          {userName ? `Welcome to GlowVAI, ${userName}!` : 'Welcome to GlowVAI!'}
        </Text>

        {/* Conditional Reward Teaser Pill */}
        {coinBalance > 0 && (
          <View style={styles.rewardPill}>
            <Text style={[Typography.labelSm, styles.rewardPillText]}>
              🎁 {coinBalance} Welcome Coins added to your wallet
            </Text>
          </View>
        )}

        <Text style={[Typography.bodyLg, styles.subtext]}>
          Your clinical skincare engine is ready. Explore formulations backed by computer vision diagnostics.
        </Text>
      </View>

      {/* Bottom Footer & Progress Bar */}
      <View style={[styles.bottomFooter, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={handleNavigateToHome}
          activeOpacity={0.85}
        >
          <Text style={[Typography.headingMd, styles.exploreBtnText]}>Explore Products</Text>
        </TouchableOpacity>

        {/* Visual Progress Bar (Fills over 2s) */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingSuccessScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.onboarding.background,
    justifyContent: 'space-between',
  },
  centerViewport: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  checkmarkBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.onboarding.successTint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(45, 157, 95, 0.2)',
    marginBottom: 24,
  },
  headlineText: {
    color: Colors.onboarding.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  rewardPill: {
    backgroundColor: Colors.onboarding.primaryTint,
    borderWidth: 1,
    borderColor: Colors.onboarding.borderFocus,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  rewardPillText: {
    color: Colors.onboarding.primary,
  },
  subtext: {
    color: Colors.onboarding.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
  },
  bottomFooter: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    gap: 16,
  },
  exploreBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.onboarding.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreBtnText: {
    color: '#FFFFFF',
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.onboarding.border,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.onboarding.primary,
    borderRadius: 2,
  },
});
