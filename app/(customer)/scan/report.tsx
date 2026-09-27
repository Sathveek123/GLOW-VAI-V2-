import React from 'react';
import { useRouter } from 'expo-router';
import { SkinReportScreen } from '../../../src/features/scan/SkinReportScreen';

export default function ReportRoute() {
  const router = useRouter();

  return (
    <SkinReportScreen
      onBack={() => router.back()}
      onRetake={() => router.push('/scan/camera' as any)}
      onShopRoutine={() => router.push('/(customer)/(tabs)/cart' as any)}
    />
  );
}
