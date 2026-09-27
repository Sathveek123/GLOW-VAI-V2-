import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography } from '../../design';
import { safeHapticImpact } from '../../utils/haptics';
import { syncUserOnboardingData } from '../../services/userSyncService';

interface LegalTermsModalProps {
  visible: boolean;
  onClose: () => void;
  onAcceptSuccess: () => void;
}

export const LegalTermsModal: React.FC<LegalTermsModalProps> = ({
  visible,
  onClose,
  onAcceptSuccess,
}) => {
  // Scroll & Checkbox State Machine
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [checkTerms, setCheckTerms] = useState(false);
  const [checkMedical, setCheckMedical] = useState(false);
  const [checkCamera, setCheckCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isAllChecked = checkTerms && checkMedical && checkCamera;
  const isCtaEnabled = hasScrolledToEnd && isAllChecked;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 24;
    if (isEndReached && !hasScrolledToEnd) {
      setHasScrolledToEnd(true);
    }
  };

  const handleAcceptAndProceed = async () => {
    if (!isCtaEnabled || isSubmitting) return;

    await safeHapticImpact();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await syncUserOnboardingData({
        consents: {
          termsAcceptedAt: new Date().toISOString(),
          privacyAcceptedAt: new Date().toISOString(),
          medicalDisclaimerAcceptedAt: new Date().toISOString(),
          cameraAndScanConsent: true,
        },
      });
      setIsSubmitting(false);
      onAcceptSuccess();
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Consent write failed due to network error. Please retry.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.rootContainer}>
        {/* Sticky Top Bar (Mode B Clean Light) */}
        <View style={styles.stickyHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={Colors.light.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms & Privacy</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Scrollable Document Body */}
        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
        >
          <Text style={styles.metaTimestamp}>Last Updated: September 2026 • India Jurisdiction</Text>

          {/* Highlighted Medical Disclaimer Callout Box */}
          <View style={styles.warningCalloutBox}>
            <MaterialCommunityIcons name="alert-decagram" size={24} color={Colors.status.warning} />
            <View style={styles.warningCalloutTextCol}>
              <Text style={styles.warningCalloutTitle}>Cosmetic Routine Guidance Only</Text>
              <Text style={styles.warningCalloutBody}>
                GlowVAI provides cosmetic surface analysis, not clinical medical diagnosis. For persistent, severe, or chronic skin conditions, consult a licensed dermatologist.
              </Text>
            </View>
          </View>

          {/* 1. Terms of Service */}
          <Text style={styles.sectionHeading}>1. Terms of Service</Text>
          <Text style={styles.bodyParagraph}>
            Welcome to GlowVAI V2. By using our application, AI skin diagnostic viewfinder, and quick-commerce delivery services, you agree to comply with these Terms of Service. Deliveries are fulfilled via hyper-local dark stores.
          </Text>

          {/* 2. Privacy Policy & DPDP Act Compliance */}
          <Text style={styles.sectionHeading}>2. Privacy Policy & DPDP Act 2023</Text>
          <Text style={styles.bodyParagraph}>
            Under the Digital Personal Data Protection (DPDP) Act 2023, you retain full ownership of your data. Facial scan data is processed in-memory for instant CNN inference and is never sold or rented to third-party ad networks.
          </Text>

          {/* 3. Camera & Biometric Data Handling */}
          <Text style={styles.sectionHeading}>3. Biometric & Camera Consent</Text>
          <Text style={styles.bodyParagraph}>
            You explicitly authorize GlowVAI to capture optical camera frames for real-time hydration, melanin, pore, and acne analysis. Scans are encrypted on-device.
          </Text>
        </ScrollView>

        {/* Granular Consent Checkboxes & Sticky Footer */}
        <View style={styles.stickyFooter}>
          {!hasScrolledToEnd && (
            <View style={styles.scrollNoticeBar}>
              <Ionicons name="arrow-down-circle-outline" size={14} color={Colors.light.textSecondary} />
              <Text style={styles.scrollNoticeText}>Please scroll to the end of the document to unlock consent</Text>
            </View>
          )}

          {errorMessage && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}

          {/* Checkbox 1: ToS & Privacy */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setCheckTerms(!checkTerms)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={checkTerms ? 'checkbox' : 'square-outline'}
              size={20}
              color={checkTerms ? Colors.light.primary : Colors.light.textSecondary}
            />
            <Text style={styles.checkboxLabel}>I agree to the Terms of Service and Privacy Policy</Text>
          </TouchableOpacity>

          {/* Checkbox 2: Medical Disclaimer */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setCheckMedical(!checkMedical)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={checkMedical ? 'checkbox' : 'square-outline'}
              size={20}
              color={checkMedical ? Colors.light.primary : Colors.light.textSecondary}
            />
            <Text style={styles.checkboxLabel}>I understand this is cosmetic analysis, not medical diagnosis</Text>
          </TouchableOpacity>

          {/* Checkbox 3: Camera & Scan Consent */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setCheckCamera(!checkCamera)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={checkCamera ? 'checkbox' : 'square-outline'}
              size={20}
              color={checkCamera ? Colors.light.primary : Colors.light.textSecondary}
            />
            <Text style={styles.checkboxLabel}>I consent to camera/photo processing for AI skin scans</Text>
          </TouchableOpacity>

          {/* Primary CTA */}
          <TouchableOpacity
            style={[
              styles.acceptBtn,
              !isCtaEnabled && styles.acceptBtnDisabled,
            ]}
            onPress={handleAcceptAndProceed}
            disabled={!isCtaEnabled || isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.acceptBtnText}>I Accept & Proceed</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LegalTermsModal;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  stickyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 14,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  headerTitle: {
    ...Typography.headingSm,
    fontSize: 17,
    color: Colors.light.textPrimary,
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 24,
  },
  metaTimestamp: {
    ...Typography.bodySm,
    color: Colors.light.textSecondary,
    marginBottom: 14,
  },
  warningCalloutBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: Colors.status.warning,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  warningCalloutTextCol: {
    flex: 1,
  },
  warningCalloutTitle: {
    ...Typography.headingSm,
    color: '#92400E',
    marginBottom: 2,
  },
  warningCalloutBody: {
    ...Typography.bodySm,
    color: '#B45309',
    lineHeight: 18,
  },
  sectionHeading: {
    ...Typography.headingSm,
    color: Colors.light.textPrimary,
    marginTop: 18,
    marginBottom: 6,
  },
  bodyParagraph: {
    ...Typography.bodyLg,
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  stickyFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: 8,
  },
  scrollNoticeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  scrollNoticeText: {
    ...Typography.bodySm,
    color: Colors.light.primary,
    fontSize: 11,
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.status.error,
  },
  errorBannerText: {
    ...Typography.bodySm,
    color: Colors.status.error,
    textAlign: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 3,
  },
  checkboxLabel: {
    ...Typography.bodySm,
    color: Colors.light.textPrimary,
    fontSize: 12,
    flex: 1,
  },
  acceptBtn: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  acceptBtnDisabled: {
    opacity: 0.4,
  },
  acceptBtnText: {
    ...Typography.labelMd,
    color: '#FFFFFF',
    fontSize: 15,
  },
});
