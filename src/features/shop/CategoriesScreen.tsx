import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { SkeletonCard } from '../../components/ui/SkeletonCard';

import { INDIAN_SKINCARE_CATALOG, SkincareProduct } from '../../data/indianSkincareCatalog';
import { Colors } from '../../design/tokens';
import { Typography } from '../../design/typography';
import { AddToCartButton } from '../../components/ui/AddToCartButton';
import { resolveImageSource } from '../../assets/productImages';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';

interface CategoryItem {
  id: string;
  name: string;
  count: number;
  iconName: keyof typeof Ionicons.glyphMap;
  color: string;
  imageUri: string;
}

const categoryTints = [
  '#E8F0FE', // soft blue
  '#E8F5E9', // soft green
  '#FFF8E1', // soft yellow
  '#F3E5F5', // soft lavender
  '#FCE4EC', // soft pink
  '#E0F7FA', // soft mint
];

const CATEGORY_ITEMS: CategoryItem[] = [
  {
    id: 'Serums',
    name: 'Serums & Actives',
    count: 28,
    iconName: 'water-outline',
    color: '#EBF5FF',
    imageUri: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'Cleansers',
    name: 'Cleansers & Washes',
    count: 22,
    iconName: 'sparkles-outline',
    color: '#F0FDF4',
    imageUri: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'Moisturizers',
    name: 'Moisturizers & Creams',
    count: 35,
    iconName: 'leaf-outline',
    color: '#FFF7ED',
    imageUri: 'https://images.unsplash.com/photo-1608248597263-00079e960455?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'Suncare',
    name: 'Sunscreen & SPF',
    count: 19,
    iconName: 'sunny-outline',
    color: '#FEF3C7',
    imageUri: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'Toners',
    name: 'Toners & Mists',
    count: 14,
    iconName: 'rainy-outline',
    color: '#F3E8FF',
    imageUri: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'EyeCare',
    name: 'Eye Creams & Patches',
    count: 11,
    iconName: 'eye-outline',
    color: '#FCE7F3',
    imageUri: 'https://images.unsplash.com/photo-1512290900673-7002014167e4?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'Exfoliators',
    name: 'Exfoliators & Peels',
    count: 16,
    iconName: 'cut-outline',
    color: '#ECFDF5',
    imageUri: 'https://images.unsplash.com/photo-1567928269937-ae146e45b428?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'Masks',
    name: 'Sheet Masks & Packs',
    count: 24,
    iconName: 'layers-outline',
    color: '#FFF1F2',
    imageUri: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'LipCare',
    name: 'Lip Balms & Treatments',
    count: 13,
    iconName: 'heart-outline',
    color: '#FEE2E2',
    imageUri: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'Treatments',
    name: 'Spot Treatments',
    count: 18,
    iconName: 'fitness-outline',
    color: '#EFF6FF',
    imageUri: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&auto=format&fit=crop&q=80',
  },
];

