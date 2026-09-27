import React from 'react';
import { useRouter } from 'expo-router';
import { OrdersListScreen } from '../../../src/features/orders/OrdersListScreen';

export default function OrdersIndexRoute() {
  const router = useRouter();

  return (
    <OrdersListScreen
      onBack={() => router.back()}
      onTrackOrder={(id) => router.push('/orders/tracking' as any)}
      onViewOrderDetails={(id) => router.push(`/orders/${id}` as any)}
      onRateOrder={(id) => router.push('/orders/rate' as any)}
    />
  );
}
