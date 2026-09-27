import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  ChevronRight,
  MapPin,
  Zap,
  Search,
  User,
  ScanFace,
  Clock,
  Sparkles,
  Flame,
  Star,
  ShieldCheck,
  Headphones,
  Lock,
  RotateCcw,
  ArrowRight,
  Check,
  Gift,
  Heart,
  Droplet,
  Leaf,
  Sun,
  Moon,
  Wind,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

import {
  INDIAN_SKINCARE_CATALOG,
  ALL_SKINCARE_BRANDS,
  SkincareProduct,
} from '../../data/indianSkincareCatalog';
import { LOCAL_PRODUCT_IMAGES, resolveImageSource } from '../../assets/productImages';
import { useCartStore } from '../../store/useCartStore';
import { useCartStore as useZustandCartStore } from '../../state/cartStore';
import { getDeviceCurrentLocation, getActiveLocation, subscribeToLocationChange } from '../../services/locationService';
import { SearchProcessFlow } from '../../components/search/SearchProcessFlow';
import { CompactCartPill } from '../../components/cart/CompactCartPill';
import { LiveCountdown } from '../../components/ui/LiveCountdown';
import { AddToCartButton } from '../../components/ui/AddToCartButton';
import { OptimisticCartButton } from '../../components/ui/OptimisticCartButton';
import { SkeletonCard } from '../../components/ui/SkeletonCard';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';
import { logTouch, logScreenMount } from '../../utils/touchDoctor';
import { auth } from '../../config/firebase';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { ShopByCategorySection } from '../../components/shop/ShopByCategorySection';

// ─────────────────────────────────────────────
// COLOR & TYPOGRAPHY TOKENS (GLOW VAI IMPROVED THEME)
// ─────────────────────────────────────────────
const glowVaiImprovedTheme = {
  colors: {
    hero: "#900D2F",
    heroDeep: "#760A27",
    purple: "#5B2A91",
    blue: "#1677E8",
    text: "#171717",
    muted: "#73777C",
    background: "#FAFAFA",
    white: "#FFFFFF",
    border: "#ECECEF",
    success: "#159447",
    softSuccess: "#E1F5E8",
    gold: "#FFD45F",
  },

  spacing: {
    pageHorizontal: 18,
    sectionGap: 22,
    cardGap: 10,
    small: 6,
    medium: 10,
    large: 16,
  },

  radius: {
    search: 17,
    card: 18,
    tile: 12,
    banner: 18,
    floatingNav: 38,
  },

  shadows: {
    card: {
      shadowColor: "#24000D",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 5 },
      elevation: 3,
    },
    navigation: {
      shadowColor: "#000000",
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 12,
    },
  },
};

const Colors = {
  heroGradientTop: glowVaiImprovedTheme.colors.hero,
  heroGradientBottom: glowVaiImprovedTheme.colors.heroDeep,
  primary: glowVaiImprovedTheme.colors.blue,
  cartMaroon: glowVaiImprovedTheme.colors.hero,
  gold: glowVaiImprovedTheme.colors.gold,
  white: glowVaiImprovedTheme.colors.white,
  background: glowVaiImprovedTheme.colors.background,
  surface: '#FAFAFA',
  border: glowVaiImprovedTheme.colors.border,
  textPrimary: glowVaiImprovedTheme.colors.text,
  textSecondary: glowVaiImprovedTheme.colors.muted,
  success: glowVaiImprovedTheme.colors.success,
  softSuccess: glowVaiImprovedTheme.colors.softSuccess,
  warning: '#F59E0B',
};

const Typography = {
  heroHeadline: { fontFamily: 'Poppins-Bold', fontSize: 26 },
  eyebrow: { fontFamily: 'Poppins-SemiBold', fontSize: 11, letterSpacing: 0.4 },
  sectionHeader: { fontFamily: 'Poppins-SemiBold', fontSize: 17 },
  seeAll: { fontFamily: 'Poppins-Medium', fontSize: 13 },
  productName: { fontFamily: 'Poppins-Medium', fontSize: 13 },
  brandName: { fontFamily: 'Poppins-Regular', fontSize: 11 },
  price: { fontFamily: 'Poppins-SemiBold', fontSize: 15 },
  priceStrike: { fontFamily: 'Poppins-Regular', fontSize: 11, textDecorationLine: 'line-through' as const },
  etaLabel: { fontFamily: 'Poppins-SemiBold', fontSize: 15 },
  locationLabel: { fontFamily: 'Poppins-Regular', fontSize: 12 },
  badge: { fontFamily: 'Poppins-SemiBold', fontSize: 9, letterSpacing: 0.3 },
  addBtn: { fontFamily: 'Poppins-SemiBold', fontSize: 12 },
  emptyTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 18 },
};

const { width: WINDOW_W } = Dimensions.get('window');
const MAX_APP_W = 540;
const SCREEN_W = Math.min(WINDOW_W, MAX_APP_W);
const isCompactPhone = SCREEN_W <= 360;

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export interface HomeProduct {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  mrp?: number;
  etaMinutes: number;
  stock?: number;
  imageSource?: any;
}

const getImageSource = (img: any, fallbackUrl: string) => {
  if (!img) return { uri: fallbackUrl };
  if (typeof img === 'number') return img;
  if (typeof img === 'string') return { uri: img };
  if (typeof img === 'object' && img !== null) {
    if (typeof img.uri === 'string' && img.uri) return { uri: img.uri };
    if (typeof img.uri === 'number') return img.uri;
    return img;
  }
  return { uri: fallbackUrl };
};

