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
  Droplets,
  CheckCircle2,
  Info,
  ShieldCheck,
  Zap,
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

export interface HydrationSebumDetailScreenProps {
  onBack?: () => void;
  onViewRoutine?: () => void;
}

export const HydrationSebumDetailScreen: React.FC<HydrationSebumDetailScreenProps> = ({
  onBack,
  onViewRoutine,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const handleViewRoutine = () => {
    if (onViewRoutine) onViewRoutine();
    else router.push('/(customer)/recommendations' as any);
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
          <Text style={styles.headerTitle}>Hydration & Sebum</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* HYDRATION HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Droplets size={14} color={ColorTokens.cobaltBlue} />
              <Text style={styles.badgeText}>OPTIMAL BALANCE</Text>
            </View>
            <Text style={styles.scoreText}>Hydration: 72%</Text>
          </View>

          <Text style={styles.headline}>Cellular Hydration Meter</Text>
          <Text style={styles.subtext}>
            Your moisture barrier is in strong health with balanced epidermal water levels.
          </Text>

          {/* DUAL GAUGE PROGRESS */}
          <View style={styles.gaugeSection}>
            {/* HYDRATION BAR */}
            <View style={styles.gaugeRow}>
              <View style={styles.gaugeHeader}>
                <Text style={styles.gaugeTitle}>Epidermal Moisture</Text>
                <Text style={styles.gaugeVal}>72% (High)</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: '72%', backgroundColor: ColorTokens.cobaltBlue }]} />
              </View>
            </View>

            {/* SEBUM BAR */}
            <View style={styles.gaugeRow}>
              <View style={styles.gaugeHeader}>
                <Text style={styles.gaugeTitle}>T-Zone Sebum Level</Text>
                <Text style={styles.gaugeVal}>45% (Moderate)</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: '45%', backgroundColor: ColorTokens.deepBerry }]} />
              </View>
            </View>
          </View>
        </View>

        {/* ZONE MAP BREAKDOWN */}
        <Text style={styles.sectionTitle}>ZONE MOISTURE MAP</Text>
        <View style={styles.zoneGrid}>
          <View style={styles.zoneCard}>
            <Text style={styles.zoneTitle}>Cheeks & Jaw</Text>
            <Text style={styles.zoneVal}>78% Hydrated</Text>
            <Text style={styles.zoneSub}>Normal to Supple</Text>
          </View>
          <View style={styles.zoneCard}>
            <Text style={styles.zoneTitle}>Forehead & Nose</Text>
            <Text style={styles.zoneVal}>65% Hydrated</Text>
            <Text style={styles.zoneSub}>Slight Oil Shine</Text>
          </View>
        </View>

        {/* RECOMMENDED HYDRATORS */}
        <Text style={styles.sectionTitle}>FORMULATION ADVICE</Text>
        <View style={styles.adviceCard}>
          <View style={styles.adviceRow}>
            <CheckCircle2 size={16} color={ColorTokens.successGreen} />
            <Text style={styles.adviceText}>Hyaluronic Acid (Multi-molecular) for deep water locking</Text>
          </View>
          <View style={styles.adviceRow}>
            <CheckCircle2 size={16} color={ColorTokens.successGreen} />
            <Text style={styles.adviceText}>Ceramides (Complex NP, AP, EOP) to reinforce moisture barrier</Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY FOOTER */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleViewRoutine} activeOpacity={0.9}>
          <Text style={styles.primaryBtnText}>View Hydrating Routine →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HydrationSebumDetailScreen;

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
  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ColorTokens.lavender,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: ColorTokens.plum },
  scoreText: { fontSize: 13, fontWeight: '700', color: ColorTokens.mutedText },
  headline: { fontSize: 22, fontWeight: '800', color: ColorTokens.text, marginBottom: 6 },
  subtext: { fontSize: 13, color: ColorTokens.mutedText, lineHeight: 18, marginBottom: 16 },
  gaugeSection: { gap: 12 },
  gaugeRow: { gap: 6 },
  gaugeHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  gaugeTitle: { fontSize: 12, fontWeight: '700', color: ColorTokens.text },
  gaugeVal: { fontSize: 12, fontWeight: '800', color: ColorTokens.plum },
  barBg: { height: 8, backgroundColor: ColorTokens.lavender, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: ColorTokens.mutedText, letterSpacing: 1, marginBottom: 10 },
  zoneGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  zoneCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  zoneTitle: { fontSize: 11, color: ColorTokens.mutedText, marginBottom: 4 },
  zoneVal: { fontSize: 16, fontWeight: '800', color: ColorTokens.text },
  zoneSub: { fontSize: 11, color: ColorTokens.successGreen, marginTop: 2, fontWeight: '600' },
  adviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  adviceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  adviceText: { fontSize: 13, fontWeight: '600', color: ColorTokens.text, flex: 1 },
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
