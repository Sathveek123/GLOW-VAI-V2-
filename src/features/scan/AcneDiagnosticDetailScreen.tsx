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
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Info,
  Flame,
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

export interface AcneDiagnosticDetailScreenProps {
  onBack?: () => void;
  onViewRoutine?: () => void;
}

export const AcneDiagnosticDetailScreen: React.FC<AcneDiagnosticDetailScreenProps> = ({
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
          <Text style={styles.headerTitle}>Acne & Lesion Detail</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* SEVERITY GRADE CARD */}
        <View style={styles.severityCard}>
          <View style={styles.gradeHeaderRow}>
            <View style={styles.gradeBadge}>
              <Flame size={14} color={ColorTokens.deepBerry} />
              <Text style={styles.gradeBadgeText}>GRADE 1 · MILD</Text>
            </View>
            <Text style={styles.scoreText}>Score: 28/100</Text>
          </View>

          <Text style={styles.headline}>Mild Comedonal Breakouts</Text>
          <Text style={styles.subtext}>
            Scans show minor pore congestion primarily in the T-zone with minimal active inflammatory papules.
          </Text>

          {/* 4-LEVEL SEVERITY BAR */}
          <View style={styles.severityScaleContainer}>
            <Text style={styles.scaleLabel}>SEVERITY SCALE (GRADE 0–3)</Text>
            <View style={styles.scaleTrack}>
              <View style={[styles.scaleSegment, styles.segmentClear]}>
                <Text style={styles.segmentText}>0 Clear</Text>
              </View>
              <View style={[styles.scaleSegment, styles.segmentActive]}>
                <Text style={styles.segmentTextActive}>1 Mild</Text>
              </View>
              <View style={[styles.scaleSegment, styles.segmentModerate]}>
                <Text style={styles.segmentText}>2 Mod</Text>
              </View>
              <View style={[styles.scaleSegment, styles.segmentSevere]}>
                <Text style={styles.segmentText}>3 Severe</Text>
              </View>
            </View>
          </View>
        </View>

        {/* BREAKDOWN METRICS */}
        <Text style={styles.sectionTitle}>LESION BREAKDOWN</Text>
        <View style={styles.breakdownGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Blackheads / Whiteheads</Text>
            <Text style={styles.metricValue}>12 Detected</Text>
            <Text style={styles.metricSub}>Comedonal Type</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Active Papules</Text>
            <Text style={styles.metricValue}>3 Detected</Text>
            <Text style={styles.metricSub}>Mild Surface Inflamation</Text>
          </View>
        </View>

        {/* TARGETED INGREDIENTS */}
        <Text style={styles.sectionTitle}>RECOMMENDED TARGET INGREDIENTS</Text>
        <View style={styles.ingredientsCard}>
          <View style={styles.ingRow}>
            <CheckCircle2 size={16} color={ColorTokens.successGreen} />
            <Text style={styles.ingText}>Salicylic Acid (BHA 2%) — Unclogs pores & dissolves sebum</Text>
          </View>
          <View style={styles.ingRow}>
            <CheckCircle2 size={16} color={ColorTokens.successGreen} />
            <Text style={styles.ingText}>Niacinamide (5%) — Soothes redness & controls excess oil</Text>
          </View>
          <View style={styles.ingRow}>
            <CheckCircle2 size={16} color={ColorTokens.successGreen} />
            <Text style={styles.ingText}>Zinc PCA — Regulates bacterial activity</Text>
          </View>
        </View>

        {/* DISCLAIMER */}
        <View style={styles.disclaimerCard}>
          <Info size={16} color={ColorTokens.plum} />
          <Text style={styles.disclaimerText}>
            Cosmetic rating only. For cystic or painful acne, consult a certified dermatologist.
          </Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY FOOTER */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleViewRoutine} activeOpacity={0.9}>
          <Text style={styles.primaryBtnText}>View Anti-Acne Routine →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AcneDiagnosticDetailScreen;

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
  severityCard: {
    backgroundColor: ColorTokens.softCream,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  gradeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ColorTokens.softCoral,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  gradeBadgeText: { fontSize: 11, fontWeight: '800', color: ColorTokens.deepBerry },
  scoreText: { fontSize: 13, fontWeight: '700', color: ColorTokens.mutedText },
  headline: { fontSize: 22, fontWeight: '800', color: ColorTokens.text, marginBottom: 6 },
  subtext: { fontSize: 13, color: ColorTokens.mutedText, lineHeight: 18, marginBottom: 16 },
  severityScaleContainer: { marginTop: 4 },
  scaleLabel: { fontSize: 10, fontWeight: '800', color: ColorTokens.mutedText, letterSpacing: 1, marginBottom: 8 },
  scaleTrack: { flexDirection: 'row', gap: 6 },
  scaleSegment: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorTokens.lavender,
  },
  segmentClear: { backgroundColor: ColorTokens.softGreen },
  segmentActive: { backgroundColor: ColorTokens.deepBerry },
  segmentModerate: { backgroundColor: ColorTokens.softCoral },
  segmentSevere: { backgroundColor: ColorTokens.coral },
  segmentText: { fontSize: 11, fontWeight: '700', color: ColorTokens.text },
  segmentTextActive: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: ColorTokens.mutedText, letterSpacing: 1, marginBottom: 10 },
  breakdownGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  metricLabel: { fontSize: 11, color: ColorTokens.mutedText, marginBottom: 4 },
  metricValue: { fontSize: 18, fontWeight: '800', color: ColorTokens.text },
  metricSub: { fontSize: 11, color: ColorTokens.plum, marginTop: 2, fontWeight: '600' },
  ingredientsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  ingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ingText: { fontSize: 13, fontWeight: '600', color: ColorTokens.text, flex: 1 },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.lavender,
    padding: 12,
    borderRadius: 14,
    gap: 8,
  },
  disclaimerText: { fontSize: 12, fontWeight: '600', color: ColorTokens.plum, flex: 1 },
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
