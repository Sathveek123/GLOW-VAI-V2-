import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Sparkles, Shield, Lock, CheckCircle2, HelpCircle } from 'lucide-react-native';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  deepPlum: '#5E173E',
  plumPurple: '#5C2A91',
  coral: '#F27F78',
  softCoral: '#FBE0DC',
  warmIvory: '#FFFDF7',
  softLavender: '#F2ECFA',
  cobaltBlue: '#1677E8',
  successGreen: '#159447',
  softGreen: '#E3F5EA',
  mainText: '#241529',
  secondaryText: '#716675',
  border: '#E8E1E5',
  cardBg: '#FFFFFF',
  gold: '#FFD45F',
};

export const CashfreePaymentProcessingScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const headerTopInset = useHeaderTopInset(8);

  const pulseScale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1000, easing: Easing.ease }),
        withTiming(1, { duration: 1000, easing: Easing.ease })
      ),
      -1,
      true
    );

    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );

    // Simulate backend payment verification response
    const timer = setTimeout(() => {
      if (params.status === 'fail') {
        router.replace('/payment-failed' as any);
      } else {
        router.replace('/payment-success' as any);
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [params.status]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset, height: undefined, minHeight: 64 }]}>
        <View style={{ width: 36 }} />
        <View style={styles.logoRow}>
          <Sparkles size={18} color={ColorTokens.gold} />
          <Text style={styles.logoText}>GlowVAI</Text>
        </View>
        <TouchableOpacity style={styles.helpBtn} onPress={() => {}} activeOpacity={0.8}>
          <HelpCircle size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        {/* GLOWING SECURE ORB VISUAL */}
        <View style={styles.orbWrapper}>
          <Animated.View style={[styles.orbPulseRing, pulseStyle]} />
          <Animated.View style={[styles.orbSpinRing, spinStyle]} />

          <View style={styles.orbCenter}>
            <Shield size={32} color={ColorTokens.deepBerry} />
            <Lock size={14} color={ColorTokens.deepBerry} style={{ position: 'absolute' }} />
          </View>
        </View>

        {/* HEADINGS */}
        <Text style={styles.mainHeading}>Securely processing your payment</Text>
        <Text style={styles.subtitle}>Please don’t close this screen or press back.</Text>

        {/* ORDER SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Order Total</Text>
            <Text style={styles.summaryValue}>₹1,347</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Method</Text>
            <Text style={styles.summaryValue}>UPI (Google Pay)</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Transaction Ref</Text>
            <Text style={styles.summaryValueMuted}>#GV-829103</Text>
          </View>
        </View>

        {/* PROGRESS STEPS */}
        <View style={styles.stepsCard}>
          <View style={styles.stepItem}>
            <CheckCircle2 size={18} color={ColorTokens.successGreen} />
            <Text style={styles.stepDoneText}>Creating order session</Text>
          </View>

          <View style={styles.stepItem}>
            <ActivityIndicator size="small" color={ColorTokens.deepBerry} />
            <Text style={styles.stepActiveText}>Verifying bank payment status</Text>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.pendingDot} />
            <Text style={styles.stepPendingText}>Confirming order & reserving stock</Text>
          </View>
        </View>

        {/* CASHFREE SECURITY BADGE */}
        <View style={styles.cashfreeBadge}>
          <Shield size={14} color={ColorTokens.secondaryText} />
          <Text style={styles.cashfreeText}>Secured by Cashfree Payments 256-bit SSL</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  helpBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    alignItems: 'center',
  },
  orbWrapper: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  orbPulseRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: ColorTokens.softCoral,
    opacity: 0.6,
  },
  orbSpinRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: ColorTokens.deepBerry,
    borderStyle: 'dashed',
  },
  orbCenter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ColorTokens.deepBerry,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  mainHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: ColorTokens.mainText,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: ColorTokens.secondaryText,
    textAlign: 'center',
    marginTop: 6,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    marginTop: 24,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: ColorTokens.secondaryText,
  },
  summaryValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  summaryValueMuted: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.secondaryText,
  },
  stepsCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    marginTop: 14,
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepDoneText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.successGreen,
  },
  stepActiveText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: ColorTokens.deepBerry,
  },
  pendingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E5E0E4',
    marginLeft: 2,
  },
  stepPendingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: ColorTokens.secondaryText,
  },
  cashfreeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 32,
  },
  cashfreeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
});
