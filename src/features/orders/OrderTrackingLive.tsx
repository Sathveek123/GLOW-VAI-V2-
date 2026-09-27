import React from 'react';
import { LiveRiderTrackingScreen } from './LiveRiderTrackingScreen';

export interface OrderTrackingLiveProps {
  orderId?: string;
  onBack?: () => void;
  onCallRider?: () => void;
  onChatRider?: () => void;
}

export const OrderTrackingLive: React.FC<OrderTrackingLiveProps> = ({
  onBack,
  onCallRider,
  onChatRider,
}) => {
  return (
    <LiveRiderTrackingScreen
      onBack={onBack}
      onCallRider={onCallRider}
      onChatRider={onChatRider}
    />
  );
};
