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
  Platform,
  useWindowDimensions,
} from 'react-native';
import {
  Sparkles,
  Bell,
  ChevronRight,
  Package,
  Heart,
  RotateCcw,
  Gift,
  MapPin,
  CreditCard,
  HelpCircle,
  Settings,
  ShieldCheck,
  User,
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
  goldReward: '#DFAE38',
  text: '#321A2B',
  mutedText: '#756C73',
  border: '#E8E1E5',
};

export interface ProfileOverviewScreenProps {
  onNavigateToSkinReport?: () => void;
  onNavigateToOrders?: () => void;
  onNavigateToWishlist?: () => void;
  onNavigateToRewards?: () => void;
  onNavigateToAddresses?: () => void;
  onNavigateToPayments?: () => void;
  onNavigateToSupport?: () => void;
  onNavigateToSettings?: () => void;
}

export const ProfileOverviewScreen: React.FC<ProfileOverviewScreenProps> = ({
  onNavigateToSkinReport,
  onNavigateToOrders,
  onNavigateToWishlist,
  onNavigateToRewards,
  onNavigateToAddresses,
  onNavigateToPayments,
  onNavigateToSupport,
  onNavigateToSettings,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const isDesktopWeb = Platform.OS === 'web' && windowWidth > 768;

  // DESKTOP WIDESCREEN WEB LAYOUT
  if (isDesktopWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FAF4EE' }}>
        <StatusBar barStyle="light-content" backgroundColor="#8A1428" />

        {/* DESKTOP BRAND HEADER */}
        <View style={{ backgroundColor: '#8A1428', paddingVertical: 18, paddingHorizontal: 32 }}>
          <View style={{ maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Sparkles size={22} color="#FFD700" />
              <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: '#FFFFFF' }}>GlowVAI</Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>|</Text>
              <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 16, color: '#FFFFFF' }}>My Profile Dashboard</Text>
            </View>

            <TouchableOpacity style={styles.bellCircle} activeOpacity={0.8}>
              <Bell size={18} color="#FFFFFF" />
              <View style={styles.unreadDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* WIDESCREEN 2-COLUMN DASHBOARD */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 32 }}>
          <View style={{ maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', gap: 32 }}>
            
            {/* LEFT PROFILE & NAV SIDEBAR (340px) */}
            <View style={{ width: 340, gap: 20 }}>
              {/* USER CARD */}
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#E8E1E5', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10 }}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
                  }}
                  style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 12 }}
                />

                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: '#241529' }}>Ananya Sharma</Text>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: '#756C73', marginTop: 2 }}>+91 98XXXXXX42</Text>

                <View style={[styles.glowMemberBadge, { marginTop: 10, alignSelf: 'center' }]}>
                  <Sparkles size={11} color={ColorTokens.deepBerry} />
                  <Text style={styles.glowMemberText}>Glow Member</Text>
                </View>

                <TouchableOpacity
                  style={{ marginTop: 16, backgroundColor: '#8F0D2F', paddingHorizontal: 24, paddingVertical: 8, borderRadius: 16, width: '100%', alignItems: 'center' }}
                  onPress={() => (onNavigateToSettings ? onNavigateToSettings() : router.push('/settings' as any))}
                >
                  <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 12, color: '#FFFFFF' }}>Manage Profile & Settings</Text>
                </TouchableOpacity>
              </View>

              {/* QUICK LINKS CARD */}
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 12, borderWidth: 1, borderColor: '#E8E1E5' }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12, borderRadius: 12, backgroundColor: '#F2ECFA' }} onPress={() => (onNavigateToSkinReport ? onNavigateToSkinReport() : router.push('/scan/report' as any))}>
                  <Sparkles size={20} color="#5C2A91" />
                  <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 13, color: '#5C2A91', flex: 1 }}>My Glow Skin Report</Text>
                  <ChevronRight size={16} color="#5C2A91" />
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12, borderRadius: 12 }} onPress={() => (onNavigateToOrders ? onNavigateToOrders() : router.push('/orders' as any))}>
                  <Package size={20} color="#8F0D2F" />
                  <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#241529', flex: 1 }}>Orders & Live Tracking</Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12, borderRadius: 12 }} onPress={() => (onNavigateToWishlist ? onNavigateToWishlist() : router.push('/wishlist' as any))}>
                  <Heart size={20} color="#DB2777" />
                  <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#241529', flex: 1 }}>Wishlist & Formulations</Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12, borderRadius: 12 }} onPress={() => (onNavigateToAddresses ? onNavigateToAddresses() : router.push('/saved-addresses' as any))}>
                  <MapPin size={20} color="#16A34A" />
                  <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#241529', flex: 1 }}>Saved Addresses</Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12, borderRadius: 12 }} onPress={() => (onNavigateToRewards ? onNavigateToRewards() : router.push('/referrals' as any))}>
                  <Gift size={20} color="#D97706" />
                  <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#241529', flex: 1 }}>Rewards & Glow Cash</Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12, borderRadius: 12 }} onPress={() => (onNavigateToSupport ? onNavigateToSupport() : router.push('/support' as any))}>
                  <HelpCircle size={20} color="#0052FF" />
                  <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#241529', flex: 1 }}>24/7 Support & Help</Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* RIGHT MAIN DASHBOARD CONTENT AREA */}
            <View style={{ flex: 1, gap: 24 }}>
              {/* AI SKIN PROFILE CARD */}
              <View style={{ backgroundColor: '#5C2A91', borderRadius: 20, padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                      <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 11, color: '#FFFFFF' }}>MY GLOW PROFILE</Text>
                    </View>
                    <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                      <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 10, color: '#5C2A91' }}>82% confidence</Text>
                    </View>
                  </View>
                  <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 22, color: '#FFFFFF' }}>Combination Skin</Text>
                  <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
                    Your skin shows a mix of oil-prone and dry-looking areas. 3 active clinical formulations recommended.
                  </Text>
                  <TouchableOpacity
                    style={{ marginTop: 16, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 14, alignSelf: 'flex-start' }}
                    onPress={() => (onNavigateToSkinReport ? onNavigateToSkinReport() : router.push('/scan/report' as any))}
                  >
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 13, color: '#5C2A91' }}>View Skin Report →</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ACCOUNT HUB (4 BENTO TILES) */}
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: ColorTokens.softCoral, padding: 18, borderRadius: 18, borderWidth: 1, borderColor: ColorTokens.border }}
                  onPress={() => (onNavigateToOrders ? onNavigateToOrders() : router.push('/orders' as any))}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Package size={22} color={ColorTokens.deepBerry} />
                    <ChevronRight size={18} color={ColorTokens.deepBerry} />
                  </View>
                  <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: ColorTokens.text }}>My Orders</Text>
                  <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 11, color: ColorTokens.mutedText, marginTop: 2 }}>Track active shipments</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: ColorTokens.lavender, padding: 18, borderRadius: 18, borderWidth: 1, borderColor: ColorTokens.border }}
                  onPress={() => (onNavigateToWishlist ? onNavigateToWishlist() : router.push('/wishlist' as any))}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Heart size={22} color={ColorTokens.plum} />
                    <ChevronRight size={18} color={ColorTokens.plum} />
                  </View>
                  <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: ColorTokens.text }}>Wishlist</Text>
                  <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 11, color: ColorTokens.mutedText, marginTop: 2 }}>Saved formulations</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: ColorTokens.softGreen, padding: 18, borderRadius: 18, borderWidth: 1, borderColor: ColorTokens.border }}
                  onPress={() => (onNavigateToSkinReport ? onNavigateToSkinReport() : router.push('/scan/report' as any))}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <RotateCcw size={22} color={ColorTokens.successGreen} />
                    <ChevronRight size={18} color={ColorTokens.successGreen} />
                  </View>
                  <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: ColorTokens.text }}>Saved Routines</Text>
                  <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 11, color: ColorTokens.mutedText, marginTop: 2 }}>AM & PM Regimen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: '#FFF5D6', padding: 18, borderRadius: 18, borderWidth: 1, borderColor: ColorTokens.border }}
                  onPress={() => (onNavigateToRewards ? onNavigateToRewards() : router.push('/referrals' as any))}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Gift size={22} color={ColorTokens.goldReward} />
                    <ChevronRight size={18} color={ColorTokens.goldReward} />
                  </View>
                  <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: ColorTokens.text }}>Glow Rewards</Text>
                  <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 11, color: ColorTokens.mutedText, marginTop: 2 }}>₹100 Glow Cash</Text>
                </TouchableOpacity>
              </View>

              {/* RECENT ORDER CARD */}
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E8E1E5' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 11, color: '#756C73', letterSpacing: 1 }}>RECENT ORDER</Text>
                  <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 12, color: ColorTokens.successGreen }}>Delivered in 10 mins</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80',
                    }}
                    style={{ width: 54, height: 54, borderRadius: 12, backgroundColor: '#FAF4EE' }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#321A2B' }}>Skincare Essentials Set</Text>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 13, color: ColorTokens.deepBerry, marginTop: 2 }}>₹2,499</Text>
                  </View>
                  <TouchableOpacity onPress={() => (onNavigateToOrders ? onNavigateToOrders() : router.push('/orders' as any))}>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 13, color: ColorTokens.deepBerry }}>View Order →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset, height: undefined, minHeight: 64 }]}>
        <View style={styles.headerTop}>
          <View style={styles.brandRow}>
            <Sparkles size={18} color="#FFD700" />
            <Text style={styles.logoText}>GlowVAI</Text>
          </View>

          <TouchableOpacity style={styles.bellCircle} activeOpacity={0.8}>
            <Bell size={18} color="#FFFFFF" />
            <View style={styles.unreadDot} />
          </TouchableOpacity>
        </View>

        <Text style={styles.taglineText}>SMART SKIN · BEAUTY · FASTER</Text>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        {/* USER ACCOUNT CARD */}
        <TouchableOpacity
          style={styles.userCard}
          onPress={() => (onNavigateToSettings ? onNavigateToSettings() : router.push('/settings' as any))}
          activeOpacity={0.88}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
            }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>Ananya Sharma</Text>
              <View style={styles.glowMemberBadge}>
                <Sparkles size={10} color={ColorTokens.deepBerry} />
                <Text style={styles.glowMemberText}>Glow Member</Text>
              </View>
            </View>
            <Text style={styles.userPhone}>+91 98XXXXXX42</Text>
          </View>
          <ChevronRight size={20} color={ColorTokens.mutedText} />
        </TouchableOpacity>

        {/* MY GLOW PROFILE CARD (GRADIENT CARD) */}
        <View style={styles.glowProfileCard}>
          <View style={styles.glowProfileTop}>
            <View style={styles.sparkleBgCircle}>
              <Sparkles size={20} color={ColorTokens.plum} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.glowProfileTitle}>My Glow Profile</Text>
              <Text style={styles.skinTypeTitle}>Combination Skin</Text>
            </View>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceBadgeText}>82% confidence</Text>
            </View>
          </View>

          <Text style={styles.skinExplanation}>
            Your skin shows a mix of oil-prone and dry-looking areas.
          </Text>

          <TouchableOpacity
            style={styles.viewReportBtn}
            onPress={() => (onNavigateToSkinReport ? onNavigateToSkinReport() : router.push('/scan/report' as any))}
            activeOpacity={0.85}
          >
            <Text style={styles.viewReportText}>View Skin Report →</Text>
          </TouchableOpacity>
        </View>

        {/* ACCOUNT HUB (4 COMPACT TILES) */}
        <Text style={styles.sectionLabel}>MY ACCOUNT HUB</Text>
        <View style={styles.hubGrid}>
          {/* TILE 1: ORDERS */}
          <TouchableOpacity
            style={[styles.hubTile, { backgroundColor: ColorTokens.softCoral }]}
            onPress={() => (onNavigateToOrders ? onNavigateToOrders() : router.push('/orders' as any))}
            activeOpacity={0.8}
          >
            <View style={styles.tileHeader}>
              <Package size={20} color={ColorTokens.deepBerry} />
              <ChevronRight size={16} color={ColorTokens.deepBerry} />
            </View>
            <Text style={styles.tileLabel}>My Orders</Text>
          </TouchableOpacity>

          {/* TILE 2: WISHLIST */}
          <TouchableOpacity
            style={[styles.hubTile, { backgroundColor: ColorTokens.lavender }]}
            onPress={() => (onNavigateToWishlist ? onNavigateToWishlist() : router.push('/wishlist' as any))}
            activeOpacity={0.8}
          >
            <View style={styles.tileHeader}>
              <Heart size={20} color={ColorTokens.plum} />
              <ChevronRight size={16} color={ColorTokens.plum} />
            </View>
            <Text style={styles.tileLabel}>Wishlist</Text>
          </TouchableOpacity>

          {/* TILE 3: SAVED ROUTINES */}
          <TouchableOpacity
            style={[styles.hubTile, { backgroundColor: ColorTokens.softGreen }]}
            onPress={() => (onNavigateToSkinReport ? onNavigateToSkinReport() : router.push('/scan/report' as any))}
            activeOpacity={0.8}
          >
            <View style={styles.tileHeader}>
              <RotateCcw size={20} color={ColorTokens.successGreen} />
              <ChevronRight size={16} color={ColorTokens.successGreen} />
            </View>
            <Text style={styles.tileLabel}>Saved Routines</Text>
          </TouchableOpacity>

          {/* TILE 4: GLOW REWARDS */}
          <TouchableOpacity
            style={[styles.hubTile, { backgroundColor: '#FFF5D6' }]}
            onPress={() => (onNavigateToRewards ? onNavigateToRewards() : router.push('/referrals' as any))}
            activeOpacity={0.8}
          >
            <View style={styles.tileHeader}>
              <Gift size={20} color={ColorTokens.goldReward} />
              <ChevronRight size={16} color={ColorTokens.goldReward} />
            </View>
            <Text style={styles.tileLabel}>Glow Rewards</Text>
          </TouchableOpacity>
        </View>

        {/* RECENT ORDER CARD */}
        <Text style={styles.sectionLabel}>RECENT ORDER</Text>
        <TouchableOpacity
          style={styles.recentOrderCard}
          onPress={() => (onNavigateToOrders ? onNavigateToOrders() : router.push('/orders' as any))}
          activeOpacity={0.88}
        >
          <View style={styles.recentOrderHeader}>
            <Text style={styles.recentBadge}>RECENT ORDER</Text>
            <Text style={styles.deliveredBadge}>Delivered</Text>
          </View>

          <View style={styles.recentOrderBody}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80',
              }}
              style={styles.recentThumb}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.recentTitle}>Skincare Essentials Set</Text>
              <Text style={styles.recentAmount}>₹2,499</Text>
            </View>
            <Text style={styles.viewOrderCta}>View Order →</Text>
          </View>
        </TouchableOpacity>

        {/* SETTINGS ROWS CARD */}
        <Text style={styles.sectionLabel}>ACCOUNT SETTINGS</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => (onNavigateToAddresses ? onNavigateToAddresses() : router.push('/saved-addresses' as any))}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIconBg, { backgroundColor: ColorTokens.softCoral }]}>
              <MapPin size={16} color={ColorTokens.deepBerry} />
            </View>
            <Text style={styles.settingLabel}>My Addresses</Text>
            <ChevronRight size={18} color={ColorTokens.mutedText} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => (onNavigateToPayments ? onNavigateToPayments() : router.push('/payment-method' as any))}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIconBg, { backgroundColor: ColorTokens.lavender }]}>
              <CreditCard size={16} color={ColorTokens.plum} />
            </View>
            <Text style={styles.settingLabel}>Payment Methods</Text>
            <ChevronRight size={18} color={ColorTokens.mutedText} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => (onNavigateToSettings ? onNavigateToSettings() : router.push('/settings' as any))}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIconBg, { backgroundColor: ColorTokens.softGreen }]}>
              <Bell size={16} color={ColorTokens.successGreen} />
            </View>
            <Text style={styles.settingLabel}>Notifications</Text>
            <ChevronRight size={18} color={ColorTokens.mutedText} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => (onNavigateToSupport ? onNavigateToSupport() : router.push('/support' as any))}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIconBg, { backgroundColor: '#FFF5D6' }]}>
              <HelpCircle size={16} color={ColorTokens.goldReward} />
            </View>
            <Text style={styles.settingLabel}>Help & Support</Text>
            <ChevronRight size={18} color={ColorTokens.mutedText} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => (onNavigateToSettings ? onNavigateToSettings() : router.push('/settings' as any))}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIconBg, { backgroundColor: ColorTokens.softCream }]}>
              <Settings size={16} color={ColorTokens.text} />
            </View>
            <Text style={styles.settingLabel}>Settings & Privacy</Text>
            <ChevronRight size={18} color={ColorTokens.mutedText} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>
    </View>
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
  taglineText: {
    fontSize: 10,
    fontWeight: '700',
    color: ColorTokens.softCoral,
    letterSpacing: 1.5,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  glowMemberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorTokens.softCoral,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  glowMemberText: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
  },
  userPhone: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  glowProfileCard: {
    backgroundColor: ColorTokens.lavender,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(92, 42, 145, 0.2)',
  },
  glowProfileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  sparkleBgCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowProfileTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.plum,
    letterSpacing: 1,
  },
  skinTypeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  confidenceBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  confidenceBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.plum,
  },
  skinExplanation: {
    fontSize: 13,
    color: ColorTokens.mutedText,
    lineHeight: 18,
    marginBottom: 14,
  },
  viewReportBtn: {
    backgroundColor: ColorTokens.plum,
    borderRadius: 14,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewReportText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 10,
  },
  hubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  hubTile: {
    width: '48%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tileLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  recentOrderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  recentOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  recentBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
  },
  deliveredBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.successGreen,
  },
  recentOrderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: ColorTokens.softCream,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  recentAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
    marginTop: 2,
  },
  viewOrderCta: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  settingIconBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.text,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: ColorTokens.border,
  },
});
