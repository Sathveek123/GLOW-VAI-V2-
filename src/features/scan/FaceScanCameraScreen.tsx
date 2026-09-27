import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppFonts } from '../../hooks/useAppFonts';

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';

const { width, height } = Dimensions.get('window');

const ColorTokens = {
  deepBerry: '#8F0D2F',
  warmIvory: '#FFFDF7',
  text: '#321A2B',
  mutedText: '#756C73',
};

export const FaceScanCameraScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const { isLoaded, fontFamily } = useAppFonts();
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    } else if (permission && !permission.granted && !permission.canAskAgain) {
      Alert.alert(
        'Camera Access Needed',
        'Please enable camera permission in your device Settings to use the AI Skin Scan.',
        [{ text: 'OK' }]
      );
    }
  }, [permission, requestPermission]);

  const handleCapture = async () => {
    setIsCapturing(true);
    try {
      let photoUri = '';
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
        photoUri = photo?.uri ?? '';
      }
      setIsCapturing(false);
      // Pass the real captured photo URI to the preview screen
      router.push({ pathname: '/(customer)/scan/preview' as any, params: { photoUri } });
    } catch {
      setIsCapturing(false);
      router.push('/(customer)/scan/preview' as any);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip AI Skin Scan?',
      'Scanning your face gives you personalized ingredient matches and a 20% discount. Continue to home without scanning?',
      [
        { text: 'Scan Now', style: 'cancel' },
        {
          text: 'Skip to Home',
          style: 'destructive',
          onPress: () => router.replace('/(customer)/(tabs)'),
        },
      ]
    );
  };

  const syneFont =
    isLoaded && fontFamily ? fontFamily.syneBold || fontFamily.syneExtraBold : undefined;

  // ─── No permission yet ───────────────────────────────────────────────────
  if (!permission) {
    return (
      <View style={styles.centeredState}>
        <ActivityIndicator size="large" color={ColorTokens.deepBerry} />
      </View>
    );
  }

  // ─── Permission denied ───────────────────────────────────────────────────
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centeredState}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <MaterialCommunityIcons name="camera-off" size={64} color={ColorTokens.deepBerry} style={{ marginBottom: 20 }} />
        <Text style={[styles.permissionTitle, syneFont ? { fontFamily: syneFont } : {}]}>
          Camera Access Needed
        </Text>
        <Text style={styles.permissionSub}>
          GlowVAI needs your front camera to run the AI Skin Analysis.
        </Text>
        <TouchableOpacity
          style={styles.grantBtn}
          onPress={requestPermission}
          activeOpacity={0.85}
        >
          <Text style={styles.grantBtnText}>Enable Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLinkBtn} activeOpacity={0.7}>
          <Text style={styles.backLinkText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ─── Main UI ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: headerTopInset }]}>
        <View style={styles.topNavRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn} activeOpacity={0.7}>
            <Text style={styles.skipBtnText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.titleMain, syneFont ? { fontFamily: syneFont } : { fontWeight: '800' }]}>
          it's time to
        </Text>
        <Text style={styles.titleSub}>give a second chance to your skin</Text>
      </View>

      {/* LIVE Camera Feed (replaces grey silhouette placeholder) */}
      <View style={styles.centerContainer}>
        <View style={styles.cameraBox}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing={facing}
          />

          {/* Face oval overlay guide on top of live camera */}
          <View pointerEvents="none" style={styles.ovalOverlayContainer}>
            <View style={styles.faceOvalGuide} />
          </View>
        </View>

        {/* Flip camera */}
        <TouchableOpacity
          style={styles.flipBtn}
          onPress={() => setFacing(f => (f === 'front' ? 'back' : 'front'))}
          activeOpacity={0.7}
          accessibilityLabel="Flip camera"
        >
          <Ionicons name="camera-reverse-outline" size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsSection}>
        <View style={styles.instructionItem}>
          <View style={styles.instructionIconCircle}>
            <Ionicons name="water-outline" size={20} color="#0284C7" />
          </View>
          <Text style={styles.instructionText}>Wash your face</Text>
        </View>

        <View style={styles.instructionItem}>
          <View style={styles.instructionIconCircle}>
            <Ionicons name="glasses-outline" size={20} color="#0284C7" />
          </View>
          <Text style={styles.instructionText}>Remove specs</Text>
        </View>

        <View style={styles.instructionItem}>
          <View style={styles.instructionIconCircle}>
            <Ionicons name="sunny-outline" size={20} color="#0284C7" />
          </View>
          <Text style={styles.instructionText}>Good lighting</Text>
        </View>
      </View>

      {/* Bottom shutter */}
      <View style={styles.bottomControlsRow}>
        {/* Gallery shortcut */}
        <TouchableOpacity
          style={styles.sideControlBtn}
          onPress={handleCapture}
          activeOpacity={0.7}
          accessibilityLabel="Upload from gallery"
        >
          <Ionicons name="images-outline" size={22} color="#0F172A" />
        </TouchableOpacity>

        {/* Shutter */}
        <TouchableOpacity
          style={styles.shutterOuterRing}
          onPress={handleCapture}
          disabled={isCapturing}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Capture face scan selfie"
        >
          {isCapturing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <View style={styles.shutterInnerCircle} />
          )}
        </TouchableOpacity>

        {/* Flip */}
        <TouchableOpacity
          style={styles.sideControlBtn}
          onPress={() => setFacing(f => (f === 'front' ? 'back' : 'front'))}
          activeOpacity={0.7}
          accessibilityLabel="Flip camera direction"
        >
          <Ionicons name="camera-reverse-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  centeredState: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
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
  grantBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 12,
  },
  grantBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  backLinkBtn: {
    paddingVertical: 8,
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorTokens.mutedText,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    alignItems: 'center',
  },
  topNavRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  titleMain: {
    fontSize: 24,
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 2,
    textAlign: 'center',
  },
  titleSub: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  cameraBox: {
    width: width * 0.78,
    height: height * 0.44,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  ovalOverlayContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceOvalGuide: {
    width: 130,
    height: 170,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    borderStyle: 'dashed',
    marginTop: -10,
  },
  flipBtn: {
    marginTop: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  instructionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  instructionItem: {
    alignItems: 'center',
    gap: 6,
  },
  instructionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  instructionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  bottomControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 24,
  },
  sideControlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shutterOuterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#0F172A',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInnerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    backgroundColor: '#0F172A',
  },
});
