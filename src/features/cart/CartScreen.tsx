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
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Zap,
  Truck,
  Trash2,
  Heart,
  Tag,
  ChevronRight,
  ShieldCheck,
  Plus,
  Minus,
  ShoppingBag,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../../state/cartStore';
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

export const CartScreen: React.FC = () => {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const { items, incrementItem, decrementItem, removeItem, clearCart } = useCartStore();

  const isDesktopWeb = Platform.OS === 'web' && windowWidth > 768;

  const [couponApplied, setCouponApplied] = useState(true);
  const [couponCode, setCouponCode] = useState('GLOW10');

  const cartItemsList = Object.values(items || {});
  const displayItems =
    cartItemsList.length > 0
      ? cartItemsList.map((item) => ({
          productId: item.productId,
          name: item.name,
          brand: item.brand,
          price: item.price,
          mrp: item.mrp ?? item.price + 100,
          quantity: item.quantity,
          image: item.image,
        }))
      : [
          {
            productId: 'c_item1',
            name: 'The Ordinary Hyaluronic Acid 2% + B5 Hydration Serum',
            brand: 'The Ordinary',
            price: 699,
            mrp: 900,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
          },
          {
            productId: 'c_item2',
            name: "L'Oréal Paris Revitalift Hyaluronic Acid Day Cream",
            brand: "L'Oréal Paris",
            price: 899,
            mrp: 1199,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
          },
          {
            productId: 'c_item3',
            name: 'Maybelline Color Sensational Creamy Matte Lipstick (Shade 657)',
            brand: 'Maybelline',
            price: 399,
            mrp: 499,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
          },
        ];

  const itemTotal = displayItems.reduce((acc, item) => acc + item.mrp * item.quantity, 0);
  const discountedTotal = displayItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const catalogSavings = itemTotal - discountedTotal;
  const couponDiscount = couponApplied ? Math.min(150, Math.round(discountedTotal * 0.1)) : 0;
  const freeDeliveryThreshold = 2198;
  const isFreeDelivery = discountedTotal >= freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : 49;
  const grandTotal = discountedTotal - couponDiscount + deliveryFee;
  const totalSavings = catalogSavings + couponDiscount + (isFreeDelivery ? 49 : 0);

  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - discountedTotal);
  const freeDeliveryProgress = Math.min(1, discountedTotal / freeDeliveryThreshold);

  const handleApplyCoupon = () => {
    safeHapticImpact();
    setCouponApplied(!couponApplied);
  };

  const handleProceedToCheckout = () => {
    safeHapticImpact();
    router.push('/checkout-review' as any);
  };

  if (displayItems.length === 0) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />
        <View style={styles.emptyWrap}>
          <ShoppingBag size={64} color={ColorTokens.deepBerry} />
          <Text style={styles.emptyTitle}>Your cart is waiting to glow</Text>
          <Text style={styles.emptySub}>
            Add your beauty essentials and get them delivered fast in 10 minutes.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => {
              safeHapticImpact();
              router.push('/(customer)/(tabs)');
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyBtnText}>Start Shopping →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // DESKTOP WIDESCREEN WEB LAYOUT
  if (isDesktopWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: ColorTokens.warmIvory }}>
        <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

        {/* DESKTOP BRAND HEADER */}
        <View style={{ backgroundColor: ColorTokens.deepBerry, paddingVertical: 16, paddingHorizontal: 32 }}>
          <View style={{ maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  if (router.canGoBack()) router.back();
                  else router.push('/(customer)/(tabs)' as any);
                }}
                activeOpacity={0.8}
              >
                <ArrowLeft size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: '#FFFFFF' }}>
                Your Shopping Cart & Checkout
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 }}>
                <MapPin size={14} color="#FBE0DC" />
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#FBE0DC' }}>Delivering to Vijayawada</Text>
              </View>
              <View style={styles.headerEtaBadge}>
                <Zap size={12} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.headerEtaText}>10 MIN DARK STORE DISPATCH</Text>
              </View>
            </View>
          </View>
        </View>

        {/* MAIN 2-COLUMN E-COMMERCE CHECKOUT */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 32 }}>
          <View style={{ maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', gap: 32 }}>
            
            {/* LEFT COLUMN: CART ITEMS & DELIVERY ADDRESS (60% width) */}
            <View style={{ flex: 3, gap: 20 }}>
              {/* FREE DELIVERY PROGRESS */}
              <View style={styles.progressCard}>
                <View style={styles.progressTopRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Truck size={18} color={ColorTokens.deepBerry} />
                    <Text style={[styles.progressText, { fontSize: 13 }]}>
                      {amountNeededForFreeDelivery > 0
                        ? `Add ₹${amountNeededForFreeDelivery} more for FREE express delivery`
                        : '🎉 You unlocked FREE Express 10-Min Delivery!'}
                    </Text>
                  </View>
                  <Text style={styles.progressAmount}>₹{discountedTotal} / ₹{freeDeliveryThreshold}</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${freeDeliveryProgress * 100}%` }]} />
                </View>
              </View>

              {/* CART ITEMS LIST */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionHeading}>Items in your cart ({displayItems.length})</Text>

                {displayItems.map((item, idx) => (
                  <View key={item.productId} style={[styles.itemRow, idx < displayItems.length - 1 && styles.itemBorder, { paddingVertical: 16 }]}>
                    <Image source={{ uri: item.image }} style={{ width: 84, height: 84, borderRadius: 12, backgroundColor: '#FAFAFA' }} resizeMode="contain" />

                    <View style={styles.itemContent}>
                      <View style={styles.itemMetaRow}>
                        <Text style={[styles.brandName, { fontSize: 12 }]}>{item.brand}</Text>
                        <View style={styles.expressBadge}>
                          <Zap size={9} color="#FFFFFF" fill="#FFFFFF" />
                          <Text style={styles.expressText}>EXPRESS 10 MIN</Text>
                        </View>
                      </View>

                      <Text style={[styles.itemName, { fontSize: 14, lineHeight: 18 }]} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Text style={[styles.itemDeliveryPromise, { fontSize: 11, marginTop: 4 }]}>⚡ Dark Store Dispatch in 10 mins</Text>

                      <View style={[styles.priceAndStepperRow, { marginTop: 12 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={[styles.itemPrice, { fontSize: 16 }]}>₹{item.price * item.quantity}</Text>
                          <Text style={[styles.itemMrp, { fontSize: 12 }]}>₹{item.mrp * item.quantity}</Text>
                          <Text style={[styles.itemDiscount, { fontSize: 11 }]}>
                            {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                          </Text>
                        </View>

                        <View style={[styles.stepperContainer, { paddingHorizontal: 10, paddingVertical: 5, gap: 14 }]}>
                          <TouchableOpacity style={styles.stepperBtn} onPress={() => { safeHapticSelection(); decrementItem(item.productId); }}>
                            <Minus size={14} color={ColorTokens.mainText} />
                          </TouchableOpacity>
                          <Text style={[styles.stepperQty, { fontSize: 14 }]}>{item.quantity}</Text>
                          <TouchableOpacity style={styles.stepperBtn} onPress={() => { safeHapticSelection(); incrementItem(item.productId); }}>
                            <Plus size={14} color={ColorTokens.mainText} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* DELIVERY ADDRESS */}
              <View style={styles.sectionCard}>
                <View style={styles.addressHeaderRow}>
                  <Text style={styles.sectionHeading}>Delivery Address</Text>
                  <TouchableOpacity onPress={() => router.push('/saved-addresses')}>
                    <Text style={styles.editActionText}>Change Address</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.addressBody}>
                  <View style={styles.addressTagPill}>
                    <Text style={styles.addressTagText}>HOME</Text>
                  </View>
                  <Text style={[styles.addressText, { fontSize: 13 }]} numberOfLines={2}>
                    #12–8–17, Sri Sai Residency, Near Benz Circle, Vijayawada, Andhra Pradesh – 520010
                  </Text>
                </View>
              </View>
            </View>

            {/* RIGHT COLUMN: STICKY ORDER SUMMARY (40% width) */}
            <View style={{ flex: 2, gap: 20 }}>
              {/* COUPON CARD */}
              <View style={styles.rewardsCard}>
                <View style={styles.rewardsLeft}>
                  <View style={styles.rewardsIconCircle}>
                    <Tag size={18} color={ColorTokens.plumPurple} />
                  </View>
                  <View>
                    <Text style={styles.rewardsTitle}>Glow Rewards Coupon</Text>
                    <Text style={styles.rewardsSub}>Use exclusive coupon & save more!</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.couponPillBtn} onPress={handleApplyCoupon} activeOpacity={0.8}>
                  <Text style={styles.couponCodeText}>{couponCode}</Text>
                  <Text style={styles.couponActionText}>{couponApplied ? 'APPLIED ✓' : 'APPLY'}</Text>
                </TouchableOpacity>
              </View>

              {/* BILL SUMMARY CARD */}
              <View style={[styles.sectionCard, { borderRadius: 20, padding: 24, elevation: 4 }]}>
                <Text style={[styles.sectionHeading, { fontSize: 17, marginBottom: 16 }]}>Order Summary</Text>

                <View style={[styles.billRow, { marginBottom: 10 }]}>
                  <Text style={styles.billLabel}>Item Total</Text>
                  <Text style={styles.billValue}>₹{itemTotal}</Text>
                </View>

                <View style={[styles.billRow, { marginBottom: 10 }]}>
                  <Text style={styles.billLabel}>Catalog Discount</Text>
                  <Text style={[styles.billValue, { color: ColorTokens.successGreen }]}>-₹{catalogSavings}</Text>
                </View>

                {couponApplied && (
                  <View style={[styles.billRow, { marginBottom: 10 }]}>
                    <Text style={styles.billLabel}>Coupon ({couponCode})</Text>
                    <Text style={[styles.billValue, { color: ColorTokens.successGreen }]}>-₹{couponDiscount}</Text>
                  </View>
                )}

                <View style={[styles.billRow, { marginBottom: 10 }]}>
                  <Text style={styles.billLabel}>Express Delivery</Text>
                  <Text style={styles.billValue}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</Text>
                </View>

                <View style={[styles.savingsBanner, { paddingVertical: 10, paddingHorizontal: 12, marginVertical: 8 }]}>
                  <ShieldCheck size={16} color={ColorTokens.successGreen} />
                  <Text style={[styles.savingsBannerText, { fontSize: 12 }]}>You save ₹{totalSavings} on this order</Text>
                </View>

                <View style={styles.divider} />

                <View style={[styles.totalRow, { marginVertical: 8 }]}>
                  <Text style={[styles.totalLabel, { fontSize: 18 }]}>Grand Total</Text>
                  <Text style={[styles.totalValue, { fontSize: 24 }]}>₹{grandTotal}</Text>
                </View>

                <TouchableOpacity
                  style={[styles.checkoutBtn, { height: 52, borderRadius: 26, marginTop: 16 }]}
                  onPress={handleProceedToCheckout}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.checkoutBtnText, { fontSize: 15 }]}>Proceed to Checkout →</Text>
                </TouchableOpacity>

                <View style={{ marginTop: 16, alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 11, color: ColorTokens.secondaryText }}>
                    🔒 256-Bit SSL Encrypted & 100% Authentic Clinical Formulations
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER: BERRY/PLUM HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(headerTopInset, 16), paddingBottom: 16, height: undefined, minHeight: 76 }]}>
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

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <MapPin size={12} color="#FBE0DC" />
            <Text style={styles.headerLocation}>Delivering to Vijayawada</Text>
          </View>
        </View>

        <View style={styles.headerEtaBadge}>
          <Zap size={10} color="#FFFFFF" fill="#FFFFFF" />
          <Text style={styles.headerEtaText}>10 MIN</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* FREE DELIVERY PROGRESS CARD */}
        <View style={styles.progressCard}>
          <View style={styles.progressTopRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Truck size={16} color={ColorTokens.deepBerry} />
              <Text style={styles.progressText}>
                {amountNeededForFreeDelivery > 0
                  ? `Add ₹${amountNeededForFreeDelivery} more for FREE delivery`
                  : '🎉 You earned FREE Express 10-Min Delivery!'}
              </Text>
            </View>
            <Text style={styles.progressAmount}>₹{discountedTotal} / ₹{freeDeliveryThreshold}</Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${freeDeliveryProgress * 100}%` }]} />
          </View>
        </View>

        {/* CART ITEMS SECTION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Items in your cart ({displayItems.length})</Text>

          {displayItems.map((item, idx) => (
            <View
              key={item.productId}
              style={[styles.itemRow, idx < displayItems.length - 1 && styles.itemBorder]}
            >
              <Image source={{ uri: item.image }} style={styles.itemImg} resizeMode="contain" />

              <View style={styles.itemContent}>
                <View style={styles.itemMetaRow}>
                  <Text style={styles.brandName}>{item.brand}</Text>
                  <View style={styles.expressBadge}>
                    <Zap size={8} color="#FFFFFF" fill="#FFFFFF" />
                    <Text style={styles.expressText}>EXPRESS</Text>
                  </View>
                </View>

                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>

                <Text style={styles.itemDeliveryPromise}>⚡ Delivery in 10 mins</Text>

                <View style={styles.priceAndStepperRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                    <Text style={styles.itemMrp}>₹{item.mrp * item.quantity}</Text>
                    <Text style={styles.itemDiscount}>
                      {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                    </Text>
                  </View>

                  <View style={styles.stepperContainer}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => {
                        safeHapticSelection();
                        decrementItem(item.productId);
                      }}
                      activeOpacity={0.7}
                    >
                      <Minus size={12} color={ColorTokens.mainText} />
                    </TouchableOpacity>

                    <Text style={styles.stepperQty}>{item.quantity}</Text>

                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => {
                        safeHapticSelection();
                        incrementItem(item.productId);
                      }}
                      activeOpacity={0.7}
                    >
                      <Plus size={12} color={ColorTokens.mainText} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* GLOW REWARDS COUPON CARD */}
        <View style={styles.rewardsCard}>
          <View style={styles.rewardsLeft}>
            <View style={styles.rewardsIconCircle}>
              <Tag size={16} color={ColorTokens.plumPurple} />
            </View>
            <View>
              <Text style={styles.rewardsTitle}>Glow Rewards</Text>
              <Text style={styles.rewardsSub}>Use your exclusive coupon & save more!</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.couponPillBtn} onPress={handleApplyCoupon} activeOpacity={0.8}>
            <Text style={styles.couponCodeText}>{couponCode}</Text>
            <Text style={styles.couponActionText}>{couponApplied ? 'APPLIED ✓' : 'APPLY'}</Text>
          </TouchableOpacity>
        </View>

        {/* DELIVERY ADDRESS CARD */}
        <View style={styles.sectionCard}>
          <View style={styles.addressHeaderRow}>
            <Text style={styles.sectionHeading}>Delivery Address</Text>
            <TouchableOpacity onPress={() => router.push('/saved-addresses')}>
              <Text style={styles.editActionText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressBody}>
            <View style={styles.addressTagPill}>
              <Text style={styles.addressTagText}>HOME</Text>
            </View>
            <Text style={styles.addressText} numberOfLines={2}>
              #12–8–17, Sri Sai Residency, Near Benz Circle, Vijayawada, Andhra Pradesh – 520010
            </Text>
          </View>
        </View>

        {/* BILL SUMMARY CARD */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Bill Summary</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{itemTotal}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Catalog Discount</Text>
            <Text style={[styles.billValue, { color: ColorTokens.successGreen }]}>-₹{catalogSavings}</Text>
          </View>

          {couponApplied && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Coupon Discount ({couponCode})</Text>
              <Text style={[styles.billValue, { color: ColorTokens.successGreen }]}>-₹{couponDiscount}</Text>
            </View>
          )}

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</Text>
          </View>

          <View style={styles.savingsBanner}>
            <ShieldCheck size={14} color={ColorTokens.successGreen} />
            <Text style={styles.savingsBannerText}>You save ₹{totalSavings} on this order</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₹{grandTotal}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* STICKY BOTTOM CHECKOUT CTA */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bottomTotalLabel}>Total Payable</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.bottomTotalValue}>₹{grandTotal}</Text>
            <Text style={styles.bottomSavingsBadge}>SAVED ₹{totalSavings}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleProceedToCheckout}
          activeOpacity={0.9}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    height: 64,
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
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  headerLocation: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#FBE0DC',
    marginLeft: 4,
  },
  headerEtaBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerEtaText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: ColorTokens.mainText,
  },
  progressAmount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#F3EBF0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 3,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  sectionHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: ColorTokens.mainText,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderColor: '#F5EFEF',
  },
  itemImg: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
  },
  itemContent: {
    flex: 1,
  },
  itemMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  expressBadge: {
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  expressText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 8,
    color: '#FFFFFF',
  },
  itemName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    lineHeight: 17,
    color: ColorTokens.mainText,
    marginTop: 2,
  },
  itemDeliveryPromise: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.successGreen,
    marginTop: 2,
  },
  priceAndStepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemPrice: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  itemMrp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
    textDecorationLine: 'line-through',
  },
  itemDiscount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: ColorTokens.successGreen,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F3F6',
    borderRadius: 14,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 10,
  },
  stepperBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQty: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: ColorTokens.mainText,
  },
  rewardsCard: {
    backgroundColor: ColorTokens.softLavender,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2D1FC',
  },
  rewardsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rewardsIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardsTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.plumPurple,
  },
  rewardsSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  couponPillBtn: {
    backgroundColor: ColorTokens.plumPurple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  couponCodeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: ColorTokens.gold,
  },
  couponActionText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  addressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  editActionText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: ColorTokens.deepBerry,
  },
  addressBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addressTagPill: {
    backgroundColor: '#F3EBF0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  addressTagText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: ColorTokens.deepBerry,
  },
  addressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: ColorTokens.mainText,
    flex: 1,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: ColorTokens.secondaryText,
  },
  billValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  savingsBanner: {
    backgroundColor: ColorTokens.softGreen,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  savingsBannerText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: ColorTokens.successGreen,
  },
  divider: {
    height: 1,
    backgroundColor: ColorTokens.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: ColorTokens.mainText,
  },
  totalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
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
  bottomTotalLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  bottomTotalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: ColorTokens.mainText,
  },
  bottomSavingsBadge: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: ColorTokens.successGreen,
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  checkoutBtn: {
    backgroundColor: ColorTokens.deepBerry,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  emptyWrap: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: ColorTokens.mainText,
    marginTop: 16,
  },
  emptySub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: ColorTokens.secondaryText,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyBtn: {
    marginTop: 24,
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
