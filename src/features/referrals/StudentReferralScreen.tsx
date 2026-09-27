import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Platform,
  Share,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../design';
import { safeHapticImpact } from '../../utils/haptics';
import { getCurrentUser } from '../../services/authService';
import { syncUserOnboardingData } from '../../services/userSyncService';

type VerificationStatus = 'UNSUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export const StudentReferralScreen: React.FC = () => {
  const router = useRouter();

  // Screen Mode: Submission vs Status View
  const [status, setStatus] = useState<VerificationStatus>('UNSUBMITTED');
  const [collegeName, setCollegeName] = useState('VIT Vellore');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [idImageUri, setIdImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState<string | null>(null);

  // Referral code for verified state
  const currentUser = getCurrentUser();
  const referralCode = currentUser?.uid ? `GLOW-${currentUser.uid.substring(0, 6).toUpperCase()}` : 'GLOW-STUDENT-2026';

  useEffect(() => {
    // Initial status check
    if (currentUser?.displayName?.includes('Verified')) {
      setStatus('VERIFIED');
    }
  }, []);

  const isValidEmail = collegeEmail.endsWith('.ac.in') || collegeEmail.endsWith('.edu');
  const isFormValid = collegeName.trim().length >= 3 && (!!idImageUri || isValidEmail);

  const handlePickIdImage = async () => {
    await safeHapticImpact();
    // Simulate image pick
    setIdImageUri('https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80');
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    await safeHapticImpact();
    setIsSubmitting(true);

    try {
      if (isValidEmail) {
        // Instant verification path via college email domain check
        await syncUserOnboardingData({
          name: currentUser?.displayName || 'Student Member',
        });
        setStatus('VERIFIED');
      } else {
        // ID card photo manual review path
        await syncUserOnboardingData({
          name: currentUser?.displayName || 'Student Member',
        });
        setStatus('PENDING');
      }
    } catch {
      setStatus('PENDING');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = async () => {
    await safeHapticImpact();
    try {
      await Share.share({
        message: `Join GlowVAI with my student referral code ${referralCode} to get FLAT ₹100 OFF your first clinical skincare order!`,
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(customer)/(tabs)');
            }
          }}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.dark.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Verification</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ========================================================================= */}
        {/* VIEW A: VERIFIED STATUS                                                   */}
        {/* ========================================================================= */}
        {status === 'VERIFIED' && (
          <View style={styles.statusViewContainer}>
            {/* Success Pill Badge */}
            <View style={styles.verifiedPill}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.status.success} />
              <Text style={styles.verifiedPillText}>Verified Student</Text>
            </View>

            {/* Referral Code Card */}
            <View style={styles.cardBox}>
              <Text style={styles.cardHeaderTitle}>Your Student Referral Code</Text>
              <Text style={styles.cardSubtext}>
                Share this code with fellow students — earn 50 GlowVAI Coins per friend's first order!
              </Text>

              <View style={styles.codeRow}>
                <Text style={styles.codeMonospace}>{referralCode}</Text>
                <TouchableOpacity style={styles.copyBtn} onPress={handleCopyCode} activeOpacity={0.7}>
                  <Ionicons name="copy-outline" size={18} color={Colors.dark.primary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.primaryShareBtn} onPress={handleCopyCode} activeOpacity={0.85}>
                <Ionicons name="share-social-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryShareBtnText}>Share Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* VIEW B: PENDING STATUS                                                    */}
        {/* ========================================================================= */}
        {status === 'PENDING' && (
          <View style={styles.statusViewContainer}>
            {/* Warning Pill Badge */}
            <View style={styles.pendingPill}>
              <Ionicons name="time-outline" size={16} color={Colors.status.warning} />
              <Text style={styles.pendingPillText}>Under Review</Text>
            </View>

            {/* 3-Node Timeline Card */}
            <View style={styles.cardBox}>
              <Text style={styles.cardHeaderTitle}>Verification Timeline</Text>

              <View style={styles.timelineRow}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.dark.primary} />
                <Text style={styles.timelineTextActive}>1. Submitted — {new Date().toLocaleDateString()}</Text>
              </View>
              <View style={styles.timelineDivider} />
              <View style={styles.timelineRow}>
                <Ionicons name="ellipse" size={14} color={Colors.status.warning} />
                <Text style={styles.timelineTextActive}>2. Under Review (Current)</Text>
              </View>
              <View style={styles.timelineDivider} />
              <View style={styles.timelineRow}>
                <Ionicons name="ellipse-outline" size={14} color={Colors.dark.border} />
                <Text style={styles.timelineTextInactive}>3. Decision</Text>
              </View>
            </View>

            <Text style={styles.reviewSubtext}>
              Student ID reviews typically take 24–48 hours. You will receive an alert once approved.
            </Text>
          </View>
        )}

        {/* ========================================================================= */}
        {/* VIEW C: FORM SUBMISSION (UNSUBMITTED / REJECTED)                          */}
        {/* ========================================================================= */}
        {(status === 'UNSUBMITTED' || status === 'REJECTED') && (
          <View style={styles.formContainer}>
            {/* Intro Context Card */}
            <View style={styles.introCard}>
              <Text style={styles.introCardText}>
                🎓 Verified students unlock exclusive discounts and earn referral coins
              </Text>
            </View>

            {status === 'REJECTED' && (
              <View style={styles.rejectedBanner}>
                <Ionicons name="alert-circle" size={16} color={Colors.status.error} />
                <Text style={styles.rejectedText}>
                  {rejectionNotes || 'ID photo was unreadable. Please retake a clear photo.'}
                </Text>
              </View>
            )}

            {/* College Name Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>COLLEGE / UNIVERSITY NAME</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. VIT Vellore"
                  placeholderTextColor="rgba(245, 247, 250, 0.4)"
                  value={collegeName}
                  onChangeText={setCollegeName}
                />
              </View>
            </View>

            {/* Dashed Border ID Upload Card */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>STUDENT ID CARD PHOTO</Text>
              <TouchableOpacity style={styles.uploadDashedCard} onPress={handlePickIdImage} activeOpacity={0.8}>
                {idImageUri ? (
                  <View style={styles.previewWrapper}>
                    <Image source={{ uri: idImageUri }} style={styles.previewImage} />
                    <TouchableOpacity onPress={handlePickIdImage} style={styles.retakePill}>
                      <Text style={styles.retakeText}>Retake Photo</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Ionicons name="camera-outline" size={32} color={Colors.dark.primary} />
                    <Text style={styles.uploadText}>Tap to upload Student ID</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Or Divider */}
            <Text style={styles.orDividerText}>── or ──</Text>

            {/* Instant Verification College Email */}
            <View style={styles.inputGroup}>
              <View style={styles.labelWithBadge}>
                <Text style={styles.inputLabel}>COLLEGE EMAIL (INSTANT VERIFY)</Text>
                {isValidEmail && (
                  <View style={styles.instantBadge}>
                    <Ionicons name="checkmark" size={12} color={Colors.status.success} />
                    <Text style={styles.instantBadgeText}>Instant</Text>
                  </View>
                )}
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  placeholder="priya@vitstudent.ac.in"
                  placeholderTextColor="rgba(245, 247, 250, 0.4)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={collegeEmail}
                  onChangeText={setCollegeEmail}
                />
              </View>
            </View>

            {/* Submit CTA */}
            <TouchableOpacity
              style={[styles.submitBtn, !isFormValid && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Submit for Verification</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentReferralScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  headerTitle: {
    ...Typography.headingSm,
    color: Colors.dark.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  statusViewContainer: {
    alignItems: 'center',
    gap: 16,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  verifiedPillText: {
    ...Typography.labelSm,
    color: Colors.status.success,
  },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  pendingPillText: {
    ...Typography.labelSm,
    color: Colors.status.warning,
  },
  cardBox: {
    width: '100%',
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 12,
  },
  cardHeaderTitle: {
    ...Typography.headingSm,
    color: Colors.dark.textPrimary,
  },
  cardSubtext: {
    ...Typography.bodySm,
    color: Colors.dark.textSecondary,
    lineHeight: 18,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  codeMonospace: {
    ...Typography.numericMono,
    fontSize: 18,
    color: Colors.dark.textPrimary,
    letterSpacing: 1.5,
  },
  copyBtn: {
    padding: 6,
  },
  primaryShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    backgroundColor: Colors.dark.primary,
    borderRadius: 14,
  },
  primaryShareBtnText: {
    ...Typography.labelMd,
    color: '#FFFFFF',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timelineTextActive: {
    ...Typography.bodySm,
    color: Colors.dark.textPrimary,
  },
  timelineTextInactive: {
    ...Typography.bodySm,
    color: Colors.dark.textSecondary,
  },
  timelineDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.dark.border,
    marginLeft: 7,
  },
  reviewSubtext: {
    ...Typography.bodySm,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    gap: 16,
  },
  introCard: {
    backgroundColor: Colors.dark.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  introCardText: {
    ...Typography.bodySm,
    color: Colors.dark.textPrimary,
    lineHeight: 18,
  },
  rejectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.status.error,
  },
  rejectedText: {
    ...Typography.bodySm,
    color: Colors.status.error,
    flex: 1,
  },
  inputGroup: {
    gap: 6,
  },
  labelWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLabel: {
    ...Typography.labelSm,
    color: Colors.dark.textSecondary,
  },
  instantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  instantBadgeText: {
    ...Typography.labelSm,
    color: Colors.status.success,
    fontSize: 10,
  },
  inputRow: {
    height: 52,
    backgroundColor: Colors.dark.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  textInput: {
    ...Typography.bodyLg,
    color: Colors.dark.textPrimary,
  },
  uploadDashedCard: {
    height: 160,
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.dark.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    ...Typography.bodySm,
    color: Colors.dark.textSecondary,
  },
  previewWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  retakePill: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  retakeText: {
    ...Typography.labelSm,
    color: '#FFFFFF',
    fontSize: 11,
  },
  orDividerText: {
    ...Typography.bodySm,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  submitBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitBtnText: {
    ...Typography.labelMd,
    color: '#FFFFFF',
    fontSize: 15,
  },
});
