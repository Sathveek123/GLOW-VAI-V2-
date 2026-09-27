import React from 'react';
import { useRouter } from 'expo-router';
import { HelpAndSupportScreen } from '../../src/features/support/HelpAndSupportScreen';

export default function SupportRoute() {
  const router = useRouter();

  return (
    <HelpAndSupportScreen
      onBack={() => router.back()}
      onSelectOrder={() => router.push('/orders' as any)}
    />
  );
}
