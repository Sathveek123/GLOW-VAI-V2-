import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Bell, CheckSquare, Square, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

interface RestockNotifyModalProps {
  visible: boolean;
  onClose: () => void;
  productName?: string;
  darkStoreName?: string;
}

export const RestockNotifyModal: React.FC<RestockNotifyModalProps> = ({
  visible,
  onClose,
  productName = 'GlowVAI Niacinamide Serum',
  darkStoreName = 'Payikapuram Dark Store #04',
}) => {
  const insets = useSafeAreaInsets();
  const [pushChannel, setPushChannel] = useState(true);
  const [smsChannel, setSmsChannel] = useState(true);
  const [whatsappChannel, setWhatsappChannel] = useState(false);

  const handleSubscribe = () => {
    safeHapticImpact();
    Alert.alert(
      '✓ Restock Alert Saved',
      `We will notify you via ${pushChannel ? 'Push ' : ''}${smsChannel ? 'SMS ' : ''}${whatsappChannel ? 'WhatsApp' : ''} when ${productName} is back in stock at ${darkStoreName}.`,
      [{ text: 'OK', onPress: onClose }]
    );
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
            <View style={styles.bellBadge}>
              <Bell size={20} color="#F59E0B" />
            </View>
            <Text style={styles.modalTitle}>Restock Alert</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color="#6B6B6B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.productTitle}>{productName}</Text>
          <Text style={styles.modalSub}>
            Temporarily out of stock at <Text style={{ fontFamily: 'Poppins-Bold' }}>{darkStoreName}</Text>.
            We'll ping you the instant fresh inventory arrives.
          </Text>

          <View style={styles.channelList}>
            <TouchableOpacity
              style={styles.channelRow}
              onPress={() => {
                safeHapticSelection();
                setPushChannel(!pushChannel);
              }}
            >
              {pushChannel ? <CheckSquare size={18} color="#D4472C" /> : <Square size={18} color="#888" />}
              <Text style={styles.channelText}>Push Notification</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.channelRow}
              onPress={() => {
                safeHapticSelection();
                setSmsChannel(!smsChannel);
              }}
            >
              {smsChannel ? <CheckSquare size={18} color="#D4472C" /> : <Square size={18} color="#888" />}
              <Text style={styles.channelText}>SMS Alert (+91 98765 43210)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.channelRow}
              onPress={() => {
                safeHapticSelection();
                setWhatsappChannel(!whatsappChannel);
              }}
            >
              {whatsappChannel ? <CheckSquare size={18} color="#D4472C" /> : <Square size={18} color="#888" />}
              <Text style={styles.channelText}>WhatsApp Alert</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubscribe} activeOpacity={0.9}>
            <Text style={styles.submitBtnText}>Notify Me When Restocked</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#1A1A1A',
    flex: 1,
  },
  closeBtn: {
    padding: 6,
  },
  productTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#8F0D2F',
    marginTop: 12,
  },
  modalSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#6B6B6B',
    marginTop: 4,
  },
  channelList: {
    marginVertical: 16,
    gap: 10,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  channelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#1A1A1A',
  },
  submitBtn: {
    backgroundColor: '#D4472C',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
