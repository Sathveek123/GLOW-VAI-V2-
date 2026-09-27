/**
 * Screen 16: Authentication Error & Recovery Overlay Component
 * Mode A — Atmospheric Dark background
 * Component Classification: src/components/ui/ErrorState.tsx
 * Supports both modal bottom sheet and inline banner rendering variants
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ViewStyle,
} from 'react-native';
import { AlertTriangle, WifiOff } from 'lucide-react-native';
import { ModeA, StatusColors, Typography, Spacing, BorderRadius } from '../../design';
import { mapFirebaseError, FormattedError } from '../../utils/firebaseErrorMap';
import { openWhatsAppSupport } from '../../utils/whatsapp';

export interface ErrorStateProps {
  errorCode?: string;
  customTitle?: string;
  customMessage?: string;
  variant?: 'modal' | 'banner';
  visible?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  onContactSupport?: () => void;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  errorCode = 'generic/unknown',
  customTitle,
  customMessage,
  variant = 'modal',
  visible = true,
  onRetry,
  onDismiss,
  onContactSupport,
  style,
}) => {
  const errorDetails: FormattedError = mapFirebaseError(errorCode);
  const title = customTitle || errorDetails.headline;
  const message = customMessage || errorDetails.body;

  const handleSupportPress = () => {
    if (onContactSupport) {
      onContactSupport();
    } else {
      openWhatsAppSupport(`Hi, I'm having trouble with: ${errorCode}`);
    }
  };

  const renderContent = () => (
    <View style={styles.card}>
      {/* 56px circular badge */}
      <View style={styles.iconBadge}>
        {errorDetails.iconType === 'wifi-off' ? (
          <WifiOff size={28} color={StatusColors.error} strokeWidth={2} />
        ) : (
          <AlertTriangle size={28} color={StatusColors.error} strokeWidth={2} />
        )}
      </View>

      {/* Dynamic Headline */}
      <Text style={styles.headline}>{title}</Text>

      {/* Dynamic Body */}
      <Text style={styles.body} numberOfLines={2}>
        {message}
      </Text>

      {/* Primary CTA */}
      {onRetry && (
        <TouchableOpacity
          style={[
            styles.primaryButton,
            errorCode === 'auth/too-many-requests' && styles.disabledButton,
          ]}
          onPress={onRetry}
          disabled={errorCode === 'auth/too-many-requests'}
          activeOpacity={0.8}
          accessibilityLabel={errorDetails.primaryCtaText}
        >
          <Text style={styles.primaryButtonText}>{errorDetails.primaryCtaText}</Text>
        </TouchableOpacity>
      )}

      {/* Secondary CTA / Support Link */}
      {(errorDetails.showSupportLink || onContactSupport) && (
        <TouchableOpacity
          style={styles.supportButton}
          onPress={handleSupportPress}
          activeOpacity={0.7}
        >
          <Text style={styles.supportText}>Contact Support</Text>
        </TouchableOpacity>
      )}

      {onDismiss && (
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={onDismiss}
          activeOpacity={0.7}
        >
          <Text style={styles.dismissText}>Dismiss</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (!visible) return null;

  if (variant === 'banner') {
    return <View style={[styles.bannerContainer, style]}>{renderContent()}</View>;
  }

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onDismiss}
        />
        <View style={[styles.modalSheet, style]}>{renderContent()}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 30, 0.75)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: ModeA.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: ModeA.border,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  bannerContainer: {
    backgroundColor: ModeA.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: ModeA.border,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
  },
  card: {
    alignItems: 'center',
    width: '100%',
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: `${StatusColors.error}1F`, // 12% opacity fill
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  headline: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: ModeA.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  body: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
    color: ModeA.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
    maxWidth: 280,
  },
  primaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: ModeA.primary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
  },
  supportButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
  },
  supportText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: ModeA.textSecondary,
    textDecorationLine: 'underline',
  },
  dismissButton: {
    paddingVertical: Spacing.xs,
    marginTop: Spacing.xs,
  },
  dismissText: {
    fontSize: Typography.sizes.xs,
    color: ModeA.textSecondary,
  },
});
