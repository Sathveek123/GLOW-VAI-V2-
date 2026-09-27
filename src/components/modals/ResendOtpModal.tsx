import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '../../design';
import { safeHapticImpact } from '../../utils/haptics';

export interface ResendOtpModalProps {
  visible: boolean;
  phoneNumber: string;
  countdown: number;
  onClose: () => void;
  onResendSms: () => void;
  onEditNumber: () => void;
}

export const ResendOtpModal: React.FC<ResendOtpModalProps> = ({
  visible,
  phoneNumber,
  countdown,
  onClose,
  onResendSms,
  onEditNumber,
}) => {
  const isTimerActive = countdown > 0;

  const handleResend = async () => {
    if (isTimerActive) return;
    await safeHapticImpact();
    onResendSms();
  };

  const handleEdit = async () => {
    await safeHapticImpact();
    onEditNumber();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdropOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Header Row */}
              <View style={styles.headerRow}>
                <Text style={styles.headlineTitle}>Trouble receiving code?</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                  <Ionicons name="close" size={18} color={Colors.dark.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Action Rows Stack */}
              <View style={styles.rowsStack}>
                {/* Row 1: Resend SMS */}
                <TouchableOpacity
                  style={[styles.actionRow, isTimerActive && styles.actionRowDisabled]}
                  onPress={handleResend}
                  disabled={isTimerActive}
                  activeOpacity={0.7}
                >
                  <Text style={styles.rowIcon}>📱</Text>
                  <View style={styles.rowTextCol}>
                    <Text style={[styles.rowTitle, isTimerActive && styles.rowTitleDisabled]}>
                      Resend SMS
                    </Text>
                    <Text style={styles.rowSubtext}>
                      {isTimerActive
                        ? `Resend in 0:${countdown < 10 ? `0${countdown}` : countdown}`
                        : `To ${phoneNumber}`}
                    </Text>
                  </View>
                  {!isTimerActive && (
                    <Ionicons name="chevron-forward" size={16} color={Colors.dark.textSecondary} />
                  )}
                </TouchableOpacity>

                <View style={styles.rowDivider} />

                {/* Row 2: Edit Mobile Number */}
                <TouchableOpacity style={styles.actionRow} onPress={handleEdit} activeOpacity={0.7}>
                  <Text style={styles.rowIcon}>✏️</Text>
                  <View style={styles.rowTextCol}>
                    <Text style={styles.rowTitle}>Edit mobile number</Text>
                    <Text style={styles.rowSubtext}>Correct a typo in {phoneNumber}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.dark.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ResendOtpModal;

const styles = StyleSheet.create({
  backdropOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 30, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headlineTitle: {
    ...Typography.headingSm,
    fontSize: 17,
    color: Colors.dark.textPrimary,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowsStack: {
    gap: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 12,
  },
  actionRowDisabled: {
    opacity: 0.6,
  },
  rowIcon: {
    fontSize: 20,
  },
  rowTextCol: {
    flex: 1,
  },
  rowTitle: {
    ...Typography.headingSm,
    fontSize: 14,
    color: Colors.dark.textPrimary,
  },
  rowTitleDisabled: {
    color: Colors.dark.textSecondary,
  },
  rowSubtext: {
    ...Typography.bodySm,
    color: Colors.dark.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: 4,
  },
});
