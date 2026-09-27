import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Switch,
  Image,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  CreditCard,
  Lock,
  Smartphone,
  Eye,
  Trash2,
  Bell,
  Globe,
  Sun,
  LogOut,
} from 'lucide-react-native';
import { router } from 'expo-router';

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

import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

export interface SettingsAndSecurityScreenProps {
  onBack?: () => void;
  onSignOut?: () => void;
}

export const SettingsAndSecurityScreen: React.FC<SettingsAndSecurityScreenProps> = ({
  onBack,
  onSignOut,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [appLockEnabled, setAppLockEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyExpanded, setPrivacyExpanded] = useState(true);

  const handleEditProfile = () => {
    safeHapticImpact();
    Alert.alert('Edit Profile', 'Update your personal details, skin profile, and avatar.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Edit Info', onPress: () => router.push('/profile-overview' as any) },
    ]);
  };

  const handleChangePhone = () => {
    safeHapticImpact();
    Alert.alert('Change Phone Number', 'A verification OTP will be sent to your new mobile number.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send OTP', onPress: () => {} },
    ]);
  };

  const handleDeleteData = () => {
    safeHapticImpact();
    Alert.alert(
      'Delete Account Data',
      'Are you sure you want to permanently delete your AI scan history and profile data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: () => Alert.alert('Request Submitted', 'Your account data deletion request has been scheduled.'),
        },
      ]
    );
  };

  const handleLanguageSelect = () => {
    safeHapticImpact();
    Alert.alert('Select Language', 'Choose your preferred app language', [
      { text: 'English (Default)', onPress: () => {} },
      { text: 'Hindi (हिंदी)', onPress: () => {} },
      { text: 'Telugu (తెలుగు)', onPress: () => {} },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleAppearanceSelect = () => {
    safeHapticImpact();
    Alert.alert('Appearance Theme', 'Select visual mode', [
      { text: 'Light Mode (Active)', onPress: () => {} },
      { text: 'Dark Mode', onPress: () => {} },
      { text: 'System Default', onPress: () => {} },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSignOutAction = () => {
    safeHapticImpact();
    if (onSignOut) onSignOut();
    else router.push('/onboarding' as any);
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
            if (onBack) onBack();
            else router.back();
          }}
          activeOpacity={0.7}
          delayPressIn={0}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Sparkles size={16} color="#FFD700" />
          <Text style={styles.headerTitle}>Settings & Privacy</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        {/* ACCOUNT SECURITY CARD */}
        <TouchableOpacity
          style={styles.securityUserCard}
          onPress={() => {
            safeHapticImpact();
            router.push('/profile-overview' as any);
          }}
          activeOpacity={0.8}
          delayPressIn={0}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>Sophia Carter</Text>
            <View style={styles.verifiedRow}>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedBadgeText}>Phone verified</Text>
              </View>
              <View style={styles.secStatusBadge}>
                <ShieldCheck size={12} color={ColorTokens.successGreen} />
                <Text style={styles.secStatusText}>Account secure</Text>
              </View>
            </View>
          </View>
          <ChevronRight size={20} color={ColorTokens.mutedText} />
        </TouchableOpacity>

        {/* SECTION 1 — ACCOUNT SETTINGS */}
        <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleEditProfile}
            activeOpacity={0.7}
            delayPressIn={0}
          >
            <View style={[styles.iconBg, { backgroundColor: ColorTokens.softCoral }]}>
              <User size={16} color={ColorTokens.deepBerry} />
            </View>
            <Text style={styles.rowLabel}>Edit Profile</Text>
            <ChevronRight size={18} color={ColorTokens.mutedText} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => {
              safeHapticImpact();
              router.push('/saved-addresses' as any);
            }}
            activeOpacity={0.7}
            delayPressIn={0}
          >
            <View style={[styles.iconBg, { backgroundColor: ColorTokens.softCoral }]}>
              <MapPin size={16} color={ColorTokens.deepBerry} />
            </View>
            <Text style={styles.rowLabel}>Saved Addresses</Text>
            <ChevronRight size={18} color={ColorTokens.mutedText} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => {
              safeHapticImpact();
              router.push('/payment-method' as any);
            }}
            activeOpacity={0.7}
            delayPressIn={0}
          >
            <View style={[styles.iconBg, { backgroundColor: ColorTokens.softCoral }]}>
              <CreditCard size={16} color={ColorTokens.deepBerry} />
            </View>
            <Text style={styles.rowLabel}>Payment Methods</Text>
            <ChevronRight size={18} color={ColorTokens.mutedText} />
          </TouchableOpacity>
        </View>

        {/* SECTION 2 — SECURITY */}
        <Text style={styles.sectionTitle}>SECURITY</Text>
        <View style={styles.groupCard}>
          <View style={styles.settingRow}>
            <View style={[styles.iconBg, { backgroundColor: ColorTokens.lavender }]}>
              <Lock size={16} color={ColorTokens.cobaltBlue} />
            </View>
            <Text style={styles.rowLabel}>Face ID / Fingerprint Login</Text>
            <Switch
              value={biometricEnabled}
              onValueChange={(val) => {
                safeHapticSelection();
                setBiometricEnabled(val);
              }}
              trackColor={{ false: ColorTokens.border, true: ColorTokens.deepBerry }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={[styles.iconBg, { backgroundColor: ColorTokens.lavender }]}>
              <Lock size={16} color={ColorTokens.cobaltBlue} />
            </View>
            <Text style={styles.rowLabel}>App Lock</Text>
            <Switch
              value={appLockEnabled}
              onValueChange={(val) => {
                safeHapticSelection();
                setAppLockEnabled(val);
              }}
              trackColor={{ false: ColorTokens.border, true: ColorTokens.deepBerry }}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleChangePhone}
            activeOpacity={0.7}
            delayPressIn={0}
          >
            <View style={[styles.iconBg, { backgroundColor: ColorTokens.lavender }]}>
              <Smartphone size={16} color={ColorTokens.cobaltBlue} />
            </View>
            <Text style={styles.rowLabel}>Change Phone Number</Text>
            <ChevronRight size={18} color={ColorTokens.mutedText} />
          </TouchableOpacity>
        </View>

        {/* SECTION 3 — PRIVACY */}
        <Text style={styles.sectionTitle}>PRIVACY</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => {
              safeHapticImpact();
              setPrivacyExpanded(!privacyExpanded);
            }}
            activeOpacity={0.7}
            delayPressIn={0}
          >
            <View style={[styles.iconBg, { backgroundColor: ColorTokens.softGreen }]}>
              <Eye size={16} color={ColorTokens.plum} />
            </View>
            <Text style={styles.rowLabel}>AI Scan Privacy</Text>
            {privacyExpanded ? (
              <ChevronUp size={18} color={ColorTokens.deepBerry} />
            ) : (
              <ChevronDown size={18} color={ColorTokens.mutedText} />
            )}
          </TouchableOpacity>

          {privacyExpanded && (
            <View style={styles.privacyInfoBox}>
              <ShieldCheck size={16} color={ColorTokens.plum} style={{ marginTop: 2 }} />
              <Text style={styles.privacyInfoText}>
                Your face is used only to validate scan position and create cosmetic insights. Identity recognition is not used.
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => {
              safeHapticImpact();
              router.push('/scan/report' as any);
            }}
            activeOpacity={0.7}
            delayPressIn={0}
          >
            <View style={[styles.iconBg, { backgroundColor: ColorTokens.softGreen }]}>
              <Sparkles size={16} color={ColorTokens.plum} />
            </View>
            <Text style={styles.rowLabel}>Scan History</Text>
            <ChevronRight size={18} color={ColorTokens.mutedText} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleDeleteData}
            activeOpacity={0.7}
            delayPressIn={0}
          >
            <View style={[styles.iconBg, { backgroundColor: '#FFF0F2' }]}>
              <Trash2 size={16} color={ColorTokens.deepBerry} />
            </View>
            <Text style={[styles.rowLabel, { color: ColorTokens.deepBerry }]}>
              Delete Account Data
            </Text>
            <ChevronRight size={18} color={ColorTokens.deepBerry} />
          </TouchableOpacity>
        </View>

        {/* SECTION 4 — PREFERENCES */}
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <View style={styles.groupCard}>
          <View style={styles.settingRow}>
            <View style={[styles.iconBg, { backgroundColor: ColorTokens.lavender }]}>
              <Bell size={16} color={ColorTokens.cobaltBlue} />
            </View>
            <Text style={styles.rowLabel}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={(val) => {
                safeHapticSelection();
                setNotificationsEnabled(val);
              }}
              trackColor={{ false: ColorTokens.border, true: ColorTokens.deepBerry }}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleLanguageSelect}
            activeOpacity={0.7}
            delayPressIn={0}
          >
            <View style={[styles.iconBg, { backgroundColor: ColorTokens.lavender }]}>
              <Globe size={16} color={ColorTokens.cobaltBlue} />
            </View>
            <Text style={styles.rowLabel}>Language</Text>
            <Text style={styles.valueText}>English</Text>
            <ChevronRight size={18} color={ColorTokens.mutedText} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleAppearanceSelect}
            activeOpacity={0.7}
            delayPressIn={0}
          >
            <View style={[styles.iconBg, { backgroundColor: ColorTokens.lavender }]}>
              <Sun size={16} color={ColorTokens.cobaltBlue} />
            </View>
            <Text style={styles.rowLabel}>Appearance</Text>
            <Text style={styles.valueText}>Light Mode</Text>
            <ChevronRight size={18} color={ColorTokens.mutedText} />
          </TouchableOpacity>
        </View>

        {/* SIGN OUT BUTTON */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOutAction}
          activeOpacity={0.8}
          delayPressIn={0}
        >
          <LogOut size={18} color={ColorTokens.deepBerry} style={{ marginRight: 8 }} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 + insets.bottom }} />
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
  securityUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  verifiedBadge: {
    backgroundColor: ColorTokens.softCream,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  secStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  secStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: ColorTokens.successGreen,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 10,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  iconBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.text,
    flex: 1,
  },
  valueText: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginRight: 6,
  },
  privacyInfoBox: {
    flexDirection: 'row',
    backgroundColor: ColorTokens.lavender,
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 10,
  },
  privacyInfoText: {
    fontSize: 12,
    color: ColorTokens.plum,
    lineHeight: 16,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: ColorTokens.border,
  },
  signOutBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 52,
    borderWidth: 1.5,
    borderColor: ColorTokens.deepBerry,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
});
