import React from 'react';
import { useRouter } from 'expo-router';
import { ProfileOverviewScreen } from '../../../src/features/profile/ProfileOverviewScreen';

export default function ProfileTabRoute() {
  const router = useRouter();

  return (
    <ProfileOverviewScreen
      onNavigateToSkinReport={() => router.push('/scan/report' as any)}
      onNavigateToOrders={() => router.push('/orders' as any)}
      onNavigateToWishlist={() => router.push('/wishlist' as any)}
      onNavigateToRewards={() => router.push('/referrals' as any)}
      onNavigateToAddresses={() => router.push('/saved-addresses' as any)}
      onNavigateToPayments={() => router.push('/payment-method' as any)}
      onNavigateToSupport={() => router.push('/support' as any)}
      onNavigateToSettings={() => router.push('/settings' as any)}
    />
  );
}
