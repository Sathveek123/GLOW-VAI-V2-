import React from 'react';
import { useRouter } from 'expo-router';
import { SavedAddressesScreen } from '../../src/features/location/SavedAddressesScreen';

export default function SavedAddressesRoute() {
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
