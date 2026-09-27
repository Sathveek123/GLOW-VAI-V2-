import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingScreenLayout } from '../../components/layout/OnboardingScreenLayout';
import { Colors, Typography } from '../../design';
import { safeHapticImpact } from '../../utils/haptics';
import { getCurrentUser } from '../../services/authService';
import { syncUserOnboardingData } from '../../services/userSyncService';

const AGE_RANGES = ['Under 18', '18-24', '25-34', '35-44', '45+'];
const GENDERS = ['Female', 'Male', 'Non-Binary', 'Prefer not to say'];

export const ProfileSetupScreen: React.FC = () => {
  const router = useRouter();
  const currentUser = getCurrentUser();

  const [fullName, setFullName] = useState(currentUser?.displayName || '');
  const [selectedAge, setSelectedAge] = useState<string>('18-24');
  const [selectedGender, setSelectedGender] = useState<string>('Female');
  const [avatarUri, setAvatarUri] = useState<string | null>(currentUser?.photoURL || null);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = fullName.trim().length >= 2 && !!selectedAge && !!selectedGender;

  const handlePickAvatar = async () => {
    await safeHapticImpact();
    if (avatarUri) {
      setAvatarUri(null);
    } else {
      setAvatarUri('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');
    }
  };

  const handleContinue = async () => {
    if (!isFormValid || isLoading) return;

    await safeHapticImpact();
    setIsLoading(true);

    try {
      await syncUserOnboardingData({
        name: fullName.trim(),
      });
      setIsLoading(false);
      router.push('/(auth)/skin-survey' as any);
    } catch {
      setIsLoading(false);
      router.push('/(auth)/skin-survey' as any);
    }
  };

  const getInitial = () => {
    if (fullName.trim()) {
      return fullName.trim().charAt(0).toUpperCase();
    }
    return 'P';
  };

  return (
    <OnboardingScreenLayout
      paddingHorizontal={20}
      footer={
        <TouchableOpacity
          style={[styles.continueBtn, !isFormValid && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!isFormValid || isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={[Typography.headingMd, styles.continueBtnText]}>Continue to Skin Survey →</Text>
          )}
        </TouchableOpacity>
      }
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Step 1 of 2 Progress Bar */}
      <View style={styles.progressHeader}>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '50%' }]} />
        </View>
        <Text style={[Typography.labelSm, styles.stepText]}>STEP 1 OF 2: PROFILE SETUP</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Headline */}
        <Text style={[Typography.displayLg, styles.headlineTitle]}>Set Up Your Profile</Text>
        <Text style={[Typography.bodyMd, styles.subtext]}>Personalize your identity for express deliveries & diagnostic tracking.</Text>

        {/* 72px Optional Avatar Upload */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarCircle} onPress={handlePickAvatar} activeOpacity={0.8}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text style={[Typography.headingLg, styles.avatarInitial]}>{getInitial()}</Text>
            )}
            <View style={styles.cameraEditBadge}>
              <Ionicons name="camera" size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={[Typography.bodySm, styles.avatarHintText]}>Tap to add profile photo (optional)</Text>
        </View>

        {/* Full Name Field */}
        <View style={styles.inputGroup}>
          <Text style={[Typography.labelSm, styles.inputLabel]}>FULL NAME</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[Typography.bodyLg, styles.textInput]}
              placeholder="e.g. Priya Sharma"
              placeholderTextColor={Colors.onboarding.textTertiary}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>

        {/* Age Range Chips */}
        <View style={styles.inputGroup}>
          <Text style={[Typography.labelSm, styles.inputLabel]}>AGE RANGE</Text>
          <View style={styles.chipsRow}>
            {AGE_RANGES.map((range) => {
              const isSelected = selectedAge === range;
              return (
                <TouchableOpacity
                  key={range}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={async () => {
                    await safeHapticImpact();
                    setSelectedAge(range);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[Typography.bodySm, styles.chipText, isSelected && styles.chipTextSelected]}>
                    {range}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Gender Selection Chips */}
        <View style={styles.inputGroup}>
          <Text style={[Typography.labelSm, styles.inputLabel]}>GENDER</Text>
          <View style={styles.chipsRow}>
            {GENDERS.map((gender) => {
              const isSelected = selectedGender === gender;
              return (
                <TouchableOpacity
                  key={gender}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={async () => {
                    await safeHapticImpact();
                    setSelectedGender(gender);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[Typography.bodySm, styles.chipText, isSelected && styles.chipTextSelected]}>
                    {gender}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </OnboardingScreenLayout>
  );
};

export default ProfileSetupScreen;

const styles = StyleSheet.create({
  progressHeader: {
    paddingTop: 8,
    paddingBottom: 12,
    gap: 6,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: Colors.onboarding.border,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.onboarding.primary,
    borderRadius: 2,
  },
  stepText: {
    color: Colors.onboarding.textSecondary,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 24,
    gap: 20,
  },
  headlineTitle: {
    color: Colors.onboarding.textPrimary,
    marginBottom: 4,
  },
  subtext: {
    color: Colors.onboarding.textSecondary,
    lineHeight: 20,
  },
  avatarSection: {
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.onboarding.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarInitial: {
    color: '#FFFFFF',
  },
  cameraEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.onboarding.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarHintText: {
    color: Colors.onboarding.textSecondary,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: Colors.onboarding.textSecondary,
  },
  inputRow: {
    height: 52,
    backgroundColor: Colors.onboarding.surfaceInput,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.onboarding.border,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  textInput: {
    color: Colors.onboarding.textPrimary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: Colors.onboarding.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.onboarding.border,
  },
  chipSelected: {
    backgroundColor: Colors.onboarding.primary,
    borderColor: Colors.onboarding.primary,
  },
  chipText: {
    color: Colors.onboarding.textSecondary,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  continueBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.onboarding.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnDisabled: {
    opacity: 0.45,
  },
  continueBtnText: {
    color: '#FFFFFF',
  },
});
