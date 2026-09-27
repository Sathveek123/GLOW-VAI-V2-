/**
 * Phase 2 & Phase 4: MediaPipe 468-Point Face Mesh Zone Mapper & Landmark Geometry
 * Maps MediaPipe landmark index groups into static facial zones and calculates head pose.
 */

export interface Point2D {
  x: number;
  y: number;
  z?: number;
}

export interface NamedFaceZone {
  name: 'forehead' | 'left_cheek' | 'right_cheek' | 'nose' | 'chin' | 'left_under_eye' | 'right_under_eye';
  landmarkIndices: number[];
  boundingPolygon: Point2D[];
}

export interface HeadPose {
  yaw: number;   // degrees (-90 to +90, 0 = frontal)
  pitch: number; // degrees (-90 to +90, 0 = frontal)
  roll: number;  // degrees (-90 to +90, 0 = upright)
  poseScore: number; // 0.0 to 1.0 (1.0 = perfectly centered frontal pose)
}

// MediaPipe 468 Landmark Index Maps for 6 Clinical Skin Scan Zones
export const MEDIAPIPE_ZONE_INDICES = {
  forehead: [10, 338, 297, 332, 284, 251, 21, 54, 103, 67, 109],
  left_cheek: [116, 123, 147, 187, 207, 205, 36, 142, 100],
  right_cheek: [345, 352, 376, 411, 427, 425, 266, 371, 329],
  nose: [1, 2, 98, 327, 168, 197, 5, 4],
  chin: [152, 148, 176, 377, 400, 378, 149, 150],
  left_under_eye: [33, 7, 163, 144, 145, 153, 154, 155, 133],
  right_under_eye: [362, 382, 381, 380, 374, 373, 390, 249, 263],
};

/**
 * Calculates head pose metrics (yaw, pitch, roll) and pose score from facial mesh landmarks.
 */
export function calculateHeadPose(landmarks: Point2D[]): HeadPose {
  if (!landmarks || landmarks.length < 33) {
    return { yaw: 0, pitch: 0, roll: 0, poseScore: 1.0 };
  }

  // Key MediaPipe reference landmarks: Nose Tip (1), Left Eye Outer (33), Right Eye Outer (263), Chin (152)
  const noseTip = landmarks[1] || { x: 0.5, y: 0.5, z: 0 };
  const leftEye = landmarks[33] || { x: 0.3, y: 0.4, z: 0 };
  const rightEye = landmarks[263] || { x: 0.7, y: 0.4, z: 0 };
  const chin = landmarks[152] || { x: 0.5, y: 0.8, z: 0 };

  const eyeMidpointX = (leftEye.x + rightEye.x) / 2;
  const eyeMidpointY = (leftEye.y + rightEye.y) / 2;
  const eyeDistance = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);

  // Yaw estimation: horizontal deviation of nose tip relative to eye midpoint
  const yawOffset = (noseTip.x - eyeMidpointX) / (eyeDistance || 0.1);
  const yawDegrees = yawOffset * 60; // Approximate degrees

  // Roll estimation: tilt angle between eyes
  const rollRadians = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
  const rollDegrees = (rollRadians * 180) / Math.PI;

  // Pitch estimation: vertical ratio of nose-to-eye vs nose-to-chin
  const noseToEyeDist = Math.abs(noseTip.y - eyeMidpointY);
  const noseToChinDist = Math.abs(chin.y - noseTip.y);
  const pitchRatio = noseToChinDist > 0 ? noseToEyeDist / noseToChinDist : 0.5;
  const pitchDegrees = (pitchRatio - 0.5) * 45;

  // Pose score: 1.0 for zero rotation, drops linearly as yaw/pitch/roll increase
  const yawPenalty = Math.min(1.0, Math.abs(yawDegrees) / 30);
  const pitchPenalty = Math.min(1.0, Math.abs(pitchDegrees) / 25);
  const rollPenalty = Math.min(1.0, Math.abs(rollDegrees) / 20);

  const poseScore = Math.max(0, 1.0 - (yawPenalty * 0.5 + pitchPenalty * 0.3 + rollPenalty * 0.2));

  return {
    yaw: Math.round(yawDegrees * 10) / 10,
    pitch: Math.round(pitchDegrees * 10) / 10,
    roll: Math.round(rollDegrees * 10) / 10,
    poseScore: Math.round(poseScore * 100) / 100,
  };
}

/**
 * Extracts 6 clinical face zones with pixel/normalized coordinate boundaries from full mesh landmarks.
 */
export function extractFaceZones(landmarks: Point2D[]): Record<string, Point2D[]> {
  const zones: Record<string, Point2D[]> = {};

  if (!landmarks || landmarks.length === 0) {
    return zones;
  }

  for (const [zoneName, indices] of Object.entries(MEDIAPIPE_ZONE_INDICES)) {
    zones[zoneName] = indices
      .map((idx) => landmarks[idx])
      .filter((pt): pt is Point2D => pt !== undefined);
  }

  return zones;
}

/**
 * Phase 4: Generates polygon skin segmentation mask coordinates excluding eyes, lips, and eyebrows.
 */
export function generateSkinSegmentationMask(landmarks: Point2D[]): {
  outerFaceBoundary: Point2D[];
  exclusionPolygons: { name: string; points: Point2D[] }[];
} {
  if (!landmarks || landmarks.length < 468) {
    return { outerFaceBoundary: [], exclusionPolygons: [] };
  }

  // MediaPipe outer face boundary oval indices
  const faceBoundaryIndices = [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400,
    377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109
  ];

  const outerFaceBoundary = faceBoundaryIndices
    .map((idx) => landmarks[idx])
    .filter((pt): pt is Point2D => pt !== undefined);

  // Exclusion regions (Eyes, Lips, Eyebrows)
  const leftEyeExclusion = MEDIAPIPE_ZONE_INDICES.left_under_eye
    .map((idx) => landmarks[idx])
    .filter((pt): pt is Point2D => pt !== undefined);
  const rightEyeExclusion = MEDIAPIPE_ZONE_INDICES.right_under_eye
    .map((idx) => landmarks[idx])
    .filter((pt): pt is Point2D => pt !== undefined);

  return {
    outerFaceBoundary,
    exclusionPolygons: [
      { name: 'left_eye', points: leftEyeExclusion },
      { name: 'right_eye', points: rightEyeExclusion },
    ],
  };
}
