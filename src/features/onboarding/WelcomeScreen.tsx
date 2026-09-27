import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingScreenLayout } from '../../components/layout/OnboardingScreenLayout';
import { SafePagerView, SafePagerViewRef } from '../../components/ui/SafePagerView';
import { Colors, Typography } from '../../design';
import { safeHapticImpact } from '../../utils/haptics';
import { storage } from '../../utils/storage';
import { logTouch, logScreenMount } from '../../utils/touchDoctor';

const SLIDES = [
  {
    id: 'slide-1',
    lottie: require('../../../assets/lottie/ai-scan-sparkle.json'),
    iconName: 'sparkles-outline' as const,
    title: 'AI Skin Diagnostics in Seconds',
    body: 'Get personalized skincare routines and 8-point biometric diagnostics from a single selfie.',
  },
  {
    id: 'slide-2',
    lottie: require('../../../assets/lottie/delivery-scooter.json'),
    iconName: 'flash-outline' as const,
    title: '15-Min Express Delivery',
    body: 'Your skincare routine, delivered to your doorstep in Vijayawada faster than you can finish your coffee.',
  },
  {
    id: 'slide-3',
    lottie: require('../../../assets/lottie/routine-checklist.json'),
    iconName: 'heart-outline' as const,
    title: 'Derm-Backed Routines',
    body: 'Every recommendation is matched to real, verified formulations — no guesswork.',
  },
];

export const WelcomeScreen: React.FC = () => {
  const router = useRouter();
  const pagerRef = useRef<SafePagerViewRef>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchedRef = useRef(false);

  useEffect(() => {
    logScreenMount('WelcomeScreen');
  }, []);

  // Auto advance every 4s until user touches/swipes manually
  useEffect(() => {
    if (touchedRef.current) return;
    const interval = setInterval(() => {
      const next = (activeIndex + 1) % SLIDES.length;
      pagerRef.current?.setPage(next);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handlePageSelected = (e: any) => {
    setActiveIndex(e.nativeEvent.position);
  };

  const handleTouchStart = () => {
    touchedRef.current = true; // Permanently stop auto-advance on first swipe/touch
  };

  const handleGetStarted = () => {
    logTouch('Get Started Button', { screen: 'WelcomeScreen' });
    safeHapticImpact();
    router.push('/(auth)/onboarding' as any);
  };

  const handleExploreProducts = () => {
    logTouch('Explore Products Button', { screen: 'WelcomeScreen' });
    safeHapticImpact();
    storage.setItem('skipped_onboarding', 'true').catch(() => {});
    router.replace('/(customer)/(tabs)');
  };

  return (
    <OnboardingScreenLayout
      footer={
        <>
          <Pressable
            style={styles.primaryBtn}
            onPress={handleGetStarted}
          >
            <Text style={[Typography.headingMd, styles.primaryBtnText]}>Get Started</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={handleExploreProducts}
          >
            <Text style={[Typography.bodySm, styles.secondaryText]}>Explore Products</Text>
          </Pressable>
        </>
      }
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Swipeable PagerView */}
      <View style={styles.pagerContainer}>
        <SafePagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          onPageSelected={handlePageSelected}
          onTouchStart={handleTouchStart}
        >
          {SLIDES.map((slide) => (
            <View key={slide.id} style={styles.slide}>
              <View style={styles.lottieCard}>
                <LottieView
                  source={slide.lottie}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
                <View style={styles.iconFallbackOverlay}>
                  <Ionicons name={slide.iconName} size={48} color={Colors.onboarding.primary} />
                </View>
              </View>

              <Text style={[Typography.displayLg, styles.title]}>{slide.title}</Text>
              <Text style={[Typography.bodyLg, styles.body]}>{slide.body}</Text>
            </View>
          ))}
        </SafePagerView>
      </View>

      {/* Interactive Dot Indicator Row */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => {
              touchedRef.current = true;
              pagerRef.current?.setPage(i);
            }}
          >
            <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
          </Pressable>
        ))}
      </View>
    </OnboardingScreenLayout>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  pagerContainer: {
    height: 420,
    width: '100%',
  },
  pager: {
    width: '100%',
    height: 420,
  },
  slide: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  lottieCard: {
    width: '100%',
    height: 220,
    backgroundColor: '#FAF9F6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  lottie: {
    width: 160,
    height: 160,
  },
  iconFallbackOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EDEBE6',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#D4472C',
  },
  primaryBtn: {
    backgroundColor: '#D4472C',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  secondaryBtn: {
    paddingVertical: 4,
    alignItems: 'center',
  },
  secondaryText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#6B6B6B',
    textDecorationLine: 'underline',
  },
});
