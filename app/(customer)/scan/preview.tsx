import React from 'react';
import { useRouter } from 'expo-router';
import { ImagePreviewScreen } from '../../../src/features/scan/ImagePreviewScreen';

export default function PreviewRoute() {
  const router = useRouter();

  return (
    <ImagePreviewScreen
      onBack={() => router.back()}
      onUsePhoto={(photoUri) =>
        router.push({
          pathname: '/(customer)/scan/analyzing' as any,
          params: { imageUri: photoUri },
        })
      }
      onRetake={() => router.push('/(customer)/scan/camera' as any)}
    />
  );
}
