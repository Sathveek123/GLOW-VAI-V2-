import React from 'react';
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
  HelpCircle,
  CheckCircle2,
  Download,
  RotateCcw,
  Star,
  MessageSquare,
  Phone,
  MapPin,
  FileText,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
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

export interface OrderDetailsScreenProps {
  onBack?: () => void;
  onRateOrder?: () => void;
}

export const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({
  onBack,
  onRateOrder,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const orderId = params.id || 'GV28491';

  const orderItems = [
    {
      id: '1',
      name: 'GlowVAI Vitamin C Face Serum',
      variant: 'Brightening · 30ml',
      category: 'Skincare',
      qty: 1,
      price: 699,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: '2',
      name: 'GlowVAI Hydra Plump Face Cream',
      variant: 'Hydration · 50g',
      category: 'Moisturizer',
      qty: 1,
      price: 499,
      image: 'https://images.unsplash.com/photo-1608248597263-00de46196f65?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: '3',
      name: 'GlowVAI Matte Lipstick',
      variant: 'Long Stay · Shade 08',
      category: 'Lips',
      qty: 1,
      price: 349,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=300&q=80',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset, height: undefined, minHeight: 64 }]}>
        <TouchableOpacity
          style={styles.backCircle}
          onPress={onBack || (() => router.back())}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Sparkles size={16} color="#FFD700" />
          <Text style={styles.headerTitle}>Order Details</Text>
        </View>

        <TouchableOpacity style={styles.helpCircle} activeOpacity={0.8}>
          <HelpCircle size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        {/* ORDER STATUS CARD */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeaderRow}>
            <View style={styles.deliveredBadge}>
              <CheckCircle2 size={14} color={ColorTokens.successGreen} />
              <Text style={styles.deliveredText}>Delivered</Text>
            </View>
            <Text style={styles.orderIdText}>#{orderId}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Order date:</Text>
            <Text style={styles.metaValue}>13 Sep 2026</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Delivery address:</Text>
            <Text style={styles.metaValue}>Home · Payakapuram, Vijayawada</Text>
          </View>
        </View>

        {/* DELIVERY TIMELINE */}
        <Text style={styles.sectionLabel}>DELIVERY TIMELINE</Text>
        <View style={styles.timelineCard}>
          {[
            { stage: 'Confirmed', time: '12:42 PM' },
            { stage: 'Packed', time: '12:45 PM' },
            { stage: 'Out for delivery', time: '12:47 PM' },
            { stage: 'Delivered', time: '12:52 PM' },
          ].map((item, idx, arr) => (
            <View key={idx} style={styles.timelineRowItem}>
              <View style={styles.timelineIconCol}>
                <View style={styles.greenCheckDot}>
                  <CheckCircle2 size={14} color="#FFFFFF" />
                </View>
                {idx < arr.length - 1 && <View style={styles.timelineLine} />}
              </View>

              <View style={styles.timelineTextCol}>
                <Text style={styles.stageTitle}>{item.stage}</Text>
                <Text style={styles.stageTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ITEM BREAKDOWN */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>ITEMS IN YOUR ORDER</Text>
          <Text style={styles.itemsCountBadge}>3 items</Text>
        </View>

        <View style={styles.itemsCard}>
          {orderItems.map((prod, idx) => (
            <View key={prod.id}>
              <View style={styles.itemRow}>
                <Image source={{ uri: prod.image }} style={styles.itemImg} />
                <View style={{ flex: 1 }}>
                  <View style={styles.catChip}>
                    <Text style={styles.catChipText}>{prod.category}</Text>
                  </View>
                  <Text style={styles.prodName}>{prod.name}</Text>
                  <Text style={styles.prodVariant}>{prod.variant}</Text>
                  <Text style={styles.prodQty}>Qty: {prod.qty}</Text>
                </View>
                <Text style={styles.prodPrice}>₹{prod.price}</Text>
              </View>
              {idx < orderItems.length - 1 && <View style={styles.itemDivider} />}
            </View>
          ))}
        </View>

        {/* BILL SUMMARY */}
        <Text style={styles.sectionLabel}>BILL SUMMARY</Text>
        <View style={styles.billCard}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹1,547</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Discounts (GLOW10)</Text>
            <Text style={styles.billDiscount}>–₹250</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>₹50</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Taxes & Charges</Text>
            <Text style={styles.billValue}>₹0</Text>
          </View>

          <View style={styles.grandTotalHighlight}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹1,347</Text>
          </View>
        </View>

        {/* ACTION GRID (4 UTILITY BUTTONS) */}
        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionGridBtn} activeOpacity={0.8}>
            <Download size={18} color={ColorTokens.deepBerry} />
            <Text style={styles.actionGridText}>Download Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionGridBtn} activeOpacity={0.8}>
            <RotateCcw size={18} color={ColorTokens.deepBerry} />
            <Text style={styles.actionGridText}>Buy Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionGridBtn}
            onPress={onRateOrder || (() => router.push('/orders/rate' as any))}
            activeOpacity={0.8}
          >
            <Star size={18} color={ColorTokens.plum} />
            <Text style={styles.actionGridText}>Rate Order</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionGridBtn} activeOpacity={0.8}>
            <HelpCircle size={18} color={ColorTokens.cobaltBlue} />
            <Text style={styles.actionGridText}>Get Help</Text>
          </TouchableOpacity>
        </View>

        {/* SUPPORT CARD */}
        <View style={styles.supportCard}>
          <View style={styles.supportHeader}>
            <View style={styles.supportIconBg}>
              <MessageSquare size={20} color={ColorTokens.deepBerry} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.supportTitle}>Need help with this order?</Text>
              <Text style={styles.supportSub}>Our support team is here for you.</Text>
            </View>
          </View>

          <View style={styles.supportActions}>
            <TouchableOpacity style={styles.chatBtn} activeOpacity={0.8}>
              <MessageSquare size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.chatBtnText}>Chat Now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.callBtn} activeOpacity={0.8}>
              <Phone size={14} color={ColorTokens.deepBerry} style={{ marginRight: 6 }} />
              <Text style={styles.callBtnText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 90 + insets.bottom }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  helpCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  deliveredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  deliveredText: {
    fontSize: 12,
    fontWeight: '800',
    color: ColorTokens.successGreen,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: ColorTokens.mutedText,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 6,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  timelineRowItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineIconCol: {
    alignItems: 'center',
    marginRight: 12,
  },
  greenCheckDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ColorTokens.successGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    height: 28,
    backgroundColor: ColorTokens.successGreen,
    marginVertical: 2,
  },
  timelineTextCol: {
    flex: 1,
    paddingBottom: 14,
  },
  stageTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  stageTime: {
    fontSize: 11,
    color: ColorTokens.mutedText,
    marginTop: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemsCountBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.plum,
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemImg: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: ColorTokens.softCream,
  },
  catChip: {
    backgroundColor: ColorTokens.lavender,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  catChipText: {
    fontSize: 9,
    fontWeight: '800',
    color: ColorTokens.plum,
  },
  prodName: {
    fontSize: 13,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  prodVariant: {
    fontSize: 11,
    color: ColorTokens.mutedText,
    marginTop: 1,
  },
  prodQty: {
    fontSize: 11,
    fontWeight: '600',
    color: ColorTokens.text,
    marginTop: 2,
  },
  prodPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
  },
  itemDivider: {
    height: 1,
    backgroundColor: ColorTokens.border,
    marginVertical: 12,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 8,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  billLabel: {
    fontSize: 13,
    color: ColorTokens.mutedText,
  },
  billValue: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  billDiscount: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorTokens.successGreen,
  },
  grandTotalHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: ColorTokens.softCoral,
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  actionGridBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 8,
  },
  actionGridText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  supportCard: {
    backgroundColor: ColorTokens.softCream,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  supportIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ColorTokens.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  supportSub: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginTop: 1,
  },
  supportActions: {
    flexDirection: 'row',
    gap: 10,
  },
  chatBtn: {
    flex: 1,
    backgroundColor: ColorTokens.deepBerry,
    height: 40,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  callBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: 40,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ColorTokens.deepBerry,
  },
  callBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
});
