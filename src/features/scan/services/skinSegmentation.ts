import { PostCaptureResult } from './postCaptureAnalysis';
import { ANALYZABLE_ZONES, EXCLUSION_ZONES } from '../utils/faceZones';
import { generateSkinMask, computeBoundingBox, Point } from '../utils/polygonMask';

export interface SegmentationResult {
  mask: Uint8Array;
  maskWidth: number;
  maskHeight: number;
  faceCropBounds: { minX: number; minY: number; maxX: number; maxY: number };
  perZoneMasks: Record<string, Uint8Array>; // separate mask per zone, for zone-level scoring
}

const MODEL_INPUT_SIZE = 224; // matches Phase 5's model input dimension

/**
 * Builds the full skin mask + per-zone sub-masks from Phase 2's
 * zoneBoundaries output. This is pure geometry — no ML model runs here.
 */
export function buildSkinSegmentation(
  postCaptureResult: PostCaptureResult,
  sourceWidth: number,
  sourceHeight: number
): SegmentationResult {
  if (!postCaptureResult.zoneBoundaries) {
    throw new Error('buildSkinSegmentation: no zone boundaries available — run postCaptureAnalysis first');
  }

  const { zoneBoundaries } = postCaptureResult;

  const includePolygons: Point[][] = ANALYZABLE_ZONES.map(
    (zoneName) => zoneBoundaries[zoneName]
  ).filter((p): p is Point[] => Array.isArray(p));

  const excludePolygons: Point[][] = EXCLUSION_ZONES.map(
    (zoneName) => zoneBoundaries[zoneName]
  ).filter((p): p is Point[] => Array.isArray(p));

  const fullMask = generateSkinMask(
    includePolygons,
    excludePolygons,
    MODEL_INPUT_SIZE,
    MODEL_INPUT_SIZE,
    sourceWidth,
    sourceHeight
  );

  const faceCropBounds = computeBoundingBox(includePolygons);

  // Per-zone masks — each zone gets its own binary mask (same resolution),
  // letting the Phase 5 model or a rules layer compute zone-level scores
  const perZoneMasks: Record<string, Uint8Array> = {};
  for (const zoneName of ANALYZABLE_ZONES) {
    const zonePolygon = zoneBoundaries[zoneName];
    if (!zonePolygon) continue;

    perZoneMasks[zoneName] = generateSkinMask(
      [zonePolygon],
      excludePolygons,
      MODEL_INPUT_SIZE,
      MODEL_INPUT_SIZE,
      sourceWidth,
      sourceHeight
    );
  }

  return {
    mask: fullMask,
    maskWidth: MODEL_INPUT_SIZE,
    maskHeight: MODEL_INPUT_SIZE,
    faceCropBounds,
    perZoneMasks,
  };
}

/**
 * Applies a mask to RGB pixel data — zeroes out (or sets to neutral gray)
 * any pixel where mask === 0, so only skin pixels reach the Phase 5 model.
 */
export function applyMaskToPixels(
  pixels: Uint8Array,
  mask: Uint8Array,
  channels: 3 | 4 = 3
): Uint8Array {
  if (pixels.length !== mask.length * channels) {
    throw new Error(
      `applyMaskToPixels: pixel array length (${pixels.length}) does not match mask length × channels (${mask.length * channels}) — dimension mismatch`
    );
  }

  const output = new Uint8Array(pixels.length);

  for (let i = 0; i < mask.length; i++) {
    const isSkin = mask[i] === 1;
    for (let c = 0; c < channels; c++) {
      const pixelIdx = i * channels + c;
      const pxVal = pixels[pixelIdx] ?? 128;
      output[pixelIdx] = isSkin ? pxVal : 128; // neutral gray for excluded regions
    }
  }

  return output;
}
