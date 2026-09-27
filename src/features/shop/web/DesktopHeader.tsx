import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Pressable, ScrollView, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Zap,
  Search,
  ScanFace,
  ShoppingCart,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  Package,
  FileText,
  Bookmark,
  Gift,
  Settings,
  LogOut,
  Mic,
  X,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react-native';
import { Colors } from '../../../design/tokens';
import { Typography } from '../../../design/typography';
import { useCartStore } from '../../../state/cartStore';
import { safeHapticImpact } from '../../../utils/haptics';
import { storage } from '../../../utils/storage';
import { getCurrentUser, subscribeToAuthState, logoutUser } from '../../../services/authService';
import { getActiveLocation, subscribeToLocationChange, getDeviceCurrentLocation } from '../../../services/locationService';
import { INDIAN_SKINCARE_CATALOG } from '../../../data/indianSkincareCatalog';
import { resolveImageSource } from '../../../assets/productImages';

interface DesktopHeaderProps {
  onOpenCartDrawer: () => void;
  onOpenSearchModal: () => void;
  onOpenLoginModal: () => void;
}

export function DesktopHeader({
  onOpenCartDrawer,
  onOpenSearchModal,
  onOpenLoginModal,
}: DesktopHeaderProps) {
  const router = useRouter();
  const categoryScrollRef = useRef<ScrollView>(null);
  const { totalCount, totalPrice } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeLocation, setActiveLocation] = useState('Payikapuram, Vijayawada');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

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
          setIsSearchOpen(true);

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
              setSearchQuery(transcript);
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
      alert('Voice search listening active...');
    }
  };

  const trendingKeywords = [
    'Niacinamide 10% + Zinc 1%',
    'Salicylic Acid Cleanser',
    'Vitamin C 15% Serum',
    'Centella Oil Free Moisturizer',
    'Ceramide Barrier Cream',
    'Hyaluronic Acid Hydrator',
  ];

  const autocompleteSuggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return trendingKeywords.map((term) => ({ text: term, type: 'trending' }));
    }

    const matches: { text: string; type: string }[] = [];
    INDIAN_SKINCARE_CATALOG.forEach((item) => {
      if (
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      ) {
        if (!matches.some((m) => m.text.toLowerCase() === item.name.toLowerCase())) {
          matches.push({ text: item.name, type: 'product' });
        }
      }
    });

    if (matches.length === 0) {
      trendingKeywords.forEach((term) => {
        matches.push({ text: term, type: 'trending' });
      });
    }

    return matches.slice(0, 6);
  }, [searchQuery]);

  const matchingProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return INDIAN_SKINCARE_CATALOG.slice(0, 3);
    return INDIAN_SKINCARE_CATALOG.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [searchQuery]);
  const [userState, setUserState] = useState<{
    isLoggedIn: boolean;
    displayName: string;
    phone: string;
  }>({
    isLoggedIn: true, // Default active on PC Web so profile icon is visible immediately
    displayName: 'GlowVAI Member',
    phone: '+91 98765 43210',
  });

  useEffect(() => {
    getActiveLocation().then((loc) => {
      if (loc) setActiveLocation(loc);
    });
    getDeviceCurrentLocation().catch(() => null);
    const unsubscribeLoc = subscribeToLocationChange((newLoc) => {
      setActiveLocation(newLoc);
    });
    return () => unsubscribeLoc();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await storage.getItem('glowvai_auth_token');
        const user = getCurrentUser();
        if (token || user) {
          setUserState({
            isLoggedIn: true,
            displayName: user?.displayName || 'GlowVAI Member',
            phone: user?.phoneNumber || '+91 98765 43210',
          });
        }
      } catch {
        // Keep default demo user logged in on web
      }
    };
    checkAuth();

    const unsubscribe = subscribeToAuthState((user) => {
      if (user) {
        setUserState({
          isLoggedIn: true,
          displayName: user.displayName || 'GlowVAI Member',
          phone: user.phoneNumber || '+91 98765 43210',
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    safeHapticImpact();
    setIsProfileMenuOpen(false);
    await logoutUser();
    await storage.removeItem('glowvai_auth_token');
    setUserState({
      isLoggedIn: false,
      displayName: 'Guest User',
      phone: '',
    });
  };

  const categories = [
    'All',
    'Serums',
    'Facial Creams',
    'Ointments',
    'Lotions',
    'Sunscreen',
    'Cleansers',
    'Facial Masks',
    'Body Care',
    '⚡ Steal Deals',
  ];

  return (
    <View style={styles.container}>
      {/* Top Main Navigation Bar (72px height, Vertical Berry Gradient) */}
      <LinearGradient
        colors={['#970D30', '#760A27']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.mainHeader}
      >
        <View style={styles.headerInner}>
          {/* 1. Left Brand Wordmark */}
          <TouchableOpacity
            style={styles.logoRow}
            onPress={() => router.push('/(customer)/(tabs)')}
            activeOpacity={0.85}
          >
            <Text style={styles.logoTextMain}>glow</Text>
            <Text style={styles.logoTextAccent}>vai</Text>
            <View style={styles.webTag}>
              <Text style={styles.webTagText}>WEB</Text>
            </View>
          </TouchableOpacity>

          {/* 2. Inline Location Selector */}
          <TouchableOpacity
            style={styles.locationPill}
            onPress={() => {
              safeHapticImpact();
              router.push('/(customer)/map-picker' as any);
            }}
            activeOpacity={0.8}
          >
            <MapPin size={15} color="#FAF8F5" />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.locationSub}>DELIVER TO</Text>
              <Text style={styles.locationMain} numberOfLines={1}>
                {activeLocation} ⌄
              </Text>
            </View>
          </TouchableOpacity>

          {/* 3. Center Wide Search Bar with Amazon-Style Inline Autocomplete Drawer */}
          <View style={{ flex: 1, maxWidth: 580, position: 'relative', zIndex: 1000 }}>
            <View style={[styles.searchBarContainer, isSearchOpen && styles.searchBarContainerActive]}>
              <Search size={18} color="#8F0D2F" />
              <TextInput
                style={styles.headerSearchInput}
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  if (!isSearchOpen) setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onSubmitEditing={() => {
                  setIsSearchOpen(false);
                  router.push({
                    pathname: '/search-filters' as any,
                    params: { query: searchQuery },
                  });
                }}
                placeholder="Search Niacinamide, Sunscreen, Serums & more..."
                placeholderTextColor="#7A7A7A"
              />

              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4, marginRight: 2 }}>
                  <X size={16} color="#716675" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.headerMicBtn, isListening && styles.headerMicBtnActive]}
                onPress={handleVoiceSearch}
                activeOpacity={0.8}
              >
                <Mic size={16} color={isListening ? '#F27F78' : '#8F0D2F'} />
                {isListening && <Text style={styles.listeningText}>Listening...</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.aiScanPill}
                onPress={() => {
                  safeHapticImpact();
                  router.push('/(customer)/scan/camera');
                }}
                activeOpacity={0.8}
              >
                <ScanFace size={14} color={Colors.white} />
                <Text style={styles.aiScanText}>AI Scan</Text>
              </TouchableOpacity>
            </View>

            {/* AMAZON-STYLE INLINE AUTOCOMPLETE DROPDOWN DRAWER */}
            {isSearchOpen && (
              <>
                <Pressable style={styles.searchOverlayBackdrop} onPress={() => setIsSearchOpen(false)} />
                <View style={styles.searchDropdownDrawer}>
                  <View style={styles.drawerHeaderRow}>
                    <Text style={styles.drawerHeaderTitle}>
                      {searchQuery.trim()
                        ? `Live Matches for "${searchQuery}"`
                        : '🔥 Trending Clinical Formulations'}
                    </Text>
                    <TouchableOpacity onPress={() => setIsSearchOpen(false)}>
                      <Text style={styles.closeDrawerBtn}>Close ✕</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Suggestions List */}
                  <View style={styles.suggestionsContainer}>
                    {autocompleteSuggestions.map((item, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.suggestionItem}
                        onPress={() => {
                          setSearchQuery(item.text);
                          setIsSearchOpen(false);
                          router.push({
                            pathname: '/search-filters' as any,
                            params: { query: item.text },
                          });
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={styles.suggestionLeftRow}>
                          {item.type === 'trending' ? (
                            <TrendingUp size={15} color="#8F0D2F" />
                          ) : (
                            <Search size={15} color="#716675" />
                          )}
                          <Text style={styles.suggestionLabelText}>{item.text}</Text>
                        </View>
                        <ArrowRight size={14} color="#CBD5E1" />
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Product Previews */}
                  {matchingProducts.length > 0 && (
                    <View style={styles.drawerProductsSection}>
                      <Text style={styles.drawerProductsHeading}>
                        ⚡ Instant Add Products ({matchingProducts.length})
                      </Text>
                      <View style={styles.drawerProductsList}>
                        {matchingProducts.map((prod) => (
                          <View key={prod.id} style={styles.drawerProductCard}>
                            <Image
                              source={resolveImageSource(prod.imageSource || prod.official_brand_image_url)}
                              style={styles.drawerProductImg}
                              resizeMode="contain"
                            />
                            <View style={{ flex: 1, marginLeft: 10 }}>
                              <Text style={styles.drawerProductBrand}>{prod.brand}</Text>
                              <Text style={styles.drawerProductName} numberOfLines={1}>
                                {prod.name}
                              </Text>
                              <View style={styles.drawerPriceRow}>
                                <Text style={styles.drawerPrice}>₹{prod.price}</Text>
                                {prod.originalPrice ? (
                                  <Text style={styles.drawerMrp}>₹{prod.originalPrice}</Text>
                                ) : null}
                              </View>
                            </View>

                            <TouchableOpacity
                              style={styles.drawerAddBtn}
                              onPress={() => {
                                safeHapticImpact();
                                useCartStore.getState().addItem({
                                  productId: prod.id,
                                  name: prod.name,
                                  brand: prod.brand,
                                  price: prod.price,
                                  mrp: prod.originalPrice,
                                  image: prod.imageSource as string,
                                });
                              }}
                              activeOpacity={0.85}
                            >
                              <Plus size={14} color="#FFFFFF" />
                              <Text style={styles.drawerAddText}>ADD</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.seeAllFooterBtn}
                    onPress={() => {
                      setIsSearchOpen(false);
                      router.push({
                        pathname: '/search-filters' as any,
                        params: { query: searchQuery },
                      });
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.seeAllFooterText}>
                      SEE ALL RESULTS FOR "{searchQuery || 'CLINICAL SKINCARE'}" →
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* 4. Right Nav Cluster (ETA, Profile/Login, Cart) */}
          <View style={styles.rightNavCluster}>
            {/* Delivery ETA Badge */}
            <View style={styles.etaBadge}>
              <Zap size={14} color="#FFE05B" fill="#FFE05B" />
              <Text style={styles.etaText}>10 MINS</Text>
            </View>

            {/* Profile / Login Icon */}
            {userState.isLoggedIn ? (
              <View style={{ position: 'relative', zIndex: 200 }}>
                <TouchableOpacity
                  style={styles.profileBtn}
                  onPress={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  activeOpacity={0.8}
                >
                  <View style={styles.avatarCircle}>
                    <User size={16} color="#8F0D2F" />
                  </View>
                  <Text style={styles.profileBtnText} numberOfLines={1}>
                    Profile
                  </Text>
                  <ChevronDown size={14} color={Colors.white} />
                </TouchableOpacity>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <>
                    <Pressable
                      style={styles.menuOverlay}
                      onPress={() => setIsProfileMenuOpen(false)}
                    />
                    <View style={styles.dropdownMenu}>
                      <View style={styles.dropdownUserHeader}>
                        <View style={styles.dropdownAvatar}>
                          <User size={20} color="#8F0D2F" />
                        </View>
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text style={styles.dropdownUserName}>{userState.displayName}</Text>
                          <Text style={styles.dropdownUserPhone}>{userState.phone}</Text>
                        </View>
                      </View>

                      <View style={styles.menuDivider} />

                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          setIsProfileMenuOpen(false);
                          router.push('/(customer)/(tabs)/profile');
                        }}
                      >
                        <User size={16} color="#8F0D2F" />
                        <Text style={styles.dropdownItemText}>My Profile & Skin Details</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          setIsProfileMenuOpen(false);
                          router.push('/(customer)/(tabs)/orders');
                        }}
                      >
                        <Package size={16} color="#8F0D2F" />
                        <Text style={styles.dropdownItemText}>Orders & Delivery Tracking</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          setIsProfileMenuOpen(false);
                          router.push('/(customer)/scan/report');
                        }}
                      >
                        <FileText size={16} color="#8F0D2F" />
                        <Text style={styles.dropdownItemText}>AI Skin Diagnostics Report</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          setIsProfileMenuOpen(false);
                          router.push('/(customer)/saved-addresses');
                        }}
                      >
                        <Bookmark size={16} color="#8F0D2F" />
                        <Text style={styles.dropdownItemText}>Saved Delivery Addresses</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          setIsProfileMenuOpen(false);
                          router.push('/(customer)/referrals');
                        }}
                      >
                        <Gift size={16} color="#8F0D2F" />
                        <Text style={styles.dropdownItemText}>Referrals & Glow Coins</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          setIsProfileMenuOpen(false);
                          router.push('/(customer)/(tabs)/profile');
                        }}
                      >
                        <Settings size={16} color="#8F0D2F" />
                        <Text style={styles.dropdownItemText}>Settings & Preferences</Text>
                      </TouchableOpacity>

                      <View style={styles.menuDivider} />

                      <TouchableOpacity
                        style={styles.dropdownItemLogout}
                        onPress={handleSignOut}
                      >
                        <LogOut size={16} color="#DC2626" />
                        <Text style={styles.dropdownItemLogoutText}>Sign Out</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            ) : (
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={onOpenLoginModal}
                activeOpacity={0.8}
              >
                <User size={16} color={Colors.white} />
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            )}

            {/* Cart Drawer Trigger Button */}
            <TouchableOpacity
              style={styles.cartButton}
              onPress={onOpenCartDrawer}
              activeOpacity={0.85}
            >
              <ShoppingCart size={18} color={Colors.white} />
              <View style={styles.cartInfo}>
                <Text style={styles.cartTitle}>Cart ({totalCount})</Text>
                <Text style={styles.cartAmount}>₹{totalPrice}</Text>
              </View>
              {totalCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Secondary Horizontal Category Bar (Side-Swipe System with Arrow Controls) */}
      <View style={styles.categoryBar}>
        <View style={styles.categoryBarInner}>
          <TouchableOpacity
            style={styles.scrollArrowBtn}
            onPress={() => categoryScrollRef.current?.scrollTo({ x: 0, animated: true })}
            activeOpacity={0.7}
          >
            <ChevronLeft size={16} color={Colors.cartMaroon} />
          </TouchableOpacity>

          <ScrollView
            ref={categoryScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => {
                    setSelectedCategory(cat);
                    if (cat !== 'All') {
                      router.push(`/(customer)/(tabs)/shop?cat=${encodeURIComponent(cat)}` as any);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={styles.scrollArrowBtn}
            onPress={() => categoryScrollRef.current?.scrollToEnd({ animated: true })}
            activeOpacity={0.7}
          >
            <ChevronRight size={16} color={Colors.cartMaroon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 100,
  },
  mainHeader: {
    width: '100%',
    minHeight: 72,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerInner: {
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    gap: 18,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTextMain: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: '#D4472C',
    letterSpacing: -0.5,
  },
  logoTextAccent: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  webTag: {
    backgroundColor: '#F6B51B',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 6,
  },
  webTagText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: '#661025',
    letterSpacing: 0.5,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 14,
    height: 43,
    borderRadius: 23,
    maxWidth: 210,
  },
  locationSub: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 8,
    color: '#F0B9C5',
    letterSpacing: 0.8,
  },
  locationMain: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#FFFFFF',
  },
  searchBarContainer: {
    flex: 1,
    maxWidth: 540,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 6,
    height: 46,
    shadowColor: '#2D000C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  searchPlaceholder: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#7A7A7A',
    flex: 1,
    marginLeft: 10,
  },
  aiScanPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1677E8',
    borderRadius: 19,
    minWidth: 83,
    height: 36,
    paddingHorizontal: 13,
  },
  aiScanText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: Colors.white,
    marginLeft: 4,
  },
  rightNavCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 191, 0, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 91, 0.35)',
    paddingHorizontal: 13,
    height: 38,
    borderRadius: 20,
  },
  etaText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#FFE05B',
    marginLeft: 4,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 43,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  loginText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: Colors.white,
    marginLeft: 6,
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 14,
    height: 43,
    borderRadius: 23,
    gap: 6,
  },
  avatarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBtnText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.white,
    maxWidth: 90,
  },
  menuOverlay: {
    position: 'absolute',
    top: -100,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 998,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 260,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: Colors.shop.border,
    zIndex: 999,
  },
  dropdownUserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  dropdownAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDF2F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownUserName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: Colors.textPrimary,
  },
  dropdownUserPhone: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.textSecondary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.shop.border,
    marginVertical: 6,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 10,
  },
  dropdownItemText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.textPrimary,
  },
  dropdownItemLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 10,
  },
  dropdownItemLogoutText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#DC2626',
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 23,
    paddingHorizontal: 14,
    height: 43,
    position: 'relative',
    minWidth: 108,
  },
  cartInfo: {
    marginLeft: 8,
  },
  cartTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: Colors.white,
  },
  cartAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#FFD700',
  },
  cartBadge: {
    position: 'absolute',
    top: -7,
    right: -4,
    backgroundColor: '#159447',
    borderRadius: 10,
    minWidth: 19,
    height: 19,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#8F0D2F',
  },
  cartBadgeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: Colors.white,
  },

  categoryBar: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
    paddingVertical: 8,
    minHeight: 48,
  },
  categoryBarInner: {
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 9,
  },
  scrollArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  categoryScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 4,
  },
  categoryChip: {
    paddingHorizontal: 15,
    height: 32,
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#f6f7f8',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: '#8F0D2F',
    borderColor: '#8F0D2F',
  },
  categoryChipText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#323232',
  },
  categoryChipTextActive: {
    color: Colors.white,
    fontFamily: 'Poppins-Bold',
  },

  headerSearchInput: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#241529',
    marginLeft: 8,
    borderWidth: 0,
  },
  searchBarContainerActive: {
    borderColor: '#8F0D2F',
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },
  headerMicBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F2ECFA',
    marginRight: 6,
  },
  headerMicBtnActive: {
    backgroundColor: '#FBE0DC',
  },
  listeningText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: '#F27F78',
  },
  searchOverlayBackdrop: {
    position: 'absolute',
    top: 54,
    left: -1000,
    right: -1000,
    height: 2000,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    zIndex: 999,
  },
  searchDropdownDrawer: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: '#E8E1E5',
    zIndex: 1000,
  },
  drawerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2ECFA',
    marginBottom: 10,
  },
  drawerHeaderTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#241529',
  },
  closeDrawerBtn: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#8F0D2F',
  },
  suggestionsContainer: {
    marginBottom: 14,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  suggestionLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  suggestionLabelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#241529',
  },
  drawerProductsSection: {
    backgroundColor: '#FFFDF7',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F2ECFA',
    marginBottom: 12,
  },
  drawerProductsHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#8F0D2F',
    marginBottom: 10,
  },
  drawerProductsList: {
    gap: 8,
  },
  drawerProductCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E8E1E5',
  },
  drawerProductImg: {
    width: 44,
    height: 44,
    borderRadius: 6,
  },
  drawerProductBrand: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    color: '#716675',
    textTransform: 'uppercase',
  },
  drawerProductName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#241529',
  },
  drawerPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  drawerPrice: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#8F0D2F',
  },
  drawerMrp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#716675',
    textDecorationLine: 'line-through',
  },
  drawerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#8F0D2F',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  drawerAddText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  seeAllFooterBtn: {
    backgroundColor: '#8F0D2F',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  seeAllFooterText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

