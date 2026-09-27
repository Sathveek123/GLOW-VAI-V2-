import React from 'react';
import { useRouter } from 'expo-router';
import { GalleryUploadScreen } from '../../../src/features/scan/GalleryUploadScreen';

export default function GalleryRoute() {
  const router = useRouter();

  return (
    <GalleryUploadScreen
      onBack={() => router.back()}
      onPhotoSelected={(photoUri) =>
        router.push({
          pathname: '/(customer)/scan/preview' as any,
          params: { photoUri },
        })
      }
      onOpenCamera={() => router.push('/(customer)/scan/camera' as any)}
    />
  );
}