const SKIN_CONCERNS = [
  { id: 'all', label: 'All Items' },
  { id: 'acne', label: 'Acne & Blemishes' },
  { id: 'hydration', label: 'Hydration & Dryness' },
  { id: 'brightening', label: 'Glow & Dark Spots' },
  { id: 'antiaging', label: 'Firming & Lines' },
  { id: 'barrier', label: 'Barrier Repair' },
];

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const CategoriesScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedConcern, setSelectedConcern] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const filteredProducts = INDIAN_SKINCARE_CATALOG.filter((product) => {
    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      product.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Suncare' && product.category === 'Suncare') ||
      (selectedCategory === 'Serums' && product.category === 'Serums') ||
      (selectedCategory === 'Cleansers' && product.category === 'Cleansers') ||
      (selectedCategory === 'Moisturizers' && product.category === 'Moisturizers') ||
      (selectedCategory === 'Treatments' && product.category === 'Treatments');

    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: headerTopInset }]}>
        <View style={styles.headerTitleRow}>
          <Text style={[Typography.displayLg, styles.headerTitle]}>All Categories</Text>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => router.push('/(customer)/(tabs)/cart')}
          >
            <Ionicons name="bag-handle-outline" size={22} color={Colors.shop.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={Colors.shop.textSecondary} />
          <TextInput
            style={[Typography.bodyMd, styles.searchInput]}
            placeholder="Search categories, products & active ingredients..."
            placeholderTextColor={Colors.shop.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.shop.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Shop By Concern Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          contentContainerStyle={styles.concernRow}
        >
          {SKIN_CONCERNS.map((concern) => {
            const isSelected = selectedConcern === concern.id;
            return (
              <TouchableOpacity
                key={concern.id}
                style={[
                  styles.concernChip,
                  isSelected && styles.concernChipActive,
                ]}
                onPress={() => setSelectedConcern(concern.id)}
              >
                <Text
                  style={[
                    Typography.labelMd,
                    styles.concernText,
                    isSelected && styles.concernTextActive,
                  ]}
                >
                  {concern.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 + insets.bottom }]}
      >
        {/* Category Filter Title Banner if Selected */}
        {selectedCategory ? (
          <View style={styles.filterBanner}>
            <Text style={[Typography.headingSm, styles.filterBannerText]}>
              Showing: {selectedCategory} ({filteredProducts.length} items)
            </Text>
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={[Typography.labelMd, styles.clearFilterText]}>Show All</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Directory Category Grid */}
        <Text style={[Typography.headingLg, styles.sectionTitle]}>
          Browse Skincare Directory
        </Text>

        <View style={styles.gridContainer}>
          {CATEGORY_ITEMS.map((cat, index) => {
            const isSelected = selectedCategory === cat.id;
            const cardBgColor = categoryTints[index % categoryTints.length];

            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  { backgroundColor: cardBgColor },
                  isSelected && styles.categoryCardSelected,
                ]}
                onPress={() =>
                  setSelectedCategory(isSelected ? null : cat.id)
                }
                activeOpacity={0.8}
              >
                <Image source={{ uri: cat.imageUri }} style={styles.catImage} />
                <View style={styles.catIconBadge}>
                  <Ionicons name={cat.iconName} size={16} color="#7A0C1F" />
                </View>
                <Text numberOfLines={2} style={[Typography.headingSm, styles.catName]}>
                  {cat.name}
                </Text>
                <Text style={[Typography.bodySm, styles.catCount]}>{cat.count} Items</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Products in Active View */}
        <View style={styles.productsSection}>
          <Text style={[Typography.headingLg, styles.sectionTitle]}>
            {selectedCategory ? `${selectedCategory} Collection` : 'Featured Products'}
          </Text>

          {/* Loading State or Empty State or Product Grid */}
          {isLoading ? (
            <View style={styles.productsGrid}>
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} style={styles.skeletonProductCard} />
              ))}
            </View>
          ) : filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={Colors.onboarding.textSecondary} />
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptySubtitle}>
                We couldn't find any products matching "{searchQuery || selectedCategory || selectedConcern}".
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setSelectedConcern('all');
                }}
                style={styles.clearFilterBtn}
              >
                <Text style={styles.clearFilterLink}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {filteredProducts.slice(0, 8).map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() =>
                    router.push({
                      pathname: '/(customer)/product/[id]',
                      params: { id: product.id },
                    })
                  }
                >
                  <Image source={resolveImageSource(product.imageSource || product.official_brand_image_url)} style={styles.productImage} />
                  <Text style={[Typography.labelSm, styles.brandName]}>{product.brand}</Text>
                  <Text numberOfLines={2} style={[Typography.headingSm, styles.productName]}>
                    {product.name}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={[Typography.priceMd, styles.price]}>₹{product.price}</Text>
                    <Text style={[Typography.priceStrike, styles.oldPrice]}>
                      ₹{product.originalPrice}
                    </Text>
                  </View>
                  <View style={{ marginTop: 6, alignItems: 'center' }}>
                    <AddToCartButton productId={product.id} product={product} size="small" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    color: '#1A1A1A',
  },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAF9F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEBE6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#1A1A1A',
    borderWidth: 0,
  },
  concernRow: {
    gap: 8,
    paddingRight: 16,
  },
  concernChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#EDEBE6',
  },
  concernChipActive: {
    backgroundColor: '#D4472C',
    borderColor: '#D4472C',
  },
  concernText: {
    color: '#6B6B6B',
  },
  concernTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  filterBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  filterBannerText: {
    color: '#C2410C',
  },
  clearFilterText: {
    color: '#D4472C',
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    color: '#1A1A1A',
    marginBottom: 14,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: {
    width: '48%',
    borderRadius: 16,
    padding: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    minHeight: 120,
  },
  categoryCardSelected: {
    borderWidth: 2,
    borderColor: '#D4472C',
  },
  catImage: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 70,
    height: 70,
    borderRadius: 35,
    opacity: 0.85,
  },
  catIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  catName: {
    color: '#1A1A1A',
    width: '75%',
    marginBottom: 4,
  },
  catCount: {
    color: '#6B6B6B',
  },
  productsSection: {
    marginTop: 8,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EDEBE6',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  brandName: {
    color: '#D4472C',
    marginBottom: 2,
  },
  productName: {
    color: '#1A1A1A',
    height: 38,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    color: '#D4472C',
  },
  oldPrice: {
    color: '#A3A3A3',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: '#FAF9F6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDEBE6',
    marginTop: 8,
  },
  emptyTitle: {
    ...Typography.headingLg,
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    ...Typography.bodyMd,
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFilterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearFilterLink: {
    ...Typography.labelMd,
    color: Colors.onboarding.primary,
    textDecorationLine: 'underline',
  },
  skeletonProductCard: {
    width: '48%',
    height: 180,
    borderRadius: 14,
  },
});
