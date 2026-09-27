import React from 'react';
import { useRouter } from 'expo-router';
import { SettingsAndSecurityScreen } from '../../../src/features/settings/SettingsAndSecurityScreen';

export default function SettingsIndexRoute() {
  const router = useRouter();

  return (
    <SettingsAndSecurityScreen
      onBack={() => router.back()}
      onSignOut={() => router.push('/onboarding' as any)}
    />
  );
}
