import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Zap,
  Star,
  Tag,
  Sparkles,
  Home,
  Store,
  ScanFace,
  User,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../../state/cartStore';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';
import { resolveImageSource } from '../../assets/productImages';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  plum: '#5C2A91',
  warmIvory: '#FFFDF7',
  softLavender: '#F2ECFA',
  coral: '#F27F78',
  cobaltBlue: '#1677E8',
  successGreen: '#159447',
  softGreen: '#E3F5EA',
  mainText: '#241529',
  mutedText: '#716675',
  border: '#E8E1E5',
  cardBg: '#FFFFFF',
  gold: '#FFD45F',
};

export const WishlistScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const cartTotalCount = useCartStore((state) => state.totalCount);
  const addItem = useCartStore((state) => state.addItem);

  const [activeTab, setActiveTab] = useState<'all' | 'pricedrops' | 'backinstock'>('all');
  const [priceAlertsEnabled, setPriceAlertsEnabled] = useState(true);

  const wishlistProducts = [
    {
      id: 'w1',
      brand: 'Laneige',
      name: 'Water Bank Blue Hyaluronic Moisture Cream',
      benefit: 'Intense 100-Hour Moisture Barrier Support',
      rating: 4.9,
      reviews: '1,420',
      price: 2150,
      mrp: 2400,
      discount: '10% OFF',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'w2',
      brand: 'CeraVe',
      name: 'Hydrating Hyaluronic Acid Serum',
      benefit: 'Restores Skin Moisture Barrier',
      rating: 4.8,
      reviews: '980',
      price: 1299,
      mrp: 1599,
      discount: '18% OFF',
      image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'w3',
      brand: 'Fenty Beauty',
      name: 'Gloss Bomb Universal Lip Luminizer',
      benefit: 'Explosive Shine & Nourishing Feel',
      rating: 4.9,
      reviews: '3,110',
      price: 1900,
      mrp: 2100,
      discount: '9% OFF',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'w4',
      brand: 'Kérastase',
      name: 'Elixir Ultime L’Huile Original Hair Oil',
      benefit: 'Sublime Shine & Frizz Control',
      rating: 4.9,
      reviews: '2,040',
      price: 3200,
      mrp: 3600,
      discount: '11% OFF',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth > 768;

  const handleAdd = (item: typeof wishlistProducts[0]) => {
    safeHapticImpact();
    addItem({ productId: item.id, name: item.name, brand: item.brand, price: item.price, mrp: item.mrp, image: item.image });
  };

  if (isDesktopWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: ColorTokens.warmIvory }}>
        <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

        {/* DESKTOP HEADER */}
        <View style={{ backgroundColor: ColorTokens.deepBerry, paddingVertical: 16, paddingHorizontal: 32 }}>
          <View style={{ maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  if (router.canGoBack()) router.back();
                  else router.push('/(customer)/(tabs)' as any);
                }}
                activeOpacity={0.8}
              >
                <ArrowLeft size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Heart size={20} color={ColorTokens.gold} fill={ColorTokens.gold} />
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: '#FFFFFF' }}>
                  My Saved Wishlist Favorites
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 18 }}
              onPress={() => router.push('/(customer)/(tabs)/cart')}
              activeOpacity={0.85}
            >
              <ShoppingBag size={18} color="#FFFFFF" />
              <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 13, color: '#FFFFFF' }}>
                Cart ({cartTotalCount})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MAIN DESKTOP CONTAINER */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={{ maxWidth: 1280, width: '100%', alignSelf: 'center', padding: 32, gap: 24 }}>
            {/* TABS & ALERT TOGGLE BAR */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: ColorTokens.border }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {[
                  { id: 'all', label: 'All Saved (4)' },
                  { id: 'pricedrops', label: 'Price Drops' },
                  { id: 'backinstock', label: 'Back in Stock' },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <TouchableOpacity
                      key={tab.id}
                      style={{ paddingHorizontal: 18, paddingVertical: 8, borderRadius: 12, backgroundColor: isActive ? ColorTokens.deepBerry : '#F7F4F6' }}
                      onPress={() => {
                        safeHapticSelection();
                        setActiveTab(tab.id as any);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={{ fontFamily: isActive ? 'Poppins-Bold' : 'Poppins-Medium', fontSize: 12, color: isActive ? '#FFFFFF' : ColorTokens.mainText }}>
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Tag size={16} color={ColorTokens.plum} />
                  <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 12, color: ColorTokens.mainText }}>
                    Price Drop Notifications
                  </Text>
                </View>
                <Switch
                  value={priceAlertsEnabled}
                  onValueChange={(val) => {
                    safeHapticSelection();
                    setPriceAlertsEnabled(val);
                  }}
                  trackColor={{ false: '#D1C7CE', true: ColorTokens.deepBerry }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* 4-COLUMN DESKTOP PRODUCT GRID */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
              {wishlistProducts.map((item) => (
                <View key={item.id} style={{ width: '23.5%', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: ColorTokens.border, position: 'relative' }}>
                  <View style={styles.cardDeliveryBadge}>
                    <Zap size={9} color="#FFFFFF" fill="#FFFFFF" />
                    <Text style={styles.cardDeliveryText}>10 MIN</Text>
                  </View>

                  <TouchableOpacity style={styles.filledHeartBtn} activeOpacity={0.8}>
                    <Heart size={16} color={ColorTokens.deepBerry} fill={ColorTokens.deepBerry} />
                  </TouchableOpacity>

                  <Image source={resolveImageSource(item.image)} style={{ width: '100%', height: 140, marginTop: 8, marginBottom: 8 }} resizeMode="contain" />

                  <Text style={styles.brandText}>{item.brand}</Text>
                  <Text style={styles.nameText} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.benefitText} numberOfLines={1}>{item.benefit}</Text>

                  <View style={styles.ratingRow}>
                    <Star size={11} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingVal}>{item.rating}</Text>
                    <Text style={styles.reviewsVal}>({item.reviews})</Text>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>₹{item.price}</Text>
                    <Text style={styles.mrpText}>₹{item.mrp}</Text>
                    <Text style={styles.discountText}>{item.discount}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => handleAdd(item)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.addBtnText}>MOVE TO CART →</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

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
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleRow}>
          <Heart size={18} color={ColorTokens.gold} fill={ColorTokens.gold} />
          <Text style={styles.headerTitle}>My Wishlist</Text>
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/(customer)/(tabs)/cart')} activeOpacity={0.8}>
          <ShoppingBag size={18} color="#FFFFFF" />
          {cartTotalCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartTotalCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* SEGMENTED TABS */}
        <View style={styles.tabsContainer}>
          {[
            { id: 'all', label: 'All Saved (4)' },
            { id: 'pricedrops', label: 'Price Drops' },
            { id: 'backinstock', label: 'Back in Stock' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => {
                  safeHapticSelection();
                  setActiveTab(tab.id as any);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* PRICE DROP ALERT NOTIFICATION CARD */}
        <View style={styles.alertCard}>
          <View style={styles.alertIconWrap}>
            <Tag size={18} color={ColorTokens.plum} />
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.alertTitle}>Get notified on price drops</Text>
            <Text style={styles.alertSub}>We'll alert you instantly when your saved picks go on sale.</Text>
          </View>

          <Switch
            value={priceAlertsEnabled}
            onValueChange={(val) => {
              safeHapticSelection();
              setPriceAlertsEnabled(val);
            }}
            trackColor={{ false: '#D1C7CE', true: ColorTokens.deepBerry }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* WISHLIST PRODUCT GRID */}
        <View style={styles.twoColumnGrid}>
          {wishlistProducts.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <View style={styles.cardDeliveryBadge}>
                <Zap size={9} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.cardDeliveryText}>10 MIN</Text>
              </View>

              <TouchableOpacity style={styles.filledHeartBtn} activeOpacity={0.8}>
                <Heart size={16} color={ColorTokens.deepBerry} fill={ColorTokens.deepBerry} />
              </TouchableOpacity>

              <Image source={resolveImageSource(item.image)} style={styles.productImg} resizeMode="contain" />

              <Text style={styles.brandText}>{item.brand}</Text>
              <Text style={styles.nameText} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.benefitText} numberOfLines={1}>{item.benefit}</Text>

              <View style={styles.ratingRow}>
                <Star size={11} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingVal}>{item.rating}</Text>
                <Text style={styles.reviewsVal}>({item.reviews})</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceText}>₹{item.price}</Text>
                <Text style={styles.mrpText}>₹{item.mrp}</Text>
                <Text style={styles.discountText}>{item.discount}</Text>
              </View>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => handleAdd(item)}
                activeOpacity={0.85}
              >
                <Text style={styles.addBtnText}>ADD TO CART</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 110 + insets.bottom }} />
      </ScrollView>

      {/* FLOATING CART PILL */}
      <TouchableOpacity
        style={[styles.floatingCartPill, { bottom: 64 + Math.max(insets.bottom, 0) }]}
        onPress={() => router.push('/(customer)/(tabs)/cart')}
        activeOpacity={0.9}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ShoppingBag size={18} color="#FFFFFF" />
          <Text style={styles.floatingCartText}>
            {cartTotalCount > 0 ? `${cartTotalCount} items` : '3 items'} · ₹1,997
          </Text>
        </View>
        <Text style={styles.floatingCartArrow}>→</Text>
      </TouchableOpacity>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 6), height: 56 + Math.max(insets.bottom, 0) }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(customer)/(tabs)')}>
          <Home size={20} color={ColorTokens.mutedText} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(customer)/(tabs)/shop')}>
          <Store size={20} color={ColorTokens.deepBerry} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.centralScanBtn}
          onPress={() => router.push('/(customer)/scan/camera')}
          activeOpacity={0.9}
        >
          <ScanFace size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(customer)/(tabs)/cart')}>
          <ShoppingBag size={20} color={ColorTokens.mutedText} />
          <Text style={styles.navLabel}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(customer)/(tabs)/profile')}>
          <User size={20} color={ColorTokens.mutedText} />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: ColorTokens.coral,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 9,
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabItemActive: {
    backgroundColor: ColorTokens.deepBerry,
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: ColorTokens.mutedText,
  },
  tabTextActive: {
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  alertCard: {
    backgroundColor: ColorTokens.softLavender,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2D1FC',
  },
  alertIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.plum,
  },
  alertSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.mutedText,
  },
  twoColumnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    position: 'relative',
  },
  cardDeliveryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    zIndex: 2,
  },
  cardDeliveryText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 8,
    color: '#FFFFFF',
  },
  filledHeartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  productImg: {
    width: '100%',
    height: 100,
    marginTop: 10,
    marginBottom: 6,
  },
  brandText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.mutedText,
  },
  nameText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 16,
    color: ColorTokens.mainText,
    marginTop: 1,
  },
  benefitText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.plum,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  ratingVal: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: ColorTokens.mainText,
  },
  reviewsVal: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.mutedText,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  priceText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  mrpText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.mutedText,
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    color: ColorTokens.successGreen,
  },
  addBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 10,
    paddingVertical: 7,
    alignItems: 'center',
    marginTop: 10,
  },
  addBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  floatingCartPill: {
    position: 'absolute',
    bottom: 64,
    alignSelf: 'center',
    backgroundColor: ColorTokens.deepBerry,
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '88%',
    shadowColor: ColorTokens.deepBerry,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 10,
  },
  floatingCartText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  floatingCartArrow: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  bottomNav: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: ColorTokens.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  navItem: {
    alignItems: 'center',
    gap: 2,
  },
  navLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.mutedText,
  },
  navLabelActive: {
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.deepBerry,
  },
  centralScanBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
    shadowColor: ColorTokens.deepBerry,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
