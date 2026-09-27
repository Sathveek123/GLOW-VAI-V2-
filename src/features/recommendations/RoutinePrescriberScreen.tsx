import React, { useState } from 'react';
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
  Moon,
  CheckCircle2,
  Clock,
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

export interface RoutinePrescriberScreenProps {
  onBack?: () => void;
  onCheckoutRoutine?: () => void;
}

export const RoutinePrescriberScreen: React.FC<RoutinePrescriberScreenProps> = ({
  onBack,
  onCheckoutRoutine,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'AM' | 'PM'>('AM');

  const handleCheckout = () => {
    if (onCheckoutRoutine) onCheckoutRoutine();
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
          <Text style={styles.headerTitle}>AM / PM Routine Prescriber</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* AM / PM SEGMENT TOGGLE */}
        <View style={styles.tabToggleRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'AM' && styles.tabBtnActive]}
            onPress={() => setActiveTab('AM')}
            activeOpacity={0.8}
          >
            <Sun size={16} color={activeTab === 'AM' ? '#FFFFFF' : ColorTokens.text} />
            <Text style={[styles.tabText, activeTab === 'AM' && styles.tabTextActive]}>
              MORNING (AM)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'PM' && styles.tabBtnActive]}
            onPress={() => setActiveTab('PM')}
            activeOpacity={0.8}
          >
            <Moon size={16} color={activeTab === 'PM' ? '#FFFFFF' : ColorTokens.text} />
            <Text style={[styles.tabText, activeTab === 'PM' && styles.tabTextActive]}>
              EVENING (PM)
            </Text>
          </TouchableOpacity>
        </View>

        {/* TIMELINE STEPS */}
        <Text style={styles.sectionTitle}>
          {activeTab === 'AM' ? 'MORNING ROUTINE TIMELINE' : 'EVENING REPAIR TIMELINE'}
        </Text>

        <View style={styles.timelineContainer}>
          {activeTab === 'AM' ? (
            <>
              <View style={styles.stepCard}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>01</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>Gentle Cleanser</Text>
                  <Text style={styles.stepDesc}>Massage 60s with lukewarm water. Rinse thoroughly.</Text>
                  <Text style={styles.stepNote}>⏱️ Wait 1 min before serum</Text>
                </View>
              </View>

              <View style={styles.stepCard}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>02</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>Niacinamide 10% Serum</Text>
                  <Text style={styles.stepDesc}>Pat 3–4 drops gently across T-zone and cheeks.</Text>
                  <Text style={styles.stepNote}>⏱️ Wait 2 min to absorb</Text>
                </View>
              </View>

              <View style={styles.stepCard}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>03</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>SPF 50+ Sunscreen Gel</Text>
                  <Text style={styles.stepDesc}>Apply 2 finger lengths generously as final step.</Text>
                  <Text style={styles.stepNote}>☀️ Reapply every 3 hours</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.stepCard}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>01</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>Double Cleanse Balm</Text>
                  <Text style={styles.stepDesc}>Remove sunscreen and urban pollutants completely.</Text>
                  <Text style={styles.stepNote}>⏱️ Rinse thoroughly</Text>
                </View>
              </View>

              <View style={styles.stepCard}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>02</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>Ceramide Night Repair Cream</Text>
                  <Text style={styles.stepDesc}>Seal moisture barrier for overnight cellular recovery.</Text>
                  <Text style={styles.stepNote}>🌙 Overnight action</Text>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY FOOTER */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleCheckout} activeOpacity={0.9}>
          <Text style={styles.primaryBtnText}>Proceed to Express Checkout →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RoutinePrescriberScreen;

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
  tabToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: ColorTokens.deepBerry,
  },
  tabText: { fontSize: 12, fontWeight: '700', color: ColorTokens.text },
  tabTextActive: { color: '#FFFFFF' },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: ColorTokens.mutedText, letterSpacing: 1, marginBottom: 12 },
  timelineContainer: { gap: 12 },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ColorTokens.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: { fontSize: 12, fontWeight: '800', color: ColorTokens.deepBerry },
  stepTitle: { fontSize: 15, fontWeight: '800', color: ColorTokens.text },
  stepDesc: { fontSize: 12, color: ColorTokens.mutedText, marginTop: 2, marginBottom: 6 },
  stepNote: { fontSize: 11, fontWeight: '700', color: ColorTokens.plum },
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
