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
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Search,
  ScanFace,
  ShoppingBag,
  MapPin,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Heart,
  Star,
  Zap,
  Sparkles,
  Home,
  Store,
  User,
} from 'lucide-react-native';

import { useCartStore } from '../../state/cartStore';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

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

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ProductCatalogStoreHub: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const cartTotalCount = useCartStore((state) => state.totalCount);
  const addItem = useCartStore((state) => state.addItem);

  const [activeCategory, setActiveCategory] = useState('All');
  const [wishlistState, setWishlistState] = useState<Record<string, boolean>>({ p1: true });
  const [isListView, setIsListView] = useState(false);

  const categories = [
    'All',
    'Skin Care',
    'Hair Care',
    'Makeup',
    'Body Care',
    'Wellness',
    'Fragrance',
    "Men's Grooming",
  ];

  const products = [
    {
      id: 'p1',
      brand: 'The Ordinary',
      name: 'Niacinamide 10% + Zinc 1% Serum',
      size: '30ml',
      rating: 4.8,
      reviews: '2,346',
      price: 699,
      mrp: 900,
      discount: '22% OFF',
      image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p2',
      brand: 'CeraVe',
      name: 'Moisturizing Cream with Ceramides',
      size: '50g',
      rating: 4.7,
      reviews: '1,890',
      price: 599,
      mrp: 799,
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p3',
      brand: "L'Oréal Paris",
      name: 'Revitalift Hyaluronic Acid Serum',
      size: '30ml',
      rating: 4.6,
      reviews: '3,120',
      price: 1199,
      mrp: 1499,
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p4',
      brand: 'Neutrogena',
      name: 'Hydro Boost Water Gel Moisturizer',
      size: '50g',
      rating: 4.5,
      reviews: '1,450',
      price: 799,
      mrp: 1000,
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p5',
      brand: 'Maybelline',
      name: 'SuperStay Matte Ink Liquid Lipstick',
      size: '5ml · Shade 657',
      rating: 4.8,
      reviews: '4,210',
      price: 399,
      mrp: 499,
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'p6',
      brand: 'GlowVAI',
      name: 'Radiant Glow Barrier Day Cream',
      size: '50g',
      rating: 4.9,
      reviews: '890',
      price: 699,
      mrp: 999,
      discount: '30% OFF',
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const toggleWishlist = (id: string) => {
    safeHapticSelection();
    setWishlistState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (prod: typeof products[0]) => {
    safeHapticImpact();
    addItem({
      productId: prod.id,
      name: prod.name,
      brand: prod.brand,
      price: prod.price,
      mrp: prod.mrp,
      image: prod.image,
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER: ROUNDED BERRY HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.iconCircle}
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

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} color={ColorTokens.gold} />
            <Text style={styles.logoText}>GlowVAI</Text>
          </View>

          <TouchableOpacity style={styles.locationPill} onPress={() => router.push('/location-setup')} activeOpacity={0.8}>
            <MapPin size={12} color="#FBE0DC" />
            <Text style={styles.locationText}>Vijayawada</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconCircle} onPress={() => router.push('/(customer)/(tabs)/cart')} activeOpacity={0.8}>
            <ShoppingBag size={18} color="#FFFFFF" />
            {cartTotalCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartTotalCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR WITH INTEGRATED AI SCAN */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/search-filters' as any)}
          activeOpacity={0.9}
        >
          <Search size={16} color={ColorTokens.mutedText} />
          <Text style={styles.searchPlaceholder}>Search skincare, haircare & more</Text>
          <TouchableOpacity
            style={styles.aiScanBtn}
            onPress={() => router.push('/(customer)/scan/camera')}
            activeOpacity={0.85}
          >
            <ScanFace size={13} color="#FFFFFF" />
            <Text style={styles.aiScanBtnText}>AI Scan</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* PAGE TITLE */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Shop All Beauty</Text>
          <Text style={styles.productCount}>48 Items</Text>
        </View>

        {/* CATEGORY RAIL */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRail}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => {
                  safeHapticSelection();
                  setActiveCategory(cat);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* FILTER ROW */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => router.push('/search-filters' as any)}
            activeOpacity={0.8}
          >
            <Filter size={14} color={ColorTokens.mainText} />
            <Text style={styles.filterBtnText}>Filters</Text>
            <View style={styles.filterCountBadge}>
              <Text style={styles.filterCountText}>2</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => router.push('/search-filters' as any)}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={14} color={ColorTokens.mainText} />
            <Text style={styles.filterBtnText}>Sort By</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewToggleBtn}
            onPress={() => setIsListView(!isListView)}
            activeOpacity={0.8}
          >
            {isListView ? (
              <LayoutGrid size={16} color={ColorTokens.mainText} />
            ) : (
              <List size={16} color={ColorTokens.mainText} />
            )}
          </TouchableOpacity>
        </View>

        {/* PRODUCT GRID */}
        <View style={isListView ? styles.listGrid : styles.twoColumnGrid}>
          {products.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.productCard, isListView && styles.productListCard]}
              onPress={() =>
                router.push({
                  pathname: '/(customer)/product/[id]',
                  params: { id: item.id },
                })
              }
              activeOpacity={0.9}
            >
              {/* 10 MIN EXPRESS BADGE */}
              <View style={styles.cardDeliveryBadge}>
                <Zap size={9} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.cardDeliveryText}>10 MIN</Text>
              </View>

              {/* WISHLIST HEART */}
              <TouchableOpacity
                style={styles.wishlistBtn}
                onPress={() => toggleWishlist(item.id)}
                activeOpacity={0.8}
              >
                <Heart
                  size={16}
                  color={wishlistState[item.id] ? ColorTokens.deepBerry : ColorTokens.mutedText}
                  fill={wishlistState[item.id] ? ColorTokens.deepBerry : 'transparent'}
                />
              </TouchableOpacity>

              <Image source={{ uri: item.image }} style={styles.productImg} resizeMode="contain" />

              <View style={styles.cardDetails}>
                <Text style={styles.brandText}>{item.brand}</Text>
                <Text style={styles.nameText} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.sizeText}>{item.size}</Text>

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
                  <Text style={styles.addBtnText}>ADD</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* FLOATING CART PILL */}
      <TouchableOpacity
        style={[styles.floatingCartPill, { bottom: 80 + insets.bottom }]}
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
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  locationText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
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
  searchBar: {
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 5,
  },
  searchPlaceholder: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginLeft: 8,
    flex: 1,
  },
  aiScanBtn: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: ColorTokens.plum,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiScanBtnText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  pageTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: ColorTokens.mainText,
  },
  productCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: ColorTokens.mutedText,
  },
  categoryRail: {
    gap: 8,
    paddingBottom: 14,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  categoryChipActive: {
    backgroundColor: ColorTokens.deepBerry,
    borderColor: ColorTokens.deepBerry,
  },
  categoryChipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.mainText,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  filterBtnText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.mainText,
  },
  filterCountBadge: {
    backgroundColor: ColorTokens.deepBerry,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCountText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 9,
    color: '#FFFFFF',
  },
  viewToggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: ColorTokens.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  twoColumnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  listGrid: {
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
  productListCard: {
    width: '100%',
    flexDirection: 'row',
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
    gap: 3,
    zIndex: 2,
  },
  cardDeliveryText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 8,
    color: '#FFFFFF',
  },
  wishlistBtn: {
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
    height: 110,
    marginTop: 10,
    marginBottom: 8,
  },
  cardDetails: {
    flex: 1,
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
    marginTop: 2,
  },
  sizeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.mutedText,
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
    fontSize: 11,
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
