import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import {
  ArrowLeft,
  Plus,
  Home,
  Briefcase,
  MapPin,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  Info,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  plum: '#5C2A91',
  warmIvory: '#FFFDF7',
  softCream: '#FAF4EE',
  coral: '#F27F78',
  softCoral: '#FBE0DC',
  lavender: '#F2ECFA',
  cobaltBlue: '#1677E8',
  successGreen: '#159447',
  softGreen: '#E3F5EA',
  text: '#321A2B',
  mutedText: '#756C73',
  border: '#E8E1E5',
};

export interface SavedAddressesScreenProps {
  onBack?: () => void;
  onSelectAddress?: (id: string) => void;
}

interface AddressItem {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  label: string;
  address: string;
  isDefault: boolean;
  serviceable: boolean;
}

export const SavedAddressesScreen: React.FC<SavedAddressesScreenProps> = ({
  onBack,
  onSelectAddress,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState('1');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [addresses, setAddresses] = useState<AddressItem[]>([
    {
      id: '1',
      type: 'Home',
      label: 'Home',
      address: '#12–8–17, Sri Sai Residency,\nNear Benz Circle, Vijayawada,\nAndhra Pradesh 520010',
      isDefault: true,
      serviceable: true,
    },
    {
      id: '2',
      type: 'Work',
      label: 'Work',
      address: 'GlowVAI Studio,\nMG Road, Vijayawada',
      isDefault: false,
      serviceable: true,
    },
    {
      id: '3',
      type: 'Other',
      label: 'Other',
      address: "Parents’ Home,\nPayakapuram",
      isDefault: false,
      serviceable: true,
    },
  ]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (onSelectAddress) {
      onSelectAddress(id);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setAddresses((prev) => prev.filter((a) => a.id !== deletingId));
      if (selectedId === deletingId && addresses.length > 1) {
        setSelectedId(addresses.find((a) => a.id !== deletingId)?.id || '');
      }
    }
    setDeleteModalVisible(false);
    setDeletingId(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset }]}>
        <TouchableOpacity
          style={styles.backCircle}
          onPress={onBack || (() => router.back())}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Sparkles size={16} color="#FFD700" />
          <Text style={styles.headerTitle}>Saved Addresses</Text>
        </View>

        <TouchableOpacity
          style={styles.addNewHeaderBtn}
          onPress={() => router.push('/location-setup' as any)}
          activeOpacity={0.8}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addNewHeaderText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        {/* INTRODUCTION */}
        <Text style={styles.introText}>
          Manage your delivery addresses for a faster, smoother shopping experience.
        </Text>

        {/* DELIVERY NOTE CARD */}
        <View style={styles.infoBanner}>
          <Info size={16} color={ColorTokens.plum} />
          <Text style={styles.infoBannerText}>
            Choose an address to see delivery availability.
          </Text>
        </View>

        {/* ADDRESS CARDS LIST */}
        {addresses.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.addressCard, isSelected && styles.addressCardSelected]}
              onPress={() => handleSelect(item.id)}
              activeOpacity={0.88}
            >
              {/* TOP ROW: LABEL CHIP, 10-MIN BADGE, SELECT RADIO */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.typeIconWrapper}>
                    {item.type === 'Home' ? (
                      <Home size={16} color={ColorTokens.deepBerry} />
                    ) : item.type === 'Work' ? (
                      <Briefcase size={16} color={ColorTokens.deepBerry} />
                    ) : (
                      <MapPin size={16} color={ColorTokens.deepBerry} />
                    )}
                  </View>
                  <View style={styles.labelChip}>
                    <Text style={styles.labelChipText}>{item.label}</Text>
                  </View>
                  {item.serviceable && (
                    <View style={styles.badge10Min}>
                      <Zap size={11} color={ColorTokens.deepBerry} />
                      <Text style={styles.badge10MinText}>10 MIN</Text>
                    </View>
                  )}
                </View>

                {isSelected ? (
                  <CheckCircle2 size={22} color={ColorTokens.deepBerry} />
                ) : (
                  <Circle size={22} color={ColorTokens.border} />
                )}
              </View>

              {/* MIDDLE ROW: ADDRESS DETAILS */}
              <View style={styles.addressBody}>
                <MapPin size={16} color={ColorTokens.mutedText} style={{ marginTop: 2, marginRight: 8 }} />
                <Text style={styles.addressText}>{item.address}</Text>
              </View>

              {/* ACTION DIVIDER */}
              <View style={styles.divider} />

              {/* BOTTOM ROW: EDIT & DELETE CONTROLS */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => router.push('/add-address' as any)}
                  activeOpacity={0.7}
                >
                  <Edit2 size={14} color={ColorTokens.mutedText} />
                  <Text style={styles.actionBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    setDeletingId(item.id);
                    setDeleteModalVisible(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Trash2 size={14} color={ColorTokens.deepBerry} />
                  <Text style={[styles.actionBtnText, { color: ColorTokens.deepBerry }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FLOATING BOTTOM PRIMARY ACTION */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.floatingAddBtn}
          onPress={() => router.push('/location-setup' as any)}
          activeOpacity={0.9}
        >
          <MapPin size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.floatingAddBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </View>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete this address?</Text>
            <Text style={styles.modalSub}>
              Are you sure you want to remove this delivery address from your account?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteConfirmBtn}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.deleteConfirmBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  addNewHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  addNewHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  introText: {
    fontSize: 14,
    color: ColorTokens.mutedText,
    marginBottom: 14,
    lineHeight: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.lavender,
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    gap: 8,
  },
  infoBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorTokens.plum,
    flex: 1,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  addressCardSelected: {
    borderColor: ColorTokens.deepBerry,
    backgroundColor: ColorTokens.softCream,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ColorTokens.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelChip: {
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  labelChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  badge10Min: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ColorTokens.softCoral,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badge10MinText: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
  },
  addressBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    color: ColorTokens.text,
    lineHeight: 20,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: ColorTokens.border,
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorTokens.mutedText,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: ColorTokens.border,
  },
  floatingAddBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingAddBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: ColorTokens.text,
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 14,
    color: ColorTokens.mutedText,
    lineHeight: 20,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  deleteConfirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteConfirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
