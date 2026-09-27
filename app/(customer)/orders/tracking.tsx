import React from 'react';
import { useRouter } from 'expo-router';
import { LiveRiderTrackingScreen } from '../../../src/features/orders/LiveRiderTrackingScreen';

export default function TrackingRoute() {
  const router = useRouter();

  return (
    <LiveRiderTrackingScreen
      onBack={() => router.back()}
    />
  );
}
