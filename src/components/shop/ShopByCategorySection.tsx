import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Flame,
  Heart,
  Droplet,
  Leaf,
  Flower2,
  User,
  Smile,
  Zap,
  Package,
} from 'lucide-react-native';
import { safeHapticSelection } from '../../utils/haptics';

const { width: WINDOW_W } = Dimensions.get('window');
const IS_DESKTOP = Platform.OS === 'web' && WINDOW_W >= 768;

export interface CategoryItem {
  id: string;
  title: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: React.FC<{ size?: number; color?: string }>;
  imageUrl: string;
  route: string;
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'skincare',
    title: 'Skin Care',
    bgColor: '#FFF0F3',
    textColor: '#800D37',
    borderColor: '#FFD6E0',
    icon: (props) => <Sparkles {...props} />,
    imageUrl: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
    route: '/(customer)/(tabs)/shop?cat=Skin%20Care',
  },
  {
    id: 'haircare',
    title: 'Hair Care',
    bgColor: '#FFF4EB',
    textColor: '#8A4B00',
    borderColor: '#FFE0C2',
    icon: (props) => <Flame {...props} />,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    route: '/(customer)/(tabs)/shop?cat=Hair%20Care',
  },
  {
    id: 'makeup',
    title: 'Makeup',
    bgColor: '#FEEBF1',
    textColor: '#800D37',
    borderColor: '#FDC4D6',
    icon: (props) => <Heart {...props} />,
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    route: '/(customer)/(tabs)/shop?cat=Makeup',
  },
  {
    id: 'bodycare',
    title: 'Body Care',
    bgColor: '#EBF5FF',
    textColor: '#0F52BA',
    borderColor: '#C7E2FE',
    icon: (props) => <Droplet {...props} />,
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80',
    route: '/(customer)/(tabs)/shop?cat=Body%20Care',
  },
  {
    id: 'wellness',
    title: 'Wellness',
    bgColor: '#EDF7F1',
    textColor: '#1E5631',
    borderColor: '#C8E8D5',
    icon: (props) => <Leaf {...props} />,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
    route: '/(customer)/(tabs)/shop?cat=Wellness',
  },
  {
    id: 'fragrance',
    title: 'Fragrance',
    bgColor: '#F5EEFF',
    textColor: '#5B2A91',
    borderColor: '#E2D1FC',
    icon: (props) => <Flower2 {...props} />,
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80',
    route: '/(customer)/(tabs)/shop?cat=Fragrance',
  },
  {
    id: 'mensgrooming',
    title: "Men's Grooming",
    bgColor: '#EEF2F6',
    textColor: '#2E3440',
    borderColor: '#D8E1E8',
    icon: (props) => <User {...props} />,
    imageUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=400&q=80',
    route: "/(customer)/(tabs)/shop?cat=Men's%20Grooming",
  },
  {
    id: 'babycare',
    title: 'Baby Care',
    bgColor: '#E0F7FA',
    textColor: '#0284C7',
    borderColor: '#B3E5FC',
    icon: (props) => <Smile {...props} />,
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80',
    route: '/(customer)/(tabs)/shop?cat=Baby%20Care',
  },
  {
    id: 'toolsdevices',
    title: 'Tools & Devices',
    bgColor: '#F7EDFC',
    textColor: '#7E22CE',
    borderColor: '#E7C8F8',
    icon: (props) => <Zap {...props} />,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80',
    route: '/(customer)/(tabs)/shop?cat=Tools%20%26%20Devices',
  },
  {
    id: 'travelminis',
    title: 'Travel Minis',
    bgColor: '#E6FFFA',
    textColor: '#0F766E',
    borderColor: '#B2F5EA',
    icon: (props) => <Package {...props} />,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
    route: '/(customer)/(tabs)/shop?cat=Travel%20Minis',
  },
];

interface CategoryCardProps {
  category: CategoryItem;
  cardWidth: number;
}

function CategoryCard({ category, cardWidth }: CategoryCardProps) {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    safeHapticSelection();
    router.push(category.route as any);
  };

  return (
    <Pressable
      onPressIn={() => (scale.value = withTiming(0.95, { duration: 100 }))}
      onPressOut={() => (scale.value = withTiming(1, { duration: 150 }))}
      onPress={handlePress}
      style={{ minHeight: 44, minWidth: 44 }}
      accessibilityRole="button"
      accessibilityLabel={`Browse ${category.title} category`}
    >
      <Animated.View
        style={[
          styles.card,
          {
            width: cardWidth,
            backgroundColor: category.bgColor,
            borderColor: category.borderColor,
          },
          animatedStyle,
        ]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: category.imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.cardFooter}>
          <View style={[styles.iconBadge, { backgroundColor: category.bgColor }]}>
            {category.icon({ size: 14, color: category.textColor })}
          </View>
          <Text
            style={[styles.cardTitle, { color: category.textColor }]}
            numberOfLines={1}
          >
            {category.title}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function ShopByCategorySection({ isDesktopOverride }: { isDesktopOverride?: boolean }) {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const isDesktop = isDesktopOverride ?? IS_DESKTOP;
  const cardWidth = isDesktop ? 190 : 154;
  const cardGap = isDesktop ? 18 : 12;

  const handleScrollLeft = () => {
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
        </View>

        <View style={styles.actionGroup}>
          {isDesktop && (
            <View style={styles.desktopArrows}>
              <TouchableOpacity
                style={styles.arrowBtn}
                onPress={handleScrollLeft}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Scroll category left"
              >
                <ChevronLeft size={16} color="#800D37" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.arrowBtn}
                onPress={handleScrollRight}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Scroll category right"
              >
                <ChevronRight size={16} color="#800D37" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => router.push('/(customer)/(tabs)/shop')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="See all categories"
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={14} color="#800D37" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={cardWidth + cardGap}
        contentContainerStyle={[
          styles.carouselContainer,
          { gap: cardGap, paddingRight: isDesktop ? 24 : 18 },
        ]}
      >
        {CATEGORIES_DATA.map((cat) => (
          <CategoryCard key={cat.id} category={cat} cardWidth={cardWidth} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 26,
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#171717',
    letterSpacing: -0.2,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  desktopArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 6,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF0F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFD6E0',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  seeAllText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#800D37',
  },
  carouselContainer: {
    paddingLeft: 18,
    paddingVertical: 4,
  },
  card: {
    height: 172,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#24000D',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '100%',
    height: 114,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardFooter: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    lineHeight: 16,
    flex: 1,
  },
});
