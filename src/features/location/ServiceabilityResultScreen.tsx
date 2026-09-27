import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  Edit2,
  Zap,
  Package,
  Navigation,
  Clock,
  CheckCircle,
  Heart,
  Compass,
  Bell,
  RotateCcw,
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

export interface ServiceabilityResultScreenProps {
  onBack?: () => void;
  onStartShopping?: () => void;
  initialServiceable?: boolean;
}

export const ServiceabilityResultScreen: React.FC<ServiceabilityResultScreenProps> = ({
  onBack,
  onStartShopping,
  initialServiceable = true,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [isServiceable, setIsServiceable] = useState(initialServiceable);
  const [notified, setNotified] = useState(false);

  const handleShopping = () => {
    if (onStartShopping) {
      onStartShopping();
    }
    router.push('/(customer)/(tabs)/shop' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset }]}>
        <TouchableOpacity
          style={styles.backCircle}
          onPress={onBack || (() => router.back())}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Sparkles size={16} color="#FFD700" />
          <Text style={styles.headerTitle}>Delivery availability</Text>
        </View>

        {/* State Toggle for demo/testing */}
        <TouchableOpacity
          style={styles.stateToggleBtn}
          onPress={() => setIsServiceable(!isServiceable)}
          activeOpacity={0.8}
        >
          <RotateCcw size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        {isServiceable ? (
          <>
            {/* MAIN CELEBRATORY ILLUSTRATION CARD */}
            <View style={styles.illustrationCard}>
              <View style={styles.illusCircleBg} />
              
              {/* Scooter & Pin Route Visual */}
              <View style={styles.routeContainer}>
                <View style={styles.scooterCircle}>
                  <Compass size={28} color={ColorTokens.deepBerry} />
                </View>

                {/* Soft Route Line */}
                <View style={styles.routeDashLine} />

                {/* Berry Pin with Glowing Heart */}
                <View style={styles.pinCircle}>
                  <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
                </View>
              </View>

              <View style={styles.beautyBoxBadge}>
                <Package size={16} color={ColorTokens.successGreen} />
                <Text style={styles.beautyBoxText}>Fresh Beauty Box</Text>
              </View>
            </View>

            {/* MAIN SUCCESS MESSAGE */}
            <View style={styles.messageSection}>
              <View style={styles.glowZoneBadge}>
                <Sparkles size={14} color={ColorTokens.deepBerry} />
                <Text style={styles.glowZoneText}>GLOW ZONE ACTIVE</Text>
              </View>

              <Text style={styles.headline}>You’re in the glow zone!</Text>
              <Text style={styles.subtitle}>
                10-minute beauty delivery is available at your address.
              </Text>
            </View>

            {/* SELECTED ADDRESS CARD */}
            <View style={styles.selectedAddressCard}>
              <View style={styles.selectedAddrHeader}>
                <Text style={styles.selectedAddrBadge}>SELECTED ADDRESS</Text>
                <TouchableOpacity
                  style={styles.editPencilBtn}
                  onPress={() => router.push('/location-setup' as any)}
                  activeOpacity={0.8}
                >
                  <Edit2 size={13} color={ColorTokens.deepBerry} />
                  <Text style={styles.editPencilText}>Edit</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.selectedAddrRow}>
                <View style={styles.berryLocationIconBg}>
                  <MapPin size={20} color={ColorTokens.deepBerry} />
                </View>
                <Text style={styles.selectedAddrText}>
                  Home · Payakapuram, Vijayawada
                </Text>
              </View>
            </View>

            {/* THREE EQUAL DELIVERY DETAIL CARDS */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <View style={[styles.detailIconBg, { backgroundColor: ColorTokens.softGreen }]}>
                  <Zap size={18} color={ColorTokens.successGreen} />
                </View>
                <Text style={styles.detailValue}>10 MIN</Text>
                <Text style={styles.detailLabel}>Average delivery</Text>
              </View>

              <View style={styles.detailCard}>
                <View style={[styles.detailIconBg, { backgroundColor: ColorTokens.softCoral }]}>
                  <Package size={18} color={ColorTokens.deepBerry} />
                </View>
                <Text style={styles.detailValue}>Fresh stock</Text>
                <Text style={styles.detailLabel}>Nearby warehouse</Text>
              </View>

              <View style={styles.detailCard}>
                <View style={[styles.detailIconBg, { backgroundColor: ColorTokens.lavender }]}>
                  <Navigation size={18} color={ColorTokens.plum} />
                </View>
                <Text style={styles.detailValue}>Live order</Text>
                <Text style={styles.detailLabel}>GPS tracking</Text>
              </View>
            </View>

            {/* SERVICEABLE CATEGORIES */}
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>SERVICEABLE CATEGORIES</Text>

              <View style={styles.categoryChipsRow}>
                {[
                  { name: 'Skin Care', icon: Sparkles, bg: ColorTokens.softCoral },
                  { name: 'Makeup', icon: Heart, bg: ColorTokens.lavender },
                  { name: 'Hair Care', icon: Package, bg: ColorTokens.softGreen },
                  { name: 'Wellness', icon: CheckCircle, bg: ColorTokens.softCream },
                ].map((cat, idx) => {
                  const IconComp = cat.icon;
                  return (
                    <View key={idx} style={[styles.catChip, { backgroundColor: cat.bg }]}>
                      <IconComp size={14} color={ColorTokens.deepBerry} />
                      <Text style={styles.catChipText}>{cat.name}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* INFORMATION NOTE */}
            <View style={styles.infoNote}>
              <Clock size={15} color={ColorTokens.mutedText} />
              <Text style={styles.infoNoteText}>
                Delivery time may vary during peak hours.
              </Text>
            </View>
          </>
        ) : (
          /* NON-SERVICEABLE STATE DESIGN */
          <View style={styles.nonServiceableContainer}>
            <View style={styles.nonServIconCircle}>
              <Compass size={40} color={ColorTokens.plum} />
            </View>

            <Text style={styles.nonServHeadline}>We’re not in your area yet</Text>
            <Text style={styles.nonServSubtitle}>
              We’ll let you know when GlowVAI reaches your location in Vijayawada.
            </Text>

            <View style={styles.nonServAddressCard}>
              <MapPin size={18} color={ColorTokens.mutedText} style={{ marginRight: 8 }} />
              <Text style={styles.nonServAddressText}>
                Payakapuram, Sector 9, Vijayawada
              </Text>
            </View>

            <TouchableOpacity
              style={styles.notifyBtn}
              onPress={() => setNotified(true)}
              activeOpacity={0.8}
            >
              <Bell size={18} color={ColorTokens.plum} style={{ marginRight: 8 }} />
              <Text style={styles.notifyBtnText}>
                {notified ? '✓ We will notify you!' : 'Notify Me When Available'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTIONS */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {isServiceable ? (
          <>
            <TouchableOpacity
              style={styles.primaryShoppingBtn}
              onPress={handleShopping}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryShoppingText}>Start Shopping →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryChangeBtn}
              onPress={() => router.push('/location-setup' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryChangeText}>Change Address</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.primaryShoppingBtn}
            onPress={() => router.push('/location-setup' as any)}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryShoppingText}>Change Address</Text>
          </TouchableOpacity>
        )}
      </View>
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
  stateToggleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  illustrationCard: {
    backgroundColor: ColorTokens.softCream,
    borderRadius: 24,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  illusCircleBg: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: ColorTokens.softCoral,
    opacity: 0.3,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
    marginBottom: 8,
  },
  scooterCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ColorTokens.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeDashLine: {
    width: 70,
    height: 2,
    backgroundColor: ColorTokens.coral,
  },
  pinCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ColorTokens.deepBerry,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  beautyBoxBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  beautyBoxText: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  messageSection: {
    alignItems: 'center',
    marginBottom: 18,
  },
  glowZoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ColorTokens.softCoral,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  glowZoneText: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
    letterSpacing: 1,
  },
  headline: {
    fontSize: 24,
    fontWeight: '800',
    color: ColorTokens.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: ColorTokens.mutedText,
    textAlign: 'center',
    lineHeight: 20,
  },
  selectedAddressCard: {
    backgroundColor: ColorTokens.softCoral,
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(242, 127, 120, 0.3)',
  },
  selectedAddrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  selectedAddrBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
    letterSpacing: 1,
  },
  editPencilBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editPencilText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
  selectedAddrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  berryLocationIconBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAddrText: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorTokens.text,
    flex: 1,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorTokens.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  detailIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  detailLabel: {
    fontSize: 10,
    color: ColorTokens.mutedText,
    marginTop: 2,
    textAlign: 'center',
  },
  categoriesSection: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 10,
  },
  categoryChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  catChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  infoNoteText: {
    fontSize: 12,
    color: ColorTokens.mutedText,
  },
  nonServiceableContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  nonServIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ColorTokens.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  nonServHeadline: {
    fontSize: 22,
    fontWeight: '800',
    color: ColorTokens.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  nonServSubtitle: {
    fontSize: 14,
    color: ColorTokens.mutedText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  nonServAddressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    marginBottom: 20,
  },
  nonServAddressText: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorTokens.text,
  },
  notifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.lavender,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(92, 42, 145, 0.2)',
  },
  notifyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.plum,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: ColorTokens.border,
    gap: 10,
  },
  primaryShoppingBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryShoppingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryChangeBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: ColorTokens.deepBerry,
  },
  secondaryChangeText: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
});
