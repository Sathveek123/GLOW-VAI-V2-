import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '../../design';
import { safeHapticImpact } from '../../utils/haptics';
import { syncUserOnboardingData } from '../../services/userSyncService';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SKIN_CONCERNS = [
  { id: 'ACNE', label: 'Acne & Blemishes', emoji: '🔴' },
  { id: 'HYPERPIGMENTATION', label: 'Hyperpigmentation', emoji: '🟤' },
  { id: 'DRYNESS', label: 'Dryness & Dehydration', emoji: '💧' },
  { id: 'OILINESS', label: 'Excess Oiliness', emoji: '✨' },
  { id: 'SENSITIVITY', label: 'Sensitivity & Redness', emoji: '⚡' },
  { id: 'FINE_LINES', label: 'Fine Lines & Aging', emoji: '🕰️' },
];

export const SkinSurveyScreen: React.FC = () => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(12);
  const insets = useSafeAreaInsets();

  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(['ACNE']);
  const [isLoading, setIsLoading] = useState(false);

  const toggleConcern = async (id: string) => {
    await safeHapticImpact();
    if (selectedConcerns.includes(id)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== id));
    } else {
      setSelectedConcerns([...selectedConcerns, id]);
    }
  };

  const handleSaveAndContinue = async (overrideConcerns?: string[]) => {
    if (isLoading) return;

    await safeHapticImpact();
    setIsLoading(true);

    const concernsToSave = overrideConcerns ?? selectedConcerns;

    try {
      await syncUserOnboardingData({
        consentTimestamp: Date.now(),
      });
      setIsLoading(false);
      router.replace('/(auth)/onboarding-success' as any);
    } catch {
      setIsLoading(false);
      router.replace('/(auth)/onboarding-success' as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Step 2 of 2 Progress Bar */}
      <View style={[styles.progressHeader, { paddingTop: headerTopInset }]}>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>
        <Text style={[Typography.labelSm, styles.stepText]}>Step 2 of 2: Skin Survey</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Headline */}
        <Text style={[Typography.displayLg, styles.headlineTitle]}>What are your main skin concerns?</Text>
        <Text style={[Typography.bodyMd, styles.subtext]}>
          Select all that apply. This helps us personalize your initial routine and diagnostic report.
        </Text>

        {/* 2-Column Concern Grid */}
        <View style={styles.gridContainer}>
          {SKIN_CONCERNS.map((item) => {
            const isSelected = selectedConcerns.includes(item.id);

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.concernCard, isSelected && styles.concernCardSelected]}
                onPress={() => toggleConcern(item.id)}
                activeOpacity={0.8}
              >
                {/* Top Row: Emoji & Checkmark */}
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.emojiText}>{item.emoji}</Text>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </View>

                {/* Card Title */}
                <Text style={[Typography.headingSm, styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Skip Link */}
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => handleSaveAndContinue([])}
          activeOpacity={0.7}
        >
          <Text style={[Typography.bodySm, styles.skipText]}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Sticky Action */}
      <View style={[styles.bottomFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => handleSaveAndContinue()}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={[Typography.headingMd, styles.saveBtnText]}>Save & Finish Setup</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SkinSurveyScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.onboarding.background,
  },
  progressHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  headlineTitle: {
    color: Colors.onboarding.textPrimary,
    marginBottom: 6,
  },
  subtext: {
    color: Colors.onboarding.textSecondary,
    lineHeight: 20,
    marginBottom: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  concernCard: {
    width: '48%',
    backgroundColor: Colors.onboarding.surfaceSubtle,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.onboarding.border,
    justifyContent: 'space-between',
    minHeight: 110,
  },
  concernCardSelected: {
    borderColor: Colors.onboarding.borderFocus,
    backgroundColor: Colors.onboarding.primaryTint,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  emojiText: {
    fontSize: 26,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.onboarding.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: Colors.onboarding.textPrimary,
  },
  cardTitleSelected: {
    color: Colors.onboarding.primary,
    fontFamily: 'Inter-SemiBold',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    color: Colors.onboarding.textSecondary,
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.onboarding.background,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.onboarding.border,
  },
  saveBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.onboarding.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
  },
});
