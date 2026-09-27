import React from 'react';
import { useRouter } from 'expo-router';
import { MapPinPickerScreen } from '../../src/features/location/MapPinPickerScreen';

export default function MapPickerRoute() {
  const router = useRouter();

  return (
    <MapPinPickerScreen
      onBack={() => router.back()}
      onConfirmLocation={(loc) => {
        router.push({
          pathname: '/add-address' as any,
          params: { address: loc },
        });
      }}
    />
  );
}
