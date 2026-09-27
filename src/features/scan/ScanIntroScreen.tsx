import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  Sun,
  Glasses,
  Camera,
  ShieldCheck,
  ChevronRight,
  Image as ImageIcon,
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

export interface ScanIntroScreenProps {
  onBack?: () => void;
  onStartCamera?: () => void;
  onUploadPhoto?: () => void;
}

export const ScanIntroScreen: React.FC<ScanIntroScreenProps> = ({
  onBack,
  onStartCamera,
  onUploadPhoto,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const handleStartCamera = () => {
    if (onStartCamera) onStartCamera();
    else router.push('/scan/camera' as any);
  };

  const handleUploadPhoto = () => {
    if (onUploadPhoto) onUploadPhoto();
    else router.push('/scan/gallery' as any);
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
            <Text style={styles.headerTitle}>Glow AI Skin Scan</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* STEP PROGRESS INDICATOR */}
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>Step 1 of 3</Text>
          <View style={styles.circlesGroup}>
            <View style={[styles.circle, styles.circleActive]} />
            <View style={styles.circle} />
            <View style={styles.circle} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        {/* MAIN HEADLINE */}
        <Text style={styles.headline}>Let’s get your best glow reading</Text>
        <Text style={styles.subtitle}>
          A few quick steps help us make your scan clearer and more useful.
        </Text>

        {/* PREPARATION CARDS */}
        <View style={styles.cardsContainer}>
          {/* CARD 1 */}
          <View style={styles.prepCard}>
            <View style={[styles.iconBadge, { backgroundColor: ColorTokens.softCoral }]}>
              <Sun size={24} color={ColorTokens.deepBerry} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Use bright, even light</Text>
              <Text style={styles.cardDesc}>
                Natural light from a window works great. Avoid harsh shadows and dim lighting.
              </Text>
            </View>
          </View>

          {/* CARD 2 */}
          <View style={styles.prepCard}>
            <View style={[styles.iconBadge, { backgroundColor: ColorTokens.lavender }]}>
              <Glasses size={24} color={ColorTokens.plum} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Remove glasses & keep your face clear</Text>
              <Text style={styles.cardDesc}>
                Take off sunglasses or glasses, and make sure your hair isn’t covering your face.
              </Text>
            </View>
          </View>

          {/* CARD 3 */}
          <View style={styles.prepCard}>
            <View style={[styles.iconBadge, { backgroundColor: ColorTokens.softGreen }]}>
              <Camera size={24} color={ColorTokens.successGreen} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Look straight at the camera</Text>
              <Text style={styles.cardDesc}>
                Keep your head centered and your face fully visible in the frame.
              </Text>
            </View>
          </View>
        </View>

        {/* PRIVACY NOTE */}
        <View style={styles.privacyCard}>
          <ShieldCheck size={16} color={ColorTokens.plum} />
          <Text style={styles.privacyText}>
            Your face is checked only to position and validate the scan.
          </Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTIONS */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleStartCamera}
          activeOpacity={0.9}
        >
          <Camera size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>Start Camera →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={handleUploadPhoto}
          activeOpacity={0.8}
        >
          <ImageIcon size={16} color={ColorTokens.deepBerry} style={{ marginRight: 6 }} />
          <Text style={styles.secondaryBtnText}>Upload a photo instead</Text>
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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.softCoral,
  },
  circlesGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  circleActive: {
    backgroundColor: '#FFFFFF',
    width: 18,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 18,
  },
  headline: {
    fontSize: 24,
    fontWeight: '800',
    color: ColorTokens.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: ColorTokens.mutedText,
    lineHeight: 20,
    marginBottom: 20,
  },
  cardsContainer: {
    gap: 14,
    marginBottom: 20,
  },
  prepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 14,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ColorTokens.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    lineHeight: 18,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.lavender,
    padding: 12,
    borderRadius: 14,
    gap: 8,
  },
  privacyText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorTokens.plum,
    flex: 1,
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
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
});
