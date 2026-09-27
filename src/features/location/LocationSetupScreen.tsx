import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  Navigation,
  MapPin,
  ChevronRight,
  X,
  Sparkles,
  Lock,
  Building,
  Check,
  Compass,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Design Tokens for GlowVAI Location System
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

export interface LocationSetupScreenProps {
  onBack?: () => void;
  onSelectAddress?: (addr: string) => void;
  onNavigateToMapPicker?: (params: { latitude: number; longitude: number; addressString: string }) => void;
}

export const LocationSetupScreen: React.FC<LocationSetupScreenProps> = ({
  onBack,
  onSelectAddress,
  onNavigateToMapPicker,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const suggestedLocations = [
    { id: '1', name: 'Payakapuram, Vijayawada', locality: 'Near Water Tank Road, Sector 4' },
    { id: '2', name: 'Benz Circle, Vijayawada', locality: 'Opposite Trendset Mall, MG Road' },
    { id: '3', name: 'Governorpet, Vijayawada', locality: 'Near Prakasam Road Junction' },
  ];

  // Debounced search mock
  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      const loc = 'Payakapuram, Vijayawada';
      setSelectedLocation(loc);
      if (onNavigateToMapPicker) {
        onNavigateToMapPicker({ latitude: 16.532, longitude: 80.648, addressString: loc });
      } else {
        router.push('/map-picker' as any);
      }
    }, 600);
  };

  const handleSelectLocation = (locName: string) => {
    setSelectedLocation(locName);
  };

  const handleContinue = () => {
    if (!selectedLocation) return;
    if (onSelectAddress) {
      onSelectAddress(selectedLocation);
    }
    router.push({
      pathname: '/map-picker' as any,
      params: { address: selectedLocation },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* DEEP BERRY HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backCircle}
            onPress={onBack || (() => router.back())}
            activeOpacity={0.8}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.brandRow}>
            <Sparkles size={16} color="#FFD700" />
            <Text style={styles.logoText}>GlowVAI</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.headerTagline}>BEAUTY · FASTER · CLOSER</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        {/* HEADLINE & SUBTITLE */}
        <View style={styles.introSection}>
          <Text style={styles.headline}>Where should we deliver?</Text>
          <Text style={styles.subtitle}>
            Find your location to get your favorite beauty products, faster.
          </Text>
        </View>

        {/* ORIGINAL SOFT MAP & SCOOTER ILLUSTRATION CARD */}
        <View style={styles.illustrationCard}>
          <View style={styles.illusBgCircle} />
          <View style={styles.scooterRow}>
            <View style={styles.scooterIconBadge}>
              <Compass size={28} color={ColorTokens.deepBerry} />
            </View>
            <View style={styles.pinBadge}>
              <MapPin size={24} color="#FFFFFF" />
            </View>
            <View style={styles.boxBadge}>
              <Sparkles size={16} color={ColorTokens.coral} />
            </View>
          </View>
          <View style={styles.buildingsRow}>
            <Building size={32} color="#D8C7D5" />
            <Building size={44} color="#B89CB3" style={{ marginHorizontal: 8 }} />
            <Building size={28} color="#D8C7D5" />
          </View>
          <Text style={styles.illusLabel}>10-MIN EXPRESS BEAUTY ZONE</Text>
        </View>

        {/* SEARCH FIELD */}
        <View style={styles.searchContainer}>
          <Search size={20} color={ColorTokens.mutedText} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for your area, building or landmark"
            placeholderTextColor={ColorTokens.mutedText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {isSearching ? (
            <ActivityIndicator size="small" color={ColorTokens.deepBerry} />
          ) : searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={ColorTokens.mutedText} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* CURRENT LOCATION BUTTON */}
        <TouchableOpacity
          style={styles.currentLocBtn}
          onPress={handleUseCurrentLocation}
          activeOpacity={0.85}
          disabled={isLocating}
        >
          <View style={styles.targetIconBg}>
            <Navigation size={18} color={ColorTokens.deepBerry} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.currentLocTitle}>Use my current location</Text>
            <Text style={styles.currentLocSub}>Using GPS for accurate 10-min delivery pin</Text>
          </View>
          {isLocating && <ActivityIndicator size="small" color={ColorTokens.deepBerry} />}
        </TouchableOpacity>

        {/* SUGGESTED LOCATIONS */}
        <View style={styles.suggestedSection}>
          <Text style={styles.sectionTitle}>SUGGESTED LOCATIONS</Text>

          {suggestedLocations.map((item) => {
            const isSelected = selectedLocation === item.name;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.suggestionRow, isSelected && styles.suggestionRowSelected]}
                onPress={() => handleSelectLocation(item.name)}
                activeOpacity={0.8}
              >
                <View style={[styles.pinIconBg, isSelected && styles.pinIconBgSelected]}>
                  <MapPin size={18} color={isSelected ? '#FFFFFF' : ColorTokens.deepBerry} />
                </View>
                <View style={styles.suggestionTextCol}>
                  <Text style={styles.suggestionName}>{item.name}</Text>
                  <Text style={styles.suggestionLocality}>{item.locality}</Text>
                </View>
                {isSelected ? (
                  <View style={styles.checkCircle}>
                    <Check size={14} color="#FFFFFF" />
                  </View>
                ) : (
                  <ChevronRight size={18} color={ColorTokens.mutedText} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* PRIVACY NOTE */}
        <View style={styles.privacyCard}>
          <Lock size={15} color={ColorTokens.mutedText} />
          <Text style={styles.privacyText}>
            We use your location only to check delivery availability.
          </Text>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* STICKY BOTTOM PRIMARY CTA */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.continueBtn, !selectedLocation && styles.continueBtnDisabled]}
          onPress={handleContinue}
          activeOpacity={0.9}
          disabled={!selectedLocation}
        >
          <Text style={styles.continueBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerTagline: {
    fontSize: 10,
    fontWeight: '700',
    color: ColorTokens.softCoral,
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 1.5,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  introSection: {
    marginBottom: 16,
  },
  headline: {
    fontSize: 24,
    fontWeight: '800',
    color: ColorTokens.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: ColorTokens.mutedText,
    lineHeight: 20,
  },
  illustrationCard: {
    backgroundColor: ColorTokens.softCream,
    borderRadius: 20,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  illusBgCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: ColorTokens.softCoral,
    opacity: 0.3,
    top: -20,
  },
  scooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    zIndex: 2,
    marginBottom: 8,
  },
  scooterIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ColorTokens.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ColorTokens.deepBerry,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  boxBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buildingsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
    opacity: 0.8,
  },
  illusLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorTokens.plum,
    letterSpacing: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: ColorTokens.text,
  },
  currentLocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.softCoral,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(242, 127, 120, 0.3)',
    minHeight: 56,
  },
  targetIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  currentLocTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
  currentLocSub: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  suggestedSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 12,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    minHeight: 64,
  },
  suggestionRowSelected: {
    borderColor: ColorTokens.deepBerry,
    backgroundColor: ColorTokens.softCream,
  },
  pinIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ColorTokens.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pinIconBgSelected: {
    backgroundColor: ColorTokens.deepBerry,
  },
  suggestionTextCol: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  suggestionLocality: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  privacyText: {
    fontSize: 12,
    color: ColorTokens.mutedText,
  },
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
  continueBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnDisabled: {
    backgroundColor: ColorTokens.border,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
