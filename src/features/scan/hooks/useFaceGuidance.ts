import { useState, useCallback, useRef } from 'react';

export type GuidanceState =
  | 'no_face'
  | 'move_closer'
  | 'move_back'
  | 'center_face'
  | 'turn_to_light'
  | 'hold_still'
  | 'remove_sunglasses'
  | 'too_dark'
  | 'too_blurry'
  | 'ready';

export interface FaceMetrics {
  faceDetected: boolean;
  faceBoundsRatio: number; // face width / frame width, 0-1
  centerOffsetX: number;   // -1 to 1, 0 = perfectly centered
  centerOffsetY: number;   // -1 to 1, 0 = perfectly centered
  brightness: number;      // 0-1
  blurScore: number;       // 0-1, higher = sharper
  eyesVisible: boolean;    // false if sunglasses/occlusion suspected
}

const THRESHOLDS = {
  minFaceRatio: 0.28,
  maxFaceRatio: 0.55,
  maxCenterOffset: 0.12,
  minBrightness: 0.35,
  minBlurScore: 0.45,
};

export function useFaceGuidance() {
  const [guidance, setGuidance] = useState<GuidanceState>('no_face');
  const [isReady, setIsReady] = useState<boolean>(false);
  const stableFrameCount = useRef<number>(0);
  const REQUIRED_STABLE_FRAMES = 8; // ~0.5s at 15fps sampled rate

  const evaluate = useCallback((metrics: FaceMetrics) => {
    if (!metrics.faceDetected) {
      stableFrameCount.current = 0;
      setGuidance('no_face');
      setIsReady(false);
      return;
    }

    if (!metrics.eyesVisible) {
      stableFrameCount.current = 0;
      setGuidance('remove_sunglasses');
      setIsReady(false);
      return;
    }

    if (metrics.brightness < THRESHOLDS.minBrightness) {
      stableFrameCount.current = 0;
      setGuidance('too_dark');
      setIsReady(false);
      return;
    }

    if (metrics.faceBoundsRatio < THRESHOLDS.minFaceRatio) {
      stableFrameCount.current = 0;
      setGuidance('move_closer');
      setIsReady(false);
      return;
    }

    if (metrics.faceBoundsRatio > THRESHOLDS.maxFaceRatio) {
      stableFrameCount.current = 0;
      setGuidance('move_back');
      setIsReady(false);
      return;
    }

    const offCenter =
      Math.abs(metrics.centerOffsetX) > THRESHOLDS.maxCenterOffset ||
      Math.abs(metrics.centerOffsetY) > THRESHOLDS.maxCenterOffset;

    if (offCenter) {
      stableFrameCount.current = 0;
      setGuidance('center_face');
      setIsReady(false);
      return;
    }

    if (metrics.blurScore < THRESHOLDS.minBlurScore) {
      stableFrameCount.current = 0;
      setGuidance('hold_still');
      setIsReady(false);
      return;
    }

    // All conditions pass — require N consecutive stable frames before
    // declaring "ready" to avoid flicker on borderline frames
    stableFrameCount.current += 1;
    if (stableFrameCount.current >= REQUIRED_STABLE_FRAMES) {
      setGuidance('ready');
      setIsReady(true);
    } else {
      setGuidance('hold_still');
      setIsReady(false);
    }
  }, []);

  const reset = useCallback(() => {
    stableFrameCount.current = 0;
    setGuidance('no_face');
    setIsReady(false);
  }, []);

  return { guidance, isReady, evaluate, reset };
}

export const GUIDANCE_MESSAGES: Record<GuidanceState, string> = {
  no_face: 'Position your face in the oval reticle',
  move_closer: 'Move closer to the camera',
  move_back: 'Move slightly back',
  center_face: 'Center your face in the oval reticle',
  turn_to_light: 'Turn toward the light',
  hold_still: 'Hold still...',
  remove_sunglasses: 'Remove sunglasses or face coverings',
  too_dark: 'Lighting is too dark — move to a brighter spot',
  too_blurry: 'Image is blurry — hold steady',
  ready: 'Ready to scan ✓',
};
