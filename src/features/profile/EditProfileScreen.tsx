import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Phone,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Check,
} from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact } from '../../utils/haptics';

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

export const EditProfileScreen: React.FC = () => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();

  const [avatarUri, setAvatarUri] = useState<string>(
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  );
  const [name, setName] = useState('Ananya Sharma');
  const [email, setEmail] = useState('ananya.sharma@glowvai.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [selectedGender, setSelectedGender] = useState('Female');
  const [selectedAge, setSelectedAge] = useState('18-24');
  const [selectedSkinType, setSelectedSkinType] = useState('Combination Skin');
  const [isSaving, setIsSaving] = useState(false);

  const handlePickAvatar = async () => {
    safeHapticImpact();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Image Picker', 'Unable to select profile image.');
    }
  };

  const handleSave = () => {
    safeHapticImpact();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('Profile Updated', 'Your profile details have been successfully saved!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 600);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: headerTopInset, height: undefined, minHeight: 64 }]}>
        <TouchableOpacity
          style={styles.backCircle}
          onPress={() => {
            safeHapticImpact();
            router.back();
          }}
          activeOpacity={0.7}
          delayPressIn={0}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Sparkles size={16} color="#FFD700" />
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentPadding, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* AVATAR EDIT SECTION */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatarFrame}>
            <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={handlePickAvatar}
              activeOpacity={0.8}
              delayPressIn={0}
            >
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.7}>
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* PERSONAL DETAILS CARD */}
        <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputBox}>
              <User size={18} color={ColorTokens.mutedText} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={ColorTokens.mutedText}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputBox}>
              <Mail size={18} color={ColorTokens.mutedText} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor={ColorTokens.mutedText}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <View style={styles.phoneHeaderRow}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TouchableOpacity
                onPress={() => {
                  safeHapticImpact();
                  router.push('/change-phone' as any);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.changePhoneLink}>Change Phone →</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.inputBox, styles.disabledInputBox]}>
              <Phone size={18} color={ColorTokens.mutedText} style={{ marginRight: 10 }} />
              <TextInput
                style={[styles.textInput, { color: ColorTokens.mutedText }]}
                value={phone}
                editable={false}
              />
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={12} color={ColorTokens.successGreen} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
          </View>
        </View>

        {/* GENDER & AGE GROUP */}
        <Text style={styles.sectionTitle}>DEMOGRAPHICS</Text>
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.chipRow}>
            {['Female', 'Male', 'Non-binary', 'Other'].map((item) => {
              const isSelected = selectedGender === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => {
                    safeHapticImpact();
                    setSelectedGender(item);
                  }}
                  activeOpacity={0.7}
                  delayPressIn={0}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          <Text style={styles.inputLabel}>Age Group</Text>
          <View style={styles.chipRow}>
            {['13-17', '18-24', '25-34', '35-44', '45+'].map((item) => {
              const isSelected = selectedAge === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => {
                    safeHapticImpact();
                    setSelectedAge(item);
                  }}
                  activeOpacity={0.7}
                  delayPressIn={0}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {item} yrs
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SKIN PROFILE SUMMARY */}
        <Text style={styles.sectionTitle}>SKIN PROFILE</Text>
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Primary Skin Type</Text>
          <View style={styles.chipRow}>
            {['Combination Skin', 'Dry Skin', 'Oily Skin', 'Sensitive'].map((item) => {
              const isSelected = selectedSkinType === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => {
                    safeHapticImpact();
                    setSelectedSkinType(item);
                  }}
                  activeOpacity={0.7}
                  delayPressIn={0}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SAVE CTA BUTTON */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.9}
          disabled={isSaving}
          delayPressIn={0}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnText}>Save Profile Changes →</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  avatarWrap: {
    alignItems: 'center',
    marginVertical: 16,
  },
  avatarFrame: {
    position: 'relative',
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarImg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: ColorTokens.deepBerry,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginTop: 14,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  inputGroup: {
    gap: 6,
  },
  phoneHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  changePhoneLink: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.softCream,
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  disabledInputBox: {
    backgroundColor: '#F7F4F6',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: ColorTokens.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: ColorTokens.successGreen,
  },
  divider: {
    height: 1,
    backgroundColor: ColorTokens.border,
    marginVertical: 14,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    backgroundColor: ColorTokens.softCream,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  chipActive: {
    backgroundColor: ColorTokens.deepBerry,
    borderColor: ColorTokens.deepBerry,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorTokens.text,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 18,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
