import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '../../design';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  badge: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  perks: string[];
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    badge: 'AI SKIN DIAGNOSTICS',
    icon: 'sparkles-outline',
    title: 'Precision AI Face Scan in Seconds',
    subtitle:
      'Analyze acne, hydration, texture roughness, and dark spots with clinical-grade biometric computer vision.',
    perks: ['Multi-zone skin breakdown', 'Continuous barrier tracking', 'Clinical diagnostic report'],
  },
  {
    id: '2',
    badge: 'DERMATOLOGY SCIENCE',
    icon: 'flask-outline',
    title: 'Custom Ingredients Tailored to You',
    subtitle:
      'Zero guesswork. Get a targeted 4-step routine matched to your unique sebum and hydration metrics.',
    perks: ['Active ingredient recommendations', 'Skin sensitivity match', 'Expert routine timeline'],
  },
  {
    id: '3',
    badge: 'HYPERLOCAL QUICK-COMMERCE',
    icon: 'flash-outline',
    title: '10-Min Express Delivery to Your Door',
    subtitle:
      'Verified skincare products from trusted local beauty partners, packed in tamper-proof packaging.',
    perks: ['Live rider GPS tracking', 'Tamper-evident QR security', '10-minute doorstep guarantee'],
  },
];

export const OnboardingCarouselScreen: React.FC = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index !== currentIndex && index >= 0 && index < ONBOARDING_SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Row with Skip Button */}
      <View style={styles.topHeader}>
        <View style={styles.headerRow}>
          <Text style={[Typography.displayLg, styles.brandLogo]}>
            glowvai
          </Text>
          <TouchableOpacity
            onPress={handleFinish}
            style={styles.skipButton}
            activeOpacity={0.7}
            accessibilityLabel="Skip onboarding to login"
          >
            <Text style={[Typography.labelMd, styles.skipText]}>Skip</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.onboarding.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Slide Carousel */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slideItem}>
            {/* Visual Card Hero */}
            <View style={styles.artCard}>
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon} size={48} color={Colors.onboarding.primary} />
              </View>
              <View style={styles.badgePill}>
                <Text style={[Typography.labelSm, styles.badgeText]}>{item.badge}</Text>
              </View>
            </View>

            {/* Slide Content */}
            <View style={styles.textContent}>
              <Text style={[Typography.displayLg, styles.title]}>
                {item.title}
              </Text>
              <Text style={[Typography.bodyLg, styles.subtitle]}>{item.subtitle}</Text>

              {/* Perks List */}
              <View style={styles.perksContainer}>
                {item.perks.map((perk: string, pIdx: number) => (
                  <View key={pIdx} style={styles.perkRow}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.onboarding.primary} />
                    <Text style={[Typography.bodySm, styles.perkText]}>{perk}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      />

      {/* Bottom Footer: Pagination & Next Button */}
      <View style={styles.bottomFooter}>
        <View style={styles.footerRow}>
          {/* Pagination Indicators */}
          <View style={styles.paginationRow}>
            {ONBOARDING_SLIDES.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.paginationDot,
                  currentIndex === idx && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>

          {/* Action CTA Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={[Typography.headingMd, styles.nextBtnText]}>
              {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Continue'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingCarouselScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.onboarding.background,
  },
  topHeader: {
    paddingTop: 8,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  brandLogo: {
    color: Colors.onboarding.textPrimary,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.onboarding.surfaceSubtle,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.onboarding.border,
  },
  skipText: {
    color: Colors.onboarding.textSecondary,
    marginRight: 2,
  },
  slideItem: {
    width: width,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  artCard: {
    width: width - 48,
    height: height * 0.32,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: Colors.onboarding.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.onboarding.border,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.onboarding.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 71, 44, 0.2)',
  },
  badgePill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: Colors.onboarding.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.onboarding.border,
  },
  badgeText: {
    color: Colors.onboarding.primary,
  },
  textContent: {
    width: '100%',
    paddingVertical: 20,
  },
  title: {
    color: Colors.onboarding.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    color: Colors.onboarding.textSecondary,
    marginBottom: 18,
  },
  perksContainer: {
    gap: 8,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkText: {
    color: Colors.onboarding.textPrimary,
    fontFamily: 'Inter-Medium',
  },
  bottomFooter: {
    paddingBottom: 24,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.onboarding.border,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: Colors.onboarding.primary,
  },
  nextButton: {
    borderRadius: 14,
    backgroundColor: Colors.onboarding.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  nextBtnText: {
    color: '#FFFFFF',
  },
});
