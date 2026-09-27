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
  Star,
  CheckCircle2,
  ThumbsUp,
  ChevronDown,
  Filter,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  secondaryText: '#716675',
  mutedText: '#716675',
  border: '#E8E1E5',
  cardBg: '#FFFFFF',
  gold: '#FFD45F',
};

export const ProductReviewsScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const addItem = useCartStore((state) => state.addItem);

  const [activeFilter, setActiveFilter] = useState('All');
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({
    r1: 14,
    r2: 9,
    r3: 6,
  });

  const filterChips = ['All', 'My Skin Type', 'Combination', 'Dry', 'Oily', 'With Photos'];

  const ratingBars = [
    { stars: '5★', pct: 82, count: '1,023' },
    { stars: '4★', pct: 12, count: '150' },
    { stars: '3★', pct: 4, count: '50' },
    { stars: '2★', pct: 1, count: '12' },
    { stars: '1★', pct: 1, count: '13' },
  ];

  const reviews = [
    {
      id: 'r1',
      author: 'Sneha P.',
      skinType: 'Combination Skin',
      rating: 5,
      date: '2 days ago',
      verified: true,
      comment:
        'Feels lightweight on application. My skin feels softer and absorbs quickly without leaving any sticky residue. Perfect under daily sunscreen.',
      helpful: 14,
      photo: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'r2',
      author: 'Ananya R.',
      skinType: 'Dry Skin',
      rating: 5,
      date: '1 week ago',
      verified: true,
      comment:
        'Gives a comfortable hydrated feel throughout the day. Works well in my routine and helps maintain a smooth, fresh-looking complexion.',
      helpful: 9,
    },
    {
      id: 'r3',
      author: 'Kavya T.',
      skinType: 'Oily Skin',
      rating: 4,
      date: '2 weeks ago',
      verified: true,
      comment:
        'Absorbs quickly and fits right into my morning routine. Gives a nice subtle glow without clogging pores.',
      helpful: 6,
    },
  ];

  const handleHelpful = (id: string) => {
    safeHapticSelection();
    setHelpfulCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleAddToCart = () => {
    safeHapticImpact();
    addItem({
      productId: 'p-barrier-repair',
      name: 'GlowVAI Barrier Repair Serum',
      brand: 'GlowVAI',
      price: 699,
      mrp: 999,
      image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset, height: undefined, minHeight: 64 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerProductInfo}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=200&q=80' }}
            style={styles.headerThumb}
          />
          <View>
            <Text style={styles.headerTitle}>Reviews & Ratings</Text>
            <Text style={styles.headerProductName}>GlowVAI Barrier Repair Serum</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* RATING SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <View style={styles.scoreCol}>
            <Text style={styles.scoreVal}>4.8</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} color="#F59E0B" fill="#F59E0B" />
              ))}
            </View>
            <Text style={styles.totalReviewsCount}>1,248 reviews</Text>
            <View style={styles.verifiedBadge}>
              <CheckCircle2 size={10} color={ColorTokens.successGreen} />
              <Text style={styles.verifiedBadgeText}>100% Verified Buyers</Text>
            </View>
          </View>

          <View style={styles.barsCol}>
            {ratingBars.map((bar) => (
              <View key={bar.stars} style={styles.barRow}>
                <Text style={styles.barStarText}>{bar.stars}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${bar.pct}%` }]} />
                </View>
                <Text style={styles.barPctText}>{bar.pct}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* FILTER CHIPS & SORT */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {filterChips.map((chip) => {
              const isActive = activeFilter === chip;
              return (
                <TouchableOpacity
                  key={chip}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => {
                    safeHapticSelection();
                    setActiveFilter(chip);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {chip}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <TouchableOpacity style={styles.sortPill} activeOpacity={0.8}>
              <Text style={styles.sortPillText}>Most Helpful</Text>
              <ChevronDown size={14} color={ColorTokens.mainText} />
            </TouchableOpacity>
          </View>
        </View>

        {/* REVIEW CARDS LIST */}
        {reviews.map((rev) => (
          <View key={rev.id} style={styles.reviewCard}>
            <View style={styles.reviewTopRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{rev.author.substring(0, 2)}</Text>
              </View>

              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.authorName}>{rev.author}</Text>
                  {rev.verified && (
                    <View style={styles.verifiedBuyerTag}>
                      <CheckCircle2 size={10} color={ColorTokens.successGreen} />
                      <Text style={styles.verifiedBuyerText}>Verified</Text>
                    </View>
                  )}
                </View>

                <View style={styles.skinTypePill}>
                  <Text style={styles.skinTypeText}>{rev.skinType}</Text>
                </View>
              </View>

              <Text style={styles.reviewDate}>{rev.date}</Text>
            </View>

            <View style={styles.starsRowCompact}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={12}
                  color={s <= rev.rating ? '#F59E0B' : '#E0E0E0'}
                  fill={s <= rev.rating ? '#F59E0B' : 'transparent'}
                />
              ))}
            </View>

            <Text style={styles.reviewComment}>{rev.comment}</Text>

            {rev.photo && (
              <Image source={{ uri: rev.photo }} style={styles.reviewPhotoThumb} resizeMode="cover" />
            )}

            <View style={styles.reviewFooterRow}>
              <TouchableOpacity
                style={styles.helpfulBtn}
                onPress={() => handleHelpful(rev.id)}
                activeOpacity={0.8}
              >
                <ThumbsUp size={12} color={ColorTokens.secondaryText} />
                <Text style={styles.helpfulText}>Helpful ({helpfulCounts[rev.id] ?? rev.helpful})</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* STICKY PRODUCT PURCHASE BAR */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=200&q=80' }}
          style={styles.stickyThumb}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.stickyTitle} numberOfLines={1}>GlowVAI Barrier Repair Serum</Text>
          <Text style={styles.stickyPrice}>₹699 <Text style={styles.stickyMrp}>₹999</Text></Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart} activeOpacity={0.9}>
          <Text style={styles.addBtnText}>ADD TO CART</Text>
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
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerProductInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    flex: 1,
  },
  headerThumb: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  headerProductName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#FBE0DC',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCol: {
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderColor: ColorTokens.border,
  },
  scoreVal: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: ColorTokens.mainText,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 4,
  },
  totalReviewsCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.mutedText,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  verifiedBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 9,
    color: ColorTokens.successGreen,
  },
  barsCol: {
    flex: 1,
    paddingLeft: 16,
    gap: 4,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barStarText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: ColorTokens.mutedText,
    width: 20,
  },
  barTrack: {
    flex: 1,
    height: 5,
    backgroundColor: '#F3EBF0',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 2.5,
  },
  barPctText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.mutedText,
    width: 28,
    textAlign: 'right',
  },
  filterSection: {
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  filterChipActive: {
    backgroundColor: ColorTokens.deepBerry,
    borderColor: ColorTokens.deepBerry,
  },
  filterChipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: ColorTokens.mainText,
  },
  filterChipTextActive: {
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  sortLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.mutedText,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  sortPillText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: ColorTokens.mainText,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  reviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ColorTokens.softLavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: ColorTokens.plum,
  },
  authorName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  verifiedBuyerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBuyerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 8,
    color: ColorTokens.successGreen,
  },
  skinTypePill: {
    backgroundColor: '#F7F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  skinTypeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.mutedText,
  },
  reviewDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.mutedText,
  },
  starsRowCompact: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 8,
    marginBottom: 6,
  },
  reviewComment: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: ColorTokens.mainText,
  },
  reviewPhotoThumb: {
    width: 54,
    height: 54,
    borderRadius: 8,
    marginTop: 8,
  },
  reviewFooterRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#F5EFEF',
  },
  helpfulBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  helpfulText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: ColorTokens.mutedText,
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
  stickyThumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  stickyTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.mainText,
  },
  stickyPrice: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  stickyMrp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.mutedText,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    backgroundColor: ColorTokens.deepBerry,
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
});
