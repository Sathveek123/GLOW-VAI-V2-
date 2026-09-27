import React from 'react';
import { useRouter } from 'expo-router';
import { LocationSetupScreen } from '../../src/features/location/LocationSetupScreen';

export default function LocationSetupRoute() {
  const router = useRouter();

  return (
    <LocationSetupScreen
      onBack={() => router.back()}
      onSelectAddress={() => router.push('/(customer)/(tabs)')}
      onNavigateToMapPicker={({ latitude, longitude, addressString }) => {
        router.push({
          pathname: '/(customer)/map-picker' as any,
          params: {
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            addressString,
          },
        });
      }}
    />
  );
}

