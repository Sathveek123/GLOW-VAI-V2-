import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Search,
  ScanFace,
  User,
  ShoppingBag,
  MapPin,
  Clock,
  Sparkles,
  Flame,
  Heart,
  Droplet,
  Leaf,
  Flower2,
  ChevronRight,
  Zap,
  ShieldCheck,
  Headphones,
  Lock,
  ArrowRight,
  Star,
  Plus,
  RotateCcw,
  BadgePercent,
  Gift,
  Tag,
  Package,
  Truck,
  Check,
  ChevronDown,
  Sun,
  Moon,
  Wind,
  X,
  SlidersHorizontal,
  ChevronLeft,
  Command,
  CheckCircle2,
  AlertCircle,
  Sparkle,
} from 'lucide-react-native';

import { useCartStore } from '../../../state/cartStore';
import { safeHapticImpact } from '../../../utils/haptics';

// ─────────────────────────────────────────────
// DESIGN SYSTEM TOKENS (9.8/10 Quality Scale)
// ─────────────────────────────────────────────
const C = {
  deepBerry: '#8F0D2F',
  deepPlum: '#5E173E',
  plum: '#5C2A91',
  coral: '#F27F78',
  softCoral: '#FBE0DC',
  ivory: '#FFFDF7',
  cream: '#FAF4EE',
  lavender: '#F2ECFA',
  cobalt: '#1677E8',
  green: '#159447',
  softGreen: '#E3F5EA',
  text: '#241529',
  muted: '#716675',
  border: '#E8E1E5',
  white: '#FFFFFF',
  gold: '#FFD45F',
  amber: '#F59E0B',
  cardBg: '#FFFFFF',
  hoverOverlay: 'rgba(143, 13, 47, 0.04)',
};

// ─────────────────────────────────────────────
// DATA SOURCES
// ─────────────────────────────────────────────
const CATEGORIES = [
  { id: 'c1', label: 'Skin Care', Icon: Sparkles, route: '/(customer)/(tabs)/shop?cat=Skin%20Care', bg: '#FBE0DC', iconColor: '#8F0D2F' },
  { id: 'c2', label: 'Hair Care', Icon: Flame, route: '/(customer)/(tabs)/shop?cat=Hair%20Care', bg: '#FAF2FC', iconColor: '#5C2A91' },
  { id: 'c3', label: 'Makeup', Icon: Heart, route: '/(customer)/(tabs)/shop?cat=Makeup', bg: '#FFF0F5', iconColor: '#5E173E' },
  { id: 'c4', label: 'Body Care', Icon: Droplet, route: '/(customer)/(tabs)/shop?cat=Body%20Care', bg: '#EDF7FA', iconColor: '#0E6F8E' },
  { id: 'c5', label: 'Wellness', Icon: Leaf, route: '/(customer)/(tabs)/shop?cat=Wellness', bg: '#EDF7F2', iconColor: '#159447' },
  { id: 'c6', label: 'Fragrance', Icon: Flower2, route: '/(customer)/(tabs)/shop?cat=Fragrance', bg: '#FAF7ED', iconColor: '#8A6200' },
  { id: 'c7', label: "Men's Grooming", Icon: User, route: "/(customer)/(tabs)/shop?cat=Men's%20Grooming", bg: '#E8F1F8', iconColor: '#1E5AAD' },
  { id: 'c8', label: 'Baby Care', Icon: Heart, route: '/(customer)/(tabs)/shop?cat=Baby%20Care', bg: '#FFF3E0', iconColor: '#E65100' },
  { id: 'c9', label: 'K-Beauty', Icon: Sparkles, route: '/(customer)/(tabs)/shop?cat=K-Beauty', bg: '#F3E5F5', iconColor: '#7B1FA2' },
  { id: 'c10', label: 'Luxury', Icon: Tag, route: '/(customer)/(tabs)/shop?cat=Luxury', bg: '#FFF8E1', iconColor: '#FF8F00' },
];

