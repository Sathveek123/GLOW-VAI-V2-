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
  Share,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Share2,
  Heart,
  ShoppingBag,
  Star,
  Zap,
  MapPin,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  CheckCircle2,
  ChevronDown,
  Droplet,
  ShieldCheck,
  Award,
} from 'lucide-react-native';

import { useCartStore } from '../../state/cartStore';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  plum: '#5C2A91',
  warmIvory: '#FFFDF7',
  softLavender: '#F2ECFA',
  coral: '#F27F78',
  softCoral: '#FBE0DC',
  cobaltBlue: '#1677E8',
  successGreen: '#159447',
  softGreen: '#E3F5EA',
  mainText: '#241529',
  secondaryText: '#716675',
  mutedText: '#716675',
  border: '#E8E1E5',
  cardBg: '#FFFFFF',
  gold: '#FFD45F',
};

export const ProductDetailsScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const cartTotalCount = useCartStore((state) => state.totalCount);
  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const productImages = [
    'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  ];

  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth > 768;

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out GlowVAI Barrier Repair Serum delivered in 10 mins on GlowVAI!',
      });
    } catch {}
  };

  const handleAddToCart = () => {
    safeHapticImpact();
    const prodId: string = typeof params.id === 'string' ? params.id : 'p-barrier-repair';
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: prodId,
        name: 'GlowVAI Barrier Repair Serum',
        brand: 'GlowVAI',
        price: 699,
        mrp: 999,
        image: productImages[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      });
    }
  };

  if (isDesktopWeb) {
    return (
      <View style={styles.desktopRoot}>
        <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

        {/* DESKTOP HEADER BAR */}
        <View style={styles.desktopHeaderBar}>
          <View style={styles.desktopHeaderInner}>
            <TouchableOpacity
              style={styles.desktopBackBtn}
              onPress={() => {
                if (router.canGoBack()) router.back();
                else router.push('/(customer)/(tabs)' as any);
              }}
              activeOpacity={0.8}
            >
              <ArrowLeft size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Sparkles size={20} color={ColorTokens.gold} />
              <Text style={styles.desktopLogoText}>GlowVAI</Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)' }}>|</Text>
              <Text style={styles.desktopHeaderText}>Product Details</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity style={styles.desktopIconBtn} onPress={handleShare} activeOpacity={0.8}>
                <Share2 size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.desktopIconBtn}
                onPress={() => {
                  safeHapticSelection();
                  setIsWishlisted(!isWishlisted);
                }}
                activeOpacity={0.8}
              >
                <Heart
                  size={18}
                  color={isWishlisted ? ColorTokens.gold : '#FFFFFF'}
                  fill={isWishlisted ? ColorTokens.gold : 'transparent'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.desktopCartBtn}
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
        </View>

        {/* MAIN DESKTOP 2-COLUMN CONTAINER */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={styles.desktopMainContainer}>
            {/* LEFT COLUMN: PRODUCT IMAGES GALLERY */}
            <View style={styles.desktopLeftCol}>
              <View style={styles.desktopHeroImgWrap}>
                <View style={styles.expressBadge}>
                  <Zap size={12} color="#FFFFFF" fill="#FFFFFF" />
                  <Text style={styles.expressText}>10 MIN EXPRESS DROP</Text>
                </View>
                <Image
                  source={{ uri: productImages[activeImageIdx] }}
                  style={styles.desktopHeroImg}
                  resizeMode="contain"
                />
              </View>

              {/* THUMBNAIL STRIP */}
              <View style={styles.thumbnailStrip}>
                {productImages.map((imgUrl, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.thumbCard, activeImageIdx === idx && styles.thumbCardActive]}
                    onPress={() => setActiveImageIdx(idx)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: imgUrl }} style={styles.thumbImg} resizeMode="contain" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* RIGHT COLUMN: PRODUCT DETAILS & CTA */}
            <View style={styles.desktopRightCol}>
              <Text style={styles.brandName}>GlowVAI Clinical Skincare</Text>
              <Text style={styles.desktopProductTitle}>
                Barrier Repair Serum with Ceramides & Panthenol
              </Text>

              <View style={styles.ratingRow}>
                <View style={styles.ratingBadge}>
                  <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/product-reviews' as any)}>
                  <Text style={styles.reviewsLink}>2,346 verified customer reviews →</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.currentPrice}>₹699</Text>
                <Text style={styles.mrpPrice}>₹999</Text>
                <Text style={styles.discountBadge}>30% OFF</Text>
              </View>
              <Text style={styles.inclusiveText}>Inclusive of all taxes · 50ml / 1.7 fl. oz. bottle</Text>

              {/* QUANTITY STEPPER */}
              <View style={styles.desktopStepperRow}>
                <Text style={styles.stepperLabel}>Select Quantity:</Text>
                <View style={styles.stepperWrap}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    <Minus size={14} color={ColorTokens.mainText} />
                  </TouchableOpacity>
                  <Text style={styles.stepperQty}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => setQuantity((prev) => prev + 1)}
                  >
                    <Plus size={14} color={ColorTokens.mainText} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* ACTION BUTTONS */}
              <View style={styles.desktopActionRow}>
                <TouchableOpacity
                  style={styles.desktopAddToCartBtn}
                  onPress={handleAddToCart}
                  activeOpacity={0.9}
                >
                  <ShoppingBag size={18} color="#FFFFFF" />
                  <Text style={styles.addToCartBtnText}>ADD TO CART — ₹{699 * quantity}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.desktopBuyNowBtn}
                  onPress={() => {
                    handleAddToCart();
                    router.push('/(customer)/(tabs)/cart');
                  }}
                  activeOpacity={0.9}
                >
                  <Text style={styles.buyNowBtnText}>INSTANT BUY NOW</Text>
                </TouchableOpacity>
              </View>

              {/* 10 MIN DELIVERY BANNER */}
              <View style={styles.deliveryCard}>
                <Zap size={22} color={ColorTokens.deepBerry} fill={ColorTokens.deepBerry} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.deliveryTitle}>Lightning 10-Minute Doorstep Delivery</Text>
                  <Text style={styles.deliverySub}>
                    Delivering to Vijayawada from Darkstore A · Live GPS rider tracking available
                  </Text>
                </View>
              </View>

              {/* WHY YOU'LL LOVE IT */}
              <View style={styles.card}>
                <Text style={styles.sectionHeading}>Why You'll Love It</Text>
                <View style={styles.benefitsGrid}>
                  {[
                    'Repairs skin barrier',
                    'Deep hydration',
                    'Boosts natural glow',
                    'Gentle & non-irritating',
                  ].map((benefit, bIdx) => (
                    <View key={bIdx} style={styles.benefitPill}>
                      <CheckCircle2 size={14} color={ColorTokens.successGreen} />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* KEY INGREDIENTS */}
              <View style={styles.card}>
                <Text style={styles.sectionHeading}>Key Ingredients & Formulation</Text>
                {[
                  { name: 'Ceramides (3%)', desc: 'Helps maintain and reinforce skin barrier integrity', icon: ShieldCheck },
                  { name: 'Panthenol (B5)', desc: 'Provides deep cosmetic hydration and soothing feel', icon: Droplet },
                  { name: 'Niacinamide (5%)', desc: 'Promotes smooth texture and radiant, even tone', icon: Award },
                ].map((ing, iIdx) => {
                  const IconComp = ing.icon;
                  return (
                    <View key={iIdx} style={styles.ingredientRow}>
                      <View style={styles.ingredientIconCircle}>
                        <IconComp size={16} color={ColorTokens.plum} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.ingredientName}>{ing.name}</Text>
                        <Text style={styles.ingredientDesc}>{ing.desc}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
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
      <View style={[styles.header, { paddingTop: headerTopInset, height: 60 + headerTopInset }]}>
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

        <View style={styles.logoRow}>
          <Sparkles size={16} color={ColorTokens.gold} />
          <Text style={styles.logoText}>GlowVAI</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconCircle} onPress={handleShare} activeOpacity={0.8}>
            <Share2 size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => {
              safeHapticSelection();
              setIsWishlisted(!isWishlisted);
            }}
            activeOpacity={0.8}
          >
            <Heart
              size={18}
              color={isWishlisted ? ColorTokens.gold : '#FFFFFF'}
              fill={isWishlisted ? ColorTokens.gold : 'transparent'}
            />
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
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* PRODUCT IMAGE HERO AREA */}
        <View style={styles.heroImageCard}>
          <View style={styles.expressBadge}>
            <Zap size={10} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.expressText}>10 MIN EXPRESS</Text>
          </View>

          <Image source={{ uri: productImages[activeImageIdx] }} style={styles.heroImage} resizeMode="contain" />

          {/* LEFT RIGHT CAROUSEL CONTROLS */}
          <TouchableOpacity
            style={[styles.carouselArrow, { left: 12 }]}
            onPress={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : productImages.length - 1))}
          >
            <ChevronLeft size={16} color={ColorTokens.mainText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.carouselArrow, { right: 12 }]}
            onPress={() => setActiveImageIdx((prev) => (prev + 1) % productImages.length)}
          >
            <ChevronRight size={16} color={ColorTokens.mainText} />
          </TouchableOpacity>

          {/* DOTS */}
          <View style={styles.dotsRow}>
            {productImages.map((_, i) => (
              <View key={i} style={[styles.dot, activeImageIdx === i && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* PRODUCT INFORMATION */}
        <View style={styles.card}>
          <Text style={styles.brandName}>GlowVAI Clinical Skincare</Text>
          <Text style={styles.productTitle}>Barrier Repair Serum with Ceramides & Panthenol</Text>

          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/product-reviews' as any)}>
              <Text style={styles.reviewsLink}>2,346 verified reviews →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>₹699</Text>
            <Text style={styles.mrpPrice}>₹999</Text>
            <Text style={styles.discountBadge}>30% OFF</Text>
          </View>
          <Text style={styles.inclusiveText}>Inclusive of all taxes · 50ml / 1.7 fl. oz.</Text>

          {/* QUANTITY STEPPER ROW */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepperLabel}>Quantity:</Text>
            <View style={styles.stepperWrap}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                <Minus size={14} color={ColorTokens.mainText} />
              </TouchableOpacity>
              <Text style={styles.stepperQty}>{quantity}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQuantity((prev) => prev + 1)}
              >
                <Plus size={14} color={ColorTokens.mainText} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 10 MIN DELIVERY CARD */}
        <View style={styles.deliveryCard}>
          <Zap size={20} color={ColorTokens.deepBerry} fill={ColorTokens.deepBerry} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.deliveryTitle}>Delivered in 10 minutes</Text>
            <Text style={styles.deliverySub}>to Vijayawada · Order now for instant dispatch</Text>
          </View>
          <ChevronRight size={16} color={ColorTokens.secondaryText} />
        </View>

        {/* WHY YOU'LL LOVE IT */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Why You'll Love It</Text>
          <View style={styles.benefitsGrid}>
            {[
              'Repairs skin barrier',
              'Deep hydration',
              'Boosts natural glow',
              'Gentle & non-irritating',
            ].map((benefit, bIdx) => (
              <View key={bIdx} style={styles.benefitPill}>
                <CheckCircle2 size={14} color={ColorTokens.successGreen} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* KEY INGREDIENTS */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Key Ingredients</Text>
          {[
            { name: 'Ceramides (3%)', desc: 'Helps maintain and reinforce skin barrier integrity', icon: ShieldCheck },
            { name: 'Panthenol (B5)', desc: 'Provides deep cosmetic hydration and soothing feel', icon: Droplet },
            { name: 'Niacinamide (5%)', desc: 'Promotes smooth texture and radiant, even tone', icon: Award },
          ].map((ing, iIdx) => {
            const IconComp = ing.icon;
            return (
              <View key={iIdx} style={styles.ingredientRow}>
                <View style={styles.ingredientIconCircle}>
                  <IconComp size={16} color={ColorTokens.plum} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.ingredientName}>{ing.name}</Text>
                  <Text style={styles.ingredientDesc}>{ing.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ACCORDIONS */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.accordionHeader} onPress={() => {}}>
            <Text style={styles.accordionTitle}>How to Use</Text>
            <ChevronDown size={18} color={ColorTokens.secondaryText} />
          </TouchableOpacity>
          <Text style={styles.accordionBody}>
            Apply 3-4 drops to cleansed face morning and night. Gently pat into skin before moisturizer.
          </Text>

          <View style={styles.accordionDivider} />

          <TouchableOpacity style={styles.accordionHeader} onPress={() => {}}>
            <Text style={styles.accordionTitle}>Full Ingredients List</Text>
            <ChevronDown size={18} color={ColorTokens.secondaryText} />
          </TouchableOpacity>

          <View style={styles.accordionDivider} />

          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => router.push('/product-reviews' as any)}
          >
            <Text style={styles.accordionTitle}>Customer Reviews (2,346)</Text>
            <ChevronRight size={18} color={ColorTokens.deepBerry} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* STICKY PURCHASE BAR */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <Text style={styles.bottomPrice}>₹699</Text>
            <Text style={styles.bottomMrp}>₹999</Text>
          </View>
          <Text style={styles.bottomSavings}>30% OFF · Delivered in 10 mins</Text>
        </View>

        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart} activeOpacity={0.9}>
          <Text style={styles.addToCartBtnText}>ADD TO CART</Text>
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
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  heroImageCard: {
    backgroundColor: '#FBE0DC',
    borderRadius: 20,
    height: 280,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expressBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  expressText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 9,
    color: '#FFFFFF',
  },
  heroImage: {
    width: '80%',
    height: '80%',
  },
  carouselArrow: {
    position: 'absolute',
    top: '45%',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  dotActive: {
    width: 18,
    backgroundColor: ColorTokens.deepBerry,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  brandName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.mutedText,
  },
  productTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    lineHeight: 24,
    color: ColorTokens.mainText,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  ratingBadge: {
    backgroundColor: ColorTokens.successGreen,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  reviewsLink: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.deepBerry,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  currentPrice: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: ColorTokens.mainText,
  },
  mrpPrice: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: ColorTokens.mutedText,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: ColorTokens.successGreen,
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  inclusiveText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.mutedText,
    marginTop: 4,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#F3EFEF',
  },
  stepperLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F3F6',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 12,
  },
  stepperBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQty: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  deliveryCard: {
    backgroundColor: ColorTokens.softLavender,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2D1FC',
  },
  deliveryTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.plum,
  },
  deliverySub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.mutedText,
  },
  sectionHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: ColorTokens.mainText,
    marginBottom: 12,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  benefitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    width: '48%',
  },
  benefitText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: ColorTokens.mainText,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ingredientIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: ColorTokens.softLavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: ColorTokens.mainText,
  },
  ingredientDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.mutedText,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  accordionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  accordionBody: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: ColorTokens.mutedText,
    marginBottom: 8,
  },
  accordionDivider: {
    height: 1,
    backgroundColor: '#F3EFEF',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: ColorTokens.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomPrice: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: ColorTokens.mainText,
  },
  bottomMrp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: ColorTokens.mutedText,
    textDecorationLine: 'line-through',
  },
  bottomSavings: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: ColorTokens.successGreen,
  },
  addToCartBtn: {
    backgroundColor: ColorTokens.deepBerry,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },

  // DESKTOP WIDESCREEN STYLES
  desktopRoot: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
  },
  desktopHeaderBar: {
    backgroundColor: ColorTokens.deepBerry,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  desktopHeaderInner: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  desktopBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopLogoText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  desktopHeaderText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#FFFFFF',
  },
  desktopIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  desktopMainContainer: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 32,
    gap: 36,
  },
  desktopLeftCol: {
    width: '45%',
    gap: 16,
  },
  desktopHeroImgWrap: {
    backgroundColor: '#FBE0DC',
    borderRadius: 24,
    height: 420,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  desktopHeroImg: {
    width: '85%',
    height: '85%',
  },
  thumbnailStrip: {
    flexDirection: 'row',
    gap: 12,
  },
  thumbCard: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: ColorTokens.border,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbCardActive: {
    borderColor: ColorTokens.deepBerry,
    borderWidth: 2,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  desktopRightCol: {
    flex: 1,
    gap: 16,
  },
  desktopProductTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    lineHeight: 34,
    color: ColorTokens.mainText,
    marginTop: 4,
  },
  desktopStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  desktopActionRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  desktopAddToCartBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: ColorTokens.deepBerry,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#8F0D2F',
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  desktopBuyNowBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: ColorTokens.plum,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C2A91',
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  buyNowBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
