import React from 'react';
import { useRouter } from 'expo-router';
import { OrderDetailsScreen } from '../../../src/features/orders/OrderDetailsScreen';

export default function OrderDetailsRoute() {
  const router = useRouter();

  return (
    <OrderDetailsScreen
      onBack={() => router.back()}
      onRateOrder={() => router.push('/orders/rate' as any)}
    />
  );
}
