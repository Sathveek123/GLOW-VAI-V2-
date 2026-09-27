import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Stethoscope,
  Wallet,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact } from '../../utils/haptics';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  tealAccent: '#0D9488',
  statusBlue: '#1677E8',
  statusAmber: '#D97706',
  statusGreen: '#2D9D5F',
  softGreen: '#E6F4EA',
  mainText: '#1A1A1A',
  secondaryText: '#6B6B6B',
  border: '#EDEBE6',
  cardBg: '#FFFFFF',
};

export const ClaimStatusTrackerScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ claimId?: string }>();

  const claimId = params.claimId || 'CLM-89210';

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

        <Text style={styles.headerTitle}>Claim Tracker #{claimId}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* CLAIM ID & STATUS HEADER CARD */}
        <View style={styles.statusHeaderCard}>
          <View style={styles.statusHeaderTop}>
            <View>
              <Text style={styles.claimIdText}>Claim ID: {claimId}</Text>
              <Text style={styles.claimDate}>Submitted on 14 Sep 2026</Text>
            </View>
            <View style={styles.approvedBadge}>
              <CheckCircle2 size={12} color={ColorTokens.statusGreen} />
              <Text style={styles.approvedBadgeText}>APPROVED ✓</Text>
            </View>
          </View>

          <View style={styles.refundAmountBox}>
            <Wallet size={20} color={ColorTokens.statusGreen} />
            <View style={{ flex: 1 }}>
              <Text style={styles.refundAmountTitle}>Refund Approved: ₹699</Text>
              <Text style={styles.refundAmountSub}>Credited to GlowVAI Wallet Balance</Text>
            </View>
          </View>
        </View>

        {/* 4-STAGE AUDIT TIMELINE */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Audit Status Timeline</Text>

          <View style={styles.timelineRow}>
            <View style={styles.timelineIconCol}>
              <View style={styles.stepDoneDot}><CheckCircle2 size={12} color="#FFFFFF" /></View>
              <View style={styles.lineDone} />
            </View>
            <View style={styles.timelineTextCol}>
              <Text style={styles.stepTitleDone}>Claim Submitted</Text>
              <Text style={styles.stepTimeText}>14 Sep 2026 · 10:15 AM</Text>
            </View>
          </View>

          <View style={styles.timelineRow}>
            <View style={styles.timelineIconCol}>
              <View style={styles.stepDoneDot}><CheckCircle2 size={12} color="#FFFFFF" /></View>
              <View style={styles.lineDone} />
            </View>
            <View style={styles.timelineTextCol}>
              <Text style={styles.stepTitleDone}>Photo Evidence Verification</Text>
              <Text style={styles.stepTimeText}>14 Sep 2026 · 02:30 PM</Text>
            </View>
          </View>

          <View style={styles.timelineRow}>
            <View style={styles.timelineIconCol}>
              <View style={styles.stepDoneDot}><CheckCircle2 size={12} color="#FFFFFF" /></View>
              <View style={styles.lineDone} />
            </View>
            <View style={styles.timelineTextCol}>
              <Text style={styles.stepTitleDone}>Dermatology Operations Audit</Text>
              <Text style={styles.stepTimeText}>14 Sep 2026 · 05:45 PM</Text>
            </View>
          </View>

          <View style={styles.timelineRow}>
            <View style={styles.timelineIconCol}>
              <View style={styles.stepDoneDot}><CheckCircle2 size={12} color="#FFFFFF" /></View>
            </View>
            <View style={styles.timelineTextCol}>
              <Text style={styles.stepTitleDone}>Refund Processed to Wallet</Text>
              <Text style={styles.stepTimeText}>15 Sep 2026 · 09:00 AM</Text>
            </View>
          </View>
        </View>

        {/* DERMATOLOGIST REVIEW NOTES CARD */}
        <View style={styles.notesCard}>
          <View style={styles.notesHeader}>
            <Stethoscope size={18} color="#5C2A91" />
            <Text style={styles.notesTitle}>Clinical Audit Note</Text>
          </View>

          <Text style={styles.notesText}>
            "Reviewed photo evidence for Order #GV28491 (GlowVAI Barrier Repair Serum). Customer reported mild erythema & breakout on Day 3. Adverse reaction covered under 14-Day Beauty Protection Warranty. Full ₹699 refund approved."
          </Text>

          <Text style={styles.doctorSign}>— Dr. Ananya Sharma, Head of Clinical Operations</Text>
        </View>

        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTION */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(customer)/(tabs)')}
          activeOpacity={0.9}
        >
          <Text style={styles.actionBtnText}>Return to Catalog</Text>
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
  statusHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  statusHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  claimIdText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: ColorTokens.mainText,
  },
  claimDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
    marginTop: 2,
  },
  approvedBadge: {
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  approvedBadgeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: ColorTokens.statusGreen,
  },
  refundAmountBox: {
    backgroundColor: ColorTokens.softGreen,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#C8E8D5',
  },
  refundAmountTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.statusGreen,
  },
  refundAmountSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.mainText,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 4,
  },
  sectionHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
    marginBottom: 10,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineIconCol: {
    alignItems: 'center',
    marginRight: 12,
  },
  stepDoneDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ColorTokens.statusGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineDone: {
    width: 2,
    height: 28,
    backgroundColor: ColorTokens.statusGreen,
    marginVertical: 2,
  },
  timelineTextCol: {
    flex: 1,
    paddingBottom: 12,
  },
  stepTitleDone: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  stepTimeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
    marginTop: 1,
  },
  notesCard: {
    backgroundColor: '#F2ECFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2D1FC',
    gap: 8,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notesTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#5C2A91',
  },
  notesText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: ColorTokens.mainText,
    fontStyle: 'italic',
  },
  doctorSign: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#5C2A91',
    alignSelf: 'flex-end',
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
  actionBtn: {
    backgroundColor: ColorTokens.deepBerry,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
