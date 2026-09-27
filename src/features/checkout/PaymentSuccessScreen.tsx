import React, { useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  CheckCircle2,
  Bike,
  MapPin,
  ChevronRight,
  Package,
  Bell,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../../state/cartStore';
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

export const PaymentSuccessScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const clearCart = useCartStore((state) => state.clearCart);

  const checkScale = useSharedValue(0.5);

  useEffect(() => {
    // Clear cart on successful order confirmation
    clearCart();

    checkScale.value = withSequence(
      withSpring(1.2, { damping: 6 }),
      withSpring(1, { damping: 8 })
    );
  }, []);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handleTrackOrder = () => {
    safeHapticImpact();
    router.push('/order-tracking' as any);
  };

  const handleContinueShopping = () => {
    safeHapticImpact();
    router.push('/(customer)/(tabs)' as any);
  };

  const bundlePreview = [
    { id: 'b1', image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=200&q=80', name: 'Serum' },
    { id: 'b2', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80', name: 'Moisturizer' },
    { id: 'b3', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=200&q=80', name: 'Lipstick' },
    { id: 'b4', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=200&q=80', name: 'SPF Gel' },
  ];

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset, height: undefined, minHeight: 64 }]}>
        <View style={styles.logoRow}>
          <Sparkles size={18} color={ColorTokens.gold} />
          <Text style={styles.logoText}>GlowVAI</Text>
        </View>

        <View style={styles.confirmedBadge}>
          <Text style={styles.confirmedBadgeText}>Order Confirmed ✓</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* CELEBRATORY GRADIENT HERO CARD */}
        <LinearGradient
          colors={['#FBE0DC', '#F2ECFA', '#FFFDF7']}
          style={styles.heroCard}
        >
          <Animated.View style={[styles.checkCircleOuter, checkAnimatedStyle]}>
            <View style={styles.checkCircleInner}>
              <CheckCircle2 size={44} color={ColorTokens.successGreen} />
            </View>
          </Animated.View>

          <Text style={styles.mainHeading}>Order confirmed!</Text>
          <Text style={styles.subHeading}>Your glow is on its way.</Text>

          <View style={styles.orderMetaRow}>
            <View style={styles.metaPill}>
              <Text style={styles.metaLabel}>Order No.</Text>
              <Text style={styles.metaValue}>#GV28491</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaPill}>
              <Text style={styles.metaLabel}>Amount Paid</Text>
              <Text style={styles.metaValue}>₹1,347</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 10 MIN EXPRESS DELIVERY CARD */}
        <View style={styles.deliveryCard}>
          <View style={styles.deliveryTopRow}>
            <View style={styles.scooterIconCircle}>
              <Bike size={22} color={ColorTokens.deepBerry} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.deliveryTitle}>Arriving in 10 minutes</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <MapPin size={12} color={ColorTokens.secondaryText} />
                <Text style={styles.deliveryAddress}>Home · Vijayawada</Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.deliveryProgressWrap}>
            <View style={styles.deliveryTrack}>
              <View style={styles.deliveryFill} />
            </View>
            <View style={styles.deliveryStepLabels}>
              <Text style={styles.stepActive}>Packed</Text>
              <Text style={styles.stepActive}>Out for Delivery</Text>
              <Text style={styles.stepUpcoming}>Arrived</Text>
            </View>
          </View>
        </View>

        {/* PRODUCT BUNDLE PREVIEW */}
        <View style={styles.bundleCard}>
          <View style={styles.bundleHeaderRow}>
            <Package size={16} color={ColorTokens.plumPurple} />
            <Text style={styles.bundleTitle}>Ordered Products (4)</Text>
          </View>

          <View style={styles.bundleImagesRow}>
            {bundlePreview.map((item) => (
              <View key={item.id} style={styles.bundleThumbWrap}>
                <Image source={{ uri: item.image }} style={styles.bundleThumb} resizeMode="contain" />
              </View>
            ))}
          </View>
        </View>

        {/* NOTIFICATION MESSAGE */}
        <View style={styles.noticeCard}>
          <Bell size={16} color={ColorTokens.deepBerry} />
          <Text style={styles.noticeText}>
            We've sent your order confirmation receipt to your registered phone & WhatsApp.
          </Text>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionsWrap}>
          <TouchableOpacity style={styles.trackBtn} onPress={handleTrackOrder} activeOpacity={0.9}>
            <Text style={styles.trackBtnText}>Track Order Live →</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.continueBtn} onPress={handleContinueShopping} activeOpacity={0.8}>
            <Text style={styles.continueBtnText}>Continue Shopping</Text>
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
  confirmedBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  confirmedBadgeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: ColorTokens.gold,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  heroCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  checkCircleOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(21,148,71,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  checkCircleInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ColorTokens.successGreen,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  mainHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: ColorTokens.mainText,
  },
  subHeading: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: ColorTokens.secondaryText,
    marginTop: 4,
  },
  orderMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  metaPill: {
    alignItems: 'center',
  },
  metaLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  metaValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: ColorTokens.border,
    marginHorizontal: 20,
  },
  deliveryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  deliveryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scooterIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ColorTokens.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: ColorTokens.mainText,
  },
  deliveryAddress: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: ColorTokens.secondaryText,
    marginLeft: 4,
  },
  deliveryProgressWrap: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#F3EFEF',
  },
  deliveryTrack: {
    height: 6,
    backgroundColor: '#F3EBF0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  deliveryFill: {
    width: '65%',
    height: '100%',
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 3,
  },
  deliveryStepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stepActive: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: ColorTokens.deepBerry,
  },
  stepUpcoming: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  bundleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  bundleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  bundleTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  bundleImagesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bundleThumbWrap: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: ColorTokens.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  bundleThumb: {
    width: '100%',
    height: '100%',
  },
  noticeCard: {
    backgroundColor: ColorTokens.softGreen,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#C8E8D5',
  },
  noticeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    lineHeight: 16,
    color: ColorTokens.successGreen,
    flex: 1,
  },
  actionsWrap: {
    gap: 10,
    marginTop: 8,
  },
  trackBtn: {
    backgroundColor: ColorTokens.deepBerry,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  continueBtn: {
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: ColorTokens.border,
  },
  continueBtnText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
});
