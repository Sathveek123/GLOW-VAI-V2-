import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  Phone,
  MessageSquare,
  Share2,
  Navigation,
  Compass,
  Star,
  CheckCircle2,
  Clock,
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

export interface LiveRiderTrackingScreenProps {
  onBack?: () => void;
  onCallRider?: () => void;
  onChatRider?: () => void;
}

export const LiveRiderTrackingScreen: React.FC<LiveRiderTrackingScreenProps> = ({
  onBack,
  onCallRider,
  onChatRider,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [shared, setShared] = useState(false);

  const productThumbs = [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1608248597263-00de46196f65?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=150&q=80',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* TOP HEADER OVERLAY */}
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
          <Text style={styles.headerTitle}>Track your order</Text>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>On the way</Text>
        </View>
      </View>

      {/* FULL SCREEN MAP CANVAS AREA */}
      <View style={styles.mapArea}>
        {/* SIMULATED ELEGANT VIJAYAWADA MAP */}
        <View style={styles.mapCanvasContainer}>
          {/* Krishna River Ribbon */}
          <View style={styles.riverRibbon} />

          {/* Neighborhood Labels */}
          <View style={[styles.mapLabelBadge, { top: '15%', left: '10%' }]}>
            <Text style={styles.mapLabelText}>GlowVAI Dark Store</Text>
          </View>

          <View style={[styles.mapLabelBadge, { top: '35%', right: '15%' }]}>
            <Text style={styles.mapLabelText}>Benz Circle</Text>
          </View>

          <View style={[styles.mapLabelBadge, { top: '65%', left: '15%' }]}>
            <Text style={styles.mapLabelText}>Your Home</Text>
          </View>

          {/* DEEP BERRY ROUTE LINE */}
          <View style={styles.routeLine} />

          {/* GLOWING RIDER MARKER WITH PULSE */}
          <View style={styles.riderMarkerPos}>
            <View style={styles.pulseRing} />
            <View style={styles.riderMarkerBadge}>
              <Compass size={22} color="#FFFFFF" />
            </View>
            <View style={styles.riderTooltip}>
              <Text style={styles.riderTooltipText}>Rahul · 6 mins away</Text>
            </View>
          </View>

          {/* DESTINATION HOME MARKER */}
          <View style={styles.homeMarkerPos}>
            <View style={styles.homeMarkerBadge}>
              <Navigation size={20} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* BOTTOM SHEET ORDER & RIDER INFORMATION CARD */}
        <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, 18) }]}>
          <View style={styles.dragHandle} />

          {/* MAIN STATUS & ETA */}
          <View style={styles.etaHeaderRow}>
            <View>
              <Text style={styles.etaTitle}>Arriving in 6 mins</Text>
              <Text style={styles.orderIdSub}>Order #GV28491</Text>
            </View>
            <View style={styles.expressBadge}>
              <Text style={styles.expressBadgeText}>10 MIN EXPRESS</Text>
            </View>
          </View>

          {/* RIDER PROFILE CARD */}
          <View style={styles.riderCard}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              }}
              style={styles.riderAvatar}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.riderNameRow}>
                <Text style={styles.riderName}>Rahul</Text>

                <View style={styles.ratingBadge}>
                  <Star size={11} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>4.9</Text>
                </View>
              </View>

              <Text style={styles.vehicleText}>TVS Jupiter · AP 39 KQ 7321</Text>
              <Text style={styles.trustedBadge}>Trusted Rider</Text>
            </View>

            {/* RIDER CONTACT ACTIONS */}
            <View style={styles.riderActionsCol}>
              <TouchableOpacity
                style={styles.callRiderBtn}
                onPress={onCallRider || (() => {})}
                activeOpacity={0.8}
              >
                <Phone size={16} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chatRiderBtn}
                onPress={onChatRider || (() => {})}
                activeOpacity={0.8}
              >
                <MessageSquare size={16} color={ColorTokens.deepBerry} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ORDER PREVIEW STRIP */}
          <View style={styles.orderPreviewStrip}>
            <View style={styles.previewThumbsRow}>
              {productThumbs.map((url, idx) => (
                <Image key={idx} source={{ uri: url }} style={styles.miniThumb} />
              ))}
            </View>

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.previewTitle}>4 items</Text>
              <Text style={styles.previewSub}>Beauty essentials</Text>
            </View>
          </View>

          {/* TRACKING TIMELINE */}
          <View style={styles.timelineRow}>
            <View style={styles.tStep}>
              <CheckCircle2 size={14} color={ColorTokens.successGreen} />
              <Text style={styles.tTextDone}>Packed</Text>
            </View>
            <View style={styles.tLineDone} />

            <View style={styles.tStep}>
              <CheckCircle2 size={14} color={ColorTokens.successGreen} />
              <Text style={styles.tTextDone}>Picked up</Text>
            </View>
            <View style={styles.tLineDone} />

            <View style={styles.tStep}>
              <Clock size={14} color={ColorTokens.cobaltBlue} />
              <Text style={styles.tTextActive}>On the way</Text>
            </View>
            <View style={styles.tLinePending} />

            <View style={styles.tStep}>
              <View style={styles.tDotPending} />
              <Text style={styles.tTextPending}>Almost there</Text>
            </View>
          </View>

          {/* PRIMARY CTA */}
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={() => setShared(true)}
            activeOpacity={0.9}
          >
            <Share2 size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.shareBtnText}>
              {shared ? '✓ Tracking Link Copied' : 'Share tracking'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF4F6',
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
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
  statusPill: {
    backgroundColor: ColorTokens.cobaltBlue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  mapArea: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  mapCanvasContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F0F2',
  },
  riverRibbon: {
    position: 'absolute',
    width: '130%',
    height: 60,
    backgroundColor: 'rgba(22, 119, 232, 0.25)',
    transform: [{ rotate: '-30deg' }],
    top: '35%',
  },
  mapLabelBadge: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  mapLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  routeLine: {
    position: 'absolute',
    width: 180,
    height: 3,
    backgroundColor: ColorTokens.deepBerry,
    transform: [{ rotate: '45deg' }],
    top: '32%',
    left: '28%',
  },
  riderMarkerPos: {
    position: 'absolute',
    top: '38%',
    left: '42%',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(143, 13, 47, 0.25)',
    marginTop: -5,
  },
  riderMarkerBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ColorTokens.deepBerry,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  riderTooltip: {
    backgroundColor: ColorTokens.text,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
  },
  riderTooltipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  homeMarkerPos: {
    position: 'absolute',
    top: '55%',
    right: '25%',
  },
  homeMarkerBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ColorTokens.cobaltBlue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ColorTokens.cobaltBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  bottomSheet: {
    backgroundColor: ColorTokens.warmIvory,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: ColorTokens.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: ColorTokens.border,
    alignSelf: 'center',
    marginBottom: 12,
  },
  etaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  etaTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  orderIdSub: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  expressBadge: {
    backgroundColor: ColorTokens.softCoral,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  expressBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
  },
  riderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  riderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  riderName: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ColorTokens.softCream,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  vehicleText: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  trustedBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: ColorTokens.successGreen,
    marginTop: 2,
  },
  riderActionsCol: {
    gap: 8,
  },
  callRiderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatRiderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ColorTokens.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderPreviewStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.softCream,
    padding: 10,
    borderRadius: 14,
    marginBottom: 14,
  },
  previewThumbsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  miniThumb: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  previewSub: {
    fontSize: 11,
    color: ColorTokens.mutedText,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  tStep: {
    alignItems: 'center',
  },
  tTextDone: {
    fontSize: 10,
    fontWeight: '700',
    color: ColorTokens.successGreen,
    marginTop: 2,
  },
  tLineDone: {
    flex: 1,
    height: 2,
    backgroundColor: ColorTokens.successGreen,
    marginHorizontal: 4,
    marginTop: -10,
  },
  tTextActive: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorTokens.cobaltBlue,
    marginTop: 2,
  },
  tLinePending: {
    flex: 1,
    height: 2,
    backgroundColor: ColorTokens.border,
    marginHorizontal: 4,
    marginTop: -10,
  },
  tDotPending: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: ColorTokens.border,
  },
  tTextPending: {
    fontSize: 10,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  shareBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
