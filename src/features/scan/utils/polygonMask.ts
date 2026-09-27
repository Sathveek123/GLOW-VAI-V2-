export interface Point {
  x: number;
  y: number;
}

/**
 * Ray-casting point-in-polygon test — checks whether a 2D coordinate falls
 * inside a polygon boundary.
 */
export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const pI = polygon[i];
    const pJ = polygon[j];
    if (!pI || !pJ) continue;
    const xi = pI.x;
    const yi = pI.y;
    const xj = pJ.x;
    const yj = pJ.y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Generates a binary mask (1 = skin, 0 = excluded) at the target resolution,
 * from a set of INCLUDE polygons (analyzable skin zones) and EXCLUDE polygons
 * (eyes, lips, eyebrows carved out).
 *
 * Returns a Uint8Array where 1 = valid skin pixel, 0 = excluded.
 */
export function generateSkinMask(
  includePolygons: Point[][],
  excludePolygons: Point[][],
  maskWidth: number,
  maskHeight: number,
  sourceWidth: number,
  sourceHeight: number
): Uint8Array {
  const mask = new Uint8Array(maskWidth * maskHeight);
  const scaleX = sourceWidth / maskWidth;
  const scaleY = sourceHeight / maskHeight;

  for (let my = 0; my < maskHeight; my++) {
    for (let mx = 0; mx < maskWidth; mx++) {
      const sourcePoint: Point = { x: mx * scaleX, y: my * scaleY };

      // Check if inside ANY include polygon
      let isSkin = false;
      for (const polygon of includePolygons) {
        if (polygon && isPointInPolygon(sourcePoint, polygon)) {
          isSkin = true;
          break;
        }
      }

      // If skin so far, check it's NOT inside any exclude polygon
      if (isSkin) {
        for (const polygon of excludePolygons) {
          if (polygon && isPointInPolygon(sourcePoint, polygon)) {
            isSkin = false;
            break;
          }
        }
      }

      mask[my * maskWidth + mx] = isSkin ? 1 : 0;
    }
  }

  return mask;
}

/**
 * Computes the bounding box that tightly wraps a set of polygons —
 * used to crop the image to just the analyzable face region.
 */
export function computeBoundingBox(polygons: Point[][]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const polygon of polygons) {
    if (!polygon) continue;
    for (const point of polygon) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }
  }

  if (minX === Infinity) {
    return { minX: 0, minY: 0, maxX: 400, maxY: 400 };
  }

  return { minX, minY, maxX, maxY };
}
