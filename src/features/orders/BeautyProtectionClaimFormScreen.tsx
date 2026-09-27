import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  ShieldCheck,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react-native';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  tealAccent: '#0D9488',
  tealBg: '#F0FDFA',
  coral: '#D4472C',
  mainText: '#1A1A1A',
  secondaryText: '#6B6B6B',
  border: '#EDEBE6',
  cardBg: '#FFFFFF',
  successGreen: '#2D9D5F',
  softGreen: '#E6F4EA',
};

export const BeautyProtectionClaimFormScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ orderId?: string }>();

  const orderId = params.orderId || 'GV28491';

  const [claimReason, setClaimReason] = useState('Adverse Skin Reaction');
  const [symptomsText, setSymptomsText] = useState('');
  const [batchNo, setBatchNo] = useState('LOT-2026-B812');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=300&q=80',
  ]);

  const claimReasons = [
    'Adverse Skin Reaction (Breakouts / Redness)',
    'Transit Damage / Broken Bottle',
    'Product Seal Tampered / Expired Batch',
    'Allergic Irritation / Burning Feeling',
  ];

  const handleAddPhoto = () => {
    safeHapticSelection();
    if (photos.length >= 3) {
      Alert.alert('Photo Limit Reached', 'You can upload up to 3 photo evidences per claim.');
      return;
    }
    setPhotos((prev) => [
      ...prev,
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=80',
    ]);
  };

  const handleSubmitClaim = () => {
    safeHapticImpact();
    Alert.alert(
      '✓ Claim Submitted',
      `Beauty Protection Claim for Order #${orderId} submitted! Our clinical team will review within 24 hours.`,
      [{ text: 'Track Claim Status', onPress: () => router.push('/orders/claim-tracker' as any) }]
    );
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

        <Text style={styles.headerTitle}>File Warranty Claim</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.tealBadge}>
            <ShieldCheck size={26} color={ColorTokens.tealAccent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Beauty Protection Coverage</Text>
            <Text style={styles.heroSub}>
              Order #{orderId} is covered by 100% money-back reaction warranty.
            </Text>
          </View>
        </View>

        {/* REASON SELECTOR */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>1. Select Claim Category</Text>

          {claimReasons.map((reason) => {
            const isSelected = claimReason === reason;
            return (
              <TouchableOpacity
                key={reason}
                style={[styles.reasonPill, isSelected && styles.reasonPillSelected]}
                onPress={() => {
                  safeHapticSelection();
                  setClaimReason(reason);
                }}
                activeOpacity={0.85}
              >
                <View style={[styles.radioDot, isSelected && styles.radioDotSelected]}>
                  {isSelected && <View style={styles.radioDotInner} />}
                </View>
                <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                  {reason}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* PHOTO EVIDENCE UPLOAD GRID */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>2. Photo Evidence (Up to 3 Photos)</Text>
          <Text style={styles.fieldSub}>Upload clear photos showing bottle batch or skin reaction.</Text>

          <View style={styles.photoGrid}>
            {photos.map((url, idx) => (
              <View key={idx} style={styles.photoThumbWrap}>
                <Image source={{ uri: url }} style={styles.photoThumb} />
                <View style={styles.photoCheckBadge}>
                  <CheckCircle2 size={12} color="#FFFFFF" />
                </View>
              </View>
            ))}

            {photos.length < 3 && (
              <TouchableOpacity style={styles.uploadBtn} onPress={handleAddPhoto} activeOpacity={0.8}>
                <Camera size={22} color={ColorTokens.tealAccent} />
                <Text style={styles.uploadText}>+ Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* SYMPTOMS TEXTAREA & BATCH NO */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>3. Clinical Details & Batch No.</Text>

          <Text style={styles.inputLabel}>Product Batch Number (Printed on Bottle)</Text>
          <TextInput
            style={styles.input}
            value={batchNo}
            onChangeText={setBatchNo}
            placeholder="e.g. LOT-2026-B812"
            placeholderTextColor="#A0A0A0"
          />

          <Text style={[styles.inputLabel, { marginTop: 12 }]}>Describe Symptoms / Damage</Text>
          <TextInput
            style={styles.textArea}
            value={symptomsText}
            onChangeText={setSymptomsText}
            placeholder="Please detail when reaction started, redness severity, or bottle leakage condition..."
            placeholderTextColor="#A0A0A0"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTION */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmitClaim}
          activeOpacity={0.9}
        >
          <Text style={styles.submitBtnText}>Submit Warranty Claim →</Text>
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
  tealBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
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
    gap: 10,
  },
  sectionHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.mainText,
  },
  fieldSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.secondaryText,
    marginTop: -4,
  },
  reasonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  reasonPillSelected: {
    backgroundColor: ColorTokens.tealBg,
    borderColor: ColorTokens.tealAccent,
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDotSelected: {
    borderColor: ColorTokens.tealAccent,
  },
  radioDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ColorTokens.tealAccent,
  },
  reasonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.secondaryText,
    flex: 1,
  },
  reasonTextSelected: {
    fontFamily: 'Poppins-Bold',
    color: '#0F766E',
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  photoThumbWrap: {
    width: 72,
    height: 72,
    borderRadius: 12,
    position: 'relative',
  },
  photoThumb: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  photoCheckBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: ColorTokens.tealAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBtn: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: ColorTokens.tealBg,
    borderWidth: 1.5,
    borderColor: ColorTokens.tealAccent,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  uploadText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 9,
    color: ColorTokens.tealAccent,
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: ColorTokens.mainText,
  },
  input: {
    height: 44,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    paddingHorizontal: 12,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  textArea: {
    height: 90,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    paddingHorizontal: 12,
    paddingTop: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: ColorTokens.mainText,
    textAlignVertical: 'top',
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
  submitBtn: {
    backgroundColor: ColorTokens.tealAccent,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
