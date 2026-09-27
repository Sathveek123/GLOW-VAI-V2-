import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Zap, Clock, ChevronRight, ChevronLeft, Sparkles, Flame } from 'lucide-react-native';
import { Colors } from '../../../design/tokens';
import { Typography } from '../../../design/typography';

export function MultiBannerHero() {
  const router = useRouter();
  const bannerScrollRef = useRef<ScrollView>(null);

  const handleScrollLeft = () => {
    bannerScrollRef.current?.scrollTo({ x: 0, animated: true });
  };

  const handleScrollRight = () => {
    bannerScrollRef.current?.scrollToEnd({ animated: true });
  };

  const heroBanners = [
    {
      id: 'b1',
      tag: '⚡ FLASH GLOW DROP · 98% MATCH',
      title: 'Flat ₹100 Off Today',
      subtitle: 'Instant Glow Booster (1₹ Trial Sample)',
      cta: 'Claim Flash Drop →',
      bgColor: '#7A0C1F',
      image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=600&q=80',
      route: '/(customer)/product/prod-00',
      badge: '98% Match',
      hasTimer: true,
    },
    {
      id: 'b2',
      tag: 'FESTIVE SPECIAL',
      title: 'Raksha Bandhan Glow Hampers',
      subtitle: 'Curated clinical gift hampers delivered in 15 mins',
      cta: 'Explore Hampers →',
      bgColor: '#4C1D95',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      route: '/(customer)/(tabs)/shop?promo=rakhi',
      badge: '40% OFF',
    },
    {
      id: 'b3',
      tag: 'MONSOON CARE',
      title: 'Zero-Cast SPF Fest',
      subtitle: 'Broad-spectrum PA++++ sunscreens starting @ ₹299',
      cta: 'Shop Sunscreen →',
      bgColor: '#065F46',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
      route: '/(customer)/(tabs)/shop?cat=Suncare',
      badge: 'Bestsellers',
    },
    {
      id: 'b4',
      tag: 'BRAND SPOTLIGHT',
      title: 'Clinical Barrier Repair',
      subtitle: 'Minimalist & The Derma Co 10% Niacinamide drops',
      cta: 'Shop Serums →',
      bgColor: '#1E3A8A',
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80',
      route: '/(customer)/(tabs)/shop?cat=Serums',
      badge: 'Featured',
    },
    {
      id: 'b5',
      tag: 'DEALS @ ₹99',
      title: 'Express Trial Minis',
      subtitle: 'Sample clinical ointments, facial creams & lotions',
      cta: 'Grab Minis →',
      bgColor: '#991B1B',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      route: '/(customer)/(tabs)/shop?promo=steal',
      badge: '₹99 Only',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.titleGroup}>
            <Flame size={20} color="#D4472C" />
            <Text style={styles.sectionTitle}>Featured Offers & Brand Drops</Text>
          </View>
          <View style={styles.swipeControlGroup}>
            <TouchableOpacity style={styles.arrowBtn} onPress={handleScrollLeft} activeOpacity={0.7}>
              <ChevronLeft size={16} color={Colors.cartMaroon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrowBtn} onPress={handleScrollRight} activeOpacity={0.7}>
              <ChevronRight size={16} color={Colors.cartMaroon} />
            </TouchableOpacity>
            <Text style={styles.swipeHint}>Swipe to explore →</Text>
          </View>
        </View>

        <ScrollView
          ref={bannerScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
        >
          {heroBanners.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.bannerCard, { backgroundColor: item.bgColor }]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.9}
            >
              {/* Background Product Image with Gradient Overlay */}
              <Image source={{ uri: item.image }} style={styles.bannerImage} resizeMode="cover" />
              <LinearGradient
                colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.85)']}
                style={styles.gradientOverlay}
              />

              {/* Top Badge */}
              <View style={styles.topBadgeRow}>
                <View style={styles.tagPill}>
                  <Text style={styles.tagPillText}>{item.tag}</Text>
                </View>
                {item.badge && (
                  <View style={styles.goldBadge}>
                    <Text style={styles.goldBadgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>

              {/* Bottom Card Content */}
              <View style={styles.bottomContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.cardSubtitle} numberOfLines={2}>
                  {item.subtitle}
                </Text>
                <View style={styles.ctaButton}>
                  <Text style={styles.ctaText}>{item.cta}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: Colors.shop.background,
  },
  inner: {
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.textPrimary,
  },
  swipeControlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.shop.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  swipeHint: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  scrollContent: {
    gap: 16,
    paddingRight: 24,
  },
  bannerCard: {
    width: 270,
    height: 320,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  tagPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagPillText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  goldBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  goldBadgeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 9,
    color: Colors.cartMaroon,
  },
  bottomContent: {
    zIndex: 2,
  },
  cardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
    color: Colors.white,
  },
  cardSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 12,
  },
  ctaText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: Colors.cartMaroon,
  },
});
