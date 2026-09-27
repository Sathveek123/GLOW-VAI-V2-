import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  tealAccent: '#0D9488',
  tealBg: '#F0FDFA',
  successGreen: '#2D9D5F',
  softGreen: '#E6F4EA',
  rejectRed: '#DC2626',
  softRed: '#FEE2E2',
  mainText: '#1A1A1A',
  secondaryText: '#6B6B6B',
  border: '#EDEBE6',
};

export const AdminClaimsPortalScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const [pendingClaims, setPendingClaims] = useState([
    {
      id: 'CLM-89210',
      orderId: 'GV28491',
      customer: 'Ananya Sharma',
      product: 'GlowVAI Barrier Repair Serum',
      reason: 'Adverse Reaction (Breakout on Day 3)',
      amount: 699,
      photo: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'CLM-89211',
      orderId: 'GV28399',
      customer: 'Kavya T.',
      product: 'Minimalist Niacinamide 10%',
      reason: 'Transit Leakage / Damaged Bottle',
      amount: 599,
      photo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=80',
    },
  ]);

  const handleApprove = (claimId: string, amount: number) => {
    safeHapticImpact();
    setPendingClaims((prev) => prev.filter((c) => c.id !== claimId));
    Alert.alert('Claim Approved', `Claim #${claimId} approved! ₹${amount} refunded to customer wallet.`);
  };

  const handleReject = (claimId: string) => {
    safeHapticSelection();
    setPendingClaims((prev) => prev.filter((c) => c.id !== claimId));
    Alert.alert('Claim Rejected', `Claim #${claimId} rejected with clinical review notes sent to user.`);
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
              router.push('/(customer)/(tabs)' as any);
            }
          }}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Admin Dermatology Claims Portal</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* CLINICAL SUMMARY HERO */}
        <View style={styles.heroCard}>
          <Stethoscope size={24} color={ColorTokens.tealAccent} />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Beauty Protection Claims Queue</Text>
            <Text style={styles.heroSub}>
              Review uploaded photo evidence and medical descriptions for 14-day warranty refunds.
            </Text>
          </View>
        </View>

        {/* PENDING CLAIMS LIST */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Pending Review Queue ({pendingClaims.length})</Text>

          {pendingClaims.map((claim) => (
            <View key={claim.id} style={styles.claimCard}>
              <View style={styles.claimTopRow}>
                <View>
                  <Text style={styles.claimIdText}>{claim.id} · Order #{claim.orderId}</Text>
                  <Text style={styles.customerText}>{claim.customer}</Text>
                </View>
                <Text style={styles.amountText}>₹{claim.amount}</Text>
              </View>

              <Text style={styles.productText}>Product: {claim.product}</Text>
              <Text style={styles.reasonText}>Reason: {claim.reason}</Text>

              {/* PHOTO EVIDENCE LIGHTBOX PREVIEW */}
              <View style={styles.photoContainer}>
                <Image source={{ uri: claim.photo }} style={styles.evidencePhoto} />
                <TouchableOpacity style={styles.lightboxBtn} activeOpacity={0.8}>
                  <Eye size={12} color="#FFFFFF" />
                  <Text style={styles.lightboxText}>View Full Photo</Text>
                </TouchableOpacity>
              </View>

              {/* ACTION BUTTONS */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => handleApprove(claim.id, claim.amount)}
                  activeOpacity={0.85}
                >
                  <CheckCircle2 size={14} color="#FFFFFF" />
                  <Text style={styles.approveBtnText}>APPROVE REFUND</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => handleReject(claim.id)}
                  activeOpacity={0.85}
                >
                  <XCircle size={14} color={ColorTokens.rejectRed} />
                  <Text style={styles.rejectBtnText}>REJECT</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {pendingClaims.length === 0 && (
            <View style={styles.emptyWrap}>
              <CheckCircle2 size={36} color={ColorTokens.successGreen} />
              <Text style={styles.emptyText}>All Beauty Protection claims reviewed!</Text>
            </View>
          )}
        </View>

        <View style={{ height: 90 + insets.bottom }} />
      </ScrollView>
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
    fontSize: 15,
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  heroCard: {
    backgroundColor: ColorTokens.tealBg,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  heroTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#0F766E',
  },
  heroSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  sectionHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  claimCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 8,
  },
  claimTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  claimIdText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  customerText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: ColorTokens.secondaryText,
  },
  amountText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: ColorTokens.successGreen,
  },
  productText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.mainText,
  },
  reasonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.deepBerry,
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  evidencePhoto: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  lightboxBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lightboxText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  approveBtn: {
    flex: 1,
    backgroundColor: ColorTokens.successGreen,
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  approveBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  rejectBtn: {
    backgroundColor: ColorTokens.softRed,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  rejectBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: ColorTokens.rejectRed,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.successGreen,
  },
});
