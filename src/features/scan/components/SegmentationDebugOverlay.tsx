import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { PostCaptureResult } from '../services/postCaptureAnalysis';
import { ANALYZABLE_ZONES, EXCLUSION_ZONES } from '../utils/faceZones';

interface Props {
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  postCaptureResult: PostCaptureResult;
  displayWidth: number;
  displayHeight: number;
}

const ZONE_COLORS: Record<string, string> = {
  forehead: 'rgba(45,157,95,0.35)',
  left_cheek: 'rgba(212,71,44,0.35)',
  right_cheek: 'rgba(212,71,44,0.35)',
  nose: 'rgba(245,158,11,0.35)',
  chin: 'rgba(139,92,246,0.35)',
  left_under_eye: 'rgba(59,130,246,0.35)',
  right_under_eye: 'rgba(59,130,246,0.35)',
};

const EXCLUDE_COLOR = 'rgba(0,0,0,0.5)';

/**
 * Dev-only diagnostic component: renders the actual computed zone
 * polygons as colored overlays on top of the real captured photo.
 * Use this to visually verify Phase 2/3's geometry is correct on real faces.
 */
export function SegmentationDebugOverlay({
  imageUri,
  imageWidth,
  imageHeight,
  postCaptureResult,
  displayWidth,
  displayHeight,
}: Props) {
  if (!postCaptureResult.zoneBoundaries) return null;

  const scaleX = displayWidth / imageWidth;
  const scaleY = displayHeight / imageHeight;

  const scalePoints = (points: { x: number; y: number }[]) =>
    points.map((p) => `${p.x * scaleX},${p.y * scaleY}`).join(' ');

  return (
    <View style={[styles.container, { width: displayWidth, height: displayHeight }]}>
      <Image
        source={{ uri: imageUri }}
        style={{ width: displayWidth, height: displayHeight }}
        resizeMode="cover"
      />
      <Svg
        style={StyleSheet.absoluteFill}
        width={displayWidth}
        height={displayHeight}
        viewBox={`0 0 ${displayWidth} ${displayHeight}`}
      >
        {ANALYZABLE_ZONES.map((zoneName) => {
          const polygon = postCaptureResult.zoneBoundaries![zoneName];
          if (!polygon) return null;
          return (
            <Polygon
              key={zoneName}
              points={scalePoints(polygon)}
              fill={ZONE_COLORS[zoneName] ?? 'rgba(200,200,200,0.35)'}
              stroke={ZONE_COLORS[zoneName]?.replace('0.35', '0.9') ?? '#999'}
              strokeWidth={1.5}
            />
          );
        })}
        {EXCLUSION_ZONES.map((zoneName) => {
          const polygon = postCaptureResult.zoneBoundaries![zoneName];
          if (!polygon) return null;
          return (
            <Polygon
              key={zoneName}
              points={scalePoints(polygon)}
              fill={EXCLUDE_COLOR}
              stroke="rgba(0,0,0,0.8)"
              strokeWidth={1}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
});

export default SegmentationDebugOverlay;
