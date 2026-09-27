import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Sparkles,
  Check,
  Flame,
  Droplet,
  Sun,
  Zap,
  ShieldCheck,
  Target,
  Smile,
  Wind,
} from 'lucide-react-native';

import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  plum: '#5C2A91',
  warmIvory: '#FFFDF7',
  softLavender: '#F2ECFA',
  coral: '#F27F78',
  softCoral: '#FBE0DC',
  cobaltBlue: '#1677E8',
  successGreen: '#159447',
  softGreen: '#E3F5EA',
  mainText: '#241529',
  mutedText: '#716675',
  border: '#E8E1E5',
  cardBg: '#FFFFFF',
  gold: '#FFD45F',
};

export const SkinConcernsSurveyScreen: React.FC = () => {
  const router = useRouter();

  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(['c1', 'c2']);
  const [notSureSelected, setNotSureSelected] = useState(false);

  const concernsList = [
    { id: 'c1', label: 'Acne & Blemishes', icon: Flame },
    { id: 'c2', label: 'Dryness', icon: Droplet },
    { id: 'c3', label: 'Uneven Tone', icon: Sun },
    { id: 'c4', label: 'Oiliness', icon: Zap },
    { id: 'c5', label: 'Sensitivity', icon: ShieldCheck },
    { id: 'c6', label: 'Dark Spots', icon: Target },
    { id: 'c7', label: 'Dullness', icon: Sun },
    { id: 'c8', label: 'Fine Lines', icon: Smile },
    { id: 'c9', label: 'Hair Fall', icon: Wind },
  ];

  const handleToggleConcern = (id: string) => {
    safeHapticSelection();
    setNotSureSelected(false);
    if (selectedConcerns.includes(id)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== id));
    } else {
      if (selectedConcerns.length < 3) {
        setSelectedConcerns([...selectedConcerns, id]);
      }
    }
  };

  const handleNotSureToggle = () => {
    safeHapticSelection();
    setNotSureSelected(!notSureSelected);
    if (!notSureSelected) {
      setSelectedConcerns([]);
    }
  };

  const handleContinue = () => {
    safeHapticImpact();
    router.push('/(customer)/(tabs)/shop');
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.logoRow}>
          <Sparkles size={16} color={ColorTokens.gold} />
          <Text style={styles.logoText}>GlowVAI</Text>
        </View>

        <Text style={styles.progressText}>Step 1 of 3</Text>
      </View>

      {/* THREE-SEGMENT PROGRESS BAR */}
      <View style={styles.progressBarWrap}>
        <View style={[styles.progressSegment, styles.progressSegmentActive]} />
        <View style={styles.progressSegment} />
        <View style={styles.progressSegment} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* MAIN HEADINGS */}
        <Text style={styles.mainHeading}>What would you like to focus on?</Text>
        <Text style={styles.subtitle}>
          Choose up to 3 goals so we can personalize your GlowVAI routine.
        </Text>

        <View style={styles.selectionCounterRow}>
          <Text style={styles.counterText}>
            {notSureSelected ? 'Discovery Mode' : `${selectedConcerns.length} of 3 selected`}
          </Text>
        </View>

        {/* CONCERN SELECTION GRID */}
        <View style={styles.concernsGrid}>
          {concernsList.map((item) => {
            const isSelected = selectedConcerns.includes(item.id);
            const IconComp = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.concernCard, isSelected && styles.concernCardSelected]}
                onPress={() => handleToggleConcern(item.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                  <IconComp size={18} color={isSelected ? '#FFFFFF' : ColorTokens.plum} />
                </View>

                <Text style={[styles.concernLabel, isSelected && styles.concernLabelSelected]}>
                  {item.label}
                </Text>

                <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                  {isSelected && <Check size={10} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* OPTIONAL NOT SURE CARD */}
        <TouchableOpacity
          style={[styles.notSureCard, notSureSelected && styles.notSureCardSelected]}
          onPress={handleNotSureToggle}
          activeOpacity={0.85}
        >
          <View style={styles.notSureLeft}>
            <Sparkles size={20} color={ColorTokens.plum} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.notSureTitle}>I’m not sure yet</Text>
              <Text style={styles.notSureSub}>We can help you discover your routine with Glow AI.</Text>
            </View>
          </View>
          <View style={[styles.checkCircle, notSureSelected && styles.checkCircleSelected]}>
            {notSureSelected && <Check size={10} color="#FFFFFF" />}
          </View>
        </TouchableOpacity>

        <Text style={styles.helpfulNote}>💡 You can update your routine focus anytime in Profile.</Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTTOM ACTIONS */}
      <View style={styles.stickyBottomBar}>
        <TouchableOpacity style={styles.skipBtn} onPress={handleContinue} activeOpacity={0.7}>
          <Text style={styles.skipBtnText}>Skip for now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueBtn,
            selectedConcerns.length === 0 && !notSureSelected && styles.continueBtnDisabled,
          ]}
          onPress={handleContinue}
          activeOpacity={0.9}
        >
          <Text style={styles.continueBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  progressText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: ColorTokens.gold,
  },
  progressBarWrap: {
    flexDirection: 'row',
    height: 4,
    backgroundColor: '#E8E1E5',
  },
  progressSegment: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  progressSegmentActive: {
    backgroundColor: ColorTokens.deepBerry,
  },
  scrollContent: {
    padding: 20,
  },
  mainHeading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    lineHeight: 30,
    color: ColorTokens.mainText,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: ColorTokens.mutedText,
    marginTop: 6,
  },
  selectionCounterRow: {
    marginTop: 12,
    marginBottom: 16,
  },
  counterText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: ColorTokens.deepBerry,
  },
  concernsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  concernCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: ColorTokens.border,
    alignItems: 'flex-start',
    position: 'relative',
  },
  concernCardSelected: {
    backgroundColor: ColorTokens.deepBerry,
    borderColor: ColorTokens.deepBerry,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ColorTokens.softLavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconCircleSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  concernLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: ColorTokens.mainText,
  },
  concernLabelSelected: {
    color: '#FFFFFF',
  },
  checkCircle: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#D1C7CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  notSureCard: {
    backgroundColor: ColorTokens.softLavender,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: '#E2D1FC',
  },
  notSureCardSelected: {
    borderColor: ColorTokens.deepBerry,
    backgroundColor: '#FFF0F3',
  },
  notSureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notSureTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: ColorTokens.plum,
  },
  notSureSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: ColorTokens.mutedText,
    marginTop: 1,
  },
  helpfulNote: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: ColorTokens.mutedText,
    textAlign: 'center',
    marginTop: 20,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: ColorTokens.border,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  skipBtn: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtnText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: ColorTokens.mutedText,
  },
  continueBtn: {
    flex: 2,
    backgroundColor: ColorTokens.deepBerry,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnDisabled: {
    opacity: 0.5,
  },
  continueBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
