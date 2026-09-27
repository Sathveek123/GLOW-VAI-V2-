import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  Bell,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  RotateCcw,
  Star,
  Zap,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

export interface OrdersListScreenProps {
  onBack?: () => void;
  onTrackOrder?: (id: string) => void;
  onViewOrderDetails?: (id: string) => void;
  onRateOrder?: (id: string) => void;
}

export const OrdersListScreen: React.FC<OrdersListScreenProps> = ({
  onBack,
  onTrackOrder,
  onViewOrderDetails,
  onRateOrder,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const productThumbsActive = [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1608248597263-00de46196f65?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=200&q=80',
  ];

  const productThumbsPast1 = [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=200&q=80',
  ];

  const productThumbsPast2 = [
    'https://images.unsplash.com/photo-1608248597263-00de46196f65?auto=format&fit=crop&w=200&q=80',
  ];

  const handleTrack = (id: string) => {
    if (onTrackOrder) onTrackOrder(id);
    else router.push('/orders/tracking' as any);
  };

  const handleDetails = (id: string) => {
    if (onViewOrderDetails) onViewOrderDetails(id);
    else router.push(`/orders/${id}` as any);
  };

  const handleRate = (id: string) => {
    if (onRateOrder) onRateOrder(id);
    else router.push('/orders/rate' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backCircle}
            onPress={onBack || (() => router.back())}
            activeOpacity={0.8}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.brandRow}>
            <Sparkles size={16} color="#FFD700" />
            <Text style={styles.logoText}>GlowVAI</Text>
          </View>

          <TouchableOpacity style={styles.bellCircle} activeOpacity={0.8}>
            <Bell size={18} color="#FFFFFF" />
            <View style={styles.unreadDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerBottomRow}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerTagline}>BEAUTY · FASTER.</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        {/* SEGMENTED CONTROL TABS */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'active' && styles.tabBtnActive]}
            onPress={() => setActiveTab('active')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
              Active (1)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'past' && styles.tabBtnActive]}
            onPress={() => setActiveTab('past')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
              Past Orders
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'active' ? (
          <>
            {/* ACTIVE ORDER CARD */}
            <Text style={styles.sectionLabel}>ACTIVE ORDER</Text>
            <TouchableOpacity
              style={styles.activeOrderCard}
              onPress={() => handleDetails('GV28491')}
              activeOpacity={0.92}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>#GV28491</Text>
                  <Text style={styles.orderTime}>Placed today · 12:42 PM</Text>
                </View>

                <View style={styles.badgesCol}>
                  <View style={styles.statusOnWayBadge}>
                    <Text style={styles.statusOnWayText}>On the way</Text>
                  </View>
                  <View style={styles.etaBadge}>
                    <Zap size={11} color={ColorTokens.successGreen} />
                    <Text style={styles.etaText}>Arriving in 6 mins</Text>
                  </View>
                </View>
              </View>

              {/* PRODUCT THUMBNAILS */}
              <View style={styles.thumbsRow}>
                {productThumbsActive.map((url, i) => (
                  <Image key={i} source={{ uri: url }} style={styles.productThumb} />
                ))}
              </View>

              {/* ORDER SUMMARY INFO */}
              <View style={styles.summaryRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.totalAmount}>Total: ₹1,347</Text>
                  <View style={styles.addressRow}>
                    <MapPin size={12} color={ColorTokens.mutedText} />
                    <Text style={styles.addressText}>Home · Vijayawada</Text>
                  </View>
                </View>

                <ChevronRight size={18} color={ColorTokens.mutedText} />
              </View>

              {/* HORIZONTAL TIMELINE */}
              <View style={styles.timelineContainer}>
                <View style={styles.timelineRow}>
                  {/* STEP 1: CONFIRMED */}
                  <View style={styles.timelineStep}>
                    <View style={styles.stepCircleDone}>
                      <CheckCircle2 size={12} color="#FFFFFF" />
                    </View>
                    <Text style={styles.stepLabelDone}>Confirmed</Text>
                  </View>
                  <View style={styles.timelineLineDone} />

                  {/* STEP 2: PACKED */}
                  <View style={styles.timelineStep}>
                    <View style={styles.stepCircleDone}>
                      <CheckCircle2 size={12} color="#FFFFFF" />
                    </View>
                    <Text style={styles.stepLabelDone}>Packed</Text>
                  </View>
                  <View style={styles.timelineLineDone} />

                  {/* STEP 3: ON THE WAY (ACTIVE) */}
                  <View style={styles.timelineStep}>
                    <View style={styles.stepCircleActive}>
                      <Clock size={12} color="#FFFFFF" />
                    </View>
                    <Text style={styles.stepLabelActive}>On the way</Text>
                  </View>
                  <View style={styles.timelineLinePending} />

                  {/* STEP 4: DELIVERED */}
                  <View style={styles.timelineStep}>
                    <View style={styles.stepCirclePending} />
                    <Text style={styles.stepLabelPending}>Delivered</Text>
                  </View>
                </View>
              </View>

              {/* PRIMARY CTA */}
              <TouchableOpacity
                style={styles.trackBtn}
                onPress={() => handleTrack('GV28491')}
                activeOpacity={0.85}
              >
                <Zap size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.trackBtnText}>Track Order →</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <Text style={styles.sectionLabel}>RECENTLY COMPLETED</Text>
            {/* PAST ORDER CARD 1 */}
            <View style={styles.pastCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>#GV27356</Text>
                  <Text style={styles.orderTime}>Delivered · Apr 28, 2025</Text>
                </View>
                <View style={styles.deliveredBadge}>
                  <CheckCircle2 size={12} color={ColorTokens.successGreen} />
                  <Text style={styles.deliveredText}>Delivered</Text>
                </View>
              </View>

              <View style={styles.thumbsRow}>
                {productThumbsPast1.map((url, i) => (
                  <Image key={i} source={{ uri: url }} style={styles.productThumb} />
                ))}
                <Text style={styles.moreItemsText}>+1 item</Text>
              </View>

              <View style={styles.pastFooterRow}>
                <Text style={styles.totalAmount}>₹2,892</Text>

                <View style={styles.pastActions}>
                  <TouchableOpacity
                    style={styles.rateBtn}
                    onPress={() => handleRate('GV27356')}
                    activeOpacity={0.8}
                  >
                    <Star size={13} color={ColorTokens.plum} />
                    <Text style={styles.rateBtnText}>Rate Order</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.buyAgainBtn} activeOpacity={0.8}>
                    <RotateCcw size={13} color={ColorTokens.deepBerry} />
                    <Text style={styles.buyAgainText}>Buy Again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        ) : (
          /* PAST ORDERS LIST */
          <>
            <Text style={styles.sectionLabel}>PAST ORDERS HISTORY</Text>

            {/* CARD 1 */}
            <View style={styles.pastCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>#GV27356</Text>
                  <Text style={styles.orderTime}>Delivered · Apr 28, 2025</Text>
                </View>
                <View style={styles.deliveredBadge}>
                  <CheckCircle2 size={12} color={ColorTokens.successGreen} />
                  <Text style={styles.deliveredText}>Delivered</Text>
                </View>
              </View>

              <View style={styles.thumbsRow}>
                {productThumbsPast1.map((url, i) => (
                  <Image key={i} source={{ uri: url }} style={styles.productThumb} />
                ))}
              </View>

              <View style={styles.pastFooterRow}>
                <Text style={styles.totalAmount}>₹2,892</Text>

                <View style={styles.pastActions}>
                  <TouchableOpacity
                    style={styles.rateBtn}
                    onPress={() => handleRate('GV27356')}
                    activeOpacity={0.8}
                  >
                    <Star size={13} color={ColorTokens.plum} />
                    <Text style={styles.rateBtnText}>Rate Order</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.buyAgainBtn} activeOpacity={0.8}>
                    <RotateCcw size={13} color={ColorTokens.deepBerry} />
                    <Text style={styles.buyAgainText}>Buy Again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* CARD 2 */}
            <View style={styles.pastCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>#GV26190</Text>
                  <Text style={styles.orderTime}>Delivered · Mar 14, 2025</Text>
                </View>
                <View style={styles.deliveredBadge}>
                  <CheckCircle2 size={12} color={ColorTokens.successGreen} />
                  <Text style={styles.deliveredText}>Delivered</Text>
                </View>
              </View>

              <View style={styles.thumbsRow}>
                {productThumbsPast2.map((url, i) => (
                  <Image key={i} source={{ uri: url }} style={styles.productThumb} />
                ))}
              </View>

              <View style={styles.pastFooterRow}>
                <Text style={styles.totalAmount}>₹1,649</Text>

                <View style={styles.pastActions}>
                  <TouchableOpacity
                    style={styles.rateBtn}
                    onPress={() => handleRate('GV26190')}
                    activeOpacity={0.8}
                  >
                    <Star size={13} color={ColorTokens.plum} />
                    <Text style={styles.rateBtnText}>Rate Order</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.buyAgainBtn} activeOpacity={0.8}>
                    <RotateCcw size={13} color={ColorTokens.deepBerry} />
                    <Text style={styles.buyAgainText}>Buy Again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>
    </SafeAreaView>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  bellCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ColorTokens.coral,
  },
  headerBottomRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerTagline: {
    fontSize: 10,
    fontWeight: '700',
    color: ColorTokens.softCoral,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  tabBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: ColorTokens.deepBerry,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorTokens.mutedText,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 10,
  },
  activeOrderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  orderTime: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  badgesCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusOnWayBadge: {
    backgroundColor: ColorTokens.cobaltBlue,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusOnWayText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  etaText: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.successGreen,
  },
  thumbsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  productThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: ColorTokens.softCream,
  },
  moreItemsText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.mutedText,
    marginLeft: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ColorTokens.softCream,
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  addressText: {
    fontSize: 11,
    color: ColorTokens.mutedText,
  },
  timelineContainer: {
    marginBottom: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineStep: {
    alignItems: 'center',
  },
  stepCircleDone: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepLabelDone: {
    fontSize: 10,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
  timelineLineDone: {
    flex: 1,
    height: 2,
    backgroundColor: ColorTokens.deepBerry,
    marginHorizontal: 4,
    marginTop: -14,
  },
  stepCircleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ColorTokens.cobaltBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepLabelActive: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorTokens.cobaltBlue,
  },
  timelineLinePending: {
    flex: 1,
    height: 2,
    backgroundColor: ColorTokens.border,
    marginHorizontal: 4,
    marginTop: -14,
  },
  stepCirclePending: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: ColorTokens.border,
    marginBottom: 4,
  },
  stepLabelPending: {
    fontSize: 10,
    color: ColorTokens.mutedText,
  },
  trackBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pastCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  deliveredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  deliveredText: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.successGreen,
  },
  pastFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: ColorTokens.border,
    paddingTop: 10,
  },
  pastActions: {
    flexDirection: 'row',
    gap: 8,
  },
  rateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorTokens.lavender,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  rateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.plum,
  },
  buyAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: ColorTokens.deepBerry,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  buyAgainText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
});
