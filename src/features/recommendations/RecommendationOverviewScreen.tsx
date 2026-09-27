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
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Zap,
  Star,
  CheckCircle2,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useCartStore } from '../../state/cartStore';
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

export interface RecommendationOverviewScreenProps {
  onBack?: () => void;
  onAddAllToCart?: () => void;
}

export const RecommendationOverviewScreen: React.FC<RecommendationOverviewScreenProps> = ({
  onBack,
  onAddAllToCart,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const { addItem } = useCartStore();

  const handleAddAll = () => {
    addItem({
      productId: 'rec-1',
      name: 'Radiant Balance Cleanser',
      brand: 'GlowVAI',
      price: 349,
      mrp: 499,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    });
    addItem({
      productId: 'rec-2',
      name: 'Niacinamide 10% Barrier Serum',
      brand: 'GlowVAI',
      price: 599,
      mrp: 799,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    });
    addItem({
      productId: 'rec-3',
      name: 'Ceramide Moisture Lock Gel',
      brand: 'GlowVAI',
      price: 499,
      mrp: 649,
      image: 'https://images.unsplash.com/photo-1608248597263-00de46196f65?auto=format&fit=crop&w=400&q=80',
    });

    if (onAddAllToCart) onAddAllToCart();
    else router.push('/(customer)/(tabs)/cart' as any);
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
          <Text style={styles.headerTitle}>Routine Recommendations</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* BANNER */}
        <View style={styles.heroBanner}>
          <View style={styles.badge}>
            <Zap size={12} color={ColorTokens.deepBerry} />
            <Text style={styles.badgeText}>98% MATCH FOR YOUR SKIN</Text>
          </View>
          <Text style={styles.headline}>Personalized Routine Bundle</Text>
          <Text style={styles.subtext}>
            Formulated specifically to balance T-zone oiliness and fortify your moisture barrier.
          </Text>
        </View>

        {/* PRODUCTS CAROUSEL / LIST */}
        <Text style={styles.sectionTitle}>RECOMMENDED PRODUCTS (3 STEPS)</Text>

        <View style={styles.productList}>
          {/* PRODUCT 1 */}
          <View style={styles.productCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80' }}
              style={styles.productImg}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTag}>STEP 01 · CLEANSE</Text>
              <Text style={styles.productName}>Radiant Balance Gentle Cleanser</Text>
              <Text style={styles.productDesc}>Unclogs pores without stripping essential lipids.</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹349</Text>
                <Text style={styles.mrp}>₹499</Text>
              </View>
            </View>
          </View>

          {/* PRODUCT 2 */}
          <View style={styles.productCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' }}
              style={styles.productImg}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTag}>STEP 02 · TREAT</Text>
              <Text style={styles.productName}>Niacinamide 10% Barrier Serum</Text>
              <Text style={styles.productDesc}>Soothes redness and controls excess sebum.</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹599</Text>
                <Text style={styles.mrp}>₹799</Text>
              </View>
            </View>
          </View>

          {/* PRODUCT 3 */}
          <View style={styles.productCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1608248597263-00de46196f65?auto=format&fit=crop&w=400&q=80' }}
              style={styles.productImg}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTag}>STEP 03 · MOISTURIZE</Text>
              <Text style={styles.productName}>Ceramide Moisture Lock Gel</Text>
              <Text style={styles.productDesc}>24-hour hydration lock for combination skin.</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹499</Text>
                <Text style={styles.mrp}>₹649</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY FOOTER */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleAddAll} activeOpacity={0.9}>
          <ShoppingBag size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>Add Complete Routine · ₹1,447</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RecommendationOverviewScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ColorTokens.warmIvory },
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
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  content: { flex: 1 },
  contentPadding: { padding: 16 },
  heroBanner: {
    backgroundColor: ColorTokens.softCoral,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(242, 127, 120, 0.3)',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: ColorTokens.deepBerry, letterSpacing: 1 },
  headline: { fontSize: 22, fontWeight: '800', color: ColorTokens.text, marginBottom: 6 },
  subtext: { fontSize: 13, color: ColorTokens.mutedText, lineHeight: 18 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: ColorTokens.mutedText, letterSpacing: 1, marginBottom: 10 },
  productList: { gap: 12 },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  productImg: { width: 70, height: 70, borderRadius: 14 },
  stepTag: { fontSize: 10, fontWeight: '800', color: ColorTokens.plum, letterSpacing: 0.5, marginBottom: 2 },
  productName: { fontSize: 14, fontWeight: '800', color: ColorTokens.text },
  productDesc: { fontSize: 11, color: ColorTokens.mutedText, marginTop: 2, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { fontSize: 15, fontWeight: '800', color: ColorTokens.deepBerry },
  mrp: { fontSize: 12, color: ColorTokens.mutedText, textDecorationLine: 'line-through' },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: ColorTokens.border,
  },
  primaryBtn: {
    backgroundColor: ColorTokens.successGreen,
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
