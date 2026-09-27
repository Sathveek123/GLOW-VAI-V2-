import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Zap,
  Clock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Bike,
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

export const CheckoutReviewScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth > 768;

  const handleContinueToPayment = () => {
    safeHapticImpact();
    router.push('/payment-method' as any);
  };

  const orderItems = [
    {
      id: 'chk1',
      name: 'Maybelline Color Sensational Creamy Matte Lipstick',
      variant: 'Shade 657 · 3.9g',
      qty: 1,
      price: 399,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'chk2',
      name: 'Neutrogena Hydro Boost Water Gel',
      variant: '50g Jar',
      qty: 1,
      price: 799,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'chk3',
      name: "L'Oréal Paris Lash Paradise Mascara",
      variant: 'Blackest Black · 7.6ml',
      qty: 1,
      price: 399,
      image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=300&q=80',
    },
  ];

  if (isDesktopWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: ColorTokens.warmIvory }}>
        <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

        {/* DESKTOP HEADER BAR */}
        <View style={{ backgroundColor: ColorTokens.deepBerry, paddingVertical: 16, paddingHorizontal: 32 }}>
          <View style={{ maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  if (router.canGoBack()) router.back();
                  else router.push('/(customer)/(tabs)/cart' as any);
                }}
                activeOpacity={0.8}
              >
                <ArrowLeft size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Sparkles size={20} color={ColorTokens.gold} />
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: '#FFFFFF' }}>GlowVAI</Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)' }}>|</Text>
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 16, color: '#FFFFFF' }}>Review & Confirm Order</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CHECKOUT STEPPER BAR */}
        <View style={{ backgroundColor: '#FFFFFF', paddingVertical: 12, borderBottomWidth: 1, borderColor: ColorTokens.border }}>
          <View style={{ maxWidth: 600, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepCompleted]}>
                <CheckCircle2 size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.stepLabelCompleted}>1. Cart</Text>
            </View>
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepActive]}>
                <Text style={styles.stepNumberActive}>2</Text>
              </View>
              <Text style={styles.stepLabelActive}>2. Review</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepItem}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNumberInactive}>3</Text>
              </View>
              <Text style={styles.stepLabelInactive}>3. Payment</Text>
            </View>
          </View>
        </View>

        {/* MAIN DESKTOP 2-COLUMN SPLIT */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={{ maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', padding: 32, gap: 32 }}>
            {/* LEFT COLUMN: ADDRESS & ITEMS (60%) */}
            <View style={{ flex: 1.4, gap: 20 }}>
              {/* ADDRESS */}
              <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MapPin size={18} color={ColorTokens.deepBerry} />
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: ColorTokens.mainText }}>Delivery Address (Home)</Text>
                  </View>
                  <TouchableOpacity onPress={() => router.push('/saved-addresses')}>
                    <Text style={styles.editAction}>Change Address</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: ColorTokens.secondaryText, marginTop: 4 }}>
                  Plot No. 12, Sri Sai Residency, MG Road, Vijayawada, Andhra Pradesh 520010
                </Text>
              </View>

              {/* 10 MIN PROMISE */}
              <View style={styles.promiseCard}>
                <View style={styles.promiseLeft}>
                  <Zap size={24} color={ColorTokens.plumPurple} fill={ColorTokens.plumPurple} />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: ColorTokens.plumPurple }}>Lightning 10-Minute Instant Drop</Text>
                    <Text style={styles.promiseSub}>Dispatched from Darkstore A · Real-time rider tracking</Text>
                  </View>
                </View>
                <Bike size={32} color={ColorTokens.plumPurple} />
              </View>

              {/* ITEMS REVIEW */}
              <View style={styles.card}>
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: ColorTokens.mainText, marginBottom: 12 }}>
                  Order Items ({orderItems.length})
                </Text>
                {orderItems.map((item, idx) => (
                  <View key={item.id} style={[styles.itemRow, idx < orderItems.length - 1 && styles.itemBorder]}>
                    <Image source={{ uri: item.image }} style={{ width: 64, height: 64, borderRadius: 10, backgroundColor: '#FAFAFA' }} resizeMode="contain" />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: ColorTokens.mainText }}>{item.name}</Text>
                      <Text style={styles.itemVariant}>{item.variant}</Text>
                      <View style={styles.itemQtyPriceRow}>
                        <Text style={styles.itemQty}>Quantity: {item.qty}</Text>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: ColorTokens.mainText }}>₹{item.price * item.qty}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* RIGHT COLUMN: COUPON & BILL SUMMARY (40%) */}
            <View style={{ flex: 1, gap: 20 }}>
              {/* COUPON */}
              <View style={styles.couponCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Tag size={20} color={ColorTokens.successGreen} />
                  <View>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: ColorTokens.successGreen }}>GLOW10 Applied</Text>
                    <Text style={styles.couponSub}>You saved 10% (₹159) on this order</Text>
                  </View>
                </View>
              </View>

              {/* BILL SUMMARY */}
              <View style={styles.card}>
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: ColorTokens.mainText, marginBottom: 12 }}>Order Bill Breakdown</Text>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Items Subtotal</Text>
                  <Text style={styles.billValue}>₹1,597</Text>
                </View>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Discounts & Coupon</Text>
                  <Text style={[styles.billValue, { color: ColorTokens.successGreen }]}>-₹159</Text>
                </View>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Express 10-Min Delivery</Text>
                  <Text style={[styles.billValue, { color: ColorTokens.successGreen }]}>FREE</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                  <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: ColorTokens.mainText }}>Total Amount</Text>
                  <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 22, color: ColorTokens.deepBerry }}>₹1,438</Text>
                </View>

                <TouchableOpacity
                  style={{ backgroundColor: ColorTokens.deepBerry, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}
                  onPress={handleContinueToPayment}
                  activeOpacity={0.9}
                >
                  <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#FFFFFF' }}>
                    PROCEED TO PAYMENT →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }



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
              router.push('/(customer)/(tabs)/cart' as any);
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
          <Text style={styles.headerTitle}>Review Order</Text>
        </View>
      </View>

      {/* CHECKOUT STEPPER (Step 2 Active) */}
      <View style={styles.stepperWrap}>
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, styles.stepCompleted]}>
            <CheckCircle2 size={14} color="#FFFFFF" />
          </View>
          <Text style={styles.stepLabelCompleted}>Cart</Text>
        </View>

        <View style={[styles.stepLine, styles.stepLineActive]} />

        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, styles.stepActive]}>
            <Text style={styles.stepNumberActive}>2</Text>
          </View>
          <Text style={styles.stepLabelActive}>Review</Text>
        </View>

        <View style={styles.stepLine} />

        <View style={styles.stepItem}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumberInactive}>3</Text>
          </View>
          <Text style={styles.stepLabelInactive}>Pay</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* DELIVERY ADDRESS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MapPin size={16} color={ColorTokens.deepBerry} />
              <Text style={styles.cardTitle}>Home · Vijayawada</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/saved-addresses')}>
              <Text style={styles.editAction}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.cardText}>
            Plot No. 12, Sri Sai Residency, MG Road, Vijayawada, Andhra Pradesh 520010
          </Text>
        </View>

        {/* DELIVERY PROMISE CARD */}
        <View style={styles.promiseCard}>
          <View style={styles.promiseLeft}>
            <Zap size={22} color={ColorTokens.plumPurple} fill={ColorTokens.plumPurple} />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.promiseTitle}>10-minute delivery</Text>
              <Text style={styles.promiseSub}>Fast. Fresh. Fabulous.</Text>
            </View>
          </View>
          <Bike size={28} color={ColorTokens.plumPurple} />
        </View>

        {/* DELIVERY SLOT CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Clock size={16} color={ColorTokens.deepBerry} />
              <Text style={styles.cardTitle}>Deliver by 10:45 AM</Text>
            </View>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.editAction}>Change</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.cardText}>Today, 10:30 AM – 10:45 AM</Text>
        </View>

        {/* ORDER ITEMS LIST */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Items ({orderItems.length})</Text>

          {orderItems.map((item, idx) => (
            <View
              key={item.id}
              style={[styles.itemRow, idx < orderItems.length - 1 && styles.itemBorder]}
            >
              <Image source={{ uri: item.image }} style={styles.itemImg} resizeMode="contain" />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemVariant}>{item.variant}</Text>
                <View style={styles.itemQtyPriceRow}>
                  <Text style={styles.itemQty}>Qty: {item.qty}</Text>
                  <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* COUPON APPLIED ROW */}
        <View style={styles.couponCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Tag size={18} color={ColorTokens.successGreen} />
            <View>
              <Text style={styles.couponTitle}>Coupon Applied</Text>
              <Text style={styles.couponSub}>GLOW10 · 10% OFF (up to ₹150)</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.couponSavings}>-₹159</Text>
            <ChevronRight size={14} color={ColorTokens.secondaryText} />
          </View>
        </View>

        {/* BILL DETAILS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bill Details</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Items Total</Text>
            <Text style={styles.billValue}>₹1,597</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Discounts & Coupons</Text>
            <Text style={[styles.billValue, { color: ColorTokens.successGreen }]}>-₹159</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Charge</Text>
            <Text style={[styles.billValue, { color: ColorTokens.successGreen }]}>FREE</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹1,438</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* STICKY BOTTOM CTA */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bottomSubtext}>You can change payment method next</Text>
          <Text style={styles.bottomTotal}>Total: ₹1,438</Text>
        </View>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinueToPayment}
          activeOpacity={0.9}
        >
          <Text style={styles.continueBtnText}>Continue to Payment →</Text>
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
  stepNumberInactive: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: ColorTokens.secondaryText,
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
  stepLabelInactive: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
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
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  editAction: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: ColorTokens.deepBerry,
  },
  cardText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 17,
    color: ColorTokens.secondaryText,
  },
  promiseCard: {
    backgroundColor: ColorTokens.softLavender,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2D1FC',
  },
  promiseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promiseTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.plumPurple,
  },
  promiseSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderColor: '#F5EFEF',
  },
  itemImg: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  itemName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.mainText,
  },
  itemVariant: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
    marginTop: 1,
  },
  itemQtyPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  itemQty: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  itemPrice: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  couponCard: {
    backgroundColor: ColorTokens.softGreen,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#C8E8D5',
  },
  couponTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.successGreen,
  },
  couponSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  couponSavings: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.successGreen,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  billLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: ColorTokens.secondaryText,
  },
  billValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.mainText,
  },
  divider: {
    height: 1,
    backgroundColor: ColorTokens.border,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  totalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: ColorTokens.deepBerry,
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
  bottomSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.secondaryText,
  },
  bottomTotal: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: ColorTokens.mainText,
  },
  continueBtn: {
    backgroundColor: ColorTokens.deepBerry,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
