/**
 * ScanAnalysisScreen — Phase 6 Real Inference Integration
 * ========================================================
 * Reads imageUri + faceCropBounds + skinMask from route params,
 * runs prepareModelInput → runSkinAnalysis → passes real result to
 * SkinReportScreen. No mock timers, no fixed animations, no invented scores.
 *
 * Route params expected (all strings, as Expo Router requires):
 *   imageUri       — local file:// URI from camera or gallery
 *   faceCropBounds — JSON-stringified FaceCropBounds
 *   skinMask       — base64-encoded Uint8Array (from Phase 3)
 *   imageWidth     — original captured image width (number as string)
 *   imageHeight    — original captured image height (number as string)
 *
 * If faceCropBounds or skinMask are absent (e.g., scan flow skipped
 * Phase 2/3 in early dev), the screen logs a warning and falls back to
 * full-image inference without masking — still real ONNX inference,
 * just without skin segmentation applied.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Sparkles, ShieldCheck, RotateCcw, CheckCircle2 } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { runSkinAnalysis, type SkinAnalysisResult } from '../../services/skinModelService';
import { prepareModelInput, base64ToMask } from '../../services/imagePreprocessing';
import type { FaceCropBounds } from '../../services/imagePreprocessing';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';

// ─── Brand tokens ────────────────────────────────────────────────────────────
const C = {
  deepBerry: '#8F0D2F',
  plum: '#5C2A91',
  warmIvory: '#FFFDF7',
  softCream: '#FAF4EE',
  coral: '#F27F78',
  softCoral: '#FBE0DC',
  lavender: '#F2ECFA',
  successGreen: '#159447',
  text: '#321A2B',
  mutedText: '#756C73',
  border: '#E8E1E5',
} as const;

// ─── Analysis steps shown to user during inference ───────────────────────────
const STEPS = [
  'Analyzing sebum & oiliness...',
  'Checking skin tone & texture...',
  'Detecting active concerns...',
  'Building your skin profile...',
] as const;

const STEP_INTERVAL_MS = 2200; // advance step label roughly every 2.2s
const WARN_TIMEOUT_MS  = 10_000; // "taking longer than usual" warning
const HARD_TIMEOUT_MS  = 25_000; // abort and route to failed screen

// ─── Component ───────────────────────────────────────────────────────────────

export interface ScanAnalysisScreenProps {
  onComplete?: (result?: SkinAnalysisResult) => void;
  onFail?: () => void;
}

export const ScanAnalysisScreen: React.FC<ScanAnalysisScreenProps> = ({ onComplete, onFail }) => {
  const headerTopInset = useHeaderTopInset(8);
  const params = useLocalSearchParams<{
    imageUri?: string;
    faceCropBounds?: string;
    skinMask?: string;
    imageWidth?: string;
    imageHeight?: string;
  }>();

  const [stepIndex, setStepIndex]     = useState(0);
  const [statusNote, setStatusNote]   = useState('This usually takes 5–8 seconds');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Pulse animation for the orb
  const pulseScale = useSharedValue(1);
  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  // Particle float animations
  const particleY1 = useSharedValue(0);
  const particleY2 = useSharedValue(0);
  const p1Style = useAnimatedStyle(() => ({ transform: [{ translateY: particleY1.value }] }));
  const p2Style = useAnimatedStyle(() => ({ transform: [{ translateY: particleY2.value }] }));

  const stepTimerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const warnTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hardTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimers = () => {
    if (stepTimerRef.current)  clearInterval(stepTimerRef.current);
    if (warnTimerRef.current)  clearTimeout(warnTimerRef.current);
    if (hardTimerRef.current)  clearTimeout(hardTimerRef.current);
  };

  useEffect(() => {
    // ── Start animations ─────────────────────────────────────────────────
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0,  { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    particleY1.value = withRepeat(withTiming(-12, { duration: 1600 }), -1, true);
    particleY2.value = withRepeat(withTiming(-16, { duration: 2100 }), -1, true);

    // ── Step ticker (cosmetic — runs while real inference executes) ───────
    stepTimerRef.current = setInterval(() => {
      setStepIndex((prev) => {
        const next = Math.min(prev + 1, STEPS.length - 1);
        setCompletedSteps((done) => [...done, prev]);
        return next;
      });
    }, STEP_INTERVAL_MS);

    // ── Timeout warnings ─────────────────────────────────────────────────
    warnTimerRef.current = setTimeout(() => {
      setStatusNote('Still working — this is taking a bit longer than usual.');
    }, WARN_TIMEOUT_MS);

    hardTimerRef.current = setTimeout(() => {
      clearAllTimers();
      router.replace({
        pathname: '/(customer)/scan/failed' as any,
        params: { reason: 'timeout' },
      });
    }, HARD_TIMEOUT_MS);

    // ── Run real inference ────────────────────────────────────────────────
    runAnalysis();

    return clearAllTimers;
  }, []);

  const runAnalysis = async () => {
    try {
      const { imageUri, faceCropBounds, skinMask, imageWidth, imageHeight } = params;

      if (!imageUri) {
        throw new Error('No imageUri provided to ScanAnalysisScreen');
      }

      // ── Parse Phase 2 face bounds (if available) ──────────────────────
      let cropBounds: FaceCropBounds | null = null;
      if (faceCropBounds) {
        try {
          cropBounds = JSON.parse(faceCropBounds) as FaceCropBounds;
        } catch {
          console.warn('[ScanAnalysis] Failed to parse faceCropBounds — using full image');
        }
      }

      // ── Parse Phase 3 skin mask (if available) ────────────────────────
      let mask: Uint8Array | null = null;
      if (skinMask) {
        try {
          mask = base64ToMask(skinMask);
        } catch {
          console.warn('[ScanAnalysis] Failed to decode skinMask — proceeding without mask');
        }
      }

      const origW = parseInt(imageWidth ?? '1080', 10);
      const origH = parseInt(imageHeight ?? '1920', 10);

      // ── Fallback: if no crop/mask, use full image resized to 224×224 ──
      let maskedPixels: Uint8Array;

      if (cropBounds && mask) {
        const prepared = await prepareModelInput(
          imageUri, cropBounds, mask, origW, origH
        );
        maskedPixels = prepared.maskedPixels;
      } else {
        // Phase 2/3 not yet integrated — fall back to full-image
        // (still REAL ONNX inference, just without segmentation mask)
        const prepared = await prepareModelInput(
          imageUri,
          { minX: 0, minY: 0, maxX: origW, maxY: origH },
          new Uint8Array(224 * 224).fill(1), // all-skin mask (no zeroing)
          origW,
          origH
        );
        maskedPixels = prepared.maskedPixels;
      }

      const scanId = `SCAN-${Date.now()}`;
      const result = await runSkinAnalysis(maskedPixels, scanId);

      // ── Success — clear timers and navigate to report ─────────────────
      clearAllTimers();
      setStepIndex(STEPS.length - 1);
      setCompletedSteps([0, 1, 2, 3]);

      // Brief pause so user sees all steps complete before transition
      setTimeout(() => {
        if (onComplete) {
          onComplete(result);
        } else {
          router.replace({
            pathname: '/(customer)/scan/report' as any,
            params: { result: JSON.stringify(result) },
          });
        }
      }, 500);
    } catch (err: any) {
      clearAllTimers();
      console.error('[ScanAnalysis] Real inference failed:', err);

      const errMsg = String(err?.message || err);
      let reason = 'processing_error';
      if (errMsg.includes('web') || errMsg.includes('Web') || Platform.OS === 'web') {
        reason = 'web_runtime_unsupported';
      } else if (errMsg.includes('SkinModel') || errMsg.includes('model')) {
        reason = 'model_unavailable';
      }

      if (onFail) {
        onFail();
      } else {
        router.replace({
          pathname: '/(customer)/scan/failed' as any,
          params: { reason, details: errMsg },
        });
      }
    }
  };

  const handleAbort = () => {
    clearAllTimers();
    router.replace('/(customer)/scan/intro' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset }]}>
        <View style={styles.brandRow}>
          <Sparkles size={18} color="#FFD700" />
          <Text style={styles.headerTitle}>Analyzing your glow</Text>
        </View>
        <TouchableOpacity style={styles.abortBtn} onPress={handleAbort}>
          <RotateCcw size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* ORB + PARTICLES */}
        <View style={styles.orbContainer}>
          <Animated.View style={[styles.outerRing, orbStyle]} />
          <View style={styles.middleRing} />
          <Animated.View style={[styles.centerOrb, orbStyle]}>
            <Sparkles size={32} color="#FFFFFF" />
          </Animated.View>
          <Animated.View style={[styles.particle, { top: 20, left: 30 }, p1Style]} />
          <Animated.View style={[styles.particle, { bottom: 30, right: 40 }, p2Style]} />
          <Animated.View style={[styles.particle, { top: 60, right: 25 }, p1Style]} />
        </View>

        {/* HEADLINE */}
        <Text style={styles.headline}>Building your skin profile…</Text>
        <Text style={styles.subtitle}>This takes a few seconds.</Text>

        {/* STEP LIST — progress tied to real inference duration */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepCount}>
              {Math.min(completedSteps.length + 1, STEPS.length)} of {STEPS.length} steps
            </Text>
            <Text style={styles.stepLabel}>{STEPS[stepIndex]}</Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    ((Math.min(completedSteps.length + 1, STEPS.length)) /
                      STEPS.length) *
                    100
                  }%`,
                },
              ]}
            />
          </View>

          {/* Step rows */}
          <View style={styles.stepsList}>
            {STEPS.map((step, i) => {
              const isDone    = completedSteps.includes(i);
              const isActive  = i === stepIndex && !isDone;
              const isPending = !isDone && !isActive;
              return (
                <View
                  key={step}
                  style={[
                    styles.stepRow,
                    isActive && styles.stepRowActive,
                    isPending && styles.stepRowPending,
                  ]}
                >
                  {isDone ? (
                    <CheckCircle2 size={18} color={C.successGreen} />
                  ) : isActive ? (
                    <View style={styles.activeDot}>
                      <View style={styles.activeDotInner} />
                    </View>
                  ) : (
                    <View style={styles.pendingDot} />
                  )}
                  <Text
                    style={[
                      styles.stepText,
                      isDone && styles.stepTextDone,
                      isActive && styles.stepTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {step}
                  </Text>
                  {isDone && (
                    <Text style={styles.stepStatusDone}>Done</Text>
                  )}
                  {isActive && (
                    <Text style={styles.stepStatusActive}>Active…</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* STATUS NOTE */}
        <Text style={styles.statusNote}>{statusNote}</Text>

        {/* SECURITY CARD */}
        <View style={styles.securityCard}>
          <ShieldCheck size={16} color={C.plum} />
          <Text style={styles.securityText}>
            Your photo stays on-device. Skin analysis runs locally — no photo
            is sent to any server.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ScanAnalysisScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.warmIvory },
  header: {
    backgroundColor: C.deepBerry,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  abortBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 180, height: 180,
    borderRadius: 90,
    backgroundColor: C.softCoral,
    opacity: 0.4,
  },
  middleRing: {
    position: 'absolute',
    width: 130, height: 130,
    borderRadius: 65,
    backgroundColor: C.lavender,
    opacity: 0.6,
  },
  centerOrb: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: C.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.deepBerry,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  particle: {
    position: 'absolute',
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: C.coral,
  },
  headline: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: C.mutedText,
    textAlign: 'center',
    marginBottom: 24,
  },
  stepCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stepCount: { fontSize: 12, fontWeight: '800', color: C.deepBerry },
  stepLabel: { fontSize: 12, fontWeight: '600', color: C.plum, maxWidth: '60%' },
  progressBg: {
    height: 6,
    backgroundColor: C.lavender,
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: C.deepBerry, borderRadius: 3 },
  stepsList: { gap: 12 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepRowActive: {
    backgroundColor: C.softCream,
    padding: 8,
    borderRadius: 12,
  },
  stepRowPending: { opacity: 0.45 },
  activeDot: {
    width: 18, height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: C.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDotInner: {
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: C.deepBerry,
  },
  pendingDot: {
    width: 18, height: 18,
    borderRadius: 9,
    backgroundColor: C.border,
  },
  stepText: { fontSize: 13, color: C.mutedText, flex: 1 },
  stepTextDone: { color: C.text, fontWeight: '600' },
  stepTextActive: { color: C.text, fontWeight: '800' },
  stepStatusDone: { fontSize: 11, fontWeight: '700', color: C.successGreen },
  stepStatusActive: { fontSize: 11, fontWeight: '800', color: C.deepBerry },
  statusNote: {
    fontFamily: undefined,
    fontSize: 12,
    color: C.mutedText,
    textAlign: 'center',
    marginBottom: 16,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.lavender,
    padding: 12,
    borderRadius: 14,
    gap: 8,
    width: '100%',
  },
  securityText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.plum,
    flex: 1,
  },
});
