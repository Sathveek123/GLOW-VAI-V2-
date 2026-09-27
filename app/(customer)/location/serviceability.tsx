import React from 'react';
import { useRouter } from 'expo-router';
import { ServiceabilityResultScreen } from '../../../src/features/location/ServiceabilityResultScreen';

export default function ServiceabilityNestedRoute() {
  const router = useRouter();

  return (
    <ServiceabilityResultScreen
      onBack={() => router.back()}
      onStartShopping={() => {
        router.push('/(customer)/(tabs)/shop' as any);
      }}
    />
  );
}
