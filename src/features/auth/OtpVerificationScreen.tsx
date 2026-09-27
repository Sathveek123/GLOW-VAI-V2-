import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingScreenLayout } from '../../components/layout/OnboardingScreenLayout';
import { Colors, Typography } from '../../design';
import { safeHapticImpact } from '../../utils/haptics';
import { verifyPhoneOtp, sendPhoneOtp, getCurrentUser } from '../../services/authService';

export const OtpVerificationScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ phoneNumber?: string; verificationId?: string }>();

  const phoneNumber = params.phoneNumber || '+91 98765 43210';

  // 4 Individual OTP Digit States
  const [digits, setDigits] = useState<[string, string, string, string]>(['', '', '', '']);
  const [activeBoxIndex, setActiveBoxIndex] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Resend Timer State (30 seconds)
  const [countdown, setCountdown] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Shake animation on error
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Refs for 4 input boxes
  const inputRef0 = useRef<TextInput>(null);
  const inputRef1 = useRef<TextInput>(null);
  const inputRef2 = useRef<TextInput>(null);
  const inputRef3 = useRef<TextInput>(null);
  const inputRefs = [inputRef0, inputRef1, inputRef2, inputRef3];

  useEffect(() => {
    inputRef0.current?.focus();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleDigitChange = (val: string, index: number) => {
    const clean = val.replace(/\D/g, '');
    setIsError(false);
    setErrorMessage(null);

    if (clean.length === 4) {
      const pasteArray = clean.split('') as [string, string, string, string];
      setDigits(pasteArray);
      inputRef3.current?.focus();
      triggerAutoSubmit(clean);
      return;
    }

    const singleDigit = clean.slice(-1);
    const newDigits = [...digits] as [string, string, string, string];
    newDigits[index] = singleDigit;
    setDigits(newDigits);

    if (singleDigit && index < 3) {
      setActiveBoxIndex(index + 1);
      inputRefs[index + 1]?.current?.focus();
    }

    const code = newDigits.join('');
    if (code.length === 4) {
      triggerAutoSubmit(code);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits] as [string, string, string, string];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        setActiveBoxIndex(index - 1);
        inputRefs[index - 1]?.current?.focus();
      }
    }
  };

  const triggerAutoSubmit = async (code: string) => {
    await safeHapticImpact();
    setIsVerifying(true);
    setIsError(false);
    setErrorMessage(null);

    try {
      await verifyPhoneOtp(code);
      setIsVerifying(false);

      const currentUser = getCurrentUser();
      if (currentUser) {
        router.replace('/(customer)/(tabs)');
      } else {
        router.replace('/(auth)/profile-setup' as any);
      }
    } catch (err: any) {
      setIsVerifying(false);
      setIsError(true);
      setDigits(['', '', '', '']);
      setActiveBoxIndex(0);
      inputRef0.current?.focus();
      triggerShake();
      setErrorMessage(err?.message || 'Incorrect verification code. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    await safeHapticImpact();
    setCanResend(false);
    setCountdown(30);
    setDigits(['', '', '', '']);
    setErrorMessage(null);

    try {
      await sendPhoneOtp(phoneNumber);
    } catch {
      // safe fallback
    }
  };

  return (
    <OnboardingScreenLayout>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Bar with Back Button & Edit Number */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.onboarding.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={[Typography.labelMd, styles.editNumberText]}>Edit Number</Text>
        </TouchableOpacity>
      </View>

      {/* Content Viewport */}
      <View style={styles.contentBody}>
        <Text style={[Typography.displayLg, styles.headlineTitle]}>Verify your number</Text>
        <Text style={[Typography.bodyLg, styles.subtext]}>
          Enter the 4-digit code sent to <Text style={styles.phoneBold}>{phoneNumber}</Text>
        </Text>

        {/* 4 Shaking OTP Boxes */}
        <Animated.View
          style={[
            styles.otpBoxesRow,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          {digits.map((digit, idx) => {
            const isActive = activeBoxIndex === idx && !isVerifying;
            const isFilled = !!digit;

            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={1}
                onPress={() => {
                  setActiveBoxIndex(idx);
                  inputRefs[idx]?.current?.focus();
                }}
              >
                <View
                  style={[
                    styles.otpBox,
                    isActive && styles.otpBoxActive,
                    isFilled && styles.otpBoxFilled,
                    isError && styles.otpBoxError,
                  ]}
                >
                  <TextInput
                    ref={inputRefs[idx]}
                    style={[Typography.numericMono, styles.otpInputText]}
                    keyboardType="number-pad"
                    maxLength={4}
                    value={digit}
                    onChangeText={(val) => handleDigitChange(val, idx)}
                    onKeyPress={(e) => handleKeyPress(e, idx)}
                    onFocus={() => setActiveBoxIndex(idx)}
                    selectTextOnFocus={true}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Inline Verification Spinner */}
        {isVerifying && (
          <View style={styles.verifyingBanner}>
            <ActivityIndicator size="small" color={Colors.onboarding.primary} />
            <Text style={[Typography.bodySm, styles.verifyingText]}>Verifying code...</Text>
          </View>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={14} color={Colors.status.error} />
            <Text style={[Typography.bodySm, styles.errorBannerText]}>{errorMessage}</Text>
          </View>
        )}

        {/* Resend Timer / Link */}
        <View style={styles.resendWrapper}>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOtp} activeOpacity={0.7}>
              <Text style={[Typography.labelMd, styles.resendLinkText]}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[Typography.bodySm, styles.resendCountdownText]}>
              Resend OTP in <Text style={styles.monoTime}>0:{countdown < 10 ? `0${countdown}` : countdown}</Text>
            </Text>
          )}
        </View>
      </View>
    </OnboardingScreenLayout>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    width: '100%',
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
  editNumberText: {
    color: Colors.onboarding.primary,
  },
  contentBody: {
    flex: 1,
    paddingTop: 24,
    alignItems: 'center',
  },
  headlineTitle: {
    color: Colors.onboarding.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    color: Colors.onboarding.textSecondary,
    textAlign: 'center',
    marginBottom: 36,
  },
  phoneBold: {
    color: Colors.onboarding.textPrimary,
    fontFamily: 'Inter-SemiBold',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  otpBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.onboarding.surfaceInput,
    borderWidth: 1.5,
    borderColor: Colors.onboarding.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxActive: {
    borderColor: Colors.onboarding.borderFocus,
  },
  otpBoxFilled: {
    borderColor: Colors.onboarding.textSecondary,
  },
  otpBoxError: {
    borderColor: Colors.status.error,
  },
  otpInputText: {
    fontSize: 22,
    color: Colors.onboarding.textPrimary,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  verifyingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  verifyingText: {
    color: Colors.onboarding.textSecondary,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginBottom: 20,
  },
  errorBannerText: {
    color: Colors.status.error,
  },
  resendWrapper: {
    marginTop: 12,
    alignItems: 'center',
  },
  resendCountdownText: {
    color: Colors.onboarding.textSecondary,
  },
  monoTime: {
    color: Colors.onboarding.textPrimary,
    fontFamily: 'Inter-SemiBold',
  },
  resendLinkText: {
    color: Colors.onboarding.primary,
  },
});
