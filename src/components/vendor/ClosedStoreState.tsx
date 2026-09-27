/**
 * Closed Store State Card Component (Image 7 Pattern)
 * Rendered at top of Home / Vendor / Shop screens when store is currently closed.
 * Catalog remains 100% browsable & items can still be added to cart for next-open orders.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Store, Clock, MapPin, User, ChevronRight } from 'lucide-react-native';
import { ModeA, ModeB, Spacing, Typography, BorderRadius, StatusColors, Colors } from '../../design';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface VendorOperatingHours {
  isOpenToday: boolean;
  openTime: string; // e.g. "8:00 AM"
  closeTime: string; // e.g. "10:00 PM"
}

export interface ClosedStoreStateProps {
  vendorId?: string;
  vendorName?: string;
  vendorAddress?: string;
  openTime?: string;
  isOpenToday?: boolean;
  mode?: 'dark' | 'light';
  onProfilePress?: () => void;
  style?: ViewStyle;
}

export const ClosedStoreState: React.FC<ClosedStoreStateProps> = ({
  vendorId = 'vza-darkstore-01',
  vendorName = 'Payikapuram Central Darkstore',
  vendorAddress = 'Payikapuram, Vijayawada, AP 520015',
  openTime = '8:00 AM',
  isOpenToday = false,
  mode = 'dark',
  onProfilePress,
  style,
}) => {
  const [liveIsOpen, setLiveIsOpen] = useState(isOpenToday);
  const [liveOpenTime, setLiveOpenTime] = useState(openTime);

  // Real-time Firestore listener on vendor operating hours
  useEffect(() => {
    if (!vendorId) return;

    const vendorRef = doc(db, 'vendors', vendorId);
    const unsubscribe = onSnapshot(vendorRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.operatingHours) {
          setLiveIsOpen(data.operatingHours.isOpenToday ?? false);
          if (data.operatingHours.openTime) {
            setLiveOpenTime(data.operatingHours.openTime);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [vendorId]);

  if (liveIsOpen) return null; // Store is open — render normal header

  const isDark = mode === 'dark';
  const surfaceBg = isDark ? ModeA.surface : ModeB.surface;
  const textPrimary = isDark ? ModeA.textPrimary : ModeB.textPrimary;
  const textSecondary = isDark ? ModeA.textSecondary : ModeB.textSecondary;
  const borderColor = isDark ? ModeA.border : ModeB.border;

  return (
    <View style={[styles.container, style]}>
      {/* Top Vendor Name Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.vendorInfoCol}>
          <View style={styles.nameRow}>
            <Store size={18} color={Colors.primary} style={styles.vendorIcon} />
            <Text style={[styles.vendorNameText, { color: textPrimary }]} numberOfLines={1}>
              {vendorName}
            </Text>
          </View>
          <View style={styles.addressRow}>
            <MapPin size={12} color={textSecondary} style={{ marginRight: 4 }} />
            <Text style={[styles.vendorAddressText, { color: textSecondary }]} numberOfLines={1}>
              {vendorAddress}
            </Text>
          </View>
        </View>

        {onProfilePress && (
          <TouchableOpacity
            style={[styles.profileAvatar, { backgroundColor: surfaceBg, borderColor }]}
            onPress={onProfilePress}
            activeOpacity={0.7}
          >
            <User size={18} color={textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Closed Status Card */}
      <View style={[styles.statusCard, { backgroundColor: surfaceBg, borderColor }]}>
        {/* Rotated Coral/Red Ribbon Badge (Image 7 Pattern) */}
        <View style={styles.ribbonBadge}>
          <Text style={styles.ribbonBadgeText}>STORE CLOSED</Text>
        </View>

        <View style={styles.statusContentCol}>
          <View style={styles.reopenHeaderRow}>
            <Clock size={18} color={StatusColors.error} style={{ marginRight: 6 }} />
            <Text style={[styles.reopenTitleText, { color: textPrimary }]}>
              We'll reopen at {liveOpenTime}, today
            </Text>
          </View>

          <Text style={[styles.reopenSubtext, { color: textSecondary }]}>
            You can still browse products, add items to your cart, and place a scheduled order for when the store re-opens.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  vendorInfoCol: {
    flex: 1,
    marginRight: Spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorIcon: {
    marginRight: Spacing.xs,
  },
  vendorNameText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  vendorAddressText: {
    fontSize: Typography.sizes.xs,
  },
  profileAvatar: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statusCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  ribbonBadge: {
    position: 'absolute',
    top: 12,
    right: -24,
    backgroundColor: StatusColors.error,
    paddingHorizontal: 28,
    paddingVertical: 4,
    transform: [{ rotate: '12deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  ribbonBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statusContentCol: {
    paddingRight: Spacing.xl,
  },
  reopenHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  reopenTitleText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  reopenSubtext: {
    fontSize: Typography.sizes.xs,
    lineHeight: 18,
  },
});
