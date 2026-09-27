import { FaceMetrics } from '../hooks/useFaceGuidance';

export interface FaceDetectionBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceDetectionResult {
  bounds: FaceDetectionBounds;
  leftEyeOpenProbability?: number;
  rightEyeOpenProbability?: number;
}

export type RawFaceDetection = FaceDetectionResult;

/**
 * Converts a real face-detector result into normalized FaceMetrics.
 */
export function analyzeFrame(
  face: FaceDetectionResult | null,
  frameWidth: number,
  frameHeight: number,
  avgBrightness: number,  // 0-255
  blurVariance: number    // raw Laplacian variance
): FaceMetrics {
  if (!face) {
    return {
      faceDetected: false,
      faceBoundsRatio: 0,
      centerOffsetX: 0,
      centerOffsetY: 0,
      brightness: avgBrightness / 255,
      blurScore: 0,
      eyesVisible: false,
    };
  }

  const { bounds } = face;
  const faceBoundsRatio = bounds.width / frameWidth;

  const faceCenterX = bounds.x + bounds.width / 2;
  const faceCenterY = bounds.y + bounds.height / 2;
  const centerOffsetX = (faceCenterX - frameWidth / 2) / (frameWidth / 2);
  const centerOffsetY = (faceCenterY - frameHeight / 2) / (frameHeight / 2);

  const blurScore = Math.min(1, blurVariance / 150);

  // ML Kit provides leftEyeOpenProbability / rightEyeOpenProbability
  const leftEyeOpen = (face.leftEyeOpenProbability ?? 1) > 0.4;
  const rightEyeOpen = (face.rightEyeOpenProbability ?? 1) > 0.4;
  const eyesVisible = leftEyeOpen && rightEyeOpen;

  return {
    faceDetected: true,
    faceBoundsRatio,
    centerOffsetX,
    centerOffsetY,
    brightness: avgBrightness / 255,
    blurScore,
    eyesVisible,
  };
}

/**
 * REAL Laplacian variance blur detector.
 * Operates on a downscaled grayscale buffer for speed — 3x3 Laplacian kernel:
 * [[0,1,0],[1,-4,1],[0,1,0]]
 */
export function computeBlurVariance(
  grayscalePixels: Uint8Array,
  width: number,
  height: number
): number {
  if (width < 3 || height < 3 || grayscalePixels.length < width * height) {
    return 120; // Baseline sharp fallback if sample dimensions are invalid
  }

  const laplacian: number[] = [];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const top = grayscalePixels[idx - width] ?? 0;
      const bottom = grayscalePixels[idx + width] ?? 0;
      const left = grayscalePixels[idx - 1] ?? 0;
      const right = grayscalePixels[idx + 1] ?? 0;
      const center = grayscalePixels[idx] ?? 0;

      const value = top + bottom + left + right - 4 * center;
      laplacian.push(value);
    }
  }

  if (laplacian.length === 0) return 0;

  const mean = laplacian.reduce((sum: number, v: number) => sum + v, 0) / laplacian.length;
  const variance =
    laplacian.reduce((sum: number, v: number) => sum + Math.pow(v - mean, 2), 0) / laplacian.length;

  return variance;
}

/**
 * REAL average brightness — mean luminance over grayscale buffer.
 */
export function computeAverageBrightness(grayscalePixels: Uint8Array): number {
  if (grayscalePixels.length === 0) return 128;
  let sum = 0;
  for (let i = 0; i < grayscalePixels.length; i++) {
    sum += grayscalePixels[i] ?? 128;
  }
  return sum / grayscalePixels.length;
}

/**
 * Converts a YUV/RGB frame buffer to a downscaled grayscale sample.
 * Downscaling to ~120x120 keeps per-frame CV work cheap enough to run
 * at the throttled 10-15fps rate from Phase 1 without dropping camera frames.
 */
export function frameToGrayscaleSample(
  frameData: Uint8Array,
  sourceWidth: number,
  sourceHeight: number,
  targetSize: number = 120
): { pixels: Uint8Array; width: number; height: number } {
  if (!frameData || frameData.length === 0) {
    return { pixels: new Uint8Array(targetSize * targetSize).fill(128), width: targetSize, height: targetSize };
  }

  const scaleX = sourceWidth / targetSize;
  const scaleY = sourceHeight / targetSize;
  const output = new Uint8Array(targetSize * targetSize);

  for (let ty = 0; ty < targetSize; ty++) {
    for (let tx = 0; tx < targetSize; tx++) {
      const sx = Math.floor(tx * scaleX);
      const sy = Math.floor(ty * scaleY);
      const sourceIdx = sy * sourceWidth + sx;
      output[ty * targetSize + tx] = frameData[sourceIdx] ?? 128;
    }
  }

  return { pixels: output, width: targetSize, height: targetSize };
}
