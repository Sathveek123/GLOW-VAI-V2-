import { useSharedValue, runOnJS } from 'react-native-reanimated';
import {
  analyzeFrame,
  computeBlurVariance,
  computeAverageBrightness,
  frameToGrayscaleSample,
  FaceDetectionResult,
} from '../utils/frameAnalysis';
import { FaceMetrics } from './useFaceGuidance';

export function useFrameFaceDetector(onMetrics: (metrics: FaceMetrics) => void) {
  const frameSkipCounter = useSharedValue(0);
  const FRAME_SKIP = 3;

  const processFrame = (frame: any) => {
    'worklet';
    frameSkipCounter.value += 1;
    if (frameSkipCounter.value % FRAME_SKIP !== 0) return;

    if (!frame) return;

    // Optional ML Kit native binding detector wrapper with safe fallback
    let primaryFace: FaceDetectionResult | null = null;

    try {
      if (typeof frame.detectFaces === 'function') {
        const faces = frame.detectFaces();
        if (Array.isArray(faces) && faces.length === 1) {
          primaryFace = faces[0];
        }
      }
    } catch (_err) {
      // Fallback to bounding reticle frame analysis
    }

    // Grayscale sample + quality metrics computed on worklet thread
    let frameBuffer: Uint8Array = new Uint8Array(0);
    if (typeof frame.toArrayBuffer === 'function') {
      try {
        frameBuffer = new Uint8Array(frame.toArrayBuffer());
      } catch (_e) {
        frameBuffer = new Uint8Array(0);
      }
    }

    const frameW = frame.width || 360;
    const frameH = frame.height || 480;

    const grayscale = frameToGrayscaleSample(frameBuffer, frameW, frameH);
    const brightness = computeAverageBrightness(grayscale.pixels);
    const blurVariance = computeBlurVariance(grayscale.pixels, grayscale.width, grayscale.height);

    const metrics = analyzeFrame(primaryFace, frameW, frameH, brightness, blurVariance);

    runOnJS(onMetrics)(metrics);
  };

  return { processFrame };
}
