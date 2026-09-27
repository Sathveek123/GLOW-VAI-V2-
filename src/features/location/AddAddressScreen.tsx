import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  MapPin,
  Edit2,
  Home,
  Briefcase,
  User,
  Phone,
  Building,
  Navigation,
  Check,
  Sparkles,
  Zap,
  CheckSquare,
  Square,
  AlertCircle,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
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

export interface AddAddressScreenProps {
  onBack?: () => void;
  onSaveAddress?: (data: any) => void;
}

export const AddAddressScreen: React.FC<AddAddressScreenProps> = ({
  onBack,
  onSaveAddress,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ address?: string; subAddress?: string }>();
  const initialAddress = params.address || 'Payakapuram, Vijayawada';

  const [houseNo, setHouseNo] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [isDefault, setIsDefault] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    if (!houseNo.trim()) {
      errs.houseNo = 'Please enter your house or flat number.';
    }
    if (!receiverName.trim()) {
      errs.receiverName = 'Please enter the receiver name.';
    }
    if (!phoneNo.trim() || phoneNo.trim().length < 10) {
      errs.phoneNo = 'Please enter a valid phone number.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      const payload = {
        houseNo,
        buildingName,
        landmark,
        receiverName,
        phoneNo,
        addressType,
        isDefault,
        fullAddress: `${houseNo}, ${buildingName ? buildingName + ', ' : ''}${initialAddress}`,
      };
      if (onSaveAddress) {
        onSaveAddress(payload);
      }
      router.push('/saved-addresses' as any);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backCircle}
            onPress={onBack || (() => router.back())}
            activeOpacity={0.8}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.brandRow}>
            <Sparkles size={16} color="#FFD700" />
            <Text style={styles.headerTitle}>Add delivery address</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.headerSubtitle}>
          Tell us where to deliver your beauty favourites
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        {/* SELECTED LOCATION CARD */}
        <View style={styles.selectedLocationCard}>
          <View style={styles.selectedLocHeader}>
            <Text style={styles.selectedLocBadgeText}>SELECTED LOCATION</Text>
            <TouchableOpacity
              style={styles.editPinBtn}
              onPress={() => router.push('/map-picker' as any)}
              activeOpacity={0.8}
            >
              <Edit2 size={13} color={ColorTokens.deepBerry} />
              <Text style={styles.editPinText}>Edit pin</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.locationDetailRow}>
            <View style={styles.pinBgCircle}>
              <MapPin size={20} color={ColorTokens.deepBerry} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.locNameText}>{initialAddress}</Text>
              <Text style={styles.locSubText}>Click edit to adjust the location if needed</Text>
            </View>
          </View>

          {/* MINI MAP PREVIEW STRIP */}
          <View style={styles.miniMapStrip}>
            <View style={styles.miniMapRiver} />
            <View style={styles.miniMapPin}>
              <MapPin size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.miniMapText}>📍 Entrance verified on map</Text>
          </View>
        </View>

        {/* DELIVERY PROMISE CARD */}
        <View style={styles.deliveryPromiseCard}>
          <View style={styles.promiseIconBg}>
            <Zap size={20} color={ColorTokens.deepBerry} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.promiseBadgeRow}>
              <Text style={styles.promiseTitle}>10 min delivery</Text>
              <Sparkles size={14} color={ColorTokens.coral} />
            </View>
            <Text style={styles.promiseSub}>Available at this location</Text>
          </View>
        </View>

        {/* FORM FIELDS */}
        <Text style={styles.sectionLabel}>ADDRESS DETAILS</Text>

        {/* 1. House / Flat Number */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>House / Flat / Floor number *</Text>
          <View style={[styles.inputWrapper, errors.houseNo && styles.inputError]}>
            <Home size={18} color={ColorTokens.mutedText} style={styles.fieldIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 12A, 3rd Floor"
              placeholderTextColor={ColorTokens.mutedText}
              value={houseNo}
              onChangeText={(text) => {
                setHouseNo(text);
                if (errors.houseNo) setErrors((prev) => ({ ...prev, houseNo: '' }));
              }}
            />
          </View>
          {errors.houseNo ? (
            <View style={styles.errorRow}>
              <AlertCircle size={12} color={ColorTokens.deepBerry} />
              <Text style={styles.errorText}>{errors.houseNo}</Text>
            </View>
          ) : null}
        </View>

        {/* 2. Building / Apartment name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Building / Apartment name</Text>
          <View style={styles.inputWrapper}>
            <Building size={18} color={ColorTokens.mutedText} style={styles.fieldIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Sunrise Apartments"
              placeholderTextColor={ColorTokens.mutedText}
              value={buildingName}
              onChangeText={setBuildingName}
            />
          </View>
        </View>

        {/* 3. Landmark (optional) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Landmark (optional)</Text>
          <View style={styles.inputWrapper}>
            <Navigation size={18} color={ColorTokens.mutedText} style={styles.fieldIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Near D-Mart, opposite park"
              placeholderTextColor={ColorTokens.mutedText}
              value={landmark}
              onChangeText={setLandmark}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>CONTACT DETAILS</Text>

        {/* 4. Receiver Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Receiver name *</Text>
          <View style={[styles.inputWrapper, errors.receiverName && styles.inputError]}>
            <User size={18} color={ColorTokens.mutedText} style={styles.fieldIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Priya Sharma"
              placeholderTextColor={ColorTokens.mutedText}
              value={receiverName}
              onChangeText={(text) => {
                setReceiverName(text);
                if (errors.receiverName) setErrors((prev) => ({ ...prev, receiverName: '' }));
              }}
            />
          </View>
          {errors.receiverName ? (
            <View style={styles.errorRow}>
              <AlertCircle size={12} color={ColorTokens.deepBerry} />
              <Text style={styles.errorText}>{errors.receiverName}</Text>
            </View>
          ) : null}
        </View>

        {/* 5. Phone Number */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Phone number *</Text>
          <View style={[styles.inputWrapper, errors.phoneNo && styles.inputError]}>
            <Phone size={18} color={ColorTokens.mutedText} style={styles.fieldIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 98765 43210"
              placeholderTextColor={ColorTokens.mutedText}
              keyboardType="phone-pad"
              value={phoneNo}
              onChangeText={(text) => {
                setPhoneNo(text);
                if (errors.phoneNo) setErrors((prev) => ({ ...prev, phoneNo: '' }));
              }}
            />
          </View>
          {errors.phoneNo ? (
            <View style={styles.errorRow}>
              <AlertCircle size={12} color={ColorTokens.deepBerry} />
              <Text style={styles.errorText}>{errors.phoneNo}</Text>
            </View>
          ) : null}
        </View>

        {/* ADDRESS TYPE SELECTOR */}
        <Text style={styles.sectionLabel}>SAVE ADDRESS AS</Text>
        <View style={styles.chipsRow}>
          {(['Home', 'Work', 'Other'] as const).map((type) => {
            const isSelected = addressType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.typeChip, isSelected && styles.typeChipSelected]}
                onPress={() => setAddressType(type)}
                activeOpacity={0.8}
              >
                {type === 'Home' ? (
                  <Home size={16} color={isSelected ? '#FFFFFF' : ColorTokens.text} />
                ) : type === 'Work' ? (
                  <Briefcase size={16} color={isSelected ? '#FFFFFF' : ColorTokens.text} />
                ) : (
                  <MapPin size={16} color={isSelected ? '#FFFFFF' : ColorTokens.text} />
                )}
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* DEFAULT ADDRESS CHECKBOX */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setIsDefault(!isDefault)}
          activeOpacity={0.8}
        >
          {isDefault ? (
            <CheckSquare size={20} color={ColorTokens.deepBerry} />
          ) : (
            <Square size={20} color={ColorTokens.border} />
          )}
          <Text style={styles.checkboxLabel}>Use this as my default address</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* STICKY BOTTOM PRIMARY CTA */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.9}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnText}>Save Address</Text>
          )}
        </TouchableOpacity>
      </View>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerSubtitle: {
    fontSize: 12,
    color: ColorTokens.softCoral,
    textAlign: 'center',
    marginTop: 6,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  selectedLocationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedLocHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  selectedLocBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
  },
  editPinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorTokens.softCoral,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editPinText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
  locationDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  pinBgCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ColorTokens.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  locSubText: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  miniMapStrip: {
    height: 36,
    backgroundColor: ColorTokens.softCream,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  miniMapRiver: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: 'rgba(22, 119, 232, 0.15)',
    top: 12,
  },
  miniMapPin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  miniMapText: {
    fontSize: 11,
    fontWeight: '700',
    color: ColorTokens.plum,
  },
  deliveryPromiseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.softCoral,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(242, 127, 120, 0.3)',
    gap: 12,
  },
  promiseIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promiseBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promiseTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorTokens.deepBerry,
  },
  promiseSub: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 6,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorTokens.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  inputError: {
    borderColor: ColorTokens.deepBerry,
    backgroundColor: '#FFF0F2',
  },
  fieldIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: ColorTokens.text,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    fontSize: 11,
    fontWeight: '600',
    color: ColorTokens.deepBerry,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  typeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  typeChipSelected: {
    backgroundColor: ColorTokens.deepBerry,
    borderColor: ColorTokens.deepBerry,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorTokens.text,
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
  saveBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
