import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { Colors, Typography } from '../../design';
import { safeHapticImpact } from '../../utils/haptics';

const PILLARS = [
  {
    id: 'p1',
    emoji: '🔬',
    title: 'AI Skin Scan in Seconds',
    description: '8-point biometric analysis in under 3 seconds using clinical computer vision.',
  },
  {
    id: 'p2',
    emoji: '✅',
    title: '100% Authentic Formulations',
    description: 'Verified authentic products directly sourced from Minimalist, Derma Co & leading brands.',
  },
  {
    id: 'p3',
    emoji: '🎓',
    title: 'Student Referral Hub',
    description: 'Earn ₹50+ in GlowVAI coins per verified friend referral.',
  },
  {
    id: 'p4',
    emoji: '🛡️',
    title: 'Beauty Guarantee',
    description: 'Full refund guarantee if a recommended product does not suit your skin type.',
  },
];

export const PlatformIntroScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const handleContinueToLogin = async () => {
    await safeHapticImpact();
    router.push('/(auth)/login' as any);
  };

  const handleBack = async () => {
    await safeHapticImpact();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/welcome' as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Navigation */}
      <View style={[styles.headerRow, { paddingTop: headerTopInset }]}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={Colors.onboarding.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[Typography.displayLg, styles.screenTitle]}>Why GlowVAI?</Text>

        {/* 4 Stacked Pillar Cards */}
        <View style={styles.cardsStack}>
          {PILLARS.map((pillar) => (
            <View key={pillar.id} style={styles.pillarCard}>
              <Text style={styles.pillarEmoji}>{pillar.emoji}</Text>
              <View style={styles.pillarTextCol}>
                <Text style={[Typography.headingSm, styles.pillarTitle]}>{pillar.title}</Text>
                <Text style={[Typography.bodySm, styles.pillarDescription]}>{pillar.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Sticky CTA */}
      <View style={[styles.bottomFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinueToLogin}
          activeOpacity={0.85}
        >
          <Text style={[Typography.headingMd, styles.continueBtnText]}>Continue to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PlatformIntroScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.onboarding.background,
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.onboarding.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.onboarding.border,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
  },
  screenTitle: {
    color: Colors.onboarding.textPrimary,
    marginBottom: 20,
  },
  cardsStack: {
    gap: 12,
  },
  pillarCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.onboarding.surfaceSubtle,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.onboarding.border,
    gap: 14,
  },
  pillarEmoji: {
    fontSize: 28,
  },
  pillarTextCol: {
    flex: 1,
  },
  pillarTitle: {
    color: Colors.onboarding.textPrimary,
    marginBottom: 4,
  },
  pillarDescription: {
    color: Colors.onboarding.textSecondary,
    lineHeight: 18,
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.onboarding.background,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.onboarding.border,
  },
  continueBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.onboarding.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    color: '#FFFFFF',
  },
});
