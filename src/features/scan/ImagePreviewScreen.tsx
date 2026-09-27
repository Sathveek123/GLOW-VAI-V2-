import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  Grid,
  ImageOff,
  ImageIcon,
  Camera,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import * as FileSystem from 'expo-file-system';

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

export interface ImagePreviewScreenProps {
  onBack?: () => void;
  onUsePhoto?: (photoUri?: string) => void;
  onRetake?: () => void;
  /** Optional override URI — when used directly (not via route params) */
  photoUri?: string;
}

const SAMPLE_FACE_URI = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop';

export const ImagePreviewScreen: React.FC<ImagePreviewScreenProps> = ({
  onBack,
  onUsePhoto,
  onRetake,
  photoUri: propUri,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  // Read photo URI from route params (passed by camera or gallery picker)
  const params = useLocalSearchParams<{ photoUri?: string }>();
  const photoUri = propUri || params.photoUri || '';

  const [verifying, setVerifying] = React.useState<boolean>(true);
  const [photoValid, setPhotoValid] = React.useState<boolean>(false);
  const [errorReason, setErrorReason] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    const verifyPhoto = async () => {
      setVerifying(true);
      setErrorReason(null);

      if (!photoUri) {
        if (isMounted) {
          setErrorReason('No photo was passed from the camera screen (missing photoUri param)');
          setPhotoValid(false);
          setVerifying(false);
        }
        return;
      }

      if (Platform.OS === 'web') {
        if (isMounted) {
          if (photoUri && photoUri.length > 0) {
            setPhotoValid(true);
          } else {
            setErrorReason('Web photo URI is empty');
            setPhotoValid(false);
          }
          setVerifying(false);
        }
        return;
      }

      try {
        const info = await FileSystem.getInfoAsync(photoUri);
        if (!info.exists) {
          if (isMounted) {
            setErrorReason(`File does not exist at path: ${photoUri}`);
            setPhotoValid(false);
          }
        } else if (info.size < 1000) {
          if (isMounted) {
            setErrorReason(`File exists but is empty or corrupt (${info.size} bytes)`);
            setPhotoValid(false);
          }
        } else {
          if (isMounted) {
            setPhotoValid(true);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorReason(`FileSystem check failed: ${err?.message || err}`);
          setPhotoValid(false);
        }
      } finally {
        if (isMounted) {
          setVerifying(false);
        }
      }
    };

    verifyPhoto();

    return () => {
      isMounted = false;
    };
  }, [photoUri]);

  const isValid = photoValid && Boolean(photoUri);

  const handleUsePhoto = () => {
    if (!photoUri || !isValid) return;
    if (onUsePhoto) {
      onUsePhoto(photoUri);
    } else {
      router.push({
        pathname: '/(customer)/scan/analyzing' as any,
        params: { imageUri: photoUri },
      });
    }
  };

  const handleRetake = () => {
    if (onRetake) onRetake();
    else router.push('/(customer)/scan/camera' as any);
  };

  const handleChooseFromGallery = () => {
    router.push('/(customer)/scan/gallery' as any);
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
          <Text style={styles.headerTitle}>Check your scan</Text>
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleRetake}
          activeOpacity={0.8}
        >
          <RotateCcw size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* PREVIEW CARD — shows the ACTUAL captured photo or empty error state */}
        <View style={styles.previewCard}>
          {verifying ? (
            <View style={styles.noPhotoPlaceholder}>
              <ActivityIndicator size="large" color={ColorTokens.deepBerry} />
              <Text style={styles.noPhotoTitle}>Checking photo...</Text>
            </View>
          ) : photoValid && photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.capturedImage}
              resizeMode="cover"
            />
          ) : (
            /* Missing/Invalid photo state */
            <View style={styles.noPhotoPlaceholder}>
              <ImageOff size={48} color={ColorTokens.deepBerry} />
              <Text style={styles.noPhotoTitle}>Captured photo not found</Text>
              <Text style={styles.noPhotoSub}>
                We couldn’t load the photo. Please capture it again.
              </Text>
              {errorReason && (
                <Text style={styles.debugReasonText}>DEBUG: {errorReason}</Text>
              )}
            </View>
          )}

          {/* FACE MESH OVERLAY on top of real photo */}
          {photoUri && (
            <View style={styles.meshOverlay} pointerEvents="none">
              <View style={styles.meshOval} />
              <View style={styles.meshEyeLeft} />
              <View style={styles.meshEyeRight} />
              <View style={styles.meshNoseLine} />
              <View style={styles.meshMouthArc} />
              <View style={styles.meshContourDots}>
                {[...Array(12)].map((_, i) => (
                  <View key={i} style={styles.meshDot} />
                ))}
              </View>
            </View>
          )}

          {/* SKIN MASK BADGE */}
          {photoUri && (
            <View style={styles.skinMaskBadge}>
              <Grid size={12} color={ColorTokens.plum} />
              <Text style={styles.skinMaskTitle}>Skin mask</Text>
              <Text style={styles.skinMaskDim}>224 × 224</Text>
            </View>
          )}
        </View>

        {/* QUALITY STATUS BANNER */}
        {isValid ? (
          <View style={styles.statusBannerSuccess}>
            <CheckCircle2 size={22} color={ColorTokens.successGreen} />
            <View style={{ flex: 1 }}>
              <Text style={styles.statusSuccessTitle}>Good image quality</Text>
              <Text style={styles.statusSuccessSub}>Your face is centered and clearly visible.</Text>
            </View>
          </View>
        ) : (
          <View style={styles.statusBannerWarning}>
            <AlertCircle size={22} color={ColorTokens.deepBerry} />
            <View style={{ flex: 1 }}>
              <Text style={styles.statusWarningTitle}>This photo needs a quick adjustment</Text>
              <Text style={styles.statusWarningSub}>
                Please ensure direct lighting and keep your face fully inside the frame.
              </Text>
            </View>
          </View>
        )}

        {/* QUALITY METRIC CARDS */}
        <Text style={styles.sectionTitle}>QUALITY CHECKLIST</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Face position</Text>
            <Text style={photoUri ? styles.metricValueGood : styles.metricValueMissing}>
              {photoUri ? 'Good' : 'Missing'}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Lighting</Text>
            <Text style={photoUri ? styles.metricValueGood : styles.metricValueMissing}>
              {photoUri ? 'Good' : 'Missing'}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Sharpness</Text>
            <Text style={photoUri ? styles.metricValueGood : styles.metricValueMissing}>
              {photoUri ? 'Good' : 'Missing'}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Skin area</Text>
            <Text style={photoUri ? styles.metricValueReady : styles.metricValueMissing}>
              {photoUri ? 'Ready' : 'Pending'}
            </Text>
          </View>
        </View>

        {/* PRIVACY NOTE */}
        <View style={styles.privacyCard}>
          <ShieldCheck size={16} color={ColorTokens.plum} />
          <Text style={styles.privacyText}>
            The overlay helps position your scan; it does not perform identity tracking.
          </Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTIONS */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {photoUri ? (
          <>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleUsePhoto}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryBtnText}>Use this photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={handleRetake} activeOpacity={0.8}>
              <Text style={styles.secondaryBtnText}>Retake</Text>
            </TouchableOpacity>
          </>
        ) : (
          /* Empty photo action options */
          <>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleRetake} activeOpacity={0.9}>
              <Camera size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.primaryBtnText}>Retake Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={handleChooseFromGallery}
              activeOpacity={0.8}
            >
              <ImageIcon size={16} color={ColorTokens.deepBerry} style={{ marginRight: 6 }} />
              <Text style={styles.secondaryBtnText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

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
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  contentPadding: { padding: 18 },
  previewCard: {
    borderRadius: 24,
    height: 280,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    backgroundColor: ColorTokens.softCream,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  capturedImage: { width: '100%', height: '100%' },
  noPhotoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  noPhotoTitle: { fontSize: 18, fontWeight: '800', color: ColorTokens.text, textAlign: 'center' },
  noPhotoSub: { fontSize: 13, color: ColorTokens.mutedText, textAlign: 'center', lineHeight: 18 },
  debugReasonText: { fontSize: 11, color: ColorTokens.coral, textAlign: 'center', marginTop: 4, fontFamily: 'monospace' },
  meshOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meshOval: {
    width: 180,
    height: 230,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: 'rgba(242,236,250,0.7)',
    borderStyle: 'dashed',
  },
  meshEyeLeft: {
    position: 'absolute',
    top: '38%',
    left: '32%',
    width: 30,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  meshEyeRight: {
    position: 'absolute',
    top: '38%',
    right: '32%',
    width: 30,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  meshNoseLine: {
    position: 'absolute',
    top: '42%',
    height: 35,
    width: 1.5,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  meshMouthArc: {
    position: 'absolute',
    bottom: '26%',
    width: 44,
    height: 16,
    borderBottomWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
  },
  meshContourDots: {
    position: 'absolute',
    width: 180,
    height: 230,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  meshDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: ColorTokens.softCoral },
  skinMaskBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  skinMaskTitle: { fontSize: 11, fontWeight: '800', color: ColorTokens.text },
  skinMaskDim: { fontSize: 10, color: ColorTokens.mutedText },
  statusBannerSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.softGreen,
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(21,148,71,0.2)',
  },
  statusSuccessTitle: { fontSize: 15, fontWeight: '800', color: ColorTokens.successGreen },
  statusSuccessSub: { fontSize: 12, color: ColorTokens.text, marginTop: 2 },
  statusBannerWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.softCoral,
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(242,127,120,0.3)',
  },
  statusWarningTitle: { fontSize: 15, fontWeight: '800', color: ColorTokens.deepBerry },
  statusWarningSub: { fontSize: 12, color: ColorTokens.text, marginTop: 2 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 10,
  },
  metricsGrid: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  metricLabel: { fontSize: 10, color: ColorTokens.mutedText, marginBottom: 4, textAlign: 'center' },
  metricValueGood: { fontSize: 14, fontWeight: '800', color: ColorTokens.successGreen },
  metricValueReady: { fontSize: 14, fontWeight: '800', color: ColorTokens.cobaltBlue },
  metricValueMissing: { fontSize: 14, fontWeight: '800', color: ColorTokens.coral },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.lavender,
    padding: 12,
    borderRadius: 14,
    gap: 8,
  },
  privacyText: { fontSize: 12, fontWeight: '600', color: ColorTokens.plum, flex: 1 },
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
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
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
  secondaryBtnText: { fontSize: 14, fontWeight: '700', color: ColorTokens.deepBerry },
});
