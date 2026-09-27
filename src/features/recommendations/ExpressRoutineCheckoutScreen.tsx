import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '../../design';
import { useCartStore } from '../../store/useCartStore';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RoutineItem {
  id: string;
  name: string;
  size: string;
  price: number;
}

const DEFAULT_ROUTINE_ITEMS: RoutineItem[] = [
  { id: 'p1', name: 'Gentle Hydrating Cleanser', size: '100ml', price: 349 },
  { id: 'p2', name: 'Niacinamide 10% Serum', size: '30ml', price: 599 },
  { id: 'p3', name: 'Sunscreen Gel SPF50 PA++++', size: '50g', price: 349 },
];

export const ExpressRoutineCheckoutScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const { addToCart } = useCartStore();

  const originalTotal = 1299;
  const discountAmount = 150;
  const payableTotal = 1149;

  const handlePayNow = () => {
    DEFAULT_ROUTINE_ITEMS.forEach(item => addToCart(item.id, 1));
    router.push('/(customer)/(tabs)/cart');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={[styles.header, { paddingTop: headerTopInset }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Colors.onboarding.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Express Routine Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Express ETA Banner */}
        <View style={styles.etaCard}>
          <Ionicons name="flash" size={18} color={Colors.shop.heroMaroon} />
          <Text style={styles.etaText}>⚡ 15-30 min express delivery available in Vijayawada</Text>
        </View>

        {/* Bundle Discount Badge */}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>🎉 Routine bundle saves ₹{discountAmount}</Text>
        </View>

        {/* Bundle Items List */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Clinically Recommended 3-Step Routine</Text>
          {DEFAULT_ROUTINE_ITEMS.map((item, idx) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>0{idx + 1}</Text>
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSize}>{item.size}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
          ))}
        </View>

        {/* Bill Summary */}
        <View style={styles.billCard}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Items Total (MRP)</Text>
            <Text style={styles.billValueStrike}>₹{originalTotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Bundle Savings</Text>
            <Text style={styles.billSavings}>-₹{discountAmount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.billRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{payableTotal}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Tap-to-Pay CTA */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={handlePayNow}
          activeOpacity={0.88}
        >
          <Text style={styles.payBtnText}>Click to Pay ₹{payableTotal}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ExpressRoutineCheckoutScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.onboarding.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.onboarding.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.headingLg,
    fontSize: 16,
    color: Colors.onboarding.textPrimary,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.onboarding.surfaceSubtle,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.onboarding.border,
  },
  etaText: {
    ...Typography.bodySm,
    color: Colors.shop.heroMaroon,
    fontWeight: '600',
  },
  discountBadge: {
    backgroundColor: Colors.status.successBg,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  discountText: {
    ...Typography.labelMd,
    color: Colors.status.success,
    fontWeight: '700',
  },
  cardSection: {
    backgroundColor: Colors.shop.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.onboarding.border,
    gap: 12,
  },
  sectionTitle: {
    ...Typography.headingSm,
    color: Colors.onboarding.textPrimary,
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.onboarding.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onboarding.primary,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    ...Typography.bodyMd,
    color: Colors.onboarding.textPrimary,
  },
  itemSize: {
    ...Typography.bodySm,
    color: Colors.onboarding.textSecondary,
  },
  itemPrice: {
    ...Typography.headingSm,
    color: Colors.onboarding.textPrimary,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.onboarding.border,
    gap: 10,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabel: {
    ...Typography.bodyMd,
    color: Colors.onboarding.textSecondary,
  },
  billValueStrike: {
    ...Typography.bodyMd,
    color: Colors.onboarding.textSecondary,
    textDecorationLine: 'line-through',
  },
  billSavings: {
    ...Typography.bodyMd,
    color: Colors.status.success,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.onboarding.border,
    marginVertical: 4,
  },
  totalLabel: {
    ...Typography.headingLg,
    color: Colors.onboarding.textPrimary,
  },
  totalValue: {
    ...Typography.headingLg,
    color: Colors.onboarding.primary,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.onboarding.border,
    backgroundColor: '#FFFFFF',
  },
  payBtn: {
    backgroundColor: Colors.shop.cartGreen,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: {
    ...Typography.headingMd,
    color: '#FFFFFF',
  },
});
