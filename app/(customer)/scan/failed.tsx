import React from 'react';
import { useRouter } from 'expo-router';
import { ScanFailedScreen } from '../../../src/features/scan/ScanFailedScreen';

export default function FailedRoute() {
  const router = useRouter();

  return (
    <ScanFailedScreen
      onBack={() => router.back()}
      onRetake={() => router.push('/scan/camera' as any)}
      onChoosePhoto={() => router.push('/scan/gallery' as any)}
    />
  );
}
