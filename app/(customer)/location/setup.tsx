import React from 'react';
import { useRouter } from 'expo-router';
import { LocationSetupScreen } from '../../../src/features/location/LocationSetupScreen';

export default function LocationSetupNestedRoute() {
  const router = useRouter();

  return (
    <LocationSetupScreen
      onBack={() => router.back()}
      onSelectAddress={() => router.push('/map-picker' as any)}
      onNavigateToMapPicker={({ addressString }) => {
        router.push({
          pathname: '/map-picker' as any,
          params: { address: addressString },
        });
      }}
    />
  );
}
