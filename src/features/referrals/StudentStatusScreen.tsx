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
  GraduationCap,
  Clock,
  CheckCircle2,
  Gift,
  ChevronRight,
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

export interface StudentStatusScreenProps {
  onBack?: () => void;
  status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export const StudentStatusScreen: React.FC<StudentStatusScreenProps> = ({
  onBack,
  status = 'VERIFIED',
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [currentStatus] = useState<'PENDING' | 'VERIFIED' | 'REJECTED'>(status);

  const isVerified = currentStatus === 'VERIFIED';

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
          <Text style={styles.headerTitle}>Student Audit Status</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        {/* STATUS BANNER CARD */}
        <View style={[styles.statusCard, isVerified ? styles.statusCardVerified : styles.statusCardPending]}>
          <View style={[styles.statusIconCircle, isVerified ? styles.statusIconVerified : styles.statusIconPending]}>
            {isVerified ? (
              <CheckCircle2 size={36} color={ColorTokens.successGreen} />
            ) : (
              <Clock size={36} color={ColorTokens.cobaltBlue} />
            )}
          </View>
          <Text style={styles.statusBadgeText}>
            {isVerified ? 'STUDENT STATUS: VERIFIED ✓' : 'VERIFICATION IN REVIEW (SLA: 24 hrs)'}
          </Text>
          <Text style={styles.statusHeadline}>
            {isVerified
              ? 'Congratulations! Student discount unlocked.'
              : 'Your student ID is being audited by our verification team.'}
          </Text>
          <Text style={styles.statusSub}>
            {isVerified
              ? 'You get 15% OFF on all GlowVAI orders + double coins on student referral invites.'
              : 'Our team verifies your document against your college domain. You will receive an SMS alert once approved.'}
          </Text>
        </View>

        {/* PERKS LIST */}
        <Text style={styles.sectionTitle}>UNLOCKED STUDENT PERKS</Text>

        <View style={styles.perkRow}>
          <View style={styles.perkIconBg}>
            <Gift size={20} color={ColorTokens.deepBerry} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.perkTitle}>₹50 Welcome Reward Coins</Text>
            <Text style={styles.perkSub}>Added directly to your GlowVAI Wallet upon verification</Text>
          </View>
        </View>

        <View style={styles.perkRow}>
          <View style={styles.perkIconBg}>
            <GraduationCap size={20} color={ColorTokens.plum} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.perkTitle}>15% Flat Student Discount</Text>
            <Text style={styles.perkSub}>Automatically applied at checkout on all skincare orders</Text>
          </View>
        </View>

        <View style={styles.privacyCard}>
          <ShieldCheck size={16} color={ColorTokens.plum} />
          <Text style={styles.privacyText}>
            Your verified student profile is active for the 2026-2027 academic year.
          </Text>
        </View>
      </ScrollView>

      {/* STICKY BOTTOM PRIMARY CTA */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => router.push('/(customer)/(tabs)' as any)}
          activeOpacity={0.9}
        >
          <Text style={styles.continueBtnText}>Explore Products →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StudentStatusScreen;

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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  statusCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  statusCardVerified: {
    backgroundColor: ColorTokens.softGreen,
    borderColor: 'rgba(21, 148, 71, 0.3)',
  },
  statusCardPending: {
    backgroundColor: ColorTokens.lavender,
    borderColor: 'rgba(92, 42, 145, 0.2)',
  },
  statusIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statusIconVerified: {
    backgroundColor: '#FFFFFF',
  },
  statusIconPending: {
    backgroundColor: '#FFFFFF',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: ColorTokens.deepBerry,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  statusHeadline: {
    fontSize: 18,
    fontWeight: '800',
    color: ColorTokens.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  statusSub: {
    fontSize: 13,
    color: ColorTokens.mutedText,
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 12,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  perkIconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ColorTokens.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  perkSub: {
    fontSize: 11,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.lavender,
    padding: 12,
    borderRadius: 14,
    gap: 8,
    marginTop: 8,
  },
  privacyText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorTokens.plum,
    flex: 1,
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
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