const FLASH_DEALS = [
  { id: 'f1', brand: 'Minimalist', name: 'Niacinamide 10% Serum (30ml)', price: 299, mrp: 599, discount: '50% OFF', rating: 4.8, reviews: '22.1k', image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80' },
  { id: 'f2', brand: 'Cetaphil', name: 'Gentle Skin Cleanser (250ml)', price: 349, mrp: 649, discount: '46% OFF', rating: 4.7, reviews: '18.4k', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80' },
  { id: 'f3', brand: "L'Oréal", name: 'Hyaluronic Acid Serum (30ml)', price: 649, mrp: 1299, discount: '50% OFF', rating: 4.7, reviews: '15.2k', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' },
  { id: 'f4', brand: 'Dot & Key', name: 'Vitamin C+E Moisturiser (60g)', price: 299, mrp: 599, discount: '50% OFF', rating: 4.4, reviews: '6.8k', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80' },
  { id: 'f5', brand: 'Neutrogena', name: 'Hydro Boost Water Gel (50g)', price: 499, mrp: 999, discount: '50% OFF', rating: 4.6, reviews: '12.4k', image: 'https://images.unsplash.com/photo-1608248597263-00de46196f65?auto=format&fit=crop&w=400&q=80' },
];

const BESTSELLERS = [
  { id: 'b1', brand: 'Mamaearth', name: 'Vitamin C Face Wash (100ml)', price: 199, mrp: 299, discount: '33% OFF', rating: 4.5, reviews: '20.3k', tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=400&q=80' },
  { id: 'b2', brand: 'The Ordinary', name: 'Retinol 0.5% in Squalane (30ml)', price: 649, mrp: 850, discount: '24% OFF', rating: 4.6, reviews: '11.2k', tag: 'Top Rated', image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80' },
  { id: 'b3', brand: 'WOW Science', name: 'Apple Cider Shampoo (300ml)', price: 299, mrp: 499, discount: '40% OFF', rating: 4.4, reviews: '14.7k', tag: 'Trending', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'b4', brand: 'Forest Essentials', name: 'Facial Tonic Mist (50ml)', price: 995, mrp: 1595, discount: '38% OFF', rating: 4.6, reviews: '6.8k', tag: 'Premium', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' },
  { id: 'b5', brand: 'Dove', name: 'Daily Shine Shampoo (650ml)', price: 249, mrp: 399, discount: '38% OFF', rating: 4.3, reviews: '9.1k', tag: 'Value', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80' },
];

const CONCERN_EDITS = [
  { id: 'e1', label: 'Acne Edit', emoji: '🧴', sub: '68 products', color: '#FAFAFA', border: '#EEEEEE', text: '#1E293B' },
  { id: 'e2', label: 'Hydration Edit', emoji: '💧', sub: '54 products', color: '#FAFAFA', border: '#EEEEEE', text: '#1E293B' },
  { id: 'e3', label: 'Dark Spot Edit', emoji: '✨', sub: '41 products', color: '#FAFAFA', border: '#EEEEEE', text: '#1E293B' },
  { id: 'e4', label: 'Anti-Ageing Edit', emoji: '🌸', sub: '35 products', color: '#FAFAFA', border: '#EEEEEE', text: '#1E293B' },
  { id: 'e5', label: 'Glow Edit', emoji: '🔆', sub: '47 products', color: '#FAFAFA', border: '#EEEEEE', text: '#1E293B' },
  { id: 'e6', label: 'Oily Skin Edit', emoji: '🌿', sub: '29 products', color: '#FAFAFA', border: '#EEEEEE', text: '#1E293B' },
  { id: 'e7', label: 'Sensitive Edit', emoji: '🌺', sub: '22 products', color: '#FAFAFA', border: '#EEEEEE', text: '#1E293B' },
  { id: 'e8', label: 'Hair Growth Edit', emoji: '💆', sub: '33 products', color: '#FAFAFA', border: '#EEEEEE', text: '#1E293B' },
];

const BRAND_DEALS = [
  { id: 'bd1', brand: 'Minimalist', off: 'Up to 50% OFF', count: '28 products' },
  { id: 'bd2', brand: 'Cetaphil', off: 'Up to 45% OFF', count: '14 products' },
  { id: 'bd3', brand: 'Mamaearth', off: 'Up to 40% OFF', count: '52 products' },
  { id: 'bd4', brand: 'WOW Science', off: 'Up to 48% OFF', count: '35 products' },
  { id: 'bd5', brand: 'Plum', off: 'Up to 42% OFF', count: '41 products' },
  { id: 'bd6', brand: 'Dot & Key', off: 'Up to 35% OFF', count: '19 products' },
];

const SKINCARE_ROUTINES = [
  { id: 'r1', label: 'AM Routine', Icon: Sun, steps: ['Cleanser', 'Toner', 'Serum', 'SPF 50+'], color: '#FFFFFF', accent: '#D97706', desc: '4-step morning glow ritual' },
  { id: 'r2', label: 'PM Routine', Icon: Moon, steps: ['Micellar Water', 'Cleanser', 'Retinol', 'Night Cream'], color: '#FFFFFF', accent: '#5C2A91', desc: 'Repair & restore overnight' },
  { id: 'r3', label: 'Glow Boost', Icon: Sparkles, steps: ['Exfoliant', 'Vitamin C', 'HA Serum', 'Moisturiser'], color: '#FFFFFF', accent: '#E11D48', desc: 'Instant radiance in 4 steps' },
  { id: 'r4', label: 'Acne Control', Icon: Wind, steps: ['Salicylic Wash', 'Niacinamide', 'Spot Treat', 'Oil-Free SPF'], color: '#FFFFFF', accent: '#0D9488', desc: 'Calm & clear breakout skin' },
];

const TESTIMONIALS = [
  { id: 'tm1', name: 'Priya S.', role: 'Skincare Enthusiast', loc: 'Vijayawada', text: 'GlowVAI delivered my skincare order in literally 9 minutes. The AI scan was spot on — recommended exactly what my dry skin needed.', stars: 5 },
  { id: 'tm2', name: 'Riya M.', role: 'Beauty Blogger', loc: 'Hyderabad', text: 'The AI skin report is genuinely impressive. It identified my combination skin zones perfectly and the product suggestions have been game changers.', stars: 5 },
  { id: 'tm3', name: 'Ananya K.', role: 'College Student', loc: 'Vijayawada', text: 'Got student discount + Glow Coins + free delivery all on my first order. The app is so smooth. Ordered at 11pm, delivered by 11:12pm!', stars: 5 },
];

import { getActiveLocation, subscribeToLocationChange, getDeviceCurrentLocation, saveActiveLocation } from '../../../services/locationService';

// ─────────────────────────────────────────────
// PRODUCT CARD COMPONENT (9.8 Precision Baseline)
// ─────────────────────────────────────────────
interface ProductCardProps {
  item: {
    id: string;
    brand: string;
    name: string;
    price: number;
    mrp: number;
    discount?: string;
    rating?: number;
    reviews?: string;
    tag?: string;
    image: string;
  };
  onAdd: () => void;
  quantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

function DesktopProductCard({ item, onAdd, quantity = 0, onIncrement, onDecrement }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <View style={s.prodCard}>
      {item.discount && (
        <View style={s.discBadge}>
          <Text style={s.discBadgeText}>{item.discount}</Text>
        </View>
      )}
      <TouchableOpacity
        style={s.wishlistBtn}
        onPress={() => {
          safeHapticImpact();
          setIsWishlisted(!isWishlisted);
        }}
        activeOpacity={0.8}
      >
        <Heart size={14} color={isWishlisted ? C.deepBerry : C.muted} fill={isWishlisted ? C.deepBerry : 'transparent'} />
      </TouchableOpacity>

      <View style={s.prodImgWrap}>
        <Image source={{ uri: item.image }} style={s.prodImg} resizeMode="contain" />
        <View style={s.etaBadge}>
          <Zap size={9} color={C.gold} fill={C.gold} />
          <Text style={s.etaBadgeText}>10 MIN</Text>
        </View>
      </View>

      <Text style={s.prodBrand}>{item.brand}</Text>
      <Text style={s.prodName} numberOfLines={2}>{item.name}</Text>

      {item.rating && (
        <View style={s.ratingRow}>
          <Star size={11} color={C.amber} fill={C.amber} />
          <Text style={s.ratingVal}>{item.rating}</Text>
          {item.reviews && <Text style={s.ratingCount}>({item.reviews})</Text>}
        </View>
      )}

      <View style={s.priceRow}>
        <Text style={s.curPrice}>₹{item.price}</Text>
        <Text style={s.mrpPrice}>₹{item.mrp}</Text>
      </View>

      <View style={s.cardFooter}>
        {quantity > 0 ? (
          <View style={s.stepperBox}>
            <TouchableOpacity style={s.stepperBtn} onPress={onDecrement} activeOpacity={0.8}>
              <Text style={s.stepperBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={s.stepperCount}>{quantity}</Text>
            <TouchableOpacity style={s.stepperBtn} onPress={onIncrement} activeOpacity={0.8}>
              <Text style={s.stepperBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={s.addBtn} onPress={onAdd} activeOpacity={0.85}>
            <Text style={s.addBtnText}>ADD</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// SECTION HEADER COMPONENT
// ─────────────────────────────────────────────
function SectionHeader({ title, subtitle, onViewAll }: { title: string; subtitle?: string; onViewAll?: () => void }) {
  return (
    <View style={s.secHeaderRow}>
      <View style={{ flex: 1 }}>
        <Text style={s.secTitle}>{title}</Text>
        {subtitle && <Text style={s.secSub}>{subtitle}</Text>}
      </View>
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={s.viewAll}>View all →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// MAIN DESKTOP WEBVIEW HOME SCREEN (9.8 Quality)
// ─────────────────────────────────────────────
export const GlowVaiWebviewHomeScreen: React.FC = () => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = useCartStore((state) => state.totalCount);
  const addItem = useCartStore((state) => state.addItem);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);

  const [activeCategory, setActiveCategory] = useState('Skin Care');
  const [secondsLeft, setSecondsLeft] = useState(2295);
  const [selectedLocation, setSelectedLocation] = useState('Payakapuram, Vijayawada');
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    getActiveLocation().then((loc) => {
      if (loc) setSelectedLocation(loc);
    });
    getDeviceCurrentLocation().catch(() => null);
    const unsubscribeLoc = subscribeToLocationChange((newLoc) => {
      setSelectedLocation(newLoc);
    });
    return () => unsubscribeLoc();
  }, []);

  // Live timer tick
  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((p) => (p > 0 ? p - 1 : 2295)), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTimer = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAdd = (item: any) => {
    safeHapticImpact();
    addItem({ productId: item.id, name: item.name, brand: item.brand, price: item.price, mrp: item.mrp, image: item.image });
    showToast(`Added ${item.brand} ${item.name.split(' ')[0]} to cart`);
  };

  const getQuantity = (id: string) => {
    return cartItems[id]?.quantity ?? 0;
  };

  const push = (route: any) => {
    safeHapticImpact();
    router.push(route);
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.deepPlum} />

      {/* ═══════════════════════════════════ TOAST NOTIFICATION ═══════════════════════════════════ */}
      {toastMessage && (
        <View style={s.toastBox}>
          <CheckCircle2 size={16} color={C.green} />
          <Text style={s.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* ═══════════════════════════════════ FIXED TWO-TIER DESKTOP HEADER ═══════════════════════════════════ */}
      <View style={s.header}>
        {/* ROW 1: 72px Fixed Height Header Bar */}
        <View style={s.headerRow1}>
          <View style={s.headerContainer}>
            {/* Zone 1: Logo */}
            <TouchableOpacity style={s.logoRow} onPress={() => push('/(customer)/(tabs)')} activeOpacity={0.85}>
              <View style={s.logoSparkleCircle}>
                <Sparkles size={16} color={C.gold} />
              </View>
              <Text style={s.logoText}>GlowVAI</Text>
            </TouchableOpacity>

            {/* Zone 2: Location Selector -> Direct to OpenStreetMap Map Picker */}
            <TouchableOpacity style={s.locationPill} onPress={() => push('/(customer)/map-picker' as any)} activeOpacity={0.8}>
              <MapPin size={16} color={C.softCoral} />
              <View style={{ marginLeft: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={s.locCity} numberOfLines={1}>{selectedLocation}</Text>
                  <ChevronDown size={12} color={C.softCoral} />
                </View>
                <Text style={s.locEta}>⚡ 10 min delivery</Text>
              </View>
            </TouchableOpacity>

            {/* Zone 3: Center Search */}
            <TouchableOpacity style={s.searchBar} onPress={() => push('/(customer)/search-filters')} activeOpacity={0.92}>
              <Search size={16} color={C.muted} />
              <Text style={s.searchPlaceholder}>Search skincare, makeup, hair care & more</Text>
              <View style={s.searchKbd}>
                <Command size={10} color={C.muted} />
                <Text style={s.searchKbdText}>K</Text>
              </View>
            </TouchableOpacity>

            {/* Zone 4: Action Controls */}
            <View style={s.headerRight}>
              <TouchableOpacity style={s.aiBtn} onPress={() => push('/(customer)/scan/camera')} activeOpacity={0.85}>
                <ScanFace size={16} color={C.white} />
                <Text style={s.aiBtnText}>AI Scan</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.iconCircle} onPress={() => push('/(customer)/(tabs)/profile')} activeOpacity={0.8}>
                <User size={18} color={C.white} />
              </TouchableOpacity>

              <TouchableOpacity style={s.iconCircle} onPress={() => push('/(customer)/wishlist')} activeOpacity={0.8}>
                <Heart size={18} color={C.white} />
              </TouchableOpacity>

              <TouchableOpacity style={[s.iconCircle, { position: 'relative' }]} onPress={() => push('/(customer)/(tabs)/cart')} activeOpacity={0.8}>
                <ShoppingBag size={18} color={C.white} />
                {cartCount > 0 && (
                  <View style={s.badge}>
                    <Text style={s.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ROW 2: 44–48px Horizontal Category Navigation Rail */}
        <View style={s.headerRow2}>
          <View style={s.navStripContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.navStripScroll}>
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.label;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => {
                      safeHapticImpact();
                      setActiveCategory(cat.label);
                    }}
                    activeOpacity={0.8}
                    style={[s.navItemBox, isActive && s.navItemBoxActive]}
                  >
                    <Text style={[s.navItemText, isActive && s.navItemTextActive]}>{cat.label}</Text>
                    {isActive && <View style={s.activeUnderline} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
        {/* ═══════════════════════════════════ HERO SECTION (350px Max Height) ═══════════════════════════════════ */}
        <View style={s.heroContainer}>
          <View style={s.heroRow}>
            {/* Left Hero Card (~66% Width, 350px Height) */}
            <View style={s.heroLeft}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80' }}
                style={s.heroLeftBg}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(94,23,62,0.88)', 'rgba(143,13,47,0.65)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={s.heroLeftContent}>
                <View style={s.heroPill}>
                  <Zap size={12} color={C.gold} fill={C.gold} />
                  <Text style={s.heroPillText}>⚡ GLOW SALE IS LIVE</Text>
                </View>
                <Text style={s.heroH1}>Up to <Text style={{ color: C.gold }}>70% OFF</Text>{'\n'}on top beauty brands</Text>
                <Text style={s.heroSub}>Minimalist · L'Oréal · Cetaphil · Mamaearth{'\n'}+ 500 more brands on sale</Text>
                <View style={s.heroBtnRow}>
                  <TouchableOpacity style={s.heroBtn1} onPress={() => push('/(customer)/(tabs)/shop')} activeOpacity={0.9}>
                    <Text style={s.heroBtn1Text}>Shop the Sale →</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.heroBtn2} onPress={() => push('/(customer)/scan/camera')} activeOpacity={0.85}>
                    <ScanFace size={16} color={C.white} />
                    <Text style={s.heroBtn2Text}>Free AI Scan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Right Hero Stack (~34% Width, 2 Stacked Tiles) */}
            <View style={s.heroRight}>
              {/* Tile 1: Soft Lavender */}
              <TouchableOpacity style={[s.heroTile, { backgroundColor: C.lavender }]} onPress={() => push('/(customer)/scan/camera')} activeOpacity={0.9}>
                <View style={{ flex: 1 }}>
                  <View style={s.aiTagBadge}>
                    <Text style={s.aiTagText}>AI SKIN SCAN</Text>
                  </View>
                  <Text style={s.heroTileTitle}>Know your{'\n'}skin in 30s</Text>
                  <Text style={s.heroTileSub}>Free · Non-medical · Personalized</Text>
                  <Text style={s.heroTileCta}>Try AI Scan →</Text>
                </View>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=300&q=80' }} style={s.heroTileImg} resizeMode="contain" />
              </TouchableOpacity>

              {/* Tile 2: Pale Warm Yellow */}
              <TouchableOpacity style={[s.heroTile, { backgroundColor: '#FFF8E7' }]} onPress={() => push('/(customer)/referrals')} activeOpacity={0.9}>
                <View style={{ flex: 1 }}>
                  <View style={[s.aiTagBadge, { backgroundColor: '#FFF3CC' }]}>
                    <Text style={[s.aiTagText, { color: '#8A6200' }]}>GLOW COINS</Text>
                  </View>
                  <Text style={[s.heroTileTitle, { color: '#8A6200' }]}>Earn more.{'\n'}Save more.</Text>
                  <Text style={s.heroTileSub}>Referrals · Orders · Reviews</Text>
                  <Text style={[s.heroTileCta, { color: '#8A6200' }]}>View Rewards →</Text>
                </View>
                <Gift size={44} color={C.amber} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════ PROMO / TRUST STRIP ═══════════════════════════════════ */}
        <View style={s.trustBarContainer}>
          <View style={s.trustBar}>
            {[
              { icon: Truck, text: 'Free delivery above ₹299' },
              { icon: Zap, text: '10-minute delivery' },
              { icon: ShieldCheck, text: '100% authentic products' },
              { icon: RotateCcw, text: 'Easy 7-day returns' },
            ].map((item, i) => (
              <View key={i} style={s.trustBarItem}>
                <item.icon size={15} color={C.gold} />
                <Text style={s.trustBarText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ═══════════════════════════════════ MAIN CONTENT CONTAINER (1440px Max Width) ═══════════════════════════════════ */}
        <View style={s.mainContainer}>
          {/* ═══════════════════════════════════ SECTION: SHOP BY CATEGORY RAIL ═══════════════════════════════════ */}
          <View style={s.section}>
            <SectionHeader title="Shop by Category" onViewAll={() => push('/(customer)/(tabs)/shop')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catRailScroll}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity key={cat.id} style={[s.catCard, { backgroundColor: cat.bg }]} onPress={() => push(cat.route)} activeOpacity={0.85}>
                  <View style={s.catIconWrap}>
                    <cat.Icon size={24} color={cat.iconColor} />
                  </View>
                  <Text style={[s.catCardLabel, { color: cat.iconColor }]} numberOfLines={2}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ═══════════════════════════════════ SECTION: FLASH GLOW DEALS ═══════════════════════════════════ */}
          <View style={s.flashSection}>
            <LinearGradient colors={[C.deepBerry, C.deepPlum]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.flashHeader}>
              <View style={s.flashLeft}>
                <Zap size={20} color={C.gold} fill={C.gold} />
                <Text style={s.flashTitle}>Flash Glow Deals</Text>
                <View style={s.flashTimerBox}>
                  <Clock size={13} color={C.gold} />
                  <Text style={s.flashTimer}>{formatTimer(secondsLeft)}</Text>
                </View>
              </View>
              <TouchableOpacity style={s.flashViewAll} onPress={() => push('/(customer)/(tabs)/shop?promo=flash')} activeOpacity={0.85}>
                <Text style={s.flashViewAllText}>View all flash deals →</Text>
              </TouchableOpacity>
            </LinearGradient>

            <View style={s.productGridRow}>
              {FLASH_DEALS.map((item) => (
                <DesktopProductCard
                  key={item.id}
                  item={item}
                  onAdd={() => handleAdd(item)}
                  quantity={getQuantity(item.id)}
                  onIncrement={() => incrementItem(item.id)}
                  onDecrement={() => decrementItem(item.id)}
                />
              ))}
            </View>
          </View>

          {/* ═══════════════════════════════════ SECTION: AI SKIN SCAN BANNER ═══════════════════════════════════ */}
          <View style={s.aiCtaBanner}>
            <LinearGradient colors={['#5E173E', '#5C2A91', '#3B1870']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.aiCtaGrad}>
              <View style={s.aiCtaLeft}>
                <View style={s.aiCtaTagRow}>
                  <Sparkles size={14} color={C.gold} />
                  <Text style={s.aiCtaTag}>FREE AI SKIN SCAN — POWERED BY GLOWVAI INTELLIGENCE</Text>
                </View>
                <Text style={s.aiCtaHeadline}>Discover your skin's{'\n'}<Text style={{ color: C.coral }}>true needs</Text></Text>
                <Text style={s.aiCtaSub}>Personalized cosmetic skin report in 30 seconds. Non-medical. Tailored for Indian skin.</Text>
                <View style={s.aiCtaBtns}>
                  <TouchableOpacity style={s.aiCtaBtn1} onPress={() => push('/(customer)/scan/camera')} activeOpacity={0.9}>
                    <ScanFace size={16} color={C.white} />
                    <Text style={s.aiCtaBtn1Text}>Start AI Skin Scan →</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.aiCtaBtn2} onPress={() => push('/(customer)/scan/gallery')} activeOpacity={0.85}>
                    <Text style={s.aiCtaBtn2Text}>Upload a photo instead</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={s.aiCtaCards}>
                {[
                  { label: 'Skin Type', value: 'Combination', bg: C.softCoral },
                  { label: 'Hydration Score', value: '74 / 100', bg: C.softGreen },
                  { label: 'AI Product Match', value: '3 Curated', bg: C.lavender },
                ].map((card) => (
                  <View key={card.label} style={[s.aiCtaCard, { backgroundColor: card.bg }]}>
                    <Text style={s.aiCtaCardLabel}>{card.label}</Text>
                    <Text style={s.aiCtaCardValue}>{card.value}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>

          {/* ═══════════════════════════════════ SECTION: BESTSELLERS ═══════════════════════════════════ */}
          <View style={s.section}>
            <SectionHeader title="🏆 Bestsellers" subtitle="Most-loved products by GlowVAI customers" onViewAll={() => push('/(customer)/(tabs)/shop')} />
            <View style={s.productGridRow}>
              {BESTSELLERS.map((item) => (
                <DesktopProductCard
                  key={item.id}
                  item={item}
                  onAdd={() => handleAdd(item)}
                  quantity={getQuantity(item.id)}
                  onIncrement={() => incrementItem(item.id)}
                  onDecrement={() => decrementItem(item.id)}
                />
              ))}
            </View>
          </View>

          {/* ═══════════════════════════════════ SECTION: SHOP BY CONCERN ═══════════════════════════════════ */}
          <View style={s.section}>
            <SectionHeader title="Shop by Skin Concern" subtitle="Curated product edits for every concern" />
            <View style={s.concernGrid}>
              {CONCERN_EDITS.map((c) => (
                <TouchableOpacity key={c.id} style={[s.concernCard, { backgroundColor: '#FAFAFA', borderColor: '#EEEEEE', borderWidth: 1 }]} onPress={() => push('/(customer)/(tabs)/shop')} activeOpacity={0.85}>
                  <Text style={s.concernEmoji}>{c.emoji}</Text>
                  <Text style={[s.concernLabel, { color: '#1E293B' }]}>{c.label}</Text>
                  <Text style={s.concernCount}>{c.sub}</Text>
                  <ArrowRight size={13} color="#8F0D2F" style={{ marginTop: 4 }} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ═══════════════════════════════════ SECTION: BRAND DEALS ═══════════════════════════════════ */}
          <View style={s.section}>
            <SectionHeader title="Brand Deals" subtitle="Massive savings on top skincare brands" onViewAll={() => push('/(customer)/(tabs)/shop')} />
            <View style={s.brandGrid}>
              {BRAND_DEALS.map((b) => (
                <TouchableOpacity key={b.id} style={[s.brandCard, { backgroundColor: '#FFFFFF', borderColor: '#EEEEEE', borderWidth: 1 }]} onPress={() => push('/(customer)/(tabs)/shop')} activeOpacity={0.88}>
                  <Text style={[s.brandName, { color: '#1E293B' }]}>{b.brand}</Text>
                  <Text style={s.brandOff}>{b.off}</Text>
                  <Text style={s.brandCount}>{b.count}</Text>
                  <View style={[s.brandBtn, { borderColor: '#8F0D2F', borderWidth: 1.5 }]}>
                    <Text style={[s.brandBtnText, { color: '#8F0D2F' }]}>Shop →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ═══════════════════════════════════ SECTION: ROUTINES ═══════════════════════════════════ */}
          <View style={s.section}>
            <SectionHeader title="Build Your Routine" subtitle="Expert-curated step-by-step rituals" onViewAll={() => push('/(customer)/scan/camera')} />
            <View style={s.routineGrid}>
              {SKINCARE_ROUTINES.map((r) => (
                <TouchableOpacity key={r.id} style={[s.routineCard, { backgroundColor: '#FFFFFF', borderColor: '#EEEEEE', borderWidth: 1 }]} onPress={() => push('/(customer)/scan/camera')} activeOpacity={0.88}>
                  <View style={[s.routineIconCircle, { backgroundColor: r.accent + '1E' }]}>
                    <r.Icon size={22} color={r.accent} />
                  </View>
                  <Text style={[s.routineTitle, { color: '#1E293B' }]}>{r.label}</Text>
                  <Text style={s.routineDesc}>{r.desc}</Text>
                  <View style={s.routineSteps}>
                    {r.steps.map((step, i) => (
                      <View key={step} style={s.routineStep}>
                        <Text style={[s.routineStepNum, { backgroundColor: r.accent }]}>{i + 1}</Text>
                        <Text style={s.routineStepText}>{step}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={[s.routineBtn, { backgroundColor: '#159447' }]}>
                    <Text style={s.routineBtnText}>Shop Routine →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ═══════════════════════════════════ SECTION: BEAUTY PROTECTION GUARANTEE ═══════════════════════════════════ */}
          <View style={s.bpBanner}>
            <LinearGradient colors={[C.deepBerry, '#6D1028']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.bpGrad}>
              <View style={s.bpIconBig}>
                <ShieldCheck size={36} color={C.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.bpTitle}>GlowVAI Beauty Protection</Text>
                <Text style={s.bpSub}>100% reaction coverage. Skin reacts? Full refund + free dermatologist consultation. Always.</Text>
                <View style={s.bpPoints}>
                  {['Full refund if skin reacts', 'Free dermat consultation', 'No questions asked', 'Valid on every order'].map((pt) => (
                    <View key={pt} style={s.bpPoint}>
                      <Check size={14} color={C.gold} />
                      <Text style={s.bpPointText}>{pt}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <TouchableOpacity style={s.bpLearnBtn} onPress={() => push('/(customer)/support')} activeOpacity={0.88}>
                <Text style={s.bpLearnText}>Learn More →</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* ═══════════════════════════════════ SECTION: TESTIMONIALS ═══════════════════════════════════ */}
          <View style={s.section}>
            <SectionHeader title="Loved by Beauty Enthusiasts" subtitle="What GlowVAI customers in Vijayawada say" />
            <View style={s.testGrid}>
              {TESTIMONIALS.map((tm) => (
                <View key={tm.id} style={s.testCard}>
                  <View style={s.testStars}>
                    {[...Array(tm.stars)].map((_, i) => (
                      <Star key={i} size={14} color={C.amber} fill={C.amber} />
                    ))}
                  </View>
                  <Text style={s.testText}>"{tm.text}"</Text>
                  <View style={s.testAuthorRow}>
                    <View style={s.testAvatar}>
                      <Text style={s.testAvatarText}>{tm.name[0]}</Text>
                    </View>
                    <View>
                      <Text style={s.testName}>{tm.name}</Text>
                      <Text style={s.testRole}>{tm.role} · {tm.loc}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════ DESKTOP FOOTER ═══════════════════════════════════ */}
        <View style={s.footer}>
          <View style={s.footerTop}>
            <View style={s.footerCol}>
              <Text style={s.footerBrand}>GlowVAI</Text>
              <Text style={s.footerBrandDesc}>Beauty essentials delivered in 10 minutes. AI-powered skin intelligence for Indian skin.</Text>
            </View>

            <View style={s.footerCol}>
              <Text style={s.footerColTitle}>Shop Categories</Text>
              {['Skin Care', 'Hair Care', 'Makeup', 'Body Care', 'Wellness'].map((l) => (
                <Text key={l} style={s.footerLink}>{l}</Text>
              ))}
            </View>

            <View style={s.footerCol}>
              <Text style={s.footerColTitle}>AI Intelligence</Text>
              {['Free AI Skin Scan', 'Skin Type Analysis', 'Routine Builder', 'Dermatologist Chat'].map((l) => (
                <Text key={l} style={s.footerLink}>{l}</Text>
              ))}
            </View>

            <View style={s.footerCol}>
              <Text style={s.footerColTitle}>Customer Care</Text>
              {['Order Tracking', 'Beauty Protection', '7-Day Returns', 'Help Center'].map((l) => (
                <Text key={l} style={s.footerLink}>{l}</Text>
              ))}
            </View>
          </View>

          <View style={s.footerBottom}>
            <Text style={s.footerCopy}>© 2026 GlowVAI Technologies Pvt Ltd. All rights reserved.</Text>
          </View>
        </View>
      </ScrollView>

      {/* ═══════════════════════════════════ LOCATION SELECTOR MODAL ═══════════════════════════════════ */}
      <Modal visible={isLocationModalVisible} transparent animationType="fade" onRequestClose={() => setIsLocationModalVisible(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Select Delivery Location</Text>
              <TouchableOpacity onPress={() => setIsLocationModalVisible(false)}>
                <X size={20} color={C.text} />
              </TouchableOpacity>
            </View>

            <Text style={s.modalSub}>Available in select 10-minute delivery zones across Andhra Pradesh & Telangana</Text>

            {/* OPEN STREET MAP PICKER PRIMARY ACTION */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: C.deepBerry,
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 14,
                marginBottom: 16,
                gap: 10,
              }}
              onPress={() => {
                setIsLocationModalVisible(false);
                push('/(customer)/map-picker' as any);
              }}
              activeOpacity={0.88}
            >
              <MapPin size={18} color="#FFFFFF" />
              <Text style={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#FFFFFF' }}>
                Open Interactive Map (OpenStreetMap) →
              </Text>
            </TouchableOpacity>

            {['Vijayawada', 'Guntur', 'Hyderabad', 'Visakhapatnam', 'Tirupati'].map((city) => (
              <TouchableOpacity
                key={city}
                style={[s.cityRow, selectedLocation === city && s.cityRowSelected]}
                onPress={() => {
                  setSelectedLocation(city);
                  saveActiveLocation(city);
                  setIsLocationModalVisible(false);
                  showToast(`Location set to ${city} (10 min delivery)`);
                }}
              >
                <MapPin size={18} color={selectedLocation === city ? C.deepBerry : C.muted} />
                <Text style={[s.cityName, selectedLocation === city && s.cityNameSelected]}>{city}</Text>
                {selectedLocation === city && <Check size={16} color={C.deepBerry} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GlowVaiWebviewHomeScreen;

// ─────────────────────────────────────────────
// STYLESHEET (9.8 Precision Baseline)
// ─────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.ivory },

  // Toast
  toastBox: {
    position: 'absolute',
    top: 80,
    right: 32,
    zIndex: 999,
    backgroundColor: C.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  toastText: { fontSize: 13, fontFamily: 'Poppins-SemiBold', color: C.text },

  // Fixed Two-Tier Header
  header: { backgroundColor: C.deepPlum, zIndex: 100 },

  // Header Row 1 (72px Fixed Height)
  headerRow1: {
    height: 72,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
  },
  headerContainer: {
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    gap: 16,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoSparkleCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,212,95,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 22, fontFamily: 'Poppins-Bold', color: C.white, letterSpacing: -0.5 },

  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  locCity: { fontSize: 13, fontFamily: 'Poppins-SemiBold', color: C.white },
  locEta: { fontSize: 11, fontFamily: 'Poppins-Regular', color: C.softCoral },

  searchBar: {
    flex: 1,
    maxWidth: 480,
    height: 42,
    backgroundColor: C.white,
    borderRadius: 21,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  searchPlaceholder: { flex: 1, fontSize: 13, fontFamily: 'Poppins-Regular', color: C.muted },
  searchKbd: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.cream,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  searchKbdText: { fontSize: 10, fontFamily: 'Poppins-Bold', color: C.muted },

  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiBtn: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 19,
    backgroundColor: C.plum,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiBtnText: { fontSize: 13, fontFamily: 'Poppins-SemiBold', color: C.white },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: C.coral,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 10, fontFamily: 'Poppins-Bold', color: C.white },

  // Header Row 2 (46px Nav Rail)
  headerRow2: {
    height: 46,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
  },
  navStripContainer: {
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 32,
  },
  navStripScroll: { gap: 24, alignItems: 'center' },
  navItemBox: { paddingVertical: 10, position: 'relative' },
  navItemBoxActive: {},
  navItemText: { fontSize: 13, fontFamily: 'Poppins-Medium', color: 'rgba(255, 255, 255, 0.8)' },
  navItemTextActive: { color: C.white, fontFamily: 'Poppins-SemiBold' },
  activeUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: C.coral,
    borderRadius: 2,
  },

  scroll: { flex: 1 },

  // Hero Container (350px Height)
  heroContainer: {
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  heroRow: { flexDirection: 'row', height: 350, gap: 20 },
  heroLeft: { flex: 66, borderRadius: 22, overflow: 'hidden', position: 'relative' },
  heroLeftBg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  heroLeftContent: { position: 'absolute', top: 36, left: 40, right: 40 },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 212, 95, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 212, 95, 0.4)',
  },
  heroPillText: { fontSize: 10, fontFamily: 'Poppins-Bold', color: C.gold, letterSpacing: 1 },
  heroH1: { fontSize: 36, fontFamily: 'Poppins-Bold', color: C.white, lineHeight: 44, marginBottom: 10 },
  heroSub: { fontSize: 13, fontFamily: 'Poppins-Regular', color: 'rgba(255,255,255,0.85)', lineHeight: 20, marginBottom: 22 },
  heroBtnRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  heroBtn1: { height: 46, paddingHorizontal: 24, borderRadius: 23, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  heroBtn1Text: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: C.deepBerry },
  heroBtn2: {
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroBtn2Text: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: C.white },

  heroRight: { flex: 34, gap: 20 },
  heroTile: {
    height: 165,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  aiTagBadge: { backgroundColor: 'rgba(92,42,145,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8 },
  aiTagText: { fontSize: 9, fontFamily: 'Poppins-Bold', color: C.plum, letterSpacing: 0.5 },
  heroTileTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', color: C.text, lineHeight: 24, marginBottom: 4 },
  heroTileSub: { fontSize: 11, fontFamily: 'Poppins-Regular', color: C.muted, marginBottom: 8 },
  heroTileCta: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: C.plum },
  heroTileImg: { width: 80, height: 100 },

  // Trust Bar
  trustBarContainer: {
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 32,
    marginTop: 20,
  },
  trustBar: {
    height: 48,
    backgroundColor: C.deepBerry,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  trustBarItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  trustBarText: { fontSize: 12, fontFamily: 'Poppins-Medium', color: C.white },

  // Main Container
  mainContainer: {
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingTop: 32,
  },

  section: { marginBottom: 36 },
  secHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  secTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', color: C.text },
  secSub: { fontSize: 12, fontFamily: 'Poppins-Regular', color: C.muted, marginTop: 2 },
  viewAll: { fontSize: 13, fontFamily: 'Poppins-SemiBold', color: C.deepBerry },

  // Shop by Category Rail
  catRailScroll: { gap: 16, paddingRight: 16 },
  catCard: {
    width: 130,
    height: 112,
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  catIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catCardLabel: { fontSize: 12, fontFamily: 'Poppins-SemiBold', textAlign: 'center' },

  // Flash Glow Deals
  flashSection: { marginBottom: 36, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: C.border, backgroundColor: C.white },
  flashHeader: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 },
  flashLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flashTitle: { fontSize: 20, fontFamily: 'Poppins-Bold', color: C.white },
  flashTimerBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  flashTimer: { fontSize: 14, fontFamily: 'Poppins-Bold', color: C.gold },
  flashViewAll: { backgroundColor: C.white, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  flashViewAllText: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: C.deepBerry },
  productGridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 18, padding: 20, justifyContent: 'flex-start' },

  // Product Card
  prodCard: {
    width: 220,
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
    position: 'relative',
  },
  discBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: C.deepBerry, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, zIndex: 2 },
  discBadgeText: { fontSize: 9, fontFamily: 'Poppins-Bold', color: C.white },
  wishlistBtn: { position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 14, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', zIndex: 2, borderWidth: 1, borderColor: C.border },

  prodImgWrap: { width: '100%', height: 130, marginBottom: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: C.cream, borderRadius: 12, position: 'relative' },
  prodImg: { width: '100%', height: '100%', borderRadius: 12 },
  etaBadge: { position: 'absolute', bottom: 6, left: 6, backgroundColor: 'rgba(36,21,41,0.85)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, flexDirection: 'row', alignItems: 'center', gap: 3 },
  etaBadgeText: { fontSize: 8, fontFamily: 'Poppins-Bold', color: C.white },

  prodBrand: { fontSize: 11, fontFamily: 'Poppins-Regular', color: C.muted },
  prodName: { fontSize: 13, fontFamily: 'Poppins-Medium', color: C.text, lineHeight: 18, height: 36, marginTop: 2 },

  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingVal: { fontSize: 11, fontFamily: 'Poppins-SemiBold', color: C.text },
  ratingCount: { fontSize: 10, fontFamily: 'Poppins-Regular', color: C.muted },

  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  curPrice: { fontSize: 16, fontFamily: 'Poppins-Bold', color: C.text },
  mrpPrice: { fontSize: 12, fontFamily: 'Poppins-Regular', color: C.muted, textDecorationLine: 'line-through' },

  cardFooter: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderColor: '#F3F0F2' },
  addBtn: { backgroundColor: C.deepBerry, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { fontSize: 12, fontFamily: 'Poppins-Bold', color: C.white },
  stepperBox: { flexDirection: 'row', height: 34, borderRadius: 10, backgroundColor: C.lavender, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 },
  stepperBtn: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  stepperBtnText: { fontSize: 14, fontFamily: 'Poppins-Bold', color: C.deepBerry },
  stepperCount: { fontSize: 13, fontFamily: 'Poppins-Bold', color: C.text },

  // AI CTA Banner
  aiCtaBanner: { borderRadius: 22, overflow: 'hidden', marginBottom: 36 },
  aiCtaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 36, paddingHorizontal: 48, gap: 32 },
  aiCtaLeft: { flex: 1, maxWidth: 520 },
  aiCtaTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  aiCtaTag: { fontSize: 10, fontFamily: 'Poppins-Bold', color: C.gold, letterSpacing: 0.8 },
  aiCtaHeadline: { fontSize: 32, fontFamily: 'Poppins-Bold', color: C.white, lineHeight: 40, marginBottom: 10 },
  aiCtaSub: { fontSize: 13, fontFamily: 'Poppins-Regular', color: 'rgba(255,255,255,0.8)', lineHeight: 20, marginBottom: 22 },
  aiCtaBtns: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  aiCtaBtn1: { height: 46, paddingHorizontal: 24, borderRadius: 23, backgroundColor: C.coral, flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiCtaBtn1Text: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: C.white },
  aiCtaBtn2: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  aiCtaBtn2Text: { fontSize: 13, fontFamily: 'Poppins-Medium', color: 'rgba(255,255,255,0.85)' },
  aiCtaCards: { gap: 10 },
  aiCtaCard: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, minWidth: 180 },
  aiCtaCardLabel: { fontSize: 11, fontFamily: 'Poppins-Regular', color: C.muted },
  aiCtaCardValue: { fontSize: 16, fontFamily: 'Poppins-Bold', color: C.text, marginTop: 2 },

  // Concern Grid
  concernGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  concernCard: { width: '23.5%' as any, borderRadius: 18, borderWidth: 1.5, padding: 18, alignItems: 'flex-start', gap: 4 },
  concernEmoji: { fontSize: 26, marginBottom: 4 },
  concernLabel: { fontSize: 14, fontFamily: 'Poppins-SemiBold', lineHeight: 18 },
  concernCount: { fontSize: 11, fontFamily: 'Poppins-Regular', color: C.muted },

  // Brand Grid
  brandGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  brandCard: { width: '31.5%' as any, borderRadius: 20, padding: 22, gap: 6, borderWidth: 1, borderColor: C.border },
  brandName: { fontSize: 18, fontFamily: 'Poppins-Bold' },
  brandOff: { fontSize: 22, fontFamily: 'Poppins-Bold', color: C.text },
  brandCount: { fontSize: 11, fontFamily: 'Poppins-Regular', color: C.muted },
  brandBtn: { marginTop: 8, borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start' },
  brandBtnText: { fontSize: 12, fontFamily: 'Poppins-SemiBold' },

  // Routines Grid
  routineGrid: { flexDirection: 'row', gap: 16 },
  routineCard: { flex: 1, borderRadius: 20, padding: 20, gap: 12, borderWidth: 1, borderColor: C.border },
  routineIconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  routineTitle: { fontSize: 16, fontFamily: 'Poppins-Bold' },
  routineDesc: { fontSize: 11, fontFamily: 'Poppins-Regular', color: C.muted },
  routineSteps: { gap: 6 },
  routineStep: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  routineStepNum: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: 'Poppins-Bold', color: C.white, textAlign: 'center', lineHeight: 20 } as any,
  routineStepText: { fontSize: 12, fontFamily: 'Poppins-Medium', color: C.text },
  routineBtn: { height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  routineBtnText: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: C.white },

  // Beauty Protection
  bpBanner: { borderRadius: 22, overflow: 'hidden', marginBottom: 36 },
  bpGrad: { flexDirection: 'row', alignItems: 'center', gap: 24, padding: 36 },
  bpIconBig: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bpTitle: { fontSize: 24, fontFamily: 'Poppins-Bold', color: C.white, marginBottom: 6 },
  bpSub: { fontSize: 13, fontFamily: 'Poppins-Regular', color: 'rgba(255,255,255,0.85)', lineHeight: 20, marginBottom: 16 },
  bpPoints: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  bpPoint: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bpPointText: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: C.white },
  bpLearnBtn: { backgroundColor: C.white, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 14, flexShrink: 0 },
  bpLearnText: { fontSize: 13, fontFamily: 'Poppins-SemiBold', color: C.deepBerry },

  // Testimonials
  testGrid: { flexDirection: 'row', gap: 18 },
  testCard: { flex: 1, backgroundColor: C.white, borderRadius: 18, padding: 22, borderWidth: 1, borderColor: C.border, gap: 12 },
  testStars: { flexDirection: 'row', gap: 3 },
  testText: { fontSize: 13, fontFamily: 'Poppins-Regular', color: C.text, lineHeight: 20 },
  testAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  testAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.deepBerry, alignItems: 'center', justifyContent: 'center' },
  testAvatarText: { fontSize: 14, fontFamily: 'Poppins-Bold', color: C.white },
  testName: { fontSize: 13, fontFamily: 'Poppins-SemiBold', color: C.text },
  testRole: { fontSize: 11, fontFamily: 'Poppins-Regular', color: C.muted },

  // Desktop Footer
  footer: { backgroundColor: '#1A0E22', marginTop: 40 },
  footerTop: { maxWidth: 1440, width: '100%', alignSelf: 'center', flexDirection: 'row', gap: 48, padding: 48, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  footerCol: { flex: 1, gap: 8 },
  footerBrand: { fontSize: 22, fontFamily: 'Poppins-Bold', color: C.white },
  footerBrandDesc: { fontSize: 12, fontFamily: 'Poppins-Regular', color: 'rgba(255,255,255,0.55)', lineHeight: 20, marginBottom: 12 },
  footerColTitle: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: C.white, marginBottom: 10 },
  footerLink: { fontSize: 13, fontFamily: 'Poppins-Regular', color: 'rgba(255,255,255,0.5)', paddingVertical: 4 },
  footerBottom: { maxWidth: 1440, width: '100%', alignSelf: 'center', paddingHorizontal: 48, paddingVertical: 24 },
  footerCopy: { fontSize: 12, fontFamily: 'Poppins-Regular', color: 'rgba(255,255,255,0.35)' },

  // Location Modal
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalContent: { width: '100%', maxWidth: 440, backgroundColor: C.white, borderRadius: 24, padding: 24, gap: 16 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', color: C.text },
  modalSub: { fontSize: 12, fontFamily: 'Poppins-Regular', color: C.muted, marginBottom: 8 },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  cityRowSelected: { backgroundColor: C.cream, borderColor: C.deepBerry },
  cityName: { flex: 1, fontSize: 14, fontFamily: 'Poppins-Medium', color: C.text },
  cityNameSelected: { fontFamily: 'Poppins-Bold', color: C.deepBerry },
});
