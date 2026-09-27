import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '../../design';
import { safeHapticImpact } from '../../utils/haptics';

export type PermissionType = 'camera' | 'location' | 'notification';

export interface PermissionModalProps {
  visible: boolean;
  type: PermissionType;
  onClose: () => void;
  onGrant: () => void;
  onSecondaryAction?: () => void;
  permissionStatus?: 'undetermined' | 'granted' | 'denied' | 'blocked';
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  visible,
  type,
  onClose,
  onGrant,
  onSecondaryAction,
  permissionStatus = 'undetermined',
}) => {
  const handlePrimaryPress = async () => {
    await safeHapticImpact();
    if (permissionStatus === 'blocked') {
      Linking.openSettings();
    } else {
      onGrant();
    }
  };

  const handleSecondaryPress = async () => {
    await safeHapticImpact();
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      onClose();
    }
  };

  // Content specs by permission type
  const getContent = () => {
    if (type === 'camera') {
      return {
        iconName: 'camera',
        iconType: 'ionicons' as const,
        headline: permissionStatus === 'blocked' ? 'Camera Access Blocked' : 'Enable Camera Access',
        body: permissionStatus === 'blocked'
          ? 'Camera access is blocked in device settings. Please open settings to enable AI skin diagnostics.'
          : 'We use your camera only for AI skin scans. Photos are processed securely and never stored without consent.',
        microBadgeIcon: 'lock-closed',
        microBadgeText: 'Encrypted & Private',
        microBadgeColor: Colors.status.success,
        primaryCta: permissionStatus === 'blocked' ? 'Open Device Settings' : 'Grant Camera Access',
        secondaryCta: 'Skip for Now',
        valueRows: null,
      };
    }

    if (type === 'location') {
      return {
        iconName: 'location',
        iconType: 'ionicons' as const,
        headline: permissionStatus === 'blocked' ? 'Location Access Blocked' : 'Enable Location Access',
        body: permissionStatus === 'blocked'
          ? 'Location permission is blocked. Open device settings to enable automatic delivery checks.'
          : 'We use your location to check if 15-min delivery is available in your area, or show standard delivery options.',
        microBadgeIcon: 'flash-outline',
        microBadgeText: '⚡ Vijayawada: 15-45 min · 🚚 Rest of India: 3-7 days',
        microBadgeColor: Colors.dark.textSecondary,
        primaryCta: permissionStatus === 'blocked' ? 'Open Device Settings' : 'Allow While Using App',
        secondaryCta: 'Enter Address Manually',
        valueRows: null,
      };
    }

    return {
      iconName: 'notifications',
      iconType: 'ionicons' as const,
      headline: permissionStatus === 'blocked' ? 'Notification Access Blocked' : 'Stay in the Loop',
      body: permissionStatus === 'blocked'
        ? 'Notifications are blocked in settings. Enable them to track live orders and skin reports.'
        : 'Get notified when your rider is nearby, your skin report is ready, and coins land in your wallet.',
      microBadgeIcon: null,
      microBadgeText: null,
      microBadgeColor: null,
      primaryCta: permissionStatus === 'blocked' ? 'Open Device Settings' : 'Enable Notifications',
      secondaryCta: 'Not Now',
      valueRows: [
        { emoji: '🛵', text: 'Live rider tracking updates' },
        { emoji: '🔬', text: 'Scan report ready alerts' },
        { emoji: '🪙', text: 'Coin credit notifications' },
      ],
    };
  };

  const content = getContent();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdropOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.bottomSheetCard}>
              {/* Drag Handle */}
              <View style={styles.dragHandle} />

              {/* 64px Icon Badge */}
              <View style={styles.iconCircleBadge}>
                <Ionicons name={content.iconName as any} size={32} color={Colors.dark.primary} />
              </View>

              {/* Headline & Body */}
              <Text style={styles.headlineText}>{content.headline}</Text>
              <Text style={styles.bodyText}>{content.body}</Text>

              {/* Conditional 3 Value Rows for Notifications */}
              {content.valueRows ? (
                <View style={styles.valueRowsContainer}>
                  {content.valueRows.map((row, idx) => (
                    <View key={idx} style={styles.valueRow}>
                      <Text style={styles.valueRowEmoji}>{row.emoji}</Text>
                      <Text style={styles.valueRowText}>{row.text}</Text>
                    </View>
                  ))}
                </View>
              ) : content.microBadgeIcon ? (
                /* Micro-Note Badge */
                <View style={styles.microBadgeRow}>
                  <Ionicons name={content.microBadgeIcon as any} size={14} color={content.microBadgeColor!} />
                  <Text style={[styles.microBadgeText, { color: content.microBadgeColor! }]}>
                    {content.microBadgeText}
                  </Text>
                </View>
              ) : null}

              {/* Primary CTA */}
              <TouchableOpacity
                style={styles.primaryCtaBtn}
                onPress={handlePrimaryPress}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryCtaText}>{content.primaryCta}</Text>
              </TouchableOpacity>

              {/* Secondary Action Link */}
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={handleSecondaryPress}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryText}>{content.secondaryCta}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PermissionModal;

const styles = StyleSheet.create({
  backdropOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 30, 0.75)',
    justifyContent: 'flex-end',
  },
  bottomSheetCard: {
    backgroundColor: Colors.dark.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  iconCircleBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(26, 115, 232, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26, 115, 232, 0.25)',
    marginBottom: 16,
  },
  headlineText: {
    ...Typography.headingLg,
    fontSize: 19,
    color: Colors.dark.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  bodyText: {
    ...Typography.bodyMd,
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
    marginBottom: 14,
  },
  valueRowsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  valueRowEmoji: {
    fontSize: 16,
  },
  valueRowText: {
    ...Typography.bodySm,
    color: Colors.dark.textPrimary,
    fontSize: 13,
  },
  microBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  microBadgeText: {
    ...Typography.labelSm,
    fontSize: 11,
  },
  primaryCtaBtn: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryCtaText: {
    ...Typography.labelMd,
    color: '#FFFFFF',
    fontSize: 15,
  },
  secondaryBtn: {
    paddingVertical: 8,
  },
  secondaryText: {
    ...Typography.bodySm,
    color: Colors.dark.textSecondary,
  },
});
