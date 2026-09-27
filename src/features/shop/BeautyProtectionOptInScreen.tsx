import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  Microscope,
  Zap,
  CheckCircle2,
  FileText,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  coral: '#D4472C',
  infoBg: '#E8F0FE',
  infoBlue: '#1677E8',
  successGreen: '#2D9D5F',
  softGreen: '#E6F4EA',
  mainText: '#1A1A1A',
  secondaryText: '#6B6B6B',
  border: '#EDEBE6',
  cardBg: '#FFFFFF',
};

export const BeautyProtectionOptInScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const [protectionEnabled, setProtectionEnabled] = useState(true);

  const handleSaveChoice = () => {
    safeHapticImpact();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(customer)/(tabs)/cart');
    }
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
              router.push('/(customer)/(tabs)/cart');
            }
          }}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Beauty Protection Guarantee</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* HERO SHIELD CARD */}
        <View style={styles.heroCard}>
          <View style={styles.shieldBadge}>
            <ShieldCheck size={32} color={ColorTokens.infoBlue} />
          </View>
          <Text style={styles.heroHeadline}>GlowVAI Beauty Protection Cover (₹29)</Text>
          <Text style={styles.heroSub}>
            Shop skincare with complete peace of mind. Our 100% money-back adverse reaction guarantee protects every product in your order.
          </Text>
        </View>

        {/* 3 COVERAGE PILLARS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Coverage Highlights</Text>

          <View style={styles.pillarRow}>
            <View style={[styles.pillarIconWrap, { backgroundColor: '#E3F5EA' }]}>
              <Stethoscope size={20} color={ColorTokens.successGreen} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pillarTitle}>1. Adverse Reaction Guarantee</Text>
              <Text style={styles.pillarSub}>
                100% refund if any ordered product causes unexpected skin breakouts, rashes, or redness within 14 days of delivery.
              </Text>
            </View>
          </View>

          <View style={styles.pillarRow}>
            <View style={[styles.pillarIconWrap, { backgroundColor: '#F2ECFA' }]}>
              <Microscope size={20} color="#5C2A91" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pillarTitle}>2. In-App Dermatologist Audit</Text>
              <Text style={styles.pillarSub}>
                Submit a quick photo claim directly in the app. Verified clinical team reviews skin report within 24 hours.
              </Text>
            </View>
          </View>

          <View style={styles.pillarRow}>
            <View style={[styles.pillarIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Zap size={20} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pillarTitle}>3. Instant Wallet Refund</Text>
              <Text style={styles.pillarSub}>
                Approved claim amounts are refunded instantly to your GlowVAI Wallet or original UPI bank account.
              </Text>
            </View>
          </View>
        </View>

        {/* OPT-IN TOGGLE CARD */}
        <View style={styles.toggleCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Include Protection Cover (₹29)</Text>
            <Text style={styles.toggleSub}>Applies 14-Day Adverse Reaction Warranty to entire cart</Text>
          </View>
          <Switch
            value={protectionEnabled}
            onValueChange={(val) => {
              safeHapticSelection();
              setProtectionEnabled(val);
            }}
            trackColor={{ false: '#D1C7CE', true: ColorTokens.coral }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* DISCLAIMER FOOTNOTE */}
        <View style={styles.disclaimerRow}>
          <FileText size={14} color={ColorTokens.secondaryText} />
          <Text style={styles.disclaimerText}>
            Subject to GlowVAI Clinical Beauty Protection Policy terms. Photos required for verification.
          </Text>
        </View>

        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTION */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSaveChoice}
          activeOpacity={0.9}
        >
          <Text style={styles.saveBtnText}>
            {protectionEnabled ? 'Save Choice (Cover Added ₹29)' : 'Save Choice (No Protection)'}
          </Text>
        </TouchableOpacity>
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
    gap: 14,
  },
  heroCard: {
    backgroundColor: ColorTokens.infoBg,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  shieldBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroHeadline: {
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
    color: ColorTokens.mainText,
    textAlign: 'center',
  },
  heroSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: ColorTokens.secondaryText,
    textAlign: 'center',
    marginTop: 6,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 14,
  },
  sectionHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  pillarRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pillarIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  pillarSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    lineHeight: 16,
    color: ColorTokens.secondaryText,
    marginTop: 2,
  },
  toggleCard: {
    backgroundColor: ColorTokens.infoBg,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#C6D9FA',
  },
  toggleTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  toggleSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
    marginTop: 2,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  disclaimerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
    flex: 1,
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
  saveBtn: {
    backgroundColor: ColorTokens.coral,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
