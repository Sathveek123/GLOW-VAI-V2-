import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Tag,
  Coins,
  CheckCircle2,
  Sparkles,
  Percent,
  Check,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  plum: '#5C2A91',
  softLavender: '#F2ECFA',
  coral: '#D4472C',
  gold: '#F59E0B',
  goldBg: '#FEF3C7',
  successGreen: '#2D9D5F',
  softGreen: '#E6F4EA',
  mainText: '#1A1A1A',
  secondaryText: '#6B6B6B',
  border: '#EDEBE6',
  cardBg: '#FFFFFF',
};

export const CouponCoinRedemptionScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const [inputCoupon, setInputCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('GLOW10');
  const [userCoinsBalance] = useState(250); // ₹250 worth of coins
  const [useCoins, setUseCoins] = useState(true);

  const cartSubtotal = 1499;
  const maxAllowedCoins = Math.min(userCoinsBalance, Math.round(cartSubtotal * 0.2)); // Max 20%
  const couponDiscount = appliedCoupon === 'GLOW10' ? 150 : appliedCoupon === 'WELCOME50' ? 200 : 0;
  const coinDiscount = useCoins ? maxAllowedCoins : 0;
  const totalSavings = couponDiscount + coinDiscount;

  const availableCoupons = [
    {
      code: 'GLOW10',
      title: 'Flat 10% OFF on Skincare',
      description: 'Save up to ₹150 on orders above ₹999',
      expiry: 'Expires in 2 days',
    },
    {
      code: 'WELCOME50',
      title: 'Flat ₹200 OFF First Order',
      description: 'Applicable on any order containing Serums',
      expiry: 'Valid for new users',
    },
    {
      code: 'DERMA20',
      title: '20% OFF Derma Formulations',
      description: 'Save up to ₹300 on Minimalist & Derma Co',
      expiry: 'Expires end of month',
    },
  ];

  const handleApplyCustomCoupon = () => {
    if (!inputCoupon.trim()) return;
    safeHapticImpact();
    setAppliedCoupon(inputCoupon.trim().toUpperCase());
    Alert.alert('✓ Coupon Applied!', `Promo code ${inputCoupon.trim().toUpperCase()} applied successfully.`);
  };

  const handleSelectCoupon = (code: string) => {
    safeHapticSelection();
    setAppliedCoupon(code);
  };

  const handleConfirmDiscounts = () => {
    safeHapticImpact();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(customer)/(tabs)/cart');
    }
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
              router.push('/(customer)/(tabs)/cart');
            }
          }}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Coupons & GlowVAI Coins</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* PROMO CODE INPUT BOX */}
        <View style={styles.inputCard}>
          <Text style={styles.cardHeading}>Enter Promo Code</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="e.g. GLOW10 or WELCOME50"
              placeholderTextColor="#A0A0A0"
              value={inputCoupon}
              onChangeText={setInputCoupon}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={handleApplyCustomCoupon}
              activeOpacity={0.85}
            >
              <Text style={styles.applyBtnText}>APPLY</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* GLOWVAI REFERRAL COINS CARD */}
        <View style={styles.coinsCard}>
          <View style={styles.coinsTopRow}>
            <View style={styles.coinIconBadge}>
              <Coins size={22} color={ColorTokens.gold} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.coinsTitle}>Redeem GlowVAI Coins</Text>
              <Text style={styles.coinsSub}>
                Balance: <Text style={{ fontFamily: 'Poppins-Bold' }}>₹{userCoinsBalance} Coins</Text> (Max ₹{maxAllowedCoins} per order)
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.checkbox, useCoins && styles.checkboxActive]}
              onPress={() => {
                safeHapticSelection();
                setUseCoins(!useCoins);
              }}
              activeOpacity={0.8}
            >
              {useCoins && <Check size={14} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>

          {useCoins && (
            <View style={styles.appliedCoinsBanner}>
              <Sparkles size={14} color={ColorTokens.gold} />
              <Text style={styles.appliedCoinsText}>
                Redeeming ₹{maxAllowedCoins} coins on this checkout!
              </Text>
            </View>
          )}
        </View>

        {/* SAVINGS SUMMARY PILL */}
        {totalSavings > 0 && (
          <View style={styles.savingsSummaryCard}>
            <CheckCircle2 size={18} color={ColorTokens.successGreen} />
            <Text style={styles.savingsSummaryText}>
              Total extra savings applied: <Text style={{ fontFamily: 'Poppins-Bold' }}>₹{totalSavings}</Text>
            </Text>
          </View>
        )}

        {/* AVAILABLE COUPONS LIST */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Available Coupons for You</Text>

          {availableCoupons.map((c) => {
            const isSelected = appliedCoupon === c.code;
            return (
              <View key={c.code} style={[styles.couponTicket, isSelected && styles.couponTicketSelected]}>
                <View style={styles.ticketLeft}>
                  <View style={styles.ticketTagBadge}>
                    <Tag size={16} color={ColorTokens.deepBerry} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.ticketCode}>{c.code}</Text>
                      {isSelected && (
                        <View style={styles.appliedTag}>
                          <Text style={styles.appliedTagText}>APPLIED ✓</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.ticketTitle}>{c.title}</Text>
                    <Text style={styles.ticketDesc}>{c.description}</Text>
                    <Text style={styles.ticketExpiry}>{c.expiry}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.ticketApplyBtn, isSelected && styles.ticketApplyBtnActive]}
                  onPress={() => handleSelectCoupon(c.code)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.ticketApplyText, isSelected && styles.ticketApplyTextActive]}>
                    {isSelected ? 'SELECTED' : 'APPLY'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTION */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bottomSavingsLabel}>Savings Applied</Text>
          <Text style={styles.bottomSavingsVal}>₹{totalSavings} Discount</Text>
        </View>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirmDiscounts}
          activeOpacity={0.9}
        >
          <Text style={styles.confirmBtnText}>Confirm Discounts →</Text>
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
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  cardHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    paddingHorizontal: 12,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  applyBtn: {
    backgroundColor: ColorTokens.deepBerry,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  coinsCard: {
    backgroundColor: ColorTokens.goldBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  coinsTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinsTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#92400E',
  },
  coinsSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
    marginTop: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#D97706',
  },
  appliedCoinsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#FDE047',
  },
  appliedCoinsText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#B45309',
  },
  savingsSummaryCard: {
    backgroundColor: ColorTokens.softGreen,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savingsSummaryText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: ColorTokens.successGreen,
  },
  section: {
    gap: 10,
  },
  sectionHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  couponTicket: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponTicketSelected: {
    borderColor: ColorTokens.deepBerry,
    backgroundColor: '#FFFDF9',
  },
  ticketLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 10,
  },
  ticketTagBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketCode: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.deepBerry,
    letterSpacing: 0.5,
  },
  appliedTag: {
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  appliedTagText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 8,
    color: ColorTokens.successGreen,
  },
  ticketTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.mainText,
    marginTop: 2,
  },
  ticketDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.secondaryText,
    marginTop: 1,
  },
  ticketExpiry: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: ColorTokens.coral,
    marginTop: 3,
  },
  ticketApplyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  ticketApplyBtnActive: {
    backgroundColor: ColorTokens.deepBerry,
    borderColor: ColorTokens.deepBerry,
  },
  ticketApplyText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: ColorTokens.secondaryText,
  },
  ticketApplyTextActive: {
    color: '#FFFFFF',
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
  },
  bottomSavingsLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  bottomSavingsVal: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: ColorTokens.successGreen,
  },
  confirmBtn: {
    backgroundColor: ColorTokens.coral,
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
