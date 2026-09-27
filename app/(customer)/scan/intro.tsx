import React from 'react';
import { useRouter } from 'expo-router';
import { ScanIntroScreen } from '../../../src/features/scan/ScanIntroScreen';

export default function ScanIntroRoute() {
  const router = useRouter();

  return (
    <ScanIntroScreen
      onBack={() => router.back()}
      onStartCamera={() => router.push('/scan/camera' as any)}
      onUploadPhoto={() => router.push('/scan/gallery' as any)}
    />
  );
}
