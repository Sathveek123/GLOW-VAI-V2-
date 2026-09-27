import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  CreditCard,
  Banknote,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact } from '../../utils/haptics';

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

export const PaymentFailedScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const handleRetryPayment = () => {
    safeHapticImpact();
    router.replace('/payment-processing' as any);
  };

  const handleChooseAnotherMethod = () => {
    safeHapticImpact();
    router.replace('/payment-method' as any);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset, height: undefined, minHeight: 64 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(customer)/(tabs)/cart' as any)} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleRow}>
          <Sparkles size={16} color={ColorTokens.gold} />
          <Text style={styles.headerLogo}>GlowVAI</Text>
          <Text style={styles.headerDivider}>|</Text>
          <Text style={styles.headerTitle}>Payment Status</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* CALM CORAL WARNING CARD */}
        <View style={styles.warningCard}>
          <View style={styles.warningIconCircle}>
            <AlertTriangle size={28} color={ColorTokens.deepBerry} />
          </View>
          <Text style={styles.warningTitle}>Payment didn’t go through</Text>
          <Text style={styles.warningSub}>
            Your order is safe. Try another payment method or retry to complete it.
          </Text>
        </View>

        {/* PAYMENT ATTEMPT SUMMARY */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Payment Attempt Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Order Total</Text>
            <Text style={styles.summaryValue}>₹1,347</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Selected Method</Text>
            <Text style={styles.summaryValue}>UPI (Google Pay)</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Reason</Text>
            <Text style={styles.reasonText}>The payment timed out by bank</Text>
          </View>
        </View>

        {/* RECOVERY GUIDE */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>What you can do</Text>

          <View style={styles.guideStep}>
            <View style={styles.stepNumCircle}><Text style={styles.stepNum}>1</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.guideTitle}>Check your UPI app</Text>
              <Text style={styles.guideSub}>Ensure the request was approved in Google Pay / PhonePe.</Text>
            </View>
          </View>

          <View style={styles.guideStep}>
            <View style={styles.stepNumCircle}><Text style={styles.stepNum}>2</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.guideTitle}>Try another payment method</Text>
              <Text style={styles.guideSub}>Switch to Credit/Debit card or NetBanking instantly.</Text>
            </View>
          </View>

          <View style={styles.guideStep}>
            <View style={styles.stepNumCircle}><Text style={styles.stepNum}>3</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.guideTitle}>Keep the app open while paying</Text>
              <Text style={styles.guideSub}>Avoid switching apps rapidly during bank authorization.</Text>
            </View>
          </View>
        </View>

        {/* ALTERNATIVE COD OPTION */}
        <TouchableOpacity
          style={styles.codOptionCard}
          onPress={() => router.replace('/payment-method' as any)}
          activeOpacity={0.85}
        >
          <Banknote size={20} color={ColorTokens.successGreen} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.codTitle}>Pay on Delivery if available</Text>
            <Text style={styles.codSub}>Pay with cash when your rider arrives in 10 mins.</Text>
          </View>
          <ChevronRight size={16} color={ColorTokens.secondaryText} />
        </TouchableOpacity>

        {/* CART PRESERVATION GUARANTEE */}
        <View style={styles.guaranteeCard}>
          <ShieldCheck size={16} color={ColorTokens.successGreen} />
          <Text style={styles.guaranteeText}>
            Your cart & GLOW10 discount coupon have been preserved automatically.
          </Text>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionsWrap}>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRetryPayment} activeOpacity={0.9}>
            <RefreshCw size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.retryBtnText}>Retry Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.anotherMethodBtn} onPress={handleChooseAnotherMethod} activeOpacity={0.8}>
            <Text style={styles.anotherMethodText}>Choose Another Method</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportLink} onPress={() => {}} activeOpacity={0.7}>
            <HelpCircle size={14} color={ColorTokens.secondaryText} />
            <Text style={styles.supportLinkText}>Need help? Contact support</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 + insets.bottom }} />
      </ScrollView>
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
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 12,
  },
  headerLogo: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  headerDivider: {
    color: 'rgba(255,255,255,0.4)',
  },
  headerTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  warningCard: {
    backgroundColor: ColorTokens.softCoral,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F8C8C3',
  },
  warningIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  warningTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: ColorTokens.deepBerry,
  },
  warningSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: ColorTokens.mainText,
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  cardHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  reasonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.deepBerry,
  },
  guideStep: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  stepNumCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ColorTokens.softLavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: ColorTokens.plumPurple,
  },
  guideTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: ColorTokens.mainText,
  },
  guideSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
    marginTop: 1,
  },
  codOptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  codTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  codSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  guaranteeCard: {
    backgroundColor: ColorTokens.softGreen,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#C8E8D5',
  },
  guaranteeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: ColorTokens.successGreen,
    flex: 1,
  },
  actionsWrap: {
    gap: 10,
    marginTop: 6,
  },
  retryBtn: {
    backgroundColor: ColorTokens.deepBerry,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  anotherMethodBtn: {
    backgroundColor: '#FFFFFF',
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: ColorTokens.border,
  },
  anotherMethodText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  supportLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  supportLinkText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: ColorTokens.secondaryText,
  },
});
