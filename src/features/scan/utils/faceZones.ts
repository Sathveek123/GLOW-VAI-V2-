// MediaPipe FaceMesh landmark index groups.
// Reference: https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/python/solutions/face_mesh_connections.py
// Standard, stable indices mapped to clinical face zones.

export const FACE_ZONE_LANDMARKS = {
  forehead: [10, 67, 69, 108, 151, 337, 299, 297, 338, 10],
  left_cheek: [116, 117, 118, 119, 100, 126, 209, 129, 203],
  right_cheek: [345, 346, 347, 348, 329, 355, 429, 358, 423],
  nose: [1, 2, 98, 327, 168, 197, 195, 5],
  chin: [17, 18, 200, 199, 175, 152, 148, 176],
  left_under_eye: [25, 110, 24, 23, 22, 26, 112, 243],
  right_under_eye: [255, 339, 254, 253, 252, 256, 341, 463],
  // Exclusion zones — never analyzed as "skin"
  left_eye: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
  right_eye: [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398],
  lips: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95],
  eyebrows: [70, 63, 105, 66, 107, 55, 65, 52, 53, 46, 336, 296, 334, 293, 300, 285, 295, 282, 283, 276],
} as const;

export type FaceZoneName = Exclude<
  keyof typeof FACE_ZONE_LANDMARKS,
  'left_eye' | 'right_eye' | 'lips' | 'eyebrows'
>;

export const ANALYZABLE_ZONES: FaceZoneName[] = [
  'forehead',
  'left_cheek',
  'right_cheek',
  'nose',
  'chin',
  'left_under_eye',
  'right_under_eye',
];

export const EXCLUSION_ZONES = ['left_eye', 'right_eye', 'lips', 'eyebrows'] as const;

/**
 * Given normalized MediaPipe landmarks (468 points, each {x,y,z} in 0-1
 * range relative to image dimensions), returns pixel-space polygon
 * boundaries for each zone against the actual image size.
 */
export function computeZoneBoundaries(
  landmarks: { x: number; y: number; z: number }[],
  imageWidth: number,
  imageHeight: number
): Record<string, { x: number; y: number }[]> {
  const zones: Record<string, { x: number; y: number }[]> = {};

  const allZoneKeys = [...ANALYZABLE_ZONES, ...EXCLUSION_ZONES] as (keyof typeof FACE_ZONE_LANDMARKS)[];

  for (const zoneName of allZoneKeys) {
    const indices = FACE_ZONE_LANDMARKS[zoneName];
    zones[zoneName] = indices.map((idx) => {
      const point = landmarks[idx];
      if (!point) {
        throw new Error(`Landmark index ${idx} missing for zone ${zoneName} — model output malformed`);
      }
      return { x: point.x * imageWidth, y: point.y * imageHeight };
    });
  }

  return zones;
}
