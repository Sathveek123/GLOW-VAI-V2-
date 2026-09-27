import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Lock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  plum: '#5C2A91',
  warmIvory: '#FFFDF7',
  softCream: '#FAF4EE',
  coral: '#F27F78',
  softCoral: '#FBE0DC',
  lavender: '#F2ECFA',
  cobaltBlue: '#1677E8',
  successGreen: '#159447',
  softGreen: '#E3F5EA',
  text: '#321A2B',
  mutedText: '#756C73',
  border: '#E8E1E5',
};

export const ChangePhoneNumberScreen: React.FC = () => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const [currentPhone] = useState('+91 98765 43210');
  const [newPhone, setNewPhone] = useState('');
  const [step, setStep] = useState<'INPUT' | 'OTP'>('INPUT');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const handleSendOtp = () => {
    if (newPhone.trim().length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    safeHapticImpact();
    setIsSendingOtp(true);

    setTimeout(() => {
      setIsSendingOtp(false);
      setStep('OTP');
      setResendTimer(30);
    }, 600);
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      Alert.alert('Incomplete OTP', 'Please enter the complete 6-digit verification code.');
      return;
    }

    safeHapticImpact();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      Alert.alert(
        'Phone Number Updated',
        `Your phone number has been updated to +91 ${newPhone}.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 700);
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    safeHapticSelection();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset, height: undefined, minHeight: 64 }]}>
        <TouchableOpacity
          style={styles.backCircle}
          onPress={() => {
            safeHapticImpact();
            if (step === 'OTP') setStep('INPUT');
            else router.back();
          }}
          activeOpacity={0.7}
          delayPressIn={0}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Sparkles size={16} color="#FFD700" />
          <Text style={styles.headerTitle}>Change Phone Number</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentPadding, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* SECURITY INFO BANNER */}
        <View style={styles.securityBanner}>
          <ShieldCheck size={22} color={ColorTokens.plum} style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.securityTitle}>Account Protection</Text>
            <Text style={styles.securityText}>
              For your account security, an SMS verification OTP will be sent to confirm your new mobile number.
            </Text>
          </View>
        </View>

        {step === 'INPUT' ? (
          <>
            {/* CURRENT PHONE CARD */}
            <Text style={styles.sectionTitle}>CURRENT PHONE NUMBER</Text>
            <View style={styles.card}>
              <View style={styles.currentPhoneRow}>
                <View style={styles.phoneIconBg}>
                  <Smartphone size={20} color={ColorTokens.deepBerry} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.phoneLabel}>Registered Mobile</Text>
                  <Text style={styles.phoneValue}>{currentPhone}</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <CheckCircle2 size={12} color={ColorTokens.successGreen} />
                  <Text style={styles.verifiedText}>Active</Text>
                </View>
              </View>
            </View>

            {/* NEW PHONE INPUT CARD */}
            <Text style={styles.sectionTitle}>NEW PHONE NUMBER</Text>
            <View style={styles.card}>
              <Text style={styles.inputLabel}>Enter New Mobile Number</Text>
              <View style={styles.phoneInputRow}>
                <View style={styles.countryCodePill}>
                  <Text style={styles.countryFlag}>🇮🇳</Text>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>

                <TextInput
                  style={styles.phoneInput}
                  placeholder="98765 43210"
                  placeholderTextColor={ColorTokens.mutedText}
                  keyboardType="number-pad"
                  maxLength={10}
                  value={newPhone}
                  onChangeText={setNewPhone}
                />
              </View>
            </View>

            {/* SEND OTP BUTTON */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleSendOtp}
              activeOpacity={0.9}
              disabled={isSendingOtp}
              delayPressIn={0}
            >
              {isSendingOtp ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.actionBtnText}>Send OTP Verification →</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* OTP VERIFICATION CARD */}
            <Text style={styles.sectionTitle}>ENTER VERIFICATION CODE</Text>
            <View style={styles.card}>
              <Text style={styles.otpSubtitle}>
                We sent a 6-digit code to <Text style={{ fontWeight: '800', color: ColorTokens.text }}>+91 {newPhone}</Text>
              </Text>

              {/* 6 OTP DIGIT BOXES */}
              <View style={styles.otpRow}>
                {otp.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    style={styles.otpBox}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(val) => handleOtpChange(val, idx)}
                  />
                ))}
              </View>

              <View style={styles.resendRow}>
                <Text style={styles.resendText}>Didn't receive code?</Text>
                <TouchableOpacity
                  onPress={() => {
                    safeHapticImpact();
                    setResendTimer(30);
                  }}
                  disabled={resendTimer > 0}
                >
                  <Text style={[styles.resendLink, resendTimer > 0 && { color: ColorTokens.mutedText }]}>
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* VERIFY BUTTON */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleVerifyOtp}
              activeOpacity={0.9}
              disabled={isVerifying}
              delayPressIn={0}
            >
              {isVerifying ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.actionBtnText}>Verify & Update Phone Number →</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  securityBanner: {
    flexDirection: 'row',
    backgroundColor: ColorTokens.lavender,
    padding: 14,
    borderRadius: 16,
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2D1FC',
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorTokens.plum,
    marginBottom: 2,
  },
  securityText: {
    fontSize: 12,
    color: ColorTokens.plum,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  currentPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  phoneIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ColorTokens.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneLabel: {
    fontSize: 11,
    color: ColorTokens.mutedText,
    fontWeight: '600',
  },
  phoneValue: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorTokens.text,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.successGreen,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.text,
    marginBottom: 8,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countryCodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.softCream,
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  countryFlag: {
    fontSize: 16,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: ColorTokens.softCream,
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '700',
    color: ColorTokens.text,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  otpSubtitle: {
    fontSize: 13,
    color: ColorTokens.mutedText,
    textAlign: 'center',
    marginBottom: 16,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpBox: {
    width: 44,
    height: 50,
    borderRadius: 12,
    backgroundColor: ColorTokens.softCream,
    borderWidth: 1.5,
    borderColor: ColorTokens.border,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  resendText: {
    fontSize: 12,
    color: ColorTokens.mutedText,
  },
  resendLink: {
    fontSize: 12,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
  },
  actionBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 18,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
