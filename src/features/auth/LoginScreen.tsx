import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { safeHapticImpact } from '../../utils/haptics';
import { sendPhoneOtp } from '../../services/authService';
import { logTouch } from '../../utils/touchDoctor';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const validateIndianPhoneNumber = (digits: string): boolean => {
  const clean = digits.replace(/\D/g, '');
  return clean.length === 10 && /^[6-9]/.test(clean);
};

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const [rawDigits, setRawDigits] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [logoTapCount, setLogoTapCount] = useState(0);

  const handleLogoTap = () => {
    const nextCount = logoTapCount + 1;
    setLogoTapCount(nextCount);
    if (nextCount >= 7) {
      setLogoTapCount(0);
      safeHapticImpact();
      router.push('/(debug)/app-doctor' as any);
    }
  };

  // Auto 5+5 digit formatting ("98765 43210")
  const formatPhoneNumber = (digits: string) => {
    const clean = digits.replace(/\D/g, '').slice(0, 10);
    if (clean.length > 5) {
      return `${clean.slice(0, 5)} ${clean.slice(5)}`;
    }
    return clean;
  };

  const handleTextChange = (text: string) => {
    const clean = text.replace(/\D/g, '').slice(0, 10);
    setRawDigits(clean);
    setErrorMessage(null);

    if (clean.length > 0 && !/^[6-9]/.test(clean)) {
      setErrorMessage('Enter a valid 10-digit mobile number starting with 6-9');
    }
  };

  const isValidNumber = validateIndianPhoneNumber(rawDigits);

  const handleSendOtp = async () => {
    if (!isValidNumber || isLoading) return;

    logTouch('Continue Button Clicked', { screen: 'LoginScreen', extra: { phone: rawDigits } });
    safeHapticImpact();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const fullPhone = `+91${rawDigits}`;
      const confirmationResult = await sendPhoneOtp(fullPhone);

      setIsLoading(false);
      router.push({
        pathname: '/(auth)/otp' as any,
        params: {
          phoneNumber: fullPhone,
          verificationId: confirmationResult?.verificationId || 'demo-vid',
        },
      });
    } catch (err: any) {
      setIsLoading(false);
      if (err?.code === 'auth/too-many-requests') {
        setErrorMessage('Too many attempts. Try again in a few minutes.');
      } else {
        setErrorMessage(err?.message || 'Failed to send OTP. Please check your network.');
      }
    }
  };

  const handleSkip = () => {
    logTouch('Header Skip Button', { screen: 'LoginScreen' });
    safeHapticImpact();
    router.replace('/(customer)/(tabs)');
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0057FF" />

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 1. BRANDED HEADER AREA (Top ~28% of Screen)                     */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <View style={styles.headerArea}>
        {/* Subtle repeating vector pattern background overlay */}
        <View style={styles.vectorPatternOverlay}>
          <View style={styles.patternIcon1} />
          <View style={styles.patternIcon2} />
          <View style={styles.patternIcon3} />
        </View>

        {/* Top Safe Area & Skip Button */}
        <View style={[styles.topHeaderNav, { paddingTop: headerTopInset }]}>
          <TouchableOpacity
            style={styles.skipPillBtn}
            onPress={handleSkip}
            activeOpacity={0.8}
          >
            <Text style={styles.skipBtnText}>skip</Text>
          </TouchableOpacity>
        </View>

        {/* Centered Logo ("glowvai") — 7 taps opens secret App Doctor */}
        <TouchableOpacity
          style={[styles.logoCenterContainer, { top: headerTopInset - 4 }]}
          onPress={handleLogoTap}
          activeOpacity={0.9}
        >
          <Text style={styles.brandLogoText}>glowvai</Text>
        </TouchableOpacity>

        {/* Mascots Anchored at Bottom Edge of Blue Header */}
        <View style={styles.mascotsContainer} pointerEvents="none">
          {/* Left Mascot: Waving Fox (Nick Wilde) */}
          <View style={styles.leftMascotWrap}>
            <Image
              source={require('../../../images/2_nobg.png')}
              style={styles.mascotImg}
              resizeMode="contain"
            />
          </View>

          {/* Right Mascot: Orange Cat with Phone */}
          <View style={styles.rightMascotWrap}>
            <Image
              source={require('../../../images/1_nobg.png')}
              style={styles.mascotImg}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 2. MAIN WHITE SHEET CONTAINER (Bottom ~72% of Screen)           */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <View style={styles.sheetContainer}>
        <KeyboardAvoidingView
          style={[styles.keyboardView, { paddingBottom: Math.max(insets.bottom, 24) }]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.sheetContent}>
            {/* Page Title ("Enter your number") */}
            <Text style={styles.pageTitle}>Enter your number</Text>

            {/* Outlined Cutout Style Input Container */}
            <View style={[styles.cutoutInputWrapper, isFocused && styles.cutoutInputWrapperFocused]}>
              {/* Floating Label Mask sitting on top border */}
              <View style={styles.floatingLabelMask}>
                <Text style={styles.floatingLabelText}>Mobile Number</Text>
              </View>

              <View style={styles.inputInnerRow}>
                {/* Prefix Cluster: Indian Flag + "+91" + Down Chevron */}
                <View style={styles.prefixCluster}>
                  <View style={styles.flagCircle}>
                    <Text style={styles.flagEmoji}>🇮🇳</Text>
                  </View>
                  <Text style={styles.countryCodeText}>+91</Text>
                  <Ionicons name="chevron-down" size={14} color="#000000" style={{ marginLeft: 2 }} />
                </View>

                {/* Vertical Divider */}
                <View style={styles.verticalDivider} />

                {/* Number Input Field */}
                <TextInput
                  style={styles.numberTextInput}
                  placeholder=""
                  keyboardType="number-pad"
                  maxLength={11} // Includes space
                  value={formatPhoneNumber(rawDigits)}
                  onChangeText={handleTextChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  autoFocus={true}
                  selectionColor="#0057FF"
                />
              </View>
            </View>

            {/* Error Banner */}
            {errorMessage && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={14} color="#EF4444" />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            )}
          </View>

          {/* ════════════════════════════════════════════════════════════ */}
          {/* 3. STICKY FOOTER ANATOMY                                     */}
          {/* ════════════════════════════════════════════════════════════ */}
          <View style={styles.footerContainer}>
            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueBtn,
                isValidNumber ? styles.continueBtnActive : styles.continueBtnDisabled,
              ]}
              onPress={handleSendOtp}
              disabled={!isValidNumber || isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.continueBtnText,
                    isValidNumber ? styles.continueBtnTextActive : styles.continueBtnTextDisabled,
                  ]}
                >
                  Continue
                </Text>
              )}
            </TouchableOpacity>

            {/* Footer Disclaimer */}
            <View style={styles.disclaimerWrapper}>
              <Text style={styles.disclaimerText}>
                By clicking, I accept the{' '}
                <Text
                  style={styles.disclaimerLink}
                  onPress={() => router.push('/(customer)/terms' as any)}
                >
                  privacy policy
                </Text>{' '}
                and{' '}
                <Text
                  style={styles.disclaimerLink}
                  onPress={() => router.push('/(customer)/terms' as any)}
                >
                  terms of use
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#0057FF',
  },

  // ── 1. Header Area Styles ─────────────────────────────────────────
  headerArea: {
    height: Math.max(SCREEN_H * 0.28, 220),
    backgroundColor: '#0057FF',
    justifyContent: 'space-between',
    position: 'relative',
  },
  vectorPatternOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
  },
  patternIcon1: {
    position: 'absolute',
    top: 20,
    left: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  patternIcon2: {
    position: 'absolute',
    top: 80,
    right: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  patternIcon3: {
    position: 'absolute',
    bottom: 40,
    left: '45%',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  topHeaderNav: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    zIndex: 10,
  },
  skipPillBtn: {
    backgroundColor: 'rgba(0, 20, 80, 0.45)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtnText: {
    fontFamily: Platform.select({ ios: 'MinniePlay-Bold', android: 'MinniePlay-Bold', default: 'System' }),
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'lowercase',
  },
  logoCenterContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  brandLogoText: {
    fontFamily: Platform.select({ ios: 'Syne-Bold', android: 'Syne-Bold', default: 'System' }),
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  mascotsContainer: {
    position: 'absolute',
    bottom: -15,
    left: 0,
    right: 0,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    zIndex: 2,
  },
  leftMascotWrap: {
    width: 100,
    height: 120,
    justifyContent: 'flex-end',
  },
  rightMascotWrap: {
    width: 100,
    height: 120,
    justifyContent: 'flex-end',
  },
  mascotImg: {
    width: '100%',
    height: '100%',
  },

  // ── 2. Main Sheet Container Styles ────────────────────────────────
  sheetContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    zIndex: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'ios' ? 36 : 28,
  },
  sheetContent: {
    flex: 1,
  },
  pageTitle: {
    fontFamily: Platform.select({ ios: 'MinniePlay-Bold', android: 'MinniePlay-Bold', default: 'System' }),
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 28,
    letterSpacing: -0.3,
  },

  // Outlined Cutout Style Input Box
  cutoutInputWrapper: {
    position: 'relative',
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0057FF',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  cutoutInputWrapperFocused: {
    borderColor: '#004BD6',
    borderWidth: 2,
  },
  floatingLabelMask: {
    position: 'absolute',
    top: -9,
    left: 18,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
    zIndex: 10,
  },
  floatingLabelText: {
    fontFamily: Platform.select({ ios: 'HelveticaNow-Regular', android: 'HelveticaNow-Regular', default: 'System' }),
    fontSize: 11,
    fontWeight: '600',
    color: '#0057FF',
  },
  inputInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  prefixCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flagCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  flagEmoji: {
    fontSize: 14,
  },
  countryCodeText: {
    fontFamily: Platform.select({ ios: 'HelveticaNow-Medium', android: 'HelveticaNow-Medium', default: 'System' }),
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#D0D7DE',
    marginHorizontal: 12,
  },
  numberTextInput: {
    flex: 1,
    fontFamily: Platform.select({ ios: 'HelveticaNow-Medium', android: 'HelveticaNow-Medium', default: 'System' }),
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    height: '100%',
    padding: 0,
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginTop: 14,
  },
  errorBannerText: {
    fontFamily: Platform.select({ ios: 'HelveticaNow-Regular', android: 'HelveticaNow-Regular', default: 'System' }),
    fontSize: 12,
    color: '#EF4444',
  },

  // ── 3. Footer Styles ──────────────────────────────────────────────
  footerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  continueBtn: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  continueBtnDisabled: {
    backgroundColor: '#F0F0F0',
  },
  continueBtnActive: {
    backgroundColor: '#0057FF',
    shadowColor: '#0057FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  continueBtnText: {
    fontFamily: Platform.select({ ios: 'MinniePlay-Bold', android: 'MinniePlay-Bold', default: 'System' }),
    fontSize: 18,
    fontWeight: '700',
  },
  continueBtnTextDisabled: {
    color: '#A0A4AB',
  },
  continueBtnTextActive: {
    color: '#FFFFFF',
  },
  disclaimerWrapper: {
    paddingHorizontal: 8,
  },
  disclaimerText: {
    fontFamily: Platform.select({ ios: 'HelveticaNow-Regular', android: 'HelveticaNow-Regular', default: 'System' }),
    fontSize: 12,
    color: '#8E95A0',
    textAlign: 'center',
    lineHeight: 18,
  },
  disclaimerLink: {
    fontFamily: Platform.select({ ios: 'HelveticaNow-Bold', android: 'HelveticaNow-Bold', default: 'System' }),
    color: '#000000',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
