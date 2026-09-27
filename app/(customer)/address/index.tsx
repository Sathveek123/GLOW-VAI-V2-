import React from 'react';
import { useRouter } from 'expo-router';
import { SavedAddressesScreen } from '../../../src/features/location/SavedAddressesScreen';

export default function AddressIndexRoute() {
  const router = useRouter();

  return (
    <SavedAddressesScreen
      onBack={() => router.back()}
      onSelectAddress={() => {
        router.push('/serviceability' as any);
      }}
    />
  );
}
