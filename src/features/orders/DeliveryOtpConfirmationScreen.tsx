import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  ShieldCheck,
  Bike,
  Phone,
  MessageSquare,
  Lock,
  Copy,
  Info,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  plum: '#5C2A91',
  glowCyan: '#00F2FE',
  softCyanBg: '#E0F7FA',
  successGreen: '#2D9D5F',
  softGreen: '#E6F4EA',
  mainText: '#1A1A1A',
  secondaryText: '#6B6B6B',
  border: '#EDEBE6',
  cardBg: '#FFFFFF',
};

export const DeliveryOtpConfirmationScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ otp?: string; orderId?: string }>();

  const otpDigits = (params.otp || '4892').split('');
  const orderId = params.orderId || 'GV28491';

  const handleCopyOtp = () => {
    safeHapticImpact();
    // Copy OTP feedback
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset, height: undefined, minHeight: 64 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(customer)/(tabs)' as any);
            }
          }}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Delivery OTP Handshake</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* GLOWING OTP BOX CARD */}
        <View style={styles.otpHeroCard}>
          <View style={styles.securityIconWrap}>
            <ShieldCheck size={28} color="#00C4CC" />
          </View>

          <Text style={styles.otpHeroTitle}>Package Delivery Handshake</Text>
          <Text style={styles.otpHeroSub}>
            Share this 4-digit security PIN with your rider to verify order #{orderId}.
          </Text>

          {/* 4 DIGIT GLOWING OTP BOXES */}
          <View style={styles.otpBoxesRow}>
            {otpDigits.map((digit, idx) => (
              <View key={idx} style={styles.otpBox}>
                <Text style={styles.otpDigit}>{digit}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.copyPill} onPress={handleCopyOtp} activeOpacity={0.8}>
            <Copy size={12} color="#00838F" />
            <Text style={styles.copyPillText}>OTP: {params.otp || '4892'}</Text>
          </TouchableOpacity>
        </View>

        {/* RIDER INFORMATION CARD */}
        <View style={styles.riderCard}>
          <View style={styles.riderRow}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              }}
              style={styles.riderAvatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.riderName}>Rahul · Delivery Partner</Text>
              <Text style={styles.vehicleText}>TVS Jupiter · AP 39 KQ 7321</Text>
              <View style={styles.arrivalBadge}>
                <Bike size={12} color={ColorTokens.successGreen} />
                <Text style={styles.arrivalText}>Arrived at your doorstep!</Text>
              </View>
            </View>

            <View style={styles.riderActions}>
              <TouchableOpacity style={styles.callBtn} activeOpacity={0.8}>
                <Phone size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* SECURITY INSTRUCTIONS */}
        <View style={styles.instructionsCard}>
          <View style={styles.instHeader}>
            <Info size={16} color={ColorTokens.plum} />
            <Text style={styles.instTitle}>Handshake Safety Instructions</Text>
          </View>

          <Text style={styles.instItem}>
            • <Text style={{ fontFamily: 'Poppins-Bold' }}>Do NOT share OTP</Text> over phone call before inspecting your sealed package.
          </Text>
          <Text style={styles.instItem}>
            • Package must be handed over physically by the rider before OTP verification.
          </Text>
          <Text style={styles.instItem}>
            • Once rider enters OTP on vendor partner app, order will mark as <Text style={{ fontFamily: 'Poppins-Bold' }}>DELIVERED</Text>.
          </Text>
        </View>

        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTION */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.push('/(customer)/(tabs)')}
          activeOpacity={0.9}
        >
          <Text style={styles.closeBtnText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  otpHeroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  securityIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  otpHeroTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  otpHeroSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20,
  },
  otpBox: {
    width: 56,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: ColorTokens.glowCyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ColorTokens.glowCyan,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  otpDigit: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: ColorTokens.glowCyan,
  },
  copyPill: {
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  copyPillText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: ColorTokens.glowCyan,
  },
  riderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  riderName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  vehicleText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
    marginTop: 1,
  },
  arrivalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  arrivalText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: ColorTokens.successGreen,
  },
  riderActions: {
    justifyContent: 'center',
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 8,
  },
  instHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  instTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  instItem: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: ColorTokens.secondaryText,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: ColorTokens.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeBtn: {
    backgroundColor: ColorTokens.deepBerry,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
