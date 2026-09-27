import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';
import { Colors } from '../../../design/tokens';
import { Typography } from '../../../design/typography';
import { HomeProduct } from '../HomeScreen';
import { useCartStore as useZustandCartStore } from '../../../state/cartStore';
import { LOCAL_PRODUCT_IMAGES } from '../../../assets/productImages';
import { AddToCartButton } from '../../../components/ui/AddToCartButton';

interface ProductGridProps {
  title: string;
  products: HomeProduct[];
  seeAllRoute?: string;
  breakpoint: 'tablet' | 'desktop' | 'wide';
}

export function ProductGrid({
  title,
  products,
  seeAllRoute,
  breakpoint,
}: ProductGridProps) {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const handleScrollLeft = () => {
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const cardWidth = breakpoint === 'tablet' ? 210 : 200;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {/* Section Header with Side Swipe Arrow Controls */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.headerRightControls}>
            <TouchableOpacity style={styles.arrowBtn} onPress={handleScrollLeft} activeOpacity={0.7}>
              <ChevronLeft size={16} color={Colors.cartMaroon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrowBtn} onPress={handleScrollRight} activeOpacity={0.7}>
              <ChevronRight size={16} color={Colors.cartMaroon} />
            </TouchableOpacity>
            {seeAllRoute && (
              <TouchableOpacity
                style={styles.seeAllBtn}
                onPress={() => router.push(seeAllRoute as any)}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={14} color={Colors.cartMaroon} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Side Swiping Horizontal Product ScrollView */}
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContainer}
        >
          {products.map((p) => {
            const imgSrc = LOCAL_PRODUCT_IMAGES[p.id] || p.imageSource || { uri: p.image };
            const finalImgUri = typeof imgSrc === 'string' ? { uri: imgSrc } : (imgSrc.uri ? { uri: imgSrc.uri } : imgSrc);

            return (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.productCard,
                  { width: cardWidth },
                ]}
                onPress={() =>
                  router.push({
                    pathname: '/(customer)/product/[id]',
                    params: { id: p.id },
                  })
                }
                activeOpacity={0.9}
              >
                {/* 1. Edge-to-Edge Image Header Container */}
                <View style={styles.imageWrap}>
                  {p.etaMinutes <= 15 && (
                    <View style={styles.etaBadge}>
                      <Text style={styles.etaText}>⚡ {p.etaMinutes} MIN</Text>
                    </View>
                  )}
                  <Image
                    source={{ uri: finalImgUri.uri || 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80' }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>

                {/* 2. Padded Content Box Below Image */}
                <View style={styles.cardContent}>
                  <Text style={styles.brandText} numberOfLines={1}>
                    {p.brand}
                  </Text>
                  <Text style={styles.nameText} numberOfLines={2}>
                    {p.name}
                  </Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>₹{p.price}</Text>
                    {p.mrp && p.mrp > p.price && (
                      <Text style={styles.mrpText}>₹{p.mrp}</Text>
                    )}
                  </View>

                  <View style={{ marginTop: 10, alignItems: 'center' }}>
                    <AddToCartButton productId={p.id} product={p} size="medium" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
  },
  inner: {
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: Colors.textPrimary,
  },
  headerRightControls: {
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
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  seeAllText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: Colors.cartMaroon,
    marginRight: 4,
  },
  scrollContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 24,
  },
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.shop.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: Colors.white,
    position: 'relative',
    overflow: 'hidden',
  },
  etaBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(45,157,95,0.15)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  etaText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 9,
    color: Colors.success,
  },
  cardContent: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  brandText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  nameText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: Colors.textPrimary,
    marginTop: 2,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  priceText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: Colors.textPrimary,
  },
  mrpText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  addBtn: {
    backgroundColor: Colors.cartMaroon,
    borderRadius: 18,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addBtnText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.white,
  },
});
