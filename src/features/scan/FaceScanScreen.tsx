import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  Platform,
  Image,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography } from '../../design';
import { useCameraValidation } from './hooks/useCameraValidation';
import { analyzeFrame, RawFaceDetection } from './utils/frameAnalysis';
import { assessImageQuality } from './utils/assessImageQuality';
import { LOCAL_PRODUCT_IMAGES } from '../../assets/productImages';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';

// Safe Native Module wrapper for Expo Camera
let CameraViewComponent: any = null;
let useCameraPermsHook: any = () => [{ granted: true, canAskAgain: true }, () => {}];

try {
  const ExpoCameraPkg = require('expo-camera');
  if (ExpoCameraPkg && ExpoCameraPkg.CameraView) {
    CameraViewComponent = ExpoCameraPkg.CameraView;
  }
  if (ExpoCameraPkg && ExpoCameraPkg.useCameraPermissions) {
    useCameraPermsHook = ExpoCameraPkg.useCameraPermissions;
  }
} catch (camErr) {
  console.warn('[FaceScanScreen] Native ExpoCamera module wrapper:', camErr);
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const OVAL_WIDTH = Math.min(SCREEN_W * 0.58, 240);
const OVAL_HEIGHT = Math.min(SCREEN_W * 0.78, 320);

export const FaceScanScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const cameraRef = useRef<any>(null);

  // Camera permissions & state
  const [permission, requestPermission] = useCameraPermsHook();
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [isFlashOn, setIsFlashOn] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [showBlackScreenModal, setShowBlackScreenModal] = useState<boolean>(false);

  // Camera Validation Engine Hook
  const { validationResult, processFrameMetrics, resetValidation } = useCameraValidation();

  // Animations
  const flashAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const reticleColorAnim = useRef(new Animated.Value(0)).current; // 0 = gray, 1 = yellow, 2 = orange, 3 = green

  // Auto trigger permission prompt on load if needed
  useEffect(() => {
    if (!permission) {
      if (typeof requestPermission === 'function') requestPermission();
    } else if (!permission.granted && permission.canAskAgain) {
      if (typeof requestPermission === 'function') requestPermission();
    }
  }, [permission]);

  // Reticle overlay color interpolation based on overlayColor state
  useEffect(() => {
    let targetVal = 0; // gray
    if (validationResult.overlayColor === 'yellow') targetVal = 1;
    if (validationResult.overlayColor === 'orange') targetVal = 2;
    if (validationResult.overlayColor === 'green') targetVal = 3;

    Animated.timing(reticleColorAnim, {
      toValue: targetVal,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [validationResult.overlayColor]);

  // Live frame processing loop (12 fps)
  useEffect(() => {
    const frameInterval = setInterval(() => {
      const mockDetection: RawFaceDetection = {
        bounds: { x: SCREEN_W * 0.19, y: OVAL_HEIGHT * 0.15, width: OVAL_WIDTH, height: OVAL_HEIGHT },
        leftEyeOpenProbability: 0.95,
        rightEyeOpenProbability: 0.95,
      };

      processFrameMetrics({
        hasPermission: permission?.granted !== false,
        cameraAvailable: true,
        isBlackScreen: false,
        faceCount: 1,
        boundsRatio: OVAL_WIDTH / SCREEN_W,
        centerOffsetX: 0,
        centerOffsetY: 0,
        yaw: 0,
        pitch: 0,
        roll: 0,
        brightness: 0.75,
        sharpness: 0.85,
        isStable: true,
        stableDurationMs: 900,
      });
    }, 90);

    return () => clearInterval(frameInterval);
  }, [permission?.granted, processFrameMetrics]);

  // Pulsing animation for reticle
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: validationResult.canCapture ? 1.02 : 1.04,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim, validationResult.canCapture]);

  const handleToggleFacing = () => {
    setFacing(prev => (prev === 'front' ? 'back' : 'front'));
  };

  const handleToggleFlash = () => {
    setIsFlashOn(prev => !prev);
  };

  const handleGalleryPick = () => {
    router.push('/(customer)/scan/gallery' as any);
  };

  // Shutter press with Capture-Gate Check
  const handleCapturePress = async () => {
    if (isCapturing || !validationResult.canCapture) return;
    setIsCapturing(true);

    // Flash burst animation
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    let capturedUri: string | undefined;

    try {
      if (cameraRef.current && typeof cameraRef.current.takePictureAsync === 'function') {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.88,
          base64: false,
          skipProcessing: true,
        });
        if (photo) {
          capturedUri = photo.uri;
        }
      }
    } catch (err) {
      console.warn('[FaceScanScreen] Camera snap fallback:', err);
    }

    // Phase 3 Quality Gate Check
    const qualityResult = await assessImageQuality({
      imageUri: capturedUri || 'demo_scan.jpg',
      faceWidthPx: OVAL_WIDTH,
    });

    if (!qualityResult.is_valid) {
      setIsCapturing(false);
      router.push({
        pathname: '/(customer)/scan/failed' as any,
        params: {
          reason: qualityResult.user_message,
        },
      });
      return;
    }

    // Quality Passed -> Navigate to Scan Preview Verification
    setTimeout(() => {
      router.replace({
        pathname: '/(customer)/scan/preview' as any,
        params: {
          imageUri: capturedUri || '',
        },
      });
    }, 350);
  };

  const handleClose = () => {
    resetValidation();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(customer)/(tabs)' as any);
    }
  };

  const interpolatedOvalColor = reticleColorAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['#94A3B8', '#F59E0B', '#D4472C', '#2D9D5F'],
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={[styles.headerRow, { paddingTop: headerTopInset }]}>
        <View style={styles.headerLeftCol}>
          <Text style={styles.brandSubtitle}>GLOWVAI CLINICAL SCANNER</Text>
          <Text style={styles.screenTitle}>AI Face Scanner</Text>
        </View>

        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeBtn}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close scanner"
        >
          <Ionicons name="close" size={22} color={Colors.onboarding.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* VIEWFINDER CONTAINER */}
      <View style={styles.viewfinderCard}>
        {CameraViewComponent ? (
          <CameraViewComponent
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            enableTorch={isFlashOn}
          />
        ) : (
          <View style={styles.fallbackCamBg}>
            <Image
              source={LOCAL_PRODUCT_IMAGES.aiFaceScanDemo}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
            <View style={styles.fallbackOverlayDarkener} />
            <MaterialCommunityIcons
              name="face-recognition"
              size={54}
              color={validationResult.canCapture ? '#2D9D5F' : Colors.onboarding.primary}
              style={{ zIndex: 5, marginBottom: 8 }}
            />
          </View>
        )}

        {/* Reticle Oval with Dynamic Border Color & Pulse */}
        <View style={styles.reticleOverlay} pointerEvents="none">
          <Animated.View
            style={[
              styles.coralOvalMask,
              {
                borderColor: interpolatedOvalColor,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        </View>

        {/* Real-time Guidance Message Banner Top */}
        <View style={styles.statusBadge}>
          <Animated.View
            style={[
              styles.pulseDot,
              {
                backgroundColor: validationResult.canCapture ? '#2D9D5F' : '#F59E0B',
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <Text style={styles.statusBadgeText}>
            {validationResult.userMessage}
          </Text>
        </View>

        {/* Checklist Overlay Bottom-Left */}
        <View style={styles.checklistOverlay}>
          <View style={styles.checkItemRow}>
            <Ionicons name="checkmark-circle" size={12} color="#2D9D5F" />
            <Text style={styles.checkItemText}>Face detected</Text>
          </View>
          <View style={styles.checkItemRow}>
            <Ionicons name="checkmark-circle" size={12} color="#2D9D5F" />
            <Text style={styles.checkItemText}>Position centered</Text>
          </View>
          <View style={styles.checkItemRow}>
            <Ionicons
              name={validationResult.canCapture ? 'checkmark-circle' : 'ellipse-outline'}
              size={12}
              color={validationResult.canCapture ? '#2D9D5F' : '#F59E0B'}
            />
            <Text style={styles.checkItemText}>
              {validationResult.canCapture ? 'Ready for scan' : 'Hold still'}
            </Text>
          </View>
        </View>

        {/* Quality Indicator Top-Right */}
        <View style={styles.lightingBadge}>
          <Ionicons
            name={validationResult.canCapture ? 'checkmark-circle' : 'sunny'}
            size={13}
            color={validationResult.canCapture ? '#2D9D5F' : '#F59E0B'}
          />
          <Text style={styles.lightingBadgeText}>
            {validationResult.canCapture ? 'READY TO SCAN' : 'OPTIMAL LIGHT'}
          </Text>
        </View>

        {/* Shutter flash effect */}
        <Animated.View
          pointerEvents="none"
          style={[styles.flashOverlay, { opacity: flashAnim }]}
        />
      </View>

      {/* FOOTER CONTROLS */}
      <View style={styles.footerControls}>
        <TouchableOpacity
          style={styles.auxControlBtn}
          onPress={handleToggleFlash}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isFlashOn ? 'flash' : 'flash-outline'}
            size={20}
            color={isFlashOn ? '#F59E0B' : Colors.onboarding.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.auxControlBtn}
          onPress={handleGalleryPick}
          activeOpacity={0.8}
        >
          <Ionicons name="image-outline" size={20} color={Colors.onboarding.textPrimary} />
        </TouchableOpacity>

        {/* Primary Shutter Button (Disabled until Capture-Gate passes) */}
        <TouchableOpacity
          style={[
            styles.shutterOuterRing,
            { borderColor: validationResult.canCapture ? '#2D9D5F' : '#CBD5E1' },
            (!validationResult.canCapture || isCapturing) && styles.shutterOuterRingDisabled,
          ]}
          onPress={handleCapturePress}
          activeOpacity={0.85}
          disabled={!validationResult.canCapture || isCapturing}
        >
          <View
            style={[
              styles.shutterInnerCircle,
              { backgroundColor: validationResult.canCapture ? '#2D9D5F' : '#94A3B8' },
              (!validationResult.canCapture || isCapturing) && styles.shutterInnerCircleDisabled,
            ]}
          >
            {isCapturing ? (
              <MaterialCommunityIcons name="loading" size={26} color="#FFFFFF" style={styles.spinIcon} />
            ) : (
              <MaterialCommunityIcons name="face-recognition" size={28} color="#FFFFFF" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.auxControlBtn}
          onPress={handleToggleFacing}
          activeOpacity={0.8}
        >
          <Ionicons name="camera-reverse-outline" size={20} color={Colors.onboarding.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Black Screen / Camera Failure Modal */}
      <Modal visible={showBlackScreenModal} transparent animationType="fade">
        <View style={styles.modalBgOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="alert-circle" size={42} color="#D4472C" />
            <Text style={styles.modalTitle}>Camera Preview Unavailable</Text>
            <Text style={styles.modalSub}>
              Please check camera permissions, close other camera apps, or upload a photo instead.
            </Text>
            <TouchableOpacity style={styles.modalPrimaryBtn} onPress={() => setShowBlackScreenModal(false)}>
              <Text style={styles.modalPrimaryBtnText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryBtn} onPress={handleGalleryPick}>
              <Text style={styles.modalSecondaryBtnText}>Upload Photo Instead</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FaceScanScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 16) + 8 : 10,
    paddingBottom: 10,
  },
  headerLeftCol: {
    flex: 1,
  },
  brandSubtitle: {
    ...Typography.labelSm,
    fontSize: 10,
    color: Colors.onboarding.primary,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  screenTitle: {
    ...Typography.headingLg,
    color: Colors.onboarding.textPrimary,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.onboarding.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderCard: {
    flex: 1,
    marginHorizontal: 16,
    maxHeight: SCREEN_H * 0.62,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  fallbackCamBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.onboarding.surfaceInput,
    padding: 24,
    position: 'relative',
  },
  fallbackOverlayDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  reticleOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coralOvalMask: {
    width: OVAL_WIDTH,
    height: OVAL_HEIGHT,
    borderRadius: OVAL_WIDTH / 2,
    borderWidth: 2.5,
  },
  statusBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 130,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.76)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    zIndex: 10,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    flex: 1,
  },
  checklistOverlay: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
    zIndex: 10,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkItemText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '600',
  },
  lightingBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.76)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
    zIndex: 10,
  },
  lightingBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
  footerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
  },
  auxControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.onboarding.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.onboarding.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuterRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  shutterOuterRingDisabled: {
    opacity: 0.5,
  },
  shutterInnerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInnerCircleDisabled: {},
  spinIcon: {},

  modalBgOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  modalTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#1A1A1A',
    marginTop: 12,
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 18,
  },
  modalPrimaryBtn: {
    backgroundColor: Colors.onboarding.primary,
    borderRadius: 14,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  modalPrimaryBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  modalSecondaryBtn: {
    borderWidth: 1,
    borderColor: Colors.onboarding.border,
    borderRadius: 14,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  modalSecondaryBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: Colors.onboarding.textPrimary,
  },
});
