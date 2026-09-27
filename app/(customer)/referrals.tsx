import React from 'react';
import { useRouter } from 'expo-router';
import { ReferralHubScreen } from '../../src/features/referrals/ReferralHubScreen';

export default function ReferralsRoute() {
  const router = useRouter();

  return (
    <ReferralHubScreen
      onBack={() => router.back()}
      onVerifyStudent={() => router.push('/student-verify' as any)}
    />
  );
}
