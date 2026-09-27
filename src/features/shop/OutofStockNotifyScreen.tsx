import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  CheckSquare,
  Square,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  coral: '#D4472C',
  warningBg: '#FEF3C7',
  warningBorder: '#F59E0B',
  mainText: '#1A1A1A',
  secondaryText: '#6B6B6B',
  border: '#EDEBE6',
  cardBg: '#FFFFFF',
  successGreen: '#2D9D5F',
  softGreen: '#E6F4EA',
};

export const OutofStockNotifyScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const [pushChannel, setPushChannel] = useState(true);
  const [smsChannel, setSmsChannel] = useState(true);
  const [whatsappChannel, setWhatsappChannel] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    safeHapticImpact();
    setIsSubscribed(true);
    Alert.alert(
      '✓ Restock Alert Set!',
      "We'll notify you first the moment this formulation arrives at Payikapuram Dark Store.",
      [{ text: 'OK' }]
    );
  };

  const handleViewAlternatives = () => {
    safeHapticSelection();
    router.push('/(customer)/(tabs)/shop');
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset, height: undefined, minHeight: 64 }]}>
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
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Restock Notification</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* BELL BADGE & HERO */}
        <View style={styles.heroCard}>
          <View style={styles.bellBadge}>
            <Bell size={28} color={ColorTokens.warningBorder} />
          </View>

          <Text style={styles.headline}>Temporarily Out of Stock</Text>
          <Text style={styles.subheadline}>
            This item is currently sold out at <Text style={{ fontFamily: 'Poppins-Bold' }}>Payikapuram Dark Store #04</Text>.
            Set a restock alert to secure it the moment fresh stock lands.
          </Text>

          {isSubscribed ? (
            <View style={styles.successBox}>
              <Text style={styles.successTitle}>✓ Alert Active for this SKU</Text>
              <Text style={styles.successSub}>
                We will send an immediate notification when this item is back in stock.
              </Text>
            </View>
          ) : (
            <View style={styles.preferencesSection}>
              <Text style={styles.prefHeading}>Select Notification Channels:</Text>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => {
                  safeHapticSelection();
                  setPushChannel(!pushChannel);
                }}
                activeOpacity={0.8}
              >
                {pushChannel ? (
                  <CheckSquare size={20} color={ColorTokens.coral} />
                ) : (
                  <Square size={20} color={ColorTokens.secondaryText} />
                )}
                <Text style={styles.checkboxLabel}>Instant Push Notification</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => {
                  safeHapticSelection();
                  setSmsChannel(!smsChannel);
                }}
                activeOpacity={0.8}
              >
                {smsChannel ? (
                  <CheckSquare size={20} color={ColorTokens.coral} />
                ) : (
                  <Square size={20} color={ColorTokens.secondaryText} />
                )}
                <Text style={styles.checkboxLabel}>SMS Alert (+91 98765 43210)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => {
                  safeHapticSelection();
                  setWhatsappChannel(!whatsappChannel);
                }}
                activeOpacity={0.8}
              >
                {whatsappChannel ? (
                  <CheckSquare size={20} color={ColorTokens.coral} />
                ) : (
                  <Square size={20} color={ColorTokens.secondaryText} />
                )}
                <Text style={styles.checkboxLabel}>WhatsApp Alert</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ALTERNATIVE SUGGESTION BANNER */}
        <TouchableOpacity
          style={styles.alternativeCard}
          onPress={handleViewAlternatives}
          activeOpacity={0.85}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} color={ColorTokens.deepBerry} />
              <Text style={styles.altTitle}>Need it right now?</Text>
            </View>
            <Text style={styles.altSub}>
              Browse similar formulation serums in-stock at Payikapuram Dark Store.
            </Text>
          </View>
          <ArrowRight size={20} color={ColorTokens.deepBerry} />
        </TouchableOpacity>

        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTION */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {!isSubscribed ? (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleSubscribe}
            activeOpacity={0.9}
          >
            <Bell size={18} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Notify Me When Restocked</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleViewAlternatives}
            activeOpacity={0.9}
          >
            <Text style={styles.secondaryBtnText}>View Similar Alternatives →</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    alignItems: 'center',
  },
  bellBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ColorTokens.warningBg,
    borderWidth: 2,
    borderColor: ColorTokens.warningBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headline: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: ColorTokens.mainText,
    textAlign: 'center',
  },
  subheadline: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    lineHeight: 19,
    color: ColorTokens.secondaryText,
    textAlign: 'center',
    marginTop: 6,
  },
  preferencesSection: {
    width: '100%',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  prefHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
    marginBottom: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 12,
  },
  checkboxLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  successBox: {
    backgroundColor: ColorTokens.softGreen,
    padding: 16,
    borderRadius: 14,
    marginTop: 16,
    width: '100%',
  },
  successTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.successGreen,
  },
  successSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: ColorTokens.mainText,
    marginTop: 4,
  },
  alternativeCard: {
    backgroundColor: '#FFF0F3',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD6DF',
  },
  altTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.deepBerry,
  },
  altSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: ColorTokens.secondaryText,
    marginTop: 2,
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
  },
  primaryBtn: {
    backgroundColor: ColorTokens.coral,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  secondaryBtn: {
    backgroundColor: ColorTokens.deepBerry,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
