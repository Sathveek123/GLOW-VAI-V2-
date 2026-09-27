import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { Colors, Typography } from '../../design';
import {
  requestDeviceLocationPermission,
  getDeviceCurrentLocation,
} from '../../services/locationService';

export const PermissionsScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);

  // Profile Form State
  const [displayName, setDisplayName] = useState('');
  const [cityArea, setCityArea] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Value-driven permission toggles
  const [isCameraGranted, setIsCameraGranted] = useState(true);
  const [isLocationGranted, setIsLocationGranted] = useState(true);
  const [isNotificationsGranted, setIsNotificationsGranted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAutoDetectLocation = async () => {
    setIsLocating(true);
    try {
      const granted = await requestDeviceLocationPermission();
      if (granted) {
        const loc = await getDeviceCurrentLocation();
        if (loc) {
          setCityArea(`${loc.city || 'Bengaluru'}, ${loc.state || 'Karnataka'}`);
          setIsLocationGranted(true);
        }
      } else {
        Alert.alert('Permission Notice', 'Location permission was not granted. You can enter your delivery address manually.');
      }
    } catch {
      setCityArea('Koramangala, Bengaluru');
    } finally {
      setIsLocating(false);
    }
  };

  const handleAllowAndContinue = async () => {
    setIsLoading(true);

    try {
      if (isLocationGranted) {
        await requestDeviceLocationPermission();
      }

      if (isCameraGranted) {
        router.push('/(customer)/scan/camera');
      } else {
        router.replace('/(customer)/(tabs)');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Notice: Proceeding with default setup.';
      Alert.alert('Notice', msg);
      router.push('/(customer)/scan/camera');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(customer)/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />

      {/* Top Header Navigation */}
      <View style={[styles.topNavRow, { paddingTop: headerTopInset }]}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(customer)/(tabs)');
            }
          }}
          style={styles.navIconButton}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={Colors.dark.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip} style={styles.skipPill} activeOpacity={0.7}>
          <Text style={styles.skipPillText}>Skip to Home</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.dark.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Trust & Value Proposition Hero Header */}
        <View style={styles.heroSection}>
          <View style={styles.trustBadge}>
            <Ionicons name="shield-checkmark" size={13} color={Colors.dark.primary} />
            <Text style={styles.trustBadgeText}>100% PRIVATE & ENCRYPTED</Text>
          </View>

          <Text style={styles.heroTitle}>
            Unlock Personalized Skincare
          </Text>
          <Text style={styles.heroSubtitle}>
            To deliver clinical AI skin diagnostics and guarantee express deliveries, GlowVAI needs a few quick permissions.
          </Text>
        </View>

        {/* SECTION 1: Delivery Profile Setup */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconCircle}>
              <Ionicons name="person-circle-outline" size={20} color={Colors.dark.primary} />
            </View>
            <View style={styles.cardHeaderTextCol}>
              <Text style={styles.cardTitle}>Your Delivery Profile</Text>
              <Text style={styles.cardSubtitle}>Helps us tailor routines and address shipping</Text>
            </View>
          </View>

          {/* Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <View
              style={[
                styles.inputRow,
                focusedField === 'name' && styles.inputRowFocused,
              ]}
            >
              <Ionicons name="person-outline" size={18} color={Colors.dark.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Alex Sharma"
                placeholderTextColor="rgba(245, 247, 250, 0.4)"
                value={displayName}
                onChangeText={setDisplayName}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Delivery Location Field */}
          <View style={styles.inputGroup}>
            <View style={styles.locationLabelRow}>
              <Text style={styles.inputLabel}>DELIVERY ADDRESS / AREA</Text>
              <TouchableOpacity
                onPress={handleAutoDetectLocation}
                disabled={isLocating}
                style={styles.autoLocateBtn}
                activeOpacity={0.7}
              >
                {isLocating ? (
                  <ActivityIndicator size="small" color={Colors.dark.primary} />
                ) : (
                  <>
                    <Ionicons name="navigate-outline" size={12} color={Colors.dark.primary} />
                    <Text style={styles.autoLocateText}>Auto-Detect GPS</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.inputRow,
                focusedField === 'location' && styles.inputRowFocused,
              ]}
            >
              <Ionicons name="location-outline" size={18} color={Colors.dark.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Indiranagar, Bengaluru"
                placeholderTextColor="rgba(245, 247, 250, 0.4)"
                value={cityArea}
                onChangeText={setCityArea}
                onFocus={() => setFocusedField('location')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>
        </View>

        {/* SECTION 2: Value-Driven Permission Toggles (Mode A Dark Standard) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Why We Ask for Permissions</Text>

          {/* 1. Camera Permission */}
          <View style={styles.permissionRow}>
            <View style={styles.permIconBadge}>
              <Ionicons name="camera" size={20} color={Colors.dark.primary} />
            </View>
            <View style={styles.permTextContainer}>
              <Text style={styles.permTitle}>Camera Access</Text>
              <Text style={styles.permBenefit}>
                Enables clinical AI face diagnostics for measuring hydration, acne, and barrier score.
              </Text>
            </View>
            <Switch
              value={isCameraGranted}
              onValueChange={setIsCameraGranted}
              trackColor={{ false: Colors.dark.border, true: 'rgba(26, 115, 232, 0.4)' }}
              thumbColor={isCameraGranted ? Colors.dark.primary : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          {/* 2. Location Permission */}
          <View style={styles.permissionRow}>
            <View style={styles.permIconBadge}>
              <Ionicons name="location" size={20} color={Colors.dark.primary} />
            </View>
            <View style={styles.permTextContainer}>
              <Text style={styles.permTitle}>Precise Location</Text>
              <Text style={styles.permBenefit}>
                Locates your nearest dark store for express doorstep drops.
              </Text>
            </View>
            <Switch
              value={isLocationGranted}
              onValueChange={setIsLocationGranted}
              trackColor={{ false: Colors.dark.border, true: 'rgba(26, 115, 232, 0.4)' }}
              thumbColor={isLocationGranted ? Colors.dark.primary : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          {/* 3. Smart Notifications */}
          <View style={styles.permissionRow}>
            <View style={styles.permIconBadge}>
              <Ionicons name="notifications" size={20} color={Colors.dark.primary} />
            </View>
            <View style={styles.permTextContainer}>
              <Text style={styles.permTitle}>Live Delivery Alerts</Text>
              <Text style={styles.permBenefit}>
                Real-time rider tracking notifications and customized routine alerts.
              </Text>
            </View>
            <Switch
              value={isNotificationsGranted}
              onValueChange={setIsNotificationsGranted}
              trackColor={{ false: Colors.dark.border, true: 'rgba(26, 115, 232, 0.4)' }}
              thumbColor={isNotificationsGranted ? Colors.dark.primary : '#94A3B8'}
            />
          </View>
        </View>

        {/* SECTION 3: Customer Trust & Privacy Shield */}
        <View style={styles.privacyGuaranteeCard}>
          <Ionicons name="lock-closed" size={20} color={Colors.status.success} />
          <View style={styles.privacyTextCol}>
            <Text style={styles.privacyTitle}>Clinical Biometric Privacy</Text>
            <Text style={styles.privacyDesc}>
              Your facial scan is processed on-device and securely encrypted. GlowVAI never sells or shares your personal biometric data.
            </Text>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={styles.primaryBrandBtn}
          onPress={handleAllowAndContinue}
          disabled={isLoading}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Allow access and continue"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.primaryBrandBtnText}>
                {isCameraGranted ? 'Allow Access & Start Skin Scan' : 'Save & Continue'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>

        {/* Skip Ghost Link */}
        <TouchableOpacity style={styles.skipGhostBtn} onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipGhostText}>Skip for now (Browse Products Directly) →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  navIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  skipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.dark.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 4,
  },
  skipPillText: {
    ...Typography.bodySm,
    color: Colors.dark.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 24,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(26, 115, 232, 0.12)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(26, 115, 232, 0.25)',
    marginBottom: 12,
    gap: 6,
  },
  trustBadgeText: {
    ...Typography.labelSm,
    color: Colors.dark.primary,
    letterSpacing: 0.8,
  },
  heroTitle: {
    ...Typography.displayLg,
    color: Colors.dark.textPrimary,
    marginBottom: 8,
  },
  heroSubtitle: {
    ...Typography.bodyMd,
    color: Colors.dark.textSecondary,
    lineHeight: 21,
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(26, 115, 232, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTextCol: {
    flex: 1,
  },
  cardTitle: {
    ...Typography.headingSm,
    color: Colors.dark.textPrimary,
    marginBottom: 2,
  },
  cardSubtitle: {
    ...Typography.bodySm,
    color: Colors.dark.textSecondary,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    ...Typography.labelSm,
    color: Colors.dark.textSecondary,
    marginBottom: 6,
  },
  locationLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  autoLocateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(26, 115, 232, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  autoLocateText: {
    ...Typography.labelSm,
    color: Colors.dark.primary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.dark.border,
    paddingHorizontal: 14,
    height: 52,
  },
  inputRowFocused: {
    borderColor: Colors.dark.primary,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    ...Typography.bodyLg,
    color: Colors.dark.textPrimary,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  permIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(26, 115, 232, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permTextContainer: {
    flex: 1,
    paddingRight: 4,
  },
  permTitle: {
    ...Typography.headingSm,
    color: Colors.dark.textPrimary,
    marginBottom: 3,
  },
  permBenefit: {
    ...Typography.bodySm,
    color: Colors.dark.textSecondary,
    lineHeight: 17,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: 4,
  },
  privacyGuaranteeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: 20,
    gap: 10,
  },
  privacyTextCol: {
    flex: 1,
  },
  privacyTitle: {
    ...Typography.headingSm,
    color: Colors.status.success,
    marginBottom: 2,
  },
  privacyDesc: {
    ...Typography.bodySm,
    color: 'rgba(245, 247, 250, 0.75)',
    lineHeight: 17,
  },
  primaryBrandBtn: {
    backgroundColor: Colors.dark.primary,
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBrandBtnText: {
    ...Typography.labelMd,
    color: '#FFFFFF',
    fontSize: 15,
  },
  skipGhostBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  skipGhostText: {
    ...Typography.bodySm,
    color: Colors.dark.textSecondary,
  },
});
