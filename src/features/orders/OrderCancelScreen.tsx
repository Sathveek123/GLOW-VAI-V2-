import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  AlertOctagon,
  CheckCircle2,
  Circle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  coral: '#D4472C',
  warningRed: '#DC2626',
  warningBg: '#FEE2E2',
  mainText: '#1A1A1A',
  secondaryText: '#6B6B6B',
  border: '#EDEBE6',
  cardBg: '#FFFFFF',
  successGreen: '#2D9D5F',
  softGreen: '#E6F4EA',
};

export const OrderCancelScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ orderId?: string }>();

  const orderId = params.orderId || 'GV28491';
  const [selectedReason, setSelectedReason] = useState<string>('Placed by mistake');
  const [isCancelled, setIsCancelled] = useState(false);

  const cancellationReasons = [
    'Placed by mistake / wrong address',
    'Estimated delivery time (ETA) is too long',
    'Changed mind / found better product',
    'Payment issue / duplicate order',
    'Want to change item quantity or shade',
  ];

  const handleConfirmCancellation = () => {
    safeHapticImpact();
    setIsCancelled(true);
    Alert.alert(
      '✓ Order Cancelled',
      `Order #${orderId} has been cancelled. Full refund of ₹1,347 initiated to your original payment method.`,
      [{ text: 'OK', onPress: () => router.replace('/(customer)/(tabs)' as any) }]
    );
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
              router.push('/(customer)/(tabs)' as any);
            }
          }}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Cancel Order #{orderId}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* WARNING CARD */}
        <View style={styles.warningCard}>
          <AlertOctagon size={24} color={ColorTokens.warningRed} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.warningTitle}>Cancellation Window Active</Text>
            <Text style={styles.warningSub}>
              You can cancel for free before Vijayawada Dark Store finishes packing your items.
            </Text>
          </View>
        </View>

        {/* CANCELLATION REASONS LIST */}
        <View style={styles.reasonsCard}>
          <Text style={styles.sectionTitle}>Select Reason for Cancellation:</Text>

          {cancellationReasons.map((reason) => {
            const isSelected = selectedReason === reason;
            return (
              <TouchableOpacity
                key={reason}
                style={[styles.reasonRow, isSelected && styles.reasonRowSelected]}
                onPress={() => {
                  safeHapticSelection();
                  setSelectedReason(reason);
                }}
                activeOpacity={0.85}
              >
                {isSelected ? (
                  <CheckCircle2 size={18} color={ColorTokens.warningRed} />
                ) : (
                  <Circle size={18} color={ColorTokens.secondaryText} />
                )}
                <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                  {reason}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* REFUND DETAILS NOTE CARD */}
        <View style={styles.refundCard}>
          <ShieldCheck size={20} color={ColorTokens.successGreen} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.refundTitle}>100% Instant Refund Guarantee</Text>
            <Text style={styles.refundSub}>
              ₹1,347 will be credited to your UPI / Bank Account within 2–4 hours.
            </Text>
          </View>
        </View>

        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTION */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={handleConfirmCancellation}
          activeOpacity={0.9}
        >
          <Text style={styles.cancelBtnText}>Confirm Order Cancellation</Text>
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
  warningCard: {
    backgroundColor: ColorTokens.warningBg,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  warningTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.warningRed,
  },
  warningSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.mainText,
    marginTop: 2,
  },
  reasonsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 10,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
    marginBottom: 4,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  reasonRowSelected: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  reasonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.secondaryText,
    flex: 1,
  },
  reasonTextSelected: {
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.warningRed,
  },
  refundCard: {
    backgroundColor: ColorTokens.softGreen,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E8D5',
  },
  refundTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.successGreen,
  },
  refundSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.mainText,
    marginTop: 2,
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
  },
  cancelBtn: {
    backgroundColor: ColorTokens.warningRed,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