// ─────────────────────────────────────────────
// PRODUCT CARD WITH PRESS ANIMATION & OPTIMISTIC ADD
// ─────────────────────────────────────────────
const ProductCard = React.memo(function ProductCard({ product, onAdd }: { product: HomeProduct; onAdd: (id: string) => void }) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const [added, setAdded] = useState(false);
  const btnScale = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const handlePress = () => {
    logTouch(`ProductCard "${product.name}" Tap`, { screen: 'HomeScreen', component: 'ProductCard', extra: { id: product.id } });
    safeHapticSelection();
    router.push({
      pathname: '/(customer)/product/[id]',
      params: { id: product.id },
    });
  };

  const handleAdd = () => {
    setAdded(true);
    safeHapticImpact();
    btnScale.value = withSequence(
      withSpring(1.25, { damping: 6 }),
      withSpring(1, { damping: 8 })
    );
    onAdd(product.id);
  };

  const imgUri = resolveImageSource(product.imageSource || product.image, 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80');

  return (
    <Pressable
      onPressIn={() => (scale.value = withTiming(0.96, { duration: 100 }))}
      onPressOut={() => (scale.value = withTiming(1, { duration: 150 }))}
      onPress={handlePress}
    >
      <Animated.View style={[styles.productCard, cardStyle]}>
        <View style={styles.productImageContainer}>
          {product.etaMinutes <= 15 && (
            <View style={styles.deliveryBadge}>
              <Text style={[Typography.badge, { color: glowVaiImprovedTheme.colors.success }]}>
                ⚡ {product.etaMinutes} MIN
              </Text>
            </View>
          )}
          <Image source={imgUri} style={styles.productImage} resizeMode="cover" />
        </View>

        <View style={styles.productContent}>
          <View>
            <Text style={[Typography.brandName, { color: glowVaiImprovedTheme.colors.muted }]} numberOfLines={1}>
              {product.brand}
            </Text>
            <Text style={[Typography.productName, { color: glowVaiImprovedTheme.colors.text, marginTop: 2 }]} numberOfLines={2}>
              {product.name}
            </Text>
          </View>

          <View style={{ marginTop: 4 }}>
            <View style={styles.priceRow}>
              <Text style={[Typography.price, { color: glowVaiImprovedTheme.colors.text }]}>₹{product.price}</Text>
              {product.mrp && product.mrp > product.price && (
                <Text style={[Typography.priceStrike, { color: glowVaiImprovedTheme.colors.muted, marginLeft: 6 }]}>
                  ₹{product.mrp}
                </Text>
              )}
            </View>
            {product.stock !== undefined && product.stock <= 5 && (
              <Text style={[Typography.badge, { color: Colors.warning, marginTop: 2 }]}>
                Only {product.stock} left
              </Text>
            )}
          </View>

          <View style={{ marginTop: 8, alignItems: 'center' }}>
            <AddToCartButton productId={product.id} product={product} size="medium" />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
});

// ─────────────────────────────────────────────
// PRODUCT ROW (horizontal scroll section with side swipe system)
// ─────────────────────────────────────────────
const ProductRow = React.memo(function ProductRow({
  title,
  products,
  loading,
  seeAllRoute,
  onAdd,
}: {
  title: string;
  products: HomeProduct[];
  loading: boolean;
  seeAllRoute?: string;
  onAdd: (id: string) => void;
}) {
  const router = useRouter();
  const rowScrollRef = useRef<ScrollView>(null);

  const handleScrollLeft = () => {
    rowScrollRef.current?.scrollTo({ x: 0, animated: true });
  };

  const handleScrollRight = () => {
    rowScrollRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderRow}>
        <Text style={[Typography.sectionHeader, { color: glowVaiImprovedTheme.colors.text }]}>{title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <TouchableOpacity
            style={styles.arrowBtn}
            onPress={handleScrollLeft}
            activeOpacity={0.7}
          >
            <ChevronRight size={14} color={glowVaiImprovedTheme.colors.hero} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.arrowBtn}
            onPress={handleScrollRight}
            activeOpacity={0.7}
          >
            <ChevronRight size={14} color={glowVaiImprovedTheme.colors.hero} />
          </TouchableOpacity>
          {seeAllRoute && (
            <TouchableOpacity
              style={styles.seeAllBtn}
              onPress={() => router.push(seeAllRoute as any)}
              activeOpacity={0.7}
            >
              <Text style={[Typography.seeAll, { color: glowVaiImprovedTheme.colors.hero }]}>See All</Text>
              <ChevronRight size={14} color={glowVaiImprovedTheme.colors.hero} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView
        ref={rowScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        scrollEventThrottle={16}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={styles.productCarousel}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((p) => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}
      </ScrollView>
    </View>
  );
});

// ─────────────────────────────────────────────
// AUTO-SWIPING AD BANNER CAROUSEL
// ─────────────────────────────────────────────
function AdBannerCarousel({ banners }: { banners: { id: string; image: string; title: string; subtitle: string; route: string }[] }) {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const bannerWidth = SCREEN_W - 36;

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % banners.length;
        scrollRef.current?.scrollTo({ x: next * (bannerWidth + 12), animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length, bannerWidth]);

  if (!banners.length) return null;

  return (
    <View style={styles.sectionContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: glowVaiImprovedTheme.spacing.pageHorizontal }}
      >
        {banners.map((b) => (
          <TouchableOpacity key={b.id} onPress={() => router.push(b.route as any)} activeOpacity={0.9}>
            <View style={{ width: bannerWidth, height: 130, borderRadius: glowVaiImprovedTheme.radius.banner, overflow: 'hidden', marginRight: 12, position: 'relative' }}>
              <Image source={{ uri: b.image }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
              <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.75)']} style={StyleSheet.absoluteFillObject} />
              <View style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
                <Text style={[Typography.sectionHeader, { color: glowVaiImprovedTheme.colors.white }]}>{b.title}</Text>
                <Text style={[Typography.locationLabel, { color: 'rgba(255,255,255,0.85)', marginTop: 2 }]}>{b.subtitle}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.dotsRow}>
        {banners.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// BRAND SPOTLIGHT (sponsored takeover slot)
// ─────────────────────────────────────────────
function BrandSpotlight({ brand }: { brand: { name: string; tag: string; logo: string; heroImage: string; bgColor: string; route: string } }) {
  const router = useRouter();

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={() => router.push(brand.route as any)} activeOpacity={0.92}>
        <View style={[styles.spotlightCard, { backgroundColor: brand.bgColor }]}>
          <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
            <Text style={{ fontSize: 10, fontWeight: '800', color: glowVaiImprovedTheme.colors.hero, letterSpacing: 0.8 }}>
              BRAND SPOTLIGHT · FEATURED
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: glowVaiImprovedTheme.colors.text, marginTop: 4 }}>
              {brand.name}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: glowVaiImprovedTheme.colors.muted, marginTop: 4, lineHeight: 16 }} numberOfLines={2}>
              {brand.tag}
            </Text>
            <View style={styles.spotlightCta}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>Shop Now →</Text>
            </View>
          </View>
          <View style={{ width: 100, height: 100, margin: 12, borderRadius: 14, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.5)' }}>
            <Image
              source={resolveImageSource(brand.heroImage, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────
// CATEGORY GRID (full grid)
// ─────────────────────────────────────────────
function CategoryGrid({ categories }: { categories: { id: string; name: string; image: string; route: string }[] }) {
  const router = useRouter();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderRow}>
        <Text style={[Typography.sectionHeader, { color: glowVaiImprovedTheme.colors.text }]}>Shop by Category</Text>
        <TouchableOpacity style={styles.seeAllBtn} onPress={() => router.push('/(customer)/(tabs)/shop')}>
          <Text style={[Typography.seeAll, { color: glowVaiImprovedTheme.colors.hero }]}>See All</Text>
          <ChevronRight size={14} color={glowVaiImprovedTheme.colors.hero} />
        </TouchableOpacity>
      </View>
      <View style={styles.categoryGridWrap}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.categoryTile}
            onPress={() => router.push(cat.route as any)}
            activeOpacity={0.8}
          >
            <View style={styles.categoryIconBg}>
              <Image source={{ uri: cat.image }} style={styles.categoryIcon} resizeMode="cover" />
            </View>
            <Text style={[Typography.brandName, { color: glowVaiImprovedTheme.colors.text, textAlign: 'center', marginTop: 4 }]} numberOfLines={2}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// MAIN HOME SCREEN
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// EXTENDED SECTION DATA
// ─────────────────────────────────────────────
const FLASH_DEALS_DATA = [
  { id:'fd1', brand:'Minimalist', name:'Niacinamide 10% Serum 30ml', price:299, mrp:599, discount:'50% OFF', image:'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80' },
  { id:'fd2', brand:'Cetaphil', name:'Gentle Skin Cleanser 250ml', price:349, mrp:649, discount:'46% OFF', image:'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80' },
  { id:'fd3', brand:"L'Oréal", name:'Hyaluronic Acid Serum 30ml', price:649, mrp:1299, discount:'50% OFF', image:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' },
  { id:'fd4', brand:'Dot & Key', name:'Vitamin C+E Moisturiser 60g', price:299, mrp:599, discount:'50% OFF', image:'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80' },
  { id:'fd5', brand:'Neutrogena', name:'Hydro Boost Water Gel 50g', price:499, mrp:999, discount:'50% OFF', image:'https://images.unsplash.com/photo-1608248597263-00de46196f65?auto=format&fit=crop&w=400&q=80' },
];

const CONCERN_DATA = [
  { id:'cc1', label:'Acne', emoji:'🧴', count:'68 products', color:'#FAFAFA', border:'#ECECEF', text:'#1E293B' },
  { id:'cc2', label:'Hydration', emoji:'💧', count:'54 products', color:'#FAFAFA', border:'#ECECEF', text:'#1E293B' },
  { id:'cc3', label:'Dark Spots', emoji:'✨', count:'41 products', color:'#FAFAFA', border:'#ECECEF', text:'#1E293B' },
  { id:'cc4', label:'Anti-Ageing', emoji:'🌸', count:'35 products', color:'#FAFAFA', border:'#ECECEF', text:'#1E293B' },
  { id:'cc5', label:'Glow', emoji:'🔆', count:'47 products', color:'#FAFAFA', border:'#ECECEF', text:'#1E293B' },
  { id:'cc6', label:'Oily Skin', emoji:'🌿', count:'29 products', color:'#FAFAFA', border:'#ECECEF', text:'#1E293B' },
  { id:'cc7', label:'Sensitive', emoji:'🌺', count:'22 products', color:'#FAFAFA', border:'#ECECEF', text:'#1E293B' },
  { id:'cc8', label:'Hair Growth', emoji:'💆', count:'33 products', color:'#FAFAFA', border:'#ECECEF', text:'#1E293B' },
];

const BRAND_DEAL_DATA = [
  { id:'bd1', brand:'Minimalist', off:'Up to 50% OFF', count:'28 products', bg:'#FFFFFF', accent:'#8F0D2F' },
  { id:'bd2', brand:'Cetaphil', off:'Up to 45% OFF', count:'14 products', bg:'#FFFFFF', accent:'#8F0D2F' },
  { id:'bd3', brand:'Mamaearth', off:'Up to 40% OFF', count:'52 products', bg:'#FFFFFF', accent:'#8F0D2F' },
  { id:'bd4', brand:'WOW Science', off:'Up to 48% OFF', count:'35 products', bg:'#FFFFFF', accent:'#8F0D2F' },
  { id:'bd5', brand:'Plum', off:'Up to 42% OFF', count:'41 products', bg:'#FFFFFF', accent:'#8F0D2F' },
  { id:'bd6', brand:'Dot & Key', off:'Up to 35% OFF', count:'19 products', bg:'#FFFFFF', accent:'#8F0D2F' },
];

const ROUTINE_DATA = [
  { id:'r1', label:'AM Routine', Icon: Sun, steps:['Cleanser','Toner','Serum','SPF 50+'], color:'#FFFFFF', accent:'#D97706', desc:'4-step morning glow' },
  { id:'r2', label:'PM Routine', Icon: Moon, steps:['Micellar Water','Cleanser','Retinol','Night Cream'], color:'#FFFFFF', accent:'#5C2A91', desc:'Repair & restore overnight' },
  { id:'r3', label:'Glow Boost', Icon: Sparkles, steps:['Exfoliant','Vitamin C','HA Serum','Moisturiser'], color:'#FFFFFF', accent:'#E11D48', desc:'Instant radiance in 4 steps' },
  { id:'r4', label:'Acne Control', Icon: Wind, steps:['SA Wash','Niacinamide','Spot Treat','Oil-Free SPF'], color:'#FFFFFF', accent:'#0D9488', desc:'Calm & clear breakout skin' },
];

const HAIR_DATA = [
  { id:'h1', brand:'Indulekha', name:'Bringha Hair Oil 100ml', price:249, mrp:395, discount:'37% OFF', rating:4.5, image:'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80' },
  { id:'h2', brand:'Tresemmé', name:'Keratin Smooth Shampoo 580ml', price:329, mrp:479, discount:'31% OFF', rating:4.4, image:'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=400&q=80' },
  { id:'h3', brand:'Dove', name:'Intense Repair Conditioner 175ml', price:189, mrp:275, discount:'31% OFF', rating:4.3, image:'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80' },
  { id:'h4', brand:'Streax', name:'Pro Vitariche Hair Serum 100ml', price:179, mrp:299, discount:'40% OFF', rating:4.2, image:'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80' },
];

const MAKEUP_DATA = [
  { id:'m1', brand:'Lakme', name:'9 to 5 Foundation Beige', price:549, mrp:849, discount:'35% OFF', image:'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80' },
  { id:'m2', brand:'Maybelline', name:'Fit Me Foundation 120', price:349, mrp:499, discount:'30% OFF', image:'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80' },
  { id:'m3', brand:'Sugar', name:'Ace Of Face Matte Lipstick', price:399, mrp:549, discount:'27% OFF', image:'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80' },
  { id:'m4', brand:'NYX', name:'Professional Lip Liner', price:449, mrp:599, discount:'25% OFF', image:'https://images.unsplash.com/photo-1608248597263-00de46196f65?auto=format&fit=crop&w=400&q=80' },
];

const UNDER199_DATA = [
  { id:'u1', brand:"Pond's", name:'Light Moisturiser 75ml', price:99, mrp:175, image:'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80' },
  { id:'u2', brand:'Himalaya', name:'Neem Face Wash 150ml', price:149, mrp:210, image:'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=400&q=80' },
  { id:'u3', brand:'Nivea', name:'Soft Moisturizing Cream 50ml', price:125, mrp:175, image:'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80' },
  { id:'u4', brand:'Garnier', name:'Micellar Cleansing Water 100ml', price:175, mrp:250, image:'https://images.unsplash.com/photo-1608248597263-00de46196f65?auto=format&fit=crop&w=400&q=80' },
  { id:'u5', brand:'Biotique', name:'Bio Morning Nectar SPF30 120ml', price:149, mrp:225, image:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' },
];

const WELLNESS_DATA = [
  { id:'w1', brand:'Saffola', name:'Immuniveda Chyawanprash 500g', price:299, mrp:449, discount:'33% OFF', image:'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80' },
  { id:'w2', brand:'Kapiva', name:'Aloe Vera Juice 1L', price:249, mrp:399, discount:'38% OFF', image:'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80' },
  { id:'w3', brand:'Oziva', name:'Plant Based Biotin 30 tabs', price:449, mrp:699, discount:'36% OFF', image:'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=400&q=80' },
  { id:'w4', brand:'Himalaya', name:'Pure Herbs Hair Growth 60 tabs', price:195, mrp:295, discount:'34% OFF', image:'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80' },
];

const TESTIMONIALS_DATA = [
  { id:'t1', name:'Priya S.', role:'Skincare Enthusiast', loc:'Vijayawada', text:'GlowVAI delivered in literally 9 minutes. The AI scan was spot on!', stars:5 },
  { id:'t2', name:'Riya M.', role:'Beauty Blogger', loc:'Hyderabad', text:'The AI skin report identified my combination skin zones perfectly.', stars:5 },
  { id:'t3', name:'Ananya K.', role:'Student', loc:'Vijayawada', text:'Student discount + Glow Coins + free delivery on my first order!', stars:5 },
  { id:'t4', name:'Sneha T.', role:'Professional', loc:'Vijayawada', text:'First app that understands Indian skin tones. Products actually worked!', stars:5 },
];

const FlashTimerBox: React.FC = () => {
  const [seconds, setSeconds] = useState(2342);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 2342)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;
  const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;

  return (
    <View style={xStyles.flashTimerBox}>
      <Clock size={12} color="#FFD45F" />
      <Text style={xStyles.flashTimerText}>{timeStr}</Text>
    </View>
  );
};

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState('Payikapuram, Vijayawada');
  const [deliveryEta] = useState('10');
  const [isSearchFlowOpen, setIsSearchFlowOpen] = useState(false);

  // Convert INDIAN_SKINCARE_CATALOG items to HomeProduct format with guaranteed unique stock photos (Memoized)
  const catalogProducts: HomeProduct[] = useMemo(() => {
    return INDIAN_SKINCARE_CATALOG.map((p, idx) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      image: p.official_brand_image_url || 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
      price: p.price,
      mrp: p.originalPrice || p.price + 100,
      etaMinutes: p.deliveryMinutes || 10,
      stock: idx % 3 === 0 ? 3 : undefined,
      imageSource: LOCAL_PRODUCT_IMAGES[p.id] || p.imageSource,
    }));
  }, []);

  // Cart store integration
  const handleAddToCart = (productId: string) => {
    const p = catalogProducts.find((item) => item.id === productId) || {
      id: productId,
      name: 'Clinical Product',
      brand: 'GlowVAI',
      image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
      price: 499,
      mrp: 599,
    };
    useZustandCartStore.getState().addItem({
      productId: p.id,
      name: p.name,
      brand: p.brand,
      image: typeof p.image === 'string' ? p.image : 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
      price: p.price,
      mrp: p.mrp,
    });
  };

  const [recommended, setRecommended] = useState<HomeProduct[]>([]);
  const [topPicks, setTopPicks] = useState<HomeProduct[]>([]);
  const [featured, setFeatured] = useState<HomeProduct[]>([]);
  const [stealDeals, setStealDeals] = useState<HomeProduct[]>([]);
  const [trending, setTrending] = useState<HomeProduct[]>([]);
  const [bestSelling, setBestSelling] = useState<HomeProduct[]>([]);
  const [newLaunches, setNewLaunches] = useState<HomeProduct[]>([]);
  const [dealsUnder99, setDealsUnder99] = useState<HomeProduct[]>([]);

  const fetchAllSections = useCallback(async () => {
    setLoading(true);
    setRecommended(catalogProducts.slice(0, 6));
    setTopPicks(catalogProducts.slice(6, 12));
    setFeatured(catalogProducts.slice(2, 8));
    setStealDeals(catalogProducts.slice(4, 10));
    setTrending(catalogProducts.slice(1, 7));
    setBestSelling(catalogProducts.slice(5, 11));
    setNewLaunches(catalogProducts.slice(3, 9));
    setDealsUnder99(catalogProducts.slice(0, 6).map((item) => ({ ...item, price: 99 })));
    setLoading(false);
  }, [catalogProducts]);

  useEffect(() => {
    logScreenMount('HomeScreen');
    fetchAllSections();
    getActiveLocation().then((loc) => {
      if (loc) setUserLocation(loc);
    });
    getDeviceCurrentLocation()
      .then((loc) => {
        if (loc?.formattedAddress) setUserLocation(loc.formattedAddress);
      })
      .catch(() => {});
    const unsubscribeLoc = subscribeToLocationChange((newLoc) => {
      setUserLocation(newLoc);
    });
    return () => unsubscribeLoc();
  }, [fetchAllSections]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllSections();
    setRefreshing(false);
  };

  // Flash deal expiry (15 mins from load)
  const [flashDealExpiry] = useState<number>(Date.now() + 15 * 60 * 1000 + 30 * 1000);

  const heroProduct = catalogProducts[0] || {
    id: 'p1',
    name: 'Minimalist 10% Niacinamide Serum',
    brand: 'Minimalist',
    image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
    price: 1,
    mrp: 99,
    etaMinutes: 10,
  };

  const festivalBanners = [
    {
      id: 'b1',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      title: 'Festive Glow Drop',
      subtitle: 'Flat 40% OFF on Raksha Bandhan Skincare Hampers',
      route: '/(customer)/(tabs)/shop?promo=festive',
    },
    {
      id: 'b2',
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
      title: 'Monsoon Hydration Sale',
      subtitle: 'Dermatologist-recommended ultra-light moisturizers',
      route: '/(customer)/(tabs)/shop?promo=monsoon',
    },
    {
      id: 'b3',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      title: 'Zero-Cast SPF Fest',
      subtitle: 'Broad-spectrum sunscreens starting at ₹299',
      route: '/(customer)/(tabs)/shop?promo=sunscreen',
    },
  ];

  const categories = [
    { id: 'c1', name: 'Serums', image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80', route: '/(customer)/(tabs)/shop?cat=Serums' },
    { id: 'c2', name: 'Facial Creams', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80', route: '/(customer)/(tabs)/shop?cat=Moisturizers' },
    { id: 'c3', name: 'Ointments', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80', route: '/(customer)/(tabs)/shop?cat=Treatments' },
    { id: 'c4', name: 'Lotions', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80', route: '/(customer)/(tabs)/shop?cat=Moisturizers' },
    { id: 'c5', name: 'Sunscreen', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80', route: '/(customer)/(tabs)/shop?cat=Suncare' },
    { id: 'c6', name: 'Cleansers', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&q=80', route: '/(customer)/(tabs)/shop?cat=Cleansers' },
    { id: 'c7', name: 'Facial Masks', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80', route: '/(customer)/(tabs)/shop?cat=Treatments' },
    { id: 'c8', name: 'Body Care', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80', route: '/(customer)/(tabs)/shop?cat=BodyCare' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: glowVaiImprovedTheme.colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={glowVaiImprovedTheme.colors.hero} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={glowVaiImprovedTheme.colors.blue} />
        }
      >
        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* SECTION 1 & 2: HEADER + HERO — REFINED DEEP BERRY-RED GRADIENT      */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <LinearGradient
          colors={[glowVaiImprovedTheme.colors.hero, glowVaiImprovedTheme.colors.heroDeep]}
          style={[styles.hero, { paddingTop: headerTopInset }]}
        >
          <View>
            {/* Location Header Row: Location LEFT, Profile Icon RIGHT */}
            <View style={styles.header}>
              <View style={styles.locationBlock}>
                <View style={styles.etaRow}>
                  <Zap size={16} color="#FFD45F" fill="#FFD45F" />
                  <Text style={[Typography.etaLabel, { color: glowVaiImprovedTheme.colors.white, marginLeft: 4, fontSize: 14 }]}>
                    {deliveryEta} MINS
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.locationRow}
                  onPress={() => {
                    safeHapticImpact();
                    router.push('/(customer)/map-picker' as any);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.locationText} numberOfLines={1}>
                    {userLocation}
                  </Text>
                  <ChevronRight size={14} color="#F6D2DA" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.profileIcon}
                onPress={() => router.push('/(customer)/(tabs)/profile')}
                activeOpacity={0.8}
              >
                <User size={18} color={glowVaiImprovedTheme.colors.white} />
              </TouchableOpacity>
            </View>

            {/* White Search Bar with Integrated Maroon AI Scan Button */}
            <TouchableOpacity
              style={[styles.searchBar, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EEEEEE' }]}
              onPress={() => setIsSearchFlowOpen(true)}
              activeOpacity={0.95}
              accessibilityRole="button"
              accessibilityLabel="Open existing search"
            >
              <Search size={18} color="#8F0D2F" />
              <Text style={[styles.searchPlaceholder, { color: '#64748B' }]} numberOfLines={1}>
                Search "Niacinamide, Sunscreen & more"
              </Text>
              <TouchableOpacity
                style={[styles.aiScanButton, { backgroundColor: '#8F0D2F', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 }]}
                onPress={() => {
                  safeHapticImpact();
                  router.push('/(customer)/scan/camera');
                }}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Open existing AI scanner"
              >
                <ScanFace size={14} color="#FFFFFF" />
                <Text style={[styles.aiScanText, { color: '#FFFFFF', fontWeight: '700' }]}>AI Scan</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* HERO FLASH GLOW DROP SECTION */}
            <View style={styles.heroDealZone}>
              <View style={styles.flashHeader}>
                <Text style={styles.flashLabel}>
                  ⚡ FLASH GLOW DROP · 98% MATCH
                </Text>
                <View style={styles.timerPill}>
                  <LiveCountdown expiresAt={flashDealExpiry} textStyle={{ color: glowVaiImprovedTheme.colors.white, fontSize: 10, fontWeight: '700' }} />
                </View>
              </View>

              <Text style={styles.heroTitle}>
                Flat ₹100 Off Today
              </Text>

              <View style={styles.flashLayout}>
                {/* Left 55% Column: Large Featured Offer Card */}
                <TouchableOpacity
                  style={styles.featuredOffer}
                  onPress={() =>
                    router.push({
                      pathname: '/(customer)/product/[id]',
                      params: { id: heroProduct.id },
                    })
                  }
                  activeOpacity={0.9}
                >
                  <View style={{ width: '100%', height: isCompactPhone ? 106 : 116, backgroundColor: '#F6F7F9', overflow: 'hidden' }}>
                    <Image source={getImageSource(heroProduct.imageSource || heroProduct.image, 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80')} style={styles.featuredImage} resizeMode="cover" />
                  </View>
                  <View style={styles.featuredDetails}>
                    <Text style={styles.featuredTitle} numberOfLines={2}>
                      Instant Glow Booster (1₹ Trial Sample)
                    </Text>
                    <View style={styles.priceRow}>
                      <Text style={[Typography.price, { color: glowVaiImprovedTheme.colors.hero }]}>₹1</Text>
                      <Text style={[Typography.priceStrike, { color: glowVaiImprovedTheme.colors.muted, marginLeft: 6 }]}>
                        ₹99
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Right 45% Column: 2x2 Category Tiles Grid */}
                <View style={styles.flashCategoryGrid}>
                  {[
                    { id: 'm1', label: 'Serums', image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=200&q=80', route: '/(customer)/(tabs)/shop?cat=Serums' },
                    { id: 'm2', label: 'Zero-Cast SPF', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=200&q=80', route: '/(customer)/(tabs)/shop?cat=Sunscreen' },
                    { id: 'm3', label: 'Barrier Creams', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=200&q=80', route: '/(customer)/(tabs)/shop?cat=Moisturizers' },
                    { id: 'm4', label: 'Acne Cleansers', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=200&q=80', route: '/(customer)/(tabs)/shop?cat=Cleansers' },
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.flashCategory}
                      onPress={() => router.push(item.route as any)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: item.image }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                      <View style={styles.miniTileDarkOverlay} />
                      <Text style={styles.flashCategoryTitle} numberOfLines={2}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* SECTION 2: SHOP BY CATEGORY (PASTEL VISUAL CARDS)                    */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <ShopByCategorySection />

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* SECTION 3: PURPLE FESTIVE CAMPAIGN BANNER                            */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <TouchableOpacity style={styles.campaignBanner} onPress={() => router.push('/(customer)/(tabs)/shop?promo=rakhi')} activeOpacity={0.9}>
          <View style={{ flex: 1 }}>
            <Text style={[Typography.sectionHeader, { color: glowVaiImprovedTheme.colors.white, fontWeight: '800' }]}>
              Festive Glow Drop · Raksha Bandhan Specials
            </Text>
            <Text style={[Typography.locationLabel, { color: 'rgba(255,255,255,0.85)', marginTop: 4 }]}>
              Curated clinical gift hampers delivered in 15 mins
            </Text>
          </View>
          <Text style={[Typography.badge, { color: glowVaiImprovedTheme.colors.gold, backgroundColor: 'rgba(0,0,0,0.25)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginLeft: 8 }]}>
            28th Aug
          </Text>
        </TouchableOpacity>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* SECTION 4: RECOMMENDED FOR YOU                                       */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <ProductRow
          title="Recommended for You"
          products={recommended}
          loading={loading}
          seeAllRoute="/(customer)/(tabs)/shop?section=recommended"
          onAdd={handleAddToCart}
        />

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* CONTINUOUS SCROLL RHYTHM SECTIONS                                   */}
        {/* ════════════════════════════════════════════════════════════════════ */}

        {/* Top Picks for You */}
        <ProductRow
          title="Top Picks for You"
          products={topPicks}
          loading={loading}
          seeAllRoute="/(customer)/(tabs)/shop?section=topPicks"
          onAdd={handleAddToCart}
        />

        {/* Festival/Ad Banner Carousel */}
        <AdBannerCarousel banners={festivalBanners} />

        {/* Featured */}
        <ProductRow
          title="Featured Clinical Formulations"
          products={featured}
          loading={loading}
          seeAllRoute="/(customer)/(tabs)/shop?section=featured"
          onAdd={handleAddToCart}
        />

        {/* Steal Deals */}
        <ProductRow
          title="Steal Deals"
          products={stealDeals}
          loading={loading}
          seeAllRoute="/(customer)/(tabs)/shop?section=stealDeals"
          onAdd={handleAddToCart}
        />

        {/* Trending Near You */}
        <ProductRow
          title="Trending Near You"
          products={trending}
          loading={loading}
          seeAllRoute="/(customer)/(tabs)/shop?section=trending"
          onAdd={handleAddToCart}
        />

        {/* Best Selling */}
        <ProductRow
          title="Best Selling"
          products={bestSelling}
          loading={loading}
          seeAllRoute="/(customer)/(tabs)/shop?section=bestSelling"
          onAdd={handleAddToCart}
        />

        {/* Brand Spotlight */}
        <BrandSpotlight
          brand={{
            name: 'Mamaearth',
            tag: 'Toxin-free, natural ingredient clinical solutions',
            logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80',
            heroImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
            bgColor: '#FFF4E8',
            route: '/(customer)/(tabs)/shop?brand=mamaearth',
          }}
        />

        {/* Category Grid */}
        <CategoryGrid categories={categories} />

        {/* New Launches */}
        <ProductRow
          title="New Launches"
          products={newLaunches}
          loading={loading}
          seeAllRoute="/(customer)/(tabs)/shop?section=newLaunches"
          onAdd={handleAddToCart}
        />

        {/* Deals Starting @ ₹99 */}
        <ProductRow
          title="Deals Starting @ ₹99"
          products={dealsUnder99}
          loading={loading}
          seeAllRoute="/(customer)/(tabs)/shop?section=under99"
          onAdd={handleAddToCart}
        />

        {/* Brand Marquee Ticker */}
        <View style={styles.marqueeContainer}>
          <Text style={[Typography.eyebrow, { color: glowVaiImprovedTheme.colors.muted, marginBottom: 8, paddingHorizontal: 16 }]}>
            100% AUTHENTIC CLINICAL PARTNERS
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
            {['Minimalist', 'The Derma Co', 'Plum', 'Dot & Key', 'Forest Essentials', 'Biotique', 'Dr. Sheth\'s', 'Re\'equil'].map(
              (brandName, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.marqueeChip}
                  onPress={() => router.push(`/(customer)/(tabs)/shop?brand=${encodeURIComponent(brandName)}` as any)}
                  activeOpacity={0.7}
                >
                  <Text style={[Typography.productName, { color: glowVaiImprovedTheme.colors.text }]}>{brandName}</Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>

        {/* ════ SECTION: FLASH DEALS WITH TIMER ════ */}
        <View style={xStyles.flashSection}>
          <LinearGradient colors={['#8F0D2F', '#5E173E']} start={{x:0,y:0}} end={{x:1,y:0}} style={xStyles.flashGradHeader}>
            <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
              <Zap size={18} color="#FFD45F" fill="#FFD45F" />
              <Text style={xStyles.flashTitle}>Flash Glow Deals</Text>
            </View>
            <FlashTimerBox />
          </LinearGradient>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:12,paddingHorizontal:18,paddingVertical:12}}>
            {FLASH_DEALS_DATA.map(item=>(
              <TouchableOpacity
                key={item.id}
                style={xStyles.xProdCard}
                onPress={() => {
                  safeHapticSelection();
                  router.push({
                    pathname: '/(customer)/product/[id]',
                    params: { id: item.id },
                  });
                }}
                activeOpacity={0.88}
              >
                <View style={xStyles.xDiscBadge}><Text style={xStyles.xDiscText}>{item.discount}</Text></View>
                <View style={xStyles.xImgWrap}><Image source={{uri:item.image}} style={xStyles.xImg} resizeMode="contain" /></View>
                <Text style={xStyles.xBrand}>{item.brand}</Text>
                <Text style={xStyles.xProdName} numberOfLines={2}>{item.name}</Text>
                <View style={{flexDirection:'row',alignItems:'center',gap:6,marginTop:4}}>
                  <Text style={xStyles.xCurPrice}>₹{item.price}</Text>
                  <Text style={xStyles.xMrpPrice}>₹{item.mrp}</Text>
                </View>
                <TouchableOpacity
                  style={xStyles.xAddBtn}
                  onPress={(e)=>{
                    e.stopPropagation();
                    safeHapticImpact();
                    handleAddToCart(item.id);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={xStyles.xAddBtnText}>ADD</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ════ SECTION: AI SKIN SCAN CTA BANNER ════ */}
        <View style={{marginHorizontal:18,marginTop:24}}>
          <LinearGradient colors={['#5E173E','#5C2A91','#3B1870']} start={{x:0,y:0}} end={{x:1,y:0}} style={xStyles.aiCtaBanner}>
            <View style={xStyles.aiCtaTagRow}>
              <Sparkles size={12} color="#FFD45F" />
              <Text style={xStyles.aiCtaTag}>FREE AI SKIN SCAN</Text>
            </View>
            <Text style={xStyles.aiCtaHeadline}>Know your skin's{`\n`}<Text style={{color:'#F27F78'}}>true needs</Text></Text>
            <Text style={xStyles.aiCtaSub}>Personalized cosmetic skin report in 30 sec. Free. Non-medical.</Text>
            <TouchableOpacity style={xStyles.aiCtaBtn} onPress={()=>router.push('/(customer)/scan/camera' as any)} activeOpacity={0.9}>
              <ScanFace size={16} color="#FFF" />
              <Text style={xStyles.aiCtaBtnText}>Start AI Skin Scan →</Text>
            </TouchableOpacity>
            <View style={xStyles.aiStatRow}>
              {[{l:'Skin Type',v:'Combination',bg:'#FBE0DC'},{l:'Hydration',v:'74/100',bg:'#E3F5EA'},{l:'AI Match',v:'3 Picks',bg:'#F2ECFA'}].map(c=>(
                <View key={c.l} style={[xStyles.aiStatCard,{backgroundColor:c.bg}]}>
                  <Text style={xStyles.aiStatLabel}>{c.l}</Text>
                  <Text style={xStyles.aiStatValue}>{c.v}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* ════ SECTION: SHOP BY CONCERN ════ */}
        <View style={{marginTop:28}}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[Typography.sectionHeader,{color:glowVaiImprovedTheme.colors.text}]}>Shop by Concern</Text>
            <TouchableOpacity style={styles.seeAllBtn} onPress={()=>router.push('/(customer)/(tabs)/shop' as any)} activeOpacity={0.7}>
              <Text style={[Typography.seeAll,{color:glowVaiImprovedTheme.colors.hero}]}>See All</Text>
              <ChevronRight size={14} color={glowVaiImprovedTheme.colors.hero} />
            </TouchableOpacity>
          </View>
          <View style={xStyles.concernGrid}>
            {CONCERN_DATA.map(c=>(
              <TouchableOpacity key={c.id} style={[xStyles.concernCard,{backgroundColor:'#FAFAFA',borderColor:'#ECECEF',borderWidth:1}]} onPress={()=>router.push('/(customer)/(tabs)/shop' as any)} activeOpacity={0.85}>
                <Text style={xStyles.concernEmoji}>{c.emoji}</Text>
                <Text style={[xStyles.concernLabel,{color:'#1E293B'}]}>{c.label}</Text>
                <Text style={xStyles.concernCount}>{c.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ════ SECTION: BRAND DEALS ════ */}
        <View style={{marginTop:28}}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[Typography.sectionHeader,{color:glowVaiImprovedTheme.colors.text}]}>Brand Deals</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:12,paddingHorizontal:18,paddingBottom:4}}>
            {BRAND_DEAL_DATA.map(b=>(
              <TouchableOpacity key={b.id} style={[xStyles.brandDealCard,{backgroundColor:'#FFFFFF',borderColor:'#ECECEF',borderWidth:1}]} onPress={()=>router.push('/(customer)/(tabs)/shop' as any)} activeOpacity={0.88}>
                <Text style={[xStyles.brandDealName,{color:'#1E293B'}]}>{b.brand}</Text>
                <Text style={xStyles.brandDealOff}>{b.off}</Text>
                <Text style={xStyles.brandDealCount}>{b.count}</Text>
                <View style={[xStyles.brandDealBtn,{borderColor:'#8F0D2F',borderWidth:1.5}]}><Text style={[xStyles.brandDealBtnText,{color:'#8F0D2F'}]}>Shop →</Text></View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ════ SECTION: SKINCARE ROUTINES ════ */}
        <View style={{marginTop:28}}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[Typography.sectionHeader,{color:glowVaiImprovedTheme.colors.text}]}>Build Your Routine</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:12,paddingHorizontal:18,paddingBottom:4}}>
            {ROUTINE_DATA.map(r=>(
              <View key={r.id} style={[xStyles.routineCard,{backgroundColor:'#FFFFFF',borderColor:'#ECECEF',borderWidth:1}]}>
                <View style={[xStyles.routineIconCircle,{backgroundColor:r.accent+'1E'}]}>
                  <r.Icon size={20} color={r.accent} />
                </View>
                <Text style={[xStyles.routineTitle,{color:'#1E293B'}]}>{r.label}</Text>
                <Text style={xStyles.routineDesc}>{r.desc}</Text>
                {r.steps.map((step,i)=>(
                  <View key={step} style={xStyles.routineStep}>
                    <View style={[xStyles.routineNum,{backgroundColor:r.accent}]}><Text style={xStyles.routineNumText}>{i+1}</Text></View>
                    <Text style={xStyles.routineStepText}>{step}</Text>
                  </View>
                ))}
                <TouchableOpacity style={[xStyles.routineBtn,{backgroundColor:'#159447'}]} onPress={()=>router.push('/(customer)/scan/camera' as any)} activeOpacity={0.9}>
                  <Text style={xStyles.routineBtnText}>Shop Routine →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ════ SECTION: HAIR CARE PICKS ════ */}
        <View style={{marginTop:28}}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[Typography.sectionHeader,{color:glowVaiImprovedTheme.colors.text}]}>💆 Hair Care Picks</Text>
            <TouchableOpacity style={styles.seeAllBtn} onPress={()=>router.push('/(customer)/(tabs)/shop?cat=Hair%20Care' as any)} activeOpacity={0.7}>
              <Text style={[Typography.seeAll,{color:glowVaiImprovedTheme.colors.hero}]}>See All</Text>
              <ChevronRight size={14} color={glowVaiImprovedTheme.colors.hero} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:12,paddingHorizontal:18,paddingBottom:4}}>
            {HAIR_DATA.map(item=>(
              <TouchableOpacity
                key={item.id}
                style={xStyles.xProdCard}
                onPress={() => {
                  safeHapticSelection();
                  router.push({
                    pathname: '/(customer)/product/[id]',
                    params: { id: item.id },
                  });
                }}
                activeOpacity={0.88}
              >
                <View style={xStyles.xDiscBadge}><Text style={xStyles.xDiscText}>{item.discount}</Text></View>
                <View style={xStyles.xImgWrap}><Image source={{uri:item.image}} style={xStyles.xImg} resizeMode="contain" /></View>
                <Text style={xStyles.xBrand}>{item.brand}</Text>
                <Text style={xStyles.xProdName} numberOfLines={2}>{item.name}</Text>
                <View style={{flexDirection:'row',alignItems:'center',gap:4,marginTop:2}}>
                  <Star size={11} color="#F59E0B" fill="#F59E0B" />
                  <Text style={xStyles.ratingText}>{item.rating}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',gap:6,marginTop:4}}>
                  <Text style={xStyles.xCurPrice}>₹{item.price}</Text>
                  <Text style={xStyles.xMrpPrice}>₹{item.mrp}</Text>
                </View>
                <TouchableOpacity
                  style={xStyles.xAddBtn}
                  onPress={(e)=>{
                    e.stopPropagation();
                    safeHapticImpact();
                    handleAddToCart(item.id);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={xStyles.xAddBtnText}>ADD</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ════ SECTION: MAKEUP ════ */}
        <View style={{marginTop:28}}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[Typography.sectionHeader,{color:glowVaiImprovedTheme.colors.text}]}>💄 Makeup Must-Haves</Text>
            <TouchableOpacity style={styles.seeAllBtn} onPress={()=>router.push('/(customer)/(tabs)/shop?cat=Makeup' as any)} activeOpacity={0.7}>
              <Text style={[Typography.seeAll,{color:glowVaiImprovedTheme.colors.hero}]}>See All</Text>
              <ChevronRight size={14} color={glowVaiImprovedTheme.colors.hero} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:12,paddingHorizontal:18,paddingBottom:4}}>
            {MAKEUP_DATA.map(item=>(
              <TouchableOpacity
                key={item.id}
                style={xStyles.xProdCard}
                onPress={() => {
                  safeHapticSelection();
                  router.push({
                    pathname: '/(customer)/product/[id]',
                    params: { id: item.id },
                  });
                }}
                activeOpacity={0.88}
              >
                <View style={xStyles.xDiscBadge}><Text style={xStyles.xDiscText}>{item.discount}</Text></View>
                <View style={xStyles.xImgWrap}><Image source={{uri:item.image}} style={xStyles.xImg} resizeMode="contain" /></View>
                <Text style={xStyles.xBrand}>{item.brand}</Text>
                <Text style={xStyles.xProdName} numberOfLines={2}>{item.name}</Text>
                <View style={{flexDirection:'row',alignItems:'center',gap:6,marginTop:4}}>
                  <Text style={xStyles.xCurPrice}>₹{item.price}</Text>
                  <Text style={xStyles.xMrpPrice}>₹{item.mrp}</Text>
                </View>
                <TouchableOpacity
                  style={xStyles.xAddBtn}
                  onPress={(e)=>{
                    e.stopPropagation();
                    safeHapticImpact();
                    handleAddToCart(item.id);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={xStyles.xAddBtnText}>ADD</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ════ SECTION: UNDER ₹199 ════ */}
        <View style={{marginTop:24,marginHorizontal:18,borderRadius:18,overflow:'hidden'}}>
          <LinearGradient colors={['#FFF8E7','#FBE0DC']} start={{x:0,y:0}} end={{x:1,y:0}} style={{padding:16}}>
            <View style={[styles.sectionHeaderRow,{paddingHorizontal:0,marginBottom:12}]}>
              <Text style={[Typography.sectionHeader,{color:glowVaiImprovedTheme.colors.text}]}>💸 Under ₹199</Text>
              <TouchableOpacity style={styles.seeAllBtn} onPress={()=>router.push('/(customer)/(tabs)/shop' as any)} activeOpacity={0.7}>
                <Text style={[Typography.seeAll,{color:glowVaiImprovedTheme.colors.hero}]}>See All</Text>
                <ChevronRight size={14} color={glowVaiImprovedTheme.colors.hero} />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:12,paddingBottom:4}}>
              {UNDER199_DATA.map(item=>(
                <TouchableOpacity
                  key={item.id}
                  style={xStyles.xProdCard}
                  onPress={() => {
                    safeHapticSelection();
                    router.push({
                      pathname: '/(customer)/product/[id]',
                      params: { id: item.id },
                    });
                  }}
                  activeOpacity={0.88}
                >
                  <View style={xStyles.xDiscBadge}><Text style={xStyles.xDiscText}>{Math.round((1-item.price/item.mrp)*100)}% OFF</Text></View>
                  <View style={xStyles.xImgWrap}><Image source={{uri:item.image}} style={xStyles.xImg} resizeMode="contain" /></View>
                  <Text style={xStyles.xBrand}>{item.brand}</Text>
                  <Text style={xStyles.xProdName} numberOfLines={2}>{item.name}</Text>
                  <View style={{flexDirection:'row',alignItems:'center',gap:6,marginTop:4}}>
                    <Text style={xStyles.xCurPrice}>₹{item.price}</Text>
                    <Text style={xStyles.xMrpPrice}>₹{item.mrp}</Text>
                  </View>
                  <TouchableOpacity
                    style={xStyles.xAddBtn}
                    onPress={(e)=>{
                      e.stopPropagation();
                      safeHapticImpact();
                      handleAddToCart(item.id);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={xStyles.xAddBtnText}>ADD</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </LinearGradient>
        </View>

        {/* ════ SECTION: WELLNESS ════ */}
        <View style={{marginTop:28}}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[Typography.sectionHeader,{color:glowVaiImprovedTheme.colors.text}]}>🌿 Wellness & Nutrition</Text>
            <TouchableOpacity style={styles.seeAllBtn} onPress={()=>router.push('/(customer)/(tabs)/shop?cat=Wellness' as any)} activeOpacity={0.7}>
              <Text style={[Typography.seeAll,{color:glowVaiImprovedTheme.colors.hero}]}>See All</Text>
              <ChevronRight size={14} color={glowVaiImprovedTheme.colors.hero} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:12,paddingHorizontal:18,paddingBottom:4}}>
            {WELLNESS_DATA.map(item=>(
              <TouchableOpacity
                key={item.id}
                style={xStyles.xProdCard}
                onPress={() => {
                  safeHapticSelection();
                  router.push({
                    pathname: '/(customer)/product/[id]',
                    params: { id: item.id },
                  });
                }}
                activeOpacity={0.88}
              >
                <View style={xStyles.xDiscBadge}><Text style={xStyles.xDiscText}>{item.discount}</Text></View>
                <View style={xStyles.xImgWrap}><Image source={{uri:item.image}} style={xStyles.xImg} resizeMode="contain" /></View>
                <Text style={xStyles.xBrand}>{item.brand}</Text>
                <Text style={xStyles.xProdName} numberOfLines={2}>{item.name}</Text>
                <View style={{flexDirection:'row',alignItems:'center',gap:6,marginTop:4}}>
                  <Text style={xStyles.xCurPrice}>₹{item.price}</Text>
                  <Text style={xStyles.xMrpPrice}>₹{item.mrp}</Text>
                </View>
                <TouchableOpacity
                  style={xStyles.xAddBtn}
                  onPress={(e)=>{
                    e.stopPropagation();
                    safeHapticImpact();
                    handleAddToCart(item.id);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={xStyles.xAddBtnText}>ADD</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ════ SECTION: BEAUTY PROTECTION BANNER ════ */}
        <View style={{marginTop:24,marginHorizontal:18,borderRadius:20,overflow:'hidden'}}>
          <LinearGradient colors={['#8F0D2F','#6D1028']} start={{x:0,y:0}} end={{x:1,y:0}} style={{padding:24,gap:12}}>
            <View style={{flexDirection:'row',alignItems:'center',gap:12}}>
              <View style={{width:52,height:52,borderRadius:26,backgroundColor:'rgba(255,255,255,0.15)',alignItems:'center',justifyContent:'center'}}>
                <ShieldCheck size={26} color="#FFF" />
              </View>
              <View style={{flex:1}}>
                <Text style={{fontSize:17,fontFamily:'Poppins-Bold',color:'#FFF',marginBottom:4}}>GlowVAI Beauty Protection</Text>
                <Text style={{fontSize:12,fontFamily:'Poppins-Regular',color:'rgba(255,255,255,0.85)',lineHeight:18}}>100% coverage if your skin reacts. Full refund + free dermatologist consult.</Text>
              </View>
            </View>
            <View style={{gap:8}}>
              {['Full refund if skin reacts','Free dermat consultation','No questions asked','Valid on every order'].map(pt=>(
                <View key={pt} style={{flexDirection:'row',alignItems:'center',gap:8}}>
                  <Check size={14} color="#FFD45F" />
                  <Text style={{fontSize:12,fontFamily:'Poppins-SemiBold',color:'#FFF'}}>{pt}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={{alignSelf:'flex-start',backgroundColor:'#FFF',paddingHorizontal:16,paddingVertical:8,borderRadius:12}} onPress={()=>router.push('/(customer)/support' as any)} activeOpacity={0.88}>
              <Text style={{fontSize:12,fontFamily:'Poppins-SemiBold',color:'#8F0D2F'}}>Learn More →</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* ════ SECTION: TRUST STRIP ════ */}
        <View style={{marginTop:24,marginHorizontal:18,backgroundColor:'#FFF',borderRadius:16,padding:16,borderWidth:1,borderColor:'#E8E1E5'}}>
          <Text style={{fontSize:13,fontFamily:'Poppins-Bold',color:'#241529',marginBottom:14,textAlign:'center'}}>Why GlowVAI?</Text>
          <View style={xStyles.trustGrid}>
            {[{Icon:ShieldCheck,title:'100% Authentic',sub:'Genuine products only'},{Icon:Zap,title:'10 Min Delivery',sub:'Express zone'},{Icon:RotateCcw,title:'Easy Returns',sub:'7-day policy'},{Icon:Lock,title:'Secure Pay',sub:'Cashfree certified'},{Icon:Headphones,title:'24/7 Support',sub:'WhatsApp & call'},{Icon:Sparkles,title:'Free AI Scan',sub:'Skin intelligence'}].map(tp=>(
              <View key={tp.title} style={xStyles.trustItem}>
                <View style={xStyles.trustIcon}><tp.Icon size={18} color="#8F0D2F" /></View>
                <Text style={xStyles.trustTitle}>{tp.title}</Text>
                <Text style={xStyles.trustSub}>{tp.sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ════ SECTION: TESTIMONIALS ════ */}
        <View style={{marginTop:28}}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[Typography.sectionHeader,{color:glowVaiImprovedTheme.colors.text}]}>Customer Love</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:12,paddingHorizontal:18,paddingBottom:4}}>
            {TESTIMONIALS_DATA.map(t=>(
              <View key={t.id} style={xStyles.testCard}>
                <View style={{flexDirection:'row',gap:2,marginBottom:8}}>
                  {[...Array(t.stars)].map((_,i)=><Star key={i} size={13} color="#F59E0B" fill="#F59E0B" />)}
                </View>
                <Text style={xStyles.testText}>"{t.text}"</Text>
                <View style={{flexDirection:'row',alignItems:'center',gap:10,marginTop:10}}>
                  <View style={xStyles.testAvatar}><Text style={xStyles.testAvatarText}>{t.name[0]}</Text></View>
                  <View>
                    <Text style={xStyles.testName}>{t.name}</Text>
                    <Text style={xStyles.testRole}>{t.role} · {t.loc}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ════ SECTION: APP DOWNLOAD STRIP ════ */}
        <View style={{marginTop:24,marginHorizontal:18,borderRadius:20,overflow:'hidden'}}>
          <LinearGradient colors={['#5C2A91','#5E173E']} start={{x:0,y:0}} end={{x:1,y:0}} style={{padding:24}}>
            <Text style={{fontSize:20,fontFamily:'Poppins-Bold',color:'#FFF',marginBottom:6}}>Get the GlowVAI App</Text>
            <Text style={{fontSize:12,fontFamily:'Poppins-Regular',color:'rgba(255,255,255,0.85)',lineHeight:18,marginBottom:16}}>10-min beauty delivery · AI Skin Scan · Glow Coins. All in one app.</Text>
            <View style={{flexDirection:'row',gap:10}}>
              <View style={{backgroundColor:'rgba(255,255,255,0.15)',paddingHorizontal:14,paddingVertical:8,borderRadius:10,borderWidth:1,borderColor:'rgba(255,255,255,0.25)'}}>
                <Text style={{fontSize:12,fontFamily:'Poppins-SemiBold',color:'#FFF'}}>📱 App Store</Text>
              </View>
              <View style={{backgroundColor:'rgba(255,255,255,0.15)',paddingHorizontal:14,paddingVertical:8,borderRadius:10,borderWidth:1,borderColor:'rgba(255,255,255,0.25)'}}>
                <Text style={{fontSize:12,fontFamily:'Poppins-SemiBold',color:'#FFF'}}>🤖 Google Play</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ════ SECTION: MOBILE FOOTER ════ */}
        <View style={{marginTop:24,backgroundColor:'#1A0E22',padding:24,gap:20}}>
          <View style={{flexDirection:'row',alignItems:'center',gap:6}}>
            <Sparkles size={16} color="#FFD45F" />
            <Text style={{fontSize:18,fontFamily:'Poppins-Bold',color:'#FFF'}}>GlowVAI</Text>
          </View>
          <Text style={{fontSize:11,fontFamily:'Poppins-Regular',color:'rgba(255,255,255,0.5)',lineHeight:18}}>India's first AI-powered beauty quick-commerce. Personalized skincare delivered in 10 minutes.</Text>
          <View style={{gap:12}}>
            <Text style={{fontSize:12,fontFamily:'Poppins-SemiBold',color:'#FFF',marginBottom:4}}>Quick Links</Text>
            <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
              {['Skin Care','Hair Care','Makeup','Body Care','Wellness','AI Skin Scan','Beauty Protection','Glow Coins','Student Discount','Returns & Refunds','Help & Support','About GlowVAI'].map(l=>(
                <TouchableOpacity key={l} style={{backgroundColor:'rgba(255,255,255,0.07)',paddingHorizontal:10,paddingVertical:5,borderRadius:8}} onPress={()=>router.push('/(customer)/support' as any)} activeOpacity={0.7}>
                  <Text style={{fontSize:11,fontFamily:'Poppins-Regular',color:'rgba(255,255,255,0.6)'}}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{borderTopWidth:1,borderColor:'rgba(255,255,255,0.08)',paddingTop:16,gap:4}}>
            <Text style={{fontSize:10,fontFamily:'Poppins-Regular',color:'rgba(255,255,255,0.3)'}}>© 2026 GlowVAI Technologies Pvt. Ltd. All rights reserved.</Text>
            <Text style={{fontSize:10,fontFamily:'Poppins-Regular',color:'rgba(255,255,255,0.25)'}}>Privacy Policy · Terms of Use · Disclaimer</Text>
          </View>
        </View>

        {/* End of content state */}
        <View style={styles.endState}>
          <Text style={{ fontSize: 40 }}>🎉</Text>
          <Text style={[Typography.emptyTitle, { color: glowVaiImprovedTheme.colors.text, marginTop: 8 }]}>
            You've seen it all!
          </Text>
          <Text style={[Typography.locationLabel, { color: glowVaiImprovedTheme.colors.muted, marginTop: 4, textAlign: 'center' }]}>
            Explore our complete 500+ clinical product catalog
          </Text>
          <TouchableOpacity
            style={styles.exploreCatalogBtn}
            onPress={() => router.push('/(customer)/(tabs)/shop')}
            activeOpacity={0.8}
          >
            <Text style={[Typography.addBtn, { color: glowVaiImprovedTheme.colors.white }]}>Explore Full Catalog →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Compact Cart Pill */}
      <CompactCartPill />

      {/* Search Process Modal */}
      <SearchProcessFlow
        visible={isSearchFlowOpen}
        onClose={() => setIsSearchFlowOpen(false)}
        onSelectProduct={(p) => {
          setIsSearchFlowOpen(false);
          router.push({
            pathname: '/(customer)/product/[id]',
            params: { id: p.id },
          });
        }}
      />
    </View>
  );
};

export default HomeScreen;

// ─────────────────────────────────────────────
// STYLES (MATCHING GLOW VAI IMPROVED THEME & SPEC)
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  hero: {
    backgroundColor: glowVaiImprovedTheme.colors.hero,
    paddingTop: 10,
    paddingHorizontal: glowVaiImprovedTheme.spacing.pageHorizontal,
    paddingBottom: 21,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 17,
  },
  locationBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    maxWidth: '100%',
  },
  locationText: {
    color: '#F6D2DA',
    fontSize: 13,
    lineHeight: 18,
    maxWidth: '100%',
    fontFamily: 'Poppins-Medium',
  },
  profileIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    height: 56,
    borderRadius: glowVaiImprovedTheme.radius.search,
    backgroundColor: glowVaiImprovedTheme.colors.white,
    paddingLeft: 14,
    paddingRight: 7,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 23,
    shadowColor: '#3B0012',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  searchPlaceholder: {
    flex: 1,
    minWidth: 0,
    color: glowVaiImprovedTheme.colors.muted,
    fontSize: isCompactPhone ? 12 : 14,
    lineHeight: 18,
    fontFamily: 'Poppins-Regular',
    marginLeft: 8,
  },
  aiScanButton: {
    minWidth: isCompactPhone ? 80 : 87,
    height: 42,
    borderRadius: 21,
    paddingHorizontal: isCompactPhone ? 9 : 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: glowVaiImprovedTheme.colors.blue,
  },
  aiScanText: {
    color: glowVaiImprovedTheme.colors.white,
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'Poppins-Bold',
    marginLeft: 4,
  },
  heroDealZone: {
    marginTop: 0,
  },
  flashHeader: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flashLabel: {
    flex: 1,
    color: glowVaiImprovedTheme.colors.gold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    fontFamily: 'Poppins-Bold',
  },
  timerPill: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroTitle: {
    color: glowVaiImprovedTheme.colors.white,
    fontSize: isCompactPhone ? 27 : 30,
    lineHeight: isCompactPhone ? 33 : 36,
    fontWeight: '900',
    fontFamily: 'Poppins-Bold',
    letterSpacing: -0.5,
    marginTop: 12,
    marginBottom: 17,
  },
  flashLayout: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: glowVaiImprovedTheme.spacing.cardGap,
  },
  featuredOffer: {
    flex: 1.25,
    minWidth: 0,
    overflow: 'hidden',
    borderRadius: glowVaiImprovedTheme.radius.card,
    backgroundColor: glowVaiImprovedTheme.colors.white,
    ...glowVaiImprovedTheme.shadows.card,
  },
  featuredImage: {
    width: '100%',
    height: isCompactPhone ? 106 : 116,
  },
  featuredDetails: {
    minHeight: 93,
    padding: 10,
    justifyContent: 'space-between',
  },
  featuredTitle: {
    color: glowVaiImprovedTheme.colors.text,
    fontSize: isCompactPhone ? 14 : 15,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily: 'Poppins-Bold',
  },
  flashCategoryGrid: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    rowGap: glowVaiImprovedTheme.spacing.cardGap,
  },
  flashCategory: {
    width: '48%',
    height: isCompactPhone ? 76 : 82,
    overflow: 'hidden',
    borderRadius: glowVaiImprovedTheme.radius.tile,
    backgroundColor: '#A32948',
    position: 'relative',
  },
  flashCategoryTitle: {
    position: 'absolute',
    left: 8,
    right: 5,
    bottom: 8,
    color: glowVaiImprovedTheme.colors.white,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900',
    fontFamily: 'Poppins-Bold',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 4,
    zIndex: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },

  campaignBanner: {
    minHeight: 120,
    marginHorizontal: glowVaiImprovedTheme.spacing.pageHorizontal,
    marginTop: 18,
    padding: 18,
    borderRadius: glowVaiImprovedTheme.radius.banner,
    backgroundColor: glowVaiImprovedTheme.colors.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...glowVaiImprovedTheme.shadows.card,
  },

  sectionContainer: {
    marginTop: glowVaiImprovedTheme.spacing.sectionGap,
  },
  sectionHeaderRow: {
    minHeight: 34,
    marginBottom: 12,
    paddingHorizontal: glowVaiImprovedTheme.spacing.pageHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: glowVaiImprovedTheme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  productCarousel: {
    paddingHorizontal: glowVaiImprovedTheme.spacing.pageHorizontal,
    gap: 12,
  },

  productCard: {
    width: 178,
    overflow: 'hidden',
    borderRadius: 17,
    backgroundColor: glowVaiImprovedTheme.colors.white,
    borderWidth: 1,
    borderColor: glowVaiImprovedTheme.colors.border,
    ...glowVaiImprovedTheme.shadows.card,
  },
  productImageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: '#F1F1F1',
    position: 'relative',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productContent: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  deliveryBadge: {
    position: 'absolute',
    top: 9,
    left: 9,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: glowVaiImprovedTheme.colors.softSuccess,
    zIndex: 2,
  },
  addBtn: {
    backgroundColor: glowVaiImprovedTheme.colors.hero,
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  addBtnActive: {
    backgroundColor: glowVaiImprovedTheme.colors.success,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: glowVaiImprovedTheme.colors.border,
  },
  dotActive: {
    backgroundColor: glowVaiImprovedTheme.colors.blue,
    width: 18,
  },

  spotlightCard: {
    marginHorizontal: glowVaiImprovedTheme.spacing.pageHorizontal,
    borderRadius: 18,
    padding: 0,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 128,
  },
  spotlightHero: {
    width: '100%',
    height: '100%',
  },
  spotlightCta: {
    alignSelf: 'flex-start',
    backgroundColor: glowVaiImprovedTheme.colors.hero,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 10,
  },

  categoryGridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: glowVaiImprovedTheme.spacing.pageHorizontal,
    gap: 12,
  },
  categoryTile: {
    width: (SCREEN_W - 36 - 36) / 4,
    alignItems: 'center',
  },
  categoryIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: glowVaiImprovedTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  categoryIcon: {
    width: '100%',
    height: '100%',
  },

  marqueeContainer: {
    marginTop: 24,
    paddingVertical: 14,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: glowVaiImprovedTheme.colors.border,
  },
  marqueeChip: {
    backgroundColor: glowVaiImprovedTheme.colors.white,
    borderWidth: 1,
    borderColor: glowVaiImprovedTheme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },

  endState: {
    alignItems: 'center',
    paddingVertical: 40,
    marginTop: 20,
    marginBottom: 56 + 44 + 16 + 20,
    paddingHorizontal: 24,
  },
  exploreCatalogBtn: {
    marginTop: 16,
    backgroundColor: glowVaiImprovedTheme.colors.hero,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  miniTileDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(118, 10, 39, 0.45)',
    borderRadius: glowVaiImprovedTheme.radius.tile,
  },
});

// ─────────────────────────────────────────────
// EXTENDED SECTION STYLES
// ─────────────────────────────────────────────
const xStyles = StyleSheet.create({
  // Flash section
  flashSection: { marginTop: 24 },
  flashGradHeader: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:18, paddingVertical:14 },
  flashTitle: { fontSize:18, fontFamily:'Poppins-Bold', color:'#FFF' },
  flashTimerBox: { flexDirection:'row', alignItems:'center', gap:5, backgroundColor:'rgba(255,255,255,0.15)', paddingHorizontal:10, paddingVertical:5, borderRadius:10 },
  flashTimerText: { fontSize:13, fontFamily:'Poppins-Bold', color:'#FFD45F' },

  // AI CTA Banner
  aiCtaBanner: { borderRadius:18, padding:22, gap:12 },
  aiCtaTagRow: { flexDirection:'row', alignItems:'center', gap:6 },
  aiCtaTag: { fontSize:10, fontFamily:'Poppins-Bold', color:'#FFD45F', letterSpacing:0.8 },
  aiCtaHeadline: { fontSize:24, fontFamily:'Poppins-Bold', color:'#FFF', lineHeight:32 },
  aiCtaSub: { fontSize:12, fontFamily:'Poppins-Regular', color:'rgba(255,255,255,0.8)', lineHeight:18 },
  aiCtaBtn: { height:44, borderRadius:22, backgroundColor:'#F27F78', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, alignSelf:'flex-start', paddingHorizontal:18 },
  aiCtaBtnText: { fontSize:14, fontFamily:'Poppins-SemiBold', color:'#FFF' },
  aiStatRow: { flexDirection:'row', gap:8, marginTop:4 },
  aiStatCard: { flex:1, borderRadius:12, paddingHorizontal:10, paddingVertical:8 },
  aiStatLabel: { fontSize:9, fontFamily:'Poppins-Regular', color:'#716675' },
  aiStatValue: { fontSize:12, fontFamily:'Poppins-Bold', color:'#241529', marginTop:2 },

  // Product card (extended)
  xProdCard: { width:160, backgroundColor:'#FFF', borderRadius:14, padding:12, borderWidth:1, borderColor:'#E8E1E5', position:'relative' },
  xDiscBadge: { position:'absolute', top:8, right:8, backgroundColor:'#8F0D2F', paddingHorizontal:6, paddingVertical:2, borderRadius:6, zIndex:2 },
  xDiscText: { fontSize:9, fontFamily:'Poppins-Bold', color:'#FFF' },
  xImgWrap: { width:'100%', height:100, backgroundColor:'#FAF4EE', borderRadius:10, marginBottom:8, alignItems:'center', justifyContent:'center' },
  xImg: { width:'100%', height:'100%', borderRadius:10 },
  xBrand: { fontSize:10, fontFamily:'Poppins-Regular', color:'#716675' },
  xProdName: { fontSize:12, fontFamily:'Poppins-Medium', color:'#241529', lineHeight:16, height:32, marginTop:2 },
  xCurPrice: { fontSize:14, fontFamily:'Poppins-Bold', color:'#241529' },
  xMrpPrice: { fontSize:10, fontFamily:'Poppins-Regular', color:'#716675', textDecorationLine:'line-through' },
  xAddBtn: { marginTop:8, backgroundColor:'#8F0D2F', paddingVertical:6, borderRadius:8, alignItems:'center' },
  xAddBtnText: { fontSize:11, fontFamily:'Poppins-Bold', color:'#FFF' },
  ratingText: { fontSize:11, fontFamily:'Poppins-SemiBold', color:'#241529' },

  // Concern grid
  concernGrid: { flexDirection:'row', flexWrap:'wrap', gap:10, paddingHorizontal:18 },
  concernCard: { width:(SCREEN_W - 36 - 30) / 4, borderRadius:14, borderWidth:1.5, padding:12, alignItems:'flex-start', gap:3 },
  concernEmoji: { fontSize:20, marginBottom:2 },
  concernLabel: { fontSize:11, fontFamily:'Poppins-SemiBold', lineHeight:15 },
  concernCount: { fontSize:9, fontFamily:'Poppins-Regular', color:'#716675' },

  // Brand deal cards
  brandDealCard: { width:150, borderRadius:16, padding:16, gap:4, borderWidth:1, borderColor:'#E8E1E5' },
  brandDealName: { fontSize:16, fontFamily:'Poppins-Bold' },
  brandDealOff: { fontSize:18, fontFamily:'Poppins-Bold', color:'#241529' },
  brandDealCount: { fontSize:10, fontFamily:'Poppins-Regular', color:'#716675' },
  brandDealBtn: { marginTop:6, borderWidth:1.5, borderRadius:8, paddingHorizontal:10, paddingVertical:5, alignSelf:'flex-start' },
  brandDealBtnText: { fontSize:11, fontFamily:'Poppins-SemiBold' },

  // Routine cards
  routineCard: { width:200, borderRadius:16, padding:16, gap:8, borderWidth:1, borderColor:'#E8E1E5' },
  routineIconCircle: { width:42, height:42, borderRadius:21, alignItems:'center', justifyContent:'center' },
  routineTitle: { fontSize:15, fontFamily:'Poppins-Bold' },
  routineDesc: { fontSize:10, fontFamily:'Poppins-Regular', color:'#716675' },
  routineStep: { flexDirection:'row', alignItems:'center', gap:8 },
  routineNum: { width:18, height:18, borderRadius:9, alignItems:'center', justifyContent:'center' },
  routineNumText: { fontSize:9, fontFamily:'Poppins-Bold', color:'#FFF', textAlign:'center' },
  routineStepText: { fontSize:11, fontFamily:'Poppins-Medium', color:'#241529' },
  routineBtn: { height:32, borderRadius:8, alignItems:'center', justifyContent:'center', marginTop:4 },
  routineBtnText: { fontSize:11, fontFamily:'Poppins-SemiBold', color:'#FFF' },

  // Trust strip
  trustGrid: { flexDirection:'row', flexWrap:'wrap', gap:12 },
  trustItem: { width:(SCREEN_W - 36 - 36 - 24) / 3, alignItems:'center', gap:6 },
  trustIcon: { width:44, height:44, borderRadius:22, backgroundColor:'#FBE0DC', alignItems:'center', justifyContent:'center' },
  trustTitle: { fontSize:11, fontFamily:'Poppins-SemiBold', color:'#241529', textAlign:'center' },
  trustSub: { fontSize:9, fontFamily:'Poppins-Regular', color:'#716675', textAlign:'center' },

  // Testimonials
  testCard: { width:260, backgroundColor:'#FFF', borderRadius:16, padding:16, borderWidth:1, borderColor:'#E8E1E5', gap:6 },
  testText: { fontSize:12, fontFamily:'Poppins-Regular', color:'#241529', lineHeight:18 },
  testAvatar: { width:34, height:34, borderRadius:17, backgroundColor:'#8F0D2F', alignItems:'center', justifyContent:'center' },
  testAvatarText: { fontSize:13, fontFamily:'Poppins-Bold', color:'#FFF' },
  testName: { fontSize:12, fontFamily:'Poppins-SemiBold', color:'#241529' },
  testRole: { fontSize:10, fontFamily:'Poppins-Regular', color:'#716675' },
});
