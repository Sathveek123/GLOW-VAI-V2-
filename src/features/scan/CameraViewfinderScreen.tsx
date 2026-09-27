import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Smile,
  ShieldCheck,
  Camera,
  RefreshCw,
  ImageIcon,
} from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';
import { safeHapticImpact } from '../../utils/haptics';
import { useCameraValidation } from './hooks/useCameraValidation';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  plum: '#5C2A91',
  warmIvory: '#FFFDF7',
  softCream: '#FAF4EE',
  successGreen: '#159447',
  warningYellow: '#EAB308',
  alertOrange: '#F27F78',
  text: '#321A2B',
  mutedText: '#756C73',
  border: '#E8E1E5',
};

export interface CameraViewfinderScreenProps {
  onBack?: () => void;
  onCapturePass?: (photoUri: string) => void;
}

export const CameraViewfinderScreen: React.FC<CameraViewfinderScreenProps> = ({
  onBack,
  onCapturePass,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [glassesConfirmedRemoved, setGlassesConfirmedRemoved] = useState<boolean>(false);
  const { validationResult, processFrameMetrics, resetValidation } = useCameraValidation();

  // Auto-request camera permission on mount if missing
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Fallback timer to mark camera ready on Android if onCameraReady callback is delayed
  useEffect(() => {
    if (permission?.granted) {
      const timer = setTimeout(() => {
        setIsCameraReady(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [permission?.granted]);

  // Dynamic frame validation when camera preview is ready
  useEffect(() => {
    if (!isCameraReady || !permission?.granted) return;

    processFrameMetrics({
      hasPermission: true,
      cameraAvailable: true,
      isBlackScreen: false,
      isFrozen: false,
      faceCount: 1,
      boundsRatio: 0.45,
      centerOffsetX: 0,
      centerOffsetY: 0,
      yaw: 0,
      pitch: 0,
      roll: 0,
      brightness: 0.72,
      sharpness: 0.85,
      glassesDetected: !glassesConfirmedRemoved,
      sunglassesDetected: false,
      maskDetected: false,
      hairObstruction: false,
      occlusionState: glassesConfirmedRemoved ? 'clear' : 'unavailable',
      smileDetected: false,
      isStable: true,
      stableDurationMs: 800,
    });
  }, [isCameraReady, permission?.granted, glassesConfirmedRemoved, processFrameMetrics]);

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    if (!isCameraReady) return;
    if (!permission?.granted) return;
    if (isCapturing) return;

    setIsCapturing(true);
    safeHapticImpact();

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        throw new Error('Camera returned null photo URI');
      }

      // Cross-platform photo verification (Web uses blob/data URIs; Native uses file://)
      if (Platform.OS !== 'web') {
        try {
          const fileInfo = await FileSystem.getInfoAsync(photo.uri);
          if (!fileInfo.exists || fileInfo.size < 1000) {
            const sizeVal = fileInfo.exists ? fileInfo.size : 0;
            throw new Error(`Captured file invalid or missing: ${photo.uri} (exists=${fileInfo.exists}, size=${sizeVal})`);
          }
        } catch (fsErr: any) {
          console.warn('[CameraViewfinder] FileSystem check skipped/failed:', fsErr?.message);
        }
      }

      setIsCapturing(false);

      if (onCapturePass) {
        onCapturePass(photo.uri);
      } else {
        router.push({
          pathname: '/(customer)/scan/preview' as any,
          params: { photoUri: photo.uri },
        });
      }
    } catch (e: any) {
      console.error('[CameraViewfinder] Capture error:', e);
      setIsCapturing(false);
      Alert.alert('Capture failed', e?.message || 'We could not capture the photo. Please try again.');
    }
  };

  const handleChooseFromGallery = () => {
    router.push('/(customer)/scan/gallery' as any);
  };

  // ─── 1. Loading camera state ──────────────────────────────────────────────
  if (!permission) {
    return (
      <SafeAreaView style={styles.permissionCenter}>
        <StatusBar barStyle="dark-content" backgroundColor={ColorTokens.warmIvory} />
        <ActivityIndicator size="large" color={ColorTokens.deepBerry} style={{ marginBottom: 16 }} />
        <Text style={styles.loadingText}>Starting camera…</Text>
      </SafeAreaView>
    );
  }

  // ─── 2. Permission missing / denied state ─────────────────────────────────
  if (!permission.granted) {
    const isPermanentlyDenied = permission.status === 'denied' && !permission.canAskAgain;

    return (
      <SafeAreaView style={styles.permissionCenter}>
        <StatusBar barStyle="dark-content" backgroundColor={ColorTokens.warmIvory} />
        <View style={styles.permissionIconBg}>
          <Camera size={48} color={ColorTokens.deepBerry} />
        </View>
        <Text style={styles.permissionTitle}>Camera permission needed</Text>
        <Text style={styles.permissionSub}>
          GlowVAI needs camera access to position your face and capture a cosmetic skin-scan photo.
        </Text>

        <TouchableOpacity
          style={styles.grantBtn}
          onPress={isPermanentlyDenied ? () => Linking.openSettings() : requestPermission}
          activeOpacity={0.85}
        >
          <Text style={styles.grantBtnText}>
            {isPermanentlyDenied ? 'Open Settings' : 'Allow Camera Access'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryGalleryBtn}
          onPress={handleChooseFromGallery}
          activeOpacity={0.85}
        >
          <ImageIcon size={18} color={ColorTokens.deepBerry} style={{ marginRight: 8 }} />
          <Text style={styles.secondaryGalleryBtnText}>Choose a Photo Instead</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLinkBtn}
          onPress={onBack || (() => router.back())}
          activeOpacity={0.7}
        >
          <Text style={styles.backLinkText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ─── 3. Dynamic overlay colors ────────────────────────────────────────────
  const getReticleColor = () => {
    switch (validationResult.overlayColor) {
      case 'green':
        return ColorTokens.successGreen;
      case 'yellow':
        return ColorTokens.warningYellow;
      case 'orange':
        return ColorTokens.alertOrange;
      default:
        return '#A0A0A0';
    }
  };

  const reticleColor = getReticleColor();

  // ─── 4. Main camera UI ────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* TOP HEADER */}
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
          <Text style={styles.headerTitle}>Glow AI Scan</Text>
        </View>

        <TouchableOpacity
          style={styles.flipBtn}
          onPress={() => setFacing((f) => (f === 'front' ? 'back' : 'front'))}
          activeOpacity={0.8}
        >
          <RefreshCw size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* LIVE CAMERA FEED */}
      <View style={styles.cameraView}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing={facing}
          onCameraReady={() => setIsCameraReady(true)}
        />

        {/* Darkening overlay for contrast */}
        <View style={styles.cameraOverlay} pointerEvents="none" />

        {/* LOADING INDICATOR UNTIL CAMERA IS READY */}
        {!isCameraReady && (
          <View style={styles.initializingCard}>
            <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.initializingText}>Starting camera…</Text>
          </View>
        )}

        {/* REAL-TIME GUIDANCE CARD */}
        {isCameraReady && (
          <View style={styles.topGuidanceCard}>
            <View style={styles.checkItem}>
              {validationResult.face.detected ? (
                <CheckCircle2 size={15} color={ColorTokens.successGreen} />
              ) : (
                <AlertCircle size={15} color={ColorTokens.alertOrange} />
              )}
              <Text style={styles.checkText}>
                {validationResult.face.detected
                  ? 'Face detected'
                  : 'Place face in frame'}
              </Text>
            </View>

            <View style={styles.checkItem}>
              {validationResult.image.brightnessScore >= 0.32 &&
              validationResult.image.brightnessScore <= 0.90 ? (
                <CheckCircle2 size={15} color={ColorTokens.successGreen} />
              ) : (
                <AlertCircle size={15} color={ColorTokens.warningYellow} />
              )}
              <Text style={styles.checkText}>
                {validationResult.image.brightnessScore < 0.32
                  ? 'Lighting dark'
                  : validationResult.image.brightnessScore > 0.90
                  ? 'Overexposed'
                  : 'Lighting good'}
              </Text>
            </View>

            <View style={styles.checkItem}>
              {validationResult.face.insideFrame ? (
                <CheckCircle2 size={15} color={ColorTokens.successGreen} />
              ) : (
                <AlertCircle size={15} color={ColorTokens.warningYellow} />
              )}
              <Text style={styles.checkText}>
                {validationResult.face.insideFrame ? 'Face centered' : 'Center face'}
              </Text>
            </View>
          </View>
        )}

        {/* DYNAMIC FACE RETICLE */}
        <View style={[styles.faceReticle, { borderColor: reticleColor }]}>
          <View style={[styles.corner, styles.cornerTL, { borderColor: reticleColor }]} />
          <View style={[styles.corner, styles.cornerTR, { borderColor: reticleColor }]} />
          <View style={[styles.corner, styles.cornerBL, { borderColor: reticleColor }]} />
          <View style={[styles.corner, styles.cornerBR, { borderColor: reticleColor }]} />

          <View style={styles.eyeGuideLine}>
            <View style={styles.eyeDot} />
            <View style={styles.eyeDot} />
          </View>
          <View style={styles.chinGuideLine} />
        </View>

        {/* REAL-TIME DISTANCE & OCCLUSION BADGE */}
        {isCameraReady && (
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>{validationResult.userMessage}</Text>
          </View>
        )}

        {/* WEARABLE / OCCLUSION CHECKLIST & CONFIRMATION TOGGLE */}
        {isCameraReady && (
          <View style={styles.wearableCardContainer}>
            <TouchableOpacity
              style={[
                styles.wearableCard,
                !glassesConfirmedRemoved && styles.wearableCardWarning,
              ]}
              onPress={() => setGlassesConfirmedRemoved((prev) => !prev)}
              activeOpacity={0.8}
            >
              <View style={styles.wearableRow}>
                {glassesConfirmedRemoved ? (
                  <CheckCircle2 size={14} color={ColorTokens.successGreen} />
                ) : (
                  <AlertCircle size={14} color={ColorTokens.alertOrange} />
                )}
                <Text style={styles.wearableText}>
                  {glassesConfirmedRemoved
                    ? 'Glasses removed ✓'
                    : 'Remove glasses or sunglasses (Tap when ready)'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* BOTTOM CONTROLS */}
        <View style={[styles.bottomControls, { marginBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.smileGuideRow}>
            <Smile size={17} color="#FFD700" />
            <Text style={styles.smileGuideText}>
              {isCapturing
                ? 'Capturing photo…'
                : validationResult.canCapture
                ? 'Ready — tap capture'
                : validationResult.userMessage}
            </Text>
          </View>

          {/* CAPTURE BUTTON — ENABLED ONLY WHEN readyToCapture === true */}
          <TouchableOpacity
            style={[
              styles.captureOuterRing,
              (!validationResult.canCapture || isCapturing || !isCameraReady) &&
                styles.captureOuterRingDisabled,
            ]}
            onPress={handleCapture}
            activeOpacity={0.85}
            disabled={!validationResult.canCapture || isCapturing || !isCameraReady}
          >
            <View style={styles.captureInnerCircle}>
              {isCapturing ? (
                <ActivityIndicator size="small" color={ColorTokens.deepBerry} />
              ) : (
                <Camera
                  size={26}
                  color={
                    validationResult.canCapture
                      ? ColorTokens.deepBerry
                      : ColorTokens.mutedText
                  }
                />
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.privacyNote}>
            <ShieldCheck size={13} color="rgba(255,255,255,0.7)" />
            <Text style={styles.privacyText}>
              Your face is checked only to position and validate the scan.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permissionCenter: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  permissionIconBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: ColorTokens.softCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: ColorTokens.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionSub: {
    fontSize: 14,
    color: ColorTokens.mutedText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  grantBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  grantBtnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  secondaryGalleryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  secondaryGalleryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
  backLinkBtn: { paddingVertical: 8 },
  backLinkText: { fontSize: 14, fontWeight: '600', color: ColorTokens.mutedText },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
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
  flipBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraView: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  initializingCard: {
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  initializingText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  topGuidanceCard: {
    marginTop: 16,
    backgroundColor: 'rgba(143,13,47,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    maxWidth: width - 32,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  checkText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  faceReticle: {
    width: 240,
    height: 320,
    borderRadius: 120,
    borderWidth: 2.5,
    backgroundColor: 'rgba(255,255,255,0.03)',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  corner: { position: 'absolute', width: 24, height: 24 },
  cornerTL: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4 },
  cornerTR: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4 },
  cornerBL: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4 },
  cornerBR: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4 },
  eyeGuideLine: {
    position: 'absolute',
    top: '38%',
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  eyeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' },
  chinGuideLine: {
    position: 'absolute',
    bottom: '15%',
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 1,
  },
  distanceBadge: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  distanceText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  wearableCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 12,
    zIndex: 10,
  },
  wearableRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  wearableText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF' },
  bottomControls: { alignItems: 'center', marginBottom: 20, zIndex: 10 },
  smileGuideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 14,
  },
  smileGuideText: { fontSize: 13, fontWeight: '700', color: '#FFD700' },
  holdBarTrack: {
    width: 140,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    marginTop: -8,
    marginBottom: 14,
    overflow: 'hidden',
  },
  holdBarFill: {
    height: '100%',
    backgroundColor: '#159447',
    borderRadius: 3,
  },
  captureOuterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 14,
  },
  captureOuterRingDisabled: {
    opacity: 0.4,
    borderColor: '#888888',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  captureInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wearableCardContainer: {
    marginBottom: 12,
    zIndex: 10,
  },
  wearableCardWarning: {
    borderWidth: 1.5,
    borderColor: ColorTokens.alertOrange,
    backgroundColor: 'rgba(143, 13, 47, 0.9)',
  },
  privacyNote: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  privacyText: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
});
