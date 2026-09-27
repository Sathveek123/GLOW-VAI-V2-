/**
 * GlowVAI — Image Preprocessing Bridge (Phase 6)
 * ================================================
 * Bridges Phase 3's face segmentation output into the exact pixel format
 * that skinModelService.ts / the ONNX model expects.
 *
 * Pipeline:
 *   captured imageUri (from camera/gallery)
 *     ↓ crop to face bounding box
 *     ↓ resize to 224×224
 *     ↓ decode PNG → raw RGB Uint8Array
 *     ↓ apply Phase 3 skin mask (zero out non-skin pixels)
 *     → maskedPixels: Uint8Array [224*224*3] → passed to runSkinAnalysis()
 *
 * Dependencies:
 *   expo-image-manipulator  — already in project (crop + resize)
 *   react-native-image-pixels — ADD: npm install react-native-image-pixels
 *                               Required for PNG → raw RGB decode in RN
 *                               (no native Canvas/ImageData API in RN)
 *
 * NOTE on base64PngToRgbPixels:
 *   React Native has no native Canvas API. The real pixel decode uses
 *   react-native-image-pixels, which exposes a native module for exactly
 *   this purpose. The function signature is the contract — see the
 *   wiring comment inside for the exact call.
 */

import * as ImageManipulator from 'expo-image-manipulator';
import jpeg from 'jpeg-js';
import { Buffer } from 'buffer';

// ─── Face bounding box (from Phase 2 MediaPipe landmark detection) ───────────
export interface FaceCropBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// ─── Preprocessing result consumed by skinModelService.runSkinAnalysis() ─────
export interface ModelInputPixels {
  /** 224×224 RGB, HWC, 0–255 — the raw image before masking */
  rgbPixels: Uint8Array;
  /** 224×224 RGB, HWC, 0–255 — non-skin pixels zeroed by Phase 3 mask */
  maskedPixels: Uint8Array;
  /** Actual resized dimensions (always 224 × 224 for this model) */
  width: 224;
  height: 224;
}

// ─── Main preprocessing function ─────────────────────────────────────────────

/**
 * Prepares a captured image for ONNX model inference.
 *
 * Steps:
 *   1. Crop to face bounding box (clamped to image bounds)
 *   2. Resize crop to 224×224
 *   3. Decode to raw RGB Uint8Array
 *   4. Apply Phase 3 skin mask
 *
 * @param imageUri        Local file URI from camera capture or gallery pick
 * @param faceCropBounds  Face bounding box from MediaPipe (Phase 2)
 * @param skinMask        Uint8Array [224*224]: 1=skin pixel, 0=non-skin
 *                        (must be pre-computed for 224×224 space)
 * @param originalWidth   Full captured image width in pixels
 * @param originalHeight  Full captured image height in pixels
 */
