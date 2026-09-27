/**
 * Screen A: Live Rider Tracking Map Screen (Zepto / Swiggy / Uber Pattern)
 * Mode: Full-bleed Map with Brand Primary Polyline & Floating Bottom Sheet Overlay
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from '../../components/map/MapViewComponent';
import {
  ChevronLeft,
  Navigation,
  Phone,
  MessageSquare,
  AlertCircle,
  Clock,
  MapPin,
  Gift,
  CheckCircle2,
} from 'lucide-react-native';
import { ModeB, Spacing, Typography, BorderRadius, Colors, StatusColors } from '../../design';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface OrderTrackingLiveProps {
  orderId?: string;
  onBack?: () => void;
}

interface RiderLocation {
  latitude: number;
  longitude: number;
}

export const OrderTrackingLive: React.FC<OrderTrackingLiveProps> = ({
  orderId = 'ord_1001',
  onBack,
}) => {
  const [etaMinutes, setEtaMinutes] = useState(4);
  const [distanceKm, setDistanceKm] = useState('1.0 km');
  const [isOnTime, setIsOnTime] = useState(true);
  const [riderName, setRiderName] = useState('Ramesh Kumar');
  const [riderPhone, setRiderPhone] = useState('+91 89778 55998');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 302, MG Road, Vijayawada');
  const [totalAmount, setTotalAmount] = useState(699);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'PAID'>('COD');
  const [activePromo, setActivePromo] = useState<string | null>('Gifts of Gratitude · Gift Now >');

  // Map coordinates
  const destinationCoords = { latitude: 16.5062, longitude: 80.6480 };
  const [riderCoords, setRiderCoords] = useState<RiderLocation>({
    latitude: 16.5125,
    longitude: 80.6420,
  });

  const mapRef = useRef<MapView | null>(null);

  // Real-time Firestore order listener
  useEffect(() => {
    if (!orderId) return;

    const orderRef = doc(db, 'orders', orderId);
    const unsubscribe = onSnapshot(orderRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.tracking) {
          if (data.tracking.estimatedArrivalMinutes) {
            setEtaMinutes(data.tracking.estimatedArrivalMinutes);
          }
          if (data.tracking.riderDetails?.currentLocation) {
            setRiderCoords(data.tracking.riderDetails.currentLocation);
          }
          if (data.tracking.riderDetails?.name) {
            setRiderName(data.tracking.riderDetails.name);
          }
          if (data.tracking.riderDetails?.phone) {
            setRiderPhone(data.tracking.riderDetails.phone);
          }
        }
        if (data.pricing?.grandTotal) {
          setTotalAmount(data.pricing.grandTotal);
        }
        if (data.paymentMethod) {
          setPaymentMethod(data.paymentMethod === 'COD' ? 'COD' : 'PAID');
        }
      }
    });

    return () => unsubscribe();
  }, [orderId]);

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: (riderCoords.latitude + destinationCoords.latitude) / 2,
          longitude: (riderCoords.longitude + destinationCoords.longitude) / 2,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        },
        500
      );
    }
  };

  const handleQuickReport = (issueType: string) => {
    Alert.alert('Report Issue', `Filing support ticket for: "${issueType}". Our team will contact you directly.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Map Viewport */}
      <View style={styles.mapViewport}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{
            latitude: (riderCoords.latitude + destinationCoords.latitude) / 2,
            longitude: (riderCoords.longitude + destinationCoords.longitude) / 2,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
        >
          {/* Brand Primary Polyline Route */}
          <Polyline
            coordinates={[riderCoords, destinationCoords]}
            strokeColor={Colors.primary}
            strokeWidth={4}
          />

          {/* Delivery Destination Marker Pin */}
          <Marker coordinate={destinationCoords} title="Your Home">
            <View style={styles.homeMarkerPin}>
              <MapPin size={20} color="#FFFFFF" />
            </View>
          </Marker>

          {/* Moving Rider Dot Marker */}
          <Marker coordinate={riderCoords} title={riderName}>
            <View style={styles.riderMarkerDot}>
              <Text style={{ fontSize: 16 }}>🛵</Text>
            </View>
          </Marker>
        </MapView>

        {/* Top Header Overlay Bar */}
        <View style={styles.topMapHeader}>
          <TouchableOpacity style={styles.iconFab} onPress={onBack} activeOpacity={0.7}>
            <ChevronLeft size={22} color={ModeB.textPrimary} />
          </TouchableOpacity>

          <View style={styles.distanceChip}>
            <Text style={styles.distanceText}>{distanceKm}</Text>
          </View>

          <TouchableOpacity style={styles.iconFab} onPress={handleRecenter} activeOpacity={0.7}>
            <Navigation size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet Control Panel */}
      <View style={styles.bottomSheetContainer}>
        {/* Optional Active Promo Banner */}
        {activePromo && (
          <TouchableOpacity
            style={styles.promoBannerRow}
            onPress={() => setActivePromo(null)}
            activeOpacity={0.8}
          >
            <Gift size={16} color={Colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.promoText}>{activePromo}</Text>
          </TouchableOpacity>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* SLA On Time Status Pill */}
          <View style={styles.statusPillRow}>
            <View style={[styles.statusPill, isOnTime ? styles.pillSuccess : styles.pillWarning]}>
              <Clock size={12} color={isOnTime ? StatusColors.success : StatusColors.warning} style={{ marginRight: 4 }} />
              <Text style={[styles.statusPillText, { color: isOnTime ? StatusColors.success : StatusColors.warning }]}>
                {isOnTime ? '⚡ On time' : '⏱️ Slight delay'}
              </Text>
            </View>
          </View>

          {/* Arriving in Hero Number */}
          <Text style={styles.arrivingLabel}>Arriving in</Text>
          <Text style={styles.heroEtaNumber}>{etaMinutes} mins</Text>
          <Text style={styles.heroEtaSub}>Your order is on the way</Text>

          {/* Rider Partner Profile Card */}
          <View style={styles.riderCard}>
            <View style={styles.riderAvatarCol}>
              <Text style={{ fontSize: 24 }}>🛵</Text>
            </View>
            <View style={styles.riderInfoCol}>
              <Text style={styles.riderNameText}>{riderName}</Text>
              <Text style={styles.riderRoleText}>GlowVAI Delivery Partner</Text>
            </View>
            <View style={styles.riderActionsRow}>
              <TouchableOpacity style={styles.callFab} activeOpacity={0.7}>
                <Phone size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Issue Report Chips (Image 9 Pattern) */}
          <Text style={styles.reportSectionTitle}>Any issues with delivery?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reportChipsScroll}>
            {['Order damaged', 'Wrong items', 'Rider unreachable', 'Other'].map((issue) => (
              <TouchableOpacity
                key={issue}
                style={styles.reportChip}
                onPress={() => handleQuickReport(issue)}
                activeOpacity={0.7}
              >
                <AlertCircle size={12} color={ModeB.textSecondary} style={{ marginRight: 4 }} />
                <Text style={styles.reportChipText}>{issue}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Pay on Delivery CTA if COD */}
          {paymentMethod === 'COD' && (
            <TouchableOpacity style={styles.payNowBtn} activeOpacity={0.8}>
              <Text style={styles.payNowBtnText}>Click to Pay ₹{totalAmount} Online</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ModeB.background,
  },
  mapViewport: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topMapHeader: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconFab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ModeB.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  distanceChip: {
    backgroundColor: ModeB.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: ModeB.border,
  },
  distanceText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: ModeB.textPrimary,
  },
  homeMarkerPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  riderMarkerDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    elevation: 4,
  },
  bottomSheetContainer: {
    backgroundColor: ModeB.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: ModeB.border,
    maxHeight: 380,
  },
  promoBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}1A`,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  promoText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  statusPillRow: {
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  pillSuccess: {
    backgroundColor: `${StatusColors.success}1A`,
  },
  pillWarning: {
    backgroundColor: `${StatusColors.warning}1A`,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
  },
  arrivingLabel: {
    fontSize: Typography.sizes.xs,
    color: ModeB.textSecondary,
  },
  heroEtaNumber: {
    fontSize: 32,
    fontWeight: Typography.weights.bold,
    color: ModeB.textPrimary,
    lineHeight: 38,
  },
  heroEtaSub: {
    fontSize: Typography.sizes.xs,
    color: ModeB.textSecondary,
    marginBottom: Spacing.md,
  },
  riderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ModeB.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: ModeB.border,
    marginBottom: Spacing.md,
  },
  riderAvatarCol: {
    marginRight: Spacing.md,
  },
  riderInfoCol: {
    flex: 1,
  },
  riderNameText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: ModeB.textPrimary,
  },
  riderRoleText: {
    fontSize: Typography.sizes.xs,
    color: ModeB.textSecondary,
    marginTop: 2,
  },
  riderActionsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  callFab: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportSectionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: ModeB.textSecondary,
    marginBottom: Spacing.xs,
  },
  reportChipsScroll: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  reportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: ModeB.surface,
    borderWidth: 1,
    borderColor: ModeB.border,
  },
  reportChipText: {
    fontSize: 11,
    color: ModeB.textSecondary,
  },
  payNowBtn: {
    height: 44,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
  },
});
