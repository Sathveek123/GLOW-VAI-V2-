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
  Zap,
  MapPin,
  Clock,
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../../state/cartStore';

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

export interface QuickCommerceExpressStoreScreenProps {
  onBack?: () => void;
  onViewCart?: () => void;
}

export const QuickCommerceExpressStoreScreen: React.FC<QuickCommerceExpressStoreScreenProps> = ({
  onBack,
  onViewCart,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const { addItem } = useCartStore();

  const darkStoreItems = [
    {
      id: 'ds1',
      name: 'Minimalist Niacinamide 10%',
      price: 599,
      mrp: 699,
      eta: '10 MINS',
      image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'ds2',
      name: 'Dot & Key Watermelon Sunscreen',
      price: 395,
      mrp: 495,
      eta: '12 MINS',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'ds3',
      name: 'Cetaphil Gentle Cleanser 250ml',
      price: 349,
      mrp: 449,
      eta: '15 MINS',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const handleAddToCart = (item: typeof darkStoreItems[0]) => {
    addItem({
      productId: item.id,
      name: item.name,
      brand: 'GlowVAI Express',
      price: item.price,
      mrp: item.mrp,
      image: item.image,
    });
  };

  const handleViewCart = () => {
    if (onViewCart) onViewCart();
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
          <Zap size={16} color="#FFD700" fill="#FFD700" />
          <Text style={styles.headerTitle}>Vijayawada Express Dark Store</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* DARK STORE STATUS BANNER */}
        <View style={styles.darkStoreCard}>
          <View style={styles.statusBadge}>
            <Zap size={12} color={ColorTokens.deepBerry} />
            <Text style={styles.statusBadgeText}>HUB #04 · LIVE INVENTORY</Text>
          </View>
          <Text style={styles.headline}>Benz Circle Dark Store</Text>
          <Text style={styles.subtext}>
            📍 1.2 km away · Average dispatch time 3 mins · Guaranteed doorstep delivery in 10–15 mins.
          </Text>
        </View>

        {/* INSTANT DISPATCH SKUS */}
        <Text style={styles.sectionTitle}>10-MIN INSTANT DISPATCH SKUS</Text>
        <View style={styles.skuGrid}>
          {darkStoreItems.map((item) => (
            <View key={item.id} style={styles.skuCard}>
              <Image source={{ uri: item.image }} style={styles.skuImage} />
              <View style={styles.etaPill}>
                <Zap size={10} color={ColorTokens.successGreen} />
                <Text style={styles.etaText}>{item.eta}</Text>
              </View>
              <Text style={styles.skuName} numberOfLines={2}>{item.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.price}</Text>
                <Text style={styles.mrp}>₹{item.mrp}</Text>
              </View>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => handleAddToCart(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.addBtnText}>ADD TO CART</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY FOOTER */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleViewCart} activeOpacity={0.9}>
          <ShoppingBag size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>View Cart & Checkout →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default QuickCommerceExpressStoreScreen;

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
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  content: { flex: 1 },
  contentPadding: { padding: 16 },
  darkStoreCard: {
    backgroundColor: ColorTokens.softCoral,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(242, 127, 120, 0.3)',
  },
  statusBadge: {
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
  statusBadgeText: { fontSize: 10, fontWeight: '800', color: ColorTokens.deepBerry, letterSpacing: 1 },
  headline: { fontSize: 22, fontWeight: '800', color: ColorTokens.text, marginBottom: 6 },
  subtext: { fontSize: 13, color: ColorTokens.mutedText, lineHeight: 18 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: ColorTokens.mutedText, letterSpacing: 1, marginBottom: 10 },
  skuGrid: { gap: 12 },
  skuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    position: 'relative',
  },
  skuImage: { width: '100%', height: 120, borderRadius: 12, marginBottom: 8 },
  etaPill: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  etaText: { fontSize: 10, fontWeight: '800', color: ColorTokens.successGreen },
  skuName: { fontSize: 14, fontWeight: '800', color: ColorTokens.text, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  price: { fontSize: 16, fontWeight: '800', color: ColorTokens.deepBerry },
  mrp: { fontSize: 12, color: ColorTokens.mutedText, textDecorationLine: 'line-through' },
  addBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 12,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
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
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
