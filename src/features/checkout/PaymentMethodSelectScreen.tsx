import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building2,
  Banknote,
  Smartphone,
  ChevronRight,
  Plus,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

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

export const PaymentMethodSelectScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'cards' | 'netbanking' | 'cod'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');

  const handlePayPress = () => {
    safeHapticImpact();
    // Navigate to Cashfree Payment Processing Screen
    router.push('/payment-processing' as any);
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
              router.push('/checkout-review' as any);
            }
          }}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleRow}>
          <Sparkles size={16} color={ColorTokens.gold} />
          <Text style={styles.headerLogo}>GlowVAI</Text>
          <Text style={styles.headerDivider}>|</Text>
          <Text style={styles.headerTitle}>Choose Payment Method</Text>
        </View>
      </View>

      {/* CHECKOUT STEPPER (Step 3 Active) */}
      <View style={styles.stepperWrap}>
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, styles.stepCompleted]}>
            <CheckCircle2 size={14} color="#FFFFFF" />
          </View>
          <Text style={styles.stepLabelCompleted}>Cart</Text>
        </View>

        <View style={[styles.stepLine, styles.stepLineActive]} />

        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, styles.stepCompleted]}>
            <CheckCircle2 size={14} color="#FFFFFF" />
          </View>
          <Text style={styles.stepLabelCompleted}>Review</Text>
        </View>

        <View style={[styles.stepLine, styles.stepLineActive]} />

        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, styles.stepActive]}>
            <Text style={styles.stepNumberActive}>3</Text>
          </View>
          <Text style={styles.stepLabelActive}>Pay</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ORDER TOTAL HEADER CARD */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Order Total</Text>
          <Text style={styles.amountValue}>₹1,347</Text>
        </View>

        <Text style={styles.sectionHeading}>Select Payment Method</Text>

        {/* 1. UPI METHOD */}
        <TouchableOpacity
          style={[styles.methodCard, selectedMethod === 'upi' && styles.methodCardSelected]}
          onPress={() => {
            safeHapticSelection();
            setSelectedMethod('upi');
          }}
          activeOpacity={0.9}
        >
          <View style={styles.methodTopRow}>
            <View style={styles.methodIconWrap}>
              <Smartphone size={20} color={ColorTokens.plumPurple} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.methodTitle}>UPI</Text>
              <Text style={styles.methodSub}>Pay instantly from any UPI app</Text>
            </View>
            <View style={[styles.radioOuter, selectedMethod === 'upi' && styles.radioOuterSelected]}>
              {selectedMethod === 'upi' && <View style={styles.radioInner} />}
            </View>
          </View>

          {/* NESTED POPULAR UPI APPS */}
          {selectedMethod === 'upi' && (
            <View style={styles.upiAppsContainer}>
              {[
                { id: 'gpay', name: 'Google Pay', icon: '⚡' },
                { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                { id: 'paytm', name: 'Paytm UPI', icon: '🔹' },
              ].map((app) => (
                <TouchableOpacity
                  key={app.id}
                  style={[
                    styles.upiAppItem,
                    selectedUpiApp === app.id && styles.upiAppItemSelected,
                  ]}
                  onPress={() => {
                    safeHapticSelection();
                    setSelectedUpiApp(app.id as any);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 16 }}>{app.icon}</Text>
                  <Text style={styles.upiAppName}>{app.name}</Text>
                  <View style={[styles.miniRadioOuter, selectedUpiApp === app.id && styles.miniRadioSelected]}>
                    {selectedUpiApp === app.id && <View style={styles.miniRadioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* 2. CARDS METHOD */}
        <TouchableOpacity
          style={[styles.methodCard, selectedMethod === 'cards' && styles.methodCardSelected]}
          onPress={() => {
            safeHapticSelection();
            setSelectedMethod('cards');
          }}
          activeOpacity={0.9}
        >
          <View style={styles.methodTopRow}>
            <View style={styles.methodIconWrap}>
              <CreditCard size={20} color={ColorTokens.cobaltBlue} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.methodTitle}>Credit / Debit Cards</Text>
              <Text style={styles.methodSub}>Visa, Mastercard, RuPay & more</Text>
            </View>
            <View style={[styles.radioOuter, selectedMethod === 'cards' && styles.radioOuterSelected]}>
              {selectedMethod === 'cards' && <View style={styles.radioInner} />}
            </View>
          </View>

          {selectedMethod === 'cards' && (
            <TouchableOpacity style={styles.addCardRow} activeOpacity={0.8}>
              <Plus size={16} color={ColorTokens.deepBerry} />
              <Text style={styles.addCardText}>Add new card →</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* 3. NETBANKING METHOD */}
        <TouchableOpacity
          style={[styles.methodCard, selectedMethod === 'netbanking' && styles.methodCardSelected]}
          onPress={() => {
            safeHapticSelection();
            setSelectedMethod('netbanking');
          }}
          activeOpacity={0.9}
        >
          <View style={styles.methodTopRow}>
            <View style={styles.methodIconWrap}>
              <Building2 size={20} color={ColorTokens.deepBerry} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.methodTitle}>NetBanking</Text>
              <Text style={styles.methodSub}>Pay directly from your bank account</Text>
            </View>
            <View style={[styles.radioOuter, selectedMethod === 'netbanking' && styles.radioOuterSelected]}>
              {selectedMethod === 'netbanking' && <View style={styles.radioInner} />}
            </View>
          </View>
        </TouchableOpacity>

        {/* 4. CASH ON DELIVERY */}
        <TouchableOpacity
          style={[styles.methodCard, selectedMethod === 'cod' && styles.methodCardSelected]}
          onPress={() => {
            safeHapticSelection();
            setSelectedMethod('cod');
          }}
          activeOpacity={0.9}
        >
          <View style={styles.methodTopRow}>
            <View style={styles.methodIconWrap}>
              <Banknote size={20} color={ColorTokens.successGreen} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.methodTitle}>Cash on Delivery</Text>
              <Text style={styles.methodSub}>Pay in cash at the time of delivery</Text>
            </View>
            <View style={[styles.radioOuter, selectedMethod === 'cod' && styles.radioOuterSelected]}>
              {selectedMethod === 'cod' && <View style={styles.radioInner} />}
            </View>
          </View>

          {selectedMethod === 'cod' && (
            <View style={styles.codBadgeNote}>
              <Text style={styles.codBadgeText}>✓ Available for Vijayawada location</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* SECURITY GUARANTEE CARD */}
        <View style={styles.securityCard}>
          <ShieldCheck size={20} color={ColorTokens.successGreen} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.securityTitle}>Your payment is 100% secure</Text>
            <Text style={styles.securitySub}>
              We use 256-bit Cashfree encryption to keep your details safe.
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* STICKY BOTTOM PAYMENT CTA */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bottomLabel}>Payable Amount</Text>
          <Text style={styles.bottomAmount}>₹1,347</Text>
        </View>

        <TouchableOpacity style={styles.payBtn} onPress={handlePayPress} activeOpacity={0.9}>
          <Text style={styles.payBtnText}>Pay ₹1,347 →</Text>
        </TouchableOpacity>
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
  stepperWrap: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: ColorTokens.border,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F3EBF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCompleted: {
    backgroundColor: ColorTokens.successGreen,
  },
  stepActive: {
    backgroundColor: ColorTokens.deepBerry,
  },
  stepNumberActive: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  stepLabelCompleted: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: ColorTokens.successGreen,
  },
  stepLabelActive: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: ColorTokens.deepBerry,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#F3EBF0',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: ColorTokens.successGreen,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  amountCard: {
    backgroundColor: ColorTokens.deepPlum,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FBE0DC',
  },
  amountValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#FFFFFF',
  },
  sectionHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: ColorTokens.mainText,
    marginTop: 6,
    marginBottom: 4,
  },
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: ColorTokens.border,
  },
  methodCardSelected: {
    borderColor: ColorTokens.deepBerry,
    backgroundColor: '#FFFDF9',
  },
  methodTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F7F3F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  methodSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D0C4CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: ColorTokens.deepBerry,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ColorTokens.deepBerry,
  },
  upiAppsContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#F3EFEF',
    gap: 8,
  },
  upiAppItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  upiAppItemSelected: {
    borderColor: ColorTokens.deepBerry,
    backgroundColor: '#FFF0F3',
  },
  upiAppName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: ColorTokens.mainText,
    flex: 1,
    marginLeft: 10,
  },
  miniRadioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniRadioSelected: {
    borderColor: ColorTokens.deepBerry,
  },
  miniRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ColorTokens.deepBerry,
  },
  addCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#F3EFEF',
  },
  addCardText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: ColorTokens.deepBerry,
  },
  codBadgeNote: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#F3EFEF',
  },
  codBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: ColorTokens.successGreen,
  },
  securityCard: {
    backgroundColor: ColorTokens.softGreen,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E8D5',
    marginTop: 8,
  },
  securityTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: ColorTokens.successGreen,
  },
  securitySub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.secondaryText,
    marginTop: 1,
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
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  bottomAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: ColorTokens.mainText,
  },
  payBtn: {
    backgroundColor: ColorTokens.deepBerry,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
