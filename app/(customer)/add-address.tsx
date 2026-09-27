import React from 'react';
import { useRouter } from 'expo-router';
import { AddAddressScreen } from '../../src/features/location/AddAddressScreen';

export default function AddAddressRoute() {
  const router = useRouter();

  return (
    <AddAddressScreen
      onBack={() => router.back()}
      onSaveAddress={() => {
        router.push('/serviceability' as any);
      }}
    />
  );
}
