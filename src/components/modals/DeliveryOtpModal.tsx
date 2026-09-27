import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { ShieldCheck, X, Copy, Bike } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact } from '../../utils/haptics';

interface DeliveryOtpModalProps {
  visible: boolean;
  onClose: () => void;
  otp?: string;
  orderId?: string;
  riderName?: string;
}

export const DeliveryOtpModal: React.FC<DeliveryOtpModalProps> = ({
  visible,
  onClose,
  otp = '4892',
  orderId = 'GV28491',
  riderName = 'Rahul',
}) => {
  const insets = useSafeAreaInsets();
  const digits = otp.split('');

  const handleCopy = () => {
    safeHapticImpact();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.dragHandle} />

          <View style={styles.headerRow}>
            <View style={styles.badge}>
              <ShieldCheck size={20} color="#00C4CC" />
            </View>
            <Text style={styles.modalTitle}>Delivery Handshake OTP</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color="#6B6B6B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtext}>
            Share this 4-digit PIN with <Text style={{ fontFamily: 'Poppins-Bold' }}>{riderName}</Text> upon receiving package #{orderId}.
          </Text>

          {/* 4 GLOWING OTP BOXES */}
          <View style={styles.otpBoxesRow}>
            {digits.map((digit, idx) => (
              <View key={idx} style={styles.otpBox}>
                <Text style={styles.otpDigit}>{digit}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footerNote}>
            <Bike size={14} color="#2D9D5F" />
            <Text style={styles.footerNoteText}>
              Rider will verify OTP on vendor app to complete delivery.
            </Text>
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.9}>
            <Text style={styles.doneBtnText}>Close OTP Screen</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  closeBtn: {
    padding: 6,
  },
  subtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#94A3B8',
    marginTop: 8,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 20,
  },
  otpBox: {
    width: 54,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#00F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigit: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: '#00F2FE',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(45, 157, 95, 0.15)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  footerNoteText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#4ADE80',
    flex: 1,
  },
  doneBtn: {
    backgroundColor: '#8F0D2F',
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
