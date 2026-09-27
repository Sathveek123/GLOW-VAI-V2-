import React from 'react';
import { useRouter } from 'expo-router';
import { StudentVerificationScreen } from '../../src/features/referrals/StudentVerificationScreen';

export default function StudentVerifyRoute() {
  const router = useRouter();

  return (
    <StudentVerificationScreen
      onBack={() => router.back()}
      onSubmitSuccess={() => router.push('/referrals' as any)}
    />
  );
}
