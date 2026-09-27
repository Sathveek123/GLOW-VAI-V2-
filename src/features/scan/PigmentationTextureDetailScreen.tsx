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
  Sun,
  Grid,
  CheckCircle2,
  ShieldCheck,
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

export interface PigmentationTextureDetailScreenProps {
  onBack?: () => void;
  onViewRoutine?: () => void;
}

export const PigmentationTextureDetailScreen: React.FC<PigmentationTextureDetailScreenProps> = ({
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
          <Text style={styles.headerTitle}>Pigmentation & Texture</Text>
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
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Grid size={14} color={ColorTokens.deepBerry} />
              <Text style={styles.badgeText}>TEXTURE SCORE 88/100</Text>
            </View>
            <Text style={styles.scoreText}>Melanin: Even</Text>
          </View>

          <Text style={styles.headline}>Topography & Melanin Index</Text>
          <Text style={styles.subtext}>
            Smooth skin surface topography with mild post-inflammatory hyperpigmentation spots around cheekbones.
          </Text>

          {/* PROGRESS METRICS */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricTitle}>Texture Smoothness</Text>
                <Text style={styles.metricVal}>88 / 100 (Optimal)</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: '88%', backgroundColor: ColorTokens.successGreen }]} />
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricTitle}>UV Dark Spot Index</Text>
                <Text style={styles.metricVal}>18 / 100 (Low)</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: '18%', backgroundColor: ColorTokens.deepBerry }]} />
              </View>
            </View>
          </View>
        </View>

        {/* BRIGHTENING AGENTS */}
        <Text style={styles.sectionTitle}>BRIGHTENING & SMOOTHING ACTIVES</Text>
        <View style={styles.activesCard}>
          <View style={styles.activeRow}>
            <CheckCircle2 size={16} color={ColorTokens.successGreen} />
            <Text style={styles.activeText}>Alpha Arbutin (2%) — Targets sun spots & melanin buildup</Text>
          </View>
          <View style={styles.activeRow}>
            <CheckCircle2 size={16} color={ColorTokens.successGreen} />
            <Text style={styles.activeText}>Vitamin C (15% L-Ascorbic Acid) — Antioxidant shield</Text>
          </View>
          <View style={styles.activeRow}>
            <CheckCircle2 size={16} color={ColorTokens.successGreen} />
            <Text style={styles.activeText}>Broad Spectrum Sunscreen SPF 50+ PA++++</Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY FOOTER */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleViewRoutine} activeOpacity={0.9}>
          <Text style={styles.primaryBtnText}>View Brightening Routine →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PigmentationTextureDetailScreen;

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
    backgroundColor: ColorTokens.softCoral,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: ColorTokens.deepBerry },
  scoreText: { fontSize: 13, fontWeight: '700', color: ColorTokens.mutedText },
  headline: { fontSize: 22, fontWeight: '800', color: ColorTokens.text, marginBottom: 6 },
  subtext: { fontSize: 13, color: ColorTokens.mutedText, lineHeight: 18, marginBottom: 16 },
  metricsContainer: { gap: 12 },
  metricRow: { gap: 6 },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  metricTitle: { fontSize: 12, fontWeight: '700', color: ColorTokens.text },
  metricVal: { fontSize: 12, fontWeight: '800', color: ColorTokens.plum },
  barBg: { height: 8, backgroundColor: ColorTokens.lavender, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: ColorTokens.mutedText, letterSpacing: 1, marginBottom: 10 },
  activesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  activeText: { fontSize: 13, fontWeight: '600', color: ColorTokens.text, flex: 1 },
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
