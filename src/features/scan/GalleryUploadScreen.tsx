import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  Camera,
  UserCheck,
  Glasses,
  Sun,
  Wand2,
  ShieldCheck,
  AlertCircle,
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
  text: '#321A2B',
  mutedText: '#756C73',
  border: '#E8E1E5',
};

export interface GalleryUploadScreenProps {
  onBack?: () => void;
  onPhotoSelected?: (uri: string) => void;
  onOpenCamera?: () => void;
}

export const GalleryUploadScreen: React.FC<GalleryUploadScreenProps> = ({
  onBack,
  onPhotoSelected,
  onOpenCamera,
}) => {
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const handlePickFromGallery = async () => {
    setIsLoading(true);
    setPermissionDenied(false);

    try {
      const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        setIsLoading(false);
        setPermissionDenied(true);
        if (!canAskAgain) {
          Alert.alert(
            'Photo access needed',
            'GlowVAI needs media library access to pick a skin scan photo. Please enable permissions in your device settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
        }
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.9,
      });

      setIsLoading(false);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (!asset || !asset.uri) {
          Alert.alert('Invalid Selection', 'No valid image URI was returned.');
          return;
        }

        const uri = asset.uri;
        setSelectedUri(uri);

        // Navigate to preview with the real selected photo
        if (onPhotoSelected) {
          onPhotoSelected(uri);
        } else {
          router.push({
            pathname: '/(customer)/scan/preview' as any,
            params: { photoUri: uri, source: 'gallery' },
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Could not open image picker. Please try again.');
    }
  };

  const handleOpenCamera = () => {
    if (onOpenCamera) onOpenCamera();
    else router.push('/(customer)/scan/camera' as any);
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
          <Text style={styles.headerTitle}>Choose a clear photo</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* PERMISSION DENIED BANNER */}
        {permissionDenied && (
          <View style={styles.permissionCard}>
            <AlertCircle size={20} color={ColorTokens.deepBerry} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.permissionTitle}>Photo access needed</Text>
              <Text style={styles.permissionSub}>
                GlowVAI needs access to your photo gallery to choose an existing image.
              </Text>
              <TouchableOpacity
                style={styles.settingsBtnInline}
                onPress={() => Linking.openSettings()}
                activeOpacity={0.8}
              >
                <Text style={styles.settingsBtnText}>Open Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ILLUSTRATION / SELECTED PREVIEW CARD */}
        <View style={styles.illustrationCard}>
          <View style={styles.illusCircleBg} />

          {selectedUri ? (
            <View style={styles.photoFrame}>
              <Image source={{ uri: selectedUri }} style={styles.frameImage} resizeMode="cover" />
            </View>
          ) : (
            <View style={styles.emptyFrame}>
              <ImageIcon size={48} color={ColorTokens.deepBerry} />
              <Text style={styles.emptyFrameText}>Tap below to pick a photo</Text>
            </View>
          )}
        </View>

        {/* HEADLINE */}
        <Text style={styles.headline}>Already have a photo?</Text>
        <Text style={styles.subtitle}>
          Choose a front-facing image with clear lighting for an accurate cosmetic skin assessment.
        </Text>

        {/* TIPS */}
        <Text style={styles.sectionTitle}>PHOTO QUALITY TIPS</Text>
        <View style={styles.tipsGrid}>
          <View style={styles.tipCard}>
            <UserCheck size={18} color={ColorTokens.deepBerry} />
            <Text style={styles.tipText}>One face only</Text>
          </View>
          <View style={styles.tipCard}>
            <Glasses size={18} color={ColorTokens.plum} />
            <Text style={styles.tipText}>No sunglasses</Text>
          </View>
          <View style={styles.tipCard}>
            <Sun size={18} color={ColorTokens.coral} />
            <Text style={styles.tipText}>Bright even light</Text>
          </View>
          <View style={styles.tipCard}>
            <Wand2 size={18} color={ColorTokens.cobaltBlue} />
            <Text style={styles.tipText}>No heavy filter</Text>
          </View>
        </View>

        {/* PRIVACY NOTE */}
        <View style={styles.privacyCard}>
          <ShieldCheck size={16} color={ColorTokens.plum} />
          <Text style={styles.privacyText}>Your photo is used only for this skin assessment.</Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTIONS */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handlePickFromGallery}
          activeOpacity={0.9}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <ImageIcon size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.primaryBtnText}>Choose from Gallery</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={handleOpenCamera} activeOpacity={0.8}>
          <Camera size={16} color={ColorTokens.deepBerry} style={{ marginRight: 6 }} />
          <Text style={styles.secondaryBtnText}>Open Camera</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ColorTokens.warmIvory },
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  content: { flex: 1 },
  contentPadding: { padding: 18 },
  permissionCard: {
    flexDirection: 'row',
    backgroundColor: ColorTokens.softCoral,
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(242, 127, 120, 0.4)',
  },
  permissionTitle: { fontSize: 15, fontWeight: '800', color: ColorTokens.deepBerry },
  permissionSub: { fontSize: 12, color: ColorTokens.text, marginTop: 2, marginBottom: 8 },
  settingsBtnInline: {
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  settingsBtnText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  illustrationCard: {
    backgroundColor: ColorTokens.softCream,
    borderRadius: 24,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  illusCircleBg: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: ColorTokens.softCoral,
    opacity: 0.25,
  },
  photoFrame: {
    width: 110,
    height: 140,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: ColorTokens.deepBerry,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  frameImage: { width: '100%', height: '100%' },
  emptyFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyFrameText: { fontSize: 13, fontWeight: '600', color: ColorTokens.mutedText, textAlign: 'center' },
  headline: { fontSize: 24, fontWeight: '800', color: ColorTokens.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: ColorTokens.mutedText, lineHeight: 20, marginBottom: 20 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
    marginBottom: 10,
  },
  tipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  tipCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 8,
  },
  tipText: { fontSize: 12, fontWeight: '700', color: ColorTokens.text },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.lavender,
    padding: 12,
    borderRadius: 14,
    gap: 8,
  },
  privacyText: { fontSize: 12, fontWeight: '600', color: ColorTokens.plum, flex: 1 },
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
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
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
  secondaryBtnText: { fontSize: 14, fontWeight: '700', color: ColorTokens.deepBerry },
});