export async function prepareModelInput(
  imageUri: string,
  faceCropBounds: FaceCropBounds,
  skinMask: Uint8Array,
  originalWidth: number,
  originalHeight: number
): Promise<ModelInputPixels> {
  // ── 1. Validate bounding box ──────────────────────────────────────────────
  const cropW = faceCropBounds.maxX - faceCropBounds.minX;
  const cropH = faceCropBounds.maxY - faceCropBounds.minY;

  if (cropW <= 0 || cropH <= 0) {
    throw new Error(
      `[Preprocessing] Invalid face crop bounds: ` +
        `w=${cropW}, h=${cropH}. ` +
        'MediaPipe landmark geometry produced a degenerate bounding box. ' +
        'Ensure the face is clearly visible in the captured image.'
    );
  }

  // ── 2. Clamp to image bounds (prevents ImageManipulator crash) ────────────
  const clampedOriginX = Math.max(0, Math.floor(faceCropBounds.minX));
  const clampedOriginY = Math.max(0, Math.floor(faceCropBounds.minY));
  const clampedWidth = Math.min(
    Math.ceil(cropW),
    originalWidth - clampedOriginX
  );
  const clampedHeight = Math.min(
    Math.ceil(cropH),
    originalHeight - clampedOriginY
  );

  // ── 3. Crop + resize via expo-image-manipulator ───────────────────────────
  let base64Jpeg: string | undefined;
  try {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        {
          crop: {
            originX: clampedOriginX,
            originY: clampedOriginY,
            width: clampedWidth,
            height: clampedHeight,
          },
        },
        { resize: { width: 224, height: 224 } },
      ],
      { format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    base64Jpeg = result.base64;
  } catch (err) {
    throw new Error(
      `[Preprocessing] ImageManipulator failed for ${imageUri}: ${String(err)}`
    );
  }

  if (!base64Jpeg) {
    throw new Error(`[Preprocessing] ImageManipulator returned empty base64 string for ${imageUri}`);
  }

  // ── 4. Decode base64 JPEG → raw RGB Uint8Array ───────────────────────────
  const rgbPixels = await decodeImageToRgb(base64Jpeg, 224, 224);

  // ── 5. Apply Phase 3 skin mask ────────────────────────────────────────────
  // Zero out all non-skin pixels so the model focuses only on skin regions.
  const maskedPixels = applyMaskToRgb(rgbPixels, skinMask, 224, 224);

  return {
    rgbPixels,
    maskedPixels,
    width: 224,
    height: 224,
  };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Decodes a base64-encoded JPEG image string to a flat RGB Uint8Array (HWC, 0–255).
 */
export async function decodeImageToRgb(
  base64Data: string,
  width: number,
  height: number
): Promise<Uint8Array> {
  try {
    const rawBuffer = Buffer.from(base64Data, 'base64');
    const decoded = jpeg.decode(rawBuffer, { useTArray: true, formatAsRGBA: true });

    if (!decoded || !decoded.data) {
      throw new Error('jpeg-js returned empty frame data');
    }

    const rgbPixels = rgbaToRgb(decoded.data, width, height);
    if (rgbPixels.length !== width * height * 3) {
      throw new Error(
        `Unexpected decoded pixel buffer length: expected ${width * height * 3}, got ${rgbPixels.length}`
      );
    }

    return rgbPixels;
  } catch (err) {
    throw new Error(`[Preprocessing] Failed to decode JPEG pixels: ${String(err)}`);
  }
}

/**
 * Converts RGBA Uint8Array (from react-native-image-pixels) to RGB Uint8Array
 * by stripping the alpha channel.
 *
 * @param rgba   Flat RGBA Uint8Array [R, G, B, A, R, G, B, A, ...]
 * @param width  Image width
 * @param height Image height
 */
export function rgbaToRgb(rgba: Uint8Array, width: number, height: number): Uint8Array {
  const pixelCount = width * height;
  const rgb = new Uint8Array(pixelCount * 3);
  for (let i = 0; i < pixelCount; i++) {
    rgb[i * 3]     = rgba[i * 4] ?? 0;     // R
    rgb[i * 3 + 1] = rgba[i * 4 + 1] ?? 0; // G
    rgb[i * 3 + 2] = rgba[i * 4 + 2] ?? 0; // B
    // alpha (rgba[i*4+3]) discarded
  }
  return rgb;
}

/**
 * Applies a binary skin mask to an RGB pixel array.
 * Non-skin pixels (mask[i] === 0) are set to 0 in all channels.
 *
 * @param rgb    Flat RGB Uint8Array [R, G, B, ...]
 * @param mask   Uint8Array of length width*height, values 0 or 1
 * @param width  Image width
 * @param height Image height
 */
export function applyMaskToRgb(
  rgb: Uint8Array,
  mask: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  const pixelCount = width * height;

  if (mask.length !== pixelCount) {
    throw new Error(
      `[Preprocessing] Mask length (${mask.length}) ≠ pixel count (${pixelCount}). ` +
        'Mask must be a flat Uint8Array of length width × height.'
    );
  }

  const masked = new Uint8Array(rgb.length);
  for (let i = 0; i < pixelCount; i++) {
    if (mask[i] === 1) {
      masked[i * 3]     = rgb[i * 3] ?? 0;
      masked[i * 3 + 1] = rgb[i * 3 + 1] ?? 0;
      masked[i * 3 + 2] = rgb[i * 3 + 2] ?? 0;
    }
    // else: all three channels remain 0 (black = absent from skin region)
  }
  return masked;
}

/**
 * Serialises a Uint8Array to a base64 string for passing through Expo Router
 * params (route params must be strings). Used to pass the skin mask
 * from ImagePreviewScreen → ScanAnalysisScreen.
 */
export function maskToBase64(mask: Uint8Array): string {
  return Buffer.from(mask).toString('base64');
}

/**
 * Deserialises a base64 string back to a Uint8Array.
 * Used in ScanAnalysisScreen to reconstruct the mask from route params.
 */
export function base64ToMask(b64: string): Uint8Array {
  return new Uint8Array(Buffer.from(b64, 'base64'));
}
