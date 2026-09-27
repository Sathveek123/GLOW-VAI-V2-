import React from 'react';
import { useRouter } from 'expo-router';
import { CameraViewfinderScreen } from '../../../src/features/scan/CameraViewfinderScreen';

export default function CameraRoute() {
  const router = useRouter();

  return (
    <CameraViewfinderScreen
      onBack={() => router.back()}
      onCapturePass={(photoUri) =>
        router.push({
          pathname: '/(customer)/scan/preview' as any,
          params: { photoUri },
        })
      }
    />
  );
}
