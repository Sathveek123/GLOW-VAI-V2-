import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react-native';
import { router } from 'expo-router';
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

export interface IngredientAuditScreenProps {
  onBack?: () => void;
  onProceed?: () => void;
}

export const IngredientAuditScreen: React.FC<IngredientAuditScreenProps> = ({
  onBack,
  onProceed,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const handleProceed = () => {
    if (onProceed) onProceed();
    else router.push('/(customer)/recommendations/chat' as any);
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
          <Text style={styles.headerTitle}>Ingredient Safety Audit</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* SAFETY AUDIT BANNER */}
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <ShieldCheck size={14} color={ColorTokens.successGreen} />
            <Text style={styles.badgeText}>100% CONTRAINDICATION SAFE</Text>
          </View>
          <Text style={styles.headline}>Layering Safety Check Passed</Text>
          <Text style={styles.subtext}>
            All prescribed actives in your routine are molecularly compatible and safe to layer together.
          </Text>
        </View>

        {/* pH SCALE VISUAL SPEC */}
        <Text style={styles.sectionTitle}>ROUTINE pH LEVEL BALANCE</Text>
        <View style={styles.phCard}>
          <View style={styles.phHeader}>
            <Text style={styles.phTitle}>Optimal Skin pH (4.5 – 5.5)</Text>
            <Text style={styles.phVal}>Target pH 5.2</Text>
          </View>
          <View style={styles.phBarBg}>
            <View style={styles.phBarGradient} />
            <View style={[styles.phPin, { left: '60%' }]} />
          </View>
          <Text style={styles.phNote}>Your routine preserves the natural acid mantle.</Text>
        </View>

        {/* PAIRING COMPATIBILITY LIST */}
        <Text style={styles.sectionTitle}>ACTIVE PAIRING AUDIT</Text>
        <View style={styles.pairingList}>
          <View style={styles.pairingCard}>
            <CheckCircle2 size={18} color={ColorTokens.successGreen} />
            <View style={{ flex: 1 }}>
              <Text style={styles.pairTitle}>Niacinamide + Hyaluronic Acid</Text>
              <Text style={styles.pairStatus}>SAFE · Synergistic Barrier Repair</Text>
            </View>
          </View>

          <View style={styles.pairingCard}>
            <CheckCircle2 size={18} color={ColorTokens.successGreen} />
            <View style={{ flex: 1 }}>
              <Text style={styles.pairTitle}>Salicylic Acid + Zinc PCA</Text>
              <Text style={styles.pairStatus}>SAFE · Targeted Sebum Control</Text>
            </View>
          </View>

          <View style={styles.pairingCardWarning}>
            <AlertTriangle size={18} color={ColorTokens.coral} />
            <View style={{ flex: 1 }}>
              <Text style={styles.pairTitle}>AHA/BHA + Retinol</Text>
              <Text style={styles.pairStatusWarning}>CAUTION · Separate AM vs PM</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY FOOTER */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleProceed} activeOpacity={0.9}>
          <Text style={styles.primaryBtnText}>Ask AI Dermatologist →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default IngredientAuditScreen;

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
  heroCard: {
    backgroundColor: ColorTokens.softGreen,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(21, 148, 71, 0.2)',
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
  badgeText: { fontSize: 10, fontWeight: '800', color: ColorTokens.successGreen, letterSpacing: 1 },
  headline: { fontSize: 22, fontWeight: '800', color: ColorTokens.text, marginBottom: 6 },
  subtext: { fontSize: 13, color: ColorTokens.mutedText, lineHeight: 18 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: ColorTokens.mutedText, letterSpacing: 1, marginBottom: 10 },
  phCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 10,
  },
  phHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  phTitle: { fontSize: 13, fontWeight: '700', color: ColorTokens.text },
  phVal: { fontSize: 13, fontWeight: '800', color: ColorTokens.successGreen },
  phBarBg: { height: 12, borderRadius: 6, backgroundColor: ColorTokens.lavender, position: 'relative', overflow: 'hidden' },
  phBarGradient: { flex: 1, backgroundColor: ColorTokens.softCoral },
  phPin: { position: 'absolute', top: 0, bottom: 0, width: 4, backgroundColor: ColorTokens.deepBerry, borderRadius: 2 },
  phNote: { fontSize: 11, color: ColorTokens.mutedText },
  pairingList: { gap: 10 },
  pairingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  pairingCardWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.softCoral,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(242, 127, 120, 0.3)',
    gap: 12,
  },
  pairTitle: { fontSize: 14, fontWeight: '800', color: ColorTokens.text },
  pairStatus: { fontSize: 12, fontWeight: '700', color: ColorTokens.successGreen, marginTop: 2 },
  pairStatusWarning: { fontSize: 12, fontWeight: '700', color: ColorTokens.deepBerry, marginTop: 2 },
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
