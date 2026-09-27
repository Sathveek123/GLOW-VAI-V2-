import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../design';
import { storage } from '../../utils/storage';
import { getCurrentUser } from '../../services/authService';
import { logTouch, logScreenMount } from '../../utils/touchDoctor';

const { width } = Dimensions.get('window');

export const SplashScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    logScreenMount('SplashScreen');
  }, []);

  // ── Animations ──────────────────────────────────────────────────────────────
  const logoScale    = useRef(new Animated.Value(0.8)).current;
  const logoOpacity  = useRef(new Animated.Value(0)).current;
  const tagOpacity   = useRef(new Animated.Value(0)).current;
  const glowScale    = useRef(new Animated.Value(0.6)).current;
  const glowOpacity  = useRef(new Animated.Value(0)).current;
  const dot1Opacity  = useRef(new Animated.Value(0.25)).current;
  const dot2Opacity  = useRef(new Animated.Value(0.25)).current;
  const dot3Opacity  = useRef(new Animated.Value(0.25)).current;
  const lineWidth    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Glow blob expands behind logo
    Animated.parallel([
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(glowScale, {
        toValue: 1,
        damping: 14,
        stiffness: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Logo spring + fade in (80ms delay)
    Animated.sequence([
      Animated.delay(80),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          damping: 10,
          stiffness: 120,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3. Decorative line expands (400ms delay)
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(lineWidth, {
        toValue: 40,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();

    // 4. Tagline fades in (700ms delay)
    Animated.sequence([
      Animated.delay(700),
      Animated.timing(tagOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // 5. Dots loop
    const animateDots = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot1Opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
          Animated.timing(dot2Opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
          Animated.timing(dot3Opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
          Animated.parallel([
            Animated.timing(dot1Opacity, { toValue: 0.25, duration: 280, useNativeDriver: true }),
            Animated.timing(dot2Opacity, { toValue: 0.25, duration: 280, useNativeDriver: true }),
            Animated.timing(dot3Opacity, { toValue: 0.25, duration: 280, useNativeDriver: true }),
          ]),
        ])
      ).start();
    };
    animateDots();

    // 6. Auth check + 1400ms minimum display
    let targetDestination = '/(auth)/welcome';
    let isNavigated = false;
    let timerId: any = null;
    let failsafeId: any = null;

    const navigateTarget = (dest: string) => {
      if (isNavigated) return;
      isNavigated = true;
      if (timerId) clearTimeout(timerId);
      if (failsafeId) clearTimeout(failsafeId);
      router.replace(dest as any);
    };

    // Failsafe guarantee: Never freeze on splash screen for more than 1.5s
    failsafeId = setTimeout(() => {
      navigateTarget(targetDestination);
    }, 1500);

    const startTime = Date.now();
    const resolveRouting = async () => {
      const isDesktop = Dimensions.get('window').width >= 768;

      if (isDesktop) {
        targetDestination = '/(customer)/(tabs)';
      } else {
        try {
          const token = await storage.getItem('glowvai_auth_token');
          const user = getCurrentUser();
          if (token || user) {
            const onboardingDone = await storage.getItem('glowvai_onboarding_completed');
            targetDestination = onboardingDone === 'true'
              ? '/(customer)/(tabs)'
              : '/(auth)/profile-setup';
          }
        } catch {
          targetDestination = '/(auth)/welcome';
        }
      }
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, isDesktop ? 50 : 600 - elapsed);
      timerId = setTimeout(() => navigateTarget(targetDestination), delay);
    };

    resolveRouting();

    return () => {
      if (timerId) clearTimeout(timerId);
      if (failsafeId) clearTimeout(failsafeId);
    };
  }, []);

  const handleSkipSplash = () => {
    logTouch('SplashScreen Tap-to-Skip', { screen: 'SplashScreen' });
    router.replace('/(auth)/welcome' as any);
  };

  return (
    <TouchableOpacity
      style={styles.root}
      activeOpacity={1}
      onPress={handleSkipSplash}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Clean white background */}
      <View style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={['#FFFFFF', '#FDF8F5', '#FFFFFF']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {/* Subtle top-right coral accent arc */}
      <View style={styles.arcTopRight} />

      {/* Subtle bottom-left coral accent arc */}
      <View style={styles.arcBottomLeft} />

      {/* ── CENTER BRANDING ─────────────────────────────── */}
      <View style={styles.center}>
        {/* Warm coral radial glow blob */}
        <Animated.View
          style={[
            styles.glowBlob,
            { opacity: glowOpacity, transform: [{ scale: glowScale }] },
          ]}
        />

        {/* Logo wordmark */}
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
            alignItems: 'center',
          }}
        >
          {/* "glow" in coral */}
          <View style={styles.wordmarkRow}>
            <Text style={styles.wordmarkGlow}>glow</Text>
            <Text style={styles.wordmarkVai}>vai</Text>
          </View>

          {/* Animated underline accent */}
          <Animated.View style={[styles.accentLine, { width: lineWidth }]} />

          {/* Tagline */}
          <Animated.Text style={[styles.subTagline, { opacity: tagOpacity }]}>
            Your skin deserves the best
          </Animated.Text>
        </Animated.View>

        {/* 3 pulse dots */}
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
        </View>
      </View>

      {/* ── BOTTOM BADGE ────────────────────────────────── */}
      <Animated.View style={[styles.bottomBadge, { opacity: tagOpacity, bottom: Math.max(insets.bottom, 24) }]}>
        <Text style={styles.bottomText}>MADE IN INDIA 🇮🇳</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default SplashScreen;

const CORAL  = Colors.onboarding.primary;          // #D4472C
const CORAL_TINT = Colors.onboarding.primaryTint;  // rgba(212,71,44,0.08)
const TEXT_DARK  = Colors.onboarding.textPrimary;  // #1A1A1A
const TEXT_MID   = Colors.onboarding.textSecondary; // #6B6B6B

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Decorative arcs ───────────────────────────────────────
  arcTopRight: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: CORAL_TINT,
    ...Platform.select({ web: { filter: 'blur(40px)' }, default: {} }),
  },
  arcBottomLeft: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: CORAL_TINT,
    ...Platform.select({ web: { filter: 'blur(40px)' }, default: {} }),
  },

  // ── Center content ─────────────────────────────────────────
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Warm radial glow behind wordmark
  glowBlob: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: CORAL_TINT,
    ...Platform.select({ web: { filter: 'blur(60px)' }, default: {} }),
  },

  // ── Wordmark ───────────────────────────────────────────────
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordmarkGlow: {
    fontFamily: Platform.select({ ios: 'Syne-Bold', android: 'Syne-Bold', default: 'System' }),
    fontSize: 48,
    fontWeight: '800',
    color: '#0057FF',
    letterSpacing: -1,
    textTransform: 'lowercase',
  },
  wordmarkVai: {
    fontFamily: Platform.select({ ios: 'Syne-Bold', android: 'Syne-Bold', default: 'System' }),
    fontSize: 48,
    fontWeight: '800',
    color: TEXT_DARK,
    letterSpacing: -1,
    textTransform: 'lowercase',
  },

  // Animated accent underline
  accentLine: {
    height: 3,
    borderRadius: 2,
    backgroundColor: CORAL,
    marginTop: 6,
    alignSelf: 'flex-start',
  },

  subTagline: {
    fontSize: 13,
    fontWeight: '500',
    color: TEXT_MID,
    letterSpacing: 0.3,
    marginTop: 10,
  },

  // ── Pulse dots ─────────────────────────────────────────────
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 36,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: CORAL,
  },

  // ── Bottom badge ───────────────────────────────────────────
  bottomBadge: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 52 : 36,
    alignItems: 'center',
  },
  bottomText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: TEXT_MID,
    letterSpacing: 1.4,
  },
});
