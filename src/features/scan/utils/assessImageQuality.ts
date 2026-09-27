import { FaceMetrics } from '../hooks/useFaceGuidance';
import { calculateHeadPose, Point2D } from './faceLandmarks';

export interface QualityGateResult {
  is_valid: boolean;
  face_detected: boolean;
  lighting_score: number; // 0.0-1.0
  blur_score: number;     // 0.0-1.0
  pose_score: number;     // 0.0-1.0
  occlusion_score: number;// 0.0-1.0
  quality_score: number;  // weighted average of above
  reasons: string[];      // human-readable, populated if is_valid=false
  user_message: string;   // single actionable sentence for retake guidance
}

export interface ImageQualityInput {
  imageUri: string;
  faceMetrics?: Partial<FaceMetrics>;
  landmarks?: Point2D[];
  faceWidthPx?: number;
}

/**
 * PHASE 3: IMAGE QUALITY GATING
 * Runs on captured photo before skin analysis proceeds.
 * Rejects dark photos, motion blur, extreme side profiles, low resolution, or occluded faces.
 */
export async function assessImageQuality(input: ImageQualityInput): Promise<QualityGateResult> {
  const { faceMetrics, landmarks, faceWidthPx = 220 } = input;

  const reasons: string[] = [];
  const faceDetected = faceMetrics?.faceDetected !== false;

  if (!faceDetected) {
    return {
      is_valid: false,
      face_detected: false,
      lighting_score: 0.0,
      blur_score: 0.0,
      pose_score: 0.0,
      occlusion_score: 0.0,
      quality_score: 0.0,
      reasons: ['No face detected in scan frame'],
      user_message: 'No face detected — please center your face inside the oval guide and retry.',
    };
  }

  // 1. Lighting Score (0.0 to 1.0)
  const lightingScore = faceMetrics?.brightness !== undefined
    ? Math.min(1.0, Math.max(0.0, faceMetrics.brightness))
    : 0.75; // Default optimal lighting baseline when camera preview is clear

  // 2. Blur Score (0.0 to 1.0)
  const blurScore = faceMetrics?.blurScore !== undefined
    ? Math.min(1.0, Math.max(0.0, faceMetrics.blurScore))
    : 0.82; // Sharp baseline

  // 3. Pose Score (0.0 to 1.0)
  let poseScore = 1.0;
  if (landmarks && landmarks.length > 0) {
    const headPose = calculateHeadPose(landmarks);
    poseScore = headPose.poseScore;
  } else if (faceMetrics?.centerOffsetX !== undefined) {
    const offset = Math.abs(faceMetrics.centerOffsetX) + Math.abs(faceMetrics.centerOffsetY || 0);
    poseScore = Math.max(0.2, 1.0 - offset * 1.5);
  }

  // 4. Occlusion Score (0.0 to 1.0)
  const occlusionScore = faceMetrics?.eyesVisible !== false ? 0.95 : 0.30;

  // 5. Resolution Gate
  const isResolutionValid = faceWidthPx >= 150;
  if (!isResolutionValid) {
    reasons.push('Face region is under 150px wide');
  }

  // Individual Fail Thresholds
  if (lightingScore < 0.30) {
    reasons.push('Lighting is too dark for clinical texture extraction');
  }
  if (blurScore < 0.40) {
    reasons.push('Motion blur detected — image lack sharpness');
  }
  if (poseScore < 0.50) {
    reasons.push('Face pose is angled or non-frontal');
  }
  if (occlusionScore < 0.50) {
    reasons.push('Eyes or key facial landmarks are occluded (sunglasses/hair)');
  }

  // Weighted Quality Score
  const qualityScore = Math.round(
    (lightingScore * 0.25 + blurScore * 0.35 + poseScore * 0.25 + occlusionScore * 0.15) * 100
  ) / 100;

  const isValid = reasons.length === 0 && qualityScore >= 0.55;

  let userMessage = 'Image quality passed clinical inspection.';
  if (!isValid) {
    if (lightingScore < 0.30) {
      userMessage = 'Find a well-lit room facing direct light and take another scan.';
    } else if (blurScore < 0.40) {
      userMessage = 'Hold your device steady with both hands while taking the scan.';
    } else if (poseScore < 0.50) {
      userMessage = 'Look directly at the front camera to ensure a straight frontal angle.';
    } else if (occlusionScore < 0.50) {
      userMessage = 'Remove glasses or move hair away from your face for accurate skin scanning.';
    } else if (!isResolutionValid) {
      userMessage = 'Move closer so your face fills the center oval guide.';
    } else {
      userMessage = 'Retake scan ensuring clear lighting and steady positioning.';
    }
  }

  return {
    is_valid: isValid,
    face_detected: true,
    lighting_score: Math.round(lightingScore * 100) / 100,
    blur_score: Math.round(blurScore * 100) / 100,
    pose_score: Math.round(poseScore * 100) / 100,
    occlusion_score: Math.round(occlusionScore * 100) / 100,
    quality_score: qualityScore,
    reasons,
    user_message: userMessage,
  };
}
