import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Camera,
  Sun,
  Glasses,
  UserCheck,
  ShieldCheck,
  ImageIcon,
  Cpu,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
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

export interface ScanFailedScreenProps {
  onBack?: () => void;
  onRetake?: () => void;
  onChoosePhoto?: () => void;
}

export const ScanFailedScreen: React.FC<ScanFailedScreenProps> = ({
  onBack,
  onRetake,
  onChoosePhoto,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ reason?: string; details?: string }>();
  const isWebRuntime = params.reason === 'web_runtime_unsupported' || Platform.OS === 'web';
  const isModelUnavailable = params.reason === 'model_unavailable' || isWebRuntime;
  const isMissingImage = params.reason === 'missing_image';
  const diagnosticDetails = params.details;

  const handleRetake = () => {
    if (onRetake) onRetake();
    else router.push('/(customer)/scan/camera' as any);
  };

  const handleChoosePhoto = () => {
    if (onChoosePhoto) onChoosePhoto();
    else router.push('/(customer)/scan/gallery' as any);
  };

  const handleContinueBasicRoutine = () => {
    router.push('/(customer)/(tabs)/cart' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backCircle}
            onPress={onBack || (() => router.back())}
            activeOpacity={0.8}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.brandRow}>
            <Sparkles size={16} color="#FFD700" />
            <Text style={styles.headerTitle}>GlowVAI Scan</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.headerSubtitle}>BEAUTY · SMARTER · FASTER</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* MAIN ILLUSTRATION CARD */}
        <View style={styles.illustrationCard}>
          <View style={styles.illusCircleBg} />

          <View style={styles.iconCircleBg}>
            {isModelUnavailable ? (
              <Cpu size={36} color={ColorTokens.deepBerry} />
            ) : (
              <Camera size={36} color={ColorTokens.deepBerry} />
            )}
            <View style={styles.warningSpark}>
              <AlertCircle size={18} color={ColorTokens.coral} />
            </View>
          </View>
        </View>

        {/* HEADLINE & SUBTITLE */}
        {isWebRuntime ? (
          <>
            <Text style={styles.headline}>AI analysis is not available on web preview</Text>
            <Text style={styles.errorHeadline}>Native ONNX Engine Required</Text>
            <Text style={styles.subtitle}>
              Your photo was captured successfully, but full on-device ONNX skin analysis requires an iOS/Android native development build or APK.
            </Text>
          </>
        ) : isModelUnavailable ? (
          <>
            <Text style={styles.headline}>AI analysis is not available yet</Text>
            <Text style={styles.errorHeadline}>Engine Not Connected</Text>
            <Text style={styles.subtitle}>
              Your photo was captured successfully, but the analysis engine is not connected.
            </Text>
          </>
        ) : isMissingImage ? (
          <>
            <Text style={styles.headline}>Captured photo not found</Text>
            <Text style={styles.errorHeadline}>Photo Loading Error</Text>
            <Text style={styles.subtitle}>
              We couldn’t load the photo. Please capture it again or select an image from your gallery.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.headline}>Let’s try that again</Text>
            <Text style={styles.errorHeadline}>We couldn’t get a clear scan</Text>
            <Text style={styles.subtitle}>
              A few small changes will help us read your skin more clearly.
            </Text>
          </>
        )}

        {/* DIAGNOSTIC DETAILS BANNER FOR APP DOCTOR */}
        {diagnosticDetails && (
          <View style={styles.diagnosticCard}>
            <Text style={styles.diagnosticTitle}>DIAGNOSTIC DETAILS (App Doctor):</Text>
            <Text style={styles.diagnosticText}>{diagnosticDetails}</Text>
          </View>
        )}

        {/* QUALITY STATUS CARD */}
        <View style={styles.qualityCard}>
          <Text style={styles.qualityCardLabel}>Scan Status</Text>
          <View style={styles.qualityBadge}>
            <AlertCircle size={14} color={ColorTokens.deepBerry} />
            <Text style={styles.qualityBadgeText}>
              {isModelUnavailable
                ? 'Model Offline'
                : isMissingImage
                ? 'Missing Image'
                : 'Needs Improvement'}
            </Text>
          </View>
        </View>

        {/* ACTIONABLE CHECKLIST */}
        <Text style={styles.sectionTitle}>NEXT STEPS</Text>
        <View style={styles.checklistContainer}>
          {isModelUnavailable ? (
            <>
              <View style={styles.checkRow}>
                <View style={styles.coralIconBg}>
                  <Camera size={16} color={ColorTokens.deepBerry} />
                </View>
                <Text style={styles.checkRowText}>Try retaking scan photo</Text>
              </View>
              <View style={styles.checkRow}>
                <View style={styles.coralIconBg}>
                  <Sparkles size={16} color={ColorTokens.deepBerry} />
                </View>
                <Text style={styles.checkRowText}>Continue with basic skin routine</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.checkRow}>
                <View style={styles.coralIconBg}>
                  <Sun size={16} color={ColorTokens.deepBerry} />
                </View>
                <Text style={styles.checkRowText}>Move to brighter, even light</Text>
              </View>
              <View style={styles.checkRow}>
                <View style={styles.coralIconBg}>
                  <UserCheck size={16} color={ColorTokens.deepBerry} />
                </View>
                <Text style={styles.checkRowText}>Keep your face centered</Text>
              </View>
              <View style={styles.checkRow}>
                <View style={styles.coralIconBg}>
                  <Glasses size={16} color={ColorTokens.deepBerry} />
                </View>
                <Text style={styles.checkRowText}>Remove glasses or sunglasses</Text>
              </View>
              <View style={styles.checkRow}>
                <View style={styles.coralIconBg}>
                  <Camera size={16} color={ColorTokens.deepBerry} />
                </View>
                <Text style={styles.checkRowText}>Look directly at the camera</Text>
              </View>
            </>
          )}
        </View>

        {/* PRIVACY NOTE */}
        <View style={styles.privacyCard}>
          <ShieldCheck size={16} color={ColorTokens.plum} />
          <Text style={styles.privacyText}>
            Your photo is kept private and processed locally on your device.
          </Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTIONS */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleRetake}
          activeOpacity={0.9}
        >
          <Camera size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={isModelUnavailable ? handleContinueBasicRoutine : handleChoosePhoto}
          activeOpacity={0.8}
        >
          {isModelUnavailable ? (
            <Text style={styles.secondaryBtnText}>Continue with Basic Routine</Text>
          ) : (
            <>
              <ImageIcon size={16} color={ColorTokens.deepBerry} style={{ marginRight: 6 }} />
              <Text style={styles.secondaryBtnText}>Choose Another Photo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: ColorTokens.softCoral,
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 1.5,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 18,
  },
  illustrationCard: {
    backgroundColor: ColorTokens.softCream,
    borderRadius: 24,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  illusCircleBg: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: ColorTokens.softCoral,
    opacity: 0.4,
  },
  iconCircleBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  warningSpark: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: ColorTokens.softCoral,
    borderRadius: 12,
    padding: 2,
  },
  headline: {
    fontSize: 22,
    fontWeight: '800',
    color: ColorTokens.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  errorHeadline: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: ColorTokens.mutedText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  qualityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ColorTokens.softCoral,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(242, 127, 120, 0.3)',
  },
  qualityCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  qualityBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 10,
  },
  checklistContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
    marginBottom: 20,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coralIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ColorTokens.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkRowText: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorTokens.text,
  },
  diagnosticCard: {
    backgroundColor: ColorTokens.softCream,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  diagnosticTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  diagnosticText: {
    fontSize: 11,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
    color: ColorTokens.text,
    lineHeight: 16,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.lavender,
    padding: 12,
    borderRadius: 14,
    gap: 8,
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
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
});
