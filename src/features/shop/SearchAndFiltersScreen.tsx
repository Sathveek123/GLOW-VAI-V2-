import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Search,
  X,
  Mic,
  Star,
  Zap,
  Sparkles,
  Check,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react-native';

import { useCartStore } from '../../state/cartStore';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';
import { resolveImageSource } from '../../assets/productImages';
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
  mutedText: '#716675',
  border: '#E8E1E5',
  cardBg: '#FFFFFF',
  gold: '#FFD45F',
};

export const SearchAndFiltersScreen: React.FC = () => {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const addItem = useCartStore((state) => state.addItem);

  const isDesktopWeb = Platform.OS === 'web' && windowWidth > 768;

  const [query, setQuery] = useState('niacinamide serum');
  const [isListening, setIsListening] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const autocompleteTerms = [
    'Niacinamide 10% + Zinc 1%',
    'Salicylic Acid 2% Cleanser',
    'Vitamin C 15% Brightening Serum',
    'Cetaphil Gentle Skin Cleanser',
    'Dr. Sheth Centella Moisturizer',
  ];
  const [activeFilters, setActiveFilters] = useState({
    category: 'Skin Care',
    brand: 'The Ordinary',
    skinType: 'Oily Skin',
    concern: 'All',
    price: 'Under ₹800',
    delivery: '10 Min Delivery',
  });

  const activeChips = ['Skin Care', 'Oily Skin', 'Under ₹800', '10 Min Delivery'];

  const filterGroups = [
    {
      title: '1. Category',
      key: 'category',
      options: ['All', 'Skin Care', 'Hair Care', 'Makeup'],
    },
    {
      title: '2. Brand',
      key: 'brand',
      options: ['All', 'The Ordinary', 'Minimalist', 'Cetaphil'],
    },
    {
      title: '3. Skin Type',
      key: 'skinType',
      options: ['All', 'Oily Skin', 'Dry Skin', 'Combination'],
    },
    {
      title: '4. Concern',
      key: 'concern',
      options: ['All', 'Acne', 'Dark Spots', 'Pore Care'],
    },
    {
      title: '5. Price Range',
      key: 'price',
      options: ['All', 'Under ₹800', '₹800–₹1,200', '₹1,200+'],
    },
    {
      title: '6. Delivery Speed',
      key: 'delivery',
      options: ['All', '10 Min Delivery', '30 Min', '1 Hr+'],
    },
  ];

  const searchResults = [
    {
      id: 'sr1',
      brand: 'The Ordinary',
      name: 'Niacinamide 10% + Zinc 1% (30ml)',
      tags: ['Oil Control', 'Pore Tightening'],
      rating: 4.8,
      price: 699,
      mrp: 900,
      discount: '22% OFF',
      image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'sr2',
      brand: 'Minimalist',
      name: 'Niacinamide 10% Face Serum (30ml)',
      tags: ['Blemish Care', 'Texture Repair'],
      rating: 4.7,
      price: 599,
      mrp: 699,
      discount: '14% OFF',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'sr3',
      brand: 'Cetaphil',
      name: 'Gentle Skin Cleanser (125ml)',
      tags: ['Hydrating', 'Sensitive Skin'],
      rating: 4.9,
      price: 399,
      mrp: 499,
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'sr4',
      brand: 'Dr. Sheth’s',
      name: 'Centella & Niacinamide Oil Free Moisturizer',
      tags: ['Calming', 'Lightweight'],
      rating: 4.6,
      price: 449,
      mrp: 499,
      discount: '10% OFF',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const handleVoiceSearch = () => {
    safeHapticImpact();
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-IN';

          setIsListening(true);
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
              setQuery(transcript);
            }
            setIsListening(false);
          };
          recognition.onerror = () => {
            setIsListening(false);
          };
          recognition.onend = () => {
            setIsListening(false);
          };
          recognition.start();
        } catch (_) {
          setIsListening(false);
        }
      } else {
        alert('Voice search supported on Chrome, Edge and Safari browsers.');
      }
    } else {
      alert('Voice listening active... Speak your product name now.');
    }
  };

  const handleSelectOption = (groupKey: string, option: string) => {
    safeHapticSelection();
    setActiveFilters((prev) => ({ ...prev, [groupKey]: option }));
  };

  const handleClearAll = () => {
    safeHapticImpact();
    setActiveFilters({
      category: 'All',
      brand: 'All',
      skinType: 'All',
      concern: 'All',
      price: 'All',
      delivery: 'All',
    });
  };

  // DESKTOP WIDESCREEN WEB LAYOUT
  if (isDesktopWeb) {
    return (
      <View style={styles.desktopRoot}>
        <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

        {/* DESKTOP HEADER BAR */}
        <View style={styles.desktopHeaderBar}>
          <View style={styles.desktopHeaderInner}>
            <TouchableOpacity
              style={styles.desktopBackCircle}
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
              <Text style={styles.desktopHeaderText}>Search & Clinical Filters</Text>
            </View>
          </View>
        </View>

        {/* MAIN DESKTOP 2-COLUMN SPLIT CONTAINER */}
        <View style={styles.desktopMainContainer}>
          {/* LEFT FILTER SIDEBAR PANEL */}
          <View style={styles.desktopFilterSidebar}>
            <View style={styles.desktopSidebarTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <SlidersHorizontal size={18} color={ColorTokens.deepBerry} />
                <Text style={styles.desktopSidebarTitle}>Filters</Text>
              </View>
              <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7}>
                <Text style={styles.desktopResetText}>Reset All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              {filterGroups.map((group) => (
                <View key={group.key} style={styles.desktopFilterGroup}>
                  <Text style={styles.filterGroupTitle}>{group.title}</Text>
                  <View style={styles.optionsWrap}>
                    {group.options.map((opt) => {
                      const isSelected =
                        activeFilters[group.key as keyof typeof activeFilters] === opt;
                      return (
                        <TouchableOpacity
                          key={opt}
                          style={[styles.optChip, isSelected && styles.optChipSelected]}
                          onPress={() => handleSelectOption(group.key, opt)}
                          activeOpacity={0.8}
                        >
                          {isSelected && (
                            <Check size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                          )}
                          <Text
                            style={[
                              styles.optText,
                              isSelected && styles.optTextSelected,
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* RIGHT RESULTS AREA */}
          <View style={styles.desktopResultsArea}>
            {/* WIDE VOICE SEARCH BAR WITH INLINE AUTOCOMPLETE DRAWER */}
            <View style={{ position: 'relative', zIndex: 100 }}>
              <View style={styles.desktopSearchBar}>
                <Search size={20} color={ColorTokens.deepBerry} />
                <TextInput
                  style={styles.desktopSearchInput}
                  value={query}
                  onChangeText={(txt) => {
                    setQuery(txt);
                    if (!isSearchFocused) setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search by ingredient (e.g. Niacinamide, Salicylic Acid, Vitamin C)..."
                  placeholderTextColor={ColorTokens.mutedText}
                />
                {query.length > 0 && (
                  <TouchableOpacity onPress={() => setQuery('')} style={{ padding: 4 }}>
                    <X size={18} color={ColorTokens.mutedText} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.desktopMicBtn,
                    isListening && { backgroundColor: ColorTokens.softCoral },
                  ]}
                  onPress={() => {
                    setIsSearchFocused(true);
                    handleVoiceSearch();
                  }}
                  activeOpacity={0.8}
                >
                  <Mic
                    size={18}
                    color={isListening ? ColorTokens.coral : ColorTokens.deepBerry}
                  />
                  {isListening && (
                    <Text style={styles.listeningBadgeText}>Listening...</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* INLINE AUTOCOMPLETE DROPDOWN DRAWER */}
              {isSearchFocused && (
                <>
                  <TouchableOpacity
                    style={styles.drawerBackdrop}
                    onPress={() => setIsSearchFocused(false)}
                    activeOpacity={1}
                  />
                  <View style={styles.searchDropdownDrawer}>
                    <View style={styles.drawerHeaderRow}>
                      <Text style={styles.drawerHeaderTitle}>
                        {query.trim()
                          ? `Live Autocomplete Matches for "${query}"`
                          : '🔥 Popular Skincare Queries'}
                      </Text>
                      <TouchableOpacity onPress={() => setIsSearchFocused(false)}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Bold',
                            fontSize: 12,
                            color: ColorTokens.deepBerry,
                          }}
                        >
                          Done ✕
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {autocompleteTerms
                      .filter(
                        (t) => !query.trim() || t.toLowerCase().includes(query.toLowerCase())
                      )
                      .slice(0, 5)
                      .map((term, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={styles.suggestionRow}
                          onPress={() => {
                            setQuery(term);
                            setIsSearchFocused(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Search size={14} color={ColorTokens.deepBerry} />
                            <Text style={styles.suggestionText}>{term}</Text>
                          </View>
                          <Text style={styles.selectText}>Select →</Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </>
              )}
            </View>

            {/* RESULTS TOOLBAR */}
            <View style={styles.desktopToolbar}>
              <View>
                <Text style={styles.desktopResultsHeading}>48 Clinical Products Found</Text>
                <Text style={styles.desktopResultsSub}>
                  Showing top formulations matching "{query}"
                </Text>
              </View>

              {/* ACTIVE FILTER CHIPS */}
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {activeChips.map((chip, i) => (
                  <View key={i} style={styles.chipItem}>
                    <Text style={styles.chipText}>{chip}</Text>
                    <TouchableOpacity activeOpacity={0.7}>
                      <X size={12} color={ColorTokens.deepBerry} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* PRODUCT CARDS 4-COLUMN GRID */}
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              <View style={styles.desktopGrid}>
                {searchResults.map((item) => (
                  <View key={item.id} style={styles.desktopProductCard}>
                    <View style={styles.cardDeliveryBadge}>
                      <Zap size={9} color="#FFFFFF" fill="#FFFFFF" />
                      <Text style={styles.cardDeliveryText}>10 MIN</Text>
                    </View>

                    <Image
                      source={resolveImageSource(item.image)}
                      style={styles.desktopProductImg}
                      resizeMode="contain"
                    />

                    <Text style={styles.brandText}>{item.brand}</Text>
                    <Text style={styles.nameText} numberOfLines={2}>
                      {item.name}
                    </Text>

                    <View style={styles.tagsRow}>
                      {item.tags.map((tag, tIdx) => (
                        <Text key={tIdx} style={styles.tagBadge}>
                          {tag}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.ratingRow}>
                      <Star size={11} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.ratingVal}>{item.rating}</Text>
                    </View>

                    <View style={styles.priceRow}>
                      <Text style={styles.priceText}>₹{item.price}</Text>
                      <Text style={styles.mrpText}>₹{item.mrp}</Text>
                      <Text style={styles.discountText}>{item.discount}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={() => {
                        safeHapticImpact();
                        addItem({
                          productId: item.id,
                          name: item.name,
                          brand: item.brand,
                          price: item.price,
                          mrp: item.mrp,
                          image: item.image,
                        });
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.addBtnText}>ADD TO CART →</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset, height: 60 + headerTopInset }]}>
        <TouchableOpacity
          style={styles.backBtn}
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

        <View style={styles.headerTitleRow}>
          <Sparkles size={16} color={ColorTokens.gold} />
          <Text style={styles.headerLogo}>GlowVAI</Text>
          <Text style={styles.headerDivider}>|</Text>
          <Text style={styles.headerTitle}>Search & Filters</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* SEARCH INPUT BAR */}
        <View style={styles.searchBarWrap}>
          <Search size={18} color={ColorTokens.deepBerry} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search products, brands & concerns..."
            placeholderTextColor={ColorTokens.mutedText}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={{ padding: 2 }}>
              <X size={16} color={ColorTokens.mutedText} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{ padding: 4, marginLeft: 4 }}
            onPress={handleVoiceSearch}
            activeOpacity={0.7}
          >
            <Mic
              size={18}
              color={isListening ? ColorTokens.coral : ColorTokens.deepBerry}
            />
          </TouchableOpacity>
        </View>

        {/* RESULTS SUMMARY */}
        <View style={styles.resultsSummaryRow}>
          <Text style={styles.resultsCount}>48 products found</Text>
          <Text style={styles.resultsSub}>Matching your filter selection</Text>
        </View>

        {/* ACTIVE FILTER CHIPS */}
        <View style={styles.chipsWrap}>
          {activeChips.map((chip, i) => (
            <View key={i} style={styles.chipItem}>
              <Text style={styles.chipText}>{chip}</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <X size={12} color={ColorTokens.deepBerry} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* FILTER SECTIONS CARDS */}
        {filterGroups.map((group) => (
          <View key={group.key} style={styles.filterCard}>
            <Text style={styles.filterGroupTitle}>{group.title}</Text>
            <View style={styles.optionsWrap}>
              {group.options.map((opt) => {
                const isSelected = activeFilters[group.key as keyof typeof activeFilters] === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.optChip, isSelected && styles.optChipSelected]}
                    onPress={() => handleSelectOption(group.key, opt)}
                    activeOpacity={0.8}
                  >
                    {isSelected && <Check size={12} color="#FFFFFF" style={{ marginRight: 4 }} />}
                    <Text style={[styles.optText, isSelected && styles.optTextSelected]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* COMPACT SEARCH RESULTS PREVIEW */}
        <Text style={styles.previewHeading}>Filtered Results Preview</Text>

        <View style={styles.twoColumnGrid}>
          {searchResults.slice(0, 2).map((item) => (
            <View key={item.id} style={styles.productCard}>
              <View style={styles.cardDeliveryBadge}>
                <Zap size={9} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.cardDeliveryText}>10 MIN</Text>
              </View>

              <Image source={resolveImageSource(item.image)} style={styles.productImg} resizeMode="contain" />

              <Text style={styles.brandText}>{item.brand}</Text>
              <Text style={styles.nameText} numberOfLines={2}>{item.name}</Text>

              <View style={styles.tagsRow}>
                {item.tags.map((tag, tIdx) => (
                  <Text key={tIdx} style={styles.tagBadge}>{tag}</Text>
                ))}
              </View>

              <View style={styles.ratingRow}>
                <Star size={11} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingVal}>{item.rating}</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceText}>₹{item.price}</Text>
                <Text style={styles.mrpText}>₹{item.mrp}</Text>
                <Text style={styles.discountText}>{item.discount}</Text>
              </View>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => {
                  safeHapticImpact();
                  addItem({ productId: item.id, name: item.name, brand: item.brand, price: item.price, mrp: item.mrp, image: item.image });
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.addBtnText}>ADD</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTIONS */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll} activeOpacity={0.8}>
          <Text style={styles.clearBtnText}>Clear All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.showResultsBtn}
          onPress={() => {
            safeHapticImpact();
            router.back();
          }}
          activeOpacity={0.9}
        >
          <Text style={styles.showResultsText}>Show 48 Results →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  desktopRoot: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
  },
  desktopHeaderBar: {
    backgroundColor: ColorTokens.deepBerry,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  desktopHeaderInner: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  desktopBackCircle: {
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
  desktopMainContainer: {
    flex: 1,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 24,
    gap: 24,
  },
  desktopFilterSidebar: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  desktopSidebarTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: ColorTokens.border,
  },
  desktopSidebarTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: ColorTokens.mainText,
  },
  desktopResetText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: ColorTokens.deepBerry,
  },
  desktopFilterGroup: {
    marginBottom: 16,
  },
  desktopResultsArea: {
    flex: 1,
    gap: 16,
  },
  desktopSearchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: ColorTokens.deepBerry,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  desktopSearchInput: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: ColorTokens.mainText,
    marginLeft: 12,
    borderWidth: 0,
  },
  desktopMicBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: ColorTokens.softLavender,
    marginLeft: 8,
  },
  listeningBadgeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: ColorTokens.coral,
  },
  desktopToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  desktopResultsHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: ColorTokens.mainText,
  },
  desktopResultsSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: ColorTokens.mutedText,
  },
  desktopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 40,
  },
  desktopProductCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    position: 'relative',
  },
  desktopProductImg: {
    width: '100%',
    height: 140,
    marginTop: 8,
    marginBottom: 8,
  },
  root: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    height: 60,
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 12,
  },
  headerLogo: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  headerDivider: {
    color: 'rgba(255,255,255,0.4)',
  },
  headerTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  searchBarWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: ColorTokens.deepBerry,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: ColorTokens.mainText,
    marginLeft: 10,
    borderWidth: 0,
  },
  resultsSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  resultsCount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  resultsSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.mutedText,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ColorTokens.softCoral,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  chipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: ColorTokens.deepBerry,
  },
  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  filterGroupTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
    marginBottom: 10,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F7F4F6',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  optChipSelected: {
    backgroundColor: ColorTokens.deepBerry,
    borderColor: ColorTokens.deepBerry,
  },
  optText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: ColorTokens.mainText,
  },
  optTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  previewHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
    marginTop: 8,
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    position: 'relative',
  },
  cardDeliveryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    zIndex: 2,
  },
  cardDeliveryText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 8,
    color: '#FFFFFF',
  },
  productImg: {
    width: '100%',
    height: 90,
    marginTop: 8,
    marginBottom: 6,
  },
  brandText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.mutedText,
  },
  nameText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    lineHeight: 15,
    color: ColorTokens.mainText,
    marginTop: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  tagBadge: {
    fontFamily: 'Poppins-Medium',
    fontSize: 8,
    color: ColorTokens.plum,
    backgroundColor: ColorTokens.softLavender,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  ratingVal: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: ColorTokens.mainText,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  priceText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  mrpText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: ColorTokens.mutedText,
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    color: ColorTokens.successGreen,
  },
  addBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: '#FFFFFF',
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
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  clearBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: ColorTokens.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  showResultsBtn: {
    flex: 2,
    height: 46,
    borderRadius: 23,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showResultsText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  drawerBackdrop: {
    position: 'absolute',
    top: 54,
    left: -1000,
    right: -1000,
    height: 2000,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    zIndex: 99,
  },
  searchDropdownDrawer: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    zIndex: 100,
  },
  drawerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: ColorTokens.softLavender,
    marginBottom: 10,
  },
  drawerHeaderTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  suggestionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  selectText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: ColorTokens.deepBerry,
  },
});
