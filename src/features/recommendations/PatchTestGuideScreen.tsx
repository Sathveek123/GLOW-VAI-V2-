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
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
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

export interface PatchTestGuideScreenProps {
  onBack?: () => void;
  onConfirmRead?: () => void;
}

export const PatchTestGuideScreen: React.FC<PatchTestGuideScreenProps> = ({
  onBack,
  onConfirmRead,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const handleConfirmRead = () => {
    if (onConfirmRead) onConfirmRead();
    else router.push('/(customer)/recommendations/checkout' as any);
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
          <Text style={styles.headerTitle}>24-Hour Patch Test Guide</Text>
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
            <Clock size={14} color={ColorTokens.plum} />
            <Text style={styles.badgeText}>SAFETY FIRST</Text>
          </View>
          <Text style={styles.headline}>How to Perform a Patch Test</Text>
          <Text style={styles.subtext}>
            Before applying active formulas to your face, test a small amount on your inner arm or behind your ear.
          </Text>
        </View>

        {/* STEP BY STEP INSTRUCTIONS */}
        <Text style={styles.sectionTitle}>4 EASY STEPS</Text>
        <View style={styles.stepsList}>
          <View style={styles.stepCard}>
            <View style={styles.stepNumBg}>
              <Text style={styles.stepNum}>1</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Apply a pea-sized drop</Text>
              <Text style={styles.stepDesc}>Dab on clean skin on your inner forearm or lower jawline.</Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumBg}>
              <Text style={styles.stepNum}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Leave undisturbed for 24 Hours</Text>
              <Text style={styles.stepDesc}>Do not wash or apply other products over the test area.</Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumBg}>
              <Text style={styles.stepNum}>3</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Check for redness or itching</Text>
              <Text style={styles.stepDesc}>Look out for burning, swelling, or small bumps.</Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumBg}>
              <Text style={styles.stepNum}>4</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Safe to apply</Text>
              <Text style={styles.stepDesc}>If clean after 24h, integrate formula into your routine.</Text>
            </View>
          </View>
        </View>

        {/* REACTION ADVICE */}
        <View style={styles.reactionCard}>
          <AlertCircle size={18} color={ColorTokens.coral} />
          <Text style={styles.reactionText}>
            If itching or burning occurs, wash immediately with cool water and discontinue use.
          </Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY FOOTER */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleConfirmRead} activeOpacity={0.9}>
          <Text style={styles.primaryBtnText}>I Understand & Ready to Order →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PatchTestGuideScreen;

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
    backgroundColor: ColorTokens.lavender,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: ColorTokens.plum, letterSpacing: 1 },
  headline: { fontSize: 22, fontWeight: '800', color: ColorTokens.text, marginBottom: 6 },
  subtext: { fontSize: 13, color: ColorTokens.mutedText, lineHeight: 18 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: ColorTokens.mutedText, letterSpacing: 1, marginBottom: 10 },
  stepsList: { gap: 10, marginBottom: 16 },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  stepNumBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ColorTokens.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { fontSize: 14, fontWeight: '800', color: ColorTokens.deepBerry },
  stepTitle: { fontSize: 14, fontWeight: '800', color: ColorTokens.text },
  stepDesc: { fontSize: 12, color: ColorTokens.mutedText, marginTop: 2 },
  reactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.softCoral,
    padding: 12,
    borderRadius: 14,
    gap: 8,
  },
  reactionText: { fontSize: 12, fontWeight: '600', color: ColorTokens.deepBerry, flex: 1 },
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
