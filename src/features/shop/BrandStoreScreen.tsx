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
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Star,
  Zap,
  ShoppingBag,
  ShieldCheck,
  Heart,
  Share2,
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
  coral: '#D4472C',
  successGreen: '#2D9D5F',
  successBg: '#E6F4EA',
  surface: '#FAFAFA',
  mainText: '#1A1A1A',
  secondaryText: '#6B6B6B',
  border: '#EDEBE6',
  cardBg: '#FFFFFF',
  gold: '#F59E0B',
};

export const BrandStoreScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const cartTotalCount = useCartStore((state) => state.totalCount);
  const addItem = useCartStore((state) => state.addItem);

  const [activeCategory, setActiveCategory] = useState('Best Sellers');
  const [wishlistState, setWishlistState] = useState<Record<string, boolean>>({});

  const categories = ['Best Sellers', 'Serums', 'Suncare', 'Moisturizers', 'Bundles'];

  const brandProducts = [
    {
      id: 'b_m1',
      brand: 'MINIMALIST',
      name: 'Niacinamide 10% Face Serum with Zinc',
      benefit: 'Reduces Blemishes & Sebum Production',
      rating: 4.8,
      reviews: '22.1k',
      price: 599,
      mrp: 699,
      discount: '14% OFF',
      image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
      category: 'Serums',
    },
    {
      id: 'b_m2',
      brand: 'MINIMALIST',
      name: 'Salicylic Acid 2% BHA Serum',
      benefit: 'Deep Pore Cleansing & Acne Control',
      rating: 4.7,
      reviews: '18.4k',
      price: 549,
      mrp: 599,
      discount: '8% OFF',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
      category: 'Serums',
    },
    {
      id: 'b_m3',
      brand: 'MINIMALIST',
      name: 'SPF 50 PA++++ Light Fluid Sunscreen',
      benefit: 'No White Cast Broad Spectrum Protection',
      rating: 4.9,
      reviews: '15.8k',
      price: 499,
      mrp: 599,
      discount: '16% OFF',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
      category: 'Suncare',
    },
    {
      id: 'b_m4',
      brand: 'MINIMALIST',
      name: 'Marula Oil 05% Deep Moisture Gel',
      benefit: 'Restores Skin Barrier & Deep Hydration',
      rating: 4.6,
      reviews: '9.2k',
      price: 649,
      mrp: 749,
      discount: '13% OFF',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
      category: 'Moisturizers',
    },
  ];

  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth > 768;

  const toggleWishlist = (id: string) => {
    safeHapticSelection();
    setWishlistState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (item: typeof brandProducts[0]) => {
    safeHapticImpact();
    addItem({
      productId: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      mrp: item.mrp,
      image: item.image,
    });
  };

  if (isDesktopWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: ColorTokens.warmIvory }}>
        <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

        {/* DESKTOP HEADER BAR */}
        <View style={{ backgroundColor: ColorTokens.deepBerry, paddingVertical: 16, paddingHorizontal: 32 }}>
          <View style={{ maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <TouchableOpacity
                style={styles.headerIconBtn}
                onPress={() => {
                  if (router.canGoBack()) router.back();
                  else router.push('/(customer)/(tabs)' as any);
                }}
                activeOpacity={0.8}
              >
                <ArrowLeft size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: '#FFFFFF' }}>
                  Minimalist Flagship Brand Store
                </Text>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: '#FBE0DC' }}>
                  Direct Factory Partner Store · Express 10–15 Min Delivery
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
            {/* BRAND HERO SHOWCASE BANNER */}
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: ColorTokens.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, flex: 1 }}>
                <View style={styles.logoSquare}>
                  <Text style={styles.logoText}>M.</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 24, color: ColorTokens.mainText, letterSpacing: 1 }}>
                      MINIMALIST
                    </Text>
                    <CheckCircle2 size={20} color={ColorTokens.successGreen} />
                  </View>
                  <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: ColorTokens.secondaryText, marginTop: 4 }}>
                    Science-Backed, High-Efficacy Clinical Skincare Formulations
                  </Text>
                </View>
              </View>

              <View style={styles.partnerBadge}>
                <ShieldCheck size={16} color={ColorTokens.successGreen} />
                <Text style={styles.partnerBadgeText}>
                  ✓ Verified Brand Partner · Guaranteed Genuine Products
                </Text>
              </View>
            </View>

            {/* CATEGORIES BAR */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 14, backgroundColor: isActive ? ColorTokens.coral : '#FFFFFF', borderWidth: 1, borderColor: isActive ? ColorTokens.coral : ColorTokens.border }}
                    onPress={() => {
                      safeHapticSelection();
                      setActiveCategory(cat);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontFamily: isActive ? 'Poppins-Bold' : 'Poppins-Medium', fontSize: 13, color: isActive ? '#FFFFFF' : ColorTokens.mainText }}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 4-COLUMN PRODUCT GRID */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
              {brandProducts.map((item) => (
                <View key={item.id} style={{ width: '23.5%', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: ColorTokens.border, position: 'relative' }}>
                  <View style={styles.deliveryBadge}>
                    <Zap size={9} color="#FFFFFF" fill="#FFFFFF" />
                    <Text style={styles.deliveryBadgeText}>15 MIN</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.heartBtn}
                    onPress={() => toggleWishlist(item.id)}
                    activeOpacity={0.8}
                  >
                    <Heart
                      size={16}
                      color={wishlistState[item.id] ? ColorTokens.coral : '#888888'}
                      fill={wishlistState[item.id] ? ColorTokens.coral : 'transparent'}
                    />
                  </TouchableOpacity>

                  <Image source={resolveImageSource(item.image)} style={{ width: '100%', height: 140, marginTop: 8, marginBottom: 8 }} resizeMode="contain" />

                  <Text style={styles.cardBrand}>{item.brand}</Text>
                  <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.cardBenefit} numberOfLines={1}>{item.benefit}</Text>

                  <View style={styles.ratingRow}>
                    <Star size={11} color={ColorTokens.gold} fill={ColorTokens.gold} />
                    <Text style={styles.ratingVal}>{item.rating}</Text>
                    <Text style={styles.reviewsVal}>({item.reviews})</Text>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>₹{item.price}</Text>
                    <Text style={styles.mrpText}>₹{item.mrp}</Text>
                    <Text style={styles.discountText}>{item.discount}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.addCartBtn}
                    onPress={() => handleAdd(item)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.addCartBtnText}>ADD TO CART →</Text>
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
          style={styles.headerIconBtn}
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

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Minimalist Official Store</Text>
          <Text style={styles.headerSub}>Payikapuram Dark Store · 15 Min Delivery</Text>
        </View>

        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => router.push('/(customer)/(tabs)/cart')}
          activeOpacity={0.8}
        >
          <ShoppingBag size={20} color="#FFFFFF" />
          {cartTotalCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartTotalCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* BRAND HERO BANNER */}
        <View style={styles.heroCard}>
          <View style={styles.brandHeroRow}>
            <View style={styles.logoSquare}>
              <Text style={styles.logoText}>M.</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.brandTitle}>MINIMALIST</Text>
                <CheckCircle2 size={16} color={ColorTokens.successGreen} />
              </View>
              <Text style={styles.brandTagline}>Transparent, Science-Backed Skincare Formulations</Text>
            </View>
          </View>

          <View style={styles.partnerBadge}>
            <ShieldCheck size={14} color={ColorTokens.successGreen} />
            <Text style={styles.partnerBadgeText}>
              ✓ 100% Official Brand Partner · Direct Factory Supply
            </Text>
          </View>
        </View>

        {/* CATEGORY TABS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryTab, isActive && styles.categoryTabActive]}
                onPress={() => {
                  safeHapticSelection();
                  setActiveCategory(cat);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryTabText, isActive && styles.categoryTabTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* PRODUCT GRID */}
        <View style={styles.productGrid}>
          {brandProducts.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <View style={styles.deliveryBadge}>
                <Zap size={9} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.deliveryBadgeText}>15 MIN</Text>
              </View>

              <TouchableOpacity
                style={styles.heartBtn}
                onPress={() => toggleWishlist(item.id)}
                activeOpacity={0.8}
              >
                <Heart
                  size={16}
                  color={wishlistState[item.id] ? ColorTokens.coral : '#888888'}
                  fill={wishlistState[item.id] ? ColorTokens.coral : 'transparent'}
                />
              </TouchableOpacity>

              <Image source={resolveImageSource(item.image)} style={styles.productImg} resizeMode="contain" />

              <Text style={styles.cardBrand}>{item.brand}</Text>
              <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.cardBenefit} numberOfLines={1}>{item.benefit}</Text>

              <View style={styles.ratingRow}>
                <Star size={11} color={ColorTokens.gold} fill={ColorTokens.gold} />
                <Text style={styles.ratingVal}>{item.rating}</Text>
                <Text style={styles.reviewsVal}>({item.reviews})</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceText}>₹{item.price}</Text>
                <Text style={styles.mrpText}>₹{item.mrp}</Text>
                <Text style={styles.discountText}>{item.discount}</Text>
              </View>

              <TouchableOpacity
                style={styles.addCartBtn}
                onPress={() => handleAdd(item)}
                activeOpacity={0.85}
              >
                <Text style={styles.addCartBtnText}>ADD TO CART</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 90 + insets.bottom }} />
      </ScrollView>

      {/* FLOATING CART SUMMARY PILL */}
      {cartTotalCount > 0 && (
        <TouchableOpacity
          style={[styles.cartPill, { bottom: 20 + Math.max(insets.bottom, 0) }]}
          onPress={() => router.push('/(customer)/(tabs)/cart')}
          activeOpacity={0.9}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ShoppingBag size={18} color="#FFFFFF" />
            <Text style={styles.cartPillText}>{cartTotalCount} items in cart</Text>
          </View>
          <Text style={styles.cartPillArrow}>View Cart →</Text>
        </TouchableOpacity>
      )}
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
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  headerSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#FBE0DC',
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
    gap: 14,
  },
  heroCard: {
    backgroundColor: ColorTokens.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  brandHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoSquare: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#FFFFFF',
  },
  brandTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: ColorTokens.mainText,
    letterSpacing: 1,
  },
  brandTagline: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
    marginTop: 2,
  },
  partnerBadge: {
    backgroundColor: ColorTokens.successBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  partnerBadgeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: ColorTokens.successGreen,
  },
  tabsRow: {
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: ColorTokens.surface,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  categoryTabActive: {
    backgroundColor: ColorTokens.coral,
    borderColor: ColorTokens.coral,
  },
  categoryTabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.secondaryText,
  },
  categoryTabTextActive: {
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  productGrid: {
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
  deliveryBadge: {
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
  deliveryBadgeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 8,
    color: '#FFFFFF',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
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
  cardBrand: {
    fontFamily: 'Poppins-Bold',
    fontSize: 9,
    color: ColorTokens.secondaryText,
    letterSpacing: 0.5,
  },
  cardName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 16,
    color: ColorTokens.mainText,
    marginTop: 2,
  },
  cardBenefit: {
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
    color: ColorTokens.secondaryText,
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
    color: ColorTokens.secondaryText,
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    color: ColorTokens.successGreen,
  },
  addCartBtn: {
    backgroundColor: ColorTokens.coral,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addCartBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  cartPill: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: ColorTokens.deepBerry,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  cartPillText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  cartPillArrow: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
});
