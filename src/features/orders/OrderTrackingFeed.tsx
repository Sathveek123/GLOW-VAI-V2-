/**
 * Screen B: Pre-Rider Assignment Vertical Order Status Timeline Feed
 * Automatically transitions to OrderTrackingLive when status flips to OUT_FOR_DELIVERY
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { ChevronLeft, CheckCircle2, Clock, Package, Truck, Check } from 'lucide-react-native';
import { ModeB, Spacing, Typography, BorderRadius, Colors, StatusColors } from '../../design';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

export type OrderStatusStep = 'PLACED' | 'CONFIRMED' | 'PACKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface OrderTrackingFeedProps {
  orderId?: string;
  onBack?: () => void;
  onTransitionToLiveMap?: () => void;
}

interface TimelineStepItem {
  id: OrderStatusStep;
  label: string;
  sublabel: string;
  timeString?: string;
}

const STEPS: TimelineStepItem[] = [
  { id: 'PLACED', label: 'Order Placed', sublabel: 'Order received by payikapuram darkstore' },
  { id: 'CONFIRMED', label: 'Order Confirmed', sublabel: 'Payment verified & inventory allocated' },
  { id: 'PACKED', label: 'Preparing Your Order', sublabel: 'Items packed in tamper-proof bag' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', sublabel: 'Rider assigned & en route to address' },
  { id: 'DELIVERED', label: 'Delivered', sublabel: 'Handed over at doorstep' },
];

export const OrderTrackingFeed: React.FC<OrderTrackingFeedProps> = ({
  orderId = 'ord_1001',
  onBack,
  onTransitionToLiveMap,
}) => {
  const [currentStep, setCurrentStep] = useState<OrderStatusStep>('PACKED');
  const [placedTime, setPlacedTime] = useState('6:47 PM');
  const [confirmedTime, setConfirmedTime] = useState('6:48 PM');

  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulsing animation for current active step
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Real-time Firestore order status listener
  useEffect(() => {
    if (!orderId) return;

    const orderRef = doc(db, 'orders', orderId);
    const unsubscribe = onSnapshot(orderRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.status) {
          const statusVal = data.status.toUpperCase() as OrderStatusStep;
          setCurrentStep(statusVal);

          // Auto-transition to Live Map when OUT_FOR_DELIVERY
          if ((statusVal === 'OUT_FOR_DELIVERY' || data.tracking?.riderDetails) && onTransitionToLiveMap) {
            onTransitionToLiveMap();
          }
        }
      }
    });

    return () => unsubscribe();
  }, [orderId, onTransitionToLiveMap]);

  const getStepState = (stepId: OrderStatusStep) => {
    const orderIndexMap: Record<OrderStatusStep, number> = {
      PLACED: 0,
      CONFIRMED: 1,
      PACKED: 2,
      OUT_FOR_DELIVERY: 3,
      DELIVERED: 4,
    };

    const currentIndex = orderIndexMap[currentStep];
    const stepIndex = orderIndexMap[stepId];

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'future';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeft size={24} color={ModeB.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{orderId}</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* Estimated Time Card */}
        <View style={styles.etaHeaderCard}>
          <Clock size={24} color={Colors.primary} style={{ marginRight: Spacing.md }} />
          <View>
            <Text style={styles.etaTitle}>Estimated Delivery</Text>
            <Text style={styles.etaTimeText}>10-15 Minutes</Text>
          </View>
        </View>

        {/* Vertical Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineHeaderTitle}>Status Timeline</Text>

          {STEPS.map((step, idx) => {
            const state = getStepState(step.id);
            const isLast = idx === STEPS.length - 1;

            return (
              <View key={step.id} style={styles.stepRowWrapper}>
                <View style={styles.iconColumn}>
                  {state === 'completed' ? (
                    <View style={styles.completedIconBadge}>
                      <Check size={14} color="#FFFFFF" />
                    </View>
                  ) : state === 'active' ? (
                    <Animated.View
                      style={[
                        styles.activeIconBadge,
                        { transform: [{ scale: pulseAnim }] },
                      ]}
                    >
                      <View style={styles.activeInnerDot} />
                    </Animated.View>
                  ) : (
                    <View style={styles.futureIconBadge} />
                  )}

                  {!isLast && (
                    <View
                      style={[
                        styles.connectingLine,
                        state === 'completed' && styles.lineCompleted,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.stepTextContent}>
                  <View style={styles.stepTitleRow}>
                    <Text
                      style={[
                        styles.stepTitle,
                        state === 'active' && styles.titleActive,
                        state === 'future' && styles.titleFuture,
                      ]}
                    >
                      {step.label}
                    </Text>
                    {state === 'completed' && (
                      <Text style={styles.timestampText}>
                        {step.id === 'PLACED' ? placedTime : confirmedTime}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.stepSublabel}>{step.sublabel}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ModeB.background,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    backgroundColor: ModeB.surface,
    borderBottomWidth: 1,
    borderBottomColor: ModeB.border,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: ModeB.textPrimary,
  },
  scrollContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  etaHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}1A`,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  etaTitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  etaTimeText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  timelineCard: {
    backgroundColor: ModeB.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: ModeB.border,
    padding: Spacing.lg,
  },
  timelineHeaderTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: ModeB.textPrimary,
    marginBottom: Spacing.lg,
  },
  stepRowWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  iconColumn: {
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 24,
    position: 'relative',
  },
  completedIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: StatusColors.success,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  activeIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${Colors.primary}33`,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  activeInnerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  futureIconBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: ModeB.border,
    backgroundColor: ModeB.background,
    zIndex: 2,
  },
  connectingLine: {
    position: 'absolute',
    top: 24,
    bottom: -Spacing.lg,
    width: 2,
    backgroundColor: ModeB.border,
    zIndex: 1,
  },
  lineCompleted: {
    backgroundColor: StatusColors.success,
  },
  stepTextContent: {
    flex: 1,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: ModeB.textPrimary,
  },
  titleActive: {
    color: Colors.primary,
  },
  titleFuture: {
    color: ModeB.textSecondary,
  },
  timestampText: {
    fontSize: Typography.sizes.xs,
    color: ModeB.textSecondary,
  },
  stepSublabel: {
    fontSize: Typography.sizes.xs,
    color: ModeB.textSecondary,
    marginTop: 2,
  },
});
