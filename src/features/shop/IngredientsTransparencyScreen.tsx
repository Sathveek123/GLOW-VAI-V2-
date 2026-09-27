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
  Info,
  Droplet,
  Award,
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

export interface IngredientsTransparencyScreenProps {
  onBack?: () => void;
}

export const IngredientsTransparencyScreen: React.FC<IngredientsTransparencyScreenProps> = ({
  onBack,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const inciIngredients = [
    { name: 'Aqua (Purified Water)', purpose: 'Solvent Base', safety: 'Low Hazard (EWG 1)' },
    { name: 'Niacinamide (5%)', purpose: 'Skin Brightening & Pore Control', safety: 'Low Hazard (EWG 1)' },
    { name: 'Panthenol (Pro-Vitamin B5)', purpose: 'Deep Soothing Hydration', safety: 'Low Hazard (EWG 1)' },
    { name: 'Ceramide NP', purpose: 'Lipid Barrier Restoration', safety: 'Low Hazard (EWG 1)' },
    { name: 'Sodium Hyaluronate', purpose: 'Moisture Retention', safety: 'Low Hazard (EWG 1)' },
    { name: 'Phenoxyethanol', purpose: 'Safe Broad-Spectrum Preservative (<0.9%)', safety: 'Low Hazard (EWG 2)' },
  ];

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
          <Text style={styles.headerTitle}>INCI Transparency Report</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <ShieldCheck size={14} color={ColorTokens.successGreen} />
            <Text style={styles.badgeText}>100% TRANSPARENT INCI</Text>
          </View>
          <Text style={styles.headline}>Full Formula Breakdown</Text>
          <Text style={styles.subtext}>
            No hidden fragrance, no undisclosed fillers. Every ingredient is clinically vetted for dermatological safety.
          </Text>
        </View>

        {/* pH GAUGE */}
        <Text style={styles.sectionTitle}>FORMULA pH LEVEL</Text>
        <View style={styles.phCard}>
          <View style={styles.phHeader}>
            <Text style={styles.phTitle}>pH Level 5.2 (Skin Optimal)</Text>
            <Text style={styles.phVal}>Balanced</Text>
          </View>
          <View style={styles.phBarBg}>
            <View style={[styles.phBarFill, { width: '52%' }]} />
          </View>
          <Text style={styles.phNote}>Matches the natural acidity of healthy skin mantle (pH 4.7–5.5).</Text>
        </View>

        {/* INCI TABLE / LIST */}
        <Text style={styles.sectionTitle}>FULL INGREDIENTS LIST (INCI)</Text>
        <View style={styles.listCard}>
          {inciIngredients.map((item, idx) => (
            <View key={idx} style={styles.ingredientRow}>
              <View style={styles.checkCircle}>
                <CheckCircle2 size={16} color={ColorTokens.successGreen} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ingName}>{item.name}</Text>
                <Text style={styles.ingPurpose}>{item.purpose}</Text>
                <Text style={styles.ingSafety}>{item.safety}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY FOOTER */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.back()} activeOpacity={0.9}>
          <Text style={styles.primaryBtnText}>Back to Product →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default IngredientsTransparencyScreen;

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
    backgroundColor: ColorTokens.softCream,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ColorTokens.softGreen,
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
    gap: 8,
  },
  phHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  phTitle: { fontSize: 13, fontWeight: '700', color: ColorTokens.text },
  phVal: { fontSize: 13, fontWeight: '800', color: ColorTokens.successGreen },
  phBarBg: { height: 8, backgroundColor: ColorTokens.lavender, borderRadius: 4, overflow: 'hidden' },
  phBarFill: { height: '100%', backgroundColor: ColorTokens.deepBerry, borderRadius: 4 },
  phNote: { fontSize: 11, color: ColorTokens.mutedText },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 14,
  },
  ingredientRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkCircle: { marginTop: 2 },
  ingName: { fontSize: 14, fontWeight: '800', color: ColorTokens.text },
  ingPurpose: { fontSize: 12, color: ColorTokens.mutedText, marginTop: 2 },
  ingSafety: { fontSize: 11, fontWeight: '700', color: ColorTokens.successGreen, marginTop: 2 },
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
