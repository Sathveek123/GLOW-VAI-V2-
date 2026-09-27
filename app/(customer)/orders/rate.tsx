import React from 'react';
import { useRouter } from 'expo-router';
import { RateOrderDeliveryScreen } from '../../../src/features/orders/RateOrderDeliveryScreen';

export default function RateOrderRoute() {
  const router = useRouter();

  return (
    <RateOrderDeliveryScreen
      onBack={() => router.back()}
      onSubmitSuccess={() => router.push('/orders' as any)}
    />
  );
}
